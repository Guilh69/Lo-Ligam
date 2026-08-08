// ⚠ ROMAIN : C'EST LE SEUL FICHIER À COMPLÉTER POUR LES PAGES LÉGALES.
// Les champs marqués À_COMPLÉTER apparaissent tels quels sur le site tant
// qu'ils ne sont pas remplis — c'est volontaire, pour qu'on ne publie pas
// des mentions incomplètes sans s'en apercevoir.
//
// La loi française (LCEN, article 6) impose de publier l'identité de
// l'éditeur et celle de l'hébergeur. Pour un particulier qui édite un site
// non professionnel, l'adresse postale peut rester chez l'hébergeur, mais
// nom, prénom et moyen de contact restent obligatoires.

export const editor = {
	// Personne physique : nom et prénom. Personne morale : raison sociale.
	nom: 'Romain Perier',
	statut: 'Particulier (site non professionnel)',
	// Obligatoire et public. Une adresse dédiée au site vaut mieux qu'une
	// adresse personnelle du quotidien.
	email: 'perier.romain@proton.me',
	// Directeur de la publication : la personne responsable du contenu.
	directeurPublication: 'Romain Perier',
	// Si un jour le projet devient une association ou une société :
	siret: 'À_COMPLÉTER_SI_STRUCTURE_JURIDIQUE',
	adresse: 'À_COMPLÉTER_SI_STRUCTURE_JURIDIQUE'
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
	// ⚠ À VÉRIFIER dans le tableau de bord Supabase (Settings → General →
	// Region). Si la région est hors Union européenne, il faut le dire
	// explicitement dans la politique de confidentialité.
	region: 'À_VÉRIFIER_DANS_SUPABASE'
};

export const dataMiseAJour = '2026-08-08';
