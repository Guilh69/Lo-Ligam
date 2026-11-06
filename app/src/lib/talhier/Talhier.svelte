<script>
	// Lo talhièr, lot 1 (Romain, 2026-11-06 ; revisions/2026-11-06-talhier.md) :
	// le rail d'outils de l'administrateur, sur chaque page, toujours au même
	// endroit. Modificar (l'édition sur place, quand la page l'a), Comentar
	// (épingler une note sur l'endroit touché : pour l'IA, ou pour soi), Per tu
	// (la liste de ce qui attend Romain, /admin). Le panneau s'ouvre à côté de
	// la page, sans la couvrir ; sur téléphone, il monte du bas.
	//
	// Validar (lot 4) : la page devient une carte de ce qui est validé (tirets
	// d'or : à valider ; trait vert : validé ; pointillés : une note attend
	// l'IA) ; on touche un texte pour dire « Bon » ou « Corregir ». La pile
	// (/admin/pila) y mène par « ?veire=clé ».
	//
	// Chargé seulement pour l'administrateur (+layout.svelte racine) : le
	// visiteur ne télécharge rien de tout ça.
	import { onMount, tick, untrack } from 'svelte';
	import { page } from '$app/state';
	import Icona from '$lib/components/Icona.svelte';
	import { edicion, activar, desactivar } from '$lib/edicion/edicion.svelte.js';
	import { notas, cargarNotas, comptePerTu, mandarNota, bon, pasEncara, respondre, sòrta, trobar, linha, tèxteDe, SELECTOR_TÈXTE } from './notas.svelte.js';
	import { validacions, cargarValidacions, validar, validarTot } from './pila.svelte.js';
	import { estatElement } from './pila.js';
	import { tèxteElement, tèxteFicha, empremta } from './empremtas.js';
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

	// en changeant de page, le panneau se ferme (seul le chemin compte ici) ;
	// « Validar » reste allumé d'une page modifiable à l'autre
	$effect(() => {
		camin;
		untrack(() => {
			fasa = 'repaus';
			tampar();
			if (!validant) return;
			vCausit = null;
			if (edicion.pagina || surFicha) calcularEstats();
			else quitarValidar();
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
		if (validant) quitarValidar();
		tampar();
		fasa = 'causir';
	}

	// --- Validar (lot 4) --------------------------------------------------------
	let validant = $state(false);
	let vEstats = $state({}); // clé → 'a-validar' | 'validat' | 'nota'
	let vCausit = $state(null); // { clau, oc, estat } : le texte touché
	let vFicha = $state(null); // { f, empremta } sur la page d'une fiche
	let vSegur = $state(false); // « Tot bon » demande une confirmation
	let vOcupat = $state(false);
	let vMessatge = $state('');
	let surFicha = $derived(page.route.id === '/apren/gramatica/[ficha]');
	let pòtValidar = $derived(!dinsLeiçon && (pòtModificar || surFicha));
	// les clés marquées ET affichées sur la page : seules celles-là se comptent
	// et passent par « Tot bon » (un texte qu'on ne voit pas reste dans la pile)
	let vPresents = $state([]);
	const comptar = (s) => vPresents.filter((c) => vEstats[c] === s).length;
	let nA = $derived(comptar('a-validar'));
	let nV = $derived(comptar('validat'));
	let nN = $derived(comptar('nota'));
	let fichaValidada = $derived(!!vFicha && (vFicha.f.validada || validacions.per[`ficha:${vFicha.f.id}`] === vFicha.empremta));

	/** les textes et liens de la page qui ont de l'occitan (version publiée) */
	const elementsPagina = () =>
		Object.values(edicion.publicats).filter((e) => (e.tipe === 'text' || e.tipe === 'ligam') && !e.suprimit && e.visible !== false && tèxteElement(e.oc));

	async function calcularEstats() {
		const res = {};
		for (const e of elementsPagina()) res[e.clau] = estatElement({ clau: e.clau, empremta: await empremta(tèxteElement(e.oc)) }, validacions.per, notas.lista);
		vEstats = res;
		vFicha = null;
		if (surFicha) {
			const { ficha } = await import('$lib/gramatica/index.js');
			const f = ficha(page.params.ficha);
			if (f) vFicha = { f, empremta: await empremta(tèxteFicha(f)) };
		}
		marcarTot();
	}
	function marcarTot() {
		if (!validant) return;
		const presents = new Set();
		for (const el of document.querySelectorAll('[data-clau]')) {
			const c = el.getAttribute('data-clau');
			const s = vEstats[c];
			if (!s) {
				el.removeAttribute('data-talhier-v');
				continue;
			}
			el.setAttribute('data-talhier-v', s);
			if (el.getClientRects().length) presents.add(c);
		}
		const lista = [...presents].sort();
		if (lista.join('|') !== vPresents.join('|')) vPresents = lista;
	}

	async function començarValidar(clauVeire = null) {
		if (validant && !clauVeire) return quitarValidar();
		if (fasa === 'causir') anullar();
		tampar();
		if (edicion.actiu) desactivar();
		validant = true;
		vCausit = null;
		vSegur = false;
		vMessatge = '';
		await cargarValidacions();
		if (validacions.error) vMessatge = validacions.error;
		await calcularEstats();
		if (!clauVeire) return;
		// l'élément montré depuis la pile : il porte sa clé dès que la page sait
		// qu'on est administrateur (un instant après son affichage)
		for (let i = 0; i < 20 && validant; i++) {
			const el = document.querySelector(`[data-clau="${CSS.escape(clauVeire)}"]`);
			if (el) return causirV(el);
			await new Promise((r) => setTimeout(r, 150));
		}
		if (validant) vMessatge = 'Ce texte n’est pas visible sur la page : il est peut-être dans une partie repliée.';
	}
	function quitarValidar() {
		validant = false;
		vPresents = [];
		vCausit = null;
		vSegur = false;
		vMessatge = '';
		desmarcar();
	}
	$effect(() => {
		if (!validant) return;
		// la page peut changer sous nos yeux (une liste qui se déplie) : on remarque
		let pendent = 0;
		const obs = new MutationObserver(() => {
			if (!pendent) pendent = requestAnimationFrame(() => ((pendent = 0), marcarTot()));
		});
		obs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-clau'] });
		// on touche un texte marqué : il est choisi (un lien n'est pas suivi) ; le
		// reste de la page marche comme d'habitude
		const tòca = (e) => {
			if (defòra(e.target)) return;
			const el = e.target.closest('[data-talhier-v]');
			if (!el) return;
			e.preventDefault();
			e.stopPropagation();
			causirV(el);
		};
		const clau = (e) => {
			if (e.key !== 'Escape' || panèl) return;
			if (vCausit) desV();
			else quitarValidar();
		};
		document.addEventListener('click', tòca, true);
		document.addEventListener('keydown', clau);
		document.documentElement.classList.add('talhier-validar');
		return () => {
			obs.disconnect();
			cancelAnimationFrame(pendent);
			document.removeEventListener('click', tòca, true);
			document.removeEventListener('keydown', clau);
			document.documentElement.classList.remove('talhier-validar');
			for (const el of document.querySelectorAll('[data-talhier-v]')) el.removeAttribute('data-talhier-v');
		};
	});

	function causirV(el) {
		const clau = el.getAttribute('data-clau');
		const e = edicion.publicats[clau];
		if (!e) return;
		marcar(el);
		vCausit = { clau, oc: tèxteElement(e.oc), estat: vEstats[clau] };
		vSegur = false;
		vMessatge = '';
	}
	function desV() {
		vCausit = null;
		vSegur = false;
		desmarcar();
	}
	async function bonV() {
		if (!vCausit || vOcupat) return;
		const c = vCausit;
		vOcupat = true;
		const r = await validar('element', c.clau, await empremta(c.oc));
		vOcupat = false;
		if (r.error) return (vMessatge = r.error);
		vEstats = { ...vEstats, [c.clau]: 'validat' };
		desV();
		marcarTot();
		vMessatge = 'Validé.';
	}
	async function totBonV() {
		if (!vSegur) return (vSegur = true);
		vSegur = false;
		vOcupat = true;
		const lignes = [];
		for (const c of vPresents) {
			const e = edicion.publicats[c];
			if (e && vEstats[c] === 'a-validar') lignes.push({ tipe: 'element', clau: c, empremta: await empremta(tèxteElement(e.oc)) });
		}
		const err = await validarTot(lignes);
		vOcupat = false;
		if (err) return (vMessatge = err);
		const fachs = new Set(lignes.map((l) => l.clau));
		vEstats = Object.fromEntries(Object.entries(vEstats).map(([c, s]) => [c, fachs.has(c) ? 'validat' : s]));
		marcarTot();
		vMessatge = `${lignes.length} ${lignes.length > 1 ? 'textes validés' : 'texte validé'}.`;
	}
	/** « Corregir » : le panneau de note s'ouvre, avec le texte à corriger */
	function corregirV() {
		if (!vCausit) return;
		const c = vCausit;
		cibla = { clau: c.clau, extrait: c.oc, cibla: null };
		per = 'ia';
		tèxte = c.oc;
		obrir({ tipe: 'corregir', oc: c.oc, clau: c.clau });
	}
	async function bonFicha() {
		if (!vFicha || vOcupat) return;
		vOcupat = true;
		const r = await validar('ficha', vFicha.f.id, vFicha.empremta);
		vOcupat = false;
		vMessatge = r.error ?? 'L’IA la marquera comme relue dans le code à sa prochaine séance.';
	}
	function corregirFicha() {
		if (!vFicha) return;
		cibla = { clau: null, extrait: `Fiche « ${vFicha.f.titol} »`, cibla: null };
		per = 'ia';
		tèxte = '';
		obrir({ tipe: 'nòta' });
	}

	// arrivée depuis la pile : ?veire=clé allume « Validar » et choisit ce texte
	let veireMostrat = null;
	$effect(() => {
		const v = page.url.searchParams.get('veire');
		if (!v || !edicion.admin || v === veireMostrat) return;
		veireMostrat = v;
		untrack(() => començarValidar(v));
	});
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
					: m.tipe === 'corregir'
						? await mandarCorreccion(m, tèxte)
						: await mandarNota({ pagina: camin, ...cibla, tèxte, per });
		mandant = false;
		if (err) return (error = err);
		tèxte = '';
		if (m.tipe === 'corregir') {
			vEstats = { ...vEstats, [m.clau]: 'nota' };
			vCausit = null;
			marcarTot();
		}
		messatge =
			m.tipe === 'corregir'
				? 'Mandat. L’IA vérifie avec lo Congrès, corrige la page et te répond dans Per tu.'
				: m.tipe === 'nòta'
					? per === 'ia'
						? 'Mandat. L’IA la relèvera à sa prochaine séance et te répondra ici.'
						: 'Gardada. Elle t’attend dans Per tu.'
					: m.tipe === 'precision'
						? 'Repartie vers l’IA, avec ta précision.'
						: 'Réponse envoyée.';
		panèl = 'legir';
		cibla = null;
	}

	/** une correction de l'occitan (Validar → Corregir) : une note pour l'IA,
	 *  posée sur l'élément, avec le texte d'avant (extrait) et celui de Romain */
	function mandarCorreccion(m, t) {
		if (t.trim() === m.oc) return Promise.resolve('Le texte n’a pas changé : corrige-le, ou dis ce qui ne va pas.');
		return mandarNota({ pagina: camin, ...cibla, tèxte: `Correction de l’occitan (texte de Romain) :\n${t.trim()}`, per: 'ia' });
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
				<h2 id="talhier-titol" bind:this={títol} tabindex="-1">{panèl === 'escriure' && mòde.tipe === 'corregir' ? 'Corregir' : 'Comentar'}</h2>
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
				{:else if mòde.tipe === 'corregir'}
					<p class="sus">« {mòde.oc} »</p>
					<p class="ajuda">Le bon texte : corrige-le ci-dessous, ou dis ce qui ne va pas. L’IA vérifie avec lo Congrès, corrige la page et te répond dans Per tu.</p>
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

	{#if validant && !panèl}
		<div class="validar" role="region" aria-label="Validar">
			{#if vCausit}
				<p class="sus">« {vCausit.oc} »</p>
				<div class="accions">
					{#if vCausit.estat === 'a-validar'}
						<button type="button" class="primari" onclick={bonV} disabled={vOcupat}>Bon</button>
						<button type="button" class="segond" onclick={corregirV}>Corregir</button>
					{:else if vCausit.estat === 'validat'}
						<span class="estat-v">Déjà validé.</span>
						<button type="button" class="segond" onclick={corregirV}>Corregir</button>
					{:else}
						<span class="estat-v">Une note attend l’IA sur ce texte.</span>
					{/if}
					<span class="espaci"></span>
					<button type="button" class="segond" onclick={desV}>Anullar</button>
				</div>
			{:else if vFicha}
				<p class="sus">Ficha : « {vFicha.f.titol} »</p>
				<div class="accions">
					{#if fichaValidada}
						<span class="estat-v">Fiche validée.</span>
					{:else}
						<button type="button" class="primari" onclick={bonFicha} disabled={vOcupat}>Bon</button>
					{/if}
					<button type="button" class="segond" onclick={corregirFicha}>Corregir</button>
					<span class="espaci"></span>
					<button type="button" class="tampar" onclick={quitarValidar} aria-label="Fermer" title="Fermer"><Icona nom="fermer" size="1.1em" /></button>
				</div>
			{:else}
				<p class="sus"><b>Validar</b> · touche un texte pour le valider ou le corriger.</p>
				<p class="legenda">
					<span class="m" data-m="a-validar" aria-hidden="true"></span> à valider ({nA})
					<span class="m" data-m="validat" aria-hidden="true"></span> validé ({nV})
					{#if nN}<span class="m" data-m="nota" aria-hidden="true"></span> note en attente ({nN}){/if}
				</p>
				<div class="accions">
					{#if nA && vSegur}
						<span>Valider les {nA} textes encore à valider sur cette page ?</span>
						<button type="button" class="primari" onclick={totBonV} disabled={vOcupat}>Òc</button>
						<button type="button" class="segond" onclick={() => (vSegur = false)}>Non</button>
					{:else if nA}
						<button type="button" class="segond" onclick={totBonV} disabled={vOcupat}>Tot bon ({nA})</button>
					{/if}
					<span class="espaci"></span>
					<button type="button" class="tampar" onclick={quitarValidar} aria-label="Fermer" title="Fermer"><Icona nom="fermer" size="1.1em" /></button>
				</div>
			{/if}
			{#if vMessatge}<p class="mes" role="status">{vMessatge}</p>{/if}
		</div>
	{/if}

	<nav class="rail" class:amagat={panèl} class:causint={fasa === 'causir' || validant} aria-label="Talhièr">
		{#if pòtModificar}
			<button
				type="button"
				class:actiu={edicion.actiu}
				aria-pressed={edicion.actiu}
				onclick={() => {
					if (validant) quitarValidar();
					edicion.actiu ? desactivar() : activar();
				}}
			>
				<Icona nom="modificar" size="1.35em" />
				<span>Modificar</span>
			</button>
		{/if}
		{#if !dinsLeiçon}
			<button type="button" class:actiu={fasa === 'causir'} aria-pressed={fasa === 'causir'} onclick={començar}>
				<Icona nom="comentar" size="1.35em" />
				<span>Comentar</span>
			</button>
			{#if pòtValidar}
				<button type="button" class:actiu={validant} aria-pressed={validant} onclick={() => començarValidar()}>
					<Icona nom="valide" size="1.35em" />
					<span>Validar</span>
				</button>
			{/if}
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

	/* --- Validar : la page en carte de ce qui est validé ------------------------------
	   Un seul poids de trait ; la forme dit l'état autant que la couleur (tirets :
	   à valider ; trait plein : validé ; pointillés : une note attend l'IA). */
	:global([data-talhier-v]) {
		outline-offset: 3px;
		border-radius: 2px;
		cursor: pointer !important;
	}
	:global([data-talhier-v='a-validar']) {
		outline: 1px dashed var(--t-aur) !important;
	}
	:global([data-talhier-v='validat']) {
		outline: 1px solid var(--l-bon) !important;
	}
	:global([data-talhier-v='nota']) {
		outline: 1px dotted var(--l-teal) !important;
	}
	:global([data-talhier-v].talhier-marcat) {
		outline: 1px solid var(--t-aur) !important;
	}
	.validar {
		position: fixed;
		z-index: 2095;
		left: 50%;
		bottom: 1rem;
		transform: translateX(-50%);
		box-sizing: border-box;
		width: min(36rem, calc(100vw - 2rem));
		padding: 0.7rem 0.9rem 0.75rem;
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		background: var(--t-fons-2);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
	}
	.validar .sus {
		margin: 0 0 0.35rem;
		color: var(--t-tinta);
	}
	.validar .sus b {
		color: var(--t-aur-clar);
	}
	.validar .accions {
		margin-top: 0.35rem;
	}
	.legenda {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem 0.5rem;
		margin: 0;
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}
	.m {
		display: inline-block;
		width: 1.6rem;
		height: 0.8rem;
		margin-left: 0.35rem;
		border-radius: 2px;
	}
	.m:first-child {
		margin-left: 0;
	}
	.m[data-m='a-validar'] {
		border: 1px dashed var(--t-aur);
	}
	.m[data-m='validat'] {
		border: 1px solid var(--l-bon);
	}
	.m[data-m='nota'] {
		border: 1px dotted var(--l-teal);
	}
	.estat-v {
		color: var(--t-tinta-2);
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
		.validar {
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			transform: none;
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
