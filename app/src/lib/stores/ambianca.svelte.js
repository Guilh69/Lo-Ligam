import { browser } from '$app/environment';

// Réglages d'ambiance partagés par tout le site (cadre commun, 2026-10-07,
// repris de l'esbòs de nuèch) : thème (sombre / clair / comme le système),
// couleurs adaptées au daltonisme, fond animé, fond léger. Mémorisés d'une
// visite à l'autre, et posés sur <html> (data-tema, data-dalt, data-fons,
// data-leugier) pour que le CSS de toutes les pages suive.
//
// Fond léger (2026-10-14, choix de Romain : « automatique ») : la braise en
// CSS seul remplace le fond calculé (WebGL). Actif d'office sur téléphone et
// tablette, sur les appareils modestes, quand le visiteur économise ses
// données ou demande moins de mouvement ; l'interrupteur du panneau garde le
// choix du visiteur, qui l'emporte ensuite.
//
// Les pages pas encore harmonisées avec la nouvelle charte restent en clair
// (elles sont dessinées pour un fond crème) : le layout lève `forçarClar`
// tant qu'on est sur l'une d'elles, sans toucher au choix mémorisé.
//
// Un SEUL état pour toute la page, rangé sur globalThis : constaté le
// 2026-10-07, ce module pouvait être évalué deux fois dans la même page, et
// la seconde copie écrasait le thème posé par la première.

// Pages harmonisées avec la charte (les autres restent en clair). COPIE dans
// src/app.html (script de départ), à tenir identique.
export const ARMONIZADAS = ['/', '/mots', '/carta']; // harmonisées le 2026-10-07 : accueil, mots, carte

const CLAU = { tema: 'lo-ligam-tema', dalt: 'lo-ligam-dalt', fons: 'lo-ligam-fons', leugier: 'lo-ligam-leugier' };
const TEMAS = ['sorne', 'clar', 'sistema'];
// 0 Venas d'aur · 1 Lum e estelas · 2 Corbas de nivèl · 3 Simple
const FONSES = [0, 1, 2, 3];

function crearEstat() {
	const e = $state({
		tema: 'sorne',
		dalt: false,
		fons: 0, // Venas d'aur, l'ambiança preferida de Romain (2026-10-07)
		leugier: null, // choix du visiteur ('on' / 'off'), null = automatique
		leugierAuto: false,
		forçarClar: false,
		sistèmaClar: false,
		// Vrai tant qu'une page affiche le fond animé : le choix du fond
		// n'apparaît dans le panneau que là où il sert.
		fonsPresent: false
	});
	return e;
}

const G = globalThis;
const e = browser ? (G.__loLigamAmbianca ??= crearEstat()) : crearEstat();

function legir(k) {
	try {
		return localStorage.getItem(k);
	} catch {
		return null;
	}
}
function escriure(k, v) {
	try {
		localStorage.setItem(k, v);
	} catch {
		// Mode privé : le réglage vaut pour la visite, sans plus.
	}
}

// Mode automatique : écran tactile sans survol (téléphone, tablette),
// économiseur de données, appareil modeste (4 Go ou 4 cœurs au plus, quand
// le navigateur le dit) ou mouvement réduit demandé au système.
function detectarLeugier() {
	const n = navigator;
	return (
		matchMedia('(hover: none) and (pointer: coarse)').matches ||
		matchMedia('(prefers-reduced-motion: reduce)').matches ||
		n.connection?.saveData === true ||
		(n.deviceMemory > 0 && n.deviceMemory <= 4) ||
		(n.hardwareConcurrency > 0 && n.hardwareConcurrency <= 4)
	);
}

function leugierEfectiu() {
	return e.leugier ? e.leugier === 'on' : e.leugierAuto;
}

function clarEfectiu() {
	return e.forçarClar || e.tema === 'clar' || (e.tema === 'sistema' && e.sistèmaClar);
}

function aplicar() {
	if (!browser) return;
	const d = document.documentElement.dataset;
	d.tema = clarEfectiu() ? 'clar' : 'sorne';
	d.dalt = e.dalt ? 'on' : 'off';
	d.fons = String(e.fons);
	d.leugier = leugierEfectiu() ? 'on' : 'off';
}

export const ambianca = {
	get tema() {
		return e.tema;
	},
	set tema(v) {
		if (!TEMAS.includes(v)) return;
		e.tema = v;
		escriure(CLAU.tema, v);
		aplicar();
	},
	get dalt() {
		return e.dalt;
	},
	set dalt(v) {
		e.dalt = !!v;
		escriure(CLAU.dalt, e.dalt ? 'on' : 'off');
		aplicar();
	},
	get fons() {
		return e.fons;
	},
	set fons(v) {
		v = Number(v);
		if (!FONSES.includes(v)) return;
		e.fons = v;
		escriure(CLAU.fons, String(v));
		aplicar();
	},
	/** Fond léger réellement appliqué (choix du visiteur, sinon automatique). */
	get leugier() {
		return leugierEfectiu();
	},
	set leugier(v) {
		e.leugier = v ? 'on' : 'off';
		escriure(CLAU.leugier, e.leugier);
		aplicar();
	},
	/** Thème réellement affiché (après « système » et pages forcées en clair). */
	get clar() {
		return clarEfectiu();
	},
	get forçarClar() {
		return e.forçarClar;
	},
	set forçarClar(v) {
		e.forçarClar = !!v;
		aplicar();
	},
	get fonsPresent() {
		return e.fonsPresent;
	},
	set fonsPresent(v) {
		e.fonsPresent = !!v;
	}
};

// Lecture des réglages mémorisés : une seule fois par page, même si le
// module est évalué deux fois.
if (browser && !G.__loLigamAmbiancaLegit) {
	G.__loLigamAmbiancaLegit = true;
	e.forçarClar = !ARMONIZADAS.includes(location.pathname);
	const t = legir(CLAU.tema);
	if (TEMAS.includes(t)) e.tema = t;
	e.dalt = legir(CLAU.dalt) === 'on';
	const f = legir(CLAU.fons);
	if (f !== null && FONSES.includes(Number(f))) e.fons = Number(f);
	const l = legir(CLAU.leugier);
	if (l === 'on' || l === 'off') e.leugier = l;
	e.leugierAuto = detectarLeugier();
	const mq = matchMedia('(prefers-color-scheme: light)');
	e.sistèmaClar = mq.matches;
	mq.addEventListener('change', (ev) => {
		e.sistèmaClar = ev.matches;
		aplicar();
	});
	aplicar();
}
