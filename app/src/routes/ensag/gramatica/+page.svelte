<script>
	// Essai d'une fiche de grammaire du wiki (Romain, 2026-11-03 : « inspiration
	// dans le wiki, qui expliquera la grammaire et les règles pour apprendre
	// l'occitan », captures de la grammaire cognitive du CPNL rangées dans
	// design-stock/Inspiration/Gramatica). Une idée par écran ; une couleur par
	// terminaison de l'infinitif, gardée jusque dans les formes conjuguées.
	// Retour de Romain (03-11) : « un peu trop calqué sur le catalan, avec le
	// robot » ; le robot cède la place à l'encart culture des leçons, les
	// cartes prennent les aplats des cases de S'apren, et chaque écran cite
	// sa source (le livre et sa page ; le CPNL pour la forme).
	// Formes reprises de l'A1 (4.1, 5.3) et de la trame (10.2, 10.3, 11.3),
	// vérifiées avec lo Congrès et vèrb'Òc ; occitan à relire par Romain.
	// Page de travail, pas indexée.
	import { fly } from 'svelte/transition';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import NoteBlock from '$lib/lesson/NoteBlock.svelte';

	// l'encart culture du module 4.1, tel quel (texte déjà vérifié)
	const CULTURA = {
		variant: 'culture',
		title: 'Cultura : troubadour, un nom de métier',
		paragraphs: [
			'Le mot « troubadour » vient de l’occitan *trobador* : celui qui compose, de *trobar*, « trouver », un verbe en -ar comme *cantar*. Le français l’a emprunté : sa première trace écrite date de 1575.',
			'Source : TLFi, article « troubadour ».'
		]
	};

	const ECRANS = [
		'L’infinitiu',
		'Lo radical e la terminason',
		'Conjugar un vèrb',
		'Activitat',
		'Resumit'
	];

	// Les trois groupes du livre (Gramatica de l'occitan estandard, p. 63) :
	// -ar ; -ir, avec ou sans -iss- ; -re et -er. La couleur d'une fin vit dans
	// --g-<fin> : -re et -er partagent celle du troisième groupe.
	const GROPS = [
		{ n: '1er', aplat: '#6b3a5b', fins: ['ar'], ex: [['parlar', 'parler'], ['cantar', 'chanter'], ['trabalhar', 'travailler'], ['manjar', 'manger'], ['escotar', 'écouter']] },
		{ n: '2e', aplat: '#55702f', fins: ['ir'], ex: [['legir', 'lire'], ['finir', 'finir'], ['causir', 'choisir'], ['venir', 'venir'], ['sentir', 'sentir']] },
		{ n: '3e', aplat: '#2f6a9c', fins: ['re', 'er'], ex: [['beure', 'boire'], ['vendre', 'vendre'], ['escriure', 'écrire'], ['voler', 'vouloir'], ['poder', 'pouvoir'], ['aver', 'avoir']] }
	];
	const FINS = ['ar', 'ir', 're', 'er'];
	const finDe = (mot) => FINS.find((f) => mot.endsWith(f));

	const COPAS = [
		{ rad: 'parl', fin: 'ar', fr: 'parler', picto: 'parlar' },
		{ rad: 'leg', fin: 'ir', fr: 'lire', picto: 'legir' },
		{ rad: 'vend', fin: 're', fr: 'vendre', picto: 'vendre' },
		{ rad: 'vol', fin: 'er', fr: 'vouloir', picto: 'voler' }
	];

	// Activité : chaque forme a sa personne ; la fin suffit à la trouver
	const PERSONAS = [
		{ id: 'ieu', oc: 'ieu', fr: 'je', rad: 'parl', fin: 'i', g: 'ar', sens: 'je parle', indici: 'la marque -i, c’est ieu' },
		{ id: 'tu', oc: 'tu', fr: 'tu', rad: 'legiss', fin: 'es', g: 'ir', sens: 'tu lis', indici: 'la marque -s, c’est tu' },
		{ id: 'el', oc: 'el, ela', fr: 'il, elle', rad: 'vòl', fin: '', g: 'er', sens: 'il ou elle veut', indici: 'ni -i, ni -s, ni -m, ni -tz, ni -n : c’est el ou ela' },
		{ id: 'nos', oc: 'nosautres, nosautras', fr: 'nous', rad: 'cant', fin: 'am', g: 'ar', sens: 'nous chantons', indici: 'la marque -m, c’est nosautres ou nosautras' },
		{ id: 'vos', oc: 'vosautres, vosautras', fr: 'vous', rad: 'bev', fin: 'ètz', g: 're', sens: 'vous buvez', indici: 'la marque -tz, c’est vosautres ou vosautras' },
		{ id: 'eles', oc: 'eles, elas', fr: 'ils, elles', rad: 'vend', fin: 'on', g: 're', sens: 'ils ou elles vendent', indici: 'la marque -n, c’est eles ou elas' }
	];
	const forma = (p) => p.rad + p.fin;
	const MESCLA = ['bevètz', 'parli', 'vendon', 'vòl', 'legisses', 'cantam'];

	// les marques de personne du livre (p. 63) : i, s, rien, m, tz, n
	const RESUMIT = [
		['i', 'ieu', 'parli'],
		['s', 'tu', 'parlas'],
		['', 'el, ela', 'parla, vòl, legís'],
		['m', 'nosautres, nosautras', 'parlam'],
		['tz', 'vosautres, vosautras', 'parlatz'],
		['n', 'eles, elas', 'parlan']
	];

	let ecran = $state(0);
	let sens = $state(1);
	let titres = [];
	const calme = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function aller(n, focus = true) {
		if (n < 0 || n >= ECRANS.length || n === ecran) return;
		sens = n > ecran ? 1 : -1;
		ecran = n;
		if (focus) setTimeout(() => titres[n]?.focus({ preventScroll: true }), 30);
	}

	function touche(e) {
		const t = e.target;
		if (t.closest?.('input, textarea, select, [contenteditable]')) return;
		if (e.key === 'Escape') ouverte = null;
		else if (e.key === 'ArrowRight') aller(ecran + 1, false);
		else if (e.key === 'ArrowLeft') aller(ecran - 1, false);
	}

	// glisser du doigt sur l'écran : écran suivant ou précédent
	let x0 = 0, y0 = 0;
	const debut = (e) => ((x0 = e.changedTouches[0].clientX), (y0 = e.changedTouches[0].clientY));
	function fin(e) {
		const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
		if (Math.abs(dx) > 60 && Math.abs(dy) < 40) aller(ecran + (dx < 0 ? 1 : -1), false);
	}

	// écran 1 : la bulle d'exemples d'une fin
	let ouverte = $state(null);

	// écran 4 : l'activité
	let places = $state({});
	let choisie = $state(null);
	let vues = $state({});
	let verifie = $state(false);
	let resolue = $state(false);
	const restantes = $derived(MESCLA.filter((f) => !Object.values(places).includes(f)));
	// ce qu'on a trouvé seul : les lignes vues avec l'œil ne comptent pas
	const justes = $derived(PERSONAS.filter((p) => !vues[p.id] && places[p.id] === forma(p)).length);
	const nbVues = $derived(Object.keys(vues).length);

	function choisir(f) {
		choisie = choisie === f ? null : f;
	}
	function poser(id) {
		if (vues[id]) return;
		verifie = false;
		if (choisie) {
			places[id] = choisie;
			choisie = null;
		} else if (places[id] && !vues[id]) {
			delete places[id];
		}
	}
	function montrer(p) {
		if (vues[p.id]) return;
		// la bonne forme, si elle était posée sur une autre ligne, en repart
		for (const id in places) if (id !== p.id && places[id] === forma(p)) delete places[id];
		places[p.id] = forma(p);
		vues[p.id] = true;
		if (choisie === forma(p)) choisie = null;
	}
	function solution() {
		for (const p of PERSONAS) montrer(p);
		verifie = true;
		resolue = true;
	}
	function reprendre() {
		places = {};
		vues = {};
		choisie = null;
		verifie = false;
		resolue = false;
	}
	const retour = $derived(
		!verifie
			? ''
			: resolue
				? 'Voici la solution. Recommence quand tu veux, sans l’œil.'
				: justes === 6
					? 'Six sur six. La fin suffisait, même pour les verbes que tu ne connais pas encore.'
					: `${justes} sur 6 trouvées sans aide${nbVues ? `, ${nbVues} avec l’œil` : ''}. Sous chaque ligne pas encore juste, un indice.`
	);
