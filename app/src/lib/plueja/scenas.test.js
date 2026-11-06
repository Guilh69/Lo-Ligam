// Pluie de mots : les mots des unités ont une seule source, les leçons
// (consolidation du 2026-11-05). Chaque mot porte l'id d'une chose apprise
// (encadré « À retenir ») de son unité, et sa forme montrée figure dans cette
// chose (ou dans ses exemples). Si une leçon change, ce test le dit.
import { describe, it, expect } from 'vitest';
import { SCENAS, motsDelQuasernet } from './scenas.js';
import { listerChoses } from '$lib/carnet/choses.js';
import { idCarte } from '$lib/carnet/regles.js';

const choses = listerChoses();
const norm = (s) =>
	s
		.replace(/[*_]/g, '')
		.replace(/[’']/g, '’')
		.replace(/[!?.…,;:¡¿]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();

describe('pluie de mots : les unités suivent les leçons', () => {
	const unitats = SCENAS.filter((s) => s.grop === 'unitat');

	it('il y a bien huit unités', () => {
		expect(unitats.map((s) => s.id)).toEqual(['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8']);
	});

	for (const s of unitats) {
		it(`${s.id} : chaque mot renvoie à une chose apprise de l’unité`, () => {
			const deLUnitat = new Map(choses.filter((c) => c.modul.startsWith(`${s.numero}-`)).map((c) => [c.id, c]));
			for (const [oc, fr, id] of s.mots) {
				expect(id, `${oc} : pas d’id`).toBeTruthy();
				const c = deLUnitat.get(id);
				expect(c, `${oc} : l’id ${id} n’est pas dans l’unité ${s.numero}`).toBeTruthy();
				const ouSeTrouve = norm(`${c.oc} ${c.fr}`);
				expect(ouSeTrouve.includes(norm(oc)), `${oc} ne figure pas dans « ${c.oc} »`).toBe(true);
				expect(fr.trim(), `${oc} : définition vide`).not.toBe('');
			}
		});
	}

	it('les ambiances poétiques n’ont pas d’id (elles ne viennent pas des leçons)', () => {
		for (const s of SCENAS.filter((s) => s.grop === 'poesia')) for (const m of s.mots) expect(m.length).toBe(2);
	});

	it('« Tos mots » : les mots du carnet, ceux à revoir d’abord, sans doublon', () => {
		expect(motsDelQuasernet({})).toEqual([]);
		const cartes = {
			[idCarte('oc-non', 'reconnais')]: {},
			[idCarte('oc-non', 'produis')]: {},
			[idCarte('la-poma', 'reconnais')]: {},
			[idCarte('chose-sans-mot', 'reconnais')]: {}
		};
		const l = motsDelQuasernet(cartes, [idCarte('la-poma', 'reconnais')]);
		expect(l.map(([oc]) => oc)).toEqual(['la poma', 'Òc !', 'Non !']);
		for (const m of l) expect(m).toHaveLength(3);
	});

	it('aucun mot en double dans une même ambiance', () => {
		for (const s of SCENAS) {
			const vus = s.mots.map(([oc]) => oc);
			expect(new Set(vus).size, s.id).toBe(vus.length);
		}
	});
});

describe('fonds photo de Remira', () => {
	it('chaque fond a ses deux largeurs, la grande étant celle de la photo', async () => {
		const { existsSync } = await import('node:fs');
		const { fotoCamin } = await import('./scenas.js');
		for (const s of SCENAS) {
			if (!s.imatge) continue;
			expect(s.imatge.amples.at(-1), s.id).toBe(s.imatge.l);
			for (const a of s.imatge.amples) expect(existsSync(`static${fotoCamin(s.imatge, a)}`), `${s.id} ${a}`).toBe(true);
		}
	});
});
