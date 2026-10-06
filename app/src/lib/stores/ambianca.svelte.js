import { browser } from '$app/environment';

// Réglages d'ambiance partagés par tout le site (cadre commun, 2026-10-07,
// repris de l'esbòs de nuèch) : thème (sombre / clair / comme le système),
// couleurs adaptées au daltonisme, fond animé. Mémorisés d'une visite à
// l'autre, et posés sur <html> (data-tema, data-dalt, data-fons) pour que
// le CSS de toutes les pages suive.
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
export const ARMONIZADAS = [];

const CLAU = { tema: 'lo-ligam-tema', dalt: 'lo-ligam-dalt', fons: 'lo-ligam-fons' };
const TEMAS = ['sorne', 'clar', 'sistema'];
// 0 Venas d'aur · 1 Lum e estelas · 2 Corbas de nivèl · 3 Simple
const FONSES = [0, 1, 2, 3];

function crearEstat() {
	const e = $state({
		tema: 'sorne',
		dalt: false,
		fons: 1,
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

function clarEfectiu() {
	return e.forçarClar || e.tema === 'clar' || (e.tema === 'sistema' && e.sistèmaClar);
}

function aplicar() {
	if (!browser) return;
	const d = document.documentElement.dataset;
	d.tema = clarEfectiu() ? 'clar' : 'sorne';
	d.dalt = e.dalt ? 'on' : 'off';
	d.fons = String(e.fons);
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
	const mq = matchMedia('(prefers-color-scheme: light)');
	e.sistèmaClar = mq.matches;
	mq.addEventListener('change', (ev) => {
		e.sistèmaClar = ev.matches;
		aplicar();
	});
	aplicar();
}
