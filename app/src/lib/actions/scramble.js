const CHARSET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzàâäéèêëïîôöùûüçòãÒ█▓▒░";

function randomChar() {
	if (Math.random() < 0.16) {
		return '█▓▒░'[Math.floor(Math.random() * 4)];
	}
	return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

// Effet « décodage rétro » : au lieu d'un simple fondu, chaque lettre défile
// dans des caractères aléatoires (dont quelques blocs pixel) avant de se
// stabiliser sur la bonne lettre, en cascade de gauche à droite. La durée
// totale reste bornée (revealSpread) même pour les longs paragraphes, pour
// que l'effet reste rapide quel que soit le texte.
export function scramble(node, text) {
	let frame;

	function renderFrame(target, elapsed, revealSpread, scrambleWindow) {
		let out = '';
		for (let i = 0; i < target.length; i++) {
			const ch = target[i];
			if (ch === ' ' || ch === '\n') {
				out += ch;
				continue;
			}
			const charStart = (i / target.length) * revealSpread;
			const progress = (elapsed - charStart) / scrambleWindow;
			if (progress >= 1) {
				out += ch;
			} else if (progress < 0) {
				out += ' ';
			} else {
				out += randomChar();
			}
		}
		node.textContent = out;
	}

	function run(newText) {
		cancelAnimationFrame(frame);
		const scrambleWindow = 160;
		const revealSpread = Math.min(320, Math.max(60, newText.length * 7));
		const totalDuration = revealSpread + scrambleWindow;
		const startTime = performance.now();

		function tick(now) {
			const elapsed = now - startTime;
			if (elapsed >= totalDuration) {
				node.textContent = newText;
				return;
			}
			renderFrame(newText, elapsed, revealSpread, scrambleWindow);
			frame = requestAnimationFrame(tick);
		}

		frame = requestAnimationFrame(tick);
	}

	node.textContent = text;

	return {
		update(newText) {
			if (newText !== node.textContent) run(newText);
		},
		destroy() {
			cancelAnimationFrame(frame);
		}
	};
}
