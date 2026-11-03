// La géométrie de la croix occitane du logo (Crotz.svelte : favicon.svg normalisée, rayon 1,
// centre en 0 0), partagée par CrotzCarga.svelte (essai /ensag/crotz) et par le chemin de
// S'apren (MiegTres.svelte, variante C choisie par Romain le 2026-11-03).

// les douze points, dans l'ordre où ils s'allument : depuis le haut, dans le sens des aiguilles
// d'une montre
export const PONCHS = [
	[0, -1],
	[0.486, -0.797],
	[0.809, -0.48],
	[1, 0],
	[0.809, 0.48],
	[0.486, 0.797],
	[0, 0.992],
	[-0.468, 0.797],
	[-0.786, 0.48],
	[-0.976, 0.009],
	[-0.786, -0.48],
	[-0.468, -0.797]
];

// les huit rayons qui vont du moyeu aux points intermédiaires
export const RAIS = 'M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797';

// les huit arcs entre les points
export const ARCS =
	'M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48';
