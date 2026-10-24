<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { editor, hebergeur, baseDonnadas, dataMiseAJour } from '$lib/data/legal';

	let lang = $derived(langStore.current);

	// Contenu établi à partir de ce que le site collecte RÉELLEMENT :
	// table profiles, table lesson_progress, authentification Supabase et
	// stockage local. Rien n'est déclaré « au cas où ».
	const t = {
		fr: {
			titre: 'Politique de confidentialité',
			maj: 'Dernière mise à jour',
			intro:
				'Lo Ligam collecte le strict nécessaire pour faire fonctionner l’apprentissage. Aucune donnée n’est vendue, aucun traceur publicitaire n’est installé.',
			responsableT: 'Qui est responsable',
			responsable: 'Le responsable du traitement est {nom}, joignable à {email}.',
			collecteT: 'Ce qui est collecté',
			collecte: [
				[
					'Ton compte',
					'Adresse e-mail et mot de passe, pour te reconnaître d’une visite à l’autre. Le mot de passe n’est jamais lisible : il est stocké sous forme chiffrée par notre prestataire.'
				],
				[
					'Ton profil',
					'Pseudonyme (obligatoire), et de façon entièrement facultative : genre, tranche d’âge, catégorie professionnelle, lieu de vie, ce qui t’intéresse dans l’occitan. Tu peux ne rien renseigner.'
				],
				[
					'Ta progression',
					'La leçon en cours, ton avancement et tes points, pour te permettre de reprendre où tu en étais.'
				],
				[
					'Ton message',
					'Si tu m’écris par le formulaire de contact : ton adresse électronique, ton nom si tu le donnes, et ton message. Je les reçois par courriel pour pouvoir te répondre ; le site n’en garde aucune copie. Le courriel est effacé de ma messagerie au bout d’un an au plus tard.'
				],
				[
					'Tes réponses avant un premier cours',
					'Si tu remplis le questionnaire avant un premier cours en visio : ton adresse électronique, ton prénom si tu le donnes, et tes réponses (niveau, raisons, langues, lieu, rythme, envies, message). Je les reçois par courriel pour préparer le cours ; le site n’en garde aucune copie. Le courriel est effacé de ma messagerie au bout d’un an au plus tard.'
				]
			],
			pourquoiT: 'Pourquoi, et sur quelle base',
			pourquoi:
				'Le compte et la progression reposent sur l’exécution du service que tu demandes. Les réponses facultatives du questionnaire reposent sur ton consentement : elles servent uniquement à comprendre qui apprend l’occitan, jamais à te cibler.',
			ageT: 'Âge minimum',
			age: 'La création de compte est réservée aux personnes de 15 ans ou plus.',
			dureeT: 'Combien de temps',
			duree:
				'Tes données sont conservées tant que ton compte existe. Si tu demandes sa suppression, elles sont effacées, y compris ta progression.',
			quiT: 'Qui d’autre y a accès',
			qui: 'Personne, en dehors des prestataires techniques nécessaires au fonctionnement du site :',
			juridiccion:
				'Précision que nous préférons dire clairement : tes données sont stockées sur des serveurs situés dans l’Union européenne, mais la société qui gère la base de données est américaine. Les autorités des États-Unis peuvent donc, en droit, en demander l’accès (c’est ce qu’on appelle le CLOUD Act). L’hébergement du site, lui, est français. Nous cherchons un prestataire européen pour la base de données ; aucun ne réunit à ce jour la maturité et la compatibilité nécessaires.',
			cookiesT: 'Traceurs et stockage',
			cookies:
				'Aucun traceur publicitaire, aucune mesure d’audience. Le site garde seulement quelques réglages dans ton navigateur : la langue choisie, la progression de la leçon d’essai, et le fait que tu aies déjà vu certains messages d’accueil. Ces informations ne quittent jamais ton appareil et ne servent pas à t’identifier.',
			roleBasa: 'base de données et authentification',
			roleAlbergament: 'hébergement, et envoi des messages du formulaire de contact',
			tiersT: 'Ressources chargées depuis d’autres sites',
			tiers:
				'Certaines pages chargent des éléments hébergés ailleurs, ce qui transmet ton adresse IP à ces services : les fonds de carte (OpenStreetMap et sa version occitane OSM-bzh, OpenTopoMap, photos aériennes de l’IGN et du PNOA espagnol), la recherche de communes quand tu tapes un lieu (API Adresse, Photon), les vidéos et les musiques que tu choisis de lancer (YouTube en mode sans cookie, Deezer, Canva ; pour les musiques, une phrase te prévient avant) et les enregistrements de l’Atlas sonore des langues régionales (LISN, Université Paris-Saclay) que tu choisis d’écouter sur la carte. Les polices de caractères et les icônes, elles, sont servies par ce site : aucune requête vers Google.',
			droitsT: 'Tes droits',
			droits:
				'Tu peux à tout moment demander à consulter tes données, les corriger, les effacer, les récupérer dans un format lisible, ou retirer ton consentement aux réponses facultatives. Écris à {email} : la réponse intervient sous un mois.',
			cnilT: 'En cas de désaccord',
			cnil: 'Si une réponse ne te satisfait pas, tu peux saisir la CNIL :'
		},
		oc: {
			titre: 'Politica de confidencialitat',
			maj: 'Darrièra mesa a jorn',
			intro:
				'Lo Ligam recuèlh çò que cal, pas mai, per far foncionar l’aprendissatge. Cap de donada es pas venduda, cap de pistaire publicitari es pas installat.',
			responsableT: 'Qual es responsable',
			responsable: 'Lo responsable del tractament es {nom}, jonhible a {email}.',
			collecteT: 'Çò qu’es recuelhit',
			collecte: [
				[
					'Ton compte',
					'Adreça electronica e senhal, per te reconéisser d’una visita a l’autra. Lo senhal es pas jamai legible : es emmagazinat chifrat per nòstre prestatari.'
				],
				[
					'Ton perfil',
					'Escaisnom (obligatòri), e de manièra completament facultativa : genre, forcheta d’edat, categoria professionala, luòc de vida, çò que t’interèssa dins l’occitan. Pòdes res emplenar.'
				],
				[
					'Ta progression',
					'La leiçon en cors, ton avançament e tos punts, per te permetre de tornar ont n’èras.'
				],
				[
					'Ton messatge',
					'Se m’escrives pel formulari de contacte : ton corrièl, ton nom se lo donas, e ton messatge. Los recebi per corrièl per te poder respondre ; lo site ne garda pas cap de còpia. Lo corrièl es escafat de ma messatjariá al cap d’un an al mai tard.'
				],
				[
					'Tas responsas abans un primièr cors',
					'Se emplenas lo questionari abans un primièr cors en visio : ton corrièl, ton prenom se lo donas, e tas responsas (nivèl, rasons, lengas, luòc, ritme, envejas, messatge). Las recebi per corrièl per preparar lo cors ; lo site ne garda pas cap de còpia. Lo corrièl es escafat de ma messatjariá al cap d’un an al mai tard.'
				]
			],
			pourquoiT: 'Perqué, e sus quina basa',
			pourquoi:
				'Lo compte e la progression repausan sus l’execucion del servici que demandas. Las respònsas facultativas del questionari repausan sus ton consentiment : servisson unicament a comprene qual apren l’occitan, pas jamai a te ciblar.',
			ageT: 'Edat minimala',
			age: 'La creacion de compte es reservada a las personas de 15 ans o mai.',
			dureeT: 'Quant de temps',
			duree:
				'Tas donadas son gardadas tant que ton compte existís. Se demandas sa supression, son escafadas, progression compresa.',
			quiT: 'Qual mai i a accès',
			qui: 'Degun, levat los prestataris tecnics necessaris al foncionament del site :',
			juridiccion:
				'Precision que valèm mai dire clarament : tas donadas son gardadas sus de servidors situats dins l’Union europèa, mas la societat que gerís la basa de donadas es americana. Las autoritats dels Estats-Units pòdon doncas, en drech, ne demandar l’accès (çò que s’apèla lo CLOUD Act). L’albergament del site, el, es francés. Cercam un prestatari europèu per la basa de donadas ; cap reünís pas encara la maduretat e la compatibilitat necessàrias.',
			cookiesT: 'Pistaires e emmagazinatge',
			cookies:
				'Cap de pistaire publicitari, cap de mesura d’audiéncia. Lo site garda solament qualques reglatges dins ton navegador : la lenga causida, la progression de la leiçon d’ensag, e lo fach qu’ajas ja vist certans messatges d’acuèlh. Aquelas informacions quitan pas jamai ton aparelh e servisson pas a t’identificar.',
			roleBasa: 'basa de donadas e autentificacion',
			roleAlbergament: 'albergament, e mandadís dels messatges del formulari de contacte',
			tiersT: 'Ressorsas cargadas d’autres sites',
			tiers:
				'Certanas paginas cargan d’elements albergats endacòm mai, çò que transmet ton adreça IP a aquestes servicis : los fonses de carta (OpenStreetMap e sa version occitana OSM-bzh, OpenTopoMap, fòtos aerianas de l’IGN e del PNOA espanhòl), la recèrca de comunas quand tapas un luòc (API Adresse, Photon), las vidèos e las musicas que causisses de lançar (YouTube en mòde sens cookies, Deezer, Canva) e las faulas de l’Atlas sonòr de las lengas regionalas (LISN, Universitat Paris-Saclay) que causisses d’escotar sus la carta. Las poliças de caractèrs e las icònas, elas, son servidas per aqueste site : cap de requèsta cap a Google.',
			droitsT: 'Tos dreches',
			droits:
				'Pòdes a tot moment demandar de consultar tas donadas, las corregir, las escafar, las recuperar dins un format legible, o retirar ton consentiment a las respònsas facultativas. Escriu a {email} : la respònsa arriba jos un mes.',
			cnilT: 'En cas de desacòrd',
			cnil: 'Se una respònsa te satisfà pas, pòdes sasir la CNIL :'
		}
	};
	let tx = $derived(t[lang]);

	function avecVars(s) {
		return s.replace('{nom}', editor.nom).replace('{email}', editor.email);
	}
