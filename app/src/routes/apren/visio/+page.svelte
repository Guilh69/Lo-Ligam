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
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data, form } = $props();
	const lèvaEdicion = iniciar('visio', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const RUBRICA = PLAN.find((r) => r.id === 'apren');

	let metòde = $derived(edicion.actiu || !amagat('visio.metòde.tèxt'));
	let etapas = $derived(lista('visio.debana'));
	let practica = $derived(lista('visio.practica'));
	let tarifs = $derived(lista('visio.pretz.tarifs'));
	// les trois lignes de chaque carte, dans l'ordre (libellés communs aux trois)
	const LINHAS = ['un', 'mes', 'trimestre'];

	const apondreEtapa = () => apondre('visio.debana', 'text', { oc: 'Etapa', fr: 'Étape', es: 'Etapa', en: 'Step', ca: 'Etapa', ar: 'خطوة' });
	const apondrePractica = () => apondre('visio.practica', 'text', { oc: 'Linha', fr: 'Ligne', es: 'Línea', en: 'Line', ca: 'Línia', ar: 'سطر' });
	const apondreOpcion = (l) => apondre(l, 'text', { oc: 'Responsa', fr: 'Réponse', es: 'Respuesta', en: 'Answer', ca: 'Resposta', ar: 'إجابة' });

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
		},
		es: {
			facultatiu: 'opcional',
			obligatòri: 'obligatorio',
			mantuna: 'varias respuestas posibles',
			mandant: 'Enviando…',
			error: {
				corrièl: 'Revisa tu correo electrónico.',
				ligams: 'Demasiados enlaces en el mensaje.',
				plafond: 'Demasiados mensajes de golpe. Vuelve a intentarlo dentro de una hora.',
				geton: 'Tus respuestas no se han enviado. Vuelve a intentarlo.',
				mandadís: 'Tus respuestas no se han enviado. Vuelve a intentarlo, o escríbeme a:',
				pas_brancat: 'Tus respuestas no se han enviado. Vuelve a intentarlo, o escríbeme a:'
			}
		},
		en: {
			facultatiu: 'optional',
			obligatòri: 'required',
			mantuna: 'select all that apply',
			mandant: 'Sending…',
			error: {
				corrièl: 'Check your email address.',
				ligams: 'Too many links in the message.',
				plafond: 'Too many messages at once. Try again in an hour.',
				geton: 'Your answers were not sent. Please try again.',
				mandadís: 'Your answers were not sent. Please try again, or write to me at:',
				pas_brancat: 'Your answers were not sent. Please try again, or write to me at:'
			}
		},
		ca: {
			facultatiu: 'opcional',
			obligatòri: 'obligatori',
			mantuna: 'diverses respostes possibles',
			mandant: 'Enviant…',
			error: {
				corrièl: 'Revisa el teu correu electrònic.',
				ligams: 'Massa enllaços al missatge.',
				plafond: 'Massa missatges alhora. Torna-ho a provar d’aquí a una hora.',
				geton: 'Les teves respostes no s’han enviat. Torna-ho a provar.',
				mandadís: 'Les teves respostes no s’han enviat. Torna-ho a provar, o escriu-me a:',
				pas_brancat: 'Les teves respostes no s’han enviat. Torna-ho a provar, o escriu-me a:'
			}
		},
		ar: {
			facultatiu: 'اختياري',
			obligatòri: 'إلزامي',
			mantuna: 'يمكن اختيار أكثر من إجابة',
			mandant: 'جارٍ الإرسال…',
			error: {
				corrièl: 'يرجى التحقّق من بريدك الإلكتروني.',
				ligams: 'عدد الروابط في الرسالة كبير جدًا.',
				plafond: 'عدد الرسائل كبير في وقت قصير. يرجى المحاولة مرة أخرى بعد ساعة.',
				geton: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى.',
				mandadís: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى، أو مراسلتي على:',
				pas_brancat: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى، أو مراسلتي على:'
			}
		}
	};
	let x = $derived(tx[langStore.current] ?? tx.oc);
	let error = $derived(form?.error ? (x.error[form.error] ?? x.error.mandadís) : null);
	let ambAdreça = $derived(form?.error === 'mandadís' || form?.error === 'pas_brancat');
</script>

<svelte:head>
	<title>{tria({ oc: 'Corses en visio', fr: 'Cours en visio', es: 'Clases por videollamada', en: 'Video lessons', ca: 'Classes per videotrucada', ar: 'دروس عبر الفيديو' })} · Lo Ligam</title>
	<meta
		name="description"
		content="Corses d’occitan en visio amb Romain, sol a sol ; lo primièr es ofèrt. Cours d’occitan en visio avec Romain, en tête-à-tête ; le premier est offert."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={langStore.current}>{@render marcat(tria(v))}</span>{/snippet}

