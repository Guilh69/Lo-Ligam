# Audit visuel et expérience de la carte, 2026-10-10

Demande de Romain (mandat du 2026-10-10) : « un audit visuel… points forts et points faibles sur l'expérience utilisateur ». Fait sur la carte `/carta` en local, sur grand écran (panneau du navigateur, environ 1 530 px), en thème sombre et clair, et en largeur téléphone (375 px). Captures prises pendant l'audit ; mesures de chevauchement faites en script sur cinq vues.

## En bref

La carte a une **identité forte et rare** (carte étoilée, typographie d'atlas, animations soignées), des **principes de navigation cohérents** et des **sources partout**. Ses faiblesses tiennent surtout à la **densité** (trop de noms au zoom satellite, lignes « à venir » dans les panneaux) et au **téléphone** (en-tête lourd, colonne de boutons sans libellés). Rien de bloquant pour le lancement, mais trois réglages simples le rendraient plus lisible (voir « Lancement »).

## Points forts

1. **Identité visuelle** : la carte étoilée, les noms en style « Atlas » (Limelight, Cormorant, Luciole), le gascon outremer, les couleurs chaudes. Elle ne ressemble ni à Géoportail ni à Wikipédia : on la reconnaît.
2. **Mouvement soigné** : entrée en scène, dialectes en feu d'artifice, passage des étoiles au satellite, fondus. Depuis aujourd'hui, **les noms gardent leur taille pendant le zoom** et glissent vers leur nouvelle place (avant : ils grossissaient puis sautaient).
3. **Navigation cohérente** : un clic ailleurs ferme (panneaux, fiches, réglages, sources et, depuis aujourd'hui, les bulles de lieux) ; un clic suffit pour changer de rubrique ; chiffre discret du nombre de couches par rubrique ; aperçu au survol après 3 s ; « Y aller » quand une couche est hors de son échelle.
4. **Hiérarchie des textes** (depuis aujourd'hui) : villes d'abord, puis dialectes et relief, puis villages ; **aucun chevauchement** mesuré entre noms de communes, relief et dialectes sur cinq vues (Provence, Ventoux, Narbonnais, Cantal, Bigorre).
5. **Traçabilité** : chaque information de fiche a sa source au survol ; le panneau « Fonts » range désormais toutes les sources par thème.
6. **Bilinguisme intégral** occitan / français, thèmes sombre et clair lisibles, option daltonisme, animations réduites si le système le demande.
7. **Mode « Langues de France »** : idée claire et originale (partie française d'abord, environnement linguistique ensuite, dialectes rangés en France / sur la frontière / hors de France, rubrique Données).
8. **Téléphone** : la bande des couches en bas ne cache pas la carte ; un toucher sur une rubrique déplie ses couches.

## Points faibles

| # | Constat | Gravité | Effort |
|---|---|---|---|
| 1 | **Trop de noms au zoom satellite** (vers 10 à 5 km) : des centaines de villages en italique fine sur la photo, lecture fatigante, surtout en thème clair. | moyenne | faible |
| 2 | **Lignes « à venir » dans les panneaux** (Enquêtes LISN, Fêtes, Bassins, Enseignement en corse…) : grisées mais présentes, elles diluent ce qui marche. | moyenne | faible |
| 3 | **Le panneau couvre l'ouest de la carte** (Gascogne, Bordeaux) sans que la vue se décale ; on active une couche dont on ne voit pas l'effet. | moyenne | moyen |
| 4 | **Téléphone : en-tête sur trois rangées** (logo et réglages, menu, recherche) : environ 20 % de l'écran ; texte de recherche coupé (« un despartam… »). | moyenne | moyen |
| 5 | **Colonne de boutons à droite** (couches, œil barré, nuage, plein écran, zoom) : icônes peu parlantes, sans libellé visible ; sur téléphone elle occupe la moitié de la hauteur. | moyenne | moyen |
| 6 | **Bulles de lieux** (Calandretas, lieux) au style Leaflet : plus petites et plus sèches que les panneaux ; noms tels que la source les donne (« Calendréta de l'Ametlièr »). | faible | faible |
| 7 | **Vignettes d'aperçu manquantes** (« Occitan unificat » : case vide). | faible | faible |
| 8 | **La recherche** ne trouve que villes, départements et régions : pas les dialectes, les langues, les massifs, les Calandretas. | faible | moyen |
| 9 | **Photos satellite** : l'IGN refuse parfois des demandes ; les trous sont maintenant couverts par la photo du niveau supérieur, puis remplis, mais on dépend d'un service extérieur. | faible | élevé (hébergement) |
| 10 | **Accessibilité** : la carte est un dessin (canevas) ; un lecteur d'écran n'en lit rien. Les panneaux, eux, sont accessibles. Il manque une **vue en liste** des mêmes informations (exigence RGAA pour un contenu graphique). | moyenne | moyen (le futur wiki peut jouer ce rôle) |
| 11 | **Mots savants** dans les descriptions des langues (« continuum », « germanofòna ») : à valider ou simplifier pour des apprenants. | faible | faible (Romain) |
| 12 | **Poids et mémoire** : une couche par langue (neuf) plus les surcouches ; à mesurer sur un téléphone moyen avant le lancement. | à mesurer | faible |

## Propositions

### Pour le lancement (simples, sans risque)
- **Points 1, 2, 7** : relever le seuil de population des villages au zoom satellite (ou les afficher plus pâles) ; regrouper les couches « à venir » en bas d'un panneau, sous une ligne repliable « Bientôt » ; dessiner la vignette manquante.
- **Point 6** : habiller les bulles de lieux comme les panneaux (même fond translucide, même typographie, bouton de fermeture identique).
- **Point 12** : une mesure de poids et de fluidité (Lighthouse, téléphone moyen) avant d'ouvrir le site.

### Pour l'évolution
- **Point 3** : quand un panneau s'ouvre, décaler la vue si la zone concernée est dessous (comme le fait déjà le vol vers une langue).
- **Points 4 et 5** : sur `/carta` en téléphone, fondre menu et recherche dans une seule rangée ; regrouper les boutons de droite dans un menu « Vue » avec libellés.
- **Point 8** : recherche élargie (dialectes, langues, massifs, Calandretas), en réutilisant les données déjà chargées.
- **Point 10** : une vue « liste » accessible, ou les fiches du futur wiki reliées à la carte.
- **Point 9** : héberger les photos (déjà noté dans PILOTATGE, environ 6 Go), seulement si les trous persistent en usage réel.

## Ce que Romain peut faire seul maintenant
- Valider ou simplifier les mots savants des descriptions (point 11).
- Choisir pour les couches « à venir » : les masquer au lancement, ou les regrouper sous « Bientôt » (point 2).
- Dire s'il préfère des villages plus pâles ou moins nombreux au zoom satellite (point 1), sur deux captures à comparer.

## Ce qui demandera de l'aide plus tard
- Points 3, 4, 5, 8, 10 (développement), point 9 (hébergement), point 12 (mesure sur appareils réels).
