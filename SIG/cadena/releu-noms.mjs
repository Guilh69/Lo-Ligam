// Noms du relief (jaça « Massís e montanhas ») : liste choisie à la main de
// massifs, plateaux, causses, chaînes et sommets, posés en étiquettes sur le
// relief (aucune source ouverte ne donne de contours fiables des massifs).
//
//   node SIG/cadena/releu-noms.mjs           fabrique app/static/data/releu-noms.json
//   node SIG/cadena/releu-noms.mjs --osm     essaie aussi de télécharger les name:oc d'OpenStreetMap
//   node SIG/cadena/releu-noms.mjs --refar   réinterroge Wikidata et OpenStreetMap
//
// Positions, altitudes et noms occitans : Wikidata (CC0), interrogé une fois
// et gardé dans SIG/brut/natura/wikidata-releu.json. Quand Wikidata n'a pas de
// nom occitan, on prend le name:oc d'OpenStreetMap (ODbL) d'un sommet situé à
// moins de 1 km, s'il a pu être téléchargé (SIG/brut/natura/osm-natural-name-oc.json,
// option --osm : les serveurs Overpass sont souvent saturés).
// Aucun nom occitan n'est inventé : sans source, « oc » vaut null.
// Liste à valider par Romain : SIG/natura/noms-releu-a-validar.csv.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(AQUI, '../brut/natura');
const DATA = path.resolve(AQUI, '../../app/static/data');
const REVISION = path.resolve(AQUI, '../natura');
const REFAR = process.argv.includes('--refar');
const UA = 'LoLigam-carta/0.1 (preparation de donnees pour une carte de la langue occitane)';

