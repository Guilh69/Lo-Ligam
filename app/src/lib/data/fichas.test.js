import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { categories, fichas, fichasPerCategoria } from './fichas.js';

// Ce catalogue est le repli utilisé quand la base ne répond pas. S'il se
// désynchronise des fichiers réellement présents, le site affiche des
// images cassées sans que rien ne prévienne — c'est exactement le genre
// de panne silencieuse que ces tests existent pour attraper.

describe('catalogue des fiches', () => {
	it('ne contient aucun identifiant en double', () => {
		const vus = new Map();
		const doublons = [];
		for (const f of fichas) {
			if (vus.has(f.id)) doublons.push(f.id);
			vus.set(f.id, true);
		}
		expect(doublons).toEqual([]);
	});

	it('rattache chaque fiche à une catégorie qui existe', () => {
		const connues = new Set(categories.map((c) => c.id));
		const orphelines = fichas.filter((f) => !connues.has(f.cat)).map((f) => f.id);
		expect(orphelines).toEqual([]);
	});

	it('donne un titre non vide à chaque fiche', () => {
		const sansTitre = fichas.filter((f) => !f.titre || !f.titre.trim()).map((f) => f.id);
		expect(sansTitre).toEqual([]);
	});

	it('ne laisse aucune scorie d’export Canva dans les titres', () => {
		const scories = fichas.filter((f) => /copie/i.test(f.titre)).map((f) => f.titre);
		expect(scories).toEqual([]);
	});

	it('pointe vers des images qui existent vraiment sur le disque', () => {
		const manquantes = [];
		for (const f of fichas) {
			for (const chemin of [f.mini, f.grand]) {
				if (!existsSync(`static${chemin}`)) manquantes.push(chemin);
			}
		}
		expect(manquantes).toEqual([]);
	});

	it('donne une couleur à chaque catégorie', () => {
		const sansCouleur = categories.filter((c) => !c.color).map((c) => c.id);
		expect(sansCouleur).toEqual([]);
	});

	it('traduit chaque catégorie dans les deux langues', () => {
		const incompletes = categories.filter((c) => !c.oc || !c.fr).map((c) => c.id);
		expect(incompletes).toEqual([]);
	});

	it('filtre correctement par catégorie', () => {
		const cible = categories[0].id;
		const filtrees = fichasPerCategoria(cible);
		expect(filtrees.length).toBeGreaterThan(0);
		expect(filtrees.every((f) => f.cat === cible)).toBe(true);
		expect(fichasPerCategoria('all').length).toBe(fichas.length);
	});
});
