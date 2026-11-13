// Les ateliers de l'administration, rangés par usage (Lo talhièr, lot 1,
// 2026-11-06). La page Per tu (/admin) les présente avec une ligne
// d'explication ; la barre des ateliers (admin/+layout.svelte) les reprend,
// sur toutes les pages. Un atelier de plus : une ligne ici.
//
// Gabarit commun du 2026-11-07 (Romain : « trop de pages différentes qui ne
// fonctionnent pas dans un écosystème cohérent ») : La pila et Triar, deux
// pages du même geste (une carte à la fois), sont réunies en « A validar »
// (/admin/valider) ; chaque page a une largeur parmi trois (LARGEURS) ; « Ont ne
// sèm » entre dans le menu, il n'était atteignable que par un lien caché.
export const TALHIÈRS = [
	{
		grop: 'Contenu',
		ateliers: [
			{ href: '/admin/valider', oc: 'A validar', fr: 'garder, refaire ou répondre, une carte à la fois : la pile de l’IA, l’occitan des pages, le tri des dessins et des photos' },
			// libellé en français : pas de mot d'occitan nouveau sans vérification (lot 2 du studio, 2026-11-13)
			{ href: '/admin/voix', oc: 'Studio de voix', fr: 'enregistrer ta voix pour les phrases du parcours A1, une à une' },
			// libellé en français : pas de mot d'occitan nouveau sans vérification
			{ href: '/admin/revirar', oc: 'Traduire sans aide', fr: 't’entraîner à traduire une phrase du quotidien, mots vérifiés par lo Congrès' },
			{ href: '/admin/textes', oc: 'Tèxtes', fr: 'tous les textes modifiables du site, rangés par endroit' },
			{ href: '/admin/imaginar', oc: 'Imaginar', fr: 'entourer sur tes photos l’endroit où tu imagines une plaque, une enseigne, une publicité ; l’IA fabrique ensuite le montage' },
			{ href: '/admin/musica', oc: 'Musica', fr: 'trier les artistes de l’espace musique' },
			{ href: '/admin/designs', oc: 'Designs', fr: 'les designs : ajouter, publier, réordonner' },
			{ href: '/admin/grops', oc: 'Grops', fr: 'les groupes de designs' }
		]
	},
	{
		grop: 'Pilotage',
		ateliers: [
			{ href: '/admin/labo', oc: 'Laboratòri', fr: 'les choix de design à faire, les essais en cours et tes inspirations' },
			{ href: '/admin/seguit', oc: 'Ont ne sèm', fr: 'où en est chaque chantier, et ce qui t’attend' },
			{ href: '/admin/libret', oc: 'Livret technique', fr: 'comment marche tout le projet, brique par brique' }
		]
	},
	{
		grop: 'Communauté',
		ateliers: [
			{ href: '/admin/perfils', oc: 'Perfils', fr: 'accepter ou refuser les nouveaux profils' },
			{ href: '/admin/ideas', oc: 'Idèas', fr: 'lire la boîte à idées et répondre' }
		]
	},
	{
		grop: 'Carte',
		ateliers: [
			{ href: '/admin/carta', oc: 'Carta', fr: 'les couches de la carte' },
			{ href: '/admin/carta/luocs', oc: 'Luòcs', fr: 'les lieux de la carte' }
		]
	}
];

// le contrôle des verrous (essai d'écriture dans la base) : tout en bas
export const VERROLHS = { href: '/admin/verrolhs', oc: 'Verrolhs', fr: 'vérifier que la base refuse ce qu’elle doit refuser' };

// Une largeur par type de page, pour que l'administration ait le même gabarit partout :
//  - etroit : une carte à la fois (A validar) ;
//  - normal : lire et répondre (Per tu, Ont ne sèm) ;
//  - large  : comparer et trier (Laboratòri, Musica).
// Les pages qui n'en déclarent pas (les anciennes pages en cartes) gardent leur largeur propre.
export const LARGEURS = {
	'/admin': 'normal',
	'/admin/valider': 'etroit',
	'/admin/voix': 'etroit',
	'/admin/revirar': 'etroit',
	'/admin/seguit': 'normal',
	'/admin/libret': 'normal',
	'/admin/labo': 'large',
	'/admin/imaginar': 'large',
	'/admin/musica': 'large'
};
