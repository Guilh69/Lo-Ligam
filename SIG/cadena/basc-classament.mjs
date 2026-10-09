// Classament de las comunas del domeni basc (demanda de Romain, 2026-10-09).
// Decisions de Romain (SIG/basc/FONTS.md) :
//  - estat actual de la lenga : en França las 158 comunas de la Comunautat
//    d'aglomeracion Pais Basc ; Baiona, Anglet, Biàrritz e las autras comunas
//    d'influéncia gascona demòran dins lo basc, amb d'asclas gasconas ;
//  - en Espanha, la lei : Biscaia e Gipuscoa en basc plen ; Navarra segon sas
//    tres zònas (vascofòna = plen, mixta = asclas, non vascofòna = defòra) ;
//  - Araba (e Treviño) : tinta « basc desaparegut » (coma la Pichona Gavachariá),
//    levat Aramaio e Legutio, ont lo basc es demorat viu ;
//  - dialèctes de Zuazo (2008), sosdialèctes en parlars (Viquipèdia en basc).
//
// Entradas (basc-brut.mjs, basc-comunas-fr.py, e las listas de SIG/basc/fonts/) :
//   comunas-fr.geojson, comunas-fr-info.json, espanha-comunas.geojson,
//   trevinho-comunas.geojson ; SIG/basc/fonts/ : capb.json (geo.api.gouv.fr, EPCI 200067106),
//   fonts/ley-foral.wiki (zònas de Navarra), fonts/comarcas-bizkaia.json,
//   fonts/comarcas-gipuzkoa.json (Viquipèdia en espanhòl).
// Sortida : SIG/basc/dialectes-basc.csv
//
// Usatge : node SIG/cadena/basc-classament.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BRUT = path.join(R, 'SIG/brut/basc');
const FONTS = path.join(R, 'SIG/basc/fonts');
const J = (f) => JSON.parse(fs.readFileSync(f.startsWith('fonts/') ? path.join(FONTS, f.slice(6)) : path.join(BRUT, f), 'utf8'));
const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const linhas = [];
const L = (o) => linhas.push({ regio: '', unitat: '', mena: '', nom_oficial: '', nom_eu: '', codi: '', domeni: '', dialecte: '', parlar: '', transicio: '', part_oc: '', nota: '', font: '', ...o });

// ---------------- França ----------------
const info = J('comunas-fr-info.json');
const capb = new Set(J('fonts/capb.json').map((c) => c.code));
const fr = J('comunas-fr.geojson').features.map((f) => f.properties);
const perNom = Object.fromEntries(fr.map((p) => [p.nom, p.insee]));
const lista = (noms) => {
	const s = new Set();
	for (const n of noms) {
		if (!perNom[n]) throw new Error('Comuna desconeguda : ' + n);
		s.add(perNom[n]);
	}
	return s;
};
// Influéncia gascona istorica (asclas) : Viquipèdia fr « Gascon » (Baiona, Anglet,
// Biàrritz, Bidaishen, La Bastida de Clarença) ; bailliatges de 1789 (principautat
// de Bidaishen, senescalcias de Dacs e de Tartas, Bearn).
const GASCONAS = lista(['Bayonne', 'Anglet', 'Biarritz', 'Boucau', 'Bidache', 'Came', 'Sames', 'Guiche', 'Arancou', 'Bergouey-Viellenave', 'Urt', 'La Bastide-Clairence', 'Lichos']);
// Esquiule : vilatge bascofòn de Bearn (fòra de la CAPB).
const ESKIULA = lista(['Esquiule']);
// Nafar-lapurtera : parlars (Zuazo, Viquipèdia en basc « Nafar-lapurtera »)
const MIXA = lista(['Aïcirits-Camou-Suhast', 'Amendeuix-Oneix', 'Amorots-Succos', 'Arbérats-Sillègue', 'Arbouet-Sussaute', 'Arraute-Charritte', 'Béguios', 'Béhasque-Lapiste', 'Beyrie-sur-Joyeuse', 'Gabat', 'Garris', 'Ilharre', 'Labets-Biscay', 'Larribar-Sorhapuru', 'Luxe-Sumberraute', 'Masparraute', 'Orègue', 'Orsanco', 'Saint-Palais', 'Uhart-Mixe', 'Bardos', 'Lichos']);
const SOLA_NL = lista(['Domezain-Berraute', 'Etcharry', 'Aroue-Ithorots-Olhaïby', 'Lohitzun-Oyhercq', 'Pagolle']);
const KOSTA = lista(['Hendaye', 'Urrugne', 'Ciboure', 'Saint-Jean-de-Luz', 'Guéthary', 'Bidart', 'Ascain', 'Arbonne', 'Bassussarry', 'Arcangues']);
const LAP_OEST = lista(['Sare', 'Ainhoa', 'Saint-Pée-sur-Nivelle', 'Ahetze', 'Biriatou']);
const LAP_MIEG = lista(['Ustaritz', 'Jatxou', 'Halsou', 'Larressore', 'Espelette', 'Souraïde', 'Itxassou', 'Cambo-les-Bains', 'Villefranque', 'Saint-Pierre-d\'Irube', 'Mouguerre', 'Lahonce']);

