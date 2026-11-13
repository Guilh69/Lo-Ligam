// Les emplacements que Romain dessine sur ses photos (S'imagina, 2026-11-13). Sa demande, après trois essais de
// plaque posée par l'IA (« elle est floue et de toute façon mal placée ») : « sur les photos il faut que je puisse
// dessiner un emplacement avec ce que j'imagine (pharmacie, plaque de rue, pub...) et ensuite tu codes ».
//
// L'endroit et l'idée viennent donc de lui ; l'IA ne fabrique le montage qu'ensuite (outils/photos-oc/talhar.py).
// Rien de neuf dans la base : chaque emplacement est une note de Romain pour l'IA (table remarcas, Lo talhièr),
// relevée en début de séance par `node scripts/remarcas.mjs`. La note porte :
//   pagina  : PAGINA
//   cibla   : « foto=<clau> zona=x0,y0,x1,y1 natura=<id> estil=<id> quad=x,y,x,y,x,y,x,y » (une ligne ; zona en
//             fractions de la photo, 0 à 1, depuis le coin haut gauche). Depuis le 13-11 au soir (« il faut que
//             l'outil soit capable de mettre en place la bonne perspective et que je puisse choisir le style ») :
//             estil = le style choisi (estils.js), quad = les quatre coins de la forme couchée sur le mur, tels
//             que Romain les a vus dans l'aperçu (haut gauche, haut droit, bas droit, bas gauche ; perspectiva.js).
//             Le montage se fabrique sur ces coins-là. Les notes d'avant n'ont ni estil ni quad.
//   extrait : le texte qu'il imagine à cet endroit
//   tèxte   : la même chose en clair, avec le style, la façon dont la perspective a été réglée, sa précision

import { ESTILS, nomEstil } from './estils.js';

export const PAGINA = '/admin/imaginar';

/** Ce qu'on peut imaginer à un endroit. `exemple` sert d'amorce dans le champ de texte. */
export const NATURAS = [
	{ id: 'placa', fr: 'Plaque de rue', exemple: 'Rue de la Loge' },
	{ id: 'ensenha', fr: 'Enseigne de commerce', exemple: 'Pharmacie' },
	{ id: 'publicitat', fr: 'Publicité, affiche', exemple: 'Une réclame pour un vin du pays' },
	{ id: 'pintura', fr: 'Lettrage peint sur le mur', exemple: 'Boulangerie' },
	{ id: 'panel', fr: 'Panneau', exemple: 'Centre historique' },
	{ id: 'autre', fr: 'Autre chose', exemple: '' }
];
export const nomNatura = (id) => NATURAS.find((n) => n.id === id)?.fr ?? id;

/** Plus petit côté accepté (fraction de la photo) : en dessous, c'est un clic, pas un tracé. */
export const TALHA_MIN = 0.015;

const borna = (v) => Math.round(Math.min(1, Math.max(0, Number(v) || 0)) * 10000) / 10000;

/** Un rectangle remis dans l'ordre (haut gauche, bas droite), dans la photo, à quatre décimales. */
export function zonaNeta([xa, ya, xb, yb]) {
	const x0 = borna(Math.min(xa, xb)),
		x1 = borna(Math.max(xa, xb)),
		y0 = borna(Math.min(ya, yb)),
		y1 = borna(Math.max(ya, yb));
	return [x0, y0, x1, y1];
}

export const pronGranda = (z) => z[2] - z[0] >= TALHA_MIN && z[3] - z[1] >= TALHA_MIN;

const FOTO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// un coin peut déborder un peu de la photo (mur vu de biais au bord du cadre), jamais beaucoup
const coinNet = (v) => Math.round(Math.min(1.5, Math.max(-0.5, Number(v) || 0)) * 10000) / 10000;

/** La ligne rangée dans `cibla`. `estil` et `quad` vont ensemble : la forme couchée sur le mur, dans son style. */
export function codar({ foto, zona, natura, estil, quad }) {
	if (!FOTO.test(foto ?? '')) throw new Error('photo inconnue');
	if (!NATURAS.some((n) => n.id === natura)) throw new Error('nature inconnue');
	let l = `foto=${foto} zona=${zonaNeta(zona).join(',')} natura=${natura}`;
	if (estil != null) {
		if (!ESTILS.some((e) => e.id === estil)) throw new Error('style inconnu');
		l += ` estil=${estil}`;
	}
	if (quad != null) {
		if (quad.length !== 4 || quad.some((c) => c.length !== 2 || c.some((v) => !Number.isFinite(v)))) throw new Error('coins invalides');
		l += ` quad=${quad.flat().map(coinNet).join(',')}`;
	}
	return l;
}

/** L'inverse de codar ; null si la ligne n'est pas un emplacement valide. */
export function descodar(cibla) {
	const m = /^foto=(\S+) zona=([\d.]+),([\d.]+),([\d.]+),([\d.]+) natura=(\S+?)(?: estil=(\S+))?(?: quad=([-\d.,]+))?$/.exec(String(cibla ?? ''));
	if (!m || !FOTO.test(m[1]) || !NATURAS.some((n) => n.id === m[6])) return null;
	const zona = m.slice(2, 6).map(Number);
	if (zona.some((v) => !(v >= 0 && v <= 1)) || zona[0] >= zona[2] || zona[1] >= zona[3]) return null;
	const e = { foto: m[1], zona, natura: m[6] };
	if (m[7]) {
		if (!ESTILS.some((x) => x.id === m[7])) return null;
		e.estil = m[7];
	}
	if (m[8]) {
		const v = m[8].split(',').map(Number);
		if (v.length !== 8 || v.some((x) => !(x >= -0.5 && x <= 1.5))) return null;
		e.quad = [0, 2, 4, 6].map((i) => [v[i], v[i + 1]]);
	}
	return e;
}

/** La demande en clair, telle que l'IA la lit dans sa boîte. */
export function frasa({ foto, natura, estil, perspectiva, text, nota }) {
	const t = String(text ?? '').trim(),
		n = String(nota ?? '').trim();
	return [
		`Emplacement dessiné sur la photo « ${foto} » : ${nomNatura(natura).toLowerCase()}.`,
		estil ? `Style : ${nomEstil(estil).toLowerCase()}.` : '',
		perspectiva ? `Perspective : ${perspectiva}.` : '',
		t ? `Texte imaginé : « ${t} ».` : 'Pas de texte donné.',
		n ? `Précision : ${n}` : ''
	]
		.filter(Boolean)
		.join(' ');
}
