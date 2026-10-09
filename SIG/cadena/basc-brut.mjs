// Domeni de la lenga basca : donadas brutas (demanda de Romain, 2026-10-09).
// Aprèp lo catalan e l'arpitan, lo basc ven sus la carta /carta amb la meteissa
// logica. Decisions de Romain (SIG/basc/FONTS.md) : estat actual de la lenga,
// lei en Espanha (Navarra en tres zònas), Araba en tinta « basc desaparegut »,
// dialèctes de Zuazo (2008).
//
// 1. França (sens telecargament) : las comunas del departament 64 son presas al
//    GeoPackage IGN local (Admin Express COG Carto 2026). Sortida : comunas-fr.geojson.
// 2. Telecargaments amb l'API Overpass (OSM XML) : las comunas (admin_level 8,
//    amb ine:municipio) de la Comunautat autonòma basca (ES-PV) e de Navarra
//    (ES-NC), e lor limit ; lo comtat de Treviño e La Puebla de Arganzón
//    (Burgos, enclavats dins Araba).
// Puèi convertís en GeoJSON (pilòt OSM de GDAL) e contraròtla, coma arpitan-brut.mjs.
//
// Sortidas dins SIG/brut/basc/ (ignorat per Git). Donadas OSM © los
// contribuidors d'OpenStreetMap, licéncia ODbL 1.0.
//
// Usatge : node SIG/cadena/basc-brut.mjs [--sens-telecargar] [--tornar]
import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(CADENA, '../brut/basc');
const OSM = path.join(BRUT, 'osm');
const JORNAL = path.join(BRUT, 'telecargaments.json');
const GPKG = path.resolve(CADENA, '../brut/comunas/ADE-COG-CARTO_2026.gpkg');
const QGIS_PY = process.env.QGIS_PYTHON ?? 'C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat';
// Servidors ensajats a torn de ròtle (lo primièr es sovent saturat), coma dins comunas.mjs.
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'LoLigam-carta/1.0 (preparacion de donadas)';
const BUDGET = 80e6; // octets transferits al pus per passatge
const SENS_TELECARGAR = process.argv.includes('--sens-telecargar');
const TORNAR = process.argv.includes('--tornar');

// Departament francés estudiat (Pais Basc del nòrd e Bearn vesin).
const DEPARTAMENTS = ['64'];

export const FONT = 'Domeni basc : © contributeurs OpenStreetMap (ODbL), API Overpass, 2026-10-09 ; IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0)';

// Requèsta Overpass : las relacions de « sel » (sintaxi Overpass QL), puèi
// lors nosèls e camins (sens etiquetas), puèi las relacions completas ; « pre » :
// çò que se fa abans (la zòna de cèrca, fòra de l'union per que surte pas).
const req = (sel, pre = '') => `[out:xml][timeout:600];${pre}(${sel})->.r;.r>;out skel qt;.r out body;`;

const COMUNITATS = ['ES-PV', 'ES-NC'];

