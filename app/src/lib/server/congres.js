// Chercher un mot dans lo Basic (API de lo Congrès), en français ou en
// occitan, pour l'outil « Pausar los mots » de Triar (Romain, 07-11 : « une
// barre de recherche… connectée à l'API du Congrès, comme ça je peux choisir
// directement en étant sûr de la véracité »).
//
// La clé reste sur le serveur : variable LOCONGRES_API_KEY (app/.env en local ;
// en ligne, secret du namespace Scaleway « ligam-web », Paramètres du
// namespace › Secrets, posé par Romain le 07-11 ; jamais dans Git). Un secret
// changé ne sert qu'au déploiement suivant. Rien n'est gardé : les CGU de lo Congrès interdisent de conserver les
// données brutes ; la réponse part au navigateur sans cache.
//
// lo Basic répond toujours forms = le français, trads = l'occitan (avec sa
// variété) ; PoS « N1210 » : N = nom, 3e signe 1 = masculin / 2 = féminin,
// 4e signe 1 = singulier / 2 = pluriel. On garde le languedocien et l'occitan
// commun (var « lengadoc » et « oc »).
import { env } from '$env/dynamic/private';

const API = 'https://api.locongres.org/basic.php';
const VARIETATS = ['lengadoc', 'oc'];

const vocala = (m) => /^h?[aàáâeèéêiíîïoòóôuúûüy]/i.test(m);

/** Le genre et le nombre d'un nom d'après son PoS, sinon null. */
export function genre(PoS) {
	const p = PoS?.[0] ?? '';
	if (p[0] !== 'N' || !'12'.includes(p[2])) return null;
	return { f: p[2] === '2', pl: p[3] === '2' };
}

/** Le mot avec son article (occitan ou français), si c'est un nom. */
export function ambArticle(mot, PoS, lenga) {
	const g = genre(PoS);
	if (!g) return mot;
	if (g.pl) return (lenga === 'oc' ? (g.f ? 'las ' : 'los ') : 'les ') + mot;
	if (vocala(mot)) return 'l’' + mot;
	return (lenga === 'oc' ? (g.f ? 'la ' : 'lo ') : g.f ? 'la ' : 'le ') + mot;
}

/** Les couples [occitan, français] d'une réponse de lo Basic. */
export function couples(data, terme, lenga) {
	const vists = new Set();
	const r = [];
	const t = terme.toLowerCase();
	for (const e of data?.query ?? []) {
		const fr = e.forms?.[0];
		if (!fr?.orth) continue;
		const trads = (e.trads ?? [])
			.filter((x) => VARIETATS.includes(x.var) && x.orth)
			// en partant de l'occitan : le mot cherché, pas ses voisins de l'entrée
			.filter((x) => lenga !== 'oc' || x.orth.toLowerCase() === t)
			.sort((a, b) => VARIETATS.indexOf(a.var) - VARIETATS.indexOf(b.var));
		for (const x of trads) {
			const oc = ambArticle(x.orth, x.PoS, 'oc');
			const f = ambArticle(fr.orth, fr.PoS, 'fr');
			const k = `${oc}|${f}`;
			if (vists.has(k)) continue;
			vists.add(k);
			r.push({ oc, fr: f, var: x.var });
		}
	}
	return r;
}

async function demandar(lenga, terme) {
	const u = new URL(API);
	u.searchParams.set('key', env.LOCONGRES_API_KEY);
	u.searchParams.set('lang', lenga);
	u.searchParams.set('term', terme);
	u.searchParams.set('var', 'lengadoc');
	const res = await fetch(u, { signal: AbortSignal.timeout(6000) });
	if (!res.ok) throw new Error(`lo Congrès : ${res.status}`);
	return couples(await res.json(), terme, lenga);
}

export const clauPresenta = () => Boolean(env.LOCONGRES_API_KEY);
export const reviradaPresenta = () => Boolean(env.REVIRADA_API_KEY);

/** Cherche le terme en français et en occitan ; rend [{ oc, fr, var }]. */
export async function cercarBasic(terme) {
	// un sens qui plante (lo Basic plante parfois sur un mot qu'il a) n'efface pas l'autre
	const [oc, fr] = await Promise.allSettled([demandar('oc', terme), demandar('fr', terme)]);
	if (oc.status === 'rejected' && fr.status === 'rejected') throw oc.reason;
	const vists = new Set();
	return [...(oc.value ?? []), ...(fr.value ?? [])].filter((c) => !vists.has(c.oc + '|' + c.fr) && vists.add(c.oc + '|' + c.fr));
}

