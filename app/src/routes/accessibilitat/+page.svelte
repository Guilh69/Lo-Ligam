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
				'Un ligam « Anar al contengut » apareis al primièr còp que quichas Tab, per sautar lo menú.',
				'Lo panèl de las jaças de la carta se manèja al claviar : Entrada o Espaci per dobrir e alucar, Escapar per tampar.'
			],
			manca: 'Çò que manca encara',
			mancaL: [
				'Los sostítols dels vidèos e de l’àudio.',
				'La carta interactiva, que se manèja pas encara completament al claviar nimai amb un lector d’ecran.',
				'Dins la legenda de la carta, causir una jaça activa en clicant sul nom d’una linha se pòt pas far al claviar.',
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
				'Un lien « Aller au contenu » apparaît au premier appui sur Tab, pour sauter le menu.',
				'Le panneau des couches de la carte se manie au clavier : Entrée ou Espace pour ouvrir et allumer, Échap pour fermer.'
			],
			manca: 'Ce qui manque encore',
			mancaL: [
				'Les sous-titres des vidéos et de l’audio.',
				'La carte interactive, qui ne se manie pas encore entièrement au clavier ni avec un lecteur d’écran.',
				'Dans la légende de la carte, choisir une couche active en cliquant sur le nom d’une ligne ne se fait pas au clavier.',
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
		},
		es: {
			titre: 'Accesibilidad',
			maj: 'Última comprobación',
			introT: 'Nuestro compromiso',
			intro:
				'Lo Ligam quiere ser utilizable por todas las personas, sea cual sea el medio de acceso (teléfono, ordenador, solo teclado, lector de pantalla) y sean cuales sean las capacidades. Aspiramos a cumplir las normas RGAA y WCAG.',
			estatT: 'Estado actual',
			estat:
				'Todavía no se ha realizado ninguna auditoría completa: no podemos afirmar que el sitio sea conforme. Esto es lo que sabemos, tras una comprobación de la página de inicio y del código.',
			fachT: 'Lo que ya funciona',
			fach: [
				'El idioma de la página cambia según tu elección (occitano, francés, español), y los lectores de pantalla lo siguen.',
				'Los títulos y las zonas de navegación están etiquetados; los botones tienen un nombre.',
				'Se puede navegar con el teclado, con un contorno bien visible en el elemento activo.',
				'Las animaciones se reducen cuando tu dispositivo lo pide.',
				'Las imágenes de contenido tienen un texto alternativo; los fondos decorativos se ocultan a los lectores de pantalla.',
				'Un lector de pantalla lee el título animado de la página de inicio una sola vez.',
				'Los vídeos empiezan sin sonido: un sonido que se activa solo sería un defecto de accesibilidad.',
				'Un enlace «Ir al contenido» aparece la primera vez que pulsas Tab, para saltar el menú.'
			],
			manca: 'Lo que aún falta',
			mancaL: [
				'Los subtítulos de los vídeos y del audio.',
				'El mapa interactivo, que todavía no se maneja del todo con el teclado ni con un lector de pantalla.',
				'La leyenda del mapa (barra de capas), manejada en parte con el ratón.',
				'Una comprobación de los contrastes en todas las páginas, en tema claro y oscuro.',
				'Una prueba con lectores de pantalla reales (NVDA, VoiceOver).'
			],
			lengasT: 'Idiomas del sitio',
			lengas:
				'Occitano, francés y español. Una parte de las páginas todavía no está traducida al español: se muestra entonces el occitano.',
			tipoT: 'Tipografía',
			tipo:
				'El sitio utiliza la tipografía Luciole, concebida para mejorar la lectura de las personas con baja visión. Luciole © Laurent Bourcellier y Jonathan Perez (CTRDV), licencia CC BY 4.0.',
			contacteT: '¿Algún problema? Escríbenos',
			contacte:
				'Si una página te bloquea, cuéntanos qué te encuentras, en qué página y qué dispositivo utilizas. Responderemos lo antes posible.',
			dreches:
				'Si no recibes respuesta por nuestra parte, puedes escribir al Defensor de los Derechos (defenseurdesdroits.fr).'
		},
		en: {
			titre: 'Accessibility',
			maj: 'Last checked',
			introT: 'Our commitment',
			intro:
				'Lo Ligam aims to be usable by everyone, whatever the means of access (phone, computer, keyboard only, screen reader) and whatever the abilities. We aim to meet the RGAA and WCAG standards.',
			estatT: 'Current status',
			estat:
				'A full audit has not yet been carried out, so we cannot say that the site is compliant. Here is what we know, after checking the home page and the code.',
			fachT: 'What already works',
			fach: [
				'The page language changes with your choice (Occitan, French, Spanish), and screen readers follow it.',
				'Headings and navigation areas are marked up; buttons have a name.',
				'You can navigate with the keyboard, with a clearly visible outline on the active element.',
				'Animations are reduced when your device asks for it.',
				'Content images have alternative text; decorative backgrounds are hidden from screen readers.',
				'A screen reader reads the animated home page title only once.',
				'Videos start without sound: sound that starts by itself would be an accessibility flaw.',
				'A ‘Skip to content’ link appears the first time you press Tab, to skip the menu.'
			],
			manca: 'What is still missing',
			mancaL: [
				'Subtitles for videos and audio.',
				'The interactive map, which cannot yet be fully operated with the keyboard or a screen reader.',
				'The map legend (layer rail), partly operated with the mouse.',
				'A check of contrasts on all pages, in light and dark themes.',
				'A test with real screen readers (NVDA, VoiceOver).'
			],
			lengasT: 'Site languages',
			lengas:
				'Occitan, French and Spanish. Some pages are not yet translated into Spanish: Occitan is shown instead.',
			tipoT: 'Typeface',
			tipo:
				'The site uses the Luciole typeface, designed to improve reading for people with low vision. Luciole © Laurent Bourcellier and Jonathan Perez (CTRDV), licence CC BY 4.0.',
			contacteT: 'A problem? Write to us',
			contacte:
				'If a page blocks you, tell us what you are running into, which page and which device you are using. We will reply as soon as we can.',
			dreches:
				'If we do not reply, you can write to the Defender of Rights (defenseurdesdroits.fr).'
		},
		ca: {
			titre: 'Accessibilitat',
			maj: 'Darrera verificació',
			introT: 'El nostre compromís',
			intro:
				'Lo Ligam vol ser utilitzable per tothom, sigui quin sigui el mitjà d’accés (telèfon, ordinador, només teclat, lector de pantalla) i siguin quines siguin les capacitats. Volem complir les normes RGAA i WCAG.',
			estatT: 'Estat actual',
			estat:
				'Encara no s’ha fet cap auditoria completa: no podem afirmar que el web sigui conforme. Això és el que sabem, després d’una comprovació de la pàgina d’inici i del codi.',
			fachT: 'El que ja funciona',
			fach: [
				'La llengua de la pàgina canvia segons la teva elecció (occità, francès, espanyol), i els lectors de pantalla la segueixen.',
				'Els títols i les zones de navegació estan etiquetats; els botons tenen un nom.',
				'Es pot navegar amb el teclat, amb un contorn ben visible a l’element actiu.',
				'Les animacions es redueixen quan el teu dispositiu ho demana.',
				'Les imatges de contingut tenen un text alternatiu; els fons decoratius s’amaguen als lectors de pantalla.',
				'Un lector de pantalla llegeix el títol animat de la pàgina d’inici una sola vegada.',
				'Els vídeos comencen sense so: un so que s’activa tot sol seria un defecte d’accessibilitat.',
				'Un enllaç «Anar al contingut» apareix la primera vegada que prems Tab, per saltar el menú.'
			],
			manca: 'El que encara falta',
			mancaL: [
				'Els subtítols dels vídeos i de l’àudio.',
				'El mapa interactiu, que encara no es maneja del tot amb el teclat ni amb un lector de pantalla.',
				'La llegenda del mapa (barra de capes), manejada en part amb el ratolí.',
				'Una verificació dels contrastos a totes les pàgines, en tema clar i fosc.',
				'Una prova amb lectors de pantalla reals (NVDA, VoiceOver).'
			],
			lengasT: 'Llengües del web',
			lengas:
				'Occità, francès i espanyol. Una part de les pàgines encara no està traduïda a l’espanyol: llavors es mostra l’occità.',
			tipoT: 'Tipografia',
			tipo:
				'El web utilitza la tipografia Luciole, concebuda per millorar la lectura de les persones amb baixa visió. Luciole © Laurent Bourcellier i Jonathan Perez (CTRDV), llicència CC BY 4.0.',
			contacteT: 'Un problema? Escriu-nos',
			contacte:
				'Si una pàgina et bloqueja, explica’ns què hi trobes, quina pàgina i quin dispositiu fas servir. Respondrem tan aviat com puguem.',
			dreches:
				'Si no et responem, pots escriure al Defensor dels Drets (defenseurdesdroits.fr).'
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