// Filtres : vejatz arpitan-brut.mjs (ids, admin_level, boundary, iso, prefix, dins_iso + camp_dins).
const EXTRACCIONS = [
	{
		nom: 'espanha',
		pre: `rel["boundary"="administrative"]["admin_level"="4"]["ISO3166-2"~"^(${COMUNITATS.join('|')})$"]->.k;.k map_to_area->.a;`,
		sel: 'rel(area.a)["boundary"="administrative"]["admin_level"="8"];.k;',
		sortidas: {
			'espanha-comunas': { admin_level: '8', boundary: 'administrative', dins_iso: COMUNITATS, camp_dins: 'comunitat' },
			'espanha-comunitats': { admin_level: '4', iso: COMUNITATS },
		},
	},
	{
		nom: 'trevinho',
		// Condado de Treviño e La Puebla de Arganzón (Burgos), dins Araba
		sel: 'rel["boundary"="administrative"]["admin_level"="8"]["name"~"^(Condado de Treviño|La Puebla de Arganzón)$"](42.55,-2.95,42.85,-2.45);',
		sortidas: { 'trevinho-comunas': { admin_level: '8', boundary: 'administrative' } },
	},
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

// Python de QGIS : « -s -P » = ni site de l'utilizaire, ni lo dorsièr corrent
// dins lo camin dels moduls (« -I » se pòt pas : QGIS a besonh de PYTHONHOME).
// Lo programa ven per l'entrada estandard ; los fichièrs telecargats son
// sonque legits coma donadas (GDAL, gzip).
function python(programa, env, marca) {
	const p = spawnSync(`"${QGIS_PY}" -s -P -`, {
		shell: true, input: programa, encoding: 'utf8', maxBuffer: 64e6, stdio: ['pipe', 'pipe', 'inherit'],
		env: { ...process.env, ...env, PYTHONIOENCODING: 'utf-8' },
	});
	const l = (p.stdout || '').split(/\r?\n/).find((x) => x.startsWith(marca + ' '));
	if (p.status !== 0 || !l) throw new Error(`Python (${marca}) fracassat :\n` + (p.stdout || '').slice(-2000));
	return JSON.parse(l.slice(marca.length + 1));
}

fs.mkdirSync(OSM, { recursive: true });
const jornal = lire(JORNAL, { licéncia: 'ODbL 1.0, © los contribuidors d\'OpenStreetMap ; comunas-fr : IGN, Licence Ouverte 2.0', extraccions: {} });

// ---------- 1. França : comunas del GeoPackage IGN local ----------
const PYFR = String.raw`
import json, os
from osgeo import gdal, ogr, osr
gdal.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')
ds = gdal.OpenEx(os.environ['BASC_GPKG'], gdal.OF_VECTOR)
sortida = os.environ['BASC_SORTIDA']
deps = json.loads(os.environ['BASC_DEPS'])
filtre_deps = ','.join("'%s'" % d for d in deps)
lay = ds.GetLayerByName('commune')
wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326)
wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
tr = osr.CoordinateTransformation(lay.GetSpatialRef(), wgs)
# noms dels cantons (canton.code_insee = commune.code_insee_du_canton)
cantons = {}
lc = ds.GetLayerByName('canton')
lc.SetAttributeFilter('code_insee_du_departement IN (%s)' % filtre_deps)
for f in lc:
    cantons[f.GetField('code_insee')] = f.GetField('nom_officiel')
# punt de la comuna (cap-luòc)
cap = {}
lp = ds.GetLayerByName('chef_lieu_de_commune')
lp.SetAttributeFilter('substr(code_insee_de_la_commune, 1, 2) IN (%s)' % filtre_deps)
for f in lp:
    g = f.GetGeometryRef()
    c = f.GetField('code_insee_de_la_commune')
    if g and c not in cap:
        g = g.Clone(); g.Transform(tr)
        cap[c] = (round(g.GetX(), 5), round(g.GetY(), 5))
lay.SetAttributeFilter('code_insee_du_departement IN (%s)' % filtre_deps)
if os.path.exists(sortida): os.remove(sortida)
out = ogr.GetDriverByName('GeoJSON').CreateDataSource(sortida)
ol = out.CreateLayer('comunas-fr', wgs, ogr.wkbMultiPolygon,
                     ['RFC7946=YES', 'COORDINATE_PRECISION=6', 'WRITE_NAME=NO'])
for k, t in (('insee', ogr.OFTString), ('nom', ogr.OFTString), ('departement', ogr.OFTString),
             ('canton', ogr.OFTString), ('canton_nom', ogr.OFTString), ('statut', ogr.OFTString),
             ('population', ogr.OFTInteger), ('mairie_lon', ogr.OFTReal), ('mairie_lat', ogr.OFTReal)):
    ol.CreateField(ogr.FieldDefn(k, t))
n, invalidas, sens_canton, sens_cap, per_dep = 0, [], [], [], {}
for f in lay:
    g = f.GetGeometryRef().Clone(); g.Transform(tr)
    c = f.GetField('code_insee'); d = f.GetField('code_insee_du_departement')
    if not g.IsValid(): invalidas.append(c)
    o = ogr.Feature(ol.GetLayerDefn())
    o.SetField('insee', c); o.SetField('nom', f.GetField('nom_officiel')); o.SetField('departement', d)
    kc = f.GetField('code_insee_du_canton')
    if kc: o.SetField('canton', kc)
    if kc in cantons: o.SetField('canton_nom', cantons[kc])
    else: sens_canton.append('%s %s (%s)' % (c, f.GetField('nom_officiel'), kc))
    o.SetField('statut', f.GetField('statut'))
    o.SetField('population', f.GetField('population') or 0)
    if c in cap: o.SetField('mairie_lon', cap[c][0]); o.SetField('mairie_lat', cap[c][1])
    else: sens_cap.append(c)
    o.SetGeometry(ogr.ForceToMultiPolygon(g))
    ol.CreateFeature(o); n += 1
    per_dep[d] = per_dep.get(d, 0) + 1
out = None
print('RESUMFR ' + json.dumps({'entitats': n, 'per_departament': per_dep, 'invalidas': invalidas,
      'sens_canton_nomat': sens_canton, 'sens_cap_luoc': sens_cap, 'octets': os.path.getsize(sortida)}, ensure_ascii=True))
`;
let resumFr = null;
if (fs.existsSync(GPKG)) {
	console.log('França : comunas del GeoPackage IGN local…');
	resumFr = python(PYFR, { BASC_GPKG: GPKG, BASC_SORTIDA: path.join(BRUT, 'comunas-fr.geojson'), BASC_DEPS: JSON.stringify(DEPARTAMENTS) }, 'RESUMFR');
	jornal.franca = {
		font: 'IGN Admin Express COG Carto 2026 (Licence Ouverte 2.0), ' + path.relative(path.resolve(CADENA, '../..'), GPKG).replace(/\\/g, '/'),
		departaments: DEPARTAMENTS, data: new Date().toISOString(), ...resumFr,
	};
	fs.writeFileSync(JORNAL, JSON.stringify(jornal, null, '\t'));
} else {
	console.log(`ATENCION : ${GPKG} manca ; lançatz d'abòrd « node SIG/cadena/comunas.mjs » (etapa 1).`);
}

// ---------- 2. Telecargaments ----------
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
	await pausa(6000);
}

