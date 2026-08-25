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
	return s;
}
