<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { editor } from '$lib/data/legal';

	let lang = $derived(langStore.current);

	// Déclaration d'accessibilité (2026-10-26). Le français est la référence ;
	// l'occitan est à valider par Romain avant publication, l'espagnol à relire
	// (Aran) : en attendant, l'espagnol retombe sur l'occitan.
	const dataControl = '2026-10-26';
	const t = {
		oc: {
			titre: 'Accessibilitat',
			maj: 'Darrièra verificacion',
			introT: 'Nòstre engatjament',
			intro:
				'Lo Ligam vòl èsser utilizable per tothom, quin que siá lo mejan d’accès (telefòn, ordenador, claviar sol, lector d’ecran) e quinas que sián las capacitats. Visam las nòrmas RGAA e WCAG.',
			estatT: 'Estat actual',
			estat:
				'Un audit complet foguèt pas encara fach : sèm pas en mesura de dire que lo site es conforme. Aquí çò que sabèm, après un contraròtle de la pagina d’acuèlh e del còdi.',
			fachT: 'Çò que fonciona ja',
			fach: [
				'La lenga de la pagina cambia amb ta causida (occitan, francés, espanhòl, anglés, catalan), e los lectors d’ecran la seguisson.',
				'Los títols e los espacis de navigacion son marcats ; los menuts an un nom.',
				'Se pòt navigar al claviar, amb un contorn ben visible sus l’element activat.',
				'Las animacions se reduson quand ton aparelh o demanda.',
				'Las imatges de contengut an un tèxte alternatiu ; los fons decoratius son escondeits als lectors d’ecran.',
				'Un lector d’ecran legís lo títol animat de l’acuèlh un còp sol.',
				'Los vidèos començan sens son : un son que part sol seriá un defaut d’accessibilitat.',
				'Un ligam « Anar al contengut » apareis al primièr còp que quichas Tab, per sautar lo menú.'
			],
			manca: 'Çò que manca encara',
			mancaL: [
				'Los sostítols dels vidèos e de l’àudio.',
				'La carta interactiva, que se manèja pas encara completament al claviar nimai amb un lector d’ecran.',
				'La legenda de la carta (rail de las jaças), manejada en part al ratolet.',
				'Una verificacion dels contrastes sus totas las paginas, en tèma clar e escur.',
				'Un tèst amb de lectors d’ecran reals (NVDA, VoiceOver).'
			],
			lengasT: 'Lengas del site',
			lengas:
				'Occitan, francés, espanhòl, anglés e catalan. L’interfàcia e l’acuèlh son traduches en espanhòl ; lo rèsta es pas encara traduch en espanhòl, en anglés nimai en catalan : l’occitan s’aficha alara.',
			tipoT: 'Poliça',
			tipo:
				'Lo site utiliza la poliça Luciole, concebuda per melhorar la lectura de las personas malvesentas. Luciole © Laurent Bourcellier e Jonathan Perez (CTRDV), licéncia CC BY 4.0.',
			contacteT: 'Un problèma ? Escriu-nos',
			contacte:
				'Se una pagina te bloca, ditz-nos çò que trapas, quina pagina e quin aparelh utilizas. Respondrem lo mai lèu possible.',
			dreches:
				'Sens responsa de nòstra part, pòdes escriure al Defensor dels dreches (defenseurdesdroits.fr).'
		},
		fr: {
			titre: 'Accessibilité',
			maj: 'Dernière vérification',
			introT: 'Notre engagement',
			intro:
				'Lo Ligam veut être utilisable par toutes et tous, quel que soit le moyen d’accès (téléphone, ordinateur, clavier seul, lecteur d’écran) et quelles que soient les capacités. Nous visons les normes RGAA et WCAG.',
			estatT: 'État actuel',
			estat:
				'Aucun audit complet n’a encore été réalisé : nous ne pouvons pas affirmer que le site est conforme. Voici ce que nous savons, après un contrôle de la page d’accueil et du code.',
			fachT: 'Ce qui fonctionne déjà',
			fach: [
				'La langue de la page change avec ton choix (occitan, français, espagnol, anglais, catalan), et les lecteurs d’écran la suivent.',
				'Les titres et les zones de navigation sont balisés ; les boutons ont un nom.',
				'On peut naviguer au clavier, avec un contour bien visible sur l’élément actif.',
				'Les animations se réduisent quand ton appareil le demande.',
				'Les images de contenu ont un texte alternatif ; les fonds décoratifs sont masqués aux lecteurs d’écran.',
				'Un lecteur d’écran lit le titre animé de l’accueil une seule fois.',
				'Les vidéos démarrent sans son : un son qui part tout seul serait un défaut d’accessibilité.',
				'Un lien « Aller au contenu » apparaît au premier appui sur Tab, pour sauter le menu.'
			],
			manca: 'Ce qui manque encore',
			mancaL: [
				'Les sous-titres des vidéos et de l’audio.',
				'La carte interactive, qui ne se manie pas encore entièrement au clavier ni avec un lecteur d’écran.',
				'La légende de la carte (rail des couches), en partie maniée à la souris.',
				'Une vérification des contrastes sur toutes les pages, en thème clair et sombre.',
				'Un test avec de vrais lecteurs d’écran (NVDA, VoiceOver).'
			],
			lengasT: 'Langues du site',
			lengas:
				'Occitan, français, espagnol, anglais et catalan. L’interface et l’accueil sont traduits en espagnol ; le reste n’est pas encore traduit en espagnol, en anglais ni en catalan : l’occitan s’affiche alors.',
			tipoT: 'Police de caractères',
			tipo:
				'Le site utilise la police Luciole, conçue pour améliorer la lecture des personnes malvoyantes. Luciole © Laurent Bourcellier et Jonathan Perez (CTRDV), licence CC BY 4.0.',
			contacteT: 'Un problème ? Écris-nous',
			contacte:
				'Si une page te bloque, dis-nous ce que tu rencontres, quelle page et quel appareil tu utilises. Nous répondrons au plus vite.',
			dreches:
				'Sans réponse de notre part, tu peux écrire au Défenseur des droits (defenseurdesdroits.fr).'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);
</script>

<svelte:head>
	<title>{tx.titre} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1>{tx.titre}</h1>
		<p class="maj">{tx.maj} : {dataControl}</p>

		<section>
			<h2>{tx.introT}</h2>
			<p>{tx.intro}</p>
		</section>

		<section>
			<h2>{tx.estatT}</h2>
			<p>{tx.estat}</p>
		</section>

		<section>
			<h2>{tx.fachT}</h2>
			<ul>
				{#each tx.fach as li}<li>{li}</li>{/each}
			</ul>
		</section>

		<section>
			<h2>{tx.manca}</h2>
			<ul>
				{#each tx.mancaL as li}<li>{li}</li>{/each}
			</ul>
		</section>

		<section>
			<h2>{tx.lengasT}</h2>
			<p>{tx.lengas}</p>
		</section>

		<section>
			<h2>{tx.tipoT}</h2>
			<p>{tx.tipo}</p>
		</section>

		<section>
			<h2>{tx.contacteT}</h2>
			<p>{tx.contacte} <a href="mailto:{editor.email}">{editor.email}</a></p>
			<p class="dreches">{tx.dreches}</p>
		</section>
	</article>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.screen {
		max-width: 44rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
	}

	.doc {
		margin-top: 2rem;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.7rem, 4vw, 2.3rem);
		color: var(--color-brick);
		margin: 0;
	}

	.maj {
		margin: 0.4rem 0 2rem;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	section {
		margin-bottom: 1.75rem;
	}

	h2 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-brick);
		margin: 0 0 0.4rem;
	}

	p,
	li {
		line-height: 1.6;
		text-wrap: pretty;
	}

	p {
		margin: 0;
	}

	ul {
		margin: 0;
		padding-left: 1.2rem;
	}

	li + li {
		margin-top: 0.3rem;
	}

	.dreches {
		margin-top: 0.6rem;
	}

	a {
		color: var(--color-teal);
	}
</style>
