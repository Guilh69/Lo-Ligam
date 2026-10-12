<script>
	let { size = 22 } = $props();
</script>

<!-- Silhouette de l'Occitanie linguistique, extraite par analyse de pixels
     (composante connexe + enveloppe par ligne, simplifiée par
     Ramer-Douglas-Peucker) de la carte de référence fournie dans
     design-stock/icones/ ("Occitan_language_map_1900_(Europe_only).svg.webp"), pas
     dessinée à main levée — pour rester fidèle au contour réel même
     simplifié pour une petite taille d'icône. -->
<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="currentColor"
	stroke="currentColor"
	stroke-width="0.6"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path
		d="M10,5.5 L7.7,5.9 L6.22,6.94 L5.32,7.88 L5.81,8.2 L5.63,8.74 L2.44,8.78 L2.13,11.26 L2.58,11.66 L2.04,11.93 L1.09,15.44 L2.26,15.49 L3.3,16.3 L2.94,16.84 L3.34,17.69 L8.92,18.5 L11.08,18.14 L11.93,17.56 L11.71,16.84 L19.89,16.57 L22.91,13.33 L21.15,12.83 L20.79,11.98 L21.11,10.9 L20.21,10.09 L16.48,9.95 L14.63,9.28 L13.55,8.29 L13.55,6.71 L10.76,5.5 Z"
		fill-opacity="0.75"
	/>
</svg>