// ---------- 3. Conversion en GeoJSON (Python de QGIS) ----------
// Python legís l'OSM compressat (/vsigzip/), monta las relacions (jaç
// multipolygons), filtra e escriu un GeoJSON per sortida, puèi dona un resumit.
const PY = String.raw`
import gzip, html, json, os, re
from osgeo import gdal, ogr, osr
gdal.UseExceptions()
gdal.SetConfigOption('OSM_USE_CUSTOM_INDEXING', 'NO')
DOS = os.environ['BASC_DOS']
SPEC = json.loads(os.environ['BASC_SPEC'])
CLAUS = ['name', 'name:eu', 'name:es', 'name:fr', 'name:oc', 'name:an', 'ine:municipio',
         'official_name', 'alt_name', 'old_name', 'admin_level', 'boundary', 'place', 'ref',
         'ISO3166-2',
         'population', 'wikidata', 'wikipedia']
# (l'etiqueta source es ignorada pel pilòt OSM de GDAL)
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
        zonas = []
        if 'dins_iso' in filtre:
            for i, (p, g) in ents.items():
                if g is not None and p.get('ISO3166-2') in filtre['dins_iso']:
                    zonas.append((p['ISO3166-2'], g.MakeValid()))
        gardats, tirats = [], []
        for i, (p, g) in sorted(ents.items()):
            if g is None: continue
            if 'ids' in filtre and i not in filtre['ids']: continue
            if 'admin_level' in filtre and p.get('admin_level') != filtre['admin_level']: continue
            if 'boundary' in filtre and p.get('boundary') != filtre['boundary']: continue
            if 'iso' in filtre and p.get('ISO3166-2') not in filtre['iso']: continue
            if 'prefix' in filtre and not all(any(p.get(k, '').startswith(x) for x in v) for k, v in filtre['prefix'].items()):
                tirats.append(p.get('name', str(i))); continue
            if 'dins_iso' in filtre:
                pt = g.MakeValid().PointOnSurface()
                dins = [z for z, zg in zonas if pt.Within(zg)]
                if not dins:
                    tirats.append(p.get('name', str(i))); continue
                p = dict(p); p[filtre['camp_dins']] = dins[0]
            gardats.append((i, p, g))
        sortida = os.path.join(DOS, nom + '.geojson')
        if os.path.exists(sortida): os.remove(sortida)
        out = ogr.GetDriverByName('GeoJSON').CreateDataSource(sortida)
        wgs = osr.SpatialReference(); wgs.ImportFromEPSG(4326)
        wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
        ol = out.CreateLayer(nom, wgs, ogr.wkbMultiPolygon,
                             ['RFC7946=YES', 'COORDINATE_PRECISION=6', 'WRITE_NAME=NO'])
        ol.CreateField(ogr.FieldDefn('osm_id', ogr.OFTInteger64))
        claus = CLAUS + ([filtre['camp_dins']] if 'camp_dins' in filtre else [])
        presentas = [k for k in claus if any(k in p for _, p, _ in gardats)]
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
        compte = {}
        if 'camp_dins' in filtre:
            for _, p, _ in gardats: compte[p[filtre['camp_dins']]] = compte.get(p[filtre['camp_dins']], 0) + 1
        r['sortidas'][nom] = {'entitats': len(gardats), 'octets': os.path.getsize(sortida),
                              'invalidas': invalidas, 'tiradas': tirats, 'per_zona': compte,
                              'amb_name_eu': sum(1 for _, p, _ in gardats if 'name:eu' in p),
                              'noms': sorted(p.get('name', str(i)) for i, p, _ in gardats)}
    resum[e['nom']] = r
print('RESUM ' + json.dumps(resum, ensure_ascii=True))
`;

