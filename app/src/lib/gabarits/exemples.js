// Les exemples des gabarits d'exercice (lot 1, 2026-11-17) : la matière du
// module 1.1 (« Cossí vas ? »), déjà passée par l'API de lo Congrès ; les mots
// des consignes et des boutons vérifiés le 2026-11-17 (escota, repetís, causís,
// tòrna, vertat, fals, òsca, encara, verificar, passar, aqueste, traduccion,
// dialòg, mot, puèi, arrèsta, ta, pausa, los, pas, bona, responsa ; « cada » et
// « lor » : l'API a planté, mots écartés). Le son est le seul enregistrement
// existant du module 1.1 : il tient lieu d'exemple en attendant le studio.
// Lot 2 (2026-11-18) : mots vérifiés le même jour (met, escriu, legís, fai,
// farai, sabiái, solinhat, òrdre, dins, letra, parelh, qué, vòl, dire, tòca,
// tèxt, bilanç, audàcia, còp, acabar, setmana, veire, occitan, las, o). « en »,
// « lo » et « la » : l'API plante sur ces trois mots (erreur d'appel, pas une
// absence) ; ils sont déjà dans les textes validés du site. La carte de mot et
// le texte à lire n'ont pas de son : aucune expression du module 1.1 n'est
// encore enregistrée seule.

export const SON_EXEMPLE = '/audio/moduls/1-1/lo-matin-sul-mercat.m4a';
export const FOTO_EXEMPLE = { src: '/aprene/fotos/5-1-mercat-800.webp', alt: 'Un marché en plein air, des étals et des passants' };

export const PERSONATGES = {
	yasmine: { nom: 'Yasmine', costat: 'esquèrra' },
	lois: { nom: 'Loís', costat: 'drecha' }
};

/** écouter et répéter : une formule */
export const ESCOTAR = { oc: 'Adieu ! Cossí vas ?', fr: 'Salut ! Comment vas-tu ?', sound: 'a-DIOU ! cou-si BAS ?' };

/** le dialogue en bulles : la scène du matin */
export const DIALÒG = [
	{ qui: 'lois', oc: 'Bonjorn, Yasmine !', fr: 'Bonjour, Yasmine !' },
	{ qui: 'yasmine', oc: 'Adieu, Loís ! Cossí vas ?', fr: 'Salut, Loís ! Comment vas-tu ?' },
	{ qui: 'lois', oc: 'Vau plan, mercés. E tu ?', fr: 'Je vais bien, merci. Et toi ?' },
	{ qui: 'yasmine', oc: 'Va plan, plan mercés !', fr: 'Ça va bien, merci beaucoup !' },
	{ qui: 'lois', oc: 'A lèu, Yasmine !', fr: 'À bientôt, Yasmine !' }
];

/**
 * le dialogue à trous : chaque réplique en morceaux ; un morceau { trauc } est
 * le mot attendu, avec l'explication donnée si la réponse n'est pas la bonne
 */
export const TRAUCS = {
	replicas: [
		{ qui: 'lois', parts: [{ trauc: 'Bonjorn' }, ', Yasmine !'] },
		{ qui: 'yasmine', parts: ['Adieu, Loís ! ', { trauc: 'Cossí' }, ' vas ?'] },
		{ qui: 'lois', parts: ['Vau ', { trauc: 'plan' }, ', mercés. E tu ?'] },
		{ qui: 'yasmine', parts: ['A ', { trauc: 'lèu' }, ', Loís !'] }
	],
	explics: {
		Bonjorn: '« Bonjorn » : bonjour, la formule la plus simple le matin.',
		Cossí: '« Cossí vas ? » : comment vas-tu ? « Cossí » veut dire « comment ».',
		plan: '« Vau plan » : je vais bien. « Plan » veut dire « bien ».',
		lèu: '« A lèu » : à bientôt. « Lèu » veut dire « bientôt ».'
	},
	// les tuiles : les quatre mots attendus et un intrus
	tèulas: ['plan', 'deman', 'Bonjorn', 'lèu', 'Cossí']
};

/** vrai ou faux, sur une image */
export const VERTAT_FALS = {
	afirmacion: '« Adieu ! » sert aussi à dire au revoir.',
	responsa: true,
	explic: 'En occitan, « Adieu ! » sert à dire bonjour, et aussi au revoir, entre amis. À une personne qu’on vouvoie, plutôt « Bonjorn ! » en arrivant.'
};

