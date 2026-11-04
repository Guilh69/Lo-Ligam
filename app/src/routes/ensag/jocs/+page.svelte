<script>
	// Jòcs, page d'essai (chantier 27, idée de Romain du 2026-11-04 ; option A
	// sur 3 : « La sèrp de las letras »). On lit le sens en français, la sèrp
	// mange les lettres du mot dans l'ordre et sa queue écrit le mot. Seulement
	// les mots des unités 1 et 2 ($lib/jocs/serp-mots.js, vérifiés contre les
	// modules par serp.test.js) ; ni score, ni classement, ni chronomètre, ni
	// partie perdue (cahier §11, 2026-10-25). Clavier (flèches, ZQSD), doigt
	// (glisser sur la grille, ou les quatre flèches), pause, son désactivable,
	// « pas à pas » d'office avec « réduire les animations ». Non indexée, pas
	// dans le menu. Aucun fichier : ni image ni son (les sons des leçons sont
	// fabriqués dans le navigateur).
	import { onMount } from 'svelte';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import { tria, lang as langStore } from '$lib/stores/lang.svelte.js';
	import { UNITATS, copar, letrasDe } from '$lib/jocs/serp-mots.js';
	import { novelaPartida, virar, pas, posicions, letraAttesa, DIRS } from '$lib/jocs/serp.js';
	import { playTick, playChime } from '$lib/lesson/sounds.js';

	// Occitan passé à lo Congrès le 2026-11-04, à valider par Romain.
	const T = {
		frasa: { oc: 'De jòcs amb los mots de las leiçons.', fr: 'Des jeux avec les mots des leçons.' },
		consigna: {
			oc: 'La sèrp manja las letras dins l’òrdre : sa coa escriu lo mot.',
			fr: 'La sèrp mange les lettres dans l’ordre : sa queue écrit le mot.'
		},
		mots: { oc: 'Los mots', fr: 'Les mots' },
		doas: { oc: 'Las doas unitats', fr: 'Les deux unités' },
		pausa: { oc: 'Pausa', fr: 'Pause' },
		son: { oc: 'Son', fr: 'Son' },
		pasAPas: { oc: 'Pas a pas', fr: 'Pas à pas' },
		autreMot: { oc: 'Un autre mot', fr: 'Un autre mot' },
		grasilha: { oc: 'Grasilha del jòc', fr: 'Grille du jeu' },
		partirClavier: { oc: 'Quicha una sageta per partir.', fr: 'Appuie sur une flèche pour partir.' },
		partirTactil: { oc: 'Tòca una sageta o lisa lo det per partir.', fr: 'Touche une flèche ou glisse le doigt pour partir.' },
		barrada: { oc: 'Ta coa barra lo camin : vira.', fr: 'Ta queue barre le chemin : tourne.' },
		enPausa: { oc: 'En pausa', fr: 'En pause' },
		clavier: { oc: 'Sagetas del clavièr · Espaci : pausa', fr: 'Flèches du clavier · Espace : pause' },
		escriu: { oc: 'Escriu', fr: 'Écris' },
		escrich: { oc: 'Escrich uèi :', fr: 'Écrit aujourd’hui :' },
		letra: { oc: (n, t) => `Letra ${n} sus ${t}`, fr: (n, t) => `Lettre ${n} sur ${t}` },
		amont: { oc: 'Amont', fr: 'Haut' },
		aval: { oc: 'Aval', fr: 'Bas' },
		esquerra: { oc: 'Esquèrra', fr: 'Gauche' },
		drecha: { oc: 'Drecha', fr: 'Droite' }
	};

	const PAS_MS = 380; // un pas toutes les 0,38 s : lent, constant, jamais accéléré
	const CLAU_SON = 'lo-ligam-jocs-son';

	// ── Réglages ─────────────────────────────────────────────────────────
	let causida = $state('1'); // '1', '2' ou 'doas'
	let pasAPas = $state(false);
	let son = $state(true);
	let tactil = $state(false);
	let calme = $state(false);
	let esOc = $derived(langStore.current === 'oc');

	// ── Partie ───────────────────────────────────────────────────────────
	let cols = $state(15);
	let rows = $state(9);
	let p = null; // état du jeu (serp.js), hors réactivité
	let numero = 0; // numéro de la partie : clés uniques d'un mot à l'autre
	let mot = $state(null);
	let vista = $state({ teulas: [], cap: { x: 0, y: 0, saut: false }, dir: 'drecha', seguenta: 0 });
	let estat = $state('espera'); // espera · joc · pausa · acabat
	let barrada = $state(false);
	let indici = $state(false);
	let tremola = $state(null);
	let anonci = $state('');
	let escrichs = $state([]);
	let sac = [];
	let darrierProgres = 0;
	let relòtge = null;
	let ancianas = new Map();
	let racina;

	let partidas = $derived(copar(mot?.cadre ?? '_'));
	let letras = $derived(mot ? letrasDe(mot.mot) : []);
	let frasaComplèta = $derived(mot ? partidas.avant + mot.mot + partidas.apres : '');

	function barrejar(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	function lista() {
		return causida === 'doas' ? UNITATS.flatMap((u) => u.mots) : UNITATS.find((u) => String(u.id) === causida).mots;
	}
	function tirar() {
		if (!sac.length) {
			sac = barrejar(lista().slice());
			// jamais deux fois le même mot de suite
			if (sac.length > 1 && mot && sac.at(-1).mot === mot.mot) sac.unshift(sac.pop());
		}
		return sac.pop();
	}

	function nomDir(d) {
		return Object.keys(DIRS).find((k) => DIRS[k].x === d.x && DIRS[k].y === d.y);
	}

	// grille en largeur sur un grand écran, en hauteur sur un téléphone ;
	// revue à chaque mot (l'écran a pu tourner)
	function mesurar() {
		const estrech = matchMedia('(max-width: 559px)').matches;
		cols = estrech ? 10 : 15;
		rows = estrech ? 12 : 9;
	}

	function novelMot() {
		arrestar();
		mot = tirar();
		numero++;
		mesurar();
		// la tête repart d'où elle était (dans la grille), dans la même direction
		const cap = p
			? { x: Math.min(p.cors[0].x, cols - 1), y: Math.min(p.cors[0].y, rows - 1) }
			: { x: Math.floor(cols / 4), y: Math.floor(rows / 2) };
		const dir = p ? { ...p.dir } : DIRS.drecha;
		p = novelaPartida({ mot: mot.mot, trapas: mot.trapas, cols, rows, cap, dir });
		ancianas = new Map();
		estat = 'espera';
		barrada = false;
		indici = false;
		darrierProgres = Date.now();
		// pour les lecteurs d'écran : le sens, puis la formule à trous
		anonci = `${tria(T.escriu)} : ${mot.fr} · ${partidas.avant}…${partidas.apres} (${tria(T.letra)(1, letras.length)})`;
		rafrescar();
	}

	function rafrescar() {
		const teulas = posicions(p).map((t) => {
			const k = `${numero}-${t.k}`;
			const a = ancianas.get(k);
			// j : rang de la lettre dans le mot (pour l'onde de fin)
			return { ...t, k, j: t.cors ? p.manjadas.indexOf(t.k) : 0, saut: !!a && (Math.abs(a.x - t.x) > 1 || Math.abs(a.y - t.y) > 1) };
		});
		const c = p.cors[0];
		const ac = ancianas.get('cap');
		// pas de glissement à l'apparition, ni quand le bord fait passer de l'autre côté
		const cap = { x: c.x, y: c.y, saut: !ac || Math.abs(ac.x - c.x) > 1 || Math.abs(ac.y - c.y) > 1 };
		ancianas = new Map(teulas.map((t) => [t.k, t]));
		ancianas.set('cap', cap);
		// la langue sort quand la lettre attendue est juste devant la tête
		const att = letraAttesa(p);
		const d = p.file[0] ?? p.dir;
		const nx = (c.x + d.x + p.cols) % p.cols;
		const ny = (c.y + d.y + p.rows) % p.rows;
		const prop = !!att && p.teulas.some((t) => !t.manjada && t.l === att && t.x === nx && t.y === ny);
		vista = { teulas, cap, dir: nomDir(p.dir), seguenta: p.seguenta, attesa: att, prop };
	}

	function avançar() {
		if (!p || estat === 'acabat') return;
		const r = pas(p);
		barrada = r.tipe === 'barrada';
		if (r.tipe === 'error') {
			tremola = `${numero}-${r.teula.k}`;
			setTimeout(() => (tremola = null), 420);
		}
		if (r.tipe === 'manjada' || r.tipe === 'acabat') {
			darrierProgres = Date.now();
			if (son) playTick();
			anonci = `${r.teula.l} · ${tria(T.letra)(Math.min(p.seguenta + 1, letras.length), letras.length)}`;
		}
		if (r.tipe === 'acabat') {
			arrestar();
			estat = 'acabat';
			if (son) setTimeout(playChime, 160);
			anonci = `${frasaComplèta} · ${mot.son} · ${mot.fr}`;
			// ce que la sèrp a écrit dans cette séance (les huit derniers)
			escrichs = [...escrichs.slice(-7), frasaComplèta];
		}
		// aide douce : la bonne lettre s'éclaire après deux erreurs ou 12 s
		indici = !p.acabat && (p.errors >= 2 || Date.now() - darrierProgres > 12000);
		rafrescar();
	}

	function demarrar() {
		arrestar();
		if (!pasAPas) relòtge = setInterval(avançar, PAS_MS);
	}
	function arrestar() {
		if (relòtge) clearInterval(relòtge);
		relòtge = null;
	}

	function demandar(nom) {
		if (!p || estat === 'acabat') return;
		const d = DIRS[nom];
		// le délai de l'aide douce part du premier mouvement, pas de l'affichage
		if (estat === 'espera') darrierProgres = Date.now();
		const ok = virar(p, d);
		if (pasAPas) {
			// en pas à pas, chaque appui fait un pas (sauf le demi-tour, refusé)
			const memo = p.dir;
			const demiTorn = p.cors.length > 1 && d.x === -memo.x && d.y === -memo.y;
			if (!ok && demiTorn) return;
			estat = 'joc';
			avançar();
			return;
		}
		if (estat === 'espera' || estat === 'pausa') {
			estat = 'joc';
			avançar();
			demarrar();
		}
	}

	function bascularPausa() {
		if (estat === 'joc') {
			arrestar();
			estat = 'pausa';
		} else if (estat === 'pausa') {
			estat = 'joc';
			demarrar();
		}
	}

	function bascularPasAPas() {
		pasAPas = !pasAPas;
		if (estat === 'joc') demarrar();
	}

	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {}
	}

	function causir(c) {
		if (c === causida) return;
		causida = c;
		sac = [];
		novelMot();
	}

	// ── Clavier ──────────────────────────────────────────────────────────
	const TOCAS = {
		ArrowUp: 'amont',
		KeyW: 'amont',
		ArrowDown: 'aval',
		KeyS: 'aval',
		ArrowLeft: 'esquerra',
		KeyA: 'esquerra',
		ArrowRight: 'drecha',
		KeyD: 'drecha'
	};
	// Le jeu ne prend les touches que s'il est concerné (WCAG 2.1.4, et pour
	// laisser défiler la page) : le focus est dans le jeu, ou la sèrp avance ;
	// les flèches aussi quand rien n'a le focus et que la grille est en vue.
	function enVista() {
		const r = racina?.querySelector('.grasilha')?.getBoundingClientRect();
		return !!r && r.top >= 0 && r.bottom <= innerHeight;
	}
	function tòca(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const cibla = e.target;
		if (cibla?.closest?.('input, select, textarea, [contenteditable]')) return;
		const dedins = !!racina?.contains(cibla) || estat === 'joc';
		const res = !cibla || cibla === document.body || cibla === document.documentElement;
		const sus = cibla?.closest?.('button, a');
		const nom = TOCAS[e.code];
		if (nom) {
			const sageta = e.code.startsWith('Arrow');
			if (!(dedins || (sageta && res && enVista()))) return;
			e.preventDefault();
			demandar(nom);
			return;
		}
		if (!dedins) return;
		if ((e.code === 'Space' && !sus) || e.code === 'Escape') {
			if (estat === 'joc' || estat === 'pausa') {
				e.preventDefault();
				bascularPausa();
			}
		}
		if (e.code === 'Enter' && !sus && estat === 'acabat') {
			e.preventDefault();
			novelMot();
		}
	}

	// ── Doigt : glisser sur la grille ────────────────────────────────────
	let origina = null;
	function tocar(e) {
		// la grille prend le focus : le clavier marche ensuite à coup sûr
		e.currentTarget.focus({ preventScroll: true });
		origina = { x: e.clientX, y: e.clientY };
	}
	function lisar(e) {
		if (!origina) return;
		const dx = e.clientX - origina.x;
		const dy = e.clientY - origina.y;
		if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
		demandar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'drecha' : 'esquerra') : dy > 0 ? 'aval' : 'amont');
		origina = { x: e.clientX, y: e.clientY };
	}
	function levar() {
		origina = null;
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		pasAPas = calme;
		tactil = matchMedia('(pointer: coarse)').matches;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {}
		novelMot();
		const amagat = () => {
			if (document.hidden && estat === 'joc') bascularPausa();
		};
		document.addEventListener('visibilitychange', amagat);
		return () => {
			arrestar();
			document.removeEventListener('visibilitychange', amagat);
		};
	});
