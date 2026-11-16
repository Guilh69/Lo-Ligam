// Les exemples des gabarits d'exercice (lot 1, 2026-11-17) : la matière du
// module 1.1 (« Cossí vas ? »), déjà passée par l'API de lo Congrès ; les mots
// des consignes et des boutons vérifiés le 2026-11-17 (escota, repetís, causís,
// tòrna, vertat, fals, òsca, encara, verificar, passar, aqueste, traduccion,
// dialòg, mot, puèi, arrèsta, ta, pausa, los, pas, bona, responsa ; « cada » et
// « lor » : l'API a planté, mots écartés). Le son est le seul enregistrement
// existant du module 1.1 : il tient lieu d'exemple en attendant le studio.

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
