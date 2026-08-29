# Construction pédagogique — bilan & méthode

> Document de travail du chantier « contenu ». Version 0.1 · 29 août 2026.
> Rattaché au cahier des charges (les décisions tranchées remontent au §11).
> Méthode voulue par Romain : étapes successives, allers-retours Claude ↔ Romain,
> nourris de sources externes. Rien ne passe en production sans sa validation.

---

## 1. Bilan — ce qui est acquis au 29/08/2026

### Les fondations documentaires
| Document | Rôle | État |
|---|---|---|
| `cahier-des-charges.md` | Source de vérité + journal de décisions (§11) | Vivant, v0.5+ |
| `Modules_cors/…/cursus/` | **Cursus complet A1→C2 v0.3** : cadre méthodologique (8 principes SLA sourcés), cartes des 6 niveaux (261 modules), fiche phonétique Chatbèrt, lecture par 10 personas | La référence pédagogique |
| `corpus-design.md` | Science de l'apprentissage × design (Mayer, Sweller, revue Duolingo 2012-2020), registres RÉCIT/OUTIL, daltonisme, identité méditerranéenne | La référence design |
| `plan-pedagogique-phase1.md`, `parcours-utilisateur-mvp.md`, `methode-pedagogique.md`, `unitat-1-adieu.md` | Docs de la première époque (avant le cursus v0.3) | Partiellement remplacés par le cursus — à réconcilier (voir §4, étape B) |

### L'application
- **Moteur de leçon** data-driven (`/aprene/modul/1-1`) : 8 types de blocs réutilisables, un module = un fichier de contenu, progression par étape (navigateur ou Supabase), points-fougasses, sons validés, mobile OK.
- **Module 1.1 « Adieu, cossí vas ? »** rédigé selon le gabarit v0.3 et jouable de bout en bout (6 étapes). Occitan en attente de validation finale.
- **Essai libre** (`/aprene/essai`) : la leçon de découverte sans compte, avec sa propre méthode (`methode-pedagogique.md`). Articulation avec le cursus **non tranchée**.
- Comptes, questionnaire d'accueil, carte, admin, hébergement Scaleway : hérités des autres chantiers.

### La chaîne de vérification linguistique (nouvelle)
`npm run verificar:oc -- --modul 1-1` : extrait le lexique occitan d'un module,
interroge **lo Basic** (lemmes, graphie languedocienne) puis **vèrb'Òc** (formes
conjuguées → infinitif). Lexique du module 1.1 : **entièrement validé**.
Un ✓ machine ne remplace jamais la relecture de Romain ni celle des natifs.

---

## 2. Les API de lo Congrès — inventaire testé et rôle

**Décision (Romain, 29/08/2026) : les API servent à la conception et à la
vérification du contenu. Elles ne sont pas appelées depuis le site public.**
(Prudence sur les droits ; les CGU permettraient un affichage direct avec
attribution « Lo Congrès + année » — à réexaminer seulement si un besoin fort
apparaît, par ex. un « mot del jorn » en direct.)

Conséquences pratiques : pas de données lo Congrès stockées chez nous (interdit
par leurs CGU), pas de mention obligatoire sur le site tant qu'on n'affiche pas
leurs données — mais on les créditera volontiers comme outil de vérification
dans les mentions du site. La clé vit dans `app/.env`, jamais dans Git.

### Les 10 API self-service (testées le 29/08 avec la clé de Romain — toutes ✓)

| API | Ce qu'elle rend | Usage pour la construction |
|---|---|---|
| **lo Basic** | Lexique fr↔oc, filtre languedocien, catégories grammaticales | Déjà branché : validation du lexique de chaque module |
| **vèrb'Òc** | Conjugaison complète ; l'inverse aussi (forme → infinitif + analyse) | Déjà branché : validation des formes conjuguées ; générera nos tableaux de conjugaison sans erreur |
| **fon'Òc** | Transcription phonétique + rime riche/pauvre (ex. *bonjorn* → /bun/'dʒur) | Contrôler toutes nos notations « ça sonne comme » ; préparer les « sons du jour » |
| **sinonimes** | Synonymes avec catégorie grammaticale | Enrichir les distracteurs de QCM plausibles ; nuancer le lexique des niveaux B/C |
| **rimas** | Mots qui riment, nombre de syllabes | Comptines, virelangues, chansons d'unité, exercices ludiques de phonologie |
| **sembla-mots** | Pseudo-mots crédibles en occitan (*teumat*…) | Exercices « vrai mot / mot inventé » — discrimination graphie/son, très ludique |
| **letras** | Tirage de lettres pondéré par leur fréquence réelle | Jeux de lettres (pendu, scrabble-like, mots mêlés) fidèles à la langue |
| **top'Òc** | Toponymes oc/fr + coordonnées + code commune (12 départements) | Noms de lieux exacts dans les dialogues ; enrichissement de la carte ; ancrage local réel |
| **express'Òc** | Expressions imagées fr/oc avec illustration et audio | Répertoire d'inspiration pour les capsules culturelles (réécrites par nous, jamais copiées) |
| **punt de lenga** | Fiches de grammaire bilingues | Vérifier nos explications grammaticales contre la référence |

