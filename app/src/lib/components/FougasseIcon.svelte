<script>
	let { size = 22 } = $props();
</script>

<!-- Fogassa d'Aiga Mortas stylisée : pâte dorée + fentes en losange,
     à la place des étoiles pour les points gagnés. Contour brique pour
     rester visible même sur un fond doré/crème. -->
<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style="flex-shrink: 0;">
	<g transform="rotate(-14 12 12)">
		<rect
			x="1.8"
			y="7"
			width="20.4"
			height="10"
			rx="4.6"
			fill="var(--color-gold)"
			stroke="var(--color-brick)"
			stroke-width="1"
		/>
		<ellipse cx="7.2" cy="10.2" rx="1.15" ry="2.1" fill="var(--color-cream)" />
		<ellipse cx="10.8" cy="13.6" rx="1.15" ry="2.1" fill="var(--color-cream)" />
		<ellipse cx="14.4" cy="10.2" rx="1.15" ry="2.1" fill="var(--color-cream)" />
		<ellipse cx="18" cy="13.6" rx="1.15" ry="2.1" fill="var(--color-cream)" />
		<circle cx="4.6" cy="15" r="0.55" fill="var(--color-olive)" opacity="0.75" />
		<circle cx="12.6" cy="8.6" r="0.55" fill="var(--color-olive)" opacity="0.75" />
		<circle cx="19.6" cy="9.2" r="0.55" fill="var(--color-olive)" opacity="0.75" />
	</g>
</svg>
