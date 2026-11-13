#!/usr/bin/env python3
"""
talhar.py : retouche réaliste d'une zone de texte dans une photo, avec le moins de pixels changés possible.

Principe (pour Lo Ligam, rubrique S'imagina) : pour chaque zone (plaque de rue, étiquette, enseigne plate),
l'outil ne produit pas une nouvelle photo mais une petite **retouche** (WebP avec transparence) qui ne couvre
que les pixels à changer : les anciennes lettres (effacées, fond reconstruit avec le même grain) et les
nouvelles. La photo de base reste inchangée, octet pour octet ; le site pose la retouche dessus et la bascule
français / occitan n'est qu'un fondu de cette retouche.

Étapes, par zone :
 1. redresser la zone (quatre coins relevés à l'œil sur la photo) ;
 2. repérer les anciennes lettres (écart au fond de la plaque, taches et rouille laissées en place) ;
 3. reconstruire le fond là où elles étaient (lumière de la plaque + grain mesuré alentour) ;
 4. écrire le nouveau texte dans la plaque redressée : même hauteur de lettres, même centre, même
    espacement relatif, même couleur, même flou de bord que l'original ;
 5. remettre en perspective, ajouter lumière et grain, ne garder que les pixels qui ont changé.

Usage : python.exe -X utf8 talhar.py fiche.json --sortie dossier [--langue oc|fr] [--apercu]
Seuls Pillow et numpy sont nécessaires.
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

POLICES = [r'C:\Windows\Fonts', os.path.join(os.path.dirname(__file__), 'polices')]
SS = 2.0  # sur-échantillonnage de la plaque redressée


# ------------------------------------------------------------------ outils d'image
def coeffs(sortie, source):
    """Coefficients PIL PERSPECTIVE : un point de `sortie` va chercher son pixel dans `source`."""
    m = []
    for (x, y), (X, Y) in zip(sortie, source):
        m.append([x, y, 1, 0, 0, 0, -X * x, -X * y])
        m.append([0, 0, 0, x, y, 1, -Y * x, -Y * y])
    return np.linalg.solve(np.array(m, float), np.array(source, float).reshape(8))


def flou(a, s):
    """Flou gaussien d'un tableau 2D ou 3D (par transformée de Fourier, sans scipy)."""
    if s <= 0:
        return a
    if a.ndim == 3:
        return np.stack([flou(a[..., k], s) for k in range(a.shape[2])], -1)
    h, w = a.shape
    p = int(4 * s) + 2
    q = np.pad(a, p, mode='reflect')
    fy = np.fft.fftfreq(q.shape[0])
    fx = np.fft.rfftfreq(q.shape[1])
    g = np.exp(-2 * np.pi ** 2 * s ** 2 * (fy[:, None] ** 2 + fx[None, :] ** 2))
    r = np.fft.irfft2(np.fft.rfft2(q) * g, s=q.shape)
    return r[p:p + h, p:p + w]


def morph(m, k, op):
    """Dilatation ('max') ou érosion ('min') d'un masque 0..1 par un carré de côté k (impair)."""
    from PIL import ImageFilter
    if k <= 1:
        return m
    k = k | 1
    im = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8))
    im = im.filter(ImageFilter.MaxFilter(k) if op == 'max' else ImageFilter.MinFilter(k))
    return np.asarray(im, np.float32) / 255.0


def polygone(taille, pts):
    im = Image.new('L', taille, 0)
    ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255)
    return np.asarray(im, np.float32) / 255.0


def police(nom, taille, axes=None):
    for d in POLICES:
        p = os.path.join(d, nom)
        if os.path.exists(p):
            f = ImageFont.truetype(p, int(round(taille)))
            if axes:
                try:
                    f.set_variation_by_axes(axes)
                except Exception as e:  # police sans axes
                    print('  (axes ignorés :', e, ')')
            return f
    raise SystemExit(f'Police introuvable : {nom}')


def hauteur_capitale(f):
    b = f.getbbox('H')
    return b[3] - b[1]


def mesurer(f, txt, suivi, chasse=1.0):
    """Largeur d'une ligne : avances des lettres + espacement (en cadratin), le tout resserré par `chasse`."""
    return (sum(f.getlength(ch) + suivi * f.size for ch in txt) - suivi * f.size) * chasse


def poser_texte(masque, txt, f, suivi, x, yref, chasse=1.0, gigue=0.0, rng=None):
    """Dessine une ligne lettre à lettre dans un masque. chasse < 1 : lettres étroites (les plaques anciennes ont des
    capitales hautes et serrées que les polices de l'ordinateur n'ont pas) ; gigue : la main du peintre, chaque
    lettre un rien plus haute, plus large ou penchée que sa voisine."""
    if chasse == 1.0 and not gigue:
        d = ImageDraw.Draw(masque)
        for ch in txt:
            d.text((x, yref), ch, font=f, fill=255)
            x += f.getlength(ch) + suivi * f.size
        return
    pad = int(f.size * 0.3) + 2
    for ch in txt:
        av = f.getlength(ch)
        if ch.strip():
            t = Image.new('L', (int(av) + 2 * pad, int(f.size * 1.9) + 2 * pad), 0)
            ImageDraw.Draw(t).text((pad, pad), ch, font=f, fill=255)
            kx, dy = chasse, 0.0
            if gigue and rng is not None:
                kx *= 1 + gigue * float(rng.uniform(-1, 1))
                dy = gigue * f.size * 0.6 * float(rng.uniform(-1, 1))
                t = t.rotate(gigue * 28 * float(rng.uniform(-1, 1)), resample=Image.BICUBIC)
            t = t.resize((max(1, int(round(t.width * kx))), t.height), Image.LANCZOS)
            masque.paste(255, (int(round(x - pad * kx)), int(round(yref - pad + dy))), t)
        x += (av + suivi * f.size) * chasse


def rugueux(m, rng, sigma, force):
    """Bords irréguliers (pinceau, émail qui s'écaille) : le masque est flouté, bruité, puis reseuillé. Les angles
    s'arrondissent et le contour ondule, comme un trait fait à la main ou usé."""
    a = flou(m.astype(np.float32), sigma)
    n = flou(rng.standard_normal(m.shape).astype(np.float32), sigma * 1.4)
    n = n / max(float(n.std()), 1e-6)
    pres_du_bord = np.clip(4 * a * (1 - a), 0, 1)      # le bruit ne joue qu'au contour, jamais en plein fond
    return np.clip((a + force * n * pres_du_bord - 0.5) * max(1.0, 2.1 * sigma) + 0.5, 0, 1)


def adoucir_couleur(comp, A, s):
    """Un appareil photo enregistre la couleur moins finement que la lumière : sur ce qu'on ajoute, la couleur est
    floutée davantage que le dessin (sinon un rouge trop net sur du blanc signe le montage)."""
    y = comp.mean(-1, keepdims=True)
    c = comp - y
    w = np.clip(A, 0, 1)[..., None]
    return y + c * (1 - w) + flou(c, s) * w


