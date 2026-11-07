// Les séries de « L'intrús », jeu de la salle Jòcs (chantier 33, séance 1,
// 07-11). Quatre mots : trois font une famille, le quatrième est l'intrus.
// D'abord placées dans l'étape « Révision du jour » des leçons de tâche (1.4
// à 8.4), elles sont passées dans Jòcs le jour même (Romain : « L'intru
// devrait être dans les Jocs et on verra après comment intégrer les jocs dans
// le parcours »). Quatre séries par unité, faites de mots déjà vus dans
// l'unité ou avant, avec des pièges voulus.
// Conception avec lo Basic (nature et sens de chaque mot) et sinonimes (un
// intrus synonyme d'un mot de la famille rendrait la série ambiguë) :
// scripts/intrus-verificar.mjs ; rien de leurs réponses n'est gardé. Occitan
// vérifié par verificar-oc.mjs, à valider par Romain en jouant.
//
// mots : les quatre pièces (l'ordre est mêlé à chaque partie) ; intrus :
// l'index de l'intrus dans mots ; familha : ce qui lie les trois autres (en
// français, comme les explications des leçons) ; choses : les cartes du
// carnet des quatre mots (pour relier un jour le jeu au parcours) ; explain :
// pourquoi l'intrus n'en est pas.

/** Les séries, par unité (1 à 8) */
export const SERIAS = {
	1: [
		{
			mots: ['A lèu !', 'A deman !', 'Bonjorn !', 'Al còp que ven !'],
			intrus: 2,
			familha: 'pour partir',
			choses: ['a-leu', 'a-deman', 'bonjorn', 'al-cop-que-ven'],
			explain: '*Bonjorn*, on le dit en arrivant.'
		},
		{
			mots: ['Cossí te dison ?', 'Cossí t’apèlas ?', 'Cossí vas ?', 'Cossí vos apelatz ?'],
			intrus: 2,
			familha: 'pour demander le nom',
			choses: ['cossi-te-dison', 'cossi-t-apelas', 'cossi-vas', 'cossi-vos-dison'],
			explain: '*Cossí vas ?* demande comment ça va.'
		},
		{
			mots: ['Adieu-siatz !', 'Cossí anatz ?', 'Adieu !', 'Cossí vos dison ?'],
			intrus: 2,
			familha: 'pour vouvoyer, ou parler à plusieurs',
			choses: ['adieu-siatz', 'cossi-anatz', 'adieu', 'cossi-vos-dison'],
			explain: '*Adieu !*, c’est entre amis.'
		},
		{
			mots: ['Soi de…', 'Demòri a…', 'M’apèli…', 'Soi d’aquí.'],
			intrus: 2,
			familha: 'le lieu : d’où je suis, où j’habite',
			choses: ['soi-de', 'demori-a', 'm-apeli', 'soi-d-aqui'],
			explain: '*M’apèli…* dit le nom.'
		}
	],
	2: [
		{
			mots: ['catalana', 'francesa', 'italian', 'espanhòla'],
			intrus: 2,
			familha: 'au féminin, en *-a*',
			choses: ['catalan-catalana', 'frances-francesa', 'italian-italiana', 'espanhol-espanhola'],
			explain: '*Italian* est au masculin ; au féminin, *italiana*.'
		},
		{
			mots: ['parli', 'compreni', 'parlas', 'demòri'],
			intrus: 2,
			familha: '« je » : la fin en *-i*',
			choses: ['parlar-singular', 'comprene-singular', 'demori-a'],
			explain: '*Parlas* : « tu parles ».'
		},
		{
			mots: ['Cossí se ditz… ?', 'Qué vòl dire… ?', 'D’ont siás ?', 'Pòdes repetir, se te plai ?'],
			intrus: 2,
			familha: 'pour se débrouiller quand on ne comprend pas',
			choses: ['cossi-se-ditz', 'que-vol-dire', 'd-ont-sias', 'podes-repetir'],
			explain: '*D’ont siás ?* demande d’où l’on est.'
		},
		{
			mots: ['ieu', 'el', 'mas', 'ela'],
			intrus: 2,
			familha: 'des personnes : moi, lui, elle',
			choses: ['ieu', 'el-ela', 'mas'],
			explain: '*Mas* veut dire « mais ».'
		}
	],
	3: [
		{
			mots: ['la maire', 'la sòrre', 'la tanta', 'la galina'],
			intrus: 3,
			familha: 'des femmes de la famille',
			choses: ['la-maire', 'la-sorre', 'oncle-tanta', 'la-galina'],
			explain: '*La galina*, c’est la poule !'
		},
		{
			mots: ['lo cat', 'lo can', 'lo caval', 'lo cosin'],
			intrus: 3,
			familha: 'des bêtes',
			choses: ['lo-cat', 'lo-can', 'lo-caval', 'cosin-cosina'],
			explain: '*Lo cosin*, c’est le cousin.'
		},
		{
			mots: ['tretze', 'catòrze', 'quinze', 'quatre'],
			intrus: 3,
			familha: '13, 14, 15',
			choses: ['nombre-13', 'nombre-14', 'nombre-15', 'nombre-4'],
			explain: '*Quatre*, c’est 4 : ne le confonds pas avec *catòrze*, 14.'
		},
		{
			mots: ['mon', 'ton', 'ma', 'la'],
			intrus: 3,
			familha: 'à qui c’est : mon, ton, ma',
			choses: ['possessius-mon-ma', 'articles-lo-la'],
			explain: '*La* est l’article : « la ».'
		}
	],
	4: [
		{
			mots: ['fornièr', 'cosinièr', 'vinhairon', 'regent'],
			intrus: 3,
			familha: 'des métiers de la table : le pain, la cuisine, le vin',
			choses: ['fornier-forniera', 'cosinier-cosiniera', 'vinhairon', 'regent-regenta'],
			explain: 'Le *regent* fait la classe.'
		},
		{
			mots: ['cantam', 'parlam', 'manjam', 'cantatz'],
			intrus: 3,
			familha: '« nous » : la fin en *-am*',
			choses: ['cantar', 'parlar-plural', 'manjar'],
			explain: '*Cantatz* : « vous chantez ».'
		},
		{
			mots: ['dimenge', 'dissabte', 'divendres', 'vendeire'],
			intrus: 3,
			familha: 'des jours de la semaine',
			choses: ['dimenge', 'dissabte', 'divendres', 'vendeire-vendeira'],
			explain: 'Le *vendeire*, c’est le vendeur, malgré *divendres* !'
		},
		{
			mots: ['infirmièra', 'estudianta', 'obrièra', 'engenhaire'],
			intrus: 3,
			familha: 'des métiers au féminin',
			choses: ['infirmier-infirmiera', 'estudiant-estudianta', 'obrier-obriera', 'engenhaire-engenhaira'],
			explain: '*Engenhaire* est au masculin, malgré son *-e* ; au féminin, *engenhaira*.'
		}
	],
	5: [
		{
			mots: ['la poma', 'la pera', 'lo rasim', 'la ceba'],
			intrus: 3,
			familha: 'des fruits',
			choses: ['la-poma', 'la-pera', 'lo-rasim', 'la-ceba'],
			explain: '*La ceba*, l’oignon, est un légume.'
		},
		{
			mots: ['lo lach', 'lo formatge', 'l’uòu', 'lo pan'],
			intrus: 3,
			familha: 'ça vient des bêtes',
			choses: ['lo-lach', 'lo-formatge', 'l-uou', 'lo-pan'],
			explain: '*Lo pan* vient du blé.'
		},
		{
			mots: ['seissanta', 'setanta', 'ochanta', 'setze'],
			intrus: 3,
			familha: '60, 70, 80',
			choses: ['nombre-60', 'nombre-70', 'nombre-80', 'nombre-16'],
			explain: '*Setze*, c’est 16.'
		},
		{
			mots: ['vòli', 'vòls', 'vòl', 'pòt'],
			intrus: 3,
			familha: 'le verbe *voler* : vouloir',
			choses: ['voler-singular', 'poder-singular'],
			explain: '*Pòt* vient de *poder* : « il ou elle peut ».'
		}
	],
	6: [
		{
			mots: ['dejunar', 'dinnar', 'sopar', 'dançar'],
			intrus: 3,
			familha: 'les repas : le matin, à midi, le soir',
			choses: ['dejunar', 'dinnar', 'sopar', 'dancar'],
			explain: '*Dançar*, c’est danser : rien à manger !'
		},
		{
			mots: ['la pluèja', 'la nèu', 'lo vent', 'lo tantòst'],
			intrus: 3,
			familha: 'le temps qu’il fait',
			choses: ['la-plueja', 'la-neu', 'fa-vent', 'lo-tantost'],
			explain: '*Lo tantòst*, c’est l’après-midi.'
		},
		{
			mots: ['e mièja', 'e quart', 'mens lo quart', 'e tu'],
			intrus: 3,
			familha: 'pour dire l’heure',
			choses: ['e-mieja', 'e-quart', 'va-plan-e-tu'],
			explain: '*E tu*, c’est « et toi ».'
		},
		{
			mots: ['me lèvi', 'te lèvas', 'se lèva', 'me dison'],
			intrus: 3,
			familha: 'le verbe se lever',
			choses: ['me-levi', 'me-dison'],
			explain: '*Me dison* : « on m’appelle ».'
		}
	],
	7: [
		{
			mots: ['la cambra', 'la sala', 'la sala de banh', 'la taula'],
			intrus: 3,
			familha: 'des pièces de la maison',
			choses: ['la-cambra', 'la-sala', 'la-sala-de-banh', 'la-taula'],
			explain: '*La taula*, la table, est un meuble.'
		},
		{
			mots: ['blanc', 'negre', 'gris', 'nòu'],
			intrus: 3,
			familha: 'des couleurs',
			choses: ['blanc-blanca', 'negre-negra', 'gris-grisa', 'nou-nova'],
			explain: '*Nòu* : neuf, ou 9 !'
		},
		{
			mots: ['jos', 'davant', 'entre', 'tanben'],
			intrus: 3,
			familha: 'pour dire où',
			choses: ['jos', 'davant', 'entre', 'tanben'],
			explain: '*Tanben* veut dire « aussi ».'
		},
		{
			mots: ['la cadièra', 'lo canapè', 'l’armari', 'lo jardin'],
			intrus: 3,
			familha: 'des meubles',
			choses: ['la-cadiera', 'lo-canape', 'l-armari', 'lo-jardin'],
			explain: '*Lo jardin* est dehors.'
		}
	],
	8: [
		{
			mots: ['un cafè', 'un tè', 'un suc de frucha', 'un veire'],
			intrus: 3,
			familha: 'à boire',
			choses: ['un-cafe', 'un-te', 'suc-de-fruta', 'un-veire-de'],
			explain: '*Un veire*, c’est le verre qui les contient.'
		},
		{
			mots: ['la gara', 'la plaça', 'la glèisa', 'la cambra'],
			intrus: 3,
			familha: 'en ville',
			choses: ['la-gara', 'la-placa', 'la-gleisa', 'la-cambra'],
			explain: '*La cambra*, la chambre, est dans la maison.'
		},
		{
			mots: ['a drecha', 'a esquèrra', 'tot drech', 'a pè'],
			intrus: 3,
			familha: 'la direction',
			choses: ['a-drecha', 'a-esquerra', 'tot-drech', 'a-pe'],
			explain: '*A pè* dit comment on y va : à pied.'
		},
		{
			mots: ['Per ieu, un tè', 'L’addicion, se vos plai', 'Ai set', 'Vira a drecha'],
			intrus: 3,
			familha: 'au café',
			choses: ['per-ieu', 'l-addicion', 'ai-set', 'vira'],
			explain: '*Vira a drecha* indique le chemin.'
		}
	]
};

/** Les unités qui ont des séries, dans l'ordre */
export const UNITATS_INTRUS = Object.keys(SERIAS).map(Number);
