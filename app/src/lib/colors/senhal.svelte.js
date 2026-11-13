// Le signal des couleurs (2026-11-13) : la seule part de l'outil « Colors » que tout le monde
// charge. La palette (lib/styles/palette.js) le lit à chaque accès ; quand Romain change une
// couleur depuis le site (lib/colors/colors.svelte.js, chargé pour lui seul), le signal avance
// et les pages qui lisent la palette se redessinent. Pour un visiteur, il ne bouge jamais.
import { browser } from '$app/environment';
import { brancarSenhal } from '$lib/styles/palette.js';

function crear() {
	const e = $state({ version: 0 });
	return e;
}
// (un seul état pour toute la page, comme stores/ambianca)
export const senhal = browser ? (globalThis.__loLigamColorsSenhal ??= crear()) : crear();
if (browser) brancarSenhal(() => senhal.version);
