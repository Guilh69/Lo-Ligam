<script>
	let { size = 22 } = $props();
</script>

<!-- Livre ouvert, pour Aprene — même langage graphique que HomeIcon
     (silhouette pleine, traits épais). -->
<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path
		d="M3 5.5c2.5-1 5.3-1 9 .5V19c-3.7-1.5-6.5-1.5-9-.5V5.5Z"
		fill="currentColor"
		fill-opacity="0.16"
	/>
	<path
		d="M21 5.5c-2.5-1-5.3-1-9 .5V19c3.7-1.5 6.5-1.5 9-.5V5.5Z"
		fill="currentColor"
		fill-opacity="0.16"
	/>
</svg>
