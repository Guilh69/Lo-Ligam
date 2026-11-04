// Retrouver l'encart « Cultura » d'une fiche dans sa leçon, côté serveur :
// la page ne reçoit que l'encart, pas les 39 modules du parcours (poids de
// la page).
import { moduls } from '$lib/lesson/moduls/index.js';
import { titolEncart, memeTitol } from './index.js';

/** les encarts « Cultura » d'un module, dans l'ordre de la leçon */
export function encartsDe(mod) {
	const trobats = [];
	const percórrer = (o) => {
		if (!o || typeof o !== 'object') return;
		if (o.variant === 'culture') trobats.push(o);
		for (const v of Object.values(o)) percórrer(v);
	};
	percórrer(mod);
	return trobats;
}

/** l'encart d'une fiche, avec le nom du module ; null s'il manque */
export function encart(f) {
	const mod = moduls[f.modul];
	if (!mod) return null;
	const b = encartsDe(mod).find((e) => memeTitol(titolEncart(e.title), f.titol.fr));
	if (!b) return null;
	return {
		paragrafes: b.paragraphs ?? [],
		lista: b.list ?? [],
		lien: b.lien ?? null,
		modul: { oc: mod.oc ?? '', fr: mod.fr ?? '' }
	};
}
