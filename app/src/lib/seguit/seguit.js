// Le suivi des chantiers, pour Romain (point d'étape du 2026-11-06 au soir :
// « tu les listes avec un tableau de suivi pour voir le niveau d'avancement »).
// Page : /admin/seguit. Le détail de chaque chantier reste dans PILOTATGE.md ;
// ici, une ligne par chantier, en français de tous les jours.
// À tenir à jour à chaque point d'étape (la discussion mère) et quand un
// chantier change d'état. L'avancement est une estimation de Claude.

export const MESA_A_JORN = '6 novembre, 23 h';

/** Les états, dans l'ordre d'affichage du résumé. */
export const ESTATS = {
	'en-cors': { nom: 'Claude y travaille', resum: 'en cours avec Claude', cort: 'En cours' },
	romain: { nom: 'T’attend', resum: 't’attendent', cort: 'À toi' },
	pausa: { nom: 'En pause', resum: 'en pause', cort: 'En pause' },
	acabat: { nom: 'Fini', resum: 'finis', cort: 'Fini' }
};

/**
 * @param {string} clau @param {string} nom @param {number} avanç @param {keyof typeof ESTATS} estat
 * @param {string} seguenta @param {string} qui @param {string | null} [ligam] @param {string | null} [discussion]
 */
const C = (clau, nom, avanç, estat, seguenta, qui, ligam = null, discussion = null) => ({
	clau,
	nom,
	avanç,
	estat,
	seguenta,
	qui,
	ligam,
	discussion
});

export const GROPS = [
	{
		nom: 'Apprendre (S’apren)',
		chantiers: [
			C('cursus', 'Le parcours A1 (les leçons)', 80, 'romain', 'Répondre aux questions d’occitan une à une, puis je fais la séance du jour.', 'Toi, puis Claude', '/aprene'),
			C('votz', 'Ta voix dans les leçons et dans Anem', 5, 'romain', 'Enregistrer le soir du 1.1, puis les 20 mots d’Anem. Le talhièr te donnera bientôt un enregistreur sur la page.', 'Toi'),
			C('gramatica', 'Les fiches de grammaire (36)', 75, 'romain', 'Les relire ; elles passeront dans la pile de validation.', 'Toi', '/apren/gramatica'),
			C('jocs', 'La salle de jeux', 45, 'en-cors', 'Dire quelles affiches te plaisent ; puis les prochains jeux, selon tes cartes de décision.', 'Toi, puis Claude', '/apren/jocs', 'Jeux classiques pour apprendre l’occitan'),
			C('anem', 'Anem, l’espace des tout-petits', 45, 'romain', 'Enregistrer les 20 mots, choisir deux ou trois comptines.', 'Toi', '/anem'),
			C('remira', 'Remira (poussière d’or et paysages)', 90, 'romain', 'Trier dans Triar les 26 dessins refaits et le relief des photos.', 'Toi', '/apren/remira'),
			C('visio', 'Cours en visio et factures', 80, 'romain', 'Remplir les réglages des factures (adresse, SIRET, IBAN) et relire leur occitan.', 'Toi', '/apren/visio'),
			C('scenas', 'Les scènes des unités', 10, 'pausa', 'Attend tes visuels Canva.', 'Toi, puis Claude')
		]
	},
	{
		nom: 'Découvrir (Se parla)',
		chantiers: [
			C('carta', 'La carte', 90, 'romain', 'Valider sur téléphone les premiers pas et les libellés ; un essai sur iPhone.', 'Toi', '/carta'),
			C('cultura', 'Cultura : musiques, cinéma, médias', 80, 'romain', 'Relire l’occitan (Editar) ; deux doutes de vocabulaire du cinéma.', 'Toi', '/cultura'),
			C('lengas', 'Le site en six langues', 90, 'romain', 'Donner la page de relecture de l’arabe à ton ami.', 'Toi'),
			C('oplo', 'Le réel Instagram sur l’enquête de 2020', 70, 'romain', 'Monter les vidéos dans Canva.', 'Toi')
		]
	},
	{
		nom: 'Ensemble (Amassa)',
		chantiers: [
			C('amassa', 'Amassa : annuaire, groupes, boîte à idées', 75, 'romain', 'Relire l’occitan (Editar).', 'Toi', '/amassa'),
			C('istoria', 'Mon ligam amb l’occitan (ton récit)', 85, 'romain', 'Relire et publier ton récit ; valider la phrase de la partie 03.', 'Toi', '/istoria')
		]
	},
	{
		nom: 'Coulisses',
		chantiers: [
			C('talhier', 'Lo talhièr, ton espace d’administration', 30, 'en-cors', 'La pile de validation (lot 4) est en cours ce soir ; puis les lots 2, 3 et 5.', 'Claude', '/admin', 'Refonte espace administrateur'),
			C('ia', 'Illustrations faites par IA et cagnotte', 50, 'en-cors', 'Relire l’occitan de la mention ; ouvrir le compte Mollie.', 'Toi, puis Claude', '/illustracions', 'Système de disclosure et financement pour illustrations IA'),
			C('hub', 'Le Vibe Hub (Mistral en soutien)', 90, 'acabat', 'Il marche ; sa sauvegarde sur GitHub est dans tes cartes.', 'Claude'),
			C('infra', 'Hébergement, courriels, sécurité', 95, 'acabat', 'Rappel : renouveler la clé des courriels avant le 25-10-2027.', 'Toi'),
			C('pastre', 'Le livre de Louis Pastre', 25, 'pausa', 'Deux lots faits sur huit ; pause proposée jusqu’au lancement.', 'Claude'),
			C('elus', 'L’outil d’interpellation des parlementaires', 15, 'pausa', 'Arrêté le 28-10 ; pause proposée.', 'Claude')
		]
	},
	{
		nom: 'Lancement (février 2027)',
		chantiers: [
			C('difusion', 'La diffusion, premier cercle : les testeurs', 40, 'romain', 'Relire le dépliant dans DesignCraft ; envoyer l’invitation aux testeurs.', 'Toi'),
			C('legal', 'Avant l’ouverture : légal et visibilité', 20, 'romain', 'Rendre le dépôt GitHub privé ; une adresse à afficher ; élargir l’activité de la micro-entreprise ; rouvrir aux moteurs de recherche en février.', 'Toi, puis Claude')
		]
	}
];

/** Tous les chantiers, à plat. */
export const CHANTIERS = GROPS.flatMap((g) => g.chantiers);

/** Combien de chantiers dans chaque état. */
export function comptes(chantiers = CHANTIERS) {
	const n = Object.fromEntries(Object.keys(ESTATS).map((e) => [e, 0]));
	for (const c of chantiers) n[c.estat]++;
	return n;
}
