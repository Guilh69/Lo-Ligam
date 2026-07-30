<script>
	let { size = 18 } = $props();
</script>

<!-- Fogassa d'Aiga Mortas stylisée : pâte dorée + fentes en losange,
     à la place des étoiles pour les points gagnés. -->
<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style="flex-shrink: 0;">
	<g transform="rotate(-14 12 12)">
		<rect x="2.5" y="7.5" width="19" height="9" rx="4.2" fill="var(--color-gold)" />
		<ellipse cx="7.2" cy="10.4" rx="1.05" ry="1.9" fill="var(--color-cream)" />
		<ellipse cx="10.6" cy="13.3" rx="1.05" ry="1.9" fill="var(--color-cream)" />
		<ellipse cx="14" cy="10.4" rx="1.05" ry="1.9" fill="var(--color-cream)" />
		<ellipse cx="17.4" cy="13.3" rx="1.05" ry="1.9" fill="var(--color-cream)" />
		<circle cx="5" cy="14.5" r="0.4" fill="var(--color-olive)" opacity="0.6" />
		<circle cx="12.5" cy="9" r="0.4" fill="var(--color-olive)" opacity="0.6" />
		<circle cx="19" cy="9.5" r="0.4" fill="var(--color-olive)" opacity="0.6" />
	</g>
</svg>
