// Maquette de Se parla, Òbras par art et Médias (2026-10-25, Romain : option 1,
// « ça manque de hiérarchisation de l'accès »). Les pages d'essai montrent
// les cases avec le gabarit commun (PaginaTeulas), à partir de lignes posées
// ici en mémoire : rien n'est écrit dans la base, et sans bouton « Editar ».
import { edicion } from '$lib/edicion/edicion.svelte.js';

export function mostrar(pagina, rows) {
	edicion.pagina = pagina;
	edicion.publicats = Object.fromEntries(rows.map((e) => [e.clau, { ...e, estat: 'publicat' }]));
	edicion.brolhons = {};
	edicion.causit = null;
	edicion.admin = false;
	edicion.actiu = false;
	edicion.messatge = null;
}

// une case : le bloc, son lien et sa ligne
export const teula = (pagina, id, ordre, ligam, oc, fr, sotaOc, sotaFr) => [
	{ clau: `${pagina}.teulas.${id}`, tipe: 'bloc', lista: `${pagina}.teulas`, ordre },
	{ clau: `${pagina}.teulas.${id}.ligam`, tipe: 'ligam', lista: `${pagina}.teulas.${id}`, oc, fr, ligam },
	{ clau: `${pagina}.teulas.${id}.sota`, tipe: 'text', lista: `${pagina}.teulas.${id}`, oc: sotaOc, fr: sotaFr }
];

// Les adresses de la liste de la Confédération des Calandretas : noms et
// liens seulement (les textes de présentation sont les leurs), chaque lien
// ouvert le 2026-10-25. Écartés faute de site qui réponde : Fédérop,
// Novelum, Radio Pays (Paris : l'adresse mène à une autre radio).
export const MEDIAS = [
	{
		id: 'radios', oc: 'Ràdios', fr: 'Radios', accion: { oc: 'Escotar', fr: 'Écouter' },
		lista: [
			['Ràdio Lenga d’Òc', 'https://radiolengadoc.com/'],
			['Ràdio País', 'https://www.radiopais.fr/'],
			['Ràdio Lengadòc', 'https://www.lengadoc.eu/'],
			['Ràdio Albigés', 'https://www.radioalbiges.com/'],
			['Radio Occitània', 'https://radio-occitania.com/'],
			['Nissa Pantai', 'https://nissapantai.org/'],
			['Radio Beckwith', 'https://rbe.it/']
		]
	},
	{
		id: 'television', oc: 'Television e video', fr: 'Télévision et vidéo', accion: { oc: 'Veire', fr: 'Voir' },
		lista: [
			['ÒCtele', 'https://www.octele.com/'],
			['Viure al país', 'https://france3-regions.franceinfo.fr/occitanie/programmes/france-3_occitanie_viure-al-pais'],
			['Vaquí', 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/programmes/france-3_provence-alpes-cote-d-azur_vaqui'],
			['Tè Vé Òc', 'http://www.teveoc.com/'],
			['SuveProd', 'https://www.youtube.com/user/SuveProd']
		]
	},
	{
		id: 'premsa', oc: 'Premsa', fr: 'Presse', accion: { oc: 'Legir', fr: 'Lire' },
		lista: [
			['Jornalet', 'https://www.jornalet.com/'],
			['Lo Diari', 'https://lodiari.com/'],
			['Lo blòg occitan', 'https://france3-regions.blog.franceinfo.fr/le-blog-de-viure-al-pais-france3/']
		]
	}
];

export const EDITORS = [
	{
		id: 'editors', oc: 'Editors', fr: 'Éditeurs', accion: { oc: 'Veire', fr: 'Voir' },
		lista: [
			['IEO', 'https://ieo-oc.org/'],
			['Letras d’òc', 'http://www.letrasdoc.org/'],
			['Vent Terral', 'http://vent-terral.com/blog/'],
			['La Poesia', 'http://edicionlapoesia.blogspot.com/']
		]
	}
];

// Les radios pour la page d'essai /ensag/radios (2026-10-25, Romain : « va
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
