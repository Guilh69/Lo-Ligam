// Pluie de mots (/ensag/plueja, idée de Romain du 2026-11-04) : un moment de
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
		nom: { oc: 'Garriga', fr: 'Garrigue' },
		imatge: '/ensag/plueja/garriga.webp',
		posicion: '50% 40%',
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
		nom: { oc: 'Fenèstra', fr: 'Fenêtre' },
		imatge: '/ensag/plueja/fenestra.webp',
		posicion: '50% 52%',
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
		nom: { oc: 'Nuèch', fr: 'Nuit' },
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
	}
];
