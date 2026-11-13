// Le tableau de bord par facettes (13-11, demande de Romain : « prendre de la hauteur »).
// Une grille croisée : 6 rubriques (lignes) x 8 exigences (colonnes). Ses mots sont dans
// docs/vision/facetas-romain-2026-11-13.md. Affichée en tête de /admin/seguit.
//
// RÈGLE D'HONNÊTETÉ : une case n'est « bon », « à améliorer » ou « manque » que si le dépôt en
// garde une preuve écrite (un chantier de PILOTATGE.md, un fichier, un contrôle, le cahier §11).
// Sinon elle reste « à évaluer ». Une grille à moitié grise et vraie vaut mieux qu'une grille
// verte inventée. Les cases se remplissent à mesure que L'amic les évalue.

export const MESA_A_JORN_FACETAS = '13 novembre 2026';

/** Les états d'une case, dans l'ordre d'affichage de la légende. */
export const ESTATS_CASA = {
	bon: { nom: 'Bon', cort: 'bon' },
	melhorar: { nom: 'À améliorer', cort: 'à améliorer' },
	manca: { nom: 'Manque', cort: 'manque' },
	evaluar: { nom: 'À évaluer', cort: 'à évaluer' },
	'sens-objècte': { nom: 'Sans objet', cort: 'sans objet' }
};

/** Les états d'une rubrique. Pas de limite au nombre de rubriques « en chantier » (Romain, 13-11 : « je ne veux pas me brider ») : l'état dit où on en est, il n'interdit rien. */
export const ESTATS_RUBRICA = {
	chantier: { nom: 'En chantier', explic: 'on y travaille activement' },
	velha: { nom: 'En veille', explic: 'on entretient, on n’ajoute pas' },
	sòmi: { nom: 'En sommeil', explic: 'on n’y touche pas pour l’instant' }
};

export const MAX_EN_CHANTIER = 2;

/** Les 8 colonnes : nom complet (celui de Romain) et nom court pour la grille. */
export const EXIGENCES = [
	{ clau: 'xp', nom: 'Expérience (fluidité, beauté, détail)', cort: 'Expérience' },
	{ clau: 'tec', nom: 'Qualité technique auditable', cort: 'Technique' },
	{
		clau: 'aut',
		nom: 'Authenticité (photos réelles, phrases et vision personnelles, information sourcée)',
		cort: 'Authenticité'
	},
	{ clau: 'lan', nom: 'Langue fiable', cort: 'Langue fiable' },
	{ clau: 'acc', nom: 'Accessibilité et sobriété', cort: 'Accessibilité' },
	{ clau: 'vie', nom: 'Vie privée et sécurité', cort: 'Vie privée' },
	{ clau: 'fai', nom: 'Faisabilité (suivable par Romain seul)', cort: 'Faisabilité' },
	{ clau: 'cou', nom: 'Coût (abonnement)', cort: 'Coût' }
];

const E = (phrase = 'Pas encore regardé : rien d’écrit dans le dépôt pour en juger.') => ({
	etat: 'evaluar',
	phrase,
	preuve: ''
});
const B = (phrase, preuve) => ({ etat: 'bon', phrase, preuve });
const M = (phrase, preuve) => ({ etat: 'melhorar', phrase, preuve });
const X = (phrase, preuve) => ({ etat: 'manca', phrase, preuve });

/**
 * Les 6 lignes. `romain` : ce qui attend Romain ; `ia` : ce qui attend l'IA (séparés : l'authenticité
 * repose sur lui seul). `cases` : une par exigence.
 */
