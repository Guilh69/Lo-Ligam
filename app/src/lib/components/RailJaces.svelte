<script>
	// Rail de las jaces (causida de Romain, 2026-10-07, « panèl C ») : un rail
	// totjorn visible al bòrd de la carta, una icòna nomenada per familha. Un
	// clic dobrís lo tirador de la familha ; un segond clic sus la meteissa
	// icòna lo tampa (l'icòna se bolega pas). « Sus la carta » mòstra tot çò
	// qu'es afichat, per l'escantir d'un còp d'uèlh ; « Fons » règla lo fons
	// (elements e colors), per exemple per gardar sonque lo trach de còsta.
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let {
		familhas = [],
		visibility = $bindable({}),
		baseLayer = $bindable('estelas'),
		elements = $bindable({}),
		colors = $bindable({}),
		dialecte = $bindable(null),
		clar = false,
		lang = 'oc',
		esAdmin = false
	} = $props();

	const T = {
		oc: {
			rail: 'Jaces de la carta',
			sus: 'Sus la carta',
			fons: 'Fons',
			tampar: 'Tampar',
			aVenir: 'A venir',
			indisponible: 'Indisponibla per ara',
			disponiblas: (n) => `${n} ${n > 1 ? 'jaces disponiblas' : 'jaça disponibla'}`,
			venir: (n) => `${n} a venir`,
			res: 'Pas cap de jaça : la carta es nusa. Causissètz-ne una dins una familha.',
			afichadas: (n) => `${n} ${n > 1 ? 'jaces afichadas' : 'jaça afichada'}`,
			fonsCarta: 'Fons de carta',
			basemaps: { estelas: 'Estelas', occitan: 'Occitan', natural: 'Natural', satellite: 'Satellit' },
			elementsFons: 'Çò que mòstra lo fons',
			el: {
				estelas: 'Estelas (los luòcs)',
				nomsVilas: 'Noms de las vilas',
				rius: 'Rius',
				nomsRius: 'Noms dels rius',
				corbas: 'Corbas de nivèl',
				costa: 'Trach de còsta'
			},
			sonqueCosta: 'Sonque la còsta',
			totTornar: 'Tot tornar',
			colorsTema: 'Colors del tèma',
			color: (n) => `Color : ${n}`,
			dialecteTotes: 'Totes',
			causirDial: 'Afichar sonque un dialècte',
			admin: "Modificar dins l'admin"
		},
		fr: {
			rail: 'Couches de la carte',
			sus: 'Sur la carte',
			fons: 'Fond',
			tampar: 'Fermer',
			aVenir: 'À venir',
			indisponible: "Indisponible pour l'instant",
			disponiblas: (n) => `${n} ${n > 1 ? 'couches disponibles' : 'couche disponible'}`,
			venir: (n) => `${n} à venir`,
			res: 'Aucune couche : la carte est nue. Choisissez-en une dans une famille.',
			afichadas: (n) => `${n} ${n > 1 ? 'couches affichées' : 'couche affichée'}`,
			fonsCarta: 'Fond de carte',
			basemaps: { estelas: 'Étoiles', occitan: 'Occitan', natural: 'Naturel', satellite: 'Satellite' },
			elementsFons: 'Ce que montre le fond',
			el: {
				estelas: 'Étoiles (les lieux)',
				nomsVilas: 'Noms des villes',
				rius: 'Rivières',
				nomsRius: 'Noms des rivières',
				corbas: 'Courbes de niveau',
				costa: 'Trait de côte'
			},
			sonqueCosta: 'Seulement la côte',
			totTornar: 'Tout remettre',
			colorsTema: 'Couleurs du thème',
			color: (n) => `Couleur : ${n}`,
			dialecteTotes: 'Tous',
			causirDial: 'Afficher un seul dialecte',
			admin: "Modifier dans l'admin"
		}
	};
	let tx = $derived(T[lang] ?? T.oc);

	// Icònas de las familhas (traç fin, color del tèxte)
	const IC = {
		sus: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
		lenga: '<path d="M4 5h16v10H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
		administracion: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/>',
		cultura: '<path d="M4 6c3-1 5-1 8 1 3-2 5-2 8-1v12c-3-1-5-1-8 1-3-2-5-2-8-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 7v12" stroke="currentColor" stroke-width="1.4"/>',
		istoria: '<path d="M5 20h14M6 20V10M10 20V10M14 20V10M18 20V10M4 10h16L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
		natura: '<path d="M3 19l6-10 4 6 3-4 5 8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="17" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
		fons: '<path d="M12 4l9 5-9 5-9-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
	};

	// Colors dels dialèctes (las de la carta, colaDonadas.js)
	const DIAL = $derived(
		clar
			? { gas: '#6a45d0', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' }
			: { gas: '#9d7dff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' }
	);
	const NOMS_DIAL = [
		['gas', 'gascon', 'gascon'],
		['lan', 'lengadocian', 'languedocien'],
		['pro', 'provençal', 'provençal'],
		['lem', 'lemosin', 'limousin'],
		['auv', 'auvernhat', 'auvergnat'],
		['viv', 'vivaroaupenc', 'vivaro-alpin']
	];

	// Apercebuts de las jaces, dessenhats coma sus la carta
	const apercebut = (id) => {
		const d = DIAL;
		const A = {
			frontiera: '<path d="M4 26 C 16 10, 30 30, 48 8" fill="none" stroke="#e0612f" stroke-width="2.4" stroke-dasharray="0.1 5" stroke-linecap="round"/>',
			dialectes: NOMS_DIAL.map(([k], i) => `<rect x="${i * 9}" y="0" width="9.5" height="36" fill="${d[k]}" opacity=".75"/>`).join(''),
			creissent: '<defs><pattern id="ap-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.6" height="5" fill="#e0612f"/></pattern></defs><path d="M0 22 Q 26 4 52 20 V 36 H 0z" fill="url(#ap-h)" opacity=".8"/>',
			departaments: '<rect x="3" y="4" width="14" height="13" fill="#e0612f" opacity=".85"/><rect x="19" y="4" width="14" height="13" fill="#e0612f" opacity=".5"/><rect x="35" y="4" width="14" height="13" fill="#e0612f" opacity=".22"/><rect x="3" y="19" width="22" height="13" fill="#e0612f" opacity=".5"/><rect x="27" y="19" width="22" height="13" fill="#e0612f" opacity=".85"/>',
			limsi: '<circle cx="14" cy="18" r="3" fill="#3e7cb1"/><path d="M20 12a8 8 0 0 1 0 12M24 8a13 13 0 0 1 0 20" fill="none" stroke="#3e7cb1" stroke-width="1.6"/>',
			regions: '<path d="M6 8 L22 5 L30 14 L46 10 L48 30 L24 32 L8 28z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>',
			despartaments: '<path d="M2 12 L18 8 L20 20 L4 24z M18 8 L34 10 L36 22 L20 20 M34 10 L50 6 L50 20 L36 22 M4 24 L20 20 L24 34 M20 20 L36 22 L40 34" fill="none" stroke="currentColor" stroke-width=".9" opacity=".6"/>',
			comunas: '<path d="M0 9h52M0 18h52M0 27h52M9 0v36M18 0v36M27 0v36M36 0v36M45 0v36" stroke="currentColor" stroke-width=".6" opacity=".35"/>',
			lieusInteres: '<circle cx="12" cy="14" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="30" cy="24" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="42" cy="10" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/>',
			librarias: '<path d="M14 10h10v18H14zM26 10h10v18H26z" fill="none" stroke="#eeaf34" stroke-width="1.5"/><path d="M17 15h4M29 15h4" stroke="#eeaf34" stroke-width="1.2"/>',
			calandretas: '<path d="M12 28V16l14-7 14 7v12z" fill="none" stroke="#eeaf34" stroke-width="1.5" stroke-linejoin="round"/><path d="M23 28v-6h6v6" stroke="#eeaf34" stroke-width="1.4" fill="none"/>',
			festas: '<path d="M26 7l3 7 7 .6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7L15 14.6l7-.6z" fill="#eeaf34" opacity=".85"/>',
			provincias: '<path d="M4 10 Q 20 2 30 12 T 50 14 M4 26 Q 22 20 34 28 T 50 26" fill="none" stroke="#c9a46a" stroke-width="1.6"/>',
			paises: '<circle cx="14" cy="16" r="9" fill="#c9a46a" opacity=".35"/><circle cx="34" cy="20" r="11" fill="#c9a46a" opacity=".25"/>',
			isolas: '<circle cx="18" cy="18" r="6" fill="none" stroke="#e0612f" stroke-width="1.6"/><circle cx="36" cy="14" r="4" fill="none" stroke="#e0612f" stroke-width="1.6"/>',
			parcs: '<path d="M6 30 Q 14 8 26 18 T 48 22 L 48 34 L 6 34z" fill="#5e7b3a" opacity=".85"/>',
			massis: '<path d="M2 32 L14 12 L22 24 L30 8 L44 32z" fill="none" stroke="#c9b48a" stroke-width="1.6" stroke-linejoin="round"/>',
			bacins: '<path d="M26 34 V 20 M26 20 L14 8 M26 20 L40 10 M20 14 L12 18 M34 14 L44 18" stroke="#eeaf34" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
			estelas: '<circle cx="10" cy="12" r="1.6" fill="currentColor"/><circle cx="24" cy="24" r="2.2" fill="currentColor"/><circle cx="38" cy="10" r="1.3" fill="currentColor"/><circle cx="44" cy="27" r="1.6" fill="currentColor"/><circle cx="17" cy="29" r="1" fill="currentColor"/>',
			nomsVilas: '<text x="26" y="23" text-anchor="middle" font-family="Limelight, Georgia, serif" font-size="13" fill="currentColor">Tolosa</text>',
			rius: '<path d="M2 28 C 14 18, 22 30, 32 18 S 46 8, 52 10" fill="none" stroke="#eeaf34" stroke-width="1.8" stroke-linecap="round"/>',
			nomsRius: '<text x="26" y="23" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="14" fill="#eeaf34">Garona</text>',
			corbas: '<path d="M2 30 Q 20 12 50 26 M6 34 Q 24 18 52 32 M4 24 Q 20 6 48 18" fill="none" stroke="#eeaf34" stroke-width=".8" opacity=".6"/>',
			costa: '<path d="M30 0 C 26 10, 34 14, 28 22 S 20 32, 26 36" fill="none" stroke="currentColor" stroke-width="1" opacity=".75"/>'
		};
		return A[id] ?? '';
	};

	const RAIL = ['sus', 'lenga', 'administracion', 'cultura', 'istoria', 'natura'];
	let dobert = $state(null);
	const alternar = (id) => (dobert = dobert === id ? null : id);

	const totas = $derived(familhas.flatMap((f) => f.jaces));
	const actiu = (j) => j.estat === 'disponible';
	const afichadas = $derived(totas.filter((j) => actiu(j) && visibility[j.id]));
	const familhaActiva = (f) => f.jaces.some((j) => actiu(j) && visibility[j.id]);
	const nomJ = (j) => (lang === 'oc' ? j.oc : (j.fr ?? j.oc));
	const notaJ = (j) =>
		j.estat === 'basa' ? tx.indisponible : ((lang === 'oc' ? j.nota_oc : (j.nota_fr ?? j.nota_oc)) ?? (actiu(j) ? null : tx.aVenir));
	const nomFam = (id) => {
		if (id === 'sus') return tx.sus;
		if (id === 'fons') return tx.fons;
		const f = familhas.find((x) => x.id === id);
		return f ? (lang === 'oc' ? f.oc : f.fr) : id;
	};

	function bascular(id, on) {
		visibility[id] = on;
		if (id === 'dialectes' && !on && dialecte && dialecte !== 'cro') dialecte = null;
		if (id === 'creissent' && !on && dialecte === 'cro') dialecte = null;
	}
	// Una pastilha de dialècte : aluca la jaça e causís (o descausís) lo dialècte
	function causirDial(k) {
		if (k === 'cro') visibility.creissent = true;
		else if (k) visibility.dialectes = true;
		dialecte = dialecte === k ? null : k;
	}

	const ELEMENTS = ['estelas', 'nomsVilas', 'rius', 'nomsRius', 'corbas', 'costa'];
	// las colors que l'internauta pòt cambiar, e lor valor de basa segon lo tèma
	const COLOR_DE = { estelas: 'estela', rius: 'riu', corbas: 'corba', costa: 'costa' };
	const colorBasa = $derived(
		clar
			? { estela: '#6b3a22', riu: '#b06a14', corba: '#8a5a2b', costa: '#2e1d14' }
			: { estela: '#f5ead8', riu: '#eeaf34', corba: '#eeaf34', costa: '#f5ead8' }
	);
	const elOn = (k) => elements[k] !== false;
	function sonqueCosta() {
		elements = Object.fromEntries(ELEMENTS.map((k) => [k, k === 'costa']));
		for (const j of totas) if (visibility[j.id]) visibility[j.id] = false;
		dialecte = null;
	}
	function totTornar() {
		elements = Object.fromEntries(ELEMENTS.map((k) => [k, true]));
	}
	function onKey(e) {
		if (e.key === 'Escape' && dobert) dobert = null;
	}
</script>

<svelte:window onkeydown={onKey} />

<nav class="rail" aria-label={tx.rail}>
	{#each RAIL as id (id)}
		<button
			type="button"
			class="rail-b"
			aria-expanded={dobert === id}
			aria-controls="tirador-jaces"
			onclick={() => alternar(id)}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC[id]}</svg>
			<span class="lib">{nomFam(id)}</span>
			{#if id === 'sus' && afichadas.length}
				<span class="compte" aria-label={tx.afichadas(afichadas.length)}>{afichadas.length}</span>
			{:else if id !== 'sus' && familhas.find((f) => f.id === id) && familhaActiva(familhas.find((f) => f.id === id))}
				<span class="punt" aria-hidden="true"></span>
			{/if}
		</button>
	{/each}
	<span class="rail-sep" aria-hidden="true"></span>
	<button type="button" class="rail-b" aria-expanded={dobert === 'fons'} aria-controls="tirador-jaces" onclick={() => alternar('fons')}>
		<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC.fons}</svg>
		<span class="lib">{tx.fons}</span>
	</button>
</nav>

{#if dobert}
	<section
		id="tirador-jaces"
		class="tirador"
		aria-label={nomFam(dobert)}
		transition:fly={{ x: -14, duration: 260, easing: quintOut }}
	>
		<header>
			<h2>{nomFam(dobert)}</h2>
			<button type="button" class="tampar" onclick={() => (dobert = null)} aria-label={tx.tampar}>×</button>
		</header>

		{#if dobert === 'sus'}
			<p class="sota">{tx.afichadas(afichadas.length)} · {tx.fonsCarta.toLowerCase()} : {tx.basemaps[baseLayer] ?? baseLayer}</p>
			{#if !afichadas.length}
				<p class="res">{tx.res}</p>
			{/if}
			{#each afichadas as j (j.id)}
				{@render linha(j)}
			{/each}
		{:else if dobert === 'fons'}
			<p class="titolet">{tx.fonsCarta}</p>
			<div class="fonses" role="radiogroup" aria-label={tx.fonsCarta}>
				{#each ['estelas', 'occitan', 'natural', 'satellite'] as k (k)}
					<button
						type="button"
						role="radio"
						aria-checked={baseLayer === k}
						class="fons"
						onclick={() => (baseLayer = k)}
					>
						<i class="fons-{k}"></i>{tx.basemaps[k]}
					</button>
				{/each}
			</div>
			{#if baseLayer === 'estelas'}
				<p class="titolet">{tx.elementsFons}</p>
				{#each ELEMENTS as k (k)}
					<div class="linha" class:escantida={!elOn(k)}>
						<span class="apercebut" style:color={COLOR_DE[k] ? (colors[COLOR_DE[k]] ?? colorBasa[COLOR_DE[k]]) : null}
							><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(k)}</svg></span
						>
						<div class="cos"><b>{tx.el[k]}</b></div>
						<div class="accions">
							{#if COLOR_DE[k]}
								<label class="mostra" title={tx.color(tx.el[k])}>
									<input
										type="color"
										value={colors[COLOR_DE[k]] ?? colorBasa[COLOR_DE[k]]}
										oninput={(e) => (colors = { ...colors, [COLOR_DE[k]]: e.currentTarget.value })}
										aria-label={tx.color(tx.el[k])}
									/>
								</label>
							{/if}
							<button
								type="button"
								class="basc"
								role="switch"
								aria-checked={elOn(k)}
								aria-label={tx.el[k]}
								onclick={() => (elements = { ...elements, [k]: !elOn(k) })}
							></button>
						</div>
					</div>
				{/each}
				<div class="botons">
					<button type="button" class="boton" onclick={sonqueCosta}>{tx.sonqueCosta}</button>
					<button type="button" class="boton" onclick={totTornar}>{tx.totTornar}</button>
					{#if Object.keys(colors).length}
						<button type="button" class="boton" onclick={() => (colors = {})}>{tx.colorsTema}</button>
					{/if}
				</div>
			{/if}
		{:else}
			{@const f = familhas.find((x) => x.id === dobert)}
			{#if f}
				{@const dispo = f.jaces.filter(actiu).length}
				<p class="sota">{tx.disponiblas(dispo)}{f.jaces.length - dispo ? ' · ' + tx.venir(f.jaces.length - dispo) : ''}</p>
				{#each f.jaces as j (j.id)}
					{@render linha(j)}
				{/each}
			{/if}
		{/if}

		{#if esAdmin}
			<a class="admin" href="/admin/carta">{tx.admin} →</a>
		{/if}
	</section>
{/if}

{#snippet linha(j)}
	<div class="linha" class:escantida={!actiu(j)}>
		<span class="apercebut"><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(j.id)}</svg></span>
		<div class="cos">
			<b>{nomJ(j)}</b>
			{#if notaJ(j)}<small>{notaJ(j)}</small>{/if}
			{#if j.id === 'dialectes' && actiu(j)}
				<div class="pastilhas" role="group" aria-label={tx.causirDial}>
					{#each NOMS_DIAL as [k, oc, fr] (k)}
						<button
							type="button"
							class="pastilha"
							aria-pressed={dialecte === k}
							onclick={() => causirDial(k)}
						><i style:background={DIAL[k]}></i>{lang === 'oc' ? oc : fr}</button>
					{/each}
					<button type="button" class="pastilha" aria-pressed={dialecte === 'cro'} onclick={() => causirDial('cro')}
						><i class="cro"></i>{lang === 'oc' ? 'creissent' : 'croissant'}</button
					>
					{#if dialecte}
						<button type="button" class="pastilha totes" onclick={() => (dialecte = null)}>{tx.dialecteTotes}</button>
					{/if}
				</div>
			{/if}
		</div>
		<button
			type="button"
			class="basc"
			role="switch"
			aria-checked={actiu(j) && !!visibility[j.id]}
			aria-label={nomJ(j)}
			disabled={!actiu(j)}
			onclick={() => bascular(j.id, !visibility[j.id])}
		></button>
	</div>
{/snippet}

<style>
	/* Lo rail : verre sombre (o crema en tèma clar), al bòrd esquèrra, jos lo
	   capçal ; s'arrèsta abans la bossòla */
	.rail {
		position: absolute;
		z-index: 1000;
		top: 7.2rem;
		left: var(--marge, 1rem);
		width: 4.6rem;
		max-height: calc(100% - 7.2rem - 10rem);
		overflow-y: auto;
		scrollbar-width: none;
		display: grid;
		gap: 2px;
		padding: 6px 5px;
		background: color-mix(in srgb, var(--t-fons-2) 90%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
	}
	.rail-b {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 4px;
		padding: 9px 2px 7px;
		border: 0;
		border-radius: 12px;
		background: none;
		color: var(--t-tinta-2);
		font: 400 10.5px/1.15 var(--font-body);
		text-align: center;
		cursor: pointer;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.rail-b svg {
		width: 22px;
		height: 22px;
	}
	.rail-b:hover {
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 6%, transparent);
	}
	.rail-b[aria-expanded='true'] {
		color: var(--t-aur-clar);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.rail-b:focus-visible,
	.tirador button:focus-visible,
	.tirador input:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.lib {
		hyphens: auto;
		overflow-wrap: anywhere;
	}
	.punt {
		position: absolute;
		top: 7px;
		right: 13px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--t-terra-viu);
	}
	.compte {
		position: absolute;
		top: 4px;
		right: 8px;
		min-width: 17px;
		height: 17px;
		padding: 0 4px;
		border-radius: 9px;
		background: var(--t-terra-viu);
		color: var(--t-fons);
		font: 700 10px/17px var(--font-body);
	}
	.rail-sep {
		height: 1px;
		margin: 4px 10px;
		background: var(--t-linha);
	}

	/* Lo tirador, a costat del rail */
	.tirador {
		position: absolute;
		z-index: 999;
		top: 7.2rem;
		left: calc(var(--marge, 1rem) + 5.2rem);
		width: min(21rem, calc(100% - var(--marge, 1rem) - 6.2rem));
		max-height: calc(100% - 7.2rem - 4rem);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--t-linha) transparent;
		padding: 1rem 1.05rem 1.1rem;
		background: color-mix(in srgb, var(--t-fons-2) 93%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		color: var(--t-tinta);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}
	h2 {
		margin: 0;
		font: 400 1.45rem/1.1 var(--font-heading);
	}
	.tampar {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: none;
		color: var(--t-aur-clar);
		font-size: 1.1rem;
		cursor: pointer;
	}
	.sota {
		margin: 0.2rem 0 0.6rem;
		font-size: 0.76rem;
		color: var(--t-tinta-2);
	}
	.res {
		margin: 0.4rem 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.titolet {
		margin: 0.9rem 0 0.45rem;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.linha {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.7rem;
		align-items: center;
		padding: 0.55rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.linha.escantida {
		opacity: 0.55;
	}
	.apercebut {
		display: block;
		width: 52px;
		height: 36px;
		border-radius: 8px;
		overflow: hidden;
		background: var(--t-fons);
		border: 1px solid var(--t-linha);
		color: var(--t-tinta);
	}
	.apercebut svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.cos {
		min-width: 0;
	}
	.cos b {
		display: block;
		font-size: 0.88rem;
		font-weight: 700;
	}
	.cos small {
		display: block;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* bascula (interruptor) */
	.basc {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-tinta) 20%, transparent);
		cursor: pointer;
		transition: background 0.2s;
	}
	.basc::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--t-tinta);
		transition: transform 0.2s;
	}
	.basc[aria-checked='true'] {
		background: var(--t-aur);
	}
	.basc[aria-checked='true']::after {
		transform: translateX(14px);
		background: var(--t-fons);
	}
	.basc:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* color : una pastilha que dobrís lo selector del sistèma */
	.mostra {
		position: relative;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		cursor: pointer;
	}
	.mostra input {
		position: absolute;
		inset: -6px;
		width: calc(100% + 12px);
		height: calc(100% + 12px);
		padding: 0;
		border: 0;
		cursor: pointer;
	}

	/* pastilhas dels dialèctes */
	.pastilhas {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 0.45rem;
	}
	.pastilha {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 3px 9px 3px 6px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.72rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.pastilha i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.pastilha i.cro {
		border-radius: 2px;
		background: repeating-linear-gradient(45deg, var(--t-terra-viu) 0 1.5px, transparent 1.5px 3.5px);
	}
	.pastilha[aria-pressed='true'] {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.pastilha.totes {
		color: var(--t-aur-clar);
	}

	/* fonses en vinhetas */
	.fonses {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}
	.fons {
		display: grid;
		gap: 5px;
		padding: 0 0 6px;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.7rem/1.1 var(--font-body);
		cursor: pointer;
	}
	.fons i {
		display: block;
		height: 34px;
	}
	.fons[aria-checked='true'] {
		border-color: var(--t-aur);
		box-shadow: inset 0 0 0 1px var(--t-aur);
	}
	.fons-estelas {
		background:
			radial-gradient(circle at 30% 40%, #ffd47f 0 1px, transparent 2px) 0 0 / 9px 9px,
			radial-gradient(circle at 70% 60%, #f5ead8 0 0.8px, transparent 1.6px) 0 0 / 13px 11px,
			#1d0f0a;
	}
	.fons-occitan {
		background:
			linear-gradient(135deg, transparent 46%, #e7b9a3 47% 50%, transparent 51%),
			linear-gradient(20deg, transparent 60%, #f2dfb8 61% 63%, transparent 64%),
			#3a2f2a;
	}
	.fons-natural {
		background:
			radial-gradient(ellipse at 30% 70%, #5e7b3a, transparent 60%),
			radial-gradient(ellipse at 75% 30%, #8a7a52, transparent 55%),
			#2f3a24;
	}
	.fons-satellite {
		background:
			radial-gradient(ellipse at 40% 60%, #3d5130, transparent 60%),
			radial-gradient(ellipse at 80% 20%, #6b6046, transparent 50%),
			#1f2a2e;
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 0.8rem;
	}
	.boton {
		padding: 6px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-aur-clar);
		font: 700 0.75rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.boton:hover {
		border-color: var(--t-aur);
	}
	.admin {
		display: block;
		margin-top: 0.9rem;
		padding-top: 0.7rem;
		border-top: 1px solid var(--t-linha);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-aur-clar);
		text-decoration: none;
	}

	/* Pichona nautor (telefon en païsatge, fenèstra corta) : rail mai sarrat */
	@container carta (max-height: 720px) {
		.rail-b {
			padding: 6px 2px 5px;
			font-size: 9.5px;
		}
		.rail-b svg {
			width: 20px;
			height: 20px;
		}
	}
	/* Telefon : rail mai estrech, tirador a costat sus tota la largor */
	@container carta (max-width: 520px) {
		.rail {
			width: 3.9rem;
			left: 0.6rem;
		}
		.tirador {
			left: 4.9rem;
			width: calc(100% - 5.5rem);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rail-b,
		.basc,
		.basc::after {
			transition: none;
		}
	}
</style>
