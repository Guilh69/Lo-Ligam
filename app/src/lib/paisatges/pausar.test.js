// Les mots posés par Romain dans Triar (lot « pausar », 07-11) : la comparaison
// avec le code et l'écriture dans paisatges.js, essayées sur le vrai fichier
// (en mémoire : le fichier du projet n'est pas touché).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PAISATGES, MOTS } from './paisatges.js';
import { cle, diferéncias, escriure } from './pausar.js';

const p = PAISATGES[0];
const nous = [
	[p.mots[0][0], MOTS[p.mots[0][0]], 0.3, 0.7], // déplacé
	["l'aiga", 'l’eau', 0.8, 0.2], // apostrophe droite : connu quand même
	['lo cat fòl', 'le chat fou', 0.5, 0.45] // nouveau
];

describe('poser les mots : comparer', () => {
	it('dit ce qui est déplacé, ajouté, retiré, nouveau', () => {
		const l = diferéncias(p, nous, MOTS).join('\n');
		expect(l).toContain(`~ ${p.mots[0][0]} déplacé`);
		expect(l).toContain('+ lo cat fòl (le chat fou)');
		expect(l).toContain('mot nouveau, écrit à la main : lo Congrès');
		expect(l).not.toMatch(/l'aiga.*mot nouveau/);
		for (const [oc] of p.mots.slice(1)) expect(l).toContain(`− ${oc} retiré`);
		expect(cle(" l'illa ")).toBe('l’illa');
	});

	it('signale deux points trop proches et une photo trop pauvre', () => {
		const l = diferéncias(p, [['la mar', 'la mer', 0.5, 0.5], ['la ròca', 'le rocher', 0.52, 0.5]], MOTS).join('\n');
		expect(l).toContain('trop proches');
		expect(l).toContain('3 au moins');
	});
});

describe('poser les mots : écrire', () => {
	it('le fichier réécrit se charge, avec les nouveaux mots et rien d’autre de changé', () => {
		const F = 'src/lib/paisatges/paisatges.js'; // les tests tournent depuis app/
		const vielh = readFileSync(F, 'utf8');
		const { t, novèls } = escriure(vielh, p, nous, MOTS, 'essai');
		expect(novèls.map((m) => m[0])).toEqual(['lo cat fòl']);
		// le module réécrit, chargé sans passer par un fichier (il n'importe rien)
		const m = new Function(t.replace(/^export const /gm, 'const ') + '\nreturn { PAISATGES, MOTS };')();
		expect(m.PAISATGES.find((x) => x.clau === p.clau).mots).toEqual([
			[p.mots[0][0], 0.3, 0.7],
			['l’aiga', 0.8, 0.2],
			['lo cat fòl', 0.5, 0.45]
		]);
		expect(m.MOTS['lo cat fòl']).toBe('le chat fou');
		expect(Object.keys(m.MOTS).length).toBe(Object.keys(MOTS).length + 1);
		for (const x of PAISATGES.slice(1)) expect(m.PAISATGES.find((y) => y.clau === x.clau).mots, x.clau).toEqual(x.mots);
	});
});
