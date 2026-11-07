<script>
	// « Retoucher les couleurs » : le panneau qui change la palette d'une page
	// d'essai en direct et dit si elle est accordée (Romain, 2026-11-07 : « je dois
	// pouvoir changer les couleurs directement sur la page »). Il ne garde rien
	// d'autre que ce que la page lui donne : les rôles du thème affiché, le verdict
	// de coherence.js, et des événements (changer une couleur, accorder, rétablir).
	// Ses propres couleurs sont fixes (--o-*) pour rester lisibles quelle que soit
	// la palette essayée.
	import { ROLES } from './pistes.js';
	import { contraste, meilleurTexte, hexValide } from './coherence.js';

	let { roles, mode, analyse, nomPiste, onchange, onmode, onaccorder, onretablir, oncopier, message = '' } = $props();

	let ouvert = $state(false);

	const groupes = ['Base', 'Boutons', 'Accents', 'Textes posés sur une pièce'];

	const virgule = (n) => n.toFixed(1).replace('.', ',');

	// le contraste utile à côté de chaque couleur : le texte qu'elle porte, ou celui qu'elle reçoit
	function ratioDe(cle, r) {
		const sur = (f) => contraste(meilleurTexte(f, r.surSombre, r.surClair), f);
		if (cle === 'texte') return contraste(r.texte, r.fond);
		if (cle === 'valeur') return contraste(r.valeur, r.fond);
		if (['action', 'choisi', 'juste', 'carton'].includes(cle)) return sur(r[cle]);
		return null;
	}

	function saisie(cle, e, i = null) {
		let v = e.currentTarget.value.trim();
		if (v && !v.startsWith('#')) v = '#' + v;
		if (hexValide(v)) onchange(cle, v.toLowerCase(), i);
		else e.currentTarget.value = i === null ? roles[cle] : roles.tuiles[i];
	}
</script>

