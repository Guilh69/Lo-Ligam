// Les mots de « La sèrp de las letras » (chantier 27, Romain 2026-11-04 :
// option A sur 3). Seulement des mots déjà appris : chacun renvoie à une
// chose d'un encadré « À retenir » des unités 1 et 2 (`id`), et le test
// serp.test.js vérifie, contre les modules eux-mêmes, que la formule
// complétée (`cadre`, où `_` marque le mot) et sa prononciation (`son`) y
// figurent telles quelles. Les modules restent la seule source : la page
// n'importe que ce petit fichier, pas les leçons (sobriété).
//
// `fr` : le sens, en court, repris de l'encadré. `trapas` : une ou deux
// lettres pièges, celles qu'écrirait la main habituée au français (u de
// « bonjour », i de « merci », g de « espagnol ») ou l'accent oublié. Un piège
// peut redoubler une lettre du mot (l de *vilatge*, *ela*, contre les deux l
// de « village », « elle ») : la première tuile l est bonne, la seconde est
// alors refusée (test « une lettre répétée » de serp.test.js).
// Occitan passé à lo Congrès le 2026-11-04 (Basic, vèrb'Òc, top'Òc pour
// Tolosa ; francés confirmé sur dicodòc le 2026-11-02) ; à valider par Romain.

