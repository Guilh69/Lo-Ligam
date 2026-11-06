// Documents libres d'Occitanica (CIRDÒC), choisis par Romain le 2026-11-06 sur la
// page de recensement (boutons « Ça m'intéresse » / « Pas pour moi »). Sources :
// notices d'Occitanica (accès OAI-PMH et API ouverts), mention « domaine public »
// du CIRDÒC. Relevé et droits : revisions/2026-11-06-recensement-lingua-libre-occitanica.md.
// Rien n'est copié à part une vignette légère (static/ensag/occitanica/<id>.webp,
// 560 px au plus, WebP) ; chaque carte renvoie à la fiche d'origine.
// Mention exigée par le CIRDÒC : « Auteur - Source occitanica.eu / CIRDOC -
// Institut occitan de cultura » (page « Conditions de réutilisation »). Quand
// il n'y a pas d'auteur personnel : « Anonyme » (affiches, photos) ou « Collectif »
// (revues, almanachs, journaux).
// Écartés par Romain : la famille Godolin et le portrait de Junior Sans.
// Décision de Romain (06-11) : « si elle a mention libre, le sujet est clos » ; on
// suit donc la mention du CIRDÒC. Relecture de Joan : les affiches du Larzac
// (1971-1981 et 1975), Lo Gai Saber, Reclams de Biarn e Gascougne, l'Almanac de la
// Gascougno (1898-1959) et quelques partitions sans date pourraient avoir des ayants
// droit : le CIRDÒC retire sur réclamation, un courriel de politesse reste possible.
// Titres : ceux du catalogue d'Occitanica. Libellés : occitan vérifié par lo
// Congrès le 2026-11-06 (imatge, istòria, cant, musica, escrit, tèxte, ancian,
// revista, almanac, fèsta, tradicion, bibliotèca, numeric, causit, domeni, segon,
// dins, indicar, obrir, fenèstra, novèl), À VALIDER par Romain.

export const SOURCE = 'occitanica.eu / CIRDOC - Institut occitan de cultura';

