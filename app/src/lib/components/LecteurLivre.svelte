<script>
	// Lecteur de livre à pages tournantes (2026-10-29) : la bibliothèque libre
	// StPageFlip (page-flip, MIT) fait tourner les pages ; le bruit du papier
	// est fabriqué sur place (aucun fichier son), discret et désactivable ;
	// un mode texte donne le texte réel de chaque page (lecteurs d'écran,
	// petits écrans). Sobriété : les images des pages ne sont chargées qu'à
	// l'approche de la page lue.
	import { onMount } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	let { base, total, titol = '' } = $props();

	let livreEl = $state();
	let flip = null;
	let pagina = $state(0); // page affichée, à partir de 0
	let mode = $state('libre'); // 'libre' | 'tèxte'
	let son = $state(true);
	let pret = $state(false);
	let reduit = false;
	let textes = $state(null);
	let erreur = $state(false);
	let aller = $state('');
	let ctx = null;

	const CLAU_SON = 'lo-ligam-livre-son';
	const url = (i) => `${base}/p${String(i + 1).padStart(3, '0')}.webp`;

	function chargar(i) {
		if (!livreEl) return;
		for (let k = Math.max(0, i - 2); k <= Math.min(total - 1, i + 6); k++) {
			const img = livreEl.querySelector(`img[data-i="${k}"]`);
			if (img && !img.src) img.src = url(k);
		}
	}

	// le bruit du papier : un souffle filtré, court, qui monte dans les aigus
	function souffle() {
		if (!son || reduit) return;
		try {
			ctx ??= new (window.AudioContext || window.webkitAudioContext)();
			if (ctx.state === 'suspended') ctx.resume();
			const d = 0.34;
			const sr = ctx.sampleRate;
			const buf = ctx.createBuffer(1, Math.floor(sr * d), sr);
			const data = buf.getChannelData(0);
			for (let i = 0; i < data.length; i++) {
				const t = i / data.length;
				data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 1.6);
			}
			const src = ctx.createBufferSource();
			src.buffer = buf;
			const f = ctx.createBiquadFilter();
			f.type = 'bandpass';
			f.Q.value = 0.8;
			f.frequency.setValueAtTime(1300, ctx.currentTime);
			f.frequency.exponentialRampToValueAtTime(5400, ctx.currentTime + d);
			const g = ctx.createGain();
			g.gain.value = 0.2;
			src.connect(f).connect(g).connect(ctx.destination);
			src.start();
		} catch {
			/* pas de son : le livre se feuillette quand même */
		}
	}

	function basculerSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {
			/* préférence non gardée */
		}
		if (son) souffle();
	}

	onMount(() => {
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {
			/* son activé par défaut */
		}
		reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduit) son = false;
		let mort = false;

		(async () => {
			try {
				const { PageFlip } = await import('page-flip');
				if (mort || !livreEl) return;
				const pages = [];
				for (let i = 0; i < total; i++) {
					const p = document.createElement('div');
					p.className = 'pg';
					p.dataset.density = i === 0 || i === total - 1 ? 'hard' : 'soft';
					const img = document.createElement('img');
					img.dataset.i = String(i);
					img.alt = '';
					img.decoding = 'async';
					img.draggable = false;
					p.appendChild(img);
					pages.push(p);
				}
				flip = new PageFlip(livreEl, {
					width: 420,
					height: 664,
					size: 'stretch',
					minWidth: 230,
					maxWidth: 620,
					minHeight: 360,
					maxHeight: Math.max(360, Math.min(980, Math.round(window.innerHeight - 230))),
					showCover: true,
					usePortrait: true,
					maxShadowOpacity: 0.45,
					mobileScrollSupport: false,
					flippingTime: reduit ? 1 : 780,
					drawShadow: !reduit
				});
				flip.loadFromHTML(pages);
				chargar(0);
				flip.on('flip', (e) => {
					pagina = e.data;
					chargar(e.data);
				});
				flip.on('changeState', (e) => {
					if (e.data === 'flipping') souffle();
				});
				pret = true;
			} catch {
				erreur = true;
			}
		})();

		return () => {
			mort = true;
			try {
				flip?.destroy();
			} catch {
				/* déjà démonté */
			}
			ctx?.close?.();
		};
	});

	function suivante() {
		if (mode === 'tèxte') return anar(pagina + 1);
		flip?.flipNext();
	}
	function precedenta() {
		if (mode === 'tèxte') return anar(pagina - 1);
		flip?.flipPrev();
	}
	function anar(i) {
		const n = Math.min(total - 1, Math.max(0, i));
		pagina = n;
		chargar(n);
		if (mode === 'libre') flip?.turnToPage(n);
	}
	function validarAnar(e) {
		e.preventDefault();
		const n = parseInt(aller, 10);
		if (Number.isFinite(n)) anar(n - 1);
		aller = '';
	}

	async function basculerMode() {
		if (mode === 'libre') {
			mode = 'tèxte';
			if (!textes) {
				try {
					textes = await (await fetch(`${base}/texte.json`)).json();
				} catch {
					erreur = true;
				}
			}
		} else {
			mode = 'libre';
			queueMicrotask(() => {
				flip?.update?.();
				flip?.turnToPage(pagina);
				chargar(pagina);
			});
		}
	}

	function clavier(e) {
		if (e.target instanceof HTMLInputElement) return;
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			suivante();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			precedenta();
		}
	}

	let lignes = $derived(textes?.[pagina] ?? []);
	const t = {
		prec: { oc: 'Pagina precedenta', fr: 'Page précédente', es: 'Página anterior', en: 'Previous page', ca: 'Pàgina anterior', ar: 'الصفحة السابقة' },
		seg: { oc: 'Pagina seguenta', fr: 'Page suivante', es: 'Página siguiente', en: 'Next page', ca: 'Pàgina següent', ar: 'الصفحة التالية' },
		anar: { oc: 'Anar a la pagina', fr: 'Aller à la page', es: 'Ir a la página', en: 'Go to page', ca: 'Anar a la pàgina', ar: 'الانتقال إلى الصفحة' },
		ok: { oc: 'Anar', fr: 'Aller', es: 'Ir', en: 'Go', ca: 'Anar', ar: 'انتقال' },
		sonA: { oc: 'Son : actiu', fr: 'Son : activé', es: 'Sonido: activado', en: 'Sound: on', ca: 'So: activat', ar: 'الصوت: مفعّل' },
		sonN: { oc: 'Son : copat', fr: 'Son : coupé', es: 'Sonido: silenciado', en: 'Sound: off', ca: 'So: silenciat', ar: 'الصوت: مكتوم' },
		legir: { oc: 'Legir lo tèxte', fr: 'Lire le texte', es: 'Leer el texto', en: 'Read the text', ca: 'Llegir el text', ar: 'قراءة النص' },
		libre: { oc: 'Tornar al libre', fr: 'Revenir au livre', es: 'Volver al libro', en: 'Back to the book', ca: 'Tornar al llibre', ar: 'العودة إلى الكتاب' },
		pag: { oc: 'Pagina', fr: 'Page', es: 'Página', en: 'Page', ca: 'Pàgina', ar: 'صفحة' },
		sus: { oc: 'sus', fr: 'sur', es: 'de', en: 'of', ca: 'de', ar: 'من' },
		nota: {
			oc: 'Transcripcion en cors de verificacion : l’occitan es dau libre de 1913, en grafia d’epòca.',
			fr: 'Transcription en cours de relecture : l’occitan est celui du livre de 1913, en graphie d’époque.',
			es: 'Transcripción en curso de revisión: el occitano es el del libro de 1913, en grafía de la época.',
			en: 'Transcription being proofread: the Occitan is that of the 1913 book, in period spelling.',
			ca: 'Transcripció en curs de revisió: l’occità és el del llibre de 1913, amb grafia d’època.',
			ar: 'النسخ قيد المراجعة: الأوكسيتانية هي نفسها في كتاب 1913 بإملاء ذلك العصر.'
		},
		aida: {
			oc: 'Las sagetas ← → viran las paginas. « Legir lo tèxte » dona la version legibla al ecran.',
			fr: 'Les flèches ← → tournent les pages. « Lire le texte » donne la version lisible à l’écran.',
			es: 'Las flechas ← → pasan las páginas. « Leer el texto » ofrece la versión legible en pantalla.',
			en: 'The ← → arrow keys turn the pages. “Read the text” gives the screen-reader version.',
			ca: 'Les fletxes ← → giren les pàgines. « Llegir el text » ofereix la versió llegible a la pantalla.',
			ar: 'مفتاحا السهم ← → يقلّبان الصفحات. «قراءة النص» تعرض النسخة المقروءة على الشاشة.'
		},
		cargar: { oc: 'Cargament…', fr: 'Chargement…', es: 'Cargando…', en: 'Loading…', ca: 'Carregant…', ar: 'جارٍ التحميل…' },
		err: {
			oc: 'Lo libre se pòt pas afichar. Ensaja lo tèxte.',
			fr: 'Le livre ne peut pas s’afficher. Essaie le texte.',
			es: 'No se puede mostrar el libro. Prueba el texto.',
			en: 'The book cannot be shown. Try the text.',
			ca: 'No es pot mostrar el llibre. Prova el text.',
			ar: 'تعذّر عرض الكتاب. جرّب النص.'
		}
	};
