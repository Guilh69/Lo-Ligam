// Les adverbes (unité 1, puis tout l'A1). Phrases reprises du parcours
// (modules 1.1, 2.4, 5.x, 6.x). Règle : Gramatica, page 57. Occitan à
// relire par Romain.
export default {
	id: 'adverbis',
	capitol: 'adverbis',
	titol: 'Los advèrbis',
	fr: 'Les adverbes',
	resumit: 'Comment, où, quand : les mots qui précisent le verbe, et ceux en -ment.',
	validada: true,
	colors: { cossi: 'pruna', ont: 'oliva', quand: 'blau', ment: 'oliva' },
	ecrans: [
		{
			titol: 'Los advèrbis',
			blocs: [
				{
					type: 'intro',
					text: 'Un **adverbe** précise le verbe : il dit comment, où, quand. Il ne change jamais de forme.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'comment ?', gros: 'plan', color: 'cossi', exemples: [['Va plan.', 'ça va bien'], ['Compreni plan.', 'je comprends bien'], ['Compreni un pauc.', 'je comprends un peu']] },
						{ titol: 'où ?', gros: 'aquí', color: 'ont', exemples: [['Es aquí, darrièr vos !', 'c’est ici, derrière vous !'], ['La gara es prèp.', 'la gare est près'], ['Es un pauc luènh.', 'c’est un peu loin']] },
						{ titol: 'quand ?', gros: 'uèi', color: 'quand', exemples: [['Fa caud, uèi !', 'il fait chaud aujourd’hui !'], ['A deman !', 'à demain !'], ['Trabalhi totjorn.', 'je travaille toujours']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des phrases du parcours.' },
				{ type: 'font', pages: 'page 57' }
			]
		},
		{
			titol: 'Ont se plaçan ?',
			blocs: [
				{
					type: 'intro',
					text: 'L’adverbe qui dit **comment** suit le verbe. Celui qui dit **quand** se met souvent en tête ou en fin de phrase.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Après le verbe',
							frasas: [
								{ oc: 'Compreni **plan**.', fr: 'je comprends bien' },
								{ oc: 'Parla **tanben** un pauc occitan.', fr: 'il ou elle parle aussi un peu occitan' }
							]
						},
						{
							titol: 'En tête ou en fin',
							frasas: [
								{ oc: '**Uèi**, fa caud.', fr: 'aujourd’hui, il fait chaud' },
								{ oc: 'Fa caud, **uèi** !', fr: 'il fait chaud, aujourd’hui !' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 57' }
			]
		},
		{
			titol: 'Los advèrbis en -ment',
			blocs: [
				{
					type: 'intro',
					text: 'Beaucoup d’adverbes se forment sur l’adjectif **au féminin**, plus la fin **-ment**, comme en français.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'lenta|ment', fr: 'lentement' },
						{ mot: 'segura|ment', fr: 'sûrement' },
						{ mot: 'sola|ment', fr: 'seulement' }
					],
					noms: [
						{ oc: 'l’adjectiu al femenin', fr: 'l’adjectif au féminin' },
						{ oc: 'la fin -ment', fr: 'la fin -ment' }
					]
				},
				{ type: 'nota', text: 'Tu verras ces adverbes plus loin dans le parcours. Pour l’instant, retiens seulement d’où vient le *a* : *lent*, *lenta*, *lentament*.' },
				{ type: 'font', pages: 'page 57' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque adverbe dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Adverbes à placer',
					linhas: [
						{ oc: 'Compreni … .', fr: 'je comprends bien', forma: '|plan:cossi', sens: 'Compreni plan.', indici: 'comment ? bien' },
						{ oc: 'Fa caud, … !', fr: 'il fait chaud aujourd’hui !', forma: '|uèi:quand', sens: 'Fa caud, uèi !', indici: 'quand ? aujourd’hui' },
						{ oc: 'Es … , darrièr vos.', fr: 'c’est ici, derrière vous', forma: '|aquí:ont', sens: 'Es aquí, darrièr vos.', indici: 'où ? ici' },
						{ oc: 'A … !', fr: 'à demain !', forma: '|deman:quand', sens: 'A deman !', indici: 'quand ? demain' },
						{ oc: 'Parla … occitan.', fr: 'il parle aussi occitan', forma: '|tanben:cossi', sens: 'Parla tanben occitan.', indici: 'aussi' },
						{ oc: 'Lo tantòst, trabalhi … .', fr: 'l’après-midi, je travaille toujours', forma: '|totjorn:quand', sens: 'Lo tantòst, trabalhi totjorn.', indici: 'quand ? toujours' }
					],
					mescla: ['totjorn', 'aquí', 'plan', 'deman', 'uèi', 'tanben'],
					bravo: 'Six sur six. Avec ces petits mots, tes phrases prennent du relief.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Un adverbe ne change pas. **Comment** : *plan*, *un pauc*. **Où** : *aquí*, *prèp*, *luènh*. **Quand** : *uèi*, *deman*, *totjorn*. Et d’autres se forment avec **-ment**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [dès le module 1.1, tu dis *Va plan*](/aprene/modul/1-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 57.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 1 à 6.' }
	]
};
