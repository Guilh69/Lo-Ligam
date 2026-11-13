// Studio de voix (lot 2) : ce qui ne dépend pas de l'écran. Chemins dans le
// dossier privé, avancement calculé à partir du listing (pas de table à part),
// envoi d'une prise qui remplace l'ancienne, et deux « dépôts » : Supabase pour
// de vrai, la mémoire pour le mode d'essai (?edicion=simular) et les tests.
import { EXTENSIONS } from './enregistreur.js';

/** Dossier privé des enregistrements bruts (supabase/supabase-voix.sql). */
export const BUCKET = 'voix-brut';

/** Durée de validité d'une adresse d'écoute (le dossier est privé) : 10 min. */
export const DUREE_URL_S = 600;

/**
 * Chemin d'une prise dans le dossier. La clé contient déjà le module
 * (« 1-1/adieu ») : le fichier va donc dans le sous-dossier du module,
 * « 1-1/adieu.webm », comme le son final ira dans static/audio/moduls/1-1/.
 */
export function cheminEnvoi(clau, ext) {
	if (!clau || !/^[^/]+\/[^/]+$/.test(clau)) throw new Error(`clé de phrase inattendue : ${clau}`);
	if (!EXTENSIONS.includes(ext)) throw new Error(`extension inattendue : ${ext}`);
	return `${clau}.${ext}`;
}

/** « 1-1/adieu.webm » → { clau: '1-1/adieu', ext: 'webm' } ; null si ce n'est pas une prise. */
export function lireChemin(chemin) {
	const m = /^([^/]+\/[^/]+)\.([a-z0-9]+)$/.exec(String(chemin ?? ''));
	if (!m || !EXTENSIONS.includes(m[2])) return null;
	return { clau: m[1], ext: m[2] };
}

/**
 * Les prises présentes : clé → liste des chemins (plusieurs si la même phrase
 * a été gardée dans deux formats, depuis deux appareils).
 */
export function indexerListing(chemins) {
	const index = new Map();
	for (const c of chemins ?? []) {
		const lu = lireChemin(c);
		if (!lu) continue;
		const liste = index.get(lu.clau) ?? [];
		if (!liste.includes(c)) liste.push(c);
		index.set(lu.clau, liste);
	}
	return index;
}

/**
 * Avancement : pour chaque module, combien de ses phrases ont une prise, et le
 * total. `modules` : [{ slug, frasas: [{ clau }] }]. Un fichier qui ne
 * correspond à aucune phrase (phrase corrigée depuis, fichier d'essai) ne compte pas.
 */
export function avancement(modules, index) {
	let faites = 0;
	let total = 0;
	const parModule = {};
	for (const m of modules) {
		const f = m.frasas.filter((p) => index.has(p.clau)).length;
		parModule[m.slug] = { faites: f, total: m.frasas.length };
		faites += f;
		total += m.frasas.length;
	}
	return { faites, total, parModule };
}

/**
 * Prochaine phrase sans prise après la position `depuis` (en faisant le tour),
 * ou -1 si tout le module est fait.
 */
export function suivanteAFaire(frasas, index, depuis = -1) {
	const n = frasas.length;
	for (let pas = 1; pas <= n; pas++) {
		const i = (((depuis + pas) % n) + n) % n;
		if (!index.has(frasas[i].clau)) return i;
	}
	return -1;
}

/**
 * Garde une prise : envoi (en remplaçant le même chemin s'il existe), puis
 * suppression des autres formats de la même phrase. Rend la nouvelle liste
 * des chemins de cette phrase. Une erreur d'envoi remonte telle quelle (la
 * prise reste dans l'écran) ; une suppression ratée n'empêche pas de garder :
 * le fichier en trop sera retiré au prochain envoi.
 */
export async function garderPrise(depot, clau, prise, cheminsActuels = []) {
	const chemin = cheminEnvoi(clau, prise.ext);
	await depot.envoyer(chemin, prise.blob, prise.type);
	const anciens = cheminsActuels.filter((c) => c !== chemin);
	if (anciens.length) {
		try {
			await depot.supprimer(anciens);
			return [chemin];
		} catch {
			return [chemin, ...anciens];
		}
	}
	return [chemin];
}

