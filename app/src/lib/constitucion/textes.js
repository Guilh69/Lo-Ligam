// La Constitution du 4 octobre 1958 et les trois textes que son préambule cite, en occitan
// (traduction de Lo Ligam, à valider par Romain) face au texte français officiel (Conseil constitutionnel).
//
// Les textes sont des fichiers à lire et à corriger à la main : un bloc par ligne, « NNN balise texte »
// (balise : h2 titre, h3 article, p alinéa). `fr/<id>.txt` est le texte officiel, `oc/<id>.txt` la traduction ;
// les deux ont les mêmes numéros et les mêmes balises, ligne pour ligne (contrôlé par textes.test.js).
// Dans un alinéa, « ⏎ » sépare les lignes d'une liste ou deux paragraphes.
//
// L'occitan est lu tout de suite ; le français ne se charge que si le visiteur le demande (poids de la page).
const OC = import.meta.glob('./oc/*.txt', { query: '?raw', import: 'default', eager: true });
const FR = import.meta.glob('./fr/*.txt', { query: '?raw', import: 'default' });

const CC = 'https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/';

/** Les quatre textes, dans l'ordre où le préambule de la Constitution les appelle. */
export const TEXTES = [
	{
		id: 'const',
		href: '/constitucion',
		oc: 'Constitucion del 4 d’octòbre de 1958',
		fr: 'Constitution du 4 octobre 1958',
		cort: { oc: 'Constitucion', fr: 'Constitution' },
		sommaire: true,
		// à jour de la révision constitutionnelle du 8 mars 2024 (mention de la page officielle)
		jorn: { oc: 'Tèxte en vigor, a jorn de la revision constitucionala del 8 de març de 2024.', fr: 'Texte en vigueur, à jour de la révision constitutionnelle du 8 mars 2024.' },
		font: CC + 'texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur',
		legifrance: 'https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006071194'
	},
	{
		id: 'ddhc',
		href: '/constitucion/declaracion-1789',
		oc: 'Declaracion dels Dreches de l’Òme e del Ciutadan de 1789',
		fr: 'Déclaration des Droits de l’Homme et du Citoyen de 1789',
		cort: { oc: 'Declaracion de 1789', fr: 'Déclaration de 1789' },
		font: CC + 'declaration-des-droits-de-l-homme-et-du-citoyen-de-1789'
	},
	{
		id: 'pre46',
		href: '/constitucion/preambul-1946',
		oc: 'Preambul de la Constitucion del 27 d’octòbre de 1946',
		fr: 'Préambule de la Constitution du 27 octobre 1946',
		cort: { oc: 'Preambul de 1946', fr: 'Préambule de 1946' },
		font: CC + 'preambule-de-la-constitution-du-27-octobre-1946'
	},
	{
		id: 'charte',
		href: '/constitucion/carta-environament',
		oc: 'Carta de l’environament de 2004',
		fr: 'Charte de l’environnement de 2004',
		cort: { oc: 'Carta de l’environament', fr: 'Charte de l’environnement' },
		font: CC + 'charte-de-l-environnement-de-2004'
	}
];

export const texte = (id) => TEXTES.find((t) => t.id === id);
/** Le texte d'une adresse « /constitucion/<fin> » (undefined si inconnu). */
export const texteDeFin = (fin) => TEXTES.find((t) => t.href === '/constitucion' + (fin ? '/' + fin : ''));

/** « 012 p Le texte… » → { id: '012', tag: 'p', txt: 'Le texte…' } */
export function parser(brut) {
	return brut
		.split('\n')
		.filter((l) => l.trim())
		.map((l) => {
			const m = l.match(/^(\d+) (h2|h3|p) (.*)$/);
			if (!m) throw new Error(`ligne illisible : ${l.slice(0, 60)}`);
			return { id: m[1], tag: m[2], txt: m[3] };
		});
}

export function blocsOc(id) {
	return parser(OC[`./oc/${id}.txt`]);
}

/** Le texte français officiel, chargé seulement à la demande. */
export async function blocsFr(id) {
	return parser(await FR[`./fr/${id}.txt`]());
}

const sansAccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const lien = (s) => sansAccent(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** L'ancre d'un titre ou d'un article (« art-75-1 », « titol-xi-bis »), null pour un alinéa. */
export function ancre(b) {
	if (b.tag === 'p') return null;
	const art = b.txt.match(/^article\s+([^\s.]+)/i);
	if (art) {
		const n = art[1].toLowerCase();
		return 'art-' + (['premier', 'primièr', 'primier', '1er', '1èr'].includes(n) ? '1' : n);
	}
	return lien(b.txt.split(' - ')[0]);
}

/**
 * Ce qui s'affiche d'un titre ou d'un article.
 * - « ARTICLE 34-1. » → { gros: 'Article 34-1' } ; « ARTICLE PREMIER. » → { gros: 'Article premier' }
 * - « Titre II - LE PRÉSIDENT… » → { petit: 'Titre II', gros: 'LE PRÉSIDENT…' }
 */
export function etiqueta(b) {
	const art = b.txt.match(/^article\s+(.+?)\.?$/i);
	if (art) return { gros: 'Article ' + art[1].toLowerCase() };
	const i = b.txt.indexOf(' - ');
	if (i > 0) return { petit: b.txt.slice(0, i), gros: b.txt.slice(i + 3) };
	return { gros: b.txt };
}

/**
 * Un alinéa en morceaux : des paragraphes et des listes (lignes qui commencent par « - »).
 * @returns {{ type: 'p' | 'liste', items: string[] }[]}
 */
export function morceaux(txt) {
	const lignes = txt.split(/\s*⏎\s*/).map((l) => l.trim()).filter(Boolean);
	const out = [];
	for (const l of lignes) {
		const item = l.match(/^[-–]\s+(.*)$/);
		const type = item ? 'liste' : 'p';
		const dernier = out[out.length - 1];
		if (type === 'liste' && dernier?.type === 'liste') dernier.items.push(item[1]);
		else out.push({ type, items: [item ? item[1] : l] });
	}
	return out;
}

/** Typographie française : espace insécable avant « : ; ! ? » et dans les guillemets. */
export const typo = (s) => s.replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
