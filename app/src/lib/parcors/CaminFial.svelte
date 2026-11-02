<script>
	// Proposition A, « Lo fial » (2026-11-02) : un fil d'or vertical relie les
	// étapes comme les stations d'une ligne ; chaque unité porte ses quatre
	// modules en cases de couleurs voisines (celle de l'unité, plus sombre, plus
	// claire), comme les cases de séance de la page module. Le fil est d'or
	// jusqu'où l'on est allé, en pointillé ensuite, et il continue jusqu'à
	// l'A2, fermé. Relecture de Joan : les stations sont d'or (le rouge reste à
	// ce qui se clique), la halte est une bande fine, et la suite fermée se
	// tasse : l'unité fermée qui vient garde ses cases (nom et glose), les
	// suivantes n'ont plus que quatre petites cases.
	import Icona from '$lib/components/Icona.svelte';
	import { insecable } from '$lib/lesson/rich.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { AUR, colorUnitat, nuanças, teula } from './colors.js';
	import { T, nomEtapa, acabaPer, motEstat, ACABA_MISSION } from './textes.js';
	import { seguentaClavada, glosaCorta } from './parcors.js';

	let { parcors, admin = false, glosa, lg } = $props();

	const indici = $derived(seguentaClavada(parcors));
	// la première unité fermée garde ses grandes cases ; au-delà, des petites
	const prochana = $derived(parcors.etapas.find((e) => e.tipe === 'unitat' && e.estat === 'clavat')?.cle);
	const missionFacha = $derived(parcors.etapas.at(-1)?.estat === 'fach');
	const colorsDe = (e) => (e.tipe === 'unitat' ? nuanças(colorUnitat(e.numero)) : [teula(AUR)]);
	// la halte et la mission sont féminines : « facha », « clavada »
	const femenina = (e) => e.tipe === 'pausa' || e.tipe === 'mission';
</script>

