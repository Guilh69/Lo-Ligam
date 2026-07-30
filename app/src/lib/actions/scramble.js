// Chaque lettre se floute et s'efface doucement, se remplace pendant
// qu'elle est invisible, puis redevient nette — en cascade légère de
// gauche à droite. Pas de caractères aléatoires : la transition ne
// porte que sur la lettre elle-même (opacité + flou), pour rester
// subtile et agréable à l'œil plutôt que « glitch ».
function makeSpan(ch) {
	const span = document.createElement('span');
	span.textContent = ch;
	span.style.display = ch === ' ' ? 'inline' : 'inline-block';
	span.style.opacity = '1';
	span.style.filter = 'blur(0px)';
	span.style.transform = 'translateY(0)';
	span.style.transition = 'opacity 190ms ease, filter 190ms ease, transform 190ms ease';
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

		// Étalement total plafonné : un long paragraphe ne prend pas plus de
		// temps qu'un mot court, juste une cascade plus resserrée.
		const revealSpread = Math.min(240, Math.max(50, maxLen * 8));
		const perCharStagger = revealSpread / maxLen;
		const hideDuration = 170;

		spans.forEach((span, i) => {
			const oldCh = span.textContent;
			const newCh = newChars[i] ?? '';
			if (oldCh === newCh) return;
			const delay = i * perCharStagger;
			timers.push(
				setTimeout(() => {
					span.style.opacity = '0';
					span.style.filter = 'blur(3px)';
					span.style.transform = 'translateY(3px)';
				}, delay),
				setTimeout(() => {
					span.textContent = newCh;
					span.style.display = newCh === ' ' ? 'inline' : 'inline-block';
					span.style.opacity = '1';
					span.style.filter = 'blur(0px)';
					span.style.transform = 'translateY(0)';
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
