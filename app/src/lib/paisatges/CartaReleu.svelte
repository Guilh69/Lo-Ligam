<script>
	// Une photo et son relief, dans une carte de Triar (lot « releu », 06-11) :
	// elle glisse d'un bout à l'autre comme dans Remira › Paisatges, à la même
	// vitesse et avec le même relief, pour juger ce que verra le visiteur.
	// « En grand » la montre sur tout l'écran. La carte de derrière (viu = false)
	// reste une photo fixe.
	import { camin, srcset } from './paisatges.js';
	import { relevar } from './releu.js';

	let { foto, viu = true } = $props();

	let boita = $state();
	let W = $state(0),
		H = $state(0);
	let gran = $state(false);
	let calme = $state(false);
	let anim = null; // { a, w, h, t0, t1, s1, W, H }

	$effect(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const ro = new ResizeObserver(() => {
			W = boita.clientWidth;
			H = boita.clientHeight;
		});
		ro.observe(boita);
		return () => ro.disconnect();
	});

	// la photo couvre la boîte et glisse d'un bout à l'autre (14 px par seconde,
	// 28 s au moins, comme dans Paisatges), un peu plus près à l'arrivée
	const glissar = (el) => {
		if (!W || !H || !viu || calme) return;
		const s = Math.max(W / foto.l, H / foto.h);
		const w = foto.l * s,
			h = foto.h * s;
		const du = w - W,
			dv = h - H;
		el.style.width = `${w}px`;
		el.style.height = `${h}px`;
		const a = el.animate(
			[{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${-du}px, ${-dv}px) scale(1.04)` }],
			{ duration: Math.max(28000, (Math.hypot(du, dv) / 14) * 1000), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }
		);
		anim = { a, w, h, t0: [0, 0], t1: [-du, -dv], s1: 1.04, W, H };
		return () => {
			a.cancel();
			anim = null;
		};
	};

	// le canevas, fixe sous le cadre, calcule lui-même le glissement (./releu.js)
	const relevarFoto = (cv) => relevar(cv, { clau: foto.clau, img: cv.nextElementSibling.querySelector('img'), estat: () => anim });

	// En grand : la boîte passe au bout de la page le temps de regarder (la carte
	// qui la contient bouge et tourne : dedans, « fixed » ne couvrirait pas l'écran)
	const portal = (n) => {
		if (!gran) return;
		const pair = n.parentNode,
			seguent = n.nextSibling;
		document.body.appendChild(n);
		return () => {
			try {
				pair.insertBefore(n, seguent);
			} catch {
				n.remove();
			}
		};
	};

	function bascular(e) {
		e.stopPropagation();
		gran = !gran;
	}
	const tecla = (e) => {
		if (gran && e.key === 'Escape') gran = false;
	};
</script>

<svelte:window onkeydown={tecla} />

<!-- en grand, les gestes de la carte (glisser pour trier) ne passent pas -->
<div class="releu" class:gran bind:this={boita} onpointerdown={(e) => gran && e.stopPropagation()} role="presentation" {@attach portal}>
	{#if viu && !calme}
		<canvas aria-hidden="true" {@attach relevarFoto}></canvas>
		<div class="quadre" {@attach glissar}>
			<img src={camin(foto.clau, foto.amples[0])} srcset={srcset(foto)} sizes="100vw" alt="" draggable="false" />
		</div>
	{:else}
		<img class="fixa" src={camin(foto.clau, foto.amples[0])} alt="" draggable="false" />
	{/if}
	{#if viu}
		<button type="button" class="b-gran" onpointerdown={(e) => e.stopPropagation()} onclick={bascular}>
			{gran ? 'Fermer' : 'En grand'}
		</button>
	{/if}
</div>

<style>
	.releu {
		position: relative;
		width: 100%;
		aspect-ratio: 3 / 4;
		max-height: 52vh;
		overflow: hidden;
		border-radius: 0.75rem;
		background: #0b1517;
	}
	.releu.gran {
		position: fixed;
		inset: 0;
		z-index: 50;
		max-height: none;
		aspect-ratio: auto;
		border-radius: 0;
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
	/* la marge du relief (1 / 0,98, ./releu.js) */
	.quadre img {
		scale: 1.0204;
	}
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0; /* jusqu'au premier dessin, sous la photo */
		pointer-events: none;
	}
	.b-gran {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		padding: 0.45rem 0.8rem;
		border: 1px solid rgba(243, 234, 214, 0.55);
		border-radius: 999px;
		background: rgba(11, 21, 23, 0.6);
		color: #f3ead6;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.b-gran:focus-visible {
		outline: 2px solid #ffd47f;
		outline-offset: 2px;
	}
</style>
