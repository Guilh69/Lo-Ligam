// Calandretas : fabrica app/static/data/calandretas.geojson a partir de l'Annuaire de l'education
// (data.education.gouv.fr, jeu fr-en-annuaire-education, Licence Ouverte 2.0).
//
// Usage, depuis n'importe quel dossier :  node SIG/cadena/calandretas.mjs
//
// Ce que fait le script :
// 1. interroge l'API (codes UAI connus + noms en calandreta, calendreta, calentreta, Còrdas) ;
//    la reponse brute est gardee dans SIG/brut/calandretas/ ; sans reseau, il reprend ce fichier ;
// 2. previent si un code UAI connu a disparu (l'annuaire ne garde que les etablissements ouverts :
//    une ecole fermee disparait, elle ne change pas d'etat) ;
// 3. signale les nouveaux etablissements prives au nom de Calandreta, sans les ajouter :
//    il faut les verifier puis ajouter leur code a la liste CONEGUTS ci-dessous ;
// 4. ecrit le GeoJSON (nom occitan tire du nom officiel, sans le prefixe administratif francais)
//    et la liste de controle des noms SIG/calandretas/noms-a-validar.csv.
//
// Noms valides par Romain : s'il existe un fichier SIG/calandretas/noms-validats.csv
// (separateur ;, premiere ligne avec les colonnes uai et nom, ou bien une copie corrigee
// de noms-a-validar.csv dont on lit la colonne nom_retengut), ses noms remplacent les noms calcules.
// UTF-8 ou Windows-1252 (enregistrement Excel) acceptes.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(DIR, '../brut/calandretas');
const REVISION = path.resolve(DIR, '../calandretas');
const SORTIDA = path.resolve(DIR, '../../app/static/data/calandretas.geojson');
const LIMITS = path.resolve(DIR, '../../app/static/data/limits-carta.json');

const API = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education';

// Les 58 etablissements releves le 2026-10-07 : 53 ecoles, 4 colleges, 1 lycee.
const CONEGUTS = [
	'0050634M', '0090659T', '0090692D', '0111000C', '0111001D', '0111026F', '0111027G', '0111028H',
	'0111037T', '0121453P', '0121473L', '0134555F', '0150773J', '0241241U', '0241350M', '0301519N',
	'0301729S', '0312485H', '0312486J', '0312558M', '0312850E', '0312885T', '0312889X', '0312919E',
	'0313239C', '0333152X', '0341886R', '0341889U', '0342001R', '0342002S', '0342003T', '0342004U',
	'0342012C', '0342145X', '0342279T', '0342399Y', '0342410K', '0342438R', '0431011R', '0431024E',
	'0471041B', '0641903W', '0641904X', '0641905Y', '0641906Z', '0641950X', '0642011N', '0642032L',
	'0642051G', '0651019E', '0651027N', '0811270R', '0811336M', '0811337N', '0811350C', '0841004K',
	'0841226B', '0875013B'
];

// Remarques ecrites a la main pour Romain (colonne nota du CSV), relevees le 2026-10-07
// en comparant l'annuaire, la carte de la Confederacion, OpenStreetMap et le geocodage
// des adresses officielles (data.geopf.fr).
const NOTAS = {
	'0111001D': 'OSM l\'appelle « Calandreta de Carcassona - Miquèl Decòr »',
	'0312486J': 'nom en français dans l\'annuaire (« Côte Pavée »)',
	'0312485H': 'le nom officiel commence par « Escola », gardé tel quel',
	'0090659T': 'OSM (name:oc) l\'appelle aussi « Calandreta del País de Pàmias »',
	'0431024E': 'commune à vérifier : le point de l\'annuaire est à Vals-le-Chastel, là où la Confederacion donne aussi l\'adresse de l\'école (Le Bourg, Vals-le-Chastel). C\'est sans doute l\'adresse officielle à Langeac (19 km plus loin) qui est ancienne, et donc la commune affichée',
	'0312889X': 'position à vérifier : l\'adresse officielle (esplanade Sainte-Germaine à Pibrac), OSM (avec ce code UAI) et la carte de l\'OPLO placent l\'école au centre de Pibrac. Le point de l\'annuaire, repris par la Confederacion, est 4,8 km plus à l\'ouest, côté Léguevin (ancien site ? l\'adresse électronique de l\'école commence par « cap.legavin »)',
	'0811337N': 'position incertaine : l\'annuaire, la Confederacion et l\'OPLO placent l\'école en ville, mais l\'adresse officielle (1140 route de Cordes, lieu-dit Boissel) et OSM la placent 3,9 km au nord-est',
	'0121453P': 'adresse différente sur la carte de la Confederacion (rue de la Gare, à 1,5 km) : déménagement ?',
	'0134555F': 'école hors contrat',
	'0841226B': 'école hors contrat',
	'0342012C': 'même adresse que le lycée 0342410K (points à 50 m)',
	'0342410K': 'même adresse que le collège 0342012C (points à 50 m)',
	'0642011N': 'même adresse que l\'école de Pau 0641906Z (points à 20 m)'
};

