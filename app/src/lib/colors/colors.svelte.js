// L'outil « Colors » (Romain, 2026-11-13 : « il faut que je puisse changer toutes
// les couleurs du site directement dans le site »). Connecté avec son compte
// administrateur, Romain ouvre le panneau depuis sa barre d'outils (Lo
// talhièr), change une couleur, la voit aussitôt sur la page, se promène sur le
// site panneau ouvert, puis « Publicar » rend ses choix publics.
//
// Même circuit que l'édition sur place des textes (lib/edicion) : chaque
// changement est un brouillon (table pagina_elements, « page » colors, visible
// de lui seul) ; publicar_pagina() le rend public et garde la photographie
// d'avant, à laquelle on peut revenir. Le public reçoit les couleurs publiées
// écrites dans la page par le serveur (lib/server/colors.js, app.html).
//
// Chargé avec la barre d'outils, pour l'administrateur seulement : le visiteur
// ne télécharge que le signal (senhal.svelte.js), qui fait suivre les pages
// quand la palette change.
// Détail : revisions/2026-11-13-colors-sus-plaça.md
import { browser, dev } from '$app/environment';
import { supabase } from '$lib/supabaseClient';
import { fixarColors, hexColor } from '$lib/styles/palette.js';
import { senhal } from './senhal.svelte.js';
import { PAGINA, PER_ID, clauDe, surchargesDe, netejar, cssColors, valors } from './registre.js';

const CLAU_VISTA = 'lo-ligam-colors-vista';
const CLAU_CSS = 'lo-ligam-colors-vista-css';
const CLAU_DUBERT = 'lo-ligam-colors-dubert';
const COLOMNAS = 'clau,estat,oc,suprimit';

function crearEstat() {
	const e = $state({
		// le panneau est ouvert : la page montre le brouillon
		dubert: false,
		cargat: false,
		// les surcharges publiées { identifiant: '#rrggbb' } et le brouillon
		// { identifiant: '#rrggbb' | null } (null : retirer la surcharge publiée)
		publicats: browser ? netejar(globalThis.__loLigamColors) : {},
		brolhons: {},
		ocupat: false,
		messatge: null
	});
	return e;
}
// (un seul état pour toute la page, comme stores/ambianca)
export const colors = browser ? (globalThis.__loLigamColorsEstat ??= crearEstat()) : crearEstat();

// En développement, « ?edicion=simular » fait comme si on était administrateur,
// sans rien lire ni écrire dans la base (comme l'éditeur de textes).
const simulacion = () => dev && browser && new URLSearchParams(location.search).get('edicion') === 'simular';

const garda = {
	legir(k) {
		try {
			return sessionStorage.getItem(k);
		} catch {
			return null;
		}
	},
	pausar(k, v) {
		try {
			v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v);
		} catch {
			// pas grave : la vue ne survivra pas à un rechargement
		}
	}
};

function dire(tipe, text) {
	colors.messatge = { tipe, text };
}

/** Ce que la page doit montrer : le publié, et le brouillon par-dessus tant que le panneau est ouvert */
export function vista() {
	const s = { ...colors.publicats };
	if (colors.dubert) for (const [id, v] of Object.entries(colors.brolhons)) v === null ? delete s[id] : (s[id] = v);
	return s;
}

/** La valeur affichée de chaque couleur { identifiant: '#rrggbb' } */
export const valorsVista = () => valors(vista());

/** La valeur qu'aurait une couleur sans surcharge sur elle (son origine, ou la couleur qu'elle suit) */
export function naturala(id) {
	const s = vista();
	delete s[id];
	return valors(s)[id];
}

export const nombreCambiaments = () => Object.keys(colors.brolhons).length;
/** Cette couleur a-t-elle quitté sa valeur d'origine (publiée ou en brouillon) ? */
export const cambiada = (id) => id in vista();

// pose la vue sur la page : la palette du JS, la feuille de style, et la mémoire de l'onglet
function aplicar() {
	if (!browser) return;
	const s = vista();
	// (le signal avance : les pages qui lisent la palette se redessinent)
	if (fixarColors(s)) senhal.version++;
	const css = cssColors(s);
	const fuèlha = document.getElementById('colors-publicadas');
	if (fuèlha && fuèlha.textContent !== css) fuèlha.textContent = css;
	const brolhon = colors.dubert && nombreCambiaments() > 0;
	garda.pausar(CLAU_VISTA, brolhon ? JSON.stringify(s) : null);
	garda.pausar(CLAU_CSS, brolhon ? css : null);
}

async function cargar() {
	if (simulacion()) {
		// (en simulation, le brouillon ne vit que dans l'onglet : on le reprend de la vue gardée)
		const gardada = netejar(globalThis.__loLigamColorsVista);
		if (!colors.cargat && globalThis.__loLigamColorsVista) {
			for (const [id, c] of Object.entries(gardada)) if (c !== colors.publicats[id]) colors.brolhons[id] = c;
			for (const id of Object.keys(colors.publicats)) if (!(id in gardada)) colors.brolhons[id] = null;
		}
		colors.cargat = true;
		return;
	}
	const { data, error } = await supabase.from('pagina_elements').select(COLOMNAS).eq('pagina', PAGINA);
	if (error) return dire('error', error.message);
	const rows = data ?? [];
	colors.publicats = surchargesDe(rows.filter((r) => r.estat === 'publicat'));
	const bro = {};
	for (const r of rows.filter((r) => r.estat === 'brolhon')) {
		const id = r.clau.slice(PAGINA.length + 1);
		if (!PER_ID[id]) continue;
		// (un retour en arrière repose tout en brouillon : ce qui est identique au publié ne compte pas)
		if (r.suprimit) {
			if (id in colors.publicats) bro[id] = null;
		} else if (hexColor(r.oc) && r.oc !== colors.publicats[id]) bro[id] = r.oc;
	}
	colors.brolhons = bro;
	colors.cargat = true;
}