</script>

<svelte:head>
	<title>{tx.titre} · Lo Ligam</title>
</svelte:head>

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1>{tx.titre}</h1>
		<p class="maj">{tx.maj} : {dataMiseAJour}</p>
		<p class="intro">{tx.intro}</p>

		<section>
			<h2>{tx.responsableT}</h2>
			<p>{avecVars(tx.responsable)}</p>
		</section>

		<section>
			<h2>{tx.collecteT}</h2>
			<dl>
				{#each tx.collecte as [titre, detail] (titre)}
					<dt>{titre}</dt>
					<dd>{detail}</dd>
				{/each}
			</dl>
		</section>

		<section>
			<h2>{tx.pourquoiT}</h2>
			<p>{tx.pourquoi}</p>
		</section>

		<section>
			<h2>{tx.ageT}</h2>
			<p>{tx.age}</p>
		</section>

		<section>
			<h2>{tx.dureeT}</h2>
			<p>{tx.duree}</p>
		</section>

		<section>
			<h2>{tx.quiT}</h2>
			<p>{tx.qui}</p>
			<ul>
				<li>
					<strong>{baseDonnadas.nom}</strong> — {tx.roleBasa}
					{#if baseDonnadas.region}({baseDonnadas.region[lang] ?? baseDonnadas.region.fr}){/if}
					·
					<a href={baseDonnadas.site} target="_blank" rel="noopener noreferrer">{baseDonnadas.site}</a>
				</li>
				<li>
					<strong>{hebergeur.nom}</strong> — {tx.roleAlbergament}
					{#if hebergeur.region}({hebergeur.region}){/if}
					·
					<a href={hebergeur.site} target="_blank" rel="noopener noreferrer">{hebergeur.site}</a>
				</li>
			</ul>
			{#if baseDonnadas.societatNonEuropea}
				<p class="nuanca">{tx.juridiccion}</p>
			{/if}
		</section>

		<section>
			<h2>{tx.cookiesT}</h2>
			<p>{tx.cookies}</p>
		</section>

		<section>
			<h2>{tx.tiersT}</h2>
			<p>{tx.tiers}</p>
		</section>

		<section>
			<h2>{tx.droitsT}</h2>
			<p>{avecVars(tx.droits)}</p>
		</section>

		<section>
			<h2>{tx.cnilT}</h2>
			<p>
				{tx.cnil}
				<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
			</p>
		</section>
	</article>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.screen {
		max-width: 44rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
	}

	.doc {
		margin-top: 2rem;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.7rem, 4vw, 2.3rem);
		color: var(--color-brick);
		margin: 0;
	}

	.maj {
		margin: 0.4rem 0 1.25rem;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.intro {
		font-size: 1.02rem;
		line-height: 1.6;
		margin: 0 0 2rem;
		padding-left: 0.9rem;
		border-left: 3px solid var(--color-gold);
	}

	section {
		margin-bottom: 1.75rem;
	}

	h2 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-brick);
		margin: 0 0 0.4rem;
	}

	p {
		margin: 0;
		line-height: 1.6;
		text-wrap: pretty;
	}

	dl {
		margin: 0;
	}

	dt {
		font-weight: 600;
		margin-top: 0.75rem;
	}

	dd {
		margin: 0.15rem 0 0;
		line-height: 1.6;
		opacity: 0.9;
	}

	ul {
		margin: 0.5rem 0 0;
		padding-left: 1.1rem;
		line-height: 1.7;
	}

	a {
		color: var(--color-teal);
	}

	/* Une nuance que la plupart des sites passent sous silence derrière un
	   « hébergé en Europe » : elle mérite d'être visible sans faire peur,
	   d'où le filet discret plutôt qu'un encadré d'avertissement. */
	.nuanca {
		margin-top: 0.9rem;
		padding-left: 0.8rem;
		border-left: 2px solid var(--color-teal);
		font-size: 0.95rem;
		opacity: 0.85;
	}
</style>