// Carte de la Confederacion Calandreta (uMap 401511) : sert seulement a comparer
// l'orthographe des noms dans le CSV de controle. Pas de licence : ne pas republier.
const CONFEDERACION = {
	escolas: 'https://umap.openstreetmap.fr/fr/datalayer/401511/bcc79c8f-e6f6-49e0-bf79-518126634160/',
	segond: 'https://umap.openstreetmap.fr/fr/datalayer/401511/caa6b28c-0547-485d-a9e5-6b8e1228acc8/'
};

const MENA = { Ecole: 'escòla', 'Collège': 'collègi', 'Lycée': 'licèu' };
const PARTICULAS = new Set(['de', 'del', 'dels', 'deu', 'deth', 'dau', 'dei', 'das', 'la', 'lo', 'los', 'las', 'eth', 'era', 'e']);
const CAL = /^(calandr|calendr|calentr)/i;

const avis = [];
const avisar = (m) => { avis.push(m); console.warn('ATENCION : ' + m); };

// ---------- 1. Telechargement ----------
async function prene(url) {
	const r = await fetch(url, { headers: { 'User-Agent': 'LoLigam-carta/1.0' } });
	if (!r.ok) throw new Error(`HTTP ${r.status} pour ${url}`);
	return r.text();
}

const camps = [
	'identifiant_de_l_etablissement', 'nom_etablissement', 'type_etablissement', 'statut_public_prive',
	'nom_commune', 'adresse_1', 'web', 'telephone', 'mail', 'position'
].join(',');
const ou = [
	`identifiant_de_l_etablissement in (${CONEGUTS.map((c) => `"${c}"`).join(',')})`,
	'search(nom_etablissement,"calandreta")',
	'search(nom_etablissement,"calendreta")',
	'search(nom_etablissement,"calentreta")',
	'nom_etablissement like "%Còrdas%"'
].join(' or ');
const urlExport = `${API}/exports/geojson?select=${encodeURIComponent(camps)}&where=${encodeURIComponent(ou)}`;

fs.mkdirSync(BRUT, { recursive: true });
const brutFic = path.join(BRUT, 'annuaire-calandretas.geojson');
const metaFic = path.join(BRUT, 'annuaire-meta.json');
let brut, meta;
try {
	brut = await prene(urlExport);
	meta = await prene(API);
	fs.writeFileSync(brutFic, brut);
	fs.writeFileSync(metaFic, meta);
} catch (e) {
	avisar(`API injoignable (${e.message}) : je reprends ${path.relative(DIR, brutFic)}`);
	brut = fs.readFileSync(brutFic, 'utf8');
	meta = fs.readFileSync(metaFic, 'utf8');
}
const g = JSON.parse(brut);
const m = JSON.parse(meta).metas.default;
if (!/Licence Ouverte/i.test(m.license || '')) avisar(`licence du jeu changée : « ${m.license} »`);
const dataJoc = String(m.modified || '').slice(0, 10);

