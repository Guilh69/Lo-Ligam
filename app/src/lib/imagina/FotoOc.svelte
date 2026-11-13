<script>
	// Une photo dont les textes se lisent en français ou en occitan. La photo de base ne change jamais : chaque
	// texte occitan est une petite retouche transparente (voir fotos-oc.js) posée dessus, en pourcentages, donc à
	// toutes les tailles ; la bascule est un fondu de cette retouche. Sans retouche chargée, la photo reste la
	// photo : rien ne casse. Texte alternatif : il suit la langue choisie et dit ce que la plaque annonce.
	import { tria } from '$lib/stores/lang.svelte.js';

	// lenga : 'fr' (la photo telle que prise) ou 'oc' (le montage) ; haut : hauteur d'écran maximale de la photo
	let { foto, lenga = 'fr', haut = 78, eager = false } = $props();

	// ce qui est écrit sur la photo dans l'état montré (rien, si le mur d'origine est nu)
	const escrich = $derived(
		foto.zones
			.map((z) => z[lenga])
			.filter(Boolean)
			.map((t) => `« ${t} »`)
			.join(', ')
	);
	const alt = $derived(`${tria(foto.alt)} ${escrich}`.trim());
	const larg = $derived(`min(100%, calc(${haut}vh * ${foto.l / foto.h}))`);
</script>

<figure class="fotooc" style:width={larg} style:aspect-ratio="{foto.l} / {foto.h}">
	<img
		class="base"
		src="/imagina/{foto.clau}-base.webp"
		width={foto.l}
		height={foto.h}
		{alt}
		loading={eager ? 'eager' : 'lazy'}
		decoding="async"
	/>
	{#each foto.zones as z (z.patch)}
		<img
			class="retocha"
			class:visible={lenga === 'oc'}
			src="/imagina/{z.patch}"
			alt=""
			aria-hidden="true"
			draggable="false"
			loading="eager"
			decoding="async"
			style:left="{z.x * 100}%"
			style:top="{z.y * 100}%"
			style:width="{z.l * 100}%"
			style:height="{z.h * 100}%"
		/>
	{/each}
</figure>

<style>
	.fotooc {
		position: relative;
		margin: 0;
		overflow: hidden;
		background: var(--t-linha);
	}
	.fotooc img {
		display: block;
		-webkit-user-select: none;
		user-select: none;
	}
	.base {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.retocha {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.55s ease;
	}
	.retocha.visible {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.retocha {
			transition: none;
		}
	}
</style>
