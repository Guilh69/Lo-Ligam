// La pile de validation (Lo talhièr, lot 4, 06-11) : l'ordre des cartes, ce qui
// en sort, et l'empreinte des textes validés.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fargarCartas, estatElement, CAMINS, ligamNota } from './pila.js';
import { tèxteElement, tèxteFicha, empremta } from './empremtas.js';

const nota = (o) => ({ estat: 'dubèrta', vista: false, de_romain: false, per: 'ia', clau: null, pagina: '/', ...o });
const element = (clau, pagina, empremta = 'e-' + clau) => ({ clau, pagina, tipe: 'text', oc: 'Bonjorn', fr: 'Bonjour', empremta });
const ficha = (id, capitol = 'a') => ({ f: { id, capitol, titol: id, validada: false }, empremta: 'f-' + id });

describe('pila : les cartes', () => {
	const notas = [
		nota({ id: 8, per: 'romain', autor: 'Claude' }), // question de l'IA
		nota({ id: 3, per: 'romain', autor: 'Mistral' }), // question plus ancienne
		nota({ id: 5, de_romain: true, estat: 'tractada', responsa: 'Fait' }), // réponse à regarder
		nota({ id: 6, de_romain: true, estat: 'tractada', vista: true }), // déjà vue
		nota({ id: 7, de_romain: true, per: 'romain' }), // note pour soi : pas dans la pile
		nota({ id: 9, de_romain: true, clau: 'apren.titol' }) // une note attend l'IA sur cet élément
	];
	const elements = [element('visio.b', 'visio'), element('acuelh.lista.10', 'acuelh'), element('acuelh.lista.2', 'acuelh'), element('apren.titol', 'apren'), element('apren.ok', 'apren')];
	const fichas = [ficha('z', 'b'), ficha('y', 'a')];
	const validacions = { 'element:apren.ok': 'e-apren.ok', 'element:visio.b': 'pas-la-meme' };

	it('questions, puis réponses, puis les pages dans leur ordre, puis les fiches', () => {
		const ids = fargarCartas({ notas, elements, fichas, validacions }).map((c) => c.id);
		expect(ids).toEqual(['q3', 'q8', 'r5', 'e:acuelh.lista.2', 'e:acuelh.lista.10', 'e:visio.b', 'f:y', 'f:z']);
	});

	it('un texte changé depuis sa validation revient ; un texte qui attend l’IA attend', () => {
		const ids = fargarCartas({ notas, elements, fichas, validacions }).map((c) => c.id);
		expect(ids).toContain('e:visio.b');
		expect(ids).not.toContain('e:apren.ok');
		expect(ids).not.toContain('e:apren.titol');
	});

	it('« Mai tard » envoie au bout, dans l’ordre des renvois', () => {
		const ids = fargarCartas({ notas, elements, fichas, validacions, maiTard: ['r5', 'q3'] }).map((c) => c.id);
		expect(ids.slice(-2)).toEqual(['r5', 'q3']);
		expect(ids[0]).toBe('q8');
	});

	it('un lot ne montre qu’une sorte', () => {
		expect(fargarCartas({ notas, elements, fichas, validacions, lot: 'gramatica' }).map((c) => c.id)).toEqual(['f:y', 'f:z']);
		expect(fargarCartas({ notas, elements, fichas, validacions, lot: 'tèxtes' }).every((c) => c.tipe === 'element')).toBe(true);
	});

	it('une fiche validée sort ; une note ouverte sur sa page la met en attente', () => {
		const ids = fargarCartas({ notas: [nota({ id: 1, de_romain: true, pagina: '/apren/gramatica/z' })], elements: [], fichas, validacions: { 'ficha:y': 'f-y' } }).map((c) => c.id);
		expect(ids).toEqual([]);
	});

	it('l’état d’un élément pour « Validar »', () => {
		expect(estatElement({ clau: 'apren.ok', empremta: 'e-apren.ok' }, validacions, notas)).toBe('validat');
		expect(estatElement({ clau: 'apren.titol', empremta: 'x' }, validacions, notas)).toBe('nota');
		expect(estatElement({ clau: 'visio.b', empremta: 'e-visio.b' }, validacions, notas)).toBe('a-validar');
	});
});

describe('pila : chaque page modifiable a son adresse', () => {
	it('toutes les pages qui appellent iniciar(…) sont dans CAMINS', () => {
		const pages = new Set();
		const parcorrer = (dir) => {
			for (const n of readdirSync(dir)) {
				const p = join(dir, n);
				if (statSync(p).isDirectory()) parcorrer(p);
				else if (n.endsWith('.svelte')) for (const m of readFileSync(p, 'utf8').matchAll(/\biniciar\('([^']+)'/g)) pages.add(m[1]);
			}
		};
		parcorrer(join(process.cwd(), 'src', 'routes'));
		expect(pages.size).toBeGreaterThan(5);
		for (const p of pages) expect(CAMINS, `page « ${p} »`).toHaveProperty(p);
	});
});

describe('pila : les empreintes', () => {
	it('sha-256 en hexadécimal', async () => {
		expect(await empremta('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
	});
	it('le texte d’un élément sans blancs autour, en forme composée', () => {
		expect(tèxteElement('  è ')).toBe('è');
		expect(tèxteElement(null)).toBe('');
	});
	it('une fiche passée à « validada » garde son empreinte', () => {
		expect(tèxteFicha({ id: 'a', validada: false, ecrans: [1] })).toBe(tèxteFicha({ id: 'a', validada: true, ecrans: [1] }));
		expect(tèxteFicha({ id: 'a', ecrans: [1] })).not.toBe(tèxteFicha({ id: 'a', ecrans: [2] }));
	});
});

describe('ligamNota', () => {
	it('mène vers un chemin du site, jamais ailleurs', () => {
		expect(ligamNota({ id: 3, pagina: '/apren/visio' })).toBe('/apren/visio?nota=3');
		expect(ligamNota({ id: 3, pagina: '//ailleurs.com' })).toBe('/?nota=3');
		expect(ligamNota({ id: 3, pagina: '/\\ailleurs.com' })).toBe('/?nota=3');
		expect(ligamNota({ id: 3, pagina: 'https://ailleurs.com' })).toBe('/?nota=3');
		expect(ligamNota({ id: 3, pagina: null })).toBe('/?nota=3');
	});
});