<aside class="outil" class:ouvert aria-label="Retoucher les couleurs">
	<button type="button" class="bascule" aria-expanded={ouvert} onclick={() => (ouvert = !ouvert)}>
		<span class="pastille" style="background:{roles.action}"></span>
		Retoucher les couleurs · <strong>{analyse.verdict}</strong>
	</button>

	<div class="corps">
		<header class="tete">
			<h2>Retoucher les couleurs</h2>
			<p class="piste">{nomPiste}</p>
			<div class="mode" role="group" aria-label="Thème affiché">
				<button type="button" aria-pressed={mode === 'clair'} onclick={() => onmode('clair')}>Clair</button>
				<button type="button" aria-pressed={mode === 'sombre'} onclick={() => onmode('sombre')}>Sombre</button>
			</div>
		</header>

		<section class="verdict" aria-live="polite">
			<p class="etiquette" data-v={analyse.verdict === 'Accordée' ? 'bon' : analyse.verdict === 'À revoir' ? 'mal' : 'moyen'}>
				{analyse.verdict}
			</p>
			{#if analyse.alertes.length}
				<ul class="alertes">
					{#each analyse.alertes as a (a)}<li><span aria-hidden="true">⚠</span> {a}</li>{/each}
				</ul>
			{/if}
			{#if analyse.bons.length}
				<ul class="bons">
					{#each analyse.bons as b (b)}<li><span aria-hidden="true">✓</span> {b}</li>{/each}
				</ul>
			{/if}
			{#if analyse.notes.length}
				<ul class="notes">
					{#each analyse.notes as n (n)}<li>{n}</li>{/each}
				</ul>
			{/if}
		</section>

		{#each groupes as g (g)}
			<fieldset class="groupe">
				<legend>{g}</legend>
				{#each ROLES.filter((x) => x.groupe === g) as role (role.cle)}
					{@const ratio = ratioDe(role.cle, roles)}
					<div class="ligne">
						<input type="color" id="c-{role.cle}" value={roles[role.cle]} oninput={(e) => onchange(role.cle, e.currentTarget.value)} />
						<label for="c-{role.cle}">{role.nom}</label>
						<input class="hex" type="text" value={roles[role.cle]} maxlength="7" spellcheck="false" aria-label="{role.nom}, code hexadécimal" onchange={(e) => saisie(role.cle, e)} />
						{#if ratio !== null}
							<span class="ratio" data-ok={ratio >= 4.5} title="Contraste du texte, 4,5 requis">{virgule(ratio)}{ratio >= 4.5 ? ' ✓' : ' ✗'}</span>
						{:else}<span class="ratio"></span>{/if}
					</div>
				{/each}
			</fieldset>
		{/each}

		<fieldset class="groupe">
			<legend>Tuiles (S’apren, familles de jeux)</legend>
			<div class="tuiles">
				{#each roles.tuiles as t, i (i)}
					<div class="tuile-ligne">
						<input type="color" aria-label="Tuile {i + 1}" value={t} oninput={(e) => onchange('tuiles', e.currentTarget.value, i)} />
						<input class="hex" type="text" value={t} maxlength="7" spellcheck="false" aria-label="Tuile {i + 1}, code hexadécimal" onchange={(e) => saisie('tuiles', e, i)} />
					</div>
				{/each}
			</div>
			<button type="button" class="second" onclick={onaccorder}>Accorder et tamiser les tuiles</button>
		</fieldset>

		<details class="detail">
			<summary>Détail des contrastes</summary>
			<table>
				<tbody>
					{#each analyse.contrastes as c (c.nom)}
						<tr data-ok={c.ok}>
							<th scope="row">{c.nom}</th>
							<td>{virgule(c.ratio)}</td>
							<td>{c.ok ? '✓' : '✗ (4,5 requis)'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mini">
				Fond : {analyse.fond.nom}, teinte {Math.round(analyse.fond.H)}°, intensité {analyse.fond.C.toFixed(3)}.
				Daltonisme, écart action / juste : {analyse.dalt.map((d) => `${d.type} ${d.ecart.toFixed(0)}`).join(', ')} (au moins 10 pour les distinguer).
			</p>
		</details>

		<div class="pied">
			<p class="message" aria-live="polite">{message}</p>
			<div class="actions">
				<button type="button" class="second" onclick={onretablir}>Rétablir la piste</button>
				<button type="button" class="premier" onclick={oncopier}>Copier ma palette</button>
			</div>
		</div>
	</div>
</aside>

<style>
	.outil {
		--o-fons: #ffffff;
		--o-texte: #1d1b1a;
		--o-texte-2: #55504c;
		--o-filet: #d6d2ce;
		--o-fort: #1d1b1a;
		--o-bon: #1d6b34;
		--o-mal: #a3261a;
		--o-moyen: #7a4d00;
		position: fixed;
		inset: auto 0 0 0;
		z-index: 60;
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		background: var(--o-fons);
		color: var(--o-texte);
		border-top: 1px solid var(--o-filet);
		box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.18);
		font: 400 0.875rem/1.4 system-ui, sans-serif;
	}
	.bascule {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-height: 48px;
		padding: 0.5rem 1rem;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.pastille {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		border: 1px solid var(--o-filet);
	}
	.corps {
		display: none;
		overflow: auto;
		padding: 0 1rem;
	}
	.ouvert .corps {
		display: block;
	}
	h2 {
		margin: 0;
		font: 700 1.05rem system-ui, sans-serif;
	}
	.tete {
		display: grid;
		gap: 0.4rem;
		padding: 0.4rem 0 0.8rem;
	}
	.piste {
		margin: 0;
		color: var(--o-texte-2);
	}
	.mode {
		display: inline-flex;
		width: fit-content;
		border: 1px solid var(--o-fort);
		border-radius: 8px;
		overflow: hidden;
	}
	.mode button {
		min-height: 36px;
		padding: 0 1rem;
		border: 0;
		background: var(--o-fons);
		color: var(--o-texte);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.mode button[aria-pressed='true'] {
		background: var(--o-fort);
		color: var(--o-fons);
	}
	.verdict {
		padding: 0.7rem 0.8rem;
		margin-bottom: 0.8rem;
		border: 1px solid var(--o-filet);
		border-radius: 10px;
	}
	.etiquette {
		margin: 0 0 0.4rem;
		font: 700 1rem system-ui, sans-serif;
	}
	.etiquette[data-v='bon'] {
		color: var(--o-bon);
	}
	.etiquette[data-v='mal'] {
		color: var(--o-mal);
	}
	.etiquette[data-v='moyen'] {
		color: var(--o-moyen);
	}
	.verdict ul {
		margin: 0.3rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.3rem;
	}
	.alertes {
		color: var(--o-mal);
	}
	.bons {
		color: var(--o-bon);
	}
	.notes {
		color: var(--o-texte-2);
	}
	.groupe {
		margin: 0 0 0.8rem;
		padding: 0;
		border: 0;
	}
	.groupe legend {
		padding: 0;
		margin-bottom: 0.3rem;
		font-weight: 700;
		color: var(--o-texte-2);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.72rem;
	}
	.ligne {
		display: grid;
		grid-template-columns: 2.2rem 1fr 5.2rem 3.4rem;
		align-items: center;
		gap: 0.5rem;
		padding: 0.15rem 0;
	}
	input[type='color'] {
		width: 2.2rem;
		height: 2.2rem;
		padding: 0;
		border: 1px solid var(--o-fort);
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
	}
	.hex {
		width: 100%;
		min-height: 2.2rem;
		padding: 0 0.4rem;
		border: 1px solid var(--o-filet);
		border-radius: 6px;
		font: 500 0.82rem ui-monospace, Consolas, monospace;
		color: var(--o-texte);
		background: var(--o-fons);
	}
	.ratio {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		white-space: nowrap;
		text-align: right;
	}
	.ratio[data-ok='true'] {
		color: var(--o-bon);
	}
	.ratio[data-ok='false'] {
		color: var(--o-mal);
	}
	.tuiles {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.4rem 0.8rem;
		margin-bottom: 0.5rem;
	}
	.tuile-ligne {
		display: grid;
		grid-template-columns: 2.2rem 1fr;
		gap: 0.4rem;
		align-items: center;
	}
	button.second,
	button.premier {
		min-height: 40px;
		padding: 0 1rem;
		border-radius: 8px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid var(--o-fort);
		background: var(--o-fons);
		color: var(--o-texte);
	}
	button.premier {
		background: var(--o-fort);
		color: var(--o-fons);
	}
	/* les deux boutons restent visibles en bas du panneau, quelle que soit sa hauteur */
	.pied {
		position: sticky;
		bottom: 0;
		margin: 0.6rem -1rem 0;
		padding: 0.6rem 1rem 0.8rem;
		background: var(--o-fons);
		border-top: 1px solid var(--o-filet);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.message {
		min-height: 1.4em;
		margin: 0 0 0.4rem;
		color: var(--o-bon);
		font-weight: 600;
	}
	.detail {
		margin: 0.4rem 0 0.8rem;
	}
	.detail summary {
		cursor: pointer;
		font-weight: 600;
	}
	table {
		width: 100%;
		margin-top: 0.4rem;
		border-collapse: collapse;
		font-size: 0.82rem;
	}
	th,
	td {
		padding: 0.15rem 0.3rem;
		border-bottom: 1px solid var(--o-filet);
		text-align: left;
		font-weight: 400;
	}
	td {
		font-variant-numeric: tabular-nums;
	}
	tr[data-ok='false'] {
		color: var(--o-mal);
	}
	.mini {
		color: var(--o-texte-2);
		font-size: 0.8rem;
	}
	input:focus-visible,
	button:focus-visible,
	summary:focus-visible {
		outline: 3px solid #0b63c8;
		outline-offset: 2px;
	}

	/* ordinateur : le panneau est une colonne à droite, toujours ouverte */
	@media (min-width: 64rem) {
		.outil {
			position: sticky;
			inset: auto;
			top: 0;
			align-self: start;
			width: 23rem;
			height: 100vh;
			max-height: 100vh;
			border-top: 0;
			border-left: 1px solid var(--o-filet);
			box-shadow: none;
		}
		.bascule {
			display: none;
		}
		.corps {
			display: block;
			padding-top: 1rem;
		}
	}
</style>
