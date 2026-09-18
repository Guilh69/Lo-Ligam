# Transposition de la logique centre-racine2.com → Lo Ligam

> Analyse menée le 2026-09-18 (référence choisie par Romain), 15 agents :
> cartographie complète de la navigation, 12 pages analysées, synthèse
> contre-vérifiée par deux critiques adversariales. Ce document est la
> référence des chantiers de navigation pour TOUTES les conversations.
> Les décisions design du 2026-08-22 (riu, typographie, 6 stations,
> une maison/deux ailes) restent actées : rien ici ne les rouvre.

## 1. La mécanique de la référence (ce qu'on transpose)

1. **Hub → feuille** : chaque famille du menu a une page « Tous nos X » ;
   chaque cas précis a sa page feuille au **gabarit unique** (carte-héros
   photo arrondie, infos clés, UN CTA, corps, mini-FAQ, cross-sell final).
2. **Entonnoir à deux vitesses**, toujours visible : CTA fort (rendez-vous)
   + CTA doux sans friction (diagnostic en ligne, aucune inscription).
3. **Levée d'objection transverse** : « Tarifs » en permanence dans la barre.
4. **Jamais d'impasse** : toute page se termine en renvoyant quelque part.
5. **L'accueil rejoue le menu en sections** : on circule sans ouvrir le burger.
6. Fluidité : blocs-déclarations à mots surlignés, cartes arrondies qui se
   révèlent, barre qui se condense, accordéons souples, transitions de page.

## 2. Décisions de Romain (2026-09-18)

| Décision | Détail |
|---|---|
| **Ligne de promesse sous le héros** | Texte de Romain : « L'occitan se parle, s'apprend et se vit. Quel que soit ton objectif, tu es au bon endroit ! » (version òc à valider : « L'occitan se parla, s'apren e se viu. Quin que siá ton objectiu, siás al bon endrech ! ») |
| **Second bouton du héros** | « L'occitan, qu'es aquò ? » → ancre en défilement doux vers la station La lenga (pas la carte, pas la leçon d'essai) |
| **Entrées « Lèu » du menu** | On les GARDE affichées même vides — le site ne sera pas publié rapidement, elles servent de mémoire du cap. (La règle Racine² « rien de mort au menu » est écartée.) |

## 3. Mapping — LANCEMENT

| Racine² | Lo Ligam | Note |
|---|---|---|
| Menu plein écran par familles | Les 4 familles existantes (Aprene / Descobrir / Participar / Lo Ligam) | ✅ existe |
| Barre persistante, double CTA | « Començar » (fort) + accès leçon d'essai à réfléchir en doux ; bascule òc/fr | topbar existante |
| Hub de famille | `/aprene` (chapitres + modules) | ✅ existe en grande partie |
| Page feuille à gabarit unique | `/aprene/modul/[id]` : durée, objectifs (« sabràs dire… »), leçon, puis **cross-sell** « unitat seguenta / tornar al parcors » | gabarit à compléter |
| Diagnostic en ligne (friction nulle) | **La leçon d'essai `/aprene/essai`** (jouable sans compte) mise en avant | le « test de positionnement » n'existe pas : ÉVOLUTION |
| Espace patient | `/compte` (même maison, décision actée) | ✅ existe |
| « Étapes d'une greffe » (frise) | Frise du chemin (essai → Modul 0 → A1…) **dans le hub `/aprene`**, pas une station d'accueil en plus (les 6 stations restent 6) | nouveau |
| FAQ accordéon (4 questions) en bas d'accueil | « Es quin occitan ? · Es a gratis ? · Parti de zèro ? · Quant de temps cada jorn ? » — pas de page FAQ dédiée | nouveau |
| Jamais d'impasse | Renvois de fin de page aussi sur /carta, /mots, /obras | nouveau, peu coûteux |
| À propos / philosophie | Page « A prepaus » : blocs courts, une objection levée par bloc, « seul mais pas seulet » assumé | à construire |
| Contact | Page « Contacte » : UN canal (mail) | à construire |

## 4. Mapping — ÉVOLUTION (notés, pas maintenant)

- **Test de positionnement « Ont ne siás ? »** sans compte — quand le
  catalogue (A1 complet, A2 entamé) aura de quoi router quelqu'un.
- **Portraits d'apprenants** (leur « Avis et Résultats ») — gabarit répété,
  charte photo « sang e aur » ; rien de fabriqué d'ici là.
- **Espace actualités / magazine** (grille filtrable) — déjà noté au §11.
- **Affichage du modèle économique** sur l'accueil — SEULEMENT après
  arbitrage du §6 (les paliers réels, pas des paliers inventés).
- **Familles visibles dans la barre sur grand écran** (Racine² desktop
  expose le catalogue en menus déroulants, pas seulement au burger).

## 5. Écarté (n'a pas de sens pour Lo Ligam)

Pages SEO par ville · WhatsApp flottant multi-centres · compteurs
marketing (les chiffres sourcés OPLO jouent ce rôle honnêtement) ·
carrousel héros (le riu est acté et supérieur).

## 6. Fluidité — le kit à transposer dans la charte

Blocs-déclarations à mots surlignés (or/terracotta sur crème ou brique) ·
carte-héros arrondie des pages feuilles · accordéons souples · barre qui
se condense au défilement · transitions de page (View Transitions, natif)
· révélations liées au défilement déjà actées (corpus §5 bis). Toujours :
CSS pur, `prefers-reduced-motion`, 60 fps (transform/opacity).
