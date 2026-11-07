<script>
	// Poser les mots sur une photo, dans une carte de Triar (lot « pausar »,
	// Romain, 07-11 : « une possibilité d'écrire les mots et ajouter les
	// ronds »). On touche la photo : un rond naît là, on écrit (ou dicte) son
	// mot. On touche un rond : on change son mot ; on le fait glisser : il se
	// déplace. Les gestes restent dans la carte : elle ne part pas, on la
	// renvoie avec ses boutons. Chaque changement remonte par onmots, en
	// [occitan, français, x, y] (x et y en fraction de la photo, comme dans
	// ./paisatges.js). La carte de derrière (viu = false) reste une image fixe.
	//
	// Le mot se choisit dans une recherche (Romain, 07-11 : « une barre de
	// recherche… taper le mot en français ou en occitan… connectée à l'API du
	// Congrès, comme ça je peux choisir directement en étant sûr de la
	// véracité ») : les mots déjà sur le site viennent pendant la frappe, lo
	// Basic à la demande (/api/congres/cercar, réservé à l'administrateur).
	// Choisi, le rond ne montre plus que le mot et sa traduction en italique.
	// font : d'où vient le mot (basic, site, man = écrit à la main).
	//
	// Romain, 07-11 : « modifier ceux présents en double cliquant » (un double
	// toucher sur le rond ou sur son mot : la recherche s'ouvre avec ce mot,
	// prêt à être remplacé) et « un plein écran pour voir mieux » (la photo
	// aussi grande que l'écran, la recherche à côté ou dessous).
	import { tick, untrack } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { camin, srcset, MOTS } from './paisatges.js';

	let { foto, mots = [], viu = true, onmots = () => {} } = $props();

	let n = 0; // une clé stable par rond
	let ronds = $state(untrack(() => mots.map(([oc, fr, x, y, font]) => ({ id: n++, oc, fr, x, y, font: font ?? (MOTS[oc] ? 'site' : 'man') }))));
	let causit = $state(null); // l'id du rond choisi
	let camp = $state(null);
	let zona = $state(null);
	let tira = null; // { id, x0, y0, bolegat }
	let darrièrTòc = { id: null, t: 0 }; // pour reconnaître un double toucher
	let gran = $state(false); // le plein écran
	let ecranComplet = false; // le navigateur est passé en plein écran pour nous

	let rond = $derived(ronds.find((d) => d.id === causit) ?? null);
	let comptats = $derived(ronds.filter((d) => d.oc.trim()).length);

	// les mots déjà connus, proposés pendant qu'on écrit (avec leurs accents)
	const LEXIC = Object.keys(MOTS).sort((a, b) => a.localeCompare(b, 'oc'));
	const LISTA = `pausar-lexic-${foto.clau}`;

	// la règle du jeu : deux points d'une même photo ne se touchent pas
	// (distance en fraction du grand côté, comme dans paisatges.test.js)
	const r = foto.l / Math.max(foto.l, foto.h),
		q = foto.h / Math.max(foto.l, foto.h);
	const tropPròche = (a) => ronds.find((b) => b !== a && b.oc.trim() && Math.hypot((a.x - b.x) * r, (a.y - b.y) * q) <= 0.12);
	const doble = (a) => ronds.some((b) => b !== a && b.oc.trim() === a.oc.trim());

	const mandar = () => onmots(ronds.filter((d) => d.oc.trim()).map((d) => [d.oc.trim(), d.fr.trim(), d.x, d.y, d.font]));

	// ── la recherche ──
	let consulta = $state('');
	let cerca = $state({ estat: 'void', terme: '', resultats: [] }); // void | cargament | ok | sens-clau | error
	const nuda = (s) =>
		s
			.normalize('NFD')
			.replace(/\p{M}/gu, '')
			.toLowerCase()
			.replace(/^(l[’']|lo |la |los |las |le |les )/, '')
			.trim();
	// les mots du site, pendant la frappe (le début du mot, en occitan ou en français)
	let locals = $derived.by(() => {
		const t = nuda(consulta);
		if (t.length < 2) return [];
		return LEXIC.filter((oc) => nuda(oc).startsWith(t) || MOTS[oc].split(/,\s*/).some((f) => nuda(f).startsWith(t)))
			.slice(0, 6)
			.map((oc) => ({ oc, fr: MOTS[oc], font: 'site' }));
	});
	let basics = $derived(cerca.estat === 'ok' && cerca.terme === consulta.trim() ? cerca.resultats : []);

	async function cercar(e) {
		e?.preventDefault();
		const q = consulta.trim();
		// lo Basic connaît le mot sans son article (« la mer » → mer)
		const terme = q.replace(/^(l[’']|lo |la |los |las |le |les )/i, '').trim();
		if (terme.length < 2 || cerca.estat === 'cargament') return;
		cerca = { estat: 'cargament', terme: q, resultats: [] };
		let r = { estat: 'error', terme: q, resultats: [] };
		try {
			const { data } = await supabase.auth.getSession();
			const jeton = data?.session?.access_token;
			const res = await fetch(`/api/congres/cercar?q=${encodeURIComponent(terme)}`, { headers: jeton ? { Authorization: `Bearer ${jeton}` } : {} });
			const d = await res.json();
			if (res.ok) r = { estat: 'ok', terme: q, resultats: d.resultats.map((x) => ({ ...x, font: 'basic' })) };
			else if (d.error === 'sens-clau') r.estat = 'sens-clau';
		} catch {
			/* reste « error » */
		}
		cerca = r;
	}

	async function causirMot(t) {
		rond.oc = t.oc;
		rond.fr = t.fr;
		rond.font = t.font;
		consulta = '';
		cerca = { estat: 'void', terme: '', resultats: [] };
		causit = null; // il ne reste que le mot et sa traduction
		mandar();
	}
	const fontDe = (t) => (t.font === 'site' ? 'déjà sur le site' : t.var === 'lengadoc' ? 'lo Basic · languedocien' : 'lo Basic · occitan commun');

	const bòrna = (v) => Math.round(Math.min(0.97, Math.max(0.03, v)) * 1000) / 1000;
	const lòc = (e) => {
		const b = zona.getBoundingClientRect();
		return [bòrna((e.clientX - b.left) / b.width), bòrna((e.clientY - b.top) / b.height)];
	};

	async function causir(id, focus = false) {
		if (causit !== id) {
			consulta = '';
			cerca = { estat: 'void', terme: '', resultats: [] };
		}
		causit = id;
		if (!focus) return;
		await tick();
		camp?.focus();
	}

	function abaissar(e) {
		if (!viu || e.button > 0) return;
		const id = e.target.closest('[data-rond]')?.dataset.rond;
		// l'écart entre le doigt et le rond (pris par son étiquette, il ne saute pas)
		const d = id == null ? null : ronds.find((x) => x.id === Number(id));
		const b = zona.getBoundingClientRect();
		const dx = d ? d.x - (e.clientX - b.left) / b.width : 0,
			dy = d ? d.y - (e.clientY - b.top) / b.height : 0;
		tira = { id: id == null ? null : Number(id), x0: e.clientX, y0: e.clientY, dx, dy, bolegat: false };
		zona.setPointerCapture(e.pointerId);
	}
	function bolegar(e) {
		if (!tira) return;
		if (Math.hypot(e.clientX - tira.x0, e.clientY - tira.y0) > 6) tira.bolegat = true;
		if (!tira.bolegat || tira.id == null) return;
		const d = ronds.find((d) => d.id === tira.id);
		if (!d) return;
		const b = zona.getBoundingClientRect();
		d.x = bòrna((e.clientX - b.left) / b.width + tira.dx);
		d.y = bòrna((e.clientY - b.top) / b.height + tira.dy);
		if (causit !== d.id) causir(d.id); // un autre rond : la recherche repart de zéro
	}
	function levar(e) {
		if (!tira) return;
		const t = tira;
		tira = null;
		if (t.id != null) {
			if (t.bolegat) {
				mandar();
				causir(t.id);
				return;
			}
			// deux touchers rapprochés sur le même rond : on change son mot
			const ara = performance.now();
			if (darrièrTòc.id === t.id && ara - darrièrTòc.t < 450) {
				darrièrTòc = { id: null, t: 0 };
				modificar(t.id);
			} else {
				darrièrTòc = { id: t.id, t: ara };
				causir(t.id);
			}
		} else if (!t.bolegat) {
			// un toucher sur la photo : un rond naît là
			const [x, y] = lòc(e);
			ronds.push({ id: n, oc: '', fr: '', x, y, font: 'man' });
			causir(n++, true);
		}
	}

	/** Changer le mot d'un rond : la recherche s'ouvre avec ce mot, sélectionné. */
	async function modificar(id) {
		const d = ronds.find((x) => x.id === id);
		causit = id;
		consulta = d?.oc.trim() ? d.oc.trim().replace(/^(l[’']|lo |la |los |las )/i, '') : '';
		cerca = { estat: 'void', terme: '', resultats: [] };
		await tick();
		camp?.focus();
		camp?.select();
	}

	// ── le plein écran : la carte passe au bout de la page (dans la carte qui
	// bouge et tourne, « fixed » ne couvrirait pas l'écran), et le navigateur
	// passe en plein écran quand il le permet ──
	const portal = (node) => {
		if (!gran) return;
		const pair = node.parentNode,
			seguent = node.nextSibling;
		document.body.appendChild(node);
		// la page de dessous ne défile plus
		const html = document.documentElement,
			abans = html.style.overflow;
		html.style.overflow = 'hidden';
		return () => {
			html.style.overflow = abans;
			try {
				pair.insertBefore(node, seguent);
			} catch {
				node.remove();
			}
		};
	};
	async function bascular() {
		gran = !gran;
		try {
			if (gran && !document.fullscreenElement) {
				await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
				ecranComplet = Boolean(document.fullscreenElement);
			} else if (!gran && ecranComplet && document.fullscreenElement) {
				ecranComplet = false;
				await document.exitFullscreen();
			}
		} catch {
			/* sans plein écran du navigateur, le calque couvre quand même la fenêtre */
		}
	}
	$effect(() => {
		// Échap dans le navigateur quitte son plein écran : le nôtre se ferme avec
		const sortir = () => {
			if (!document.fullscreenElement && ecranComplet) {
				ecranComplet = false;
				gran = false;
			}
		};
		document.addEventListener('fullscreenchange', sortir);
		return () => {
			document.removeEventListener('fullscreenchange', sortir);
			if (ecranComplet && document.fullscreenElement) document.exitFullscreen().catch(() => {});
		};
	});
	// Échap ferme le plein écran (après avoir refermé la recherche, s'il y en a une)
	const teclaFenestra = (e) => {
		if (gran && e.key === 'Escape' && !e.defaultPrevented) {
			e.preventDefault();
			if (causit !== null) causit = null;
			else bascular();
		}
	};

	function apondre() {
		ronds.push({ id: n, oc: '', fr: '', x: 0.5, y: 0.5, font: 'man' });
		causir(n++, true);
	}
	function levarRond() {
		ronds = ronds.filter((d) => d.id !== causit);
		causit = null;
		mandar();
	}
	function escriure(e) {
		// l'apostrophe droite devient celle du site (« l’aiga »)
		rond.oc = e.target.value.replace(/'/g, '’');
		// un mot déjà connu : son français vient avec
		const fr = MOTS[rond.oc.trim()];
		if (fr) rond.fr = fr;
		rond.font = fr ? 'site' : 'man';
		mandar();
	}
	function traduire(e) {
		rond.fr = e.target.value;
		if (rond.font === 'basic') rond.font = 'man';
		mandar();
	}
	function teclaForma(e) {
		if (e.key === 'Escape' || e.key === 'Enter') {
			e.preventDefault();
			causit = null;
		}
	}
	// au clavier : les flèches déplacent le rond choisi (et pas la carte)
	function teclaRond(e, d) {
		const pas = e.shiftKey ? 0.05 : 0.01;
		const m = { ArrowLeft: [-pas, 0], ArrowRight: [pas, 0], ArrowUp: [0, -pas], ArrowDown: [0, pas] }[e.key];
		if (!m) return;
		e.preventDefault();
		e.stopPropagation();
		d.x = bòrna(d.x + m[0]);
		d.y = bòrna(d.y + m[1]);
		causit = d.id;
		mandar();
	}
	const costat = (x) => (x > 0.72 ? 'drecha' : x < 0.28 ? 'esquerra' : '');
</script>

<svelte:window onkeydown={teclaFenestra} />

<!-- les gestes restent ici : la carte de Triar ne glisse pas -->
<div
	class="pausar"
	class:gran
	onpointerdown={(e) => viu && e.stopPropagation()}
	role={gran ? 'dialog' : 'presentation'}
	aria-modal={gran ? 'true' : undefined}
	aria-label={gran ? 'Poser les mots, en plein écran' : undefined}
	{@attach portal}
>
	{#if viu}
		<div class="barra">
			<span class="compte">{comptats} {comptats > 1 ? 'mots' : 'mot'}</span>
			<button type="button" class="b-barra" onclick={apondre}>Ajouter un mot</button>
			<button type="button" class="b-barra b-gran" onclick={bascular} aria-pressed={gran}>
				<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					{#if gran}<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />{:else}<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />{/if}
				</svg>
				{gran ? 'Quitter le plein écran' : 'Plein écran'}
			</button>
		</div>
	{/if}
	<div class="cadre">
	<div
		class="foto"
		class:viu
		bind:this={zona}
		style:aspect-ratio="{foto.l} / {foto.h}"
		style:--l={foto.l / foto.h}
		onpointerdown={abaissar}
		onpointermove={bolegar}
		onpointerup={levar}
		onpointercancel={() => (tira = null)}
		role="presentation"
	>
		<img
			src={camin(foto.clau, foto.amples[0])}
			srcset={srcset(foto)}
			sizes={gran ? '100vw' : '(max-width: 32rem) 100vw, 30rem'}
			alt={viu ? foto.alt : ''}
			draggable="false"
		/>
		{#each ronds as d (d.id)}
			{#if viu}
				<button
					type="button"
					class="rond"
					class:causit={d.id === causit}
					class:void={!d.oc.trim()}
					data-rond={d.id}
					style:left="{d.x * 100}%"
					style:top="{d.y * 100}%"
					onclick={() => causir(d.id)}
					onkeydown={(e) => teclaRond(e, d)}
					aria-label={d.oc.trim() ? `${d.oc}, changer ou déplacer (flèches)` : 'Rond sans mot'}
				></button>
				{#if d.oc.trim()}
					<!-- le mot et sa traduction en italique, comme dans Remira ; on le touche comme le rond -->
					<span
						class="nom {costat(d.x)}"
						class:naut={d.y > 0.78}
						data-rond={d.id}
						style:left="{d.x * 100}%"
						style:top="{d.y * 100}%"
						aria-hidden="true"
						><span class="n-oc" lang="oc">{d.oc}</span>{#if d.fr.trim()}<span class="n-filet"></span><span class="n-fr" lang="fr">{d.fr}</span>{/if}</span
					>
				{/if}
			{:else}
				<span class="rond" style:left="{d.x * 100}%" style:top="{d.y * 100}%" aria-hidden="true"></span>
			{/if}
		{/each}
	</div>
	</div>

	{#if viu}
		<div class="costat">
		{#if rond}
			<div class="forma">
				<!-- la recherche : en français ou en occitan ; Entrée ou « Chercher » interroge lo Basic -->
				<form class="cerca" role="search" onsubmit={cercar}>
					<label for="cerca-{foto.clau}">Cherche le mot, en français ou en occitan</label>
					<div class="cerca-linha">
						<input
							id="cerca-{foto.clau}"
							type="search"
							bind:this={camp}
							bind:value={consulta}
							onkeydown={(e) => e.key === 'Escape' && (e.preventDefault(), (causit = null))}
							placeholder="nuage, nívol…"
							autocomplete="off"
							spellcheck="false"
							maxlength="60"
						/>
						<button type="submit" class="b-cercar" disabled={consulta.trim().length < 2 || cerca.estat === 'cargament'}>Chercher</button>
					</div>
				</form>
				{#if locals.length || basics.length}
					<ul class="trobats" aria-label="Mots trouvés">
						{#each [...basics, ...locals.filter((l) => !basics.some((b) => b.oc === l.oc))] as t (t.font + t.oc + t.fr)}
							<li>
								<button type="button" onclick={() => causirMot(t)}>
									<span class="t-oc" lang="oc">{t.oc}</span>
									<em class="t-fr" lang="fr">{t.fr}</em>
									<span class="t-font">{fontDe(t)}</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
				<p class="estat" aria-live="polite">
					{#if cerca.estat === 'cargament'}Je cherche « {cerca.terme} » dans lo Congrès…
					{:else if cerca.estat === 'ok' && !cerca.resultats.length && cerca.terme === consulta.trim()}Rien dans lo Basic pour « {cerca.terme} » : essaie le mot entier, ou dans l’autre langue.
					{:else if cerca.estat === 'sens-clau'}La recherche dans lo Congrès n’est pas encore branchée en ligne : les mots déjà sur le site restent proposés.
					{:else if cerca.estat === 'error'}Lo Congrès ne répond pas pour l’instant ; réessaie dans un moment.{/if}
				</p>
				{#if rond.oc.trim()}
					<p class="actual">Sur ce rond : <span lang="oc">{rond.oc}</span>{#if rond.fr.trim()}{' · '}<em>{rond.fr}</em>{/if}</p>
				{/if}
				<details class="man">
					<summary>Écrire le mot à la main</summary>
					<label>
						<span>Le mot en occitan, avec son article</span>
						<input value={rond.oc} oninput={escriure} onkeydown={teclaForma} list={LISTA} lang="oc" placeholder="la mar" autocomplete="off" spellcheck="false" maxlength="80" />
					</label>
					<label>
						<span>En français</span>
						<input value={rond.fr} oninput={traduire} onkeydown={teclaForma} placeholder="la mer" autocomplete="off" maxlength="80" />
					</label>
				</details>
				{#if rond.oc.trim() && doble(rond)}
					<p class="avis">« <span lang="oc">{rond.oc.trim()}</span> » est déjà sur cette photo : un mot n’y paraît qu’une fois.</p>
				{:else if rond.oc.trim() && tropPròche(rond)}
					<p class="avis">Trop près de « <span lang="oc">{tropPròche(rond).oc}</span> » pour le jeu : écarte-les un peu.</p>
				{/if}
				<div class="b-forma">
					<button type="button" class="b-levar" onclick={levarRond}>Retirer ce rond</button>
					<button type="button" class="b-fach" onclick={() => (causit = null)}>C’est bon</button>
				</div>
			</div>
		{:else}
			<p class="ajuda">Touche la photo pour poser un rond. Touche deux fois un mot pour le changer, fais-le glisser pour le déplacer.</p>
		{/if}
		<datalist id={LISTA}>
			{#each LEXIC as oc (oc)}<option value={oc}>{MOTS[oc]}</option>{/each}
		</datalist>
		</div>
	{/if}
</div>

<style>
	.pausar {
		width: 100%;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		cursor: auto;
	}
	/* la photo entière, jamais plus haute que la moitié de l'écran */
	.foto {
		position: relative;
		width: min(100%, calc(52vh * var(--l)));
		margin: 0 auto;
		border-radius: 0.75rem;
		overflow: hidden;
		background: #0b1517;
	}
	.foto.viu {
		touch-action: none; /* le doigt pose et déplace, il ne fait pas défiler */
		cursor: crosshair;
		/* deux touchers de suite ne surlignent pas la photo */
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
		pointer-events: none;
	}
	/* les ronds : la même recette que dans Remira › Paisatges */
	.rond {
		position: absolute;
		width: 1.9rem;
		height: 1.9rem;
		margin: -0.95rem 0 0 -0.95rem;
		padding: 0;
		border: 2px solid var(--aur-clar, #ffd47f);
		border-radius: 50%;
		background: rgba(4, 9, 11, 0.28);
		box-shadow:
			0 0 0 1.5px rgba(4, 9, 11, 0.72),
			0 0 10px rgba(4, 9, 11, 0.45),
			inset 0 0 0 1.5px rgba(4, 9, 11, 0.5);
		cursor: grab;
		touch-action: none;
	}
	.rond.void {
		border-style: dashed;
	}
	.rond.causit {
		border-width: 3px;
		background: rgba(255, 212, 127, 0.3);
	}
	.rond:focus-visible {
		outline: 2px solid #f3ead6;
		outline-offset: 3px;
	}
	/* sous le rond ; au-dessus en bas de la photo ; calée sur le rond près d'un bord */
	.nom {
		position: absolute;
		translate: var(--tx, -50%) var(--ty, 1.15rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.15rem 0.45rem 0.2rem;
		border-radius: 0.35rem;
		background: rgba(4, 9, 11, 0.72);
		color: #f3ead6;
		line-height: 1.25;
		white-space: nowrap;
		cursor: grab;
		touch-action: none;
	}
	.n-oc {
		font-size: 0.82rem;
		font-weight: 700;
	}
	.n-filet {
		width: 1.4rem;
		height: 1px;
		margin: 0.12rem 0;
		background: var(--aur-clar, #ffd47f);
		opacity: 0.7;
	}
	.n-fr {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 0.74rem;
		color: #f1dcb2;
	}
	.nom.drecha {
		--tx: calc(-100% + 0.95rem);
	}
	.nom.esquerra {
		--tx: -0.95rem;
	}
	.nom.naut {
		--ty: calc(-100% - 1.15rem);
	}
	.forma {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.2rem 0.1rem 0;
	}
	/* sur le fond sombre de la carte (l'espace admin donne aux étiquettes son encre foncée) */
	.pausar .forma label {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: #f3ead6;
	}
	input {
		padding: 0.5rem 0.65rem;
		border: 1px solid rgba(243, 234, 214, 0.4);
		border-radius: 0.5rem;
		background: rgba(243, 234, 214, 0.08);
		color: #f3ead6;
		font: inherit;
		font-size: 1.05rem;
		user-select: text;
	}
	input:focus-visible {
		outline: 2px solid var(--aur-clar, #ffd47f);
		outline-offset: 1px;
	}
	input::placeholder {
		color: rgba(243, 234, 214, 0.45);
	}
	.cerca-linha {
		display: flex;
		gap: 0.4rem;
	}
	/* une largeur de départ modeste : sinon le champ (20 signes) élargit la carte au téléphone */
	.cerca-linha input {
		flex: 1 1 6rem;
		width: 6rem;
		min-width: 0;
	}
	.pausar .cerca label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: #f3ead6;
	}
	.b-cercar {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--aur-clar, #ffd47f);
		border-radius: 999px;
		background: rgba(255, 212, 127, 0.14);
		color: #f3ead6;
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}
	.b-cercar:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.b-cercar:focus-visible {
		outline: 2px solid var(--aur-clar, #ffd47f);
		outline-offset: 2px;
	}
	.trobats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		max-height: 13.5rem;
		overflow-y: auto;
	}
	.trobats button {
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-areas: 'oc font' 'fr font';
		align-items: center;
		column-gap: 0.6rem;
		padding: 0.4rem 0.65rem;
		border: 1px solid rgba(243, 234, 214, 0.25);
		border-radius: 0.5rem;
		background: rgba(243, 234, 214, 0.06);
		color: #f3ead6;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.trobats button:hover,
	.trobats button:focus-visible {
		border-color: var(--aur-clar, #ffd47f);
		background: rgba(255, 212, 127, 0.12);
		outline: none;
	}
	.t-oc {
		grid-area: oc;
		font-weight: 700;
	}
	.t-fr {
		grid-area: fr;
		font-family: var(--font-quote);
		font-size: 0.85rem;
		color: #f1dcb2;
	}
	.t-font {
		grid-area: font;
		justify-self: end;
		font-size: 0.72rem;
		opacity: 0.7;
		text-align: right;
	}
	.estat,
	.actual {
		margin: 0;
		font-size: 0.82rem;
	}
	.estat:empty {
		display: none;
	}
	.actual em {
		font-family: var(--font-quote);
		color: #f1dcb2;
	}
	.man summary {
		font-size: 0.82rem;
		cursor: pointer;
		opacity: 0.85;
	}
	.man[open] {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.avis {
		margin: 0;
		font-size: 0.85rem;
		color: var(--aur-clar, #ffd47f);
	}
	.b-forma {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.b-forma button,
	.b-barra {
		padding: 0.45rem 0.9rem;
		border: 1px solid rgba(243, 234, 214, 0.55);
		border-radius: 999px;
		background: transparent;
		color: #f3ead6;
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}
	.b-forma .b-fach {
		border-color: var(--aur-clar, #ffd47f);
		background: rgba(255, 212, 127, 0.14);
	}
	.b-forma button:focus-visible,
	.b-barra:focus-visible {
		outline: 2px solid var(--aur-clar, #ffd47f);
		outline-offset: 2px;
	}
	.ajuda {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		text-align: center;
		opacity: 0.9;
	}
	/* la barre : le compte, ajouter un mot, le plein écran */
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}
	.compte {
		margin-right: auto;
		font-size: 0.85rem;
		opacity: 0.85;
	}
	.b-barra {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.8rem;
		font-size: 0.85rem;
	}
	.cadre {
		min-width: 0;
	}
	.costat {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		min-width: 0;
	}

	/* ── le plein écran : la photo aussi grande que l'écran le permet, la
	   recherche dessous (téléphone) ou à côté (ordinateur) ── */
	.pausar.gran {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 0.6rem;
		padding: max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) max(0.75rem, env(safe-area-inset-bottom))
			max(0.75rem, env(safe-area-inset-left));
		background: #0b1517;
		color: #f3ead6;
		font-family: var(--font-body);
	}
	.gran .cadre {
		container-type: size;
		display: grid;
		place-items: center;
		min-height: 0;
	}
	.gran .foto {
		width: min(100cqw, calc(100cqh * var(--l)));
		margin: 0;
	}
	/* hauteur fixe : ouvrir la recherche ne fait pas bouger la photo (le second
	   toucher d'un double toucher tombe au même endroit que le premier) */
	.gran .costat {
		height: min(40vh, 16rem);
		overflow-y: auto;
	}
	@media (min-width: 56rem) {
		.pausar.gran {
			grid-template-columns: minmax(0, 1fr) 22rem;
			grid-template-rows: auto minmax(0, 1fr);
			grid-template-areas: 'barra barra' 'cadre costat';
			gap: 0.75rem 1.25rem;
		}
		.gran .barra {
			grid-area: barra;
		}
		.gran .cadre {
			grid-area: cadre;
		}
		.gran .costat {
			grid-area: costat;
			align-self: center;
			height: auto;
			max-height: 100%;
		}
	}
</style>