export const FAMILHAS = [
	{
		id: 'imatges',
		nom: { oc: 'Imatges d’istòria', fr: 'Images d’histoire' },
		docs: [
			{ id: 21651, titre: 'Instauration des Jeux floraux à Toulouse le 3 mai 1324', auteur: 'Jean-Paul Laurens', genre: 'Peinture', data: '1912' },
			{ id: 422, titre: 'Corso ou cavalcade du Carnaval de Béziers', auteur: 'Anonyme', genre: 'Photographies', data: 'vers 1900' },
			{ id: 2, titre: 'Tarascon : procession de la Tarasque', auteur: 'Anonyme', genre: 'Photographie', data: '' },
			{ id: 21138, titre: 'Larzac : Giscard déclenche l’expropriation des paysans', auteur: 'Anonyme', genre: 'Affiche', data: '1971-1981' },
			{ id: 21176, titre: 'Été 1975 contre l’armée, le nucléaire et les promoteurs : des Larzac partout !', auteur: 'Anonyme', genre: 'Affiche', data: '1975' }
		]
	},
	{
		id: 'cants',
		nom: { oc: 'Cants e musica escrita', fr: 'Chants et partitions' },
		docs: [
			{ id: 210, titre: 'La Cansoun dis Avi', auteur: 'Frédéric Mistral ; Ch. Borde', genre: 'Partition', data: '1906' },
			{ id: 403, titre: 'Douze Noëls provençaux', auteur: 'Nicolas Saboly', genre: 'Partition', data: '' },
			{ id: 401, titre: 'Lou raubo-galino : Noël provençal', auteur: 'Joseph Roumanille ; A. Dau', genre: 'Partition', data: '' },
			{ id: 325, titre: 'Airs populaires provençaux adaptés aux cantilènes de la Reine Jeanne', auteur: 'Frédéric Mistral', genre: 'Partition', data: '1921' },
			{ id: 326, titre: 'Aquellos mountagnos', auteur: 'Alexandre Georges (arrangement)', genre: 'Partition', data: '' },
			{ id: 352, titre: 'Scènes languedociennes : suites d’orchestre. Le Chevalet', auteur: 'Célestin Vernazobres', genre: 'Partition', data: '' }
		]
	},
	{
		id: 'textes',
		nom: { oc: 'Tèxtes ancians', fr: 'Textes anciens' },
		docs: [
			{ id: 109, titre: 'Obros et rimos provenssalos', auteur: 'Louis de La Bellaudière', genre: 'Livre', data: '1595' },
			{ id: 223, titre: 'L’opera de Frountignan', auteur: 'Nicolas Fizes', genre: 'Manuscrit', data: '1705' },
			{ id: 440, titre: 'Le fouet de carnabal : satiros', auteur: 'Louis Vestrepain (attribué)', genre: 'Livre', data: '1841' },
			{ id: 217, titre: 'Li parpaioun blu', auteur: 'William C. Bonaparte-Wyse', genre: 'Livre', data: '1868' },
			{ id: 695, titre: 'La Canso de la Crozada', auteur: 'Anonyme (édition de Paul Meyer)', genre: 'Livre', data: '1875-1879' },
			{ id: 5152, titre: 'Rapport sur la limite géographique de la langue d’oc et de la langue d’oïl', auteur: 'Charles de Tourtoulon ; Octavien Bringuier', genre: 'Rapport', data: '1876' },
			{ id: 555, titre: 'Lou sermou dal curat de Cucugna', auteur: 'Achille Mir', genre: 'Livre', data: '' }
		]
	},
	{
		id: 'revistas',
		nom: { oc: 'Revistas e almanacs', fr: 'Revues et almanachs' },
		docs: [
			{ id: 3755, titre: 'L’Aiòli', auteur: 'Collectif', genre: 'Revue', data: '1891-1932' },
			{ id: 13301, titre: 'Almanac de la Gascougno', auteur: 'Collectif', genre: 'Almanach', data: '1898-1959' },
			{ id: 13333, titre: 'Almanac narbounes', auteur: 'Collectif', genre: 'Almanach', data: '1913-1937' },
			{ id: 2019, titre: 'Reclams de Biarn e Gascougne', auteur: 'Escole Gastou Febus', genre: 'Revue', data: 'depuis 1897' },
			{ id: 13154, titre: 'Lo Gai Saber : revista de l’Escòla occitana', auteur: 'Collectif', genre: 'Revue', data: 'depuis 1919' },
			{ id: 4396, titre: 'Cacalaca : soulas del pople cevenòu', auteur: 'Collectif', genre: 'Journal', data: '1916-1936' },
			{ id: 5049, titre: 'L’Echo des Gourbis', auteur: 'Collectif', genre: 'Journal de tranchées', data: '1916' }
		]
	},
	{
		id: 'festas',
		nom: { oc: 'Fèstas e tradicions', fr: 'Fêtes et traditions' },
		docs: [
			{ id: 338, titre: 'La fête des Caritats racontée par le baron de Bonnefoux', auteur: 'Pierre-Marie-Joseph de Bonnefoux', genre: 'Récit', data: '1900' },
			{ id: 402, titre: 'Nadal Toulousan : pour chœur à quatre voix', auteur: 'Armand Silvestre ; A. Moulinier', genre: 'Partition', data: '' }
		]
	}
];

export const IU = {
	titol: { oc: 'Occitanica', fr: 'Occitanica' },
	frasa: {
		oc: 'Imatges, cants, tèxtes e revistas de la bibliotèca numerica d’Occitanica, causits per Lo Ligam.',
		fr: 'Images, chants, textes et revues de la bibliothèque numérique d’Occitanica, choisis par Lo Ligam.'
	},
	veire: { oc: 'Veire sus Occitanica', fr: 'Voir sur Occitanica' },
	novel: { oc: 'S’obrís dins una fenèstra novèla', fr: 'S’ouvre dans une nouvelle fenêtre' },
	nota: {
		oc: 'Documents que lo CIRDÒC indica dins lo domeni public.',
		fr: 'Documents que le CIRDÒC indique comme relevant du domaine public.'
	}
};

export const urlFiche = (id) => `https://www.occitanica.eu/items/show/${id}`;
export const urlVignette = (id) => `/ensag/occitanica/${id}.webp`;
