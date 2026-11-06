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

// Les images des fiches (2026-11-06) : une photo de paysage qui existe, ses
// deux petites tailles dans static/cultura (scripts/cultura-fotos.mjs), un
// dessin qui existe ; jamais photo et dessin à la fois.
describe('les images de Cultura', async () => {
	const { existsSync } = await import('node:fs');
	const { FOTOS, COMMONS, STOCK, DESSENHS, AMPLES, amples, srcset } = await import('./imatges.js');
	const { PAISATGES } = await import('$lib/paisatges/paisatges.js');
	const { dessenh } = await import('./dessenhs.server.js');
	const ids = new Set(FICHAS.map((f) => f.id));

	it('vont à des fiches qui existent, une seule image par fiche', () => {
		const tots = [...Object.keys(FOTOS), ...Object.keys(COMMONS), ...Object.keys(STOCK), ...Object.keys(DESSENHS)];
		for (const id of tots) expect(ids.has(id), id).toBe(true);
		expect(new Set(tots).size).toBe(tots.length);
	});

	it('ont les tailles des autres photos de Romain', () => {
		for (const [id, s] of Object.entries(STOCK)) {
			expect(s.pos, id).toMatch(/^\d{1,3}% \d{1,3}%$/);
			for (const a of amples(id)) expect(existsSync(`static/cultura/${id}-${a}.webp`), `${id}-${a}`).toBe(true);
		}
		expect(amples('calandreta')).toEqual([480, 800, 1200]);
		for (const s of Object.values(STOCK)) if (s.zoom) expect(s.zoom).toBeGreaterThan(1);
	});

	it('illustrent toutes les fiches (Romain, 06-11 : « Il manque des illustrations »)', () => {
		const tots = new Set([...Object.keys(FOTOS), ...Object.keys(COMMONS), ...Object.keys(STOCK)]);
		for (const id of ids) expect(tots.has(id), id).toBe(true);
	});

	it('créditent les photos de Wikimedia Commons et ont leurs tailles', () => {
		for (const [id, c] of Object.entries(COMMONS)) {
			expect(c.autor, id).toBeTruthy();
			expect(c.licencia, id).toMatch(/^(CC0|CC BY(-SA)? \d\.\d)$/);
			expect(c.ligam, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
			expect(c.licenciaLigam, id).toMatch(/^https:\/\/creativecommons\.org\//);
			for (const a of amples(id)) expect(existsSync(`static/cultura/${id}-${a}.webp`), `${id}-${a}`).toBe(true);
			expect(amples(id).at(-1), id).toBeLessThanOrEqual(c.largor);
		}
		// au sommaire, pas plus de 800 ; la copa (532 de large) s'arrête à 532
		expect(srcset('carnaval')).toBe('/cultura/carnaval-480.webp 480w, /cultura/carnaval-800.webp 800w');
		expect(amples('copa-santa')).toEqual([480, 532]);
	});

	it('créditent dans toutes les langues', () => {
		for (const clau of ['fotoDe', 'modificada', 'fotosCommons'])
			for (const l of LENGAS) expect(IU[clau][l], `${clau}.${l}`).toBeTruthy();
	});

	it('ont leur photo et ses petites tailles', () => {
		for (const [id, { clau, pos }] of Object.entries(FOTOS)) {
			expect(PAISATGES.some((p) => p.clau === clau), clau).toBe(true);
			expect(pos, id).toMatch(/^\d{1,3}% \d{1,3}%$/);
			for (const a of AMPLES) expect(existsSync(`static/cultura/${id}-${a}.webp`), `${id}-${a}`).toBe(true);
		}
	});

	it('ont leur dessin', () => {
		for (const id of Object.keys(DESSENHS)) expect(dessenh(id)?.length, id).toBeGreaterThan(0);
	});
});
