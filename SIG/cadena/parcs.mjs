// Parcs naturels de la carte : chaîne complète, de la donnée brute à
// app/static/data/parcs.json.
//
//   node SIG/cadena/parcs.mjs                 télécharge ce qui manque, puis fabrique parcs.json
//   node SIG/cadena/parcs.mjs --refar         retélécharge tout (mise à jour annuelle)
//   node SIG/cadena/parcs.mjs --tolerancia=40 --sortida=SIG/brut/natura/parcs-40m.json
//                                             variante plus fine, hors du site
//
// Étapes : 1. téléchargements dans SIG/brut/natura (non versé au dépôt) ;
// 2. parcs.py (QGIS Python) : Comminges reconstitué, parcs du Piémont,
//    découpage selon le domaine prolongé en mer ;
// 3. parcs.py simplificar : simplification (bord commun exact entre cœur et
//    aire d'adhésion), morceaux de moins de 0,5 km² enlevés ; mapshaper :
//    point d'étiquette ;
// 4. noms occitans tirés de Wikidata, fichier final, liste à valider ;
// 5. parcs.py verificar : géométries valides, étiquettes dans les parcs.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BRUT = path.resolve(AQUI, '../brut/natura');
const DATA = path.resolve(AQUI, '../../app/static/data');
const REVISION = path.resolve(AQUI, '../natura');
const QGIS = process.env.QGIS_PYTHON || 'C:/Program Files/QGIS 4.2.3/bin/python-qgis.bat';
const MAPSHAPER = 'mapshaper@0.7.80';

const arg = (nom, defaut) => {
  const a = process.argv.find(x => x.startsWith(`--${nom}=`));
  return a ? a.split('=').slice(1).join('=') : defaut;
};
const REFAR = process.argv.includes('--refar');
// Tolérance de simplification en mètres (écart maximal au contour d'origine).
// Mesuré le 2026-10-07 : 40 m donne 790 Ko (227 Ko compressés), 60 m 590 Ko
// (174 Ko), 100 m 400 Ko (122 Ko) ; 100 m est le compromis retenu.
const TOLERANCIA = Number(arg('tolerancia', 100));
const SORTIDA = path.resolve(process.cwd(), arg('sortida', path.join(DATA, 'parcs.json')));
const UA = 'LoLigam-carta/0.1 (preparation de donnees pour une carte de la langue occitane)';

const FONT = 'PatriNat (OFB-MNHN) via IGN Géoplateforme, Licence Ouverte ; PNR Comminges-Barousse-Pyrénées : '
  + 'communes du décret n° 2026-606 (IGN Admin Express, Licence Ouverte) ; Regione Piemonte CC BY 4.0 ; '
  + 'noms occitans : Wikidata (CC0)';

// ------------------------------------------------------------ 1. téléchargements
const WFS = 'https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&OUTPUTFORMAT=application/json&SRSNAME=EPSG:4326';
const BOITE = '&BBOX=42.2,-2.0,46.5,7.8,urn:ogc:def:crs:EPSG::4326';
const TELECHARGEMENTS = [
  ['wfs-pnr.json', `${WFS}&TYPENAMES=patrinat_pnr:pnr${BOITE}`],
  ['wfs-parc_national.json', `${WFS}&TYPENAMES=patrinat_pn:parc_national${BOITE}`],
  ['wfs-pnm.json', `${WFS}&TYPENAMES=patrinat_pnm:pnm${BOITE}`],
  // communes autour du Comminges (486 objets, 2 Mo) : parcs.py garde celles du décret
  ['communes-comminges.json', `${WFS}&TYPENAMES=ADMINEXPRESS-COG-CARTO.LATEST:commune&COUNT=1000`
    + '&PROPERTYNAME=nom_officiel,code_insee,code_insee_du_departement,geometrie'
    + '&BBOX=42.65,0.3,43.3,1.2,urn:ogc:def:crs:EPSG::4326'],
  ['decret-2026-606.html', 'https://aida.ineris.fr/reglementation/decret-ndeg-2026-606-090726-portant-classement-parc-naturel-regional-comminges'],
  ['Aree_protette_Piemonte.zip', 'https://www.datigeo-piem-download.it/direct/Geoportale/RegionePiemonte/Aree_protette/Aree_protette_Piemonte.zip'],
];

