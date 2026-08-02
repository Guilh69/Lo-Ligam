<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import LocationAutocomplete from '$lib/components/LocationAutocomplete.svelte';

	// Copie temporaire de /compte/questionnaire, sans le contrôle de
	// connexion, pour vérifier l'interface sans créer de compte à
	// chaque fois. Ne touche pas à Supabase — à supprimer une fois les
	// vérifications faites.

	const pcsCategories = [
		{ value: 'agriculteurs', oc: 'Agricultors exploitants', fr: 'Agriculteurs exploitants' },
		{
			value: 'artisans',
			oc: 'Artisans, comerçants e caps d’empresa',
			fr: 'Artisans, commerçants et chefs d’entreprise'
		},
		{
			value: 'cadres',
			oc: 'Quadres e professions intellectualas superioras',
			fr: 'Cadres et professions intellectuelles supérieures'
		},
		{
			value: 'intermediaires',
			oc: 'Professions intermediàrias',
			fr: 'Professions intermédiaires'
		},
		{ value: 'employes', oc: 'Emplegats', fr: 'Employés' },
		{ value: 'ouvriers', oc: 'Obrièrs', fr: 'Ouvriers' },
		{ value: 'retraites', oc: 'Retirats', fr: 'Retraités' },
		{
			value: 'sans_activite',
			oc: 'Autras personas sens activitat professionala',
			fr: 'Autres personnes sans activité professionnelle'
		}
	];

	let pseudo = $state('');
	let gender = $state('');
	let ageBracket = $state('');
	let profession = $state('');
	let location = $state('');
	let interest = $state('');
	let interestOther = $state('');
	let submitted = $state(null);

	function submit() {
		submitted = {
			pseudo: pseudo.trim(),
			gender: gender || null,
			age_bracket: ageBracket || null,
			profession: profession || null,
			location: location.trim() || null,
			interest: interest || null,
			interest_other: interest === 'autra' ? interestOther.trim() || null : null
		};
	}
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	<p class="dev-banner">⚠️ Page de test temporaire — ne touche pas à la base de données, à supprimer après vérification.</p>

	<section class="card">
		<p class="kicker">Abans de començar</p>
		<h1 class="title">Fasèm coneissença</h1>
		<p class="subtitle">
			<em>(Quelques questions rapides — la plupart sont facultatives.)</em>
		</p>

		<form onsubmit={(e) => (e.preventDefault(), submit())}>
			<label>
				Pseudonim <em>(pseudo, obligatòri)</em>
				<input type="text" bind:value={pseudo} maxlength="24" required />
			</label>

			<fieldset>
				<legend>Genre <em>(facultatiu)</em></legend>
				<div class="radio-row">
					<label class="radio"
						><input type="radio" bind:group={gender} value="femna" /> Femna</label
					>
					<label class="radio"><input type="radio" bind:group={gender} value="ome" /> Òme</label>
					<label class="radio"
						><input type="radio" bind:group={gender} value="autra" /> Autra</label
					>
					<label class="radio"
						><input type="radio" bind:group={gender} value="" checked /> Prefèri pas dire</label
					>
				</div>
			</fieldset>

			<label>
				Edat <em>(âge, facultatif)</em>
				<select bind:value={ageBracket}>
					<option value="">Prefèri pas dire</option>
					<option value="15-17">15-17</option>
					<option value="18-24">18-24</option>
					<option value="25-34">25-34</option>
					<option value="35-44">35-44</option>
					<option value="45-54">45-54</option>
					<option value="55-64">55-64</option>
					<option value="65+">65 e mai</option>
				</select>
			</label>

			<label>
				Mestièr <em>(profession, facultatif)</em>
				<select bind:value={profession}>
					<option value="">Prefèri pas dire</option>
					{#each pcsCategories as cat}
						<option value={cat.value}>{cat.oc} ({cat.fr})</option>
					{/each}
				</select>
			</label>

			<label>
				Ont demòras <em>(lieu de vie, facultatif)</em>
				<LocationAutocomplete bind:value={location} />
			</label>

			<fieldset>
				<legend>Qué t'interèssa dins l'occitan ? <em>(facultatif)</em></legend>
				<label class="radio-block">
					<input type="radio" bind:group={interest} value="curiositat" />
					Aprene la lenga per curiositat <em>(par curiosité)</em>
				</label>
				<label class="radio-block">
					<input type="radio" bind:group={interest} value="originas" />
					Renodar amb mas originas <em>(renouer avec mes origines)</em>
				</label>
				<label class="radio-block">
					<input type="radio" bind:group={interest} value="region" />
					Melhor conéisser ma region d'adopcion <em>(mieux connaître ma région d'adoption)</em>
				</label>
				<label class="radio-block">
					<input type="radio" bind:group={interest} value="autra" />
					Autra <em>(autre)</em>
				</label>
				{#if interest === 'autra'}
					<input
						type="text"
						class="interest-other"
						bind:value={interestOther}
						placeholder="Precisa se vòles…"
						maxlength="120"
					/>
				{/if}
			</fieldset>

			<button type="submit" class="btn-primary"> Contunhar <span class="arrow">→</span> </button>
		</form>

		{#if submitted}
			<pre class="result">{JSON.stringify(submitted, null, 2)}</pre>
		{/if}
	</section>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem 1.5rem 4rem;
	}

	.dev-banner {
		max-width: 28rem;
		text-align: center;
		font-size: 0.8rem;
		color: var(--color-brick);
		background: rgba(165, 52, 42, 0.1);
		padding: 0.5rem 0.9rem;
		border-radius: 999px;
	}

	.card {
		width: 100%;
		max-width: 28rem;
		background: white;
		border-radius: 24px;
		padding: 2rem 2.25rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.1);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.kicker {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-teal);
		text-align: center;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 1.9rem;
		font-weight: 700;
		color: var(--color-brick);
		margin: 0;
		text-align: center;
	}

	.subtitle {
		margin: 0 0 0.5rem;
		text-align: center;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--color-text);
	}

	label em {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	input[type='text'],
	input[type='email'],
	select {
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 400;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: var(--color-cream);
		color: var(--color-text);
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--color-teal);
	}

	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	legend {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--color-text);
		padding: 0;
		margin-bottom: 0.15rem;
	}

	legend em {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	.radio-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}

	.radio {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 400;
		font-size: 0.9rem;
	}

	.radio-block {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-weight: 400;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.radio-block em {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	.interest-other {
		margin-top: 0.35rem;
		margin-left: 1.6rem;
	}

	.result {
		margin: 0;
		font-size: 0.78rem;
		background: var(--color-cream);
		padding: 0.75rem;
		border-radius: 10px;
		overflow-x: auto;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 0.9rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		cursor: pointer;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(224, 164, 59, 0.45);
	}

	.btn-primary .arrow {
		display: inline-block;
		margin-left: 0.3rem;
	}

	.btn-primary:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 10px 24px rgba(224, 164, 59, 0.55);
	}

	.btn-primary:active {
		transform: translateY(0) scale(0.97);
		filter: brightness(0.95);
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
