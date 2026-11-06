<script>
	// Las illustracions (Romain, 2026-11-06) : la page où mène la mention
	// « facha per l'IA » posée sur les illustrations faites par IA. Elle dit
	// pourquoi (le projet a commencé sans budget) et annonce la cagnotte qui
	// paiera un illustrateur ou une illustratrice. Rien n'est promis ici que
	// Romain n'ait dit : l'argent sert uniquement à ça ; la page montrera l'argent
	// récolté, l'argent dépensé poste par poste et les artistes (pas de facture :
	// Romain, 06-11). Quand la cagnotte ouvrira : objectif (après un devis),
	// montants modifiables avec « Editar », règles si l'objectif est dépassé
	// ou pas atteint, bouton vers la page du service de paiement (jamais de
	// formulaire de carte bancaire sur le site). Fiche :
	// revisions/2026-11-06-illustrations-ia-cagnotte.md
	// Occitan passé à lo Congrès le 06-11 (canhòta, prètzfach, budgèt…), à
	// relire par Romain ; es, en, ca, ar par Aran (06-11).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { tria, lang } from '$lib/stores/lang.svelte.js';

	const T = {
		titol: { oc: 'Las illustracions', fr: 'Les illustrations', es: 'Las ilustraciones', en: 'The illustrations', ca: 'Les il·lustracions', ar: 'الرسومات' },
		p1: {
			oc: 'Lo Ligam a començat sens budgèt. L’IA a fach los dessenhs del site : los mots de Remira, las afichas de la sala de jòcs, las icònas.',
			fr: 'Lo Ligam a commencé sans budget. Les dessins du site sont faits par IA : les mots de Remira, les affiches de la salle de jeux, les icônes.',
			es: 'Lo Ligam empezó sin presupuesto. Los dibujos del sitio están hechos por IA: las palabras de Remira, los carteles de la sala de juegos, los iconos.',
			en: 'Lo Ligam started with no budget. The site’s drawings were made by AI: the words in Remira, the posters in the games room, the icons.',
			ca: 'Lo Ligam va començar sense pressupost. Els dibuixos del web són fets per IA: les paraules de Remira, els cartells de la sala de jocs, les icones.',
			ar: 'بدأ Lo Ligam بلا ميزانية. ورسم الذكاء الاصطناعي رسومات الموقع: كلمات Remira وملصقات قاعة الألعاب والأيقونات.'
		},
		canhota: { oc: 'La canhòta', fr: 'La cagnotte', es: 'La colecta', en: 'The fundraiser', ca: 'La col·lecta', ar: 'حملة التبرعات' },
		p2: {
			oc: 'Una canhòta se dobrirà per pagar una persona que dessenha. Remplaçarà pauc a pauc los dessenhs de l’IA.',
			fr: 'Une cagnotte va s’ouvrir pour payer un illustrateur ou une illustratrice, qui remplacera peu à peu les dessins de l’IA.',
			es: 'Se abrirá una colecta para pagar a una persona ilustradora, que sustituirá poco a poco los dibujos de la IA.',
			en: 'A fundraiser will open to pay an illustrator, who will gradually replace the AI drawings.',
			ca: 'S’obrirà una col·lecta per pagar una persona il·lustradora, que substituirà a poc a poc els dibuixos de la IA.',
			ar: 'ستُفتح حملة تبرعات لدفع أجر شخص يرسم، وسيحلّ تدريجيًا مكان رسومات الذكاء الاصطناعي.'
		},
		p3: {
			oc: 'Aquel argent servirà sonque a aquò.',
			fr: 'Cet argent servira uniquement à ça.',
			es: 'Ese dinero se usará solo para eso.',
			en: 'This money will be used only for that.',
			ca: 'Aquests diners serviran només per a això.',
			ar: 'سيُخصَّص هذا المال لهذا الغرض فقط.'
		},
		p4: {
			// pas de facture publiée (Romain, 06-11 : « c'est ridicule ») : les montants,
			// les postes de dépense et les artistes
			oc: 'Aquí veiràs l’argent amassat, l’argent despensat, despensa per despensa, e lo nom de las personas que i an trabalhat.',
			fr: 'Ici, tu verras l’argent récolté, l’argent dépensé, poste par poste, et le nom des artistes qui y ont travaillé.',
			es: 'Aquí verás el dinero recaudado, el dinero gastado, partida por partida, y el nombre de quienes han trabajado en ello.',
			en: 'Here you’ll see the money raised, the money spent, item by item, and the names of the artists who worked on it.',
			ca: 'Aquí veuràs els diners recollits, els diners gastats, partida per partida, i el nom de qui hi ha treballat.',
			ar: 'ستجد هنا المبلغ الذي جُمع، والمبلغ الذي أُنفق بندًا بندًا، وأسماء الفنانين الذين عملوا عليه.'
		},
		p5: {
			oc: 'La canhòta es pas encara dobèrta.',
			fr: 'La cagnotte n’est pas encore ouverte.',
			es: 'La colecta todavía no está abierta.',
			en: 'The fundraiser isn’t open yet.',
			ca: 'La col·lecta encara no és oberta.',
			ar: 'لم تُفتح حملة التبرعات بعد.'
		},
		descripcion: {
			fr: 'Les illustrations de Lo Ligam sont faites par IA, en attendant un illustrateur ou une illustratrice payé·e par une cagnotte.',
			es: 'Las ilustraciones de Lo Ligam están hechas por IA, a la espera de una persona ilustradora pagada con una colecta.',
			en: 'Lo Ligam’s illustrations are made by AI, until an illustrator can be paid through a fundraiser.',
			ca: 'Les il·lustracions de Lo Ligam són fetes per IA, a l’espera d’una persona il·lustradora pagada amb una col·lecta.',
			ar: 'رسومات Lo Ligam من صنع الذكاء الاصطناعي، إلى أن يتولى شخص الرسم بأجر تموّله حملة تبرعات.'
		}
	};

	// la langue réellement affichée (tria retombe sur l'occitan)
	const lg = (o) => (o?.[lang.current] ? lang.current : o?.oc ? 'oc' : 'fr');
