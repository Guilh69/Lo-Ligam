<script>
	// L'activité « chaque chose à sa place » des fiches de grammaire : on
	// touche une forme, puis la ligne où elle va ; « Verificar » corrige ligne
	// par ligne, avec un indice sous ce qui n'est pas encore juste ; l'œil
	// montre la réponse d'une ligne (elle ne compte plus dans le score).
	import { copa, classeColor } from './marcar.js';
	import { IU } from './lengas.js';
	import Bulla from '$lib/components/Bulla.svelte';
	import { lang, tria } from '$lib/stores/lang.svelte.js';
	// l'habillage suit la langue choisie (lengas.js, Romain 2026-11-04) ; les
	// trois boutons restent en occitan, comme dans le parcours, avec leur
	// traduction en bulle dans une autre langue
	const esOc = $derived(lang.current === 'oc');

	/** bloc : { linhas: [{ oc, fr, forma: 'rad|fin:color', sens, indici }], mescla, etiqueta, bravo } */
	let { bloc, colors } = $props();

	const LINHAS = $derived(
		bloc.linhas.map((l, i) => {
			const c = copa(l.forma);
			return { ...l, id: i, c, mot: c.rad + c.fin };
		})
	);
	const n = $derived(LINHAS.length);

	let places = $state({});
	let choisie = $state(null);
	let vues = $state({});
	let verifie = $state(false);
	let resolue = $state(false);
	const restantes = $derived(bloc.mescla.filter((f) => !Object.values(places).includes(f)));
	// ce qu'on a trouvé seul : les lignes vues avec l'œil ne comptent pas
	const justes = $derived(LINHAS.filter((l) => !vues[l.id] && places[l.id] === l.mot).length);
	const nbVues = $derived(Object.keys(vues).length);

	function choisir(f) {
		choisie = choisie === f ? null : f;
	}
	function poser(id) {
		if (vues[id]) return;
		verifie = false;
		if (choisie) {
			places[id] = choisie;
			choisie = null;
		} else if (places[id] && !vues[id]) {
			delete places[id];
		}
	}
	function montrer(l) {
		if (vues[l.id]) return;
		// la bonne forme, si elle était posée sur une autre ligne, en repart
		for (const id in places) if (+id !== l.id && places[id] === l.mot) delete places[id];
		places[l.id] = l.mot;
		vues[l.id] = true;
		if (choisie === l.mot) choisie = null;
	}
	function solution() {
		for (const l of LINHAS) montrer(l);
		verifie = true;
		resolue = true;
	}
	function reprendre() {
		places = {};
		vues = {};
		choisie = null;
		verifie = false;
		resolue = false;
	}
	const retour = $derived(
		!verifie
			? ''
			: resolue
				? tria(IU.vaquiSolucion)
				: justes === n
					? (bloc.bravo ?? tria(IU.totJust)(n))
					: tria(IU.trobadas)(justes, n, nbVues)
	);
</script>

