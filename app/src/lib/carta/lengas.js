// Las autras lengas de la carta, pintadas coma l'occitan (colaLenga.js) :
// lo catalan d'en primièr (demanda de Romain, 2026-10-08), puèi las autras
// lengas de França. Per lenga : sas donadas, sa color unida (de luènh), una
// color per dialècte (tèma sorne, clar, daltonisme), e sas zònas « a despart »
// (causidas solas, pas pintadas amb las autras).
//
// Los còdis dels dialèctes son prefixats (« ca-central ») : se mesclan pas
// amb los dels dialèctes occitans dins la causida (pastilhas, istoric).

// Les couleurs des langues : lib/styles/palette.js (CARTE.langues).
import { CARTE } from '../styles/palette.js';

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
		// (07-11 : les couleurs des langues sont celles des en-têtes des jeux,
		// les mêmes dans les deux thèmes, comme l'occitan au rouge des boutons ;
		// les langues d'oïl gardent leur bleu #006aa7, choisi par Romain le
		// 10-10, en camaïeu de bleu : catalan et alsacien or, arpitan ocre,
		// basque et flamand olive, breton sarcelle, francique et corse prune ;
		// une teinte ne revient que pour deux langues éloignées)
		color: { sorne: CARTE.langues.catalan, clar: CARTE.langues.catalan, dalt: '#e69f00' },
		tèxt: { sorne: '#ffe2a0', clar: '#2a1a10', dalt: '#ffe0a0' },
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
	},
	// L'arpitan (Romain, 2026-10-09) : 7 dialèctes coma lo catalan, los parlars
	// de la Vouiquipèdia dedins ; la frontièra amb l'occitan es la de la carta
	// occitana, e la benda de contacte es en asclas (SIG/arpitan/FONTS.md)
	arpitan: {
		kod: 'arpitan',
		pref: 'frp-',
		lang: 'frp',
		url: '/data/arpitan.json',
		nom: { oc: 'arpitan', fr: 'arpitan', endo: 'arpetan' },
		// (entre Liyon e Geneva)
		eti: [5.65, 45.95],
		// verd, coma sus las cartas de las lengas de França (Romain, 2026-10-09) ;
		// lo basc aurà un verd pus escur (sorne #2f8a57, clar #1b5e20, dalt #004d40)
		color: { sorne: CARTE.langues.arpitan, clar: CARTE.langues.arpitan, dalt: '#009e73' },
		tèxt: { sorne: '#d6f5d8', clar: '#fbf1e1', dalt: '#c8f0e2' },
		// violets e malvas : luènh de la paleta occitana cauda (roge auvernhat e
		// jaune vivaroaupenc vesins) e dels blaus-verds del catalan
		dial: {
			sorne: { lyonnais: '#c08bff', bressan_jurassien: '#8f7dff', dauphinois: '#e07ad6', savoyard: '#a95ce0', romand: '#6f8bff', alpin: '#d6b4ff', faetar: '#ff8fc8' },
			clar: { lyonnais: '#7a3fc4', bressan_jurassien: '#4b3fb8', dauphinois: '#a33a99', savoyard: '#6a2a9c', romand: '#2f4fc0', alpin: '#8a62b8', faetar: '#c2457f' },
			dalt: { lyonnais: '#cc79a7', bressan_jurassien: '#0072b2', dauphinois: '#d55e00', savoyard: '#009e73', romand: '#56b4e9', alpin: '#f0e442', faetar: '#e69f00' }
		},
		apart: { 'arpitan-franca': { dins: ['lyonnais', 'bressan_jurassien', 'dauphinois', 'savoyard'] } },
		// noms arpitans (ORB, Vouiquipèdia) ; los dels gropes son de validar
		pastilhas: [
			{ k: 'arpitan-franca', frp: 'Arpitania de France', oc: 'arpitan de França', fr: 'arpitan de France' },
			{ k: 'bressan_jurassien', frp: 'brêssan-jurassien', oc: 'bressan-jurassian', fr: 'bressan-jurassien' },
			{ k: 'romand', frp: 'romand', oc: 'romand', fr: 'romand' },
			{ k: 'lyonnais', frp: 'liyonês', oc: 'lionés', fr: 'lyonnais' },
			{ k: 'savoyard', frp: 'savoyârd', oc: 'savoiard', fr: 'savoyard' },
			{ k: 'alpin', frp: 'alpin', oc: 'alpenc', fr: 'alpin' },
			{ k: 'dauphinois', frp: 'dârfenouès', oc: 'delfinenc', fr: 'dauphinois' },
			{ k: 'faetar', frp: 'faétâre', oc: 'faetar', fr: 'faetar' }
		],
		sota: { oc: 'dialècte arpitan', fr: 'dialecte arpitan' },
		sotaApart: { oc: 'arpitan de França', fr: 'arpitan de France' },
		nomCarta: 'ARPETAN',
		atribucion:
			'Arpitan : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), comunas de Soïssa e d\'Itàlia © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL), lengas de las comunas OFS, domeni d\'aprèp <a href="https://commons.wikimedia.org/wiki/File:Arpitan_francoprovencal_map.jpg" target="_blank" rel="noopener">arpitania.eu</a> (CC BY-SA 3.0), parlars d\'aprèp la Vouiquipèdia'
	},
	// Lo basc (Romain, 2026-10-09) : estat actual de la lenga (CAPB en França,
	// la lei en Espanha, zòna mixta de Navarra en asclas), Araba e navarrés
	// oriental escantits (pus pallas), dialèctes de Zuazo (SIG/basc/FONTS.md)
	basc: {
		kod: 'basc',
		pref: 'eu-',
		lang: 'eu',
		url: '/data/basc.json',
		nom: { oc: 'basc', fr: 'basque', endo: 'euskara' },
		// (entre Donostia e Iruña)
		eti: [-1.95, 43.08],
		// lo verd pus escur de las cartas de las lengas de França (Romain, 2026-10-09)
		color: { sorne: CARTE.langues.basc, clar: CARTE.langues.basc, dalt: '#004d40' },
		tèxt: { sorne: '#cdeedc', clar: '#fbf1e1', dalt: '#c8f0e2' },
		// de verds, de l'oliva a l'aiga-marina : luènh del violet gascon vesin
		dial: {
			sorne: { mendebalekoa: '#3fae6a', erdialdekoa: '#8fd14f', nafarra: '#c9d66b', nafar_lapurtera: '#2fb8a0', zuberera: '#6fd6c6', ekialdeko_nafarra: '#9db8a0', arabakoa: '#a8c49a' },
			clar: { mendebalekoa: '#1f7a45', erdialdekoa: '#4f8a1f', nafarra: '#7d8a1f', nafar_lapurtera: '#13786a', zuberera: '#2f8f84', ekialdeko_nafarra: '#5f7a64', arabakoa: '#6a8060' },
			dalt: { mendebalekoa: '#e69f00', erdialdekoa: '#009e73', nafarra: '#f0e442', nafar_lapurtera: '#d55e00', zuberera: '#cc79a7', ekialdeko_nafarra: '#999999', arabakoa: '#bbbbbb' }
		},
		apart: { 'basc-franca': { dins: ['nafar_lapurtera', 'zuberera'] } },
		// noms basques (Zuazo, Euskaltzaindia) ; los occitans son de validar
		pastilhas: [
			{ k: 'basc-franca', eu: 'Iparralde', oc: 'País Basc del Nòrd', fr: 'Pays basque nord' },
			{ k: 'nafar_lapurtera', eu: 'nafar-lapurtera', oc: 'navarrés-labordin', fr: 'navarro-labourdin' },
			{ k: 'zuberera', eu: 'zuberera', oc: 'soletin', fr: 'souletin' },
			{ k: 'mendebalekoa', eu: 'mendebalekoa', long: 'mendebaleko euskara', oc: 'biscaïn', fr: 'biscayen' },
			{ k: 'erdialdekoa', eu: 'erdialdekoa', long: 'erdialdeko euskara', oc: 'gipuscoan', fr: 'guipuscoan' },
			{ k: 'nafarra', eu: 'goi-nafarrera', oc: 'naut navarrés', fr: 'haut-navarrais' },
			{ k: 'ekialdeko_nafarra', eu: 'ekialdeko nafarrera', oc: 'navarrés oriental', fr: 'navarrais oriental' },
			{ k: 'arabakoa', eu: 'Arabako euskara', oc: 'alavés', fr: 'alavais' }
		],
		sota: { oc: 'dialècte basc', fr: 'dialecte basque' },
		sotaApart: { oc: 'basc de França', fr: 'basque de France' },
		nomCarta: 'EUSKARA',
		atribucion:
			'Basc : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), comunas d\'Espanha © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL), zònas de la lei navarresa de 1986, dialèctes d\'aprèp Koldo Zuazo (2008) e la Viquipèdia en basc'
	},
	// L'alsacian (2026-10-10) : lo continuum alemanic d'Alsàcia, del Bade, de
	// Soïssa e de Soàbia ; Alsàcia a despart. Lo francic (Platt) es una autra
	// lenga (lista del ministèri de la Cultura, causida de Romain) : jaça
	// seguenta. Tablèu comun : SIG/alsacian/FONTS.md
	alsacian: {
		kod: 'alsacian',
		pref: 'gsw-',
		lang: 'gsw',
		url: '/data/alsacian.json',
		nom: { oc: 'alsacian', fr: 'alsacien', endo: 'Elsässisch' },
		// (en Alsàcia : lo nom de luènh, causida de Romain)
		eti: [7.55, 48.45],
		// roges e irangets, las colors d'Alsàcia : luènh del blau lorren e del verd arpitan
		color: { sorne: CARTE.langues.alsacian, clar: CARTE.langues.alsacian, dalt: '#d55e00' },
		tèxt: { sorne: '#ffe0da', clar: '#2a1a10', dalt: '#ffe8d8' },
		dial: {
			sorne: { niederalemannisch: '#ff6b5a', hochalemannisch: '#ff9a4d', hochstalemannisch: '#ffc44d', schwabisch: '#e0484f' },
			clar: { niederalemannisch: '#c2351f', hochalemannisch: '#c2621a', hochstalemannisch: '#a8780f', schwabisch: '#9a1f2a' },
			dalt: { niederalemannisch: '#d55e00', hochalemannisch: '#e69f00', hochstalemannisch: '#f0e442', schwabisch: '#009e73' }
		},
		apart: { 'alsacian-franca': { dins: ['niederalemannisch', 'hochalemannisch'] } },
		// noms dins la lenga ; los occitans son de validar
		pastilhas: [
			{ k: 'alsacian-franca', gsw: 'Elsass', oc: 'Alsàcia', fr: 'Alsace' },
			{ k: 'niederalemannisch', gsw: 'Niederalemannisch', long: 'Niederalemannisch (Elsässisch)', oc: 'bas alemanic', fr: 'bas-alémanique' },
			{ k: 'hochalemannisch', gsw: 'Hochalemannisch', oc: 'naut alemanic', fr: 'haut-alémanique' },
			{ k: 'hochstalemannisch', gsw: 'Höchstalemannisch', oc: 'alemanic superior', fr: 'alémanique supérieur' },
			{ k: 'schwabisch', gsw: 'Schwäbisch', oc: 'soabe', fr: 'souabe' }
		],
		sota: { oc: 'dialècte alemanic', fr: 'dialecte alémanique' },
		sotaApart: { oc: 'alsacian de França', fr: 'alsacien de France' },
		nomCarta: 'ELSÄSSISCH',
		atribucion:
			'Alsacian : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), BKG VG250 (© <a href="https://www.bkg.bund.de" target="_blank" rel="noopener">BKG</a> 2026, <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener">dl-de/by-2-0</a>), swisstopo ; limits d\'aprèp Wenker, Constant This (1887) e las cartas « Sprachen in Elsass-Lothringen » e « Alemannic dialects » de Wikimedia Commons (CC BY-SA)'
	},
	// Lo francic (Platt) (2026-10-10) : mosellan, renan, meridional,
	// luxemborgés, del País germanofòn de Mosèla al Luxemborg, a la Sarra e al
	// Palatinat ; Mosèla germanofòna a despart (tablèu de SIG/alsacian)
	francic: {
		kod: 'francic',
		pref: 'frk-',
		// (« lb » : la clau del nom dins la lenga ; « de » es la de la lenga maire d'un sosdialècte)
		lang: 'lb',
		url: '/data/francic.json',
		nom: { oc: 'francic (platt)', fr: 'francique (platt)', endo: 'Platt' },
		// (en Mosèla, retorn de Romain : « le Platt devrait être sur la Moselle »)
		eti: [6.75, 49.08],
		// violets e ròses : luènh del blau lorren e del roge alsacian vesins
		color: { sorne: CARTE.langues.francic, clar: CARTE.langues.francic, dalt: '#cc79a7' },
		tèxt: { sorne: '#efe0ff', clar: '#fbf1e1', dalt: '#ffe0f0' },
		dial: {
			sorne: { letzebuergesch: '#e85d9f', moselfrankisch: '#c86bff', rheinfrankisch: '#9a7bff', sudfrankisch: '#ff8fd0', ripuarisch: '#b04fd0', limburgisch: '#d68fff' },
			clar: { letzebuergesch: '#b0246a', moselfrankisch: '#8a2fc4', rheinfrankisch: '#5a3fc4', sudfrankisch: '#c2458f', ripuarisch: '#7a1f9a', limburgisch: '#9a4fc4' },
			dalt: { letzebuergesch: '#cc79a7', moselfrankisch: '#0072b2', rheinfrankisch: '#56b4e9', sudfrankisch: '#f0e442', ripuarisch: '#999999', limburgisch: '#bbbbbb' }
		},
		apart: { 'francic-franca': { dins: ['letzebuergesch', 'moselfrankisch', 'rheinfrankisch', 'sudfrankisch'] } },
		pastilhas: [
			{ k: 'francic-franca', lb: 'Deitsch-Lothringen', oc: 'Mosèla germanofòna', fr: 'Moselle germanophone' },
			{ k: 'letzebuergesch', lb: 'Lëtzebuergesch', oc: 'luxemborgés', fr: 'luxembourgeois' },
			{ k: 'moselfrankisch', lb: 'Moselfränkisch', oc: 'francic mosellan', fr: 'francique mosellan' },
			{ k: 'rheinfrankisch', lb: 'Rheinfränkisch', oc: 'francic renan', fr: 'francique rhénan' },
			{ k: 'sudfrankisch', lb: 'Südfränkisch', oc: 'francic meridional', fr: 'francique méridional' },
			{ k: 'ripuarisch', lb: 'Ripuarisch', oc: 'ripuari', fr: 'ripuaire' },
			{ k: 'limburgisch', lb: 'Platdiets', oc: 'limborgés', fr: 'limbourgeois' }
		],
		sota: { oc: 'dialècte francic', fr: 'dialecte francique' },
		sotaApart: { oc: 'francic de França', fr: 'francique de France' },
		nomCarta: 'PLATT',
		atribucion:
			'Francic : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), BKG VG250 (© <a href="https://www.bkg.bund.de" target="_blank" rel="noopener">BKG</a> 2026, <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener">dl-de/by-2-0</a>), data.public.lu, © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL) ; limits d\'aprèp Wenker, Constant This (1887), las isoglòssas de Mosèla e la carta « Rheinischer Fächer » de Wikimedia Commons (CC BY-SA)'
	},
	// Lo flamenc e lo neerlandés (2026-10-10, Romain : « le flamand, ce n'est
	// pas un trou, c'est une autre langue », amb son continuum en Belgica e als
	// Païses Basses) : Westhoek d'aprèp Vanneste (1856), dialèctes de Daan e
	// Blok (1969) ; lo bas saxon e lo frison, d'autras lengas, dins la meteissa
	// jaça per pas daissar de vuèg ; Flandres de França a despart (SIG/flamenc/FONTS.md)
	flamenc: {
		kod: 'flamenc',
		pref: 'nl-',
		lang: 'vls',
		url: '/data/flamenc.json',
		nom: { oc: 'flamenc e neerlandés', fr: 'flamand et néerlandais', endo: 'Vlaams en Nederlands' },
		eti: [4.9, 51.75],
		// irangets (los Païses Basses) per lo neerlandés, bruns pel bas saxon,
		// turquesa pel frison : luènh del blau picard vesin
		color: { sorne: CARTE.langues.flamenc, clar: CARTE.langues.flamenc, dalt: '#e69f00' },
		tèxt: { sorne: '#ffe6cc', clar: '#fbf1e1', dalt: '#fff0d0' },
		dial: {
			sorne: {
				flamenc_occidental: '#ff9a3c', flamenc_oriental: '#ffbf4d', zelandes: '#ff7a5a', brabancon: '#ffd166', limborgues: '#e8b04a',
				olandes: '#ff6a3d', utrechtes: '#ffb38a', zuid_gelders: '#f0a060',
				gronings: '#c8a27a', stellingwerfs: '#b89a7a', drents: '#d4b48a', twents: '#a8845a', gelders_overijssels: '#bf9a6a', veluws: '#caa880',
				frison: '#4fc8d8', flevoland: '#d8c8b0'
			},
			clar: {
				flamenc_occidental: '#b35a00', flamenc_oriental: '#a8700a', zelandes: '#b03a1a', brabancon: '#8a6a00', limborgues: '#8a5a10',
				olandes: '#a82a0a', utrechtes: '#a85a3a', zuid_gelders: '#9a5a1a',
				gronings: '#7a5a3a', stellingwerfs: '#6a5a4a', drents: '#7a6a4a', twents: '#5a4a2a', gelders_overijssels: '#6a5030', veluws: '#7a6040',
				frison: '#0f7a8a', flevoland: '#8a7a60'
			},
			dalt: {
				flamenc_occidental: '#e69f00', flamenc_oriental: '#f0e442', zelandes: '#d55e00', brabancon: '#cc79a7', limborgues: '#009e73',
				olandes: '#0072b2', utrechtes: '#56b4e9', zuid_gelders: '#999999',
				gronings: '#bbbbbb', stellingwerfs: '#999999', drents: '#dddddd', twents: '#bbbbbb', gelders_overijssels: '#999999', veluws: '#dddddd',
				frison: '#56b4e9', flevoland: '#eeeeee'
			}
		},
		apart: { frans_vlaams: { dins: ['flamenc_occidental'] } },
		// noms dins la lenga ; los occitans son de validar
		pastilhas: [
			{ k: 'frans_vlaams', vls: 'Frans-Vlaams', oc: 'flamenc de França', fr: 'flamand de France' },
			{ k: 'flamenc_occidental', vls: 'West-Vlaams', oc: 'flamenc occidental', fr: 'flamand occidental' },
			{ k: 'flamenc_oriental', vls: 'Oost-Vlaams', oc: 'flamenc oriental', fr: 'flamand oriental' },
			{ k: 'zelandes', vls: 'Zeeuws', oc: 'zelandés', fr: 'zélandais' },
			{ k: 'brabancon', vls: 'Brabants', oc: 'brabançon', fr: 'brabançon' },
			{ k: 'limborgues', vls: 'Limburgs', oc: 'limborgés', fr: 'limbourgeois' },
			{ k: 'olandes', vls: 'Hollands', oc: 'olandés', fr: 'hollandais' },
			{ k: 'utrechtes', vls: 'Utrechts', oc: 'utrechtés', fr: 'utrechtois' },
			{ k: 'zuid_gelders', vls: 'Zuid-Gelders', oc: 'gueldrés meridional', fr: 'gueldrois méridional' },
			{ k: 'gronings', vls: 'Grunnegs', oc: 'gronings', fr: 'groningois' },
			{ k: 'stellingwerfs', vls: 'Stellingwerfs', oc: 'stellingwerfs', fr: 'stellingwerfois' },
			{ k: 'drents', vls: 'Drents', oc: 'drents', fr: 'drenthois' },
			{ k: 'twents', vls: 'Twents', oc: 'twents', fr: 'twentois' },
			{ k: 'gelders_overijssels', vls: 'Achterhoeks, Sallands', oc: 'gueldrés-overijssels', fr: 'gueldrois-overijsselois' },
			{ k: 'veluws', vls: 'Veluws', oc: 'veluws', fr: 'veluwois' },
			{ k: 'frison', vls: 'Frysk', oc: 'frison', fr: 'frison' },
			{ k: 'flevoland', vls: 'Flevoland', oc: 'pòlders del Flevoland', fr: 'polders du Flevoland' }
		],
		sota: { oc: 'dialècte neerlandés', fr: 'dialecte néerlandais' },
		sotaApart: { oc: 'flamenc de França', fr: 'flamand de France' },
		nomCarta: 'VLAAMS · NEDERLANDS',
		atribucion:
			'Flamenc e neerlandés : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), CBS / PDOK 2025 (CC BY 4.0), SPF Finanças, © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a> (ODbL) ; Westhoek d\'aprèp A. Vanneste (1972), dialèctes d\'aprèp Daan e Blok (1969) via Wikimedia Commons (CC BY-SA)'
	},
	// Lo còrs (2026-10-10) : los dialèctes de Corsega (cartas de Wikimedia
	// Commons calada), lo galurés e lo sassarés de Sardenha (leis regionalas
	// 26/1997 e 22/2018), Bonifacio ligur, Capraia escantit ; Corsega a despart
	// (SIG/cors/FONTS.md)
	cors: {
		kod: 'cors',
		pref: 'co-',
		lang: 'co',
		url: '/data/cors.json',
		nom: { oc: 'còrs', fr: 'corse', endo: 'corsu' },
		eti: [9.05, 42.15],
		// ocres e tèrras cuechas (lo granit de Corsega), un blau pel ligur
		color: { sorne: CARTE.langues.cors, clar: CARTE.langues.cors, dalt: '#e69f00' },
		tèxt: { sorne: '#ffe3d6', clar: '#2a1a10', dalt: '#fff0d0' },
		dial: {
			sorne: { cismuntincu: '#ff8a5c', transizione: '#ffbf6b', oltramuntincu: '#e0503a', gadduresu: '#d99a5a', sassaresu: '#b8783f', bunifazzinu: '#7fb0ff', capraiese: '#ff8a5c' },
			clar: { cismuntincu: '#c2501f', transizione: '#a8701a', oltramuntincu: '#9a2a1a', gadduresu: '#8a5a2a', sassaresu: '#6a4a2a', bunifazzinu: '#2f5fb0', capraiese: '#c2501f' },
			dalt: { cismuntincu: '#e69f00', transizione: '#f0e442', oltramuntincu: '#d55e00', gadduresu: '#cc79a7', sassaresu: '#999999', bunifazzinu: '#0072b2', capraiese: '#bbbbbb' }
		},
		apart: { 'cors-franca': { dins: ['cismuntincu', 'transizione', 'oltramuntincu', 'bunifazzinu'] } },
		// noms corses ; los occitans son de validar
		pastilhas: [
			{ k: 'cors-franca', co: 'Corsica', oc: 'Corsega', fr: 'Corse' },
			{ k: 'cismuntincu', co: 'cismuntincu', oc: 'còrs del nòrd', fr: 'corse du Nord' },
			{ k: 'transizione', co: 'transizione', long: 'parlà di transizione', oc: 'parlars de transicion', fr: 'parlers de transition' },
			{ k: 'oltramuntincu', co: 'pumuntincu', oc: 'còrs del sud', fr: 'corse du Sud' },
			{ k: 'gadduresu', co: 'gadduresu', oc: 'gallurés', fr: 'gallurais' },
			{ k: 'sassaresu', co: 'sassaresu', oc: 'sassarés', fr: 'sassarais' },
			{ k: 'bunifazzinu', co: 'bunifazzinu', oc: 'bonifacenc', fr: 'bonifacien (ligure)' },
			{ k: 'capraiese', co: 'capraiese', oc: 'parlar de Capraia', fr: 'parler de Capraia (éteint)' }
		],
		sota: { oc: 'parlar còrs', fr: 'parler corse' },
		sotaApart: { oc: 'còrs de França', fr: 'corse de France' },
		nomCarta: 'CORSU',
		atribucion:
			'Còrs : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), comunas ISTAT (CC BY 4.0) ; parlars d\'aprèp las cartas « Parlers de Corse » de Wikimedia Commons (CC BY-SA), leis regionalas sardas 26/1997 e 22/2018 ; noms corses de la Collectivitat de Corsega (Licéncia dobèrta)'
	},
	// Lo breton (2026-10-10) : limit de Sébillot (1886, estat istoric coma per
	// l'occitan), quatre dialèctes d'aprèp los ancians evescats, breton escantit
	// del país de Guerranda pus palle, zòna mixta en asclas (SIG/breton/FONTS.md)
	breton: {
		kod: 'breton',
		pref: 'br-',
		lang: 'br',
		url: '/data/breton.json',
		nom: { oc: 'breton', fr: 'breton', endo: 'brezhoneg' },
		// (al mitan de Bretanha)
		eti: [-3.25, 48.2],
		// turquesa e verds : luènh del blau ardesa del galò vesin
		color: { sorne: CARTE.langues.breton, clar: CARTE.langues.breton, dalt: '#009e73' },
		tèxt: { sorne: '#d3f7ec', clar: '#2a1a10', dalt: '#c8f0e2' },
		dial: {
			sorne: { leoneg: '#59d9a9', tregerieg: '#2fc4c4', kerneveg: '#7fd67a', gwenedeg: '#c8e070', gwenrann: '#c8e070' },
			clar: { leoneg: '#1f8f6a', tregerieg: '#13808a', kerneveg: '#3f8f3a', gwenedeg: '#7d8f1f', gwenrann: '#7d8f1f' },
			dalt: { leoneg: '#009e73', tregerieg: '#56b4e9', kerneveg: '#e69f00', gwenedeg: '#f0e442', gwenrann: '#bbbbbb' }
		},
		// noms bretons ; los occitans son de validar
		pastilhas: [
			{ k: 'leoneg', br: 'leoneg', oc: 'leonés', fr: 'léonard' },
			{ k: 'tregerieg', br: 'tregerieg', oc: 'tregorés', fr: 'trégorrois' },
			{ k: 'kerneveg', br: 'kerneveg', oc: 'cornoalhés', fr: 'cornouaillais' },
			{ k: 'gwenedeg', br: 'gwenedeg', oc: 'vanetés', fr: 'vannetais' },
			{ k: 'gwenrann', br: 'brezhoneg Gwenrann', oc: 'breton escantit', fr: 'breton de Guérande (éteint)' }
		],
		sota: { oc: 'dialècte breton', fr: 'dialecte breton' },
		sotaApart: { oc: 'breton', fr: 'breton' },
		nomCarta: 'BREZHONEG',
		atribucion:
			'Breton : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), limit d\'aprèp Paul Sébillot (1886, domeni public), dialèctes d\'aprèp los ancians evescats, noms bretons de la Wikipèdia en breton'
	},
	// Las lengas d'oïl (Romain, 2026-10-09, cahier §11) : una familha de lengas,
	// pas una lenga amb de dialèctes. De luènh una sola zòna ; de prèp las 9
	// lengas de la lista oficiala e los parlars del Centre e de l'Oèst, cada
	// comuna amb lo parlar de son canton dins la carta dels Archius nacionals
	// (SIG/oil/FONTS.md). Los noms son en francés (pas de lenga d'escritura
	// comuna) ; los noms occitans son de validar.
	oil: {
		kod: 'oil',
		pref: 'oil-',
		lang: 'fr',
		url: '/data/oil.json',
		// las lengas d'oïl separadas fins a 150 km, unidas a 200 (l'occitan s'unís a 150 : retorn de Romain, 2026-10-10)
		dialDès: 150,
		nom: { oc: 'lengas d’oïl', fr: 'langues d’oïl', endo: 'langues d’oïl' },
		// (entre París e Orleans)
		eti: [2.1, 48.3],
		// lo blau de las cartas de las lengas de França, luènh del blau de la mar
		// lo blau de Suècia (lo del drapèl, #006aa7 ; a l'ecran sus lo fons sorne, lo #005073 que Romain a mandat, 2026-10-10 : pas mai de blau violet)
		color: { sorne: CARTE.langues.oil, clar: CARTE.langues.oil, dalt: '#0072b2' },
		tèxt: { sorne: '#d6ebf8', clar: '#fbf1e1', dalt: '#cfe4ff' },
		// quatre familhas de blaus, una per grope : indigò al Nòrd (picard,
		// normand, valon), blau petròli a l'Èst (lo franc-comtés tira cap al verd
		// arpitan), ardesa a l'Oèst (lo galò pus escur), blauet pus viu pel
		// peitavin-santongés a despart ; lo Centre, pervenca palla
		dial: {
			sorne: {
				picard: '#7f95ff', chti: '#3fe0b8', rouchi: '#ff9f5a', wallon: '#a48cff', valon_lieges: '#ff6fa0', valon_namures: '#ffd24a', valon_oest: '#62e0a0', valon_sud: '#c58cff', normand: '#3f5bff',
				champenois: '#2fb4f0', lorrain: '#1588d8', bourguignon: '#6fd6ff', franc_comtois: '#1fd6c0',
				gallo: '#4f7fd0', oest: '#62a0ea', poitevin_saintongeais: '#3fc0ff', centre: '#7f9cff'
			},
			clar: {
				picard: '#4a66f0', chti: '#0f9f86', rouchi: '#d0661a', wallon: '#6a4fe0', valon_lieges: '#c2306a', valon_namures: '#a8840a', valon_oest: '#1f8f5a', valon_sud: '#7a3fc4', normand: '#1f2fc0',
				champenois: '#0a8fd0', lorrain: '#0063b0', bourguignon: '#2bb0e0', franc_comtois: '#00a08f',
				gallo: '#2f5fb0', oest: '#4a8ad8', poitevin_saintongeais: '#0098d8', centre: '#5a6ff0'
			},
			// (Okabe-Ito : 8 colors per 11 zònas, doas vesinas jamai parièras)
			dalt: {
				picard: '#e69f00', chti: '#009e73', rouchi: '#d55e00', wallon: '#999999', valon_lieges: '#cc79a7', valon_namures: '#f0e442', valon_oest: '#009e73', valon_sud: '#0072b2', normand: '#56b4e9',
				champenois: '#009e73', lorrain: '#56b4e9', bourguignon: '#f0e442', franc_comtois: '#cc79a7',
				gallo: '#d55e00', oest: '#999999', poitevin_saintongeais: '#f0e442', centre: '#dddddd'
			}
		},
		// lo ch'ti e lo rochi : de dialèctes del picard, pas de lengas (Romain,
		// 2026-10-10) ; lors pastilhas (« de ») e lors zònas apareisson quand lo
		// picard es causit ; colors vivas, per se destriar dins lo picard
		// del nòrd al sud, grope per grope ; « endo » : lo nom dins la lenga (SIG/oil/noms-lengas-endo.csv,
		// sonque las formas sorsadas ; champaignat causit per Romain ; Lorin, pas pro segur, es pas pres)
		pastilhas: [
			{ k: 'picard', fr: 'picard', oc: 'picard' },
			{ k: 'chti', fr: 'ch’ti', oc: 'ch’ti', de: 'picard' },
			{ k: 'rouchi', fr: 'rouchi', oc: 'rochi', de: 'picard' },
			{ k: 'wallon', endo: 'walon', fr: 'wallon', oc: 'valon' },
			{ k: 'valon_lieges', endo: 'lidjwès', fr: 'liégeois', oc: 'liegés', de: 'wallon' },
			{ k: 'valon_namures', endo: 'namurwès', fr: 'namurois', oc: 'namurés', de: 'wallon' },
			{ k: 'valon_oest', endo: 'walon do Coûtchant', fr: 'wallon de l’Ouest', oc: 'valon de l’oèst', de: 'wallon' },
			{ k: 'valon_sud', endo: 'walon nonnrece', fr: 'wallon du Sud', oc: 'valon del sud', de: 'wallon' },
			{ k: 'normand', endo: 'normaund', fr: 'normand', oc: 'normand' },
			{ k: 'champenois', endo: 'champaignat', fr: 'champenois', oc: 'campanés' },
			{ k: 'lorrain', fr: 'lorrain', oc: 'lorren' },
			{ k: 'bourguignon', endo: 'borguignon', fr: 'bourguignon-morvandiau', oc: 'borgonhon-morvandèl' },
			{ k: 'franc_comtois', endo: 'frainc-comtou', fr: 'franc-comtois', oc: 'franc-comtés' },
			{ k: 'gallo', endo: 'galo', fr: 'gallo', oc: 'galò' },
			{ k: 'oest', fr: 'parlers de l’Ouest', oc: 'parlars de l’Oèst' },
			{ k: 'poitevin_saintongeais', endo: 'parlanjhe', fr: 'poitevin-saintongeais', oc: 'peitavin-santongés' },
			{ k: 'centre', fr: 'parlers du Centre', oc: 'parlars del Centre' }
		],
		sota: { oc: 'lenga d’oïl', fr: 'langue d’oïl' },
		sotaApart: { oc: 'lenga d’oïl', fr: 'langue d’oïl' },
		nomCarta: 'LANGUES D’OÏL',
		atribucion:
			'Lengas d\'oïl : comunas IGN ADMIN EXPRESS 2026 (Licéncia dobèrta), parlars d\'aprèp la <a href="https://www.archives-nationales.culture.gouv.fr/centres-de-recherche/carte-linguistique-de-la-france" target="_blank" rel="noopener">Carta lingüistica de França</a> dels Archius nacionals (P.-H. Billy, S. Nadiras, J.-F. Moufflet), lista de las lengas Cerquiglini (1999)'
	}
};

