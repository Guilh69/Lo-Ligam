<script>
	// Essai du 06-11 au soir, repris : le papier découpé des illustrations de
	// jeux appliqué à tous les boutons (demande de Romain : « que ce soit
	// vraiment la marque de fabrique du site »). Première version : bords
	// irréguliers, écartée (« un faux découpage raté »). Cette reprise vise la
	// même netteté que les illustrations : pièces pleines, bords nets, ombre
	// courte. Le style est dans papier.css (CSS seul, aucune image).
	import { page } from '$app/state';
	import Icona from '$lib/components/Icona.svelte';
	import Illustracion from '../illustracions-jocs/Illustracion.svelte';
	import { FAMILHAS } from '$lib/jocs/sala/cataleg.js';

	// ?tema=clar ouvre la page dans le thème clair ; ?zoom=2.4 l'agrandit
	let tema = $state(page.url.searchParams.get('tema') === 'clar' ? 'clar' : 'sombre');
	const zoom = Number(page.url.searchParams.get('zoom')) || 1;

	const COLORS = {
		adreca: { fons: '#b53d17', tinta: '#fbf1e1', aur: '#ffd47f' },
		mots: { fons: '#eeaf34', tinta: '#2a1a10', aur: '#7a2e0c' },
		observacion: { fons: '#4f6a2f', tinta: '#fbf1e1', aur: '#ffd47f' },
		memoria: { fons: '#1f5f63', tinta: '#fbf1e1', aur: '#ffd47f' },
		escota: { fons: '#2b6496', tinta: '#fbf1e1', aur: '#ffd47f' }
	};
	const estilFamilha = (f) => {
		const c = COLORS[f.id];
		return `--lletra:${f.id === 'mots' ? '#2a1a10' : c.fons};--fons:${c.fons};--tinta:${c.tinta};--aur:${c.aur};--tinta-aur:${f.id === 'mots' ? '#fbf1e1' : '#2a1a10'};` +
			`--clar:${f.id === 'mots' ? '#fff8ea' : '#fbf1e1'};--escur:color-mix(in oklab, ${c.fons}, #000 30%);` +
			`--mitjan:color-mix(in oklab, ${c.fons}, #fff 30%);--clarfons:color-mix(in oklab, ${c.fons}, #fff 22%)`;
	};

	// Recensement relevé le 06-11 dans app/src (balises <button> par fichier ;
	// les boutons répétés par une boucle comptent une fois).
	const ZONES = [
		{ nom: 'Structure', quoi: 'barre du haut, menu, bienvenue, ambiance, langues, retour en haut', boutons: 15, fichiers: 6, note: 'La barre du haut est déjà une tuile du logo : le papier la prolonge. La croix ne bouge pas.' },
		{ nom: 'Pages publiques', quoi: 'accueil, Mots, S’apren, Remira, Anem, Cultura, Òbras, Médias, Idées, lecteur de livre', boutons: 106, fichiers: 19, note: 'La plus grosse zone. Remira, Anem et le lecteur sont des pages de calme : papier plus discret.' },
		{ nom: 'Leçons et grammaire', quoi: 'réponses, Verificar, Contunhar, fiches', boutons: 37, fichiers: 12, note: 'Le cœur de l’apprentissage : c’est là que le papier donne le plus de plaisir (bonne et mauvaise réponse).' },
		{ nom: 'Jeux', quoi: 'serpent, paniers, où est-ce, réglages, salle de jeux', boutons: 25, fichiers: 6, note: 'Déjà dans l’esprit des illustrations. Les cartes des familles deviennent des feuilles.' },
		{ nom: 'Compte et groupes', quoi: 'compte, questionnaire, mot de passe, Amassa, profils', boutons: 46, fichiers: 9, note: 'Formulaires : boutons papier, champs de saisie inchangés (à décider plus tard).' },
		{ nom: 'Carte et récit', quoi: 'rail des jaces, fiches, recherche, Mon istòria', boutons: 70, fichiers: 14, note: 'À traiter à part : le verre translucide choisi le 15-10 est une autre décision, sur une carte qui bouge.' }
	];

	const ETATS = ['Au repos', 'Survol', 'Appui', 'Clavier', 'Inactif'];
	const CLASSES_ETAT = ['', 'est-survol', 'est-appui', 'est-focus', 'est-inactif'];
	const ICONES = ['menu', 'son', 'reglages', 'chercher', 'fermer'];
	const PASTILLES = ['Tot', 'Occitan', 'Francés', 'Catalan'];
	const REPONSES = ['Bonjorn', 'Mercé', 'Tornar', 'Començar'];
</script>

