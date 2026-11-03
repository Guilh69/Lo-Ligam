// La négation (unité 2, puis A2). Phrases reprises du parcours (modules
// 2.2, 2.3, 3.2, 7.1) ; « non… pas » enseigné dès l'A1 (cahier §11,
// 2026-11-02). Règle : Gramatica, page 56. Occitan à relire par Romain.
export default {
	id: 'negacion',
	capitol: 'negacion',
	titol: 'La negacion',
	fr: 'La négation',
	resumit: 'Non devant le verbe, pas après ; et les autres mots qui disent non.',
	validada: false,
	colors: { non: 'pruna', pas: 'oliva', autre: 'blau' },
	ecrans: [
		{
			titol: 'Dire non',
			blocs: [
				{
					type: 'intro',
					text: 'Pour dire non, on met **non** devant le verbe et **pas** juste après.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Oui',
							frasas: [
								{ oc: 'Parla italian.', fr: 'il ou elle parle italien' },
								{ oc: 'Ai un can.', fr: 'j’ai un chien' },
								{ oc: 'I a un jardin.', fr: 'il y a un jardin' }
							]
						},
						{
							titol: 'Non',
							frasas: [
								{ oc: '**Non** parla **pas** italian.', fr: 'il ou elle ne parle pas italien' },
								{ oc: '**Non** ai **pas** de can.', fr: 'je n’ai pas de chien' },
								{ oc: '**Non** i a **pas** de jardin.', fr: 'il n’y a pas de jardin' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Après *non… pas*, *un* et *una* deviennent *de* : *Ai un can*, *Non ai pas de can*.'
				},
				{ type: 'font', pages: 'page 56' }
			]
		},
		{
			titol: 'Tres faiçons',
			blocs: [
				{
					type: 'intro',
					text: 'Le vrai mot de la négation, c’est **non**. *Pas* la renforce. À l’oral, c’est parfois *non* qui tombe.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'soigné', gros: 'non', color: 'non', exemples: [['Non sabi.', 'je ne sais pas']] },
						{ titol: 'courant, celui du parcours', gros: 'non… pas', color: 'pas', exemples: [['Non sabi pas.', 'je ne sais pas'], ['Non parla pas anglés.', 'il ou elle ne parle pas anglais']] },
						{ titol: 'familier', gros: 'pas', color: 'autre', exemples: [['Sabi pas.', 'je sais pas']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{ type: 'font', pages: 'page 56' }
			]
		},
		{
			titol: 'Pas mai, jamai, res',
			blocs: [
				{
					type: 'intro',
					text: 'D’autres mots disent non avec plus de précision. Ils prennent la place de *pas*.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le temps',
							frasas: [
								{ oc: 'Non trabalhi **pas mai**.', fr: 'je ne travaille plus' },
								{ oc: 'Non canta **jamai**.', fr: 'il ou elle ne chante jamais' }
							]
						},
						{
							titol: 'Les choses, les gens',
							frasas: [
								{ oc: 'Non i a **res**.', fr: 'il n’y a rien' },
								{ oc: 'Non coneissi **degun**.', fr: 'je ne connais personne' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Avec *jamai*, *res* et *degun*, on ne met pas *pas*. Tu les retrouveras plus loin dans le parcours.' },
				{ type: 'font', pages: 'page 56' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: 'Non parla … italian.', fr: 'il ne parle pas italien', forma: '|pas:pas', sens: 'Non parla pas italian.', indici: 'ne… pas : non… pas' },
						{ oc: '… sabi pas.', fr: 'je ne sais pas', forma: '|Non:non', sens: 'Non sabi pas.', indici: 'non vient devant le verbe' },
						{ oc: 'Non trabalhi … .', fr: 'je ne travaille plus', forma: '|pas mai:autre', sens: 'Non trabalhi pas mai.', indici: 'ne… plus : non… pas mai' },
						{ oc: 'Non canta … .', fr: 'il ne chante jamais', forma: '|jamai:autre', sens: 'Non canta jamai.', indici: 'jamais : jamai' },
						{ oc: 'Non i a … .', fr: 'il n’y a rien', forma: '|res:autre', sens: 'Non i a res.', indici: 'rien : res' },
						{ oc: 'Non coneissi … .', fr: 'je ne connais personne', forma: '|degun:autre', sens: 'Non coneissi degun.', indici: 'personne : degun' }
					],
					mescla: ['res', 'Non', 'jamai', 'pas', 'degun', 'pas mai'],
					bravo: 'Six sur six. Tu sais dire non de six façons.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Non** devant le verbe, **pas** après : *Non parli pas anglés*. Avec *pas mai*, *jamai*, *res*, *degun*, la phrase dit plus précisément non.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 2.2 te fait dire ce que tu ne parles pas](/aprene/modul/2-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 56.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 2 à 7.' }
	]
};
