<script>
	import { browser } from '$app/environment';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { families } from '$lib/data/siteSections';

	// Présentation au premier passage : un visiteur qui arrive ne sait pas
	// ce qu'est Lo Ligam ni ce qu'il y trouvera. Montré une seule fois,
	// mémorisé, et jamais bloquant — on peut le fermer d'un clic, d'Échap
	// ou en cliquant à côté.
	//
	// Un parcours guidé optionnel viendra plus tard : ceci n'en est pas un,
	// c'est juste un aperçu.
	let { lang = 'oc' } = $props();

	const CLAU = 'lo-ligam-benvenguda-vista';

	let obert = $state(false);
	let dialogEl = $state();

	const t = {
		oc: {
			titre: 'Benvenguda sus Lo Ligam',
			lead: "Un sol endrech per tot l'ecosistèma occitan. Vaquí çò que i trobaràs :",
			commencar: "Començar l'exploracion",
			tampar: 'Tampar',
			pasTornar: 'O tornar veire pas'
		},
		fr: {
			titre: 'Bienvenue sur Lo Ligam',
			lead: "Un seul endroit pour tout l'écosystème occitan. Voici ce que tu y trouveras :",
			commencar: "Commencer l'exploration",
			tampar: 'Fermer',
			pasTornar: 'Ne plus revoir'
		},
		es: {
			titre: 'Te damos la bienvenida a Lo Ligam',
			lead: 'Un solo lugar para todo el ecosistema occitano. Esto es lo que encontrarás:',
			commencar: 'Empezar la exploración',
			tampar: 'Cerrar',
			pasTornar: 'No volver a ver'
		},
		en: {
			titre: 'Welcome to Lo Ligam',
			lead: 'One single place for the whole Occitan ecosystem. Here is what you’ll find:',
			commencar: 'Start exploring',
			tampar: 'Close',
			pasTornar: 'Don’t show again'
		},
		ca: {
			titre: 'Et donem la benvinguda a Lo Ligam',
			lead: 'Un sol lloc per a tot l’ecosistema occità. Això és el que hi trobaràs:',
			commencar: 'Començar l’exploració',
			tampar: 'Tancar',
			pasTornar: 'No tornar-ho a veure'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);

	// Nom et sous-titre des familles dans les langues que siteSections.js ne
	// porte pas (il n'a que l'occitan et le français) : [nom, sous-titre]
	const FAM = {
		aprene: { es: ['Aprender', 'La columna vertebral'], en: ['Learn', 'The backbone'], ca: ['Aprendre', 'L’espina dorsal'] },
		descobrir: { es: ['Descubrir', 'El país y su cultura'], en: ['Discover', 'The country and its culture'], ca: ['Descobrir', 'El país i la seva cultura'] },
		participar: { es: ['Participar', 'La comunidad'], en: ['Take part', 'The community'], ca: ['Participar', 'La comunitat'] },
		'lo-ligam': { es: ['Lo Ligam', 'Quiénes somos'], en: ['Lo Ligam', 'Who we are'], ca: ['Lo Ligam', 'Qui som'] }
	};
	const famNom = (fam) => FAM[fam.id]?.[lang]?.[0] ?? (lang === 'oc' ? fam.oc : fam.fr);
	const famQuoi = (fam) => FAM[fam.id]?.[lang]?.[1] ?? (lang === 'oc' ? fam.tagline_oc : fam.tagline_fr);

	$effect(() => {
		if (!browser) return;
		let vu = null;
		try {
			vu = localStorage.getItem(CLAU);
		} catch {
			// Navigation privée ou stockage plein : on montre le message,
			// c'est moins grave que de planter.
		}
		if (!vu) obert = true;
	});

	// Le focus part sur la boîte pour que la navigation au clavier et les
	// lecteurs d'écran suivent l'ouverture.
	$effect(() => {
		if (obert && dialogEl) dialogEl.focus();
	});

	function fermer() {
		obert = false;
		try {
			localStorage.setItem(CLAU, '1');
		} catch {
			// Sans stockage, le message reviendra : acceptable.
		}
	}

	function onKey(e) {
		if (obert && e.key === 'Escape') fermer();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if obert}
	<div class="couche" transition:fade={{ duration: 200 }}>
		<button type="button" class="fond" onclick={fermer} aria-label={tx.tampar}></button>

		<div
			class="boita"
			role="dialog"
			aria-modal="true"
			aria-labelledby="benvenguda-titre"
			tabindex="-1"
			bind:this={dialogEl}
			transition:scale={{ duration: 320, start: 0.94, easing: quintOut }}
		>
			<h2 id="benvenguda-titre">{tx.titre}</h2>
			<p class="lead">{tx.lead}</p>

			<ul class="apercebut">
				{#each families as fam (fam.id)}
					<li style="--c: {fam.color}">
						<span class="nom">{famNom(fam)}</span>
						<span class="quoi">{famQuoi(fam)}</span>
					</li>
				{/each}
			</ul>

			<button type="button" class="btn" onclick={fermer}>{tx.commencar}</button>
		</div>
	</div>
{/if}

<style>
	.couche {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
	}

	.fond {
		position: absolute;
		inset: 0;
		border: none;
		padding: 0;
		background: rgba(43, 30, 22, 0.55);
		backdrop-filter: blur(3px);
		cursor: pointer;
	}

	.boita {
		position: relative;
		width: min(30rem, 100%);
		max-height: calc(100vh - 3rem);
		overflow-y: auto;
		background: var(--color-cream);
		border-radius: 22px;
		padding: 1.75rem 1.5rem 1.5rem;
		box-shadow: 0 24px 60px rgba(43, 30, 22, 0.35);
		text-align: center;
	}

	.boita:focus {
		outline: none;
	}

	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.35rem, 4vw, 1.7rem);
		color: var(--color-brick);
		text-wrap: balance;
	}

	.lead {
		margin: 0.6rem 0 1.25rem;
		font-size: 0.95rem;
		line-height: 1.5;
		opacity: 0.8;
		text-wrap: pretty;
	}

	.apercebut {
		list-style: none;
		margin: 0 0 1.5rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
	}

	.apercebut li {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		background: white;
		border-left: 4px solid var(--c);
		border-radius: 0 12px 12px 0;
		padding: 0.6rem 0.85rem;
	}

	.nom {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.98rem;
		color: var(--c);
	}

	.quoi {
		font-size: 0.82rem;
		opacity: 0.75;
	}

	.btn {
		border: none;
		background: var(--color-gold);
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		padding: 0.8rem 1.6rem;
		border-radius: 999px;
		cursor: pointer;
		box-shadow: 0 6px 18px rgba(238, 175, 52, 0.45);
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.btn:hover {
		transform: translateY(-2px) scale(1.03);
	}

	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>
