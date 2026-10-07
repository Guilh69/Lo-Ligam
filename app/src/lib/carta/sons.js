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

// Los sons de l'entrada en scèna (demanda de Romain), menats pel dessenh
// meteis (pas per un relòtge fixat a l'avança : lo primièr ensag se
// descalava de l'animacion) :
//   - crayon(true / false) : lo gredon, del primièr tròç de còsta al darrièr ;
//   - calhau(u) : una pèira pausada, a cada nivèl d'altitud que pareis
//     (u de 0 a 1 : de las planas als cims, del grave a l'agut, sus una
//     gama doça, a la faiçon de Tiny Glade) ;
//   - aiga(n) : un riu que raja, tant fòrt coma i a de rius que corron ;
//     s'escantís quand lo darrièr a tocat la mar (n = 0) ;
//   - copar() : tot s'arrèsta (un clic mena a la fin).
// Lo navegador daissa partir los sons sonque aprèp un gèst (lo clic sul
// ligam de la carta).
export function sonsEntrada() {
	if (!sonsActius()) return null;
	let c;
	try {
		ctx ??= new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === 'suspended') ctx.resume();
		c = ctx;
	} catch {
		return null;
	}
	const sr = c.sampleRate;
	const mèstre = c.createGain();
	mèstre.connect(c.destination);
	// un pauc d'espaci : una reverberacion corta (bruch que s'amortís)
	const rev = c.createConvolver();
	{
		const n = Math.floor(sr * 1.3),
			b = c.createBuffer(2, n, sr);
		for (let k = 0; k < 2; k++) {
			const d = b.getChannelData(k);
			for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
		}
		rev.buffer = b;
	}
	const umid = c.createGain();
	umid.gain.value = 0.32;
	rev.connect(umid).connect(mèstre);
	const sortida = (nòde, ambRev = true) => {
		nòde.connect(mèstre);
		if (ambRev) nòde.connect(rev);
	};
	const bruch = (s) => {
		const b = c.createBuffer(1, Math.floor(sr * s), sr),
			d = b.getChannelData(0);
		for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
		return b;
	};
	const fonts = [];
	const bocla = (buf) => {
		const f = c.createBufferSource();
		f.buffer = buf;
		f.loop = true;
		f.start();
		fonts.push(f);
		return f;
	};

	// --- lo gredon ---
	let gredon = null;
	function crayon(on) {
		const t = c.currentTime;
		if (on && !gredon) {
			const f = bocla(bruch(2));
			const hp = c.createBiquadFilter();
			hp.type = 'highpass';
			hp.frequency.value = 1400;
			const bp = c.createBiquadFilter();
			bp.type = 'bandpass';
			bp.frequency.value = 2800;
			bp.Q.value = 0.7;
			const lp = c.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 5200;
			const g = c.createGain();
			g.gain.setValueAtTime(0.0001, t);
			g.gain.linearRampToValueAtTime(0.018, t + 0.06);
			// la man que tremola : lo frec monta e davala doçament
			for (let u = 0.06; u < 4; u += 0.05) g.gain.setTargetAtTime(0.011 + Math.random() * 0.012, t + u, 0.02);
			f.connect(hp).connect(bp).connect(lp).connect(g);
			sortida(g, false);
			gredon = { f, g };
		} else if (!on && gredon) {
			gredon.g.gain.cancelScheduledValues(t);
			gredon.g.gain.setTargetAtTime(0.0001, t, 0.04);
			const f = gredon.f;
			setTimeout(() => f.stop(), 400);
			gredon = null;
		}
	}

	// --- las pèiras ---
	const GAMA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
	const tuc = bruch(0.02);
	function calhau(u) {
		const t = c.currentTime + 0.005;
		const semi = GAMA[Math.round(Math.max(0, Math.min(1, u)) * (GAMA.length - 1))] + (Math.random() - 0.5) * 0.3;
		const f0 = 140 * Math.pow(2, semi / 12);
		// lo còrs de la pèira : doas modas amortidas
		for (const [mult, dec, vol] of [[1, 0.16, 0.05], [2.76, 0.06, 0.018]]) {
			const o = c.createOscillator(),
				g = c.createGain();
			o.type = 'sine';
			o.frequency.setValueAtTime(f0 * mult * 1.03, t);
			o.frequency.exponentialRampToValueAtTime(f0 * mult, t + 0.03);
			g.gain.setValueAtTime(0.0001, t);
			g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
			g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
			o.connect(g);
			sortida(g);
			o.start(t);
			o.stop(t + dec + 0.02);
		}
		// lo tòc : un brieu de bruch clar
		const s = c.createBufferSource();
		s.buffer = tuc;
		const bp = c.createBiquadFilter();
		bp.type = 'bandpass';
		bp.frequency.value = 2400 + Math.random() * 1200;
		bp.Q.value = 1.5;
		const g = c.createGain();
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(0.012, t + 0.002);
		g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
		s.connect(bp).connect(g);
		sortida(g);
		s.start(t);
		s.stop(t + 0.03);
	}

	// --- l'aiga ---
	let riu = null;
	function aiga(n) {
		const t = c.currentTime;
		if (n > 0 && !riu) {
			// lo fons : un bruch suau, filtrat (ni agut ni sord)
			const f = bocla(bruch(3));
			const hp = c.createBiquadFilter();
			hp.type = 'highpass';
			hp.frequency.value = 220;
			const lp = c.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 1500;
			const fons = c.createGain();
			fons.gain.value = 0.35;
			f.connect(hp).connect(lp).connect(fons);
			// lo gargolh : de filtres estreches que se desplaçan a l'azard
			const babil = c.createGain();
			babil.gain.value = 1;
			for (let i = 0; i < 4; i++) {
				const bp = c.createBiquadFilter();
				bp.type = 'bandpass';
				bp.Q.value = 9;
				bp.frequency.value = 400 + Math.random() * 600;
				for (let u = 0; u < 9; u += 0.07 + Math.random() * 0.08) bp.frequency.setTargetAtTime(330 + Math.random() * 750, t + u, 0.03);
				f.connect(bp).connect(babil);
			}
			const g = c.createGain();
			g.gain.setValueAtTime(0.0001, t);
			fons.connect(g);
			babil.connect(g);
			sortida(g);
			riu = { f, g, n: 0 };
		}
		if (!riu) return;
		if (n > 0) {
			// mai de rius, mai d'aiga (doçament)
			if (n !== riu.n) riu.g.gain.setTargetAtTime(Math.min(0.09, 0.035 + 0.012 * Math.sqrt(n)), t, 0.25);
			riu.n = n;
		} else if (riu.n > 0) {
			riu.g.gain.setTargetAtTime(0.0001, t, 0.35);
			const f = riu.f;
			setTimeout(() => f.stop(), 2000);
			riu.n = 0;
		}
	}

	function copar() {
		const t = c.currentTime;
		mèstre.gain.setTargetAtTime(0, t, 0.06);
		setTimeout(() => {
			for (const f of fonts) {
				try {
					f.stop();
				} catch {}
			}
			mèstre.disconnect();
		}, 500);
	}
	return { crayon, calhau, aiga, copar };
}
