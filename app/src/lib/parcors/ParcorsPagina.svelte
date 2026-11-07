<script>
	// Le cadre de la page du parcours (refonte de /aprene, 2026-11-02) : la barre
	// du site, le titre au gabarit des pages de rubrique, le résumé du niveau
	// (où l'on en est, « Contunhar » en un clic), les niveaux du DCL juste
	// dessous (on voit d'emblée qu'on est dans l'A1), puis le chemin que dessine
	// la page (children) et la note du compte. Romain, administrateur, voit les
	// cadenas d'un élève mais tout s'ouvre pour lui.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import FougasseIcon from '$lib/components/FougasseIcon.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session } from '$lib/authStore';
	import { esAdmin } from '$lib/adminStore';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { moduls, ordre } from '$lib/lesson/moduls/index.js';
	import { insecable } from '$lib/lesson/rich.js';
	import { camin, estatParcors, simular, NIVELS } from './parcors.js';
	import { legirAvancament } from './avancament.js';
	import { T, NOTA_COMPTE } from './textes.js';

	/** essai : ?simul=n simule l'avancement (pages /ensag/parcors) */
	let { essai = false, children } = $props();

	const etapas = camin(moduls, ordre);
	const claus = etapas.flatMap((e) => e.moduls.map((m) => m.clau));
	let fachas = $state({});
	let fogassas = $state(0);
	let prèst = $state(false);
	let ambCompte = $state(false);
	const parcors = $derived(estatParcors(etapas, fachas));
	const simul = $derived(essai ? $page.url.searchParams.get('simul') : null);

	// Le mot occitan garde la vedette ; la glose suit la langue choisie
	const glosa = (v) => (langStore.current === 'oc' ? v.fr : (v[langStore.current] ?? v.fr));
	const lg = $derived(langStore.current === 'oc' ? 'fr' : langStore.current);

	$effect(() => {
		const s = $session;
		const sim = simul;
		let viu = true;
		(async () => {
			if (sim !== null && sim !== '') {
				const n = Math.max(0, Number(sim) || 0);
				fachas = simular(etapas, n);
				fogassas = n * 42;
				prèst = true;
				return;
			}
			const r = await legirAvancament(claus);
			if (!viu) return;
			fachas = r.fachas;
			fogassas = r.fogassas;
			ambCompte = r.compte;
			prèst = true;
			// un compte sans profil passe d'abord par le questionnaire (comme avant)
			if (!essai && s) {
				const { data: profil } = await supabase.from('profiles').select('pseudo').eq('user_id', s.user.id).maybeSingle();
				if (viu && !profil) goto('/compte/questionnaire');
			}
		})();
		return () => {
			viu = false;
		};
	});

	const bloc = $derived(parcors.bloc);
	const actual = $derived(parcors.actual);
	const començat = $derived(parcors.etapasFachas > 0);
	// « Nivèl A1 · Blòc 1 sus 2 » (écrit d'un tenant : Svelte mange l'espace au
	// bord d'un {#if}) ; insécables devant les chiffres, jamais seuls en début de ligne
	const onSem = (t) => `${t(T.nivel)} A1${bloc ? ` · ${t(T.bloc)} ${bloc.n} ${t(T.sus)} ${parcors.blocs.length}` : ''}`;
</script>

