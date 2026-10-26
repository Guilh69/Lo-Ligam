<script>
	// Page de la littérature (2026-10-25, Romain : même méthode que les
	// médias, dans les verts d'Òbras). Trois présentations comparées
	// (bibliothèque, fichier, cases) ; Romain a choisi la bibliothèque : un dos
	// de livre par entrée sur une étagère, la fiche du livre survolé à droite ;
	// au téléphone, les livres couchés en pile. Deux groupes : les éditeurs,
	// puis où trouver les livres. Chaque entrée mène à son site. Données dans
	// $lib/data/arts.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { LIBRES } from '$lib/data/arts.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	const t = {
		oc: {
			titol: 'Literatura',
			frasa: 'Los editors en occitan, e ont trobar los libres.',
			editors: 'Los editors',
			trobar: 'Ont trobar los libres',
			veire: 'Veire'
		},
		fr: {
			titol: 'Littérature',
			frasa: 'Les éditeurs en occitan, et où trouver les livres.',
			editors: 'Les éditeurs',
			trobar: 'Où trouver les livres',
			veire: 'Voir'
		},
		es: {
			titol: 'Literatura',
			frasa: 'Las editoriales en occitano, y dónde encontrar los libros.',
			editors: 'Las editoriales',
			trobar: 'Dónde encontrar los libros',
			veire: 'Ver'
		},
		en: {
			titol: 'Literature',
			frasa: 'Publishers in Occitan, and where to find the books.',
			editors: 'Publishers',
			trobar: 'Where to find the books',
			veire: 'Visit'
		},
		ca: {
			titol: 'Literatura',
			frasa: 'Les editorials en occità, i on trobar els llibres.',
			editors: 'Les editorials',
			trobar: 'On trobar els llibres',
			veire: 'Veure'
		},
		ar: {
			titol: 'الأدب',
			frasa: 'دور النشر بالأوكسيتانية، وأين يمكن العثور على الكتب.',
			editors: 'دور النشر',
			trobar: 'أين يمكن العثور على الكتب',
			veire: 'زيارة'
		}
	};
	let tx = $derived(t[langStore.current] ?? t.oc);

	const VERD = PALETAS.verd;
	const color = (i) => VERD[i % VERD.length];
	const GROPS = $derived([
		{ id: 'editor', nom: tx.editors, lista: LIBRES.filter((l) => l.grop === 'editor') },
		{ id: 'trobar', nom: tx.trobar, lista: LIBRES.filter((l) => l.grop === 'trobar') }
	]);
	// les dos de livres : hauteur et largeur un peu différentes d'un livre à l'autre
	const DOS = [
		[92, 4.6], [80, 3.8], [100, 4.2], [86, 5], [96, 4], [84, 4.4]
	];
	// la bibliothèque : le livre survolé (ou touché au clavier) se présente à droite
	let causit = $state(0);
	const libre = $derived(LIBRES[causit]);
</script>

<svelte:head>
	<title>{tx.titol} · Lo Ligam</title>
