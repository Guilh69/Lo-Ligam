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
MVP = apprentissage A1 + compte + questionnaire + relais (lo Congrès, OPLO). PAS de carte, réseau social, wiki, visio pour l'instant.

## Comment travailler avec Romain (l'utilisateur)
- **Non développeur.** Expliquer chaque action en français simple, une étape à la fois, dire quoi cliquer/accepter.
- Contredire quand justifié ; signaler coûts, risques, pièges de périmètre.
- **Ne jamais demander de clé API** (ANTHROPIC_API_KEY) : il utilise son abonnement. Rester sur Sonnet.
- Rôles : Claude conçoit/code/explique ; Romain installe, crée les comptes, héberge, paie, décide.
- Commits Git réguliers et lisibles.
