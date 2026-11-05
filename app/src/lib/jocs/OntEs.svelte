<script>
	// « Ont es… ? » (Romain, 05-11 : le défilé de paysages, « 1 et 3 ») : une
	// photo de Romain, un mot occitan demandé, on touche le bon endroit. Huit
	// photos par partie, un mot chacune. Les mêmes paysages et les mêmes points
	// que Remira (Paisatges) : $lib/paisatges/paisatges.js. Ces mots de nature
	// ne sont pas dans l'A1 : ils viennent toujours avec leur français.
	// Toucher un autre point dit son nom (on apprend en se trompant) ; après
	// deux essais, le bon endroit se montre ; pas de score. Niveau « Amb
	// ajuda » : les points d'or se voient ; « Sens ajuda » : à chercher soi-même.
	// Au clavier, Tab passe d'un endroit à l'autre de la photo, Entrée choisit.
	import { onMount } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { PAISATGES, MOTS, camin, srcset } from '$lib/paisatges/paisatges.js';
	import { playTick, playChime } from '$lib/lesson/sounds.js';
	import Reglatges from '$lib/jocs/Reglatges.svelte';
	import BotonEcran from '$lib/jocs/BotonEcran.svelte';

	// Occitan passé à lo Congrès le 2026-11-05 (endrech, fòto, ajuda, amb,
	// sens, aquí, òsca ; escriu, tòca, es par vèrb'Òc), à valider par Romain.
	const T = {
		consigna: {
			oc: 'Un mot s’escriu : tòca son endrech sus la fòto.',
			fr: 'Un mot s’écrit : touche sa place sur la photo.'
		},
		nivel: { oc: 'Nivèl', fr: 'Niveau' },
		amb: { oc: 'Amb ajuda', fr: 'Avec aide' },
		sens: { oc: 'Sens ajuda', fr: 'Sans aide' },
		reglatges: { oc: 'Reglatges', fr: 'Réglages' },
		son: { oc: 'Son', fr: 'Son' },
		tornarJogar: { oc: 'Tornar jogar', fr: 'Rejouer' },
		compte: { oc: (n, t) => `${n} sus ${t}`, fr: (n, t) => `${n} sur ${t}` },
		pasAqui: { oc: 'Pas aquí.', fr: 'Pas ici.' },
		aqui: { oc: 'Es aquí.', fr: 'C’est ici.' },
		fin: { oc: 'Òsca !', fr: 'Bravo !' },
		mots: { oc: 'Los mots', fr: 'Les mots' },
		camp: { oc: 'La fòto', fr: 'La photo' },
		endrech: { oc: (k, t) => `Endrech ${k} sus ${t}`, fr: (k, t) => `Endroit ${k} sur ${t}` }
	};

	const CLAU_SON = 'lo-ligam-jocs-son'; // partagé avec la sèrp et les paniers
	const TOTAL = 8;
	const TOCA = 0.11; // un bon toucher : à moins de 11 % du grand côté de la photo

	let nivel = $state('amb');
	let immersiu = $state(false);
	let son = $state(true);
	let calme = $state(false);
	let racina = $state();
	let imatge = $state();

	let partida = $state([]); // [{ k, oc }]
	let pas = $state(0);
	let fase = $state('cerca'); // 'cerca', 'trobat', 'fin'
	let errors = $state(0);
	let vist = $state(null); // le mot montré sur la photo : { oc, x, y, bon, id }
	let tocs = $state([]); // un rond là où on a touché à côté
	let tremola = $state(false);
	let anonci = $state('');
	let seq = 0;
	let minuteur = 0;

	const q = $derived(partida[pas]);
	const p = $derived(q ? PAISATGES[q.k] : null);
	const cibla = $derived(q && p ? p.mots.find(([oc]) => oc === q.oc) : null);
	const trobats = $derived(pas + (fase === 'cerca' ? 0 : 1));
	// le premier sens seulement dans la question (« le bois », pas « le bois, la forêt »)
	const primier = (oc) => MOTS[oc].split(',')[0];

	function barrejar(t) {
		const a = [...t];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function precargar(k) {
		const r = partida[k];
		if (!r) return;
		const i = new Image();
		i.srcset = srcset(PAISATGES[r.k]);
		i.sizes = '(min-width: 52rem) 60vw, 100vw';
		i.src = camin(PAISATGES[r.k].clau, PAISATGES[r.k].amples[0]);
	}

	function començar() {
		clearTimeout(minuteur);
		// huit photos différentes, un mot chacune, le moins de redites possible
		const demandats = new Set();
		partida = barrejar(PAISATGES.map((_, k) => k))
			.slice(0, TOTAL)
			.map((k) => {
				const mots = barrejar(PAISATGES[k].mots.map(([oc]) => oc));
				const oc = mots.find((m) => !demandats.has(m)) ?? mots[0];
				demandats.add(oc);
				return { k, oc };
			});
		pas = 0;
		apreparar();
	}

	function apreparar() {
		fase = 'cerca';
		errors = 0;
		vist = null;
		tocs = [];
		anonci = `Ont es ${q.oc} ? Où est ${primier(q.oc)} ?`;
		precargar(pas + 1);
	}

	function seguent() {
		clearTimeout(minuteur);
		if (pas + 1 >= TOTAL) {
			fase = 'fin';
			vist = null;
			anonci = `${tria(T.fin)} ${partida.map((r) => r.oc).join(', ')}.`;
			if (son) setTimeout(playChime, 150);
			return;
		}
		pas++;
		apreparar();
	}

	const distancia = (ax, ay, bx, by) => {
		const M = Math.max(p.l, p.h);
		return Math.hypot(((ax - bx) * p.l) / M, ((ay - by) * p.h) / M);
	};

	function causir(fx, fy) {
		if (fase === 'trobat') return seguent(); // un toucher fait passer plus vite
		if (fase !== 'cerca' || !cibla) return;
		if (distancia(fx, fy, cibla[1], cibla[2]) < TOCA) {
			fase = 'trobat';
			vist = { oc: q.oc, x: cibla[1], y: cibla[2], bon: true, id: ++seq };
			anonci = `${q.oc} : ${MOTS[q.oc]}.`;
			if (son) playChime();
			minuteur = setTimeout(seguent, 2600);
			return;
		}
		errors++;
		if (son) playTick();
		// à côté : si c'est un autre point de la photo, il dit son nom
		const autre = p.mots.find(([oc, x, y]) => oc !== q.oc && distancia(fx, fy, x, y) < TOCA);
		if (autre) vist = { oc: autre[0], x: autre[1], y: autre[2], bon: false, id: ++seq };
		else {
			const t = { x: fx, y: fy, id: ++seq };
			tocs = [...tocs, t];
			setTimeout(() => (tocs = tocs.filter((u) => u !== t && u.id !== t.id)), 900);
		}
		if (!calme) {
			tremola = false;
			requestAnimationFrame(() => (tremola = true));
		}
		anonci = `${autre ? `${autre[0]} : ${MOTS[autre[0]]}. ` : ''}${tria(T.pasAqui)}${errors >= 2 ? ' ' + tria(T.aqui) : ''}`;
	}

	function tocar(e) {
		if (!imatge || e.target.closest?.('.ponch, .fin')) return;
		const r = imatge.getBoundingClientRect();
		const fx = (e.clientX - r.left) / r.width,
			fy = (e.clientY - r.top) / r.height;
		if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return;
		causir(fx, fy);
	}

	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {
			/* navigation privée : le réglage dure le temps de la page */
		}
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {
			/* rien de gardé */
		}
		començar();
		return () => clearTimeout(minuteur);
	});
