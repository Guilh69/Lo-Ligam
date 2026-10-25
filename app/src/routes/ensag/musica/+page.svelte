<script>
	// Banc d'essai de l'espace musique, piste C « la table vue d'en haut »
	// (Romain, 2026-10-25). On entre après accord : rien de Deezer (images,
	// lecteur) n'est chargé avant « Intrar ». Sur la table du café : le journal
	// en occitan, dont chaque article présente un artiste ; « Pausar lo disc »
	// envoie son disque sur la platine, qui tourne, et ouvre le lecteur Deezer.
	// Pagina de trabalh, pas indexada.
	import { tick } from 'svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let { data } = $props();
	let fr = $derived(langStore.current === 'fr');
	let tx = $derived(
		fr
			? {
					musica: 'Musique',
					porta: 'Entrer dans le café',
					portaSota: 'Des musiques à écouter, le journal sur la table.',
					demanda: 'Entrer dans le café ?',
					acòrd: 'La musique vient de Deezer. En entrant, Deezer recevra ton adresse IP et pourra déposer des cookies.',
					intrar: 'Entrer',
					non: 'Non, merci',
					sortir: 'Sortir du café',
					programa: 'Au programme',
					escriure: 'À écrire',
					pausar: 'Poser le disque',
					suslaPlatina: 'Sur la platine',
					deezer: 'Sur Deezer',
					platinaVuèja: 'Choisis un article et pose son disque.',
					ticket: 'Un café et un disque'
				}
			: {
					musica: 'Musica',
					porta: 'Intrar dins lo cafè',
					portaSota: 'De musicas d’escotar, lo jornal sus la taula.',
					demanda: 'Intrar dins lo cafè ?',
					acòrd: 'La musica ven de Deezer. En intrant, Deezer recebrà ton adreça IP e poirà pausar de cookies.',
					intrar: 'Intrar',
					non: 'Non, mercé',
					sortir: 'Sortir del cafè',
					programa: 'Al programa',
					escriure: 'A escriure',
					pausar: 'Pausar lo disc',
					suslaPlatina: 'Sus la platina',
					deezer: 'Sus Deezer',
					platinaVuèja: 'Causís un article e pausa son disc.',
					ticket: 'Un cafè e un disc'
				}
	);

	let dialèg;
	let intrat = $state(false);
	let causit = $state(null); // l'artiste dont le disque est sur la platine
	let platina; // le disque posé (pour l'animation de vol)
	const fotos = {};
	const calma = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on';

	function intrar() {
		dialèg.close();
		intrat = true;
	}
	function sortir() {
		intrat = false;
		causit = null;
	}

	// le disque part de la photo de l'article et se pose sur la platine
	async function pausar(a) {
		const de = fotos[a.id]?.getBoundingClientRect();
		causit = a;
		await tick();
		const plat = document.querySelector('.platina');
		if (plat && plat.getBoundingClientRect().top < 0) plat.scrollIntoView({ behavior: calma() ? 'auto' : 'smooth', block: 'center' });
		if (!de || !platina || calma()) return;
		const a2 = platina.getBoundingClientRect();
		const s = de.width / a2.width;
		platina.animate(
			[
				{ transform: `translate(${de.left + de.width / 2 - (a2.left + a2.width / 2)}px, ${de.top + de.height / 2 - (a2.top + a2.height / 2)}px) scale(${s}) rotate(-90deg)`, opacity: 0.4 },
				{ transform: 'none', opacity: 1 }
			],
			{ duration: 750, easing: 'cubic-bezier(.2,.7,.2,1)' }
		);
	}
	const lector = (a) => `https://widget.deezer.com/widget/dark/artist/${a.id}/top_tracks?tracklist=true&radius=true`;
</script>

