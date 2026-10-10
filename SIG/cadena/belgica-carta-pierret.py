# Contraròtle de las soszònas valonas : carta « Wallonie-linguistique-fr.svg »
# (Wikimedia Commons, David Descamps, 2006, domeni public), qu'indica coma
# font, per la Belgica, Jean-Marie Pierret, « Les dialectes d'Ardenne et de
# Gaume », dins Le grand livre d'Ardenne et de Gaume, 1984, carta p. 238.
# Quatre zònas valonas : wallo-picard, namurois, liégeois, wallo-lorrain ; lo
# picard, lo champanés e lo lorren son en blanc (pas d'aira colorada).
#
#   "C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat" -s SIG/cadena/belgica-carta-pierret.py
#
# Lo calatge se fa sus las comunas que la carta « Chapeau » met en valon
# (belgica-carta-chapeau.py d'abòrd) : l'aira roja de Pierret contra l'aira
# valona de Chapeau. Sortida : SIG/brut/oil-belgica/pierret-comunas.csv.
import csv, importlib.util, os
import numpy as np
from scipy import ndimage
from osgeo import gdal

R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
spec = importlib.util.spec_from_file_location('calatge', os.path.join(R, 'SIG', 'cadena', 'flamenc-calatge.py'))
cal = importlib.util.module_from_spec(spec); spec.loader.exec_module(cal)
BRUT = os.path.join(R, 'SIG', 'brut', 'oil-belgica')

a = gdal.Open(os.path.join(BRUT, 'wallonie-ling-1920.png')).ReadAsArray().astype(np.int32)
rgb = a[:3].transpose(1, 2, 0)
H, W = rgb.shape[:2]
CL = [('wallo_picard', (255, 85, 85)), ('namurois', (212, 0, 0)), ('liegeois', (255, 42, 42)), ('wallo_lorrain', (255, 0, 0))]
k = rgb[..., 0] * 65536 + rgb[..., 1] * 256 + rgb[..., 2]
classa = np.full((H, W), -1, dtype=np.int32)
for i, (_, c) in enumerate(CL):
    classa[k == c[0] * 65536 + c[1] * 256 + c[2]] = i
roge = classa >= 0
terra = ndimage.binary_fill_holes(ndimage.binary_closing(roge, structure=np.ones((3, 3)), iterations=3))
classa_tota = cal.emplenar(classa, terra)

chap = {r['codi']: r for r in csv.DictReader(open(os.path.join(BRUT, 'chapeau-comunas.csv'), encoding='utf-8'), delimiter=';')}
VALON = {'oest_valon', 'namures', 'lieges', 'sud_valon'}
comunas = cal.cargar_comunas([os.path.join(R, 'SIG', 'brut', 'flamenc', 'be-comunas.geojson')],
                             lambda p: p['codi'] in chap)
ref = [g for p, g in comunas if chap[p['codi']]['zona'] in VALON]
M, e = cal.calar(terra, ref, res=200.0, caps=(20000, 8000, 3000, 1500))
print('Afinitat : escart mejan %.0f m' % e)
f, _ = cal.afinar(terra, ref, M, res=200.0, ordre=2, caps=(8000, 5000, 3000, 2000))
gt, gw, gh = cal.grilha([g for _, g in comunas], 150.0)
cg = cal.reprojectar(classa_tota, f, gt, gw, gh)
tab = cal.parts_grilha(cg, gt, comunas, len(CL))
cal.contraròtle(cg, [c for _, c in CL], gt, comunas, os.path.join(BRUT, 'pierret-contraròtle.png'))
COD = [c for c, _ in CL]
with open(os.path.join(BRUT, 'pierret-comunas.csv'), 'w', encoding='utf-8', newline='') as fo:
    w = csv.writer(fo, delimiter=';')
    w.writerow(['codi', 'zona', 'part', 'defora'] + COD)
    for (p, g), t in zip(comunas, tab):
        dins = t[1:]
        o = np.argsort(-dins)
        z1 = COD[o[0]] if dins[o[0]] > 0 else ''
        w.writerow([p['codi'], z1, round(dins[o[0]] / max(1, dins.sum()), 3), round(t[0] / max(1, t.sum()), 3)] + list(dins))
print('fait')
