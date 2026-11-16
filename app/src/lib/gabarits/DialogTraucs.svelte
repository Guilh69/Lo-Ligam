<script>
	// Gabarit « dialogue à trous » : toucher un mot le pose dans le premier trou
	// libre ; toucher un trou rempli rend le mot (au clavier comme au doigt, sans
	// glisser-déposer obligatoire). « Verificar » quand tout est rempli : chaque
	// erreur reçoit son explication (principe 8), puis on retente les trous faux.
	import Ecran from './Ecran.svelte';
	import Bulla from './Bulla.svelte';
	import BotonSon from './BotonSon.svelte';

	let { replicas, tèulas, explics, personatges, son, avança = 0.6, oncontunhar } = $props();

	// les trous, dans l'ordre de lecture : [{ r, p, mot }]
	const traucs = $derived(replicas.flatMap((rep, r) => rep.parts.flatMap((part, p) => (typeof part === 'object' ? [{ r, p, mot: part.trauc }] : []))));
	// pour chaque trou : index de la tuile posée, ou null (dérivée réassignable :
	// repart de zéro si les répliques changent)
	let pausats = $derived(traucs.map(() => null));
	let verificat = $state(false);

	const indexTrauc = (r, p) => traucs.findIndex((t) => t.r === r && t.p === p);
	const usada = (k) => pausats.includes(k);
	const plen = $derived(pausats.length > 0 && pausats.every((k) => k !== null));
	const fals = $derived(verificat ? traucs.map((t, i) => tèulas[pausats[i]] !== t.mot) : []);
	const totJust = $derived(verificat && fals.every((f) => !f));

	function pausar(k) {
		if (verificat || usada(k)) return;
		const i = pausats.indexOf(null);
		if (i >= 0) pausats = pausats.with(i, k);
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
		if (totJust) return { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: 'Les quatre mots sont à leur place.' };
		const errors = traucs.filter((_, i) => fals[i]).map((t) => explics[t.mot]);
		return { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic: errors.join(' ') };
	});
	const boton = $derived(
		!verificat
			? { oc: 'Verificar', actiu: plen, onclick: () => (verificat = true) }
			: totJust
				? { oc: 'Contunhar', actiu: true, onclick: oncontunhar }
				: { oc: 'Tòrna', actiu: true, onclick: tornar }
	);
</script>

<Ecran {avança} consigna={{ oc: 'Escota, puèi pausa los mots', fr: 'écoute, puis place les mots' }} {retorn} {boton} onpassar={oncontunhar}>
	{#snippet media()}
		<div class="haut">
			<BotonSon src={son} />
			<div class="tèulas" aria-label="Les mots à placer">
				{#each tèulas as t, k (k)}
					<button type="button" class="tèula" disabled={usada(k) || verificat} onclick={() => pausar(k)} lang="oc">{t}</button>
				{/each}
			</div>
		</div>
	{/snippet}
	{#snippet accion()}
		{#each replicas as rep, r (r)}
			<Bulla personatge={personatges[rep.qui]}>
				{#each rep.parts as part, p (p)}
					{#if typeof part === 'object'}
						{@const i = indexTrauc(r, p)}
						{@const k = pausats[i]}
						<button
							type="button"
							class="trauc"
							class:plen={k != null}
							class:fals={verificat && fals[i]}
							class:just={verificat && !fals[i]}
							aria-label={k != null ? `${tèulas[k]}, toucher pour retirer` : 'trou vide'}
							onclick={() => levar(i)}>{k != null ? tèulas[k] : ''}</button
						>
					{:else}{part}{/if}
				{/each}
			</Bulla>
		{/each}
	{/snippet}
</Ecran>

<style>
	.haut {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.tèulas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.tèula {
		min-height: 2.6rem;
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--t-accion);
		border-radius: 3px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
	}
	.tèula:disabled {
		border-style: dashed;
		border-color: var(--t-linha);
		color: transparent;
		cursor: default;
	}
	.trauc {
		display: inline-block;
		min-width: 4.2rem;
		min-height: 1.7rem;
		margin: 0 0.1rem;
		padding: 0 0.35rem;
		border: 0;
		border-bottom: 2px solid var(--t-tinta-2);
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		vertical-align: baseline;
		cursor: pointer;
	}
	.trauc.plen {
		border-bottom-color: var(--t-accion);
	}
	.trauc.just {
		border-bottom-color: var(--t-aur);
		cursor: default;
	}
	.trauc.fals {
		border-bottom-style: dashed;
		text-decoration: line-through;
		text-decoration-color: var(--t-tinta-2);
	}
	.tèula:focus-visible,
	.trauc:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
