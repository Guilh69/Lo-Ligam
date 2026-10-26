<script>
	// « Tots los grops » (d'abord « Crear un grop », renommé le 2026-10-25 : on
	// y cherche autant qu'on y ouvre) : le catalogue (villes, niveaux, dialectes,
	// départements, passions). Un groupe proposé ouvre avec sa première
	// personne : la base s'en charge (rejonher_grop), il n'y a rien à remplir.
	import Icona from '$lib/components/Icona.svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, MENAS, rejonher, nomLigne } from '$lib/grops/grops.svelte.js';
	import { X_ERRORS } from '$lib/grops/textes.js';

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			titol: 'Tots los grops',
			tornar: 'Tornar a la lista',
			frasa: 'Un grop prepausat dobrís amb sa primièra persona.',
			cercar: 'Cercar',
			exemple: 'Una vila, un dialècte, una passion…',
			cap: 'Cap de resultat.',
			membres: (n) => `${n} membre${n > 1 ? 's' : ''}`,
			rejonher: 'Rejónher',
			dobrir: 'Dobrir',
			ton: 'Ton grop',
			...X_ERRORS.oc
		},
		fr: {
			titol: 'Tous les groupes',
			tornar: 'Retour à la liste',
			frasa: 'Un groupe proposé ouvre avec sa première personne.',
			cercar: 'Chercher',
			exemple: 'Une ville, un dialecte, une passion…',
			cap: 'Aucun résultat.',
			membres: (n) => `${n} membre${n > 1 ? 's' : ''}`,
			rejonher: 'Rejoindre',
			dobrir: 'Ouvrir',
			ton: 'Ton groupe',
			...X_ERRORS.fr
		},
		es: {
			titol: 'Todos los grupos',
			tornar: 'Volver a la lista',
			frasa: 'Un grupo propuesto abre con su primera persona.',
			cercar: 'Buscar',
			exemple: 'Una ciudad, un dialecto, una pasión…',
			cap: 'Ningún resultado.',
			membres: (n) => `${n} miembro${n > 1 ? 's' : ''}`,
			rejonher: 'Unirse',
			dobrir: 'Abrir',
			ton: 'Tu grupo',
			...X_ERRORS.es
		},
		en: {
			titol: 'All groups',
			tornar: 'Back to the list',
			frasa: 'A suggested group opens with its first member.',
			cercar: 'Search',
			exemple: 'A city, a dialect, a passion…',
			cap: 'No results.',
			membres: (n) => `${n} member${n > 1 ? 's' : ''}`,
			rejonher: 'Join',
			dobrir: 'Open',
			ton: 'Your group',
			...X_ERRORS.en
		},
		ca: {
			titol: 'Tots els grups',
			tornar: 'Torna a la llista',
			frasa: 'Un grup proposat s’obre amb la seva primera persona.',
			cercar: 'Cerca',
			exemple: 'Una ciutat, un dialecte, una passió…',
			cap: 'Cap resultat.',
			membres: (n) => `${n} membre${n > 1 ? 's' : ''}`,
			rejonher: 'Uneix-te',
			dobrir: 'Obre',
			ton: 'El teu grup',
			...X_ERRORS.ca
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	let totes = $state([]);
	let comptes = $state({});
	let cèrca = $state('');
	let en_cors = $state(null);
	let error = $state(null);

	$effect(() => {
		Promise.all([
			supabase.from('grops').select('id, mena, nom_oc, nom_fr, estat').neq('estat', 'tampat').order('orde'),
			supabase.rpc('grops_comptes')
		]).then(([g, c]) => {
			totes = g.data ?? [];
			comptes = Object.fromEntries((c.data ?? []).map((r) => [r.grop_id, r.membres]));
		});
	});

	// la recherche ne tient compte ni des majuscules ni des accents
	const plan = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
	let mevas = $derived(new Set(grops.mevas.map((g) => g.grop_id)));
	let seccions = $derived.by(() => {
		const q = plan(cèrca.trim());
		const tròba = q ? totes.filter((g) => plan(g.nom_oc + ' ' + g.nom_fr).includes(q)) : totes;
		return MENAS.map((m) => ({ mena: m[0], nom: nomLigne(m, langStore.current), grops: tròba.filter((g) => g.mena === m[0]) })).filter(
			(s) => s.grops.length
		);
	});

	async function rejónher(id) {
		error = null;
		en_cors = id;
		const e = await rejonher(id);
		en_cors = null;
		if (e) error = e;
		else goto('/grops/' + id);
	}
</script>

<svelte:head>
	<title>{x.titol} · Lo Ligam</title>
</svelte:head>

<div class="catalòg">
	<header>
		<h2>
			<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="0.8em" /></a>
			{x.titol}
		</h2>
		<p class="frasa">{x.frasa}</p>
		<label class="cercar">
			<Icona nom="chercher" />
			<span class="vist">{x.cercar}</span>
			<input type="search" bind:value={cèrca} placeholder={x.exemple} />
		</label>
		{#if error}<p class="error" role="alert">{x[error] ?? x.error}</p>{/if}
	</header>

	{#each seccions as s (s.mena)}
		<section aria-labelledby="mena-{s.mena}">
			<h3 id="mena-{s.mena}">{s.nom}</h3>
			<ul>
				{#each s.grops as g (g.id)}
					{@const n = comptes[g.id] ?? 0}
					<li>
						<span class="noms">
							<span class="nom">{g.nom_oc}</span>
							{#if fr && g.nom_fr !== g.nom_oc}<span class="nom-fr" lang="fr">{g.nom_fr}</span>{/if}
						</span>
						{#if n}<span class="membres">{x.membres(n)}</span>{/if}
						{#if mevas.has(g.id)}
							<a class="ton" href="/grops/{g.id}">{x.ton}</a>
						{:else}
							<button type="button" class="boton" disabled={en_cors === g.id} onclick={() => rejónher(g.id)}>
								{en_cors === g.id ? '…' : g.estat === 'dobèrt' ? x.rejonher : x.dobrir}
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		{#if totes.length}<p class="cap">{x.cap}</p>{/if}
	{/each}
</div>

<style>
	.catalòg {
		display: grid;
		gap: var(--esp-32);
		padding: var(--esp-24);
	}
	header {
		display: grid;
		gap: var(--esp-12);
		max-width: 36rem;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1;
	}
	.frasa {
		margin: 0;
		color: var(--t-tinta-2);
	}
	/* le retour à la liste, sur téléphone seulement (une colonne à la fois) */
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: 0 0 0 -0.6rem;
		vertical-align: middle;
		color: inherit;
	}
	@container cadre (width < 46rem) {
		.tornar {
			display: inline-grid;
		}
	}
	.tornar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.cercar {
		display: flex;
		align-items: center;
		gap: var(--esp-8);
		padding: 0 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: var(--t-fons);
	}
	.cercar:focus-within {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.cercar input {
		flex: 1;
		min-width: 0;
		min-height: 44px;
		border: 0;
		background: none;
		color: var(--t-tinta);
		font: 400 1rem var(--font-body);
		outline: none;
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	h3 {
		margin: 0 0 var(--esp-8);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	/* sur grand écran, plusieurs colonnes plutôt qu'une longue liste */
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		column-gap: var(--esp-32);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: var(--esp-12);
		min-height: 56px;
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.noms {
		display: grid;
		flex: 1;
		min-width: 0;
	}
	.nom {
		font-weight: 700;
	}
	.nom-fr,
	.membres {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.boton {
		min-height: 40px;
		padding: 0.5rem 1.1rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 0.95rem/1 var(--font-body);
		cursor: pointer;
		transition: background-color 0.25s;
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.ton {
		padding: 0.5rem 0.2rem;
		color: var(--t-aur);
		font-weight: 700;
	}
	.boton:focus-visible,
	.ton:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.cap {
		margin: 0;
		color: var(--t-tinta-2);
	}
</style>
