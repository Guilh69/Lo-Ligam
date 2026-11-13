<script>
	// Tableau de bord par facettes : 6 rubriques x 8 exigences (13-11). Données : facetas.js.
	// Une seule structure pour tous les écrans : une carte par rubrique avec ses 8 pastilles.
	// Large : les cartes s'alignent en grille croisée (noms de colonnes en tête, pastilles
	// réduites au symbole). Étroit : chaque pastille montre son nom. L'état se lit par la forme
	// et par le texte, jamais par la couleur seule.
	import {
		RUBRIQUES,
		EXIGENCES,
		ESTATS_CASA,
		ESTATS_RUBRICA,
		MESA_A_JORN_FACETAS,
		comptesCases
	} from './facetas.js';

	const n = comptesCases();
	/** @type {{ r: string, e: string } | null} */
	let ouverte = $state(null);

	const idDetail = (r) => `facetas-detail-${r}`;

	/** @param {string} r @param {string} e */
	function basculer(r, e) {
		ouverte = ouverte && ouverte.r === r && ouverte.e === e ? null : { r, e };
	}

	/** @param {KeyboardEvent} ev */
	function touche(ev) {
		if (ev.key === 'Escape' && ouverte) {
			const { r, e } = ouverte;
			ouverte = null;
			// rendre le focus à la pastille qui avait ouvert le détail
			document.getElementById(`facetas-${r}-${e}`)?.focus();
		}
	}

	const nomExigence = (clau) => EXIGENCES.find((x) => x.clau === clau);
</script>

