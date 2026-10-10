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
				id: 'departaments',
				oc: 'Despartaments occitanofòns',
				fr: 'Départements occitanophones',
				estat: 'basa',
				defaut: false
			},
			{
				id: 'limsi',
				oc: 'Enquistas vocalas (Atlàs LISN)',
				fr: 'Enquêtes vocales (Atlas LISN)',
				estat: 'a venir',
				nota_oc: "En espèra de l'autorizacion del LISN",
				nota_fr: "En attente de l'autorisation du LISN"
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
			{ id: 'calandretas', oc: 'Calandretas', fr: 'Calandretas', estat: 'disponible', defaut: false, nota_oc: "Escòlas, collègis e licèu (annuari de l'educacion)", nota_fr: "Écoles, collèges et lycée (annuaire de l'éducation)" },
			{ id: 'festas', oc: 'Fèstas e eveniments', fr: 'Fêtes et événements', estat: 'a venir' }
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

// Las autras lengas de França (demanda de Romain, 2026-10-08) : una familha a
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
			nota_oc: 'Sos dialèctes, de Salses a Guardamar e a l’Alguer ; la Catalonha del Nòrd a despart',
			nota_fr: 'Ses dialectes, de Salses à Guardamar et à Alghero ; la Catalogne nord à part'
		},
		{
			id: 'arpitan',
			oc: 'Arpitan',
			fr: 'Arpitan (francoprovençal)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Sos dialèctes, de Liyon a Nôchâtél, a Aoûta e a Faeto ; la part de França a despart',
			nota_fr: 'Ses dialectes, de Lyon à Neuchâtel, à Aoste et à Faeto ; la partie française à part'
		},
		{
			id: 'basc',
			oc: 'Basc',
			fr: 'Basque',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Sos dialèctes, de Bilbo a Maule e a Iruña ; Iparralde a despart',
			nota_fr: 'Ses dialectes, de Bilbao à Mauléon et à Pampelune ; le Pays basque nord à part'
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
			nota_oc: 'Lo continuum alemanic, d’Estrasborg a Basilèa e a Zuric ; Alsàcia a despart',
			nota_fr: 'Le continuum alémanique, de Strasbourg à Bâle et à Zurich ; l’Alsace à part'
		},
		{
			id: 'francic',
			oc: 'Francic (platt)',
			fr: 'Francique (platt)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Lo platt de Mosèla e sos vesins, fins a Luxemborg e a la Sarra ; Mosèla germanofòna a despart',
			nota_fr: 'Le platt de Moselle et ses voisins, jusqu’au Luxembourg et à la Sarre ; la Moselle germanophone à part'
		},
		{
			id: 'flamenc',
			oc: 'Flamenc e neerlandés',
			fr: 'Flamand et néerlandais',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Del Westhoek als Païses Basses, lo continuum dels dialèctes neerlandeses ; Flandres de França a despart',
			nota_fr: 'Du Westhoek aux Pays-Bas, le continuum des dialectes néerlandais ; la Flandre française à part'
		},
		{
			id: 'cors',
			oc: 'Còrs',
			fr: 'Corse',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Sos parlars, del Cap Còrs a Bonifacio, e lo gallurés e lo sassarés de Sardenha ; Corsega a despart',
			nota_fr: 'Ses parlers, du Cap Corse à Bonifacio, et le gallurais et le sassarais de Sardaigne ; la Corse à part'
		},
		{
			id: 'oil',
			oc: 'Lengas d’oïl',
			fr: 'Langues d’oïl',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Una familha de lengas : picard, normand, galò, peitavin-santongés, campanés, lorren…',
			nota_fr: 'Une famille de langues : picard, normand, gallo, poitevin-saintongeais, champenois, lorrain…'
		}
	]
});

// Las jaces de lengas pintadas per una còla de lenga (colaLenga.js, lengas.js)
export const JACES_LENGAS = ['catalan', 'arpitan', 'basc', 'oil', 'alsacian', 'francic', 'breton', 'cors', 'flamenc'];

// Las jaces pintadas pel fons « Contorns » (colaEstelas.js) : son pas pintadas
// sus los autres fonses (las tuèlas an las lors). Jaça → element del fons.
export const JACES_FONS = { vilas: 'estelas', toponimia: 'nomsVilas', rius: 'rius', nomsRius: 'nomsRius', corbas: 'corbas' };

// Las jaces que pinta la còla de donadas (colaDonadas.js) ; las autras son de
// jaces Leaflet (punts e zònas de la basa)
export const JACES_DONADAS = ['frontiera', 'dialectes', 'unificat', 'creissent', 'regions', 'despartaments'];

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
			// La basa pòt renomenar o anonciar una jaça, pas desactivar una jaça
			// que lo site sap pintar sol
			if (r.label_oc) j.oc = r.label_oc;
			if (r.label_fr) j.fr = r.label_fr;
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
