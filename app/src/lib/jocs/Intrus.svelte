<script>
	// L'intrús (chantier 33, séance 1, 07-11) : quatre mots, trois font une
	// famille, le quatrième est l'intrus. D'abord placé dans les leçons de
	// tâche, passé dans la salle Jòcs le jour même (Romain : « L'intru devrait
	// être dans les Jocs et on verra après comment intégrer les jocs dans le
	// parcours »). Rien de punitif : un mot touché à tort est barré, on
	// continue ; ni score ni chronomètre (les quatre carrés disent l'avancée de
	// l'unité). Trouvé, les trois mots de la famille passent à l'or et se
	// rangent ensemble (glissement sans rebond, immobile si l'appareil demande
	// moins d'animations), un filet d'or se trace sous eux avec le nom de la
	// famille, et l'intrus reste à l'écart. Quatre séries par unité, de 1 à 8
	// ($lib/jocs/intrus-series.js) ; l'ordre des mots est mêlé à chaque
	// partie. Composant affiché par la page /apren/jocs (?joc=intrus).
	import { onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { tria, lang as langStore } from '$lib/stores/lang.svelte.js';
	import { SERIAS, UNITATS_INTRUS } from '$lib/jocs/intrus-series.js';
	import { UNITATS } from '$lib/jocs/serp-mots.js';
	import { rich, insecable } from '$lib/lesson/rich.js';
	import { playNota, playSorda, playArpegi } from '$lib/lesson/sounds.js';
	import Reglatges from '$lib/jocs/Reglatges.svelte';
	import BotonEcran from '$lib/jocs/BotonEcran.svelte';

	// Occitan passé à lo Congrès le 2026-11-07 (intrús, quatre, tres, fan,
	// una, familha, tòca, tièra, seguenta), à valider par Romain ; le reste
	// est repris des Paniers (05-11). « Tièra » : la forme languedocienne
	// que donne lo Basic pour « série ».
	const T = {
		consigna: {
			oc: 'Quatre mots : tres fan una familha. Tòca l’intrús.',
			fr: 'Quatre mots : trois font une famille. Touche l’intrus.'
		},
		nivel: { oc: 'Nivèl', fr: 'Niveau' },
		unitat: { oc: (n) => `Unitat ${n}`, fr: (n) => `Unité ${n}` },
		reglatges: { oc: 'Reglatges', fr: 'Réglages' },
		son: { oc: 'Son', fr: 'Son' },
		tornarJogar: { oc: 'Tornar jogar', fr: 'Rejouer' },
		tiera: { oc: (n, t) => `Tièra ${n} sus ${t}`, fr: (n, t) => `Série ${n} sur ${t}` },
		seguenta: { oc: 'Tièra seguenta', fr: 'Série suivante' },
		unitatSeguenta: { oc: 'Unitat seguenta', fr: 'Unité suivante' },
		osca: { oc: 'Òsca !', fr: 'Bravo !' },
		trobat: { oc: (m) => `${m} : l’intrús !`, fr: (m) => `${m} : l’intrus !` },
		non: { oc: (m) => `${m} : non.`, fr: (m) => `${m} : non.` }
	};

	const CLAU_SON = 'lo-ligam-jocs-son'; // partagé avec la sèrp et les panièrs
	const titolUnitat = (u) => UNITATS.find((x) => x.id === u)?.titol ?? '';

	let immersiu = $state(false);
	let son = $state(true);
	let doux = $state(false);
	let esOc = $derived(langStore.current === 'oc');
	let racina = $state();

	// ── La partie ────────────────────────────────────────────────────────
	let unitat = $state(1);
	let n = $state(0); // la série en cours
	let ordre = $state([0, 1, 2, 3]); // l'ordre des mots à l'écran
	let fautas = $state([]); // les mots touchés à tort
	let trobat = $state(false);
	let fin = $state(false);
	let tremol = $state(-1); // le mot qui tremble un instant
	// chaque nouveau mélange recrée les tuiles : elles ne glissent que quand
	// la famille se range, jamais au mélange
	let partida = $state(0);
	let anonci = $state('');
	let serias = $derived(SERIAS[unitat]);
	let seria = $derived(serias[n]);
	let fachas = $derived(fin ? serias.length : n + (trobat ? 1 : 0));
	let pecas = $state([]);
	let botonSeguent = $state();

	function barrejar(a) {
		const b = [...a];
		for (let i = b.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[b[i], b[j]] = [b[j], b[i]];
		}
		return b;
	}

	function preparar() {
		ordre = barrejar([0, 1, 2, 3]);
		partida += 1;
		fautas = [];
		trobat = false;
		tremol = -1;
	}

	function començar(u) {
		unitat = u;
		n = 0;
		fin = false;
		anonci = '';
		preparar();
	}

	async function tocar(i) {
		if (trobat || fautas.includes(i)) return;
		const mot = seria.mots[i];
		if (i === seria.intrus) {
			trobat = true;
			// l'intrus passe en bout de rang, la famille se resserre
			ordre = [...ordre.filter((o) => o !== i), i];
			anonci = tria(T.trobat)(mot);
			if (son) playArpegi(3, 0.08);
			await tick();
			botonSeguent?.focus({ preventScroll: true });
		} else {
			fautas = [...fautas, i];
			tremol = i;
			setTimeout(() => tremol === i && (tremol = -1), 320);
			anonci = tria(T.non)(mot);
			if (son) playSorda();
		}
	}

	async function seguenta() {
		if (n + 1 < serias.length) {
			n += 1;
			preparar();
			if (son) playNota(0);
			await tick();
			pecas[0]?.focus({ preventScroll: true });
		} else {
			fin = true;
			anonci = tria(T.osca);
			if (son) playArpegi(5);
		}
	}

	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {}
	}

	onMount(() => {
		doux = matchMedia('(prefers-reduced-motion: reduce)').matches;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {}
		començar(1);
	});