/** choix multiple */
export const CAUSIDA = {
	question: 'Comment dit-on « à demain » ?',
	opcions: [
		{ oc: 'A lèu !', just: false, explic: '« A lèu ! », c’est « à bientôt ! ».' },
		{ oc: 'A deman !', just: true, explic: '« Deman », c’est « demain ».' },
		{ oc: 'Bon ser !', just: false, explic: '« Bon ser ! », c’est « bonsoir ! », en arrivant.' }
	]
};

/** remettre dans l'ordre : les mots d'une phrase */
export const ÒRDRE_MOTS = {
	enonciat: 'Je vais bien, merci. Et toi ?',
	responsa: ['Vau', 'plan,', 'mercés.', 'E', 'tu ?'],
	indici: 'La réponse d’abord, la question ensuite.',
	explic: '« Vau plan, mercés. E tu ? » : répondre, puis retourner la question.'
};

/** remettre dans l'ordre : les lettres d'un mot */
export const ÒRDRE_LETRAS = {
	enonciat: 'Comment écrit-on « demain » ?',
	sona: 'dé-MA',
	responsa: ['d', 'e', 'm', 'a', 'n'],
	indici: 'Le mot commence par « d » et finit par « n ».',
	explic: 'On écrit « deman » et on entend « dé-MA » : ici, le « n » de la fin ne s’entend pas.',
	letras: true
};

/** relier les paires */
export const PARELHS = [
	{ oc: 'Bon ser !', fr: 'bonsoir' },
	{ oc: 'A lèu !', fr: 'à bientôt' },
	{ oc: 'A deman !', fr: 'à demain' },
	{ oc: 'Mercés !', fr: 'merci' }
];

/** écrire la réponse */
export const ESCRIURE = {
	demanda: 'Demande à ton ami comment il va.',
	answers: ['Cossí vas ?'],
	indici: 'Deux mots. Le premier, « cossí », veut dire « comment ».',
	explic: '« Cossí vas ? » : comment vas-tu ?'
};

/** la carte de mot : penser, puis révéler */
export const CARTA_MOT = { oc: 'Al còp que ven !', fr: 'à la prochaine !', sound: 'al COP qué BÈN' };

/**
 * le texte à lire : des paragraphes en morceaux ; un morceau { mot, fr, sound }
 * se touche et donne son sens en pied d'écran
 */
export const TÈXT = {
	intro: 'Loís a laissé ce mot à Yasmine.',
	paragrafs: [
		[{ mot: 'Bonjorn', fr: 'bonjour', sound: 'boun-DJOUR' }, ', Yasmine ! ', { mot: 'Cossí vas', fr: 'comment vas-tu', sound: 'cou-si BAS' }, ' ?'],
		[{ mot: 'Vau plan', fr: 'je vais bien', sound: 'baou PLA' }, ', ', { mot: 'mercés', fr: 'merci', sound: 'mér-SÉS' }, '.'],
		[{ mot: 'A deman', fr: 'à demain', sound: 'a dé-MA' }, ' !']
	],
	signatura: 'Loís'
};

/** le bilan : le texte du module 1.1 */
export const BILANÇ = {
	intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra.',
	items: ['saluer le matin et le soir', 'demander comment ça va, et répondre', 'partir : à bientôt, à demain', 'choisir entre le « tu » et le « vous »']
};

/** l'audace : une chose à tenter dans la vraie vie (le défi du module 1.1) */
export const AUDÀCIA = {
	foto: {
		src: '/aprene/fotos/8-1-placa-800.webp',
		alt: 'Une place de ville en pierre claire, une fontaine, des terrasses de café et des passants',
		position: '50% 85%'
	},
	acquis: 'Tu sais maintenant saluer, demander comment ça va, et partir.',
	prepausa: [
		'Si tu en as envie : en partant, dis ',
		{ oc: 'A deman !' },
		' ou ',
		{ oc: 'A lèu !' },
		' à quelqu’un que tu reverras bientôt, une collègue, un voisin, ton frère. Quand ? Où ? Choisis maintenant.'
	]
};
