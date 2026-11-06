# État de l'art : fonctions, animations et jeux à intégrer au site (2026-11-06)

Demande de Romain : chercher ce qui existe (animations, jeux pour enfants, apprentissage des langues) et en tirer des fonctions utilisables sur Lo Ligam.

## 0. Méthode et limites (à lire d'abord)

- Une vingtaine de recherches web, plus des vérifications directes (licences, versions, dossiers de traduction, catalogues de données).
- **Les résultats web sont pauvres** : surtout des blogs d'éditeurs et des comparatifs à liens d'affiliation. Les chiffres de rétention de Duolingo (« +36 % », « 12 % à 55 % ») se contredisent d'une page à l'autre et n'ont pas de source primaire : **ne rien en conclure**.
- Étiquettes : **[vérifié]** = lu à la source ou testé par commande ; **[source faible]** = blog ou site commercial ; **[connu]** = connaissance générale, pas revérifiée ici.
- Les idées viennent des mécaniques, pas des marques : on transpose dans l'idiome du site (règle « inspiration, pas calque »).
- Une autre conversation travaille sur les jeux classiques pour l'application (« jeux-classiques-pour-app ») : à croiser avant de lancer un jeu.

## 1. Ce que le site a déjà (pour ne rien proposer en double)

Blocs de leçon : choix multiples, ordre, écriture, révélation, dialogue, liste à cocher, tableaux, cartes, photos. Jeux : Paniers, Serp, Où es-tu (OntEs). Carnet avec répétition espacée (**ts-fsrs 5.4.2 déjà installé**). Lottie (lottie-web). Pluie de mots, Poussière d'or, musique, carte, récit sur carte, éditeur sur place. Enfants : Anem (bêtes, ombre, Ont es ?, L'ostal).

## 2. Catalogue par famille

### A. Enfants 3-6 ans (Anem)

