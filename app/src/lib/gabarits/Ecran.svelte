<script>
	// Le cadre commun des écrans d'exercice (gabarits, lot 1, 2026-11-17). Romain :
	// « l'interface de chaque exercice dans ma charte, déclinée par typologie ».
	// Toujours le même ordre : avancement, consigne en une ligne, média, action,
	// retour qui explique (principe 8 : chaque erreur expliquée), un seul bouton
	// en aplat brique (charte §5quater). « Passar » : le droit de laisser de côté
	// (principe 4). Mécanique observée sur les captures d'applications de langues
	// envoyées par Romain ; le style est celui de Lo Ligam.
	import Icona from '$lib/components/Icona.svelte';

	/**
	 * avança : 0 à 1 ; consigna : { oc, fr } ; retorn : null ou { just, titol, explic } ;
	 * boton : { oc, fr, actiu, onclick } ; media, accion : snippets
	 */
	let { avança = 0, consigna, retorn = null, boton, onpassar = null, media, accion } = $props();
</script>

<div class="ecran">
	<div class="cap">
		<span class="tancar" aria-hidden="true"><Icona nom="fermer" size="1.25rem" /></span>
		<div class="avança" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(avança * 100)} aria-label="Avancement de la leçon">
			<span style:width="{avança * 100}%"></span>
		</div>
	</div>

	<p class="consigna"><span lang="oc">{consigna.oc}</span> <span class="glosa">({consigna.fr})</span></p>

	{#if media}<div class="media">{@render media()}</div>{/if}
	<div class="accion">{@render accion()}</div>

	<div class="pè">
		{#if retorn}
			<div class="retorn" class:just={retorn.just} role="status">
				<p class="r-titol">
					{#if retorn.just}<Icona nom="valide" size="1.15rem" />{/if}
					<span lang="oc">{retorn.titol.oc}</span> <span class="glosa">({retorn.titol.fr})</span>
				</p>
				{#if retorn.explic}<p class="r-explic">{retorn.explic}</p>{/if}
			</div>
		{/if}
		<button type="button" class="boton" disabled={!boton.actiu} onclick={boton.onclick}>
			<span lang="oc">{boton.oc}</span>
		</button>
		{#if onpassar}<button type="button" class="passar" onclick={onpassar}><span lang="oc">Passar aqueste</span> <span class="glosa">(passer celui-ci)</span></button>{/if}
	</div>
</div>

<style>
	.ecran {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		padding: 1rem 1.1rem 1.1rem;
		color: var(--t-tinta);
		background: var(--t-fons);
		font-family: var(--font-body);
	}
	.cap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.tancar {
		display: inline-flex;
		color: var(--t-tinta-2);
	}
	.avança {
		flex: 1;
		height: 3px;
		background: var(--t-linha);
	}
	.avança span {
		display: block;
		height: 100%;
		background: var(--t-accion);
		transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.consigna {
		margin: 0;
		font-size: 1rem;
		line-height: 1.45;
	}
	.glosa {
		color: var(--t-tinta-2);
		font-size: 0.9em;
	}
	.media {
		flex: none;
	}
	.accion {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}
	.pè {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.retorn {
		padding-top: 0.6rem;
		border-top: 2px solid var(--t-tinta-2);
	}
	.retorn.just {
		border-top-color: var(--t-aur);
	}
	.r-titol {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-size: 1.05rem;
	}
	.retorn.just .r-titol {
		color: var(--t-aur);
	}
	.retorn.just .r-titol .glosa {
		color: var(--t-tinta-2);
	}
	.r-explic {
		margin: 0.3rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}
	.boton {
		width: 100%;
		min-height: 3rem;
		border: 0;
		border-radius: 3px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: inherit;
		font-size: 1.05rem;
		cursor: pointer;
	}
	.boton:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		background: transparent;
		color: var(--t-tinta-2);
		outline: 1px solid var(--t-linha);
		outline-offset: -1px;
		cursor: default;
	}
	.boton:focus-visible,
	.passar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.passar {
		align-self: center;
		padding: 0.25rem;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	@media (prefers-reduced-motion: reduce) {
		.avança span {
			transition: none;
		}
	}
</style>
