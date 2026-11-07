// Les objets qui flottent sur le fond (page d'essai /ensag/flotants, 2026-11-07), en papier découpé :
// des pièces pleines aux couleurs de la palette, sans trait ni dégradé (l'ombre courte est posée par le CSS).
// Chaque mot occitan est passé à l'API de lo Congrès (verificar-oc.mjs, 07-11, variété languedocienne) ;
// l'usage et le sens restent à valider par Romain. Dessinés dans un carré de 48 sur 48.
import { TEINTES as T } from '$lib/styles/palette.js';

/** une étoile à n branches, centrée en (cx, cy) */
const etoile = (cx, cy, R, r, n = 5) => {
	const pts = [];
	for (let k = 0; k < n * 2; k++) {
		const a = (Math.PI * k) / n - Math.PI / 2;
		const rr = k % 2 ? r : R;
		pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
	}
	return `M${pts.join(' L')} Z`;
};
/** les huit rayons du soleil, des petits triangles tournés autour du centre */
const rayons = Array.from({ length: 8 }, (_, k) => `<path d="M24 1.5 L28.5 12 H19.5 Z" transform="rotate(${k * 45} 24 24)"/>`).join('');

export const OBJETS = [
	{
		id: 'cigala',
		oc: 'cigala',
		fr: 'la cigale',
		svg: `<ellipse cx="24" cy="28" rx="7.5" ry="13" fill="${T.olive}" transform="rotate(18 24 28)"/>
			<circle cx="31.5" cy="13" r="5.5" fill="${T.olive}"/><circle cx="33.2" cy="11.8" r="1.5" fill="#fff"/>
			<path d="M22 21 C8 13 4 32 19 38 C22 31 24 25 22 21Z" fill="${T.orangeClair}"/>
			<path d="M26 19 C39 11 45 29 30 36 C28 29 27 24 26 19Z" fill="${T.or}"/>`
	},
	{
		id: 'oliva',
		oc: 'oliva',
		fr: 'l’olive',
		svg: `<ellipse cx="24" cy="29" rx="11" ry="14.5" fill="${T.olive}" transform="rotate(-18 24 29)"/>
			<ellipse cx="19.5" cy="24" rx="2.8" ry="5.2" fill="#7a9a3c" transform="rotate(-18 19.5 24)"/>
			<path d="M26 14 C28 7 35 5 40 8 C38 14 32 17 26 14Z" fill="#355020"/>
			<path d="M26 15 L23 9" stroke="${T.brun}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`
	},
	{
		id: 'solelh',
		oc: 'solelh',
		fr: 'le soleil',
		svg: `<g fill="${T.or}">${rayons}</g><circle cx="24" cy="24" r="11.5" fill="${T.ocreAction}"/>`
	},
	{
		id: 'estela',
		oc: 'estela',
		fr: 'l’étoile',
		svg: `<path d="${etoile(24, 25, 21, 9)}" fill="${T.or}" stroke="${T.or}" stroke-width="2.5" stroke-linejoin="round"/>`
	},
	{
		id: 'clau',
		oc: 'clau',
		fr: 'la clé',
		svg: `<path fill="${T.ocreAction}" fill-rule="evenodd" d="M24 4a9 9 0 1 0 0 18a9 9 0 0 0 0-18Zm0 5.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7Z"/>
			<rect x="21.8" y="20" width="4.4" height="24" rx="2" fill="${T.ocreAction}"/>
			<rect x="26" y="31" width="8" height="4" rx="1.6" fill="${T.ocreAction}"/><rect x="26" y="38" width="6" height="4" rx="1.6" fill="${T.ocreAction}"/>`
	},
	{
		id: 'pan',
		oc: 'pan',
		fr: 'le pain',
		svg: `<ellipse cx="24" cy="27" rx="20" ry="12.5" fill="${T.ocre}"/>
			<rect x="10" y="19" width="5" height="12" rx="2.5" fill="#f3c775" transform="rotate(32 12.5 25)"/>
			<rect x="21.5" y="16" width="5" height="13" rx="2.5" fill="#f3c775" transform="rotate(32 24 22.5)"/>
			<rect x="33" y="19" width="5" height="12" rx="2.5" fill="#f3c775" transform="rotate(32 35.5 25)"/>`
	},
	{
		id: 'lavanda',
		oc: 'lavanda',
		fr: 'la lavande',
		svg: `<g stroke="${T.olive}" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M24 45 V17"/><path d="M24 45 C18 39 16 31 14 21"/><path d="M24 45 C30 39 32 31 34 21"/></g>
			<g fill="${T.prune}"><ellipse cx="24" cy="8" rx="3.3" ry="4.4"/><ellipse cx="24" cy="15" rx="3.3" ry="4.4"/><ellipse cx="24" cy="22" rx="3.3" ry="4.4"/>
			<ellipse cx="14" cy="13" rx="3.1" ry="4.2"/><ellipse cx="14" cy="20" rx="3.1" ry="4.2"/><ellipse cx="34" cy="13" rx="3.1" ry="4.2"/><ellipse cx="34" cy="20" rx="3.1" ry="4.2"/></g>`
	},
	{
		id: 'rosa',
		oc: 'ròsa',
		fr: 'la rose',
		svg: `<path d="M24 36 C22 42 17 45 10 45 C10 38 15 35 24 36Z" fill="${T.olive}"/>
			<circle cx="24" cy="22" r="16" fill="${T.rougeAction}"/><circle cx="24" cy="22" r="10.5" fill="${T.brique}"/><circle cx="24" cy="22" r="5.2" fill="${T.rougeAction}"/>`
	},
	{
		id: 'nivol',
		oc: 'nívol',
		fr: 'le nuage',
		svg: `<g fill="${T.bleu}"><circle cx="15" cy="29" r="9"/><circle cx="26" cy="22" r="11.5"/><circle cx="36" cy="29.5" r="8.5"/><rect x="9" y="29" width="34" height="9.5" rx="4.7"/></g>`
	},
	{
		id: 'luna',
		oc: 'luna',
		fr: 'la lune',
		svg: `<path d="M31 4 A20 20 0 1 0 44 33 A15.5 15.5 0 1 1 31 4Z" fill="${T.or}"/>`
	},
	{
		id: 'fuelha',
		oc: 'fuèlha',
		fr: 'la feuille',
		svg: `<path d="M8 40 C6 18 20 6 42 6 C42 28 30 42 8 40Z" fill="${T.olive}"/>
			<path d="M10 38 C18 28 26 20 36 12" stroke="#7a9a3c" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
	}
];
