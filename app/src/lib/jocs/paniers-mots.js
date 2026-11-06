// Les mots de « Los panièrs » (chantier 27 ; deuxième jeu, Romain le
// 2026-11-05 : « Oui, Los panièrs »). Un mot tombe, on le range dans le bon
// panier. Seulement des choses déjà apprises : chaque mot renvoie à
// l'encadré « À retenir » d'un module de son unité ou d'avant (`id`), et
// paniers.test.js vérifie, contre les modules eux-mêmes, que la forme
// affichée (`oc`) y figure telle quelle. `panier` : 'a', 'b', ou 'ab' quand
// les deux conviennent (*Adieu* se dit en arrivant et en partant : la
// petite surprise du premier thème, dite à la fin).
// `fr` : le sens, montré sous les paniers quand le mot est bien rangé.
// Les unités 3 à 7 apportent cinq thèmes le 2026-11-06 (« améliore encore les
// jeux ») : *lo* ou *la* (le mot sans son article), les nombres de 0 à 20,
// *el* ou *ela* (les métiers), singulier ou pluriel, et l'accord des couleurs
// avec *un ostal* ou *una pòrta* (là où le français dit « une maison »).
// Occitan passé à lo Congrès le 2026-11-05 (arribar, masculin, femenin,
// question, responsa, tèma, plen, dedins, dos) et le 2026-11-06 (totas,
// singular, plural, nombre, unitat, ostal, pòrta) ; à valider par Romain.