<svelte:head>
	<title>{tx.musica} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if !intrat}
	<main class="porta">
		<h1>{tx.musica}</h1>
		<button type="button" class="porta-teula" onclick={() => dialèg.showModal()}>
			<span class="porta-disc" aria-hidden="true"></span>
			<span class="porta-tèxt">
				<strong>{tx.porta}</strong>
				<span>{tx.portaSota}</span>
			</span>
		</button>
	</main>
{:else}
	<main class="cafè">
		<div class="lum" aria-hidden="true"></div>
		<button type="button" class="sortir" onclick={sortir}>← {tx.sortir}</button>

		<div class="taula">
			<article class="jornal" aria-labelledby="jornal-titol">
				<header class="jornal-cap">
					<h1 id="jornal-titol">Lo Jornal de la musica</h1>
					<p>N° 1 · Lo Ligam</p>
				</header>
				<div class="colonas">
					{#each data.artistas as a, i (a.id)}
						<section class="article" class:primièr={i === 0} class:causit={causit?.id === a.id}>
							<img bind:this={fotos[a.id]} class="article-foto" src={a.imatge} alt="" width="500" height="500" loading={i < 2 ? 'eager' : 'lazy'} />
							<h2>{a.nom}</h2>
							{#if a.album}<p class="article-album"><i>{a.album.titol}</i>{a.album.annada ? ` · ${a.album.annada}` : ''}</p>{/if}
							<p class="article-tèxt">{tx.escriure}</p>
							{#if a.titols.length}
								<p class="article-programa"><b>{tx.programa}</b> {a.titols.join(' · ')}</p>
							{/if}
							<button type="button" class="pausar" onclick={() => pausar(a)} aria-pressed={causit?.id === a.id}>
								{causit?.id === a.id ? tx.suslaPlatina : tx.pausar}
							</button>
						</section>
					{/each}
				</div>
			</article>

			<div class="costat">
				<div class="platina" class:vira={causit}>
					<div class="platina-plat"></div>
					{#if causit}
						<div class="disc" bind:this={platina}>
							<div class="disc-vira">
								{#if causit.album}<img src={causit.album.cobèrta} alt="" width="250" height="250" />{/if}
							</div>
						</div>
					{/if}
					<span class="platina-bras" aria-hidden="true"></span>
					<span class="platina-boton" aria-hidden="true"></span>
				</div>
				<p class="estat" aria-live="polite">
					{#if causit}<b>{tx.suslaPlatina} :</b> {causit.nom}{#if causit.album}{' · '}<i>{causit.album.titol}</i>{/if}{:else}{tx.platinaVuèja}{/if}
				</p>
				{#if causit}
					{#key causit.id}
						<iframe class="lector" title="{causit.nom} · Deezer" src={lector(causit)} width="100%" height="300" loading="lazy" allow="encrypted-media; clipboard-write"></iframe>
					{/key}
					<a class="deezer" href={causit.ligam} target="_blank" rel="noopener noreferrer">{tx.deezer} ↗</a>
				{/if}
				<div class="tassa" aria-hidden="true"><span class="vapor"></span></div>
				<p class="ticket" aria-hidden="true">{tx.ticket}</p>
			</div>
		</div>
	</main>
{/if}

<dialog bind:this={dialèg} class="acòrd" aria-labelledby="acòrd-titol">
	<h2 id="acòrd-titol">{tx.demanda}</h2>
	<p>{tx.acòrd}</p>
	<div class="acòrd-botons">
		<button type="button" class="intrar" onclick={intrar}>{tx.intrar}</button>
		<button type="button" class="non" onclick={() => dialèg.close()}>{tx.non}</button>
	</div>
</dialog>

<style>
	/* ---------- avant d'entrer ---------- */
	.porta {
		min-height: 70svh;
		display: grid;
		place-content: center;
		gap: 1.5rem;
		padding: 3rem 1rem;
		text-align: center;
	}
	.porta h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 6vw, 4rem);
		color: var(--color-primary, #b53d17);
	}
	.porta-teula {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		max-width: 30rem;
		padding: 1.1rem 1.4rem;
		border: 0;
		border-radius: 10px;
		background: #22100a;
		color: #fbf1e1;
		font: inherit;
		text-align: left;
		cursor: pointer;
		box-shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.7);
		transition: transform 0.25s;
	}
	.porta-teula:hover {
		transform: translateY(-2px);
	}
	.porta-teula:focus-visible {
		outline: 3px solid #f6b73c;
		outline-offset: 3px;
	}
	.porta-disc {
		flex: none;
		width: 4.2rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, #b53d17 0 18%, #111 19% 21%, transparent 22%), repeating-radial-gradient(circle, #141414 0 2px, #222 2px 4px);
	}
	.porta-tèxt strong {
		display: block;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		color: #f6b73c;
	}
	.porta-tèxt span {
		font-size: 0.95rem;
		opacity: 0.85;
	}

	/* ---------- la fenêtre d'accord ---------- */
	.acòrd {
		max-width: min(30rem, calc(100% - 2rem));
		padding: 1.6rem 1.7rem 1.4rem;
		border: 0;
		border-left: 4px solid #f6b73c;
		border-radius: 8px;
		background: #22100a;
		color: #fbf1e1;
		box-shadow: 0 30px 60px -20px #000;
	}
	.acòrd::backdrop {
		background: rgba(20, 10, 5, 0.6);
		backdrop-filter: blur(3px);
	}
	.acòrd h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.7rem;
		color: #f6b73c;
	}
	.acòrd p {
		margin: 0 0 1.2rem;
		line-height: 1.5;
	}
	.acòrd-botons {
		display: flex;
		gap: 0.7rem;
		flex-wrap: wrap;
	}
	.acòrd button {
		padding: 0.6rem 1.2rem;
		border-radius: 6px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.intrar {
		border: 0;
		background: #b53d17;
		color: #fff8ec;
	}
	.non {
		border: 1px solid rgba(251, 241, 225, 0.5);
		background: none;
		color: #fbf1e1;
	}
	.acòrd button:focus-visible {
		outline: 3px solid #f6b73c;
		outline-offset: 2px;
	}

	/* ---------- la table du café, vue d'en haut ---------- */
	.cafè {
		--papièr: #f3e6cc;
		--tinta: #2a1a10;
		--aur: #f6b73c;
		--roge: #b53d17;
		container: cafe / inline-size;
		position: relative;
		min-height: 100svh;
		overflow: clip;
		padding: clamp(3.5rem, 6vw, 4.5rem) clamp(0.9rem, 3vw, 2.5rem) 3rem;
		/* le bois de la table : veines fines et lames */
		background:
			repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12) 0 2px, transparent 2px 180px),
			repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0 1px, transparent 1px 9px),
			radial-gradient(ellipse 90% 80% at 50% 40%, #a5653a, #6e3d1f 70%, #4a2713);
		animation: arribar 0.6s ease-out both;
	}
	/* la lumière dorée de la fenêtre, qui tombe sur la table */
	.lum {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse 55% 45% at 12% 8%, rgba(255, 214, 140, 0.45), transparent 70%),
			linear-gradient(115deg, transparent 30%, rgba(255, 220, 150, 0.08) 40%, transparent 52%);
	}
	.sortir {
		position: absolute;
		top: 1rem;
		left: clamp(0.9rem, 3vw, 2.5rem);
		z-index: 2;
		padding: 0.45rem 0.9rem;
		border: 1px solid rgba(251, 241, 225, 0.45);
		border-radius: 99px;
		background: rgba(34, 16, 10, 0.65);
		color: #fbf1e1;
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}
	.taula {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) clamp(17rem, 30%, 24rem);
		gap: clamp(1.5rem, 3vw, 3rem);
		max-width: 78rem;
		margin: 0 auto;
		align-items: start;
	}

	/* le journal */
	.jornal {
		background:
			radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.35), transparent 60%),
			var(--papièr);
		color: var(--tinta);
		padding: clamp(1.1rem, 2.5vw, 2rem);
		transform: rotate(-1.2deg);
		box-shadow:
			0 30px 50px -25px rgba(0, 0, 0, 0.75),
			0 2px 4px rgba(0, 0, 0, 0.25);
		animation: jornal 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both;
	}
	.jornal-cap {
		text-align: center;
		border-bottom: 4px double var(--tinta);
		margin-bottom: 1rem;
	}
	.jornal-cap h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 5cqi, 3.6rem);
		line-height: 1;
	}
	.jornal-cap p {
		margin: 0.35rem 0 0.4rem;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.colonas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
		gap: 1.2rem 1.4rem;
	}
	.article {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid color-mix(in srgb, var(--tinta) 25%, transparent);
	}
	.article.primièr {
		grid-column: span 2;
	}
	.article-foto {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		/* photo de journal : noir et blanc, la couleur revient sur la platine */
		filter: grayscale(1) sepia(0.25) contrast(1.05);
		transition: filter 0.5s;
	}
	.article:hover .article-foto,
	.article.causit .article-foto {
		filter: none;
	}
	.article h2 {
		margin: 0.2rem 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.45rem;
		line-height: 1.05;
	}
	.primièr h2 {
		font-size: clamp(1.8rem, 3.2cqi, 2.4rem);
	}
	.article-album {
		margin: 0;
		font-family: 'Cormorant', Georgia, serif;
		font-size: 1.12rem;
	}
	.article-tèxt {
		margin: 0;
		font-style: italic;
		opacity: 0.55;
	}
	.article-programa {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}
	.article-programa b {
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-right: 0.3rem;
	}
	.pausar {
		align-self: flex-start;
		margin-top: 0.3rem;
		padding: 0.25rem 0;
		border: 0;
		border-bottom: 2px solid var(--roge);
		background: none;
		color: var(--tinta);
		font: inherit;
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
	}
	.pausar[aria-pressed='true'] {
		border-bottom-color: transparent;
		color: var(--roge);
	}
	.pausar:focus-visible,
	.sortir:focus-visible,
	.deezer:focus-visible {
		outline: 3px solid var(--aur);
		outline-offset: 3px;
	}

	/* à côté du journal : la platine, le lecteur, la tasse */
	.costat {
		position: sticky;
		top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		animation: costat 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s both;
	}
	.platina {
		position: relative;
		aspect-ratio: 1;
		border-radius: 10px;
		background: linear-gradient(135deg, #6a3a1c, #4b2812);
		box-shadow:
			0 24px 36px -18px rgba(0, 0, 0, 0.85),
			inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}
	.platina-plat {
		position: absolute;
		left: 7%;
		top: 7%;
		width: 78%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, #3a3a3a 0 3%, #1b1b1b 4% 100%);
		box-shadow: 0 0 0 4px #2a2a2a;
	}
	.disc {
		position: absolute;
		left: 7%;
		top: 7%;
		width: 78%;
		aspect-ratio: 1;
		z-index: 1;
	}
	.disc-vira {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: repeating-radial-gradient(circle, #121212 0 2px, #1f1f1f 2px 4px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
		display: grid;
		place-items: center;
	}
	.disc-vira img {
		width: 36%;
		height: auto;
		aspect-ratio: 1;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 0 0 3px #111;
	}
	/* 33 tours : un tour toutes les 1,8 s */
	.vira .disc-vira {
		animation: virar 1.8s linear infinite;
	}
	.platina-bras {
		position: absolute;
		right: 8%;
		top: 8%;
		width: 5px;
		height: 55%;
		border-radius: 3px;
		background: linear-gradient(#efe3c8, #b9a882);
		transform-origin: 50% 4%;
		transform: rotate(4deg);
		transition: transform 0.8s cubic-bezier(0.3, 0.6, 0.3, 1) 0.5s;
		z-index: 2;
	}
	.platina-bras::before {
		content: '';
		position: absolute;
		left: -6px;
		top: -6px;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: #cdbd99;
	}
	.vira .platina-bras {
		transform: rotate(26deg);
	}
	.platina-boton {
		position: absolute;
		left: 6%;
		bottom: 4%;
		width: 9%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #2a160a;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
	}
	.vira .platina-boton {
		background: radial-gradient(circle, var(--aur) 0 30%, #2a160a 32%);
	}
	.estat {
		margin: 0;
		padding: 0.55rem 0.8rem;
		border-radius: 6px;
		background: rgba(34, 16, 10, 0.72);
		color: #fbf1e1;
		font-size: 0.92rem;
	}
	.estat b {
		color: var(--aur);
	}
	.lector {
		display: block;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.8);
	}
	.deezer {
		align-self: flex-start;
		color: #fbf1e1;
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration-color: var(--roge);
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}
	.tassa {
		position: relative;
		align-self: flex-end;
		width: 7.5rem;
		aspect-ratio: 1;
		margin: 0.6rem 1.5rem 0 0;
		border-radius: 50%;
		background: radial-gradient(circle, #3b1f10 0 40%, #6b3c1f 41% 43%, #f3ead8 44% 62%, #e3d6bc 63% 100%);
		box-shadow: 0 10px 16px -8px rgba(0, 0, 0, 0.7);
	}
	.tassa::after {
		content: '';
		position: absolute;
		right: -12%;
		top: 38%;
		width: 20%;
		height: 22%;
		border: 4px solid #e3d6bc;
		border-radius: 40%;
	}
	.vapor {
		position: absolute;
		inset: 25%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 70%);
		filter: blur(6px);
		animation: vapor 4s ease-in-out infinite;
	}
	.ticket {
		align-self: flex-end;
		margin: -0.4rem 6.5rem 0 0;
		padding: 0.5rem 0.7rem;
		background: #fbf6ea;
		color: var(--tinta);
		font-family: 'Cormorant', Georgia, serif;
		font-style: italic;
		font-size: 1rem;
		transform: rotate(7deg);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
	}

	@keyframes virar {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes vapor {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translate(6%, -8%) scale(1.15);
			opacity: 0.25;
		}
	}
	@keyframes arribar {
		from {
			opacity: 0;
		}
	}
	@keyframes jornal {
		from {
			opacity: 0;
			transform: translateY(40px) rotate(-4deg);
		}
	}
	@keyframes costat {
		from {
			opacity: 0;
			transform: translateX(40px);
		}
	}

	/* téléphone : la platine et la tasse au-dessus, le journal en dessous */
	@container cafe (max-width: 760px) {
		.taula {
			grid-template-columns: 1fr;
		}
		.costat {
			position: static;
			order: -1;
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
		}
		.platina {
			width: min(15rem, 62vw);
		}
		.estat,
		.lector,
		.deezer {
			grid-column: 1 / -1;
		}
		.tassa {
			grid-row: 1;
			grid-column: 2;
			width: 5.5rem;
			margin: 0;
		}
		.ticket {
			display: none;
		}
		.jornal {
			transform: rotate(-0.6deg);
		}
		.article.primièr {
			grid-column: auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cafè,
		.jornal,
		.costat,
		.vira .disc-vira,
		.vapor {
			animation: none;
		}
	}
	:global(html[data-leugier='on']) .vira .disc-vira,
	:global(html[data-leugier='on']) .vapor {
		animation: none;
	}
</style>
