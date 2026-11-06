<script>
	// Lo talhièr, lot 1 (Romain, 2026-11-06 ; revisions/2026-11-06-talhier.md) :
	// le rail d'outils de l'administrateur, sur chaque page, toujours au même
	// endroit. Modificar (l'édition sur place, quand la page l'a), Comentar
	// (épingler une note sur l'endroit touché : pour l'IA, ou pour soi), Per tu
	// (la liste de ce qui attend Romain, /admin). Le panneau s'ouvre à côté de
	// la page, sans la couvrir ; sur téléphone, il monte du bas.
	//
	// Chargé seulement pour l'administrateur (+layout.svelte racine) : le
	// visiteur ne télécharge rien de tout ça.
	import { onMount, tick, untrack } from 'svelte';
	import { page } from '$app/state';
	import Icona from '$lib/components/Icona.svelte';
	import { edicion, activar, desactivar } from '$lib/edicion/edicion.svelte.js';
	import { notas, cargarNotas, comptePerTu, mandarNota, bon, pasEncara, respondre, sòrta, trobar, linha, tèxteDe, SELECTOR_TÈXTE } from './notas.svelte.js';
	import { dictadaPossibla, dictar } from './dictada.js';

	let camin = $derived(page.url.pathname);
	// dans les leçons, les remarques ont leur propre outil, qui garde l'étape et
	// l'exercice (lib/lesson/Remarcas.svelte)
	let dinsLeiçon = $derived((page.route.id ?? '').startsWith('/aprene/modul'));
	let pòtModificar = $derived(!!edicion.pagina && edicion.admin);
	let compte = $derived(comptePerTu());
	let d_aquí = $derived(notas.lista.filter((r) => r.pagina === camin));

	// repaus → causir (on touche l'endroit) → panneau (escriure ou legir)
	let fasa = $state('repaus');
	let panèl = $state(null); // null | 'escriure' | 'legir'
	let cibla = $state(null); // { clau, cibla, extrait }
	let per = $state('ia');
	let mòde = $state({ tipe: 'nòta' }); // nòta | precision (r) | responsa (r)
	let tèxte = $state('');
	let error = $state('');
	let messatge = $state('');
	let mandant = $state(false);
	let focus = $state(null); // la note montrée depuis Per tu (?nota=…)
	let camp = $state(null);
	let títol = $state(null);
	let arrestarDictada = null;
	let escota = $state(false);

	// le rail dit à l'éditeur qu'il porte son entrée (« Modificar ») : plus de
	// bouton « Editar » à part
	onMount(() => {
		edicion.talhièr = true;
		cargarNotas();
		const vista = () => document.visibilityState === 'visible' && cargarNotas();
		document.addEventListener('visibilitychange', vista);
		return () => {
			edicion.talhièr = false;
			document.removeEventListener('visibilitychange', vista);
			desmarcar();
		};
	});

	// en changeant de page, le panneau se ferme (seul le chemin compte ici)
	$effect(() => {
		camin;
		untrack(() => {
			fasa = 'repaus';
			tampar();
		});
	});

	// arrivée depuis Per tu : ?nota=12 ouvre la note et montre son endroit, une
	// fois (la liste qui se recharge ne rouvre pas un panneau fermé)
	let notaMostrada = 0;
	$effect(() => {
		const id = Number(page.url.searchParams.get('nota'));
		if (!id || !notas.cargat || id === notaMostrada) return;
		const r = notas.lista.find((n) => n.id === id);
		if (!r) return;
		notaMostrada = id;
		untrack(() => {
			focus = r;
			panèl = 'legir';
		});
		tick().then(() => mostrar(r));
	});

	// --- marquer l'endroit ----------------------------------------------------
	let marcat = null;
	let survolat = null;
	function desmarcar() {
		marcat?.classList.remove('talhier-marcat');
		marcat = null;
		survolat?.classList.remove('talhier-survol');
		survolat = null;
	}
	function marcar(el) {
		desmarcar();
		if (!el) return;
		marcat = el;
		el.classList.add('talhier-marcat');
		const r = el.getBoundingClientRect();
		if (r.top < 0 || r.bottom > innerHeight * 0.7) scrollBy({ top: r.top - innerHeight * 0.22, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}
	let introbable = $state(false);
	function mostrar(r) {
		const el = trobar(r);
		introbable = !el && !!(r.clau || r.extrait);
		marcar(el);
	}

	/** l'élément touché : un bloc de texte, une image, ou l'élément modifiable */
	function ciblaDe(t) {
		const el = t.closest(`${SELECTOR_TÈXTE}, img, [data-clau]`) ?? t;
		// le fond de la page : une note sur toute la page
		if (el === document.body || el === document.documentElement || el.tagName === 'MAIN') return { el: null, clau: null, extrait: null, cibla: null };
		const clau = el.closest('[data-clau]')?.getAttribute('data-clau') ?? null;
		const extrait = el instanceof HTMLImageElement ? `[imatge] ${linha(el.alt || el.src.split('/').pop(), 280)}` : tèxteDe(el);
		const tit = el.closest('section, article, header, footer, main')?.querySelector('h1, h2, h3');
		return { el, clau, extrait, cibla: tit && !tit.contains(el) ? linha(tit.textContent, 120) : null };
	}
	const defòra = (t) => !(t instanceof Element) || t.closest('.talhier');

	function començar() {
		if (fasa === 'causir') return anullar();
		tampar();
		fasa = 'causir';
	}
	$effect(() => {
		if (fasa !== 'causir') return;
		const sus = (e) => {
			if (defòra(e.target)) return;
			const { el } = ciblaDe(e.target);
			if (el === survolat) return;
			survolat?.classList.remove('talhier-survol');
			survolat = el;
			el?.classList.add('talhier-survol');
		};
		// le toucher est pris avant la page : on ne suit pas un lien en montrant l'endroit
		const tòca = (e) => {
			if (defòra(e.target)) return;
			e.preventDefault();
			e.stopPropagation();
			const c = ciblaDe(e.target);
			marcar(c.el);
			cibla = { clau: c.clau, extrait: c.extrait, cibla: c.cibla };
			obrir();
		};
		const clau = (e) => e.key === 'Escape' && anullar();
		document.addEventListener('pointerover', sus, true);
		document.addEventListener('click', tòca, true);
		document.addEventListener('keydown', clau);
		document.documentElement.classList.add('talhier-causir');
		return () => {
			document.removeEventListener('pointerover', sus, true);
			document.removeEventListener('click', tòca, true);
			document.removeEventListener('keydown', clau);
			document.documentElement.classList.remove('talhier-causir');
			survolat?.classList.remove('talhier-survol');
			survolat = null;
		};
	});

	function totaLaPagina() {
		desmarcar();
		cibla = { clau: null, extrait: null, cibla: null };
		obrir();
	}

	async function obrir(m = { tipe: 'nòta' }) {
		fasa = 'repaus';
		mòde = m;
		panèl = 'escriure';
		error = '';
		messatge = '';
		await tick();
		camp?.focus();
	}

	// --- écrire ---------------------------------------------------------------
	function micro() {
		if (escota) return arrestarDictada?.();
		error = '';
		arrestarDictada = dictar(tèxte, { tèxte: (t) => (tèxte = t), fin: () => (escota = false), error: (m) => (error = m) });
		escota = true;
	}

	async function mandar() {
		if (tèxte.trim().length < 2 || mandant) return;
		arrestarDictada?.();
		mandant = true;
		error = '';
		const m = mòde;
		const err =
			m.tipe === 'precision'
				? await pasEncara(m.r, tèxte)
				: m.tipe === 'responsa'
					? await respondre(m.r, tèxte)
					: await mandarNota({ pagina: camin, ...cibla, tèxte, per });
		mandant = false;
		if (err) return (error = err);
		tèxte = '';
		messatge = m.tipe === 'nòta' ? (per === 'ia' ? 'Mandat. L’IA la relèvera à sa prochaine séance et te répondra ici.' : 'Gardada. Elle t’attend dans Per tu.') : m.tipe === 'precision' ? 'Repartie vers l’IA, avec ta précision.' : 'Réponse envoyée.';
		panèl = 'legir';
		cibla = null;
	}

	function anullar() {
		arrestarDictada?.();
		fasa = 'repaus';
		tampar();
	}

	function tampar() {
		arrestarDictada?.();
		panèl = null;
		cibla = null;
		focus = null;
		tèxte = '';
		error = '';
		messatge = '';
		introbable = false;
		desmarcar();
	}

	// Échap ferme ; un clic ailleurs aussi, sauf si un texte est en cours (la
	// dictée ne se perd pas d'un geste)
	$effect(() => {
		if (!panèl) return;
		const clau = (e) => e.key === 'Escape' && tampar();
		const clic = (e) => {
			if (defòra(e.target) || tèxte.trim()) return;
			tampar();
		};
		document.addEventListener('keydown', clau);
		const t = setTimeout(() => document.addEventListener('click', clic));
		return () => {
			clearTimeout(t);
			document.removeEventListener('keydown', clau);
			document.removeEventListener('click', clic);
		};
	});

	const ESTATS = {
		regarder: 'Responsa',
		question: 'Question',
		nòta: 'Nòta',
		espèra: 'En espèra',
		respost: 'Respondut'
	};
	const qual = (r) => r.autor_responsa ?? (sòrta(r) === 'question' ? r.autor : null);
	const ont = (r) => (r.extrait ? `« ${r.extrait} »` : 'toute la page');
</script>

<div class="talhier">
	{#if fasa === 'causir'}
		<div class="causir" role="status">
			<span>Touche l’endroit de la page</span>
			<button type="button" class="segond" onclick={totaLaPagina}>Tota la pagina</button>
			<button type="button" class="segond" onclick={anullar}>Anullar</button>
		</div>
	{/if}

	{#if panèl}
		<div class="panèl" role="dialog" aria-labelledby="talhier-titol">
			<div class="cap">
				<h2 id="talhier-titol" bind:this={títol} tabindex="-1">Comentar</h2>
				<button type="button" class="tampar" onclick={tampar} aria-label="Fermer" title="Fermer"><Icona nom="fermer" size="1.2em" /></button>
			</div>

			{#if panèl === 'escriure'}
				{#if mòde.tipe === 'nòta'}
					<p class="sus">Sus {cibla?.extrait ? `« ${cibla.extrait} »` : 'tota la pagina'}</p>
					<div class="per" role="group" aria-label="À qui">
						<button type="button" aria-pressed={per === 'ia'} onclick={() => (per = 'ia')}>Per l’IA</button>
						<button type="button" aria-pressed={per === 'romain'} onclick={() => (per = 'romain')}>Nòta</button>
					</div>
					<p class="ajuda">{per === 'ia' ? 'L’IA la relève à sa prochaine séance, fait le travail et te répond ici et dans Per tu.' : 'Pour toi seul : elle t’attend dans Per tu.'}</p>
				{:else}
					<p class="sus">{mòde.tipe === 'precision' ? 'Ce qui manque encore' : 'Ta réponse'} : {mòde.r.tèxte.split('\n')[0]}</p>
				{/if}
				<textarea bind:this={camp} bind:value={tèxte} rows="4" maxlength="2000" aria-label="Ta note" placeholder={dictadaPossibla ? 'Écris, ou touche « Dictar » et parle' : 'Écris ta note'}></textarea>
				<div class="accions">
					{#if dictadaPossibla}
						<button type="button" class="segond micro" class:escota onclick={micro} aria-pressed={escota}>{escota ? 'Arrestar' : 'Dictar'}</button>
					{/if}
					<span class="espaci"></span>
					<button type="button" class="segond" onclick={tampar}>Anullar</button>
					<button type="button" class="primari" onclick={mandar} disabled={tèxte.trim().length < 2 || mandant}>{mandant ? '…' : 'Mandar'}</button>
				</div>
			{/if}

			{#if error}<p class="mes error" role="alert">⚠ {error}</p>{/if}
			{#if messatge}<p class="mes" role="status">{messatge}</p>{/if}
			{#if introbable}<p class="mes">L’endroit de cette note n’est plus sur la page : elle a changé depuis.</p>{/if}

			{#if d_aquí.length && panèl === 'legir'}
				<h3>Sus aquesta pagina · {d_aquí.length}</h3>
				<ul class="lista">
					{#each d_aquí as r (r.id)}
						<li class:focus={focus?.id === r.id}>
							<button type="button" class="ont" onclick={() => ((focus = r), mostrar(r))}>
								<span class="estat" data-s={sòrta(r)}>{ESTATS[sòrta(r)]}{qual(r) ? ` · ${qual(r)}` : ''}</span>
								<span class="extrait">{ont(r)}</span>
							</button>
							<p class="nòta">{r.tèxte}</p>
							{#if r.responsa}<p class="responsa">{r.responsa}</p>{/if}
							{#if sòrta(r) === 'regarder'}
								<div class="accions">
									<button type="button" class="primari" onclick={() => bon(r)}>Bon</button>
									<button type="button" class="segond" onclick={() => obrir({ tipe: 'precision', r })}>Pas encara</button>
								</div>
							{:else if sòrta(r) === 'question'}
								<div class="accions"><button type="button" class="primari" onclick={() => obrir({ tipe: 'responsa', r })}>Respondre</button></div>
							{:else if sòrta(r) === 'nòta'}
								<div class="accions"><button type="button" class="segond" onclick={() => bon(r)}>Fach</button></div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else if panèl === 'legir' && !messatge}
				<p class="mes">Pas de note sur cette page.</p>
			{/if}
		</div>
	{/if}

	<nav class="rail" class:amagat={panèl} class:causint={fasa === 'causir'} aria-label="Talhièr">
		{#if pòtModificar}
			<button type="button" class:actiu={edicion.actiu} aria-pressed={edicion.actiu} onclick={() => (edicion.actiu ? desactivar() : activar())}>
				<Icona nom="modificar" size="1.35em" />
				<span>Modificar</span>
			</button>
		{/if}
		{#if !dinsLeiçon}
			<button type="button" class:actiu={fasa === 'causir'} aria-pressed={fasa === 'causir'} onclick={començar}>
				<Icona nom="comentar" size="1.35em" />
				<span>Comentar</span>
			</button>
			{#if d_aquí.length}
				<button type="button" class="aquí" onclick={() => ((panèl = 'legir'), (fasa = 'repaus'))} aria-label={`Les notes de cette page : ${d_aquí.length}`}>
					<span class="xifra">{d_aquí.length}</span>
					<span>Aquí</span>
				</button>
			{/if}
		{/if}
		<a href="/admin" aria-label={compte ? `Per tu : ${compte} choses t’attendent` : 'Per tu'}>
			<span class="ic"><Icona nom="lista" size="1.35em" />{#if compte}<span class="xifra">{compte}</span>{/if}</span>
			<span>Per tu</span>
		</a>
	</nav>
</div>

<style>
	/* l'endroit qu'on va toucher, puis celui qu'on a touché : un filet d'or */
	:global(.talhier-causir),
	:global(.talhier-causir *) {
		cursor: crosshair !important;
	}
	:global(.talhier-survol) {
		outline: 1px solid var(--t-aur) !important;
		outline-offset: 3px;
		background-color: color-mix(in srgb, var(--t-aur) 10%, transparent);
	}
	:global(.talhier-marcat) {
		outline: 1px solid var(--t-aur) !important;
		outline-offset: 3px;
		background-color: color-mix(in srgb, var(--t-aur) 18%, transparent);
		border-radius: 2px;
	}
	.talhier {
		font: 14px/1.45 var(--font-body);
		color: var(--t-tinta);
	}
	.talhier :is(button, a) {
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	/* --- le rail -------------------------------------------------------------- */
	.rail {
		position: fixed;
		z-index: 2090;
		right: 1rem;
		bottom: 4.6rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px;
		border: 1px solid var(--t-linha);
		border-radius: 14px;
		background: var(--t-fons-2);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
	}
	.rail :is(button, a) {
		display: grid;
		justify-items: center;
		gap: 3px;
		width: 68px;
		padding: 8px 2px 7px;
		border: 0;
		border-radius: 10px;
		background: transparent;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.1;
		text-decoration: none;
	}
	.rail :is(button, a):hover {
		background: color-mix(in srgb, var(--t-tinta) 8%, transparent);
	}
	.rail :is(button, a):focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.rail .actiu {
		color: var(--t-aur);
		box-shadow: inset 0 0 0 1px var(--t-aur);
	}
	.rail .xifra {
		font: 700 16px/1.2 var(--font-body);
		color: var(--t-aur);
	}
	/* Per tu : le nombre à côté de l'icône, en or (pas de pastille) */
	.rail .ic {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.rail .ic .xifra {
		font-size: 14px;
	}
	.rail.amagat {
		display: none;
	}

	/* --- « touche l'endroit » ---------------------------------------------------- */
	.causir {
		position: fixed;
		z-index: 2095;
		left: 50%;
		bottom: 1rem;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.6rem 0.5rem 1rem;
		border: 1px solid var(--t-aur);
		border-radius: 999px;
		background: var(--t-fons-2);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
		white-space: nowrap;
		font-weight: 600;
	}

	/* --- le panneau, à côté de la page ---------------------------------------------- */
	.panèl {
		position: fixed;
		z-index: 2095;
		right: 1rem;
		bottom: 1rem;
		width: min(400px, calc(100vw - 2rem));
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		overscroll-behavior: contain;
		padding: 0.9rem 1rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		background: var(--t-fons-2);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
	}
	.cap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	h2 {
		margin: 0;
		font: 700 1.05rem/1.2 var(--font-body);
		color: var(--t-aur-clar);
	}
	h2:focus {
		outline: none;
	}
	h3 {
		margin: 1rem 0 0.4rem;
		padding-top: 0.8rem;
		border-top: 1px solid var(--t-linha);
		font: 700 0.85rem/1.2 var(--font-body);
		color: var(--t-tinta-2);
	}
	.tampar {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
	}
	.sus {
		margin: 0 0 0.6rem;
		color: var(--t-tinta-2);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.per {
		display: inline-flex;
		padding: 3px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
	}
	.per button {
		padding: 0.35rem 0.9rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-weight: 600;
	}
	.per button[aria-pressed='true'] {
		background: var(--t-aur);
		color: var(--t-fons);
	}
	.ajuda {
		margin: 0.45rem 0 0.6rem;
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}
	textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: 6.5rem;
		padding: 0.6rem 0.7rem;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: inherit;
		font-size: 15px;
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.55rem;
	}
	.espaci {
		flex: 1;
	}
	/* règle B : le rouge du logo en aplat = ce qui se clique pour agir */
	.primari {
		padding: 0.45rem 1rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta) !important;
		font-weight: 700 !important;
	}
	.primari:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.segond {
		padding: 0.4rem 0.85rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		font-weight: 600;
	}
	.micro.escota {
		border-color: var(--t-aur);
		color: var(--t-aur);
	}
	.mes {
		margin: 0.6rem 0 0;
		color: var(--t-aur-clar);
	}
	.mes.error {
		color: var(--t-tinta);
		font-weight: 700;
	}
	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.lista li {
		padding: 0.6rem 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.lista li:last-child {
		border-bottom: 0;
	}
	.lista li.focus .extrait {
		color: var(--t-aur-clar);
	}
	.ont {
		display: grid;
		gap: 2px;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		text-align: left;
	}
	.estat {
		font-size: 12px;
		font-weight: 700;
		color: var(--t-tinta-2);
	}
	.estat[data-s='regarder'],
	.estat[data-s='question'] {
		color: var(--t-aur);
	}
	.extrait {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.nòta,
	.responsa {
		margin: 0.3rem 0 0;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	/* la réponse, en retrait, sans filet coloré à gauche (cliché écarté, Joan 06-11) ;
	   la note devient plus discrète pour que la réponse se lise d'abord */
	.lista li:has(.responsa) .nòta {
		color: var(--t-tinta-2);
	}
	.responsa {
		padding-left: 0.9rem;
	}

	/* --- téléphone : le rail se fait plus court, le panneau monte du bas ----------- */
	@media (max-width: 719px) {
		.rail {
			right: 0.5rem;
			bottom: 4.2rem;
		}
		.rail :is(button, a) {
			width: 64px;
			font-size: 12px;
		}
		/* la bande « touche l'endroit » prend le bas de l'écran ; on la quitte par « Anullar » */
		.rail.causint {
			display: none;
		}
		.panèl {
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			max-height: 78dvh;
			border-radius: 16px 16px 0 0;
			border-bottom: 0;
		}
		.causir {
			left: 0.5rem;
			right: 0.5rem;
			transform: none;
			justify-content: center;
			white-space: normal;
			flex-wrap: wrap;
			border-radius: 16px;
		}
	}
</style>
