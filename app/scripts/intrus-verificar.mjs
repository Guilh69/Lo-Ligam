// Contrôle de conception du jeu « L'intrus » (chantier 33, séance 1, 07-11).
//
//   node scripts/intrus-verificar.mjs                 (toutes les séries des leçons)
//   node scripts/intrus-verificar.mjs --modul 3-4     (les séries d'une leçon)
//   node scripts/intrus-verificar.mjs --mots "lo cat|lo can|lo caval|lo cosin" --intrus 4
//
// Pour chaque série de quatre mots, le script interroge deux API de lo Congrès
// pendant la conception, jamais depuis le site :
//   - lo Basic : la nature de chaque mot (nom, adjectif, nombre, verbe…) et
//     ses sens en français, pour voir si l'intrus se repère à la seule
//     grammaire (trop facile) et si un mot a un deuxième sens qui ouvrirait
//     une autre famille (nòu : 9 et neuf) ;
//   - sinonimes : si l'intrus est synonyme d'un mot de la famille, la série
//     est ambiguë.
// Rien n'est écrit sur le disque ni gardé : les CGU de lo Congrès interdisent
// de conserver leurs réponses. Le script n'affiche que ses constats, le temps
// de la séance. Clé : LOCONGRES_API_KEY dans app/.env, jamais affichée.
// Pause de 400 ms entre deux appels, par courtoisie (comme verificar-oc.mjs).

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const racina = dirname(dirname(fileURLToPath(import.meta.url)));
const API = 'https://api.locongres.org/';

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
	console.error('Clé API manquante : ajoute LOCONGRES_API_KEY=… dans app/.env');
	process.exit(1);
}

const NATURAS = { N: 'nom', AJ: 'adjectif', NU: 'nombre', V: 'verbe', AV: 'adverbe', PR: 'préposition', PP: 'participe' };
const ARTICLES = new Set(['lo', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'dels']);

