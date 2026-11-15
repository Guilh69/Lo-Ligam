// Écrire et relire un effet rangé dans la base (page « efiechs » de
// pagina_elements). La colonne oc porte un texte JSON { config, dessin } : la
// configuration de l'effet et le dessin nettoyé (des données, jamais du SVG).
// À la lecture, les deux repassent par les vérifications de la bibliothèque :
// rien d'autre ne peut entrer dans une page.
import { configPropre } from './biblio/catalogue.js';
import { validerDessin } from './biblio/dessin.js';

export const TAILLE_MAX = 300000; // lettres du texte rangé, au plus

/** Le texte rangé dans la base */
export function escriure(config, dessin) {
	const t = JSON.stringify({ config: configPropre(config), dessin: dessin ? validerDessin(dessin) : null });
	if (t.length > TAILLE_MAX) throw new Error('Le dessin est trop détaillé pour être rangé : le simplifier dans le logiciel de dessin.');
	return t;
}

/** Relit une ligne de la base : { config, dessin } vérifiés, ou null */
export function legir(oc) {
	if (typeof oc !== 'string' || oc.length > TAILLE_MAX) return null;
	let x;
	try {
		x = JSON.parse(oc);
	} catch {
		return null;
	}
	if (!x || typeof x !== 'object' || !x.config || typeof x.config !== 'object') return null;
	const dessin = x.dessin ? validerDessin(x.dessin) : null;
	// un dessin présent mais refusé : on ne joue rien plutôt que des formes inattendues
	if (x.dessin && !dessin) return null;
	return { config: configPropre(x.config), dessin };
}

// Les couleurs du site pour la teinte « palette », lues au moment de s'en
// servir (règle des Colors, 2026-11-13 : jamais recopiées dans une constante).
const VARIABLES = ['--p-brique', '--p-ocre', '--p-sarcelle', '--p-or', '--p-olive', '--p-bleu'];
export function couleursSite() {
	if (typeof document === 'undefined') return [];
	const st = getComputedStyle(document.documentElement);
	return VARIABLES.map((v) => st.getPropertyValue(v).trim().toLowerCase()).filter((c) => /^#[0-9a-f]{6}$/.test(c));
}