</script>

<svelte:head>
	<title>{tria(T.titol)} · Lo Ligam</title>
	<meta name="description" content={tria(T.descripcion)} />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main id="contengut" class="illustracions">
		<header class="cap">
			<h1 lang={lg(T.titol)}>{tria(T.titol)}</h1>
			<p class="frasa" lang={lg(T.p1)}>{tria(T.p1)}</p>
		</header>

		<section class="canhota" aria-labelledby="canhota-titol">
			<h2 id="canhota-titol" lang={lg(T.canhota)}>{tria(T.canhota)}</h2>
			<p lang={lg(T.p2)}>{tria(T.p2)}</p>
			<p lang={lg(T.p3)}>{tria(T.p3)}</p>
			<p lang={lg(T.p4)}>{tria(T.p4)}</p>
			<p class="estat" lang={lg(T.p5)}>{tria(T.p5)}</p>
		</section>
	</main>
</div>

<style>
	/* le cadre des pages intérieures, comme /ideas (--marge n'est pas global) */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.illustracions {
		max-width: calc(44rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
		font-family: var(--font-body);
		color: var(--t-tinta);
	}
	.cap {
		margin-bottom: var(--esp-48);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7vw, 4.5rem);
		line-height: 0.95;
	}
	.frasa {
		max-width: 40ch;
		margin: var(--esp-24) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.3rem);
		line-height: 1.55;
		color: var(--t-tinta-2);
	}

	/* une carte à filet fin, comme les autres pages harmonisées */
	.canhota {
		padding: clamp(1.25rem, 4vw, 2.25rem);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	h2 {
		margin: 0 0 var(--esp-16);
		font-size: 1.2rem;
		font-weight: 700;
	}
	.canhota p {
		margin: 0 0 0.7rem;
		max-width: 52ch;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	/* l'état de la cagnotte, mis en valeur à l'or (règle B) */
	.canhota .estat {
		margin: var(--esp-24) 0 0;
		color: var(--t-aur);
		font-weight: 700;
	}
</style>
