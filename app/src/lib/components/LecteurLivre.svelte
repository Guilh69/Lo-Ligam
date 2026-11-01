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
	let hoteEl = $state(); // l'élément de la page, jamais supprimé
	let livreEl = null; // celui que la bibliothèque de feuilletage prend en charge (recréé à chaque fois)
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

	const CLAU_SON = 'lo-ligam-livre-son';
	const url = (i) => `${base}/p${String(i + 1).padStart(3, '0')}.webp`;

	function chargar(i) {
		if (!livreEl) return;
		for (let k = Math.max(0, i - 2); k <= Math.min(total - 1, i + 6); k++) {
			const img = livreEl.querySelector(`img[data-i="${k}"]`);
			if (img && !img.src) img.src = url(k);
		}
	}

	// le bruit des pages (2026-11-01, Romain : « un vrai bruit ») : dix vrais
	// enregistrements de pages de livre tournées (StarNinjas, CC0,
	// OpenGameArt, static/livres/son/), joués au hasard, jamais deux fois le
	// même d'affilée. Un navigateur sans Ogg n'a pas de son plutôt qu'un faux.
	const SON_DOSSIER = '/livres/son';
	const SONS = 10;
	let dernierSon = -1;
	let echantillons = [];
	function preparerSons() {
		if (echantillons.length || typeof Audio === 'undefined') return;
		if (!new Audio().canPlayType('audio/ogg; codecs="vorbis"')) return;
		for (let k = 1; k <= SONS; k++) {
			const a = new Audio(`${SON_DOSSIER}/page-${k}.ogg`);
			a.preload = 'auto';
			a.volume = 0.35;
			echantillons.push(a);
		}
	}
	function souffle() {
		if (!son || reduit) return;
		preparerSons();
		if (!echantillons.length) return;
		let k;
		do {
			k = Math.floor(Math.random() * echantillons.length);
		} while (k === dernierSon && echantillons.length > 1);
		dernierSon = k;
		const a = echantillons[k];
		try {
			a.currentTime = 0;
			a.play()?.catch(() => {});
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
		if (!PF || !hoteEl) return;
		// la bibliothèque supprime l'élément qu'on lui confie quand on la détruit :
		// on lui en donne donc un neuf, posé dans l'élément de la page
		livreEl = document.createElement('div');
		livreEl.className = 'livre-int';
		hoteEl.appendChild(livreEl);
		const plein = plenEcran;
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
			maxWidth: plein ? 1100 : 760,
			minHeight: plein ? 200 : 360,
			maxHeight: plein ? Math.round(window.innerHeight) : Math.max(360, Math.min(1100, Math.round(window.innerHeight - 230))),
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
		if (!PF || !hoteEl || mode !== 'libre') return;
		const p = pagina;
		try {
			flip?.destroy();
		} catch {
			/* déjà démonté */
		}
		livreEl?.remove();
		creer(p);
	}

	// plein écran : celui du navigateur quand il existe, sinon (iPhone, cadre
	// intégré…) un cadre fixe qui couvre tout l'écran ; même rendu dans les deux cas
	async function basculerPlenEcran() {
		if (document.fullscreenElement) {
			try {
				await document.exitFullscreen();
			} catch {
				/* sortie refusée */
			}
			return;
		}
		if (plenEcran) {
			plenEcran = false;
			setTimeout(refaire, 120);
			return;
		}
		plenEcran = true; // le cadre couvre l'écran tout de suite
		if (document.fullscreenEnabled && lectorEl?.requestFullscreen) {
			try {
				await lectorEl.requestFullscreen();
				return; // l'évènement « fullscreenchange » recompose le livre
			} catch {
				/* refusé : on garde le cadre fixe */
			}
		}
		setTimeout(refaire, 120);
	}

	// pendant le plein écran, la page derrière ne défile plus
	$effect(() => {
		document.documentElement.style.overflow = plenEcran ? 'hidden' : '';
		return () => {
			document.documentElement.style.overflow = '';
		};
	});

	onMount(() => {
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {
			/* son activé par défaut */
		}
		reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduit) son = false;
		if (son) preparerSons();
		plenPossible = true;
		let mort = false;

		(async () => {
			try {
				const mod = await import('page-flip');
				if (mort || !hoteEl) return;
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
		if (e.key === 'Escape' && plenEcran) {
			if (!document.fullscreenElement) basculerPlenEcran();
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
		<button type="button" class="bot mot" class:actiu={son} onclick={basculerSon}>{son ? tria(t.sonA) : tria(t.sonN)}</button>
		<button type="button" class="bot mot" class:actiu={mode === 'tèxte'} onclick={basculerMode}>{mode === 'libre' ? tria(t.legir) : tria(t.libre)}</button>
	</div>

	{#if plenEcran}
		<button type="button" class="fermar" onclick={basculerPlenEcran} aria-label={tria(t.sortir)} title="{tria(t.sortir)} (Échap)">
			<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
		</button>
	{/if}

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
		<div class="livre" bind:this={hoteEl}></div>
		{#if plenPossible}
			<button type="button" class="plen-bot" onclick={basculerPlenEcran} aria-label={plenEcran ? tria(t.sortir) : tria(t.plen)} title={plenEcran ? tria(t.sortir) : tria(t.plen)}>
				{#if plenEcran}
					<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
				{:else}
					<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
				{/if}
			</button>
		{/if}
		{#if plenEcran}
			<button type="button" class="fleche gauche" onclick={precedenta} disabled={pagina <= 0} aria-label={tria(t.prec)}>
				<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
			</button>
			<button type="button" class="fleche droite" onclick={suivante} disabled={pagina >= total - 1} aria-label={tria(t.seg)}>
				<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
			</button>
			<span class="compte-plen" aria-hidden="true">{pagina + 1} / {total}</span>
		{/if}
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
	/* plein écran : le livre seul, calé sur l'écran, sans défilement */
	.lector.plen {
		display: block;
		position: fixed;
		inset: 0;
		z-index: 2000;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		padding: 0;
		overflow: hidden;
		overscroll-behavior: contain;
		color: #f4ecdf;
		background: #120d0a;
	}
	.lector.plen .barra,
	.lector.plen .aida,
	.lector.plen .tèxte {
		display: none;
	}
	.lector.plen .scena {
		height: 100vh;
		height: 100dvh;
		min-height: 0;
		padding: 0;
		border-radius: 0;
		align-items: center;
		background: #120d0a;
	}
	.lector.plen .livre {
		max-width: none;
		height: 100%;
	}
	.lector.plen .cerca {
		position: absolute;
		top: 4.2rem;
		left: 50%;
		z-index: 15;
		width: min(36rem, 92vw);
		transform: translateX(-50%);
		color: var(--t-tinta);
		background: var(--t-fons);
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
	.plen-bot,
	.fleche {
		position: absolute;
		z-index: 10;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		color: #fff;
		background: color-mix(in srgb, #140e0a 72%, transparent);
		border: 1px solid color-mix(in srgb, #fff 35%, transparent);
		border-radius: 999px;
		cursor: pointer;
	}
	.plen-bot {
		right: 0.8rem;
		bottom: 0.8rem;
	}
	.plen-bot:hover,
	.fleche:hover:not(:disabled) {
		background: color-mix(in srgb, var(--t-aur) 55%, #140e0a);
	}
	.plen-bot:focus-visible,
	.fleche:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.fleche {
		top: 50%;
		transform: translateY(-50%);
	}
	.fleche:disabled {
		opacity: 0.25;
		cursor: default;
	}
	.fleche.gauche {
		left: 0.8rem;
	}
	.fleche.droite {
		right: 0.8rem;
	}
	.compte-plen {
		position: absolute;
		left: 50%;
		bottom: 0.7rem;
		z-index: 10;
		padding: 0.15rem 0.8rem;
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
		color: #f4ecdf;
		background: color-mix(in srgb, #140e0a 70%, transparent);
		border-radius: 999px;
		transform: translateX(-50%);
	}
	.fermar {
		position: fixed;
		top: 0.8rem;
		right: 0.8rem;
		z-index: 20;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-fons) 85%, transparent);
		border: 2px solid var(--t-aur);
		border-radius: 999px;
		cursor: pointer;
	}
	.fermar:hover {
		background: color-mix(in srgb, var(--t-aur) 35%, var(--t-fons));
	}
	.fermar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
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
	:global(.lector.plen .livre-int) {
		width: 100%;
		height: 100%;
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
