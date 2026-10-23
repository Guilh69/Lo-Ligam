<script>
	// La lectura de la carta (DIRECCION bloc 1, Romain : « naviguer entre le
	// territoire naturel et la réalité d'aujourd'hui ») : un geste toujours
	// visible qui dit dans quelle lecture on est et permet de passer à l'autre.
	// Il aboutit la première visite « Trois portes » (22-10 : « la carte ne
	// montre pas dans quelle lecture on est »). Trois formes à comparer sur
	// /carta?ensag=lectura :
	//   A « La bascule » : deux positions, Territòri | Reviscolada (comme Òc / Fr) ;
	// Seconde lecture renommée « Reviscolada » le 22-10 (Romain : les voix de
	// l'Atlas sont les témoins de la langue parlée dans sa diversité, pas la
	// revitalisation ; la revitalisation = calandretas, cercles occitans,
	// formateurs, librairies, organismes engagés). « Uèi » (part de locuteurs
	// par département, enquête OPLO 2020) arrive le 2026-10-23, entre les deux :
	// la bascule passe à trois positions (0 Territòri, 1 Uèi, 2 Reviscolada),
	// avec la légende des teintes sous elle quand « Uèi » est choisi.
	//   B « Le cartouche » : le titre de la lecture en cours, une ligne dessous,
	//     et le passage vers les autres ;
	//   C « La glissière » : un curseur continu de 0 à 2, la carte se fond.
	// La lecture estompe les teintes des dialectes (colaDonadas.setLectura) et
	// allume les couches de la lecture (la page) ; les portes de la première
	// visite la choisissent aussi. Occitan vérifié par l'API (lectura, aira,
	// istorica, votz, territòri, locutor, departament) ; « uèi » validé par Romain (2026-10-23).
	import Icona from './Icona.svelte';
	import { CLASSAS, FONT_LOCUTORS, gamaLocutors, alfaLocutors } from '$lib/carta/locutors.js';

	let { lectura = 0, forma = $bindable('bascula'), ensag = false, lang = 'oc', clar = false, dalt = false, onCausir = () => {}, onNaut = () => {} } = $props();

	const FORMAS = [
		['bascula', 'La bascule'],
		['cartocha', 'Le cartouche'],
		['glissiera', 'La glissière']
	];
	const T = {
		oc: {
			lectura: 'Lectura de la carta',
			noms: ['Territòri', 'Uèi', 'Reviscolada'],
			titols: ['Lo territòri', 'Uèi', 'La reviscolada'],
			sotas: ['L’aira istorica de la lenga', 'Los locutors, per departament', 'Calandretas e librariás'],
			passar: 'Passar a',
			gama: 'Locutors, en % dels 15 ans e mai'
		},
		fr: {
			lectura: 'Lecture de la carte',
			noms: ['Territoire', 'Aujourd’hui', 'Revitalisation'],
			titols: ['Le territoire', 'Aujourd’hui', 'La revitalisation'],
			sotas: ['L’aire historique de la langue', 'Les locuteurs, par département', 'Calandretas et librairies'],
			passar: 'Passer à',
			gama: 'Locuteurs, en % des 15 ans et plus'
		}
	};
	const tx = $derived(T[lang] ?? T.oc);
	// la position : 0 territòri, 1 uèi, 2 reviscolada (la glissière va de l'une à l'autre)
	const pos = $derived(Math.max(0, Math.min(2, Math.round(lectura))));
	const gama = $derived(gamaLocutors(dalt));
	let nautGama = $state(0);

	// Quand la commande partage la rangée des mots à écouter (téléphone, écran
	// moyen, ou la glissière sous la recherche), la page décale cette rangée de
	// sa hauteur (seuil : celui du style, plus bas)
	let naut = $state(0);
	let estrech = $state(false);
	$effect(() => {
		const mq = matchMedia('(max-width: 1020px)');
		const f = () => (estrech = mq.matches);
		f();
		mq.addEventListener('change', f);
		return () => mq.removeEventListener('change', f);
	});
	$effect(() => {
		// (la légende de « Uèi », sous la bascule, compte dans la hauteur)
		const gama = forma === 'bascula' && pos === 1 && nautGama ? nautGama + 6 : 0;
		onNaut(estrech || forma === 'glissiera' ? naut + 10 + gama : 0);
	});
