// L'atelier « Bastir » (construire les leçons, 2026-11-16). Romain : garder la
// matière déjà écrite (« pas la jeter à la poubelle ») mais avoir, dans
// l'administration, chaque unité en bloc de couleur, ses leçons, et dans chaque
// leçon la matière d'un côté, la place de construire de l'autre, avec une
// bibliothèque de modalités où il choisit librement. Ce fichier lit le registre
// des modules (rien n'est recopié) et décrit la bibliothèque.
// Occitan des libellés passé par l'API de lo Congrès le 2026-11-16 : bastir,
// matèria, modalitat, leiçon, apondre, legir, jogar, veire, bibliotèca.
import { moduls, ordre } from '$lib/lesson/moduls/index.js';
import { colorUnitat, tintaPer } from '$lib/parcors/colors.js';

/**
 * Le cadre du nombre de mots, tiré de la recherche (synthèse du 2026-11-16) :
 * pas de chiffre qui fasse consensus (Conti) ; pour des débutants, 5 à 10
 * éléments nouveaux par leçon, une phrase entière comptant pour un ; un mot vu
 * dix fois se reconnaît sans se dire encore (Webb 2007) ; une scène plutôt
 * qu'une liste de mots voisins (Tinkham 1997, résultats récents plus nuancés).
 */
export const FORQUILHA = { min: 5, max: 10 };
export const SOURCES_FORQUILHA = [
	{ nom: 'Conti, « How many new words per lesson? »', url: 'https://gianfrancoconti.com/2017/01/08/how-many-new-words-should-you-teach-per-lesson-the-wrong-question/' },
	{ nom: 'Webb 2007, résumé', url: 'https://www.eslpod.com/research/how-words-are-learned/' },
	{ nom: 'Tinkham 1997', url: 'https://ideals.illinois.edu/items/19069' },
	{ nom: 'Frontiers 2022 (nuance)', url: 'https://frontiersin.org/articles/10.3389/fpsyg.2022.997951/full' }
];

/** le nom français d'un type de bloc du moteur de leçon */
export const NOM_BLOC = {
	qcm: 'choix multiple',
	reveal: 'penser puis révéler',
	order: 'remettre dans l’ordre',
	escriure: 'écrire la réponse',
	causida: 'dialogue à choisir',
	carta: 'toucher un lieu sur la carte',
	dialogue: 'scène à écouter',
	chunks: 'formules à retenir',
	table: 'tableau',
	note: 'note, texte à lire',
	checklist: 'bilan « je peux »',
	fotos: 'photos légendées'
};

/**
 * La bibliothèque des modalités. `bloc` : le type du moteur de leçon quand il
 * existe déjà ; `jòc` : un jeu de /apren/jocs qui existe mais n'entre pas
 * encore dans une leçon ; sinon la modalité est à créer.
 */
export const MODALITATS = [
	{
		grop: 'Découvrir les mots',
		items: [
			{ id: 'formulas', nom: 'Formules à retenir', desc: 'la phrase, sa prononciation, son sens', bloc: 'chunks' },
			{ id: 'fotos', nom: 'Photos légendées', desc: 'une image, un mot ou une phrase', bloc: 'fotos' },
			{ id: 'foto-votz', nom: 'Photo et voix', desc: 'une photo du sujet, ta voix qui la nomme' },
			{ id: 'tèxte', nom: 'Texte à lire', desc: 'une note, une règle, un peu de culture', bloc: 'note' }
		]
	},
	{
		grop: 'Écouter',
		items: [
			{ id: 'scena', nom: 'Scène à écouter', desc: 'un dialogue en répliques, avec le son', bloc: 'dialogue' },
			{ id: 'vocal', nom: 'Vocal seul', desc: 'un enregistrement à écouter, rien d’autre' },
			{ id: 'musica', nom: 'Musique', desc: 'une chanson, un air, ses paroles' }
		]
	},
	{
		grop: 'Jouer et répéter',
		items: [
			{ id: 'qcm', nom: 'Choix multiple', desc: 'une question, plusieurs réponses', bloc: 'qcm' },
			{ id: 'revelar', nom: 'Penser puis révéler', desc: 'chercher dans sa tête, puis voir', bloc: 'reveal' },
			{ id: 'ordre', nom: 'Remettre les mots dans l’ordre', desc: 'des tuiles à ranger en phrase', bloc: 'order' },
			{ id: 'letras', nom: 'Lettres dans le bon ordre', desc: 'reconstruire un mot lettre à lettre' },
			{ id: 'religar', nom: 'Relier les paires', desc: 'un mot et son sens, un son et son mot' },
			{ id: 'panièrs', nom: 'Remettre à sa place', desc: 'ranger les mots dans les bons paniers', jòc: 'Paniers' },
			{ id: 'intrus', nom: 'Trouver l’intrus', desc: 'le mot qui n’a rien à faire là', jòc: 'Intrus' },
			{ id: 'escriure', nom: 'Écrire la réponse', desc: 'taper le mot, accents tolérés', bloc: 'escriure' },
			{ id: 'causida', nom: 'Dialogue à choisir', desc: 'choisir la bonne réplique', bloc: 'causida' }
		]
	},
	{
		grop: 'Voir',
		items: [
			{ id: 'carta', nom: 'Sur la carte', desc: 'toucher un lieu, situer un mot', bloc: 'carta' },
			{ id: 'video', nom: 'Vidéo', desc: 'une scène filmée, un geste, un lieu' },
			{ id: 'animacion', nom: 'Animation', desc: 'un dessin qui bouge pour faire comprendre' },
			{ id: 'taula', nom: 'Tableau', desc: 'ranger une forme, une conjugaison', bloc: 'table' }
		]
	},
	{
		grop: 'Finir la leçon',
		items: [
			{ id: 'bilanç', nom: 'Bilan « je peux »', desc: 'cocher ce qu’on sait faire', bloc: 'checklist' },
			{ id: 'audacia', nom: 'Une audace dans la vraie vie', desc: 'oser une phrase dehors (ton 5e principe)' }
		]
	}
];