</script>

<section class="joc ont-es" class:immersiu aria-labelledby="titol-ont-es" bind:this={racina}>
	<div class="disposicion">
		<header class="cap-joc">
			<h2 id="titol-ont-es" lang="oc">Ont es… ?</h2>
			<p class="consigna">{tria(T.consigna)}</p>
		</header>

		<div class="pista">
			<div class="pista-info">
				{#if q && fase !== 'fin'}
					<p class="question" lang="oc">Ont es <span class="nowrap"><span class="chip">{q.oc}</span>&nbsp;?</span></p>
					<p class="trad" lang="fr">Où est {primier(q.oc)} ?</p>
				{/if}
				<p class="compte" aria-hidden="true">{tria(T.compte)(trobats, TOTAL)}</p>
				<span class="granas" aria-hidden="true">{#each partida as r, k (r.k)}<i class:rengat={k < trobats}></i>{/each}</span>
			</div>
			<BotonEcran bind:actiu={immersiu} cibla={racina} />
		</div>

		<div class="taula">
			{#if fase === 'fin'}
				<!-- la fin : à la place de la photo, toute la liste visible (sur
				     téléphone, une photo large est trop basse pour la porter) -->
				<div class="fin">
					<p class="fin-oc" lang="oc">{tria(T.fin)}</p>
					<p class="fin-titol">{tria(T.mots)}</p>
					<ul class="resum">
						{#each partida as r (r.k)}
							<li><span lang="oc">{r.oc}</span> <span class="fr" lang="fr">{MOTS[r.oc]}</span></li>
						{/each}
					</ul>
					<button type="button" class="accion" onclick={començar}>{tria(T.tornarJogar)}</button>
				</div>
			{:else if p}
				{#key pas}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<!-- (au clavier : les endroits de la photo sont des boutons, juste en dessous) -->
					<div
						class="camp"
						class:calme
						class:tremola
						class:sens={nivel === 'sens'}
						style:--r={p.l / p.h}
						onclick={tocar}
						onanimationend={(e) => e.animationName.includes('tremolar') && (tremola = false)}
					>
						<div class="dins">
						<img
							bind:this={imatge}
							src={camin(p.clau, p.amples[0])}
							srcset={srcset(p)}
							sizes="(min-width: 52rem) 60vw, 100vw"
							width={p.l}
							height={p.h}
							alt={p.alt}
							draggable="false"
						/>
						<div class="ponches" role="group" aria-label={tria(T.camp)}>
							{#each p.mots as [oc, x, y], i (oc)}
								<button
									type="button"
									class="ponch"
									class:indici={fase === 'cerca' && errors >= 2 && oc === q.oc}
									class:bon={vist?.bon && vist.oc === oc}
									style:left="{x * 100}%"
									style:top="{y * 100}%"
									aria-label={tria(T.endrech)(i + 1, p.mots.length)}
									disabled={fase === 'fin'}
									onclick={() => causir(x, y)}
								></button>
							{/each}
						</div>
						{#each tocs as t (t.id)}
							<span class="toc" style:left="{t.x * 100}%" style:top="{t.y * 100}%" aria-hidden="true"></span>
						{/each}
						{#if vist}
							{#key vist.id}
								{#if vist.bon}<span class="esclat" style:left="{vist.x * 100}%" style:top="{vist.y * 100}%" aria-hidden="true"></span>{/if}
								<div
									class="eticeta"
									class:bon={vist.bon}
									class:esquerra={vist.x > 0.5}
									style:left="{vist.x * 100}%"
									style:top="{vist.y * 100}%"
									aria-hidden="true"
								>
									<span class="nom" lang="oc">{vist.oc}</span>
									<span class="def" lang="fr">{MOTS[vist.oc]}</span>
								</div>
							{/key}
						{/if}
						</div>
					</div>
				{/key}
			{/if}
			<!-- une ligne réservée sous la photo : rien ne bouge quand elle se vide -->
			<p class="messatge" class:vis={fase === 'cerca' && errors > 0} aria-hidden="true">
				{tria(T.pasAqui)}{#if errors >= 2}{' '}{tria(T.aqui)}{/if}
			</p>
		</div>

		<div class="comandas">
			<Reglatges
				causida={{
					titol: tria(T.nivel),
					valor: nivel,
					causir: (id) => (nivel = id),
					opcions: [
						{ id: 'amb', label: tria(T.amb) },
						{ id: 'sens', label: tria(T.sens) }
					]
				}}
				bascules={[{ id: 'son', label: tria(T.son), valor: son, bascular: bascularSon }]}
				titolOpcions={tria(T.reglatges)}
			>
				<button type="button" onclick={començar}>{tria(T.tornarJogar)}</button>
			</Reglatges>
		</div>
	</div>
	<p class="sr" aria-live="polite">{anonci}</p>
</section>

<style>
	.joc {
		container: joc / inline-size;
		--or: var(--t-aur);
		--aur-clar: #ffd47f;
	}
	.disposicion {
		display: grid;
		gap: var(--esp-24) var(--esp-48);
		grid-template-areas: 'cap' 'pista' 'taula' 'comandas';
	}
	@container joc (min-width: 52rem) {
		.disposicion {
			grid-template-columns: minmax(0, 1fr) 21rem;
			grid-template-rows: auto auto 1fr;
			grid-template-areas: 'taula cap' 'taula pista' 'taula comandas';
			align-items: start;
		}
	}
	.cap-joc {
		grid-area: cap;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.05;
		color: var(--or);
	}
	.consigna {
		max-width: 36ch;
		margin: var(--esp-12) 0 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.pista {
		grid-area: pista;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--esp-16);
	}
	.pista-info {
		min-width: 0;
	}
	.question {
		margin: 0;
		font-size: clamp(1.25rem, 2.4vw, 1.5rem);
		line-height: 1.5;
	}
	.question .chip {
		display: inline-block;
		padding: 0.05em 0.4em;
		font-weight: 700;
	}
	.nowrap {
		white-space: nowrap;
	}
	.trad {
		margin: 0.15rem 0 0;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.compte {
		margin: var(--esp-12) 0 0;
		color: var(--t-tinta-2);
	}
	.granas {
		display: flex;
		gap: 0.25rem;
		margin-top: var(--esp-8);
	}
	.granas i {
		flex: 0 1 0.55rem;
		min-width: 0.3rem;
		aspect-ratio: 1;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 40%, transparent);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;
	}
	.granas i.rengat {
		background: var(--or);
		box-shadow: none;
	}
	.taula {
		grid-area: taula;
	}
	.comandas {
		grid-area: comandas;
		display: grid;
		gap: var(--esp-24);
	}

	/* ── La photo : entière, aussi grande que l'écran le permet ── */
	.camp {
		position: relative;
		width: 100%;
		max-width: calc(62svh * var(--r));
		margin-inline: auto;
		aspect-ratio: var(--r);
		border-radius: 0.2rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--t-tinta) 6%, var(--t-fons));
		cursor: crosshair;
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
	}
	.dins {
		position: absolute;
		inset: 0;
		animation: dintrar 0.7s cubic-bezier(0.55, 0, 0.25, 1) both;
	}
	.immersiu .camp {
		max-width: calc((100svh - 12rem) * var(--r));
	}
	/* la photo suivante arrive dans un disque qui grandit */
	@keyframes dintrar {
		from {
			clip-path: circle(0% at 50% 50%);
		}
		to {
			clip-path: circle(75% at 50% 50%);
		}
	}
	.camp.tremola {
		animation: tremolar 0.32s ease-in-out;
	}
	@keyframes tremolar {
		25% {
			translate: -4px 0;
		}
		75% {
			translate: 4px 0;
		}
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
	}

	/* les endroits : un anneau d'or fin (niveau « Amb ajuda ») ; la cible fait 44 px */
	.ponch {
		position: absolute;
		width: 2.75rem;
		height: 2.75rem;
		translate: -50% -50%;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: none;
		cursor: crosshair;
	}
	.ponch::before {
		content: '';
		position: absolute;
		inset: 0;
		margin: auto;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 1.5px solid var(--aur-clar);
		background: rgba(255, 212, 127, 0.1);
		/* un filet sombre de chaque côté de l'or : visible sur le sable clair
		   comme sur la mer */
		box-shadow:
			0 0 0 1.5px rgba(4, 9, 11, 0.55),
			inset 0 0 0 1px rgba(4, 9, 11, 0.35);
		transition:
			opacity 0.3s,
			scale 0.3s;
	}
	.sens .ponch::before {
		opacity: 0;
	}
	.ponch:focus-visible {
		outline: 2px solid var(--aur-clar);
		outline-offset: 2px;
	}
	.sens .ponch:focus-visible::before {
		opacity: 1;
	}
	.ponch.bon::before {
		background: var(--aur-clar);
		scale: 0.6;
	}
	/* après deux essais : le bon endroit respire, même sans aide */
	.ponch.indici::before {
		opacity: 1;
		animation: respirar 1.4s ease-in-out infinite;
	}
	@keyframes respirar {
		50% {
			scale: 1.35;
			border-width: 2px;
		}
	}
	/* toucher à côté : un rond clair qui s'efface */
	.toc {
		position: absolute;
		width: 1.6rem;
		height: 1.6rem;
		translate: -50% -50%;
		border-radius: 50%;
		border: 1.5px solid rgba(247, 243, 238, 0.85);
		box-shadow: 0 0 0 1px rgba(4, 9, 11, 0.3);
		pointer-events: none;
		animation: s-esvanir 0.9s ease-out forwards;
	}
	@keyframes s-esvanir {
		to {
			opacity: 0;
			scale: 1.8;
		}
	}
	/* trouvé : un anneau d'or qui s'ouvre (le moment satisfaisant) */
	.esclat {
		position: absolute;
		width: 1.5rem;
		height: 1.5rem;
		translate: -50% -50%;
		border-radius: 50%;
		border: 2px solid var(--aur-clar);
		pointer-events: none;
		animation: esclatar 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}
	@keyframes esclatar {
		from {
			opacity: 1;
			scale: 0.6;
		}
		to {
			opacity: 0;
			scale: 4.5;
			border-width: 0.5px;
		}
	}

	/* le mot, posé à côté de l'endroit : une tuile, le français dessous */
	.eticeta {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		width: max-content;
		max-width: 60%;
		translate: 1.6rem -50%;
		pointer-events: none;
		animation: venir 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.eticeta.esquerra {
		align-items: flex-end;
		translate: calc(-100% - 1.6rem) -50%;
	}
	/* sur la photo : une tuile sombre (un autre endroit) ou dorée (trouvé),
	   lisible sur le sable comme sur le ciel */
	.eticeta .nom {
		padding: 0.15em 0.5em;
		border-radius: 0.1em;
		background: rgba(8, 15, 17, 0.8);
		color: #f7f3ee;
		font-size: clamp(1rem, 3.2cqi, 1.35rem);
		font-weight: 700;
		line-height: 1.3;
	}
	.eticeta.bon .nom {
		background: var(--aur-clar);
		color: #2a1a10;
	}
	.eticeta .def {
		padding: 0.1em 0.45em;
		border-radius: 0.1em;
		background: rgba(8, 15, 17, 0.72);
		color: #f7f3ee;
		font-size: clamp(0.82rem, 2.4cqi, 0.95rem);
		font-style: italic;
	}
	@keyframes venir {
		from {
			opacity: 0;
			translate: 1.6rem calc(-50% + 0.4rem);
		}
	}
	.eticeta.esquerra {
		animation-name: venir-e;
	}
	@keyframes venir-e {
		from {
			opacity: 0;
			translate: calc(-100% - 1.6rem) calc(-50% + 0.4rem);
		}
	}

	.messatge {
		min-height: 1.5em;
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
		text-align: center;
		visibility: hidden;
	}
	.messatge.vis {
		visibility: visible;
	}

	/* la fin : une carte à la place de la photo, les mots de la partie */
	.fin {
		width: min(100%, 28rem);
		margin-inline: auto;
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		padding: 0.8rem 1rem 0.9rem;
		text-align: center;
		cursor: auto;
	}
	.fin-oc {
		margin: 0;
		font-size: clamp(1.4rem, 5cqi, 2.2rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--t-tinta);
	}
	.fin-titol {
		margin: 0.3rem 0 0;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.resum {
		margin: 0.2rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.15rem 1rem;
		text-align: start;
		font-size: 0.9rem;
		line-height: 1.35;
	}
	.resum span[lang='oc'] {
		font-weight: 600;
		color: var(--t-tinta);
	}
	.resum .fr {
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.fin .accion {
		margin-top: var(--esp-8);
	}

	button {
		font: inherit;
	}
	.accion {
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 0.6rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
	}
	.accion:hover {
		background: var(--t-accion-viu);
	}
	.accion:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.dins,
		.camp.tremola,
		.toc,
		.esclat,
		.eticeta,
		.ponch.indici::before {
			animation: none;
		}
		.esclat {
			display: none;
		}
	}
</style>
