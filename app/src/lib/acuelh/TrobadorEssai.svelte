<script>
	// Essai du 2026-11-12 (chantier 37, /ensag/fenestra) : deux autres façons de poser la photo et le
	// vers de Max Rouquette sur l'accueil, à la place de la fenêtre qui s'ouvre (acuelh.css, « Acte VI »).
	// Point de départ : la photo est déjà une fenêtre (une ouverture de pierre sur le paysage, un nuage
	// dans le ciel), et le vers dit « tu regardes passer le rêve d'un nuage ». Plus besoin de lui
	// dessiner une fenêtre ni de l'assombrir : la pierre de la photo sert de cadre, et de support au texte.
	//   pagina : la photo dans le cadre des photos du site, le vers à côté, sur le fond de la page ;
	//   peira  : une seule image, le vers posé sur la pierre du linteau ;
	// (Une troisième, plein écran, a été écartée à la relecture de Joan : angles vifs, coupe nette en fin de course,
	// ouverture de pierre perdue sur téléphone.) Dans les deux, le défilement fait avancer vers l'ouverture de pierre (la photo grossit autour
	// d'elle). Rien ne bouge si l'appareil demande moins d'animations ou en version légère.
	// La page l'affiche à la place de la section en place seulement avec « ?fenestra=… ».
	import { onMount } from 'svelte';
	import { txt, imatge } from '$lib/edicion/edicion.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let { forma = 'peira' } = $props();
	let lang = $derived(langStore.current);
	let fen = $derived(imatge('acuelh.trobador.fenestra') ?? { url: '/acuelh/erau.webp', largor: 1500, nautor: 2173 });
	let alt = $derived(fen?.['alt_' + lang] || fen?.alt_fr || fen?.alt_oc || '');
	let cita = $derived(txt('acuelh.trobador.cita'));
	let citaTx = $derived(lang === 'oc' ? cita.oc : cita[lang] || cita.fr || cita.oc);

	let seccion;
	let vist = $state(false);

	onMount(() => {
		const calme = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on';
		if (calme) {
			vist = true;
			return;
		}
		const borne = (v) => Math.max(0, Math.min(1, v));
		let attendu = 0;
		let proche = false;
		const mesure = () => {
			attendu = 0;
			const H = innerHeight;
			// de l'entrée de la section par le bas à sa sortie par le haut
			const r = seccion.getBoundingClientRect();
			const p = borne((H - r.top) / (H + r.height));
			// le vers se lève quand il est bien entré dans l'écran
			if (!vist && seccion.querySelector('.vers').getBoundingClientRect().top < H * 0.8) vist = true;
			seccion.style.setProperty('--p', p.toFixed(4));
		};
		const planifie = () => {
			if (proche && !attendu) attendu = requestAnimationFrame(mesure);
		};
		const io = new IntersectionObserver(
			([e]) => {
				proche = e.isIntersecting;
				planifie();
			},
			{ rootMargin: '20% 0px' }
		);
		io.observe(seccion);
		addEventListener('scroll', planifie, { passive: true });
		addEventListener('resize', planifie);
		mesure();
		return () => {
			io.disconnect();
			cancelAnimationFrame(attendu);
			removeEventListener('scroll', planifie);
			removeEventListener('resize', planifie);
		};
	});
</script>

