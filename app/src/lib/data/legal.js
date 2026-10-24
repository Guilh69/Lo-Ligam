// ⚠ ROMAIN : C'EST LE SEUL FICHIER À COMPLÉTER POUR LES PAGES LÉGALES.
// Les champs marqués À_COMPLÉTER apparaissent tels quels sur le site tant
// qu'ils ne sont pas remplis — c'est volontaire, pour qu'on ne publie pas
// des mentions incomplètes sans s'en apercevoir.
//
// La loi française (LCEN, articles 1-1 et 19) impose de publier l'identité
// de l'éditeur et celle de l'hébergeur. Depuis le 2026-07-17, l'éditeur est
// la micro-entreprise de Romain (entrepreneur individuel, nom commercial
// Lo Ligam ; document de synthèse du Guichet unique). Pour une entreprise
// individuelle : nom et prénom avec « EI », adresse de l'entreprise,
// courriel, téléphone, numéro d'immatriculation, situation de TVA
// (fiche Service Public F37351).

export const editor = {
	// Personne physique : nom et prénom. Personne morale : raison sociale.
	nom: 'Romain Perier',
	statut: 'Entrepreneur individuel (EI), micro-entreprise · nom commercial : Lo Ligam',
	registre: 'Immatriculée au registre national des entreprises (RNE) le 17 juillet 2026',
	tva: 'TVA non applicable, art. 293 B du CGI',
	// Obligatoire et public. L'alias du site (Romain, 2026-10-24) : c'est la
	// seule adresse affichée, jamais l'adresse personnelle. Reçoit aussi le
	// formulaire de contact de Mon istòria ($lib/server/contacte.js).
	email: 'lo_ligam@proton.me',
	// Directeur de la publication : la personne responsable du contenu.
	directeurPublication: 'Romain Perier',
	siret: '107 446 056 00015',
	// ⚠ Obligatoires dès que le site vend (LCEN, Code de la consommation),
	// laissés vides par choix de Romain le 2026-10-24 : pas son domicile, pas
	// de domiciliation louée pour l'instant. À régler AVANT LE LANCEMENT
	// (PILOTATGE §1). Jamais l'adresse ni le portable personnels ici.
	adresse: 'À_COMPLÉTER_AVANT_LANCEMENT',
	telefòn: 'À_COMPLÉTER_AVANT_LANCEMENT'
};

// Hébergeur depuis le 2026-08-08 : le site a quitté Vercel (États-Unis) pour
// Scaleway (France), conformément au choix d'outils européens. Coordonnées
// relevées le 2026-08-08 sur scaleway.com/fr/mentions-legales.
export const hebergeur = {
	nom: 'SCALEWAY SAS',
	adresse: "8 rue de la Ville-l'Évêque, 75008 Paris, France",
	site: 'https://www.scaleway.com',
	// Utile au visiteur : dit où ses données transitent réellement.
	region: 'Paris (fr-par), France'
};

// La base de données et l'authentification. Sous-traitant au sens du RGPD.
export const baseDonnadas = {
	nom: 'Supabase Inc.',
	site: 'https://supabase.com',
	// Vérifié par Romain le 2026-08-09 dans le tableau de bord Supabase :
	// les données sont hébergées dans l'Union européenne.
	//
	// ⚠ Nuance à ne pas perdre : la RÉGION est européenne, la SOCIÉTÉ ne
	// l'est pas. Supabase Inc. est américaine, donc atteignable par le
	// CLOUD Act quelle que soit la localisation des serveurs. C'est dit
	// explicitement au visiteur plutôt que masqué derrière « hébergé en
	// Europe ». Migration vers un service européen étudiée le 2026-08-09 :
	// aucun candidat mûr et compatible à ce jour (voir §11 du cahier des
	// charges), à réexaminer.
	// Bilingue : cette valeur s'affiche au fil du texte, elle doit suivre la
	// langue choisie plutôt que de planter un mot français au milieu d'une
	// phrase occitane.
	region: { oc: 'Union europèa', fr: 'Union européenne' },
	societatNonEuropea: true
};

export const dataMiseAJour = '2026-10-24';
