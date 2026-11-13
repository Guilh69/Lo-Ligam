# Catalogue des exercices — grammaire des mécaniques (étape D)

> Version 0.1 · 29 août 2026 · Livrable de l'étape D de `docs/pedagogia/construction-pedagogique.md`.
> Règle d'entrée au catalogue : chaque mécanique se justifie **deux fois** —
> par un principe d'acquisition (cadre v0.3 §4, P1-P8) **et** par un rôle de
> plaisir. L'une sans l'autre ne suffit pas.
> Principes : P1 récupération espacée · P2 input flood/noticing · P3 input
> compréhensible · P4 structured input · P5 pushed output · P6 fluidité ·
> P7 entrelacement · P8 chunks.

---

## 1. Règles transverses (toutes mécaniques)

- **Un item à la fois**, retour immédiat, **explication d'une ligne** après la
  bonne réponse ; jamais plus de 6 items visibles (cadre v0.3, accessibilité).
- L'erreur **secoue gentiment**, ne punit jamais (pas de vies, pas de score
  qui baisse) ; on peut toujours réessayer.
- **Pas de chrono en A1** ; la vitesse est un défi personnel, jamais une
  condition.
- Sons discrets et coupables d'un geste (whoosh/cloche validés) ; animations
  élégantes, `prefers-reduced-motion` respecté ; clavier + aria partout (RGAA).
- L'occitan de tout exercice passe par la moulinette (`verificar:oc`) puis
  Romain, avant intégration.

## 2. Le socle (mécaniques du gabarit v0.3 — déjà dans le moteur)

