<!-- Étude produite le 2026-10-07 par une équipe d'agents (outils, droits, mise en page), à relire. Mise à jour : la carte Occitanica retracée est bien la fiche 21242 « Carte linguistique de l'Occitanie », CIRDÒC, Licence Ouverte (vérifié le 2026-10-07). -->

# Fai ta carta d'Occitània : ce qui est possible, ce qui bloque, comment s'y prendre

Rapport du 7 octobre 2026, tiré de trois études (outils, droits, mise en page) et de vérifications dans le code du projet.

**Comment lire ce rapport**
- **(vérifié)** : lu dans une page en ligne citée ou dans le code du projet.
- **(déduction)** : c'est un raisonnement. Il faut le confirmer ou le tester.

**Avant tout : le périmètre.** Un outil qui compose et exporte des cartes dépasse le périmètre de départ (A1, compte, questionnaire). La place de la cartographie est encore à trancher dans `cahier-des-charges.md` §3, §6 et §11. Ce rapport sert à décider. Il ne lance pas le chantier.

---

## En bref

1. **C'est faisable sans alourdir la page de carte.** Les outils d'export ne se téléchargent qu'au clic sur « Exporter ». Les fichiers de données (GeoPackage, Shapefile) se préparent une fois pour toutes dans QGIS et ne coûtent rien au navigateur.
2. **Une carte faite seulement de couches dessinées, sans fond de tuiles, peut presque toute circuler librement, même pour un usage commercial**, à condition d'y imprimer un bloc « Sources ». Il y a deux exceptions : **le Croissant** (source inconnue) et **les fonds de tuiles** (satellite non commercial, relief en partage à l'identique).
3. **Un point à confirmer avant toute diffusion :** la carte d'Occitanica que tu as retracée est-elle bien la fiche n° 21242, qui est sous Licence Ouverte ? Si oui, aucune autorisation n'est nécessaire en droit. Si c'est une autre carte, il faut une autorisation écrite.
4. **Sur tes polices :** tu proposes Limelight (la police du logo) pour les grandes villes, ce qui va dans le sens des conventions. En revanche, mettre les petites villes en italique les contredit : en cartographie, l'italique est réservé à l'eau. Je te propose de comparer les deux versions sur deux maquettes côte à côte.

---

## 1. Ce qui est possible : la pile recommandée

### Le principe

- La carte à l'écran ne change pas de poids.
- Tout ce qui sert à exporter est un module séparé, téléchargé seulement quand quelqu'un clique sur « Exporter ». C'est le fonctionnement normal de l'outil de construction du site (déduction, non relu en ligne).
- On exporte en **projection conique** (comme le Lambert-93 des cartes françaises) et pas dans la projection de la carte à l'écran (Mercator). Sur la hauteur de l'Occitanie, Mercator déforme l'échelle d'environ 6 à 7 % du sud au nord (déduction, calcul). La fenêtre d'export doit donc montrer un **aperçu fidèle** du résultat.

### Point de départ mesuré dans le projet (vérifié)

- Les couches existent déjà en fichiers dans `app/static/data`, pour environ 1,3 Mo non compressé : départements 569 Ko, régions 225 Ko, courbes de niveau 209 Ko, dialectes 16 Ko, Croissant 2 Ko, etc.
- Les polices existent déjà dans `app/static/fonts` : Limelight 33 Ko, Luciole 42 à 45 Ko par style, Cormorant italique 20 à 24 Ko.
- Aucune bibliothèque de dessin ou de PDF n'est installée pour l'instant : il n'y a que Leaflet.

### Les formats retenus

