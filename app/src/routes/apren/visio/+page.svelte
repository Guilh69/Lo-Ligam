<script>
	// « Corses en visio » (2026-10-24, chantier 19) : la page qui explique le
	// cours avant le calendrier (Romain : « éviter d'arriver directement sur mon
	// calendrier »). Pour qui, la méthode, le déroulé, la pratique, puis le
	// bouton vers la prise de rendez-vous. Tout se modifie sur la page ; ce qui
	// n'est pas encore écrit par Romain est caché au public (visible, estompé,
	// en édition seulement). La couleur reprend celle de la case visio de /apren.
	// Avant le calendrier, un questionnaire (Romain, 2026-10-24 : « pour me
	// permettre de bien penser le cours en amont ») : niveau, motivations,
	// langues, lieu, rythme, envies. Il part par courriel vers l'alias
	// ($lib/server/contacte.js), le site n'en garde rien ; ses libellés et ses
	// listes de réponses se modifient sur place comme le reste.
	import { enhance } from '$app/forms';
	import { editor } from '$lib/data/legal.js';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data, form } = $props();
	const lèvaEdicion = iniciar('visio', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let fr = $derived(langStore.current === 'fr');
	const RUBRICA = PLAN.find((r) => r.id === 'apren');

	let metòde = $derived(edicion.actiu || !amagat('visio.metòde.tèxt'));
	let etapas = $derived(lista('visio.debana'));
	let practica = $derived(lista('visio.practica'));

	const apondreEtapa = () => apondre('visio.debana', 'text', { oc: 'Etapa', fr: 'Étape' });
	const apondrePractica = () => apondre('visio.practica', 'text', { oc: 'Linha', fr: 'Ligne' });
	const apondreOpcion = (l) => apondre(l, 'text', { oc: 'Responsa', fr: 'Réponse' });

	// le questionnaire : une question à choix unique (rond) ou multiple (case)
	const QUESTIONS = [
		{ nom: 'nivèl', titol: 'visio.q.nivèl.titol', lista: 'visio.q.nivèls', tipe: 'radio' },
		{ nom: 'motivacions', titol: 'visio.q.motivacion.titol', lista: 'visio.q.motivacions', tipe: 'checkbox' },
		{ nom: 'lengas', titol: 'visio.q.lenga.titol', lista: 'visio.q.lengas', tipe: 'checkbox' },
		{ nom: 'ritme', titol: 'visio.q.ritme.titol', lista: 'visio.q.ritmes', tipe: 'radio' },
		{ nom: 'axes', titol: 'visio.q.axe.titol', lista: 'visio.q.axes', tipe: 'checkbox' }
	];
	const causit = (nom, clau) => [form?.[nom] ?? []].flat().includes(clau);
	let mandant = $state(false);

	const tx = {
		oc: {
			facultatiu: 'facultatiu',
			obligatòri: 'obligatòri',
			mantuna: 'mantuna responsa possibla',
			mandant: 'Mandadís…',
			error: {
				corrièl: 'Verifica ton corrièl.',
				ligams: 'Tròp de ligams dins lo messatge.',
				plafond: 'Tròp de messatges d’un còp. Torna ensajar d’aquí una ora.',
				geton: 'Las responsas son pas partidas. Torna ensajar.',
				mandadís: 'Las responsas son pas partidas. Torna ensajar, o escriu-me a :',
				pas_brancat: 'Las responsas son pas partidas. Torna ensajar, o escriu-me a :'
			}
		},
		fr: {
			facultatiu: 'facultatif',
			obligatòri: 'obligatoire',
			mantuna: 'plusieurs réponses possibles',
			mandant: 'Envoi…',
			error: {
				corrièl: 'Vérifie ton adresse électronique.',
				ligams: 'Trop de liens dans le message.',
				plafond: 'Trop de messages d’un coup. Réessaie dans une heure.',
				geton: 'Tes réponses ne sont pas parties. Réessaie.',
				mandadís: 'Tes réponses ne sont pas parties. Réessaie, ou écris-moi à :',
				pas_brancat: 'Tes réponses ne sont pas parties. Réessaie, ou écris-moi à :'
			}
		}
	};
	let x = $derived(tx[fr ? 'fr' : 'oc']);
	let error = $derived(form?.error ? (x.error[form.error] ?? x.error.mandadís) : null);
	let ambAdreça = $derived(form?.error === 'mandadís' || form?.error === 'pas_brancat');
</script>

<svelte:head>
	<title>{fr ? 'Cours en visio' : 'Corses en visio'} · Lo Ligam</title>
	<meta
		name="description"
		content="Corses d’occitan en visio amb Romain, en pichon grop o sol a sol ; lo primièr es ofèrt. Cours d’occitan en visio avec Romain, en petit groupe ou en tête-à-tête ; le premier est offert."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un occitan laissé vide montre le français, comme sur Mon ligam) -->
{#snippet t(clau)}{@const v = txt(clau)}{@const oc = !fr && v.oc.trim()}<span lang={oc ? 'oc' : 'fr'}>{@render marcat(oc ? v.oc : v.fr)}</span>{/snippet}

<!-- Le bouton de réservation : dans la page, il mène au questionnaire ; après
     l'envoi (ou « sans répondre »), au calendrier -->
{#snippet reservar(classe, vers = null)}{@const l = ligam('visio.reservar')}{@const defòra = !vers && l.defòra}<a
		class="reservar {classe}"
		href={vers ?? l.href}
		target={defòra ? '_blank' : undefined}
		rel={defòra ? 'noopener' : undefined}
		aria-describedby={defòra ? 'visio-onglet' : undefined}
		hidden={amagat('visio.reservar')}
		use:editar={'visio.reservar'}
		><span lang={fr ? 'fr' : 'oc'}>{fr ? l.fr : l.oc}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
			><path d="M2 8h12M9 3l5 5-5 5" /></svg
		></a
	>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="visio" class:ed-actiu={edicion.actiu}>
	<span id="visio-onglet" class="visually-hidden">{fr ? 'S’ouvre dans un nouvel onglet' : 'Se dobrís dins un onglet novèl'}</span>

	<nav class="camin" aria-label={fr ? 'Fil d’Ariane' : 'Camin dins lo site'}>
		<a href="/apren"><b>{RUBRICA.n}</b> {fr ? RUBRICA.fr : RUBRICA.oc}</a>
	</nav>

	<header class="eros">
		<div class="eros-tèxt">
			<h1 hidden={amagat('visio.titol')} use:editar={'visio.titol'}>{@render t('visio.titol')}</h1>
			<p class="chapeu" hidden={amagat('visio.chapeu')} use:editar={'visio.chapeu'}>{@render t('visio.chapeu')}</p>
			{@render reservar('sus-color', '#questionari')}
		</div>
		<span class="eros-picto"><Pictograma nom="visio" size="9rem" /></span>
	</header>

	<div class="cors">
		<div class="seccions">
			<section aria-labelledby="visio-qual" hidden={amagat('visio.qual.tèxt') && !edicion.actiu}>
				<h2 id="visio-qual" hidden={amagat('visio.qual.titol')} use:editar={'visio.qual.titol'}>{@render t('visio.qual.titol')}</h2>
				<p hidden={amagat('visio.qual.tèxt')} use:editar={'visio.qual.tèxt'}>{@render t('visio.qual.tèxt')}</p>
			</section>

			{#if metòde}
				<section aria-labelledby="visio-metode">
					<h2 id="visio-metode" hidden={amagat('visio.metòde.titol')} use:editar={'visio.metòde.titol'}>{@render t('visio.metòde.titol')}</h2>
					<p class="metode" hidden={amagat('visio.metòde.tèxt')} use:editar={'visio.metòde.tèxt'}>{@render t('visio.metòde.tèxt')}</p>
				</section>
			{/if}

			{#if etapas.length || edicion.actiu}
				<section aria-labelledby="visio-debana">
					<h2 id="visio-debana" hidden={amagat('visio.debana.titol')} use:editar={'visio.debana.titol'}>{@render t('visio.debana.titol')}</h2>
					<ol class="etapas">
						{#each etapas as e (e.clau)}
							<li use:editar={e.clau}>{@render t(e.clau)}</li>
						{/each}
					</ol>
					{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondreEtapa}>+ {fr ? 'Ajouter une étape' : 'Apondre una etapa'}</button>{/if}
					<p class="nota" hidden={amagat('visio.debana.nota')} use:editar={'visio.debana.nota'}>{@render t('visio.debana.nota')}</p>
				</section>
			{/if}
		</div>

		<aside class="practica" aria-labelledby="visio-practica">
			<h2 id="visio-practica" hidden={amagat('visio.practica.titol')} use:editar={'visio.practica.titol'}>{@render t('visio.practica.titol')}</h2>
			<ul>
				{#each practica as p (p.clau)}
					<li use:editar={p.clau}>{@render t(p.clau)}</li>
				{/each}
			</ul>
			{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondrePractica}>+ {fr ? 'Ajouter une ligne' : 'Apondre una linha'}</button>{/if}
			{@render reservar('sus-fons', '#questionari')}
		</aside>
	</div>

	<!-- Avant le premier cours : le questionnaire, puis le calendrier -->
	<section class="questionari" id="questionari" aria-labelledby="visio-q">
		<h2 id="visio-q" hidden={amagat('visio.q.titol')} use:editar={'visio.q.titol'}>{@render t('visio.q.titol')}</h2>
		{#if form?.mandat}
			<p class="mercé" role="status" use:editar={'visio.q.mercé'}>{@render t('visio.q.mercé')}</p>
			{@render reservar('sus-fons')}
		{:else}
			<p class="q-intro" hidden={amagat('visio.q.intro')} use:editar={'visio.q.intro'}>{@render t('visio.q.intro')}</p>
			<form
				method="POST"
				use:enhance={() => {
					mandant = true;
					return async ({ update }) => {
						await update({ reset: false, invalidateAll: false });
						mandant = false;
					};
				}}
			>
				<input type="hidden" name="geton" value={data.geton} />
				<!-- piège à robots : invisible, hors tabulation, ignoré des lecteurs d'écran -->
				<div class="piège" aria-hidden="true">
					<label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off" /></label>
				</div>

				<div class="q-duo">
					<label class="camp">
						<span><span use:editar={'visio.q.nom'}>{@render t('visio.q.nom')}</span> <small>({x.facultatiu})</small></span>
						<input type="text" name="nom" maxlength="120" autocomplete="given-name" value={form?.nom ?? ''} />
					</label>
					<label class="camp">
						<span><span use:editar={'visio.q.corrièl'}>{@render t('visio.q.corrièl')}</span> <small>({x.obligatòri})</small></span>
						<input
							type="email"
							name="corrièl"
							required
							maxlength="254"
							autocomplete="email"
							value={form?.corrièl ?? ''}
							aria-invalid={form?.error === 'corrièl' || undefined}
						/>
					</label>
				</div>

				{#each QUESTIONS as q (q.nom)}
					{@const opcions = lista(q.lista)}
					{#if opcions.length || edicion.actiu}
						<fieldset class="q-question">
							<legend>
								<span use:editar={q.titol}>{@render t(q.titol)}</span>
								{#if q.tipe === 'checkbox'}<small>({x.mantuna})</small>{/if}
							</legend>
							<div class="q-opcions">
								{#each opcions as o (o.clau)}
									<label class="q-opcion" use:editar={o.clau}>
										<input type={q.tipe} name={q.nom} value={o.clau} checked={causit(q.nom, o.clau)} />
										<span>{@render t(o.clau)}</span>
									</label>
								{/each}
								{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={() => apondreOpcion(q.lista)}
										>+ {fr ? 'Ajouter une réponse' : 'Apondre una responsa'}</button
									>{/if}
							</div>
						</fieldset>
					{/if}
				{/each}

				<label class="camp">
					<span><span use:editar={'visio.q.luòc.titol'}>{@render t('visio.q.luòc.titol')}</span> <small>({x.facultatiu})</small></span>
					<input
						type="text"
						name="luòc"
						maxlength="120"
						placeholder={fr || !txt('visio.q.luòc.exemple').oc.trim() ? txt('visio.q.luòc.exemple').fr : txt('visio.q.luòc.exemple').oc}
						value={form?.luòc ?? ''}
					/>
				</label>
				<label class="camp">
					<span><span use:editar={'visio.q.messatge'}>{@render t('visio.q.messatge')}</span> <small>({x.facultatiu})</small></span>
					<textarea name="messatge" maxlength="4000" rows="4">{form?.messatge ?? ''}</textarea>
				</label>

				{#if error}
					<p class="error" role="alert">
						{error}
						{#if ambAdreça}<a href="mailto:{editor.email}">{editor.email}</a>{/if}
					</p>
				{/if}

				<div class="q-accions">
					<button type="submit" class="reservar sus-fons" disabled={mandant}>
						{#if mandant}{x.mandant}{:else}<span use:editar={'visio.q.mandar'}>{@render t('visio.q.mandar')}</span>{/if}
					</button>
					{#if !amagat('visio.q.sens')}{@const l = ligam('visio.reservar')}<a
							class="q-sens"
							href={l.href}
							target={l.defòra ? '_blank' : undefined}
							rel={l.defòra ? 'noopener' : undefined}
							aria-describedby={l.defòra ? 'visio-onglet' : undefined}
							use:editar={'visio.q.sens'}>{@render t('visio.q.sens')}</a
						>{/if}
				</div>
				<p class="avís">
					<span use:editar={'visio.q.avís'}>{@render t('visio.q.avís')}</span>
					<a href="/confidencialitat">{fr ? 'Confidentialité' : 'Confidencialitat'}</a>
				</p>
			</form>
		{/if}
	</section>
</main>
</div>

<style>
	/* Le cadre des pages intérieures, comme /mots : fond du thème, une chaleur
	   de braise en haut à gauche, rien qui bouge ; bandeau pleine largeur */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}

	.visio {
		/* la couleur de la case visio de /apren (jeu « Charte ») */
		--visio: #b53d17;
		--visio-tinta: #fbf1e1;
		container: visio / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.camin {
		margin-bottom: var(--esp-16);
		font-size: 0.95rem;
	}
	.camin a {
		color: var(--t-tinta-2);
		text-decoration: none;
	}
	.camin a:hover {
		color: var(--t-tinta);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.camin b {
		color: var(--t-aur);
		font-weight: 700;
	}

	/* L'ouverture : la case visio en grand, avec le bouton tout de suite */
	.eros {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: var(--esp-32);
		padding: clamp(1.5rem, 4vw, 3.5rem);
		border-radius: 6px;
		background: var(--visio);
		color: var(--visio-tinta);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 7vw, 5.5rem);
		line-height: 1;
		text-transform: uppercase;
	}
	.chapeu {
		max-width: 40ch;
		margin: var(--esp-16) 0 var(--esp-32);
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
	}
	.eros-picto {
		opacity: 0.9;
	}

	/* Le bouton : crème sur la couleur, couleur d'action ailleurs (règle B) */
	.reservar {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
		min-height: 48px;
		padding: 0.8rem 1.4rem;
		border-radius: 999px;
		font-weight: 700;
		text-decoration: none;
		transition:
			transform 0.25s,
			background-color 0.25s;
	}
	.reservar svg {
		width: 1em;
		height: 1em;
		transition: transform 0.25s;
	}
	.reservar:hover svg {
		transform: translateX(4px);
	}
	.sus-color {
		background: var(--visio-tinta);
		color: var(--visio);
	}
	.sus-fons {
		margin-top: var(--esp-24);
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.sus-fons:hover {
		background: var(--t-accion-viu);
	}
	.reservar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* Le corps : les explications à gauche, la pratique à droite */
	.cors {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
		gap: var(--esp-64);
		margin-top: var(--esp-64);
	}
	.seccions {
		display: grid;
		gap: var(--esp-48);
		align-content: start;
	}
	h2 {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 2.4vw, 2rem);
		line-height: 1.15;
	}
	section p {
		max-width: 62ch;
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.6;
	}
	.metode {
		white-space: pre-line;
	}
	section :global(.aur),
	.chapeu :global(.aur) {
		color: var(--t-aur);
	}
	.etapas {
		display: grid;
		gap: var(--esp-16);
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: etapa;
	}
	.etapas li {
		position: relative;
		max-width: 60ch;
		padding-left: 3.2rem;
		font-size: 1.1rem;
		line-height: 1.55;
		counter-increment: etapa;
	}
	.etapas li::before {
		content: counter(etapa);
		position: absolute;
		left: 0;
		top: -0.1rem;
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		background: var(--visio);
		color: var(--visio-tinta);
		font-family: var(--font-heading);
		font-size: 1.1rem;
	}

	.practica {
		position: sticky;
		top: 6rem;
		align-self: start;
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	.practica ul {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.practica li {
		position: relative;
		padding-left: 1.2rem;
		line-height: 1.5;
	}
	.practica li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.6em;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--t-aur);
	}

	.ed-apondre {
		margin-top: var(--esp-12);
	}

	.nota {
		margin-top: var(--esp-24);
		padding-left: var(--esp-16);
		border-left: 3px solid var(--t-aur);
		font-style: italic;
	}

	/* Le questionnaire d'avant le premier cours */
	.questionari {
		max-width: 52rem;
		margin-top: var(--esp-96);
		padding: clamp(1.5rem, 4vw, 3rem);
		border: 1px solid var(--t-linha);
		border-top: 6px solid var(--visio);
		border-radius: 6px;
		background: var(--t-fons-2);
		scroll-margin-top: var(--esp-24);
	}
	.q-intro,
	.mercé {
		margin: 0 0 var(--esp-32);
		font-size: 1.1rem;
		line-height: 1.55;
	}
	.mercé {
		margin-bottom: var(--esp-8);
		font-weight: 700;
	}
	form {
		display: grid;
		gap: var(--esp-32);
	}
	.q-duo {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--esp-24);
	}
	.camp {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	.camp small,
	legend small {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.camp input,
	.camp textarea {
		width: 100%;
		box-sizing: border-box;
		min-height: 44px;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
	}
	.camp textarea {
		resize: vertical;
	}
	.camp input:focus-visible,
	.camp textarea:focus-visible,
	.q-opcion input:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.camp input[aria-invalid='true'] {
		border-color: var(--t-terra-viu);
	}
	.q-question {
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: var(--esp-12);
		padding: 0;
		font-weight: 700;
	}
	.q-opcions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	/* chaque réponse est une pastille qui s'allume quand on la choisit */
	.q-opcion {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		min-height: 44px;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: var(--t-fons);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}
	.q-opcion:hover {
		border-color: var(--t-aur);
	}
	.q-opcion:has(input:checked) {
		border-color: var(--visio);
		background: color-mix(in srgb, var(--visio) 18%, var(--t-fons));
	}
	.q-opcion input {
		accent-color: var(--visio);
		margin: 0;
	}
	.q-accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-16) var(--esp-24);
	}
	button.reservar {
		margin-top: 0;
		border: 0;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button.reservar:disabled {
		opacity: 0.7;
		cursor: progress;
	}
	.q-sens {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
		text-underline-offset: 3px;
	}
	.q-sens:hover {
		color: var(--t-tinta);
	}
	.error {
		margin: 0;
		color: var(--t-terra-viu);
		font-weight: 700;
	}
	.avís {
		margin: 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.avís a,
	.error a {
		color: inherit;
		text-underline-offset: 3px;
	}
	.piège {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	/* Téléphone : une seule colonne, la pratique sous les explications */
	@container visio (max-width: 760px) {
		.eros {
			grid-template-columns: 1fr;
		}
		.eros-picto {
			display: none;
		}
		.cors {
			grid-template-columns: 1fr;
			gap: var(--esp-48);
			margin-top: var(--esp-48);
		}
		.practica {
			position: static;
		}
		.q-duo {
			grid-template-columns: 1fr;
		}
		.questionari {
			margin-top: var(--esp-64);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reservar,
		.reservar svg {
			transition: none;
		}
	}
</style>
