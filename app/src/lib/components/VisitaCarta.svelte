<script>
	// La première visite guidée de la carte (DIRECCION §1 : « rien ne dit à un
	// nouveau venu par où commencer » ; la carte est le premier clic du site
	// depuis le 2026-10-22). Trois formes à comparer sur /carta?ensag=visita :
	//   A « Trois gestes » : trois bulles, une par commande (Sus la carta, la
	//     recherche, le zoom), l'une après l'autre ;
	//   B « Le fil » : une petite carte en bas à gauche, qui avance quand on
	//     fait vraiment le geste (toucher un dialecte, chercher, ouvrir le rail) ;
	//   C « Trois portes » : un panneau d'accueil, trois entrées (le territoire,
	//     la revitalisation, ma ville). Seconde porte renommée le 22-10 (Romain).
	// Forme retenue par Romain le 2026-10-22 : « Trois portes » (« à voir car ça ne
	// couvre pas tout ») ; les deux autres restent comparables sur l'essai.
	// Règles : rien avant la fin de l'entrée en scène (ou le premier geste), le
	// clic ailleurs ferme, « Passar » toujours possible, mémorisé une fois hors
	// essai. Occitan nouveau : à valider par Romain (mots vérifiés par l'API).
	import { onMount } from 'svelte';
	import Icona from './Icona.svelte';

	let { forma = $bindable('portas'), ensag = false, lang = 'oc', onPorta = () => {} } = $props();

	const CLAU = 'lo-ligam-carta-visita';
	const FORMAS = [
		['actual', 'Actuelle'],
		['gestes', 'Trois gestes'],
		['fil', 'Le fil'],
		['portas', 'Trois portes']
	];

	const T = {
		oc: {
			passar: 'Passar',
			seguent: 'Seguent',
			compres: 'Comprés',
			gestes: [
				{ cibla: '.rail .rail-sus', tèxt: 'Aicí causisses çò que la carta mòstra.' },
				{ cibla: '.cerca', tèxt: 'Cèrca ta vila o ton despartament.' },
				{ cibla: '.leaflet-control-zoom', tèxt: 'Sarra-te : los noms arriban.' }
			],
			fil: ['Tòca un dialècte sus la carta.', 'Cèrca ta vila.', 'Dobrís « Sus la carta ».'],
			filFin: 'Aicí, tot es a tu.',
			portasTitol: 'Benvenguda sus la carta',
			portasTèxt: 'Lo territòri de l’occitan, e sa reviscolada.',
			portas: [
				['territori', 'Lo territòri'],
				['reviscolada', 'La reviscolada'],
				['vila', 'Ma vila']
			]
		},
		fr: {
			passar: 'Passer',
			seguent: 'Suivant',
			compres: 'Compris',
			gestes: [
				{ cibla: '.rail .rail-sus', tèxt: 'Ici tu choisis ce que la carte montre.' },
				{ cibla: '.cerca', tèxt: 'Cherche ta ville ou ton département.' },
				{ cibla: '.leaflet-control-zoom', tèxt: 'Approche-toi : les noms arrivent.' }
			],
			fil: ['Touche un dialecte sur la carte.', 'Cherche ta ville.', 'Ouvre « Sus la carta ».'],
			filFin: 'Ici, tout est à toi.',
			portasTitol: 'Bienvenue sur la carte',
			portasTèxt: 'Le territoire de l’occitan, et sa revitalisation.',
			portas: [
				['territori', 'Le territoire'],
				['reviscolada', 'La revitalisation'],
				['vila', 'Ma ville']
			]
		}
	};
	const tx = $derived(T[lang] ?? T.oc);

	let actiu = $state(false); // le guide se montre
	let pas = $state(0); // étape en cours (A et B)
	let finit = $state(false); // B : les trois gestes faits
	let cibla = $state(null); // A : rectangle de la commande visée
	let bulla = $state({ x: 0, y: 0 });
	let bullaEl = $state(null);

	function memorizar() {
		if (ensag) return;
		try {
			localStorage.setItem(CLAU, '1');
		} catch {
			// stockage indisponible : on montrera encore la prochaine fois
		}
	}
	function tampar() {
		actiu = false;
		memorizar();
	}

	// Rien avant la fin de l'entrée en scène de la carte (≈ 10 s) ou le premier
	// geste du visiteur, qui l'écourte aussi ; puis un court temps de respiration.
	onMount(() => {
		if (!ensag) {
			try {
				if (localStorage.getItem(CLAU)) return;
			} catch {
				// on continue
			}
		}
		let t = null;
		const partir = () => {
			if (t) return;
			t = setTimeout(() => (actiu = true), 1500);
			for (const ev of ['pointerdown', 'wheel', 'keydown']) window.removeEventListener(ev, partir, true);
		};
		for (const ev of ['pointerdown', 'wheel', 'keydown']) window.addEventListener(ev, partir, true);
		const tard = setTimeout(partir, 11000);
		return () => {
			clearTimeout(tard);
			if (t) clearTimeout(t);
			for (const ev of ['pointerdown', 'wheel', 'keydown']) window.removeEventListener(ev, partir, true);
		};
	});

	// Changer de forme pendant l'essai : on repart du début
	$effect(() => {
		forma;
		pas = 0;
		finit = false;
	});

	// A : viser la commande de l'étape, bulle à côté (à droite du rail sur
	// ordinateur, au-dessus sur téléphone), halo sur la commande.
	$effect(() => {
		if (!actiu || forma !== 'gestes') {
			cibla = null;
			return;
		}
		const viser = () => {
			const etapa = tx.gestes[pas];
			const el = etapa && document.querySelector(etapa.cibla);
			if (!el) {
				// commande absente (zoom caché sur téléphone, par exemple) : on saute l'étape
				if (pas < tx.gestes.length - 1) pas += 1;
				else tampar();
				return;
			}
			const r = el.getBoundingClientRect();
			cibla = { x: r.left, y: r.top, w: r.width, h: r.height };
			const bw = bullaEl?.offsetWidth ?? 280, bh = bullaEl?.offsetHeight ?? 120, marge = 12;
			let x = r.right + marge, y = r.top + r.height / 2 - bh / 2;
			if (x + bw > innerWidth - 8) x = r.left - bw - marge; // à gauche
			if (x < 8) { x = Math.max(8, Math.min(r.left, innerWidth - bw - 8)); y = r.top - bh - marge; } // au-dessus
			if (y + bh > innerHeight - 8) y = r.top - bh - marge;
			y = Math.max(72, y);
			bulla = { x, y };
		};
		viser();
		addEventListener('resize', viser);
		const t = setTimeout(viser, 60); // la bulle connaît sa taille
		return () => {
			removeEventListener('resize', viser);
			clearTimeout(t);
		};
	});

	// B : chaque geste réel fait avancer le fil
	$effect(() => {
		if (!actiu || forma !== 'fil' || finit) return;
		const carta = document.querySelector('.leaflet-container');
		const cerca = document.querySelector('#cerca-carta');
		const sus = document.querySelector('.rail .rail-sus');
		const avançar = (n) => () => {
			if (pas !== n) return;
			if (n < 2) pas = n + 1;
			else {
				finit = true;
				memorizar();
				setTimeout(() => (actiu = false), 2600);
			}
		};
		const f0 = avançar(0), f1 = avançar(1), f2 = avançar(2);
		carta?.addEventListener('click', f0);
		cerca?.addEventListener('focus', f1);
		sus?.addEventListener('click', f2);
		return () => {
			carta?.removeEventListener('click', f0);
			cerca?.removeEventListener('focus', f1);
			sus?.removeEventListener('click', f2);
		};
	});

	// Clic ailleurs : fermer (principe du site), sauf sur le fil qui ne gêne pas
	$effect(() => {
		if (!actiu || forma === 'fil' || forma === 'actual') return;
		const defòra = (e) => {
			if (e.target.closest('.visita, .visita-causida')) return;
			tampar();
		};
		const tòca = (e) => e.key === 'Escape' && tampar();
		// (capture : avant la carte, qui avale les clics)
		setTimeout(() => document.addEventListener('pointerdown', defòra, true), 0);
		document.addEventListener('keydown', tòca);
		return () => {
			document.removeEventListener('pointerdown', defòra, true);
			document.removeEventListener('keydown', tòca);
		};
	});

	function porta(k) {
		onPorta(k);
		tampar();
	}
