<script>
	// Paisatges : la troisième façon de regarder de Remira (Romain, 05-11 :
	// « le défilé de paysages »). Une photo de Romain à la fois, entière et
	// fixe entre l'en-tête et les commandes, jamais agrandie au-delà de son
	// fichier (Romain, 07-11 : « encore trop zoomées, avec une mauvaise
	// qualité » ; elle couvrait l'écran et glissait, et Firefox avance pixel
	// par pixel une photo qui glisse lentement, d'où des à-coups). Des points
	// d'or fins sont posés dessus, chacun sur une zone floue : quand son mot
	// paraît, la zone se défloute et le reste (Romain, 07-11 : « des zones de
	// flou qui se défloutent quand les mots se révèlent »). On en touche un, le
	// mot occitan s'écrit, le français dessous ; un toucher ailleurs le
	// referme. Sans rien toucher, les mots paraissent seuls, un à un (Romain,
	// 06-11 : le jeu est dans Jòcs, ici on regarde). On glisse le doigt, on fait
	// tourner la molette ou on prend les flèches pour le paysage suivant, qui
	// arrive dans un disque qui grandit (jamais de fondu entre deux photos).
	// Données : ./paisatges.js. Les gestes viennent de la page (rodeta, tecla).
	import { onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { MOTS, camin, srcset, deTema } from './paisatges.js';
	import { GARDATS, relevar } from './releu.js';

	// tema : le thème choisi (la page remonte le composant quand il change) ;
	// relèu : l'option « relief » (06-11), sur les photos gardées dans Triar
	// (toutes avec relèuTotas, pour les essais en local) ; reserva : la place
	// prise en haut par l'en-tête et en bas par les commandes
	let { pausa = false, calme = false, n = $bindable(0), tema = null, relèu = false, relèuTotas = false, reserva = { naut: 64, bas: 110 } } = $props();
	const LISTA = untrack(() => deTema(tema));

	// L'ordre des paysages change à chaque visite, le premier aussi ; l'ordre
	// d'apparition des points aussi (Romain, 06-11 : « s'assurer de la variation »)
	function barrejar(t) {
		for (let i = t.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[t[i], t[j]] = [t[j], t[i]];
		}
		return t;
	}
	const ordre = barrejar(LISTA.map((_, k) => k));
	const pais = (pos) => LISTA[ordre[(pos + ordre.length) % ordre.length]];
	// nets : les points dont la zone s'est défloutée sur cette photo
	const novela = (id, k) => ({ id, k, rangs: barrejar(pais(k).mots.map((_, i) => i)), nets: [] });

	let racina = $state();
	let W = $state(0),
		H = $state(0);
	// Les paysages à l'écran : le montré, et pendant le disque celui qui s'en
	// va dessous (le même élément : rien ne saute).
	let seq = 0;
	let vistas = $state([novela(0, n)]);
	const actiuId = $derived(vistas.at(-1).id);
	let causit = $state(null); // le point ouvert
	let auto = $state(null); // le point qui parle seul, au défilement
	const mostrat = $derived(causit ?? auto); // le mot écrit à l'écran
	let costat = $state('drecha'); // l'étiquette à droite, à gauche, dessous ou dessus du point
	const anims = new Map(); // id → l'horloge du relief
	// la photo entière dans l'écran : sa largeur, environ
	const sizes = (q) => `(min-aspect-ratio: ${q.l}/${q.h}) ${Math.ceil((q.l / q.h) * 82)}vh, 96vw`;

	// La photo entière, centrée entre l'en-tête et les commandes, jamais plus
	// grande que son plus grand fichier (en pixels CSS) ; fl : le diamètre des
	// zones floues, flou : leur force (plus doux sur une petite photo)
	function fenestra(q) {
		if (!W || !H) return null;
		const gora = Math.min(32, Math.max(12, W * 0.03));
		const naut = reserva.naut + 8,
			zh = Math.max(120, H - naut - reserva.bas - 8),
			zw = Math.max(120, W - 2 * gora);
		const s = Math.min(zw / q.l, zh / q.h, Math.max(...q.amples) / q.l);
		const w = Math.round(q.l * s),
			h = Math.round(q.h * s),
			c = Math.min(w, h);
		return {
			x: Math.round((W - w) / 2),
			y: Math.round(naut + (zh - h) / 2),
			w,
			h,
			fl: Math.round(Math.max(72, c * 0.26)),
			flou: Math.round(Math.min(10, Math.max(4, c / 80)))
		};
	}

	// Le relief : une horloge (une animation qui ne déplace rien) mène la
	// profondeur ; le cadre, lui, ne bouge pas (07-11)
	const rellotge = (id) => (el) => {
		const a = el.animate([{ transform: 'none' }, { transform: 'none' }], {
			duration: 16000,
			iterations: Infinity,
			direction: 'alternate',
			easing: 'ease-in-out'
		});
		anims.set(id, a);
		untrack(() => {
			if (id === actiuId && (pausa || causit !== null)) a.pause();
		});
		return () => {
			a.cancel();
			anims.delete(id);
		};
	};

	// Le relief : un canevas sous la photo, à sa taille ; la photo s'efface
	// dessus, les points d'or et le mot restent dans le cadre et suivent leur
	// objet (./releu.js). Le cadre ne bouge pas : le proche glisse un peu sur le
	// fond, comme si la photo glissait de la moitié de sa largeur (décalage
	// borné à 1,2 % de la photo).
	const relevarVista = (q, id) => (cv) =>
		untrack(() => {
			const quadre = cv.nextElementSibling;
			return relevar(cv, {
				clau: q.clau,
				img: quadre.querySelector('img'),
				estat: () => {
					const a = anims.get(id);
					const f = fenestra(q);
					if (!a || !f) return null;
					return { a, w: f.w, h: f.h, t0: [0, 0], t1: [0, 0], s1: 1, W: f.w, H: f.h, du: f.w * 0.5, dv: f.h * 0.15 };
				},
				ponches: () =>
					[...quadre.querySelectorAll('[data-i]')].map((el) => {
						const m = q.mots[Number(el.dataset.i)];
						return [el, m[1], m[2]];
					})
			});
		});

	// Le paysage qui arrive : un disque qui grandit depuis le milieu, une fois
	// la photo prête (sinon le disque montrerait du noir).
	const dintrar = (id) => (el) => {
		if (untrack(() => calme || vistas.length < 2 || id !== actiuId)) return;
		el.style.clipPath = 'circle(0px at 50% 50%)';
		const img = el.querySelector('img');
		let a;
		let fach = false;
		const partir = () => {
			if (fach) return;
			fach = true;
			const R = Math.hypot(W, H) / 2 + 2;
			a = el.animate([{ clipPath: `circle(0px at 50% 50%)` }, { clipPath: `circle(${R}px at 50% 50%)` }], {
				duration: 1200,
				easing: 'cubic-bezier(0.55, 0, 0.25, 1)'
			});
			a.onfinish = acabar;
			finSecors = setTimeout(acabar, 1500); // onglet en arrière-plan : la navigation ne reste pas bloquée
		};
		let acabat = false;
		let finSecors = 0;
		const acabar = () => {
			if (acabat) return;
			acabat = true;
			a?.cancel(); // déjà fini d'habitude ; sinon le disque ne reste pas fermé
			el.style.clipPath = '';
			vistas = vistas.filter((v) => v.id === id);
		};
		(img?.decode?.() ?? Promise.resolve()).catch(() => {}).then(partir);
		const secors = setTimeout(partir, 1800);
		return () => {
			clearTimeout(secors);
			clearTimeout(finSecors);
			a?.cancel();
		};
	};

	// Le suivant et le précédent sont chargés d'avance, en silence.
	function precargar(k) {
		const q = pais(k);
		const i = new Image();
		i.sizes = sizes(q);
		i.srcset = srcset(q);
		i.src = camin(q.clau, q.amples[0]);
	}

	function anar(d) {
		if (vistas.length > 1) return; // un disque à la fois
		causit = null;
		tornarAuto();
		n = (n + d + LISTA.length) % LISTA.length;
		const v = novela(++seq, n);
		vistas = calme ? [v] : [...vistas, v];
		precargar(n + d);
	}
	export const seguent = () => anar(1);
	export const precedent = () => anar(-1);

	// ── Points ─────────────────────────────────────────────────────────
	// L'étiquette, une fois écrite : à droite du point s'il y a la place,
	// sinon à gauche, sinon dessous (dessus en bas de l'écran), centrée sans
	// sortir de l'écran (téléphone, 07-11 : « la piramida » sortait à droite)
	const plaçar = (x, y) => (el) =>
		untrack(() => {
			const q = el.parentElement.getBoundingClientRect();
			const ax = q.left + x * q.width,
				ay = q.top + y * q.height;
			const wl = el.offsetWidth,
				hl = el.offsetHeight,
				e = 30,
				m = 10;
			let dx = 0;
			if (ax + e + wl <= W - m) costat = 'drecha';
			else if (ax - e - wl >= m) costat = 'esquerra';
			else {
				costat = ay + e + hl <= H - reserva.bas ? 'dessota' : 'dessus';
				const l = ax - wl / 2;
				dx = Math.min(Math.max(l, m), W - m - wl) - l;
			}
			el.style.setProperty('--dx', `${Math.round(dx)}px`);
		});
	function dobrir(i) {
		auto = null;
		autoDempuei = performance.now() + 2500; // après un toucher, un temps de silence
		if (causit === i) {
			causit = null;
			return;
		}
		causit = i;
	}

	// ── Les mots qui paraissent seuls ──────────────────────────────────
	// Toutes les demi-secondes : si rien n'est écrit, le point suivant (dans
	// l'ordre, mélangé, où les points sont nés ; pas encore dit sur cette photo)
	// dit son mot 4 s ; puis 3,5 s de silence : un mot toutes les 8 à 9 s, pas
	// un diaporama (Joan, 06-11). Tous dits : on recommence.
	const DIRE = 4200,
		SILENCI = 3500;
	let autoDempuei = 0; // l'heure du dernier changement
	const dits = new Set();
	let darrierDit = -1;
	function tornarAuto() {
		auto = null;
		dits.clear();
		darrierDit = -1;
		autoDempuei = performance.now() + 2600; // le disque, puis les points qui naissent
	}
	function vigilar() {
		const ara = performance.now();
		// en pause, le mot reste, et il aura encore ses 4 s à la reprise
		if (pausa) autoDempuei = Math.max(autoDempuei, ara);
		if (pausa || causit !== null || vistas.length > 1 || !racina || !W) return;
		if (auto !== null) {
			if (ara - autoDempuei > DIRE) {
				auto = null;
				autoDempuei = ara;
			}
			return;
		}
		if (ara - autoDempuei < SILENCI) return;
		const vista = vistas.at(-1);
		const parescuts = [];
		for (const b of racina.querySelectorAll('.ponch')) {
			if (+getComputedStyle(b).opacity < 0.9) continue;
			parescuts.push({ b, i: Number(b.dataset.i) });
		}
		let cands = parescuts.filter((v) => !dits.has(v.i));
		if (!cands.length && parescuts.length) {
			dits.clear();
			cands = parescuts.filter((v) => v.i !== darrierDit);
		}
		if (!cands.length) return;
		const v = cands.reduce((a, c) => (vista.rangs[c.i] < vista.rangs[a.i] ? c : a));
		auto = v.i;
		dits.add(v.i);
		darrierDit = v.i;
		autoDempuei = ara;
	}

	// La zone du mot qui paraît se défloute, et le reste sur cette photo.
	$effect(() => {
		const i = mostrat;
		if (i === null) return;
		const v = untrack(() => vistas.at(-1));
		if (!v.nets.includes(i)) v.nets.push(i);
	});

	// Le relief s'arrête le temps de lire un mot, et en pause.
	$effect(() => {
		const arrestat = pausa || causit !== null || tocant; // lu d'abord : l'effet en dépend toujours
		const a = anims.get(actiuId);
		if (!a) return;
		if (arrestat) a.pause();
		else a.play();
	});

	// ── Gestes (la page les transmet) ──────────────────────────────────
	let acum = 0,
		finAcum = 0,
		barrat = 0;
	export function rodeta(d) {
		const ara = performance.now();
		if (ara < barrat) return;
		clearTimeout(finAcum);
		finAcum = setTimeout(() => (acum = 0), 260);
		acum += d;
		if (Math.abs(acum) > 120) {
			anar(acum > 0 ? 1 : -1);
			acum = 0;
			barrat = ara + 1100; // un pavé tactile ne fait pas défiler trois paysages
		}
	}

	export function tecla(e) {
		if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
			e.preventDefault();
			anar(1);
		} else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
			e.preventDefault();
			anar(-1);
		} else if (e.key === 'Escape') causit = auto = null;
	}

	// Glisser le doigt : paysage suivant ou précédent. Le temps du toucher, la
	// photo ne bouge plus ; un doigt qui tombe tout près d'un point l'ouvre
	// quand même ; ailleurs, le mot se referme.
	let depart = null;
	let tocant = $state(false);
	function tocar(e) {
		depart = { x: e.clientX, y: e.clientY };
		tocant = true;
	}
	function ponchProche(x, y) {
		let melhor = null,
			dist = 40; // px depuis le milieu du point (la cible en fait 22)
		for (const b of racina.querySelectorAll('.ponch')) {
			if (+getComputedStyle(b).opacity < 0.5) continue; // pas encore paru (Joan, 06-11)
			const r = b.getBoundingClientRect();
			const d = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y);
			if (d < dist) {
				dist = d;
				melhor = b;
			}
		}
		return melhor;
	}
	function levar(e) {
		tocant = false;
		if (!depart) return;
		const dx = e.clientX - depart.x,
			dy = e.clientY - depart.y;
		depart = null;
		if (Math.max(Math.abs(dx), Math.abs(dy)) > 56) {
			const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
			anar(d < 0 ? 1 : -1);
		} else if (!e.target.closest?.('.ponch')) {
			const b = ponchProche(e.clientX, e.clientY);
			if (b) dobrir(Number(b.dataset.i));
			else if (causit !== null || auto !== null) {
				causit = auto = null;
				autoDempuei = performance.now() + 2500;
			}
		}
	}

	onMount(() => {
		const mesurar = () => {
			W = racina.clientWidth;
			H = racina.clientHeight;
		};
		mesurar();
		const ro = new ResizeObserver(mesurar);
		ro.observe(racina);
		precargar(n + 1);
		autoDempuei = performance.now() + 1500; // la page arrive, puis les points
		const vigia = setInterval(vigilar, 500);
		return () => {
			ro.disconnect();
			clearTimeout(finAcum);
			clearInterval(vigia);
		};
	});
