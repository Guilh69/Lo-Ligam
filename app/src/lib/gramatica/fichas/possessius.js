// Les possessifs (unité 3, puis A2). Mots repris du parcours (modules 3.2,
// 3.3, 3.4). Règle : Gramatica, pages 41 et 42. Occitan à relire par
// Romain.
export default {
	id: 'possessius',
	capitol: 'possessius',
	titol: 'Los possessius',
	fr: 'Les possessifs',
	resumit: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.',
	validada: true,
	colors: { ieu: 'pruna', tu: 'oliva', el: 'blau' },
	ecrans: [
		{
			titol: 'Mon, ton, son',
			blocs: [
				{
					type: 'intro',
					text: 'Le **possessif** dit à qui est la chose. Il s’accorde avec la chose, pas avec la personne.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'à moi', gros: 'mon ma', color: 'ieu', exemples: [['mon paire', 'mon père'], ['ma maire', 'ma mère'], ['mos fraires', 'mes frères'], ['mas sòrres', 'mes sœurs']] },
						{ titol: 'à toi', gros: 'ton ta', color: 'tu', exemples: [['ton can', 'ton chien'], ['ta familha', 'ta famille'], ['tos amics', 'tes amis'], ['tas amigas', 'tes amies']] },
						{ titol: 'à lui, à elle', gros: 'son sa', color: 'el', exemples: [['son fraire', 'son frère'], ['sa cata', 'sa chatte'], ['sos dròlles', 'ses enfants'], ['sas sòrres', 'ses sœurs']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les quatre formes.' },
				{
					type: 'nota',
					text: 'Devant une voyelle, *ma*, *ta*, *sa* deviennent *mon*, *ton*, *son* : *mon amiga*. Et *mas* (mes) s’écrit comme *mas* (mais) : le sens les sépare.'
				},
				{ type: 'font', pages: 'page 41' }
			]
		},
		{
			titol: 'Nòstre, vòstre, lor',
			blocs: [
				{
					type: 'intro',
					text: 'Quand la chose est à plusieurs personnes : **nòstre**, **vòstre**, **lor**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'à nous, à vous',
							frasas: [
								{ oc: '**nòstre** ostal', fr: 'notre maison' },
								{ oc: '**nòstra** mameta', fr: 'notre grand-mère' },
								{ oc: '**vòstra** familha', fr: 'votre famille' }
							]
						},
						{
							titol: 'à eux, à elles',
							frasas: [
								{ oc: '**lor** paire', fr: 'leur père' },
								{ oc: '**lor** maire', fr: 'leur mère' },
								{ oc: '**lors** amics', fr: 'leurs amis' }
							]
						}
					]
				},
				{ type: 'nota', text: '*Lor* ne change pas au féminin. Au pluriel : *nòstres*, *nòstras*, *vòstres*, *vòstras*, *lors*.' },
				{ type: 'font', pages: 'page 41' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque groupe en face de sa traduction. Regarde le genre et le nombre de la chose. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Groupes à placer',
					linhas: [
						{ oc: 'paire', fr: 'mon père', forma: 'mon paire|:ieu', sens: 'mon paire', indici: 'masculin singulier : mon' },
						{ oc: 'maire', fr: 'ma mère', forma: 'ma maire|:ieu', sens: 'ma maire', indici: 'féminin singulier : ma' },
						{ oc: 'fraires', fr: 'mes frères', forma: 'mos fraires|:ieu', sens: 'mos fraires', indici: 'masculin pluriel : mos' },
						{ oc: 'familha', fr: 'ta famille', forma: 'ta familha|:tu', sens: 'ta familha', indici: 'à toi, féminin : ta' },
						{ oc: 'amiga', fr: 'mon amie', forma: 'mon amiga|:ieu', sens: 'mon amiga', indici: 'devant une voyelle, ma devient mon' },
						{ oc: 'ostal', fr: 'notre maison', forma: 'nòstre ostal|:el', sens: 'nòstre ostal', indici: 'à nous, et ostal est masculin : nòstre' }
					],
					mescla: ['ta familha', 'nòstre ostal', 'mos fraires', 'mon paire', 'mon amiga', 'ma maire'],
					bravo: 'Six sur six. Tu peux présenter toute ta famille.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**mon, ma, mos, mas** ; **ton, ta, tos, tas** ; **son, sa, sos, sas** ; **nòstre, vòstre, lor**. Le possessif suit la chose : son genre, son nombre.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 3.2 te fait présenter ta famille](/aprene/modul/3-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 41 et 42.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, unité 3.' }
	]
};
