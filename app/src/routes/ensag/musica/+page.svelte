<script>
	// Banc d'essai de l'espace musique, piste C « la table vue d'en haut »
	// (Romain, 2026-10-25), deuxième version. On entre après accord : rien de
	// Deezer (images, lecteur) n'est chargé avant « Intrar ». Sur la table du
	// café : le journal en occitan, à pages (en une les coups de cœur et les
	// dernières sorties, puis tous les artistes de A à Z) ; « Pausar lo disc »
	// envoie le dernier album de l'artiste sur la platine, et le lecteur Deezer
	// de cet album s'ouvre dessous (lecteur B). Pagina de trabalh, pas indexada.
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let { data } = $props();
	let fr = $derived(langStore.current === 'fr');
	let tx = $derived(
		fr
			? {
					musica: 'Musique',
					frasa: 'Un café, le journal sur la table, et de la musique à écouter.',
					jornal: 'Le Journal de la musique',
					jornalSota: 'Les nouveautés et les coups de cœur de Lo Ligam',
					acòrd: 'La musique vient de Deezer : en entrant, Deezer recevra ton adresse IP et pourra déposer des cookies.',
					intrar: 'Entrer',
					legir: 'Lecture',
					pausa: 'Pause',
					sortir: 'Sortir du café',
					còps: 'Coups de cœur',
					novetats: 'Nouveautés',
					escriure: 'À écrire',
					discRecent: 'Le disque le plus récent',
					pausar: 'Poser le disque',
					suslaPlatina: 'Sur la platine',
					deezer: 'Sur Deezer',
					platinaVuèja: 'Choisis un article et pose son disque.',
					precedenta: 'Page précédente',
					seguenta: 'Page suivante',
					pagina: (n, t) => `Page ${n} sur ${t}`,
					letras: 'Les artistes, de A à Z',
					ticket: 'Un café et un disque'
				}
			: {
					musica: 'Musica',
					frasa: 'Un cafè, lo jornal sus la taula, e de musica d’escotar.',
					jornal: 'Lo Jornal de la musica',
					jornalSota: 'Las novetats e los còps de còr de Lo Ligam',
					acòrd: 'La musica ven de Deezer : en dintrant, Deezer recebrà ton adreça IP e poirà pausar de cookies.',
					intrar: 'Dintrar',
					legir: 'Lectura',
					pausa: 'Pausa',
					sortir: 'Sortir del cafè',
					còps: 'Còps de còr',
					novetats: 'Novetats',
					escriure: 'A escriure',
					discRecent: 'Lo disc mai recent',
					pausar: 'Pausar lo disc',
					suslaPlatina: 'Sus la platina',
					deezer: 'Sus Deezer',
					platinaVuèja: 'Causís un article e pausa son disc.',
					precedenta: 'Pagina precedenta',
					seguenta: 'Pagina seguenta',
					pagina: (n, t) => `Pagina ${n} sus ${t}`,
					letras: 'De A a Z',
					ticket: 'Un cafè e un disc'
				}
	);

	// « ?dintrar » : pour un lien qui porte déjà l'avis sur Deezer, on est tout
	// de suite dedans. La case Musica d'Òbras n'en a plus (2026-10-25) : le café
	// montre sa propre porte, avec l'avis.
	let intrat = $state(page.url.searchParams.has('dintrar'));
	let jòga = $state(false); // la musique joue (le lecteur Deezer nous le dit)
	let partit = $state(false); // le lecteur a déjà lancé un morceau de ce disque
	let autoplay = $state(false);
	let lectorEl;
	let causit = $state(null); // l'artiste dont le disque est sur la platine
	let pagina = $state(0); // 0 = la une, puis les pages de A à Z
	let sens = $state(1); // sens de la page tournée
	let platina; // le disque posé (pour l'animation de vol)
	let jornal;
	const fotos = {};
	const total = $derived(data.az.length + 1);
	const calma = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on';
	// les lettres des artistes d'une page de A à Z
	const letrasDe = (n) => (n ? [...new Set(data.az[n - 1].map((a) => a.nom.normalize('NFD')[0].toUpperCase()))] : []);
	// photos de Deezer à la taille d'affichage (sobriété) : 250 px suffit aux petits articles
	const talha = (u, n) => u.replace(/\/\d+x\d+-/, `/${n}x${n}-`);

	// un seul clic pour entrer (Romain, 2026-10-25 : « deux fois Intrar, c'est
	// trop ») : l'avis sur Deezer est écrit sur la case, avant le clic
	function intrar() {
		intrat = true;
	}
	function sortir() {
		intrat = false;
		causit = null;
		jòga = partit = autoplay = false;
		pagina = 0;
	}
	async function anar(n) {
		if (n < 0 || n >= total || n === pagina) return;
		sens = n > pagina ? 1 : -1;
		pagina = n;
		await tick();
		if (jornal.getBoundingClientRect().top < 0) jornal.scrollIntoView({ behavior: calma() ? 'auto' : 'smooth' });
	}

	// le disque part de la photo de l'article et se pose sur la platine
	async function pausar(a, clau) {
		const de = fotos[clau]?.getBoundingClientRect();
		if (causit?.id !== a.id) jòga = partit = autoplay = false;
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
	// la date de sortie ; les mois en occitan écrits ici (les navigateurs ne les connaissent pas)
	const MESES = ['genièr', 'febrièr', 'març', 'abril', 'mai', 'junh', 'julhet', 'agost', 'setembre', 'octobre', 'novembre', 'decembre'];
	const datar = (d) => {
		const [y, m, j] = d.split('-').map(Number);
		return fr ? new Date(y, m - 1, j).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : `${j} de ${MESES[m - 1]} de ${y}`;
	};
	// le bouton du disque pilote le lecteur officiel : Deezer accepte « play » et
	// « pause » par message, et nous prévient quand on lance ou arrête la
	// musique dans son lecteur (pas d'ordre « morceau suivant » : on le choisit
	// dans la liste du lecteur, sous la platine). Au premier appui, le morceau
	// n'est pas encore chargé et « play » ne ferait rien : on recharge le
	// lecteur avec son démarrage automatique (l'appui sur le disque vaut accord).
	const DEEZER = 'https://widget.deezer.com';
	function jogar() {
		if (!partit) autoplay = true;
		else lectorEl?.contentWindow?.postMessage({ action: jòga ? 'pause' : 'play' }, DEEZER);
		jòga = !jòga;
	}
	$effect(() => {
		const escotar = (e) => {
			if (e.origin !== DEEZER) return;
			if (e.data?.action === 'play') jòga = partit = true;
			else if (e.data?.action === 'pause') jòga = false;
		};
		addEventListener('message', escotar);
		return () => removeEventListener('message', escotar);
	});
	const lector = (a, auto) => `https://widget.deezer.com/widget/dark/album/${a.album.id}?tracklist=true&radius=true${auto ? '&autoplay=1' : ''}`;
</script>

<svelte:head>
	<title>{tx.musica} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet disc()}
	<svg class="icona-disc" viewBox="0 0 24 24" aria-hidden="true">
		<circle cx="12" cy="12" r="10.5" fill="currentColor" />
		<circle cx="12" cy="12" r="7" fill="none" stroke="var(--fons-boton, #b53d17)" stroke-opacity=".45" stroke-width=".8" />
		<circle cx="12" cy="12" r="3.4" fill="var(--fons-boton, #b53d17)" />
		<circle cx="12" cy="12" r="1" fill="currentColor" />
	</svg>
{/snippet}

