<script>
	// Studio de voix (lot 2, 2026-11-13) : Romain enregistre les phrases du
	// parcours A1, une à la fois, d'abord sur son téléphone.
	// Enregistrer → Réécouter → Garder (envoi dans le dossier privé voix-brut)
	// ou Recommencer. L'avancement vient du listing du dossier, pas d'une table.
	// L'accès est filtré par admin/+layout.svelte ; ce qui protège vraiment, ce
	// sont les règles de supabase/supabase-voix.sql.
	// La logique est hors de l'écran : $lib/voix/enregistreur.js et studio.js.
	import { onMount, onDestroy, tick } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { simulacion } from '$lib/talhier/notas.svelte.js';
	import { moduls, ordre } from '$lib/lesson/moduls/index.js';
	import { frasasDe } from '$lib/voix/phrases.js';
	import { jouer } from '$lib/voix/lecteur.js';
	import { creerEnregistreur, DUREE_MAX_MS, MESSAGES } from '$lib/voix/enregistreur.js';
	import {
		depotSupabase,
		depotMemoire,
		indexerListing,
		avancement,
		suivanteAFaire,
		garderPrise,
		messageErreur
	} from '$lib/voix/studio.js';

	const MODULES = ordre.map((slug) => ({ slug, modul: moduls[slug], frasas: frasasDe(moduls[slug]) }));

	// mode d'essai (développement, ?edicion=simular) : sans compte, dossier en
	// mémoire avec deux prises d'exemple ; « &panne=1 » fait échouer le premier
	// envoi pour essayer « Réessayer »
	const simular = simulacion();
	let pannes = simular && new URLSearchParams(location.search).get('panne') === '1' ? 1 : 0;
	const depot = simular
		? depotMemoire({
				initial: [`${MODULES[0].frasas[0].clau}.webm`, `${MODULES[0].frasas[1].clau}.m4a`],
				panne: () => pannes-- > 0
			})
		: depotSupabase(supabase);
	const rec = creerEnregistreur();

	let chargement = $state('cours'); // cours | ok | erreur
	let index = $state.raw(new Map()); // clé de phrase → chemins des prises gardées
	let slug = $state(MODULES[0].slug);
	let pos = $state(0);
	let phase = $state('pret'); // pret | demarrage | enregistre | prise | envoi | echec
	let prise = $state.raw(null); // { blob, type, ext, duree, coupee, url }
	/** @type {null | 'prise' | 'gardee'} */
	let ecoute = $state(null);
	let ecoule = $state(0);
	let annonce = $state('');
	let erreur = $state('');

	let boutonEnr = $state();
	let boutonReecouter = $state();
	let arretEcoute = null;
	let chrono = null;

	let modCourant = $derived(MODULES.find((m) => m.slug === slug) ?? MODULES[0]);
	let frasas = $derived(modCourant.frasas);
	let frase = $derived(frasas[pos] ?? frasas[0]);
	let gardees = $derived(index.get(frase.clau) ?? []);
	let av = $derived(avancement(MODULES, index));
	let occupe = $derived(phase === 'demarrage' || phase === 'enregistre' || phase === 'envoi');

	// marques de mise en forme retirées ; espace insécable devant ? ! : ; (pas de « ? » seul en bout de ligne)
	const sansMarques = (t) =>
		String(t ?? '')
			.replace(/\*+/g, '')
			.replace(/ ([?!:;»])/g, '\u00a0$1');
	const temps = (ms) => {
		const s = Math.floor(ms / 1000);
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	};

	async function charger() {
		chargement = 'cours';
		erreur = '';
		try {
			const listes = await Promise.all(MODULES.map((m) => depot.lister(m.slug)));
			index = indexerListing(listes.flat());
			chargement = 'ok';
			// on reprend là où il reste à faire
			const m = MODULES.find((x) => suivanteAFaire(x.frasas, index) !== -1) ?? MODULES[0];
			slug = m.slug;
			pos = Math.max(0, suivanteAFaire(m.frasas, index));
			annonce = `${av.faites} phrases enregistrées sur ${av.total}.`;
		} catch (e) {
			chargement = 'erreur';
			erreur = messageErreur(e);
		}
	}

	function arreterEcoute() {
		arretEcoute?.();
		arretEcoute = null;
		ecoute = null;
	}

	function jeterPrise() {
		if (prise?.url) URL.revokeObjectURL(prise.url);
		prise = null;
	}

	function arreterChrono() {
		clearInterval(chrono);
		chrono = null;
	}

	async function enregistrer() {
		if (phase === 'enregistre') {
			rec.arreter();
			return;
		}
		if (occupe) return;
		arreterEcoute();
		jeterPrise();
		erreur = '';
		phase = 'demarrage';
		annonce = 'Ouverture du micro…';
		let fin;
		try {
			({ fin } = await rec.demarrer());
		} catch (e) {
			phase = 'pret';
			erreur = e?.message || MESSAGES.enregistrement;
			annonce = erreur;
			return;
		}
		phase = 'enregistre';
		ecoule = 0;
		const debut = Date.now();
		chrono = setInterval(() => (ecoule = Math.min(Date.now() - debut, DUREE_MAX_MS)), 250);
		annonce = 'Enregistrement en cours. Appuie de nouveau pour arrêter.';
		fin.then(
			async (p) => {
				arreterChrono();
				prise = { ...p, url: URL.createObjectURL(p.blob) };
				phase = 'prise';
				annonce = p.coupee
					? 'Arrêt automatique à 30 secondes. Réécoute ta prise, puis garde-la ou recommence.'
					: 'Prise terminée. Réécoute-la, puis garde-la ou recommence.';
				await tick();
				boutonReecouter?.focus();
			},
			async (e) => {
				arreterChrono();
				phase = 'pret';
				erreur = e?.message || MESSAGES.enregistrement;
				annonce = erreur;
				await tick();
				boutonEnr?.focus();
			}
		);
	}

	function reecouter() {
		if (!prise) return;
		if (ecoute === 'prise') return arreterEcoute();
		arreterEcoute();
		ecoute = 'prise';
		arretEcoute = jouer(prise.url, () => {
			if (ecoute === 'prise') ecoute = null;
		});
	}

	async function ecouterGardee() {
		if (ecoute === 'gardee') return arreterEcoute();
		arreterEcoute();
		erreur = '';
		ecoute = 'gardee';
		try {
			// dossier privé : adresse signée, valable dix minutes
			const url = await depot.urlEcoute(gardees[0]);
			if (ecoute !== 'gardee') return;
			arretEcoute = jouer(url, () => {
				if (ecoute === 'gardee') ecoute = null;
			});
		} catch (e) {
			ecoute = null;
			erreur = messageErreur(e).replace(' Ta prise est gardée ici : appuie sur Réessayer.', ' Réessaie dans un moment.');
			annonce = erreur;
		}
	}

	async function garder() {
		if (!prise || phase === 'envoi') return;
		arreterEcoute();
		phase = 'envoi';
		erreur = '';
		annonce = 'Envoi de la prise…';
		const clau = frase.clau;
		try {
			const chemins = await garderPrise(depot, clau, prise, index.get(clau) ?? []);
			const n = new Map(index);
			n.set(clau, chemins);
			index = n;
			jeterPrise();
			phase = 'pret';
			const i = suivanteAFaire(frasas, index, pos);
			if (i === -1) {
				annonce = 'Gardée. Toutes les phrases de ce module sont enregistrées.';
			} else {
				pos = i;
				annonce = `Gardée. Phrase suivante : ${i + 1} sur ${frasas.length}.`;
			}
			await tick();
			boutonEnr?.focus();
		} catch (e) {
			// la prise reste là : rien n'est perdu
			phase = 'echec';
			erreur = messageErreur(e);
			annonce = erreur;
		}
	}

	async function recommencer() {
		arreterEcoute();
		jeterPrise();
		erreur = '';
		phase = 'pret';
		annonce = 'Prise laissée de côté. Appuie sur Enregistrer quand tu es prêt.';
		await tick();
		boutonEnr?.focus();
	}

	/** Quitter une prise non gardée : on demande avant. */
	function peutQuitter() {
		if (!prise) return true;
		return confirm('Cette prise n’est pas gardée. La laisser de côté ?');
	}

	function aller(i) {
		if (occupe || i < 0 || i >= frasas.length || i === pos) return;
		if (!peutQuitter()) return;
		arreterEcoute();
		jeterPrise();
		erreur = '';
		phase = 'pret';
		pos = i;
		annonce = `Phrase ${i + 1} sur ${frasas.length}.`;
	}

	function changerModule(e) {
		const nouveau = e.currentTarget.value;
		if (!peutQuitter()) {
			e.currentTarget.value = slug;
			return;
		}
		arreterEcoute();
		jeterPrise();
		erreur = '';
		phase = 'pret';
		slug = nouveau;
		const m = MODULES.find((x) => x.slug === nouveau);
		pos = Math.max(0, suivanteAFaire(m.frasas, index));
		annonce = `Module ${nouveau} : ${av.parModule[nouveau].faites} sur ${av.parModule[nouveau].total} enregistrées.`;
	}

	function moduleSuivantAFinir() {
		const debut = MODULES.findIndex((m) => m.slug === slug);
		for (let k = 1; k <= MODULES.length; k++) {
			const m = MODULES[(debut + k) % MODULES.length];
			if (suivanteAFaire(m.frasas, index) !== -1) {
				changerModule({ currentTarget: { value: m.slug } });
				return;
			}
		}
	}

	// rendre le micro dès qu'on quitte la page (onglet fermé, autre page)
	const liberer = () => rec.liberer();
	onMount(() => {
		charger();
		window.addEventListener('pagehide', liberer);
	});
	onDestroy(() => {
		if (typeof window === 'undefined') return;
		window.removeEventListener('pagehide', liberer);
		arreterChrono();
		arreterEcoute();
		rec.liberer();
		jeterPrise();
	});