async function telecharger() {
  fs.mkdirSync(BRUT, { recursive: true });
  for (const [nom, url] of TELECHARGEMENTS) {
    const f = path.join(BRUT, nom);
    if (fs.existsSync(f) && !REFAR) continue;
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(`${nom} : HTTP ${r.status}`);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    console.log('téléchargé', nom, fs.statSync(f).size, 'octets');
    if (nom.endsWith('.zip')) {
      const gpkg = path.join(BRUT, 'Aree_protette_Piemonte.gpkg');
      if (fs.existsSync(gpkg)) fs.unlinkSync(gpkg); // parcs.py le réextrait
    }
  }
}

async function wikidata(ids) {
  const cache = path.join(BRUT, 'wikidata-parcs.json');
  let w = {};
  if (fs.existsSync(cache) && !REFAR) w = JSON.parse(fs.readFileSync(cache, 'utf8'));
  const manquants = ids.filter(id => !(id in w));
  for (let i = 0; i < manquants.length; i += 50) {
    const lot = manquants.slice(i, i + 50);
    const url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels'
      + `&languages=oc|fr|it&ids=${lot.join('|')}`;
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    const j = await r.json();
    for (const [id, e] of Object.entries(j.entities)) {
      const l = e.labels || {};
      w[id] = { oc: l.oc?.value ?? null, fr: l.fr?.value ?? null, it: l.it?.value ?? null };
    }
  }
  fs.writeFileSync(cache, JSON.stringify(w, null, 1));
  return w;
}

