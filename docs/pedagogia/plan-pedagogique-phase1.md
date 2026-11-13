# Plan pédagogique — Lo Ligam — Phase 1 (MVP)

> ⚠️ **Document de juillet 2026, partiellement remplacé** : restent valables le cadre CECRL avec un A1 abouti d'abord (§1), le fil rouge culturel (§3) et le principe des garde-fous de périmètre (§7 — la cartographie est toutefois en cours d'arbitrage, voir `cahier-des-charges.md` §3/§6/§11). L'architecture et la liste des 6 unités du Cicle 1 (§2, §4) sont désormais dans le cursus A1→C2 (`Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/` : A1 = 10 unités + module d'accueil, gabarit de module v0.3) ; les mécaniques d'exercices (§5) dans `docs/pedagogia/catalogue-exercicis.md` (étape D) ; l'enrobage gamifié (§5) dans `docs/pedagogia/gamification.md` (étape C : Arbre del Ligam, còla, lo Fuòc de l'ostal) ; l'audio (§6) s'appuie désormais sur la voix réelle de Romain (premier audio en ligne le 2026-08-29), les API de lo Congrès — dont Votz — étant cantonnées à la conception et à la vérification, sans appel depuis le site public ; le rythme de séance (§8) est tranché : au choix de la personne. Décisions des 2026-08-29/30 au §11 du `cahier-des-charges.md` ; état de l'art : `docs/pedagogia/etat-de-l-art-parcours.md`.

> Document vivant, rattaché au cahier des charges. Couvre **uniquement la Phase 1** (le cœur d'apprentissage).
> Version : 0.1 · 28 juillet 2026

---

## 1. Niveau visé

Le parcours est structuré selon le **CEFR (A1, A2, B1, B2…)**. Le **MVP couvre le niveau A1** (débutant complet) : de « je ne connais aucun mot » à « je peux me présenter, compter, parler de ma famille et de mon quotidien ».

L'utilisateur déclare son niveau à l'inscription et peut viser plus haut *dès que le contenu supérieur existe* (au MVP, seul l'A1 est disponible ; un test de placement viendra plus tard).

On ne vise pas l'exhaustivité au lancement. On vise un **premier niveau abouti, beau et fier**, qui donne envie de continuer.

---

## 2. Architecture du parcours

```
Parcors  →  Cicles  →  Unitats  →  Leçons  →  Exercicis
```

- **Cicle** : un grand chapitre thématique (ex. « Primièrs pas »).
- **Unitat** : un thème précis (ex. les salutations).
- **Leçon** : 3 à 5 minutes, une poignée de notions, format court et gamifié.
- **Exercici** : la brique de base (voir §5).

**Le MVP = le Cicle 1 « Primièrs pas ».** Rien de plus. On l'étoffera ensuite.

---

## 3. Le fil rouge culturel (notre différenciation)

C'est ce qui distingue Lo Ligam d'un clone de Busuu. Chaque unité est **ancrée dans un lieu, une scène ou un moment de la vie occitane**, et se referme sur une **capsula culturala** : une chanson, un proverbe, un bout d'histoire, une expression imagée.

On n'apprend pas « le mot maison » dans le vide : on entre dans un *ostal*, sur une *plaça de vilatge*, au *marcat*. La langue arrive avec son monde.

---

## 4. Les unités du Cicle 1 (proposition à valider)

**Principe de séquençage (psycholinguistique).** L'ordre des unités ne suit pas seulement les thèmes, mais la logique d'acquisition d'une langue : vocabulaire à **haute fréquence** d'abord ; du **concret et proche** (soi, l'entourage) vers le lointain ; des **blocs fonctionnels** (savoir *faire* : saluer, se présenter, demander) ; une **grammaire dans l'ordre où elle s'acquiert** (*èsser*, *aver*, présent avant le reste) ; **recyclage permanent** du vocabulaire des unités précédentes ; familiarisation **sonore** dès le début (sons propres du languedocien). Chaque unité sera justifiée à l'aune de ce principe au moment de son détail.

| # | Unité | Contenu linguistique | Point de grammaire | Ancrage culturel |
|---|---|---|---|---|
| 1 | **Adieu !** | Saluer, se présenter, dire au revoir | Pronoms sujets ; *èsser* (présent, singulier) | La *plaça del vilatge* : où l'on se rencontre |
| 2 | **Un, dos, tres** | Nombres, politesse (*mercé, se vos plai*) | Le genre des noms (masc./fém.) | Compter *al marcat* |
| 3 | **La familha** | Membres de la famille | *Aver* (présent) ; possessifs simples | Une chanson traditionnelle sur la famille |
| 4 | **A l'ostal** | La maison, objets du quotidien | Articles définis/indéfinis | L'*ostal* occitan, la vie domestique |
| 5 | **Al marcat** | Aliments, achats simples | Les partitifs, « quant còsta ? » | La gastronomie et les produits du terroir |
| 6 | **Lo temps que fa** | Météo, jours de la semaine | Verbes impersonnels (*plòu, fa calor*) | Les dictons météo occitans |

**Levier de périmètre :** on peut lancer un MVP crédible avec **les 4 à 6 premières unités**. C'est le curseur le plus simple pour ajuster la charge de travail avant le premier lancement.

> ⚠️ **Exactitude linguistique.** Les exemples occitans de ce document sont illustratifs. Tout le vocabulaire et toutes les formes seront **validés via les ressources de lo Congrès (dicodòc / API Basic)** avant production, y compris les variantes languedociennes (ex. *me sòni* / *m'apèli*). On ne publie aucune forme non vérifiée.

---

## 5. Mécaniques d'exercices (gamification)

Le socle, volontairement simple et efficace, décliné avec notre identité :

- **Escota e chausís** — on écoute (audio Votz) et on choisit la bonne réponse.
- **Associacion** — relier un mot à une image / à sa traduction.
- **Completar la frasa** — compléter un trou.
- **Reconstruccion** — remettre des mots-tuiles dans l'ordre.
- **Capsula culturala** — un temps culturel *non noté* entre deux leçons (chanson, proverbe, anecdote). Respiration, pas évaluation.
- *(Phase 1.1)* **Prononciacion** — répéter au micro, retour via la transcription phonétique (API fon'Òc). À garder pour une itération ultérieure, plus complexe techniquement.

**Ce qui nous rend différents**, ce n'est pas le type d'exercice (universel), c'est : l'ancrage dans des lieux réels, la capsule culturelle, le *mot del jorn* tiré du module express'Òc, et l'audio en vraie voix languedocienne.

**Enrobage gamifié — mais fidèle aux valeurs :**
- **Punts (XP)** et progression visible.
- **Sèrie (streak)** *bienveillante* : elle encourage, elle ne culpabilise pas (pas de notifications anxiogènes, pas de « tu vas tout perdre ! »).
- **Objectius** quotidiens réglables (l'utilisateur choisit son rythme, y compris très doux).
- **Badges** aux couleurs de la culture occitane, plutôt que génériques.
- **Aucun *dark pattern*** : cohérent avec l'engagement éthique du projet.
- **Animations élégantes et fluides** (exigence) : transitions soignées, retours visuels satisfaisants à chaque réussite, micro-animations qui donnent le sentiment d'une appli haut de gamme. À concevoir dans le respect de la sobriété technique (fluide ≠ énergivore).

---

## 6. Audio

- Source privilégiée : **Votz** (synthèse vocale de lo Congrès), voix languedocienne existante.
- Repli / complément possible : enregistrements humains sur les mots-clés, plus tard.
- ⚠️ Conditions d'utilisation de Votz à cadrer avec lo Congrès (cf. cahier des charges §8).

---

## 7. Hors périmètre du MVP (garde-fou)

Pour tenir le cap, **ne figurent PAS** dans la Phase 1 :
la carte des dialectes · le volet réseau social · la page wikiòc · les cours en visio · le partage de photos · la proposition d'expressions par les utilisateurs · les dialectes autres que le languedocien.

Tout cela viendra — plus tard, dans ses phases. Le socle d'abord.

---

## 8. Décisions à trancher

- [ ] Nombre d'unités pour le lancement (4 ? 6 ?).
- [ ] Ton exact de la gamification (à affiner en concevant l'écran).
- [ ] Prononciation au micro : Phase 1 ou 1.1 ? (proposition : 1.1).
- [ ] Audio : Votz d'abord ; **prononciation humaine envisagée mais reportée** (« à voir après »).
- [ ] Structure interne d'une unité : combien de leçons, quelle longueur ?

---

## 9. Prochaine étape proposée

**Détailler entièrement l'Unité 1 « Adieu ! »** : liste de vocabulaire validée, découpage en leçons, exercices concrets, capsule culturelle. Ce sera le premier vrai contenu de Lo Ligam — et la matière parfaite pour dessiner ensuite le premier écran.
