<script>
	// Revirar : Romain traduit en occitan une phrase française SANS aide, puis la
	// page corrige : chaque mot qu'il a écrit est cherché dans lo Basic (lo
	// Congrès), puis un modèle s'affiche pour comparer ; les mots du modèle sont
	// vérifiés de la même façon. La page ne juge PAS la syntaxe, et le dit.
	// Rien n'est enregistré. Logique : mots.js, sesilha.js, accents.js,
	// verificacion.js (tous testés) ; phrases : frasas.js.
	import { tick } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { FRASAS, TEMAS } from './frasas.js';
	import { decouper, raisonNonCherche, motsACercar, morceaux, memesMots } from './mots.js';
	import { TOUCHES, NOM_TOUCHE, inserir } from './accents.js';
	import { phraseSuivante, estatMot, resumir, annonce } from './sesilha.js';
	import { verificar } from './verificacion.js';

	const premiere = phraseSuivante(FRASAS, null, []);
	let phrase = $state(premiere.phrase);
	let vues = premiere.vues;
	let saisie = $state('');
	let maj = $state(false);
	let etape = $state('saisie'); // saisie | cours | resultat
	let resultat = $state.raw(null); // { verifs, vous: [{ brut, estat }], modele: [morceaux avec estat], c, identique }
	let message = $state('');
	let champ = $state();

	const ETIQUETTES = {
		confirmat: { icone: '✓', texte: 'confirmé' },
		inconegut: { icone: '⚠', texte: 'non trouvé' },
		'pas-cercat': { icone: '–', texte: 'non cherché' },
		indisponible: { icone: '?', texte: 'non vérifié' }
	};

	async function inserer(car) {
		const el = champ;
		const r = inserir(saisie, el?.selectionStart, el?.selectionEnd, car, maj);
		saisie = r.valeur;
		maj = false;
		await tick();
		el?.focus();
		el?.setSelectionRange(r.curseur, r.curseur);
	}

	async function corriger(e) {
		e?.preventDefault();
		if (etape === 'cours') return;
		const tVous = decouper(saisie);
		if (!tVous.length) {
			message = 'Écris d’abord ta traduction.';
			champ?.focus();
			return;
		}
		message = '';
		etape = 'cours';
		const mModele = morceaux(phrase.oc);
		const tModele = mModele.filter((m) => m.token).map((m) => m.token);
		let jeton = '';
		try {
			jeton = (await supabase.auth.getSession())?.data?.session?.access_token ?? '';
		} catch {
			/* pas de session : la route décidera */
		}
		const verifs = await verificar(motsACercar([...tVous, ...tModele]), jeton);
		const etat = (t) => estatMot(raisonNonCherche(t), t.mot, verifs);
		const vous = tVous.map((t) => ({ brut: t.brut + (t.elision ? '’' : ''), estat: etat(t), raison: raisonNonCherche(t) }));
		const modele = mModele.map((m) => (m.token ? { ...m, estat: etat(m.token) } : m));
		const c = resumir(vous.map((x) => x.estat));
		const identique = memesMots(saisie, phrase.oc);
		resultat = { verifs, vous, modele, c, identique, nonConfirmes: modele.filter((m) => m.estat === 'inconegut').map((m) => m.texte) };
		message = annonce(c, identique);
		etape = 'resultat';
	}

	async function autre() {
		const r = phraseSuivante(FRASAS, phrase.id, vues);
		phrase = r.phrase;
		vues = r.vues;
		saisie = '';
		resultat = null;
		message = '';
		etape = 'saisie';
		await tick();
		champ?.focus();
	}

	const surTouches = (e) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) corriger(e);
	};
	let pasDeVerif = $derived(resultat && resultat.verifs.estat !== 'ok');
</script>

