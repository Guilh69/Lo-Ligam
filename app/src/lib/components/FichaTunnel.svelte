<script>
	import { browser } from '$app/environment';

	// Tunnel infini : les fiches défilent vers le spectateur en profondeur.
	// Même principe que la « infinite gallery » de motion-core (fondu et
	// flou pilotés par la profondeur), en 3D CSS native — leur version
	// réclame Tailwind et la bibliothèque WebGL ogl, absents du projet.
	//
	// La position est écrite DIRECTEMENT dans le style des éléments à
	// chaque image, sans passer par la réactivité de Svelte : recalculer
	// un tableau dérivé 60 fois par seconde saccadait.
	let { items = [], onOpen = () => {} } = $props();

	const GAP = 460; // écart en profondeur entre deux fiches
	// Jusqu'où la fiche continue d'avancer vers le spectateur avant d'être
	// retirée. C'est ce réglage qui décide de la taille maximale atteinte :
	// la perspective agrandit d'un facteur perspective / (perspective + z),
	// donc plus la fiche vient en avant (z négatif), plus elle est grande.
	// À 60, elle disparaissait avant même d'avoir dépassé sa taille normale —
	// d'où l'impression qu'elle ne grossissait pas.
	const NEAR = 500;
	const FAR = 2600; // au-delà, invisible

	let hostEl = $state();
	let cardEls = $state([]);

	let offset = 0; // profondeur courante
	let vitesse = 0; // inertie laissée par la molette
	let hovering = false;

	const span = $derived(Math.max(1, items.length) * GAP);

	function frame(dt) {
		// Dérive lente de fond + inertie de la molette qui s'amortit.
		offset += (18 + vitesse) * dt;
		vitesse *= Math.pow(0.0015, dt); // amortissement continu, stable

		// Sur un thème qui ne contient que deux ou trois fiches, la boucle est
		// courte : on rapproche la limite pour qu'une fiche ne réapparaisse pas
		// au fond avant d'être sortie par l'avant.
		const near = Math.min(NEAR, span * 0.35);

		for (let i = 0; i < cardEls.length; i++) {
			const el = cardEls[i];
			if (!el) continue;
			let z = (((i * GAP - offset) % span) + span) % span;
			// Ramène dans [-near, span-near] pour que les fiches sortent par
			// l'avant plutôt que de réapparaître brutalement.
			if (z > span - near) z -= span;

			if (z < -near || z > FAR) {
				el.style.visibility = 'hidden';
				continue;
			}
			el.style.visibility = 'visible';

			const t = Math.max(0, Math.min(1, z / FAR));
			// Fondu aux deux bouts : entrée depuis le fond, sortie par l'avant.
			// Le fondu de sortie ne commence qu'au tout dernier tiers : la fiche
			// reste donc pleinement lisible pendant qu'elle grandit, et ne
			// s'efface qu'en passant à côté du spectateur.
			const fadeIn = Math.min(1, (1 - t) * 3.2);
			const fadeOut = Math.min(1, (z + near) / (near * 0.72));
			el.style.opacity = String(Math.min(fadeIn, fadeOut).toFixed(3));
			el.style.filter = `blur(${(t * 6).toFixed(2)}px)`;
			el.style.transform = `translate3d(-50%, -50%, ${-z}px)`;
			el.style.zIndex = String(4000 - Math.round(z));
		}
	}

	$effect(() => {
		if (!browser) return;
		const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf;
		let last;
		const tick = (now) => {
			if (last === undefined) last = now;
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			if (!reduit && !(hovering && Math.abs(vitesse) < 1)) frame(dt);
			else frame(0);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function wheel(e) {
		e.preventDefault();
		// Alimente l'inertie au lieu de déplacer sèchement : c'est ce qui
		// donne la sensation de glisse.
		vitesse += e.deltaY * 2.4;
		vitesse = Math.max(-4200, Math.min(4200, vitesse));
	}

	let dragY = 0;
	let dragging = false;
	function down(e) {
		dragging = true;
		dragY = e.clientY;
		hostEl.setPointerCapture?.(e.pointerId);
	}
	function move(e) {
		if (!dragging) return;
		const dy = e.clientY - dragY;
		dragY = e.clientY;
		offset -= dy * 2.5;
		vitesse = -dy * 26;
	}
	function up(e) {
		dragging = false;
		hostEl.releasePointerCapture?.(e.pointerId);
	}
</script>

<div
	class="tunnel"
	bind:this={hostEl}
	onwheel={wheel}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={up}
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
	role="list"
	aria-label="Tunnel"
>
	<div class="scene">
		{#each items as item, i (item.id)}
			<button
				type="button"
				class="card"
				role="listitem"
				bind:this={cardEls[i]}
				onclick={() => onOpen(item)}
				aria-label={item.titre}
			>
				<img src={item.mini} alt="" loading="lazy" draggable="false" />
			</button>
		{/each}
	</div>
</div>

<style>
	.tunnel {
		position: relative;
		/* Le contenu est en position absolue : sans largeur explicite, le
		   conteneur s'effondre à 0 dans un parent centré en colonne. */
		width: 100%;
		height: min(80vh, 44rem);
		overflow: hidden;
		border-radius: 20px;
		/* Un halo d'or au fond du tunnel (couleurs du thème, sombre ou clair) */
		background: radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--t-aur) 16%, transparent), transparent 68%);
		cursor: grab;
		touch-action: none;
	}

	.tunnel:active {
		cursor: grabbing;
	}

	.scene {
		position: absolute;
		inset: 0;
		/* Plus la perspective est courte, plus l'approche est spectaculaire. */
		perspective: 900px;
		perspective-origin: 50% 50%;
		transform-style: preserve-3d;
	}

	.card {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(22rem, 70vw);
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		visibility: hidden;
		/* Pas de transition : la position est réécrite à chaque image, une
		   transition la ferait traîner et saccader. */
		will-change: transform, opacity, filter;
		backface-visibility: hidden;
	}

	.card img {
		width: 100%;
		display: block;
		border-radius: 14px;
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
	}
</style>
