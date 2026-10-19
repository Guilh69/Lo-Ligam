# Audit des clics de la carte : légende et carte (2026-10-19)

Demande de Romain : vérifier que l'ensemble des options cliquables, entre la légende et la carte, est cohérent. État du code après la couche active (commit b87f6fa) et l'animation des territoires (d6dbed8).

Règles du site rappelées : un clic sélectionne, un double clic centre et zoome sur l'objet, un clic ailleurs referme (« clic ailleurs, jamais deux clics »), aucune fonction retirée ; la couche active de la légende prend le clic.

## 1. Inventaire

### La légende (rail, tiroirs, pastilles du téléphone)

| Élément | Geste | Effet |
|---|---|---|
| Bouton de famille du rail (Sus la carta, Lenga nòstra, Territòri…) | clic | ouvre ou ferme son tiroir ; sur téléphone, la bande de pastilles |
| Ligne d'une couche (tiroir) | clic sur la ligne | éteinte : l'allume (et la rend active) ; allumée mais pas active : la rend active ; active : l'éteint |
| Interrupteur d'une ligne | clic | allume ou éteint, toujours |
| Pastille (téléphone) | toucher | comme la ligne |
| Pastilles des dialectes et des langues | clic | allume la couche, ajoute ou retire la zone de la sélection (plusieurs à la fois) |
| « I anar » | clic | va à l'échelle où la couche se voit |
| Survol d'une ligne 3 s (ordinateur) | survol | aperçu de la couche sans bouger la carte |
| Mode « Lengas de França » : fiches, silhouettes | clic | allume une langue ; la silhouette montre la langue hors de France |
| Poignée, réduire, horizontal | clic, glisser | déplacer, plier, mettre le panneau en bas |

### La carte

| Objet | Ordinateur | Téléphone | Double clic | Retour visuel |
|---|---|---|---|---|
| Ville à fiche (repère doré) | de loin : vol ; de près : sa page | pareil | centre | vol |
| Village (étoile) | vol, zoom + 2,5 | 1er toucher : le nom ; 2e : vol | centre | nom au survol |
| Nom de commune (satellite) | sélection, vol, fiche | pareil | centre | contour doré animé |
| Département, région | sélection (2e clic : relâche) | pareil | centre et cadre | contour doré animé + étiquette |
| Dialecte occitan, Creissent | sélection multiple, clic dehors : tous reviennent | pareil | centre et cadre | teinte qui se diffuse |
| Zone d'une autre langue | pareil que les dialectes | pareil | centre et cadre | teinte |
| Province, gouvernement (1789) | rien (survol seul) | toucher : encart | centre et cadre | encart au survol |
| Parc naturel, commune en surface | rien (survol seul) | toucher : encart | centre et cadre | encart au survol |
| Langue cachée | de loin : allume ; de près ou sur un territoire : bouton | bouton | | bouton « Descobrir… » |
| Au-delà de 400 km, langue cachée | allume « Lengas de França » | bouton | | bouton |
| Points (calandretas, librairies, fêtes, lieux) | bulle | bulle | centre | bulle |
| Voix (Atlàs LISN) | joue l'enregistrement | pareil | | |
| Étiquettes des langues de France | bulle | bulle | | bulle |

## 2. Ce qui est cohérent

- Le double clic centre et cadre l'objet partout, et suit la couche active.
- Le clic ailleurs referme partout : sélection de dialectes, territoire, fiche de commune, encart, bulle, invitation.
- La sélection d'un dialecte ou d'une langue se lit aussi dans la légende (pastilles enfoncées).
- Commune et territoire ont maintenant le même retour (contour doré animé).

## 3. Incohérences relevées

1. **Provinces, parcs et communes en surface ne se sélectionnent pas au clic sur ordinateur** : seul le survol montre l'encart, qui disparaît dès que la souris bouge. Partout ailleurs, un clic fixe la sélection. Sur téléphone, le toucher les montre.
2. **Trois retours visuels différents pour « sélectionné »** : contour doré animé (commune, territoire), teinte qui se diffuse (dialectes, langues), encart seul (provinces, parcs).
3. **La légende ne montre pas ce qui est sélectionné**, sauf pour les dialectes et les langues. Un département ou une commune choisis n'apparaissent pas sous leur couche.
4. **Les villages changent de comportement selon la couche active** : sans couche active (au chargement), un clic sur un village y vole ; dès qu'une autre couche est active, les villages ne prennent plus le clic. La seule trace est le liseré de la légende.
5. **Le curseur « main » n'est pas partout** : il apparaît sur les dialectes, les villages et les langues cachées, pas sur les territoires, les provinces ni les parcs, alors qu'on peut les choisir.
6. **Deux gestes au doigt pour un village** (nom, puis vol) contre un seul partout ailleurs : écart avec la règle « jamais deux clics ».
7. **Quatre étiquettes différentes en bas de la carte** : celle du territoire (centrée), celle du dialecte ou de la province (à gauche), le bouton d'invitation (à gauche), le dialecte du centre (au-dessus de l'échelle). Styles proches, places différentes : elles se succèdent ou se chevauchent selon les cas.
8. **Points et voix ignorent la couche active** : ce sont des repères visibles, cliquables en toute circonstance. Logique, mais à assumer.
9. **Au clavier**, on ne peut choisir ni un territoire ni un dialecte sur la carte (les pastilles de la légende le permettent pour les dialectes ; la recherche trouve villes et départements).
10. **Recherche** : « Montpel » puis Entrée ne mène pas toujours au même endroit (constat du 2026-10-19, en ligne comme en local).

## 4. Propositions, de la plus utile à la moins urgente

1. **Un clic sélectionne partout** : provinces, parcs et communes en surface se fixent au clic (encart qui reste, contour doré animé), comme les territoires ; un second clic relâche, un clic ailleurs referme.
2. **Le même contour doré pour toute sélection**, les dialectes et les langues gardant en plus leur teinte.
3. **La sélection rappelée dans la légende**, sous la couche active : « Avairon ✕ » (le ✕ relâche).
4. **Villages** : soit toujours cliquables (repères visibles, comme les points), soit seulement quand « Vilas e vilatges » est active. À trancher.
5. **La main sur tout objet sélectionnable** de la couche active.
6. **Un seul emplacement pour les étiquettes du bas**, avec une priorité claire : invitation, puis sélection, puis survol, puis dialecte du centre.
7. **Village au doigt en un toucher** : le nom et un bouton « Anar », ou le vol direct.
8. Clavier et recherche : à traiter à part.
