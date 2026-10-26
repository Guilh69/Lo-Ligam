// Les médias en occitan des pages /medias/… (essais du 2026-10-25, branchés
// sur le site le même jour) : radios, télés et presse.

// Les radios de /medias/radios (essai du 2026-10-25, Romain : « va
// t'inspirer sur des sites qui recensent différentes radios ») : le flux
// direct de chacune (base libre radio-browser.info ou page de la radio,
// tous essayés le 25-10), joué dans la page seulement au clic, avec l'avis
// écrit à côté du bouton ; le lieu pour la carte. Radio Beckwith n'a qu'un
// flux vidéo : lien vers son site.
export const RADIOS = [
	{ id: 'lengadoc-mtp', nom: 'Ràdio Lenga d’Òc', site: 'https://radiolengadoc.com/', flux: 'https://stream-ssl.radios-arra.fr:8443/rlo', lon: 3.877, lat: 43.611 },
	{ id: 'pais', nom: 'Ràdio País', site: 'https://www.radiopais.fr/', flux: 'https://stunnel2.cyber-streaming.com:9272/stream', lon: -0.37, lat: 43.296 },
	{ id: 'lengadoc-nbn', nom: 'Ràdio Lengadòc', site: 'https://www.lengadoc.eu/', flux: 'https://stream-ssl.radios-arra.fr:8443/lengadocnarbonne', lon: 3.003, lat: 43.184 },
	{ id: 'albiges', nom: 'Ràdio Albigés', site: 'https://www.radioalbiges.com/', flux: 'https://live-albiges.radiom.fr/antenne.mp3', lon: 2.148, lat: 43.929 },
	{ id: 'occitania', nom: 'Radio Occitània', site: 'https://radio-occitania.com/', flux: 'https://icecast.radio-occitania.com/occitania', lon: 1.444, lat: 43.604 },
	{ id: 'nissa', nom: 'Nissa Pantai', site: 'https://nissapantai.org/', flux: 'https://listen.radioking.com/radio/79270/stream/117373', lon: 7.262, lat: 43.71 },
	{ id: 'beckwith', nom: 'Radio Beckwith', site: 'https://rbe.it/', flux: null, lon: 7.245, lat: 44.811 }
];