| Format | Comment | Poids ajouté (au clic seulement) | Statut |
|---|---|---|---|
| **Image PNG** (réseaux sociaux) | On redessine la carte actuelle en 1080 px de large et on l'enregistre comme image | 0 Ko | déduction |
| **SVG** (image vectorielle, retouchable) | L'outil **d3-geo** (licence ISC) calcule la projection conique et les tracés. Le fichier SVG est écrit directement, avec de vrais textes et les polices du site intégrées | environ 12 Ko compressés (36 Ko bruts) | vérifié |
| **PDF mis en page** | L'outil **PDFKit 0.20.2** (licence MIT, très suivi). Il reprend tels quels les tracés de d3-geo, lit directement les polices du site et n'intègre que les lettres utilisées | environ 212 Ko compressés | vérifié. Sa version pour navigateur est récente : à tester |
| PDF, solution de secours | **jsPDF 4.2.1 + svg2pdf.js 2.8.1** (MIT). Il faut alors servir les polices aussi au format TTF, et le SVG doit rester simple | environ 155 Ko, plus les polices TTF | vérifié |
| Bouton « Imprimer » | Mise en page d'impression du navigateur (règle `@page`), prise en charge par tous les navigateurs récents depuis décembre 2024 | 0 Ko | vérifié. Ne sert que de secours : marges et nom du fichier ne sont pas maîtrisés |
| **GeoJSON** (données) | Écrit à la volée à partir des couches déjà chargées | 0 Ko | vérifié |
| **GeoPackage** (données, toutes les couches dans un seul fichier) | **Préparé une fois** dans QGIS ou avec ogr2ogr, puis servi comme simple fichier | 0 Ko de code. Fichier à télécharger d'environ 1 à 2 Mo | déduction |
| **Shapefile** (données) | Même méthode : un fichier zip par couche, encodé en UTF-8 avec son fichier `.cpg`, et des noms de champs de 10 caractères au plus | 0 Ko de code | vérifié (règles du format) |

### Les outils écartés et pourquoi (vérifié)

| Outil | Raison |
|---|---|
| gdal3.js | Le navigateur devrait télécharger environ 40 Mo. C'est contraire à la sobriété. |
| @ngageoint/geopackage | Environ 600 Ko compressés, et rien ne confirme qu'il sache écrire un fichier dans le navigateur. On pourra le revoir plus tard pour un GeoPackage qui garde les couleurs choisies. |
| @mapbox/shp-write | Abîme l'apostrophe ’ et le œ, n'écrit pas de fichier `.cpg`, et son module d'écriture des attributs se déclare non maintenu. |
| pdf-lib | Aucune nouvelle version depuis novembre 2021. |
| Navigateur sans écran sur le serveur | Plusieurs centaines de Mo et beaucoup de calcul à chaque export (déduction). |
| proj4 (43 Ko), opentype.js (65 Ko) | Inutiles pour l'instant. Le second servirait à transformer les textes en tracés : à garder pour plus tard. |

### Pièges techniques à connaître

- d3-geo lit le sens des contours à l'envers de la norme GeoJSON. Si on ne les retourne pas, une zone peut remplir le monde entier. Il faut tester chaque couche (vérifié).
- Inkscape sous Windows ne lit pas les polices intégrées dans un SVG. Un correctif a été proposé en mars 2026, sans confirmation qu'il ait été adopté. Pour les graphistes, le PDF reste le format sûr (vérifié).
- Polices intégrées dans les fichiers exportés :
  - **Luciole** est sous CC BY 4.0 (vérifié, et déjà noté dans `charte-graphique.md`). Il faut créditer ses auteurs dans le pied de page ou dans les informations du PDF.
  - **Limelight** et Cormorant sont sous licence OFL d'après Google Fonts, ce qui permet de les intégrer (non revérifié).
- Choix de la projection, à décider plus tard :
  - le Lambert-93 (EPSG:2154) ;
  - la projection conique européenne (EPSG:3034, recommandée par la directive européenne INSPIRE pour cette échelle) ;
  - un « Lambert Occitània » centré sur l'aire de la langue (parallèles vers 43° et 45,7°, méridien vers 2,5° E, déduction).

  Pour les fichiers de données, rester en coordonnées classiques (EPSG:4326 ou 2154) que QGIS lit directement.

---

## 2. Ce qui bloque juridiquement, et les autorisations à demander

*Ceci n'est pas un avis juridique.*

### Situation de chaque couche