{#snippet vers()}
	<blockquote class="vers">
		<p lang="oc">
			<span class="tb-linha"><span>{txt('acuelh.trobador.vers.1').oc}</span></span>
			<span class="tb-linha"><span style="--i: 1">{txt('acuelh.trobador.vers.2').oc}</span></span>
		</p>
		<cite
			>{#each segments(citaTx) as s, i (i)}{#if s.ital}<i>{s.t}</i>{:else}{s.t}{/if}{/each}</cite
		>
	</blockquote>
{/snippet}

<section class="tb tb-{forma}" class:vist id="trobador" bind:this={seccion}>
	{#if forma === 'pagina'}
		<figure class="media"><img src={fen.url} {alt} loading="lazy" decoding="async" width={fen.largor} height={fen.nautor} /></figure>
		{@render vers()}
	{:else}
		<figure class="media">
			<img src={fen.url} {alt} loading="lazy" decoding="async" width={fen.largor} height={fen.nautor} />
			{@render vers()}
		</figure>
	{/if}
</section>

<style>
	.tb {
		--p: 0.5;
		position: relative;
		z-index: 2;
	}
	img {
		display: block;
	}
	.vers {
		margin: 0;
	}
	.vers p {
		margin: 0;
		font-family: var(--votz, var(--font-quote));
		font-style: italic;
		font-weight: 500;
		line-height: 1.12;
	}
	/* chaque vers monte de derrière sa ligne, l'un après l'autre */
	.tb-linha {
		display: block;
		overflow: hidden;
		padding-bottom: 0.14em;
	}
	.tb-linha > span {
		display: block;
		transform: translateY(112%);
		transition: transform 1.1s cubic-bezier(0.19, 1, 0.22, 1);
		transition-delay: calc(var(--i, 0) * 140ms);
	}
	.vist .tb-linha > span {
		transform: none;
	}
	cite {
		display: block;
		margin-top: 1.5rem;
		font-style: normal;
		font-size: 0.92rem;
		opacity: 0;
		transition: opacity 0.9s 0.5s;
	}
	.vist cite {
		opacity: 1;
	}

	/* ── A. Dans la page : la photo dans le cadre des photos du site, le vers à côté ── */
	.tb-pagina {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		align-items: center;
		column-gap: clamp(2.5rem, 7vw, 8rem);
		max-width: 96rem;
		margin: 0 auto;
		padding: clamp(5rem, 16vh, 11rem) var(--marge, 1.5rem);
	}
	.tb-pagina .media {
		justify-self: end;
		width: min(100%, 64svh);
		aspect-ratio: 4 / 5;
		margin: 0;
		overflow: hidden;
		border-radius: 22px;
	}
	.tb-pagina img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 52%;
		transform: scale(calc(1 + 0.26 * var(--p)));
		transform-origin: 50% 53%;
	}
	.tb-pagina .vers {
		transform: translateY(calc((0.5 - var(--p)) * 5rem));
	}
	.tb-pagina .vers p {
		max-width: 12.5em;
		font-size: clamp(2rem, 3.5vw, 3.7rem);
		color: var(--t-tinta);
	}
	.tb-pagina cite {
		color: var(--t-aur);
	}
	@media (max-width: 52rem) {
		.tb-pagina {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 2.4rem;
			padding-block: 4.5rem;
		}
		.tb-pagina .media {
			justify-self: stretch;
			width: 100%;
		}
		.tb-pagina .vers {
			transform: none;
		}
		.tb-pagina .vers p {
			font-size: clamp(1.5rem, 7.3vw, 2.2rem);
		}
	}

	/* ── B. Sur la pierre : une seule image, le vers sur le linteau ── */
	.tb-peira {
		display: grid;
		justify-items: center;
		padding: clamp(4rem, 11vh, 8rem) var(--marge, 1.5rem);
	}
	.tb-peira .media {
		position: relative;
		height: min(calc(100svh - 7.5rem), 62rem);
		aspect-ratio: 1500 / 2173;
		max-width: 100%;
		margin: 0;
		overflow: hidden;
		border-radius: 22px;
		container-type: inline-size;
	}
	.tb-peira img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(calc(1 + 0.14 * var(--p)));
		transform-origin: 50% 54%;
	}
	.tb-peira .vers {
		position: absolute;
		inset: 6.5% 7% auto;
		text-align: center;
	}
	.tb-peira .vers p {
		font-size: clamp(1.3rem, 6.5cqi, 2.7rem);
		color: #fbf1e1;
	}
	/* le nom du poète, sous le vers, sur la même pierre sombre (en bas, la roche claire le rendait peu lisible : Joan) */
	.tb-peira cite {
		margin-top: clamp(0.7rem, 3cqi, 1.2rem);
		color: #ffd98a;
		font-size: clamp(0.8rem, 2.6cqi, 0.95rem);
	}
	@media (max-width: 40rem) {
		.tb-peira .media {
			width: 100%;
			height: auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tb-linha > span,
		cite {
			transition: none;
		}
	}
</style>
