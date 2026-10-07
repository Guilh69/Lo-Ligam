<script>
	import { occitanPlaces } from '$lib/data/occitanPlaces';

	let { value = $bindable('') } = $props();

	let query = $state(value);
	let suggestions = $state([]);
	let open = $state(false);
	let loading = $state(false);
	let activeIndex = $state(-1);
	let debounceTimer;
	let abortController;

	function normalize(str) {
		return str
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
	}

	async function fetchApiAdresse(q, signal) {
		// L'API refuse les requêtes de moins de 3 caractères.
		if (q.trim().length < 3) return [];
		try {
			const res = await fetch(
				`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=6`,
				{ signal }
			);
			if (!res.ok) return [];
			const data = await res.json();
			return (data.features || []).map((f) => ({
				// Les grandes villes découpées en arrondissements (Lyon, Paris,
				// Marseille) apparaissent comme des communes séparées — on
				// revient au nom de la ville pour ne pas encombrer la liste.
				name: (f.properties.city || f.properties.name).replace(
					/\s+\d+(er|e)\s+Arrondissement$/i,
					''
				),
				context: f.properties.context
			}));
		} catch (e) {
			return [];
		}
	}

	async function fetchPhoton(q, signal) {
		// Photon (Komoot, basé sur OpenStreetMap) : conçu pour la recherche
		// au fil de la frappe, contrairement à Nominatim brut qui répond mal
		// aux requêtes tronquées. osm_tag=place filtre aux villes/villages.
		try {
			const res = await fetch(
				`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=fr&osm_tag=place`,
				{ signal }
			);
			if (!res.ok) return [];
			const data = await res.json();
			return (data.features || []).map((f) => ({
				name: f.properties.name,
				context: [f.properties.state, f.properties.country].filter(Boolean).join(', ')
			}));
		} catch (e) {
			return [];
		}
	}

	function dedupe(list) {
		const seen = new Set();
		return list.filter((r) => {
			const key = normalize(r.name) + '|' + normalize(r.context || '');
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}

	async function runSearch(q) {
		const trimmed = q.trim();
		if (trimmed.length < 3) {
			suggestions = [];
			open = false;
			return;
		}
		if (abortController) abortController.abort();
		abortController = new AbortController();
		const { signal } = abortController;
		loading = true;

		// Si la saisie correspond au début d'un nom occitan connu, on
		// cherche la commune française correspondante en premier (avant la
		// saisie brute), pour qu'elle passe devant les communes françaises
		// qui contiennent le même bout de texte par coïncidence.
		const occMatches = occitanPlaces.filter((p) => normalize(p.oc).startsWith(normalize(trimmed)));
		const queryTerms = new Set([...occMatches.map((p) => p.fr), trimmed]);

		let results = [];
		for (const term of queryTerms) {
			results.push(...(await fetchApiAdresse(term, signal)));
		}
		results = dedupe(results);

		if (results.length === 0) {
			results = await fetchPhoton(trimmed, signal);
		}

		// Annote les résultats français qui correspondent à une ville
		// occitane connue, pour afficher les deux noms.
		results = results.map((r) => {
			const occ = occitanPlaces.find((p) => normalize(p.fr) === normalize(r.name));
			return occ ? { ...r, oc: occ.oc } : r;
		});

		if (signal.aborted) return;
		suggestions = results.slice(0, 8);
		open = suggestions.length > 0;
		activeIndex = -1;
		loading = false;
	}

	function handleInput(e) {
		query = e.currentTarget.value;
		value = query;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => runSearch(query), 320);
	}

	function selectSuggestion(s) {
		const display = s.oc ? `${s.name} · ${s.oc}` : s.name;
		query = display;
		value = display;
		suggestions = [];
		open = false;
	}

	function handleKeydown(e) {
		if (!open || suggestions.length === 0) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % suggestions.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
		} else if (e.key === 'Enter') {
			if (activeIndex >= 0) {
				e.preventDefault();
				selectSuggestion(suggestions[activeIndex]);
			}
		} else if (e.key === 'Escape') {
			open = false;
		}
	}

	function handleBlur() {
		// Laisse le temps au clic sur une suggestion de s'exécuter avant de fermer.
		setTimeout(() => (open = false), 150);
	}

	function handleFocus() {
		if (suggestions.length) open = true;
	}
</script>

<div class="location-autocomplete">
	<input
		type="text"
		value={query}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		onfocus={handleFocus}
		placeholder="Vila, region…"
		maxlength="80"
		autocomplete="off"
		role="combobox"
		aria-expanded={open}
		aria-autocomplete="list"
	/>
	{#if loading}<span class="loading-dot" aria-hidden="true"></span>{/if}
	{#if open}
		<ul class="suggestions" role="listbox">
			{#each suggestions as s, i (s.name + s.context)}
				<li role="option" aria-selected={i === activeIndex}>
					<button
						type="button"
						class="suggestion"
						class:active={i === activeIndex}
						onmousedown={(e) => e.preventDefault()}
						onclick={() => selectSuggestion(s)}
					>
						<span class="s-name">{s.name}{#if s.oc}<em> · {s.oc}</em>{/if}</span>
						{#if s.context}<span class="s-context">{s.context}</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.location-autocomplete {
		position: relative;
	}

	input {
		width: 100%;
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 400;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.55); /* contraste 3:1 (WCAG 1.4.11) */
		background: var(--color-cream);
		color: var(--color-text);
	}

	input:focus {
		outline: none;
		border-color: var(--color-teal);
	}

	.loading-dot {
		position: absolute;
		right: 0.8rem;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-teal);
		opacity: 0.5;
		animation: pulse 900ms ease-in-out infinite;
	}

	.suggestions {
		position: absolute;
		z-index: 20;
		top: calc(100% + 0.3rem);
		left: 0;
		right: 0;
		margin: 0;
		padding: 0.3rem;
		list-style: none;
		background: white;
		border-radius: 12px;
		box-shadow: 0 12px 28px rgba(58, 42, 32, 0.18);
		max-height: 14rem;
		overflow-y: auto;
	}

	.suggestion {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		border: none;
		background: none;
		text-align: left;
		padding: 0.5rem 0.6rem;
		border-radius: 8px;
		cursor: pointer;
		font-family: var(--font-body);
	}

	.suggestion:hover,
	.suggestion.active {
		background: rgba(31, 95, 99, 0.1);
	}

	.s-name {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.s-name em {
		font-weight: 400;
		font-style: italic;
		color: var(--color-teal);
	}

	.s-context {
		font-size: 0.78rem;
		color: rgba(58, 42, 32, 0.6);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>