// ------------------------------------------------------------------ la liste
// [élément Wikidata, mena, renc, options]
// mena : cadena (chaîne), massis (massif), plan (plateau, causse), som (sommet)
// renc : 1 très grand ensemble ou sommet très connu, 2 majeur, 3 secondaire
// options : fr (nom français affiché, si le libellé Wikidata ne convient pas),
//   pos [lon, lat] (position de l'étiquette choisie à la main, quand Wikidata
//   donne le point culminant ou un point hors du domaine), corba (lo nom d'una
//   cadena seguís aquela corba : debuta, ponch de contraròtle, fin), ang (angle de
//   l'étiquette en degrés, sens des aiguilles d'une montre comme CSS rotate() :
//   positif = le texte descend vers la droite), nota (pour la liste à valider).
const LISTA = [
  // grands ensembles
  ['Q12431', 'cadena', 1, { pos: [0.45, 42.88], ang: 9, nota: 'position choisie dans les Pyrénées occitanes', corba: [[-1.2,43.05],[0.6,42.7],[2.3,42.78]] }],
  ['Q1286', 'cadena', 1, { fr: 'Alpes', pos: [6.55, 44.55], ang: 60, nota: 'position choisie dans les Alpes occitanes', corba: [[6.25,45.05],[6.45,44.45],[7.05,44.1]] }],
  ['Q190695', 'massis', 1, { pos: [3.35, 45.3], nota: "position choisie au centre du massif, à l'écart des monts du Cantal" }],
  ['Q626655', 'massis', 1, { pos: [3.75, 44.22], ang: -45, nota: 'Wikidata place les Cévennes au sommet du mont Lozère : étiquette déplacée entre Lozère et Aigoual', corba: [[3.45,44.02],[3.8,44.17],[4.1,44.5]] }],
  // Massif central
  ['Q1276372', 'massis', 2, { pos: [2.80, 45.14], nota: 'Wikidata place le massif au puy Mary : étiquette décalée' }],
  ['Q1475954', 'massis', 2, { pos: [2.86, 45.58], nota: 'étiquette décalée du puy de Sancy' }],
  ['Q1068630', 'cadena', 2, { pos: [2.90, 45.86], ang: -85, nota: 'étiquette décalée du puy de Dôme' }],
  ['Q338815', 'plan', 3, {}],
  ['Q758500', 'plan', 2, { pos: [2.98, 44.65], nota: 'Wikidata place l\'Aubrac au signal de Mailhebiau : étiquette décalée' }],
  ['Q1437352', 'massis', 2, {}],
  ['Q605382', 'massis', 2, { pos: [3.62, 44.44], nota: 'étiquette décalée du sommet de Finiels' }],
  ['Q286993', 'plan', 2, { fr: 'Larzac' }],
  ['Q1051635', 'plan', 2, {}],
  ['Q1051630', 'plan', 3, {}],
  ['Q1051626', 'plan', 3, {}],
  ['Q944251', 'plan', 3, {}],
  ['Q2943162', 'plan', 3, {}],
  ['Q1509963', 'massis', 2, { pos: [2.35, 43.43], ang: -12, nota: 'Wikidata place le massif au pic de Nore : étiquette décalée', corba: [[1.95,43.38],[2.35,43.42],[2.8,43.5]] }],
  ['Q1998742', 'massis', 3, {}],
  ['Q827405', 'massis', 3, { fr: 'Monts de l\'Espinouse', pos: [2.88, 43.63], nota: 'élément Wikidata « Caroux-Espinouse » ; étiquette décalée du mont Caroux' }],
  ['Q1998725', 'massis', 3, {}],
  ['Q1780115', 'plan', 2, {}],
  ['Q3297683', 'plan', 3, { fr: 'Devès' }],
  ['Q1368135', 'plan', 3, {}],
  ['Q3514968', 'massis', 3, {}],
  ['Q3323158', 'massis', 2, { pos: [4.40, 45.0], ang: -50, nota: 'étiquette décalée du mont Mézenc et du Gerbier', corba: [[4.15,44.75],[4.35,44.98],[4.7,45.25]] }],
  ['Q3323161', 'massis', 3, { pos: [3.85, 45.55], ang: -85, nota: 'étiquette décalée de Pierre-sur-Haute' }],
  ['Q31638932', 'massis', 3, {}],
  ['Q1907628', 'massis', 3, {}],
  ['Q2380890', 'massis', 3, {}],
  ['Q3323133', 'massis', 3, {}],
  // Languedoc, Pyrénées
  ['Q1115037', 'massis', 2, { fr: 'Corbières', pos: [2.55, 43.0], nota: 'étiquette décalée du mont Tauch' }],
  ['Q3297653', 'massis', 3, {}],
  ['Q180136', 'massis', 3, {}],
  ['Q3297700', 'cadena', 3, { fr: 'Plantaurel', ang: 10 }],
  ['Q3297641', 'massis', 3, {}],
  ['Q3297696', 'massis', 3, { pos: [0.14, 42.85], nota: 'Wikidata place le massif au pic Long : étiquette décalée' }],
  ['Q1549241', 'plan', 3, {}],
  ['Q3373512', 'plan', 3, {}],
  // Provence
  ['Q1780121', 'massis', 2, { fr: 'Luberon' }],
  ['Q2096741', 'massis', 3, {}],
  ['Q3391918', 'plan', 3, {}],
  ['Q3391870', 'plan', 3, {}],
  ['Q1518970', 'massis', 2, {}],
  ['Q581005', 'massis', 2, {}],
  ['Q2107098', 'massis', 2, { fr: 'Alpilles' }],
  ['Q1761198', 'massis', 2, { ang: -20, corba: [[6.05,43.2],[6.4,43.26],[6.7,43.38]] }],
  ['Q1369923', 'massis', 2, {}],
  ['Q2933615', 'massis', 3, { fr: 'Massif des Calanques' }],
  ['Q2935247', 'plan', 3, {}],
  ['Q1463472', 'massis', 3, {}],
  ['Q1189890', 'massis', 3, {}],
  // Alpes
  ['Q3297688', 'massis', 2, { fr: 'Mercantour-Argentera', pos: [6.95, 44.2], ang: 30, nota: 'Wikidata place le massif à la cime du Gélas : étiquette décalée côté français' }],
  ['Q2451856', 'cadena', 2, { pos: [7.45, 44.28], ang: 20, nota: 'étiquette posée côté italien (vallées Gesso et Vermenagna)', corba: [[7,44.4],[7.45,44.33],[7.85,44.1]] }],
  ['Q1251', 'cadena', 2, { pos: [6.98, 44.92], ang: -80, nota: 'Wikidata place la chaîne au mont Viso : étiquette décalée' }],
  ['Q2326825', 'massis', 3, {}],
  ['Q1435063', 'massis', 2, {}],
  ['Q783061', 'massis', 3, {}],
  ['Q656421', 'massis', 2, { pos: [6.30, 44.85], nota: 'étiquette décalée de la barre des Écrins' }],
  ['Q2066577', 'massis', 3, { nota: 'élément Wikidata de la vallée du Queyras (le massif n\'a pas de nom occitan dans Wikidata)' }],

  // sommets : Pyrénées
  ['Q1348903', 'som', 1, {}],
  ['Q2298456', 'som', 2, {}],
  ['Q73077', 'som', 1, {}],
  ['Q1139060', 'som', 1, {}],
  ['Q2030914', 'som', 2, {}],
  ['Q3088745', 'som', 3, {}],
  ['Q3141369', 'som', 2, {}],
  ['Q3141527', 'som', 3, {}],
  ['Q2746829', 'som', 3, {}],
  ['Q2859683', 'som', 3, { fr: "Pic d'Arbizon" }],
  ['Q3382373', 'som', 3, {}],
  ['Q2746833', 'som', 3, {}],
  ['Q11953291', 'som', 3, {}],
  ['Q3176503', 'som', 3, {}],
  ['Q2420742', 'som', 2, {}],
  ['Q3382354', 'som', 3, {}],
  ['Q3382425', 'som', 3, {}],
  ['Q1479975', 'som', 2, {}],
  ['Q1537733', 'som', 2, {}],
  ['Q929390', 'som', 3, {}],
  ['Q3382418', 'som', 3, {}],
  ['Q49753292', 'som', 3, {}],
  ['Q73420', 'som', 2, {}],
  ['Q3322132', 'som', 3, {}],
  ['Q1568041', 'som', 2, {}],
  // Massif central, Languedoc
  ['Q778597', 'som', 1, {}],
  ['Q607372', 'som', 1, {}],
  ['Q3411078', 'som', 3, {}],
  ['Q2882838', 'som', 3, {}],
  ['Q991088', 'som', 1, {}],
  ['Q2119428', 'som', 2, {}],
  ['Q568090', 'som', 3, {}],
  ['Q1836325', 'som', 1, {}],
  ['Q1804191', 'som', 2, {}],
  ['Q1267547', 'som', 2, {}],
  ['Q626222', 'som', 2, {}],
  ['Q1505935', 'som', 3, {}],
  ['Q2285075', 'som', 3, {}],
  ['Q3321968', 'som', 3, {}],
  ['Q2427038', 'som', 2, {}],
  ['Q3411098', 'som', 3, {}],
  ['Q3321845', 'som', 3, {}],
  ['Q1454180', 'som', 3, {}],
  ['Q97164217', 'som', 3, {}],
  ['Q1307926', 'som', 2, {}],
  ['Q3321726', 'som', 3, {}],
  ['Q3321706', 'som', 3, {}],
  ['Q1945436', 'som', 3, {}],
  // Provence
  ['Q209064', 'som', 1, {}],
  ['Q3098391', 'som', 3, {}],
  ['Q1648147', 'som', 3, {}],
  ['Q2983361', 'som', 3, {}],
  ['Q528586', 'som', 3, {}],
  // Alpes
  ['Q1337859', 'som', 2, {}],
  ['Q2105265', 'som', 3, {}],
  ['Q1813560', 'som', 3, {}],
  ['Q3382358', 'som', 3, {}],
  ['Q1758304', 'som', 2, {}],
  ['Q826235', 'som', 3, {}],
  ['Q2401467', 'som', 3, {}],
  ['Q2972423', 'som', 3, {}],
  ['Q745803', 'som', 3, {}],
  ['Q2827877', 'som', 2, {}],
  ['Q3113537', 'som', 3, {}],
  ['Q2972421', 'som', 3, {}],
  ['Q2544155', 'som', 3, {}],
  ['Q1157013', 'som', 3, {}],
  ['Q30480', 'som', 1, {}],
  ['Q1440833', 'som', 3, {}],
  ['Q1605356', 'som', 2, {}],
  ['Q2206161', 'som', 3, {}],
  ['Q1290356', 'som', 3, {}],
  // vallées occitanes d'Italie
  ['Q1248', 'som', 1, {}],
  ['Q2060375', 'som', 2, {}],
  ['Q1413307', 'som', 3, {}],
  ['Q1115794', 'som', 3, {}],
  ['Q2289005', 'som', 3, {}],
  ['Q3898991', 'som', 3, {}],
  ['Q3861443', 'som', 3, {}],
  ['Q2197217', 'som', 3, {}],
  // Gascogne
  ['Q501726', 'som', 3, { nota: 'dune (point le plus haut, variable)' }],
  // testés : gardés seulement s'ils tombent dans le domaine
  ['Q1142549', 'som', 3, { nota: 'crêt de la Perdrix (Pilat), à garder seulement dans le domaine' }],
];

