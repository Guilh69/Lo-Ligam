import { describe, it, expect } from 'vitest';
import {
	cheminEnvoi,
	lireChemin,
	indexerListing,
	avancement,
	suivanteAFaire,
	garderPrise,
	depotMemoire,
	messageErreur
} from './studio.js';
import { totasLasFrasas, frasasDe } from './phrases.js';
import { moduls, ordre } from '../lesson/moduls/index.js';

const prise = (ext, type = 'audio/webm') => ({ blob: new Blob([new Uint8Array(10)], { type }), type, ext });

describe('chemin d’envoi', () => {
	it('<module>/<phrase>.<format>', () => {
		expect(cheminEnvoi('1-1/adieu', 'webm')).toBe('1-1/adieu.webm');
		expect(cheminEnvoi('pausa-1/d-0a1b2c3d', 'm4a')).toBe('pausa-1/d-0a1b2c3d.m4a');
	});
	it('refuse une clé ou une extension inattendue', () => {
		expect(() => cheminEnvoi('adieu', 'webm')).toThrow();
		expect(() => cheminEnvoi('1-1/adieu', 'exe')).toThrow();
	});
	it('chaque phrase du parcours a un chemin valide, et on sait le relire', () => {
		for (const f of totasLasFrasas()) {
			const c = cheminEnvoi(f.clau, 'ogg');
			expect(lireChemin(c)).toEqual({ clau: f.clau, ext: 'ogg' });
		}
	});
	it('ce qui n’est pas une prise est ignoré', () => {
		expect(lireChemin('1-1/adieu.txt')).toBeNull();
		expect(lireChemin('1-1/sous/adieu.webm')).toBeNull();
		expect(lireChemin('adieu.webm')).toBeNull();
	});
});

describe('avancement à partir du listing', () => {
	const modules = [
		{ slug: 'a', frasas: [{ clau: 'a/x' }, { clau: 'a/y' }, { clau: 'a/z' }] },
		{ slug: 'b', frasas: [{ clau: 'b/u' }] }
	];
	it('compte chaque phrase une fois, même en deux formats ; ignore les fichiers étrangers', () => {
		const index = indexerListing(['a/x.webm', 'a/x.m4a', 'a/z.ogg', 'a/vieille.webm', '_ensag/t.webm', 'b/notes.txt']);
		expect(index.get('a/x')).toEqual(['a/x.webm', 'a/x.m4a']);
		const av = avancement(modules, index);
		expect(av).toEqual({ faites: 2, total: 4, parModule: { a: { faites: 2, total: 3 }, b: { faites: 0, total: 1 } } });
	});
	it('les 38 modules font 768 phrases', () => {
		const tous = ordre.map((slug) => ({ slug, frasas: frasasDe(moduls[slug]) }));
		expect(tous).toHaveLength(38);
		expect(avancement(tous, new Map()).total).toBe(768);
	});
	it('phrase suivante à faire : après la position, en faisant le tour', () => {
		const f = modules[0].frasas;
		const index = indexerListing(['a/y.webm']);
		expect(suivanteAFaire(f, index)).toBe(0);
		expect(suivanteAFaire(f, index, 0)).toBe(2);
		expect(suivanteAFaire(f, index, 2)).toBe(0);
		expect(suivanteAFaire(f, indexerListing(['a/x.webm', 'a/y.webm', 'a/z.webm']), 1)).toBe(-1);
	});
});

describe('garder une prise', () => {
	it('envoie au bon chemin, en remplaçant le même format', async () => {
		const depot = depotMemoire({ initial: ['1-1/adieu.webm'] });
		const chemins = await garderPrise(depot, '1-1/adieu', prise('webm'), ['1-1/adieu.webm']);
		expect(chemins).toEqual(['1-1/adieu.webm']);
		expect(depot.fichiers.get('1-1/adieu.webm').size).toBe(10);
	});
	it('refaite depuis un autre appareil : l’ancien format est supprimé', async () => {
		const depot = depotMemoire({ initial: ['1-1/adieu.m4a', '1-1/autre.webm'] });
		const chemins = await garderPrise(depot, '1-1/adieu', prise('webm'), ['1-1/adieu.m4a']);
		expect(chemins).toEqual(['1-1/adieu.webm']);
		expect([...depot.fichiers.keys()].sort()).toEqual(['1-1/adieu.webm', '1-1/autre.webm']);
	});
	it('coupure réseau : l’erreur remonte, rien n’est supprimé, et Réessayer passe', async () => {
		let pannes = 1;
		const depot = depotMemoire({ initial: ['1-1/adieu.m4a'], panne: () => pannes-- > 0 });
		const p = prise('webm');
		const erreur = await garderPrise(depot, '1-1/adieu', p, ['1-1/adieu.m4a']).catch((e) => e);
		expect(messageErreur(erreur)).toMatch(/Réessayer/);
		expect([...depot.fichiers.keys()]).toEqual(['1-1/adieu.m4a']);
		expect(await garderPrise(depot, '1-1/adieu', p, ['1-1/adieu.m4a'])).toEqual(['1-1/adieu.webm']);
	});
	it('le listing du dépôt rend les chemins du module', async () => {
		const depot = depotMemoire({ initial: ['1-1/b.webm', '1-1/a.ogg', '1-2/c.webm'] });
		expect(await depot.lister('1-1')).toEqual(['1-1/a.ogg', '1-1/b.webm']);
	});
});

describe('messages d’erreur', () => {
	it('distingue droits, format et dossier absent', () => {
		expect(messageErreur({ message: 'new row violates row-level security policy' })).toMatch(/administrateur/);
		expect(messageErreur({ message: 'mime type text/plain is not supported' })).toMatch(/format ou taille/);
		expect(messageErreur({ message: 'Bucket not found' })).toMatch(/supabase-voix\.sql/);
	});
});
