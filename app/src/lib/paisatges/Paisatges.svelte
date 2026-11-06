<script>
	// Paisatges : la troisième façon de regarder de Remira (Romain, 05-11 :
	// « le défilé de paysages »). Une photo de Romain à la fois, plein écran ;
	// elle glisse lentement d'un bout à l'autre de ce qu'elle montre (sur un
	// téléphone, le paysage défile sous les yeux). Des points d'or fins sont
	// posés dessus : on en touche un, le mot occitan s'écrit, le français
	// dessous. Un toucher ailleurs le referme. On glisse le doigt, on fait
	// tourner la molette ou on prend les flèches pour le paysage suivant, qui
	// arrive dans un disque qui grandit (jamais de fondu entre deux photos).
	// Données : ./paisatges.js. Les gestes viennent de la page (rodeta, tecla).
	import { onMount, untrack } from 'svelte';
	import { PAISATGES, MOTS, camin, srcset } from './paisatges.js';

	let { pausa = false, calme = false, n = $bindable(0) } = $props();

	// L'ordre des paysages change à chaque visite, le premier aussi ; l'ordre
	// d'apparition des points aussi (Romain, 06-11 : « s'assurer de la variation »)
	function barrejar(t) {
		for (let i = t.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[t[i], t[j]] = [t[j], t[i]];
		}
		return t;
	}
	const ordre = barrejar(PAISATGES.map((_, k) => k));
	const pais = (pos) => PAISATGES[ordre[(pos + ordre.length) % ordre.length]];
	const novela = (id, k) => ({ id, k, rangs: barrejar(pais(k).mots.map((_, i) => i)) });

	let racina = $state();
	let W = $state(0),
		H = $state(0);
	// Les paysages à l'écran : le montré, et pendant le disque celui qui s'en
	// va dessous (le même élément, qui continue de glisser : rien ne saute).
	let seq = 0;
	let vistas = $state([novela(0, n)]);
	const actiuId = $derived(vistas.at(-1).id);
	let causit = $state(null); // le point ouvert
	let costat = $state('drecha'); // l'étiquette à droite ou à gauche du point
	const anims = new Map(); // id → { a, c } : le glissement et son cadre
	const sizes = (q) => `(min-aspect-ratio: ${q.l}/${q.h}) 100vw, ${Math.ceil((q.l / q.h) * 100)}vh`;

	// La photo couvre l'écran ; le glissement va d'un bout à l'autre des points,
	// avec assez de marge pour lire le mot ; tout tient dans l'écran : on reste.
	function cadre(q) {
		if (!W || !H) return null;
		const s = Math.max(W / q.l, H / q.h);
		const w = q.l * s,
			h = q.h * s;
		const plaja = (lis, tot, vist) => {
			const deb = tot - vist;
			if (deb < 1) return [0, 0];
			const m = vist * 0.2;
			let a = Math.min(Math.max(Math.min(...lis) * tot - m, 0), deb);
			let b = Math.min(Math.max(Math.max(...lis) * tot + m - vist, 0), deb);
			if (b <= a) a = b = Math.min(Math.max(((Math.min(...lis) + Math.max(...lis)) / 2) * tot - vist / 2, 0), deb);
			return [a, b];
		};
		const [uA, uB] = plaja(
			q.mots.map((m) => m[1]),
			w,
			W
		);
		const [vA, vB] = plaja(
			q.mots.map((m) => m[2]),
			h,
			H
		);
		const camin = Math.hypot(uB - uA, vB - vA);
		return { w, h, uA, uB, vA, vB, durada: Math.max(28000, (camin / 14) * 1000) };
	}

	// Chaque paysage : sa taille, et son glissement (aller-retour, sans fin)
	const glissar = (q, id) => (el) => {
		const c = cadre(q);
		if (!c) return;
		el.style.width = `${c.w}px`;
		el.style.height = `${c.h}px`;
		const t0 = `translate(${-c.uA}px, ${-c.vA}px)`;
		if (calme) {
			el.style.transform = `translate(${-(c.uA + c.uB) / 2}px, ${-(c.vA + c.vB) / 2}px)`;
			return;
		}
		el.style.transform = t0;
		const a = el.animate([{ transform: `${t0} scale(1)` }, { transform: `translate(${-c.uB}px, ${-c.vB}px) scale(1.04)` }], {
			duration: c.durada,
			iterations: Infinity,
			direction: 'alternate',
			easing: 'ease-in-out'
		});
		anims.set(id, { a, c });
		untrack(() => {
			if (id === actiuId && (pausa || causit !== null)) a.pause();
		});
		return () => {
			a.cancel();
			anims.delete(id);
		};
	};

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
		n = (n + d + PAISATGES.length) % PAISATGES.length;
		const v = novela(++seq, n);
		vistas = calme ? [v] : [...vistas, v];
		precargar(n + d);
	}
	export const seguent = () => anar(1);
	export const precedent = () => anar(-1);

	// ── Points ─────────────────────────────────────────────────────────
	function dobrir(i, el) {
		if (causit === i) {
			causit = null;
			return;
		}
		// l'étiquette va du côté où il y a de la place à l'écran
		const r = el.getBoundingClientRect();
		costat = r.left + r.width / 2 > W * 0.58 ? 'esquerra' : 'drecha';
		causit = i;
	}

	// Au clavier, un point hors de l'écran revient au milieu. Au doigt ou à la
	// souris, jamais : la photo sautait sous le doigt et le toucher tombait à
	// côté (Romain, 06-11, sur téléphone).
	function focus(i, el) {
		if (!el.matches(':focus-visible')) return;
		const g = anims.get(actiuId);
		if (!g) return;
		const { a: anim, c } = g;
		const [, x, y] = pais(n).mots[i];
		const frac = (val, a, b) => (b - a < 1 ? 0 : Math.min(Math.max((val - a) / (b - a), 0), 1));
		const f = c.uB - c.uA >= c.vB - c.vA ? frac(x * c.w - W / 2, c.uA, c.uB) : frac(y * c.h - H / 2, c.vA, c.vB);
		anim.currentTime = f * c.durada;
	}

	// Le glissement s'arrête le temps de lire un mot, et en pause.
	$effect(() => {
		const arrestat = pausa || causit !== null || tocant; // lu d'abord : l'effet en dépend toujours
		const a = anims.get(actiuId)?.a;
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
		} else if (e.key === 'Escape') causit = null;
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
			if (b) dobrir(Number(b.dataset.i), b);
			else causit = null;
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
		return () => {
			ro.disconnect();
			clearTimeout(finAcum);
		};
	});