// ------------------------------------------------------------- Wikidata
async function wikidata() {
  const cache = path.join(BRUT, 'wikidata-releu.json');
  const ids = [...new Set(LISTA.map(l => l[0]))];
  let w = {};
  if (fs.existsSync(cache) && !REFAR) w = JSON.parse(fs.readFileSync(cache, 'utf8'));
  const manquants = ids.filter(id => !(id in w));
  if (manquants.length) {
    const q = `SELECT ?item ?fr ?oc ?it ?coord ?alt WHERE {
      VALUES ?item { ${manquants.map(i => 'wd:' + i).join(' ')} }
      OPTIONAL { ?item rdfs:label ?fr FILTER(LANG(?fr)="fr") }
      OPTIONAL { ?item rdfs:label ?oc FILTER(LANG(?oc)="oc") }
      OPTIONAL { ?item rdfs:label ?it FILTER(LANG(?it)="it") }
      OPTIONAL { ?item wdt:P625 ?coord }
      OPTIONAL { ?item wdt:P2044 ?alt }
    }`;
    const r = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'query=' + encodeURIComponent(q),
    });
    if (!r.ok) throw new Error('Wikidata : HTTP ' + r.status);
    for (const b of (await r.json()).results.bindings) {
      const id = b.item.value.split('/').pop();
      const x = (w[id] ??= { fr: null, oc: null, it: null, coords: [], alts: [] });
      x.fr ??= b.fr?.value ?? null;
      x.oc ??= b.oc?.value ?? null;
      x.it ??= b.it?.value ?? null;
      const m = b.coord?.value.match(/^Point\(([-\d.eE]+) ([-\d.eE]+)\)$/);
      if (m && !x.coords.some(c => c[0] === +m[1] && c[1] === +m[2])) x.coords.push([+m[1], +m[2]]);
      if (b.alt && !x.alts.includes(+b.alt.value)) x.alts.push(+b.alt.value);
    }
    fs.writeFileSync(cache, JSON.stringify(w, null, 1));
  }
  return w;
}

