<script>
	// Les « Primièrs passes » : le tutoriel de première connexion (Romain,
	// 2026-10-23). Il remplace le panneau « Trois portes » de la carte, qui
	// donnait un but mais pas le mode d'emploi des commandes (réserve de Romain
	// du 22-10) et que Romain a fait retirer. Un moteur commun : chaque page lui
	// donne ses étapes (la commande visée, le texte dans les deux langues, le
	// geste qui la valide) ; la carte d'abord, les autres pages ensuite.
	// Trois formes à comparer sur /carta?ensag=guida :
	//   « bullas » : une bulle par commande, halo d'or, Seguent / Passar ;
	//   « lista » : une petite liste à cocher ; une ligne se coche quand le geste
	//     est vraiment fait, toucher une ligne montre sa commande ;
	//   « man » : un doigt lumineux glisse d'une commande à l'autre et la touche,
	//     un sous-titre en bas, sans rien changer à la page.
	// Règles : rien avant que la page soit prête (la carte : après son entrée en
	// scène, ou dès le premier geste) ; « Passar » toujours là ; le clic ailleurs
	// ferme les bulles et le doigt (pas la liste, qui ne gêne pas et attend
	// justement ces clics) ; une seule fois par navigateur hors essai ;
	// relançable (lançar). Occitan nouveau : à valider par Romain.
	import { onMount } from 'svelte';
	import Icona from './Icona.svelte';
	import { tampaDefòra } from '$lib/tampaDefora.js';

	let {
		etapas = [], // [{ cibla (sélecteur, ou fonction → rectangle), punt?, oc, fr, linha?: { oc, fr }, fait?: { ev, sel, sauf? } }]
		clau, // la clé de mémoire (localStorage)
		fin = { oc: '', fr: '' }, // le mot de la fin, liste cochée
		lang = 'oc',
		forma = $bindable('bullas'),
		ensag = false,
		lest = true, // la page est prête (la carte : écran de chargement levé)
		espera = 0 // ms après « lest » avant de partir (la carte : son entrée en scène)
	} = $props();

	const FORMAS = [
		['bullas', 'Bulles'],
		['lista', 'Liste à cocher'],
		['man', 'Démonstration']
	];
	const T = {
		oc: { titol: 'Primièrs passes', seguent: 'Seguent', passar: 'Passar', compres: 'Comprés' },
		fr: { titol: 'Premiers pas', seguent: 'Suivant', passar: 'Passer', compres: 'Compris' }
	};
	const tx = $derived(T[lang] ?? T.oc);
	const dire = (o) => o?.[lang] ?? o?.oc ?? '';

	let actiu = $state(false);
	let pas = $state(0); // étape en cours (bulles, démonstration)
	let visiblas = $state([]); // les étapes dont la commande est à l'écran
	let fachas = $state([]); // liste : les étapes dont le geste est fait
	let cibla = $state(null); // le rectangle de la commande visée
	let bulla = $state({ x: 0, y: 0 });
	let bullaEl = $state(null);

	const linhas = $derived(visiblas.map((e, i) => ({ e, i })).filter(({ e }) => e.linha));
	const nòtas = $derived(visiblas.filter((e) => !e.linha));
	const totas = $derived(linhas.length > 0 && linhas.every(({ i }) => fachas.includes(i)));

	// la commande, si elle est à l'écran
	function trobar(e) {
		const r = typeof e.cibla === 'function' ? e.cibla() : document.querySelector(e.cibla)?.getBoundingClientRect();
		if (!r?.width || !r.height) return null;
		return r.left < innerWidth && r.left + r.width > 0 && r.top < innerHeight && r.top + r.height > 0 ? r : null;
	}
	function rectangle(e) {
		const r = trobar(e);
		if (!r) return null;
		if (!e.punt) return { x: r.left, y: r.top, w: r.width, h: r.height };
		// un point au milieu de la commande (la carte : là où l'on touche)
		const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
		return { x: cx - 28, y: cy - 28, w: 56, h: 56, punt: true };
	}

	function memorizar() {
		if (ensag) return;
		try {
			localStorage.setItem(clau, '1');
		} catch {
			// stockage indisponible : on montrera encore la prochaine fois
		}
	}
	function tampar() {
		actiu = false;
		cibla = null;
		memorizar();
	}
	function avançar() {
		if (pas < visiblas.length - 1) pas += 1;
		else tampar();
	}
	// (re)lancer : depuis l'essai, ou depuis le bouton qui revoit les premiers pas
	let partit = false; // déjà lancé une fois : le départ automatique n'a plus lieu
	export function lançar() {
		partit = true;
		visiblas = etapas.filter((e) => trobar(e));
		if (!visiblas.length) return;
		pas = 0;
		fachas = [];
		cibla = null;
		actiu = true;
	}

	// Rien avant que la page soit prête et le temps d'attente passé, ou le
	// premier geste du visiteur, qui l'écourte ; puis un court temps de respiration.
	let lançarTard = null;
	onMount(() => {
		if (!ensag) {
			try {
				if (localStorage.getItem(clau)) return;
			} catch {
				// on continue
			}
		}
		let t = null;
		const partir = () => {
			if (t || !lest) return;
			t = setTimeout(() => !partit && lançar(), 1500);
			for (const ev of ['pointerdown', 'wheel', 'keydown']) window.removeEventListener(ev, partir, true);
		};
		for (const ev of ['pointerdown', 'wheel', 'keydown']) window.addEventListener(ev, partir, true);
		let tard = null;
		lançarTard = () => (tard ??= setTimeout(() => !partit && partir(), espera));
		if (lest) lançarTard();
		return () => {
			lançarTard = null;
			clearTimeout(tard);
			if (t) clearTimeout(t);
			for (const ev of ['pointerdown', 'wheel', 'keydown']) window.removeEventListener(ev, partir, true);
		};
	});
	$effect(() => {
		if (lest) lançarTard?.();
	});

	// Bulles et démonstration : viser la commande de l'étape ; la bulle à côté
	// (à droite, sinon à gauche, sinon au-dessus ou en dessous)
	$effect(() => {
		if (!actiu || forma === 'lista') return;
		const e = visiblas[pas];
		if (!e) return;
		const viser = () => {
			const c = rectangle(e);
			if (!c) return avançar(); // commande partie (fenêtre retournée…) : étape suivante
			cibla = c;
			if (forma !== 'bullas') return;
			const bw = bullaEl?.offsetWidth ?? 300, bh = bullaEl?.offsetHeight ?? 130, marge = 14;
			// (jamais plus haut que la commande : la bulle cachait le bouton « Menú »)
			let x = c.x + c.w + marge, y = Math.max(c.y, c.y + c.h / 2 - bh / 2);
			if (x + bw > innerWidth - 8) x = c.x - bw - marge;
			if (x < 8) {
				x = Math.max(8, Math.min(c.x + c.w / 2 - bw / 2, innerWidth - bw - 8));
				y = c.y + c.h + marge; // en dessous
				if (y + bh > innerHeight - 8) y = c.y - bh - marge; // au-dessus
			}
			bulla = { x, y: Math.max(8, Math.min(y, innerHeight - bh - 8)) };
		};
		viser();
		addEventListener('resize', viser);
		const t = setTimeout(viser, 60); // la bulle connaît sa taille
		return () => {
			removeEventListener('resize', viser);
			clearTimeout(t);
		};
	});

	// Démonstration : le doigt avance seul ; un peu plus longtemps sur la dernière
	$effect(() => {
		if (!actiu || forma !== 'man') return;
		const t = setTimeout(avançar, pas === visiblas.length - 1 ? 5200 : 4200);
		return () => clearTimeout(t);
	});

	// Liste : chaque geste réellement fait coche sa ligne
	$effect(() => {
		if (!actiu || forma !== 'lista') return;
		const escotas = [];
		visiblas.forEach((e, i) => {
			if (!e.fait) return;
			const f = (ev) => {
				const t = ev.target;
				if (!(t instanceof Element) || t.closest('.guida') || !t.closest(e.fait.sel)) return;
				if (e.fait.sauf && t.closest(e.fait.sauf)) return;
				if (!fachas.includes(i)) fachas = [...fachas, i];
			};
			document.addEventListener(e.fait.ev, f, true);
			escotas.push([e.fait.ev, f]);
		});
		return () => escotas.forEach(([ev, f]) => document.removeEventListener(ev, f, true));
	});
	// tout est coché : le mot de la fin, puis la liste s'en va
	$effect(() => {
		if (!actiu || forma !== 'lista' || !totas) return;
		memorizar();
		const t = setTimeout(() => (actiu = false), 3400);
		return () => clearTimeout(t);
	});
	// Liste : toucher une ligne montre sa commande quelques secondes
	let tMostrar = null;
	function mostrar(e) {
		cibla = rectangle(e);
		clearTimeout(tMostrar);
		tMostrar = setTimeout(() => (cibla = null), 2600);
	}

	// Clic ailleurs ou Échap : fermer (principe du site), sauf la liste, qui ne
	// gêne pas (Échap y sert à quitter la recherche, pas la liste)
	$effect(() => {
		if (!actiu || forma === 'lista') return;
		const lèva = tampaDefòra((t) => !!t.closest('.guida, .guida-causida'), tampar);
		const tòca = (e) => e.key === 'Escape' && tampar();
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});

	function causirForma(k) {
		forma = k;
		lançar();
	}
