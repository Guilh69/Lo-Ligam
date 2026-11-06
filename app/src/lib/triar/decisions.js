// Les décisions à trancher, en cartes (point d'étape du 2026-11-06 au soir,
// Romain : « pour ce qui est des décisions à arbitrer, il faut voir si c'est
// toujours pertinent, et si oui, faire un système comme Tinder pour que je
// valide ou que je valide pas »). Lot « decisions » de /admin/triar.
//
// Une carte = une proposition, avec l'avis de Claude. Cœur = Romain valide ;
// croix = il ne valide pas, avec un commentaire s'il veut. Claude lit les choix
// (`node scripts/triar.mjs`), applique les cœurs, et peut reformuler une croix :
// marquée « tractada », la carte revient en tête avec la réponse.
// Les clés ne changent jamais (elles retrouvent le choix de Romain) ; une
// nouvelle décision = une nouvelle clé. Une décision tranchée reste ici : elle
// ne revient plus dans la pile, et le compte du lot garde la trace.

const D = (clau, context, titol, tèxte, avís) => ({ clau, context: [context], titol, decision: { tèxte, avís } });

export const DECISIONS = [
	// Organisation
	D(
		'mistral-branca',
		'Organisation',
		'Mistral en soutien : il travaille à part, je relis avant la mise en ligne',
		'Quand tu lui demandes quelque chose dans le Vibe Hub, il travaille sur une copie à part du site. Je relis, puis je mets en ligne. Deux IA ne modifient jamais les mêmes fichiers en même temps.',
		'Oui : c’est le plus sûr tant que je garde la main.'
	),
	D(
		'tres-discussions',
		'Organisation',
		'Trois discussions Claude au plus en même temps sur Lo Ligam',
		'Ce soir, neuf discussions étaient ouvertes, dont trois en plein travail. Au-delà de trois, je te propose d’en finir ou d’en mettre une en pause avant d’en ouvrir une nouvelle.',
		'Oui : c’est la cause principale de l’éparpillement.'
	),
	D(
		'punt-setmana',
		'Organisation',
		'Un point d’étape chaque semaine, dans cette discussion',
		'Je remets à jour le suivi des chantiers, je range ce qui est fini, et je te passe les nouvelles décisions en cartes, comme ce soir.',
		'Oui.'
	),
	D(
		'una-sola-pila',
		'Organisation',
		'Toutes tes relectures d’occitan dans une seule pile',
		'Aujourd’hui elles sont éparpillées : fichier des doutes, listes de la carte, leçons, jeux. La pile de validation du talhièr (codée en ce moment) les rassemble : tu valides sur la page, mot par mot.',
		'Oui : je n’ouvre plus de nouvelle liste ailleurs.'
	),
	D(
		'per-tu-unic',
		'Organisation',
		'« Per tu » reste la seule porte d’entrée de ce que tu as à faire',
		'Le suivi des chantiers et ces cartes y seront reliés dès que la discussion du talhièr aura fini son lot en cours.',
		'Oui.'
	),

	// Discussions à fermer (une discussion archivée se rouvre d'un clic)
	D(
		'arch-difusion',
		'Ranger les discussions',
		'Archiver la discussion « Stratégie de diffusion du site »',
		'Son travail est en ligne et noté : textes pour les testeurs, fiche d’une page, dépliant. Une discussion archivée se rouvre d’un clic.',
		'Oui.'
	),
	D(
		'arch-remira',
		'Ranger les discussions',
		'Archiver la discussion « Interface de concentration avec mots occitans » (Remira)',
		'Remira est en ligne et ton tri des dessins est fini. Les 26 dessins refaits t’attendent dans Triar ; n’importe quelle discussion peut refaire une croix.',
		'Oui.'
	),
	D(
		'arch-anem',
		'Ranger les discussions',
		'Archiver la discussion « Espace enfants : découvrir l’occitan »',
		'Anem est en ligne. La suite attend ta voix (20 enregistrements) ; une nouvelle discussion fera les comptines.',
		'Oui.'
	),
	D(
		'arch-gramatica',
		'Ranger les discussions',
		'Archiver la discussion « Grammaire et règles occitanes »',
		'Les 36 fiches de grammaire sont en ligne ; il reste ta relecture, qui passera par la pile.',
		'Oui.'
	),
	D(
		'arch-cultura',
		'Ranger les discussions',
		'Archiver la discussion « Rubrique Cultura dans Se parla »',
		'Cultura est en ligne, plus aucune case sans photo.',
		'Oui.'
	),
	D(
		'arch-fotos',
		'Ranger les discussions',
		'Archiver la discussion « Sélection photos de paysage »',
		'Les 139 photos sont en ligne en sept thèmes ; le relief attend tes cœurs dans Triar.',
		'Oui.'
	),
	D(
		'arch-elus',
		'Ranger les discussions',
		'Mettre en pause l’outil d’interpellation des parlementaires, et archiver sa discussion',
		'Arrêté le 28-10 après une première étape (la liste des élus de la zone). Rien n’est perdu : sa copie reste gardée.',
		'Oui : pas utile avant le lancement.'
	),
	D(
		'arch-pastre',
		'Ranger les discussions',
		'Mettre en pause le livre de Louis Pastre (2 lots faits sur 8) jusqu’après le lancement',
		'Ce n’est pas le site ; on le reprendra quand le site sera ouvert.',
		'Oui, sauf si tu y tiens pour une date précise.'
	),

	// Vieux chantiers à clore ou à mettre en pause
	D(
		'clau-modul0',
		'Vieux chantiers',
		'Clore le chantier « Module 0 », bloqué depuis le 18-09',
		'Depuis le 25-10, c’est moi qui rédige les leçons : le module 0 est en ligne avec tout l’A1. Ce qui reste, ta relecture et ta voix, est suivi ailleurs.',
		'Oui.'
	),
	D(
		'clau-dicodoc',
		'Vieux chantiers',
		'Clore « une séance dicodòc sur les modules 1.1 à 1.4 »',
		'Remplacée par les questions une à une et par la pile de validation.',
		'Oui.'
	),
	D(
		'clau-direccion',
		'Vieux chantiers',
		'Clore le questionnaire de direction du site',
		'L’accueil (bloc 4) est fait avec tes corrections du 03-11. Les blocs 5 à 8 (charte, mouvement, mots, lancement) avancent déjà dans leurs propres chantiers.',
		'Oui.'
	),
	D(
		'pausa-autoformacion',
		'Vieux chantiers',
		'Mettre en pause ton carnet d’autoformation',
		'Ses pages sont vides depuis le 04-10. Il reviendra quand tu auras du temps pour toi.',
		'Oui.'
	),
	D(
		'pausa-sang-aur',
		'Vieux chantiers',
		'Mettre en pause les photos « sang e aur » (casting de personnages)',
		'Tes propres photos illustrent déjà les leçons, Cultura et Remira. Le casting reviendra avec les scènes des unités.',
		'Oui.'
	),
	D(
		'pausa-craft',
		'Vieux chantiers',
		'Mettre en pause EffectCraft et VectorCraft (les récompenses des cours)',
		'Rien à faire avant les premiers cours payants.',
		'Oui.'
	),

	// Les vraies décisions
	D(
		'rotge-carta',
		'Charte',
		'Le rouge du logo aussi sur les boutons de zoom de la carte et sur « Écouter la voix la plus proche »',
		'C’est la règle des couleurs du 23-10 : le rouge pour ce qui se clique, l’or pour mettre en valeur. La question est restée ouverte depuis.',
		'Oui, pour que la règle soit la même partout.'
	),
	D(
		'jocs-anem',
		'Jeux',
		'Prochains jeux : Anem d’abord (le corps, compter jusqu’à 10, mémoire image et son)',
		'Tiré de l’état de l’art du 06-11. Même recette que les bêtes et la maison, sans lecture, peu de risque.',
		'Oui : c’est la priorité que je recommande.'
	),
	D(
		'jocs-adultes',
		'Jeux',
		'Ensuite, pour les adultes : le mot du jour, les groupes de quatre, le défi de la semaine commun aux cours',
		'Fort effet de rendez-vous. Il faudra une règle pour présenter lh, nh et ch.',
		'Oui, après Anem.'
	),
	D(
		'fil-setmana',
		'Jeux',
		'Jamais de série à tenir : un « fil de la semaine » qui ne punit pas un jour manqué',
		'Pas de « 5 jours d’affilée » qui culpabilise, et une fin de séance douce, sur tout le site. Petit chantier, dans l’esprit sobre du site.',
		'Oui.'
	),
	D(
		'fotos-carriera',
		'Photos',
		'Prochain usage de tes photos : le jeu « L’occitan dans la rue »',
		'Les plaques et enseignes en occitan de tes photos, posées sur la carte : on les trouve, on les lit, on apprend le mot. L’autre usage possible, les scènes des unités, attend tes visuels Canva.',
		'Oui : il est faisable tout de suite.'
	),
	D(
		'lancament-a1',
		'Lancement',
		'Lancer en février avec l’A1 seul, sans attendre l’A2',
		'Tout l’A1 est déjà jouable en ligne ; il manque surtout ta relecture et ta voix.',
		'Oui.'
	),
	D(
		'gratuit-lancament',
		'Lancement',
		'Au lancement, tout le parcours en ligne est gratuit ; l’argent vient des cours en visio et de la cagnotte',
		'La question du modèle payant est ouverte depuis le 31-07. Ça la repousse au moment où il y aura des utilisateurs, sans rien fermer.',
		'Oui.'
	),
	D(
		'github-privat',
		'Lancement',
		'Rendre le dépôt GitHub privé maintenant, avant d’inviter les testeurs',
		'Ton ancien texte de Mon ligam (nom, année, villes de naissance) y est encore lisible. Deux minutes : je te dis où cliquer et je vérifie après.',
		'Oui, avant le premier envoi.'
	),
	D(
		'bastian',
		'Ménage',
		'Supprimer le compte d’essai « Bastian_proba »',
		'Il a servi le 25-10 à essayer les messages et la modération entre deux personnes. Je te redemanderai le feu vert pour la base au moment de le faire.',
		'Oui, si tu as déjà vu la page de modération.'
	),
	D(
		'quarantena',
		'Ménage',
		'Mettre à la corbeille les vieilles copies de sécurité de Lo Ligam (C:\\Users\\perie\\Lo_Ligam_quarantena)',
		'Deux copies d’octobre, d’avant le déménagement du projet ; tout est sur GitHub depuis. Corbeille seulement : c’est toi qui la vides.',
		'Oui.'
	),
	D(
		'hub-github',
		'Ménage',
		'Sauvegarder le Vibe Hub sur un dépôt GitHub privé',
		'Il n’existe que sur cet ordinateur : une panne du disque l’effacerait. Tu crées le dépôt (je te dis où cliquer), je fais le reste.',
		'Oui, sans urgence.'
	)
];
