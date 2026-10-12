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

export const minutas = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
