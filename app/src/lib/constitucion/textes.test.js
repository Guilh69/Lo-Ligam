import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TEXTES, parser, blocsOc, ancre, etiqueta, morceaux, typo, texteDeFin } from './textes.js';

const ici = dirname(fileURLToPath(import.meta.url));
const fr = (id) => parser(readFileSync(join(ici, 'fr', `${id}.txt`), 'utf8'));

describe('les quatre textes : occitan et français bloc pour bloc', () => {
	for (const t of TEXTES) {
		it(`${t.id} : mêmes numéros, mêmes balises, même nombre de lignes de liste`, () => {
			const oc = blocsOc(t.id);
			const f = fr(t.id);
			expect(oc.length).toBe(f.length);
			expect(oc.length).toBeGreaterThan(10);
			oc.forEach((b, i) => {
				expect(b.id, `bloc ${i}`).toBe(f[i].id);
				expect(b.tag, `bloc ${b.id}`).toBe(f[i].tag);
				const n = (s) => (s.match(/⏎/g) || []).length;
				expect(n(b.txt), `⏎ du bloc ${b.id}`).toBe(n(f[i].txt));
				expect(b.txt.trim().length, `bloc ${b.id} vide`).toBeGreaterThan(0);
			});
		});

		it(`${t.id} : les numéros se suivent et les ancres sont uniques`, () => {
			const oc = blocsOc(t.id);
			oc.forEach((b, i) => expect(Number(b.id)).toBe(i + 1));
			const ancres = oc.map(ancre).filter(Boolean);
			expect(new Set(ancres).size).toBe(ancres.length);
		});

		it(`${t.id} : pas de reste de travail dans la traduction`, () => {
			for (const b of blocsOc(t.id)) {
				expect(b.txt, `bloc ${b.id}`).not.toMatch(/ {2}|\t|\bTODO\b|\?\?\?/);
				// la ponctuation espacée à la française : pas de « ,  » ni d'espace avant la virgule
				expect(b.txt, `bloc ${b.id}`).not.toMatch(/ [,.]/);
			}
		});
	}

	it('la Constitution contient ses articles, dont les deux qui parlent des langues', () => {
		const ancres = blocsOc('const').filter((b) => b.tag === 'h3').map(ancre);
		expect(ancres).toContain('art-1');
		expect(ancres).toContain('art-2');
		expect(ancres).toContain('art-75-1');
		expect(ancres).toContain('art-89');
		expect(ancres.length).toBeGreaterThan(100);
	});

	it('l’article 75-1 et l’article 2, mot pour mot dans le texte français', () => {
		const f = fr('const');
		const i75 = f.findIndex((b) => ancre(b) === 'art-75-1');
		expect(f[i75 + 1].txt).toBe('Les langues régionales appartiennent au patrimoine de la France.');
		const i2 = f.findIndex((b) => ancre(b) === 'art-2');
		expect(f[i2 + 1].txt).toBe('La langue de la République est le français.');
	});
});

describe('lecture des fichiers', () => {
	it('accepte les fins de ligne Windows comme Unix (Git convertit à l’extraction)', () => {
		const attendu = [
			{ id: '001', tag: 'h2', txt: 'PREAMBUL' },
			{ id: '002', tag: 'p', txt: 'Lo pòble.' }
		];
		expect(parser('001 h2 PREAMBUL\n002 p Lo pòble.\n')).toEqual(attendu);
		expect(parser('001 h2 PREAMBUL\r\n002 p Lo pòble.\r\n')).toEqual(attendu);
	});
});

describe('aides d’affichage', () => {
	it('etiqueta : article, titre numéroté, préambule', () => {
		expect(etiqueta({ txt: 'ARTICLE 34-1.' })).toEqual({ gros: 'Article 34-1' });
		expect(etiqueta({ txt: 'ARTICLE PRIMIÈR.' })).toEqual({ gros: 'Article primièr' });
		expect(etiqueta({ txt: 'Títol XI BIS - LO DEFENSOR DELS DRECHES' })).toEqual({ petit: 'Títol XI BIS', gros: 'LO DEFENSOR DELS DRECHES' });
		expect(etiqueta({ txt: 'PREAMBUL' })).toEqual({ gros: 'PREAMBUL' });
	});

	it('ancre : article premier, article numéroté, titre', () => {
		expect(ancre({ tag: 'h3', txt: 'ARTICLE PREMIER.' })).toBe('art-1');
		expect(ancre({ tag: 'h3', txt: 'ARTICLE PRIMIÈR.' })).toBe('art-1');
		expect(ancre({ tag: 'h2', txt: 'Article 1èr' })).toBe('art-1');
		expect(ancre({ tag: 'h3', txt: 'ARTICLE 88-7' })).toBe('art-88-7');
		expect(ancre({ tag: 'h2', txt: 'Títol XI BIS - LO DEFENSOR' })).toBe('titol-xi-bis');
		expect(ancre({ tag: 'p', txt: 'x' })).toBeNull();
	});

	it('morceaux : paragraphes et listes', () => {
		expect(morceaux('Un seul alinéa.')).toEqual([{ type: 'p', items: ['Un seul alinéa.'] }]);
		expect(morceaux('Dispose : ⏎ ⏎ - un ; ⏎ ⏎ - deux.')).toEqual([
			{ type: 'p', items: ['Dispose :'] },
			{ type: 'liste', items: ['un ;', 'deux.'] }
		]);
		expect(morceaux('- a ; ⏎ ⏎ - b.')).toEqual([{ type: 'liste', items: ['a ;', 'b.'] }]);
	});

	it('typo : espace insécable avant : ; ! ? et dans les guillemets', () => {
		expect(typo('« Libertat, Egalitat » : bon ; fin ?')).toBe('« Libertat, Egalitat » : bon ; fin ?');
	});

	it('texteDeFin retrouve chaque texte par son adresse', () => {
		expect(texteDeFin('').id).toBe('const');
		expect(texteDeFin('declaracion-1789').id).toBe('ddhc');
		expect(texteDeFin('preambul-1946').id).toBe('pre46');
		expect(texteDeFin('carta-environament').id).toBe('charte');
		expect(texteDeFin('inconnu')).toBeUndefined();
	});
});
