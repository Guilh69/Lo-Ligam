// Le passé composé et les temps composés (pour aller plus loin). Participes
// conjugués avec vèrb'Òc (lengadocian). Règle : Gramatica, pages 82 et 83 ;
// participes irréguliers pages 94 à 98. Occitan à relire par Romain.
export default {
	id: 'tempses-compausats',
	capitol: 'tempses-compausats',
	titol: 'Los tempses compausats',
	fr: 'Le passé composé et les temps composés',
	resumit: 'Aver ou èsser, puis le participe : ai manjat, soi anat, soi estat.',
	validada: false,
	colors: { aver: 'oliva', esser: 'pruna', part: 'blau' },
	ecrans: [
		{
			titol: 'Ai manjat, soi anat',
			blocs: [
				{
					type: 'intro',
					text: 'Le **passé composé** se fait en deux pièces : **aver** ou **èsser** au présent, puis le **participe passé**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Avec aver : la plupart des verbes',
							frasas: [
								{ oc: '**Ai manjat** de pan.', fr: 'j’ai mangé du pain' },
								{ oc: '**Avèm parlat** occitan.', fr: 'nous avons parlé occitan' },
								{ oc: '**As vist** lo can ?', fr: 'tu as vu le chien ?' }
							]
						},
						{
							titol: 'Avec èsser : aller, venir, sortir, se lever…',
							frasas: [
								{ oc: '**Soi anat** al mercat.', fr: 'je suis allé au marché' },
								{ oc: '**Es venguda** amb sa sòrre.', fr: 'elle est venue avec sa sœur' },
								{ oc: '**Me soi levat** d’ora.', fr: 'je me suis levé tôt' }
							]
						}
					]
				},
				{ type: 'nota', text: '*èsser* se conjugue avec lui-même : *soi estat*, j’ai été.' },
				{ type: 'font', pages: 'page 82' }
			]
		},
		{
			titol: 'Lo participi',
			blocs: [
				{
					type: 'intro',
					text: 'Le participe passé se reconnaît à sa fin : **-at**, **-it**, **-ut**.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'cant|at:part', fr: 'chanté (cantar)' },
						{ mot: 'fin|it:part', fr: 'fini (finir)' },
						{ mot: 'vend|ut:part', fr: 'vendu (vendre)' },
						{ mot: 'beg|ut:part', fr: 'bu (beure)' }
					],
					noms: [
						{ oc: 'lo radical', fr: 'le début du verbe' },
						{ oc: 'la fin', fr: '-at, -it, -ut' }
					]
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'far, dire', gros: 'fach dich', color: 'part', exemples: [['fach', 'fait'], ['dich', 'dit']] },
						{ titol: 'prene, veire', gros: 'pres vist', color: 'part', exemples: [['pres', 'pris'], ['vist', 'vu']] },
						{ titol: 'èsser, aver', gros: 'estat agut', color: 'part', exemples: [['estat', 'été'], ['agut', 'eu']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte : quelques participes à part.' },
				{ type: 'font', pages: 'pages 82 et 94 à 98' }
			]
		},
		{
			titol: 'L’acòrd del participi',
			blocs: [
				{
					type: 'intro',
					text: 'Avec **èsser**, le participe s’accorde avec le sujet. Avec **aver**, il reste en général tel quel.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Avec èsser : il s’accorde',
							frasas: [
								{ oc: 'Maria es **venguda**.', fr: 'Marie est venue' },
								{ oc: 'Los amics son **venguts**.', fr: 'les amis sont venus' }
							]
						},
						{
							titol: 'Avec aver : il ne bouge pas',
							frasas: [
								{ oc: 'Maria a **manjat**.', fr: 'Marie a mangé' },
								{ oc: 'Los amics an **cantat**.', fr: 'les amis ont chanté' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Avec *aver*, il s’accorde quand même si l’objet est placé avant : *La poma ? L’ai manjada.*' },
				{ type: 'font', pages: 'page 83' }
			]
		},
		{
			titol: 'Los autres tempses compausats',
			blocs: [
				{
					type: 'intro',
					text: 'Même mécanique pour les autres temps : seul le temps de **aver** ou **èsser** change.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'avant un moment passé', gros: 'aviái', color: 'aver', exemples: [['aviái manjat', 'j’avais mangé'], ['èri partit', 'j’étais parti']] },
						{ titol: 'avant un moment à venir', gros: 'aurai', color: 'esser', exemples: [['aurai acabat', 'j’aurai fini'], ['serai arribat', 'je serai arrivé']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{ type: 'font', pages: 'page 82' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque passé composé en face de sa phrase. Aver ou èsser ? L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu, manjar', fr: 'j’ai mangé', forma: 'ai manj|at:aver', sens: 'ai manjat', indici: 'aver, puis le participe en -at' },
						{ oc: 'nosautres, parlar', fr: 'nous avons parlé', forma: 'avèm parl|at:aver', sens: 'avèm parlat', indici: 'aver au présent : avèm' },
						{ oc: 'tu, veire', fr: 'tu as vu', forma: 'as |vist:part', sens: 'as vist', indici: 'veire a un participe à part : vist' },
						{ oc: 'Pèire, anar', fr: 'Pierre est allé', forma: 'es an|at:esser', sens: 'es anat', indici: 'anar se conjugue avec èsser' },
						{ oc: 'Maria, venir', fr: 'Marie est venue', forma: 'es vengu|da:esser', sens: 'es venguda', indici: 'avec èsser, le participe s’accorde' },
						{ oc: 'el, èsser', fr: 'il a été', forma: 'es est|at:esser', sens: 'es estat', indici: 'èsser se conjugue avec lui-même' }
					],
					mescla: ['es estat', 'avèm parlat', 'es venguda', 'ai manjat', 'es anat', 'as vist'],
					bravo: 'Six sur six. Tu sais dire ce que tu as fait.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**aver** ou **èsser** au présent, puis le **participe** : *ai manjat*, *soi anat*. **èsser** pour aller, venir, sortir, les verbes en *se* et *èsser* lui-même : *soi estat*. Avec *èsser*, le participe s’accorde.'
				},
				{ type: 'seguida', text: 'Voir aussi : [les accords](/apren/gramatica/acords) et [le passé simple](/apren/gramatica/preterit).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 82, 83 et 94 à 98.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
