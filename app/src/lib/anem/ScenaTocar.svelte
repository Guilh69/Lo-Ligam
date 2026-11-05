<script>
	// Une scène à toucher d'Anem ! (2026-11-05), adaptée de la mécanique
	// « lumière avec pastilles » de l'essai /ensag/scena (choix de Romain du
	// 2026-10-20) : pour les 3 à 6 ans, la pénombre devient un dessin pas encore
	// colorié (la pénombre grisait le mur et faisait triste). Une pastille dorée
	// montre où toucher ; la chose touchée prend ses couleurs et dit son nom
	// (voix et bulle gérées par la page). Pas d'étiquette sur l'image : les
	// petits ne lisent pas. Données dans scenas.js. Pour recommencer, la page
	// recrée le composant ({#key}).
	// Couches de la même image : le dessin pâle (version -gris), une couche en
	// couleurs par chose touchée (masque au contour exact), toute la scène à la fin.
	let { scena, calme = false, ontocar, oncompleta } = $props();

	let colorats = $state({});
	let viu = $state(null); // la chose qui vient d'être touchée (éclat bref)
	let viuTimer = null;
	let completa = $derived(scena.objectes.every((o) => colorats[o.id]));

	const C = $derived(scena.costat);
	const pct = (v) => `${(v / C) * 100}%`;
	const jòc = (base) => [360, 720, 1080].map((t) => `${base}-${t}.webp ${t}w`).join(', ');
	// la taille affichée (voir .tela) : le navigateur choisit le fichier, le
	// même pour toutes les couches en couleurs
	const sizes = 'min(calc(100vw - 32px), 600px)';

	// le masque d'une couche en couleurs : le contour exact de la chose (forma,
	// chemin SVG dans le repère de l'image), adouci d'un léger flou pour que la
	// couleur s'arrête au trait sans marche d'escalier
	function masca(o) {
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${C} ${C}'><filter id='d'><feGaussianBlur stdDeviation='2'/></filter><path d='${o.forma}' filter='url(#d)'/></svg>`;
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
	}

	function tocar(o) {
		const nòu = !colorats[o.id];
		colorats[o.id] = true;
		clearTimeout(viuTimer);
		viu = null;
		// deux touches de suite sur la même chose : l'éclat repart
		requestAnimationFrame(() => {
			viu = o.id;
			viuTimer = setTimeout(() => (viu = null), 700);
		});
		ontocar?.(o);
		if (nòu && scena.objectes.every((x) => colorats[x.id])) oncompleta?.();
	}

	$effect(() => () => clearTimeout(viuTimer));
</script>

<div class="tela" class:completa class:calme role="group" aria-label={scena.oc} lang="oc">
	<img
		class="jaç"
		src="{scena.gris}-720.webp"
		srcset={jòc(scena.gris)}
		{sizes}
		alt=""
		draggable="false"
	/>
	{#each scena.objectes as o (o.id)}
		<img
			class="jaç color"
			class:vis={colorats[o.id]}
			class:viu={viu === o.id}
			src="{scena.imatge}-720.webp"
			srcset={jòc(scena.imatge)}
			{sizes}
			alt=""
			draggable="false"
			style:mask-image={masca(o)}
			style:-webkit-mask-image={masca(o)}
		/>
	{/each}
	<img
		class="jaç color tota"
		src="{scena.imatge}-720.webp"
		srcset={jòc(scena.imatge)}
		{sizes}
		alt=""
		draggable="false"
	/>

	{#each scena.objectes as o (o.id)}
		{#if !colorats[o.id]}
			{@const p = o.pastilha ?? o.zonas[0]}
			<span class="pastilha" style:left={pct(p[0])} style:top={pct(p[1])} aria-hidden="true"></span>
		{/if}
	{/each}

	{#each scena.objectes as o (o.id)}
		{#each o.zonas as z, k (k)}
			<button
				class="zona"
				type="button"
				style:left={pct(z[0] - z[2])}
				style:top={pct(z[1] - z[3])}
				style:width={pct(z[2] * 2)}
				style:height={pct(z[3] * 2)}
				aria-label={k === 0 ? o.oc : undefined}
				aria-hidden={k === 0 ? undefined : 'true'}
				tabindex={k === 0 ? 0 : -1}
				onclick={() => tocar(o)}
			></button>
		{/each}
	{/each}
</div>

<style>
	.tela {
		position: relative;
		/* au téléphone toute la largeur ; ailleurs, assez petite pour tenir en
		   hauteur avec le titre, la bulle et le coin des adultes */
		width: min(100%, 600px, max(280px, 100dvh - 380px));
		aspect-ratio: 1;
		margin: 4px auto 0;
		border-radius: 28px;
		overflow: hidden;
		background: #b34725; /* le fond du visuel de Romain */
		-webkit-touch-callout: none;
		user-select: none;
		-webkit-user-select: none;
	}
	.jaç {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		pointer-events: none;
	}
	/* du dessin pâle aux couleurs : même dessin, même luminosité, seule la
	   couleur arrive (pas de fondu entre couleurs éloignées) */
	.color {
		opacity: 0;
		transition: opacity 0.6s ease;
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;
	}
	.color.vis,
	.completa .tota {
		opacity: 1;
	}
	.tota {
		transition-duration: 0.9s;
	}
	.color.viu {
		animation: eclat 0.7s ease;
	}
	@keyframes eclat {
		30% {
			filter: brightness(1.15) saturate(1.15);
		}
	}
	.pastilha {
		position: absolute;
		width: 32px;
		height: 32px;
		margin: -16px 0 0 -16px;
		border-radius: 50%;
		background: var(--color-gold-light, #f6c453);
		box-shadow:
			0 0 0 2px #fff,
			0 1px 4px rgba(42, 26, 16, 0.35);
		pointer-events: none;
		animation: pulsar 1.8s ease-in-out infinite;
	}
	@keyframes pulsar {
		50% {
			transform: scale(1.25);
		}
	}
	.zona {
		position: absolute;
		border: 0;
		border-radius: 50%;
		padding: 0;
		background: transparent;
		cursor: pointer;
		touch-action: manipulation;
	}
	.zona:focus-visible {
		outline: 3px solid var(--t-accion);
		outline-offset: -3px;
	}
	/* moins d'animations : les couleurs arrivent d'un coup, rien ne pulse */
	.calme .color {
		transition: none;
	}
	.calme .color.viu,
	.calme .pastilha {
		animation: none;
	}
</style>
