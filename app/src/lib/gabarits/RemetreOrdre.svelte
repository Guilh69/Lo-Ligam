<script>
	// Gabarit « remettre dans l'ordre » : des pièces en désordre dans la réserve,
	// des places creuses au-dessus. Toucher une pièce la pose à la première place
	// libre ; toucher une pièce posée la reprend. Deux allures, une mécanique :
	// des mots pour faire une phrase, ou des lettres pour faire un mot
	// (« letras »). Comme dans le dialogue à trous, une pièce posée est à l'or,
	// puis verte si elle est à sa place, brique sinon.
	import Ecran from './Ecran.svelte';
	import { barrejar } from './barrejar.js';
	import { insecable } from '$lib/lesson/rich.js';

	let { enonciat, responsa, sona = '', indici = '', explic = '', letras = false, avança = 0.4, oncontunhar } = $props();

	const pèças = $derived(barrejar(responsa));
	let pausats = $derived(responsa.map(() => null)); // index de la pièce posée à chaque place
	let verificat = $state(false);

	const usada = (k) => pausats.includes(k);
	const plen = $derived(pausats.length > 0 && pausats.every((k) => k !== null));
	// comparer par la valeur : deux pièces pareilles (deux « a ») sont interchangeables
	const fals = $derived(verificat ? responsa.map((mot, i) => pèças[pausats[i]] !== mot) : []);
	const totJust = $derived(verificat && fals.every((f) => !f));

	function pausar(k) {
		const i = pausats.indexOf(null);
		if (i === -1 || usada(k)) return;
		pausats = pausats.with(i, k);
	}
	function levar(i) {
		if (verificat && !fals[i]) return;
		pausats = pausats.with(i, null);
		verificat = false;
	}
	function tornar() {
		pausats = pausats.map((k, i) => (fals[i] ? null : k));
		verificat = false;
	}

	const retorn = $derived.by(() => {
		if (!verificat) return null;
		if (totJust) return { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: explic || 'Tout est à sa place.' };
		const n = fals.filter(Boolean).length;
		const manca = letras
			? n > 1
				? `${n} lettres ne sont pas à leur place.`
				: 'Une lettre n’est pas à sa place.'
			: n > 1
				? `${n} mots ne sont pas à leur place.`
				: 'Un mot n’est pas à sa place.';
		return { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic: [manca, indici].filter(Boolean).join(' ') };
	});
	const boton = $derived(
		!verificat
			? { oc: 'Verificar', actiu: plen, onclick: () => (verificat = true) }
			: totJust
				? { oc: 'Contunhar', actiu: true, onclick: oncontunhar }
				: { oc: 'Tòrna', actiu: true, onclick: tornar }
	);
	const consigna = $derived(
		letras ? { oc: 'Met las letras dins l’òrdre', fr: 'mets les lettres dans l’ordre' } : { oc: 'Met los mots dins l’òrdre', fr: 'mets les mots dans l’ordre' }
	);
</script>

<Ecran {avança} {consigna} {retorn} {boton} onpassar={totJust ? null : oncontunhar}>
	{#snippet accion()}
		<p class="enonciat">{insecable(enonciat)}</p>
		{#if sona}<p class="sona">{insecable(`« ${sona} »`)}</p>{/if}
		<div class="plaças" class:letras role="group" aria-label={letras ? 'Le mot à former' : 'La phrase à former'}>
			{#each pausats as k, i (i)}
				<button
					type="button"
					class="plaça"
					class:plen={k !== null}
					class:just={verificat && !fals[i]}
					class:fals={verificat && fals[i]}
					disabled={k === null || (verificat && !fals[i])}
					aria-label={k !== null ? `${pèças[k]}, toucher pour retirer` : 'place vide'}
					onclick={() => levar(i)}
					lang="oc">{k !== null ? pèças[k] : ''}</button
				>
			{/each}
		</div>
	{/snippet}
	{#snippet reserva()}
		<div class="pèças" class:letras role="group" aria-label={letras ? 'Les lettres à placer' : 'Les mots à placer'}>
			{#each pèças as p, k (k)}
				<button type="button" class="pc pc-2 pc-chip pèça" class:usada={usada(k)} disabled={usada(k)} onclick={() => pausar(k)} lang="oc">{p}</button>
			{/each}
		</div>
	{/snippet}
</Ecran>

<style>
	.enonciat {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
	}
	.sona {
		margin: 0.35rem 0 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--t-aur);
	}

	/* les places : un creux dans la page, où la pièce vient se poser */
	.plaças {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.3rem;
	}
	.plaça {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 4.2rem;
		height: 2.75rem;
		padding: 0 0.8rem;
		border: 0;
		border-radius: 8px;
		color: var(--t-tinta);
		background: var(--t-fons-2);
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 1.5px var(--t-linha);
		font: 700 1.05rem/1 var(--font-body);
	}
	.plaça.plen {
		color: var(--pc-or-tinta);
		background: var(--pc-or-fons);
		box-shadow: 0 2px 3px var(--pc-ombre);
		cursor: pointer;
		animation: pausa 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.plaça.just {
		color: var(--pc-juste-tinta);
		background: var(--pc-juste);
		animation: none;
		cursor: default;
	}
	.plaça.fals {
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		animation: pc-tremble 0.4s ease-out;
	}
	.plaça:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	@keyframes pausa {
		from {
			transform: translateY(-7px);
			box-shadow: 0 7px 6px var(--pc-ombre);
		}
	}

	/* la réserve : les mêmes pièces que celles du dialogue à trous */
	.pèças {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.55rem;
	}
	.pèça {
		font-size: 1rem;
	}
	/* une pièce posée laisse sa place en creux dans la réserve */
	.pèça.usada:disabled {
		--pc-fons: transparent;
		color: transparent;
		opacity: 1;
		box-shadow: inset 0 0 0 1.5px var(--t-linha);
	}

	/* les lettres : des carrés, places et pièces de la même taille */
	.letras .plaça {
		min-width: 0;
		width: 2.75rem;
		padding: 0;
		font-size: 1.35rem;
	}
	.letras .pèça {
		width: 2.75rem;
		min-height: 2.75rem;
		padding: 0;
		font-size: 1.25rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.plaça.plen,
		.plaça.fals {
			animation: none;
		}
	}
</style>