</script>

<section class="lector" aria-label={titol}>
	<div class="barra" role="toolbar" aria-label={titol}>
		<button type="button" class="bot" onclick={precedenta} disabled={pagina <= 0} aria-label={tria(t.prec)}>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
		</button>
		<span class="compte">{tria(t.pag)} {pagina + 1} {tria(t.sus)} {total}</span>
		<button type="button" class="bot" onclick={suivante} disabled={pagina >= total - 1} aria-label={tria(t.seg)}>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
		</button>
		<form class="anar" onsubmit={validarAnar}>
			<label class="sr" for="livre-anar">{tria(t.anar)}</label>
			<input id="livre-anar" type="number" inputmode="numeric" min="1" max={total} bind:value={aller} placeholder="N°" />
			<button type="submit" class="bot mot">{tria(t.ok)}</button>
		</form>
		<span class="espaci"></span>
		<button type="button" class="bot mot" class:actiu={son} onclick={basculerSon}>{son ? tria(t.sonA) : tria(t.sonN)}</button>
		<button type="button" class="bot mot" class:actiu={mode === 'tèxte'} onclick={basculerMode}>{mode === 'libre' ? tria(t.legir) : tria(t.libre)}</button>
	</div>

	<p class="aida" id="livre-aida">{tria(t.aida)}</p>

	<p class="sr" aria-live="polite">{tria(t.pag)} {pagina + 1} {tria(t.sus)} {total}</p>

	{#if erreur && mode === 'libre'}
		<p class="err" role="alert">{tria(t.err)}</p>
	{/if}

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="scena" class:amagat={mode === 'tèxte'} role="group" aria-label={titol} aria-describedby="livre-aida" tabindex="0" onkeydown={clavier}>
		{#if !pret && !erreur}<p class="cargament">{tria(t.cargar)}</p>{/if}
		<div class="livre" bind:this={livreEl}></div>
	</div>

	{#if mode === 'tèxte'}
		<article class="tèxte">
			<h2>{tria(t.pag)} {pagina + 1}</h2>
			<p class="nota">{tria(t.nota)}</p>
			{#if !textes && !erreur}
				<p>{tria(t.cargar)}</p>
			{:else if erreur}
				<p role="alert">{tria(t.err)}</p>
			{:else}
				<div class="linhas" lang="fr">
					{#each lignes as l, k (k)}<p>{l}</p>{/each}
				</div>
			{/if}
		</article>
	{/if}
</section>

<style>
	.lector {
		display: grid;
		gap: 1rem;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem;
	}
	.espaci {
		flex: 1 1 0;
	}
	.bot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0 0.9rem;
		font: inherit;
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--t-tinta) 28%, transparent);
		border-radius: 999px;
		cursor: pointer;
	}
	.bot:hover:not(:disabled) {
		background: color-mix(in srgb, var(--t-aur) 22%, transparent);
	}
	.bot:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.bot.actiu {
		background: color-mix(in srgb, var(--t-aur) 30%, transparent);
		border-color: var(--t-aur);
	}
	.bot:focus-visible,
	.scena:focus-visible,
	input:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.aida {
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	.compte {
		min-width: 9.5rem;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.anar {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
	.anar input {
		width: 4.6rem;
		min-height: 2.75rem;
		padding: 0 0.6rem;
		font: inherit;
		color: inherit;
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 35%, transparent);
		border-radius: 0.6rem;
	}
	.scena {
		position: relative;
		display: flex;
		justify-content: center;
		min-height: 22rem;
		padding: clamp(0.4rem, 2vw, 1.4rem) 0;
		border-radius: 1rem;
		background:
			radial-gradient(ellipse 80% 60% at 50% 45%, color-mix(in srgb, var(--t-aur) 14%, transparent), transparent 75%),
			color-mix(in srgb, var(--t-tinta) 5%, transparent);
	}
	.scena.amagat {
		display: none;
	}
	.livre {
		width: 100%;
		max-width: 1240px;
	}
	.cargament,
	.err {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		color: var(--t-tinta-2);
	}
	.err {
		position: static;
		color: inherit;
	}
	:global(.livre .pg) {
		background: #fbf8f0;
		overflow: hidden;
	}
	:global(.livre .pg img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: fill;
		user-select: none;
	}
	.tèxte {
		max-width: 44rem;
		margin: 0 auto;
		padding: 1.2rem clamp(0.4rem, 3vw, 1.6rem) 2rem;
		line-height: 1.55;
	}
	.tèxte h2 {
		margin: 0 0 0.3rem;
		font-family: var(--font-heading);
		font-weight: 400;
	}
	.nota {
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}
	.linhas p {
		margin: 0;
		white-space: pre-wrap;
	}
</style>
