<script>
	// Son propre profil (2026-10-25) : ce que les autres membres vérifiés
	// verront, et l'état de sa vérification. Surtout des cases à cocher
	// (Romain : « flemme d'écrire ») ; le lieu se cherche dans les communes
	// de la carte, en occitan ou en français, puis dans le monde entier (une
	// commune d'Occitanie porte la croix du logo) ; le texte libre vient en dernier,
	// facultatif. Les réponses du questionnaire d'accueil (âge, genre,
	// profession) n'y paraissent pas.
	import { browser } from '$app/environment';
	import Icona from '$lib/components/Icona.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, DIALECTES, NIVELS, CERCA, AGRADA, cargarIeu } from '$lib/grops/grops.svelte.js';
	import { cargarComunas, cercarComunas, cercarMonde, normC } from '$lib/comunas.js';
	import Crotz from '$lib/components/Crotz.svelte';
	import Avatar from '$lib/grops/Avatar.svelte';

	let fr = $derived(langStore.current === 'fr');
	const MAX = 600;
	const X = {
		oc: {
			titol: 'Mon perfil',
			tornar: 'Tornar a la lista',
			estats: {
				en_espèra: 'Ton perfil es en espèra : la moderacion lo legís lèu. Pòdes ja legir los grops.',
				verificat: 'Ton perfil es verificat : los autres membres lo veson.',
				refusat: 'Ton perfil es pas estat acceptat. Pòdes escriure a la moderacion :'
			},
			contacte: 'Contacte',
			nivel: 'Nivèl',
			cerca: 'Çò que cèrqui',
			agrada: 'Çò que m’agrada',
			ont: 'D’ont',
			ont_ajuda: 'Escriu lo començament del nom : una comuna d’Occitània o un luòc del monde.',
			occitania: 'Occitània',
			ont_lista: 'Pas dins la lista : gardarem çò qu’as escrich.',
			dialecte: 'Dialècte',
			cap: '(cap)',
			presentacion: 'En mai, se vòls',
			presentacion_ajuda: 'Çò que vòls : d’ont venes, perqué l’occitan…',
			enregistrar: 'Enregistrar',
			enregistrat: 'Enregistrat.',
			veire: 'Veire mon perfil',
			questionnaire: 'Per començar, causís un pseudonim.',
			causir: 'Causir un pseudonim',
			perfil_mot: 'Un mot es pas possible dins un perfil.',
			perfil_ligam: 'Pas de ligams dins un perfil.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			titol: 'Mon profil',
			tornar: 'Retour à la liste',
			estats: {
				en_espèra: 'Ton profil est en attente : la modération le lit bientôt. Tu peux déjà lire les groupes.',
				verificat: 'Ton profil est vérifié : les autres membres le voient.',
				refusat: 'Ton profil n’a pas été accepté. Tu peux écrire à la modération :'
			},
			contacte: 'Contact',
			nivel: 'Niveau',
			cerca: 'Ce que je cherche',
			agrada: 'Ce que j’aime',
			ont: 'D’où',
			ont_ajuda: 'Écris le début du nom, en occitan ou en français : une commune d’Occitanie ou n’importe où dans le monde.',
			occitania: 'Occitanie',
			ont_lista: 'Pas dans la liste : on garde ce que tu as écrit.',
			dialecte: 'Dialecte',
			cap: '(aucun)',
			presentacion: 'En plus, si tu veux',
			presentacion_ajuda: 'Ce que tu veux : d’où tu viens, pourquoi l’occitan…',
			enregistrar: 'Enregistrer',
			enregistrat: 'Enregistré.',
			veire: 'Voir mon profil',
			questionnaire: 'Pour commencer, choisis un pseudo.',
			causir: 'Choisir un pseudo',
			perfil_mot: 'Un mot n’est pas possible dans un profil.',
			perfil_ligam: 'Pas de liens dans un profil.',
			error: 'Une erreur : réessaie.'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let cargat = $state(false);
	let existís = $state(false);
	let f = $state({ presentacion: '', ont: '', ont_oc: null, ont_dep: null, dialecte: '', nivel: '', cerca: [], agrada: [] });
	let enregistrant = $state(false);
	let enregistrat = $state(false);
	let error = $state(null);
	// le lieu : ce qu'on tape (q), les communes proposées, celle qu'on survole au clavier
	let q = $state('');
	let trobadas = $state([]);
	let monde = $state([]);
	// les communes d'Occitanie d'abord, puis le reste du monde
	let opcions = $derived([...trobadas.map((c) => ({ c })), ...monde.map((m) => ({ m }))]);
	let cercant = $state(false);
	let minuta, abandon;
	let activa = $state(-1);
	let dobèrt = $state(false);

	// le nom du lieu dans la langue choisie ; dans la liste, l'autre nom à côté
	const nomLuòc = (l) => (fr ? l.ont : (l.ont_oc ?? l.ont)) ?? '';
	const nomComuna = (c) => (fr ? c.fr : (c.oc ?? c.fr));
	const autreNom = (c) => (c.oc ? (fr ? c.oc : c.fr) : null);

	// en développement, « ?simular » montre le formulaire sans compte (mise en page)
	const simular = browser && import.meta.env.DEV && new URLSearchParams(location.search).has('simular');

	$effect(() => {
		if (!grops.uid) {
			if (simular) existís = cargat = true;
			return;
		}
		supabase
			.from('profiles')
			.select('presentacion, ont, ont_oc, ont_dep, dialecte, nivel, cerca, agrada')
			.eq('user_id', grops.uid)
			.maybeSingle()
			.then(({ data }) => {
				existís = !!data;
				if (data) {
					f = {
						presentacion: data.presentacion ?? '',
						ont: data.ont ?? '',
						ont_oc: data.ont_oc,
						ont_dep: data.ont_dep,
						dialecte: data.dialecte ?? '',
						nivel: data.nivel ?? '',
						cerca: data.cerca ?? [],
						agrada: data.agrada ?? []
					};
					q = nomLuòc(f);
				}
				cargat = true;
			});
	});

	// une commune choisie change de nom avec la langue du site
	$effect(() => {
		if (f.ont_dep) q = nomLuòc(f);
	});

	async function tapar() {
		// du texte libre tant qu'on n'a pas choisi : « en linha », Paris…
		f.ont = q;
		f.ont_oc = null;
		f.ont_dep = null;
		await cargarComunas();
		trobadas = cercarComunas(q);
		activa = -1;
		dobèrt = true;
		// le monde : quand on s'arrête de taper (trois lettres au moins),
		// sans redire une commune déjà proposée
		clearTimeout(minuta);
		abandon?.abort();
		monde = [];
		const cerca = q.trim();
		cercant = cerca.length >= 3;
		if (!cercant) return;
		minuta = setTimeout(async () => {
			abandon = new AbortController();
			const r = await cercarMonde(cerca, abandon.signal);
			if (cerca !== q.trim()) return;
			cercant = false;
			const dejà = new Set(trobadas.map((c) => normC(c.fr)));
			monde = r.filter((x) => !(x.pais === 'France' && dejà.has(normC(x.nom)))).slice(0, 8 - trobadas.length);
		}, 300);
	}
	function causir(o) {
		if (o.c) {
			f.ont = o.c.fr;
			f.ont_oc = o.c.oc;
			f.ont_dep = o.c.dep;
			q = nomComuna(o.c);
		} else {
			f.ont = q = o.m.pais && o.m.pais !== 'France' ? `${o.m.nom}, ${o.m.pais}` : o.m.nom;
			f.ont_oc = f.ont_dep = null;
		}
		dobèrt = false;
	}
	function clavier(e) {
		if (!dobèrt || !opcions.length) return;
		const n = opcions.length;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activa = (activa + 1) % n;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activa = activa <= 0 ? n - 1 : activa - 1;
		} else if (e.key === 'Enter' && activa >= 0) {
			e.preventDefault();
			causir(opcions[activa]);
		} else if (e.key === 'Escape') dobèrt = false;
	}

	async function enregistrar(e) {
		e.preventDefault();
		enregistrant = true;
		enregistrat = false;
		error = null;
		const ont = f.ont.trim();
		const { error: err } = await supabase
			.from('profiles')
			.update({
				presentacion: f.presentacion.trim() || null,
				ont: ont || null,
				ont_oc: ont ? f.ont_oc : null,
				ont_dep: ont ? f.ont_dep : null,
				dialecte: f.dialecte || null,
				nivel: f.nivel || null,
				cerca: f.cerca.length ? f.cerca : null,
				agrada: f.agrada.length ? f.agrada : null
			})
			.eq('user_id', grops.uid);
		enregistrant = false;
		if (err) error = /perfil_mot|perfil_ligam/.exec(err.message)?.[0] ?? 'error';
		else {
			enregistrat = true;
			cargarIeu();
		}
	}
</script>

<svelte:head>
	<title>{x.titol} · Lo Ligam</title>
</svelte:head>

{#snippet chips(nom, lista, tipe)}
	<fieldset class="camp">
		<legend>{x[nom]}</legend>
		<div class="chips">
			{#each lista as [v, oc, fr_] (v)}
				<label class="chip">
					{#if tipe === 'radio'}
						<input type="radio" name={nom} value={v} bind:group={f[nom]} />
					{:else}
						<input type="checkbox" value={v} bind:group={f[nom]} />
					{/if}
					{fr ? fr_ : oc}
				</label>
			{/each}
		</div>
	</fieldset>
{/snippet}

<div class="perfil">
	<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
	<header>
		<Avatar pseudo={grops.ieu?.pseudo ?? '…'} id={grops.uid ?? ''} size="4rem" />
		<div>
			<h2>{x.titol}</h2>
			{#if grops.ieu}<p class="pseudo">{grops.ieu.pseudo}</p>{/if}
		</div>
	</header>

	{#if grops.ieu}
		<p class="estat estat-{grops.ieu.verificacion}" role="status">
			{x.estats[grops.ieu.verificacion]}
			{#if grops.ieu.verificacion === 'refusat'}<a href="/contacte">{x.contacte}</a>{/if}
		</p>
	{/if}

	{#if cargat && !existís}
		<p>{x.questionnaire}</p>
		<a class="boton" href="/compte/questionnaire">{x.causir}</a>
	{:else if cargat}
		<form onsubmit={enregistrar}>
			{@render chips('nivel', NIVELS, 'radio')}
			{@render chips('cerca', CERCA, 'checkbox')}
			{@render chips('agrada', AGRADA, 'checkbox')}
			<div class="camp luòc">
				<label for="perfil-ont-camp">{x.ont}</label>
				<small id="perfil-ont">{x.ont_ajuda}</small>
				<input
					id="perfil-ont-camp"
					type="text"
					role="combobox"
					autocomplete="off"
					aria-autocomplete="list"
					aria-expanded={dobèrt && opcions.length > 0}
					aria-controls="perfil-ont-lista"
					aria-activedescendant={activa >= 0 ? `perfil-ont-${activa}` : undefined}
					aria-describedby="perfil-ont"
					maxlength="80"
					bind:value={q}
					oninput={tapar}
					onfocus={cargarComunas}
					onkeydown={clavier}
					onblur={() => (dobèrt = false)}
				/>
				{#if dobèrt && opcions.length}
					<ul id="perfil-ont-lista" role="listbox" aria-label={x.ont}>
						{#each opcions as o, i (o.c ? 'c' + o.c.fr + o.c.dep : 'm' + o.m.nom + o.m.detalh)}
							<li
								id="perfil-ont-{i}"
								role="option"
								aria-selected={i === activa}
								class:activa={i === activa}
								onmousedown={(e) => (e.preventDefault(), causir(o))}
							>
								{#if o.c}
									<strong><Crotz talha={18} teula />{nomComuna(o.c)}</strong>
									<span>{autreNom(o.c) ? `${autreNom(o.c)} · ` : ''}{o.c.dep}</span>
								{:else}
									<strong>{o.m.nom}</strong>
									<span>{o.m.detalh}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else if dobèrt && !cercant && q.trim().length >= 2}
					<small class="fòra">{x.ont_lista}</small>
				{/if}
				{#if f.ont_dep && !dobèrt}
					<small class="occitania"><Crotz talha={20} teula />{x.occitania}</small>
				{/if}
			</div>
			<label class="camp">
				<span>{x.dialecte}</span>
				<select bind:value={f.dialecte}>
					<option value="">{x.cap}</option>
					{#each DIALECTES as [v, oc, fr_] (v)}<option value={v}>{fr ? fr_ : oc}</option>{/each}
				</select>
			</label>
			<label class="camp">
				<span>{x.presentacion}</span>
				<small id="perfil-presentacion">{x.presentacion_ajuda}</small>
				<textarea bind:value={f.presentacion} rows="4" maxlength={MAX} aria-describedby="perfil-presentacion"></textarea>
				<small class="comptador">{f.presentacion.length} / {MAX}</small>
			</label>
			<div class="accions">
				<button type="submit" class="boton" disabled={enregistrant}>{enregistrant ? '…' : x.enregistrar}</button>
				{#if grops.ieu?.verificacion === 'verificat'}
					<a class="secondari" href="/grops/perfil/{encodeURIComponent(grops.ieu.pseudo)}">{x.veire}</a>
				{/if}
			</div>
			{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
			{#if enregistrat}<p class="mercé" role="status">{x.enregistrat}</p>{/if}
		</form>
	{/if}
</div>

<style>
	.perfil {
		display: grid;
		align-content: start;
		gap: var(--esp-24);
		max-width: 38rem;
		padding: var(--esp-24);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: -0.5rem 0 -1rem -0.6rem;
		color: inherit;
	}
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
	}
	header {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1.05;
	}
	.pseudo {
		margin: 2px 0 0;
		color: var(--t-tinta-2);
	}
	/* l'état : un trait d'or quand il attend ou qu'il est refusé */
	.estat {
		margin: 0;
		padding: var(--esp-8) var(--esp-12);
		border-left: 4px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
		line-height: 1.5;
	}
	.estat-verificat {
		border-left-color: var(--t-linha);
		background: none;
		color: var(--t-tinta-2);
	}
	.estat a {
		color: inherit;
		font-weight: 700;
	}
	form {
		display: grid;
		gap: var(--esp-24);
	}
	.camp {
		display: grid;
		gap: var(--esp-4);
		margin: 0;
		padding: 0;
		border: 0;
	}
	.camp > span,
	.luòc > label,
	legend {
		font-weight: 700;
	}
	legend {
		margin-bottom: var(--esp-4);
	}
	small {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}
	.comptador {
		justify-self: end;
		font-variant-numeric: tabular-nums;
	}
	textarea,
	input[type='text'],
	select {
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.45 var(--font-body);
	}
	textarea {
		resize: vertical;
	}
	/* les pastilles : niveau, ce qu'on cherche, ce qu'on aime */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 40px;
		padding: 0.3rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		cursor: pointer;
	}
	.chip:has(input:checked) {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.chip:has(input:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.chip input {
		margin: 0;
		accent-color: var(--t-aur);
	}
	/* le lieu : les communes proposées sous le champ */
	.luòc {
		position: relative;
	}
	.luòc ul {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 5;
		margin: 4px 0 0;
		padding: 4px;
		list-style: none;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
	}
	.luòc li {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 var(--esp-12);
		min-height: 40px;
		padding: 0.5rem 0.7rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.luòc li strong,
	.occitania {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
	}
	.luòc li strong :global(svg) {
		flex: none;
	}
	.occitania {
		color: var(--t-tinta);
		font-weight: 700;
	}
	.luòc li span {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
		margin-left: auto;
		text-align: right;
	}
	.luòc li:hover,
	.luòc li.activa {
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.fòra {
		font-style: italic;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-12);
	}
	.boton {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
		cursor: pointer;
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.6;
	}
	.secondari {
		display: inline-flex;
		align-items: center;
		min-height: 40px;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: inherit;
		text-decoration: none;
	}
	.secondari:hover {
		border-color: var(--t-aur);
	}
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.tornar:focus-visible,
	textarea:focus-visible,
	input:focus-visible,
	select:focus-visible,
	.boton:focus-visible,
	.secondari:focus-visible,
	.estat a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.chip input:focus-visible {
		outline: none;
	}
</style>
