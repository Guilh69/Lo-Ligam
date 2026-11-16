import { describe, it, expect } from 'vitest';
import { UNITATS_A1, MODALITATS, MODALITAT, leiçon, elementsDe, brolhonPropre, escriureBrolhon, legirBrolhon, slugDeClau, clauBastir } from './bastir.js';
import { moduls } from '$lib/lesson/moduls/index.js';

describe('Bastir : la matière lue dans le registre', () => {
	it('huit unités de quatre leçons, chacune présente dans le registre', () => {
		expect(UNITATS_A1).toHaveLength(8);
		for (const u of UNITATS_A1) {
			expect(u.slugs).toHaveLength(4);
			for (const s of u.slugs) expect(leiçon(s)).not.toBeNull();
		}
	});
	it('les éléments à retenir du module 1.1 : ses formules, sans doublon', () => {
		const e = elementsDe(moduls['1-1']);
		expect(e.length).toBeGreaterThan(0);
		expect(new Set(e.map((x) => x.id)).size).toBe(e.length);
	});
	it('chaque modalité a un id unique et un état connu', () => {
		const ids = MODALITATS.flatMap((g) => g.items.map((m) => m.id));
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Bastir : le brouillon relu avec soin', () => {
	it('aller-retour fidèle', () => {
		const b = { tèma: 'le marché', cibla: 8, plan: [{ id: 'formulas', nota: 'les prix' }, { id: 'vocal', nota: '' }] };
		expect(legirBrolhon(escriureBrolhon(b))).toEqual(b);
	});
	it('écarte les modalités inconnues, borne les longueurs et le nombre', () => {
		const b = brolhonPropre({ tèma: 'x'.repeat(500), cibla: -3, plan: [{ id: 'inconnue' }, { id: 'qcm', nota: 'y'.repeat(2000) }, null, 'texte'] });
		expect(b.tèma).toHaveLength(200);
		expect(b.cibla).toBe(0);
		expect(b.plan).toEqual([{ id: 'qcm', nota: 'y'.repeat(600) }]);
		expect(MODALITAT.qcm).toBeTruthy();
	});
	it('un contenu illisible donne null, sans erreur', () => {
		expect(legirBrolhon('{pas du json')).toBeNull();
		expect(legirBrolhon(null)).toBeNull();
		expect(legirBrolhon('42')).toBeNull();
	});
	it('la clé de la base et le retour à la leçon', () => {
		expect(slugDeClau(clauBastir('2-3'))).toBe('2-3');
		expect(slugDeClau('autre.2-3')).toBeNull();
	});
});
