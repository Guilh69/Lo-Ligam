// L'imparfait (pour aller plus loin). Formes conjuguées avec vèrb'Òc
// (lengadocian). Règle : Gramatica, pages 70 et 71. Occitan à relire par
// Romain.
export default {
	id: 'imperfach',
	capitol: 'imperfach',
	titol: 'L’imperfach',
	fr: 'L’imparfait',
	resumit: 'Le passé qui dure : le décor, les habitudes. Cantavi, finissiái, èri.',
	validada: false,
	colors: { ar: 'pruna', autres: 'oliva', esser: 'blau' },
	ecrans: [
		{
			titol: 'Quand èri pichon',
			blocs: [
				{
					type: 'intro',
					text: 'L’**imparfait** raconte le passé **pendant qu’il se déroule** : le décor, l’état des choses, les habitudes.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une habitude',
							frasas: [
								{ oc: 'Se **levava** totjorn a sièis oras.', fr: 'il se levait toujours à six heures' },
								{ oc: 'Lo dimenge, **anàvem** al mercat.', fr: 'le dimanche, nous allions au marché' }
							]
						},
						{
							titol: 'Un décor, un état',
							frasas: [
								{ oc: '**Fasiá** caud.', fr: 'il faisait chaud' },
								{ oc: 'Quand **èri** pichon, **demoravi** a Tolosa.', fr: 'quand j’étais petit, j’habitais à Toulouse' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 71' }
			]
		},
		{
			titol: 'Los vèrbes en -ar',
			blocs: [
				{
					type: 'intro',
					text: 'Les verbes en **-ar** prennent **-av-** : *cantavi*, je chantais.'
				},
				{
					type: 'marcas',
					linhas: [
						['avi', 'ieu', 'cantavi'],
						['avas', 'tu', 'cantavas'],
						['ava', 'el, ela', 'cantava'],
						['àvem', 'nosautres, nosautras', 'cantàvem'],
						['àvetz', 'vosautres, vosautras', 'cantàvetz'],
						['avan', 'eles, elas', 'cantavan']
					]
				},
				{ type: 'nota', text: 'Avec *nosautres* et *vosautres*, la voix remonte, et l’accent écrit le montre : *cantàvem*, *cantàvetz*.' },
				{ type: 'font', pages: 'page 70' }
			]
		},
		{
			titol: 'Los autres vèrbes',
			blocs: [
				{
					type: 'intro',
					text: 'Les autres verbes prennent **-iái**, **-iás**, **-iá**… Et *èsser* fait à sa façon.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'finir', gros: '-iái', color: 'autres', exemples: [['finiss|iái', 'je finissais'], ['finiss|iás', 'tu finissais'], ['finiss|iam', 'nous finissions']] },
						{ titol: 'aver, prene', gros: '-iá', color: 'autres', exemples: [['av|iái', 'j’avais'], ['av|iá', 'il, elle avait'], ['pren|ián', 'ils, elles prenaient']] },
						{ titol: 'far', gros: 'fasiá', color: 'autres', exemples: [['fas|iái', 'je faisais'], ['fas|iá', 'il, elle faisait']] },
						{ titol: 'èsser', gros: 'èri', color: 'esser', exemples: [['èri', 'j’étais'], ['èras', 'tu étais'], ['èra', 'il, elle était'], ['èrem', 'nous étions']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les formes.' },
				{ type: 'font', pages: 'page 70' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu (parlar)', fr: 'je parlais', forma: 'parl|avi:ar', sens: 'parlavi', indici: 'verbe en -ar, ieu : -avi' },
						{ oc: 'nosautres (anar)', fr: 'nous allions', forma: 'an|àvem:ar', sens: 'anàvem', indici: 'verbe en -ar, nosautres : -àvem' },
						{ oc: 'el (far)', fr: 'il faisait', forma: 'fas|iá:autres', sens: 'fasiá', indici: 'far : fas-, puis -iá' },
						{ oc: 'ieu (aver)', fr: 'j’avais', forma: 'av|iái:autres', sens: 'aviái', indici: 'aver : av-, puis -iái' },
						{ oc: 'tu (finir)', fr: 'tu finissais', forma: 'finiss|iás:autres', sens: 'finissiás', indici: 'finir : finiss-, puis -iás' },
						{ oc: 'ieu (èsser)', fr: 'j’étais', forma: '|èri:esser', sens: 'èri', indici: 'èsser fait à sa façon' }
					],
					mescla: ['aviái', 'èri', 'parlavi', 'finissiás', 'anàvem', 'fasiá'],
					bravo: 'Six sur six. Tu sais planter le décor.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**-ar** : *-avi, -avas, -ava, -àvem, -àvetz, -avan*. **Les autres** : *-iái, -iás, -iá, -iam, -iatz, -ián*. **èsser** : *èri, èras, èra, èrem, èretz, èran*.'
				},
				{ type: 'seguida', text: 'Voir aussi : [le passé simple](/apren/gramatica/preterit), qui raconte ce qui arrive dans ce décor.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 70 et 71.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
