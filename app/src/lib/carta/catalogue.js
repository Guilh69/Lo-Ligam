// Catalogue des jaces de donadas de la carta (2026-10-07). Lo fons de basa
// es « Contorns » : la còsta sola, en traç fin (demanda de Romain) ; tot lo
// rèsta es de jaces rengadas per familha. Las jaces valon per totes los fonses,
// levat las marcadas fons: 'estelas' (vilas, noms, rius, relèu), pintadas pel
// fons Contorns sol.
//
// Aquel catalògue es la basa : la carta lo mòstra quitament se Supabase
// respond pas (projècte gratuit en pausa). La taula carta_colas (gerida dins
// /admin/carta) pòt pasmens cambiar los libellats, las nòtas e la
// disponibilitat d'una jaça del meteis id, e apondre de jaces novèlas.
//
// estat : 'disponible' (donadas dins static/data), 'basa' (donadas dins
// Supabase), 'a venir' (afichada mas desactivada, amb sa nòta).
// Libellats occitans de validar per Romain.

export const CATALOGUE = [
	{
		id: 'lenga',
		// « Lenga nòstra » (causida de Romain, 2026-10-09 ; nòstra : lo Basic de lo Congrès)
		oc: 'Lenga nòstra',
		fr: 'Lenga nòstra', // (un subrenom : demòra en occitan dins l'interfàcia francesa)
		jaces: [
			{
				// lo domeni occitan, cochat d'ofici, visible de 200 km fins al pus
				// prèp (demanda de Romain, 2026-10-09 ; nom occitan de validar)
				id: 'frontiera',
				oc: 'Domeni occitan',
				fr: 'Domaine occitan',
				estat: 'disponible',
				defaut: true
			},
			{ id: 'dialectes', oc: 'Dialèctes', fr: 'Dialectes', estat: 'disponible', defaut: true, nota_oc: "Se'n pòt causir mantun, lo Creissent tanben", nota_fr: 'On peut en choisir plusieurs, le Croissant aussi' },
			// l'occitan unificat a totas las escalas, coma de luènh (retorn de Romain, 2026-10-08)
			{ id: 'unificat', oc: 'Occitan unificat', fr: 'Occitan unifié', estat: 'disponible', defaut: false, nota_oc: 'La lenga sola, sens los dialèctes, a totas las escalas', nota_fr: 'La langue seule, sans les dialectes, à toutes les échelles' },
			// la lecture « Uèi » (Romain, 2026-10-22) : la part de locuteurs par
			// département, enquête OPLO 2020 (locutors.js) ; rien là où aucune
			// enquête n'existe (Romain, 2026-10-23). Occitan vérifié par l'API.
			{
				id: 'locutors',
				oc: 'Locutors (2020)',
				fr: 'Locuteurs (2020)',
				estat: 'disponible',
				defaut: false,
				nota_oc: 'Part dels 15 ans e mai que parlan occitan, per departament (OPLO)',
				nota_fr: 'Part des 15 ans et plus qui parlent occitan, par département (OPLO)'
			},
			{
				id: 'toponimia',
				oc: 'Noms occitans de las vilas',
				fr: 'Noms occitans des villes',
				estat: 'disponible',
				defaut: true,
				fons: 'estelas'
			},
			// Lo Creissent (traçat nòstre d'aprèp Tourtoulon e Bringuier 1876 e Ronjat
			// 1930) es pas pus una jaça a despart : es una pastilha dels dialèctes,
			// causissabla coma eles (retorn de Romain : « un seul endroit »)
			{
				id: 'limsi',
				// « les voix d'Occitanie » (Romain, 2026-10-22) : los testimònis de la lenga
				// parlada dins sa diversitat ; la font (Atlàs sonòr, LISN) demòra dins la nòta
				oc: 'Las votz d’Occitània',
				fr: 'Les voix d’Occitanie',
				// demostracion per lo LISN (decision de Romain, 2026-10-12 : en linha,
				// lo site es pas encara dobèrt al public) ; donadas de
				// SIG/cadena/lisn-enquistas.mjs
				estat: 'disponible',
				defaut: false,
				nota_oc: 'Demostracion (Atlàs sonòr, LISN) : una faula, mantun parlar',
				nota_fr: 'Démonstration (Atlas sonore, LISN) : une fable, plusieurs parlers'
			}
		]
	},
	{
		id: 'administracion',
		// « Territòri » (decision de Romain, 2026-10-10) : « Administracion »
		// desbordava del rail ; l'id demòra lo meteis
		oc: 'Territòri',
		fr: 'Territoire',
		jaces: [
			{ id: 'vilas', oc: 'Vilas e vilatges', fr: 'Villes et villages', estat: 'disponible', defaut: true, fons: 'estelas' },
			{ id: 'regions', oc: 'Regions', fr: 'Régions', estat: 'disponible', defaut: false },
			{ id: 'despartaments', oc: 'Despartaments', fr: 'Départements', estat: 'disponible', defaut: false },
			{ id: 'comunas', oc: 'Comunas', fr: 'Communes', estat: 'disponible', defaut: false } // (pas pus de nòta : l'escala s'aficha quand cal, Romain 2026-10-10)
		]
	},
	{
		id: 'cultura',
		oc: 'Cultura',
		fr: 'Culture',
		jaces: [
			{ id: 'lieusInteres', oc: "Luòcs d'interès", fr: "Lieux d'intérêt", estat: 'basa', defaut: false },
			{ id: 'librarias', oc: 'Librariás', fr: 'Librairies', estat: 'basa', defaut: false },
			// cercles, ostals, IEO, escolo, Parlaren ; e las associacions de
			// cultura occitana (decision de Romain, 2026-10-23, SIG/cercles)
			{ id: 'cercles', oc: 'Cercles e associacions', fr: 'Cercles et associations', estat: 'disponible', defaut: false, icona: 'messages', color: 'aur-clar', nota_oc: 'Ponch plen : activitat provada ; vuèg : declarada recentament', nota_fr: 'Point plein : activité prouvée ; vide : déclarée récemment' },
			{ id: 'culturaOc', oc: 'Associacions culturalas', fr: 'Associations culturelles', estat: 'disponible', defaut: false, icona: 'music', color: 'terra-viu', nota_oc: 'Ponch plen : activitat provada ; vuèg : declarada recentament', nota_fr: 'Point plein : activité prouvée ; vide : déclarée récemment' },
			{ id: 'festas', oc: 'Fèstas e eveniments', fr: 'Fêtes et événements', estat: 'a venir' }
		]
	},
	{
		// L'ensenhament (demanda de Romain, 2026-10-23 : « un gros chapeau
		// enseignement, avec une distinction Calandreta et le reste, sachant que
		// c'est pas le même statut ») : l'immersion d'abord, puèi l'escòla
		// publica, del bilingüisme a la sensibilizacion, collègis e licèus, lo
		// superior, e los corses per adults. Donadas : SIG/ensenhament ; los
		// corses, las associacions de SIG/cercles que ne donan
		id: 'ensenhament',
		// (un caractèr invisible, ­ : sus telefòn, lo mot se copa en doas
		// linhas coma « Lenga nòstra », en luòc de desbordar sus « Istòria »)
		oc: 'Ensenha­ment',
		fr: 'Enseigne­ment',
		jaces: [
			{ id: 'calandretas', oc: 'Calandretas', fr: 'Calandretas', estat: 'disponible', defaut: false, icona: 'school', color: 'aur', grop_oc: 'Immersion', grop_fr: 'Immersion', nota_oc: "Tot en occitan, dins d'escòlas d'associacions", nota_fr: 'Tout en occitan, dans des écoles associatives' },
			{ id: 'ensBilingue', oc: 'Escòlas bilingüas', fr: 'Écoles bilingues', estat: 'disponible', defaut: false, icona: 'circles-relation', color: 'terra', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', nota_oc: 'Mitat del temps en occitan', nota_fr: 'La moitié du temps en occitan' },
			{ id: 'ensEscola', oc: "L'occitan a l'escòla", fr: "L'occitan à l'école", estat: 'disponible', defaut: false, icona: 'abc', color: 'terra', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', nota_oc: 'Tres oras per setmana, o una iniciacion', nota_fr: 'Trois heures par semaine, ou une initiation' },
			{ id: 'ensSegond', oc: 'Collègis e licèus', fr: 'Collèges et lycées', estat: 'disponible', defaut: false, icona: 'notebook', color: 'terra', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', nota_oc: 'Opcion, seccion bilingüa o especialitat', nota_fr: 'Option, section bilingue ou spécialité' },
			{ id: 'ensSuperior', oc: 'Universitats e formacion', fr: 'Universités et formation', estat: 'disponible', defaut: false, icona: 'certificate', color: 'terra', grop_oc: 'Superior e adults', grop_fr: 'Supérieur et adultes', nota_oc: 'Licéncias, diplòmas, formacion dels ensenhaires', nota_fr: 'Licences, diplômes, formation des enseignants' },
			{ id: 'corsAdults', oc: 'Corses per adults', fr: 'Cours pour adultes', estat: 'disponible', defaut: false, icona: 'users-group', color: 'aur-clar', grop_oc: 'Superior e adults', grop_fr: 'Supérieur et adultes', nota_oc: 'Associacions que donan de corses', nota_fr: 'Associations qui donnent des cours' }
		]
	},
	{
		id: 'istoria',
		oc: 'Istòria',
		fr: 'Histoire',
		jaces: [
			{ id: 'provincias', oc: 'Provincias istoricas', fr: 'Provinces historiques', estat: 'disponible', defaut: false, nota_oc: 'En 1789 : governaments e provincias', nota_fr: 'En 1789 : gouvernements et provinces' },
			{ id: 'paises', oc: 'Païses tradicionals', fr: 'Pays traditionnels', estat: 'a venir' },
			{ id: 'isolas', oc: 'Illòts lingüistics', fr: 'Îlots linguistiques', estat: 'a venir' }
		]
	},
	{
		id: 'natura',
		oc: 'Natura',
		fr: 'Nature',
		jaces: [
			{ id: 'rius', oc: 'Rius', fr: 'Rivières', estat: 'disponible', defaut: true, fons: 'estelas' },
			{ id: 'nomsRius', oc: 'Noms dels rius', fr: 'Noms des rivières', estat: 'disponible', defaut: false, fons: 'estelas' },
			{ id: 'corbas', oc: 'Relèu', fr: 'Relief', estat: 'disponible', defaut: true, fons: 'estelas', nota_oc: 'Corbas de nivèl', nota_fr: 'Courbes de niveau' },
			{ id: 'parcs', oc: 'Parcs naturals', fr: 'Parcs naturels', estat: 'disponible', defaut: false, nota_oc: 'Regionals, nacionals e marins', nota_fr: 'Régionaux, nationaux et marins' },
			{ id: 'massis', oc: 'Massís e montanhas', fr: 'Massifs et montagnes', estat: 'disponible', defaut: true, nota_oc: 'Noms dels massís e de las cimas', nota_fr: 'Noms des massifs et des sommets' },
			{ id: 'bacins', oc: 'Bacins dels rius', fr: 'Bassins des rivières', estat: 'a venir' }
		]
	}
];

// Las autras lengas de França (demanda de Romain, 2026-10-08) ; lors nòtas parlan
// d'en primièr de la part francesa (Romain, 2026-10-10) : una familha a
// despart, per las far descobrir e far de ponts ; mens provesida que l'occitan
// (una etiqueta per lenga e una ficha corta), de completar
CATALOGUE.push({
	id: 'lengas',
	oc: 'Autras lengas',
	fr: 'Autres langues',
	jaces: [
		{
			id: 'lengasFranca',
			oc: 'Lengas de França',
			fr: 'Langues de France',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Catalan, basc, breton, arpitan, alsacian, còrs, lengas d’oïl, d’outra mar…',
			nota_fr: 'Catalan, basque, breton, arpitan, alsacien, corse, langues d’oïl, d’outre-mer…'
		},
		// Cada lenga, alucada coma l'occitan, amb sos dialèctes (retorn de
		// Romain, 2026-10-08 : « un menu qui liste les langues de France ») ; lo
		// catalan d'en primièr, las autras quand lor perimètre serà traçat
		{
			id: 'catalan',
			oc: 'Catalan',
			fr: 'Catalan',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, la Catalonha del Nòrd, de Salses a Perpinyà ; se perlonga en Espanha, en Andòrra e fins a l’Alguer',
			nota_fr: 'En France, la Catalogne nord, de Salses à Perpignan ; il se prolonge en Espagne, en Andorre et jusqu’à Alghero'
		},
		{
			id: 'arpitan',
			oc: 'Arpitan',
			fr: 'Arpitan (francoprovençal)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, de Liyon a Chambèri ; se perlonga en Soïssa romanda (Nôchâtél) e dins la val d’Aoûta',
			nota_fr: 'En France, de Lyon à Chambéry ; il se prolonge en Suisse romande (Neuchâtel) et dans le Val d’Aoste'
		},
		{
			id: 'basc',
			oc: 'Basc',
			fr: 'Basque',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, Iparralde, de Baiona a Maule ; se perlonga en Espanha, de Bilbo a Iruña',
			nota_fr: 'En France, le Pays basque nord, de Bayonne à Mauléon ; il se prolonge en Espagne, de Bilbao à Pampelune'
		},
		{
			id: 'breton',
			oc: 'Breton',
			fr: 'Breton',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Sos quatre dialèctes, de Leon a Gwened, dins sa limit de 1886',
			nota_fr: 'Ses quatre dialectes, du Léon à Vannes, dans sa limite de 1886'
		},
		{
			id: 'alsacian',
			oc: 'Alsacian',
			fr: 'Alsacien',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Alsàcia, a l’entorn d’Estrasborg ; fa partida del continuum alemanic, que s’espandís en Alemanha e en Soïssa, fins a Basilèa e Zuric',
			nota_fr: 'En Alsace, autour de Strasbourg ; il fait partie du continuum alémanique, qui s’étend en Allemagne et en Suisse, jusqu’à Bâle et Zurich'
		},
		{
			id: 'francic',
			oc: 'Francic (platt)',
			fr: 'Francique (platt)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Mosèla germanofòna, lo platt ; se perlonga al Luxemborg e dins la Sarra',
			nota_fr: 'En Moselle germanophone, le platt ; il se prolonge au Luxembourg et dans la Sarre'
		},
		{
			id: 'flamenc',
			oc: 'Flamenc e neerlandés',
			fr: 'Flamand et néerlandais',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, lo flamenc del Westhoek ; fa partida del continuum dels dialèctes neerlandeses, fins als Païses Basses',
			nota_fr: 'En France, le flamand du Westhoek ; il fait partie du continuum des dialectes néerlandais, jusqu’aux Pays-Bas'
		},
		{
			id: 'cors',
			oc: 'Còrs',
			fr: 'Corse',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Corsega, sos parlars, del Cap Còrs a Bonifacio ; en Sardenha, lo gallurés e lo sassarés ne son pròches',
			nota_fr: 'En Corse, ses parlers, du Cap Corse à Bonifacio ; en Sardaigne, le gallurais et le sassarais en sont proches'
		},
		{
			id: 'oil',
			oc: 'Lengas d’oïl',
			fr: 'Langues d’oïl',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Una familha de lengas, del nòrd a l’oèst de França : picard, normand, galò, peitavin-santongés, campanés, lorren… ; tanben en Bèlgica e en Soïssa',
			nota_fr: 'Une famille de langues, du nord à l’ouest de la France : picard, normand, gallo, poitevin-saintongeais, champenois, lorrain… ; aussi en Belgique et en Suisse'
		}
	]
});

// Las jaces de lengas pintadas per una còla de lenga (colaLenga.js, lengas.js)
// La rubrica « Donadas » del mòde « Lengas de França » (etapa 4, Romain,
// 2026-10-10) : de donadas pròpias a las lengas, a despart de lors jaces ;
// visibla sonque dins lo mòde (lo rail ordinari la mòstra pas). Dessenhadas
// per donadasLengas.js
CATALOGUE.push({
	id: 'donadas',
	oc: 'Donadas',
	fr: 'Données',
	jaces: [
		{ id: 'escolasBreton', oc: 'Ensenhament bilingüe en breton', fr: 'Enseignement bilingue en breton', estat: 'disponible', defaut: false, nota_oc: 'Escolans per comuna, dintrada 2025', nota_fr: 'Élèves par commune, rentrée 2025' },
		{ id: 'limitsBreton', oc: 'Limits del breton', fr: 'Limites du breton', estat: 'disponible', defaut: false, nota_oc: 'Del sègle IX a 1806', nota_fr: 'Du IXe siècle à 1806' },
		{ id: 'escolasCors', oc: 'Ensenhament bilingüe en còrs', fr: 'Enseignement bilingue en corse', estat: 'a venir' }
	]
});

export const JACES_LENGAS = ['catalan', 'arpitan', 'basc', 'oil', 'alsacian', 'francic', 'breton', 'cors', 'flamenc'];

// Las jaces pintadas pel fons « Contorns » (colaEstelas.js) : son pas pintadas
// sus los autres fonses (las tuèlas an las lors). Jaça → element del fons.
export const JACES_FONS = { vilas: 'estelas', toponimia: 'nomsVilas', rius: 'rius', nomsRius: 'nomsRius', corbas: 'corbas' };

// Las jaces que pinta la còla de donadas (colaDonadas.js) ; las autras son de
// jaces Leaflet (punts e zònas de la basa)
// L'icòna de cada jaça de ponches que n'a una dins lo catalògue (font unica
// per la carta e per lo rail : la pastilha de la linha es la de la carta)
export const ICONAS_JACES = Object.fromEntries(
	CATALOGUE.flatMap((f) => f.jaces)
		.filter((j) => j.icona)
		.map((j) => [j.id, j.icona])
);

export const JACES_DONADAS = ['frontiera', 'dialectes', 'unificat', 'creissent', 'regions', 'despartaments', 'locutors'];

// Las jaces que pinta la còla tematica (colaTematica.js), de fonts publicas
export const JACES_TEMATICAS = ['comunas', 'provincias', 'parcs', 'massis'];

// Tematica de la basa → familha del catalògue, per las jaces apondudas dins l'admin
const TEMATICA_FAMILHA = { Luòcs: 'cultura', Lenga: 'lenga', Referéncia: 'administracion' };

// Fusion del catalògue e de las linhas de carta_colas (se la basa respond)
export function fusionarCatalogue(linhas = []) {
	const familhas = CATALOGUE.map((f) => ({ ...f, jaces: f.jaces.map((j) => ({ ...j })) }));
	const perId = new Map(familhas.flatMap((f) => f.jaces.map((j) => [j.id, j])));
	const autras = { id: 'autras', oc: 'Autras', fr: 'Autres', jaces: [] };
	for (const r of linhas) {
		const j = perId.get(r.id);
		if (j) {
			// Lo nom d'una jaça que lo site sap pintar sol ven del còde, pas de la
			// basa (Romain, 2026-10-22 : l'espaci d'administracion es pas encara
			// represes, deu pas blocar ; abans, la basa podiá renomenar). La basa pòt
			// encara anonciar una jaça (nòta, disponibilitat, visibilitat per defaut).
			// (una linha d'abans que lo site sapièsse pintar la jaça, « A venir »,
			// es passada : sa nòta contradiriá la jaça disponibla, retorn de Romain
			// sus las provincias istoricas, 2026-10-08)
			const passada = j.estat === 'disponible' && (r.disponible === false || /^\s*[aà] venir\s*$/i.test(r.nòta_oc ?? ''));
			if (r.nòta_oc && !passada) j.nota_oc = r.nòta_oc;
			if (r.nòta_fr && !passada) j.nota_fr = r.nòta_fr;
			if (j.estat === 'basa') j.estat = r.disponible ? 'disponible' : 'a venir';
			if (typeof r.visibla === 'boolean') j.defaut = r.visibla;
			continue;
		}
		const novèla = {
			id: r.id,
			oc: r.label_oc,
			fr: r.label_fr ?? r.label_oc,
			nota_oc: r.nòta_oc,
			nota_fr: r.nòta_fr,
			estat: r.disponible ? 'disponible' : 'a venir',
			defaut: r.visibla === true
		};
		const fam = familhas.find((f) => f.id === TEMATICA_FAMILHA[r.tematica_oc]) ?? autras;
		fam.jaces.push(novèla);
	}
	if (autras.jaces.length) familhas.push(autras);
	return familhas;
}