/** Ouvre l'outil : lit le publié et le brouillon tels que la base les a, et montre le brouillon */
export async function dobrir() {
	colors.messatge = null;
	colors.dubert = true;
	garda.pausar(CLAU_DUBERT, '1');
	await cargar();
	aplicar();
}

/** Ferme l'outil : la page remontre ce que voit le public (le brouillon reste dans la base) */
export function tampar() {
	colors.dubert = false;
	colors.messatge = null;
	garda.pausar(CLAU_DUBERT, null);
	aplicar();
}

/** L'outil était ouvert avant le rechargement de la page ? (lu par la barre d'outils) */
export const eraDubert = () => browser && garda.legir(CLAU_DUBERT) === '1';

// --- écriture (brouillon) -------------------------------------------------------

const enAtenta = new Map();
async function escriure(id) {
	enAtenta.delete(id);
	if (simulacion()) return;
	const clau = clauDe(id);
	colors.ocupat = true;
	let error;
	if (id in colors.brolhons) {
		const v = colors.brolhons[id];
		({ error } = await supabase.from('pagina_elements').upsert(
			{ clau, estat: 'brolhon', pagina: PAGINA, tipe: 'text', oc: v ?? colors.publicats[id] ?? null, suprimit: v === null },
			{ onConflict: 'clau,estat' }
		));
	} else ({ error } = await supabase.from('pagina_elements').delete().eq('clau', clau).eq('estat', 'brolhon'));
	colors.ocupat = false;
	if (error) dire('error', error.message);
}
function programar(id, ara = false) {
	clearTimeout(enAtenta.get(id));
	if (ara) return escriure(id);
	enAtenta.set(
		id,
		setTimeout(() => escriure(id), 500)
	);
}

/** Change une couleur : visible tout de suite, écrite dans le brouillon un peu après */
export function cambiar(id, color, { ara = false } = {}) {
	const v = typeof color === 'string' ? color.trim().toLowerCase() : '';
	if (!PER_ID[id] || !hexColor(v)) return;
	colors.messatge = null;
	const publicat = colors.publicats[id];
	if (v === publicat) delete colors.brolhons[id];
	else if (v === naturala(id)) {
		// retour à l'origine : rien à garder, ou une surcharge publiée à retirer
		if (publicat) colors.brolhons[id] = null;
		else delete colors.brolhons[id];
	} else colors.brolhons[id] = v;
	aplicar();
	programar(id, ara);
}

/** Remet une couleur à sa valeur d'origine (ou à la couleur qu'elle suit) */
export const restablir = (id) => cambiar(id, naturala(id), { ara: true });

/** Remet tout le site aux couleurs d'origine (en brouillon : à publier ensuite) */
export function totRestablir() {
	const ids = new Set([...Object.keys(colors.brolhons), ...Object.keys(colors.publicats)]);
	for (const id of Object.keys(colors.brolhons)) delete colors.brolhons[id];
	for (const id of Object.keys(colors.publicats)) colors.brolhons[id] = null;
	aplicar();
	return Promise.all([...ids].map((id) => programar(id, true)));
}

async function acabarEscrituras() {
	const ids = [...enAtenta.keys()];
	for (const id of ids) clearTimeout(enAtenta.get(id));
	for (const id of ids) await escriure(id);
}

export async function publicar() {
	const n = nombreCambiaments();
	if (!n) return;
	colors.messatge = null;
	await acabarEscrituras();
	if (colors.messatge) return;
	if (simulacion()) {
		colors.publicats = vista();
		colors.brolhons = {};
		aplicar();
		return dire('ok', 'Publié (simulation, rien n’est écrit)');
	}
	colors.ocupat = true;
	const { error } = await supabase.rpc('publicar_pagina', { p_pagina: PAGINA });
	colors.ocupat = false;
	if (error) return dire('error', error.message);
	await cargar();
	aplicar();
	dire('ok', n === 1 ? '1 couleur publiée : le public la voit dans la minute' : `${n} couleurs publiées : le public les voit dans la minute`);
}

/** Jette le brouillon : retour à ce que voit le public */
export async function anullar() {
	for (const t of enAtenta.values()) clearTimeout(t);
	enAtenta.clear();
	if (!simulacion()) {
		const { error } = await supabase.from('pagina_elements').delete().eq('pagina', PAGINA).eq('estat', 'brolhon');
		if (error) return dire('error', error.message);
	}
	colors.brolhons = {};
	colors.messatge = null;
	aplicar();
}

/** Repose en brouillon les couleurs d'avant la dernière publication (à relire, puis publier) */
export async function tornarEnrèire() {
	if (simulacion()) return dire('error', 'Pas de retour en arrière en simulation');
	colors.messatge = null;
	colors.ocupat = true;
	const { data, error } = await supabase.from('pagina_publicacions').select('id').eq('pagina', PAGINA).order('id', { ascending: false }).limit(1);
	const id = data?.[0]?.id;
	const r = error || !id ? { error } : await supabase.rpc('restaurar_publicacion', { p_id: id });
	colors.ocupat = false;
	if (r.error) return dire('error', r.error.message);
	if (!id) return dire('error', 'Aucune publication à laquelle revenir');
	await cargar();
	aplicar();
	dire('ok', 'Les couleurs d’avant la dernière publication sont reposées en brouillon : regarde, puis Publicar');
}
