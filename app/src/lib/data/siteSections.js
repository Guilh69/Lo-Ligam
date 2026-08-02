// Navigation du site, organisée en QUATRE FAMILLES construites sur des
// verbes : on dit au visiteur ce qu'il peut faire, plutôt que de lui
// faire deviner ce qu'il y a derrière un nom de rubrique. Un nouvel
// élément rejoint une famille existante au lieu d'allonger une liste à
// plat — c'est ce qui garde la navigation lisible en grandissant.
//
// Partagé entre le menu du bandeau, le pied de page et la section
// « Qu'es aquò » de l'accueil : une seule source de vérité.
//
// status : « live » = construit et cliquable ; « soon » = prévu, montré
// quand même (marqué « Lèu ») plutôt que caché, pour que le visiteur
// voie où va le projet.
export const families = [
	{
		id: 'aprene',
		oc: 'Aprene',
		fr: 'Apprendre',
		tagline_oc: "L'esquina del site",
		tagline_fr: 'La colonne vertébrale',
		color: 'var(--color-terracotta)',
		icon: 'book',
		items: [
			{
				id: 'parcors',
				oc: 'Lo parcors',
				fr: 'Le parcours',
				desc_oc: 'Leiçons, mots e exercicis, nivèl per nivèl.',
				desc_fr: 'Leçons, mots et exercices, niveau par niveau.',
				href: '/aprene',
				status: 'live'
			},
			{
				id: 'ensag',
				oc: 'Leiçon d’ensag',
				fr: 'Leçon d’essai',
				desc_oc: 'Una leiçon gratuita, sens compte.',
				desc_fr: 'Une leçon gratuite, sans compte.',
				href: '/aprene/essai',
				status: 'live'
			},
			{
				id: 'progression',
				oc: 'Ma progression',
				fr: 'Ma progression',
				desc_oc: 'Retròba ont ne siás demorat.',
				desc_fr: 'Retrouve où tu en étais resté.',
				href: '/compte',
				status: 'live'
			}
		]
	},
	{
		id: 'descobrir',
		oc: 'Descobrir',
		fr: 'Découvrir',
		tagline_oc: 'Lo país e sa cultura',
		tagline_fr: 'Le pays et sa culture',
		color: 'var(--color-teal)',
		icon: 'occitania',
		items: [
			{
				id: 'carta',
				oc: 'La carta',
				fr: 'La carte',
				desc_oc: "Lo Mond en occitan : dialèctes, luòcs d'interès.",
				desc_fr: 'Le Monde en occitan : dialectes, lieux d’intérêt.',
				href: '/carta',
				status: 'live'
			},
			{
				id: 'mots-imatges',
				oc: 'Mots en imatges',
				fr: 'Mots en images',
				desc_oc: 'Fichas de vocabulari illustradas, per tèma.',
				desc_fr: 'Fiches de vocabulaire illustrées, par thème.',
				href: '/mots',
				status: 'soon'
			},
			{
				id: 'bibliotèca',
				oc: 'Bibliotèca',
				fr: 'Bibliothèque',
				desc_oc: 'Musica, filmes e libres en occitan.',
				desc_fr: 'Musique, films et livres en occitan.',
				status: 'soon'
			}
		]
	},
	{
		id: 'participar',
		oc: 'Participar',
		fr: 'Participer',
		tagline_oc: 'La comunautat',
		tagline_fr: 'La communauté',
		color: 'var(--color-olive)',
		icon: 'community',
		items: [
			{
				id: 'forum',
				oc: 'Forum',
				fr: 'Forum',
				desc_oc: 'Questions, respònsas, entrajuda.',
				desc_fr: 'Questions, réponses, entraide.',
				status: 'soon'
			},
			{
				id: 'grops',
				oc: 'Grops',
				fr: 'Groupes',
				desc_oc: 'Se retrobar en linha o per de verai.',
				desc_fr: 'Se retrouver en ligne ou pour de vrai.',
				status: 'soon'
			},
			{
				id: 'idèas',
				oc: 'Boita d’idèas',
				fr: 'Boîte à idées',
				desc_oc: 'Prepausa çò que te manca sul site.',
				desc_fr: 'Propose ce qui te manque sur le site.',
				status: 'soon'
			}
		]
	},
	{
		id: 'lo-ligam',
		oc: 'Lo Ligam',
		fr: 'Lo Ligam',
		tagline_oc: 'Qual sèm',
		tagline_fr: 'Qui nous sommes',
		color: 'var(--color-sky)',
		icon: 'cross',
		items: [
			{
				id: 'apropos',
				oc: 'A prepaus',
				fr: 'À propos',
				desc_oc: 'La mission, l’equipa e la vision.',
				desc_fr: 'La mission, l’équipe et la vision.',
				status: 'soon'
			},
			{
				id: 'ressorsas',
				oc: 'Ressorsas occitanas',
				fr: 'Ressources occitanes',
				desc_oc: 'Los actors de la lenga, e lors espleits.',
				desc_fr: 'Les acteurs de la langue, et leurs outils.',
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
		]
	}
];

// Liste à plat des entrées cliquables, pour le pied de page.
export const siteSections = families.flatMap((f) =>
	f.items.map((i) => ({ ...i, family: f.id, color: f.color, icon: f.icon }))
);

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
		desc_oc: 'Ofici public de la lenga occitana, per son desvolopament',
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