</script>

{#if actiu}
	{#if cibla}
		{#key pas}
			<div
				class="guida guida-halo"
				class:punt={cibla.punt}
				class:tard={forma === 'man'}
				style="left: {cibla.x - 6}px; top: {cibla.y - 6}px; width: {cibla.w + 12}px; height: {cibla.h + 12}px"
				aria-hidden="true"
			></div>
		{/key}
	{/if}

	{#if forma === 'bullas' && visiblas[pas]}
		<div class="guida guida-bulla" class:lisa={pas > 0} role="dialog" aria-live="polite" aria-label={tx.titol} bind:this={bullaEl} style="left: {bulla.x}px; top: {bulla.y}px">
			<p class="guida-n">{tx.titol} · {pas + 1} / {visiblas.length}</p>
			{#key pas}<p class="guida-tèxt guida-venir">{dire(visiblas[pas])}</p>{/key}
			<div class="guida-accions">
				<button type="button" class="guida-passar" onclick={tampar}>{tx.passar}</button>
				{#if pas < visiblas.length - 1}
					<button type="button" class="guida-boton" onclick={() => (pas += 1)}>{tx.seguent} <Icona nom="suivant" size="0.9em" /></button>
				{:else}
					<button type="button" class="guida-boton" onclick={tampar}>{tx.compres}</button>
				{/if}
			</div>
		</div>
	{:else if forma === 'man' && visiblas[pas]}
		{#if cibla}
			<div class="guida guida-det" style="left: {cibla.x + cibla.w / 2}px; top: {cibla.y + cibla.h / 2}px" aria-hidden="true">
				{#key pas}<span class="guida-tòc"></span>{/key}
			</div>
		{/if}
		<div class="guida guida-sostitol" role="status" aria-live="polite">
			{#key pas}<p class="guida-tèxt guida-venir">{dire(visiblas[pas])}</p>{/key}
			<div class="guida-pè">
				<span class="guida-ponchs" aria-hidden="true">
					{#each visiblas as _, i}<span class:fach={i <= pas}></span>{/each}
				</span>
				<button type="button" class="guida-passar" onclick={tampar}>{tx.passar}</button>
			</div>
		</div>
	{:else if forma === 'lista'}
		<section class="guida guida-lista" aria-label={tx.titol}>
			<header>
				<p class="guida-n">{tx.titol}</p>
				<span class="guida-compte">{fachas.length} / {linhas.length}</span>
				<button type="button" class="guida-tampar" onclick={tampar} aria-label={tx.passar}><Icona nom="fermer" size="1em" /></button>
			</header>
			{#if totas}
				<p class="guida-tèxt guida-venir guida-fin">{dire(fin)}</p>
			{:else}
				<ul>
					{#each linhas as { e, i } (i)}
						<li>
							<button type="button" class:fach={fachas.includes(i)} onclick={() => mostrar(e)}>
								<span class="guida-casa" aria-hidden="true">{#if fachas.includes(i)}<Icona nom="valide" size="0.75em" />{/if}</span>
								{dire(e.linha)}
							</button>
						</li>
					{/each}
				</ul>
				{#each nòtas as e}
					<button type="button" class="guida-nòta" onclick={() => mostrar(e)}>{dire(e)}</button>
				{/each}
			{/if}
		</section>
	{/if}
{/if}

{#if ensag}
	<div class="guida-causida" role="group" aria-label="Essai : premiers pas">
		{#each FORMAS as [k, nom]}
			<button type="button" aria-pressed={forma === k} onclick={() => causirForma(k)}>{nom}</button>
		{/each}
	</div>
{/if}

<style>
	.guida { position: fixed; z-index: 1200; font-family: var(--font-body); color: var(--t-tinta); }
	.guida-tèxt { margin: 0; font-size: 1.05rem; line-height: 1.45; }
	.guida-n { margin: 0 0 0.35rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--t-aur); }
	.guida-passar { border: 0; background: none; padding: 0.5rem 0; min-height: 44px; font: inherit; font-size: 0.85rem; color: var(--t-tinta-2); cursor: pointer; text-decoration: underline; text-underline-offset: 0.2em; }
	.guida-boton { display: inline-flex; align-items: center; gap: 0.5rem; min-height: 44px; padding: 0 1.1rem; border: 0; border-radius: 999px; background: var(--t-terra); color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
	.guida-passar:focus-visible, .guida-boton:focus-visible, .guida-lista button:focus-visible { outline: 2px solid var(--t-aur); outline-offset: 3px; }
	.guida-venir { animation: guida-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }
	@keyframes guida-venir { from { opacity: 0; translate: 0 8px; } }

	/* le verre commun des panneaux de la carte */
	.guida-bulla, .guida-sostitol, .guida-lista { background: var(--t-veire-fort); backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6); animation: guida-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }

	/* le halo d'or autour de la commande visée */
	.guida-halo { pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 10px color-mix(in srgb, var(--t-aur) 22%, transparent); animation: guida-batre 1.6s ease-out infinite; }
	.guida-halo.punt { border-radius: 50%; }
	.guida-halo.tard { animation: guida-aparéisser 0.4s 0.75s both, guida-batre 1.6s 1.15s ease-out infinite; }
	@keyframes guida-batre { 50% { box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 16px color-mix(in srgb, var(--t-aur) 0%, transparent); } }
	@keyframes guida-aparéisser { from { opacity: 0; } }

	/* bulles */
	.guida-bulla { width: min(300px, calc(100vw - 16px)); padding: 1rem 1.1rem 0.6rem; border-radius: 14px; }
	/* (d'une commande à l'autre, la bulle glisse ; pas à la première, qui naît en place) */
	.guida-bulla.lisa { transition: left 0.5s cubic-bezier(0.19, 1, 0.22, 1), top 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
	.guida-accions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.8rem; }

	/* démonstration : le doigt lumineux glisse, puis touche */
	.guida-det { pointer-events: none; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: color-mix(in srgb, var(--t-aur-clar, var(--t-aur)) 55%, transparent); box-shadow: 0 0 0 2px color-mix(in srgb, #fff 70%, transparent), 0 6px 18px rgba(0, 0, 0, 0.45); transition: left 0.8s cubic-bezier(0.65, 0, 0.35, 1), top 0.8s cubic-bezier(0.65, 0, 0.35, 1); animation: guida-aparéisser 0.4s both; }
	.guida-tòc { position: absolute; inset: 0; border-radius: 50%; animation: guida-tocar 0.9s 0.8s ease-out both; }
	@keyframes guida-tocar {
		0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--t-aur) 70%, transparent); scale: 1; }
		20% { scale: 0.8; }
		100% { box-shadow: 0 0 0 26px color-mix(in srgb, var(--t-aur) 0%, transparent); scale: 1; }
	}
	.guida-sostitol { left: 50%; bottom: calc(var(--barra-bas, 0px) + 5.6rem); translate: -50% 0; width: min(560px, calc(100vw - 32px)); padding: 0.9rem 1.3rem 0.2rem; border-radius: 16px; text-align: center; }
	.guida-sostitol .guida-tèxt { font-size: 1.15rem; }
	.guida-pè { display: flex; align-items: center; justify-content: center; gap: 1.2rem; }
	.guida-ponchs { display: inline-flex; gap: 6px; }
	.guida-ponchs span { width: 7px; height: 7px; border-radius: 50%; background: var(--t-linha); transition: background 0.4s; }
	.guida-ponchs span.fach { background: var(--t-aur); }

	/* liste à cocher : en haut à droite, sous le bouton « ? » (loin de l'occitan,
	   qui tient la gauche et le centre de la carte) */
	.guida-lista { right: var(--marge, 16px); top: calc(var(--cap-bas, 5.4rem) + 4.6rem); width: min(280px, calc(100vw - 32px)); padding: 0.8rem 0.6rem 0.7rem 1.1rem; border-radius: 14px; }
	.guida-lista header { display: flex; align-items: center; gap: 0.5rem; }
	.guida-lista header .guida-n { flex: 1; margin: 0; }
	.guida-compte { font-size: 0.78rem; font-weight: 700; color: var(--t-tinta-2); font-variant-numeric: tabular-nums; }
	.guida-tampar { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 50%; background: none; color: var(--t-tinta-2); cursor: pointer; }
	.guida-tampar:hover { color: var(--t-tinta); background: color-mix(in srgb, var(--t-tinta) 10%, transparent); }
	.guida-lista ul { margin: 0.3rem 0 0; padding: 0; list-style: none; }
	.guida-lista li button { display: flex; align-items: center; gap: 0.65rem; width: 100%; min-height: 40px; padding: 0 0.3rem; border: 0; border-radius: 8px; background: none; color: var(--t-tinta); font: inherit; font-size: 0.95rem; text-align: left; cursor: pointer; transition: color 0.4s, background 0.3s; }
	.guida-lista li button:hover { background: color-mix(in srgb, var(--t-aur) 10%, transparent); }
	.guida-lista li button.fach { color: var(--t-tinta-2); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--t-aur) 60%, transparent); }
	.guida-casa { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--t-aur); color: var(--t-fons); transition: background 0.4s; }
	.fach .guida-casa { background: var(--t-aur); animation: guida-cochar 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
	@keyframes guida-cochar { from { scale: 0.4; } }
	.guida-nòta { display: block; margin: 0.35rem 0 0; padding: 0.3rem; border: 0; background: none; font: inherit; font-size: 0.8rem; color: var(--t-tinta-2); text-align: left; cursor: pointer; text-decoration: underline dotted; text-underline-offset: 0.2em; }
	.guida-fin { margin: 0.5rem 0 0.3rem; font-family: var(--font-heading); font-size: 1.3rem; }

	/* téléphone : la liste et le sous-titre au-dessus de la barre des couches */
	@container carta (max-width: 600px) {
		/* (à gauche : la colonne des boutons de la carte reste libre à droite) */
		.guida-lista { top: auto; right: auto; left: 8px; bottom: calc(var(--barra-bas, 0px) + 8px); width: min(300px, calc(100vw - 68px)); }
		.guida-sostitol { bottom: calc(var(--barra-bas, 0px) + 4.5rem); }
	}

	/* l'essai : les pastilles pour comparer les formes (hors charte, provisoire) */
	.guida-causida { position: fixed; left: 50%; top: calc(var(--cap-bas, 0px) + 70px); z-index: 2000; transform: translateX(-50%); display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: #ffffff; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35); font: 700 0.8rem/1 system-ui, sans-serif; }
	.guida-causida button { border: 0; border-radius: 999px; padding: 0.55rem 0.9rem; background: transparent; color: #222222; font: inherit; cursor: pointer; white-space: nowrap; }
	.guida-causida button[aria-pressed='true'] { background: #222222; color: #ffffff; }
	/* (sur téléphone, les pastilles cachaient la lecture : au milieu de l'écran) */
	@container carta (max-width: 600px) {
		.guida-causida { top: 60%; font-size: 0.72rem; }
		.guida-causida button { padding: 0.45rem 0.6rem; }
	}

	@media (prefers-reduced-motion: reduce) {
		.guida, .guida-halo, .guida-venir, .guida-tòc, .fach .guida-casa { animation: none; }
		.guida-bulla, .guida-det { transition: none; }
	}
</style>
