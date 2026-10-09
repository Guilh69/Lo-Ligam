// Domeni de la lenga catalana : donadas brutas d'OpenStreetMap (demanda de
// Romain, 2026-10-08). Lo catalan ven sus la carta /carta amb la meteissa
// logica que l'occitan : domeni, dialèctes, partida francesa a despart, vilas.
//
// Telecarga amb l'API Overpass (OSM XML), las requèstas l'una aprèp l'autra,
// los limits administratius que cal :
//   - Catalonha : las comarcas (admin_level 7) e lo limit de la region ;
//   - Andòrra (lo país) ;
//   - Balearas : las illas (Malhòrca, Menòrca, Eivissa, Formentera, Cabrera),
//     mai leugièras que las comunas (75 000 nosèls contra 94 000) ;
//   - País Valencian : las comunas (admin_level 8, amb ref:ine), las comarcas
//     (admin_level 7), la zòna « Municipis de Predomini Lingüístic Valencià »
//     (lei valenciana 4/1983) e lo limit de la region ;
//   - Aragon : las comunas de la benda de l'èst (long. -0,30 a 0,80, lat. 40,55
//     a 42,95 : dels Pirenèus al Matarranya ; -0,30 e non -0,05 per gardar
//     Aiguaviva e la Ginebrosa) e la relacion « Franja de Ponent » ;
//   - Múrcia : Jumilla, Yecla, Abanilla (lo Carxe) ;
//   - Sardenha : l'Alguèr.
// La França es pas telecargada : las comunas dels Pirenèus Orientals (66) son
// presas al GeoPackage IGN local (SIG/brut/comunas/, fach per comunas.mjs).
//
// Forma de las requèstas : « .r>; out skel qt; .r out body; ». Es la meteissa
// causa que « out body; >; out skel qt; » mas dins l'òrdre nosèls, camins,
// relacions : lo pilòt OSM de GDAL lo demanda (autrament las relacions, que
// venon abans lors camins, son perdudas).
//
// Puèi convertís en GeoJSON (pilòt OSM de GDAL, jaç « multipolygons », Python
// de QGIS) e contraròtla cada sortida : relacions pas montadas per GDAL,
// geometrias invalidas, entitats vesinas tiradas.
//
// Sortidas dins SIG/brut/catalan/ (ignorat per Git) :
//   osm/<nom>.osm.gz        responsas brutas d'Overpass, compressadas (gzip)
//   geojson/<nom>.geojson   un fichièr per tipe d'entitat (WGS 84, 6 decimalas)
//   telecargaments.json     jornal : requèstas, servidor, data, volums, contraròtles
// Donadas © los contribuidors d'OpenStreetMap, licéncia ODbL 1.0.
//
// Usatge : node SIG/cadena/catalan-brut.mjs
//   --sens-telecargar : sonque la conversion (los .osm.gz devon èsser aquí)
//   --tornar          : tòrna telecargar tot, quitament çò qu'es ja aquí
// Budgèt : s'arrèsta se lo volum transferit despassa 25 Mo dins un passatge.
import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/catalan');
const OSM = path.join(BRUT, 'osm');
const GEOJSON = path.join(BRUT, 'geojson');
const JORNAL = path.join(BRUT, 'telecargaments.json');
const QGIS_PY = process.env.QGIS_PYTHON ?? 'C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat';
// Servidors ensajats a torn de ròtle (lo primièr es sovent saturat), coma dins comunas.mjs.
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
const BUDGET = 25e6; // octets transferits al pus per passatge
const SENS_TELECARGAR = process.argv.includes('--sens-telecargar');
const TORNAR = process.argv.includes('--tornar');

export const FONT = 'Domeni catalan : © contributeurs OpenStreetMap (ODbL), API Overpass, 2026-10-08';

// Requèsta Overpass : las relacions de « sel » (sintaxi Overpass QL), puèi
// lors nosèls e camins (sens etiquetas), puèi las relacions completas ; « pre » :
// çò que se fa abans (la zòna de cèrca, fòra de l'union per que surte pas).
const req = (sel, pre = '') => `[out:xml][timeout:600];${pre}(${sel})->.r;.r>;out skel qt;.r out body;`;

