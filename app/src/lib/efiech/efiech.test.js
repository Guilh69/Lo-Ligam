import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escriure, legir } from './legida.js';
import { EMPLACAMENTS, efiechSurRoute } from './emplacaments.js';
import { FORMES } from './biblio/dessin.js';

const ici = dirname(fileURLToPath(import.meta.url));

describe('la copie de la bibliothèque Efièch', () => {
	it('n’a pas été retouchée sur place (modifier dans Depots/Efiech, puis synchroniser)', () => {
		const dossier = join(ici, 'biblio');
		const { empreintes } = JSON.parse(readFileSync(join(dossier, 'efiech-version.json'), 'utf8'));
		const fichiers = readdirSync(dossier).filter((f) => f.endsWith('.js')).sort();
		expect(fichiers).toEqual(Object.keys(empreintes).sort());
		for (const f of fichiers) {
			const t = readFileSync(join(dossier, f), 'utf8').replace(/\r\n/g, '\n');
			expect(createHash('sha256').update(t).digest('hex').slice(0, 16), f).toBe(empreintes[f]);
		}
	});
});

describe('ce qui est rangé dans la base', () => {
	it('se relit à l’identique', () => {
		const t = escriure({ mouvement: 'gravite', apparition: 'pluie', reglages: { nombre: 12 } }, FORMES.etoile);
		const r = legir(t);
		expect(r.config.mouvement).toBe('gravite');
		expect(r.config.reglages.nombre).toBe(12);
		expect(r.dessin.traces.length).toBe(1);
	});
	it('refuse un dessin piégé ou un texte illisible', () => {
		const piege = JSON.stringify({ config: { mouvement: 'chute' }, dessin: { vb: [0, 0, 1, 1], traces: [{ d: '<script>', f: '#000000' }] } });
		expect(legir(piege)).toBeNull();
		expect(legir('{pas du json')).toBeNull();
		expect(legir(null)).toBeNull();
	});
});

describe('les emplacements', () => {
	it('ont chacun un identifiant unique, et la couche n’est chargée que là où il faut', () => {
		const ids = EMPLACAMENTS.map((e) => e.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(efiechSurRoute('/aprene/modul/[modulId]')).toBe(true);
		expect(efiechSurRoute('/admin/efiechs')).toBe(false);
	});
});
