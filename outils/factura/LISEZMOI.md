# Factures des cours en visio

Petite page sur ton ordinateur, sans internet, qui fait tes factures numérotées à l'identité de Lo Ligam et tient ton livre des recettes. Décidé le 2026-10-25 (cahier §11).

## Lancer
1. Ouvre `C:\Users\perie\Depots\Lo_Ligam\outils\factura`.
2. Double-clique sur **Factures.cmd**. Une fenêtre noire s'ouvre, puis la page dans Firefox.
3. Laisse la fenêtre noire ouverte pendant que tu travailles ; ferme-la quand tu as fini.

La première fois, la page ouvre l'onglet **Réglages** : ton nom, l'adresse déclarée de ta micro-entreprise, ton SIRET, ton alias, l'IBAN du compte réservé à l'activité. Puis « Enregistrer les réglages ».

## Faire une facture
1. Onglet **Nouvelle facture** : le nom et l'adresse de l'élève (la page les retient pour la fois suivante), la formule, le tarif choisi par l'élève.
2. La facture se dessine à droite au fur et à mesure.
3. « Émettre la facture » : elle reçoit son numéro (2026-001, 2026-002…) et ne se modifie plus.
4. « Imprimer ou enregistrer en PDF » : dans la fenêtre d'impression de Firefox, choisis « Enregistrer au format PDF », range-le dans le dossier `PDF`, puis envoie-le à l'élève. Si Firefox ajoute l'adresse de la page en haut ou en bas, décoche « Imprimer les en-têtes et pieds de page ».

## Quand l'élève a payé
Onglet **Factures émises**, « Paiement reçu », la date et le moyen, puis « Noter au livre des recettes ». La ligne s'ajoute au livre et la facture affiche « Payée le… ».

## En cas d'erreur
On ne supprime jamais une facture (la numérotation doit se suivre sans trou). « Annuler par un avoir » crée une pièce qui l'annule ; refais ensuite une facture juste. Si la facture avait été payée et que tu rembourses, note-le sur l'avoir (« Remboursement fait ») : une ligne négative entre au livre.

## Où sont tes données
`C:\Users\perie\Documents\6_Projectes\Lo_Ligam_hors-git\factures` (sauvegardé par Proton, jamais dans Git) :
- `reglatges.json` : tes réglages ;
- `factures.json` : toutes les pièces émises (une copie par jour dans `copies`) ;
- `livre-des-recettes.csv` : le livre des recettes, à ouvrir dans LibreOffice ; à garder 10 ans ;
- `PDF` : les factures que tu enregistres.

## Facture bilingue
La facture est en français et en occitan : le français d'abord (une facture doit être en français, loi du 4 août 1994), l'occitan à côté, en italique or foncé. Pour revenir au français seul : Réglages, décocher « Facture bilingue ». Les phrases occitanes des mentions (TVA, escompte, pénalités) se changent aussi dans Réglages ; les autres sont dans `factura.html` (demander à Claude).

**Occitan à relire par Romain** (vérifié avec l'API de lo Congrès, mot à mot) : Factura · Aver (avoir) · Corses d'occitan en visio · Per · Descripcion · Qt. · Prètz unitari · Montant · Total de pagar · Total de l'aver · Sens TVA (art. 293 B del CGI) · Paquet de 4 corses d'occitan en visio (1 h cadun) · Prètz classic · corses de prene abans lo… · Cors d'occitan en visio (1 h) · Pagament per virament · De pagar abans lo 2 de novembre de 2026 · Referéncia del virament : lo numèro de la factura · Pagament · Pagada lo… · Mercé ! · Ont van tos 80 € · Cotizacions socialas · Per Romain, abans impòst : preparacion e corses · As causit lo prètz classic. Tres prètz al causit, sens cap de justificatiu : solidari 15 €, classic 22 €, engatjat 30 € l'ora. Lo prètz engatjat finança lo prètz solidari · Pas de reduccion per un pagament per avança · En cas de retard de pagament, penalitats al taus d'interès legal en vigor · Anullacion · Aqueste aver anulla la factura… · La soma ja pagada te's remborsada per virament · La factura èra pas estada pagada : i a pas res de pagar · Remborsat lo… · les mois (genièr… decembre, « 25 d'octobre de 2026 »).

## À vérifier (Claude n'est pas conseiller fiscal)
- **1er janvier 2027** : la mention de TVA change de référence (recodification dans le CIBS). Les sources hésitent entre « art. L. 223-3 » et « art. L. 233-3 du CIBS » : vérifier sur Légifrance en décembre et la changer dans Réglages.
- **1er septembre 2027** : envoi en ligne des totaux de tes ventes aux particuliers par une plateforme agréée (e-reporting). Le livre des recettes contient déjà les chiffres ; le choix de la plateforme reste à faire.
- Le taux de cotisations (25,6 % en 2026) se règle aussi dans Réglages, s'il change.
