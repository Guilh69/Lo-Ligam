import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { families, siteSections, externalLinks } from './siteSections.js';

// La navigation est la seule chose que TOUTES les pages partagent. Une
// entrée marquée « disponible » qui pointe vers une route inexistante
// donne une page 404 au visiteur, sans que rien ne casse au build.

describe('navigation du site', () => {
	it('donne un lien à chaque entrée marquée disponible', () => {
		const sansLien = siteSections.filter((s) => s.status === 'live' && !s.href).map((s) => s.id);
		expect(sansLien).toEqual([]);
	});

	it('pointe vers des routes qui existent réellement', () => {
		const introuvables = siteSections
			.filter((s) => s.status === 'live' && s.href?.startsWith('/'))
			.filter((s) => !existsSync(`src/routes${s.href === '/' ? '' : s.href}/+page.svelte`))
			.map((s) => s.href);
		expect(introuvables).toEqual([]);
	});

	it('n’expose aucune page de test ou de développement', () => {
		const suspectes = siteSections
			.filter((s) => /dev|test|tmp|brouillon/i.test(s.href || ''))
			.map((s) => s.href);
		expect(suspectes).toEqual([]);
	});

	it('traduit chaque famille et chaque entrée dans les deux langues', () => {
		const incompletes = [];
		for (const f of families) {
			if (!f.oc || !f.fr) incompletes.push(f.id);
			for (const i of f.items) {
				if (!i.oc || !i.fr) incompletes.push(i.id);
				if (!i.desc_oc || !i.desc_fr) incompletes.push(`${i.id} (description)`);
			}
		}
		expect(incompletes).toEqual([]);
	});

	it('n’utilise que des statuts connus', () => {
		const inconnus = siteSections
			.filter((s) => !['live', 'soon'].includes(s.status))
			.map((s) => `${s.id}: ${s.status}`);
		expect(inconnus).toEqual([]);
	});

	it('ne répète aucun identifiant d’entrée', () => {
		const ids = siteSections.map((s) => s.id);
		expect(ids.length).toBe(new Set(ids).size);
	});
});

describe('ressources externes', () => {
	it('utilise uniquement des adresses HTTPS', () => {
		const nonSecurisees = [];
		for (const l of externalLinks) {
			if (!l.href.startsWith('https://')) nonSecurisees.push(l.href);
			for (const t of l.tools ?? []) {
				if (!t.href.startsWith('https://')) nonSecurisees.push(t.href);
			}
		}
		expect(nonSecurisees).toEqual([]);
	});

	it('décrit chaque ressource dans les deux langues', () => {
		const incompletes = externalLinks
			.filter((l) => !l.desc_oc || !l.desc_fr)
			.map((l) => l.label);
		expect(incompletes).toEqual([]);
	});
});
