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
		oc: 'Lenga',
		fr: 'Langue',
		jaces: [
			{
				id: 'frontiera',
				oc: 'Frontièra de la lenga',
				fr: 'Limite de la langue',
				estat: 'disponible',
				defaut: true
			},
			{ id: 'dialectes', oc: 'Dialèctes', fr: 'Dialectes', estat: 'disponible', defaut: false },
			{
				id: 'toponimia',
				oc: 'Noms occitans de las vilas',
				fr: 'Noms occitans des villes',
				estat: 'disponible',
				defaut: true,
				fons: 'estelas'
			},
			{
				// l'ancian traçat veniá del fons de l'Atlas LISN (CC BY-NC-SA) : retirat
				// lo 2026-10-07, en espèra d'un traçat nòstre a partir de fonts liuras
				id: 'creissent',
				oc: 'Lo Creissent',
				fr: 'Le Croissant',
				estat: 'a venir',
				defaut: false,
				nota_oc: "Zòna de transicion amb la lenga d'oïl : traçat en preparacion",
				nota_fr: "Zone de transition avec la langue d'oïl : tracé en préparation"
			},
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
		oc: 'Administracion',
		fr: 'Administration',
		jaces: [
			{ id: 'vilas', oc: 'Vilas e vilatges', fr: 'Villes et villages', estat: 'disponible', defaut: true, fons: 'estelas' },
			{ id: 'regions', oc: 'Regions', fr: 'Régions', estat: 'disponible', defaut: false },
			{ id: 'despartaments', oc: 'Despartaments', fr: 'Départements', estat: 'disponible', defaut: false },
			{ id: 'comunas', oc: 'Comunas', fr: 'Communes', estat: 'a venir' }
		]
	},
	{
		id: 'cultura',
		oc: 'Cultura',
		fr: 'Culture',
		jaces: [
			{ id: 'lieusInteres', oc: "Luòcs d'interès", fr: "Lieux d'intérêt", estat: 'basa', defaut: true },
			{ id: 'librarias', oc: 'Librariás', fr: 'Librairies', estat: 'basa', defaut: true },
			{ id: 'calandretas', oc: 'Calandretas e escòlas', fr: 'Calandretas et écoles', estat: 'a venir' },
			{ id: 'festas', oc: 'Fèstas e eveniments', fr: 'Fêtes et événements', estat: 'a venir' }
		]
	},
	{
		id: 'istoria',
		oc: 'Istòria',
		fr: 'Histoire',
		jaces: [
			{ id: 'provincias', oc: 'Provincias istoricas', fr: 'Provinces historiques', estat: 'a venir' },
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
			{ id: 'nomsRius', oc: 'Noms dels rius', fr: 'Noms des rivières', estat: 'disponible', defaut: true, fons: 'estelas' },
			{ id: 'corbas', oc: 'Relèu', fr: 'Relief', estat: 'disponible', defaut: true, fons: 'estelas', nota_oc: 'Corbas de nivèl', nota_fr: 'Courbes de niveau' },
			{ id: 'parcs', oc: 'Parcs naturals', fr: 'Parcs naturels', estat: 'a venir' },
			{ id: 'massis', oc: 'Massís e montanhas', fr: 'Massifs et montagnes', estat: 'a venir' },
			{ id: 'bacins', oc: 'Bacins dels rius', fr: 'Bassins des rivières', estat: 'a venir' }
		]
	}
];

// Las jaces pintadas pel fons « Contorns » (colaEstelas.js) : son pas pintadas
// sus los autres fonses (las tuèlas an las lors). Jaça → element del fons.
export const JACES_FONS = { vilas: 'estelas', toponimia: 'nomsVilas', rius: 'rius', nomsRius: 'nomsRius', corbas: 'corbas' };

// Las jaces que pinta la còla de donadas (colaDonadas.js) ; las autras son de
// jaces Leaflet (punts e zònas de la basa)
export const JACES_DONADAS = ['frontiera', 'dialectes', 'creissent', 'regions', 'despartaments'];

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
			if (r.nòta_oc) j.nota_oc = r.nòta_oc;
			if (r.nòta_fr) j.nota_fr = r.nòta_fr;
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
