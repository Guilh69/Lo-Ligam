// Les choses apprises : tirées des encadrés « À retenir » (blocs `chunks`)
// des modules, une par ligne qui porte un `id`. Une seule source : le module.
// Les questions auto-corrigées disent quelles choses elles testent par leur
// champ `choses` (liste d'id).
import { moduls, ordre } from '$lib/lesson/moduls/index.js';

export function listerChoses(registre = moduls, cles = ordre) {
	const choses = [];
	for (const cle of cles) {
		for (const etape of registre[cle].sessions) {
			for (const bloc of etape.blocks) {
				if (bloc.type !== 'chunks') continue;
				for (const item of bloc.items) {
					if (item.id) choses.push({ id: item.id, oc: item.oc, fr: item.fr, modul: cle });
				}
			}
		}
	}
	return choses;
}

export const choses = listerChoses();
