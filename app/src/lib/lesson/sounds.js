import { browser } from '$app/environment';

// Sons de retour partagés par les leçons. Ce sont les sons validés à
// l'oreille par Romain sur /aprene/essai : le « whoosh » d'air pour une
// bonne réponse, la note douce pour une réussite plus grande. L'appelant
// vérifie lui-même le mode muet avant d'appeler.
//
// Un seul contexte audio pour toute la page : le navigateur en limite le
// nombre, et une leçon joue des dizaines de sons (audit du 2026-10-08).
let ctxAudio;

export function playTick() {
	if (!browser) return;
	try {
		const ctx = (ctxAudio ??= new (window.AudioContext || window.webkitAudioContext)());
		if (ctx.state === 'suspended') ctx.resume();
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
		const ctx = (ctxAudio ??= new (window.AudioContext || window.webkitAudioContext)());
		if (ctx.state === 'suspended') ctx.resume();
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

// ── Les notes des jeux (2026-11-06, « améliore encore les jeux ») ─────────
// Une gamme pentatonique de sol, accordée sur la note douce (sol 6) : chaque
// bonne lettre de la sèrp, chaque mot bien rangé dans un panier monte d'un
// degré ; à la fin, la gamme remonte en arpège avec l'onde dorée, et la note
// douce conclut. Une lettre fausse ou un mot mal rangé : une note grave et
// sourde, brève (rien de punitif, jamais un buzzer). Sons de synthèse, aucun
// fichier à charger (sobriété).
const GAMMA = [392, 440, 493.88, 587.33, 659.25, 783.99, 880, 987.77, 1174.66, 1318.51, 1567.98];

/** Une note de la gamme (degré 0 = sol 4), jouée dans `retard` secondes. */
export function playNota(grau = 0, retard = 0) {
	if (!browser) return;
	try {
		const ctx = (ctxAudio ??= new (window.AudioContext || window.webkitAudioContext)());
		if (ctx.state === 'suspended') ctx.resume();
		const t0 = ctx.currentTime + Math.max(0, retard);
		const f = GAMMA[Math.max(0, Math.min(GAMMA.length - 1, Math.round(grau)))];

		const filtre = ctx.createBiquadFilter();
		filtre.type = 'lowpass';
		filtre.frequency.value = 3200;
		filtre.Q.value = 0.3;
		filtre.connect(ctx.destination);

		// le corps : un triangle, attaque courte, extinction en une demi-seconde
		const osc = ctx.createOscillator();
		osc.type = 'triangle';
		osc.frequency.value = f;
		const g = ctx.createGain();
		g.gain.setValueAtTime(0.0001, t0);
		g.gain.exponentialRampToValueAtTime(0.15, t0 + 0.012);
		g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
		osc.connect(g).connect(filtre);
		osc.start(t0);
		osc.stop(t0 + 0.52);

		// l'octave, très bas et très bref : le grain d'une petite cloche de bois
		const o2 = ctx.createOscillator();
		o2.type = 'sine';
		o2.frequency.value = f * 2;
		const g2 = ctx.createGain();
		g2.gain.setValueAtTime(0.0001, t0);
		g2.gain.exponentialRampToValueAtTime(0.035, t0 + 0.008);
		g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
		o2.connect(g2).connect(filtre);
		o2.start(t0);
		o2.stop(t0 + 0.22);
	} catch (e) {
		/* Web Audio indisponible : on continue sans son, jamais bloquant. */
	}
}

/** La note sourde : une lettre fausse, un mot qui remonte. */
export function playSorda() {
	if (!browser) return;
	try {
		const ctx = (ctxAudio ??= new (window.AudioContext || window.webkitAudioContext)());
		if (ctx.state === 'suspended') ctx.resume();
		const t0 = ctx.currentTime;
		const filtre = ctx.createBiquadFilter();
		filtre.type = 'lowpass';
		filtre.frequency.value = 900;
		filtre.connect(ctx.destination);
		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(196, t0); // sol 3
		osc.frequency.exponentialRampToValueAtTime(174.6, t0 + 0.2);
		const g = ctx.createGain();
		g.gain.setValueAtTime(0.0001, t0);
		g.gain.exponentialRampToValueAtTime(0.13, t0 + 0.015);
		g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
		osc.connect(g).connect(filtre);
		osc.start(t0);
		osc.stop(t0 + 0.28);
	} catch (e) {
		/* Web Audio indisponible : on continue sans son, jamais bloquant. */
	}
}

/**
 * La gamme qui remonte avec l'onde dorée de fin : `n` notes, une toutes les
 * `pas` secondes (le même pas que l'onde), dans `debut` secondes, puis la
 * note douce.
 */
export function playArpegi(n = 5, pas = 0.09, debut = 0) {
	const k = Math.max(1, Math.min(n, GAMMA.length - 1));
	for (let i = 0; i < k; i++) playNota(i, debut + i * pas);
	if (!browser) return;
	setTimeout(playChime, Math.round((debut + k * pas + 0.06) * 1000));
}