<!-- Le bouton de réservation : dans la page, il mène au questionnaire ; après
     l'envoi (ou « sans répondre »), au calendrier -->
{#snippet reservar(classe, vers = null)}{@const l = ligam('visio.reservar')}{@const defòra = !vers && l.defòra}<a
		class="pc pc-grand reservar {classe}"
		href={vers ?? l.href}
		target={defòra ? '_blank' : undefined}
		rel={defòra ? 'noopener' : undefined}
		aria-describedby={defòra ? 'visio-onglet' : undefined}
		hidden={amagat('visio.reservar')}
		use:editar={'visio.reservar'}
		><span lang={langStore.current}>{tria(l)}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
			><path d="M2 8h12M9 3l5 5-5 5" /></svg
		></a
	>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="visio" class:ed-actiu={edicion.actiu}>
	<span id="visio-onglet" class="visually-hidden">{tria({ oc: 'Se dobrís dins un onglet novèl', fr: 'S’ouvre dans un nouvel onglet', es: 'Se abre en una pestaña nueva', en: 'Opens in a new tab', ca: 'S’obre en una pestanya nova', ar: 'يُفتح في تبويب جديد' })}</span>

	<nav class="camin" aria-label={tria({ oc: 'Camin dins lo site', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' })}>
		<a href="/apren"><b>{RUBRICA.n}</b> {tria(RUBRICA)}</a>
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
					{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondreEtapa}>+ {tria({ oc: 'Apondre una etapa', fr: 'Ajouter une étape', es: 'Añadir una etapa', en: 'Add a step', ca: 'Afegir una etapa', ar: 'إضافة خطوة' })}</button>{/if}
					<p class="nota" hidden={amagat('visio.debana.nota')} use:editar={'visio.debana.nota'}>{@render t('visio.debana.nota')}</p>
				</section>
			{/if}

			<!-- Les prix (Romain, 2026-10-24 : grille A, solidaire sur simple déclaration) -->
			{#if tarifs.length || edicion.actiu}
				<section aria-labelledby="visio-pretz">
					<h2 id="visio-pretz" hidden={amagat('visio.pretz.titol')} use:editar={'visio.pretz.titol'}>{@render t('visio.pretz.titol')}</h2>
					<p hidden={amagat('visio.pretz.intro')} use:editar={'visio.pretz.intro'}>{@render t('visio.pretz.intro')}</p>
					<ul class="tarifs">
						{#each tarifs as b (b.clau)}
							<li class="tarif" use:editar={b.clau}>
								<h3 hidden={amagat(b.clau + '.nom')} use:editar={b.clau + '.nom'}>{@render t(b.clau + '.nom')}</h3>
								<dl>
									{#each LINHAS as l (l)}
										<div class="tarif-{l}" hidden={amagat(b.clau + '.' + l)}>
											<dt use:editar={'visio.pretz.' + l}>{@render t('visio.pretz.' + l)}</dt>
											<dd use:editar={b.clau + '.' + l}>{@render t(b.clau + '.' + l)}</dd>
										</div>
									{/each}
								</dl>
							</li>
						{/each}
					</ul>
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
			{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondrePractica}>+ {tria({ oc: 'Apondre una linha', fr: 'Ajouter une ligne', es: 'Añadir una línea', en: 'Add a line', ca: 'Afegir una línia', ar: 'إضافة سطر' })}</button>{/if}
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
										>+ {tria({ oc: 'Apondre una responsa', fr: 'Ajouter une réponse', es: 'Añadir una respuesta', en: 'Add an answer', ca: 'Afegir una resposta', ar: 'إضافة إجابة' })}</button
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
						placeholder={tria(txt('visio.q.luòc.exemple'))}
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
					<button type="submit" class="pc pc-grand reservar sus-fons" disabled={mandant}>
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
					<a href="/confidencialitat">{tria({ oc: 'Confidencialitat', fr: 'Confidentialité', es: 'Privacidad', en: 'Privacy', ca: 'Privadesa', ar: 'الخصوصية' })}</a>
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
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, var(--t-braise-or), transparent 70%),
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
		--visio: var(--t-accion);
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
	/* « Réserver » : une grande pièce de papier (lib/styles/papier.css) */
	.reservar {
		gap: 0.6em;
		min-height: 48px;
		padding: 0.8rem 1.4rem;
	}
	.reservar svg {
		width: 1em;
		height: 1em;
		transition: transform 0.25s;
	}
	.reservar:hover svg {
		transform: translateX(4px);
	}
	/* sur l'aplat de couleur de l'en-tête : la pièce prend les couleurs inversées */
	.sus-color {
		--pc-fons: var(--visio-tinta);
		--pc-tinta: var(--visio);
	}
	.sus-fons {
		margin-top: var(--esp-24);
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

	/* Les prix : trois cartes, le prix du cours en grand, les deux formules dessous */
	.tarifs {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--esp-16);
		margin: var(--esp-24) 0 0;
		padding: 0;
		list-style: none;
	}
	.tarif {
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-top: 4px solid var(--visio);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	.tarif h3 {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.35rem;
	}
	.tarif dl {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
	}
	.tarif dl > div {
		display: flex;
		flex-direction: column-reverse;
	}
	.tarif dt {
		font-size: 0.9rem;
		opacity: 0.8;
	}
	.tarif dd {
		margin: 0;
		font-weight: 700;
		font-size: 1.15rem;
		font-variant-numeric: tabular-nums;
	}
	.tarif .tarif-un dd {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 2.4rem;
		line-height: 1.1;
		color: var(--t-aur);
	}
	.tarif .tarif-un {
		padding-bottom: var(--esp-12);
		border-bottom: 1px solid var(--t-linha);
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
	/* les trois cartes de prix l'une sous l'autre sur téléphone */
	@container visio (max-width: 560px) {
		.tarifs {
			grid-template-columns: 1fr;
		}
		.tarif {
			padding: var(--esp-16) var(--esp-24);
		}
		/* le prix du cours sur toute la largeur, les deux formules côte à côte */
		.tarif dl {
			grid-template-columns: 1fr 1fr;
			gap: var(--esp-12) var(--esp-16);
		}
		.tarif .tarif-un {
			grid-column: 1 / -1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reservar svg {
			transition: none;
		}
	}
</style>
