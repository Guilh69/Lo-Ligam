// Le garde-fou de Cultura (2026-11-04) : chaque fiche retrouve son encart
// dans sa leçon, chaque encart « Cultura » du parcours a sa fiche, et les
// titres existent dans toutes les langues du site. Sinon `npm test` échoue
// au lieu de laisser partir une fiche vide ou un encart oublié.
import { describe, it, expect } from 'vitest';
import { FICHAS, TEMAS, IU, titolEncart, memeTitol } from './index.js';
import { encart, encartsDe } from './encart.server.js';
import { moduls } from '$lib/lesson/moduls/index.js';

const LENGAS = ['oc', 'fr', 'es', 'en', 'ca', 'ar'];

describe('les fiches de Cultura', () => {
	it('ont des adresses uniques, sans accent', () => {
		expect(new Set(FICHAS.map((f) => f.id)).size).toBe(FICHAS.length);
		for (const f of FICHAS) expect(f.id).toMatch(/^[a-z0-9-]+$/);
	});

	it('ont un thème connu', () => {
		const temas = new Set(TEMAS.map((t) => t.id));
		for (const f of FICHAS) expect(temas.has(f.tema), f.id).toBe(true);
	});

	it('retrouvent chacune leur encart dans leur leçon', () => {
		for (const f of FICHAS) {
			const e = encart(f);
			expect(e, `${f.id} (module ${f.modul}, « ${f.titol.fr} »)`).not.toBeNull();
			expect(e.paragrafes.length + e.lista.length, f.id).toBeGreaterThan(0);
		}
	});

	it('rangent tous les encarts « Cultura » du parcours', () => {
		for (const [clau, mod] of Object.entries(moduls))
			for (const b of encartsDe(mod)) {
				const rangat = FICHAS.some((f) => f.modul === clau && memeTitol(titolEncart(b.title), f.titol.fr));
				expect(rangat, `encart « ${b.title} » du module ${clau} : à ranger dans $lib/cultura/index.js`).toBe(true);
			}
	});

	it('suivent l’ordre du parcours', () => {
		const ordre = Object.keys(moduls);
		const rangs = FICHAS.map((f) => ordre.indexOf(f.modul));
		expect(rangs).toEqual([...rangs].sort((a, b) => a - b));
	});

	it('ont un titre dans chaque langue du site', () => {
		for (const f of FICHAS) for (const l of LENGAS) expect(f.titol[l], `${f.id} (${l})`).toBeTruthy();
	});
});

describe('les thèmes de Cultura', () => {
	it('ont leur couleur, leurs exemples et leur nom dans chaque langue', () => {
		for (const t of TEMAS) {
			expect(t.color).toHaveLength(2);
			expect(t.exemple).toBeTruthy();
			for (const l of LENGAS) {
				expect(t.nom[l], `${t.id} (${l})`).toBeTruthy();
				expect(t.detalh[l], `${t.id} (${l})`).toBeTruthy();
			}
		}
	});

	it('ont chacun au moins une fiche', () => {
		for (const t of TEMAS) expect(FICHAS.some((f) => f.tema === t.id), t.id).toBe(true);
	});
});

describe('l’interface de Cultura', () => {
	it('a ses textes dans chaque langue', () => {
		for (const [clau, v] of Object.entries(IU))
			for (const l of LENGAS) {
				// « Texte en français » ne s'affiche pas en français
				if (clau === 'enFrances' && l === 'fr') continue;
				expect(v[l], `${clau} (${l})`).toBeTruthy();
			}
	});
});