</svelte:head>

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="literatura">
	<nav class="camin" aria-label={tria({ oc: 'Camin', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' })}>
		<a href="/parla">{tria({ oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث' })}</a><span aria-hidden="true">›</span>
		<a href="/obras">{tria({ oc: 'Òbras', fr: 'Œuvres', es: 'Obras', en: 'Works', ca: 'Obres', ar: 'أعمال إبداعية' })}</a><span aria-hidden="true">›</span>
		<span aria-current="page">{tx.titol}</span>
	</nav>

	<header class="cap">
		<h1 lang={langStore.current}>{tx.titol}</h1>
		<p class="frasa" lang={langStore.current}>{tx.frasa}</p>
	</header>

	<!-- la bibliothèque : un dos de livre par entrée, la fiche du livre tiré à droite -->
	<div class="bibloteca">
		<div class="laissas">
			{#each GROPS as g (g.id)}
				<div class="laissa-grop">
					<ul class="laissa" aria-label={g.nom}>
						{#each g.lista as l (l.id)}
							{@const k = LIBRES.indexOf(l)}
							{@const [fons, tinta] = color(k)}
							{@const [naut, larg] = DOS[k % DOS.length]}
							<li class="libre" class:tirat={causit === k} style:--fons={fons} style:--tinta={tinta} style:--naut="{naut}%" style:--larg="{larg}rem" style:--i={k}>
								<a href={l.site} target="_blank" rel="noopener noreferrer" class="dos" onmouseenter={() => (causit = k)} onfocus={() => (causit = k)}>
									<span class="dos-nom" lang="oc">{l.nom}</span>
								</a>
							</li>
						{/each}
					</ul>
					<p class="laissa-nom" lang={langStore.current}>{g.nom}</p>
				</div>
			{/each}
		</div>
		<div class="pagina-libre" aria-live="polite">
			{#key causit}
				<div class="pl-contengut">
					<span class="pl-sorta" lang={langStore.current}>{tria(libre.sorta)}{#if libre.an} · {libre.an}{/if}</span>
					<strong class="pl-nom" lang="oc">{libre.nom}</strong>
					<p class="pl-tèxt" lang={langStore.current}>{tria(libre.tèxt)}</p>
					<a class="pl-veire" href={libre.site} target="_blank" rel="noopener noreferrer">{tx.veire} <Icona nom="extern" size="1em" /></a>
				</div>
			{/key}
		</div>
	</div>
</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, #55702f 14%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.literatura {
		container: literatura / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vh, 3rem) var(--marge) var(--esp-96);
	}
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--esp-24);
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camin a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.cap {
		margin: 0 0 var(--esp-32, 2rem);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
	}
	.frasa {
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		color: var(--t-tinta-2);
	}

	.bibloteca {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
		align-items: end;
		gap: var(--esp-32, 2rem);
	}
	.laissas {
		display: flex;
		align-items: flex-end;
		padding: 0 var(--esp-24);
		/* l'étagère : une planche verte sous tous les livres */
		border-bottom: 1rem solid #353c1a;
		box-shadow: 0 14px 20px -12px rgba(0, 0, 0, 0.7);
	}
	.laissa-grop {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	/* le serre-livres entre les deux groupes */
	.laissa-grop + .laissa-grop {
		margin-left: var(--esp-32, 2rem);
		padding-left: var(--esp-32, 2rem);
		border-left: 0.6rem solid #425223;
	}
	.laissa {
		display: flex;
		align-items: flex-end;
		gap: 0.3rem;
		height: 24rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.laissa-nom {
		position: absolute;
		top: calc(100% + 1.5rem);
		left: 0;
		margin: 0;
		color: #b0b791;
		font-size: 0.9rem;
		font-weight: 700;
		white-space: nowrap;
	}
	.laissa-grop + .laissa-grop .laissa-nom {
		left: calc(var(--esp-32, 2rem) + 0.6rem);
	}
	.libre {
		position: relative;
		height: var(--naut);
	}
	.dos {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--larg);
		height: 100%;
		padding: 1rem 0;
		border-radius: 3px 3px 0 0;
		/* le dos : deux filets en haut et en bas, comme une reliure */
		background:
			linear-gradient(var(--tinta), var(--tinta)) center 1.4rem / 70% 2px no-repeat,
			linear-gradient(var(--tinta), var(--tinta)) center calc(100% - 1.4rem) / 70% 2px no-repeat,
			linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 25%, transparent 75%, rgba(0, 0, 0, 0.22)),
			var(--fons);
		color: var(--tinta);
		text-decoration: none;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.dos-nom {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 1.8vw, 1.6rem);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
	}
	/* le livre tiré dépasse des autres */
	.libre.tirat .dos,
	.dos:focus-visible {
		transform: translateY(-1.6rem);
		outline: none;
	}
	.dos:focus-visible {
		box-shadow: 0 0 0 3px #b0b791;
	}
	/* la fiche du livre tiré, comme une page ouverte */
	.pagina-libre {
		align-self: stretch;
		display: flex;
		margin-bottom: 1rem;
		border-radius: 6px;
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.12), transparent 6%),
			#f3efdc;
		color: #2a1a10;
		box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.8);
	}
	.pl-contengut {
		display: flex;
		flex-direction: column;
		gap: var(--esp-12);
		width: 100%;
		padding: var(--esp-32, 2rem);
		animation: virar 0.35s ease-out;
	}
	@keyframes virar {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
	}
	.pl-sorta {
		color: #425223;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.pl-nom {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		line-height: 1.05;
	}
	.pl-tèxt {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.pl-veire {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 0.4rem;
		margin-top: auto;
		padding: 0.6rem 1.3rem;
		border-radius: 999px;
		background: #b53d17;
		color: #fbf1e1;
		font-weight: 700;
		text-decoration: none;
	}
	.pl-veire:hover {
		background: #c9471d;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	/* téléphone : les livres couchés en pile */
	@container literatura (max-width: 640px) {
		.bibloteca {
			grid-template-columns: 1fr;
		}
		.laissas {
			flex-direction: column;
			align-items: stretch;
			padding: 0;
			border-bottom: 0;
			box-shadow: none;
		}
		.laissa-grop + .laissa-grop {
			margin: var(--esp-24) 0 0;
			padding: 0;
			border-left: 0;
		}
		.laissa-nom,
		.laissa-grop + .laissa-grop .laissa-nom {
			position: static;
			order: -1;
			margin-bottom: var(--esp-8);
		}
		/* les livres couchés en pile, sur une planche */
		.laissa {
			flex-direction: column-reverse;
			align-items: stretch;
			gap: 0.3rem;
			height: auto;
			border-bottom: 0.7rem solid #353c1a;
		}
		.libre {
			height: auto;
			width: var(--naut);
			margin-left: calc((100% - var(--naut)) / 2);
		}
		.dos {
			width: 100%;
			height: auto;
			min-height: 3.2rem;
			padding: 0.5rem 1rem;
			border-radius: 3px;
			background:
				linear-gradient(var(--tinta), var(--tinta)) 1rem center / 2px 60% no-repeat,
				linear-gradient(var(--tinta), var(--tinta)) calc(100% - 1rem) center / 2px 60% no-repeat,
				linear-gradient(rgba(0, 0, 0, 0.15), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2)),
				var(--fons);
		}
		.dos-nom {
			writing-mode: horizontal-tb;
			transform: none;
		}
		.libre.tirat .dos,
		.dos:focus-visible {
			transform: translateX(0.6rem);
		}
		/* au téléphone, toucher un livre ouvre son site : pas de fiche à côté */
		.pagina-libre {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dos,
		.pl-contengut {
			animation: none;
			transition: none;
		}
	}
	:global(html[data-leugier='on']) .dos,
	:global(html[data-leugier='on']) .pl-contengut {
		animation: none;
	}
</style>