// Cada extraccion : un fichièr OSM, e una o mai sortidas GeoJSON filtradas
// (ids : relacions donadas ; admin_level, boundary : etiquetas ; ine : començament
// de ref:ine ; dins : lo punt interior deu èsser dins aquela relacion).
const EXTRACCIONS = [
	{
		nom: 'catalonha-comarcas',
		pre: 'rel(349053);map_to_area->.a;',
		sel: 'rel(area.a)["boundary"="administrative"]["admin_level"="7"];rel(349053);',
		sortidas: {
			'catalonha-comarcas': { admin_level: '7', boundary: 'administrative', dins: 349053 },
			'catalonha-limit': { ids: [349053] },
		},
	},
	{ nom: 'andorra', sel: 'rel(9407);', sortidas: { andorra: { ids: [9407] } } },
	{
		nom: 'balears-illas',
		// Malhòrca, Menòrca, Eivissa, Formentera, Cabrera (relacions place=island)
		sel: 'rel(6803636);rel(6076061);rel(6076060);rel(6076062);rel(1607462);',
		sortidas: { 'balears-illas': { ids: [6803636, 6076061, 6076060, 6076062, 1607462] } },
	},
	{
		nom: 'valencian',
		pre: 'rel(349043);map_to_area->.a;',
		sel: 'rel(area.a)["boundary"="administrative"]["admin_level"~"^(7|8)$"];rel(11739086);rel(349043);',
		sortidas: {
			'valencian-comunas': { admin_level: '8', ine: ['03', '12', '46'] },
			'valencian-comarcas': { admin_level: '7', boundary: 'administrative', dins: 349043 },
			'valencian-predomini-valencia': { ids: [11739086] },
			'valencian-limit': { ids: [349043] },
		},
	},
	{
		nom: 'arago-est',
		pre: 'rel(349045);map_to_area->.a;',
		sel: 'rel(area.a)["boundary"="administrative"]["admin_level"="8"](40.55,-0.30,42.95,0.80);rel(11744144);',
		sortidas: {
			'arago-est-comunas': { admin_level: '8', ine: ['22', '44', '50'] },
			'franja-de-ponent': { ids: [11744144] },
		},
	},
	{
		nom: 'murcia-carxe',
		// Jumilla, Abanilla, Yecla
		sel: 'rel(344688);rel(345090);rel(345590);',
		sortidas: { 'murcia-carxe-comunas': { ids: [344688, 345090, 345590] } },
	},
	{ nom: 'alguer', sel: 'rel(40581);', sortidas: { alguer: { ids: [40581] } } },
];

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const existe = (f) => fs.existsSync(f) && fs.statSync(f).size > 0;
const mo = (n) => (n / 1e6).toFixed(2) + ' Mo';
const lire = (f, defaut) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return defaut; } };

// POST brut : sens descompression automatica, per comptar los octets
// vertadièrament transferits (responsa gzip).
function postar(url, data) {
	const cos = new URLSearchParams({ data }).toString();
	return new Promise((resolve, reject) => {
		const r = https.request(url, {
			method: 'POST',
			headers: { 'User-Agent': UA, 'Accept-Encoding': 'gzip', 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(cos) },
			timeout: 660000,
		}, (resp) => {
			const tròces = [];
			resp.on('data', (c) => tròces.push(c));
			resp.on('end', () => resolve({ estat: resp.statusCode, gzip: resp.headers['content-encoding'] === 'gzip', cos: Buffer.concat(tròces) }));
			resp.on('error', reject);
		});
		r.on('timeout', () => r.destroy(new Error('temps passat')));
		r.on('error', reject);
		r.end(cos);
	});
}

let transferit = 0; // octets d'aqueste passatge, ensages mancats compreses
let servidor = 0;
function budget() {
	if (transferit > BUDGET) throw new Error(`Budgèt de ${mo(BUDGET)} despassat (${mo(transferit)} transferits) : arrèst.`);
}

async function overpass(requesta) {
	for (let ensag = 0; ensag < 12; ensag++) {
		budget();
		const n = (servidor + ensag) % OVERPASS.length, url = OVERPASS[n];
		try {
			const r = await postar(url, requesta);
			transferit += r.cos.length;
			const gz = r.gzip ? r.cos : zlib.gzipSync(r.cos);
			const xml = zlib.gunzipSync(gz).toString('utf8');
			const ok = r.estat === 200 && xml.startsWith('<?xml') && /<\/osm>\s*$/.test(xml) && !xml.includes('<remark>');
			if (!ok) throw new Error(`${r.estat} ${xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160)}`);
			servidor = n;
			const compte = (re) => (xml.match(re) || []).length;
			return {
				gz, servidor: url, data: new Date().toISOString(),
				octets_transferits: r.cos.length, octets_xml: Buffer.byteLength(xml),
				nosels: compte(/<node /g), camins: compte(/<way /g), relacions: compte(/<relation /g),
				osm_base: (xml.match(/<meta osm_base="([^"]+)"/) || [])[1],
			};
		} catch (e) {
			console.log(`  Overpass (${url}), ensag ${ensag + 1} : ${e.message}`);
			await pausa(5000 + ensag * 3000);
		}
	}
	throw new Error('Overpass respond pas.');
}