// ---------- 2. Controles de la liste ----------
const parUai = new Map(g.features.map((f) => [f.properties.identifiant_de_l_etablissement, f]));
const coneguts = new Set(CONEGUTS);
for (const c of CONEGUTS) if (!parUai.has(c)) avisar(`le code UAI ${c} a disparu de l'annuaire (école fermée ou code changé ?)`);
for (const [c, f] of parUai) {
	const p = f.properties;
	if (coneguts.has(c) || p.statut_public_prive !== 'Privé') continue;
	avisar(`nouvel établissement à examiner : ${c} « ${p.nom_etablissement} » (${p.nom_commune}). S'il s'agit d'une Calandreta, ajouter son code à CONEGUTS.`);
}

// ---------- 3. Nom occitan ----------
const majuscula = (s) => s.charAt(0).toLocaleUpperCase('fr') + s.slice(1);
function mot(w, premier, toutMaj) {
	const bas = w.toLocaleLowerCase('fr');
	const apos = bas.match(/^([dl])['’](.+)$/);
	if (apos && !premier) return apos[1] + "'" + (toutMaj ? majuscula(apos[2]) : w.slice(2));
	if (!premier && PARTICULAS.has(bas)) return bas;
	if (toutMaj) return majuscula(bas);
	return premier ? majuscula(w) : w;
}
function nomOccitan(oficial) {
	let s = oficial.replace(/\s+/g, ' ').trim();
	s = s.replace(/\s*\((?:[ée]cole|coll[èe]ge|lyc[ée]e)[^)]*\)\s*$/i, '');
	s = s.replace(/^E\.P\.PR\.HC\s+/i, '');
	s = s.replace(/^(?:[ée]cole|coll[èe]ge|lyc[ée]e)(?:\s+(?:primaire|maternelle|[ée]l[ée]mentaire|secondaire|priv[ée]e?|PR|HC))*\s+/i, '');
	s = s.replace(/^la\s+(?=cal)/i, '');
	const toutMaj = s === s.toLocaleUpperCase('fr');
	return s.split(' ').map((w, i) => mot(w, i === 0, toutMaj)).join(' ');
}

// Lecture d'un CSV a point-virgule (champs entre guillemets acceptes). Excel enregistre
// parfois en Windows-1252 au lieu d'UTF-8 : on essaie UTF-8, sinon Windows-1252.
function legirCsv(fic) {
	const octets = fs.readFileSync(fic);
	let t;
	try {
		t = new TextDecoder('utf-8', { fatal: true }).decode(octets);
	} catch {
		t = new TextDecoder('windows-1252').decode(octets);
		avisar(`${path.basename(fic)} n'est pas en UTF-8 : lu comme Windows-1252, vérifier les accents`);
	}
	const linhas = [];
	for (const l of t.replace(/^\uFEFF/, '').split(/\r?\n/)) {
		if (!l.trim()) continue;
		const c = [];
		let v = '', cotas = false;
		for (let i = 0; i < l.length; i++) {
			const ch = l[i];
			if (cotas) {
				if (ch === '"' && l[i + 1] === '"') { v += '"'; i++; }
				else if (ch === '"') cotas = false;
				else v += ch;
			} else if (ch === '"') cotas = true;
			else if (ch === ';') { c.push(v); v = ''; }
			else v += ch;
		}
		c.push(v);
		linhas.push(c.map((x) => x.trim()));
	}
	return linhas;
}

// noms-validats.csv : soit deux colonnes uai;nom, soit une copie corrigee de noms-a-validar.csv
// (on lit alors la colonne nom_retengut, jamais nom_oficial).
let validats = new Map();
const validFic = path.join(REVISION, 'noms-validats.csv');
if (fs.existsSync(validFic)) {
	const [cap = [], ...linhas] = legirCsv(validFic);
	const iUai = cap.indexOf('uai');
	const iNom = cap.includes('nom_retengut') ? cap.indexOf('nom_retengut') : cap.indexOf('nom');
	if (iUai < 0 || iNom < 0) {
		avisar(`${path.basename(validFic)} ignoré : il faut une première ligne avec les colonnes « uai » et « nom » (ou « nom_retengut »)`);
	} else {
		for (const c of linhas) {
			const u = c[iUai], n = (c[iNom] || '').replace(/\s+/g, ' ');
			if (!u) continue;
			if (!CONEGUTS.includes(u)) avisar(`${path.basename(validFic)} : code UAI inconnu ${u}, ligne ignorée`);
			else if (!n) avisar(`${path.basename(validFic)} : nom vide pour ${u}, nom calculé gardé`);
			else validats.set(u, n);
		}
		console.log(`${validats.size} noms validés repris de ${path.relative(DIR, validFic)}`);
	}
}

// Correspondance avec la carte de la Confederacion : meme couche (ecoles ou secondaire),
// a moins de 30 km ; on prend l'adresse qui partage le plus de mots avec l'adresse officielle,
// puis la plus proche ; sans mot commun, seulement si elle est a moins de 3 km.
const confed = { escolas: [], segond: [] };
for (const [k, url] of Object.entries(CONFEDERACION)) {
	const fic = path.join(BRUT, `umap-confederacion-${k}.geojson`);
	try {
		fs.writeFileSync(fic, await prene(url));
	} catch (e) {
		if (!fs.existsSync(fic)) { console.log(`Carte de la Confederacion (${k}) indisponible : pas de comparaison des noms.`); continue; }
	}
	confed[k] = JSON.parse(fs.readFileSync(fic, 'utf8')).features.filter((f) => f.geometry && f.geometry.type === 'Point');
}
const VOIES = new Set(['rue', 'avenue', 'chemin', 'route', 'place', 'boulevard', 'impasse', 'allee', 'lieu', 'dit', 'grand', 'grande', 'saint', 'sainte']);
const mots = (s) => new Set(
	(s || '').normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !VOIES.has(w))
);
const km = (p, q) => {
	const k = Math.PI / 180;
	return 6371 * Math.hypot((q[0] - p[0]) * k * Math.cos(((p[1] + q[1]) / 2) * k), (q[1] - p[1]) * k);
};
function nomConfederacion(p, coords) {
	const liste = p.type_etablissement === 'Ecole' ? confed.escolas : confed.segond;
	const m1 = mots(p.adresse_1);
	let melhor = null;
	for (const f of liste) {
		const d = km(coords, f.geometry.coordinates);
		if (d > 30) continue;
		const m2 = mots(f.properties.Adresse);
		const comuns = [...m1].filter((w) => m2.has(w)).length;
		if (!melhor || comuns > melhor.comuns || (comuns === melhor.comuns && d < melhor.d)) melhor = { comuns, d, nom: f.properties.name };
	}
	if (!melhor || (melhor.comuns === 0 && melhor.d > 3)) return null;
	return melhor.nom.replace(/’/g, "'").replace(/\s+/g, ' ').trim();
}

