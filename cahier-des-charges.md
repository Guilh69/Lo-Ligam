# Cahier des charges — Lo Ligam
### Application d'apprentissage de l'occitan et communauté occitane en ligne

> **Document vivant.** C'est notre source de vérité. On le met à jour à chaque décision tranchée.
> Version : 0.4 · Dernière mise à jour : 28 juillet 2026

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
| Apprentissage autonome | Gratuit + dons libres pour te soutenir |
| Cours en visio avec toi | 1er cours gratuit, puis tarif **solidaire / classique / engagé** |
| Volet communautaire / carte / wiki | Gratuit |

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
| — | *(à compléter)* | |

---

## 12. Glossaire (à enrichir)

- **Dialectes couverts** : languedocien (Phase 1), puis à définir.
- **Termes techniques du projet** : *(à compléter au fil de l'eau)*
- **Conventions d'écriture occitane** : **norme classique** (base commune). Détails à préciser au fil de l'écriture du contenu.

---

## 13. Prochaines étapes proposées

1. Trancher la question de la **graphie** (bloquante pour le contenu).
2. Définir le **périmètre précis du MVP** (nombre d'unités, thèmes des premières leçons).
3. Faire une **maquette visuelle** d'un premier écran pour donner le ton (design, animations, identité).
4. Choisir la **technologie** de développement.
