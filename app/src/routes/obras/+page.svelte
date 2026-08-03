<script>
	// Espace « Òbras » : ce que Romain fait découvrir — musiques, livres, films.
	//
	// On n'héberge aucun extrait. On donne les informations, son commentaire, et
	// on laisse écouter par le lecteur officiel, chargé SEULEMENT au clic : avant
	// ça, aucune requête ne part chez un tiers, donc aucun traceur.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { MENAS, embedYoutube, ostePropre } from '$lib/obras';

	let { data } = $props();
	let lang = $derived(langStore.current);

	let filtre = $state('tot');
	let dubèrt = $state(null); // id de l'œuvre dont le lecteur est chargé

	const t = {
		oc: {
			title: 'Òbras',
			lead: 'Çò qu’escoti, çò que legissi, çò que vos fau descobrir en occitan.',
			tot: 'Tot',
			escotar: 'Escotar',
			veire: 'Ne saber mai',
			avis: 'En clicant, cargas lo lector de la plataforma.',
			void: 'Encara res aicí. Lèu.',
			pana: 'Impossible de cargar las òbras pel moment.'
		},
		fr: {
			title: 'Œuvres',
			lead: 'Ce que j’écoute, ce que je lis, ce que je vous fais découvrir en occitan.',
			tot: 'Tout',
			escotar: 'Écouter',
			veire: 'En savoir plus',
			avis: 'En cliquant, tu charges le lecteur de la plateforme.',
			void: 'Rien encore ici. Bientôt.',
			pana: 'Impossible de charger les œuvres pour le moment.'
		}
	};
	let tx = $derived(t[lang]);

	let visiblas = $derived(
		filtre === 'tot' ? data.obras : data.obras.filter((o) => o.mena === filtre)
	);

	const nomMena = (id) => {
		const m = MENAS.find((x) => x.id === id);
		return m ? (lang === 'oc' ? m.oc : m.fr) : id;
	};

	function comptar(mena) {
		return data.obras.filter((o) => o.mena === mena).length;
	}
</script>

<svelte:head>
	<title>{tx.title} — Lo Ligam</title>
	<meta
		name="description"
		content="Musicas, libres e filmes en occitan, causits e comentats per Lo Ligam."
	/>
