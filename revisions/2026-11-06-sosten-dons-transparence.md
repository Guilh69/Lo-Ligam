# Soutenir Lo Ligam : dons, accès symbolique, comptes publics

Idée de Romain, 2026-11-06 vers 23 h 15, née de la cagnotte des illustrations (`revisions/2026-11-06-illustrations-ia-cagnotte.md`). Rien n'est décidé ni codé. Répond en grande partie au §6 du cahier (modèle économique, « envisagé, pas tranché »).

## Ce que veut Romain (ses mots)
- « créer une arborescence cohérente avec les dons » ; « peut-être des dons récurrents » ;
- être transparent sur ce qui sert « pour développer », « pour faire appel à des illustrateurs », « pour des projets particuliers », « pour l'hébergement », « pour avoir une marge aussi pour pouvoir avoir plus de temps dessus, et à terme pouvoir en vivre, hein, être honnête sur ça » ;
- « je veux pas faire payer absolument » ; « une partie vraiment qui sera accessible que via un paiement symbolique » ; « la grande majorité du site soit complètement gratuit » ; « qu'on puisse donner quand même facilement » ; « une interface solide pour ça ».
- Déjà décidé : pas de facture publiée, mais l'argent reçu, l'argent dépensé poste par poste et les artistes (cahier §11, 06-11).

## Proposition de structure (Claude, à valider)
**Ce qui entre**
1. Dons libres, une fois ou chaque mois, sans contrepartie (le site reste gratuit pour tout le monde).
2. Accès à la partie payante, à prix symbolique (même logique solidaire / classique / engagé que la visio ?).
3. Cours en visio (grille A, déjà décidée).
4. Plus tard, des cagnottes pour un projet précis, avec un objectif (la première : les illustrations).

**Ce qui sort, affiché sur une page des comptes** (chaque trimestre, en euros et en part du total)
- le temps de Romain (sa rémunération, pour y passer plus de temps et, à terme, en vivre) ;
- les illustrations et les artistes (avec leurs noms) ;
- l'hébergement et les services (serveur, base de données, nom de domaine) ;
- le développement (outils, matériel) ;
- les projets particuliers ;
- les cotisations sociales et l'impôt (la part de l'État, dite clairement) ;
- la réserve.

## Première décision : où passe l'argent
**Choix de Romain (06-11, vers 23 h 25) : A, « Une seule caisse »** (cahier §11). Open Collective Europe n'est plus retenu.
- **A. Une seule caisse, la micro-entreprise** : dons, accès et visio au même endroit ; la page des comptes montre où va l'argent. Simple, cohérent avec « en vivre » ; tout est imposable ; pas de réduction d'impôt pour les donateurs (à dire sur la page).
- **B. Deux caisses** : les projets d'intérêt public (illustrations sous licence libre, projets particuliers) par Open Collective Europe, s'il accepte ; le reste par la micro-entreprise. Comptes des projets publics d'office, mais deux systèmes à tenir, et un refus possible (personne seule, site qui vend).
- Plus tard possible : une association, quand une deuxième personne s'engagera.

## Deuxième décision : le service de paiement (comparé le 06-11, 23 h 30)
À savoir d'abord : un don ponctuel peut passer par un simple lien, sans code, chez tous. Les **dons mensuels** et l'**accès payant qui s'ouvre tout seul** demandent de relier le service au site (du code, et la relecture de Rodrigo), quel que soit le service. Seul Liberapay gère les dons mensuels de son côté, mais il faut un compte pour donner et il reverse par Stripe ou PayPal.
- **A. Lyra Collect** : Lyra Network, SAS créée en 2001, siège à Labège près de Toulouse, décrite comme une entreprise de taille intermédiaire indépendante (Le Journal des entreprises) ; Lyra Collect est un établissement de paiement agréé par l'ACPR. Environ 1,4 % + 0,20 € par paiement, pas d'abonnement, des frais de mise en service (190 € dans une offre partenaire). Liens de paiement, prélèvement SEPA, API avec notifications. **À demander à Lyra** : un micro-entrepreneur est-il accepté ? les paiements mensuels sont-ils possibles ? le prix de la mise en service ? des dons sans contrepartie sont-ils acceptés ?
- **B. Mollie** : néerlandais, environ 1,2 % + 0,25 €, ni abonnement ni frais de mise en service, documentation et API très claires (le plus simple à relier au site, dons mensuels par l'API) ; mais financé par de grands fonds d'investissement.
- **C. Payplug** : français, filiale de Natixis (groupe BPCE, banques coopératives) ; formule Starter à 10 € HT par mois plus des frais par paiement (environ 0,8 à 2,2 % selon les sources) ; l'abonnement pèse tant que les dons sont rares.
- Écartés : GoCardless (britannique, prélèvement seulement, 1 % + 0,20 €), Stripe (américain), Liberapay (compte obligatoire, reverse par Stripe ou PayPal), PayZen (demande un contrat de vente à distance avec une banque et un abonnement mensuel).

Sources : lejournaldesentreprises.com (Lyra Network), ecommerce-nation.fr et wizishop.fr (tarifs Lyra Collect), docs.lyra.com, leptidigital.fr et kolonell.com (Payplug), kolonell.com (GoCardless), mollie.com/products/recurring.

## Décisions suivantes (une à la fois)
2. Le service de paiement, d'après la caisse choisie et ces critères : dons ponctuels et mensuels sans compte à créer, paiement de l'accès qui ouvre l'accès tout seul, européen, éthique, frais. Le besoin de dons mensuels change la comparaison du 06-11 (Liberapay, sans commission, est fait pour ça ; un accès payant demande un service qu'on relie au site).
3. Ce qui est derrière l'accès symbolique (§6 : où placer la limite gratuit / payant).
4. La page « Soutenir » et la page des comptes (à quoi elles ressemblent).

## Avant d'encaisser quoi que ce soit (PILOTATGE, « Avant le lancement »)
Mentions légales complètes (adresse, téléphone) ; activité de la micro-entreprise élargie ; conditions générales de vente pour l'accès payant ; traitement des dons confirmé auprès de l'Urssaf ou du service des impôts des entreprises.

## Ampleur
Un vrai chantier, en plusieurs séances : deux pages (soutenir, comptes), le branchement d'un service de paiement, puis l'accès payant relié aux comptes des élèves (relecture de sécurité par Rodrigo obligatoire). Romain peut seul : décider, ouvrir les comptes, faire les démarches. Avec de l'aide : les pages et les branchements.
