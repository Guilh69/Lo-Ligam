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
	// Hors périmètre du Basic : prénoms des personnages, et mots-outils de
	// 1-2 lettres (articles, pronoms — formes de base d'Alibèrt, et l'API
	// renvoie une erreur PHP sur les termes trop courts).
	for (const nom of modul.nomsPropris ?? []) mots.delete(nom.toLowerCase());
	return [...mots].filter((m) => m.length > 2).sort();
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
			// Toutes les graphies de l'entrée (côté occitan et côté français),
			// pour repérer une graphie divergente de la nôtre.
			const formas = entradas
				.flatMap((e) => [...(e.forms ?? []), ...(e.trads ?? [])])
				.map((f) => f.orth)
				.filter(Boolean);
			const exact = formas.some((f) => f.toLowerCase() === mot);
			console.log(`  ✓ ${mot}${exact ? '' : `  (graphies du Basic : ${[...new Set(formas)].join(', ')})`}`);
		} else {
			absents.push(mot);
			console.log(`  ⚠️  ${mot} — absent du Basic (languedocien)`);
		}
	} catch (e) {
		console.log(`  ✗ ${mot} — erreur d'appel : ${e.message}`);
	}
	await new Promise((r) => setTimeout(r, 400));
}

// Seconde passe : un mot absent du Basic est peut-être une forme conjuguée
// (le Basic ne connaît que les lemmes). vèrb'Òc sait remonter à l'infinitif.
const MODES = { ind: 'indicatif', subj: 'subjonctif', cond: 'conditionnel', imp: 'impératif', inf: 'infinitif', part: 'participe' };
const TEMPS = { pres: 'présent', pas: 'passé', imp: 'imparfait', fut: 'futur' };
const inconeguts = [];
if (absents.length) {
	console.log(`\n${absents.length} mot(s) absent(s) du Basic → recherche comme forme conjuguée (vèrb'Òc)…\n`);
	for (const mot of absents) {
		const url = new URL('https://api.locongres.org/verboc.php');
		url.searchParams.set('key', clau);
		url.searchParams.set('form', mot);
		url.searchParams.set('var', 'lengadoc');
		try {
			const res = await fetch(url);
			const data = await res.json();
			const formas = (data?.query ?? []).filter((f) => f.inf);
			if (formas.length > 0) {
				const descr = formas
					.slice(0, 3)
					.map(
						(f) =>
							`${f.inf} — ${f.per ?? '?'}${f.num === 'pl' ? ' pl.' : ' sg.'} ${MODES[f.mod] ?? f.mod ?? ''} ${TEMPS[f.tns] ?? f.tns ?? ''}`.trim()
					)
					.join(' · ');
				console.log(`  ✓ ${mot} : forme de ${descr}`);
			} else {
				inconeguts.push(mot);
				console.log(`  ⚠️  ${mot} — inconnu aussi de vèrb'Òc`);
			}
		} catch (e) {
			inconeguts.push(mot);
			console.log(`  ✗ ${mot} — erreur d'appel : ${e.message}`);
		}
		await new Promise((r) => setTimeout(r, 400));
	}
}

console.log(
	inconeguts.length
		? `\n${inconeguts.length} mot(s) à vérifier à la main sur dicodoc.eu : ${inconeguts.join(', ')}`
		: '\nTout le lexique est connu du Basic ou de vèrb’Òc. (Un ✓ ne valide pas le sens ni l’usage : relecture humaine toujours nécessaire.)'
);