</svelte:head>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	<header class="intro">
		<h1>{tx.title}</h1>
		<p class="lead">{tx.lead}</p>
	</header>

	{#if data.pana}
		<p class="msg">{tx.pana}</p>
	{:else if !data.obras.length}
		<p class="msg">{tx.void}</p>
	{:else}
		<nav class="menas" aria-label={tx.title}>
			<button type="button" class="mena" class:on={filtre === 'tot'} onclick={() => (filtre = 'tot')}>
				{tx.tot}<span class="n">{data.obras.length}</span>
			</button>
			{#each MENAS as m (m.id)}
				{#if comptar(m.id)}
					<button
						type="button"
						class="mena"
						class:on={filtre === m.id}
						onclick={() => (filtre = m.id)}
					>
						{lang === 'oc' ? m.oc : m.fr}<span class="n">{comptar(m.id)}</span>
					</button>
				{/if}
			{/each}
		</nav>

		<ul class="lista">
			{#each visiblas as o (o.id)}
				{@const embed = embedYoutube(o.embed_url)}
				<li class="obra">
					<div class="visual">
						{#if dubèrt === o.id && embed}
							<iframe
								src={embed}
								title={o.titre}
								allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
								referrerpolicy="strict-origin-when-cross-origin"
								loading="lazy"
							></iframe>
						{:else if o.imatge_url}
							<img src={o.imatge_url} alt={o.titre} loading="lazy" />
							{#if embed}
								<button type="button" class="jogar" onclick={() => (dubèrt = o.id)}>
									<span aria-hidden="true">▶</span>
									<span class="sr-only">{tx.escotar} — {o.titre}</span>
								</button>
							{/if}
						{:else}
							<!-- Aucune image dont on ait le droit : un aplat de la charte, le
							     titre en grand. Pas de vignette prise chez un tiers. -->
							<div class="aplat">
								<span class="aplat-titre">{o.titre}</span>
								{#if embed}
									<button type="button" class="jogar sus-aplat" onclick={() => (dubèrt = o.id)}>
										<span aria-hidden="true">▶</span>
										<span class="sr-only">{tx.escotar} — {o.titre}</span>
									</button>
								{/if}
							</div>
						{/if}
					</div>

					<div class="tèxte">
						<p class="mena-etiqueta">{nomMena(o.mena)}</p>
						<h2>{o.titre}</h2>
						<p class="autor">
							{o.autor}{#if o.editor}<span class="fin"> · {o.editor}</span>{/if}{#if o.an}<span
									class="fin"
								>
									· {o.an}</span
								>{/if}
						</p>

						{#if o.comentari}
							<blockquote>{o.comentari}</blockquote>
						{/if}

						{#if embed && dubèrt !== o.id}
							<p class="avis">{tx.avis}</p>
						{/if}

						{#if o.ligam}
							<a class="ligam" href={o.ligam} target="_blank" rel="noopener noreferrer">
								{tx.veire}
								{#if ostePropre(o.ligam)}<span class="oste">{ostePropre(o.ligam)}</span>{/if}
							</a>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.intro {
		text-align: center;
		max-width: 34rem;
		margin-top: 1rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 6vw, 2.6rem);
		color: var(--color-terracotta);
	}

	.lead {
		margin: 0.5rem 0 0;
		color: var(--color-text);
		opacity: 0.85;
		line-height: 1.5;
	}

	.msg {
		background: white;
		border-radius: 18px;
		padding: 1.5rem 2rem;
		color: var(--color-teal);
	}

	.menas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		justify-content: center;
		max-width: 40rem;
	}

	.mena {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: none;
		background: white;
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		cursor: pointer;
		box-shadow: 0 3px 10px rgba(58, 42, 32, 0.07);
	}

	.mena.on {
		background: var(--color-terracotta);
		color: white;
	}

	.n {
		font-size: 0.78rem;
		opacity: 0.7;
	}

	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 46rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.obra {
		display: flex;
		gap: 1.25rem;
		background: white;
		border-radius: 20px;
		padding: 1.25rem;
		box-shadow: 0 12px 30px rgba(58, 42, 32, 0.09);
		flex-wrap: wrap;
	}

	.visual {
		position: relative;
		flex: 1 1 15rem;
		min-width: 13rem;
		align-self: flex-start;
	}

	.visual img,
	.visual iframe,
	.aplat {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 14px;
		display: block;
		object-fit: cover;
		border: none;
	}

	.aplat {
		background: linear-gradient(135deg, var(--color-terracotta), var(--color-brick));
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: 1rem;
	}

	.aplat-titre {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: white;
		text-align: center;
		line-height: 1.25;
		opacity: 0.95;
	}

	.jogar {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 3.4rem;
		height: 3.4rem;
		border-radius: 999px;
		border: none;
		background: rgba(255, 255, 255, 0.94);
		box-shadow: 0 6px 18px rgba(58, 42, 32, 0.32);
		color: var(--color-terracotta);
		font-size: 1.2rem;
		cursor: pointer;
		padding-left: 0.2rem;
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.jogar:hover {
		transform: translate(-50%, -50%) scale(1.08);
	}

	.tèxte {
		flex: 1 1 16rem;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.mena-etiqueta {
		margin: 0;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-teal);
		font-weight: 700;
	}

	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.autor {
		margin: 0;
		font-size: 0.92rem;
		color: var(--color-text);
	}

	.fin {
		opacity: 0.65;
	}

	blockquote {
		margin: 0.3rem 0 0;
		padding-left: 0.8rem;
		border-left: 3px solid var(--color-gold);
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--color-text);
		opacity: 0.9;
	}

	.avis {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-teal);
		opacity: 0.85;
	}

	.ligam {
		align-self: flex-start;
		margin-top: 0.2rem;
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		color: var(--color-terracotta);
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		border-bottom: 2px solid rgba(199, 91, 57, 0.3);
	}

	.ligam:hover {
		border-bottom-color: var(--color-terracotta);
	}

	.oste {
		font-size: 0.75rem;
		font-weight: 400;
		opacity: 0.7;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.jogar {
			transition: none;
		}
	}
</style>
