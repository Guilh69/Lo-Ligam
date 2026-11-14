<script>
	// Choix d'une commune par autocomplétion (API Adresse, communes seulement).
	// On ne garde que le centre de la commune renvoyé par l'API, arrondi à deux
	// décimales (environ 1 km) : jamais une position GPS ni une adresse.
	// Même principe que $lib/components/LocationAutocomplete.svelte, mais ici on
	// a besoin des coordonnées du centre, que ce composant-là ne renvoie pas.
	let { value = $bindable(''), onchoose, id, placeholder = 'Commencer à taper le nom' } = $props();

	let suggestions = $state([]);
	let ouvert = $state(false);
	let actif = $state(-1);
	let message = $state('');
	let minuteur;
	let controleur;
	const listeId = `liste-${Math.random().toString(36).slice(2, 8)}`;

	const arrondir = (x) => Math.round(x * 100) / 100;

	async function chercher(q) {
		controleur?.abort();
		const texte = q.trim();
		if (texte.length < 3) {
			suggestions = [];
			ouvert = false;
			return;
		}
		controleur = new AbortController();
		try {
			const res = await fetch(
				`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(texte)}&type=municipality&limit=6`,
				{ signal: controleur.signal }
			);
			if (!res.ok) throw new Error('api');
			const json = await res.json();
			suggestions = (json.features || [])
				.map((f) => ({
					nom: (f.properties.city || f.properties.name).replace(/\s+\d+(er|e)\s+Arrondissement$/i, ''),
					contexte: f.properties.context,
					lat: arrondir(f.geometry.coordinates[1]),
					lon: arrondir(f.geometry.coordinates[0])
				}))
				.filter((s, i, tous) => tous.findIndex((t) => t.nom === s.nom && t.contexte === s.contexte) === i);
			message = suggestions.length ? '' : 'Aucune commune trouvée.';
			ouvert = true;
			actif = -1;
		} catch (e) {
			if (/** @type {any} */ (e).name === 'AbortError') return;
			suggestions = [];
			message = 'La recherche de commune ne répond pas. Réessaie dans un instant.';
			ouvert = true;
		}
	}

	function saisie() {
		clearTimeout(minuteur);
		minuteur = setTimeout(() => chercher(value), 250);
	}

	function choisir(s) {
		// la zone couverte par la base : France métropolitaine et alentours
		if (s.lat < 34 || s.lat > 52 || s.lon < -6 || s.lon > 14) {
			message = 'Cette commune est hors de la zone prise en charge.';
			ouvert = true;
			return;
		}
		value = s.nom;
		ouvert = false;
		suggestions = [];
		message = '';
		onchoose?.({ nom: s.nom, lat: s.lat, lon: s.lon });
	}

	function touche(e) {
		if (!ouvert || !suggestions.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			actif = (actif + 1) % suggestions.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			actif = (actif - 1 + suggestions.length) % suggestions.length;
		} else if (e.key === 'Enter' && actif >= 0) {
			e.preventDefault();
			choisir(suggestions[actif]);
		} else if (e.key === 'Escape') {
			ouvert = false;
		}
	}
</script>

<div class="comuna">
	<input
		{id}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-expanded={ouvert}
		aria-controls={listeId}
		aria-autocomplete="list"
		{placeholder}
		bind:value
		oninput={saisie}
		onkeydown={touche}
		onblur={() => setTimeout(() => (ouvert = false), 150)}
	/>
	{#if ouvert}
		<ul id={listeId} role="listbox" class="options">
			{#each suggestions as s, i (s.nom + s.contexte)}
				<li role="option" aria-selected={i === actif}>
					<button type="button" class:actif={i === actif} onmousedown={(e) => e.preventDefault()} onclick={() => choisir(s)}>
						<span>{s.nom}</span>
						<small>{s.contexte}</small>
					</button>
				</li>
			{/each}
			{#if message}<li class="aucune" role="presentation">{message}</li>{/if}
		</ul>
	{/if}
</div>

<style>
	.comuna {
		position: relative;
	}
	input {
		width: 100%;
		box-sizing: border-box;
		min-height: 2.75rem;
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--t-tinta-2);
		border-radius: 0;
		padding: var(--esp-4) 0;
	}
	input:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.options {
		position: absolute;
		z-index: 5;
		left: 0;
		right: 0;
		margin: 0;
		padding: 0;
		list-style: none;
		background: var(--t-fons);
		border: 1px solid var(--t-linha);
	}
	.options button {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 2.75rem;
		padding: var(--esp-8) var(--esp-12);
		font: inherit;
		text-align: left;
		color: var(--t-tinta);
		background: none;
		border: 0;
		cursor: pointer;
	}
	.options button:hover,
	.options button.actif {
		background: var(--t-fons-2);
	}
	.options small {
		color: var(--t-tinta-2);
	}
	.aucune {
		padding: var(--esp-8) var(--esp-12);
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
</style>
