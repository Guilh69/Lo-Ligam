import { describe, it, expect, beforeEach } from 'vitest';
import { decouper, raisonNonCherche, motsACercar, morceaux, memesMots } from './mots.js';
import { TOUCHES, inserir } from './accents.js';
import { phraseSuivante, estatMot, resumir, annonce } from './sesilha.js';
import { verificar, oublier } from './verificacion.js';
import { FRASAS, TEMAS } from './frasas.js';

describe('découpage en mots', () => {
	it('sépare apostrophes, traits d’union et ponctuation', () => {
		const t = decouper('L’ostal d’en Joan, dona-me aiga !');
		expect(t.map((x) => x.mot)).toEqual(['l', 'ostal', 'd', 'en', 'joan', 'dona', 'me', 'aiga']);
		expect(t[0].elision).toBe(true);
		expect(t[1].elision).toBe(false);
	});
	it('accepte l’apostrophe droite et garde les majuscules à l’affichage', () => {
		const t = decouper("M'agrada Tolosa");
		expect(t.map((x) => x.brut)).toEqual(['M', 'agrada', 'Tolosa']);
		expect(t[2].mot).toBe('tolosa');
	});
	it('garde le point intérieur dans le mot', () => {
		expect(decouper('un n·hèr').map((x) => x.mot)).toEqual(['un', 'n·hèr']);
		expect(raisonNonCherche(decouper('n·hèr')[0])).toBe('interne');
	});
	it('normalise les accents décomposés et ignore chiffres et vide', () => {
		expect(decouper('cossí 12 ?').map((x) => x.mot)).toEqual(['cossí']);
		expect(decouper('')).toEqual([]);
		expect(decouper(null)).toEqual([]);
	});
	it('ne cherche pas élisions, mots courts et mots outils ; cherche le reste une fois', () => {
		const t = decouper('Lo gat e lo gat d’en Pèire dòrm');
		expect(motsACercar(t)).toEqual(['gat', 'pèire', 'dòrm']);
		expect(raisonNonCherche(decouper('d’')[0])).toBe('elision');
		expect(raisonNonCherche(decouper('lo')[0])).toBe('court');
		expect(raisonNonCherche(decouper('los')[0])).toBe('outil');
		expect(raisonNonCherche(decouper('dòrm')[0])).toBe(null);
	});
	it('redécoupe la phrase en gardant ponctuation et espaces', () => {
		const m = morceaux('Ont es l’ostal ?');
		expect(m.map((x) => x.texte).join('')).toBe('Ont es l’ostal ?');
		expect(m.filter((x) => x.token).length).toBe(4);
	});
	it('compare deux phrases sans la casse ni la ponctuation', () => {
		expect(memesMots('prepari lo sopar', 'Prepari lo sopar.')).toBe(true);
		expect(memesMots('prepari lo dinnar', 'Prepari lo sopar.')).toBe(false);
		expect(memesMots('', '')).toBe(false);
	});
});

describe('touches d’accents', () => {
	it('contient les touches demandées', () => {
		expect(TOUCHES).toEqual(['à', 'è', 'ò', 'á', 'é', 'í', 'ó', 'ú', 'ï', 'ü', 'ç', '·']);
	});
	it('insère au curseur', () => {
		expect(inserir('cossi', 5, 5, 'í')).toEqual({ valeur: 'cossií', curseur: 6 });
		expect(inserir('bonjorn', 0, 0, 'à')).toEqual({ valeur: 'àbonjorn', curseur: 1 });
	});
	it('remplace la sélection, majuscule possible', () => {
		expect(inserir('abcde', 1, 3, 'ò')).toEqual({ valeur: 'aòde', curseur: 2 });
		expect(inserir('a', 1, 1, 'è', true)).toEqual({ valeur: 'aÈ', curseur: 2 });
		expect(inserir('n', 1, 1, '·', true).valeur).toBe('n·');
	});
	it('reste dans les bornes', () => {
		expect(inserir('ab', 9, 20, 'ç').valeur).toBe('abç');
		expect(inserir('', undefined, undefined, 'ü')).toEqual({ valeur: 'ü', curseur: 1 });
	});
});

