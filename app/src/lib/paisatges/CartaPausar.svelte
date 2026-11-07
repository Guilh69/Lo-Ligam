<script>
	// Poser les mots sur une photo, dans une carte de Triar (lot « pausar »,
	// Romain, 07-11 : « une possibilité d'écrire les mots et ajouter les
	// ronds »). On touche la photo : un rond naît là, on écrit (ou dicte) son
	// mot. On touche un rond : on change son mot ; on le fait glisser : il se
	// déplace. Les gestes restent dans la carte : elle ne part pas, on la
	// renvoie avec ses boutons. Chaque changement remonte par onmots, en
	// [occitan, français, x, y] (x et y en fraction de la photo, comme dans
	// ./paisatges.js). La carte de derrière (viu = false) reste une image fixe.
	import { tick, untrack } from 'svelte';
	import { camin, srcset, MOTS } from './paisatges.js';

	let { foto, mots = [], viu = true, onmots = () => {} } = $props();

	let n = 0; // une clé stable par rond
	let ronds = $state(untrack(() => mots.map(([oc, fr, x, y]) => ({ id: n++, oc, fr, x, y }))));
	let causit = $state(null); // l'id du rond choisi
	let camp = $state(null);
	let zona = $state(null);
	let tira = null; // { id, x0, y0, bolegat }

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

	const mandar = () => onmots(ronds.filter((d) => d.oc.trim()).map((d) => [d.oc.trim(), d.fr.trim(), d.x, d.y]));

	const bòrna = (v) => Math.round(Math.min(0.97, Math.max(0.03, v)) * 1000) / 1000;
	const lòc = (e) => {
		const b = zona.getBoundingClientRect();
		return [bòrna((e.clientX - b.left) / b.width), bòrna((e.clientY - b.top) / b.height)];
	};

	async function causir(id, focus = false) {
		causit = id;
		if (!focus) return;
		await tick();
		camp?.focus();
	}

	function abaissar(e) {
		if (!viu || e.button > 0) return;
		const id = e.target.closest('[data-rond]')?.dataset.rond;
		tira = { id: id == null ? null : Number(id), x0: e.clientX, y0: e.clientY, bolegat: false };
		zona.setPointerCapture(e.pointerId);
	}
	function bolegar(e) {
		if (!tira) return;
		if (Math.hypot(e.clientX - tira.x0, e.clientY - tira.y0) > 6) tira.bolegat = true;
		if (!tira.bolegat || tira.id == null) return;
		const d = ronds.find((d) => d.id === tira.id);
		[d.x, d.y] = lòc(e);
		causit = d.id;
	}
	function levar(e) {
		if (!tira) return;
		const t = tira;
		tira = null;
		if (t.id != null) {
			if (t.bolegat) mandar();
			causir(t.id);
		} else if (!t.bolegat) {
			// un toucher sur la photo : un rond naît là
			const [x, y] = lòc(e);
			ronds.push({ id: n, oc: '', fr: '', x, y });
			causir(n++, true);
		}
	}

	function apondre() {
		ronds.push({ id: n, oc: '', fr: '', x: 0.5, y: 0.5 });
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
		mandar();
	}
	function traduire(e) {
		rond.fr = e.target.value;
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

<!-- les gestes restent ici : la carte de Triar ne glisse pas -->
<div class="pausar" onpointerdown={(e) => viu && e.stopPropagation()} role="presentation">
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
			sizes="(max-width: 32rem) 100vw, 30rem"
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
					<span class="nom {costat(d.x)}" class:naut={d.y > 0.8} style:left="{d.x * 100}%" style:top="{d.y * 100}%" lang="oc" aria-hidden="true">{d.oc}</span>
				{/if}
			{:else}
				<span class="rond" style:left="{d.x * 100}%" style:top="{d.y * 100}%" aria-hidden="true"></span>
			{/if}
		{/each}
	</div>

	{#if viu}
		{#if rond}
			<div class="forma">
				<label>
					<span>Le mot en occitan, avec son article</span>
					<input
						bind:this={camp}
						value={rond.oc}
						oninput={escriure}
						onkeydown={teclaForma}
						list={LISTA}
						lang="oc"
						placeholder="la mar"
						autocomplete="off"
						spellcheck="false"
						maxlength="80"
					/>
				</label>
				<label>
					<span>En français</span>
					<input value={rond.fr} oninput={traduire} onkeydown={teclaForma} placeholder="la mer" autocomplete="off" maxlength="80" />
				</label>
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
			<p class="ajuda">
				{comptats}
				{comptats > 1 ? 'mots' : 'mot'} sur cette photo
				<button type="button" class="b-apondre" onclick={apondre}>Ajouter un mot au milieu</button>
			</p>
		{/if}
		<datalist id={LISTA}>
			{#each LEXIC as oc (oc)}<option value={oc}>{MOTS[oc]}</option>{/each}
		</datalist>
	{/if}
</div>

<style>
	.pausar {
		width: 100%;
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
		padding: 0.05rem 0.4rem;
		border-radius: 0.3rem;
		background: rgba(4, 9, 11, 0.7);
		color: #f3ead6;
		font-size: 0.78rem;
		line-height: 1.35;
		white-space: nowrap;
		pointer-events: none;
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
	.b-apondre {
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
	.b-apondre:focus-visible {
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
	.b-apondre {
		display: block;
		margin: 0.5rem auto 0;
	}
</style>
