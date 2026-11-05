// Les mots de « Los panièrs » (chantier 27 ; deuxième jeu, Romain le
// 2026-11-05 : « Oui, Los panièrs »). Un mot tombe, on le range dans le bon
// panier. Seulement des choses déjà apprises : chaque mot renvoie à
// l'encadré « À retenir » d'un module des unités 1 et 2 (`id`), et
// paniers.test.js vérifie, contre les modules eux-mêmes, que la forme
// affichée (`oc`) y figure telle quelle. `panier` : 'a', 'b', ou 'ab' quand
// les deux conviennent (*Adieu* se dit en arrivant et en partant : la
// petite surprise du premier thème, dite à la fin).
// Occitan passé à lo Congrès le 2026-11-05 (arribar, masculin, femenin,
// question, responsa, tèma, plen, dedins, dos) ; à valider par Romain.

export const TEMAS = [
	{
		id: 'arribar',
		unitat: 1,
		nom: { oc: 'Arribar o partir', fr: 'Arriver ou partir' },
		paniers: [
			{ id: 'a', oc: 'per arribar', fr: 'pour arriver' },
			{ id: 'b', oc: 'per partir', fr: 'pour partir' }
		],
		nota: {
			oc: 'Adieu e Adieu-siatz son dins los dos panièrs : per arribar e per partir.',
			fr: 'Adieu et Adieu-siatz sont dans les deux paniers : pour arriver et pour partir.'
		},
		mots: [
			{ id: 'adieu', oc: 'Adieu !', panier: 'ab' },
			{ id: 'bonjorn', oc: 'Bonjorn !', panier: 'a' },
			{ id: 'bon-ser', oc: 'Bon ser !', panier: 'a' },
			{ id: 'encantat', oc: 'Encantat !', panier: 'a' },
			{ id: 'adieu-siatz', oc: 'Adieu-siatz !', panier: 'ab' },
			{ id: 'a-leu', oc: 'A lèu !', panier: 'b' },
			{ id: 'a-deman', oc: 'A deman !', panier: 'b' },
			{ id: 'al-cop-que-ven', oc: 'Al còp que ven !', panier: 'b' }
		]
	},
	{
		id: 'genre',
		unitat: 2,
		nom: { oc: 'Masculin o femenin', fr: 'Masculin ou féminin' },
		paniers: [
			{ id: 'a', oc: 'masculin', fr: 'masculin' },
			{ id: 'b', oc: 'femenin', fr: 'féminin' }
		],
		mots: [
			{ id: 'occitan-occitana', oc: 'occitan', panier: 'a' },
			{ id: 'occitan-occitana', oc: 'occitana', panier: 'b' },
			{ id: 'frances-francesa', oc: 'francés', panier: 'a' },
			{ id: 'frances-francesa', oc: 'francesa', panier: 'b' },
			{ id: 'catalan-catalana', oc: 'catalan', panier: 'a' },
			{ id: 'espanhol-espanhola', oc: 'espanhòla', panier: 'b' },
			{ id: 'italian-italiana', oc: 'italian', panier: 'a' },
			{ id: 'angles-anglesa', oc: 'anglesa', panier: 'b' },
			{ id: 'portugues-portuguesa', oc: 'portugués', panier: 'a' },
			{ id: 'marroquin-marroquina', oc: 'marroquina', panier: 'b' },
			{ id: 'argerian-argeriana', oc: 'argerian', panier: 'a' },
			{ id: 'el-ela', oc: 'el', panier: 'a' },
			{ id: 'el-ela', oc: 'ela', panier: 'b' },
			{ id: 'encantat', oc: 'Encantada !', panier: 'b' }
		]
	},
	{
		id: 'question',
		unitat: 2,
		nom: { oc: 'Question o responsa', fr: 'Question ou réponse' },
		paniers: [
			{ id: 'a', oc: 'question', fr: 'question' },
			{ id: 'b', oc: 'responsa', fr: 'réponse' }
		],
		mots: [
			{ id: 'cossi-vas', oc: 'Cossí vas ?', panier: 'a' },
			{ id: 'vau-plan', oc: 'Vau plan, mercés !', panier: 'b' },
			{ id: 'cossi-te-dison', oc: 'Cossí te dison ?', panier: 'a' },
			{ id: 'me-dison', oc: 'Me dison…', panier: 'b' },
			{ id: 'd-ont-sias', oc: 'D’ont siás ?', panier: 'a' },
			{ id: 'soi-de', oc: 'Soi de…', panier: 'b' },
			{ id: 'ont-demoras', oc: 'Ont demòras ?', panier: 'a' },
			{ id: 'demori-a', oc: 'Demòri a…', panier: 'b' },
			{ id: 'parlas-occitan', oc: 'Parlas occitan ?', panier: 'a' },
			{ id: 'oc-non', oc: 'Òc !', panier: 'b' },
			{ id: 'que-es-aquo', oc: 'Qué es aquò ?', panier: 'a' },
			{ id: 'sabi-pas', oc: 'Non sabi pas.', panier: 'b' },
			{ id: 'qui-es', oc: 'Qui es ?', panier: 'a' },
			{ id: 'soi-d-aqui', oc: 'Soi d’aquí.', panier: 'b' },
			{ id: 'podes-repetir', oc: 'Pòdes repetir, se te plai ?', panier: 'a' },
			{ id: 'oc-non', oc: 'Non !', panier: 'b' }
		]
	}
];

/** Le mot convient-il au panier ? ('ab' : aux deux) */
export const bonPanier = (mot, panierId) => mot.panier.includes(panierId);
