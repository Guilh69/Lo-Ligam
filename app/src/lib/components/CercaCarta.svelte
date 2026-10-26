<script>
	import Icona from '$lib/components/Icona.svelte';
	// Recherche d'un territoire sur la carte (demande de Romain, 2026-10-07) :
	// un lieu (nom occitan, ou français pour les villes principales, sans tenir
	// compte des accents), un département ou une région. Tout est cherché dans
	// le site lui-même : aucun service extérieur, rien ne sort de la page.
	import { LUOCS, dialDe, rencDe } from '$lib/acuelh/carta-estelas.js';
	import { NOMS_FRANCES } from '$lib/carta/nomsFrances.js';
	import { TERRITORIS, NOMS_OC_TER, nomTerritori, sotaTerritori } from '$lib/carta/territoris.js';

	let { lang = 'oc', onCausir = () => {} } = $props();

	const t = {
		oc: {
			etiqueta: 'Cercar sus la carta',
			placeholder: 'Cercar una vila, un despartament…',
			placeholderCurt: 'Cercar un luòc…',
			cap: 'Cap de resultat',
			despartament: 'Despartament',
			region: 'Region',
			esfaçar: 'Escafar'
		},
		fr: {
			etiqueta: 'Chercher sur la carte',
			placeholder: 'Chercher une ville, un département…',
			placeholderCurt: 'Chercher un lieu…',
			cap: 'Aucun résultat',
			despartament: 'Département',
			region: 'Région',
			esfaçar: 'Effacer'
		},
		es: {
			etiqueta: 'Buscar en el mapa',
			placeholder: 'Buscar una ciudad, un departamento…',
			placeholderCurt: 'Buscar un lugar…',
			cap: 'Ningún resultado',
			despartament: 'Departamento',
			region: 'Región',
			esfaçar: 'Borrar'
		},
		en: {
			etiqueta: 'Search the map',
			placeholder: 'Search for a town, a department…',
			placeholderCurt: 'Search for a place…',
			cap: 'No results',
			despartament: 'Department',
			region: 'Region',
			esfaçar: 'Clear'
		},
		ca: {
			etiqueta: 'Cercar al mapa',
			placeholder: 'Cercar una ciutat, un departament…',
			placeholderCurt: 'Cercar un lloc…',
			cap: 'Cap resultat',
			despartament: 'Departament',
			region: 'Regió',
			esfaçar: 'Esborrar'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);
	// Champ étroit (téléphone) : la phrase complète est coupée en plein mot ; on
	// montre alors la version courte (Romain, 2026-10-26). La phrase la plus longue
	// (espagnol) fait ≈ 280 px + 86 px de marges internes.
	let largorCamp = $state(0);
	let curt = $derived(largorCamp > 0 && largorCamp < 380);

	// « Montpelhièr », « montpelhier » et « MONTPELHIER » se valent ; tirets et
	// apostrophes comptent comme des espaces
	const norm = (s) =>
		s
			.normalize('NFD')
			.replace(/\p{M}/gu, '')
			.toLowerCase()
			.replace(/[-'’()]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();

	const INDEX = [
		...LUOCS.map(([lon, lat, nom, , dia, dia2]) => {
			const fr = NOMS_FRANCES[nom] ?? null;
			return { mena: 'luòc', nom, fr, lon, lat, renc: rencDe(nom), dial: dialDe({ nom, dia, dia2 }), k: [norm(nom), ...(fr ? [norm(fr)] : [])] };
		}),
		...TERRITORIS.map((tr) => {
			const oc = NOMS_OC_TER[tr.mena + ':' + tr.code];
			return { ...tr, k: [norm(tr.nom), ...(oc ? [norm(oc)] : [])] };
		})
	];

	function cercar(q) {
		const n = norm(q);
		if (n.length < 2) return [];
		const res = [];
		for (const it of INDEX) {
			let sc = Infinity;
			for (const k of it.k) {
				if (k === n) sc = Math.min(sc, 0);
				else if (k.startsWith(n)) sc = Math.min(sc, 1);
				else if (k.split(' ').some((w) => w.startsWith(n))) sc = Math.min(sc, 2);
				else if (k.includes(n)) sc = Math.min(sc, 3);
			}
			// les grandes villes passent devant les villages, à score égal
			if (sc < Infinity) res.push({ it, sc: sc * 10 + (it.mena === 'luòc' ? it.renc : 1.5) });
		}
		return res
			.sort((a, b) => a.sc - b.sc || a.it.nom.localeCompare(b.it.nom))
			.slice(0, 8)
			.map((r) => r.it);
	}

	let q = $state('');
	let dobèrt = $state(false);
	// la carte revient à son état d'arrivée (fin des premiers pas) : recherche vidée
	$effect(() => {
		const inici = () => ((q = ''), (dobèrt = false));
		addEventListener('carta-inici', inici);
		return () => removeEventListener('carta-inici', inici);
	});
	let actiu = $state(0);
	let resultats = $derived(cercar(q));

	// Nom affiché : occitan ou français selon la page, pour les territoires
	const nomAfichat = (r) => (r.mena === 'luòc' ? r.nom : nomTerritori(r.mena, r.code, r.nom, lang));

	function causir(r) {
		if (!r) return;
		q = nomAfichat(r);
		dobèrt = false;
		onCausir(r);
		// (les premiers pas cochent « Cercar un luòc », Guida.svelte)
		dispatchEvent(new CustomEvent('carta-cercat'));
	}

	function onKey(e) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			dobèrt = true;
			actiu = Math.min(resultats.length - 1, actiu + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			actiu = Math.max(0, actiu - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			causir(resultats[actiu] ?? resultats[0]);
		} else if (e.key === 'Escape') {
			if (dobèrt) dobèrt = false;
			else q = '';
		}
	}

	const segonda = (r) =>
		r.mena === 'luòc'
			? [r.fr && r.fr !== r.nom ? r.fr : null, r.dial].filter(Boolean).join(' · ')
			: (sotaTerritori(r.code, lang) ??
				(r.mena === 'despartament' ? `${tx.despartament} · ${r.code}` : tx.region));
</script>

<div class="cerca" role="search">
	<label class="visually-hidden" for="cerca-carta">{tx.etiqueta}</label>
	<svg class="lópa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"
		><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg
	>
	<input
		id="cerca-carta"
		type="text"
		role="combobox"
		autocomplete="off"
		spellcheck="false"
		placeholder={curt ? tx.placeholderCurt : tx.placeholder}
		bind:clientWidth={largorCamp}
		aria-autocomplete="list"
		aria-expanded={dobèrt && resultats.length > 0}
		aria-controls="cerca-resultats"
		aria-activedescendant={dobèrt && resultats.length ? `cerca-r-${actiu}` : undefined}
		bind:value={q}
		oninput={() => {
			dobèrt = true;
			actiu = 0;
		}}
		onfocus={() => (dobèrt = true)}
		onblur={() => (dobèrt = false)}
		onkeydown={onKey}
	/>
	{#if q}
		<button type="button" class="esfaçar" aria-label={tx.esfaçar} onclick={() => (q = '')}><Icona nom="fermer" size="1.2em" /></button>
	{/if}

	{#if dobèrt && resultats.length}
		<ul id="cerca-resultats" role="listbox" aria-label={tx.etiqueta}>
			{#each resultats as r, i (r.mena + r.nom + (r.code ?? ''))}
				<li
					id="cerca-r-{i}"
					role="option"
					aria-selected={i === actiu}
					onmousedown={(e) => {
						e.preventDefault();
						causir(r);
					}}
					onmouseenter={() => (actiu = i)}
				>
					<span class="nom" lang={r.mena === 'luòc' ? 'oc' : lang}>{nomAfichat(r)}</span>
					<span class="segonda">{segonda(r)}</span>
				</li>
			{/each}
		</ul>
	{:else if dobèrt && q.trim().length >= 2}
		<p class="cap" role="status">{tx.cap}</p>
	{/if}
</div>

<style>
	/* Champ de recherche : verre sombre, en haut au centre, sous le bandeau */
	.cerca {
		position: absolute;
		z-index: 1000;
		top: calc(var(--cap-bas, 5.3rem) + 18px); /* just dejós lo capçal */
		left: 50%;
		transform: translateX(-50%);
		width: min(25rem, calc(100% - 10rem));
		color: var(--t-tinta);
		font-family: var(--font-body);
	}

	/* au-dessus du champ (son verre flouté le fait passer devant sinon) */
	.lópa {
		position: absolute;
		z-index: 1;
		top: 50%;
		left: 0.95rem;
		width: 1.1rem;
		height: 1.1rem;
		transform: translateY(-50%);
		color: var(--t-aur-clar);
		pointer-events: none;
	}

	input {
		width: 100%;
		height: 2.75rem;
		padding: 0 2.6rem 0 2.75rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-fons) 82%, transparent);
		backdrop-filter: blur(8px);
		color: var(--t-tinta);
		font: 400 0.92rem var(--font-body);
		outline: none;
		transition: border-color 0.3s;
	}

	input::placeholder {
		color: var(--t-tinta-2);
	}

	input:hover,
	input:focus-visible {
		border-color: var(--t-aur);
	}

	input:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--t-aur) 35%, transparent);
	}

	.esfaçar {
		position: absolute;
		top: 50%;
		right: 0.6rem;
		width: 1.8rem;
		height: 1.8rem;
		transform: translateY(-50%);
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--t-tinta-2);
		font-size: 1.15rem;
		line-height: 1;
		cursor: pointer;
	}

	.esfaçar:hover,
	.esfaçar:focus-visible {
		color: var(--t-aur);
		outline: none;
	}

	ul,
	.cap {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		margin: 0;
		padding: 0.35rem;
		list-style: none;
		border: 1px solid var(--t-linha);
		border-radius: 16px;
		background: color-mix(in srgb, var(--t-fons-2) 95%, transparent);
		backdrop-filter: blur(10px);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45);
	}

	li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem 0.8rem;
		border-radius: 11px;
		cursor: pointer;
	}

	li[aria-selected='true'] {
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}

	.nom {
		font-weight: 700;
		font-size: 0.92rem;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	li[aria-selected='true'] .nom {
		color: var(--t-aur-clar);
	}

	.segonda {
		flex: none;
		font-size: 0.74rem;
		color: var(--t-tinta-2);
		white-space: nowrap;
	}

	.cap {
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Écran étroit : le bandeau a deux lignes ; le champ se range entre le
	   rail des couches (à gauche) et le bouton d'information (à droite) */
	@media (max-width: 760px) {
		.cerca {
			top: calc(var(--cap-bas, 6.4rem) + 18px);
			left: calc(var(--marge, 1rem) + 5.3rem); /* après le rail des couches */
			right: 4.4rem;
			width: auto;
			transform: none;
		}

		.segonda {
			display: none;
		}
	}
	/* Telefon : las jaces son en bas, la recèrca pren tota la largor (levat
	   lo boton d'informacion a drecha) */
	@container carta (max-width: 600px) {
		.cerca {
			top: calc(var(--cap-bas, 6.4rem) + 18px);
			left: 0.75rem;
			right: 3.95rem;
			width: auto;
			transform: none;
		}
	}
</style>
