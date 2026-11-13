import { describe, it, expect } from 'vitest';
import {
	CIBLE,
	urlPublique,
	cheminSortie,
	signature,
	choisirBruts,
	partager,
	construireIndex,
	manques,
	lireMesures,
	argsMesure,
	argsSortie,
	poidsLisible
} from './polir.js';
import { totasLasFrasas } from './phrases.js';
import { VOTZ } from './voix-index.js';

const brut = (chemin, taille = 100, date = '2026-11-13T10:00:00Z') => ({ chemin, taille, date });

describe('nommage', () => {
	it('le chemin public est celui que promet voix-index.js', () => {
		expect(urlPublique('1-1/d-1a2b3c4d')).toBe('/audio/moduls/1-1/d-1a2b3c4d.m4a');
	});
	it('le fichier propre va dans <sortie>/<clé>.m4a', () => {
		expect(cheminSortie('1-1/adieu', 'static/audio/moduls/')).toBe('static/audio/moduls/1-1/adieu.m4a');
		expect(() => cheminSortie('adieu', 'x')).toThrow();
	});
	it('une signature change quand la prise est refaite', () => {
		expect(signature({ taille: 10, date: '2026-11-13T10:00:00Z' })).not.toBe(signature({ taille: 10, date: '2026-11-13T10:05:00Z' }));
		expect(signature({ taille: 10, date: '2026-11-13T10:00:00.400Z' })).toBe(signature({ taille: 10, date: '2026-11-13T10:00:00.900Z' }));
	});
});

describe('choix des bruts', () => {
	const connues = new Set(['1-1/adieu', '1-1/d-0a1b2c3d']);
	it('garde les prises valides et écarte le reste avec une raison', () => {
		const { bruts, ignores } = choisirBruts(
			[brut('1-1/adieu.webm'), brut('1-1/notes.txt'), brut('1-1/inconnue.webm'), brut('vrac.webm')],
			connues
		);
		expect([...bruts.keys()]).toEqual(['1-1/adieu']);
		expect(ignores.map((i) => i.chemin).sort()).toEqual(['1-1/inconnue.webm', '1-1/notes.txt', 'vrac.webm']);
		expect(ignores.every((i) => i.raison.length > 0)).toBe(true);
	});
	it('deux formats de la même phrase : la plus récente gagne', () => {
		const { bruts, ignores } = choisirBruts([brut('1-1/adieu.webm', 1, '2026-11-13T10:00:00Z'), brut('1-1/adieu.m4a', 2, '2026-11-13T11:00:00Z')], connues);
		expect(bruts.get('1-1/adieu').chemin).toBe('1-1/adieu.m4a');
		expect(ignores.map((i) => i.chemin)).toEqual(['1-1/adieu.webm']);
		// même résultat dans l'autre ordre
		const inverse = choisirBruts([brut('1-1/adieu.m4a', 2, '2026-11-13T11:00:00Z'), brut('1-1/adieu.webm', 1, '2026-11-13T10:00:00Z')], connues);
		expect(inverse.bruts.get('1-1/adieu').chemin).toBe('1-1/adieu.m4a');
	});
});

describe('ce qui est à refaire', () => {
	const { bruts } = choisirBruts([brut('1-1/b.webm', 5, 1000000), brut('1-1/a.webm', 6, 2000000)]);
	it('tout à faire la première fois, trié par clé', () => {
		const r = partager(bruts, {}, () => false);
		expect(r.afaire.map((b) => b.clau)).toEqual(['1-1/a', '1-1/b']);
		expect(r.ajour).toEqual([]);
	});
	it('ne refait pas ce qui n’a pas changé', () => {
		const etat = { '1-1/a': { sig: bruts.get('1-1/a').sig }, '1-1/b': { sig: bruts.get('1-1/b').sig } };
		const r = partager(bruts, etat, () => true);
		expect(r.afaire).toEqual([]);
		expect(r.ajour).toHaveLength(2);
	});
	it('refait une prise refaite, ou dont le fichier propre a disparu', () => {
		const etat = { '1-1/a': { sig: 'ancienne' }, '1-1/b': { sig: bruts.get('1-1/b').sig } };
		expect(partager(bruts, etat, () => true).afaire.map((b) => b.clau)).toEqual(['1-1/a']);
		expect(partager(bruts, etat, (c) => c !== '1-1/b').afaire.map((b) => b.clau)).toEqual(['1-1/a', '1-1/b']);
	});
	it('--tot refait tout', () => {
		const etat = { '1-1/a': { sig: bruts.get('1-1/a').sig } };
		expect(partager(bruts, etat, () => true, true).afaire).toHaveLength(2);
	});
});

