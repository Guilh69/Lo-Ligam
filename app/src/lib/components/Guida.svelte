<script>
	// Les « Primièrs passes » : le tutoriel de première connexion (Romain,
	// 2026-10-23). Il remplace le panneau « Trois portes » de la carte, qui
	// donnait un but mais pas le mode d'emploi des commandes (réserve de Romain
	// du 22-10) et que Romain a fait retirer. Un moteur commun : chaque page lui
	// donne ses étapes (la commande visée, le texte dans les deux langues, le
	// geste qui la coche) ; la carte d'abord, les autres pages ensuite.
	// Forme retenue par Romain sur essai (contre « Bulles » et « Démonstration ») :
	// une petite liste à cocher, qui ne bloque rien ; une ligne se coche quand le
	// geste est vraiment fait, toucher une ligne montre sa commande (halo d'or).
	// Règles : elle part dès que la page est prête (la carte : écran de chargement
	// levé) ; la croix la ferme ; une seule fois par navigateur (mémorisé à la
	// fermeture ou quand tout est coché, sinon elle revient à la visite suivante) ;
	// relançable (lançar), sans mémoire en essai (?ensag=guida). Occitan nouveau :
	// à valider par Romain.
	import { onMount } from 'svelte';
	import Icona from './Icona.svelte';

	let {
		etapas = [], // [{ cibla (sélecteur, ou fonction → rectangle), punt?, oc, fr, linha?: { oc, fr }, fait?: { ev, sel, sauf? } }]
		clau, // la clé de mémoire (localStorage)
		fin = { oc: '', fr: '' }, // le mot de la fin, quand tout est coché
		lang = 'oc',
		ensag = false,
		lest = true, // la page est prête (la carte : écran de chargement levé)
		espera = 800 // ms après « lest », le temps que l'écran de chargement s'efface
	} = $props();

	const T = {
		oc: { titol: 'Primièrs passes', tampar: 'Tampar' },
		fr: { titol: 'Premiers pas', tampar: 'Fermer' }
	};
	const tx = $derived(T[lang] ?? T.oc);
	const dire = (o) => o?.[lang] ?? o?.oc ?? '';

	let actiu = $state(false);
	let visiblas = $state([]); // les étapes dont la commande est à l'écran
	let fachas = $state([]); // les étapes dont le geste est fait
	let cibla = $state(null); // le rectangle de la commande montrée
	let mostrada = $state(null); // l'étape montrée (sa phrase s'ouvre sous la ligne)
	let plegada = $state(false); // repliée sur son titre (toucher le titre la rouvre)

	// les lignes à cocher (un geste), et les notes (sans geste : où revoir le guide)
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
		// un point au milieu (la carte : là où l'on touche)
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
	let partit = false; // déjà lancé : le départ automatique n'a plus lieu
	// (re)lancer : au départ, ou depuis le bouton qui revoit les premiers pas
	export function lançar() {
		partit = true;
		visiblas = etapas.filter((e) => trobar(e));
		if (!visiblas.length) return;
		fachas = [];
		cibla = null;
		plegada = false;
		actiu = true;
	}

	// Le départ : dès que la page est prête (choix de Romain, 2026-10-23 : la
	// liste ne bloque rien, on peut agir tout de suite)
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

	// Chaque geste réellement fait coche sa ligne
	$effect(() => {
		if (!actiu) return;
		const escotas = [];
		visiblas.forEach((e, i) => {
			if (!e.fait) return;
			const f = (ev) => {
				const t = ev.target;
				if (!(t instanceof Element) || t.closest('.guida') || !t.closest(e.fait.sel)) return;
				if (e.fait.sauf && t.closest(e.fait.sauf)) return;
				if (fachas.includes(i)) return;
				fachas = [...fachas, i];
				// téléphone : la liste se replie après le geste (dépliée, elle cachait
				// l'étiquette du territoire touché, en bas au milieu)
				clearTimeout(tPlegar);
				if (innerWidth <= 600) tPlegar = setTimeout(() => (plegada = true), 1400);
			};
			document.addEventListener(e.fait.ev, f, true);
			escotas.push([e.fait.ev, f]);
		});
		return () => escotas.forEach(([ev, f]) => document.removeEventListener(ev, f, true));
	});
	let tPlegar = null;
	// tout est coché : le mot de la fin, puis la liste s'en va
	$effect(() => {
		if (!actiu || !totas) return;
		memorizar();
		const t = setTimeout(() => (actiu = false), 3400);
		return () => clearTimeout(t);
	});
	// toucher une ligne montre sa commande quelques secondes, et dit à quoi elle sert
	let tMostrar = null;
	function mostrar(e) {
		cibla = rectangle(e);
		mostrada = e;
		clearTimeout(tMostrar);
		tMostrar = setTimeout(() => (cibla = null), 2600);
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
			<button type="button" class="guida-dobrir" aria-expanded={!plegada} onclick={() => { plegada = !plegada; clearTimeout(tPlegar); }}>
				<span class="guida-n">{tx.titol}</span>
				<span class="guida-compte">{fachas.length} / {linhas.length}</span>
				<span class="guida-chevron" aria-hidden="true"><Icona nom="suivant" size="0.8em" /></span>
			</button>
			<button type="button" class="guida-tampar" onclick={tampar} aria-label={tx.tampar}><Icona nom="fermer" size="1em" /></button>
		</header>
		{#if totas}
			<p class="guida-fin">{dire(fin)}</p>
		{:else if !plegada}
			<ul>
				{#each linhas as { e, i } (i)}
					<li>
						<button type="button" class:fach={fachas.includes(i)} onclick={() => mostrar(e)}>
							<span class="guida-casa" aria-hidden="true">{#if fachas.includes(i)}<Icona nom="valide" size="0.75em" />{/if}</span>
							<span>
								<span class="guida-linha">{dire(e.linha)}</span>
								{#if mostrada === e}<span class="guida-explic">{dire(e)}</span>{/if}
							</span>
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

<style>
	.guida { position: fixed; z-index: 1200; font-family: var(--font-body); color: var(--t-tinta); }
	@keyframes guida-venir { from { opacity: 0; translate: 0 8px; } }

	/* le halo d'or autour de la commande montrée */
	.guida-halo { pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 10px color-mix(in srgb, var(--t-aur) 22%, transparent); animation: guida-batre 1.6s ease-out infinite; }
	.guida-halo.punt { border-radius: 50%; }
	@keyframes guida-batre { 50% { box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 16px color-mix(in srgb, var(--t-aur) 0%, transparent); } }

	/* la liste : en haut à droite, sous le bouton « ? » (loin de l'occitan, qui
	   tient la gauche et le centre ; en bas à droite, elle cachait Niça) ; même
	   verre que les panneaux de la carte. Sous les vrais panneaux (pancarte « ? »
	   1000, recherche 1000, rail 1010, fiche de ville 1150) : ce que le visiteur
	   ouvre passe devant elle. */
	.guida-lista {
		z-index: 990;
		right: var(--marge, 16px);
		top: calc(var(--cap-bas, 5.4rem) + 4.6rem);
		width: min(280px, calc(100vw - 32px));
		padding: 0.8rem 0.6rem 0.7rem 1.1rem;
		border-radius: 14px;
		background: var(--t-veire-fort);
		backdrop-filter: blur(10px);
		box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6);
		animation: guida-venir 0.6s cubic-bezier(0.19, 1, 0.22, 1) both;
	}
	/* repliée : une ligne, titre et compte (assez basse pour laisser voir
	   l'étiquette du territoire au-dessus, sur téléphone) */
	.guida-lista.plegada { width: auto; padding: 0.3rem 0.4rem 0.3rem 0.9rem; }
	.guida-lista header { display: flex; align-items: center; gap: 0.3rem; }
	.guida-dobrir { flex: 1; display: flex; align-items: center; gap: 0.5rem; min-height: 32px; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; }
	.guida-chevron { display: grid; color: var(--t-tinta-2); rotate: 90deg; transition: rotate 0.3s; }
	.plegada .guida-chevron { rotate: -90deg; }
	.guida-n { flex: 1; margin: 0; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--t-aur); }
	.guida-compte { font-size: 0.78rem; font-weight: 700; color: var(--t-tinta-2); font-variant-numeric: tabular-nums; }
	.guida-tampar { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 50%; background: none; color: var(--t-tinta-2); cursor: pointer; }
	.guida-tampar:hover { color: var(--t-tinta); background: color-mix(in srgb, var(--t-tinta) 10%, transparent); }
	.guida-lista ul { margin: 0.3rem 0 0; padding: 0; list-style: none; }
	.guida-lista li button { display: flex; align-items: flex-start; gap: 0.65rem; width: 100%; min-height: 40px; padding: 0.55rem 0.3rem 0.4rem; border: 0; border-radius: 8px; background: none; color: var(--t-tinta); font: inherit; font-size: 0.95rem; text-align: left; cursor: pointer; transition: color 0.4s, background 0.3s; }
	.guida-lista li button:hover { background: color-mix(in srgb, var(--t-aur) 10%, transparent); }
	.guida-lista li button.fach .guida-linha { color: var(--t-tinta-2); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--t-aur) 60%, transparent); }
	.guida-explic { display: block; padding: 0.15rem 0 0.45rem; font-size: 0.82rem; line-height: 1.4; color: var(--t-tinta-2); animation: guida-venir 0.4s cubic-bezier(0.19, 1, 0.22, 1) both; }
	.guida-lista button:focus-visible { outline: 2px solid var(--t-aur); outline-offset: 2px; }
	.guida-casa { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--t-aur); color: var(--t-fons); transition: background 0.4s; }
	.fach .guida-casa { background: var(--t-aur); animation: guida-cochar 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
	@keyframes guida-cochar { from { scale: 0.4; } }
	.guida-nòta { display: block; margin: 0.35rem 0 0; padding: 0.3rem; border: 0; background: none; font: inherit; font-size: 0.8rem; color: var(--t-tinta-2); text-align: left; cursor: pointer; text-decoration: underline dotted; text-underline-offset: 0.2em; }
	.guida-fin { margin: 0.5rem 0 0.3rem; font-family: var(--font-heading); font-size: 1.3rem; line-height: 1.2; animation: guida-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }

	/* téléphone : au-dessus de la barre des couches, à gauche (la colonne des
	   boutons de la carte reste libre à droite) */
	@container carta (max-width: 600px) {
		/* (devant l'échelle de la carte, 1000, qui passait par-dessus ; toujours
		   sous le rail et la fiche de ville) */
		.guida-lista { z-index: 1005; top: auto; right: auto; left: 8px; bottom: calc(var(--barra-bas, 0px) + 8px); width: min(300px, calc(100vw - 68px)); }
	}

	@media (prefers-reduced-motion: reduce) {
		.guida-lista, .guida-halo, .guida-fin, .guida-explic, .fach .guida-casa { animation: none; }
	}
</style>
