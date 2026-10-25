// Banc d'essai de l'espace musique (piste C, « la table vue d'en haut »,
// choisie par Romain le 2026-10-25) : journal à pages, mis à jour seul (en
// une les coups de cœur et les dernières sorties, puis tous les artistes de A
// à Z). La liste est celle que Romain trie sur /admin/musica ; photo et
// dernier album sont relus chez Deezer chaque jour ($lib/server/deezer.js).
// Tant que rien n'est trié, les exemples de $lib/musica.js.
import candidats from '$lib/data/musica-candidats.json';
import { legirElements } from '$lib/server/elements.js';
import { fichasMusica } from '$lib/server/deezer.js';
import { PAGINA, LISTA, CÒRS, EXEMPLES, CÒRS_EXEMPLES, idsDe } from '$lib/musica.js';

const PER_PAGINA = 6;
const semenças = Object.fromEntries(candidats.map((a) => [a.id, a]));
const idsPerNom = (noms) => candidats.filter((a) => noms.includes(a.nom)).map((a) => a.id);

export async function load() {
	const rows = await legirElements(PAGINA);
	let ids = idsDe(rows, LISTA);
	let còrs = idsDe(rows, CÒRS);
	if (!ids.length) {
		ids = idsPerNom(EXEMPLES);
		còrs = idsPerNom(CÒRS_EXEMPLES);
	}
	const artistas = (await fichasMusica([...new Set([...ids, ...còrs])], semenças))
		.map((a) => ({
			...a,
			// sans photo chez Deezer (image vide), on montre la pochette
			imatge: a.imatge.includes('d41d8cd98f00b204e9800998ecf8427e') ? a.album.cobèrta : a.imatge,
			còr: còrs.includes(a.id),
			annada: a.album.data.slice(0, 4)
		}))
		.sort((x, y) => x.nom.localeCompare(y.nom, 'fr'));
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
	return { novetats, còps: còrs.map((id) => artistas.find((a) => a.id === id)).filter(Boolean), az, letras };
}
