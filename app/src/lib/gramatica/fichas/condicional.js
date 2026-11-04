// Le conditionnel de politesse (unité 5, puis A2). Formes du parcours
// (modules 2.3, 5.1, 5.3 : volriái, pòdes repetir) et conjuguées avec
// vèrb'Òc. Règle : Gramatica, page 73. Occitan à relire par Romain.
export default {
	id: 'condicional',
	capitol: 'condicional',
	titol: 'Lo condicional',
	fr: 'Le conditionnel',
	resumit: 'Volriái, poiriás : demander poliment ; l’infinitif plus -iái, -iás, -iá.',
	validada: false,
	colors: { c: 'pruna', p: 'oliva' },
	ecrans: [
		{
			titol: 'Volriái…',
			blocs: [
				{
					type: 'intro',
					text: 'Pour demander **poliment**, on passe du présent au **conditionnel** : *vòli* (je veux) devient *volriái* (je voudrais).'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Je veux',
							frasas: [
								{ picto: 'ieu', oc: '**Vòli** d’olivas.', fr: 'je veux des olives' },
								{ oc: '**Pòdes** repetir ?', fr: 'tu peux répéter ?' }
							]
						},
						{
							titol: 'Je voudrais',
							frasas: [
								{ picto: 'ieu', oc: '**Volriái** d’olivas, se vos plai.', fr: 'je voudrais des olives, s’il vous plaît' },
								{ oc: '**Poiriás** repetir, se te plai ?', fr: 'pourrais-tu répéter, s’il te plaît ?' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: '*Se vos plai* quand on vouvoie, *se te plai* quand on tutoie : les deux disent « s’il vous plaît ».'
				},
				{ type: 'font', pages: 'page 73' }
			]
		},
		{
			titol: 'Cossí se fa',
			blocs: [
				{
					type: 'intro',
					text: 'Pour la plupart des verbes, on garde l’**infinitif** entier et on ajoute la fin : *cantar* › *cantariái*.'
				},
				{
					type: 'marcas',
					linhas: [
						['iái', 'ieu', 'cantariái'],
						['iás', 'tu', 'cantariás'],
						['iá', 'el, ela', 'cantariá'],
						['iam', 'nosautres, nosautras', 'cantariam'],
						['iatz', 'vosautres, vosautras', 'cantariatz'],
						['ián', 'eles, elas', 'cantarián']
					]
				},
				{
					type: 'nota',
					text: 'Quelques verbes raccourcissent l’infinitif : *voler* › *volriái*, *poder* › *poiriái*, *aver* › *auriái*, *èsser* › *seriái*.'
				},
				{ type: 'font', pages: 'page 73' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne. La fin dit la personne ; le début dit le verbe. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu (voler)', fr: 'je voudrais', forma: 'volr|iái:c', sens: 'volriái', indici: 'voler se raccourcit en volr-, et ieu prend -iái' },
						{ oc: 'tu (cantar)', fr: 'tu chanterais', forma: 'cantar|iás:c', sens: 'cantariás', indici: 'l’infinitif entier, et tu prend -iás' },
						{ oc: 'el, ela (parlar)', fr: 'il ou elle parlerait', forma: 'parlar|iá:c', sens: 'parlariá', indici: 'la fin -iá, sans s' },
						{ oc: 'nosautres (aver)', fr: 'nous aurions', forma: 'aur|iam:p', sens: 'auriam', indici: 'aver se raccourcit en aur-' },
						{ oc: 'vosautres (poder)', fr: 'vous pourriez', forma: 'poir|iatz:p', sens: 'poiriatz', indici: 'poder devient poir-, et vosautres prend -iatz' },
						{ oc: 'eles, elas (èsser)', fr: 'ils ou elles seraient', forma: 'ser|ián:p', sens: 'serián', indici: 'èsser devient ser-, et eles prend -ián' }
					],
					mescla: ['poiriatz', 'cantariás', 'serián', 'volriái', 'auriam', 'parlariá'],
					bravo: 'Six sur six. Te voilà poli dans toutes les personnes.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Pour demander poliment : **volriái** (je voudrais), **poiriás** (pourrais-tu). Le conditionnel, c’est l’infinitif plus **-iái, -iás, -iá, -iam, -iatz, -ián**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 5.3 t’envoie au marché](/aprene/modul/5-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 73.'
		},
		{ de: 'Les formes', text: 'le parcours de Lo Ligam (*volriái*), conjuguées avec vèrb’Òc (lo Congrès).' }
	]
};
