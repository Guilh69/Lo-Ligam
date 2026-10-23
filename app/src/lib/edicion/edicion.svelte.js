// L'édition sur place (2026-10-24, proposition revisions/2026-10-24-edicion-sus-plaça.md) :
// Romain, connecté avec son compte administrateur, modifie les textes, liens,
// images et listes d'une page directement sur la page. Chaque changement est
// un brouillon (table pagina_elements, estat = 'brolhon', écrit aussitôt dans
// la base, visible de lui seul) ; « Publicar » le rend public, « Anullar » le
// jette. Le public ne lit que l'état publié (politiques RLS), rendu côté
// serveur avec le filet de secours de $lib/data/elements-filet.json.
//
// Une page se branche avec iniciar(pagina, lignesPubliées) ; elle lit ses
// éléments avec txt(clau), ligam(clau), imatge(clau), lista(clau) et pose
// l'action `editar` (editar.svelte.js) sur chaque élément modifiable.
import { browser } from '$app/environment';
import { supabase } from '$lib/supabaseClient';
import { session, authReady } from '$lib/authStore';
import { get } from 'svelte/store';

const COLOMNAS = 'clau,estat,pagina,tipe,lista,ordre,oc,fr,ligam,imatge,visible,suprimit';
const CLAU_SESSION = 'lo-ligam-edicion';
// En développement, « ?edicion=simular » fait comme si on était administrateur,
// sans rien écrire dans la base : pour regarder l'éditeur sans compte.
let simulacion = false;

export const edicion = $state({
	pagina: null,
	admin: false,
	actiu: false,
	// lignes publiées et brouillons, par clé
	publicats: {},
	brolhons: {},
	// l'élément touché (sa clé) et l'endroit du panneau
	causit: null,
	ancora: null,
	ocupat: false,
	messatge: null
});

const VUEJ = { oc: '', fr: '' };

// --- lecture -------------------------------------------------------------

/** la ligne telle qu'on la voit : le brouillon s'il existe, sinon le publié */
export function element(clau) {
	return edicion.brolhons[clau] ?? edicion.publicats[clau] ?? null;
}
export function txt(clau) {
	const e = element(clau);
	return e ? { oc: e.oc ?? '', fr: e.fr ?? '' } : VUEJ;
}
export function ligam(clau) {
	const e = element(clau);
	return e ? { oc: e.oc ?? '', fr: e.fr ?? '', href: e.ligam ?? '#', defòra: /^https?:\/\//.test(e.ligam ?? '') } : { ...VUEJ, href: '#', defòra: false };
}
export function imatge(clau) {
	return element(clau)?.imatge ?? null;
}
/** hors édition, un élément caché n'est pas affiché ; en édition il reste là, estompé */
export function amagat(clau) {
	const e = element(clau);
	return !!e && e.visible === false && !edicion.actiu;
}
/** les éléments d'une liste, dans l'ordre, sans les retirés (ni les cachés, hors édition) */
export function lista(clauLista) {
	const vistas = new Set();
	const res = [];
	for (const font of [edicion.brolhons, edicion.publicats])
		for (const e of Object.values(font)) {
			if (e.lista !== clauLista || vistas.has(e.clau)) continue;
			vistas.add(e.clau);
			if (e.suprimit) continue;
			if (e.visible === false && !edicion.actiu) continue;
			res.push(e);
		}
	return res.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || a.clau.localeCompare(b.clau));
}

// --- démarrage ---------------------------------------------------------------

