<script>
	// L'icône de chaque jeu dans la salle (06-11), comme l'icône d'une
	// application : un trait fin, la couleur du texte, une touche d'or.
	// Lettres latines seulement (pas d'autre écriture pour figurer la langue).
	let { id } = $props();
</script>

<svg class="emblema" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
	<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
		{#if id === 'serp'}
			<!-- trois tuiles de lettres qui font une queue, et la tête -->
			<rect x="4" y="22" width="9" height="9" rx="1.5" />
			<rect x="14" y="22" width="9" height="9" rx="1.5" />
			<rect x="24" y="14" width="9" height="9" rx="1.5" />
			<circle cx="33" cy="9" r="3.4" fill="var(--emb-aur)" stroke="none" />
			<text x="8.5" y="29.4" class="l">o</text>
			<text x="18.5" y="29.4" class="l">c</text>
		{:else if id === 'paniers'}
			<!-- une tuile qui tombe dans un panier tressé -->
			<rect x="15" y="4" width="10" height="8" rx="1.5" fill="var(--emb-aur)" stroke="none" />
			<path d="M7 19 H33 L30 34 H10 Z" />
			<path d="M8.5 25 H31.5 M9.7 30 H30.3 M16 19 L15 34 M24 19 L25 34" stroke-width="1" />
		{:else if id === 'paisatges'}
			<!-- une photo de paysage, un point d'or et sa case en tirets (Pausa los mots) -->
			<rect x="5" y="8" width="30" height="24" rx="1.5" />
			<path d="M5 27 L14 18 L20 24 L25 19 L35 28" />
			<circle cx="27" cy="13" r="2.4" fill="var(--emb-aur)" stroke="none" />
			<rect x="9" y="11" width="12" height="5" rx="0.6" stroke-width="1" stroke-dasharray="1.8 1.2" />
			<path d="M21 13.5 H24.4" stroke-width="0.8" />
		{:else if id === 'mots-crosats'}
			<!-- une grille, trois cases noires -->
			<rect x="6" y="6" width="28" height="28" rx="1" />
			<path d="M13 6 V34 M20 6 V34 M27 6 V34 M6 13 H34 M6 20 H34 M6 27 H34" stroke-width="1" />
			<path d="M13 6 H20 V13 H13 Z M27 20 H34 V27 H27 Z M6 27 H13 V34 H6 Z" fill="currentColor" stroke="none" />
		{:else if id === 'mots-mesclats'}
			<!-- des lettres en grille, un mot entouré -->
			<g fill="currentColor" stroke="none">
				{#each [8, 16, 24, 32] as x (x)}
					{#each [9, 17, 25, 33] as y (y)}
						<circle cx={x} cy={y} r="1.3" />
					{/each}
				{/each}
			</g>
			<rect x="4" y="13" width="32" height="8" rx="4" stroke="var(--emb-aur)" stroke-width="2" />
		{:else if id === 'parelhs'}
			<!-- deux cartes, l'une retournée -->
			<rect x="5" y="9" width="16" height="22" rx="2" />
			<rect x="19" y="7" width="16" height="22" rx="2" fill="var(--emb-aur)" stroke="none" transform="rotate(8 27 18)" />
		{:else if id === 'escota-causis'}
			<!-- un haut-parleur, deux ondes -->
			<path d="M7 16 H13 L20 10 V30 L13 24 H7 Z" />
			<path d="M25 15 Q28 20 25 25" />
			<path d="M29 11 Q35 20 29 29" stroke="var(--emb-aur)" />
		{/if}
	</g>
</svg>

<style>
	.emblema {
		display: block;
		width: 100%;
		height: 100%;
		--emb-aur: var(--t-aur);
	}
	.l {
		font: 600 7.2px var(--font-body);
		fill: currentColor;
		stroke: none;
		text-anchor: middle;
	}
</style>
