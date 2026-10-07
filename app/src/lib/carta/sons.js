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

// Un papièr que se plega (plegar = true) o se desplega : un fregadís de
// crussiments brèus (bruch filtrat, de pics aleatòris), e un pichon tuc
// sord a la fin del plec (al començament del desplec)
export function sonPapièr(plegar = true) {
	if (!sonsActius()) return;
	try {
		ctx ??= new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === 'suspended') ctx.resume();
		const t0 = ctx.currentTime + 0.01,
			durada = 0.34,
			sr = ctx.sampleRate;
		const n = Math.floor(sr * durada);
		const buf = ctx.createBuffer(1, n, sr);
		const d = buf.getChannelData(0);
		// crussiments : de pics brèus semenats al azard, mai espesses al mitan
		let pic = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const densitat = Math.sin(Math.PI * t) ** 1.5;
			if (Math.random() < 0.0016 * densitat * 4) pic = 0.6 + Math.random() * 0.4;
			pic *= 0.9965;
			d[i] = (Math.random() * 2 - 1) * (0.12 * densitat + pic);
		}
		const font = ctx.createBufferSource();
		font.buffer = buf;
		const passaAut = ctx.createBiquadFilter();
		passaAut.type = 'highpass';
		passaAut.frequency.value = 900;
		const banda = ctx.createBiquadFilter();
		banda.type = 'bandpass';
		banda.Q.value = 0.8;
		banda.frequency.setValueAtTime(plegar ? 3400 : 2400, t0);
		banda.frequency.linearRampToValueAtTime(plegar ? 2200 : 3600, t0 + durada);
		const vol = ctx.createGain();
		vol.gain.setValueAtTime(0.0001, t0);
		vol.gain.exponentialRampToValueAtTime(0.16, t0 + 0.03);
		vol.gain.setValueAtTime(0.16, t0 + durada * 0.7);
		vol.gain.exponentialRampToValueAtTime(0.0001, t0 + durada);
		font.connect(passaAut).connect(banda).connect(vol).connect(ctx.destination);
		font.start(t0);
		font.stop(t0 + durada);
		// lo tuc : un plec que s'apièja (fin del plec, o començament del desplec)
		const tt = plegar ? t0 + durada * 0.85 : t0;
		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(150, tt);
		osc.frequency.exponentialRampToValueAtTime(70, tt + 0.08);
		const vt = ctx.createGain();
		vt.gain.setValueAtTime(0.0001, tt);
		vt.gain.exponentialRampToValueAtTime(0.14, tt + 0.008);
		vt.gain.exponentialRampToValueAtTime(0.0001, tt + 0.1);
		osc.connect(vt).connect(ctx.destination);
		osc.start(tt);
		osc.stop(tt + 0.12);
	} catch {
		/* Web Audio indisponible : sens son, jamai blocant */
	}
}