| Couche | Source | Licence | Export en image (PNG, SVG, PDF) | Export en données (GeoPackage, Shapefile) |
|---|---|---|---|---|
| Limite de la langue, six dialectes | Carte d'Occitanica (CIRDÒC) | **Licence Ouverte, si c'est bien la fiche 21242** (vérifié pour la fiche, mais le lien avec ton tracé n'est pas confirmé) | Oui, avec mention, **si c'est 21242** | Oui, mais la couche « domaine de la langue » mêle des morceaux d'OSM, donc l'export passe sous ODbL (déduction) |
| **Croissant** | Ancienne couche « Carte_dialecte_WG » | **Inconnue**. Aucune trace dans le dépôt (vérifié par recherche) ni en ligne | **Non** | **Non** |
| Val d'Aran, communes du Piémont | OpenStreetMap | ODbL (vérifié) | Oui, avec mention | Oui, sous ODbL |
| Vallées d'Italie tracées à la main | Dessin maison, peut-être fait par-dessus un fond OSM | Incertaine (déduction) | À refaire proprement | À refaire proprement |
| Noms occitans | OSM (`name:oc`) et BdTopoc de l'IEO, mise à jour du 16/11/2023 | ODbL (vérifié) | Oui, avec mention | Oui, sous ODbL |
| Régions, départements | IGN Admin Express COG 2018 et INSEE, via france-geojson | Licence Ouverte (vérifié, version exacte non vérifiée) | Oui, avec mention | Oui |
| Côtes, rivières | Natural Earth | Domaine public (vérifié) | Oui | Oui |
| Courbes de niveau | **Mapzen Terrarium** (trouvé dans le code, `colaEstelas.js` ligne 322 : la source n'est donc pas inconnue) | Données ouvertes avec mentions obligatoires : EU-DEM (Copernicus), USGS, NOAA (vérifié). La licence propre d'EU-DEM n'est pas vérifiée | Oui, avec mentions | Probablement, à vérifier |

### Les fonds de tuiles : à exclure des exports

| Fond | Problème |
|---|---|
| OpenTopoMap (relief) | Licence CC BY-SA 3.0 : toute carte exportée avec ce fond serait elle aussi en partage à l'identique. Les téléchargements en masse sont interdits (vérifié). |
| Satellite EOX | Le site utilise la couche **2020** (vérifié dans le code), pas celle de 2016. Elle est sous CC BY-NC-SA 4.0 : **pas d'usage commercial**. Le service gratuit est réservé aux usages non commerciaux (vérifié). |
| OpenStreetMap e occitan (openstreetmap.bzh) | Aucune licence du rendu ni règle d'usage publiée (vérifié). Service bénévole. |

Exporter seulement les couches dessinées est aussi le choix le plus sobre. La carte composée peut alors être proposée sous **CC BY 4.0**, la licence qui circule le mieux (déduction).

### Trois règles de l'ODbL à respecter (vérifié)

1. **Une image** (PNG, SVG, PDF) tirée d'OSM s'appelle une « œuvre produite » dans le vocabulaire de la licence. On peut la diffuser sous n'importe quelle licence, à condition d'y écrire « © les contributeurs d'OpenStreetMap ». Sur papier ou en PDF, l'adresse `openstreetmap.org/copyright` doit être imprimée en entier.
2. **Un fichier de données** qui contient des couches tirées d'OSM ou de BdTopoc doit être diffusé **sous ODbL**.
3. Quand on diffuse une image tirée d'une base modifiée (ici le domaine de la langue, qui assemble Occitanica et OSM), il faut **aussi mettre cette base à disposition** (article 4.6). Il faut donc prévoir une petite **page de téléchargement Lo Ligam**, et le bloc « Sources » y renvoie.

Une précaution de plus (déduction) : un SVG qui garderait les longitudes, les latitudes et les attributs des objets pourrait être vu comme une base de données. Le SVG exporté doit donc rester un simple dessin projeté, sans tableau d'attributs.

### À corriger sur le site dès maintenant (vérifié)

- **La mention du fond satellite est incomplète.** Texte demandé par EOX :
  « Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2020) ».
- **Le Croissant s'affiche déjà sur le site.** Afficher une couche dont on ignore l'auteur, c'est déjà la diffuser (déduction). Avant d'en faire une zone sélectionnable comme tu le souhaites, il vaut mieux la redessiner d'après une source connue.
- **Pour les vallées d'Italie** : les redessiner à partir des communes de la loi italienne 482, prises dans OSM, rend leur licence claire (ODbL). Cela donne aussi leurs noms et leurs contours pour le survol que tu demandes (déduction).

### Les autorisations à demander

| À qui | Pourquoi | Obligatoire ? | Contact |
|---|---|---|---|
| **CIRDÒC** (Occitanica) | Confirmer que la carte source est la fiche 21242, que la Licence Ouverte couvre aussi le dessin, et connaître la forme de crédit souhaitée | **Obligatoire** si ce n'est pas la fiche 21242. Simple courtoisie sinon | informatica@oc-cultura.eu (vérifié, page des mentions légales) |
| **Équipe « Les parlers du Croissant »** (CNRS, laboratoire LLACAN) | Connaître la licence de leur carte. Une licence CC BY-SA 4.0 est évoquée, mais je n'ai pas pu la confirmer. Demander le droit de redessiner l'aire en les citant | Oui, si on veut montrer le Croissant | Adresse non vérifiée : à trouver sur leur publication HAL |
| OpenStreetMap e brezhoneg | Seulement si on voulait leurs tuiles dans les exports (déconseillé), ou par courtoisie à cause du trafic du site | Non, pour l'instant | darempred@openstreetmap.bzh (vérifié) |
| EOX | Seulement en cas d'export avec fond satellite, ou de modèle payant sur les mêmes pages | Non, pour l'instant | via cloudless.eox.at |

Pour mémoire, l'Atlas sonore du LISN ne sert que d'inspiration : on ne reprend aucune de ses données. D'après tes notes, ta demande du 31/07 est toujours en attente.

Tous ces courriels sont à envoyer par toi.

**Modèle 1, CIRDÒC** (tu peux l'écrire en occitan si tu préfères)

> Objet : Réutilisation de la « Carte linguistique de l'Occitanie » (occitanica.eu, fiche 21242)
>
> Bonjour,
>
> Je développe Lo Ligam, un site d'apprentissage de l'occitan. J'ai redessiné la limite de la langue et les six dialectes d'après la « Carte linguistique de l'Occitanie » (https://www.occitanica.eu/items/show/21242). Ce tracé sert à une carte interactive et à un outil qui permettra à chacun de composer sa carte et de l'exporter (image, PDF, puis données géographiques).
>
> La fiche indique la Licence Ouverte. Pourriez-vous me confirmer :
> 1. que cette licence couvre bien le dessin de la carte, y compris un tracé adapté et diffusé sous forme de données ;
> 2. que la carte ne reprend pas un fond ou un atlas appartenant à un tiers ;
> 3. la forme de crédit que vous préférez ? Je prévois : « D'après la Carte linguistique de l'Occitanie, CIRDÒC - Institut occitan de cultura, occitanica.eu (Licence Ouverte), tracé adapté par Lo Ligam ».
>
> Je vous montrerai volontiers le résultat avant sa mise en ligne.
>
> Bien cordialement,
> Romain Perier, Lo Ligam

**Modèle 2, équipe du Croissant**

> Objet : Licence de votre carte des parlers du Croissant
>
> Bonjour,
>
> Je prépare une carte de l'aire de l'occitan pour Lo Ligam, un site d'apprentissage de la langue, et je souhaite y montrer le Croissant comme zone de transition entre l'occitan et la langue d'oïl. Votre carte (programme « Les parlers du Croissant ») est-elle diffusée sous une licence libre ? Puis-je redessiner l'aire d'après elle et diffuser ce tracé, en vous citant ? Quelle forme de citation souhaitez-vous ?
>
> Merci d'avance,
> Romain Perier, Lo Ligam

### Modèle de bloc « Sources » à imprimer sur la carte

Seules les lignes des couches affichées sont imprimées. Ce bloc sera généré automatiquement.

> **Sources.**
> Langue et dialectes : d'après la « Carte linguistique de l'Occitanie », CIRDÒC - Institut occitan de cultura, occitanica.eu (Licence Ouverte), tracé adapté par Lo Ligam, 2026.
> Val d'Aran, vallées occitanes d'Italie, noms de lieux : © les contributeurs d'OpenStreetMap, openstreetmap.org/copyright (ODbL) ; BdTopoc, Institut d'Estudis Occitans (ODbL, version du 16/11/2023).
> Régions et départements : IGN, Admin Express COG 2018 ; INSEE, COG 2018 (Licence Ouverte), via france-geojson.
> Côtes et rivières : Natural Earth (domaine public).
> Relief : courbes calculées par Lo Ligam d'après les Terrain Tiles de Mapzen ; EU-DEM : « Produced using Copernicus data and information funded by the European Union » ; SRTM et GMTED2010 : U.S. Geological Survey ; ETOPO1 : NOAA/NCEI.
> Données dérivées sous ODbL : [adresse de la page de téléchargement].
> Polices : Limelight (OFL), Luciole (CC BY 4.0, ses auteurs).
> Carte composée avec « Fai ta carta d'Occitània », Lo Ligam, [adresse], le [date]. Diffusion libre sous licence CC BY 4.0.

---

## 3. Proposition de mise en page

### Une seule grille, déclinée par proportions

1. **Bandeau titre** : titre en occitan, sous-titre ou traduction plus petite.
2. **La carte**, calée un peu au-dessus du centre de la page, là où l'œil se pose naturellement (vérifié, guide de l'Ordnance Survey).
3. **La légende dans un vide de mer** : golfe du Lion en bas à droite, ou Atlantique en haut à gauche. La carte n'a ainsi pas besoin d'être réduite (déduction).
4. **Pied de page en petit** : sources, licences, date, « Carta facha amb Lo Ligam » et l'adresse du site.

Ordre de lecture voulu : la carte, puis le titre, puis la légende. Les sources viennent en dernier, dans le plus petit texte de la page (vérifié).

### Éléments obligatoires et facultatifs (déduction appuyée sur des guides de cartographie)

| Obligatoires | Facultatifs |
|---|---|
| Titre | Sous-titre |
| Légende générée à partir des seules couches cochées (sans écrire le mot « Légende » au-dessus) | Nom de l'auteur, en champ libre et jamais imposé |
| Bloc sources et licences | Échelle graphique discrète (50 ou 100 km) |
| Date | Petite carte de situation en Europe |
| « Fait avec Lo Ligam » et l'adresse du site | Code QR (affiche seulement) |
| Phrase d'avertissement : « Les limites sont indicatives : on passe d'un parler à l'autre sans frontière nette. Cette carte montre l'aire traditionnelle de la langue, pas le nombre de locuteurs. » | Logo |

**Pas de flèche du nord.** En projection conique, à l'échelle de l'Occitanie, elle serait trompeuse, car le nord n'y est exact que le long d'un méridien (vérifié).

### Formats

| Format | Taille | Marges |
|---|---|---|
| A4 portrait et paysage | 210 × 297 mm | 10 mm pour une imprimante de bureau (déduction) |
| A3 | 297 × 420 mm | Idem. Option « pour imprimeur » : 3 mm de fond perdu et 3 à 5 mm de zone de sécurité (vérifié, guides d'imprimeurs) |
| Affiche A2 | 420 × 594 mm | Idem |
| Réseaux sociaux 4:5 | 1080 × 1350 px | Titre, logo et texte dans une bande centrale d'environ 1012 px, car la grille d'Instagram recadre en 3:4 depuis janvier 2025 (vérifié sur des sites tiers seulement) |
| Carré | 1080 × 1080 px | Aucun texte sous 24 px |
| Vertical (option) | 1080 × 1920 px | Idem |

L'Occitanie est plus large que haute. Sur les formats carrés et verticaux, on place le titre et la signature dans les vides du haut et du bas (déduction).

### Typographie : réponse à ta question sur les polices

Ce qui ne va pas aujourd'hui, et que tu as bien vu : le nom d'une ville est en Luciole, puis passe en Cormorant italique au survol. **Le survol ne doit jamais changer la police.** Il change seulement la graisse, la couleur ou le halo (vérifié, conventions de cartographie).

Les conventions (vérifié) : peu de polices, on fait varier la taille, la graisse et l'espacement, et **l'italique est réservé à l'eau**. Les villes restent en caractères droits.

| Élément | Ta proposition | Proposition conforme aux conventions |
|---|---|---|
| Titre | Limelight | **Limelight**, la police du logo (vérifié dans `charte-graphique.md`) |
| Grandes villes | Limelight | **Limelight** |
| Villes moyennes | Luciole | **Luciole droite**, normale |
| Petites villes | Italique | **Luciole droite**, plus petite et plus claire |
| Rivières | ? | **Luciole italique, en bleu**, et seulement elles |
| Dialectes, régions | ? | **Capitales espacées**, couleur atténuée |

Le résultat ne compte que **deux polices**. Cormorant disparaît de la carte, ce qui fait 20 à 24 Ko de moins à charger (déduction). Je te propose de voir **les deux versions sur deux maquettes côte à côte**, à au moins 1830 px de large.

**Tailles de départ pour l'A4** (déduction, à tester à l'écran et sur papier) :
- titre 28 à 32 pt ;
- grandes villes 11 à 12 pt, villes moyennes 8 à 9 pt, petites villes 6,5 à 7 pt ;
- rivières 7 pt ;
- légende 8 à 9 pt ;
- sources 6 à 6,5 pt.

Pour l'A3, tout est multiplié par 1,41.

### Couleurs et accessibilité

- **Palette sûre pour les daltoniens.** La palette « muted » de Paul Tol (9 couleurs, vérifié) suffit pour 6 dialectes, le Croissant et les transitions. Les codes couleur cités dans l'étude viennent de mémoire et sont à contrôler.
- **Écrire le nom de chaque dialecte dans sa zone.** Deux aplats pâles voisins n'atteignent pas le contraste de 3 pour 1 exigé, et l'information ne doit pas passer par la seule couleur (règles WCAG 1.4.1 et 1.4.11, reprises par le RGAA, vérifié).
- **Transitions en hachures ou en fondu, jamais en trait plein.** Le Croissant se dessine lui-même en hachures occitan / oïl. Les frontières d'États restent plus fines que la limite de la langue (déduction appuyée sur la littérature de dialectologie).
- **Si l'internaute change les couleurs** : afficher un avertissement et proposer un aperçu « vision daltonienne » (déduction).
- **Dans les fichiers exportés** :
  - de vrais textes, avec un titre et une description dans le SVG ;
  - dans le PDF, la langue (oc) et le titre dans les informations du fichier ;
  - pour les réseaux, un texte alternatif proposé automatiquement à partir des couches cochées (RGAA critère 1.6, vérifié).
  - Un PDF entièrement balisé pour l'accessibilité est difficile à produire dans le navigateur : ce sera pour plus tard.

### Trois inspirations

- **Atlas sonore des langues régionales** (atlas.lisn.upsaclay.fr) : son curseur de lissage, qui va d'une limite nette à une limite floue, est une bonne idée pour ton **animation de diffusion d'un dialecte**. On en reprend l'idée, pas les données.
- **L'éventail rhénan** : au lieu d'une ligne unique, quelques limites de traits, chacune nommée par le trait qui change. Ce serait une couche facultative « ce qui sépare les dialectes », dont tu choisirais le contenu.
- **La dialectométrie de Goebl** : la limite devient une intensité plutôt qu'un oui ou un non. C'est pour plus tard, s'il y a des données par points.

---

## 4. Découpage en étapes

Durées estimées (déduction) : environ 6 à 8 séances de travail avec Claude au total, sans compter le travail dans QGIS ni les délais de réponse aux courriels.

| Étape | Qui | Contenu | Poids ajouté au site | Risque |
|---|---|---|---|---|
| **0. Tout de suite** | **Romain seul** | Comparer ta carte source avec la fiche Occitanica 21242. Envoyer le courriel au CIRDÒC. Chercher l'origine de « Carte_dialecte_WG » et écrire à l'équipe du Croissant. Décider de la place de l'export dans le cahier des charges (§3, §6, §11) | 0 Ko | Aucun. C'est le préalable de tout le reste |
| **1. Panneau des couches** (ta demande « gestion de données ») | **Claude code** | Voir les couches actives, les cocher et les décocher, garder les rivières sans leurs noms, changer les couleurs, n'afficher que le trait de côte fin. Corriger la mention EOX. Rendre les polices cohérentes, survol compris | Quelques Ko de code maison (déduction), et 20 à 24 Ko en moins si Cormorant sort de la carte | Faible. C'est déjà utile sans export |
| **2. Images pour les réseaux** (1080 × 1350 et 1080 × 1080) | **Claude code** | Image, bloc sources court et texte alternatif proposé | 0 Ko | Moyen : diffusion large. À ouvrir au public **après la réponse de l'étape 0**, sans le Croissant tant que sa source n'est pas établie |
| **3. SVG A4 et A3** | **Claude code** | Projection conique, aperçu fidèle, bloc sources généré à partir des couches cochées | Environ 12 Ko au clic, 0 Ko au chargement. Fichier exporté : polices intégrées et tracés, quelques centaines de Ko au plus (déduction, à mesurer) | Sens des contours de d3-geo, polices non lues par Inkscape sous Windows |
| **4. PDF mis en page** et bouton Imprimer | **Claude code** | Titre, légende, sources, formats A4, A3 et A2 | Environ 212 Ko au clic (ou 155 Ko et des polices TTF en solution de secours) | Version de PDFKit pour navigateur récente, à tester en premier |
| **5. Données** (GeoPackage, Shapefile, page de téléchargement ODbL) | **Romain dans QGIS** pour les fichiers, **Claude** pour la page et le fichier « lisez-moi » des licences | Fichiers préparés une fois, servis tels quels | 0 Ko de code. Fichiers à télécharger d'environ 1 à 2 Mo (déduction) | **Bloquant tant que le CIRDÒC et le Croissant ne sont pas réglés.** Il faut régénérer les fichiers à chaque correction des couches, et vérifier que les noms de champs coupés à 10 caractères ne créent pas de doublons |
| 6. Plus tard | Claude, avec une aide extérieure si besoin | GeoPackage qui garde les couleurs choisies (environ 600 Ko), FlatGeobuf (environ 20 Ko), textes transformés en tracés (65 Ko), PDF entièrement accessible | Au clic seulement | Poids et maintenance |

**Aide extérieure utile** (déduction) :
- une relecture juridique avant une diffusion à grande échelle ;
- un essai d'impression chez un imprimeur pour l'affiche ;
- une ou deux personnes qui utilisent QGIS pour tester les fichiers de données ;
- les réponses du CIRDÒC et de l'équipe du Croissant.

**À part : l'animation de diffusion d'un dialecte** sur son aire. C'est un chantier distinct, réalisable avec le dessin maison sans aucune bibliothèque (0 Ko, déduction), en s'inspirant du curseur de lissage de l'Atlas sonore.

### Première décision à prendre (une seule pour l'instant)

Par quoi commencer, une fois l'étape 0 lancée ?
- **A.** Le panneau des couches seul (étape 1) : utile tout de suite et sans risque juridique. **C'est ma recommandation.**
- **B.** Le panneau des couches et les images pour les réseaux (étapes 1 et 2) : c'est ce qui se diffuse le plus vite, mais il faut attendre la réponse du CIRDÒC pour ouvrir l'export au public.
- **C.** Directement l'affiche PDF (étapes 1, 3 et 4) : c'est le plus beau résultat, mais aussi le plus long.

---

## Sources

**Outils**
- https://d3js.org/d3-geo/path
- https://d3js.org/d3-geo/conic
- https://data.jsdelivr.com/v1/packages/npm/d3-geo@3.1.1
- https://github.com/foliojs/pdfkit
- https://pdfkit.org/docs/getting_started.html
- https://bundlephobia.com/api/size?package=pdfkit
- https://github.com/parallax/jsPDF
- https://github.com/yWorks/svg2pdf.js
- https://bundlephobia.com/api/size?package=jspdf
- https://api.deps.dev/v3/systems/npm/packages/pdf-lib
- https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size
- https://github.com/bugra9/gdal3.js
- https://raw.githubusercontent.com/ngageoint/geopackage-js/master/README.md
- https://github.com/mapbox/shp-write
- https://raw.githubusercontent.com/tmcw/dbf/master/src/lib.js
- https://github.com/mapbox/shp-write/issues/125
- https://mapshaper.org/docs/formats/shapefile.html.md
- https://github.com/flatgeobuf/flatgeobuf
- https://bundlephobia.com/api/size?package=fflate
- https://gitlab.com/inkscape/inkscape/-/merge_requests/7806
- https://www.luciole-vision.com/

**Droits**
- https://occitanica.eu/conditions_reutilisation
- https://occitanica.eu/mentions_legales
- https://www.occitanica.eu/items/show/21242
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278875
- https://www.data.gouv.fr/pages/legal/licences/etalab-2.0
- https://www.openstreetmap.org/copyright
- https://opendatacommons.org/licenses/odbl/1-0/
- https://osmfoundation.org/wiki/Community_Guidelines/Produced_Work_-_Guideline
- https://osmfoundation.org/wiki/Licence/Attribution_Guidelines
- https://osmfoundation.org/wiki/License/Community_Guidelines/Horizontal_Map_Layers_-_Guideline
- https://www.data.gouv.fr/datasets/basa-de-donadas-noms-de-lespaci-occitan-base-de-donnees-nom-de-lespace-occitan
- https://www.naturalearthdata.com/about/terms-of-use/
- https://github.com/gregoiredavid/france-geojson
- https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- https://opentopomap.org/about
- https://cloudless.eox.at/documentation/license
- https://eox.at/2024/08/sentinel-2-cloudless-2023/
- https://www.openstreetmap.bzh/2018/12/20/des-rendus-pour-loccitan-et-le-basque-communique-du-13-12-2018/
- https://halshs.archives-ouvertes.fr/halshs-03266827v2/file/2021%20-%20Parlers%20du%20Croissant,%20parlers%20en%20danger.pdf

**Mise en page**
- https://docs.os.uk/more-than-maps/geographic-data-visualisation/guide-to-cartography/map-layout
- https://docs.os.uk/more-than-maps/geographic-data-visualisation/guide-to-cartography/text-on-maps
- https://docs.os.uk/more-than-maps/geographic-data-visualisation/guide-to-cartography/north-arrows
- https://geography.wisc.edu/cartography/projects/resources/Design/Typefaces_Handout.pdf
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://colorbrewer2.org/
- https://tesselle.r-universe.dev/khroma/doc/tol.html
- https://graphiste.com/blog/impression-comment-utiliser-marges-fonds-perdus/
- https://www.oktopost.com/blog/instagram-grid-size-guide/
- https://atlas.lisn.upsaclay.fr/
- https://en.wikipedia.org/wiki/Rhenish_fan
- https://gdal.org/en/stable/drivers/vector/shapefile.html

**Dans le projet**
- `C:\Users\perie\Documents\6_Projectes\Lo_Ligam\app\src\lib\carta\colaEstelas.js` (ligne 322, source des courbes de niveau)
- `C:\Users\perie\Documents\6_Projectes\Lo_Ligam\app\src\lib\carta\colaDonadas.js` (ligne 51, crédit Occitanica sans lien vers une fiche précise)
- `C:\Users\perie\Documents\6_Projectes\Lo_Ligam\app\src\lib\components\CartaOccitania.svelte` (lignes 59 à 62, couche satellite 2020)
- `C:\Users\perie\Documents\6_Projectes\Lo_Ligam\charte-graphique.md` (lignes 69 à 78, Limelight pour le logo, Luciole sous CC BY 4.0)