// ---------- 1. Telecargaments ----------
fs.mkdirSync(OSM, { recursive: true });
fs.mkdirSync(GEOJSON, { recursive: true });
const jornal = lire(JORNAL, { licéncia: 'ODbL 1.0, © los contribuidors d\'OpenStreetMap', extraccions: {} });

for (const e of EXTRACCIONS) {
	const f = path.join(OSM, e.nom + '.osm.gz');
	if (existe(f) && !TORNAR) { console.log(`${e.nom} : ja aquí`); continue; }
	if (SENS_TELECARGAR) throw new Error(`Fichièr mancant : ${f}`);
	const requesta = req(e.sel, e.pre);
	console.log(`${e.nom} : telecargament…`);
	const r = await overpass(requesta);
	fs.writeFileSync(f + '.part', r.gz);
	fs.renameSync(f + '.part', f);
	const { gz, ...info } = r;
	jornal.extraccions[e.nom] = { requesta, ...info, octets_gz: gz.length };
	fs.writeFileSync(JORNAL, JSON.stringify(jornal, null, '\t'));
	console.log(`  ${mo(info.octets_transferits)} transferits (${mo(info.octets_xml)} en XML), ${info.nosels} nosèls, ${info.camins} camins, ${info.relacions} relacions ; total del passatge ${mo(transferit)}`);
	budget();
	await pausa(5000);
}

// ---------- 2. Conversion en GeoJSON (Python de QGIS) ----------
// Python legit l'OSM compressat (/vsigzip/), monta las relacions (jaç
// multipolygons), filtra e escriu un GeoJSON per sortida, puèi dona un resumit
// (linha « RESUM {…} »). « -s -P » : ni site de l'utilizaire, ni lo dorsièr
// corrent dins lo camin dels moduls (« -I » se pòt pas : QGIS a besonh de
// PYTHONHOME).
const PY = String.raw`
import gzip, html, json, os, re, sys
from osgeo import gdal, ogr, osr
gdal.UseExceptions()
gdal.SetConfigOption('OSM_USE_CUSTOM_INDEXING', 'NO')
DOS = os.environ['CATALAN_DOS']
SPEC = json.loads(os.environ['CATALAN_SPEC'])
CLAUS = ['name', 'name:ca', 'name:oc', 'name:es', 'name:fr', 'name:it', 'name:sc', 'name:an',
         'official_name', 'alt_name', 'admin_level', 'boundary', 'place', 'ref:ine', 'ref:ISTAT',
         'ISO3166-1', 'ISO3166-2', 'population', 'wikidata', 'wikipedia']
# (l'etiqueta source es ignorada pel pilòt OSM de GDAL : vejatz LISEZ-MOI.md)
ETIQ = re.compile(r'"((?:[^"\\]|\\.)*)"=>"((?:[^"\\]|\\.)*)"')
def desesc(s): return s.replace('\\"', '"').replace('\\\\', '\\')

resum = {}
for e in SPEC:
    f = os.path.join(DOS, 'osm', e['nom'] + '.osm.gz')
    with gzip.open(f, 'rt', encoding='utf-8') as fh:
        xml = fh.read()
    rels = {}
    for m in re.finditer(r'<relation id="(\d+)"[^>]*>(.*?)</relation>', xml, re.S):
        n = re.search(r'<tag k="name" v="([^"]*)"', m.group(2))
        rels[int(m.group(1))] = html.unescape(n.group(1)) if n else ''
    del xml
    ds = gdal.OpenEx('/vsigzip/' + f, gdal.OF_VECTOR)
    lyr = ds.GetLayerByName('multipolygons')
    ents = {}
    for ft in lyr:
        if not ft.GetField('osm_id'):
            continue
        p = {}
        for k in ('name', 'admin_level', 'boundary', 'place'):
            v = ft.GetField(k)
            if v: p[k] = v
        for k, v in ETIQ.findall(ft.GetField('other_tags') or ''):
            k = desesc(k)
            if k in CLAUS: p[k] = desesc(v)
        g = ft.GetGeometryRef()
        ents[int(ft.GetField('osm_id'))] = (p, g.Clone() if g else None)
    ds = None
    r = {'relacions_osm': len(rels), 'montadas': len(ents),
         'pas_montadas': {str(i): rels[i] for i in rels if i not in ents}, 'sortidas': {}}
    for nom, filtre in e['sortidas'].items():
        zona = None
        if 'dins' in filtre and filtre['dins'] in ents and ents[filtre['dins']][1]:
            zona = ents[filtre['dins']][1].MakeValid()
        gardats, tirats = [], []
        for i, (p, g) in sorted(ents.items()):
            if g is None: continue
            if 'ids' in filtre and i not in filtre['ids']: continue
            if 'admin_level' in filtre and p.get('admin_level') != filtre['admin_level']: continue
            if 'boundary' in filtre and p.get('boundary') != filtre['boundary']: continue
            if 'ine' in filtre and not any(p.get('ref:ine', '').startswith(x) for x in filtre['ine']):
                tirats.append(p.get('name', str(i))); continue
            if zona is not None and not g.MakeValid().PointOnSurface().Within(zona):
                tirats.append(p.get('name', str(i))); continue
            gardats.append((i, p, g))
        sortida = os.path.join(DOS, 'geojson', nom + '.geojson')
        if os.path.exists(sortida): os.remove(sortida)
        drv = ogr.GetDriverByName('GeoJSON')
        out = drv.CreateDataSource(sortida)
        wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326)
        wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
        ol = out.CreateLayer(nom, wgs, ogr.wkbMultiPolygon,
                             ['RFC7946=YES', 'COORDINATE_PRECISION=6', 'WRITE_NAME=NO'])
        ol.CreateField(ogr.FieldDefn('osm_id', ogr.OFTInteger64))
        presentas = [k for k in CLAUS if any(k in p for _, p, _ in gardats)]
        for k in presentas: ol.CreateField(ogr.FieldDefn(k, ogr.OFTString))
        invalidas = []
        for i, p, g in gardats:
            o = ogr.Feature(ol.GetLayerDefn())
            o.SetField('osm_id', i)
            for k in presentas:
                if k in p: o.SetField(k, p[k])
            if not g.IsValid(): invalidas.append(p.get('name', str(i)))
            o.SetGeometry(ogr.ForceToMultiPolygon(g))
            ol.CreateFeature(o)
        out = None
        r['sortidas'][nom] = {'entitats': len(gardats), 'octets': os.path.getsize(sortida),
                              'invalidas': invalidas, 'tiradas': tirats,
                              'noms': sorted(p.get('name', str(i)) for i, p, _ in gardats)}
    resum[e['nom']] = r
print('RESUM ' + json.dumps(resum, ensure_ascii=True))
`;

