// Le garde-fou des fiches de grammaire (contrôle de Joan, 2026-11-03) : une
// fiche mal écrite (notion inconnue, couleur absente, activité impossible,
// source oubliée…) fait échouer `npm test` au lieu de partir en ligne.
import { describe, it, expect } from 'vitest';
import { FICHAS } from './index.js';
import { PARTS } from './capitols.js';
import { copa, marcar } from './marcar.js';
import { BLOCS, COLORS, PICTOS } from './listas.js';

const NOCIONS = PARTS.flatMap((p) => p.capitols.map((c) => c.id));

/** toutes les chaînes d'un objet, où qu'elles soient */
const cadenas = (o) => (typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(cadenas) : []);
/** les mots à fin colorée « [rad|fin:clé] » d'un texte (pas les liens « [texte](/…) ») */
const colorats = (s) => [...s.matchAll(/\[([^\]|]*)\|([^\]]*)\](?!\()/g)].map((m) => copa(m[1] + '|' + m[2]).color);

describe('le sommaire de la grammaire', () => {
	it('a des notions uniques', () => {
		expect(new Set(NOCIONS).size).toBe(NOCIONS.length);
	});
	it('a au moins une fiche', () => {
		expect(FICHAS.length).toBeGreaterThan(0);
	});
	it('n’a pas deux fiches à la même adresse', () => {
		const ids = FICHAS.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

for (const f of FICHAS) {
	const blocs = f.ecrans.flatMap((e) => e.blocs);
	const cles = Object.keys(f.colors ?? {});

	describe(`la fiche « ${f.id} »`, () => {
		it('a une adresse en ASCII et se range sous une notion du sommaire', () => {
			expect(f.id).toMatch(/^[a-z0-9-]+$/);
			expect(NOCIONS).toContain(f.capitol);
			expect(typeof f.titol).toBe('string');
			expect(typeof f.resumit).toBe('string');
			expect(typeof f.validada).toBe('boolean');
		});

		it('relie ses clés à des couleurs qui existent', () => {
			for (const c of Object.values(f.colors ?? {})) expect(COLORS).toContain(c);
		});

		it('n’emploie que des blocs connus', () => {
			for (const b of blocs) expect(BLOCS).toContain(b.type);
		});

		it('donne une couleur connue à chaque fin colorée', () => {
			const usadas = [
				...cadenas(f).flatMap(colorats),
				...blocs.filter((b) => b.type === 'cartas').flatMap((b) => b.items.map((i) => i.color)),
				...blocs.filter((b) => b.type === 'copas').flatMap((b) => b.items.map((i) => copa(i.mot).color)),
				...blocs.filter((b) => b.type === 'relacionar').flatMap((b) => b.linhas.map((l) => copa(l.forma).color))
			];
			for (const c of usadas) expect(cles, `clé de couleur « ${c} »`).toContain(c);
		});

		it('n’emploie que des pictogrammes connus', () => {
			const pictos = blocs.flatMap((b) => [...(b.items ?? []), ...(b.items ?? []).flatMap((i) => i.frasas ?? [])]).map((i) => i.picto).filter(Boolean);
			for (const p of pictos) expect(PICTOS).toContain(p);
		});

		it('a des activités jouables : les formes à placer sont exactement les réponses', () => {
			for (const b of blocs.filter((b) => b.type === 'relacionar')) {
				const reponsas = b.linhas.map((l) => copa(l.forma).rad + copa(l.forma).fin);
				expect(new Set(b.mescla).size, 'une forme en double dans mescla').toBe(b.mescla.length);
				expect([...b.mescla].sort()).toEqual([...reponsas].sort());
			}
		});

		it('a des blocs complets', () => {
			for (const b of blocs) {
				if (['intro', 'nota', 'indic', 'seguida'].includes(b.type)) expect(typeof b.text).toBe('string');
				if (b.type === 'copas') expect(b.noms).toHaveLength(2);
				if (b.type === 'cultura') expect(b.paragrafes?.length).toBeGreaterThan(0);
			}
		});

		it('cite ses sources : la page sous les écrans, le bloc « Sources » à la fin', () => {
			for (const b of blocs.filter((b) => b.type === 'font')) expect(b.pages).toMatch(/^pages? /);
			expect(f.ecrans.at(-1).blocs.some((b) => b.type === 'fonts')).toBe(true);
			expect(f.fonts?.length).toBeGreaterThan(0);
		});

		it('écrit l’apostrophe typographique (’), jamais la droite', () => {
			for (const s of cadenas(f)) expect(s, s).not.toMatch(/'/);
		});
	});
}

describe('le balisage des fiches', () => {
	it('échappe le HTML', () => {
		expect(marcar('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
	});
	it('colore une fin selon sa clé', () => {
		expect(marcar('[parl|i:ar]', { ar: 'pruna' })).toBe('<span class="mot-lie" lang="oc">parl<b class="fin c-pruna">i</b></span>');
	});
	it('n’accepte que les liens du site ou en https', () => {
		expect(marcar('[a](/aprene)')).toBe('<a href="/aprene">a</a>');
		expect(marcar('[a](https://www.cpnl.cat/)')).toBe('<a href="https://www.cpnl.cat/" rel="noopener">a</a>');
		expect(marcar('[a](javascript:alert(1))')).not.toMatch(/href/);
		expect(marcar('[a](//ailleurs.example)')).not.toMatch(/href/);
	});
});
