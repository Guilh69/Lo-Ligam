# Cahier des charges — Lo Ligam
### Application d'apprentissage de l'occitan et communauté occitane en ligne

> **Document vivant.** C'est notre source de vérité. On le met à jour à chaque décision tranchée.
> Version : 0.6 · Dernière mise à jour : 18 septembre 2026
> (v0.5 : 31 juillet — l'historique des décisions vit au §11)

---

## 1. Vision

Une application (et site web) qui apprend l'occitan et fait vivre l'espace occitan comme une communauté.
Deux promesses tenues en parallèle :

- **Pour les occitans** : une fierté — un outil beau, moderne et sérieux qui met leur langue à la hauteur des grandes applis.
- **Pour les non-occitans** : une curiosité — une porte d'entrée vers l'Occitanie, sa langue, son histoire et son territoire.

Trois valeurs non négociables, inscrites dès la conception (pas ajoutées après coup) : **éthique**, **écologie**, **inclusivité**.

---

## 2. Public cible

- Débutants occitans souhaitant (ré)apprendre la langue de leur territoire ou de leur famille.
- Personnes déplacées d'origine occitane, en lien affectif avec la langue.
- Curieux non occitans, francophones ou étrangers, attirés par la culture et l'histoire.
- À terme : locuteurs déjà avancés qui viennent pour la communauté, la carte et le volet participatif.

---

## 3. Périmètre et stratégie de phases

> **Principe directeur.** Le projet décrit contient en réalité cinq produits (apprentissage, réseau social,
> cartographie de données linguistiques, marketplace de cours, wiki culturel). Chacun est un vrai projet.
> On les sort par vagues. Un socle qui tient debout d'abord, puis on enrichit.

### Phase 1 — Le cœur (MVP)
- Module d'apprentissage de l'occitan **languedocien**, gamifié, animé, beau.
- Création de compte + questionnaire d'accueil.
- Relais vers les outils existants (lo Congrès, OPLO, etc.).
- Site web vitrine + version applicative. *(périmé — remplacé par la décision du 2026-08-22, §11 : un seul produit, deux registres — récit et outil ; « app » désigne le registre outil, pas une application mobile native)*
- Modèle : apprentissage autonome gratuit, avec possibilité de dons.

### Phase 2 — La visio et le soutien
- Plateforme de cours en visio avec toi (1er cours gratuit, puis tarif solidaire / classique / engagé).
- Système de paiement et statut juridique associés.

### Phase 3 — Le territoire
- Cartographie interactive des dialectes et de l'espace linguistique.
- Extraits de phrases par localité issus de l'atlas (voir §8, licence à sécuriser).
- Localisation des commerces et services où l'occitan se parle.

### Phase 4 — La communauté et la culture
- Volet participatif : partage de photos de l'occitan dans l'espace public (panneaux, signalétique, magasins…).
- Proposition d'expressions par les utilisateurs.
- Page « wikiòc » : culture, histoire, Occitanie historique.
- Dimension réseau social à part entière.

*(L'ordre des phases 2 à 4 est ajustable selon ton énergie et les opportunités — la Phase 1 est le prérequis de tout.)*

> ⚠️ **Réflexion en cours (2026-07-31, pas encore tranchée)** : la cartographie (Phase 3) pourrait devenir la toute première fonctionnalité sortie, plutôt que de suivre l'apprentissage. Si ça se confirme, ça remet en question le principe ci-dessus (« Phase 1 = prérequis de tout ») — à trancher explicitement avant de réorganiser les phases, notamment parce que la Phase 3 dépend encore d'un point juridique non résolu (licence de l'atlas, voir §8).

---

## 4. Volet linguistique (Phase 1)

- Langue de départ : **occitan languedocien**. Architecture pensée pour ajouter d'autres dialectes ensuite.
- Format d'inspiration : type Busuu / Duolingo (leçons courtes, progression, répétition espacée).
- **Notre différenciation** — ce n'est pas la mécanique de la leçon, c'est :
  - la profondeur culturelle (chaque unité ancrée dans un lieu, une histoire, une chanson) ;
  - la dimension territoriale (lien avec la carte des dialectes) ;
  - la dimension communautaire et militante (l'occitan comme langue vivante de l'espace public).
- **Gamification** : progression, séries (streaks), objectifs, badges — à concevoir en cohérence avec les valeurs (motivation positive, pas de mécaniques culpabilisantes ou addictives).
- **Point juridique** : un *format* pédagogique ne s'approprie pas. Interdiction absolue de reprendre contenus, phrases-types ou visuels d'applis existantes. On crée tout notre contenu original.

### Ressources externes — API de lo Congrès
Lo Congrès (organisme de régulation de la langue) met à disposition des API de ses ressources principales, données officielles, maintenues et à jour. Utiles pour **compléter** l'appli (elles ne remplacent pas la conception pédagogique) :
- **Basic** (dictionnaire fr↔oc) → dictionnaire intégré / recherche de mots.
- **vèrb'Òc** (conjugaison) → leçons de grammaire, conjugueur.
- **fon'Òc** (transcription phonétique) → aide à la prononciation.
- **punt de lenga** (grammaire), **sinonimes** (synonymes) → contenu d'appoint.
- **Module express'Òc** (expression aléatoire illustrée + son) → brique d'engagement (« expression du jour »).
- **Votz** (synthèse vocale, service développeurs) → audio des leçons sans tout enregistrer soi-même (voix languedocienne existante).

**Principes d'usage :**
- Contenu *de base* des leçons = embarqué (fonctionne hors ligne, indépendant des pannes). API = fonctions *annexes* (dico, conjugueur, audio) en direct.
- Ne pas créer de dépendance critique : prévoir un repli si une API est indisponible.
- Même sans intégration technique, ces ressources servent de **référence pour garantir l'exactitude** du contenu qu'on rédige.
- ⚠️ Conditions d'utilisation à vérifier (voir §8) : compatibilité avec le volet payant, attribution, clés d'accès, limites de requêtes.

---

## 5. Onboarding

- **Connexion** : email, Google (Gmail), et autres fournisseurs à définir (Apple obligatoire si publication sur l'App Store *(périmé — la décision du 2026-08-22, §11, écarte l'application mobile native : pas de publication App Store au programme)*, éventuellement France Connect à étudier).
- **Questionnaire d'accueil** : nom, prénom, âge, lieu de vie, origine (cas des personnes déplacées), motivation.
  - ⚠️ Ces données sont personnelles → obligations RGPD (voir §8). On ne collecte que le nécessaire, avec consentement clair et finalité expliquée.

---

## 6. Modèle économique

> ⚠️ **ENVISAGÉ, PAS TRANCHÉ** (requalifié le 2026-07-31) : ce qui suit est une piste de travail, pas une décision. C'est la question n°1 de la séance d'arbitrage — voir `PILOTATGE.md`.

| Volet | Modèle |
|---|---|
| Apprentissage autonome | Une bonne partie du parcours gratuite (avec dons libres possibles) ; accès complet via un paiement **solidaire / classique / engagé** |
| Cours en visio avec toi | 1er cours gratuit, puis tarif **solidaire / classique / engagé** |
| Volet communautaire / carte / wiki | Gratuit |

> ⚠️ **Mise à jour 2026-07-31** : le parcours autonome n'est plus pensé comme entièrement gratuit + dons. Nouveau modèle envisagé : une partie du parcours reste gratuite (avec dons libres), et l'accès à la **totalité** du parcours passe par un paiement solidaire (même principe classique/engagé que les cours en visio). Reste à définir : où placer la limite gratuit/payant (combien d'unités, quels critères), et si la logique solidaire est identique ou distincte de celle des cours en visio.

- Dons : envisager **HelloAsso** (adapté aux structures d'intérêt général, sans commission pour l'association) ou Stripe.
- Cours payants : nécessitent un **statut** (micro-entreprise probable au démarrage) et un prestataire de paiement. À cadrer en Phase 2.

---

## 7. Choix éthiques, écologiques et d'accessibilité

- **Hébergement bas-carbone en Europe** : pistes à comparer — Infomaniak (Suisse, engagé écologie), Scaleway/OVH (France), o2switch. Décision en §11.
- **Sobriété technique** : poids des pages maîtrisé, médias optimisés, pas de superflu énergivore.
- **Accessibilité** : viser les standards **RGAA / WCAG** (contrastes, navigation clavier, lecteurs d'écran, sous-titres des contenus audio).
- **Inclusivité** : écriture inclusive, représentation diverse dans les visuels et exemples, gratuité du cœur pour ne pas exclure par l'argent.
- **Éthique des données** : minimisation, transparence, pas de revente, pas de pistage publicitaire.

---

## 8. Contraintes juridiques et administratives (à sécuriser)

> Ce sont **tes** démarches. Je peux tout t'expliquer et t'aider à rédiger, mais les accords, comptes et déclarations t'appartiennent.

- **Licence des données de l'atlas** : ✅ source identifiée = **Atlas sonore des langues régionales de France** (réalisé par le labo LIMSI, CNRS — aujourd'hui LISN ; chercheurs Boula de Mareüil, Rilliard, Vernier). Site : atlaslisn.fr (ex-atlas.limsi.fr).
  - **Nature réelle des données** : ce n'est pas une base de phrases variées par localité, mais **la même fable (« La bise et le soleil ») lue dans ~126 points d'enquête**, avec transcription. À intégrer en gardant cette réalité en tête pour la conception de la carte.
  - ⚠️ **Licence Creative Commons BY-NC-SA 4.0** — c'est un point sensible :
    - **BY** (attribution) : on doit créditer clairement le labo et les chercheurs.
    - **NC** (pas d'usage commercial) : ⚠️ **potentiel blocage.** L'appli comporte des cours payants et des dons. Même si le cœur est gratuit, la présence d'un volet commercial peut suffire à violer la clause NC. **Action prioritaire avant la Phase 3 : contacter les auteurs (atlaslisn.fr) pour obtenir une autorisation écrite d'usage dans ce contexte**, ou isoler juridiquement le volet carte du volet payant. Ne pas intégrer ces données sans clarification.
    - **SA** (partage à l'identique) : toute réutilisation modifiée devrait être partagée sous la même licence.
- **RGPD** : questionnaire d'accueil + comptes = traitement de données personnelles. Prévoir mentions légales, politique de confidentialité, registre de traitement, consentement.
- **Paiements** : cours en visio + dons → obligations comptables et fiscales liées au statut choisi.
- **Contenu participatif** : modération des photos et expressions proposées (droit à l'image des lieux/personnes, propos inappropriés).
- **Mentions des marques/outils tiers** (lo Congrès, OPLO…) : simple relais/lien = ok, mais vérifier s'il y a intérêt à formaliser des partenariats.
- **API de lo Congrès** : ✅ ressources officielles intéressantes (dico, conjugaison, phonétique, synthèse vocale Votz…). **Action : contacter lo Congrès pour cadrer les conditions d'utilisation** *(fait le 2026-08-29, §11 : clé obtenue, 10 API self-service testées, usage limité à la conception/vérification du contenu — pas d'appel depuis le site public ; le courriel CGU formel reste à envoyer, chantier 11 de `PILOTATGE.md`)* — usage commercial autorisé (l'appli a un volet payant) ? attribution requise ? clés/inscription ? limites de requêtes ? À transformer idéalement en **partenariat**, puisqu'un relais vers eux est déjà prévu.

---

## 9. Répartition des rôles

**Ce que je fais (Claude)**
Concevoir, prototyper, coder, maquetter, rédiger le contenu pédagogique et culturel, expliquer chaque démarche pas à pas, t'aider à rédiger les demandes de licence/partenariat, cadrer le juridique et le technique.

**Ce que tu fais (toi)**
Signer les accords, créer les comptes, héberger, gérer l'argent et les déclarations, maintenir l'appli dans la durée, prendre les décisions finales, porter la vision.

---

## 10. Décisions à trancher tôt (elles impactent tout)

- [x] ~~**Graphie** : classique vs mistralienne~~ → **TRANCHÉ : norme classique.** (voir Journal §11)
- [x] ~~**Nom** de l'application~~ → **TRANCHÉ : « Lo Ligam »** (« le lien »). Vérifications à faire : domaine, marque INPI, disponibilité stores ; noter la proximité avec l'association occitaniste « Ligams ». (voir Journal §11)
- [x] ~~**Technologie** : appli native, web app, ou hybride (une base de code pour web + mobile) ?~~ → **TRANCHÉ DE FAIT : web app SvelteKit** (adapter-node), pas d'application native (décisions du 2026-08-08 et du 2026-08-22, voir Journal §11)
- [ ] **Statut juridique** pour les cours et dons (micro-entreprise, association…).
- [x] ~~**Hébergeur** définitif.~~ → **TRANCHÉ DE FAIT : Scaleway (Paris, fr-par)**, Vercel supprimé le 2026-10-07 ; base Supabase (UE) conservée, migration reportée sciemment (décisions du 2026-08-08 et du 2026-08-09, voir Journal §11)
- [ ] **Périmètre exact du MVP** : quelles leçons, combien d'unités pour un lancement crédible ?

---

## 11. Journal de décisions

> On note ici chaque choix tranché et *pourquoi*, pour ne pas tourner en rond dans six semaines.

| Date | Décision | Raison |
|---|---|---|
| 2026-07-28 | Découpage en 4 phases, MVP = apprentissage languedocien + onboarding + relais | Éviter de vouloir tout sortir d'un coup et ne rien livrer |
| 2026-07-28 | **Graphie : norme classique** | Choix structurant pour tout le contenu pédagogique |
| 2026-07-28 | Atlas identifié = Atlas sonore des langues régionales (LIMSI/LISN, CNRS), licence CC BY-NC-SA 4.0 | La clause NC crée une tension avec le volet payant → autorisation à obtenir avant Phase 3 |
| 2026-07-28 | Intégrer les API de lo Congrès (dico, conjugaison, phonétique, Votz…) comme source de données officielle, en complément (pas en remplacement) de la pédagogie | Données fiables, maintenues, à jour ; légitimité ; évite de tout réinventer. CGU à cadrer. |
| 2026-07-28 | **Nom de l'appli : « Lo Ligam »** (« le lien ») | Court, mémorisable, occitan authentique, dit la mission (relier à la langue et entre les gens). À vérifier : domaine, marque INPI, stores. Proximité à noter avec l'assoc. occitaniste « Ligams ». |
| 2026-07-28 | Séquençage des unités fondé sur des principes psycholinguistiques (fréquence, concret→lointain, blocs fonctionnels, grammaire acquise, recyclage) | Base pédagogique solide plutôt qu'un simple découpage thématique |
| 2026-07-28 | Gamification : exigence d'animations élégantes et fluides (sans sacrifier la sobriété) | Sentiment d'appli haut de gamme, cohérent avec la promesse « belle et fière » |
| 2026-07-28 | Audio : Votz d'abord, prononciation humaine reportée (« à voir après ») *(révisé le 2026-08-29, §11 : la voix de Romain porte les dialogues ; Votz reste un outil de conception/vérification, pas la voix du site)* | Démarrer sans lourd chantier d'enregistrement ; option humaine gardée ouverte |
| 2026-07-28 | Essai libre avant création de compte : OUI *(précisé le 2026-08-29, §11 : l'essai libre actuel reste en ligne **tant que le module 0 n'est pas publié** ; il est remplacé par le module 0 joué sans compte **à sa mise en ligne**, sa mécanique lettre-à-lettre survivant comme type d'exercice du moteur)* | Réduit la friction, crée l'envie avant de demander un compte |
| 2026-07-28 | Interface multilingue : occitan par défaut + français, anglais, catalan, espagnol, italien (choix au 1ᵉʳ lancement) | Fierté occitane (langue chez elle) sans perdre les débutants ; langues sœurs + portée |
| 2026-07-28 | Distinguer langue d'interface (6 langues) et langue du contenu pédagogique (à démarrer plus restreinte) | Traduire tout le contenu en 6 langues = 6× le travail ; élargir progressivement |
| 2026-07-28 | Parcours structuré CEFR (A1→…), MVP = A1 ; niveau déclaré au départ, test de placement plus tard | Cadre reconnu, progression lisible ; skip vers niveau supérieur possible quand le contenu existera |
| 2026-07-28 | Questionnaire : minimisation RGPD (nécessaire + utile + facultatif) ; vigilance âge/mineurs (consentement parental <15 ans) | Respect des données, conformité, moins de friction |
| 2026-07-28 | **Langues au MVP : occitan (défaut) + français**, interface ET contenu. Puis catalan → anglais → espagnol/italien | Démarrer simple pour lancer vite ; élargir langue par langue ; catalan priorisé (marché + langue sœur) |
| 2026-07-28 | **Âge minimum : 15 ans** | Évite le consentement parental (seuil RGPD France = 15 ans) ; simplifie le MVP |
| 2026-07-28 | Cibles : application mobile **ET** web, une seule base de code ; commencer par le plus simple *(périmé — remplacé par la décision du 2026-08-22, §11 : un seul produit, deux registres, pas d'application mobile native)* | Éviter de construire 2-3 fois ; cf. étape « choix techniques » |
| 2026-07-28 | **Identité visuelle = celle de l'Instagram Lo Ligam existant** (palette chaude terracotta/or/crème, illustrations troubadour, croix occitana, convention bilingue), adaptée aux règles d'interface | Marque déjà cohérente et reconnue ; l'app la prolonge → charte-graphique.md |
| 2026-07-28 | **Piliers UX** : animations soignées à chaque interaction (survol, clic, réussite) ; sons associés (désactivables, légers) ; humour fin par touches | Expérience captivante et chaleureuse, fidèle à la marque ; sobriété et accessibilité préservées |
| 2026-07-31 | Ouvre le site (accueil, carte des modules, essai libre, compte Supabase avec questionnaire) et le déploie en ligne (Vercel, lien privé de test) | Premier aller-retour concret pour tester sur téléphone |
| 2026-07-31 | *Réflexion ouverte, pas tranchée* : la cartographie (Phase 3) pourrait passer en premier plutôt qu'après l'apprentissage | Voir note au §3 — dépend notamment de la question juridique de la licence de l'atlas (§8), non résolue |
| 2026-07-31 | *Réflexion ouverte, pas tranchée* : le parcours autonome ne serait plus 100% gratuit — une partie resterait gratuite, l'accès complet passerait par un paiement solidaire/classique/engagé (voir §6) | Modèle économique plus soutenable que « tout gratuit + dons » seul ; reste à définir la limite gratuit/payant |
| 2026-08-03 | **Espace d'administration — vidéos : colonne `video_url` prévue, aucun envoi de MP4 en v1** | 204 MP4 ≈ 1 Go = tout le stockage gratuit, et ~50 visiteurs/mois suffiraient à épuiser les 5 Go de bande passante ; contraire à la sobriété (§valeurs). Porte laissée ouverte pour une poignée de fiches vitrines plus tard |
| 2026-08-03 | **Espace d'administration — bascule complète des 204 fiches en base, `fichas.js` gelé en filet de secours** (lu seulement si Supabase ne répond pas, jamais fusionné) | Deux sources modifiables = deux vérités et des bugs ingérables. Le filet est nécessaire : un projet Supabase gratuit se met en pause après ~1 semaine d'inactivité |
| 2026-08-03 | **Espace d'administration — les 12 Mo d'images existantes restent dans `app/static/`** ; seules les nouvelles images vont dans Supabase Storage. La base stocke une adresse, indifféremment de l'un ou l'autre | Zéro migration de fichiers risquée, zéro consommation de quota, images servies par le CDN de l'hébergeur |
| 2026-08-03 | **Espace d'administration — v1 = designs uniquement.** Sons et liens externes plus tard ; la navigation du site (`siteSections.js`) reste dans le code | Les sons n'existent pas encore (0 fichier) ; les 11 liens changent deux fois par an ; mettre la navigation en base exposerait menu, pied de page et accueil à une fausse manœuvre |
| 2026-08-03 | **Espace d'administration — sécurité : table `admins` sans aucune politique** (impossible de se déclarer admin depuis un navigateur), fonction `is_admin()`, dossier Storage plafonné à 2 Mo et **SVG interdit** | La clé publique est lisible dans le code du site : cacher la page /admin n'est pas une protection, seul le RLS l'est. Le SVG peut porter du code exécutable |
| 2026-08-04 | **RÉVISE la décision du 2026-08-03 sur la vidéo** : les MP4 sont admis, mais ils ne jouent **qu'à l'ouverture d'une fiche** — une seule à la fois. Mosaïque, tunnel et carrousel restent en images fixes | Romain veut ses animations et son ; jouer une vidéo à l'ouverture seule garde le poids maîtrisé, là où 204 vidéos en mosaïque feraient sauter le quota en quelques visiteurs. Plafond de poids à fixer après mesure d'un MP4 Canva réel |
| 2026-08-04 | **Son des vidéos : démarrage muet, bouton son bien visible, choix mémorisé** | Les navigateurs interdisent le démarrage automatique avec son — ce n'est pas un arbitrage. Un son qui part seul est aussi un défaut d'accessibilité RGAA |
| 2026-08-04 | **Espace « Òbras » : on n'héberge AUCUN extrait.** Tout passe par le lecteur officiel de la plateforme (YouTube, Bandcamp, Deezer…), chargé seulement au clic. Livres : titre, auteur, éditeur, lien librairie + commentaire de Romain ; couverture uniquement si la source l'autorise | Extraire le son d'une vidéo YouTube est interdit par leurs conditions, quelle que soit la durée, et il n'existe pas d'exception « court extrait » pour la musique en droit français. Le lecteur officiel porte les droits et rémunère les ayants droit. Le chargement au clic évite en plus de déposer leurs traceurs sans consentement (RGPD) |
| 2026-08-04 | **Lien vers l'espace d'administration visible seulement pour un administrateur** (`$lib/adminStore.js`) — confort, pas protection | Vérifié sur la configuration Supabase réelle : confirmation par e-mail **obligatoire**, aucun autre moyen de connexion. Personne ne peut créer de compte avec l'adresse de Romain sans accéder à sa boîte ; et les droits sont attachés à l'identifiant interne du compte, pas à l'adresse |
| 2026-08-06 | **Autonomie de contenu : PAS de CMS externe** (Sanity, Strapi… écartés) ; l'espace d'administration existant s'étend, contenu par contenu, dans Supabase | Le site a peu de zones de contenu, toutes structurées : un formulaire par zone rend le même service qu'un CMS sans nouvel outil à payer/héberger/maintenir, et garde une seule source de vérité. Sanity : entité US (CLOUD Act), résidence UE garantie seulement en offre Enterprise — en tension avec l'engagement européen (§7). À reconsidérer seulement si le site évolue vers beaucoup de pages de contenu libre |
| 2026-08-06 | **Textes de l'accueil en base** (`site_textes`, éditables via `/admin/textes`) ; le code ne garde que des valeurs de secours affichées si la base ne répond pas. **Règle pour toutes les conversations : un nouveau texte visible se met dans `site_textes`, pas en dur** | Concrétise la décision ci-dessus. Le semis initial reprend les textes existants → bascule invisible ; une ligne manquante retombe sur le secours, rien ne casse |
| 2026-08-06 | **Carte pilotée par la base** : còlas, couleurs de dialectes et lieux d'intérêt dans `carta_colas` / `carta_dialectes` / `carta_luocs`, gérés via `/admin/carta` et `/admin/carta/luocs` | Même logique d'autonomie ; les identifiants (`lieusInteres`, `cro`…) restent attendus par le code, d'où édition sans ajout/suppression pour les còlas et dialectes |
| 2026-08-07 | **Couches de carte GÉNÉRIQUES** (révise la ligne ci-dessus) : création complète de couches depuis `/admin/carta` — type points/zones/lignes, thématique de regroupement, style, **téléversement de GeoJSON** (bucket `cartas`, 5 Mo, WGS84 vérifié), modèle de popup `{champ}`, visibilité par défaut. **uMap écarté** comme produit (iframe hors charte, couches à refaire, export floqué compromis) mais utilisable comme brouillon : le GeoJSON circule entre QGIS/uMap et le site. Restent spéciales (code) : dialèctes, despartaments | Autonomie complète demandée par Romain, qui produit déjà ses tracés dans QGIS ; flux : QGIS/uMap → export GeoJSON EPSG:4326 → téléversement admin → style dans l'admin |
| 2026-08-08 | **Hébergement migré de Vercel (États-Unis) vers Scaleway (Paris, fr-par)** — Serverless Containers, adapter-node, image construite par GitHub Actions. Adresse actuelle : `https://ligamweb62fb7521-lo-ligam.functions.fnc.fr-par.scw.cloud`. Vercel conservé en secours tant que la base n'est pas migrée. *(Note technique du 2026-09-18 : la clé API Scaleway créée pour ce déploiement expire le **2027-08-08** — à renouveler avant cette date.)* | Engagement européen (§7) : Vercel Inc. est une entité américaine soumise au CLOUD Act. Scaleway met le site et son hébergeur sous droit français. Le mettre en œuvre tôt évite une migration sous contrainte plus tard, le site n'ayant pas de date de sortie |
| 2026-08-08 | **Configuration SvelteKit uniquement dans `svelte.config.js`** ; `vite.config.js` appelle `sveltekit()` sans options | Une configuration passée en ligne à `sveltekit()` **remplace** `svelte.config.js` au lieu de s'y ajouter. Piège coûteux : la politique de sécurité (CSP) ajoutée le 2026-08-07 était du code mort et n'a jamais été appliquée — invisible en développement, détectable seulement en lançant le serveur construit |
| 2026-08-08 | **Réglages lus au démarrage** (`$env/dynamic/public`) et non à la construction (`$env/static/public`) | Sans cela l'image du conteneur ne peut pas se construire, aucun réglage n'étant disponible à ce moment. Bénéfice : la même image peut pointer vers une autre base sans reconstruction — utile pour la migration de la base |
| 2026-08-09 | **Migration de la base de données REPORTÉE** (Supabase conservé). Région vérifiée : Union européenne. Candidats étudiés et écartés : *Eurobase OÜ* (Estonie, sur Scaleway, API proche de Supabase — mais bêta non lancée au 2026-08-09, capital 1 €, non assujettie à la TVA, import Supabase « coming soon ») ; *Nhost* (Suède, établi — mais GraphQL, donc réécriture des 84 requêtes, et l'offre gratuite met le projet en pause après 7 jours d'inactivité). **À réexaminer après le lancement d'Eurobase (26 août 2026) et quelques mois de recul** | Aucun service européen n'est à la fois mûr et compatible avec ce qu'utilise le site. Les alternatives réelles sont : tout réécrire (comptes + 84 règles d'accès à la main, là où naissent les failles, pour un projet mené seul), parier sur un fournisseur pré-lancement, ou auto-héberger — écarté, Romain ne veut pas administrer de serveur. Attendre ne coûte rien : le site n'a pas de date de sortie |
| 2026-08-09 | **La politique de confidentialité dit explicitement la nuance CLOUD Act** : région européenne mais société américaine | Beaucoup de sites masquent ce point derrière « hébergé en Europe ». Le dire est cohérent avec les valeurs du projet, et évite d'avoir à se dédire plus tard |
| 2026-08-22 | **Création du `corpus-design.md`** : état de l'art (studios/écoles), science de l'apprentissage (Mayer, Sweller, recherche Duolingo), plan daltonisme, identité méditerranéenne, checklist qualité. Référence commune à toutes les conversations pour les décisions design | Demande de Romain : « rien ne doit être laissé au hasard », refus d'un « site standard qui pourrait venir de n'importe où ». Direction retenue : structure suisse + lumière méditerranéenne + matière occitane |
| 2026-08-22 | **Mode daltonien = exigence du produit** (option à cocher dans les réglages) ; en amont, redondance icône+libellé partout et jamais la couleur seule (WCAG 1.4.1). Plan technique dans `corpus-design.md` §3 | Décision de Romain. Notre palette contient la paire terracotta/olive, la pire pour ~8 % des hommes (axe rouge-vert) ; les familles du site doivent rester distinguables sans couleur |
| 2026-08-22 | **Cadrage site/app validé : un seul produit, deux registres.** RÉCIT (accueil, carte, designs, découvrir → expressif, animé) et OUTIL (leçons, exercices, compte → sobre, charge cognitive minimale). Toute décision de design se prend en sachant dans quel registre on est. Pas d'application mobile native au programme : « app » désigne le registre outil | Levée du flou signalé par Romain ; règles détaillées dans `corpus-design.md` §6 |
| 2026-08-22 | **Système typographique tranché** (sur maquettes comparées) : **Syne** pour les titres, **Instrument Sans** pour le courant, **Cormorant Garamond italique** pour les seules citations poétiques. Fredoka survit uniquement dans le logo ; Marcellus envisagé puis écarté. Détail dans `charte-graphique.md` §2 | Décision Romain après comparaison de 3 paires (Trobador / Estudiò / Lapidari). Trois familles = limite de sobriété ; auto-hébergées en latin + latin-ext, zéro requête Google. C'est le levier n°1 du rendu professionnel demandé |
| 2026-08-22 | **Héros de l'accueil tranché : « Lo riu »** — la phrase « Lo Ligam t'acompanha » grande et centrée (Syne capitales), puis un fleuve de designs Canva défilant lentement sur deux bandes en sens opposés (~70/90 s par boucle, CSS pur, arrêt sous `prefers-reduced-motion`). Interface calmée : crème quasi uni, la couleur vient des designs ; les vagues pleines deviennent un **filet ondulé fin** (signature). Variantes écartées : mur statique, phrase seule, colonnes verticales | Choisi par Romain sur maquettes animées comparées (canvas « Acuèlh Lo Ligam »). Réconcilie ses deux exigences : compréhension immédiate (la phrase domine) et vie (les designs bougent). Applique la formule du corpus : l'interface se tait, le travail parle |
| 2026-08-22 | **Contenu de l'accueil cheminé avec Romain** : (a) les 4 familles = **cartes cliquables** sur l'accueil ; (b) chiffres **officiels et sourcés**, marqués « estimation » — ≈ 600 000 locuteurs (enquête sociolinguistique OPLO 2020, 22 départements + Val d'Aran, 7 % de la population), 32 départements + Val d'Aran + vallées italiennes, 10 siècles de littérature ; (c) la page doit être comprise par **quelqu'un qui n'a jamais entendu parler de l'occitan** → dire explicitement « langue latine », sœur du catalan ; (d) **Officialitat = annexe**, section allégée, à revoir ; (e) **chantier noté : un espace actualités** (article ou promotion, forme à définir) | Réponses de Romain au « camin » en 6 stations. Le test ultime de la page : le novice complet comprend ce qu'est l'occitan et à quoi sert le site |
| 2026-08-22 | **Architecture confirmée : UNE maison, deux ailes** (option A). Une seule adresse, un seul hébergement : le site-vitrine et l'application vivent ensemble ; l'entrée dans l'app est marquée par le *design* (transition, interface calme du registre outil), pas par un changement de domaine. L'option « deux maisons » (`app.` séparée) est écartée — redécoupable plus tard sans rien jeter si un besoin réel apparaît | Choix de Romain après comparaison des coûts : doubler l'hébergement, le déploiement et la maintenance n'apporte rien tant que le produit est unique et maintenu seul. Modèle Duolingo : vitrine et app à la même adresse |
| 2026-08-29 | **API lo Congrès connectées** (clé obtenue, 10 API self-service testées ; Votz et Revirada = clés séparées sur demande). **Rôle : conception et vérification du contenu uniquement — pas d'appel depuis le site public** (prudence de Romain sur les droits ; les CGU permettraient l'affichage avec attribution, à réexaminer si un besoin fort apparaît). Chaîne `verificar:oc` en place (Basic + vèrb'Òc) ; lexique du module 1.1 validé | Fiabilité linguistique outillée sans dépendance du site à un service tiers ni question de droits en production. Détail des 12 API et opportunités : `construction-pedagogique.md` §2-3 |
| 2026-08-29 | **Lancement du chantier « construction pédagogique » avec méthode par étapes** (A philosophie → B architecture d'expérience → C gamification → D grammaire des exercices → E production en série), une décision consignée à chaque étape avant de passer à la suivante. Document de travail : `construction-pedagogique.md` | Demande de Romain : « méthodologie irréprochable », allers-retours et sources externes plutôt qu'une production en aveugle ; éviter l'apprentissage barbant est un objectif de conception, pas un vœu |
| 2026-08-29 | **Un seul chemin d'apprentissage : le cursus** (étape B). L'essai libre actuel sera *remplacé* par le **module 0 enrichi** (« Tu l'as déjà entendu » + philosophie du lieu + aire géographique + premiers mots), joué **sans compte** dans le moteur de leçon ; `/aprene` devient le sommaire du cursus (les unités du Cicle A1 présentées comme un chemin). L'essai libre reste en ligne tel quel jusqu'à ce que le module 0 soit prêt ; sa mécanique lettre-à-lettre survit comme type d'exercice du moteur | Décision Romain. Un seul système à maintenir au lieu de deux ; la première expérience devient exactement le « premier quart d'heure » du manifeste. ⚠️ Restructure `/aprene`, construite par une autre conversation — coordination via ce document |
| 2026-08-29 | **Rythme de séance : au choix de la personne** — une étape (8-10 min) par jour ou un module entier (45-60 min) d'un coup. Un rythme *recommandé* s'appuiera sur l'objectif quotidien du questionnaire (doux / normal / intensif), sans jamais s'imposer | Décision Romain. Cohérent avec le refus de culpabilisation : le rythme s'adapte à la vie des gens, pas l'inverse |
| 2026-08-29 | **Gamification tranchée dans ses fondations (étape C)** : l'**Arbre del Ligam** (arbre unique, racines = la langue des anciens, ne fane jamais) · la **còla** de personnages de la mythologie pyrénéenne/occitane qui se débloque unité par unité, chacun portant son pays (troupe v0.1 validée : Drac, Tantugou, Hadas, Becut, Joan de l'Ors, l'Ors, Babau…) · la série = **lo Fuòc de l'ostal** (compteur de jours pratiqués + stats, foyer qui devient majestueux, **jamais éteint** — les braises restent, l'Ors fête les retours) · fogassas = récolte immédiate. Reportés : usage des crostadas, plan badges. Spécification : `gamification.md` | Décisions Romain. Chaque mécanique justifiée par le manifeste et corpus-design §2.3 (motivation identitaire et sociale, pas de peur ni compétition) ; règles non négociables : rien ne meurt, zéro classement, frontière étanche jeu/paiement |
| 2026-08-29 | **Catalogue des exercices tranché (étape D)** : socle du gabarit v0.3 (déjà dans le moteur) + 6 nouvelles mécaniques validées — l'intrus, jeux de lettres à fréquences réelles, dialogue à choix avec la còla, « Ont es ? » (carte/toponymie), rimes & virelangues, l'oreille des pays. **Écarté définitivement : « vrai mot / mot inventé »** (concept du jeu du Congrès = plagiat, décision Romain ; l'API sembla-mots n'alimente aucun jeu public). Règle d'entrée : chaque mécanique justifiée par un principe SLA **et** un rôle de plaisir. Détail : `catalogue-exercicis.md` | Décisions Romain sur inventaire proposé. Les API restent en conception/vérification ; le plaisir est un critère d'ingénierie, pas un vernis |
| 2026-08-30 | **Visuels photo : système « sang e aur » à trois niveaux** — photos de Romain détourées au double liseré terracotta #C8562E + or #E0A43B : 1) couverture de bloc (paysage, liseré sur la crête, ciel blanc — le lieu peut être évocateur plutôt que littéral), 2) vignette personnage (tour complet ; Loís, Núria… joués par des proches volontaires, **autorisation écrite de droit à l'image avant publication**), 3) image de vocabulaire (objet/thème, taille moyenne ; en petit on garde les pictos, liseré illisible < ~80 px). Recette complète (réglages Canva, poids cibles) : `charte-graphique.md` §3bis ; maquette validée : `design-stock/Fotos/maqueta.html` | Décision Romain. Refus des images IA (valeurs) sans dépendre d'un illustrateur : authenticité des vrais lieux et vraies personnes, cohérence par traitement identique, sobriété (bandeau ≤ 250 Ko, vignette ≤ 150 Ko). Piste complémentaire étudiée : commande à l'artiste occitane Camp.liure (Laurie Privat) pour les pièces d'identité visuelle |
| 2026-09-03 | **Contrainte structurante : Romain est seul** derrière l'application (pas de dizaines de locuteurs ni de correcteurs humains à court terme). Toute recommandation se classe désormais en **« phase de lancement »** (Romain + Claude suffisent) ou **« évolution possible »** (bénévoles, natifs, partenaires) ; une recommandation qui suppose une personne de plus que Romain n'est jamais bloquante pour le lancement, elle est notée « évolution » derrière un déclencheur explicite. Grille complète : `etat-de-l-art-parcours.md` §8 bis | La colonne « lancement » suffit à sortir un A1 complet et honnête, sans que rien soit à refaire quand des renforts arriveront |
| 2026-09-18 | **Transposition de la logique de centre-racine2.com actée** (référence choisie par Romain) → détail complet dans `transposicion-racine2.md` : hub→feuille, entonnoir à deux vitesses, jamais d'impasse, FAQ accordéon sur l'accueil, gabarit unique des pages leçon, frise du chemin dans le hub `/aprene`, pages A prepaus + Contacte à construire ; le kit de fluidité (blocs-déclarations surlignés, carte-héros, accordéons, barre condensée, View Transitions). Décisions du jour : **ligne de promesse** sous le héros (texte de Romain : « L'occitan se parle, s'apprend et se vit. Quel que soit ton objectif, tu es au bon endroit ! »), **second bouton héros = ancre « L'occitan, qu'es aquò ? »** vers la station La lenga, **les entrées « Lèu » du menu restent affichées** même vides (mémoire du cap, site pas publié bientôt) | Analyse 15 agents contre-vérifiée. Les décisions du 2026-08-22 (riu, typo, 6 stations, une maison) ne sont PAS rouvertes : la référence s'y glisse. Le « test de positionnement » et les portraits d'apprenants = évolution ; SEO villes, WhatsApp, compteurs = écartés |
| 2026-09-18 | **Outil de design du site : Claude Design** (application dédiée, espace « Redesign de Lo Ligam ») — Romain y choisit et construit lui-même les éléments sur canvas, sources fournies : charte graphique, site en ligne, code local. **Canva reste l'outil des images** (photos sang e aur, visuels) ; **Base44 écarté** (générateur d'applis hébergé chez Wix : remplacerait le site existant, enfermement contraire aux valeurs). Circuit : canvas validé → décision au §11 → code dans la conversation concernée. L'app Design ne voit pas les conversations Code : la synchronisation passe par les documents du dépôt | Décision Romain (« je veux migrer sur Claude Design »). Répond au besoin de construire de ses mains au lieu de recevoir du code direct ; s'appuie sur la méthode éprouvée des canvas d'août (Acuèlh, Tipografia) |
| 2026-09-30 | **Nouveau système typographique** (issu du travail sur le logo, planches comparées) : **Barrio** = logo et titres très courts uniquement · **Limelight** = titres de leçons et de sections · **Luciole ou Atkinson Hyperlegible** (choix restant) = tout le reste. REMPLACE le système du 2026-08-22 (Syne / Instrument Sans / Cormorant / Fredoka). **Luciole retenue** le même jour (française, conçue pour la malvoyance — cohérence valeurs européennes + RGAA). Reste ouvert : le sort de la voix poétique (Cormorant). Le site tourne encore sur l'ancien système : migration de `app/src/fonts.css` + `app.css` à planifier. Détail : `charte-graphique.md` §2 | Décision Romain. Barrio limité aux mots très courts car capitales seules et graisses irrégulières ; corps de texte confié à une police conçue pour la malvoyance, cohérente avec l'exigence RGAA |
| 2026-09-30 | **Nouveau logo officiel : la croix-constellation**, dessiné par Romain (croix occitane en points reliés, 12 pommettes + moyeu — « le lien qui fait la croix »). Système complet en 7 SVG vectoriels : `design-stock/logo/svg/` (symbole seul / carré / vertical / horizontal, en couleur, blanc et brun). Nom en Barrio. Validé par tests favicon, une-couleur et réduction. Remplace le logo Fredoka ; migration du site (favicon, en-tête) = PILOTATGE 2d. Écart de couleurs logo/palette noté en charte §1 bis, à arbitrer au redesign | Décision Romain, dessin de sa main de bout en bout (méthode : copies d'étude → tests pro → système 3 formats). Identité unique dans l'écosystème occitan : les autres affichent la croix, Lo Ligam la *tisse* |
| 2026-09-30 | **Symbole : variante C** (moyeu réduit, arcs épaissis) après la remarque « grande roue » de la sœur de Romain, tranchée sur planche comparée A/B/C/D puis duel C/D en tailles réelles. **Typographie appliquée au site** : Barrio/Limelight/Luciole auto-hébergées, anciennes polices supprimées, `font-synthesis: none` contre les faux gras. Luciole = CC BY 4.0 → crédit à ajouter sur la future page accessibilité. Master Canva à répercuter en C (Romain) | La critique extérieure a vu ce que nous ne voyions plus ; le duel en petites tailles a départagé (le gros moyeu mange les branches sous 32 px) |
| 2026-09-30 | **Direction du redesign : « éditorial aéré »** — principes retenus de la référence leoparpeix.com (choix de Romain) : marges généreuses, titres éditoriaux géants, peu de couleurs par écran, images calmes, micro-animations de détail. Règle éthique : s'inspirer des *principes* (langage commun du design), jamais de la *signature* (compositions, animations reconnaissables) ; toujours plusieurs références (captures land-book/godly/lapa), jamais une seule. S'applique au registre RÉCIT via la bibliothèque de blocs, après la séance Estructura | Romain n'aime plus le format actuel du site (« trop classique Claude ») et se reconnaît dans ce langage ; sa matière (terracotta, Art déco, croix-constellation, photos sang e aur) garantit un résultat distinct de la référence |
| 2026-09-30 | **Palette alignée sur le logo** : brique #B53D17 remplace le terracotta #C8562E, or #EEAF34 remplace #E0A43B, nouveau token or clair #FFD47F ; appliqué aux tokens `app.css` et aux 33 occurrences en dur (16 fichiers), vérifié à l'écran. Règle : **le logo est le maître des couleurs.** Crème #F5EAD8 et accents inchangés | Décision Romain (« on part sur la nouvelle couleur ») : l'œil du logo a évolué pendant le dessin, le site suit |
| 2026-09-30 | **RÉVISE la décision du 2026-09-18 sur Claude Design : mis en pause.** Romain s'y sent perdu et éparpillé. Retour au circuit qui a fait ses preuves (logo, maquette sang e aur, variantes C/D) : Romain crée et capture dans **Canva**, Claude construit des **planches comparées** (HTML/captures) et intègre dans le code, une décision à la fois, tout dans la conversation graphismes. Le canvas « Redesign de Lo Ligam » reste accessible sans obligation | L'éparpillement coûte plus que l'outil ne rapporte ; la méthode planches comparées a produit tout le travail validé à ce jour |
| 2026-10-04 | **Romain conçoit lui-même le parcours pédagogique ; Claude ne produit plus de contenu pédagogique à sa place.** Parcours d'autoformation en huit étapes (`autoformation-parcours.md`), pages de Romain dans `carnet-concepcion/`. Claude : questions de compréhension, relecture par cinq questions, vérification (faits, liens, occitan), code. Les documents pédagogiques écrits par Claude (cadre v0.3, carte A1, état de l'art, catalogue) passent au statut d'hypothèses à relire par Romain. Priorité A1 → B2. | Romain : « ça va vers l'atrophie cognitive en réalisant tout par IA, je réfléchis plus ». Monter en compétence vaut plus qu'aller vite ; il est seul et doit pouvoir juger chaque proposition |
| 2026-10-05 | **L'accueil « éditorial aéré » est intégré au vrai site** (décisions Romain sur 4 questions posées une à une) : ① typographie simplifiée — **Barrio sort, Limelight porte le logo et les titres** (le logo réel est dessiné en Limelight, vérifié sur planche ; le nom du site s'écrit pareil) · ② **toggle Òc/Fr intégral**, le grand titre bascule aussi · ③ **nouvelle coquille, mêmes contenus** — RÉVISE l'eròi « Lo riu » et la coquille des stations du 2026-08-22 : héros = promesse en 3 lignes géantes sur la crête des Cévennes (sang e aur), les 4 familles deviennent la liste éditoriale « los camins », la citation du troubadour passe en blanc sur la bande-paysage parallaxe, l'invitation finale devient le « darrièr crit » avec croix-constellation en filigrane ; PageBackground et le riu de designs quittent l'accueil · ④ **Lenis** (scroll à inertie, 1.3.26, auto-hébergé via le build) avec garde-fous : rien si `prefers-reduced-motion`, clavier natif intact. Textes du héros : nouveaux ids site_textes (hero_kicker, hero_l1-l3, hero_sub2) à semer dans /admin/textes ; hero_lead/hero_sub vivent désormais dans l'acte « Adieu ». Vérifié : build, Òc/Fr, clavier, mobile 375, écran 1830, toutes sections à l'écran. Occitan nouveau À VALIDER (dicodòc) | Décisions Romain (« je veux qu'on me pousse la maquette sur le projet principal »). La maquette validée le 30-09 devient la vraie page ; les contenus d'août (familles, chiffres sourcés OPLO, carte vivante, officialitat) sont relogés, pas jetés |
| 2026-10-06 | **Passe « hauts standards » sur l'accueil** (demande Romain : « ça se voit que c'est Claude qui l'a fait ») : ① **menu refondu en voile plein écran éditorial** — liens géants Limelight en cascade masquée, jalons terracotta, ressorsas en texte souligné d'or, fini les cartes blanches à icônes ; Échap ferme, page verrouillée derrière ② **pied de page refondu** — fini le bloc brun et les icônes génériques : crème, filet sang e aur, nom en grand Limelight, colonnes texte ③ **animations relevées** — héros en révélation « rideau » (masques ligne à ligne), balayage crème des camins au survol (scaleX), ombre de barre au défilement (CSS scroll-driven), constellation du final en rotation de 3 min. Tout coupé par prefers-reduced-motion. Vérifié : build, desktop, mobile, menu ouvert/fermé | Romain veut l'expérience au niveau de la référence ; chaque effet en CSS natif ou transform seul (sobriété, pas de bibliothèque en plus) |
| 2026-10-06 | **Nouvelle base visuelle : l'« esbòs de nuèch »** (`app/static/esbos-nuech.html`). Déclencheur : un test Mistral à page blanche jugé plus abouti que l'accueil retouché ; Claude refait la même ambition, avec l'identité Lo Ligam. Romain : « beaucoup mieux, on a débloqué quelque chose… tu peux utiliser cette base dorénavant ». Retenu : **fond sombre** (nuit, terracotta, or) ; fond vivant WebGL réactif à la souris ; **la croix-constellation qui se forme à l'arrivée, s'éparpille en étoiles au défilement et se reforme au final** (récit du « ligam ») ; bandeau de mots avec traduction au survol ; défilement horizontal des familles ; chiffres qui se comptent ; fenêtre photo qui s'ouvre en plein écran ; grand nom en pied de page. À reprendre plus tard : **couleurs**, **personnaliser le fond vivant** pour qu'il ait plus de sens dans l'univers de Romain. L'accueil SvelteKit actuel (« éditorial aéré », Parpeix) est dépassé par cette base | Les propositions retenues jusque-là étaient trop prudentes (Claude se censurait) ; sobriété tenue malgré tout : fond à mi-résolution et 30 images/s, arrêté onglet caché, tout immobile si « réduire les animations » |
| 2026-10-06 | **Repositionnement : Lo Ligam n'est plus « la plateforme de tout l'écosystème occitan », mais le support de mes cours en visio**, qui deviennent l'**activité principale** (garder un lien humain). La plateforme sert à se connecter avec les élèves, à centraliser la connaissance que Romain veut partager, et à montrer *sa* vision de l'Occitanie. Conséquences : ① la **visio (ex-Phase 2, §3) remonte en priorité** : un espace élèves, via Proton (visio) — mode d'intégration à vérifier ② **prise de rendez-vous** à intégrer ③ un espace **« Qui suis-je / l'histoire du Ligam »** (matière brute : `istoria-romain.md`) ④ les textes qui promettent « tot l'ecosistèma occitan » (accueil, esbòs de nuèch) sont à réécrire. À recroiser avec §3 (phases), §6 (modèle économique) et §8 (paiements, statut) | Romain veut garder le lien humain au centre ; la plateforme le prolonge au lieu de le remplacer |
| 2026-10-06 | **Vision de la carte : « ancrés mais connectés »** (Romain). Le fond en étoiles de l'esbòs devra se **relier à l'interface cartographique** (/carta). Idée : un parcours presque poétique, où l'on clique et l'on traverse les échelles : les **villes en archipels** et leurs connexions → les **rivières** avec leurs noms → le **relief** (courbes de niveau) → les **espaces naturels et parcs nationaux** → les **départements**, les **régions** → le **pays** → l'**Europe** → le **monde**. Interface particulièrement agréable à regarder. Message : pas une île occitane coupée de tout, mais une **imbrication** de choses qui s'entremêlent. Construction couche par couche dans l'esbòs (rivières puis relief en premier), le passage d'échelles viendra ensuite. À articuler avec la conversation cartographie | Dit l'identité du projet : enraciné sans repli ; prolonge la carte, fonctionnalité phare |
| 2026-10-07 | **Ambiance par défaut : « Venas d'aur », palette « Brasa »** (Romain : l'ambiance la plus originale, mais « un peu triste » en brun-noir). Teintes calées sur ses publications Instagram (analyse des 213 visuels de design-stock/canva-vf : fonds blancs et rouge corail #e84848, terracotta #a84830 dominant, sarcelle, or #f0a830) : fond brique profond → terracotta, taches corail, veines or vif, halo orangé. Le steampunk (planche esbos-engenh) est mis de côté : jugé « trop IA » | Rapprocher le site de l'identité déjà connue de la communauté Instagram ; plus joyeux sans perdre la lisibilité |
| 2026-10-07 | **Cadre commun porté dans le vrai site** (en-tête, pied de page sur toutes les pages, réglages d'ambiance : thème sombre / clair / système + couleurs adaptées au daltonisme, bouton « Tornar amont ») ; les pages pas encore harmonisées restent en clair (liste ARMONIZADAS). **Carte en étoiles de l'accueil** : elle n'est plus un lien (seul « Dobrir la carta entièra » mène à /carta) ; sur téléphone, noms au toucher dans une bulle au-dessus du doigt, villes prioritaires sur les villages ; **Montpelhièr toujours affichée** ; Vielha (Val d'Aran), Baiona (gascon / euskara) et **Draonier** (siège de l'Espaci Occitan, choix symbolique de Romain plutôt que la commune la plus peuplée) nommées. Sources : **Lexic de Max Roqueta** (J.-G. Roqueta) pour le bandeau de mots ; affiches d'**Occitanica** sur /obras (liens à ajouter) | Un cadre unique pour toutes les pages avant de les harmoniser une à une ; la carte dit toute l'Occitània, Italie et Val d'Aran compris |
| 2026-10-07 | **La carte en étoiles devient la carte** (choix de Romain : « Étoiles → carte », étape 1 faite). /carta s'ouvre en sombre sur la constellation de l'accueil (couche Leaflet `app/src/lib/carta/colaEstelas.js` : 304 lieux, rivières, noms placés comme sur l'accueil, villages au zoom, clic = vol vers le lieu) ; fond **« Estelas » par défaut**, la carte OSM en occitan apparaît dessous à partir du niveau 8,5 (version « nuit » en thème sombre, non téléchargée avant). La carte s'affiche **sans attendre Supabase** (avant : carte vide si la base ne répondait pas) ; les couches de l'admin s'ajoutent quand elles arrivent. Accueil, Mots et Carte harmonisés. Étapes suivantes : relief, dialectes / départements / régions dans l'ordre de la vision, puis Europe et monde | Conversation cartographie : le composant CartaOccitania a changé (ordre de chargement, fond par défaut) ; les couches génériques de l'admin ne bougent pas |
| 2026-10-07 | **Fiches de villes + repère cliquable** (Romain). À terme, cliquer sur une ville mène à **sa page** : histoire du territoire, lien avec l'occitan, où l'apprendre (contenu organisé en fiches, à concevoir). Les noms des tuiles OSM ne peuvent pas être effacés (images) : chaque ville à fiche reçoit **le repère doré de Lo Ligam** (croix sur disque sombre), cliquable à tous les zooms (de loin : vol vers la ville ; de près : sa page, ou « Lèu »). Liste provisoire `app/src/lib/carta/vilasFichas.js` (Montpelhièr en prototype), à passer dans l'admin. Écarté pour l'instant : une carte entièrement à nous (tuiles vectorielles), gros chantier si la carte devient phare. Trait de côte Natural Earth ajouté (carte et accueil) ; nos noms, rivières et côte s'effacent avant l'apparition de la carte OSM (jamais de doublon) | Nouveau type de contenu (fiches de villes) à cadrer ; conversation cartographie : liste des villes à fiche à intégrer à l'admin |
| 2026-10-07 | **Carte : domaine et dialectes d'après la carte d'Occitanica** (Romain : « la référence »). Frontière de la langue et six dialectes (gascon, languedocien, provençal, limousin, auvergnat, vivaro-alpin) extraits automatiquement de la carte, calée en Lambert-93 (écart 3 à 6 km) ; vallées d'Italie tracées à la main (approximatif, à remplacer par les communes de la loi 482). Limites entre dialectes **en fondu**, pas en trait ; une ville à moins de 4 km d'une limite porte les deux dialectes (« gascon / lengadocian »). Écarts avec l'usage courant à arbitrer : rive droite de Bordeaux, Libournais, Marmandais en languedocien ; auvergnat arrêté au Rhône. Crédit Occitanica affiché ; droit de réutilisation à demander au CIRDÒC. | Romain |
| 2026-10-07 | **Catalogue de données de la carte** (Romain : couches applicables à tous les fonds). Cinq familles : Langue, Administration, Culture, Histoire, Nature (`app/src/lib/carta/catalogue.js`). Le catalogue vit dans le code et s'affiche même si Supabase est en pause ; la table `carta_colas` peut encore renommer ou ajouter une couche. Les couches pas encore prêtes sont visibles et grisées (« À venir »). | Romain |
| 2026-10-07 | **Carte : choix visuels de Romain** sur planche comparée : noms des dialectes en capitales espacées sans contour (« atlas »), transitions en **fondu large** (~7 km), panneau des couches en **rail latéral** (icônes nommées, second clic ferme). Polices des villes à l'essai : Limelight (grandes villes), Luciole grasse, italique (petites) ; remarque de l'étude : en cartographie l'italique est d'ordinaire réservé à l'eau. | Romain |
| 2026-10-07 | **Dialectes sélectionnables** (un seul affiché, sa couleur se diffuse sur son territoire) ; le Croissant aussi. **Fond modulable** : étoiles, noms, rivières, noms de rivières, courbes, côte, couleurs (« seulement la côte »), en vue de l'export. | Romain |
| 2026-10-07 | **Sources de la carte** : domaine et dialectes d'après « Carte linguistique de l'Occitanie », CIRDÒC – Occitanica, fiche 21242, **Licence Ouverte** (vérifié) : rediffusion possible en citant la source. Val d'Aran et 11 vallées d'Italie (110 communes, liste à valider) : OpenStreetMap (ODbL). Le Croissant (ancienne couche Carte_dialecte_WG) : **origine inconnue**, donc pas d'export tant qu'elle n'est pas éclaircie. | Romain |
| 2026-10-07 | **Module « Fai ta carta d'Occitània »** (export SVG, PDF mis en page, GeoPackage, Shapefile) : étude faite (SIG/export-carta-estudi.md), faisable sans alourdir la page (outils chargés au clic). **Hors périmètre MVP : à arbitrer** avec §3/§6. | à trancher |
| 2026-10-07 | **Croissant retiré de la carte** : l'ancienne couche venait du fond de l'Atlas LISN (CC BY-NC-SA, autorisation toujours en attente). Romain : « ce n'est pas une propriété mais un territoire » : on le retrace nous-mêmes à partir de sources libres (Tourtoulon 1876, travaux publiés). Fichier gardé dans SIG/Dialecte. **Carte de base = « Contorns »** (côte fine + frontière de la langue) ; villes, noms, rivières, relief deviennent des couches rangées par famille. Icônes des points : Tabler Icons (MIT, créateur polonais). | Romain |
| 2026-10-07 | **Dialectes corrigés d'après la recherche sur les transitions** (SIG/Dialecte/transicions-dialectes.md, 30 bandes, 25 corrections) : Romain valide les 4 grosses corrections. Ardèche nord vivaro-alpin et sud languedocien ; Gironde et Lot-et-Garonne gascons (Libournais, Entre-deux-Mers, Marmandais, Albret, Brulhois) ; Vésubie, Tinée et Mentonnais vivaro-alpins ; Vercors, Trièves, Valbonnais et Oisans ajoutés au domaine. Domaine limité à la France sauf Aran et vallées d'Italie ; Croissant dans le domaine, frontière sur son bord nord. Restent à trancher : Roya, Monaco, communes italiennes « déclarées », est de la Creuse et de la Corrèze, Baronnies, Tayac, Lomagne, gascon éteint, Verdon. | Romain |
| 2026-10-07 | **Zones mixtes en quadrillage clair** (Romain) : Roya et La Brigue (ligure à traits occitans), Monaco (ligure, niçois aussi), communes italiennes déclarées occitanes par la loi 482 mais de parler piémontais (Luserna, Bricherasio, Paesana, Sanfront, Dronero, Caraglio, Borgo San Dalmazzo). Restent dans le domaine (Monaco hors), légende au survol. | Romain |
| 2026-10-07 | **Limites débattues : conseils de la recherche suivis** (Romain) : est de la Creuse et de la Corrèze auvergnat (Crocq, Auzances), sud des Baronnies provençal (compromis), limousin jusqu'au gascon vers Tayac ; Lomagne inchangée en attendant une source. **Nuancier** : la largeur du fondu entre dialectes suit les 22 bandes de transition relevées (5 à 35 km). Restent : gascon éteint (Bourgeais, Libournais) à montrer plus pâle ? Verdon-sur-Mer non affiché. | Romain |
| 2026-10-07 | **Sept petites corrections appliquées** (Romain) : ouest de Toulouse et vallée de Massat gascons ; Carladès et rive du Vidourle languedociens ; Digne, Annot, Entrevaux vivaro-alpins ; Petite Gavacherie (enclave d'oïl autour de Monségur) et Blayais hors domaine. Reste à trancher : montrer le gascon éteint (Bourgeais, Libournais) plus pâle ; Lomagne en attente d'une source. | Romain |
| 2026-10-07 | **Vercel débranché de GitHub** (Romain) : fin des échecs de déploiement à chaque envoi. Constat : le « secours » Vercel ne marchait plus depuis le 08-08 (site construit pour un conteneur), il ne montrait que l'ancienne version. Le même jour, projet Vercel supprimé et lien « About » de GitHub repointé vers Scaleway | Les croix rouges sur GitHub n'étaient que du bruit ; le vrai site (Scaleway) était en ligne |
| 2026-10-07 | **Dialectes sélectionnables à plusieurs** (Romain) : un clic ajoute ou retire une zone, le passage d'une sélection à l'autre se fait sans trou à la limite ; **le Croissant n'est plus une couche à part** mais une pastille des dialectes | Une seule place pour le Croissant ; comparer deux parlers voisins |
| 2026-10-07 | **Nouvelles couches de sources publiques** (Romain) : communes (IGN Admin Express 2026, visibles dès l'échelle « 7 km », contours seuls car les tuiles portent les noms), Calandretas (annuaire de l'éducation, site de l'école ou contact du ministère), provinces de 1789 (bailliages de Gay, Gobbi et Goñi 2024, CC BY 4.0 ; gouvernements et provinces), parcs (PatriNat, Région Piémont), noms de massifs et de sommets (Wikidata). Noms occitans proposés par Claude dans des tables à valider | Licences ouvertes vérifiées une à une ; fichiers légers chargés à la demande |
| 2026-10-08 | **Entrée en scène de la carte** (Romain) : côte, courbes de niveau, noms des chaînes, fleuves de la source à la mer, grandes villes (une ou deux par dialecte), puis diffusion des dialectes ; même arrivée depuis le menu et l'accueil ; un clic saute à la fin, rien si moins de mouvement est demandé. Sons : crayon fabriqué par le navigateur, grondement de terre et rivière enregistrés (Freesound, CC0, crédités dans app/static/sons/FONTS.md), pas de son pour les dialectes | Les sons fabriqués (pierres, eau) sonnaient faux : seuls de vrais enregistrements conviennent ; sons déclenchés par le dessin lui-même, et départ seulement quand les données sont prêtes, sinon tout se décalait |
| 2026-10-08 | **Carte : Europe puis le monde au dézoom, famille « Autras lengas », panneau des couches au choix sur le côté ou en bas** (Romain) | La carte sert aussi à faire découvrir les autres langues de France et à créer des ponts ; noms occitans des pays et des langues proposés par Claude, à valider |
| 2026-10-08 | **Révision complète carte + site** (Romain : « bilan complet du code ») : tests obligatoires avant chaque mise en ligne (Dockerfile), esquisses HTML non publiées en ligne (visibles en local), `.geojson` compressés à la construction ; détail et reste à faire dans `BILAN-2026-10-08.md` | 52 corrections, 94 constats restants classés ; une régression testée ne doit plus pouvoir partir en production |
| 2026-10-08 | **Carte : niveaux de lecture selon l'échelle** (Romain) : dialectes ; vers 200 km une seule Occitanie « OCCITAN » en rouge (mélange en dézoomant, dialectes en feu d'artifice en zoomant) ; dès 300 km les autres couches s'effacent ; à 500 km seul le contour de l'Occitanie linguistique reste sur la carte des pays ; pays et outre-mer visibles partout. Sous-dialectes à venir | Lire la carte comme un atlas : de la langue entière à ses dialectes, puis (à terme) à ses parlers ; au loin, ne garder que l'essentiel |
| 2026-10-08 | **Carte : chaque couche a son apparition, selon le type de donnée** (Romain : « une carte informative mais aussi artistique, vraiment captivante ») : contours tracés par des étoiles, zones dont la couleur s'étend, constellations pour les communes, lignes qui coulent ou se tracent au crayon, points qui s'allument un à un, noms dont les lettres se resserrent ; étoiles discrètes et vives. Le survol montre la couche cochée la plus fine | Cohérence d'ensemble et lisibilité : une même logique partout, adaptée à la nature de chaque donnée |
| 2026-10-08 | **Carte : les autres langues de France, une à une, comme l'occitan** (Romain) : un menu dans « Autres langues » liste les langues de France ; chacune s'allume avec ses dialectes, ses grandes villes et la même lecture selon l'échelle. Le catalan d'abord (domaine entier, de Salses à Guardamar et à l'Alguer, et la Catalogne nord sélectionnable à part), à partir de limites ouvertes (OpenStreetMap, IGN) et d'un classement des comarques par dialecte (Veny) à valider par Romain | Montrer la diversité de chaque langue au même niveau que l'occitan, et préparer une carte de France de toutes ses langues ; deux logiques pour le catalan : transfrontalière et française |
| 2026-10-08 | **Périmètres des langues de France retracés à partir de sources libres** (Romain) : communes IGN et limites publiées ; la carte de l'Atlas sonore (LIMSI/LISN, CC BY-NC-SA, fichier `SIG/Limsi/`, hors Git) sert seulement de contrôle pour repérer les écarts, sa géométrie n'est pas reprise | Pas de réponse connue du LISN à la demande de juillet (§8) ; même choix que pour le Croissant le 2026-10-07 : publiable sans contrainte de licence |
| 2026-10-09 | **Carte : les points de loin sont des étoiles** (Romain, « plus jamais » l'amas d'icônes de Calandretas) : de loin, chaque point est une étoile de la couleur de sa couche ; l'icône éclot en s'approchant, seulement si elle a la place sans cacher un nom ; elle reste toujours collée à son lieu, jamais au bout d'un long trait. | Lisibilité, poésie de la carte |
| 2026-10-09 | **Satellite : uniquement des photos aériennes libres** (Romain) : IGN pour la France (Licence Ouverte 2.0) et PNOA pour l'Espagne (CC BY 4.0), en fondu vers 15 km sous nos noms occitans. EOX (Sentinel-2) retiré : licence non commerciale, et une carte gratuite qui mène à des cours payants risque d'être jugée commerciale. Vallées d'Italie : carte OSM tant qu'une source libre n'est pas vérifiée. | Licences, sobriété juridique |
| 2026-10-09 | **Arpitan sur la carte** (Romain) : domaine commune par commune avec la meilleure source libre de chaque pays (France : carte arpitania.eu, CC BY-SA ; Suisse : langue des communes OFS ; Italie : Vallée d'Aoste sans les communes walser, communes de la loi 482 et leurs vallées) ; **7 dialectes** et les parlers de la Vouiquipèdia en sous-dialectes, pour se lire comme le catalan ; **avec l'occitan, la ligne occitane reste la limite** et les 79 communes revendiquées des deux côtés sont hachurées ; l'Oisans est arpitan. Règle générale : même lecture d'une langue à l'autre (grands dialectes colorés, parlers au survol, transitions hachurées, frontière commune sans trou). Détail : `SIG/arpitan/FONTS.md`. | Lecture cohérente entre les langues |
| 2026-10-09 | **Principe des limites sur la carte** (Romain) : ce n'est pas une science exacte. Entre deux données, on se cale sur la plus sûre (frontière d'État, communes) ; à précision égale, les géométries se recouvrent plutôt que de laisser un vide ; de près, on montre le mélange et le continuum (fondu, hachures), pas une coupure. Une zone « à part » d'une langue (Catalogne Nord, arpitan de France) colle exactement à la frontière nationale. Le domaine occitan suit les communes au contact de l'arpitan (trous du Forez et des Hautes-Alpes fermés) ; Montagne bourbonnaise hachurée (sources contradictoires). | Cohérence entre les langues |
| 2026-10-09 | **Couleurs et gestes de la carte** (Romain) : une langue unifiée garde la couleur usuelle des cartes des langues de France (arpitan en vert, le basque plus tard en vert plus foncé) ; la révélation du satellite vers 15 km se fait sur toutes les langues allumées, pas seulement l'occitan ; un double clic sur une donnée (zone, commune, lieu, dialecte) centre la vue dessus. | |
| 2026-10-09 | **Typographie des villes sur toute la carte** (Romain) : le style « Atlas » choisi le 08-10 vaut partout (carte en étoiles, villes catalanes et arpitanes, noms des communes sur le satellite) : **Limelight** pour les métropoles, **petites capitales espacées en Luciole** pour les villes repères, **italique Cormorant** pour les autres villes et les villages. Le rang suit la liste `RENC_VILAS` ; une commune hors liste est un village. Sur le satellite, lettres claires à halo sombre dans les deux thèmes (en sombre sur clair, l'italique fine se perdait dans la photo). | Une seule source de règles (`estilVila`, colaEstelas.js) : une ville garde son allure au passage étoiles → satellite. Rappel de l'étude : l'italique est d'ordinaire réservé à l'eau ; choix de Romain maintenu |
| 2026-10-09 | **Côte et mer de la carte** (Romain) : une seule référence terre / eau, les communes de l'IGN ; le bord de mer du domaine occitan, du catalan et des dialectes y est recalé (`SIG/cadena/costa-ref.py`, en fin de chaîne : îles et lidos rendus à leur langue, frontières menées au rivage, frontières terrestres inchangées) ; au zoom proche, une couche « mer » d'un bleu uni (celui de l'IGN) recouvre le large où les photos sont blanches, en fondu de 500 m jusqu'à la côte, sans toucher les terres (`colaMar.js`, `mar.py`). Étang de Berre, bassin d'Arcachon et estuaire de la Gironde : sans teinte et non peints (choix par défaut, à confirmer). Méthode de repli (atténuer les teintes au zoom) écartée tant que celle-ci convient | Avant : teinte 1,3 à 1,5 km au large (1 300 km² en mer) ; après : écart médian 5 m, 6,5 km² en mer. Reste : côte précise à l'étranger (Monaco, Menton, Espagne : OpenStreetMap, à télécharger avec l'accord de Romain) |
| 2026-10-09 | **Grille des échelles de la carte** (Romain) : un seul fichier de seuils (`app/src/lib/carta/escalas.js`), exprimés en valeurs de la barre d'échelle, identiques sur tous les écrans. Étoiles des capitales dès 200 km, leurs noms dès 150 km, villes importantes à 40 km, villes moyennes à 30 km ; départements et régions inchangés (s'effacent vers 300-400 km, invisibles à 500) ; arrivée plafonnée à 30 km sur grand écran. « Domaine occitan » (ancienne « Limite de la langue ») coché d'office, visible de 200 km au plus près, aussi sur l'occitan unifié. Cocher les dialectes, ou en choisir un, de plus loin que 100 km mène à 100 km ; leur feu d'artifice se joue à chaque fois. Toute donnée cochée hors de son échelle mène la carte à l'échelle visible la plus proche. **Règle générale : toute donnée arrive et s'efface joliment** (dans le temps, pas d'un coup ; les points éclosent un à un, en mouvement organique) | Une carte qui raconte le passage des échelles ; la même expérience sur téléphone et sur grand écran |
| 2026-10-09 | **« Sus la carta » : la légende, pas un organisateur** (Romain) : les couches affichées sont rangées par thème ; on ne permet pas de réordonner les couches (un département se voit dans sa région, l'ordre suit la logique cartographique). Une couche occitane cochée mène à la vue d'ensemble de l'Occitanie (70 km sur 1830 px, cadrage équivalent sur les autres appareils), même si l'on est plus près | Un choix éditorial : la carte pense la logique pour l'usager |
| — | *(à compléter)* | |

---

## 12. Glossaire (à enrichir)

- **Dialectes couverts** : languedocien (Phase 1), puis à définir.
- **Termes techniques du projet** : *(à compléter au fil de l'eau)*
- **Conventions d'écriture occitane** : **norme classique** (base commune). Détails à préciser au fil de l'écriture du contenu.

---

## 12 bis. Espace d'administration (cadrage — conversation dédiée)

> Ouvert le 2026-08-03. À traiter dans une conversation séparée : le sujet
> touche à l'authentification, au stockage de fichiers et à la sécurité.

### Le problème

Les contenus du site sont aujourd'hui **écrits en dur dans le code** :
les 204 fiches de vocabulaire (`app/src/lib/data/fichas.js`), les liens
externes et les sections (`siteSections.js`). Ajouter un design, corriger
un titre ou changer un lien suppose une intervention de Claude et un
déploiement. Ce n'est pas tenable : Romain produit du contenu en continu.

### Le besoin

Un espace réservé à Romain pour **ajouter, modifier et supprimer** :

- les **designs** (image, et vidéo MP4 quand elle existe) : titre, thème, ordre
- les **sons** (prononciation, retours sonores de l'app)
- les **liens** externes (acteurs occitans, ressources)

### Ce que ça implique (à ne pas sous-estimer)

| Brique | Enjeu |
|---|---|
| Authentification | Un seul compte administrateur. Personne d'autre ne doit pouvoir écrire. |
| Stockage de fichiers | Supabase Storage (déjà dans le projet) pour images, MP4, sons |
| Base de données | Tables `fichas`, `categories`, `sons`, `liens` + politiques RLS strictes |
| Migration | Basculer les 204 fiches du fichier de code vers la base, sans rien perdre |
| Écrans de gestion | Liste, formulaire, téléversement, aperçu, suppression avec confirmation |
| Coût | Vérifier les quotas gratuits de Supabase Storage (les MP4 pèsent) |

### Points tranchés le 2026-08-03

1. **Vidéos** : colonne prévue en base, **aucun envoi de MP4 en v1**.
2. **Migration** : **bascule complète**, `fichas.js` gelé en filet de secours.
3. **Portée** : **designs uniquement** pour la v1.

Détail et justification de chaque arbitrage au §11.

Point acquis, pas un arbitrage : **le son ne démarrera jamais seul**. Les
navigateurs le bloquent, et un son automatique est aussi un défaut
d'accessibilité RGAA. Ce sera toujours un bouton.

### État des lieux au moment du cadrage

- 204 fiches dans le code, mais **213 paires d'images** sur le disque : les
  9 fiches retirées (commit `c558fe2`) ont laissé leurs fichiers. Ne pas les
  ressusciter à la migration.
- Poids servi : 12 Mo (3 Mo de vignettes + 9,1 Mo de grandes). À côté,
  111 Mo d'exports Canva en local, non déployés.
- **Aucun fichier son** dans le projet.
- `siteSections.js` contient deux choses distinctes : la navigation
  (structure du site) et 11 liens externes.

### Précaution

C'est la première fois que le site aura une **écriture** en base depuis
le navigateur. Les politiques RLS doivent être écrites et vérifiées avant
d'ouvrir quoi que ce soit — une table ouverte en écriture publique est la
faille la plus courante sur ce genre de projet.

**Ce que ça donne concrètement** : la clé de connexion du site est publique
(lisible dans le JavaScript de la page) — cacher la page `/admin` n'est donc
pas une protection, seules les politiques RLS le sont.

- `supabase-admin-schema.sql` — tables, fonction `is_admin()`, politiques,
  dossier de fichiers plafonné à 2 Mo, **SVG interdit** (il peut porter du
  code exécutable et serait servi depuis un dossier public).
- La table `admins` n'a **aucune politique** : impossible de se déclarer
  administrateur depuis un navigateur, quoi qu'il arrive.
- `cd app && npm run verificar:rls` — tente ajout, modification, suppression,
  publication d'une fiche cachée, auto-promotion en admin et téléversement,
  en visiteur anonyme. Le script **relit la donnée après chaque tentative** :
  une politique manquante laisse Postgres répondre « c'est bon » sans rien
  modifier, ce qui fait passer au vert un test naïf sur une table ouverte.

### Ordre de mise en service — état au 2026-08-03

1. ✅ **Fait** — schéma passé dans Supabase (tables `admins`, `temas`, `fichas`,
   dossier `designs`). L'éditeur SQL avertit « creates a table without enabling
   RLS » sur `public.temas` : **faux positif vérifié**, il ne rattache pas le
   `alter table … enable row level security` à la création. Répondre
   **« Run without RLS »** = « lance ma requête sans y ajouter de sécurité à ma
   place » — et non « lance sans sécurité ».
2. ✅ **Fait** — Romain déclaré administrateur (bloc 10).
3. ✅ **Vérifié côté visiteur** — `npm run verificar:rls` : **13/13 au vert**.
   Un anonyme ne peut ni ajouter, ni modifier, ni supprimer, ni publier une
   fiche cachée, ni se déclarer admin, ni téléverser. Le passage du script
   prouve aussi que le garde-fou du bloc 9 a validé RLS + politiques.
4. ✅ **Vérifié côté administrateur** — `/admin` → « Testar l'escritura » :
   **7/7 au vert**. L'administrateur peut ajouter, modifier, supprimer,
   téléverser ; le SVG lui reste refusé (liste blanche MIME du dossier). Les
   politiques Storage ont bien été créées — l'erreur `must be owner` redoutée
   n'a pas eu lieu. **La sécurité est close : 20 contrôles, des deux côtés.**
5. ✅ **Fait** — migration des 204 fiches. Vérifié en base : 35 thèmes,
   204 fiches, 0 ligne d'essai, ordre et accents préservés. Le SQL est
   engendré par `npm run generar:migracion` depuis `fichas.js` — jamais recopié
   à la main.
6. ✅ **Fait** — `/mots` lit la base via `$lib/data/fichasFont.js`. Vérifié :
   page identique (204 vignettes, 35 thèmes, ordre et accents conservés),
   données venant bien de la base. **Le filet a été mis à l'épreuve** en
   forçant une panne : la page affiche toujours les 204 fiches depuis le
   fichier gelé. Délai d'attente de la base : 5 s, au-delà on bascule.
   `fichas.js` porte désormais un en-tête « FICHIER GELÉ ».
7. ✅ **Fait** — écrans de gestion. `/admin` est un espace à deux onglets :
   **Verrolhs** (le contrôle de sécurité, rejouable) et **Designs** (lister,
   chercher, filtrer par thème, ajouter, modifier, publier/masquer,
   réordonner, supprimer avec confirmation). Le contrôle d'accès est fait une
   seule fois dans `admin/+layout.svelte`.
8. ⬜ À l'usage : Romain ajoute un vrai design depuis Canva et on vérifie le
   résultat sur `/mots`.

### Chantiers ouverts le 2026-08-04

1. ✅ Groupes de designs (onglet **Grops**) + lien admin dans le bandeau.
2. ✅ Tunnel et carrousel — voir les deux causes trouvées ci-dessous.
3. ⬜ Vidéos MP4 à l'ouverture d'une fiche. **Bloqué** : il faut un MP4 Canva
   réel dans `design-stock/` pour mesurer avant de fixer un plafond de poids.
4. ✅ Espace **Òbras** (`/obras` + onglet d'administration). Reprend l'entrée
   « Bibliotèca » qui était en attente dans `siteSections.js` — c'était le
   même espace ; elle est renommée et passée en ligne.

**Òbras — ce qui est stocké et ce qui ne l'est pas.** Table `obras` : type,
titre, auteur, éditeur, année, lien d'écoute, lien « en savoir plus »,
adresse d'image, **commentaire de Romain**. Aucun extrait n'est hébergé.
L'écoute passe par le lecteur officiel, chargé **au clic seulement**, sur le
domaine `youtube-nocookie.com`. Conséquence voulue : aucune requête vers un
tiers avant que le visiteur ne la demande, donc pas de bannière de
consentement à prévoir pour cette page. Pour la même raison, **on n'affiche
pas la vignette YouTube** d'une vidéo : elle est servie par un domaine de
Google et enverrait l'adresse IP du visiteur chez eux avant le clic. Sans
image autorisée, la fiche s'affiche sur un aplat de la charte.
Le champ image n'est à remplir que si la source l'autorise (flux partenaire,
dossier de presse, accord de l'éditeur).
Seul YouTube s'intègre pour l'instant ; les autres plateformes s'affichent en
lien simple, et le formulaire le dit au moment de la saisie.

**Tunnel — pourquoi les cartes ne grossissaient pas.** La taille apparente
vient de la perspective : `perspective / (perspective + z)`. Les fiches
étaient retirées dès `z < -60`, c'est-à-dire avant même d'avoir dépassé leur
taille normale, et le fondu de sortie commençait encore plus tôt. La plus
grande fiche pleinement visible faisait ~230 px. Elles avancent désormais
jusqu'à `z = -500`, avec un fondu qui ne démarre qu'au dernier tiers.
Attention à ce réglage : trop opaque trop longtemps, la fiche de devant
masque toutes celles de derrière et le tunnel devient un diaporama.

**Carrousel — pourquoi il fallait « cliquer pour commencer ».** L'effet de
profondeur (`--away`) n'était calculé qu'à l'événement de défilement. Avant
toute interaction, chaque carte gardait la valeur par défaut « au plus
loin » : floue, à 55 % d'opacité et rétrécie — **carte centrale comprise**.
Le carrousel semblait éteint. Il est désormais peint dès l'affichage, et la
valeur par défaut est « au plus près » pour qu'un raté d'affichage ne rende
jamais la page terne. Second point : un clic sur une carte de côté se
contentait de la recentrer, il en fallait un second pour l'ouvrir. Un seul
clic ouvre maintenant n'importe quelle carte.

### Choix techniques de l'espace d'administration

- **Les images sont réduites dans le navigateur avant l'envoi**
  (`$lib/imatges.js`) : deux WebP, 360 px et 860 px, qualité 0,82. L'export
  Canva d'origine ne traverse jamais le réseau. Sobriété, quotas préservés, et
  envoi bien plus rapide.
- **Identifiants** sur le modèle des 204 fiches d'origine : `tema--titre`,
  avec suffixe numérique si le nom est déjà pris.
- **Suppression** : la ligne d'abord, puis les fichiers — et uniquement ceux
  qui sont dans Supabase Storage. Les images historiques vivent dans
  `app/static/` et ne doivent pas être touchées.
- **Aucune marge négative dans les styles partagés du portail.** Une marge
  négative sur `.subtitle` a fait chevaucher le titre de l'écran des designs.
  Chaque page règle son propre sous-titre.

### Aperçu avant publication (en place depuis le 2026-08-06)

Dans `/admin/textes`, le bouton **Apercebut** ouvre l'accueil avec le texte en
cours de saisie, visible **uniquement dans le navigateur de Romain** (brouillon
en `localStorage`, jamais en base). Un bandeau « Mòde apercebut » le rappelle ;
« Enregistrar » publie pour tout le monde et efface le brouillon. Modèle à
reprendre pour les prochains écrans d'édition.

### Chantier ouvert : la page d'accueil en blocs (à cadrer — coordination avec la conversation « accueil »)

Souhait de Romain (2026-08-06) : pouvoir faire évoluer la **structure** de
l'accueil lui-même — réordonner les sections, en masquer, en ajouter depuis une
palette de modules existants avec des variantes de mise en page proposées.
Principe retenu : la page devient une **liste de blocs typés en base**
(hero, chapitre-texte, chiffres, carte, carrousel…), rendue par les composants
actuels ; l'admin permet réordonner / masquer / ajouter / régler chaque bloc.
Limite actée : composer avec les modules existants est autonome, **créer un
type de module nouveau reste du code**. ⚠️ Ce chantier restructure la page
d'accueil, construite et retravaillée par la conversation « accueil » : à
mener là-bas, ou au minimum après synchronisation via ce document. Les textes
restent dans `site_textes` (les blocs y font référence, rien n'est à refaire).

---

## 13. Prochaines étapes proposées

> ⚠️ **Section périmée (constat du 2026-09-18)** : le pilotage vit désormais dans `PILOTATGE.md`. Contenu conservé pour mémoire.

1. ~~Trancher la question de la **graphie** (bloquante pour le contenu).~~ *(fait — norme classique, §11 du 2026-07-28)*
2. Définir le **périmètre précis du MVP** (nombre d'unités, thèmes des premières leçons). *(toujours ouvert — question de la séance d'arbitrage, voir `PILOTATGE.md`)*
3. ~~Faire une **maquette visuelle** d'un premier écran pour donner le ton (design, animations, identité).~~ *(fait — maquettes comparées ayant tranché typographie et héros de l'accueil, §11 du 2026-08-22)*
4. ~~Choisir la **technologie** de développement.~~ *(tranché de fait — SvelteKit, §11 du 2026-08-08 et voir §10)*
