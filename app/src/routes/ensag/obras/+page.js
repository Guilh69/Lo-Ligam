// Maquette d'Òbras par art (2026-10-25) : une porte par art. La musique en
// tête, avec l'avis sur Deezer écrit sur la case : un clic, et l'on est dans
// le journal du café (deux clics depuis Se parla).
import { teula } from '$lib/ensag/maqueta.js';

const P = 'ensag-obras';
export function load() {
	return {
		rows: [
			{ clau: `${P}.titol`, tipe: 'text', oc: 'Òbras', fr: 'Œuvres' },
			{ clau: `${P}.frasa`, tipe: 'text', oc: 'Çò qu’escoti, çò que legissi, çò que te fau descobrir en occitan.', fr: 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.' },
			...teula(P, 'musica', 1, '/ensag/musica?dintrar', 'Musica', 'Musique', 'La musica ven de Deezer : en dintrant, Deezer recebrà ton adreça IP e poirà pausar de cookies.', 'La musique vient de Deezer : en entrant, Deezer recevra ton adresse IP et pourra déposer des cookies.'),
			...teula(P, 'literatura', 2, '/ensag/literatura', 'Literatura', 'Littérature', 'Los editors en occitan.', 'Les éditeurs en occitan.'),
			...teula(P, 'cinema', 3, '/ensag/obras#cinema', 'Cinema e video', 'Cinéma et vidéo', 'Lèu.', 'Bientôt.'),
			...teula(P, 'pintura', 4, '/obras#afichas', 'Pintura e afichas', 'Peinture et affiches', 'D’afichas que fan parlar la lenga sus las parets.', 'Des affiches qui font parler la langue sur les murs.'),
			...teula(P, 'scena', 5, '/ensag/obras#scena', 'Scèna', 'Scène', 'Teatre, dança e contes. Lèu.', 'Théâtre, danse et contes. Bientôt.')
		]
	};
}