</script>

<svelte:head>
	<title>Studio de voix — Espaci d'administracion</title>
</svelte:head>

<section class="studio" aria-labelledby="studio-titre">
	<h1 id="studio-titre">Studio de voix</h1>

	{#if chargement === 'cours'}
		<p class="doux">Lecture du dossier des voix…</p>
	{:else if chargement === 'erreur'}
		<p class="msg-erreur" role="alert">{erreur}</p>
		<button type="button" class="bouton principal" onclick={charger}>Réessayer</button>
	{:else}
		<div class="global">
			<label for="avance-global">{av.faites} phrases enregistrées sur {av.total}</label>
			<progress id="avance-global" max={av.total} value={av.faites}>{av.faites} sur {av.total}</progress>
		</div>

		<div class="champ">
			<label for="choix-module">Module</label>
			<select id="choix-module" value={slug} onchange={changerModule} disabled={occupe}>
				{#each MODULES as m (m.slug)}
					{@const a = av.parModule[m.slug]}
					<option value={m.slug}>
						{a.faites === a.total ? '✓ ' : ''}{m.slug} · {sansMarques(m.modul.oc)} — {a.faites} sur {a.total}
					</option>
				{/each}
			</select>
		</div>

		<article class="phrase" class:faite={gardees.length > 0} aria-labelledby="phrase-oc">
			<p class="rang">
				<span>Phrase {pos + 1} sur {frasas.length}</span>
				{#if gardees.length}<span class="pastille">Déjà enregistrée</span>{/if}
			</p>
			<p class="oc" id="phrase-oc" lang="oc">{sansMarques(frase.oc)}</p>
			{#if frase.fr}<p class="fr">{sansMarques(frase.fr)}</p>{/if}
			<p class="meta">
				{frase.tipe === 'replica' ? 'Réplique de dialogue' : 'Expression à retenir'}{#if frase.scena}{' · scène : '}<span lang="oc"
						>{sansMarques(frase.scena)}</span
					>{/if}
			</p>
			{#if gardees.length && !prise}
				<button type="button" class="bouton discret" onclick={ecouterGardee} aria-pressed={ecoute === 'gardee'} disabled={occupe}>
					{ecoute === 'gardee' ? '■ Arrêter l’écoute' : '▶ Écouter la version gardée'}
				</button>
			{/if}
		</article>

		<div class="gestes">
			{#if phase === 'prise' || phase === 'envoi' || phase === 'echec'}
				<p class="duree">Prise de {temps(prise?.duree ?? 0)}{prise?.coupee ? ' (coupée à 30 s)' : ''}</p>
				<div class="trio">
					<button type="button" class="bouton" bind:this={boutonReecouter} onclick={reecouter} aria-pressed={ecoute === 'prise'} disabled={phase === 'envoi'}>
						{ecoute === 'prise' ? '■ Arrêter' : '▶ Réécouter'}
					</button>
					<button type="button" class="bouton principal" onclick={garder} disabled={phase === 'envoi'}>
						{phase === 'envoi' ? 'Envoi…' : phase === 'echec' ? 'Réessayer' : '✓ Garder'}
					</button>
					<button type="button" class="bouton" onclick={recommencer} disabled={phase === 'envoi'}>↺ Recommencer</button>
				</div>
			{:else}
				<button
					type="button"
					class="bouton enregistrer"
					class:actif={phase === 'enregistre'}
					bind:this={boutonEnr}
					onclick={enregistrer}
					aria-pressed={phase === 'enregistre'}
					disabled={phase === 'demarrage'}
				>
					<span class="point" aria-hidden="true"></span>
					{#if phase === 'enregistre'}
						Arrêter
					{:else if phase === 'demarrage'}
						Micro…
					{:else}
						{gardees.length ? 'Enregistrer de nouveau' : 'Enregistrer'}
					{/if}
				</button>
				{#if phase === 'enregistre'}
					<p class="chrono">
						<span class="enreg">Enregistrement</span>
						<span class="temps">{temps(ecoule)} <span class="doux">/ {temps(DUREE_MAX_MS)}</span></span>
					</p>
					<div class="jauge" aria-hidden="true"><span style:width="{(ecoule / DUREE_MAX_MS) * 100}%"></span></div>
				{/if}
			{/if}
		</div>

		{#if erreur}<p class="msg-erreur">{erreur}</p>{/if}
		{#if phase === 'pret' && av.parModule[slug].faites === av.parModule[slug].total && av.faites < av.total}
			<button type="button" class="bouton discret" onclick={moduleSuivantAFinir}>Passer au module suivant à finir →</button>
		{/if}

		<nav class="navigation" aria-label="Changer de phrase">
			<button type="button" class="bouton" onclick={() => aller(pos - 1)} disabled={occupe || pos === 0}>← Précédente</button>
			<button type="button" class="bouton" onclick={() => aller(pos + 1)} disabled={occupe || pos >= frasas.length - 1}>Suivante →</button>
		</nav>

		{#if simular}
			<p class="essai">Mode d’essai : rien n’est envoyé, les prises restent dans cet onglet.</p>
		{/if}
	{/if}

	<p class="annonce" aria-live="polite" role="status">{annonce}</p>
</section>

<style>
	/* Couleurs : celles de l'administration et de la palette du site, jamais de code en dur. */
	.studio {
		--fond: var(--l-sol);
		--carton: var(--l-carta);
		--encre: var(--t-tinta);
		--doux: var(--t-tinta-2);
		--trait: var(--t-linha);
		--action: var(--t-accion);
		--choisi: var(--p-or);
		--choisi-encre: var(--p-encre);
		--sarcelle: var(--l-teal);
		--enreg: var(--t-terra);
		--bon: var(--l-bon);
		--alerte: var(--l-marca);
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: var(--font-body);
		color: var(--encre);
		line-height: 1.45;
	}
	.studio h1 {
		margin: 0;
		font-size: clamp(1.6rem, 7vw, 2.2rem);
		line-height: 1.1;
	}
	.doux {
		color: var(--doux);
	}
	.global,
	.champ {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}
	.global label,
	.champ label {
		font-size: 0.9rem;
		font-weight: 600;
	}
	progress {
		width: 100%;
		height: 0.75rem;
		accent-color: var(--sarcelle);
	}
	select {
		width: 100%;
		min-width: 0;
		min-height: 48px;
		padding: 0.4rem 0.6rem;
		font: inherit;
		font-size: 1rem;
		color: var(--encre);
		background: var(--carton);
		border: 1px solid var(--trait);
		border-radius: 6px;
		text-overflow: ellipsis;
	}
	.phrase {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--carton);
		border: 1px solid var(--trait);
		border-left: 4px solid var(--trait);
		border-radius: 6px;
		min-width: 0;
	}
	.phrase.faite {
		border-left-color: var(--bon);
	}
	.phrase p {
		margin: 0;
	}
	.rang {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--doux);
	}
	.pastille {
		padding: 0 0.5rem;
		border: 1px solid var(--bon);
		border-radius: 999px;
		color: var(--encre);
		font-weight: 600;
	}
	.oc {
		font-family: var(--font-quote);
		font-size: clamp(1.7rem, 8vw, 2.3rem);
		font-weight: 600;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}
	.fr {
		font-size: 0.95rem;
		color: var(--doux);
	}
	.meta {
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		color: var(--sarcelle);
	}
	.gestes {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.6rem;
	}
	.bouton {
		min-height: 48px;
		min-width: 44px;
		padding: 0.55rem 1rem;
		font: inherit;
		font-size: 1rem;
		font-weight: 600;
		color: var(--encre);
		background: var(--carton);
		border: 2px solid var(--trait);
		border-radius: 8px;
		cursor: pointer;
	}
	.bouton:hover:not(:disabled) {
		border-color: var(--action);
	}
	.bouton:focus-visible,
	select:focus-visible {
		outline: 3px solid var(--action);
		outline-offset: 2px;
	}
	.bouton:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.bouton.principal {
		background: var(--choisi);
		border-color: var(--choisi);
		color: var(--choisi-encre);
	}
	.bouton.discret {
		align-self: flex-start;
		min-height: 44px;
		border-style: dashed;
		font-weight: 500;
	}
	.enregistrer {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
		min-height: 72px;
		font-size: 1.25rem;
		border-color: var(--enreg);
	}
	.point {
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
		background: var(--enreg);
		flex: none;
	}
	.enregistrer.actif {
		background: var(--enreg);
		color: var(--carton);
	}
	.enregistrer.actif .point {
		border-radius: 3px;
		background: var(--carton);
	}
	.chrono {
		margin: 0;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-variant-numeric: tabular-nums;
	}
	.enreg {
		font-weight: 600;
		color: var(--enreg);
	}
	.temps {
		font-size: 1.5rem;
		font-weight: 600;
	}
	.temps .doux {
		font-size: 1rem;
	}
	.jauge {
		height: 6px;
		border-radius: 3px;
		background: var(--fond);
		overflow: hidden;
	}
	.jauge span {
		display: block;
		height: 100%;
		background: var(--enreg);
	}
	.duree {
		margin: 0;
		font-size: 0.9rem;
		color: var(--doux);
	}
	.trio {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0.6rem;
	}
	.trio .bouton {
		padding-inline: 0.5rem;
		white-space: nowrap;
	}
	.trio .principal {
		grid-column: 1 / -1;
		grid-row: 1;
		min-height: 64px;
		font-size: 1.2rem;
	}
	.navigation {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0.6rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--trait);
	}
	.msg-erreur {
		margin: 0;
		padding: 0.6rem 0.8rem;
		border-left: 4px solid var(--alerte);
		background: var(--fond);
		border-radius: 4px;
	}
	.essai {
		margin: 0;
		font-size: 0.8rem;
		color: var(--doux);
		font-style: italic;
	}
	.annonce {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	@media (min-width: 560px) {
		.trio {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.trio .principal {
			grid-column: 2;
			min-height: 48px;
			font-size: 1rem;
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.enregistrer.actif .point {
			animation: battement 1.2s ease-in-out infinite;
		}
		.jauge span {
			transition: width 0.25s linear;
		}
		@keyframes battement {
			50% {
				opacity: 0.35;
			}
		}
	}
</style>