export const UNITATS = [
	{
		id: 1,
		nom: { oc: 'Unitat 1', fr: 'Unité 1' },
		titol: 'Adieu !',
		mots: [
			{ id: 'adieu', mot: 'Adieu', cadre: '_ !', fr: 'salut ! (bonjour et au revoir)', son: 'a-DIOU', trapas: ['o'] },
			{ id: 'bonjorn', mot: 'Bonjorn', cadre: '_ !', fr: 'bonjour !', son: 'boun-DJOUR', trapas: ['u'] },
			{ id: 'bon-ser', mot: 'ser', cadre: 'Bon _ !', fr: 'bonsoir !', son: 'bou(n) SÉR', trapas: ['o', 'i'] },
			{ id: 'cossi-vas', mot: 'vas', cadre: 'Cossí _ ?', fr: 'comment vas-tu ?', son: 'cou-si BAS', trapas: ['b'] },
			{ id: 'vau-plan', mot: 'Vau', cadre: '_ plan, mercés !', fr: 'je vais bien, merci !', son: 'baou PLA, mér-SÉS', trapas: ['B', 'o'] },
			{ id: 'merce', mot: 'mercés', cadre: 'Plan _ !', fr: 'merci beaucoup !', son: 'pla mér-SÉS', trapas: ['i'] },
			{ id: 'a-leu', mot: 'lèu', cadre: 'A _ !', fr: 'à bientôt !', son: 'a LÈOU', trapas: ['é', 'o'] },
			{ id: 'a-deman', mot: 'deman', cadre: 'A _ !', fr: 'à demain !', son: 'a dé-MA', trapas: ['i'] },
			{ id: 'al-cop-que-ven', mot: 'còp', cadre: 'Al _ que ven !', fr: 'à la prochaine !', son: 'al COP qué BÈN', trapas: ['o'] },
			{ id: 'me-dison', mot: 'dison', cadre: 'Me _…', fr: 'je m’appelle…', son: 'mé DI-zoun', trapas: ['z'] },
			{ id: 'encantat', mot: 'Encantada', cadre: '_ !', fr: 'enchantée !', son: 'én-can-TA-do', trapas: ['h', 'é'] },
			{ id: 'd-ont-sias', mot: 'siás', cadre: 'D’ont _ ?', fr: 'd’où es-tu ?', son: 'doun SYOS', trapas: ['a'] },
			{ id: 'demori-a', mot: 'Demòri', cadre: '_ a…', fr: 'j’habite à…', son: 'dé-MÒ-ri a', trapas: ['o'] },
			{ id: 'soi-d-aqui', mot: 'aquí', cadre: 'Soi d’_.', fr: 'je suis d’ici.', son: 'souï da-KI', trapas: ['i', 'c'] },
			{ id: 'vilatge-vila-pais', mot: 'vilatge', cadre: 'lo _', fr: 'le village', son: 'lou bi-LA-djé', trapas: ['l'] },
			{ id: 'vilatge-vila-pais', mot: 'vila', cadre: 'la _', fr: 'la ville', son: 'la BI-lo', trapas: ['e'] },
			{ id: 'vilatge-vila-pais', mot: 'país', cadre: 'lo _', fr: 'le pays', son: 'lou pa-ÍS', trapas: ['y'] },
			{ id: 'noms-vilas', mot: 'Tolosa', cadre: '_', fr: 'Toulouse', son: 'tou-LOU-zo', trapas: ['u', 'e'] }
		]
	},
	{
		id: 2,
		nom: { oc: 'Unitat 2', fr: 'Unité 2' },
		titol: 'Parlas occitan ?',
		mots: [
			{ id: 'occitan-occitana', mot: 'occitana', cadre: '_', fr: 'occitane', son: 'ou-tsi-TA-no', trapas: ['e'] },
			{ id: 'frances-francesa', mot: 'francés', cadre: '_', fr: 'français', son: 'fran-SÉS', trapas: ['ç', 'i'] },
			{ id: 'catalan-catalana', mot: 'catalana', cadre: '_', fr: 'catalane', son: 'ca-ta-LA-no', trapas: ['e'] },
			{ id: 'espanhol-espanhola', mot: 'espanhòl', cadre: '_', fr: 'espagnol', son: 'es-pa-GNÒL', trapas: ['g', 'o'] },
			{ id: 'italian-italiana', mot: 'italiana', cadre: '_', fr: 'italienne', son: 'i-ta-LYA-no', trapas: ['e'] },
			{ id: 'angles-anglesa', mot: 'anglesa', cadre: '_', fr: 'anglaise', son: 'an-GLÉ-zo', trapas: ['i'] },
			{ id: 'portugues-portuguesa', mot: 'portugués', cadre: '_', fr: 'portugais', son: 'pour-tu-GUÉS', trapas: ['a', 'i'] },
			{ id: 'marroquin-marroquina', mot: 'marroquin', cadre: '_', fr: 'marocain', son: 'ma-rou-KI', trapas: ['c'] },
			{ id: 'argerian-argeriana', mot: 'argeriana', cadre: '_', fr: 'algérienne', son: 'ar-djé-RYA-no', trapas: ['l', 'é'] },
			{ id: 'oc-non', mot: 'Òc', cadre: '_ !', fr: 'oui !', son: 'OK', trapas: ['O', 'u'] },
			{ id: 'el-ela', mot: 'ela', cadre: '_', fr: 'elle', son: 'É-lo', trapas: ['l'] },
			{ id: 'parlar-singular', mot: 'parli', cadre: '_', fr: 'je parle', son: 'PAR-li', trapas: ['e'] },
			{ id: 'comprene-singular', mot: 'compreni', cadre: '_', fr: 'je comprends', son: 'coum-PRÉ-ni', trapas: ['d'] },
			{ id: 'un-pauc-plan', mot: 'pauc', cadre: 'un _', fr: 'un peu', son: 'un PAOUK', trapas: ['o', 'k'] },
			{ id: 'mas', mot: 'mas', cadre: '_', fr: 'mais', son: 'MAS', trapas: ['i'] },
			{ id: 'tanben', mot: 'tanben', cadre: '_', fr: 'aussi', son: 'tam-BÉ', trapas: ['m'] },
			{ id: 'la-lenga', mot: 'lenga', cadre: 'la _', fr: 'la langue', son: 'la LÉN-go', trapas: ['u'] },
			{ id: 'que-es-aquo', mot: 'aquò', cadre: 'Qué es _ ?', fr: 'qu’est-ce que c’est ?', son: 'ké és a-KÒ', trapas: ['o'] },
			{ id: 'cossi-se-ditz', mot: 'ditz', cadre: 'Cossí se _…', fr: 'comment dit-on… ?', son: 'cou-si sé DITS…', trapas: ['s'] },
			{ id: 'que-vol-dire', mot: 'vòl', cadre: 'Qué _ dire… ?', fr: 'que veut dire… ?', son: 'ké BÒL DI-ré', trapas: ['o', 'b'] },
			{ id: 'podes-repetir', mot: 'repetir', cadre: 'Pòdes _, se te plai ?', fr: 'tu peux répéter, s’il te plaît ?', son: 'PÒ-dés ré-pé-TI, sé té PLAÏ', trapas: ['é'] },
			{ id: 'sabi-pas', mot: 'sabi', cadre: 'Non _ pas.', fr: 'je ne sais pas.', son: 'nou SA-bi PAS', trapas: ['v'] }
		]
	}
];

/** Le cadre coupé autour du mot : { avant, apres }. */
export function copar(cadre) {
	const i = cadre.indexOf('_');
	return { avant: cadre.slice(0, i), apres: cadre.slice(i + 1) };
}

/** Les lettres d'un mot, une par case (les accents restent sur leur lettre). */
export const letrasDe = (mot) => [...mot.normalize('NFC')];
