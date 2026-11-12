// Comparer : plus, moins, aussi, le plus (pour aller plus loin). Règle :
// Gramatica, pages 38 et 39 (tan devant consonne, tant devant voyelle ; pas
// d'article répété après le nom). Exemples écrits pour la fiche. Occitan à
// relire par Romain.
export default {
	id: 'grases',
	capitol: 'grases',
	titol: 'Comparar',
	fr: 'Comparer : plus, moins, le plus',
	resumit: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.',
	validada: true,
	colors: { mai: 'oliva', mens: 'pruna', tan: 'blau' },
	ecrans: [
		{
			titol: 'Mai, mens, tan',
			blocs: [
				{
					type: 'intro',
					text: 'Pour comparer : **mai** … **que** (plus), **mens** … **que** (moins), **tan** … **coma** (aussi).'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'plus', gros: 'mai', color: 'mai', exemples: [['Es mai grand que son fraire.', 'il est plus grand que son frère'], ['Tolosa es mai granda qu’Albi.', 'Toulouse est plus grande qu’Albi']] },
						{ titol: 'moins', gros: 'mens', color: 'mens', exemples: [['Lo pan es mens car que lo vin.', 'le pain est moins cher que le vin']] },
						{ titol: 'aussi', gros: 'tan', color: 'tan', exemples: [['Es tan grand coma ieu.', 'il est aussi grand que moi'], ['Es tant aimable coma tu.', 'il est aussi aimable que toi']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des phrases.' },
				{ type: 'nota', text: 'Devant une voyelle, *tan* devient *tant* : *tant aimable*.' },
				{ type: 'font', pages: 'page 38' }
			]
		},
		{
			titol: 'Lo mai, plan',
			blocs: [
				{
					type: 'intro',
					text: 'Pour dire **le plus** ou **le moins** : *lo mai*, *la mens*… Pour dire **très** : *plan* ou *fòrça*.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le plus, le moins',
							frasas: [
								{ oc: 'Es **lo mai** grand de la classa.', fr: 'c’est le plus grand de la classe' },
								{ oc: 'Es la vila **mai** polida.', fr: 'c’est la ville la plus jolie' }
							]
						},
						{
							titol: 'Très',
							frasas: [
								{ oc: 'Es **plan** polida.', fr: 'elle est très jolie' },
								{ oc: 'Es **fòrça** bon.', fr: 'c’est très bon' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Après le nom, pas de second article : *la vila mai polida*, la ville la plus jolie.' },
				{ type: 'font', pages: 'page 39' }
			]
		},
		{
			titol: 'Melhor, pièger, mendre',
			blocs: [
				{
					type: 'intro',
					text: 'Trois mots remplacent *mai bon*, *mai marrit* et *mai pichon*.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'meilleur (mai bon)', gros: 'melhor', color: 'mai', exemples: [['Aqueste vin es melhor.', 'ce vin est meilleur'], ['una melhora plaça', 'une meilleure place']] },
						{ titol: 'pire (mai marrit)', gros: 'pièger', color: 'mens', exemples: [['Es pièger qu’ièr.', 'c’est pire qu’hier']] },
						{ titol: 'moindre (mai pichon)', gros: 'mendre', color: 'mens', exemples: [['lo mendre problèma', 'le moindre problème']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{ type: 'nota', text: '*melhor* prend un *-a* au féminin : *melhora*. *pièger* et *mendre* ne changent pas.' },
				{ type: 'font', pages: 'pages 38 et 39' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Complète chaque phrase avec le bon mot. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: 'Es … grand que son fraire.', fr: 'plus grand', forma: '|mai:mai', sens: 'Es mai grand que son fraire.', indici: 'plus : mai… que' },
						{ oc: 'Lo pan es … car que lo vin.', fr: 'moins cher', forma: '|mens:mens', sens: 'Lo pan es mens car que lo vin.', indici: 'moins : mens… que' },
						{ oc: 'Es … grand coma ieu.', fr: 'aussi grand', forma: '|tan:tan', sens: 'Es tan grand coma ieu.', indici: 'aussi : tan… coma' },
						{ oc: 'Es … aimable coma tu.', fr: 'aussi aimable', forma: '|tant:tan', sens: 'Es tant aimable coma tu.', indici: 'devant une voyelle : tant' },
						{ oc: 'Aqueste vin es … .', fr: 'meilleur', forma: '|melhor:mai', sens: 'Aqueste vin es melhor.', indici: 'mai bon : un seul mot' },
						{ oc: 'Es … polida.', fr: 'très jolie', forma: '|plan:tan', sens: 'Es plan polida.', indici: 'très : plan' }
					],
					mescla: ['plan', 'mens', 'tant', 'mai', 'melhor', 'tan'],
					bravo: 'Six sur six. Difficile de faire melhor.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**mai** … **que**, **mens** … **que**, **tan** (ou *tant*) … **coma**. **lo mai**, **la mens** ; **plan**, **fòrça** pour « très ». **melhor**, **pièger**, **mendre**.'
				},
				{ type: 'seguida', text: 'Voir aussi : [les adverbes](/apren/gramatica/adverbis), où tu as rencontré *plan*.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 38 et 39.'
		},
		{ de: 'Les mots', text: 'vérifiés avec lo Congrès.' }
	]
};
