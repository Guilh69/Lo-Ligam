// Les arts d'Òbras (essais du 2026-10-25, branchés sur le site le même
// jour) : la littérature et le cinéma.

// La littérature de /obras/literatura (2026-10-25) : les éditeurs
// encore actifs (site vivant, nouveautés de 2024-2026) et deux endroits où
// trouver les livres ; liens vérifiés le jour même, textes réécrits d'après
// les sites (Per Noste : Wikipédia). Écartés : La Poesia (blog muet depuis
// 2014), Fédérop et Novelum (plus de site), L'Ostal del Libre, Jorn, Lo
// Chamin de Sent Jaume et L'Aucèu Libre (pas de site trouvé).
export const LIBRES = [
	{ id: 'letrasdoc', nom: 'Letras d’òc', site: 'http://www.letrasdoc.org/', grop: 'editor',
		sorta: { oc: 'Editor', fr: 'Éditeur' },
		tèxt: { oc: 'Romans, novèlas, contes, poesia e teatre d’autors d’uèi.', fr: 'Romans, nouvelles, contes, poésie et théâtre d’auteurs d’aujourd’hui.' } },
	{ id: 'ventterral', nom: 'Vent Terral', site: 'http://vent-terral.com/', grop: 'editor', an: 1973,
		sorta: { oc: 'Editor', fr: 'Éditeur' },
		tèxt: { oc: 'Una associacion d’autors, nascuda en 1973 dins lo Segalar.', fr: 'Une association d’auteurs, née en 1973 dans le Ségala.' } },
	{ id: 'pernoste', nom: 'Per Noste', site: 'https://www.pernoste.com/', grop: 'editor', an: 1960,
		sorta: { oc: 'Editor gascon', fr: 'Éditeur gascon' },
		tèxt: { oc: 'Libres en gascon e la revista País Gascons, dempuèi 1960.', fr: 'Des livres en gascon et la revue País Gascons, depuis 1960.' } },
	{ id: 'ieo', nom: 'IEO', site: 'https://ieo-oc.org/', grop: 'editor', an: 1945,
		sorta: { oc: 'Institut', fr: 'Institut' },
		tèxt: { oc: 'L’Institut d’Estudis Occitans, fondat en 1945.', fr: 'L’Institut d’études occitanes, fondé en 1945.' } },
	{ id: 'libraria', nom: 'Librariá occitana', site: 'https://www.libraria-occitana.org/', grop: 'trobar',
		sorta: { oc: 'Botiga', fr: 'Boutique' },
		tèxt: { oc: 'La botiga de l’IEO de Lemosin : libres, discs e videos.', fr: 'La boutique de l’IEO du Limousin : livres, disques et vidéos.' } },
	{ id: 'occitanica', nom: 'Occitanica', site: 'https://www.occitanica.eu/', grop: 'trobar',
		sorta: { oc: 'Bibliotèca numerica', fr: 'Bibliothèque numérique' },
		tèxt: { oc: 'Lo portal collectiu de la lenga e de la cultura occitanas.', fr: 'Le portail collectif de la langue et de la culture occitanes.' } }
];