console.log('Conversion en GeoJSON (GDAL)…');
const spec = EXTRACCIONS.map(({ nom, sortidas }) => ({ nom, sortidas }));
const py = spawnSync(`"${QGIS_PY}" -s -P -`, {
	shell: true, input: PY, encoding: 'utf8', maxBuffer: 64e6, stdio: ['pipe', 'pipe', 'inherit'],
	env: { ...process.env, CATALAN_DOS: BRUT, CATALAN_SPEC: JSON.stringify(spec), PYTHONIOENCODING: 'utf-8' },
});
const linha = (py.stdout || '').split(/\r?\n/).find((l) => l.startsWith('RESUM '));
if (py.status !== 0 || !linha) throw new Error('Conversion fracassada :\n' + (py.stdout || '').slice(-2000));
const resum = JSON.parse(linha.slice(6));

// ---------- 2 bis. Catalonha del Nòrd : comunas dels Pirenèus Orientals ----------
// Pas d'Overpass : lo GeoPackage IGN Admin Express COG Carto 2026 es ja sul
// disc (telecargat per comunas.mjs). app/static/data/comunas/66.json basta pas :
// a sonque las 3 comunas del departament dins lo domeni occitan.
const GPKG = path.resolve(CADENA, '../brut/comunas/ADE-COG-CARTO_2026.gpkg');
const PY66 = String.raw`
import json, os
from osgeo import gdal, ogr, osr
gdal.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')
ds = gdal.OpenEx(os.environ['CATALAN_GPKG'], gdal.OF_VECTOR)
sortida = os.environ['CATALAN_SORTIDA']
lay = ds.GetLayerByName('commune')
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
tr = osr.CoordinateTransformation(lay.GetSpatialRef(), wgs)
cap = {}
lc = ds.GetLayerByName('chef_lieu_de_commune')
lc.SetAttributeFilter("code_insee_de_la_commune LIKE '66%'")
for f in lc:
    g = f.GetGeometryRef()
    if g and f.GetField('code_insee_de_la_commune') not in cap:
        g = g.Clone(); g.Transform(tr)
        cap[f.GetField('code_insee_de_la_commune')] = (round(g.GetX(), 5), round(g.GetY(), 5))
lay.SetAttributeFilter("code_insee_du_departement = '66'")
if os.path.exists(sortida): os.remove(sortida)
out = ogr.GetDriverByName('GeoJSON').CreateDataSource(sortida)
ol = out.CreateLayer('pireneus-orientals-comunas', wgs, ogr.wkbMultiPolygon,
                     ['RFC7946=YES', 'COORDINATE_PRECISION=6', 'WRITE_NAME=NO'])
for k, t in (('insee', ogr.OFTString), ('nom', ogr.OFTString), ('population', ogr.OFTInteger),
             ('mairie_lon', ogr.OFTReal), ('mairie_lat', ogr.OFTReal)):
    ol.CreateField(ogr.FieldDefn(k, t))
n = invalidas = 0
for f in lay:
    g = f.GetGeometryRef().Clone(); g.Transform(tr)
    if not g.IsValid(): invalidas += 1
    o = ogr.Feature(ol.GetLayerDefn())
    c = f.GetField('code_insee')
    o.SetField('insee', c); o.SetField('nom', f.GetField('nom_officiel'))
    o.SetField('population', f.GetField('population') or 0)
    if c in cap: o.SetField('mairie_lon', cap[c][0]); o.SetField('mairie_lat', cap[c][1])
    o.SetGeometry(ogr.ForceToMultiPolygon(g))
    ol.CreateFeature(o); n += 1
out = None
print('RESUM66 ' + json.dumps({'entitats': n, 'invalidas': invalidas, 'octets': os.path.getsize(sortida)}))
`;
let resum66 = null;
if (fs.existsSync(GPKG)) {
	console.log('Pirenèus Orientals (GeoPackage IGN local)…');
	const p = spawnSync(`"${QGIS_PY}" -s -P -`, {
		shell: true, input: PY66, encoding: 'utf8', maxBuffer: 16e6, stdio: ['pipe', 'pipe', 'inherit'],
		env: { ...process.env, CATALAN_GPKG: GPKG, CATALAN_SORTIDA: path.join(GEOJSON, 'pireneus-orientals-comunas.geojson'), PYTHONIOENCODING: 'utf-8' },
	});
	const l = (p.stdout || '').split(/\r?\n/).find((x) => x.startsWith('RESUM66 '));
	if (p.status !== 0 || !l) throw new Error('Extraccion del 66 fracassada :\n' + (p.stdout || '').slice(-2000));
	resum66 = JSON.parse(l.slice(8));
	jornal.pireneus_orientals = { font: 'IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0), ' + path.relative(path.resolve(CADENA, '../..'), GPKG).replace(/\\/g, '/'), ...resum66 };
} else {
	console.log(`ATENCION : ${GPKG} manca ; lançatz d'abòrd « node SIG/cadena/comunas.mjs » (etapa 1).`);
}

