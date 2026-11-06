# Illustrations faites par IA : mention discrète et cagnotte pour un illustrateur

Idée de Romain, 2026-11-06 vers 20 h. Rien n'est codé. Proposition de Claude, non validée : attendre les choix de Romain (une décision à la fois).

## L'idée (Romain)
- Chaque illustration faite par IA porte une mention très discrète, mais qu'on voit.
- Cette mention mène à une cagnotte pour engager un illustrateur ou une illustratrice (Romain part sans budget et veut être transparent sur l'usage de l'IA).
- À partir d'une certaine somme, la page dit que l'argent sert uniquement à ça ; Romain publiera le justificatif. L'illustrateur n'est pas encore choisi.

## Ce que ça change
- Décision du 30-08 (cahier §11) : « Refus des images IA (valeurs) sans dépendre d'un illustrateur ». Les dessins faits par Claude dans le code en sont déjà sortis ; l'idée du 06-11 l'assume et prévoit de les remplacer. À écrire au §11 quand Romain aura tranché.

## Inventaire (06-11)
Faits par une IA, sûrs (dessinés par Claude dans le code) :
- les 264 dessins de Remira (`app/src/lib/plueja/dessenhs.js`, aussi `/ensag/dessenhs` et Triar) ;
- les cinq affiches de la salle de jeux (`app/src/lib/jocs/sala/Afica.svelte`, d'après ses photos) ;
- les dessins des jeux (paniers, serpent) et les pictogrammes des cases de S'apren ;
- les icônes de l'interface (`app/src/lib/components/*Icon.svelte`, `Icona.svelte`) : proposé, une ligne sur la page plutôt qu'une mention sur chaque bouton.

À demander à Romain (ses visuels Canva : y a-t-il des images faites par l'IA de Canva ?) : bêtes et maison d'Anem (`app/static/anem`), fonds du carrousel (`app/static/bg`), scènes (`app/static/ensag/scena`), `app/static/acuelh/personatge.png`, les fiches (`app/static/fichas`).

Pas concernées : ses photos (`app/static/apren/paisatges`, `cultura`, `aprene/fotos`). À trancher : la carte de profondeur du relief « Relèu ».

## Principes proposés
1. La mention est un lien direct vers la page (un clic), petite mais lisible (contraste RGAA), dans la langue choisie ; pas de pastille ni de verre fumé.
2. Aucun formulaire de carte bancaire sur le site : le bouton de don ouvre la page sécurisée du prestataire. Un simple lien ne demande ni code de paiement ni changement d'en-têtes.
3. Le montant récolté est tenu à la main par Romain avec « Editar » (un élément de page). Un compteur automatique seulement plus tard, avec un contrôle de sécurité.
4. La page dit dès le départ : l'objectif (fixé après un devis), ce qui se passe s'il est dépassé ou pas atteint, la facture publiée (avec l'accord de l'illustrateur).
5. Écriture inclusive ; texte factuel, pas d'accroche dans la voix de Romain.

## Deux voies pour l'argent : B choisie
**Choix de Romain (06-11, vers 20 h 30) : B**, « le pb de l'asso c'est que je suis tout seul et j'ai déjà créé la micro entreprise » (cahier §11). Reste à choisir le service de paiement ; Romain ouvre le compte lui-même.

- **A. Une association et HelloAsso.** HelloAsso est gratuit pour les associations, financé par les pourboires des donateurs (vérifié : sa propre présentation). Une association sans but lucratif ne paie pas d'impôt sur les dons (déduit). Reçus fiscaux pour les donateurs seulement si l'association est d'intérêt général (à vérifier). Il faut au moins deux personnes et quelques semaines.
- **B. La micro-entreprise et un lien de paiement** (Mollie, néerlandais, ou Stripe). Prêt en quelques jours. Les dons comptent comme des recettes : cotisations et impôt, donc collecter plus que le devis (sources secondaires, à confirmer auprès du service des impôts des entreprises ou de l'Urssaf). Pas de réduction d'impôt pour les donateurs. L'activité déclarée de la micro-entreprise est à élargir (PILOTATGE, « Avant le lancement »).

Sources lues le 06-11 : selectra.info (cagnotte d'un commerçant, dons = recettes), helloasso.com (gratuité pour les associations).

## Suite
1. Romain choisit A ou B.
2. Puis : essai de la mention sur une page `/ensag/…` (deux ou trois façons, sur de vrais dessins), la page de la cagnotte sans bouton de don, et le bouton quand le compte existe.
