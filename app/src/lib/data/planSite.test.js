import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { PLAN, LO_LIGAM, AVIAT, RETIRATS, estAviat, estRetirat } from './planSite.js';

// Le plan du site range le menu, le pied de page et l'accueil. L'audit du 2026-11-07 y avait
// trouvé deux liens qui menaient à la page 404 (Articles et Fòrum). Romain a tranché (option 3) :
// Fòrum retiré du lancement, Articles affiché « Aviat » sans lien. Ce test empêche le retour d'un
// lien mort : toute entrée interne doit mener à une page qui existe, ou être marquée « aviat ».

const entrees = PLAN.flatMap((c) => c.grops.flatMap((g) => g.items)).concat(LO_LIGAM);
const route = (href) => `src/routes${href.split('#')[0].split('?')[0]}/+page.svelte`;

describe('plan du site', () => {
	it('ne mène à aucune page absente, sauf les entrées marquées « aviat »', () => {
		const morts = entrees
			.filter((it) => it.href.startsWith('/') && !it.aviat)
			.filter((it) => !existsSync(route(it.href)))
			.map((it) => it.href);
		expect(morts).toEqual([]);
	});

	it('marque « aviat » seulement des pages qui n’existent pas encore', () => {
		const dejaLa = entrees.filter((it) => it.aviat && existsSync(route(it.href))).map((it) => it.href);
		expect(dejaLa).toEqual([]);
	});

	it('affiche Articles « aviat » et ne propose plus le Fòrum', () => {
		expect(estAviat('/articles')).toBe(true);
		expect(estRetirat('/forum')).toBe(true);
		expect(entrees.some((it) => it.href === '/forum')).toBe(false);
	});

	it('ne retire que des liens absents du plan, et traduit « Aviat » dans les six langues', () => {
		expect(RETIRATS.filter((h) => entrees.some((it) => it.href === h))).toEqual([]);
		for (const l of ['oc', 'fr', 'es', 'en', 'ca', 'ar']) expect(AVIAT[l]).toBeTruthy();
	});
});
