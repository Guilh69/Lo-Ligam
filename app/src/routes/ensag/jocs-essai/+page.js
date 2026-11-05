// L'essai d'allure « Teula » est adopté pour les jeux, avec la palette
// crème (Romain, 05-11 : « A, crème ») : les anciens liens arrivent sur les
// jeux, avec le jeu demandé (?joc=paniers).
import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	const joc = url.searchParams.get('joc');
	redirect(301, joc === 'paniers' || joc === 'serp' ? `/ensag/jocs?joc=${joc}` : '/ensag/jocs');
}
