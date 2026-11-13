import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { LISTA, PER_ID, GROPS, ORIGINA, valors, cssColors, netejar, surchargesDe, clauDe } from './registre.js';
import { TEINTES, BOUTONS, CASES, CARTE, PUCES, LANGUES, fixarColors, quandCambia, hexColor } from '../styles/palette.js';
import { PALETAS } from '../apren/teulas.js';
import { TEMAS } from '../cultura/index.js';
import { LENGAS } from '../carta/lengas.js';
import * as parcors from '../parcors/colors.js';
import { oklch, contraste } from '../palette/coherence.js';

// Le registre des couleurs réglables depuis le site (outil « Colors », 2026-11-13)
const appCss = readFileSync(join(process.cwd(), 'src', 'app.css'), 'utf8');

afterEach(() => fixarColors({}));

describe('registre des couleurs', () => {
	it('chaque couleur a un identifiant unique, un nom, un groupe connu et une valeur d’origine', () => {
		expect(new Set(LISTA.map((e) => e.id)).size).toBe(LISTA.length);
		const grops = new Set(GROPS.map((g) => g.id));
		for (const e of LISTA) {
			expect(e.nom, e.id).toBeTruthy();
			expect(grops.has(e.grop), e.id).toBe(true);
			expect(hexColor(ORIGINA[e.id]), e.id).toBe(true);
			if (e.tinta) expect(PER_ID[e.tinta]?.esTinta, e.id).toBe(true);
			if (e.ligat) expect(PER_ID[e.ligat], e.id).toBeTruthy();
		}
	});

	it('les valeurs d’origine des jetons sont celles d’app.css', () => {
		for (const e of LISTA) {
			if (!e.id.startsWith('tema.') && !e.id.startsWith('comun.')) continue;
			const attendu = e.ligat ? `${e.var}: var(${PER_ID[e.ligat].var})` : `${e.var}: ${e.defaut};`;
			expect(appCss.includes(attendu), `${e.id} : « ${attendu} » absent d’app.css`).toBe(true);
		}
	});

	it('un rôle suit sa teinte, sauf s’il a sa propre surcharge', () => {
		expect(ORIGINA['role.BOUTONS.carton.clair']).toBe(ORIGINA['teinte.sarcelle']);
		const v = valors({ 'teinte.sarcelle': '#112233' });
		expect(v['role.BOUTONS.carton.clair']).toBe('#112233');
		expect(v['role.CARTE.dialectes.viv']).toBe('#112233');
		expect(v['tema.clar.l-teal']).toBe('#112233');
		const w = valors({ 'teinte.sarcelle': '#112233', 'role.BOUTONS.carton.clair': '#445566' });
		expect(w['role.BOUTONS.carton.clair']).toBe('#445566');
		expect(w['role.BOUTONS.carton.sombre']).toBe('#112233');
	});

	it('n’accepte que des identifiants connus et des couleurs #rrggbb', () => {
		expect(
			netejar({
				'teinte.or': '#ABCDEF',
				'teinte.olive': 'red',
				'teinte.bleu': '#123456;}body{display:none}',
				'tema.clar.t-fons': 'url(https://exemple.test/x)',
				'inconnu.x': '#123456',
				'role.CARTE.intensite': '#123456'
			})
		).toEqual({ 'teinte.or': '#abcdef' });
		// (les noms hérités de tout objet ne sont pas des identifiants)
		expect(netejar({ constructor: '#aabbcc', toString: '#aabbcc', hasOwnProperty: '#aabbcc' })).toEqual({});
		expect(surchargesDe([{ clau: clauDe('teinte.or'), oc: '#101010' }, { clau: 'acuelh.titol', oc: '#202020' }, { clau: clauDe('teinte.bleu'), oc: '#303030', suprimit: true }])).toEqual({ 'teinte.or': '#101010' });
	});
});

