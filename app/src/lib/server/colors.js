// Les couleurs que Romain a choisies depuis le site (outil « Colors », lib/colors,
// 2026-11-13), à l'état publié : lues avec les éléments modifiables (même table,
// même mémoire de vingt secondes, même filet de secours), filtrées par le
// registre (identifiants connus, couleurs #rrggbb : rien d'autre ne peut
// entrer dans la page), puis posées sur la palette du serveur et rendues sous
// deux formes pour app.html : la feuille de style et la liste.
import { legirElements } from './elements.js';
import { PAGINA, surchargesDe, cssColors } from '$lib/colors/registre.js';
import { fixarColors } from '$lib/styles/palette.js';

let memòria = { rows: null, css: '', json: '{}' };

export async function colorsPublicadas() {
	let rows = [];
	try {
		rows = await legirElements(PAGINA);
	} catch {
		// la base ne répond pas et le filet n'a rien : les couleurs d'origine
	}
	if (rows === memòria.rows) return memòria;
	const s = surchargesDe(rows);
	// la palette du serveur : la même pour toutes les demandes (cases, langues, cartes rendues en HTML)
	fixarColors(s);
	// (« < » ne peut pas s'y trouver ; échappé quand même, la liste est écrite dans une balise script)
	memòria = { rows, css: cssColors(s), json: JSON.stringify(s).replace(/</g, '\\u003c') };
	return memòria;
}