{#snippet icone(etat)}
	<svg class="ico" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
		{#if etat === 'bon'}
			<circle cx="10" cy="10" r="8.5" fill="currentColor" />
			<path d="M5.8 10.4l3 3 5.6-6.4" fill="none" stroke="var(--ico-fons)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
		{:else if etat === 'melhorar'}
			<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" />
			<path d="M10 2a8 8 0 0 0 0 16z" fill="currentColor" />
		{:else if etat === 'manca'}
			<rect x="1.8" y="1.8" width="16.4" height="16.4" rx="3" fill="currentColor" />
			<path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="var(--ico-fons)" stroke-width="2.2" stroke-linecap="round" />
		{:else if etat === 'evaluar'}
			<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2.6" />
			<path d="M7.6 7.8a2.5 2.5 0 1 1 3.6 2.3c-.8.5-1.2 1-1.2 1.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<circle cx="10" cy="14.6" r="1.1" fill="currentColor" />
		{:else}
			<path d="M4 10h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
		{/if}
	</svg>
{/snippet}

<section class="facetas" aria-labelledby="facetas-titol" onkeydown={touche}>
	<h2 id="facetas-titol" class="titol">Les facettes du projet</h2>
	<p class="mesa">
		Mis à jour le {MESA_A_JORN_FACETAS}. Une case n’est remplie que si le dépôt en garde une preuve écrite ;
		sinon elle reste « à évaluer ». Touche une case pour lire sa phrase et sa preuve.
	</p>

	<ul class="legende" aria-label="Légende des états">
		{#each Object.entries(ESTATS_CASA) as [id, e] (id)}
			<li class="leg {id}">{@render icone(id)}<span><strong>{n[id]}</strong> {e.cort}</span></li>
		{/each}
	</ul>

	<p class="prop">
		<strong>Ton choix du 13 novembre :</strong> « en chantier » (deux au plus) pour l’Apprentissage (lo
		parcors) et S’imagina. Proposition de l’IA, pas encore validée par toi : « en sommeil » pour les
		Groupes ; « en veille » pour le reste.
	</p>

	<div class="tete" aria-hidden="true">
		<span></span>
		{#each EXIGENCES as ex (ex.clau)}
			<span class="col">{ex.cort}</span>
		{/each}
	</div>

	<ul class="rubriques">
		{#each RUBRIQUES as r (r.clau)}
			{@const sel = ouverte && ouverte.r === r.clau ? ouverte.e : null}
			<li class="rubrica {r.estat}">
				<div class="nomrub">
					<h3>{r.nom}</h3>
					<span class="etat {r.estat}" title={ESTATS_RUBRICA[r.estat].explic}>{ESTATS_RUBRICA[r.estat].nom}</span>
				</div>

				<ul class="pastilles">
					{#each EXIGENCES as ex (ex.clau)}
						{@const c = r.cases[ex.clau]}
						<li>
							<button
								type="button"
								id="facetas-{r.clau}-{ex.clau}"
								class="pastilla {c.etat}"
								aria-expanded={sel === ex.clau}
								aria-controls={idDetail(r.clau)}
								aria-label="{r.nom}, {ex.cort} : {ESTATS_CASA[c.etat].cort}"
								onclick={() => basculer(r.clau, ex.clau)}
							>
								{@render icone(c.etat)}
								<span class="lib" aria-hidden="true">{ex.cort}</span>
							</button>
						</li>
					{/each}
				</ul>

				<div class="detail-zona" id={idDetail(r.clau)}>
					{#if sel}
						{@const c = r.cases[sel]}
						{@const ex = nomExigence(sel)}
						<div class="detail {c.etat}" role="group" aria-label="Détail : {r.nom}, {ex.cort}">
							<p class="d-tete">
								{@render icone(c.etat)}
								<strong>{ex.nom}</strong>
								<span class="d-etat">{ESTATS_CASA[c.etat].nom}</span>
							</p>
							<p class="d-phrase">{c.phrase}</p>
							{#if c.preuve}<p class="d-preuve"><span class="et">Preuve</span> {c.preuve}</p>{/if}
						</div>
					{/if}
				</div>

				<details class="attente">
					<summary>Ce qui attend : toi ({r.romain.length}) · l’IA ({r.ia.length})</summary>
					<div class="deux">
						<div>
							<h4>Ce qui t’attend</h4>
							<ul>{#each r.romain as t (t)}<li>{t}</li>{/each}</ul>
						</div>
						<div>
							<h4>Ce qui attend l’IA</h4>
							<ul>{#each r.ia as t (t)}<li>{t}</li>{/each}</ul>
						</div>
					</div>
				</details>
			</li>
		{/each}
	</ul>
</section>

<style>
	.facetas {
		container-type: inline-size;
		/* la couleur du glyphe posé sur une forme pleine : le fond de la page */
		--ico-fons: var(--t-fons);
		margin: 0 0 2.2rem;
		padding-bottom: 1.6rem;
		border-bottom: 2px solid var(--t-linha);
		color: var(--t-tinta);
		font-family: var(--font-body);
	}
	.titol {
		margin: 0 0 0.3rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.7rem;
	}
	.mesa {
		margin: 0 0 0.8rem;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--t-tinta-2);
	}
	.prop {
		margin: 0 0 1.1rem;
		padding: 0.55rem 0.8rem;
		font-size: 0.9rem;
		line-height: 1.45;
		border-left: 3px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 9%, transparent);
	}

	/* légende */
	.legende {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		margin: 0 0 0.9rem;
		padding: 0;
		font-size: 0.88rem;
	}
	.leg {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.leg.bon,
	.leg.melhorar {
		color: var(--t-aur);
	}
	.leg.manca {
		color: var(--t-accion);
	}
	.leg.evaluar,
	.leg.sens-objècte {
		color: var(--t-tinta-2);
	}
	.leg span {
		color: var(--t-tinta);
	}

	/* en-tête des colonnes (grand écran seulement) */
	.tete {
		display: none;
	}

	.rubriques {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.rubrica {
		padding: 0.8rem 0.9rem 0.6rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--t-fons-2) 55%, transparent);
	}
	.rubrica.sòmi {
		border-style: dashed;
	}
	.nomrub {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.7rem;
		margin-bottom: 0.6rem;
	}
	h3 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
	}
	.etat {
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}
	.etat.chantier {
		background: var(--t-accion);
		border-color: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.etat.velha {
		color: var(--t-aur);
	}
	.etat.sòmi {
		color: var(--t-tinta-2);
		border-style: dashed;
	}

	/* les pastilles : étroit = 2 colonnes avec le nom */
	.pastilles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.4rem;
	}
	.pastilla {
		width: 100%;
		min-height: 2.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.6rem;
		font: inherit;
		font-size: 0.88rem;
		text-align: left;
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-fons) 70%, transparent);
		border: 1.5px solid var(--t-linha);
		border-radius: 0.6rem;
		cursor: pointer;
	}
	.pastilla .ico {
		flex: none;
	}
	.pastilla .lib {
		min-width: 0;
		overflow-wrap: anywhere;
		line-height: 1.2;
	}
	.pastilla.bon {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.pastilla.bon .ico,
	.pastilla.melhorar .ico {
		color: var(--t-aur);
	}
	.pastilla.melhorar {
		border-color: var(--t-aur);
	}
	.pastilla.manca {
		border-color: var(--t-accion);
		background: color-mix(in srgb, var(--t-accion) 12%, transparent);
	}
	.pastilla.manca .ico {
		color: var(--t-accion);
	}
	.pastilla.evaluar {
		border-style: dashed;
	}
	.pastilla.evaluar .ico,
	.pastilla.sens-objècte .ico {
		color: var(--t-tinta-2);
	}
	.pastilla:hover {
		background: color-mix(in srgb, var(--t-aur) 18%, transparent);
	}
	.pastilla[aria-expanded='true'] {
		outline: 3px solid var(--t-aur);
		outline-offset: 1px;
		font-weight: 700;
	}
	.pastilla:focus-visible {
		outline: 3px solid var(--t-accion);
		outline-offset: 2px;
	}

	/* détail d'une case */
	.detail {
		margin-top: 0.7rem;
		padding: 0.7rem 0.85rem;
		border-radius: 0.6rem;
		border: 1.5px solid var(--t-aur);
		background: var(--t-fons);
	}
	.detail.manca {
		border-color: var(--t-accion);
	}
	.detail.evaluar {
		border-style: dashed;
	}
	.d-tete {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.6rem;
		margin: 0 0 0.35rem;
		font-size: 0.92rem;
	}
	.d-tete .ico {
		flex: none;
		color: var(--t-aur);
	}
	.detail.manca .d-tete .ico {
		color: var(--t-accion);
	}
	.detail.evaluar .d-tete .ico,
	.detail.sens-objècte .d-tete .ico {
		color: var(--t-tinta-2);
	}
	.d-etat {
		padding: 0.05rem 0.55rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}
	.d-phrase {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}
	.d-preuve {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--t-tinta-2);
		overflow-wrap: anywhere;
	}
	.et {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-right: 0.3rem;
	}

	/* ce qui attend */
	.attente {
		margin-top: 0.6rem;
		font-size: 0.9rem;
	}
	.attente summary {
		cursor: pointer;
		padding: 0.35rem 0;
		min-height: 1.6rem;
		color: var(--t-aur);
		font-weight: 700;
	}
	.attente summary:focus-visible {
		outline: 3px solid var(--t-accion);
		outline-offset: 2px;
	}
	.deux {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem 1.5rem;
		padding: 0.3rem 0 0.4rem;
	}
	.deux h4 {
		margin: 0 0 0.25rem;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.deux ul {
		margin: 0;
		padding-left: 1.1rem;
		line-height: 1.45;
	}

	/* grand écran : grille croisée (la largeur du bloc, pas celle de la fenêtre) */
	@container (min-width: 52rem) {
		.tete,
		.nomrub + .pastilles {
			--cols: 10.5rem repeat(8, minmax(0, 1fr));
		}
		.tete {
			display: grid;
			grid-template-columns: var(--cols);
			gap: 0.4rem;
			padding: 0 calc(0.9rem + 1px) 0.4rem;
			font-size: 0.74rem;
			font-weight: 700;
			letter-spacing: 0.02em;
			text-align: center;
			color: var(--t-tinta-2);
			align-items: end;
		}
		.col {
			overflow-wrap: anywhere;
			line-height: 1.15;
		}
		.rubriques {
			gap: 0.5rem;
		}
		.rubrica {
			display: grid;
			grid-template-columns: 10.5rem minmax(0, 1fr);
			column-gap: 0.4rem;
			align-items: center;
			padding: 0.5rem 0.9rem;
		}
		.nomrub {
			margin: 0;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}
		.pastilles {
			grid-template-columns: repeat(8, minmax(0, 1fr));
		}
		.pastilla {
			justify-content: center;
			padding: 0.3rem;
		}
		.pastilla .lib {
			display: none;
		}
		.detail-zona,
		.attente {
			grid-column: 1 / -1;
		}
	}
	@container (min-width: 52rem) {
		.deux {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.pastilla {
			transition: background-color 0.15s;
		}
	}
</style>
