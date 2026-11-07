# Audit de navigation et de compréhension, 2026-11-07

Demande de Romain : « est-ce que les gens comprennent bien ce qu'ils peuvent faire dans l'application, est-ce que tous les chemins sont cohérents entre eux, et que la navigation soit facile ». Téléphone d'abord.

## Méthode (tout est mesuré, rien de supposé)

- Firefox sans fenêtre, sur la branche `claude/palette-couleurs-322de3` (logique « téléphone d'abord » déjà en place) : 390 × 844 en clair, puis 1830 × 940 pour les parcours.
- **Inventaire** : les liens internes de l'accueil, des trois rubriques et du menu ouvert (25), plus 12 pages non liées de l'accueil (sous-pages Médias et Òbras, compte, illustrations…), soit 34 pages mesurées.
- **Statut HTTP** de chaque page, **mesures par page** (titre, titres h1, barre du bas, débordement horizontal, noms des contrôles), **captures** de toutes les pages (planche de contrôle dans le dossier de notes, `planche-audit.png`).
- **Six parcours joués en cliquant vraiment**, en comptant les touchers (téléphone) et les clics (ordinateur).
- **Boutons pleins** relevés page par page (couleur de fond).
- Non fait : un test avec de vraies personnes, un iPhone réel, un lecteur d'écran. Ce rapport mesure ce que la machine voit ; il ne dit pas ce que les gens comprennent.

## Ce qui va

- **Aucun débordement horizontal** sur les 34 pages. **Un seul titre h1** sur 33 pages. Pas de page sans issue : les 29 pages au bandeau commun ont les cinq onglets ; les 5 autres (carte, Anem !, jeux, Remira, leçon 0) ont leur propre en-tête d'immersion, avec une sortie visible dans le premier écran (logo vers l'accueil sur la carte ; « ‹ S'apren » sur Jòcs et Remira ; « Acuèlh » et « S'apren » sur la leçon 0). **Anem !** n'a aucun lien visible dans son premier écran : c'est voulu, la sortie est un appui long de 1,5 s sur « Adultes » pour qu'un petit doigt ne quitte pas l'espace (vérifié dans le code ; je n'ai pas joué l'appui long).
- **Les parcours sont courts** (touchers sur téléphone, entre parenthèses les clics sur ordinateur) :

| But | Téléphone | Ordinateur |
|---|---|---|
| Ouvrir la carte | 1 (« Dobrir la carta ») | 1 |
| Aller à mon compte | 1 | 1 |
| Changer de langue | 1 | 1 |
| Jouer à un jeu | 3 (S'apren, Jòcs, Jogar) | 3 |
| Faire la leçon 0 | 3 (S'apren, Lo parcors, Començar) | 3 |
| Réserver, jusqu'au calendrier | 4 | 3 |

- La page 404 est propre : bandeau, onglets et trois sorties (accueil, apprendre, la carte).
- **Les onglets disent où l'on est** : Se parla s'allume sur Médias et Òbras, S'apren sur Visio et Gramatica. C'est un gain de la barre du bas (avant, rien ne le disait).
- Tous les champs de saisie ont une étiquette (un premier test automatique en croyait cinq sans nom : faux positif, vérifié).

## Ce qui ne va pas (classé par ce que cela coûte à un visiteur)

1. **La réservation : trois entrées, deux destinations, et rien dans le premier écran du téléphone.**
   - Sur téléphone, le premier écran de l'accueil ne contient aucune entrée vers « Reservar un cors » : le lien du bandeau est masqué sous 44 rem. La seule est tout en bas de la page (à 6 800 px sur 9 070).
   - Le bandeau et le menu mènent à `/apren/visio` (la page qui explique le cours), mais le dernier gros bouton de l'accueil mène **directement au calendrier Proton**, dans un nouvel onglet : cela contredit la décision du 24-10 (« éviter d'arriver directement sur mon calendrier »).
   - Sur la page d'explication (7 332 px de haut sur téléphone), « Reservar un primièr cors » apparaît deux fois de suite avant le vrai lien « Causir una ora sens respondre » ; le premier mène à l'ancre `#questionari`, plus bas dans la même page.
2. **Deux liens morts, bien en vue.** `/articles` (« Articles » dans Se parla, l'accueil et le menu) et `/forum` (« Fòrum » dans Amassa) mènent à la 404. Il y en avait sept le 21-10 ; il en reste deux. `/wiki` (301 vers Cultura) et `/contacte` (308 vers `/istoria#contacte`) redirigent bien.
3. **Trois manières de « revenir »** selon la page : fil d'Ariane (« Se parla › Médias › Ràdios »), petit lien-titre (« 02 S'apren » sur Parcours et Visio), « ‹ S'apren » (jeux, Remira), et rien (Compte). Les onglets rattrapent le niveau des rubriques, mais pas le retour d'un niveau.
4. **Les puces et petits boutons restent en sarcelle** : 35 boutons pleins en `#1f5f63` sur 18 pages (filtres de Jòcs, Cultura, Mots en imatges, « Tornar amont »…), alors que la barre n'a plus de troisième couleur. Le diagnostic du 07-11 vaut encore : une couleur de plus, sans rôle clair.
5. **Détails** : la carte n'a aucun titre h1 (un lecteur d'écran n'a pas de titre de page) ; `/compte/questionnaire` a le même titre d'onglet que `/compte` (« Se connectar ») ; `/grops` s'intitule seulement « Lo Ligam » ; l'accueil contient quatre fois « Se parla / Se parle » dans son titre pour l'animation de langue (si le texte caché est lu par un lecteur d'écran, il est répété : non vérifié).
6. **Cibles au doigt** : les réglages du haut sur téléphone faisaient 35 × 35 px (règle du site : 44) : corrigé. Le reste des cibles sous 44 px (une quarantaine par page) est surtout fait de liens dans du texte et du pied de page : non trié.

## Corrigé dans ce passage (commit de la branche)

- **Le dernier rouge** : le menu plein écran, cinq pages (visio, radios, télévision, cinéma, littérature) et la croix de fermeture prenaient la brique du logo ou le sarcelle ; ils prennent maintenant le rouge des boutons. La brique reste dans le logo, sur la carte et sur l'administration.
- **La légende de la photo de l'accueil** (« Max Rouquette · La pietat dau matin »), en brun sur fond sombre, devient lisible (or clair).
- **Cibles de 44 px** pour les réglages du haut sur téléphone.

## À décider avec Romain (non fait)

1. Réservation : faire pointer le dernier bouton de l'accueil vers `/apren/visio` comme les deux autres ; remettre une entrée « Reservar un cors » dans le premier écran du téléphone (second bouton sous « Dobrir la carta », comme dans l'essai 3).
2. Articles et Fòrum : un état « bientôt » (lien grisé avec la mention) ou les retirer jusqu'à leur ouverture.
3. Sarcelle des petits boutons : neutres (encre à 10 %) comme la bascule de langue ?
4. Retours : un seul geste, par exemple le fil d'Ariane partout, ou « ‹ nom de la rubrique » partout.
