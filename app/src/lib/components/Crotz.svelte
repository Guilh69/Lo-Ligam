<script>
	// La crotz-constellacion del lògo (geometria de favicon.svg, normalizada).
	// Colors : las dels lògos de Romain e pas d'autras (2026-10-21) : per defaut
	// las del tèma (--logo-* dins app.css) ; `teula` = lo lògo complet, teula
	// bricalha, traçats blancs, pomètas aur clar, moieu aur (carrat-color),
	// a las proporcions de favicon.svg.
	let {
		talha = 32,
		teula = false,
		traç = 'var(--logo-traç)',
		ponch = 'var(--logo-ponch)',
		moieu = 'var(--logo-moieu)'
	} = $props();
	const m = $derived(teula ? 1.366 : 1.25);
	const cT = $derived(teula ? '#ffffff' : traç);
	const cP = $derived(teula ? '#ffd47f' : ponch);
	const cM = $derived(teula ? '#eeaf34' : moieu);
</script>

<svg viewBox="{-m} {-m} {2 * m} {2 * m}" width={talha} height={talha} aria-hidden="true" focusable="false">
	{#if teula}<rect x={-m} y={-m} width={2 * m} height={2 * m} rx="0.466" fill="#b53d17" />{/if}
	<g fill="none" stroke-linecap="round" style="stroke: {cT}">
		<path d="M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797" stroke-width="0.063" />
		<path d="M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48" stroke-width="0.07" />
	</g>
	<g style="fill: {cP}">
		<circle cx="0" cy="0" r="0.124" style="fill: {cM}" />
		<circle cx="0" cy="-1" r="0.109" />
		<circle cx="0.486" cy="-0.797" r="0.109" />
		<circle cx="0.809" cy="-0.48" r="0.109" />
		<circle cx="1" cy="0" r="0.109" />
		<circle cx="0.809" cy="0.48" r="0.109" />
		<circle cx="0.486" cy="0.797" r="0.109" />
		<circle cx="0" cy="0.992" r="0.109" />
		<circle cx="-0.468" cy="0.797" r="0.109" />
		<circle cx="-0.786" cy="0.48" r="0.109" />
		<circle cx="-0.976" cy="0.009" r="0.109" />
		<circle cx="-0.786" cy="-0.48" r="0.109" />
		<circle cx="-0.468" cy="-0.797" r="0.109" />
	</g>
</svg>
