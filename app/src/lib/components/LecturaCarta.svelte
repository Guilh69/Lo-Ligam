<script>
	// La lectura de la carta (DIRECCION bloc 1, Romain : « naviguer entre le
	// territoire naturel et la réalité d'aujourd'hui ») : un geste toujours
	// visible qui dit dans quelle lecture on est et permet de passer à l'autre.
	// Il aboutit la première visite « Trois portes » (22-10 : « la carte ne
	// montre pas dans quelle lecture on est »). Trois formes à comparer sur
	// /carta?ensag=lectura :
	//   A « La bascule » : deux positions, Territòri | Uèi (comme Òc / Fr) ;
	//   B « Le cartouche » : le titre de la lecture en cours, une ligne dessous,
	//     et le passage vers l'autre ;
	//   C « La glissière » : un curseur continu entre les deux, la carte se fond.
	// La lecture estompe les teintes des dialectes (colaDonadas.setLectura) et
	// allume les couches d'aujourd'hui (la page) ; les portes de la première
	// visite la choisissent aussi. Occitan vérifié par l'API (lectura, aira,
	// istorica, votz, territòri) ; « uèi » à valider par Romain.
	import Icona from './Icona.svelte';

	let { lectura = 0, forma = $bindable('bascula'), ensag = false, lang = 'oc', onCausir = () => {}, onNaut = () => {} } = $props();

	const FORMAS = [
		['bascula', 'La bascule'],
		['cartocha', 'Le cartouche'],
		['glissiera', 'La glissière']
	];
	const T = {
		oc: {
			lectura: 'Lectura de la carta',
			territori: 'Territòri',
			uei: 'Uèi',
			titols: ['Lo territòri', 'Ont se parla uèi'],
			sotas: ['L’aira istorica de la lenga', 'Calandretas e votz de l’Atlas'],
			passar: 'Passar a'
		},
		fr: {
			lectura: 'Lecture de la carte',
			territori: 'Territoire',
			uei: 'Aujourd’hui',
			titols: ['Le territoire', 'Où ça se parle aujourd’hui'],
			sotas: ['L’aire historique de la langue', 'Calandretas et voix de l’Atlas'],
			passar: 'Passer à'
		}
	};
	const tx = $derived(T[lang] ?? T.oc);
	const uei = $derived(lectura >= 0.5);

	// Quand la commande partage la rangée des mots à écouter (téléphone, ou la
	// glissière sous la recherche), la page décale cette rangée de sa hauteur
	let naut = $state(0);
	let estrech = $state(false);
	$effect(() => {
		const mq = matchMedia('(max-width: 760px)');
		const f = () => (estrech = mq.matches);
		f();
		mq.addEventListener('change', f);
		return () => mq.removeEventListener('change', f);
	});
	$effect(() => {
		onNaut(estrech || forma === 'glissiera' ? naut + 10 : 0);
	});
</script>

