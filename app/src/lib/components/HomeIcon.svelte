<script>
	import iconeMas from '$lib/assets/icone-mas.webp';

	let { size = 22 } = $props();
</script>

<!-- Illustration de mas occitan fournie par Romain (design-stock/icones/
     Icone_mas.png) : détourée sur son cercle et réduite en WebP 128 px (4 ko).
     L'image porte DÉJÀ son propre fond rond terracotta — le bouton qui
     l'accueille ne doit donc pas en remettre un derrière. -->
<img class="icone-mas" src={iconeMas} width={size} height={size} alt="" />

<style>
	.icone-mas {
		display: block;
		/* Le parent (.home-link) fixe la taille en rem : l'image le remplit,
		   pour rester alignée si le visiteur agrandit la police. */
		width: 100%;
		height: 100%;
		border-radius: 999px;
	}
</style>