/** toutes les modalités à plat, par id */
export const MODALITAT = Object.fromEntries(MODALITATS.flatMap((g) => g.items).map((m) => [m.id, m]));

/** « existe », « dans les jeux » ou « à créer » : où en est la modalité */
export const estatModalitat = (m) => (m.bloc ? 'existe' : m.jòc ? 'jòc' : 'crear');

/** les éléments à retenir d'un module : tous les items des blocs « formules à retenir » */
export function elementsDe(m) {
	const vists = new Set();
	const fora = [];
	for (const s of m.sessions ?? [])
		for (const b of s.blocks ?? [])
			if (b.type === 'chunks')
				for (const it of b.items ?? []) {
					const clau = it.id ?? it.oc;
					if (vists.has(clau)) continue;
					vists.add(clau);
					fora.push({ id: clau, oc: it.oc, fr: it.fr, sound: it.sound });
				}
	return fora;
}

/** le nombre d'items d'un bloc (questions, répliques, lignes…) */
const nItems = (b) => b.items?.length ?? b.scenes?.length ?? b.lines?.length ?? b.rows?.length ?? 0;

/** les étapes d'un module et leurs blocs, en résumé */
export const etapasDe = (m) =>
	(m.sessions ?? []).map((s) => ({
		titol: s.title,
		fr: s.fr,
		minutes: s.minutes,
		blocs: (s.blocks ?? []).map((b) => ({ type: b.type, nom: NOM_BLOC[b.type] ?? b.type, titol: b.title, n: nItems(b) }))
	}));

/** « 1.2 » pour '1-2' ; rien pour une halte */
export const numModul = (slug) => (/^\d-\d$/.test(slug) ? slug.replace('-', '.') : '');

/** une leçon du parcours, résumée pour l'atelier */
export function leiçon(slug) {
	const m = moduls[slug];
	if (!m) return null;
	return { slug, num: numModul(slug), oc: m.oc, fr: m.fr, cando: m.cando, durada: m.durada, relu: m.relu, elements: elementsDe(m), etapas: etapasDe(m) };
}

/** les huit unités de l'A1 : leur titre (carte d'ouverture du 1er module), leur couleur, leurs quatre leçons */
export const UNITATS_A1 = Array.from({ length: 8 }, (_, i) => {
	const n = i + 1;
	const slugs = ordre.filter((s) => s.startsWith(`${n}-`));
	const ouv = moduls[slugs[0]]?.ouverture ?? {};
	return { n, titol: ouv.titre ?? `Unitat ${n}`, fr: ouv.fr ?? '', bloc: ouv.bloc ?? null, slugs };
});

/** la couleur d'une unité, lue au moment de s'en servir (Romain règle la palette depuis le site) */
export const colorsUnitat = (n) => {
	const fons = colorUnitat(n);
	return [fons, tintaPer(fons)];
};

/** les étapes hors unité : module 0, haltes, mission */
export const AUTRAS = ordre.filter((s) => !/^\d-\d$/.test(s));

/** l'unité d'une leçon ('1-3' → 1), ou null pour une halte */
export const unitatDe = (slug) => (/^\d-\d$/.test(slug) ? Number(slug[0]) : null);

// ————— Le brouillon de Romain (temps 2) —————
// Rangé comme les effets (atelier Efièch) : table pagina_elements, « page »
// bastir, une ligne par leçon, toujours à l'état de brouillon (lisible et
// modifiable par l'administrateur seul, RLS) ; jamais publié. Le contenu est un
// JSON relu avec soin à l'écriture comme à la lecture.
export const PAGINA_BASTIR = 'bastir';
export const clauBastir = (slug) => `bastir.${slug}`;
export const slugDeClau = (clau) => (typeof clau === 'string' && clau.startsWith('bastir.') ? clau.slice(7) : null);
const LIMITS = { tèma: 200, nota: 600, plan: 80, cibla: 99, json: 60000 };

const tèxte = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

/** un brouillon propre : thème, nombre de mots visé, déroulé de modalités connues */
export function brolhonPropre(x) {
	const plan = Array.isArray(x?.plan) ? x.plan : [];
	const cibla = Number(x?.cibla);
	return {
		tèma: tèxte(x?.tèma, LIMITS.tèma),
		cibla: Number.isFinite(cibla) ? Math.min(LIMITS.cibla, Math.max(0, Math.round(cibla))) : 0,
		plan: plan
			.filter((p) => p && typeof p.id === 'string' && MODALITAT[p.id])
			.slice(0, LIMITS.plan)
			.map((p) => ({ id: p.id, nota: tèxte(p.nota, LIMITS.nota) }))
	};
}

/** le texte rangé dans la colonne oc */
export function escriureBrolhon(x) {
	const t = JSON.stringify(brolhonPropre(x));
	if (t.length > LIMITS.json) throw new Error('Le brouillon est trop long pour être rangé.');
	return t;
}

/** relit une ligne de la base : le brouillon propre, ou null */
export function legirBrolhon(oc) {
	if (typeof oc !== 'string' || oc.length > LIMITS.json) return null;
	try {
		const x = JSON.parse(oc);
		return x && typeof x === 'object' ? brolhonPropre(x) : null;
	} catch {
		return null;
	}
}
