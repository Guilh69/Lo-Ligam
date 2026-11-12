// Quand la voyelle change : demorar, demòri (unité 4, puis 6). Formes du
// parcours (modules 1.2, 1.3, 4.3, 6.3), conjuguées avec vèrb'Òc. Règle :
// Gramatica, page 87 (tableau des verbes à alternance). Occitan à relire
// par Romain.
export default {
	id: 'alternanca',
	capitol: 'alternanca',
	titol: 'La vocala que càmbia',
	fr: 'Quand la voyelle change',
	resumit: 'Demòri mais demoram, lèvi mais levam : la voyelle suit la syllabe forte.',
	validada: true,
	colors: { ton: 'pruna', fin: 'oliva' },
	ecrans: [
		{
			titol: 'Demòri, demoram',
			blocs: [
				{
					type: 'intro',
					text: 'Dans certains verbes, la voyelle du radical change : **o** devient **ò**, **e** devient **è**, quand la voix appuie dessus.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'La voix appuie sur le radical',
							frasas: [
								{ picto: 'ieu', oc: '[Demòr|i:ton] a Tolosa.', fr: 'j’habite à Toulouse : dé-MÒ-ri' },
								{ picto: 'ieu', oc: 'Me [lèv|i:ton] a sèt oras.', fr: 'je me lève à sept heures : LÈ-bi' }
							]
						},
						{
							titol: 'La voix appuie sur la fin',
							frasas: [
								{ picto: 'grops', oc: '[Demor|am:fin] aquí.', fr: 'nous habitons ici : dé-mou-RAN' },
								{ picto: 'grops', oc: 'Nos [lev|am:fin] a sèt oras.', fr: 'nous nous levons à sept heures : lé-BAN' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'L’accent grave marque la syllabe forte. Quand la voix part sur la fin du verbe, l’accent n’a plus rien à marquer : il disparaît, et le *o* sonne « ou ».'
				},
				{ type: 'font', pages: 'page 87' }
			]
		},
		{
			titol: 'Las sièis personas',
			blocs: [
				{
					type: 'intro',
					text: 'Regarde *demorar* (habiter) au présent : le **ò** revient à quatre personnes sur six.'
				},
				{
					type: 'marcas',
					linhas: [
						['i', 'ieu', 'demòri'],
						['as', 'tu', 'demòras'],
						['a', 'el, ela', 'demòra'],
						['am', 'nosautres, nosautras', 'demoram'],
						['atz', 'vosautres, vosautras', 'demoratz'],
						['an', 'eles, elas', 'demòran']
					]
				},
				{
					type: 'nota',
					text: '*-am* et *-atz* attirent la voix sur la fin : le radical redevient *demor-*, comme à l’infinitif *demorar*. Les autres fins laissent la voix sur le radical : *demòr-*.'
				},
				{ type: 'font', pages: 'page 87' }
			]
		},
		{
			titol: 'Autres vèrbs',
			blocs: [
				{
					type: 'intro',
					text: 'Le même jeu revient dans beaucoup de verbes. Le dictionnaire donne l’infinitif ; la forme *ieu* te montre la voyelle forte.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'o › ò', gros: 'o ò', color: 'ton', exemples: [['jogar : jògui, jogam', 'jouer'], ['portar : pòrti, portam', 'porter'], ['poder : pòdi, podèm', 'pouvoir']] },
						{ titol: 'e › è', gros: 'e è', color: 'fin', exemples: [['levar : lèvi, levam', 'lever'], ['apelar : apèli, apelam', 'appeler']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des verbes.' },
				{ type: 'font', pages: 'page 87' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne. Demande-toi où appuie la voix : sur le radical, ou sur la fin ? L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu (demorar)', fr: 'j’habite', forma: 'demòr|i:ton', sens: 'demòri', indici: 'la fin -i laisse la voix sur le radical : ò' },
						{ oc: 'nosautres (demorar)', fr: 'nous habitons', forma: 'demor|am:fin', sens: 'demoram', indici: 'la fin -am prend la voix : o' },
						{ oc: 'tu (jogar)', fr: 'tu joues', forma: 'jòg|as:ton', sens: 'jògas', indici: 'la fin -as laisse la voix sur le radical : ò' },
						{ oc: 'vosautres (jogar)', fr: 'vous jouez', forma: 'jog|atz:fin', sens: 'jogatz', indici: 'la fin -atz prend la voix : o' },
						{ oc: 'ela (se levar)', fr: 'elle se lève', forma: 'se lèv|a:ton', sens: 'se lèva', indici: 'la fin -a laisse la voix sur le radical : è' },
						{ oc: 'eles, elas (demorar)', fr: 'ils ou elles habitent', forma: 'demòr|an:ton', sens: 'demòran', indici: 'la fin -an laisse la voix sur le radical : ò' }
					],
					mescla: ['jogatz', 'demòran', 'demòri', 'se lèva', 'demoram', 'jògas'],
					bravo: 'Six sur six. La syllabe forte décide de l’accent : tu l’as vu.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Quand la voix appuie sur le radical (**ieu, tu, el, eles**), *o* devient **ò** et *e* devient **è**. Avec **-am** et **-atz**, la voyelle redevient celle de l’infinitif.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 4.3 fait jouer *jogar*](/aprene/modul/4-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 86 à 93.'
		},
		{ de: 'Les formes', text: 'le parcours de Lo Ligam, conjuguées avec vèrb’Òc (lo Congrès).' }
	]
};
