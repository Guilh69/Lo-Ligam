// Vérifie le lexique occitan d'un module contre lo Basic (API lo Congrès).
//
//   node scripts/verificar-oc.mjs --modul 1-1
//   node scripts/verificar-oc.mjs adieu bonjorn mercé
//
// Nécessite LOCONGRES_API_KEY dans app/.env (voir .env.example). Le script
// interroge l'API mot par mot (pause de 400 ms entre deux appels, par
// courtoisie) et signale ce que le dictionnaire ne connaît pas. On ne stocke
// rien : les CGU de lo Congrès interdisent de conserver les données brutes.
//
// Source des données au moment de l'affichage : lo Congrès permanent de la
// lenga occitana (lo Basic).

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const racina = dirname(dirname(fileURLToPath(import.meta.url)));

function legirClau() {
	if (process.env.LOCONGRES_API_KEY) return process.env.LOCONGRES_API_KEY;
	try {
		const env = readFileSync(join(racina, '.env'), 'utf8');
		const linha = env.split(/\r?\n/).find((l) => l.startsWith('LOCONGRES_API_KEY='));
		if (linha) return linha.slice('LOCONGRES_API_KEY='.length).trim();
	} catch {
		/* pas de .env : message clair ci-dessous */
	}
	return '';
}

const clau = legirClau();
if (!clau) {
	console.error(
		'Clé API manquante. Ajoute LOCONGRES_API_KEY=ta_clé dans app/.env\n' +
			'(clé gratuite sur https://api.locongres.org/clau.php?lang=fr)'
	);
	process.exit(1);
}

// Découpe les chunks en mots : on enlève ponctuation et majuscules, on garde
// les caractères occitans accentués. « Cossí vas ? » → cossí, vas.
function motsDe(texte) {
	return texte
		.toLowerCase()
		.replace(/[«»?!.,·()]/g, ' ')
		.split(/[\s/-]+/)
		.map((m) => m.trim())
		.filter((m) => m.length > 1);
}

async function lexiqueDuModul(slug) {
	const { moduls } = await import(pathToFileURL(join(racina, 'src/lib/lesson/moduls/index.js')));
	const modul = moduls[slug];
	if (!modul) {
		console.error(`Module inconnu : ${slug}. Connus : ${Object.keys(moduls).join(', ')}`);
		process.exit(1);
	}
	const mots = new Set();
	for (const session of modul.sessions) {
		for (const bloc of session.blocks) {
			if (bloc.type === 'chunks') for (const c of bloc.items) motsDe(c.oc).forEach((m) => mots.add(m));
			if (bloc.type === 'dialogue') {
				for (const scena of bloc.scenes) for (const l of scena.lines) motsDe(l).forEach((m) => mots.add(m));
				for (const g of bloc.glossary ?? []) motsDe(g.oc).forEach((m) => mots.add(m));
			}
		}
	}
	return [...mots].sort();
}

const args = process.argv.slice(2);
let mots;
if (args[0] === '--modul' && args[1]) {
	mots = await lexiqueDuModul(args[1]);
} else if (args.length > 0) {
	mots = args.map((m) => m.toLowerCase());
} else {
	console.error('Usage : node scripts/verificar-oc.mjs --modul 1-1   ou   … mot1 mot2');
	process.exit(1);
}

console.log(`Vérification de ${mots.length} mots contre lo Basic (variété languedocienne)…\n`);

const absents = [];
for (const mot of mots) {
	const url = new URL('https://api.locongres.org/basic.php');
	url.searchParams.set('key', clau);
	url.searchParams.set('lang', 'oc');
	url.searchParams.set('term', mot);
	url.searchParams.set('var', 'lengadoc');
	try {
		const res = await fetch(url);
		const data = await res.json();
		const entradas = data?.query ?? [];
		if (Array.isArray(entradas) && entradas.length > 0) {
			// Les formes exactes trouvées, pour repérer une graphie divergente.
			const formas = entradas
				.flatMap((e) => e.forms ?? [])
				.map((f) => f.orth)
				.filter(Boolean);
			const exact = formas.some((f) => f.toLowerCase() === mot);
			console.log(`  ✓ ${mot}${exact ? '' : `  (formes du Basic : ${[...new Set(formas)].join(', ')})`}`);
		} else {
			absents.push(mot);
			console.log(`  ⚠️  ${mot} — absent du Basic (languedocien)`);
		}
	} catch (e) {
		console.log(`  ✗ ${mot} — erreur d'appel : ${e.message}`);
	}
	await new Promise((r) => setTimeout(r, 400));
}

console.log(
	absents.length
		? `\n${absents.length} mot(s) à vérifier à la main sur dicodoc.eu : ${absents.join(', ')}`
		: '\nTout le lexique est connu du Basic. (Un ✓ ne valide pas le sens ni l’usage : relecture humaine toujours nécessaire.)'
);
