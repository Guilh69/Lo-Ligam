<script>
	let { size = 22 } = $props();
</script>

<!-- Silhouette de mas occitan (toit bas et large, volets) plutôt qu'une
     maison générique — remplie légèrement (pas juste un contour fin)
     pour rester bien visible même en petite taille. -->
<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d="M2 10.5 L5.5 7 L18.5 7 L22 10.5" fill="currentColor" fill-opacity="0.22" />
	<rect x="4" y="10.5" width="16" height="9.5" rx="1" fill="currentColor" fill-opacity="0.14" />
	<rect x="15.4" y="4" width="1.6" height="4" fill="currentColor" fill-opacity="0.4" />
	<rect x="6.3" y="13" width="2.6" height="3.4" rx="0.4" />
	<line x1="7.6" y1="13" x2="7.6" y2="16.4" />
	<rect x="15" y="13" width="2.6" height="3.4" rx="0.4" />
	<line x1="16.3" y1="13" x2="16.3" y2="16.4" />
	<rect x="10.6" y="14.3" width="2.8" height="5.7" rx="0.3" fill="currentColor" fill-opacity="0.4" />
</svg>
