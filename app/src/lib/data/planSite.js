// Plan du site sur le modèle de l'accueil (2026-10-15, cahier §11) : les trois
// verbes du titre « Se parla. S’apren. Amassa. » (« Se viu » jusqu’au 2026-10-21) rangent aussi le menu et le
// pied de page, comme l'Alliance des collectivités pour la qualité de l'air
// reprend dans son menu les questions de sa page d'accueil.
// Une seule source pour le menu-voile (MenuVel) et le pied de page.
// Les rubriques à développer avant la diffusion du site ont déjà leur lien
// (choix de Romain, 2026-10-15). Occitan nouveau : À VALIDER par Romain.
import { RESERVAR } from '$lib/acuelh/donadas.js';

// Les boutons « Reservar un cors » du bandeau et du menu mènent d'abord à la
// page qui explique le cours ; c'est elle qui ouvre le calendrier (Romain,
// 2026-10-24 : « éviter d'arriver directement sur mon calendrier »).
export const VISIO = '/apren/visio';

export const PLAN = [
	{
		id: 'parla', n: '01', oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث',
		// la page de la rubrique, sur le modèle de S'apren (Romain, 2026-10-25)
		href: '/parla',
		grops: [{ items: [
			{ oc: 'La carta', fr: 'La carte', es: 'El mapa', en: 'The map', ca: 'El mapa', ar: 'الخريطة', href: '/carta' },
			// Cultura à la place du wiki (Romain, 2026-11-04 : « ça va remplacer plutôt Wiki » ; /wiki y renvoie)
			{ oc: 'Cultura', fr: 'Culture', es: 'Cultura', en: 'Culture', ca: 'Cultura', ar: 'الثقافة', href: '/cultura' },
			// (venaient d'Amassa : le pays, ce qui s'y dit et s'y fait ; Romain, 2026-10-22)
			{ oc: 'Òbras', fr: 'Œuvres', es: 'Obras', en: 'Works', ca: 'Obres', ar: 'أعمال إبداعية', href: '/obras' },
			{ oc: 'Articles', fr: 'Articles', es: 'Artículos', en: 'Articles', ca: 'Articles', ar: 'مقالات', href: '/articles', aviat: true },
			// (la case Musicas de Se parla devenue Médias ; la musique est dans Òbras, 2026-10-25)
			{ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans', ar: 'وسائل الإعلام', href: '/medias' }
		] }]
	},
	{
		id: 'apren', n: '02', oc: 'S’apren', fr: 'S’apprend', es: 'Se aprende', en: 'Learn', ca: 'S’aprèn', ar: 'نتعلّم',
		// la page de la rubrique, en cases de couleur (2026-10-24)
		href: '/apren',
		grops: [{ items: [
			{ oc: 'Lo parcors', fr: 'Le parcours', es: 'El recorrido', en: 'The learning path', ca: 'El recorregut', ar: 'مسار التعلّم', href: '/aprene' },
			// Anem !, l'espace des petits (3 à 6 ans), à la place de la leçon d'essai, remplacée par le
			// module 0 joué sans compte (Romain, 2026-11-05 ; cahier §11 du 29-08). Occitan vérifié ; es/en/ca/ar à relire par Aran.
			{ oc: 'Anem ! Per los pichons', fr: 'Anem ! Pour les petits', es: 'Anem ! Para los pequeños', en: 'Anem! For little ones', ca: 'Anem ! Per als petits', ar: 'Anem ! للصغار', href: '/anem' },
			// Jòcs, les jeux pour apprendre (la sèrp de las letras, los panièrs), rubrique de S'apren
			// (Romain, 2026-11-05 : « une rubrique à part entière dans S'apren »). Occitan vérifié ; es/en/ca/ar à relire par Aran.
			{ oc: 'Jòcs', fr: 'Jeux', es: 'Juegos', en: 'Games', ca: 'Jocs', ar: 'ألعاب', href: '/apren/jocs' },
			// (venait d'Amassa : « c'est de l'apprentissage », Romain, 2026-10-22)
			{ oc: 'Mots en imatges', fr: 'Mots en images', es: 'Palabras en imágenes', en: 'Words in pictures', ca: 'Paraules en imatges', ar: 'كلمات بالصور', href: '/mots' },
			// Remira (contemple) : la page de calme où les mots se dessinent en poussière d'or, rubrique
			// de S'apren (Romain, 2026-11-05 : « Je crois que je préfère Remira »). Un nom se lit comme il se dit.
			{ oc: 'Remira', fr: 'Remira', es: 'Remira', en: 'Remira', ca: 'Remira', ar: 'Remira', href: '/apren/remira' },
			// (la grammaire, notion par notion : « plutôt dans apprendre la langue », Romain, 2026-11-03)
			{ oc: 'Gramatica', fr: 'Grammaire', es: 'Gramática', en: 'Grammar', ca: 'Gramàtica', ar: 'قواعد اللغة', href: '/apren/gramatica' },
			// (la page qui explique le cours avant le calendrier, Romain, 2026-10-24)
			{ oc: 'Corses en visio', fr: 'Cours en visio', es: 'Clases por videollamada', en: 'Video lessons', ca: 'Classes per videotrucada', ar: 'دروس عبر الفيديو', href: VISIO },
			// (était dans l'ancien pied de page : on ne retire aucune fonction)
			{ oc: 'Ma progression', fr: 'Ma progression', es: 'Mi progreso', en: 'My progress', ca: 'El meu progrés', ar: 'تقدّمي', href: '/compte' }
		] }]
	},
	{
		// « Amassa » / « Rassemble » remplace « Se viu » / « Se vit » (Romain, 2026-10-21 :
		// « se viu ne correspond pas au contenu ») ; l'id reste 'viu' (ancres, styles)
		id: 'viu', n: '03', oc: 'Amassa', fr: 'Rassemble', es: 'Reúne', en: 'Gather', ca: 'Reuneix', ar: 'نجتمع',
		// la page de la rubrique, en cases de couleur comme S'apren (2026-10-25)
		href: '/amassa',
		// Amassa = la communauté au sens strict (Òbras et Articles partis dans
		// Se parla le 2026-10-22)
		grops: [
			// (s'appelait « Amassa », devenu le nom de la rubrique, 2026-10-21)
			{ oc: 'La comunautat', fr: 'La communauté', es: 'La comunidad', en: 'The community', ca: 'La comunitat', ar: 'المجتمع', items: [
				// (Fòrum retiré le 2026-11-07, option 3 de Romain : le forum dans le site est écarté pour le
				// lancement, faute de modération possible seul, cahier §11 du 25-10 ; voir RETIRATS plus bas)
				{ oc: 'Grops', fr: 'Groupes', es: 'Grupos', en: 'Groups', ca: 'Grups', ar: 'المجموعات', href: '/grops' },
				{ oc: 'Boita d’idèas', fr: 'Boîte à idées', es: 'Buzón de ideas', en: 'Idea box', ca: 'Bústia d’idees', ar: 'صندوق الاقتراحات', href: '/ideas' }
			] }
		]
	},
	{
		// 4e rubrique « S'imagina » / « S'imagine » (Romain, 2026-11-12 : « une catégorie s'imagine, un peu plus
		// revendicatrice, avec la Constitution en occitan, des photomontages de plaques de rue en occitan, ce à quoi
		// pourrait ressembler l'espace public avec de l'occitan… créer un imaginaire » ; option « une 4e rubrique »).
		// Le ton reste celui du 22-10 : montrer par les faits, jamais militant au sens pesant. L'accueil garde pour
		// l'instant ses trois mondes (MiegTres lit les trois premières entrées) : sa 4e place est à trancher.
		// Occitan nouveau : À VALIDER par Romain ; es/en/ca/ar : à relire par Aran.
		id: 'imagina', n: '04', oc: 'S’imagina', fr: 'S’imagine', es: 'Se imagina', en: 'Imagine', ca: 'S’imagina', ar: 'نتخيّل',
		href: '/imagina',
		grops: [{ items: [
			{ oc: 'Constitucion', fr: 'Constitution', es: 'Constitución', en: 'Constitution', ca: 'Constitució', ar: 'الدستور', href: '/constitucion' },
			// les plaques de rue et l'espace public en occitan : pas encore faits (case « Aviat » jusqu'à la première pièce)
			{ oc: 'Las carrièras', fr: 'Les rues', es: 'Las calles', en: 'Streets', ca: 'Els carrers', ar: 'الشوارع', href: '/imagina/carrieras', aviat: true }
		] }]
	}
];

// Les pages pas encore ouvertes (Romain, 2026-11-07, option 3 : « Fòrum retiré, Articles Aviat »).
// - « aviat: true » sur une entrée du PLAN : le lien reste affiché mais n'en est plus un, avec la
//   pastille « Aviat » (pied de page, menu, accueil, cases de la rubrique). Quand la page ouvre :
//   retirer « aviat: true », rien d'autre.
// - RETIRATS : liens qui n'apparaissent nulle part au lancement, même dans les cases de rubrique
//   qui viennent de la base (la case « Fòrum » de /amassa y est encore). Pas d'écriture en base.
// es/en/ca/ar de « Aviat » : à relire par Aran.
export const AVIAT = { oc: 'Aviat', fr: 'Bientôt', es: 'Pronto', en: 'Soon', ca: 'Aviat', ar: 'قريبًا' };
export const RETIRATS = ['/forum'];
const aviats = PLAN.flatMap((c) => c.grops.flatMap((g) => g.items)).filter((it) => it.aviat).map((it) => it.href);
export const estAviat = (href) => aviats.includes(href);
export const estRetirat = (href) => RETIRATS.includes(href);

// La ligne du bas : qui est derrière Lo Ligam
export const LO_LIGAM = [
	{ oc: 'Mon ligam amb l’occitan', fr: 'Mon lien avec l’occitan', es: 'Mi vínculo con el occitano', en: 'My connection to Occitan', ca: 'El meu vincle amb l’occità', ar: 'علاقتي بالأوكسيتانية', href: '/istoria' }, // (ex-« Mon istòria », titre C de Romain, 2026-10-24)
	{ oc: 'Contacte', fr: 'Contact', es: 'Contacto', en: 'Contact', ca: 'Contacte', ar: 'التواصل', href: '/istoria#contacte' }, // (fin de Mon istòria, option A de Romain, 2026-10-24)
	{ oc: 'Instagram', fr: 'Instagram', es: 'Instagram', en: 'Instagram', ca: 'Instagram', ar: 'Instagram', href: 'https://www.instagram.com/lo_ligam/', defòra: true }
];

export { RESERVAR };
