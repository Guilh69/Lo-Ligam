// Sons de la carta : discrets, fabricats pel navegador (cap de fichièr a
// telecargar), e desactivables (interruptor dins lo tirador « Fons »,
// memorizat sus aqueste navegador).

const CLAU_SONS = 'lo-ligam-carta-sons';
let ctx = null;

export function sonsActius() {
	try {
		return localStorage.getItem(CLAU_SONS) !== '0';
	} catch {
		return true;
	}
}
export function gardarSons(actius) {
	try {
		localStorage.setItem(CLAU_SONS, actius ? '1' : '0');
	} catch {}
}

// Un papièr que se plega (plegar = true) o se desplega : un buf d'aire doç,
// sus lo modèl del « whoosh » validat per Romain pels leçons (lo primièr
// ensag, amb de crussiments e un tuc, èra « horrible »). Sens aguts : lo
// bruch passa per un filtre bas, e sa banda davala al plec, monta al desplec.
export function sonPapièr(plegar = true) {
	if (!sonsActius()) return;
	try {
		ctx ??= new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === 'suspended') ctx.resume();
		const t0 = ctx.currentTime + 0.01,
			durada = 0.3,
			n = Math.floor(ctx.sampleRate * durada);
		const buf = ctx.createBuffer(1, n, ctx.sampleRate);
		const d = buf.getChannelData(0);
		for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
		const font = ctx.createBufferSource();
		font.buffer = buf;
		const banda = ctx.createBiquadFilter();
		banda.type = 'bandpass';
		banda.Q.value = 0.6;
		banda.frequency.setValueAtTime(plegar ? 1300 : 550, t0);
		banda.frequency.exponentialRampToValueAtTime(plegar ? 550 : 1300, t0 + durada);
		const bas = ctx.createBiquadFilter();
		bas.type = 'lowpass';
		bas.frequency.value = 1800;
		const vol = ctx.createGain();
		vol.gain.setValueAtTime(0.0001, t0);
		vol.gain.exponentialRampToValueAtTime(0.08, t0 + durada * 0.35);
		vol.gain.exponentialRampToValueAtTime(0.0001, t0 + durada);
		font.connect(banda).connect(bas).connect(vol).connect(ctx.destination);
		font.start(t0);
		font.stop(t0 + durada);
	} catch {
		/* Web Audio indisponible : sens son, jamai blocant */
	}
}

