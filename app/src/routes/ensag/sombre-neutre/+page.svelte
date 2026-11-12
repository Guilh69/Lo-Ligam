<script>
	// Essai du 2026-11-12 (audit C, question de Romain sur le thème sombre) : le sombre « Éclat » (fond brun
	// #22100a, crème, or #f6b73c) contre un sombre sans teinte (noir, gris, blanc ; l'or en touche), comme le
	// clair l'est devenu le 08-11. La page montre les deux côte à côte avec des couleurs écrites en dur (elle
	// ne dépend donc pas du thème choisi) ; les liens ouvrent les vraies pages avec ?sombre=neutre.
	// Réglage : app.css (bloc « ESSAI du 2026-11-12 »), lib/stores/ambianca.svelte.js, app.html.
	// Page de travail, pas indexée. Aucun occitan écrit ici.
	const JETONS = [
		['Fond de page', '--t-fons', '#22100a', '#131313'],
		['Surface (panneaux, cartes)', '--t-fons-2', '#2f170e', '#1e1e1e'],
		['Texte', '--t-tinta', '#fbf1e1', '#f4f4f4'],
		['Or (touche, mots forts)', '--t-aur', '#f6b73c', '#eeaf34'],
		['Or clair', '--t-aur-clar', '#ffd98a', '#ffd47f']
	];
	const A = { fons: '#22100a', surf: '#2f170e', tinta: '#fbf1e1', tinta2: 'rgba(251, 241, 225, 0.78)', linha: 'rgba(251, 241, 225, 0.2)', aur: '#f6b73c' };
	const N = { fons: '#131313', surf: '#1e1e1e', tinta: '#f4f4f4', tinta2: 'rgba(244, 244, 244, 0.76)', linha: 'rgba(244, 244, 244, 0.18)', aur: '#eeaf34' };
	const MAQUETTES = [
		{ nom: 'Actuel : brun chaud « Éclat »', c: A },
		{ nom: 'Essai : neutre', c: N }
	];
	const PAGES = [
		['/', 'Accueil (le fond dessiné passe en gris)'],
		['/apren', 'S’apren : les cases de couleur'],
		['/apren/jocs', 'Jòcs'],
		['/obras/cinema', 'Cinéma : une page de rubrique'],
		['/amassa', 'Amassa'],
		['/carta', 'La carte (les bulles et étiquettes dessinées en JavaScript restent brunes)']
	];
	const style = (c) =>
		`--f:${c.fons};--s:${c.surf};--t:${c.tinta};--t2:${c.tinta2};--l:${c.linha};--a:${c.aur}`;
</script>

