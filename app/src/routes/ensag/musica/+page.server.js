// Banc d'essai de l'espace musique (piste C, « la table vue d'en haut »,
// choisie par Romain le 2026-10-25), deuxième version : journal à pages, mis
// à jour seul (en une les dernières sorties et les coups de cœur, puis tous les
// artistes de A à Z). Les artistes viennent de la liste préparée depuis
// MusicBrainz (scripts/musica-candidats.mjs) ; en attendant le tri de Romain,
// la maquette en montre une trentaine, choisis parmi les plus connus (Brama,
// Laüsa, Patric, San Salvador et Sustraia écartés : homonymes chez Deezer).
import candidats from '$lib/data/musica-candidats.json';

const EXEMPLES = [
	'André Ricros', 'Barrut', 'Castanha é Vinovèl', 'Claude Marti', 'Claude Sicre', 'Cocanha', 'Du Bartas',
	'Fabulous Trobadors', 'Familha Artús', 'Gai Saber', 'Goulamas\'k', 'Joan-Pau Verdier', 'La mal coiffée', 'La Talvera',
	'Lhi Jarris', 'Lo Cor De La Plana', 'Lou Dalfin', 'Lou Seriol', 'Manu Théron', 'Mauresca', 'Moussu T e lei jovents',
	'Nadau', 'Peiraguda', 'Polifonic System', 'Renat Sette', 'Silvio Peron', 'Sourdure'
];
// les coups de cœur (l'étoile que Romain posera lui-même)
const CÒPS_DE_CÒR = ['Cocanha', 'Lo Cor De La Plana', 'Nadau'];
const PER_PAGINA = 6;

export function load() {
	const artistas = candidats
		.filter((a) => EXEMPLES.includes(a.nom))
		.map((a) => ({
			...a,
			// sans photo chez Deezer (image vide), on montre la pochette
			imatge: a.imatge.includes('d41d8cd98f00b204e9800998ecf8427e') ? a.album.cobèrta : a.imatge,
			còr: CÒPS_DE_CÒR.includes(a.nom),
			annada: a.album.data.slice(0, 4)
		}));
	const novetats = [...artistas].sort((x, y) => y.album.data.localeCompare(x.album.data)).slice(0, 5);
	const az = [];
	for (let k = 0; k < artistas.length; k += PER_PAGINA) az.push(artistas.slice(k, k + PER_PAGINA));
	// l'index des lettres : la page où commence chacune
	const letras = [];
	az.forEach((pag, k) =>
		pag.forEach((a) => {
			const l = a.nom.normalize('NFD')[0].toUpperCase();
			if (!letras.some((x) => x.l === l)) letras.push({ l, pagina: k + 1 });
		})
	);
	return { novetats, còps: artistas.filter((a) => a.còr), az, letras };
}
