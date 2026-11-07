<script>
	// La mention des illustrations faites par IA : partout la même, un petit
	// rond « IA », discret, qui mène à /illustracions (pourquoi l'IA, et la
	// cagnotte pour payer un illustrateur ou une illustratrice).
	// Romain, 06-11 : « en très discret, mais qu'on puisse le voir quand même »,
	// « un petit rond avec IA, plutôt discret, en gardant le lien » ; 07-11 :
	// « le logo IA devrait être cohérent partout » (la signature en italique et
	// la ligne de texte, essayées le 06-11, sont retirées).
	// `quina` choisit seulement ce que dit l'info-bulle et le lecteur d'écran :
	//   - illustracion (une illustration), dessenh (un dessin : Remira, où le
	//     dessin peut être posé sur une photo de Romain, que la mention ne doit
	//     pas désigner) ;
	//   - pagina, paginaDessenh (toutes les illustrations, ou tous les dessins,
	//     d'une page où ils sont nombreux).
	// Avec `cadre`, le rond se pose en bas à droite du cadre (le parent :
	// position relative). Couleurs : --mencion-tinta, --mencion-tinta-fort,
	// --mencion-fons (sinon celles du thème).
	// Occitan passé à lo Congrès le 06-11 ; es, en, ca, ar par Aran (06-11).
	import { tria, lang } from '$lib/stores/lang.svelte.js';

	let { quina = 'illustracion', cadre = false, class: classa = '' } = $props();

	const T = {
		sigla: { oc: 'IA', fr: 'IA', es: 'IA', en: 'AI', ca: 'IA', ar: 'AI' },
		illustracion: {
			oc: 'Illustracion facha per l’IA',
			fr: 'Illustration faite par IA',
			es: 'Ilustración hecha por IA',
			en: 'Illustration made by AI',
			ca: 'Il·lustració feta per IA',
			ar: 'رسم توضيحي صنع بالذكاء الاصطناعي'
		},
		dessenh: { oc: 'Dessenh fach per l’IA', fr: 'Dessin fait par IA', es: 'Dibujo hecho por IA', en: 'Drawing made by AI', ca: 'Dibuix fet per IA', ar: 'رسم صنع بالذكاء الاصطناعي' },
		pagina: {
			oc: 'L’IA a fach las illustracions d’aquesta pagina',
			fr: 'Les illustrations de cette page sont faites par IA',
			es: 'Las ilustraciones de esta página están hechas por IA',
			en: 'The illustrations on this page were made by AI',
			ca: 'Les il·lustracions d’aquesta pàgina són fetes per IA',
			ar: 'رسم الذكاء الاصطناعي الرسومات الموجودة في هذه الصفحة'
		},
		paginaDessenh: {
			oc: 'L’IA a fach los dessenhs d’aquesta pagina',
			fr: 'Les dessins de cette page sont faits par IA',
			es: 'Los dibujos de esta página están hechos por IA',
			en: 'The drawings on this page were made by AI',
			ca: 'Els dibuixos d’aquesta pàgina són fets per IA',
			ar: 'رسم الذكاء الاصطناعي الرسومات الموجودة في هذه الصفحة'
		}
	};

	// la langue réellement affichée (tria retombe sur l'occitan)
	const lg = (o) => (o?.[lang.current] ? lang.current : o?.oc ? 'oc' : 'fr');
	let nom = $derived(T[quina] ?? T.illustracion);
</script>

<a
	class="mencion {classa}"
	class:cadre
	href="/illustracions"
	lang={lg(nom)}
	aria-label={tria(nom)}
	title={tria(nom)}><span aria-hidden="true">{tria(T.sigla)}</span></a
>

<style>
	/* le rond : petit (20 px), à peine visible, plus net au survol ; le doigt
	   a 44 px (zone invisible autour), « IA » à 4,5:1 au moins (Joan, 06-11) */
	.mencion {
		position: relative;
		display: inline-grid;
		place-items: center;
		box-sizing: border-box;
		inline-size: 1.25rem;
		block-size: 1.25rem;
		padding: 0;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: var(--mencion-fons, transparent);
		color: var(--mencion-tinta, var(--t-tinta-2));
		font-family: var(--font-body);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 1;
		text-decoration: none;
		vertical-align: middle;
		opacity: 0.9;
		transition:
			opacity 0.2s ease,
			color 0.2s ease;
	}
	.mencion::after {
		content: '';
		position: absolute;
		inset: -12px;
	}
	.mencion:hover,
	.mencion:focus-visible {
		opacity: 1;
		color: var(--mencion-tinta-fort, var(--t-tinta));
	}
	.cadre {
		position: absolute;
		inset-inline-end: 0.35rem;
		bottom: 0.35rem;
	}
</style>
