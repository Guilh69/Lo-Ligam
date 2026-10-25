<script>
	// Les profils à valider (2026-10-25). Au lancement, Romain accepte ou
	// refuse chaque nouveau profil avant qu'il puisse écrire dans les groupes
	// et être vu des autres (cahier §11). Il voit l'adresse, eux non. Les
	// verrous réels sont dans la base (public.decidir_perfil, réservé à
	// l'administration ; supabase/supabase-perfils.sql).
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { DIALECTES, NIVELS, CERCA, AGRADA, nomDe } from '$lib/grops/grops.svelte.js';
	import { luòcAfichat } from '$lib/comunas.js';

	let perfils = $state([]);
	let cargant = $state(true);
	let msg = $state(null);
	let en_cors = $state(null);

	let espèra = $derived(perfils.filter((p) => p.verificacion === 'en_espèra'));
	let refusats = $derived(perfils.filter((p) => p.verificacion === 'refusat'));

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const { data, error } = await supabase.rpc('perfils_en_espera');
		cargant = false;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		perfils = data;
	}

	async function decidir(p, d) {
		msg = null;
		en_cors = p.user_id;
		const { error } = await supabase.rpc('decidir_perfil', { u: p.user_id, d });
		en_cors = null;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		msg = {
			tipe: 'ok',
			text:
				d === 'verificat'
					? `${p.pseudo} : acceptat. (Accepté : il ou elle peut écrire dans les groupes.)`
					: d === 'refusat'
						? `${p.pseudo} : refusat. (Refusé : il ou elle lit, n’écrit pas, son profil est caché.)`
						: `${p.pseudo} : tornat en espèra. (Remis en attente.)`
		};
		await cargar();
	}

	const data_ = (d) =>
		new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
</script>

<svelte:head>
	<title>Perfils — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<h1>Perfils de validar</h1>
	<p class="subtitle">
		Cada perfil nòu espèra ton acòrd per escriure dins los grops e èsser vist.
		<em>(Chaque nouveau profil attend ton accord pour écrire dans les groupes et être vu. Toi seul vois l’adresse.)</em>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else if !espèra.length}
		<p class="msg info">Cap de perfil en espèra. <em>(Aucun profil en attente.)</em></p>
	{:else}
		<ul class="lista">
			{#each espèra as p (p.user_id)}
				{@render fiche(p)}
			{/each}
		</ul>
	{/if}

	{#if refusats.length}
		<h2>Refusats <em>(refusés)</em></h2>
		<ul class="lista">
			{#each refusats as p (p.user_id)}
				{@render fiche(p)}
			{/each}
		</ul>
	{/if}
</section>

{#snippet fiche(p)}
	<li class:refusat={p.verificacion === 'refusat'}>
		<div class="meta">
			<strong class="pseudo">{p.pseudo}</strong>
			<span>{p.adreca}</span>
			{#if !p.adreca_verificada}<span class="avis">adreça pas verificada <em>(adresse non vérifiée)</em></span>{/if}
			<span>arribat lo {data_(p.inscrit_at)}</span>
		</div>
		{#if p.presentacion}<p class="tèxte">{p.presentacion}</p>{:else}<p class="tèxte void">Cap de presentacion. <em>(Pas de présentation.)</em></p>{/if}
		<p class="detalhs">
			{#if p.ont}<span>{luòcAfichat(p, true)}{p.ont_oc && p.ont_oc !== p.ont ? ` · ${p.ont_oc}` : ''}{p.ont_occitania ? ' · Occitània' : ''}</span>{/if}
			{#if p.dialecte}<span>{nomDe(DIALECTES, p.dialecte, false)}</span>{/if}
			{#if p.nivel}<span>{nomDe(NIVELS, p.nivel, false)}</span>{/if}
			{#each p.cerca ?? [] as v (v)}<span class="cerca">{nomDe(CERCA, v, false)}</span>{/each}
			{#each p.agrada ?? [] as v (v)}<span class="agrada">{nomDe(AGRADA, v, false)}</span>{/each}
		</p>
		<div class="accions">
			{#if p.verificacion === 'en_espèra'}
				<button type="button" class="btn-primary" disabled={en_cors === p.user_id} onclick={() => decidir(p, 'verificat')}>Acceptar</button>
				<button type="button" class="btn-segond" disabled={en_cors === p.user_id} onclick={() => decidir(p, 'refusat')}>Refusar</button>
			{:else}
				<button type="button" class="btn-segond" disabled={en_cors === p.user_id} onclick={() => decidir(p, 'en_espèra')}>Tornar en espèra</button>
				<button type="button" class="btn-primary" disabled={en_cors === p.user_id} onclick={() => decidir(p, 'verificat')}>Acceptar</button>
			{/if}
		</div>
	</li>
{/snippet}

<style>
	.subtitle {
		margin: -0.7rem 0 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}
	.subtitle em,
	h2 em,
	.meta em,
	.void em {
		opacity: 0.8;
		font-weight: 400;
	}
	h2 {
		margin: 1rem 0 0;
		font-size: 1.1rem;
	}
	.lista {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.lista li {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.9rem;
		border-radius: 12px;
		background: var(--color-cream);
		box-shadow: inset 4px 0 0 var(--color-teal);
	}
	.lista li.refusat {
		box-shadow: none;
		opacity: 0.8;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.9rem;
		font-size: 0.8rem;
		color: var(--color-teal);
	}
	.pseudo {
		font-size: 1rem;
		color: var(--color-text);
	}
	.avis {
		font-weight: 700;
		color: var(--color-terracotta);
	}
	.tèxte {
		margin: 0;
		color: var(--color-text);
		line-height: 1.5;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.void {
		opacity: 0.7;
	}
	.detalhs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
	}
	.detalhs span {
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		background: white;
		font-size: 0.8rem;
	}
	.detalhs .cerca {
		background: color-mix(in srgb, var(--color-teal) 12%, white);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