// Los sons de l'entrada en scèna (demanda de Romain) : un gredon leugièr
// quand la còsta se traça, de pichons calhaus quand lo relèu monta, un
// rajòl leugièr quand los rius corron. Totes doces e baisses ; se copan
// d'un còp se l'entrada en scèna es acabada per un clic. Lo navegador los
// daissa partir sonque aprèp un gèst (lo clic sul ligam de la carta).
// Tòrna una foncion que los copa.
export function sonsIntro(INTRO) {
	if (!sonsActius()) return () => {};
	try {
		ctx ??= new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === 'suspended') ctx.resume();
		const t0 = ctx.currentTime + 0.05,
			sr = ctx.sampleRate;
		const mèstre = ctx.createGain();
		mèstre.gain.value = 1;
		mèstre.connect(ctx.destination);
		const bruch = (s) => {
			const b = ctx.createBuffer(1, Math.floor(sr * s), sr),
				d = b.getChannelData(0);
			for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
			return b;
		};
		const font = (buf, t, s) => {
			const f = ctx.createBufferSource();
			f.buffer = buf;
			f.start(t);
			f.stop(t + s);
			return f;
		};

		// lo gredon : de traches brèus de bruch aut e fin, un pauc irregulars
		{
			const [a, b] = INTRO.costa;
			const buf = bruch(b - a + 0.3);
			const f = font(buf, t0 + a, b - a + 0.3);
			const bp = ctx.createBiquadFilter();
			bp.type = 'bandpass';
			bp.frequency.value = 3200;
			bp.Q.value = 1.1;
			const lp = ctx.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 6000;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, t0 + a);
			for (let t = a; t < b; ) {
				const d = 0.12 + Math.random() * 0.16;
				g.gain.linearRampToValueAtTime(0.022 + Math.random() * 0.012, t0 + t + 0.03);
				g.gain.linearRampToValueAtTime(0.004, t0 + t + d);
				t += d + 0.02 + Math.random() * 0.05;
			}
			g.gain.linearRampToValueAtTime(0.0001, t0 + b + 0.2);
			f.connect(bp).connect(lp).connect(g).connect(mèstre);
		}

		// los calhaus : de pichons tucs mats (bruch brèu dins un ressonador),
		// mai espesses al mitan, sus un fons de tèrra fòrça leugièr
		{
			const [a, b] = INTRO.corbas;
			const buf = bruch(0.04);
			const n = 34;
			for (let i = 0; i < n; i++) {
				const u = Math.random();
				const t = t0 + a + (b - a) * (0.5 + (u < 0.5 ? -1 : 1) * Math.pow(Math.abs(u - 0.5) * 2, 0.7) * 0.5);
				const f = font(buf, t, 0.04);
				const bp = ctx.createBiquadFilter();
				bp.type = 'bandpass';
				bp.frequency.value = 700 + Math.random() * 1300;
				bp.Q.value = 6;
				const g = ctx.createGain();
				g.gain.setValueAtTime(0.0001, t);
				g.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.04, t + 0.004);
				g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05 + Math.random() * 0.04);
				f.connect(bp).connect(g).connect(mèstre);
			}
			const f = font(bruch(b - a + 0.4), t0 + a, b - a + 0.4);
			const lp = ctx.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 260;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, t0 + a);
			g.gain.linearRampToValueAtTime(0.03, t0 + (a + b) / 2);
			g.gain.linearRampToValueAtTime(0.0001, t0 + b + 0.4);
			f.connect(lp).connect(g).connect(mèstre);
		}

		// lo rajòl : un bruch suau (filtrat bas) que tremola doçament, e de
		// pichonas bolhas
		{
			const [a, b] = INTRO.rius;
			const s = b - a + 0.6;
			const f = font(bruch(s), t0 + a, s);
			const lp = ctx.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 1100;
			const bp = ctx.createBiquadFilter();
			bp.type = 'bandpass';
			bp.frequency.value = 650;
			bp.Q.value = 0.5;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, t0 + a);
			g.gain.linearRampToValueAtTime(0.035, t0 + a + 0.8);
			g.gain.setValueAtTime(0.035, t0 + b - 0.5);
			g.gain.linearRampToValueAtTime(0.0001, t0 + b + 0.6);
			const lfo = ctx.createOscillator(),
				lg = ctx.createGain();
			lfo.frequency.value = 2.3;
			lg.gain.value = 0.01;
			lfo.connect(lg).connect(g.gain);
			lfo.start(t0 + a);
			lfo.stop(t0 + b + 0.6);
			f.connect(lp).connect(bp).connect(g).connect(mèstre);
			for (let t = a + 0.3; t < b; t += 0.06 + Math.random() * 0.14) {
				const o = ctx.createOscillator(),
					og = ctx.createGain();
				const f0 = 500 + Math.random() * 700;
				o.type = 'sine';
				o.frequency.setValueAtTime(f0, t0 + t);
				o.frequency.exponentialRampToValueAtTime(f0 * 1.8, t0 + t + 0.04);
				og.gain.setValueAtTime(0.0001, t0 + t);
				og.gain.exponentialRampToValueAtTime(0.012, t0 + t + 0.008);
				og.gain.exponentialRampToValueAtTime(0.0001, t0 + t + 0.05);
				o.connect(og).connect(mèstre);
				o.start(t0 + t);
				o.stop(t0 + t + 0.06);
			}
		}

		return () => {
			try {
				mèstre.gain.cancelScheduledValues(ctx.currentTime);
				mèstre.gain.setValueAtTime(mèstre.gain.value, ctx.currentTime);
				mèstre.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
				setTimeout(() => mèstre.disconnect(), 400);
			} catch {}
		};
	} catch {
		return () => {};
	}
}
