import { describe, it, expect } from 'vitest';
import { segments, sensMarcas } from './marcat.js';

describe('balisage des textes modifiables', () => {
	it('laisse un texte sans marque tel quel', () => {
		expect(segments('Se parla.')).toEqual([{ t: 'Se parla.', aur: false, ital: false }]);
	});

	it('met en valeur ce qui est entre astérisques', () => {
		expect(segments('fa *ligam.*')).toEqual([
			{ t: 'fa ', aur: false, ital: false },
			{ t: 'ligam.', aur: true, ital: false }
		]);
	});

	it('met en italique ce qui est entre tirets bas', () => {
		expect(segments('Mots del _Lexic_, establit')).toEqual([
			{ t: 'Mots del ', aur: false, ital: false },
			{ t: 'Lexic', aur: false, ital: true },
			{ t: ', establit', aur: false, ital: false }
		]);
	});

	it('garde une marque isolée comme un caractère ordinaire', () => {
		expect(segments('2 * 3')).toEqual([{ t: '2 * 3', aur: false, ital: false }]);
		expect(sensMarcas('a_b')).toBe('a_b');
	});

	it('rend le texte sans marques pour les attributs', () => {
		expect(sensMarcas('fa *ligam* e _mai_')).toBe('fa ligam e mai');
	});
});
