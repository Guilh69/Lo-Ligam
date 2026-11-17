<script>
	// Gabarit « dialogue à trous » : on écoute, puis on pose les mots dans les
	// bulles, d'un toucher (le mot va dans le premier trou libre ; toucher un mot
	// posé le retire). « Verificar » montre ce qui est juste et explique chaque
	// erreur (principe 8) ; on peut recommencer, ou passer (principe 4).
	// Les mots sont des pièces de papier : pétrole dans la réserve, or une fois
	// posées, vertes ou brique après « Verificar ». Les trous sont creusés dans
	// la bulle, comme le rail de l'interrupteur du site. La réserve est au pied
	// de l'écran, près du pouce ; le retour la remplace après « Verificar ».
	import Ecran from './Ecran.svelte';
	import Bulla from './Bulla.svelte';
	import BotonSon from './BotonSon.svelte';
	import { insecable } from '$lib/lesson/rich.js';

	let { replicas, tèulas, explics, personatges, son, avança = 0.6, oncontunhar } = $props();

	// les trous, dans l'ordre du dialogue
	const traucs = $derived(replicas.flatMap((rep, r) => rep.parts.flatMap((part, p) => (typeof part === 'object' ? [{ r, p, mot: part.trauc }] : []))));
	let pausats = $derived(traucs.map(() => null)); // index de la tuile posée dans chaque trou
	let verificat = $state(false);

	const indexTrauc = (r, p) => traucs.findIndex((t) => t.r === r && t.p === p);
	// le nom s'écrit à la première réplique de chacun
	const primièra = (r) => replicas.findIndex((x) => x.qui === replicas[r].qui) === r;
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
		<BotonSon src={son} gran />
	{/snippet}
	{#snippet reserva()}
		<div class="tèulas" role="group" aria-label="Les mots à placer">
			{#each tèulas as t, k (k)}
				<button type="button" class="pc pc-2 pc-chip tèula" class:usada={usada(k)} disabled={usada(k)} onclick={() => pausar(k)} lang="oc">{t}</button>
			{/each}
		</div>
	{/snippet}
	{#snippet accion()}
		{#each replicas as rep, r (r)}
			<Bulla personatge={personatges[rep.qui]} ambNom={primièra(r)}>
				<span class="linha">
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
						{:else}{insecable(part)}{/if}
					{/each}
				</span>
			</Bulla>
		{/each}
	{/snippet}
</Ecran>

<style>
	.tèulas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.55rem;
	}
	.tèula {
		font-size: 1rem;
	}
	/* le mot posé laisse sa place vide dans la réserve */
	.tèula.usada:disabled {
		--pc-fons: transparent;
		color: transparent;
		opacity: 1;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 28%, transparent);
	}

	/* les trous tiennent dans le fil du texte : une ligne plus haute */
	.linha {
		display: block;
		line-height: 2.25;
	}
	.trauc {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 4.2rem;
		height: 2rem;
		margin: 0 0.15rem;
		padding: 0 0.7rem;
		border: 0;
		border-radius: 8px;
		vertical-align: middle;
		color: inherit;
		background: color-mix(in srgb, currentColor 14%, transparent);
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 1.5px color-mix(in srgb, currentColor 26%, transparent);
		font: inherit;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.trauc.plen {
		color: var(--pc-or-tinta);
		background: var(--pc-or-fons);
		box-shadow: 0 2px 3px var(--pc-ombre);
		animation: pausa 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
	}
	.trauc.just {
		color: var(--pc-juste-tinta);
		background: var(--pc-juste);
		animation: none;
		cursor: default;
	}
	.trauc.fals {
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		animation: pc-tremble 0.4s ease-out;
	}
	.trauc:focus-visible {
		outline: 3px solid var(--t-aur-clar, #ffd98a);
		outline-offset: 2px;
	}
	@keyframes pausa {
		from {
			transform: translateY(-7px);
			box-shadow: 0 7px 6px var(--pc-ombre);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.trauc,
		.trauc.plen,
		.trauc.fals {
			transition: none;
			animation: none;
		}
	}
</style>
