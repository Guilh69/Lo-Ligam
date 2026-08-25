import { browser } from '$app/environment';

// Sons de retour partagés par les leçons. Ce sont les sons validés à
// l'oreille par Romain sur /aprene/essai : le « whoosh » d'air pour une
// bonne réponse, la note douce pour une réussite plus grande. L'appelant
// vérifie lui-même le mode muet avant d'appeler.

export function playTick() {
	if (!browser) return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const now = ctx.currentTime;
		const duration = 0.18;

		const bufferSize = Math.floor(ctx.sampleRate * duration);
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

		const noise = ctx.createBufferSource();
		noise.buffer = buffer;

		const filter = ctx.createBiquadFilter();
		filter.type = 'bandpass';
		filter.Q.value = 0.7;
		filter.frequency.setValueAtTime(500, now);
		filter.frequency.exponentialRampToValueAtTime(2000, now + duration * 0.55);
		filter.frequency.exponentialRampToValueAtTime(350, now + duration);

		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(0.2, now + duration * 0.25);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

		noise.connect(filter).connect(gain).connect(ctx.destination);
		noise.start(now);
		noise.stop(now + duration);
	} catch (e) {
		/* Web Audio indisponible : on continue sans son, jamais bloquant. */
	}
}

export function playChime() {
	if (!browser) return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const now = ctx.currentTime;
		const freq = 1567.98; // G6 : aigu, clair

		const filter = ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = 2600;
		filter.Q.value = 0.4;
		filter.connect(ctx.destination);

		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.value = freq;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
		osc.connect(gain).connect(filter);
		osc.start(now);
		osc.stop(now + 1.12);

		const undertone = ctx.createOscillator();
		undertone.type = 'sine';
		undertone.frequency.value = freq / 2;
		const undertoneGain = ctx.createGain();
		undertoneGain.gain.setValueAtTime(0.0001, now);
		undertoneGain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
		undertoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
		undertone.connect(undertoneGain).connect(filter);
		undertone.start(now);
		undertone.stop(now + 1.02);
	} catch (e) {
		/* Web Audio indisponible : on continue sans son, jamais bloquant. */
	}
}
