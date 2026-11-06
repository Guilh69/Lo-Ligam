"""Décomposition d'une photo en plans de profondeur (06-11, essai « Profondeur »).
Profondeur : Depth Anything V2 Small (ONNX). Plans : 4 bandes de profondeur ; chaque plan garde
ses pixels et reconstitue, par diffusion (push-pull), ce que cachent les plans plus proches.
Sortie : app/static/ensag/prigondor/<clau>-p<k>.webp (avec transparence), <clau>-prigondor.png (carte) + <clau>.json (seuils,
profondeur moyenne de chaque plan) + planche de contrôle dans Téléchargements.
Modèle (99 Mo, hors Git) : Documents/6_Projectes/Lo_Ligam_hors-git/outils/prigondor/model.onnx
(Depth Anything V2 Small, licence Apache 2.0). Dépendances : numpy, pillow, onnxruntime.
Usage (depuis la racine du dépôt) : py outils/prigondor/plans.py clau1 clau2 ...
La page d'essai : app/src/routes/ensag/prigondor/+page.svelte (cahier §11, 2026-11-06)."""
import json, re, sys, pathlib
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ICI = pathlib.Path(__file__).parent
W = ICI.parents[1] / 'app'
MODELE = pathlib.Path.home() / 'Documents' / '6_Projectes' / 'Lo_Ligam_hors-git' / 'outils' / 'prigondor' / 'model.onnx'
D = W / 'static' / 'apren' / 'paisatges'
SORT = W / 'static' / 'ensag' / 'prigondor'
SORT.mkdir(parents=True, exist_ok=True)
js = (W / 'src' / 'lib' / 'paisatges' / 'paisatges.js').read_text(encoding='utf-8')
AMPLES = {m.group(1): [int(a) for a in m.group(2).split(',')] for m in re.finditer(r"clau: '([a-z-]+)',[\s\S]*?amples: \[([\d, ]+)\]", js)}
ses = ort.InferenceSession(str(MODELE), providers=['CPUExecutionProvider'])
NOM = ses.get_inputs()[0].name
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
LONG = 1600  # grand côté des plans


def profondor(im):
    w, h = im.size
    if w >= h:
        H = 518; Wd = round(518 * w / h / 14) * 14
    else:
        Wd = 518; H = round(518 * h / w / 14) * 14
    x = np.asarray(im.resize((Wd, H), Image.BICUBIC), dtype=np.float32) / 255.0
    y = ses.run(None, {NOM: ((x - MEAN) / STD).transpose(2, 0, 1)[None]})[0][0]
    lo, hi = np.percentile(y, 1), np.percentile(y, 99.5)
    y = np.clip((y - lo) / (hi - lo), 0, 1)
    p = Image.fromarray((y * 255).astype(np.uint8), 'L').resize((w, h), Image.BICUBIC).filter(ImageFilter.MedianFilter(5))
    return np.asarray(p, dtype=np.float32) / 255.0


def pushpull(rgb, valid):
    """Remplit les pixels non valides par diffusion depuis les valides (pyramide)."""
    niv = []
    c = rgb * valid[..., None]
    w = valid.astype(np.float32)
    while w.shape[0] > 1 or w.shape[1] > 1:  # jusqu'à un seul pixel : jamais de case vide
        niv.append((c, w))
        h2, w2 = (w.shape[0] + 1) // 2, (w.shape[1] + 1) // 2
        cp = np.zeros((h2 * 2, w2 * 2, 3), np.float32); cp[:c.shape[0], :c.shape[1]] = c
        wp = np.zeros((h2 * 2, w2 * 2), np.float32); wp[:w.shape[0], :w.shape[1]] = w
        c = cp.reshape(h2, 2, w2, 2, 3).sum((1, 3))
        w = wp.reshape(h2, 2, w2, 2).sum((1, 3))
    f = c / np.maximum(w, 1e-6)[..., None]
    for c, w in reversed(niv):
        up = np.asarray(Image.fromarray(np.clip(f, 0, 255).astype(np.uint8)).resize((w.shape[1], w.shape[0]), Image.BILINEAR), np.float32)
        a = np.minimum(w, 1)[..., None]
        f = a * (c / np.maximum(w, 1e-6)[..., None]) + (1 - a) * up
    return f


def plus_proche(valid):
    """Pour chaque pixel, coordonnées du pixel valide le plus proche (inondation par sauts)."""
    h, w = valid.shape
    yy, xx = np.mgrid[0:h, 0:w]
    sy = np.where(valid, yy, -1).astype(np.int32); sx = np.where(valid, xx, -1).astype(np.int32)
    pas = 1 << int(np.ceil(np.log2(max(h, w))))
    while pas >= 1:
        for dy in (-pas, 0, pas):
            for dx in (-pas, 0, pas):
                if dy == 0 and dx == 0:
                    continue
                if abs(dy) >= h or abs(dx) >= w:
                    continue
                dsty = slice(max(0, -dy), h - max(0, dy)); srcy = slice(max(0, dy), h + min(0, dy))
                dstx = slice(max(0, -dx), w - max(0, dx)); srcx = slice(max(0, dx), w + min(0, dx))
                cy = np.full((h, w), -1, np.int32); cx = np.full((h, w), -1, np.int32)
                cy[dsty, dstx] = sy[srcy, srcx]
                cx[dsty, dstx] = sx[srcy, srcx]
                ok = cy >= 0
                d_nou = np.where(ok, (cy - yy).astype(np.int64) ** 2 + (cx - xx).astype(np.int64) ** 2, 1 << 60)
                d_ara = np.where(sy >= 0, (sy - yy).astype(np.int64) ** 2 + (sx - xx).astype(np.int64) ** 2, 1 << 60)
                mill = d_nou < d_ara
                sy = np.where(mill, cy, sy); sx = np.where(mill, cx, sx)
        pas //= 2
    return sy, sx