</script>

<svelte:head>
	<title>Gramatica · L’infinitiu · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- la bulle d'exemples se ferme d'un clic ailleurs (principe du site) -->
<svelte:window onkeydown={touche} onclick={(e) => ouverte && !e.target.closest?.('.cartas') && (ouverte = null)} />

{#snippet fins(rad, fin, g)}<span lang="oc">{rad}<b class="fin" style:color="var(--g-{g})">{fin}</b></span>{/snippet}

{#snippet font(pages)}<p class="font">Source : <cite lang="oc">Gramatica de l’occitan estandard</cite> (Collègi d’Occitania, Academia Occitana), {pages}.</p>{/snippet}

{#snippet picto(nom)}
	<svg class="picto" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#if nom === 'vendre'}
			<path d="M25 6h15a2 2 0 0 1 2 2v15L23 42 6 25z" />
			<circle cx="34" cy="14" r="3" />
		{:else if nom === 'voler'}
			<path d="M13 30a10 10 0 0 1 1-19.5 12 12 0 0 1 21 2.5 8.5 8.5 0 0 1-1 17z" />
			<circle cx="12" cy="37" r="2.6" />
			<circle cx="7" cy="43" r="1.6" />
			<path d="M24 14.5l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />
		{:else if nom === 'ieu'}
			<circle cx="24" cy="15" r="6.5" />
			<path d="M11 41c1.5-9 6.5-14 13-14s11.5 5 13 14" />
		{:else if nom === 'escotar'}
			<path d="M15 19a11 11 0 0 1 22 0c0 7-6 9-6 15a6 6 0 0 1-11 3" />
			<path d="M21 20a5 5 0 0 1 10 0c0 3-3 4-3 6" />
		{/if}
	</svg>
{/snippet}

<main class="fiche" aria-labelledby="fiche-titol">
	<header class="cap">
		<span class="cap-picto"><Pictograma nom="wiki" size="2.2rem" /></span>
		<p class="cap-ruban"><span lang="oc">Lo wiki · Gramatica</span> <span class="essai">essai</span></p>
		<h1 id="fiche-titol" class="sr-only">Gramatica : l’infinitiu</h1>
	</header>

	<div class="escena" role="presentation" ontouchstart={debut} ontouchend={fin}>
		{#key ecran}
			<section
				class="ecran"
				class:a-cultura={ecran === 0}
				aria-labelledby="ecran-{ecran}"
				in:fly={{ x: calme() ? 0 : sens * 48, duration: calme() ? 0 : 320, opacity: 0 }}
			>
				<h2 id="ecran-{ecran}" lang="oc" tabindex="-1" bind:this={titres[ecran]}>{ECRANS[ecran]}</h2>

				{#if ecran === 0}
					<p class="intro">
						Pour nommer un verbe, on le dit à l’<strong>infinitif</strong>, comme dans le dictionnaire.
						En occitan, il finit par
						{#each FINS as f, i}<b style:color="var(--g-{f})">-{f}</b>{i < 2 ? ', ' : i === 2 ? ' ou ' : ''}{/each} :
						trois groupes de verbes.
					</p>

					<ul class="cartas">
						{#each GROPS as g (g.n)}
							<li>
								<button
									type="button"
									class="carta"
									class:ouverte={ouverte === g.n}
									style:--aplat={g.aplat}
									aria-expanded={ouverte === g.n}
									aria-controls="ex-{g.n}"
									onclick={() => (ouverte = ouverte === g.n ? null : g.n)}
								>
									<span class="carta-en">{g.n} groupe</span>
									<span class="carta-fin" lang="oc">{g.fins.map((f) => '-' + f).join(' ')}</span>
									<span class="carta-ex" lang="oc">{g.ex[0][0]}…</span>
								</button>
								{#if ouverte === g.n}
									<ul class="exemples" id="ex-{g.n}" style:--g="var(--g-{g.fins[0]})" transition:fly={{ y: calme() ? 0 : 8, duration: calme() ? 0 : 180 }}>
										{#each g.ex as [oc, fr]}
											<li><span lang="oc">{oc.slice(0, -2)}<b>{finDe(oc)}</b></span> <small>{fr}</small></li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
					<p class="indic">Touche une carte pour voir des exemples.</p>

					<p class="nota">
							<strong>Un groupe</strong>, c’est une famille de verbes qui se conjuguent de la même façon.
							Le deuxième en cache deux : <i lang="oc">legir</i> prend <i lang="oc">-iss-</i>
							(<i lang="oc">legissi</i>, je lis), <i lang="oc">venir</i> non (<i lang="oc">veni</i>, je viens).
					</p>
					<div class="cultura"><NoteBlock block={CULTURA} /></div>
					{@render font('pages 63 et 64')}
				{:else if ecran === 1}
					<p class="intro">
						Un infinitif a deux parties : le <strong>radical</strong>, qui porte le sens, et la
						<strong>terminaison</strong>, qui change quand on conjugue.
					</p>
					<div class="copas">
						{#each COPAS as c, i (c.rad)}
							<span class="copa-picto" style:--i={i}>
								{#if c.picto === 'parlar'}<Pictograma nom="forum" size="100%" />{:else if c.picto === 'legir'}<Pictograma nom="wiki" size="100%" />{:else}{@render picto(c.picto)}{/if}
							</span>
							<span class="copa-mot" lang="oc" title={c.fr}>{c.rad}<span style:color="var(--g-{c.fin})">{c.fin}</span></span>
							<span class="copa-sageta" aria-hidden="true">⟶</span>
							<span class="copa-rad" lang="oc" style:--i={i}>{c.rad}</span>
							<span class="copa-fin" lang="oc" style:--i={i} style:color="var(--g-{c.fin})">+{c.fin}</span>
							<span class="copa-fr" style:--i={i}>{c.fr}</span>
						{/each}
						<span class="accolada a-rad" aria-hidden="true"></span>
						<span class="accolada a-fin" aria-hidden="true"></span>
						<span class="nom-rad"><span lang="oc">lo radical</span><small>le radical</small></span>
						<span class="nom-fin"><span lang="oc">la terminason</span><small>la terminaison</small></span>
					</div>
				{:else if ecran === 2}
					<p class="intro">
						<strong>Conjuguer</strong>, c’est changer la terminaison de l’infinitif. La nouvelle fin dit
						<strong>qui</strong> fait l’action, et <strong>quand</strong>.
					</p>
					<div class="dos">
						<div class="colona">
							<h3>Qui ?</h3>
							<div class="frasa">
								{@render picto('ieu')}
								<p><span class="f-oc">{@render fins('Parl', 'i', 'ar')} <span lang="oc">occitan.</span></span><small>je parle occitan</small></p>
							</div>
							<div class="frasa">
								<Pictograma nom="grops" size="3.2rem" />
								<p><span class="f-oc">{@render fins('Parl', 'am', 'ar')} <span lang="oc">occitan.</span></span><small>nous parlons occitan</small></p>
							</div>
						</div>
						<div class="colona">
							<h3>Quand ?</h3>
							<div class="frasa">
								{@render picto('escotar')}
								<p><span class="f-oc"><span lang="oc">Abans,</span> {@render fins('escot', 'avi', 'ar')}.</span><small>avant, j’écoutais</small></p>
							</div>
							<div class="frasa">
								<Pictograma nom="forum" size="3.2rem" />
								<p><span class="f-oc"><span lang="oc">Ara,</span> {@render fins('parl', 'i', 'ar')} !</span><small>maintenant, je parle !</small></p>
							</div>
						</div>
					</div>
					{@render font('page 63')}
					<p class="indic">Le plus souvent, le radical reste et la fin change. La couleur rappelle le groupe de l’infinitif : <i lang="oc">parlar</i>, <i lang="oc">escotar</i>.</p>
				{:else if ecran === 3}
					<p class="intro">
						Mets chaque forme en face de sa personne. Tu ne connais pas tous ces verbes ?
						Regarde la fin : elle suffit. L’œil montre la réponse d’une ligne.
					</p>
					<div class="jeu">
						<ol class="taula">
							{#each PERSONAS as p (p.id)}
								{@const pl = places[p.id]}
								{@const ok = pl === forma(p)}
								<li class="linha" class:juste={verifie && ok} class:pas-encore={verifie && pl && !ok}>
									<span class="persona"><span lang="oc">{p.oc}</span><small>{p.fr}</small></span>
									<button
										type="button"
										class="place"
										class:plena={pl}
										class:esperant={choisie && !vues[p.id]}
										aria-disabled={vues[p.id]}
										aria-label={pl
											? `${p.fr} : ${pl}${verifie || vues[p.id] ? (ok ? ', juste' : ', pas encore') : ''}${vues[p.id] ? '' : ', toucher pour retirer'}`
											: `Poser ici, pour ${p.fr}`}
										onclick={() => poser(p.id)}
									>
										{#if pl}
											{#if verifie || vues[p.id]}
												{#if ok}{@render fins(p.rad, p.fin, p.g)}{:else}<span lang="oc">{pl}</span>{/if}
											{:else}
												<span lang="oc">{pl}</span>
											{/if}
										{/if}
									</button>
									<button type="button" class="oeil" aria-label="Voir la réponse pour {p.fr}" title="Voir la réponse" aria-disabled={vues[p.id]} onclick={() => montrer(p)}>
										<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
									</button>
									<span class="marca">
										{#if (verifie || vues[p.id]) && ok}
											<span class="sens">{p.sens}</span>
										{:else if verifie && pl}
											<span class="indici"><span class="pe">Pas encore :</span> {p.indici}</span>
										{/if}
									</span>
								</li>
							{/each}
						</ol>
						<div class="formas" role="group" aria-label="Formes à placer">
							{#each restantes as f (f)}
								<button type="button" class="forma" lang="oc" aria-pressed={choisie === f} onclick={() => choisir(f)}>{f}</button>
							{:else}
								<p class="formes-vides">Tout est posé.</p>
							{/each}
						</div>
					</div>
					<div class="accions">
						<button type="button" class="boton" lang="oc" disabled={!Object.keys(places).length} onclick={() => (verifie = true)}>Verificar</button>
						<button type="button" class="boton segond" lang="oc" onclick={solution}>Solucion</button>
						<button type="button" class="boton tiers" lang="oc" onclick={reprendre}>Recomençar</button>
					</div>
					<p class="retorn" aria-live="polite">{retour}</p>
					{@render font('page 63, les marques de personne')}
				{:else}
					<p class="intro">La toute dernière lettre du verbe, ou les deux dernières, dit qui parle : c’est la <strong>marque de la personne</strong>. La même pour presque tous les verbes :</p>
					<ul class="resumit">
						{#each RESUMIT as [marca, qui, ex]}
							<li>
								<span class="r-fin" class:rien={!marca}>{marca ? '-' + marca : 'rien'}</span>
								<span class="r-qui" lang="oc">{qui}</span>
								<span class="r-ex" lang="oc">{ex.slice(0, ex.length - marca.length)}<b>{marca}</b></span>
							</li>
						{/each}
					</ul>
					<p class="indic">
						Même <i lang="oc">èsser</i> suit la règle : <i lang="oc">soi, siás, es, sèm, sètz, son</i>.
					</p>
					<p class="seguida">
						Dans le parcours : <a href="/aprene/modul/4-1">le module 4.1 fait parler les verbes en -ar</a>.
					</p>
					<div class="credits">
						<h3>Sources</h3>
						<p>
							<strong>La règle</strong> : <cite lang="oc">Gramatica de l’occitan estandard</cite>, Collègi d’Occitania et Academia Occitana,
							sous la direction de Florian Vernet, pages 63 et 64.
						</p>
						<p>
							<strong>La forme des écrans</strong> : inspirée de la grammaire cognitive du CPNL (Consorci per a la Normalització
							Lingüística, Catalogne), de Magda Aragonès i Ros et Maria Badia Rabassa, avec l’équipe de grammaire
							cognitive du CPNL et l’aide de Lourdes Miquel et Carles Vilches :
							<a href="https://www.cpnl.cat/gramatica/" rel="noopener">cpnl.cat/gramatica</a>. Le CPNL s’inspire lui-même de la
							<cite lang="es">Gramática básica del estudiante de español</cite> (Difusión) et de la
							<cite lang="ca">Gramàtica pràctica del català</cite> (Teide).
						</p>
						<p><strong>Le mot <i lang="oc">trobador</i></strong> : TLFi, article « troubadour ».</p>
					</div>
				{/if}
			</section>
		{/key}
	</div>

	<nav class="navegacion" aria-label="Écrans de la fiche">
		<button type="button" class="sageta" aria-label="Écran précédent" disabled={ecran === 0} onclick={() => aller(ecran - 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
		</button>
		<ol class="ponchs">
			{#each ECRANS as t, i}
				<li>
					<button type="button" class="ponch" aria-label="Écran {i + 1} : {t}" aria-current={i === ecran ? 'step' : undefined} onclick={() => aller(i)}></button>
				</li>
			{/each}
		</ol>
		<button type="button" class="sageta" aria-label="Écran suivant" disabled={ecran === ECRANS.length - 1} onclick={() => aller(ecran + 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
		</button>
	</nav>
</main>

<style>
	/* Une couleur par groupe de verbes, prise dans la charte (prune, olive,
	   bleu ciel) : en aplat sur les cartes, comme les cases de S'apren ; en
	   texte, assombrie sur le clair (4,5 au moins), éclaircie sur le sombre. Jamais le rouge du
	   logo, réservé à ce qui se clique (règle B). */
	.fiche {
		--g-ar: #e3a0cf;
		--g-ir: #b8d27c;
		--g-re: #8cc3f0;
		--g-er: var(--g-re);
		--pastilha: color-mix(in srgb, var(--t-aur) 16%, var(--t-fons-2));
		container-type: inline-size;
		max-width: 76rem;
		margin: 0 auto;
		padding: 1.25rem 1rem 1.5rem;
		color: var(--t-tinta);
		display: flex;
		flex-direction: column;
		min-height: calc(100svh - 5rem);
	}
	:global(:root[data-tema='clar']) .fiche {
		--g-ar: #7a3b69;
		--g-ir: #47602a;
		--g-re: #255d90;
		--g-er: var(--g-re);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.cap {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--t-tinta-2);
	}
	.cap-ruban {
		margin: 0;
		font-size: 0.95rem;
		letter-spacing: 0.02em;
	}
	.essai {
		margin-left: 0.4rem;
		padding: 0.1rem 0.5rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		background: var(--t-fons-2);
	}

	.escena {
		flex: 1;
		display: grid;
		overflow-x: clip;
	}
	.ecran {
		grid-area: 1 / 1;
		display: grid;
		grid-template-columns: 1fr;
		align-content: start;
		gap: 1.1rem;
		padding-top: 0.6rem;
	}
	h2 {
		margin: 0.4rem 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.9rem, 5.5cqi, 3rem);
		line-height: 1.1;
		color: var(--t-aur);
		outline: none;
	}
	.intro {
		margin: 0;
		max-width: 52rem;
		font-size: clamp(1.1rem, 2.6cqi, 1.45rem);
		line-height: 1.45;
	}
	.indic {
		margin: 0;
		color: var(--t-tinta-2);
	}

	/* écran 1 : l'encart culture à droite sur grand écran, les trois cartes */
	@container (min-width: 64rem) {
		.ecran.a-cultura {
			grid-template-columns: 1fr 24rem;
			column-gap: 2.5rem;
		}
		.ecran.a-cultura > :not(.cultura) {
			grid-column: 1;
		}
		.cultura {
			grid-column: 2;
			grid-row: 2 / span 4;
			align-self: start;
		}
	}
	.cultura :global(.block) {
		margin: 0;
	}
	.cartas {
		list-style: none;
		margin: 0.4rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}
	.cartas > li:last-child {
		grid-column: 1 / -1;
	}
	@container (min-width: 40rem) {
		.cartas {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cartas > li:last-child {
			grid-column: auto;
		}
	}
	.cartas > li {
		position: relative;
	}
	.carta {
		width: 100%;
		display: grid;
		justify-items: center;
		gap: 0.1rem;
		padding: 1rem 0.5rem 0.9rem;
		border: 0;
		border-radius: 1rem;
		background: var(--aplat);
		color: #fbf1e1;
		font: inherit;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}
	.carta:hover,
	.carta.ouverte {
		background: color-mix(in srgb, var(--aplat) 88%, #000);
		transform: translateY(-3px);
	}
	.carta:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.carta-en,
	.carta-ex {
		font-size: 0.95rem;
		color: #fbf1e1;
	}
	.carta-fin {
		font-size: clamp(2.2rem, 7cqi, 3.4rem);
		font-weight: 700;
		line-height: 1;
	}
	.exemples {
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: calc(100% + 0.6rem);
		translate: -50% 0;
		min-width: 11rem;
		margin: 0;
		padding: 0.6rem 0.9rem;
		list-style: none;
		border-radius: 0.8rem;
		background: var(--t-tinta);
		color: var(--t-fons);
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.25);
		line-height: 1.5;
	}
	.exemples::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		translate: -50% 0;
		border: 0.5rem solid transparent;
		border-top-color: var(--t-tinta);
	}
	.exemples b {
		color: color-mix(in srgb, var(--g) 45%, var(--t-fons));
	}
	.exemples small {
		opacity: 0.75;
	}
	.nota {
		margin: 0.4rem 0 0;
		max-width: 52rem;
		line-height: 1.5;
	}

	/* écran 2 : l'infinitif coupé en deux */
	.copas {
		display: grid;
		grid-template-columns: auto auto auto auto auto;
		align-items: center;
		justify-content: start;
		gap: 0.35rem clamp(0.5rem, 2.2cqi, 1.6rem);
		margin-top: 0.4rem;
		font-weight: 700;
		text-transform: uppercase;
		font-size: clamp(1.3rem, 6cqi, 3.6rem);
		line-height: 1.15;
	}
	.copa-picto {
		width: clamp(2rem, 6cqi, 3.6rem);
		height: clamp(2rem, 6cqi, 3.6rem);
		color: var(--t-tinta-2);
		grid-column: 1;
	}
	.copa-picto :global(svg) {
		width: 100%;
		height: 100%;
	}
	.copa-mot {
		grid-column: 2;
	}
	.copa-sageta {
		grid-column: 3;
		color: var(--t-tinta-2);
		font-weight: 400;
	}
	.copa-rad {
		grid-column: 4;
		color: var(--t-tinta-2);
	}
	.copa-fin {
		grid-column: 5;
	}
	.copa-fr {
		grid-column: 2 / -1;
		margin: -0.3rem 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 400;
		text-transform: none;
		color: var(--t-tinta-2);
	}
	.copa-rad,
	.copa-fin {
		animation: copar 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(0.25s + var(--i) * 0.16s);
	}
	.copa-fin {
		animation-delay: calc(0.4s + var(--i) * 0.16s);
	}
	@keyframes copar {
		from {
			opacity: 0;
			translate: -1.2em 0;
		}
	}
	.accolada {
		height: 0.8rem;
		margin-top: 0.3rem;
		border: 3px solid var(--t-tinta-2);
		border-top: 0;
		border-radius: 0 0 0.5rem 0.5rem;
	}
	.a-rad,
	.nom-rad {
		grid-column: 4;
	}
	.a-fin,
	.nom-fin {
		grid-column: 5;
	}
	.nom-rad,
	.nom-fin {
		display: grid;
		justify-items: center;
		text-transform: none;
		font-size: clamp(1rem, 2.6cqi, 1.5rem);
		text-align: center;
	}
	.nom-rad small,
	.nom-fin small {
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--t-tinta-2);
	}

	/* écran 3 : qui et quand */
	.dos {
		display: grid;
		gap: 1.2rem 3rem;
	}
	@container (min-width: 48rem) {
		.dos {
			grid-template-columns: 1fr 1fr;
		}
	}
	h3 {
		margin: 0 0 0.6rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--t-aur);
	}
	.frasa {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.7rem 0;
	}
	.frasa :global(svg) {
		flex: none;
		width: 3.2rem;
		height: 3.2rem;
		color: var(--t-tinta-2);
	}
	.frasa p {
		display: grid;
		margin: 0;
	}
	.f-oc {
		font-size: clamp(1.4rem, 4cqi, 2rem);
		font-style: italic;
	}
	.frasa small {
		color: var(--t-tinta-2);
	}
	.fin {
		font-weight: 700;
	}
	.f-oc .fin {
		text-transform: uppercase;
		font-style: normal;
	}

	/* écran 4 : l'activité */
	.jeu {
		display: grid;
		gap: 1rem 2rem;
		align-items: start;
	}
	@container (min-width: 56rem) {
		.jeu {
			grid-template-columns: 1fr 12rem;
		}
	}
	.taula {
		list-style: none;
		margin: 0;
		padding: 0;
		border-radius: 0.9rem;
		overflow: hidden;
		background: var(--t-fons-2);
	}
	.linha {
		display: grid;
		grid-template-columns: minmax(6.5rem, 12rem) 1fr auto;
		grid-template-areas: 'p c u' '. m m';
		align-items: center;
		gap: 0 0.6rem;
		padding: 0.45rem 0.6rem;
	}
	.linha + .linha {
		border-top: 1px solid var(--t-linha);
	}
	.persona {
		grid-area: p;
		display: grid;
		font-weight: 700;
	}
	.persona small {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.place {
		grid-area: c;
		min-height: 2.6rem;
		border: 2px dashed var(--t-linha);
		border-radius: 1.4rem;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.2rem;
		cursor: pointer;
	}
	.place.esperant {
		border-color: var(--t-aur);
	}
	.place.plena {
		border-style: solid;
		border-color: transparent;
		background: var(--pastilha);
	}
	.place[aria-disabled='true'] {
		cursor: default;
	}
	.linha.juste .place {
		box-shadow: inset 0 0 0 2px var(--t-aur);
	}
	.oeil {
		grid-area: u;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border: 0;
		border-radius: 50%;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
	}
	.oeil[aria-disabled='true'] {
		opacity: 0.3;
		cursor: default;
	}
	.oeil svg {
		width: 1.3rem;
		height: 1.3rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
	}
	.marca {
		grid-area: m;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.marca:empty {
		display: none;
	}
	.pe {
		color: var(--t-aur);
		font-weight: 700;
	}
	.formas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-content: start;
	}
	@container (min-width: 56rem) {
		.formas {
			flex-direction: column;
		}
	}
	.forma {
		padding: 0.45rem 1.1rem;
		border: 0;
		border-radius: 1.4rem;
		background: var(--pastilha);
		color: var(--t-tinta);
		font: inherit;
		font-size: 1.2rem;
		cursor: pointer;
		transition: transform 0.15s ease;
	}
	.forma[aria-pressed='true'] {
		box-shadow: 0 0 0 3px var(--t-aur);
		transform: translateY(-2px);
	}
	.formes-vides {
		margin: 0;
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.boton {
		padding: 0.6rem 1.3rem;
		border: 0;
		border-radius: 1.6rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.boton.segond,
	.boton.tiers {
		background: transparent;
		color: var(--t-tinta);
		box-shadow: inset 0 0 0 2px var(--t-accion);
	}
	.boton.tiers {
		box-shadow: none;
		text-decoration: underline;
		text-decoration-color: var(--t-accion);
		text-underline-offset: 0.25em;
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.retorn {
		margin: 0;
		min-height: 1.5em;
		font-weight: 700;
	}

	/* écran 5 : à retenir */
	.resumit {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
		max-width: 52rem;
	}
	@container (min-width: 44rem) {
		.resumit {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	.resumit li {
		display: grid;
		gap: 0.1rem;
		padding: 0.8rem 1rem;
		border-radius: 0.9rem;
		background: var(--t-fons-2);
	}
	.r-fin.rien {
		font-size: 1.2rem;
		line-height: 1.65;
	}
	.r-fin {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
		color: var(--t-aur);
	}
	.r-qui {
		font-weight: 700;
	}
	.r-ex {
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.r-ex b {
		color: var(--t-aur);
	}
	.seguida a {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
	}
	.seguida {
		margin: 0;
	}
	.font {
		margin: 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.credits {
		max-width: 52rem;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.credits h3 {
		margin: 0.4rem 0 0.3rem;
		color: var(--t-tinta);
	}
	.credits p {
		margin: 0 0 0.35rem;
	}
	.credits a {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}

	/* la navigation, toujours en bas */
	.navegacion {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(0.6rem, 3cqi, 2rem);
		padding-top: 1.5rem;
	}
	.ponchs {
		display: flex;
		gap: clamp(0.6rem, 2.5cqi, 1.6rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.ponch {
		display: block;
		width: 1.6rem;
		height: 1.6rem;
		border: 0;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		position: relative;
	}
	.ponch::after {
		content: '';
		position: absolute;
		inset: 0.35rem;
		border-radius: 50%;
		background: var(--t-linha);
		transition:
			background 0.2s ease,
			inset 0.2s ease;
	}
	.ponch[aria-current='step']::after {
		inset: 0.2rem;
		background: var(--t-aur);
	}
	.sageta {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border: 0;
		border-radius: 50%;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
	}
	.sageta:disabled {
		visibility: hidden;
	}
	.sageta svg {
		width: 1.4rem;
		height: 1.4rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.copa-rad,
		.copa-fin {
			animation: none;
		}
		.carta,
		.forma {
			transition: none;
		}
	}
</style>
