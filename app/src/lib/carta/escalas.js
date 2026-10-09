// La grilha de las escalas de /carta (demanda de Romain, 2026-10-09) : un sol
// endrech per dire « a tal valor de la barra d'escala, se vei tal causa »,
// parièr sus totes los ecrans e per totas las lengas.
//
// Un sulhet es una valor de la barra (en km). La barra (CartaOccitania, 110 px
// al mai) aficha la valor arredondida per dejós de la distància de 110 px al
// centre de la carta, als crans 10, 7, 5, 4, 3, 2, 1,5 e 1 : « dès(100) » es
// lo zoom a partir del qual la barra marca 100 km (o mens) en s'aprochant.
// Concepcion : revisions/2026-10-08-lengas-escalas.md §1 (los noms dels
// palièrs son de validar per Romain).

export const ESCALA_PX = 110;
export const CRANS = [10, 7, 5, 4, 3, 2, 1.5, 1];
// lo pas del zoom (zoomSnap de CartaOccitania)
export const PAS_ZOOM = 0.25;
// la latitud de referéncia (lo mitan de l'Occitània a l'arribada) pels sulhets
// que seguisson pas lo centre de la carta
export const LAT_REF = 44.7;

const MERC = (2 * Math.PI * 6371000) / 256; // (Leaflet : Tèrra de 6 371 km)
// lo zoom ont 110 px fan exactament `km` a la latitud `lat`
export const zÈscala = (km, lat = LAT_REF) => Math.log2((ESCALA_PX * MERC * Math.cos((lat * Math.PI) / 180)) / (km * 1000));
// la valor de la barra just al dessús de `km` (100 → 150, 200 → 300, 700 → 1 000)
function cranSus(km) {
	const p = 10 ** Math.floor(Math.log10(km) + 1e-9),
		d = Math.round((km / p) * 10) / 10,
		i = CRANS.indexOf(d);
	return i > 0 ? CRANS[i - 1] * p : km * 1.5;
}
// lo zoom a partir del qual la barra marca `km` (o mens) en s'aprochant
export const zDès = (km, lat = LAT_REF) => zÈscala(cranSus(km), lat);
// lo primièr cran de zoom ont la barra marca `km` : per anar en quauque lòc
// (arribada, recadratge), pas per un sulhet
export const zCran = (km, lat = LAT_REF) => Math.ceil(zDès(km, lat) / PAS_ZOOM - 1e-6) * PAS_ZOOM;
// la valor que la barra aficha a un zoom
export function kmBarra(z, lat = LAT_REF) {
	const m = (ESCALA_PX * MERC * Math.cos((lat * Math.PI) / 180)) / 2 ** z;
	const p = 10 ** (String(Math.floor(m)).length - 1),
		d = m / p;
	return (p * (CRANS.find((v) => d >= v) ?? 1)) / 1000;
}

// Los cinc palièrs « Del cèl a la tèrra » : cadun comença a sa valor `dès`
export const PALIÈRS = [
	{ id: 'mond', oc: 'Lo mond', fr: 'Le monde', dès: Infinity },
	{ id: 'lengas', oc: 'Las lengas', fr: 'Les langues', dès: 700 },
	{ id: 'dialectes', oc: 'Los dialèctes', fr: 'Les dialectes', dès: 100 },
	{ id: 'terra', oc: 'La tèrra', fr: 'Le sol', dès: 20 },
	{ id: 'comunas', oc: 'Las comunas', fr: 'Les communes', dès: 7 }
];
export const palièrDe = (km) => PALIÈRS.reduce((p, q) => (km <= q.dès ? q : p), PALIÈRS[0]);

// Los sulhets, en km de barra (« dès » : a partir d'aquela valor en s'aprochant)
export const KM = {
	plenas: 700, // las lengas son plenas fins a 700 km ; a 1 000 km, sonque lor contorn
	detalh: [400, 200], // las autras jaces arriban de 400 a 200 km (a 500 km, sonque las lengas)
	rius: 150,
	dialectes: 100, // 150 km e mai : las lengas unidas
	capitalas: 200, // las estelas de las vilas grandas, una o doas per dialècte (causida de Romain, 2026-10-09)
	nomsCapitalas: 150, // lors noms (a 200 km, se sarravan sus « OCCITAN »)
	vilas: 40, // las vilas importantas de cada despartament
	vilasMejanas: 30,
	vilatges: 15, // (de fach, laissats al satellit, que pren lo relais a 20 km)
	europa: 50, // los contorns d'Euròpa s'escantisson de 70 a 50 km
	comunas: 7 // las comunas (causida de Romain), segon la barra a la latitud vertadièra
};

