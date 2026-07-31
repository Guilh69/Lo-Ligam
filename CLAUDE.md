# Lo Ligam — mémoire du projet

App + site d'apprentissage de l'occitan (languedocien, norme classique) et communauté occitane. Prolonge la marque Instagram existante « Lo Ligam ».

## Documents de référence (à lire d'abord)
- `cahier-des-charges.md` — source de vérité + **journal des décisions** (le lire en entier).
- `plan-pedagogique-phase1.md` — pédagogie, niveaux CEFR, séquençage.
- `parcours-utilisateur-mvp.md` — écrans du MVP.
- `unitat-1-adieu.md` — 1er contenu.
- `charte-graphique.md` — palette, typo, illustrations, piliers UX.

## Valeurs (non négociables)
Éthique, écologie (sobriété), inclusivité (RGAA/WCAG, écriture inclusive), fierté occitane. Européen quand possible.

## Décisions clés déjà actées
- Socle : **SvelteKit**, web d'abord ; mobile via Capacitor plus tard.
- Langues MVP : occitan (défaut) + français. Puis catalan, anglais…
- Niveaux CEFR ; MVP = A1. Âge minimum 15 ans (RGPD).
- Essai libre avant compte. Connexion email/Google/Apple.
- Identité : celle de l'Instagram (terracotta/or/crème, illustrations troubadour, croix occitana), adaptée aux règles d'interface (aéré, illustrations en accents).
- Piliers UX : **animations soignées** (survol/clic/réussite), **sons** (désactivables, légers), **humour fin par touches**.
- Contenu linguistique validé via ressources de lo Congrès (dicodòc).

## Périmètre — rester sur la Phase 1
MVP = apprentissage A1 + compte + questionnaire + relais (lo Congrès, OPLO). PAS de réseau social, wiki, visio pour l'instant.
⚠️ Cartographie (Phase 3) et modèle payant du parcours autonome : réflexions ouvertes en cours de discussion, pas encore tranchées — voir `cahier-des-charges.md` §3/§6/§11 (journal, 2026-07-31) avant de supposer que l'ancien périmètre "tout gratuit, pas de carte avant longtemps" tient toujours.

## Comment travailler avec Romain (l'utilisateur)
- **Non développeur.** Expliquer chaque action en français simple, une étape à la fois, dire quoi cliquer/accepter.
- Contredire quand justifié ; signaler coûts, risques, pièges de périmètre.
- **Ne jamais demander de clé API** (ANTHROPIC_API_KEY) : il utilise son abonnement. Rester sur Sonnet.
- Rôles : Claude conçoit/code/explique ; Romain installe, crée les comptes, héberge, paie, décide.
- Commits Git réguliers et lisibles.

## Coordination entre discussions
Romain travaille sur ce projet via **plusieurs conversations Claude Code séparées**, une par thématique (accueil, parcours pédagogique, paiement, cartographie…). Chaque conversation est indépendante et ne voit pas ce qui se passe dans les autres — mais toutes partagent le **même dossier de projet** et le **même historique Git**. C'est le vrai canal de synchronisation, pas un rapport magique entre instances.

- **En début de session sur une tâche un peu conséquente**, jeter un œil à `git log --oneline -15` et `git status` pour voir ce qui a changé récemment ailleurs, avant de supposer que l'état du code correspond à ce qu'on avait laissé.
- **Committer régulièrement et par petits lots ciblés** (fichiers qu'on a soi-même modifiés), plutôt que de laisser traîner de gros changements non committés — d'autres conversations peuvent tourner en parallèle sur le même dossier, et de gros diffs non committés augmentent le risque de marcher sur le travail des autres.
- **Ne jamais `git add -A` / large add sans relire `git status`** : des fichiers modifiés par une autre conversation peuvent être présents et ne doivent pas être committés à sa place sans le vouloir.
- Si on tombe sur des modifications non committées visiblement faites par une autre conversation (nouveau composant, fichier modifié dont on n'est pas l'auteur) : ne pas les écraser ni les committer à leur place ; les prendre en compte, s'y aligner si pertinent, et le signaler à Romain.
- Les décisions transverses (roadmap, modèle économique, périmètre) se logent dans `cahier-des-charges.md` (§11, journal) — c'est la référence commune à toutes les conversations, pas la mémoire d'une conversation en particulier.
