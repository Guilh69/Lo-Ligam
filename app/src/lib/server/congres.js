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

/** Cherche le terme en français et en occitan ; rend [{ oc, fr, var }]. */
export async function cercarBasic(terme) {
	// un sens qui plante (lo Basic plante parfois sur un mot qu'il a) n'efface pas l'autre
	const [oc, fr] = await Promise.allSettled([demandar('oc', terme), demandar('fr', terme)]);
	if (oc.status === 'rejected' && fr.status === 'rejected') throw oc.reason;
	const vists = new Set();
	return [...(oc.value ?? []), ...(fr.value ?? [])].filter((c) => !vists.has(c.oc + '|' + c.fr) && vists.add(c.oc + '|' + c.fr));
}
