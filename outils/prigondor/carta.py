"""Cartes de profondeur pour l'essai « Profondeur » (/ensag/prigondor, 06-11).
La photo n'est plus découpée en plans (rendu jugé « moche » par Romain le 06-11 ;
l'ancien script plans.py reste dans l'historique de Git) : la page déforme la photo
entière de quelques pixels selon la profondeur.
Ici : profondeur relative (proche = clair) par Depth Anything V2 Small (ONNX, licence
Apache 2.0, modèle de 99 Mo hors Git), puis les objets proches légèrement élargis
et la carte adoucie, pour qu'en bougeant leur bord ne se déchire pas.
Sortie : app/static/ensag/prigondor/<clau>-prigondor.png (768 px de large).
Dépendances : numpy, pillow, onnxruntime.
Usage (depuis la racine du dépôt) : py outils/prigondor/carta.py clau1 clau2 ..."""
import re, sys, pathlib
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
LARG = 768

for clau in sys.argv[1:]:
    im = Image.open(D / f'{clau}-{AMPLES[clau][-1]}.webp').convert('RGB')
    w, h = im.size
    if w >= h:
        H = 518; Wd = round(518 * w / h / 14) * 14
    else:
        Wd = 518; H = round(518 * h / w / 14) * 14
    x = np.asarray(im.resize((Wd, H), Image.BICUBIC), dtype=np.float32) / 255.0
    y = ses.run(None, {NOM: ((x - MEAN) / STD).transpose(2, 0, 1)[None]})[0][0]
    lo, hi = np.percentile(y, 1), np.percentile(y, 99.5)
    y = np.clip((y - lo) / (hi - lo), 0, 1)
    c = Image.fromarray((y * 255).astype(np.uint8), 'L').resize((LARG, round(LARG * h / w)), Image.BICUBIC)
    # objets proches élargis d'environ 1 % de la largeur, puis fondu doux
    c = c.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(4))
    f = SORT / f'{clau}-prigondor.png'
    c.save(f, optimize=True)
    print(clau, c.size, f.stat().st_size)
