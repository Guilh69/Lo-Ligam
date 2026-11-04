// Son de pluie fabriqué dans le navigateur (Web Audio), pour /ensag/plueja.
// Aucun fichier à télécharger : sobriété (0 octet de plus pour la page).
//
// Trois couches, réglées par une seule intensité entre 0 (bruine) et 1
// (averse) :
//   1. le souffle : bruit rose filtré, de plus en plus clair et fort ;
//   2. le grondement : bruit brun très grave, présent seulement quand ça tombe fort ;
//   3. les gouttes : petits éclats de bruit filtrés, placés à gauche ou à
//      droite au hasard, plus quelques « plic » ronds et rares (gouttière).
//
// Usage :
//   const son = crearSonPlueja();
//   await son.allumar();       // après un geste (règle des navigateurs)
//   son.intensitat(0.6);       // à chaque image, valeur lissée côté page
//   son.amortar();             // coupe en fondu

const SECONDAS = 6; // durée des bruits en boucle (assez longue pour ne pas entendre la reprise)

function bruitRose(ctx) {
	const n = ctx.sampleRate * SECONDAS;
	const buf = ctx.createBuffer(2, n, ctx.sampleRate);
	for (let c = 0; c < 2; c++) {
		const d = buf.getChannelData(c);
		let b0 = 0, b1 = 0, b2 = 0;
		for (let i = 0; i < n; i++) {
			const w = Math.random() * 2 - 1;
			b0 = 0.99765 * b0 + w * 0.099046;
			b1 = 0.963 * b1 + w * 0.2965164;
			b2 = 0.57 * b2 + w * 1.0526913;
			d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
		}
	}
	return buf;
}

function bruitBrun(ctx) {
	const n = ctx.sampleRate * SECONDAS;
	const buf = ctx.createBuffer(2, n, ctx.sampleRate);
	for (let c = 0; c < 2; c++) {
		const d = buf.getChannelData(c);
		let l = 0;
		for (let i = 0; i < n; i++) {
			l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02;
			d[i] = l * 3.2;
		}
	}
	return buf;
}

