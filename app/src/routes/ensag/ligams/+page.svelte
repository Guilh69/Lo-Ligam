<script>
	// Essai (Romain, 14-11) : mise en relation entre occitanophones, à la place
	// des groupes avec messagerie (rangés sur la branche archiu/grops-2026-11-14).
	// Modèle choisi : Mintzalagun (Pays basque), locuteurs et apprenants réunis
	// par commune. Le site présente les gens ; tout se passe ensuite ailleurs.
	// Contact par double accord : rien n'est montré avant que l'autre accepte.
	// v2 (14-11, « plus de clarté ») : onglets par catégorie (style des onglets
	// de Jòcs), filtres dans une colonne à part avec une phrase de résumé.
	// Données inventées, aucune écriture en base. Page non indexée.
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';

	const COMUNAS = ['Albi', 'Rodez', 'Gaillac', 'Carmaux'];
	const INTERESSES = ['chant', 'cuisine', 'histoire', 'jardin', 'musique', 'randonnée', 'rugby', 'théâtre', 'vigne'];

	const PERSONAS = [
		{ id: 1, pseudo: 'Marieta', ròtle: 'parla', comuna: 'Albi', interesses: ['chant', 'jardin'], vist: 'cette semaine', contacte: 'WhatsApp' },
		{ id: 2, pseudo: 'Pèire_81', ròtle: 'apren', comuna: 'Albi', interesses: ['rugby', 'histoire'], vist: 'hier', contacte: 'Téléphone' },
		{ id: 3, pseudo: 'Joana', ròtle: 'parla', comuna: 'Gaillac', interesses: ['cuisine', 'vigne'], vist: 'ce mois-ci', contacte: 'Signal' },
		{ id: 4, pseudo: 'Ferran', ròtle: 'apren', comuna: 'Carmaux', interesses: ['randonnée', 'musique'], vist: 'cette semaine', contacte: 'Instagram' },
		{ id: 5, pseudo: 'Ramon', ròtle: 'parla', comuna: 'Rodez', interesses: ['théâtre', 'histoire'], vist: 'il y a deux mois', contacte: 'Téléphone' }
	];

	const ANÓNCIAS = [
		{ id: 1, qui: 'Pèire_81', ròtle: 'apren', comuna: 'Albi', interesses: ['rugby'], tèxte: 'Je cherche quelqu’un qui parle occitan pour un café par semaine, en ville. Niveau débutant, patience appréciée.', quand: 'il y a 3 jours' },
		{ id: 2, qui: 'Joana', ròtle: 'parla', comuna: 'Gaillac', interesses: ['cuisine'], tèxte: 'Je parle depuis toujours, je peux accueillir deux ou trois apprenants le samedi matin au marché.', quand: 'il y a 9 jours' }
	];

	const CERCLES = [
		{ id: 1, nom: 'Cercle du jeudi', comuna: 'Albi', interesses: ['chant'], luòc: 'Café, place du Vigan', ritme: 'chaque jeudi, 18 h', membres: 7, darrièr: 'il y a 6 jours', actiu: true },
		{ id: 2, nom: 'Balade parlée', comuna: 'Carmaux', interesses: ['randonnée'], luòc: 'Départ de la mairie', ritme: 'un dimanche par mois', membres: 4, darrièr: 'il y a 3 semaines', actiu: true },
		{ id: 3, nom: 'Veillée de Rodez', comuna: 'Rodez', interesses: ['théâtre'], luòc: 'Salle des fêtes', ritme: 'tous les quinze jours', membres: 11, darrièr: 'il y a 5 mois', actiu: false }
	];

	// Distances inventées entre les quatre communes, pour l'essai.
	const KM = {
		Albi: { Albi: 0, Gaillac: 22, Carmaux: 16, Rodez: 76 },
		Gaillac: { Albi: 22, Gaillac: 0, Carmaux: 35, Rodez: 95 },
		Carmaux: { Albi: 16, Gaillac: 35, Carmaux: 0, Rodez: 60 },
		Rodez: { Albi: 76, Gaillac: 95, Carmaux: 60, Rodez: 0 }
	};

	const VISTAS = [
		{ id: 'personas', oc: 'Personas', fr: 'personnes', un: 'personne', unes: 'personnes' },
		{ id: 'anoncias', oc: 'Anóncias', fr: 'annonces', un: 'annonce', unes: 'annonces' },
		{ id: 'cercles', oc: 'Cercles', fr: 'groupes', un: 'groupe', unes: 'groupes' },
		{ id: 'cossi', oc: 'Mòde d’emplec', fr: 'mode d’emploi' }
	];
	const ROTLE = { parla: 'parle occitan', apren: 'apprend' };
	const DEFAUTS = { comuna: 'Albi', distància: 30, ròtle: 'tots', interès: '' };

	let vista = $state('personas');
	let comuna = $state(DEFAUTS.comuna);
	let distància = $state(DEFAUTS.distància);
	let ròtle = $state(DEFAUTS.ròtle);
	let interès = $state(DEFAUTS.interès);

	const km = (o) => KM[comuna][o.comuna];
	const garda = (o, ambRòtle = true) =>
		km(o) <= distància &&
		(!interès || o.interesses.includes(interès)) &&
		(!ambRòtle || ròtle === 'tots' || !o.ròtle || o.ròtle === ròtle);

	let resultats = $derived({
		personas: PERSONAS.filter((p) => garda(p)).sort((a, b) => km(a) - km(b)),
		anoncias: ANÓNCIAS.filter((a) => garda(a)).sort((a, b) => km(a) - km(b)),
		cercles: CERCLES.filter((c) => garda(c, false)).sort((a, b) => km(a) - km(b))
	});

	let modificats = $derived(
		(comuna !== DEFAUTS.comuna) + (distància !== DEFAUTS.distància) + (ròtle !== DEFAUTS.ròtle) + (interès !== DEFAUTS.interès)
	);

	// Phrase de résumé : ce que montre l'onglet, avec les filtres en clair.
	let resumit = $derived.by(() => {
		const v = VISTAS.find((x) => x.id === vista);
		const n = resultats[vista].length;
		let f = `${n} ${n > 1 ? v.unes : v.un} à moins de ${distància} km de ${comuna}`;
		if (vista !== 'cercles' && ròtle !== 'tots') f += ròtle === 'parla' ? ', locuteurs' : ', apprenants';
		if (interès) f += `, autour de : ${interès}`;
		return f;
	});

	function reiniciar() {
		comuna = DEFAUTS.comuna;
		distància = DEFAUTS.distància;
		ròtle = DEFAUTS.ròtle;
		interès = DEFAUTS.interès;
	}

	// Filtres ouverts d'office sur ordinateur, repliés sur téléphone.
	let filtresDobèrts = $state(true);
	$effect(() => {
		filtresDobèrts = matchMedia('(min-width: 900px)').matches;
	});

	// Demandes : id → 'escriure' | 'espèra' | 'acceptada'
	let demandas = $state({});
	let messatge = $state('');
	let avertit = $state(false);

	function obrir(id) {
		demandas[id] = 'escriure';
		messatge = '';
		avertit = false;
	}
