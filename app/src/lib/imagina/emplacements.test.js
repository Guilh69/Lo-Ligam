import { describe, it, expect } from 'vitest';
import { codar, descodar, frasa, zonaNeta, pronGranda, NATURAS, PAGINA } from './emplacements.js';
import { PAISATGES } from '../paisatges/paisatges.js';

describe('emplacements dessinés sur les photos', () => {
	it('remet un rectangle dans l’ordre et dans la photo', () => {
		expect(zonaNeta([0.6, 0.5, 0.2, 0.1])).toEqual([0.2, 0.1, 0.6, 0.5]);
		expect(zonaNeta([-0.2, 0.33333333, 1.4, 0.9])).toEqual([0, 0.3333, 1, 0.9]);
	});

	it('refuse un simple clic', () => {
		expect(pronGranda([0.2, 0.2, 0.205, 0.4])).toBe(false);
		expect(pronGranda([0.2, 0.2, 0.3, 0.26])).toBe(true);
	});

	it('code puis décode sans rien perdre', () => {
		const e = { foto: 'vila-carriera', zona: [0.312, 0.401, 0.455, 0.498], natura: 'placa' };
		expect(descodar(codar(e))).toEqual(e);
	});

	it('la ligne tient dans le champ de la base (une ligne, 300 caractères)', () => {
		for (const p of PAISATGES)
			for (const n of NATURAS) {
				const c = codar({ foto: p.clau, zona: [0.1234, 0.2345, 0.9876, 0.8765], natura: n.id });
				expect(c.length).toBeLessThanOrEqual(300);
				// eslint-disable-next-line no-control-regex
				expect(/[\u0000-\u001f]/.test(c)).toBe(false);
			}
	});

	it('toutes les photos proposées ont une clé acceptée', () => {
		for (const p of PAISATGES) expect(() => codar({ foto: p.clau, zona: [0, 0, 1, 1], natura: 'autre' })).not.toThrow();
	});

	it('rejette ce qui n’est pas un emplacement', () => {
		expect(descodar(null)).toBe(null);
		expect(descodar('une note ordinaire')).toBe(null);
		expect(descodar('foto=vila zona=0.5,0.5,0.2,0.9 natura=placa')).toBe(null);
		expect(descodar('foto=vila zona=0.1,0.1,0.2,1.9 natura=placa')).toBe(null);
		expect(descodar('foto=vila zona=0.1,0.1,0.2,0.9 natura=tank')).toBe(null);
		expect(() => codar({ foto: 'Vila Bad', zona: [0, 0, 1, 1], natura: 'placa' })).toThrow();
	});

	it('porte le style et les quatre coins de la forme couchée sur le mur', () => {
		const e = {
			foto: 'vila-ruela',
			zona: [0.808, 0.5175, 0.842, 0.5425],
			natura: 'placa',
			estil: 'montpelhier',
			quad: [
				[0.8095, 0.5119],
				[0.8436, 0.524],
				[0.8429, 0.5509],
				[0.8089, 0.5352]
			]
		};
		const c = codar(e);
		expect(c).toBe('foto=vila-ruela zona=0.808,0.5175,0.842,0.5425 natura=placa estil=montpelhier quad=0.8095,0.5119,0.8436,0.524,0.8429,0.5509,0.8089,0.5352');
		expect(descodar(c)).toEqual(e);
		// un coin peut sortir un peu de la photo, la ligne reste courte
		const bord = codar({ ...e, quad: [[-0.0312, 0.1], [1.2, -0.04], [1.21, 0.5], [-0.02, 0.6]] });
		expect(descodar(bord).quad[0]).toEqual([-0.0312, 0.1]);
		for (const p of PAISATGES) expect(codar({ ...e, foto: p.clau, estil: 'bendel-escur', quad: [[-0.1234, -0.1234], [1.1234, -0.1234], [1.1234, 1.1234], [-0.1234, 1.1234]] }).length).toBeLessThanOrEqual(300);
		// les demandes d'avant (ni style ni coins) se lisent toujours
		expect(descodar('foto=vila-ruela zona=0.1,0.1,0.2,0.2 natura=placa')).toEqual({ foto: 'vila-ruela', zona: [0.1, 0.1, 0.2, 0.2], natura: 'placa' });
		expect(descodar('foto=vila-ruela zona=0.1,0.1,0.2,0.2 natura=placa estil=inconnu')).toBe(null);
		expect(descodar('foto=vila-ruela zona=0.1,0.1,0.2,0.2 natura=placa estil=esmalt quad=0.1,0.1,0.2')).toBe(null);
		expect(() => codar({ ...e, estil: 'inconnu' })).toThrow();
		expect(() => codar({ ...e, quad: [[0, 0]] })).toThrow();
	});

	it('dit la demande en clair', () => {
		expect(frasa({ foto: 'vila-ruela', natura: 'placa', estil: 'esmalt', perspectiva: 'calculée sur les lignes du mur', text: 'Carrièra de la Lòtja', nota: '' })).toBe(
			'Emplacement dessiné sur la photo « vila-ruela » : plaque de rue. Style : émail bleu, lettres blanches. Perspective : calculée sur les lignes du mur. Texte imaginé : « Carrièra de la Lòtja ».'
		);
		expect(frasa({ foto: 'vila-carriera', natura: 'ensenha', text: ' Pharmacie ', nota: '' })).toBe(
			'Emplacement dessiné sur la photo « vila-carriera » : enseigne de commerce. Texte imaginé : « Pharmacie ».'
		);
		expect(frasa({ foto: 'vila-carriera', natura: 'placa', text: '', nota: 'le vrai nom de la rue' })).toContain('Pas de texte donné. Précision : le vrai nom de la rue');
		expect(PAGINA.startsWith('/')).toBe(true);
	});
});
