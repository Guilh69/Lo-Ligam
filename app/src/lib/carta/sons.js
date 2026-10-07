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
