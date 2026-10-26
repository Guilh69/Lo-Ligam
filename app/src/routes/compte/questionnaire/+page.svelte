<script>
	import Icona from '$lib/components/Icona.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import LocationAutocomplete from '$lib/components/LocationAutocomplete.svelte';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	let lang = $derived(langStore.current);

	// Met en avant la langue choisie et relègue l'autre entre parenthèses :
	// l'occitan pour qui lit en français, en espagnol, en anglais ou en catalan,
	// le français pour qui lit en occitan.
	// main(oc, fr, es, en, ca) : le texte dans la langue choisie.
	let main = $derived((oc, fr, es, en, ca) => tria({ oc, fr, es, en, ca }));
	let alt = $derived((oc, fr) => (lang === 'oc' ? fr : oc));
	// message d'erreur : « occitan (français) » comme avant ; dans les autres
	// langues, le texte choisi puis l'occitan entre parenthèses
	function msg(oc, fr, es, en, ca) {
		return lang === 'oc' || lang === 'fr' ? `${oc} (${fr})` : `${tria({ es, en, ca })} (${oc})`;
	}
	let optional = $derived(tria({ oc: 'facultatiu', fr: 'facultatif', es: 'opcional', en: 'optional', ca: 'opcional' }));
	let required = $derived(tria({ oc: 'obligatòri', fr: 'obligatoire', es: 'obligatorio', en: 'required', ca: 'obligatori' }));

	// Groupes socioprofessionnels INSEE (PCS, niveau 1 — les 8 grandes
	// catégories). Facultatif, "Prefèri pas dire" par défaut.
	const pcsCategories = [
		{ value: 'agriculteurs', oc: 'Agricultors exploitants', fr: 'Agriculteurs exploitants', es: 'Agricultores titulares de explotación', en: 'Farmers', ca: 'Agricultors titulars d’explotació' },
		{
			value: 'artisans',
			oc: 'Artisans, comerçants e caps d’empresa',
			fr: 'Artisans, commerçants et chefs d’entreprise',
			es: 'Artesanos, comerciantes y empresarios',
			en: 'Artisans, tradespeople and business owners',
			ca: 'Artesans, comerciants i empresaris'
		},
		{
			value: 'cadres',
			oc: 'Quadres e professions intellectualas superioras',
			fr: 'Cadres et professions intellectuelles supérieures',
			es: 'Directivos y profesiones intelectuales superiores',
			en: 'Managers and higher intellectual professions',
			ca: 'Quadres i professions intel·lectuals superiors'
		},
		{
			value: 'intermediaires',
			oc: 'Professions intermediàrias',
			fr: 'Professions intermédiaires',
			es: 'Profesiones intermedias',
			en: 'Intermediate professions',
			ca: 'Professions intermèdies'
		},
		{ value: 'employes', oc: 'Emplegats', fr: 'Employés', es: 'Empleados', en: 'Employees', ca: 'Empleats' },
		{ value: 'ouvriers', oc: 'Obrièrs', fr: 'Ouvriers', es: 'Obreros', en: 'Manual workers', ca: 'Obrers' },
		{ value: 'retraites', oc: 'Retirats', fr: 'Retraités', es: 'Jubilados', en: 'Retired people', ca: 'Jubilats' },
		{
			value: 'sans_activite',
			oc: 'Autras personas sens activitat professionala',
			fr: 'Autres personnes sans activité professionnelle',
			es: 'Otras personas sin actividad profesional',
			en: 'Other people with no professional activity',
			ca: 'Altres persones sense activitat professional'
		}
	];

	let checking = $state(true);
	let pseudo = $state('');
	let gender = $state('');
	let ageBracket = $state('');
	let profession = $state('');
	let location = $state('');
	let interest = $state('');
	let interestOther = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	async function waitForAuthReady() {
		if (get(authReady)) return;
		await new Promise((resolve) => {
			const unsubscribe = authReady.subscribe((ready) => {
				if (ready) {
					unsubscribe();
					resolve();
				}
			});
		});
	}

	onMount(async () => {
		await waitForAuthReady();
		const currentSession = get(session);
		if (!currentSession) {
			goto('/compte');
			return;
		}
		const { data } = await supabase
			.from('profiles')
			.select('user_id')
			.eq('user_id', currentSession.user.id)
			.maybeSingle();
		if (data) {
			goto('/aprene');
			return;
		}
		checking = false;
	});

	async function submit() {
		errorMsg = '';
		const currentSession = get(session);
		if (!currentSession) {
			goto('/compte');
			return;
		}
		if (!pseudo.trim()) {
			errorMsg = msg('Cal causir un pseudonim.', 'Il faut choisir un pseudo.', 'Hay que elegir un seudónimo.', 'Please choose a nickname.', 'Cal triar un pseudònim.');
			return;
		}
		loading = true;
		const { error } = await supabase.from('profiles').insert({
			user_id: currentSession.user.id,
			pseudo: pseudo.trim(),
			gender: gender || null,
			age_bracket: ageBracket || null,
			profession: profession.trim() || null,
			location: location.trim() || null,
			interest: interest || null,
			interest_other: interest === 'autra' ? interestOther.trim() || null : null
		});
		loading = false;
		if (error) {
			// refus de la base (supabase-grops-2.sql) : doublon, mot interdit, nom réservé, longueur
			errorMsg = /duplicate|unique/i.test(error.message)
				? msg(
						'Aqueste pseudonim es ja pres, ensaja-n’un autre.',
						'Ce pseudo est déjà pris, essaie-en un autre.',
						'Este seudónimo ya está en uso: prueba con otro.',
						'This nickname is already taken: try another one.',
						'Aquest pseudònim ja està agafat: prova’n un altre.'
					)
				: /pseudo_mot|pseudo_reservat/.test(error.message)
					? msg(
							'Aqueste pseudonim es pas possible, ensaja-n’un autre.',
							'Ce pseudo n’est pas possible, essaie-en un autre.',
							'Este seudónimo no es posible: prueba con otro.',
							'This nickname is not possible: try another one.',
							'Aquest pseudònim no és possible: prova’n un altre.'
						)
					: /pseudo_longor/.test(error.message)
						? msg(
								'Lo pseudonim fa de 2 a 30 letras.',
								'Le pseudo fait de 2 à 30 lettres.',
								'El seudónimo debe tener entre 2 y 30 letras.',
								'The nickname must be between 2 and 30 letters long.',
								'El pseudònim ha de tenir entre 2 i 30 lletres.'
							)
						: msg(
								'Una error : torna ensajar.',
								'Une erreur, réessaie.',
								'Ha habido un error: inténtalo de nuevo.',
								'Something went wrong: please try again.',
								'Hi ha hagut un error: torna-ho a provar.'
							);
			return;
		}
		goto('/aprene');
	}
