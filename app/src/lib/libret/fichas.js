// Les fiches du Livret technique (page privée /admin/libret). Une fiche = une brique du plan.
// Pour AJOUTER une fiche : un objet de plus dans FICHAS (id sans espace) ET une brique du même `id`
// dans le plan SVG de app/src/routes/admin/libret/+page.svelte (le test fichas.test.js les croise).
// Pour MODIFIER : changer le texte ici ; texte brut seulement, jamais de HTML.
// Chaque terme technique employé dans une fiche va dans `mots` ({ mot, explication }), en français simple.
// Une fiche change à chaque décision technique : mettre à jour la date de la page en même temps.
export const FICHAS = [
	{
		id: 'site',
		titol: 'Le site',
		imatge: "C'est la boutique : ce que les gens voient quand ils poussent la porte de loligam.eu.",
		quoi: "Les pages, la carte, les jeux, ton espace d'administration. Il est construit avec SvelteKit, un outil qui fabrique des pages légères et rapides.",
		ou: "Chez Scaleway, à Paris (entreprise française). Il tourne dans un conteneur : une boîte fermée qui contient le site et tout ce qu'il lui faut pour marcher.",
		tombe: "Plus personne ne voit loligam.eu. Rien n'est perdu : le code est dans le coffre, les données dans le classeur. On relance une livraison.",
		retenir: "8 et 9 août : SvelteKit et Scaleway Paris. 15 octobre : l'adresse loligam.eu.",
		mots: [{ mot: 'conteneur', explication: "une boîte fermée qui contient le site et tout ce qu'il lui faut pour marcher" }]
	},
	{
		id: 'base',
		titol: 'La base de données',
		imatge: "C'est le grand classeur à tiroirs, avec une serrure sur chaque tiroir.",
		quoi: "Tout ce qui change sans toucher au code : les comptes, les textes que tu modifies avec « Editar », tes notes de « Per tu », les données de la carte.",
		ou: "Chez Supabase, sur des serveurs dans l'Union européenne. L'entreprise est américaine : c'est pour cela qu'une migration vers un hébergeur européen reste une question ouverte.",
		tombe: "Le site s'affiche encore avec ses textes de secours (le « filet »), mais plus de connexion, plus de modification, plus de notes.",
		retenir: "Les serrures s'appellent RLS : des règles qui disent qui peut lire ou écrire chaque ligne. C'est le seul rempart de l'administration (août).",
		mots: [{ mot: 'RLS', explication: 'des règles qui disent qui peut lire ou écrire chaque ligne' }]
	},
	{
		id: 'livraison',
		titol: 'La livraison',
		imatge: "C'est le camion qui part tout seul dès qu'un colis arrive au coffre.",
		quoi: "Quand un changement du site arrive sur la version principale, GitHub fabrique une nouvelle boîte du site et l'envoie à Scaleway. Personne n'a de bouton à presser.",
		ou: 'Chez GitHub pour la fabrication, puis à Paris chez Scaleway.',
		tombe: 'Le site en ligne reste tel quel, sur l\'ancienne version. Les changements attendent dans le coffre.',
		retenir: 'Seuls les changements du dossier du site déclenchent le camion. Modifier un document de pilotage ne relance rien.',
		mots: []
	},
	{
		id: 'github',
		titol: 'GitHub',
		imatge: "C'est le coffre qui garde chaque version du projet, avec la date et l'auteur de chaque changement.",
		quoi: "Il sauvegarde le projet et sert de seul lien entre tes ordinateurs et les différentes discussions d'IA. « Pousser » veut dire : déposer ses changements au coffre.",
		ou: 'Chez GitHub, qui appartient à Microsoft (États-Unis).',
		tombe: "Tes ordinateurs gardent chacun une copie complète. On ne peut plus synchroniser ni livrer tant qu'il n'est pas revenu.",
		retenir: 'Le dépôt est encore public. Le rendre privé est dans ta liste avant le lancement.',
		mots: []
	},
	{
		id: 'dossier',
		titol: 'Le dossier du projet',
		imatge: "C'est l'atelier : l'endroit où l'on fabrique avant de montrer.",
		quoi: "Une copie complète du projet sur ton ordinateur. L'IA y travaille, y essaie le site, puis pousse au coffre.",
		ou: 'Sur ton ordinateur, dans le dossier Depots, hors de Documents. Les fichiers lourds (vidéos, photos brutes) restent à part, sauvegardés par Proton Drive.',
		tombe: "On le refait en recopiant le coffre. Seuls le trousseau de clés et les fichiers lourds ne sont pas dans le coffre.",
		retenir: "24 octobre : sorti de Documents, parce que Proton Drive abîmait l'historique.",
		mots: []
	},
	{
		id: 'cles',
		titol: 'Le trousseau de clés',
		imatge: "C'est le trousseau accroché dans l'atelier : il ne sort jamais.",
		quoi: "Un petit fichier qui contient les clés du projet : celle du dictionnaire de lo Congrès, celle qui laisse l'IA modifier les textes des pages.",
		ou: "Sur ton ordinateur seulement. Il n'est jamais envoyé au coffre ni affiché dans une discussion.",
		tombe: "Sans lui, l'IA ne peut ni relever « Per tu », ni vérifier un mot, ni écrire dans le classeur. C'est ce qui manque aux séances lancées depuis le téléphone.",
		retenir: 'Une clé écrite dans une discussion est une clé à changer.',
		mots: []
	},
	{
		id: 'ia',
		titol: "L'équipe d'IA",
		imatge: "C'est un chef de chantier et ses compagnons : il pense le plan, ils posent les pierres.",
		quoi: "L'amic prépare chaque tâche par écrit, la confie au modèle le moins coûteux qui suffit, puis relit le résultat. Mistral vient en soutien quand tu le demandes.",
		ou: 'Claude est un service d\'Anthropic (États-Unis). Mistral est français.',
		tombe: 'Le site continue de tourner sans elle. Tu gardes la main sur les textes, les images et les couleurs depuis le site.',
		retenir: '13 novembre : méthode L\'amic. 6 novembre : Claude garde la main, Mistral en soutien.',
		mots: []
	},
	{
		id: 'congres',
		titol: 'Lo Congrès',
		imatge: "C'est le dictionnaire de référence qu'on ouvre avant d'écrire un mot.",
		quoi: "L'IA y vérifie chaque mot d'occitan avant de te le montrer. Toi, tu valides ensuite : c'est toujours toi qui as le dernier mot.",
		ou: 'Un service en ligne de lo Congrès permanent de la lenga occitana.',
		tombe: "L'IA ne peut plus vérifier. Elle doit le dire et attendre, pas deviner.",
		retenir: "29 août : ce dictionnaire sert à concevoir et à vérifier seulement. Le site ne l'interroge pas pour les visiteurs.",
		mots: []
	},
	{
		id: 'voix',
		titol: 'La voix',
		imatge: "C'est un petit studio d'enregistrement : ta voix y entre brute, elle en sort nettoyée et légère.",
		quoi: "Tu enregistres chaque phrase du parcours avec ton téléphone, depuis la page « Voix » de ton espace d'administration. Un script la rend propre : même volume pour toutes les phrases, silences du début et de la fin coupés, fichier très léger. La leçon peut alors la jouer.",
		ou: "Trajet d'une phrase : ton téléphone l'envoie dans un dossier privé chez Supabase (toi seul y accèdes) ; sur ton ordinateur, un double-clic sur « voix-polir » la télécharge, la nettoie avec ffmpeg et la range dans le dossier du site ; une fois le changement déposé au coffre, la livraison la met en ligne.",
		tombe: "Les boutons de son disparaissent des leçons : le texte reste là. Tes prises brutes restent dans le dossier privé, rien n'est perdu ; on relance la mise au propre.",
		retenir: "13 novembre : une phrase = un fichier, nommé d'après la phrase elle-même. Si une phrase est corrigée, elle change de nom et devient « à refaire ». Le script ne retraite que ce qui a changé. Il lit le dossier privé avec un compte à part, qui ne peut que lire.",
		mots: [
			{ mot: 'ffmpeg', explication: "un outil gratuit, installé sur ton ordinateur, qui traite le son et la vidéo" },
			{ mot: 'AAC (m4a)', explication: "un format de son compressé : il garde la voix nette dans un fichier très léger" },
			{ mot: 'script', explication: "un petit programme qui enchaîne des étapes à ta place" }
		]
	},
	{
		id: 'courriels',
		titol: 'Les courriels',
		imatge: "C'est le facteur du site.",
		quoi: 'Il envoie les messages du formulaire de contact et les courriels des comptes.',
		ou: 'Chez Scaleway, en France.',
		tombe: 'Les comptes et le site marchent, mais aucun message ne part.',
		retenir: 'Sa clé expire le 25 octobre 2027 : à renouveler avant.',
		mots: []
	}
];
