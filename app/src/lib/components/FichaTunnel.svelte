<script>
	import { browser } from '$app/environment';

	// Tunnel infini : les fiches défilent vers le spectateur en profondeur.
	// Même principe que la « infinite gallery » de motion-core (fondu et
	// flou pilotés par la profondeur), mais en 3D CSS native — la version
	// d'origine réclame Tailwind et la bibliothèque WebGL ogl, deux
	// éléments absents du projet.
	let { items = [], onOpen = () => {} } = $props();

	const GAP = 420; // écart en profondeur entre deux fiches
	const DEPTH = 8; // nombre de fiches visibles dans le tunnel

	let offset = $state(0);
	let hovering = $state(false);
	let sceneEl = $state();

	const total = $derived(items.length * GAP);

	// Position de chaque fiche, ramenée dans l'intervalle visible : quand
	// une fiche sort par l'avant, elle repart du fond. D'où « infini ».
	let placed = $derived(
		items.map((item, i) => {
			const raw = i * GAP - offset;
			const z = total > 0 ? ((raw % total) + total) % total : 0;
			// 0 = tout près, 1 = tout au fond
			const t = z / (DEPTH * GAP);
			return { item, z, t, visible: t <= 1 };
		})
	);

	function wheel(e) {
		// N'intercepte la molette que si le tunnel est survolé, sinon on
		// bloquerait le défilement normal de la page.
		if (!hovering) return;
		e.preventDefault();
		offset += e.deltaY * 0.6;
	}

	// Dérive lente automatique : le tunnel vit même sans interaction.
	$effect(() => {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf;
		let last;
		const tick = (now) => {
			if (last === undefined) last = now;
			const dt = Math.min((now - last) / 1000, 0.1);
			last = now;
			if (!hovering) offset += dt * 22;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<div
	class="tunnel"
	bind:this={sceneEl}
	onwheel={wheel}
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
	role="list"
	aria-label="Tunnel"
>
	<div class="scene">
		{#each placed as p (p.item.id)}
			{#if p.visible}
				<button
					type="button"
					class="card"
					role="listitem"
					style="
						transform: translate(-50%, -50%) translateZ({-p.z}px);
						opacity: {Math.min(1, (1 - p.t) * 2.2)};
						filter: blur({(p.t * 7).toFixed(2)}px);
						z-index: {1000 - Math.round(p.z)};
					"
					onclick={() => onOpen(p.item)}
					aria-label={p.item.titre}
				>
					<img src={p.item.mini} alt="" loading="lazy" draggable="false" />
				</button>
			{/if}
		{/each}
	</div>

	<p class="hint">↕</p>
</div>

<style>
	.tunnel {
		position: relative;
		/* Indispensable : le contenu est en position absolue, donc le
		   conteneur n'a aucune largeur propre. Dans un parent centré en
		   colonne il s'effondrait à 0 et overflow:hidden masquait tout. */
		width: 100%;
		height: min(70vh, 34rem);
		overflow: hidden;
		border-radius: 20px;
		background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5), transparent 70%);
		touch-action: pan-y;
	}

	.scene {
		position: absolute;
		inset: 0;
		perspective: 900px;
		transform-style: preserve-3d;
	}

	.card {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(17rem, 60vw);
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		will-change: transform, opacity, filter;
	}

	.card img {
		width: 100%;
		display: block;
		border-radius: 14px;
		box-shadow: 0 18px 40px rgba(58, 42, 32, 0.3);
	}

	.hint {
		position: absolute;
		right: 1rem;
		bottom: 0.75rem;
		margin: 0;
		font-size: 1.1rem;
		opacity: 0.35;
		pointer-events: none;
	}
</style>