// ---------- 3. Jornal e resumit ----------
if (resum66) console.log(`pireneus-orientals-comunas.geojson : ${resum66.entitats} comunas, ${mo(resum66.octets)}${resum66.invalidas ? `, ${resum66.invalidas} invalidas` : ''}`);
for (const [nom, r] of Object.entries(resum)) {
	jornal.extraccions[nom] = { ...(jornal.extraccions[nom] || {}), conversion: r };
	const pm = Object.entries(r.pas_montadas);
	console.log(`${nom} : ${r.montadas}/${r.relacions_osm} relacions montadas${pm.length ? ' ; PAS MONTADAS : ' + pm.map(([i, n]) => `${n} (${i})`).join(', ') : ''}`);
	for (const [s, o] of Object.entries(r.sortidas)) {
		console.log(`  ${s}.geojson : ${o.entitats} entitats, ${mo(o.octets)}` +
			(o.invalidas.length ? `, ${o.invalidas.length} invalidas (${o.invalidas.slice(0, 5).join(', ')}${o.invalidas.length > 5 ? '…' : ''})` : '') +
			(o.tiradas.length ? `, ${o.tiradas.length} tiradas (${o.tiradas.slice(0, 8).join(', ')}${o.tiradas.length > 8 ? '…' : ''})` : ''));
	}
}
jornal.darrièr_passatge = { data: new Date().toISOString(), octets_transferits: transferit };
fs.writeFileSync(JORNAL, JSON.stringify(jornal, null, '\t'));
const total = (dir) => fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
console.log(`Transferit dins aqueste passatge : ${mo(transferit)} ; sul disc : osm ${mo(total(OSM))}, geojson ${mo(total(GEOJSON))}`);
