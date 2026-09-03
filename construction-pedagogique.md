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

## 5. Étape A — Le manifeste (v0.2 · 29/08/2026 · amendé par Romain)

> Rédigé à partir des réponses de Romain aux 5 questions d'ouverture
> (philosophie du compte Instagram, reconnexion, ton complice, refus, réf. Busuu),
> puis amendé par lui (v0.2 : promesse positive, pilier 5 = boussole interne).
> C'est la boussole : toute décision de contenu, de gamification ou de design
> devra pouvoir se justifier par une de ces lignes.

### La promesse

**L'occitan per totas e totes.** *(L'occitan pour toutes et tous — ⚠️ forme
occitane à valider.)* On ouvre par l'invitation, jamais par la honte — même
pour dire qu'il n'y en aura pas. Tu pars de zéro ? Bienvenue. Tu le comprenais
chez tes grands-parents sans jamais le parler ? Bienvenue. Tu dis *fada*,
*cagade* et *péguer* depuis toujours ? Alors tu as déjà commencé.

### Les cinq piliers

1. **Legitimitat.** Personne n'a à mériter sa place. L'occitan appartient à
   qui veut s'en saisir — débutant complet, natif rouillé, néo-arrivant,
   diaspora. Le travail silencieux de Lo Ligam est de *lever la honte*
   héritée sans jamais la nommer en premier, et de n'en créer aucune
   nouvelle (ni celle de « mal parler », ni celle de « pas assez pratiquer »).
2. **Reconnexion.** Chaque mot appris est un fil renoué avec du réel : le nom
   de ta rue, l'accent de ta ville, une expression de ta grand-mère, une
   chanson. L'appli fait sans cesse ce pont — on n'apprend pas une langue
   abstraite, on remet du sens sur ce qui nous entoure déjà. Chacun vient avec
   son objectif (parler aux siens, s'ancrer, la toponymie, le travail, le
   bilinguisme…) : l'outil le reconnaît et s'y adapte, au lieu d'imposer un
   moule unique.
3. **Beutat e plaser.** Une expérience aussi belle que ludique : les meilleurs
   standards de design et d'animation (registres RÉCIT/OUTIL du corpus-design),
   un ton **complice, un peu drôle, un peu décalé** — l'humour est une
   signature, pas un vernis. On apprend des choses vraies en s'amusant ;
   la beauté et la progression visible sont les récompenses, pas la peur de
   perdre.
4. **Una lenga plurala, un pòble amassat.** Le languedocien central est notre
   forme d'apprentissage, jamais « le vrai occitan » : les formes des pays
   sont nommées et honorées dès leur rencontre (cadre v0.3 §3). Zéro guerre
   de clocher, zéro guerre de graphie : on se concentre sur ce qui rassemble.
5. **La vertat sens la rancuna.** Lo Ligam dit la vérité historique — la
   responsabilité de l'État français dans la situation de la langue (la
   *vergonha*, l'école de la punition, la relégation) n'est ni tue ni
   édulcorée. Mais cette vérité ne nourrit ni haine de la France ni
   séparatisme : elle explique le présent et fonde une fierté tournée vers
   l'avenir. On raconte pour relier, pas pour dresser.
   *Portée (amendement Romain, v0.2) : ce pilier est une **boussole interne**
   — il guide l'écriture des capsules culturelles, mais ne s'affiche pas
   frontalement en vitrine ; le dosage public se décide au cas par cas.*

### Ce que Lo Ligam ne fera jamais

- Suggérer qu'une variante ou une graphie est illégitime (la parole des natifs n'est jamais une « faute »).
- Culpabiliser : pas de « tu vas perdre ta série ! », pas de notifications anxiogènes, pas de mascotte qui pleure.
- Faire de la peur ou du manque un moteur : les mécaniques s'appuient sur l'envie, jamais sur l'angoisse.
- Classements compétitifs entre apprenants : la communauté est une *còla* (une équipe), pas une arène.
- Dark patterns : pas de fausse urgence, pas d'abonnement caché, pas de friction volontaire.
- Attiser le ressentiment : ni anti-France, ni folklore-musée qui enferme la langue dans le passé.
- Publier une forme occitane non vérifiée (moulinette API + Romain + natifs).

