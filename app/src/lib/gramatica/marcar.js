// Le petit balisage des textes des fiches de grammaire (mode d'emploi :
// LEGIR-ME.md, à côté). Tout le reste est échappé : une fiche ne peut pas
// glisser de HTML. On n'embarque pas de moteur Markdown (sobriété).
import { insecable } from '$lib/lesson/rich.js';

const echapar = (s) =>
	String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

/** « parl|i:ar » → { rad: 'parl', fin: 'i', color: 'ar' } ; sans « :… », la couleur est la fin */
export function copa(s) {
	const [rad, reste = ''] = String(s).split('|');
	const [fin, color = fin.replace(/^-/, '')] = reste.split(':');
	return { rad, fin, color };
}

/** la classe de couleur d'une clé de la fiche (« ar » → « c-pruna ») */
export const classeColor = (colors, cle) => (colors?.[cle] ? `c-${colors[cle]}` : '');

/**
 * **gras** · *mot occitan* · _Titre_ ou _es:Título_ (œuvre citée, avec sa langue)
 * · [radical|fin] ou [radical|fin:couleur] (fin en couleur) · [texte](/adresse)
 */
export function marcar(text, colors) {
	let s = echapar(text);
	// un lien : une page du site (« /… ») ou une adresse https ; rien d'autre
	s = s.replace(/\[([^\]|]+)\]\(([^)\s]+)\)/g, (m, t, href) =>
		/^https:\/\//.test(href) ? `<a href="${href}" rel="noopener">${t}</a>` : /^\/(?!\/)/.test(href) ? `<a href="${href}">${t}</a>` : t
	);
	s = s.replace(/\[([^\]|]*)\|([^\]]*)\]/g, (m, rad, reste) => {
		const c = copa(rad + '|' + reste);
		return `<span class="mot-lie" lang="oc">${c.rad}<b class="fin ${classeColor(colors, c.color)}">${c.fin}</b></span>`;
	});
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	s = s.replace(/\*([^*]+)\*/g, '<i lang="oc">$1</i>');
	s = s.replace(/(^|[\s(«>])_(?:([a-z]{2}):)?([^_]+)_/g, (m, avant, lang, t) =>
		lang ? `${avant}<cite lang="${lang}">${t}</cite>` : `${avant}<cite>${t}</cite>`
	);
	return insecable(s);
}
