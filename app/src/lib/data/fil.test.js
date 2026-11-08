import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fil } from './fil.js';
import { PLAN } from './planSite.js';

const chemins = (f) => f.miettes.map((m) => m.href);

describe('fil d’Ariane : d’où l’on vient', () => {
	it('une rubrique ou l’accueil n’a rien au-dessus', () => {
		for (const c of ['/', '/parla', '/apren', '/amassa']) expect(fil(c), c).toBeNull();
	});

	it('une page du plan remonte à sa rubrique, qui porte son numéro', () => {
		const f = fil('/obras');
		expect(chemins(f)).toEqual(['/parla']);
		expect(f.miettes[0].n).toBe('01');
		expect(f.parent.href).toBe('/parla');
		expect(f.actuelle.oc).toBe('Òbras');
		expect(chemins(fil('/apren/visio'))).toEqual(['/apren']);
		expect(chemins(fil('/mots'))).toEqual(['/apren']);
		expect(chemins(fil('/ideas'))).toEqual(['/amassa']);
		expect(chemins(fil('/compte'))).toEqual(['/apren']);
		expect(chemins(fil('/aprene'))).toEqual(['/apren']);
	});

	it('une page d’un niveau de plus passe par son parent', () => {
		expect(chemins(fil('/medias/radios'))).toEqual(['/parla', '/medias']);
		expect(chemins(fil('/obras/cinema'))).toEqual(['/parla', '/obras']);
		const livre = fil('/medias/livres/pastre-1913');
		expect(chemins(livre)).toEqual(['/parla', '/medias', '/medias/livres']);
		expect(livre.parent.etiq.oc).toBe('Libres');
	});

	it('une fiche (page inconnue) remonte à la page connue la plus proche', () => {
		expect(chemins(fil('/cultura/une-fiche'))).toEqual(['/parla', '/cultura']);
		expect(chemins(fil('/apren/gramatica/articles'))).toEqual(['/apren', '/apren/gramatica']);
	});

	it('Mon istòria remonte à l’accueil ; une barre oblique finale ne change rien', () => {
		expect(chemins(fil('/istoria'))).toEqual(['/']);
		expect(fil('/istoria').actuelle.oc).toBe('Mon ligam amb l’occitan');
		expect(chemins(fil('/medias/radios/'))).toEqual(['/parla', '/medias']);
	});

	it('toutes les pages du plan ont un fil, et leur rubrique est au-dessus', () => {
		for (const r of PLAN)
			for (const it of r.grops.flatMap((g) => g.items)) {
				const f = fil(it.href);
				expect(f, it.href).not.toBeNull();
				expect(f.miettes[0].href, it.href).toBe(r.href);
			}
	});

	it('les parents cités existent comme pages du site', () => {
		for (const c of ['/obras/cinema', '/medias/radios', '/medias/livres/pastre-1913', '/istoria', '/apren/visio'])
			expect(existsSync(`src/routes${c}`), c).toBe(true);
	});
});
