# Illustrations faites par IA : mention discrète et cagnotte pour un illustrateur

Idée de Romain, 2026-11-06 vers 20 h. Trois choix faits le soir même (voie pour l'argent, façon de la mention, service de paiement) ; mention en ligne le 06-11 ; la cagnotte n'est pas encore ouverte.

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

Visuels Canva de Romain (bêtes et maison d'Anem `app/static/anem`, fonds du carrousel `app/static/bg`, scènes `app/static/ensag/scena`, `app/static/acuelh/personatge.png`, fiches `app/static/fichas`) : **pas faits par IA**, pas de mention (Romain, 06-11 : « c'est des visuels issus de Canva »).

Pas concernées : ses photos (`app/static/apren/paisatges`, `cultura`, `aprene/fotos`). À trancher : la carte de profondeur du relief « Relèu ».

## Principes proposés
1. La mention est un lien direct vers la page (un clic), petite mais lisible (contraste RGAA), dans la langue choisie ; pas de pastille ni de verre fumé.
2. Aucun formulaire de carte bancaire sur le site : le bouton de don ouvre la page sécurisée du prestataire. Un simple lien ne demande ni code de paiement ni changement d'en-têtes.
3. Le montant récolté est tenu à la main par Romain avec « Editar » (un élément de page). Un compteur automatique seulement plus tard, avec un contrôle de sécurité.
4. La page dit dès le départ : l'objectif (fixé après un devis), ce qui se passe s'il est dépassé ou pas atteint. Elle montre l'argent récolté, l'argent dépensé poste par poste et le nom des artistes ; **pas de facture publiée** (Romain, 06-11 vers 23 h : « je vais pas mettre la facture, c'est ridicule », il veut que l'on voie « le montant qu'il y a », « le montant qui a été dépensé pour le design », « les postes de dépenses » et « qui sont les artistes qui ont été mobilisés »).
5. Écriture inclusive ; texte factuel, pas d'accroche dans la voix de Romain.

## Deux voies pour l'argent : B choisie
**Choix de Romain (06-11, vers 20 h 30) : B**, « le pb de l'asso c'est que je suis tout seul et j'ai déjà créé la micro entreprise » (cahier §11). Reste à choisir le service de paiement ; Romain ouvre le compte lui-même.

- **A. Une association et HelloAsso.** HelloAsso est gratuit pour les associations, financé par les pourboires des donateurs (vérifié : sa propre présentation). Une association sans but lucratif ne paie pas d'impôt sur les dons (déduit). Reçus fiscaux pour les donateurs seulement si l'association est d'intérêt général (à vérifier). Il faut au moins deux personnes et quelques semaines.
- **B. La micro-entreprise et un lien de paiement** (Mollie, néerlandais, ou Stripe). Prêt en quelques jours. Les dons comptent comme des recettes : cotisations et impôt, donc collecter plus que le devis (sources secondaires, à confirmer auprès du service des impôts des entreprises ou de l'Urssaf). Pas de réduction d'impôt pour les donateurs. L'activité déclarée de la micro-entreprise est à élargir (PILOTATGE, « Avant le lancement »).

Sources lues le 06-11 : selectra.info (cagnotte d'un commerçant, dons = recettes), helloasso.com (gratuité pour les associations).

## Service de paiement : Mollie
**Romain, 06-11 vers 22 h : « il faut celui qui est le plus compatible avec mon projet. Voilà, donc choisi »** : Claude choisit **Mollie** (cahier §11).
- Société néerlandaise, sans abonnement ; lien de paiement où la personne choisit le montant ; page de paiement hébergée chez Mollie : rien à coder, aucun compte à créer pour donner.
- Frais lus le 06-11 dans des comparatifs (sources secondaires, à vérifier sur la page des tarifs de Mollie à l'ouverture) : environ 1,2 % + 0,25 € par carte de particulier européenne, davantage pour les cartes d'entreprise ou hors d'Europe.
- Dons : la page d'aide française de Mollie dit qu'on peut « recevoir des dons », sans condition écrite ; la version britannique exige un statut d'organisme caritatif ; Mollie étudie chaque dossier. À l'ouverture, décrire l'activité telle qu'elle est (micro-entreprise de cours d'occitan ; contributions volontaires pour payer un illustrateur ou une illustratrice). Si Mollie refuse, revenir vers Romain avec une autre option.
- Écartés : Stripe (américain), HelloAsso (réservé aux associations), Ulule (environ 8 %, campagne limitée dans le temps), Liberapay (compte obligatoire pour donner, pensé pour les dons réguliers).

Sources : mollie.com/products/payment-links ; help.mollie.com, articles 115000632489 (dons, versions fr et en-gb) et 115000939369 (activités refusées) ; comparatifs hackceleration.com, kolonell.com, selectra.info.

## Façon de la mention : choisie
**Romain, 06-11 vers 21 h : « Signature et ligne »** (essai `/ensag/ia`) : la signature sur une illustration seule (affiches de la salle de jeux ; Remira, en mode Polsa d'aur seulement, avec « dessenh fach per l'IA » pour ne pas désigner les photos), une seule ligne là où les dessins sont nombreux (`/ensag/dessenhs`). Écrit au cahier §11.

## Lot fait (06-11, soir)
- `app/src/lib/components/MencionIA.svelte` : formes `signatura` (option `cadre`, `quina="dessenh"`) et `linha` ; couleurs à surcharger sur un fond fixe (`--mencion-tinta`, `--mencion-tinta-fort`, `--mencion-trait`) ; textes oc/fr passés à lo Congrès, es/en/ca/ar par Aran (l'arabe reste à Aran, pas prioritaire : Romain, 06-11).
- La page `/illustracions` (`app/src/routes/illustracions/+page.svelte`), ajoutée aux pages harmonisées (clair et sombre).
- La signature sur les cinq affiches de la salle de jeux (encre sombre sur le cadre crème du thème Joiós) ; sur Remira en mode Polsa d'aur seulement (la réserve sous les commandes se remesure quand la barre change de taille, sinon la signature touchait la barre sur téléphone) ; une ligne sur `/ensag/dessenhs` ; sur Cultura, qui reprend des dessins de Remira pour les fiches sans photo (relevé par Joan) : une ligne « los dessenhs » sous la grille quand un dessin s'y montre, une signature sous le dessin d'une fiche.
- Relecture de Joan (06-11) : contrastes de 6 à 10 pour 1, zones de clic de 26 à 30 px ; « remplacera peu à peu » plutôt que « remplacera » (une cagnotte ne paiera pas 264 dessins d'un coup) ; « pauc a pauc » à relire par Romain.
- Mentions légales (Romain, 06-11 : « Oui, ajoute-la ») : sous « Proprietat intellectuala », une phrase dit que les illustrations marquées « facha per l'IA » ne sont pas l'œuvre de l'éditeur, avec un lien vers `/illustracions` (occitan passé à lo Congrès, à relire par Romain ; es, en, ca, ar écrits par Claude sur le modèle des phrases voisines).
- Pour une nouvelle illustration faite par IA : `<MencionIA />` (une illustration seule, `cadre` pour la poser dans son cadre) ou `<MencionIA forma="linha" />` (une page de dessins).
- Reste à signaler : les dessins des jeux (paniers, serpent), les pictogrammes des cases de S'apren, les icônes (une ligne par page plutôt que sur chaque bouton, à voir avec Romain).

## Suite
1. Romain : relire l'occitan de la mention et de `/illustracions` (les textes n'y sont pas encore modifiables avec Editar : dire les corrections) ; ouvrir le compte Mollie au nom de la micro-entreprise (SIRET, pièce d'identité, IBAN, de préférence celui du compte professionnel), en décrivant l'activité telle qu'elle est ; vérifier les tarifs.
2. Avant d'ouvrir la cagnotte : mentions légales et activité de la micro-entreprise élargie (PILOTATGE, « Avant le lancement ») ; traitement des dons confirmé auprès de l'Urssaf ou du service des impôts des entreprises ; illustrateur ou illustratrice choisi, devis obtenu ; objectif fixé, et la règle s'il est dépassé ou pas atteint.
3. Puis (Claude ou Mistral) : le lien de paiement Mollie à montant libre sur `/illustracions`, un encart des comptes (récolté, dépensé, une ligne par poste de dépense, les artistes) tenu par Romain avec Editar.
