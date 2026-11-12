// Le fil d'Ariane du site : d'où l'on vient, et où « revenir ». Une seule source pour toutes les pages
// (Romain, 2026-11-08, option C des « retours » : une pièce « ‹ parent » sur téléphone, le fil d'Ariane
// sur ordinateur ; avant, neuf fils écrits à la main, deux liens « ‹ S'apren », un bouton en bas de
// page, et rien sur Compte, Mots, Idées et Istòria).
//
// L'arbre vient du plan du site (planSite.js : rubriques et leurs pages) ; on n'ajoute ici que ce qui
// n'y figure pas : les pages d'un niveau de plus (une œuvre, un média, un livre), les fiches
// (Cultura, Grammaire) et Mon istòria, qui remonte à l'accueil.
import { PLAN, LO_LIGAM } from './planSite.js';

export const ACCUEIL = { oc: 'Acuèlh', fr: 'Accueil', es: 'Inicio', en: 'Home', ca: 'Inici', ar: 'الرئيسية' };
const LIBRES = { oc: 'Libres', fr: 'Livres', es: 'Libros', en: 'Books', ca: 'Llibres', ar: 'الكتب' };

// les pages d'un niveau de plus : chemin → chemin du parent
const SOUS = {
	'/obras/literatura': '/obras',
	'/obras/cinema': '/obras',
	'/obras/afichas': '/obras',
	'/medias/radios': '/medias',
	'/medias/television': '/medias',
	'/medias/premsa': '/medias',
	'/medias/livres': '/medias',
	'/medias/livres/pastre-1913': '/medias/livres',
	'/istoria': '/',
	// la Constitution en occitan (2026-11-12) : sous Se parla, pas encore dans le menu (décision de Romain à prendre)
	'/constitucion': '/parla'
};
// les noms des pages qui ne sont pas dans le plan
const CONSTITUCION = { oc: 'Constitucion', fr: 'Constitution', es: 'Constitución', en: 'Constitution', ca: 'Constitució', ar: 'الدستور' }; // es/en/ca/ar : à relire par Aran
const ETIQUETAS = { '/': ACCUEIL, '/medias/livres': LIBRES, '/istoria': LO_LIGAM.find((x) => x.href === '/istoria'), '/constitucion': CONSTITUCION };

// chemin → { etiq, rubrica, parent }
const PAGINAS = new Map();
for (const r of PLAN) {
	PAGINAS.set(r.href, { etiq: r, rubrica: r, parent: null });
	for (const it of r.grops.flatMap((g) => g.items)) PAGINAS.set(it.href, { etiq: it, rubrica: null, parent: r.href });
}
for (const [chemin, etiq] of Object.entries(ETIQUETAS)) if (!PAGINAS.has(chemin)) PAGINAS.set(chemin, { etiq, rubrica: null, parent: null });

const norm = (c) => (c.length > 1 ? c.replace(/\/+$/, '') : c) || '/';

// le parent d'un chemin : celui du plan, celui de SOUS ; pour une fiche (page inconnue), le chemin
// sans son dernier segment, jusqu'à tomber sur une page connue
function parentDe(chemin) {
	if (chemin === '/') return null;
	if (chemin in SOUS) return SOUS[chemin];
	const p = PAGINAS.get(chemin);
	if (p) return p.parent;
	const i = chemin.lastIndexOf('/');
	return i > 0 ? chemin.slice(0, i) : '/';
}

/**
 * Le fil d'Ariane d'une page.
 * @returns {null | { miettes: { href: string, etiq: object, n?: string }[], parent: { href: string, etiq: object }, actuelle: object | null }}
 *   `miettes` : les pages au-dessus, de la plus haute à la plus proche ; `parent` : la plus proche (la pièce « ‹ parent ») ;
 *   `actuelle` : le nom de la page dans le plan, s'il y est (sinon la page le donne). Null pour une rubrique ou l'accueil.
 */
export function fil(chemin) {
	const c = norm(chemin);
	const haut = [];
	for (let q = parentDe(c); q; q = parentDe(q)) {
		if (haut.length > 6) break; // garde-fou
		haut.unshift(q);
	}
	const miettes = haut
		.map((href) => {
			const p = PAGINAS.get(href);
			return p ? { href, etiq: p.etiq, ...(p.rubrica ? { n: p.rubrica.n } : {}) } : null;
		})
		.filter(Boolean);
	if (!miettes.length) return null;
	const nom = PAGINAS.get(c);
	return { miettes, parent: miettes[miettes.length - 1], actuelle: nom ? nom.etiq : null };
}
