<script>
	// Pluie de mots (idée de Romain, 2026-11-04) : une page de calme et de
	// concentration. Des mots occitans tombent lentement, très espacés, devant
	// une image ; la définition de chacun s'écrit en petit, en italique. Tourner
	// la molette (ordinateur) ou bouger le téléphone fait forcir la pluie : les
	// mots tombent plus vite, s'agitent un peu, le son monte ; puis tout se
	// calme seul. Essai à /ensag/plueja du 04-11 au 05-11, puis rubrique de
	// S'apren sous le nom « Remira » (contemple ; Romain, 2026-11-05 : « Je
	// crois que je préfère Remira ») ; l'ancienne adresse y renvoie.
	//
	// Sobriété : deux fonds de 55 et 64 ko (adoucis dans le fichier, pas par un
	// filtre CSS qui coûterait à chaque image), le troisième en pur CSS ; le son
	// est fabriqué dans le navigateur (aucun fichier audio) et ne démarre que
	// si on le demande.
	import { onMount } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { SCENAS, GROPS, QUASERNET, motsDelQuasernet } from '$lib/plueja/scenas.js';
	import { crearSonPlueja } from '$lib/plueja/sonPlueja.js';
	import Polsa from '$lib/plueja/Polsa.svelte';
	import { carnet, demarrerCarnet } from '$lib/carnet/carnet.svelte.js';
	import { aRevoir } from '$lib/carnet/regles.js';

	const T = {
		titol: { oc: 'Remira', fr: 'Remira' }, // impératif de remirar, contempler (vèrb'Òc, 05-11) ; un nom se lit comme il se dit, dans toutes les langues
		tornar: { oc: 'Tornar a l’acuèlh', fr: 'Revenir à l’accueil' },
		ambianca: { oc: 'Ambient', fr: 'Ambiance' }, // lo Congrès : ambiance → ambient (04-11)
		movement: { oc: 'Movement', fr: 'Mouvement' }, // lo Congrès : mouvement → movement (05-11)
		plueja: { oc: 'Pluèja', fr: 'Pluie' },
		polsa: { oc: 'Polsa d’aur', fr: 'Poussière d’or' }, // lo Congrès : poussière → polsa (languedocien)
		det: { oc: 'Lisa lo det', fr: 'Fais glisser ton doigt' }, // lo Congrès : glisser → lisar, doigt → det ; même tournure que l'accueil (motor.js)
		forca: { oc: 'Fòrça', fr: 'Intensité' },
		son: { oc: 'Son', fr: 'Son' },
		pausa: { oc: 'Pausa', fr: 'Pause' },
		plenEcran: { oc: 'Plen ecran', fr: 'Plein écran' },
		rodeta: { oc: 'Vira la rodeta', fr: 'Fais tourner la molette' },
		telefon: { oc: 'Bolega lo telefòn', fr: 'Bouge ton téléphone' },
		mots: { oc: 'Los mots', fr: 'Les mots' },
		quasernet: { oc: 'Ton quasernet', fr: 'Ton carnet' }, // lo Congrès : carnet → quasernet (05-11)
		quasernetVoid: { oc: 'Los mots de tas leiçons venon aquí.', fr: 'Les mots de tes leçons viennent ici.' }
	};

	// « Tos mots » : les mots de son carnet. La liste est figée au moment où on
	// choisit l'ambiance (une liste qui change relancerait la poussière d'or).
	const TOTAS = [...SCENAS, QUASERNET];
	let motsQuasernet = $state.raw([]);
	let nQuasernet = $derived(motsDelQuasernet(carnet.cartes).length);
	let scenaId = $state('garriga');
	let scena = $derived(
		scenaId === QUASERNET.id ? { ...QUASERNET, mots: motsQuasernet } : SCENAS.find((s) => s.id === scenaId)
	);
	let vistas = $state({ garriga: true }); // fonds déjà demandés (chargés à la première visite seulement)
	let fons = $state(0.2); // niveau de base choisi au curseur
	let niv = $state(0.2); // niveau affiché (base + élan du geste), mis à jour sans excès
	let pausa = $state(false);
	let sonAtiu = $state(false);
	let inactiu = $state(false);
	let indici = $state(true);
	let tactil = $state(false);
	let plenPossible = $state(false);
	let calme = $state(false); // préférence « réduire les animations »
	let mots = $state([]);
	// Deux mouvements (Romain, 04-11) : la pluie, ou la poussière d'or qui
	// dessine chaque mot et glisse vers le suivant au rythme de la molette.
	// La poussière d'or s'ouvre par défaut (Romain, 05-11 : « une préférence
	// pour la poussière d'or »).
	let mòde = $state('polsa');
	let reserva = $state({ naut: 64, bas: 110 }); // place de l'en-tête et des commandes, pour la poussière

	let racina, tela, barra, menu, polsa;
	let son = null;

	// ── Mots ─────────────────────────────────────────────────────────────
	const fis = new Map(); // id → état physique (hors réactivité : mis à jour à chaque image)
	let compte = 0;
	let sac = [];
	let W = 1280,
		H = 800;

	function barrejar(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	function tirar() {
		if (!sac.length) sac = barrejar(scena.mots.slice());
		return sac.pop();
	}

	function nàisser(ara) {
		const [oc, def] = tirar();
		const prof = 0.62 + Math.random() * 0.38;
		const id = ++compte;
		let i = 0;
		const partidas = def.split(' ').map((m) => [...m].map((l) => ({ l, i: i++ })));
		// Les expressions des unités (« Pòdes repetir, se te plai ? ») : un peu
		// plus petites, sans descendre sous 0,85 (Limelight reste gros).
		const escala = Math.max(0.85, Math.min(1, 14 / oc.length));
		fis.set(id, { el: null, x: -9999, y: -9999, prof, nais: ara, vida: 12 + Math.random() * 4, fase: Math.random() * 6.28, partit: false });
		mots.push({ id, oc, def, partidas, prof, escala });
	}

	// Place le mot là où il gêne le moins les autres (meilleur de 16 tirages)
	function plaçar(f) {
		const w = f.el.offsetWidth,
			h = f.el.offsetHeight;
		const marge = Math.min(48, W * 0.06);
		let melhor = null,
			score = -1;
		for (let k = 0; k < 16; k++) {
			const x = marge + Math.random() * Math.max(1, W - w - 2 * marge);
			const y = H * 0.07 + Math.random() * H * 0.5;
			let d = Infinity;
			for (const o of fis.values()) {
				if (o === f || !o.el || o.partit) continue;
				const dx = x + w / 2 - (o.x + o.w / 2),
					dy = y + h / 2 - (o.y + o.h / 2);
				d = Math.min(d, Math.hypot(dx, dy * 1.6)); // l'empilement vertical gêne plus
			}
			if (d > score) {
				score = d;
				melhor = [x, y];
			}
		}
		[f.x, f.y] = melhor;
		f.w = w;
		f.h = h;
		f.el.style.translate = `${f.x}px ${f.y}px`;
	}

	const registrar = (id) => (el) => {
		const f = fis.get(id);
		if (!f) return;
		f.el = el;
		plaçar(f);
		return () => {
			f.el = null;
		};
	};

	function partir(id) {
		const f = fis.get(id);
		if (!f || f.partit) return;
		f.partit = true;
		f.el?.classList.add('part');
		setTimeout(() => {
			fis.delete(id);
			mots = mots.filter((m) => m.id !== id);
		}, 1900);
	}

	// ── Intensité ────────────────────────────────────────────────────────
	let impuls = 0; // élan donné par les gestes, qui retombe seul
	let nivLis = 0.2; // intensité lissée utilisée partout
	let vent = 0.07,
		ventCibla = 0.07; // inclinaison de la pluie (radians)

	function donar(q) {
		impuls = Math.min(1.1, impuls + q);
		if (q > 0.04) indici = false;
	}

	// ── Pluie (canevas) ──────────────────────────────────────────────────
	const CAPAS = [
		{ prof: 0.42, alfa: 0.14, larg: 0.8, part: 0.42 },
		{ prof: 0.7, alfa: 0.21, larg: 1, part: 0.34 },
		{ prof: 1, alfa: 0.3, larg: 1.2, part: 0.24 }
	];
	const gotas = [[], [], []];
	let estelas = [];
	let cx = null,
		dpr = 1;

	function novaGota(dins) {
		return { x: Math.random() * (W + 300) - 150, y: dins ? Math.random() * H : -Math.random() * 80, k: 0.8 + Math.random() * 0.4 };
	}

	function talhar() {
		W = innerWidth;
		H = innerHeight;
		if (!tela) return;
		dpr = Math.min(devicePixelRatio || 1, 1.5);
		tela.width = Math.round(W * dpr);
		tela.height = Math.round(H * dpr);
		cx = tela.getContext('2d');
		cx.setTransform(dpr, 0, 0, dpr, 0, 0);
		cx.lineCap = 'round';
		mesurarReserva();
		estelas = Array.from({ length: Math.round((W * H) / 16000) }, () => ({
			x: Math.random() * W,
			y: Math.random() * H * 0.62,
			r: 0.3 + Math.random() * 0.9,
			a: 0.25 + Math.random() * 0.6,
			w: 0.4 + Math.random() * 1.6,
			f: Math.random() * 6.28
		}));
	}

	function mesurarReserva() {
		const naut = racina?.querySelector('.cap')?.offsetHeight || 64;
		const bas = barra?.offsetHeight || 110;
		if (naut !== reserva.naut || bas !== reserva.bas) reserva = { naut, bas };
	}

	function dessenhar(dt, temps) {
		if (!cx) return;
		cx.clearRect(0, 0, W, H);
		if (scenaId === 'nuech') {
			cx.fillStyle = '#fff4dc';
			for (const s of estelas) {
				cx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(temps * s.w + s.f));
				cx.beginPath();
				cx.arc(s.x, s.y, s.r, 0, 6.283);
				cx.fill();
			}
			cx.globalAlpha = 1;
		}
		if (calme || mòde !== 'plueja') return; // la poussière d'or a son propre canevas
		const n = Math.round((70 + 90 * nivLis + 480 * nivLis * nivLis) * Math.max(0.6, Math.min(2.2, (W * H) / (1440 * 900))));
		const vBase = 460 + 950 * nivLis;
		const ang = vent + 0.14 * nivLis * nivLis * Math.sign(vent || 1); // l'averse penche davantage
		const sx = Math.sin(ang),
			cy = Math.cos(ang);
		CAPAS.forEach((c, ci) => {
			const g = gotas[ci];
			const nc = Math.round(n * c.part);
			while (g.length < nc) g.push(novaGota(true));
			if (g.length > nc) g.length = nc;
			cx.beginPath();
			for (const d of g) {
				const v = vBase * c.prof * d.k;
				d.y += v * cy * dt;
				d.x += v * sx * dt;
				const len = 9 + v * 0.03;
				if (d.y - len > H || d.x < -160 || d.x > W + 160) {
					Object.assign(d, novaGota(false));
					d.x -= sx * H * 0.5;
					continue;
				}
				cx.moveTo(d.x, d.y);
				cx.lineTo(d.x - sx * len, d.y - cy * len);
			}
			cx.strokeStyle = `rgba(222, 234, 240, ${c.alfa * (0.75 + 0.5 * nivLis)})`;
			cx.lineWidth = c.larg;
			cx.stroke();
		});
	}

	// ── Boucle ───────────────────────────────────────────────────────────
	let raf = 0,
		darrier = 0,
		temps = 0,
		fasa = 0,
		darrierNais = -10;

	function tick(t) {
		const dt = Math.min(0.1, (t - darrier) / 1000 || 0); // au-delà (onglet en arrière-plan), on ne rattrape pas
		darrier = t;
		impuls *= Math.exp(-dt / 2.6);
		const cibla = Math.min(1, fons + impuls);
		nivLis += (cibla - nivLis) * Math.min(1, dt * 2.5);
		vent += (ventCibla - vent) * Math.min(1, dt * 1.5);
		son?.intensitat(nivLis);
		if (Math.abs(niv - nivLis) > 0.015) niv = nivLis;

		if (!pausa) {
			temps += dt;
			const escart = 4.6 - 3.7 * nivLis;
			const maxi = Math.round((4 + 6 * nivLis) * Math.max(0.65, Math.min(1.3, (W * H) / (1100 * 700)))); // moins de mots sur un petit écran
			let actius = 0;
			for (const f of fis.values()) if (!f.partit) actius++;
			if (mòde === 'plueja' && temps - darrierNais > escart && actius < maxi) {
				darrierNais = temps;
				nàisser(temps);
			}
			const vMot = 9 + 26 * nivLis + 90 * nivLis * nivLis;
			const amp = 2 + 26 * nivLis * nivLis;
			fasa += dt * (0.5 + 2.2 * nivLis); // phase cumulée : pas de saut quand l'intensité change
			for (const [id, f] of fis) {
				if (!f.el) continue;
				const age = temps - f.nais;
				if (!calme) {
					f.ral = f.partit ? Math.max(0.2, (f.ral ?? 1) - dt * 0.9) : 1; // un mot qui s'efface freine en douceur (pas de chute sur les commandes)
					const ral = f.ral;
					f.y += vMot * f.prof * dt * ral;
					f.x += Math.sin(vent) * vMot * f.prof * dt * 1.2 * ral;
					const balanç = Math.sin(fasa + f.fase) * amp * f.prof;
					const rot = Math.sin(fasa * 0.8 + f.fase * 1.3) * (0.3 + 4 * nivLis * nivLis);
					f.el.style.translate = `${(f.x + balanç).toFixed(1)}px ${f.y.toFixed(1)}px`;
					f.el.style.rotate = `${rot.toFixed(2)}deg`;
				}
				if (!f.partit && (age > f.vida * (1 - 0.45 * nivLis) || f.y + (f.h || 0) > H - (barra?.offsetHeight || 90) - 36)) partir(id); // s'efface avant les commandes
			}
			dessenhar(dt, temps);
		}
		raf = requestAnimationFrame(tick);
	}

	// ── Gestes ───────────────────────────────────────────────────────────
	let minuteurInactiu = 0,
		finIndici = 0;
	function activitat() {
		inactiu = false;
		clearTimeout(minuteurInactiu);
		// les commandes restent là tant que la liste des ambiances est ouverte
		minuteurInactiu = setTimeout(() => (inactiu = !menu?.matches(':popover-open')), 3500);
	}

	function rodeta(e) {
		if (menu?.contains(e.target)) return; // on fait défiler la liste des ambiances, pas la pluie
		const d = (e.deltaY || 0) * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
		if (mòde === 'polsa') {
			polsa?.rodeta(d);
			if (Math.abs(d) > 20) indici = false;
			return;
		}
		donar((Math.min(Math.abs(d), 160) / 160) * 0.08);
	}

	// commandes, en-tête et liens : un clic dessus ne fait pas éclater le mot
	const susComandas = (e) => barra?.contains(e.target) || menu?.contains(e.target) || !!e.target?.closest?.('.cap, a, button, input, label');

	let darrierTòc = null;
	function bolegaPuntador(e) {
		activitat();
		if (mòde === 'polsa') {
			polsa?.bolegar(e);
			return;
		}
		if (e.pointerType === 'mouse') {
			ventCibla = 0.07 + (e.clientX / W - 0.5) * 0.22;
		} else if (e.pointerType === 'touch' && darrierTòc) {
			const d = Math.hypot(e.clientX - darrierTòc.x, e.clientY - darrierTòc.y);
			donar(Math.min(d, 80) / 80 * 0.035);
			darrierTòc = { x: e.clientX, y: e.clientY };
		}
	}

	function moviment(e) {
		const r = e.rotationRate,
			a = e.acceleration;
		let en = 0;
		if (r) en += (Math.abs(r.alpha || 0) + Math.abs(r.beta || 0) + Math.abs(r.gamma || 0)) / 600;
		if (a) en += (Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0)) / 14;
		if (en < 0.04) return; // le tremblement de la main au repos ne compte pas
		const iv = e.interval ? (e.interval > 1 ? e.interval / 1000 : e.interval) : 0.016;
		donar(Math.min(en, 2) * iv * 2.2);
	}
	function orientacion(e) {
		if (e.gamma == null) return;
		ventCibla = Math.max(-0.4, Math.min(0.4, (e.gamma / 90) * 0.5));
	}

	let movimentDemandat = false;
	async function demandarMoviment() {
		if (movimentDemandat) return;
		movimentDemandat = true;
		try {
			// iPhone : l'accès aux capteurs se demande après un toucher
			if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
				const r = await DeviceMotionEvent.requestPermission();
				if (r !== 'granted') return;
				if (typeof DeviceOrientationEvent?.requestPermission === 'function') await DeviceOrientationEvent.requestPermission();
			}
		} catch {
			/* refus ou navigateur sans capteur : le doigt suffit */
		}
	}

	function tòc(e) {
		activitat(); // un toucher fait revenir les commandes (sinon elles restent cachées sur téléphone)
		if (mòde === 'polsa') {
			if (!susComandas(e)) {
				polsa?.tocar(e);
				if (e.pointerType === 'touch') indici = false;
			}
			return;
		}
		if (e.pointerType !== 'touch') return;
		darrierTòc = { x: e.clientX, y: e.clientY };
		demandarMoviment();
	}

	function levar(e) {
		darrierTòc = null;
		polsa?.levar(e); // un clic ou un toucher bref fait éclater le mot
	}

	function tecla(e) {
		activitat();
		// flèches et Espace : mot suivant ou précédent, même quand un bouton garde le focus (Joan, 05-11)
		if (mòde !== 'polsa' || menu?.matches(':popover-open')) return;
		const cible = e.target;
		if (cible?.matches?.('input, textarea, select')) return;
		if (e.key === ' ' && cible?.matches?.('button, a')) return; // Espace active le bouton
		polsa?.tecla(e);
	}

	// ── Commandes ────────────────────────────────────────────────────────
	function causirMòde(m) {
		if (m === mòde) return;
		mòde = m;
		clearTimeout(finIndici);
		if (m === 'polsa') {
			for (const id of fis.keys()) partir(id); // les mots de la pluie s'effacent
			if (sonAtiu) bascularSon(); // le son de la pluie n'a plus de sens
			indici = !calme;
			finIndici = setTimeout(() => (indici = false), 7000);
		} else {
			indici = false;
			darrierNais = temps - 3.4;
		}
		requestAnimationFrame(mesurarReserva); // les commandes ont changé de taille
	}

	function causirScena(id) {
		menu?.hidePopover?.();
		if (id === scenaId) return;
		if (id === QUASERNET.id) {
			motsQuasernet = motsDelQuasernet($state.snapshot(carnet.cartes), aRevoir(carnet));
			if (!motsQuasernet.length) return;
		}
		vistas[id] = true;
		scenaId = id;
		sac = [];
		for (const id2 of fis.keys()) partir(id2);
		darrierNais = temps - 3.4; // un premier mot arrive vite
	}

	async function bascularSon() {
		if (!son) son = crearSonPlueja();
		if (sonAtiu) {
			son.amortar();
			sonAtiu = false;
		} else {
			sonAtiu = true;
			try {
				await son.allumar();
			} catch {
				sonAtiu = false;
			}
		}
	}

	function bascularPlen() {
		if (document.fullscreenElement) document.exitFullscreen?.();
		else racina?.requestFullscreen?.().catch(() => {});
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		tactil = matchMedia('(pointer: coarse)').matches;
		plenPossible = !!document.fullscreenEnabled;
		demarrerCarnet();
		talhar();
		activitat();
		finIndici = setTimeout(() => (indici = false), 9000);
		addEventListener('resize', talhar);
		addEventListener('wheel', rodeta, { passive: true });
		addEventListener('devicemotion', moviment);
		addEventListener('deviceorientation', orientacion);
		addEventListener('keydown', tecla);
		addEventListener('pointermove', bolegaPuntador);
		addEventListener('pointerdown', tòc);
		addEventListener('pointerup', levar);
		addEventListener('pointercancel', levar);
		darrierNais = -3.6; // premier mot après une seconde
		raf = requestAnimationFrame((t) => {
			darrier = t;
			tick(t);
		});
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(finIndici);
			clearTimeout(minuteurInactiu);
			removeEventListener('resize', talhar);
			removeEventListener('wheel', rodeta);
			removeEventListener('devicemotion', moviment);
			removeEventListener('deviceorientation', orientacion);
			removeEventListener('keydown', tecla);
			removeEventListener('pointermove', bolegaPuntador);
			removeEventListener('pointerdown', tòc);
			removeEventListener('pointerup', levar);
			removeEventListener('pointercancel', levar);
			son?.tampar();
			if (document.fullscreenElement) document.exitFullscreen?.();
		};
	});
