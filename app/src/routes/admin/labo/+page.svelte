<script>
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	// Laboratòri : le registre des choix de design (2026-11-07, refait le même jour : Romain
	// trouvait la première version « très mal organisée : on n'apprend pas la hiérarchie des
	// éléments, les choses à faire, les options »). Trois idées :
	//  1. la hiérarchie : trois étages (fondations, composants, écrans) qui se décident du bas
	//     vers le haut, chaque choix disant ce qu'il faut trancher avant lui ;
	//  2. les choses à faire : « À faire maintenant », les choix qui ne sont plus bloqués,
	//     classés par le nombre de choix qu'ils débloquent ;
	//  3. les options : toujours visibles en cartes, jamais cachées dans un menu replié.
	// Données : $lib/labo/registre.js et registre-options.js. Séance 1 : lecture ; séance 2 :
	// inspirations et validation depuis cette page, en base.
	// Les liens « téléphone et tablette » ne s'affichent qu'en développement : l'aperçu est un
	// fichier de static/ retiré au build (le vrai site interdit les cadres).
	import { onMount, tick } from 'svelte';
	import { dev } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { ETAGES, FAMILLES, STATUTS, OUVERTS, TOUS, compter, choix, bloquants, debloque, afaire } from '$lib/labo/registre.js';
	import { ESSAIS, ESSAIS_CACHES, CODE_MORT } from '$lib/labo/registre-essais.js';

	const n = compter();
	const archives = TOUS.filter((c) => c.statut === 'archive');
	const ETAT_ESSAI = { actif: 'Encore utile', adopte: 'Adopté', obsolete: 'Périmé', confirmer: 'À confirmer avec toi' };
	const PRET = { oui: 'Prêt à supprimer', attendre: 'À attendre', non: 'À garder' };
	const nPrets = ESSAIS.filter((e) => e.pret === 'oui').length;
	const nAttendre = ESSAIS.filter((e) => e.pret === 'attendre').length;
	const nGarder = ESSAIS.filter((e) => e.pret === 'non').length;
	const nEcarts = TOUS.filter((c) => c.statut === 'retenu' && c.ecart).length;
	const prochains = afaire();
	const parEtage = ETAGES.map((e) => {
		const k = compter(TOUS.filter((c) => c.etage === e.id));
		return { ...e, ...k, part: Math.round((k.retenu / k.total) * 100), familles: FAMILLES.filter((f) => f.etage === e.id) };
	});

	let selection = $state(null);
	let toutVoir = $state(false);
	let seulementOuverts = $state(false);

	// Quand on quitte le laboratoire (La pila, Triar…) puis qu'on revient avec « Précédent »,
	// la page retrouve tout ce qu'on y avait fait : le choix ouvert, le filtre, « Voir les autres ».
	// Sans cela, seule l'adresse et le défilement revenaient : la liste n'avait plus la même
	// longueur et la page ne ressemblait plus à celle qu'on avait quittée (retour de Romain, 07-11).
	export const snapshot = {
		capture: () => ({ selection, toutVoir, seulementOuverts }),
		restore: (v) => {
			selection = v.selection;
			toutVoir = v.toutVoir;
			seulementOuverts = v.seulementOuverts;
		}
	};

	const courant = $derived(selection ? choix(selection) : null);
	const bloques = $derived(courant ? bloquants(courant) : []);
	const aval = $derived(courant ? debloque(courant.clau) : []);
	const visibles = $derived(toutVoir ? prochains : prochains.slice(0, 5));

	const apercu = (chemin) => `/esbos-apercu.html?page=${encodeURIComponent(chemin)}`;
	const etiquette = (o) => (o.actuelle ? 'Actuel' : o.essai ? 'Essai prêt' : 'Idée à essayer');
	// les archivés ont leur propre section ; « cacher ce qui est retenu » ne laisse que ce qui reste à décider
	const montrer = (c) => c.statut !== 'archive' && (!seulementOuverts || c.statut !== 'retenu');
	const metaLigne = (c) =>
		c.statut === 'retenu' ? (c.ecart ? 'Retenu · écart' : 'Retenu') : c.statut === 'enplace' ? 'En place' : `${c.options.length} option${c.options.length > 1 ? 's' : ''}`;
	const meta = (c, nb) =>
		`Étage ${c.etage} · ${c.options.length} option${c.options.length > 1 ? 's' : ''}${nb > 0 ? ` · débloque ${nb} choix` : ''}`;

	function majAdresse(clau) {
		const u = new URL(location.href);
		u.hash = clau ?? '';
		replaceState(u, {});
	}
	async function ouvrir(clau) {
		selection = clau;
		majAdresse(clau);
		await tick();
		document.querySelector('.mp')?.scrollIntoView({ block: 'start' });
	}
	function fermer() {
		selection = null;
		majAdresse(null);
	}
	function allerA(id) {
		document.getElementById(id)?.scrollIntoView({ block: 'start' });
	}

	onMount(() => {
		const h = decodeURIComponent(location.hash.slice(1));
		if (h && choix(h)) selection = h;
		else if ((document.querySelector('.labo')?.clientWidth ?? 0) >= 62 * 16 && prochains[0]) selection = prochains[0].c.clau;
	});
