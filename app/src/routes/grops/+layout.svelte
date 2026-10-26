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
	import { grops, DOBÈRTS, cargarMevas, cargarIeu, cargarContactes, respondreContacte, tancar, ora } from '$lib/grops/grops.svelte.js';
	import Avatar from '$lib/grops/Avatar.svelte';
	import Tèxte from '$lib/grops/Tèxte.svelte';

	let { data, children } = $props();
	const lèvaEdicion = iniciar('grops', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			grops: 'Grops',
			mos: 'Mos grops',
			perfil: 'Mon perfil',
			espèra: 'en espèra',
			crear: 'Tots los grops',
			començar: 'Per començar',
			connectar: 'Se connectar',
			non_legits: (n) => `${n} messatge${n > 1 ? 's' : ''} pas legit${n > 1 ? 's' : ''}`,
			confidencialitat: 'Confidencialitat',
			amassa: 'Tornar a Amassa',
			contactes: 'Mos contactes',
			vòl: 'vòl èsser en contacte',
			acceptar: 'Acceptar',
			refusar: 'Refusar',
			mandada: 'demanda mandada',
			cap_contacte: 'Per apondre un contacte, dobrís son perfil dins un grop.'
		},
		fr: {
			grops: 'Groupes',
			mos: 'Mes groupes',
			perfil: 'Mon profil',
			espèra: 'en attente',
			crear: 'Tous les groupes',
			començar: 'Pour commencer',
			connectar: 'Se connecter',
			non_legits: (n) => `${n} message${n > 1 ? 's' : ''} non lu${n > 1 ? 's' : ''}`,
			confidencialitat: 'Confidentialité',
			amassa: 'Retour à Amassa',
			contactes: 'Mes contacts',
			vòl: 'veut être en contact',
			acceptar: 'Accepter',
			refusar: 'Refuser',
			mandada: 'demande envoyée',
			cap_contacte: 'Pour ajouter un contact, ouvre son profil dans un groupe.'
		},
		es: {
			grops: 'Grupos',
			mos: 'Mis grupos',
			perfil: 'Mi perfil',
			espèra: 'pendiente',
			crear: 'Todos los grupos',
			començar: 'Para empezar',
			connectar: 'Iniciar sesión',
			non_legits: (n) => `${n} mensaje${n > 1 ? 's' : ''} sin leer`,
			confidencialitat: 'Privacidad',
			amassa: 'Volver a Reúne',
			contactes: 'Mis contactos',
			vòl: 'quiere ponerse en contacto',
			acceptar: 'Aceptar',
			refusar: 'Rechazar',
			mandada: 'solicitud enviada',
			cap_contacte: 'Para añadir un contacto, abre su perfil dentro de un grupo.'
		},
		en: {
			grops: 'Groups',
			mos: 'My groups',
			perfil: 'My profile',
			espèra: 'pending',
			crear: 'All groups',
			començar: 'To get started',
			connectar: 'Log in',
			non_legits: (n) => `${n} unread message${n > 1 ? 's' : ''}`,
			confidencialitat: 'Privacy',
			amassa: 'Back to Gather',
			contactes: 'My contacts',
			vòl: 'wants to get in touch',
			acceptar: 'Accept',
			refusar: 'Decline',
			mandada: 'request sent',
			cap_contacte: 'To add a contact, open their profile in a group.'
		},
		ca: {
			grops: 'Grups',
			mos: 'Els meus grups',
			perfil: 'El meu perfil',
			espèra: 'pendent',
			crear: 'Tots els grups',
			començar: 'Per començar',
			connectar: 'Inicia la sessió',
			non_legits: (n) => `${n} missatge${n > 1 ? 's' : ''} sense llegir`,
			confidencialitat: 'Privadesa',
			amassa: 'Torna a Reuneix',
			contactes: 'Els meus contactes',
			vòl: 'vol posar-se en contacte',
			acceptar: 'Accepta',
			refusar: 'Rebutja',
			mandada: 'sol·licitud enviada',
			cap_contacte: 'Per afegir un contacte, obre el seu perfil dins d’un grup.'
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	let uid = $derived($session?.user?.id ?? null);
	// en développement, « ?simular » montre les groupes sans compte (mise en page)
	const simular = browser && import.meta.env.DEV && new URLSearchParams(location.search).has('simular');
	let permés = $derived(DOBÈRTS || $esAdmin || simular);
	let sabut = $derived($authReady && (!$session || $adminSabut));

	$effect(() => {
		grops.admin = $esAdmin;
		grops.uid = uid;
		if (uid && permés) {
			cargarMevas();
			cargarIeu();
			cargarContactes();
		}
		else {
			tancar();
			// en développement, des contacts d'exemple pour la mise en page
			if (simular)
				grops.contactes = [
					{ user_id: 's1', pseudo: 'Joana', estat: 'recebuda', darrier_at: null, non_legits: 0 },
					{ user_id: 's2', pseudo: 'Bernat_34', estat: 'acceptat', darrier_at: new Date().toISOString(), non_legits: 2 },
					{ user_id: 's3', pseudo: 'Clara', estat: 'acceptat', darrier_at: '2026-10-20T10:00:00Z', non_legits: 0 },
					{ user_id: 's4', pseudo: 'Pèire', estat: 'mandada', darrier_at: null, non_legits: 0 }
				];
		}
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

	// une demande reçue : on répond d'ici, sans ouvrir le profil
	let respond = $state(null);
	async function respondre(c, accepta) {
		respond = c.user_id;
		await respondreContacte(c.user_id, accepta);
		respond = null;
	}

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
						<div class="titol-lista">
							<h1>{x.grops}</h1>
							{#if grops.ieu}
								<a class="ieu" href="/grops/perfil" aria-current={page.route.id === '/grops/perfil' ? 'page' : undefined}>
									<Avatar pseudo={grops.ieu.pseudo} id={uid} size="1.9rem" />
									<span>{x.perfil}{#if grops.ieu.verificacion !== 'verificat'}<small>{x.espèra}</small>{/if}</span>
								</a>
							{/if}
						</div>
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

					{#if uid || simular}
						<h2 class="començar">{x.contactes}</h2>
						{#if grops.contactes.length}
							<ul class="grops contactes">
								{#each grops.contactes as c (c.user_id)}
									<li class={c.estat}>
										{#if c.estat === 'acceptat'}
											<a href="/grops/amb/{c.pseudo}" aria-current={page.params.pseudo === c.pseudo && page.route.id?.startsWith('/grops/amb') ? 'page' : undefined}>
												<span class="qui"><Avatar pseudo={c.pseudo} id={c.user_id} size="1.9rem" /><span class="nom">{c.pseudo}</span></span>
												<span class="estat">
													{#if c.darrier_at}<time datetime={c.darrier_at}>{ora(c.darrier_at)}</time>{/if}
													{#if c.non_legits}<span class="non-legits" aria-label={x.non_legits(c.non_legits)}>{c.non_legits}</span>{/if}
												</span>
											</a>
										{:else}
											<a href="/grops/perfil/{c.pseudo}">
												<span class="qui"><Avatar pseudo={c.pseudo} id={c.user_id} size="1.9rem" /><span class="noms"><span class="nom">{c.pseudo}</span><span class="nom-fr">{c.estat === 'recebuda' ? x.vòl : x.mandada}</span></span></span>
											</a>
											{#if c.estat === 'recebuda'}
												<span class="respondre">
													<button type="button" class="pichon" disabled={respond === c.user_id} onclick={() => respondre(c, true)}>{x.acceptar}</button>
													<button type="button" class="pichon segond" disabled={respond === c.user_id} onclick={() => respondre(c, false)}>{x.refusar}</button>
												</span>
											{/if}
										{/if}
									</li>
								{/each}
							</ul>
						{:else}
							<p class="nota-contactes">{x.cap_contacte}</p>
						{/if}
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
	.titol-lista {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-8);
	}
	/* son profil : l'initiale et « Mon perfil », à côté du titre */
	.ieu {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 44px;
		padding: 0.2rem 0.6rem 0.2rem 0.2rem;
		border-radius: 999px;
		color: inherit;
		font-size: 0.85rem;
		text-decoration: none;
	}
	.ieu:hover,
	.ieu[aria-current='page'] {
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.ieu span {
		display: grid;
		line-height: 1.2;
	}
	.ieu small {
		color: var(--t-aur);
		font-weight: 700;
	}
	.ieu:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
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
	/* les contacts : l'initiale devant le pseudo ; une demande reçue garde
	   ses deux boutons sous le nom */
	.qui {
		display: flex;
		align-items: center;
		gap: var(--esp-8);
		min-width: 0;
	}
	.contactes li.mandada .nom {
		font-weight: 400;
	}
	.respondre {
		display: flex;
		gap: var(--esp-8);
		padding: 0 0.75rem 0.5rem calc(0.75rem + 1.9rem + var(--esp-8));
	}
	.pichon {
		min-height: 36px;
		padding: 0.35rem 0.9rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 0.85rem/1 var(--font-body);
		cursor: pointer;
	}
	.pichon:hover {
		background: var(--t-accion-viu);
	}
	.pichon.segond {
		background: transparent;
		color: var(--t-tinta);
		box-shadow: inset 0 0 0 1px var(--t-linha);
	}
	.pichon.segond:hover {
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}
	.pichon:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.pichon:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.nota-contactes {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
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
