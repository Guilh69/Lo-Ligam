<script>
	// Photos de Romain dans une leçon : une seule (pleine largeur, son propre
	// cadrage) ou une rangée de deux à quatre (4:5). La légende donne le mot
	// en occitan, puis le français. Bloc passif : rien à répondre.
	// Données : imatges = [{ clau, amples: [400, 800], l, h, oc, fr, alt }]
	// (fichiers static/aprene/fotos/<clau>-<ample>.webp, l × h = le plus petit).
	let { block } = $props();

	let imatges = $derived(block.imatges ?? []);
	let seula = $derived(imatges.length === 1);
	// Largeur d'affichage, pour que le navigateur choisisse le bon fichier.
	let sizes = $derived(seula ? '(min-width: 48rem) 44rem, 100vw' : '(min-width: 48rem) 15rem, 72vw');

	const camin = (clau, a) => `/aprene/fotos/${clau}-${a}.webp`;

	// La rangée ne prend le focus clavier que si elle défile vraiment
	// (écran étroit) ; côte à côte, rien à faire défiler, pas d'arrêt.
	let rengla = $state();
	let defila = $state(false);
	$effect(() => {
		if (!rengla || seula) return;
		const mesurar = () => (defila = rengla.scrollWidth > rengla.clientWidth + 1);
		mesurar();
		const ro = new ResizeObserver(mesurar);
		ro.observe(rengla);
		return () => ro.disconnect();
	});
</script>

<section class="fotos" class:seula>
	{#if block.title}<h3 class="titol">{block.title}</h3>{/if}
	<!-- Plusieurs photos sur un écran étroit : la rangée défile au doigt,
	     et au clavier (tabindex quand elle défile : une zone qui défile doit
	     pouvoir prendre le focus, RGAA 7.3). La première photo est visible à
	     l'ouverture de l'étape : chargée tout de suite, les autres à la demande. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="rengla n{imatges.length}"
		bind:this={rengla}
		tabindex={defila ? 0 : undefined}
		role={seula ? undefined : 'group'}
		aria-label={seula ? undefined : 'Fòtos'}
	>
		{#each imatges as im, i (im.clau)}
			<figure>
				<img
					src={camin(im.clau, im.amples[0])}
					srcset={im.amples.map((a) => `${camin(im.clau, a)} ${a}w`).join(', ')}
					{sizes}
					width={im.l}
					height={im.h}
					alt={im.alt}
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
				<figcaption>
					<span class="oc" lang="oc">{im.oc}</span>
					{#if im.fr}<span class="fr">{im.fr}</span>{/if}
				</figcaption>
			</figure>
		{/each}
	</div>
</section>

<style>
	.fotos {
		container-type: inline-size;
	}

	.titol {
		margin: 0 0 0.6rem;
		font-size: 1.05rem;
		color: var(--l-marca);
	}

	.rengla {
		display: flex;
		gap: 0.8rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: thin;
		/* La rangée qui défile va jusqu'aux bords de l'écran (la marge de la
		   page) ; le bas laisse passer l'ombre des photos. */
		padding: 0.2rem var(--marge, 0.2rem) 0.6rem;
		margin: -0.2rem calc(-1 * var(--marge, 0.2rem)) -0.6rem;
		scroll-padding-inline: var(--marge, 0.2rem);
	}

	.seula .rengla {
		overflow: visible;
		padding: 0;
		margin: 0;
	}

	.rengla:focus-visible {
		outline: 2px solid var(--l-marca);
		outline-offset: 2px;
		border-radius: 22px;
	}

	figure {
		flex: 0 0 72%;
		margin: 0;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.seula figure {
		flex-basis: 100%;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 22px;
		object-fit: cover;
		/* place réservée, couleur de carte, le temps que la photo arrive */
		background: var(--l-carta);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	figcaption {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
		padding: 0 0.3rem;
	}

	.oc {
		font-weight: 700;
		font-size: 1rem;
		color: var(--t-tinta);
	}

	.fr {
		font-size: 0.86rem;
		line-height: 1.4;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
	}

	/* Assez de place : toutes les photos côte à côte, sans défilement. */
	@container (min-width: 20rem) {
		.n2 {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			overflow: visible;
			padding: 0;
			margin: 0;
		}
	}

	@container (min-width: 30rem) {
		.n3 {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			overflow: visible;
			padding: 0;
			margin: 0;
		}
	}

	@container (min-width: 38rem) {
		.n4 {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			overflow: visible;
			padding: 0;
			margin: 0;
		}
	}
</style>
