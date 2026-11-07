// Les options et l'ordre de décision de chaque choix OUVERT du Laboratòri (à explorer, en
// place à valider, en comparaison). Refait le 07-11 après l'audit du code : les choix
// devenus « retenus » ou « archivés » n'ont plus d'options ici.
//
// - `apres` : les choix à trancher AVANT celui-ci (on ne choisit pas le bouton avant la
//   palette). La page en tire « À faire maintenant » : les choix qui ne sont plus
//   bloqués, classés par le nombre de choix qu'ils débloquent.
// - `options` : les voies possibles, chacune en une phrase. Pour un choix « en place »,
//   garder le site tel quel est toujours possible : les options sont les façons de CHANGER.
//   `essai` = une page d'essai existe (/ensag/…), sinon c'est une idée à essayer.
//   `source` = d'où vient l'idée (une inspiration de Romain).
// - `couleursAujourdhui` : les couleurs actuelles du site, montrées en échantillons.
// Les clés sont celles de registre.js.

const o = (titol, texte, extra = {}) => ({ titol, texte, ...extra });
const essai = (chemin) => ({ essai: chemin });

export const COMPLEMENTS = {
	// ---------- Étage 1 : fondations ----------
	'palette-claire': {
		apres: [],
		couleursAujourdhui: ['#f7f3ee', '#2a1a10', '#b53d17', '#9c5611', '#1f5f63', '#eeaf34'],
		options: [
			o(
				'Presque blanc, une seule couleur vive',
				'Un fond blanc très légèrement froid, de l’encre quasi noire, la brique du logo comme unique couleur vive ; tout le reste en gris. Piste à préciser par la session « palette-couleurs ».',
				{ source: 'Busuu' }
			),
			o(
				'Blanc, rouge de marque et jaune pâle',
				'Fond blanc, le rouge du logo pour la marque, un jaune pâle réservé aux bandeaux, du noir pour le trait et les dessins. Piste à préciser par la session « palette-couleurs ».',
				{ source: 'La Fourche' }
			),
			o(
				'Garder le Plâtre, mais moins de couleurs',
				'Le même fond plâtre, avec seulement deux couleurs vives (la brique et une seule autre) au lieu de quatre, et un secondaire qui ne se dispute pas avec le rouge.'
			)
		]
	},
	'couleurs-retour': {
		apres: ['palette-claire'],
		options: [
			o('Panneau du bas teinté', 'Un panneau qui monte du bas, fond vert très pâle (juste) ou ocre très pâle (à revoir), avec coche, mot et explication.', { source: 'Busuu' }),
			o('Vert pour juste, or foncé pour faux', 'Évite le rouge du logo, réservé à ce qui se clique. Toujours doublé d’une coche ou d’une croix et d’un mot.'),
			o('Sans couleur : coche, croix et mot', 'Tout en encre, avec une coche ou une croix dessinées. Le plus sobre et le plus sûr pour les daltoniens, mais moins « satisfaisant ».')
		]
	},
	'coins-formes': {
		apres: [],
		options: [
			o('Tout aligner sur les 10 px des pièces', 'Pièces, champs, panneaux et cartes au même rayon : un seul langage de forme.'),
			o('Garder une hiérarchie voulue', '10 px pour ce qui se touche, 6 px pour les champs, 20 px pour les grandes cartes : on le décide et on l’écrit dans la charte.'),
			o('Coins plus vifs partout', 'Rayon de 2 à 4 px, plus graphique et plus sobre ; demande de bien soigner les filets.')
		]
	},
	ombres: {
		apres: ['coins-formes'],
		options: [
			o('Deux niveaux seulement', 'Une ombre au repos, une plus longue quand ça se soulève, partout pareil (pièces, cartes, tuiles).'),
			o('Pas d’ombre au repos', 'Une ombre seulement au survol et à l’appui ; plus plat, dans l’esprit « filets fins ».')
		]
	},
	'pictos-tuiles': {
		apres: [],
		options: [
			o('Ajouter une touche d’aplat', 'Garder le trait maison et poser une tache de couleur décalée sous le dessin.', { source: 'La Fourche' }),
			o('Un trait irrégulier, comme à la main', 'Redessiner les pictos avec un tracé légèrement tremblé : une identité à nous.', { source: 'La Fourche' }),
			o('Aucun picto', 'Seulement le numéro et le titre : plus sobre, plus lisible.')
		]
	},
	'dessins-remira': {
		apres: [],
		options: [o('Continuer le tri dans Triar', 'Un dessin à la fois : cœur pour garder, croix pour refaire, avec un commentaire.')]
	},
	recompenses: {
		apres: ['couleurs-retour'],
		options: [
			o('Garder la fougasse seule', 'Et retirer la bibliothèque lottie-web et les quatre fichiers de l’essai : un site plus léger.'),
			o('Ajouter des récompenses animées de fin de module', 'Des animations légères dessinées dans EffectCraft, rejouées au clic dans l’essai.', essai('/ensag/lottie')),
			o('Un confetti léger en CSS', 'Une petite pluie de papier découpé, sans bibliothèque, dans l’esprit des pièces.')
		]
	},
	'transitions-pages': {
		apres: [],
		options: [
			o('Fondu court', 'Un fondu d’un quart de seconde ; discret et sûr.'),
			o('Glissement latéral', 'La page entre par le côté, comme dans une application ; donne l’idée d’un chemin.'),
			o('Aucune transition', 'On change de page tout de suite : le plus léger, le meilleur pour la version légère.')
		]
	},

	// ---------- Étage 2 : composants ----------
	'bouton-danger': {
		apres: ['couleurs-retour'],
		options: [
			o('Une pièce sombre dédiée', 'Une pièce en encre foncée, réservée aux actions difficiles à défaire, avec une confirmation.'),
			o('Le même geste partout', 'Le lien souligné puis « Segur ? » avec deux pièces, à la place des fenêtres natives des groupes et des idées.'),
			o('Un rouge distinct de la brique', 'Un rouge plus froid, réservé à ces actions ; demande de ne pas le confondre avec le rouge du logo.')
		]
	},
	'bouton-continuer': {
		apres: [],
		options: [
			o('Pleine largeur, collé en bas', 'Toujours au même endroit, très large, à portée du pouce.', { source: 'Busuu' }),
			o('Une seule pièce, partout pareille', 'Aligner « Contunhar » du parcours sur la pièce de papier, en Luciole, aux coins de 10 px.'),
			o('Flèche ronde à droite', 'Un bouton rond avec une flèche, très discret.')
		]
	},
	interrupteurs: {
		apres: ['couleurs-retour'],
		options: [
			o('Une seule glissière pour tout le site', 'Panneau Ambiance, rail de la carte et réglages des jeux avec le même interrupteur.'),
			o('Deux boutons Oui / Non', 'Plus lisible pour tout le monde, un peu plus lourd.'),
			o('Case à cocher dessinée au trait', 'Une coche à nous, au trait fin.')
		]
	},
	'champ-texte': {
		apres: ['coins-formes', 'couleurs-retour'],
		options: [
			o('Tout en pilule à bordure fine', 'Aligner les formulaires sur la recherche de la carte.', { source: 'La Fourche' }),
			o('Tout en coins de 6 px, étiquette au-dessus', 'Aligner la recherche sur les formulaires : le plus lisible et le plus accessible.'),
			o('Soulignement seul', 'Un champ ouvert, juste une ligne en dessous ; très épuré, moins clair pour un champ vide.')
		]
	},
	'messages-erreur': {
		apres: ['champ-texte', 'couleurs-retour'],
		options: [
			o('Sous le champ, avec icône et mot', 'Le message est juste sous le champ concerné, sans filet doré à gauche.'),
			o('Encadré en haut du formulaire', 'Un résumé de toutes les erreurs, avec des liens vers les champs.'),
			o('Bulle près du champ', 'Plus visible, mais cache le contenu sur téléphone.')
		]
	},
	selecteurs: {
		apres: ['champ-texte'],
		options: [
			o('Une règle simple', 'Des pièces visibles quand il y a peu de choix, la liste native sinon.'),
			o('Feuille qui monte du bas', 'La liste s’ouvre en bas de l’écran, à portée du pouce.')
		]
	},
	'barre-haut': {
		apres: [],
		options: [
			o('Grouper les langues', 'Un seul sélecteur de langue (Òc, Fr, globe), le thème et le profil rangés dans le menu : quatre éléments au lieu de sept ou huit.'),
			o('Logo, langue, menu', 'Le strict minimum ; tout le reste dans le menu.'),
			o('Garder les contrôles et les harmoniser', 'Même forme, même couleur, espacement régulier ; seule « Reservar un cors » ressort.')
		]
	},
	'barre-bas': {
		apres: ['barre-haut'],
		options: [
			o('Cinq onglets avec libellé', 'Icône et mot, l’onglet actif en couleur.', { source: 'Busuu' }),
			o('Trois onglets : Se parla, S’apren, Amassa', 'Les trois entrées du site, dans cet ordre, rien d’autre.', { source: 'La Fourche' }),
			o('Pas de barre du bas', 'Le menu en voile suffit ; plus léger, moins à portée du pouce.')
		]
	},
	'menu-page': {
		apres: ['barre-haut'],
		options: [
			o('Liste plein écran à gros caractères', 'Chaque entrée en grand, une par ligne, au lieu du voile latéral.'),
			o('Grille de tuiles', 'Les entrées en tuiles, comme S’apren.')
		]
	},
	'pied-page': {
		apres: ['barre-haut'],
		options: [
			o('Minimal', 'Mentions, accessibilité, contact : une ligne, sans colonnes.'),
			o('Barre discrète collée', 'Une petite barre qui reste en bas de l’écran.')
		]
	},
	'tuiles-rubriques': {
		apres: ['palette-claire', 'coins-formes', 'pictos-tuiles'],
		options: [
			o('Deux ou trois couleurs seulement', 'Fini l’arc-en-ciel de six couleurs : une couleur de marque, une seconde, du neutre.'),
			o('Titres en Luciole', 'Garder les tuiles mais écrire les titres en Luciole, pour respecter la règle « Limelight pour les gros titres ».'),
			o('Photos de paysages teintées', 'Comme la page Cultura : une photo teintée en fond, le titre dessus.'),
			o('Tuiles claires avec picto dessiné', 'Fond clair, un picto dessiné à la main, titre en Luciole.')
		]
	},
	listes: {
		apres: ['coins-formes'],
		options: [
			o('Filets seuls, petite illustration à gauche', 'Retirer la bordure et les coins de chaque ligne, ne garder qu’un filet fin entre elles.', { source: 'La Fourche' }),
			o('Cartes séparées', 'Chaque entrée dans sa carte ; plus aéré, plus long.'),
			o('Liste dense sans picto', 'Texte seul, le plus compact.')
		]
	},
	bandeaux: {
		apres: ['palette-claire', 'coins-formes'],
		options: [
			o('Un seul bandeau pâle avec illustration', 'Une phrase courte, une petite illustration, un chevron.', { source: 'La Fourche' }),
			o('Ligne d’annonce fine en haut', 'Une ligne, sans illustration.'),
			o('Aucun bandeau', 'Pas d’encart d’annonce : le plus calme.')
		]
	},

	// ---------- Étage 3 : parcours et écrans ----------
	'ecran-lecon': {
		apres: ['bouton-continuer', 'couleurs-retour'],
		options: [
			o('Une idée par écran', 'Beaucoup de blanc, une seule action, une barre fine en haut avec la croix pour quitter.', { source: 'Busuu' }),
			o('Garder le défilement, ajouter la sortie', 'Les exercices restent dévoilés un à un, mais avec la barre fine et la croix pour quitter.'),
			o('Carte qui se retourne', 'Un mot sur une face, sa réponse sur l’autre ; pour la révision.')
		]
	},
	'retour-exercice': {
		apres: ['couleurs-retour'],
		options: [
			o('Panneau qui monte du bas', 'Coche, « Correct », la réponse avec sa traduction, une explication, puis « Continuer ».', { source: 'Busuu' }),
			o('Couleur de la carte et coche', 'La carte change de teinte avec une coche ; très discret.')
		]
	},
	'progression-lecon': {
		apres: ['palette-claire'],
		options: [
			o('Barre fine en haut', 'Sans pourcentage, discrète.', { source: 'Busuu' }),
			o('Points d’étapes', 'Un point par exercice : on voit combien il en reste.'),
			o('Rien de plus', 'Garder les compteurs actuels : moins de pression.')
		]
	},
	jauges: {
		apres: ['couleurs-retour'],
		options: [
			o('Cartes qui se remplissent', 'À travailler, à revoir, acquis : trois cartes qui se remplissent à ras bord, sans jour.', { source: 'Busuu' }),
			o('Anneau avec gros pourcentage', 'Un arc de cercle et un chiffre en grand au centre.', { source: 'Busuu' }),
			o('Barres horizontales', 'Le plus simple, le plus lisible.')
		]
	},
	'parcours-unites': {
		apres: ['listes', 'couleurs-retour'],
		options: [
			o('Ajouter des vignettes de tes paysages', 'Sur les cases du plateau, un rond avec une photo, un anneau et une coche quand c’est fini.', { source: 'Busuu' }),
			o('Liste verticale à filets', 'Sobre, rapide à lire, au lieu du plateau.')
		]
	},
	connexion: {
		apres: ['champ-texte'],
		options: [
			o('Fenêtre par-dessus la page', 'On se connecte sans quitter la page où l’on était.'),
			o('L’effet de la croix', 'À l’arrivée, la croix-constellation se forme ou se referme, une seconde au plus, sans bloquer.')
		]
	},
	'premier-passage': {
		apres: ['connexion'],
		options: [
			o('Un écran de bienvenue', 'Un seul écran, puis l’accueil ; on y choisit la version légère. Un composant existe déjà mais n’est pas branché.'),
			o('Questionnaire court', 'Trois questions pour proposer un point de départ.'),
			o('Directement la carte', 'Comme aujourd’hui, sans rien ajouter.')
		]
	},
	profil: {
		apres: ['listes', 'jauges'],
		options: [
			o('Avatar rond, progrès, onglets', 'La photo, le niveau, les mots appris, trois onglets.', { source: 'Busuu' }),
			o('Rester sobre', 'Nom, niveau et nombre de mots appris, sans onglets ni amis.')
		]
	},
	soutien: {
		apres: [],
		options: [
			o('Une page, trois niveaux', 'Libre, don, solidaire, sur une même page claire.'),
			o('Un bouton discret dans le menu', 'Pas d’insistance : une entrée dans le menu.'),
			o('Une mention au bas de chaque unité', 'Un rappel doux au bon moment, après une réussite.')
		]
	},
	'documents-occitanica': {
		apres: [],
		options: [o('Vignette légère, source et lien', 'Titre, auteur, date, mention de source exigée, lien vers la fiche d’origine : 27 vignettes prêtes dans l’essai.', essai('/ensag/occitanica'))]
	}
};
