<script>
	// Essai (Romain, 2026-11-06) : signaler sans bruit une illustration faite par
	// IA, et faire de cette mention la porte d'une cagnotte pour engager un
	// illustrateur ou une illustratrice. Trois façons, sur de vrais dessins du
	// site : les affiches de la salle de jeux et les dessins de Remira.
	// Page de travail, non indexée. Fiche : revisions/2026-11-06-illustrations-ia-cagnotte.md
	// Occitan passé à lo Congrès le 06-11 (illustracion, facha, fach, aquesta, pagina,
	// intelligéncia, artificiala) ; à relire par Romain avant usage sur le site.
	import { SCENAS } from '$lib/plueja/scenas.js';
	import { cheminsDe, TINTAS } from '$lib/plueja/dessenhs.js';
	import Afica from '$lib/jocs/sala/Afica.svelte';

	// les mots de Remira qui ont un dessin au trait (sans les drapeaux), une fois chacun
	const parMot = new Map();
	for (const s of SCENAS) {
		for (const [oc, def] of s.mots) {
			const chemins = cheminsDe(oc, def);
			if (chemins && !TINTAS[oc] && !parMot.has(oc)) parMot.set(oc, { oc, chemins });
		}
	}
	const dessenhs = [...parMot.values()];
	const seul = parMot.get('lo can') ?? dessenhs[0];
	// six dessins pris à intervalles réguliers, pour montrer des leçons différentes
	const pas = Math.max(1, Math.floor(dessenhs.length / 6));
	const planca = Array.from({ length: 6 }, (_, k) => dessenhs[k * pas]).filter(Boolean);

	const DESTI = '#cagnotte';
</script>

