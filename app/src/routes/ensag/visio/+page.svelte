<script>
	// « Corses en visio », version « une action par écran » (2026-11-15, charte
	// §5quater ; Romain : « les gens n'ont pas beaucoup d'attention… une action
	// par interface », et la page d'avant « avec une note très IA »).
	//  - L'accueil de la page : le titre, une phrase, un seul bouton. Le détail
	//    (pour qui, méthode, déroulé, prix, pratique) est replié dessous, en
	//    lignes séparées par des filets fins : rien d'encadré.
	//  - Le bouton ouvre le questionnaire, une question par écran (Romain garde
	//    les neuf, 15-11), puis le calendrier.
	// Sans JavaScript, ou en mode Editar, tout s'affiche d'un bloc, comme avant :
	// le formulaire part de la même façon (mêmes noms de champs, même serveur).
	import { tick } from 'svelte';
	import { enhance } from '$app/forms';
	import { editor } from '$lib/data/legal.js';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Retour from '$lib/components/Retour.svelte';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data, form } = $props();
	const lèvaEdicion = iniciar('visio', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let metòde = $derived(edicion.actiu || !amagat('visio.metòde.tèxt'));
	let etapasCors = $derived(lista('visio.debana'));
	let practica = $derived(lista('visio.practica'));
	let tarifs = $derived(lista('visio.pretz.tarifs'));
	// les trois lignes du tableau des prix (libellés communs aux trois formules)
	const LINHAS = ['un', 'mes', 'trimestre'];

	const apondreEtapa = () => apondre('visio.debana', 'text', { oc: 'Etapa', fr: 'Étape', es: 'Etapa', en: 'Step', ca: 'Etapa', ar: 'خطوة' });
	const apondrePractica = () => apondre('visio.practica', 'text', { oc: 'Linha', fr: 'Ligne', es: 'Línea', en: 'Line', ca: 'Línia', ar: 'سطر' });
	const apondreOpcion = (l) => apondre(l, 'text', { oc: 'Responsa', fr: 'Réponse', es: 'Respuesta', en: 'Answer', ca: 'Resposta', ar: 'إجابة' });

	// les questions à choix, dans l'ordre des écrans
	const CAUSIDAS = [
		{ nom: 'nivèl', titol: 'visio.q.nivèl.titol', lista: 'visio.q.nivèls', tipe: 'radio' },
		{ nom: 'motivacions', titol: 'visio.q.motivacion.titol', lista: 'visio.q.motivacions', tipe: 'checkbox' },
		{ nom: 'lengas', titol: 'visio.q.lenga.titol', lista: 'visio.q.lengas', tipe: 'checkbox' },
		{ nom: 'ritme', titol: 'visio.q.ritme.titol', lista: 'visio.q.ritmes', tipe: 'radio' },
		{ nom: 'axes', titol: 'visio.q.axe.titol', lista: 'visio.q.axes', tipe: 'checkbox' }
	];
	// les écrans du questionnaire : une question à choix sans réponse possible
	// (liste vide) n'a pas d'écran ; le lieu, le message, puis le contact
	let ecrans = $derived([
		...CAUSIDAS.filter((q) => edicion.actiu || lista(q.lista).length).map((q) => ({ id: q.nom, causida: q })),
		{ id: 'luòc' },
		{ id: 'messatge' },
		{ id: 'contacte' }
	]);

	// les réponses : gardées d'un écran à l'autre (et rendues par le serveur en cas d'erreur)
	const prem = (v) => [v ?? []].flat()[0] ?? '';
	const totas = (v) => [v ?? []].flat();
	const inicial = () => ({
		nivèl: prem(form?.nivèl),
		motivacions: totas(form?.motivacions),
		lengas: totas(form?.lengas),
		ritme: prem(form?.ritme),
		axes: totas(form?.axes),
		luòc: form?.luòc ?? '',
		messatge: form?.messatge ?? '',
		nom: form?.nom ?? '',
		corrièl: form?.corrièl ?? ''
	});
	let respostas = $state(inicial());
	const respondut = (id) => {
		const v = respostas[id];
		return Array.isArray(v) ? v.length > 0 : String(v ?? '').trim() !== '';
	};

	// pas à pas seulement quand JavaScript tourne et hors du mode Editar
	let js = $state(false);
	$effect(() => {
		js = true;
	});
	let pasAPas = $derived(js && !edicion.actiu);
	// 0 : l'accueil de la page ; 1 à n : les écrans du questionnaire
	let etapa = $state(0);
	let mandant = $state(false);

	async function anar(n) {
		etapa = Math.max(0, Math.min(n, ecrans.length));
		await tick();
		window.scrollTo({ top: 0 });
		document.getElementById(etapa ? `ecran-${etapa}` : 'visio-titol')?.focus({ preventScroll: true });
	}
	function començar(ev) {
		if (!pasAPas) return; // sans JavaScript : l'ancre mène au questionnaire
		ev.preventDefault();
		anar(1);
	}
	// Entrée sur une réponse ou dans le lieu : écran suivant, pas d'envoi avant la fin
	function entrada(ev) {
		if (!pasAPas || ev.key !== 'Enter') return;
		if (etapa < ecrans.length) {
			ev.preventDefault();
			anar(etapa + 1);
		}
	}

	const tx = {
		oc: { facultatiu: 'facultatiu', obligatòri: 'obligatòri', mantuna: 'mantuna responsa possibla', mandant: 'Mandadís…', seguent: 'Seguent', passar: 'Passar', tornar: 'Tornar', contacte: 'Per te respondre', question: (n, t) => `Question ${n} sus ${t}`,
			error: { corrièl: 'Verifica ton corrièl.', ligams: 'Tròp de ligams dins lo messatge.', plafond: 'Tròp de messatges d’un còp. Torna ensajar d’aquí una ora.', geton: 'Las responsas son pas partidas. Torna ensajar.', mandadís: 'Las responsas son pas partidas. Torna ensajar, o escriu-me a :', pas_brancat: 'Las responsas son pas partidas. Torna ensajar, o escriu-me a :' } },
		fr: { facultatiu: 'facultatif', obligatòri: 'obligatoire', mantuna: 'plusieurs réponses possibles', mandant: 'Envoi…', seguent: 'Suivant', passar: 'Passer', tornar: 'Retour', contacte: 'Pour te répondre', question: (n, t) => `Question ${n} sur ${t}`,
			error: { corrièl: 'Vérifie ton adresse électronique.', ligams: 'Trop de liens dans le message.', plafond: 'Trop de messages d’un coup. Réessaie dans une heure.', geton: 'Tes réponses ne sont pas parties. Réessaie.', mandadís: 'Tes réponses ne sont pas parties. Réessaie, ou écris-moi à :', pas_brancat: 'Tes réponses ne sont pas parties. Réessaie, ou écris-moi à :' } },
		es: { facultatiu: 'opcional', obligatòri: 'obligatorio', mantuna: 'varias respuestas posibles', mandant: 'Enviando…', seguent: 'Siguiente', passar: 'Saltar', tornar: 'Volver', contacte: 'Para responderte', question: (n, t) => `Pregunta ${n} de ${t}`,
			error: { corrièl: 'Revisa tu correo electrónico.', ligams: 'Demasiados enlaces en el mensaje.', plafond: 'Demasiados mensajes de golpe. Vuelve a intentarlo dentro de una hora.', geton: 'Tus respuestas no se han enviado. Vuelve a intentarlo.', mandadís: 'Tus respuestas no se han enviado. Vuelve a intentarlo, o escríbeme a:', pas_brancat: 'Tus respuestas no se han enviado. Vuelve a intentarlo, o escríbeme a:' } },
		en: { facultatiu: 'optional', obligatòri: 'required', mantuna: 'select all that apply', mandant: 'Sending…', seguent: 'Next', passar: 'Skip', tornar: 'Back', contacte: 'So I can reply', question: (n, t) => `Question ${n} of ${t}`,
			error: { corrièl: 'Check your email address.', ligams: 'Too many links in the message.', plafond: 'Too many messages at once. Try again in an hour.', geton: 'Your answers were not sent. Please try again.', mandadís: 'Your answers were not sent. Please try again, or write to me at:', pas_brancat: 'Your answers were not sent. Please try again, or write to me at:' } },
		ca: { facultatiu: 'opcional', obligatòri: 'obligatori', mantuna: 'diverses respostes possibles', mandant: 'Enviant…', seguent: 'Següent', passar: 'Saltar', tornar: 'Tornar', contacte: 'Per respondre’t', question: (n, t) => `Pregunta ${n} de ${t}`,
			error: { corrièl: 'Revisa el teu correu electrònic.', ligams: 'Massa enllaços al missatge.', plafond: 'Massa missatges alhora. Torna-ho a provar d’aquí a una hora.', geton: 'Les teves respostes no s’han enviat. Torna-ho a provar.', mandadís: 'Les teves respostes no s’han enviat. Torna-ho a provar, o escriu-me a:', pas_brancat: 'Les teves respostes no s’han enviat. Torna-ho a provar, o escriu-me a:' } },
		ar: { facultatiu: 'اختياري', obligatòri: 'إلزامي', mantuna: 'يمكن اختيار أكثر من إجابة', mandant: 'جارٍ الإرسال…', seguent: 'التالي', passar: 'تخطٍّ', tornar: 'رجوع', contacte: 'لكي أردّ عليك', question: (n, t) => `السؤال ${n} من ${t}`,
			error: { corrièl: 'يرجى التحقّق من بريدك الإلكتروني.', ligams: 'عدد الروابط في الرسالة كبير جدًا.', plafond: 'عدد الرسائل كبير في وقت قصير. يرجى المحاولة مرة أخرى بعد ساعة.', geton: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى.', mandadís: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى، أو مراسلتي على:', pas_brancat: 'لم يتم إرسال إجاباتك. يرجى المحاولة مرة أخرى، أو مراسلتي على:' } }
	};
	let x = $derived(tx[langStore.current] ?? tx.oc);
	let error = $derived(form?.error ? (x.error[form.error] ?? x.error.mandadís) : null);
	let ambAdreça = $derived(form?.error === 'mandadís' || form?.error === 'pas_brancat');

	// ce qui se voit : l'accueil, le questionnaire, ou le merci
	let mercé = $derived(!!form?.mandat);
	let veireAcuèlh = $derived(!mercé && (!pasAPas || etapa === 0));
	let veireQuestionari = $derived(!mercé && (!pasAPas || etapa > 0));
	const visible = (i) => !pasAPas || etapa === i + 1;
</script>

<svelte:head>
	<title>{tria({ oc: 'Corses en visio', fr: 'Cours en visio', es: 'Clases por videollamada', en: 'Video lessons', ca: 'Classes per videotrucada', ar: 'دروس عبر الفيديو' })} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={langStore.current}>{@render marcat(tria(v))}</span>{/snippet}

<!-- la flèche des boutons qui avancent -->
{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg>{/snippet}

<!-- Le bouton de réservation : sur l'accueil il ouvre le questionnaire ; au
     merci, il mène au calendrier (son texte et son lien se modifient ici) -->
{#snippet reservar(vers = null, onclick = undefined)}{@const l = ligam('visio.reservar')}{@const defòra = !vers && l.defòra}<a
		class="pc pc-grand reservar"
		href={vers ?? l.href}
		target={defòra ? '_blank' : undefined}
		rel={defòra ? 'noopener' : undefined}
		aria-describedby={defòra ? 'visio-onglet' : undefined}
		hidden={amagat('visio.reservar')}
		{onclick}
		use:editar={'visio.reservar'}
		><span lang={langStore.current}>{tria(l)}</span>{@render sageta()}</a
	>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="visio" class:ed-actiu={edicion.actiu} class:pas-a-pas={pasAPas && etapa > 0}>
	<span id="visio-onglet" class="visually-hidden">{tria({ oc: 'Se dobrís dins un onglet novèl', fr: 'S’ouvre dans un nouvel onglet', es: 'Se abre en una pestaña nueva', en: 'Opens in a new tab', ca: 'S’obre en una pestanya nova', ar: 'يُفتح في تبويب جديد' })}</span>

	{#if mercé}
		<!-- Après l'envoi : un merci, et le calendrier -->
		<section class="merce" aria-labelledby="visio-merce">
			<h1 id="visio-merce" tabindex="-1" use:editar={'visio.q.mercé'}>{@render t('visio.q.mercé')}</h1>
			{@render reservar()}
		</section>
	{/if}

	{#if veireAcuèlh}
		<Retour chemin="/apren/visio" />

		<!-- Sur ordinateur : le texte à gauche, la photo à droite ; sur téléphone,
		     la photo vient sous le bouton (Romain, 15-11 : « une belle photo
		     d'Occitanie » ; la page n'est plus calée à gauche) -->
		<div class="entrada">
		<!-- L'accueil : le titre, une phrase, un bouton -->
		<header class="cap">
			<h1 id="visio-titol" tabindex="-1" hidden={amagat('visio.titol')} use:editar={'visio.titol'}>{@render t('visio.titol')}</h1>
			<p class="chapeu" hidden={amagat('visio.chapeu')} use:editar={'visio.chapeu'}>{@render t('visio.chapeu')}</p>
			{@render reservar('#questionari', començar)}
		</header>

		<!-- Une photo de Romain (Remira, Paisatges) : le pic Saint-Loup par une arche en ruine -->
		<figure class="foto">
			<img
				src="/apren/paisatges/arcada-800.webp"
				srcset="/apren/paisatges/arcada-800.webp 800w, /apren/paisatges/arcada-1600.webp 1600w"
				sizes="(min-width: 60rem) 30rem, 100vw"
				width="1600"
				height="2133"
				decoding="async"
				alt={tria({ oc: 'Un puèg vist per una arcada de pèira en roïna, sus la garriga.', fr: 'Le pic Saint-Loup vu à travers une arche de pierre en ruine, au-dessus de la garrigue.', es: 'El pico de Saint-Loup visto a través de un arco de piedra en ruinas, sobre la garriga.', en: 'The Pic Saint-Loup seen through a ruined stone arch, above the garrigue.', ca: 'El pic Saint-Loup vist a través d’un arc de pedra en ruïnes, sobre la garriga.', ar: 'قمة سان لو كما تبدو عبر قوس حجري متهدّم فوق أحراش الغاريغ.' })}
			/>
		</figure>

		<!-- Le détail, replié : une ligne par sujet, séparées par des filets -->
		<div class="plecs">
			{#if !amagat('visio.qual.tèxt') || edicion.actiu}
				<details open={edicion.actiu || undefined}>
					<summary><span hidden={amagat('visio.qual.titol')} use:editar={'visio.qual.titol'}>{@render t('visio.qual.titol')}</span></summary>
					<div class="plec">
						<p hidden={amagat('visio.qual.tèxt')} use:editar={'visio.qual.tèxt'}>{@render t('visio.qual.tèxt')}</p>
					</div>
				</details>
			{/if}

			{#if metòde}
				<details open={edicion.actiu || undefined}>
					<summary><span hidden={amagat('visio.metòde.titol')} use:editar={'visio.metòde.titol'}>{@render t('visio.metòde.titol')}</span></summary>
					<div class="plec">
						<p class="metode" hidden={amagat('visio.metòde.tèxt')} use:editar={'visio.metòde.tèxt'}>{@render t('visio.metòde.tèxt')}</p>
					</div>
				</details>
			{/if}

			{#if etapasCors.length || edicion.actiu}
				<details open={edicion.actiu || undefined}>
					<summary><span hidden={amagat('visio.debana.titol')} use:editar={'visio.debana.titol'}>{@render t('visio.debana.titol')}</span></summary>
					<div class="plec">
						<ol class="debana">
							{#each etapasCors as e (e.clau)}
								<li use:editar={e.clau}>{@render t(e.clau)}</li>
							{/each}
						</ol>
						{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondreEtapa}>+ {tria({ oc: 'Apondre una etapa', fr: 'Ajouter une étape', es: 'Añadir una etapa', en: 'Add a step', ca: 'Afegir una etapa', ar: 'إضافة خطوة' })}</button>{/if}
						<p class="nota" hidden={amagat('visio.debana.nota')} use:editar={'visio.debana.nota'}>{@render t('visio.debana.nota')}</p>
					</div>
				</details>
			{/if}

			<!-- Les prix (Romain, 2026-10-24 : grille A, solidaire sur simple déclaration) -->
			{#if tarifs.length || edicion.actiu}
				<details open={edicion.actiu || undefined}>
					<summary><span hidden={amagat('visio.pretz.titol')} use:editar={'visio.pretz.titol'}>{@render t('visio.pretz.titol')}</span></summary>
					<div class="plec">
						<p hidden={amagat('visio.pretz.intro')} use:editar={'visio.pretz.intro'}>{@render t('visio.pretz.intro')}</p>
						<table class="pretz">
							<thead>
								<tr>
									<td></td>
									{#each tarifs as b (b.clau)}
										<th scope="col" use:editar={b.clau + '.nom'}>{@render t(b.clau + '.nom')}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each LINHAS as l (l)}
									<tr class="linha-{l}">
										<th scope="row" use:editar={'visio.pretz.' + l}>{@render t('visio.pretz.' + l)}</th>
										{#each tarifs as b (b.clau)}
											<td use:editar={b.clau + '.' + l}>{#if !amagat(b.clau + '.' + l)}{@render t(b.clau + '.' + l)}{/if}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</details>
			{/if}

			{#if practica.length || edicion.actiu}
				<details open={edicion.actiu || undefined}>
					<summary><span hidden={amagat('visio.practica.titol')} use:editar={'visio.practica.titol'}>{@render t('visio.practica.titol')}</span></summary>
					<div class="plec">
						<ul class="practica">
							{#each practica as p (p.clau)}
								<li use:editar={p.clau}>{@render t(p.clau)}</li>
							{/each}
						</ul>
						{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={apondrePractica}>+ {tria({ oc: 'Apondre una linha', fr: 'Ajouter une ligne', es: 'Añadir una línea', en: 'Add a line', ca: 'Afegir una línia', ar: 'إضافة سطر' })}</button>{/if}
					</div>
				</details>
			{/if}
		</div>
		</div>
	{/if}

	<!-- Le questionnaire : une question par écran (tout d'un bloc sans JavaScript ou en mode Editar) -->
	<section class="questionari" id="questionari" aria-labelledby={pasAPas ? undefined : 'visio-q'} hidden={!veireQuestionari}>
		{#if pasAPas}
			<div class="barra">
				<button type="button" class="tornar" onclick={() => anar(etapa - 1)}>
					<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
					{x.tornar}
				</button>
				<span class="compte" aria-hidden="true">{etapa} / {ecrans.length}</span>
			</div>
			<div class="progres" aria-hidden="true"><span style:width="{(etapa / ecrans.length) * 100}%"></span></div>
		{:else}
			<h2 id="visio-q" hidden={amagat('visio.q.titol')} use:editar={'visio.q.titol'}>{@render t('visio.q.titol')}</h2>
			<p class="q-intro" hidden={amagat('visio.q.intro')} use:editar={'visio.q.intro'}>{@render t('visio.q.intro')}</p>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				mandant = true;
				return async ({ update }) => {
					await update({ reset: false, invalidateAll: false });
					mandant = false;
					// une erreur se lit sur le dernier écran, celui du contact
					if (form?.error && pasAPas) anar(ecrans.length);
					else if (form?.mandat) {
						await tick();
						window.scrollTo({ top: 0 });
						document.getElementById('visio-merce')?.focus({ preventScroll: true });
					}
				};
			}}
		>
			<input type="hidden" name="geton" value={data.geton} />
			<!-- piège à robots : invisible, hors tabulation, ignoré des lecteurs d'écran -->
			<div class="piège" aria-hidden="true">
				<label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off" /></label>
			</div>

			{#each ecrans as e, i (e.id)}
				{@const n = i + 1}
				{@const darrièr = n === ecrans.length}
				<div class="ecran" hidden={!visible(i)}>
					{#if e.causida}
						{@const q = e.causida}
						<fieldset aria-describedby={q.tipe === 'checkbox' ? `mantuna-${q.nom}` : undefined}>
							<legend id="ecran-{n}" tabindex="-1">
								{#if pasAPas}<span class="visually-hidden">{x.question(n, ecrans.length)} :</span>{/if}
								<span use:editar={q.titol}>{@render t(q.titol)}</span>
							</legend>
							{#if q.tipe === 'checkbox'}<p class="mantuna" id="mantuna-{q.nom}">{x.mantuna}</p>{/if}
							<div class="opcions">
								{#each lista(q.lista) as o (o.clau)}
									<label class="opcion opcion-{q.tipe}" use:editar={o.clau}>
										{#if q.tipe === 'radio'}
											<input type="radio" name={q.nom} value={o.clau} bind:group={respostas[q.nom]} onkeydown={entrada} />
										{:else}
											<input type="checkbox" name={q.nom} value={o.clau} bind:group={respostas[q.nom]} onkeydown={entrada} />
										{/if}
										<span class="marca" aria-hidden="true"></span>
										<span class="opcion-tèxt">{@render t(o.clau)}</span>
									</label>
								{/each}
								{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={() => apondreOpcion(q.lista)}
										>+ {tria({ oc: 'Apondre una responsa', fr: 'Ajouter une réponse', es: 'Añadir una respuesta', en: 'Add an answer', ca: 'Afegir una resposta', ar: 'إضافة إجابة' })}</button
									>{/if}
							</div>
						</fieldset>
					{:else if e.id === 'luòc'}
						<label class="camp">
							<span class="camp-titol" id="ecran-{n}" tabindex="-1">
								{#if pasAPas}<span class="visually-hidden">{x.question(n, ecrans.length)} :</span>{/if}
								<span use:editar={'visio.q.luòc.titol'}>{@render t('visio.q.luòc.titol')}</span>
							</span>
							<small>{x.facultatiu}</small>
							<input type="text" name="luòc" maxlength="120" placeholder={tria(txt('visio.q.luòc.exemple'))} bind:value={respostas.luòc} onkeydown={entrada} />
						</label>
					{:else if e.id === 'messatge'}
						<label class="camp">
							<span class="camp-titol" id="ecran-{n}" tabindex="-1">
								{#if pasAPas}<span class="visually-hidden">{x.question(n, ecrans.length)} :</span>{/if}
								<span use:editar={'visio.q.messatge'}>{@render t('visio.q.messatge')}</span>
							</span>
							<small>{x.facultatiu}</small>
							<textarea name="messatge" maxlength="4000" rows="5" bind:value={respostas.messatge}></textarea>
						</label>
					{:else}
						<!-- le dernier écran : le prénom et l'adresse, puis l'envoi -->
						<div class="contacte">
							<p class="camp-titol" id="ecran-{n}" tabindex="-1">
								{#if pasAPas}<span class="visually-hidden">{x.question(n, ecrans.length)} :</span>{/if}
								{x.contacte}
							</p>
							<label class="camp">
								<span><span use:editar={'visio.q.nom'}>{@render t('visio.q.nom')}</span> <small>({x.facultatiu})</small></span>
								<input type="text" name="nom" maxlength="120" autocomplete="given-name" bind:value={respostas.nom} />
							</label>
							<label class="camp">
								<span><span use:editar={'visio.q.corrièl'}>{@render t('visio.q.corrièl')}</span> <small>({x.obligatòri})</small></span>
								<input
									type="email"
									name="corrièl"
									required
									maxlength="254"
									autocomplete="email"
									bind:value={respostas.corrièl}
									aria-invalid={form?.error === 'corrièl' || undefined}
								/>
							</label>
						</div>
					{/if}

					{#if pasAPas || darrièr}
						<div class="accions">
							{#if darrièr}
								{#if error}
									<p class="error" role="alert">
										{error}
										{#if ambAdreça}<a href="mailto:{editor.email}">{editor.email}</a>{/if}
									</p>
								{/if}
								<button type="submit" class="pc pc-grand reservar" disabled={mandant}>
									{#if mandant}{x.mandant}{:else}<span use:editar={'visio.q.mandar'}>{@render t('visio.q.mandar')}</span>{@render sageta()}{/if}
								</button>
								<p class="avís">
									<span use:editar={'visio.q.avís'}>{@render t('visio.q.avís')}</span>
									<a href="/confidencialitat">{tria({ oc: 'Confidencialitat', fr: 'Confidentialité', es: 'Privacidad', en: 'Privacy', ca: 'Privadesa', ar: 'الخصوصية' })}</a>
								</p>
							{:else}
								<button type="button" class="pc pc-grand reservar" onclick={() => anar(n + 1)}>
									<span>{respondut(e.id) ? x.seguent : x.passar}</span>{@render sageta()}
								</button>
							{/if}
							{#if (pasAPas ? n === 1 : darrièr) && !amagat('visio.q.sens')}{@const l = ligam('visio.reservar')}<a
									class="sens"
									href={l.href}
									target={l.defòra ? '_blank' : undefined}
									rel={l.defòra ? 'noopener' : undefined}
									aria-describedby={l.defòra ? 'visio-onglet' : undefined}
									use:editar={'visio.q.sens'}>{@render t('visio.q.sens')}</a
								>{/if}
						</div>
					{/if}
				</div>
			{/each}
		</form>
	</section>
</main>
</div>

<style>
	/* Le cadre des pages intérieures (comme PaginaSimpla) : fond du thème, une
	   chaleur de braise en haut, rien qui bouge */
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
	[tabindex='-1']:focus {
		outline: none;
	}

	/* L'accueil : sur téléphone, le titre, la photo, le détail, l'un sous
	   l'autre ; sur ordinateur, le texte à gauche et la photo à droite, qui
	   reste en vue pendant qu'on ouvre les lignes */
	.entrada {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'cap' 'foto' 'plecs';
	}
	.cap {
		grid-area: cap;
		margin-bottom: var(--esp-48);
	}
	.foto {
		grid-area: foto;
		margin: 0 0 var(--esp-48);
	}
	.foto img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: 50% 42%;
		border-radius: 6px;
	}
	@media (min-width: 60rem) {
		.entrada {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
			grid-template-rows: auto 1fr;
			grid-template-areas: 'cap foto' 'plecs foto';
			column-gap: clamp(3rem, 6vw, 6rem);
		}
		.cap {
			margin-bottom: var(--esp-64);
		}
		.foto {
			position: sticky;
			top: var(--esp-32);
			align-self: start;
			margin: 0;
		}
		.foto img {
			aspect-ratio: 3 / 4;
			max-height: calc(100vh - 4rem);
		}
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3rem, 9vw, 7rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
		/* un mot long (« videotrucada » en catalan) ne sort jamais de la page (note 127, 12-11) */
		overflow-wrap: break-word;
		hyphens: auto;
	}
	.chapeu {
		max-width: 40ch;
		margin: var(--esp-24) 0 var(--esp-32);
		font-size: clamp(1.15rem, 1.7vw, 1.4rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	/* Le bouton : la pièce de papier brique du site (lib/styles/papier.css) */
	.reservar {
		gap: 0.6em;
		min-height: 52px;
		padding: 0.85rem 1.6rem;
	}
	.reservar :global(svg) {
		width: 1em;
		height: 1em;
		transition: transform 0.25s;
	}
	.reservar:hover :global(svg) {
		transform: translateX(4px);
	}

	/* Le détail replié : des lignes, des filets fins, rien d'encadré */
	.plecs {
		grid-area: plecs;
		border-bottom: 1px solid var(--t-linha);
	}
	details {
		border-top: 1px solid var(--t-linha);
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-16);
		min-height: 44px;
		padding: var(--esp-16) 0;
		font-size: 1.15rem;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	/* un plus fin qui devient un moins */
	summary::after {
		content: '';
		flex: none;
		width: 14px;
		height: 14px;
		background:
			linear-gradient(currentColor, currentColor) center / 100% 1.5px no-repeat,
			linear-gradient(currentColor, currentColor) center / 1.5px 100% no-repeat;
		color: var(--t-aur);
		transition: transform 0.25s;
	}
	details[open] > summary::after {
		background: linear-gradient(currentColor, currentColor) center / 100% 1.5px no-repeat;
	}
	summary:hover {
		color: var(--t-aur);
	}
	summary:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.plec {
		padding: 0 0 var(--esp-32);
		max-width: 62ch;
		line-height: 1.6;
	}
	.plec p {
		margin: 0 0 var(--esp-16);
	}
	.plec > :last-child {
		margin-bottom: 0;
	}
	/* le déroulé : les numéros en ocre, sans rond */
	.debana {
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: etapa;
	}
	.debana li {
		display: grid;
		grid-template-columns: 2.2rem 1fr;
		padding: var(--esp-8) 0;
		counter-increment: etapa;
	}
	.debana li::before {
		content: counter(etapa);
		font-family: var(--font-heading);
		font-size: 1.3rem;
		line-height: 1.2;
		color: var(--t-aur);
	}
	.plec .nota {
		margin-top: var(--esp-16);
		font-style: italic;
		color: var(--t-tinta-2);
	}
	/* les prix : un tableau, des filets entre les lignes */
	.pretz {
		width: 100%;
		margin-top: var(--esp-8);
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}
	.pretz th,
	.pretz td {
		padding: var(--esp-12) var(--esp-8);
		text-align: right;
		vertical-align: baseline;
	}
	.pretz thead th {
		font-weight: 700;
		color: var(--t-aur);
	}
	.pretz tbody tr {
		border-top: 1px solid var(--t-linha);
	}
	.pretz tbody th {
		padding-left: 0;
		text-align: left;
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.pretz .linha-un td {
		font-family: var(--font-heading);
		font-size: 1.6rem;
		line-height: 1.1;
	}
	/* la pratique : un trait d'ocre devant chaque ligne */
	.practica {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.practica li {
		position: relative;
		padding: var(--esp-8) 0 var(--esp-8) 1.4rem;
	}
	.practica li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 1.15em;
		width: 0.7rem;
		height: 1.5px;
		background: var(--t-aur);
	}
	.ed-apondre {
		margin-top: var(--esp-12);
	}

	/* Le questionnaire */
	.questionari {
		max-width: 40rem;
		margin-top: var(--esp-96);
		scroll-margin-top: var(--esp-24);
	}
	/* une question à la fois : au milieu de la page, plus calée à gauche */
	.pas-a-pas .questionari {
		margin-top: 0;
		margin-inline: auto;
	}
	.questionari h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 4vw, 2.8rem);
		line-height: 1.05;
	}
	.q-intro {
		margin: var(--esp-16) 0 var(--esp-48);
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--t-tinta-2);
	}
	/* en haut de chaque écran : revenir, où l'on en est, un filet qui se remplit */
	.barra {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tornar {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: 700 1rem/1 var(--font-body);
		cursor: pointer;
	}
	.tornar svg {
		width: 14px;
		height: 14px;
	}
	.tornar:hover {
		color: var(--t-tinta);
	}
	.tornar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.compte {
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}
	.progres {
		height: 1px;
		margin: var(--esp-8) 0 var(--esp-64);
		background: var(--t-linha);
	}
	.progres span {
		display: block;
		height: 3px;
		margin-top: -1px;
		background: var(--t-aur);
		transition: width 0.4s ease;
	}

	form {
		display: grid;
		gap: var(--esp-48);
	}
	.pas-a-pas form {
		gap: 0;
	}
	/* chaque écran arrive doucement */
	.pas-a-pas .ecran:not([hidden]) {
		animation: arribar 0.35s ease both;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
		min-width: 0;
	}
	/* la question, en grand : c'est tout l'écran */
	legend,
	.camp-titol {
		display: block;
		margin: 0;
		padding: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		/* hors pas à pas (sans JavaScript, Editar), les questions restent plus petites */
		font-size: clamp(1.4rem, 2.6vw, 1.8rem);
		line-height: 1.1;
		color: var(--t-tinta);
	}
	.pas-a-pas legend,
	.pas-a-pas .camp-titol {
		font-size: clamp(1.7rem, 4vw, 2.6rem);
	}
	.mantuna,
	.camp small {
		margin: var(--esp-8) 0 0;
		font-size: 0.95rem;
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	/* les réponses : des lignes séparées par des filets, une marque à gauche */
	.opcions {
		margin-top: var(--esp-24);
		border-bottom: 1px solid var(--t-linha);
	}
	.opcion {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--esp-16);
		min-height: 56px;
		padding: var(--esp-12) 0;
		border-top: 1px solid var(--t-linha);
		font-size: 1.15rem;
		cursor: pointer;
	}
	.opcion input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		margin: 0;
	}
	.marca {
		flex: none;
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border: 1.5px solid var(--t-tinta-2);
		border-radius: 2px;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}
	.opcion-radio .marca {
		border-radius: 50%;
	}
	.opcion:hover .marca {
		border-color: var(--t-aur);
	}
	/* une réponse choisie est mise en valeur : l'or (règle B), lisible sur les deux fonds */
	.opcion:has(input:checked) .marca {
		border-color: var(--t-aur);
		background: var(--t-aur);
	}
	/* la coche (case) ou le point (rond), couleur du fond */
	.opcion:has(input:checked) .marca::after {
		content: '';
		width: 6px;
		height: 11px;
		margin-top: -2px;
		border: solid var(--t-fons);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}
	.opcion-radio:has(input:checked) .marca::after {
		width: 8px;
		height: 8px;
		margin: 0;
		border: 0;
		border-radius: 50%;
		background: var(--t-fons);
		transform: none;
	}
	.opcion:has(input:checked) .opcion-tèxt {
		font-weight: 700;
	}
	.opcion:has(input:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	.camp {
		display: grid;
		gap: var(--esp-8);
	}
	.camp > span:not(.camp-titol) {
		font-weight: 700;
	}
	.camp input,
	.camp textarea {
		width: 100%;
		box-sizing: border-box;
		min-height: 52px;
		margin-top: var(--esp-16);
		padding: 0.7rem 0;
		border: 0;
		border-bottom: 1.5px solid var(--t-tinta-2);
		border-radius: 0;
		background: transparent;
		color: var(--t-tinta);
		font: 400 1.2rem/1.4 var(--font-body);
	}
	.camp textarea {
		padding: 0.7rem;
		border: 1.5px solid var(--t-linha);
		resize: vertical;
	}
	.camp input:focus,
	.camp textarea:focus {
		outline: none;
		border-color: var(--t-aur);
	}
	.camp input::placeholder {
		color: var(--t-tinta-2);
		opacity: 0.7;
	}
	.camp input[aria-invalid='true'] {
		border-color: var(--t-terra-viu);
	}
	.contacte {
		display: grid;
		gap: var(--esp-32);
	}
	.contacte .camp input {
		margin-top: 0;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-16) var(--esp-32);
		margin-top: var(--esp-48);
	}
	button.reservar:disabled {
		opacity: 0.7;
		cursor: progress;
	}
	.sens {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
		text-underline-offset: 3px;
	}
	.sens:hover {
		color: var(--t-tinta);
	}
	.error {
		flex-basis: 100%;
		margin: 0;
		color: var(--t-terra-viu);
		font-weight: 700;
	}
	.avís {
		flex-basis: 100%;
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
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

	/* le merci : une phrase, le bouton du calendrier, au milieu de la page */
	.merce {
		max-width: 40rem;
		margin-inline: auto;
	}
	.merce h1 {
		max-width: 18ch;
		margin-bottom: var(--esp-48);
		font-size: clamp(2.2rem, 6vw, 4.5rem);
		line-height: 1.05;
	}

	@media (prefers-reduced-motion: reduce) {
		.reservar :global(svg),
		.progres span,
		summary::after {
			transition: none;
		}
		.pas-a-pas .ecran:not([hidden]) {
			animation: none;
		}
	}
</style>