// Les télés et vidéos en occitan de /medias/television (2026-10-25) :
// liens vérifiés le jour même, textes réécrits ; aucun lecteur intégré, on
// renvoie vers le site de chacune. Le lieu sert à la carte (SuveProd : les
// villages filmés vont des Alpes au Massif central, point posé dans les Alpes).
export const TELES = [
	{ id: 'octele', nom: 'ÒCtele', site: 'https://www.octele.com/', dirècte: 'https://www.octele.com/Direct_289.html', lon: -0.37, lat: 43.296,
		sorta: { oc: 'Cadena en linha', fr: 'Chaîne en ligne', es: 'Canal en línea', en: 'Online channel', ca: 'Canal en línia', ar: 'قناة على الإنترنت' }, luòc: { oc: 'Pau', fr: 'Pau', es: 'Pau', en: 'Pau', ca: 'Pau', ar: 'Pau' },
		tèxt: { oc: 'La television tota en occitan, en linha dempuèi 2013.', fr: 'La télévision tout en occitan, en ligne depuis 2013.', es: 'La televisión íntegramente en occitano, en línea desde 2013.', en: 'Television entirely in Occitan, online since 2013.', ca: 'La televisió íntegrament en occità, en línia des del 2013.', ar: 'قناة تلفزيونية كلّها بالأوكسيتانية، على الإنترنت منذ 2013.' } },
	{ id: 'viure', nom: 'Viure al país', site: 'https://france3-regions.franceinfo.fr/occitanie/programmes/france-3_occitanie_viure-al-pais', lon: 1.444, lat: 43.604,
		sorta: { oc: 'Emission de França 3', fr: 'Émission de France 3', es: 'Programa de France 3', en: 'France 3 programme', ca: 'Programa de France 3', ar: 'برنامج على France 3' }, luòc: { oc: 'Tolosa', fr: 'Toulouse', es: 'Tolosa', en: 'Tolosa', ca: 'Tolosa', ar: 'Tolosa' },
		tèxt: { oc: 'Lo magazin en occitan de França 3, dempuèi 1981, lo dimenge.', fr: 'Le magazine en occitan de France 3, depuis 1981, le dimanche.', es: 'El magacín en occitano de France 3, desde 1981, los domingos.', en: 'The Occitan magazine programme on France 3, since 1981, on Sundays.', ca: 'El magazín en occità de France 3, des del 1981, els diumenges.', ar: 'المجلة التلفزيونية بالأوكسيتانية على France 3، منذ 1981، كل يوم أحد.' } },
	{ id: 'vaqui', nom: 'Vaquí', site: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/programmes/france-3_provence-alpes-cote-d-azur_vaqui', lon: 5.37, lat: 43.296,
		sorta: { oc: 'Emission de França 3', fr: 'Émission de France 3', es: 'Programa de France 3', en: 'France 3 programme', ca: 'Programa de France 3', ar: 'برنامج على France 3' }, luòc: { oc: 'Marselha', fr: 'Marseille', es: 'Marselha', en: 'Marselha', ca: 'Marselha', ar: 'Marselha' },
		tèxt: { oc: 'Lo magazin de França 3 Provença-Alps-Còsta d’Azur, lo dimenge.', fr: 'Le magazine de France 3 Provence-Alpes-Côte d’Azur, le dimanche.', es: 'El magacín de France 3 Provence-Alpes-Côte d’Azur, los domingos.', en: 'The France 3 Provence-Alpes-Côte d’Azur magazine programme, on Sundays.', ca: 'El magazín de France 3 Provence-Alpes-Côte d’Azur, els diumenges.', ar: 'المجلة التلفزيونية لقناة France 3 Provence-Alpes-Côte d’Azur، كل يوم أحد.' } },
	{ id: 'teveoc', nom: 'Tè Vé Òc', site: 'http://www.teveoc.com/', lon: 4.36, lat: 43.837,
		sorta: { oc: 'Produccion', fr: 'Production', es: 'Producción', en: 'Production', ca: 'Producció', ar: 'إنتاج' }, luòc: { oc: 'Nimes', fr: 'Nîmes', es: 'Nimes', en: 'Nimes', ca: 'Nimes', ar: 'Nimes' },
		tèxt: { oc: 'Una associacion de produccion audiovisuala, fondada a Nimes en 2012.', fr: 'Une association de production audiovisuelle, fondée à Nîmes en 2012.', es: 'Una asociación de producción audiovisual, fundada en Nimes en 2012.', en: 'An audiovisual production association, founded in Nimes in 2012.', ca: 'Una associació de producció audiovisual, fundada a Nimes el 2012.', ar: 'جمعية للإنتاج السمعي البصري، تأسّست في Nimes عام 2012.' } },
	{ id: 'suveprod', nom: 'SuveProd', site: 'https://www.youtube.com/user/SuveProd', lon: 6.2, lat: 44.35,
		sorta: { oc: 'Films', fr: 'Films', es: 'Películas', en: 'Films', ca: 'Pel·lícules', ar: 'أفلام' }, luòc: { oc: 'Alps', fr: 'Alpes', es: 'Alpes', en: 'Alps', ca: 'Alps', ar: 'Alps' },
		tèxt: { oc: 'De paraulas de vilatges filmadas dempuèi 2008, dels Alps al Massís Central.', fr: 'Des paroles de villages filmées depuis 2008, des Alpes au Massif central.', es: 'Palabras de pueblos filmadas desde 2008, de los Alpes al Macizo Central.', en: 'Words from villages, filmed since 2008, from the Alps to the Massif Central.', ca: 'Paraules de pobles filmades des del 2008, dels Alps al Massís Central.', ar: 'أحاديث أهل القرى مصوَّرة منذ 2008، من Alps إلى Massís Central.' } },
	{ id: 'parpalhon', nom: 'Parpalhon Blau', site: 'https://www.youtube.com/@ParpalhonBlau', lon: 7.262, lat: 43.71,
		sorta: { oc: 'Videos', fr: 'Vidéos', es: 'Vídeos', en: 'Videos', ca: 'Vídeos', ar: 'مقاطع فيديو' }, luòc: { oc: 'Niça', fr: 'Nice', es: 'Niça', en: 'Niça', ca: 'Niça', ar: 'Niça' },
		tèxt: { oc: 'Gabrièu, un niçard, fa de videos sus la lenga e lo país.', fr: 'Gabriel, un Niçois, fait des vidéos sur la langue et le pays.', es: 'Gabriel, de Niça, hace vídeos sobre la lengua y el país.', en: 'Gabriel, from Niça, makes videos about the language and the country.', ca: 'Gabriel, un niçard, fa vídeos sobre la llengua i el país.', ar: 'Gabriel، من Niça، يصنع مقاطع فيديو عن اللغة وعن بلده.' } }
];