<div class="jeu">
	<ol class="taula">
		{#each LINHAS as l (l.id)}
			{@const pl = places[l.id]}
			{@const ok = pl === l.mot}
			<li class="linha" class:juste={verifie && ok} class:pas-encore={verifie && pl && !ok}>
				<span class="persona"><span lang="oc">{l.oc}</span><small>{l.fr}</small></span>
				<button
					type="button"
					class="place"
					class:plena={pl}
					class:esperant={choisie && !vues[l.id]}
					aria-disabled={vues[l.id]}
					aria-label={pl
						? `${l.fr} : ${pl}${verifie || vues[l.id] ? `, ${ok ? tria(IU.just) : tria(IU.pasEncaraCurt)}` : ''}${vues[l.id] ? '' : `, ${tria(IU.tocarPerLevar)}`}`
						: tria(IU.pausarAici)(l.fr)}
					onclick={() => poser(l.id)}
				>
					{#if pl}
						{#if (verifie || vues[l.id]) && ok}
							<span lang="oc">{l.c.rad}<b class="fin {classeColor(colors, l.c.color)}">{l.c.fin}</b></span>
						{:else}
							<span lang="oc">{pl}</span>
						{/if}
					{/if}
				</button>
				<button type="button" class="oeil" aria-label={tria(IU.veireResponsaPer)(l.fr)} title={tria(IU.veireResponsa)} aria-disabled={vues[l.id]} onclick={() => montrer(l)}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
				</button>
				<span class="marca">
					{#if (verifie || vues[l.id]) && ok}
						<span class="sens">{l.sens}</span>
					{:else if verifie && pl}
						<span class="indici"><span class="pe">{tria(IU.pasEncara)}</span> {l.indici}</span>
					{/if}
				</span>
			</li>
		{/each}
	</ol>
	<div class="formas" role="group" aria-label={bloc.etiqueta ?? tria(IU.formasDePausar)}>
		{#each restantes as f (f)}
			<button type="button" class="forma" lang="oc" aria-pressed={choisie === f} onclick={() => choisir(f)}>{f}</button>
		{:else}
			<p class="formes-vides">{tria(IU.totPausat)}</p>
		{/each}
	</div>
</div>
<div class="accions">
	{#each [['verificar', 'boton', !Object.keys(places).length, () => (verifie = true)], ['solucion', 'boton segond', false, solution], ['recomencar', 'boton tiers', false, reprendre]] as [k, classe, inactiu, accion] (k)}
		<button type="button" class={classe} lang="oc" disabled={inactiu} aria-describedby={esOc ? undefined : `b-${k}`} onclick={accion}
			>{IU[k].oc}{#if !esOc}<Bulla id="b-{k}" text={tria(IU[k])} lang={lang.current} />{/if}</button
		>
	{/each}
</div>
<p class="retorn" aria-live="polite">{retour}</p>

<style>
	.jeu {
		display: grid;
		gap: 1rem 2rem;
		align-items: start;
	}
	@container (min-width: 56rem) {
		.jeu {
			grid-template-columns: 1fr 12rem;
		}
	}
	.taula {
		list-style: none;
		margin: 0;
		padding: 0;
		border-radius: 0.9rem;
		overflow: hidden;
		background: var(--t-fons-2);
	}
	.linha {
		display: grid;
		grid-template-columns: minmax(6.5rem, 12rem) 1fr auto;
		grid-template-areas: 'p c u' '. m m';
		align-items: center;
		gap: 0 0.6rem;
		padding: 0.45rem 0.6rem;
	}
	.linha + .linha {
		border-top: 1px solid var(--t-linha);
	}
	.persona {
		grid-area: p;
		display: grid;
		font-weight: 700;
	}
	.persona small {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.place {
		grid-area: c;
		min-height: 2.6rem;
		border: 2px dashed var(--t-tinta-2);
		border-radius: 1.4rem;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.2rem;
		cursor: pointer;
	}
	.place.esperant {
		border-color: var(--t-aur);
	}
	.place.plena {
		border-style: solid;
		border-color: transparent;
		background: var(--pastilha);
	}
	.place[aria-disabled='true'] {
		cursor: default;
	}
	.linha.juste .place {
		box-shadow: inset 0 0 0 2px var(--t-aur);
	}
	.oeil {
		grid-area: u;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border: 0;
		border-radius: 50%;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
	}
	.oeil[aria-disabled='true'] {
		opacity: 0.3;
		cursor: default;
	}
	.oeil svg {
		width: 1.3rem;
		height: 1.3rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
	}
	.marca {
		grid-area: m;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.marca:empty {
		display: none;
	}
	.pe {
		color: var(--t-aur);
		font-weight: 700;
	}
	.formas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-content: start;
	}
	@container (min-width: 56rem) {
		.formas {
			flex-direction: column;
		}
	}
	.forma {
		padding: 0.45rem 1.1rem;
		border: 0;
		border-radius: 1.4rem;
		background: var(--pastilha);
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.2rem;
		cursor: pointer;
		transition: transform 0.15s ease;
	}
	.forma[aria-pressed='true'] {
		box-shadow: 0 0 0 3px var(--t-aur);
		transform: translateY(-2px);
	}
	.formes-vides {
		margin: 0;
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.boton {
		padding: 0.6rem 1.3rem;
		border: 0;
		border-radius: 1.6rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.boton.segond,
	.boton.tiers {
		background: transparent;
		color: var(--t-tinta);
		box-shadow: inset 0 0 0 2px var(--t-accion);
	}
	.boton.tiers {
		box-shadow: none;
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-underline-offset: 0.25em;
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.retorn {
		margin: 0;
		min-height: 1.5em;
		font-weight: 700;
	}
	button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.forma {
			transition: none;
		}
	}
</style>
