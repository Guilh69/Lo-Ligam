<script>
	// Le cadre commun des écrans d'exercice (gabarits, lot 1, 2026-11-17). Romain :
	// « l'interface de chaque exercice dans ma charte, déclinée par typologie ».
	// Toujours le même ordre : la tête (numéro de la leçon, consigne, avancement),
	// le média, l'action, le retour qui explique (principe 8 : chaque erreur
	// expliquée), un seul bouton en aplat brique (charte §5quater). « Passar » :
	// le droit de laisser de côté (principe 4).
	//
	// Allure refaite le même jour (Romain : « pas très fidèle à ma DA, assez
	// générique ») : le vocabulaire est celui du site, pas un vocabulaire sobre
	// passe-partout. Tout ce qui se touche est une pièce de papier découpé
	// (lib/styles/papier.css), le numéro et « Òsca ! » sont en Limelight, la
	// traduction en italique entre parenthèses, l'avancement en petits carrés
	// comme dans les jeux, la couleur vient de l'unité (lib/parcors/colors.js).
	// La tête est un aplat à la couleur de l'unité, comme les tuiles de /apren :
	// « Teula », choisie par Romain le 18-11 face à « Papièr » (tête sur le fond
	// du site, numéro en or), retirée ce jour-là.
	import { getContext } from 'svelte';
	import Icona from '#lib/components/Icona.svelte';
	import { animat } from '#lib/actions/animarText.js';
	import { colorUnitat, tintaPer } from '#lib/parcors/colors.js';
	import { insecable } from '#lib/lesson/rich.js';

	/**
	 * avança : 0 à 1 ; consigna : { oc, fr } ; retorn : null ou { just, titol, explic } ;
	 * boton : { oc, actiu, onclick } ; media, accion : snippets ;
	 * reserva : snippet facultatif, ce qu'on prend pour répondre (les mots à poser),
	 * au pied de l'écran, près du pouce ; le retour le remplace après la réponse
	 */
	let { avança = 0, consigna, retorn = null, boton, onpassar = null, media, accion, reserva = null } = $props();

	// la leçon qui porte l'écran, donnée par la page : { unitat, leiçon, total }
	const ctx = getContext('gabarit') ?? {};
	const total = $derived(ctx.total ?? 5);
	const pas = $derived(Math.min(total, Math.max(1, Math.round(avança * total))));
	// la couleur de l'unité se lit au moment de s'en servir (Romain peut la changer)
	const color = $derived(colorUnitat(ctx.unitat ?? 1));
	const tinta = $derived(tintaPer(color));
</script>

<div class="ecran" style:--g-color={color} style:--g-tinta={tinta}>
	<div class="cap">
		<div class="naut">
			<span class="tancar" aria-hidden="true"><Icona nom="fermer" size="1.25rem" /></span>
			<div class="granas" role="progressbar" aria-valuemin="1" aria-valuemax={total} aria-valuenow={pas} aria-valuetext="écran {pas} sur {total}" aria-label="Avancement de la leçon">
				{#each Array.from({ length: total }, (_, i) => i) as i (i)}
					<span class:fach={i < pas - 1} class:ara={i === pas - 1}></span>
				{/each}
			</div>
		</div>
		<p class="consigna">
			<span class="num"><span class="sr">leçon </span>{ctx.leiçon ?? '1.1'}</span>
			<span class="dich"><span class="oc" lang="oc">{insecable(consigna.oc)}</span> <span class="glosa">({insecable(consigna.fr)})</span></span>
		</p>
	</div>

	{#if media}<div class="media">{@render media()}</div>{/if}
	<div class="accion">{@render accion()}</div>

	<div class="pè">
		{#if retorn}
			<div class="retorn" class:just={retorn.just} role="status">
				<p class="r-titol">
					<!-- l'animation découpe le mot en lettres et garde la main sur son contenu :
					     un titre qui change (une réponse reprise) repart d'un élément neuf -->
					{#key retorn.titol.oc}
						<span class="r-mot" lang="oc" {@attach retorn.just && animat('rebond')}>{insecable(retorn.titol.oc)}</span>
					{/key}
					<span class="glosa">({retorn.titol.fr})</span>
				</p>
				<span class="filet" aria-hidden="true"></span>
				{#if retorn.explic}<p class="r-explic">{insecable(retorn.explic)}</p>{/if}
			</div>
		{:else if reserva}
			<div class="reserva">{@render reserva()}</div>
		{/if}
		<button type="button" class="pc pc-grand boton" disabled={!boton.actiu} onclick={boton.onclick}>
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

	/* ── La tête : la couleur du module en aplat, sur toute la largeur ;
	   la croix et les carrés, puis le numéro et la consigne ── */
	.cap {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		margin: -1rem -1.1rem 0;
		padding: 1rem 1.1rem 1.2rem;
		color: var(--g-tinta);
		background: var(--g-color);
	}
	.naut {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tancar {
		display: inline-flex;
	}
	/* les petits carrés des jeux : un par écran, celui du moment est soulevé */
	.granas {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.granas span {
		width: 0.7rem;
		aspect-ratio: 1;
		border-radius: 2px;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 45%, transparent);
		transition:
			background-color 0.3s,
			transform 0.3s;
	}
	.granas .fach {
		background: currentColor;
		box-shadow: none;
	}
	.granas .ara {
		background: currentColor;
		box-shadow: 0 2px 2px var(--pc-ombre);
		transform: translateY(-2px);
	}
	.consigna {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin: 0;
		line-height: 1.35;
	}
	.num {
		flex: none;
		font-family: var(--font-heading);
		font-size: 2.2rem;
		line-height: 1;
	}
	.oc {
		font-size: 1.1rem;
		font-weight: 700;
	}
	.glosa {
		font-style: italic;
		font-size: 0.92em;
		color: var(--t-tinta-2);
	}
	/* la consigne : le mot occitan, puis sa traduction sur sa propre ligne */
	.dich .glosa {
		display: block;
		margin-top: 0.1rem;
	}
	/* dans la tête, la traduction prend la couleur du texte de la tête */
	.cap .glosa {
		color: inherit;
	}

	.media {
		flex: none;
	}
	/* la marge laisse la place aux ombres des pièces et au contour du clavier */
	.accion {
		flex: 1;
		min-height: 0;
		margin: -0.4rem -0.5rem -0.6rem;
		padding: 0.4rem 0.5rem 0.6rem;
		overflow-y: auto;
	}

	/* ── Le pied : le retour, le bouton, le droit de passer ── */
	.pè {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.retorn {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.r-titol {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0;
	}
	.r-mot {
		font-family: var(--font-heading);
		font-size: 1.8rem;
		line-height: 1.1;
	}
	.just .r-mot {
		color: var(--t-aur-gros);
	}
	/* un filet qui se trace, comme sous les titres des jeux */
	.filet {
		width: 3rem;
		height: 2px;
		background: var(--t-tinta-2);
		transform-origin: left;
		animation: trac 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.just .filet {
		background: var(--t-aur);
	}
	@keyframes trac {
		from {
			transform: scaleX(0);
		}
	}
	.r-explic {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}
	.boton {
		width: 100%;
		min-height: 3.25rem;
		font-size: 1.1rem;
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
	.passar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (prefers-reduced-motion: reduce) {
		.granas span {
			transition: none;
		}
		.filet {
			animation: none;
		}
	}
</style>