| Mécanique | Principes | Rôle plaisir | Phase | Bloc moteur | Statut |
|---|---|---|---|---|---|
| Rappel (question → révèle) | P1 | Le petit défi d'entrée : « voyons ce qui est resté » | S1 | RevealBlock | ✅ fait |
| Escota (dialogue scéné + glossaire) | P2, P3 | L'immersion : une scène, des gens, un lieu réels | S1 | DialogueBlock | ✅ fait (audio à venir) |
| Compréhension / Obsèrva (QCM) | P4 | Le déclic « j'ai pigé le truc » à retour immédiat | S2-S3 | QcmBlock | ✅ fait |
| Chunks à retenir | P8 | La collection de trésors (avec « ça sonne comme ») | S3 | ChunksBlock | ✅ fait |
| Practica 3a (bloc) puis 3b (mélange) | P7 (+P4) | La montée en confiance, puis le vrai test mélangé | S4 | QcmBlock | ✅ fait |
| Remets dans l'ordre (tuiles-mots) | P5 | La satisfaction de la phrase qui s'assemble | S5 | OrderBlock | ✅ fait |
| Lettre-à-lettre (scramble de l'essai libre) | P5, P8 | La mécanique signature : sons + fougasse volante | S4-S5 | à porter en bloc | 🔜 décidé (étape B) |
| Traduis / produis (→ modèle) | P5 | Oser dire, puis comparer sans être noté | S5 | RevealBlock | ✅ fait |
| Fluiditat (redis plus vite, 5 mots-clés) | P6 | Le défi personnel, l'aisance qui se sent | S5 | NoteBlock (v1) | ✅ fait (guidé texte) |
| Tasca finala (2 voies) + critères | P5, P6 | Le vrai monde : ma présentation, mon enregistrement | S6 | Note+Checklist | ✅ fait (voie communautaire différée) |
| Bilan + mini-test | P1 | La fierté mesurée (« je peux… seul ») | S6 | Checklist+Reveal | ✅ fait |
| Capsula culturala / chanson | P3 (motivation par le sens) | La respiration, jamais notée | Cultura | NoteBlock | ✅ fait (v1 texte) |

## 3. Les nouvelles mécaniques (validées par Romain le 29/08)

| Mécanique | Principes | Rôle plaisir | Phase | API (conception) | Bloc | Priorité proposée |
|---|---|---|---|---|---|---|
| **L'intrus** — 4 mots, un étranger à la famille | P4 (familles sémantiques) | Rapide, malin, satisfaisant | S4 | sinonimes + Basic | jeu de la salle Jòcs (`Intrus.svelte`) | ✅ fait le 07-11 : 32 séries, quatre par unité, dans Jòcs (cahier §11) |
| **Jeux de lettres** — pendu, anagrammes, mots mêlés à fréquences réelles | P8, orthographe | L'arcade : on joue « pour de vrai » avec les lettres de la langue | S4 + futur espace Jòcs | letras + Basic | nouveau `letter-game` | **2** |
| **Dialogue à choix** — mini jeu de rôle, tu choisis tes répliques face à un personnage de la còla | P5, P8 | Le théâtre : la place du marché, lo Drac en face | S5-S6 | — (contenu nôtre) | nouveau `branch-dialogue` | **3** (répète la tasca en jouant) |
| **Ont es ?** — placer la ville, découvrir son nom occitan | P3 (ancrage réel), toponymie | La carte : « ma ville a un nom occitan ! » | S2 / Cultura / unités lieux | top'Òc | nouveau `map-quiz` (avec la carte existante) | **4** (coordination carte) |
| **Rimes & virelangues** — compléter la comptine, dire de plus en plus vite | P6 (fluidité phonologique) | La musique, le rire du virelangue raté | S5 / Cultura (chanson d'unité) | rimas + fon'Òc | OrderBlock + audio | **5** (avec l'audio) |
| **L'oreille des pays** — d'où vient cette forme, cet accent ? | P2 (noticing de la variation) | La reconnaissance joyeuse de la pluralité (pilier 4) — jamais noté | S2 (Los que parlan enrichi) | — (audio natif requis) | nouveau `listen-guess` | **6** (après pipeline audio) |
| **Los parlars sus la carta** — glisser chaque dialecte sur sa zone (demande Romain 30/08, pour le module 0) | P3 (ancrage réel), pilier 4 | La carte devient un jeu ; « mon coin parle quoi ? » | Module 0 · Cultura | — (couches dialectes déjà en base) | nouveau `map-quiz` sur la carte Leaflet existante | **à caler avec le module 0** |

## 4. Écartée (définitif — ne pas réintroduire)

- **« Vertadièr o inventat ? »** (vrai mot / pseudo-mot via sembla-mots) —
  **décision Romain 29/08 : c'est le concept du jeu du Congrès lui-même, le
  reprendre serait du plagiat.** L'API sembla-mots n'alimente aucun jeu public
  de Lo Ligam.

## 5. Où chaque mécanique vit dans un module (synthèse)

```
S1  Rappel(P1) · Escota(P2-P3)
S2  Compréhension(P4) · Los que parlan → + L'oreille des pays(P2)
S3  Obsèrva(P4) · règle · Chunks(P8)
S4  Practica 3a/3b(P7) · L'intrus(P4) · Jeux de lettres(P8) · Lettre-à-lettre(P5)
S5  Ordre(P5) · Traduis(P5) · Fluiditat(P6) · Rimes/virelangues(P6) · Dialogue à choix(P5)
S6  Tasca finala(P5-P6) · Bilan(P1)
Cultura  Capsule · chanson · Ont es ?(P3)
```
Un module n'utilise jamais tout : 1-2 mécaniques « plaisir » maximum par
module, choisies selon le contenu (charge cognitive, cadre v0.3).

## 6. Questions ouvertes

1. Ordre de construction proposé (§3, colonne priorité) — à valider par Romain.
2. L'espace **Jòcs** hors modules (arcade libre avec les jeux de lettres) :
   Phase 1 ou plus tard ?
3. Le `branch-dialogue` (dialogue à choix) : écrire son modèle de données au
   moment du premier module qui en a besoin, pas avant.

## 7. Pistes open source pour élargir la bibliothèque (demande Romain, 30/08)

À évaluer dans une séance dédiée avant toute adoption (poids des pages,
charte graphique, hébergement européen, licences) :

- **H5P** : la grande bibliothèque libre d'exercices interactifs (glisser les
  mots, zones sur image, cartes-dialogues, mémory…) — déjà citée comme option
  dans le cadre v0.3 §10. Peut se jouer dans notre site sans Moodle via un
  lecteur autonome ; **Lumi**, application de bureau libre, permettrait à
  Romain de fabriquer ces exercices visuellement, sans code.
- **Recommandation actuelle** : pour le quiz des dialectes, pas besoin de
  H5P — notre carte Leaflet et les couches GeoJSON des dialectes existent
  déjà dans le site ; un bloc maison sera plus léger et sur la charte.
  H5P/Lumi restent la piste sérieuse si la demande d'exercices « riches »
  dépasse ce que le moteur maison couvre.
- Garde-fou : tout ajout externe passe par les critères du projet (sobriété,
  RGAA, pas de service tiers appelé depuis le site).
