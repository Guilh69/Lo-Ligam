<script>
	// Proposition B, « Lo camin » (2026-11-02) : un plateau de jeu, comme le jeu
	// de l'oie. Chaque module est une case ; une unité tient une rangée de
	// quatre cases, aux couleurs des quatre premières cases de séance de la page
	// module (brique, pétrole, olive, bleu), et le chemin serpente d'une rangée
	// à l'autre. Les haltes sont des gares dans les virages, la mission la
	// dernière case, puis le chemin continue jusqu'à l'A2, fermé. Le chemin est
	// d'or là où l'on est passé, en pointillé ensuite. Relecture de Joan : sur
	// téléphone les cases ne montrent que leur numéro, alors l'unité du jour
	// se déplie en quatre grandes cases, avec le nom et la glose.
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { insecable } from '$lib/lesson/rich.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { AUR, PRUNA, teula } from './colors.js';
	import { T, nomEtapa, acabaPer, motEstat, ACABA_MISSION, A2_EN_PREPARACION } from './textes.js';
	import { seguentaClavada, glosaCorta } from './parcors.js';

	let { parcors, admin = false, glosa, lg } = $props();

	const indici = $derived(seguentaClavada(parcors));

	// L'unité dépliée : celle du jour ; sur une étape hors unité (module 0,
	// halte), l'unité qui vient. Rien quand tout l'A1 est fait.
	const dubèrta = $derived.by(() => {
		const i = parcors.etapas.findIndex((e) => e.actual);
		return i < 0 ? null : (parcors.etapas.slice(i).find((e) => e.tipe === 'unitat') ?? null);
	});

	// Le plateau : une suite de rangées (une par unité, dans un sens puis dans
	// l'autre) et de virages (le titre de l'unité qui vient, la halte s'il y en
	// a une). « col » : la colonne où arrive le chemin, la 1re ou la 4e.
	// L'unité dépliée fait l'aller et le retour (deux cases, puis deux en
	// dessous) : le chemin en ressort du côté où il est entré.
	const plateau = $derived.by(() => {
		const out = [];
		let col = 1;
		let virada = null;
		let precedent = null;
		const viradaDe = () => (virada ??= { tipe: 'virada', col, vengut: precedent?.estat === 'fach', pausa: null, bloc: null, unitat: null });
		parcors.etapas.forEach((e, i) => {
			if (e.tipe === 'partença') {
				out.push({ tipe: 'sola', etapa: e, col: 1 });
				precedent = e.moduls[0];
			} else if (e.tipe === 'pausa') {
				viradaDe().pausa = e;
				precedent = e.moduls[0];
			} else if (e.tipe === 'mission') {
				if (virada) out.push({ ...virada, vengutAval: precedent?.estat === 'fach' });
				virada = null;
				out.push({ tipe: 'sola', etapa: e, col });
				const fach = e.moduls[0].estat === 'fach';
				out.push({ tipe: 'virada', col, vengut: fach, vengutAval: fach, corta: true });
				out.push({ tipe: 'nivel', col, fach });
			} else {
				const v = viradaDe();
				if (e.bloc && e.bloc.n !== parcors.etapas[i - 1]?.bloc?.n) v.bloc = e.bloc;
				v.unitat = e;
				v.vengutAval = precedent?.estat === 'fach';
				out.push(v);
				virada = null;
				const sens = col === 1 ? 'dreit' : 'esquèr';
				const dubèrt = e.cle === dubèrta?.cle && e.moduls.length === 4;
				out.push({ tipe: 'rang', etapa: e, sens, dubèrt });
				if (!dubèrt) col = sens === 'dreit' ? 4 : 1;
				precedent = e.moduls.at(-1);
			}
		});
		return out;
	});

	const colorCas = (e, k) => (e.tipe === 'partença' ? teula(AUR) : e.tipe === 'mission' ? teula(PRUNA) : PALETAS.charta[k % 4]);

	// L'unité dépliée : deux grandes cases à l'aller, deux au retour ; le
	// chemin descend entre la deuxième et la troisième
	function plaçaDubèrta(sens, k) {
		const [a, b] = sens === 'dreit' ? ['1 / 3', '3 / 5'] : ['3 / 5', '1 / 3'];
		return [
			{ col: a, rang: 1, costat: sens },
			{ col: b, rang: 1, costat: sens },
			{ col: b, rang: 2, costat: 'amont' },
			{ col: a, rang: 2, costat: sens === 'dreit' ? 'esquèr' : 'dreit' }
		][k];
	}