// --------------------------------------------- OpenStreetMap (facultatif)
async function osm() {
  const f = path.join(BRUT, 'osm-natural-name-oc.json');
  if ((!fs.existsSync(f) && process.argv.includes('--osm')) || REFAR) {
    const q = '[out:json][timeout:180];nwr["natural"]["name:oc"](42.2,-2.0,46.6,8.0);out tags center;';
    for (const ep of ['https://overpass.private.coffee/api/interpreter', 'https://overpass-api.de/api/interpreter']) {
      try {
        const r = await fetch(ep, { method: 'POST', headers: { 'User-Agent': UA }, body: 'data=' + encodeURIComponent(q), signal: AbortSignal.timeout(200000) });
        const t = await r.text();
        if (r.ok && t.startsWith('{')) { fs.writeFileSync(f, t); break; }
      } catch { /* serveur occupé : on essaie le suivant */ }
    }
  }
  if (!fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, 'utf8')).elements.map(e => ({
    id: `${e.type}/${e.id}`, natural: e.tags.natural, name: e.tags.name, oc: e.tags['name:oc'],
    src: e.tags['source:name:oc'] || null, lon: e.lon ?? e.center?.lon, lat: e.lat ?? e.center?.lat,
  })).filter(e => e.lon != null);
}

// --------------------------------------------------------------- géométrie
const lim = JSON.parse(fs.readFileSync(path.join(DATA, 'limits-carta.json'), 'utf8'));
const ANELS = lim.domeni.anels;
function dinsDomeni([x, y]) { // règle pair-impair, comme la carte
  let c = false;
  for (const r of ANELS) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
  }
  return c;
}
function distBordKm([x, y]) {
  const kx = 111.32 * Math.cos(y * Math.PI / 180), ky = 110.57;
  let d = Infinity;
  for (const r of ANELS) {
    for (let i = 1; i < r.length; i++) {
      const ax = (r[i - 1][0] - x) * kx, ay = (r[i - 1][1] - y) * ky, bx = (r[i][0] - x) * kx, by = (r[i][1] - y) * ky;
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / l2)) : 0;
      d = Math.min(d, Math.hypot(ax + t * dx, ay + t * dy));
    }
  }
  return d;
}
const km = (a, b) => Math.hypot((a[0] - b[0]) * 111.32 * Math.cos(a[1] * Math.PI / 180), (a[1] - b[1]) * 110.57);
const r4 = v => Math.round(v * 1e4) / 1e4;
const majuscule = s => s && s[0].toUpperCase() + s.slice(1);
const GENERIQUES = new Set(['pic', 'pica', 'pique', 'mont', 'monte', 'puy', 'cime', 'cima', 'signal', 'sommet', 'grand', 'grande',
  'tete', 'aiguille', 'pointe', 'punta', 'tuc', 'pech', 'pog', 'suc', 'le', 'la', 'les', 'l', 'de', 'du', 'des', 'd', 'di', 'del', 'della']);
