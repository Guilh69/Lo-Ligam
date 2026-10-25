// Espace musique : ajouter un artiste par son nom (/admin/musica, 2026-10-25).
// La recherche passe par notre serveur ; Romain choisit ensuite le bon parmi
// les homonymes, d'après la photo et le nombre d'albums.
//
//   GET /api/musica/cercar?q=Cocanha → [{ id, nom, imatge, albums, fans }]
import { json } from '@sveltejs/kit';
import { cercarArtistas } from '$lib/server/deezer.js';

export async function GET({ url }) {
	const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
	if (q.length < 2) return json([]);
	return json(await cercarArtistas(q), { headers: { 'cache-control': 'private, max-age=600' } });
}
