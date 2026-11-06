<script>
	// « Pausa los mots » (nom choisi par Romain le 06-11 ; remplace « Ont
	// es… ? ». Romain : « ont es me dérange. L'idée c'est associer l'occitan
	// avec ce que l'on voit à l'écran. Et dans la partie jeux il faudrait avoir
	// l'endroit prévu pour recevoir le mot et associer le mot » ; « tout
	// devrait tenir sur l'écran sans devoir descendre »).
	// Une photo de Romain ; à côté de chaque chose nommée, une case vide reliée
	// à son point d'or ; les mots de la photo en tuiles. On fait glisser chaque
	// tuile dans sa case, ou on touche la tuile puis la case (au clavier :
	// Entrée sur la tuile, puis sur la case). Mauvaise case : la tuile revient,
	// rien de punitif ; après deux essais pour un mot, sa case respire. Toutes
	// les cases pleines : la photo est faite. Cinq photos par partie, le thème
	// choisi à l'entrée (une vignette par thème). Les mêmes paysages et points
	// que Remira : $lib/paisatges/paisatges.js ; la place des cases :
	// pausa-casas.js. Niveau « Amb ajuda » : le français sous chaque tuile ;
	// « Sens ajuda » : il vient une fois le mot posé (ces mots de nature ont
	// toujours leur traduction, Romain 05-11).
	// Tout tient dans l'écran : la photo prend la hauteur qui reste, la colonne
	// (titre, mots, réglages) à côté ; sur téléphone, les mots sous la photo,
	// les réglages derrière un bouton.
	import { onMount, tick } from 'svelte';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { PAISATGES, MOTS, TEMAS, camin, srcset } from '$lib/paisatges/paisatges.js';
	import { playTick, playNota, playArpegi, playChime } from '$lib/lesson/sounds.js';
	import { plaçarCasas, casaDe } from '$lib/jocs/pausa-casas.js';
	import Reglatges from '$lib/jocs/Reglatges.svelte';
	import BotonEcran from '$lib/jocs/BotonEcran.svelte';

	// Occitan passé à lo Congrès le 06-11 (pausa et lisa : vèrb'Òc ; casa
	// pour la case, puèi, seguenta ; cada déjà dans les leçons, l'API plante
	// sur ce mot), à valider par Romain. Le reste vient d'« Ont es… ? ».
	const T = {
		consigna: { oc: 'Pausa cada mot dins sa casa sus la fòto.', fr: 'Pose chaque mot dans sa case sur la photo.' },
		cossi: {
			oc: 'Lisa lo mot dins sa casa, o tòca lo mot puèi sa casa.',
			fr: 'Fais glisser le mot dans sa case, ou touche le mot puis sa case.'
		},
		mots: { oc: 'Los mots', fr: 'Les mots' },
		nivel: { oc: 'Nivèl', fr: 'Niveau' },
		amb: { oc: 'Amb ajuda', fr: 'Avec aide' },
		sens: { oc: 'Sens ajuda', fr: 'Sans aide' },
		reglatges: { oc: 'Reglatges', fr: 'Réglages' },
		son: { oc: 'Son', fr: 'Son' },
		tornarJogar: { oc: 'Tornar jogar', fr: 'Rejouer' },
		foto: { oc: (n, t) => `Fòto ${n} sus ${t}`, fr: (n, t) => `Photo ${n} sur ${t}` },
		fotos: { oc: (n) => `${n} fòtos`, fr: (n) => `${n} photos` },
		causir: { oc: 'Causís un tèma', fr: 'Choisis un thème' },
		cambiar: { oc: 'Cambiar de tèma', fr: 'Changer de thème' },
		pasAqui: { oc: 'Pas aquí.', fr: 'Pas ici.' },
		fin: { oc: 'Òsca !', fr: 'Bravo !' },
		seguenta: { oc: 'Fòto seguenta', fr: 'Photo suivante' },
		camp: { oc: 'La fòto', fr: 'La photo' },
		casa: { oc: (k, t) => `Casa ${k} sus ${t}`, fr: (k, t) => `Case ${k} sur ${t}` },
		tot: { oc: 'Tot', fr: 'Tout' }
	};

	const CLAU_SON = 'lo-ligam-jocs-son'; // partagé avec la sèrp et les paniers
	const CLAU_NIVEL = 'lo-ligam-ont-es-nivel'; // le réglage d'« Ont es… ? » est gardé
	const TOTAL = 5;
	const OPCIONS_TEMA = [
		{ id: null, vinheta: 'tot', nom: { oc: 'Tot', fr: 'Tout' }, n: PAISATGES.length },
		...TEMAS.map((t) => ({ id: t.id, vinheta: t.id, nom: { oc: t.nom.oc, fr: t.nom.fr }, n: PAISATGES.filter((p) => p.tema === t.id).length }))
	];

	let nivel = $state('amb');
	let tema = $state(null);
	let immersiu = $state(false);
	let son = $state(true);
	let calme = $state(false);
	let regObert = $state(false); // téléphone : les réglages dépliés
	let racina = $state();

	let partida = $state([]); // les photos de la partie (index dans PAISATGES)
	let pas = $state(0);
	let fase = $state('tria'); // 'tria' (choix du thème), 'joc', 'facha' (photo faite), 'fin'
	let tuiles = $state([]); // les mots de la photo, mélangés
	let pausats = $state([]); // les mots posés dans leur case
	let errors = $state({}); // mot → essais à côté
	let causit = $state(null); // le mot touché (sans glisser), qui attend sa case
	let tira = $state(null); // le mot qu'on fait glisser : { oc, x, y, ox, oy, w, h, actiu, pid, x0, y0 }
	let survol = $state(null); // la case sous le mot qu'on fait glisser
	let refus = $state(null); // { casa, mot, id } : la dernière mauvaise case
	let darrier = $state(null); // { oc, id } : le dernier mot posé (son français paraît)
	let rapel = $state(0); // une case touchée sans mot choisi : les tuiles se signalent
	let sautarClic = false;
	let seq = 0;

	let cadre = $state();
	let cw = $state(0);
	let ch = $state(0);
	let familha = $state('Luciole, system-ui, sans-serif');
	const casaEls = {};

	let anonci = $state([]);
	let finAnonci = 0;
	function anoncar(...tros) {
		anonci = [];
		clearTimeout(finAnonci);
		finAnonci = setTimeout(() => (anonci = tros), 60);
	}
	const lengaInterfacia = () => tria({ oc: 'oc', fr: 'fr' });

	const p = $derived(fase === 'joc' || fase === 'facha' ? PAISATGES[partida[pas]] : null);
	const nomTema = $derived(tria(OPCIONS_TEMA.find((o) => o.id === tema)?.nom ?? T.tot));
	const enPartida = $derived(!!p);
	const primier = (oc) => MOTS[oc].split(',')[0];

	// la taille des cases : le plus long mot de la photo, mesuré dans la police du jeu
	let mesura;
	function largorTexte(t, fs) {
		if (typeof document === 'undefined') return 0;
		mesura ??= document.createElement('canvas').getContext('2d');
		mesura.font = `700 ${fs}px ${familha}`;
		return mesura.measureText(t).width;
	}
	const talha = $derived.by(() => {
		if (!p || !cw) return null;
		const t = casaDe(Math.max(cw, ch), p.mots.map(([oc]) => oc.length));
		const mes = Math.max(...p.mots.map(([oc]) => largorTexte(oc, t.fs))) + 1.3 * t.fs;
		return { ...t, w: Math.ceil(Math.max(t.w, mes)) };
	});
	const casas = $derived(p && talha && ch ? plaçarCasas(p.mots, cw, ch, talha.w, talha.h) : []);

	function barrejar(t) {
		const a = [...t];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function precargar(k) {
		const q = PAISATGES[partida[k]];
		if (!q) return;
		const i = new Image();
		i.srcset = srcset(q);
		i.sizes = '(min-width: 52rem) 70vw, 100vw';
		i.src = camin(q.clau, q.amples[0]);
	}

	function començar() {
		partida = barrejar(PAISATGES.flatMap((q, k) => (!tema || q.tema === tema ? [k] : []))).slice(0, TOTAL);
		pas = 0;
		apreparar();
	}

	function jogar(id) {
		tema = id;
		començar();
	}

	function cambiarTema() {
		fase = 'tria';
		causit = null;
		tira = null;
		anoncar([tria(T.causir), lengaInterfacia()]);
	}

	function apreparar() {
		const q = PAISATGES[partida[pas]];
		tuiles = barrejar(q.mots.map(([oc]) => oc));
		pausats = [];
		errors = {};
		causit = null;
		refus = null;
		darrier = null;
		fase = 'joc';
		precargar(pas + 1);
		anoncar([tria(T.consigna), lengaInterfacia()], [tuiles.join(', ') + '.', 'oc']);
	}

	function causirNivel(id) {
		nivel = id;
		try {
			localStorage.setItem(CLAU_NIVEL, id);
		} catch {
			/* navigation privée */
		}
	}

	// un mot dans une case : la bonne, il y reste ; une autre, il revient
	function pausar(mot, casa) {
		if (fase !== 'joc' || pausats.includes(casa) || pausats.includes(mot)) return;
		causit = null;
		if (mot === casa) {
			pausats = [...pausats, mot];
			darrier = { oc: mot, id: ++seq };
			if (son) playNota(pausats.length + 1);
			anoncar([`${mot} :`, 'oc'], [`${MOTS[mot]}.`, 'fr']);
			if (pausats.length === p.mots.length) facha();
			return;
		}
		errors = { ...errors, [mot]: (errors[mot] ?? 0) + 1 };
		const id = ++seq;
		refus = { casa, mot, id };
		setTimeout(() => refus?.id === id && (refus = null), 500);
		if (son) playTick();
		anoncar([tria(T.pasAqui), lengaInterfacia()]);
	}

	async function facha() {
		fase = 'facha';
		if (son) playArpegi(5, 0.08, 0.25);
		anoncar([tria(T.fin), lengaInterfacia()], [p.mots.map(([oc]) => oc).join(', ') + '.', 'oc']);
		await tick();
		racina?.querySelector('.seguent')?.focus({ preventScroll: true });
	}

	function seguent() {
		if (pas + 1 >= TOTAL || pas + 1 >= partida.length) {
			fase = 'fin';
			anoncar([tria(T.fin), lengaInterfacia()]);
			if (son) setTimeout(playChime, 150);
			return;
		}
		pas++;
		apreparar();
	}

	// ── glisser une tuile (souris, doigt, stylet) ──
	function casaSota(x, y) {
		const r0 = cadre?.getBoundingClientRect();
		let melhor = null,
			d0 = 22;
		for (const c of casas) {
			if (pausats.includes(c.oc)) continue;
			const r = casaEls[c.oc]?.getBoundingClientRect();
			if (!r) continue;
			const dx = x - Math.min(Math.max(x, r.left), r.right),
				dy = y - Math.min(Math.max(y, r.top), r.bottom);
			let d = Math.hypot(dx, dy);
			if (r0) d = Math.min(d, Math.max(0, Math.hypot(x - r0.left - c.ax, y - r0.top - c.ay) - 12)); // ou sur son point
			if (d < d0) {
				d0 = d;
				melhor = c.oc;
			}
		}
		return melhor;
	}

	function prene(e, oc) {
		if (fase !== 'joc' || pausats.includes(oc) || e.button > 0) return;
		sautarClic = false;
		const r = e.currentTarget.getBoundingClientRect();
		tira = { oc, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, w: r.width, h: r.height, actiu: false, pid: e.pointerId };
		e.currentTarget.setPointerCapture?.(e.pointerId);
	}
	function menar(e) {
		if (!tira || e.pointerId !== tira.pid) return;
		tira.x = e.clientX;
		tira.y = e.clientY;
		if (!tira.actiu && Math.hypot(tira.x - tira.x0, tira.y - tira.y0) > 6) {
			tira.actiu = true;
			causit = null;
		}
		if (tira.actiu) survol = casaSota(tira.x, tira.y);
	}
	function daissar(e) {
		if (!tira || e.pointerId !== tira.pid) return;
		const t = tira;
		tira = null;
		survol = null;
		if (!t.actiu) return; // un simple toucher : le clic choisit le mot
		sautarClic = true;
		setTimeout(() => (sautarClic = false), 60);
		const c = casaSota(e.clientX, e.clientY);
		if (c) pausar(t.oc, c);
	}
	function anullar() {
		tira = null;
		survol = null;
	}

	// toucher (ou Entrée) : le mot attend sa case ; encore : il se repose
	function triarMot(oc) {
		if (sautarClic) {
			sautarClic = false;
			return;
		}
		if (fase !== 'joc' || pausats.includes(oc)) return;
		causit = causit === oc ? null : oc;
		if (causit) anoncar([`${oc}`, 'oc'], ...(nivel === 'amb' ? [[`${primier(oc)}.`, 'fr']] : []));
	}
	function tocarCasa(oc) {
		if (fase !== 'joc' || pausats.includes(oc)) return;
		if (causit) return pausar(causit, oc);
		rapel++;
		anoncar([tria(T.consigna), lengaInterfacia()]);
	}

	function clavier(e) {
		if (e.key === 'Escape' && causit) {
			causit = null;
			e.stopPropagation();
		}
	}

	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {
			/* navigation privée */
		}
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		familha = getComputedStyle(racina).fontFamily || familha;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
			if (localStorage.getItem(CLAU_NIVEL) === 'sens') nivel = 'sens';
		} catch {
			/* rien de gardé */
		}
		// la police chargée après coup change la largeur des mots : on remesure
		document.fonts?.ready.then(() => (familha = getComputedStyle(racina).fontFamily + ' '));
		return () => clearTimeout(finAnonci);
	});
