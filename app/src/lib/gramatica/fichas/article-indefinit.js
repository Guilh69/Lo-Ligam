// L'article indéfini et le partitif (unité 3, puis 5). Mots repris du
// parcours (modules 3.2, 3.3, 5.1, 7.1). Règle : Gramatica, pages 25 et 26.
// Occitan à relire par Romain.
export default {
	id: 'article-indefinit',
	capitol: 'article-indefinit',
	titol: 'L’article indefinit',
	fr: 'L’article indéfini',
	resumit: 'Un, una ; de pour « des », « du », « de la » ; d’ devant une voyelle.',
	validada: false,
	colors: { m: 'blau', f: 'pruna', de: 'oliva' },
	ecrans: [
		{
			titol: 'Un, una, de',
			blocs: [
				{
					type: 'intro',
					text: 'L’**article indéfini** présente une chose qu’on ne connaît pas encore : **un**, **una**. Au pluriel, il devient **de**.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'masculin', gros: 'un', color: 'm', exemples: [['un can', 'un chien'], ['un cafè', 'un café'], ['un ostal', 'une maison']] },
						{ titol: 'féminin', gros: 'una', color: 'f', exemples: [['una cata', 'une chatte'], ['una taula', 'une table'], ['una cadièra', 'une chaise']] },
						{ titol: 'pluriel', gros: 'de', color: 'de', exemples: [['de pomas', 'des pommes'], ['de fraires', 'des frères'], ['d’olivas', 'des olives']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{ type: 'nota', text: 'Devant une voyelle, *de* devient *d’* : *d’olivas*, *d’amics*.' },
				{ type: 'font', pages: 'page 25' }
			]
		},
		{
			titol: 'De : « des » e « del »',
			blocs: [
				{
					type: 'intro',
					text: '**De** dit à la fois « des » (plusieurs) et « du, de la » (une quantité qu’on ne compte pas).'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'des',
							frasas: [
								{ oc: 'I a **de** pomas.', fr: 'il y a des pommes' },
								{ oc: 'As **de** fraires ?', fr: 'as-tu des frères ?' }
							]
						},
						{
							titol: 'du, de la',
							frasas: [
								{ oc: 'I a **de** rasim.', fr: 'il y a du raisin' },
								{ oc: 'Volriái **de** pan.', fr: 'je voudrais du pain' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Après *non… pas*, *un* et *una* deviennent aussi *de* : *Ai un can*, *Non ai pas de can*.'
				},
				{ type: 'font', pages: 'pages 25 et 26' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque groupe en face de sa traduction. Attention au genre : il n’est pas toujours celui du français. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Groupes à placer',
					linhas: [
						{ oc: 'can', fr: 'un chien', forma: 'un can|:m', sens: 'un can', indici: 'masculin : un' },
						{ oc: 'cata', fr: 'une chatte', forma: 'una cata|:f', sens: 'una cata', indici: 'féminin : una' },
						{ oc: 'fraires', fr: 'des frères', forma: 'de fraires|:de', sens: 'de fraires', indici: 'des : de' },
						{ oc: 'olivas', fr: 'des olives', forma: 'd’olivas|:de', sens: 'd’olivas', indici: 'de devant une voyelle' },
						{ oc: 'ostal', fr: 'une maison', forma: 'un ostal|:m', sens: 'un ostal', indici: 'ostal est masculin en occitan' },
						{ oc: 'ora', fr: 'une heure', forma: 'una ora|:f', sens: 'una ora', indici: 'ora est féminin' }
					],
					mescla: ['un ostal', 'd’olivas', 'una cata', 'un can', 'una ora', 'de fraires'],
					bravo: 'Six sur six. Même l’ostal masculin ne t’a pas piégé.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**un** (masculin), **una** (féminin), **de** pour « des », « du », « de la », et **d’** devant une voyelle.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 3.3 te fait parler de ton animal](/aprene/modul/3-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 25 et 26.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, unités 3 à 7.' }
	]
};