</script>

<svelte:head>
	<title>{tria(T.titol)} · Lo Ligam</title>
</svelte:head>

<main
	id="contengut"
	class="plueja scena-{scenaId}"
	class:inactiu
	class:pausa
	class:calme
	bind:this={racina}
>
	<header class="cap">
		<a class="tornar" href="/" aria-label="Lo Ligam, {tria(T.tornar)}"><span aria-hidden="true">‹</span> Lo Ligam</a>
		<h1>{tria(T.titol)}</h1>
	</header>

	<!-- Fonds : une image par ambiance, chargée seulement à la première visite -->
	<div class="fons" aria-hidden="true">
		{#each TOTAS as s (s.id)}
			{#if s.imatge}
				{#if vistas[s.id]}
					<img class="foto" class:vis={s.id === scenaId} src={s.imatge} alt="" style:object-position={s.posicion} decoding="async" />
				{/if}
			{:else if s.teinta}
				<!-- en attendant la photo de Romain : un fond sombre teinté, 0 octet -->
				{#if vistas[s.id]}
					<div class="fons-teint" class:vis={s.id === scenaId} style:--teinta={s.teinta}></div>
				{/if}
			{:else}
				<div class="cel-nuech" class:vis={s.id === scenaId}>
					<!-- collines en silhouette : deux plans, quelques octets -->
					<svg class="collas" viewBox="0 0 1000 200" preserveAspectRatio="none">
						<path d="M0 118C120 82 220 96 330 72S560 92 680 62 900 70 1000 52V200H0Z" fill="#0b1626" />
						<path d="M0 160C150 126 260 150 400 131S640 150 780 128 950 136 1000 124V200H0Z" fill="#060c16" />
					</svg>
				</div>
			{/if}
		{/each}
		<div class="vela"></div>
	</div>

	<canvas bind:this={tela} class="tela" aria-hidden="true"></canvas>

	{#if mòde === 'polsa'}
		<Polsa bind:this={polsa} mots={scena.mots} {pausa} {calme} {reserva} />
	{/if}

	<div class="mots" aria-hidden="true">
		{#each mots as m (m.id)}
			<div class="mot" style:--prof={m.prof} style:--escala={m.escala} {@attach registrar(m.id)}>
				<span class="oc" lang="oc">{m.oc}</span>
				<span class="filet"></span>
				<span class="def" lang="fr"
					>{#each m.partidas as p, k}{#if k > 0}{' '}{/if}<span class="mw"
							>{#each p as c}<span class="l" style:--i={c.i}>{c.l}</span>{/each}</span
						>{/each}</span
				>
			</div>
		{/each}
	</div>

	<!-- Pour les lecteurs d'écran : la liste des mots de l'ambiance, sans animation -->
	<div class="sr">
		<h2>{tria(T.mots)} · {tria(scena.nom)}</h2>
		<ul>
			{#each scena.mots as [oc, def] (oc)}
				<li><span lang="oc">{oc}</span> : <span lang="fr">{def}</span></li>
			{/each}
		</ul>
	</div>


	<p class="indici" class:vis={indici && !calme} aria-hidden={!indici}>
		{tactil ? tria(mòde === 'polsa' ? T.det : T.telefon) : tria(T.rodeta)}
	</p>

	<div class="comandas" bind:this={barra}>
		<!-- Deux mouvements : la pluie, ou la poussière d'or -->
		<div class="movements" role="group" aria-label={tria(T.movement)}>
			<button type="button" aria-pressed={mòde === 'plueja'} onclick={() => causirMòde('plueja')}>{tria(T.plueja)}</button>
			<button type="button" aria-pressed={mòde === 'polsa'} onclick={() => causirMòde('polsa')}>{tria(T.polsa)}</button>
		</div>
		<!-- Onze ambiances : un bouton qui ouvre la liste ; un clic ailleurs ou
		     Échap la referme (popover natif, rien à programmer pour ça) -->
		<button type="button" class="obrir-temas" popovertarget="temas">
			<span class="etiqueta">{tria(T.ambianca)}</span>
			{#if scena.numero}<span class="num">{scena.numero}</span>{' '}{/if}{tria(scena.nom)}
		</button>
		<div id="temas" class="temas" popover role="group" aria-label={tria(T.ambianca)} bind:this={menu} ontoggle={(e) => e.newState === 'closed' && activitat()}>
			<!-- les mots de son carnet d'abord : ce qu'on a appris soi-même -->
			<section class="grop grop-quasernet">
				<h2>{tria(T.quasernet)}</h2>
				{#if nQuasernet}
					<ul>
						<li>
							<button type="button" aria-pressed={scenaId === QUASERNET.id} onclick={() => causirScena(QUASERNET.id)}>
								{tria(QUASERNET.nom)} <span class="compte">{nQuasernet}</span>
							</button>
						</li>
					</ul>
				{:else}
					<p class="void">{tria(T.quasernetVoid)} <a href="/aprene">S’apren</a></p>
				{/if}
			</section>
			{#each GROPS as g (g.id)}
				<section class="grop grop-{g.id}">
					<h2>{tria(g.nom)}</h2>
					<ul>
						{#each SCENAS.filter((s) => s.grop === g.id) as s (s.id)}
							<li>
								<button type="button" aria-pressed={s.id === scenaId} onclick={() => causirScena(s.id)}>
									{#if s.numero}<span class="num">{s.numero}</span>{' '}{/if}{tria(s.nom)}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
		{#if mòde === 'plueja'}
			<label class="forca" style:--niv={niv}>
				<span>{tria(T.forca)}</span>
				<input type="range" min="0" max="1" step="0.05" bind:value={fons} />
			</label>
		{/if}
		<div class="botons">
			{#if mòde === 'plueja'}
				<button type="button" aria-pressed={sonAtiu} onclick={bascularSon}>{tria(T.son)}</button>
			{/if}
			<button type="button" aria-pressed={pausa} onclick={() => (pausa = !pausa)}>{tria(T.pausa)}</button>
			{#if plenPossible}
				<button type="button" onclick={bascularPlen}>{tria(T.plenEcran)}</button>
			{/if}
		</div>
	</div>
</main>

<style>
	.plueja {
		--crema: #f7f3ee;
		--aur-clar: #ffd47f;
		--def: #f1dcb2;
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: #0b1517;
		color: var(--crema);
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		z-index: 1;
	}
	.plueja.inactiu {
		cursor: none;
	}

	/* ── Fonds ── */
	.fons,
	.tela,
	.mots {
		position: absolute;
		inset: 0;
	}
	.foto,
	.cel-nuech,
	.fons-teint {
		position: absolute;
		inset: -4%;
		width: 108%;
		height: 108%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 1.6s ease;
		animation: respir 80s ease-in-out infinite alternate;
	}
	.foto.vis,
	.cel-nuech.vis,
	.fons-teint.vis {
		opacity: 1;
	}
	/* Fond d'attente des unités : la teinte du thème, très assourdie */
	.fons-teint {
		background:
			radial-gradient(ellipse 70% 55% at 28% 24%, color-mix(in srgb, var(--teinta) 34%, transparent), transparent 72%),
			radial-gradient(ellipse 60% 50% at 82% 88%, color-mix(in srgb, var(--teinta) 18%, transparent), transparent 70%),
			linear-gradient(165deg, #0e181a, #091214 60%, #060b0c);
	}
	@keyframes respir {
		from {
			scale: 1;
			translate: 0 0;
		}
		to {
			scale: 1.08;
			translate: -1.5% -1%;
		}
	}
	.cel-nuech {
		background:
			radial-gradient(circle at 76% 21%, #f6ead0 0 2.4vmin, rgba(255, 236, 200, 0.28) 2.7vmin, rgba(255, 226, 170, 0.08) 7vmin, transparent 20vmin),
			radial-gradient(ellipse at 50% 120%, #22324a 0%, transparent 60%),
			linear-gradient(#050a14, #0c1828 55%, #17233a);
	}
	.collas {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30%;
	}
	.vela {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 85% 75% at 50% 42%, rgba(8, 16, 18, 0.18), rgba(5, 11, 13, 0.62)),
			linear-gradient(to top, rgba(4, 9, 11, 0.72), transparent 32%),
			linear-gradient(to bottom, rgba(4, 9, 11, 0.45), transparent 22%);
	}
	.tela {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* ── Mots ── */
	.mots {
		pointer-events: none;
	}
	.mot {
		position: absolute;
		top: 0;
		left: 0;
		max-width: min(30rem, 84vw);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		translate: -9999px -9999px;
		opacity: 0;
		animation: venir 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		will-change: translate, rotate;
	}
	.mot.part {
		animation: s-esvanir 1.8s ease-in forwards;
	}
	@keyframes venir {
		from {
			opacity: 0;
			filter: blur(10px);
			scale: 0.94;
		}
		to {
			opacity: calc(0.5 + var(--prof) * 0.5);
			filter: blur(0);
			scale: 1;
		}
	}
	@keyframes s-esvanir {
		from {
			opacity: calc(0.5 + var(--prof) * 0.5);
			filter: blur(0);
		}
		to {
			opacity: 0;
			filter: blur(9px);
		}
	}
	.oc {
		font-family: var(--font-heading);
		font-size: calc(clamp(1.7rem, 1rem + 2.4vw, 3.4rem) * (0.8 + (var(--prof) - 0.62) * 0.53) * var(--escala, 1)); /* plancher 0,8 : Limelight reste gros */
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--crema);
		text-shadow:
			0 0 28px rgba(0, 0, 0, 0.55),
			0 1px 2px rgba(0, 0, 0, 0.45);
		/* une expression longue passe sur deux lignes égales */
		text-wrap: balance;
	}
	.filet {
		display: block;
		height: 1px;
		width: 0;
		background: var(--aur-clar);
		opacity: 0.65;
		animation: tirar 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s forwards;
	}
	@keyframes tirar {
		to {
			width: 2.4rem;
		}
	}
	.def {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: calc(clamp(1.05rem, 0.9rem + 0.5vw, 1.45rem) * (0.55 + var(--prof) * 0.45));
		line-height: 1.3;
		color: var(--def);
		text-shadow:
			0 0 16px rgba(0, 0, 0, 0.7),
			0 1px 1px rgba(0, 0, 0, 0.5);
	}
	.mw {
		white-space: nowrap;
	}
	.l {
		display: inline-block;
		opacity: 0;
		animation: escriure 0.9s ease-out forwards;
		animation-delay: calc(1.35s + var(--i) * 45ms);
	}
	@keyframes escriure {
		from {
			opacity: 0;
			filter: blur(4px);
			translate: 0.12em 0.18em;
		}
		to {
			opacity: 1;
			filter: blur(0);
			translate: 0 0;
		}
	}
	.pausa .mot,
	.pausa .mot *,
	.pausa .foto,
	.pausa .cel-nuech {
		animation-play-state: paused;
	}

	/* ── En-tête et commandes : s'effacent quand on ne touche à rien ── */
	.cap,
	.comandas,
	.indici {
		z-index: 2;
	}
	.cap,
	.comandas {
		transition: opacity 0.9s ease;
	}
	.inactiu .cap,
	.inactiu .comandas {
		opacity: 0;
	}
	.cap:focus-within,
	.comandas:focus-within {
		opacity: 1;
	}
	.cap {
		position: absolute;
		top: 0;
		left: 0;
		padding: 1.1rem clamp(1rem, 3vw, 2rem);
		display: flex;
		align-items: baseline;
		gap: 1.1rem;
	}
	.tornar {
		font-family: var(--font-body);
		font-size: 0.82rem;
		color: rgba(247, 243, 238, 0.78);
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.tornar:hover {
		color: var(--crema);
	}
	h1 {
		margin: 0;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.74rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.55);
	}

	.indici {
		position: absolute;
		left: 50%;
		bottom: 5.6rem;
		translate: -50% 0;
		margin: 0;
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.15rem;
		color: rgba(247, 243, 238, 0.8);
		text-shadow: 0 0 14px rgba(0, 0, 0, 0.7);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 1.4s ease;
		pointer-events: none;
	}
	.indici.vis {
		opacity: 1;
		transition-delay: 1.2s;
	}

	.comandas {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1rem clamp(1rem, 3vw, 2rem) max(1.1rem, env(safe-area-inset-bottom));
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.7rem 2.4rem;
		font-family: var(--font-body);
		font-size: 0.8rem;
		letter-spacing: 0.05em;
	}
	.botons,
	.movements {
		display: flex;
		gap: 1.3rem;
	}

	/* ── Choix de l'ambiance ── */
	.obrir-temas {
		display: inline-flex;
		align-items: baseline;
		gap: 0.55rem;
		color: var(--crema);
	}
	.etiqueta {
		color: rgba(247, 243, 238, 0.55);
	}
	.etiqueta::after {
		content: ' ·';
	}
	.num {
		display: inline-block;
		min-width: 1.2em;
		margin-right: 0.2em; /* plus l'espace du texte, lue par les lecteurs d'écran */
		font-variant-numeric: tabular-nums;
		color: var(--aur-clar);
	}
	.temas {
		/* le popover natif se centre ; on le pose au-dessus de la barre */
		position: fixed;
		inset: auto auto calc(5.2rem + env(safe-area-inset-bottom)) 50%;
		translate: -50% 0;
		margin: 0;
		width: min(36rem, calc(100vw - 32px));
		max-height: min(70vh, 34rem);
		overflow: auto;
		overscroll-behavior: contain;
		touch-action: pan-y;
		padding: 1.1rem 1.4rem 1.2rem;
		border: 1px solid rgba(255, 212, 127, 0.22);
		border-radius: 0.9rem;
		background: rgba(8, 15, 17, 0.84);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: var(--crema);
		font-family: var(--font-body);
		font-size: 0.9rem;
		letter-spacing: 0.03em;
	}
	.temas::backdrop {
		background: transparent;
	}
	.temas h2 {
		margin: 0 0 0.5rem;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.55);
	}
	.grop + .grop {
		margin-top: 1rem;
		padding-top: 0.9rem;
		border-top: 1px solid rgba(247, 243, 238, 0.12);
	}
	.temas ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 1.6rem;
	}
	.grop-poesia ul {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.temas li button {
		width: 100%;
		min-height: 2.6rem;
		padding: 0.45rem 0;
		text-align: left;
		color: rgba(247, 243, 238, 0.78);
	}
	button {
		appearance: none;
		background: none;
		border: 0;
		padding: 0.35rem 0;
		font: inherit;
		letter-spacing: inherit;
		color: rgba(247, 243, 238, 0.62);
		cursor: pointer;
		text-decoration: underline transparent;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.45em;
		transition:
			color 0.3s,
			text-decoration-color 0.3s;
	}
	button:hover {
		color: var(--crema);
	}
	button[aria-pressed='true'] {
		color: var(--crema);
		text-decoration-color: var(--aur-clar);
	}
	.compte {
		margin-left: 0.4em;
		font-size: 0.85em;
		font-variant-numeric: tabular-nums;
		color: var(--aur-clar);
	}
	.void {
		margin: 0;
		line-height: 1.55;
		color: rgba(247, 243, 238, 0.62);
	}
	.void a {
		color: var(--crema);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.3em;
		text-decoration-color: rgba(247, 243, 238, 0.4);
		transition: text-decoration-color 0.3s;
	}
	.void a:hover {
		text-decoration-color: var(--crema);
	}
	button:focus-visible,
	.tornar:focus-visible,
	.void a:focus-visible,
	input:focus-visible {
		outline: 1px solid var(--aur-clar);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.forca {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		color: rgba(247, 243, 238, 0.62);
	}
	/* Curseur en filet fin : la partie dorée montre la pluie du moment
	   (base choisie + élan du geste), la pastille la base choisie. */
	input[type='range'] {
		appearance: none;
		-webkit-appearance: none;
		width: 7.5rem;
		height: 1rem;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 1px;
		background: linear-gradient(to right, var(--aur-clar) calc(var(--niv) * 100%), rgba(247, 243, 238, 0.3) 0);
	}
	input[type='range']::-moz-range-track {
		height: 1px;
		background: linear-gradient(to right, var(--aur-clar) calc(var(--niv) * 100%), rgba(247, 243, 238, 0.3) 0);
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 11px;
		height: 11px;
		margin-top: -5px;
		border-radius: 50%;
		background: var(--crema);
		border: 0;
	}
	input[type='range']::-moz-range-thumb {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--crema);
		border: 0;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Téléphone : commandes sur deux lignes, plus serrées */
	@media (max-width: 640px) {
		.comandas {
			gap: 0.4rem 1.4rem;
			font-size: 0.78rem;
		}
		.botons,
		.movements {
			gap: 1rem;
		}
		.temas {
			bottom: calc(7rem + env(safe-area-inset-bottom));
			padding: 1rem 1.1rem;
		}
		.temas ul {
			grid-template-columns: minmax(0, 1fr);
		}
		.grop-poesia ul {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 0.8rem;
		}
		.indici {
			bottom: 7.4rem;
		}
	}

	/* Réduire les animations : rien ne tombe, les mots apparaissent en fondu */
	@media (prefers-reduced-motion: reduce) {
		.foto,
		.cel-nuech,
		.fons-teint {
			animation: none;
		}
		.mot,
		.mot.part {
			animation-name: fondu;
			animation-duration: 1.2s;
		}
		.mot.part {
			animation-direction: reverse;
		}
		.l,
		.filet {
			animation: none;
			opacity: 1;
		}
		.filet {
			width: 2.4rem;
		}
		@keyframes fondu {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
</style>