export function crearSonPlueja() {
	let ctx = null;
	let mestre, alenGain, alenFiltre, grondGain, gotasBus;
	let rose, brun;
	let minuteur = null;
	let niv = 0.2; // intensité courante
	let prochana = 0; // heure de la prochaine goutte
	let prochanPlic = 0;

	function boucle(buf) {
		const s = ctx.createBufferSource();
		s.buffer = buf;
		s.loop = true;
		s.start(0, Math.random() * SECONDAS);
		return s;
	}

	function construire() {
		const AC = window.AudioContext || window.webkitAudioContext;
		ctx = new AC();
		rose = bruitRose(ctx);
		brun = bruitBrun(ctx);

		mestre = ctx.createGain();
		mestre.gain.value = 0;
		// adoucit l'ensemble : rien de strident au casque
		const doç = ctx.createBiquadFilter();
		doç.type = 'lowpass';
		doç.frequency.value = 7500;
		mestre.connect(doç).connect(ctx.destination);

		// 1. le souffle
		const pb = ctx.createBiquadFilter();
		pb.type = 'highpass';
		pb.frequency.value = 420;
		alenFiltre = ctx.createBiquadFilter();
		alenFiltre.type = 'lowpass';
		alenFiltre.frequency.value = 2000;
		alenGain = ctx.createGain();
		alenGain.gain.value = 0.12;
		boucle(rose).connect(pb).connect(alenFiltre).connect(alenGain).connect(mestre);

		// 2. le grondement
		const grave = ctx.createBiquadFilter();
		grave.type = 'lowpass';
		grave.frequency.value = 190;
		grondGain = ctx.createGain();
		grondGain.gain.value = 0.02;
		boucle(brun).connect(grave).connect(grondGain).connect(mestre);

		// 3. les gouttes
		gotasBus = ctx.createGain();
		gotasBus.gain.value = 0.9;
		gotasBus.connect(mestre);
	}

	function gota(t) {
		const s = ctx.createBufferSource();
		s.buffer = rose;
		const f = ctx.createBiquadFilter();
		f.type = 'bandpass';
		f.frequency.value = 1300 + Math.random() * 3600;
		f.Q.value = 1.5 + Math.random() * 4;
		const g = ctx.createGain();
		const pic = 0.2 + Math.random() * 0.5; // mesuré le 04-11 : crête ~0,14, au-dessus du souffle (0,03 efficace)
		const dur = 0.018 + Math.random() * 0.05;
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(pic, t + 0.002);
		g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
		let sortida = s.connect(f).connect(g);
		if (p) {
			p.pan.value = Math.random() * 1.6 - 0.8;
			sortida = sortida.connect(p);
		}
		sortida.connect(gotasBus);
		s.start(t, Math.random() * (SECONDAS - 0.2), dur + 0.02);
	}

	// goutte ronde, comme dans une gouttière : sinus qui monte vite
	function plic(t) {
		const o = ctx.createOscillator();
		o.type = 'sine';
		const f0 = 650 + Math.random() * 500;
		o.frequency.setValueAtTime(f0, t);
		o.frequency.exponentialRampToValueAtTime(f0 * 1.9, t + 0.045);
		const g = ctx.createGain();
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(0.035, t + 0.004);
		g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
		const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
		let sortida = o.connect(g);
		if (p) {
			p.pan.value = Math.random() * 1.4 - 0.7;
			sortida = sortida.connect(p);
		}
		sortida.connect(gotasBus);
		o.start(t);
		o.stop(t + 0.1);
	}

	// Planification par petites fenêtres (100 ms d'avance)
	function planificar() {
		const ara = ctx.currentTime;
		const fin = ara + 0.12;
		if (prochana < ara) prochana = ara;
		const ritme = 4 + 70 * niv * niv; // gouttes par seconde
		while (prochana < fin) {
			gota(prochana);
			prochana += (-Math.log(1 - Math.random()) / ritme);
		}
		if (prochanPlic < ara) prochanPlic = ara + Math.random();
		const ritmePlic = 0.35 + 0.8 * niv;
		while (prochanPlic < fin) {
			plic(prochanPlic);
			prochanPlic += (-Math.log(1 - Math.random()) / ritmePlic);
		}
	}

	function aplicar(lis = 0.6) {
		if (!ctx) return;
		const t = ctx.currentTime;
		alenGain.gain.setTargetAtTime(0.1 + 0.3 * niv, t, lis);
		alenFiltre.frequency.setTargetAtTime(1500 + 4200 * niv, t, lis);
		grondGain.gain.setTargetAtTime(0.015 + 0.3 * niv * niv, t, lis);
	}

	return {
		get actiu() {
			return !!ctx && ctx.state === 'running' && minuteur !== null;
		},
		async allumar() {
			if (!ctx) construire();
			if (ctx.state !== 'running') await ctx.resume();
			aplicar(0.01);
			const t = ctx.currentTime;
			mestre.gain.cancelScheduledValues(t);
			mestre.gain.setValueAtTime(mestre.gain.value, t);
			mestre.gain.linearRampToValueAtTime(0.85, t + 2);
			if (minuteur === null) minuteur = setInterval(planificar, 80);
		},
		amortar() {
			if (!ctx) return;
			const t = ctx.currentTime;
			mestre.gain.cancelScheduledValues(t);
			mestre.gain.setValueAtTime(mestre.gain.value, t);
			mestre.gain.linearRampToValueAtTime(0, t + 0.9);
			clearInterval(minuteur);
			minuteur = null;
			setTimeout(() => {
				if (minuteur === null && ctx) ctx.suspend();
			}, 1000);
		},
		intensitat(v) {
			if (Math.abs(v - niv) < 0.01) return;
			niv = v;
			aplicar();
		},
		tampar() {
			clearInterval(minuteur);
			minuteur = null;
			if (ctx) ctx.close();
			ctx = null;
		}
	};
}