</script>

{#snippet vista(q, id, rangs)}
	{@const actiu = id === actiuId}
	<!-- les points paraissent après le disque (après l'arrivée de la page pour le premier) -->
	<div class="quadre" style:--d0={id === 0 ? '0.6s' : '1.25s'} {@attach glissar(q, id)}>
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
			{#each q.mots as [oc, x, y], i (oc)}
				<button
					type="button"
					class="ponch"
					class:causit={causit === i}
					style:left="{x * 100}%"
					style:top="{y * 100}%"
					style:--i={rangs[i]}
					data-i={i}
					aria-pressed={causit === i}
					onclick={(e) => dobrir(i, e.currentTarget)}
					onfocus={(e) => focus(i, e.currentTarget)}
				>
					<span class="onda" aria-hidden="true"></span>
					<span class="sr"><span lang="oc">{oc}</span>, <span lang="fr">{MOTS[oc]}</span></span>
				</button>
			{/each}
			{#if causit !== null}
				{@const [oc, x, y] = q.mots[causit]}
				{#key causit}
					<div class="eticeta {costat}" style:left="{x * 100}%" style:top="{y * 100}%" aria-hidden="true">
						<span class="oc" lang="oc">{oc}</span>
						<span class="filet"></span>
						<span class="def" lang="fr">{MOTS[oc]}</span>
					</div>
				{/key}
			{/if}
		{/if}
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
		<div class="vista" aria-hidden={v.id !== actiuId} {@attach dintrar(v.id)}>{@render vista(pais(v.k), v.id, v.rangs)}</div>
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
	}
	.quadre {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 50% 50%;
		will-change: transform;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
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

	/* Réduire les animations : rien ne glisse ni ne respire, le mot paraît */
	.calme .onda {
		display: none;
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
