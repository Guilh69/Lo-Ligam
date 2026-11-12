# Session A « Carte » : audit du 2026-11-12 (modèle Fable)

## Ce qui est fait

- **1 grave corrigé, 1 moyen corrigé au passage, poussés sur master** : commit `c0c4338f` (puis fusion `332aaea5`, `1be93e0f..332aaea5`).
- Fichiers touchés : `SIG/cadena/comunas-noms.mjs`, `app/static/data/comunas/noms.json` (régénéré : 200 entrées passent de `0` à `null`, rien d'autre), `app/src/lib/components/CartaOccitania.svelte` (16 lignes).
- Vérifié : `npm run build` code 0 et `npm test` 34 fichiers, 1 047 tests passés, avant et après la fusion de master ; captures avant et après, bureau 1830 px et téléphone 390 × 844.
- Aucune écriture en base. `PILOTATGE.md`, `cahier-des-charges.md` et les fichiers de la session B non touchés. `.claude/launch.json` rétabli.
- Captures et scripts : dossier `A-carte-captures` à côté de cette note.

## Grave

### G1. Des communes écrites en français au milieu des noms occitans (corrigé)

- Constat : sur le satellite, 200 communes du domaine sans forme occitane connue étaient écrites avec leur nom français (ou italien), dans la même police que les noms occitans : Saint-Rambert-d'Albon, Saint-Sorlin-en-Valloire, Châteauneuf-de-Galaure, Anneyron, Hauterives, Épinouze… Contraire à la règle du 2026-10-10 (« quand tu ne sais pas, tu effaces », jamais le français à la place).
- Cause : `noms.json` codait par `0` à la fois « même nom qu'en français » (817 communes : Pau, Albi, Agen…) et « forme inconnue » (200) ; `estilNom` affichait alors `c.oc || c.fr` (`CartaOccitania.svelte`, ancienne ligne 1225).
- Preuve avant : `A-carte-captures/pc-5-sat-5km-drome-nord.png`. Après : `pc-apres-oc-drome-nord.png` (bureau), `tel-apres-oc2-drome-nord.png` (téléphone), `pc-apres-fr-drome-nord.png` (interface française : le nom français reste, seul).
- Correction : l'index distingue `0` (identique) et `null` (inconnue) ; en interface occitane (et es, en, ca, ar, qui gardent les noms occitans) la carte n'écrit plus ces communes ; en interface française le nom français reste. La recherche trouve toujours la commune par son nom français.
- Répartition des 200 : Italie 83, Pyrénées-Atlantiques 32 (Soule et bordure basque), Drôme 19, Haute-Loire 19, Hautes-Alpes 13, Puy-de-Dôme 10, Ardèche 6, Isère 5, Charente 3, Allier 3, puis 1 chacun (12, 32, 33, 36, 46, 47, 09).
- **Conséquence à dire à Romain** : 83 des 94 communes des vallées occitanes d'Italie n'ont plus de nom en interface occitane (elles portaient leur nom italien : Entracque, Limone Piemonte, Vinadio…). C'est la règle, mais la zone est maintenant presque muette de près. Voir la question 2.
- Limite connue : le survol et le clic d'une commune (couche Comunas, `colaTematica.js:655` ; puce de sélection, `CartaOccitania.svelte:1363`) montrent encore le nom français quand il n'y a pas de forme occitane : il faut bien un nom pour désigner ce qu'on a cliqué. Non modifié.

## Moyen

### M1. Source des noms de communes absente du panneau « Fonts » (corrigé dans le même commit)

- Les noms de communes du satellite viennent de l'IGN (Admin Express), d'OpenStreetMap et de l'IEO (BdTopoc, licence ODbL) ; leur mention n'entrait dans « Fonts » que si la couche Comunas était allumée. Vérifié dans la page avant correction (aucune mention « BdTopoc » ni « Admin Express » parmi les crédits), puis après (mention présente, bureau et téléphone). Une ligne ajoutée dans `cargarNomsComunas`.

### M2. « Vilanuèva d'Oùt » : faute d'accent visible dès 30 km (corrigé par la session C, `51b6eed8`)

- **Mise à jour du 12-11, 20 h 45** : corrigé et poussé par la session C (`51b6eed8`, les quatre occurrences). La session A, relancée par un « go » dans sa propre conversation, avait fait la même correction en parallèle ; elle a retiré son doublon avant de pousser et n'a ajouté que la ligne 293 de `SIG/vilas/toponimia-comparason.csv` (colonne « nom de la carte »), commit `215f13d0`, fusion `9882a517`. Aucun script ne lit cette table. Vérifié à l'écran sur la copie de A avant la fusion : `A-carte-captures/vilanueva-30km-oc.png`, `vilanueva-30km-fr.png` (« Villeneuve-sur-Lot » avec « Vilanuèva d'Òut » dessous), `vilanueva-5km-oc.png` (satellite). Restent deux mentions volontaires de l'ancienne graphie : la colonne BdTopoc de la table (c'est la source de la coquille) et `app/static/esbos-nuech.html` (vieille esquisse, retirée à la construction).
- Texte d'origine du constat :

- La carte écrit « Vilanuèva d'Oùt » ; la norme classique n'a pas de « ù ». L'API de toponymie de lo Congrès donne « Vilanuèva d'Òut » (`node scripts/verificar-oc.mjs --topo 47323`), et l'index des communes aussi.
- Visible sur `A-carte-captures/pc-2-30km.png` et `pc-3-30km-basc-gascon.png`.
- Quatre occurrences à changer ensemble (sinon le lien étoile ↔ commune casse) : `app/src/lib/acuelh/carta-estelas.js` lignes 10 et 108 (territoire de la session B), `app/src/lib/carta/nomsFrances.js:66`, `app/static/data/toponims-oc.geojson`. À faire par la session cheffe ou la session C une fois B terminée : remplacement exact de `Vilanuèva d'Oùt` par `Vilanuèva d'Òut`, puis `npm test`.

### M3. Une quinzaine de « noms occitans » qui sont du français à peine retouché (donnée de référence : question 1)

- Dans `app/static/data/comunas/07.json` surtout (noms venus d'OpenStreetMap) : Charmes sur Rhône, Sant Georges les Bains, Sant Julien en Sant Alban, Sant Symphorien sous Chaumeirac, Sant Fortunat sur Eyrieux, Sant Michel de Chabrillanoux, Châteauneuf de Vernoux, Sant Cierge sous le Cheylard, Sant Maurice en Chalencon, Sant Barthélemy le Meil, Gilhac et Bruzac, Lachapelle sous Chanéac, Sant Julien le Roux. Ailleurs : Sant Paul des Monestier (38), Moët pour Mouhet (36), Saint-Angeau pour Val-de-Bonnieure (16), La Motte-de-Galaure pour Saint-Jean-de-Galaure (26, visible sur `tel-apres-oc2-drome-nord.png`).
- Ils s'affichent comme des noms occitans. La correction passe par la chaîne `SIG/cadena/comunas.mjs` (donnée de référence), pas par l'application.

### M4. Cinq noms occitans posés sur la mauvaise commune voisine (donnée de référence : question 1)

- Même nom occitan pour deux communes proches, dont une à tort : Ambès (33) écrit « Ambarés e La Grava » ; Gouzon (23) écrit « La Cela de Gosom » ; Pommiers (30) écrit « Sant Laurenç del Minier » ; Mussidan (24) écrit « Sent Mierd de Moissídan » dans l'index (masqué à l'écran par le nom de l'étoile, « Moissídan ») ; La Roche-sur-le-Buis et La Rochette-du-Buis (26) toutes deux « La Ròcha dau Bois ». Laàs (64) est écrit « Lars » alors que lo Congrès donne « Laàs ». En revanche Saint-Laurent-du-Bois = « Sent Laurenç dau Plan » est confirmé par lo Congrès (code 33427) : pas une erreur.
- Script de contrôle : `A-carte-captures/audit1.mjs` (bloc A5).

### M5. Téléphone, première visite : le guide couvre le nord du domaine

- Le panneau « Primièrs passes » (ouvert d'office à la première visite) recouvre Limòtges, Clarmont-Ferrand et Valença : `A-carte-captures/tel-0-arrivee.png`. Le cadrage d'arrivée (`vistaOccitana`, `CartaOccitania.svelte:2554` avant correction) ne compte pas ce panneau dans l'espace occupé. Choix de mise en page : question 3.

### M6. Populations absentes

- Les 94 communes d'Italie ont une population de 0 dans `noms.json` : leur nom n'arrive qu'au plus près (seuil 0 à partir du zoom 12,5, `popNoms`, `CartaOccitania.svelte:1190`).
- 1 121 communes des langues voisines sans population dans `noms-lengas.json` (alsacien 783, oïl 156, francique 90, flamand 68, corse 24 : les parties hors de France), traitées comme 1 000 habitants (`pop ?? 1000`). Apparition arbitraire par rapport à la règle « même paquet pour toute zone ».

## Mineur (listé, non corrigé)

1. Communes présentes dans les deux couches de noms : 42, toutes en zone mixte gascon et basque (Baiona à 0,96 km de Baiona, Bokale et Lo Bocau, Gixune et Guishe…). Basque allumé et de très près, le même nom peut s'écrire deux fois. **Non vérifié à l'écran** : l'interrupteur du basque n'a pas pu être actionné par script.
2. Graphies différentes entre la carte étoilée et l'index des communes : Frontinhan / Frontihan (coquille de l'index), Ieras / Ièra, Lo Puèi de Velai / Lo Puèg de Velai, Gerzac / Jarzat, Nuòu Vic / Nuòuvic, Al Buga / Albuga, Perigüers / Periguers, Cáors / Caors, Mauguòu / Melguer, Rodés / Rodès. À l'écran la carte garde le nom de l'étoile (`vilaCarta`), donc pas de contradiction visible ; la recherche connaît les deux formes.
3. Cinq seuils en zoom brut, hors de la grille `escalas.js`, donc non décalés sur téléphone : parcs `z >= 5.25` (`colaTematica.js:585`), altitudes `z >= 10` (`colaTematica.js:1300`), locuteurs `> 10.75` (`colaDonadas.js:592`), `zoom-mond < 4.6` (`CartaOccitania.svelte:1670`), `z < 9.8` (`CartaOccitania.svelte:1162`). Les seuils de densité des étiquettes (`popNoms`, `popNomsFr`, `popMin`) sont en zoom brut par règle : rien à dire.
4. Code mort : `kmBarra` (`escalas.js:52`) et `lengaDeKod` (`lengas.js:442`), jamais appelés. Exports inutiles (utilisés seulement dans leur fichier) : `ESCALA_PX`, `CRANS`, `PAS_ZOOM`, `LAT_REF`, `zÈscala`, `JACES_PONCHS`, `camiFranca`, `SOTA_TER`.
5. `npm run check` : un seul avertissement pour la carte (`nomsComunas` non réactif, `CartaOccitania.svelte:1109`, lu dans le gabarit vers la ligne 2740 ; sans effet constaté). Aucun CSS mort signalé dans `CartaOccitania.svelte`. Les 7 515 « erreurs » du rapport sont du typage implicite (projet non typé), pas des défauts.
6. Fichiers de données sans champ `font` : `corbas-nivel.json`, `departements.geojson`, `franca.json`, `lengas-vesinas.json`, `toponims-oc.geojson`. Les trois premiers et les noms sont crédités par la couche étoilée (`colaEstelas.js:703`) ; `departements.geojson` : crédit non vérifié.
7. Doublon dans `noms-lengas.json` : « Waliswiu » deux fois à 1,3 km (alsacien).
8. Interface française : la famille « Lenga nòstra » reste en occitan à côté de « Territoire », « Culture » (voulu ?) ; sur téléphone le titre du guide est coupé (« Allumer une cou… »).
9. Mémoire : 60 canevas de 300 × 150 jamais dimensionnés à l'arrivée (une dizaine de Mo).

## Vérifié, rien à signaler

- 70 km et 30 km sur bureau (`pc-1-70km.png`, `pc-2-30km.png`, `pc-3-30km-basc-gascon.png`) : pas de nom en double, pas de trou visible dans le domaine, côte et limite cohérentes.
- Pau sans nom sur `pc-3-30km-basc-gascon.png` : faux positif. C'est l'état transitoire 5 s après un saut de carte par script ; à 9 s le nom est là (`pau-30km-guide-ferme.png`, `visNom` vrai à 50, 40, 30 et 20 km).
- Seuils téléphone et ordinateur : la grille est bien relative à l'écran (`fixarEcran`) ; le téléphone à 200 km de barre montre ce que l'ordinateur montre à 70 km (`tel-0-arrivee.png` contre `pc-1-70km.png`).
- Mémoire des canevas, vue 390 × 844, densité 3 : 96 Mo à l'arrivée, 106 Mo à 100 km, 114 Mo au satellite (méthode du 2026-10-19, crochet posé avant la page ; référence du cahier : 315 Mo avec cinq langues, **non remesuré avec cinq langues**). Mode développement, Firefox sans fenêtre.
- Sources au survol : les 9 fiches de `fichas-lengas.js` ont toutes leur source pour la famille, les dialectes et les locuteurs quand le chiffre existe.
- `toponims-oc.geojson` : aucun doublon.

## Questions pour Romain (une à la fois)

1. Les noms faux ou mal placés de M3 et M4 (une vingtaine) : (a) les masquer tout de suite par une liste d'exclusion dans la chaîne `SIG/cadena/comunas.mjs`, comme les communes sans forme connue ; (b) chercher la forme attestée une par une (chantier de données, modèle moins coûteux) ; (c) laisser pour l'instant.
2. Vallées occitanes d'Italie : 83 communes sans forme occitane, maintenant sans nom en interface occitane. (a) Chantier de données pour trouver les formes attestées et les populations ; (b) laisser muet ; (c) réafficher le nom italien en attendant (contraire à la règle).
3. Guide « Primièrs passes » sur téléphone : (a) le replier d'office à la première visite (une ligne) ; (b) cadrer l'Occitanie sous le guide ; (c) laisser.

## À consigner

- **Cahier §11, 2026-11-12** : « Carte : la règle "sans forme occitane connue, on masque" appliquée aux noms de communes du satellite. `noms.json` distingue `0` (même nom qu'en français) et `null` (forme inconnue, 200 communes dont 83 en Italie) ; l'interface occitane ne les écrit plus, l'interface française garde le nom français, la recherche les trouve toujours. La source des noms (IGN, OSM, IEO BdTopoc) est créditée dès qu'ils s'affichent. »
- **PILOTATGE, chantier 36** : audit carte fait ; restent M2 (une faute d'accent, quatre occurrences), M3 à M6 en attente des réponses de Romain.

## Fallait-il Fable ?

- Non pour l'essentiel du relevé : le contrôle croisé des fichiers de noms (`audit1.mjs`), `npm run check`, les captures et la mesure de mémoire sont du travail de script, qu'un modèle moins coûteux aurait fait aussi bien avec la même consigne.
- Oui pour deux choses : relier le constat de données à la règle déjà fixée et choisir le bon niveau de correction (index dérivé et affichage, sans toucher à la donnée de référence ni découper le composant) ; écarter un faux positif (Pau) par une sonde plutôt que de « corriger » le placement des noms.
- M3, M4, M6 et la question 2 sont des chantiers de données : hors Fable.
- Coût évitable de cette session : le panneau Browser n'était ouvert dans aucune fenêtre, il a fallu écrire un pilote Firefox sans fenêtre (`A-carte-captures/bidi.mjs`, réutilisable : scénario en paramètre, capture entière ou découpée). À ranger dans `outils/` si la session cheffe le juge utile.

---

# Complément du 12-11 au soir : langues voisines, couches thématiques, thème clair, fonds, téléphone

Demandé par Romain (« Oui, complète ») après le premier bilan, qui ne couvrait que la vue de base et les noms au satellite.

## Ce qui est fait

- **Un deuxième défaut grave corrigé et poussé** : commit `85a3b68f` (fusion `579eb1e6`), un seul fichier, `app/src/lib/carta/colaLenga.js` (24 lignes ajoutées, 1 retirée). Tests : 1 067 passés ; construction : code 0, avant et après fusion.
- Contrôles par script : `A-carte-captures/audit2.mjs` (langues voisines) et `audit3.mjs` (couches thématiques). Captures : scénario `sc8.mjs`.

## Grave

### G2. Le nom d'une langue voisine sortait coupé (corrigé)

- Constat : en « partie française seule » (réglage par défaut), vu de loin (150 km et plus), le nom de la langue était coupé par la frontière ou la côte : « ORSU » sur la Corse, « RA » pour EUSKARA, « ELSÄSS », « PLA », « ARPETA », rien pour le catalan. Preuves avant : `pc-N1-cors-150km.png`, `pc-N3-basc-150km.png`, `pc-N4-alsacian-150km.png`, `pc-L6-nou-lengas-300km.png`. Même défaut, plus léger, pour un nom de dialecte à cheval sur la frontière (« BRÊSSAN-JURASSIE », `pc-L4-oil-70km.png`).
- Cause : le nom est placé pour tout le domaine de la langue, puis tout le dessin est découpé par le contour de la France (`retalharFranca`, `franca.js`).
- Correction : la règle déjà écrite dans le code pour les noms qui se gênent (« se fa pus pichon, o s'escafa »). Un nom s'écrit entier dans ce que la couche montre, à l'une de ses places possibles, ou ne s'écrit pas (`_entièrFr`). Le mode « toute la langue » n'est pas touché. Preuves après : `pc-A1-cors-150km.png` (plus de nom coupé), `pc-A5-nou-lengas-300km.png` (ELSÄSSISCH entier en mode toute la langue, plus aucun nom coupé), `pc-A6-oil-arpitan-70km.png`.
- **Conséquence à dire à Romain** : de loin, en partie française seule, le corse, le basque, l'alsacien, le platt, le catalan et le flamand n'ont plus de nom sur la carte (au lieu d'un nom coupé). Voir la question 6.

## Moyen

### M7. Fonds « Occitan » et « Natural » presque illisibles sous la teinte du domaine

- À 30 km, la teinte pleine du domaine occitan couvre le fond de carte : on ne lit ni les noms ni le relief (`pc-F1-fons-2-30km.png` pour « Occitan », `pc-F2-fons-natural-30km.png` pour « Natural »). Hors du domaine le fond se lit normalement. Choix de dessin : question 4.

### M8. Mémoire sur ordinateur : elle monte avec le nombre de langues

- Fenêtre 1830 × 1000, densité 1, mode développement : 130 Mo de base, environ 85 Mo de plus par langue, 472 Mo avec cinq langues, 773 Mo avec neuf. La mémoire suit le nombre de pixels : sur un écran à haute densité (plafond 2), compter jusqu'à quatre fois plus. Le téléphone, lui, reste dans la règle du 19-10 : 96 Mo de base, **289 Mo avec cinq langues** (référence 315 Mo).

### M9. Téléphone, plusieurs langues allumées : noms de villes sur les noms de pays

- Vue France, cinq langues : « Lile » et « Valincyinne » sur « BELGICA », « B'sançon » sur « SOÏSSA », une trentaine de noms de villes serrés (`tel-tel5-cinq-lengas-pres.png`).

### M10. Licence de la couche « Las votz d'Occitània » à trancher avant diffusion

- Les enregistrements viennent de l'Atlas sonore du LISN, sous licence CC BY-NC-SA (pas d'usage commercial). Le catalogue note que la couche est en ligne « en démonstration » par décision du 2026-10-12, valable tant que le site n'est pas ouvert au public (`catalogue.js:60`). Le site va être diffusé et vend des cours : question 5.

## Mineur (listé)

1. Provinces, noms des rivières, massifs et parcs allumés ensemble : quelques noms se chevauchent (« Peiregòrd » et « Dordonha », « Daufinat » et « Valença », `pc-T3-provincias-parcs-massis-rius-70km.png`). Les provinces seules sont propres (`pc-P1-provincias-solas-70km.png`).
2. Thème clair avec le fond satellite vu de loin : bandes blanches là où les photos manquent (à l'ouest de 5,2° O, `pc-C2-clar-dialectes-70km.png`).
3. Deux petits jours entre le domaine occitan et ses dialectes (un point de grille chacun, moins de 20 km²), vers 45,07 N 5,61 E et 45,32 N 4,84 E.
4. Trois villes posées juste hors de leur domaine par la précision de la côte ou du lac : Mataró, Benidorm (catalan), Évian (arpitan). Sept communes nommées juste hors du domaine de leur langue (breton 3, basque 3, catalan 1).
5. Le nom « CHAMPAIGNAT » passe en partie sous la barre de recherche à 70 km (`pc-L4-oil-70km.png`).
6. Fluidité : non concluante. En mode développement et sans carte graphique, un zoom animé donne 28 images par seconde sur ordinateur, 16 sur la vue téléphone, 13 avec cinq langues et un blocage de 0,85 s au départ. À mesurer sur un vrai téléphone, site construit.
7. Le point 1 des mineurs du premier bilan (double « Baiona ») est levé : basque allumé, à 7 km, aucun nom en double (`pc-L2b-basc-baiona-7km.png`).

## Vérifié, rien à signaler

- **Pas de trou entre les langues** : grille de 28 761 points sur la France (pas de 4,4 km), 35 points sans langue, tous de l'eau (étang de Berre), de la côte ou la zone mixte de la Roya (décision du 2026-10-07) ; aucun point dans deux langues à la fois.
- Jointures vues à l'écran : occitan et catalan (`pc-L1-catalan-40km.png`), basque (`pc-L2b`), arpitan (`pc-L3-arpitan-50km.png`), oïl (`pc-L4-oil-70km.png`).
- Dialectes : 100 % de chaque langue couvert ; toutes les étiquettes de dialecte dans leur zone ; les 980 villes des langues voisines et les 305 villes occitanes sont dans le dialecte annoncé (0 écart) ; aucun doublon de ville.
- Couches thématiques : Calandretas 66, enseignement 970, cercles 983, parcs 47, provinces 51 : aucun doublon, aucun point hors du domaine (sauf dix cercles de villes côtières, précision de la côte), noms occitans des communes des cercles identiques à l'index des communes.
- Relief : 41 noms sans forme occitane, bien masqués en interface occitane (`colaTematica.js:989`).
- Lisibilité : dialectes, départements, écoles et cercles ensemble à 70 km (`pc-T1-dialectes-dep-calandretas-cercles-70km.png`).
- Thème clair sur le fond par défaut : propre (`pc-C3-clar-contorns-70km.png`).

## Non contrôlé

- Couches « Locutors », « Las votz », « Luòcs d'interès », « Librariás », « Comunas » : allumées mais pas regardées une à une.
- Chaque langue voisine de près (ses noms de communes, sa fiche) : contrôle par script seulement, sauf le basque.
- Fluidité réelle et mémoire sur un vrai téléphone.

## Questions pour Romain, suite (une à la fois)

4. Fonds « Occitan » et « Natural » : (a) alléger la teinte du domaine quand un de ces fonds est choisi ; (b) laisser, la teinte s'efface de près ; (c) retirer ces deux fonds avant diffusion.
5. « Las votz d'Occitània » (licence sans usage commercial, LISN sans réponse) : (a) éteindre la couche à la diffusion tant qu'il n'y a pas d'accord ; (b) relancer le LISN et garder en attendant ; (c) garder telle quelle.
6. Petites langues vues de loin en partie française seule : (a) laisser sans nom (état actuel) ; (b) leur donner un nom propre à la partie française, écrit à côté de la zone ; (c) les montrer d'office dans tout leur domaine de loin.

## À consigner, suite

- **Cahier §11, 2026-11-12** : « Langues voisines : un nom de langue ou de dialecte s'écrit entier dans ce que la couche montre, ou ne s'écrit pas (plus de nom coupé par la frontière en partie française seule). »
- **PILOTATGE, chantier 36** : complément fait ; restent M7 à M10 et les questions 4 à 6.

---

# Masquage des noms faux ou mal placés (M3 et M4), 12-11 au soir

Décision de Romain relayée par la session cheffe : « Masque-les » (option a de la question 1).

## Ce qui est fait

- **Commit `31a702e7`, fusion `f2515721`, poussé sur master** (`cde5e294..f2515721`). Tests : 1 070 passés ; construction : code 0, avant et après fusion.
- **24 communes** traitées comme sans forme occitane connue : pas de nom en interface occitane, nom français en interface française, toujours trouvables par la recherche. Rien n'est mis à la place.
- La liste vit dans `SIG/comunas/noms-escartats.csv` (code, nom français, nom écarté, motif). La chaîne `SIG/cadena/comunas.mjs` la lit à l'étape 4 (une relance complète donnera le même résultat) ; `SIG/cadena/comunas-escartar.mjs` l'applique aux fichiers déjà fabriqués, sans rien retélécharger ; puis `SIG/cadena/comunas-noms.mjs` refait l'index.
- Contrôle du diff : dans les dix fichiers de contours touchés (07, 16, 23, 24, 26, 30, 33, 36, 38, 64), seule la propriété `oc` de ces 24 communes disparaît (arcs, géométries et autres propriétés identiques) ; dans `noms.json`, 24 entrées passent à `null` et rien d'autre (224 `null` au total). Aucune autre couche ne portait ces noms (cercles : aucun dans ces communes).
- Captures, vallée de l'Eyrieux à 2 km : `A-carte-captures/ardecha-avant.png` et `ardecha-apres.png` (les dix noms faux de la vue ont disparu, les autres sont intacts). `ardecha-apres-fr.png` : interface française ; à cette échelle elle ne montre que les communes de plus de 1 500 habitants, aucune des communes masquées n'est dans le cadre. Le nom français seul pour une commune sans forme occitane a été prouvé sur `pc-apres-fr-drome-nord.png`.

## Liste exacte des 24 communes masquées

Français à peine retouché (17) :

| Code | Commune | Nom écarté |
|---|---|---|
| 07055 | Charmes-sur-Rhône | Charmes sur Rhône |
| 07060 | Châteauneuf-de-Vernoux | Châteauneuf de Vernoux |
| 07094 | Gilhac-et-Bruzac | Gilhac et Bruzac |
| 07123 | Lachapelle-sous-Chanéac | Lachapelle sous Chanéac |
| 07215 | Saint-Barthélemy-le-Meil | Sant Barthélemy le Meil |
| 07222 | Saint-Cierge-sous-le-Cheylard | Sant Cierge sous le Cheylard |
| 07237 | Saint-Fortunat-sur-Eyrieux | Sant Fortunat sur Eyrieux |
| 07240 | Saint-Georges-les-Bains | Sant Georges les Bains |
| 07255 | Saint-Julien-en-Saint-Alban | Sant Julien en Sant Alban |
| 07257 | Saint-Julien-le-Roux | Sant Julien le Roux |
| 07274 | Saint-Maurice-en-Chalencon | Sant Maurice en Chalencon |
| 07278 | Saint-Michel-de-Chabrillanoux | Sant Michel de Chabrillanoux |
| 07298 | Saint-Symphorien-sous-Chomérac | Sant Symphorien sous Chaumeirac |
| 16300 | Val-de-Bonnieure | Saint-Angeau |
| 26216 | Saint-Jean-de-Galaure | La Motte-de-Galaure |
| 36134 | Mouhet | Moët |
| 38438 | Saint-Paul-lès-Monestier | Sant Paul des Monestier |

Nom d'une commune voisine (5) :

| Code | Commune | Nom écarté | La commune qui garde ce nom |
|---|---|---|---|
| 23093 | Gouzon | La Cela de Gosom | La Celle-sous-Gouzon (déduit du sens) |
| 24299 | Mussidan | Sent Mierd de Moissídan | Saint-Médard-de-Mussidan (déduit du sens) ; à l'écran Mussidan garde « Moissídan », le nom de la ville sur la carte |
| 26279 | La Rochette-du-Buis | La Ròcha dau Bois | La Roche-sur-le-Buis (déduit du sens : « La Ròcha » ; non confirmé par une source) |
| 30199 | Pommiers | Sant Laurenç del Minier | Saint-Laurent-le-Minier (déduit du sens) |
| 33004 | Ambès | Ambarés e La Grava | Ambarès-et-Lagrave (vérifié : lo Congrès, code 33003) |

Nom que lo Congrès ne confirme pas (2) :

| Code | Commune | Nom écarté | Vérifié |
|---|---|---|---|
| 64287 | Laàs | Lars | lo Congrès donne une autre forme (code 64287) |
| 64286 | Laà-Mondrans | Lars | lo Congrès donne une autre forme (code 64286) ; cette commune n'était pas nommée en toutes lettres dans M4, elle est l'autre moitié de la même paire « Lars » |

Gardé comme demandé : « Sent Laurenç dau Plan » (confirmé par lo Congrès).

## À savoir

- `SIG/comunas/noms-a-validar.csv` (sortie de la chaîne complète) n'a pas été régénéré : la chaîne a besoin des données brutes, absentes de la copie de travail. À la prochaine relance complète, ces 24 lignes y apparaîtront avec le motif « escartat ».
- Vu sur la capture de l'Ardèche, hors périmètre, pour le futur chantier de données : d'autres noms à demi français dans le même département (« Sant Jean Roure », « Sant Jean Chambre », « Sant Apollinaire de Rias », « Sant Vincent de Durfort », « Sant Genest Lachamp »). Non touchés.
- À consigner au cahier §11 : « Carte, 2026-11-12 : 24 noms de communes faux ou mal placés masqués (liste `SIG/comunas/noms-escartats.csv`) ; la forme attestée sera cherchée plus tard, sur un modèle moins coûteux. »
