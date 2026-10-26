<script>
	import Icona from '$lib/components/Icona.svelte';
	import { PLAJAS, zPlaja } from '$lib/carta/escalas.js';
	import { estatCarta, SELECCIONABLAS, activar } from '$lib/carta/estatCarta.svelte.js';
	// Rail de las jaces (causida de Romain, 2026-10-07, « panèl C ») : un rail
	// totjorn visible al bòrd de la carta, una icòna nomenada per familha. Un
	// clic dobrís lo tirador de la familha ; un segond clic sus la meteissa
	// icòna lo tampa (l'icòna se bolega pas). « Sus la carta » mòstra tot çò
	// qu'es afichat, per l'escantir d'un còp d'uèlh ; « Fons » règla lo fons
	// (fons « Contorns », occitan, natural, satellit, e colors) ; los elements
	// (vilas, noms, rius, relèu) son de jaces dins lors familhas.
	import { untrack, tick } from 'svelte';
	import { sonPapièr, sonsActius, gardarSons } from '$lib/carta/sons.js';
	import { fly, slide } from 'svelte/transition';
	import { LENGAS, esOccitan } from '$lib/carta/lengas.js';
	import { ICONAS } from '$lib/carta/iconas.js';
	import { FICHAS, VITALITAT } from '$lib/carta/fichas-lengas.js';
	import { gamaLocutors } from '$lib/carta/locutors.js';
	import { quintOut } from 'svelte/easing';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { cargarFranca, lengasEstrangièr, dialèctesFranca } from '$lib/carta/franca.js';

	let {
		familhas = [],
		visibility = $bindable({}),
		baseLayer = $bindable('estelas'),
		colors = $bindable({}),
		causits = $bindable([]),
		clar = false,
		lang = 'oc',
		esAdmin = false
	} = $props();

	const T = {
		oc: {
			rail: 'Jaces de la carta',
			sons: (on) => (on ? 'Sons de la carta : alucats' : 'Sons de la carta : amudits'),
			desplaçar: 'Desplaçar lo panèl (las sagetas tanben ; doble clic o tòca Origina : tornar a sa plaça)',
			reduire: 'Reduire lo panèl',
			enBas: 'Metre lo panèl en bas, a l’orizontala',
			costat: 'Metre lo panèl sul costat',
			desplegar: 'Desplegar lo panèl',
			sus: 'Sus la carta',
			fons: 'Fons',
			tampar: 'Tampar',
			aVenir: 'A venir',
			indisponible: 'Indisponibla per ara',
			disponiblas: (n) => `${n} ${n > 1 ? 'jaces disponiblas' : 'jaça disponibla'}`,
			venir: (n) => `${n} a venir`,
			res: 'Pas cap de jaça : la carta es nusa. Causís-ne una dins una familha.', // (tutoiement, cahier §11 2026-10-22)
			afichatOc: "Afichar l'occitan",
			afichadas: (n) => `${n} ${n > 1 ? 'jaces afichadas' : 'jaça afichada'}`,
			fonsCarta: 'Fons de carta',
			basemaps: { estelas: 'Contorns', occitan: 'Occitan', natural: 'Natural', satellite: 'Satellit' },
			colors: 'Colors',
			colorDe: { costa: 'Trach de còsta', riu: 'Rius', estela: 'Vilas e noms', corba: 'Relèu' },
			sonqueContorns: 'Sonque los contorns',
			anullar: 'Anullar',
			anullarTitol: 'Anullar la darrièra manipulacion (Ctrl+Z)',
			netejar: 'Netejar la carta',
			onglets: [['franca', 'França'], ['trans', 'Transfrontalièras'], ['europa', 'Euròpa'], ['mond', 'Mond']],
			ordres: [['alfa', 'A → Z'], ['loc', 'Locutors']],
			ordreTit: 'Rengar las lengas',
			nLengas: (n) => `${n} lengas`,
			deVenir: 'de venir',
			locutors: 'locutors',
			nDial: (n, sub) => `${n} ${sub ? 'lengas e parlars' : 'dialèctes'}`,
			dialDe: (l) => `Dialèctes del ${l}`,
			fonts: 'Fonts :',
			netejarTitol: 'Escantir totas las jaces e tornar partir de zèro',
			sonqueFons: 'Sonque sul fons Contorns',
			totTornar: 'Tot tornar',
			colorsTema: 'Colors del tèma',
			color: (n) => `Color : ${n}`,
			dialecteTotes: 'Totes',
			causirDial: 'Causir un o mantun dialècte',
			gropeDial: { fr: 'En França', frontiera: 'Sus la frontièra', defora: 'Fòra de França' },
			causirLenga: (l) => `Causir una zòna ${/^lengas /.test(l) ? 'de las ' + l : /^[aeiouàèéòóíú]/i.test(l) ? "de l'" + l : 'del ' + l}`,
			admin: "Modificar dins l'admin",
			// (« I anar » : causit per Romain, 2026-10-10)
			anar: 'I anar',
			fuelhaAgrandir: 'Agrandir lo panèl',
			totDetalh: 'Tot lo detalh',
			tornarOc: "Tornar a l'occitan",
			// (una familha de lengas, las d'oïl : al plural, retorn de Romain)
			environament: (pl) => (pl ? 'Veire las lengas dins lor environament lingüistic' : 'Veire la lenga dins son environament lingüistic'),
			// (« francesa » : validat per Romain, 2026-10-10)
			amagarRèsta: 'Sonque la part francesa',
			occitan: 'Occitan',
			lengas: 'Lengas',
			lengasFranca: 'Lengas de França',
			jaçaActiva: 'jaça activa',
			levarCausida: (n) => `Levar la causida : ${n}`,
			tornarFamilhas: (f) => `${f} : tornar a las familhas`,
			fuelhaReduire: 'Reduire lo panèl',
			anarTitol: "Anar a l'escala ont la jaça se vei"
		},
		fr: {
			rail: 'Couches de la carte',
			sons: (on) => (on ? 'Sons de la carte : activés' : 'Sons de la carte : coupés'),
			desplaçar: 'Déplacer le panneau (flèches aussi ; double-clic ou touche Origine : le remettre en place)',
			reduire: 'Réduire le panneau',
			enBas: 'Mettre le panneau en bas, à l’horizontale',
			costat: 'Mettre le panneau sur le côté',
			desplegar: 'Déplier le panneau',
			sus: 'Sur la carte',
			fons: 'Fond',
			tampar: 'Fermer',
			aVenir: 'À venir',
			indisponible: "Indisponible pour l'instant",
			disponiblas: (n) => `${n} ${n > 1 ? 'couches disponibles' : 'couche disponible'}`,
			venir: (n) => `${n} à venir`,
			res: 'Aucune couche : la carte est nue. Choisis-en une dans une famille.',
			afichatOc: "Afficher l'occitan",
			afichadas: (n) => `${n} ${n > 1 ? 'couches affichées' : 'couche affichée'}`,
			fonsCarta: 'Fond de carte',
			basemaps: { estelas: 'Contours', occitan: 'Occitan', natural: 'Naturel', satellite: 'Satellite' },
			colors: 'Couleurs',
			colorDe: { costa: 'Trait de côte', riu: 'Rivières', estela: 'Villes et noms', corba: 'Relief' },
			sonqueContorns: 'Seulement les contours',
			anullar: 'Annuler',
			anullarTitol: 'Annuler la dernière manipulation (Ctrl+Z)',
			netejar: 'Vider la carte',
			onglets: [['franca', 'France'], ['trans', 'Transfrontalières'], ['europa', 'Europe'], ['mond', 'Monde']],
			ordres: [['alfa', 'A → Z'], ['loc', 'Locuteurs']],
			ordreTit: 'Ranger les langues',
			nLengas: (n) => `${n} langues`,
			deVenir: 'à venir',
			locutors: 'locuteurs',
			nDial: (n, sub) => `${n} ${sub ? 'langues et parlers' : 'dialectes'}`,
			dialDe: (l) => `Dialectes du ${l}`,
			fonts: 'Sources :',
			netejarTitol: 'Éteindre toutes les couches et repartir de zéro',
			sonqueFons: 'Seulement sur le fond Contours',
			totTornar: 'Tout remettre',
			colorsTema: 'Couleurs du thème',
			color: (n) => `Couleur : ${n}`,
			dialecteTotes: 'Tous',
			causirDial: 'Choisir un ou plusieurs dialectes',
			gropeDial: { fr: 'En France', frontiera: 'Transfrontaliers', defora: 'Hors de France' },
			causirLenga: (l) => `Choisir une zone ${/^langues /.test(l) ? 'des ' + l : /^[aeiouàâéèêîôû]/i.test(l) ? "de l'" + l : 'du ' + l}`,
			admin: "Modifier dans l'admin",
			anar: 'Y aller',
			fuelhaAgrandir: 'Agrandir le panneau',
			totDetalh: 'Tout le détail',
			tornarOc: "Revenir à l'occitan",
			environament: (pl) => (pl ? 'Voir les langues dans leur environnement linguistique' : 'Voir la langue dans son environnement linguistique'),
			amagarRèsta: 'Seulement la partie française',
			occitan: 'Occitan',
			lengas: 'Langues',
			lengasFranca: 'Langues de France',
			jaçaActiva: 'couche active',
			levarCausida: (n) => `Retirer la sélection : ${n}`,
			tornarFamilhas: (f) => `${f} : revenir aux familles`,
			fuelhaReduire: 'Réduire le panneau',
			anarTitol: "Aller à l'échelle où la couche est visible"
		},
		es: {
			rail: 'Capas del mapa',
			sons: (on) => (on ? 'Sonidos del mapa: activados' : 'Sonidos del mapa: silenciados'),
			desplaçar: 'Mover el panel (también con las flechas; doble clic o tecla Inicio: devolverlo a su sitio)',
			reduire: 'Reducir el panel',
			enBas: 'Poner el panel abajo, en horizontal',
			costat: 'Poner el panel en el lateral',
			desplegar: 'Desplegar el panel',
			sus: 'En el mapa',
			fons: 'Fondo',
			tampar: 'Cerrar',
			aVenir: 'Próximamente',
			indisponible: 'No disponible por ahora',
			disponiblas: (n) => `${n} ${n > 1 ? 'capas disponibles' : 'capa disponible'}`,
			venir: (n) => `${n} próximamente`,
			res: 'Ninguna capa: el mapa está desnudo. Elige una dentro de una familia.',
			afichatOc: 'Mostrar el occitano',
			afichadas: (n) => `${n} ${n > 1 ? 'capas mostradas' : 'capa mostrada'}`,
			fonsCarta: 'Fondo del mapa',
			basemaps: { estelas: 'Contornos', occitan: 'Occitano', natural: 'Natural', satellite: 'Satélite' },
			colors: 'Colores',
			colorDe: { costa: 'Línea de costa', riu: 'Ríos', estela: 'Ciudades y nombres', corba: 'Relieve' },
			sonqueContorns: 'Solo los contornos',
			anullar: 'Deshacer',
			anullarTitol: 'Deshacer la última acción (Ctrl+Z)',
			netejar: 'Vaciar el mapa',
			onglets: [['franca', 'Francia'], ['trans', 'Transfronterizas'], ['europa', 'Europa'], ['mond', 'Mundo']],
			ordres: [['alfa', 'A → Z'], ['loc', 'Hablantes']],
			ordreTit: 'Ordenar las lenguas',
			nLengas: (n) => `${n} lenguas`,
			deVenir: 'próximamente',
			locutors: 'hablantes',
			nDial: (n, sub) => `${n} ${sub ? 'lenguas y hablas' : 'dialectos'}`,
			dialDe: (l) => `Dialectos: ${l}`,
			fonts: 'Fuentes:',
			netejarTitol: 'Apagar todas las capas y empezar de cero',
			sonqueFons: 'Solo en el fondo Contornos',
			totTornar: 'Restablecerlo todo',
			colorsTema: 'Colores del tema',
			color: (n) => `Color: ${n}`,
			dialecteTotes: 'Todos',
			causirDial: 'Elegir uno o varios dialectos',
			gropeDial: { fr: 'En Francia', frontiera: 'Transfronterizos', defora: 'Fuera de Francia' },
			causirLenga: (l) => `Elegir una zona: ${l}`,
			admin: 'Modificar en la administración',
			anar: 'Ir',
			fuelhaAgrandir: 'Ampliar el panel',
			totDetalh: 'Todo el detalle',
			tornarOc: 'Volver al occitano',
			environament: (pl) => (pl ? 'Ver las lenguas en su entorno lingüístico' : 'Ver la lengua en su entorno lingüístico'),
			amagarRèsta: 'Solo la parte francesa',
			occitan: 'Occitano',
			lengas: 'Lenguas',
			lengasFranca: 'Lenguas de Francia',
			jaçaActiva: 'capa activa',
			levarCausida: (n) => `Quitar la selección: ${n}`,
			tornarFamilhas: (f) => `${f}: volver a las familias`,
			fuelhaReduire: 'Reducir el panel',
			anarTitol: 'Ir a la escala en la que se ve la capa',
			dp: ':',
			escala: (a, b) => (b ? `Visible de ${a} a ${b}` : `Visible a partir de ${a}`),
			occitanDesc: 'Sus seis dialectos, de Bordèu a Niça; Val d’Aran y valles de Italia también',
			familha: 'románica',
			infoOc: 'Clasificación: indoeuropeo › romance › galorromance › occitanorromance (Glottolog, Instituto Max Planck)',
			infoDial: 'Dialectos según el mapa de Occitanica (CIRDÒC), ajustado a los municipios'
		},
		en: {
			rail: 'Map layers',
			sons: (on) => (on ? 'Map sounds: on' : 'Map sounds: off'),
			desplaçar: 'Move the panel (arrow keys too; double-click or the Home key: put it back)',
			reduire: 'Collapse the panel',
			enBas: 'Put the panel at the bottom, horizontally',
			costat: 'Put the panel at the side',
			desplegar: 'Expand the panel',
			sus: 'On the map',
			fons: 'Background',
			tampar: 'Close',
			aVenir: 'Coming soon',
			indisponible: 'Not available yet',
			disponiblas: (n) => `${n} ${n > 1 ? 'layers available' : 'layer available'}`,
			venir: (n) => `${n} coming soon`,
			res: 'No layers: the map is bare. Pick one from a family.',
			afichatOc: 'Show Occitan',
			afichadas: (n) => `${n} ${n > 1 ? 'layers shown' : 'layer shown'}`,
			fonsCarta: 'Map background',
			basemaps: { estelas: 'Outlines', occitan: 'Occitan', natural: 'Natural', satellite: 'Satellite' },
			colors: 'Colours',
			colorDe: { costa: 'Coastline', riu: 'Rivers', estela: 'Towns and names', corba: 'Relief' },
			sonqueContorns: 'Outlines only',
			anullar: 'Undo',
			anullarTitol: 'Undo the last action (Ctrl+Z)',
			netejar: 'Clear the map',
			onglets: [['franca', 'France'], ['trans', 'Cross-border'], ['europa', 'Europe'], ['mond', 'World']],
			ordres: [['alfa', 'A → Z'], ['loc', 'Speakers']],
			ordreTit: 'Sort the languages',
			nLengas: (n) => `${n} languages`,
			deVenir: 'coming soon',
			locutors: 'speakers',
			nDial: (n, sub) => `${n} ${sub ? 'languages and varieties' : 'dialects'}`,
			dialDe: (l) => `Dialects: ${l}`,
			fonts: 'Sources:',
			netejarTitol: 'Switch off every layer and start from scratch',
			sonqueFons: 'Only on the Outlines background',
			totTornar: 'Reset everything',
			colorsTema: 'Theme colours',
			color: (n) => `Colour: ${n}`,
			dialecteTotes: 'All',
			causirDial: 'Choose one or more dialects',
			gropeDial: { fr: 'In France', frontiera: 'Cross-border', defora: 'Outside France' },
			causirLenga: (l) => `Choose an area: ${l}`,
			admin: 'Edit in the admin area',
			anar: 'Go',
			fuelhaAgrandir: 'Enlarge the panel',
			totDetalh: 'Full details',
			tornarOc: 'Back to Occitan',
			environament: (pl) => (pl ? 'See the languages in their linguistic environment' : 'See the language in its linguistic environment'),
			amagarRèsta: 'French part only',
			occitan: 'Occitan',
			lengas: 'Languages',
			lengasFranca: 'Languages of France',
			jaçaActiva: 'active layer',
			levarCausida: (n) => `Remove the selection: ${n}`,
			tornarFamilhas: (f) => `${f}: back to the families`,
			fuelhaReduire: 'Collapse the panel',
			anarTitol: 'Go to the scale where the layer can be seen',
			dp: ':',
			escala: (a, b) => (b ? `Visible from ${a} to ${b}` : `Visible from ${a} onwards`),
			occitanDesc: 'Its six dialects, from Bordèu to Niça; Val d’Aran and some valleys in Italy too',
			familha: 'Romance',
			infoOc: 'Classification: Indo-European › Romance › Gallo-Romance › Occitano-Romance (Glottolog, Max Planck Institute)',
			infoDial: 'Dialects after the Occitanica map (CIRDÒC), adjusted to the communes'
		},
		ca: {
			rail: 'Capes del mapa',
			sons: (on) => (on ? 'Sons del mapa: activats' : 'Sons del mapa: silenciats'),
			desplaçar: 'Moure el panell (també amb les fletxes; doble clic o tecla Inici: tornar-lo al seu lloc)',
			reduire: 'Reduir el panell',
			enBas: 'Posar el panell a baix, en horitzontal',
			costat: 'Posar el panell al costat',
			desplegar: 'Desplegar el panell',
			sus: 'Al mapa',
			fons: 'Fons',
			tampar: 'Tancar',
			aVenir: 'Properament',
			indisponible: 'No disponible per ara',
			disponiblas: (n) => `${n} ${n > 1 ? 'capes disponibles' : 'capa disponible'}`,
			venir: (n) => `${n} properament`,
			res: 'Cap capa: el mapa és nu. Tria’n una dins d’una família.',
			afichatOc: 'Mostrar l’occità',
			afichadas: (n) => `${n} ${n > 1 ? 'capes mostrades' : 'capa mostrada'}`,
			fonsCarta: 'Fons del mapa',
			basemaps: { estelas: 'Contorns', occitan: 'Occità', natural: 'Natural', satellite: 'Satèl·lit' },
			colors: 'Colors',
			colorDe: { costa: 'Línia de costa', riu: 'Rius', estela: 'Ciutats i noms', corba: 'Relleu' },
			sonqueContorns: 'Només els contorns',
			anullar: 'Desfer',
			anullarTitol: 'Desfer l’última acció (Ctrl+Z)',
			netejar: 'Buidar el mapa',
			onglets: [['franca', 'França'], ['trans', 'Transfrontereres'], ['europa', 'Europa'], ['mond', 'Món']],
			ordres: [['alfa', 'A → Z'], ['loc', 'Parlants']],
			ordreTit: 'Ordenar les llengües',
			nLengas: (n) => `${n} llengües`,
			deVenir: 'properament',
			locutors: 'parlants',
			nDial: (n, sub) => `${n} ${sub ? 'llengües i parlars' : 'dialectes'}`,
			dialDe: (l) => `Dialectes: ${l}`,
			fonts: 'Fonts:',
			netejarTitol: 'Apagar totes les capes i tornar a començar de zero',
			sonqueFons: 'Només sobre el fons Contorns',
			totTornar: 'Restablir-ho tot',
			colorsTema: 'Colors del tema',
			color: (n) => `Color: ${n}`,
			dialecteTotes: 'Tots',
			causirDial: 'Triar un o diversos dialectes',
			gropeDial: { fr: 'A França', frontiera: 'Transfronterers', defora: 'Fora de França' },
			causirLenga: (l) => `Triar una zona: ${l}`,
			admin: 'Modificar a l’administració',
			anar: 'Anar-hi',
			fuelhaAgrandir: 'Ampliar el panell',
			totDetalh: 'Tot el detall',
			tornarOc: 'Tornar a l’occità',
			environament: (pl) => (pl ? 'Veure les llengües en el seu entorn lingüístic' : 'Veure la llengua en el seu entorn lingüístic'),
			amagarRèsta: 'Només la part francesa',
			occitan: 'Occità',
			lengas: 'Llengües',
			lengasFranca: 'Llengües de França',
			jaçaActiva: 'capa activa',
			levarCausida: (n) => `Treure la selecció: ${n}`,
			tornarFamilhas: (f) => `${f}: tornar a les famílies`,
			fuelhaReduire: 'Reduir el panell',
			anarTitol: 'Anar a l’escala on es veu la capa',
			dp: ':',
			escala: (a, b) => (b ? `Visible de ${a} a ${b}` : `Visible a partir de ${a}`),
			occitanDesc: 'Els seus sis dialectes, de Bordèu a Niça; Val d’Aran i valls d’Itàlia també',
			familha: 'romànica',
			infoOc: 'Classificació: indoeuropeu › romànic › galoromànic › occitanoromànic (Glottolog, Institut Max Planck)',
			infoDial: 'Dialectes segons el mapa d’Occitanica (CIRDÒC), ajustat als municipis'
		},
		ar: {
			rail: 'طبقات الخريطة',
			sons: (on) => (on ? 'أصوات الخريطة: مفعّلة' : 'أصوات الخريطة: متوقفة'),
			desplaçar: 'تحريك اللوحة (يمكن أيضًا بمفاتيح الأسهم؛ نقر مزدوج أو مفتاح Home: إعادتها إلى مكانها)',
			reduire: 'طيّ اللوحة',
			enBas: 'وضع اللوحة في الأسفل بشكل أفقي',
			costat: 'وضع اللوحة على الجانب',
			desplegar: 'فتح اللوحة',
			sus: 'على الخريطة',
			fons: 'الخلفية',
			tampar: 'إغلاق',
			aVenir: 'قريبًا',
			indisponible: 'غير متاحة حاليًا',
			disponiblas: (n) => `طبقات متاحة: ${n}`,
			venir: (n) => `قريبًا: ${n}`,
			res: 'لا توجد أي طبقة، فالخريطة فارغة. يمكنك اختيار طبقة من إحدى الفئات.',
			afichatOc: 'إظهار الأوكسيتانية',
			afichadas: (n) => `الطبقات المعروضة: ${n}`,
			fonsCarta: 'خلفية الخريطة',
			basemaps: { estelas: 'الحدود', occitan: 'Occitan', natural: 'طبيعي', satellite: 'القمر الصناعي' },
			colors: 'الألوان',
			colorDe: { costa: 'خط الساحل', riu: 'الأنهار', estela: 'المدن والأسماء', corba: 'التضاريس' },
			sonqueContorns: 'الحدود فقط',
			anullar: 'تراجع',
			anullarTitol: 'التراجع عن آخر إجراء (Ctrl+Z)',
			netejar: 'إفراغ الخريطة',
			onglets: [['franca', 'فرنسا'], ['trans', 'عابرة للحدود'], ['europa', 'أوروبا'], ['mond', 'العالم']],
			ordres: [['alfa', 'A → Z'], ['loc', 'المتحدّثون']],
			ordreTit: 'ترتيب اللغات',
			nLengas: (n) => `لغات: ${n}`,
			deVenir: 'قريبًا',
			locutors: 'متحدّث',
			nDial: (n, sub) => `${sub ? 'لغات ولهجات' : 'لهجات'}: ${n}`,
			dialDe: (l) => `اللهجات: ${l}`,
			fonts: 'المصادر:',
			netejarTitol: 'إخفاء كل الطبقات والبدء من الصفر',
			sonqueFons: 'على خلفية الحدود فقط',
			totTornar: 'إعادة ضبط الكل',
			colorsTema: 'ألوان المظهر',
			color: (n) => `اللون: ${n}`,
			dialecteTotes: 'الكل',
			causirDial: 'اختيار لهجة أو أكثر',
			gropeDial: { fr: 'في فرنسا', frontiera: 'عابرة للحدود', defora: 'خارج فرنسا' },
			causirLenga: (l) => `اختيار منطقة: ${l}`,
			admin: 'التعديل في الإدارة',
			anar: 'انتقال',
			fuelhaAgrandir: 'تكبير اللوحة',
			totDetalh: 'كل التفاصيل',
			tornarOc: 'العودة إلى الأوكسيتانية',
			environament: (pl) => (pl ? 'عرض اللغات في محيطها اللغوي' : 'عرض اللغة في محيطها اللغوي'),
			amagarRèsta: 'الجزء الفرنسي فقط',
			occitan: 'Occitan',
			lengas: 'اللغات',
			lengasFranca: 'لغات فرنسا',
			jaçaActiva: 'طبقة نشطة',
			levarCausida: (n) => `إلغاء الاختيار: ${n}`,
			tornarFamilhas: (f) => `${f}: العودة إلى الفئات`,
			fuelhaReduire: 'طيّ اللوحة',
			anarTitol: 'الانتقال إلى مستوى التكبير الذي تظهر عنده الطبقة',
			dp: ':',
			escala: (a, b) => (b ? `مرئية من ${a} إلى ${b}` : `مرئية ابتداءً من ${a}`),
			occitanDesc: 'لهجاتها الست، من Bordèu إلى Niça، وتشمل Val d’Aran وبعض الوديان في إيطاليا',
			familha: 'رومانسية',
			infoOc: 'التصنيف: هندو-أوروبية › رومانسية › غالو-رومانسية › أوكسيتانو-رومانسية (Glottolog، معهد ماكس بلانك)',
			infoDial: 'اللهجات وفق خريطة Occitanica (CIRDÒC)، مضبوطة على حدود البلديات'
		}
	};
	let tx = $derived(T[lang] ?? T.oc);

	// Famille de langue et état de vitalité (fichas-lengas.js, fichier généré, avec
	// seulement oc et fr) : mêmes libellés dans les trois autres langues, clés = le français
	const FAM_T = {
		celtique: { es: 'celta', en: 'Celtic', ca: 'cèltica', ar: 'كلتية' },
		germanique: { es: 'germánica', en: 'Germanic', ca: 'germànica', ar: 'جرمانية' },
		'germanique, alémanique': { es: 'germánica, alemánica', en: 'Germanic, Alemannic', ca: 'germànica, alemànica', ar: 'جرمانية، أليمانية' },
		'germanique, francique': { es: 'germánica, fráncica', en: 'Germanic, Franconian', ca: 'germànica, francònica', ar: 'جرمانية، فرانكونية' },
		isolat: { es: 'aislada', en: 'isolate', ca: 'aïllada', ar: 'معزولة' },
		romane: { es: 'románica', en: 'Romance', ca: 'romànica', ar: 'رومانسية' },
		'romanes, une famille': { es: 'una familia de lenguas románicas', en: 'a family of Romance languages', ca: 'una família de llengües romàniques', ar: 'عائلة من اللغات الرومانسية' }
	};
	const VIT_T = {
		vulnérable: { es: 'vulnerable', en: 'vulnerable', ca: 'vulnerable', ar: 'معرّضة للخطر' },
		'en danger': { es: 'en peligro', en: 'endangered', ca: 'en perill', ar: 'مهدّدة بالخطر' },
		'sérieusement en danger': { es: 'en grave peligro', en: 'severely endangered', ca: 'en perill greu', ar: 'مهدّدة بخطر شديد' }
	};
	const familhaTx = (f) => f[lang] ?? FAM_T[f.fr]?.[lang] ?? f.fr;
	const vitalTx = (v) => v[lang] ?? VIT_T[v.fr]?.[lang] ?? v.fr;

	// Icònas de las familhas (traç fin, color del tèxte)
	const IC = {
		sus: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
		// la crotz occitana del lògo de Lo Ligam (Crotz.svelte), sos quatre braces
		// plens, sens pomètas : la silhoeta, legibla a la talha del rail (causida de Romain, 2026-10-09)
		lenga: '<path transform="translate(12 12) scale(10)" d="M0 0L-0.468 -0.797Q-0.194 -0.746 0 -1Q0.202 -0.746 0.486 -0.797ZM0 0L0.809 -0.48Q0.751 -0.199 1 0Q0.751 0.199 0.809 0.48ZM0 0L0.486 0.797Q0.202 0.742 0 0.992Q-0.194 0.742 -0.468 0.797ZM0 0L-0.786 0.48Q-0.731 0.203 -0.976 0.009Q-0.731 -0.195 -0.786 -0.48Z" fill="currentColor"/>',
		administracion: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/>',
		cultura: '<path d="M4 6c3-1 5-1 8 1 3-2 5-2 8-1v12c-3-1-5-1-8 1-3-2-5-2-8-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 7v12" stroke="currentColor" stroke-width="1.4"/>',
		ensenhament: '<path d="M22 9l-10-4-10 4 10 4 10-4v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
		istoria: '<path d="M5 20h14M6 20V10M10 20V10M14 20V10M18 20V10M4 10h16L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
		natura: '<path d="M3 19l6-10 4 6 3-4 5 8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="17" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
		// doas botiòlas de discussion, una plena e una al traç (causida de Romain,
		// 2026-10-10) ; l'espaci entre las doas es una masca (mask), pas la color
		// del fons : demòra just sus totes los estats del boton
		lengas: '<mask id="masc-lengas"><rect width="24" height="24" fill="#fff"/><path d="M19.19 14.6A5.6 5.6 0 1 0 15.87 16.51L20.6 19z" fill="none" stroke="#000" stroke-width="3.6" stroke-linejoin="round"/><circle cx="5.9" cy="11" r=".95"/><circle cx="8.3" cy="11" r=".95"/></mask><path mask="url(#masc-lengas)" d="M4.81 14.6A5.6 5.6 0 1 1 8.13 16.51L3.4 19z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/><path d="M19.19 14.6A5.6 5.6 0 1 0 15.87 16.51L20.6 19z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="13.3" cy="11" r=".95" fill="currentColor"/><circle cx="15.7" cy="11" r=".95" fill="currentColor"/><circle cx="18.1" cy="11" r=".95" fill="currentColor"/>',
		// las donadas del mòde « Lengas de França » : tres barras
		donadas: '<path d="M4 20h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 17V11M12 17V6M17 17V9" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
		fons: '<path d="M12 4l9 5-9 5-9-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
	};

	// Colors dels dialèctes (las de la carta, colaDonadas.js)
	const DIAL = $derived(
		clar
			? { gas: '#2350d8', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' }
			: { gas: '#5b7fff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' }
	);
	// Las autras lengas (lengas.js) : lors pastilhas e lors colors
	// la color d'una pastilha d'una lenga (sa color de dialècte segon lo tèma)
	const colorPastilha = (id, k) => LENGAS[id].dial[clar ? 'clar' : 'sorne'][k] ?? LENGAS[id].color[clar ? 'clar' : 'sorne'];
	// Mòde « Lengas de França » : los dialèctes d'una lenga en tres gropes, en
	// França, sus la frontièra, fòra de França (demanda de Romain, 2026-10-10 ;
	// classas calculadas per franca-contorn.py). Un sol grope : pas de títol.
	let classesDial = $state({});
	const gropesDial = (id, lista, kod) => {
		if (!mòde) return [{ g: '', lista }];
		const cl = classesDial[id] ?? {};
		const gs = ['fr', 'frontiera', 'defora'].map((g) => ({ g, lista: lista.filter((q) => (cl[kod(q)] ?? 'fr') === g) })).filter((x) => x.lista.length);
		return gs.length > 1 ? gs : [{ g: '', lista }];
	};
	const NOMS_DIAL = [
		['gas', 'gascon', 'gascon'],
		['lan', 'lengadocian', 'languedocien'],
		['pro', 'provençal', 'provençal'],
		['lem', 'lemosin', 'limousin'],
		['auv', 'auvernhat', 'auvergnat'],
		['viv', 'vivaroaupenc', 'vivaro-alpin']
	];

	// Apercebuts de las jaces, dessenhats coma sus la carta
	const apercebut = (id) => {
		const d = DIAL;
		const A = {
			frontiera: '<path d="M4 26 C 16 10, 30 30, 48 8" fill="none" stroke="#e0612f" stroke-width="2.4" stroke-dasharray="0.1 5" stroke-linecap="round"/>',
			dialectes: NOMS_DIAL.map(([k], i) => `<rect x="${i * 9}" y="0" width="9.5" height="36" fill="${d[k]}" opacity=".75"/>`).join(''),
			// la lenga unida : una sola color, son nom
			unificat: '<rect width="52" height="36" fill="#c4553f" opacity=".72"/><text x="26" y="21.5" text-anchor="middle" font-family="Luciole, sans-serif" font-weight="600" font-size="7" letter-spacing="1.2" fill="#fff8ec">OCCITAN</text>',
			creissent: '<defs><pattern id="ap-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.6" height="5" fill="#e0612f"/></pattern></defs><path d="M0 22 Q 26 4 52 20 V 36 H 0z" fill="url(#ap-h)" opacity=".8"/>',
			// (les locuteurs, OPLO 2020 : les cinq classes de la légende de « Uèi »)
			locutors: gamaLocutors(false).map((c, i) => `<rect x="${i * 10.4}" y="0" width="10.4" height="36" fill="${c}" opacity=".85"/>`).join(''),
			limsi: '<circle cx="14" cy="18" r="3" fill="#3e7cb1"/><path d="M20 12a8 8 0 0 1 0 12M24 8a13 13 0 0 1 0 20" fill="none" stroke="#3e7cb1" stroke-width="1.6"/>',
			regions: '<path d="M6 8 L22 5 L30 14 L46 10 L48 30 L24 32 L8 28z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>',
			despartaments: '<path d="M2 12 L18 8 L20 20 L4 24z M18 8 L34 10 L36 22 L20 20 M34 10 L50 6 L50 20 L36 22 M4 24 L20 20 L24 34 M20 20 L36 22 L40 34" fill="none" stroke="currentColor" stroke-width=".9" opacity=".6"/>',
			comunas: '<path d="M2 6 L18 4 L22 16 L6 19z M18 4 L34 7 L32 18 L22 16 M34 7 L50 5 L49 17 L32 18 M6 19 L22 16 L20 32 L4 31z M22 16 L32 18 L38 32 L20 32 M32 18 L49 17 L50 31 L38 32" fill="none" stroke="currentColor" stroke-width=".8" stroke-dasharray="3 2" opacity=".6"/>',
			lieusInteres: '<circle cx="12" cy="14" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="30" cy="24" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="42" cy="10" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/>',
			librarias: '<path d="M14 10h10v18H14zM26 10h10v18H26z" fill="none" stroke="#eeaf34" stroke-width="1.5"/><path d="M17 15h4M29 15h4" stroke="#eeaf34" stroke-width="1.2"/>',
			calandretas: '<path d="M12 28V16l14-7 14 7v12z" fill="none" stroke="#eeaf34" stroke-width="1.5" stroke-linejoin="round"/><path d="M23 28v-6h6v6" stroke="#eeaf34" stroke-width="1.4" fill="none"/>',
			festas: '<path d="M26 7l3 7 7 .6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7L15 14.6l7-.6z" fill="#eeaf34" opacity=".85"/>',
			provincias: '<path d="M2 12 Q 18 3 30 12 T 50 9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 3" opacity=".75"/><path d="M4 29 Q 20 20 32 27 T 50 23" fill="none" stroke="currentColor" stroke-width=".9" opacity=".55"/>',
			paises: '<circle cx="14" cy="16" r="9" fill="#c9a46a" opacity=".35"/><circle cx="34" cy="20" r="11" fill="#c9a46a" opacity=".25"/>',
			isolas: '<circle cx="18" cy="18" r="6" fill="none" stroke="#e0612f" stroke-width="1.6"/><circle cx="36" cy="14" r="4" fill="none" stroke="#e0612f" stroke-width="1.6"/>',
			parcs: '<path d="M6 30 Q 10 8 26 13 T 48 19 L 45 32 Z" fill="#86c48c" fill-opacity=".22" stroke="#86c48c" stroke-width="1.2"/>',
			massis: '<path d="M8 27 l5 -9 l5 9z" fill="currentColor" opacity=".85"/><text x="34" y="16" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="8.5" letter-spacing="1.4" fill="currentColor" opacity=".75">AUBRAC</text>',
			// las donadas del mòde : cercles proporcionals, limits datats
			escolasBreton: '<circle cx="15" cy="19" r="9" fill="#4fd1b0" fill-opacity=".28" stroke="#4fd1b0"/><circle cx="33" cy="13" r="5.5" fill="#4fd1b0" fill-opacity=".28" stroke="#4fd1b0"/><circle cx="42" cy="26" r="3.2" fill="#4fd1b0" fill-opacity=".28" stroke="#4fd1b0"/>',
			limitsBreton: '<path d="M14 2 C 18 14, 10 22, 16 34" fill="none" stroke="#e9d7b0" stroke-width="1" stroke-dasharray="4 3" opacity=".45"/><path d="M26 2 C 30 14, 22 22, 28 34" fill="none" stroke="#e9d7b0" stroke-width="1.4" stroke-dasharray="4 3" opacity=".65"/><path d="M38 2 C 42 14, 34 22, 40 34" fill="none" stroke="#e9d7b0" stroke-width="2" opacity=".9"/>',
			escolasCors: '<circle cx="18" cy="18" r="7" fill="currentColor" fill-opacity=".15" stroke="currentColor" opacity=".6"/><circle cx="36" cy="20" r="4" fill="currentColor" fill-opacity=".15" stroke="currentColor" opacity=".6"/>',
			// las lengas : lors colors, o lor nom dins la lenga (las de venir)
			...Object.fromEntries(
				Object.keys(LENGAS).map((id) => {
					const dz = LENGAS[id].pastilhas.filter(({ k, de }) => LENGAS[id].dial.sorne[k] && !de);
					const w = 52 / dz.length;
					return [id, dz.map(({ k }, i) => `<rect x="${(i * w).toFixed(1)}" y="0" width="${(w + 0.5).toFixed(1)}" height="36" fill="${colorPastilha(id, k)}" opacity=".75"/>`).join('')];
				})
			),
			...Object.fromEntries(
				[['basc', 'EUSKARA'], ['breton', 'BREZHONEG'],['alsacian', 'ELSÄSSISCH'], ['francic', 'PLATT'], ['flamenc', 'VLAEMSCH'], ['cors', 'CORSU']].map(([k, t]) => [
					k,
					`<text x="26" y="22" text-anchor="middle" font-family="Luciole, sans-serif" font-weight="600" font-size="7" letter-spacing="1" fill="currentColor">${t}</text>`
				])
			),
			lengasFranca: '<text x="26" y="21" text-anchor="middle" font-family="Luciole, sans-serif" font-weight="600" font-size="7.5" letter-spacing="1.2" fill="currentColor">BREZHONEG</text><text x="26" y="30" text-anchor="middle" font-family="Luciole, sans-serif" font-size="6" letter-spacing="0.8" fill="currentColor" opacity=".6">EUSKARA</text>',
			bacins: '<path d="M26 34 V 20 M26 20 L14 8 M26 20 L40 10 M20 14 L12 18 M34 14 L44 18" stroke="#eeaf34" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
			estelas: '<circle cx="10" cy="12" r="1.6" fill="currentColor"/><circle cx="24" cy="24" r="2.2" fill="currentColor"/><circle cx="38" cy="10" r="1.3" fill="currentColor"/><circle cx="44" cy="27" r="1.6" fill="currentColor"/><circle cx="17" cy="29" r="1" fill="currentColor"/>',
			nomsVilas: '<text x="26" y="23" text-anchor="middle" font-family="Limelight, Georgia, serif" font-size="13" fill="currentColor">Tolosa</text>',
			rius: '<path d="M2 28 C 14 18, 22 30, 32 18 S 46 8, 52 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
			nomsRius: '<text x="26" y="23" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="14" fill="currentColor">Garona</text>',
			corbas: '<path d="M2 30 Q 20 12 50 26 M6 34 Q 24 18 52 32 M4 24 Q 20 6 48 18" fill="none" stroke="currentColor" stroke-width=".8" opacity=".6"/>',
			costa: '<path d="M30 0 C 26 10, 34 14, 28 22 S 20 32, 26 36" fill="none" stroke="currentColor" stroke-width="1" opacity=".75"/>'
		};
		// las jaces del fons Contorns reprenon los apercebuts de lors elements
		const ALIAS = { vilas: 'estelas', toponimia: 'nomsVilas' };
		return A[ALIAS[id] ?? id] ?? '';
	};

	const RAIL = ['sus', 'lenga', 'administracion', 'cultura', 'ensenhament', 'istoria', 'natura', 'lengas'];
	let dobert = $state(null);
	// los tèmas de « Sus la carta » enrotlats (demanda de Romain, 2026-10-09)
	let enrotlats = $state([]);
	// L'opcion A del panèl « Autras lengas » (causida de Romain, 2026-10-10) :
	// onglets França / Euròpa / Mond, una ficha per lenga, dialèctes desplegables
	let onglet = $state('franca');
	// (rengadas per òrdre alfabetic, o per nombre de locutors : causida de Romain)
	let ordre = $state('alfa');
	const nomOrd = (id) => (lang === 'fr' ? LENGAS[id].nom.fr : LENGAS[id].nom.oc).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	const lengasOnglet = (f) =>
		f.jaces
			.filter((j) => LENGAS[j.id] && actiu(j) && (FICHAS[j.id]?.onglet ?? 'franca') === onglet)
			.sort((a, b) => (ordre === 'loc' ? (FICHAS[b.id]?.n ?? -1) - (FICHAS[a.id]?.n ?? -1) : 0) || nomOrd(a.id).localeCompare(nomOrd(b.id)));
	// dins lo mòde : totas las lengas d'una lista, l'occitan dedins (sas
	// pastilhas de dialèctes), per òrdre alfabetic o de locutors
	const OCCITAN_J = { id: 'dialectes', estat: 'disponible' };
	const lengasMòde = (f) => {
		const ls = f.jaces.filter((j) => LENGAS[j.id] && actiu(j)).map((j) => ({ j, nom: nomOrd(j.id), n: FICHAS[j.id]?.n ?? -1 }));
		ls.push({ j: OCCITAN_J, oc: true, nom: tx.occitan, n: -1 });
		return ls.sort((a, b) => (ordre === 'loc' ? b.n - a.n : 0) || a.nom.localeCompare(b.nom));
	};
	let dialsDob = $state([]);
	// La silhoeta de l'aira de cada lenga dins sa ficha (los contorns leugièrs de
	// « Descobrir… », ja en cache) : cargada a la dobertura del panèl
	let silhoetas = $state({});
	// la part francesa de cada silhoeta (lo contorn de França, meteissa escala)
	let silhoetasFr = $state({});
	// las lengas que desbòrdan de França (franca.json, calculat per franca-contorn.py)
	let estrangièr = $state({});
	function alternarEnvironament(id) {
		const env = estatCarta.environament;
		estatCarta.environament = env.includes(id) ? env.filter((x) => x !== id) : [...env, id];
		const jid = id === 'occitan' ? 'dialectes' : id;
		if (!visibility[jid]) bascular(jid, true);
	}
	let silhPromesa = null;
	$effect(() => {
		if (dobert !== 'lengas' || silhPromesa) return;
		silhPromesa = fetch('/data/lengas-vesinas.json')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (!d) return;
				const out = {},
					outFr = {};
				for (const [k, anels] of Object.entries(d)) {
					if (k === 'franca') continue;
					let x0 = 180, x1 = -180, y0 = 90, y1 = -90;
					for (const a of anels) for (const [x, y] of a) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y));
					const kx = Math.cos((((y0 + y1) / 2) * Math.PI) / 180);
					const e = 36 / Math.max((x1 - x0) * kx, y1 - y0, 1e-6);
					const ox = (40 - (x1 - x0) * kx * e) / 2, oy = (40 - (y1 - y0) * e) / 2;
					out[k] = anels.map((a) => 'M' + a.map(([x, y]) => ((x - x0) * kx * e + ox).toFixed(1) + ' ' + ((y1 - y) * e + oy).toFixed(1)).join('L') + 'Z').join('');
					if (d.franca) outFr[k] = d.franca.map((a) => 'M' + a.map(([x, y]) => ((x - x0) * kx * e + ox).toFixed(1) + ' ' + ((y1 - y) * e + oy).toFixed(1)).join('L') + 'Z').join('');
				}
				silhoetas = out;
				silhoetasFr = outFr;
				cargarFranca().then(() => {
					estrangièr = Object.fromEntries(lengasEstrangièr().map((k) => [k, true]));
					classesDial = dialèctesFranca();
				});
			})
			.catch(() => {});
	});
	const virarDials = (id) => (dialsDob = dialsDob.includes(id) ? dialsDob.filter((x) => x !== id) : [...dialsDob, id]);
	const virarTèma = (id) => (enrotlats = enrotlats.includes(id) ? enrotlats.filter((x) => x !== id) : [...enrotlats, id]);
	// Lo mòde « Lengas de França » (decision de Romain, 2026-10-10 ; opcion A,
	// lo rail se transforma) : « Autras lengas » fa entrar dins una autra
	// vista. Las donadas occitanas (cultura, istòria) s'escafan ; lo rail
	// ven : tornar a l'occitan, Sus la carta, Lengas ; la lista es unica, e
	// l'occitan i es a egalitat amb las autras. En tornant a l'occitan, la
	// carta es restablida coma èra.
	let mòde = $state(null);
	let salvat = null;
	const FAMILHAS_OC = ['cultura', 'ensenhament', 'istoria'];
	function dintrarMòde() {
		salvat = { v: $state.snapshot(visibility), d: [...causits] };
		for (const fm of familhas) if (FAMILHAS_OC.includes(fm.id)) for (const j of fm.jaces) if (visibility[j.id]) visibility[j.id] = false;
		banda = null;
		mòde = 'lengas';
		estatCarta.environament = [];
		estatCarta.mòde = 'lengas';
		dobert = 'lengas';
		plaçarTirador();
	}
	function sortirMòde() {
		if (salvat) {
			for (const k of Object.keys({ ...visibility, ...salvat.v })) visibility[k] = !!salvat.v[k];
			causits = salvat.d;
		}
		salvat = null;
		mòde = null;
		estatCarta.mòde = null;
		estatCarta.environament = [];
		dobert = null;
	}
	const alternar = (id) => {
		if (id === 'lengas' && !mòde) return dintrarMòde();
		// (sus un ecran estrech, una familha del catalògue dobrís sa banda)
		if (estreit && !mòde && id !== 'sus' && id !== 'lengas' && id !== 'fons' && banda !== id) {
			banda = id;
			dobert = null;
			return;
		}
		dobert = dobert === id ? null : id;
		if (dobert) plaçarTirador();
	};
	// al clavièr (Entrada o Espaci : detail === 0), dobrir una familha mena lo
	// focus dins lo tirador, que Tab passe pas per totes los botons del rail
	// abans d'i arribar ; Escapar torna al boton (tamparTirador)
	async function alternarClavièr(e, id) {
		alternar(id);
		if (e.detail !== 0 || dobert !== id) return;
		await tick();
		// (.ansa n'existeix que sus telefòn : un boton amagat pòt pas recebre lo focus)
		const t = document.querySelector('#tirador-jaces');
		(t?.querySelector('[role="switch"]:not([disabled])') ?? t?.querySelector('button:not(.ansa):not([disabled])'))?.focus();
	}
	// Al clavièr, desalucar una jaça pòt levar sa linha del tirador (« Sus la
	// carta » mòstra pas que las alucadas) : lo boton qu'aviá lo focus dispareis
	// e lo focus tomba sul cap de la pagina. Òm lo torna dins lo tirador.
	function gardarFocus(node) {
		async function clic(e) {
			if (e.detail !== 0) return;
			await tick();
			await new Promise((r) => setTimeout(r, 0));
			if (document.activeElement && document.activeElement !== document.body) return;
			(node.querySelector('[role="switch"]:not([disabled])') ?? node.querySelector('button:not(.ansa):not([disabled])'))?.focus();
		}
		node.addEventListener('click', clic);
		return { destroy: () => node.removeEventListener('click', clic) };
	}
	// en tampant un tirador, lo focus torna al boton del rail que l'aviá
	// dobèrt (al clavièr, se perdiá al començament de la pagina)
	let botons = $state({});
	async function tamparTirador() {
		const id = dobert;
		dobert = null;
		await tick();
		botons[id]?.focus();
	}

	// Lo rail se pòt desplaçar (una encòca per lo prene) e reduire (retorn de
	// Romain) ; per defaut a mièg nautor, pus luènh del capçal. Sa plaça e son
	// estat demòran d'una visita a l'autra, sus aqueste navigador sonque.
	const CLAU_RAIL = 'lo-ligam-carta-rail';
	const clampR = (v, a, b) => Math.max(a, Math.min(b, v));
	// lo bas del capçal (variabla --cap-bas de la pagina) : lo rail e los
	// tiradors demòran dejós, ont se pòdon totjorn prene
	const capBas = (p) => parseFloat(getComputedStyle(p).getPropertyValue('--cap-bas')) || 0;
	function borner(pos) {
		const p = railEl?.offsetParent;
		if (!p || !pos) return pos;
		const pr = p.getBoundingClientRect();
		const x = clampR(pos.x, 8, pr.width - railEl.offsetWidth - 8);
		// Dans la colonne de gauche, la flèche du nord et l'échelle s'alignent sous
		// le rail (publicarColomna) : déplacé, il s'arrête au-dessus d'elles, comme
		// à sa place par défaut (retour de Romain, 2026-10-19 : la flèche
		// recouvrait le bas du rail après un changement de taille de la fenêtre)
		const flecha = x < 160 && !orizontal && p.clientWidth > 600 ? p.querySelector('.compass') : null;
		const bas = flecha ? flecha.getBoundingClientRect().top - pr.top - 10 : pr.height - 8;
		return { x, y: clampR(pos.y, capBas(p) + 8, bas - railEl.offsetHeight) };
	}
	let railEl = $state(null);
	let railPos = $state(null); // { x, y } en px dins la carta ; null = plaça per defaut
	let reduch = $state(false);
	let posT = $state(null); // plaça del tirador, seguís lo rail
	let tiratge = null;
	// lo panèl sul costat (vertical) o en bas a l'orizontala (causida de Romain)
	let orizontal = $state(false);
	$effect(() => {
		try {
			const s = JSON.parse(localStorage.getItem(CLAU_RAIL) ?? 'null');
			if (s) {
				railPos = s.pos ?? null;
				reduch = !!s.reduch;
				orizontal = !!s.orizontal;
			}
		} catch {}
	});
	// en bas, la barra leva l'escala, lo zoom e las fonts de la carta (classa
	// sul contenidor : sa variabla --barra-bas)
	$effect(() => {
		const o = orizontal;
		railEl?.offsetParent?.classList.toggle('jaces-orizontalas', o);
	});
	// la plaça gardada es tornada borner a la talha de la fenèstra (una
	// fenèstra mai pichona podiá l'amagar)
	$effect(() => {
		const p = railEl?.offsetParent;
		if (!p) return;
		const ro = new ResizeObserver(() => {
			// (sonque pel panèl vertical d'un ecran larg : en bas, la plaça gardada
			// servís pas e se deu pas tocar)
			if (railPos && !orizontal && p.clientWidth > 600) railPos = borner(railPos);
			if (dobert) plaçarTirador();
		});
		ro.observe(p);
		return () => ro.disconnect();
	});
	// La flèche du nord et l'échelle (CartaOccitania) s'alignent sur le rail
	// (retour de Romain, 2026-10-15 : « alignement ») : son bord gauche et son
	// axe sont publiés sur le conteneur de la carte, tant qu'il est rangé dans la
	// colonne de gauche d'un écran large ; sinon (déplacé au milieu, barre du
	// téléphone), le bloc reprend la marge normale.
	function publicarColomna() {
		const p = railEl?.offsetParent;
		if (!p) return;
		const r = railEl.getBoundingClientRect(), pr = p.getBoundingClientRect();
		const esq = r.left - pr.left;
		if (!orizontal && p.clientWidth > 600 && esq < 160) {
			p.style.setProperty('--rail-esq', esq + 'px');
			p.style.setProperty('--rail-mitan', esq + r.width / 2 + 'px');
		} else {
			p.style.removeProperty('--rail-esq');
			p.style.removeProperty('--rail-mitan');
		}
	}
	$effect(() => {
		void railPos, reduch, orizontal;
		publicarColomna();
	});
	$effect(() => {
		const p = railEl?.offsetParent;
		if (!p) return;
		const ro = new ResizeObserver(publicarColomna);
		ro.observe(p);
		return () => {
			ro.disconnect();
			p.style.removeProperty('--rail-esq');
			p.style.removeProperty('--rail-mitan');
		};
	});
	const gardarRail = () => {
		try {
			localStorage.setItem(CLAU_RAIL, JSON.stringify({ pos: railPos, reduch, orizontal }));
		} catch {}
	};
	function alternarOrientacion() {
		orizontal = !orizontal;
		dobert = null;
		gardarRail();
	}
	// lo tirador s'alanda a costat del rail, del costat ont i a de plaça ; en
	// bas, al dessús de la barra
	// Lo fons de carta es sortit del rail (decision de Romain, 2026-10-10) : son
	// boton es amb los de la carta (CartaOccitania, eveniment « carta-fons ») e
	// lo tirador s'ancora a costat d'el, pel bas
	function dobrirFons(e) {
		if (e.detail?.boton) botons.fons = e.detail.boton;
		if (dobert === 'fons') return (dobert = null);
		dobert = 'fons';
		plaçarTirador();
	}
	$effect(() => {
		addEventListener('carta-fons', dobrirFons);
		return () => removeEventListener('carta-fons', dobrirFons);
	});
	// la carte revient à son état d'arrivée (fin des premiers pas) : panneau
	// fermé, hors du mode « Lengas de França » (sans y remettre les couches
	// d'avant : la page vient de remettre celles de l'arrivée)
	$effect(() => {
		const inici = () => {
			salvat = null;
			mòde = null;
			estatCarta.mòde = null;
			estatCarta.environament = [];
			sortirBanda();
		};
		addEventListener('carta-inici', inici);
		return () => removeEventListener('carta-inici', inici);
	});
	$effect(() => {
		botons.fons?.setAttribute?.('aria-expanded', String(dobert === 'fons'));
	});
	function plaçarTiradorFons() {
		const p = railEl?.offsetParent,
			b = botons.fons;
		if (!p || !b?.isConnected) return false;
		const r = b.getBoundingClientRect(),
			pr = p.getBoundingClientRect(),
			larg = Math.min(336, pr.width - 16);
		posT = {
			x: clampR(r.left - pr.left - larg - 12, 8, pr.width - larg - 8),
			bas: Math.max(8, pr.bottom - r.bottom),
			h: Math.max(160, r.bottom - pr.top - capBas(p) - 16)
		};
		return true;
	}
	function plaçarTirador() {
		if (dobert === 'fons' && plaçarTiradorFons()) return;
		const p = railEl?.offsetParent;
		if (!p) return;
		const r = railEl.getBoundingClientRect(),
			pr = p.getBoundingClientRect();
		const x = r.left - pr.left,
			y = r.top - pr.top,
			larg = Math.min(336, pr.width - r.width - 32);
		if (orizontal) {
			// (ancorat pel bas : just al dessús de la barra, quina que siá sa nautor)
			posT = { x: clampR(x, 8, pr.width - 344), bas: pr.height - y + 12, h: Math.max(160, y - 130) };
			return;
		}
		const drecha = x + r.width / 2 > pr.width / 2;
		const naut = capBas(p) + 8;
		const top = clampR(y, naut, Math.max(naut, pr.height - 420));
		posT = { x: drecha ? x - larg - 12 : x + r.width + 12, y: top, h: pr.height - top - 16 };
	}
	function prene(e) {
		if (e.button !== 0 || !railEl?.offsetParent) return;
		const r = railEl.getBoundingClientRect();
		tiratge = { dx: e.clientX - r.left, dy: e.clientY - r.top, pr: railEl.offsetParent.getBoundingClientRect() };
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function tirar(e) {
		if (!tiratge) return;
		const { dx, dy, pr } = tiratge;
		railPos = borner({ x: e.clientX - pr.left - dx, y: e.clientY - pr.top - dy });
		if (dobert) plaçarTirador();
	}
	function daissar() {
		if (!tiratge) return;
		tiratge = null;
		gardarRail();
	}
	// al clavièr : las sagetas desplaçan lo rail
	function clavièrEncòca(e) {
		if (e.key === 'Home') {
			e.preventDefault();
			return railPerDefaut();
		}
		const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key];
		if (!d || !railEl?.offsetParent) return;
		e.preventDefault();
		const r = railEl.getBoundingClientRect(),
			pr = railEl.offsetParent.getBoundingClientRect();
		railPos = borner({ x: r.left - pr.left + d[0], y: r.top - pr.top + d[1] });
		gardarRail();
		if (dobert) plaçarTirador();
	}
	function railPerDefaut() {
		railPos = null;
		gardarRail();
		if (dobert) requestAnimationFrame(plaçarTirador);
	}
	// Plegar o desplegar lo panèl coma un papièr (retorn de Romain : « une
	// animation très satisfaisante » e un bruch de papièr) : los botons se
	// viran un per un, del bas cap al naut, e lo panèl se sarra amb un pichon
	// rebond ; l'encòca demòra a sa plaça. Sens animacion se lo sistèma o
	// demanda (movement reduch).
	// los sons de la carta (papièr del panèl) : desactivables, memorizats
	let sons = $state(true);
	$effect(() => {
		sons = sonsActius();
	});
	function alternarSons() {
		sons = !sons;
		gardarSons(sons);
	}
	let plegant = false;
	async function alternarReduch() {
		if (plegant || !railEl) return;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const plegar = !reduch;
		sonPapièr(plegar);
		// lo panèl centrat se fixa ont es, que l'encòca bolegue pas
		if (!railPos && railEl.offsetParent) {
			const r = railEl.getBoundingClientRect(),
				pr = railEl.offsetParent.getBoundingClientRect();
			railPos = { x: r.left - pr.left, y: r.top - pr.top };
			await tick();
		}
		const cs = getComputedStyle(railEl);
		const hEncòca = () =>
			railEl.querySelector('.encòca').offsetHeight +
			['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((s, k) => s + parseFloat(cs[k]), 0);
		const plecs = () => [...railEl.querySelectorAll('.rail-b, .rail-sep')];
		const virar = (els, de, a, òrdre) =>
			els.forEach((el, i) =>
				el.animate(
					[
						{ transform: `perspective(260px) rotateX(${de}deg)`, opacity: de ? 0 : 1, transformOrigin: '50% 0' },
						{ transform: `perspective(260px) rotateX(${a}deg)`, opacity: a ? 0 : 1, transformOrigin: '50% 0' }
					],
					{ duration: 240, delay: òrdre(i, els.length) * 32, easing: de ? 'cubic-bezier(.2,.8,.3,1)' : 'cubic-bezier(.55,0,.75,.2)', fill: 'both' }
				)
			);
		if (plegar) {
			dobert = null;
			if (!calm) {
				plegant = true;
				const h0 = railEl.offsetHeight,
					h1 = hEncòca(),
					els = plecs();
				railEl.style.overflow = 'hidden';
				virar(els, 0, -95, (i, n) => n - 1 - i);
				await railEl.animate(
					[{ height: h0 + 'px' }, { height: h1 * 0.9 + 'px', offset: 0.86 }, { height: h1 + 'px' }],
					{ duration: 300 + els.length * 32, easing: 'cubic-bezier(.6,0,.3,1)' }
				).finished;
				els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
				railEl.style.overflow = '';
				plegant = false;
			}
			reduch = true;
		} else {
			const h1 = railEl.offsetHeight;
			reduch = false;
			await tick();
			// desplegat, lo panèl deu demorar dins la carta (e al dessús de la bossòla)
			if (railPos) railPos = borner(railPos);
			if (!calm) {
				plegant = true;
				const h0 = railEl.offsetHeight,
					els = plecs();
				railEl.style.overflow = 'hidden';
				virar(els, 95, 0, (i) => i);
				await railEl.animate(
					[{ height: h1 + 'px' }, { height: h0 * 1.03 + 'px', offset: 0.8 }, { height: h0 + 'px' }],
					{ duration: 320 + els.length * 32, easing: 'cubic-bezier(.2,.7,.3,1)' }
				).finished;
				els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
				railEl.style.overflow = '';
				plegant = false;
			}
		}
		gardarRail();
	}

	const totas = $derived(familhas.flatMap((f) => f.jaces));
	const actiu = (j) => j.estat === 'disponible' && (!j.fons || j.fons === baseLayer);
	const afichadas = $derived(totas.filter((j) => actiu(j) && visibility[j.id]));
	// lo nombre de jaces alucadas d'una familha (la chifra del rail)
	const nAlucadas = (id) => familhas.find((f) => f.id === id)?.jaces.filter((j) => actiu(j) && visibility[j.id]).length ?? 0;
	const nomJ = (j) => (lang === 'oc' ? j.oc : (j[lang] ?? j.fr ?? j.oc));
	const gropJ = (j) => (lang === 'oc' ? j.grop_oc : (j['grop_' + lang] ?? j.grop_fr));
	const notaJ = (j) =>
		j.estat === 'basa'
			? tx.indisponible
			: j.estat === 'disponible' && j.fons && j.fons !== baseLayer
				? tx.sonqueFons
				: ((lang === 'oc' ? j.nota_oc : (j['nota_' + lang] ?? j.nota_fr ?? j.nota_oc)) ?? (actiu(j) ? null : tx.aVenir));
	// a quina escala la jaça se vei, escrich quand es cochada (demanda de
	// Romain, 2026-10-09 ; « visible » : lo Basic de lo Congrès, oc general)
	const kmTèxt = (k) => (k < 1 ? k * 1000 + ' m' : String(k).replace('.', lang === 'en' ? '.' : ',') + ' km');
	const escalaJ = (j) => {
		const pl = PLAJAS[j.id];
		if (!pl) return null;
		if (tx.escala) return tx.escala(kmTèxt(pl[0]), pl[1] ? kmTèxt(pl[1]) : null);
		if (lang === 'oc') return pl[1] ? `Visibla de ${kmTèxt(pl[0])} a ${kmTèxt(pl[1])}` : `Visibla a partir de ${kmTèxt(pl[0])}`;
		return pl[1] ? `Visible de ${kmTèxt(pl[0])} à ${kmTèxt(pl[1])}` : `Visible à partir de ${kmTèxt(pl[0])}`;
	};
	const nomFam = (id) => {
		if (id === 'lengas' && mòde) return tx.lengasFranca;
		if (id === 'sus') return tx.sus;
		if (id === 'fons') return tx.fons;
		const f = familhas.find((x) => x.id === id);
		return f ? (lang === 'oc' ? f.oc : (f[lang] ?? f.fr)) : id;
	};

	// Tota la linha aluca o escantís sa jaça (decision de Romain, 2026-10-10) ;
	// los botons, pastilhas, bullas e reglatges de la linha gardan lor clic
	function clicLinha(e, j) {
		if (!actiu(j) || e.target.closest('button, a, input, select, label, .info, .pastilhas, .causida-j, [role="button"], [role="switch"]')) return;
		tocarJaça(j);
	}
	// Le nom d'une couche (ligne du panneau, pastille du téléphone) : allumée mais
	// pas active, elle devient active ; sinon elle s'allume ou s'éteint
	// (l'interrupteur des lignes, lui, allume et éteint toujours)
	function tocarJaça(j) {
		if (visibility[j.id] && seleccionabla(j.id) && estatCarta.activa !== j.id) return void activar(j.id);
		bascular(j.id, !visibility[j.id]);
	}
	// La couche active, façon QGIS (option A de Romain, 2026-10-19) : la dernière
	// allumée, ou celle dont on touche le nom ; éteinte, plus de couche active
	const seleccionabla = (id) => SELECCIONABLAS.has(id) || !!LENGAS[id];
	// (escantida : la man tòrna a la jaça activa precedenta encara alucada)
	$effect(() => {
		const a = estatCarta.activa;
		if (a && !visibility[a]) {
			estatCarta.pila = estatCarta.pila.filter((id) => id !== a && visibility[id]);
			estatCarta.activa = estatCarta.pila.at(-1) ?? null;
		}
	});
	// La jaça es alucada mas pas vesibla a l'escala actuala
	const foraEscala = (j) => estatCarta.z != null && zPlaja(j.id, estatCarta.z, estatCarta.lat) != null;
	const anarPlaja = (id) => dispatchEvent(new CustomEvent('carta-anar-plaja', { detail: { id } }));
	// L'apercebut al survòl (decision de Romain, 2026-10-10) : aprèp 3 s
	// sus una linha, la jaça s'aluca un moment, sens bolegar la carta ;
	// pas per las jaças pesugas o amb son pròpri espectacle, ni fòra escala
	const SENS_APERCEBUT = new Set(['comunas', 'dialectes', 'creissent', 'lengasFranca', 'frontiera', 'unificat']);
	let minutaApercebut = null;
	const podApercebre = (j) =>
		actiu(j) && j.estat === 'disponible' && !visibility[j.id] && !SENS_APERCEBUT.has(j.id) && !LENGAS[j.id] &&
		!(j.fons && j.fons !== baseLayer) && estatCarta.z != null && zPlaja(j.id, estatCarta.z, estatCarta.lat) == null;
	function entrarLinha(e, j) {
		if (e.pointerType !== 'mouse') return;
		sortirLinha();
		if (!podApercebre(j)) return;
		minutaApercebut = setTimeout(() => {
			if (visibility[j.id]) return;
			estatCarta.apercebut = j.id;
			visibility[j.id] = true;
		}, 3000); // (3 s : demanda de Romain, 2026-10-10)
	}
	function sortirLinha() {
		clearTimeout(minutaApercebut);
		const id = estatCarta.apercebut;
		if (!id) return;
		visibility[id] = false;
		estatCarta.apercebut = null;
	}
	$effect(() => {
		if (!dobert) untrack(sortirLinha);
	});

	// La fuèlha del telefòn (lòt 4, decision de Romain, 2026-10-10) : tocar
	// l'ansa la fa passar de mitat a plena e tornar ; tirada, se pausa a
	// la nautor mai pròcha (tampada, a mitat, plena)
	let plena = $state(false);
	let tiratgeF = $state(null);
	$effect(() => {
		if (!dobert) plena = false;
	});
	function prenerAnsa(e) {
		const t = document.getElementById('tirador-jaces');
		if (!t || e.button > 0) return;
		tiratgeF = { y0: e.clientY, h0: t.getBoundingClientRect().height, h: null, mogut: false };
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function tirarAnsa(e) {
		if (!tiratgeF) return;
		const dy = e.clientY - tiratgeF.y0;
		if (Math.abs(dy) > 6) tiratgeF.mogut = true;
		if (tiratgeF.mogut) tiratgeF.h = Math.max(60, tiratgeF.h0 - dy);
	}
	function daissarAnsa() {
		if (!tiratgeF) return;
		const { mogut, h } = tiratgeF;
		tiratgeF = null;
		if (!mogut) return (plena = !plena);
		// (aprèp un tiratge, lo clic que seguís tomba pas sus çò de dejós)
		const avalar = (ev) => (ev.stopPropagation(), ev.preventDefault());
		addEventListener('click', avalar, { capture: true, once: true });
		setTimeout(() => removeEventListener('click', avalar, { capture: true }), 350);
		const p = railEl?.offsetParent?.getBoundingClientRect().height ?? innerHeight;
		if (h < p * 0.22) return tamparTirador();
		plena = h > p * 0.6;
	}

	// La banda del telefòn (decision de Romain, 2026-10-10) : sus un ecran
	// estrech, tocar una familha la plaça a esquèrra de la barra e sas jaças
	// desfilan a drecha, en pastilhas que s'alucan en las tocant ; « ⋯ »
	// dobrís la fuèlha amb tot lo detalh ; tornar tocar la familha torna a
	// las familhas. « Sus la carta » e « Autras lengas » gardan la fuèlha.
	let estreit = $state(false);
	let banda = $state(null);
	$effect(() => {
		const ecran = railEl?.closest('.screen') ?? railEl?.offsetParent;
		if (!ecran) return;
		const ro = new ResizeObserver(([e]) => (estreit = e.contentRect.width <= 600));
		ro.observe(ecran);
		return () => ro.disconnect();
	});
	$effect(() => {
		if (!estreit) banda = null;
	});
	const familhaDe = (id) => familhas.find((f) => f.id === id);
	function sortirBanda() {
		banda = null;
		dobert = null;
	}

	// mots longs del rail : copats amb un tiret, pas al mièg d'una sillaba
	const cesura = (t) => t.replace(/^Adminis(tra)/, 'Adminis­$1');

	function bascular(id, on) {
		// (un clic pendent l'apercebut : la jaça demòra, e aqueste còp compta
		// dins l'istoric ; lo doble cambiament relança l'efièch de l'istoric)
		if (estatCarta.apercebut === id) {
			estatCarta.apercebut = null;
			visibility[id] = false;
			visibility[id] = true;
			if (seleccionabla(id)) activar(id);
			return;
		}
		visibility[id] = on;
		if (on && seleccionabla(id)) activar(id);
		// (una jaça escantida : sas zònas son pas pus causidas, las de las autras demòran)
		if (id === 'dialectes' && !on) causits = causits.filter((k) => !esOccitan(k));
		if (LENGAS[id] && !on) causits = causits.filter((k) => !k.startsWith(LENGAS[id].pref));
	}
	// Una pastilha de dialècte (o del Creissent) : aluca la jaça e apond la zòna
	// a la causida, o l'en leva se i èra (retorn de Romain : mantuna a l'encòp)
	function causirDial(k) {
		visibility.dialectes = true;
		activar('dialectes');
		causits = causits.includes(k) ? causits.filter((x) => x !== k) : [...causits, k];
	}

	// Una pastilha d'una autra lenga : aluca sa jaça e apond la zòna
	function causirLenga(id, k) {
		visibility[id] = true;
		activar(id);
		const kod = LENGAS[id].pref + k;
		// (un dialècte d'una lenga de la familha, coma lo ch'ti : remplaça sa lenga)
		const de = LENGAS[id].pastilhas.find((q) => q.k === k)?.de;
		const b = de ? causits.filter((x) => x !== LENGAS[id].pref + de) : causits;
		causits = b.includes(kod) ? b.filter((x) => x !== kod) : [...b, kod];
	}

	// Colors del fons que l'internauta pòt cambiar, e lor valor de basa segon lo tèma
	const COLORS_FONS = ['costa', 'riu', 'estela', 'corba'];
	const APERCEBUT_COLOR = { costa: 'costa', riu: 'rius', estela: 'estelas', corba: 'corbas' };
	const colorBasa = (
		clar
			? { estela: '#6b3a22', riu: '#b06a14', corba: '#8a5a2b', costa: '#2a1a10' }
			: { estela: '#f5ead8', riu: '#eeaf34', corba: '#eeaf34', costa: '#f5ead8' }
	);
	// Sonque los contorns : la còsta e la frontièra de la lenga, res mai
	function sonqueContorns() {
		for (const j of totas) if (visibility[j.id] && j.id !== 'frontiera') visibility[j.id] = false;
		visibility.frontiera = true;
		causits = [];
	}
	// L'occitan tornat (demanda de Romain, 2026-10-09) : las jaces de la lenga
	// per defaut (domeni, dialèctes, noms de las vilas) ; la carta i vòla (CartaOccitania)
	function afichatOccitan() {
		for (const j of familhas.find((f) => f.id === 'lenga')?.jaces ?? []) if (j.defaut && actiu(j)) visibility[j.id] = true;
	}
	// Tot tornar : las jaces per defaut del catalògue
	function totTornar() {
		for (const j of totas) visibility[j.id] = !!j.defaut;
		causits = [];
	}
	// Istoric de las manipulacions (demanda de Romain) : cada cambiament de la
	// carta (jaces, dialècte causit, fons, colors) es gardat, per lo poder
	// anullar ; tant del panèl coma d'un clic sus la carta
	let istoric = $state([]);
	let darrièr = null,
		anullant = false,
		pret = false; // l'istoric comença al primièr gèst (pas al cargament de la basa)
	$effect(() => {
		const estat = JSON.stringify({ v: $state.snapshot(visibility), d: causits, b: baseLayer, c: $state.snapshot(colors) });
		untrack(() => {
			if (estatCarta.apercebut) return; // (un apercebut al survòl : pas dins l'istoric)
			if (pret && darrièr && estat !== darrièr && !anullant) istoric = [...istoric.slice(-39), darrièr];
			anullant = false;
			darrièr = estat;
		});
	});
	function anullar() {
		const e = istoric.at(-1);
		if (!e) return;
		istoric = istoric.slice(0, -1);
		anullant = true;
		const s = JSON.parse(e);
		for (const k of Object.keys({ ...visibility, ...s.v })) visibility[k] = !!s.v[k];
		causits = Array.isArray(s.d) ? s.d : s.d ? [s.d] : [];
		baseLayer = s.b;
		colors = s.c;
	}
	// Netejar : totas las jaces escantidas, sens dialècte causit (lo fons e las
	// colors demòran) ; anullable
	function netejar() {
		for (const j of totas) if (visibility[j.id]) visibility[j.id] = false;
		causits = [];
	}
	// Un clic defòra tampa (principi del site, $lib/tampaDefora.js) : lo
	// tirador, e las bullas d'informacion
	$effect(() => {
		if (!dobert) return;
		return tampaDefòra((t) => !!t.closest('#tirador-jaces, .rail, .fons-carta'), () => (dobert = null));
	});
	function clicDefòra(e) {
		pret = true;
		const info = document.activeElement?.closest?.('.info');
		if (info && e.target instanceof Element && !info.contains(e.target)) info.blur();
	}
	function onKey(e) {
		pret = true;
		if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !/^(INPUT|TEXTAREA)$/.test(e.target?.tagName ?? '')) {
			if (istoric.length) {
				e.preventDefault();
				anullar();
			}
			return;
		}
		if (e.key === 'Escape' && dobert) {
			if (document.getElementById('tirador-jaces')?.contains(document.activeElement)) tamparTirador();
			else dobert = null;
		}
	}
</script>

<svelte:window onkeydown={onKey} onpointerdowncapture={clicDefòra} />

<!-- comandas-carta (app.css) : la couleur des commandes posées sur la carte -->
<nav
	class="rail comandas-carta"
	class:desplaçat={!!railPos && !orizontal}
	class:reduch
	class:orizontal
	aria-label={tx.rail}
	bind:this={railEl}
	style:--rail-x={railPos ? railPos.x + 'px' : null}
	style:--rail-y={railPos ? railPos.y + 'px' : null}
>
	<div class="encòca">
		<button
			type="button"
			class="prene"
			aria-label={tx.desplaçar}
			title={tx.desplaçar}
			onpointerdown={prene}
			onpointermove={tirar}
			onpointerup={daissar}
			onpointercancel={daissar}
			onkeydown={clavièrEncòca}
			ondblclick={railPerDefaut}
		><span aria-hidden="true"></span></button>
		<button type="button" class="reduire" aria-expanded={!reduch} aria-label={reduch ? tx.desplegar : tx.reduire} title={reduch ? tx.desplegar : tx.reduire} onclick={alternarReduch}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d={reduch ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'} /></svg>
		</button>
		<button
			type="button"
			class="reduire"
			aria-pressed={orizontal}
			aria-label={orizontal ? tx.costat : tx.enBas}
			title={orizontal ? tx.costat : tx.enBas}
			onclick={alternarOrientacion}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				>{#if orizontal}<path d="M5 4v16M5 4h4v16H5" />{:else}<path d="M4 19h16M4 19v-4h16v4" />{/if}</svg
			>
		</button>
	</div>
	{#if mòde}
		<!-- lo mòde : tornar a l'occitan, en naut -->
		<button type="button" class="rail-b retorn" aria-label={tx.tornarOc} title={tx.tornarOc} onclick={sortirMòde}>
			<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC.lenga}</svg>
			<span class="lib">{tx.occitan}</span>
		</button>
		<span class="rail-sep" aria-hidden="true"></span>
		{#each ['sus', 'lengas', 'donadas'] as id (id)}
			<button
				type="button"
				class="rail-b"
				class:rail-sus={id === 'sus'}
				data-familha={id}
				bind:this={botons[id]}
				aria-expanded={dobert === id}
				aria-controls="tirador-jaces"
				onclick={(e) => alternarClavièr(e, id)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC[id]}</svg>
				<span class="lib">{id === 'lengas' ? tx.lengas : nomFam(id)}</span>
				{#if id === 'sus' && afichadas.length}
					<span class="compte" aria-label={tx.afichadas(afichadas.length)}>{afichadas.length}</span>
				{/if}
			</button>
		{/each}
	{:else if estreit && banda}
		<button type="button" class="rail-b banda-fam" aria-expanded="true" aria-label={tx.tornarFamilhas(nomFam(banda))} onclick={sortirBanda}>
			<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC[banda]}</svg>
			<span class="lib">{nomFam(banda)}</span>
		</button>
		<div class="banda-jaces" role="group" aria-label={nomFam(banda)}>
			{#each familhaDe(banda)?.jaces ?? [] as j (j.id)}
				<button
					type="button"
					class="chip"
					data-jaca={j.id}
					class:on={actiu(j) && visibility[j.id]}
					class:fora={actiu(j) && visibility[j.id] && foraEscala(j)}
					class:activa={estatCarta.activa === j.id && !!visibility[j.id]}
					role="switch"
					aria-checked={actiu(j) && !!visibility[j.id]}
					disabled={!actiu(j)}
					onclick={() => tocarJaça(j)}
				>
					{#if j.icona}<span class="chip-ponch" style:--ponch="var(--t-{j.color ?? 'aur'})" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{@html ICONAS[j.icona]}</svg></span>{:else}<span class="chip-ap"><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(j.id)}</svg></span>{/if}{nomJ(j)}{#if estatCarta.activa === j.id && visibility[j.id]}<span class="sr"> ({tx.jaçaActiva})</span>{/if}
				</button>
			{/each}
			<button type="button" class="chip mai" aria-label={tx.totDetalh} title={tx.totDetalh} aria-expanded={dobert === banda} aria-controls="tirador-jaces" onclick={() => alternar(banda)}>⋯</button>
		</div>
	{:else}
	{#each RAIL as id (id)}
		{#if id === 'lengas'}<span class="rail-sep" aria-hidden="true"></span>{/if}
		<button
			type="button"
			class="rail-b"
			class:rail-sus={id === 'sus'}
			data-familha={id}
			bind:this={botons[id]}
			aria-expanded={dobert === id}
			aria-controls="tirador-jaces"
			onclick={(e) => alternarClavièr(e, id)}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC[id]}</svg>
			<span class="lib">{cesura(nomFam(id))}</span>
			{#if id === 'sus' && afichadas.length}
				<span class="compte" aria-label={tx.afichadas(afichadas.length)}>{afichadas.length}</span>
			{:else if id !== 'sus' && nAlucadas(id)}
				<!-- una pichona chifra, pas pus un ponch irange (decision de Romain, 2026-10-10) -->
				<span class="nombre" aria-label={tx.afichadas(nAlucadas(id))}>{nAlucadas(id)}</span>
			{/if}
		</button>
		{#if id === 'sus'}<span class="rail-sep" aria-hidden="true"></span>{/if}
	{/each}
	{/if}
</nav>

{#if dobert}
	<section
		id="tirador-jaces"
		use:gardarFocus
		class="tirador comandas-carta"
		data-tirador={dobert}
		aria-label={nomFam(dobert)}
		style:--tir-x={posT ? posT.x + 'px' : null}
		style:--tir-y={posT ? posT.y + 'px' : null}
		style:--tir-h={posT ? posT.h + 'px' : null}
		style:--tir-bas={posT?.bas != null ? posT.bas + 'px' : null}
		class:amont={orizontal || (dobert === 'fons' && posT?.bas != null)}
		class:plena
		class:tirat={tiratgeF?.h != null}
		style:--fuelha-h={tiratgeF?.h != null ? tiratgeF.h + 'px' : null}
		transition:fly={orizontal || dobert === 'fons' ? { y: 14, duration: 260, easing: quintOut } : { x: -14, duration: 260, easing: quintOut }}
	>
		<!-- l'ansa de la fuèlha (telefòn sonque) ; al clavièr, Entrada l'agrandís o la reduch -->
		<button
			type="button"
			class="ansa"
			aria-label={plena ? tx.fuelhaReduire : tx.fuelhaAgrandir}
			onpointerdown={prenerAnsa}
			onpointermove={tirarAnsa}
			onpointerup={daissarAnsa}
			onpointercancel={daissarAnsa}
			onclick={(e) => e.detail === 0 && (plena = !plena)}
		></button>
		<header>
			<h2>{nomFam(dobert)}</h2>
			<button type="button" class="tampar" onclick={tamparTirador} aria-label={tx.tampar}><Icona nom="fermer" size="1.25em" /></button>
		</header>

		{#if dobert === 'sus'}
			<p class="sota">{tx.afichadas(afichadas.length)} · {tx.fonsCarta.toLowerCase()}{tx.dp ?? ' :'} {tx.basemaps[baseLayer] ?? baseLayer}</p>
			<div class="botons botons-sus">
				<button type="button" class="boton" onclick={anullar} disabled={!istoric.length} title={tx.anullarTitol}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
					{tx.anullar}
				</button>
				<button type="button" class="boton" onclick={netejar} disabled={!afichadas.length} title={tx.netejarTitol}>{tx.netejar}</button>
			</div>
			{#if !afichadas.length}
				<p class="res">{tx.res}</p>
			{/if}
			<!-- la lenga occitana levada (« Netejar la carta ») : la tornar d'un clic -->
			{#if !visibility.dialectes && !visibility.unificat}
				<button type="button" class="boton boton-oc" onclick={afichatOccitan}>{tx.afichatOc}</button>
			{/if}
			<!-- la legenda de sa carta, rengada per tematica (demanda de Romain, 2026-10-09) -->
			{#each familhas.filter((f) => f.jaces.some((j) => afichadas.includes(j))) as f (f.id)}
				{@const js = f.jaces.filter((j) => afichadas.includes(j))}
				{@const dobèrt = !enrotlats.includes(f.id)}
				<button type="button" class="titolet tèma" aria-expanded={dobèrt} onclick={() => virarTèma(f.id)}>
					{nomFam(f.id)}<span class="tèma-n">{js.length}</span>
					<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
				</button>
				{#if dobèrt}
					<div class="tèma-cos" transition:slide={{ duration: 220 }}>
						{#each js as j (j.id)}
							{@render linha(j)}
						{/each}
					</div>
				{/if}
			{/each}
		{:else if dobert === 'fons'}
			<p class="titolet">{tx.fonsCarta}</p>
			<div class="fonses" role="radiogroup" aria-label={tx.fonsCarta}>
				{#each ['estelas', 'occitan', 'natural', 'satellite'] as k (k)}
					<button
						type="button"
						role="radio"
						aria-checked={baseLayer === k}
						class="fons"
						onclick={() => (baseLayer = k)}
					>
						<i class="fons-{k}"></i>{tx.basemaps[k]}
					</button>
				{/each}
			</div>
			<p class="titolet">{tx.colors}</p>
			{#each COLORS_FONS as k (k)}
				<div class="linha">
					<span class="apercebut" style:color={colors[k] ?? colorBasa[k]}
						><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(APERCEBUT_COLOR[k])}</svg></span
					>
					<div class="cos"><b>{tx.colorDe[k]}</b></div>
					<label class="mostra" title={tx.color(tx.colorDe[k])}>
						<input
							type="color"
							value={colors[k] ?? colorBasa[k]}
							oninput={(e) => (colors = { ...colors, [k]: e.currentTarget.value })}
							aria-label={tx.color(tx.colorDe[k])}
						/>
					</label>
				</div>
			{/each}
			<div class="botons">
				<button type="button" class="boton" onclick={sonqueContorns}>{tx.sonqueContorns}</button>
				<button type="button" class="boton" onclick={totTornar}>{tx.totTornar}</button>
				<button type="button" class="boton" aria-pressed={sons} onclick={alternarSons}>{tx.sons(sons)}</button>
				{#if Object.keys(colors).length}
					<button type="button" class="boton" onclick={() => (colors = {})}>{tx.colorsTema}</button>
				{/if}
			</div>
		{:else}
			{@const f = familhas.find((x) => x.id === dobert)}
			{#if f}
				{@const dispo = f.jaces.filter(actiu).length}
				{#if f.id === 'lengas' && mòde}
					<div class="ordre" role="radiogroup" aria-label={tx.ordreTit}>
						{#each tx.ordres as [k, nom] (k)}
							<button type="button" role="radio" aria-checked={ordre === k} onclick={() => (ordre = k)}>{nom}</button>
						{/each}
					</div>
					{#each f.jaces.filter((j) => !LENGAS[j.id]) as j (j.id)}{@render linha(j)}{/each}
					{#each lengasMòde(f) as l, i (l.j.id)}
						<div class="ficha-arr" style:--i={i}>
							{#if l.oc}{@render fichaOccitan()}{:else}{@render fichaLenga(l.j)}{/if}
						</div>
					{/each}
				{:else if f.id === 'lengas'}
					<div class="onglets" role="tablist" aria-label={nomFam(f.id)}>
						{#each tx.onglets as [k, nom] (k)}
							<button type="button" role="tab" aria-selected={onglet === k} class:on={onglet === k} disabled={!['franca', 'trans'].includes(k)} onclick={() => (onglet = k)}
								>{nom}<small>{['franca', 'trans'].includes(k) ? tx.nLengas(f.jaces.filter((j) => LENGAS[j.id] && actiu(j) && (FICHAS[j.id]?.onglet ?? 'franca') === k).length) : tx.deVenir}</small></button
							>
						{/each}
					</div>
					<div class="ordre" role="radiogroup" aria-label={tx.ordreTit}>
						{#each tx.ordres as [k, nom] (k)}
							<button type="button" role="radio" aria-checked={ordre === k} onclick={() => (ordre = k)}>{nom}</button>
						{/each}
					</div>
					{#if onglet === 'franca'}
						{#each f.jaces.filter((j) => !LENGAS[j.id]) as j (j.id)}{@render linha(j)}{/each}
					{/if}
					{#each lengasOnglet(f) as j, i (j.id)}<div class="ficha-arr" style:--i={i}>{@render fichaLenga(j)}</div>{/each}
				{:else}
					<p class="sota">{tx.disponiblas(dispo)}{f.jaces.length - dispo ? ' · ' + tx.venir(f.jaces.length - dispo) : ''}</p>
					{#each f.jaces as j, i (j.id)}
						<!-- los gropes d'una familha (Ensenhament : l'immersion, l'ensenhament public, lo superior e los adults) -->
						{#if j.grop_oc && j.grop_oc !== f.jaces[i - 1]?.grop_oc}<p class="titolet grop-j">{gropJ(j)}</p>{/if}
						{@render linha(j)}
					{/each}
				{/if}
			{/if}
		{/if}

		{#if esAdmin}
			<a class="admin" href="/admin/carta">{tx.admin} <Icona nom="suivant" /></a>
		{/if}
	</section>
{/if}

<!-- La ficha de l'occitan dins lo mòde, a egalitat amb las autras (retorn de
     Romain, 2026-10-10 : « que siá coerent ») ; sa jaça es la dels dialèctes.
     Pas de locutors ni d'estat UNESCO tant que n'an pas una font. -->
<!-- La silhoeta d'una lenga : sa part francesa en plen, la rèsta en clar ; se
     desbòrda de França, es un boton : « Veire la lenga dins son environament
     lingüistic » aluca la rèsta sus la carta (Romain, 2026-10-10) -->
{#snippet silhoeta(id, color)}
	{#if silhoetas[id]}
		{@const tota = !estrangièr[id] || estatCarta.environament.includes(id)}
		{#if mòde && estrangièr[id]}
			<button
				type="button"
				class="silh-b"
				aria-pressed={tota}
				aria-label={tota ? tx.amagarRèsta : tx.environament(id === 'oil')}
				title={tota ? tx.amagarRèsta : tx.environament(id === 'oil')}
				onclick={() => alternarEnvironament(id)}>{@render dessenhSilh(id, color, tota)}</button
			>
		{:else}
			{@render dessenhSilh(id, color, tota)}
		{/if}
	{/if}
{/snippet}
{#snippet dessenhSilh(id, color, tota)}
	<svg class="silh" viewBox="0 0 40 40" aria-hidden="true"
		><defs><clipPath id={'silh-fr-' + id}><path d={silhoetasFr[id] ?? ''} /></clipPath></defs
		><path d={silhoetas[id]} fill={color} fill-opacity={tota ? 1 : 0.28} fill-rule="evenodd" />{#if !tota}<path
				d={silhoetas[id]}
				fill={color}
				fill-rule="evenodd"
				clip-path={silhoetasFr[id] ? `url(#silh-fr-${id})` : null}
			/>{/if}</svg
	>
{/snippet}

{#snippet fichaOccitan()}
	{@const dob = dialsDob.includes('occitan')}
	{@const on = !!visibility.dialectes}
	<div class="ficha" class:alucada={on} class:activa={on && estatCarta.activa === 'dialectes'}>
		<div class="ficha-cap">
			<span class="banda" style:background={`linear-gradient(${NOMS_DIAL.map(([k]) => DIAL[k]).join(', ')})`}></span>
			<div class="ficha-cos">
				<span class="endo" lang="oc">Occitan</span>
				<span class="nom-lg">{lang === 'fr' ? 'occitan' : 'occitan'}</span>
				<p class="desc">{tx.occitanDesc ?? (lang === 'fr' ? "Ses six dialectes, de Bordeaux à Nice ; le Val d'Aran et des vallées d'Italie aussi" : "Sos sièis dialèctes, de Bordèu a Niça ; la Val d'Aran e de valadas d'Itàlia tanben")}</p>
				<p class="meta">
					{@render infoFont({ t: tx.infoOc ?? 'Classement : indo-européen › roman › gallo-roman › occitano-roman (Glottolog, Institut Max Planck)', url: 'https://glottolog.org/glottolog?search=Occitan' }, tx.familha ?? (lang === 'fr' ? 'romane' : 'romana'))}
				</p>
			</div>
			<div class="ficha-dreita">
				<button type="button" class="basc" role="switch" aria-checked={on} aria-label={tx.occitan} onclick={() => bascular('dialectes', !on)}></button>
				{@render silhoeta('occitan', clar ? '#b0202c' : '#d9343f')}
			</div>
		</div>
		<div class="desplegar-l">
			<button type="button" class="desplegar" aria-expanded={dob} onclick={() => virarDials('occitan')}
				><span class="chev" aria-hidden="true">▸</span>{tx.nDial(NOMS_DIAL.length, false)}</button
			>
			{@render infoFont({ t: tx.infoDial ?? "Dialèctes d'après la carte d'Occitanica (CIRDÒC), recalée sur les communes", url: 'https://www.occitanica.eu' }, 'ⓘ', 'sol')}
		</div>
		{#if dob}
			<ul class="albre" role="group" aria-label={tx.causirDial} transition:slide={{ duration: 200 }}>
				{#each gropesDial('occitan', NOMS_DIAL, (d) => d[0]) as G (G.g)}
					{#if G.g}<li class="grope-tit">{tx.gropeDial[G.g]}</li>{/if}
					{#each G.lista as [k, oc, fr] (k)}
						<li>
							<button type="button" class="d" aria-pressed={causits.includes(k)} lang="oc" onclick={() => causirDial(k)}
								><i style:background={DIAL[k]}></i><span class="e">{oc}</span>{#if lang === 'fr' && fr !== oc}<span class="f" lang="fr">{fr}</span>{/if}</button
							>
						</li>
					{/each}
				{/each}
				<li>
					<button type="button" class="d" aria-pressed={causits.includes('cro')} lang="oc" onclick={() => causirDial('cro')}
						><i class="cro"></i><span class="e">creissent</span>{#if lang === 'fr'}<span class="f" lang="fr">croissant</span>{/if}</button
					>
				</li>
			</ul>
		{/if}
	</div>
{/snippet}

{#snippet fichaLenga(j)}
	{@const lg = LENGAS[j.id]}
	{@const fi = FICHAS[j.id] ?? {}}
	{@const dz = lg.pastilhas.filter((q) => lg.dial.sorne[q.k] && !q.de)}
	{@const dob = dialsDob.includes(j.id)}
	{@const nomLg = lang === 'fr' ? lg.nom.fr : lg.nom.oc}
	<div class="ficha" class:alucada={!!visibility[j.id]} class:activa={estatCarta.activa === j.id && !!visibility[j.id]}>
		<div class="ficha-cap">
			<span class="banda" style:background={`linear-gradient(${dz.map((q) => colorPastilha(j.id, q.k)).join(', ')})`}></span>
			<div class="ficha-cos">
				<span class="endo" lang={lg.lang}>{lg.nom.endo.charAt(0).toUpperCase() + lg.nom.endo.slice(1)}</span>
				<span class="nom-lg">{nomLg}</span>
				{#if notaJ(j)}<p class="desc">{notaJ(j)}</p>{/if}
				<!-- cada informacion amb sa font al survòl (demanda de Romain : cercaires o institucions) -->
				<p class="meta">
					{#if fi.locutors}{@render infoFont(fi.fontLocutors, `<b>${fi.locutors}</b> ${tx.locutors}`)}{/if}
					{#if fi.familha}{@render infoFont(fi.fontFamilha, familhaTx(fi.familha))}{/if}
					{#if fi.vital}{@render infoFont({ t: fi.vital.t, url: 'https://unesdoc.unesco.org/ark:/48223/pf0000187026' }, `<i style="background:${VITALITAT[fi.vital.k] ?? '#999'}"></i>${vitalTx(fi.vital)}`, 'vital')}{/if}
				</p>
			</div>
			<div class="ficha-dreita">
				<button
					type="button"
					class="basc"
					role="switch"
					aria-checked={!!visibility[j.id]}
					aria-label={nomJ(j)}
					onclick={() => bascular(j.id, !visibility[j.id])}
				></button>
				{@render silhoeta(j.id, lg.color[clar ? 'clar' : 'sorne'])}
			</div>
		</div>
		<div class="desplegar-l">
			<button type="button" class="desplegar" aria-expanded={dob} onclick={() => virarDials(j.id)}
				><span class="chev" aria-hidden="true">▸</span>{tx.nDial(dz.length, j.id === 'oil')}</button
			>
			{#if fi.fontDialectes}{@render infoFont(fi.fontDialectes, 'ⓘ', 'sol')}{/if}
		</div>
		{#if dob}
			<ul class="albre" role="group" aria-label={tx.causirLenga(nomLg)} transition:slide={{ duration: 200 }}>
				{#each gropesDial(j.id, lg.pastilhas.filter((q) => !q.de), (q) => q.k) as G (G.g)}
					{#if G.g}<li class="grope-tit">{tx.gropeDial[G.g]}</li>{/if}
					{#each G.lista as q (q.k)}
						{@const sots = lg.pastilhas.filter((x) => x.de === q.k)}
						<li>
							{@render dialLenga(j, lg, q)}
							{#if sots.length}
								<div class="sots">
									<p class="sots-tit">{tx.dialDe(lang === 'fr' ? q.fr : q.oc)}</p>
									<ul class="albre">
										{#each sots as x (x.k)}<li>{@render dialLenga(j, lg, x)}</li>{/each}
									</ul>
								</div>
							{/if}
						</li>
					{/each}
				{/each}
			</ul>
		{/if}
	</div>
{/snippet}

{#snippet infoFont(font, html, cl = '')}
	<span class="info {cl}" tabindex="0">{@html html}{#if font}<span class="bulla" role="tooltip"
				><b>{tx.fonts}</b> {font.t}{#if font.url} <a href={font.url} target="_blank" rel="noopener"><Icona nom="extern" size="0.9em" /></a>{/if}</span
			>{/if}</span
	>
{/snippet}

{#snippet dialLenga(j, lg, q)}
	{@const apart = !!lg.apart?.[q.k]}
	{@const endo = q.endo ?? q[lg.lang] ?? (lg.lang === 'fr' ? q.fr : q.ca)}
	{@const trad = lang === 'fr' ? q.fr : q.oc}
	<button type="button" class="d" class:apart aria-pressed={causits.includes(lg.pref + q.k)} lang={lg.lang} onclick={() => causirLenga(j.id, q.k)}
		><i class:apart style:background={apart ? null : colorPastilha(j.id, q.k)}></i><span class="e">{endo}</span
		>{#if trad && trad.toLowerCase() !== endo.toLowerCase()}<span class="f" lang={lang}>{trad}</span>{/if}</button
	>
{/snippet}

{#snippet pastilhaLenga(j, lg, q, nSots, obèrt)}
	{@const apart = !!lg.apart?.[q.k]}
	<button
		type="button"
		class="pastilha"
		class:apart
		class:sota={!!q.de}
		lang={lg.lang}
		title={lang === 'oc' ? q.oc : q.fr}
		aria-pressed={causits.includes(lg.pref + q.k)}
		onclick={() => causirLenga(j.id, q.k)}
	><i class:apart style:background={apart ? null : colorPastilha(j.id, q.k)}></i>{q[lg.lang] ?? (lg.lang === 'fr' ? q.fr : q.ca)}{#if nSots}<span class="chevron" aria-hidden="true">{obèrt ? '▾' : '▸'}</span>{/if}</button
	>
{/snippet}

{#snippet linha(j)}
	<!-- (tota la linha es clicabla a la mirga ; al clavièr, l'interruptor) -->
	<!-- (data-jaca, data-tirador, data-familha : les premiers pas visent les commandes, Guida.svelte) -->
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="linha"
		data-jaca={j.id}
		class:escantida={!actiu(j)}
		class:fora={visibility[j.id] && actiu(j) && foraEscala(j)}
		class:apercebuda={estatCarta.apercebut === j.id}
		class:activa={estatCarta.activa === j.id && !!visibility[j.id]}
		onclick={(e) => clicLinha(e, j)}
		onpointerenter={(e) => entrarLinha(e, j)}
		onpointerleave={sortirLinha}
	>
		<!-- una jaça de ponches amb son icòna : la meteissa pastilha que sus la carta (maqueta A, Romain 2026-10-23) -->
		{#if j.icona}<span class="ponch-j" style:--ponch="var(--t-{j.color ?? 'aur'})" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html ICONAS[j.icona]}</svg></span>
		{:else}<span class="apercebut"><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(j.id)}</svg></span>{/if}
		<div class="cos">
			<b>{nomJ(j)}{#if estatCarta.activa === j.id && visibility[j.id]}<span class="sr"> ({tx.jaçaActiva})</span>{/if}</b>
			{#if notaJ(j)}<small>{notaJ(j)}</small>{/if}
			<!-- l'objet choisi sur la carte, rappelé sous sa couche (audit des clics, 2026-10-19) -->
			{#if estatCarta.causida?.jaça === j.id && estatCarta.causida.nom}
				<span class="causida-j"
					><span class="nom-c">{estatCarta.causida.nom}</span><button
						type="button"
						class="levar-c"
						aria-label={tx.levarCausida(estatCarta.causida.nom)}
						onclick={() => dispatchEvent(new CustomEvent('carta-levar-causida', { detail: { jaça: j.id } }))}>✕</button
					></span
				>
			{/if}
			<!-- l'escala, sonque quand la jaça alucada se vei pas d'aquí (decision de Romain, 2026-10-10) -->
			{#if visibility[j.id] && actiu(j) && escalaJ(j) && foraEscala(j) && estatCarta.apercebut !== j.id}
				<small class="escala-j">{escalaJ(j)}<button type="button" class="anar" title={tx.anarTitol} onclick={() => anarPlaja(j.id)}>{tx.anar}</button></small>
			{/if}
			{#if j.id === 'dialectes' && actiu(j)}
				<div class="pastilhas" role="group" aria-label={tx.causirDial}>
					{#each NOMS_DIAL as [k, oc, fr] (k)}
						<button
							type="button"
							class="pastilha"
							aria-pressed={causits.includes(k)}
							onclick={() => causirDial(k)}
						><i style:background={DIAL[k]}></i>{lang === 'oc' ? oc : fr}</button>
					{/each}
					<button type="button" class="pastilha" aria-pressed={causits.includes('cro')} onclick={() => causirDial('cro')}
						><i class="cro"></i>{lang === 'oc' ? 'creissent' : 'croissant'}</button
					>
					{#if causits.some(esOccitan)}
						<button type="button" class="pastilha totes" onclick={() => (causits = causits.filter((k) => !esOccitan(k)))}>{tx.dialecteTotes}</button>
					{/if}
				</div>
			{/if}
			{#if LENGAS[j.id] && actiu(j)}
				{@const lg = LENGAS[j.id]}
				<div class="pastilhas" role="group" aria-label={tx.causirLenga(lang === 'fr' ? lg.nom.fr : lg.nom.oc)}>
					<!-- los noms dins la lenga ; l'occitan (o lo francés) en infobulla -->
					<!-- una lenga amb de dialèctes (lo picard : ch'ti, rochi) : quand es causida,
					     sos dialèctes s'afichan dejós, en arborescéncia (retorn de Romain) -->
					{#each lg.pastilhas.filter((q) => !q.de) as q (q.k)}
						{@const sots = lg.pastilhas.filter((x) => x.de === q.k)}
						{@const obèrt = sots.length > 0 && (causits.includes(lg.pref + q.k) || sots.some((x) => causits.includes(lg.pref + x.k)))}
						{#if obèrt}
							<div class="grope-sots">
								{@render pastilhaLenga(j, lg, q, sots.length, true)}
								<div class="sots" role="group" aria-label={tx.dialDe(lang === 'fr' ? q.fr : q.oc)}>
									{#each sots as x (x.k)}{@render pastilhaLenga(j, lg, x, 0, false)}{/each}
								</div>
							</div>
						{:else}
							{@render pastilhaLenga(j, lg, q, sots.length, false)}
						{/if}
					{/each}
					{#if causits.some((k) => k.startsWith(lg.pref))}
						<button type="button" class="pastilha totes" onclick={() => (causits = causits.filter((k) => !k.startsWith(lg.pref)))}
							>{tx.dialecteTotes}</button
						>
					{/if}
				</div>
			{/if}
		</div>
		<button
			type="button"
			class="basc"
			role="switch"
			aria-checked={actiu(j) && !!visibility[j.id] && estatCarta.apercebut !== j.id}
			aria-label={nomJ(j)}
			disabled={!actiu(j)}
			onclick={() => bascular(j.id, !visibility[j.id])}
		></button>
	</div>
{/snippet}

<style>
	/* Lo rail : verre sombre (o crema en tèma clar), al bòrd esquèrra, jos lo
	   capçal ; s'arrèsta abans la bossòla */
	.rail {
		position: absolute;
		z-index: 1010; /* dessús la barra de recèrca (1000) */
		/* per defaut a mièg nautor, un pauc pus bas (retorn de Romain : collat al
		   capçal, « ça fait trop cliché ») ; desplaçable per son encòca */
		/* Par défaut, centré dans toute la place libre entre le bas du bandeau
		   (--cap-bas) et le bloc flèche du nord + échelle (6,3 rem du bas,
		   CartaOccitania .compass), un peu plus bas sur un grand écran (--rail-biais).
		   Retour de Romain, 2026-10-19 : centré à 50 % + 2 rem, il n'avait que
		   100 % − 16,6 rem de haut et défilait, « Autras lengas » coupé en bas. */
		--rail-biais: clamp(0px, (100% - 760px) / 2, 4rem);
		top: var(--rail-y, calc(var(--cap-bas, 0px) + 8px + var(--rail-biais)));
		bottom: 6.3rem;
		height: fit-content;
		margin-block: auto;
		left: var(--rail-x, var(--marge, 1rem));
		width: 4.6rem;
		max-height: calc(100% - var(--cap-bas, 0px) - 8px - var(--rail-biais) - 6.3rem);
		overflow-y: auto;
		scrollbar-width: none;
		display: grid;
		/* (la colomna despassa pas jamai lo panèl : los noms longs passan a la
		   linha en luòc d'èsser copats, retorn de Romain) */
		grid-template-columns: minmax(0, 1fr);
		gap: 2px;
		padding: 6px 5px;
		/* Sans contour (Romain, 2026-10-15) : le rail se détache par un fond un
		   peu plus chaud que la carte, légèrement transparent (--t-veire, app.css) ;
		   le flou garde les icônes lisibles sur la carte */
		background: var(--t-veire);
		backdrop-filter: blur(10px);
		border: 0;
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
	}
	/* déplacé : sa place (--rail-y), toute la hauteur entre bandeau et flèche */
	@container carta (min-width: 601px) {
		.rail.desplaçat {
			bottom: auto;
			margin-block: 0;
			max-height: calc(100% - var(--cap-bas, 0px) - 8px - 6.3rem);
		}
	}
	/* l'encòca : de que prene lo panèl, e lo boton per lo reduire */
	/* (l'encòca e sos dos botons tenon dins la largor del panèl) */
	.encòca {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0;
		padding: 0 0 3px;
	}
	.prene {
		flex: 1;
		min-width: 0;
		height: 18px;
		padding: 0;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 8px;
		background: none;
		cursor: grab;
		touch-action: none;
	}
	.prene:active {
		cursor: grabbing;
	}
	.prene span {
		width: 16.5px;
		height: 6px;
		background: radial-gradient(circle, var(--t-tinta-2) 1.2px, transparent 1.6px) 0 0 / 5.5px 3px;
		opacity: 0.7;
	}
	.prene:hover span,
	.prene:focus-visible span {
		opacity: 1;
	}
	.reduire {
		flex: 0 0 auto;
		width: 19px;
		height: 18px;
		padding: 0;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 6px;
		background: none;
		color: var(--t-tinta-2);
		cursor: pointer;
	}
	.reduire svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.prene:focus-visible,
	.reduire:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.rail.reduch .rail-b,
	.rail.reduch .rail-sep {
		display: none;
	}
	.rail.reduch .encòca {
		padding-bottom: 0;
	}
	.rail-b {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 4px;
		padding: 9px 2px 7px;
		border: 0;
		border-radius: 12px;
		background: none;
		color: var(--t-tinta-2);
		font: 400 10.5px/1.15 var(--font-body);
		text-align: center;
		cursor: pointer;
		transition:
			background 0.25s,
			color 0.25s;
	}
	/* Arabe (Joan, 26-10) : 10,5 px et 9 px sont des tailles de latin ; l'arabe, plus
	   dense, y est illisible. 12 px, partout, y compris sur écran bas. */
	:global(html[lang='ar']) .rail .rail-b,
	:global(html[lang='ar']) .rail:not(.orizontal) .rail-b {
		font-size: 12px;
		line-height: 1.25;
	}
	.rail-b svg {
		width: 22px;
		height: 22px;
	}
	.rail-b:hover {
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 6%, transparent);
	}
	.rail-b[aria-expanded='true'] {
		color: var(--t-aur-clar);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.rail-b:focus-visible,
	.tirador button:focus-visible,
	.tirador input:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.lib {
		hyphens: manual;
	}
	/* « Sus la carta », lo còr de l'organizacion de sa carta (demanda de
	   Romain, 2026-10-09) : una tèula a part, cerclada d'aur, pus granda */
	.rail-b.rail-sus {
		margin: 2px 3px 0;
		padding: 10px 2px 8px;
		color: var(--t-aur-clar);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--t-aur) 55%, transparent);
		font-weight: 700;
	}
	.rail-b.rail-sus svg {
		width: 27px;
		height: 27px;
	}
	.rail-b.rail-sus:hover {
		background: color-mix(in srgb, var(--t-aur) 18%, transparent);
	}
	.rail-b.rail-sus[aria-expanded='true'] {
		background: color-mix(in srgb, var(--t-aur) 24%, transparent);
		box-shadow: inset 0 0 0 1.5px var(--t-aur);
	}
	/* la chifra d'una familha : pichona, sens pastilha (decision de Romain, 2026-10-10) */
	.nombre {
		position: absolute;
		top: 6px;
		right: 9px;
		font: 700 10px/1 var(--font-body);
		font-variant-numeric: tabular-nums;
		color: color-mix(in srgb, var(--t-aur) 75%, transparent);
	}
	/* la tòca mediterranèa : una linha fina a esquèrra de la familha dobèrta,
	   e pas endacòm mai (decision de Romain, 2026-10-10) */
	.rail-b[aria-expanded='true']::before {
		content: '';
		position: absolute;
		left: 0;
		top: 24%;
		bottom: 24%;
		width: 2px;
		border-radius: 1px;
		background: var(--t-terra-viu);
	}
	.compte {
		position: absolute;
		top: 4px;
		right: 8px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		border-radius: 8px;
		/* (escura amb un contorn d'aur : se vei sus lo boton d'aur) */
		background: var(--t-fons-2);
		box-shadow: inset 0 0 0 1px var(--t-aur);
		color: var(--t-aur-clar);
		font: 700 9.5px/16px var(--font-body);
		font-variant-numeric: tabular-nums;
	}
	.rail-sep {
		height: 1px;
		margin: 4px 10px;
		background: var(--t-linha);
	}

	/* la silhoeta-boton : veire la lenga dins son environament */
	.silh-b {
		display: block;
		padding: 2px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: none;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.silh-b:hover,
	.silh-b:focus-visible {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
	}
	.silh-b .silh {
		display: block;
	}

	/* lo mòde : lo boton per tornar a l'occitan */
	.rail-b.retorn {
		color: var(--t-tinta);
	}
	.rail-b.retorn::after {
		content: '';
		width: 1rem;
		height: 1rem;
		background: currentColor;
		/* la sageta d'Iconoir (meteis traçat que Icona « revenir ») */
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6L9 12L15 18'/%3E%3C/svg%3E") center / contain no-repeat;
		position: absolute;
		left: 4px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1rem;
		color: var(--t-terra-viu);
	}
	.rail-b.retorn svg {
		color: var(--t-terra-viu);
	}

	/* La banda del telefòn : la familha a esquèrra, sas jaças en pastilhas */
	.rail-b.banda-fam {
		flex: 0 0 4.4rem;
		color: var(--t-aur-clar);
		border-right: 1px solid var(--t-linha);
		border-radius: 0;
	}
	.rail-b.banda-fam::after {
		content: '';
		width: 1rem;
		height: 1rem;
		background: currentColor;
		/* la sageta d'Iconoir (meteis traçat que Icona « revenir ») */
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6L9 12L15 18'/%3E%3C/svg%3E") center / contain no-repeat;
		position: absolute;
		left: 4px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1rem;
		color: var(--t-tinta-2);
	}
	.banda-jaces {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 8px;
		overflow-x: auto;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
		mask-image: linear-gradient(90deg, #000 88%, transparent);
	}
	.banda-jaces::-webkit-scrollbar {
		display: none;
	}
	.chip {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 36px;
		padding: 0 12px 0 5px;
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		background: none;
		color: var(--t-tinta);
		font: 700 0.8125rem/1 var(--font-body);
		white-space: nowrap;
		cursor: pointer;
	}
	.chip-ap {
		display: block;
		width: 26px;
		height: 18px;
		border-radius: 9px 4px 4px 9px;
		overflow: hidden;
		background: var(--t-fons);
	}
	.chip-ap svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* (la pastilha de la carta, en pichon, per las jaces de ponches : sus telefòn
	   tanben, lo boton mòstra çò que se veirà sus la carta) */
	.chip-ponch svg {
		display: block;
		box-sizing: border-box;
		width: 22px;
		height: 22px;
		padding: 3.5px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-fons-2) 88%, transparent);
		border: 1.2px solid var(--ponch);
		color: var(--ponch);
	}
	.chip.on {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
		color: var(--t-aur-clar);
	}
	/* la couche active (téléphone) : plus remplie, un point doré */
	.chip.activa {
		background: color-mix(in srgb, var(--t-aur) 30%, transparent);
	}
	.chip.activa::after {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--t-aur);
	}
	/* alucada mas pas vesibla a aquesta escala */
	.chip.fora {
		border-style: dashed;
	}
	.chip:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.chip.mai {
		padding: 0 14px;
		font-size: 1.1rem;
		letter-spacing: 1px;
	}

	/* l'ansa de la fuèlha : pas qu'al telefòn */
	.ansa {
		display: none;
	}

	/* Lo tirador, a costat del rail */
	.tirador {
		position: absolute;
		z-index: 1010;
		/* a costat del rail, ont que siá (plaçat per plaçarTirador) */
		top: var(--tir-y, 7.2rem);
		left: var(--tir-x, calc(var(--marge, 1rem) + 5.2rem));
		width: min(21rem, calc(100% - var(--marge, 1rem) - 6.2rem));
		max-height: var(--tir-h, calc(100% - 7.2rem - 4rem));
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--t-linha) transparent;
		padding: 16px;
		/* même verre que le rail, sans trait (Romain, 2026-10-15) */
		background: var(--t-veire);
		backdrop-filter: blur(10px) saturate(1.15);
		-webkit-backdrop-filter: blur(10px) saturate(1.15);
		border: 0;
		border-radius: 10px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		color: var(--t-tinta);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}
	h2 {
		margin: 0;
		font: 700 1.125rem/1.25 var(--font-body);
	}
	.tampar {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: none;
		color: var(--t-tinta-2);
		font-size: 1.1rem;
		cursor: pointer;
	}
	.tampar:hover {
		color: var(--t-tinta);
		border-color: var(--t-accion);
	}
	.sota {
		margin: 4px 0 12px;
		font-size: 0.8125rem;
		color: var(--t-tinta-2);
	}
	.res {
		margin: 0.4rem 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.titolet {
		margin: 24px 0 8px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	/* un tèma de la legenda : son títol l'enròtla o lo desròtla */
	.titolet.tèma {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		padding: 4px 0;
		background: none;
		border: 0;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
	}
	.titolet.tèma:hover,
	.titolet.tèma:focus-visible {
		color: var(--t-aur);
	}
	.titolet.tèma svg {
		width: 0.8rem;
		height: 0.8rem;
		transition: transform 0.2s;
	}
	.titolet.tèma[aria-expanded='false'] svg {
		transform: rotate(-90deg);
	}
	.tèma-cos > .linha:first-child {
		border-top: 0;
	}
	.tèma-n {
		margin-left: auto;
		letter-spacing: 0;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		.titolet.tèma svg {
			transition: none;
		}
	}
	.linha {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 12px;
		align-items: center;
		min-height: 48px;
		padding: 8px 0;
		border-top: 1px solid color-mix(in srgb, var(--t-linha) 55%, transparent);
	}
	/* La couche active (façon QGIS, Romain 2026-10-19) : un liseré doré à gauche
	   et son nom en or ; c'est elle qui répond au clic sur la carte */
	.linha.activa {
		position: relative;
	}
	.linha.activa::before,
	.ficha.activa::before {
		content: '';
		position: absolute;
		left: -9px;
		top: 9px;
		bottom: 9px;
		width: 3px;
		border-radius: 2px;
		background: var(--t-aur);
	}
	.linha.activa b,
	.ficha.activa .endo {
		color: var(--t-aur-clar);
	}
	.ficha.activa {
		position: relative;
	}
	/* l'objet choisi sur la carte, sous sa couche : une étiquette dorée et son ✕ */
	.causida-j {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		max-width: 100%;
		margin-top: 4px;
		padding: 1px 2px 1px 9px;
		border: 1px solid var(--t-accion);
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-accion) 18%, transparent);
		color: var(--t-tinta);
		font: 600 0.75rem/1.3 var(--font-body);
		cursor: default;
	}
	.causida-j .nom-c {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.levar-c {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: inherit;
		font-size: 0.75rem;
		cursor: pointer;
	}
	.levar-c:hover {
		background: color-mix(in srgb, var(--t-accion) 26%, transparent);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	/* una linha nauta (pastilhas dels dialèctes) : apercebut e interruptor en naut, al nivèl del nom */
	.linha:has(.pastilhas) {
		align-items: start;
	}
	.linha:not(.escantida) {
		cursor: pointer;
	}
	.linha:not(.escantida):hover {
		background: color-mix(in srgb, var(--t-tinta) 4%, transparent);
	}
	/* alucada mas pas vesibla a aquesta escala : l'apercebut s'esvanís */
	.linha.fora .apercebut {
		opacity: 0.45;
	}
	.linha.apercebuda .apercebut {
		box-shadow: 0 0 0 1px var(--t-aur);
	}
	.anar {
		margin-left: 8px;
		padding: 2px 9px;
		border: 1px solid var(--t-accion);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: 700 0.75rem/1.3 var(--font-body);
		cursor: pointer;
	}
	.anar:hover {
		background: color-mix(in srgb, var(--t-accion) 22%, transparent);
	}
	.linha.escantida {
		opacity: 0.55;
	}
	.apercebut {
		display: block;
		width: 52px;
		height: 36px;
		border-radius: 6px;
		overflow: hidden;
		background: var(--t-fons);
		border: 1px solid var(--t-linha);
		color: var(--t-tinta);
	}
	.apercebut svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* la pastilha d'una jaça de ponches : dins la plaça d'una vinheta (52 px),
	   per que los noms demòren alinhats amb las autras linhas */
	.ponch-j {
		display: grid;
		place-items: center;
		width: 52px;
		height: 36px;
		color: var(--ponch);
	}
	.ponch-j svg {
		box-sizing: border-box;
		width: 32px;
		height: 32px;
		padding: 6px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-fons-2) 88%, transparent);
		border: 1.5px solid var(--ponch);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}
	.titolet.grop-j {
		margin: 14px 0 2px;
		color: var(--t-aur);
	}
	.cos {
		min-width: 0;
	}
	.cos b {
		display: block;
		font-size: 0.9375rem;
		line-height: 1.3;
		font-weight: 700;
	}
	.cos small {
		display: block;
		margin-top: 2px;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--t-tinta-2);
	}
	/* (l'aur vòl dire « alucat », pas res mai : l'escala es en gris) */
	.cos small.escala-j {
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* bascula (interruptor) */
	.basc {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-tinta) 20%, transparent);
		cursor: pointer;
		transition: background 0.2s;
	}
	.basc::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--t-tinta);
		transition: transform 0.2s;
	}
	.basc[aria-checked='true'] {
		background: var(--t-aur);
	}
	.basc[aria-checked='true']::after {
		transform: translateX(14px);
		background: var(--t-fons);
	}
	.basc:disabled {
		opacity: 0.35;
		cursor: default;
	}
	/* en apercebut : ni alucat ni escantit, un contorn d'aur, lo boton al
	   mièg que bat doçament (demanda de Romain, 2026-10-10) */
	.linha.apercebuda .basc {
		background: transparent;
		box-shadow: inset 0 0 0 1.5px var(--t-aur);
	}
	.linha.apercebuda .basc::after {
		transform: translateX(7px);
		background: var(--t-aur);
		animation: batre 1.2s ease-in-out infinite;
	}
	@keyframes batre {
		50% {
			opacity: 0.4;
		}
	}

	/* color : una pastilha que dobrís lo selector del sistèma */
	.mostra {
		position: relative;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		cursor: pointer;
	}
	.mostra input {
		position: absolute;
		inset: -6px;
		width: calc(100% + 12px);
		height: calc(100% + 12px);
		padding: 0;
		border: 0;
		cursor: pointer;
	}

	/* pastilhas dels dialèctes */
	.pastilhas {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 0.45rem;
	}
	/* las fonts al survòl : una pichona bulla, amb un ligam */
	.info {
		position: relative;
		cursor: help;
		border-bottom: 1px dotted color-mix(in srgb, var(--t-tinta) 30%, transparent);
	}
	.info.sol {
		border: 0;
		margin-left: 4px;
		color: color-mix(in srgb, var(--t-tinta) 55%, transparent);
		font-size: 0.72rem;
	}
	.info :global(i) {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 4px;
		border-radius: 50%;
	}
	.info .bulla {
		position: absolute;
		left: 0;
		bottom: calc(100% + 6px);
		z-index: 5;
		width: max-content;
		max-width: 240px;
		padding: 6px 8px;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
		font: 400 0.64rem/1.35 var(--font-body);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
		opacity: 0;
		pointer-events: none;
		transform: translateY(3px);
		transition: opacity 0.15s, transform 0.15s;
	}
	.info:hover .bulla,
	.info:focus-within .bulla,
	.info:focus .bulla {
		opacity: 1;
		pointer-events: auto;
		transform: none;
	}
	.info .bulla a {
		color: var(--t-tinta); text-decoration: underline; text-decoration-color: var(--t-accion); text-decoration-thickness: 2px; text-underline-offset: 0.2em;
	}
	.desplegar-l {
		display: flex;
		align-items: center;
	}
	.ordre {
		display: flex;
		justify-content: flex-end;
		gap: 2px;
		margin: -4px 0 6px;
	}
	.ordre button {
		border: 0;
		background: none;
		color: color-mix(in srgb, var(--t-tinta) 55%, transparent);
		font: 600 0.62rem/1 var(--font-body);
		padding: 4px 7px;
		border-radius: 999px;
		cursor: pointer;
	}
	.ordre button[aria-checked='true'] {
		color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 12%, transparent);
	}
	.ficha-dreita {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}
	.ficha .silh {
		width: 40px;
		height: 40px;
		opacity: 0.45;
		transition: opacity 0.25s, transform 0.25s;
	}
	.ficha.alucada .silh {
		opacity: 0.95;
	}
	.ficha:hover .silh {
		transform: scale(1.06);
	}
	/* ---------- Opcion A : las fichas de las lengas ---------- */
	/* las fichas arriban una a una a la dobertura (en cascada, coma los dialèctes) */
	.ficha-arr {
		animation: ficha-arr 0.38s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 45ms);
	}
	@keyframes ficha-arr {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ficha-arr {
			animation: none;
		}
	}
	/* quatre onglets en grasilha 2 × 2 : « Transfrontalièras » tenia pas sus una linha */
	.onglets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		padding: 3px;
		margin: 2px 0 10px;
		border: 1px solid var(--t-linha);
		border-radius: 14px;
	}
	.onglets button {
		flex: 1;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: 600 0.74rem/1 var(--font-body);
		padding: 6px 4px 5px;
		border-radius: 11px;
		cursor: pointer;
	}
	.onglets button small {
		display: block;
		margin-top: 2px;
		font-weight: 400;
		font-size: 0.6rem;
		opacity: 0.75;
	}
	.onglets button.on {
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
		color: var(--t-aur);
	}
	.onglets button:disabled {
		cursor: default;
		opacity: 0.55;
	}
	.ficha {
		border-top: 1px solid var(--t-linha);
		padding: 10px 2px 8px;
	}
	.ficha-cap {
		display: grid;
		grid-template-columns: 5px 1fr auto;
		gap: 14px; /* (lo tèxte pas tròp pròche de la banda, retorn de Romain) */
		align-items: start;
	}
	.ficha .banda {
		align-self: stretch;
		border-radius: 4px;
		opacity: 0.55;
		transition: opacity 0.25s;
	}
	.ficha.alucada .banda {
		opacity: 1;
	}
	.ficha .endo {
		display: block;
		font: italic 400 1.3rem/1 'Cormorant Garamond', Georgia, serif;
	}
	.ficha .nom-lg {
		display: block;
		margin-top: 3px;
		font: 600 0.62rem/1 var(--font-body);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.ficha .desc {
		margin: 6px 0 0;
		font-size: 0.72rem;
		line-height: 1.38;
		color: var(--t-tinta-2);
	}
	.ficha .meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		margin: 6px 0 0;
		font-size: 0.66rem;
		color: color-mix(in srgb, var(--t-tinta) 55%, transparent);
	}
	.ficha .meta b {
		color: var(--t-tinta);
	}
	.ficha .vital i {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 4px;
		border-radius: 50%;
	}
	.desplegar {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 7px 0 0 15px;
		padding: 3px 0;
		border: 0;
		background: none;
		color: var(--t-tinta); text-decoration: underline; text-decoration-color: var(--t-accion); text-decoration-thickness: 2px; text-underline-offset: 0.2em;
		font: 600 0.7rem/1 var(--font-body);
		cursor: pointer;
	}
	.desplegar .chev {
		display: inline-block;
		transition: transform 0.2s;
	}
	.desplegar[aria-expanded='true'] .chev {
		transform: rotate(90deg);
	}
	/* l'arborescéncia : traits fins, nosèls rounds */
	.albre {
		list-style: none;
		margin: 4px 0 2px 15px;
		padding: 0;
	}
	.albre li {
		position: relative;
		padding: 2px 0 2px 16px;
	}
	.albre li::before {
		content: '';
		position: absolute;
		left: 4px;
		top: 0;
		bottom: 0;
		border-left: 1px solid var(--t-linha);
	}
	.albre li:last-child::before {
		bottom: calc(100% - 13px);
	}
	.albre li::after {
		content: '';
		position: absolute;
		left: 4px;
		top: 13px;
		width: 9px;
		border-top: 1px solid var(--t-linha);
	}
	.d {
		display: flex;
		align-items: baseline;
		gap: 7px;
		width: 100%;
		padding: 3px 8px 3px 4px;
		border: 0;
		border-radius: 8px;
		background: none;
		color: var(--t-tinta);
		text-align: left;
		cursor: pointer;
	}
	.d:hover {
		background: color-mix(in srgb, var(--t-tinta) 6%, transparent);
	}
	.d[aria-pressed='true'] {
		background: color-mix(in srgb, var(--t-aur) 13%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--t-aur) 40%, transparent);
	}
	.d i {
		flex: none;
		width: 9px;
		height: 9px;
		border-radius: 3px;
		align-self: center;
	}
	.d i.apart {
		border: 1px dashed currentColor;
	}
	.d .e {
		font: italic 400 1rem/1.15 'Cormorant Garamond', Georgia, serif;
	}
	.d .f {
		font-size: 0.64rem;
		color: color-mix(in srgb, var(--t-tinta) 50%, transparent);
	}
	.sots {
		margin: 2px 0 3px 2px;
		padding: 6px 6px 3px;
		border: 1px dashed var(--t-linha);
		border-radius: 10px;
		background: color-mix(in srgb, var(--t-tinta) 3.5%, transparent);
	}
	.sots .albre {
		margin-left: 2px;
	}
	/* los tres gropes del mòde « Lengas de França » */
	.grope-tit {
		margin: 10px 0 2px 2px;
		font: 700 0.62rem/1.2 var(--font-body);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--t-tinta) 62%, transparent);
	}
	.grope-tit:first-child {
		margin-top: 2px;
	}
	.sots-tit {
		margin: 0 0 3px 4px;
		font: 600 0.58rem/1 var(--font-body);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--t-tinta) 50%, transparent);
	}
	/* una lenga e sos dialèctes (lo picard : ch'ti, rochi) : una linha sola,
	   los dialèctes dejós, estacats per un trait coma una arborescéncia */
	.grope-sots {
		flex-basis: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
	}
	.sots {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-left: 11px;
		padding: 2px 0 2px 12px;
		border-left: 1px solid var(--t-linha);
	}
	.pastilha.sota {
		font-size: 0.68rem;
	}
	.pastilha .chevron {
		margin-left: 3px;
		font-size: 0.62rem;
		opacity: 0.6;
	}
	.pastilha {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 3px 9px 3px 6px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.72rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.pastilha i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.pastilha i.cro,
	.d i.cro {
		border-radius: 2px;
		background: repeating-linear-gradient(45deg, var(--t-terra-viu) 0 1.5px, transparent 1.5px 3.5px);
	}
	/* una zòna a despart (la Catalonha del Nòrd) : un contorn en ponchs, pas una color */
	.pastilha.apart {
		flex-basis: 100%;
		max-width: max-content;
	}
	.pastilha i.apart {
		border-radius: 2px;
		border: 1.5px dashed var(--t-aur);
		background: none;
	}
	.pastilha[aria-pressed='true'] {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.pastilha.totes {
		color: var(--t-aur-clar);
	}

	/* fonses en vinhetas */
	.fonses {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}
	.fons {
		display: grid;
		gap: 5px;
		padding: 0 0 6px;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.7rem/1.1 var(--font-body);
		cursor: pointer;
	}
	.fons i {
		display: block;
		height: 34px;
	}
	.fons[aria-checked='true'] {
		border-color: var(--t-aur);
		box-shadow: inset 0 0 0 1px var(--t-aur);
	}
	.fons-estelas {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 34'%3E%3Cpath d='M38 0c-3 6 4 9 0 15s-9 7-6 12 8 4 5 7' fill='none' stroke='%23f5ead8' stroke-width='.8' opacity='.8'/%3E%3Cpath d='M6 30c8-3 14 2 20-3' fill='none' stroke='%23e0612f' stroke-width='1.2' stroke-dasharray='.1 2.6' stroke-linecap='round'/%3E%3C/svg%3E") center / cover, #1d0f0a;
	}
	.fons-occitan {
		background:
			linear-gradient(135deg, transparent 46%, #e7b9a3 47% 50%, transparent 51%),
			linear-gradient(20deg, transparent 60%, #f2dfb8 61% 63%, transparent 64%),
			#3a2f2a;
	}
	.fons-natural {
		background:
			radial-gradient(ellipse at 30% 70%, #5e7b3a, transparent 60%),
			radial-gradient(ellipse at 75% 30%, #8a7a52, transparent 55%),
			#2f3a24;
	}
	.fons-satellite {
		background:
			radial-gradient(ellipse at 40% 60%, #3d5130, transparent 60%),
			radial-gradient(ellipse at 80% 20%, #6b6046, transparent 50%),
			#1f2a2e;
	}
	.botons-sus {
		margin: 0 0 0.4rem;
	}
	.boton {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.boton svg {
		width: 15px;
		height: 15px;
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: default;
	}
	/* « Afichar l'occitan » : en aur, pus visible que los autres */
	.boton-oc {
		margin-top: 0.6rem;
		border-color: var(--t-accion);
		font-weight: 700;
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 0.8rem;
	}
	.boton {
		padding: 6px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: 700 0.8125rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.boton:hover {
		border-color: var(--t-accion);
		color: var(--t-tinta);
	}
	.admin {
		display: block;
		margin-top: 0.9rem;
		padding-top: 0.7rem;
		border-top: 1px solid var(--t-linha);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-tinta);
		text-decoration: underline; text-decoration-color: var(--t-accion); text-decoration-thickness: 2px; text-underline-offset: 0.2em;
	}

	/* Pichona nautor (telefon en païsatge, fenèstra corta) : rail mai sarrat */
	/* Lo panèl en bas, a l'orizontala (causida de Romain) : centrat, al dessús
	   de las fonts ; los tiradors s'alandan al dessús d'el. Sul telefon, la
	   barra es ja en bas : res de cambiat. */
	@container carta (min-width: 601px) {
		.rail.orizontal {
			top: auto;
			left: 50%;
			bottom: 1.9rem;
			transform: translateX(-50%);
			width: auto;
			max-height: none;
			overflow: visible;
			display: flex;
			align-items: stretch;
			gap: 2px;
			padding: 4px 8px 4px 4px;
		}
		.rail.orizontal .encòca {
			flex-direction: column;
			justify-content: center;
			gap: 3px;
			padding: 0 4px 0 2px;
		}
		.rail.orizontal .prene {
			flex: 0 0 auto;
			width: 20px;
		}
		.rail.orizontal .rail-b {
			width: 4.6rem;
		}
		.rail.orizontal .rail-sep {
			width: 1px;
			height: auto;
			margin: 8px 3px;
		}
		.tirador.amont {
			top: auto;
			bottom: var(--tir-bas, 6.5rem);
		}
	}
	@container carta (max-height: 720px) {
		.rail-b {
			padding: 6px 2px 5px;
			font-size: 9.5px;
		}
		.rail-b.rail-sus {
			padding: 7px 2px 5px;
		}
		.rail-b.rail-sus svg {
			width: 24px;
			height: 24px;
		}
		.rail-b svg {
			width: 20px;
			height: 20px;
		}
	}
	/* Écran encore plus bas (fenêtre réduite, tablette couchée) : le rail
	   vertical se resserre encore pour tenir sans défiler */
	@container carta (min-width: 601px) and (max-height: 600px) {
		.rail:not(.orizontal) {
			gap: 1px;
			padding: 4px 5px;
		}
		.rail:not(.orizontal) .rail-b {
			gap: 2px;
			padding: 4px 2px 3px;
			font-size: 9px;
		}
		.rail:not(.orizontal) .rail-b.rail-sus {
			padding: 5px 2px 4px;
		}
		.rail:not(.orizontal) .rail-b.rail-sus svg {
			width: 21px;
			height: 21px;
		}
		.rail:not(.orizontal) .rail-b svg {
			width: 18px;
			height: 18px;
		}
		.rail:not(.orizontal) .rail-sep {
			margin: 2px 10px;
		}
	}
	/* Telefon : lo rail ven una barra en bas (a portada del det, liura la
	   recèrca en naut) ; lo tirador s'alanda de la barra, sus tota la largor */
	@container carta (max-width: 600px) {
		.rail {
			top: auto;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: var(--barra-bas, 3.9rem);
			max-height: none;
			overflow: visible;
			display: flex;
			align-items: stretch;
			gap: 0;
			padding: 3px 4px env(safe-area-inset-bottom, 0px);
			border-radius: 16px 16px 0 0;
			box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.3);
			transform: none;
		}
		/* sul telefon la barra demòra en bas : ni encòca ni reduccion */
		.encòca {
			display: none;
		}
		.rail.reduch .rail-b {
			display: grid;
		}
		.rail.reduch .rail-sep {
			display: block;
		}
		.rail-b {
			flex: 1 1 0;
			min-width: 0;
			padding: 5px 0 3px;
			font-size: 9.5px;
			line-height: 1.1;
		}
		/* (sus la barra del telefon : la tèula garda la nautor de las autras) */
		.rail-b.rail-sus {
			margin: 0;
			padding: 5px 0 3px;
		}
		.rail-b.rail-sus svg {
			width: 22px;
			height: 22px;
		}
		.rail-b svg {
			width: 20px;
			height: 20px;
		}
		.nombre {
			right: calc(50% - 20px);
		}
		/* (barra orizontala : la linha passa dessús) */
		.rail-b[aria-expanded='true']::before {
			left: 24%;
			right: 24%;
			top: 0;
			bottom: auto;
			width: auto;
			height: 2px;
		}
		.compte {
			right: calc(50% - 22px);
		}
		.rail-sep {
			width: 1px;
			height: auto;
			margin: 10px 2px;
		}
		.tirador {
			top: auto;
			left: 0;
			right: 0;
			bottom: calc(var(--barra-bas, 3.9rem) - 1px);
			width: auto;
			max-height: min(52%, calc(100% - 10rem));
			padding-top: 0;
			border-radius: 18px 18px 0 0;
			border-width: 1px 0 0;
			box-shadow: 0 -12px 34px rgba(0, 0, 0, 0.4);
			animation: tirador-pujar 0.28s cubic-bezier(0.19, 1, 0.22, 1);
			transition: max-height 0.3s cubic-bezier(0.19, 1, 0.22, 1);
		}
		/* sus telefòn, una fuèlha : a mitat, plena, o tirada al det */
		.tirador.plena {
			height: calc(100% - var(--barra-bas, 3.9rem) - var(--cap-bas, 0px) - 8px);
			max-height: calc(100% - var(--barra-bas, 3.9rem) - var(--cap-bas, 0px) - 8px);
		}
		.tirador.tirat {
			height: var(--fuelha-h);
			max-height: calc(100% - var(--barra-bas, 3.9rem) - var(--cap-bas, 0px) - 8px);
			transition: none;
		}
		/* l'ansa demòra en naut quand lo contengut desfila */
		.ansa {
			display: block;
			position: sticky;
			top: 0;
			z-index: 3;
			width: calc(100% + 32px);
			height: 26px;
			margin: 0 -16px 2px;
			padding: 0;
			border: 0;
			border-radius: 18px 18px 0 0;
			background: color-mix(in srgb, var(--t-fons-2) 92%, transparent);
			cursor: grab;
			touch-action: none;
		}
		.ansa::after {
			content: '';
			position: absolute;
			top: 10px;
			left: calc(50% - 20px);
			width: 40px;
			height: 4px;
			border-radius: 2px;
			background: color-mix(in srgb, var(--t-tinta) 40%, transparent);
		}
		.ansa:focus-visible::after {
			background: var(--t-aur);
		}
	}
	@keyframes tirador-pujar {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rail-b,
		.basc,
		.basc::after {
			transition: none;
			animation: none !important;
		}
		.tirador {
			animation: none;
		}
	}
</style>
