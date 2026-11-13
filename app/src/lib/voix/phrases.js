// Une phrase = un enregistrement. Ce fichier donne à chaque phrase à dire du
// parcours A1 une clé stable, dresse la liste des phrases d'un module, et
// retrouve le fichier son d'une phrase.
//
// Fonctions pures, sans API propre au navigateur ni à Node : le même code sert
// à la leçon (navigateur) et aux scripts (studio d'enregistrement, mise au
// propre). Rien à nommer à la main : le nom du fichier vient de la clé.
import { moduls } from '../lesson/moduls/index.js';
import { VOTZ } from './voix-index.js';

/**
 * Texte occitan normalisé : minuscules, ponctuation et marques de mise en
 * forme (* ** …) retirées, espaces réduits. Les ACCENTS SONT CONSERVÉS : en
 * occitan ils changent le mot (pòrta/porta, cossí/cossi…). Les lettres sont
 * mises en forme composée (NFC) pour qu'un accent saisi de deux façons donne
 * la même clé. Apostrophes et traits d'union comptent comme des espaces.
 */
export function normalisar(oc) {
	return String(oc ?? '')
		.normalize('NFC')
		.toLowerCase()
		.replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
		.trim();
}

/** FNV-1a 32 bits du texte (UTF-8), en hexadécimal sur 8 caractères. */
export function empreinta(text) {
	let h = 0x811c9dc5;
	for (const octet of new TextEncoder().encode(text)) {
		h ^= octet;
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
}

/**
 * Clé stable d'une phrase dans un module.
 * - expression « À retenir » avec `id` : `<modulId>/<id>`
 * - réplique de dialogue (ou expression sans `id`) : `<modulId>/d-<empreinte>`
 * `phrase` est un objet {oc, id?} ou directement le texte occitan.
 * Une réplique corrigée change de clé : c'est voulu (elle sera « à refaire »).
 */
export function clauDe(modulId, phrase) {
	if (phrase && typeof phrase === 'object' && phrase.id) return `${modulId}/${phrase.id}`;
	const oc = typeof phrase === 'string' ? phrase : phrase?.oc;
	return `${modulId}/d-${empreinta(normalisar(oc))}`;
}

/**
 * Phrases à enregistrer d'un module, dans l'ordre de la leçon, sans doublon de
 * clé (deux répliques identiques partagent le même enregistrement) :
 * { clau, oc, fr, tipe: 'replica' | 'expression', scena? }
 */
export function frasasDe(modul) {
	const modulId = modul.slug;
	const vues = new Set();
	const sortie = [];
	const ajouter = (phrase, tipe, scena) => {
		const oc = typeof phrase === 'string' ? phrase : phrase?.oc;
		if (!normalisar(oc)) return; // rien à dire
		const clau = clauDe(modulId, phrase);
		if (vues.has(clau)) return;
		vues.add(clau);
		const f = { clau, oc, fr: (typeof phrase === 'object' && phrase.fr) || '', tipe };
		if (scena !== undefined) f.scena = scena;
		sortie.push(f);
	};
	for (const session of modul.sessions ?? []) {
		for (const block of session.blocks ?? []) {
			if (block.type === 'dialogue') {
				for (const scene of block.scenes ?? []) {
					for (const line of scene.lines ?? []) ajouter(line, 'replica', scene.title);
				}
			} else if (block.type === 'chunks') {
				for (const c of block.items ?? []) ajouter(c, 'expression');
			}
		}
	}
	return sortie;
}

/** Les phrases des 38 modules, dans l'ordre du registre. */
export function totasLasFrasas() {
	return Object.values(moduls).flatMap((m) => frasasDe(m));
}

/** Chemin public du son d'une phrase, ou null s'il n'existe pas encore. */
export function sonDe(modulId, phrase) {
	return VOTZ[clauDe(modulId, phrase)] ?? null;
}