# ------------------------------------------------------------------ cœur
def traiter_zone(img, z, langue):
    """img : PIL RGB (déjà à l'échelle d'export). Renvoie (patch RGBA PIL, boîte (x0,y0,x1,y1) en pixels d'export, aperçu np)."""
    quad = np.array(z['quad'], float)
    x0 = int(max(0, np.floor(quad[:, 0].min()) - 12))
    y0 = int(max(0, np.floor(quad[:, 1].min()) - 12))
    x1 = int(min(img.width, np.ceil(quad[:, 0].max()) + 12))
    y1 = int(min(img.height, np.ceil(quad[:, 1].max()) + 12))
    crop = img.crop((x0, y0, x1, y1))
    q = quad - [x0, y0]
    arr = np.asarray(crop, np.float32)
    h, w = arr.shape[:2]

    # ---- 1. région de travail (le quadrilatère, resserré) et couleur du fond
    R = polygone((w, h), q)
    inset = z.get('retrait', 0)
    if inset:
        R = morph(R, int(2 * inset + 1), 'min')
    bg = np.array([np.median(arr[..., c][R > 0.5]) for c in range(3)])

    # ---- 2. anciennes lettres : écart au fond, taches laissées en place
    d = np.sqrt(((flou(arr, 0.6) - bg) ** 2).sum(-1))
    d = d * (R > 0.5)
    vals = d[R > 0.5]
    # seuil d'Otsu sur l'écart
    hist, edges = np.histogram(vals, bins=64)
    tot = hist.sum(); sb = 0.0; wb = 0; best = (0, 1); m_all = (hist * (edges[:-1] + edges[1:]) / 2).sum()
    for i in range(64):
        wb += hist[i]
        if wb == 0 or wb == tot:
            continue
        sb += hist[i] * (edges[i] + edges[i + 1]) / 2
        mb = sb / wb; mf = (m_all - sb) / (tot - wb)
        var = wb * (tot - wb) * (mb - mf) ** 2
        if var > best[0]:
            best = (var, (edges[i] + edges[i + 1]) / 2)
    seuil = z.get('seuil', best[1] * 0.55)
    brut = (d > seuil).astype(np.float32)
    # rectangles à laisser tels quels (pelage de l'émail, tache, autre inscription), en pixels d'export
    for rx0, ry0, rx1, ry1 in z.get('ignorer', []):
        brut[max(0, int(ry0 - y0)):max(0, int(ry1 - y0)), max(0, int(rx0 - x0)):max(0, int(rx1 - x0))] = 0
    hz =float(q[:, 1].max() - q[:, 1].min())
    k_ouv = int(z.get('ouverture', max(3, round(0.012 * hz) | 1)))
    ouvert = morph(morph(brut, k_ouv, 'min'), k_ouv, 'max')
    # reconstruction géodésique : on ne regagne que ce qui touche une lettre franche (empattements, bords),
    # jamais les taches voisines qui n'y sont pas reliées
    lettres = ouvert
    for _ in range(int(z.get('reconstruction', k_ouv + 4))):
        lettres = np.minimum(morph(lettres, 3, 'max'), brut)
    if z.get('garder_taches', True) is False:
        lettres = brut
    elarg = int(z.get('elargi', max(2, round(0.008 * hz))))
    vieux = np.clip(morph(lettres, 2 * elarg + 1, 'max'), 0, 1) * (R > 0.5)
    vieux_doux = flou(vieux, 0.8)

    # ---- 3. fond reconstruit : lumière (polynôme) + résidu lissé + grain
    connu = (R > 0.5) & (morph(vieux, 2 * elarg + 3, 'max') < 0.5)
    ys, xs = np.mgrid[0:h, 0:w]
    xn = (xs - w / 2) / w; yn = (ys - h / 2) / h
    A = np.stack([np.ones_like(xn), xn, yn, xn * xn, xn * yn, yn * yn], -1)
    idx = np.flatnonzero(connu.ravel())
    sub = idx[:: max(1, len(idx) // 20000)]
    L = np.zeros_like(arr)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A.reshape(-1, 6)[sub], arr[..., c].ravel()[sub], rcond=None)
        L[..., c] = (A.reshape(-1, 6) @ coef).reshape(h, w)
    res = (arr - L) * connu[..., None]
    wk = connu.astype(np.float32)
    rempli = np.zeros_like(res)
    poids = np.zeros_like(wk)
    for s in (2, 4, 8, 16, 32):
        num = flou(res, s); den = flou(wk, s)[..., None]
        nouveau = (poids == 0)[..., None] & (den > 0.12)
        rempli = np.where(nouveau, num / np.maximum(den, 1e-4), rempli)
        poids = np.where(nouveau[..., 0], 1, poids)
    fond_lisse = L + np.where(connu[..., None], 0, rempli)
    # grain mesuré sur les pixels connus
    haute = arr - flou(arr, 1.6)
    sig = np.array([haute[..., c][connu].std() for c in range(3)])
    rng = np.random.default_rng(z.get('graine', 7))
    bruit = flou(rng.standard_normal((h, w, 3)).astype(np.float32), z.get('grain_flou', 0.55))
    bruit = bruit / max(bruit.std(), 1e-6) * sig
    fond = fond_lisse + bruit
    apres_efface = arr * (1 - vieux_doux[..., None]) + fond * vieux_doux[..., None]

    # ---- 4. nouvelle écriture dans la plaque redressée
    top = np.hypot(*(q[1] - q[0])); bot = np.hypot(*(q[2] - q[3]))
    lef = np.hypot(*(q[3] - q[0])); rig = np.hypot(*(q[2] - q[1]))
    FW = int(round((top + bot) / 2 * SS)); FH = int(round((lef + rig) / 2 * SS))
    plat = [(0, 0), (FW, 0), (FW, FH), (0, FH)]
    vers_plat = coeffs(plat, [tuple(p) for p in q])           # plat -> photo (pour redresser)
    vers_photo = coeffs([tuple(p) for p in q], plat)          # photo -> plat (pour remettre en perspective)
    m_plat = np.asarray(Image.fromarray((vieux * 255).astype(np.uint8)).transform((FW, FH), Image.PERSPECTIVE, vers_plat, Image.BILINEAR), np.float32) / 255.0
    r_plat = np.asarray(Image.fromarray((R * 255).astype(np.uint8)).transform((FW, FH), Image.PERSPECTIVE, vers_plat, Image.BILINEAR), np.float32) / 255.0

    # lignes de l'ancien texte, de haut en bas
    lignes_z = z['lignes']
    rows = (m_plat > 0.5).sum(1)
    on = rows > max(2, 0.004 * FW)
    bandes = []; start = None; vide = 0; tol = max(4, int(0.03 * FH))
    for y in range(FH):
        if on[y]:
            if start is None:
                start = y
            vide = 0; fin = y
        elif start is not None:
            vide += 1
            if vide > tol:
                bandes.append((start, fin)); start = None
    if start is not None:
        bandes.append((start, fin))
    if len(bandes) != len(lignes_z):
        raise SystemExit(f"Zone {z['id']} : {len(bandes)} lignes d'ancien texte repérées {bandes}, {len(lignes_z)} dans la fiche.")

    # couleur des lettres (cœur des anciennes lettres) et ombre éventuelle
    coeur = morph(lettres, 3, 'min') > 0.5
    coeur &= (R > 0.5)
    if coeur.any():
        lum_c = arr.mean(-1)[coeur]
        clair = lum_c.mean() > arr.mean(-1)[connu].mean()
        # la vraie couleur de la lettre : les pixels les plus francs de son cœur, pas ses bords adoucis
        gardes = lum_c >= np.percentile(lum_c, 55) if clair else lum_c <= np.percentile(lum_c, 45)
        if z.get('teinte_lettres') == 'mediane':   # lettres fines ou un peu floues : la teinte moyenne, pas la plus franche
            gardes = (lum_c >= np.percentile(lum_c, 25)) & (lum_c <= np.percentile(lum_c, 75))
        fg = np.array([arr[..., c][coeur][gardes].mean() for c in range(3)])
    else:
        fg = bg * 0.3
    if 'couleur' in z:
        fg = np.array(z['couleur'], float)
    f_police = z.get('police', 'arialn.ttf'); axes = z.get('axes')
    alpha_t = Image.new('L', (FW, FH), 0)
    alpha_o = Image.new('L', (FW, FH), 0)
    dtext = ImageDraw.Draw(alpha_t)
    dom = z.get('ombre')  # [dx, dy] en pixels de photo
    ligne_infos = []
    lim_l = np.flatnonzero(r_plat.max(0) > 0.5); marge = z.get('marge_largeur', 0.05) * FW
    xmin, xmax = (lim_l.min() + marge, lim_l.max() - marge) if lim_l.size else (0, FW)
    for b, lz in zip(bandes, lignes_z):
        y0b, y1b = b
        band = m_plat[y0b:y1b + 1] > 0.5
        cols = np.flatnonzero(band.sum(0) >= max(1, 0.15 * (y1b - y0b)))
        xa, xb = cols.min(), cols.max()
        cap = (y1b - y0b + 1) * lz.get('echelle', 1.0)
        taille = cap
        f = police(f_police, taille, axes)
        for _ in range(2):  # recale la taille pour que la hauteur de 'H' vaille la hauteur de la bande
            taille *= cap / max(hauteur_capitale(f), 1)
            f = police(f_police, taille, axes)
        texte_fr = lz.get('fr', ''); texte_nv = lz[langue]
        if not texte_nv:      # ligne seulement effacée (rien à écrire à la place)
            ligne_infos.append(('', 0.0, 1.0))
            continue
        chasse = lz.get('chasse', z.get('chasse', 1.0))
        nat_fr = sum(f.getlength(ch) for ch in texte_fr) * chasse
        n_fr = max(len(texte_fr) - 1, 1)
        suivi = lz.get('suivi')
        if suivi is None:
            suivi = ((xb - xa) - nat_fr) / n_fr / taille / chasse if texte_fr else 0.1
            suivi = float(np.clip(suivi, -0.04, 0.45))
        lg = mesurer(f, texte_nv, suivi, chasse)
        reduit = 1.0
        suivi_min = z.get('suivi_min', 0.04)
        if lg > (xmax - xmin) and suivi > suivi_min:
            # d'abord resserrer l'espacement (une plaque réelle le ferait), ensuite seulement réduire la taille
            suivi = max(suivi_min, suivi - (lg - (xmax - xmin)) / chasse / max(len(texte_nv) - 1, 1) / taille)
            lg = mesurer(f, texte_nv, suivi, chasse)
        if lg > (xmax - xmin):
            reduit = (xmax - xmin) / lg
            taille *= reduit
            f = police(f_police, taille, axes)
            lg = mesurer(f, texte_nv, suivi, chasse)
        cx = (xa + xb) / 2 if lz.get('centre', True) else xa + lg / 2
        cy = (y0b + y1b) / 2 + lz.get('dy', 0) * FH      # dy : décaler une ligne (fraction de la hauteur de la zone)
        # ancrage vertical : le centre des capitales
        bb = f.getbbox('H')
        yref = cy - (bb[1] + bb[3]) / 2
        poser_texte(alpha_t, texte_nv, f, suivi, cx - lg / 2, yref, chasse)
        ligne_infos.append((texte_nv, round(float(taille) / SS, 1), round(float(reduit), 2)))
        if z.get('debug'):
            print('   ligne', texte_nv, 'ancien', (int(xa), int(xb), y0b, y1b), 'largeur', int(lg), 'dispo', (int(xmin), int(xmax)), 'FW', FW)
    # remise en perspective
    def vers_crop(im):
        return np.asarray(im.transform((w, h), Image.PERSPECTIVE, vers_photo, Image.BICUBIC), np.float32) / 255.0
    flou_b = z.get('flou_bord')
    if flou_b is None:
        gy, gx = np.gradient(flou(arr.mean(-1), 0.8))
        gm = np.hypot(gx, gy)
        bord = (morph(vieux, 7, 'max') > 0.5) & (morph(vieux, 7, 'min') < 0.5)
        gmax = np.percentile(gm[bord], 98) if bord.any() else 20
        contraste = abs(float(arr.mean(-1)[coeur].mean()) - float(arr.mean(-1)[connu].mean())) if coeur.any() else 100
        flou_b = float(np.clip(contraste / max(gmax, 1) / 2.56, 0.5, 2.2))
    # usure des lettres neuves : contour un rien irrégulier, petits éclats où le fond reparaît (une lettre de
    # quarante ans n'a ni bords au cordeau ni aplat parfait)
    us = z.get('usure_lettres', 0.0)
    if us:
        rng_u = np.random.default_rng(z.get('graine', 7) + 3)
        m = np.asarray(alpha_t, np.float32) / 255.0
        # très peu : une lettre d'émail reste nette, elle perd seulement ses angles vifs et quelques éclats
        m = rugueux(m, rng_u, max(0.8, 0.0025 * FH), 0.04 + 0.10 * us)
        ecl = flou(rng_u.standard_normal(m.shape).astype(np.float32), 0.6 * SS)
        ecl = ecl / max(float(ecl.std()), 1e-6)
        m = m * np.clip((3.1 - 0.5 * us - ecl) * 3.0, 0, 1)         # éclats rares (moins d'un pixel sur cinq cents)
        alpha_t = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8))
    a_t = flou(vers_crop(alpha_t), flou_b) * (R > 0.5)
    # la lumière de la plaque (luminance seule, adoucie) module la couleur des lettres
    lum = L.mean(-1)
    ratio = np.clip(lum / max(float(lum[R > 0.5].mean()), 1.0), 0.6, 1.4) ** z.get('gamma_lumiere', 0.6)
    couleur_txt = fg[None, None, :] * ratio[..., None] + bruit * 0.6
    if us:   # l'aplat n'est pas uniforme : nuances à l'échelle de la lettre
        nu = flou(rng_u.standard_normal((h, w)).astype(np.float32), max(2.0, 0.05 * hz))
        couleur_txt = couleur_txt * (1 + 0.05 * us * nu / max(float(np.abs(nu).max()), 1e-6))[..., None]
    lis = z.get('lisere', 0.0)
    if lis:  # liseré sombre au pied des lettres d'émail (elles ont une épaisseur)
        bord_l = np.clip(flou(a_t, 1.5) - a_t, 0, 1)
        apres_efface = apres_efface * (1 - lis * 2.0 * bord_l[..., None])
    comp = apres_efface * (1 - a_t[..., None]) + couleur_txt * a_t[..., None]
    if dom:
        sh = np.roll(np.roll(a_t, int(round(dom[1])), 0), int(round(dom[0])), 1)
        lum = z.get('ombre_couleur', None)
        sc = np.array(lum, float) if lum else np.minimum(bg * 1.12, 255)
        sa = sh * (1 - a_t) * z.get('ombre_force', 0.7)
        comp = comp * (1 - sa[..., None]) + sc[None, None, :] * sa[..., None]
    comp = np.clip(comp, 0, 255)

    # ---- 5. ne garder que les pixels qui changent
    a_nv = np.maximum(a_t, np.roll(np.roll(a_t, int(round(dom[1])), 0), int(round(dom[0])), 1) if dom else 0)
    A_ = np.clip(np.maximum(vieux_doux, a_nv), 0, 1)
    if lis:
        A_ = np.clip(np.maximum(A_, 6.0 * lis * bord_l), 0, 1)
    A_[A_ < 0.02] = 0
    P = np.where(A_[..., None] > 0, (comp - arr * (1 - A_[..., None])) / np.maximum(A_[..., None], 1e-3), arr)
    P = np.clip(P, 0, 255)
    ys_, xs_ = np.nonzero(A_ > 0)
    bx0, bx1, by0, by1 = xs_.min(), xs_.max() + 1, ys_.min(), ys_.max() + 1
    rgba = np.dstack([P, A_ * 255]).astype(np.uint8)[by0:by1, bx0:bx1]
    patch = Image.fromarray(rgba, 'RGBA')
    boite = (x0 + int(bx0), y0 + int(by0), x0 + int(bx1), y0 + int(by1))
    info = {'lignes': ligne_infos, 'flou_bord': round(flou_b, 2), 'seuil': round(float(seuil), 1), 'fond': [int(v) for v in bg],
            'texte': [int(v) for v in fg], 'pixels_changes': int((A_ > 0).sum()), 'pixels_zone': int((R > 0.5).sum())}
    return patch, boite, info