describe('feuille des surcharges', () => {
	it('est vide sans surcharge, et ne contient que des variables et des couleurs', () => {
		expect(cssColors()).toBe('');
		expect(cssColors({ 'teinte.or': 'javascript:alert(1)' })).toBe('');
		const css = cssColors({ 'teinte.or': '#101010', 'tema.clar.t-fons': '#fefefe', 'tema.sorne.t-terra': '#aa0000', 'role.LANGUES.oc.tinta': '#000000' });
		expect(css).toMatch(/^[a-z:\[\]='()\-.çA-Z {};#0-9\n]+$/);
		expect(css).not.toMatch(/[<>@\\]|url|expression/);
	});

	it('a la forme qu’app.html accepte de reposer depuis la mémoire de l’onglet', () => {
		// (le même motif que dans src/app.html : à tenir identiques)
		const forma = /^(html:root[a-z\[\]='():-]*\{--[a-zç0-9-]+:#[0-9a-f]{6}(;--[a-zç0-9-]+:#[0-9a-f]{6})*\}\n?)*$/;
		expect(readFileSync(join(process.cwd(), 'src', 'app.html'), 'utf8')).toContain(String(forma));
		const tout = Object.fromEntries(LISTA.map((e, i) => [e.id, '#' + (0x101010 + i).toString(16)]));
		expect(forma.test(cssColors(tout))).toBe(true);
		expect(forma.test('')).toBe(true);
		expect(forma.test('html:root{--t-fons:#ffffff}body{background:url(https://exemple.test/x)}')).toBe(false);
		expect(forma.test('html:root{--t-fons:red}')).toBe(false);
	});

	it('pose la teinte et les rôles qui la suivent', () => {
		const css = cssColors({ 'teinte.rougeAction': '#0055aa' });
		expect(css).toContain('--p-rouge-action:#0055aa');
		expect(css).toContain('--t-accion:#0055aa');
		expect(css).toContain('--p-jeu-adresse:#0055aa');
		expect(css.startsWith('html:root{')).toBe(true);
	});

	it('range chaque thème dans son bloc, et laisse le daltonisme tranquille', () => {
		const css = cssColors({ 'tema.clar.t-fons': '#fefefe', 'tema.sorne.t-fons': '#000000', 'tema.sorne.t-terra': '#aa0000', 'tema.clar.t-aur': '#775500' });
		expect(css).toContain("html:root[data-tema='clar']{--t-fons:#fefefe}");
		expect(css).toContain("html:root:not([data-tema='clar']){--t-fons:#000000}");
		expect(css).toContain("html:root:not([data-tema='clar']):not([data-dalt='on']){--t-terra:#aa0000}");
		expect(css).toContain("html:root[data-tema='clar']:not([data-dalt='on']){--t-aur:#775500}");
	});
});

describe('palette vivante', () => {
	it('les exports se lisent comme des objets et des tableaux ordinaires', () => {
		expect(Array.isArray(CASES)).toBe(true);
		expect(CASES.length).toBe(6);
		expect([...CASES].length).toBe(6);
		const [[fond, texte]] = CASES;
		expect(fond).toBe(TEINTES.rougeAction);
		expect(texte).toBe(TEINTES.creme);
		expect(Object.keys(PUCES).length).toBe(9);
		expect(Object.entries(CARTE.langues).every(([, c]) => hexColor(c))).toBe(true);
		expect(JSON.parse(JSON.stringify(LANGUES.oc))).toEqual({ fons: [TEINTES.brique], tinta: TEINTES.creme });
		expect(CARTE.dialectes).toBe(CARTE.dialectes);
	});

	it('suit les surcharges, puis revient à l’origine', () => {
		const origine = { or: TEINTES.or, agir: BOUTONS.agir };
		expect(fixarColors({ 'teinte.or': '#101010', 'role.BOUTONS.agir': '#202020', 'role.CASES.1.0': '#303030' })).toBe(true);
		expect(TEINTES.or).toBe('#101010');
		expect(BOUTONS.agir).toBe('#202020');
		expect(CASES[1][0]).toBe('#303030');
		expect(CASES[4][0]).toBe('#101010');
		expect(CARTE.dialectes.pro).toBe('#101010');
		expect(fixarColors({ 'teinte.or': '#101010', 'role.BOUTONS.agir': '#202020', 'role.CASES.1.0': '#303030' })).toBe(false);
		fixarColors({});
		expect(TEINTES.or).toBe(origine.or);
		expect(BOUTONS.agir).toBe(origine.agir);
	});

	it('un camaïeu de sous-page suit sa teinte mère, et son texte reste lisible', () => {
		const avant = PALETAS.verd.map(([c]) => c);
		expect(avant[1]).toBe('#353c1a');
		fixarColors({ 'teinte.olive': '#1b4f8a' });
		const apres = PALETAS.verd;
		expect(apres[0][0]).toBe('#1b4f8a');
		const base = oklch('#1b4f8a').H;
		for (const [i, [fond, texte]] of apres.entries()) {
			if (i) expect(fond, `nuance ${i}`).not.toBe(avant[i]);
			const ecart = Math.abs(((oklch(fond).H - base + 540) % 360) - 180);
			expect(ecart, `nuance ${i} : ${fond}`).toBeLessThan(40);
			expect(contraste(fond, texte), `nuance ${i} : ${fond} / ${texte}`).toBeGreaterThanOrEqual(4.5);
		}
		fixarColors({});
		expect(PALETAS.verd.map(([c]) => c)).toEqual(avant);
	});

	it('les modules qui gardent des valeurs calculées suivent aussi', () => {
		let n = 0;
		const arrestar = quandCambia(() => n++);
		const avant = { verd: PALETAS.verd[0][0], unitat: parcors.UNITATS[2], cultura: TEMAS.find((t) => t.id === 'pais').color[0], breton: LENGAS.breton?.color.clar ?? Object.values(LENGAS)[0].color.clar };
		fixarColors({ 'teinte.olive': '#0a0b0c', 'teinte.creme': '#fafafa', 'teinte.sarcelle': '#0d0e0f' });
		expect(n).toBe(1);
		expect(PALETAS.verd[0]).toEqual(['#0a0b0c', '#fafafa']);
		expect(PALETAS.charta[2][0]).toBe('#0a0b0c');
		expect(parcors.UNITATS[2]).toBe('#0a0b0c');
		expect(parcors.OLIVA).toBe('#0a0b0c');
		expect(TEMAS.find((t) => t.id === 'pais').color).toEqual(['#0a0b0c', '#fafafa']);
		const basc = Object.values(LENGAS).find((l) => l.color.dalt === '#004d40');
		expect(basc.color.clar).toBe('#0a0b0c');
		expect(Object.values(basc.dial.clar)[0]).toBe('#0a0b0c');
		arrestar();
		fixarColors({});
		expect(n).toBe(1);
		expect(PALETAS.verd[0][0]).toBe(avant.verd);
		expect(parcors.UNITATS[2]).toBe(avant.unitat);
		expect(TEMAS.find((t) => t.id === 'pais').color[0]).toBe(avant.cultura);
	});
});