// ------------------------------------------------------------------- outils
// lance une commande (les .bat de QGIS et npx demandent un shell sous Windows)
const q = a => (/[s"]/.test(a) ? `"${a}"` : a);
const lancer = (cmd, args, stdio = 'inherit') => execSync([cmd, ...args].map(q).join(' '), { stdio: ['ignore', 'inherit', stdio] });
const r4 = v => Math.round(v * 1e4) / 1e4;
const ORDRE = { 'pn-adesion': 0, pnm: 1, pnr: 2, 'parc-it': 3, 'pn-cor': 4 };

function csv(lignes) {
  const q = v => {
    const s = v == null ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '\ufeff' + lignes.map(l => l.map(q).join(';')).join('\r\n') + '\r\n';
}

// --------------------------------------------------------------------- main
await telecharger();

const decopats = path.join(BRUT, 'parcs-decopats.geojson');
console.log('découpage (parcs.py)…');
lancer(QGIS, [path.join(AQUI, 'parcs.py'), 'decopar']);

const simplificats = path.join(BRUT, `parcs-simplificats-${TOLERANCIA}m.geojson`);
console.log(`simplification à ${TOLERANCIA} m (parcs.py simplificar)…`);
lancer(QGIS, [path.join(AQUI, 'parcs.py'), 'simplificar', String(TOLERANCIA), simplificats]);

// point d'étiquette : point intérieur du plus grand morceau, loin des bords
// (mapshaper innerX / innerY), calculé sur la géométrie finale
const etiquetas = path.join(BRUT, `parcs-etiquetas-${TOLERANCIA}m.json`);
lancer('npx', ['-y', MAPSHAPER, '-i', simplificats,
  '-each', 'eti_x=this.innerX, eti_y=this.innerY',
  '-o', etiquetas, 'format=json', 'force']);
const eti = Object.fromEntries(JSON.parse(fs.readFileSync(etiquetas, 'utf8')).map(r => [r.kod, [r4(r.eti_x), r4(r.eti_y)]]));

const s = JSON.parse(fs.readFileSync(simplificats, 'utf8'));
const w = await wikidata([...new Set(s.features.map(f => f.properties.wd))]);

const features = s.features
  .filter(f => f.geometry)
  .map(f => {
    const p = f.properties;
    return {
      type: 'Feature',
      properties: {
        kod: p.kod,
        mena: p.mena,
        fr: p.fr,
        oc: w[p.wd]?.oc ?? null,
        annada: p.annada ?? null,
        eti: eti[p.kod],
      },
      geometry: f.geometry,
    };
  })
  .sort((a, b) => ORDRE[a.properties.mena] - ORDRE[b.properties.mena] || a.properties.fr.localeCompare(b.properties.fr, 'fr'));

const sortie = { type: 'FeatureCollection', font: FONT, features };
// une ligne par objet : lisible dans un diff, à peine plus lourd
const texte = '{"type":"FeatureCollection","font":' + JSON.stringify(FONT) + ',"features":[\n'
  + features.map(f => JSON.stringify(f)).join(',\n') + '\n]}\n';
JSON.parse(texte); // contrôle de syntaxe
fs.mkdirSync(path.dirname(SORTIDA), { recursive: true });
fs.writeFileSync(SORTIDA, texte);

console.log('vérification des géométries (parcs.py verificar)…');
lancer(QGIS, [path.join(AQUI, 'parcs.py'), 'verificar', SORTIDA]);

// ------------------------------------------------- liste à valider par Romain
if (SORTIDA === path.join(DATA, 'parcs.json')) {
  const rapport = JSON.parse(fs.readFileSync(path.join(BRUT, 'parcs-decopatge-rapport.json'), 'utf8'));
  const gardes = new Set(features.map(f => f.properties.kod));
  const vus = new Set();
  const lignes = [['kod', 'fr', 'oc', 'font', 'nota']];
  for (const f of features) {
    const p = f.properties;
    const r = rapport.find(x => x[0] === p.kod);
    const wd = s.features.find(x => x.properties.kod === p.kod).properties.wd;
    const notes = [];
    if (p.mena === 'pn-cor') notes.push('cœur du parc national');
    if (p.mena === 'pn-adesion') notes.push("aire d'adhésion du parc national (même nom que le cœur)");
    if (r && r[5] < 99.5) notes.push(`découpé selon le domaine : ${String(r[5]).replace('.', ',')} % de la surface gardée`);
    if (p.kod === 'PNR-COMMINGES') notes.push('contour reconstitué avec les 185 communes du décret 2026-606, article 1er (I) ; à remplacer quand PatriNat publiera le contour officiel');
    if (p.kod === 'IT-EUAP0884') notes.push('ajouté à la liste demandée : petit parc de la Val Germanasca, vallée occitane');
    notes.push(p.oc ? 'nom occitan de Wikidata, à valider (graphie et dialecte)' : 'aucun nom occitan dans Wikidata : à écrire par Romain');
    const cle = p.kod + '|' + p.oc;
    if (vus.has(cle)) continue;
    vus.add(cle);
    lignes.push([p.kod, p.fr, p.oc, p.oc ? `Wikidata ${wd}, libellé oc` : '', notes.join(' ; ')]);
  }
  for (const r of rapport) {
    if (gardes.has(r[0])) continue;
    lignes.push([r[0], r[1], '', '', `écarté : ${String(r[5]).replace('.', ',')} % de la surface dans le domaine (${String(r[4]).replace('.', ',')} km²)`]);
  }
  lignes.push(['FR8000044', 'Parc naturel régional des Pyrénées catalanes', '', '', 'écarté (choix de Romain : domaine catalan)']);
  fs.mkdirSync(REVISION, { recursive: true });
  fs.writeFileSync(path.join(REVISION, 'noms-parcs-a-validar.csv'), csv(lignes));
}

const brut = fs.statSync(SORTIDA).size;
const gz = zlib.gzipSync(fs.readFileSync(SORTIDA), { level: 9 }).length;
const n = {};
for (const f of features) n[f.properties.mena] = (n[f.properties.mena] || 0) + 1;
console.log(`${path.relative(process.cwd(), SORTIDA)} : ${features.length} objets ${JSON.stringify(n)}, `
  + `${(brut / 1024).toFixed(0)} Ko bruts, ${(gz / 1024).toFixed(0)} Ko compressés (gzip), `
  + `${features.filter(f => f.properties.oc).length} avec un nom occitan`);
