// Les nombres (unités 3, 5 et 8). Formes du parcours (modules 3.1, 5.2,
// 8.2) : uèch, setanta, ochanta, trenta un, choix de Romain (2026-11-02).
// Règle : Gramatica, pages 54 et 55. Occitan à relire par Romain.
export default {
	id: 'nombres',
	capitol: 'nombres',
	titol: 'Los nombres',
	fr: 'Les nombres',
	resumit: 'Compter de zéro à cent, les dizaines, et dire « premier », « deuxième ».',
	validada: true,
	colors: { u: 'pruna', d: 'oliva', o: 'blau' },
	ecrans: [
		{
			titol: 'De zèro a vint',
			blocs: [
				{
					type: 'intro',
					text: 'Les **nombres** jusqu’à vingt s’apprennent par cœur. À partir de dix-sept, ils se construisent : *dètz-e-sèt*, « dix et sept ».'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'de 1 à 10', gros: '1-10', color: 'u', exemples: [['un, una', '1'], ['dos, doas', '2'], ['tres', '3'], ['quatre', '4'], ['cinc', '5'], ['sièis', '6'], ['sèt', '7'], ['uèch', '8'], ['nòu', '9'], ['dètz', '10']] },
						{ titol: 'de 11 à 16', gros: '11-16', color: 'd', exemples: [['onze', '11'], ['dotze', '12'], ['tretze', '13'], ['catòrze', '14'], ['quinze', '15'], ['setze', '16']] },
						{ titol: 'de 17 à 20', gros: '17-20', color: 'o', exemples: [['dètz-e-sèt', '17'], ['dètz-e-uèch', '18'], ['dètz-e-nòu', '19'], ['vint', '20']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour compter.' },
				{
					type: 'nota',
					text: '*Un* et *dos* ont un féminin : *una*, *doas*. *Joana parla doas lengas.*'
				},
				{ type: 'font', pages: 'page 54' }
			]
		},
		{
			titol: 'Las desenas',
			blocs: [
				{
					type: 'intro',
					text: 'Les **dizaines** ressemblent à leur chiffre : *tres*, *trenta*. Entre deux, on ajoute l’unité.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: '30, 40, 50',
							frasas: [
								{ oc: 'tres › **trenta**', fr: '3 › 30' },
								{ oc: 'quatre › **quaranta**', fr: '4 › 40' },
								{ oc: 'cinc › **cinquanta**', fr: '5 › 50' }
							]
						},
						{
							titol: '60, 70, 80, 90',
							frasas: [
								{ oc: 'sièis › **seissanta**', fr: '6 › 60' },
								{ oc: 'sèt › **setanta**', fr: '7 › 70' },
								{ oc: 'uèch › **ochanta**', fr: '8 › 80' },
								{ oc: 'nòu › **nonanta**', fr: '9 › 90' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Avec un *e* entre vingt et trente : *vint-e-un*, *vint-e-dos*. Ensuite, sans *e* : *trenta un*, *quaranta dos*. Puis *cent*, *dos cents*, *mila*.'
				},
				{ type: 'indic', text: 'Tu liras aussi *setenta* et *oitanta* : le parcours dit *setanta* et *ochanta*, comme en languedocien.' },
				{ type: 'font', pages: 'pages 54 et 55' }
			]
		},
		{
			titol: 'Primièr, segond',
			blocs: [
				{
					type: 'intro',
					text: 'Pour ranger dans l’ordre : **primièr**, **primièra** pour le premier, puis la fin **-en**, **-ena**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le premier, le deuxième',
							frasas: [
								{ oc: 'Pren la **primièra** carrièra.', fr: 'prends la première rue' },
								{ oc: 'Pren la **dosena** carrièra.', fr: 'prends la deuxième rue' }
							]
						},
						{
							titol: 'Ensuite',
							frasas: [
								{ oc: 'tres › **tresen**, **tresena**', fr: 'troisième' },
								{ oc: 'quatre › **quatren**, **quatrena**', fr: 'quatrième' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Quand il n’y en a que deux, on dit aussi *lo segond*, *la segonda*.' },
				{ type: 'font', pages: 'page 54' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque nombre en lettres en face de son chiffre. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Nombres à placer',
					linhas: [
						{ oc: '2', fr: 'deux langues', forma: 'doas|:u', sens: 'doas lengas', indici: 'lenga est féminin : doas' },
						{ oc: '8', fr: 'huit', forma: 'uèch|:u', sens: 'uèch', indici: 'entre sèt et nòu' },
						{ oc: '15', fr: 'quinze', forma: 'quinze|:d', sens: 'quinze', indici: 'il s’apprend par cœur, comme en français' },
						{ oc: '19', fr: 'dix-neuf', forma: 'dètz-e-nòu|:o', sens: 'dètz-e-nòu', indici: 'dix et neuf' },
						{ oc: '22', fr: 'vingt-deux', forma: 'vint-e-dos|:o', sens: 'vint-e-dos', indici: 'vingt et deux, avec un e' },
						{ oc: '70', fr: 'soixante-dix', forma: 'setanta|:d', sens: 'setanta', indici: 'sèt, setanta' }
					],
					mescla: ['vint-e-dos', 'quinze', 'setanta', 'doas', 'dètz-e-nòu', 'uèch'],
					bravo: 'Six sur six. Tu peux compter au marché.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Jusqu’à seize, par cœur. Puis **dètz-e-sèt**, **vint-e-un**, **trenta un**. Les dizaines suivent leur chiffre : *sèt*, *setanta*. Pour l’ordre : **primièr**, puis **-en**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 3.1 te fait compter et dire ton âge](/aprene/modul/3-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 54 et 55.'
		},
		{ de: 'Les formes *uèch*, *setanta*, *ochanta*', text: 'le languedocien du parcours, choix de Romain (2 novembre 2026).' }
	]
};