const mots_nom = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z0-9]+/)
  .filter(m => m.length > 1 && !GENERIQUES.has(m));
const slug = s =>s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ------------------------------------------------------------------- main
// Formas relevadas dins Wikipèdia en occitan (Romain, 2026-10-10 : « n'oublie
// pas Wikipédia comme source »), quand Wikidata e OpenStreetMap an pas res ;
// cada forma amb l'article que l'atèsta, totas de validar per Romain. Los
// mots generics (mont, massís, pic, plan) son verificats amb lo Congrès.
const CORRECCIONS = {
  "puy-pariou": [
    null,
    "libellé Wikidata recopié du français : masqué (audit du 2026-10-10)"
  ],
  "pays-de-sault": [
    "País de Saut",
    "qualificatif de Wikidata retiré (audit du 2026-10-10)"
  ],
  "pic-des-trois-seigneurs": [
    "Pic dels Tres Senhors",
    "majuscules de l'article de la Wikipèdia occitana (audit du 2026-10-10)"
  ]
};

const WIKIPEDIA_OC = {
  // (en provençal e en vivaroaupenc : « Aups », grafia classica, pas « Alps »)
  'alpes-maritimes': ['Aups Maritims', 'Wikipèdia oc « Aups Maritims »'],
  'monts-du-vivarais': ['Monts de Vivarés', 'Wikipèdia oc « Laurac (Vivarés) » : « comuna occitana de Vivarés »'],
  'plantaurel': ['Plantaurèl', 'Wikipèdia oc « Montagut de Plantaurèl »'],
  'massif-de-l-arize': ["Massís d'Arisa", "Wikipèdia oc « Campanha d'Arisa »"],
  'monts-du-livradois': ['Monts de Liuradés', 'Wikipèdia oc « Marçac de Liuradés »'],
  'plateau-du-coiron': ['Plan de Coiron', 'Wikipèdia oc « Sant Gineis en Coiron »'],
  'mont-bouquet': ['Mont Boquet', 'Wikipèdia oc « Boquet »'],
  'sommet-de-finiels': ['Pic de Finiels', 'Wikipèdia oc « Mont Losera » : « pic de Finiels »'],
  'l-olan': ["L'Olan", "Wikipèdia oc « Vau Gaudemar » : « l'Olan »"],
  'bric-froid': ['Bric Froid', 'Wikipèdia oc « Alps Còcis » : « Bric Froid »'],
  'mont-chaberton': ['Mont Chaberton', 'Wikipèdia oc « Alps Còcis » : « Chaberton »'],
  'mont-thabor': ['Mont Tabor', 'Wikipèdia oc « Alps Còcis » : « Tabor »']
};
const w = await wikidata();
const pics = await osm();
const sortie = [];
// Lo dialècte de cada nom (Romain, 2026-10-10 : un nom s'escriu dins la forma
// de son dialècte, en grafia classica, jamai fonetica) : la zòna de
// dialectes.geojson ont tomba son etiqueta, per verificar la forma
const DIALS = JSON.parse(fs.readFileSync(path.join(DATA, 'dialectes.geojson'), 'utf8')).features;
const dinsPoli = ([x, y], poli) => {
  let d = false;
  for (const a of poli)
    for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
      const [xi, yi] = a[i], [xj, yj] = a[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
    }
  return d;
};
const dialècteDe = (pos) => {
  for (const f of DIALS) {
    const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    if (polis.some((p) => dinsPoli(pos, p))) return f.properties.oc;
  }
  return '';
};
const revision = [['kod', 'fr', 'oc', 'dialècte', 'font', 'nota']];
const ecartes = [];
let nOsm = 0;
for (const [qid, mena, renc, o] of LISTA) {
  const x = w[qid];
  if (!x || !x.coords.length) { ecartes.push(`${qid} : introuvable ou sans coordonnées dans Wikidata`); continue; }
  const fr = o.fr || majuscule(x.fr) || x.it;
  const pos = o.pos || x.coords[0];
  // un sommet frontalier (Vignemale, pica d'Estats, mont Viso…) peut tomber
  // quelques centaines de mètres hors du contour simplifié du domaine
  const dedins = dinsDomeni(pos) || (mena === 'som' && distBordKm(pos) < 2);
  if (!dedins) { ecartes.push(`${fr} (${qid}) : hors du domaine (${distBordKm(pos).toFixed(1)} km du bord)`); continue; }
  let oc = x.oc, font = oc ? `Wikidata ${qid}, libellé oc` : '';
  const notes = [];
  // majuscule initiale pour l'affichage (« massís dei Mauras » -> « Massís dei Mauras »)
  if (oc && oc[0] !== oc[0].toUpperCase()) { notes.push(`majuscule initiale ajoutée (Wikidata : « ${oc} »)`); oc = majuscule(oc); }
  if (o.nota) notes.push(o.nota);
  // OpenStreetMap : nom occitan d'un sommet tout proche
  if (pics && mena === 'som') {
    // même sommet : à moins de 1 km et un mot du nom en commun (pour ne pas
    // prendre un sommet voisin, comme la pointe de France sous l'Ossau)
    const mots = new Set([...mots_nom(fr), ...mots_nom(x.it)]);
    const p = pics.filter(e => ['peak', 'volcano'].includes(e.natural) && km([e.lon, e.lat], x.coords[0]) < 1
        && mots_nom(e.name).some(m => mots.has(m)))
      .sort((a, b) => km([a.lon, a.lat], x.coords[0]) - km([b.lon, b.lat], x.coords[0]))[0];
    if (p) {
      const s = `OpenStreetMap ${p.id}, name:oc${p.src ? ` (source : ${p.src})` : ''}`;
      if (!oc) { oc = p.oc; font = s; nOsm++; } else if (p.oc !== oc) notes.push(`autre forme dans ${s} : « ${p.oc} »`);
    }
  }
  if (!oc && WIKIPEDIA_OC[slug(fr)]) [oc, font] = WIKIPEDIA_OC[slug(fr)];
  // correccions aprèp l'audit del 2026-10-10 (revisions/2026-10-10-audit-donadas.md) :
  // una forma francesa recopiada dins Wikidata se masca (« quand tu ne sais pas,
  // tu effaces », Romain) ; lo qualificatiu de Wikidata se lèva ; las majusculas
  // seguisson l'article de la Wikipèdia occitana
  if (CORRECCIONS[slug(fr)]) {
    const [c, n] = CORRECCIONS[slug(fr)];
    oc = c;
    notes.push(n);
  }
  // (en provençal e en vivaroaupenc, « Aups » e pas « Alps » : coma « Auts Aups »,
  // Wikidata Q3125, e « Aups d'Auta Provença », Q3131 ; grafia classica)
  const dial = dialècteDe(pos);
  if (oc && ['provençal', 'vivaroaupenc'].includes(dial) && /\bAlps\b/.test(oc)) {
    notes.push('« Alps » → « Aups » (forme provençale et vivaro-alpine, comme « Auts Aups », Wikidata Q3125)');
    oc = oc.replace(/\bAlps\b/g, 'Aups');
  }
  if (oc && dial && dial !== 'lengadocian' && /\b(dels|del)\b/.test(oc)) notes.push('article languedocien « dels / del » en zone ' + dial + ' : forme dialectale à confirmer');
  if (oc && fr && oc.toLowerCase() === fr.toLowerCase()) notes.push('identique au nom français : forme à vérifier');
  if (oc) notes.push('à valider (graphie et dialecte)');
  else notes.push('aucun nom occitan dans les sources : à écrire par Romain');
  const alt = mena === 'som' && x.alts.length ? Math.round(Math.max(...x.alts)) : null;
  const kod = slug(fr);
  if (sortie.some(f => f.properties.kod === kod)) throw new Error('kod en double : ' + kod);
  sortie.push({
    type: 'Feature',
    properties: { kod, mena, fr, oc: oc ?? null, alt, renc, ang: o.ang ?? null, ...(o.corba ? { corba: o.corba } : {}) },
    geometry: { type: 'Point', coordinates: [r4(pos[0]), r4(pos[1])] },
  });
  revision.push([kod, fr, oc ?? '', dialècteDe(pos), font, notes.join(' ; ')]);
}

