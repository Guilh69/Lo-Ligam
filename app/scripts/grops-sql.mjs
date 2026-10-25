// Lo Ligam — fabrique supabase/supabase-grops-catalog.sql : le catalogue des
// groupes d'Amassa (2026-10-25). Quatre ouverts au départ (Montpelhièr,
// Tolosa, Lion, Débutants, choix de Romain) ; tout le reste en propositions,
// qui s'ouvrent dès qu'une personne les rejoint (public.rejonher_grop).
// « on conflict do nothing » : rejouer le fichier ne rouvre ni ne referme
// rien de ce qui a bougé dans la base.
//
//   cd app && node scripts/grops-sql.mjs
//
// Ce script N'ÉCRIT PAS dans la base. Les noms occitans sont ceux du site
// (carte, territoris.js) ou vérifiés par lo Congrès le 2026-10-25 ; À VALIDER
// par Romain, comme les noms de départements de territoris.js.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TERRITORIS, NOMS_OC_TER } from '../src/lib/carta/territoris.js';

const racina = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sortida = join(racina, 'supabase', 'supabase-grops-catalog.sql');

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const slug = (s) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const grops = [];
const apondre = (id, mena, oc, fr, orde, dobèrt = false) => grops.push({ id, mena, oc, fr, orde, dobèrt });

// Ouverts au départ
apondre('vila-montpelhier', 'vila', 'Montpelhièr', 'Montpellier', 1, true);
apondre('vila-tolosa', 'vila', 'Tolosa', 'Toulouse', 2, true);
apondre('vila-lion', 'vila', 'Lion', 'Lyon', 3, true);
apondre('nivel-debutants', 'nivel', 'Debutants', 'Débutants', 4, true);

// Villes : les grandes villes de la carte (carta-estelas.js), et París
const VILAS = [
	['Marselha', 'Marseille'],
	['Bordèu', 'Bordeaux'],
	['Niça', 'Nice'],
	['Avinhon', 'Avignon'],
	['Nimes', 'Nîmes'],
	['Clarmont-Ferrand', 'Clermont-Ferrand'],
	['Limòtges', 'Limoges'],
	['Pau', 'Pau'],
	['Valença', 'Valence'],
	['Tolon', 'Toulon'],
	['Ais de Provença', 'Aix-en-Provence'],
	['Besièrs', 'Béziers'],
	['Carcassona', 'Carcassonne'],
	['Narbona', 'Narbonne'],
	['Albi', 'Albi'],
	['Rodés', 'Rodez'],
	['Agen', 'Agen'],
	['Montalban', 'Montauban'],
	['Tarba', 'Tarbes'],
	['Baiona', 'Bayonne'],
	['Perigüers', 'Périgueux'],
	['París', 'Paris']
];
VILAS.forEach(([oc, fr], i) => apondre('vila-' + slug(oc), 'vila', oc, fr, 10 + i));

// Dialectes
const DIALECTES = [
	['Lengadocian', 'Languedocien'],
	['Provençal', 'Provençal'],
	['Gascon', 'Gascon'],
	['Lemosin', 'Limousin'],
	['Auvernhat', 'Auvergnat'],
	['Vivaroaupenc', 'Vivaro-alpin']
];
DIALECTES.forEach(([oc, fr], i) => apondre('dialecte-' + slug(oc), 'dialecte', oc, fr, 100 + i));

// Départements et territoires du domaine (noms occitans de territoris.js ;
// Ròse, Savòia et Nauta Savòia sont arpitans, les vallées d'Italie forment un
// seul groupe)
const FÒRA = new Set(['69', '73', '74']);
for (const t of TERRITORIS) {
	const oc = NOMS_OC_TER['despartament:' + t.code];
	if (t.mena !== 'despartament' || !oc || FÒRA.has(t.code) || t.code.startsWith('V-')) continue;
	apondre('dep-' + t.code.toLowerCase(), 'despartament', oc, t.nom, 200 + Number(t.code));
}
apondre('dep-valadas', 'despartament', NOMS_OC_TER['region:VALADAS'], 'Vallées occitanes', 298);
apondre('dep-aran', 'despartament', "Val d'Aran", "Val d'Aran", 299);

// Centres d'intérêt
const INTERESSES = [
	['Musica', 'Musique'],
	['Cant', 'Chant'],
	['Dança', 'Danse'],
	['Bal', 'Bal'],
	['Cosina', 'Cuisine'],
	['Literatura', 'Littérature'],
	['Teatre', 'Théâtre'],
	['Cinema', 'Cinéma'],
	['Natura', 'Nature'],
	['Istòria', 'Histoire'],
	['Jòcs', 'Jeux']
];
INTERESSES.forEach(([oc, fr], i) => apondre('interes-' + slug(oc), 'interes', oc, fr, 400 + i));

const ids = new Set();
for (const g of grops) {
	if (ids.has(g.id)) throw new Error('identifiant en double : ' + g.id);
	ids.add(g.id);
}

const linhas = grops.map(
	(g) =>
		`\t(${q(g.id)}, ${q(g.mena)}, ${q(g.oc)}, ${q(g.fr)}, ${q(g.dobèrt ? 'dobèrt' : 'prepausat')}, ${g.orde}, ${g.dobèrt ? 'now()' : 'null'})`
);

writeFileSync(
	sortida,
	`-- Lo Ligam — le catalogue des groupes d'Amassa (${grops.length} groupes, dont 4 ouverts).
-- FICHIER FABRIQUÉ par app/scripts/grops-sql.mjs : ne pas le modifier à la main.
-- À coller dans Supabase après supabase-grops.sql (SQL Editor → New query → Run).
-- Rejouable : ce qui existe déjà n'est pas touché.

insert into public.grops (id, mena, nom_oc, nom_fr, estat, orde, dobèrt_at) values
${linhas.join(',\n')}
on conflict (id) do nothing;
`
);
console.log(`${grops.length} groupes écrits dans ${sortida}`);