// (Sur le serveur, iniciar() écrit dans ce singleton juste avant le rendu de
// la page, qui est synchrone : deux requêtes ne s'y croisent pas. Une page
// appelle quitar() en partant : le bouton « Editar » ne la suit pas ailleurs.)
export function iniciar(pagina, publicats) {
	edicion.pagina = pagina;
	edicion.publicats = Object.fromEntries((publicats ?? []).map((e) => [e.clau, { ...e, estat: 'publicat' }]));
	edicion.brolhons = {};
	edicion.causit = null;
	edicion.admin = false;
	edicion.actiu = false;
	edicion.messatge = null;
	if (!browser) return;
	simulacion = import.meta.env.DEV && new URLSearchParams(location.search).get('edicion') === 'simular';
	if (simulacion) {
		edicion.admin = true;
		return;
	}
	// le bouton « Editar » n'apparaît que pour l'administrateur (la base refuse
	// de toute façon les écritures des autres)
	const quand = () => {
		if (!get(authReady)) return;
		if (!get(session)) return;
		supabase.rpc('is_admin').then(({ data }) => {
			if (data !== true) return;
			edicion.admin = true;
			let repren = false;
			try {
				repren = sessionStorage.getItem(CLAU_SESSION) === pagina;
			} catch {
				// stockage indisponible : on repart hors édition
			}
			if (repren) activar();
		});
	};
	quand();
	// (la session peut arriver après : connexion dans un autre onglet)
	const lèva1 = authReady.subscribe((p) => p && quand());
	const lèva2 = session.subscribe((s) => s && !edicion.admin && quand());
	return () => {
		lèva1();
		lèva2();
		quitar();
	};
}

/** la page s'en va : plus de bouton, de barre ni de brouillons en mémoire */
export function quitar() {
	edicion.pagina = null;
	edicion.admin = false;
	edicion.actiu = false;
	edicion.causit = null;
	edicion.brolhons = {};
	edicion.messatge = null;
}

// les lignes de la base complètent celles qu'on a (filet ou semence), clé par clé
const fondre = (basa, rows) => {
	const res = { ...basa };
	for (const e of rows ?? []) res[e.clau] = e;
	return res;
};

export async function activar() {
	if (!edicion.admin || !edicion.pagina) return;
	edicion.messatge = null;
	if (!simulacion) {
		// les brouillons et le publié, tels que la base les a (un autre appareil a
		// pu en laisser)
		const { data, error } = await supabase.from('pagina_elements').select(COLOMNAS).eq('pagina', edicion.pagina);
		if (error) return (edicion.messatge = { tipe: 'error', text: error.message });
		const pub = [],
			bro = {};
		for (const e of data ?? []) (e.estat === 'brolhon' ? (bro[e.clau] = e) : pub.push(e));
		edicion.publicats = fondre(edicion.publicats, pub);
		edicion.brolhons = bro;
	}
	edicion.actiu = true;
	try {
		sessionStorage.setItem(CLAU_SESSION, edicion.pagina);
	} catch {
		// pas grave
	}
}

export function desactivar() {
	edicion.actiu = false;
	edicion.causit = null;
	// (les brouillons restent en base ; hors édition on voit ce que voit le public)
	edicion.brolhons = {};
	edicion.messatge = null;
	try {
		sessionStorage.removeItem(CLAU_SESSION);
	} catch {
		// pas grave
	}
}

export function causir(clau, ancora = null) {
	edicion.causit = clau;
	edicion.ancora = ancora;
}

// --- écriture (brouillons) -----------------------------------------------------

export const nombreCambiaments = () => Object.keys(edicion.brolhons).length;
/** les brouillons qu'on ne peut pas publier (un lien mal formé) */
export const brolhonsInvalids = () => Object.values(edicion.brolhons).filter((e) => e.tipe === 'ligam' && !e.suprimit && !ligamValid(e.ligam)).length;
/** les textes qui comprennent les marques *or* et _italique_ */
export const MARCATS = new Set(['acuelh.manifest.tèxt', 'acuelh.bandel.font', 'acuelh.trobador.cita']);

const esquelet = (clau, tipe, lista = null) => ({
	clau,
	estat: 'brolhon',
	pagina: edicion.pagina,
	tipe,
	lista,
	ordre: 0,
	oc: '',
	fr: '',
	ligam: null,
	imatge: null,
	visible: true,
	suprimit: false
});

