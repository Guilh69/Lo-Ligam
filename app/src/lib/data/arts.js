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
		sorta: { oc: 'Editor', fr: 'Éditeur', es: 'Editorial', en: 'Publisher', ca: 'Editorial' },
		tèxt: { oc: 'Romans, novèlas, contes, poesia e teatre d’autors d’uèi.', fr: 'Romans, nouvelles, contes, poésie et théâtre d’auteurs d’aujourd’hui.', es: 'Novelas, relatos, cuentos, poesía y teatro de autores de hoy.', en: 'Novels, short stories, tales, poetry and theatre by today’s authors.', ca: 'Novel·les, narracions, contes, poesia i teatre d’autors d’avui.' } },
	{ id: 'ventterral', nom: 'Vent Terral', site: 'http://vent-terral.com/', grop: 'editor', an: 1973,
		sorta: { oc: 'Editor', fr: 'Éditeur', es: 'Editorial', en: 'Publisher', ca: 'Editorial' },
		tèxt: { oc: 'Una associacion d’autors, nascuda en 1973 dins lo Segalar.', fr: 'Une association d’auteurs, née en 1973 dans le Ségala.', es: 'Una asociación de autores, nacida en 1973 en el Ségala.', en: 'An association of authors, born in 1973 in the Ségala.', ca: 'Una associació d’autors, nascuda el 1973 al Segalar.' } },
	{ id: 'pernoste', nom: 'Per Noste', site: 'https://www.pernoste.com/', grop: 'editor', an: 1960,
		sorta: { oc: 'Editor gascon', fr: 'Éditeur gascon', es: 'Editorial gascona', en: 'Gascon publisher', ca: 'Editorial gascona' },
		tèxt: { oc: 'Libres en gascon e la revista País Gascons, dempuèi 1960.', fr: 'Des livres en gascon et la revue País Gascons, depuis 1960.', es: 'Libros en gascón y la revista País Gascons, desde 1960.', en: 'Books in Gascon and the magazine País Gascons, since 1960.', ca: 'Llibres en gascó i la revista País Gascons, des del 1960.' } },
	{ id: 'ieo', nom: 'IEO', site: 'https://ieo-oc.org/', grop: 'editor', an: 1945,
		sorta: { oc: 'Institut', fr: 'Institut', es: 'Instituto', en: 'Institute', ca: 'Institut' },
		tèxt: { oc: 'L’Institut d’Estudis Occitans, fondat en 1945.', fr: 'L’Institut d’études occitanes, fondé en 1945.', es: 'El Institut d’Estudis Occitans, fundado en 1945.', en: 'The Institut d’Estudis Occitans, founded in 1945.', ca: 'L’Institut d’Estudis Occitans, fundat el 1945.' } },
	{ id: 'libraria', nom: 'Librariá occitana', site: 'https://www.libraria-occitana.org/', grop: 'trobar',
		sorta: { oc: 'Botiga', fr: 'Boutique', es: 'Tienda', en: 'Shop', ca: 'Botiga' },
		tèxt: { oc: 'La botiga de l’IEO de Lemosin : libres, discs e videos.', fr: 'La boutique de l’IEO du Limousin : livres, disques et vidéos.', es: 'La tienda del IEO de Lemosín: libros, discos y vídeos.', en: 'The shop of the IEO in Limousin: books, records and videos.', ca: 'La botiga de l’IEO de Llemosí: llibres, discos i vídeos.' } },
	{ id: 'occitanica', nom: 'Occitanica', site: 'https://www.occitanica.eu/', grop: 'trobar',
		sorta: { oc: 'Bibliotèca numerica', fr: 'Bibliothèque numérique', es: 'Biblioteca digital', en: 'Digital library', ca: 'Biblioteca digital' },
		tèxt: { oc: 'Lo portal collectiu de la lenga e de la cultura occitanas.', fr: 'Le portail collectif de la langue et de la culture occitanes.', es: 'El portal colectivo de la lengua y la cultura occitanas.', en: 'The collective portal for the Occitan language and culture.', ca: 'El portal col·lectiu de la llengua i la cultura occitanes.' } }
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
		sorta: { oc: 'Documentari', fr: 'Documentaire', es: 'Documental', en: 'Documentary', ca: 'Documental' },
		tèxt: { oc: 'Un an dins una bòria de Roergue. Los rèires i parlan occitan.', fr: 'Une année dans une ferme du Rouergue. Les grands-parents y parlent occitan.', es: 'Un año en una granja del Rouergue. Los abuelos hablan occitano.', en: 'A year on a farm in the Rouergue. The grandparents speak Occitan.', ca: 'Un any en una granja del Roergue. Els avis hi parlen occità.' } },
	{ id: 'adrian', nom: 'Istòria d’Adrian', fr: 'Histoire d’Adrien', an: 1980, de: 'Jean-Pierre Denis', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/Ist%C3%B2ria_d%27Adrian',
		sorta: { oc: 'Filme', fr: 'Film', es: 'Película', en: 'Film', ca: 'Pel·lícula' },
		tèxt: { oc: 'La vida d’un paisan de Lemosin. Camèra d’Aur a Canas.', fr: 'La vie d’un paysan du Limousin. Caméra d’or à Cannes.', es: 'La vida de un campesino del Lemosín. Cámara de Oro en Canas.', en: 'The life of a Limousin farmer. Caméra d’Or at Canas.', ca: 'La vida d’un pagès del Llemosí. Càmera d’Or a Canas.' } },
	{ id: 'orsalher', nom: 'L’Orsalhèr', fr: 'Le Montreur d’ours', an: 1984, de: 'Jean Fléchet', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/L%E2%80%99Orsalh%C3%A8r',
		sorta: { oc: 'Filme', fr: 'Film', es: 'Película', en: 'Film', ca: 'Pel·lícula' },
		tèxt: { oc: 'Un òme e son ors dins la montanha. Escrich amb Leon Còrdas.', fr: 'Un homme et son ours dans la montagne. Écrit avec Léon Cordes.', es: 'Un hombre y su oso en la montaña. Escrito con Léon Cordes.', en: 'A man and his bear in the mountains. Written with Léon Cordes.', ca: 'Un home i el seu ós a la muntanya. Escrit amb Léon Cordes.' } },
	{ id: 'malaterra', nom: 'Malaterra', an: 2003, de: 'Philippe Carrese', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/Malaterra',
		sorta: { oc: 'Filme de television', fr: 'Téléfilm', es: 'Telefilme', en: 'TV film', ca: 'Telefilm' },
		tèxt: { oc: 'La guèrra de 14 vista d’una bòria de Provença. Musica de Massilia Sound System.', fr: 'La guerre de 14 vue d’une ferme de Provence. Musique de Massilia Sound System.', es: 'La Primera Guerra Mundial vista desde una granja de Provenza. Música de Massilia Sound System.', en: 'The First World War seen from a farm in Provence. Music by Massilia Sound System.', ca: 'La Primera Guerra Mundial vista des d’una granja de Provença. Música de Massilia Sound System.' } },
	{ id: 'aura', nom: 'E l’aura fai son vir', fr: 'Le vent fait son tour', an: 2005, de: 'Giorgio Diritti', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/E_l%27aura_fai_son_vir',
		sorta: { oc: 'Filme', fr: 'Film', es: 'Película', en: 'Film', ca: 'Pel·lícula' },
		tèxt: { oc: 'Un pastor s’installa dins un vilatge de las Valadas Occitanas d’Itàlia.', fr: 'Un berger s’installe dans un village des vallées occitanes d’Italie.', es: 'Un pastor se instala en un pueblo de los valles occitanos de Italia.', en: 'A shepherd settles in a village in the Occitan valleys of Italy.', ca: 'Un pastor s’instal·la en un poble de les valls occitanes d’Itàlia.' } },
	{ id: 'lengadamor', nom: 'Lenga d’amor', an: 2013, de: 'Patrick Lavaud', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/Lenga_d%27amor',
		sorta: { oc: 'Documentari', fr: 'Documentaire', es: 'Documental', en: 'Documentary', ca: 'Documental' },
		tèxt: { oc: 'D’una enfança dins una bòria de Peiregòrd a la lenga d’uèi.', fr: 'D’une enfance dans une ferme du Périgord à la langue d’aujourd’hui.', es: 'De una infancia en una granja del Perigord a la lengua de hoy.', en: 'From a childhood on a farm in the Périgord to the language of today.', ca: 'D’una infantesa en una granja del Perigord a la llengua d’avui.' } },
	{ id: 'paur', nom: 'La Peur', lenga: 'fr', an: 2015, de: 'Damien Odoul', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/La_Peur_(film,_2015)',
		sorta: { oc: 'Filme', fr: 'Film', es: 'Película', en: 'Film', ca: 'Pel·lícula' },
		tèxt: { oc: 'Un jove soldat dins la guèrra de 14 ; los soldats del Miègjorn i parlan occitan.', fr: 'Un jeune soldat dans la guerre de 14 ; les soldats du Midi y parlent occitan.', es: 'Un joven soldado en la Primera Guerra Mundial; los soldados del sur de Francia hablan occitano.', en: 'A young soldier in the First World War; the soldiers from the south of France speak Occitan.', ca: 'Un jove soldat a la Primera Guerra Mundial; els soldats del sud de França hi parlen occità.' } },
	{ id: 'seria', nom: 'La seria', an: 2023, de: 'Amic Bedel e Julien Campredon', grop: 'filme',
		site: 'https://oc.wikipedia.org/wiki/La_seria',
		sorta: { oc: 'Seria', fr: 'Série', es: 'Serie', en: 'Series', ca: 'Sèrie' },
		tèxt: { oc: 'Un jove vòl virar la primièra seria en occitan.', fr: 'Un jeune homme veut tourner la première série en occitan.', es: 'Un joven quiere rodar la primera serie en occitano.', en: 'A young man wants to shoot the first series in Occitan.', ca: 'Un jove vol rodar la primera sèrie en occità.' } },
	{ id: 'engloutie', nom: 'L’Engloutie', lenga: 'fr', an: 2025, de: 'Louise Hémon', grop: 'filme',
		site: 'https://fr.wikipedia.org/wiki/L%27Engloutie',
		sorta: { oc: 'Filme', fr: 'Film', es: 'Película', en: 'Film', ca: 'Pel·lícula' },
		tèxt: { oc: 'Una regenta arriba dins un vilatge de montanha, en 1899.', fr: 'Une institutrice arrive dans un hameau de montagne, en 1899.', es: 'Una maestra llega a una aldea de montaña, en 1899.', en: 'A schoolteacher arrives in a mountain hamlet, in 1899.', ca: 'Una mestra arriba a un llogaret de muntanya, el 1899.' } },
	{ id: 'ocvod', nom: 'OcVOD', site: 'https://www.ocvod.fr/', grop: 'veire',
		sorta: { oc: 'Plataforma', fr: 'Plateforme', es: 'Plataforma', en: 'Platform', ca: 'Plataforma' },
		tèxt: { oc: 'Filmes e serias en occitan, pels mainatges e pels grands, per abonament.', fr: 'Des films et des séries en occitan, pour les enfants et les grands, par abonnement.', es: 'Películas y series en occitano, para pequeños y mayores, por suscripción.', en: 'Films and series in Occitan, for children and grown-ups, by subscription.', ca: 'Pel·lícules i sèries en occità, per a petits i grans, per subscripció.' } },
	{ id: 'octele', nom: 'ÒCtele', site: 'https://www.octele.com/', grop: 'veire',
		sorta: { oc: 'Cadena en linha', fr: 'Chaîne en ligne', es: 'Canal en línea', en: 'Online channel', ca: 'Canal en línia' },
		tèxt: { oc: 'Las videos e las emissions de la television tota en occitan.', fr: 'Les vidéos et les émissions de la télévision tout en occitan.', es: 'Los vídeos y los programas de la televisión íntegramente en occitano.', en: 'The videos and programmes of the television channel entirely in Occitan.', ca: 'Els vídeos i els programes de la televisió íntegrament en occità.' } }
];
