# Lo Ligam — cursus d'occitan languedocien A1→C2

Contenu pédagogique du site Lo Ligam (source de vérité : `cursus/`).

## Fichiers
- `cursus/00-cadre-methodologique.md` — norme (CLO 2007 + Alibèrt), choix de formes (§3), 8 principes SLA, gabarit de module paginé en sessions, décisions v0.3.
- `cursus/01-A1-carta-8-unitats.md` — **carte de l'A1 en 8 unités (2026-10-25, Claude rédige depuis le revirement du 25-10)**, remplace la carte de `01-A1.md`.
- `cursus/visio-A1.md` — **les cours en visio de l'A1** (2026-11-01) : format en quatre temps (culture, on écoute, on lit, les mots), plan par défaut en cohérence avec le module autonome, cours 0 de Romain.
- **Tout l'A1 écrit d'un coup (2026-11-01, demande de Romain : « fais-moi l'ensemble du parcours »)** : `cursus/regles-redaccion-A1.md` (règles communes des rédacteurs), `cursus/lexic-A1.md` (l'« À retenir » exact de chaque module), `cursus/alhors-en-occitania-A1.md` (les encarts sur les autres dialectes), `cursus/cultura-A1.md` (faits, chansons, textes), `cursus/trama-A2-C1.md` (la trame des niveaux suivants) ; les modules dans `app/src/lib/lesson/moduls/` (module 0, unités 1 à 8, haltes `pausa-1` à `pausa-4`, `mission-a1`).
- `cursus/cobertura-gramatica.md` : **carte de couverture de la grammaire de référence** (2026-11-02, *Gramatica de l'occitan estandard*, Academia Occitana) : chaque chapitre du livre rattaché à l'A1 ou à la trame, 29 points à placer.
- `cursus/01-A1.md` … `06-C2.md` — carte des unités/modules par niveau + 1 module intégralement rédigé par niveau (4.1, 11.1, 21.1, 33.1, 44.1, 61.1).
- `cursus/07-carta-del-cursus.md` — carte du cursus : formes d'apprentissage / formes en usage, natifs relecteurs, modules réalisés.
- `cursus/08-proposition-personas.md`, `personas-retours-bruts.md` — lecture par 10 personas et arbitrages.
- `cursus/09-fiche-chatbert-lire-occitan.md` — phonétique/orthographe (Chatbèrt) recoupée CLO, intégrée module par module.
- `cursus/modules/` — modules rédigés hors exemples de niveau (un fichier par module) : `1.1-adieu-cossi-vas.md`, `1.2-me-dison-m-apeli.md`, `1.3-soi-de.md`, `1.4-tasca-me-presenti.md` (unité 1 complète — à valider par Romain ; lexique et conjugaisons passés par les API lo Congrès le 29/08/2026).
- `cursus/modules/relectura/` — depuis le 2026-10-25, l'unité 1 vit dans le code du site (`app/src/lib/lesson/moduls/modul-1-*.js`), qui remplace les fichiers .md ci-dessus ; une fiche de relecture et une liste d'enregistrement par module, générées par `node scripts/fichas-relectura.mjs` (dans `app/`).

## Règles non négociables pour tout code ou contenu généré ici
- Graphie classique, languedocien central ; toute forme douteuse → `⚠️ À VÉRIFIER` (Dicod'òc, Vèrb'òc).
- La parole des natifs n'est jamais « francitan », « patois », « faute » : voir cadre §2 et §3.
- Chaque module : sessions de 10-15 min, audio à deux voix (modèle + native), tâche en deux voies (privée / communautaire), briques « Los que parlan » et « Lo conselh dels vièlhs ».
- A1-A2 : pas d'API dans les glossaires (notation « ça sonne comme »).
- Ne pas inventer de mots ni de règles ; sources hiérarchisées dans cadre §2.
- **Style des textes apprenants (Romain, 29/08/2026)** : pas de tirets longs « — » (tic d'IA) sauf tirets de dialogue ; pas de jargon anglophone (« chunk » → « expression ») ; ponctuation légère (deux-points, virgules, parenthèses).
- **Prononciations** : l'usage vivant validé par Romain prime sur fon'Òc (lecture par règles) — ex. *adieu* = « a-DIOU », *adieu-siatz* = « a-di-SSIATS ». Ne pas s'appuyer sur des contrastes du français standard que l'accent du Sud ne fait pas (ex. « rose » vs « bol »).

## Structure attendue d'un module (gabarit cadre §5)
En-tête (can-do, forme, lexique, recyclé, durée, sessions) → Session 1 Rappel + Écoute → Session 2 Comprendre + Los que parlan → Session 3 Observe → Session 4 Entraîne-toi (3a/3b) → Session 5 Parle + À toi (3c, fluidité, tâche) → Bilan → Cultura → Se parles catalan/castelhan → Lo conselh dels vièlhs → Notes pour Romain.