// La presse en occitan de /medias/premsa (2026-10-25) : titres
// encore vivants (dernier article ou numéro de 2025-2026), liens vérifiés le
// jour même, textes réécrits. Le rythme vient des sites, de la boutique
// Espaci Occitan et de la liste de Wikipédia (« Presse écrite occitane »).
// Écartés : La Setmana (domaine abandonné), Lo blòg occitan de France 3 (muet
// depuis 2022), Occitans! et País Gascons (pas de site trouvé).
export const RITMES = [
	{ id: 'linha', oc: 'En linha', fr: 'En ligne', es: 'En línea', en: 'Online', ca: 'En línia', ar: 'على الإنترنت' },
	{ id: 'mes', oc: 'Cada mes', fr: 'Chaque mois', es: 'Cada mes', en: 'Every month', ca: 'Cada mes', ar: 'كل شهر' },
	{ id: 'dos', oc: 'Cada dos meses', fr: 'Tous les deux mois', es: 'Cada dos meses', en: 'Every two months', ca: 'Cada dos mesos', ar: 'كل شهرين' },
	{ id: 'trimèstre', oc: 'Cada trimèstre', fr: 'Chaque trimestre', es: 'Cada trimestre', en: 'Every quarter', ca: 'Cada trimestre', ar: 'كل ثلاثة أشهر' }
];
export const PREMSA = [
	{ id: 'jornalet', nom: 'Jornalet', site: 'https://www.jornalet.com/', ritme: 'linha',
		sorta: { oc: 'Quotidian', fr: 'Quotidien', es: 'Diario', en: 'Daily', ca: 'Diari', ar: 'صحيفة يومية' },
		tèxt: { oc: 'L’actualitat de tot lo mond, cada jorn, en occitan.', fr: 'L’actualité du monde entier, chaque jour, en occitan.', es: 'La actualidad del mundo entero, cada día, en occitano.', en: 'News from around the world, every day, in Occitan.', ca: 'L’actualitat de tot el món, cada dia, en occità.', ar: 'أخبار العالم كلّه، كل يوم، بالأوكسيتانية.' } },
	{ id: 'sapiencia', nom: 'Sapiéncia', site: 'https://sapiencia.eu/', ritme: 'linha',
		sorta: { oc: 'Revista', fr: 'Revue', es: 'Revista', en: 'Magazine', ca: 'Revista', ar: 'مجلة' },
		tèxt: { oc: 'Sciéncia, istòria e tecnologia en occitan.', fr: 'Science, histoire et technologie en occitan.', es: 'Ciencia, historia y tecnología en occitano.', en: 'Science, history and technology in Occitan.', ca: 'Ciència, història i tecnologia en occità.', ar: 'العلوم والتاريخ والتكنولوجيا بالأوكسيتانية.' } },
	{ id: 'aquodaqui', nom: 'Aquò d’Aquí', site: 'https://www.aquodaqui.info/', ritme: 'mes',
		sorta: { oc: 'Mesadièr', fr: 'Mensuel', es: 'Mensual', en: 'Monthly', ca: 'Mensual', ar: 'مجلة شهرية' },
		tèxt: { oc: 'L’actualitat de la lenga e de la cultura, en Provença e en Occitània.', fr: 'L’actualité de la langue et de la culture, en Provence et en Occitanie.', es: 'La actualidad de la lengua y de la cultura, en Provenza y en Occitania.', en: 'News about the language and culture, in Provence and Occitania.', ca: 'L’actualitat de la llengua i de la cultura, a Provença i a l’Occitània.', ar: 'أخبار اللغة والثقافة، في Provença وفي أوكسيتانيا.' } },
	{ id: 'lodiari', nom: 'Lo Diari', site: 'https://lodiari.com/', ritme: 'dos',
		sorta: { oc: 'Magazin', fr: 'Magazine', es: 'Magacín', en: 'Magazine', ca: 'Magazín', ar: 'مجلة' },
		tèxt: { oc: 'La cultura occitana : articles, entrevistas e agenda.', fr: 'La culture occitane : articles, entretiens et agenda.', es: 'La cultura occitana: artículos, entrevistas y agenda.', en: 'Occitan culture: articles, interviews and an events calendar.', ca: 'La cultura occitana: articles, entrevistes i agenda.', ar: 'الثقافة الأوكسيتانية: مقالات وحوارات وجدول للفعاليات.' } },
	{ id: 'reclams', nom: 'Reclams', site: 'https://reclams.org/', ritme: 'trimèstre',
		sorta: { oc: 'Revista gascona', fr: 'Revue gasconne', es: 'Revista gascona', en: 'Gascon magazine', ca: 'Revista gascona', ar: 'مجلة غاسكونية' },
		tèxt: { oc: 'La revista de l’Escòla Gaston Febus, dempuèi 1897.', fr: 'La revue de l’Escòla Gaston Febus, depuis 1897.', es: 'La revista de la Escòla Gaston Febus, desde 1897.', en: 'The magazine of the Escòla Gaston Febus, since 1897.', ca: 'La revista de l’Escòla Gaston Febus, des del 1897.', ar: 'مجلة Escòla Gaston Febus، تصدر منذ 1897.' } },
	{ id: 'convise', nom: 'Lo Convise', site: 'https://www.association-lo-convise.com/', ritme: 'trimèstre',
		sorta: { oc: 'Revista d’Auvèrnhe', fr: 'Revue d’Auvergne', es: 'Revista de Auvernia', en: 'Magazine from Auvergne', ca: 'Revista d’Alvèrnia', ar: 'مجلة من Auvèrnhe' },
		tèxt: { oc: 'La revista d’una associacion occitana d’Orlhac.', fr: 'La revue d’une association occitane d’Aurillac.', es: 'La revista de una asociación occitana de Orlhac.', en: 'The magazine of an Occitan association in Orlhac.', ca: 'La revista d’una associació occitana d’Orlhac.', ar: 'مجلة جمعية أوكسيتانية في Orlhac.' } }
];