### Les 2 API sur demande (clé séparée : écrire à info@locongres.org)
- **Votz** (synthèse vocale languedocienne) : uniquement pour **prototyper en interne** le rythme des leçons audio. Le cadre v0.3 impose des voix humaines à la publication ; Votz n'est admis qu'en secours provisoire sur des corrigés. → Demander la clé quand on attaquera l'audio.
- **Revirada** (traduction automatique) : **non retenue pour produire du contenu** — la traduction automatique n'a pas le niveau d'un cours de langue. Au mieux un brouillon à tout relire, ce qui ne fait pas gagner de temps sur des textes courts et précis.

---

## 3. Ce que les API changent pour la construction

1. **Zéro forme non vérifiée ne peut plus passer** : la moulinette (Basic + vèrb'Òc, bientôt fon'Òc) tourne sur chaque module avant relecture humaine. Les ⚠️ restants sont de vraies questions (graphie de composés, registre, prononciation fine) — celles qui méritent Romain et les natifs.
2. **Des exercices impossibles à faire sans elles deviennent faciles** : « vrai mot / mot inventé » (sembla-mots), jeux de lettres à fréquence réelle (letras), rimes et virelangues (rimas + fon'Òc). Tout est généré **à la conception**, relu, puis intégré comme notre propre contenu d'exercice.
3. **L'ancrage territorial devient exact** : chaque ville, village ou pays cité dans un dialogue peut porter son nom occitan attesté (top'Òc), cohérent avec la carte.
4. **La prononciation écrite est contrôlable** : nos « ça sonne comme » (décision v0.3 : pas d'API phonétique visible en A1-A2) peuvent être vérifiés un à un contre fon'Òc.

---

## 4. La méthode de construction (proposition à discuter)

Principe : **une étape = une proposition de Claude → réactions de Romain →
sources externes si besoin → décision consignée** (cahier des charges §11 ou
cadre v0.3). On ne passe à l'étape suivante qu'une fois la précédente tranchée.

| Étape | Objet | Livrable | S'appuie sur |
|---|---|---|---|
| **A. Philosophie & accroche** | Pourquoi on apprend sur Lo Ligam et pourquoi on y revient : la promesse, le ton, ce qu'on refuse (dark patterns, culpabilisation), ce qui accroche sans abrutir | Manifeste d'une page | Corpus-design §2.3 (revue Duolingo), valeurs du cahier des charges, personas |
| **B. Architecture d'expérience** | Réconcilier essai libre ↔ cursus ↔ page /aprene ; la boucle d'une séance type ; objectifs mesurables par niveau ; place des révisions espacées | Parcours d'apprentissage unifié (schéma + doc) | Cursus v0.3 §5-6, parcours-utilisateur-mvp |
| **C. Gamification** | Le système complet : fougasses (quoi, combien, pourquoi), séries bienveillantes, badges culturels, célébrations, rythmes — chaque mécanique justifiée, aucune par imitation | Spécification gamification | Corpus-design §2.3 (« récompenses = progression visible et beauté, pas classements »), plan-pédagogique §5 |
| **D. Grammaire des exercices** | Chaque type d'exercice : quel principe SLA il sert, à quel moment du module, ce qu'il apporte de plaisir ; les nouveaux types permis par les API | Catalogue des mécaniques (avec maquettes des nouvelles) | Cadre v0.3 §4, exercices.md du skill, API §3 ci-dessus |
| **E. Production en série** | La chaîne : rédaction (skill occitan-module) → moulinette API → relecture Romain → natifs → intégration moteur → test | Modules 0, 1.2, 1.3, 1.4… puis rythme de croisière | Tout ce qui précède |

L'UX/UI des écrans de leçon avance **en parallèle de C et D** (les mécaniques
et leur mise en scène sont indissociables), dans le cadre des registres
RÉCIT/OUTIL du corpus-design.

### Enseignements retenus de l'article jessem.fr (UX/UI avec Claude Code)
- **La préparation prime sur l'exécution** : vision claire, inspiration rassemblée *avant* de coder. → Prévoir une séance « inspiration » (étape C/D) : décortiquer 3-4 applis d'apprentissage réussies (Duolingo, Drops, Memrise…) pour nommer ce qu'on garde et ce qu'on refuse.
- **CLAUDE.md comme brief permanent du design system** : déjà notre pratique (charte + corpus) ; à maintenir.
- **Itérer sur des exemples aimés plutôt qu'inventer de zéro** : d'où les maquettes comparées, méthode déjà validée avec Romain.
- **Audits Lighthouse réguliers** : rejoint notre exigence de sobriété — à intégrer au rituel de fin de chantier.
- Secrets en `.env` (fait), déploiement GitHub Actions (fait).

---

## 5. Prochaine action

**Étape A — Philosophie & accroche.** Questions ouvertes posées à Romain le
29/08/2026 (réponses attendues avant rédaction du manifeste) : voir la
conversation « parcours pédagogique ». Le manifeste sera versionné ici même.