</script>

{#if actiu && forma === 'gestes' && cibla}
	<div class="visita visita-halo" style="left: {cibla.x - 6}px; top: {cibla.y - 6}px; width: {cibla.w + 12}px; height: {cibla.h + 12}px" aria-hidden="true"></div>
	<div class="visita visita-bulla" role="dialog" aria-live="polite" bind:this={bullaEl} style="left: {bulla.x}px; top: {bulla.y}px">
		<p class="visita-n">{pas + 1} / {tx.gestes.length}</p>
		<p class="visita-tèxt">{tx.gestes[pas].tèxt}</p>
		<div class="visita-accions">
			<button type="button" class="visita-passar" onclick={tampar}>{tx.passar}</button>
			{#if pas < tx.gestes.length - 1}
				<button type="button" class="visita-boton" onclick={() => (pas += 1)}>{tx.seguent} <Icona nom="suivant" size="0.9em" /></button>
			{:else}
				<button type="button" class="visita-boton" onclick={tampar}>{tx.compres}</button>
			{/if}
		</div>
	</div>
{/if}

{#if actiu && forma === 'fil'}
	<div class="visita visita-fil" role="status" aria-live="polite">
		{#if finit}
			<p class="visita-tèxt">{tx.filFin}</p>
		{:else}
			<p class="visita-n">{pas + 1} / 3</p>
			<p class="visita-tèxt">{tx.fil[pas]}</p>
			<button type="button" class="visita-passar" onclick={tampar}>{tx.passar}</button>
		{/if}
	</div>
{/if}

{#if actiu && forma === 'portas'}
	<div class="visita visita-vel" aria-hidden="true"></div>
	<div class="visita visita-portas" role="dialog" aria-labelledby="visita-titol">
		<h2 id="visita-titol">{tx.portasTitol}</h2>
		<p class="visita-tèxt">{tx.portasTèxt}</p>
		<div class="visita-pòrtas">
			{#each tx.portas as [k, nom] (k)}
				<button type="button" class="visita-pòrta" onclick={() => porta(k)}>{nom} <Icona nom="suivant" size="0.9em" /></button>
			{/each}
		</div>
		<button type="button" class="visita-passar" onclick={tampar}>{tx.passar}</button>
	</div>
{/if}

{#if ensag}
	<!-- Outil d'essai (hors charte) -->
	<div class="visita-causida" role="group" aria-label="Essai : première visite de la carte">
		{#each FORMAS as [v, nom] (v)}
			<button type="button" aria-pressed={forma === v} onclick={() => { forma = v; actiu = true; }}>{nom}</button>
		{/each}
	</div>
{/if}

<style>
	.visita { position: fixed; z-index: 1200; font-family: var(--font-body); color: var(--t-tinta); }
	.visita-tèxt { margin: 0; font-size: 1.05rem; line-height: 1.45; }
	.visita-n { margin: 0 0 0.35rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; color: var(--t-aur); }
	.visita-passar { border: 0; background: none; padding: 0.5rem 0; min-height: 44px; font: inherit; font-size: 0.85rem; color: var(--t-tinta-2); cursor: pointer; text-decoration: underline; text-underline-offset: 0.2em; }
	.visita-boton { display: inline-flex; align-items: center; gap: 0.5rem; min-height: 44px; padding: 0 1.1rem; border: 0; border-radius: 999px; background: var(--t-terra); color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
	.visita-accions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.8rem; }

	/* A : la bulle et le halo sur la commande */
	.visita-bulla { width: min(300px, calc(100vw - 16px)); padding: 1rem 1.1rem; border-radius: 14px; background: var(--t-veire-fort); backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6); animation: visita-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }
	.visita-halo { pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 10px color-mix(in srgb, var(--t-aur) 22%, transparent); animation: visita-batre 1.6s ease-out infinite; }
	@keyframes visita-batre { 50% { box-shadow: 0 0 0 2px var(--t-aur), 0 0 0 16px color-mix(in srgb, var(--t-aur) 0%, transparent); } }
	@keyframes visita-venir { from { opacity: 0; translate: 0 8px; } }

	/* B : le fil, en bas à gauche, au-dessus de la bande du téléphone */
	.visita-fil { left: max(16px, var(--marge, 16px)); bottom: calc(var(--cap-bas, 0px) + 16px); width: min(280px, calc(100vw - 32px)); padding: 0.9rem 1.1rem; border-radius: 14px; background: var(--t-veire-fort); backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6); animation: visita-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }

	/* C : le panneau et son voile */
	.visita-vel { inset: 0; background: color-mix(in srgb, var(--t-fons) 45%, transparent); }
	.visita-portas { left: 50%; top: 50%; translate: -50% -50%; width: min(440px, calc(100vw - 32px)); padding: 1.6rem 1.6rem 1rem; border-radius: 18px; background: var(--t-veire-fort); backdrop-filter: blur(12px); box-shadow: 0 1px 0 var(--t-linha) inset, 0 24px 60px -24px rgba(0, 0, 0, 0.7); animation: visita-venir 0.45s cubic-bezier(0.19, 1, 0.22, 1) both; }
	.visita-portas h2 { margin: 0 0 0.6rem; font-family: var(--font-heading); font-weight: 400; font-size: clamp(1.6rem, 3vw, 2.2rem); line-height: 1.05; }
	.visita-pòrtas { display: grid; gap: 0.5rem; margin: 1.2rem 0 0.4rem; }
	.visita-pòrta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 52px; padding: 0 1rem; border: 1px solid var(--t-linha); border-radius: 12px; background: none; color: var(--t-tinta); font: inherit; font-weight: 700; cursor: pointer; transition: background 0.3s, border-color 0.3s; }
	.visita-pòrta:hover, .visita-pòrta:focus-visible { background: color-mix(in srgb, var(--t-terra) 14%, transparent); border-color: var(--t-terra); }

	/* Outil d'essai, volontairement neutre */
	.visita-causida { position: fixed; left: 50%; bottom: calc(var(--cap-bas, 0px) + 12px); z-index: 2000; transform: translateX(-50%); display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: #ffffff; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35); font: 700 0.8rem/1 system-ui, sans-serif; }
	.visita-causida button { border: 0; border-radius: 999px; padding: 0.55rem 0.9rem; background: transparent; color: #222222; font: inherit; cursor: pointer; white-space: nowrap; }
	.visita-causida button[aria-pressed='true'] { background: #222222; color: #ffffff; }
	@media (max-width: 700px) {
		/* téléphone : les pastilles montent sous la recherche, pour ne pas couvrir la bulle ni le fil */
		.visita-causida { top: 140px; bottom: auto; }
	}

	@media (prefers-reduced-motion: reduce) {
		.visita, .visita-halo { animation: none; }
	}
</style>