<svelte:head>
	<title>Essai : boutons en papier découpé</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="contengut" class="essai theme-{tema}" style:zoom={zoom === 1 ? null : zoom}>
	<header class="cap">
		<div>
			<h1>Les boutons en papier découpé</h1>
			<p class="intro">
				Reprise, avec la netteté des illustrations de jeux : des pièces pleines aux bords nets, une ombre
				courte, rien d’autre. Les cartes des jeux, en bas de page, servent de repère.
			</p>
		</div>
		<div class="regle" role="group" aria-label="Thème de la page">
			<button type="button" class="pc pc-2 pc-chip" aria-pressed={tema === 'sombre'} onclick={() => (tema = 'sombre')}>Thème sombre</button>
			<button type="button" class="pc pc-2 pc-chip" aria-pressed={tema === 'clar'} onclick={() => (tema = 'clar')}>Thème clair</button>
		</div>
	</header>

	<section>
		<h2>1 · Les états d’un bouton</h2>
		<p class="mot">Au repos, une pièce posée. Au survol elle se soulève d’un pixel. À l’appui elle se pose à plat. Le clavier a un anneau doré net. Inactif, elle s’éteint.</p>
		<div class="etats">
			{#each ETATS as e (e)}<span class="legende">{e}</span>{/each}
			{#each CLASSES_ETAT as c (c)}
				<button type="button" class="pc {c}" disabled={c === 'est-inactif'}>Començar</button>
			{/each}
			{#each CLASSES_ETAT as c (c)}
				<button type="button" class="pc pc-2 {c}" disabled={c === 'est-inactif'}>Tornar</button>
			{/each}
		</div>
	</section>

	<section>
		<h2>2 · Les familles de boutons, avant et après</h2>
		<p class="mot">Chaque ligne est une famille du site. À gauche ce qui existe, à droite le papier.</p>
		<div class="tableau">
			<p class="col col-av">Aujourd’hui</p>
			<p class="col">Papier</p>

			<h3 class="famille">Action principale <span class="mot-p">le rouge du logo</span></h3>
			<div class="cell">
				<button type="button" class="av-prim">Començar</button>
				<button type="button" class="av-prim">Contunhar</button>
				<button type="button" class="av-prim">Enregistrar</button>
			</div>
			<div class="cell">
				<button type="button" class="pc">Començar</button>
				<button type="button" class="pc">Contunhar</button>
				<button type="button" class="pc">Enregistrar</button>
			</div>

			<h3 class="famille">Action secondaire <span class="mot-p">retour, plus tard</span></h3>
			<div class="cell">
				<button type="button" class="av-sec">Tornar</button>
				<button type="button" class="av-sec">Mai tard</button>
			</div>
			<div class="cell">
				<button type="button" class="pc pc-2">Tornar</button>
				<button type="button" class="pc pc-2">Mai tard</button>
			</div>

			<h3 class="famille">Boutons-icônes <span class="mot-p">menu, son, réglages, recherche, fermer</span></h3>
			<div class="cell">
				{#each ICONES as n (n)}<button type="button" class="av-ico" aria-label={n}><Icona nom={n} /></button>{/each}
			</div>
			<div class="cell">
				{#each ICONES as n (n)}<button type="button" class="pc pc-2 pc-icone" aria-label={n}><Icona nom={n} /></button>{/each}
			</div>

			<h3 class="famille">Pastilles de choix <span class="mot-p">filtres, langues, réglages</span></h3>
			<div class="cell">
				{#each PASTILLES as p, i (p)}<button type="button" class="av-chip" class:choisi={i === 1}>{p}</button>{/each}
			</div>
			<div class="cell">
				{#each PASTILLES as p, i (p)}<button type="button" class="pc pc-2 pc-chip" aria-pressed={i === 1}>{p}</button>{/each}
			</div>

			<h3 class="famille">Réponses d’exercice <span class="mot-p">bonne, mauvaise, au choix</span></h3>
			<div class="cell cell-rep">
				{#each REPONSES as r, i (r)}<button type="button" class="av-rep" class:bon={i === 0} class:faux={i === 1}>{r}</button>{/each}
			</div>
			<div class="cell cell-rep">
				{#each REPONSES as r, i (r)}<button type="button" class="pc pc-rep" class:est-bon={i === 0} class:est-faux={i === 1}>{r}{#if i === 0}<Icona nom="valide" />{:else if i === 1}<Icona nom="fermer" />{/if}</button>{/each}
			</div>
		</div>
	</section>

	<section>
		<h2>3 · En situation, à côté des illustrations des jeux</h2>
		<div class="ecran">
			<div class="barra">
				<button type="button" class="pc pc-2 pc-icone" aria-label="Menu"><Icona nom="menu" /></button>
				<span class="marca">Lo Ligam</span>
				<button type="button" class="pc pc-2 pc-icone" aria-label="Son"><Icona nom="son" /></button>
				<button type="button" class="pc pc-2 pc-icone" aria-label="Réglages"><Icona nom="reglages" /></button>
			</div>

			<div class="familhas">
				{#each FAMILHAS as f (f.id)}
					<button type="button" class="pc pc-grand pc-tuile" style={estilFamilha(f)}>
						<Illustracion id={f.id} estil="papier" />
						<span class="tuile-nom" lang="oc">{f.oc}</span>
					</button>
				{/each}
			</div>

			<div class="exercici">
				<p class="consigna">Quel mot veut dire « bonjour » ?</p>
				<div class="reps">
					<button type="button" class="pc pc-rep est-bon">Bonjorn<Icona nom="valide" /></button>
					<button type="button" class="pc pc-rep est-faux">Mercé<Icona nom="fermer" /></button>
					<button type="button" class="pc pc-rep">Tornar</button>
					<button type="button" class="pc pc-rep">Començar</button>
				</div>
				<div class="accions">
					<button type="button" class="pc pc-2">Tornar</button>
					<button type="button" class="pc">Contunhar</button>
				</div>
			</div>
		</div>
	</section>

	<section>
		<h2>4 · Où ça changerait : le recensement</h2>
		<p class="mot">
			Il n’existe aujourd’hui aucun bouton commun : 36 fichiers du site public définissent chacun le leur
			(135 règles « pilule » dans 62 fichiers). Il faut donc d’abord un socle unique, puis brancher zone par zone.
		</p>
		<div class="recens" role="table" aria-label="Recensement des boutons par zone">
			<div class="recens-ligne recens-tete" role="row">
				<span role="columnheader">Zone du site</span>
				<span role="columnheader">Boutons</span>
				<span role="columnheader">Fichiers</span>
				<span role="columnheader">Ce qu’il faut savoir</span>
			</div>
			{#each ZONES as z (z.nom)}
				<div class="recens-ligne" role="row">
					<span role="cell"><strong>{z.nom}</strong><br />{z.quoi}</span>
					<span role="cell" class="nb">{z.boutons}</span>
					<span role="cell" class="nb">{z.fichiers}</span>
					<span role="cell">{z.note}</span>
				</div>
			{/each}
			<div class="recens-ligne recens-bas" role="row">
				<span role="cell"><strong>Non public, à laisser</strong><br />administration, boîte à idées (Lo talhièr), pages d’essai</span>
				<span role="cell" class="nb">149</span>
				<span role="cell" class="nb">21</span>
				<span role="cell">Outils de Romain : le style papier peut y venir plus tard, ou jamais.</span>
			</div>
		</div>
		<p class="mot pied">
			Total du site public : 299 boutons dans 66 fichiers, plus des liens en forme de bouton dans 9 pages et
			des interrupteurs, onglets et cases dans 11 fichiers. Ne change pas : les liens soulignés (pied de page, « ligam »).
		</p>
	</section>
</main>

<style>
	.essai {
		min-height: 100vh;
		padding: 2rem clamp(1rem, 4vw, 4.5rem) 5rem;
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		--pc-or-fons: #eeaf34;
	}
	.theme-sombre {
		--t-fons: #22100a;
		--t-fons-2: #2f170e;
		--t-tinta: #fbf1e1;
		--t-tinta-2: rgba(251, 241, 225, 0.78);
		--t-linha: rgba(251, 241, 225, 0.2);
		--t-aur: #f6b73c;
		--t-aur-clar: #ffd98a;
		--t-accion: #b53d17;
		--t-accion-tinta: #fbf1e1;
		--pc-carton: #573828;
		--pc-ombre: rgba(0, 0, 0, 0.6);
	}
	.theme-clar {
		--t-fons: #f7f3ee;
		--t-fons-2: #ede6dc;
		--t-tinta: #2a1a10;
		--t-tinta-2: rgba(42, 26, 16, 0.72);
		--t-linha: rgba(42, 26, 16, 0.14);
		--t-aur: #9c5611;
		--t-aur-clar: #8a3f12;
		--t-accion: #b53d17;
		--t-accion-tinta: #fbf1e1;
		--pc-carton: #e1d3bd;
		--pc-ombre: rgba(20, 10, 5, 0.32);
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 1.8rem;
	}
	h2 {
		margin: 3rem 0 0.2rem;
		font-size: 1.3rem;
	}
	h3 {
		margin: 1.6rem 0 0.8rem;
		font-size: 1.05rem;
	}
	.cap {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem 2rem;
	}
	.intro,
	.mot {
		max-width: 62ch;
		margin: 0 0 1rem;
		color: var(--t-tinta-2);
	}
	.mot-p {
		margin-left: 0.5rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.regle {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		padding: 0.3rem 0.2rem 0.5rem;
	}

	/* 1 · états */
	.etats {
		display: grid;
		grid-template-columns: repeat(5, max-content);
		justify-content: start;
		gap: 1.3rem 2.2rem;
		align-items: center;
	}
	.legende {
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	@media (max-width: 640px) {
		.etats {
			grid-template-columns: repeat(2, max-content);
		}
		.legende {
			display: none;
		}
	}

	/* 2 · tableau des familles */
	.tableau {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.4rem 2rem;
		max-width: 60rem;
		margin-top: 1rem;
	}
	.col {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.famille {
		grid-column: 1 / -1;
		margin: 1.4rem 0 0.2rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--t-linha);
	}
	.cell {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.8rem;
		padding: 0.4rem 0.2rem 0.7rem;
	}
	.cell-rep {
		flex-direction: column;
		align-items: stretch;
	}
	@media (max-width: 700px) {
		.tableau {
			grid-template-columns: 1fr;
		}
		.col {
			display: none;
		}
		.cell:nth-of-type(odd)::before {
			content: 'Aujourd’hui';
		}
		.cell:nth-of-type(even)::before {
			content: 'Papier';
		}
		.cell::before {
			flex-basis: 100%;
			font-size: 0.75rem;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--t-aur);
		}
	}

	/* ce qui existe aujourd’hui, recopié des vraies feuilles de style */
	.av-prim,
	.av-sec,
	.av-ico,
	.av-chip,
	.av-rep {
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}
	.av-prim {
		min-height: 44px;
		padding: 0.6rem 1.4rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font-weight: 700;
	}
	.av-sec {
		min-height: 44px;
		padding: 0.6rem 1.4rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--t-linha);
		font-weight: 700;
	}
	.av-ico {
		display: inline-grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.6rem;
		background: none;
		font-size: 1.3rem;
	}
	.av-chip {
		padding: 6px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		font-size: 0.8125rem;
		font-weight: 700;
	}
	.av-chip.choisi {
		border-color: var(--t-accion);
	}
	.av-rep {
		padding: 0.5rem 0.9rem;
		border: 1.5px solid color-mix(in srgb, var(--t-tinta) 18%, transparent);
		border-radius: 12px;
		background: var(--t-fons-2);
		font-size: 0.95rem;
		text-align: left;
	}
	.av-rep.bon {
		border-color: #8db04a;
		background: color-mix(in srgb, #8db04a 22%, var(--t-fons-2));
	}
	.av-rep.faux {
		border-color: var(--t-accion);
		background: color-mix(in srgb, var(--t-accion) 22%, var(--t-fons-2));
	}

	/* 3 · en situation */
	.ecran {
		display: grid;
		gap: 2.2rem;
		max-width: 62rem;
		margin-top: 0.6rem;
		padding: clamp(1rem, 3vw, 2rem);
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
	}
	.barra {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}
	.marca {
		margin-right: auto;
		font-family: var(--font-heading);
		font-size: 1.4rem;
	}
	.exercici {
		display: grid;
		gap: 1.1rem;
		max-width: 34rem;
	}
	.consigna {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
	}
	.reps {
		display: grid;
		gap: 0.8rem;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		padding-top: 0.4rem;
	}
	.familhas {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1.6rem 1.3rem;
	}
	@media (max-width: 1000px) {
		.familhas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 480px) {
		.familhas {
			grid-template-columns: 1fr;
		}
	}
	.familhas :global(.pc-tuile) {
		display: grid;
		align-content: start;
		justify-content: stretch;
		gap: 0.5rem;
		min-height: 0;
		padding: 0.8rem 0.8rem 0.9rem;
		--pc-fons: var(--fons);
		--pc-tinta: var(--tinta);
		text-align: left;
	}
	.tuile-nom {
		font-size: 1.05rem;
		font-weight: 700;
	}

	/* 4 · recensement */
	.recens {
		display: grid;
		max-width: 66rem;
		margin-top: 1rem;
		border: 1px solid var(--t-linha);
	}
	.recens-ligne {
		display: grid;
		grid-template-columns: minmax(0, 2.2fr) 5rem 5rem minmax(0, 3fr);
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-top: 1px solid var(--t-linha);
		line-height: 1.4;
	}
	.recens-ligne:first-child {
		border-top: 0;
	}
	.recens-tete {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.recens-bas {
		color: var(--t-tinta-2);
	}
	.nb {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		text-align: right;
	}
	.pied {
		margin-top: 1rem;
	}
	@media (max-width: 760px) {
		.recens-ligne {
			grid-template-columns: 1fr 3.5rem 3.5rem;
		}
		.recens-ligne > :nth-child(4) {
			grid-column: 1 / -1;
			color: var(--t-tinta-2);
		}
		.recens-tete > :nth-child(4) {
			display: none;
		}
	}
</style>