<svelte:head>
	<title>Essai : sombre neutre</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="essai">
	<header>
		<p class="rep">Essai du 12 novembre · thème sombre</p>
		<h1>Brun chaud ou neutre</h1>
		<p class="chapo">
			Le sombre actuel est brun (fond #22100a). La consigne du 7 novembre demande noir, gris et blanc, l’or ou l’ocre
			seulement en touche. À gauche l’actuel, à droite l’essai ; les liens plus bas ouvrent les vraies pages en neutre.
		</p>
	</header>

	<section class="maquettes" aria-label="Comparaison">
		{#each MAQUETTES as m (m.nom)}
			<figure style={style(m.c)}>
				<figcaption>{m.nom}</figcaption>
				<div class="mq">
					<p class="mq-nav"><span class="mq-logo">Lo Ligam</span><span>Se parla</span><span class="mq-act">S’apren</span><span>Amassa</span></p>
					<p class="mq-num">02</p>
					<p class="mq-titre">S’apren</p>
					<p class="mq-texte">Un texte courant, sur le fond de page, avec un filet fin dessous.</p>
					<hr />
					<p class="mq-texte mq-sec">Texte secondaire, plus discret, pour les précisions.</p>
					<p class="mq-rang">
						<span class="mq-bouton">Reservar un cors</span>
						<span class="mq-lien">Un lien</span>
					</p>
					<div class="mq-surface">Une surface : panneau, fiche, carte.</div>
				</div>
			</figure>
		{/each}
	</section>

	<section aria-labelledby="t-jetons">
		<h2 id="t-jetons">Les jetons qui changent</h2>
		<table>
			<thead><tr><th>Rôle</th><th>Jeton</th><th>Actuel</th><th>Neutre</th></tr></thead>
			<tbody>
				{#each JETONS as [role, jeton, a, n] (jeton)}
					<tr>
						<td>{role}</td>
						<td><code>{jeton}</code></td>
						<td><span class="pastille" style="background:{a}"></span> {a}</td>
						<td><span class="pastille" style="background:{n}"></span> {n}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p class="note">
			Retirés en neutre : la braise de terracotta et la lueur d’or en haut des pages, le verre teinté de terracotta
			des panneaux de la carte, la carte de leçon teintée. Le rouge des boutons (#9c2626) ne change pas.
		</p>
	</section>

	<section aria-labelledby="t-pages">
		<h2 id="t-pages">Voir les vraies pages en neutre</h2>
		<p class="note">Le choix suit l’onglet de page en page. Il faut que le thème sombre soit choisi (le bouton soleil de la barre du haut).</p>
		<ul class="liens">
			{#each PAGES as [href, nom] (href)}
				<li><a href="{href}?sombre=neutre">{nom}</a></li>
			{/each}
		</ul>
		<p><a class="retour" href="/?sombre=actuel">Revenir au sombre actuel</a></p>
	</section>

	<section aria-labelledby="t-limites">
		<h2 id="t-limites">Ce que l’essai ne couvre pas encore</h2>
		<ul class="limites">
			<li>Le fond de l’accueil, dessiné par le moteur : seulement grisé par un filtre, les étoiles dorées y deviennent grises. Une adoption demanderait de changer ses couleurs dans le nuanceur.</li>
			<li>La carte : les bulles, étiquettes et contours dessinés en JavaScript gardent leurs bruns.</li>
			<li>Une quarantaine de valeurs brunes écrites en dur dans les composants (crème en transparence, fonds de panneaux) : elles se verraient à l’adoption.</li>
		</ul>
	</section>
</main>

<style>
	.essai {
		max-width: 62rem;
		margin: 0 auto;
		padding: clamp(5rem, 9vw, 7rem) var(--esp-24) var(--esp-96);
		color: var(--t-tinta);
	}
	.rep {
		margin: 0 0 var(--esp-8);
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		color: var(--t-tinta-2);
	}
	h1 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 6vw, 4rem);
		line-height: 1.05;
	}
	h2 {
		margin: var(--esp-64) 0 var(--esp-16);
		padding-top: var(--esp-16);
		border-top: 1px solid var(--t-linha);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
	}
	.chapo {
		max-width: 44rem;
		margin: 0;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}
	.note {
		max-width: 44rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}

	.maquettes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--esp-24);
		margin-top: var(--esp-48);
	}
	figure {
		margin: 0;
	}
	figcaption {
		margin-bottom: var(--esp-8);
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		color: var(--t-tinta-2);
	}
	.mq {
		padding: var(--esp-24);
		background: var(--f);
		color: var(--t);
		border: 1px solid var(--t-linha);
	}
	.mq p {
		margin: 0;
	}
	.mq-nav {
		display: flex;
		gap: var(--esp-16);
		align-items: baseline;
		font-size: 0.85rem;
		font-weight: 700;
		padding-bottom: var(--esp-12);
		border-bottom: 1px solid var(--l);
	}
	.mq-logo {
		margin-right: auto;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1rem;
	}
	.mq-act {
		border-bottom: 2px solid var(--a);
	}
	.mq-num {
		margin-top: var(--esp-24);
		font-family: var(--font-heading);
		font-size: 1.6rem;
		color: var(--a);
	}
	.mq-titre {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4.5vw, 3rem);
		line-height: 1.05;
	}
	.mq-texte {
		margin-top: var(--esp-12) !important;
		line-height: 1.55;
		font-size: 0.95rem;
	}
	.mq-sec {
		color: var(--t2);
	}
	.mq hr {
		margin: var(--esp-16) 0 0;
		border: 0;
		border-top: 1px solid var(--l);
	}
	.mq-rang {
		display: flex;
		gap: var(--esp-24);
		align-items: center;
		margin-top: var(--esp-24) !important;
	}
	.mq-bouton {
		padding: 0.55rem 1rem;
		border-radius: 4px;
		background: #9c2626;
		color: #fff;
		font-size: 0.85rem;
		font-weight: 700;
	}
	.mq-lien {
		color: var(--t);
		text-decoration: underline;
		text-decoration-color: #9c2626;
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
		font-size: 0.9rem;
	}
	.mq-surface {
		margin-top: var(--esp-24);
		padding: var(--esp-16);
		background: var(--s);
		font-size: 0.9rem;
		color: var(--t2);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}
	th,
	td {
		padding: var(--esp-12) var(--esp-12) var(--esp-12) 0;
		text-align: left;
		border-bottom: 1px solid var(--t-linha);
		vertical-align: middle;
	}
	th {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--t-tinta-2);
	}
	code {
		font-size: 0.85rem;
	}
	.pastille {
		display: inline-block;
		width: 1.1rem;
		height: 1.1rem;
		margin-right: 0.4rem;
		vertical-align: -0.2rem;
		border: 1px solid var(--t-linha);
	}
	.liens,
	.limites {
		max-width: 44rem;
		padding-left: 1.2rem;
		line-height: 1.7;
	}
	.liens a,
	.retour {
		color: var(--t-tinta);
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}
	.limites {
		color: var(--t-tinta-2);
	}

	@media (max-width: 40rem) {
		.maquettes {
			grid-template-columns: 1fr;
		}
	}
</style>
