# Liste à relire : les fiches qui iraient sur la carte (preuve de vie, ou
# déclaration depuis 2021), une ligne chacune, par département.
# Usage : py -I relectura.py <dossier de travail>  →  relectura.txt
import json, sys
D = sys.argv[1]
d = json.load(open(f'{D}/crosat.json', encoding='utf-8'))
com = json.load(open(f'{D}/comunas-domeni.json', encoding='utf-8'))
sel = [f for f in d['fiches'] if f['posicion'] not in ('D', 'S') and (f['proves'] or (f['declaracion'][:4] >= '2021' and f['classa'] != 'bruit'))]
sel.sort(key=lambda f: (f['dep'], f['classa'], f['nom']))
with open(f'{D}/relectura.txt', 'w', encoding='utf-8') as s:
    for f in sel:
        p = ''.join(sorted(set(x['font'][0] for x in f['proves'])))
        ag = next((x.get('titol', '') for x in f['proves'] if x['font'].startswith('agenda')), '')
        if ag: p += '«' + ag[:40] + '»'
        net = lambda v: ' '.join(str(v).replace('|', '/').split())
        f = {**f, 'nom': net(f['nom']), 'objet': net(f['objet'])}
        s.write(f"{f['id']}|{f['classa'][0]}|{p or '-'}|{f['nom'][:60]}|{com[f['comuna']]['fr'][:20]}|{f['declaracion'][:4]}|{f['objet'][:110]}\n")
print(len(sel), 'fiches a relire ;', sum(1 for f in sel if f['classa'] == 'lenga'), 'langue,', sum(1 for f in sel if f['classa'] == 'cultura'), 'culture,', sum(1 for f in sel if f['classa'] == 'bruit'), 'bruit')
