// Sections du site, partagées entre le menu du bandeau et le pied de
// page de l'accueil. « live » = section réelle et cliquable ; « soon »
// = existe dans la vision du projet mais pas encore construite (on
// l'affiche quand même, marquée « Lèu », plutôt que de la cacher —
// cf. discussion du 2026-07-31 sur la structure de l'accueil).
export const siteSections = [
	{
		id: 'aprendre',
		oc: 'Aprene',
		fr: 'Apprendre',
		desc_oc: "Lo parcors d'aprendissatge : leiçons, mots, exercicis.",
		desc_fr: "Le parcours d'apprentissage : leçons, mots, exercices.",
		href: '/aprene',
		status: 'live'
	},
	{
		id: 'carta',
		oc: 'Carta',
		fr: 'Carte',
		desc_oc: "Lo Mond en occitan : fons de carta, dialèctes, luòcs d'interès.",
		desc_fr: 'Le Monde en occitan : fond de carte, dialectes, lieux d’intérêt.',
		href: '/carta',
		status: 'live'
	},
	{
		id: 'comunautat',
		oc: 'Comunautat',
		fr: 'Communauté',
		desc_oc: "Escambiar amb d'autres aprendents e locutors.",
		desc_fr: 'Échanger avec d’autres apprenants et locuteurs.',
		status: 'soon'
	},
	{
		id: 'cultura',
		oc: 'Cultura',
		fr: 'Culture',
		desc_oc: 'Òbras, cançons e istòria en occitan.',
		desc_fr: 'Œuvres, chansons et histoire en occitan.',
		status: 'soon'
	},
	{
		id: 'apropos',
		oc: 'A prepaus',
		fr: 'À propos',
		desc_oc: 'La mission, l’equipa e la vision de Lo Ligam.',
		desc_fr: 'La mission, l’équipe et la vision de Lo Ligam.',
		status: 'soon'
	},
	{
		id: 'contact',
		oc: 'Contacte',
		fr: 'Contact',
		desc_oc: "Escriure a l'equipa de Lo Ligam.",
		desc_fr: 'Écrire à l’équipe de Lo Ligam.',
		status: 'soon'
	}
];

// Vérifiées le 2026-07-31 (recherche web) : sites officiels réels.
export const externalLinks = [
	{
		label: 'Lo Congrès',
		desc: 'Organisme officiel de régulation de la langue occitane',
		href: 'https://locongres.org/fr/lo-congres/linstitution/missions'
	},
	{
		label: 'OPLO — Ofici public de la lenga occitana',
		desc: 'Office public pour le développement de l’occitan',
		href: 'https://www.ofici-occitan.eu/fr/accueil/'
	}
];
