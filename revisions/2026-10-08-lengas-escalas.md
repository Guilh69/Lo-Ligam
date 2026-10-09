# Carte : langues, échelles, frontières (synthèse du 2026-10-08)

Synthèse de trois propositions (angle cartographe, angle navigation, angle sobriété), relues par deux évaluations indépendantes. Ossature : la proposition « cartographe » pour la grammaire des échelles et la représentation ; la proposition « sobriété » pour la manière de coder et l'accessibilité ; la proposition « navigation » pour la découverte des langues peu connues.

Aucun fichier de l'application n'a été modifié. Tout ce qui est écrit en occitan ici est **à valider par Romain**. Les noms dans les autres langues (basque, breton, corse, etc.) sont **à faire vérifier par des locuteurs**.

> **Mise à jour (Claude, 2026-10-08 au soir).** Ce document a été écrit avant plusieurs décisions de Romain, qui priment sur ce qui suit :
> - **Bascule langue unie / dialectes** : langues unies quand la barre indique 150 km ou plus, dialectes dès qu'elle indique 100 km (au lieu de 150 / 200 km ici). Déjà en place, calculé sur la valeur affichée par la barre, à la latitude du centre de la carte. Le palier « Los dialèctes » commence donc à 100 km, « Las lengas » va jusqu'à 150 km. Les rivières gardent la règle des 200 km.
> - **Décision 3 (arrivée sur téléphone)** : tranchée, option « OCCITAN unifié » (les seuils sont les mêmes partout ; un petit écran arrive vers 150 km, donc sur l'Occitanie unie).
> - **Nom catalan** : « Catalunya Nord ».
> - **Mode plein écran** ajouté (bouton au-dessus du zoom), **Calandreta la plus proche**, **parlers de transition** en hachures (benasquès), **arpitan** en cours de fabrication.
> - **Décision 2 (grille)** : de fait tranchée par la règle ci-dessus, les seuils suivent les valeurs de la barre (km arrondis), identiques sur tous les écrans.

Ta demande, résumée en six points :
1. Une langue choisie : les noms s'affichent dans cette langue. La traduction (occitan, français) vient dans la barre du bas.
2. Une icône qui dit « langues minoritaires » sans alphabets.
3. Un groupe « Langues de France » qui se déplie, prêt à accueillir plus tard l'Italie ou l'Afrique.
4. Des échelles uniformes : à telle valeur de la barre d'échelle, on voit telle chose, partout.
5. Dire à partir de quand on voit une donnée, et ramener la carte à la bonne échelle quand on allume une couche.
6. Ouvrir la carte à toute la France et représenter de façon cohérente les langues qui passent une frontière.

---

## 1. La grammaire des échelles

### L'idée : « Del cèl a la tèrra »

Le zoom raconte une seule histoire, qui prolonge le fond en étoiles et la révélation « des nuages à la terre » qui existent déjà :
- de très loin, les langues ne sont que des contours dans le ciel ;
- en approchant, chaque langue devient une nappe d'une seule couleur ;
- plus près, la nappe se résout en dialectes et en étoiles-villes, comme au télescope ;
- puis on traverse les nuages jusqu'au sol (la carte détaillée en occitan) ;
- enfin on arrive à la commune.

**Cinq paliers, pas plus.** Chaque palier porte le nom de ce qu'on y voit, et ce nom s'affiche à côté de la barre d'échelle (« 50 km · Dialèctes »).

### Règles communes (valables pour toutes les couches et toutes les langues)

1. **Une seule grille, fixe.** Les seuils sont les mêmes sur tous les écrans et pour toutes les langues. Un grand écran montre plus de territoire, pas plus de détail. Seul le cadrage d'arrivée dépend de l'écran.
2. **Rien ne bouge sur ton écran (1830 × 950).** Les seuils sont figés sur les valeurs que ton écran calcule déjà aujourd'hui. Tu gardes les seuils que tu as validés (langue unie à 200 km, simplification à 300 km, contour seul au-delà). Seules changent les corrections voulues (liste plus bas).
3. **Les grandes bascules se font à la frontière d'un palier** : langue vide ou pleine, langue unie ou dialectes, étoiles ou carte détaillée. À l'intérieur d'un palier, seuls les noms se densifient et les repères (côte, villes, points) s'ajoutent.
4. **Un seuil tombe toujours sur le premier cran d'une valeur de la barre.** Sinon « 40 km » montrerait deux contenus différents selon le cran.
5. **Jamais une teinte sans son nom.** Les noms des dialectes arrivent avec leurs teintes et partent avant elles.
6. **Le nom d'une langue s'affiche seulement s'il tient dans sa surface**, sinon une étiquette pâle à côté. Indispensable pour les petites langues : la partie française du basque fait environ 55 px de large à 200 km.
7. **Trois bascules dans le temps, pas une de plus** (fondu de 1 à 2 secondes, quelle que soit la vitesse du zoom) : contour vide ou plein (1 000 / 700 km), langue unie ou dialectes (200 / 150 km), étoiles ou carte détaillée (30 / 20 km). Ce sont les trois qui existent déjà. Si le navigateur demande moins d'animations, tout est instantané (déjà le cas).

Repère : les kilomètres indiqués sont ceux de la barre au milieu de l'Occitanie. Ils varient un peu avec la latitude (environ 9 % de moins à Lille, 33 % de plus aux Antilles). La référence stable, c'est **le nom du palier** ; les km du panneau sont des valeurs arrondies fixes.

### Tableau des paliers

| Palier | Barre d'échelle | Langues | Fond de carte | Autres couches |
|---|---|---|---|---|
| **Lo mond** / Le monde | 1 000 km et plus (zoom 3,5 et moins) | Chaque langue allumée se réduit à son contour vide (comme aujourd'hui). Étiquettes des langues d'outre-mer toujours visibles. Plus tard : un point par langue pour l'Italie et l'Afrique. | Contours du monde ; l'Europe s'efface, sans noms de pays. | Rien : ni points, ni villes, ni limites. |
| **Las lengas** / Les langues | 700 à 200 km (zoom 3,75 à 5,75) | Une langue = une surface de sa couleur + son nom en capitales dans la langue (OCCITAN, CATALÀ), s'il tient. Aucun dialecte. Étiquettes des langues de France (si cochées) dès 400 km. Une langue pas encore tracée : son étiquette seule, sans fausse surface. | Pays d'Europe et leurs noms. Côte et relief de l'Occitanie qui se dessinent de 400 km à 200 km (seuils actuels). | Régions et gouvernements de 1789 (si cochés) dès 400 km ; chaînes de rang 1 à 200 km ; points (lieux, librairies, Calandretas) dès 300 km. |
| **Los dialèctes** / Les dialectes | 150 à 30 km (zoom 6 à 8,5). **Ton arrivée (50 km) est au milieu.** | Bascule langue unie vers dialectes à 150 km, toutes les langues ensemble. Noms des dialectes en même temps que leurs teintes. Croissant, zones mixtes, limite de la langue en pointillé, territoires à part (Catalunya Nord) en italique, nom de la Pichona Gavachariá dès 50 km. Une langue sans dialectes tracés reste unie, en teinte plus légère. Étiquettes des langues de France jusqu'à 30 km. | Rivières dès 150 km. Villes : capitales dès 100 km, rang 2 dès 40 km, rang 3 à 30 km (villages aussi, si la capture montre qu'ils se lisent). Contours de l'Europe autour, qui s'effacent en approchant (de 70 à 50 km). | Départements (si cochés) et parcs dès 150 km ; provinces de 1789 dès 100 km ; massifs de rang 2 dès 70 km ; survol des régions de 70 à 40 km, des départements dès 30 km. |
| **La tèrra** / Le sol (nom provisoire, voir plus bas) | 20 à 10 km (zoom 8,75 à 10,25) | Les teintes pâlissent ; les noms des dialectes s'effacent de 20 à 15 km (le nom reste disponible au survol, dans la barre du bas) ; la limite de la langue devient une bande floue. Les étiquettes des langues de France disparaissent : c'est le sol qui parle (carte détaillée en occitan). Plus tard : les sous-dialectes. | Bascule de 2 s des étoiles vers la carte détaillée OpenStreetMap en occitan. Étoiles des capitales en filigrane. | Départements et leur survol, provinces jusqu'à 10 km, noms des parcs, massifs de rang 3, sommets. Points avec leurs icônes. |
| **Las comunas** / Les communes | 7 km et moins (zoom 10,5 et plus) | Les teintes ne sont plus qu'un voile léger, qui s'efface de 4 à 1,5 km. La limite de la langue tient jusqu'à 1,5 km. | Carte détaillée, gardée jusqu'au zoom le plus fort (plus de fond vide sous 50 m). | Communes dès 7 km avec leur nom. Contours administratifs effacés de 10 à 4 km. Plus tard : points d'enquête et enregistrements. C'est le palier d'arrivée d'un clic sur un lieu ou d'une recherche. |

Nom du 4e palier : les trois propositions l'appelaient « Los parlars », mais aucune donnée de parler n'existe encore. Tu lirais « Parlars » sans voir de parler. Proposition : « La tèrra » (on arrive au sol, fin du récit « Del cèl a la tèrra »), renommé « Los parlars » le jour où les sous-dialectes existeront.

### Arrivée sur la carte

On cadre l'Occitanie comme aujourd'hui, puis on garde le zoom entre 6 et 8,5 :
- ton écran 1830 × 950 : 7,75 (50 km), **rien ne change** ;
- téléphone 390 × 780 : 6 (150 km) au lieu de 5,75 (200 km), donc on arrive sur les dialectes nommés, mais l'Occitanie perd environ 25 km de chaque côté (côte basque ; Niça tombe juste au bord, à vérifier sur capture). C'est la décision n° 3 ;
- très grand écran (4K) : 8,5 au lieu de 9, donc on n'arrive plus directement sur la carte détaillée.

### Recadrage automatique : « montrer ce qu'on vient d'allumer »

**Quand :** seulement quand tu **allumes** une couche, une pastille ou un groupe dans le panneau. Jamais au chargement de la page, jamais au retour d'un état enregistré, jamais sur « Annuler » ou « Tout remettre », jamais quand on éteint, jamais pendant un glisser. Un clic sur la carte ne recadre jamais.

**Comment :** chaque couche connaît sa plage de paliers et son emprise (là où sont ses données, ou la zone de la pastille).
1. La donnée est à l'écran et visible à cette échelle : **on ne bouge pas.** Exemple : à l'arrivée (50 km), allumer le catalan ne bouge rien, la Catalogne du Nord est déjà là.
2. La donnée est à l'écran mais hors de son échelle : on garde le centre et on va **au bord le plus proche** de sa plage. Exemple : à 5 km, cocher « Provincias de 1789 » remonte à 10 km.
3. La donnée est hors de l'écran : **vol vers elle** (1,2 s), au palier où elle se voit, en tenant compte de la place réelle du panneau ouvert. Le recadrage ne descend jamais sous 30 km (on reste sur la carte en étoiles), sauf pour une couche qui ne commence que plus près (communes, 7 km). Exemples : depuis Tolosa, la pastille « valencià » mène au Pays valencien au palier Dialèctes ; plus tard, le breton mène à la Basse-Bretagne.
4. Le groupe « Langues de France » montre **toute la France au palier Lengas** sur tous les écrans (200 km sur ton écran, 300 km sur téléphone) : le même geste montre le même contenu partout.
5. Deux couches allumées presque en même temps : on prend la plage commune si elle existe, sinon la dernière.

**Retour :** un message dans la barre du bas, « Carta desplaçada per veire lo catalan · Tornar » / « Carte déplacée pour voir le catalan · Revenir ». « Revenir » remet la vue d'avant. Le message reste jusqu'au geste suivant sur la carte (**pas de minuterie** : un bouton qui disparaît tout seul pose un problème d'accessibilité). Il est lu par les lecteurs d'écran sans les interrompre.

**Carte vide :** si, après un déplacement, plus rien d'allumé ne se voit, la barre du bas propose « Res d'alucat se vei aicí · Anar al catalan » / « Rien d'allumé ne se voit ici · Aller au catalan ».

### Comment le panneau l'indique

1. **Réglette sous chaque couche** : cinq petites cases (Mond, Lengas, Dialèctes, Tèrra, Comunas). Les cases où la couche se voit sont pleines ; la case du palier en cours est entourée (lisible sans la couleur). Dessous, en petit : « Visibla de 150 km a 10 km » / « Visible de 150 km à 10 km ». Ce texte sert aussi aux lecteurs d'écran.
2. **Couche allumée mais hors échelle** : la ligne n'est pas grisée (elle est allumée, et une ligne grisée deviendrait illisible). Son texte devient un bouton : « Visibla a partir de 150 km · I anar » / « Visible à partir de 150 km · Y aller », ou « Visibla fins a 5 km · I anar » / « Visible jusqu'à 5 km · Y aller ».
3. **Dans le rail**, la pastille de la famille : point plein si une couche est visible, anneau creux si elle est allumée mais pas visible à cette échelle.
4. **À côté de la barre d'échelle**, le nom du palier : « 50 km · Dialèctes ». Dans un petit élément séparé, pas dans la barre elle-même (sinon le texte déborde et la barre ne mesure plus rien).
5. Plus tard : une petite échelle des cinq paliers près des boutons + et −, cliquable pour sauter d'un palier à l'autre.

### Ce qui change par rapport à aujourd'hui (d'après l'inventaire)

| Élément | Aujourd'hui | Demain (tous écrans) | Sur ton écran 1830 |
|---|---|---|---|
| Seuils de dézoom (langue unie, simplification, contour seul) | calculés selon la taille de l'écran : à 200 km, l'ordinateur montre OCCITAN, le téléphone les dialectes | figés sur les valeurs de ton écran | rien ne bouge ; le téléphone s'aligne |
| Vue d'ensemble de référence | deux définitions (avec et sans marges), qui décalent villes et Europe d'un cran sur beaucoup d'écrans | une seule | rien ne bouge |
| Arrivée | libre (téléphone 5,75, écran 4K 9) | bornée entre 6 et 8,5 | rien ne bouge |
| Noms des dialectes (occitan et catalan) | arrivent à 100 km, un cran après les teintes ; partent de 30 à 10 km | arrivent à 150 km avec les teintes ; partent de 20 à 15 km | noms visibles un cran plus tôt |
| Capitales | nommées à 100 km (téléphone : dès 400 km) | 100 km partout, au premier cran | un cran plus tôt |
| Villes de rang 2 | 40 km, 2e cran (téléphone : 150 km) | 40 km, premier cran | un cran plus tôt |
| Villes de rang 3 | jamais lisibles sur ton écran | 30 km | **nouveau** |
| Villages | jamais sur ton écran ; dès 70 km sur téléphone | 30 km si lisibles, sinon laissés à la carte détaillée | à régler sur capture |
| Étiquettes des langues de France | de 400 km jusqu'au niveau de la rue ; « Català » en double avec « CATALÀ » | de 400 km à 30 km ; cachée quand la langue elle-même est allumée | plus de doublon |
| Points (lieux, librairies, Calandretas) | 300 km (téléphone : 400 km) | 300 km partout | rien ne bouge |
| Rivières | 150 km (téléphone : 200 km) | 150 km partout | rien ne bouge |
| Départements (couche cochée) | dès 400 km | dès 150 km (trop serrés avant) | plus lisible |
| Carte détaillée de très près | fond vide au-delà de 50 m | tuiles agrandies jusqu'au zoom maximal | plus de fond vide |
| Catalan et futures langues | seuils calqués sur le cadrage de l'Occitanie | même grille fixe pour toutes | rien de visible ; prépare les autres langues |
| Code mort et commentaires faux | réglage inutile des noms, commentaires qui annoncent 50 km ou 5 km à tort | supprimés ou corrigés | rien de visible |

Écarté : un « retour décalé » au passage des seuils (pour éviter le clignotement). Avec des crans de 0,25, il ne servirait à rien.

---

## 2. Le panneau

### Arborescence

```
Autras lengas / Autres langues                 [nouvelle icône]
  « Las lengas de França e d'endacòm mai, per far de ponts. »
  « Les langues de France et d'ailleurs, pour faire des ponts. »

  ▾ Lengas de França / Langues de France      2 disponiblas · 9 a venir   [interrupteur : vue d'ensemble]
      França metropolitana / France métropolitaine
        Occitan · occitan                       [même interrupteur que « Dialèctes » de la famille Lenga]
        Català · catalan                        [interrupteur]
           pastilles : (Catalunya Nord) rossellonès · central · nord-occidental · tortosí · valencià · balear · alguerès
           réglette   « Visibla de 700 km a 1,5 km »
        Brezhoneg · breton                      a venir
        Corsu · corse                           a venir
        Elsässerditsch · alsacien               a venir
        Euskara · basque                        a venir
        Francoprovençal (nom à trancher)        a venir
        Platt · francique                       a venir
        Vlaemsch · flamand occidental           a venir
        Lengas d'oïl · langues d'oïl            a venir (une ligne, ses langues en pastilles)
        Parlars ligurians · parlers liguriens   a venir
      Outra mar / Outre-mer                    (replié)
        Antilles, Guyane, La Réunion, Mayotte, Nouvelle-Calédonie, Polynésie, Wallis-et-Futuna
        (une ligne par territoire, ses langues en pastilles : 12 en Guyane, environ 28 en Nouvelle-Calédonie)
      Plus tard : Sens territòri / Sans territoire ; Lenga dels signes / Langue des signes (fiches sans carte)

  ▸ Lengas d'Itàlia / Langues d'Italie         (plus tard, voir décision n° 9)
  ▸ Lengas d'Africa / Langues d'Afrique        (plus tard)
```

### Règles

1. **Deux niveaux d'interrupteur.** L'interrupteur du groupe allume la **vue d'ensemble** (chaque langue unie et nommée, plus les étiquettes des langues pas encore tracées) et recadre sur la France. Il reprend la couche « Lengas de França » actuelle, sans perte de réglage. L'interrupteur d'une ligne allume le **détail** de la langue (ses dialectes en pastilles). Pas de bouton « tout allumer » : dix langues en dialectes à la fois feraient une bouillie de couleurs.
2. **Nom d'une ligne** : le nom dans la langue en gras (balisé avec sa langue, pour que la synthèse vocale le prononce bien), puis « · » et le nom dans la langue de l'interface, en petit. Ordre : langues disponibles d'abord, puis « à venir », par ordre alphabétique du nom dans la langue de l'interface.
3. **Pastilles** : d'abord le territoire à part (anneau en tirets, comme Catalunya Nord aujourd'hui), puis les dialectes dans l'ordre du classement. Leurs noms sont **toujours dans la langue**.
4. **Langues à venir** : une ligne de texte simple (nom dans la langue, nom en français, « a venir » / « à venir »), sans interrupteur ni bouton inerte. Elles restent visibles, comme tu le souhaites, et leur étiquette est sur la carte grâce à la vue d'ensemble.
5. **Groupes dépliables** : bouton natif du navigateur (clavier et lecteurs d'écran gérés sans code), **l'interrupteur placé à côté du titre, pas dedans** (deux commandes imbriquées gênent les lecteurs d'écran). L'état ouvert ou fermé est retenu par le navigateur. Par défaut : « Langues de France » ouvert, les autres fermés.
6. **Une langue = un seul objet**, rangé dans plusieurs groupes. Le catalan, l'occitan et le francoprovençal sont aussi reconnus en Italie (loi 482/1999) : ils figureront dans les deux groupes avec **le même interrupteur**. L'occitan, en tête des Langues de France, partage l'interrupteur des « Dialèctes » de la famille Lenga : il figure parmi ses voisines sans copie.

### Règle des noms (ta première demande)

- Une langue choisie : **tous les noms sont dans cette langue**, sur la carte comme dans le panneau : nom unifié (CATALÀ), dialectes (rossellonès), territoires (Catalunya Nord), villes de la langue (Perpinyà quand le catalan est allumé, Perpinhan sinon). Deux langues allumées : une ville prend le nom de la langue de sa zone.
- **Traductions dans la barre du bas**, au survol de la souris, au passage du clavier et au toucher sur téléphone, que ce soit sur la carte ou sur une pastille du panneau :
  - ligne 1, en grand : le nom dans la langue ;
  - ligne 2, en petit : l'occitan, puis le français si l'interface est en français, puis la nature.
  - Exemples : « rossellonès » puis « rossellonés · roussillonnais · dialecte catalan » ; « Perpinyà » puis « Perpinhan · Perpignan · rossellonès » ; « CATALÀ » puis « catalan · langue romane ».
- Les petites bulles d'aide du navigateur (lentes, invisibles au toucher et au clavier) sont retirées des pastilles. Pour les lecteurs d'écran, la traduction est donnée en texte caché ; la barre du bas n'est lue à voix haute qu'au passage du clavier et à la sélection, pas à chaque mouvement de souris.
- Question de cohérence (décision n° 4) : aujourd'hui, dans l'interface française, les pastilles occitanes sont traduites en français (languedocien, vivaro-alpin), alors que les catalanes restent en catalan.

### Libellés proposés (occitan à valider)

| Occitan (à valider) | Français |
|---|---|
| Autras lengas | Autres langues |
| Las lengas de França e d'endacòm mai, per far de ponts. | Les langues de France et d'ailleurs, pour faire des ponts. |
| Lengas de França | Langues de France |
| Vista d'ensemble | Vue d'ensemble |
| França metropolitana | France métropolitaine |
| Outra mar | Outre-mer |
| Sens territòri | Sans territoire |
| Lenga dels signes | Langue des signes |
| Lengas d'Itàlia · Lengas d'Africa | Langues d'Italie · Langues d'Afrique |
| 2 disponiblas · 9 a venir | 2 disponibles · 9 à venir |
| Perimètre en preparacion | Périmètre en préparation |
| Visibla de 150 km a 10 km | Visible de 150 km à 10 km |
| Visibla a partir de 150 km · I anar | Visible à partir de 150 km · Y aller |
| Visibla fins a 5 km · I anar | Visible jusqu'à 5 km · Y aller |
| Carta desplaçada per veire lo catalan · Tornar | Carte déplacée pour voir le catalan · Revenir |
| Res d'alucat se vei aicí · Anar al catalan | Rien d'allumé ne se voit ici · Aller au catalan |
| la lenga contunha · dadas a venir | la langue continue · données à venir |
| parlars aparentats | parlers apparentés |
| Lo mond · Las lengas · Los dialèctes · La tèrra · Las comunas | Le monde · Les langues · Les dialectes · Le sol · Les communes |
| Val d'Aran · Valadas occitanas · La Gàrdia | Val d'Aran · Vallées occitanes · Guardia Piemontese |

### Extension future (Italie, Afrique)

- Même gabarit : vue d'ensemble, puis une ligne par langue.
- Pour commencer, **des points**, pas des surfaces : Glottolog (licence CC BY 4.0) et Wikidata (domaine public) donnent un point et les noms de chaque langue. Ils s'affichent aux paliers Mond et Lengas.
- Des surfaces seulement avec une source dont la licence est vérifiée (Glottography, jeu par jeu). Même règle que pour la France : un atlas non commercial sert seulement de contrôle.
- Une voix par langue plus tard (Lingua Libre, CC BY-SA), qui sert la visibilité des langues peu connues.

---

## 3. France et frontières

### Constat

La carte n'est pas verrouillée : rien n'empêche de se déplacer vers Lille ou Strasbourg. Ce qui manque hors d'Occitanie, c'est le contenu (périmètres des langues, villes). Le contour de l'Europe actuel (Natural Earth, précision de moins d'un pixel à ces échelles) suffit aux paliers Lengas et Dialèctes : pas besoin d'un nouveau fond de carte pour la France.

### Le modèle : « una lenga, un domeni ; un domeni, de territòris »

En une phrase pour le public : **« La vue d'ensemble montre les langues de France ; une langue choisie se montre entière, de part et d'autre des frontières. »**

1. **Une langue allumée seule montre son domaine entier**, de la même façon des deux côtés de la frontière. La frontière d'État est un trait fin et neutre, jamais coloré par une langue. Le nom unifié est placé au cœur du domaine entier (CATALÀ entre Lhèida et Tarragona, comme aujourd'hui).
2. **La partie française est un territoire à part**, nommé dans la langue et sélectionnable en pastille (modèle Catalunya Nord). Les enclaves dans un autre État le sont aussi : l'Alguer, Aran, les vallées occitanes d'Italie.
3. **Là où les données s'arrêtent mais pas la langue**, la teinte s'évanouit sur environ 15 km au lieu d'être coupée net, et la barre du bas dit « la lenga contunha · dadas a venir ». Une langue n'est jamais coupée à une frontière d'État par simple manque de données.
4. **Deux langues voisines partagent une seule ligne de limite** (catalan et occitan, basque et gascon, occitan et francoprovençal) : ni chevauchement ni vide. Les zones vraiment mêlées sont hachurées des deux couleurs (modèle des zones mixtes actuelles).
5. **Parlers apparentés** (continuum au-delà d'une frontière, sans être la même langue) : hachures pâles, pas la même teinte.
6. **La vue d'ensemble « Langues de France »** est une seule couche légère (un contour simplifié par langue, environ 3 Ko chacun, 40 à 50 Ko pour toutes), chargée seulement quand on l'allume. Ses couleurs et le traitement de l'au-delà de la frontière sont les décisions n° 6 et 7.

### Ouvrir la carte à la France (décision n° 5)

- Maintenant : l'interrupteur du groupe « Langues de France » recadre sur toute la France, au palier Lengas.
- Ensuite : au dézoom, même sans rien cocher, les noms des langues voisines apparaissent en étiquettes pâles et cliquables (« Afichar lo breton » / « Afficher le breton »). C'est le principal levier de visibilité des langues peu connues.

### Langue par langue

| Langue | Domaine entier | Partie française (territoire à part) | Cas particuliers |
|---|---|---|---|
| **Catalan** | Catalogne, Pays valencien, Baléares, Andorre, Franja (Aragon), Carxe (Murcie), l'Alguer (Sardaigne) | Catalunya Nord (fait) | Le Fenouillèdes est occitan. Au survol de Catalunya Nord : « sens lo Fenolhedés, occitan ». **Trou dans les données** (voir plus bas). |
| **Basque** | Communauté autonome basque, Navarre, Iparralde | Iparralde | Bayonne, Anglet, Biarritz : gascon ou zone mixte. Dialectes : classement de Zuazo. Liste des communes : Office public de la langue basque. |
| **Breton** | France seulement (Basse-Bretagne) | pas de pastille à part | Limite moderne : ligne de Sébillot (1886), **pas** la ligne de Loth (qui est l'extension ancienne, vers le IXe siècle, et mettrait du pays gallo en breton). Le gallo est une langue d'oïl, à part. |
| **Flamand occidental** | Flandre-Occidentale (Belgique), Flandre zélandaise (Pays-Bas), Westhoek (France) | Westhoek | Données belges et néerlandaises peu comparables : fondu au-delà en attendant. |
| **Alsacien et francique** | Alsace, Moselle germanophone | partie française en plein | Au-delà (Bade, Palatinat, Sarre, Luxembourg) : continuum en hachures pâles « parlers apparentés », pas la même teinte ; il diverge à la frontière. |
| **Corse** | l'île entière | toute l'île | Gallura et Sassari (Sardaigne) en hachures « parlers apparentés ». Bonifacio : parler ligurien. |
| **Francoprovençal** | France (Lyonnais, Forez, Bresse, Dombes, Bugey, Savoie, nord du Dauphiné, sud de la Franche-Comté), Suisse romande (sans le Jura), Val d'Aoste et vallées du Piémont | partie française | Nom à trancher (décision n° 8). `lengas-franca.json` dit déjà « francoprovençal (arpitan) » à un endroit et « arpitan » ailleurs. |
| **Langues d'oïl** | picard (avec le Hainaut belge), wallon (Belgique, pointe de Givet), lorrain (avec la Gaume), normand (avec les îles Anglo-Normandes), gallo, poitevin-saintongeais, champenois, franc-comtois, bourguignon-morvandiau | partie française | Limites floues : en dernier. Une ligne dans le panneau, ses langues en pastilles. |
| **Parlers liguriens** | ligure d'Italie | Bonifacio ; Roya à vérifier | Monaco (monégasque) est ligurien. La Roya et La Brigue sont déjà en zone mixte (décision du 2026-10-07). |
| **Outre-mer** | chaque territoire | étiquettes et points, par territoire | Pas de surfaces au départ. Allumer un territoire recadre dessus. |

### L'occitan dans ce modèle

L'occitan obéit à la même règle, ce qui la rend crédible. Son domaine entier est déjà dessiné : le Val d'Aran est en gascon, les vallées d'Italie (Maira, Stura) en vivaro-alpin.
- La partie française n'a pas besoin de pastille (presque tout le domaine).
- Nouvelles pastilles à part : **« Val d'Aran »** (aranais officiel en Catalogne) et **« Valadas occitanas »** (Italie, loi 482/1999), avec en dessous « Catalonha · Espanha » et « Piemont · Itàlia ». Attention : ce n'est pas un simple ajout. Il faut fabriquer leurs contours (aujourd'hui seuls des rectangles d'emprise existent) et ajouter le mécanisme « à part » à la couche occitane.
- Plus tard : **« La Gàrdia »** (Guardia Piemontese, Calabre), absente des données, en îlot.
- Monaco reste hors du domaine (monégasque ligurien). Le mentonnais est vivaro-alpin (décision du 2026-10-07) : Menton est bien dans le vivaro-alpin ; seul un point en bord de mer tombe hors du polygone (côte simplifiée), à vérifier sur capture.
- Si tu choisis « au-delà pâle » pour la vue d'ensemble (décision n° 7), Aran et les vallées d'Italie pâliront dans cette vue. Ils restent pleins quand on allume l'occitan lui-même.

### À corriger avant tout travail sur les frontières : le trou du Fenouillèdes

Vérifié par test de points dans les polygones : Saint-Paul-de-Fenouillet, Maury, Sournia, Latour-de-France, Lesquerde, Ansignan et Bélesta ne sont **ni dans l'occitan ni dans le catalan**. Le polygone occitan s'arrête à la limite Aude / Pyrénées-Orientales ; seule Caudiès est en languedocien. Le trou se voit dès qu'on allume les deux langues. À montrer sur une capture, puis à corriger côté occitan à partir des communes de l'IGN, quand tu auras dit où passe la limite.

---

## 4. L'icône de la famille « Autres langues »

L'icône actuelle (deux écritures) parle d'alphabets, ce qui ne convient pas aux langues de France. Les trois meilleures options, toutes sans écriture et rendues à 20 px sur fond sombre et clair à côté des icônes Lenga et Natura actuelles :
`C:/Users/perie/AppData/Local/Temp/claude/C--Users-perie-Documents-6-Projectes-Lo-Ligam/0e63bbde-6a7e-4082-97fe-1ae56a3855ba/scratchpad/sintesi/iconas-sintesi.png` (fichier temporaire, à montrer avant qu'il disparaisse).

**1. Granda e pichona (une grande bulle, une petite).** Deux paroles de tailles différentes : une grande langue et une petite qui se répondent. C'est l'idée de « minoritaire » sans hiérarchie d'écriture. Elle forme un système avec l'icône de la famille Lenga (une bulle carrée). Dessin original, nette à 20 px (rendu vérifié).
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 22v-7.5a3 3 0 0 1 3 -3h6.5a3 3 0 0 1 3 3v2.5a3 3 0 0 1 -3 3h-5.5z"/><path d="M14.5 2h4.5a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1 -2.5 2.5v2.5l-3 -2.5h-1.5a2.5 2.5 0 0 1 -2.5 -2.5v-3a2.5 2.5 0 0 1 2.5 -2.5z"/></svg>
```

**2. Doas bocas (deux bulles qui se chevauchent).** Le dialogue entre les langues, les « ponts ». Une bulle = l'occitan (famille Lenga), deux bulles = les autres langues. La plus lisible à 20 px. Défaut : peut évoquer une messagerie (le libellé du rail lève le doute). Tracé proche de Tabler « messages » (licence MIT).
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-10a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v5a2 2 0 0 1 -2 2h-6z"/><path d="M9 9v-4a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v10l-3 -3h-3"/></svg>
```

**3. Constellacion (étoiles de tailles inégales reliées).** Chaque langue est une étoile, grande ou petite, reliée aux autres : le « ligam », en écho au fond étoilé. La plus artistique, mais seule elle peut se lire comme un graphique ou un itinéraire. Dessin original.
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="18.5" r="1.3"/><circle cx="7" cy="5.5" r="1.3"/><circle cx="17.5" cy="7" r="2.3"/><circle cx="18.5" cy="18.5" r="1.3"/><path d="M5.03 15.75L6.47 8.25"/><path d="M9.77 5.9L13.74 6.46"/><path d="M17.83 10.79L18.26 15.71"/><path d="M6.6 16.64L14.65 9.52"/></svg>
```

Écartées : la bulle avec une étoile (c'est le pictogramme courant des assistants d'intelligence artificielle), le repère de carte avec une onde (se lit « lieu », déjà utilisé dans les fiches), la bulle d'où sort une pousse (se lit comme une plante en pot, trop proche de Natura). Aucun pictogramme officiel n'existe pour les langues minoritaires ; les logos des réseaux européens (ELEN, NPLD) ne sont pas réutilisables.

---

## 5. Les décisions à prendre, une par une

Dans cet ordre. Pour chacune, l'option recommandée est en premier.

**Décision 1. L'icône.**
- (a) Granda e pichona. Recommandée : elle dit exactement « langue minoritaire » sans écriture, va avec la bulle de l'occitan et se lit à 20 px.
- (b) Doas bocas : la plus lisible, mais elle ne dit pas « minoritaire ».
- (c) Constellacion : la plus artistique, la moins évidente.

**Décision 2. La grille des cinq paliers.**
- (a) Seuils figés sur les valeurs actuelles de ton écran. Recommandée : rien ne bouge chez toi, tes seuils validés (200, 300 km et au-delà) sont gardés, le téléphone s'aligne sur toi.
- (b) Seuils arrondis plus réguliers : le contour seul passerait de 500 km à 400 km, et la côte arriverait un cran plus tard.

**Décision 3. L'arrivée sur téléphone.**
- (a) Sur les dialectes (150 km), Occitanie rognée d'environ 25 km de chaque côté. Recommandée : on arrive sur ce qui fait la richesse de la carte, avec les noms. À vérifier sur une capture que Niça reste dans le cadre.
- (b) Sur l'OCCITAN unifié (200 km), toute l'Occitanie visible, les dialectes à un pincement près.

**Décision 4. Les pastilles occitanes dans l'interface française.**
- (a) En occitan (gascon, lengadocian, provençal, lemosin, auvernhat, vivaroaupenc), le français dans la barre du bas. Recommandée : c'est ta règle des noms, appliquée à l'occitan comme au catalan.
- (b) Garder la traduction française pour l'occitan seulement.

**Décision 5. Ouvrir la carte à la France.**
- (a) Maintenant l'interrupteur du groupe qui recadre sur la France, puis les étiquettes pâles et cliquables au dézoom dans un second temps. Recommandée : simple tout de suite, et la visibilité arrive avec la deuxième étape.
- (b) Tout de suite les deux, étiquettes pâles affichées par défaut.
- (c) Trois vues nommées (Occitanie, France, Europe) : moins utile avec le recadrage automatique.

**Décision 6. Les couleurs de la vue d'ensemble.**
- (a) Un même ton neutre pour toutes (blanc des étoiles, pâle, nom dans la langue) ; une langue ne prend sa couleur que lorsqu'on l'allume. Recommandée : la couleur veut dire « langue choisie », la palette tient avec des dizaines de langues, c'est plus sobre et plus léger.
- (b) Une couleur par langue : plus spectaculaire, mais la palette sature au-delà de cinq ou six langues et se lit mal pour les daltoniens.

**Décision 7. Au-delà de la frontière, dans la vue d'ensemble.**
- (a) France pleine, au-delà pâle. Recommandée : c'est la vue « Langues de France », les données hors de France seront longtemps grossières, et dès qu'on allume une langue son domaine entier est égal. Conséquence à accepter : Aran et les vallées d'Italie pâlissent dans cette vue seulement.
- (b) Domaines entiers égaux partout, seule la frontière fine distingue la France : le plus fidèle « sans nationalisme », mais demande des données hors de France tout de suite.

**Décision 8. Arpitan ou francoprovençal.**
- (a) « francoprovençal » comme nom français (terme du ministère), « arpitan » cité dans la barre du bas. Recommandée : neutre, et c'est le terme de la liste officielle.
- (b) « arpitan » : nom militant, apprécié d'une partie des locuteurs.
Dans les deux cas, corriger les deux endroits de `lengas-franca.json`.

**Décision 9. Les groupes Italie et Afrique avant qu'ils aient du contenu.**
- (a) Cachés jusqu'à la première langue prête. Recommandée : un groupe vide marqué « à venir » fait amateur.
- (b) Visibles et grisés, « a venir », pour annoncer l'intention.

Ensuite seulement : valider les libellés occitans (tableau du § 2) et le nom du 4e palier.

---

## 6. Le plan

### Coût annoncé

Partie code : **3 à 4 séances**, en petits lots, chacun committé à part, avec `npm run build` et des captures (1830 × 950, 1366 × 650, téléphone 390 × 780) avant d'annoncer quoi que ce soit. Partie données (périmètres des autres langues) : **des semaines**, langue par langue. Ce cadrage est à noter dans `cahier-des-charges.md` § 11 avant de lancer la grille, car il élargit le périmètre du site (d'abord l'apprentissage de l'occitan).

### Maintenant (ce que Claude code ensuite)

0. **Sans code** : capture du Fenouillèdes avec l'occitan et le catalan allumés, à te montrer. Trier avec toi le fichier en double `CartaOccitania (# Name clash 2026-10-07 5csqdcC #).svelte` (conflit de synchronisation, non utilisé).
1. **Petit : les traductions dans la barre du bas** (répond à ta première phrase). Survol et passage clavier des pastilles, des étiquettes des langues de France et du nom CATALÀ vers la barre du bas, sur deux lignes ; le survol du panneau passe avant la zone choisie ; retrait des petites bulles d'aide ; étiquette « Català » cachée quand la couche catalan est allumée ; vérifier que Perpinyà s'affiche quand le catalan est allumé.
2. **Très petit, après la décision 1** : la nouvelle icône.
3. **Moyen, après les décisions 2 et 3 : la grille des échelles.** Un seul fichier de paliers lu par toutes les couches ; seuils figés ; une seule vue d'ensemble ; arrivée entre 6 et 8,5 ; noms des dialectes à 150 km ; villes à 100, 40 et 30 km ; étiquettes des langues de France jusqu'à 30 km ; départements dès 150 km ; fond détaillé jusqu'au zoom maximal ; code mort et commentaires faux corrigés.
4. **Petit** : le nom du palier à côté de la barre d'échelle.
5. **Moyen : préparer toutes les langues.** Une seule liste des langues (fusion de `lengas-franca.json` et de `lengas.js`) ; fin du catalan écrit en dur dans le rail et la carte ; une langue peut être dans plusieurs groupes sans doublon.
6. **Moyen : le panneau en groupes** (arborescence du § 2, lignes « nom dans la langue · nom », langues à venir en texte, ligne Occitan partagée, outre-mer replié).
7. **Moyen : le recadrage automatique**, le message « Revenir » sans minuterie, le message « carte vide ».
8. **Moyen : la réglette des paliers** sur chaque ligne, l'état « hors échelle » avec « Y aller », l'anneau creux dans le rail.

### Plus tard

- La vue d'ensemble complète : un fichier léger de contours simplifiés (40 à 50 Ko), une seule couche.
- Les périmètres des langues, retracés depuis des sources libres (communes IGN, limites publiées ; l'Atlas sonore LISN sert seulement de contrôle), du plus simple au plus délicat : corse, basque, breton (ligne de Sébillot), flamand, alsacien et francique, francoprovençal, puis oïl.
- La correction du Fenouillèdes côté occitan.
- Les pastilles Val d'Aran et Valadas occitanas (contours à fabriquer), puis La Gàrdia.
- La partie hors de France de chaque domaine, avec le fondu au bord des données et une ligne de limite commune entre langues voisines.
- Les noms des villes dans chaque langue (OpenStreetMap, licence ODbL ; Wikidata).
- Les étiquettes pâles et cliquables au dézoom ; la petite échelle des paliers près du zoom.
- Les sous-dialectes occitans au palier Tèrra (qui deviendra « Los parlars ») ; points d'enquête et sons au palier Comunas.
- Outre-mer par territoire ; langue des signes et langues sans territoire en fiches.
- Italie et Afrique en points (Glottolog, Wikidata), surfaces seulement avec licence vérifiée.

### Ce que tu peux faire seul, maintenant

- Regarder l'image des icônes et choisir (décision 1).
- Prendre les décisions 2 à 9, une à la fois, quand Claude te les présente avec une capture.
- Valider ou corriger les libellés occitans du § 2 (dicodòc, Congrès) et le nom du 4e palier.
- Dire où passe la limite occitane dans le Fenouillèdes (quelles communes).
- Rassembler les sources de périmètre par langue : liste des communes de l'Office public de la langue basque, de l'Office public de la langue bretonne, etc. C'est de la recherche documentaire, sans code.
- Dans QGIS, à partir des communes de l'IGN (Admin Express) : classer les communes langue par langue (une colonne langue, une colonne dialecte) et exporter un tableau « code INSEE → code », sur le modèle de `SIG/catalan/dialectes-catalan.csv`. Commencer par le basque, en excluant les communes gasconnes. Claude écrit une seule fois le convertisseur.
- Proposer les noms occitans des dialectes des autres langues (comme pour le catalan) et écrire une fiche de deux ou trois lignes par langue.
- Faire des captures sur ton écran et ton téléphone après chaque lot.

### Plus tard, avec de l'aide

- Faire relire les noms en basque, breton, corse, alsacien, flamand par des locuteurs ou par les offices de langue. Tu ne valides que l'occitan.
- Prévenir le service bénévole des tuiles en occitan (osm.bzh) avant un usage à l'échelle de la France.

---

## Risques à garder en tête

- **Téléphone** : c'est l'écran qui change le plus. À tester sur un vrai téléphone avant de pousser.
- **Recadrage** : peut désorienter. D'où : seulement sur un geste d'allumage, toujours « Revenir », animations réduites respectées.
- **Poids et fluidité** : chaque langue allumée réserve beaucoup de mémoire d'affichage (environ 70 Mo par langue sur ton écran). La vue d'ensemble doit être une seule couche, et une langue éteinte doit libérer sa mémoire. Viser 30 Ko compressés par langue, chargés à la demande. Mesurer avant et après.
- **Placement des noms** : aujourd'hui les noms de deux couches s'évitent deux à deux ; au-delà de deux langues, il faudra un registre commun des noms.
- **Noms sensibles** : Catalunya Nord, Iparralde, arpitan, corse et gallurais, alsacien et allemand, Menton et la Roya. Libellés français : suivre la liste du ministère ; noms dans la langue : académies et locuteurs ; c'est toi qui décides.
- **Données asymétriques** : faciles côté France (communes IGN), rares à l'étranger. Sans le fondu « la langue continue », la carte couperait les langues aux frontières d'État, exactement ce qu'on veut éviter.
- **Dérive de périmètre** : l'atlas des langues de France, d'Italie et d'Afrique est un chantier long. Lo Ligam reste d'abord un site d'apprentissage de l'occitan.

---

## Notes techniques pour la prochaine séance de code (Romain peut sauter)

- Grille : `nivèlsDezoom()` (colaEstelas.js l.338) renvoie des constantes `{ zDial: 5.95, z300: 5.37, z500: 4.63, zVuèg: 3.7 }` ; `this._zBase` figé à 7,75 ; supprimer `getBoundsZoom(OCCITANIA)` sans marge (l.965, 1051, 1303). Les consommateurs (aDialectes, aDetalh, colaDonadas, colaLenga, colaTematica) ne changent pas. Nouveau `carta/escalas.js` : paliers (id, oc, fr, zMin, zMax, km arrondis) et plages par couche.
- Noms des dialectes : colaDonadas.js `aNoms` l.1214 et colaLenga.js l.711, entrée à 6, sortie 8,75 → 9,5. Villes : seuils fixes 6,5 / 8 / 8,5 au lieu de `zBase + dz`. Pas d'hystérésis (zoomSnap 0,25, recalcul au moveend).
- Arrivée : `clamp(fitBounds, 6, 8.5)` (CartaOccitania l.464). Tuiles : `maxNativeZoom: 17` (satellite 15).
- Nom du palier : élément frère du contrôle d'échelle, pas dans `.leaflet-control-scale-line` (largeur fixée, nowrap, débordement).
- Barre du bas : `legendaDial = survòlTem ?? causida ?? causidaLenga ?? survòl ?? survòlLenga` (CartaOccitania l.103) ; donner la priorité au survol du panneau. Retirer `title` (RailJaces vers l.697) ; texte caché avec `lang` ; annonce `aria-live` seulement au focus et à la sélection.
- Recadrage : rappel `onAluc(id, zona)` appelé depuis `bascular`, `causirDial`, `causirLenga` ; jamais un effet sur l'état de visibilité (sinon déclenché par Annuler, Tout remettre, Netejar, le chargement de la base). Marge gauche = `getBoundingClientRect()` réel du tiroir (le rail fait 4,6 rem, se déplace et peut être horizontal). Plafond 8,5 sauf communes.
- Panneau : `details/summary` avec l'interrupteur **à côté** du `summary` (sinon élément interactif imbriqué). Dédoublonner par id dans `totas` et `afichadas` (sinon erreur Svelte each_key_duplicate) ; attention à `fusionarCatalogue` (fusion par id avec la base `carta_colas`) quand on renomme ou supprime des lignes. Garder l'id `lengasFranca` pour l'interrupteur du groupe.
- Généraliser : `CA`, `DIAL_CA`, `bascular` l.424, `colaCatalan` → boucle sur `LENGAS` ; couche créée à la première activation ; champ `endo` (repli sur `ca`) ; `JACES_LENGAS` dérivé ; `grops: ['franca', 'italia']`.
- Mémoire : chaque couche de langue alloue au moins 4 canevas avec marge 0,3 (environ 18 Mo chacun à 1830 × 950, densité 1) ; `setActiu(false)` efface sans libérer : remettre les canevas à 0 × 0 à l'extinction.
- Placement des noms : chaîne d'obstacles codée deux à deux (estelas, donadas, catalan via `obstacles()`) ; prévoir un registre commun des boîtes avant une troisième langue.
- Vérifications déjà faites par les évaluations : scripts `scratchpad/eval/pip.mjs` (points dans les polygones), `bz.mjs` (zooms d'ajustement par écran), `escala.js` et `seuils.js` (table des seuils).
