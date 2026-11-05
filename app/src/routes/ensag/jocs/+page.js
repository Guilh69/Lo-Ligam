// L'essai des jeux (04-11) est devenu une rubrique de S'apren, /apren/jocs
// (Romain, 2026-11-05 : « une rubrique à part entière dans S'apren »). Les
// anciens liens arrivent au bon endroit, avec le jeu demandé.
import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	const joc = url.searchParams.get('joc');
	redirect(301, joc === 'paniers' || joc === 'serp' ? `/apren/jocs?joc=${joc}` : '/apren/jocs');
}