/** Tous les chemins d'un sous-dossier, page par page. */
async function listerTout(listerPage, dossier) {
	const chemins = [];
	const taille = 1000;
	for (let depart = 0; ; depart += taille) {
		const page = await listerPage(dossier, taille, depart);
		chemins.push(...page);
		if (page.length < taille) return chemins;
	}
}

/** Le vrai dossier, dans Supabase. Les droits sont vérifiés par la base (RLS). */
export function depotSupabase(supabase) {
	const dossier = () => supabase.storage.from(BUCKET);
	const verifier = ({ data, error }) => {
		if (error) throw error;
		return data;
	};
	return {
		async lister(slug) {
			return listerTout(async (d, limit, offset) => {
				const data = verifier(await dossier().list(d, { limit, offset, sortBy: { column: 'name', order: 'asc' } }));
				// les sous-dossiers éventuels n'ont pas d'id : on ne garde que les fichiers
				return (data ?? []).filter((o) => o.id).map((o) => `${d}/${o.name}`);
			}, slug);
		},
		async envoyer(chemin, blob, type) {
			verifier(await dossier().upload(chemin, blob, { contentType: type, upsert: true, cacheControl: '0' }));
		},
		async supprimer(chemins) {
			verifier(await dossier().remove(chemins));
		},
		async urlEcoute(chemin) {
			return verifier(await dossier().createSignedUrl(chemin, DUREE_URL_S)).signedUrl;
		}
	};
}

/**
 * Dossier en mémoire : mode d'essai sans compte et tests. `panne` (fonction)
 * permet de simuler une coupure réseau sur un envoi.
 */
/** @param {{ initial?: string[], panne?: (chemin: string) => boolean, creerUrl?: (b: Blob) => string }} [options] */
export function depotMemoire({ initial = [], panne = () => false, creerUrl } = {}) {
	const fichiers = new Map(initial.map((c) => [c, new Blob([new Uint8Array([1])], { type: 'audio/webm' })]));
	const url = creerUrl ?? ((blob) => (globalThis.URL?.createObjectURL ? URL.createObjectURL(blob) : 'memoire:'));
	return {
		fichiers,
		async lister(slug) {
			return [...fichiers.keys()].filter((c) => c.startsWith(`${slug}/`)).sort();
		},
		async envoyer(chemin, blob) {
			if (panne(chemin)) throw new TypeError('Failed to fetch');
			fichiers.set(chemin, blob);
		},
		async supprimer(chemins) {
			for (const c of chemins) fichiers.delete(c);
		},
		async urlEcoute(chemin) {
			const b = fichiers.get(chemin);
			if (!b) throw new Error('Object not found');
			return url(b);
		}
	};
}

/** Message clair pour une erreur d'envoi ou de lecture du dossier. */
export function messageErreur(e) {
	const t = `${e?.message ?? ''} ${e?.name ?? ''} ${e?.statusCode ?? ''}`.toLowerCase();
	if (/failed to fetch|network|load failed|timeout|abort/.test(t) || (globalThis.navigator && navigator.onLine === false))
		return 'La connexion a coupé. Ta prise est gardée ici : appuie sur Réessayer.';
	if (/row-level|security|policy|unauthorized|403|401|jwt/.test(t))
		return 'Le dossier des voix refuse l’accès : reconnecte-toi avec ton compte administrateur, puis réessaie.';
	if (/mime|payload too large|413|size/.test(t)) return 'Le dossier des voix refuse ce fichier (format ou taille). Recommence la prise.';
	if (/bucket not found|not found/.test(t)) return 'Le dossier des voix n’existe pas encore dans la base (supabase-voix.sql à lancer).';
	return 'L’envoi n’a pas abouti. Ta prise est gardée ici : appuie sur Réessayer.';
}