# ------------------------------------------------------------------ le plan du mur, mesuré sur la photo
# Un quadrilatère tracé à l'œil ne trompe personne (Romain, 12-11 : « la perspective n'est pas convaincante »).
# Méthode : on désigne sur la photo quelques arêtes vraiment horizontales et vraiment verticales du mur (cordon,
# ferrures, bords de volets, garde-corps) ; l'outil les recale au pixel près sur l'arête réelle, en tire les deux
# points de fuite, et avec la focale de l'appareil (lue dans la photo) retrouve l'orientation du mur dans l'espace.
# L'élément est alors un vrai rectangle posé sur ce plan, à ses proportions réelles, puis projeté.
def _bilin(a, X, Y):
    X = np.clip(X, 0, a.shape[1] - 1.001); Y = np.clip(Y, 0, a.shape[0] - 1.001)
    x0 = np.floor(X).astype(int); y0 = np.floor(Y).astype(int); fx = X - x0; fy = Y - y0
    return a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x0 + 1] * fx * (1 - fy) + a[y0 + 1, x0] * (1 - fx) * fy + a[y0 + 1, x0 + 1] * fx * fy


def affiner(lum, p, q, rayon=12, n=60):
    """Recale un segment tracé à l'œil sur l'arête réelle voisine. Renvoie (droite a,b,c ; points retenus ; écart moyen en px)."""
    p = np.array(p, float); q = np.array(q, float)
    r = None
    for passe, ray in enumerate((rayon, 5)):
        d = q - p; t = d / np.hypot(*d); nrm = np.array([-t[1], t[0]])
        ss = np.linspace(0.03, 0.97, n); offs = np.arange(-ray, ray + 1)
        pts = p[None, :] + ss[:, None] * d[None, :]
        prof = _bilin(lum, pts[:, 0][:, None] + offs[None, :] * nrm[0], pts[:, 1][:, None] + offs[None, :] * nrm[1])
        g = np.gradient(prof, axis=1)
        gm = g.mean(0); k0 = int(np.argmax(np.abs(gm))); sg = np.sign(gm[k0]) or 1.0
        lo, hi = max(1, k0 - 5), min(len(offs) - 1, k0 + 6)
        kk = lo + np.argmax(sg * g[:, lo:hi], axis=1)
        # sommet au sous-pixel (parabole)
        i = np.arange(n); g0 = sg * g[i, kk - 1]; g1 = sg * g[i, kk]; g2 = sg * g[i, np.minimum(kk + 1, len(offs) - 1)]
        den = g0 - 2 * g1 + g2
        sub = np.where(np.abs(den) > 1e-6, 0.5 * (g0 - g2) / den, 0.0)
        P = pts + (offs[kk] + np.clip(sub, -0.5, 0.5))[:, None] * nrm[None, :]
        for _ in range(3):
            c = P.mean(0); _, _, vt = np.linalg.svd(P - c); dv = vt[0]; nn = np.array([-dv[1], dv[0]])
            r = (P - c) @ nn
            garde = np.abs(r) <= max(0.8, 2.0 * np.median(np.abs(r)))
            if garde.sum() < 8 or garde.all():
                break
            P = P[garde]
        c = P.mean(0); _, _, vt = np.linalg.svd(P - c); dv = vt[0]; nn = np.array([-dv[1], dv[0]])
        r = (P - c) @ nn
        # le segment recalé sert de départ à la passe fine
        proj = (P - c) @ dv
        p, q = c + dv * proj.min(), c + dv * proj.max()
    return np.array([nn[0], nn[1], -(nn @ c)]), (p, q), float(np.sqrt((r ** 2).mean()))


