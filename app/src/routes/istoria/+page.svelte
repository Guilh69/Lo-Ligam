<script>
	// Mon ligam amb l'occitan, ex-« Mon istòria » (2026-10-24, option A de Romain : une seule page, le récit
	// puis le contact ; /contacte renvoie à #contacte). Le récit est celui de
	// Romain (matière brute : istoria-romain.md, dictée le 2026-10-06) : chaque
	// chapitre est affiché tel que dicté (choix de Romain, 2026-10-24), il le relit, le traduit
	// dans l'éditeur (bouton « Editar »). Un texte occitan encore vide laisse
	// voir le français, marqué comme tel pour les lecteurs d'écran.
	// Occitan de l'interface vérifié par l'API de lo Congrès : À VALIDER par Romain.
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { edicion, iniciar, txt, ligam, imatge, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { editor } from '$lib/data/legal.js';

	let { data, form } = $props();

	const lèvaEdicion = iniciar('istoria', data.elements);
	onDestroy(() => lèvaEdicion?.());

	const t = {
		oc: {
			titolPagina: 'Mon ligam amb l’occitan',
			escriu: 'Escriu-me',
			nom: 'Ton nom',
			facultatiu: 'facultatiu',
			corrièl: 'Ton corrièl',
			obligatòri: 'obligatòri',
			messatge: 'Ton messatge',
			mandar: 'Mandar',
			mandant: 'Mandadís…',
			mercé: 'Mercé ! Ton messatge es partit. Te respondrai lèu.',
			avís: 'Ton corrièl servís sonque a te respondre. Lo site garda pas cap de còpia.',
			confid: 'Confidencialitat',
			adreça: 'Afichar l’adreça',
			perCorrièl: 'Corrièl',
			apondre: 'Apondre un capítol',
			error: {
				corrièl: 'Verifica ton corrièl.',
				messatge: 'Ton messatge es tròp cort.',
				ligams: 'Tròp de ligams dins lo messatge.',
				plafond: 'Tròp de messatges d’un còp. Torna ensajar d’aquí una ora.',
				geton: 'Lo messatge es pas partit. Torna ensajar.',
				mandadís: 'Lo messatge es pas partit. Torna ensajar, o escriu-me a :',
				pas_brancat: 'Lo messatge es pas partit. Torna ensajar, o escriu-me a :'
			}
		},
		fr: {
			titolPagina: 'Mon lien avec l’occitan',
			escriu: 'Écris-moi',
			nom: 'Ton nom',
			facultatiu: 'facultatif',
			corrièl: 'Ton adresse électronique',
			obligatòri: 'obligatoire',
			messatge: 'Ton message',
			mandar: 'Envoyer',
			mandant: 'Envoi…',
			mercé: 'Merci ! Ton message est parti. Je te répondrai vite.',
			avís: 'Ton adresse sert seulement à te répondre. Le site n’en garde aucune copie.',
			confid: 'Confidentialité',
			adreça: 'Afficher l’adresse',
			perCorrièl: 'Courriel',
			apondre: 'Ajouter un chapitre',
			error: {
				corrièl: 'Vérifie ton adresse électronique.',
				messatge: 'Ton message est trop court.',
				ligams: 'Trop de liens dans le message.',
				plafond: 'Trop de messages d’un coup. Réessaie dans une heure.',
				geton: 'Le message n’est pas parti. Réessaie.',
				mandadís: 'Le message n’est pas parti. Réessaie, ou écris-moi à :',
				pas_brancat: 'Le message n’est pas parti. Réessaie, ou écris-moi à :'
			}
		},
		es: {
			titolPagina: 'Mi vínculo con el occitano',
			escriu: 'Escríbeme',
			nom: 'Tu nombre',
			facultatiu: 'opcional',
			corrièl: 'Tu correo electrónico',
			obligatòri: 'obligatorio',
			messatge: 'Tu mensaje',
			mandar: 'Enviar',
			mandant: 'Enviando…',
			mercé: '¡Gracias! Tu mensaje ha salido. Te responderé pronto.',
			avís: 'Tu correo solo sirve para responderte. El sitio no guarda ninguna copia.',
			confid: 'Privacidad',
			adreça: 'Mostrar la dirección',
			perCorrièl: 'Correo electrónico',
			apondre: 'Añadir un capítulo',
			error: {
				corrièl: 'Comprueba tu correo electrónico.',
				messatge: 'Tu mensaje es demasiado corto.',
				ligams: 'Demasiados enlaces en el mensaje.',
				plafond: 'Demasiados mensajes a la vez. Vuelve a intentarlo dentro de una hora.',
				geton: 'El mensaje no ha salido. Vuelve a intentarlo.',
				mandadís: 'El mensaje no ha salido. Vuelve a intentarlo, o escríbeme a:',
				pas_brancat: 'El mensaje no ha salido. Vuelve a intentarlo, o escríbeme a:'
			}
		},
		en: {
			titolPagina: 'My connection to Occitan',
			escriu: 'Write to me',
			nom: 'Your name',
			facultatiu: 'optional',
			corrièl: 'Your email address',
			obligatòri: 'required',
			messatge: 'Your message',
			mandar: 'Send',
			mandant: 'Sending…',
			mercé: 'Thank you! Your message has been sent. I’ll reply soon.',
			avís: 'Your address is only used to reply to you. The site keeps no copy.',
			confid: 'Privacy',
			adreça: 'Show the address',
			perCorrièl: 'Email',
			apondre: 'Add a chapter',
			error: {
				corrièl: 'Please check your email address.',
				messatge: 'Your message is too short.',
				ligams: 'Too many links in the message.',
				plafond: 'Too many messages at once. Please try again in an hour.',
				geton: 'The message has not been sent. Please try again.',
				mandadís: 'The message has not been sent. Please try again, or write to me at:',
				pas_brancat: 'The message has not been sent. Please try again, or write to me at:'
			}
		},
		ca: {
			titolPagina: 'El meu vincle amb l’occità',
			escriu: 'Escriu-me',
			nom: 'El teu nom',
			facultatiu: 'opcional',
			corrièl: 'La teva adreça electrònica',
			obligatòri: 'obligatori',
			messatge: 'El teu missatge',
			mandar: 'Envia',
			mandant: 'Enviant…',
			mercé: 'Gràcies! El teu missatge s’ha enviat. Et respondré aviat.',
			avís: 'La teva adreça només serveix per respondre’t. El web no en guarda cap còpia.',
			confid: 'Privadesa',
			adreça: 'Mostra l’adreça',
			perCorrièl: 'Correu electrònic',
			apondre: 'Afegeix un capítol',
			error: {
				corrièl: 'Comprova la teva adreça electrònica.',
				messatge: 'El teu missatge és massa curt.',
				ligams: 'Massa enllaços al missatge.',
				plafond: 'Massa missatges alhora. Torna-ho a provar d’aquí a una hora.',
				geton: 'El missatge no s’ha enviat. Torna-ho a provar.',
				mandadís: 'El missatge no s’ha enviat. Torna-ho a provar, o escriu-me a:',
				pas_brancat: 'El missatge no s’ha enviat. Torna-ho a provar, o escriu-me a:'
			}
		},
		ar: {
			titolPagina: 'علاقتي بالأوكسيتانية',
			escriu: 'راسلني',
			nom: 'اسمك',
			facultatiu: 'اختياري',
			corrièl: 'بريدك الإلكتروني',
			obligatòri: 'إلزامي',
			messatge: 'رسالتك',
			mandar: 'إرسال',
			mandant: 'جارٍ الإرسال…',
			mercé: 'شكرًا! تم إرسال رسالتك، وسأردّ عليك قريبًا.',
			avís: 'يُستخدم بريدك الإلكتروني للردّ عليك فقط، ولا يحتفظ الموقع بأي نسخة منه.',
			confid: 'الخصوصية',
			adreça: 'إظهار البريد الإلكتروني',
			perCorrièl: 'البريد الإلكتروني',
			apondre: 'إضافة فصل',
			error: {
				corrièl: 'تحقّق من بريدك الإلكتروني.',
				messatge: 'رسالتك قصيرة جدًا.',
				ligams: 'الرسالة تحتوي على روابط كثيرة جدًا.',
				plafond: 'أُرسلت رسائل كثيرة جدًا دفعة واحدة. يُرجى المحاولة مرة أخرى بعد ساعة.',
				geton: 'لم يتم إرسال الرسالة. يُرجى المحاولة مرة أخرى.',
				mandadís: 'لم يتم إرسال الرسالة. يُرجى المحاولة مرة أخرى، أو مراسلتي على:',
				pas_brancat: 'لم يتم إرسال الرسالة. يُرجى المحاولة مرة أخرى، أو مراسلتي على:'
			}
		}
	};
	let tx = $derived(t[langStore.current] ?? t.oc);
	// espace avant les deux-points : seulement en occitan et en français
	let dp = $derived(langStore.current === 'oc' || langStore.current === 'fr' ? ' :' : ':');

	/** le texte dans la langue du site ; si elle est vide, l'occitan, puis le français */
	function vista(clau) {
		const v = txt(clau);
		const l = langStore.current;
		if (v[l]?.trim()) return { t: v[l], lang: l };
		return v.oc.trim() ? { t: v.oc, lang: 'oc' } : { t: v.fr, lang: 'fr' };
	}
	const paragrafs = (s) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

	// deux parties (titre C de Romain, 2026-10-24) : son lien avec l'occitan,
	// puis « L'espelida del Ligam », la naissance du projet à partir de 2022
	let capitols = $derived(lista('istoria.capitols'));
	let espelida = $derived(lista('istoria.espelida'));
	let retrat = $derived(imatge('istoria.retrat'));
	const apondreCapitol = (clauLista) =>
		apondre(clauLista, 'bloc', { visible: false }, [
			['titol', 'text', { oc: '', fr: 'Títol' }],
			['tèxt', 'text', { oc: '', fr: '…' }]
		]);

	// le formulaire
	let mandant = $state(false);
	let adreçaVista = $state(false);
	let error = $derived(form?.error ? (tx.error[form.error] ?? tx.error.mandadís) : null);
	let ambAdreça = $derived(form?.error === 'mandadís' || form?.error === 'pas_brancat');
</script>

<svelte:head>
	<title>{vista('istoria.titol').t || tx.titolPagina} · Lo Ligam</title>
	<meta name="description" content="Mon ligam amb l’occitan, e cossí me contactar." />
</svelte:head>

{#snippet tèxt(clau, etiqueta = 'span')}{@const v = vista(clau)}<svelte:element
		this={etiqueta}
		lang={v.lang}
		hidden={amagat(clau)}
		use:editar={clau}>{v.t}</svelte:element
	>{/snippet}

<div class="pagina" class:ed-actiu={edicion.actiu}>
	<div class="capçal">
		<AppHeader />
	</div>

	<main class="cors">
		<header class="intro">
			<div class="intro-tèxt">
				{@render tèxt('istoria.kicker', 'p')}
				<h1>{@render tèxt('istoria.titol')}</h1>
				{#if !amagat('istoria.chapèu')}
					{@const v = vista('istoria.chapèu')}
					<div class="chapèu" lang={v.lang} use:editar={'istoria.chapèu'}>
						{#each paragrafs(v.t) as p, i (i)}<p>{p}</p>{/each}
					</div>
				{/if}
			</div>
			{#if retrat?.url}
				<figure class="retrat" use:editar={'istoria.retrat'} hidden={amagat('istoria.retrat')}>
					<img
						src={retrat.url}
						width={retrat.largor}
						height={retrat.nautor}
						alt={tria({ oc: retrat.alt_oc, fr: retrat.alt_fr }) || 'Romain Périer'}
						fetchpriority="high"
					/>
				</figure>
			{/if}
		</header>

		{#snippet partida(clauLista, l, debuta, etiqueta)}
			<ol class="capitols" start={debuta + 1}>
				{#each l as c, i (c.clau)}
					{@const cos = vista(c.clau + '.tèxt')}
					<li class="capitol" use:editar={c.clau}>
						<span class="capitol-n" aria-hidden="true">{String(debuta + i + 1).padStart(2, '0')}</span>
						<div>
							{@render tèxt(c.clau + '.titol', etiqueta)}
							<div class="capitol-cos" lang={cos.lang} hidden={amagat(c.clau + '.tèxt')} use:editar={c.clau + '.tèxt'}>
								{#each paragrafs(cos.t) as p, k (k)}<p>{p}</p>{/each}
							</div>
						</div>
					</li>
				{/each}
			</ol>
			{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={() => apondreCapitol(clauLista)}>+ {tx.apondre}</button>{/if}
		{/snippet}

		{#if capitols.length || edicion.actiu}
			{@render partida('istoria.capitols', capitols, 0, 'h2')}
		{/if}

		{#if espelida.length || edicion.actiu}
			<section class="espelida" aria-labelledby="espelida-titol">
				<h2 class="espelida-titol" id="espelida-titol">{@render tèxt('istoria.espelida.titol')}</h2>
				{@render partida('istoria.espelida', espelida, capitols.length, 'h3')}
			</section>
		{/if}

		<section class="contacte" id="contacte" aria-labelledby="contacte-titol">
			<div class="contacte-crida">
				<h2 id="contacte-titol">{@render tèxt('istoria.contacte.titol')}</h2>
				{@render tèxt('istoria.contacte.tèxt', 'p')}
				{#if !amagat('istoria.contacte.reservar')}
					{@const l = ligam('istoria.contacte.reservar')}
					<a
						class="boton"
						href={l.href}
						target={l.defòra ? '_blank' : undefined}
						rel={l.defòra ? 'noopener' : undefined}
						use:editar={'istoria.contacte.reservar'}>{tria(l)}</a
					>
				{/if}
				<p class="adreça">
					<span>{tx.perCorrièl}{dp}</span>
					{#if adreçaVista}
						<a href="mailto:{editor.email}">{editor.email}</a>
					{:else}
						<button type="button" class="ligam-boton" onclick={() => (adreçaVista = true)}>{tx.adreça}</button>
					{/if}
				</p>
			</div>

			<div class="formulari">
				{#if form?.mandat}
					<p class="mercé" role="status">{tx.mercé}</p>
				{:else}
					<h3>{tx.escriu}</h3>
					<form
						method="POST"
						use:enhance={() => {
							mandant = true;
							return async ({ update }) => {
								await update({ reset: false });
								mandant = false;
							};
						}}
					>
						<input type="hidden" name="geton" value={data.geton} />
						<!-- piège à robots : invisible, hors tabulation, ignoré des lecteurs d'écran -->
						<div class="piège" aria-hidden="true">
							<label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off" /></label>
						</div>

						<label class="camp">
							<span>{tx.nom} <small>({tx.facultatiu})</small></span>
							<input type="text" name="nom" maxlength="120" autocomplete="name" value={form?.nom ?? ''} />
						</label>
						<label class="camp">
							<span>{tx.corrièl} <small>({tx.obligatòri})</small></span>
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
						<label class="camp">
							<span>{tx.messatge} <small>({tx.obligatòri})</small></span>
							<textarea name="messatge" required minlength="5" maxlength="4000" rows="6" aria-invalid={form?.error === 'messatge' || undefined}
								>{form?.messatge ?? ''}</textarea
							>
						</label>

						{#if error}
							<p class="error" role="alert">
								{error}
								{#if ambAdreça}<a href="mailto:{editor.email}">{editor.email}</a>{/if}
							</p>
						{/if}

						<button type="submit" class="boton" disabled={mandant}>{mandant ? tx.mandant : tx.mandar}</button>
						<p class="avís">{tx.avís} <a href="/confidencialitat">{tx.confid}</a></p>
					</form>
				{/if}
			</div>
		</section>
	</main>
</div>

<style>
	.pagina {
		--ease: cubic-bezier(0.19, 1, 0.22, 1);
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		/* la même braise que Mots, de l'autre côté : le récit vient d'ailleurs */
		background:
			radial-gradient(ellipse 60% 45% at 96% -6%, color-mix(in srgb, var(--t-terra) 24%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 0% 30%, color-mix(in srgb, var(--t-aur) 7%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.cors {
		padding: 0 var(--marge) 5rem;
		container-type: inline-size;
	}

	/* ---------- Ouverture : repère, grand titre, chapeau, portrait ---------- */
	.intro {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		/* le portrait au milieu de sa colonne, à hauteur du titre (Romain, 2026-10-24 : « mal positionnée ») */
		align-items: center;
		padding: clamp(2.5rem, 8vh, 5.5rem) 0 clamp(2rem, 6vh, 3.5rem);
		border-bottom: 1px solid var(--t-linha);
	}
	@container (min-width: 760px) {
		.intro {
			grid-template-columns: minmax(0, 1fr) minmax(220px, 30%);
			gap: 3rem;
		}
	}
	.intro-tèxt > :global(p:first-child) {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin: 0 0 1.2rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.intro-tèxt > :global(p:first-child)::before {
		content: '';
		width: 3.2rem;
		height: 1px;
		background: currentColor;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3rem, 11cqi, 8.5rem);
		line-height: 0.98;
		letter-spacing: -0.01em;
	}
	.chapèu {
		max-width: 52ch;
		margin-top: 1.8rem;
		font-size: clamp(1.05rem, 1.6cqi, 1.25rem);
		line-height: 1.6;
		color: var(--t-tinta-2);
	}
	.chapèu p {
		margin: 0 0 0.8em;
	}

	/* Le portrait « sang e aur » : liseré terracotta, puis or (charte §3bis) */
	.retrat {
		margin: 0;
		justify-self: center;
		width: min(260px, 70%);
	}
	@container (min-width: 760px) {
		.retrat {
			width: 100%;
			max-width: 320px;
		}
	}
	.retrat img {
		display: block;
		width: 100%;
		height: auto;
		/* un cercle, le visage au centre */
		aspect-ratio: 1;
		object-fit: cover;
		object-position: 50% 30%;
		border-radius: 46% 54% 50% 50% / 52% 48% 52% 48%;
		box-shadow:
			0 0 0 5px var(--t-terra),
			0 0 0 10px var(--t-aur),
			0 18px 40px rgba(0, 0, 0, 0.25);
	}

	/* ---------- Les chapitres, reliés par un fil d'or ---------- */
	.capitols {
		list-style: none;
		margin: 0;
		padding: clamp(2.5rem, 7vh, 4.5rem) 0 0;
		max-width: 46rem;
		position: relative;
	}
	.capitols::before {
		content: '';
		position: absolute;
		top: clamp(2.5rem, 7vh, 4.5rem);
		bottom: 0;
		/* propriétés logiques : en arabe (droite à gauche) le fil suit les pastilles, à droite */
		inset-inline-start: 1.35rem;
		border-inline-start: 1px dashed color-mix(in srgb, var(--t-aur) 55%, transparent);
	}
	.capitol {
		position: relative;
		display: grid;
		grid-template-columns: 2.7rem minmax(0, 1fr);
		gap: 1.2rem;
		padding-bottom: 2.6rem;
	}
	.capitol-n {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.7rem;
		height: 2.7rem;
		border-radius: 50%;
		background: var(--t-fons);
		border: 1px solid var(--t-aur);
		color: var(--t-aur);
		font-family: var(--font-heading);
		font-size: 0.95rem;
	}
	.capitol :global(h2),
	.capitol :global(h3) {
		margin: 0.35rem 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 3cqi, 2.1rem);
		line-height: 1.15;
		color: var(--t-aur);
	}
	.capitol-cos {
		line-height: 1.7;
		font-size: 1.05rem;
	}
	.capitol-cos p {
		margin: 0 0 0.9em;
		max-width: 62ch;
	}

	/* ---------- L'intertitre : « L'espelida del Ligam » ---------- */
	.espelida {
		margin-top: clamp(1.5rem, 5vh, 3rem);
	}
	.espelida-titol {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 5.5cqi, 3.6rem);
		line-height: 1.05;
	}
	.espelida-titol::before {
		content: '';
		flex: none;
		width: 2.7rem;
		height: 1px;
		background: var(--t-aur);
	}
	.espelida .capitols {
		padding-top: 2rem;
	}
	.espelida .capitols::before {
		top: 2rem;
	}

	/* ---------- Le contact, en fin de page ---------- */
	.contacte {
		margin-top: clamp(2.5rem, 8vh, 5rem);
		padding-top: clamp(2.5rem, 7vh, 4rem);
		border-top: 1px solid var(--t-linha);
		display: grid;
		gap: 2.5rem;
		scroll-margin-top: 1.5rem;
	}
	/* sans chapitre publié, le trait de l'ouverture suffit */
	.intro + .contacte {
		border-top: 0;
		padding-top: 0;
	}
	@container (min-width: 760px) {
		.contacte {
			grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
			gap: 4rem;
			align-items: start;
		}
	}
	.contacte h2 {
		margin: 0 0 1rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7cqi, 4.6rem);
		line-height: 1;
	}
	.contacte-crida > :global(p:first-of-type) {
		margin: 0 0 1.8rem;
		max-width: 34ch;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--t-tinta-2);
	}

	/* règle B : ce qui se clique, en aplat rouge sous un texte crème */
	.boton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0.75rem 1.5rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: inherit;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition: background 0.3s var(--ease), transform 0.3s var(--ease);
	}
	.boton:hover {
		background: var(--t-accion-viu);
		transform: translateY(-2px);
	}
	.boton:focus-visible,
	.ligam-boton:focus-visible,
	.camp input:focus-visible,
	.camp textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}
	.boton:disabled {
		opacity: 0.7;
		cursor: progress;
		transform: none;
	}
	.adreça {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: baseline;
		margin: 1.6rem 0 0;
		color: var(--t-tinta-2);
	}
	.adreça a,
	.ligam-boton,
	.avís a,
	.error a {
		color: var(--t-tinta);
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	.ligam-boton {
		background: none;
		border: 0;
		padding: 0.2rem 0;
		font: inherit;
		cursor: pointer;
	}

	.formulari {
		padding: clamp(1.3rem, 3cqi, 2.2rem);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		background: color-mix(in srgb, var(--t-fons-2) 82%, transparent);
	}
	.formulari h3 {
		margin: 0 0 1.2rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
		color: var(--t-aur);
	}
	form {
		display: grid;
		gap: 1.1rem;
	}
	.camp {
		display: grid;
		gap: 0.4rem;
		font-weight: 700;
		font-size: 0.95rem;
	}
	.camp small {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.camp input,
	.camp textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: inherit;
		font-weight: 400;
		font-size: 1rem;
	}
	.camp textarea {
		resize: vertical;
		min-height: 9rem;
		line-height: 1.5;
	}
	.camp [aria-invalid='true'] {
		border-color: var(--t-aur);
	}
	form .boton {
		justify-self: start;
	}
	.piège {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.error {
		margin: 0;
		padding: 0.8rem 1rem;
		border-inline-start: 3px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
	}
	.mercé {
		margin: 0;
		font-size: 1.2rem;
		line-height: 1.5;
	}
	.avís {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	/* édition : le bouton d'ajout, comme sur l'accueil */
	.ed-apondre {
		margin: 0 0 1rem 3.9rem;
		padding: 0.5rem 1rem;
		border: 1px dashed var(--t-aur);
		border-radius: 999px;
		background: none;
		color: var(--t-aur);
		font: inherit;
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.boton {
			transition: none;
		}
	}
</style>
