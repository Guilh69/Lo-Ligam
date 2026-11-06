// Les mots de « La sèrp de las letras » (chantier 27, Romain 2026-11-04 :
// option A sur 3). Seulement des mots déjà appris : chacun renvoie à une
// chose d'un encadré « À retenir » de son unité (`id`) ; les unités 3 à 8
// rejoignent les deux premières le 2026-11-06 (« améliore encore les jeux »), et le test
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
	},
	{
		id: 3,
		nom: { oc: 'Unitat 3', fr: 'Unité 3' },
		titol: 'La familha',
		mots: [
			{ id: 'la-familha', mot: 'familha', cadre: 'la _', fr: 'la famille', son: 'la fa-MI-lyo', trapas: ['l', 'e'] },
			{ id: 'nombre-5', mot: 'cinc', cadre: '_', fr: '5', son: 'SINK', trapas: ['q'] },
			{ id: 'nombre-6', mot: 'sièis', cadre: '_', fr: '6', son: 'SYÈÏS', trapas: ['x', 'e'] },
			{ id: 'nombre-8', mot: 'uèch', cadre: '_', fr: '8', son: 'UÈTCH', trapas: ['h', 't'] },
			{ id: 'nombre-10', mot: 'dètz', cadre: '_', fr: '10', son: 'DÈTS', trapas: ['x', 's'] },
			{ id: 'nombre-14', mot: 'catòrze', cadre: '_', fr: '14', son: 'ca-TÒR-zé', trapas: ['q', 'o'] },
			{ id: 'nombre-20', mot: 'vint', cadre: '_', fr: '20', son: 'BIN', trapas: ['g'] },
			{ id: 'lo-paire', mot: 'paire', cadre: 'lo _', fr: 'le père', son: 'lou PAÏ-ré', trapas: ['è'] },
			{ id: 'la-maire', mot: 'maire', cadre: 'la _', fr: 'la mère', son: 'la MAÏ-ré', trapas: ['è'] },
			{ id: 'la-sorre', mot: 'sòrre', cadre: 'la _', fr: 'la sœur', son: 'la SÒ-rré', trapas: ['u', 'o'] },
			{ id: 'filh-filha', mot: 'filha', cadre: 'la _', fr: 'la fille', son: 'la FI-lyo', trapas: ['l', 'e'] },
			{ id: 'cosin-cosina', mot: 'cosin', cadre: 'lo _', fr: 'le cousin', son: 'lou cou-ZI', trapas: ['u', 'z'] },
			{ id: 'lo-caval', mot: 'caval', cadre: 'lo _', fr: 'le cheval', son: 'lou ca-BAL', trapas: ['h', 'b'] },
			{ id: 'l-aucel', mot: 'aucèl', cadre: 'l’_', fr: 'l’oiseau', son: 'laou-SÈL', trapas: ['s', 'e'] }
		]
	},
	{
		id: 4,
		nom: { oc: 'Unitat 4', fr: 'Unité 4' },
		titol: 'Qué fas ?',
		mots: [
			{ id: 'trabalhar', mot: 'trabalhi', cadre: '_', fr: 'je travaille', son: 'tra-BA-lyi', trapas: ['v', 'e'] },
			{ id: 'cantar', mot: 'canti', cadre: '_', fr: 'je chante', son: 'CAN-ti', trapas: ['h', 'e'] },
			{ id: 'manjar', mot: 'mangi', cadre: '_', fr: 'je mange', son: 'MAN-dji', trapas: ['j', 'e'] },
			{ id: 'dancar', mot: 'danci', cadre: '_', fr: 'je danse', son: 'DAN-si', trapas: ['s', 'ç'] },
			{ id: 'escotar', mot: 'escotar', cadre: '_', fr: 'écouter', son: 'es-cou-TA', trapas: ['u', 'é'] },
			{ id: 'far-singular', mot: 'fau', cadre: '_', fr: 'je fais', son: 'FAOU', trapas: ['i', 's'] },
			{ id: 'regent-regenta', mot: 'regenta', cadre: '_', fr: 'institutrice', son: 'ré-DJÉN-to', trapas: ['j', 'é'] },
			{ id: 'fornier-forniera', mot: 'fornièr', cadre: '_', fr: 'boulanger', son: 'four-NYÈ', trapas: ['u', 'e'] },
			{ id: 'paisan-paisana', mot: 'paisana', cadre: '_', fr: 'paysanne', son: 'paï-ZA-no', trapas: ['y', 'n'] },
			{ id: 'metge', mot: 'mètge', cadre: '_', fr: 'médecin', son: 'MÈ-djé', trapas: ['j', 'é'] },
			{ id: 'dimenge', mot: 'dimenge', cadre: '_', fr: 'dimanche', son: 'di-MÉN-djé', trapas: ['a', 'j'] },
			{ id: 'dijous', mot: 'dijòus', cadre: '_', fr: 'jeudi', son: 'di-DJÒOUS', trapas: ['e', 'o'] },
			{ id: 'amic-amiga', mot: 'amiga', cadre: 'l’_', fr: 'l’amie', son: 'la-MI-go', trapas: ['e'] }
		]
	},
	{
		id: 5,
		nom: { oc: 'Unitat 5', fr: 'Unité 5' },
		titol: 'Al mercat',
		mots: [
			{ id: 'al-mercat', mot: 'mercat', cadre: 'al _', fr: 'au marché', son: 'al mér-CAT', trapas: ['h', 'é'] },
			{ id: 'la-poma', mot: 'poma', cadre: 'la _', fr: 'la pomme', son: 'la POU-mo', trapas: ['m', 'e'] },
			{ id: 'la-pera', mot: 'pera', cadre: 'la _', fr: 'la poire', son: 'la PÉ-ro', trapas: ['o', 'i'] },
			{ id: 'l-uou', mot: 'uòu', cadre: 'l’_', fr: 'l’œuf', son: 'LUÒOU', trapas: ['f', 'o'] },
			{ id: 'la-tomata', mot: 'tomata', cadre: 'la _', fr: 'la tomate', son: 'la tou-MA-to', trapas: ['e', 'u'] },
			{ id: 'la-ceba', mot: 'ceba', cadre: 'la _', fr: 'l’oignon', son: 'la SÉ-bo', trapas: ['s', 'o'] },
			{ id: 'lo-pan', mot: 'pan', cadre: 'lo _', fr: 'le pain', son: 'lou PA', trapas: ['i'] },
			{ id: 'lo-formatge', mot: 'formatge', cadre: 'lo _', fr: 'le fromage', son: 'lou four-MA-djé', trapas: ['u', 'j'] },
			{ id: 'lo-lach', mot: 'lach', cadre: 'lo _', fr: 'le lait', son: 'lou LATCH', trapas: ['i', 't'] },
			{ id: 'lo-rasim', mot: 'rasim', cadre: 'lo _', fr: 'le raisin', son: 'lou ra-ZIN', trapas: ['z', 'n'] },
			{ id: 'nombre-50', mot: 'cinquanta', cadre: '_', fr: '50', son: 'sin-KAN-to', trapas: ['e'] },
			{ id: 'se-vos-plai', mot: 'plai', cadre: 'Se vos _.', fr: 's’il vous plaît.', son: 'sé bous PLAÏ', trapas: ['î', 't'] },
			{ id: 'de-res', mot: 'res', cadre: 'De _.', fr: 'de rien.', son: 'dé RÉS', trapas: ['i', 'é'] },
			{ id: 'volriai', mot: 'Volriái', cadre: '_…', fr: 'je voudrais…', son: 'boul-RYOÏ', trapas: ['d', 'u'] }
		]
	},
	{
		id: 6,
		nom: { oc: 'Unitat 6', fr: 'Unité 6' },
		titol: 'La jornada',
		mots: [
			{ id: 'quina-ora-es', mot: 'ora', cadre: 'Quina _ es ?', fr: 'quelle heure est-il ?', son: 'KI-no OU-ro ÉS', trapas: ['h', 'e'] },
			{ id: 'miegjorn', mot: 'miègjorn', cadre: '_', fr: 'midi', son: 'myèd-DJOUR', trapas: ['u', 'd'] },
			{ id: 'ara', mot: 'ara', cadre: '_', fr: 'maintenant', son: 'A-ro', trapas: ['o'] },
			{ id: 'fa-bel', mot: 'bèl', cadre: 'Fa _.', fr: 'il fait beau.', son: 'fa BÈL', trapas: ['e', 'u'] },
			{ id: 'fa-solelh', mot: 'solelh', cadre: 'Fa _.', fr: 'il y a du soleil.', son: 'fa sou-LÉL', trapas: ['i', 'u'] },
			{ id: 'plou', mot: 'Plòu', cadre: '_.', fr: 'il pleut.', son: 'PLÒOU', trapas: ['e', 't'] },
			{ id: 'fa-caud', mot: 'caud', cadre: 'Fa _.', fr: 'il fait chaud.', son: 'fa CAOUT', trapas: ['h', 't'] },
			{ id: 'fa-freg', mot: 'freg', cadre: 'Fa _.', fr: 'il fait froid.', son: 'fa FRÉTCH', trapas: ['o', 'i'] },
			{ id: 'neva', mot: 'Nèva', cadre: '_.', fr: 'il neige.', son: 'NÈ-bo', trapas: ['i', 'g'] },
			{ id: 'la-plueja', mot: 'pluèja', cadre: 'la _', fr: 'la pluie', son: 'la PLUÈ-djo', trapas: ['i', 'e'] },
			{ id: 'uei', mot: 'uèi', cadre: '_', fr: 'aujourd’hui', son: 'UÈÏ', trapas: ['h', 'e'] },
			{ id: 'totjorn', mot: 'totjorn', cadre: '_', fr: 'toujours', son: 'tout-DJOUR', trapas: ['u', 's'] },
			{ id: 'lo-tantost', mot: 'tantòst', cadre: 'lo _', fr: 'l’après-midi', son: 'lou tan-TÒST', trapas: ['o'] },
			{ id: 'sopar', mot: 'sopar', cadre: '_', fr: 'dîner (le repas du soir)', son: 'sou-PA', trapas: ['u'] }
		]
	},
	{
		id: 7,
		nom: { oc: 'Unitat 7', fr: 'Unité 7' },
		titol: 'L’ostal',
		mots: [
			{ id: 'l-ostal', mot: 'ostal', cadre: 'l’_', fr: 'la maison', son: 'lous-TAL', trapas: ['u', 'e'] },
			{ id: 'la-cosina', mot: 'cosina', cadre: 'la _', fr: 'la cuisine', son: 'la cou-ZI-no', trapas: ['u', 'z'] },
			{ id: 'la-cambra', mot: 'cambra', cadre: 'la _', fr: 'la chambre', son: 'la CAM-bro', trapas: ['h', 'e'] },
			{ id: 'la-sala', mot: 'sala', cadre: 'la _', fr: 'la salle, le séjour', son: 'la SA-lo', trapas: ['l', 'e'] },
			{ id: 'la-taula', mot: 'taula', cadre: 'la _', fr: 'la table', son: 'la TAOU-lo', trapas: ['b', 'e'] },
			{ id: 'la-cadiera', mot: 'cadièra', cadre: 'la _', fr: 'la chaise', son: 'la ca-DYÈ-ro', trapas: ['h', 'e'] },
			{ id: 'lo-canape', mot: 'canapè', cadre: 'lo _', fr: 'le canapé', son: 'lou ca-na-PÈ', trapas: ['é'] },
			{ id: 'l-armari', mot: 'armari', cadre: 'l’_', fr: 'l’armoire', son: 'lar-MA-ri', trapas: ['o', 'e'] },
			{ id: 'la-porta', mot: 'pòrta', cadre: 'la _', fr: 'la porte', son: 'la PÒR-to', trapas: ['o', 'e'] },
			{ id: 'la-fenestra', mot: 'fenèstra', cadre: 'la _', fr: 'la fenêtre', son: 'la fé-NÈS-tro', trapas: ['ê', 'é'] },
			{ id: 'davant', mot: 'davant', cadre: '_', fr: 'devant', son: 'da-BAN', trapas: ['e', 'b'] },
			{ id: 'darrier', mot: 'darrièr', cadre: '_', fr: 'derrière', son: 'da-RRYÈ', trapas: ['e'] },
			{ id: 'roge-roja', mot: 'roja', cadre: '_', fr: 'rouge (au féminin)', son: 'ROU-djo', trapas: ['u', 'g'] },
			{ id: 'blanc-blanca', mot: 'blanca', cadre: '_', fr: 'blanche', son: 'BLAN-co', trapas: ['h', 'e'] },
			{ id: 'pichon-pichona', mot: 'pichona', cadre: '_', fr: 'petite', son: 'pi-TCHOU-no', trapas: ['t', 'u'] }
		]
	},
	{
		id: 8,
		nom: { oc: 'Unitat 8', fr: 'Unité 8' },
		titol: 'En vila',
		mots: [
			{ id: 'perdon', mot: 'Perdon', cadre: '_…', fr: 'pardon…', son: 'pér-DOU', trapas: ['a', 'u'] },
			{ id: 'es-luenh', mot: 'luènh', cadre: 'Es _ ?', fr: 'c’est loin ?', son: 'és LUÈN', trapas: ['o', 'i'] },
			{ id: 'es-luenh', mot: 'prèp', cadre: 'Es _.', fr: 'c’est près.', son: 'és PRÈP', trapas: ['s'] },
			{ id: 'tot-drech', mot: 'drech', cadre: 'tot _', fr: 'tout droit', son: 'tout DRÉTCH', trapas: ['o', 'i'] },
			{ id: 'a-esquerra', mot: 'esquèrra', cadre: 'a _', fr: 'à gauche', son: 'a es-KÈ-rro', trapas: ['k', 'e'] },
			{ id: 'la-gara', mot: 'gara', cadre: 'la _', fr: 'la gare', son: 'la GA-ro', trapas: ['e'] },
			{ id: 'la-carriera', mot: 'carrièra', cadre: 'la _', fr: 'la rue', son: 'la ca-RRYÈ-ro', trapas: ['e'] },
			{ id: 'la-placa', mot: 'plaça', cadre: 'la _', fr: 'la place', son: 'la PLA-ço', trapas: ['c', 'e'] },
			{ id: 'la-gleisa', mot: 'glèisa', cadre: 'la _', fr: 'l’église', son: 'la GLÈÏ-zo', trapas: ['é', 'z'] },
			{ id: 'a-pe', mot: 'pè', cadre: 'a _', fr: 'à pied', son: 'a PÈ', trapas: ['i', 'é'] },
			{ id: 'vira', mot: 'Vira', cadre: '_ a drecha !', fr: 'tourne à droite !', son: 'BI-ro a DRÉ-tcho', trapas: ['B'] },
			{ id: 'un-cafe', mot: 'cafè', cadre: 'un _', fr: 'un café', son: 'un ca-FÈ', trapas: ['é'] },
			{ id: 'l-aiga', mot: 'aiga', cadre: 'l’_', fr: 'l’eau', son: 'LAÏ-go', trapas: ['e', 'u'] },
			{ id: 'un-veire-de', mot: 'veire', cadre: 'un _ de…', fr: 'un verre de…', son: 'un BÉÏ-ré dé', trapas: ['r', 'b'] },
			{ id: 'ai-set', mot: 'set', cadre: 'Ai _.', fr: 'j’ai soif.', son: 'aï SÉT', trapas: ['o', 'f'] }
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