def point_de_fuite(droites, longueurs, cx, cy, s):
    """Point de fuite d'un faisceau de droites (moindres carrés), en coordonnées centrées et réduites (x', y', w')."""
    M = np.zeros((3, 3))
    for (a, b, c), L in zip(droites, longueurs):
        l = np.array([a * s, b * s, a * cx + b * cy + c]); l = l / np.hypot(l[0], l[1])
        M += L * np.outer(l, l)
    w, v = np.linalg.eigh(M)
    return v[:, 0]


def plan_du_mur(img, src_exif, plan, controle=None):
    """Renvoie (f, cx, cy, dh, dv) : focale en pixels, centre, directions 3D horizontale et verticale du mur."""
    from PIL import ImageFilter
    W, H = img.size
    cx, cy = W / 2, H / 2
    f = plan.get('focale_px')
    if not f:
        f35 = None
        try:
            f35 = src_exif.get_ifd(0x8769).get(0xA405)
        except Exception:
            pass
        if not f35:
            raise SystemExit("Pas de focale dans la photo : donner plan.focale_px dans la fiche.")
        f = float(f35) / 43.27 * float(np.hypot(W, H))
    lum = np.asarray(img.convert('L').filter(ImageFilter.GaussianBlur(1.2)), np.float32)
    s = float(np.hypot(W, H)) / 2
    dirs = {}; recales = {}
    for nom in ('horizontales', 'verticales'):
        dr, lg, segs = [], [], []
        for p, q in plan[nom]:
            l, seg, ecart = affiner(lum, p, q, plan.get('rayon', 12))
            dr.append(l); lg.append(float(np.hypot(*(seg[1] - seg[0])))); segs.append((seg, ecart))
        v = point_de_fuite(dr, lg, cx, cy, s)
        d = np.array([v[0] * s, v[1] * s, v[2] * f]); d = d / np.linalg.norm(d)
        dirs[nom] = d; recales[nom] = segs
    dh, dv = dirs['horizontales'], dirs['verticales']
    angle = float(np.degrees(np.arccos(abs(float(dh @ dv)))))
    # le couple orthonormé le plus proche des deux directions mesurées
    U, _, Vt = np.linalg.svd(np.stack([dh, dv], 1), full_matrices=False)
    Q = U @ Vt
    dh, dv = Q[:, 0], Q[:, 1]
    info = {'focale_px': round(f), 'angle_mesure': round(angle, 1),
            'ecarts_px': {k: [round(e, 2) for _, e in v] for k, v in recales.items()}}
    return (f, cx, cy, dh, dv), recales, info


def quad_sur_plan(geo, ancre, largeur_px, proportion):
    """Rectangle réel (proportion = largeur / hauteur) centré sur `ancre`, large de `largeur_px` à l'écran, posé sur le mur."""
    f, cx, cy, dh, dv = geo
    X0 = np.array([(ancre[0] - cx) / f, (ancre[1] - cy) / f, 1.0])

    def proj(X):
        return np.array([f * X[0] / X[2] + cx, f * X[1] / X[2] + cy])
    # sens : dh vers la droite de l'image, dv vers le bas
    if (proj(X0 + 0.01 * dh) - proj(X0))[0] < 0:
        dh = -dh
    if (proj(X0 + 0.01 * dv) - proj(X0))[1] < 0:
        dv = -dv
    Wm = 0.1
    for _ in range(6):
        Wm *= largeur_px / float(np.hypot(*(proj(X0 + Wm / 2 * dh) - proj(X0 - Wm / 2 * dh))))
    Hm = Wm / proportion
    coins = [X0 - Wm / 2 * dh - Hm / 2 * dv, X0 + Wm / 2 * dh - Hm / 2 * dv, X0 + Wm / 2 * dh + Hm / 2 * dv, X0 - Wm / 2 * dh + Hm / 2 * dv]
    return [proj(c).tolist() for c in coins], (X0, dh, dv, Wm, Hm, proj)


