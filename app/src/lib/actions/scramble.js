// Chaque lettre s'efface dans un léger flou puis redevient nette une
// fois remplacée, en cascade de gauche à droite. Volontairement sans
// inline-block ni transform : les lettres restent des éléments inline
// tout à fait normaux (comme du texte ordinaire), pour que le
// retour à la ligne se comporte exactement comme du texte non animé
// — jamais de coupure au milieu d'un mot.
function makeSpan(ch) {
	const span = document.createElement('span');
	span.textContent = ch;
	span.style.opacity = '1';
	span.style.filter = 'blur(0px)';
	span.style.transition = 'opacity 420ms ease-in-out, filter 420ms ease-in-out';
	return span;
}

export function scramble(node, text) {
	function build(str) {
		node.textContent = '';
		const frag = document.createDocumentFragment();
		const list = [];
		for (const ch of str) {
			const span = makeSpan(ch);
			frag.appendChild(span);
			list.push(span);
		}
		node.appendChild(frag);
		return list;
	}

	let spans = build(text);
	let timers = [];

	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function run(newText) {
		clearTimers();
		const newChars = Array.from(newText);
		const maxLen = Math.max(spans.length, newChars.length);

		while (spans.length < maxLen) {
			const span = makeSpan('');
			span.style.opacity = '0';
			node.appendChild(span);
			spans.push(span);
		}
		while (spans.length > maxLen) {
			node.removeChild(spans.pop());
		}

		// Décalage fixe et modeste par lettre : à tout instant, seule une
		// poignée de lettres est en transition (même sur un long
		// paragraphe), ce qui reste léger et fluide plutôt que de tout
		// faire flou en même temps. Durées plus longues et flou très léger
		// pour une transition douce, jamais brusque.
		const perCharStagger = 7;
		const hideDuration = 280;

		spans.forEach((span, i) => {
			const oldCh = span.textContent;
			const newCh = newChars[i] ?? '';
			if (oldCh === newCh) return;
			const delay = i * perCharStagger;
			timers.push(
				setTimeout(() => {
					span.style.opacity = '0.1';
					span.style.filter = 'blur(1.5px)';
				}, delay),
				setTimeout(() => {
					span.textContent = newCh;
					span.style.opacity = '1';
					span.style.filter = 'blur(0px)';
				}, delay + hideDuration)
			);
		});
	}

	return {
		update(newText) {
			const current = spans.map((s) => s.textContent).join('');
			if (newText !== current) run(newText);
		},
		destroy() {
			clearTimers();
		}
	};
}
