// Las autras lengas de la carta, pintadas coma l'occitan (colaLenga.js) :
// lo catalan d'en primièr (demanda de Romain, 2026-10-08), puèi las autras
// lengas de França. Per lenga : sas donadas, sa color unida (de luènh), una
// color per dialècte (tèma sorne, clar, daltonisme), e sas zònas « a despart »
// (causidas solas, pas pintadas amb las autras).
//
// Los còdis dels dialèctes son prefixats (« ca-central ») : se mesclan pas
// amb los dels dialèctes occitans dins la causida (pastilhas, istoric).

export const LENGAS = {
	catalan: {
		kod: 'catalan',
		pref: 'ca-',
		lang: 'ca', // (atribut lang dels noms, pels lectors d'ecran)
		url: '/data/catalan.json',
		nom: { oc: 'catalan', fr: 'catalan', endo: 'català' },
		// lo nom de la lenga unida, de luènh (entre Lhèida e Tarragona)
		eti: [1.15, 41.55],
		// l'aur de la senhera, luènh del roge de l'Occitània unida
		color: { sorne: '#f2b632', clar: '#9a6a00', dalt: '#e69f00' },
		tèxt: { sorne: '#ffe2a0', clar: '#5c3f00', dalt: '#ffe0a0' },
		// Los dos blòcs de Veny se legisson : l'oriental en blaus, l'occidental
		// en verds (de tons freds, luènh de la paleta occitana, cauda)
		dial: {
			sorne: { rossellones: '#5ab0ff', central: '#4a7dff', balear: '#36c5d0', algueres: '#b9e4c9', nordoccidental: '#4fc25f', tortosi: '#b5d94a', valencia: '#22b39b' },
			clar: { rossellones: '#2f7fcf', central: '#2546a8', balear: '#13878f', algueres: '#4f8a66', nordoccidental: '#2a7a36', tortosi: '#6f8a12', valencia: '#11705f' },
			dalt: { rossellones: '#56b4e9', central: '#0072b2', balear: '#cc79a7', algueres: '#d55e00', nordoccidental: '#009e73', tortosi: '#f0e442', valencia: '#e69f00' }
		},
		// La Catalonha del Nòrd, la part de França (demanda de Romain : « sélectionnable
		// de manière à part entière ») : sa zòna recòbre lo rossellonés de França
		apart: { 'catalunya-nord': { dins: ['rossellones'] } },
		// Las zònas, del nòrd al sud : los noms de la carta e del panèl son dins
		// la lenga (retorn de Romain : « les noms dans cette langue-là ») ;
		// l'occitan e lo francés venon al survòl, dins la barra d'en bas.
		// { k : còdi, ca : nom, long : dins la bulla d'una vila, oc, fr } (noms
		// occitans de validar per Romain)
		pastilhas: [
			{ k: 'catalunya-nord', ca: 'Catalunya Nord', oc: 'Catalonha del Nòrd', fr: 'Catalogne nord' },
			{ k: 'rossellones', ca: 'rossellonès', oc: 'rossellonés', fr: 'roussillonnais' },
			{ k: 'central', ca: 'central', long: 'català central', oc: 'central', fr: 'central' },
			{ k: 'nordoccidental', ca: 'nord-occidental', long: 'català nord-occidental', oc: 'nòrd-occidental', fr: 'nord-occidental' },
			{ k: 'tortosi', ca: 'tortosí', oc: 'tortosin', fr: 'tortosin' },
			{ k: 'valencia', ca: 'valencià', oc: 'valencian', fr: 'valencien' },
			{ k: 'balear', ca: 'balear', oc: 'balear', fr: 'baléare' },
			{ k: 'algueres', ca: 'alguerès', oc: 'alguerés', fr: 'alguérois' }
		],
		sota: { oc: 'dialècte catalan', fr: 'dialecte catalan' },
		sotaApart: { oc: 'catalan de França', fr: 'catalan de France' },
		// lo nom de la lenga unida, de luènh, dins la lenga
		nomCarta: 'CATALÀ',
		atribucion:
			'Catalan : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), comarcas e municipalitats © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL), dialèctes d\'aprèp la Viquipèdia (classament de Veny)'
	}
};

// Los prefixes de totas las lengas : un còdi sens prefix es occitan
const PREFIXES = Object.values(LENGAS).map((l) => l.pref);
export const lengaDeKod = (k) => Object.values(LENGAS).find((l) => k.startsWith(l.pref))?.kod ?? 'occitan';
export const esOccitan = (k) => !PREFIXES.some((p) => k.startsWith(p));

// Çò que la carta en estelas pren d'una lenga : sas vilas (nom dins la lenga,
// renc, dialècte per la bulla) e sa còsta, quand son fichièr las a
export function fonsLenga(lenga, d) {
	const nomDial = Object.fromEntries((lenga.pastilhas || []).map((p) => [p.k, p.long ?? p.ca]));
	return {
		vilas: (d.vilas || []).map(([lon, lat, nom, renc, dia]) => ({
			lon,
			lat,
			nom,
			renc,
			dialTèxt: nomDial[dia] ?? lenga.nom.endo
		})),
		costa: d.costa || null
	};
}