</script>

{#if forma === 'bascula'}
	<div class="lectura bascula comandas-carta" bind:clientHeight={naut} role="group" aria-label={tx.lectura}>
		{#each tx.noms as nom, i (i)}
			<button type="button" aria-pressed={pos === i} onclick={() => onCausir(i)}>{nom}</button>
		{/each}
	</div>
	<!-- la légende des teintes de « Uèi » : cinq classes, la source en lien -->
	{#if pos === 1}
		<div class="lectura gama comandas-carta" bind:clientHeight={nautGama} style:--alfa={alfaLocutors(clar)}>
			<p>{tx.gama}</p>
			<div class="linha">
				<ol>
					{#each CLASSAS as m, i (m)}
						<li><i style:background={gama[i]}></i><span>{m === 20 ? '20 +' : m}</span></li>
					{/each}
				</ol>
				<a href={FONT_LOCUTORS.url} target="_blank" rel="noopener" title={FONT_LOCUTORS[lang === 'fr' ? 'fr' : 'oc']}>OPLO 2020</a>
			</div>
		</div>
	{/if}
{:else if forma === 'cartocha'}
	<div class="lectura cartocha comandas-carta" bind:clientHeight={naut} role="group" aria-label={tx.lectura}>
		<p class="sobre">{tx.lectura}</p>
		<h2>{tx.titols[pos]}</h2>
		<p class="sota">{tx.sotas[pos]}</p>
		{#each [0, 1, 2].filter((i) => i !== pos) as i (i)}
			<button type="button" class="autra" onclick={() => onCausir(i)}>{tx.passar} « {tx.titols[i]} » <Icona nom="suivant" size="0.9em" /></button>
		{/each}
	</div>
{:else}
	<div class="lectura glissiera comandas-carta" bind:clientHeight={naut}>
		<span class:on={pos === 0}>{tx.noms[0]}</span>
		<input
			type="range"
			min="0"
			max="2"
			step="0.01"
			value={lectura}
			aria-label={tx.lectura}
			aria-valuetext={tx.noms[pos]}
			oninput={(e) => onCausir(e.currentTarget.value)}
		/>
		<span class:on={pos === 2}>{tx.noms[2]}</span>
		<span class="mitan" class:on={pos === 1}>{tx.noms[1]}</span>
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
		z-index: 999; /* sous la recherche (1000) : sa liste de résultats passe devant */
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
	/* la légende de « Uèi », sous la bascule, à droite du rail des couches */
	.gama {
		top: calc(var(--cap-bas, 5.4rem) + 18px + 50px);
		left: calc(var(--marge, 1rem) + 5.3rem);
		padding: 0.45rem 0.75rem 0.35rem;
		border-radius: 12px;
		font-size: 0.72rem;
	}
	.gama p {
		margin: 0 0 0.3rem;
		font-weight: 700;
	}
	.gama .linha {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.gama ol {
		display: flex;
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.gama li {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.gama i {
		display: block;
		width: 34px;
		height: 10px;
		opacity: var(--alfa);
	}
	.gama li span {
		font-size: 0.66rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
	}
	.gama a {
		font-size: 0.66rem;
		white-space: nowrap;
		color: var(--t-tinta-2);
		text-underline-offset: 0.2em;
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
	/* « Uèi », au milieu de la course : écrit sous la glissière quand on y est */
	.glissiera .mitan {
		position: absolute;
		top: calc(100% + 4px);
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.glissiera .mitan.on {
		opacity: 1;
	}

	/* écran moyen : la bascule à trois positions toucherait la recherche (centrée,
	   400 px) ; elle passe sous elle, à droite du rail des couches */
	@media (min-width: 761px) and (max-width: 1020px) {
		.bascula {
			top: calc(var(--cap-bas, 5.4rem) + 18px + 60px);
			left: calc(var(--marge, 1rem) + 5.3rem);
		}
		.gama {
			top: calc(var(--cap-bas, 5.4rem) + 18px + 60px + 50px);
		}
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
		.gama {
			top: calc(var(--cap-bas, 6.4rem) + 18px + 60px + 50px);
			left: var(--marge, 1rem);
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
