// Catalogue des fiches de vocabulaire illustrées (les « designs » Canva).
// Établi le 2026-08-03 en ouvrant les 28 fichiers un par un : chaque fiche
// porte un thème, des mots occitans avec prononciation et traduction.
//
// ⚠ DOUBLONS repérés à cette occasion : design-18 est identique à
// design-07 (lo can), design-26 identique à design-08 (lo gat). 28
// fichiers pour 26 fiches réelles. Ils sont marqués `doblon: true` et
// exclus de l'affichage, mais gardés dans le carrousel de fond.
//
// Les titres occitans sont ceux écrits sur les fiches par Romain, donc
// déjà validés. Les noms de catégories, eux, sont ma proposition — à
// ajuster librement.

export const categories = [
	{
		id: 'espaci',
		oc: 'Espaci',
		fr: 'Espace',
		desc_oc: 'Las planetas e lo cèl',
		desc_fr: 'Les planètes et le ciel',
		color: 'var(--color-sky)'
	},
	{
		id: 'animals',
		oc: 'Animals',
		fr: 'Animaux',
		desc_oc: 'Las bèstias de tots los jorns',
		desc_fr: 'Les bêtes du quotidien',
		color: 'var(--color-teal)'
	},
	{
		id: 'astrologia',
		oc: 'Astrologia',
		fr: 'Astrologie',
		desc_oc: 'Los signes e lors elements',
		desc_fr: 'Les signes et leurs éléments',
		color: 'var(--color-olive)'
	},
	{
		id: 'imaginari',
		oc: 'Imaginari',
		fr: 'Imaginaire',
		desc_oc: 'Castèls, dragons e prince',
		desc_fr: 'Châteaux, dragons et prince',
		color: 'var(--color-gold)'
	},
	{
		id: 'vida',
		oc: 'Vida vidanta',
		fr: 'Vie quotidienne',
		desc_oc: 'Los moments de la jornada',
		desc_fr: 'Les moments de la journée',
		color: 'var(--color-terracotta)'
	},
	{
		id: 'ostal',
		oc: 'Ostal',
		fr: 'Maison',
		desc_oc: "Las pèças e çò que i a dedins",
		desc_fr: 'Les pièces et ce qu’il y a dedans',
		color: 'var(--color-brick)'
	},
	{
		id: 'temps',
		oc: 'Temps que fa',
		fr: 'Météo',
		desc_oc: 'Solelh, auratge e vent',
		desc_fr: 'Soleil, orage et vent',
		color: 'var(--color-sky)'
	},
	{
		id: 'espòrt',
		oc: 'Espòrt',
		fr: 'Sport',
		desc_oc: 'Se bolegar en occitan',
		desc_fr: 'Bouger en occitan',
		color: 'var(--color-teal)'
	},
	{
		id: 'emplec',
		oc: 'Emplec',
		fr: 'Usage',
		desc_oc: 'Tornuras e biaisses de dire',
		desc_fr: 'Tournures et façons de dire',
		color: 'var(--color-olive)'
	}
];

const f = (n, cat, oc, fr, doblon = false) => ({
	id: `design-${String(n).padStart(2, '0')}`,
	src: `/bg/design-${String(n).padStart(2, '0')}.webp`,
	cat,
	oc,
	fr,
	doblon
});

export const fichas = [
	f(1, 'astrologia', 'Signes de fuòc', 'Signes de feu'),
	f(2, 'espaci', 'Mercuri', 'Mercure'),
	f(3, 'astrologia', 'Signes d’aiga', 'Signes d’eau'),
	f(4, 'imaginari', 'Lo prince', 'Le prince'),
	f(5, 'imaginari', 'Lo dragon', 'Le dragon'),
	f(6, 'imaginari', 'Lo castèl', 'Le château'),
	f(7, 'animals', 'Lo can / La canha', 'Le chien / La chienne'),
	f(8, 'animals', 'Lo gat / La gata', 'Le chat / La chatte'),
	f(9, 'animals', 'Lo caval / La cavala', 'Le cheval / La jument'),
	f(10, 'espaci', 'Uranus', 'Uranus'),
	f(11, 'vida', 'La sòrre / Lo fraire', 'La sœur / Le frère'),
	f(12, 'astrologia', 'Signes astrologics', 'Signes astrologiques'),
	f(13, 'espaci', 'Jupitèr', 'Jupiter'),
	f(14, 'espaci', 'Saturn', 'Saturne'),
	f(15, 'espaci', 'Tèrra', 'Terre'),
	f(16, 'espaci', 'Las planetas', 'Les planètes'),
	f(17, 'temps', 'I a d’auratge', 'Il y a de l’orage'),
	f(18, 'animals', 'Lo can / La canha', 'Le chien / La chienne', true),
	f(19, 'espaci', 'Neptun', 'Neptune'),
	f(20, 'vida', 'Lo ser', 'Le soir'),
	f(21, 'vida', 'Lo matin', 'Le matin'),
	f(22, 'temps', 'Fa solelh', 'Il fait soleil'),
	f(23, 'ostal', 'L’ostal', 'La maison'),
	f(24, 'ostal', 'Lo salon', 'Le salon'),
	f(25, 'emplec', 'Non — Emplec', 'Non — Usage'),
	f(26, 'animals', 'Lo gat / La gata', 'Le chat / La chatte', true),
	f(27, 'espòrt', 'Natacion', 'Natation'),
	f(28, 'espòrt', 'Judo', 'Judo')
];

// Fiches réellement affichables (doublons écartés).
export const fichasUnicas = fichas.filter((x) => !x.doblon);

export function fichasPerCategoria(catId) {
	return fichasUnicas.filter((x) => x.cat === catId);
}
