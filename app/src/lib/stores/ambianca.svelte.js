import { browser } from '$app/environment';

// Réglages d'ambiance partagés par tout le site (cadre commun, 2026-10-07,
// repris de l'esbòs de nuèch) : thème (sombre / clair / comme le système),
// couleurs adaptées au daltonisme, fond animé, fond léger. Mémorisés d'une
// visite à l'autre, et posés sur <html> (data-tema, data-dalt, data-fons,
// data-leugier) pour que le CSS de toutes les pages suive.
//
// Fond léger (2026-10-14) : la braise en CSS seul remplace le fond calculé
// (WebGL). Jamais par défaut (Romain : Venas d'aur reste le fond de tous) :
// seulement sur choix du visiteur, mémorisé dans ce navigateur. Première
// brique de la future version légère de tout le site, proposée au premier
// passage (cahier §11, 2026-10-14).
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
export const ARMONIZADAS = ['/', '/mots', '/carta', '/istoria', '/parla', '/apren', '/apren/visio', '/amassa', '/ideas', '/obras', '/ensag/parla', '/ensag/obras', '/ensag/medias', '/ensag/literatura', '/ensag/radios', '/ensag/television', '/ensag/premsa']; // harmonisées le 2026-10-07 : accueil, mots, carte ; Mon istòria, S'apren et sa page visio le 2026-10-24 ; Se parla, Amassa, la boîte à idées et Òbras le 2026-10-25, et les maquettes de Se parla, Òbras par art et Médias

// Les modules de leçon (/aprene/modul/1-1…) le 2026-10-25 : une famille de
// pages, reconnue par son début (adresse réelle ou route de SvelteKit) ;
// de même les groupes d'Amassa (/grops…), le 2026-10-25.
export const armonizada = (cami) =>
	ARMONIZADAS.includes(cami) || cami.startsWith('/aprene/modul/') || cami.startsWith('/grops');

const CLAU = { tema: 'lo-ligam-tema', dalt: 'lo-ligam-dalt', fons: 'lo-ligam-fons', leugier: 'lo-ligam-leugier' };
const TEMAS = ['sorne', 'clar', 'sistema'];
// 0 Venas d'aur · 1 Lum e estelas · 2 Corbas de nivèl · 3 Simple
const FONSES = [0, 1, 2, 3];

function crearEstat() {
	const e = $state({
		// Le 2026-10-21, le clair « Plâtre » était devenu le thème de tous et le
		// fond immobile le fond par défaut. Le 2026-10-22, devant la carte en
		// étoiles sur fond nuit, Romain revient au sombre avec Venas d'aur, « en
		// connaissance du choix d'hier » : « finalement je veux peaufiner
		// celui-ci, je préfère ; mais il y aura encore la version light »
		// (cahier §11). Le clair Plâtre reste au choix dans le panneau Ambiance.
		tema: 'sorne',
		dalt: false,
		fons: 0, // Venas d'aur
		leugier: false, // fond léger, sur choix du visiteur seulement
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
	d.leugier = e.leugier ? 'on' : 'off';
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
	get leugier() {
		return e.leugier;
	},
	set leugier(v) {
		e.leugier = !!v;
		escriure(CLAU.leugier, e.leugier ? 'on' : 'off');
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
	e.forçarClar = !armonizada(location.pathname);
	const t = legir(CLAU.tema);
	if (TEMAS.includes(t)) e.tema = t;
	e.dalt = legir(CLAU.dalt) === 'on';
	const f = legir(CLAU.fons);
	if (f !== null && FONSES.includes(Number(f))) e.fons = Number(f);
	e.leugier = legir(CLAU.leugier) === 'on';
	const mq = matchMedia('(prefers-color-scheme: light)');
	e.sistèmaClar = mq.matches;
	mq.addEventListener('change', (ev) => {
		e.sistèmaClar = ev.matches;
		aplicar();
	});
	aplicar();
}
