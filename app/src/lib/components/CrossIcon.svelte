<script>
	let { size = 22 } = $props();
</script>

<!-- Croix occitana simplifiée, pour A prepaus — reprend l'identité de
     marque (logo) plutôt qu'un pictogramme "info" générique. -->
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
	<path
		d="M12 6.3c-2.1 1.5-3.3 3.5-3.3 5.7c0 2.2 1.2 4.2 3.3 5.7c2.1-1.5 3.3-3.5 3.3-5.7c0-2.2-1.2-4.2-3.3-5.7Z"
		fill="currentColor"
		fill-opacity="0.18"
	/>
	<path
		d="M6.3 12c1.5-2.1 3.5-3.3 5.7-3.3c2.2 0 4.2 1.2 5.7 3.3c-1.5 2.1-3.5 3.3-5.7 3.3c-2.2 0-4.2-1.2-5.7-3.3Z"
		fill="currentColor"
		fill-opacity="0.18"
	/>
	<circle cx="12" cy="4.3" r="1.15" fill="currentColor" fill-opacity="0.5" />
	<circle cx="12" cy="19.7" r="1.15" fill="currentColor" fill-opacity="0.5" />
	<circle cx="4.3" cy="12" r="1.15" fill="currentColor" fill-opacity="0.5" />
	<circle cx="19.7" cy="12" r="1.15" fill="currentColor" fill-opacity="0.5" />
</svg>