const ORDRE = { cadena: 0, massis: 1, plan: 2, som: 3 };
sortie.sort((a, b) => a.properties.renc - b.properties.renc || ORDRE[a.properties.mena] - ORDRE[b.properties.mena]
  || a.properties.fr.localeCompare(b.properties.fr, 'fr'));
const FONT = 'Wikidata (CC0) : positions, altitudes et noms occitans'
  + (nOsm ? ` ; OpenStreetMap (ODbL) : ${nOsm} noms occitans de sommets` : '')
  + ' ; liste et positions des étiquettes de massifs : Lo Ligam';
const texte = '{"type":"FeatureCollection","font":' + JSON.stringify(FONT) + ',"features":[\n'
  + sortie.map(f => JSON.stringify(f)).join(',\n') + '\n]}\n';
JSON.parse(texte);
fs.writeFileSync(path.join(DATA, 'releu-noms.json'), texte);

fs.mkdirSync(REVISION, { recursive: true });
const q = v => { const s = v == null ? '' : String(v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
fs.writeFileSync(path.join(REVISION, 'noms-releu-a-validar.csv'), '﻿' + revision.map(l => l.map(q).join(';')).join('\r\n') + '\r\n');

const n = {};
for (const f of sortie) n[f.properties.mena] = (n[f.properties.mena] || 0) + 1;
const b = Buffer.byteLength(texte), gz = zlib.gzipSync(texte, { level: 9 }).length;
console.log(`releu-noms.json : ${sortie.length} étiquettes ${JSON.stringify(n)}, ${sortie.filter(f => f.properties.oc).length} avec un nom occitan `
  + `(dont ${nOsm} d'OpenStreetMap), ${(b / 1024).toFixed(1)} Ko bruts, ${(gz / 1024).toFixed(1)} Ko compressés`);
console.log(pics ? `OpenStreetMap : ${pics.length} objets naturels avec name:oc` : 'OpenStreetMap : indisponible (Overpass), noms Wikidata seuls');
for (const e of ecartes) console.log('  écarté :', e);