// Les dialectes d'une langue sont un camaïeu de sa couleur (Romain, 07-11 :
// « trop de couleurs différentes qui se baladent »), comme les sous-pages de
// S'apren (vert pour Òbras, jaune pour Médias) : tour à tour plus sombre et
// plus clair, sans aller jusqu'au pastel, pour que deux dialectes voisins se
// distinguent. Mêmes couleurs dans les deux thèmes ; le daltonisme garde sa
// palette.
const CAMAIEU = [[0, null], [0.25, '#2a1a10'], [0.2, '#fbf1e1'], [0.42, '#2a1a10'], [0.35, '#fbf1e1'], [0.12, '#2a1a10'], [0.1, '#fbf1e1']];
const mesclar = (a, b, t) => {
	const h = (c, i) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
	return '#' + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * t).toString(16).padStart(2, '0')).join('');
};
for (const l of Object.values(LENGAS)) {
	for (const m of ['sorne', 'clar']) {
		let i = 0;
		for (const k of Object.keys(l.dial[m])) {
			const [t, b] = CAMAIEU[i++ % CAMAIEU.length];
			l.dial[m][k] = b ? mesclar(l.color[m], b, t) : l.color[m];
		}
	}
}

// Los prefixes de totas las lengas : un còdi sens prefix es occitan
const PREFIXES = Object.values(LENGAS).map((l) => l.pref);
export const lengaDeKod = (k) => Object.values(LENGAS).find((l) => k.startsWith(l.pref))?.kod ?? 'occitan';
export const esOccitan = (k) => !PREFIXES.some((p) => k.startsWith(p));

// Çò que la carta en estelas pren d'una lenga : sas vilas (nom dins la lenga,
// renc, dialècte per la bulla) e sa còsta, quand son fichièr las a
export function fonsLenga(lenga, d) {
	const nomDial = Object.fromEntries((lenga.pastilhas || []).map((p) => [p.k, p.long ?? p[lenga.lang] ?? p.ca]));
	return {
		vilas: (d.vilas || []).map(([lon, lat, nom, renc, dia]) => ({
			lon,
			lat,
			nom,
			renc,
			dialTèxt: nomDial[dia] ?? lenga.nom.endo
		})),
		costa: d.costa || null,
		// (la revelacion del satellit se fa tanben sus son domeni, Romain 2026-10-09)
		domeni: d.domeni?.anels?.length ? d.domeni.anels : null
	};
}
