<script>
	// Sans photo au lancement (Romain, 2026-10-25) : l'initiale du pseudo dans
	// un rond, d'une des teintes or et terre du site, toujours la même pour
	// une même personne. Décoratif : le pseudo est écrit à côté.
	let { pseudo = '…', id = '', size = '2.25rem' } = $props();

	// (au moins un tiers d'or : l'initiale sombre reste lisible sur le thème sombre)
	const TENCHAS = [35, 50, 65, 80, 100];
	let tencha = $derived.by(() => {
		let h = 0;
		for (const c of id || pseudo) h = (h * 31 + c.charCodeAt(0)) >>> 0;
		return TENCHAS[h % TENCHAS.length];
	});
	let inicial = $derived((pseudo.trim()[0] ?? '?').toLocaleUpperCase('fr'));
</script>

<span class="avatar" style:--talha={size} style:--tencha="{tencha}%" aria-hidden="true">{inicial}</span>

<style>
	.avatar {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: var(--talha);
		height: var(--talha);
		border-radius: 50%;
		background: color-mix(in srgb, var(--t-aur) var(--tencha), var(--t-terra));
		color: var(--t-fons);
		font: 700 calc(var(--talha) * 0.45) / 1 var(--font-heading);
		user-select: none;
	}
</style>