</script>

<section class="joc" class:immersiu aria-labelledby="titol-intrus" bind:this={racina}>
	<div class="disposicion">
		<header class="cap-joc">
			<h2 id="titol-intrus" lang="oc">L’intrús</h2>
			{#if !esOc}<p class="glosa" lang="fr">l’intrus</p>{/if}
			<p class="consigna">{tria(T.consigna)}</p>
		</header>

		<div class="pista">
			<div class="pista-info" aria-hidden="true">
				<p class="sens" lang="oc">{tria(T.unitat)(unitat)} · {insecable(titolUnitat(unitat))}</p>
				<p class="compte">{tria(T.tiera)(Math.min(n + 1, serias.length), serias.length)}</p>
				<!-- un carré par série, doré une fois l'intrus trouvé -->
				<span class="granas">{#each serias as s, k (k)}<i class:fach={k < fachas}></i>{/each}</span>
			</div>
			<BotonEcran bind:actiu={immersiu} cibla={racina} />
		</div>

		<div class="taula">
			{#if fin}
				<div class="fin">
					<p class="osca" lang="oc">{tria(T.osca)}</p>
					<!-- les quatre familles trouvées, en souvenir de la partie -->
					<ul class="recap" lang="fr">
						{#each serias as s, k (k)}
							<li><i aria-hidden="true"></i><span>{s.familha}</span> <span class="recap-fora">· l’intrus : <em lang="oc">{s.mots[s.intrus]}</em></span></li>
						{/each}
					</ul>
					<div class="fin-accions">
						{#if unitat < UNITATS_INTRUS.at(-1)}
							<button type="button" class="pc" onclick={() => començar(unitat + 1)}>{tria(T.unitatSeguenta)}</button>
						{/if}
						<button type="button" class="pc pc-2" onclick={() => començar(unitat)}>{tria(T.tornarJogar)}</button>
					</div>
				</div>
			{:else}
				{#key partida}
					<div class="tiera">
						<div class="pecas" class:resolguda={trobat} role="group" aria-label={tria(T.tiera)(n + 1, serias.length)}>
							{#each ordre as oi, k (oi)}
								<button
									type="button"
									lang="oc"
									class="peca"
									class:familha={trobat && oi !== seria.intrus}
									class:fora={trobat && oi === seria.intrus}
									class:falsa={!trobat && fautas.includes(oi)}
									class:tremol={tremol === oi}
									disabled={trobat}
									aria-disabled={fautas.includes(oi) || undefined}
									bind:this={pecas[k]}
									onclick={() => tocar(oi)}
									animate:flip={{ duration: doux ? 0 : 420 }}
								>
									{insecable(seria.mots[oi])}
								</button>
							{/each}
							{#if trobat}
								<p class="familha-nom" lang="fr">{seria.familha}</p>
							{/if}
						</div>
						<!-- une ligne réservée : rien ne saute quand elle se remplit -->
						<div class="apres">
							{#if trobat}
								<p class="explain" lang="fr"><span class="coche" aria-hidden="true">✓</span> {@html rich(seria.explain)}</p>
								<button type="button" class="pc seguenta" bind:this={botonSeguent} onclick={seguenta}>
									{n + 1 < serias.length ? tria(T.seguenta) : tria(T.osca)}
									<span aria-hidden="true">›</span>
								</button>
							{/if}
						</div>
					</div>
				{/key}
			{/if}
		</div>

		<div class="comandas">
			<Reglatges
				causida={{
					titol: tria(T.nivel),
					valor: String(unitat),
					causir: (u) => u !== String(unitat) && començar(Number(u)),
					compacte: true,
					opcions: UNITATS.map((u) => ({
						id: String(u.id),
						label: String(u.id),
						aria: `${tria(T.unitat)(u.id)} · ${u.titol}`,
						inactiu: !UNITATS_INTRUS.includes(u.id)
					})),
					legenda: { nom: tria(T.unitat)(unitat), titol: titolUnitat(unitat) }
				}}
				bascules={[{ id: 'son', label: tria(T.son), valor: son, bascular: bascularSon }]}
				titolOpcions={tria(T.reglatges)}
			>
				<button type="button" class="pc pc-2" onclick={() => començar(unitat)}>{tria(T.tornarJogar)}</button>
			</Reglatges>
		</div>
	</div>
	<p class="sr" aria-live="polite">{anonci}</p>
</section>

<style>
	.joc {
		container: joc / inline-size;
		--or: var(--t-aur);
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
	.taula {
		grid-area: taula;
		min-width: 0;
	}
	.comandas {
		grid-area: comandas;
		display: grid;
		gap: var(--esp-24);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.05;
		color: var(--or);
	}
	.glosa {
		margin: 0.2rem 0 0;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.consigna {
		max-width: 36ch;
		margin: var(--esp-12) 0 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.sens {
		margin: 0;
		font-size: clamp(1.25rem, 2.4vw, 1.5rem);
		line-height: 1.3;
	}
	.compte {
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
	}
	/* les quatre séries : de petits carrés, dorés une fois l'intrus trouvé */
	.granas {
		display: flex;
		gap: 0.3rem;
		margin-top: var(--esp-8);
	}
	.granas i {
		width: 0.7rem;
		aspect-ratio: 1;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 40%, transparent);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;
	}
	.granas i.fach {
		background: var(--or);
		box-shadow: none;
	}

	/* ── Le terrain : un aplat, les quatre mots en tuiles ── */
	.tiera,
	.fin {
		container-type: inline-size;
		padding: clamp(1rem, 3cqi, 2.5rem);
		border-radius: 0.2rem;
		background: var(--fons-camp, color-mix(in srgb, var(--t-tinta) 4%, var(--t-fons)));
	}
	/* deux par deux sur téléphone, quatre de front dès que la place le permet */
	.pecas {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(0.5rem, 1.6cqi, 1rem);
	}
	.peca {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: clamp(4.5rem, 16cqi, 9.5rem);
		padding: 0.6rem 0.8rem;
		border: none;
		border-radius: 0.1em;
		background: var(--b1, #efe1c6);
		box-shadow: var(--b-joint);
		color: var(--b-tinta, #2a1a10);
		font: 700 clamp(1.1rem, 3cqi, 1.75rem) / 1.2 var(--font-body);
		text-align: center;
		cursor: pointer;
		transition:
			transform 0.18s ease-out,
			background-color 0.3s,
			opacity 0.3s;
	}
	.peca:hover:not(:disabled, .falsa) {
		transform: translateY(-2px);
	}
	.peca:focus-visible {
		outline: 2px solid var(--or);
		outline-offset: 3px;
	}
	.peca:disabled,
	.peca.falsa {
		cursor: default;
	}
	/* touché à tort : barré, on continue */
	.peca.falsa {
		opacity: 0.45;
		text-decoration: line-through;
		text-decoration-thickness: 2px;
	}
	.peca.tremol {
		animation: tremol 0.3s ease-out;
	}
	/* la famille passe à l'or, ensemble */
	.peca.familha {
		background: var(--b-dos, #ffd47f);
		color: var(--b-dos-tinta, #2a1a10);
		opacity: 1;
		text-decoration: none;
	}
	/* l'intrus reste à l'écart, posé à plat */
	.peca.fora {
		background: color-mix(in srgb, var(--t-tinta) 14%, var(--t-fons));
		box-shadow: none;
		color: var(--t-tinta);
		opacity: 0.7;
		transform: translateY(4px);
	}

	/* le nom de la famille, sous un filet d'or qui se trace */
	.familha-nom {
		position: relative;
		grid-column: 1 / -1;
		margin: 0.2rem 0 0;
		padding-top: 0.7rem;
		font-size: clamp(1rem, 2.4cqi, 1.2rem);
		font-weight: 700;
		text-align: center;
		color: var(--or);
		animation: apareisser 0.35s 0.2s ease-out both;
	}
	.familha-nom::before {
		content: '';
		position: absolute;
		inset: 0 0.75rem auto;
		height: 1px;
		background: var(--or);
		transform-origin: left;
		animation: tracar 0.45s ease-out both;
	}
	@container (min-width: 36rem) {
		.pecas {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		/* sous les trois mots de la famille, pas sous l'intrus */
		.familha-nom {
			grid-column: 1 / 4;
		}
		.peca.fora {
			margin-left: clamp(0.5rem, 2cqi, 1.5rem);
		}
	}

	/* l'explication et la suite : une place réservée */
	.apres {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-12) var(--esp-24);
		min-height: 3.2rem;
		margin-top: var(--esp-16);
	}
	.explain {
		flex: 1 1 18rem;
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta);
		animation: apareisser 0.35s 0.35s ease-out both;
	}
	.coche {
		color: var(--or);
		font-weight: 700;
	}
	.seguenta {
		--r: 10px;
		padding: 0.6rem 1.2rem;
		animation: apareisser 0.35s 0.45s ease-out both;
	}

	/* ── La fin de l'unité : les quatre familles trouvées ── */
	.fin {
		display: grid;
		justify-items: start;
		gap: var(--esp-16);
	}
	.osca {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 7cqi, 3.4rem);
		line-height: 1;
		color: var(--or);
	}
	.recap {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.recap li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.5rem;
		font-weight: 700;
		animation: apareisser 0.35s ease-out both;
	}
	.recap li:nth-child(2) {
		animation-delay: 0.1s;
	}
	.recap li:nth-child(3) {
		animation-delay: 0.2s;
	}
	.recap li:nth-child(4) {
		animation-delay: 0.3s;
	}
	.recap i {
		flex: none;
		width: 0.7rem;
		aspect-ratio: 1;
		background: var(--or);
		transform: translateY(0.05em);
	}
	.recap-fora {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.fin-accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-12);
		margin-top: var(--esp-8);
	}
	.fin-accions .pc {
		--r: 10px;
		padding: 0.6rem 1.2rem;
	}

	/* ── Mode plein (BotonEcran) : le jeu couvre tout l'écran ── */
	.joc.immersiu {
		position: fixed;
		inset: 0;
		z-index: 30;
		overflow: auto;
		padding: max(0.75rem, env(safe-area-inset-top)) clamp(0.75rem, 3vw, 2rem) max(0.75rem, env(safe-area-inset-bottom));
		background: var(--t-fons);
	}
	.immersiu .disposicion {
		min-height: 100%;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1fr auto;
		grid-template-areas: 'pista' 'taula' 'comandas';
		gap: var(--esp-12);
		align-items: center;
	}
	.immersiu .cap-joc {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.immersiu .pista,
	.immersiu .taula {
		width: min(100%, 64rem);
		margin-inline: auto;
	}
	.immersiu .pista-info {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem var(--esp-16);
	}
	.immersiu .compte,
	.immersiu .granas {
		margin: 0;
	}
	.immersiu .comandas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--esp-12) var(--esp-24);
	}
	.immersiu .comandas :global(.reglatges .grop) {
		display: none;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@keyframes tremol {
		25% {
			transform: translateX(-4px);
		}
		60% {
			transform: translateX(4px);
		}
	}
	@keyframes tracar {
		from {
			transform: scaleX(0);
		}
	}
	@keyframes apareisser {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.peca,
		.granas i {
			transition: none;
		}
		.peca.tremol,
		.familha-nom,
		.familha-nom::before,
		.explain,
		.seguenta,
		.recap li {
			animation: none;
		}
	}
</style>