Cadre d'évaluation utile, [vérifié] : Hirsh-Pasek et al. 2015, *Psychological Science in the Public Interest* : une appli est vraiment éducative si elle est **active** (l'enfant agit, à son rythme), **engageante** sans distraction, **signifiante** (liée à sa vie), **sociale** (l'adulte joue avec). Une étude de 2021 sur 100 applis très téléchargées trouve des scores bas, surtout pour les gratuites, à cause des distractions. À utiliser comme grille de contrôle de chaque coin d'Anem.

Mécaniques fréquentes dans les applis pour petits [source faible, mais convergentes] : tout est audio d'abord, rien à décoder, boucle courte « toucher, entendre, répéter », séances de 3 à 7 minutes, la voix nomme chaque objet posé, plusieurs doigts permis (frère et sœur ensemble), pas de punition.

| Idée | Ce que c'est | Effort | Remarque |
|---|---|---|---|
| Scène « le corps » | même recette que L'ostal | faible | déjà prévue |
| Scènes « ferme », « cuisine », « dehors » | une scène par centre d'intérêt | faible chacune | l'outil de découpe existe (`outils/anem`) |
| Mémoire image-son | retourner des cartes, la voix dit le mot, paires image-image | moyen | pas de lecture, très classique |
| Tri | glisser la bête dans la bonne boîte (ferme / bois ; grand / petit) | moyen | catégories = vocabulaire en contexte |
| Compter | toucher 1 à 10 objets, la voix compte | faible | le plus utile pour la suite du cursus |
| Couleurs | mélanger deux couleurs, la voix nomme le résultat | moyen | idée courante des suites d'activités libres |
| Autocollants | poser des bêtes dans une scène, la voix les nomme | moyen | l'enfant crée, la scène s'enregistre sur l'appareil |
| Comptine chantée | texte qui s'allume mot à mot sur la voix | moyen | **droits à vérifier** avant toute parole |
| Coloriage au doigt | remplir un dessin | moyen | proche de L'ostal |
| Histoire à choisir | deux images, l'enfant choisit la suite | élevé | contenu à écrire |

Contraintes déjà dans les valeurs : aucune donnée enfant, aucune publicité, aucune boutique. Cibles tactiles larges (au moins 44 px recommandés [connu]).

### B. Adultes : jeux et exercices à ajouter

| Idée | Principe | Pourquoi ici | Précaution |
|---|---|---|---|
| Mot du jour façon grille | deviner un mot en N essais avec retour de couleur | rituel quotidien, très partageable | **les digraphes lh, nh, ch, ts, tz et les accents** compliquent la grille : décider si « lh » compte pour une case |
| Mots croisés générés | grille construite depuis les mots d'une unité | révision sans cartes | génération à valider (mots vérifiés lo Congrès) |
| Groupes de quatre | trouver quatre mots liés parmi seize | révise familles et champs lexicaux | catégories écrites à la main |
| Dictée à trous audio | entendre, compléter | écoute + orthographe | demande des enregistrements |
| Conjugueur ludique | construire la forme juste d'un vèrb'Òc | grammaire sans fiche | formes vérifiées (règle « conjuguer, ne pas déduire ») |
| Dialogues à embranchements | choisir la réplique, scénario fixe | conversation sans IA | scripts à écrire |
| Défi de la semaine | mêmes dix mots pour tout le monde | lien avec les cours en visio | simple à publier |

### C. Animations et ressenti

- **Lottie (déjà là)** : bon pour les motions décoratives, jouées sans réaction. [source faible] Le format dotLottie a maintenant des machines à états.
- **Rive** : fichiers `.riv` à états qui **réagissent** au doigt (un personnage qui suit le toucher). Version 2.49.4 sous licence MIT [vérifié]. Une comparaison indépendante (Callstack, avril 2024) donne des résultats mixtes sur la mémoire : à tester sur le téléphone de Romain avant de choisir. L'intérêt n'existerait que s'il y avait un personnage animé réactif, ce que Romain n'a pas demandé.
- **Sans bibliothèque** : transitions de vue du navigateur, animations CSS liées au défilement, animations Web, tout ce que le site fait déjà (sobre, léger). Recommandation : **rester là** par défaut, ce qui respecte la sobriété (poids des pages).
- Petites récompenses : confettis (canvas-confetti 1.9.4, licence ISC [vérifié], très léger), vibration brève sur téléphone, son discret désactivable. Garder l'esprit « sobre, pas kitsch » : une seule touche.
- Toujours : respecter « réduire les animations » (déjà fait dans ScenaTocar).
- Pour des jeux avec physique : Matter.js. Pour un vrai moteur de jeu : Phaser 4 (avril 2026 [source faible]) ou PixiJS, **à éviter** sauf besoin réel (poids).

### D. Voix et audio

- **Voix de synthèse en occitan : il n'y en a pas de libre prête.** Piper n'a pas de voix occitane [vérifié sur le catalogue Hugging Face] ; espeak-ng, qui sert de phonétiseur à Piper, n'a pas l'occitan [vérifié : 0 occurrence]. La synthèse du navigateur ne parlera occitan que si le système l'a installé : à ne pas supposer. Des travaux de recherche existent sur le gascon (Tacotron2, LREC 2020) mais sans modèle publié trouvé. **La voix de Romain reste la référence.**
- **Lingua Libre (Wikimédia Commons)** : **14 254 enregistrements** étiquetés occitan [vérifié]. Licence libre avec attribution. Pistes : prononciation d'un mot absent des enregistrements de Romain, en signalant la variété (locuteurs mêlés : à vérifier mot par mot).
- **Common Voice occitan** : 13,4 h enregistrées, 2,7 h validées, 149 voix, CC0, **mais ré-hébergement interdit** [vérifié sur la page Mozilla]. Trop petit pour entraîner une voix ; utilisable comme corpus d'écoute à titre de référence, pas à republier.
- **Reconnaissance vocale** : un modèle `whisper-small-occitan` existe sur Hugging Face [vérifié que le dépôt existe, qualité non évaluée], et un article de 2024 traite la reconnaissance du gascon et du languedocien. Faire tourner un Whisper dans le navigateur est possible [source faible] mais lourd (téléchargement de centaines de Mo : en contradiction avec la sobriété) et la sortie d'un Whisper « corrige » la prononciation au lieu de la mesurer. **Verdict : expérience de laboratoire, pas fonction publique.**

### E. Motivation sans manipulation

- Les mécaniques les plus citées (série de jours, ligues, points, niveaux) ont des associations positives dans de petites études [source faible], aucune preuve causale solide trouvée.
- Les risques réglementaires et éthiques sont réels : « dark patterns » sanctionnés contre des jeux pour enfants (affaire Epic/Fortnite, 520 M$, 2022-2023 [vérifié via cabinets juridiques]). La CNIL (juin 2021) : 8 recommandations pour les mineurs, consentement parental conjoint **avant 15 ans** [vérifié].
- Idée cohérente avec vos valeurs : **ni vies, ni punition, ni série qui se perd.** Propositions : « fil de la semaine » qui ne se casse jamais (on voit seulement ce qu'on a fait), fin de séance proposée au bout de quelques minutes, objectif choisi par l'apprenant, rappels volontaires. Une appli concurrente sur les langues celtes se vend d'ailleurs sur « sans mascotte, sans confettis, sans culpabilité de série » [source faible] : il y a un public pour ce ton.

### F. Science de l'apprentissage

- Pratique de rappel (tester plutôt que relire) et espacement : bénéfices solides, de l'ordre d'un demi-écart-type sur des tests finaux [source : revue en accès libre, lue via recherche]. **Déjà couvert par FSRS dans le carnet.**
- Entrelacement : effet réel mais variable, parfois nul ou inversé. L'utiliser surtout pour les conjugaisons [une étude sur les verbes en langue étrangère va dans ce sens].
- L'effet de test est propre à l'élément testé : réviser *chaque* mot, pas un mot pour en apprendre un autre.
- Cartes numériques : on oublie plus vite à la production qu'à la reconnaissance : proposer des exercices « produire » en plus des « reconnaître ».

### G. Communauté et cours en visio

- En tandem, la qualité de la relation entre partenaires prédit la poursuite [source : étude UPV/UOC]. Les tâches guidées allongent les échanges. Les séances de groupe structurées valent mieux que des rencontres libres [source faible].
- Pistes : annuaire de groupes et boîte à idées (« Amassa », déjà décidé), séances tandem à thème avec consigne, défi de la semaine commun avec les cours de Romain.

### H. IA conversationnelle

- Risques établis : hallucinations (une correction fausse et sûre d'elle s'ancre), dépendance, perte d'autonomie [revue 2025 de 70 études]. Aucune source trouvée sur la qualité des petits modèles ou de Mistral en occitan.
- **Recommandation : pas de tuteur libre côté apprenant.** Usage possible : brouillons d'exercices pour Romain, toujours relus et vérifiés (lo Congrès).

### I. Accessibilité

- Parcours à un seul bouton (accès par balayage) étudié pour les enfants à handicap moteur [connu]. Les jeux éducatifs Android testés (30) ont beaucoup de barrières [source : Univ. Washington]. Pour Anem : tout doit rester faisable sans geste complexe, avec focus clavier, noms accessibles, pas de minuterie contraignante (déjà le cas dans L'ostal).

### J. Ressources à réutiliser ou à nourrir

- **GCompris** (KDE, plus de 100 activités, licence AGPL v3 [vérifié]) : **pas de traduction en occitan** dans son dossier de langues (catalan, basque, breton, gaélique irlandais et écossais présents) [vérifié]. Deux usages : (1) bibliothèque d'idées d'activités ; (2) **traduire GCompris en occitan** serait un apport public et visible. Ne pas copier du code : AGPL.
- **Tatoeba** : l'occitan (code `oci`) y figure ; le nombre de phrases n'a pas pu être relevé.
- **OccitanIA** (organisation Hugging Face) : dictionnaires et corpus ouverts (dictionnaire général, botanique, commerce, noms de personne et de lieu). Vérifier licences avant usage.

## 3. Priorités proposées

Ce que Romain peut faire seul maintenant : choisir une option ci-dessous ; enregistrer ses 20 mots d'Anem.

**Option 1, Anem d'abord (recommandée)** : scène « le corps », puis « compter jusqu'à 10 », puis mémoire image-son. Même recette, peu de risque, tout sans lecture. Contrôle par la grille des quatre piliers.

**Option 2, adultes d'abord** : mot du jour avec digraphes, puis groupes de quatre, puis défi de la semaine commun aux cours. Fort effet de rituel, mais demande une règle sur « lh, nh, ch ».

**Option 3, ton et motivation** : remplacer toute idée de série par le « fil de la semaine » sans perte, et une fin de séance douce, sur tout le site. Petit chantier, cohérent avec la sobriété.

À prévoir plus tard, avec aide : voix (enregistrements, éventuellement Lingua Libre), traduction de GCompris, éventuel test de reconnaissance vocale en laboratoire.

## 4. Ce qui n'a pas pu être vérifié

- Efficacité réelle des séries et ligues (pas de source primaire).
- Qualité et licence du modèle `whisper-small-occitan` ; poids exact d'un Whisper dans le navigateur.
- Nombre de phrases occitanes dans Tatoeba ; variété linguistique des enregistrements Lingua Libre.
- Droits des comptines (« Joan Petit que dança », « Sòm, sòm ») : à vérifier avant toute parole.
- Chiffres précis de Rive contre Lottie sur l'appareil de Romain.

## Sources principales

- Hirsh-Pasek et al. 2015 : <https://doi.org/10.1177/1529100615569721> ; synthèse : <https://www.newamerica.org/insights/new-framework-identify-truly-educational-apps/>
- CNIL, 8 recommandations : <https://www.cnil.fr/la-cnil-publie-8-recommandations-pour-renforcer-la-protection-des-mineurs-en-ligne>
- GCompris : <https://gcompris.net/> ; licence : <https://github.com/KDE/gcompris>
- Common Voice occitan 24.0 : <https://datacollective.mozillafoundation.org/datasets/cmj8u3pl700k9nxxb2rp2erco>
- Lingua Libre occitan : <https://commons.wikimedia.org/wiki/Category:Lingua_Libre_pronunciation-oci>
- Voix Piper : <https://huggingface.co/rhasspy/piper-voices> ; ts-fsrs : <https://github.com/open-spaced-repetition/ts-fsrs>
- Rive contre Lottie (Callstack) : <https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation>
- Risques des grands modèles en éducation : <https://arxiv.org/pdf/2509.21972>
