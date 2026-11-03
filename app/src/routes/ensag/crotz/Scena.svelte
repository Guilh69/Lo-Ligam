<script>
	// La scène du chemin de S'apren (MiegTres.svelte : même tracé, mêmes quatre ronds). Trois
	// tailles de ronds : ceux d'aujourd'hui (PETITS) ; de grands ronds sans croix (grans, pour la
	// variante B, où une seule croix voyage) ; de grands ronds avec leur croix (ronds). Les grands
	// ronds font au moins 40 px sur un téléphone (relecture de Joan, 2026-11-03).
	// `viatge` : la croix qui se déplace sur le tracé (variante B).
	import CrotzCarga from '$lib/acuelh/CrotzCarga.svelte';

	let { lits = [0, 0, 0, 0], plenas = [false, false, false, false], ronds = true, grans = false, viatge = null } = $props();

	const VIA = 'M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20';
	const GRANS = [
		{ x: 22, y: 120, r: 15 },
		{ x: 108, y: 84, r: 15 },
		{ x: 178, y: 44, r: 15 },
		{ x: 238, y: 20, r: 16 }
	];
	// les ronds d'aujourd'hui
	const PETITS = [
		{ x: 22, y: 120, r: 6 },
		{ x: 108, y: 84, r: 5 },
		{ x: 178, y: 44, r: 5 },
		{ x: 238, y: 20, r: 6.5 }
	];
	let nods = $derived(ronds || grans ? GRANS : PETITS);
</script>

<svg class="scena" viewBox="0 0 260 140" aria-hidden="true">
	<path class="via" d={VIA} fill="none" stroke-width="2.6" stroke-linecap="round" />
	{#each nods as n, i (i)}
		<circle class="nod" class:fin={plenas[i]} cx={n.x} cy={n.y} r={n.r} />
		{#if ronds}
			<CrotzCarga cx={n.x} cy={n.y} r={n.r - 2.4} acesa={lits[i]} plena={plenas[i]} />
		{/if}
	{/each}
	{#if viatge}
		<circle class="nod" class:fin={viatge.plena} cx={viatge.x} cy={viatge.y} r="15.5" />
		<CrotzCarga cx={viatge.x} cy={viatge.y} r="13" acesa={viatge.acesa} plena={viatge.plena} />
	{/if}
</svg>

<style>
	/* fond sombre : traits blancs, points or clair, moyeu or ; la croix pleine, rouge sur or */
	.scena {
		--nod-fons: #123;
		--nod-traç: #ffd98a;
		--fin-fons: #ffd47f;
		--cc-traç: #ffffff;
		--cc-ponch: #ffd47f;
		--cc-moieu: #eeaf34;
		--cc-plena: #b53d17;
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	/* fond clair : ocre et rouge (app.css) ; la croix pleine, rouge sur or */
	:global(.banc.clar) .scena {
		--nod-fons: #fbf1e1;
		--nod-traç: #8f5400;
		--fin-fons: #eeaf34;
		--fin-traç: #b53d17;
		--cc-traç: #b53d17;
		--cc-ponch: #eeaf34;
		--cc-moieu: #b53d17;
		--cc-plena: #b53d17;
	}
	.via {
		stroke: var(--nod-traç);
		stroke-opacity: 0.85;
	}
	.nod {
		fill: var(--nod-fons);
		stroke: var(--nod-traç);
		stroke-width: 2.4;
		transition:
			fill 0.5s,
			stroke 0.5s;
	}
	.nod.fin {
		fill: var(--fin-fons);
		stroke: var(--fin-traç, var(--nod-traç));
	}
</style>