/** Le mot qui porte le sens : sans article, sans ponctuation, en minuscules. */
function motCap(texte) {
	const mots = texte
		.toLowerCase()
		.replace(/[«»?!.,·()…]/g, ' ')
		.replace(/(^|\s)l['’]/g, ' ')
		.split(/\s+/)
		.filter((m) => m && !ARTICLES.has(m));
	return mots.length === 1 ? mots[0] : null; // une locution : pas de contrôle de nature
}

const memoria = new Map(); // le temps du script seulement
async function cridar(chemin, params) {
	const clauMem = chemin + JSON.stringify(params);
	if (memoria.has(clauMem)) return memoria.get(clauMem);
	const url = new URL(API + chemin);
	url.searchParams.set('key', clau);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	let data = null;
	try {
		const res = await fetch(url, { redirect: 'error' });
		data = res.ok ? await res.json() : null;
	} catch {
		data = null; // un plantage n'est pas une absence (mémoire du 2026-10) : on le dit
	}
	await new Promise((r) => setTimeout(r, 400));
	memoria.set(clauMem, data);
	return data;
}

/** Natures et sens français d'un mot occitan, d'après lo Basic. */
async function basic(mot) {
	const data = await cridar('basic.php', { term: mot, lang: 'oc', var: 'lengadoc' });
	if (!data) return { erreur: true, naturas: new Set(), sens: [] };
	const naturas = new Set();
	const sens = [];
	for (const e of data.query ?? []) {
		const trads = (e.trads ?? []).filter((t) => ['lengadoc', 'oc'].includes(t.var));
		const exacte = trads.some((t) => t.orth?.toLowerCase() === mot || t.flexions?.some((f) => f.orth?.toLowerCase() === mot));
		if (!exacte) continue;
		for (const f of e.forms ?? []) {
			const nat = (f.PoS?.[0] ?? '').match(/^[A-Z]+/)?.[0] ?? '?';
			naturas.add(nat);
			sens.push(`${f.orth} (${NATURAS[nat] ?? nat})`);
		}
	}
	return { naturas, sens: [...new Set(sens)] };
}

/** Les synonymes languedociens d'un mot, d'après l'API sinonimes. */
async function sinonimes(mot) {
	const data = await cridar('synonyms.php', { term: mot, var: 'lengadoc' });
	return new Set((data?.query ?? []).map((s) => s.orth?.toLowerCase()).filter(Boolean));
}

async function verificarSeria(mots, intrus, etiqueta) {
	console.log(`\n${etiqueta}  ${mots.map((m, i) => (i === intrus ? `[${m}]` : m)).join(' · ')}`);
	const caps = mots.map(motCap);
	const infos = [];
	for (const cap of caps) infos.push(cap ? { ...(await basic(cap)), syn: await sinonimes(cap) } : null);
	const constats = [];

	// 1. Chaque mot est-il connu de lo Basic ?
	caps.forEach((cap, i) => {
		if (!cap) return;
		if (infos[i].erreur) constats.push(`✗ ${cap} : erreur d'appel (à revérifier, ce n'est pas une absence)`);
		else if (!infos[i].sens.length) constats.push(`· ${cap} : pas dans lo Basic languedocien (forme conjuguée, ou graphie à voir sur dicodòc : verificar-oc.mjs)`);
	});

	// 2. Nature : la famille partage-t-elle une nature, et l'intrus aussi ?
	const familha = caps.map((c, i) => i).filter((i) => i !== intrus && caps[i] && infos[i].naturas.size);
	if (familha.length === 3 && caps[intrus] && infos[intrus].naturas.size) {
		const comunas = [...infos[familha[0]].naturas].filter((n) => familha.every((i) => infos[i].naturas.has(n)));
		if (!comunas.length) constats.push('⚠ la famille n’a pas de nature commune : un autre mot pourrait passer pour l’intrus');
		else if (comunas.some((n) => infos[intrus].naturas.has(n)))
			constats.push(`✓ même nature pour les quatre (${comunas.map((n) => NATURAS[n] ?? n).join(', ')}) : l’intrus ne se repère pas à la grammaire`);
		else constats.push(`· l’intrus n’est pas de la même nature (${[...infos[intrus].naturas].map((n) => NATURAS[n] ?? n).join(', ')}) : plus facile, à garder seulement si c’est voulu`);
	}

	// 3. Plusieurs sens : un deuxième sens peut ouvrir une autre famille.
	caps.forEach((cap, i) => {
		if (cap && infos[i].sens.length > 1) constats.push(`· ${cap} a plusieurs sens : ${infos[i].sens.join(' ; ')}`);
	});

	// 4. Synonymes : l'intrus ne doit être synonyme d'aucun mot de la famille.
	for (let a = 0; a < caps.length; a++) {
		for (let b = 0; b < caps.length; b++) {
			if (a === b || !caps[a] || !caps[b] || !infos[a].syn.has(caps[b])) continue;
			if (a === intrus || b === intrus) constats.push(`⚠ ${caps[b]} est synonyme de ${caps[a]} : l’intrus est ambigu`);
			else constats.push(`✓ ${caps[b]} et ${caps[a]} sont synonymes : la famille se tient`);
		}
	}
	if (!constats.length) constats.push('· rien à signaler par les API (locutions : jugement humain)');
	for (const c of constats) console.log('   ' + c);
	return constats.filter((c) => c.startsWith('⚠') || c.startsWith('✗')).length;
}

const args = process.argv.slice(2);
let alertas = 0;
if (args[0] === '--mots') {
	const mots = args[1].split('|').map((m) => m.trim());
	const intrus = Number(args[args.indexOf('--intrus') + 1]) - 1;
	if (mots.length !== 4 || !(intrus >= 0 && intrus < 4)) {
		console.error('Usage : --mots "a|b|c|d" --intrus 1 à 4');
		process.exit(1);
	}
	alertas += await verificarSeria(mots, intrus, 'série libre');
} else {
	const { moduls } = await import(pathToFileURL(join(racina, 'src/lib/lesson/moduls/index.js')));
	const cles = args[0] === '--modul' ? [args[1]] : Object.keys(moduls);
	for (const cle of cles) {
		if (!moduls[cle]) {
			console.error(`Module inconnu : ${cle}`);
			process.exit(1);
		}
		for (const etapa of moduls[cle].sessions) {
			for (const bloc of etapa.blocks) {
				if (bloc.type !== 'intrus') continue;
				for (const [n, item] of bloc.items.entries()) alertas += await verificarSeria(item.mots, item.intrus, `${cle} · ${n + 1}`);
			}
		}
	}
}
console.log(`\n${alertas ? `⚠ ${alertas} alerte(s) à regarder` : '✓ aucune alerte'}. Rien n’a été gardé des réponses de lo Congrès.`);
