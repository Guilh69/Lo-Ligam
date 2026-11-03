// Poser une question ; le relatif « que » (unité 2, puis tout l'A1).
// Questions reprises du parcours (modules 1.1 à 6.3). Règle : Gramatica,
// pages 48 à 50. Occitan à relire par Romain.
export default {
	id: 'questions',
	capitol: 'questions',
	titol: 'Las questions',
	fr: 'Poser une question',
	resumit: 'Qui, qué, ont, cossí, quant, quina : les mots pour demander ; que et ont pour relier.',
	validada: false,
	colors: { qui: 'pruna', que: 'oliva', ont: 'blau' },
	ecrans: [
		{
			titol: 'Los mots de la question',
			blocs: [
				{
					type: 'intro',
					text: 'Une question commence par un **mot qui demande**, puis vient le verbe. À l’écrit, un point d’interrogation ; à l’oral, la voix monte.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'qui ?', gros: 'qui', color: 'qui', exemples: [['Qui es ?', 'qui est-ce ?']] },
						{ titol: 'quoi ?', gros: 'qué', color: 'que', exemples: [['Qué es aquò ?', 'qu’est-ce que c’est ?'], ['Qué fas dins la vida ?', 'que fais-tu dans la vie ?'], ['Qué prenes ?', 'que prends-tu ?']] },
						{ titol: 'où ?', gros: 'ont', color: 'ont', exemples: [['Ont demòras ?', 'où habites-tu ?'], ['Ont es la gara ?', 'où est la gare ?'], ['D’ont siás ?', 'd’où es-tu ?']] },
						{ titol: 'comment ?', gros: 'cossí', color: 'qui', exemples: [['Cossí vas ?', 'comment vas-tu ?'], ['Cossí te dison ?', 'comment t’appelles-tu ?'], ['Cossí i vau ?', 'comment j’y vais ?']] },
						{ titol: 'combien ?', gros: 'quant', color: 'que', exemples: [['Quant fa ?', 'combien ça fait ?'], ['Quant còsta ?', 'combien ça coûte ?'], ['Quant as d’ans ?', 'quel âge as-tu ?']] },
						{ titol: 'quel, quelle ?', gros: 'quina', color: 'ont', exemples: [['Quina ora es ?', 'quelle heure est-il ?'], ['Quina lenga parlas ?', 'quelle langue parles-tu ?'], ['Quin temps fa ?', 'quel temps fait-il ?']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des questions du parcours.' },
				{
					type: 'nota',
					text: '*Qué* prend un accent quand il pose une question : *Qué fas ?* Sans accent, *que* relie deux idées (écran 3).'
				},
				{ type: 'font', pages: 'pages 49 et 50' }
			]
		},
		{
			titol: 'Quin, quina',
			blocs: [
				{
					type: 'intro',
					text: '« Quel, quelle » s’accorde avec le nom qui suit : **quin** au masculin, **quina** au féminin.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Masculin',
							frasas: [{ oc: '**Quin** temps fa ?', fr: 'quel temps fait-il ?' }]
						},
						{
							titol: 'Féminin',
							frasas: [
								{ oc: '**Quina** ora es ?', fr: 'quelle heure est-il ?' },
								{ oc: '**Quina** lenga parlas ?', fr: 'quelle langue parles-tu ?' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Au pluriel : *quines*, *quinas*.' },
				{ type: 'font', pages: 'page 49' }
			]
		},
		{
			titol: 'Que e ont, per religar',
			blocs: [
				{
					type: 'intro',
					text: 'Sans accent, **que** accroche une phrase à un nom. Il traduit à la fois « qui » et « que ». Pour un lieu, on dit **ont**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'que',
							frasas: [
								{ oc: 'l’amiga **que** demòra a Tolosa', fr: 'l’amie qui habite à Toulouse' },
								{ oc: 'lo cafè **que** prenes', fr: 'le café que tu prends' }
							]
						},
						{
							titol: 'ont',
							frasas: [{ oc: 'lo vilatge **ont** demòri', fr: 'le village où j’habite' }]
						}
					]
				},
				{ type: 'font', pages: 'page 48' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en tête de sa question. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: '… vas ?', fr: 'comment vas-tu ?', forma: '|Cossí:qui', sens: 'Cossí vas ?', indici: 'comment : cossí' },
						{ oc: '… es aquò ?', fr: 'qu’est-ce que c’est ?', forma: '|Qué:que', sens: 'Qué es aquò ?', indici: 'quoi : qué, avec l’accent' },
						{ oc: '… demòras ?', fr: 'où habites-tu ?', forma: '|Ont:ont', sens: 'Ont demòras ?', indici: 'où : ont' },
						{ oc: '… fa ?', fr: 'combien ça fait ?', forma: '|Quant:que', sens: 'Quant fa ?', indici: 'combien : quant' },
						{ oc: '… ora es ?', fr: 'quelle heure est-il ?', forma: '|Quina:ont', sens: 'Quina ora es ?', indici: 'ora est féminin : quina' },
						{ oc: '… es ?', fr: 'qui est-ce ?', forma: '|Qui:qui', sens: 'Qui es ?', indici: 'qui : qui' }
					],
					mescla: ['Quant', 'Qui', 'Ont', 'Quina', 'Cossí', 'Qué'],
					bravo: 'Six sur six. Tu peux poser toutes les questions du parcours.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Qui** (qui), **qué** (quoi), **ont** (où), **cossí** (comment), **quant** (combien), **quin, quina** (quel, quelle). Pour relier : **que**, et **ont** pour un lieu.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 2.3 te fait demander ce qu’est une chose](/aprene/modul/2-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 48 à 50.'
		},
		{ de: 'Les questions', text: 'le parcours de Lo Ligam, unités 1 à 6.' }
	]
};