</script>

<svelte:window onkeydown={tòca} />

<svelte:head>
	<title>Jòcs · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet sageta(nom)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class="sageta sageta-{nom}"><path d="M7 14.5l5-5 5 5" /></svg>
{/snippet}

<PaginaSimpla titol="Jòcs" frasa={tria(T.frasa)} parent={{ href: '/apren', nom: 'S’apren' }}>
	<section class="joc" aria-labelledby="titol-serp" style:--pas="{pasAPas ? 160 : PAS_MS}ms" bind:this={racina}>
		<div class="disposicion">
			<header class="cap-joc">
				<h2 id="titol-serp" lang="oc">La sèrp de las letras</h2>
				{#if !esOc}<p class="glosa" lang="fr">le serpent des lettres</p>{/if}
				<p class="consigna">{tria(T.consigna)}</p>
			</header>

			<div class="pista" aria-hidden="true">
				{#if mot}
					<p class="sens" lang="fr">{mot.fr}</p>
					<p class="cadre" lang="oc">
						{#if partidas.avant}<span>{partidas.avant}</span>{/if}<span class="caselas"
							>{#each letras as l, i (i)}<span class="casela" class:plena={i < vista.seguenta}
									>{i < vista.seguenta ? l : ''}</span
								>{/each}</span
						>{#if partidas.apres}<span>{partidas.apres}</span>{/if}
					</p>
				{/if}
			</div>

			<div class="taula">
				<!-- La grille : on y glisse le doigt ; elle prend le focus (Tab ou toucher) pour le clavier.
				     Rôle « application » : un widget piloté au clavier (WCAG 2.1.4), d'où le tabindex. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="grasilha"
					class:calme
					class:pausa={estat === 'pausa'}
					class:acabat={estat === 'acabat'}
					style:--cols={cols}
					style:--rows={rows}
					role="application"
					tabindex="0"
					aria-label={tria(T.grasilha)}
					aria-describedby="anonci-serp"
					onpointerdown={tocar}
					onpointermove={lisar}
					onpointerup={levar}
					onpointercancel={levar}
				>
					{#each vista.teulas as t (t.k)}
						<span
							class="teula"
							class:cors={t.cors}
							class:sota={t.sotaCap}
							class:saut={t.saut}
							class:indici={indici && !t.cors && t.l === vista.attesa}
							style:--x={t.x}
							style:--y={t.y}
							style:--j={t.j}
							lang="oc"><span class="l" class:tremola={tremola === t.k}>{t.l}</span></span
						>
					{/each}
					<span class="cap" class:saut={vista.cap.saut} class:barrada class:prop={vista.prop} style:--x={vista.cap.x} style:--y={vista.cap.y}>
						<span class="testa testa-{vista.dir}"><span class="uelh"></span><span class="uelh"></span><span class="lenga"></span></span>
					</span>

					{#if estat === 'acabat' && mot}
						<div class="fin" style:--n={letras.length}>
							<p class="fin-oc" lang="oc">{frasaComplèta}</p>
							<p class="fin-son" lang="oc">{mot.son}</p>
							<p class="fin-fr" lang="fr">{mot.fr}</p>
							<button type="button" class="accion" onclick={novelMot}>{tria(T.autreMot)}</button>
						</div>
					{/if}
				</div>
				<!-- sous la grille, pour ne jamais cacher la sèrp ni une lettre -->
				<p class="messatge" class:vis={estat === 'espera' || estat === 'pausa' || barrada}>
					{#if barrada}{tria(T.barrada)}
					{:else if estat === 'pausa'}{tria(T.enPausa)}
					{:else if estat === 'espera'}{tactil ? tria(T.partirTactil) : tria(T.partirClavier)}{/if}
				</p>
				{#if escrichs.length}
					<p class="escrichs">
						<span class="escrichs-tit">{tria(T.escrich)}</span>
						{#each escrichs as e, i (i)}{#if i}<span class="sep"> · </span>{/if}<span lang="oc">{e}</span>{/each}
					</p>
				{/if}
			</div>

			<div class="comandas">
				<div class="crotz" role="group" aria-label={tria(T.grasilha)}>
					{#each ['amont', 'esquerra', 'drecha', 'aval'] as nom (nom)}
						<button type="button" class="dir dir-{nom}" aria-label={tria(T[nom])} onclick={() => demandar(nom)}>
							{@render sageta(nom)}
						</button>
					{/each}
				</div>
				{#if !tactil}<p class="ajuda">{tria(T.clavier)}</p>{/if}

				<div class="reglatges">
					<div class="causida" role="group" aria-label={tria(T.mots)}>
						{#each UNITATS as u (u.id)}
							<button type="button" aria-pressed={causida === String(u.id)} onclick={() => causir(String(u.id))}>
								<span>{tria(u.nom)}</span> <span class="u-titol" lang="oc">{u.titol}</span>
							</button>
						{/each}
						<button type="button" aria-pressed={causida === 'doas'} onclick={() => causir('doas')}>{tria(T.doas)}</button>
					</div>
					<div class="botons">
						<button type="button" aria-pressed={pasAPas} onclick={bascularPasAPas}>{tria(T.pasAPas)}</button>
						<button type="button" aria-pressed={son} onclick={bascularSon}>{tria(T.son)}</button>
						<button type="button" aria-pressed={estat === 'pausa'} disabled={estat !== 'joc' && estat !== 'pausa'} onclick={bascularPausa}
							>{tria(T.pausa)}</button
						>
						{#if estat !== 'acabat'}
							<button type="button" class="seguent" onclick={novelMot}>{tria(T.autreMot)}</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<p id="anonci-serp" class="sr" aria-live="polite">{anonci}</p>
	</section>
</PaginaSimpla>

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
	/* Grand écran : la grille à gauche, le reste à côté, à hauteur des yeux */
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
	}
	.taula {
		grid-area: taula;
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

	/* ── Le mot à écrire ── */
	.sens {
		margin: 0;
		font-size: clamp(1.25rem, 2.4vw, 1.5rem);
		line-height: 1.3;
	}
	.cadre {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.35em;
		margin: var(--esp-12) 0 0;
		font-size: 1.35rem;
		color: var(--t-tinta-2);
	}
	.caselas {
		display: inline-flex;
		gap: 0.3em;
	}
	.casela {
		display: inline-grid;
		place-items: end center;
		width: 1.05em;
		height: 1.35em;
		border-bottom: 1.5px solid var(--t-tinta-2);
		font-weight: 700;
		color: var(--t-tinta);
	}
	.casela.plena {
		border-bottom-color: var(--or);
		animation: pausar 0.25s ease-out;
	}
	@keyframes pausar {
		from {
			translate: 0 -0.25em;
			opacity: 0;
		}
	}

	/* ── La grille ── */
	.grasilha {
		--cela: calc(100cqi / var(--cols));
		container-type: inline-size;
		position: relative;
		width: 100%;
		/* jamais plus haute que la moitié de l'écran : le mot, la grille et les
		   flèches tiennent ensemble sur un téléphone de 667 px */
		max-width: calc(48svh * var(--cols) / var(--rows));
		aspect-ratio: var(--cols) / var(--rows);
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 1rem;
		background:
			radial-gradient(circle, var(--t-linha) 1px, transparent 1.5px) 0 0 / calc(100% / var(--cols)) calc(100% / var(--rows)),
			var(--l-carta);
		/* un léger assombrissement des bords : la grille a de la profondeur */
		box-shadow: inset 0 0 3rem color-mix(in srgb, var(--t-fons) 24%, transparent);
		margin-inline: auto;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		cursor: default;
	}
	.grasilha:focus {
		outline: none;
	}
	.grasilha:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 3px;
	}
	.teula,
	.cap {
		position: absolute;
		left: 0;
		top: 0;
		width: calc(100% / var(--cols));
		height: calc(100% / var(--rows));
		display: grid;
		place-items: center;
		transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
		transition: transform var(--pas) linear;
	}
	.saut,
	.calme .teula,
	.calme .cap {
		transition: none;
	}
	/* une lettre libre : un filet fin, rien de plus (raffiné = filets fins) */
	.l {
		display: grid;
		place-items: center;
		width: 74%;
		height: 74%;
		border-radius: 50%;
		background: color-mix(in srgb, var(--l-carta) 70%, transparent);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 45%, transparent);
		font-size: calc(var(--cela) * 0.5);
		font-weight: 600;
		line-height: 1;
		color: var(--t-tinta);
		transition:
			border-radius 0.3s,
			background-color 0.3s,
			width 0.3s,
			height 0.3s;
	}
	/* une lettre dans la queue : la tuile dorée du logo, en chaîne (les tuiles se touchent) */
	.cors .l {
		width: 94%;
		height: 94%;
		border-radius: 30%;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		box-shadow: inset 0 0 0 1.5px var(--or);
	}
	.cors.sota {
		z-index: 1;
	}
	/* la lettre vient d'être mangée : elle se gonfle un instant, sans rebond */
	.cors.sota .l {
		animation: manjar 0.3s ease-out;
	}
	@keyframes manjar {
		40% {
			scale: 1.16;
		}
	}
	/* mot écrit : une onde dorée court de la queue à la tête */
	.acabat .cors .l {
		animation: onda 0.55s ease-out calc(var(--j) * 90ms) both;
	}
	@keyframes onda {
		45% {
			background: var(--or);
			color: var(--color-text);
			scale: 1.1;
		}
	}
	.indici .l {
		box-shadow:
			0 0 0 1.5px var(--or),
			0 0 0 5px color-mix(in srgb, var(--or) 25%, transparent);
	}
	.tremola {
		animation: tremolar 0.36s ease-in-out;
	}
	.calme .tremola {
		animation: none;
		background: color-mix(in srgb, var(--t-tinta) 22%, transparent);
	}
	@keyframes tremolar {
		25% {
			translate: -12% 0;
		}
		75% {
			translate: 12% 0;
		}
	}

	.cap {
		z-index: 2;
	}
	.testa {
		position: relative;
		width: 94%;
		height: 94%;
		/* un museau arrondi, tourné vers la route ; l'or du logo sur les deux
		   thèmes (le rouge est réservé à ce qui se clique) */
		border-radius: 34% 50% 50% 34% / 45% 50% 50% 45%;
		background: var(--color-gold);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--color-text) 55%, transparent);
	}
	/* deux yeux, tournés vers la route ; aucune autre figure */
	.uelh {
		position: absolute;
		top: 26%;
		left: 60%;
		width: 15%;
		height: 15%;
		border-radius: 50%;
		background: var(--color-text);
	}
	.uelh + .uelh {
		top: 60%;
	}
	/* la langue : un trait fin qui sort quand la lettre attendue est juste devant */
	.lenga {
		position: absolute;
		left: 96%;
		top: 50%;
		width: 24%;
		height: 2px;
		margin-top: -1px;
		background: var(--color-text);
		transform-origin: left center;
		scale: 0 1;
		transition: scale 0.15s;
	}
	.prop .lenga {
		scale: 1 1;
		animation: lengueta 0.5s ease-in-out infinite alternate;
	}
	@keyframes lengueta {
		from {
			scale: 0.45 1;
		}
		to {
			scale: 1 1;
		}
	}
	.calme .prop .lenga {
		animation: none;
	}
	.testa-drecha {
		rotate: 0deg;
	}
	.testa-aval {
		rotate: 90deg;
	}
	.testa-esquerra {
		rotate: 180deg;
	}
	.testa-amont {
		rotate: 270deg;
	}
	.barrada .testa {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-tinta) 35%, transparent);
	}

	/* une ligne réservée sous la grille : rien ne bouge quand elle se vide */
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
	.escrichs {
		margin: var(--esp-12) 0 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
		text-align: center;
	}
	.escrichs span[lang] {
		color: var(--t-tinta);
		font-weight: 600;
	}
	.escrichs-tit {
		font-style: italic;
	}
	.pausa .teula,
	.pausa .cap {
		opacity: 0.45;
	}

	/* la carte du mot écrit : verre fumé au milieu de la grille, la sèrp reste
	   visible autour ; elle paraît une fois l'onde passée */
	.fin {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 4;
		translate: -50% -50%;
		width: min(86%, 26rem);
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		padding: 1.2rem 1.4rem 1.3rem;
		border-radius: 1rem;
		background: var(--t-veire-fort);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow:
			0 0 0 1px var(--t-linha),
			0 18px 40px -20px rgba(0, 0, 0, 0.5);
		text-align: center;
		animation: apareisser 0.4s ease-out both;
		animation-delay: calc(var(--n) * 90ms + 400ms);
	}
	@keyframes apareisser {
		from {
			opacity: 0;
			translate: -50% calc(-50% + 0.5rem);
		}
	}
	.calme .fin {
		animation: none;
	}
	.fin-oc {
		margin: 0;
		font-size: clamp(1.8rem, 7cqi, 3rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--t-tinta);
	}
	.fin-son {
		margin: 0;
		color: var(--l-marca);
	}
	.fin-fr {
		margin: 0 0 var(--esp-16);
		font-size: 1rem;
		font-style: italic;
		color: var(--t-tinta);
	}

	/* ── Commandes ── */
	button {
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.crotz {
		display: grid;
		grid-template-columns: repeat(3, 3.2rem);
		grid-template-rows: repeat(3, 3.2rem);
		grid-template-areas: '. amont .' 'esquerra . drecha' '. aval .';
		gap: 0.35rem;
		justify-content: center;
	}
	@container joc (min-width: 52rem) {
		.crotz {
			justify-content: start;
		}
	}
	.dir {
		display: grid;
		place-items: center;
		padding: 0;
		border: none;
		border-radius: 0.8rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		touch-action: manipulation;
	}
	.dir:hover {
		background: var(--t-accion-viu);
	}
	.dir-amont {
		grid-area: amont;
	}
	.dir-aval {
		grid-area: aval;
	}
	.dir-esquerra {
		grid-area: esquerra;
	}
	.dir-drecha {
		grid-area: drecha;
	}
	.sageta {
		width: 1.6rem;
		height: 1.6rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sageta-aval {
		rotate: 180deg;
	}
	.sageta-esquerra {
		rotate: 270deg;
	}
	.sageta-drecha {
		rotate: 90deg;
	}
	.ajuda {
		margin: 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
		text-align: center;
	}
	@container joc (min-width: 52rem) {
		.ajuda {
			text-align: start;
		}
	}

	.reglatges {
		display: grid;
		gap: var(--esp-12);
	}
	.causida,
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.causida button,
	.botons button {
		min-height: 2.75rem; /* 44 px au doigt */
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.6rem;
		background: none;
		color: var(--t-tinta);
	}
	.causida button:hover,
	.botons button:hover {
		border-color: var(--t-tinta-2);
	}
	/* réglage choisi : mis en valeur en or (règle B : le rouge reste pour l'action) */
	.causida button[aria-pressed='true'],
	.botons button[aria-pressed='true'] {
		border-color: transparent;
		background: var(--color-gold);
		color: var(--color-text);
	}
	.accion {
		border-color: transparent;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.u-titol {
		color: inherit;
		opacity: 0.78;
		font-style: italic;
	}
	.botons button:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.accion {
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 0.6rem;
	}
	.accion:hover {
		background: var(--t-accion-viu);
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
		.teula,
		.cap,
		.l,
		.lenga {
			transition: none;
		}
		.casela.plena,
		.cors.sota .l,
		.acabat .cors .l,
		.prop .lenga,
		.fin {
			animation: none;
		}
	}
</style>
