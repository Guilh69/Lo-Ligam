// L'article défini (unité 3, puis 4, 5, 7). Mots repris du parcours
// (modules 3.2, 3.3, 5.4, 7.1). Règle : Gramatica, pages 23 et 24.
// Occitan à relire par Romain.
export default {
	id: 'article-definit',
	capitol: 'article-definit',
	titol: 'L’article definit',
	fr: 'L’article défini',
	resumit: 'Lo, la, los, las ; l’ devant une voyelle ; al, del, als, dels.',
	validada: false,
	colors: { m: 'blau', f: 'pruna', c: 'oliva' },
	ecrans: [
		{
			titol: 'Lo, la, los, las',
			blocs: [
				{
					type: 'intro',
					text: 'L’**article défini** se met devant un nom qu’on connaît déjà. Il dit son genre et son nombre.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'masculin', gros: 'lo', color: 'm', exemples: [['lo paire', 'le père'], ['lo can', 'le chien'], ['lo jardin', 'le jardin']] },
						{ titol: 'féminin', gros: 'la', color: 'f', exemples: [['la maire', 'la mère'], ['la plaça', 'la place'], ['la familha', 'la famille']] },
						{ titol: 'masculin pluriel', gros: 'los', color: 'm', exemples: [['los fraires', 'les frères'], ['los dròlles', 'les enfants']] },
						{ titol: 'féminin pluriel', gros: 'las', color: 'f', exemples: [['las sòrres', 'les sœurs'], ['las pomas', 'les pommes']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{ type: 'nota', text: '*lo* se dit « lou », *los* « lous » : le *o* sans accent sonne « ou ».' },
				{ type: 'font', pages: 'page 23' }
			]
		},
		{
			titol: 'L’ davant una vocala',
			blocs: [
				{
					type: 'intro',
					text: 'Devant une voyelle, **lo** et **la** perdent leur voyelle : on écrit **l’**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'lo › l’',
							frasas: [
								{ oc: '**l’**ostal', fr: 'la maison (masculin en occitan)' },
								{ oc: '**l’**apartament', fr: 'l’appartement' }
							]
						},
						{
							titol: 'la › l’',
							frasas: [
								{ oc: '**l’**amiga', fr: 'l’amie' },
								{ oc: '**l’**addicion', fr: 'l’addition' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Au pluriel, rien ne tombe : *los ostals*, *las amigas*.' },
				{ type: 'font', pages: 'page 23' }
			]
		},
		{
			titol: 'Al, del, als, dels',
			blocs: [
				{
					type: 'intro',
					text: 'Après *a* et *de*, l’article masculin se soude : **al**, **als**, **del**, **dels**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'a + lo, a + los',
							frasas: [
								{ oc: 'Vau **al** trabalh.', fr: 'je vais au travail' },
								{ oc: 'Parla **als** dròlles.', fr: 'il ou elle parle aux enfants' }
							]
						},
						{
							titol: 'de + lo, de + los',
							frasas: [
								{ oc: 'lo jardin **del** vilatge', fr: 'le jardin du village' },
								{ oc: 'l’ostal **dels** amics', fr: 'la maison des amis' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Avec *la* et *las*, rien ne se soude : *a la plaça*, *de las sòrres*. Avec *per*, tu entendras aussi *pel*, *pels*.'
				},
				{ type: 'font', pages: 'page 23' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque article devant son nom. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Articles à placer',
					linhas: [
						{ oc: '… paire', fr: 'le père', forma: '|lo:m', sens: 'lo paire', indici: 'un homme, un seul : lo' },
						{ oc: '… maire', fr: 'la mère', forma: '|la:f', sens: 'la maire', indici: 'une femme, une seule : la' },
						{ oc: '… fraires', fr: 'les frères', forma: '|los:m', sens: 'los fraires', indici: 'masculin pluriel : los' },
						{ oc: '… sòrres', fr: 'les sœurs', forma: '|las:f', sens: 'las sòrres', indici: 'féminin pluriel : las' },
						{ oc: '… ostal', fr: 'la maison', forma: '|l’:m', sens: 'l’ostal', indici: 'devant une voyelle, l’article perd la sienne' },
						{ oc: 'lo jardin … vilatge', fr: 'le jardin du village', forma: '|del:c', sens: 'lo jardin del vilatge', indici: 'de + lo se soudent' }
					],
					mescla: ['las', 'del', 'lo', 'l’', 'los', 'la'],
					bravo: 'Six sur six. L’article n’a plus de secret pour toi.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**lo**, **la**, **los**, **las** ; **l’** devant une voyelle ; **al**, **als**, **del**, **dels** après *a* et *de*.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 3.2 te fait présenter ta famille](/aprene/modul/3-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 23 et 24.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, unités 1 à 7.' }
	]
};
