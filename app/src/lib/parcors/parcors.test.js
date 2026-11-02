import { describe, it, expect } from 'vitest';
import { camin, estatParcors, comptarBits, simular, seguentaClavada, numero, glosaCorta, NIVELS } from './parcors.js';
import { contrast, nuanças, UNITATS, AUR, teula } from './colors.js';
import { moduls, ordre } from '$lib/lesson/moduls/index.js';

const etapas = camin(moduls, ordre);
const totalModuls = ordre.length;

describe('parcours : le chemin tiré du registre', () => {
	it('suit l’ordre du registre, module par module', () => {
		expect(etapas.flatMap((e) => e.moduls.map((m) => m.id))).toEqual(ordre);
	});

	it('l’A1 : module 0, huit unités de quatre modules, quatre haltes, la mission', () => {
		expect(etapas[0].tipe).toBe('partença');
		const unitats = etapas.filter((e) => e.tipe === 'unitat');
		expect(unitats.map((e) => e.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		expect(unitats.every((e) => e.moduls.length === 4)).toBe(true);
		expect(etapas.filter((e) => e.tipe === 'pausa').map((e) => e.numero)).toEqual([1, 2, 3, 4]);
		expect(etapas.at(-1).tipe).toBe('mission');
	});

	it('deux blòcs : unités 1 à 4 avec les haltes 1 et 2, puis 5 à 8, haltes 3 et 4 et mission', () => {
		const n = (e) => e.bloc?.n ?? null;
		expect(n(etapas[0])).toBe(null);
		const unitat = (k) => etapas.find((e) => e.tipe === 'unitat' && e.numero === k);
		const pausa = (k) => etapas.find((e) => e.tipe === 'pausa' && e.numero === k);
		expect([1, 2, 3, 4].map((k) => n(unitat(k)))).toEqual([1, 1, 1, 1]);
		expect([5, 6, 7, 8].map((k) => n(unitat(k)))).toEqual([2, 2, 2, 2]);
		expect([1, 2, 3, 4].map((k) => n(pausa(k)))).toEqual([1, 1, 2, 2]);
		expect(n(etapas.at(-1))).toBe(2);
		expect(unitat(1).bloc.oc).toBe('Ieu e los meus');
	});

	it('glose courte : la traduction du titre seule', () => {
		expect(glosaCorta('Comment vas-tu ? Saluer, demander comment ça va, partir')).toBe('Comment vas-tu ?');
		expect(glosaCorta('Halte 1 : réemploi des unités 1 et 2, puis bilan')).toBe('Halte 1');
		expect(glosaCorta('Mission A1 au format du DCL (lire, écouter, parler, écrire)')).toBe('Mission A1 au format du DCL');
		expect(glosaCorta('Bienvenue dans le monde occitan')).toBe('Bienvenue dans le monde occitan');
	});

	it('numéros des modules', () => {
		expect(numero('0')).toBe('0');
		expect(numero('2-3')).toBe('2.3');
		expect(numero('pausa-1')).toBe('');
		expect(numero('mission-a1')).toBe('');
	});

	it('six niveaux, l’A1 en deux blòcs', () => {
		expect(NIVELS.map((n) => n.id)).toEqual(['A1', 'A2', 'B1.1', 'B1.2', 'B2', 'C1']);
		expect(NIVELS[0].blocs).toBe(2);
	});
});

describe('parcours : avancement et déblocage pas à pas', () => {
	it('compte les étapes faites dans le masque de la page module', () => {
		expect(comptarBits(0)).toBe(0);
		expect(comptarBits(0b101)).toBe(2);
		expect(comptarBits(63)).toBe(6);
		expect(comptarBits(undefined)).toBe(0);
	});

	it('au départ : seul le module 0 est ouvert, c’est lui qu’on continue', () => {
		const p = estatParcors(etapas, {});
		const tots = p.etapas.flatMap((e) => e.moduls);
		expect(tots[0].estat).toBe('dobert');
		expect(tots.slice(1).every((m) => m.estat === 'clavat')).toBe(true);
		expect(p.actual.id).toBe('0');
		expect(p.modulsFachs).toBe(0);
		expect(p.totalModuls).toBe(totalModuls);
		expect(p.bloc.n).toBe(1);
	});

	it('un module fini ouvre le suivant, et seulement lui', () => {
		const p = estatParcors(etapas, simular(etapas, 3));
		const tots = p.etapas.flatMap((e) => e.moduls);
		expect(tots.slice(0, 3).every((m) => m.estat === 'fach')).toBe(true);
		expect(tots[3].estat).toBe('en-cors');
		expect(tots[3].fachas).toBe(2);
		expect(tots[4].estat).toBe('clavat');
		expect(p.actual.id).toBe('1-3');
		expect(p.modulsFachs).toBe(3);
	});

	it('un module commencé reste ouvert, même si le précédent ne l’est pas fini', () => {
		const p = estatParcors(etapas, { 'modul-0': 6, 'modul-1-3': 1 });
		const m = (id) => p.etapas.flatMap((e) => e.moduls).find((x) => x.id === id);
		expect(m('1-1').estat).toBe('dobert');
		expect(m('1-2').estat).toBe('clavat');
		expect(m('1-3').estat).toBe('en-cors');
		expect(p.actual.id).toBe('1-1');
	});

	it('l’étape suivante fermée et ce qui l’ouvre', () => {
		// module 0 et 1.1 à 1.3 finis, 1.4 commencé : l'unité 2 attend la fin de l'unité 1
		const p = estatParcors(etapas, simular(etapas, 4));
		const s = seguentaClavada(p);
		expect(s.precedenta.numero).toBe(1);
		expect(s.etapa.numero).toBe(2);
	});

	it('tout fini : plus de module à continuer, le dernier blòc', () => {
		const p = estatParcors(etapas, simular(etapas, totalModuls));
		expect(p.actual).toBe(null);
		expect(p.modulsFachs).toBe(totalModuls);
		expect(p.percent).toBe(100);
		expect(p.bloc.n).toBe(2);
		expect(seguentaClavada(p)).toBe(null);
	});

	it('un nombre d’étapes trop grand ou absurde ne casse rien', () => {
		const p = estatParcors(etapas, { 'modul-0': 99, 'modul-1-1': 'x' });
		expect(p.etapas[0].moduls[0].fachas).toBe(p.etapas[0].moduls[0].etapas);
		expect(p.actual.id).toBe('1-1');
	});
});

describe('parcours : couleurs lisibles', () => {
	it('chaque nuance des unités et l’or tiennent 4,5:1 avec leur texte', () => {
		for (const c of [...UNITATS, AUR])
			for (const [fons, tinta] of [...nuanças(c), teula(c)]) expect(contrast(fons, tinta)).toBeGreaterThanOrEqual(4.5);
	});
});