export const RUBRIQUES = [
	{
		clau: 'apren',
		nom: 'Apprentissage de la langue',
		estat: 'chantier',
		romain: [
			'Enregistrer sa voix, unité par unité (environ 770 phrases dans l’A1).',
			'Essayer le studio de voix sur son téléphone (une dizaine de phrases).',
			'Dire son lien personnel avec l’occitan : il fonde la porte d’entrée du module 0.'
		],
		ia: [
			'Relire les 38 modules sous les huit principes de la méthode, l’un après l’autre.',
			'Écrire le module 0 : trois portes (locuteurs, néolocuteurs, curieux) et la vergonha.',
			'Choisir entre les deux parcours (/apren et /aprene) et vérifier l’occitan par l’API de lo Congrès.'
		],
		cases: {
			xp: E(),
			tec: M(
				'Deux parcours existent côte à côte (/apren et /aprene) : à simplifier.',
				'PILOTATGE chantier 46 (constat du 13-11)'
			),
			aut: M(
				'Les personnages, dialogues et l’ordre du module 0 sont des ajouts de l’IA ; la voix de Romain n’est pas encore là.',
				'PILOTATGE chantier 50 ; les huit principes : docs/pedagogia/entrevista-metode.md'
			),
			lan: M(
				'38 modules écrits, aucun marqué relu ; voix : le studio est prêt, 0 phrase enregistrée sur environ 770.',
				'PILOTATGE chantiers 46 et 51'
			),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: B(
				'Le carnet vit dans le navigateur sans compte ; rien ne part sur les serveurs avant l’inscription.',
				'cahier des charges §11, décision du 2026-10-24 (carnet sans compte)'
			),
			fai: M(
				'Romain doit enregistrer environ 770 phrases seul : le travail est cadré en lots mais reste lourd.',
				'PILOTATGE chantier 51 (lots 1 à 3, unité par unité)'
			),
			cou: E()
		}
	},
	{
		clau: 'jocs',
		nom: 'Jeux',
		estat: 'velha',
		romain: ['Dire quelles affiches de la salle de jeux lui plaisent.'],
		ia: [
			'Proposer les prochains jeux selon ses cartes de décision.',
			'Réfléchir à l’intégration des jeux dans les leçons.'
		],
		cases: {
			xp: E(),
			tec: B(
				'Sept fichiers de test couvrent les jeux (serpent, paniers, pause, intrus, salle de jeux).',
				'app/src/lib/jocs/*.test.js et app/src/lib/jocs/sala/*.test.js'
			),
			aut: E(),
			lan: M(
				'« L’intrús » est vérifié par un script contre l’API de lo Congrès ; les autres jeux n’ont pas de contrôle écrit.',
				'app/scripts/intrus-verificar.mjs ; PILOTATGE chantiers 27 et 33'
			),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: B(
				'Le code des jeux n’appelle pas la base de données ; les en-têtes de sécurité du site s’appliquent.',
				'app/src/lib/jocs (aucun import de supabase) ; app/src/hooks.server.js'
			),
			fai: E(),
			cou: E()
		}
	},
	{
		clau: 'carta',
		nom: 'Cartographie',
		estat: 'velha',
		romain: [
			'Valider sur téléphone les premiers pas de la carte et ses libellés ; un essai sur iPhone.',
			'Relire le pays mentonnais ; obtenir l’accord écrit du LISN pour les voix de l’Atlas.',
			'Dire s’il garde les essais de défilement (chantiers 34 et 35).'
		],
		ia: [
			'Poursuivre l’audit de la carte (noms inconnus corrigés le 12-11).',
			'Page de l’enquête OPLO et « Lo viatge ».',
			'Mentionner la carte de l’OPLO et vérifier le droit de réutiliser celle d’Occitanica.'
		],
		cases: {
			xp: E('La carte est « très avancée » mais attend la validation de Romain sur téléphone.'),
			tec: B(
				'Audit final de la carte fait le 12-11, avec correction des noms inconnus.',
				'PILOTATGE chantier 36 ; chantier 39 (1 047 tests verts)'
			),
			aut: M(
				'Les droits de réutilisation et mentions des sources (LISN, Occitanica, OPLO) ne sont pas tous réglés.',
				'PILOTATGE point 13 de la liste de Romain, chantier 13'
			),
			lan: M(
				'Des noms de lieux inconnus ont dû être corrigés ; la relecture du pays mentonnais reste à faire.',
				'PILOTATGE chantier 36 ; revisions/2026-10-12-zona-mentonasca.md'
			),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: M(
				'La carte charge des fonds de carte et une aide à la saisie de lieux hébergés ailleurs : l’adresse IP du visiteur leur est transmise (c’est dit dans la page de confidentialité).',
				'app/svelte.config.js (img-src, connect-src) ; app/src/routes/confidencialitat/+page.svelte'
			),
			fai: E(),
			cou: E('Héberger soi-même les photos satellite (environ 6 Go) est une question ouverte, non chiffrée.')
		}
	},
	{
		clau: 'imagina',
		nom: 'S’imagina',
		estat: 'chantier',
		romain: [
			'Exécuter le SQL de l’étape 1 et fournir les premières pièces : l’outil est celui qui le stimule le plus.'
		],
		ia: [
			'Soigner l’outil et le faire réfléchir (étape 1 en ligne depuis le 12-11).',
			'Rouvrir l’accueil à S’imagina plus tard.'
		],
		cases: {
			xp: E(),
			tec: B(
				'La Constitution a ses tests : même nombre de blocs en français et en occitan, chiffres et renvois identiques, ancres.',
				'app/src/lib/constitucion/textes.test.js (11 tests)'
			),
			aut: X(
				'Les premières pièces, qui viennent de Romain, ne sont pas encore là.',
				'PILOTATGE chantier 41'
			),
			lan: M(
				'Mots clés vérifiés par l’API de lo Congrès (environ 330 lemmes, 950 formes) ; les mots ordinaires n’ont pas été relus un par un et Romain n’a pas relu.',
				'app/src/lib/constitucion/LEGIR-ME.md (sections « Comment l’occitan a été fait » et « À valider »)'
			),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: B(
				'Pages de texte : aucun appel à la base, aucune donnée de visiteur ; les en-têtes de sécurité du site s’appliquent.',
				'app/src/lib/constitucion et app/src/routes/imagina (aucun import de supabase) ; app/src/hooks.server.js'
			),
			fai: E(),
			cou: E()
		}
	},
	{
		clau: 'obras',
		nom: 'Œuvres et médias',
		estat: 'velha',
		romain: ['Rien d’urgent : Romain les juge déjà bien abouties.'],
		ia: [
			'Régler les deux doutes de vocabulaire du cinéma avec l’API de lo Congrès.',
			'Espace musique via Deezer, seulement après accord.'
		],
		cases: {
			xp: B(
				'Romain les dit « déjà bien abouties » (13-11).',
				'docs/vision/facetas-romain-2026-11-13.md'
			),
			tec: M(
				'Un seul fichier de test (16 tests) pour toute la rubrique.',
				'app/src/lib/cultura/cultura.test.js'
			),
			aut: E(),
			lan: M(
				'Deux doutes de vocabulaire du cinéma restent à trancher.',
				'app/src/lib/seguit/seguit.js, chantier « cultura »'
			),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: E(),
			fai: E(),
			cou: E()
		}
	},
	{
		clau: 'grops',
		nom: 'Groupes',
		estat: 'sòmi',
		romain: ['Décider comment la modération se ferait, avant de rouvrir le sujet.'],
		ia: ['Rien tant que la modération n’est pas réglée.'],
		cases: {
			xp: E(),
			tec: M(
				'Les règles d’accès en base sont vérifiées (54 contrôles SQL du 25 octobre), mais le code côté site n’a aucun test.',
				'supabase/verificacion-grops.sql ; app/src/lib/grops (aucun fichier de test)'
			),
			aut: E(),
			lan: E(),
			acc: M(
				'Aucun audit d’accessibilité complet ni test automatique : la déclaration du site le dit elle-même.',
				'app/src/routes/accessibilitat/+page.svelte (déclaration du 26 octobre)'
			),
			vie: B(
				'Règles d’accès par table, vérifiées en jouant visiteur, membre, personne suspendue et administrateur ; la liste des groupes est aussi contrôlée par le script de verrous.',
				'supabase/supabase-grops.sql ; supabase/verificacion-grops.sql ; app/scripts/verificar-rls.mjs'
			),
			fai: X(
				'La modération demande du temps et Romain est seul : c’est la facette la moins sûre pour lui.',
				'docs/vision/facetas-romain-2026-11-13.md'
			),
			cou: E()
		}
	}
];

/** La case d'une rubrique pour une exigence. */
export function casa(rubrica, exigence) {
	return rubrica.cases[exigence];
}

/** Combien de cases dans chaque état (toute la grille, ou une seule rubrique). */
export function comptesCases(rubriques = RUBRIQUES) {
	const n = Object.fromEntries(Object.keys(ESTATS_CASA).map((e) => [e, 0]));
	for (const r of rubriques) for (const ex of EXIGENCES) n[r.cases[ex.clau].etat]++;
	return n;
}

/** Les rubriques « en chantier ». */
export function enChantier(rubriques = RUBRIQUES) {
	return rubriques.filter((r) => r.estat === 'chantier');
}

/** Simple repère (pas une règle) : dit si le nombre de rubriques en chantier dépasse le repère. */
export function chantiersRespectes(rubriques = RUBRIQUES) {
	return enChantier(rubriques).length <= MAX_EN_CHANTIER;
}