</script>

<svelte:window onkeydown={clavier} />

<section class="joc pausa-mots" class:immersiu class:calme aria-labelledby="titol-pausa" bind:this={racina}>
	<div class="marc" class:enpartida={enPartida || fase === 'fin'}>
		<header class="cap">
			<h2 id="titol-pausa" lang="oc">Pausa los mots</h2>
			{#if fase !== 'tria'}
				<div class="avancament">
					<p class="compte">{nomTema} · {tria(T.foto)(Math.min(pas + 1, TOTAL), Math.min(TOTAL, partida.length))}</p>
					<span class="granas" aria-hidden="true"
						>{#each partida as k, i (k)}<i class:facha={i < pas || (i === pas && fase !== 'joc')} class:ara={i === pas && fase === 'joc'}></i>{/each}</span
					>
				</div>
			{/if}
			<BotonEcran bind:actiu={immersiu} cibla={racina} />
		</header>

		<div class="taula">
			{#if fase === 'tria'}
				<div class="causida">
					<p class="causida-titol">{tria(T.causir)}</p>
					<ul class="temas">
						{#each OPCIONS_TEMA as o (o.vinheta)}
							<li>
								<button type="button" class="tema" onclick={() => jogar(o.id)}>
									<img src="/apren/paisatges/tema-{o.vinheta}.webp" alt="" width="480" height="320" draggable="false" />
									<span class="tema-nom">{tria(o.nom)}</span>
									<span class="tema-n">{tria(T.fotos)(o.n)}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else if fase === 'fin'}
				<div class="fin">
					<p class="fin-oc" lang="oc">{tria(T.fin)}</p>
					<p class="fin-titol">{tria(T.mots)}</p>
					<ul class="resum">
						{#each [...new Set(partida.flatMap((k) => PAISATGES[k].mots.map(([oc]) => oc)))] as oc (oc)}
							<li><span lang="oc">{oc}</span> <span class="fr" lang="fr">{primier(oc)}</span></li>
						{/each}
					</ul>
					<div class="fin-accions">
						<button type="button" class="accion" onclick={començar}>{tria(T.tornarJogar)}</button>
						<button type="button" class="segond" onclick={cambiarTema}>{tria(T.cambiar)}</button>
					</div>
				</div>
			{:else if p}
				<div
					class="cadre"
					class:facha={fase === 'facha'}
					style:--r={p.l / p.h}
					style:--fs="{talha?.fs ?? 14}px"
					bind:this={cadre}
					bind:clientWidth={cw}
					bind:clientHeight={ch}
				>
					{#key p.clau}
						<img
							src={camin(p.clau, p.amples[0])}
							srcset={srcset(p)}
							sizes="(min-width: 52rem) 70vw, 100vw"
							width={p.l}
							height={p.h}
							alt={p.alt}
							draggable="false"
						/>
					{/key}
					<svg class="filets" width={cw} height={ch} aria-hidden="true">
						{#each casas as c (c.oc)}
							{#if Math.hypot(c.bx - c.ax, c.by - c.ay) > 13}
								<line x1={c.ax} y1={c.ay} x2={c.bx} y2={c.by} class:plena={pausats.includes(c.oc)} />
							{/if}
						{/each}
					</svg>
					{#each casas as c (c.oc)}
						<span class="ancora" class:plena={pausats.includes(c.oc)} style:left="{c.ax}px" style:top="{c.ay}px" aria-hidden="true"></span>
						{#if darrier?.oc === c.oc}
							{#key darrier.id}<span class="esclat" style:left="{c.ax}px" style:top="{c.ay}px" aria-hidden="true"></span>{/key}
						{/if}
					{/each}
					<div class="casas" role="group" aria-label={tria(T.camp)}>
						{#each casas as c, i (c.oc)}
							{@const plena = pausats.includes(c.oc)}
							<button
								type="button"
								class="casa"
								class:plena
								class:survol={survol === c.oc}
								class:espera={!!causit && !plena}
								class:indici={!plena && (errors[c.oc] ?? 0) >= 2}
								class:refus={refus?.casa === c.oc && !plena}
								style:left="{c.x}px"
								style:top="{c.y}px"
								style:width="{c.w}px"
								style:height="{c.h}px"
								aria-label={plena ? c.oc : tria(T.casa)(i + 1, casas.length)}
								aria-disabled={plena || fase !== 'joc'}
								bind:this={casaEls[c.oc]}
								onclick={() => tocarCasa(c.oc)}
							>
								{#if plena}<span lang="oc">{c.oc}</span>{/if}
								{#if refus?.casa === c.oc && !plena}{#key refus.id}<span class="tremol" aria-hidden="true"></span>{/key}{/if}
							</button>
							{#if plena && darrier?.oc === c.oc && fase === 'joc'}
								{#key darrier.id}<span class="trad-casa" lang="fr" style:left="{c.x + c.w / 2}px" style:top="{c.y + c.h}px" aria-hidden="true">{primier(c.oc)}</span>{/key}
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="mots">
			{#if fase === 'tria'}
				<p class="regla"><b lang="oc">{T.consigna.oc}</b> <span>{tria(T.cossi)}</span></p>
			{:else if enPartida}
				<p class="mots-titol">{tria(T.mots)}</p>
				<p class="mots-ajuda">{fase === 'facha' ? tria(T.fin) : tria(T.consigna)}</p>
				{#key rapel}
					<ul class="tuiles" class:rapel={rapel > 0}>
						{#each tuiles as oc (oc)}
							{@const pausat = pausats.includes(oc)}
							<li>
								<button
									type="button"
									class="tuile"
									class:pausat
									class:causit={causit === oc}
									class:enman={tira?.actiu && tira.oc === oc}
									class:torna={refus?.mot === oc}
									aria-pressed={pausat ? undefined : causit === oc}
									aria-disabled={pausat}
									onpointerdown={(e) => prene(e, oc)}
									onpointermove={menar}
									onpointerup={daissar}
									onpointercancel={anullar}
									onclick={() => triarMot(oc)}
								>
									<span class="oc" lang="oc">{oc}</span>
									{#if nivel === 'amb' || pausat}<span class="fr" lang="fr">{primier(oc)}</span>{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/key}
				{#if fase === 'facha'}
					<button type="button" class="accion seguent" onclick={seguent}
						>{pas + 1 >= Math.min(TOTAL, partida.length) ? tria(T.mots) : tria(T.seguenta)} ›</button
					>
				{/if}
			{/if}
		</div>

		<div class="comandas" class:obert={regObert}>
			<button type="button" class="obrir-reg" aria-expanded={regObert} onclick={() => (regObert = !regObert)}>
				{tria(T.reglatges)} <span aria-hidden="true">{regObert ? '▴' : '▾'}</span>
			</button>
			<div class="reg-panel">
				<Reglatges
					causida={{
						titol: tria(T.nivel),
						valor: nivel,
						causir: causirNivel,
						opcions: [
							{ id: 'amb', label: tria(T.amb) },
							{ id: 'sens', label: tria(T.sens) }
						]
					}}
					bascules={[{ id: 'son', label: tria(T.son), valor: son, bascular: bascularSon }]}
					titolOpcions={tria(T.reglatges)}
				>
					{#if enPartida}
						<button type="button" onclick={començar}>{tria(T.tornarJogar)}</button>
						<button type="button" onclick={cambiarTema}>{tria(T.cambiar)}</button>
					{/if}
				</Reglatges>
			</div>
		</div>
	</div>

	{#if tira?.actiu}
		<div class="tuile volant" style:left="{tira.x - tira.ox}px" style:top="{tira.y - tira.oy}px" style:width="{tira.w}px" aria-hidden="true">
			<span class="oc" lang="oc">{tira.oc}</span>
			{#if nivel === 'amb'}<span class="fr" lang="fr">{primier(tira.oc)}</span>{/if}
		</div>
	{/if}
	<p class="sr" aria-live="polite">{#each anonci as [t, l], k (k)}<span lang={l}>{t}</span>{' '}{/each}</p>
</section>

<style>
	.joc {
		container: joc / inline-size;
		height: 100%;
		--or: var(--t-aur);
		--aur-clar: #ffd47f;
		--sombre: rgba(8, 15, 17, 0.62);
	}
	/* téléphone : le titre, la photo (la hauteur qui reste), les mots, les
	   réglages repliés ; grand écran : la photo à gauche, la colonne à droite */
	.marc {
		height: 100%;
		min-height: 0;
		display: grid;
		gap: var(--esp-12) var(--esp-48);
		grid-template-rows: auto minmax(0, 1fr) auto auto;
		grid-template-areas: 'cap' 'taula' 'mots' 'comandas';
	}

	/* ── Mode plein : tout l'écran ── */
	.joc.immersiu {
		position: fixed;
		inset: 0;
		z-index: 30;
		height: auto;
		--m: clamp(0.75rem, 2vw, 1.5rem);
		padding: max(var(--m), env(safe-area-inset-top)) var(--m) max(var(--m), env(safe-area-inset-bottom));
		background: var(--t-fons);
	}

	.cap {
		grid-area: cap;
		display: flex;
		align-items: center;
		gap: var(--esp-8) var(--esp-16);
		min-width: 0;
	}
	.cap :global(.ecran) {
		margin-inline-start: auto;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.35rem;
		line-height: 1.05;
		color: var(--t-tinta);
	}
	.avancament {
		min-width: 0;
	}
	.compte {
		margin: 0;
		text-wrap: balance;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.granas {
		display: flex;
		gap: 0.25rem;
		margin-top: 0.3rem;
	}
	.granas i {
		width: 0.55rem;
		aspect-ratio: 1;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 40%, transparent);
		transition: background-color 0.3s;
	}
	.granas i.ara {
		box-shadow: inset 0 0 0 1.5px var(--or);
	}
	.granas i.facha {
		background: var(--or);
		box-shadow: none;
	}

	/* ── La photo : entière, aussi grande que la place le permet ── */
	.taula {
		grid-area: taula;
		container-type: size;
		min-height: 0;
		display: grid;
		place-items: center;
	}
	.cadre {
		position: relative;
		width: min(100cqw, 100cqh * var(--r));
		aspect-ratio: var(--r);
		border-radius: 0.2rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--t-tinta) 6%, var(--t-fons));
		user-select: none;
		-webkit-user-select: none;
		font-size: var(--fs);
		transition: box-shadow 0.6s;
	}
	/* la photo faite : un filet d'or tout autour */
	.cadre.facha {
		box-shadow: 0 0 0 2px var(--or);
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
		animation: dintrar 0.7s cubic-bezier(0.55, 0, 0.25, 1) both;
	}
	@keyframes dintrar {
		from {
			clip-path: circle(0% at 50% 50%);
		}
		to {
			clip-path: circle(75% at 50% 50%);
		}
	}
	.filets {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.filets line {
		stroke: var(--aur-clar);
		stroke-width: 1;
		filter: drop-shadow(0 0 1px rgba(4, 9, 11, 0.9));
	}
	/* le point d'or : la chose nommée */
	.ancora {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		translate: -50% -50%;
		border-radius: 50%;
		border: 1.5px solid var(--aur-clar);
		background: rgba(255, 212, 127, 0.12);
		box-shadow:
			0 0 0 1.5px rgba(4, 9, 11, 0.55),
			inset 0 0 0 1px rgba(4, 9, 11, 0.35);
		pointer-events: none;
		transition:
			background-color 0.3s,
			scale 0.3s;
	}
	.ancora.plena {
		background: var(--aur-clar);
		scale: 0.6;
	}
	.esclat {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
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

	/* la case : un cadre en tirets, sombre pour se lire sur le ciel comme sur
	   la pierre ; pleine, une tuile crème */
	.casa {
		position: absolute;
		display: grid;
		place-items: center;
		padding: 0 0.4em;
		border: 1.5px dashed var(--aur-clar);
		border-radius: 0.15em;
		background: var(--sombre);
		box-shadow: 0 0 0 1px rgba(4, 9, 11, 0.4);
		color: var(--b-tinta, #2a1a10);
		font: inherit;
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			scale 0.2s;
	}
	.casa.espera {
		border-style: solid;
	}
	.casa.survol {
		border-style: solid;
		background: rgba(255, 212, 127, 0.35);
		scale: 1.06;
	}
	.casa.plena {
		border: none;
		background: var(--b1, #efe1c6);
		box-shadow: var(--b-joint, none), 0 0 0 1px rgba(4, 9, 11, 0.35);
		cursor: default;
		animation: emplenar 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.cadre.facha .casa.plena {
		background: var(--b-dos, #ffd47f);
		transition: background-color 0.5s;
	}
	@keyframes emplenar {
		from {
			scale: 1.12;
			background-color: var(--aur-clar);
		}
	}
	.casa:focus-visible {
		outline: 2px solid var(--aur-clar);
		outline-offset: 2px;
	}
	/* après deux essais : la bonne case respire */
	.casa.indici {
		animation: respirar 1.4s ease-in-out infinite;
	}
	@keyframes respirar {
		50% {
			box-shadow:
				0 0 0 1px rgba(4, 9, 11, 0.4),
				0 0 0 4px rgba(255, 212, 127, 0.55);
		}
	}
	/* mauvaise case : elle tremble (un calque, pour ne pas déplacer la case) */
	.tremol {
		position: absolute;
		inset: -1.5px;
		border: 1.5px solid #f7f3ee;
		border-radius: inherit;
		pointer-events: none;
		animation: tremolar 0.4s ease-in-out forwards;
	}
	@keyframes tremolar {
		20% {
			translate: -3px 0;
		}
		60% {
			translate: 3px 0;
		}
		to {
			translate: 0 0;
			opacity: 0;
		}
	}
	/* le français du mot qu'on vient de poser, sous sa case, puis il s'efface */
	.trad-casa {
		position: absolute;
		translate: -50% 0.2em;
		padding: 0.1em 0.45em;
		border-radius: 0.1em;
		background: rgba(8, 15, 17, 0.78);
		color: #f7f3ee;
		font-size: 0.85em;
		font-style: italic;
		white-space: nowrap;
		pointer-events: none;
		animation: aparetre 2.6s ease forwards;
	}
	@keyframes aparetre {
		0% {
			opacity: 0;
		}
		12%,
		80% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	/* ── Les mots : des tuiles crème qu'on prend ── */
	.mots {
		grid-area: mots;
		min-width: 0;
	}
	.mots-titol {
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.mots-ajuda {
		margin: 0.3rem 0 0;
		line-height: 1.4;
		color: var(--t-tinta-2);
	}
	.tuiles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0.6rem 0 0;
		padding: 0;
		list-style: none;
	}
	.tuiles.rapel .tuile:not(.pausat) {
		animation: rapelar 0.5s ease-in-out;
	}
	@keyframes rapelar {
		40% {
			translate: 0 -4px;
		}
	}
	.tuile {
		display: grid;
		justify-items: start;
		gap: 0.1rem;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.45rem 0.8rem;
		border: none;
		border-radius: 0.1em;
		background: var(--b1, #efe1c6);
		box-shadow: var(--b-joint, none);
		color: var(--b-tinta, #2a1a10);
		font: inherit;
		text-align: start;
		line-height: 1.25;
		cursor: grab;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		transition:
			opacity 0.2s,
			translate 0.2s,
			box-shadow 0.2s;
	}
	.tuile .oc {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.tuile .fr {
		font-size: 0.88rem;
		font-style: italic;
		opacity: 0.8;
	}
	.tuile:hover:not(.pausat) {
		background: var(--b3, #f5ead6);
	}
	.tuile:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.tuile.causit {
		box-shadow:
			var(--b-joint, none),
			0 0 0 2.5px var(--or);
		translate: 0 -2px;
	}
	.tuile.enman {
		opacity: 0.3;
	}
	.tuile.torna {
		animation: tornar 0.4s ease-in-out;
	}
	@keyframes tornar {
		30% {
			translate: -4px 0;
		}
		70% {
			translate: 4px 0;
		}
	}
	/* posé : la tuile reste, en creux, avec son français */
	.tuile.pausat {
		background: none;
		box-shadow: inset 0 0 0 1px var(--t-linha);
		color: var(--t-tinta);
		cursor: default;
	}
	.tuile.pausat .fr {
		color: var(--t-tinta-2);
		opacity: 1;
	}
	/* la tuile qui suit le doigt */
	.tuile.volant {
		position: fixed;
		z-index: 60;
		pointer-events: none;
		rotate: -2deg;
		scale: 1.04;
	}
	.seguent {
		margin-top: var(--esp-16);
	}
	.regla {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.regla b {
		display: block;
		font-size: 1.1rem;
		color: var(--t-tinta);
	}
	@container joc (max-width: 51.99rem) {
		.tuile {
			width: auto;
			min-height: 2.5rem;
			padding: 0.35rem 0.65rem;
		}
		.tuile .oc {
			font-size: 1rem;
		}
		.mots-titol {
			display: none;
		}
		.mots-ajuda {
			margin: 0 0 0.4rem;
			font-size: 0.88rem;
			text-align: center;
		}
		.tuiles {
			margin: 0;
			justify-content: center;
		}
		.seguent {
			display: block;
			margin: var(--esp-12) auto 0;
		}
	}

	/* ── Le choix du thème : une vignette par thème, toutes visibles ── */
	.causida {
		width: min(100cqw, calc(3 * (100cqh - 9.5rem) + 2.25rem));
	}
	.causida-titol {
		margin: 0 0 var(--esp-12);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--t-tinta);
	}
	.temas {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-16) 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tema {
		display: grid;
		gap: 0.05rem;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		color: var(--t-tinta);
		text-align: start;
		cursor: pointer;
	}
	.tema img {
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		border-radius: 0.2rem;
		animation: none;
		transition: filter 0.25s;
	}
	.tema:hover img {
		filter: brightness(1.08);
	}
	.tema-nom {
		margin-top: 0.35rem;
		font-weight: 600;
		line-height: 1.25;
		text-decoration: underline 2px transparent;
		text-underline-offset: 0.25em;
		transition: text-decoration-color 0.2s;
	}
	.tema:hover .tema-nom,
	.tema:focus-visible .tema-nom {
		text-decoration-color: var(--t-accion);
	}
	.tema:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 3px;
		border-radius: 0.2rem;
	}
	.tema-n {
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}

	/* ── La fin : à la place de la photo, les mots de la partie ── */
	.fin {
		width: min(100%, 36rem);
		max-height: 100cqh;
		overflow: auto;
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		text-align: center;
	}
	.fin-oc {
		margin: 0;
		font-size: clamp(1.4rem, 5cqi, 2.2rem);
		font-weight: 600;
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
		margin: 0.3rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
		gap: 0.15rem 1rem;
		width: 100%;
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
	.fin-accions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--esp-8) var(--esp-16);
		margin-top: var(--esp-12);
	}

	/* ── Les réglages : en bas de la colonne ; repliés sur téléphone ── */
	.comandas {
		grid-area: comandas;
		min-width: 0;
	}
	.reg-panel {
		display: none;
	}
	.comandas.obert .reg-panel {
		display: block;
		margin-top: var(--esp-8);
	}
	.obrir-reg {
		min-height: 2.75rem;
		padding: 0 0.25rem;
		border: none;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		cursor: pointer;
	}
	.obrir-reg:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
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
	.segond {
		min-height: 2.75rem;
		padding: 0 0.25rem;
		border: none;
		background: none;
		color: var(--t-tinta);
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 0.25em;
		cursor: pointer;
	}
	.segond:focus-visible {
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
	@container joc (min-width: 52rem) {
		.marc {
			grid-template-columns: minmax(0, 1fr) 19rem;
			grid-template-rows: auto minmax(0, 1fr) auto;
			grid-template-areas: 'taula cap' 'taula mots' 'taula comandas';
		}
		.mots {
			overflow: auto;
			min-height: 0;
		}
		.comandas {
			padding-top: var(--esp-16);
			border-top: 1px solid var(--t-linha);
		}
		.obrir-reg {
			display: none;
		}
		.reg-panel {
			display: block !important;
		}
		h2 {
			font-size: clamp(1.6rem, 2vw, 2rem);
		}
		.cap {
			flex-wrap: wrap;
			align-items: flex-start;
		}
		.cap h2 {
			flex-basis: 100%;
		}
		/* les mots côte à côte, qui remplissent la ligne : sur un portable
		   (1280 × 720), tous restent visibles sans défiler */
		.tuiles > li {
			flex: 1 1 auto;
		}
	}
	/* téléphone : les huit thèmes tiennent sans défiler (vignettes plus basses,
	   le nom sur une ligne, sans le nombre de photos) ; la règle en une phrase */
	@container joc (max-width: 35.99rem) {
		.causida {
			width: min(100cqw, calc((100cqh - 9.5rem) * 1.25 + 0.6rem));
		}
		.causida-titol {
			margin-bottom: var(--esp-8);
			font-size: 1rem;
		}
		.temas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-8) 0.6rem;
		}
		.tema img {
			aspect-ratio: 5 / 2;
		}
		.tema-nom {
			margin-top: 0.2rem;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-size: 0.92rem;
		}
		.tema-n,
		.regla span {
			display: none;
		}
		.regla b {
			font-size: 1rem;
		}
		/* en partie, l'onglet nomme déjà le jeu (comme La sèrp) : le titre
		   reste pour les lecteurs d'écran, l'avancée prend sa place */
		.enpartida h2 {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}
	.calme img,
	.calme .esclat,
	.calme .casa,
	.calme .tremol,
	.calme .tuile,
	.calme .trad-casa {
		animation: none !important;
	}
	.calme .esclat {
		display: none;
	}
	@media (prefers-reduced-motion: reduce) {
		img,
		.esclat,
		.casa,
		.tremol,
		.tuile {
			animation: none !important;
		}
	}
</style>