console.log('Conversion en GeoJSON (GDAL)…');
const spec = EXTRACCIONS.map(({ nom, sortidas }) => ({ nom, sortidas }));
const resum = python(PY, { BASC_DOS: BRUT, BASC_SPEC: JSON.stringify(spec) }, 'RESUM');

// ---------- 4. Jornal e resumit ----------
if (resumFr) {
	console.log(`comunas-fr.geojson : ${resumFr.entitats} comunas (${Object.entries(resumFr.per_departament).map(([d, n]) => `${d} ${n}`).join(', ')}), ${mo(resumFr.octets)}` +
		(resumFr.invalidas.length ? `, ${resumFr.invalidas.length} invalidas` : '') +
		(resumFr.sens_canton_nomat.length ? `, ${resumFr.sens_canton_nomat.length} sens nom de canton` : '') +
		(resumFr.sens_cap_luoc.length ? `, ${resumFr.sens_cap_luoc.length} sens cap-luòc` : ''));
}
for (const [nom, r] of Object.entries(resum)) {
	jornal.extraccions[nom] = { ...(jornal.extraccions[nom] || {}), conversion: r };
	const pm = Object.entries(r.pas_montadas);
	console.log(`${nom} : ${r.montadas}/${r.relacions_osm} relacions montadas${pm.length ? ' ; PAS MONTADAS : ' + pm.map(([i, n]) => `${n} (${i})`).join(', ') : ''}`);
	for (const [s, o] of Object.entries(r.sortidas)) {
		console.log(`  ${s}.geojson : ${o.entitats} entitats (${o.amb_name_eu} amb name:eu), ${mo(o.octets)}` +
			(Object.keys(o.per_zona).length ? ` [${Object.entries(o.per_zona).map(([z, n]) => `${z} ${n}`).join(', ')}]` : '') +
			(o.invalidas.length ? `, ${o.invalidas.length} invalidas (${o.invalidas.slice(0, 5).join(', ')}${o.invalidas.length > 5 ? '…' : ''})` : '') +
			(o.tiradas.length ? `, ${o.tiradas.length} tiradas (${o.tiradas.slice(0, 8).join(', ')}${o.tiradas.length > 8 ? '…' : ''})` : ''));
	}
}
jornal.darrièr_passatge = { data: new Date().toISOString(), octets_transferits: transferit };
fs.writeFileSync(JORNAL, JSON.stringify(jornal, null, '\t'));
const total = (dir, filtre = () => true) => fs.readdirSync(dir).filter(filtre).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
console.log(`Transferit dins aqueste passatge : ${mo(transferit)} ; sul disc : osm ${mo(total(OSM))}, geojson ${mo(total(BRUT, (f) => f.endsWith('.geojson')))}`);
