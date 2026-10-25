<script>
	// Les groupes d'Amassa (2026-10-25) : une messagerie, comme on en a
	// l'habitude. Sur grand écran, ses groupes à gauche et la discussion à
	// droite ; sur téléphone, l'un puis l'autre. « Tots los grops » ouvre le
	// catalogue (villes, dialectes, départements, passions). Fermé au public
	// jusqu'à la charte (DOBÈRTS) : seul l'administrateur le voit.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import { esAdmin, adminSabut } from '$lib/adminStore';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';
	import { grops, DOBÈRTS, cargarMevas, tancar, ora } from '$lib/grops/grops.svelte.js';
	import Tèxte from '$lib/grops/Tèxte.svelte';

	let { data, children } = $props();
	const lèvaEdicion = iniciar('grops', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			grops: 'Grops',
			mos: 'Mos grops',
			crear: 'Tots los grops',
			començar: 'Per començar',
			connectar: 'Se connectar',
			non_legits: (n) => `${n} messatge${n > 1 ? 's' : ''} pas legit${n > 1 ? 's' : ''}`,
			confidencialitat: 'Confidencialitat',
			amassa: 'Tornar a Amassa'
		},
		fr: {
			grops: 'Groupes',
			mos: 'Mes groupes',
			crear: 'Tous les groupes',
			començar: 'Pour commencer',
			connectar: 'Se connecter',
			non_legits: (n) => `${n} message${n > 1 ? 's' : ''} non lu${n > 1 ? 's' : ''}`,
			confidencialitat: 'Confidentialité',
			amassa: 'Retour à Amassa'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let uid = $derived($session?.user?.id ?? null);
	// en développement, « ?simular » montre les groupes sans compte (mise en page)
	const simular = browser && import.meta.env.DEV && new URLSearchParams(location.search).has('simular');
	let permés = $derived(DOBÈRTS || $esAdmin || simular);
	let sabut = $derived($authReady && (!$session || $adminSabut));

	$effect(() => {
		grops.admin = $esAdmin;
		grops.uid = uid;
		if (uid && permés) cargarMevas();
		else tancar();
	});
	$effect(() => () => tancar());

	// sans groupe encore : les quatre groupes ouverts pour commencer
	let dobèrts = $state([]);
	$effect(() => {
		if (!permés || !grops.cargadas || grops.mevas.length || dobèrts.length) return;
		supabase
			.from('grops')
			.select('id, nom_oc, nom_fr')
			.eq('estat', 'dobèrt')
			.order('orde')
			.limit(8)
			.then(({ data: d }) => (dobèrts = d ?? []));
	});

	// sur téléphone, une seule colonne : la liste à l'accueil, sinon la droite
	let dins = $derived(page.route.id !== '/grops');
</script>

<svelte:head>
	{#if !DOBÈRTS}<meta name="robots" content="noindex" />{/if}
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	{#if !sabut}
		<p class="cargament">…</p>
	{:else if !permés}
		<main class="lèu">
			<h1>{x.grops}</h1>
			<Tèxte clau="grops.lèu" class="frasa" />
			<a class="boton" href="/amassa">{x.amassa}</a>
		</main>
	{:else}
		<div class="cadre">
			<div class="messatjariá" class:dins>
				<nav class="lista" aria-label={x.mos}>
					<div class="cap-lista">
						<h1>{x.grops}</h1>
						<a class="crear" href="/grops/crear" aria-current={page.route.id === '/grops/crear' ? 'page' : undefined}>
							<Icona nom="chercher" />
							{x.crear}
						</a>
					</div>

					{#if !uid}
						<Tèxte clau="grops.compte" class="nota" />
						<a class="boton" href="/compte?tornar={encodeURIComponent(page.url.pathname)}">{x.connectar}</a>
					{:else if grops.cargadas && !grops.mevas.length}
						<h2 class="començar">{x.començar}</h2>
						<ul class="grops">
							{#each dobèrts as g (g.id)}
								<li>
									<a href="/grops/{g.id}" aria-current={page.params.id === g.id ? 'page' : undefined}>
										<span class="noms">
											<span class="nom">{g.nom_oc}</span>
											{#if fr && g.nom_fr !== g.nom_oc}<span class="nom-fr" lang="fr">{g.nom_fr}</span>{/if}
										</span>
										<Icona nom="suivant" />
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<ul class="grops">
							{#each grops.mevas as g (g.grop_id)}
								<li>
									<a href="/grops/{g.grop_id}" aria-current={page.params.id === g.grop_id ? 'page' : undefined}>
										<span class="noms">
											<span class="nom">{g.nom_oc}</span>
											{#if fr && g.nom_fr !== g.nom_oc}<span class="nom-fr" lang="fr">{g.nom_fr}</span>{/if}
										</span>
										<span class="estat">
											{#if g.darrier_at}<time datetime={g.darrier_at}>{ora(g.darrier_at)}</time>{/if}
											{#if g.non_legits}<span class="non-legits" aria-label={x.non_legits(g.non_legits)}>{g.non_legits}</span>{/if}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}

					<p class="pè"><a href="/confidencialitat">{x.confidencialitat}</a></p>
				</nav>

				<div class="dreita">{@render children()}</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Le cadre des pages intérieures, mais à hauteur d'écran : la discussion
	   défile dans sa colonne, la page ne bouge pas (pas de pied de page ici) */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100dvh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow: hidden;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.cargament {
		padding: var(--marge);
	}

	.lèu {
		max-width: 48rem;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge);
	}
	.lèu h1 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 8vw, 5.5rem);
		line-height: 0.95;
	}
	.lèu :global(.frasa) {
		margin: 0 0 var(--esp-32);
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	.cadre {
		min-height: 0;
		padding: 0 var(--marge) var(--esp-16);
		container: cadre / inline-size;
	}
	.messatjariá {
		display: grid;
		grid-template-columns: minmax(15rem, 21rem) 1fr;
		height: 100%;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: color-mix(in srgb, var(--t-fons-2) 82%, transparent);
		overflow: hidden;
	}

	/* La liste : ses groupes, du plus récemment actif au moins actif */
	.lista {
		display: flex;
		flex-direction: column;
		gap: var(--esp-12);
		min-height: 0;
		padding: var(--esp-16);
		border-right: 1px solid var(--t-linha);
		overflow-y: auto;
	}
	.cap-lista {
		display: grid;
		gap: var(--esp-12);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 2rem;
		line-height: 1;
	}
	/* ce qui se clique : le rouge du logo en aplat (règle B) */
	.crear,
	.boton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--esp-8);
		min-height: 44px;
		padding: 0.6rem 1.2rem;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
		transition: background-color 0.25s;
	}
	.crear:hover,
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton {
		justify-self: start;
		align-self: flex-start;
	}
	.lista :global(.nota) {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.començar {
		margin: var(--esp-8) 0 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.grops {
		display: grid;
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.grops a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-8);
		min-height: 48px;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		color: inherit;
		text-decoration: none;
	}
	.grops a:hover {
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}
	/* le groupe ouvert : un trait d'or, pas une couleur de clic */
	.grops a[aria-current='page'] {
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
		box-shadow: inset 3px 0 0 var(--t-aur);
	}
	.noms {
		display: grid;
		min-width: 0;
	}
	.nom {
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.nom-fr {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.estat {
		display: grid;
		justify-items: end;
		gap: 2px;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}
	.non-legits {
		min-width: 1.4rem;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: var(--t-aur);
		color: var(--t-fons);
		font-weight: 700;
		text-align: center;
	}
	.pè {
		margin: auto 0 0;
		padding-top: var(--esp-16);
		font-size: 0.85rem;
	}
	.pè a {
		color: var(--t-tinta-2);
	}

	.dreita {
		min-width: 0;
		min-height: 0;
		overflow-y: auto;
	}

	.crear:focus-visible,
	.boton:focus-visible,
	.grops a:focus-visible,
	.pè a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* téléphone : une colonne à la fois */
	@container cadre (width < 46rem) {
		.messatjariá {
			grid-template-columns: 1fr;
		}
		.lista {
			border-right: 0;
		}
		.messatjariá.dins .lista,
		.messatjariá:not(.dins) .dreita {
			display: none;
		}
	}
</style>