<!-- un article du journal : photo de l'artiste, nom, dernier album, bouton -->
{#snippet article(a, clau, granda = false, data_ = false)}
	<section class="article" class:granda class:causit={causit?.id === a.id}>
		<img
			bind:this={fotos[clau]}
			class="article-foto"
			src={talha(a.imatge, granda ? 500 : 250)}
			alt=""
			width={granda ? 500 : 250}
			height={granda ? 500 : 250}
			loading={pagina === 0 && granda ? 'eager' : 'lazy'}
		/>
		<h3>{#if a.còr}<span class="estela" aria-label={tx.còps}>★</span>{/if}{a.nom}</h3>
		<p class="article-album">
			<span class="article-etiqueta">{tx.discRecent}</span>
			<i>{a.album.titol}</i> ({a.annada})
		</p>
		{#if granda}<p class="article-tèxt">{tx.escriure}</p>{/if}
		{#if data_}<p class="article-data">{datar(a.album.data)}</p>{/if}
		<button type="button" class="pausar" onclick={() => pausar(a, clau)} aria-pressed={causit?.id === a.id}>
			{@render disc()}
			<span>{causit?.id === a.id ? tx.suslaPlatina : tx.pausar}</span>
		</button>
	</section>
{/snippet}

<div class="pagina-site">
	<div class="capçal"><AppHeader /></div>

	{#if !intrat}
		<main class="porta">
			<header class="cap">
				<h1>{tx.musica}</h1>
				<p class="frasa">{tx.frasa}</p>
			</header>
			<button type="button" class="porta-teula" onclick={intrar}>
				<span class="porta-nom">{tx.jornal}</span>
				<span class="porta-sota">{tx.jornalSota}</span>
				<span class="porta-disc" aria-hidden="true"></span>
				<span class="porta-intrar">{tx.intrar} →</span>
				<span class="porta-avís">{tx.acòrd}</span>
			</button>
		</main>
	{:else}
		<main class="cafè">
			<div class="lum" aria-hidden="true"></div>

			<div class="taula">
				<article class="jornal" aria-labelledby="jornal-titol" bind:this={jornal}>
					<button type="button" class="sortir" onclick={sortir}>← {tx.sortir}</button>
					<header class="jornal-cap">
						<h1 id="jornal-titol">{tx.jornal}</h1>
						<p class="jornal-sota">{tx.jornalSota}</p>
						<p class="folio" aria-live="polite">{tx.pagina(pagina + 1, total)}</p>
					</header>

					{#key pagina}
						<div class="fuèlha" class:enrè={sens < 0}>
							{#if pagina === 0}
								<h2 class="rubrica"><span aria-hidden="true">★</span> {tx.còps}</h2>
								<div class="colonas còps">
									{#each data.còps as a (a.id)}{@render article(a, `c${a.id}`, true)}{/each}
								</div>
								<h2 class="rubrica">{tx.novetats}</h2>
								<div class="colonas">
									{#each data.novetats as a (a.id)}{@render article(a, `n${a.id}`, false, true)}{/each}
								</div>
							{:else}
								<h2 class="rubrica">{letrasDe(pagina).join(' · ')}</h2>
								<div class="colonas">
									{#each data.az[pagina - 1] as a (a.id)}{@render article(a, `a${a.id}`)}{/each}
								</div>
							{/if}
						</div>
					{/key}

					<nav class="tornar-pagina" aria-label={tx.letras}>
						<ul class="letras">
							<li><button type="button" class:actiu={pagina === 0} onclick={() => anar(0)} aria-label={tx.còps}>★</button></li>
							{#each data.letras as l (l.l)}
								<li><button type="button" class:actiu={letrasDe(pagina).includes(l.l)} onclick={() => anar(l.pagina)}>{l.l}</button></li>
							{/each}
						</ul>
						<button type="button" class="fuèlh" onclick={() => anar(pagina - 1)} disabled={pagina === 0}>← {tx.precedenta}</button>
						<button type="button" class="fuèlh" onclick={() => anar(pagina + 1)} disabled={pagina === total - 1}>{tx.seguenta} →</button>
					</nav>
				</article>

				<div class="costat">
					<div class="platina" class:vira={causit && jòga}>
						<div class="platina-plat"></div>
						{#if causit}
							<div class="disc" bind:this={platina}>
								<div class="disc-vira">
									<img src={causit.album.cobèrta} alt="" width="250" height="250" />
								</div>
							</div>
						{/if}
						<span class="platina-bras" aria-hidden="true"></span>
						<span class="platina-boton" aria-hidden="true"></span>
						{#if causit}
							<button type="button" class="jogar" onclick={jogar} aria-label={jòga ? tx.pausa : tx.legir} title={jòga ? tx.pausa : tx.legir}>
								<svg viewBox="0 0 24 24" aria-hidden="true">
									{#if jòga}<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />{:else}<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />{/if}
								</svg>
							</button>
						{/if}
					</div>
					<p class="estat" class:vuèja={!causit} aria-live="polite">
						{#if causit}<b>{tx.suslaPlatina} :</b> {causit.nom}{' · '}<i>{causit.album.titol}</i> ({causit.annada}){:else}{tx.platinaVuèja}{/if}
					</p>
					{#if causit}
						{#key causit.id}
							<iframe bind:this={lectorEl} class="lector" title="{causit.nom}, {causit.album.titol} · Deezer" src={lector(causit, autoplay)} width="100%" height="320" loading="lazy" allow="autoplay; encrypted-media; clipboard-write"></iframe>
						{/key}
						<a class="deezer" href={causit.ligam ?? `https://www.deezer.com/artist/${causit.id}`} target="_blank" rel="noopener noreferrer">{tx.deezer} ↗</a>
					{/if}
					<div class="tassa" aria-hidden="true"><span class="vapor"></span></div>
					<p class="ticket" aria-hidden="true">{tx.ticket}</p>
				</div>
			</div>
		</main>
	{/if}
</div>


<style>
	/* ---------- la page, comme les pages de rubrique (PaginaTeulas) ---------- */
	.pagina-site {
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
		position: relative;
		z-index: 3;
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}

	/* ---------- avant d'entrer ---------- */
	.porta {
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}
	.cap {
		margin-bottom: var(--esp-48);
	}
	.cap h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
	}
	.frasa {
		max-width: 38ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	/* la case du café : la grande case des rubriques, en brique, un disque qui dépasse */
	.porta-teula {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: min(100%, 36rem);
		aspect-ratio: 1;
		padding: var(--esp-32);
		border: 0;
		border-radius: 6px;
		background: #b53d17;
		color: #fbf1e1;
		font: inherit;
		text-align: left;
		cursor: pointer;
		overflow: clip;
		container: porta / inline-size;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.porta-nom {
		max-width: 12ch;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3.4rem);
		line-height: 1.05;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.porta-sota {
		max-width: 32ch;
		margin-top: var(--esp-12);
		font-size: clamp(1.05rem, 1.4vw, 1.25rem);
		line-height: 1.45;
	}
	.porta-disc {
		position: absolute;
		right: -18%;
		bottom: -18%;
		width: 72%;
		aspect-ratio: 1;
		border-radius: 50%;
		background:
			radial-gradient(circle, #fbf1e1 0 2%, #eeaf34 2.5% 17%, #141414 17.5% 19%, transparent 19.5%),
			repeating-radial-gradient(circle, #141414 0 2px, #202020 2px 4px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.porta-intrar {
		margin-top: auto;
		padding: 0.55rem 1.1rem;
		border-radius: 99px;
		background: #fbf1e1;
		color: #2a1a10;
		font-weight: 700;
		position: relative;
		z-index: 1;
	}
	.porta-avís {
		position: relative;
		z-index: 1;
		max-width: 34ch;
		margin-top: var(--esp-12);
		font-size: 0.85rem;
		line-height: 1.4;
		opacity: 0.9;
	}
	/* case étroite (téléphone) : le disque se fait plus petit, l'avis reste à côté */
	@container porta (max-width: 480px) {
		.porta-disc {
			width: 52%;
			right: -16%;
			bottom: -16%;
		}
		.porta-avís {
			max-width: 64%;
		}
	}
	.porta-teula:hover,
	.porta-teula:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	.porta-teula:hover .porta-disc,
	.porta-teula:focus-visible .porta-disc {
		transform: rotate(160deg);
	}
	.porta-teula:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
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
		padding: clamp(2rem, 4vw, 3rem) clamp(0.9rem, 3vw, 2.5rem) 3rem;
		/* le bois de la table : veines fines et lames */
		background:
			repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12) 0 2px, transparent 2px 180px),
			repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0 1px, transparent 1px 9px),
			radial-gradient(ellipse 90% 80% at 50% 40%, #a5653a, #6e3d1f 70%, #4a2713);
		animation: aparéisser 0.6s ease-out both;
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
		position: relative;
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
		scroll-margin-top: 1rem;
	}
	.sortir {
		display: block;
		margin: 0 0 var(--esp-12);
		padding: 0.4rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--tinta) 35%, transparent);
		border-radius: 99px;
		background: none;
		color: var(--tinta);
		font: inherit;
		font-size: 0.88rem;
		cursor: pointer;
	}
	.sortir:hover {
		background: color-mix(in srgb, var(--tinta) 8%, transparent);
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
	.jornal-sota {
		margin: 0.4rem 0 0;
		font-family: 'Cormorant', Georgia, serif;
		font-style: italic;
		font-size: 1.15rem;
	}
	.folio {
		margin: 0.5rem 0 0.4rem;
		padding-top: 0.35rem;
		border-top: 1px solid color-mix(in srgb, var(--tinta) 30%, transparent);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	/* la page tournée */
	.fuèlha {
		transform-origin: 0 50%;
		animation: tornar 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.fuèlha.enrè {
		transform-origin: 100% 50%;
		animation-name: tornar-enrè;
	}
	.rubrica {
		margin: 0.4rem 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.15rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border-bottom: 1px solid var(--tinta);
	}
	.rubrica span {
		color: var(--roge);
	}
	.colonas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: 1.2rem 1.4rem;
		margin-bottom: 1.4rem;
	}
	.colonas.còps {
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}
	.article {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid color-mix(in srgb, var(--tinta) 25%, transparent);
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
	.article h3 {
		margin: 0.2rem 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.4rem;
		line-height: 1.05;
	}
	.granda h3 {
		font-size: clamp(1.6rem, 2.8cqi, 2.1rem);
	}
	.estela {
		margin-right: 0.3em;
		color: var(--roge);
	}
	.article-album {
		margin: 0;
		font-family: 'Cormorant', Georgia, serif;
		font-size: 1.12rem;
		line-height: 1.25;
	}
	.article-etiqueta {
		display: block;
		font-family: var(--font-body, inherit);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.75;
	}
	.article-tèxt {
		margin: 0;
		font-style: italic;
		opacity: 0.55;
	}
	.article-data {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.75;
	}
	/* le bouton : aplat brique (rouge = clic), l'icône du disque */
	.pausar {
		--fons-boton: #b53d17;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		align-self: flex-start;
		margin-top: auto;
		padding: 0.5rem 1rem 0.5rem 0.55rem;
		border: 0;
		border-radius: 99px;
		background: var(--fons-boton);
		color: #fbf1e1;
		font: inherit;
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
		transition:
			transform 0.2s,
			background 0.2s;
	}
	.pausar:hover {
		transform: translateY(-1px);
		--fons-boton: #9a3212;
	}
	.icona-disc {
		width: 1.45rem;
		height: 1.45rem;
		color: #141414;
		transition: transform 0.6s;
	}
	.pausar:hover .icona-disc {
		transform: rotate(120deg);
	}
	.pausar[aria-pressed='true'] {
		--fons-boton: #2a1a10;
	}
	.pausar[aria-pressed='true'] .icona-disc {
		color: #3a3a3a;
		animation: virar 1.8s linear infinite;
	}
	/* le signe à l'arrivée : le premier bouton respire deux fois */
	.fuèlha:not(:has(.causit)) .colonas:first-of-type .article:first-child .pausar {
		animation: alenar 1.4s ease-in-out 1.2s 2;
	}
	.pausar:focus-visible,
	.sortir:focus-visible,
	.fuèlh:focus-visible,
	.letras button:focus-visible,
	.deezer:focus-visible {
		outline: 3px solid var(--aur);
		outline-offset: 3px;
	}

	/* tourner les pages, et l'index des lettres */
	.tornar-pagina {
		display: grid;
		grid-template-columns: auto auto;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		padding-top: 0.8rem;
		border-top: 4px double var(--tinta);
	}
	.fuèlh {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--tinta);
		border-radius: 99px;
		background: none;
		color: var(--tinta);
		font: inherit;
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
	}
	.fuèlh:hover:not(:disabled) {
		background: var(--tinta);
		color: var(--papièr);
	}
	.fuèlh:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.letras {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.15rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.letras button {
		min-width: 1.9rem;
		height: 1.9rem;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--tinta);
		font-family: var(--font-heading);
		font-size: 1rem;
		cursor: pointer;
	}
	.letras button:hover {
		background: color-mix(in srgb, var(--tinta) 10%, transparent);
	}
	.letras button.actiu {
		background: var(--roge);
		color: #fbf1e1;
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
		width: 40%;
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
	/* lecture et pause, en bas à droite du disque (Romain, 2026-10-25) */
	.jogar {
		position: absolute;
		right: 4%;
		bottom: 4%;
		z-index: 3;
		display: grid;
		place-items: center;
		width: 18%;
		aspect-ratio: 1;
		border: 0;
		border-radius: 50%;
		background: var(--roge);
		color: #fbf1e1;
		cursor: pointer;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
		transition: transform 0.2s;
	}
	.jogar svg {
		width: 46%;
		height: 46%;
	}
	.jogar:hover {
		transform: scale(1.06);
	}
	.jogar:focus-visible {
		outline: 3px solid var(--aur);
		outline-offset: 3px;
	}
	/* le disque posé attend : le bouton respire */
	.platina:not(.vira) .jogar {
		animation: alenar 1.6s ease-in-out 0.9s 3;
	}
	.estat {
		margin: 0;
		padding: 0.55rem 0.8rem;
		border-radius: 6px;
		background: rgba(34, 16, 10, 0.78);
		color: #fbf1e1;
		font-size: 0.92rem;
	}
	.estat.vuèja {
		border-left: 3px solid var(--aur);
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
	@keyframes aparéisser {
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
	@keyframes tornar {
		from {
			opacity: 0;
			transform: perspective(1800px) rotateY(-28deg) translateX(24px);
		}
	}
	@keyframes tornar-enrè {
		from {
			opacity: 0;
			transform: perspective(1800px) rotateY(28deg) translateX(-24px);
		}
	}
	@keyframes alenar {
		50% {
			transform: scale(1.08);
			box-shadow: 0 0 0 6px color-mix(in srgb, var(--roge) 25%, transparent);
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
		.fuèlh {
			font-size: 0.8rem;
			padding: 0.4rem 0.65rem;
			white-space: nowrap;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cafè,
		.jornal,
		.costat,
		.fuèlha,
		.porta-teula,
		.vira .disc-vira,
		.pausar,
		.pausar .icona-disc,
		.jogar,
		.vapor {
			animation: none !important;
		}
	}
	:global(html[data-leugier='on']) .vira .disc-vira,
	:global(html[data-leugier='on']) .fuèlha,
	:global(html[data-leugier='on']) .pausar,
	:global(html[data-leugier='on']) .jogar,
	:global(html[data-leugier='on']) .icona-disc,
	:global(html[data-leugier='on']) .vapor {
		animation: none !important;
	}
</style>
