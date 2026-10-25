<script>
	// Le profil d'un membre (2026-10-25) : visible des seuls membres vérifiés,
	// et seulement s'il est vérifié lui-même (public.perfil). Ses champs
	// publics, et les groupes que l'on a en commun, pas tous les siens.
	import Icona from '$lib/components/Icona.svelte';
	import { page } from '$app/state';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, DIALECTES, NIVELS, CERCA, AGRADA, nomDe } from '$lib/grops/grops.svelte.js';
	import Avatar from '$lib/grops/Avatar.svelte';

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			tornar: 'Tornar a la lista',
			moderacion: 'moderacion',
			ont: 'D’ont',
			dialecte: 'Dialècte',
			nivel: 'Nivèl',
			cerca: 'Çò que cèrca',
			agrada: 'Çò que li agrada',
			dempuei: 'Membre dempuèi',
			comuns: 'Grops en comun',
			cap: 'Cap de grop en comun.',
			invisible: 'Aqueste perfil es pas visible.',
			espèra: 'Los perfils se veson quand lo tieu es verificat.',
			ieu: 'Modificar mon perfil'
		},
		fr: {
			tornar: 'Retour à la liste',
			moderacion: 'modération',
			ont: 'D’où',
			dialecte: 'Dialecte',
			nivel: 'Niveau',
			cerca: 'Ce qu’il ou elle cherche',
			agrada: 'Ce qu’il ou elle aime',
			dempuei: 'Membre depuis',
			comuns: 'Groupes en commun',
			cap: 'Aucun groupe en commun.',
			invisible: 'Ce profil n’est pas visible.',
			espèra: 'Les profils se voient quand le tien est vérifié.',
			ieu: 'Modifier mon profil'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let pseudo = $derived(page.params.pseudo);
	let perfil = $state(null);
	let cargat = $state(false);
	$effect(() => {
		const p = pseudo;
		if (!grops.uid) return;
		cargat = false;
		supabase.rpc('perfil', { p }).then(({ data }) => {
			if (p !== pseudo) return;
			perfil = data?.[0] ?? null;
			cargat = true;
		});
	});
	let ieu = $derived(perfil && perfil.user_id === grops.uid);
	// le lieu dans la langue choisie, avec le département quand il vient de la carte
	const luòc = (p) => (fr ? p.ont : (p.ont_oc ?? p.ont)) + (p.ont_dep ? ` (${p.ont_dep})` : '');
	const mes = (d) => new Date(d).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
</script>

<svelte:head>
	<title>{pseudo} · Lo Ligam</title>
</svelte:head>

<div class="perfil">
	<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
	{#if !cargat}
		<p class="nota">…</p>
	{:else if !perfil}
		<p class="nota">{grops.ieu?.verificacion === 'verificat' || grops.admin ? x.invisible : x.espèra}</p>
	{:else}
		<header>
			<Avatar pseudo={perfil.pseudo} id={perfil.user_id} size="5rem" />
			<div>
				<h2>{perfil.pseudo}</h2>
				{#if perfil.es_admin}<span class="moderacion">{x.moderacion}</span>{/if}
			</div>
		</header>

		{#if perfil.presentacion}<p class="presentacion">{perfil.presentacion}</p>{/if}

		<dl>
			{#if perfil.ont}<div><dt>{x.ont}</dt><dd>{luòc(perfil)}</dd></div>{/if}
			{#if perfil.dialecte}<div><dt>{x.dialecte}</dt><dd>{nomDe(DIALECTES, perfil.dialecte, fr)}</dd></div>{/if}
			{#if perfil.nivel}<div><dt>{x.nivel}</dt><dd>{nomDe(NIVELS, perfil.nivel, fr)}</dd></div>{/if}
			<div><dt>{x.dempuei}</dt><dd>{mes(perfil.arribat_at)}</dd></div>
		</dl>

		{#each [['cerca', CERCA], ['agrada', AGRADA]] as [nom, lista] (nom)}
			{#if perfil[nom]?.length}
				<section aria-labelledby="perfil-{nom}">
					<h3 id="perfil-{nom}">{x[nom]}</h3>
					<p class="pastilhas">
						{#each perfil[nom] as v (v)}<span>{nomDe(lista, v, fr)}</span>{/each}
					</p>
				</section>
			{/if}
		{/each}

		{#if !ieu}
			<section aria-labelledby="perfil-comuns">
				<h3 id="perfil-comuns">{x.comuns}</h3>
				{#if perfil.grops_comuns.length}
					<ul>
						{#each perfil.grops_comuns as g (g.id)}
							<li><a href="/grops/{g.id}">{g.nom_oc}</a></li>
						{/each}
					</ul>
				{:else}
					<p class="nota">{x.cap}</p>
				{/if}
			</section>
		{:else}
			<a class="boton" href="/grops/perfil">{x.ieu}</a>
		{/if}
	{/if}
</div>

<style>
	.perfil {
		display: grid;
		align-content: start;
		gap: var(--esp-24);
		max-width: 38rem;
		padding: var(--esp-24);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: -0.5rem 0 -1rem -0.6rem;
		color: inherit;
	}
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
	}
	header {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1.05;
		overflow-wrap: anywhere;
	}
	.moderacion {
		display: inline-block;
		margin-top: var(--esp-4);
		padding: 0 0.5rem;
		border: 1px solid var(--t-aur);
		border-radius: 999px;
		color: var(--t-aur);
		font-size: 0.85rem;
		font-weight: 700;
	}
	.presentacion {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.55;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: var(--esp-16);
		margin: 0;
	}
	dt {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	dd {
		margin: 2px 0 0;
	}
	/* ce qu'on cherche, ce qu'on aime : des étiquettes, pas des boutons */
	.pastilhas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
		margin: 0;
	}
	.pastilhas span {
		padding: 0.2rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
	}
	h3 {
		margin: 0 0 var(--esp-8);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	ul a {
		display: inline-block;
		padding: 0.35rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: inherit;
		text-decoration: none;
	}
	ul a:hover {
		border-color: var(--t-aur);
	}
	.nota {
		margin: 0;
		color: var(--t-tinta-2);
	}
	.boton {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.tornar:focus-visible,
	ul a:focus-visible,
	.boton:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