export const TEMAS = [
	{
		id: 'arribar',
		unitat: 1,
		nom: { oc: 'Arribar o partir', fr: 'Arriver ou partir' },
		paniers: [
			{ id: 'a', oc: 'per arribar', fr: 'pour arriver' },
			{ id: 'b', oc: 'per partir', fr: 'pour partir' }
		],
		nota: {
			oc: 'Adieu e Adieu-siatz son dins los dos panièrs : per arribar e per partir.',
			fr: 'Adieu et Adieu-siatz sont dans les deux paniers : pour arriver et pour partir.'
		},
		mots: [
			{ id: 'adieu', oc: 'Adieu !', fr: 'salut ! (bonjour et au revoir)', panier: 'ab' },
			{ id: 'bonjorn', oc: 'Bonjorn !', fr: 'bonjour !', panier: 'a' },
			{ id: 'bon-ser', oc: 'Bon ser !', fr: 'bonsoir !', panier: 'a' },
			{ id: 'encantat', oc: 'Encantat !', fr: 'enchanté !', panier: 'a' },
			{ id: 'adieu-siatz', oc: 'Adieu-siatz !', fr: 'salut ! (à plusieurs, ou en vouvoyant)', panier: 'ab' },
			{ id: 'a-leu', oc: 'A lèu !', fr: 'à bientôt !', panier: 'b' },
			{ id: 'a-deman', oc: 'A deman !', fr: 'à demain !', panier: 'b' },
			{ id: 'al-cop-que-ven', oc: 'Al còp que ven !', fr: 'à la prochaine !', panier: 'b' }
		]
	},
	{
		id: 'genre',
		unitat: 2,
		nom: { oc: 'Masculin o femenin', fr: 'Masculin ou féminin' },
		paniers: [
			{ id: 'a', oc: 'masculin', fr: 'masculin' },
			{ id: 'b', oc: 'femenin', fr: 'féminin' }
		],
		mots: [
			{ id: 'occitan-occitana', oc: 'occitan', fr: 'occitan', panier: 'a' },
			{ id: 'occitan-occitana', oc: 'occitana', fr: 'occitane', panier: 'b' },
			{ id: 'frances-francesa', oc: 'francés', fr: 'français', panier: 'a' },
			{ id: 'frances-francesa', oc: 'francesa', fr: 'française', panier: 'b' },
			{ id: 'catalan-catalana', oc: 'catalan', fr: 'catalan', panier: 'a' },
			{ id: 'espanhol-espanhola', oc: 'espanhòla', fr: 'espagnole', panier: 'b' },
			{ id: 'italian-italiana', oc: 'italian', fr: 'italien', panier: 'a' },
			{ id: 'angles-anglesa', oc: 'anglesa', fr: 'anglaise', panier: 'b' },
			{ id: 'portugues-portuguesa', oc: 'portugués', fr: 'portugais', panier: 'a' },
			{ id: 'marroquin-marroquina', oc: 'marroquina', fr: 'marocaine', panier: 'b' },
			{ id: 'argerian-argeriana', oc: 'argerian', fr: 'algérien', panier: 'a' },
			{ id: 'el-ela', oc: 'el', fr: 'lui, il', panier: 'a' },
			{ id: 'el-ela', oc: 'ela', fr: 'elle', panier: 'b' },
			{ id: 'encantat', oc: 'Encantada !', fr: 'enchantée !', panier: 'b' }
		]
	},
	{
		id: 'question',
		unitat: 2,
		nom: { oc: 'Question o responsa', fr: 'Question ou réponse' },
		paniers: [
			{ id: 'a', oc: 'question', fr: 'question' },
			{ id: 'b', oc: 'responsa', fr: 'réponse' }
		],
		mots: [
			{ id: 'cossi-vas', oc: 'Cossí vas ?', fr: 'comment vas-tu ?', panier: 'a' },
			{ id: 'vau-plan', oc: 'Vau plan, mercés !', fr: 'je vais bien, merci !', panier: 'b' },
			{ id: 'cossi-te-dison', oc: 'Cossí te dison ?', fr: 'comment t’appelles-tu ?', panier: 'a' },
			{ id: 'me-dison', oc: 'Me dison…', fr: 'je m’appelle…', panier: 'b' },
			{ id: 'd-ont-sias', oc: 'D’ont siás ?', fr: 'd’où es-tu ?', panier: 'a' },
			{ id: 'soi-de', oc: 'Soi de…', fr: 'je suis de…', panier: 'b' },
			{ id: 'ont-demoras', oc: 'Ont demòras ?', fr: 'où habites-tu ?', panier: 'a' },
			{ id: 'demori-a', oc: 'Demòri a…', fr: 'j’habite à…', panier: 'b' },
			{ id: 'parlas-occitan', oc: 'Parlas occitan ?', fr: 'parles-tu occitan ?', panier: 'a' },
			{ id: 'oc-non', oc: 'Òc !', fr: 'oui !', panier: 'b' },
			{ id: 'que-es-aquo', oc: 'Qu’es aquò ?', fr: 'qu’est-ce que c’est ?', panier: 'a' },
			{ id: 'sabi-pas', oc: 'Non sabi pas.', fr: 'je ne sais pas.', panier: 'b' },
			{ id: 'qui-es', oc: 'Qui es ?', fr: 'qui est-ce ?', panier: 'a' },
			{ id: 'soi-d-aqui', oc: 'Soi d’aquí.', fr: 'je suis d’ici.', panier: 'b' },
			{ id: 'podes-repetir', oc: 'Pòdes repetir, se te plai ?', fr: 'tu peux répéter, s’il te plaît ?', panier: 'a' },
			{ id: 'oc-non', oc: 'Non !', fr: 'non !', panier: 'b' }
		]
	},
	{
		id: 'lo-la',
		unitat: 3,
		nom: { oc: 'Lo o la', fr: 'Le ou la' },
		// le mot sans son article : c’est lui qu’on devine
		senseArticle: true,
		paniers: [
			{ id: 'a', oc: 'lo', fr: 'le' },
			{ id: 'b', oc: 'la', fr: 'la' }
		],
		mots: [
			{ id: 'lo-paire', oc: 'paire', fr: 'père', panier: 'a' },
			{ id: 'la-maire', oc: 'maire', fr: 'mère', panier: 'b' },
			{ id: 'lo-fraire', oc: 'fraire', fr: 'frère', panier: 'a' },
			{ id: 'la-sorre', oc: 'sòrre', fr: 'sœur', panier: 'b' },
			{ id: 'filh-filha', oc: 'filh', fr: 'fils', panier: 'a' },
			{ id: 'filh-filha', oc: 'filha', fr: 'fille', panier: 'b' },
			{ id: 'papeta-mameta', oc: 'papeta', fr: 'grand-père (masculin, malgré son -a)', panier: 'a' },
			{ id: 'papeta-mameta', oc: 'mameta', fr: 'grand-mère', panier: 'b' },
			{ id: 'cosin-cosina', oc: 'cosin', fr: 'cousin', panier: 'a' },
			{ id: 'oncle-tanta', oc: 'tanta', fr: 'tante', panier: 'b' },
			{ id: 'lo-can', oc: 'can', fr: 'chien', panier: 'a' },
			{ id: 'la-galina', oc: 'galina', fr: 'poule', panier: 'b' },
			{ id: 'lo-caval', oc: 'caval', fr: 'cheval', panier: 'a' },
			{ id: 'lo-cat', oc: 'cata', fr: 'chatte', panier: 'b' }
		]
	},
	{
		id: 'nombres',
		unitat: 3,
		nom: { oc: 'Los nombres', fr: 'Les nombres' },
		paniers: [
			{ id: 'a', oc: 'de 0 a 10', fr: 'de 0 à 10' },
			{ id: 'b', oc: 'de 11 a 20', fr: 'de 11 à 20' }
		],
		mots: [
			{ id: 'nombre-3', oc: 'tres', fr: '3', panier: 'a' },
			{ id: 'nombre-13', oc: 'tretze', fr: '13', panier: 'b' },
			{ id: 'nombre-4', oc: 'quatre', fr: '4', panier: 'a' },
			{ id: 'nombre-14', oc: 'catòrze', fr: '14', panier: 'b' },
			{ id: 'nombre-5', oc: 'cinc', fr: '5', panier: 'a' },
			{ id: 'nombre-15', oc: 'quinze', fr: '15', panier: 'b' },
			{ id: 'nombre-6', oc: 'sièis', fr: '6', panier: 'a' },
			{ id: 'nombre-16', oc: 'setze', fr: '16', panier: 'b' },
			{ id: 'nombre-7', oc: 'sèt', fr: '7', panier: 'a' },
			{ id: 'nombre-17', oc: 'dètz-e-sèt', fr: '17', panier: 'b' },
			{ id: 'nombre-9', oc: 'nòu', fr: '9', panier: 'a' },
			{ id: 'nombre-19', oc: 'dètz-e-nòu', fr: '19', panier: 'b' },
			{ id: 'nombre-10', oc: 'dètz', fr: '10', panier: 'a' },
			{ id: 'nombre-12', oc: 'dotze', fr: '12', panier: 'b' }
		]
	},
	{
		id: 'el-ela',
		unitat: 4,
		nom: { oc: 'El o ela', fr: 'Il ou elle' },
		paniers: [
			{ id: 'a', oc: 'el', fr: 'il' },
			{ id: 'b', oc: 'ela', fr: 'elle' }
		],
		mots: [
			{ id: 'infirmier-infirmiera', oc: 'infirmièr', fr: 'infirmier', panier: 'a' },
			{ id: 'infirmier-infirmiera', oc: 'infirmièra', fr: 'infirmière', panier: 'b' },
			{ id: 'paisan-paisana', oc: 'paisan', fr: 'paysan', panier: 'a' },
			{ id: 'paisan-paisana', oc: 'paisana', fr: 'paysanne', panier: 'b' },
			{ id: 'estudiant-estudianta', oc: 'estudiant', fr: 'étudiant', panier: 'a' },
			{ id: 'estudiant-estudianta', oc: 'estudianta', fr: 'étudiante', panier: 'b' },
			{ id: 'regent-regenta', oc: 'regent', fr: 'instituteur', panier: 'a' },
			{ id: 'regent-regenta', oc: 'regenta', fr: 'institutrice', panier: 'b' },
			{ id: 'cosinier-cosiniera', oc: 'cosinièra', fr: 'cuisinière', panier: 'b' },
			{ id: 'fornier-forniera', oc: 'fornièr', fr: 'boulanger', panier: 'a' },
			{ id: 'vendeire-vendeira', oc: 'vendeira', fr: 'vendeuse', panier: 'b' },
			{ id: 'obrier-obriera', oc: 'obrièr', fr: 'ouvrier', panier: 'a' },
			{ id: 'engenhaire-engenhaira', oc: 'engenhaira', fr: 'ingénieure', panier: 'b' },
			{ id: 'vinhairon', oc: 'vinhairon', fr: 'vigneron', panier: 'a' }
		]
	},
	{
		id: 'plural',
		unitat: 5,
		nom: { oc: 'Singular o plural', fr: 'Singulier ou pluriel' },
		paniers: [
			{ id: 'a', oc: 'singular', fr: 'singulier' },
			{ id: 'b', oc: 'plural', fr: 'pluriel' }
		],
		mots: [
			{ id: 'la-poma', oc: 'la poma', fr: 'la pomme', panier: 'a' },
			{ id: 'la-poma', oc: 'las pomas', fr: 'les pommes', panier: 'b' },
			{ id: 'l-uou', oc: 'l’uòu', fr: 'l’œuf', panier: 'a' },
			{ id: 'l-uou', oc: 'los uòus', fr: 'les œufs', panier: 'b' },
			{ id: 'la-pera', oc: 'las peras', fr: 'les poires', panier: 'b' },
			{ id: 'la-tomata', oc: 'la tomata', fr: 'la tomate', panier: 'a' },
			{ id: 'la-ceba', oc: 'las cebas', fr: 'les oignons', panier: 'b' },
			{ id: 'la-patana', oc: 'la patana', fr: 'la pomme de terre', panier: 'a' },
			{ id: 'un-quilo-de', oc: 'un quilò de…', fr: 'un kilo de…', panier: 'a' },
			{ id: 'un-quilo-de', oc: 'dos quilòs de…', fr: 'deux kilos de…', panier: 'b' },
			{ id: 'euro-centim', oc: 'un euro', fr: 'un euro', panier: 'a' },
			{ id: 'euro-centim', oc: 'dos centims', fr: 'deux centimes', panier: 'b' },
			{ id: 'frutas-legums', oc: 'la frucha', fr: 'les fruits (tous ensemble, sans -s)', panier: 'a' },
			{ id: 'frutas-legums', oc: 'los legums', fr: 'les légumes', panier: 'b' }
		]
	},
	{
		id: 'ostal-porta',
		unitat: 7,
		nom: { oc: 'Un ostal o una pòrta', fr: 'Une maison ou une porte' },
		paniers: [
			{ id: 'a', oc: 'un ostal…', fr: 'une maison…' },
			{ id: 'b', oc: 'una pòrta…', fr: 'une porte…' }
		],
		mots: [
			{ id: 'blanc-blanca', oc: 'blanc', fr: 'blanc', panier: 'a' },
			{ id: 'blanc-blanca', oc: 'blanca', fr: 'blanche', panier: 'b' },
			{ id: 'roge-roja', oc: 'roge', fr: 'rouge', panier: 'a' },
			{ id: 'roge-roja', oc: 'roja', fr: 'rouge', panier: 'b' },
			{ id: 'blau-blava', oc: 'blau', fr: 'bleu', panier: 'a' },
			{ id: 'blau-blava', oc: 'blava', fr: 'bleue', panier: 'b' },
			{ id: 'verd-verda', oc: 'verda', fr: 'verte', panier: 'b' },
			{ id: 'negre-negra', oc: 'negre', fr: 'noir', panier: 'a' },
			{ id: 'gris-grisa', oc: 'grisa', fr: 'grise', panier: 'b' },
			{ id: 'grand-granda', oc: 'grand', fr: 'grand', panier: 'a' },
			{ id: 'pichon-pichona', oc: 'pichona', fr: 'petite', panier: 'b' },
			{ id: 'vielh-vielha', oc: 'vièlh', fr: 'vieux', panier: 'a' },
			{ id: 'nou-nova', oc: 'nòva', fr: 'neuve', panier: 'b' },
			{ id: 'jaune-jauna', oc: 'jaune', fr: 'jaune', panier: 'a' }
		]
	}
];

/** Le mot convient-il au panier ? ('ab' : aux deux) */
export const bonPanier = (mot, panierId) => mot.panier.includes(panierId);

/**
 * La forme montrée sous les paniers, une fois le mot rangé : dans « Lo o la »,
 * le mot reprend son article (« lo paire »), celui qu'on vient d'apprendre
 * (Joan, 06-11). paniers.test.js vérifie qu'elle est dans l'encadré.
 */
export const formaVista = (tema, mot) =>
	tema.senseArticle && mot.panier !== 'ab' ? `${tema.paniers.find((p) => p.id === mot.panier).oc} ${mot.oc}` : mot.oc;