</script>

<svelte:head>
	<title>Laboratòri — Espaci d'administracion</title>
</svelte:head>

{#snippet ligne(c)}
	{@const bloc = bloquants(c)}
	<li>
		<button
			type="button"
			class="ligne {c.statut}"
			class:actif={selection === c.clau}
			aria-current={selection === c.clau ? 'true' : undefined}
			onclick={() => ouvrir(c.clau)}
		>
			<span class="marque {c.statut}" aria-hidden="true"></span>
			<span class="lcorps">
				<span class="ltitre">{c.titol}</span>
				{#if bloc.length}<span class="lapres">après : {bloc.map((b) => b.titol).join(', ')}</span>{/if}
			</span>
			<span class="lmeta">
				<span class="sr">{STATUTS[c.statut].nom}. </span>{metaLigne(c)}
			</span>
		</button>
	</li>
{/snippet}

<section class="labo" aria-labelledby="labo-titol" lang="fr">
	<AdminTete oc="Laboratòri" fr="le laboratoire de design" id="labo-titol">
		<p class="chapo">
			Un design se décide <strong>du bas vers le haut</strong> : d’abord les fondations (couleurs, polices, formes),
			puis les composants (boutons, champs), puis les écrans. Chaque choix dit ce qu’il faut trancher avant lui et ce
			qu’il débloque. Tu vois les options, tu en retiens une, les autres vont dans « Écartés ».
		</p>

		<ol class="etages" aria-label="Les trois étages">
			{#each parEtage as e (e.id)}
				<li>
					<button type="button" class="etage" onclick={() => allerA('etage-' + e.id)}>
						<span class="enum" aria-hidden="true">{e.id}</span>
						<span class="etitre">{e.titre}</span>
						<span class="eintro">{e.intro}</span>
						<span class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={e.part} aria-label="Choix tranchés, {e.titre}">
							<span style:width="{e.part}%"></span>
						</span>
						<span class="ecompte">{e.retenu} tranchés sur {e.total}</span>
					</button>
				</li>
			{/each}
		</ol>
		<p class="total">
			Au total : <strong>{n.retenu}</strong> tranchés ({nEcarts} pas encore appliqués partout), <strong>{n.enplace}</strong> en place (validés tant que tu ne les signales pas),
			<strong>{n.comparaison}</strong> en comparaison, <strong>{n.explorer}</strong> à explorer
			({n.archive} archivés à part).
			{#if dev}<a class="outil" href="/esbos-apercu.html" data-sveltekit-reload>Voir le site sur téléphone et tablette</a>{/if}
		</p>
	</AdminTete>

	<section class="afaire" aria-labelledby="afaire-titre">
		<h2 class="sec" id="afaire-titre">À faire maintenant</h2>
		<p class="aide">
			Les choix qui ne sont plus bloqués, ceux qui en débloquent le plus d’abord : c’est l’ordre conseillé.
		</p>
		<ol class="taches">
			{#each visibles as { c, debloque: nb }, i (c.clau)}
				<li>
					<button type="button" class="tache" onclick={() => ouvrir(c.clau)}>
						<span class="rang" aria-hidden="true">{i + 1}</span>
						<span class="tcorps">
							<span class="ttitre">{c.titol}</span>
							<span class="tmeta">{meta(c, nb)}</span>
						</span>
					</button>
				</li>
			{/each}
		</ol>
		{#if prochains.length > 5}
			<button type="button" class="plus" onclick={() => (toutVoir = !toutVoir)}>
				{toutVoir ? 'Voir moins' : `Voir les ${prochains.length - 5} autres`}
			</button>
		{/if}
	</section>

	<section class="tous" aria-labelledby="tous-titre">
		<div class="entete">
			<h2 class="sec" id="tous-titre">Tous les choix</h2>
			<label class="coche">
				<input type="checkbox" bind:checked={seulementOuverts} />
				Cacher ce qui est déjà retenu
			</label>
		</div>

		<div class="mp" class:ouvert={selection !== null}>
			<nav class="liste" aria-label="Tous les choix, par étage">
				{#each parEtage as e (e.id)}
					<h3 class="etage-titre" id={'etage-' + e.id}>
						<span class="enum2" aria-hidden="true">{e.id}</span> {e.titre}
						<span class="ecompte2">{e.retenu} / {e.total}</span>
					</h3>
					{#each e.familles as f (f.id)}
						{#if f.choix.some(montrer)}
							<h4>{f.titre}</h4>
							<ul>
								{#each f.choix.filter(montrer) as c (c.clau)}
									{@render ligne(c)}
								{/each}
							</ul>
						{/if}
					{/each}
				{/each}
			</nav>

			<article class="detail" aria-labelledby={courant ? 'd-titre' : undefined}>
				{#if courant}
					<button type="button" class="retour" onclick={fermer}>Retour à la liste</button>
					<p class="fil">Étage {courant.etage} · {ETAGES[courant.etage - 1].titre} · {courant.familleTitre}</p>
					<h3 id="d-titre">{courant.titol}</h3>
					<p><span class="badge {courant.statut}">{STATUTS[courant.statut].nom}</span></p>
					<p class="question">{courant.question}</p>

					{#if bloques.length}
						<div class="bloc">
							<p class="et">À trancher d’abord</p>
							<ul class="chips">
								{#each bloques as b (b.clau)}
									<li><button type="button" class="chip" onclick={() => ouvrir(b.clau)}>{b.titol}</button></li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if aval.length}
						<div class="bloc">
							<p class="et">Une fois tranché, il débloque {aval.length} choix</p>
							<p class="aval">{aval.slice(0, 6).map((x) => x.titol).join(' · ')}{aval.length > 6 ? ' · …' : ''}</p>
						</div>
					{/if}

					{#if courant.archive}
						<div class="bloc bloc-archive">
							<p class="et">Archivé le {courant.archive.date}</p>
							<p>{courant.archive.raison}</p>
						</div>
					{/if}
					{#if courant.aujourdhui}
						<div class="bloc aujourdhui">
							<p class="et">Ce que fait le site aujourd’hui</p>
							<p class="rtexte">{courant.aujourdhui.texte}</p>
							<p class="source">Vérifié dans le code le {courant.aujourdhui.verifie} : {courant.aujourdhui.preuve.join(', ')}</p>
							{#if courant.couleursAujourdhui}
								<ul class="nuancier" aria-label="Couleurs actuelles du site">
									{#each courant.couleursAujourdhui as hex (hex)}
										<li style:background={hex}><span class="sr">{hex}</span></li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}

					{#if courant.retenu}
						<div class="bloc choix-retenu">
							<p class="et">Choix retenu</p>
							<p class="rtexte">{courant.retenu.texte}</p>
							<p class="source">{courant.retenu.source}</p>
							{#if courant.ecart}
								<p class="ecart"><strong>Écart avec le site :</strong> {courant.ecart}</p>
							{/if}
						</div>
						{#if courant.essais?.length}
							<div class="bloc">
								<p class="et">Page d’essai (à retirer du site quand tu le décides)</p>
								<ul class="liens">
									{#each courant.essais as e (e.chemin)}
										<li>
											<a href={e.chemin}>{e.titol}</a>
											{#if dev}<span class="sep" aria-hidden="true">·</span><a class="discret" href={apercu(e.chemin)} data-sveltekit-reload>téléphone et tablette</a>{/if}
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{:else if courant.options.length && courant.statut !== 'archive'}
						<div class="bloc">
							<p class="et">{courant.statut === 'enplace' ? 'Ou changer pour' : 'Les options'} ({courant.options.length})</p>
							<ul class="options">
								{#each courant.options as o, k (k)}
									<li class="option" class:actuelle={o.actuelle}>
										<p class="tag">{etiquette(o)}{#if o.source} · d’après {o.source}{/if}</p>
										<p class="onom">{o.titol}</p>
										<p class="otexte">{o.texte}</p>
										{#if o.couleurs}
											<ul class="nuancier" aria-label="Couleurs de cette option">
												{#each o.couleurs as hex (hex)}
													<li style:background={hex}><span class="sr">{hex}</span></li>
												{/each}
											</ul>
										{/if}
										{#if o.essai}
											<p class="olien">
												<a href={o.essai}>Voir l’essai</a>
												{#if dev}<span class="sep" aria-hidden="true">·</span><a class="discret" href={apercu(o.essai)} data-sveltekit-reload>téléphone et tablette</a>{/if}
											</p>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if courant.inspirations?.length}
						<div class="bloc">
							<p class="et">Tes inspirations</p>
							<ul class="liens">
								{#each courant.inspirations as x, k (k)}
									<li><strong>{x.source}</strong> : {x.note}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if courant.avis}
						<div class="bloc">
							<p class="et">Avis de Claude</p>
							<p class="avis">{courant.avis}</p>
						</div>
					{/if}

					{#if courant.ecartes?.length}
						<details class="archive">
							<summary>Écartés ({courant.ecartes.length})</summary>
							<ul class="liens">
								{#each courant.ecartes as x (x.titol)}
									<li><strong>{x.titol}</strong> : {x.raison}</li>
								{/each}
							</ul>
						</details>
					{/if}

					{#if OUVERTS.includes(courant.statut)}
						<p class="bientot">Bientôt : retenir une option et ranger tes captures directement ici.</p>
					{/if}
				{:else}
					<p class="vide">Choisis un élément dans la liste, ou dans « À faire maintenant ».</p>
				{/if}
			</article>
		</div>
	</section>

	<section class="menage" aria-labelledby="menage-titre">
		<h2 class="sec" id="menage-titre">Ménage : ce qui n’est plus d’actualité</h2>
		<p class="aide">
			On archive d’abord : rien n’est perdu, tout reste dans Git. Ensuite on supprime les pages d’essai dont plus rien ne
			dépend. Dis « supprime » et je retire du code les pages marquées « Prêt à supprimer ».
		</p>

		<h3 class="sous">Pages d’essai ({ESSAIS.length})</h3>
		<p class="resume-essais">
			<strong>{nPrets}</strong> prêtes à supprimer maintenant · <strong>{nAttendre}</strong> à attendre ou à confirmer ·
			<strong>{nGarder}</strong> à garder pour l’instant.
		</p>
		<ul class="essais">
			{#each ESSAIS as e (e.chemin)}
				<li class="essai-ligne {e.etat}">
					<div class="e1">
						<a href={e.chemin}>{e.titre}</a>
						<span class="etiquettes">
							<span class="eetat {e.etat}">{ETAT_ESSAI[e.etat]}</span>
							<span class="epret {e.pret}">{PRET[e.pret]}</span>
						</span>
					</div>
					<p class="eraison">{e.raison}</p>
					{#if e.suppression}<p class="esup"><strong>Suppression :</strong> {e.suppression}</p>{/if}
				</li>
			{/each}
		</ul>

		<h3 class="sous">Choix archivés ({archives.length})</h3>
		{#if archives.length}
			<ul class="arch">
				{#each archives as c (c.clau)}
					<li>
						<button type="button" class="arch-ligne" onclick={() => ouvrir(c.clau)}>
							<span class="marque archive" aria-hidden="true"></span>
							<span class="lcorps">
								<span class="ltitre">{c.titol}</span>
								<span class="lapres">{c.archive.raison}</span>
							</span>
							<span class="lmeta">{c.archive.date}</span>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="vide">Aucun choix archivé pour le moment.</p>
		{/if}

		<h3 class="sous">Essais cachés hors du dossier /ensag ({ESSAIS_CACHES.length})</h3>
		<p class="resume-essais">Trouvés par l’audit du 07-11, jamais recensés : à vérifier avec toi.</p>
		<ul class="liens">
			{#each ESSAIS_CACHES as e (e.chemin)}
				<li><code>{e.chemin}</code> : {e.quoi}</li>
			{/each}
		</ul>

		<h3 class="sous">Code mort repéré ({CODE_MORT.length})</h3>
		<p class="resume-essais">Jamais utilisé : à supprimer avec ton accord.</p>
		<ul class="liens">
			{#each CODE_MORT as m (m)}
				<li>{m}</li>
			{/each}
		</ul>
	</section>
</section>

<style>
	.labo {
		width: 100%;
		margin: 0 auto;
		padding-bottom: 4rem;
		font-family: var(--font-body);
		color: var(--t-tinta, #2a1a10);
		container-type: inline-size;
	}
	/* Limelight est réservée aux gros titres : les titres de section en Luciole */
	.labo .sec {
		margin: 0;
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-weight: 700;
	}
	.chapo {
		max-width: 46rem;
		margin: 0.8rem 0 1.2rem;
		line-height: 1.6;
	}
	button {
		font: inherit;
		color: inherit;
	}
	button:focus-visible,
	summary:focus-visible,
	a:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--t-aur, #9c5611);
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

	/* ---- les trois étages ---- */
	.etages {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}
	.etage {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-areas: 'num titre' 'num intro' 'barre barre' 'compte compte';
		column-gap: 0.9rem;
		row-gap: 0.15rem;
		width: 100%;
		padding: 0.9rem 1rem;
		text-align: left;
		cursor: pointer;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.25));
		border-radius: 10px;
		background: color-mix(in srgb, #fff 55%, transparent);
	}
	.etage:hover {
		border-color: var(--t-tinta, #2a1a10);
	}
	.enum {
		grid-area: num;
		align-self: center;
		font-family: var(--font-heading);
		font-size: 2.4rem;
		line-height: 1;
		color: var(--t-aur, #9c5611);
	}
	.etitre {
		grid-area: titre;
		font-weight: 700;
		font-size: 1.1rem;
	}
	.eintro {
		grid-area: intro;
		font-size: 0.85rem;
		line-height: 1.4;
		opacity: 0.8;
	}
	.barra {
		grid-area: barre;
		margin-top: 0.6rem;
		height: 0.4rem;
		border-radius: 999px;
		background: var(--t-linha, rgba(42, 26, 16, 0.14));
		overflow: hidden;
	}
	.barra span {
		display: block;
		height: 100%;
		background: var(--t-aur, #9c5611);
	}
	.ecompte {
		grid-area: compte;
		margin-top: 0.25rem;
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.8;
	}
	.total {
		margin: 0.9rem 0 0;
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.outil,
	.detail a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-accion, #b53d17);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
	}
	.outil {
		margin-left: 0.8rem;
	}

	/* ---- à faire maintenant ---- */
	.afaire {
		margin-top: 2.4rem;
	}
	.aide {
		margin: 0.2rem 0 0.8rem;
		font-size: 0.9rem;
		opacity: 0.8;
	}
	.taches {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.taches > li {
		border-top: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.tache {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		min-height: 44px;
		padding: 0.8rem 0;
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.rang {
		flex: none;
		width: 1.8rem;
		font-family: var(--font-heading);
		font-size: 1.6rem;
		line-height: 1;
		text-align: center;
		color: var(--t-aur, #9c5611);
	}
	.tcorps {
		display: grid;
		gap: 0.1rem;
	}
	.ttitre {
		font-weight: 700;
		text-decoration: underline;
		text-decoration-color: var(--t-accion, #b53d17);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
		width: fit-content;
	}
	.tmeta {
		font-size: 0.85rem;
		opacity: 0.8;
	}
	.plus {
		margin-top: 0.6rem;
		min-height: 44px;
		padding: 0 1rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		background: transparent;
		cursor: pointer;
	}

	/* ---- la liste et le détail ---- */
	.tous {
		margin-top: 2.6rem;
	}
	.entete {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem 1.5rem;
		margin-bottom: 1rem;
	}
	.labo .coche {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		min-height: 44px;
		margin: 0;
		font-size: 0.9rem;
		font-weight: 400;
		cursor: pointer;
	}
	.coche input {
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--t-aur, #9c5611);
	}
	.mp {
		display: grid;
		gap: 1.5rem;
	}
	/* téléphone : la liste, puis le détail à la place de la liste quand on en ouvre un */
	.mp.ouvert .liste {
		display: none;
	}
	.mp:not(.ouvert) .detail {
		display: none;
	}
	.etage-titre {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 2rem 0 0;
		padding-top: 0.8rem;
		border-top: 2px solid var(--t-tinta, #2a1a10);
		font-family: var(--font-body);
		font-size: 1.15rem;
		font-weight: 700;
	}
	.etage-titre:first-child {
		margin-top: 0;
	}
	.enum2 {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		color: var(--t-aur, #9c5611);
	}
	.ecompte2 {
		margin-left: auto;
		font-size: 0.8rem;
		font-weight: 400;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
	}
	.liste h4 {
		margin: 1.2rem 0 0.3rem;
		font-family: var(--font-body);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.75;
	}
	.liste ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.liste li {
		border-top: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.ligne {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.4rem;
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.ligne:hover {
		background: color-mix(in srgb, var(--t-tinta, #2a1a10) 5%, transparent);
	}
	.ligne.actif {
		background: color-mix(in srgb, var(--t-aur, #9c5611) 14%, transparent);
	}
	.ligne.actif .ltitre {
		font-weight: 700;
	}
	.ligne.retenu .ltitre {
		opacity: 0.65;
	}
	/* trois états, trois formes (jamais la couleur seule) : plein, demi, pointillé */
	.marque {
		flex: none;
		width: 0.85rem;
		height: 0.85rem;
		margin-top: 0.3rem;
		border-radius: 50%;
		border: 2px solid var(--t-aur, #9c5611);
	}
	.marque.retenu {
		background: var(--t-aur, #9c5611);
	}
	.marque.comparaison {
		background: linear-gradient(90deg, var(--t-aur, #9c5611) 50%, transparent 50%);
	}
	.marque.explorer {
		border-style: dashed;
	}
	.marque.enplace {
		background: radial-gradient(circle, var(--t-aur, #9c5611) 30%, transparent 34%);
	}
	.marque.archive {
		border-color: currentColor;
		opacity: 0.45;
		background: linear-gradient(135deg, transparent 44%, currentColor 44% 56%, transparent 56%);
	}
	.lcorps {
		flex: 1;
		display: grid;
		gap: 0.1rem;
	}
	.ltitre {
		line-height: 1.35;
	}
	.lapres {
		font-size: 0.78rem;
		font-style: italic;
		opacity: 0.65;
	}
	.lmeta {
		flex: none;
		font-size: 0.78rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.75;
		white-space: nowrap;
	}

	.detail {
		min-width: 0;
	}
	.retour {
		min-height: 44px;
		margin-bottom: 0.4rem;
		padding: 0 1rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		background: transparent;
		cursor: pointer;
	}
	.fil {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		opacity: 0.75;
	}
	.detail h3 {
		margin: 0.3rem 0 0.5rem;
		font-family: var(--font-body);
		font-size: 1.5rem;
		line-height: 1.25;
	}
	.detail p {
		margin: 0;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		font-size: 0.85rem;
	}
	.badge.retenu {
		background: var(--t-aur, #9c5611);
		border-color: var(--t-aur, #9c5611);
		color: #fff8ec;
		font-weight: 700;
	}
	.badge.comparaison {
		border: 2px solid currentColor;
		font-weight: 700;
	}
	.badge.explorer {
		border-style: dashed;
	}
	.badge.enplace {
		border: 2px double currentColor;
		font-weight: 700;
	}
	.badge.archive {
		opacity: 0.7;
		text-decoration: line-through;
	}
	.bloc-archive,
	.aujourdhui {
		padding: 0.8rem 1rem;
		border: 1px dashed var(--t-tinta, #2a1a10);
		border-radius: 10px;
	}

	/* ---- ménage : pages d'essai et archives ---- */
	.menage {
		margin-top: 3rem;
	}
	.labo .sous {
		margin: 1.6rem 0 0.4rem;
		font-family: var(--font-body);
		font-size: 1.05rem;
		font-weight: 700;
	}
	.resume-essais {
		margin: 0 0 0.6rem;
		font-size: 0.9rem;
		opacity: 0.8;
	}
	.essais,
	.arch {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.essai-ligne,
	.arch > li {
		border-top: 1px solid var(--t-linha, rgba(42, 26, 16, 0.2));
	}
	.essai-ligne {
		padding: 0.8rem 0.2rem;
	}
	.essai-ligne.adopte,
	.essai-ligne.obsolete {
		opacity: 0.85;
	}
	.e1 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.2rem 0.8rem;
	}
	.e1 a {
		font-weight: 700;
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-accion, #b53d17);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
	}
	.eetat {
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.etiquettes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.eetat.actif {
		border-style: dashed;
	}
	.eetat.confirmer {
		border-style: dotted;
		border-width: 2px;
	}
	.epret {
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.epret.oui {
		background: var(--t-aur, #9c5611);
		border-color: var(--t-aur, #9c5611);
		color: #fff8ec;
		font-weight: 700;
	}
	.epret.attendre {
		border: 2px solid currentColor;
		font-weight: 700;
	}
	.ecart {
		margin-top: 0.8rem !important;
		padding-top: 0.6rem;
		border-top: 1px dashed var(--t-linha, rgba(42, 26, 16, 0.4));
		font-size: 0.92rem;
		line-height: 1.5;
	}
	.labo code {
		font-size: 0.9em;
	}
	.eetat.obsolete {
		border: 2px solid currentColor;
		font-weight: 700;
	}
	.eraison,
	.esup {
		margin: 0.3rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.esup {
		opacity: 0.8;
	}
	.arch-ligne {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.4rem;
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.question {
		margin-top: 0.8rem !important;
		line-height: 1.6;
	}
	.bloc {
		margin-top: 1.2rem;
	}
	.et {
		margin-bottom: 0.3rem !important;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--t-aur, #9c5611);
	}
	.chips {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.chip {
		min-height: 44px;
		padding: 0 0.9rem;
		border-radius: 999px;
		border: 2px solid currentColor;
		background: transparent;
		font-weight: 700;
		cursor: pointer;
	}
	.aval {
		line-height: 1.55;
		font-size: 0.95rem;
	}
	.choix-retenu {
		padding: 0.8rem 1rem;
		border: 1px solid var(--t-aur, #9c5611);
		border-radius: 10px;
	}
	.rtexte {
		line-height: 1.55;
	}
	.source {
		margin-top: 0.3rem !important;
		font-size: 0.82rem;
		opacity: 0.7;
	}
	.options {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.7rem;
	}
	.option {
		padding: 0.9rem 1rem;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
		border-radius: 10px;
		background: color-mix(in srgb, #fff 55%, transparent);
	}
	.option.actuelle {
		border: 2px solid var(--t-tinta, #2a1a10);
	}
	.tag {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.75;
	}
	.onom {
		margin-top: 0.2rem !important;
		font-weight: 700;
		font-size: 1.05rem;
	}
	.otexte {
		margin-top: 0.3rem !important;
		line-height: 1.55;
		font-size: 0.95rem;
	}
	.nuancier {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		display: flex;
		gap: 0.3rem;
	}
	.nuancier li {
		width: 2rem;
		height: 2rem;
		border-radius: 6px;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.3));
	}
	.olien {
		margin-top: 0.6rem !important;
		font-size: 0.9rem;
	}
	.detail a.discret {
		text-decoration-color: var(--t-linha, rgba(42, 26, 16, 0.3));
		text-decoration-thickness: 1px;
		font-size: 0.9em;
	}
	.sep {
		margin: 0 0.35rem;
		opacity: 0.5;
	}
	.liens {
		margin: 0;
		padding-left: 1.1rem;
		line-height: 1.55;
	}
	.liens li {
		margin-top: 0.3rem;
	}
	.avis {
		line-height: 1.55;
		font-size: 0.95rem;
	}
	.archive {
		margin-top: 1.2rem;
		font-size: 0.9rem;
	}
	.archive summary {
		display: inline-block;
		padding: 0.4rem 0;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: var(--t-linha, rgba(42, 26, 16, 0.3));
	}
	.bientot {
		margin-top: 1.4rem !important;
		font-size: 0.85rem;
		font-style: italic;
		opacity: 0.65;
	}
	.vide {
		padding: 2rem 0;
		font-style: italic;
		opacity: 0.7;
	}

	/* ---- grand écran : trois étages côte à côte, liste à gauche et détail à droite ---- */
	@container (min-width: 40rem) {
		.etages {
			grid-template-columns: repeat(3, 1fr);
		}
		.etage {
			height: 100%;
		}
		.options {
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		}
	}
	@container (min-width: 62rem) {
		.mp {
			grid-template-columns: minmax(20rem, 26rem) 1fr;
			gap: 2.5rem;
			align-items: start;
		}
		.mp.ouvert .liste,
		.mp:not(.ouvert) .detail {
			display: block;
		}
		.retour {
			display: none;
		}
		.detail {
			position: sticky;
			top: 0.75rem;
			max-height: calc(100vh - 1.5rem);
			overflow-y: auto;
			padding-right: 0.5rem;
		}
	}
</style>
