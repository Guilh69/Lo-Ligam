<script>
	// Lecteur de livre à pages tournantes (2026-10-29) : la bibliothèque libre
	// StPageFlip (page-flip, MIT) fait tourner les pages ; le bruit du papier
	// est fabriqué sur place (aucun fichier son), doux et désactivable ;
	// un mode texte donne le texte réel de chaque page (lecteurs d'écran,
	// petits écrans). Sobriété : les images des pages ne sont chargées qu'à
	// l'approche de la page lue.
	// 2026-11-01 (Romain) : plein écran, flèches du clavier sur toute la page,
	// son plus doux, recherche dans le livre (Ctrl+F).
	import { onMount, tick } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	let { base, total, titol = '' } = $props();

	let lectorEl = $state();
	let livreEl = $state();
	let champCerca = $state();
	let flip = null;
	let PF = null;
	let pagina = $state(0); // page affichée, à partir de 0
	let mode = $state('libre'); // 'libre' | 'tèxte'
	let son = $state(true);
	let pret = $state(false);
	let reduit = false;
	let textes = $state(null);
	let erreur = $state(false);
	let aller = $state('');
	let plenEcran = $state(false);
	let plenPossible = $state(false);
	let cerca = $state(false);
	let requeta = $state('');
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

	// le bruit du papier (2026-11-01, plus doux) : un souffle de bruit rose,
	// lissé, qui monte à peine dans les médiums, puis un petit « tap » sourd
	// quand la page se pose. Rien d'aigu, volume bas.
	function souffle() {
		if (!son || reduit) return;
		try {
			ctx ??= new (window.AudioContext || window.webkitAudioContext)();
			if (ctx.state === 'suspended') ctx.resume();
			const sr = ctx.sampleRate;
			const now = ctx.currentTime;
			const d = 0.46;
			const buf = ctx.createBuffer(1, Math.floor(sr * d), sr);
			const data = buf.getChannelData(0);
			let b0 = 0;
			let b1 = 0;
			let b2 = 0;
			for (let i = 0; i < data.length; i++) {
				const t = i / data.length;
				const blanc = Math.random() * 2 - 1;
				b0 = 0.99765 * b0 + blanc * 0.099046;
				b1 = 0.963 * b1 + blanc * 0.2965164;
				b2 = 0.57 * b2 + blanc * 1.0526913;
				const rose = b0 + b1 + b2 + blanc * 0.1848;
				const env = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 2) * (1 - 0.45 * t);
				data[i] = rose * 0.17 * env;
			}
			const src = ctx.createBufferSource();
			src.buffer = buf;
			const bande = ctx.createBiquadFilter();
			bande.type = 'bandpass';
			bande.Q.value = 0.45;
			bande.frequency.setValueAtTime(650, now);
			bande.frequency.exponentialRampToValueAtTime(1700, now + d);
			const doux = ctx.createBiquadFilter();
			doux.type = 'lowpass';
			doux.frequency.value = 2800;
			const g = ctx.createGain();
			g.gain.value = 0.55;
			src.connect(bande).connect(doux).connect(g).connect(ctx.destination);
			src.start(now);

			// le tap : un grain de bruit très court, filtré dans les graves
			const nt = Math.floor(sr * 0.06);
			const tb = ctx.createBuffer(1, nt, sr);
			const td = tb.getChannelData(0);
			for (let i = 0; i < nt; i++) td[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nt, 3);
			const tap = ctx.createBufferSource();
			tap.buffer = tb;
			const grave = ctx.createBiquadFilter();
			grave.type = 'lowpass';
			grave.frequency.value = 520;
			const gt = ctx.createGain();
			gt.gain.value = 0.35;
			tap.connect(grave).connect(gt).connect(ctx.destination);
			tap.start(now + 0.34);
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

	// construit (ou reconstruit) le livre, à la page demandée, à la taille
	// de l'écran du moment (utile en entrant dans le plein écran ou en sortant)
	function creer(depart = 0) {
		if (!PF || !livreEl) return;
		const haut = document.fullscreenElement ? window.innerHeight - 150 : window.innerHeight - 230;
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
		flip = new PF(livreEl, {
			width: 420,
			height: 664,
			size: 'stretch',
			minWidth: 230,
			maxWidth: 760,
			minHeight: 360,
			maxHeight: Math.max(360, Math.min(1100, Math.round(haut))),
			showCover: true,
			usePortrait: true,
			maxShadowOpacity: 0.45,
			mobileScrollSupport: false,
			flippingTime: reduit ? 1 : 780,
			drawShadow: !reduit,
			startPage: depart
		});
		flip.loadFromHTML(pages);
		chargar(depart);
		flip.on('flip', (e) => {
			pagina = e.data;
			chargar(e.data);
		});
		flip.on('changeState', (e) => {
			if (e.data === 'flipping') souffle();
		});
	}

	function refaire() {
		if (!PF || !livreEl || mode !== 'libre') return;
		const p = pagina;
		try {
			flip?.destroy();
		} catch {
			/* déjà démonté */
		}
		livreEl.innerHTML = '';
		creer(p);
	}

	async function basculerPlenEcran() {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await lectorEl?.requestFullscreen?.();
		} catch {
			/* plein écran refusé par le navigateur */
		}
	}

	onMount(() => {
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {
			/* son activé par défaut */
		}
		reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduit) son = false;
		plenPossible = !!document.fullscreenEnabled;
		let mort = false;

		(async () => {
			try {
				const mod = await import('page-flip');
				if (mort || !livreEl) return;
				PF = mod.PageFlip;
				creer(0);
				pret = true;
			} catch {
				erreur = true;
			}
		})();

		const quandPleinEcran = () => {
			plenEcran = !!document.fullscreenElement;
			setTimeout(refaire, 180);
		};
		document.addEventListener('fullscreenchange', quandPleinEcran);
		window.addEventListener('keydown', clavier);

		return () => {
			mort = true;
			document.removeEventListener('fullscreenchange', quandPleinEcran);
			window.removeEventListener('keydown', clavier);
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

	async function chargarTextes() {
		if (textes) return;
		try {
			textes = await (await fetch(`${base}/texte.json`)).json();
		} catch {
			erreur = true;
		}
	}

	async function basculerMode() {
		if (mode === 'libre') {
			mode = 'tèxte';
			await chargarTextes();
		} else {
			mode = 'libre';
			queueMicrotask(() => {
				flip?.update?.();
				flip?.turnToPage(pagina);
				chargar(pagina);
			});
		}
	}

	// la recherche dans le livre : Ctrl+F (ou ⌘F) l'ouvre, Échap la ferme
	async function ouvrirCerca() {
		cerca = true;
		await chargarTextes();
		await tick();
		champCerca?.focus();
		champCerca?.select();
	}
	function tancarCerca() {
		cerca = false;
		requeta = '';
	}
	function anarResultat(i) {
		anar(i);
		if (window.matchMedia('(max-width: 700px)').matches) tancarCerca();
	}

	const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
	let resultats = $derived.by(() => {
		const q = norm(requeta.trim());
		if (q.length < 2 || !textes) return [];
		const sortida = [];
		for (let i = 0; i < textes.length && sortida.length < 80; i++) {
			const lignes = textes[i];
			for (const l of lignes) {
				const p = norm(l).indexOf(q);
				if (p >= 0) {
					const debut = Math.max(0, p - 28);
					sortida.push({
						i,
						avant: (debut > 0 ? '…' : '') + l.slice(debut, p),
						trobat: l.slice(p, p + q.length),
						apres: l.slice(p + q.length, p + q.length + 40)
					});
					break;
				}
			}
		}
		return sortida;
	});

	function clavier(e) {
		// Ctrl+F / ⌘F : la recherche du livre (le navigateur ne voit pas le texte des images)
		if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'f' || e.key === 'F')) {
			e.preventDefault();
			ouvrirCerca();
			return;
		}
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const el = e.target;
		const saisie = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el?.isContentEditable;
		if (e.key === 'Escape' && cerca) {
			tancarCerca();
			return;
		}
		if (saisie) return;
		if (e.key === 'ArrowRight' || e.key === 'PageDown') {
			e.preventDefault();
			suivante();
		} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			e.preventDefault();
			precedenta();
		} else if (e.key === 'Home') {
			e.preventDefault();
			anar(0);
		} else if (e.key === 'End') {
			e.preventDefault();
			anar(total - 1);
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
		plen: { oc: 'Plen ecran', fr: 'Plein écran', es: 'Pantalla completa', en: 'Full screen', ca: 'Pantalla completa', ar: 'ملء الشاشة' },
		sortir: { oc: 'Quitar lo plen ecran', fr: 'Quitter le plein écran', es: 'Salir de pantalla completa', en: 'Exit full screen', ca: 'Sortir de la pantalla completa', ar: 'إنهاء ملء الشاشة' },
		cerca: { oc: 'Cercar', fr: 'Chercher', es: 'Buscar', en: 'Search', ca: 'Cercar', ar: 'بحث' },
		cercaDins: { oc: 'Cercar dins lo libre', fr: 'Chercher dans le livre', es: 'Buscar en el libro', en: 'Search in the book', ca: 'Cercar dins el llibre', ar: 'البحث في الكتاب' },
		barrar: { oc: 'Barrar', fr: 'Fermer', es: 'Cerrar', en: 'Close', ca: 'Tancar', ar: 'إغلاق' },
		cap: { oc: 'Cap de resultat.', fr: 'Aucun résultat.', es: 'Ningún resultado.', en: 'No result.', ca: 'Cap resultat.', ar: 'لا توجد نتائج.' },
		trobat: { oc: 'paginas trobadas', fr: 'pages trouvées', es: 'páginas encontradas', en: 'pages found', ca: 'pàgines trobades', ar: 'صفحات وُجدت' },
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
			oc: 'Las sagetas ← → viran las paginas. Ctrl+F cèrca dins lo libre. « Legir lo tèxte » dona la version legibla al ecran.',
			fr: 'Les flèches ← → tournent les pages. Ctrl+F cherche dans le livre. « Lire le texte » donne la version lisible à l’écran.',
			es: 'Las flechas ← → pasan las páginas. Ctrl+F busca en el libro. « Leer el texto » ofrece la versión legible en pantalla.',
			en: 'The ← → arrow keys turn the pages. Ctrl+F searches the book. “Read the text” gives the screen-reader version.',
			ca: 'Les fletxes ← → giren les pàgines. Ctrl+F cerca dins el llibre. « Llegir el text » ofereix la versió llegible a la pantalla.',
			ar: 'مفتاحا السهم ← → يقلّبان الصفحات. Ctrl+F يبحث في الكتاب. «قراءة النص» تعرض النسخة المقروءة على الشاشة.'
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

<section class="lector" class:plen={plenEcran} bind:this={lectorEl} aria-label={titol}>
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
		<button type="button" class="bot mot" class:actiu={cerca} onclick={() => (cerca ? tancarCerca() : ouvrirCerca())} aria-keyshortcuts="Control+F">{tria(t.cerca)}</button>
		{#if plenPossible}
			<button type="button" class="bot mot" class:actiu={plenEcran} onclick={basculerPlenEcran}>{plenEcran ? tria(t.sortir) : tria(t.plen)}</button>
		{/if}
		<button type="button" class="bot mot" class:actiu={son} onclick={basculerSon}>{son ? tria(t.sonA) : tria(t.sonN)}</button>
		<button type="button" class="bot mot" class:actiu={mode === 'tèxte'} onclick={basculerMode}>{mode === 'libre' ? tria(t.legir) : tria(t.libre)}</button>
	</div>

	{#if cerca}
		<div class="cerca" role="search">
			<div class="cerca-cap">
				<label class="sr" for="livre-cerca">{tria(t.cercaDins)}</label>
				<input id="livre-cerca" type="search" bind:this={champCerca} bind:value={requeta} placeholder={tria(t.cercaDins)} autocomplete="off" spellcheck="false" />
				<button type="button" class="bot mot" onclick={tancarCerca}>{tria(t.barrar)}</button>
			</div>
			{#if requeta.trim().length >= 2}
				<p class="cerca-etat" aria-live="polite">
					{#if !textes}{tria(t.cargar)}{:else if resultats.length === 0}{tria(t.cap)}{:else}{resultats.length}{resultats.length >= 80 ? '+' : ''} {tria(t.trobat)}{/if}
				</p>
				<ul class="cerca-lista" lang="fr">
					{#each resultats as r (r.i)}
						<li>
							<button type="button" onclick={() => anarResultat(r.i)}>
								<span class="cerca-pag">{r.i + 1}</span>
								<span class="cerca-extrait">{r.avant}<mark>{r.trobat}</mark>{r.apres}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	<p class="aida" id="livre-aida">{tria(t.aida)}</p>

	<p class="sr" aria-live="polite">{tria(t.pag)} {pagina + 1} {tria(t.sus)} {total}</p>

	{#if erreur && mode === 'libre'}
		<p class="err" role="alert">{tria(t.err)}</p>
	{/if}

	<div class="scena" class:amagat={mode === 'tèxte'} role="group" aria-label={titol} aria-describedby="livre-aida">
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
	.lector.plen,
	.lector:fullscreen {
		align-content: start;
		gap: 0.6rem;
		padding: 0.8rem clamp(0.6rem, 2vw, 1.6rem);
		overflow: auto;
		color: var(--t-tinta);
		background: var(--t-fons);
	}
	.lector:fullscreen .scena {
		min-height: 0;
		padding-block: 0.3rem;
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
	input:focus-visible,
	.cerca-lista button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
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
	.anar input,
	.cerca-cap input {
		min-height: 2.75rem;
		padding: 0 0.7rem;
		font: inherit;
		color: inherit;
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 35%, transparent);
		border-radius: 0.6rem;
	}
	.anar input {
		width: 4.6rem;
	}
	.cerca {
		display: grid;
		gap: 0.5rem;
		padding: 0.8rem;
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
		border: 1px solid color-mix(in srgb, var(--t-aur) 40%, transparent);
		border-radius: 0.9rem;
	}
	.cerca-cap {
		display: flex;
		gap: 0.55rem;
	}
	.cerca-cap input {
		flex: 1 1 auto;
		min-width: 0;
	}
	.cerca-etat {
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}
	.cerca-lista {
		display: grid;
		gap: 0.15rem;
		max-height: 14rem;
		margin: 0;
		padding: 0;
		overflow: auto;
		list-style: none;
	}
	.cerca-lista button {
		display: flex;
		gap: 0.7rem;
		width: 100%;
		padding: 0.4rem 0.5rem;
		font: inherit;
		font-size: 0.95rem;
		text-align: left;
		color: inherit;
		background: transparent;
		border: 0;
		border-radius: 0.5rem;
		cursor: pointer;
	}
	.cerca-lista button:hover {
		background: color-mix(in srgb, var(--t-aur) 20%, transparent);
	}
	.cerca-pag {
		flex: none;
		min-width: 2.4rem;
		color: var(--t-aur);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}
	.cerca-extrait {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	mark {
		color: inherit;
		background: color-mix(in srgb, var(--t-aur) 45%, transparent);
		border-radius: 0.2rem;
	}
	.aida {
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
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
		max-width: 1500px;
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