### La référence d'expérience

**La structure de Busuu, l'âme de Lo Ligam.** De Busuu (préféré à Duolingo
par Romain) : le sérieux structurel — parcours CECRL lisible, vraies
explications de grammaire, dialogues réalistes, correction par des locuteurs
natifs (notre *Lo conselh dels vièlhs* et la voie communautaire des tâches).
De Lo Ligam : le ton décalé et complice, l'ancrage culturel charnel, la
beauté méditerranéenne. En un mot : **aussi solide que Busuu, plus drôle,
plus enraciné.**

### Le premier quart d'heure (l'accroche)

Avant toute leçon classique, la personne découvre — en s'amusant — que
l'occitan est déjà chez elle : la philosophie du lieu (pas de honte),
ce qu'est cette langue (latine, sœur du catalan), les mots qui vivent
encore dans le français du Midi, l'accent du Sud comme héritage occitan,
l'aire géographique (32 départements + Val d'Aran + vallées italiennes),
et ses premiers mots. → C'est exactement le rôle du **module 0
« Tu l'as déjà entendu »** du cursus, à enrichir d'un temps « philosophie »
et « aire géographique » (lien avec la carte).

### Pourquoi revenir demain

Pas pour sauver une série : **parce que chaque mot est une reconnexion**, que
l'objectif personnel déclaré au questionnaire donne un cap visible, et que
l'expérience est assez belle et drôle pour donner envie en elle-même. La série
existe, mais bienveillante : elle célèbre, elle ne menace jamais.

### Graines pour l'étape C (idées de Romain, 29/08/2026 — à travailler, rien de tranché)

- **Deux ressources gourmandes ?** Les **fogassas** (déjà les points du moteur)
  et des **crostadas** qui s'accumulent et permettront « d'acheter des trucs »
  (économie cosmétique). À clarifier en étape C : une seule monnaie ou deux
  (ex. fogassa = nourriture/progression, crostada = monnaie d'échange) ; ce
  qu'on peut « acheter » ; et la frontière avec le modèle solidaire de
  paiement (§6 du cahier des charges) — l'économie du jeu ne doit jamais
  devenir un dark pattern.
- **Des personnages de la mythologie des Pyrénées**, qui **se nourrissent de
  fogassa**. Pistes à explorer culturellement (⚠️ à vérifier, certains sont
  gascons/catalans — belle occasion de nommer les pays) : Tantugon (protecteur
  des troupeaux), Joan de l'Ors, las Encantadas (fées des eaux), lo Bécut
  (le cyclope gascon), los Minairons, l'Ors de las fèstas. Contrainte
  manifeste : jamais de mascotte qui culpabilise.
- **Un arbre qui grandit** au fil de l'apprentissage.
- **Une représentation visible de la reconnexion avec la langue des anciens**
  (le fil qui se renoue — cœur du pilier 2 ; forme à inventer).
- Question ouverte : ces quatre images (personnages, arbre, reconnexion,
  ressources) devront s'articuler en **un seul système lisible** — l'étape C
  choisira la métaphore-chapiteau et la place de chacune.

---

## 6. Étape B — Architecture d'expérience (v0.1 · 29/08/2026)

### Décisions tranchées (Romain, 29/08 — consignées au §11 du cahier des charges)

1. **Un seul chemin d'apprentissage : le cursus.** L'essai libre actuel sera
   remplacé par le **module 0 enrichi**, joué sans compte dans le moteur de
   leçon. Il reste en ligne tel quel d'ici là ; sa mécanique lettre-à-lettre
   devient un type d'exercice du moteur.
2. **Rythme au choix de la personne** : une étape par jour (8-10 min) ou un
   module d'un coup (45-60 min). Le rythme *recommandé* s'appuiera sur
   l'objectif quotidien du questionnaire (doux / normal / intensif), sans
   jamais s'imposer.

### Le parcours unifié

```
Arribada (sens compte, zéro friction)
   │
   ▼
Modul 0 « Tu l'as déjà entendu » — enrichi (décision étape A/B) :
   philosophie du lieu · ce qu'est la langue · mots survivants du français
   du Midi · l'accent du Sud · aire géographique (lien carte) · premiers mots
   │        └── remplace l'essai libre actuel, même rôle de porte d'entrée
   ▼
« Garde ta progression » → Compte + questionnaire d'accueil
   (motivation → cap personnel affiché + rythme recommandé)
   │
   ▼
/aprene = lo Camin — sommaire du cursus : les unités du Cicle A1
   présentées comme un chemin (1 Adieu ! → 2 D'ont ses ? → 3 La familha …)
   │
   ▼
Modul (5-6 étapes de 8-10 min, moteur en place)
   ├─ au choix : une étape aujourd'hui, ou tout le module
   ├─ le bloc Rappel est nourri par les items J+2/J+7/J+30
   │  des modules précédents (mécanique du cadre v0.3)
   ▼
Fin de module : célébration + tâche finale → module suivant
   (+ plus tard : un espace « Revisar » dédié aux révisions espacées)
```

### Ce que ça implique (chantiers dérivés, sans date)

- **Rédiger le module 0 enrichi** (étape E — premier de la file, avec 1.2-1.4).
- **Refondre `/aprene` en Camin** conforme aux unités du cursus — ⚠️ page
  construite par la conversation « accueil/app » : coordination obligatoire.
- **Portage de la mécanique lettre-à-lettre** de l'essai libre en bloc du
  moteur (elle a fait ses preuves : sons, fougasse volante).
- **Révisions espacées** : l'architecture leur réserve leur place (Rappels
  nourris par J+2/J+7/J+30, futur espace « Revisar ») ; l'implémentation
  technique reste volontairement différée.