// Le cinéma de /obras/cinema (2026-10-25) : les films où l'occitan
// tient une vraie place (catégorie « Film en occitan » de Wikipédia, croisée
// avec la Wikipèdia occitane), du plus ancien au plus récent, puis deux
// endroits où les voir. Chaque film mène à sa page Wikipèdia en occitan quand
// elle existe, sinon en français. Écartés : la Mostra Llanterna Digital (plus
// d'édition trouvée après 2017), Miséricorde de Guiraudie (tourné en
// français), L'Arbre vieux et Le Mont Ventoux (courts documentaires sans page
// détaillée).
export const FILMES = [
	{ id: 'farrebique', nom: 'Farrebique', an: 1946, de: 'Georges Rouquier', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/Farrebique',
		sorta: { oc: 'Documentari', fr: 'Documentaire' },
		tèxt: { oc: 'Un an dins una bòria de Roergue. Los rèires i parlan occitan.', fr: 'Une année dans une ferme du Rouergue. Les grands-parents y parlent occitan.' } },
	{ id: 'adrian', nom: 'Istòria d’Adrian', fr: 'Histoire d’Adrien', an: 1980, de: 'Jean-Pierre Denis', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/Ist%C3%B2ria_d%27Adrian',
		sorta: { oc: 'Filme', fr: 'Film' },
		tèxt: { oc: 'La vida d’un paisan de Lemosin. Camèra d’Aur a Canas.', fr: 'La vie d’un paysan du Limousin. Caméra d’or à Cannes.' } },
	{ id: 'orsalher', nom: 'L’Orsalhèr', fr: 'Le Montreur d’ours', an: 1984, de: 'Jean Fléchet', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/L%E2%80%99Orsalh%C3%A8r',
		sorta: { oc: 'Filme', fr: 'Film' },
		tèxt: { oc: 'Un òme e son ors dins la montanha. Escrich amb Leon Còrdas.', fr: 'Un homme et son ours dans la montagne. Écrit avec Léon Cordes.' } },
	{ id: 'malaterra', nom: 'Malaterra', an: 2003, de: 'Philippe Carrese', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/Malaterra',
		sorta: { oc: 'Filme de television', fr: 'Téléfilm' },
		tèxt: { oc: 'La guèrra de 14 vista d’una bòria de Provença. Musica de Massilia Sound System.', fr: 'La guerre de 14 vue d’une ferme de Provence. Musique de Massilia Sound System.' } },
	{ id: 'aura', nom: 'E l’aura fai son vir', fr: 'Le vent fait son tour', an: 2005, de: 'Giorgio Diritti', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/E_l%27aura_fai_son_vir',
		sorta: { oc: 'Filme', fr: 'Film' },
		tèxt: { oc: 'Un pastor s’installa dins un vilatge de las Valadas Occitanas d’Itàlia.', fr: 'Un berger s’installe dans un village des vallées occitanes d’Italie.' } },
	{ id: 'lengadamor', nom: 'Lenga d’amor', an: 2013, de: 'Patrick Lavaud', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/Lenga_d%27amor',
		sorta: { oc: 'Documentari', fr: 'Documentaire' },
		tèxt: { oc: 'D’una enfança dins una bòria de Peiregòrd a la lenga d’uèi.', fr: 'D’une enfance dans une ferme du Périgord à la langue d’aujourd’hui.' } },
	{ id: 'paur', nom: 'La Peur', lenga: 'fr', an: 2015, de: 'Damien Odoul', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/La_Peur_(film,_2015)',
		sorta: { oc: 'Filme', fr: 'Film' },
		tèxt: { oc: 'Un jove soldat dins la guèrra de 14 ; los soldats del Miègjorn i parlan occitan.', fr: 'Un jeune soldat dans la guerre de 14 ; les soldats du Midi y parlent occitan.' } },
	{ id: 'seria', nom: 'La seria', an: 2023, de: 'Amic Bedel e Julien Campredon', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/La_seria',
		sorta: { oc: 'Seria', fr: 'Série' },
		tèxt: { oc: 'Un jove vòl virar la primièra seria en occitan.', fr: 'Un jeune homme veut tourner la première série en occitan.' } },
	{ id: 'engloutie', nom: 'L’Engloutie', lenga: 'fr', an: 2025, de: 'Louise Hémon', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/L%27Engloutie',
		sorta: { oc: 'Filme', fr: 'Film' },
		tèxt: { oc: 'Una regenta arriba dins un vilatge de montanha, en 1899.', fr: 'Une institutrice arrive dans un hameau de montagne, en 1899.' } },
	{ id: 'ocvod', nom: 'OcVOD', site: 'https://www.ocvod.fr/', grop: 'veire',
		sorta: { oc: 'Plataforma', fr: 'Plateforme' },
		tèxt: { oc: 'Filmes e serias en occitan, pels mainatges e pels grands, per abonament.', fr: 'Des films et des séries en occitan, pour les enfants et les grands, par abonnement.' } },
	{ id: 'octele', nom: 'ÒCtele', site: 'https://www.octele.com/', grop: 'veire',
		sorta: { oc: 'Cadena en linha', fr: 'Chaîne en ligne' },
		tèxt: { oc: 'Las videos e las emissions de la television tota en occitan.', fr: 'Les vidéos et les émissions de la télévision tout en occitan.' } }
];
