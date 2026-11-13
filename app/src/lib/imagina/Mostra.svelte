<script module>
	// La règle : un élément caché qui mesure une ligne dans la vraie police du navigateur (corps 100).
	let regla;
	const memoria = new Map();
	function largor(linha, letra) {
		if (typeof document === 'undefined') return linha.length * letra.larg;
		const clau = letra.familha + '|' + linha;
		if (memoria.has(clau)) return memoria.get(clau);
		if (!regla) {
			regla = document.createElement('span');
			regla.setAttribute('aria-hidden', 'true');
			regla.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre;font-size:100px;line-height:1;letter-spacing:0';
			document.body.appendChild(regla);
		}
		regla.style.fontFamily = letra.familha;
		regla.style.fontWeight = letra.pes;
		regla.style.fontStretch = letra.estirament;
		regla.textContent = linha;
		const v = regla.getBoundingClientRect().width / 100 || linha.length * letra.larg;
		memoria.set(clau, v);
		return v;
	}
</script>

<script>
	// Esquisse à plat d'un style (estils.js) avec un texte, dans un bloc de l × h pixels. Elle sert d'échantillon
	// dans le choix du style et, déformée par la page (matrix3d), d'aperçu couché sur le mur. Ce n'est pas le
	// montage : ni lumière ni grain, seulement les couleurs, la lettre et le liseré.
	import { LETRAS, compausar } from './estils.js';

	let { estil, text = '', l = 180, h = 100 } = $props();

	const letra = $derived(LETRAS[estil.letra]);
	const c = $derived(compausar(text, estil, l, h, (linha) => largor(linha, letra)));
</script>

<span
	class="mostra"
	style:width="{l}px"
	style:height="{h}px"
	style:background={estil.fons ?? 'transparent'}
	style:color={estil.tinta}
	style:border-radius="{(estil.corn ?? 0) * h}px"
	style:font-family={letra.familha}
	style:font-weight={letra.pes}
	style:font-stretch={letra.estirament}
>
	{#if estil.orla}
		<span class="orla" style:inset="{0.055 * h}px" style:border-width="{Math.max(1, 0.022 * h)}px" style:border-color={estil.orla} style:border-radius="{Math.max(0, (estil.corn ?? 0) - 0.035) * h}px"
		></span>
	{/if}
	<span class="linhas" style:font-size="{c.talha}px" style:line-height={c.interlinha}>
		{#each c.linhas as linha, i (i)}<span>{linha}</span>{/each}
	</span>
</span>

<style>
	.mostra {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		overflow: hidden;
		letter-spacing: 0;
	}
	.orla {
		position: absolute;
		border-style: solid;
	}
	.linhas {
		display: flex;
		flex-direction: column;
		align-items: center;
		white-space: pre;
	}
</style>