- Le **cap personnel** (motivation du questionnaire) devient un élément
  d'interface visible — à dessiner en étape C/D avec la gamification.

---

## 7. Étape C — Gamification (close le 29/08/2026)

Décisions de Romain : **còla validée** (troupe v0.1, un personnage par unité,
chacun son pays) · **Arbre del Ligam** (unique, racines = les anciens) ·
série = **lo Fuòc de l'ostal** (jours pratiqués + stats, foyer majestueux,
jamais éteint — les braises restent) · **crostadas et badges reportés** à des
plans spécifiques. Spécification : **`gamification.md`** (v0.2). Consigné au
§11 du cahier des charges.

## 8. Étape D — Grammaire des exercices (close le 29/08/2026)

Catalogue écrit et tranché : socle v0.3 (moteur) + 6 nouvelles mécaniques
validées (l'intrus, jeux de lettres, dialogue à choix, Ont es ?, rimes &
virelangues, l'oreille des pays) ; **« vrai/inventé » écarté définitivement**
(plagiat du jeu du Congrès). Voir **`catalogue-exercicis.md`** ; consigné au
§11. Reste ouvert dans le catalogue : ordre de construction, espace Jòcs.

## 8 bis. Chantier « parcours de référence » (demande Romain, 31/08/2026)

Trois étapes : (1) état de l'art des parcours en autonomie et fil recommandé
A1→C2, avec une proposition d'animation par exercice pour arbitrage ;
(2) adaptation à la culture et à la langue occitanes ; (3) corpus A1→C2.
**L'étape 1 est livrée** : `etat-de-l-art-parcours.md` (v0.1, cinq
recherches vérifiées, synthèse, relecture critique consignée en §11 pour la
v0.2). Les dix questions d'arbitrage sont en §9 de ce document.

## 9. Prochaine action

**Étape E — Production en série.** Premier de la file : **le module 0
enrichi** (« Tu l'as déjà entendu » + philosophie + aire géographique), qui
remplacera l'essai libre. Puis 1.2 → 1.3 → 1.4 pour boucler l'unité 1.
Chaîne : rédaction (skill occitan-module) → moulinette API → relecture
Romain → intégration moteur → test navigateur.
