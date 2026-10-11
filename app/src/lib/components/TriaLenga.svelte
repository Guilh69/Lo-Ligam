<script>
	// Lo tria de la lenga del tèxt d'una ficha de comuna (retorn de Romain,
	// 2026-10-11 : « comme un diagramme avec l'icône basque, occitane et
	// française ; la langue choisie en bas ; un bruit de clic satisfaisant ;
	// une animation soignée »). Tres prepausas a ensajar, una sola demorarà :
	//   a : lo cadran, que vira fins que la lenga causida es en bas ;
	//   b : la colomna, la lenga causida davala dins son lotjament ;
	//   c : lo camembèrt, sa part vira en bas e s'avança.
	import { sonClic } from '$lib/carta/sons.js';

	let { lenguas = [], causida, onCausir, varianta = 'a', nomLenga = (l) => l, còdi = (l) => l, etiqueta = '' } = $props();

	const n = $derived(lenguas.length);
	const idx = $derived(Math.max(0, lenguas.indexOf(causida)));
	const pas = $derived(360 / Math.max(n, 1));
	// (la rotacion se garda d'un clic a l'autre : lo cadran vira pel camin pus cort)
	let rot = $state(0),
		clauLenguas = '';
	$effect(() => {
		const k = lenguas.join(',');
		if (k !== clauLenguas) {
			clauLenguas = k;
			rot = -idx * pas;
		}
	});
	const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function causir(l) {
		const j = lenguas.indexOf(l);
		if (j < 0 || l === causida) return;
		let d = (((j - idx) % n) + n) % n;
		if (d > n / 2) d -= n;
		rot -= d * pas;
		onCausir?.(l);
		// lo son : a l'encastre (e un cran leugièr per cada lenga passada, pel cadran)
		const t = calm() ? 0 : varianta === 'a' ? 430 : varianta === 'b' ? 330 : 380;
		if (varianta === 'a' && !calm()) for (let k = 1; k < Math.abs(d); k++) setTimeout(() => sonClic(0.45), (t * k) / Math.abs(d) - 60);
		setTimeout(() => sonClic(1), t);
	}
	function clavièr(e) {
		const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
		if (!k) return;
		e.preventDefault();
		causir(lenguas[(idx + k + n) % n]);
	}

	// cadran e camembèrt : la lenga k es a l'angle 90° + k·pas (90° = en bas)
	const angle = (k) => ((90 + k * pas) * Math.PI) / 180;
	// colomna : la causida en bas, las autras dins lor òrdre al dessús
	const plaça = (l) => (l === causida ? n - 1 : lenguas.filter((x) => x !== causida).indexOf(l));

	// las colors de las parts del camembèrt
	const COLOR = { oc: '#d9a441', fr: '#4d6fd6', eu: '#2e9e5b', ca: '#e0b021', br: '#b9b9b9', frp: '#3fae6a', als: '#d9534f', co: '#c9c9c9', lb: '#5aa0d8', vls: '#e2c14a', nl: '#e8873a', pcd: '#8fb35a', wa: '#e3c03a', nrm: '#d65a4a' };
	const arc = (k, r1, r2, jaç = 5) => {
		const a0 = ((90 + k * pas - pas / 2 + jaç / 2) * Math.PI) / 180,
			a1 = ((90 + k * pas + pas / 2 - jaç / 2) * Math.PI) / 180,
			gran = pas - jaç > 180 ? 1 : 0;
		const p = (r, a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
		return `M${p(r2, a0)}A${r2} ${r2} 0 ${gran} 1 ${p(r2, a1)}L${p(r1, a1)}A${r1} ${r1} 0 ${gran} 0 ${p(r1, a0)}Z`;
	};
</script>

<!-- L'emblèma d'una lenga, dins un ròtle -->
{#snippet pastilha(l)}
	<svg class="pastilha" viewBox="-12 -12 24 24" aria-hidden="true">
		<clipPath id="rotle-{l}"><circle r="12" /></clipPath>
		<g clip-path="url(#rotle-{l})">
			{#if l === 'eu'}
				<rect x="-12" y="-12" width="24" height="24" fill="#d52b1e" />
				<path d="M-13 -13L13 13M13 -13L-13 13" stroke="#009b48" stroke-width="3.6" />
				<path d="M0 -13V13M-13 0H13" stroke="#fff" stroke-width="3" />
			{:else if l === 'oc'}
				<rect x="-12" y="-12" width="24" height="24" fill="#c8102e" />
				<g transform="scale(8.2)" fill="none" stroke="#f3c25a" stroke-linecap="round">
					<path d="M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797" stroke-width="0.09" />
					<path
						d="M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48"
						stroke-width="0.1"
					/>
				</g>
				<g fill="#f3c25a">
					{#each [[0, -8.2], [4, -6.5], [6.6, -3.9], [8.2, 0], [6.6, 3.9], [4, 6.5], [0, 8.1], [-3.8, 6.5], [-6.4, 3.9], [-8, 0.1], [-6.4, -3.9], [-3.8, -6.5]] as [x, y]}<circle cx={x} cy={y} r="1.05" />{/each}
					<circle r="1.2" />
				</g>
			{:else if l === 'fr'}
				<circle r="12" fill="#e1000f" />
				<circle r="8.2" fill="#fff" />
				<circle r="4.6" fill="#000091" />
			{:else if l === 'ca'}
				<rect x="-12" y="-12" width="24" height="24" fill="#fcdd09" />
				{#each [-7.1, -2.4, 2.4, 7.1] as y}<rect x="-12" y={y - 1.3} width="24" height="2.6" fill="#da121a" />{/each}
			{:else if l === 'br'}
				<rect x="-12" y="-12" width="24" height="24" fill="#fff" />
				{#each [-9.3, -4, 1.3, 6.6] as y}<rect x="-12" y={y} width="24" height="2.65" fill="#111" />{/each}
				<rect x="-12" y="-12" width="11" height="11" fill="#fff" />
				{#each [[-9, -9], [-4.5, -9], [-6.8, -5], [-9, -2.6], [-4.5, -2.6]] as [x, y]}<path d="M{x} {y - 1.2}l0.9 1.6h-1.8z" fill="#111" />{/each}
			{:else if l === 'als'}
				<rect x="-12" y="-12" width="24" height="12" fill="#d52b1e" />
				<rect x="-12" y="0" width="24" height="12" fill="#fff" />
			{:else}
				<rect x="-12" y="-12" width="24" height="24" fill={COLOR[l] ?? '#777'} />
				<text y="3.6" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff">{còdi(l)}</text>
			{/if}
		</g>
		<circle r="11.5" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1" />
	</svg>
{/snippet}

<div class="tria v-{varianta}" style:--n={n} role="radiogroup" aria-label={etiqueta} tabindex="-1" onkeydown={clavièr}>
	{#if varianta === 'a'}
		<!-- A. Lo cadran -->
		<div class="cadran">
			<div class="pista"></div>
			<div class="roda" style:transform="rotate({rot}deg)">
				{#each lenguas as l, k (l)}
					<button
						type="button"
						role="radio"
						aria-checked={l === causida}
						aria-label={nomLenga(l)}
						title={nomLenga(l)}
						class="lg"
						class:causida={l === causida}
						style:left="{36 + 23 * Math.cos(angle(k)) - 12}px"
						style:top="{36 + 23 * Math.sin(angle(k)) - 12}px"
						onclick={() => causir(l)}
					>
						<span class="drech" style:transform="rotate({-rot}deg)">{@render pastilha(l)}</span>
					</button>
				{/each}
			</div>
			<span class="osca" aria-hidden="true"></span>
		</div>
	{:else if varianta === 'b'}
		<!-- B. La colomna -->
		<div class="colomna" style:height="{n * 28 + 6}px">
			<span class="lotjament" aria-hidden="true" style:top="{(n - 1) * 28 + 1}px">
				{#key causida}<span class="pols"></span>{/key}
			</span>
			{#each lenguas as l (l)}
				<button
					type="button"
					role="radio"
					aria-checked={l === causida}
					aria-label={nomLenga(l)}
					title={nomLenga(l)}
					class="lg"
					class:causida={l === causida}
					style:top="{plaça(l) * 28 + 3}px"
					onclick={() => causir(l)}>{@render pastilha(l)}</button
				>
			{/each}
		</div>
	{:else}
		<!-- C. Lo camembèrt -->
		<div class="camembert">
			<svg class="parts" viewBox="-40 -40 80 80" aria-hidden="true">
				<g class="roda-svg" style:transform="rotate({rot}deg)">
					{#each lenguas as l, k (l)}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<path
							d={arc(k, 22, 37)}
							fill={COLOR[l] ?? '#888'}
							class="part"
							class:causida={l === causida}
							style:transform={l === causida ? `translate(${(3.5 * Math.cos(angle(k))).toFixed(2)}px, ${(3.5 * Math.sin(angle(k))).toFixed(2)}px)` : null}
							onclick={() => causir(l)}
						/>
					{/each}
				</g>
			</svg>
			<div class="roda" style:transform="rotate({rot}deg)">
				{#each lenguas as l, k (l)}
					<button
						type="button"
						role="radio"
						aria-checked={l === causida}
						aria-label={nomLenga(l)}
						title={nomLenga(l)}
						class="lg"
						class:causida={l === causida}
						style:left="{40 + 29.5 * Math.cos(angle(k)) - 9}px"
						style:top="{40 + 29.5 * Math.sin(angle(k)) - 9}px"
						onclick={() => causir(l)}
					>
						<span class="drech" style:transform="rotate({-rot}deg)">{@render pastilha(l)}</span>
					</button>
				{/each}
			</div>
			{#key causida}<span class="centre" aria-hidden="true">{còdi(causida)}</span>{/key}
		</div>
	{/if}
	{#key causida}<span class="nom-lenga">{nomLenga(causida)}</span>{/key}
</div>

<style>
	.tria {
		--ressòrt: cubic-bezier(0.34, 1.5, 0.5, 1);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		outline: none;
	}
	.lg {
		position: absolute;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		cursor: pointer;
		line-height: 0;
	}
	.lg:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.pastilha {
		display: block;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
	}
	.drech {
		display: block;
		width: 100%;
		height: 100%;
		transition: transform 0.56s var(--ressòrt);
	}
	.nom-lenga {
		font: 600 0.6875rem/1.2 var(--font-body);
		letter-spacing: 0.04em;
		color: var(--t-aur-clar);
		animation: aparéisser 0.35s ease-out;
	}
	@keyframes aparéisser {
		from {
			opacity: 0;
			transform: translateY(-3px);
		}
	}

	/* A. Lo cadran */
	.cadran {
		position: relative;
		width: 72px;
		height: 72px;
	}
	.pista {
		position: absolute;
		inset: 6px;
		border-radius: 50%;
		border: 1px solid var(--t-linha);
		background: radial-gradient(circle, color-mix(in srgb, var(--t-fons) 70%, transparent) 40%, transparent 72%);
	}
	.cadran .roda {
		position: absolute;
		inset: 0;
		transition: transform 0.56s var(--ressòrt);
	}
	.cadran .lg {
		width: 24px;
		height: 24px;
		transition:
			transform 0.4s var(--ressòrt),
			opacity 0.3s ease;
		transform: scale(0.82);
		opacity: 0.72;
	}
	.cadran .lg.causida {
		transform: scale(1.18);
		opacity: 1;
	}
	.cadran .lg:hover {
		opacity: 1;
	}
	.osca {
		position: absolute;
		left: 50%;
		bottom: -7px;
		width: 0;
		height: 0;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-bottom-color: var(--t-aur);
	}

	/* B. La colomna */
	.colomna {
		position: relative;
		width: 34px;
		border-radius: 17px;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--t-fons) 60%, transparent);
	}
	.lotjament {
		position: absolute;
		left: 2px;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		box-shadow:
			0 0 0 1.5px var(--t-aur),
			inset 0 0 8px color-mix(in srgb, var(--t-aur) 45%, transparent);
	}
	.pols {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		animation: pols 0.6s ease-out 0.3s both;
	}
	@keyframes pols {
		from {
			box-shadow: 0 0 0 0 color-mix(in srgb, var(--t-aur) 70%, transparent);
		}
		to {
			box-shadow: 0 0 0 9px transparent;
		}
	}
	.colomna .lg {
		left: 5px;
		width: 22px;
		height: 22px;
		transition:
			top 0.46s var(--ressòrt),
			transform 0.4s var(--ressòrt),
			opacity 0.3s ease;
		transform: scale(0.86);
		opacity: 0.7;
	}
	.colomna .lg.causida {
		transform: scale(1.04);
		opacity: 1;
	}
	.colomna .lg:hover {
		opacity: 1;
	}

	/* C. Lo camembèrt */
	.camembert {
		position: relative;
		width: 80px;
		height: 80px;
	}
	.parts {
		position: absolute;
		inset: 0;
		overflow: visible;
	}
	.roda-svg {
		transition: transform 0.6s var(--ressòrt);
	}
	.part {
		fill-opacity: 0.28;
		stroke: transparent;
		stroke-width: 1.2;
		cursor: pointer;
		transition:
			transform 0.45s var(--ressòrt),
			fill-opacity 0.35s ease,
			stroke 0.35s ease;
	}
	.part:hover {
		fill-opacity: 0.45;
	}
	.part.causida {
		fill-opacity: 0.8;
		stroke: var(--t-aur);
	}
	.camembert .roda {
		position: absolute;
		inset: 0;
		pointer-events: none;
		transition: transform 0.6s var(--ressòrt);
	}
	.camembert .lg {
		width: 18px;
		height: 18px;
		pointer-events: auto;
		transition: transform 0.4s var(--ressòrt);
	}
	.camembert .lg.causida {
		transform: scale(1.2);
	}
	.centre {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font: 700 0.8125rem/1 var(--font-body);
		color: var(--t-tinta);
		pointer-events: none;
		animation: aparéisser 0.35s ease-out 0.2s both;
	}

	@media (prefers-reduced-motion: reduce) {
		.tria * {
			transition-duration: 0.01s !important;
			animation: none !important;
		}
	}
</style>
