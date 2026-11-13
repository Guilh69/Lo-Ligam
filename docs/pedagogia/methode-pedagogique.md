# Méthode pédagogique — Lo Ligam

> ⚠️ **Document de juillet 2026, partiellement remplacé** : la mécanique de découverte par blocs-lettres (§1, §5) survit comme type d'exercice du moteur (« Lettre-à-lettre », socle du `docs/pedagogia/catalogue-exercicis.md` §2). En revanche, l'essai libre comme parcours séparé (§2) est remplacé par le module 0 joué sans compte — un seul chemin d'apprentissage, le cursus ; les six composantes d'un module (§2) sont remplacées par le gabarit v0.3 (Rappel, Escota, Obsèrva, Practica, Fluiditat, Tasca — `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/00-cadre-methodologique.md`) ; le contenu de la première leçon (§3) est remplacé par le module 1.1 « Adieu, cossí vas ? » du cursus, vérifié par les API de lo Congrès ; la limite « pas de vrai son » (§4) est levée depuis le premier audio en voix réelle de Romain (en ligne le 2026-08-29). Décisions du 2026-08-29 au §11 du `cahier-des-charges.md`.

> Document vivant, rattaché au plan pédagogique (`docs/pedagogia/plan-pedagogique-phase1.md`). Précise le **mécanisme d'apprentissage** à l'intérieur de chaque module/leçon — apporté par Romain le 30 juillet 2026 (`Modules_occitan.docx`).

---

## 1. Découverte d'un mot (première rencontre)

- **Ludique** : le mot apparaît sous forme de blocs-lettres retournés (face cachée). L'utilisateur tape sur les blocs jusqu'à ce que le mot soit entièrement révélé.
- **Validation** : une fois le mot complet, un son et un visuel de validation se déclenchent, et le mot est ajouté à la **bibliothèque de vocabulaire** de l'utilisateur.
- **Son** : associé automatiquement à la première rencontre du mot ; ensuite, le son ne se rejoue que si l'utilisateur tape dessus (pas d'automatisme répété).
- **Image** : chaque mot est associé à une image qui représente la situation ou le mot.

## 2. Composantes d'un module (dans l'ordre)

1. **Mise en contexte** — situer le thème (lieu, moment, scène de vie occitane).
2. **Découverte** — 3 à 5 notions (mot + image + son), via le mécanisme de blocs ci-dessus.
3. **Pratique guidée** (récupération + feedback immédiat) — exercice facile : par ex. associer le mot français au bon mot occitan parmi ceux du module (mot A, B, C, D → associer « salut » au bon mot).
4. **Production** (mise en sortie + difficulté désirable) — faire dire / écrire / reconstruire le mot ou la phrase.
5. **Petit défi** — utiliser le mot dans son quotidien au moins une fois.
6. **Révision entrelacée** (espacement + interleaving) — quelques items des modules précédents reviennent (sauf en toute première leçon).

**Périmètre de l'essai libre (sans inscription) : étapes 1 et 2 seulement.** Les étapes 3 à 6 nécessitent une progression suivie dans le temps (bibliothèque de vocabulaire persistante, répétition espacée) — donc un compte. C'est exactement le déclic voulu : l'essai libre donne le goût, le compte permet de continuer.

---

## 3. Première leçon — contenu validé par Romain

### Mise en contexte
Commençons par là où tout commence : quand tu rejoins quelqu'un, ou que tu souhaites dire au revoir. Comme dans de nombreuses langues, la forme varie selon le moment de la journée, la proximité avec la personne, et le nombre de personnes.

### Petit contexte
En occitan, pour saluer une personne de manière familière (tutoiement), on dit **« Adieu »** (prononcé *adiou*). Pour saluer plusieurs personnes, ou vouvoyer, on dit **« Adieu-siatz »** (*adioussiatz*), littéralement « soyez à Dieu ». Ce qui est pratique : Adieu et Adieu-siatz fonctionnent aussi bien pour dire bonjour **que** pour dire au revoir !

### Vocabulaire, groupé par usage

**Bonjour/au revoir (les deux à la fois)**
| Occitan | Prononciation | Usage |
|---|---|---|
| Adieu | adiou | dire bonjour ou au revoir à une seule personne, tutoiement |
| Adieu-siatz | adioussiatz | dire bonjour ou au revoir à plusieurs personnes, ou vouvoiement |

**Bonjour (à l'arrivée)**
| Occitan | Prononciation | Usage |
|---|---|---|
| Bonjorn | bounjour | bonjour |
| Bon vèspre | — | bonsoir, à l'arrivée |

**Départ (en quittant)**
| Occitan | Usage |
|---|---|
| Bona jornada | souhaiter un bon reste de journée |
| Bona vesprada | souhaiter un bon reste d'après-midi/soirée |
| Bona nuèch | bonne nuit, avant de dormir |

⚠️ Vocabulaire à confirmer via dicodòc/Lo Congrès avant publication finale (voir mémoire de session — pratique de validation).

---

## 4. Limites techniques actuelles (à lever plus tard)

- **Pas de vrai son de prononciation occitane** : aucune intégration Votz/API lo Congrès pour l'instant. Un bouton d'écoute est prévu dans l'interface mais reste un espace réservé tant que l'intégration audio n'est pas construite — pas de synthèse vocale de navigateur utilisée en remplacement, pour ne pas risquer une mauvaise prononciation qui nuirait à la confiance.
- **Bibliothèque de vocabulaire persistante** : nécessite un compte (base de données utilisateur), pas encore construit.

## 5. Mécanique de découverte — ajustements du 30/07/2026

- **Pas de lettres pièges pour l'instant** : trop dur pour un néophyte en première leçon. Prévu comme mode « difficile » optionnel une fois le socle validé.
- **Traduction française toujours visible** pendant la reconstitution du mot (pas seulement à la fin) — évite de deviner à l'aveugle.
- **Aide intégrée** : un tap sur « Ajuda ? » révèle la lettre suivante ; deux taps rapprochés complètent le mot entier.
- **Points** : 10 par mot, réduits de 3 par lettre obtenue via l'aide (plancher à 2). Affichés en continu, récapitulés à la fin. Persistance uniquement locale (navigateur), pas encore liée à un compte.
- **Saisie clavier** en plus du tap, pour aller plus vite une fois l'utilisateur à l'aise.
