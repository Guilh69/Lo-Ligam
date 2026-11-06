// Lo talhièr, lot 1 (Romain, 2026-11-06 ; revisions/2026-11-06-talhier.md) :
// les notes que Romain épingle sur les pages, et la liste « Per tu ».
//
// Les notes vivent dans la table des remarques de relecture (verrous :
// supabase/supabase-remarcas.sql et supabase/supabase-notas.sql) ; seul
// l'administrateur les lit. L'IA, Claude ou Mistral, les relève en début de
// séance (cd app && node scripts/remarcas.mjs), répond, et peut poser des
// questions à Romain. Les choix du tri (/admin/triar) restent à part.
import { browser } from '$app/environment';
import { supabase } from '$lib/supabaseClient';

export const PAGINA_TRIAR = '/admin/triar';
const COLOMNAS = 'id,pagina,modul,etapa,bloc,cibla,clau,extrait,tèxte,autor,estat,responsa,autor_responsa,per,de_romain,vista,created_at';

/** En développement, « ?edicion=simular » montre le talhièr sans compte, avec
 *  des notes d'exemple, sans rien écrire dans la base (comme l'éditeur). */
export const simulacion = () => browser && import.meta.env.DEV && new URLSearchParams(location.search).get('edicion') === 'simular';

export const notas = $state({ lista: [], cargat: false, error: null });

/** Où en est une note, vue par Romain :
 *  regarder (l'IA a répondu) · question (de l'IA) · nòta (pour lui-même) ·
 *  espèra (attend l'IA) · respost (il a répondu, l'IA n'a pas encore lu) */
export function sòrta(r) {
	if (r.per === 'ia') return r.estat === 'dubèrta' ? 'espèra' : 'regarder';
	if (r.de_romain) return 'nòta';
	return r.estat === 'dubèrta' ? 'question' : 'respost';
}
/** Ce qui attend la main de Romain */
export const perTu = (r) => ['regarder', 'question', 'nòta'].includes(sòrta(r));
export const comptePerTu = () => notas.lista.filter(perTu).length;

/** Les notes vivantes (pas encore vues), les plus récentes d'abord */
export async function cargarNotas() {
	if (simulacion()) {
		if (!notas.cargat) notas.lista = exemples();
		notas.cargat = true;
		return;
	}
	const { data, error } = await supabase
		.from('remarcas')
		.select(COLOMNAS)
		.neq('pagina', PAGINA_TRIAR)
		.eq('vista', false)
		.order('id', { ascending: false })
		.limit(300);
	if (error) {
		notas.error = 'Les notes n’ont pas pu être lues. Recharge la page dans un instant.';
		return;
	}
	notas.lista = data ?? [];
	notas.error = null;
	notas.cargat = true;
}

/** Une ligne, sans retour à la ligne ni caractère de contrôle (la base les refuse) */
export const linha = (s, max) =>
	String(s ?? '')
		.replace(/[\u0000-\u001f\u007f-\u009f\p{Zl}\p{Zp}]+/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, max);

async function escriure(fach, local) {
	if (simulacion()) {
		local();
		return null;
	}
	const { error } = await fach();
	if (error) return 'L’envoi n’a pas marché. Réessaie dans un instant.';
	await cargarNotas();
	return null;
}

/** Épingler une note : per = 'ia' (à faire par l'IA) ou 'romain' (pour lui) */
export function mandarNota({ pagina, clau = null, cibla = null, extrait = null, tèxte, per = 'ia' }) {
	const ligne = {
		pagina: linha(pagina, 200) || '/',
		clau: linha(clau, 120) || null,
		cibla: linha(cibla, 300) || null,
		extrait: linha(extrait, 500) || null,
		tèxte: tèxte.trim().slice(0, 2000),
		autor: 'Romain',
		per,
		de_romain: true
	};
	return escriure(
		() => supabase.from('remarcas').insert(ligne),
		() => notas.lista.unshift({ ...ligne, id: Date.now(), estat: 'dubèrta', vista: false, responsa: null, autor_responsa: null, created_at: new Date().toISOString() })
	);
}

/** « Bon » : la réponse est vue (ou la note pour soi est faite) ; elle sort de la liste */
export function bon(r) {
	return escriure(
		() => supabase.from('remarcas').update({ vista: true }).eq('id', r.id),
		() => (notas.lista = notas.lista.filter((n) => n.id !== r.id))
	);
}