describe('index', () => {
	it('une ligne par clé, triées, sans doublon, stable', () => {
		const t = construireIndex(['1-1/b', '0/d-1', '1-1/a', '1-1/b']);
		expect(t).toBe(construireIndex(['1-1/a', '1-1/b', '0/d-1']));
		const lignes = t.split('\n').filter((l) => l.startsWith('\t'));
		expect(lignes).toEqual([
			'\t"0/d-1": "/audio/moduls/0/d-1.m4a",',
			'\t"1-1/a": "/audio/moduls/1-1/a.m4a",',
			'\t"1-1/b": "/audio/moduls/1-1/b.m4a"'
		]);
	});
	it('reste du JavaScript valide, même vide, et lisible comme VOTZ', async () => {
		for (const cles of [[], ['1-1/adieu']]) {
			const t = construireIndex(cles);
			const mod = await import(`data:text/javascript;base64,${Buffer.from(t).toString('base64')}`);
			expect(Object.keys(mod.VOTZ)).toEqual(cles);
		}
	});
	it('le fichier actuel respecte le format (clés connues, chemin = urlPublique)', () => {
		const connues = new Set(totasLasFrasas().map((f) => f.clau));
		for (const [c, u] of Object.entries(VOTZ)) {
			expect(connues.has(c)).toBe(true);
			expect(u).toBe(urlPublique(c));
		}
	});
	it('compte les phrases sans voix', () => {
		expect(manques(['a/1', 'a/2', 'a/3'], ['a/2'])).toEqual({ total: 3, sansVoix: 2 });
	});
});

describe('ffmpeg', () => {
	const json = `[Parsed_loudnorm_5 @ 0x1]\n{\n\t"input_i" : "-32.80",\n\t"input_tp" : "-20.10",\n\t"input_lra" : "0.10",\n\t"input_thresh" : "-43.20",\n\t"output_i" : "-19.0",\n\t"target_offset" : "0.30"\n}\n`;
	it('lit la mesure de la première passe', () => {
		expect(lireMesures(`blabla\n${json}`)).toEqual({ entree: -32.8, crete: -20.1, plage: 0.1, seuil: -43.2, decalage: 0.3 });
	});
	it('rend null si la prise est muette ou illisible', () => {
		expect(lireMesures(json.replace('-32.80', '-inf'))).toBeNull();
		expect(lireMesures('Invalid data found')).toBeNull();
	});
	it('la même cible pour toutes les phrases, mono, léger', () => {
		const m = { entree: -30, crete: -10, plage: 1, seuil: -40, decalage: 0 };
		const a = argsSortie('in.webm', 'out.m4a', m);
		const filtre = a[a.indexOf('-af') + 1];
		expect(filtre).toContain(`I=${CIBLE.lufs}`);
		expect(filtre).toContain('measured_I=-30');
		expect(filtre).toContain('linear=true');
		expect(a).toContain('-ac');
		expect(a[a.indexOf('-b:a') + 1]).toBe('48k');
		expect(a.at(-1)).toBe('out.m4a');
		expect(argsMesure('in.webm').join(' ')).toContain('print_format=json');
	});
	it('affiche des poids lisibles', () => {
		expect(poidsLisible(18 * 1024)).toBe('18 Ko');
		expect(poidsLisible(1.5 * 1024 * 1024)).toBe('1,5 Mo');
	});
});
