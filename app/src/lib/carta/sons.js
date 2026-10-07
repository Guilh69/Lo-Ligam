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
//   - relèu(true / false) : la tèrra que bramís, del primièr nivèl d'altitud
//     que pareis al darrièr ;
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
	const sortida = (nòde) => nòde.connect(mèstre);
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
			sortida(g);
			gredon = { f, g };
		} else if (!on && gredon) {
			gredon.g.gain.cancelScheduledValues(t);
			gredon.g.gain.setTargetAtTime(0.0001, t, 0.04);
			const f = gredon.f;
			setTimeout(() => f.stop(), 400);
			gredon = null;
		}
	}

	// --- lo relèu : las montanhas que susson, un bramadís de tèrra
	// (EKVelika, CC0, static/sons/FONTS.md) que monta amb las corbas de nivèl e
	// s'escantís quand la darrièra es pausada (los « calhaus » fabricats
	// sonavan coma d'aiga dins una botelha) ---
	const cargar = (u) =>
		fetch(u)
			.then((r) => (r.ok ? r.arrayBuffer() : null))
			.then((b) => b && c.decodeAudioData(b))
			.catch(() => null);
	let bufRelèu = null;
	cargar('/sons/releu.mp3').then((d) => (bufRelèu = d));
	let relèuEnCors = null;
	function relèu(on) {
		const t = c.currentTime;
		if (on && !relèuEnCors && bufRelèu) {
			const f = c.createBufferSource();
			f.buffer = bufRelèu;
			f.start(t);
			fonts.push(f);
			const g = c.createGain();
			g.gain.setValueAtTime(0.0001, t);
			g.gain.linearRampToValueAtTime(0.3, t + 1.3);
			f.connect(g);
			sortida(g);
			relèuEnCors = { f, g };
		} else if (!on && relèuEnCors) {
			relèuEnCors.g.gain.cancelScheduledValues(t);
			relèuEnCors.g.gain.setValueAtTime(relèuEnCors.g.gain.value, t);
			relèuEnCors.g.gain.setTargetAtTime(0.0001, t, 0.3);
			const f = relèuEnCors.f;
			setTimeout(() => f.stop(), 1800);
			relèuEnCors = null;
		}
	}

	// --- l'aiga : un enregistrament vertadièr (Biofonik, CC0, static/sons/FONTS.md),
	// pas tròp fòrt (demanda de Romain) ; s'escantís quand lo darrièr riu a
	// tocat la mar ---
	let bufRiu = null;
	cargar('/sons/riu.mp3').then((d) => (bufRiu = d));
	let riu = null;
	function aiga(n) {
		const t = c.currentTime;
		if (n > 0 && !riu) {
			if (!bufRiu) return; // pas encara cargat : res
			const f = c.createBufferSource();
			f.buffer = bufRiu;
			f.loop = true;
			f.start(t, 1);
			fonts.push(f);
			const g = c.createGain();
			g.gain.setValueAtTime(0.0001, t);
			f.connect(g);
			sortida(g);
			riu = { f, g, n: 0 };
		}
		if (!riu) return;
		if (n > 0) {
			// mai de rius, un pauc mai d'aiga
			// (l'enregistrament es discret : un nivèl ausible mas doç, jos lo gredon)
			if (n !== riu.n) riu.g.gain.setTargetAtTime(Math.min(0.8, 0.5 + 0.05 * Math.sqrt(n)), t, riu.n ? 0.4 : 0.25);
			riu.n = n;
		} else if (riu.n > 0) {
			riu.g.gain.setTargetAtTime(0.0001, t, 0.5);
			const f = riu.f;
			setTimeout(() => f.stop(), 3000);
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
	return { crayon, relèu, aiga, copar };
}
