<script>
	// Essai (Romain, 14-11) : mise en relation entre occitanophones, à la place
	// des groupes avec messagerie (rangés sur la branche archiu/grops-2026-11-14).
	// Modèle choisi : Mintzalagun (Pays basque), locuteurs et apprenants réunis
	// par commune. Le site présente les gens ; tout se passe ensuite ailleurs.
	// Contact par double accord : rien n'est montré avant que l'autre accepte.
	// Données inventées, aucune écriture en base. Page non indexée.
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';

	const COMUNAS = ['Albi', 'Rodez', 'Gaillac', 'Carmaux'];

	const PERSONAS = [
		{ id: 1, pseudo: 'Marieta', ròtle: 'parla', comuna: 'Albi', km: 0, interesses: ['chant', 'jardin'], vist: 'cette semaine', contacte: 'WhatsApp' },
		{ id: 2, pseudo: 'Pèire_81', ròtle: 'apren', comuna: 'Albi', km: 0, interesses: ['rugby', 'histoire'], vist: 'hier', contacte: 'Téléphone' },
		{ id: 3, pseudo: 'Joana', ròtle: 'parla', comuna: 'Gaillac', km: 22, interesses: ['cuisine', 'vigne'], vist: 'ce mois-ci', contacte: 'Signal' },
		{ id: 4, pseudo: 'Ferran', ròtle: 'apren', comuna: 'Carmaux', km: 16, interesses: ['randonnée', 'musique'], vist: 'cette semaine', contacte: 'Instagram' },
		{ id: 5, pseudo: 'Ramon', ròtle: 'parla', comuna: 'Rodez', km: 76, interesses: ['théâtre'], vist: 'il y a deux mois', contacte: 'Téléphone' }
	];

	const ANÓNCIAS = [
		{ id: 1, qui: 'Pèire_81', comuna: 'Albi', tèxte: 'Je cherche quelqu’un qui parle occitan pour un café par semaine, en ville. Niveau débutant, patience appréciée.', quand: 'il y a 3 jours' },
		{ id: 2, qui: 'Joana', comuna: 'Gaillac', tèxte: 'Je parle depuis toujours, je peux accueillir deux ou trois apprenants le samedi matin au marché.', quand: 'il y a 9 jours' }
	];

	const CERCLES = [
		{ id: 1, nom: 'Cercle du jeudi', comuna: 'Albi', luòc: 'Café, place du Vigan', ritme: 'chaque jeudi, 18 h', membres: 7, darrièr: 'il y a 6 jours', actiu: true },
		{ id: 2, nom: 'Balade parlée', comuna: 'Carmaux', luòc: 'Départ de la mairie', ritme: 'un dimanche par mois', membres: 4, darrièr: 'il y a 3 semaines', actiu: true },
		{ id: 3, nom: 'Veillée de Rodez', comuna: 'Rodez', luòc: 'Salle des fêtes', ritme: 'tous les quinze jours', membres: 11, darrièr: 'il y a 5 mois', actiu: false }
	];

	let comuna = $state('Albi');
	let ròtle = $state('tots'); // tots | parla | apren
	let distància = $state(30);

	let vesins = $derived(
		PERSONAS.filter((p) => (ròtle === 'tots' || p.ròtle === ròtle) && distanciaDe(p) <= distància).sort(
			(a, b) => distanciaDe(a) - distanciaDe(b)
		)
	);

	// Distances inventées entre les quatre communes, pour l'essai.
	const KM = { Albi: { Albi: 0, Gaillac: 22, Carmaux: 16, Rodez: 76 }, Gaillac: { Albi: 22, Gaillac: 0, Carmaux: 35, Rodez: 95 }, Carmaux: { Albi: 16, Gaillac: 35, Carmaux: 0, Rodez: 60 }, Rodez: { Albi: 76, Gaillac: 95, Carmaux: 60, Rodez: 0 } };
	function distanciaDe(p) {
		return KM[comuna][p.comuna];
	}

	// Demandes : id de la personne → 'escriure' | 'espèra' | 'acceptada'
	let demandas = $state({});
	let messatge = $state('');
	let avertit = $state(false);

	function obrir(id) {
		demandas[id] = 'escriure';
		messatge = '';
		avertit = false;
	}
	function mandar(id) {
		demandas[id] = 'espèra';
	}
	function simularAcòrdi(id) {
		demandas[id] = 'acceptada';
	}
	function anullar(id) {
		delete demandas[id];
	}

	const ROTLE = { parla: 'parle occitan', apren: 'apprend' };
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

	<form class="filtre" onsubmit={(e) => e.preventDefault()}>
		<label>
			<span>Ma commune</span>
			<select bind:value={comuna}>
				{#each COMUNAS as c (c)}<option>{c}</option>{/each}
			</select>
		</label>
		<label>
			<span>Jusqu’à</span>
			<select bind:value={distància}>
				<option value={10}>10 km</option>
				<option value={30}>30 km</option>
				<option value={100}>100 km</option>
			</select>
		</label>
		<fieldset>
			<legend>Je cherche</legend>
			<div class="causida">
				{#each [['tots', 'tout le monde'], ['parla', 'des locuteurs'], ['apren', 'des apprenants']] as [v, nom] (v)}
					<label class:actiu={ròtle === v}>
						<input type="radio" name="rotle" value={v} bind:group={ròtle} />{nom}
					</label>
				{/each}
			</div>
		</fieldset>
	</form>

	<section aria-labelledby="t-vesins">
		<h2 id="t-vesins"><span lang="oc">Prèp de tu</span> <i>(près de toi)</i></h2>
		{#if vesins.length === 0}
			<p class="void">Personne dans ce rayon pour l’instant. Élargis la distance, ou dépose une annonce.</p>
		{/if}
		<ul class="lista">
			{#each vesins as p (p.id)}
				{@const d = demandas[p.id]}
				<li class="persona">
					<div class="linha">
						<div class="qui">
							<span class="pseudo">{p.pseudo}</span>
							<span class="meta">{ROTLE[p.ròtle]} · {p.comuna}{distanciaDe(p) ? `, ${distanciaDe(p)} km` : ''} · vu {p.vist}</span>
							<span class="interesses">{p.interesses.join(', ')}</span>
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
								J’ai lu ces conseils.
							</label>
							<div class="accions">
								<button class="boton" type="button" disabled={!avertit || messatge.trim().length < 10} onclick={() => mandar(p.id)}>Envoyer la demande</button>
								<button class="ligam" type="button" onclick={() => anullar(p.id)}>Annuler</button>
							</div>
						</div>
					{:else if d === 'espèra'}
						<div class="demanda">
							<p>{p.pseudo} reçoit ta phrase. Tant qu’il ou elle n’a pas accepté, aucun de vous deux ne voit le contact de l’autre.</p>
							<button class="ligam" type="button" onclick={() => simularAcòrdi(p.id)}>Pour l’essai : simuler son accord</button>
						</div>
					{:else if d === 'acceptada'}
						<div class="demanda">
							<p>
								{p.pseudo} a accepté. Son contact : <strong>{p.contacte}</strong> (dans le vrai site, le numéro ou le compte
								qu’il ou elle a choisi de montrer). Le tien lui est montré aussi.
							</p>
							<button class="ligam" type="button" onclick={() => anullar(p.id)}>Retirer le contact</button>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="t-anoncias">
		<h2 id="t-anoncias"><span lang="oc">Las anóncias</span> <i>(les annonces)</i></h2>
		<ul class="lista">
			{#each ANÓNCIAS as a (a.id)}
				<li class="anoncia">
					<p class="citacion">{a.tèxte}</p>
					<p class="meta">{a.qui}, {a.comuna} · {a.quand}</p>
				</li>
			{/each}
		</ul>
		<button class="boton secondari" type="button" disabled title="Dans le vrai site">Déposer une annonce</button>
	</section>

	<section aria-labelledby="t-cercles">
		<h2 id="t-cercles"><span lang="oc">Los cercles</span> <i>(les groupes)</i></h2>
		<p class="intro">Des groupes qui se retrouvent en vrai. On voit s’ils sont actifs, puis on demande à les rejoindre ; le reste se passe chez eux.</p>
		<ul class="lista">
			{#each CERCLES as c (c.id)}
				<li class="persona">
					<div class="linha">
						<div class="qui">
							<span class="pseudo">{c.nom}</span>
							<span class="meta">{c.comuna} · {c.luòc} · {c.ritme}</span>
							<span class="meta" class:dormant={!c.actiu}>
								{c.membres} membres · dernière rencontre {c.darrièr}{c.actiu ? '' : ' · semble en sommeil'}
							</span>
						</div>
						<button class="boton" type="button" disabled={!c.actiu}>Demander à rejoindre</button>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<section class="cossi" aria-labelledby="t-cossi">
		<h2 id="t-cossi">Comment ça marche</h2>
		<ol>
			<li><span class="n">01</span><p>Un compte avec une adresse vérifiée, un profil : ta commune (jamais ton adresse), ce que tu cherches, tes goûts.</p></li>
			<li><span class="n">02</span><p>Tu demandes un contact avec une phrase. L’autre accepte ou non ; sans réponse, rien ne se passe. Cinq demandes par semaine au plus.</p></li>
			<li><span class="n">03</span><p>S’il ou elle accepte, chacun voit le moyen de contact que l’autre a choisi de montrer. Le site s’arrête là.</p></li>
		</ol>
		<p class="intro">Signaler ou bloquer à tout moment ; trois signalements suspendent un profil le temps d’un examen. Effacer son profil : un clic. Réservé aux plus de 18 ans.</p>
		<p class="credit">Mécanique inspirée de Mintzalagun, programme de conversation du Pays basque.</p>
	</section>
</PaginaSimpla>

<style>
	.essai {
		margin: 0.5rem 0 0;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	section {
		margin-top: clamp(2rem, 5vw, 3rem);
		max-width: 46rem;
	}
	h2 {
		margin: 0 0 0.75rem;
		font-size: clamp(1.25rem, 2.6vw, 1.6rem);
		font-weight: 600;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--t-linha);
	}
	h2 i {
		font-weight: 400;
		font-size: 0.75em;
		color: var(--t-tinta-2);
	}

	.filtre {
		margin-top: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		align-items: flex-end;
		max-width: 46rem;
	}
	.filtre label > span,
	legend {
		display: block;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
		margin-bottom: 0.25rem;
		padding: 0;
	}
	fieldset {
		border: 0;
		margin: 0;
		padding: 0;
	}
	select {
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--t-tinta-2);
		padding: 0.25rem 1.5rem 0.25rem 0;
		min-height: 2.75rem;
		border-radius: 0;
	}
	select option {
		color: initial;
	}
	.causida {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.25rem;
	}
	.causida label {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}
	.causida label.actiu {
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

	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.lista > li {
		padding: 1rem 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.linha {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem 1.5rem;
	}
	.qui {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	.pseudo {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.meta {
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.meta.dormant {
		font-style: italic;
	}
	.interesses {
		font-size: 0.9rem;
	}

	.boton {
		font: inherit;
		font-weight: 700;
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		border: 0;
		border-radius: 3px;
		padding: 0.6rem 1.1rem;
		min-height: 2.75rem;
		cursor: pointer;
	}
	.boton:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.boton.secondari {
		margin-top: 1rem;
	}
	.boton:focus-visible,
	.ligam:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.ligam {
		font: inherit;
		color: var(--t-tinta);
		background: none;
		border: 0;
		padding: 0.5rem 0;
		min-height: 2.75rem;
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
		margin-top: 1rem;
		padding-left: 1rem;
		max-width: 38rem;
	}
	.demanda p {
		margin: 0 0 0.75rem;
		line-height: 1.5;
	}
	.avis {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camp {
		display: block;
		position: relative;
	}
	.camp > span:first-child {
		display: block;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
		margin-bottom: 0.25rem;
	}
	textarea {
		font: inherit;
		width: 100%;
		box-sizing: border-box;
		color: var(--t-tinta);
		background: transparent;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
		padding: 0.5rem;
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
		gap: 0.5rem;
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
		gap: 1.5rem;
		align-items: center;
		margin-top: 0.5rem;
	}

	.anoncia .citacion {
		margin: 0 0 0.25rem;
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.anoncia .meta {
		margin: 0;
	}
	.intro {
		margin: 0 0 0.5rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.void {
		color: var(--t-tinta-2);
	}

	.cossi ol {
		list-style: none;
		margin: 0 0 1.5rem;
		padding: 0;
	}
	.cossi li {
		display: grid;
		grid-template-columns: 3.5rem 1fr;
		gap: 0 1rem;
		padding: 0.75rem 0;
	}
	.cossi .n {
		font-family: 'Limelight', serif;
		font-size: 1.75rem;
		color: var(--t-aur);
		line-height: 1;
	}
	.cossi li p {
		margin: 0;
		line-height: 1.5;
	}
	.credit {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
</style>