for (const p of fr) {
	const [bail, , part] = info[p.insee] || [];
	const u = { regio: 'France', unitat: bail === 'SOULE' ? 'Soule' : bail === 'NAVARRE' ? 'Basse-Navarre' : bail === 'USTARITZ' ? 'Labourd' : (bail || '').toLowerCase(), mena: 'comuna_fr', nom_oficial: p.nom, codi: p.insee, part_oc: part };
	const dins = capb.has(p.insee) || ESKIULA.has(p.insee);
	if (!dins) {
		if (part < 0.5) L({ ...u, domeni: 'exclos', nota: `Hors de l'agglomération Pays basque, ${Math.round(part * 100)} % dans le domaine occitan de la carte : à vérifier.`, font: 'CAPB OCC' });
		continue; // las autras comunas del 64 son occitanas : pas de linha
	}
	let dialecte = 'nafar_lapurtera', parlar = '', transicio = '', nota = '', font = 'CAPB Z08';
	if (bail === 'SOULE' || ESKIULA.has(p.insee)) {
		if (SOLA_NL.has(p.insee)) { parlar = 'amikuzekoa'; transicio = 'zub'; nota = 'Nord-ouest de la Soule : parler amikuzien (Zuazo).'; }
		else dialecte = 'zuberera';
	} else if (MIXA.has(p.insee)) { parlar = 'amikuzekoa'; transicio = 'zub'; }
	else if (KOSTA.has(p.insee)) { parlar = 'kostatarra'; transicio = 'erd'; }
	else if (LAP_OEST.has(p.insee)) parlar = 'sartaldekoa';
	else if (LAP_MIEG.has(p.insee)) parlar = 'erdigunekoa';
	else parlar = 'sortaldekoa';
	if (GASCONAS.has(p.insee) || ESKIULA.has(p.insee)) {
		transicio = 'oc';
		nota = ESKIULA.has(p.insee) ? 'Village bascophone du Béarn (hors agglomération) : basque et gascon.' : 'Influence gasconne historique ; dans le basque aujourd\'hui (choix de Romain).';
		font += ' GASC';
	}
	L({ ...u, domeni: 'basc', dialecte, parlar, transicio, nota, font });
}

