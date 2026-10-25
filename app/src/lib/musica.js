// La liste de l'espace musique, triée par Romain sur /admin/musica
// (2026-10-25) : un élément « ligam » par artiste dans la table
// pagina_elements, page « musica », avec l'adresse Deezer de l'artiste.
// La clé porte l'identifiant Deezer : un même artiste n'y entre qu'une fois.
export const PAGINA = 'musica';
export const LISTA = 'musica.artistas';
export const CÒRS = 'musica.cors'; // les coups de cœur, même forme

// avant le premier tri : une trentaine d'exemples tirés de la liste préparée
// (Brama, Laüsa, Patric, San Salvador et Sustraia écartés : homonymes chez Deezer)
export const EXEMPLES = [
	'André Ricros', 'Barrut', 'Castanha é Vinovèl', 'Claude Marti', 'Claude Sicre', 'Cocanha', 'Du Bartas',
	'Fabulous Trobadors', 'Familha Artús', 'Gai Saber', "Goulamas'k", 'Joan-Pau Verdier', 'La mal coiffée', 'La Talvera',
	'Lhi Jarris', 'Lo Cor De La Plana', 'Lou Dalfin', 'Lou Seriol', 'Manu Théron', 'Mauresca', 'Moussu T e lei jovents',
	'Nadau', 'Peiraguda', 'Polifonic System', 'Renat Sette', 'Silvio Peron', 'Sourdure'
];
export const CÒRS_EXEMPLES = ['Cocanha', 'Lo Cor De La Plana', 'Nadau'];

/** une photo d'artiste vide chez Deezer (aucune image, ou l'image vide) : on montre alors la pochette */
export const fotoVuèja = (u) => !u || u.includes('/artist//') || u.includes('d41d8cd98f00b204e9800998ecf8427e');

export const ligamDeezer = (id) => `https://www.deezer.com/artist/${id}`;
export const idDe = (ligam) => Number(/deezer\.com\/(?:[a-z]{2}\/)?artist\/(\d+)/.exec(ligam ?? '')?.[1]) || null;

/** les identifiants d'une des deux listes, dans l'ordre, à partir des éléments publiés */
export const idsDe = (rows, lista) =>
	rows
		.filter((e) => e.lista === lista && !e.suprimit && e.visible !== false)
		.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
		.map((e) => idDe(e.ligam))
		.filter(Boolean);
