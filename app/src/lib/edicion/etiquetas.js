// Les éléments modifiables, dits en mots pour Romain (édition sur place,
// 2026-10-24) : le panneau montre « La phrase sous le titre », pas la clé
// technique `acuelh.eros.frasa` (qui reste au survol). Les cartes ajoutées
// par Romain ont une clé inventée : on les reconnaît à leur fin.
const ETIQUETAS = [
	['acuelh.eros.kicker', 'Lo pichon mot sus lo títol', 'Le petit mot au-dessus du titre'],
	['acuelh.eros.titol.1', 'Títol, linha 1', 'Titre, ligne 1'],
	['acuelh.eros.titol.2', 'Títol, linha 2', 'Titre, ligne 2'],
	['acuelh.eros.titol.3', 'Títol, linha 3', 'Titre, ligne 3'],
	['acuelh.eros.frasa', 'La frasa jos lo títol', 'La phrase sous le titre'],
	['acuelh.eros.indici', 'L’indici (passa la mirga)', 'L’indice (survole les mots)'],
	['acuelh.eros.carta', 'Boton « Dobrir la carta »', 'Bouton « Ouvrir la carte »'],
	['acuelh.eros.aprene', 'Ligam « Aprene l’occitan »', 'Lien « Apprendre l’occitan »'],
	['acuelh.bandel.font', 'La font de la lista de mots', 'La source du bandeau de mots'],
	['acuelh.manifest.titol', 'Títol « Qu’es aquò »', 'Titre « Qu’es aquò »'],
	['acuelh.manifest.tèxt', 'Lo manifèst', 'Le manifeste'],
	['acuelh.manifest.retrat', 'La fòto de Romain', 'La photo de Romain'],
	['acuelh.manifest.legenda', 'La legenda de la fòto', 'La légende de la photo'],
	['acuelh.sec.parla.titol', 'Títol de la rubrica 01', 'Titre de la rubrique 01'],
	['acuelh.parla.carta', 'Boton « Dobrir la carta entièra »', 'Bouton « Ouvrir la carte entière »'],
	['acuelh.sec.apren.titol', 'Títol de la rubrica 02', 'Titre de la rubrique 02'],
	['acuelh.lengas.legenda', 'Legenda « Aprene dempuèi »', 'Légende « Apprendre depuis »'],
	['acuelh.sec.viu.titol', 'Títol de la rubrica 03', 'Titre de la rubrique 03'],
	['acuelh.viure.comunautat.nom', 'Nom de la carta « Comunautat »', 'Nom de la carte « Communauté »'],
	['acuelh.viure.comunautat.sota', 'Segonda linha de la carta « Comunautat »', 'Sous-titre de la carte « Communauté »'],
	['acuelh.trobador.fenestra', 'La fenèstra de l’Erau (imatge)', 'La fenêtre de l’Hérault (image)'],
	['acuelh.trobador.vers.1', 'Vèrs 1 de Max Roqueta', 'Vers 1 de Max Rouquette'],
	['acuelh.trobador.vers.2', 'Vèrs 2 de Max Roqueta', 'Vers 2 de Max Rouquette'],
	['acuelh.trobador.cita', 'La font de la citacion', 'La source de la citation'],
	['acuelh.crida.titol.1', 'Crida, linha 1', 'Appel, ligne 1'],
	['acuelh.crida.titol.2', 'Crida, linha 2', 'Appel, ligne 2'],
	['acuelh.crida.sota', 'La frasa de la crida', 'La phrase de l’appel'],
	['acuelh.crida.reservar', 'Boton « Reservar un cors »', 'Bouton « Réserver un cours »'],
	['acuelh.crida.sol', 'Ligam « Començar sol·a »', 'Lien « Commencer seul·e »']
];
const PER_FIN = [
	[/^acuelh\.bandel\.[^.]+$/, 'Un mot de la lista', 'Un mot du bandeau'],
	[/^acuelh\.parla\.ligams\.[^.]+$/, 'Un ligam de la rubrica 01', 'Un lien de la rubrique 01'],
	[/^acuelh\.viure\.comunautat\.items\.[^.]+$/, 'Un ligam de la comunautat', 'Un lien de la communauté'],
	[/^acuelh\.chifras\.[^.]+$/, 'Una chifra (carta)', 'Un chiffre (carte)'],
	[/^acuelh\.chifras\.[^.]+\.num$/, 'Lo nombre', 'Le nombre'],
	[/^acuelh\.chifras\.[^.]+\.nom$/, 'Çò que compta lo nombre', 'Ce que compte le nombre'],
	[/^acuelh\.chifras\.[^.]+\.font$/, 'La font de la chifra', 'La source du chiffre'],
	[/^acuelh\.biais\.[^.]+$/, 'Un biais d’aprene (carta)', 'Une façon d’apprendre (carte)'],
	[/^acuelh\.biais\.[^.]+\.titol$/, 'Títol de la carta', 'Titre de la carte'],
	[/^acuelh\.biais\.[^.]+\.tèxt$/, 'Tèxt de la carta', 'Texte de la carte'],
	[/^acuelh\.biais\.[^.]+\.ligam$/, 'Ligam de la carta', 'Lien de la carte']
];
const perClau = new Map(ETIQUETAS.map(([c, oc, fr]) => [c, { oc, fr }]));

export function etiqueta(clau, fr = false) {
	const e = perClau.get(clau) ?? PER_FIN.find(([re]) => re.test(clau))?.slice(1);
	if (!e) return clau;
	const [oc, f] = Array.isArray(e) ? e : [e.oc, e.fr];
	return fr ? f : oc;
}

// les éléments qui ne s'affichent qu'en occitan (le nombre, les vers) : un seul champ
export const SOLA_LENGA = (clau) => /\.num$/.test(clau) || /^acuelh\.trobador\.vers\./.test(clau);