def image_de_controle(img, recales, plan, quad, cadre3d, chemin):
    """Photo recadrée autour de la zone, avec les arêtes mesurées, une grille posée sur le plan du mur et le rectangle :
    la grille doit suivre les assises de pierre et les fenêtres. C'est la preuve à regarder avant de fabriquer."""
    X0, dh, dv, Wm, Hm, proj = cadre3d
    pts = [np.array(p, float) for nom in ('horizontales', 'verticales') for seg in plan[nom] for p in seg] + [np.array(c) for c in quad]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    m = 120
    bx = (int(max(0, min(xs) - m)), int(max(0, min(ys) - m)), int(min(img.width, max(xs) + m)), int(min(img.height, max(ys) + m)))
    c = img.crop(bx).convert('RGB'); k = min(1.0, 1500 / c.width)
    c = c.resize((int(c.width * k), int(c.height * k)), Image.LANCZOS)
    d = ImageDraw.Draw(c)

    def T(p):
        return ((p[0] - bx[0]) * k, (p[1] - bx[1]) * k)
    pas = Hm / 2
    for i in range(-14, 15):   # grille du mur
        d.line([T(proj(X0 + i * pas * dv - 7 * Hm * dh)), T(proj(X0 + i * pas * dv + 7 * Hm * dh))], fill=(0, 220, 255), width=1)
        d.line([T(proj(X0 + i * pas * dh - 7 * Hm * dv)), T(proj(X0 + i * pas * dh + 7 * Hm * dv))], fill=(0, 220, 255), width=1)
    for nom, coul in (('horizontales', (255, 40, 40)), ('verticales', (40, 255, 40))):
        for (p, q), _ in recales[nom]:
            d.line([T(p), T(q)], fill=coul, width=3)
    d.polygon([T(p) for p in quad], outline=(255, 230, 0))
    d.line([T(quad[0]), T(quad[1]), T(quad[2]), T(quad[3]), T(quad[0])], fill=(255, 230, 0), width=3)
    c.save(chemin, quality=88)


# ------------------------------------------------------------------ greffer une vraie plaque
def preparer_greffon(dossier, g, langue):
    """Une plaque dessinée reste un dessin (Romain, 12-11 : la plaque posée est le montage le moins réaliste). On part
    donc d'une vraie plaque prise sur une autre photo : redressée, logo de la ville retiré (le coin opposé, retourné,
    le remplace : mêmes pixels, même filet), texte changé dans la plaque elle-même. Elle garde son émail, ses bords
    et son filet réels ; seul le texte est neuf."""
    src = ImageOps.exif_transpose(Image.open(os.path.join(dossier, g['source']))).convert('RGB')
    src = ImageEnhance.Color(src).enhance(0.85)
    q = np.array(g['quad'], float)
    e = g.get('echelle', 1.0)
    Wp = int(round((np.hypot(*(q[1] - q[0])) + np.hypot(*(q[2] - q[3]))) / 2 * e))
    Hp = int(round((np.hypot(*(q[3] - q[0])) + np.hypot(*(q[2] - q[1]))) / 2 * e))
    rect = src.transform((Wp, Hp), Image.PERSPECTIVE, coeffs([(0, 0), (Wp, 0), (Wp, Hp), (0, Hp)], [tuple(p) for p in q]), Image.BICUBIC)
    a = np.asarray(rect, np.float32).copy()
    m = g.get('miroir')     # [x0, y0, x1, y1] en fractions : zone à remplacer par son symétrique gauche-droite
    if m:
        xa, ya, xb, yb = int(m[0] * Wp), int(m[1] * Hp), int(m[2] * Wp), int(m[3] * Hp)
        sym = a[:, ::-1][ya:yb, xa:xb]
        bande = max(4, int(0.02 * Wp))      # raccord de lumière : les blancs de part et d'autre du joint
        gain = np.median(a[ya:yb, xb:xb + bande].reshape(-1, 3), 0) / np.maximum(np.median(sym[:, -bande:].reshape(-1, 3), 0), 1)
        fondu = max(3, int(0.015 * Wp))
        w = np.ones((yb - ya, xb - xa), np.float32)
        w[:, -fondu:] *= np.linspace(1, 0, fondu)[None, :]
        w[-fondu:, :] *= np.linspace(1, 0, fondu)[:, None]
        a[ya:yb, xa:xb] = a[ya:yb, xa:xb] * (1 - w[..., None]) + sym * gain[None, None, :] * w[..., None]
    rect = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    info = {}
    t = g.get('texte')
    if t:
        z2 = dict(t)
        x0f, y0f, x1f, y1f = t['boite']
        z2['quad'] = [[x0f * Wp, y0f * Hp], [x1f * Wp, y0f * Hp], [x1f * Wp, y1f * Hp], [x0f * Wp, y1f * Hp]]
        z2.setdefault('id', 'greffon')
        patch, boite, info = traiter_zone(rect, z2, langue)
        rc = rect.convert('RGBA'); rc.alpha_composite(patch, (boite[0], boite[1])); rect = rc.convert('RGB')
    return rect, info


# ------------------------------------------------------------------ poser un élément là où il n'y a rien
def ecrire(masque, FW, FH, lignes, langue, f_police, axes, marge, chasse=1.0, gigue=0.0, rng=None):
    """Écrit des lignes centrées dans un masque plat. Chaque ligne : haut (hauteur de capitale, fraction de la
    hauteur), y (centre, fraction), suivi (espacement, en cadratin). Une ligne trop large est réduite."""
    infos = []
    for lz in lignes:
        txt = lz[langue]
        cap = lz['haut'] * FH
        nom = lz.get('police', f_police); ax = lz.get('axes', axes)
        ch_ = lz.get('chasse', chasse)
        taille = cap
        f = police(nom, taille, ax)
        for _ in range(2):
            taille *= cap / max(hauteur_capitale(f), 1)
            f = police(nom, taille, ax)
        suivi = lz.get('suivi', 0.04)
        lg = mesurer(f, txt, suivi, ch_); dispo = FW * (1 - 2 * marge)
        if lg > dispo:
            taille *= dispo / lg
            f = police(nom, taille, ax)
            lg = mesurer(f, txt, suivi, ch_)
        bb = f.getbbox('H')
        yref = lz['y'] * FH - (bb[1] + bb[3]) / 2
        poser_texte(masque, txt, f, suivi, FW / 2 - lg / 2 + lz.get('dx', 0) * FW, yref, ch_, lz.get('gigue', gigue), rng)
        infos.append((txt, round(float(taille), 1), 1.0))
    return infos