const enAtenta = new Map();
async function escriure(row) {
	if (simulacion) return;
	edicion.ocupat = true;
	const { estat, ...rest } = row;
	const { error } = await supabase.from('pagina_elements').upsert({ ...rest, estat: 'brolhon' }, { onConflict: 'clau,estat' });
	edicion.ocupat = false;
	if (error) edicion.messatge = { tipe: 'error', text: error.message };
}
async function escafar(clau) {
	if (simulacion) return;
	const { error } = await supabase.from('pagina_elements').delete().eq('clau', clau).eq('estat', 'brolhon');
	if (error) edicion.messatge = { tipe: 'error', text: error.message };
}

/** change un élément : brouillon local tout de suite, base un peu après (frappe) */
export function cambiar(clau, patch, { tipe = 'text', lista: l = null, tot_d_un_còp = false } = {}) {
	const basa = edicion.brolhons[clau] ?? edicion.publicats[clau] ?? esquelet(clau, tipe, l);
	const row = { ...basa, ...patch, estat: 'brolhon', pagina: edicion.pagina };
	edicion.brolhons[clau] = row;
	clearTimeout(enAtenta.get(clau));
	// (un lien mal formé reste à l'écran, le temps de le finir, mais ne part pas
	// vers la base, qui le refuserait ; Publicar attend qu'il soit corrigé)
	if (row.tipe === 'ligam' && !row.suprimit && !ligamValid(row.ligam)) return;
	if (tot_d_un_còp) return escriure(row);
	enAtenta.set(
		clau,
		setTimeout(() => escriure(row), 600)
	);
}

/** ajoute un élément à une liste (un lien, un mot, une carte avec ses enfants) */
export function apondre(clauLista, tipe, modèl = {}, enfants = []) {
	const existents = lista(clauLista);
	const ordre = (existents.at(-1)?.ordre ?? 0) + 1;
	const clau = `${clauLista}.${Date.now().toString(36)}`;
	cambiar(clau, { ordre, ...modèl }, { tipe, lista: clauLista, tot_d_un_còp: true });
	for (const [sufix, t, m] of enfants) cambiar(`${clau}.${sufix}`, m, { tipe: t, lista: clau, tot_d_un_còp: true });
	// le panneau s'ouvre aussitôt sur le nouvel élément (ou son premier texte)
	causir(enfants.length ? `${clau}.${enfants[0][0]}` : clau, null);
	return clau;
}

/** retire un élément d'une liste (et ses enfants) : marqué, jusqu'à la publication */
export function suprimir(clau) {
	const enfants = Object.values({ ...edicion.publicats, ...edicion.brolhons }).filter((e) => e.lista === clau);
	for (const e of [element(clau), ...enfants]) {
		if (!e) continue;
		// (une frappe en attente ne doit pas le réécrire après coup)
		clearTimeout(enAtenta.get(e.clau));
		enAtenta.delete(e.clau);
		if (edicion.publicats[e.clau]) cambiar(e.clau, { suprimit: true }, { tot_d_un_còp: true });
		else {
			delete edicion.brolhons[e.clau];
			escafar(e.clau);
		}
	}
	if (edicion.causit === clau) edicion.causit = null;
}

/** monte (-1) ou descend (+1) un élément dans sa liste */
export function desplaçar(clau, delta) {
	const e = element(clau);
	if (!e?.lista) return;
	const l = lista(e.lista);
	const i = l.findIndex((x) => x.clau === clau);
	const j = i + delta;
	if (i < 0 || j < 0 || j >= l.length) return;
	// l'ordre est renuméroté de 1 à n : les deux échangent leurs places
	const nòu = l.map((x) => x.clau);
	[nòu[i], nòu[j]] = [nòu[j], nòu[i]];
	nòu.forEach((c, k) => {
		if (element(c).ordre !== k + 1) cambiar(c, { ordre: k + 1 }, { tot_d_un_còp: true });
	});
}

