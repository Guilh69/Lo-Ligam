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
				],
				[
					'Tes idées',
					'Si tu envoies une idée dans la boîte à idées : son texte, rattaché à ton compte pour que tu la retrouves et puisses la supprimer. Je suis seul à la lire, sans savoir qui l’envoie. Elle est effacée quand tu la supprimes, quand ton compte est supprimé, et au bout de deux ans au plus tard.'
				],
				[
					'Tes remarques sur les leçons',
					'Si tu laisses une remarque sur une leçon, pendant la relecture : son texte, l’endroit de la page que tu touches, et ton prénom si tu le donnes. Aucun compte. Je suis seul à les lire, avec l’aide de Claude, l’intelligence artificielle d’Anthropic, pour les corriger. Elles sont effacées au bout d’un an au plus tard.'
				]
			],
			pourquoiT: 'Pourquoi, et sur quelle base',
			pourquoi:
				'Le compte et la progression reposent sur l’exécution du service que tu demandes. Les réponses facultatives du questionnaire reposent sur ton consentement : elles servent uniquement à comprendre qui apprend l’occitan, jamais à te cibler. Les idées reposent aussi sur ton consentement : tu choisis de les envoyer, et tu peux les retirer. Les remarques aussi.',
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
				'Aucun traceur publicitaire, aucune mesure d’audience. Le site garde seulement quelques réglages dans ton navigateur : la langue et le thème choisis, ta progression dans les leçons, ton carnet de mots, et le fait que tu aies déjà vu certains messages d’accueil. Si tu es connecté, ton navigateur garde aussi ta connexion, et ta progression et ton carnet sont aussi enregistrés dans ton compte. Ces informations servent seulement à faire fonctionner le site, jamais à t’identifier ni à te suivre.',
			roleBasa: 'base de données et authentification',
			roleAlbergament: 'hébergement, et envoi des messages du formulaire de contact',
			tiersT: 'Ressources chargées depuis d’autres sites',
			tiers:
				'Certaines pages chargent des éléments hébergés ailleurs, ce qui transmet ton adresse IP à ces services : les fonds de carte (OpenStreetMap et sa version occitane OSM-bzh, OpenTopoMap, photos aériennes de l’IGN et du PNOA espagnol), la recherche de communes quand tu tapes un lieu (API Adresse, Photon), les vidéos, les musiques et les radios que tu choisis de lancer (YouTube en mode sans cookie, Deezer, Canva, les radios en occitan ; pour les musiques et les radios, une phrase te prévient avant) et les enregistrements de l’Atlas sonore des langues régionales (LISN, Université Paris-Saclay) que tu choisis d’écouter sur la carte. Les polices de caractères et les icônes, elles, sont servies par ce site : aucune requête vers Google.',
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
				],
				[
					'Tas idèas',
					'Se mandas una idèa dins la boita d’idèas : son tèxte, ligat a ton compte per que la tornes trobar e la pòscas suprimir. Soi lo sol a la legir, sens saber qual la manda. Es escafada quand la suprimisses, quand ton compte es suprimit, e al cap de dos ans al mai tard.'
				],
				[
					'Tas remarcas sus las leiçons',
					'Se daissas una remarca sus una leiçon : son tèxte, l’endrech de la pagina que tòcas, e ton prenom se lo donas. Pas cap de compte. Soi lo sol a las legir, amb l’ajuda de Claude, l’intelligéncia artificiala d’Anthropic, per las corregir. Son escafadas al cap d’un an al mai tard.'
				]
			],
			pourquoiT: 'Perqué, e sus quina basa',
			pourquoi:
				'Lo compte e la progression repausan sus l’execucion del servici que demandas. Las respònsas facultativas del questionari repausan sus ton consentiment : servisson unicament a comprene qual apren l’occitan, pas jamai a te ciblar. Las idèas repausan tanben sus ton consentiment : causisses de las mandar, e las pòdes retirar. Las remarcas tanben.',
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
				'Cap de pistaire publicitari, cap de mesura d’audiéncia. Lo site garda solament qualques reglatges dins ton navigator : la lenga e lo tèma causits, ta progression dins las leiçons, ton quasernet de mots, e lo fach qu’ajas ja vist certans messatges d’acuèlh. Se siás connectat, ton navigator garda tanben ta connexion, e ta progression e ton quasernet son tanben gardats dins ton compte. Aquelas informacions servisson solament a far foncionar lo site, pas jamai a t’identificar ni a te seguir.',
			roleBasa: 'basa de donadas e autentificacion',
			roleAlbergament: 'albergament, e mandadís dels messatges del formulari de contacte',
			tiersT: 'Ressorsas cargadas d’autres sites',
			tiers:
				'Certanas paginas cargan d’elements albergats endacòm mai, çò que transmet ton adreça IP a aquestes servicis : los fonses de carta (OpenStreetMap e sa version occitana OSM-bzh, OpenTopoMap, fòtos aerianas de l’IGN e del PNOA espanhòl), la recèrca de comunas quand tapas un luòc (API Adresse, Photon), las vidèos, las musicas e las ràdios que causisses de lançar (YouTube en mòde sens cookies, Deezer, Canva, las ràdios en occitan) e las faulas de l’Atlas sonòr de las lengas regionalas (LISN, Universitat Paris-Saclay) que causisses d’escotar sus la carta. Las poliças de caractèrs e las icònas, elas, son servidas per aqueste site : cap de requèsta cap a Google.',
			droitsT: 'Tos dreches',
			droits:
				'Pòdes a tot moment demandar de consultar tas donadas, las corregir, las escafar, las recuperar dins un format legible, o retirar ton consentiment a las respònsas facultativas. Escriu a {email} : la respònsa arriba jos un mes.',
			cnilT: 'En cas de desacòrd',
			cnil: 'Se una respònsa te satisfà pas, pòdes sasir la CNIL :'
		},
		es: {
			titre: 'Política de privacidad',
			maj: 'Última actualización',
			intro:
				'Lo Ligam recoge lo estrictamente necesario para que el aprendizaje funcione. No se vende ningún dato y no se instala ningún rastreador publicitario.',
			responsableT: 'Quién es responsable',
			responsable: 'El responsable del tratamiento es {nom}, contactable en {email}.',
			collecteT: 'Qué se recoge',
			collecte: [
				[
					'Tu cuenta',
					'Dirección de correo electrónico y contraseña, para reconocerte de una visita a otra. La contraseña nunca es legible: nuestro proveedor la almacena cifrada.'
				],
				[
					'Tu perfil',
					'Seudónimo (obligatorio) y, de forma totalmente opcional: género, tramo de edad, categoría profesional, lugar donde vives, lo que te interesa del occitano. Puedes no rellenar nada.'
				],
				[
					'Tu progreso',
					'La lección en curso, tu avance y tus puntos, para permitirte retomarlo donde lo dejaste.'
				],
				[
					'Tu mensaje',
					'Si me escribes mediante el formulario de contacto: tu dirección de correo electrónico, tu nombre si lo das y tu mensaje. Los recibo por correo electrónico para poder responderte; el sitio no guarda ninguna copia. El correo se borra de mi buzón como máximo al cabo de un año.'
				],
				[
					'Tus respuestas antes de una primera clase',
					'Si rellenas el cuestionario antes de una primera clase por videollamada: tu dirección de correo electrónico, tu nombre de pila si lo das y tus respuestas (nivel, motivos, lenguas, lugar, ritmo, deseos, mensaje). Las recibo por correo electrónico para preparar la clase; el sitio no guarda ninguna copia. El correo se borra de mi buzón como máximo al cabo de un año.'
				],
				[
					'Tus ideas',
					'Si envías una idea al buzón de ideas: su texto, vinculado a tu cuenta para que puedas encontrarla y eliminarla. Solo yo la leo, sin saber quién la envía. Se borra cuando la eliminas, cuando se elimina tu cuenta y, como máximo, al cabo de dos años.'
				],
				[
					'Tus comentarios sobre las lecciones',
					'Si dejas un comentario sobre una lección, durante la revisión: su texto, el lugar de la página que tocas y tu nombre de pila si lo das. Sin cuenta. Solo yo los leo, con la ayuda de Claude, la inteligencia artificial de Anthropic, para corregirlos. Se borran como máximo al cabo de un año.'
				]
			],
			pourquoiT: 'Por qué y con qué base',
			pourquoi:
				'La cuenta y el progreso se basan en la ejecución del servicio que solicitas. Las respuestas opcionales del cuestionario se basan en tu consentimiento: sirven únicamente para entender quién aprende occitano, nunca para segmentarte. Las ideas también se basan en tu consentimiento: tú eliges enviarlas y puedes retirarlas. Los comentarios también.',
			ageT: 'Edad mínima',
			age: 'La creación de cuenta está reservada a las personas de 15 años o más.',
			dureeT: 'Durante cuánto tiempo',
			duree:
				'Tus datos se conservan mientras tu cuenta exista. Si solicitas su eliminación, se borran, incluido tu progreso.',
			quiT: 'Quién más tiene acceso',
			qui: 'Nadie, salvo los proveedores técnicos necesarios para el funcionamiento del sitio:',
			juridiccion:
				'Una precisión que preferimos decir con claridad: tus datos se almacenan en servidores situados en la Unión Europea, pero la empresa que gestiona la base de datos es estadounidense. Por tanto, las autoridades de Estados Unidos pueden, en derecho, solicitar acceso a ellos (es lo que se llama CLOUD Act). El alojamiento del sitio, en cambio, es francés. Buscamos un proveedor europeo para la base de datos; a día de hoy ninguno reúne la madurez y la compatibilidad necesarias.',
			cookiesT: 'Rastreadores y almacenamiento',
			cookies:
				'Ningún rastreador publicitario, ninguna medición de audiencia. El sitio solo guarda unos pocos ajustes en tu navegador: la lengua y el tema elegidos, tu progreso en las lecciones, tu cuaderno de palabras y el hecho de que ya hayas visto ciertos mensajes de bienvenida. Si has iniciado sesión, tu navegador guarda también tu conexión, y tu progreso y tu cuaderno se guardan además en tu cuenta. Esta información solo sirve para que el sitio funcione, nunca para identificarte ni para seguirte.',
			roleBasa: 'base de datos y autenticación',
			roleAlbergament: 'alojamiento y envío de los mensajes del formulario de contacto',
			tiersT: 'Recursos cargados desde otros sitios',
			tiers:
				'Algunas páginas cargan elementos alojados en otros lugares, lo que transmite tu dirección IP a esos servicios: los mapas base (OpenStreetMap y su versión occitana OSM-bzh, OpenTopoMap, fotos aéreas del IGN y del PNOA español), la búsqueda de municipios cuando escribes un lugar (API Adresse, Photon), los vídeos, las músicas y las radios que eliges reproducir (YouTube en modo sin cookies, Deezer, Canva, las radios en occitano; para las músicas y las radios, una frase te avisa antes) y las grabaciones del Atlas sonoro de las lenguas regionales (LISN, Université Paris-Saclay) que eliges escuchar en el mapa. Las fuentes tipográficas y los iconos, en cambio, los sirve este sitio: ninguna petición a Google.',
			droitsT: 'Tus derechos',
			droits:
				'Puedes solicitar en cualquier momento consultar tus datos, corregirlos, borrarlos, recuperarlos en un formato legible o retirar tu consentimiento a las respuestas opcionales. Escribe a {email}: la respuesta llega en el plazo de un mes.',
			cnilT: 'En caso de desacuerdo',
			cnil: 'Si una respuesta no te satisface, puedes acudir a la CNIL:'
		},
		en: {
			titre: 'Privacy policy',
			maj: 'Last updated',
			intro:
				'Lo Ligam collects only what is strictly necessary to make learning work. No data is sold, and no advertising tracker is installed.',
			responsableT: 'Who is responsible',
			responsable: 'The data controller is {nom}, who can be contacted at {email}.',
			collecteT: 'What is collected',
			collecte: [
				[
					'Your account',
					'Email address and password, so that we can recognise you from one visit to the next. The password is never readable: it is stored in encrypted form by our service provider.'
				],
				[
					'Your profile',
					'Nickname (required) and, entirely optionally: gender, age range, occupational category, place of residence, what interests you about Occitan. You can leave everything blank.'
				],
				[
					'Your progress',
					'The lesson in progress, your advancement and your points, so that you can pick up where you left off.'
				],
				[
					'Your message',
					'If you write to me via the contact form: your email address, your name if you give it, and your message. I receive them by email so that I can reply to you; the site keeps no copy. The email is deleted from my mailbox after one year at the latest.'
				],
				[
					'Your answers before a first lesson',
					'If you fill in the questionnaire before a first video lesson: your email address, your first name if you give it, and your answers (level, reasons, languages, place, pace, wishes, message). I receive them by email to prepare the lesson; the site keeps no copy. The email is deleted from my mailbox after one year at the latest.'
				],
				[
					'Your ideas',
					'If you send an idea to the idea box: its text, linked to your account so that you can find it again and delete it. I am the only one who reads it, without knowing who sends it. It is deleted when you delete it, when your account is deleted, and after two years at the latest.'
				],
				[
					'Your comments on the lessons',
					'If you leave a comment on a lesson, during proofreading: its text, the place on the page you touch, and your first name if you give it. No account. I am the only one who reads them, with the help of Claude, Anthropic’s artificial intelligence, to correct them. They are deleted after one year at the latest.'
				]
			],
			pourquoiT: 'Why, and on what basis',
			pourquoi:
				'The account and progress are based on performing the service you request. The optional answers in the questionnaire are based on your consent: they are used only to understand who is learning Occitan, never to target you. Ideas are also based on your consent: you choose to send them, and you can withdraw them. The same goes for comments.',
			ageT: 'Minimum age',
			age: 'Creating an account is restricted to people aged 15 or over.',
			dureeT: 'For how long',
			duree:
				'Your data is kept for as long as your account exists. If you ask for it to be deleted, it is erased, including your progress.',
			quiT: 'Who else has access',
			qui: 'No one, apart from the technical providers necessary for the site to work:',
			juridiccion:
				'A point we prefer to state clearly: your data is stored on servers located in the European Union, but the company that manages the database is American. The authorities of the United States can therefore, in law, request access to it (this is what is known as the CLOUD Act). The hosting of the site itself is French. We are looking for a European provider for the database; none currently combines the maturity and compatibility required.',
			cookiesT: 'Trackers and storage',
			cookies:
				'No advertising tracker, no audience measurement. The site only keeps a few settings in your browser: the language and theme you chose, your progress in the lessons, your word notebook, and the fact that you have already seen certain welcome messages. If you are signed in, your browser also keeps your sign-in, and your progress and notebook are also saved in your account. This information is only used to make the site work, never to identify or follow you.',
			roleBasa: 'database and authentication',
			roleAlbergament: 'hosting, and sending of the contact form messages',
			tiersT: 'Resources loaded from other sites',
			tiers:
				'Some pages load elements hosted elsewhere, which transmits your IP address to those services: the base maps (OpenStreetMap and its Occitan version OSM-bzh, OpenTopoMap, aerial photos from the IGN and the Spanish PNOA), the search for municipalities when you type a place (API Adresse, Photon), the videos, music and radio stations you choose to play (YouTube in cookie-free mode, Deezer, Canva, radio stations in Occitan; for music and radio, a sentence warns you beforehand) and the recordings of the Sound Atlas of regional languages (LISN, Université Paris-Saclay) that you choose to listen to on the map. The fonts and icons, on the other hand, are served by this site: no request to Google.',
			droitsT: 'Your rights',
			droits:
				'You can at any time ask to see your data, correct it, erase it, retrieve it in a readable format, or withdraw your consent to the optional answers. Write to {email}: the reply comes within one month.',
			cnilT: 'In case of disagreement',
			cnil: 'If a reply does not satisfy you, you can refer the matter to the CNIL:'
		},
		ca: {
			titre: 'Política de privadesa',
			maj: 'Darrera actualització',
			intro:
				'Lo Ligam recull només el que és estrictament necessari perquè l’aprenentatge funcioni. No es ven cap dada i no s’instal·la cap rastrejador publicitari.',
			responsableT: 'Qui n’és el responsable',
			responsable: 'El responsable del tractament és {nom}, que es pot contactar a {email}.',
			collecteT: 'Què es recull',
			collecte: [
				[
					'El teu compte',
					'Adreça electrònica i contrasenya, per reconèixer-te d’una visita a l’altra. La contrasenya no és mai llegible: la guarda xifrada el nostre proveïdor.'
				],
				[
					'El teu perfil',
					'Pseudònim (obligatori) i, de manera totalment opcional: gènere, franja d’edat, categoria professional, lloc de residència, el que t’interessa de l’occità. Pots no emplenar res.'
				],
				[
					'El teu progrés',
					'La lliçó en curs, el teu avenç i els teus punts, per permetre’t reprendre on ho havies deixat.'
				],
				[
					'El teu missatge',
					'Si m’escrius pel formulari de contacte: la teva adreça electrònica, el teu nom si el dones i el teu missatge. Els rebo per correu electrònic per poder respondre’t; el web no en guarda cap còpia. El correu s’esborra de la meva bústia com a molt tard al cap d’un any.'
				],
				[
					'Les teves respostes abans d’una primera classe',
					'Si emplenes el qüestionari abans d’una primera classe per videotrucada: la teva adreça electrònica, el teu nom de pila si el dones i les teves respostes (nivell, motius, llengües, lloc, ritme, desitjos, missatge). Les rebo per correu electrònic per preparar la classe; el web no en guarda cap còpia. El correu s’esborra de la meva bústia com a molt tard al cap d’un any.'
				],
				[
					'Les teves idees',
					'Si envies una idea a la bústia d’idees: el seu text, lligat al teu compte perquè la puguis tornar a trobar i suprimir. Només jo la llegeixo, sense saber qui l’envia. S’esborra quan la suprimeixes, quan se suprimeix el teu compte i, com a molt tard, al cap de dos anys.'
				],
				[
					'Les teves remarques sobre les lliçons',
					'Si deixes una remarca sobre una lliçó, durant la revisió: el seu text, l’indret de la pàgina que toques i el teu nom de pila si el dones. Sense compte. Només jo les llegeixo, amb l’ajuda de Claude, la intel·ligència artificial d’Anthropic, per corregir-les. S’esborren com a molt tard al cap d’un any.'
				]
			],
			pourquoiT: 'Per què, i amb quina base',
			pourquoi:
				'El compte i el progrés es basen en l’execució del servei que demanes. Les respostes opcionals del qüestionari es basen en el teu consentiment: serveixen únicament per entendre qui aprèn occità, mai per segmentar-te. Les idees també es basen en el teu consentiment: tu decideixes enviar-les i les pots retirar. Les remarques també.',
			ageT: 'Edat mínima',
			age: 'La creació de compte està reservada a les persones de 15 anys o més.',
			dureeT: 'Durant quant de temps',
			duree:
				'Les teves dades es conserven mentre el teu compte existeixi. Si en demanes la supressió, s’esborren, progrés inclòs.',
			quiT: 'Qui més hi té accés',
			qui: 'Ningú, tret dels proveïdors tècnics necessaris per al funcionament del web:',
			juridiccion:
				'Una precisió que preferim dir amb claredat: les teves dades s’emmagatzemen en servidors situats a la Unió Europea, però l’empresa que gestiona la base de dades és estatunidenca. Per tant, les autoritats dels Estats Units poden, en dret, demanar-ne l’accés (és el que s’anomena CLOUD Act). L’allotjament del web, en canvi, és francès. Cerquem un proveïdor europeu per a la base de dades; cap reuneix avui la maduresa i la compatibilitat necessàries.',
			cookiesT: 'Rastrejadors i emmagatzematge',
			cookies:
				'Cap rastrejador publicitari, cap mesura d’audiència. El web només guarda uns quants ajustos al teu navegador: la llengua i el tema triats, el teu progrés a les lliçons, el teu quadern de paraules i el fet que ja hagis vist certs missatges de benvinguda. Si has iniciat la sessió, el navegador també guarda la teva connexió, i el teu progrés i el teu quadern es desen a més al teu compte. Aquesta informació només serveix perquè el web funcioni, mai per identificar-te ni per seguir-te.',
			roleBasa: 'base de dades i autenticació',
			roleAlbergament: 'allotjament i enviament dels missatges del formulari de contacte',
			tiersT: 'Recursos carregats des d’altres llocs',
			tiers:
				'Algunes pàgines carreguen elements allotjats en altres llocs, cosa que transmet la teva adreça IP a aquests serveis: els mapes de fons (OpenStreetMap i la seva versió occitana OSM-bzh, OpenTopoMap, fotos aèries de l’IGN i del PNOA espanyol), la cerca de municipis quan escrius un lloc (API Adresse, Photon), els vídeos, les músiques i les ràdios que tries d’iniciar (YouTube en mode sense galetes, Deezer, Canva, les ràdios en occità; per a les músiques i les ràdios, una frase t’avisa abans) i els enregistraments de l’Atles sonor de les llengües regionals (LISN, Université Paris-Saclay) que tries d’escoltar al mapa. Les fonts tipogràfiques i les icones, en canvi, les serveix aquest web: cap petició a Google.',
			droitsT: 'Els teus drets',
			droits:
				'Pots en qualsevol moment demanar de consultar les teves dades, corregir-les, esborrar-les, recuperar-les en un format llegible o retirar el teu consentiment a les respostes opcionals. Escriu a {email}: la resposta arriba en el termini d’un mes.',
			cnilT: 'En cas de desacord',
			cnil: 'Si una resposta no et satisfà, pots adreçar-te a la CNIL:'
		},
		ar: {
			titre: 'سياسة الخصوصية',
			maj: 'آخر تحديث',
			intro:
				'يجمع Lo Ligam الحدّ الأدنى اللازم فقط لتشغيل التعلّم. لا تُباع أي بيانات، ولا تُثبَّت أي أداة تتبّع إعلانية.',
			responsableT: 'من المسؤول',
			responsable: 'المسؤول عن معالجة البيانات هو {nom}، ويمكن التواصل معه على {email}.',
			collecteT: 'ما الذي يُجمع',
			collecte: [
				[
					'حسابك',
					'عنوان البريد الإلكتروني وكلمة المرور، لنتعرّف عليك من زيارة إلى أخرى. كلمة المرور لا تكون مقروءة أبدًا: يخزّنها مزوّدنا بشكل مشفَّر.'
				],
				[
					'ملفّك الشخصي',
					'الاسم المستعار (إلزامي)، وبشكل اختياري تمامًا: الجنس، والفئة العمرية، والفئة المهنية، ومكان الإقامة، وما يهمّك في الأوكسيتانية. ويمكنك ألّا تدخل أي معلومة.'
				],
				[
					'تقدّمك',
					'الدرس الجاري ومدى تقدّمك ونقاطك، لتتمكّن من المتابعة من حيث توقّفت.'
				],
				[
					'رسالتك',
					'عند مراسلتي عبر نموذج التواصل: عنوان بريدك الإلكتروني، واسمك إن ذكرته، ورسالتك. أتلقّاها عبر البريد الإلكتروني لأتمكّن من الرد عليك، ولا يحتفظ الموقع بأي نسخة منها. وتُحذف الرسالة من بريدي بعد سنة على أبعد تقدير.'
				],
				[
					'إجاباتك قبل الدرس الأول',
					'عند ملء الاستبيان قبل الدرس الأول عبر الفيديو: عنوان بريدك الإلكتروني، واسمك الأول إن ذكرته، وإجاباتك (المستوى، والأسباب، واللغات، والمكان، والوتيرة، والرغبات، والرسالة). أتلقّاها عبر البريد الإلكتروني لأحضّر الدرس، ولا يحتفظ الموقع بأي نسخة منها. وتُحذف الرسالة من بريدي بعد سنة على أبعد تقدير.'
				],
				[
					'اقتراحاتك',
					'عند إرسال اقتراح إلى صندوق الاقتراحات: نصّه، مرتبطًا بحسابك ليسهل عليك العثور عليه وحذفه. أنا وحدي من يقرؤه، دون أن أعرف من أرسله. ويُمحى عند حذفك له، وعند حذف حسابك، وبعد سنتين على أبعد تقدير.'
				],
				[
					'ملاحظاتك على الدروس',
					'عند ترك ملاحظة على درس أثناء المراجعة: نصّها، والموضع الذي تنقر عليه من الصفحة، واسمك الأول إن ذكرته. بلا حساب. أنا وحدي من يقرؤها، بمساعدة Claude، الذكاء الاصطناعي من Anthropic، لتصحيحها. وتُمحى بعد سنة على أبعد تقدير.'
				]
			],
			pourquoiT: 'لماذا، وعلى أي أساس',
			pourquoi:
				'يقوم الحساب والتقدّم على تنفيذ الخدمة التي تطلبها. أما الإجابات الاختيارية في الاستبيان فتقوم على موافقتك: فهي تُستخدم فقط لفهم من يتعلّم الأوكسيتانية، ولا تُستخدم أبدًا لاستهدافك. وتقوم الاقتراحات أيضًا على موافقتك: فأنت من يختار إرسالها، ويمكنك سحبها. وكذلك الملاحظات.',
			ageT: 'الحدّ الأدنى للسن',
			age: 'إنشاء الحساب مخصّص للأشخاص الذين بلغوا 15 سنة أو أكثر.',
			dureeT: 'مدّة الاحتفاظ بالبيانات',
			duree:
				'تُحفظ بياناتك ما دام حسابك قائمًا. وعند طلب حذفه تُمحى البيانات، بما فيها تقدّمك.',
			quiT: 'من غيرنا يمكنه الاطّلاع عليها',
			qui: 'لا أحد، باستثناء المزوّدين التقنيين اللازمين لتشغيل الموقع:',
			juridiccion:
				'توضيح نفضّل قوله بصراحة: تُخزَّن بياناتك على خوادم تقع في الاتحاد الأوروبي، لكن الشركة التي تدير قاعدة البيانات أمريكية. ولذلك يمكن لسلطات الولايات المتحدة، من حيث القانون، أن تطلب الوصول إليها (وهو ما يُعرف باسم CLOUD Act). أما استضافة الموقع نفسه فهي فرنسية. ونبحث عن مزوّد أوروبي لقاعدة البيانات، ولا يجمع أي منهم حتى اليوم النضج والتوافق اللازمين.',
			cookiesT: 'أدوات التتبّع والتخزين',
			cookies:
				'لا أدوات تتبّع إعلانية ولا قياس للزيارات. يحتفظ الموقع فقط ببعض الإعدادات في متصفحك: اللغة والمظهر اللذان اخترتهما، وتقدّمك في الدروس، ودفتر كلماتك، وكونك قد رأيت بعض رسائل الترحيب. وإذا كنت متصلًا بحسابك، يحتفظ متصفحك أيضًا باتصالك، ويُحفظ تقدّمك ودفترك كذلك في حسابك. لا تُستخدم هذه المعلومات إلا لتشغيل الموقع، وليس للتعرّف عليك أو تتبّعك.',
			roleBasa: 'قاعدة البيانات والمصادقة',
			roleAlbergament: 'الاستضافة، وإرسال رسائل نموذج التواصل',
			tiersT: 'موارد تُحمَّل من مواقع أخرى',
			tiers:
				'تحمّل بعض الصفحات عناصر مستضافة في مكان آخر، مما ينقل عنوان IP الخاص بك إلى تلك الخدمات: خرائط الأساس (OpenStreetMap ونسختها الأوكسيتانية OSM-bzh، وOpenTopoMap، وصور IGN الجوية، وصور PNOA الإسبانية)، والبحث عن البلديات حين تكتب اسم مكان (API Adresse وPhoton)، والفيديوهات والموسيقى والإذاعات التي تختار تشغيلها (YouTube بوضع بلا ملفات تعريف الارتباط، وDeezer، وCanva، والإذاعات الناطقة بالأوكسيتانية؛ وبالنسبة إلى الموسيقى والإذاعات، تنبّهك جملة قبل ذلك)، وتسجيلات الأطلس الصوتي للغات الجهوية (LISN وUniversité Paris-Saclay) التي تختار الاستماع إليها على الخريطة. أما الخطوط والأيقونات فيقدّمها هذا الموقع نفسه، ولا يُرسَل أي طلب إلى Google.',
			droitsT: 'حقوقك',
			droits:
				'يمكنك في أي وقت طلب الاطّلاع على بياناتك، أو تصحيحها، أو محوها، أو استرجاعها بصيغة مقروءة، أو سحب موافقتك على الإجابات الاختيارية. ويمكنك مراسلتنا على {email}، وسيصلك الرد في غضون شهر.',
			cnilT: 'في حال عدم الاتفاق',
			cnil: 'إذا لم تقتنع بأحد الردود، يمكنك اللجوء إلى اللجنة الوطنية للمعلوماتية والحريات (CNIL)‏:'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);
	// espace avant les deux-points : seulement en occitan et en français
	let dp = $derived(lang === 'oc' || lang === 'fr' ? ' :' : ':');
	// « Union européenne » : legal.js ne la donne qu'en occitan et en français
	const regioUE = { es: 'Unión Europea', en: 'European Union', ca: 'Unió Europea', ar: 'الاتحاد الأوروبي' };

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
		<p class="maj">{tx.maj}{dp} {dataMiseAJour}</p>
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
					{#if baseDonnadas.region}({baseDonnadas.region[lang] ?? regioUE[lang] ?? baseDonnadas.region.fr}){/if}
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
		background: var(--color-cream);
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
