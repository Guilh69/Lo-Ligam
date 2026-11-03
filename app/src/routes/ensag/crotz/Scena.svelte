<script>
	// La scène du chemin de S'apren (MiegTres.svelte : même tracé, mêmes quatre ronds), avec des
	// ronds assez grands pour porter la croix du logo (ronds=true), ou aux tailles d'aujourd'hui
	// (ronds=false). `viatge` : une croix qui se déplace sur le tracé (variante B).
	import CrotzCarga from '$lib/acuelh/CrotzCarga.svelte';

	let { lits = [0, 0, 0, 0], plenas = [false, false, false, false], ronds = true, viatge = null } = $props();

	const VIA = 'M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20';
	const GRANS = [
		{ x: 22, y: 120, r: 11 },
		{ x: 108, y: 84, r: 10 },
		{ x: 178, y: 44, r: 10 },
		{ x: 238, y: 20, r: 12 }
	];
	// les ronds d'aujourd'hui
	const PETITS = [
		{ x: 22, y: 120, r: 6 },
		{ x: 108, y: 84, r: 5 },
		{ x: 178, y: 44, r: 5 },
		{ x: 238, y: 20, r: 6.5 }
	];
	let nods = $derived(ronds ? GRANS : PETITS);
</script>

<svg class="scena" viewBox="0 0 260 140" aria-hidden="true">
	<path class="via" d={VIA} fill="none" stroke-width="2.6" stroke-linecap="round" />
	{#each nods as n, i (i)}
		<circle class="nod" class:fin={plenas[i]} cx={n.x} cy={n.y} r={n.r} />
		{#if ronds}
			<CrotzCarga cx={n.x} cy={n.y} r={n.r - 2.2} acesa={lits[i]} plena={plenas[i]} />
		{/if}
	{/each}
	{#if viatge}
		<circle class="nod" class:fin={viatge.plena} cx={viatge.x} cy={viatge.y} r="12.5" />
		<CrotzCarga cx={viatge.x} cy={viatge.y} r="10.3" acesa={viatge.acesa} plena={viatge.plena} />
	{/if}
</svg>

<style>
	/* les couleurs d'aujourd'hui (MiegTres.svelte) et celles du logo (or et rouge) */
	.scena {
		--nod-fons: #123;
		--nod-traç: #ffd98a;
		--fin-fons: #ffd98a;
		--cc-traç: #eeaf34;
		--cc-ponch-acesa: #ffd47f;
		--cc-ponch-amorta: rgba(238, 175, 52, 0.32);
		--cc-moieu: #eeaf34;
		--cc-plena: #b53d17;
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	:global(.banc.clar) .scena {
		--nod-fons: #fbf1e1;
		--nod-traç: #8f5400;
		--fin-fons: #8f5400;
		--cc-traç: #8f5400;
		--cc-ponch-acesa: #b53d17;
		--cc-ponch-amorta: rgba(143, 84, 0, 0.3);
		--cc-moieu: #8f5400;
		--cc-plena: #fbf1e1;
	}
	.via {
		stroke: var(--nod-traç);
		stroke-opacity: 0.85;
	}
	.nod {
		fill: var(--nod-fons);
		stroke: var(--nod-traç);
		stroke-width: 2.4;
		transition: fill 0.5s;
	}
	.nod.fin {
		fill: var(--fin-fons);
	}
</style>
