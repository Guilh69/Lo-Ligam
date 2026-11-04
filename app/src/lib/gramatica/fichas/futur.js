// Le futur (pour aller plus loin). Formes conjuguées avec vèrb'Òc
// (lengadocian) : anarai et volrai, pas « anirai » ni « voldrai ». Règle :
// Gramatica, pages 71 et 72. Occitan à relire par Romain.
export default {
	id: 'futur',
	capitol: 'futur',
	titol: 'Lo futur',
	fr: 'Le futur',
	resumit: 'L’infinitif entier, plus ai, às, à, em, etz, àn : cantarai, partiràn. Et ce qui est sans doute vrai : seràn tres oras.',
	validada: false,
	colors: { fut: 'oliva', irr: 'pruna' },
	ecrans: [
		{
			titol: 'Deman, cantarai',
			blocs: [
				{
					type: 'intro',
					text: 'Le **futur** se construit comme un jeu de cubes : **l’infinitif entier**, puis une terminaison qui ressemble au présent de *aver*.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'cantar|ai:fut', fr: 'je chanterai' },
						{ mot: 'parlar|às:fut', fr: 'tu parleras' },
						{ mot: 'anar|em:fut', fr: 'nous irons' },
						{ mot: 'finir|àn:fut', fr: 'ils, elles finiront' }
					],
					noms: [
						{ oc: 'l’infinitiu', fr: 'le verbe entier' },
						{ oc: 'la terminason', fr: 'comme aver : ai, as, a…' }
					]
				},
				{ type: 'nota', text: 'Les verbes en *-e* perdent leur *-e* : *escriure*, *escriurai* ; *beure*, *beurai*.' },
				{ type: 'font', pages: 'page 71' }
			]
		},
		{
			titol: 'Las terminasons',
			blocs: [
				{
					type: 'intro',
					text: 'Six terminaisons, **les mêmes pour tous les verbes**.'
				},
				{
					type: 'marcas',
					linhas: [
						['ai', 'ieu', 'cantarai'],
						['às', 'tu', 'cantaràs'],
						['à', 'el, ela', 'cantarà'],
						['em', 'nosautres, nosautras', 'cantarem'],
						['etz', 'vosautres, vosautras', 'cantaretz'],
						['àn', 'eles, elas', 'cantaràn']
					]
				},
				{ type: 'nota', text: 'L’accent de *-às*, *-à*, *-àn* montre que la voix appuie sur la fin.' },
				{ type: 'font', pages: 'page 71' }
			]
		},
		{
			titol: 'Los irregulars',
			blocs: [
				{
					type: 'intro',
					text: 'Quelques verbes changent de **début**. Les terminaisons, elles, ne bougent pas.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'èsser, aver', gros: 'ser- aur-', color: 'irr', exemples: [['ser|ai', 'je serai'], ['aur|ai', 'j’aurai'], ['ser|àn', 'ils, elles seront']] },
						{ titol: 'poder, voler', gros: 'poir- volr-', color: 'irr', exemples: [['poir|ai', 'je pourrai'], ['volr|ai', 'je voudrai']] },
						{ titol: 'saber, venir', gros: 'saupr- vendr-', color: 'irr', exemples: [['saupr|ai', 'je saurai'], ['vendr|ai', 'je viendrai']] },
						{ titol: 'prene', gros: 'prendr-', color: 'irr', exemples: [['prendr|ai', 'je prendrai'], ['prendr|àn', 'ils, elles prendront']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les formes.' },
				{ type: 'nota', text: '*anar* et *far* restent réguliers : *anarai*, *farai*.' },
				{ type: 'font', pages: 'pages 94 à 98' }
			]
		},
		{
			titol: 'Quand l’emplegar',
			blocs: [
				{
					type: 'intro',
					text: 'Le futur dit **ce qui arrivera**. Il dit aussi **ce qui est sans doute vrai**, maintenant.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Ce qui arrivera',
							frasas: [
								{ oc: 'Deman, **anarem** a la mar.', fr: 'demain, nous irons à la mer' },
								{ oc: 'Lo tren **partirà** a uèch oras.', fr: 'le train partira à huit heures' }
							]
						},
						{
							titol: 'Ce qui est sans doute vrai',
							frasas: [
								{ oc: '**Seràn** tres oras.', fr: 'il doit être trois heures' },
								{ oc: 'Ont es Pèire ? **Serà** a l’ostal.', fr: 'il doit être à la maison' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Pour ce qui arrive tout de suite, *anar* et l’infinitif suffisent : *Vau manjar*, je vais manger.' },
				{ type: 'font', pages: 'page 72' }
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
						{ oc: 'ieu (cantar)', fr: 'je chanterai', forma: 'cantar|ai:fut', sens: 'cantarai', indici: 'l’infinitif, puis -ai' },
						{ oc: 'tu (parlar)', fr: 'tu parleras', forma: 'parlar|às:fut', sens: 'parlaràs', indici: 'l’infinitif, puis -às' },
						{ oc: 'nosautres (anar)', fr: 'nous irons', forma: 'anar|em:fut', sens: 'anarem', indici: 'anar reste régulier' },
						{ oc: 'eles (partir)', fr: 'ils partiront', forma: 'partir|àn:fut', sens: 'partiràn', indici: 'l’infinitif, puis -àn' },
						{ oc: 'ieu (èsser)', fr: 'je serai', forma: 'ser|ai:irr', sens: 'serai', indici: 'èsser commence par ser-' },
						{ oc: 'vosautres (poder)', fr: 'vous pourrez', forma: 'poir|etz:irr', sens: 'poiretz', indici: 'poder commence par poir-' }
					],
					mescla: ['partiràn', 'serai', 'cantarai', 'poiretz', 'anarem', 'parlaràs'],
					bravo: 'Six sur six. L’avenir te parle occitan.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Infinitif + ai, às, à, em, etz, àn**. Quelques débuts changent : *serai*, *aurai*, *poirai*, *volrai*, *sauprai*, *vendrai*, *prendrai*. Et le futur dit le probable : *Seràn tres oras*.'
				},
				{ type: 'seguida', text: 'Voir aussi : [le conditionnel de politesse](/apren/gramatica/condicional), qui part du même début : *volriái*.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 71, 72 et 94 à 98.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
