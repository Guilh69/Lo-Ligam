// Banc d'essai de l'espace musique (piste C, « la table vue d'en haut »,
// choisie par Romain le 2026-10-25). Quelques artistes pour la maquette ;
// dans la vraie page, c'est Romain qui les ajoutera en tapant leur nom.
import { fichaPerNom } from '$lib/server/deezer.js';

const NOMS = ['Cocanha', 'Lo Cor de la Plana', 'La Mal Coiffée', 'Joanda', 'Moussu T e lei jovents'];

export async function load() {
	const fichas = await Promise.all(NOMS.map(fichaPerNom));
	return { artistas: fichas.filter(Boolean) };
}
