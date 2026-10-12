// Outils des « Enquêtes vocales » de l'Atlas sonore (LISN) sur la carte :
// le lecteur « Ondas » (VotzAtlas.svelte) et, plus tard, la carte des mots.
// Données : static/data/enquistas-lisn.json (SIG/cadena/lisn-enquistas.mjs).

export const ATLAS_LISN = 'https://atlas.lisn.upsaclay.fr';

// adresse du son sur le site de l'Atlas (rien n'est copié chez nous)
export const sonDe = (s) => (/^sounds\/[^?#<>"]+\.mp3$/i.test(s ?? '') ? ATLAS_LISN + '/' + encodeURI(s) : null);

// la fable découpée en phrases
export const frasas = (t) => (t ?? '').split(/(?<=[.;!?])\s+/).filter(Boolean);

// La phrase en cours d'après l'avancée de l'écoute (0 à 1). L'Atlas ne donne
// pas le minutage : on suppose un débit régulier, la phrase est estimée au
// prorata de sa longueur (à une seconde près).
export function frasaAra(liste, part) {
	const total = liste.reduce((s, f) => s + f.length, 0);
	if (!total || !(part > 0)) return part > 0 ? 0 : -1;
	let cumul = 0;
	for (let i = 0; i < liste.length; i++) {
		cumul += liste[i].length;
		if (part * total < cumul) return i;
	}
	return liste.length - 1;
}

// le point le plus proche qu'on n'a pas encore écouté
export function vesina(ponches, p, escotats = new Set()) {
	const kx = Math.cos((p.lat * Math.PI) / 180);
	let mielh = null,
		d = Infinity;
	for (const q of ponches) {
		if (q === p || escotats.has(q.so)) continue;
		const e = Math.hypot((q.lon - p.lon) * kx, q.lat - p.lat);
		if (e < d) (d = e), (mielh = q);
	}
	return mielh;
}

// Les données ne sont chargées qu'une fois (la carte et la fiche de la ville
// partagent les mêmes objets : un point est le même partout)
let promesa = null;
export function cargarVotz() {
	promesa ??= fetch('/data/enquistas-lisn.json')
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null)
		.then((d) => {
			if (!d?.ponches) promesa = null;
			return d;
		});
	return promesa;
}

// une seule voix à la fois, où qu'on l'ait lancée
let sonActual = null;
export function sonSol(audio) {
	if (sonActual && sonActual !== audio) sonActual.pause();
	sonActual = audio;
}

// distance en kilomètres (assez juste à cette échelle)
export function km(a, b) {
	const kx = Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180);
	return Math.hypot((a.lon - b.lon) * kx, a.lat - b.lat) * 111.2;
}
// l'enregistrement le plus proche d'un lieu, s'il y en a un à moins de max km
export function pròcha(ponches, luòc, max = 25) {
	let mielh = null,
		d = Infinity;
	for (const p of ponches ?? []) {
		const e = km(p, luòc);
		if (e < d) (d = e), (mielh = p);
	}
	return mielh && d <= max ? { p: mielh, d } : null;
}

export const minutas = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
