<script>
	// Un geste d'un écran d'écoute : une pièce de papier carrée, le pictogramme
	// au-dessus du mot occitan et de sa traduction. Tous les gestes posés côte à
	// côte passent par ici : même taille, même forme, même pictogramme, même
	// écriture (Romain, 18-11 : « des incohérences de taille et de forme entre
	// deux boutons côte à côte »). La pièce est pétrole ; elle passe à l'or tant
	// que le geste est en cours, et « alen » la fait respirer pendant ce temps.
	import Icona from '#lib/components/Icona.svelte';

	let { icona, label, glosa, actiu = false, alen = false, onclick } = $props();
</script>

<button type="button" class="pc pc-grand gèst" class:pc-2={!actiu} class:pc-or={actiu} class:alen={actiu && alen} aria-pressed={actiu} {onclick}>
	<Icona nom={icona} size="1.9rem" />
	<span class="nom"><span lang="oc">{label}</span> <span class="glosa">({glosa})</span></span>
</button>

<style>
	/* un carré : il prend la colonne qui lui est donnée, 5,75 rem au plus */
	.gèst {
		flex: none;
		flex-direction: column;
		gap: 0.3rem;
		width: 100%;
		max-width: 5.75rem;
		aspect-ratio: 1;
		padding: 0;
	}
	.nom {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		line-height: 1.15;
	}
	.glosa {
		font-style: italic;
		font-weight: 400;
		font-size: 0.85em;
	}
	.alen {
		animation: alen 1.4s ease-in-out infinite;
	}
	@keyframes alen {
		50% {
			transform: translateY(-2px) scale(1.04);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.alen {
			animation: none;
		}
	}
</style>
