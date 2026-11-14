import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { decouper, raisonNonCherche, motsACercar, morceaux, memesMots } from './mots.js';
import { TOUCHES, inserir } from './accents.js';
import { phraseSuivante, estatMot, etiquette, resumir, annonce } from './sesilha.js';
import { verificar, oublier } from './verificacion.js';
import { FRASAS, TEMAS } from './frasas.js';
import { FORMAS_ASSUMIDAS, esAssumida } from '../data/formas-assumidas.js';
import { verificarMots } from '../server/congres.js';

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
	it('ne cherche pas élisions, mots courts, mots outils et noms propres ; cherche le reste une fois', () => {
		const t = decouper('Lo gat e lo gat d’en Pèire dòrm');
		// « Pèire » : majuscule au milieu de la phrase, donc un nom propre (avant : cherché, par erreur possible)
		expect(motsACercar(t)).toEqual(['gat', 'dòrm']);
		expect(raisonNonCherche(decouper('d’')[0])).toBe('elision');
		expect(raisonNonCherche(decouper('lo')[0])).toBe('court');
		expect(raisonNonCherche(decouper('los')[0])).toBe('outil');
		expect(raisonNonCherche(decouper('dòrm')[0])).toBe(null);
	});
	it('marque le mot qui ouvre une phrase', () => {
		const t = decouper('Lo gat dòrm. Ont es Tolosa ? « Aquí », ditz el.\nEra bèl');
		const debut = Object.fromEntries(t.map((x) => [x.brut, x.debut]));
		expect(debut).toMatchObject({ Lo: true, gat: false, dòrm: false, Ont: true, es: false, Tolosa: false, Aquí: true, ditz: false, Era: true, bèl: false });
		expect(decouper('')).toEqual([]);
	});
	it('un nom propre (majuscule qui n’ouvre pas la phrase) n’est pas cherché : « Tolosa »', () => {
		const t = decouper('M’agrada Tolosa e Montpelhièr');
		expect(raisonNonCherche(t.find((x) => x.brut === 'Tolosa'))).toBe('nom-propre');
		expect(raisonNonCherche(t.find((x) => x.brut === 'Montpelhièr'))).toBe('nom-propre');
		expect(motsACercar(t)).toEqual(['agrada']);
	});
	it('le mot qui ouvre la phrase est cherché, même à majuscule ; une phrase après un point aussi', () => {
		expect(raisonNonCherche(decouper('Tolosa es bèla')[0])).toBe(null);
		expect(raisonNonCherche(decouper('Es bèl. Tolosa es bèla')[2])).toBe(null);
		expect(raisonNonCherche(decouper('— Gràcias, dis Pèire')[0])).toBe(null);
		expect(motsACercar(decouper('Cossí vas ? Plan, mercé'))).toEqual(['cossí', 'vas', 'plan', 'mercé']);
	});
	it('un mot tout en capitales n’est pas pris pour un nom propre, une minuscule non plus', () => {
		expect(raisonNonCherche(decouper('Vau a TOLOSA')[2])).toBe(null);
		expect(raisonNonCherche(decouper('Vau a tolosa')[2])).toBe(null);
		// mais un mot grammatical ou court garde sa raison propre
		expect(raisonNonCherche(decouper('Dison Los gats')[1])).toBe('outil');
	});
	it('les morceaux du modèle portent la même marque que le découpage', () => {
		const tokens = morceaux('Ont es Tolosa ?').filter((m) => m.token).map((m) => m.token);
		expect(tokens.map((t) => t.debut)).toEqual([true, false, false]);
		expect(raisonNonCherche(tokens[2])).toBe('nom-propre');
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
	const ok = { estat: 'ok', mots: { gat: 'ok', gatz: 'absent', plan: 'error', uèi: 'assumit' } };
	it('classe chaque mot', () => {
		expect(estatMot('court', 'lo', ok)).toBe('pas-cercat');
		expect(estatMot('nom-propre', 'tolosa', ok)).toBe('pas-cercat');
		expect(estatMot(null, 'gat', ok)).toBe('confirmat');
		expect(estatMot(null, 'uèi', ok)).toBe('assumit');
		expect(estatMot(null, 'gatz', ok)).toBe('inconegut');
		expect(estatMot(null, 'plan', ok)).toBe('indisponible');
		expect(estatMot(null, 'gat', { estat: 'sens-clau', mots: {} })).toBe('indisponible');
		expect(estatMot(null, 'gat', null)).toBe('indisponible');
	});
	it('dit pourquoi un nom propre n’est pas cherché, sans toucher aux autres étiquettes', () => {
		expect(etiquette('pas-cercat', 'nom-propre', 'non cherché')).toBe('non cherché : nom propre');
		expect(etiquette('pas-cercat', 'court', 'non cherché')).toBe('non cherché');
		expect(etiquette('inconegut', null, 'non trouvé')).toBe('non trouvé');
	});
	it('compte et annonce', () => {
		const c = resumir(['confirmat', 'confirmat', 'inconegut', 'pas-cercat']);
		expect(c).toEqual({ confirmat: 2, assumit: 0, inconegut: 1, 'pas-cercat': 1, indisponible: 0 });
		expect(annonce(c, false)).toContain('2 mots confirmés, 1 mot non trouvé');
		expect(annonce(c, true)).toContain('identique');
		expect(annonce(resumir(['indisponible']), false)).toContain('indisponible');
	});
	it('une forme assumée est comptée à part, ni confirmée ni inconnue', () => {
		const c = resumir(['confirmat', 'assumit', 'pas-cercat']);
		expect(c.assumit).toBe(1);
		expect(c.inconegut).toBe(0);
		expect(annonce(c, false)).toContain('1 mot confirmé, 1 forme assumée, 0 mot non trouvé');
		// avec seulement une forme assumée et un mot indisponible, la vérification n'est pas « indisponible »
		expect(annonce(resumir(['assumit', 'indisponible']), false)).not.toContain('indisponible.');
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

describe('formes assumées par Romain (uèi, siès) : liste partagée', () => {
	beforeEach(() => oublier());
	// lo Basic, faux : il ne connaît ni « uèi » ni « siès », comme le vrai
	const faus = async (_l, m) => (m === 'gat' ? [{ oc: m, fr: m, var: 'lengadoc' }] : []);

	it('la liste vient d’un seul fichier, que le script de vérification lit aussi', () => {
		expect(Object.keys(FORMAS_ASSUMIDAS)).toEqual(expect.arrayContaining(['uèi', 'siès']));
		expect(esAssumida('uèi')).toBe(true);
		expect(esAssumida('gat')).toBe(false);
		expect(esAssumida('constructor')).toBe(false);
		const script = readFileSync(join(process.cwd(), 'scripts', 'verificar-oc.mjs'), 'utf8');
		expect(script).toContain("from '../src/lib/data/formas-assumidas.js'");
		expect(script).not.toMatch(/const FORMAS_ASSUMIDAS\s*=/); // plus de copie dans le script
	});

	it('le serveur rend « assumit » pour « uèi », sans appeler lo Basic ni vèrb’Òc', async () => {
		const appels = [];
		const cercar = async (l, m) => (appels.push(m), faus(l, m));
		const conjugar = async (m) => (appels.push('v:' + m), false);
		const r = await verificarMots(['uèi', 'siès', 'gat', 'gatz'], cercar, true, conjugar);
		expect(r).toEqual({ estat: 'ok', mots: { uèi: 'assumit', siès: 'assumit', gat: 'ok', gatz: 'absent' } });
		expect(appels).not.toContain('uèi');
		expect(appels).not.toContain('v:uèi');
		expect(appels).not.toContain('siès');
	});

	it('de bout en bout : « uèi » n’est plus signalé inconnu, « gatz » l’est toujours', async () => {
		const f = async (_u, o) => {
			const { mots } = JSON.parse(o.body);
			const rep = await verificarMots(mots, faus, true, async () => false);
			return { status: 200, ok: true, json: async () => rep };
		};
		const t = decouper('Uèi lo gat dòrm gatz');
		const verifs = await verificar(motsACercar(t), 'jeton', f);
		const estats = Object.fromEntries(t.map((x) => [x.mot, estatMot(raisonNonCherche(x), x.mot, verifs)]));
		expect(estats.uèi).toBe('assumit');
		expect(estats.gat).toBe('confirmat');
		expect(estats.gatz).toBe('inconegut');
		expect(estats.lo).toBe('pas-cercat');
	});

	it('« Tolosa » (nom propre) n’est pas envoyé : ni inconnu ni confirmé', async () => {
		let envoyes = [];
		const f = async (_u, o) => {
			envoyes = JSON.parse(o.body).mots;
			const rep = await verificarMots(envoyes, faus, true, async () => false);
			return { status: 200, ok: true, json: async () => rep };
		};
		const t = decouper('Lo gat dòrm a Tolosa');
		const verifs = await verificar(motsACercar(t), 'jeton', f);
		expect(envoyes).not.toContain('tolosa');
		const tolosa = t.find((x) => x.brut === 'Tolosa');
		expect(estatMot(raisonNonCherche(tolosa), tolosa.mot, verifs)).toBe('pas-cercat');
		expect(etiquette('pas-cercat', raisonNonCherche(tolosa), 'non cherché')).toBe('non cherché : nom propre');
	});
});
