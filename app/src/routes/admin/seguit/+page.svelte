<script>
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	// Ont ne sèm : le suivi des chantiers, pour Romain (point d'étape du
	// 2026-11-06 au soir). Données : $lib/seguit/seguit.js, tenues par Claude ;
	// les décisions à trancher sont en cartes sur /admin/triar (lot « decisions »).
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { GROPS, ESTATS, MESA_A_JORN, comptes } from '$lib/seguit/seguit.js';
	import { DECISIONS } from '$lib/triar/decisions.js';
	import { PAGINA, estatDe } from '$lib/triar/triar.js';

	const n = comptes();
	let filtre = $state('tot'); // tot | romain
	let decisionsRèsta = $state(null);

	onMount(async () => {
		const { data, error } = await supabase
			.from('remarcas')
			.select('id, cibla, extrait, tèxte, estat, responsa')
			.eq('pagina', PAGINA)
			.eq('modul', 'decisions')
			.order('id');
		if (error) return;
		const e = estatDe(data ?? []);
		decisionsRèsta = DECISIONS.filter((d) => !e[d.clau] || e[d.clau].v === 'refach').length;
	});

	const vesible = (c) => filtre === 'tot' || c.estat === 'romain';
</script>

<svelte:head>
	<title>Ont ne sèm — Espaci d'administracion</title>
</svelte:head>

<section class="seguit" aria-labelledby="seguit-titol">
	<AdminTete oc="Ont ne sèm" fr="où on en est" id="seguit-titol">
		<p class="mesa">Mis à jour le {MESA_A_JORN}. L’avancement est une estimation de Claude.</p>
		<ul class="resum">
			{#each Object.entries(ESTATS) as [id, e] (id)}
				<li class="badge {id}"><strong>{n[id]}</strong> {e.resum}</li>
			{/each}
		</ul>
		<a class="decisions" href="/admin/valider?vue=triar&lot=decisions">
			<span class="d-n">{decisionsRèsta ?? DECISIONS.length}</span>
			<span>décisions à trancher en cartes <span aria-hidden="true">→</span></span>
		</a>
		<div class="filtre" role="group" aria-label="Que montrer">
			<button type="button" aria-pressed={filtre === 'tot'} onclick={() => (filtre = 'tot')}>Tout</button>
			<button type="button" aria-pressed={filtre === 'romain'} onclick={() => (filtre = 'romain')}>Ce qui m’attend</button>
		</div>
	</AdminTete>

	{#each GROPS as g (g.nom)}
		{#if g.chantiers.some(vesible)}
			<h2>{g.nom}</h2>
			<ul class="chantiers">
				{#each g.chantiers.filter(vesible) as c (c.clau)}
					<li class="chantier {c.estat}">
						<div class="linha1">
							<p class="nom">
								{#if c.ligam}<a href={c.ligam}>{c.nom}</a>{:else}{c.nom}{/if}
							</p>
							<span class="badge {c.estat}">{ESTATS[c.estat].cort}</span>
						</div>
						<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={c.avanç} aria-label="Avancement de {c.nom}">
							<span style:width="{c.avanç}%"></span>
						</div>
						<p class="pct">{c.avanç} %</p>
						<p class="seguenta"><span class="et">Ensuite</span> {c.seguenta}</p>
						<p class="qui"><span class="et">Qui</span> {c.qui}{#if c.discussion} · discussion « {c.discussion} »{/if}</p>
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</section>

<style>
	.seguit {
		width: 100%;
		margin: 0 auto;
		font-family: var(--font-body);
		color: var(--t-tinta, #2a1a10);
	}
	.mesa {
		margin: 0.3rem 0 0.9rem;
		font-size: 0.9rem;
		opacity: 0.75;
	}
	.resum {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1rem;
		padding: 0;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
		font-size: 0.85rem;
		white-space: nowrap;
	}
	.badge.romain {
		border-color: var(--t-aur, #9c5611);
		color: var(--t-aur, #9c5611);
	}
	.badge.en-cors {
		border-color: currentColor;
	}
	.badge.pausa,
	.badge.acabat {
		opacity: 0.65;
	}
	.decisions {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.8rem 1rem;
		border-radius: 0.9rem;
		background: var(--t-accion, #b53d17);
		color: var(--t-accion-tinta, #fbf1e1);
		text-decoration: none;
		font-weight: 700;
	}
	.decisions:hover,
	.decisions:focus-visible {
		background: var(--t-accion-viu, #8f2f12);
	}
	.d-n {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.8rem;
		line-height: 1;
	}
	.filtre {
		display: flex;
		gap: 0.4rem;
		margin: 1rem 0 0;
	}
	.filtre button {
		font: inherit;
		font-size: 0.9rem;
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
		background: none;
		color: inherit;
		cursor: pointer;
	}
	.filtre button[aria-pressed='true'] {
		border-color: currentColor;
		font-weight: 700;
	}
	h2 {
		margin: 1.8rem 0 0.6rem;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--t-aur, #9c5611);
	}
	.chantiers {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.chantier {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 0.8rem;
		padding: 0.8rem 0;
		border-top: 1px solid var(--t-linha, rgba(42, 26, 16, 0.15));
	}
	.chantier.pausa,
	.chantier.acabat {
		opacity: 0.7;
	}
	.linha1 {
		grid-column: 1 / -1;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
	}
	.nom {
		margin: 0;
		font-weight: 700;
		font-size: 1.05rem;
	}
	.nom a {
		color: inherit;
		text-decoration-color: var(--t-accion, #b53d17);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}
	.barra {
		align-self: center;
		height: 6px;
		margin: 0.5rem 0;
		border-radius: 3px;
		background: var(--t-linha, rgba(42, 26, 16, 0.14));
		overflow: hidden;
	}
	.barra span {
		display: block;
		height: 100%;
		background: var(--t-aur, #9c5611);
	}
	.pct {
		margin: 0;
		align-self: center;
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		min-width: 3.2em;
		text-align: right;
	}
	.seguenta,
	.qui {
		grid-column: 1 / -1;
		margin: 0.15rem 0 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.qui {
		font-size: 0.85rem;
		opacity: 0.75;
	}
	.et {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.7;
		margin-right: 0.3rem;
	}
</style>
