// Pluie de mots (Remira, /apren/remira ; essai /ensag/plueja, idée de Romain du 2026-11-04) : un moment de
// calme où des mots occitans tombent lentement devant une image, chacun avec
// sa définition qui s'écrit en petit. Les mots sont liés à l'image de fond.
//
// Chaque mot a été passé à l'API de lo Congrès (verificar-oc.mjs, variété
// languedocienne) le 2026-11-04 ; formes retenues d'après lo Basic quand il
// en proposait une (pluèja, ferigola, romanin, liuç, rosal, pena…).
// Reste à relire par Romain avant de quitter l'essai : sens et définitions.
//
// Les définitions sont en français (repli de tria() pour les autres langues).
// Pas de tirets longs, une ligne courte, ton de dictionnaire avec une touche.

export const SCENAS = [
	{
		id: 'garriga',
		grop: 'poesia',
		nom: { oc: 'Garriga', fr: 'Garrigue', es: 'Garriga', en: 'Garrigue', ca: 'Garriga', ar: 'Garriga' },
		imatge: '/ensag/plueja/garriga.webp',
		posicion: '50% 40%',
		teinta: '#8a7aa8', // lavande : la lueur du ciel calme
		mots: [
			['pluèja', 'la pluie'],
			['plòu', 'il pleut'],
			['plovina', 'la bruine, qui mouille sans bruit'],
			['aigaci', 'l’averse, la grosse pluie soudaine'],
			['auratge', 'l’orage'],
			['tron', 'le tonnerre'],
			['liuç', 'l’éclair'],
			['nívol', 'le nuage'],
			['gota', 'la goutte'],
			['gotejar', 'tomber goutte à goutte'],
			['sompet', 'la flaque d’eau'],
			['garriga', 'la végétation basse de chênes kermès et de thym, sur le calcaire'],
			['garric', 'le chêne kermès, qui a donné son nom à la garrigue'],
			['euse', 'le chêne vert'],
			['ferigola', 'le thym'],
			['romanin', 'le romarin'],
			['espic', 'la lavande aspic'],
			['cigala', 'la cigale, qui se tait quand il pleut'],
			['cagaraula', 'l’escargot, qui sort après la pluie'],
			['granhòta', 'la grenouille'],
			['sentor', 'la senteur, l’odeur de la terre mouillée'],
			['tèrra', 'la terre'],
			['fuèlha', 'la feuille'],
			['rosal', 'la rosée'],
			['font', 'la source, la fontaine'],
			['marin', 'le vent de la mer, qui amène la pluie'],
			['arcolan', 'l’arc-en-ciel'],
			['camin', 'le chemin']
		]
	},
	{
		id: 'fenestra',
		grop: 'poesia',
		nom: { oc: 'Fenèstra', fr: 'Fenêtre', es: 'Ventana', en: 'Window', ca: 'Finestra', ar: 'النافذة' },
		imatge: '/ensag/plueja/fenestra.webp',
		posicion: '50% 52%',
		teinta: '#6f8f9a', // pierre grise
		mots: [
			['fenèstra', 'la fenêtre'],
			['pèira', 'la pierre'],
			['castèl', 'le château'],
			['muralha', 'la muraille, le rempart'],
			['pena', 'la falaise'],
			['ròc', 'le rocher'],
			['cèl', 'le ciel'],
			['lum', 'la lumière'],
			['ombra', 'l’ombre'],
			['comba', 'la combe, le vallon encaissé'],
			['bòsc', 'le bois, la forêt'],
			['orizont', 'l’horizon'],
			['luènh', 'loin'],
			['aucèl', 'l’oiseau'],
			['agla', 'l’aigle'],
			['vent', 'le vent'],
			['nívol', 'le nuage'],
			['silenci', 'le silence'],
			['temps', 'le temps, celui qui passe et celui qu’il fait'],
			['trevar', 'fréquenter un lieu, le hanter']
		]
	},
	{
		id: 'nuech',
		grop: 'poesia',
		nom: { oc: 'Nuèch', fr: 'Nuit', es: 'Noche', en: 'Night', ca: 'Nit', ar: 'الليل' },
		imatge: null,
		mots: [
			['nuèch', 'la nuit'],
			['vesprada', 'la soirée'],
			['luna', 'la lune'],
			['estèla', 'l’étoile'],
			['escur', 'sombre, obscur'],
			['ombra', 'l’ombre'],
			['lampa', 'la lampe'],
			['velhar', 'veiller, rester éveillé'],
			['sòm', 'le sommeil'],
			['pantais', 'le rêve'],
			['repaus', 'le repos'],
			['silenci', 'le silence'],
			['chòt', 'la chouette, le hibou'],
			['grilh', 'le grillon'],
			['cat', 'le chat']
		]
	},

	// ── Les huit unités de l'A1 (choix de Romain, 2026-11-04) ─────────────
	// Seulement des mots déjà appris dans les leçons, avec la forme et le
	// sens qu'elles leur donnent (blocs « À retenir » des modules, relevés le
	// 2026-11-04). On choisit l'unité qu'on a faite : la pluie devient une
	// révision calme. Photos de Romain (sa sélection du 2026-11-05, dossier
	// design-stock/Fotos/Bases_foto, hors Git) : 1280 px, WebP, sans GPS ni
	// autre métadonnée, de 45 à 135 Ko. Depuis le 2026-11-05 au soir, la photo
	// est un choix (« Fons : Fòto ») : le fond par défaut est un ciel calme, et
	// la teinte (teinta) y fait la lueur de l'horizon, une couleur par ambiance
	// (Romain : « des fonds calmes, parce que les photos, ça crée du bruit »).
	//
	// Une seule source, les leçons (consolidation du 2026-11-05, Romain) :
	// chaque mot est [forme montrée, définition, id de la chose apprise]. L'id
	// renvoie à une ligne d'un encadré « À retenir » de l'unité, et le test
	// scenas.test.js vérifie, contre les modules eux-mêmes, que l'id existe dans
	// cette unité et que la forme montrée y figure. Si une leçon change, le test
	// le signale. C'est aussi par l'id que le thème « carnet » retrouve les mots
	// que l'élève a appris. La page n'importe que ce petit fichier, pas les
	// leçons (1 Mo).
	{
		id: 'u1',
		grop: 'unitat',
		numero: 1,
		nom: { oc: 'Adieu !', fr: 'Salut !', es: '¡Hola!', en: 'Hi!', ca: 'Salut!', ar: 'مرحبًا!' },
		imatge: '/ensag/plueja/u1.webp',
		posicion: '50% 55%',
		teinta: '#c98a3a',
		mots: [
			['Adieu !', 'salut ! pour dire bonjour, et aussi au revoir', 'adieu'],
			['Adieu-siatz !', 'salut ! à plusieurs, ou en vouvoyant', 'adieu-siatz'],
			['Bonjorn !', 'bonjour !', 'bonjorn'],
			['Bon ser !', 'bonsoir !', 'bon-ser'],
			['Cossí vas ?', 'comment vas-tu ?', 'cossi-vas'],
			['Cossí anatz ?', 'comment allez-vous ?', 'cossi-anatz'],
			['Vau plan, mercés !', 'je vais bien, merci !', 'vau-plan'],
			['Plan mercés !', 'merci beaucoup !', 'merce'],
			['A lèu !', 'à bientôt !', 'a-leu'],
			['A deman !', 'à demain !', 'a-deman'],
			['Al còp que ven !', 'à la prochaine !', 'al-cop-que-ven'],
			['Cossí te dison ?', 'comment t’appelles-tu ? mot à mot : comment te dit-on ?', 'cossi-te-dison'],
			['M’apèli…', 'je m’appelle…', 'm-apeli'],
			['Encantat !', 'enchanté !', 'encantat'],
			['Encantada !', 'enchantée !', 'encantat'],
			['D’ont siás ?', 'd’où es-tu ?', 'd-ont-sias'],
			['Soi d’aquí.', 'je suis d’ici.', 'soi-d-aqui'],
			['Ont demòras ?', 'où habites-tu ?', 'ont-demoras'],
			['lo vilatge', 'le village', 'vilatge-vila-pais'],
			['la vila', 'la ville', 'vilatge-vila-pais'],
			['lo país', 'le pays', 'vilatge-vila-pais'],
			['Tolosa', 'Toulouse', 'noms-vilas'],
			['Montpelhièr', 'Montpellier', 'noms-vilas'],
			['Besièrs', 'Béziers', 'noms-vilas'],
			['Carcassona', 'Carcassonne', 'noms-vilas']
		]
	},
	{
		id: 'u2',
		grop: 'unitat',
		numero: 2,
		nom: { oc: 'Parlas occitan ?', fr: 'Parles-tu occitan ?', es: '¿Hablas occitano?', en: 'Do you speak Occitan?', ca: 'Parles occità?', ar: 'هل تتحدث الأوكسيتانية؟' },
		imatge: '/ensag/plueja/u2.webp',
		posicion: '35% 45%',
		teinta: '#3f8a8c',
		mots: [
			['Parlas occitan ?', 'parles-tu occitan ?', 'parlas-occitan'],
			['Òc !', 'oui !', 'oc-non'],
			['Non !', 'non !', 'oc-non'],
			['la lenga', 'la langue', 'la-lenga'],
			['occitan', 'occitan ; au féminin, occitana', 'occitan-occitana'],
			['francesa', 'française ; au masculin, francés', 'frances-francesa'],
			['catalan', 'catalan ; au féminin, catalana', 'catalan-catalana'],
			['espanhòla', 'espagnole ; au masculin, espanhòl', 'espanhol-espanhola'],
			['italian', 'italien ; au féminin, italiana', 'italian-italiana'],
			['anglesa', 'anglaise ; au masculin, anglés', 'angles-anglesa'],
			['portugués', 'portugais ; au féminin, portuguesa', 'portugues-portuguesa'],
			['marroquina', 'marocaine ; au masculin, marroquin', 'marroquin-marroquina'],
			['argerian', 'algérien ; au féminin, argeriana', 'argerian-argeriana'],
			['Parli un pauc.', 'je parle un peu.', 'un-pauc-plan'],
			['Compreni plan.', 'je comprends bien.', 'un-pauc-plan'],
			['tanben', 'aussi', 'tanben'],
			['mas', 'mais', 'mas'],
			['Qu’es aquò ?', 'qu’est-ce que c’est ?', 'que-es-aquo'],
			['Qui es ?', 'qui est-ce ?', 'qui-es'],
			['Qué vòl dire… ?', 'que veut dire… ?', 'que-vol-dire'],
			['Cossí se ditz… ?', 'comment dit-on… ?', 'cossi-se-ditz'],
			['Pòdes repetir, se te plai ?', 'tu peux répéter, s’il te plaît ?', 'podes-repetir'],
			['Non sabi pas.', 'je ne sais pas.', 'sabi-pas']
		]
	},
	{
		id: 'u3',
		grop: 'unitat',
		numero: 3,
		nom: { oc: 'La familha', fr: 'La famille', es: 'La familia', en: 'The family', ca: 'La família', ar: 'العائلة' },
		imatge: '/ensag/plueja/u3.webp',
		posicion: '50% 60%',
		teinta: '#b0583c',
		mots: [
			['la familha', 'la famille', 'la-familha'],
			['lo paire', 'le père', 'lo-paire'],
			['la maire', 'la mère', 'la-maire'],
			['lo fraire', 'le frère', 'lo-fraire'],
			['la sòrre', 'la sœur', 'la-sorre'],
			['lo filh', 'le fils', 'filh-filha'],
			['la filha', 'la fille', 'filh-filha'],
			['lo papeta', 'le grand-père', 'papeta-mameta'],
			['la mameta', 'la grand-mère', 'papeta-mameta'],
			['l’oncle', 'l’oncle', 'oncle-tanta'],
			['la tanta', 'la tante', 'oncle-tanta'],
			['lo cosin', 'le cousin', 'cosin-cosina'],
			['la cosina', 'la cousine', 'cosin-cosina'],
			['los dròlles', 'les enfants', 'drolle-drolla'],
			['la companha', 'la compagne', 'companh-companha'],
			['Quant as d’ans ?', 'quel âge as-tu ? mot à mot : combien as-tu d’ans ?', 'quant-as-d-ans'],
			// Romain (05-11) : poule et cheval n'ont rien à faire dans la famille.
			// On garde le chien et le chat, les bêtes de la maison ; les nombres,
			// l'oiseau, le cheval et la poule (leçons 3.1 et 3.3) sont retirés.
			['lo can', 'le chien de la maison', 'lo-can'],
			['lo cat', 'le chat de la maison', 'lo-cat']
		]
	},
	{
		id: 'u4',
		grop: 'unitat',
		numero: 4,
		nom: { oc: 'Qué fas ?', fr: 'Que fais-tu ?', es: '¿Qué haces?', en: 'What are you doing?', ca: 'Què fas?', ar: 'ماذا تفعل؟' },
		imatge: '/ensag/plueja/u4.webp',
		posicion: '50% 60%',
		teinta: '#7d8a3c',
		mots: [
			['Qué fas ?', 'que fais-tu ?', 'que-fas'],
			['Qué fas dins la vida ?', 'que fais-tu dans la vie ?', 'que-fas-dins-la-vida'],
			['trabalhar', 'travailler', 'trabalhar'],
			['cantar', 'chanter', 'cantar'],
			['dançar', 'danser', 'dancar'],
			['caminar', 'marcher', 'caminar'],
			['escotar', 'écouter', 'escotar'],
			['cosinar', 'cuisiner', 'cosinar'],
			['manjar', 'manger', 'manjar'],
			['jogar', 'jouer', 'jogar'],
			['regent', 'instituteur ; au féminin, regenta', 'regent-regenta'],
			['infirmièra', 'infirmière ; au masculin, infirmièr', 'infirmier-infirmiera'],
			['paisan', 'paysan ; au féminin, paisana', 'paisan-paisana'],
			['fornièra', 'boulangère ; au masculin, fornièr', 'fornier-forniera'],
			['vinhairon', 'vigneron', 'vinhairon'],
			['mètge', 'médecin', 'metge'],
			['Soi a la retirada.', 'je suis à la retraite.', 'a-la-retirada'],
			['la setmana', 'la semaine', 'la-setmana'],
			['diluns', 'lundi', 'diluns'],
			['dimars', 'mardi', 'dimars'],
			['dimècres', 'mercredi', 'dimecres'],
			['dijòus', 'jeudi', 'dijous'],
			['divendres', 'vendredi', 'divendres'],
			['dissabte', 'samedi', 'dissabte'],
			['dimenge', 'dimanche', 'dimenge'],
			['amb', 'avec', 'amb'],
			['l’amiga', 'l’amie', 'amic-amiga'],
			['los amics', 'les amis', 'amic-amiga'],
			// les métiers de la leçon 4.3, ajoutés le 05-11 (consolidation)
			['engenhaire · engenhaira', 'ingénieur · ingénieure', 'engenhaire-engenhaira'],
			['estudiant · estudianta', 'étudiant · étudiante', 'estudiant-estudianta'],
			['cosinièr · cosinièra', 'cuisinier · cuisinière', 'cosinier-cosiniera'],
			['vendeire · vendeira', 'vendeur · vendeuse', 'vendeire-vendeira'],
			['obrièr · obrièra', 'ouvrier · ouvrière', 'obrier-obriera']
		]
	},
	{
		id: 'u5',
		grop: 'unitat',
		numero: 5,
		nom: { oc: 'Al mercat', fr: 'Au marché', es: 'En el mercado', en: 'At the market', ca: 'Al mercat', ar: 'في السوق' },
		imatge: '/ensag/plueja/u5.webp',
		posicion: '50% 55%',
		teinta: '#c9733a',
		mots: [
			['lo mercat', 'le marché', 'al-mercat'],
			['la poma', 'la pomme', 'la-poma'],
			['la pera', 'la poire', 'la-pera'],
			['l’uòu', 'l’œuf', 'l-uou'],
			['la tomata', 'la tomate', 'la-tomata'],
			['la ceba', 'l’oignon', 'la-ceba'],
			['la patana', 'la pomme de terre', 'la-patana'],
			['l’alh', 'l’ail', 'l-alh'],
			['la salada', 'la salade', 'la-salada'],
			['lo pan', 'le pain', 'lo-pan'],
			['lo formatge', 'le fromage', 'lo-formatge'],
			['lo vin', 'le vin', 'lo-vin'],
			['lo lach', 'le lait', 'lo-lach'],
			['lo rasim', 'le raisin', 'lo-rasim'],
			['las olivas', 'les olives', 'l-oliva'],
			['la frucha', 'les fruits, tous ensemble', 'frutas-legums'],
			['los legums', 'les légumes', 'frutas-legums'],
			['un quilò de…', 'un kilo de…', 'un-quilo-de'],
			['Quant còsta ?', 'combien ça coûte ?', 'quant-costa'],
			['Vaquí !', 'voilà ! en tendant quelque chose', 'vaqui'],
			['Volriái…', 'je voudrais…', 'volriai'],
			['Se vos plai.', 's’il vous plaît.', 'se-vos-plai'],
			['M’agrada…', 'j’aime…', 'm-agrada'],
			['Quicòm mai ?', 'autre chose ?', 'quicom-mai'],
			['Es tot.', 'c’est tout.', 'quicom-mai'],
			['De res.', 'de rien.', 'de-res']
		]
	},
	{
		id: 'u6',
		grop: 'unitat',
		numero: 6,
		nom: { oc: 'La jornada', fr: 'La journée', es: 'El día', en: 'The day', ca: 'El dia', ar: 'اليوم' },
		imatge: '/ensag/plueja/u6.webp',
		posicion: '50% 58%',
		teinta: '#5a7fa8',
		mots: [
			['la jornada', 'la journée', 'la-jornada'],
			['lo matin', 'le matin', 'lo-matin'],
			['miègjorn', 'midi', 'miegjorn'],
			['lo tantòst', 'l’après-midi', 'lo-tantost'],
			['lo ser', 'le soir', 'lo-ser'],
			['mièjanuèch', 'minuit', 'miegjorn'],
			['Quina ora es ?', 'quelle heure est-il ?', 'quina-ora-es'],
			['ara', 'maintenant', 'ara'],
			['uèi', 'aujourd’hui', 'uei'],
			['puèi', 'puis, ensuite', 'puei'],
			['totjorn', 'toujours', 'totjorn'],
			['Me lèvi.', 'je me lève.', 'me-levi'],
			['dejunar', 'prendre le petit déjeuner', 'dejunar'],
			['dinnar', 'déjeuner, le repas de midi', 'dinnar'],
			['sopar', 'dîner, le repas du soir', 'sopar'],
			['Vau al lièch.', 'je vais au lit.', 'vau-al-liech'],
			['Quin temps fa ?', 'quel temps fait-il ?', 'quin-temps-fa'],
			['Fa bèl.', 'il fait beau.', 'fa-bel'],
			['Fa solelh.', 'il y a du soleil.', 'fa-solelh'],
			['Plòu.', 'il pleut.', 'plou'],
			['la pluèja', 'la pluie', 'la-plueja'],
			['Fa vent.', 'il y a du vent.', 'fa-vent'],
			['Fa freg.', 'il fait froid.', 'fa-freg'],
			['Fa caud.', 'il fait chaud.', 'fa-caud'],
			['Nèva.', 'il neige.', 'neva'],
			['la nèu', 'la neige', 'la-neu']
		]
	},
	{
		id: 'u7',
		grop: 'unitat',
		numero: 7,
		nom: { oc: 'L’ostal', fr: 'La maison', es: 'La casa', en: 'The house', ca: 'La casa', ar: 'البيت' },
		imatge: '/ensag/plueja/u7.webp',
		posicion: '50% 50%',
		teinta: '#9a6644',
		mots: [
			['l’ostal', 'la maison, et ceux qui y vivent', 'l-ostal'],
			['la cosina', 'la cuisine, le même mot que la cousine', 'la-cosina'],
			['la cambra', 'la chambre', 'la-cambra'],
			['la sala', 'la salle, le séjour', 'la-sala'],
			['la sala de banh', 'la salle de bain', 'la-sala-de-banh'],
			['lo jardin', 'le jardin', 'lo-jardin'],
			['la taula', 'la table', 'la-taula'],
			['la cadièra', 'la chaise', 'la-cadiera'],
			['lo canapè', 'le canapé', 'lo-canape'],
			['l’armari', 'l’armoire', 'l-armari'],
			['la pòrta', 'la porte', 'la-porta'],
			['la fenèstra', 'la fenêtre', 'la-fenestra'],
			['sus', 'sur', 'sus-sul'],
			['jos', 'sous', 'jos'],
			['davant', 'devant', 'davant'],
			['darrièr', 'derrière', 'darrier'],
			['la color', 'la couleur', 'la-color'],
			['roge', 'rouge', 'roge-roja'],
			['blava', 'bleue ; au masculin, blau', 'blau-blava'],
			['verd', 'vert ; au féminin, verda', 'verd-verda'],
			['jaune', 'jaune ; au féminin, jauna', 'jaune-jauna'],
			['negra', 'noire ; au masculin, negre', 'negre-negra'],
			['blanc', 'blanc ; au féminin, blanca', 'blanc-blanca'],
			['gris', 'gris ; au féminin, grisa', 'gris-grisa'],
			['pichona', 'petite ; au masculin, pichon', 'pichon-pichona'],
			['grand', 'grand ; au féminin, granda', 'grand-granda'],
			['vièlh', 'vieux ; au féminin, vièlha', 'vielh-vielha'],
			['nòu', 'neuf, nouveau ; comme le nombre 9', 'nou-nova']
		]
	},
	{
		id: 'u8',
		grop: 'unitat',
		numero: 8,
		nom: { oc: 'En vila', fr: 'En ville', es: 'En la ciudad', en: 'In town', ca: 'A la ciutat', ar: 'في المدينة' },
		imatge: '/ensag/plueja/u8.webp',
		posicion: '50% 50%', // ruelle de l'Écusson, Montpellier (photo de Romain, choisie le 06-11)
		teinta: '#7a8494',
		mots: [
			['la gara', 'la gare', 'la-gara'],
			['la carrièra', 'la rue', 'la-carriera'],
			['la plaça', 'la place', 'la-placa'],
			['la glèisa', 'l’église', 'la-gleisa'],
			['Perdon…', 'pardon, excuse-moi…', 'perdon'],
			['Es luènh ?', 'c’est loin ?', 'es-luenh'],
			['Es prèp.', 'c’est près.', 'es-luenh'],
			['tot drech', 'tout droit', 'tot-drech'],
			['a drecha', 'à droite', 'a-drecha'],
			['a esquèrra', 'à gauche', 'a-esquerra'],
			['a pè', 'à pied', 'a-pe'],
			['Vira a drecha !', 'tourne à droite !', 'vira'],
			['Pren la carrièra…', 'prends la rue…', 'pren'],
			['Cossí i vau ?', 'comment j’y vais ?', 'cossi-i-vau'],
			['lo cafè', 'le café, la boisson et aussi le lieu', 'un-cafe'],
			['un tè', 'un thé', 'un-te'],
			['l’aiga', 'l’eau', 'l-aiga'],
			['un suc de frucha', 'un jus de fruit', 'suc-de-fruta'],
			['un veire d’aiga', 'un verre d’eau', 'un-veire-de'],
			['Ai set.', 'j’ai soif.', 'ai-set'],
			['Per ieu…', 'pour moi… pour commander', 'per-ieu'],
			['L’addicion, se vos plai.', 'l’addition, s’il vous plaît.', 'l-addicion']
		]
	}
];

