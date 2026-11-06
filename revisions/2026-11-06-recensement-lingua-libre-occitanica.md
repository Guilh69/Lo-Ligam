# Recensement Lingua Libre et Occitanica (2026-11-06)

Relevé fait le 2026-11-06 par requêtes directes (pas de moissonnage complet). Complète `2026-11-06-etat-de-l-art-fonctions.md`.

## Lingua Libre (sons de prononciation sur Wikimédia Commons)

- **24 636 enregistrements d'occitan** [vérifié, titres de fichiers relevés] : 14 254 dans le dossier général, 5 316 languedocien, 4 908 gascon, 117 auvergnat, 32 limousin, 9 provençal.
- **23 780 mots ou expressions distincts**, **16 voix** seulement.
- **Une voix fait plus de la moitié du total** : `Davidgrosclaude`, 13 910 fichiers sur 24 571 lus. Les autres voix ont 117 fichiers ou moins. Sa variété exacte n'est pas indiquée (il apparaît en languedocien, gascon et dossier général) : à faire écouter à Romain.
- Licence vue sur un fichier : **CC BY-SA 4.0** (citer le locuteur, même licence pour toute version modifiée). À contrôler fichier par fichier.
- Nom des fichiers : `File:LL-Q<langue>-<locuteur>-<mot>.wav`. Une recherche exacte du mot suffit (la recherche plein texte de Commons ne répond pas à ce motif : passer par la liste des titres des dossiers).
- Couverture des mots d'Anem : ostal, teulat, fenèstra (singulier seulement), pòrta, clau (singulier), cabra, caval, pòrc, poleton, gat : **oui**. Pluriels (fenèstras, claus) : **non**. Lingua Libre n'est pas un dictionnaire de formes fléchies.
- Le point d'accès SPARQL de Lingua Libre ne répondait pas le jour du relevé.
- Limite d'usage de l'API de Commons : trop de requêtes d'un coup renvoient « You are making too many requests ». Faire un relevé unique, le mettre en cache, pauses d'au moins 1,5 s, identifier l'application dans l'en-tête.

## Occitanica (CIRDÒC, Omeka)

- **Accès pour programmes** : OAI-PMH ouvert (`https://www.occitanica.eu/oai-pmh-repository/request`), formats `oai_dc`, `mods`, `mets`, `rdf`, `omeka-xml`, `cdwalite`. En plus, l'API REST d'Omeka (`/api/items/<id>`, `/api/files?item=<id>`) donne les fichiers et leurs vignettes. [vérifié]
- **Collections (nombre de notices, relevé)** : phonothèque 699 ; vidéothèque 956 ; iconothèque 199 ; Campus 361 ; encyclopédie 130 ; archives Ràdio Lenga d'òc 271 ; archives orales 68 ; répertoire du patrimoine culturel occitan 375 ; Maleta (ressources éducatives) 52 ; portail PCI vidéos et sons 1 044 ; patrimoine écrit : imprimés 263, manuscrits 380, périodiques 2 997 (notices de numéros). Autres ensembles : Amistats Max Rouquette, Labo de Lenga, bibliothèques municipales (Nîmes, Marseille, Carcassonne, Limoges, Toulouse, Bordeaux), Gallica, Persée, Rosalis, Val d'Aran, fonds Robert Lafont.
- **Droits : le champ est du texte libre et hétérogène** [vérifié sur 5 échantillons de 50 notices]. On y trouve « © CIRDOC », des © de troupes ou d'auteurs, des contrats d'autorisation de diffusion en ligne, « Domaine public », du Creative Commons (parfois BY-NC-ND). La page « Conditions de réutilisation » dit : Licence ouverte pour les textes éditoriaux, les notices et les œuvres du domaine public, citation « Auteur - Source occitanica.eu / CIRDOC - Institut occitan de cultura » ; certains documents en CC BY-NC-ND ; retrait sur réclamation.
- **Conséquence** : on ne peut pas tout copier. Un filtre par notice est nécessaire. Sans filtre sûr : lien et vignette vers la page d'origine seulement.
- Contact : informatica@oc-cultura.eu.

## Pistes d'intégration (non réalisées)

1. **Encart « mot + prononciation »** : sur un mot de la leçon, un petit lecteur avec le nom du locuteur et le lien vers la source. Les sons seraient récupérés une fois, convertis en fichier compressé léger (le .wav est lourd) et servis par le site, avec mention CC BY-SA. À valider : voix, variété, poids total.
2. **Vitrine Occitanica dans Cultura** : notices filtrées (domaine public ou Licence ouverte), vignette, titre, auteur, lien vers la fiche, mention de source obligatoire. Mise à jour par relevé périodique (pas d'appel en direct depuis le navigateur du visiteur).
3. **Relier les deux** : un mot d'une leçon pointe vers un document sonore d'Occitanica (conte, chant) où il apparaît. Plus tard.

## Exploration d'Occitanica, suite (relevé complet de dix collections, 3 138 notices)

Moissonnage poli (pause 1,2 s, une seule fois) de : phonothèque 699, vidéothèque 956, iconothèque 199, Campus 361, encyclopédie 130, Labo de Lenga 27, Maleta 52, Ràdio Lenga d'òc 271, archives orales 68, répertoire du patrimoine culturel occitan 375.

**Droits (champ `dc:rights`, classement automatique à vérifier à la main)** :
- Domaine public : 72 notices seulement (iconothèque 23, répertoire 22, encyclopédie 13, Campus 7, phonothèque 5, Ràdio Lenga d'òc 2). Aucune notice marquée « Licence ouverte » dans ce relevé.
- Creative Commons : 28 sans « NC » apparent, 21 avec NC (surtout la Maleta, 20).
- Autorisation contractuelle : 29. Tous droits réservés (©) : 675. **Environ 2 300 notices ne donnent que le nom du détenteur** (Ràdio Lenga d'òc, Tè Vé Òc, Radio CFM, La Granja, associations, photographes) **sans licence** : réutilisation à demander, pas à supposer.
- Langues : la phonothèque est à 574 notices sur 699 en occitan, la vidéothèque 754 sur 956, Ràdio Lenga d'òc 268 sur 271.

**Intégration propre** : chaque fiche Occitanica propose un **code d'intégration officiel** (`https://www.occitanica.eu/items/embed/<numéro>`, cadre 560 × 315). C'est la voie recommandée pour sons et vidéos : le lecteur et les mentions de droits restent chez le CIRDÒC, on ne copie rien. À vérifier : poids du cadre (sobriété), consentement (aucun traceur à charger avant le clic), accessibilité.

**Pépite pour les apprenants** : le service de questions-réponses du CIRDÒC (« Sondaqui », 130 notices d'encyclopédie en grande partie des questions : « Cossí se ditz : coquille Saint-Jacques en occitan ? ») : un lien « poser la question » ou des entrées liées aux mots des leçons.

**Pistes** (par ordre de risque croissant) :
1. Page Culture : sélection de 10 à 20 documents, fiche courte (titre, auteur, date, vignette, lien), intégration du lecteur officiel au clic.
2. Domaine public (72 notices, dont photos de l'iconothèque) : vignette et image réutilisables avec la mention « Auteur - Source occitanica.eu / CIRDOC - Institut occitan de cultura ».
3. Convention avec le CIRDÒC pour aller plus loin (sons, vidéos, relevé régulier). Contact : informatica@oc-cultura.eu.
