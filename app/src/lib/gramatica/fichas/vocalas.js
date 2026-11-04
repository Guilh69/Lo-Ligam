// Prononciation 1 : les voyelles et les diphtongues (unité 1, puis un « son
// du jour » par module). Toutes les prononciations sont celles déjà écrites
// dans le parcours, choisies par Romain (usage vivant, languedocien). Règles :
// Gramatica, pages 10 et 11. Précisions de Chabbert (2026-11-04) : pas de e
// muet, a final « a » à Montpellier, ai « ail », èi « soleil », oi
// « fenouil », vau « BOOU » et nuèch « NÈTCH » ailleurs (pages 27 à 29, 37 à
// 39, 47). Occitan à relire par Romain.
import { CHABBERT } from '../libres.js';

export default {
	id: 'vocalas',
	capitol: 'sons',
	ordre: 1,
	titol: 'Las vocalas',
	fr: 'Les voyelles',
	resumit: 'a, é, è, o, ò, u, et les voyelles qui glissent l’une dans l’autre : ai, au, èu, òu, uè.',
	validada: false,
	colors: { a: 'pruna', e: 'oliva', o: 'blau' },
	ecrans: [
		{
			titol: 'A, É, È',
			blocs: [
				{
					type: 'intro',
					text: 'L’occitan se lit comme il s’écrit, à condition de connaître **le son de chaque voyelle**. L’accent écrit en dit beaucoup.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'a', gros: 'a', color: 'a', exemples: [['va', 'BA'], ['cafè', 'ca-FÈ'], ['la plaça', 'la PLA-ço'], ['las pomas', 'las POU-mos']] },
						{ titol: 'e fermé', gros: 'e é', color: 'e', exemples: [['tres', 'TRÉS'], ['mercés', 'mér-SÉS'], ['set', 'SÉT (la soif)'], ['dimenge', 'di-MÉN-djé']] },
						{ titol: 'e ouvert', gros: 'è', color: 'o', exemples: [['sèt', 'SÈT (sept)'], ['tè', 'TÈ'], ['cafè', 'ca-FÈ'], ['esquèrra', 'es-KÈ-rro']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte. La prononciation est écrite avec les lettres du français ; la syllabe en CAPITALES est celle où la voix appuie.' },
				{
					type: 'nota',
					text: 'Le *a* de la fin, quand la voix n’appuie pas dessus, sonne comme un « o » léger : *la plaça* « la PLA-ço ». Autour de Montpellier, de Lodève ou de Sète, il reste « a » : la différence s’entend à peine.'
				},
				{
					type: 'nota',
					text: 'Il n’y a pas de *e* muet : chaque *e* se dit, même à la fin, fermé ou ouvert. *dimenge* « di-MÉN-djé ». Et *set* (la soif) n’est pas *sèt* (sept) : seul l’accent les sépare.'
				},
				{ type: 'font', pages: 'page 10' },
				{ type: 'font', libre: CHABBERT, pages: 'pages 27 à 29' }
			]
		},
		{
			titol: 'O, Ò, U',
			blocs: [
				{
					type: 'intro',
					text: 'Le piège des débuts : le son « ou » s’écrit **o**, le son « o » s’écrit **ò**. Et **u** a son son à lui.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'o sans accent', gros: 'o', color: 'a', exemples: [['Tolosa', 'tou-LOU-zo'], ['ora', 'OU-ro'], ['dos', 'DOUS'], ['son', 'soun']] },
						{ titol: 'o avec accent', gros: 'ò', color: 'e', exemples: [['òc', 'OK'], ['demòri', 'dé-MÒ-ri'], ['sòrre', 'SÒ-rré'], ['còsta', 'CÒS-to']] },
						{ titol: 'u', gros: 'u', color: 'o', exemples: [['tu', 'TU'], ['la frucha', 'la FRU-tcho'], ['los legums', 'lous lé-GUNS']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour entendre la différence dans la prononciation écrite.' },
				{
					type: 'nota',
					text: 'Retiens la paire *Tolosa*, « tou-LOU-zo », et *òc*, « OK ». Sans accent, « ou » ; avec l’accent grave, « o ».'
				},
				{ type: 'font', pages: 'pages 10 et 11' }
			]
		},
		{
			titol: 'Doas vocalas, una sillaba',
			blocs: [
				{
					type: 'intro',
					text: 'Deux voyelles côte à côte se disent souvent **d’un seul souffle** : la seconde glisse. Après une voyelle, le **u** sonne « ou » et le **i** sonne « ï ».'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'avec i', gros: 'ai ei', color: 'a', exemples: [['ai set', 'aï SÉT'], ['sièis', 'SYÈÏS'], ['veire', 'BÉÏ-ré'], ['seissanta', 'séï-SAN-to']] },
						{ titol: 'avec u', gros: 'au èu', color: 'e', exemples: [['vau', 'BAOU'], ['fa caud', 'fa CAOUT'], ['lèu', 'LÈOU'], ['l’aucèl', 'laou-SÈL']] },
						{ titol: 'avec ò', gros: 'òu uò', color: 'o', exemples: [['nòu', 'NÒOU'], ['dijòus', 'di-DJÒOUS'], ['los uòus', 'lou-ZUÒOUS']] },
						{ titol: 'avec è', gros: 'uè iè', color: 'a', exemples: [['uèch', 'UÈTCH'], ['primièra', 'pri-MYÈ-ro'], ['Montpelhièr', 'moun-pé-LYÈ']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir chaque groupe.' },
				{
					type: 'nota',
					text: 'Pour t’aider : *ai* se dit comme « ail », *èi* comme la fin de « soleil », *oi* comme la fin de « fenouil » : *soi* « souï ».'
				},
				{
					type: 'nota',
					text: 'Ailleurs, tu entendras aussi *vau* « BOOU », ou *nuèch* « NÈTCH » sans le « u ». On écrit pourtant toujours *vau* et *nuèch*.'
				},
				{ type: 'font', pages: 'pages 10 et 11' },
				{ type: 'font', libre: CHABBERT, pages: 'pages 37 à 39 et 47' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. Regarde bien les accents. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'sèt', fr: 'sept', forma: 'SÈT|:o', sens: 'sèt', indici: 'è : le e ouvert' },
						{ oc: 'set', fr: 'la soif', forma: 'SÉT|:e', sens: 'set', indici: 'e sans accent grave : le e fermé' },
						{ oc: 'Tolosa', fr: 'Toulouse', forma: 'tou-LOU-zo|:a', sens: 'Tolosa', indici: 'o sans accent : « ou »' },
						{ oc: 'demòri', fr: 'j’habite', forma: 'dé-MÒ-ri|:o', sens: 'demòri', indici: 'ò : « o »' },
						{ oc: 'lèu', fr: 'bientôt', forma: 'LÈOU|:e', sens: 'lèu', indici: 'u après une voyelle : « ou »' },
						{ oc: 'sièis', fr: 'six', forma: 'SYÈÏS|:a', sens: 'sièis', indici: 'i après une voyelle : « ï »' }
					],
					mescla: ['tou-LOU-zo', 'LÈOU', 'SÉT', 'SYÈÏS', 'SÈT', 'dé-MÒ-ri'],
					bravo: 'Six sur six. Les voyelles occitanes n’ont plus de secret pour toi.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**o** « ou », **ò** « o » ; **é** fermé, **è** ouvert ; le **a** final sans appui « o » ; **u** après une voyelle « ou », **i** après une voyelle « ï ».'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 1.3 t’apprend o et ò](/aprene/modul/1-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'Les règles',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 10 et 11.'
		},
		{ de: 'Des précisions', text: '_Lire & écrire l’Occitan_, Raymond Chabbert, pages 27 à 29, 37 à 39 et 47.' },
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
