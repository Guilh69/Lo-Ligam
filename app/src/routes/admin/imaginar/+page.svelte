<script>
	// Imaginar (2026-11-13) : Romain choisit une de ses photos, trace d'un geste l'endroit où il imagine quelque
	// chose (plaque de rue, enseigne, publicité, lettrage peint…), dit ce que c'est. La demande part dans la boîte
	// de l'IA (une note de Lo talhièr, table remarcas : aucune table nouvelle), qui fabrique ensuite le montage.
	// Sa décision, après trois plaques posées par l'IA au mauvais endroit : « il faut que je puisse dessiner un
	// emplacement avec ce que j'imagine, et ensuite tu codes ». Puis, le même jour : « il faut que l'outil soit
	// capable de mettre en place la bonne perspective et que je puisse choisir le style ». La page lit donc les
	// lignes de la photo, couche le tracé sur le mur (perspectiva.js) et y montre une esquisse dans le style choisi
	// (estils.js, Mostra.svelte). Les quatre coins qu'il voit partent avec la demande : le montage se fait dessus.
	// Données et format : $lib/imagina/emplacements.js.
	import { onMount, tick } from 'svelte';
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	import { TEMAS, camin, srcset, deTema } from '$lib/paisatges/paisatges.js';
	import { notas, cargarNotas, mandarNotaId } from '$lib/talhier/notas.svelte.js';
	import { PAGINA, NATURAS, nomNatura, codar, descodar, frasa, zonaNeta, pronGranda } from '$lib/imagina/emplacements.js';
	import { ESTILS, estilsDe, estilPerDefaut, nomEstil } from '$lib/imagina/estils.js';
	import { gris, segments, camera, preparar, vertical, paret, quadParet, grasilha, matrix3d, dins } from '$lib/imagina/perspectiva.js';
	import FOCALAS from '$lib/imagina/focales.json';
	import Mostra from '$lib/imagina/Mostra.svelte';

	let tema = $state('vila');
	let foto = $state.raw(null);
	let trac = $state(null); // le rectangle pendant qu'on le trace
	let zona = $state(null); // le rectangle posé, pas encore envoyé
	let natura = $state('placa');
	let estilId = $state(estilPerDefaut('placa'));
	let text = $state('');
	let nota = $state('');
	let mandant = $state(false);
	let messatge = $state('');
	let tela = $state();
	let ficha = $state();
	let tl = $state(0); // la photo à l'écran, en pixels
	let th = $state(0);
	let cursor = $state('crosshair');

	// La perspective : `mur` = ce que la photo dit (caméra, traits, verticale) ; null tant qu'on la lit, false si
	// la lecture a échoué. `phi` = de combien le mur tourne ; `auto` = ce que le calcul a trouvé à l'endroit tracé.
	let mur = $state.raw(null);
	let auto = $state.raw(null);
	let phi = $state(0);
	let reglat = $state(false); // Romain a tourné le mur lui-même
	let grilha = $state(false);
	let gest = null;

	onMount(cargarNotas);

	const lista = $derived(deTema(tema));
	// les emplacements déjà envoyés (toutes photos), puis ceux de la photo ouverte
	const mandadas = $derived(
		notas.lista
			.filter((r) => r.pagina === PAGINA)
			.map((r) => ({ r, e: descodar(r.cibla) }))
			.filter((x) => x.e)
			.sort((a, b) => a.r.id - b.r.id)
	);
	const perFoto = $derived(foto ? mandadas.filter((x) => x.e.foto === foto.clau) : []);
	const comptes = $derived.by(() => {
		const c = {};
		for (const x of mandadas) c[x.e.foto] = (c[x.e.foto] ?? 0) + 1;
		return c;
	});
	const exemple = $derived(NATURAS.find((n) => n.id === natura)?.exemple ?? '');
	const estils = $derived(estilsDe(natura));
	const estil = $derived(ESTILS.find((e) => e.id === estilId) ?? estils[0]);
	const mostrat = $derived(text.trim() || exemple || 'Texte');

	const rect = (z) => [
		[z[0], z[1]],
		[z[2], z[1]],
		[z[2], z[3]],
		[z[0], z[3]]
	];
	const punts = (q) => q.map((c) => c.join(',')).join(' ');
	const estilRect = (z) => `left:${z[0] * 100}%;top:${z[1] * 100}%;width:${(z[2] - z[0]) * 100}%;height:${(z[3] - z[1]) * 100}%`;

	// La forme couchée sur le mur : quatre coins et la vraie proportion du rectangle. Sans lecture de la photo, le tracé à plat.
	const forma = $derived.by(() => {
		if (!zona || !foto) return null;
		if (!mur) return { quad: rect(zona), proporcion: ((zona[2] - zona[0]) * foto.l) / ((zona[3] - zona[1]) * foto.h) };
		return quadParet(mur.cam, mur.dv, phi, zona);
	});
	// l'esquisse est dessinée à plat, haute de HD pixels, puis posée sur les quatre coins
	const HD = 160;
	const ld = $derived(forma ? Math.min(2600, Math.max(36, forma.proporcion * HD)) : 0);
	const pausada = $derived(
		forma && tl
			? matrix3d(
					ld,
					HD,
					forma.quad.map(([x, y]) => [x * tl, y * th])
				)
			: 'none'
	);
	const trachsGrilha = $derived(grilha && mur && zona ? grasilha(mur.cam, mur.dv, phi, zona) : []);
	const candidats = $derived(auto ? [auto.phi, ...auto.autras].map((p) => Math.round(p * 2) / 2) : []);
	const estatPerspectiva = $derived(
		mur === null
			? 'Lecture des lignes de la photo…'
			: mur === false
				? 'Les lignes de la photo n’ont pas pu être lues : la forme reste à plat.'
				: reglat
					? 'Réglée à la main.'
					: auto?.fisable
						? 'Calculée sur les lignes du mur.'
						: 'Peu de lignes sur ce mur : regarde la grille, et tourne le mur si elle ne le suit pas.'
	);

	function causir(p) {
		foto = p;
		zona = trac = auto = null;
		phi = 0;
		reglat = grilha = false;
		messatge = '';
		analisar(p);
	}

	// Lecture de la photo : ses traits droits, sa verticale. Une fois par photo, sur le grand fichier.
	async function analisar(p) {
		mur = null;
		try {
			const img = new Image();
			img.src = camin(p.clau, p.amples.at(-1));
			await img.decode();
			await new Promise((r) => setTimeout(r, 40)); // la photo s'affiche d'abord
			if (foto?.clau !== p.clau) return;
			const c = document.createElement('canvas');
			c.width = img.naturalWidth;
			c.height = img.naturalHeight;
			const ctx = c.getContext('2d', { willReadFrequently: true });
			ctx.drawImage(img, 0, 0);
			const d = ctx.getImageData(0, 0, c.width, c.height);
			const cam = camera(p, FOCALAS[p.clau]);
			const trachs = preparar(segments(gris(d.data, c.width, c.height), c.width, c.height), cam);
			if (foto?.clau !== p.clau) return;
			mur = { cam, trachs, dv: vertical(trachs).d };
			if (zona && !reglat) calcular();
		} catch {
			if (foto?.clau === p.clau) mur = false;
		}
	}

	// l'orientation du mur à l'endroit tracé
	function calcular() {
		reglat = false;
		if (!mur || !zona) return;
		auto = paret(mur.trachs, mur.cam, mur.dv, zona);
		phi = Math.round(auto.phi * 2) / 2;
	}
	function autraOrientacion() {
		const i = candidats.findIndex((c) => Math.abs(c - phi) < 0.3);
		const seg = (i + 1) % candidats.length;
		phi = candidats[seg];
		reglat = seg !== 0;
		grilha = true;
	}

	// Les gestes sur la photo (souris, doigt ou stylet) : tracer un rectangle ; puis déplacer la forme, ou tirer un coin.
	function punt(ev) {
		const b = tela.getBoundingClientRect();
		return [(ev.clientX - b.left) / b.width, (ev.clientY - b.top) / b.height];
	}
	function tocat(p, tactil) {
		if (forma && tl) {
			const prop = tactil ? 26 : 14;
			for (let i = 0; i < 4; i++) if (Math.hypot((forma.quad[i][0] - p[0]) * tl, (forma.quad[i][1] - p[1]) * th) < prop) return { mode: 'talha', coin: i };
			if (dins(forma.quad, p)) return { mode: 'moure' };
		}
		return { mode: 'trac' };
	}
	function comencar(ev) {
		if (ev.button) return; // bouton gauche ou doigt seulement
		const p = punt(ev);
		gest = { ...tocat(p, ev.pointerType === 'touch'), p0: p, z0: zona };
		if (gest.mode === 'trac') trac = zonaNeta([...p, ...p]);
		tela.setPointerCapture(ev.pointerId);
		messatge = '';
	}
	function moure(ev) {
		const p = punt(ev);
		if (!gest) {
			const m = tocat(p, false).mode;
			cursor = m === 'talha' ? 'nwse-resize' : m === 'moure' ? 'move' : 'crosshair';
			return;
		}
		const dx = p[0] - gest.p0[0],
			dy = p[1] - gest.p0[1];
		if (gest.mode === 'trac') trac = zonaNeta([...gest.p0, ...p]);
		else if (gest.mode === 'moure') {
			const [a, b, c, d] = gest.z0;
			const gx = Math.min(1 - c, Math.max(-a, dx)),
				gy = Math.min(1 - d, Math.max(-b, dy));
			zona = zonaNeta([a + gx, b + gy, c + gx, d + gy]);
		} else {
			// le coin saisi suit le doigt, le coin opposé ne bouge pas
			const [a, b, c, d] = gest.z0;
			const mobil = rect(gest.z0)[gest.coin],
				fixe = rect([a, b, c, d])[(gest.coin + 2) % 4];
			const z = zonaNeta([...fixe, mobil[0] + dx, mobil[1] + dy]);
			if (pronGranda(z)) zona = z;
		}
	}
	function acabar(ev) {
		if (!gest) return;
		const g = gest;
		gest = null;
		if (g.mode !== 'trac') return;
		const z = zonaNeta([...g.p0, ...punt(ev)]);
		trac = null;
		if (!pronGranda(z)) return; // un simple clic ne pose rien
		zona = z;
		calcular();
		// sur un écran étroit la fiche est sous la photo : on l'amène à l'écran (sans bouger si elle y est déjà)
		tick().then(() => ficha?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
	}
	function anullar() {
		if (gest && gest.mode !== 'trac') zona = gest.z0;
		gest = trac = null;
	}
	function escafar() {
		zona = auto = null;
		reglat = grilha = false;
	}

	async function mandar() {
		if (!zona || !forma) return;
		if (!text.trim() && !nota.trim()) {
			messatge = 'Écris ce que tu imagines ici, ou une précision.';
			return;
		}
		mandant = true;
		const perspectiva = !mur ? 'non calculée, forme à plat' : reglat ? `mur tourné à la main (${phi}°)` : `calculée sur les lignes du mur (${phi}°${auto?.fisable ? '' : ', peu de lignes'})`;
		const r = await mandarNotaId({
			pagina: PAGINA,
			cibla: codar({ foto: foto.clau, zona, natura, estil: estil.id, quad: forma.quad }),
			extrait: text,
			tèxte: frasa({ foto: foto.clau, natura, estil: estil.id, perspectiva, text, nota }),
			per: 'ia'
		});
		mandant = false;
		if (r.error) {
			messatge = r.error;
			return;
		}
		escafar();
		text = nota = '';
		messatge = 'Envoyé. Tu peux entourer un autre endroit.';
	}
</script>

<svelte:head>
	<title>Imaginar — Espaci d'administracion</title>
</svelte:head>

<section class="imaginar" aria-labelledby="imaginar-titol">
	<AdminTete
		oc="Imaginar"
		fr="imaginer"
		id="imaginar-titol"
		resume="Choisis une photo, entoure l’endroit où tu imagines quelque chose, dis ce que c’est et dans quel style. La forme se couche sur le mur ; la demande part chez l’IA, qui fabrique ensuite le montage."
	/>

	{#if !foto}
		<div class="temas" role="group" aria-label="Thème des photos">
			{#each TEMAS as t (t.id)}
				<button type="button" aria-pressed={tema === t.id} onclick={() => (tema = t.id)}><span lang="oc">{t.nom.oc}</span></button>
			{/each}
		</div>
		<ul class="planca">
			{#each lista as p (p.clau)}
				<li>
					<button type="button" onclick={() => causir(p)} aria-label="Choisir cette photo. {p.alt}">
						<img src={camin(p.clau, p.amples[0])} alt="" loading="lazy" decoding="async" />
						{#if comptes[p.clau]}<span class="n" title="Emplacements déjà demandés">{comptes[p.clau]}</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="retorn">
			<button type="button" class="ligam" onclick={() => (foto = null)}>Choisir une autre photo</button>
			<span class="guida">
				{#if zona}Tu peux déplacer la forme, tirer ses coins, ou entourer un autre endroit.{:else}Sur la photo : appuie, glisse, relâche, pour entourer l’endroit.{/if}
			</span>
		</p>

		<div class="obrador">
			<!-- surface de dessin : geste de pointeur, le formulaire à côté reste au clavier -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="tela"
				bind:this={tela}
				bind:clientWidth={tl}
				bind:clientHeight={th}
				style:aspect-ratio="{foto.l} / {foto.h}"
				style:flex-basis="calc(72vh * {foto.l / foto.h})"
				style:cursor
				onpointerdown={comencar}
				onpointermove={moure}
				onpointerup={acabar}
				onpointercancel={anullar}
			>
				<img srcset={srcset(foto)} sizes="(min-width: 1200px) 1100px, 96vw" src={camin(foto.clau, foto.amples[0])} alt={foto.alt} draggable="false" />
				{#if forma}
					<!-- l'esquisse dans le style choisi, posée sur les quatre coins -->
					<div class="pausat" style:width="{ld}px" style:height="{HD}px" style:transform={pausada} style:mix-blend-mode={estil.mescla ?? 'normal'} style:opacity={estil.opacitat ?? 1}>
						<Mostra {estil} text={mostrat} l={ld} h={HD} />
					</div>
				{/if}
				<svg class="sobre" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
					{#each trachsGrilha as g, i (i)}<line class="grilha-ombra" x1={g[0]} y1={g[1]} x2={g[2]} y2={g[3]} />{/each}
					{#each trachsGrilha as g, i (i)}<line class="grilha" x1={g[0]} y1={g[1]} x2={g[2]} y2={g[3]} />{/each}
					{#each perFoto as x (x.r.id)}<polygon class="mandada" points={punts(x.e.quad ?? rect(x.e.zona))} />{/each}
					{#if forma}<polygon class="nova" points={punts(forma.quad)} />{/if}
				</svg>
				{#each perFoto as x, i (x.r.id)}
					{@const c = (x.e.quad ?? rect(x.e.zona))[0]}
					<span class="numero" style:left="{c[0] * 100}%" style:top="{c[1] * 100}%">{i + 1}</span>
				{/each}
				{#if forma}
					{#each forma.quad as c, i (i)}<span class="punh" style:left="{c[0] * 100}%" style:top="{c[1] * 100}%"></span>{/each}
				{/if}
				{#if trac}<div class="trac" style={estilRect(trac)}></div>{/if}
			</div>

			<div class="costat">
				{#if zona}
					<form
						class="ficha"
						bind:this={ficha}
						onsubmit={(e) => {
							e.preventDefault();
							mandar();
						}}
					>
						<fieldset>
							<legend>Qu’est-ce que tu imagines ici ?</legend>
							{#each NATURAS as n (n.id)}
								<label class="causida"><input type="radio" name="natura" value={n.id} bind:group={natura} onchange={() => (estilId = estilPerDefaut(natura))} /> {n.fr}</label>
							{/each}
						</fieldset>

						<fieldset>
							<legend>Dans quel style ?</legend>
							<div class="estils">
								{#each estils as e (e.id)}
									<label class="estil">
										<input type="radio" name="estil" value={e.id} bind:group={estilId} />
										<span class="peira"><Mostra estil={e} text={e.id === 'liure' ? '…' : mostrat} l={128} h={54} /></span>
										<span class="nom">{e.fr}{#if e.detalh}<small>{e.detalh}</small>{/if}</span>
									</label>
								{/each}
							</div>
						</fieldset>

						<label class="camp">
							Le texte à y écrire, en français ou en occitan
							<input type="text" bind:value={text} maxlength="200" placeholder={exemple} autocomplete="off" />
						</label>

						<fieldset class="perspectiva">
							<legend>La perspective du mur</legend>
							<p class="estat" role="status">{estatPerspectiva}</p>
							{#if mur}
								<label class="causida"><input type="checkbox" bind:checked={grilha} /> Voir la grille du mur</label>
								<label class="camp virar">
									Tourner le mur
									<input
										type="range"
										min="-85"
										max="85"
										step="0.5"
										bind:value={phi}
										oninput={() => {
											reglat = true;
											grilha = true;
										}}
									/>
								</label>
								<div class="accions">
									{#if candidats.length > 1}<button type="button" class="ligam" onclick={autraOrientacion}>Essayer une autre orientation</button>{/if}
									{#if reglat}<button type="button" class="ligam" onclick={calcular}>Revenir au calcul</button>{/if}
								</div>
							{/if}
						</fieldset>

						<label class="camp">
							Une précision, si tu veux
							<textarea bind:value={nota} rows="3" maxlength="600" placeholder="Par exemple : ancienne, un peu rouillée, plus petite que la fenêtre"></textarea>
						</label>
						<div class="accions">
							<button type="submit" class="principal" disabled={mandant}>Envoyer à l’IA</button>
							<button type="button" class="ligam" onclick={escafar}>Effacer ce tracé</button>
						</div>
					</form>
				{/if}
				{#if messatge}<p class="messatge" role="status">{messatge}</p>{/if}

				{#if perFoto.length}
					<h2>Déjà demandé sur cette photo</h2>
					<ol class="mandadas">
						{#each perFoto as x (x.r.id)}
							<li>
								<strong>{nomNatura(x.e.natura)}</strong>{#if x.e.estil}, {nomEstil(x.e.estil).toLowerCase()}{/if}{#if x.r.extrait}{' '}: « {x.r.extrait} »{/if}
								<span class="estat">{x.r.estat === 'dubèrta' ? 'en attente' : x.r.estat === 'tractada' ? 'fait' : 'écarté'}</span>
								{#if x.r.responsa}<span class="responsa">{x.r.responsa}</span>{/if}
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	.imaginar {
		width: 100%;
		color: var(--t-tinta);
		font-family: var(--font-body);
	}
	button {
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible,
	input:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* les thèmes : du texte souligné, comme la bascule de la Constitution */
	.temas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.6rem;
		margin: 0 0 1.25rem;
	}
	.temas button {
		padding: 0.35rem 0;
		color: var(--t-tinta-2);
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
	}
	.temas button:hover,
	.temas button[aria-pressed='true'] {
		color: var(--t-tinta);
	}
	.temas button[aria-pressed='true'] {
		border-bottom-color: var(--t-aur);
	}

	/* la planche : des vignettes carrées, sans cadre */
	.planca {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.planca button {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		padding: 0;
		background: var(--t-linha);
		border: 0;
	}
	.planca img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.planca button:hover img {
		opacity: 0.86;
	}
	.planca .n {
		position: absolute;
		top: 0;
		left: 0;
		min-width: 1.5rem;
		padding: 0.1rem 0.35rem;
		font-size: 0.85rem;
		color: var(--t-accion-tinta);
		background: var(--t-accion);
	}

	.retorn {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.6rem;
		margin: 0 0 0.75rem;
	}
	.ligam {
		padding: 0;
		color: var(--t-tinta);
		background: none;
		border: 0;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	/* la photo, et la fiche juste à côté d'elle (dessous quand la place manque) */
	.obrador {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem 2rem;
		align-items: flex-start;
	}
	.costat {
		flex: 1 1 18rem;
		max-width: 26rem;
		min-width: 0;
	}

	.tela {
		flex: 0 1 auto;
		max-width: 100%;
		position: relative;
		overflow: hidden;
		touch-action: none; /* le doigt trace, il ne fait pas défiler */
		-webkit-user-select: none;
		user-select: none;
		background: var(--t-linha);
	}
	.tela img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
	}
	/* tout ce qui est posé sur la photo laisse passer le geste ; grille, contours et poignées y sont en blanc et
	   noir neutres (hors palette, comme les dessins) : ils doivent se lire sur toute photo, pas suivre le thème */
	.pausat,
	.sobre,
	.numero,
	.punh,
	.trac {
		position: absolute;
		pointer-events: none;
	}
	.pausat {
		top: 0;
		left: 0;
		transform-origin: 0 0;
	}
	.sobre {
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.sobre line,
	.sobre polygon {
		fill: none;
		vector-effect: non-scaling-stroke;
	}
	.grilha-ombra {
		stroke: rgba(0, 0, 0, 0.3);
		stroke-width: 3;
	}
	.grilha {
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 1;
	}
	.nova {
		stroke: var(--p-brique);
		stroke-width: 1.5;
	}
	.mandada {
		stroke: #fff;
		stroke-width: 1.5;
		filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.8));
	}
	.numero {
		padding: 0 0.3rem;
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--t-tinta);
		background: var(--t-fons);
		transform: translate(-1px, -100%);
	}
	.punh {
		width: 11px;
		height: 11px;
		box-sizing: border-box;
		background: #fff;
		border: 2px solid var(--p-brique);
		transform: translate(-50%, -50%);
	}
	.trac {
		box-sizing: border-box;
		border: 2px dashed var(--p-brique);
		background: color-mix(in srgb, var(--p-brique) 14%, transparent);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
	}

	.guida {
		color: var(--t-tinta-2);
	}
	.ficha fieldset {
		margin: 0 0 1.1rem;
		padding: 0;
		border: 0;
	}
	.ficha legend {
		margin-bottom: 0.4rem;
		padding: 0;
		font-weight: 700;
	}
	/* (.ficha devant : le gabarit de l'administration met tous les libellés en colonne et en gras) */
	.ficha .causida {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.55rem;
		padding: 0.25rem 0;
		font-size: 1rem;
		font-weight: 400;
		cursor: pointer;
	}
	.ficha .camp {
		font-size: 1rem;
	}
	.causida input {
		flex: none;
		width: 1.05rem;
		height: 1.05rem;
		margin: 0;
		accent-color: var(--p-brique);
	}

	/* les styles : un échantillon sur fond de pierre, son nom dessous ; le choisi est souligné de brique */
	.estils {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.9rem 0.8rem;
	}
	.ficha .estil {
		display: block;
		font-size: 0.9rem;
		font-weight: 400;
		line-height: 1.3;
		cursor: pointer;
	}
	.estil input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	/* la pierre sous les échantillons de style fait partie du dessin (hors palette, comme les couleurs de estils.js) */
	.peira {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 66px;
		margin-bottom: 0.3rem;
		background: #c9bca4;
		border-bottom: 3px solid transparent;
	}
	.estil input:checked + .peira {
		border-bottom-color: var(--p-brique);
	}
	.estil input:focus-visible + .peira {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.estil input:checked ~ .nom {
		font-weight: 700;
	}
	.nom small {
		display: block;
		font-size: 0.85em;
		font-weight: 400;
		color: var(--t-tinta-2);
	}

	.perspectiva .estat {
		margin: 0 0 0.35rem;
		color: var(--t-tinta-2);
	}
	.ficha .virar {
		margin: 0.5rem 0 0.4rem;
		font-weight: 400;
	}
	.virar input {
		display: block;
		width: 100%;
		margin-top: 0.3rem;
		padding: 0;
		accent-color: var(--p-brique);
	}

	.camp {
		display: block;
		margin: 0 0 1rem;
		font-weight: 700;
	}
	.ficha .camp input[type='text'],
	.ficha .camp textarea {
		display: block;
		width: 100%;
		box-sizing: border-box;
		margin-top: 0.3rem;
		padding: 0.5rem 0.6rem;
		font: inherit;
		font-weight: 400;
		color: inherit;
		background: transparent;
		border: 1px solid var(--t-tinta-2);
		border-radius: 2px;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.25rem;
		align-items: center;
	}
	.principal {
		padding: 0.6rem 1.1rem;
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		border: 0;
		border-radius: 3px;
	}
	.principal:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.messatge {
		margin: 0.9rem 0 0;
	}
	.costat h2 {
		margin: 1.75rem 0 0.4rem;
		padding-top: 0.75rem;
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 700;
		border-top: 1px solid var(--t-linha);
	}
	.mandadas {
		margin: 0;
		padding-left: 1.4rem;
		line-height: 1.5;
	}
	.mandadas li {
		margin-bottom: 0.4rem;
	}
	.mandadas .estat {
		margin-left: 0.4rem;
		color: var(--t-tinta-2);
	}
	.responsa {
		display: block;
		color: var(--t-tinta-2);
	}
</style>