export async function publicar() {
	if (!edicion.pagina) return;
	if (brolhonsInvalids()) return (edicion.messatge = { tipe: 'error', text: 'Un ligam es mal format' });
	edicion.messatge = null;
	// (ce qui attend encore sa frappe part d'abord)
	for (const [clau, t] of enAtenta) {
		clearTimeout(t);
		if (edicion.brolhons[clau]) await escriure(edicion.brolhons[clau]);
	}
	enAtenta.clear();
	edicion.ocupat = true;
	if (simulacion) {
		for (const [clau, e] of Object.entries(edicion.brolhons)) {
			if (e.suprimit) delete edicion.publicats[clau];
			else edicion.publicats[clau] = { ...e, estat: 'publicat' };
		}
		edicion.brolhons = {};
		edicion.ocupat = false;
		edicion.messatge = { tipe: 'ok', text: 'Publicat (simulacion)' };
		return;
	}
	const n = nombreCambiaments();
	const { error } = await supabase.rpc('publicar_pagina', { p_pagina: edicion.pagina });
	if (error) {
		edicion.ocupat = false;
		return (edicion.messatge = { tipe: 'error', text: error.message });
	}
	const r = await supabase.from('pagina_elements').select(COLOMNAS).eq('pagina', edicion.pagina).eq('estat', 'publicat');
	if (!r.error) {
		// (les éléments retirés disparaissent, les autres complètent le filet)
		const retirats = new Set(Object.values(edicion.brolhons).filter((e) => e.suprimit).map((e) => e.clau));
		const basa = Object.fromEntries(Object.entries(edicion.publicats).filter(([k]) => !retirats.has(k)));
		edicion.publicats = fondre(basa, r.data);
	}
	edicion.brolhons = {};
	edicion.ocupat = false;
	edicion.messatge = { tipe: 'ok', text: n === 1 ? '1 cambiament publicat' : `${n} cambiaments publicats` };
}

export async function anullar() {
	if (!edicion.pagina) return;
	for (const t of enAtenta.values()) clearTimeout(t);
	enAtenta.clear();
	if (!simulacion) {
		const { error } = await supabase.from('pagina_elements').delete().eq('pagina', edicion.pagina).eq('estat', 'brolhon');
		if (error) return (edicion.messatge = { tipe: 'error', text: error.message });
	}
	edicion.brolhons = {};
	edicion.causit = null;
	edicion.messatge = null;
}

/** envoie une image dans le stockage et la pose sur l'élément */
export async function mandarImatge(clau, fichièr) {
	if (!fichièr) return;
	if (!/^image\/(webp|jpeg|png)$/.test(fichièr.type)) return (edicion.messatge = { tipe: 'error', text: 'Imatge en webp, jpeg o png solament' });
	if (fichièr.size > 2 * 1024 * 1024) return (edicion.messatge = { tipe: 'error', text: 'Imatge tròp pesuga (2 Mo al maximum)' });
	const dims = await new Promise((res) => {
		const im = new Image();
		im.onload = () => res({ largor: im.naturalWidth, nautor: im.naturalHeight });
		im.onerror = () => res({ largor: null, nautor: null });
		im.src = URL.createObjectURL(fichièr);
	});
	const actual = imatge(clau) ?? {};
	if (simulacion) return cambiar(clau, { imatge: { ...actual, url: URL.createObjectURL(fichièr), ...dims } }, { tipe: 'imatge', tot_d_un_còp: true });
	const ext = fichièr.type.replace('image/', '');
	const camin = `${edicion.pagina}/${clau.replace(/[^a-z0-9.-]/gi, '-')}-${Date.now().toString(36)}.${ext}`;
	edicion.ocupat = true;
	const up = await supabase.storage.from('paginas').upload(camin, fichièr, { contentType: fichièr.type, upsert: false });
	edicion.ocupat = false;
	if (up.error) return (edicion.messatge = { tipe: 'error', text: up.error.message });
	const { data } = supabase.storage.from('paginas').getPublicUrl(camin);
	cambiar(clau, { imatge: { ...actual, url: data.publicUrl, ...dims } }, { tipe: 'imatge', tot_d_un_còp: true });
}

/** un lien est une page du site (/…, jamais //ailleurs), une ancre (#…) ou une adresse https */
export const ligamValid = (h) => /^(\/(?!\/)[^\s]*|#[^\s]+|https:\/\/[^\s]+)$/.test(h ?? '');