{#snippet nivels()}
	<section class="nivels" aria-labelledby="nivels-titol">
		<h2 id="nivels-titol"><span lang="oc">{T.nivels.oc}</span> <span class="glosa" lang={lg}>({glosa(T.nivels)})</span></h2>
		<ol>
			{#each NIVELS as n, i (n.id)}
				<li class:actual={i === 0} class:clavat={i > 0}>
					<b>{n.id}</b>
					{#if i === 0}
						<span class="pct" dir="ltr">{parcors.percent} %</span>
					{:else}
						<Icona nom="cadenat" label="{n.id} : {tria(T.clavat)}" />
					{/if}
					<!-- le découpage en blòcs au-delà de l'A1 attend la relecture de Romain (cursus/trama-A2-C1.md) -->
					{#if i === 0}<small lang="oc">{n.blocs} blòcs</small>{/if}
				</li>
			{/each}
		</ol>
	</section>
{/snippet}

<svelte:head>
	<title>{T.titol.oc} · Lo Ligam</title>
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="parcors" class:cargant={!prèst}>
		<div class="entrada">
			<header class="cap">
				<p class="ariana"><a href="/apren"><b>02</b><span lang="oc">{T.sApren.oc}</span></a></p>
				<h1 lang="oc">{T.titol.oc}</h1>
				<p class="glosa" lang={lg}>({glosa(T.titol)})</p>
			</header>

			<section class="resum" aria-labelledby="resum-titol">
				<div class="resum-cap">
					<span class="insigna" aria-hidden="true">A1</span>
					<div>
						<p class="sur" id="resum-titol">
							<span lang="oc">{onSem((v) => v.oc)}</span>
							<span class="glosa" lang={lg}>({onSem(glosa)})</span>
						</p>
						{#if bloc}<p class="bloc-nom"><span lang="oc">{bloc.oc}</span> <span class="glosa" lang="fr">({bloc.fr})</span></p>{/if}
					</div>
				</div>

				<div class="avanç">
					<div
						class="barra"
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={parcors.percent}
						aria-label="{T.nivel.oc} A1"
					>
						<span style:width="{parcors.percent}%"></span>
					</div>
					<p class="comptes">
						<span lang="oc"><b>{parcors.modulsFachs}</b> {T.moduls.oc} {T.sus.oc} {parcors.totalModuls}</span>
						<span class="fogassas" title={tria(T.fogassas)}><FougasseIcon size={18} /> {fogassas}<span class="sr">{T.fogassas.oc}</span></span>
					</p>
				</div>

				{#if actual}
					<a class="contunhar" href="/aprene/modul/{actual.id}">
						<Icona nom="lire" size="1.5em" />
						<span class="c-verb">
							<span lang="oc">{començat ? T.contunhar.oc : T.començar.oc}</span>
							<span class="glosa" lang={lg}>({glosa(començat ? T.contunhar : T.començar)})</span>
						</span>
						<span class="c-modul" lang="oc">{actual.num ? `${actual.num} · ` : ''}{insecable(actual.oc)}</span>
					</a>
				{:else}
					<p class="acabat"><span lang="oc">{T.acabat.oc}</span> <span class="glosa" lang={lg}>({glosa(T.acabat)})</span></p>
				{/if}

				{#if $esAdmin}
					<p class="admin">Administrateur : tu vois les cadenas d’un élève, mais tout s’ouvre pour toi.</p>
				{/if}
			</section>
		</div>

		{@render nivels()}

		{@render children({ parcors, admin: $esAdmin, glosa, lg })}

		{#if prèst && !ambCompte}
			<p class="nota">
				<Icona nom="persona" />
				<span>
					<span lang="oc">{NOTA_COMPTE.oc}</span>
					<span class="glosa" lang={lg}>({glosa(NOTA_COMPTE)})</span>
				</span>
			</p>
		{/if}
	</main>
</div>

<style>
	/* Le cadre des pages intérieures, comme S'apren : fond du thème, une
	   chaleur de braise en haut à gauche, rien qui bouge */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, var(--t-braise-or), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}

	.parcors {
		container: parcors / inline-size;
		display: flex;
		flex-direction: column;
		gap: var(--esp-48);
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 5vh, 3.5rem) var(--marge) var(--esp-96);
		--aur-pichon: var(--t-aur);
	}
	/* Thème clair : sur le dégradé chaud et les fonds teintés de l'en-tête,
	   l'ocre des petits textes tombait à 3,4 à 4,3:1 (relecture de Joan,
	   2026-11-02) ; un ocre plus sombre pour eux seuls (5,3 à 5,8:1, 4,6 sur
	   la pastille des fogassas), les grands aplats gardent --t-aur */
	:global([data-tema='clar']) .parcors {
		--aur-pichon: #7d4700;
	}
	/* le temps de lire l'avancement : le chemin attend, sans clignoter */
	.parcors.cargant :global(.camin-estat) {
		opacity: 0.55;
	}

	.entrada {
		display: grid;
		gap: var(--esp-32);
	}

	.glosa {
		color: var(--t-tinta-2);
	}
	/* En arabe la page passe de droite à gauche : l'occitan et le français
	   gardent leur sens de lecture (« Cossí vas ? » et non « ? Cossí vas »),
	   calés comme le texte qui les entoure (Chromium ne connaît que la
	   forme préfixée de match-parent, Firefox que la forme standard) */
	:global(html[dir='rtl']) .parcors :global(:is([lang='oc'], [lang='fr'])) {
		direction: ltr;
		unicode-bidi: isolate;
		text-align: -webkit-match-parent;
		text-align: match-parent;
	}

	/* Le titre, au gabarit des pages de rubrique ; S'apren en fil d'Ariane */
	.ariana {
		margin: 0;
	}
	.ariana a {
		display: inline-flex;
		align-items: baseline;
		gap: 0.45em;
		color: var(--t-tinta-2);
		font-size: 1rem;
		text-decoration: none;
	}
	/* un petit chiffre : en Luciole (le zéro de Limelight se lit comme ◐) */
	.ariana b {
		font-weight: 700;
		color: var(--aur-pichon);
	}
	.ariana a:hover span,
	.ariana a:focus-visible span {
		color: var(--t-tinta);
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 4px;
	}
	h1 {
		margin: var(--esp-8) 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 7rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
	}
	.cap .glosa {
		margin: var(--esp-8) 0 0;
		font-size: 1.05rem;
	}

	/* Le résumé du niveau : où l'on en est, et la suite en un clic */
	.resum {
		display: flex;
		flex-direction: column;
		gap: var(--esp-16);
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-veire);
	}
	.resum-cap {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	.insigna {
		display: grid;
		place-items: center;
		flex: none;
		width: 4.2rem;
		height: 4.2rem;
		border: 2px solid var(--t-aur);
		border-radius: 6px;
		font-family: var(--font-heading);
		font-size: 2rem;
		color: var(--t-aur);
	}
	.sur {
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--aur-pichon);
	}
	/* la glose sur sa ligne : « (Niveau A1 · Bloc 1 sur 2) » ne se coupe plus */
	.sur .glosa {
		display: block;
		letter-spacing: 0;
		text-transform: none;
	}
	/* Limelight seulement pour les gros titres et les gros chiffres, le reste
	   en Luciole (Romain, 2026-11-02 : « assez difficile à lire ») */
	.bloc-nom {
		margin: var(--esp-4) 0 0;
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.2;
	}
	.bloc-nom .glosa {
		font-weight: 400;
		font-size: 0.9rem;
	}
	/* en arabe, la glose française ne se coupe pas autour du titre : elle
	   descend entière dessous (relecture de Joan, 2026-11-02) */
	:global(html[dir='rtl']) .bloc-nom .glosa {
		display: inline-block;
	}
	.barra {
		height: 0.55rem;
		border-radius: 999px;
		background: var(--t-linha);
		overflow: hidden;
	}
	.barra span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--t-aur);
		transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.comptes {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-8);
		margin: var(--esp-12) 0 0;
		font-size: 0.95rem;
		color: var(--t-tinta-2);
	}
	/* en Luciole : « 0 moduls » se lisait « ◐ moduls » en Limelight */
	.comptes b {
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--t-tinta);
	}
	.fogassas {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		margin-inline-start: auto;
		padding: 0.2rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
		color: var(--aur-pichon);
		font-weight: 700;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* « Contunhar » : une tuile rouge (règle B, ce qui se clique) */
	.contunhar {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.15rem var(--esp-12);
		padding: var(--esp-16);
		border-radius: 6px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		text-decoration: none;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s,
			background-color 0.2s;
	}
	.contunhar :global(.icona) {
		grid-row: span 2;
	}
	.c-verb {
		font-weight: 700;
		font-size: 1.2rem;
		line-height: 1.15;
	}
	.c-verb .glosa {
		font-weight: 400;
		font-size: 0.85rem;
		color: inherit;
	}
	.c-modul {
		font-size: 0.95rem;
	}
	.contunhar:hover {
		background: var(--t-accion-viu);
		transform: translateY(-3px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	.contunhar:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.acabat {
		margin: 0;
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--t-aur);
	}
	.acabat .glosa {
		font-weight: 400;
		font-size: 0.9rem;
	}
	.admin {
		margin: 0;
		font-size: 0.82rem;
		color: var(--t-tinta-2);
	}

	/* Les six niveaux du DCL : un chemin aussi, l'A1 allumé, la suite fermée */
	.nivels h2 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 3vw, 2rem);
	}
	.nivels h2 .glosa {
		font-family: var(--font-body);
		font-size: 0.95rem;
	}
	.nivels ol {
		position: relative;
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.nivels ol::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 8%;
		right: 8%;
		border-top: 2px dashed var(--t-linha);
	}
	.nivels li {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		aspect-ratio: 1;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta-2);
	}
	/* petits sur téléphone : en Luciole ; Limelight quand ils deviennent
	   de gros chiffres (plus bas) */
	.nivels li b {
		font-weight: 700;
		font-size: clamp(1rem, 4.2cqi, 2.4rem);
		line-height: 1;
		color: var(--t-tinta);
	}
	@container parcors (min-width: 640px) {
		.nivels li b {
			font-family: var(--font-heading);
			font-weight: 400;
		}
	}
	.nivels li.actual {
		border: 2px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 12%, var(--t-fons));
	}
	.nivels li.actual b,
	.pct {
		color: var(--aur-pichon);
	}
	.pct {
		font-size: 0.85rem;
	}
	.nivels small {
		font-size: 0.72rem;
	}

	/* dans la colonne du chemin ; sans italique, la seule de la page, qui
	   faisait charger une police de plus (44 Ko) */
	.nota {
		display: flex;
		gap: var(--esp-12);
		width: 100%;
		max-width: 52rem;
		margin: 0 auto;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.nota :global(.icona) {
		margin-top: 0.2em;
		color: var(--t-aur);
	}
	.nota > span {
		max-width: 40rem;
	}
	.nota .glosa {
		display: block;
	}

	/* Grand écran : le titre à gauche, le résumé à droite ; les niveaux en
	   bandeau, pas en grands carrés */
	@container parcors (min-width: 900px) {
		.entrada {
			grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
			align-items: end;
		}
		.nivels li {
			aspect-ratio: auto;
			min-height: 6.5rem;
			padding: var(--esp-12);
		}
		.nivels li b {
			font-size: 2rem;
		}
	}
	/* Téléphone : les niveaux sans le nombre de blòcs, la place manque */
	@container parcors (max-width: 560px) {
		.nivels ol {
			gap: var(--esp-8);
		}
		.nivels small {
			display: none;
		}
		.resum {
			padding: var(--esp-16);
		}
		.insigna {
			width: 3.6rem;
			height: 3.6rem;
			font-size: 1.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.barra span,
		.contunhar {
			transition: none;
		}
		.contunhar:hover {
			transform: none;
		}
	}
</style>
