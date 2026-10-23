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
// La talha de l'ecran (decision de Romain, 2026-10-11 : « le téléphone, c'est
// le principal ») : los sulhets seguisson lo cadratge geografic, pas la barra
// sola. Un telefòn que mòstra tota l'Occitània mòstra las meteissas jaces
// qu'un ordenador que la mòstra tanben (dialèctes, vilas, satellit…). Los
// sulhets en km son los de l'ecran de Romain (1 470 px de large, format 1,7) ;
// un ecran mai estrech los atenh mai luènh (zoom mai pichon), un mai larg
// mai prèp. La barra, ela, marca totjorn la distància vertadièra.
const LARGOR_REF = 1470,
	FORMAT_REF = 1.7;
let decalEcran = 0;
export const fixarEcran = (w, h) => {
	if (!(w > 0 && h > 0)) return;
	const e = Math.min(w, h * FORMAT_REF);
	decalEcran = Math.max(-2.4, Math.min(0.6, Math.log2(e / LARGOR_REF)));
};
// lo zoom ont 110 px fan exactament `km` a la latitud `lat` (sus l'ecran de
// referéncia ; decalat segon la talha de l'ecran)
export const zÈscala = (km, lat = LAT_REF) => Math.log2((ESCALA_PX * MERC * Math.cos((lat * Math.PI) / 180)) / (km * 1000)) + decalEcran;
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

// Los sulhets, en km de barra (« dès » : a partir d'aquela valor en s'aprochant)
export const KM = {
	plenas: 700, // las lengas son plenas fins a 700 km ; a 1 000 km, sonque lor contorn
	detalh: [400, 200], // las autras jaces arriban de 400 a 200 km (a 500 km, sonque las lengas)
	rius: 150,
	dialectes: 100, // 150 km e mai : las lengas unidas
	capitalas: 70, // las estelas de las vilas grandas : a 70 km (Romain, 2026-10-10 : « les villes devraient apparaître à 70 km » ; èra 200 puèi 150)
	nomsCapitalas: 70, // lors noms, amb las estelas
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
	ensenhament: [300, 0],
	cercles: [300, 0],
	culturaOc: [300, 0],
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
// d'ensemble de l'Occitània (tot lo domeni, sus totes los aparelhs ; 70 km sus
// l'ordenador de Romain, 2026-10-11)
export const OCCITANAS = new Set(['frontiera', 'dialectes', 'toponimia', 'calandretas', 'ensenhament', 'cercles', 'culturaOc', 'librarias', 'lieusInteres', 'festas', 'regions', 'despartaments']);
// (la vista d'ensemble : tot lo domeni dins l'espaci liure de l'ecran, 70 km sus
// l'ordenador de Romain : vistaOccitana dins CartaOccitania, 2026-10-11)
// lo zoom ont anar per veire una jaça (null : se vei ja)
export function zPlaja(id, z, lat = LAT_REF) {
	const pl = PLAJAS[id];
	if (!pl) return null;
	if (z < zDès(pl[0], lat)) return zCran(pl[0], lat);
	if (pl[1] && z > zÈscala(pl[1], lat)) return Math.floor(zÈscala(pl[1], lat) / PAS_ZOOM) * PAS_ZOOM;
	return null;
}

// Los zooms de la grilha, calculats a la latitud del centre de la carta
// (CartaOccitania la balha a cada movement, fixarLatEscala) : « 20 km » es
// 20 km a la barra, al nòrd coma al sud (retorn de Romain, 2026-10-09 : las
// comunas, a zoom fix, s'amagavan al Cantal). Las valors entre parentèsis son
// los zooms d'abans, al mitan de l'Occitània.
let latEscala = LAT_REF;
export const fixarLatEscala = (lat) => {
	if (Number.isFinite(lat)) latEscala = lat;
};
export const Z = {
	// las estelas cedisson al satellit quand la barra marca 20 km (8,75)
	get RELAIS() {
		return zCran(20, latEscala);
	},
	// las tuèlas del satellit se cargan, invisiblas, un cran de zoom avant (8,25)
	get PRECARGA() {
		return this.RELAIS - 0.5;
	},
	// l'icòna dels ponches espelís de son estela a 10 km (10 ; ara lo primièr cran de 10 km)
	get ICONAS() {
		return zCran(10, latEscala);
	},
	// pas pus de noms de vilas pausats per las estelas a 10 km (10)
	get DETALH_1() {
		return zCran(10, latEscala);
	},
	// las comunas a 7 km (10,5)
	get COMUNAS() {
		return zCran(KM.comunas, latEscala);
	},
	// ont se va en clicant un luòc : 7 km (10,5)
	get VOL() {
		return zCran(7, latEscala);
	},
	// las províncias de 1789 s'escantisson fins a 7 km (10,5)
	get PROV_MAX() {
		return zCran(7, latEscala);
	},
	// governaments de luènh (100 km), províncias de prèp (70 km) (6,875)
	get GOV_PROV() {
		return zDès(70, latEscala) - 0.06;
	},
	// lo survòl : regions a partir de 70 km (6,9), despartaments de 40 km (èra 30 :
	// retorn de Romain, 2026-10-10, « en dessous de 40 on devrait pouvoir cliquer sur les départements »)
	// fins a 7 km (10,75)
	get REG_0() {
		return zDès(70, latEscala);
	},
	get DEP_0() {
		return zDès(40, latEscala);
	},
	get DEP_1() {
		return zDès(5, latEscala);
	},
	// las tenchas dels dialèctes s'escantisson de 10 a 5 km (10 a 11) : de prèp,
	// se vesián pas pus e se causissián per res ; lo dialècte del centre de la
	// carta s'escriu al dessús de l'escala (retorn de Romain, 2026-10-11)
	get TENCHAS_0() {
		return zDès(10, latEscala);
	},
	get TENCHAS_1() {
		return zDès(5, latEscala);
	},
	// los parcs a partir de 150 km (6)
	get PARCS() {
		return zDès(150, latEscala);
	},
	// un grand ecran arriba pas dirèctament sul satellit (8,5)
	get ARRIBADA_MAX() {
		return zCran(30);
	}
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
// de 1 a 0 : las tenchas dels dialèctes de prèp (0 = escantidas, pas pus causiblas)
export const aTenchas = (z) => clamp((Z.TENCHAS_1 - z) / (Z.TENCHAS_1 - Z.TENCHAS_0));
export const aDetalh = (n, z) => easeS(clamp((z - n.z500) / (n.z300 - n.z500)));
