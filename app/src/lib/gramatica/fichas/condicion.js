// Exprimer une condition (pour aller plus loin). Formes conjuguées avec
// vèrb'Òc (lengadocian). Règle : Gramatica, page 81. Exemples écrits pour la
// fiche. Occitan à relire par Romain.
export default {
	id: 'condicion',
	capitol: 'condicion',
	titol: 'La condicion',
	fr: 'Exprimer une condition',
	resumit: 'Se plòu, demòri ; s’aviái de temps, legiriái. Et a condicion que, suivi du subjonctif.',
	validada: true,
	colors: { real: 'oliva', irreal: 'pruna', subj: 'blau' },
	ecrans: [
		{
			titol: 'Se plòu…',
			blocs: [
				{
					type: 'intro',
					text: 'Pour poser une condition : **se** (si). Devant une voyelle, il devient **s’**. Le temps du verbe dit si la chose peut vraiment arriver.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Ça peut arriver : se + présent',
							frasas: [
								{ oc: '**Se plòu**, demòri a l’ostal.', fr: 's’il pleut, je reste à la maison' },
								{ oc: '**S’as** fam, i a de pan.', fr: 'si tu as faim, il y a du pain' },
								{ oc: '**Se fa** bèl, **anarem** a la mar.', fr: 's’il fait beau, nous irons à la mer' }
							]
						},
						{
							titol: 'On l’imagine : se + imparfait',
							frasas: [
								{ oc: '**S’aviái** de temps, **legiriái** mai.', fr: 'si j’avais le temps, je lirais plus' },
								{ oc: '**Se podiái**, **partiriái**.', fr: 'si je pouvais, je partirais' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Juste après *se*, jamais de conditionnel : il va dans l’autre moitié de la phrase.' },
				{ type: 'font', pages: 'page 81' }
			]
		},
		{
			titol: 'A condicion que',
			blocs: [
				{
					type: 'intro',
					text: 'D’autres mots posent une condition. Après eux, le verbe passe au **subjonctif**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'à condition que',
							frasas: [{ oc: 'Anarem a la mar, **a condicion que faga** bèl.', fr: 'nous irons à la mer, à condition qu’il fasse beau' }]
						},
						{
							titol: 'pourvu que',
							frasas: [{ oc: '**Baste que vengas** !', fr: 'pourvu que tu viennes !' }]
						}
					]
				},
				{ type: 'nota', text: '*faga*, *vengas* : ce sont des formes du [subjonctif](/apren/gramatica/subjonctiu).' },
				{ type: 'font', pages: 'page 81' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Complète chaque phrase. Possible ou imaginé ? L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'Se … , demòri a l’ostal. (plòure)', fr: 's’il pleut', forma: '|plòu:real', sens: 'Se plòu, demòri a l’ostal.', indici: 'possible : présent' },
						{ oc: 'S’… fam, i a de pan. (aver, tu)', fr: 'si tu as faim', forma: '|as:real', sens: 'S’as fam, i a de pan.', indici: 'possible : présent' },
						{ oc: '… a la mar, se fa bèl. (anar, nosautres)', fr: 'nous irons', forma: '|anarem:real', sens: 'Anarem a la mar, se fa bèl.', indici: 'la suite d’une condition possible : futur' },
						{ oc: 'S’… de temps, legiriái mai. (aver, ieu)', fr: 'si j’avais le temps', forma: '|aviái:irreal', sens: 'S’aviái de temps, legiriái mai.', indici: 'imaginé : imparfait après se' },
						{ oc: 'S’aviái de temps, … mai. (legir, ieu)', fr: 'je lirais', forma: '|legiriái:irreal', sens: 'S’aviái de temps, legiriái mai.', indici: 'la suite : conditionnel' },
						{ oc: 'Anarem a la mar, a condicion que … bèl. (far)', fr: 'qu’il fasse beau', forma: '|faga:subj', sens: 'Anarem a la mar, a condicion que faga bèl.', indici: 'a condicion que, puis le subjonctif' }
					],
					mescla: ['aviái', 'faga', 'plòu', 'legiriái', 'as', 'anarem'],
					bravo: 'Six sur six. Si tu continues, tu parleras occitan.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Possible : **se + présent**, puis présent ou futur. Imaginé : **se + imparfait**, puis conditionnel. Après **a condicion que**, **baste que** : le subjonctif.'
				},
				{ type: 'seguida', text: 'Voir aussi : [le conditionnel de politesse](/apren/gramatica/condicional) et [le subjonctif](/apren/gramatica/subjonctiu).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 81.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
