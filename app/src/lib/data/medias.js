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
		sorta: { oc: 'Cadena en linha', fr: 'Chaîne en ligne' }, luòc: { oc: 'Pau', fr: 'Pau' },
		tèxt: { oc: 'La television tota en occitan, en linha dempuèi 2013.', fr: 'La télévision tout en occitan, en ligne depuis 2013.' } },
	{ id: 'viure', nom: 'Viure al país', site: 'https://france3-regions.franceinfo.fr/occitanie/programmes/france-3_occitanie_viure-al-pais', lon: 1.444, lat: 43.604,
		sorta: { oc: 'Emission de França 3', fr: 'Émission de France 3' }, luòc: { oc: 'Tolosa', fr: 'Toulouse' },
		tèxt: { oc: 'Lo magazin en occitan de França 3, dempuèi 1981, lo dimenge.', fr: 'Le magazine en occitan de France 3, depuis 1981, le dimanche.' } },
	{ id: 'vaqui', nom: 'Vaquí', site: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/programmes/france-3_provence-alpes-cote-d-azur_vaqui', lon: 5.37, lat: 43.296,
		sorta: { oc: 'Emission de França 3', fr: 'Émission de France 3' }, luòc: { oc: 'Marselha', fr: 'Marseille' },
		tèxt: { oc: 'Lo magazin de França 3 Provença-Alps-Còsta d’Azur, lo dimenge.', fr: 'Le magazine de France 3 Provence-Alpes-Côte d’Azur, le dimanche.' } },
	{ id: 'teveoc', nom: 'Tè Vé Òc', site: 'http://www.teveoc.com/', lon: 4.36, lat: 43.837,
		sorta: { oc: 'Produccion', fr: 'Production' }, luòc: { oc: 'Nimes', fr: 'Nîmes' },
		tèxt: { oc: 'Una associacion de produccion audiovisuala, fondada a Nimes en 2012.', fr: 'Une association de production audiovisuelle, fondée à Nîmes en 2012.' } },
	{ id: 'suveprod', nom: 'SuveProd', site: 'https://www.youtube.com/user/SuveProd', lon: 6.2, lat: 44.35,
		sorta: { oc: 'Films', fr: 'Films' }, luòc: { oc: 'Alps', fr: 'Alpes' },
		tèxt: { oc: 'De paraulas de vilatges filmadas dempuèi 2008, dels Alps al Massís Central.', fr: 'Des paroles de villages filmées depuis 2008, des Alpes au Massif central.' } },
	{ id: 'parpalhon', nom: 'Parpalhon Blau', site: 'https://www.youtube.com/@ParpalhonBlau', lon: 7.262, lat: 43.71,
		sorta: { oc: 'Videos', fr: 'Vidéos' }, luòc: { oc: 'Niça', fr: 'Nice' },
		tèxt: { oc: 'Gabrièu, un niçard, fa de videos sus la lenga e lo país.', fr: 'Gabriel, un Niçois, fait des vidéos sur la langue et le pays.' } }
];

// La presse en occitan de /medias/premsa (2026-10-25) : titres
// encore vivants (dernier article ou numéro de 2025-2026), liens vérifiés le
// jour même, textes réécrits. Le rythme vient des sites, de la boutique
// Espaci Occitan et de la liste de Wikipédia (« Presse écrite occitane »).
// Écartés : La Setmana (domaine abandonné), Lo blòg occitan de France 3 (muet
// depuis 2022), Occitans! et País Gascons (pas de site trouvé).
export const RITMES = [
	{ id: 'linha', oc: 'En linha', fr: 'En ligne' },
	{ id: 'mes', oc: 'Cada mes', fr: 'Chaque mois' },
	{ id: 'dos', oc: 'Cada dos meses', fr: 'Tous les deux mois' },
	{ id: 'trimèstre', oc: 'Cada trimèstre', fr: 'Chaque trimestre' }
];
export const PREMSA = [
	{ id: 'jornalet', nom: 'Jornalet', site: 'https://www.jornalet.com/', ritme: 'linha',
		sorta: { oc: 'Quotidian', fr: 'Quotidien' },
		tèxt: { oc: 'L’actualitat de tot lo mond, cada jorn, en occitan.', fr: 'L’actualité du monde entier, chaque jour, en occitan.' } },
	{ id: 'sapiencia', nom: 'Sapiéncia', site: 'https://sapiencia.eu/', ritme: 'linha',
		sorta: { oc: 'Revista', fr: 'Revue' },
		tèxt: { oc: 'Sciéncia, istòria e tecnologia en occitan.', fr: 'Science, histoire et technologie en occitan.' } },
	{ id: 'aquodaqui', nom: 'Aquò d’Aquí', site: 'https://www.aquodaqui.info/', ritme: 'mes',
		sorta: { oc: 'Mesadièr', fr: 'Mensuel' },
		tèxt: { oc: 'L’actualitat de la lenga e de la cultura, en Provença e en Occitània.', fr: 'L’actualité de la langue et de la culture, en Provence et en Occitanie.' } },
	{ id: 'lodiari', nom: 'Lo Diari', site: 'https://lodiari.com/', ritme: 'dos',
		sorta: { oc: 'Magazin', fr: 'Magazine' },
		tèxt: { oc: 'La cultura occitana : articles, entrevistas e agenda.', fr: 'La culture occitane : articles, entretiens et agenda.' } },
	{ id: 'reclams', nom: 'Reclams', site: 'https://reclams.org/', ritme: 'trimèstre',
		sorta: { oc: 'Revista gascona', fr: 'Revue gasconne' },
		tèxt: { oc: 'La revista de l’Escòla Gaston Febus, dempuèi 1897.', fr: 'La revue de l’Escòla Gaston Febus, depuis 1897.' } },
	{ id: 'convise', nom: 'Lo Convise', site: 'https://www.association-lo-convise.com/', ritme: 'trimèstre',
		sorta: { oc: 'Revista d’Auvèrnhe', fr: 'Revue d’Auvergne' },
		tèxt: { oc: 'La revista d’una associacion occitana d’Orlhac.', fr: 'La revue d’une association occitane d’Aurillac.' } }
];
