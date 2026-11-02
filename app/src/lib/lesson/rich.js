// Mini-rendu de texte pour le contenu des leçons : uniquement **gras** et
// *italique*, tout le reste est échappé. On n'embarque pas un moteur
// Markdown entier pour deux balises (sobriété).
export function rich(text) {
	let s = String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	// Un mot à trait d'union reste entier (classe globale .mot-lie, app.css),
	// et une terminaison (-ar, -am, -ièra) ne se détache pas de son tiret.
	s = s.replace(
		/(^|[\s>(«])(-\p{L}[^\s<>]*)|[^\s<>]*\p{L}-\p{L}[^\s<>]*/gu,
		(m, avant, fin) => (fin ? `${avant}<span class="mot-lie">${fin}</span>` : `<span class="mot-lie">${m}</span>`)
	);
	return insecable(s);
}

// Typographie française : espace insécable avant ! ? ; : » et après «, pour
// qu'aucun « ! » ne se retrouve seul en début de ligne (titres compris) ; le
// point médian des listes (« Adieu ! · Bonjorn ! ») reste en fin de ligne.
export function insecable(text) {
	return String(text ?? '')
		.replace(/ ([!?;:»·])/g, ' $1')
		.replace(/« /g, '« ');
}