// ---------------- Espanha ----------------
const es = [...J('espanha-comunas.geojson').features, ...J('trevinho-comunas.geojson').features].map((f) => f.properties);
const noms = (p) => [p.name, p['name:es'], p['name:eu'], p.official_name, p.alt_name].filter(Boolean).flatMap((n) => [n, ...n.split(/\s*[\/;]\s*|\s+-\s+/)]).map(norm);
const index = new Map();
for (const p of es) for (const n of noms(p)) if (!index.has(n)) index.set(n, p);
// sinonims (noms de la Viquipèdia → noms d'OSM)
const ALIAS = { 'basaburua mayor': 'basaburua', 'aranaz': 'arantza', 'echalar': 'etxalar', 'yanci': 'igantzi', 'lesaca': 'lesaka', 'vera de bidasoa': 'bera', 'santesteban': 'doneztebe', 'oiz': 'oitz', 'urroz de santesteban': 'urroz', 'atez': 'atetz', 'goni': 'val de goni', 'olza': 'cendea de olza', 'ollo': 'valle de ollo', 'vidaurreta': 'bidaurreta', 'yerri': 'valle de yerri', 'amasa villabona': 'villabona amasa', 'beinza labayen': 'beintza labaien', 'echarri aranaz': 'etxarri aranatz', 'ergoyena': 'ergoiena', 'huarte araquil': 'uharte arakil', 'alsasua': 'altsasu', 'olazagutia': 'olazti', 'ciordia': 'ziordia', 'bacaicoa': 'bakaiku', 'lacunza': 'lakuntza', 'burguete': 'auritz', 'roncesvalles': 'orreaga', 'valcarlos': 'luzaide', 'villanueva de aezcoa': 'hiriberri', 'abaurrea alta': 'abaurregaina', 'abaurrea baja': 'abaurrepea', 'garayoa': 'garaioa', 'orbaiceta': 'orbaizeta', 'arive': 'aribe', 'leiza': 'leitza', 'imoz': 'imotz', 'larraun': 'larraun', 'lecumberri': 'lekunberri', 'araquil': 'arakil', 'anue': 'anue', 'erasun': 'eratsun', 'ezcurra': 'ezkurra', 'urdax': 'urdazubi', 'aoiz': 'agoitz', 'arce': 'artzi', 'echarri': 'etxarri', 'echauri': 'etxauri', 'valle de egues': 'egues', 'ezcaroz': 'ezcaroz', 'huarte': 'uharte', 'olaibar': 'olaibar', 'oroz betelu': 'orotz betelu', 'pamplona': 'pamplona', 'puente la reina': 'puente la reina', 'villava': 'villava', 'zizur mayor': 'zizur nagusia', 'cendea de cizur': 'zizur', 'estella': 'estella lizarra', 'lizoain': 'lizoain arriasgoiti', 'ansoain': 'ansoain', 'barañain': 'baranain', 'berrioplano': 'berrioplano', 'orcoyen': 'orkoien', 'sanguesa': 'sanguesa', 'ujue': 'ujue', 'gallues': 'gallues', 'esparza de salazar': 'esparza de salazar', 'ochagavia': 'ochagavia', 'uztarroz': 'uztarroz', 'urzainqui': 'urzainqui', 'vidangoz': 'vidangoz', 'burgui': 'burgui', 'isaba': 'isaba' };
const trobar = (n) => index.get(norm(n)) || index.get(ALIAS[norm(n)] || '');
const mancants = [];
const assignat = new Map(); // ine:municipio o osm_id → linha

