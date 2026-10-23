<script>
	// Les « Primièrs passes » : le tutoriel de première connexion (Romain,
	// 2026-10-23). Il remplace le panneau « Trois portes » de la carte, qui
	// donnait un but mais pas le mode d'emploi des commandes, et que Romain a
	// fait retirer. Un moteur commun : chaque page lui donne ses étapes ; la
	// carte d'abord, les autres pages ensuite.
	// Première forme retenue sur essai (contre « Bulles » et « Démonstration ») :
	// une liste à cocher, qui ne bloque rien. Seconde forme, le même jour (Romain :
	// « un tutoriel assez précis… digne de ce nom », de l'information la plus
	// importante à la plus gadget) : la liste devient un parcours. Une étape est
	// ouverte à la fois : son texte, et un halo d'or qui suit la commande à
	// toucher (même quand un panneau s'ouvre) ; elle se coche toute seule quand le
	// geste est vraiment fait, et la suivante s'ouvre. Chaque étape peut se
	// passer ; toucher une autre étape l'ouvre.
	// Une étape : { titol, tèxt (oc / fr) ; cibla : sélecteur, élément, ou
	// fonction (mem) → élément, sélecteur ou rectangle (punt : un point) ;
	// fach : (inici, mem) → vrai quand c'est fait (lue dans un $effect : l'état
	// réactif de la page s'y lit) ; inici : () → l'état au départ de l'étape ;
	// ev : { nom, sel } un geste (écouté sur window, en capture) ; pausa : ms
	// avant de juger, le temps qu'un vol de la carte se pose }.
	// Règles : elle part dès que la page est prête ; la croix la ferme ; une seule
	// fois par navigateur (mémorisée à la croix ou à la fin, sinon elle revient) ;
	// relançable (lançar) ; sans mémoire en essai (?ensag=guida). Sur téléphone,
	// en haut sous la recherche (les panneaux, l'étiquette du territoire et la
	// fiche de ville s'ouvrent en bas), seule l'étape ouverte se montre, son
	// titre dans l'en-tête ; elle se replie d'un toucher. Occitan nouveau : à
	// valider par Romain.
	import { onMount, untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icona from './Icona.svelte';

	let {
		etapas = [],
		clau, // la clé de mémoire (localStorage)
		fin = { oc: '', fr: '' }, // le mot de la fin
		nota = null, // { oc, fr, cibla } : où revoir les premiers pas
		lang = 'oc',
		ensag = false,
		lest = true, // la page est prête (la carte : écran de chargement levé)
		espera = 800 // ms après « lest », le temps que l'écran de chargement s'efface
	} = $props();

	const T = {
		oc: { titol: 'Primièrs passes', tampar: 'Tampar', passar: 'Passar l’etapa', plegar: 'Plegar', desplegar: 'Desplegar' },
		fr: { titol: 'Premiers pas', tampar: 'Fermer', passar: 'Passer l’étape', plegar: 'Replier', desplegar: 'Déplier' }
	};
	const tx = $derived(T[lang] ?? T.oc);
	const dire = (o) => o?.[lang] ?? o?.oc ?? '';

	let actiu = $state(false);
	let pas = $state(0); // l'étape ouverte
	let fachas = $state([]); // les étapes réussies
	let passadas = $state([]); // les étapes passées
	let acabat = $state(false); // le mot de la fin
	let plegada = $state(false); // téléphone : repliée sur le titre de l'étape
	let cibla = $state(null); // le rectangle du halo
	let jutjar = $state(false); // l'étape ouverte peut se cocher (après sa pausa)
	let inici = null, // l'état au départ de l'étape
		mem = {}; // la mémoire de l'étape (un geste en deux temps)

	// le rectangle d'une cible, si elle est à l'écran
	function rectangle(c) {
		let r = typeof c === 'function' ? c(mem) : c;
		if (typeof r === 'string') r = document.querySelector(r);
		const punt = !!r?.punt;
		if (r instanceof Element) r = r.getBoundingClientRect();
		if (!r?.width || !r.height) return null;
		if (!(r.left < innerWidth && r.left + r.width > 0 && r.top < innerHeight && r.top + r.height > 0)) return null;
		if (!punt) return { x: r.left, y: r.top, w: r.width, h: r.height };
		return { x: r.left + r.width / 2 - 28, y: r.top + r.height / 2 - 28, w: 56, h: 56, punt: true };
	}

	function memorizar() {
		if (ensag) return;
		try {
			localStorage.setItem(clau, '1');
		} catch {
			// stockage indisponible : on montrera encore la prochaine fois
		}
	}
	let tSeguent = null;
	function tampar() {
		clearTimeout(tSeguent);
		actiu = false;
		memorizar();
	}
	let partit = false; // déjà lancé : le départ automatique n'a plus lieu
	// (re)lancer : au départ, ou depuis le bouton qui revoit les premiers pas
	export function lançar() {
		partit = true;
		clearTimeout(tSeguent);
		fachas = [];
		passadas = [];
		acabat = false;
		plegada = false;
		pas = 0;
		actiu = true;
	}

	// Le départ : dès que la page est prête (choix de Romain, 2026-10-23)
	let vista = false; // déjà vue sur ce navigateur
	onMount(() => {
		if (ensag) return;
		try {
			vista = !!localStorage.getItem(clau);
		} catch {
			// on montre
		}
	});
	$effect(() => {
		if (!lest || vista || partit) return;
		const t = setTimeout(() => !partit && lançar(), espera);
		return () => clearTimeout(t);
	});

	// L'étape s'ouvre : on note l'état de départ (après sa pausa), puis on juge
	$effect(() => {
		if (!actiu || acabat) return;
		const e = etapas[pas];
		jutjar = false;
		mem = {};
		if (!e || untrack(() => fachas.includes(pas))) return;
		const t = setTimeout(() => {
			inici = untrack(() => e.inici?.());
			jutjar = true;
		}, e.pausa ?? 0);
		return () => clearTimeout(t);
	});
	// réussie par l'état de la page (une couche allumée, un objet choisi…)
	$effect(() => {
		if (!actiu || !jutjar) return;
		const e = etapas[pas];
		if (e?.fach?.(inici, mem)) untrack(reüssir);
	});
	// réussie par un geste (un clic, une recherche aboutie)
	$effect(() => {
		if (!actiu || !jutjar) return;
		const e = etapas[pas];
		if (!e?.ev) return;
		const f = (ev) => {
			const t = ev.target;
			if (t instanceof Element && t.closest('.guida')) return;
			if (e.ev.sel && !(t instanceof Element && t.closest(e.ev.sel))) return;
			reüssir();
		};
		addEventListener(e.ev.nom, f, true);
		return () => removeEventListener(e.ev.nom, f, true);
	});

	function reüssir() {
		if (fachas.includes(pas)) return;
		jutjar = false;
		fachas = [...fachas, pas];
		passadas = passadas.filter((i) => i !== pas);
		clearTimeout(tSeguent);
		tSeguent = setTimeout(seguent, 1100); // le temps de voir la coche
	}
	// l'étape suivante pas encore faite (puis, en reprenant au début, une passée)
	function seguent() {
		const resta = etapas.map((_, i) => i).filter((i) => !fachas.includes(i) && i !== pas);
		const n = resta.find((i) => i > pas && !passadas.includes(i)) ?? resta.find((i) => !passadas.includes(i));
		if (n == null) return acabar();
		pas = n;
	}
	function passar() {
		if (!passadas.includes(pas)) passadas = [...passadas, pas];
		seguent();
	}
	function acabar() {
		acabat = true;
		plegada = false;
		memorizar();
		tSeguent = setTimeout(() => (actiu = false), 3400);
	}
	function dobrir(i) {
		pas = i;
		plegada = false;
	}

	// Le halo suit la commande de l'étape (un panneau qui s'ouvre, la carte qui
	// bouge) ; la note « revoir » le pose quelques secondes sur son bouton
	let notaVista = $state(false);
	$effect(() => {
		if (!actiu || acabat) return void (cibla = null);
		const e = notaVista ? nota : etapas[pas];
		if (!e?.cibla || (!notaVista && fachas.includes(pas))) return void (cibla = null);
		const viser = () => {
			const r = rectangle(e.cibla);
			const c = untrack(() => cibla);
			if (r?.x !== c?.x || r?.y !== c?.y || r?.w !== c?.w || r?.h !== c?.h) cibla = r;
		};
		viser();
		const iv = setInterval(viser, 300);
		return () => clearInterval(iv);
	});
	let tNota = null;
	function mostrarNota() {
		notaVista = true;
		clearTimeout(tNota);
		tNota = setTimeout(() => (notaVista = false), 2600);
	}
</script>

{#if actiu}
	{#if cibla}
		<div
			class="guida guida-halo"
			class:punt={cibla.punt}
			style="left: {cibla.x - 6}px; top: {cibla.y - 6}px; width: {cibla.w + 12}px; height: {cibla.h + 12}px"
			aria-hidden="true"
		></div>
	{/if}

	<section class="guida guida-lista" class:plegada aria-label={tx.titol}>
		<header>
			<button type="button" class="guida-dobrir" aria-expanded={!plegada} aria-label={plegada ? tx.desplegar : tx.plegar} onclick={() => (plegada = !plegada)}>
				<span class="guida-n">{tx.titol}</span>
				{#if !acabat}<span class="guida-pleg"><b>{pas + 1}.</b> {dire(etapas[pas]?.titol)}</span>{/if}
				<span class="guida-compte">{fachas.length} / {etapas.length}</span>
				<span class="guida-chevron" aria-hidden="true"><Icona nom="suivant" size="0.8em" /></span>
			</button>
			<button type="button" class="guida-tampar" onclick={tampar} aria-label={tx.tampar}><Icona nom="fermer" size="1em" /></button>
		</header>
		<div class="guida-barra" aria-hidden="true"><i style:width="{(fachas.length / Math.max(1, etapas.length)) * 100}%"></i></div>

		{#if acabat}
			<p class="guida-fin">{dire(fin)}</p>
		{:else if !plegada}
			<ol>
				{#each etapas as e, i (i)}
					<li class:fach={fachas.includes(i)} class:passada={passadas.includes(i)} class:dobèrta={i === pas}>
						<button type="button" class="guida-linha" aria-current={i === pas ? 'step' : undefined} onclick={() => dobrir(i)}>
							<span class="guida-casa" aria-hidden="true">
								{#if fachas.includes(i)}<Icona nom="valide" size="0.75em" />{:else}{i + 1}{/if}
							</span>
							<span class="guida-titol">{dire(e.titol)}</span>
						</button>
						{#if i === pas && !fachas.includes(i)}
							<div class="guida-etapa" aria-live="polite" transition:slide={{ duration: 260 }}>
								<p>{dire(e.tèxt)}</p>
								<button type="button" class="guida-passar" onclick={passar}>{tx.passar}</button>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
			{#if nota}
				<button type="button" class="guida-nòta" onclick={mostrarNota}>{dire(nota)}</button>
			{/if}
		{/if}
	</section>
{/if}

<style>
	.guida { position: fixed; z-index: 1200; font-family: var(--font-body); color: var(--t-tinta); }
	@keyframes guida-venir { from { opacity: 0; translate: 0 8px; } }

	/* le halo d'or autour de la commande à toucher ; il glisse quand elle bouge */
	.guida-halo { pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 10px color-mix(in srgb, var(--t-aur) 22%, transparent); animation: guida-batre 1.6s ease-out infinite; transition: left 0.35s cubic-bezier(0.19, 1, 0.22, 1), top 0.35s cubic-bezier(0.19, 1, 0.22, 1), width 0.35s cubic-bezier(0.19, 1, 0.22, 1), height 0.35s cubic-bezier(0.19, 1, 0.22, 1); }
	.guida-halo.punt { border-radius: 50%; }
	@keyframes guida-batre { 50% { box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 16px color-mix(in srgb, var(--t-aur) 0%, transparent); } }

	/* le parcours : en haut à droite, sous le bouton « ? » (loin de l'occitan,
	   qui tient la gauche et le centre) ; même verre que les panneaux de la
	   carte. Sous les vrais panneaux (pancarte « ? » 1000, recherche 1000, rail
	   1010, fiche de ville 1150) : ce que le visiteur ouvre passe devant lui. */
	.guida-lista {
		z-index: 990;
		right: var(--marge, 16px);
		top: calc(var(--cap-bas, 5.4rem) + 4.6rem);
		width: min(300px, calc(100vw - 32px));
		padding: 0.7rem 0.6rem 0.7rem 1rem;
		border-radius: 14px;
		background: var(--t-veire-fort);
		backdrop-filter: blur(10px);
		box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6);
		animation: guida-venir 0.6s cubic-bezier(0.19, 1, 0.22, 1) both;
	}
	.guida-lista header { display: flex; align-items: center; gap: 0.3rem; }
	.guida-dobrir { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.5rem; min-height: 32px; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
	.guida-n { flex: 1; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--t-aur); }
	.guida-pleg { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 0.9rem; font-weight: 700; display: none; }
	.plegada .guida-pleg { display: block; }
	.plegada .guida-n { display: none; }
	.guida-pleg b { color: var(--t-aur); }
	.guida-compte { font-size: 0.78rem; font-weight: 700; color: var(--t-tinta-2); font-variant-numeric: tabular-nums; }
	.guida-chevron { display: grid; color: var(--t-tinta-2); rotate: 90deg; transition: rotate 0.3s; }
	.plegada .guida-chevron { rotate: -90deg; }
	.guida-tampar { display: grid; place-items: center; flex: none; width: 32px; height: 32px; border: 0; border-radius: 50%; background: none; color: var(--t-tinta-2); cursor: pointer; }
	.guida-tampar:hover { color: var(--t-tinta); background: color-mix(in srgb, var(--t-tinta) 10%, transparent); }
	.guida-lista button:focus-visible { outline: 2px solid var(--t-aur); outline-offset: 2px; }

	/* la barre d'avancement, fine, sous le titre */
	.guida-barra { height: 3px; margin: 0.35rem 0.4rem 0.2rem 0; border-radius: 3px; background: color-mix(in srgb, var(--t-tinta) 12%, transparent); overflow: hidden; }
	.guida-barra i { display: block; height: 100%; border-radius: inherit; background: var(--t-aur); transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1); }

	.guida-lista ol { margin: 0.3rem 0 0; padding: 0; list-style: none; }
	.guida-linha { display: flex; align-items: center; gap: 0.6rem; width: 100%; min-height: 36px; padding: 0.2rem 0.3rem; border: 0; border-radius: 8px; background: none; color: var(--t-tinta-2); font: inherit; font-size: 0.92rem; text-align: left; cursor: pointer; transition: color 0.3s, background 0.3s; }
	.guida-linha:hover { background: color-mix(in srgb, var(--t-aur) 10%, transparent); color: var(--t-tinta); }
	.dobèrta .guida-linha { color: var(--t-tinta); font-weight: 700; }
	.fach .guida-titol { text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--t-aur) 60%, transparent); }
	.passada .guida-titol { opacity: 0.6; }
	.guida-casa { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid color-mix(in srgb, var(--t-aur) 55%, transparent); font-size: 0.68rem; font-weight: 700; color: var(--t-tinta-2); transition: background 0.4s, border-color 0.4s; }
	.dobèrta .guida-casa { border-color: var(--t-aur); color: var(--t-aur); }
	.fach .guida-casa { border-color: var(--t-aur); background: var(--t-aur); color: var(--t-fons); animation: guida-cochar 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
	@keyframes guida-cochar { from { scale: 0.4; } }
	.guida-etapa { padding: 0 0.3rem 0.3rem 2.2rem; }
	.guida-etapa p { margin: 0.1rem 0 0.2rem; font-size: 0.86rem; line-height: 1.45; color: var(--t-tinta); }
	.guida-passar { min-height: 32px; padding: 0; border: 0; background: none; font: inherit; font-size: 0.8rem; color: var(--t-tinta-2); cursor: pointer; text-decoration: underline; text-underline-offset: 0.2em; }
	.guida-nòta { display: block; margin: 0.35rem 0 0; padding: 0.3rem; border: 0; background: none; font: inherit; font-size: 0.78rem; color: var(--t-tinta-2); text-align: left; cursor: pointer; text-decoration: underline dotted; text-underline-offset: 0.2em; }
	.guida-fin { margin: 0.5rem 0 0.3rem; font-family: var(--font-heading); font-size: 1.3rem; line-height: 1.2; animation: guida-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }

	/* repliée : une ligne, le titre de l'étape et le compte */
	.guida-lista.plegada { width: auto; max-width: min(300px, calc(100vw - 68px)); padding: 0.3rem 0.4rem 0.3rem 0.9rem; }
	.plegada .guida-barra { display: none; }

	/* téléphone : en haut, sous la recherche (en bas s'ouvrent les panneaux des
	   couches, l'étiquette du territoire et la fiche de ville) ; la colonne des
	   boutons de la carte reste libre à droite ; sous la liste de la recherche
	   (1000). Seule l'étape ouverte se montre, son titre dans l'en-tête. */
	@container carta (max-width: 600px) {
		.guida-lista { z-index: 995; top: calc(var(--cap-bas, 4rem) + 72px); right: auto; left: 8px; width: min(300px, calc(100vw - 68px)); }
		.guida-n { display: none; }
		.guida-pleg { display: block; }
		.guida-lista li:not(.dobèrta), .dobèrta .guida-linha { display: none; }
		.guida-etapa { padding-left: 0; }
		.guida-nòta { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.guida-lista, .guida-halo, .guida-fin, .fach .guida-casa { animation: none; }
		.guida-halo, .guida-barra i { transition: none; }
	}
</style>
