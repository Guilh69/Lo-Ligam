<script>
	// « La votz d'aquí » dans la fiche d'une ville (demande de Romain,
	// 2026-10-12 : avec les noms des villes, la voix s'intègre à la fiche,
	// pas en points par-dessus). L'enregistrement de l'Atlas sonore (LISN)
	// le plus proche, à moins de 25 km : son lieu, son dialecte, l'écoute et
	// la phrase en cours ; un lien ouvre le mode écoute sur la carte.
	// Repliée en une ligne sous les informations de la ville (Romain,
	// 2026-10-23 : « on devrait d'abord voir les informations sur la ville ») :
	// un toucher lit la voix et déplie la phrase, sans second geste.
	import { cargarVotz, pròcha, sonDe, frasas, frasaAra, sonSol } from '$lib/carta/votz.js';

	let { comuna, lang = 'oc', nomDe = (p) => p.n, colorDe = () => '#eeaf34', onCarta = null } = $props();

	const t = {
		oc: { aquí: "Escotar la votz d'aquí", procha: 'Escotar la votz mai pròcha', a: 'a', pausa: 'Pausa', carta: 'Totas las votz sus la carta', titol: '« La bisa e lo solelh »' },
		fr: { aquí: "Écouter la voix d'ici", procha: 'Écouter la voix la plus proche', a: 'à', pausa: 'Pause', carta: 'Toutes les voix sur la carte', titol: '« La bise et le soleil »' },
		es: { aquí: 'Escuchar la voz de aquí', procha: 'Escuchar la voz más cercana', a: 'en', pausa: 'Pausa', carta: 'Todas las voces en el mapa', titol: '« El viento del norte y el sol »' },
		en: { aquí: 'Listen to the voice from here', procha: 'Listen to the nearest voice', a: 'in', pausa: 'Pause', carta: 'All the voices on the map', titol: '“The North Wind and the Sun”' },
		ca: { aquí: 'Escoltar la veu d’aquí', procha: 'Escoltar la veu més propera', a: 'a', pausa: 'Pausa', carta: 'Totes les veus al mapa', titol: '« El vent del nord i el sol »' },
		ar: { aquí: 'الاستماع إلى صوت هذا المكان', procha: 'الاستماع إلى أقرب صوت', a: 'في', pausa: 'إيقاف مؤقت', carta: 'كل الأصوات على الخريطة', titol: '« ريح الشمال والشمس »' }
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
	let dobèrta = $state(false);
	let temps = $state(0);
	let durada = $state(0);
	let p = $derived(trobada?.p);
	let liste = $derived(p ? frasas(p.tx) : []);
	let i = $derived(durada ? frasaAra(liste, temps / durada) : -1);
	// une autre ville : on se tait, on replie et on repart de zéro
	$effect(() => {
		p;
		audio?.pause();
		dobèrta = false;
		temps = 0;
		durada = 0;
	});

	function bascular() {
		if (!audio || !p) return;
		dobèrta = true;
		if (!audio.paused) return audio.pause();
		const src = sonDe(p.so);
		if (audio.getAttribute('src') !== src) audio.src = src;
		audio.play().catch(() => {});
	}
	const dial = (p) => (p.mix ? (fr ? p.mix.fr : p.mix.oc) : fr ? p.d.fr : p.d.oc);
</script>

{#if p}
	<div class="votz-ficha" class:dobèrta style="--c: {colorDe(p.d.kod)}">
		<button type="button" class="linha" onclick={bascular} aria-expanded={dobèrta} aria-label={(jogant ? tx.pausa : trobada.d < 2 ? tx.aquí : tx.procha) + ' : ' + nomDe(p)}>
			<span class="boton" aria-hidden="true">
				{#if jogant}
					<svg viewBox="0 0 24 24"><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>
				{:else}
					<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
				{/if}
			</span>
			<span class="tèxt">
				<span class="cap">{trobada.d < 2 ? tx.aquí : tx.procha}</span>
				<span class="luòc">
					<span class="punt"></span>{dial(p)}{#if trobada.d >= 2}, {tx.a} {nomDe(p)} · {Math.round(trobada.d)} km{/if}
				</span>
			</span>
		</button>
		{#if dobèrta}
			<div class="cos">
				<p class="frasa" lang={p.mix ? undefined : 'oc'}>
					{#if i >= 0}{liste[i]}{:else}{tx.titol}{/if}
				</p>
				<div class="fil" aria-hidden="true"><i style="width: {durada ? (temps / durada) * 100 : 0}%"></i></div>
				{#if onCarta}
					<button type="button" class="carta" onclick={() => (audio?.pause(), onCarta(p))}>{tx.carta} {lang === 'ar' ? '←' : '→'}</button>
				{/if}
			</div>
		{/if}
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
		margin-top: 10px;
		border-top: 1px solid var(--t-linha);
		padding-top: 6px;
	}
	/* la ligne repliée : tout est une seule cible (44 px de haut au moins) */
	.linha {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		min-height: 44px;
		padding: 4px 2px;
		border: 0;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		border-radius: 10px;
	}
	.linha:hover .cap,
	.linha:focus-visible .cap {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.boton {
		width: 32px;
		height: 32px;
		flex: none;
		border-radius: 50%;
		display: grid;
		place-items: center;
		color: var(--t-accion-tinta);
		background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--t-accion) 72%, #fff), var(--t-accion) 70%);
	}
	.boton svg {
		width: 15px;
		height: 15px;
		fill: currentColor;
	}
	.tèxt {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.cap {
		font-size: 0.92rem;
		color: var(--t-aur-clar);
		line-height: 1.25;
	}
	.luòc {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 0.76rem;
		color: var(--t-tinta-2);
	}
	.punt {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 0 6px var(--c);
	}
	.cos {
		padding: 2px 2px 4px 44px;
	}
	.frasa {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1rem;
		line-height: 1.35;
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
		color: var(--t-tinta); text-decoration-color: var(--t-accion); text-decoration-thickness: 2px;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