// Zònas de Navarra (lei 18/1986, modificacions de 2010 e 2017) : Viquipèdia en espanhòl
const wiki = fs.readFileSync(path.join(FONTS, 'ley-foral.wiki'), 'utf8');
const sec = (t) => wiki.split(/\n===\s*/).find((s) => s.startsWith(t)) || '';
const liens = (s) => [...s.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map((m) => (m[2] || m[1]).trim());
const tròç = (s, a, b) => { const i = s.indexOf(a); const j = b ? s.indexOf(b, i + 1) : s.length; return s.slice(i, j < 0 ? s.length : j); };
const sV = sec('Zona vascófona'), sM = sec('Zona mixta'), sN = sec('Zona no vascófona');
const VASC86 = liens(tròç(sV, 'municipios]]', 'En 2010')).filter((n) => n !== 'municipios de Navarra');
const MIXTA86 = liens(tròç(sM, 'municipios:', 'En 2010'));
const MIXTA10 = liens(tròç(sM, 'En 2010', 'En 2017')).filter((n) => ['Berrioplano', 'Berriozar', 'Orcoyen', 'Zizur Mayor', 'Aranguren', 'Belascoáin', 'Galar'].includes(n));
const MIXTA17 = liens(tròç(sM, 'En 2017', 'zona vascófona.<ref')).filter((n) => !['Atez', 'Naiz'].includes(n));
const VASC = [...VASC86, 'Lecumberri', 'Irurzun', 'Atez'];
const MIXTA = [...MIXTA86.filter((n) => n !== 'Atez'), ...MIXTA10, ...MIXTA17];
console.log(`Navarra : vascofòna ${VASC.length} (64 atenduts), mixta ${MIXTA.length} (98 atenduts)`);
const zona = new Map();
for (const n of VASC) zona.set(n, 'vascofona');
for (const n of MIXTA86) if (n !== 'Atez') zona.set(n, 'mixta86');
for (const n of MIXTA10) zona.set(n, 'mixta10');
for (const n of MIXTA17) zona.set(n, 'mixta17');

// Dialèctes en Navarra (Zuazo ; Viquipèdia en basc « Goi-nafarrera », « Gipuzkera »,
// « Nafar-lapurtera », « Ekialdeko nafar euskalkia »)
const NAV = {};
const met = (noms, o) => { for (const n of noms) NAV[n] = o; };
met(['Baztán'], { dialecte: 'nafar_lapurtera', parlar: 'sortaldekoa', transicio: 'naf', nota: 'Baztan : mélange de haut-navarrais et de navarro-labourdin ; Oronoz-Mugairi en haut-navarrais.' });
met(['Urdax', 'Zugarramurdi'], { dialecte: 'nafar_lapurtera', parlar: 'sartaldekoa' });
met(['Valcarlos'], { dialecte: 'nafar_lapurtera', parlar: 'sortaldekoa' });
met(['Araiz', 'Betelu', 'Areso'], { dialecte: 'erdialdekoa', parlar: 'nafarroakoa' });
met(['Larráun', 'Lecumberri', 'Basaburúa Mayor', 'Imoz'], { dialecte: 'erdialdekoa', parlar: 'nafarroakoa', transicio: 'naf' });
met(['Alsasua', 'Olazagutía', 'Ciordia', 'Urdiáin', 'Iturmendi', 'Bacáicoa'], { dialecte: 'erdialdekoa', parlar: 'burunda', transicio: 'naf', nota: 'Burunda : traits du guipuscoan et du biscayen (Zuazo).' });
met(['Arano'], { dialecte: 'erdialdekoa', parlar: 'oiartzun_bidasoa' });
met(['Leiza', 'Ezcurra', 'Erasun'], { dialecte: 'nafarra', parlar: 'iparraldekoa', transicio: 'erd' });
met(['Vera de Bidasoa', 'Lesaca', 'Echalar', 'Yanci', 'Aranaz', 'Santesteban', 'Donamaría', 'Elgorriaga', 'Ituren', 'Oiz', 'Saldías', 'Sumbilla', 'Urroz de Santesteban', 'Zubieta', 'Beinza-Labayen', 'Bertizarana', 'Goizueta', 'Ulzama', 'Lanz', 'Anué', 'Atez', 'Odieta', 'Araquil', 'Irurzun', 'Echarri Aranaz', 'Arbizu', 'Lacunza', 'Ergoyena', 'Arruazu', 'Huarte-Araquil', 'Irañeta'], { dialecte: 'nafarra', parlar: 'iparraldekoa' });
met(['Esteríbar', 'Erro', 'Burguete', 'Roncesvalles'], { dialecte: 'nafarra', parlar: 'hegoaldekoa' });
met(['Abaurrea Alta', 'Abaurrea Baja', 'Aria', 'Arive', 'Garayoa', 'Garralda', 'Orbaiceta', 'Orbara', 'Villanueva de Aézcoa'], { dialecte: 'nafarra', parlar: 'aezkera', transicio: 'nl', nota: 'Aezkoa : entre haut-navarrais, navarro-labourdin et navarrais oriental (Zuazo).' });
met(['Burgui', 'Garde', 'Isaba', 'Roncal', 'Urzainqui', 'Uztárroz', 'Vidángoz'], { dialecte: 'ekialdeko_nafarra', parlar: 'erronkariera', nota: 'Roncalais, éteint en 1991.' });
met(['Esparza de Salazar', 'Ezcároz', 'Gallués', 'Güesa', 'Izalzu', 'Jaurrieta', 'Ochagavía', 'Oronz', 'Sarriés'], { dialecte: 'ekialdeko_nafarra', parlar: 'zaraitzuera', nota: 'Salazarais, éteint à la fin du XXe siècle.' });

for (const [n, z] of zona) {
	const p = trobar(n);
	if (!p) { mancants.push('Navarra : ' + n); continue; }
	const d = NAV[n] || { dialecte: 'nafarra', parlar: 'hegoaldekoa', nota: 'Basque traditionnel, perdu au XIXe siècle (haut-navarrais du sud).' };
	if (z === 'vascofona' && !NAV[n]) console.log('  vascofòna sens dialècte : ' + n);
	const domeni = z === 'vascofona' ? 'basc' : 'mixta';
	const nz = { mixta86: 'Zone mixte (1986).', mixta10: 'Zone mixte (2010).', mixta17: 'Zone mixte depuis 2017 (choix politique, non vascophone avant).' }[z] || '';
	assignat.set(p['ine:municipio'], { regio: 'Navarre', unitat: 'Navarra', mena: 'municipio', nom_oficial: p.name, nom_eu: p['name:eu'] || '', codi: 'ine:' + p['ine:municipio'], domeni, ...d, nota: [nz, d.nota].filter(Boolean).join(' '), font: 'LFN Z08' });
}

// Euskadi
const cB = J('fonts/comarcas-bizkaia.json'), cG = J('fonts/comarcas-gipuzkoa.json');
const comarca = (tab, prov) => {
	const m = new Map();
	for (const [n, c] of Object.entries(tab)) {
		const p = trobar(n) || trobar(n.split(/\s*[-\/]\s*/)[0]);
		if (!p || !p['ine:municipio'].startsWith(prov)) mancants.push('comarca : ' + n);
		else m.set(p['ine:municipio'], c);
	}
	return m;
};
const comB = comarca(cB, '48'), comG = comarca(cG, '20');
const per = (noms) => new Set(noms.map((n) => { const p = trobar(n); if (!p) mancants.push('lista : ' + n); return p && p['ine:municipio']; }));
const OTXANDIO = per(['Otxandio']);
const DEBA_TART = per(['Elgoibar', 'Deba', 'Mendaro', 'Mutriku']);
const OIARTZUN = per(['Errenteria', 'Lezo', 'Oiartzun', 'Hondarribia', 'Irun']);
const ARAMAIO = per(['Aramaio']), LEGUTIO = per(['Legutio']);
const PARL_B = { Duranguesado: 'sortaldekoa', 'Lea Artibai': 'sortaldekoa', 'Busturialdea - Urdaibai': 'tartekoa', 'Gran Bilbao': 'sartaldekoa', 'Arratia-Nervión': 'sartaldekoa', Uribe: 'sartaldekoa', 'Las Encartaciones': 'sartaldekoa' };
const PARL_G = { 'Urola Costa': 'urolaldekoa', Goyerri: 'goierrikoa', 'Comarca de San Sebastián': 'beterrikoa', Tolosaldea: 'tolosaldekoa', 'Bidasoa-Chingudi': 'oiartzun_bidasoa' };

for (const p of es) {
	const k = p['ine:municipio'];
	if (!k) { // facerias, mancomunitats : prenon la comuna vesina dins basc.py
		L({ regio: p.comunitat === 'ES-PV' ? 'Euskadi' : 'Navarre', unitat: 'terres communes', mena: 'faceria', nom_oficial: p.name, nom_eu: p['name:eu'] || '', codi: 'osm:' + p.osm_id, domeni: 'vesina', nota: 'Terres communes sans commune : rangées avec leur voisine la plus longue.', font: 'OSM' });
		continue;
	}
	if (assignat.has(k)) { L(assignat.get(k)); continue; }
	const u = { mena: 'municipio', nom_oficial: p.name, nom_eu: p['name:eu'] || '', codi: 'ine:' + k };
	if (k.startsWith('31')) { L({ ...u, regio: 'Navarre', unitat: 'Navarra', domeni: 'exclos', nota: 'Zone non vascophone (loi de 1986).', font: 'LFN' }); continue; }
	if (k.startsWith('09')) { L({ ...u, regio: 'Burgos', unitat: 'Treviño', domeni: 'desaparegut', dialecte: 'arabakoa', nota: 'Enclave de Burgos dans l\'Alava : basque alavais disparu, comme l\'Alava.', font: 'Z08' }); continue; }
	if (k.startsWith('01')) {
		if (ARAMAIO.has(k)) L({ ...u, regio: 'Euskadi', unitat: 'Araba', domeni: 'basc', dialecte: 'mendebalekoa', parlar: 'sortaldekoa', nota: 'Seule commune d\'Alava où le basque ne s\'est jamais perdu.', font: 'LEU Z08' });
		else if (LEGUTIO.has(k)) L({ ...u, regio: 'Euskadi', unitat: 'Araba', domeni: 'basc', dialecte: 'mendebalekoa', parlar: 'tartekoa', nota: 'Basque toujours parlé (Zuazo).', font: 'LEU Z08' });
		else L({ ...u, regio: 'Euskadi', unitat: 'Araba', domeni: 'desaparegut', dialecte: 'arabakoa', nota: 'Basque alavais, disparu vers la fin du XVIIIe siècle (choix de Romain : teinte à part).', font: 'Z08' });
		continue;
	}
	if (k.startsWith('48')) {
		const c = comB.get(k);
		const enk = c === 'Las Encartaciones';
		L({ ...u, regio: 'Euskadi', unitat: c || '?', domeni: 'basc', dialecte: 'mendebalekoa', parlar: OTXANDIO.has(k) ? 'tartekoa' : PARL_B[c] || '', transicio: enk ? 'es' : '', nota: enk ? 'Encartaciones : langue officielle (loi), mais castillan depuis le Moyen Âge.' : '', font: 'LEU Z08 VQ-ES' });
		continue;
	}
	if (k.startsWith('20')) {
		const c = comG.get(k);
		let d = { dialecte: 'erdialdekoa', parlar: OIARTZUN.has(k) ? 'oiartzun_bidasoa' : PARL_G[c] || '' };
		if (c === 'Alto Deva') d = { dialecte: 'mendebalekoa', parlar: 'sortaldekoa' };
		else if (c === 'Bajo Deva') d = DEBA_TART.has(k) ? { dialecte: 'mendebalekoa', parlar: 'sortaldekoa', transicio: 'erd', nota: 'Entre biscayen et guipuscoan (Zuazo 2008).' } : { dialecte: 'mendebalekoa', parlar: 'sortaldekoa' };
		L({ ...u, regio: 'Euskadi', unitat: c || '?', domeni: 'basc', ...d, font: 'LEU Z08 VQ-ES' });
		continue;
	}
	L({ ...u, regio: '?', domeni: 'exclos', nota: 'Province inattendue', font: '' });
}

// ---------------- Escritura ----------------
const COL = ['regio', 'unitat', 'mena', 'nom_oficial', 'nom_eu', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio', 'part_oc', 'nota', 'font'];
const esc = (v) => { v = String(v ?? ''); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
fs.mkdirSync(path.join(R, 'SIG/basc'), { recursive: true });
fs.writeFileSync(path.join(R, 'SIG/basc/dialectes-basc.csv'), '﻿' + [COL.join(';'), ...linhas.map((l) => COL.map((c) => esc(l[c])).join(';'))].join('\n') + '\n');

const comptar = (f) => { const c = {}; for (const l of linhas) { const k = f(l); c[k] = (c[k] || 0) + 1; } return c; };
console.log(linhas.length, 'linhas');
console.log(comptar((l) => `${l.regio} ${l.domeni}`));
console.log(comptar((l) => (['basc', 'mixta', 'desaparegut'].includes(l.domeni) ? `${l.dialecte} / ${l.parlar}${l.transicio ? ' (' + l.transicio + ')' : ''}` : l.domeni)));
if (mancants.length) console.log('PAS TROBATS (' + mancants.length + ') : ' + mancants.join(' | '));