/** « Pas encara » : la note repart à l'IA, avec sa réponse et la précision de Romain */
export function pasEncara(r, precision) {
	const fil = `${r.tèxte}\n\n[${r.autor_responsa ?? 'IA'}] ${r.responsa ?? '(sans réponse)'}\n[Romain] ${precision.trim()}`;
	if (fil.length > 2000) return Promise.resolve('C’est trop long pour une seule note : supprime-la et épingle une note neuve.');
	const cambi = { estat: 'dubèrta', tèxte: fil, responsa: null, autor_responsa: null, vista: false };
	return escriure(
		() => supabase.from('remarcas').update(cambi).eq('id', r.id),
		() => Object.assign(r, cambi)
	);
}

/** Répondre à une question de l'IA */
export function respondre(r, tèxte) {
	const cambi = { responsa: tèxte.trim().slice(0, 2000), estat: 'tractada', autor_responsa: 'Romain' };
	return escriure(
		() => supabase.from('remarcas').update(cambi).eq('id', r.id),
		() => Object.assign(r, cambi)
	);
}

export function suprimir(r) {
	return escriure(
		() => supabase.from('remarcas').delete().eq('id', r.id),
		() => (notas.lista = notas.lista.filter((n) => n.id !== r.id))
	);
}

/** La note toute prête, pour la coller dans une conversation avec l'IA */
export function tèxteACopiar(r) {
	return [
		`Note de Romain (n° ${r.id}) sur https://loligam.eu${r.pagina}${r.clau ? `, élément ${r.clau}` : ''}`,
		r.extrait ? `Endroit : « ${r.extrait} »` : 'Endroit : toute la page',
		`Demande : ${r.tèxte}`,
		'Une fois fait : cd app && node scripts/remarcas.mjs --tractar ' + r.id + ' --responsa "…" --autor …'
	].join('\n');
}

/** Retrouver sur la page l'endroit d'une note : par sa clé d'élément, sinon par son texte */
export const SELECTOR_TÈXTE = 'p, li, button, a, td, th, h1, h2, h3, h4, label, summary, figcaption, blockquote, .chip, .ditz';
export const tèxteDe = (el) => linha(el.innerText ?? el.textContent, 300);
export function trobar(r) {
	if (!browser) return null;
	if (r.clau) {
		const el = document.querySelector(`[data-clau="${CSS.escape(r.clau)}"]`);
		if (el) return el;
	}
	if (r.extrait) for (const el of document.querySelectorAll(SELECTOR_TÈXTE)) if (tèxteDe(el) === r.extrait) return el;
	return null;
}

function exemples() {
	const ara = Date.now();
	const jorn = (n) => new Date(ara - n * 86400000).toISOString();
	return [
		{ id: 5, pagina: '/', clau: 'acuelh.eros.titol.1', extrait: 'Se parla.', tèxte: 'Ce titre un peu plus gros sur téléphone.', autor: 'Romain', per: 'ia', de_romain: true, estat: 'tractada', responsa: 'Fait : le titre passe de 2,4 à 2,8 rem sur les petits écrans.', autor_responsa: 'Mistral', vista: false, created_at: jorn(1) },
		{ id: 4, pagina: '/apren', clau: null, extrait: null, tèxte: 'Pour la fiche « L’article défini », tu préfères garder les deux exemples, ou un seul ?', autor: 'Claude', per: 'romain', de_romain: false, estat: 'dubèrta', responsa: null, autor_responsa: null, vista: false, created_at: jorn(0) },
		{ id: 3, pagina: '/visio', clau: null, extrait: null, tèxte: 'Refaire la photo du haut de la page Visio.', autor: 'Romain', per: 'romain', de_romain: true, estat: 'dubèrta', responsa: null, autor_responsa: null, vista: false, created_at: jorn(2) },
		{ id: 2, pagina: '/', clau: null, extrait: null, tèxte: 'Ajouter un lien vers la carte dans le pied de page.', autor: 'Romain', per: 'ia', de_romain: true, estat: 'dubèrta', responsa: null, autor_responsa: null, vista: false, created_at: jorn(0) },
		{ id: 1, pagina: '/aprene/modul/2-3', modul: '2-3', etapa: 1, clau: null, extrait: null, tèxte: 'Le bouton pour écouter est difficile à trouver sur mon téléphone.', autor: 'Marie', per: 'ia', de_romain: false, estat: 'dubèrta', responsa: null, autor_responsa: null, vista: false, created_at: jorn(3) }
	];
}