<svelte:head>
	<title>Mention IA · essai · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="ia-essai">
	<header class="cap">
		<h1>Mention IA</h1>
		<p>
			Trois façons de signaler, sans bruit, une illustration faite par IA. Chaque mention est un lien : elle
			mènera à la page de la cagnotte pour engager un illustrateur ou une illustratrice. Ici, elle descend en bas
			de la page.
		</p>
		<p class="nota">
			Page d’essai, non indexée. Sur le site, le texte suivra la langue choisie ; il est montré ici en occitan,
			avec le français à côté.
		</p>
	</header>

	<section class="varianta" aria-labelledby="v1">
		<h2 id="v1"><span class="num">1</span> La légende</h2>
		<p>Une ligne sous l’illustration, comme la légende d’une photo.</p>
		<p class="fr">En français : « Illustration faite par IA → »</p>
		<div class="duo">
			<figure>
				<div class="quadre"><Afica id="garona" tema="joios" /></div>
				<figcaption>
					<a class="ia" href={DESTI} lang="oc">Illustracion facha per l’IA <span aria-hidden="true">→</span></a>
				</figcaption>
			</figure>
			<figure>
				<div class="quadre tela">
					<svg class="dessenh" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
						{#each seul.chemins as d, k (k)}<path {d} />{/each}
					</svg>
				</div>
				<figcaption>
					<a class="ia" href={DESTI} lang="oc">Illustracion facha per l’IA <span aria-hidden="true">→</span></a>
				</figcaption>
			</figure>
		</div>
	</section>

	<section class="varianta" aria-labelledby="v2">
		<h2 id="v2"><span class="num">2</span> La signature</h2>
		<p>Dans le bas du cadre, à droite, comme un peintre signe sa toile. Le dessin reste intact.</p>
		<p class="fr">En français : « faite par IA »</p>
		<div class="duo">
			<figure>
				<div class="quadre signat">
					<Afica id="mar" tema="joios" />
					<a class="signatura" href={DESTI} lang="oc">facha per l’IA</a>
				</div>
			</figure>
			<figure>
				<div class="quadre tela signat">
					<svg class="dessenh" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
						{#each seul.chemins as d, k (k)}<path {d} />{/each}
					</svg>
					<a class="signatura" href={DESTI} lang="oc">facha per l’IA</a>
				</div>
			</figure>
		</div>
	</section>

	<section class="varianta" aria-labelledby="v3">
		<h2 id="v3"><span class="num">3</span> Une ligne par page</h2>
		<p>Là où les dessins sont nombreux (Remira, la salle de jeux), une seule ligne pour toute la page.</p>
		<p class="fr">En français : « Les illustrations de cette page sont faites par IA → »</p>
		<div class="planca">
			<ul class="grilha">
				{#each planca as m (m.oc)}
					<li class="tela">
						<svg class="dessenh" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
							{#each m.chemins as d, k (k)}<path {d} />{/each}
						</svg>
						<span lang="oc">{m.oc}</span>
					</li>
				{/each}
			</ul>
			<p class="linha-ia">
				<a class="ia" href={DESTI} lang="oc">L’IA a fach las illustracions d’aquesta pagina <span aria-hidden="true">→</span></a>
			</p>
		</div>
	</section>

	<section id="cagnotte" class="desti" aria-labelledby="desti-titol">
		<h2 id="desti-titol">Où mène la mention</h2>
		<p>
			À une page courte, qui dit : ce qui est fait par IA sur le site, et pourquoi (pas de budget au départ) ; la
			cagnotte et son objectif, fixé après un devis, avec ce qui se passe s’il est dépassé ou pas atteint ; le
			montant reçu, que tu mets à jour avec « Editar » ; les justificatifs, le devis puis la facture.
		</p>
		<p>
			Le bouton pour donner ouvrira la page sécurisée du service de paiement : aucune carte bancaire ne passe par
			le site.
		</p>
		<p>On peut aussi mêler les façons : la signature sur une illustration seule, une ligne là où il y en a beaucoup.</p>
	</section>
</main>

<style>
	.ia-essai {
		container-type: inline-size;
		max-width: 68rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) 16px 4rem;
		font-family: var(--font-body);
		color: var(--t-tinta);
	}
	h1 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 6cqi, 3.2rem);
		line-height: 1.1;
	}
	.cap p {
		max-width: 44rem;
		line-height: 1.55;
	}
	.nota,
	.fr {
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	.varianta,
	.desti {
		margin-top: 2.6rem;
		padding-top: 1.6rem;
		border-top: 1px solid var(--t-linha);
	}
	h2 {
		margin: 0 0 0.4rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
	.num {
		display: inline-block;
		min-width: 1.4em;
		color: var(--t-aur);
	}
	.varianta > p,
	.desti p {
		margin: 0.25rem 0;
		max-width: 44rem;
		line-height: 1.55;
	}

	/* deux illustrations côte à côte, l'une sous l'autre sur un écran étroit */
	.duo {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.6rem;
		margin-top: 1.2rem;
	}
	@container (min-width: 40rem) {
		.duo {
			grid-template-columns: 4fr 3fr;
			align-items: start;
		}
	}
	figure {
		margin: 0;
	}

	/* le cadre de la salle de jeux */
	.quadre {
		position: relative;
		padding: 0.5rem;
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
	}
	.tela {
		display: grid;
		place-items: center;
	}
	.dessenh {
		width: 100%;
		max-width: 15rem;
		aspect-ratio: 1;
		fill: none;
		stroke: var(--t-aur-clar);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* 1 et 3 : la mention, petite, lisible, soulignée du rouge du logo (ce qui se clique) */
	.ia {
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--t-tinta-2);
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}
	.ia:hover,
	.ia:focus-visible {
		color: var(--t-tinta);
		text-decoration-thickness: 2px;
	}
	figcaption {
		margin-top: 0.45rem;
	}

	/* 2 : la signature, dans la marge basse du cadre */
	.signat {
		padding-bottom: 1.9rem;
	}
	.signatura {
		position: absolute;
		right: 0.7rem;
		bottom: 0.3rem;
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1rem;
		line-height: 1.3;
		color: var(--t-tinta-2);
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}
	.signatura:hover,
	.signatura:focus-visible {
		color: var(--t-tinta);
	}

	/* 3 : une planche de dessins, une seule ligne en bas */
	.planca {
		margin-top: 1.2rem;
	}
	.grilha {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.8rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	@container (min-width: 40rem) {
		.grilha {
			grid-template-columns: repeat(6, 1fr);
		}
	}
	.grilha li {
		gap: 0.3rem;
		padding: 0.7rem 0.4rem 0.6rem;
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
		font-size: 0.85rem;
		text-align: center;
	}
	.grilha .dessenh {
		max-width: 6rem;
	}
	.linha-ia {
		margin: 0.8rem 0 0;
		text-align: right;
	}
</style>