<section class="revirar" aria-label="Exercice de traduction">
	<p class="tema">Thème : {TEMAS[phrase.tema]}</p>
	<p class="fr" id="rev-fr" lang="fr"><span class="cons">À traduire en occitan :</span> {phrase.fr}</p>

	<form onsubmit={corriger}>
		<label for="rev-saisie">Ta traduction en occitan, sans aide</label>
		<textarea
			id="rev-saisie"
			bind:this={champ}
			bind:value={saisie}
			lang="oc"
			rows="3"
			spellcheck="false"
			autocomplete="off"
			autocapitalize="off"
			aria-describedby="rev-aide"
			onkeydown={surTouches}
		></textarea>
		<p id="rev-aide" class="doux">Les touches ci-dessous insèrent le caractère là où est le curseur. Ctrl + Entrée pour corriger.</p>

		<div class="touches" role="group" aria-label="Touches d’accents">
			{#each TOUCHES as t (t)}
				<button type="button" class="touche" lang="oc" aria-label={NOM_TOUCHE[t] ?? t} onmousedown={(e) => e.preventDefault()} onclick={() => inserer(t)}>
					{maj ? t.toUpperCase() : t}
				</button>
			{/each}
			<button type="button" class="touche maj" aria-pressed={maj} onmousedown={(e) => e.preventDefault()} onclick={() => (maj = !maj)}>Maj.</button>
		</div>

		<div class="gestes">
			<button type="submit" class="bouton principal" disabled={etape === 'cours'}>{etape === 'cours' ? 'Vérification…' : 'Corriger'}</button>
			<button type="button" class="bouton" onclick={autre} disabled={etape === 'cours'}>Autre phrase</button>
		</div>
	</form>

	<p class="annonce" role="status" aria-live="polite">{message}</p>

	{#if etape === 'resultat' && resultat}
		<section class="resultat" aria-labelledby="rev-res">
			<h2 id="rev-res">Correction</h2>

			{#if pasDeVerif}
				<p class="avis">
					<strong>⚠ Vérification indisponible</strong>
					{#if resultat.verifs.estat === 'sens-clau'}(la clé de lo Congrès n’est pas configurée ici){:else if resultat.verifs.estat === 'reservat'}(accès réservé à l’administrateur){:else}(lo Congrès n’a pas répondu, ou la limite est atteinte){/if}.
					Aucun mot n’est confirmé ni refusé. Le modèle ci-dessous n’est pas vérifié.
				</p>
			{/if}

			<h3>Ce que tu as écrit</h3>
			<ul class="mots" lang="oc">
				{#each resultat.vous as m, i (i)}
					{@const e = ETIQUETTES[m.estat]}
					<li class="mot {m.estat}"><span class="oc">{m.brut}</span> <span class="etq"><span aria-hidden="true">{e.icone}</span> {e.texte}</span></li>
				{/each}
			</ul>
			{#if resultat.c.inconegut}
				<p class="doux">
					« Non trouvé » : ni dans le dictionnaire ni parmi les formes conjuguées de lo Congrès. Vérifie l’accent, ou si ce n’est pas une forme française.
					Ce qui peut encore échapper : certains féminins, les noms propres.
				</p>
			{/if}
			<p class="doux">
				Les mots courts et les petits mots grammaticaux (articles, élisions) ne sont pas cherchés. <strong>La page ne juge pas la syntaxe</strong> :
				compare ta phrase au modèle, il peut y avoir plusieurs traductions justes.
			</p>
			{#if resultat.identique}<p class="bravo">✓ Tes mots sont les mêmes que ceux du modèle.</p>{/if}

			<h3>Traduction modèle</h3>
			<p class="modele" lang="oc">
				{#each resultat.modele as m, i (i)}{#if m.token && m.estat === 'inconegut'}<span class="inconegut-m">{m.texte}<sup aria-hidden="true">⚠</sup></span>{:else}{m.texte}{/if}{/each}
			</p>
			{#if resultat.nonConfirmes.length}
				<p class="avis">
					<strong>⚠ Mot du modèle non confirmé</strong> par lo Congrès :
					<span lang="oc">{resultat.nonConfirmes.join(', ')}</span>. Ne le retiens pas comme sûr.
				</p>
			{:else if !pasDeVerif}
				<p class="doux">Tous les mots du modèle que lo Basic peut chercher sont confirmés.</p>
			{/if}
			<p class="doux">Le modèle est écrit par l’IA ; lo Congrès en vérifie chaque mot au moment de l’affichage, mais personne ne l’a relu dans son ensemble.</p>

			<button type="button" class="bouton principal" onclick={autre}>Phrase suivante →</button>
		</section>
	{/if}
</section>

<style>
	/* Couleurs : celles de l'administration et de la palette du site, jamais de code en dur. */
	.revirar {
		--carton: var(--l-carta);
		--encre: var(--t-tinta);
		--doux: var(--t-tinta-2);
		--trait: var(--t-linha);
		--action: var(--t-accion);
		--choisi: var(--p-or);
		--choisi-encre: var(--p-encre);
		--sarcelle: var(--l-teal);
		--bon: var(--l-bon);
		--alerte: var(--l-marca);
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		width: 100%;
		min-width: 0;
		color: var(--encre);
		font-family: var(--font-body);
		line-height: 1.45;
	}
	p,
	h2,
	h3 {
		margin: 0;
	}
	.tema {
		font-size: 0.85rem;
		color: var(--sarcelle);
		letter-spacing: 0.02em;
	}
	.fr {
		padding: 1rem;
		background: var(--carton);
		border: 1px solid var(--trait);
		border-left: 4px solid var(--sarcelle);
		border-radius: 6px;
		font-family: var(--font-quote);
		font-size: clamp(1.4rem, 6vw, 1.9rem);
		font-weight: 600;
		line-height: 1.25;
		overflow-wrap: anywhere;
	}
	.cons {
		display: block;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--doux);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}
	label {
		font-weight: 600;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		min-height: 5.5rem;
		padding: 0.6rem 0.7rem;
		font: inherit;
		font-size: 1.1rem;
		color: var(--encre);
		background: var(--carton);
		border: 2px solid var(--trait);
		border-radius: 8px;
		resize: vertical;
	}
	.doux {
		font-size: 0.85rem;
		color: var(--doux);
	}
	.touches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.touche,
	.bouton {
		min-height: 48px;
		min-width: 48px;
		padding: 0.4rem 0.7rem;
		font: inherit;
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--encre);
		background: var(--carton);
		border: 2px solid var(--trait);
		border-radius: 8px;
		cursor: pointer;
	}
	.touche.maj {
		font-size: 0.95rem;
	}
	.touche[aria-pressed='true'] {
		background: var(--choisi);
		border-color: var(--choisi);
		color: var(--choisi-encre);
	}
	.touche:hover,
	.bouton:hover:not(:disabled) {
		border-color: var(--action);
	}
	.touche:focus-visible,
	.bouton:focus-visible,
	textarea:focus-visible {
		outline: 3px solid var(--action);
		outline-offset: 2px;
	}
	.gestes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 0.3rem;
	}
	.gestes .bouton {
		flex: 1 1 9rem;
		font-size: 1rem;
	}
	.bouton.principal {
		background: var(--choisi);
		border-color: var(--choisi);
		color: var(--choisi-encre);
	}
	.bouton:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.annonce {
		min-height: 1.2em;
		font-size: 0.9rem;
		color: var(--doux);
	}
	.resultat {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 1rem;
		background: var(--carton);
		border: 1px solid var(--trait);
		border-radius: 6px;
		min-width: 0;
	}
	.resultat h2 {
		font-size: 1.3rem;
	}
	.resultat h3 {
		font-size: 1rem;
		margin-top: 0.3rem;
	}
	.mots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.mot {
		display: inline-flex;
		flex-direction: column;
		padding: 0.25rem 0.6rem;
		border: 2px solid var(--trait);
		border-radius: 8px;
		min-width: 0;
	}
	.mot .oc {
		font-family: var(--font-quote);
		font-size: 1.15rem;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.etq {
		font-size: 0.78rem;
		color: var(--doux);
	}
	.mot.confirmat {
		border-color: var(--bon);
	}
	.mot.inconegut {
		border: 2px dashed var(--alerte);
	}
	.mot.inconegut .etq {
		color: var(--encre);
		font-weight: 700;
	}
	.mot.pas-cercat {
		border-style: dotted;
	}
	.avis {
		padding: 0.5rem 0.7rem;
		border: 2px dashed var(--alerte);
		border-radius: 6px;
		font-size: 0.95rem;
	}
	.bravo {
		font-weight: 600;
	}
	.modele {
		font-family: var(--font-quote);
		font-size: clamp(1.3rem, 5.5vw, 1.7rem);
		font-weight: 600;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	.inconegut-m sup {
		font-size: 0.5em;
	}
	.inconegut-m {
		text-decoration: underline wavy var(--alerte);
		text-underline-offset: 0.2em;
	}
	@media (prefers-reduced-motion: no-preference) {
		.resultat {
			animation: entree 0.25s ease-out;
		}
	}
	@keyframes entree {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