</script>

{#snippet cas(m, e, k, col, costat, rang = 1, gran = false)}
	{@const [fons, tinta] = colorCas(e, k)}
	{@const obert = m.estat !== 'clavat' || admin}
	{@const vengut = k > 0 && e.moduls[k - 1].estat === 'fach'}
	{@const mot = motEstat(m.estat)}
	<li
		class="cas {m.estat} {costat}"
		class:actual={m.actual}
		class:vengut
		class:gran
		style:grid-column={col}
		style:grid-row={rang}
		style:--fons={fons}
		style:--tinta={tinta}
	>
		<svelte:element
			this={obert ? 'a' : 'span'}
			class="c-ligam"
			href={obert ? `/aprene/modul/${m.id}` : undefined}
			aria-disabled={obert ? undefined : 'true'}
			aria-current={m.actual ? 'step' : undefined}
			title={gran ? undefined : `${m.oc} (${glosaCorta(m.fr)})`}
		>
			<span class="c-num" class:zero={m.num === '0'}>{#if m.num}{m.num}{:else}<Icona nom="senhal" />{/if}</span>
			<span class="c-nom" lang="oc">{insecable(m.oc)}</span>
			{#if gran}<span class="c-glosa" lang="fr">({insecable(glosaCorta(m.fr))})</span>{/if}
			<span class="c-estat">
				{#if mot}<Icona nom={m.estat === 'fach' ? 'valide' : 'cadenat'} label={tria(mot)} />
				{:else if m.estat === 'en-cors'}<span class="mini" role="img" aria-label="{m.fachas}/{m.etapas} {tria(T.etapas)}" style:--p={m.fachas / m.etapas}></span>{/if}
			</span>
		</svelte:element>
		{#if m.actual}<span class="aici" lang="oc">{T.siasAici.oc}</span>{/if}
	</li>
{/snippet}

<div class="plateau camin-estat">
	{#each plateau as b, i (i)}
		{#if b.tipe === 'sola'}
			{@const m = b.etapa.moduls[0]}
			{@const nom = nomEtapa(b.etapa).oc}
			<div class="sola" class:fin={b.etapa.tipe === 'mission'} class:a-drecha={b.col === 4}>
				<ol class="rang">{@render cas(m, b.etapa, 0, b.col, '')}</ol>
				<div class="sola-tèxt">
					{#if nom.toLowerCase() !== m.oc.toLowerCase()}<p class="sur" lang="oc">{nom}</p>{/if}
					<h3 class="s-nom" lang="oc">{insecable(m.oc)}</h3>
					<p class="glosa" lang="fr">({insecable(glosaCorta(m.fr))})</p>
				</div>
			</div>
		{:else if b.tipe === 'nivel'}
			{@const [fons, tinta] = teula(AUR)}
			{@const indiciA2 = b.fach ? A2_EN_PREPARACION : ACABA_MISSION}
			<!-- le chemin ne s'arrête pas à l'A1 : la porte de l'A2, fermée -->
			<div class="sola nivel" class:a-drecha={b.col === 4}>
				<ol class="rang">
					<li class="cas clavat" style:grid-column={b.col} style:--fons={fons} style:--tinta={tinta}>
						<span class="c-ligam" aria-disabled="true">
							<span class="c-num">A2</span>
							<span class="c-estat"><Icona nom="cadenat" label={tria(T.clavat)} /></span>
						</span>
					</li>
				</ol>
				<div class="sola-tèxt">
					<h2 class="s-nom" lang="oc">{T.nivel.oc}&nbsp;A2</h2>
					<p class="glosa" lang={lg}>({glosa(T.nivel)}&nbsp;A2)</p>
					<p class="indici"><Icona nom="cadenat" /> <span><span lang="oc">{indiciA2.oc}</span> <span class="glosa" lang={lg}>({insecable(glosa(indiciA2))})</span></span></p>
				</div>
			</div>
		{:else if b.tipe === 'virada'}
			<div class="virada" class:corta={b.corta} class:amb-gara={!!b.pausa} class:a-drecha={b.col === 4} class:vengut={b.vengut} class:vengut-aval={b.vengutAval}>
				{#if b.pausa}
					{@const p = b.pausa.moduls[0]}
					{@const obert = p.estat !== 'clavat' || admin}
					{@const mot = motEstat(p.estat, true)}
					<div class="gara {p.estat}" class:actual={p.actual}>
						<svelte:element
							this={obert ? 'a' : 'span'}
							class="g-ligam"
							href={obert ? `/aprene/modul/${p.id}` : undefined}
							aria-disabled={obert ? undefined : 'true'}
							aria-current={p.actual ? 'step' : undefined}
						>
							{#if p.estat === 'fach'}<Icona nom="valide" />{:else if p.estat === 'clavat'}<Icona nom="cadenat" />{/if}
							<span class="sr">{p.oc}{mot ? ` · ${tria(mot)}` : ''}</span>
						</svelte:element>
						{#if p.actual}<span class="aici" lang="oc">{T.siasAici.oc}</span>{/if}
					</div>
				{/if}
				{#if !b.corta}
					<div class="v-tèxt">
						{#if b.pausa}
							<p class="g-nom"><span lang="oc">{insecable(b.pausa.oc)}</span> <span class="glosa" lang="fr">({insecable(glosaCorta(b.pausa.fr))})</span></p>
						{/if}
						{#if b.bloc}
							<h2 class="v-bloc">
								<span class="b-sur" lang="oc">{T.bloc.oc}&nbsp;{b.bloc.n}</span>
								<span lang="oc">{insecable(b.bloc.oc)}</span>
								<span class="glosa" lang="fr">({insecable(b.bloc.fr)})</span>
							</h2>
						{/if}
						{#if b.unitat}
							{@const u = b.unitat}
							<h3 class="u-nom" class:clavat={u.estat === 'clavat'}>
								<b>{String(u.numero).padStart(2, '0')}</b>
								<span lang="oc">{insecable(u.oc)}</span>
								<span class="u-compte">{u.fachs}/{u.moduls.length}</span>
							</h3>
							<p class="glosa u-fr" lang="fr">({insecable(u.fr)})</p>
							{#if indici?.etapa === u}
								{@const a = acabaPer(indici.precedenta, u)}
								<p class="indici"><Icona nom="cadenat" /> <span><span lang="oc">{a.oc}</span> <span class="glosa" lang={lg}>({insecable(glosa(a))})</span></span></p>
							{/if}
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<ol class="rang {b.sens}" class:dubèrt={b.dubèrt} aria-label="{nomEtapa(b.etapa).oc} · {b.etapa.oc}">
				{#each b.etapa.moduls as m, k (m.id)}
					{#if b.dubèrt}
						{@const p = plaçaDubèrta(b.sens, k)}
						{@render cas(m, b.etapa, k, p.col, p.costat, p.rang, true)}
					{:else}
						{@render cas(m, b.etapa, k, b.sens === 'dreit' ? k + 1 : 4 - k, b.sens)}
					{/if}
				{/each}
			</ol>
		{/if}
	{/each}
</div>

<style>
	.plateau {
		/* l'écart entre deux cases ; le chemin passe dedans */
		--g: clamp(0.6rem, 2.6cqi, 1.5rem);
		/* le milieu de la 1re colonne, depuis le bord */
		--mitan: calc((100% - 3 * var(--g)) / 8);
		--camin: color-mix(in srgb, var(--t-tinta) 32%, transparent);
		width: 100%;
		max-width: 52rem;
		margin-inline: auto;
		transition: opacity 0.3s;
	}

	.rang {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		grid-auto-flow: dense;
		gap: var(--g);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Une case : carrée, sa couleur, son numéro en grand */
	.cas {
		position: relative;
		grid-row: 1;
		aspect-ratio: 1;
	}
	.c-ligam {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--esp-8);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		text-decoration: none;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	a.c-ligam:hover {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	a.c-ligam:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.c-num {
		font-family: var(--font-heading);
		font-size: clamp(1.35rem, 5cqi, 2.4rem);
		line-height: 1;
	}
	/* seul, le zéro de Limelight se lit comme un demi-disque (◐) */
	.c-num.zero {
		font-family: var(--font-body);
		font-weight: 700;
	}
	/* le nom : lu par le lecteur d'écran, écrit seulement quand la place le permet */
	.c-nom,
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.c-estat {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		font-size: 1.05rem;
	}
	.mini {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: conic-gradient(currentColor calc(var(--p) * 360deg), color-mix(in srgb, currentColor 28%, transparent) 0);
	}
	/* fait : la couleur s'éteint un peu, le texte garde son contraste (Joan :
	   l'opacité le faisait tomber sous 4,5:1) ; la coche dit le reste */
	.cas.fach .c-ligam {
		filter: saturate(0.65);
	}
	.cas.clavat .c-ligam {
		border: 1px solid color-mix(in srgb, var(--fons) 60%, transparent);
		background: color-mix(in srgb, var(--fons) 24%, var(--t-fons));
		color: var(--t-tinta-2);
	}
	.cas.actual .c-ligam {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* Le chemin entre deux cases d'une rangée, du côté de la case d'avant */
	.cas.dreit::before,
	.cas.esquèr::before {
		content: '';
		position: absolute;
		top: 50%;
		width: var(--g);
		border-top: 2px dashed var(--camin);
	}
	.cas.dreit::before {
		right: 100%;
	}
	.cas.esquèr::before {
		left: 100%;
	}
	.cas.vengut::before {
		border-top: 3px solid var(--t-aur);
		margin-top: -0.5px;
	}
	/* dans l'unité dépliée, le chemin descend de la 2e case à la 3e */
	.cas.amont::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: calc(50% - 1px);
		height: var(--g);
		border-left: 2px dashed var(--camin);
	}
	.cas.amont.vengut::before {
		margin: 0 0 0 -0.5px;
		border-top: 0;
		border-left: 3px solid var(--t-aur);
	}
	/* la première case d'une rangée : le chemin arrive du virage, pas d'à côté */
	.rang > .cas:first-child::before {
		display: none;
	}

	/* L'unité du jour, dépliée : quatre grandes cases, le nom et la glose */
	.rang.dubèrt .cas {
		aspect-ratio: auto;
		min-height: 7.5rem;
	}
	.gran .c-ligam {
		padding: var(--esp-12);
	}
	.gran .c-nom {
		position: static;
		width: auto;
		height: auto;
		overflow: visible;
		clip-path: none;
		white-space: normal;
		margin-top: var(--esp-8);
		font-weight: 700;
		font-size: 1rem;
		line-height: 1.2;
	}
	.c-glosa {
		margin-top: var(--esp-4);
		font-size: 0.8rem;
		line-height: 1.3;
	}
	/* sur une grande case, l'étiquette va dans le coin : au milieu, elle
	   cachait le chemin qui descend de la case d'au-dessus */
	.gran .aici {
		left: auto;
		right: var(--esp-8);
		transform: none;
	}

	/* « Siás aicí » au-dessus de la case du jour ; sur l'or, l'encre du fond
	   (l'encre fixe tombait à 3:1 sur l'ocre du thème clair) */
	.aici {
		position: absolute;
		top: -0.95rem;
		left: 50%;
		z-index: 3;
		transform: translateX(-50%);
		padding: 0.12rem 0.5rem;
		border-radius: 999px;
		background: var(--t-aur);
		color: var(--t-fons);
		font-size: 0.7rem;
		font-weight: 700;
		white-space: nowrap;
		pointer-events: none;
	}

	/* Le virage : le chemin descend dans la colonne du bord, la halte s'y
	   pose comme une gare, le titre de l'unité suivante l'accompagne */
	.virada {
		--gara: 2.6rem;
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		align-items: center;
		gap: var(--esp-8) var(--g);
		/* même marge en haut et en bas : la gare tombe au milieu, là où les
		   deux moitiés du chemin se rejoignent */
		padding: var(--esp-32) 0;
	}
	.virada.corta {
		padding: var(--esp-16) 0;
	}
	.virada::before,
	.virada::after {
		content: '';
		position: absolute;
		left: calc(var(--mitan) - 1px);
		border-left: 2px dashed var(--camin);
	}
	.virada::before {
		top: 0;
		bottom: 50%;
	}
	.virada::after {
		top: 50%;
		bottom: 0;
	}
	.virada.a-drecha::before,
	.virada.a-drecha::after {
		left: auto;
		right: calc(var(--mitan) - 1px);
	}
	.virada.vengut::before,
	.virada.vengut-aval::after {
		border-left: 3px solid var(--t-aur);
	}
	/* La halte et son nom sur la même ligne, le titre de l'unité qui suit en
	   dessous : le rond et « Siás aicí » ne se lisent plus comme ceux de
	   l'unité (relecture de Joan, 2026-11-02). Le chemin change d'allure au
	   centre du rond. */
	.virada.amb-gara {
		align-items: start;
	}
	.amb-gara::before {
		bottom: auto;
		height: calc(var(--esp-32) + var(--gara) / 2);
	}
	.amb-gara::after {
		top: calc(var(--esp-32) + var(--gara) / 2);
	}
	.v-tèxt {
		grid-column: 2 / span 3;
		grid-row: 1;
		min-width: 0;
	}
	.a-drecha .v-tèxt {
		grid-column: 1 / span 3;
	}
	.gara {
		position: relative;
		z-index: 1;
		grid-column: 1;
		grid-row: 1;
		justify-self: center;
	}
	.a-drecha .gara {
		grid-column: 4;
	}
	.g-ligam {
		display: grid;
		place-items: center;
		width: var(--gara);
		height: var(--gara);
		border: 3px solid var(--t-aur);
		border-radius: 50%;
		background: var(--t-fons);
		color: var(--t-aur);
		text-decoration: none;
	}
	.gara.fach .g-ligam {
		background: var(--t-aur);
		color: var(--t-fons);
	}
	.gara.clavat .g-ligam {
		border-color: var(--camin);
		color: var(--t-tinta-2);
	}
	.gara.actual .g-ligam {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	a.g-ligam:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	:where(.v-tèxt, .sola-tèxt) > * {
		margin: 0;
	}
	.glosa {
		color: var(--t-tinta-2);
	}
	/* Limelight seulement pour les gros titres et les gros chiffres, le reste
	   en Luciole (Romain, 2026-11-02 : « assez difficile à lire ») */
	.g-nom {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		align-content: center;
		column-gap: 0.3em;
		min-height: var(--gara);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--t-aur);
	}
	.g-nom .glosa {
		font-weight: 400;
		font-size: 0.82rem;
	}
	.g-nom + .v-bloc,
	.g-nom + .u-nom {
		margin-top: var(--esp-24);
	}
	/* Le titre d'un blòc : on voit que l'A1 en a deux */
	.v-bloc {
		margin-bottom: var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.45rem, 5.4cqi, 2.2rem);
		line-height: 1.1;
		color: var(--t-aur);
	}
	.b-sur {
		display: block;
		margin-bottom: var(--esp-4);
		font-family: var(--font-body);
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.v-bloc .glosa {
		display: block;
		margin-top: var(--esp-4);
		font-family: var(--font-body);
		font-size: 0.85rem;
	}
	.u-nom {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.45rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: clamp(1.15rem, 3.8cqi, 1.5rem);
		line-height: 1.2;
	}
	/* le numéro de l'unité, un gros chiffre : lui reste en Limelight */
	.u-nom b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.35em;
		line-height: 1;
		color: var(--t-aur);
	}
	.u-nom.clavat {
		color: var(--t-tinta-2);
	}
	.u-compte {
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.u-fr {
		margin-top: var(--esp-4);
		font-size: 0.85rem;
	}
	.indici {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-top: var(--esp-8);
		font-size: 0.85rem;
	}
	.indici :global(.icona) {
		flex: none;
		color: var(--t-aur);
	}

	/* Le départ et l'arrivée : une case seule, son nom à côté */
	.sola {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		align-items: center;
		gap: var(--g);
	}
	.sola .rang {
		display: contents;
	}
	.sola-tèxt {
		grid-column: 2 / span 3;
		grid-row: 1;
		min-width: 0;
	}
	.sola.a-drecha .sola-tèxt {
		grid-column: 1 / span 3;
		text-align: right;
	}
	/* texte calé à droite : le cadenas suit la première ligne au lieu de
	   rester seul au bord gauche */
	.sola.a-drecha .indici {
		display: block;
	}
	.sola.a-drecha .indici :global(.icona) {
		margin-right: 0.35rem;
		vertical-align: -0.1em;
	}
	.sur {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.s-nom {
		margin-top: var(--esp-4);
		font-family: var(--font-body);
		font-weight: 700;
		font-size: clamp(1.05rem, 3.6cqi, 1.3rem);
		line-height: 1.2;
	}
	.sola .glosa {
		font-size: 0.85rem;
	}
	.fin .c-num,
	.nivel .c-num {
		font-size: clamp(1.6rem, 6cqi, 2.6rem);
	}
	/* après l'A2, le chemin continue et s'efface : la suite viendra */
	.nivel {
		position: relative;
		margin-bottom: var(--esp-48);
	}
	.nivel::after {
		content: '';
		position: absolute;
		top: 100%;
		left: calc(var(--mitan) - 1px);
		height: var(--esp-48);
		border-left: 2px dashed var(--camin);
		mask-image: linear-gradient(#000, transparent);
	}
	.nivel.a-drecha::after {
		left: auto;
		right: calc(var(--mitan) - 1px);
	}

	/* Assez de place : le nom du module s'écrit dans la case */
	@container parcors (min-width: 640px) {
		.cas {
			aspect-ratio: auto;
			min-height: 9.5rem;
		}
		.c-ligam {
			padding: var(--esp-12);
		}
		.c-nom {
			position: static;
			width: auto;
			height: auto;
			overflow: visible;
			clip-path: none;
			white-space: normal;
			margin-top: var(--esp-8);
			font-weight: 700;
			font-size: 0.92rem;
			line-height: 1.2;
		}
		.gran .c-nom {
			font-size: 1.1rem;
		}
		/* une case seule a déjà son nom écrit à côté */
		.sola .c-nom {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
			margin: 0;
		}
		/* sans son nom, elle s'aplatissait en bandeau : la hauteur des autres */
		.sola .cas {
			align-self: stretch;
		}
		.c-num {
			font-size: 2rem;
		}
		.virada {
			--gara: 3.2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.c-ligam {
			transition: none;
		}
		a.c-ligam:hover {
			transform: none;
		}
	}
</style>