</script>

<svelte:head>
	<title>Lo Ligam · essai mise en relation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaSimpla
	titol="Parlar ensem"
	frasa="Trouver près de chez toi des personnes qui parlent occitan ou qui l’apprennent. Lo Ligam vous présente ; la suite se passe ailleurs, entre vous."
	parent={{ href: '/amassa', nom: 'Amassa' }}
>
	<p class="essai">Essai, personnes inventées. Rien n’est enregistré.</p>

	<nav class="onglets" aria-label="Catégories">
		{#each VISTAS as v (v.id)}
			<button type="button" aria-current={vista === v.id ? 'page' : undefined} onclick={() => (vista = v.id)}>
				<span lang="oc">{v.oc}</span>
				{#if resultats[v.id]}<span class="nombre">{resultats[v.id].length}</span>{/if}
			</button>
		{/each}
	</nav>

	{#if vista === 'cossi'}
		<section class="cossi" aria-label="Comment ça marche">
			<ol>
				<li><span class="n">01</span><div><h3>Un profil</h3><p>Un compte avec une adresse vérifiée. Ta commune (jamais ton adresse), ce que tu cherches, tes goûts.</p></div></li>
				<li><span class="n">02</span><div><h3>Une demande</h3><p>Tu demandes un contact avec une phrase. L’autre accepte ou non ; sans réponse, rien ne se passe. Cinq demandes par semaine au plus.</p></div></li>
				<li><span class="n">03</span><div><h3>Un accord</h3><p>S’il ou elle accepte, chacun voit le moyen de contact que l’autre a choisi de montrer. Le site s’arrête là.</p></div></li>
			</ol>
			<p class="nota">Signaler ou bloquer à tout moment ; trois signalements suspendent un profil le temps d’un examen. Effacer son profil : un clic. Réservé aux plus de 18 ans.</p>
			<p class="nota">Mécanique inspirée de Mintzalagun, programme de conversation du Pays basque.</p>
		</section>
	{:else}
		<div class="mesa">
			<details class="filtres" bind:open={filtresDobèrts}>
				<summary class="filtres-cap">
					<h2>Filtrer{#if modificats}<span class="nombre"> ({modificats})</span>{/if}</h2>
					<span class="plec" aria-hidden="true">{filtresDobèrts ? 'Replier' : 'Ouvrir'}</span>
				</summary>
				<div class="filtres-cors">
				{#if modificats}
					<button type="button" class="ligam" onclick={reiniciar}>Tout effacer</button>
				{/if}

				<label class="camp">
					<span>Ma commune</span>
					<select bind:value={comuna}>
						{#each COMUNAS as c (c)}<option>{c}</option>{/each}
					</select>
				</label>

				<fieldset class="camp">
					<legend>Distance</legend>
					<div class="causida">
						{#each [10, 30, 100] as d (d)}
							<label class:actiu={distància === d}>
								<input type="radio" name="distancia" value={d} bind:group={distància} />{d} km
							</label>
						{/each}
					</div>
				</fieldset>

				{#if vista !== 'cercles'}
					<fieldset class="camp">
						<legend>Je cherche</legend>
						<div class="causida colomna">
							{#each [['tots', 'tout le monde'], ['parla', 'des locuteurs'], ['apren', 'des apprenants']] as [v, nom] (v)}
								<label class:actiu={ròtle === v}>
									<input type="radio" name="rotle" value={v} bind:group={ròtle} />{nom}
								</label>
							{/each}
						</div>
					</fieldset>
				{/if}

				<label class="camp">
					<span>Centre d’intérêt</span>
					<select bind:value={interès}>
						<option value="">tous</option>
						{#each INTERESSES as i (i)}<option>{i}</option>{/each}
					</select>
				</label>
				</div>
			</details>

			<section class="resultats" aria-live="polite" aria-labelledby="t-resumit">
				<p id="t-resumit" class="resumit">{resumit}</p>

				{#if resultats[vista].length === 0}
					<p class="void">Rien dans ce rayon pour l’instant. Élargis la distance ou retire un filtre.</p>
				{/if}

				{#if vista === 'personas'}
					<ul class="lista">
						{#each resultats.personas as p (p.id)}
							{@const d = demandas[p.id]}
							<li>
								<div class="linha">
									<div class="qui">
										<span class="nom">{p.pseudo}</span>
										<span class="meta">{ROTLE[p.ròtle]} · {p.comuna}{km(p) ? `, ${km(p)} km` : ''} · vu {p.vist}</span>
										<span class="meta">{p.interesses.join(', ')}</span>
									</div>
									{#if !d}
										<button class="boton" type="button" onclick={() => obrir(p.id)}>Demander le contact</button>
									{:else if d === 'espèra'}
										<span class="estat">En attente de son accord</span>
									{:else if d === 'acceptada'}
										<span class="estat ok">Contact partagé</span>
									{/if}
								</div>

								{#if d === 'escriure'}
									<div class="demanda">
										<p class="avis">
											La rencontre se passe en dehors de Lo Ligam, sous votre responsabilité. Pour un premier rendez-vous :
											un lieu public, prévenir un proche, ne rien donner de confidentiel (adresse, papiers, argent).
											Un doute : signale le profil.
										</p>
										<label class="camp">
											<span>Une phrase pour te présenter</span>
											<textarea bind:value={messatge} maxlength="280" rows="3" placeholder="Bonjour, j’apprends depuis un an et je cherche à parler un peu chaque semaine."></textarea>
											<span class="comptador">{messatge.length} / 280</span>
										</label>
										<label class="casa">
											<input type="checkbox" bind:checked={avertit} />
											<span>J’ai lu ces conseils.</span>
										</label>
										<div class="accions">
											<button class="boton" type="button" disabled={!avertit || messatge.trim().length < 10} onclick={() => (demandas[p.id] = 'espèra')}>Envoyer la demande</button>
											<button class="ligam" type="button" onclick={() => delete demandas[p.id]}>Annuler</button>
										</div>
									</div>
								{:else if d === 'espèra'}
									<div class="demanda">
										<p>{p.pseudo} reçoit ta phrase. Tant qu’il ou elle n’a pas accepté, aucun de vous deux ne voit le contact de l’autre.</p>
										<button class="ligam" type="button" onclick={() => (demandas[p.id] = 'acceptada')}>Pour l’essai : simuler son accord</button>
									</div>
								{:else if d === 'acceptada'}
									<div class="demanda">
										<p>
											{p.pseudo} a accepté. Son contact : <strong>{p.contacte}</strong> (dans le vrai site, le numéro ou le compte
											qu’il ou elle a choisi de montrer). Le tien lui est montré aussi.
										</p>
										<button class="ligam" type="button" onclick={() => delete demandas[p.id]}>Retirer le contact</button>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{:else if vista === 'anoncias'}
					<ul class="lista">
						{#each resultats.anoncias as a (a.id)}
							<li>
								<p class="citacion">{a.tèxte}</p>
								<p class="meta">{a.qui}, {ROTLE[a.ròtle]} · {a.comuna}{km(a) ? `, ${km(a)} km` : ''} · {a.quand}</p>
							</li>
						{/each}
					</ul>
					<button class="boton" type="button" disabled title="Dans le vrai site">Déposer une annonce</button>
				{:else if vista === 'cercles'}
					<p class="nota">Des groupes qui se retrouvent en vrai. On voit s’ils sont actifs, puis on demande à les rejoindre ; le reste se passe chez eux.</p>
					<ul class="lista">
						{#each resultats.cercles as c (c.id)}
							<li>
								<div class="linha">
									<div class="qui">
										<span class="nom">{c.nom}</span>
										<span class="meta">{c.comuna}{km(c) ? `, ${km(c)} km` : ''} · {c.luòc} · {c.ritme}</span>
										<span class="meta" class:dormant={!c.actiu}>
											{c.membres} membres · dernière rencontre {c.darrièr}{c.actiu ? '' : ' · semble en sommeil'}
										</span>
									</div>
									<button class="boton" type="button" disabled={!c.actiu}>Demander à rejoindre</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	{/if}
</PaginaSimpla>

<style>
	.essai {
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
		font-size: 0.875rem;
	}

	/* Onglets : la même recette que ceux de Jòcs (trait or sous l'actif). */
	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-32);
		margin-top: var(--esp-32);
		border-bottom: 1px solid var(--t-linha);
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--t-fons);
	}
	.onglets button {
		display: inline-flex;
		align-items: baseline;
		gap: var(--esp-8);
		min-height: 2.75rem;
		padding: var(--esp-8) 0;
		margin-bottom: -1px;
		font: inherit;
		font-size: 1.05rem;
		color: var(--t-tinta-2);
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.onglets button:hover {
		color: var(--t-tinta);
	}
	.onglets button[aria-current='page'] {
		color: var(--t-tinta);
		font-weight: 700;
		border-bottom-color: var(--t-aur);
	}
	.onglets .nombre {
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}

	/* Deux colonnes sur ordinateur : filtres à gauche, résultats à droite. */
	.mesa {
		display: grid;
		gap: var(--esp-32) var(--esp-48);
		margin-top: var(--esp-32);
	}
	@media (min-width: 900px) {
		.mesa {
			grid-template-columns: 15rem minmax(0, 44rem);
		}
		.filtres {
			position: sticky;
			top: 4rem;
			align-self: start;
		}
		.plec {
			display: none;
		}
	}

	.filtres-cors {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--esp-24);
		margin-top: var(--esp-16);
	}
	.filtres-cors > .ligam {
		align-self: flex-start;
		min-height: 2rem;
	}
	.filtres-cap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 2.75rem;
		padding-bottom: var(--esp-8);
		border-bottom: 1px solid var(--t-linha);
		list-style: none;
		cursor: pointer;
	}
	.filtres-cap::-webkit-details-marker {
		display: none;
	}
	.filtres-cap:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.filtres-cap .nombre {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.plec {
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	h2 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
	}
	.camp {
		display: block;
		border: 0;
		margin: 0;
		padding: 0;
	}
	.camp > span:first-child,
	legend {
		display: block;
		padding: 0;
		margin-bottom: var(--esp-4);
		font-size: 0.875rem;
		color: var(--t-tinta-2);
	}
	select {
		width: 100%;
		min-height: 2.75rem;
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--t-tinta-2);
		border-radius: 0;
		padding: var(--esp-4) 0;
		cursor: pointer;
	}
	select option {
		color: initial;
	}
	select:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.causida {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-16);
	}
	.causida.colomna {
		flex-direction: column;
		align-items: flex-start;
	}
	.causida label {
		display: inline-flex;
		align-items: center;
		min-height: 2.5rem;
		color: var(--t-tinta-2);
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.causida label:hover {
		color: var(--t-tinta);
	}
	.causida label.actiu {
		color: var(--t-tinta);
		font-weight: 700;
		border-bottom-color: var(--t-accion);
	}
	.causida input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.causida label:has(input:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.resumit {
		margin: 0;
		padding-bottom: var(--esp-8);
		font-size: 1.15rem;
		font-weight: 700;
		border-bottom: 1px solid var(--t-linha);
	}
	.lista {
		list-style: none;
		margin: 0 0 var(--esp-24);
		padding: 0;
	}
	.lista > li {
		padding: var(--esp-16) 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.linha {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--esp-12) var(--esp-24);
	}
	.qui {
		display: flex;
		flex-direction: column;
		gap: var(--esp-4);
		min-width: 0;
	}
	.nom {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.meta {
		margin: 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.meta.dormant {
		font-style: italic;
	}
	.citacion {
		margin: 0 0 var(--esp-4);
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.nota,
	.void {
		margin: var(--esp-16) 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	.boton {
		min-height: 2.75rem;
		padding: var(--esp-8) var(--esp-16);
		font: inherit;
		font-weight: 700;
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		border: 0;
		border-radius: 3px;
		cursor: pointer;
	}
	.boton:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.boton:focus-visible,
	.ligam:focus-visible,
	.onglets button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.ligam {
		min-height: 2.75rem;
		padding: 0;
		font: inherit;
		font-size: 0.9rem;
		color: var(--t-tinta);
		background: none;
		border: 0;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.estat {
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.estat.ok {
		color: var(--t-aur);
		font-weight: 700;
	}

	.demanda {
		margin-top: var(--esp-16);
		max-width: 38rem;
	}
	.demanda p {
		margin: 0 0 var(--esp-12);
		line-height: 1.5;
	}
	.avis {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: var(--esp-8);
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.comptador {
		display: block;
		text-align: right;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.casa {
		display: flex;
		gap: var(--esp-8);
		align-items: center;
		min-height: 2.75rem;
	}
	.casa input {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--t-accion);
	}
	.accions {
		display: flex;
		gap: var(--esp-24);
		align-items: center;
	}

	.cossi {
		margin-top: var(--esp-32);
		max-width: 44rem;
	}
	.cossi ol {
		list-style: none;
		margin: 0 0 var(--esp-24);
		padding: 0;
	}
	.cossi li {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 0 var(--esp-16);
		padding: var(--esp-16) 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.cossi .n {
		font-family: 'Limelight', serif;
		font-size: 2rem;
		line-height: 1;
		color: var(--t-aur);
	}
	.cossi h3 {
		margin: 0 0 var(--esp-4);
		font-size: 1.05rem;
	}
	.cossi li p {
		margin: 0;
		line-height: 1.5;
	}
</style>