// ── Wikidata : les noms de lieux que lo Basic n'a pas ──
// (Romain, 07-11 : « Diplodoc, ça restreint trop… des mots comme Méditerranée ».)
// Mers, montagnes, rivières, communes : le libellé occitan de Wikidata
// (« Mar Mediterranèa », « Puòg de Sant Lop »), écrit par la communauté, donc
// à vérifier ; la description française aide à choisir la bonne entrée.
// Données libres (CC0) ; rien n'est gardé ici non plus.
const WIKIDATA = 'https://www.wikidata.org/w/api.php';
const UA = { 'User-Agent': 'LoLigam/1.0 (https://loligam.eu)' };
const PAS_UN_LUÒC = /nom de famille|prénom|homonymie|wikimedia|film|album|chanson|peinture|tableau|navire|ferry|jeu vidéo|livre|roman/i;

/** Les noms d'une réponse de Wikidata (entités avec un libellé occitan). */
export function nomsWikidata(ids, entitats) {
	const r = [];
	const vists = new Set();
	for (const id of ids) {
		const e = entitats?.[id];
		const oc = e?.labels?.oc?.value?.trim();
		const desc = e?.descriptions?.fr?.value?.trim() ?? '';
		if (!oc || PAS_UN_LUÒC.test(desc) || vists.has(oc)) continue;
		vists.add(oc);
		r.push({ oc, fr: e?.labels?.fr?.value?.trim() ?? '', font: 'wikidata', nota: desc.length > 80 ? desc.slice(0, 78).trim() + '…' : desc });
	}
	return r.slice(0, 4);
}

async function wikidata(params) {
	const u = new URL(WIKIDATA);
	for (const [k, v] of Object.entries({ ...params, format: 'json' })) u.searchParams.set(k, v);
	const res = await fetch(u, { headers: UA, signal: AbortSignal.timeout(6000) });
	if (!res.ok) throw new Error(`Wikidata : ${res.status}`);
	return res.json();
}