<ol class="fial camin-estat">
	{#each parcors.etapas as e, i (e.cle)}
		{@const cs = colorsDe(e)}
		{@const lunhana = e.tipe === 'unitat' && e.estat === 'clavat' && e.cle !== prochana}
		{#if e.bloc && e.bloc.n !== parcors.etapas[i - 1]?.bloc?.n}
			<li class="bloc-titol" class:fach={parcors.etapas[i - 1]?.estat === 'fach'}>
				<h2>
					<span class="bloc-n" lang="oc">{T.bloc.oc}&nbsp;{e.bloc.n}</span>
					<span class="bloc-oc" lang="oc">{insecable(e.bloc.oc)}</span>
					<span class="glosa" lang="fr">({insecable(e.bloc.fr)})</span>
				</h2>
			</li>
		{/if}
		<li class="estacion {e.tipe} {e.estat}" class:actuala={e.actual}>
			<span class="punt" aria-hidden="true">
				{#if e.tipe === 'unitat'}{String(e.numero).padStart(2, '0')}
				{:else if e.tipe === 'mission'}<Icona nom="senhal" />
				{:else if e.estat === 'fach'}<Icona nom="valide" />{/if}
			</span>
			<div class="cos">
				{#if e.tipe === 'unitat'}
					<header class="e-cap">
						<p class="e-sur"><span lang="oc">{nomEtapa(e).oc}</span> <span class="e-compte">{e.fachs}/{e.moduls.length}</span></p>
						<h3 lang="oc">{insecable(e.oc)}</h3>
						<p class="glosa" lang="fr">({insecable(e.fr)})</p>
					</header>
				{:else if e.tipe === 'partença'}
					<!-- « Modul 0 » en surtitre : seul, le zéro de Limelight passait pour un anneau -->
					<p class="e-sur e-sola" lang="oc">{nomEtapa(e).oc}</p>
				{/if}
				{#if indici?.etapa === e}
					{@const a = acabaPer(indici.precedenta, e)}
					<p class="indici"><Icona nom="cadenat" /> <span><span lang="oc">{a.oc}</span> <span class="glosa" lang={lg}>({insecable(glosa(a))})</span></span></p>
				{/if}
				{#if e.tipe === 'pausa'}
					{@const m = e.moduls[0]}
					{@const obert = m.estat !== 'clavat' || admin}
					{@const mot = motEstat(m.estat, true)}
					<div class="banda {m.estat}" class:actual={m.actual}>
						<svelte:element
							this={obert ? 'a' : 'span'}
							class="b-ligam"
							href={obert ? `/aprene/modul/${m.id}` : undefined}
							aria-disabled={obert ? undefined : 'true'}
							aria-current={m.actual ? 'step' : undefined}
						>
							<span class="b-nom"><span lang="oc">{insecable(m.oc)}</span> <span class="glosa" lang="fr">({insecable(glosaCorta(m.fr))})</span></span>
							{#if m.estat === 'clavat'}<Icona nom="cadenat" label={tria(mot)} />{:else if mot}<span class="sr">{tria(mot)}</span>{/if}
						</svelte:element>
						{#if m.actual}<span class="aici" lang="oc">{T.siasAici.oc}</span>{/if}
					</div>
				{:else}
					<ul class="teulas" class:sola={e.moduls.length === 1} class:lunhanas={lunhana}>
						{#each e.moduls as m, k (m.id)}
							{@const [fons, tinta] = cs[k % cs.length]}
							{@const obert = m.estat !== 'clavat' || admin}
							{@const mot = motEstat(m.estat, femenina(e))}
							<li class="teula {m.estat}" class:actual={m.actual} style:--fons={fons} style:--tinta={tinta}>
								<svelte:element
									this={obert ? 'a' : 'span'}
									class="t-ligam"
									href={obert ? `/aprene/modul/${m.id}` : undefined}
									aria-disabled={obert ? undefined : 'true'}
									aria-current={m.actual ? 'step' : undefined}
									title={lunhana ? `${m.oc} (${glosaCorta(m.fr)})` : undefined}
								>
									<span class="t-num" aria-hidden="true">
										{#if !lunhana}{#if m.estat === 'clavat'}<Icona nom="cadenat" />{:else if m.estat === 'fach'}<Icona nom="valide" />{/if}{/if}
										{#if m.num}{m.num}{:else}<Icona nom="senhal" />{/if}
									</span>
									{#if lunhana}
										<span class="sr" lang="oc">{m.oc}</span>
									{:else}
										<span class="t-nom" lang="oc">{insecable(m.oc)}</span>
										<span class="t-fr" lang="fr">({insecable(glosaCorta(m.fr))})</span>
									{/if}
									<span class="t-estat">
										{#if m.estat === 'en-cors'}<span class="mini" style:--p={m.fachas / m.etapas}></span> {m.fachas}/{m.etapas} <span lang="oc">{T.etapas.oc}</span>
										{:else if m.estat === 'dobert'}{m.etapas} <span lang="oc">{T.etapas.oc}</span>
										{:else if mot}<span class="sr">{tria(mot)}</span>{/if}
									</span>
								</svelte:element>
								{#if m.actual}<span class="aici" lang="oc">{T.siasAici.oc}</span>{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</li>
	{/each}
	<!-- le fil ne s'arrête pas à l'A1 : la porte de l'A2, fermée -->
	<li class="estacion nivel clavat">
		<span class="punt" aria-hidden="true"><Icona nom="cadenat" /></span>
		<div class="cos">
			<header class="e-cap">
				<h2 class="n-titol" lang="oc">{T.nivel.oc}&nbsp;A2</h2>
				<p class="glosa" lang={lg}>({glosa(T.nivel)}&nbsp;A2)</p>
			</header>
			{#if !missionFacha}
				<p class="indici"><Icona nom="cadenat" /> <span><span lang="oc">{ACABA_MISSION.oc}</span> <span class="glosa" lang={lg}>({insecable(glosa(ACABA_MISSION))})</span></span></p>
			{/if}
		</div>
	</li>
</ol>

<style>
	.fial {
		--punt: 2.9rem;
		--pas: var(--esp-32);
		display: flex;
		flex-direction: column;
		gap: var(--pas);
		margin: 0;
		padding: 0;
		list-style: none;
		transition: opacity 0.3s;
	}

	/* Le fil : chaque station trace le bout qui la relie à la suivante, d'or
	   si elle est finie, en pointillé sinon */
	.estacion,
	.bloc-titol {
		position: relative;
	}
	.estacion::before,
	.bloc-titol::before {
		content: '';
		position: absolute;
		left: calc(var(--punt) / 2 - 1px);
		top: calc(var(--punt) / 2);
		bottom: calc(-1 * var(--pas));
		border-left: 2px dashed color-mix(in srgb, var(--t-tinta) 30%, transparent);
	}
	.bloc-titol::before {
		top: calc(-1 * var(--pas) / 2);
	}
	.estacion.fach::before,
	.bloc-titol.fach::before {
		border-left: 3px solid var(--t-aur);
		left: calc(var(--punt) / 2 - 1.5px);
	}
	/* après l'A2, le fil continue et s'efface : la suite viendra */
	.estacion.nivel::before {
		bottom: auto;
		height: var(--esp-64);
		mask-image: linear-gradient(#000 30%, transparent);
	}

	.estacion {
		display: grid;
		grid-template-columns: var(--punt) minmax(0, 1fr);
		gap: var(--esp-16);
	}

	/* La station sur le fil : d'or (le rouge reste à ce qui se clique),
	   pleine quand l'étape est faite, en creux quand elle est fermée */
	.punt {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		width: var(--punt);
		height: var(--punt);
		border: 3px solid var(--t-aur);
		border-radius: 50%;
		background: var(--t-fons);
		color: var(--t-aur);
		font-family: var(--font-heading);
		font-size: 1.15rem;
	}
	.estacion.fach .punt {
		background: var(--t-aur);
		color: var(--t-fons);
	}
	.estacion.clavat .punt {
		border-color: color-mix(in srgb, var(--t-tinta) 30%, transparent);
		color: var(--t-tinta-2);
	}
	.pausa .punt,
	.partença .punt,
	.nivel .punt {
		width: calc(var(--punt) * 0.62);
		height: calc(var(--punt) * 0.62);
		margin: calc(var(--punt) * 0.19);
		font-size: 0.85rem;
	}
	.mission .punt {
		font-size: 1.3rem;
	}

	/* Le titre de blòc, posé sur le fil */
	.bloc-titol {
		padding-left: calc(var(--punt) + var(--esp-16));
	}
	.bloc-titol h2 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		margin: 0;
		font-weight: 400;
	}
	/* le h2 prend la police des titres : le surtitre et la glose reviennent au courant */
	.bloc-n,
	.bloc-titol .glosa {
		font-family: var(--font-body);
	}
	.bloc-n {
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.bloc-oc {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 4vw, 2.2rem);
		line-height: 1.05;
	}
	.bloc-titol .glosa {
		font-size: 0.9rem;
	}
	.glosa {
		color: var(--t-tinta-2);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* L'en-tête de l'unité */
	.cos {
		min-width: 0;
	}
	.e-cap {
		margin-bottom: var(--esp-12);
	}
	.e-sur {
		display: flex;
		gap: 0.6rem;
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.e-sola {
		margin-bottom: var(--esp-8);
	}
	.e-compte {
		letter-spacing: 0.04em;
		color: var(--t-tinta-2);
	}
	h3,
	.n-titol {
		margin: var(--esp-4) 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.7rem, 5vw, 2.4rem);
		line-height: 1.05;
	}
	.e-cap .glosa {
		margin: var(--esp-4) 0 0;
		font-size: 0.9rem;
	}
	.clavat h3,
	.n-titol {
		color: var(--t-tinta-2);
	}
	.indici {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0 0 var(--esp-12);
		font-size: 0.88rem;
		color: var(--t-tinta);
	}
	.indici :global(.icona) {
		flex: none;
		color: var(--t-aur);
	}

	/* La halte : une bande fine sur le fil, pas une case aussi lourde qu'un module */
	.pausa {
		align-items: center;
	}
	.banda {
		position: relative;
		max-width: 34rem;
	}
	.b-ligam {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--esp-12);
		padding: var(--esp-8) var(--esp-12);
		border: 2px solid var(--t-aur);
		border-radius: 6px;
		color: var(--t-aur);
		text-decoration: none;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	a.b-ligam:hover {
		transform: translateY(-3px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	a.b-ligam:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.b-nom {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		line-height: 1.15;
	}
	.b-nom .glosa {
		font-family: var(--font-body);
		font-size: 0.82rem;
	}
	.banda.clavat .b-ligam {
		border-style: dashed;
		border-color: color-mix(in srgb, var(--t-tinta) 30%, transparent);
		color: var(--t-tinta-2);
	}
	.banda.actual .b-ligam {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* Les cases des modules, comme les cases de séance */
	.teulas {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--esp-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.teulas.sola {
		grid-template-columns: minmax(0, 1fr);
		max-width: 26rem;
	}
	.teula {
		position: relative;
	}
	.t-ligam {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 100%;
		min-height: 9rem;
		padding: var(--esp-12);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		text-decoration: none;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	.sola .t-ligam {
		min-height: 0;
	}
	a.t-ligam:hover {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	a.t-ligam:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.t-num {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-heading);
		font-size: 1.7rem;
		line-height: 1;
	}
	.t-num :global(.icona) {
		font-size: 0.7em;
	}
	.t-nom {
		margin-top: var(--esp-12);
		font-family: var(--font-heading);
		font-size: clamp(0.95rem, 1.6vw, 1.15rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.t-fr {
		margin-top: var(--esp-4);
		font-size: 0.78rem;
		line-height: 1.3;
	}
	.t-estat {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		padding-top: var(--esp-8);
		font-size: 0.75rem;
	}
	/* une étape commencée : un petit anneau qui se remplit */
	.mini {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		background: conic-gradient(currentColor calc(var(--p) * 360deg), color-mix(in srgb, currentColor 25%, transparent) 0);
	}

	/* fait : la couleur s'éteint un peu, le texte garde son contraste (Joan :
	   l'opacité le faisait tomber sous 4,5:1) ; la coche dit le reste */
	.teula.fach .t-ligam {
		filter: saturate(0.65);
	}
	/* fermé : la case en creux, sa couleur en filet, le cadenas ; plus basse,
	   pour que la suite se voie sans allonger la page */
	.teula.clavat .t-ligam {
		min-height: 5.5rem;
		border: 1px solid color-mix(in srgb, var(--fons) 60%, transparent);
		background: color-mix(in srgb, var(--fons) 24%, var(--t-fons));
		color: var(--t-tinta-2);
	}
	/* plus loin : quatre petites cases sur une ligne, le numéro seul */
	.teulas.lunhanas {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		max-width: 26rem;
	}
	.teulas.lunhanas .t-ligam {
		min-height: 0;
		padding: var(--esp-8);
	}
	.lunhanas .t-num {
		font-size: 1.05rem;
	}
	.lunhanas .t-estat {
		display: none;
	}
	/* là où l'on est : un anneau d'or et l'étiquette « Siás aicí » ; sur l'or,
	   l'encre du fond (l'encre fixe tombait à 3:1 sur l'ocre du thème clair) */
	.teula.actual .t-ligam {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.aici {
		position: absolute;
		top: -0.85rem;
		right: var(--esp-8);
		z-index: 2;
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		background: var(--t-aur);
		color: var(--t-fons);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		pointer-events: none;
	}

	/* Grand écran : l'unité sur une ligne, son nom à gauche, ses quatre cases */
	@container parcors (min-width: 900px) {
		.fial {
			--punt: 3.4rem;
		}
		.punt {
			font-size: 1.35rem;
		}
		.unitat .cos {
			display: grid;
			grid-template-columns: 15rem minmax(0, 1fr);
			gap: var(--esp-12) var(--esp-24);
			align-items: start;
		}
		.unitat .indici {
			grid-column: 2;
			grid-row: 1;
			margin: 0;
		}
		.unitat .indici + .teulas {
			grid-column: 2;
		}
		.unitat .e-cap {
			grid-row: span 2;
			margin: 0;
		}
		.teulas {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: var(--esp-12);
		}
		.t-ligam {
			min-height: 10.5rem;
			padding: var(--esp-16);
		}
		.t-num {
			font-size: 2.2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.t-ligam,
		.b-ligam {
			transition: none;
		}
		a.t-ligam:hover,
		a.b-ligam:hover {
			transform: none;
		}
	}
</style>
