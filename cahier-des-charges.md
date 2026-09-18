# Cahier des charges — Lo Ligam
### Application d'apprentissage de l'occitan et communauté occitane en ligne

> **Document vivant.** C'est notre source de vérité. On le met à jour à chaque décision tranchée.
> Version : 0.5 · Dernière mise à jour : 31 juillet 2026

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
- Site web vitrine + version applicative.
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

- **Connexion** : email, Google (Gmail), et autres fournisseurs à définir (Apple obligatoire si publication sur l'App Store, éventuellement France Connect à étudier).
- **Questionnaire d'accueil** : nom, prénom, âge, lieu de vie, origine (cas des personnes déplacées), motivation.
  - ⚠️ Ces données sont personnelles → obligations RGPD (voir §8). On ne collecte que le nécessaire, avec consentement clair et finalité expliquée.

---

## 6. Modèle économique

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
- **API de lo Congrès** : ✅ ressources officielles intéressantes (dico, conjugaison, phonétique, synthèse vocale Votz…). **Action : contacter lo Congrès pour cadrer les conditions d'utilisation** — usage commercial autorisé (l'appli a un volet payant) ? attribution requise ? clés/inscription ? limites de requêtes ? À transformer idéalement en **partenariat**, puisqu'un relais vers eux est déjà prévu.

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
- [ ] **Technologie** : appli native, web app, ou hybride (une base de code pour web + mobile) ?
- [ ] **Statut juridique** pour les cours et dons (micro-entreprise, association…).
- [ ] **Hébergeur** définitif.
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
| 2026-07-28 | Audio : Votz d'abord, prononciation humaine reportée (« à voir après ») | Démarrer sans lourd chantier d'enregistrement ; option humaine gardée ouverte |
| 2026-07-28 | Essai libre avant création de compte : OUI | Réduit la friction, crée l'envie avant de demander un compte |
| 2026-07-28 | Interface multilingue : occitan par défaut + français, anglais, catalan, espagnol, italien (choix au 1ᵉʳ lancement) | Fierté occitane (langue chez elle) sans perdre les débutants ; langues sœurs + portée |
| 2026-07-28 | Distinguer langue d'interface (6 langues) et langue du contenu pédagogique (à démarrer plus restreinte) | Traduire tout le contenu en 6 langues = 6× le travail ; élargir progressivement |
| 2026-07-28 | Parcours structuré CEFR (A1→…), MVP = A1 ; niveau déclaré au départ, test de placement plus tard | Cadre reconnu, progression lisible ; skip vers niveau supérieur possible quand le contenu existera |
| 2026-07-28 | Questionnaire : minimisation RGPD (nécessaire + utile + facultatif) ; vigilance âge/mineurs (consentement parental <15 ans) | Respect des données, conformité, moins de friction |
| 2026-07-28 | **Langues au MVP : occitan (défaut) + français**, interface ET contenu. Puis catalan → anglais → espagnol/italien | Démarrer simple pour lancer vite ; élargir langue par langue ; catalan priorisé (marché + langue sœur) |
| 2026-07-28 | **Âge minimum : 15 ans** | Évite le consentement parental (seuil RGPD France = 15 ans) ; simplifie le MVP |
| 2026-07-28 | Cibles : application mobile **ET** web, une seule base de code ; commencer par le plus simple | Éviter de construire 2-3 fois ; cf. étape « choix techniques » |
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
| 2026-08-08 | **Hébergement migré de Vercel (États-Unis) vers Scaleway (Paris, fr-par)** — Serverless Containers, adapter-node, image construite par GitHub Actions. Adresse actuelle : `https://ligamweb62fb7521-lo-ligam.functions.fnc.fr-par.scw.cloud`. Vercel conservé en secours tant que la base n'est pas migrée | Engagement européen (§7) : Vercel Inc. est une entité américaine soumise au CLOUD Act. Scaleway met le site et son hébergeur sous droit français. Le mettre en œuvre tôt évite une migration sous contrainte plus tard, le site n'ayant pas de date de sortie |
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
| 2026-09-18 | **Transposition de la logique de centre-racine2.com actée** (référence choisie par Romain) → détail complet dans `transposicion-racine2.md` : hub→feuille, entonnoir à deux vitesses, jamais d'impasse, FAQ accordéon sur l'accueil, gabarit unique des pages leçon, frise du chemin dans le hub `/aprene`, pages A prepaus + Contacte à construire ; le kit de fluidité (blocs-déclarations surlignés, carte-héros, accordéons, barre condensée, View Transitions). Décisions du jour : **ligne de promesse** sous le héros (texte de Romain : « L'occitan se parle, s'apprend et se vit. Quel que soit ton objectif, tu es au bon endroit ! »), **second bouton héros = ancre « L'occitan, qu'es aquò ? »** vers la station La lenga, **les entrées « Lèu » du menu restent affichées** même vides (mémoire du cap, site pas publié bientôt) | Analyse 15 agents contre-vérifiée. Les décisions du 2026-08-22 (riu, typo, 6 stations, une maison) ne sont PAS rouvertes : la référence s'y glisse. Le « test de positionnement » et les portraits d'apprenants = évolution ; SEO villes, WhatsApp, compteurs = écartés |
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

1. Trancher la question de la **graphie** (bloquante pour le contenu).
2. Définir le **périmètre précis du MVP** (nombre d'unités, thèmes des premières leçons).
3. Faire une **maquette visuelle** d'un premier écran pour donner le ton (design, animations, identité).
4. Choisir la **technologie** de développement.
