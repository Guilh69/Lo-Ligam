<script>
	// « La votz d'aquí » dans la fiche d'une ville (demande de Romain,
	// 2026-10-12 : avec les noms des villes, la voix s'intègre à la fiche,
	// pas en points par-dessus). L'enregistrement de l'Atlas sonore (LISN)
	// le plus proche, à moins de 25 km : son lieu, son dialecte, l'écoute et
	// la phrase en cours ; un lien ouvre le mode écoute sur la carte.
	import { cargarVotz, pròcha, sonDe, frasas, frasaAra, sonSol } from '$lib/carta/votz.js';

	let { comuna, lang = 'oc', nomDe = (p) => p.n, colorDe = () => '#eeaf34', onCarta = null } = $props();

	const t = {
		oc: { aquí: "La votz d'aquí", procha: 'La votz mai pròcha', a: 'a', escotar: 'Escotar', pausa: 'Pausa', carta: 'Totas las votz sus la carta', titol: '« La bisa e lo solelh »' },
		fr: { aquí: "La voix d'ici", procha: 'La voix la plus proche', a: 'à', escotar: 'Écouter', pausa: 'Pause', carta: 'Toutes les voix sur la carte', titol: '« La bise et le soleil »' }
	};
	let tx = $derived(t[lang] ?? t.oc);
	let fr = $derived(lang === 'fr');

	let trobada = $state.raw(null);
	$effect(() => {
		const c = comuna;
		trobada = null;
		if (!c?.lat) return;
		let viu = true;
		cargarVotz().then((d) => viu && (trobada = pròcha(d?.ponches, c)));
		return () => (viu = false);
	});

	let audio = $state();
	let jogant = $state(false);
	let temps = $state(0);
	let durada = $state(0);
	let p = $derived(trobada?.p);
	let liste = $derived(p ? frasas(p.tx) : []);
	let i = $derived(durada ? frasaAra(liste, temps / durada) : -1);
	// une autre ville : on se tait et on repart de zéro
	$effect(() => {
		p;
		audio?.pause();
		temps = 0;
		durada = 0;
	});

	function bascular() {
		if (!audio || !p) return;
		if (!audio.paused) return audio.pause();
		const src = sonDe(p.so);
		if (audio.getAttribute('src') !== src) audio.src = src;
		audio.play().catch(() => {});
	}
	const dial = (p) => (p.mix ? (fr ? p.mix.fr : p.mix.oc) : fr ? p.d.fr : p.d.oc);
</script>

{#if p}
	<div class="votz-ficha" style="--c: {colorDe(p.d.kod)}">
		<button type="button" class="boton" onclick={bascular} aria-label={(jogant ? tx.pausa : tx.escotar) + ' : ' + nomDe(p)}>
			{#if jogant}
				<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
			{/if}
		</button>
		<div class="cos">
			<p class="cap">{trobada.d < 2 ? tx.aquí : tx.procha}</p>
			<p class="luòc">
				<span class="punt" aria-hidden="true"></span>{dial(p)}{#if trobada.d >= 2}, {tx.a} {nomDe(p)} · {Math.round(trobada.d)} km{/if}
			</p>
			<p class="frasa" lang={p.mix ? undefined : 'oc'}>
				{#if i >= 0}{liste[i]}{:else}{tx.titol}{/if}
			</p>
			<div class="fil" aria-hidden="true"><i style="width: {durada ? (temps / durada) * 100 : 0}%"></i></div>
			{#if onCarta}
				<button type="button" class="carta" onclick={() => (audio?.pause(), onCarta(p))}>{tx.carta} →</button>
			{/if}
		</div>
	</div>
	<audio
		bind:this={audio}
		preload="none"
		onplay={() => ((jogant = true), sonSol(audio))}
		onpause={() => (jogant = false)}
		onended={() => ((jogant = false), (temps = 0))}
		ontimeupdate={() => (temps = audio.currentTime)}
		onloadedmetadata={() => (durada = audio.duration)}
	></audio>
{/if}

<style>
	audio {
		display: none;
	}
	.votz-ficha {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		margin-top: 12px;
		padding: 10px 12px;
		border-radius: 14px;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--c) 7%, transparent);
	}
	.boton {
		width: 44px;
		height: 44px;
		flex: none;
		border: 0;
		border-radius: 50%;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: #2a1408;
		background: radial-gradient(circle at 35% 30%, var(--t-aur-clar), var(--t-aur) 70%);
		box-shadow: 0 0 0 5px color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.boton svg {
		width: 20px;
		height: 20px;
		fill: currentColor;
	}
	.cos {
		flex: 1;
		min-width: 0;
	}
	.cap {
		font-family: var(--font-heading);
		color: var(--t-aur-clar);
		font-size: 1rem;
		line-height: 1.2;
	}
	.luòc {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 0.78rem;
		color: var(--t-tinta-2);
		margin-top: 2px;
	}
	.punt {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 0 8px var(--c);
	}
	.frasa {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.02rem;
		line-height: 1.35;
		margin-top: 6px;
		min-height: 1.35em;
	}
	.fil {
		height: 2px;
		border-radius: 2px;
		background: var(--t-linha);
		margin-top: 8px;
		overflow: hidden;
	}
	.fil i {
		display: block;
		height: 100%;
		background: var(--t-aur);
		transition: width 0.25s linear;
	}
	.carta {
		margin-top: 8px;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 0.8rem;
		color: var(--t-aur-clar);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