def poser_zone(img, z, langue):
    """Pose un élément neuf sur une surface nue. modele 'plaque' : un objet (plaque émaillée) éclairé comme le mur,
    avec son ombre portée ; modele 'peint' : un lettrage peint à même le mur, usé, qui garde le relief de la pierre.
    La lumière vient de la photo elle-même : couleur du mur (donc de l'éclairage), ombres qui traversent la zone, grain."""
    quad = np.array(z['quad'], float)
    pad = int(z.get('bord', 30))
    x0 = int(max(0, np.floor(quad[:, 0].min()) - pad)); y0 = int(max(0, np.floor(quad[:, 1].min()) - pad))
    x1 = int(min(img.width, np.ceil(quad[:, 0].max()) + pad)); y1 = int(min(img.height, np.ceil(quad[:, 1].max()) + pad))
    arr = np.asarray(img.crop((x0, y0, x1, y1)), np.float32)
    h, w = arr.shape[:2]
    q = quad - [x0, y0]
    R = polygone((w, h), q) > 0.5
    lum = arr.mean(-1)
    hz = float(q[:, 1].max() - q[:, 1].min())
    rng = np.random.default_rng(z.get('graine', 11))

    # ---- la lumière, lue sur le mur
    mur_rgb = np.array([np.median(arr[..., c][R]) for c in range(3)])
    mur_lum = float(np.median(lum[R]))
    teinte = np.array(z.get('teinte_mur', [0.74, 0.68, 0.58]))      # ce que renvoie le mur (calcaire clair par défaut)
    illum = mur_rgb / teinte                                         # ce que renverrait un blanc parfait au même endroit
    if z.get('neutre'):
        # mieux qu'une couleur de pierre supposée : la couleur, relevée sur la photo, d'une chose neutre au soleil
        # (volet gris, enduit blanc). Elle donne la teinte de la lumière ; le mur n'en donne plus que la force.
        nc = np.array(z['neutre'], float); nc = nc / nc.mean()
        illum = nc * float(mur_rgb.mean() / teinte.mean())
    Lw = flou(lum, max(6.0, 0.3 * hz))
    ratio = np.clip(Lw / max(mur_lum, 1), 0.5, 1.4) ** z.get('gamma_lumiere', 0.85)   # ombres et dégradés qui traversent
    hp = (arr - flou(arr, 1.6)).mean(-1)
    sig = 1.4826 * float(np.median(np.abs(hp - np.median(hp))))      # grain de la photo (estimation robuste)
    bruit = flou(rng.standard_normal((h, w, 3)).astype(np.float32), 0.55)
    bruit = bruit / max(float(bruit.std()), 1e-6) * sig * z.get('grain', 1.0)

    # ---- le dessin à plat
    top = np.hypot(*(q[1] - q[0])); bot = np.hypot(*(q[2] - q[3]))
    lef = np.hypot(*(q[3] - q[0])); rig = np.hypot(*(q[2] - q[1]))
    ss = float(np.clip(700 / max((top + bot) / 2, 1), 2, 5))
    FW = int(round((top + bot) / 2 * ss)); FH = int(round((lef + rig) / 2 * ss))
    if z.get('proportion'):
        # le dessin se fait aux proportions réelles de l'objet ; c'est la projection sur le mur qui l'écrase ou l'étire
        FW = int(round(max(FW, FH * z['proportion']))); FH = int(round(FW / z['proportion']))
    plat = [(0, 0), (FW, 0), (FW, FH), (0, FH)]
    vers_photo = coeffs([tuple(p) for p in q], plat)
    flou_b = float(z.get('flou_bord', 0.9))

    def vers_crop(im, fond=0):
        return np.asarray(im.transform((w, h), Image.PERSPECTIVE, vers_photo, Image.BICUBIC, fillcolor=fond), np.float32)

    modele = z.get('modele', 'plaque')
    f_police = z.get('police', 'ROCKB.TTF'); axes = z.get('axes')
    marge = z.get('marge_largeur', 0.09)
    masque_t = Image.new('L', (FW, FH), 0)
    infos = ecrire(masque_t, FW, FH, z.get('lignes', []), langue, f_police, axes, marge, z.get('chasse', 1.0), z.get('gigue', 0.0), rng)
    dom = z.get('ombre', [2, 3])
    yy, xx = np.mgrid[0:FH, 0:FW]
    u = xx / max(FW - 1, 1); v = yy / max(FH - 1, 1)

    if modele == 'greffe':
        # une vraie plaque (preparer_greffon) : on ne garde d'elle que ce qu'elle renvoie, pas la lumière de sa photo.
        # Son blanc, tel que photographié (souvent bleuté, à l'ombre), devient le blanc de référence.
        g_im = z['_greffon'].resize((FW, FH), Image.LANCZOS)
        ga = np.asarray(g_im, np.float32)
        blanc_src = np.percentile(ga.reshape(-1, 3), 70, axis=0)
        tb = np.array(z.get('teinte_blanc', [1.0, 0.985, 0.955]), np.float32)    # un blanc d'émail, très légèrement chaud
        im = Image.fromarray(np.clip(ga / np.maximum(blanc_src, 1) * 250.0 * tb, 0, 255).astype(np.uint8))
        fond = tuple(int(v) for v in 250 * tb)
        al = Image.new('L', (FW, FH), 0)
        ImageDraw.Draw(al).rounded_rectangle([0, 0, FW - 1, FH - 1], radius=z.get('rayon', 0.10) * FH, fill=255)
    elif modele == 'plaque':
        fond = tuple(z.get('fond', [250, 248, 241])); bordure = tuple(z.get('bordure', [170, 30, 38]))
        coul = tuple(z.get('couleur', list(bordure)))
        rayon = z.get('rayon', 0.10) * FH
        im = Image.new('RGB', (FW, FH), fond)
        al = Image.new('L', (FW, FH), 0)
        ImageDraw.Draw(al).rounded_rectangle([0, 0, FW - 1, FH - 1], radius=rayon, fill=255)
        ins = z.get('filet_retrait', 0.065) * FH; ep = max(1, int(round(z.get('filet', 0.035) * FH)))
        if ep and z.get('filet', 0.035) > 0:
            ImageDraw.Draw(im).rounded_rectangle([ins, ins, FW - 1 - ins, FH - 1 - ins], radius=max(1, rayon - ins * 0.6), outline=bordure, width=ep)
        # lettres : bords un rien adoucis (l'émail cuit n'a pas d'angle vif)
        mt = rugueux(np.asarray(masque_t, np.float32) / 255.0, rng, max(0.8, 0.008 * FH), z.get('rugosite', 0.05))
        im.paste(Image.new('RGB', (FW, FH), coul), (0, 0), Image.fromarray((mt * 255).astype(np.uint8)))
        im = ImageEnhance.Color(im).enhance(0.85)      # même recette que la photo de base : saturation -15 %
        rv = max(2.0, 0.02 * FH); dv_ = 0.085 * FH
        vis = ((dv_, dv_), (FW - dv_, dv_), (FW - dv_, FH - dv_), (dv_, FH - dv_)) if z.get('vis', True) else ()
        # vieillissement, dessiné à plat : rouille autour des fixations et coulures dessous, traînées de pluie depuis
        # le haut, poussière retenue au bas de la plaque
        age = z.get('age', 1.0)
        fa = np.asarray(im, np.float32)
        if age:
            from PIL import ImageFilter
            ov = Image.new('L', (FW, FH), 0); dov = ImageDraw.Draw(ov)
            for vx, vy in vis:
                dov.ellipse([vx - 2.6 * rv, vy - 2.6 * rv, vx + 2.6 * rv, vy + 2.6 * rv], fill=150)
                dov.rectangle([vx - 0.7 * rv, vy, vx + 0.7 * rv, vy + (0.16 + 0.1 * float(rng.uniform())) * FH], fill=110)
            rouille = np.asarray(ov.filter(ImageFilter.GaussianBlur(1.2 * rv)), np.float32) / 255.0 * 0.55 * age
            fa = fa * (1 - rouille[..., None]) + np.array([118, 84, 56], np.float32)[None, None, :] * rouille[..., None]
            col = flou(rng.standard_normal((9, FW)).astype(np.float32), 0.012 * FW)[4]
            col = np.clip((col / max(float(col.std()), 1e-6) - 0.7) * 1.2, 0, 1)
            trainees = col[None, :] * np.exp(-v / 0.55)
            poussiere = np.exp(-(1 - v) / 0.05)
            fa = fa * (1 - age * (0.09 * trainees + 0.07 * poussiere))[..., None]
        # l'émail brille : un peu plus clair vers le haut (il renvoie le ciel), et un reflet doux en travers,
        # qui blanchit aussi bien le rouge que le blanc
        fa = fa * (1 + z.get('degrade', 0.05) * (1 - 2 * v))[..., None]
        fa = fa + 255.0 * z.get('reflet', 0.06) * np.exp(-((((u - 0.28) * 0.75 + (v - 0.3)) / 0.2) ** 2))[..., None]
        im = Image.fromarray(np.clip(fa, 0, 255).astype(np.uint8))
        dvis = ImageDraw.Draw(im)
        for vx, vy in vis:   # têtes de vis : un point sombre, un éclat clair
            dvis.ellipse([vx - rv, vy - rv, vx + rv, vy + rv], fill=(104, 100, 96))
            dvis.ellipse([vx - 0.45 * rv, vy - 0.6 * rv, vx + 0.15 * rv, vy], fill=(196, 194, 188))
    if modele in ('plaque', 'greffe'):
        refl = flou(vers_crop(im, fond), flou_b) / 255.0 * z.get('blanc', 0.8)
        # une plaque dehors n'est jamais uniforme : légère salissure à grande échelle
        sal = flou(rng.standard_normal((h, w)).astype(np.float32), max(3.0, 0.12 * hz))
        refl = refl * (1 + z.get('salissure', 0.04) * sal / max(float(np.abs(sal).max()), 1e-6))[..., None]
        a = np.clip(flou(vers_crop(al) / 255.0, flou_b), 0, 1)
        # épaisseur : la face avant est décollée du mur le long de sa normale ; entre les deux, la tranche de la dalle,
        # visible du côté d'où l'on regarde (calculé dans le plan du mur, voir main)
        corps = a
        dec = z.get('_decalage')
        if dec is not None and abs(dec[0]) + abs(dec[1]) > 0.5:
            pas = int(np.ceil(np.hypot(*dec))) + 1
            for i in range(1, pas + 1):
                t_ = i / pas
                corps = np.maximum(corps, np.roll(np.roll(a, int(round(-dec[1] * t_)), 0), int(round(-dec[0] * t_)), 1))
        tranche = np.clip(corps - a, 0, 1)
        # relief du bord : le chant tourné vers la lumière s'éclaircit, l'autre s'assombrit ; et la tôle a un bord
        # roulé, plus sombre, tout autour
        om = z.get('_ombre_mur') if dec is not None else None
        if om is not None:
            dom = om      # le relief du bord suit le vrai soleil
        n = float(np.hypot(*dom)) or 1.0
        gy, gx = np.gradient(flou(a, 1.0))
        relief = 1 + z.get('relief', 0.9) * (gx * dom[0] / n + gy * dom[1] / n)
        bord_roule = 1 - z.get('bord_roule', 0.22) * np.clip((a - flou(a, 1.6)) * 4.0, 0, 1)
        pix = refl * illum[None, None, :] * (ratio * relief * bord_roule)[..., None]
        pix = np.where(pix > 236, 236 + (pix - 236) * 0.3, pix) + bruit * 0.8      # hautes lumières retenues
        blanc_tr = np.array(fond, np.float32) / 255.0 * z.get('blanc', 0.8)
        if om is not None:
            # ombre MESURÉE sur la photo (fiche : "soleil", relevé sur une ombre réelle de la scène ; "ombre_teinte",
            # rapport entre le mur à l'ombre et le mur au soleil). C'est l'empreinte de la dalle sur le mur, étirée
            # dans la direction du soleil sur la longueur que donne son épaisseur ; en plein soleil elle est nette.
            pied = np.roll(np.roll(a, int(round(-dec[1])), 0), int(round(-dec[0])), 1)
            reg = pied
            pas = int(np.ceil(np.hypot(*om))) + 1
            for i in range(1, pas + 1):
                t_ = i / pas
                reg = np.maximum(reg, np.roll(np.roll(pied, int(round(om[1] * t_)), 0), int(round(om[0] * t_)), 1))
            ombre = np.clip(flou(reg, z.get('ombre_flou', 0.5)), 0, 1) * (1 - corps)
            teinte_o = np.array(z.get('ombre_teinte', [0.58, 0.54, 0.47]), np.float32)
            comp = arr * (1 - ombre[..., None] * (1 - teinte_o)[None, None, :])
            # la tranche visible regarde-t-elle le soleil ? Sinon elle est à l'ombre, de la teinte des ombres du lieu
            a_s, b_s = z.get('soleil', [0.0, 1.0])
            if abs(dec[0]) >= abs(dec[1]):
                eclairee = a_s * (-np.sign(dec[0])) < 0
            else:
                eclairee = b_s * (-np.sign(dec[1])) < 0
            f_tr = np.full(3, 0.93, np.float32) if eclairee else teinte_o * z.get('tranche_ombre', 1.08)
            tr = (blanc_tr * f_tr)[None, None, :] * illum[None, None, :] * ratio[..., None] + bruit * 0.8
            A_o = ombre
        else:
            # sans mesure : ombre portée en deux couches, un trait net au contact et une pénombre plus large
            o1 = np.roll(np.roll(corps, int(round(dom[1])), 0), int(round(dom[0])), 1)
            o2 = np.roll(np.roll(corps, int(round(dom[1] * 1.8)), 0), int(round(dom[0] * 1.8)), 1)
            ombre = (flou(o1, z.get('ombre_flou', 1.3)) * z.get('ombre_force', 0.5) + flou(o2, z.get('ombre_flou', 1.3) * 3.2) * z.get('ombre_force', 0.5) * 0.4) * (1 - corps)
            ombre = np.clip(ombre, 0, 0.85)
            comp = arr * (1 - ombre[..., None])
            tr = (blanc_tr * z.get('tranche_lum', 0.74))[None, None, :] * illum[None, None, :] * ratio[..., None] + bruit * 0.8
            A_o = np.minimum(1, 3 * ombre)
        comp = comp * (1 - tranche[..., None]) + tr * tranche[..., None]
        comp = comp * (1 - a[..., None]) + pix * a[..., None]
        A_ = np.clip(np.maximum(corps, A_o), 0, 1)
        comp = adoucir_couleur(comp, a, z.get('flou_couleur', 1.6))
    else:  # 'peint'
        a_t = np.asarray(masque_t, np.float32) / 255.0
        # le pinceau : contours qui ondulent, angles arrondis
        a_t = rugueux(a_t, rng, max(1.0, z.get('pinceau', 0.014) * FH), z.get('rugosite', 0.2))
        # usure : grandes plages qui s'effacent + petits éclats
        n1 = flou(rng.standard_normal((FH, FW)).astype(np.float32), 6 * ss); n1 = (n1 - n1.min()) / max(float(n1.max() - n1.min()), 1e-6)
        n2 = flou(rng.standard_normal((FH, FW)).astype(np.float32), 0.9 * ss); n2 = n2 / max(float(n2.std()), 1e-6)
        usure = np.clip(z.get('usure', 0.5) + 0.75 * n1, 0.2, 1.0) * np.clip(1.25 + 0.55 * n2, 0, 1)
        Lf = flou(lum, 3.0)
        creux = np.clip(1 + z.get('creux', 3.5) * (lum - Lf) / np.maximum(Lf, 1), 0.2, 1.0)   # joints et trous : la peinture n'y tient pas
        texture = (lum / np.maximum(Lf, 1)) ** z.get('texture', 0.75)
        lumiere = illum[None, None, :] * (ratio * texture)[..., None]
        comp = arr.copy()
        reste = np.ones((h, w), np.float32)
        b = z.get('bandeau')
        if b:
            mb = Image.new('L', (FW, FH), 0)
            mx = b.get('marge', 0.02) * FW; my = b.get('marge_y', 0.06) * FH
            ImageDraw.Draw(mb).rectangle([mx, my, FW - 1 - mx, FH - 1 - my], fill=255)
            # le badigeon n'a pas de bord droit : contour irrégulier, passé à la brosse large
            a_b = flou(rugueux(np.asarray(mb, np.float32) / 255.0, rng, 0.035 * FH, 0.4), 1.2 * ss) * np.clip(z.get('usure', 0.5) + 0.2 + 0.6 * n1, 0.2, 1.0) * np.clip(1.3 + 0.5 * n2, 0, 1)
            A_b = np.clip(flou(vers_crop(Image.fromarray((np.clip(a_b, 0, 1) * 255).astype(np.uint8))) / 255.0, flou_b), 0, 1) * creux * b.get('opacite', 0.5)
            cible_b = np.array(b.get('couleur', [232, 222, 196]), float)[None, None, :] / 255.0 * lumiere + bruit * 0.6
            comp = comp * (1 - A_b[..., None]) + cible_b * A_b[..., None]
            reste *= (1 - A_b)
        # chaque pierre a bu la peinture à sa façon : la tenue varie d'une pierre à l'autre
        n3 = flou(rng.standard_normal((h, w)).astype(np.float32), max(4.0, 0.2 * hz)); n3 = n3 / max(float(n3.std()), 1e-6)
        pierre = np.clip(0.86 + z.get('par_pierre', 0.18) * n3, 0.45, 1.0)
        A_t = np.clip(flou(vers_crop(Image.fromarray((np.clip(a_t * usure, 0, 1) * 255).astype(np.uint8))) / 255.0, flou_b), 0, 1) * creux * pierre * z.get('opacite', 0.75)
        cible_t = np.array(z.get('couleur', [58, 48, 50]), float)[None, None, :] / 255.0 * lumiere + bruit * 0.6
        comp = comp * (1 - A_t[..., None]) + cible_t * A_t[..., None]
        reste *= (1 - A_t)
        A_ = np.clip(1 - reste, 0, 1)

    comp = np.clip(comp, 0, 255)
    A_[A_ < 0.02] = 0
    P = np.where(A_[..., None] > 0, (comp - arr * (1 - A_[..., None])) / np.maximum(A_[..., None], 1e-3), arr)
    P = np.clip(P, 0, 255)
    ys_, xs_ = np.nonzero(A_ > 0)
    bx0, bx1, by0, by1 = xs_.min(), xs_.max() + 1, ys_.min(), ys_.max() + 1
    patch = Image.fromarray(np.dstack([P, A_ * 255]).astype(np.uint8)[by0:by1, bx0:bx1], 'RGBA')
    boite = (x0 + int(bx0), y0 + int(by0), x0 + int(bx1), y0 + int(by1))
    info = {'lignes': infos, 'flou_bord': round(flou_b, 2), 'mur': [int(v) for v in mur_rgb], 'grain': round(sig, 2),
            'pixels_changes': int((A_ > 0).sum()), 'pixels_zone': int(R.sum())}
    return patch, boite, info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('fiche')
    ap.add_argument('--sortie', required=True)
    ap.add_argument('--langue', default='oc')
    ap.add_argument('--qualite', type=int, default=72)
    a = ap.parse_args()
    fiche = json.load(open(a.fiche, encoding='utf-8'))
    src = os.path.join(fiche['dossier'], fiche['source'])
    brut = Image.open(src)
    exif = brut.getexif()
    img = ImageOps.exif_transpose(brut).convert('RGB')
    img0 = img   # la photo entière : c'est sur elle qu'on mesure la perspective (le centre optique est son centre)
    # cadre : on peut ne montrer qu'une partie de la photo (coordonnées de l'original) ; les coins des zones restent
    # donnés dans l'original, l'outil les décale
    cadre = fiche.get('cadre')
    ox, oy = (cadre[0], cadre[1]) if cadre else (0, 0)
    if cadre:
        img = img.crop(tuple(cadre))
    L0 = fiche.get('largeur', 1920)
    k = min(1.0, L0 / img.width)
    if k < 1:
        img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    img = ImageEnhance.Color(img).enhance(0.85)   # même recette que les paysages : saturation -15 %
    os.makedirs(a.sortie, exist_ok=True)
    clau = fiche['clau']
    sortie_zones = []
    comp = img.convert('RGBA')
    for z in fiche['zones']:
        z = dict(z)
        if 'plan' in z:
            # le quadrilatère n'est pas dessiné : il est calculé sur le plan du mur
            geo, recales, pinfo = plan_du_mur(img0, exif, z['plan'])
            z['quad'], cadre3d = quad_sur_plan(geo, z['ancre'], z['largeur_px'], z['proportion'])
            image_de_controle(img0, recales, z['plan'], z['quad'], cadre3d, os.path.join(a.sortie, f"{clau}-{z['id']}-plan.jpg"))
            print(f"  plan du mur : focale {pinfo['focale_px']} px, angle mesuré entre horizontales et verticales {pinfo['angle_mesure']}° "
                  f"(90 attendu), écarts {pinfo['ecarts_px']}")
            print('  quad :', [[round(v) for v in p] for p in z['quad']])
            if z.get('epaisseur'):
                # la dalle a une épaisseur (fraction de sa hauteur) : sa face avant avance le long de la normale du mur,
                # tournée vers l'appareil ; on en tire le déplacement à l'écran
                X0, dh_, dv_, Wm, Hm, proj = cadre3d
                nrm = np.cross(dh_, dv_)
                if float(nrm @ X0) > 0:
                    nrm = -nrm
                z['_decalage'] = ((proj(X0 + z['epaisseur'] * Hm * nrm) - proj(X0)) * k).tolist()
                print('  épaisseur : face avant décalée de', [round(v, 1) for v in z['_decalage']], 'px')
                if z.get('soleil'):
                    # soleil : de combien l'ombre glisse sur le mur, par unité de profondeur, vers la droite de
                    # l'image (le long du mur) et vers le bas ; relevé sur une ombre réelle de la photo
                    a_s, b_s = z['soleil']
                    z['_ombre_mur'] = ((proj(X0 + z['epaisseur'] * Hm * (a_s * dh_ + b_s * dv_)) - proj(X0)) * k).tolist()
                    print('  ombre sur le mur :', [round(v, 1) for v in z['_ombre_mur']], 'px')
        if z.get('greffon'):
            z['_greffon'], ginfo = preparer_greffon(fiche['dossier'], z['greffon'], a.langue)
            z['_greffon'].save(os.path.join(a.sortie, f"{clau}-{z['id']}-greffon.png"))
            print('  greffon :', ginfo.get('lignes'))
        z['quad'] = [[(x - ox) * k, (y - oy) * k] for x, y in z['quad']]
        z['ignorer'] = [[(r[0] - ox) * k, (r[1] - oy) * k, (r[2] - ox) * k, (r[3] - oy) * k] for r in z.get('ignorer', [])]
        if z.get('mode') == 'poser':
            if 'ombre' in z:
                z['ombre'] = [v * k for v in z['ombre']]
            patch, boite, info = poser_zone(img, z, a.langue)
        else:
            patch, boite, info = traiter_zone(img, z, a.langue)
        nom = f"{clau}-{z['id']}.webp"
        patch.save(os.path.join(a.sortie, nom), 'WEBP', quality=a.qualite, alpha_quality=88, method=6)
        patch.save(os.path.join(a.sortie, f"{clau}-{z['id']}.png"))
        comp.alpha_composite(patch, (boite[0], boite[1]))
        taille = os.path.getsize(os.path.join(a.sortie, nom))
        sortie_zones.append({'id': z['id'], 'patch': nom, 'x': round(boite[0] / img.width, 5), 'y': round(boite[1] / img.height, 5),
                             'l': round((boite[2] - boite[0]) / img.width, 5), 'h': round((boite[3] - boite[1]) / img.height, 5),
                             'octets': taille, **info})
        print(f"  {z['id']}: {info['lignes']}  flou {info['flou_bord']}  patch {patch.width}x{patch.height}  {taille} o  "
              f"({info['pixels_changes']} px changés sur {info['pixels_zone']} de la zone)")
    img.save(os.path.join(a.sortie, f'{clau}-base.png'))
    img.save(os.path.join(a.sortie, f'{clau}-base.webp'), 'WEBP', quality=60, method=6)
    comp.convert('RGB').save(os.path.join(a.sortie, f'{clau}-{a.langue}.png'))
    json.dump({'clau': clau, 'l': img.width, 'h': img.height, 'zones': sortie_zones}, open(os.path.join(a.sortie, f'{clau}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
