import { describe, it, expect } from 'vitest';
import { FAMILLES, ETAGES, STATUTS, OUVERTS, TOUS, compter, choix, bloquants, debloque, afaire } from './registre.js';
import { COMPLEMENTS } from './registre-options.js';
import { ESSAIS, ESSAIS_CACHES, CODE_MORT } from './registre-essais.js';

describe('registre des choix de design', () => {
	it('chaque clé est unique (elle retrouvera le choix de Romain)', () => {
		const claus = TOUS.map((c) => c.clau);
		expect(new Set(claus).size).toBe(claus.length);
	});

	it('chaque choix a un état connu, un titre, une question et un étage', () => {
		const etages = ETAGES.map((e) => e.id);
		for (const c of TOUS) {
			expect(Object.keys(STATUTS)).toContain(c.statut);
			expect(c.titol.length).toBeGreaterThan(2);
			expect(c.question.length).toBeGreaterThan(10);
			expect(etages, c.clau).toContain(c.etage);
		}
	});

	it('un choix retenu dit quoi et d’où cela vient', () => {
		for (const c of TOUS.filter((x) => x.statut === 'retenu')) {
			expect(c.retenu?.texte, c.clau).toBeTruthy();
			expect(c.retenu?.source, c.clau).toBeTruthy();
		}
	});

	it('un choix « en place » dit ce que fait le site, avec des fichiers en preuve et une date de vérification', () => {
		for (const c of TOUS.filter((x) => x.statut === 'enplace')) {
			expect(c.aujourdhui?.texte, c.clau).toBeTruthy();
			expect(c.aujourdhui?.preuve?.length, c.clau).toBeGreaterThan(0);
			expect(c.aujourdhui?.verifie, c.clau).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});

	it('un choix archivé dit pourquoi', () => {
		for (const c of TOUS.filter((x) => x.statut === 'archive')) {
			expect(c.archive?.raison, c.clau).toBeTruthy();
			expect(c.archive?.date, c.clau).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});

	it('un choix ouvert a des options (au moins deux s’il reste à explorer) ; en comparaison, un essai au moins', () => {
		for (const c of TOUS.filter((x) => OUVERTS.includes(x.statut))) {
			expect(c.options.length, c.clau).toBeGreaterThan(0);
			if (c.statut === 'explorer') expect(c.options.length, c.clau).toBeGreaterThanOrEqual(2);
			if (c.statut === 'comparaison') expect(c.options.some((o) => o.essai), c.clau).toBe(true);
			for (const o of c.options) {
				expect(o.titol, c.clau).toBeTruthy();
				expect(o.texte, c.clau).toBeTruthy();
			}
		}
	});

	it('les compléments ne visent que des clés qui existent, ouvertes ou en place (« ou changer pour »)', () => {
		for (const k of Object.keys(COMPLEMENTS)) {
			expect(choix(k), k).toBeTruthy();
			expect([...OUVERTS, 'enplace'], k).toContain(choix(k).statut);
		}
	});

	it('les essais pointent vers une page de ce site, les écartés ont une raison', () => {
		for (const c of TOUS) {
			for (const e of c.essais ?? []) expect(e.chemin, c.clau).toMatch(/^\/[a-z0-9\-/]+$/);
			for (const o of c.options) if (o.essai) expect(o.essai, c.clau).toMatch(/^\/[a-z0-9\-/]+$/);
			for (const x of c.ecartes ?? []) {
				expect(x.titol, c.clau).toBeTruthy();
				expect(x.raison, c.clau).toBeTruthy();
			}
		}
	});

	it('les dépendances visent des choix qui existent, sans cycle', () => {
		for (const c of TOUS) for (const k of c.apres) expect(choix(k), `${c.clau} → ${k}`).toBeTruthy();
		for (const c of TOUS) expect(debloque(c.clau).map((x) => x.clau), c.clau).not.toContain(c.clau);
	});

	it('« À faire maintenant » ne contient que des choix ouverts et non bloqués, les plus débloquants d’abord', () => {
		const liste = afaire();
		expect(liste.length).toBeGreaterThan(0);
		for (const { c } of liste) {
			expect(OUVERTS).toContain(c.statut);
			expect(bloquants(c)).toHaveLength(0);
		}
		for (let i = 1; i < liste.length; i++) expect(liste[i - 1].debloque).toBeGreaterThanOrEqual(liste[i].debloque);
	});

	it('un choix en place est tenu pour validé : il n’est plus à faire et ne bloque rien (« une seule porte », 12-11)', () => {
		expect(choix('palette-claire').statut).toBe('enplace');
		expect(OUVERTS).not.toContain('enplace');
		expect(bloquants(choix('couleurs-retour')).map((c) => c.clau)).not.toContain('palette-claire');
		expect(afaire().map(({ c }) => c.clau)).not.toContain('palette-claire');
	});

	it('le bouton principal est retenu comme pièce de papier, pas comme pilule (audit du 07-11)', () => {
		const c = choix('bouton-principal');
		expect(c.statut).toBe('retenu');
		expect(c.retenu.texte).toMatch(/papier/);
		expect(c.ecartes.map((x) => x.titol).join(' ')).toMatch(/Pilule/);
	});

	it('le décompte additionne tous les choix actifs et compte les archivés à part', () => {
		const n = compter();
		expect(n.explorer + n.enplace + n.comparaison + n.retenu).toBe(n.total);
		expect(n.total + n.archive).toBe(FAMILLES.reduce((s, f) => s + f.choix.length, 0));
	});

	it('aucun tiret long dans les textes du registre', () => {
		expect(JSON.stringify([FAMILLES, ESSAIS, ESSAIS_CACHES, CODE_MORT])).not.toMatch(/[—–]/);
	});
});

describe('pages d’essai', () => {
	it('chaque page vise un choix qui existe, avec un état et une suite connus', () => {
		const chemins = new Set();
		for (const e of ESSAIS) {
			expect(chemins.has(e.chemin), e.chemin).toBe(false);
			chemins.add(e.chemin);
			expect(e.chemin).toMatch(/^\/ensag\/[a-z0-9-]+$/);
			expect(choix(e.choix), e.chemin).toBeTruthy();
			expect(['actif', 'adopte', 'obsolete', 'confirmer']).toContain(e.etat);
			expect(['oui', 'attendre', 'non']).toContain(e.pret);
			expect(e.raison.length).toBeGreaterThan(10);
			expect(e.suppression.length).toBeGreaterThan(10);
		}
	});

	it('les 24 pages d’essai de l’audit du 07-11 (celles du 12-11 tranchées le jour même) et les trois essais recensés le 12-11, moins les cinq retirés le 12-11 au soir, moins les neuf retirés le 13-11 (huit essais de couleur et la carte au défilement), plus les photos vues en occitan recensées le 13-11', () => {
	expect(ESSAIS).toHaveLength(14);
	});
});