/** Les deux familles d'ambiances, dans l'ordre du menu. */
export const GROPS = [
	{ id: 'unitat', nom: { oc: 'Las unitats de l’A1', fr: 'Les unités de l’A1', es: 'Las unidades del A1', en: 'The A1 units', ca: 'Les unitats de l’A1', ar: 'وحدات المستوى A1' } },
	{ id: 'poesia', nom: { oc: 'Poesia', fr: 'Poésie', es: 'Poesía', en: 'Poetry', ca: 'Poesia', ar: 'الشعر' } }
];

/** L'ambiance « Tos mots » (05-11) : les mots du carnet de l'élève. Ses mots
 *  ne sont pas écrits ici : la page les tire du carnet quand on la choisit. */
export const QUASERNET = {
	id: 'quasernet',
	grop: 'quasernet',
	nom: { oc: 'Tos mots', fr: 'Tes mots', es: 'Tus palabras', en: 'Your words', ca: 'Les teves paraules', ar: 'كلماتك' }, // lo Congrès : tos, mot (05-11)
	imatge: null,
	teinta: '#b08d3e'
};

/** Les mots des unités dont l'élève a ouvert une carte dans son carnet,
 *  ceux à revoir d'abord, chaque forme une seule fois.
 *  cartes : carnet.cartes ; dues : ids de cartes à revoir (aRevoir, regles.js). */
export function motsDelQuasernet(cartes, dues = []) {
	const chose = (idCarte) => idCarte.slice(0, idCarte.lastIndexOf(':'));
	const ouvertes = new Set(Object.keys(cartes ?? {}).map(chose));
	const aRevoir = new Set(dues.map(chose));
	const vus = new Set();
	const dAbord = [];
	const ensuite = [];
	for (const s of SCENAS) {
		if (s.grop !== 'unitat') continue;
		for (const m of s.mots) {
			if (!ouvertes.has(m[2]) || vus.has(m[0])) continue;
			vus.add(m[0]);
			(aRevoir.has(m[2]) ? dAbord : ensuite).push(m);
		}
	}
	return [...dAbord, ...ensuite];
}