describe('phrase suivante', () => {
	const ps = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
	it('ne rend jamais la courante ni une phrase déjà vue', () => {
		const r = phraseSuivante(ps, 'a', ['a', 'b'], () => 0.99);
		expect(r.phrase.id).toBe('c');
		expect(r.vues).toEqual(['a', 'b', 'c']);
	});
	it('recommence le tour quand tout a été vu', () => {
		const r = phraseSuivante(ps, 'c', ['a', 'b', 'c'], () => 0);
		expect(r.phrase.id).toBe('a');
		expect(r.vues).toEqual(['c', 'a']);
	});
	it('tient avec une seule phrase', () => {
		expect(phraseSuivante([{ id: 'x' }], 'x', ['x'], () => 0).phrase.id).toBe('x');
	});
	it('les phrases du fichier sont complètes, uniques et rangées par thème connu', () => {
		expect(FRASAS.length).toBeGreaterThanOrEqual(20);
		expect(new Set(FRASAS.map((p) => p.id)).size).toBe(FRASAS.length);
		for (const p of FRASAS) {
			expect(p.fr && p.oc && TEMAS[p.tema]).toBeTruthy();
			expect(decouper(p.oc).length).toBeGreaterThan(0);
		}
	});
});

describe('état de la correction', () => {
	const ok = { estat: 'ok', mots: { gat: 'ok', gatz: 'absent', plan: 'error' } };
	it('classe chaque mot', () => {
		expect(estatMot('court', 'lo', ok)).toBe('pas-cercat');
		expect(estatMot(null, 'gat', ok)).toBe('confirmat');
		expect(estatMot(null, 'gatz', ok)).toBe('inconegut');
		expect(estatMot(null, 'plan', ok)).toBe('indisponible');
		expect(estatMot(null, 'gat', { estat: 'sens-clau', mots: {} })).toBe('indisponible');
		expect(estatMot(null, 'gat', null)).toBe('indisponible');
	});
	it('compte et annonce', () => {
		const c = resumir(['confirmat', 'confirmat', 'inconegut', 'pas-cercat']);
		expect(c).toEqual({ confirmat: 2, inconegut: 1, 'pas-cercat': 1, indisponible: 0 });
		expect(annonce(c, false)).toContain('2 mots confirmés, 1 mot non trouvé');
		expect(annonce(c, true)).toContain('identique');
		expect(annonce(resumir(['indisponible']), false)).toContain('indisponible');
	});
});

describe('appel de vérification', () => {
	beforeEach(() => oublier());
	const rep = (status, corps) => async () => ({ status, ok: status < 400, json: async () => corps });
	it('envoie les mots, garde le résultat en mémoire et ne redemande pas', async () => {
		let appels = 0;
		const f = async (_u, o) => {
			appels++;
			expect(JSON.parse(o.body).mots).toEqual(['gat']);
			expect(o.headers.Authorization).toBe('Bearer jeton');
			return { status: 200, ok: true, json: async () => ({ estat: 'ok', mots: { gat: 'ok' } }) };
		};
		expect(await verificar(['gat', 'gat'], 'jeton', f)).toEqual({ estat: 'ok', mots: { gat: 'ok' } });
		expect((await verificar(['gat'], 'jeton', f)).mots.gat).toBe('ok');
		expect(appels).toBe(1);
	});
	it('rend un état clair sans lever : accès refusé, panne, réseau, clé absente', async () => {
		expect((await verificar(['gat'], '', rep(403, {}))).estat).toBe('reservat');
		expect((await verificar(['gat'], '', rep(502, {}))).estat).toBe('error');
		expect((await verificar(['gat'], '', async () => { throw new Error('réseau'); })).estat).toBe('error');
		expect((await verificar(['gat'], '', rep(200, { estat: 'sens-clau', mots: {} }))).estat).toBe('sens-clau');
	});
});
