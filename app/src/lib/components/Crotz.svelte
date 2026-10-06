<script>
	// La crotz-constellacion del lògo (geometria de favicon.svg, normalizada) :
	// traçats e pomètas seguisson las colors del tèma (cadre comun 2026-10-07).
	let { talha = 32, traç = 'var(--t-aur)', ponch = 'var(--t-tinta)', moieu = null } = $props();
</script>

<svg viewBox="-1.25 -1.25 2.5 2.5" width={talha} height={talha} aria-hidden="true" focusable="false">
	<g fill="none" stroke-linecap="round" style="stroke: {traç}">
		<path d="M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797" stroke-width="0.063" />
		<path d="M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48" stroke-width="0.07" />
	</g>
	<g style="fill: {ponch}">
		<circle cx="0" cy="0" r="0.124" style={moieu ? `fill: ${moieu}` : undefined} />
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
