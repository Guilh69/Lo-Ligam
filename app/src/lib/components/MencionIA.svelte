<script>
	// La mention des illustrations faites par IA (Romain, 2026-11-06 : « en très
	// discret, mais qu'on puisse le voir quand même »). C'est un lien vers
	// /illustracions, qui dit pourquoi, et où sera la cagnotte pour payer un
	// illustrateur ou une illustratrice. Deux formes, choisies par Romain sur
	// l'essai /ensag/ia (« Signature et ligne », 06-11) :
	//   - signatura : sur une illustration seule, en bas à droite, comme un
	//     peintre signe sa toile. Avec `cadre`, elle se pose dans la marge basse
	//     d'un cadre (le parent : position relative, marge basse d'environ 1,9rem) ;
	//     `quina="dessenh"` dit « dessin » (Remira : le dessin peut être posé sur
	//     une photo de Romain, que la mention ne doit pas désigner) ;
	//   - linha : une seule ligne pour une page où les dessins sont nombreux
	//     (avec `quina="dessenh"` : « les dessins », quand la page a aussi des photos).
	// Occitan passé à lo Congrès le 06-11 ; es, en, ca, ar par Aran (06-11).
	// Le rouge souligne ce qui se clique (règle B) : --t-terra, plus vif en sombre.
	import { tria, lang } from '$lib/stores/lang.svelte.js';

	let { forma = 'signatura', quina = 'illustracion', cadre = false, class: classa = '' } = $props();

	const T = {
		signatura: { oc: 'facha per l’IA', fr: 'faite par IA', es: 'hecha por IA', en: 'made by AI', ca: 'feta per IA', ar: 'صنع بالذكاء الاصطناعي' },
		nomComplet: {
			oc: 'Illustracion facha per l’IA',
			fr: 'Illustration faite par IA',
			es: 'Ilustración hecha por IA',
			en: 'Illustration made by AI',
			ca: 'Il·lustració feta per IA',
			ar: 'رسم توضيحي صنع بالذكاء الاصطناعي'
		},
		dessenh: { oc: 'dessenh fach per l’IA', fr: 'dessin fait par IA', es: 'dibujo hecho por IA', en: 'drawing made by AI', ca: 'dibuix fet per IA', ar: 'رسم صنع بالذكاء الاصطناعي' },
		linha: {
			oc: 'L’IA a fach las illustracions d’aquesta pagina',
			fr: 'Les illustrations de cette page sont faites par IA',
			es: 'Las ilustraciones de esta página están hechas por IA',
			en: 'The illustrations on this page were made by AI',
			ca: 'Les il·lustracions d’aquesta pàgina són fetes per IA',
			ar: 'رسم الذكاء الاصطناعي الرسومات الموجودة في هذه الصفحة'
		},
		// une page où des dessins côtoient des photos de Romain (Cultura)
		linhaDessenh: {
			oc: 'L’IA a fach los dessenhs d’aquesta pagina',
			fr: 'Les dessins de cette page sont faits par IA',
			es: 'Los dibujos de esta página están hechos por IA',
			en: 'The drawings on this page were made by AI',
			ca: 'Els dibuixos d’aquesta pàgina són fets per IA',
			ar: 'رسم الذكاء الاصطناعي الرسومات الموجودة في هذه الصفحة'
		}
	};

	const PAGINA = '/illustracions';

	// la langue réellement affichée (tria retombe sur l'occitan)
	const lg = (o) => (o?.[lang.current] ? lang.current : o?.oc ? 'oc' : 'fr');
	let sageta = $derived(lang.current === 'ar' ? '←' : '→');
	let signa = $derived(quina === 'dessenh' ? T.dessenh : T.signatura);
	let linha = $derived(quina === 'dessenh' ? T.linhaDessenh : T.linha);
</script>

{#if forma === 'linha'}
	<p class="linha {classa}">
		<a class="mencion" href={PAGINA} lang={lg(linha)}>{tria(linha)} <span aria-hidden="true">{sageta}</span></a>
	</p>
{:else}
	<a
		class="mencion signatura {classa}"
		class:cadre
		href={PAGINA}
		lang={lg(signa)}
		aria-label={quina === 'dessenh' ? undefined : tria(T.nomComplet)}>{tria(signa)}</a
	>
{/if}

<style>
	/* petite, lisible, soulignée du rouge (ce qui se clique) ; zone de clic
	   d'au moins 24 px de haut sans changer l'aspect (Joan, 06-11) */
	.mencion {
		display: inline-block;
		padding-block: 0.3em;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--mencion-tinta, var(--t-tinta-2));
		text-decoration: underline;
		text-decoration-color: var(--mencion-trait, var(--t-terra));
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}
	.mencion:hover,
	.mencion:focus-visible {
		color: var(--mencion-tinta-fort, var(--t-tinta));
		text-decoration-thickness: 2px;
	}

	/* la signature : Cormorant italique, comme la main d'un peintre */
	.signatura {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1rem;
		line-height: 1.3;
		text-underline-offset: 0.2em;
	}
	.cadre {
		position: absolute;
		inset-inline-end: 0.7rem;
		bottom: 0;
	}

	.linha {
		margin: 0.8rem 0 0;
		text-align: end;
	}
</style>
