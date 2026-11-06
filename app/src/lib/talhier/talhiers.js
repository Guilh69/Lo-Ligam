// Les ateliers de l'administration, rangés par usage (Lo talhièr, lot 1,
// 2026-11-06). La page Per tu (/admin) les présente avec une ligne
// d'explication ; la barre des ateliers (admin/+layout.svelte) les reprend.
// Un atelier de plus : une ligne ici.
export const TALHIÈRS = [
	{
		grop: 'Contenu',
		ateliers: [
			{ href: '/admin/textes', oc: 'Tèxtes', fr: 'tous les textes modifiables du site, rangés par endroit' },
			{ href: '/admin/triar', oc: 'Triar', fr: 'garder ou refaire, un élément à la fois' },
			{ href: '/admin/musica', oc: 'Musica', fr: 'trier les artistes de l’espace musique' },
			{ href: '/admin/designs', oc: 'Designs', fr: 'les designs : ajouter, publier, réordonner' },
			{ href: '/admin/grops', oc: 'Grops', fr: 'les groupes de designs' }
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
