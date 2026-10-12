<script>
	// Lecteur « Ondas » des enquêtes vocales de l'Atlas sonore (LISN), choisi
	// par Romain le 2026-10-12 (esbòs : static/esbos-votz.html) : un toucher sur
	// un point de la carte et la voix part tout de suite ; la feuille du bas
	// montre le lieu, son dialecte, la fable qui avance phrase par phrase et
	// la voix voisine à écouter ensuite. Les sons sont lus sur le site de
	// l'Atlas. Un clic ailleurs ferme (principe du site), un autre point change
	// de voix sans fermer.
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { ATLAS_LISN, sonDe, frasas, frasaAra, vesina, minutas, sonSol } from '$lib/carta/votz.js';

	let {
		lang = 'oc',
		ponches = [],
		// couleur d'un dialecte (code → couleur du thème en cours)
		colorDe = () => '#eeaf34',
		// nom affiché d'un lieu (occitan quand la carte le connaît)
		nomDe = (p) => p.n,
		// la carte suit : point actif, recentrage
		onPunt = () => {},
		onTampar = () => {},
		// couche allumée : les boutons des mots apparaissent
		actiu = false,
		// « Un mot, cent parlars » : le mot de la fable que la carte écrit
		mot = $bindable(null)
	} = $props();

	const MOTS = {
		solelh: { oc: 'lo solelh', fr: 'le soleil' },
		bisa: { oc: 'la bisa', fr: 'la bise' },
		viatjaire: { oc: 'lo viatjaire', fr: 'le voyageur' }
	};
	// les formes d'un mot, des plus courantes aux plus rares, avec la couleur
	// du dialecte où on l'entend le plus
	let formas = $derived.by(() => {
		if (!mot) return [];
		const c = new Map();
		for (const p of ponches) {
			const w = p.m?.[mot]?.toLowerCase();
			if (!w) continue;
			const e = c.get(w) ?? { w, n: 0, kod: {} };
			e.n++;
			e.kod[p.d.kod] = (e.kod[p.d.kod] ?? 0) + 1;
			c.set(w, e);
		}
		return [...c.values()].sort((a, b) => b.n - a.n).map((e) => ({ ...e, kod: Object.entries(e.kod).sort((a, b) => b[1] - a[1])[0][0] }));
	});
	let lòcs = $derived(formas.reduce((s, f) => s + f.n, 0));
	// le mot surligné dans la fable écoutée
	const talhar = (f, w) => (w ? f.split(new RegExp(`(?<!\\p{L})(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?!\\p{L})`, 'iu')) : [f]);

	const t = {
		oc: { dins: 'dins', parlars: 'parlars', tocatz: "Tocatz un mot per l'ausir", escotar: 'Escotar', pausa: 'Pausa', tampar: 'Tampar', seguenta: 'Votz seguenta', votz: 'votz', Votz: 'Votz', classica: 'Grafia classica', mistral: 'Grafia de Mistral', autra: 'Autra grafia', titol: '« La bisa e lo solelh »', posicion: 'Posicion', cro: 'Creissent' },
		fr: { dins: 'dans', parlars: 'parlers', tocatz: "Touchez un mot pour l'entendre", escotar: 'Écouter', pausa: 'Pause', tampar: 'Fermer', seguenta: 'Voix suivante', votz: 'voix', Votz: 'Voix', classica: 'Graphie classique', mistral: 'Graphie mistralienne', autra: 'Autre graphie', titol: '« La bise et le soleil »', posicion: 'Position', cro: 'Croissant' }
	};
	let tx = $derived(t[lang] ?? t.oc);

	let audio = $state();
	// (raw : le même objet que le point de la carte, pas une copie suivie)
	let punt = $state.raw(null);
	let votz2 = $state(false);
	let grafia2 = $state(false);
	let jogant = $state(false);
	let temps = $state(0);
	let durada = $state(0);
	let escotats = new Set();
	let tèxtEl = $state();

	let fr = $derived(lang === 'fr');
	let liste = $derived(punt ? frasas(grafia2 && punt.tx2 ? punt.tx2 : punt.tx) : []);
	let iAra = $derived(durada ? frasaAra(liste, temps / durada) : -1);
	let seguenta = $derived(punt ? vesina(ponches, punt, escotats) : null);
	let color = $derived(punt ? colorDe(punt.d.kod) : '#eeaf34');
	let dialècte = $derived(
		!punt ? '' : punt.mix ? (fr ? punt.mix.fr : punt.mix.oc) : (fr ? punt.d.fr : punt.d.oc) + (punt.cro ? ' · ' + tx.cro : '')
	);
	let mistral = $derived(/mistral/i.test(punt?.g2 ?? ''));

	// Appelé directement par le toucher sur la carte : play() doit partir dans
	// le geste même, sinon les téléphones bloquent le son.
	export function jogar(p, segonda = false) {
		if (!audio || !p) return;
		const src = sonDe(segonda ? p.so2 : p.so);
		if (!src) return;
		if (punt !== p) grafia2 = false;
		punt = p;
		votz2 = segonda;
		temps = 0;
		durada = 0;
		escotats.add(p.so);
		audio.src = src;
		audio.play().catch(() => (jogant = false));
		onPunt(p);
	}

	export function tampar() {
		audio?.pause();
		punt = null;
		onTampar();
	}

	function bascular() {
		if (!audio) return;
		if (audio.paused) audio.play().catch(() => {});
		else audio.pause();
	}

	// un clic ailleurs ferme ; un autre point de voix reste « dedans »
	$effect(() => {
		if (!punt) return;
		return tampaDefòra((el) => !!el.closest('.votz-fuelha, .votz-ponch, .votz-mots'), tampar);
	});

	// la phrase en cours reste visible dans le texte
	$effect(() => {
		const el = tèxtEl?.querySelector('.ara');
		if (!el || !tèxtEl) return;
		const haut = el.offsetTop - tèxtEl.offsetTop;
		if (haut < tèxtEl.scrollTop || haut + el.offsetHeight > tèxtEl.scrollTop + tèxtEl.clientHeight)
			tèxtEl.scrollTo({ top: Math.max(0, haut - 8), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	});

	// hauteurs fixes des barres (le son vient d'un autre site : pas d'analyse possible)
	const BARRAS = Array.from({ length: 20 }, (_, i) => 35 + ((i * 37) % 62));
</script>

<audio
	bind:this={audio}
	preload="none"
	onplay={() => ((jogant = true), sonSol(audio))}
	onpause={() => (jogant = false)}
	onended={() => ((jogant = false), (temps = durada))}
	ontimeupdate={() => (temps = audio.currentTime)}
	onloadedmetadata={() => (durada = audio.duration)}
></audio>

{#if actiu}
	<!-- « Un mot, cent parlars » : la carte écrit la forme locale du mot choisi -->
	<div class="votz-mots" role="group" aria-label={fr ? 'Un mot, cent parlers' : 'Un mot, cent parlars'}>
		{#each Object.entries(MOTS) as [k, l] (k)}
			<button type="button" class:actiu={mot === k} aria-pressed={mot === k} onclick={() => (mot = mot === k ? null : k)}>
				{fr ? l.fr : l.oc}
			</button>
		{/each}
	</div>
{/if}

{#if actiu && mot && !punt}
	<section class="votz-fuelha votz-formas" aria-label={fr ? MOTS[mot].fr : MOTS[mot].oc}>
		<div class="manha" aria-hidden="true"></div>
		<button type="button" class="tampar" onclick={() => (mot = null)} aria-label={tx.tampar} title={tx.tampar}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
		</button>
		<p class="formas-cap"><span class="mot-titol">«&nbsp;{fr ? MOTS[mot].fr : MOTS[mot].oc}&nbsp;»</span> <span class="titol">{tx.dins} {lòcs} {tx.parlars}</span></p>
		<div class="barras">
			{#each formas.slice(0, 5) as f (f.w)}
				<span class="forma" lang="oc" style="color: {colorDe(f.kod)}">{f.w}</span>
				<span class="barra" style="width: {(f.n / formas[0].n) * 100}%; background: {colorDe(f.kod)}"></span>
				<span class="nombre">{f.n}</span>
			{/each}
		</div>
		{#if formas.length > 5}
			<p class="autras" lang="oc">{formas.slice(5).map((f) => f.w).join(' · ')}</p>
		{/if}
		<p class="astuci">{tx.tocatz}</p>
	</section>
{/if}

{#if punt}
	<section class="votz-fuelha" style="--c: {color}" aria-label={nomDe(punt)}>
		<div class="manha" aria-hidden="true"></div>
		<button type="button" class="tampar" onclick={tampar} aria-label={tx.tampar} title={tx.tampar}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
		</button>

		<div class="cap">
			<div class="nom">
				<h2>{nomDe(punt)}</h2>
				<span class="chip">{dialècte + (punt.so2 ? ' · 2 ' + tx.votz : '')}</span>
			</div>
			<button type="button" class="boton" onclick={bascular} aria-label={jogant ? tx.pausa : tx.escotar}>
				{#if jogant}
					<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
				{/if}
			</button>
		</div>

		<div class="eq" class:jogant aria-hidden="true">
			{#each BARRAS as h, i (i)}<b style="height: {h}%; animation-delay: {(i * 0.13) % 1}s"></b>{/each}
		</div>
		<input
			class="progres"
			type="range"
			min="0"
			max={durada || 0}
			step="0.1"
			value={temps}
			style="--p: {durada ? (temps / durada) * 100 : 0}%"
			aria-label={tx.posicion}
			oninput={(e) => audio && (audio.currentTime = +e.currentTarget.value)}
		/>
		<div class="temps"><span>{minutas(temps)}</span><span>{minutas(durada)}</span></div>

		<p class="titol">{tx.titol}</p>
		<p class="karaoke" bind:this={tèxtEl} lang={punt.mix ? undefined : 'oc'}>
			{#each liste as f, i (i)}<span class:dita={i < iAra} class:ara={i === iAra}
					>{#each talhar(f, mot && punt.m?.[mot]) as part, j (j)}{#if j % 2}<mark>{part}</mark>{:else}{part}{/if}{/each}</span
				>{' '}{/each}
		</p>

		<div class="accions">
			{#if seguenta}
				<button type="button" class="aur" onclick={() => jogar(seguenta)}>{tx.seguenta} : {nomDe(seguenta)} →</button>
			{/if}
			{#if punt.so2}
				<button type="button" class:actiu={!votz2} onclick={() => votz2 && jogar(punt, false)}>{tx.Votz} 1</button>
				<button type="button" class:actiu={votz2} onclick={() => !votz2 && jogar(punt, true)}>{tx.Votz} 2</button>
			{/if}
			{#if punt.tx2}
				<button type="button" onclick={() => (grafia2 = !grafia2)}>
					{grafia2 ? tx.classica : mistral ? tx.mistral : tx.autra}
				</button>
			{/if}
		</div>
		<p class="font">
			<a href={ATLAS_LISN} target="_blank" rel="noopener">Atlas sonore des langues régionales de France</a> (LISN, CNRS) ·
			<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" rel="noopener">CC BY-NC-SA</a>
		</p>
	</section>
{/if}

<style>
	audio {
		display: none;
	}
	.votz-fuelha {
		position: absolute;
		z-index: 1100;
		left: 0;
		right: 0;
		bottom: 0;
		max-height: 62%;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		display: flex;
		flex-direction: column;
		padding: 10px 18px 14px;
		background: color-mix(in srgb, var(--t-fons-2) 94%, transparent);
		backdrop-filter: blur(10px);
		color: var(--t-tinta);
		border: 1px solid var(--t-linha);
		border-bottom: 0;
		border-radius: 22px 22px 0 0;
		box-shadow: 0 -18px 40px rgba(0, 0, 0, 0.4);
		animation: montar 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	/* sur ordinateur : une carte posée en bas à droite, la carte reste libre */
	@media (min-width: 720px) {
		.votz-fuelha {
			left: auto;
			right: 76px;
			bottom: 22px;
			width: 380px;
			/* sous la barre de recherche et les boutons des mots */
			max-height: calc(100% - 230px);
			border-bottom: 1px solid var(--t-linha);
			border-radius: 22px;
		}
		.manha {
			display: none;
		}
	}
	@keyframes montar {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
	}
	.manha {
		width: 40px;
		height: 4px;
		border-radius: 4px;
		background: var(--t-linha);
		margin: 0 auto 10px;
		flex: none;
	}
	.tampar {
		position: absolute;
		top: 10px;
		right: 12px;
		width: 30px;
		height: 30px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--t-tinta-2);
		display: grid;
		place-items: center;
		cursor: pointer;
	}
	.tampar svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.cap {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-right: 28px;
	}
	.nom {
		flex: 1;
		min-width: 0;
	}
	h2 {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
		line-height: 1.1;
		color: var(--t-aur-clar);
		overflow-wrap: anywhere;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
		margin-top: 4px;
	}
	.chip::before {
		content: '';
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 0 10px var(--c);
		flex: none;
	}
	.boton {
		width: 56px;
		height: 56px;
		flex: none;
		border: 0;
		border-radius: 50%;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: #2a1408;
		background: radial-gradient(circle at 35% 30%, var(--t-aur-clar), var(--t-aur) 70%);
		box-shadow:
			0 0 0 6px color-mix(in srgb, var(--t-aur) 16%, transparent),
			0 8px 24px color-mix(in srgb, var(--t-aur) 35%, transparent);
	}
	.boton svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
	}
	.eq {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 28px;
		margin-top: 12px;
		flex: none;
	}
	.eq b {
		flex: 1;
		border-radius: 2px;
		background: linear-gradient(var(--t-aur-clar), var(--t-aur));
		opacity: 0.85;
		transform: scaleY(0.3);
		transition: transform 0.4s;
	}
	.eq.jogant b {
		animation: eq 0.9s ease-in-out infinite alternate;
	}
	@keyframes eq {
		from {
			transform: scaleY(0.3);
		}
		to {
			transform: scaleY(1);
		}
	}
	.progres {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 18px;
		margin-top: 6px;
		background: transparent;
		cursor: pointer;
		flex: none;
	}
	.progres::-webkit-slider-runnable-track {
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(90deg, var(--t-aur) var(--p), var(--t-linha) var(--p));
	}
	.progres::-moz-range-track {
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(90deg, var(--t-aur) var(--p), var(--t-linha) var(--p));
	}
	.progres::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		margin-top: -4.5px;
		border-radius: 50%;
		background: var(--t-aur-clar);
		border: 0;
	}
	.progres::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--t-aur-clar);
		border: 0;
	}
	.temps {
		display: flex;
		justify-content: space-between;
		font-size: 0.72rem;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
		flex: none;
	}
	.titol {
		font-family: var(--font-quote);
		font-style: italic;
		color: var(--t-tinta-2);
		margin-top: 8px;
		flex: none;
	}
	.karaoke {
		margin-top: 4px;
		font-size: 0.98rem;
		line-height: 1.55;
		overflow-y: auto;
		max-height: 7.8em;
		flex: none;
		padding-right: 4px;
	}
	.karaoke span {
		color: color-mix(in srgb, var(--t-tinta) 45%, transparent);
		transition: color 0.4s;
	}
	.karaoke span.dita {
		color: var(--t-tinta-2);
	}
	.karaoke span.ara {
		color: var(--t-tinta);
		background: linear-gradient(transparent 62%, color-mix(in srgb, var(--t-aur) 30%, transparent) 62%);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 12px;
		flex: none;
	}
	.accions button {
		font: inherit;
		font-size: 0.8rem;
		padding: 6px 12px;
		border-radius: 99px;
		border: 1px solid var(--t-linha);
		background: transparent;
		color: var(--t-tinta);
		cursor: pointer;
	}
	.accions button.aur {
		border-color: color-mix(in srgb, var(--t-aur) 55%, transparent);
		color: var(--t-aur-clar);
	}
	.accions button.actiu {
		background: color-mix(in srgb, var(--t-aur) 18%, transparent);
		border-color: color-mix(in srgb, var(--t-aur) 55%, transparent);
	}
	.font {
		margin-top: 10px;
		font-size: 0.68rem;
		color: var(--t-tinta-2);
		flex: none;
	}
	.font a {
		color: inherit;
	}
	.karaoke :global(mark) {
		background: none;
		color: var(--t-aur-clar);
		font-weight: 700;
	}

	/* boutons des mots, sous la barre de recherche */
	.votz-mots {
		position: absolute;
		z-index: 1000;
		top: calc(var(--cap-bas, 5.3rem) + 66px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 6px;
		max-width: calc(100% - 7rem);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.votz-mots button {
		flex: none;
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.02rem;
		padding: 3px 13px 4px;
		border-radius: 99px;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--t-fons-2) 88%, transparent);
		backdrop-filter: blur(6px);
		color: var(--t-tinta);
		cursor: pointer;
	}
	.votz-mots button.actiu {
		background: var(--t-aur);
		border-color: var(--t-aur);
		color: #2a1408;
	}
	.formas-cap {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 10px;
		padding-right: 28px;
	}
	.mot-titol {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		color: var(--t-aur-clar);
	}
	.barras {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 6px 10px;
		align-items: center;
		margin-top: 10px;
	}
	.forma {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.15rem;
	}
	.barra {
		height: 7px;
		border-radius: 7px;
		min-width: 6px;
	}
	.nombre {
		font-size: 0.75rem;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}
	.autras {
		margin-top: 8px;
		font-family: var(--font-quote);
		font-style: italic;
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.astuci {
		margin-top: 10px;
		font-size: 0.78rem;
		color: var(--t-tinta-2);
	}
	/* sur téléphone, le décompte reste court : la carte des mots doit se voir */
	@media (max-width: 719px) {
		.votz-formas {
			max-height: 38%;
		}
		.barras > :nth-child(n + 10),
		.autras {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.votz-fuelha {
			animation: none;
		}
		.eq.jogant b {
			animation: none;
			transform: scaleY(0.7);
		}
	}
</style>