// La plaja ont cada jaça se vei : [de luènh, de prèp], en km de barra (0 :
// fins al pus prèp). Una jaça cochada en defòra de sa plaja mena la carta a
// l'escala vesibla la mai pròcha (demanda de Romain, 2026-10-09 : « toutes
// les données doivent zoomer sur le niveau le plus proche de visualisation »)
export const PLAJAS = {
	frontiera: [200, 0],
	dialectes: [100, 0],
	regions: [300, 5],
	despartaments: [300, 5],
	comunas: [7, 0],
	lieusInteres: [300, 0],
	librarias: [300, 0],
	calandretas: [300, 0],
	festas: [300, 0],
	provincias: [300, 10],
	parcs: [150, 0.5],
	massis: [200, 2],
	nomsRius: [150, 20],
	corbas: [300, 20],
	lengasFranca: [400, 30]
};
// Las jaces vertadièrament occitanas (e las regions e despartaments, demanda
// de Romain del meteis jorn) : cochadas, menan a la vista
// d'ensemble de l'Occitània (70 km sus l'ordenador de Romain, un cadratge
// parièr suls autres aparelhs ; demanda de Romain, 2026-10-09)
export const OCCITANAS = new Set(['frontiera', 'dialectes', 'departaments', 'toponimia', 'calandretas', 'librarias', 'lieusInteres', 'festas', 'regions', 'despartaments']);
// (la vista d'ensemble : l'Occitània dins l'ecran, un cran de mai de recuol que l'arribada)
export const RECUOL_VISTA = 0.5;
// lo zoom ont anar per veire una jaça (null : se vei ja)
export function zPlaja(id, z, lat = LAT_REF) {
	const pl = PLAJAS[id];
	if (!pl) return null;
	if (z < zDès(pl[0], lat)) return zCran(pl[0], lat);
	if (pl[1] && z > zÈscala(pl[1], lat)) return Math.floor(zÈscala(pl[1], lat) / PAS_ZOOM) * PAS_ZOOM;
	return null;
}

// Los zooms fixes (meteis zoom sus totes los ecrans ; la barra varia un pauc
// amb la latitud : la valor indicada es al mitan de l'Occitània)
export const Z = {
	RELAIS: 8.75, // 20 km : las estelas cedisson al satellit
	PRECARGA: 8.25, // 40 km : las tuèlas del satellit se cargan, invisiblas
	ICONAS: 10, // 10 km : l'icòna dels ponches espelís de son estela
	DETALH_1: 10, // 10 km : pas pus de noms de vilas pausats (lo fons a los sieus)
	COMUNAS: 10.5, // 7 km : las comunas (causida de Romain)
	VOL: 10.5, // 7 km : ont se va en clicant un luòc
	PROV_MAX: 10.5, // 7 km : las províncias de 1789 s'escantisson
	GOV_PROV: 6.875, // entre 100 e 70 km : governaments, puèi províncias
	REG_0: 6.9, // 70 km : lo survòl de las regions
	DEP_0: 8.3, // 30 km : lo dels despartaments
	DEP_1: 10.75, // 7 km : pas pus de survòl de territòri
	ARRIBADA_MAX: zCran(30) // un grand ecran arriba pas dirèctament sul satellit
};

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;

// Los sulhets que seguisson la barra al centre de la carta
export function nivèlsDezoom(map) {
	const lat = map.getCenter?.().lat ?? LAT_REF;
	return {
		lat,
		zDial: zDès(KM.dialectes, lat),
		zRius: zDès(KM.rius, lat),
		z300: zDès(KM.detalh[1], lat),
		z500: zDès(KM.detalh[0], lat),
		zVuèg: zDès(KM.plenas, lat),
		zEuropa: zDès(KM.europa, lat),
		zCapitalas: zDès(KM.capitalas, lat),
		zNomsCapitalas: zDès(KM.nomsCapitalas, lat),
		zVilas: zDès(KM.vilas, lat),
		zVilasMejanas: zDès(KM.vilasMejanas, lat),
		zVilatges: zDès(KM.vilatges, lat),
		zComunas: zDès(KM.comunas, lat)
	};
}
// de 0 a 1 : los dialèctes (0 = la lenga unida) ; las jaces de detalh (0 = lo contorn sol)
export const aDialectes = (n, z) => easeS(clamp((z - n.zDial + 0.1) / 0.1));
export const aDetalh = (n, z) => easeS(clamp((z - n.z500) / (n.z300 - n.z500)));