def miralh(rgb, valid, pp):
    """Ce qui est caché : la texture voisine reprise en miroir du bord ; sinon le remplissage lisse."""
    h, w = valid.shape
    sy, sx = plus_proche(valid)
    yy, xx = np.mgrid[0:h, 0:w]
    ry = np.clip(2 * sy - yy, 0, h - 1); rx = np.clip(2 * sx - xx, 0, w - 1)
    bon = valid[ry, rx]
    f = np.where(bon[..., None], rgb[ry, rx], pp)
    # couture adoucie entre miroir et remplissage lisse
    m = Image.fromarray((bon * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    a = (np.asarray(m, np.float32) / 255)[..., None]
    return a * f + (1 - a) * pp


def seuils(d):
    # quatre plans : les bornes aux quantiles de la profondeur, un peu tirées vers le proche
    # k-moyennes sur une dimension : quatre groupes de distance, bornes à mi-chemin
    v = d[::4, ::4].ravel()
    c = np.quantile(v, [0.1, 0.4, 0.7, 0.95])
    for _ in range(30):
        g = np.argmin(np.abs(v[:, None] - c[None]), axis=1)
        c = np.array([v[g == i].mean() if (g == i).any() else c[i] for i in range(4)])
    c = np.sort(c)
    return [float((c[i] + c[i + 1]) / 2) for i in range(3)]


planche = []
for clau in sys.argv[1:]:
    im = Image.open(D / f'{clau}-{AMPLES[clau][-1]}.webp').convert('RGB')
    if max(im.size) > LONG:
        r = LONG / max(im.size)
        im = im.resize((round(im.size[0] * r), round(im.size[1] * r)), Image.LANCZOS)
    rgb = np.asarray(im, np.float32)
    d = profondor(im)
    # la carte de profondeur, 512 px de large, lue par la page pour savoir à quel plan est un mot
    carta = Image.fromarray((d * 255).astype(np.uint8), 'L').resize((512, round(512 * im.size[1] / im.size[0])), Image.BICUBIC)
    carta.filter(ImageFilter.GaussianBlur(1.2)).save(SORT / f'{clau}-prigondor.png', optimize=True)
    t = seuils(d)
    bornes = [0.0] + t + [1.01]
    info = {'clau': clau, 'l': im.size[0], 'h': im.size[1], 'seuils': t, 'plans': []}
    vigs = []
    for k in range(4):
        dedins = d >= bornes[k]  # ce plan et tout ce qui est devant
        banda = dedins & (d < bornes[k + 1])
        # modèle du remplissage : ce plan et tout ce qui est derrière (le vrai fond voisin),
        # rogné pour ne pas reprendre les bords mêlés (pixels moitié feuille, moitié fond)
        fons = d < bornes[k + 1]
        sur = np.asarray(Image.fromarray((fons * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))) > 127
        if sur.sum() < 50:
            sur = fons
        couleur = miralh(rgb, sur, pushpull(rgb, sur))
        couleur = np.where(banda[..., None], rgb, couleur)
        if k == 0:
            alpha = np.ones(d.shape, np.float32)
        else:
            # bord adouci, élargi d'un ou deux pixels pour couvrir le plan de derrière
            m = Image.fromarray((dedins * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
            alpha = np.asarray(m, np.float32) / 255
            # derrière les plans plus proches, ce plan ne se prolonge que sur une bande de R pixels,
            # en fondu : plus loin, ce sont les plans du fond (complets) qui se montrent
            R = 0.05 * max(d.shape)
            by, bx = plus_proche(banda)
            yy, xx = np.mgrid[0:d.shape[0], 0:d.shape[1]]
            dist = np.sqrt((by - yy).astype(np.float32) ** 2 + (bx - xx).astype(np.float32) ** 2)
            alpha = np.minimum(alpha, np.clip((R - dist) / (R / 2), 0, 1))
        rgba = np.dstack([np.clip(couleur, 0, 255), alpha * 255]).astype(np.uint8)
        out = Image.fromarray(rgba, 'RGBA')
        f = SORT / f'{clau}-p{k}.webp'
        out.save(f, 'WEBP', quality=72, method=6, alpha_quality=80)
        moy = float(d[banda].mean()) if banda.any() else (bornes[k] + bornes[k + 1]) / 2
        info['plans'].append({'k': k, 'prof': round(moy, 3), 'octets': f.stat().st_size})
        v = out.copy(); v.thumbnail((360, 360))
        fond = Image.new('RGB', v.size, (255, 0, 255)); fond.paste(v, (0, 0), v)
        vigs.append(fond)
    (SORT / f'{clau}.json').write_text(json.dumps(info), encoding='utf-8')
    print(clau, im.size, t, [p['octets'] for p in info['plans']])
    lw = sum(v.size[0] + 6 for v in vigs)
    pl = Image.new('RGB', (lw, vigs[0].size[1]), 'white')
    x = 0
    for v in vigs:
        pl.paste(v, (x, 0)); x += v.size[0] + 6
    planche.append(pl)
Wt = max(p.size[0] for p in planche)
P = Image.new('RGB', (Wt, sum(p.size[1] + 6 for p in planche)), 'white')
y = 0
for p in planche:
    P.paste(p, (0, y)); y += p.size[1] + 6
P.save(pathlib.Path.home() / 'Downloads' / 'planche-plans.jpg', quality=78)  # planche de contrôle, hors du dépôt
