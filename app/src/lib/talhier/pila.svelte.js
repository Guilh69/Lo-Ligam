// Lo talhièr, lot 4 (Romain, 2026-11-06 ; revisions/2026-11-06-talhier.md) :
// la pile de validation (/admin/pila) et le mode « Validar » des pages, côté
// base. Les validations sont dans la table validacions (verrous :
// supabase/supabase-validacions.sql) : l'administrateur seul les lit et les
// écrit. Une validation garde l'empreinte du texte validé (empremtas.js).
import { supabase } from '$lib/supabaseClient';
import { notas, cargarNotas, simulacion } from './notas.svelte.js';
import { tèxteElement, tèxteFicha, empremta } from './empremtas.js';
import { fargarCartas } from './pila.js';

export const validacions = $state({ per: {}, cargat: false, error: null });
export const pila = $state({ elements: [], fichas: [], cargat: false, error: null });

const k = (tipe, clau) => `${tipe}:${clau}`;
const ERROR_LECTURA = 'La base n’a pas répondu. Recharge la page dans un instant.';

export async function cargarValidacions() {
	if (simulacion()) {
		validacions.cargat = true;
		return;
	}
	const { data, error } = await supabase.from('validacions').select('tipe,clau,empremta').limit(5000);
	if (error) {
		validacions.error = ERROR_LECTURA;
		return;
	}
	validacions.per = Object.fromEntries((data ?? []).map((v) => [k(v.tipe, v.clau), v.empremta]));
	validacions.error = null;
	validacions.cargat = true;
}

/** les textes et liens publiés qui ont de l'occitan, avec leur empreinte */
async function cargarElements() {
	let lignes;
	if (simulacion()) {
		lignes = await exemplesElements();
	} else {
		const { data, error } = await supabase
			.from('pagina_elements')
			.select('clau,pagina,tipe,lista,ordre,oc,fr,ligam,visible,suprimit')
			.eq('estat', 'publicat')
			.in('tipe', ['text', 'ligam'])
			.limit(5000);
		if (error) throw new Error(ERROR_LECTURA);
		lignes = data ?? [];
	}
	const vius = lignes.filter((e) => !e.suprimit && e.visible !== false && tèxteElement(e.oc));
	return Promise.all(vius.map(async (e) => ({ ...e, empremta: await empremta(tèxteElement(e.oc)) })));
}

/** les fiches de grammaire pas encore marquées « validada » dans le code */
async function cargarFichas() {
	const { FICHAS } = await import('$lib/gramatica/index.js');
	return Promise.all(FICHAS.filter((f) => !f.validada).map(async (f) => ({ f, empremta: await empremta(tèxteFicha(f)) })));
}

/** tout ce que la pile montre (Per tu s'en sert aussi pour compter) */
export async function cargarPila() {
	try {
		const [elements, fichas] = await Promise.all([cargarElements(), cargarFichas(), cargarNotas(), cargarValidacions()]);
		pila.elements = elements;
		pila.fichas = fichas;
		pila.error = notas.error ?? validacions.error ?? null;
		pila.cargat = !pila.error;
	} catch (e) {
		pila.error = e?.message || ERROR_LECTURA;
	}
}

/** les cartes, dans l'ordre (pila.js) */
export const cartas = ({ lot = null, maiTard = [] } = {}) =>
	fargarCartas({ notas: notas.lista, elements: pila.elements, fichas: pila.fichas, validacions: validacions.per, maiTard, lot });

/** « Bon » : l'empreinte est gardée. Rend de quoi revenir en arrière. */
export async function validar(tipe, clau, emp) {
	const avant = validacions.per[k(tipe, clau)] ?? null;
	if (!simulacion()) {
		const { error } = await supabase.from('validacions').upsert({ tipe, clau, empremta: emp }, { onConflict: 'tipe,clau' });
		if (error) return { error: 'La validation n’est pas partie. Réessaie dans un instant.' };
	}
	validacions.per[k(tipe, clau)] = emp;
	return { tornar: () => restablirValidacion(tipe, clau, avant) };
}

/** « Tot bon » sur une page : plusieurs validations d'un coup ({ tipe, clau, empremta }) */
export async function validarTot(lignes) {
	if (!lignes.length) return null;
	if (!simulacion()) {
		const { error } = await supabase.from('validacions').upsert(lignes, { onConflict: 'tipe,clau' });
		if (error) return 'La validation n’est pas partie. Réessaie dans un instant.';
	}
	for (const l of lignes) validacions.per[k(l.tipe, l.clau)] = l.empremta;
	return null;
}

async function restablirValidacion(tipe, clau, avant) {
	if (!simulacion()) {
		const { error } = avant
			? await supabase.from('validacions').upsert({ tipe, clau, empremta: avant }, { onConflict: 'tipe,clau' })
			: await supabase.from('validacions').delete().eq('tipe', tipe).eq('clau', clau);
		if (error) return 'Le retour en arrière n’a pas marché. Réessaie dans un instant.';
	}
	if (avant) validacions.per[k(tipe, clau)] = avant;
	else delete validacions.per[k(tipe, clau)];
	return null;
}

// --- « Mai tard » : les cartes remises au bout, le temps de la session -----
const CLAU_MAI_TARD = 'lo-ligam-pila-mai-tard';
export function legirMaiTard() {
	try {
		const v = JSON.parse(sessionStorage.getItem(CLAU_MAI_TARD) ?? '[]');
		return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(-500) : [];
	} catch {
		return [];
	}
}
export function gardarMaiTard(ids) {
	try {
		sessionStorage.setItem(CLAU_MAI_TARD, JSON.stringify(ids.slice(-500)));
	} catch {
		// stockage indisponible : l'ordre se perdra au rechargement, rien de plus
	}
}

// --- mode d'essai (« ?edicion=simular », en développement seulement) -------
async function exemplesElements() {
	if (!import.meta.env.DEV) return [];
	const { default: filet } = await import('$lib/data/elements-filet.json');
	const lignes = [];
	for (const [pagina, v] of Object.entries(filet)) {
		if (pagina.startsWith('_')) continue;
		const rengs = Array.isArray(v) ? v : Object.entries(v).map(([clau, r]) => ({ clau, ...r }));
		for (const r of rengs) if (['text', 'ligam'].includes(r.tipe ?? 'text')) lignes.push({ ...r, tipe: r.tipe ?? 'text', pagina });
	}
	return lignes;
}