/** Cherche le terme dans les libellés français et occitans de Wikidata. */
export async function cercarWikidata(terme) {
	const cercas = await Promise.allSettled(
		['fr', 'oc'].map((language) => wikidata({ action: 'wbsearchentities', search: terme, language, uselang: language, limit: 5 }))
	);
	const ids = [...new Set(cercas.flatMap((c) => (c.status === 'fulfilled' ? (c.value.search ?? []).map((x) => x.id) : [])))]
		.filter((id) => /^Q\d+$/.test(id))
		.slice(0, 8);
	if (!ids.length) {
		if (cercas.every((c) => c.status === 'rejected')) throw cercas[0].reason;
		return [];
	}
	const d = await wikidata({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels|descriptions', languages: 'oc|fr' });
	return nomsWikidata(ids, d.entities);
}

// ── Revirada : la traduction automatique de lo Congrès, pour une expression
// entière (« coucher de soleil ») ──
// Elle demande sa propre clé (REVIRADA_API_KEY), distincte de celle des API de
// lo Congrès : à demander à info@locongres.org. Sans elle, rien n'est appelé.
// Le résultat est une traduction automatique : toujours marqué « à vérifier ».
// Mode d'emploi : https://revirada.eu/api_info (POST, moteur apertium,
// « fra » vers « oci » = languedocien).
const REVIRADA = 'https://api.revirada.eu/translate_string';

/** La traduction lue dans une réponse de Revirada, ou null si elle n'apporte rien. */
export function lecturaRevirada(data, terme) {
	const oc = String(data?.translated_text ?? '').trim().replace(/\s+/g, ' ');
	// un mot inconnu du moteur ressort marqué (*, #, @) ou tel quel
	if (!oc || /[*#@]/.test(oc) || oc.toLowerCase() === terme.toLowerCase()) return null;
	return { oc: oc.slice(0, 80), fr: terme, font: 'revirada' };
}

export async function cercarRevirada(terme) {
	const body = new URLSearchParams({
		api_key: env.REVIRADA_API_KEY,
		engine: 'apertium',
		content_type: 'txt',
		text: terme,
		source_language: 'fra',
		target_language: 'oci'
	});
	const res = await fetch(REVIRADA, { method: 'POST', body, signal: AbortSignal.timeout(8000) });
	if (!res.ok) throw new Error(`Revirada : ${res.status}`);
	const r = lecturaRevirada(await res.json(), terme);
	return r ? [r] : [];
}

/**
 * Toutes les sources à la fois : lo Basic d'abord (le plus sûr) ; s'il n'a
 * rien, les noms de Wikidata puis Revirada (sinon ils ne font que répéter lo
 * Basic, ou ajouter du bruit : « Informàtica en nivol » pour « nuage »). Une
 * source qui manque ou plante n'efface pas les autres ; l'état de chacune part
 * avec la réponse.
 */
export async function cercarTot(terme) {
	const estats = {};
	const sensArticle = (s) => s.toLowerCase().replace(/^(l[’']|lo |la |los |las )/, '');
	// une source : sa liste, ou rien si sa clé manque ou si elle plante
	const provar = async (nom, presenta, f) => {
		if (!presenta) return ((estats[nom] = 'sens-clau'), []);
		try {
			const l = await f();
			estats[nom] = 'ok';
			return l;
		} catch {
			estats[nom] = 'error';
			return [];
		}
	};
	let listas = [await provar('basic', clauPresenta(), async () => (await cercarBasic(terme)).map((x) => ({ ...x, font: 'basic' })))];
	// on ne va plus loin que si lo Basic n'a rien (sobriété, et moins de bruit)
	if (!listas[0].length)
		listas = listas.concat(
			await Promise.all([provar('wikidata', true, () => cercarWikidata(terme)), provar('revirada', reviradaPresenta(), () => cercarRevirada(terme))])
		);
	const vists = new Set();
	const resultats = listas.flat().filter((x) => {
		const k = sensArticle(x.oc);
		return !vists.has(k) && vists.add(k);
	});
	return { resultats, estats };
}

// ── Vérification mot à mot (Revirar, 2026-11-13) ──
// Romain traduit une phrase sans aide ; chaque mot qu'il a écrit (et chaque mot
// du modèle) est cherché dans lo Basic, côté occitan. Un mot est « ok » si lo
// Basic le connaît (languedocien ou occitan commun), « absent » sinon, « error »
// si lo Basic n'a pas répondu. Un pluriel régulier est essayé aussi sans son « s » ; un mot absent
// de lo Basic est cherché comme forme conjuguée dans vèrb'Òc. Rien n'est gardé ici.
const MAX_MOTS = 30;
const SIMULTANIS = 3; // sobriété envers l'API : trois demandes à la fois au plus

// Seconde passe : lo Basic ne connaît que les mots de base ; vèrb'Òc remonte
// d'une forme conjuguée à son infinitif (mêmes paramètres que
// scripts/verificar-oc.mjs). Rend true si le mot est une forme conjuguée.
async function conjugat(mot) {
	const u = new URL('https://api.locongres.org/verboc.php');
	u.searchParams.set('key', env.LOCONGRES_API_KEY);
	u.searchParams.set('form', mot);
	u.searchParams.set('var', 'lengadoc');
	const res = await fetch(u, { signal: AbortSignal.timeout(6000) });
	if (!res.ok) throw new Error(`vèrb'Òc : ${res.status}`);
	const data = await res.json();
	return (data?.query ?? []).some((f) => f.inf);
}

async function verificarUn(mot, cercar, conjugar) {
	const candidats = [mot, ...(mot.endsWith('s') && mot.length > 3 ? [mot.slice(0, -1)] : [])];
	let pana = false;
	for (const c of candidats) {
		try {
			if ((await cercar('oc', c)).length) return 'ok';
		} catch {
			pana = true;
		}
	}
	try {
		if (await conjugar(mot)) return 'ok';
	} catch {
		pana = true;
	}
	return pana ? 'error' : 'absent';
}

/**
 * Vérifie une liste de mots occitans (minuscules, 3 lettres au moins) ;
 * rend { estat: 'ok' | 'sens-clau', mots: { mot: 'ok' | 'absent' | 'error' } }.
 * « ok » = connu de lo Basic, ou reconnu comme forme conjuguée par vèrb'Òc.
 * `cercar`, `clau` et `conjugar` sont injectables pour les tests.
 */
export async function verificarMots(mots, cercar = demandar, clau = clauPresenta(), conjugar = conjugat) {
	if (!clau) return { estat: 'sens-clau', mots: {} };
	const lista = [...new Set(mots)].slice(0, MAX_MOTS);
	const r = {};
	let i = 0;
	const trabalh = async () => {
		while (i < lista.length) {
			const m = lista[i++];
			r[m] = await verificarUn(m, cercar, conjugar);
		}
	};
	await Promise.all(Array.from({ length: Math.min(SIMULTANIS, lista.length) }, trabalh));
	return { estat: 'ok', mots: r };
}

export const MAX_MOTS_VERIFICAR = MAX_MOTS;
