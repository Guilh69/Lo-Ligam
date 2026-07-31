<script>
	let { size = 22 } = $props();
</script>

<!-- Groupe de toits/ostals, pour Comunautat — reprend la ligne de toit
     bas et large de HomeIcon, répétée à trois échelles (idée déjà
     notée dans charte-graphique.md §5ter). -->
<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d="M1.5 14.5 L4.5 11.5 L7.5 14.5" />
	<rect x="2.3" y="14.3" width="4.4" height="5.2" rx="0.5" fill="currentColor" fill-opacity="0.14" />
	<path d="M8 16 L12 12 L16 16" />
	<rect x="8.8" y="15.8" width="6.4" height="5.7" rx="0.5" fill="currentColor" fill-opacity="0.18" />
	<path d="M16.5 14.5 L19.5 11.5 L22.5 14.5" />
	<rect
		x="17.3"
		y="14.3"
		width="4.4"
		height="5.2"
		rx="0.5"
		fill="currentColor"
		fill-opacity="0.14"
	/>
</svg>