// ---------- 4. Controle geographique (domaine de la langue, regle pair-impair) ----------
const anels = JSON.parse(fs.readFileSync(LIMITS, 'utf8')).domeni.anels;
function dinsDomeni([x, y]) {
	let dins = false;
	for (const a of anels)
		for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
			const [xi, yi] = a[i], [xj, yj] = a[j];
			if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dins = !dins;
		}
	return dins;
}

// ---------- 5. Ecriture ----------
const r5 = (v) => Math.round(v * 1e5) / 1e5;
const fonts = `Annuaire de l'éducation, ministère de l'Éducation nationale, Licence Ouverte 2.0 (${dataJoc})`;
const entitats = [];
const linhasCsv = [];
const calculats = new Map();
for (const c of [...CONEGUTS].sort()) {
	const f = parUai.get(c);
	if (!f) continue;
	const p = f.properties;
	if (!f.geometry || f.geometry.type !== 'Point') { avisar(`${c} sans coordonnées, laissé de côté`); continue; }
	const coords = f.geometry.coordinates.map(r5);
	if (!coords.every(Number.isFinite)) { avisar(`${c} coordonnées invalides`); continue; }
	if (!dinsDomeni(coords)) avisar(`${c} (${p.nom_commune}) est hors du domaine de la langue`);
	const mena = MENA[p.type_etablissement];
	if (!mena) avisar(`${c} type inattendu « ${p.type_etablissement} »`);
	const oficial = p.nom_etablissement.replace(/\s+/g, ' ').trim();
	const calcul = nomOccitan(oficial);
	calculats.set(c, calcul);
	const nom = validats.get(c) || calcul;
	const web = (p.web || '').trim();
	const tel = String(p.telephone || '').replace(/\s/g, ''),
		corr = String(p.mail || '').trim();
	entitats.push({
		type: 'Feature',
		geometry: { type: 'Point', coordinates: coords },
		properties: {
			uai: c,
			mena,
			nom,
			nom_oficial: oficial,
			comuna: p.nom_commune.replace(/\s+/g, ' ').trim(),
			ligam: web ? (/^https?:\/\//i.test(web) ? web : 'https://' + web) : null,
			// lo contacte de l'annuari (retorn de Romain : lo site se n'i a un,
			// siquenon lo contacte que dona lo ministèri)
			telefon: /^0\d{9}$/.test(tel) ? tel.replace(/(\d\d)(?=\d)/g, '$1 ') : null,
			corrièl: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(corr) ? corr.toLowerCase() : null
		}
	});
	// remarques automatiques pour la relecture
	const nota = [];
	if (validats.has(c)) nota.push('nom validé');
	if (!/\s/.test(nom) && CAL.test(nom)) nota.push('pas de nom propre dans l\'annuaire');
	const graf = nom.match(/\b(calendreta|calandréta|calendréta|calentreta)\b/i);
	if (graf) nota.push(`graphie de l'annuaire gardée (« ${graf[1]} »)`);
	if (!validats.has(c) && !oficial.includes(calcul)) nota.push('majuscules ajustées');
	const nc = nomConfederacion(p, coords);
	if (nc && nc !== nom) nota.push(`carte de la Confederacion : « ${nc} »`);
	if (NOTAS[c]) nota.push(NOTAS[c]);
	linhasCsv.push([c, oficial, nom, entitats.at(-1).properties.comuna, nota.join(', ')]);
}

const json =
	'{"type":"FeatureCollection","font":' + JSON.stringify(fonts) + ',"features":[\n' +
	entitats.map((e) => JSON.stringify(e)).join(',\n') + '\n]}\n';
fs.writeFileSync(SORTIDA, json);

const camp = (v) => (/[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
fs.mkdirSync(REVISION, { recursive: true });
// Si Romain a corrige la colonne nom_retengut directement dans noms-a-validar.csv,
// on garde une copie avant de reecrire le fichier, pour ne pas perdre son travail.
const revFic = path.join(REVISION, 'noms-a-validar.csv');
if (fs.existsSync(revFic)) {
	const [cap = [], ...ancianas] = legirCsv(revFic);
	const iU = cap.indexOf('uai'), iN = cap.indexOf('nom_retengut');
	const novels = new Map(linhasCsv.map((l) => [l[0], l[2]]));
	const cambiats = iU < 0 || iN < 0 ? [] : ancianas.filter(
		(c) => novels.has(c[iU]) && c[iN] && c[iN] !== novels.get(c[iU]) && c[iN] !== calculats.get(c[iU])
	);
	if (cambiats.length) {
		const copia = path.join(REVISION, 'noms-a-validar.anterior.csv');
		fs.copyFileSync(revFic, copia);
		avisar(`${cambiats.length} nom(s) corrigé(s) à la main dans noms-a-validar.csv (${cambiats.map((c) => c[iU]).join(', ')}) : copie gardée dans ${path.basename(copia)}. Pour qu'ils servent, enregistrer ce fichier sous le nom noms-validats.csv`);
	}
}
fs.writeFileSync(
	revFic,
	'\uFEFF' + ['uai;nom_oficial;nom_retengut;comuna;nota', ...linhasCsv.map((l) => l.map(camp).join(';'))].join('\r\n') + '\r\n'
);

const compte = (k) => entitats.filter((e) => e.properties.mena === k).length;
console.log(
	`${entitats.length} établissements écrits (${compte('escòla')} écoles, ${compte('collègi')} collèges, ${compte('licèu')} lycée) ` +
	`dans ${path.relative(path.resolve(DIR, '../..'), SORTIDA)}, ${(Buffer.byteLength(json) / 1024).toFixed(1)} Ko. Jeu du ${dataJoc}.`
);
if (avis.length) console.log(`${avis.length} avertissement(s), voir plus haut.`);