</script>

<svelte:head>
	<title>{main('Fasèm coneissença', 'Faisons connaissance', 'Vamos a conocernos', 'Let’s get to know each other', 'Anem a conèixer-nos')} · Lo Ligam</title>
</svelte:head>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	{#if !checking}
		<section class="card">
			<p class="kicker">{main('Abans de començar', 'Avant de commencer', 'Antes de empezar', 'Before we start', 'Abans de començar')}</p>
			<h1 class="title">{main('Fasèm coneissença', 'Faisons connaissance', 'Vamos a conocernos', 'Let’s get to know each other', 'Anem a conèixer-nos')}</h1>
			<p class="subtitle">
				<em
					>({main(
						'Qualques questions rapidas — la màger part son facultativas.',
						'Quelques questions rapides — la plupart sont facultatives.',
						'Unas preguntas rápidas: la mayoría son opcionales.',
						'A few quick questions: most of them are optional.',
						'Unes quantes preguntes ràpides: la majoria són opcionals.'
					)})</em
				>
			</p>

			<form onsubmit={(e) => (e.preventDefault(), submit())}>
				<label>
					{main('Pseudonim', 'Pseudonyme', 'Seudónimo', 'Nickname', 'Pseudònim')}
					<em>({alt('Pseudonim', 'Pseudonyme')} · {required})</em>
					<input type="text" bind:value={pseudo} minlength="2" maxlength="24" required aria-describedby="pseudo-vist" />
					<small id="pseudo-vist">{main('Los membres de tos grops lo veiràn.', 'Les membres de tes groupes le verront.', 'Las personas de tus grupos lo verán.', 'The members of your groups will see it.', 'Les persones dels teus grups el veuran.')}</small>
				</label>

				<fieldset>
					<legend>{main('Genre', 'Genre', 'Género', 'Gender', 'Gènere')} <em>({optional})</em></legend>
					<div class="radio-row">
						<label class="radio"
							><input type="radio" bind:group={gender} value="femna" />
							{main('Femna', 'Femme', 'Mujer', 'Woman', 'Dona')}</label
						>
						<label class="radio"
							><input type="radio" bind:group={gender} value="ome" /> {main('Òme', 'Homme', 'Hombre', 'Man', 'Home')}</label
						>
						<label class="radio"
							><input type="radio" bind:group={gender} value="autra" />
							{main('Autra', 'Autre', 'Otro', 'Other', 'Altre')}</label
						>
						<label class="radio"
							><input type="radio" bind:group={gender} value="" checked />
							{main('Prefèri pas dire', 'Je préfère ne pas dire', 'Prefiero no decirlo', 'I’d rather not say', 'Prefereixo no dir-ho')}</label
						>
					</div>
				</fieldset>

				<label>
					{main('Edat', 'Âge', 'Edad', 'Age', 'Edat')} <em>({alt('Edat', 'âge')} · {optional})</em>
					<select bind:value={ageBracket}>
						<option value="">{main('Prefèri pas dire', 'Je préfère ne pas dire', 'Prefiero no decirlo', 'I’d rather not say', 'Prefereixo no dir-ho')}</option>
						<option value="15-17">15-17</option>
						<option value="18-24">18-24</option>
						<option value="25-34">25-34</option>
						<option value="35-44">35-44</option>
						<option value="45-54">45-54</option>
						<option value="55-64">55-64</option>
						<option value="65+">{main('65 e mai', '65 et plus', '65 y más', '65 and over', '65 i més')}</option>
					</select>
				</label>

				<label>
					{main('Mestièr', 'Profession', 'Profesión', 'Occupation', 'Professió')} <em>({alt('Mestièr', 'profession')} · {optional})</em>
					<select bind:value={profession}>
						<option value="">{main('Prefèri pas dire', 'Je préfère ne pas dire', 'Prefiero no decirlo', 'I’d rather not say', 'Prefereixo no dir-ho')}</option>
						{#each pcsCategories as cat}
							<option value={cat.value}
								>{main(cat.oc, cat.fr, cat.es, cat.en, cat.ca)} ({alt(cat.oc, cat.fr)})</option
							>
						{/each}
					</select>
				</label>

				<label>
					{main('Ont demòras', 'Où tu vis', 'Dónde vives', 'Where you live', 'On vius')}
					<em>({alt('Ont demòras', 'lieu de vie')} · {optional})</em>
					<LocationAutocomplete bind:value={location} />
				</label>

				<fieldset>
					<legend>
						{main(
							"Qué t'interèssa dins l'occitan ?",
							"Qu'est-ce qui t'intéresse dans l'occitan ?",
							'¿Qué te interesa del occitano?',
							'What interests you about Occitan?',
							'Què t’interessa de l’occità?'
						)}
						<em>({optional})</em>
					</legend>
					<label class="radio-block">
						<input type="radio" bind:group={interest} value="curiositat" />
						{main('Aprene la lenga per curiositat', 'Apprendre la langue par curiosité', 'Aprender la lengua por curiosidad', 'Learning the language out of curiosity', 'Aprendre la llengua per curiositat')}
						<em>({alt('per curiositat', 'par curiosité')})</em>
					</label>
					<label class="radio-block">
						<input type="radio" bind:group={interest} value="originas" />
						{main('Renodar amb mas originas', 'Renouer avec mes origines', 'Reconectar con mis orígenes', 'Reconnecting with my roots', 'Reconnectar amb els meus orígens')}
						<em>({alt('mas originas', 'mes origines')})</em>
					</label>
					<label class="radio-block">
						<input type="radio" bind:group={interest} value="region" />
						{main(
							"Melhor conéisser ma region d'adopcion",
							"Mieux connaître ma région d'adoption",
							'Conocer mejor mi región de adopción',
							'Getting to know my adopted region better',
							'Conèixer millor la meva regió d’adopció'
						)}
						<em>({alt("region d'adopcion", "région d'adoption")})</em>
					</label>
					<label class="radio-block">
						<input type="radio" bind:group={interest} value="autra" />
						{main('Autra', 'Autre', 'Otro', 'Other', 'Altre')} <em>({alt('Autra', 'autre')})</em>
					</label>
					{#if interest === 'autra'}
						<input
							type="text"
							class="interest-other"
							aria-label={main('Precisa', 'Précise', 'Precisa', 'Specify', 'Precisa')}
							bind:value={interestOther}
							placeholder={main('Precisa se vòles…', 'Précise si tu veux…', 'Precisa si quieres…', 'Specify if you like…', 'Precisa si vols…')}
							maxlength="120"
						/>
					{/if}
				</fieldset>

				{#if errorMsg}<p class="msg error" role="alert">{errorMsg}</p>{/if}

				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? '…' : main('Contunhar', 'Continuer', 'Continuar', 'Continue', 'Continua')} <span class="arrow"><Icona nom="suivant" /></span>
				</button>
			</form>
		</section>
	{/if}
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
		border: 1.5px solid rgba(58, 42, 32, 0.55); /* contraste 3:1 (WCAG 1.4.11) */
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

	.msg {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		padding: 0.6rem 0.8rem;
		border-radius: 10px;
	}

	.msg.error {
		background: rgba(165, 52, 42, 0.1);
		color: var(--color-brick);
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
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
		box-shadow: 0 6px 18px rgba(181, 61, 23, 0.35);
	}

	.btn-primary .arrow {
		display: inline-block;
		margin-left: 0.3rem;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 10px 24px rgba(181, 61, 23, 0.45);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0) scale(0.97);
		filter: brightness(0.95);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: default;
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
