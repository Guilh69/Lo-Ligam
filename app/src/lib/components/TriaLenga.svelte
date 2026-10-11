<script>
	// Lo tria de la lenga d'una ficha de comuna (retorn de Romain, 2026-10-11 :
	// « comme un diagramme avec l'icône basque, occitane et française ; la
	// langue choisie en bas ; un bruit de clic satisfaisant ; une animation
	// soignée »). Prepausas a ensajar, una sola demorarà :
	//   d : lo cadran-camembèrt (l'anèl colorat, la lenga causida en bas) ;
	//   e : la bossòla : meteis anèl, que dança coma una agulha avant de se pausar ;
	//   f : lo manètge : los emblèmas viran sus una ellipsi vista de biais ;
	//   g : la ròda : un torn de mai al primièr còp, una lengueta que fa tic-tic ;
	//   h : los onglets : la forma pus foncionala (nom de cada lenga dins sa
	//       lenga, reaccion immediata), coma lo boton Òc / Fr del site.
	// Las autras (cadran, colomna, camembèrt) son pas estadas retengudas.
	import { untrack } from 'svelte';
	import { sonClic } from '$lib/carta/sons.js';

	let { lenguas = [], causida, onCausir, varianta = 'd', nomLenga = (l) => l, còdi = (l) => l, etiqueta = '' } = $props();

	// lo nom de cada lenga dins sa lenga (las bonas practicas : un visitaire
	// reconeis sa lenga a son nom, pas a una bandièra)
	const ENDO = {
		oc: 'Occitan',
		fr: 'Français',
		eu: 'Euskara',
		ca: 'Català',
		frp: 'Arpetan',
		br: 'Brezhoneg',
		als: 'Elsässisch',
		lb: 'Lëtzebuergesch',
		pfl: 'Pälzisch',
		ksh: 'Ripoarisch',
		li: 'Limburgs',
		vls: 'West-Vlams',
		nl: 'Nederlands',
		co: 'Corsu',
		pcd: 'Picard',
		wa: 'Walon',
		nrm: 'Nouormand'
	};
	const endo = (l) => ENDO[l] ?? nomLenga(l);
	const títol = (l) => (endo(l) === nomLenga(l) ? endo(l) : `${endo(l)} · ${nomLenga(l)}`);

	const n = $derived(lenguas.length);
	const idx = $derived(Math.max(0, lenguas.indexOf(causida)));
	const pas = $derived(360 / Math.max(n, 1));
	const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	// La rotacion : rot es la cibla (se garda d'un clic a l'autre, pel camin
	// pus cort) ; vis es l'angle afichat (bossòla, manètge, ròda : menat a
	// cada imatge ; lo cadran passa per una transicion CSS)
	let rot = $state(0),
		vis = $state(0),
		flap = $state(0),
		vel = $state(0),
		clauLenguas = '';
	let raf = 0,
		mov = null,
		primièr = true;
	$effect(() => {
		const k = lenguas.join(',');
		if (k !== clauLenguas) {
			clauLenguas = k;
			cancelAnimationFrame(raf);
			raf = 0;
			rot = vis = -idx * pas;
			vel = 0;
			flap = 0;
			primièr = true;
		}
	});

	// (una autra prepausa : part de la lenga causida, sens movement)
	$effect(() => {
		varianta;
		untrack(() => {
			cancelAnimationFrame(raf);
			raf = 0;
			mov = null;
			vis = rot;
			vel = 0;
		});
	});

	function causir(l) {
		const j = lenguas.indexOf(l);
		if (j < 0 || l === causida) return;
		let d = (((j - idx) % n) + n) % n;
		if (d > n / 2) d -= n;
		onCausir?.(l);
		if (varianta === 'h') {
			rot = vis = -j * pas;
			return sonClic(0.85);
		}
		rot -= d * pas;
		if (calm()) {
			vis = rot;
			return sonClic(1);
		}
		if (varianta === 'd') {
			// (un cran leugièr per cada lenga passada, puèi lo clic a l'encastre)
			for (let k = 1; k < Math.abs(d); k++) setTimeout(() => sonClic(0.45), (430 * k) / Math.abs(d) - 60);
			setTimeout(() => sonClic(1), 430);
			return;
		}
		if (varianta === 'g') {
			// la ròda : un torn de mai al primièr còp, puèi se pausa en ralentissent
			if (primièr) rot -= 360 * Math.sign(d);
			mov = { t0: performance.now(), de: vis, a: rot, dur: primièr ? 1500 : 720 };
			primièr = false;
		} else mov = { arribat: false, ampli: 0 };
		lançar();
	}
	function clavièr(e) {
		const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
		if (!k) return;
		e.preventDefault();
		causir(lenguas[(idx + k + n) % n]);
	}

	// Lo movement, imatge per imatge
	const RESSÒRT = { e: { k: 150, c: 6.5 }, f: { k: 110, c: 13 } };
	let tPrec = 0;
	const lançar = () => {
		if (raf) return;
		tPrec = performance.now();
		raf = requestAnimationFrame(bocla);
	};
	function bocla(t) {
		raf = 0;
		const dt = Math.min(0.04, Math.max(0.001, (t - tPrec) / 1000));
		tPrec = t;
		const de = vis;
		let viu = true;
		if (varianta === 'g' && mov) {
			const p = Math.min(1, (t - mov.t0) / mov.dur),
				e = 1 - Math.pow(1 - p, 4);
			vis = mov.de + (mov.a - mov.de) * e;
			vel = (vis - de) / dt;
			// las clavilhas entre las parts passan la lengueta : tic, e la lengueta plega
			for (let j = 0; j < n; j++) {
				const b = (j + 0.5) * pas;
				if (Math.floor((b + de) / 360) !== Math.floor((b + vis) / 360)) {
					sonClic(0.38);
					flap = 1;
				}
			}
			if (p >= 1) {
				viu = false;
				sonClic(1);
			}
		} else if (mov) {
			const { k, c } = RESSÒRT[varianta] ?? RESSÒRT.e;
			const err = rot - vis;
			vel += (k * err - c * vel) * dt;
			vis += vel * dt;
			const err2 = rot - vis;
			mov.ampli = Math.max(mov.ampli, Math.abs(err2));
			if (err !== 0 && Math.sign(err2) !== Math.sign(err)) {
				// la cibla passada : lo clic al primièr còp, puèi un tic per cada anada e venguda
				if (!mov.arribat) sonClic(1);
				else if (mov.ampli > 2.5) sonClic(Math.min(0.4, 0.12 + mov.ampli / 40));
				mov.arribat = true;
				mov.ampli = 0;
			}
			// lo manètge : un tic leugièr quand un autre emblèma passa davant
			if (varianta === 'f')
				for (let j = 0; j < n; j++) {
					if (j === idx) continue;
					const a = j * pas;
					if (Math.round((a + de) / 360) !== Math.round((a + vis) / 360)) sonClic(0.3);
				}
			if (Math.abs(err2) < 0.15 && Math.abs(vel) < 4) {
				vis = rot;
				vel = 0;
				viu = false;
			}
		} else viu = false;
		flap *= Math.exp(-dt / 0.07);
		if (flap < 0.01) flap = 0;
		if (viu || flap) raf = requestAnimationFrame(bocla);
		else mov = null;
	}
	$effect(() => () => cancelAnimationFrame(raf));

	// (la rotacion afichada : lo cadran seguís sa cibla per CSS)
	const ang = $derived(varianta === 'd' ? rot : vis);
	const angle = (k) => ((90 + k * pas) * Math.PI) / 180;

	// l'anèl : mièja talha, rais de las parts e dels emblèmas, talha d'un emblèma
	const G = { m: 34, r1: 21, r2: 26, rb: 23.5, b: 18, pop: 2 };
	const COLOR = { oc: '#d9a441', fr: '#4d6fd6', eu: '#2e9e5b', ca: '#e0b021', br: '#b9b9b9', frp: '#3fae6a', als: '#d9534f', co: '#c9c9c9', lb: '#5aa0d8', vls: '#e2c14a', nl: '#e8873a', pcd: '#8fb35a', wa: '#e3c03a', nrm: '#d65a4a' };
	const arc = (k, r1, r2, jaç = 7) => {
		const a0 = ((90 + k * pas - pas / 2 + jaç / 2) * Math.PI) / 180,
			a1 = ((90 + k * pas + pas / 2 - jaç / 2) * Math.PI) / 180,
			gran = pas - jaç > 180 ? 1 : 0;
		const p = (r, a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
		return `M${p(r2, a0)}A${r2} ${r2} 0 ${gran} 1 ${p(r2, a1)}L${p(r1, a1)}A${r1} ${r1} 0 ${gran} 0 ${p(r1, a0)}Z`;
	};

	// lo manètge : l'emblèma k sus l'ellipsi, a sa prigondor (1 = davant, en bas)
	const MAN = { cx: 42, cy: 21, rx: 30, ry: 9, b: 18 };
	const manètge = (k, a, v) => {
		const φ = ((90 + k * pas + a) * Math.PI) / 180,
			p = (1 + Math.sin(φ)) / 2,
			// (los cavals del manètge pujan e davalan quand vira)
			bòt = -Math.min(1, Math.abs(v) / 400) * 3 * Math.sin(a / 9 + k * 2.1);
		return {
			x: MAN.cx + MAN.rx * Math.cos(φ) - MAN.b / 2,
			y: MAN.cy + MAN.ry * Math.sin(φ) - MAN.b / 2 + bòt,
			s: 0.62 + 0.52 * p,
			o: 0.4 + 0.6 * p,
			z: Math.round(p * 10),
			blur: (1 - p) * 1.1
		};
	};

	// los onglets : la pastilha d'or seguís l'onglet causit
	let onglets = $state([]);
	const lusor = $derived.by(() => {
		const b = onglets[idx];
		return b ? { x: b.offsetLeft, w: b.offsetWidth } : null;
	});
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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="tria v-{varianta}" role="radiogroup" aria-label={etiqueta} tabindex="-1" onkeydown={clavièr}>
	{#if varianta === 'h'}
		<!-- H. Los onglets -->
		<div class="onglets">
			{#if lusor}<span class="lusor" style:transform="translateX({lusor.x - 3}px)" style:width="{lusor.w}px" aria-hidden="true"></span>{/if}
			{#each lenguas as l, k (l)}
				<button type="button" role="radio" aria-checked={l === causida} title={nomLenga(l)} class:causida={l === causida} bind:this={onglets[k]} onclick={() => causir(l)}>
					<span class="ic">{@render pastilha(l)}</span><span lang={l}>{endo(l)}</span>
				</button>
			{/each}
		</div>
	{:else if varianta === 'f'}
		<!-- F. Lo manètge -->
		<div class="manetge">
			<span class="plataforma" aria-hidden="true"></span>
			{#each lenguas as l, k (l)}
				{@const p = manètge(k, vis, vel)}
				<button
					type="button"
					role="radio"
					aria-checked={l === causida}
					aria-label={títol(l)}
					title={títol(l)}
					class="lg"
					class:causida={l === causida}
					style:left="{p.x}px"
					style:top="{p.y}px"
					style:transform="scale({p.s})"
					style:opacity={p.o}
					style:z-index={p.z}
					style:filter={p.blur > 0.05 ? `blur(${p.blur.toFixed(2)}px)` : null}
					onclick={() => causir(l)}>{@render pastilha(l)}</button
				>
			{/each}
			<span class="osca" aria-hidden="true"></span>
		</div>
	{:else}
		<!-- D. Lo cadran-camembèrt ; E. la bossòla ; G. la ròda -->
		<div class="anel" style:width="{2 * G.m}px" style:height="{2 * G.m}px">
			<svg class="parts" viewBox="{-G.m} {-G.m} {2 * G.m} {2 * G.m}" aria-hidden="true">
				<g class="roda-svg" style:transform="rotate({ang}deg)">
					{#if varianta === 'e'}
						<!-- (las graduacions de la bossòla) -->
						{#each Array(36) as _, k}
							<line x1="0" y1={-G.r2 - 2.2} x2="0" y2={-G.r2 - (k % 9 === 0 ? 5.5 : 3.6)} transform="rotate({k * 10})" class="grad" class:gran={k % 9 === 0} />
						{/each}
					{/if}
					{#each lenguas as l, k (l)}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<path
							d={arc(k, G.r1, G.r2)}
							fill={COLOR[l] ?? '#888'}
							class="part"
							class:causida={l === causida}
							style:transform={l === causida ? `translate(${(G.pop * Math.cos(angle(k))).toFixed(2)}px, ${(G.pop * Math.sin(angle(k))).toFixed(2)}px)` : null}
							onclick={() => causir(l)}
						/>
						{#if varianta === 'g'}
							<!-- (las clavilhas entre las parts) -->
							<circle cx={(G.r2 + 2.4) * Math.cos(angle(k + 0.5))} cy={(G.r2 + 2.4) * Math.sin(angle(k + 0.5))} r="1.3" class="clavilha" />
						{/if}
					{/each}
				</g>
			</svg>
			<div class="roda" style:transform="rotate({ang}deg)">
				{#each lenguas as l, k (l)}
					<button
						type="button"
						role="radio"
						aria-checked={l === causida}
						aria-label={títol(l)}
						title={títol(l)}
						class="lg"
						class:causida={l === causida}
						style:width="{G.b}px"
						style:height="{G.b}px"
						style:left="{G.m + G.rb * Math.cos(angle(k)) - G.b / 2}px"
						style:top="{G.m + G.rb * Math.sin(angle(k)) - G.b / 2}px"
						onclick={() => causir(l)}
					>
						<span class="drech" style:transform="rotate({-ang}deg)">{@render pastilha(l)}</span>
					</button>
				{/each}
			</div>
			{#key causida}<span class="centre" aria-hidden="true">{còdi(causida)}</span>{/key}
			{#if varianta === 'g'}
				<span class="lengueta" aria-hidden="true" style:transform="rotate({(flap * 26 * (vel > 0 ? 1 : -1)).toFixed(1)}deg)"></span>
			{:else}
				<span class="osca" aria-hidden="true"></span>
			{/if}
		</div>
	{/if}
	{#if varianta !== 'h'}
		{#key causida}<span class="nom-lenga" lang={causida}>{endo(causida)}</span>{/key}
	{/if}
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
	.lg:focus-visible,
	.onglets button:focus-visible {
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
	}
	.nom-lenga {
		margin-top: 10px;
		font: 600 0.6875rem/1.2 var(--font-body);
		letter-spacing: 0.04em;
		color: var(--t-aur-clar);
		white-space: nowrap;
		animation: aparéisser 0.35s ease-out;
	}
	@keyframes aparéisser {
		from {
			opacity: 0;
			transform: translateY(-3px);
		}
	}
	/* la sageta d'or, jos la lenga causida */
	.osca {
		position: absolute;
		left: 50%;
		bottom: -11px;
		width: 0;
		height: 0;
		transform: translateX(-50%);
		border: 4px solid transparent;
		border-width: 4px 4.5px;
		border-bottom-color: var(--t-aur);
	}

	/* L'anèl (D, E, G) */
	.anel {
		position: relative;
	}
	.parts {
		position: absolute;
		inset: 0;
		overflow: visible;
	}
	.part {
		fill-opacity: 0.35;
		stroke: transparent;
		stroke-width: 1.2;
		cursor: pointer;
		transition:
			transform 0.45s var(--ressòrt),
			fill-opacity 0.35s ease,
			stroke 0.35s ease;
	}
	.part:hover {
		fill-opacity: 0.5;
	}
	.part.causida {
		fill-opacity: 0.9;
		stroke: var(--t-aur);
	}
	.anel .roda {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.anel .lg {
		pointer-events: auto;
		transform: scale(0.84);
		opacity: 0.8;
		transition:
			transform 0.4s var(--ressòrt),
			opacity 0.3s ease,
			box-shadow 0.3s ease;
	}
	.anel .lg:hover {
		opacity: 1;
	}
	.anel .lg.causida {
		transform: scale(1.22);
		opacity: 1;
		box-shadow:
			0 0 0 1.5px var(--t-aur),
			0 0 10px color-mix(in srgb, var(--t-aur) 55%, transparent);
	}
	/* (lo cadran vira per CSS ; la bossòla e la ròda, imatge per imatge) */
	.v-g .nom-lenga {
		margin-top: 14px;
	}
	.v-d .roda-svg,
	.v-d .roda,
	.v-d .drech {
		transition: transform 0.56s var(--ressòrt);
	}
	.centre {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font: 700 0.75rem/1 var(--font-body);
		letter-spacing: 0.02em;
		color: var(--t-tinta);
		pointer-events: none;
		animation: aparéisser 0.35s ease-out 0.2s both;
	}
	.grad {
		stroke: color-mix(in srgb, var(--t-tinta) 40%, transparent);
		stroke-width: 0.7;
	}
	.grad.gran {
		stroke: var(--t-aur);
		stroke-width: 1.1;
	}
	.clavilha {
		fill: var(--t-aur-clar);
	}
	/* la lengueta de la ròda, en bas : plega quand una clavilha passa */
	.lengueta {
		position: absolute;
		left: 50%;
		bottom: -16px;
		width: 4px;
		height: 12px;
		margin-left: -2px;
		border-radius: 2px 2px 3px 3px;
		background: linear-gradient(var(--t-aur-clar), var(--t-aur));
		transform-origin: 50% 100%;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	/* F. Lo manètge */
	.manetge {
		position: relative;
		width: 84px;
		height: 44px;
	}
	.plataforma {
		position: absolute;
		left: 6px;
		right: 6px;
		top: 13px;
		height: 22px;
		border-radius: 50%;
		border: 1px solid var(--t-linha);
		background: radial-gradient(ellipse, color-mix(in srgb, var(--t-aur) 10%, transparent), transparent 70%);
	}
	.manetge .lg {
		width: 18px;
		height: 18px;
		transform-origin: 50% 50%;
	}
	.manetge .lg.causida {
		box-shadow:
			0 0 0 1.5px var(--t-aur),
			0 0 10px color-mix(in srgb, var(--t-aur) 55%, transparent);
	}
	.manetge .osca {
		bottom: -9px;
	}

	/* H. Los onglets */
	.v-h {
		align-items: flex-start;
	}
	.onglets {
		position: relative;
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-fons) 55%, transparent);
	}
	.lusor {
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 3px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-aur) 26%, transparent);
		box-shadow: inset 0 0 0 1px var(--t-aur);
		transition:
			transform 0.42s var(--ressòrt),
			width 0.42s var(--ressòrt);
	}
	.onglets button {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 28px;
		padding: 3px 11px 3px 4px;
		border: 0;
		border-radius: 999px;
		background: none;
		color: var(--t-tinta-2);
		font: 600 0.75rem/1 var(--font-body);
		cursor: pointer;
		transition: color 0.3s ease;
	}
	.onglets button:hover,
	.onglets button.causida {
		color: var(--t-tinta);
	}
	.onglets .ic {
		width: 20px;
		height: 20px;
		flex: none;
		transition: transform 0.4s var(--ressòrt);
	}
	.onglets button.causida .ic {
		transform: scale(1.08) rotate(-8deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.tria * {
			transition-duration: 0.01s !important;
			animation: none !important;
		}
	}
</style>
