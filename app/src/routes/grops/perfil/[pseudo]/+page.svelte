<script>
	// Le profil d'un membre (2026-10-25) : visible des seuls membres vérifiés,
	// et seulement s'il est vérifié lui-même (public.perfil). Ses champs
	// publics, et les groupes que l'on a en commun, pas tous les siens.
	// Depuis le 2026-10-25, le lien avec la personne (supabase-contactes.sql) :
	// demander le contact, répondre, écrire, retirer, bloquer.
	import Icona from '$lib/components/Icona.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, DIALECTES, NIVELS, CERCA, AGRADA, nomDe, demandarContacte, respondreContacte, quitarContacte, blocar, desblocar } from '$lib/grops/grops.svelte.js';
	import { X_ERRORS } from '$lib/grops/textes.js';
	import Avatar from '$lib/grops/Avatar.svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import { luòcAfichat } from '$lib/comunas.js';

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
			occitania: 'Occitània',
			dempuei: 'Membre dempuèi',
			comuns: 'Grops en comun',
			cap: 'Cap de grop en comun.',
			invisible: 'Aqueste perfil es pas visible.',
			espèra: 'Los perfils se veson quand lo tieu es verificat.',
			ieu: 'Modificar mon perfil',
			apondre: 'Apondre als contactes',
			mandada: 'Demanda mandada : espèra sa responsa.',
			anullar: 'Anullar la demanda',
			recebuda: 'Vòl èsser en contacte amb tu.',
			acceptar: 'Acceptar',
			refusar: 'Refusar',
			escriure: 'Escriure',
			quitar: 'Levar dels contactes',
			blocar: 'Blocar',
			blocat: 'As blocat aquesta persona : te pòt pas mai escriure.',
			desblocar: 'Desblocar',
			segur_quitar: 'Levar aquesta persona de tos contactes ?',
			segur_blocar: 'Blocar aquesta persona ? Te poirà pas mai escriure ni te demandar.',
			òc: 'Òc',
			non: 'Non'
		},
		fr: {
			tornar: 'Retour à la liste',
			moderacion: 'modération',
			ont: 'D’où',
			dialecte: 'Dialecte',
			nivel: 'Niveau',
			cerca: 'Ce qu’il ou elle cherche',
			agrada: 'Ce qu’il ou elle aime',
			occitania: 'Occitanie',
			dempuei: 'Membre depuis',
			comuns: 'Groupes en commun',
			cap: 'Aucun groupe en commun.',
			invisible: 'Ce profil n’est pas visible.',
			espèra: 'Les profils se voient quand le tien est vérifié.',
			ieu: 'Modifier mon profil',
			apondre: 'Ajouter aux contacts',
			mandada: 'Demande envoyée : attends sa réponse.',
			anullar: 'Annuler la demande',
			recebuda: 'Veut être en contact avec toi.',
			acceptar: 'Accepter',
			refusar: 'Refuser',
			escriure: 'Écrire',
			quitar: 'Retirer des contacts',
			blocar: 'Bloquer',
			blocat: 'Tu as bloqué cette personne : elle ne peut plus t’écrire.',
			desblocar: 'Débloquer',
			segur_quitar: 'Retirer cette personne de tes contacts ?',
			segur_blocar: 'Bloquer cette personne ? Elle ne pourra plus t’écrire ni te demander.',
			òc: 'Oui',
			non: 'Non'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let pseudo = $derived(page.params.pseudo);
	// en développement, « ?simular=acceptat » (cap, mandada, recebuda, blocat)
	// montre un profil d'exemple et ses boutons
	const simular = browser && import.meta.env.DEV ? new URLSearchParams(location.search).get('simular') : null;
	let perfil = $state(null);
	let cargat = $state(false);
	$effect(() => {
		const p = pseudo;
		if (simular !== null && !grops.uid) {
			perfil = { user_id: 's2', pseudo: p, presentacion: 'Adieu, soi de Lodève.', ont: 'Lodève', ont_oc: 'Lodeva', ont_dep: '34', ont_occitania: true, nivel: 'apren', arribat_at: '2026-10-01', cerca: ['parlar'], agrada: ['bal'], grops_comuns: [] };
			cargat = true;
			return;
		}
		if (!grops.uid) return;
		cargat = false;
		supabase.rpc('perfil', { p }).then(({ data }) => {
			if (p !== pseudo) return;
			perfil = data?.[0] ?? null;
			cargat = true;
		});
	});
	let ieu = $derived(perfil && perfil.user_id === grops.uid);

	// le lien : relacion() à l'ouverture, puis à chaque changement de la liste
	// des contacts (l'autre a pu accepter pendant ce temps)
	let relacion = $state(null);
	$effect(() => {
		const u = perfil?.user_id;
		grops.contactes;
		if (simular !== null && !grops.uid) return (relacion = simular || 'cap');
		if (!u || u === grops.uid) return (relacion = null);
		supabase.rpc('relacion', { u }).then(({ data }) => {
			if (u === perfil?.user_id) relacion = data;
		});
	});
	let confirmar = $state(null); // 'quitar' ou 'blocar' : on redemande
	let ocupat = $state(false);
	let error = $state(null);
	async function far(fn, ...args) {
		ocupat = true;
		error = null;
		const e = await fn(perfil.user_id, ...args);
		if (e) error = e;
		else relacion = (await supabase.rpc('relacion', { u: perfil.user_id })).data;
		confirmar = null;
		ocupat = false;
	}
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

		{#if relacion}
			<div class="relacion" aria-live="polite">
				{#if confirmar}
					<p>{confirmar === 'blocar' ? x.segur_blocar : x.segur_quitar}</p>
					<div class="botons">
						<button type="button" class="boton" disabled={ocupat} onclick={() => far(confirmar === 'blocar' ? blocar : quitarContacte)}>{x.òc}</button>
						<button type="button" class="boton segond" onclick={() => (confirmar = null)}>{x.non}</button>
					</div>
				{:else if relacion === 'cap'}
					<div class="botons">
						<button type="button" class="boton" disabled={ocupat} onclick={() => far(demandarContacte)}>{x.apondre}</button>
						<button type="button" class="ligam" onclick={() => (confirmar = 'blocar')}>{x.blocar}</button>
					</div>
				{:else if relacion === 'mandada'}
					<p>{x.mandada}</p>
					<div class="botons">
						<button type="button" class="boton segond" disabled={ocupat} onclick={() => far(quitarContacte)}>{x.anullar}</button>
					</div>
				{:else if relacion === 'recebuda'}
					<p>{x.recebuda}</p>
					<div class="botons">
						<button type="button" class="boton" disabled={ocupat} onclick={() => far(respondreContacte, true)}>{x.acceptar}</button>
						<button type="button" class="boton segond" disabled={ocupat} onclick={() => far(respondreContacte, false)}>{x.refusar}</button>
						<button type="button" class="ligam" onclick={() => (confirmar = 'blocar')}>{x.blocar}</button>
					</div>
				{:else if relacion === 'acceptat'}
					<div class="botons">
						<a class="boton" href="/grops/amb/{perfil.pseudo}">{x.escriure}</a>
						<span class="segonds">
							<button type="button" class="ligam" onclick={() => (confirmar = 'quitar')}>{x.quitar}</button>
							<button type="button" class="ligam" onclick={() => (confirmar = 'blocar')}>{x.blocar}</button>
						</span>
					</div>
				{:else if relacion === 'blocat'}
					<p>{x.blocat}</p>
					<div class="botons">
						<button type="button" class="boton segond" disabled={ocupat} onclick={() => far(desblocar)}>{x.desblocar}</button>
					</div>
				{/if}
				{#if error}<p class="error" role="alert">{(fr ? X_ERRORS.fr : X_ERRORS.oc)[error] ?? (fr ? X_ERRORS.fr : X_ERRORS.oc).error}</p>{/if}
			</div>
		{/if}

		{#if perfil.presentacion}<p class="presentacion">{perfil.presentacion}</p>{/if}

		<dl>
			{#if perfil.ont}<div><dt>{x.ont}</dt><dd class:oc={perfil.ont_occitania}>{#if perfil.ont_occitania}<span role="img" aria-label={x.occitania} title={x.occitania}><Crotz talha={20} teula /></span>{/if}{luòcAfichat(perfil, fr)}</dd></div>{/if}
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
	/* une commune d'Occitanie : la croix du logo devant son nom */
	dd.oc {
		display: flex;
		align-items: center;
		gap: var(--esp-8);
	}
	dd.oc span {
		display: inline-flex;
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
	button.boton {
		border: 0;
		cursor: pointer;
	}
	.boton:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.boton.segond {
		background: transparent;
		color: var(--t-tinta);
		box-shadow: inset 0 0 0 1px var(--t-linha);
	}
	.boton.segond:hover {
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}
	/* le lien avec la personne : ce qu'on peut faire, juste sous son nom */
	.relacion {
		display: grid;
		gap: var(--esp-12);
	}
	.relacion p {
		margin: 0;
		line-height: 1.5;
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-8) var(--esp-16);
	}
	.segonds {
		display: flex;
		gap: var(--esp-12);
	}
	/* retirer, bloquer : en retrait, soulignés comme des liens */
	.ligam {
		min-height: 44px;
		padding: 0 var(--esp-4);
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.95rem;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.ligam:hover {
		color: var(--t-tinta);
	}
	.relacion .error {
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.ligam:focus-visible,
	.tornar:focus-visible,
	ul a:focus-visible,
	.boton:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