{#if forma === 'bascula'}
	<div class="lectura bascula comandas-carta" bind:clientHeight={naut} role="group" aria-label={tx.lectura}>
		<button type="button" aria-pressed={!uei} onclick={() => onCausir(0)}>{tx.territori}</button>
		<button type="button" aria-pressed={uei} onclick={() => onCausir(1)}>{tx.uei}</button>
	</div>
{:else if forma === 'cartocha'}
	<div class="lectura cartocha comandas-carta" bind:clientHeight={naut} role="group" aria-label={tx.lectura}>
		<p class="sobre">{tx.lectura}</p>
		<h2>{tx.titols[uei ? 1 : 0]}</h2>
		<p class="sota">{tx.sotas[uei ? 1 : 0]}</p>
		<button type="button" class="autra" onclick={() => onCausir(uei ? 0 : 1)}>{tx.passar} « {tx.titols[uei ? 0 : 1]} » <Icona nom="suivant" size="0.9em" /></button>
	</div>
{:else}
	<div class="lectura glissiera comandas-carta" bind:clientHeight={naut}>
		<span class:on={!uei}>{tx.territori}</span>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={lectura}
			aria-label={tx.lectura}
			aria-valuetext={uei ? tx.uei : tx.territori}
			oninput={(e) => onCausir(e.currentTarget.value)}
		/>
		<span class:on={uei}>{tx.uei}</span>
	</div>
{/if}

{#if ensag}
	<!-- Outil d'essai (hors charte) -->
	<div class="causida" role="group" aria-label="Essai : le geste territoire / aujourd'hui">
		{#each FORMAS as [v, nom] (v)}
			<button type="button" aria-pressed={forma === v} onclick={() => (forma = v)}>{nom}</button>
		{/each}
	</div>
{/if}

<style>
	.lectura {
		position: absolute;
		z-index: 1000;
		font-family: var(--font-body);
		color: var(--t-tinta);
		background: var(--t-veire-fort);
		backdrop-filter: blur(10px);
		box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6);
	}

	/* A : la bascule, en haut à gauche sous le bandeau, dans l'esprit d'Òc / Fr */
	.bascula {
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		left: var(--marge, 1rem);
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		border-radius: 999px;
	}
	.bascula button {
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: 700;
		font-size: 0.8rem;
		min-height: 38px;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background 0.5s cubic-bezier(0.19, 1, 0.22, 1),
			color 0.5s;
	}
	.bascula button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	/* B : le cartouche, à droite du rail : le titre de la lecture en cours */
	.cartocha {
		top: calc(var(--cap-bas, 5.4rem) + 18px + 60px); /* sous la rangée de la recherche : elle est large, le cartouche aussi */
		left: calc(var(--marge, 1rem) + 4.4rem);
		width: min(290px, calc(100% - 2 * var(--marge, 1rem) - 4.4rem));
		padding: 0.8rem 1rem 0.5rem;
		border-radius: 14px;
	}
	.cartocha .sobre {
		margin: 0;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.cartocha h2 {
		margin: 0.15rem 0 0.2rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		line-height: 1.05;
	}
	.cartocha .sota {
		margin: 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.cartocha .autra {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.35rem;
		padding: 0.4rem 0;
		min-height: 40px;
		border: 0;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	/* C : la glissière, sous la recherche : la carte se fond de l'une à l'autre */
	.glissiera {
		top: calc(var(--cap-bas, 5.4rem) + 18px + 60px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.4rem 1rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}
	.glissiera span {
		color: var(--t-tinta-2);
		transition: color 0.4s;
	}
	.glissiera span.on {
		color: var(--t-tinta);
	}
	.glissiera input {
		width: 160px;
		margin: 0;
		accent-color: var(--t-aur);
		cursor: pointer;
	}

	/* téléphone : sous la recherche, à gauche (la recherche prend toute la largeur) */
	@media (max-width: 760px) {
		.bascula,
		.cartocha,
		.glissiera {
			top: calc(var(--cap-bas, 6.4rem) + 18px + 60px);
			left: var(--marge, 1rem);
			transform: none;
		}
		.cartocha {
			width: calc(100% - 2 * var(--marge, 1rem));
		}
		.glissiera {
			right: var(--marge, 1rem);
		}
		.glissiera input {
			flex: 1;
			width: auto;
		}
	}

	/* Outil d'essai, volontairement neutre */
	.causida {
		position: absolute;
		left: 50%;
		bottom: calc(var(--barra-bas, 0px) + 12px);
		z-index: 1200;
		transform: translateX(-50%);
		display: flex;
		gap: 3px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		font: 700 0.8rem/1 system-ui, sans-serif;
	}
	.causida button {
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 0.9rem;
		background: transparent;
		color: #222222;
		font: inherit;
		cursor: pointer;
		white-space: nowrap;
	}
	.causida button[aria-pressed='true'] {
		background: #222222;
		color: #ffffff;
	}
</style>
