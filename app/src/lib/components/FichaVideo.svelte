<script>
	// Lecteur de la vidéo d'une fiche. Deux cas, deux comportements.
	//
	// LOGIQUE DU SON — les navigateurs refusent de démarrer une vidéo sonore
	// sans geste de l'utilisateur. Mais ouvrir une fiche EST un clic : le
	// document est alors « activé », et on a le droit de mettre le son. Donc :
	// la toute première fiche démarre muette avec un bouton son bien visible ;
	// dès que le visiteur l'active, les fiches suivantes démarrent sonores.
	// Si le navigateur refuse malgré tout, on repasse en muet sans rien casser
	// — jamais d'écran noir parce que le son a été bloqué.
	import { menaVideo, ligamCanvaEmbed, sonVolgut, gardarSon } from '$lib/videos';

	let { ficha, lang = 'oc' } = $props();

	let mena = $derived(menaVideo(ficha.video));
	let ligamCanva = $derived(mena === 'canva' ? ligamCanvaEmbed(ficha.video) : null);

	let son = $state(false);
	let videoEl = $state();
	let canvaCargat = $state(false);

	const t = {
		oc: {
			metreSon: 'Metre lo son',
			levarSon: 'Levar lo son',
			jogar: 'Legir la vidèo',
			avisCanva: 'La vidèo es albergada per Canva. En clicant, cargas lor lector.'
		},
		fr: {
			metreSon: 'Activer le son',
			levarSon: 'Couper le son',
			jogar: 'Lire la vidéo',
			avisCanva: 'La vidéo est hébergée par Canva. En cliquant, tu charges leur lecteur.'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);

	$effect(() => {
		const el = videoEl;
		if (!el) return;
		son = sonVolgut();
		lançar(el);
	});

	async function lançar(el) {
		el.muted = !son;
		try {
			await el.play();
		} catch {
			// Le navigateur a refusé le son : on retombe en muet plutôt que de
			// laisser une vidéo à l'arrêt sans que le visiteur sache pourquoi.
			son = false;
			el.muted = true;
			try {
				await el.play();
			} catch {
				/* lecture impossible : les contrôles natifs prennent le relais */
			}
		}
	}

	function bascularSon() {
		son = !son;
		gardarSon(son);
		if (videoEl) videoEl.muted = !son;
	}
</script>

{#if mena === 'mp4'}
	<div class="envolopa">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={videoEl}
			src={ficha.video}
			poster={ficha.grand}
			playsinline
			loop
			muted
			preload="metadata"
			controls
		></video>
		<button
			type="button"
			class="son"
			onclick={bascularSon}
			aria-pressed={son}
			aria-label={son ? tx.levarSon : tx.metreSon}
		>
			<span aria-hidden="true">{son ? '🔊' : '🔇'}</span>
		</button>
	</div>
{:else if mena === 'canva' && ligamCanva}
	<div class="envolopa">
		{#if canvaCargat}
			<iframe
				src={ligamCanva}
				title={ficha.titre}
				loading="lazy"
				allow="fullscreen"
				referrerpolicy="no-referrer"
			></iframe>
		{:else}
			<!-- Chargement au clic : rien de Canva n'est appelé — et donc aucun
			     de leurs traceurs déposé — tant que le visiteur n'a pas demandé. -->
			<button type="button" class="faciada" onclick={() => (canvaCargat = true)}>
				<img src={ficha.grand} alt={ficha.titre} />
				<span class="jogar" aria-hidden="true">▶</span>
				<span class="sr-only">{tx.jogar}</span>
			</button>
			<p class="avis">{tx.avisCanva}</p>
		{/if}
	</div>
{:else}
	<img src={ficha.grand} alt={ficha.titre} />
{/if}

<style>
	.envolopa {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	video,
	iframe,
	.faciada img,
	img {
		width: 100%;
		max-height: 78vh;
		border-radius: 14px;
		display: block;
		background: white;
	}

	video,
	img,
	.faciada img {
		object-fit: contain;
	}

	iframe {
		aspect-ratio: 4 / 5;
		border: none;
	}

	.son {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 999px;
		border: none;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 4px 14px rgba(58, 42, 32, 0.28);
		cursor: pointer;
		font-size: 1.1rem;
		line-height: 1;
	}

	.son:hover {
		background: white;
	}

	.faciada {
		position: relative;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		display: block;
	}

	.jogar {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 4rem;
		height: 4rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.94);
		box-shadow: 0 8px 24px rgba(58, 42, 32, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.4rem;
		color: var(--color-terracotta);
		padding-left: 0.2rem;
	}

	.avis {
		margin: 0;
		font-size: 0.75rem;
		color: white;
		opacity: 0.85;
		text-align: center;
		max-width: 26rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
