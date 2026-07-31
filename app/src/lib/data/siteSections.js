// Sections du site, partagées entre le menu du bandeau et le pied de
// page de l'accueil. « live » = section réelle et cliquable ; « soon »
// = existe dans la vision du projet mais pas encore construite (on
// l'affiche quand même, marquée « Lèu », plutôt que de la cacher —
// cf. discussion du 2026-07-31 sur la structure de l'accueil).
// icon = nom du composant icône (voir la table sectionIcons dans
// +page.svelte) ; color = variable CSS pour repérer vite la section.
export const siteSections = [
	{
		id: 'aprendre',
		oc: 'Aprene',
		fr: 'Apprendre',
		desc_oc: "Lo parcors d'aprendissatge : leiçons, mots, exercicis.",
		desc_fr: "Le parcours d'apprentissage : leçons, mots, exercices.",
		href: '/aprene',
		status: 'live',
		icon: 'book',
		color: 'var(--color-terracotta)'
	},
	{
		id: 'carta',
		oc: 'Carta',
		fr: 'Carte',
		desc_oc: "Lo Mond en occitan : fons de carta, dialèctes, luòcs d'interès.",
		desc_fr: 'Le Monde en occitan : fond de carte, dialectes, lieux d’intérêt.',
		href: '/carta',
		status: 'live',
		icon: 'occitania',
		color: 'var(--color-teal)'
	},
	{
		id: 'comunautat',
		oc: 'Comunautat',
		fr: 'Communauté',
		desc_oc: "Escambiar amb d'autres aprendents e locutors.",
		desc_fr: 'Échanger avec d’autres apprenants et locuteurs.',
		status: 'soon',
		icon: 'community',
		color: 'var(--color-olive)'
	},
	{
		id: 'cultura',
		oc: 'Cultura',
		fr: 'Culture',
		desc_oc: 'Òbras, cançons e istòria en occitan.',
		desc_fr: 'Œuvres, chansons et histoire en occitan.',
		status: 'soon',
		icon: 'quill',
		color: 'var(--color-brick)'
	},
	{
		id: 'apropos',
		oc: 'A prepaus',
		fr: 'À propos',
		desc_oc: 'La mission, l’equipa e la vision de Lo Ligam.',
		desc_fr: 'La mission, l’équipe et la vision de Lo Ligam.',
		status: 'soon',
		icon: 'cross',
		color: 'var(--color-sky)'
	},
	{
		id: 'contact',
		oc: 'Contacte',
		fr: 'Contact',
		desc_oc: "Escriure a l'equipa de Lo Ligam.",
		desc_fr: 'Écrire à l’équipe de Lo Ligam.',
		status: 'soon',
		icon: 'envelope',
		color: 'var(--color-gold)'
	}
];

// Vérifiées le 2026-07-31 (recherche web) : sites officiels réels.
export const externalLinks = [
	{
		label: 'Lo Congrès',
		desc_oc: 'Organisme oficial de regulacion de la lenga occitana',
		desc_fr: 'Organisme officiel de régulation de la langue occitane',
		href: 'https://locongres.org/fr/lo-congres/linstitution/missions',
		// Aisinas numericas realas del Congrès (verificadas lo 2026-07-31
		// sus locongres.org/fr/services/grand-public), afichadas dins un
		// sosmenú al clic sus la carta.
		tools: [
			{
				label: 'Site web',
				desc_oc: 'Lo site oficial de Lo Congrès',
				desc_fr: 'Le site officiel de Lo Congrès',
				href: 'https://locongres.org'
			},
			{
				label: 'Revirada',
				desc_oc: 'Traductor automatic occitan-francés',
				desc_fr: 'Traducteur automatique occitan-français',
				href: 'https://revirada.eu'
			},
			{
				label: 'Dicodòc',
				desc_oc: 'Diccionari occitan, 5 varietats',
				desc_fr: 'Dictionnaire occitan, 5 variétés',
				href: 'https://dicodoc.eu/fr/dictionnaires'
			},
			{
				label: 'Vèrbòc',
				desc_oc: 'Conjugador occitan complet',
				desc_fr: 'Conjugueur occitan complet',
				href: 'https://dicodoc.eu/fr/conjugaisons'
			},
			{
				label: 'Vòtz',
				desc_oc: 'Sintèsi vocala occitana',
				desc_fr: 'Synthèse vocale occitane',
				href: 'http://votz.eu'
			}
		]
	},
	{
		label: 'OPLO',
		desc_oc: "Ofici public de la lenga occitana, per son desvolopament",
		desc_fr: 'Office public de la langue occitane, pour son développement',
		href: 'https://www.ofici-occitan.eu/fr/accueil/'
	},
	{
		label: 'Lo Collègi d’Occitania',
		desc_oc: 'Formacion a distància en occitan dempuèi 1927',
		desc_fr: 'Formation à distance en occitan depuis 1927',
		href: 'https://www.collegioccitania.com/'
	},
	{
		label: 'CAOC',
		desc_oc: 'Cercle d’afrairament occitanocatalan',
		desc_fr: 'Cercle de jumelage occitano-catalan',
		href: 'https://caoc.cat/'
	},
	{
		label: 'CIRDOC',
		desc_oc: 'Institut occitan de cultura, patrimòni e documentacion',
		desc_fr: 'Institut occitan de culture, patrimoine et documentation',
		href: 'https://www.oc-cultura.eu'
	},
	{
		label: 'CFPO',
		desc_oc: 'Formacion professionala en occitan, Region Occitània',
		desc_fr: 'Formation professionnelle en occitan, Région Occitanie',
		href: 'https://www.cfpoccitan.org/'
	}
];
