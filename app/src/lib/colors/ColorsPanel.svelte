<script>
	// Le panneau de l'outil « Colors » (Romain, 2026-11-13 : « il faut que je puisse
	// changer toutes les couleurs du site directement dans le site »). Posé sur un
	// bord de l'écran, la page reste visible et utilisable à côté : on change une
	// couleur, on la voit, on se promène, puis « Publicar ».
	//
	// Trois façons de trouver une couleur : les groupes (fond et texte, boutons,
	// palette, carte…), la recherche (un nom ou un code), et « Toucher un endroit
	// de la page », qui dit quelles couleurs sont à cet endroit.
	//
	// Ses propres couleurs sont fixes (--o-*) : il reste lisible quelle que soit la
	// palette qu'on est en train d'essayer. Chargé pour l'administrateur seulement.
	import { onMount } from 'svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { contraste } from '$lib/palette/coherence.js';
	import { hexColor } from '$lib/styles/palette.js';
	import { GROPS, LISTA, PER_ID } from './registre.js';
	import { colors, valorsVista, cambiar, restablir, cambiada, nombreCambiaments, publicar, anullar, tampar, tornarEnrèire, totRestablir } from './colors.svelte.js';

	let tema = $derived(ambianca.clar ? 'clar' : 'sorne');
	let v = $derived(valorsVista());
	let n = $derived(nombreCambiaments());
	// les couleurs du thème affiché (les textes posés sur une pièce se règlent sur la ligne de leur pièce)
	let visiblas = $derived(LISTA.filter((e) => !e.esTinta && (e.tema === null || e.tema === tema)));

	let dubèrts = $state({ base: true, valeur: true, botons: true });
	let cerca = $state('');
	let reduch = $state(false);
	let esquèrra = $state(false);
	let autres = $state(false);

	const net = (s) =>
		s
			.toLowerCase()
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '');
	let trobadas = $derived.by(() => {
		const q = net(cerca.trim());
		if (!q) return null;
		return visiblas.filter((e) => net(e.nom).includes(q) || net(GROPS.find((g) => g.id === e.grop)?.nom ?? '').includes(q) || (v[e.id] ?? '').includes(q) || (e.tinta && (v[e.tinta] ?? '').includes(q)));
	});

	const virgule = (x) => x.toFixed(1).replace('.', ',');
	// le contraste utile : le texte posé sur la pièce, ou le texte sur le fond de la page
	function ratioDe(e) {
		if (e.tinta && hexColor(v[e.id]) && hexColor(v[e.tinta])) return { r: contraste(v[e.tinta], v[e.id]), min: 4.5 };
		const m = e.id.match(/^tema\.(clar|sorne)\.(t-tinta|t-aur|t-aur-clar|t-aur-gros)$/);
		if (!m) return null;
		return { r: contraste(v[e.id], v[`tema.${m[1]}.t-fons`]), min: m[2] === 't-aur-gros' ? 3 : 4.5 };
	}
	const modificada = (e) => cambiada(e.id) || (e.tinta && cambiada(e.tinta));
	const enBrolhon = (e) => e.id in colors.brolhons || (e.tinta && e.tinta in colors.brolhons);
	const nombreGrop = (g) => visiblas.filter((e) => e.grop === g && modificada(e)).length;

	function saisie(id, ev) {
		let c = ev.currentTarget.value.trim().toLowerCase();
		if (c && !c.startsWith('#')) c = '#' + c;
		// (#abc : la forme courte est acceptée)
		if (/^#[0-9a-f]{3}$/.test(c)) c = '#' + [...c.slice(1)].map((x) => x + x).join('');
		if (hexColor(c)) cambiar(id, c, { ara: true });
		else ev.currentTarget.value = v[id];
	}
	function toutRetablir(e) {
		restablir(e.id);
		if (e.tinta) restablir(e.tinta);
	}

	// --- toucher un endroit de la page ---------------------------------------------
	let causint = $state(false);
	let endrech = $state(null); // { colors: [{ ont, color }], ids, demai, durs }
	let pincèl;
	// une couleur telle que le navigateur la calcule (rgb, rgba, color(srgb…)) → #rrggbb, ou null si transparente
	function hexDe(color) {
		if (!color || color === 'none') return null;
		pincèl ??= document.createElement('canvas').getContext('2d');
		pincèl.fillStyle = '#010203';
		pincèl.fillStyle = color;
		const s = pincèl.fillStyle;
		if (s.startsWith('#')) return s === '#010203' && !/^(#010203|rgb\(1, ?2, ?3\))$/.test(color) ? null : s;
		const m = s.match(/rgba?\(([\d.]+), ?([\d.]+), ?([\d.]+)(?:, ?([\d.]+))?\)/);
		if (!m || Number(m[4] ?? 1) < 0.05) return null;
		return '#' + [m[1], m[2], m[3]].map((x) => Math.round(Number(x)).toString(16).padStart(2, '0')).join('');
	}
	function colorsDe(el) {
		const cs = getComputedStyle(el);
		const res = [];
		const apondre = (ont, color) => {
			const h = hexDe(color);
			if (h && !res.some((r) => r.color === h)) res.push({ ont, color: h });
		};
		if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) {
			apondre('Dessin', cs.fill);
			apondre('Trait', cs.stroke);
		} else if (el.textContent.trim()) apondre('Texte', cs.color);
		if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') apondre('Bordure', cs.borderTopColor);
		// le fond : le premier qui n'est pas transparent, en remontant
		for (let e = el; e instanceof Element; e = e.parentElement) {
			const h = hexDe(getComputedStyle(e).backgroundColor);
			if (h) {
				apondre('Fond', h);
				break;
			}
		}
		// Les couleurs réglables qui ont ces valeurs. D'abord une pièce dont le fond ET le texte sont ceux
		// de l'endroit (un bouton, une case), puis un rôle ou un jeton de même couleur, la teinte de la
		// palette en dernier. Plusieurs couleurs du site peuvent avoir la même valeur : on les montre toutes.
		const fond = res.find((r) => r.ont === 'Fond')?.color;
		const texte = res.find((r) => r.ont === 'Texte')?.color;
		const reng = (e) => (e.tinta && v[e.id] === fond && v[e.tinta] === texte ? 0 : e.grop === 'teintes' ? 2 : 1);
		const linhas = visiblas.filter((e) => res.some((r) => v[e.id] === r.color)).sort((a, b) => reng(a) - reng(b));
		return {
			colors: res,
			ids: linhas.slice(0, MAX_ENDRECH).map((e) => e.id),
			demai: Math.max(0, linhas.length - MAX_ENDRECH),
			// les couleurs de l'endroit qu'aucune couleur réglable ne porte : écrites en dur dans la page
			durs: res.filter((r) => !linhas.some((e) => v[e.id] === r.color))
		};
	}
	const MAX_ENDRECH = 8;
	function alClic(ev) {
		const t = ev.target;
		if (!(t instanceof Element) || t.closest('.colors-panel')) return;
		ev.preventDefault();
		ev.stopPropagation();
		endrech = colorsDe(t);
		causint = false;
		reduch = false;
	}
	const alClavièr = (ev) => ev.key === 'Escape' && (causint = false);
	$effect(() => {
		if (!causint) return;
		document.documentElement.classList.add('colors-causint');
		document.addEventListener('click', alClic, true);
		document.addEventListener('keydown', alClavièr);
		return () => {
			document.documentElement.classList.remove('colors-causint');
			document.removeEventListener('click', alClic, true);
			document.removeEventListener('keydown', alClavièr);
		};
	});

	// la page se range à côté du panneau au lieu de passer dessous (sur téléphone : au-dessus)
	$effect(() => {
		const c = reduch ? null : esquèrra ? 'colors-esquerra' : 'colors-dreita';
		if (!c) return;
		document.documentElement.classList.add(c);
		return () => document.documentElement.classList.remove(c);
	});

	let títol = $state(null);
	onMount(() => títol?.focus());
</script>

{#snippet linha(e)}
	{@const ratio = ratioDe(e)}
	<div class="linha" class:brolhon={enBrolhon(e)}>
		<span class="pastilhas">
			<input type="color" value={v[e.id]} oninput={(ev) => cambiar(e.id, ev.currentTarget.value)} aria-label={e.nom} />
			{#if e.tinta}
				<input type="color" class="tinta" value={v[e.tinta]} oninput={(ev) => cambiar(e.tinta, ev.currentTarget.value)} aria-label="{e.nom} : le texte posé dessus" title="Le texte posé dessus" />
			{/if}
		</span>
		<span class="nom">
			{e.nom}
			{#if enBrolhon(e)}<span class="marca">non publié</span>{/if}
		</span>
		<input class="hex" type="text" value={v[e.id]} maxlength="7" spellcheck="false" autocomplete="off" aria-label="{e.nom}, code de la couleur" onchange={(ev) => saisie(e.id, ev)} />
		{#if ratio || modificada(e)}
			<span class="jos">
				{#if ratio}
					<span class="ratio" class:mal={ratio.r < ratio.min}>Contraste {virgule(ratio.r)}{ratio.r < ratio.min ? ` : trop faible (${virgule(ratio.min)} requis)` : ''}</span>
				{/if}
				{#if modificada(e)}
					<button type="button" class="ligam" onclick={() => toutRetablir(e)}>Rétablir</button>
				{/if}
			</span>
		{/if}
	</div>
{/snippet}

<aside class="colors-panel" class:reduch class:esquèrra data-o={tema} aria-label="Colors : les couleurs du site">
	<header>
		<h2 bind:this={títol} tabindex="-1">Colors</h2>
		<p class="estat" aria-live="polite">
			{#if !colors.cargat}Lecture…{:else if n}{n === 1 ? '1 changement non publié' : `${n} changements non publiés`}{:else}Tout est publié{/if}
		</p>
		<button type="button" class="tampar" onclick={tampar} aria-label="Fermer l’outil" title="Fermer"><Icona nom="fermer" size="1.2em" /></button>
		<div class="reglatges">
			<span class="tema" role="group" aria-label="Thème affiché">
				<button type="button" aria-pressed={tema === 'clar'} onclick={() => (ambianca.tema = 'clar')}>Clair</button>
				<button type="button" aria-pressed={tema === 'sorne'} onclick={() => (ambianca.tema = 'sorne')}>Sombre</button>
			</span>
			<button type="button" class="ligam" onclick={() => (reduch = !reduch)}>{reduch ? 'Déplier' : 'Réduire'}</button>
			<button type="button" class="ligam grand" onclick={() => (esquèrra = !esquèrra)}>{esquèrra ? 'À droite' : 'À gauche'}</button>
		</div>
	</header>

	{#if !reduch}
		<div class="cors">
			{#if ambianca.forçarClar}
				<p class="nota">Cette page s’affiche toujours en clair : pour régler le sombre, va sur l’accueil.</p>
			{/if}
			<div class="otis">
				<button type="button" class="segond" aria-pressed={causint} onclick={() => (causint = !causint)}>{causint ? 'Touche l’endroit… (Échap pour annuler)' : 'Toucher un endroit de la page'}</button>
				<input class="cerca" type="search" placeholder="Chercher : un nom, un code" bind:value={cerca} aria-label="Chercher une couleur" />
			</div>

			{#if endrech}
				<section class="endrech" aria-label="Les couleurs de l’endroit touché">
					<div class="cap">
						<h3>À cet endroit</h3>
						<button type="button" class="ligam" onclick={() => (endrech = null)}>Fermer</button>
					</div>
					{#if endrech.colors.length}
						<p class="ont">
							{#each endrech.colors as r (r.color)}
								<span><span class="mostra" style="background:{r.color}"></span>{r.ont} {r.color}</span>
							{/each}
						</p>
						{#each endrech.ids as id (id)}
							{@render linha(PER_ID[id])}
						{/each}
						{#if endrech.demai}
							<p class="nota">{endrech.demai === 1 ? 'Une autre couleur a' : `${endrech.demai} autres couleurs ont`} la même valeur : cherche le code ci-dessus pour les voir.</p>
						{/if}
						{#each endrech.durs as r (r.color)}
							<p class="nota">{r.ont} {r.color} : écrite en dur dans la page, pas encore réglable ici. Signale-la avec « Comentar » pour qu’elle le devienne.</p>
						{/each}
					{:else}
						<p class="nota">Rien de lisible ici (un dessin ou la carte) : cherche dans les groupes.</p>
					{/if}
				</section>
			{/if}

			{#if trobadas}
				<section>
					{#each trobadas as e (e.id)}
						{@render linha(e)}
					{:else}
						<p class="nota">Aucune couleur à ce nom.</p>
					{/each}
				</section>
			{:else}
				{#each GROPS as g (g.id)}
					{@const linhas = visiblas.filter((e) => e.grop === g.id)}
					{#if linhas.length}
						{@const nb = nombreGrop(g.id)}
						<section class="grop">
							<button type="button" class="grop-cap" aria-expanded={!!dubèrts[g.id]} onclick={() => (dubèrts[g.id] = !dubèrts[g.id])}>
								<span>{g.nom}</span>
								<span class="compte">{nb ? (nb === 1 ? '1 modifiée' : `${nb} modifiées`) : linhas.length}</span>
							</button>
							{#if dubèrts[g.id]}
								{#if g.mot}<p class="nota">{g.mot}</p>{/if}
								{#each linhas as e (e.id)}
									{@render linha(e)}
								{/each}
							{/if}
						</section>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}

	<footer>
		{#if colors.messatge}
			<p class="mes" data-tipe={colors.messatge.tipe} role="status">{colors.messatge.text}</p>
		{/if}
		<div class="accions">
			<button type="button" class="segond" disabled={!n || colors.ocupat} onclick={anullar}>Anullar</button>
			<button type="button" class="primièr" disabled={!n || colors.ocupat} onclick={publicar}>Publicar</button>
		</div>
		{#if !reduch}
			<button type="button" class="ligam" aria-expanded={autres} onclick={() => (autres = !autres)}>Autres gestes</button>
			{#if autres}
				<ul class="autres">
					<li><button type="button" class="ligam" onclick={() => location.reload()}>Recharger la page</button> si la carte ou un dessin n’a pas suivi un changement.</li>
					<li><button type="button" class="ligam" disabled={colors.ocupat} onclick={tornarEnrèire}>Revenir avant la dernière publication</button> (en brouillon, à publier ensuite).</li>
					<li><button type="button" class="ligam" disabled={colors.ocupat} onclick={totRestablir}>Tout remettre aux couleurs d’origine</button> (en brouillon aussi).</li>
				</ul>
			{/if}
		{/if}
	</footer>
</aside>

<style>
	:global(html.colors-causint),
	:global(html.colors-causint *) {
		cursor: crosshair !important;
	}
	@media (min-width: 720px) {
		:global(html.colors-dreita) {
			margin-right: min(340px, 100vw);
		}
		:global(html.colors-esquerra) {
			margin-left: min(340px, 100vw);
		}
	}
	@media (max-width: 719px) {
		:global(html:is(.colors-dreita, .colors-esquerra)) {
			padding-bottom: 56dvh;
		}
	}
	.colors-panel {
		--o-fons: #ffffff;
		--o-tinta: #1d1b1a;
		--o-tinta-2: #5b5651;
		--o-filet: #d9d5d0;
		--o-accion: #b53d17;
		--o-mal: #a3261a;
		--o-ok: #1d6b34;
		position: fixed;
		z-index: 2096;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(340px, 100vw);
		display: flex;
		flex-direction: column;
		background: var(--o-fons);
		color: var(--o-tinta);
		border-left: 1px solid var(--o-filet);
		font: 14px/1.4 var(--font-body);
		color-scheme: light;
	}
	.colors-panel[data-o='sorne'] {
		--o-fons: #1a1918;
		--o-tinta: #efedea;
		--o-tinta-2: #b0aba5;
		--o-filet: #3b3937;
		--o-mal: #ff9a8a;
		--o-ok: #8fd19e;
		color-scheme: dark;
	}
	.colors-panel.esquèrra {
		right: auto;
		left: 0;
		border-left: 0;
		border-right: 1px solid var(--o-filet);
	}
	.colors-panel.reduch {
		bottom: auto;
		border-bottom: 1px solid var(--o-filet);
	}
	.colors-panel :is(button, input) {
		font: inherit;
		color: inherit;
	}
	.colors-panel button {
		cursor: pointer;
	}
	.colors-panel :is(button, input):focus-visible {
		outline: 2px solid var(--o-tinta);
		outline-offset: 2px;
	}
	p {
		margin: 0;
	}

	header {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 2px 12px;
		padding: 14px 16px 12px;
		border-bottom: 1px solid var(--o-filet);
	}
	h2 {
		margin: 0;
		font: 700 18px/1.2 var(--font-body);
	}
	h2:focus {
		outline: none;
	}
	.estat {
		grid-column: 1;
		color: var(--o-tinta-2);
		font-size: 13px;
	}
	.tampar {
		grid-column: 2;
		grid-row: 1 / span 2;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border: 0;
		background: none;
	}
	.reglatges {
		grid-column: 1 / -1;
		display: flex;
		align-items: baseline;
		gap: 16px;
		margin-top: 10px;
	}
	.tema {
		display: inline-flex;
		gap: 12px;
		margin-right: auto;
	}
	.tema button {
		padding: 2px 0;
		border: 0;
		border-bottom: 2px solid transparent;
		background: none;
		color: var(--o-tinta-2);
	}
	.tema button[aria-pressed='true'] {
		border-bottom-color: var(--o-tinta);
		color: var(--o-tinta);
		font-weight: 700;
	}
	.ligam {
		padding: 0;
		border: 0;
		background: none;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}
	.ligam:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.cors {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		padding: 0 16px 16px;
	}
	.otis {
		display: grid;
		gap: 8px;
		padding: 14px 0;
	}
	.segond,
	.primièr {
		min-height: 40px;
		padding: 8px 14px;
		border: 1px solid var(--o-tinta);
		border-radius: 2px;
		background: none;
		font-weight: 600;
	}
	.segond[aria-pressed='true'] {
		background: var(--o-tinta);
		color: var(--o-fons);
	}
	.colors-panel .primièr {
		border-color: var(--o-accion);
		background: var(--o-accion);
		color: #ffffff;
	}
	:is(.segond, .primièr):disabled {
		opacity: 0.45;
		cursor: default;
	}
	.cerca {
		min-height: 40px;
		padding: 8px 10px;
		border: 1px solid var(--o-filet);
		border-radius: 2px;
		background: none;
	}
	.cerca::placeholder {
		color: var(--o-tinta-2);
	}
	.nota {
		padding: 6px 0 10px;
		color: var(--o-tinta-2);
		font-size: 13px;
	}

	.grop {
		border-top: 1px solid var(--o-filet);
	}
	.grop-cap {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		width: 100%;
		padding: 12px 0;
		border: 0;
		background: none;
		text-align: left;
		font-weight: 700;
	}
	.grop-cap .compte {
		flex: none;
		color: var(--o-tinta-2);
		font-size: 13px;
		font-weight: 400;
	}
	.grop-cap[aria-expanded='true'] {
		padding-bottom: 6px;
	}

	.linha {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 2px 10px;
		padding: 6px 0;
	}
	.pastilhas {
		display: inline-flex;
		align-items: flex-end;
	}
	input[type='color'] {
		appearance: none;
		-webkit-appearance: none;
		width: 32px;
		height: 32px;
		padding: 0;
		border: 1px solid var(--o-filet);
		border-radius: 2px;
		background: none;
		cursor: pointer;
	}
	input[type='color'].tinta {
		width: 18px;
		height: 18px;
		margin-left: -7px;
		margin-bottom: -4px;
		border-color: var(--o-fons);
		outline: 1px solid var(--o-filet);
	}
	input[type='color'].tinta:focus-visible {
		outline: 2px solid var(--o-tinta);
	}
	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	input[type='color']::-webkit-color-swatch {
		border: 0;
		border-radius: 1px;
	}
	input[type='color']::-moz-color-swatch {
		border: 0;
		border-radius: 1px;
	}
	.nom {
		min-width: 0;
	}
	.marca {
		display: block;
		color: var(--o-tinta-2);
		font-size: 12px;
	}
	.hex {
		width: 76px;
		padding: 5px 6px;
		border: 0;
		border-bottom: 1px solid var(--o-filet);
		background: none;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		text-align: right;
	}
	.jos {
		grid-column: 2 / -1;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		color: var(--o-tinta-2);
		font-size: 12.5px;
	}
	.jos .ligam {
		margin-left: auto;
		color: var(--o-tinta);
	}
	.ratio.mal {
		color: var(--o-mal);
		font-weight: 700;
	}

	.endrech {
		margin-bottom: 14px;
		padding: 10px 0 6px;
		border-top: 2px solid var(--o-tinta);
		border-bottom: 2px solid var(--o-tinta);
	}
	.endrech .cap {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	h3 {
		margin: 0;
		font: 700 14px/1.3 var(--font-body);
	}
	.ont {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		margin: 8px 0 4px;
		color: var(--o-tinta-2);
		font-size: 13px;
	}
	.ont > span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.mostra {
		width: 12px;
		height: 12px;
		border: 1px solid var(--o-filet);
	}

	footer {
		display: grid;
		gap: 10px;
		padding: 12px 16px 14px;
		border-top: 1px solid var(--o-filet);
	}
	.accions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.mes {
		font-size: 13px;
	}
	.mes[data-tipe='error'] {
		color: var(--o-mal);
		font-weight: 700;
	}
	.mes[data-tipe='ok'] {
		color: var(--o-ok);
	}
	footer > .ligam {
		justify-self: start;
		color: var(--o-tinta-2);
		font-size: 13px;
	}
	.autres {
		display: grid;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--o-tinta-2);
		font-size: 13px;
	}
	.autres .ligam {
		color: var(--o-tinta);
	}

	/* téléphone : le panneau monte du bas, la page reste visible au-dessus */
	@media (max-width: 719px) {
		.colors-panel,
		.colors-panel.esquèrra {
			top: auto;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: 56dvh;
			border: 0;
			border-top: 1px solid var(--o-filet);
		}
		.colors-panel.reduch {
			height: auto;
		}
		.grand {
			display: none;
		}
		header {
			padding: 10px 16px 8px;
		}
		.reglatges {
			margin-top: 6px;
		}
	}
</style>