</script>

{#snippet vista(q, id, rangs, nets)}
	{@const actiu = id === actiuId}
	{@const ambRelèu = relèu && !calme && (relèuTotas || GARDATS.has(q.clau))}
	{@const f = fenestra(q)}
	<!-- la photo entière, à sa place entre l'en-tête et les commandes -->
	<div
		class="fenestra"
		style:left="{f?.x ?? 0}px"
		style:top="{f?.y ?? 0}px"
		style:width="{f?.w ?? 0}px"
		style:height="{f?.h ?? 0}px"
		style:--fl="{f?.fl ?? 64}px"
		style:--flou="{f?.flou ?? 6}px"
	>
	{#if ambRelèu}<canvas class="releu-c" aria-hidden="true" {@attach relevarVista(q, id)}></canvas>{/if}
	<!-- les points paraissent après le disque (après l'arrivée de la page pour le premier) -->
	<div class="quadre" class:releu={ambRelèu} style:--d0={id === 0 ? '0.6s' : '1.25s'} {@attach ambRelèu && rellotge(id)}>
		<img
			src={camin(q.clau, q.amples[0])}
			srcset={srcset(q)}
			sizes={sizes(q)}
			width={q.l}
			height={q.h}
			alt={actiu ? q.alt : ''}
			fetchpriority={actiu ? 'high' : undefined}
		/>
		{#if actiu}
			<!-- une zone floue sous chaque point : elle se défloute quand le mot paraît -->
			<div class="flos" aria-hidden="true">
				{#each q.mots as [oc, x, y], i (oc)}
					<span class="flo" class:net={nets.includes(i)} style:left="{x * 100}%" style:top="{y * 100}%" style:--i={rangs[i]}></span>
				{/each}
			</div>
			{#each q.mots as [oc, x, y], i (oc)}
				<button
					type="button"
					class="ponch"
					class:causit={mostrat === i}
					style:left="{x * 100}%"
					style:top="{y * 100}%"
					style:--i={rangs[i]}
					data-i={i}
					aria-pressed={causit === i}
					onclick={() => dobrir(i)}
				>
					<span class="onda" aria-hidden="true"></span>
					<span class="sr"><span lang="oc">{oc}</span>, <span lang="fr">{MOTS[oc]}</span></span>
				</button>
			{/each}
			{#if mostrat !== null}
				{@const [oc, x, y] = q.mots[mostrat]}
				{#key mostrat}
					<div
						class="eticeta {costat}"
						data-i={mostrat}
						{@attach plaçar(x, y)}
						style:left="{x * 100}%"
						style:top="{y * 100}%"
						aria-hidden="true"
						out:fade|global={{ duration: calme ? 0 : 700 }}
					>
						<span class="oc" lang="oc">{oc}</span>
						<span class="filet"></span>
						<span class="def" lang="fr">{MOTS[oc]}</span>
					</div>
				{/key}
			{/if}
		{/if}
	</div>
	</div>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="paisatges"
	class:calme
	bind:this={racina}
	onpointerdown={tocar}
	onpointerup={levar}
	onpointercancel={() => {
		depart = null;
		tocant = false;
	}}
>
	{#each vistas as v (v.id)}
		<div class="vista" aria-hidden={v.id !== actiuId} {@attach dintrar(v.id)}>{@render vista(pais(v.k), v.id, v.rangs, v.nets)}</div>
	{/each}
	<div class="vela" aria-hidden="true"></div>
</div>

<style>
	.paisatges {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: #0b1517;
		touch-action: none;
	}
	.vista {
		position: absolute;
		inset: 0;
		/* clip, pas hidden : un point qui prend le focus ne fait pas défiler */
		overflow: clip;
		/* opaque : le disque qui grandit cache tout le paysage d'avant */
		background: #0b1517;
	}
	.fenestra,
	.quadre {
		position: absolute;
	}
	.quadre {
		inset: 0;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
		-webkit-user-drag: none;
	}
	/* Le relief : la photo agrandie de la marge du relief (1 / 0,98, ./releu.js)
	   et rognée d'autant, pour qu'elle s'efface sur le canevas sans saut */
	.quadre.releu img {
		scale: 1.0204;
		clip-path: inset(1% round 6px);
	}
	.releu-c {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		opacity: 0; /* jusqu'au premier dessin, sous la photo */
		pointer-events: none;
	}

	/* ── Les zones floues : un disque aux bords fondus, qui naît avec son point
	   et se défloute quand le mot paraît (un toucher, ou seul) ── */
	.flos {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 6px;
		pointer-events: none;
	}
	.flo {
		position: absolute;
		width: var(--fl, 64px);
		aspect-ratio: 1;
		translate: -50% -50%;
		border-radius: 50%;
		-webkit-backdrop-filter: blur(var(--flou, 6px));
		backdrop-filter: blur(var(--flou, 6px));
		-webkit-mask-image: radial-gradient(closest-side, #000 30%, rgba(0, 0, 0, 0.55) 62%, transparent);
		mask-image: radial-gradient(closest-side, #000 30%, rgba(0, 0, 0, 0.55) 62%, transparent);
		opacity: 0;
		animation: aparéisser-flo 1.4s ease forwards;
		animation-delay: calc(var(--d0, 0.6s) + var(--i) * 0.42s - 0.25s);
		transition:
			backdrop-filter 1.8s cubic-bezier(0.3, 0.6, 0.2, 1),
			-webkit-backdrop-filter 1.8s cubic-bezier(0.3, 0.6, 0.2, 1);
	}
	.flo.net {
		-webkit-backdrop-filter: blur(0px);
		backdrop-filter: blur(0px);
	}
	@keyframes aparéisser-flo {
		to {
			opacity: 1;
		}
	}
	/* l'en-tête et les commandes restent lisibles sur un ciel clair */
	.vela {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(to top, rgba(4, 9, 11, 0.6), transparent 24%),
			linear-gradient(to bottom, rgba(4, 9, 11, 0.42), transparent 18%);
	}

	/* ── Les points : un anneau d'or fin qui respire ; la cible fait 44 px ── */
	.ponch {
		position: absolute;
		width: 2.75rem;
		height: 2.75rem;
		translate: -50% -50%;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: none;
		cursor: pointer;
		opacity: 0;
		-webkit-tap-highlight-color: transparent;
		/* un à un, dans un ordre qui change à chaque fois */
		animation: aparéisser 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
		animation-delay: calc(var(--d0, 0.6s) + var(--i) * 0.42s);
	}
	/* l'onde : un filet d'or qui s'élargit et s'efface, une seule fois */
	.onda {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 1.5rem;
		height: 1.5rem;
		border: 1px solid var(--aur-clar, #ffd47f);
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
		animation: onda 1.6s cubic-bezier(0.1, 0.6, 0.3, 1) forwards;
		animation-delay: calc(var(--d0, 0.6s) + var(--i) * 0.42s + 0.15s);
	}
	@keyframes onda {
		from {
			opacity: 0.9;
			scale: 0.6;
		}
		to {
			opacity: 0;
			scale: 2.6;
		}
	}
	.ponch::before,
	.ponch::after {
		content: '';
		position: absolute;
		inset: 0;
		margin: auto;
		border-radius: 50%;
	}
	.ponch::before {
		width: 1.5rem;
		height: 1.5rem;
		border: 1.5px solid var(--aur-clar, #ffd47f);
		/* une ombre sombre autour du filet : lisible sur un ciel clair comme
		   sur la roche (ce n'est pas une lueur) */
		background: rgba(255, 212, 127, 0.1);
		box-shadow:
			0 0 0 1.5px rgba(4, 9, 11, 0.5),
			0 0 10px rgba(4, 9, 11, 0.35),
			inset 0 0 0 1px rgba(4, 9, 11, 0.3);
		animation: respirar 3.4s ease-in-out infinite;
		animation-delay: calc(var(--i) * -0.8s);
	}
	.ponch::after {
		width: 0.36rem;
		height: 0.36rem;
		background: var(--aur-clar, #ffd47f);
		scale: 0;
		transition: scale 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ponch.causit::after,
	.ponch:hover::after {
		scale: 1;
	}
	.ponch.causit::before {
		animation: none;
	}
	.ponch:focus-visible {
		outline: 2px solid var(--aur-clar, #ffd47f);
		outline-offset: 2px;
	}
	@keyframes aparéisser {
		from {
			opacity: 0;
			scale: 0.35;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	@keyframes respirar {
		0%,
		100% {
			scale: 1;
			opacity: 0.7;
		}
		50% {
			scale: 1.14;
			opacity: 1;
		}
	}

	/* ── Le mot : même écriture que la pluie (Limelight, filet d'or, Cormorant) ── */
	.eticeta {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		width: max-content;
		max-width: min(22rem, 70vw);
		pointer-events: none;
	}
	.eticeta.drecha {
		align-items: flex-start;
		translate: 1.9rem -50%;
	}
	.eticeta.esquerra {
		align-items: flex-end;
		text-align: end;
		translate: calc(-100% - 1.9rem) -50%;
	}
	.eticeta.dessota,
	.eticeta.dessus {
		align-items: center;
		text-align: center;
	}
	.eticeta.dessota {
		translate: calc(-50% + var(--dx, 0px)) 1.6rem;
	}
	.eticeta.dessus {
		translate: calc(-50% + var(--dx, 0px)) calc(-100% - 1.6rem);
	}
	.oc {
		font-family: var(--font-heading);
		font-size: clamp(1.7rem, 1rem + 2.4vw, 3rem);
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--crema, #f7f3ee);
		text-shadow:
			0 0 28px rgba(0, 0, 0, 0.6),
			0 1px 2px rgba(0, 0, 0, 0.5);
		animation: venir 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.filet {
		display: block;
		height: 1px;
		width: 0;
		background: var(--aur-clar, #ffd47f);
		opacity: 0.7;
		animation: tirar 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s forwards;
	}
	.def {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: clamp(1.05rem, 0.9rem + 0.5vw, 1.4rem);
		line-height: 1.3;
		color: var(--def, #f1dcb2);
		text-shadow:
			0 0 16px rgba(0, 0, 0, 0.75),
			0 1px 1px rgba(0, 0, 0, 0.55);
		animation: venir 0.9s ease-out 0.55s both;
	}
	@keyframes venir {
		from {
			opacity: 0;
			filter: blur(8px);
		}
	}
	@keyframes tirar {
		to {
			width: 2.4rem;
		}
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Réduire les animations : rien ne respire, la zone et le mot paraissent */
	.calme .onda {
		display: none;
	}
	.calme .flo {
		animation: none;
		opacity: 1;
		transition: none;
	}
	.calme .ponch,
	.calme .ponch::before,
	.calme .oc,
	.calme .def {
		animation: none;
		opacity: 1;
	}
	.calme .filet {
		animation: none;
		width: 2.4rem;
	}
</style>
