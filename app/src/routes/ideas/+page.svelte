<script>
	// Boîte à idées (Amassa, option A de Romain, 2026-10-25). Réservée aux
	// personnes connectées ; chacune voit ses propres idées, leur état et la
	// réponse de Romain, et peut les supprimer. Rien n'est public. Ce qui
	// protège, ce sont les règles d'accès de la base (supabase/supabase-ideas.sql,
	// vérifiées par supabase/verificacion-ideas.sql), pas cette page.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, amagat } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('ideas', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const LOCALAS = { oc: 'oc', fr: 'fr-FR', es: 'es-ES', en: 'en-GB', ca: 'ca', ar: 'ar-u-nu-latn' };

	const MIN = 10;
	const MAX = 2000;
	const X = {
		oc: {
			camp: 'Ton idèa',
			mandar: 'Mandar',
			connectar: 'Se connectar',
			tas: 'Tas idèas',
			responsa: 'Responsa de Romain',
			suprimir: 'Suprimir',
			confirmar: 'Suprimir aquesta idèa ?',
			cort: `Tròp cort : ${MIN} letras al mens.`,
			limit: 'Cinc idèas per jorn al maximum : torna deman.',
			error: 'Una error : torna ensajar.',
			confidencialitat: 'Confidencialitat',
			estats: { nòva: 'Nòva', legida: 'Legida', retenguda: 'Retenguda', facha: 'Facha', escartada: 'Escartada' }
		},
		fr: {
			camp: 'Ton idée',
			mandar: 'Envoyer',
			connectar: 'Se connecter',
			tas: 'Tes idées',
			responsa: 'Réponse de Romain',
			suprimir: 'Supprimer',
			confirmar: 'Supprimer cette idée ?',
			cort: `Trop court : ${MIN} lettres au moins.`,
			limit: 'Cinq idées par jour au maximum : reviens demain.',
			error: 'Une erreur : réessaie.',
			confidencialitat: 'Confidentialité',
			estats: { nòva: 'Nouvelle', legida: 'Lue', retenguda: 'Retenue', facha: 'Réalisée', escartada: 'Écartée' }
		},
		es: {
			camp: 'Tu idea',
			mandar: 'Enviar',
			connectar: 'Iniciar sesión',
			tas: 'Tus ideas',
			responsa: 'Respuesta de Romain',
			suprimir: 'Eliminar',
			confirmar: '¿Eliminar esta idea?',
			cort: `Demasiado corta: mínimo ${MIN} letras.`,
			limit: 'Máximo cinco ideas al día: vuelve mañana.',
			error: 'Ha habido un error: inténtalo de nuevo.',
			confidencialitat: 'Privacidad',
			estats: { nòva: 'Nueva', legida: 'Leída', retenguda: 'Retenida', facha: 'Realizada', escartada: 'Descartada' }
		},
		en: {
			camp: 'Your idea',
			mandar: 'Send',
			connectar: 'Log in',
			tas: 'Your ideas',
			responsa: 'Reply from Romain',
			suprimir: 'Delete',
			confirmar: 'Delete this idea?',
			cort: `Too short: at least ${MIN} letters.`,
			limit: 'Five ideas a day at most: come back tomorrow.',
			error: 'Something went wrong: try again.',
			confidencialitat: 'Privacy',
			estats: { nòva: 'New', legida: 'Read', retenguda: 'Kept', facha: 'Done', escartada: 'Set aside' }
		},
		ca: {
			camp: 'La teva idea',
			mandar: 'Envia',
			connectar: 'Inicia la sessió',
			tas: 'Les teves idees',
			responsa: 'Resposta de Romain',
			suprimir: 'Suprimeix',
			confirmar: 'Suprimir aquesta idea?',
			cort: `Massa curta: mínim ${MIN} lletres.`,
			limit: 'Com a màxim cinc idees al dia: torna demà.',
			error: 'Hi ha hagut un error: torna-ho a provar.',
			confidencialitat: 'Privadesa',
			estats: { nòva: 'Nova', legida: 'Llegida', retenguda: 'Retinguda', facha: 'Feta', escartada: 'Descartada' }
		},
		ar: {
			camp: 'اقتراحك',
			mandar: 'إرسال',
			connectar: 'تسجيل الدخول',
			tas: 'اقتراحاتك',
			responsa: 'ردّ Romain',
			suprimir: 'حذف',
			confirmar: 'هل تريد حذف هذا الاقتراح؟',
			cort: `الاقتراح قصير جدًّا: ${MIN} أحرف على الأقل.`,
			limit: 'الحدّ الأقصى خمسة اقتراحات في اليوم: يمكنك المحاولة غدًا.',
			error: 'حدث خطأ: يرجى المحاولة مرة أخرى.',
			confidencialitat: 'الخصوصية',
			estats: { nòva: 'جديد', legida: 'تمت قراءته', retenguda: 'تم اعتماده', facha: 'تم تنفيذه', escartada: 'مستبعد' }
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	let tèxte = $state('');
	let mandant = $state(false);
	let mercé = $state(false);
	let error = $state(null); // clé de X : 'cort' | 'limit' | 'error'
	let mevas = $state([]);

	async function cargar() {
		const { data: d } = await supabase
			.from('ideas')
			.select('id, tèxte, estat, responsa, created_at')
			.order('created_at', { ascending: false });
		mevas = d ?? [];
	}
	$effect(() => {
		if ($session) cargar();
		else mevas = [];
	});

	async function mandar(e) {
		e.preventDefault();
		error = null;
		mercé = false;
		if (tèxte.trim().length < MIN) {
			error = 'cort';
			return;
		}
		mandant = true;
		const { error: err } = await supabase.from('ideas').insert({ tèxte: tèxte.trim() });
		mandant = false;
		if (err) {
			error = /ideas_limit/.test(err.message) ? 'limit' : 'error';
			return;
		}
		tèxte = '';
		mercé = true;
		cargar();
	}

	async function suprimir(id) {
		if (!confirm(x.confirmar)) return;
		const { error: err } = await supabase.from('ideas').delete().eq('id', id);
		if (err) error = 'error';
		cargar();
	}

	const data_ = (d) =>
		new Date(d).toLocaleDateString(LOCALAS[langStore.current] ?? 'oc', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<svelte:head>
	<title>{tria({ oc: 'Boita d’idèas', fr: 'Boîte à idées', es: 'Buzón de ideas', en: 'Idea box', ca: 'Bústia d’idees', ar: 'صندوق الاقتراحات' })} · Lo Ligam</title>
	<meta
		name="description"
		content="Boita d’idèas : una idèa per melhorar Lo Ligam. Boîte à idées : une idée pour améliorer Lo Ligam."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet t(clau)}{@const v = txt(clau)}<span lang={langStore.current}>{@render marcat(tria(v))}</span>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="ideas" class:ed-actiu={edicion.actiu}>
	<header class="cap">
		<h1 hidden={amagat('ideas.titol')} use:editar={'ideas.titol'}>{@render t('ideas.titol')}</h1>
		<p class="frasa" hidden={amagat('ideas.frasa')} use:editar={'ideas.frasa'}>{@render t('ideas.frasa')}</p>
	</header>

	<section class="boita" aria-label={x.camp}>
		{#if !$authReady}
			<p class="cargament">…</p>
		{:else if !$session}
			<p class="compte" hidden={amagat('ideas.compte')} use:editar={'ideas.compte'}>{@render t('ideas.compte')}</p>
			<a class="boton" href="/compte?tornar=/ideas">{x.connectar}</a>
		{:else}
			<form onsubmit={mandar}>
				<label class="camp">
					<span>{x.camp}</span>
					<textarea
						bind:value={tèxte}
						rows="5"
						maxlength={MAX}
						required
						aria-invalid={error === 'cort' || undefined}
						aria-describedby="ideas-comptador"
					></textarea>
				</label>
				<div class="accions">
					<button type="submit" class="boton" disabled={mandant}>{mandant ? '…' : x.mandar}</button>
					<span id="ideas-comptador" class="comptador">{tèxte.length} / {MAX}</span>
				</div>
				{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
				{#if mercé}<p class="mercé" role="status" use:editar={'ideas.mercé'}>{@render t('ideas.mercé')}</p>{/if}
			</form>
		{/if}
		<p class="avís">
			<span hidden={amagat('ideas.avís')} use:editar={'ideas.avís'}>{@render t('ideas.avís')}</span>
			<a href="/confidencialitat">{x.confidencialitat}</a>
		</p>
	</section>

	{#if mevas.length}
		<section class="mevas" aria-labelledby="ideas-tas">
			<h2 id="ideas-tas">{x.tas}</h2>
			<ul>
				{#each mevas as i (i.id)}
					<li>
						<div class="linha">
							<span class="estat estat-{i.estat}">{x.estats[i.estat]}</span>
							<time datetime={i.created_at}>{data_(i.created_at)}</time>
							<button type="button" class="suprimir" onclick={() => suprimir(i.id)}>{x.suprimir}</button>
						</div>
						<p class="tèxte">{i.tèxte}</p>
						{#if i.responsa}
							<div class="responsa">
								<strong>{x.responsa}</strong>
								<p>{i.responsa}</p>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
</div>

<style>
	/* Le cadre des pages intérieures, comme S'apren */
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
	.ideas {
		max-width: calc(48rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}

	.cap {
		margin-bottom: var(--esp-48);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 8vw, 5.5rem);
		line-height: 0.95;
	}
	.frasa {
		max-width: 38ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.frasa :global(.aur) {
		color: var(--t-aur);
	}

	/* La boîte : une carte à liseré, comme le questionnaire de la visio */
	.boita {
		padding: clamp(1.25rem, 4vw, 2.5rem);
		border: 1px solid var(--t-linha);
		border-top: 6px solid var(--t-aur);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	.compte {
		margin: 0 0 var(--esp-24);
		font-size: 1.1rem;
		line-height: 1.55;
	}
	form {
		display: grid;
		gap: var(--esp-16);
	}
	.camp {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		min-height: 8rem;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.5 var(--font-body);
		resize: vertical;
	}
	textarea:focus-visible,
	.boton:focus-visible,
	.suprimir:focus-visible,
	.avís a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	textarea[aria-invalid='true'] {
		border-color: var(--t-aur);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-16);
	}
	/* ce qui se clique : une tuile du rouge du logo (règle B, 23-10) */
	.boton {
		display: inline-flex;
		align-items: center;
		min-height: 48px;
		padding: 0.8rem 1.6rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
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
	.comptador {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}
	/* jamais de rouge en texte sur le sombre (règle des couleurs, 23-10) :
	   le texte reste clair, un trait d'or le signale */
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.avís {
		margin: var(--esp-24) 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.avís a {
		color: inherit;
	}

	/* Les idées de la personne connectée */
	.mevas {
		margin-top: var(--esp-64);
	}
	h2 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
	}
	.mevas ul {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.mevas li {
		padding: var(--esp-16);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
	}
	.linha {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-8) var(--esp-16);
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	/* l'état : une pastille, son nom écrit en toutes lettres */
	.estat {
		padding: 0.2rem 0.65rem;
		border: 1px solid currentColor;
		border-radius: 999px;
		font-weight: 700;
	}
	.estat-retenguda,
	.estat-facha {
		color: var(--t-aur);
	}
	.suprimir {
		margin-left: auto;
		min-height: 32px;
		padding: 0.3rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
	}
	.suprimir:hover {
		border-color: var(--t-aur);
	}
	.tèxte {
		margin: var(--esp-12) 0 0;
		line-height: 1.55;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.responsa {
		margin-top: var(--esp-12);
		padding-left: var(--esp-16);
		border-left: 3px solid var(--t-aur);
	}
	.responsa p {
		margin: var(--esp-4) 0 0;
		white-space: pre-line;
	}
</style>
