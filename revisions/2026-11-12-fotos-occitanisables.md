# Photos à faire voir en occitan : inventaire et module (2026-11-12)

Demande de Romain (12-11) : parmi les 199 photos, que peut-on faire voir en occitan, avec une bascule français / occitan, un rendu très réaliste et le moins de modifications possible. Cela nourrit « Las carrièras » de S'imagina (rubrique 04, cahier §11 du 12-11 : « photomontages de plaques de rue en occitan »).

## Méthode de l'inventaire

Planches de 40 vignettes (5 planches), agrandissements des photos qui montrent du texte, puis OCR Windows français sur les 198 fichiers (56 avec du texte détecté). L'OCR rate beaucoup de texte réel : il ne sert que de recoupement, le classement vient de l'œil. Dossier : `Documents\6_Projectes\Lo_Ligam_hors-git\design-stock\Fotos\Bases_foto`.

## Ce qu'on peut occitaniser, par nature de texte

Difficulté de réalisme : 1 facile (texte plat, couleur franche) · 2 moyen · 3 difficile.

| Nature | Photos (fichier) | Texte français visible | Réalisme |
|---|---|---|---|
| **Plaques et panneaux de rue en français** | 20250319_192308 (Rue Pierre de Coubertin) · 20241128_164943 (Place Lucien Victor Meunier) · received_194856153699914 (Rue Louis Blanc, **fait**) · DSCF1926~2 (Impasse de Lou Pra, **fait**) · DSCF2263 (Rue des 4 Sergents de La Rochelle, plaque occitane déjà dessous) · PXL_20230521_104030960 (Rue de l'Escola, déjà mi-occitan) · PXL_20240617_100104101 (Centre historique) | RUE, PLACE, IMPASSE, noms | 1 |
| **Étiquettes de marché imprimées** | 20260301_122948 (olives : « Olives vertes Luquoises », prix, origine) | 6 étiquettes vertes, même mise en page | 2 |
| **Cartons et ardoises écrits à la main** | 20250507_153516 (« Asperges vertes Gironde 16 €/kg », « Asperges pourpres », ardoise « Légumes… Sud-Ouest ») | écriture au feutre | 3 (il faut une écriture manuscrite crédible) |
| **Enseignes de commerces** | DSCF1686 (Boulangerie, Pastisseria francesa, ardoise) · IMAG0301_1 (Patrimoine & Immobilier, Achat Vente Or Bijoux) · DSCF2058 (arrêt de bus) · DSCF1898 (caviste, déjà espagnol) | noms communs (Boulangerie → Fornariá…) ; les noms propres ne se traduisent pas | 3 (lettres lumineuses, relief) |
| **Inscriptions et affiches** | IMAG0302~2 (« Ne pas écrire sur les murs », pochoir et feutre rouge) · DSCF1606 (affiches collées) | consignes, avis | 2 à 3 |
| **Déjà en occitan, donc sens inverse** (la photo est la vérité, le français est le montage) | DSCF1753 (Plaça de Sant Roc, carreaux) · DSCF1872 (Carrièra de la Fabraria) · 20251226_134451 (Plan dau Sauvatge) · 20260912_184203 (Ostau dau País Marselhés) · DSCF1944, DSCF1945, DSCF1948 (Libraria Occitana) · PXL_20230501_132702203 (portal de la Sagnaria) · received_221816727548606 (L'Ostal dels Pichonets) · 20250125_135500 (logo Dordonha) · 20240913_153403 (CIRDÒC) | à garder tels quels ou à montrer en français | 1 à 2 |
| **Éléments qui ne sont pas du texte** | DSCF2319 (porte avec une croix occitane) ; drapeaux et façades de mairies à rechercher | ajouter la crotz occitana à côté d'un drapeau, sur une plaque, un fronton | 2 |
| **À ne pas toucher** | Latin du fronton (PXL_20230617_165347188, personnes reconnaissables) · Esquirol (nom de station identique) · toute photo écartée pour droit à l'image | | |

Le gros du matériau bien lisible est **la rue** : une dizaine de plaques et panneaux, plus les étiquettes de marché. Les enseignes et les écritures à la main demandent plus de travail pour un résultat moins sûr.

## Le module (fait, essai en ligne à `/ensag/fotos-oc`, pas indexé)

**Principe : la photo de base n'est jamais modifiée.** Pour chaque texte, un outil fabrique une petite **retouche** (WebP avec transparence) qui ne couvre que les pixels à changer : les anciennes lettres effacées (fond de la plaque reconstruit avec sa lumière et son grain) et les nouvelles lettres. Le site pose la retouche sur la photo en pourcentages ; la bascule français / occitan est un fondu de cette retouche (sans fondu avec « réduire les animations »). Une photo de base + quelques ko par texte : sobriété (impasse : 60 ko + 16 ko ; rue Louis Blanc : 57 ko + 33 ko).

Fabrication, par `outils/photos-oc/talhar.py` (Pillow et numpy seulement, rien à installer) à partir d'une fiche JSON (`outils/photos-oc/fotos/*.json`) :
1. les quatre coins de la plaque, relevés à l'œil sur une vue quadrillée ;
2. redressement de la plaque ; repérage des anciennes lettres par l'écart au fond (taches, rouille et écaillures laissées en place) ;
3. fond reconstruit (lumière de la plaque + grain mesuré alentour) ;
4. nouveau texte écrit dans la plaque redressée : même hauteur de lettres, même centre, même espacement relatif, même couleur, même flou de bord ; si le mot est plus long (« carrièra » pour « rue »), l'espacement se resserre d'abord, la taille ensuite, comme sur une vraie plaque ;
5. remise en perspective, lumière, grain ; seuls les pixels changés sont gardés.

Côté site : `app/src/lib/imagina/FotoOc.svelte` (photo + retouches, texte alternatif qui suit la langue choisie), `fotos-oc.js` (photos et textes), page d'essai `app/src/routes/ensag/fotos-oc/+page.svelte`. Construction (`npm run build`) vérifiée ; page regardée sur ordinateur et sur téléphone.

Ajouter une photo : relever les 4 coins (vue quadrillée), écrire la fiche, lancer `python.exe -X utf8 outils/photos-oc/talhar.py fiche.json --sortie <dossier>`, copier le WebP de base et les retouches dans `app/static/imagina/` et le JSON dans `app/src/lib/imagina/fotos/`. Paramètres de réglage par zone : `police`, `axes` (graisse, chasse), `flou_bord`, `ombre`, `ignorer` (zones à ne pas toucher), `cadre` (n'afficher qu'une partie de la photo).

## Poser quelque chose là où il n'y a rien (2e demande de Romain, 12-11)

Romain : aller aussi « sur des murs, des devantures de magasins », « même quand il n'y a pas d'affiche ou de pancarte, imaginer qu'il pourrait y en avoir une si ça s'insère bien », et « faire des propositions ».

L'outil sait maintenant **poser** (`"mode": "poser"` dans la fiche), en lisant la lumière sur la photo elle-même (couleur du mur donc de l'éclairage, ombres qui traversent la zone, grain) :
- `"modele": "plaque"` : un objet. Plaque blanche à filet rouge, du modèle des vraies plaques occitanes de Montpellier (voir 20251226_134451, « Plan dau Sauvatge »), avec le chant éclairé d'un côté, l'ombre portée de l'autre, une légère salissure. Sans le logo de la ville.
- `"modele": "peint"` : un lettrage peint à même le mur, comme une ancienne réclame : bandeau clair passé, lettres sombres usées par plaques, peinture absente dans les joints et les trous, relief de la pierre conservé.

**Perspective : mesurée, jamais dessinée** (Romain, 12-11, sur la première version : « la perspective n'est pas convaincante, ça fait vraiment pas réaliste » ; les coins étaient tracés à l'œil et les bords ne suivaient pas le mur). Méthode retenue, dans `talhar.py` (`plan_du_mur`) :
1. on désigne dans la fiche (`"plan"`) quelques arêtes vraiment horizontales et vraiment verticales du mur : cordon, ferrures et bords de volets, garde-corps ;
2. l'outil recale chaque segment sur l'arête réelle (écart moyen 0,2 à 0,5 pixel), en tire les deux points de fuite ;
3. avec la focale de l'appareil, lue dans la photo (27 mm pour le Pixel 5), il retrouve l'orientation du mur dans l'espace. Contrôle interne : l'angle entre horizontales et verticales mesurées doit valoir 90° (trouvé 88,4° et 89,5°) ;
4. l'élément est un vrai rectangle posé sur ce plan (`"ancre"`, `"largeur_px"`, `"proportion"` réelle largeur / hauteur), dessiné à ses proportions réelles puis projeté : c'est la projection qui l'écrase quand le mur est vu en biais (la plaque de 1,6 pour 1 apparaît plus haute que large sur le mur de la rue, vu presque en enfilade) ;
5. **preuve à regarder avant de fabriquer** : l'outil écrit `<clau>-<zone>-plan.jpg`, la photo avec une grille posée sur le plan du mur ; la grille doit suivre les assises de pierre et les fenêtres.
Les deux plaques remplacées gardent leurs quatre coins relevés sur la plaque elle-même (elle donne sa propre perspective).

**Réalisme, troisième passe** (Romain, 12-11 : « c'est mieux mais il faudra améliorer le réalisme de l'affiche et des plaques »). Ce qui a été ajouté, chaque point réglable dans la fiche :
- *plaque posée* : placée à l'angle du mur comme une vraie plaque de rue ; brillant de l'émail (plus clair vers le haut, reflet doux en travers, `degrade`, `reflet`) ; bord roulé plus sombre et chant éclairé (`bord_roule`, `relief`) ; ombre en deux couches, trait net au contact et pénombre large ; rouille et coulures sous les fixations, traînées de pluie, poussière au bas (`age`) ; couleur floutée davantage que le dessin, comme le fait un appareil photo (`flou_couleur`) ; même désaturation que la photo de base ;
- *lettrage peint* : chaque lettre un rien plus haute, plus large ou penchée que sa voisine (`gigue`) ; contours de pinceau, angles arrondis (`pinceau`, `rugosite`) ; tenue de la peinture différente d'une pierre à l'autre (`par_pierre`) ; badigeon au contour irrégulier. Deux polices comparées : l'égyptienne (Rockwell) s'empâte à cette taille, la grotesque (Bahnschrift) reste lisible : gardée ;
- *plaques remplacées* : capitales hautes et serrées comme sur les plaques anciennes (`chasse`, la police est resserrée, « CARRIÈRA » tient presque à pleine hauteur) ; rares éclats et nuances dans l'aplat (`usure_lettres`) ; liseré sombre au pied des lettres d'émail (`lisere`).
- **Leçon** : l'usure se dose très bas. Un premier réglage trop fort donnait des lettres tremblées de dessin animé ; une lettre d'émail reste nette, elle perd seulement ses angles vifs.

**Plaque posée : greffer une vraie plaque plutôt que la dessiner** (Romain, 12-11 : des quatre montages, « la plaque posée » restait le moins réaliste). Une plaque dessinée reste un dessin ; `"modele": "greffe"` part d'une vraie plaque prise sur une autre photo de Romain (20251226_134451, « Plan dau Sauvatge », le modèle des plaques occitanes de Montpellier) :
1. ses quatre bords sont recalés au dixième de pixel, la plaque est redressée ;
2. le **logo de la ville est retiré** (on ne signe pas un montage du nom de la Ville) : le coin opposé, retourné, le remplace, avec son vrai filet ;
3. le texte est changé dans la plaque elle-même (même outil que les plaques remplacées, police Constantia grasse resserrée, la troisième ligne d'origine effacée, les deux autres recentrées) ;
4. la plaque est posée sur le plan mesuré du mur ; on ne garde d'elle que ce qu'elle renvoie (son blanc photographié à l'ombre, bleuté, devient le blanc de référence), la lumière est celle du mur d'arrivée ;
5. **épaisseur** (`epaisseur`, fraction de la hauteur) : la dalle fait 2 à 3 cm ; sa face avant avance le long de la normale du mur et la tranche se voit du côté d'où l'on regarde (ici à droite, 7 pixels), calculée dans le même plan.
Contrôle : les trois autres montages, régénérés après ces changements de code, sont identiques à l'octet près.

**Lumière : mesurée elle aussi** (Romain, 13-11, sur la plaque greffée : « encore à améliorer »). Même leçon que pour la perspective : ne pas régler à l'œil, relever sur la photo. Trois mesures, trois réglages dans la fiche :
- *couleur de la lumière* (`neutre`) : la plaque sortait **bleutée** (212, 218, 228) alors que tout ce qui est au soleil sur cette photo est chaud (mur le plus clair 237, 228, 209 ; volets gris 210, 215, 210). La cause était une couleur de pierre supposée. On relève maintenant la couleur d'une chose neutre au soleil (ici les volets) : elle donne la teinte de la lumière, le mur n'en donne plus que la force. Blanc de la plaque après correction : 238, 236, 228 ;
- *direction du soleil* (`soleil`) : relevée sur l'ombre que le linteau et le jambage de la fenêtre projettent sur les volets, rapportée à la profondeur de l'embrasure : l'ombre glisse de 0,34 vers la droite et de 0,62 vers le bas par unité de profondeur. Avec l'épaisseur de la dalle, l'outil en tire l'ombre sur le mur (1 pixel à droite, 5 en bas), nette comme les ombres du lieu ;
- *teinte des ombres* (`ombre_teinte`) : rapport mesuré entre la pierre à l'ombre (embrasure, 119, 105, 81) et la pierre au soleil (211, 200, 178), soit 0,58 / 0,54 / 0,47 : ici les ombres sont brunes (lumière renvoyée par les murs d'en face), pas bleues. La tranche de la dalle, qui tourne le dos au soleil, prend cette teinte.

Deux propositions faites (sur la page d'essai, avec les deux remplacements) :

| Proposition | Photo | Où | Texte | Poids |
|---|---|---|---|---|
| Lettrage peint | PXL_20230614_190741072 (Montpellier, maison de pierre au soleil du soir) | grand pan de mur nu à droite des fenêtres du haut | FORNARIÁ (boulangerie, lo Congrès) | 177 ko + 49 ko |
| Plaque posée | PXL_20210726_161814537 (Montpellier, vue de la Canourgue vers la cathédrale Saint-Pierre), recadrée sur le mur de droite | mur au soleil, au-dessus de la fenêtre | Carrièra de SANT PÈIRE | 135 ko + 4 ko |

Les villes viennent des coordonnées inscrites dans les photos (lues sur l'ordinateur, rien n'est envoyé en ligne ; le site ne publie jamais ces coordonnées).

### Autres endroits repérés, à proposer ensuite

| Photo | Ville (parler) | Ce qui s'y insérerait bien |
|---|---|---|
| 20180103_140446 | Montpellier (languedocien) | ruelle étroite : plaque de rue à l'angle du mur de gauche, enseigne en drapeau |
| PXL_20230614_190743758 | Montpellier | placette aux bornes : plaque sur la maison de droite |
| 20251227_124942 | Montpellier (Peyrou) | panneau ou plaque de la promenade |
| DSCF2322 | Carcassonne (pas de coordonnées, reconnu à la Cité) | long mur à gauche : plaque ou lettrage peint |
| IMAG0301_1 | Toulouse | devantures (commerces réels, voir question ci-dessous) |
| 20250319_192308 · 20250512_174559 · 20241128_164943 · 20241129_113309 | Bordeaux (**gascon** : carrèra, pas carrièra) | plaques existantes, devantures |
| PXL_20220501_142117695 | Arles (**provençal**) | ruelle aux volets bleus : plaque, enseigne |
| DSCF1937 · DSCF1933 | Limoges (**limousin**) | rue à pans de bois ; façade de la gare |
| PXL_20240617_100104101 | Perpignan (**catalan**, hors domaine occitan) | à laisser |

Règle déjà posée (« noms dans leur dialecte ») : la forme écrite suit le parler du lieu ; hors Languedoc, chaque forme est à chercher dans la variété voulue.

### Devantures : une question à trancher avant d'en faire

Sur les photos, toutes les devantures lisibles sont celles de **commerces réels et reconnaissables** (Toulouse, Bordeaux, Limoges), ou hors du domaine occitan (la boulangerie DSCF1686). Réécrire l'enseigne d'un vrai commerce, même pour un mot commun (Boulangerie → Fornariá), engage ce commerce. Trois voies : ne toucher qu'aux mots communs ; ne travailler que sur des rideaux baissés et des façades sans enseigne (photos à prendre) ; ou demander l'accord du commerçant. Non fait tant que Romain n'a pas choisi.

## Changement de méthode : Romain dessine l'emplacement, l'IA fabrique ensuite (13-11)

Romain, sur la plaque posée (quatrième version) : « elle est floue et de toute façon mal placée. On va faire autrement. Sur les photos il faut que je puisse dessiner un emplacement avec ce que j'imagine (pharmacie, plaque de rue, pub...), et ensuite tu codes. » L'endroit et l'idée viennent donc de lui ; l'IA ne choisit plus où poser.

**Page `/admin/imaginar`** (atelier « Imaginar », groupe Contenu) : il choisit une photo parmi les 139 paysages en ligne (par thème), entoure l'endroit d'un geste (appuyer, glisser, relâcher ; souris, doigt ou stylet), choisit la nature (plaque de rue, enseigne de commerce, publicité ou affiche, lettrage peint, panneau, autre), écrit le texte qu'il imagine et une précision s'il veut, envoie. Plusieurs emplacements par photo ; ceux déjà envoyés restent tracés et numérotés, avec leur état.

**Aucune table nouvelle, aucune règle d'accès changée** : chaque emplacement est une note de Romain pour l'IA (Lo talhièr, table `remarcas`, même envoi que ses notes épinglées), donc relevée en début de séance par `node scripts/remarcas.mjs` dans « Demandes de Romain ». Format (`app/src/lib/imagina/emplacements.js`, testé) : `cibla` = `foto=<clau> zona=x0,y0,x1,y1 natura=<id>` (fractions de la photo), `extrait` = le texte imaginé, `tèxte` = la demande en clair. L'IA répond par `--tractar <id> --responsa "…"`, ce qui arrive dans « Per tu ».

Reste à faire côté IA quand une demande arrive : retrouver la zone dans la photo d'origine (les images en ligne sont réduites, certaines recadrées), mesurer le plan du mur et la lumière, fabriquer le montage. À régler aussi d'après son retour : **la netteté** (il a trouvé la plaque floue).

Contrôles du 13-11 : tracé, fiche, envoi et liste essayés à l'écran en simulation (`?edicion=simular`, rien n'est écrit) sur ordinateur, mise en page vue sur téléphone ; 1077 tests passent ; `npm run build` passe.

## La page couche la forme sur le mur et propose des styles (13-11, demande suivante)

Romain : « il faut que l'outil soit capable de mettre en place la bonne perspective et que je puisse choisir le style ».

- **Perspective calculée dans la page** (`app/src/lib/imagina/perspectiva.js`, testé) : les lignes du mur sont relevées dans la photo, puis la verticale, puis l'orientation du mur ; la forme tracée se couche sur le mur, avec une grille qu'on peut afficher. Quand les lignes manquent, le mur est pris de face et la page le dit. Réglage à la main : curseur « Tourner le mur », « Essayer une autre orientation », « Revenir au calcul ». La focale de chaque photo est dans `focales.json` (127 photos sur 139 ; seulement la focale et le centre optique, ni lieu, ni date, ni appareil).
- **Styles** (`estils.js`, testé) : dix styles et « Autre style », proposés selon la nature choisie ; chacun dit par quelle voie il se fabrique (vraie plaque reprise, plaque dessinée, lettres peintes). L'aperçu (`Mostra.svelte`) est une esquisse à plat : couleurs, lettre, liseré. La lumière et le grain viennent à la fabrication.
- **Format de la demande**, complété : `cibla` = `foto=<clau> zona=… natura=<id> estil=<id> quad=x,y,x,y,x,y,x,y` (les quatre coins de la forme couchée, en fractions de la photo). Les demandes anciennes, sans style ni coins, se lisent toujours.
- **Couleurs** (règle Colors du 13-11) : la page ne se sert que des variables du site, sans valeur de secours écrite en dur. Deux exceptions voulues, hors palette comme les dessins : les repères posés sur la photo (grille, contours, poignées) restent en blanc et noir neutres, pour se lire sur n'importe quelle photo ; les couleurs d'objet de `estils.js` et la pierre sous les échantillons décrivent un objet, pas l'interface. À confirmer par L'amic.
- **Laboratòri** : `/ensag/fotos-oc` est déclaré dans `app/src/lib/labo/registre-essais.js` (choix `photos`, 14 essais, test à jour).
- **Contrôles du 13-11 au soir**, après fusion de `origin/master` : 1190 tests passent, `npm run build` passe, les deux pages regardées en capture à 1830 px et à 390 px (rien ne déborde), bascule « En occitan » vue sur les quatre montages, `app/static/imagina` inchangé à 524 Ko.
- **Pas encore fait** : la fabrication à partir des coins envoyés par la page n'a pas été exercée de bout en bout (`talhar.py` part encore de coins relevés à la main) ; 12 photos sans focale connue (valeur par défaut) ; le relevé des lignes tourne dans la page elle-même, sa durée n'a pas été mesurée sur un vrai téléphone ; l'envoi réel n'a été essayé qu'en simulation (aucune écriture en base).

## Limites constatées (honnêtes)

- Réalisme **bon sur les plaques et panneaux plats** (couleur franche, typographie simple), **pas encore au niveau « indiscernable »** : les lettres neuves sont un peu plus nettes et plus propres que des lettres vieillies (pas de relief d'émail, pas d'écaille sur la lettre). Améliorable par plaque : relief et reflet sur les lettres, usure, police plus proche.
- La police est choisie à la main parmi celles de la machine (DIN pour le panneau beige, slab pour la plaque bleue). Pour les plaques de toute une ville, il faudrait relever la police de chaque modèle de plaque (Toulouse, Montpellier…).
- Les quatre coins sont relevés à l'œil : ~10 minutes par plaque. Une détection automatique des coins demanderait OpenCV (à installer sur ordinateur par Romain) ; non fait.
- Mots longs ou accents : testé sur « CARRIÈRA » (accent grave, déborde en hauteur) : correct.
- **Écriture à la main (cartons de marché)** et **enseignes lumineuses** : non traités.
- **Plaque posée** : crédible à la taille de la page, encore un peu « neuve » vue de très près (pas de vis, pas de reflet). Le **lettrage peint** est le plus convaincant des quatre, parce que l'usure et la pierre font le travail.
- **Un nom de rue ne s'invente pas** : « Carrièra de Sant Pèire » suppose que la rue qui descend vers la cathédrale est bien la rue Saint-Pierre ; à confirmer par Romain, comme la forme « Pèire » (nom propre, absent du Basic). Pour chaque plaque posée, il faut le vrai nom de la rue.
- Le lettrage peint pèse plus lourd (49 ko) parce que la retouche emporte le grain de la pierre ; à alléger si la page en montre beaucoup.

## Garde-fous (à valider avec Romain)

- Tout montage est annoncé comme montage (« Montatge : sus la fòto d'origina, lo tèxte es en francés ») et la photo d'origine reste à un clic (bouton « Fòto d'origina »).
- Les formes occitanes viennent de lo Congrès (carrièra, prat, òrba, androna vérifiés le 12-11 ; « Dels Nobles » vient de la plaque ovale déjà posée sur la photo). **À valider par Romain** : « Androna de Lo Prat » (la plaque d'origine écrit « Lou Pra », graphie non classique du Périgord) et le texte « Montatge… ».
- Revérifiés avec lo Congrès le 13-11 : fòto, origina, montatge, paret, nuda, tèxte, fornariá, carrièra, sant, androna, prat, nòble, imaginar. « francés » est absent du Basic (comme les autres noms de langue) mais déjà employé dans les textes publiés du site.
- Pas de photo où l'on reconnaît quelqu'un ; ne jamais montrer un montage comme une vraie plaque posée.
