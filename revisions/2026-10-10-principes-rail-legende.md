# Rail et légende de la carte : principes reconnus et proposition

Demande de Romain, 2026-10-10 : « se recentrer sur des principes reconnus par les designers, ce qui est le plus lisible : les blancs, l'organisation, la logique de navigation entre les étapes ». Direction déjà choisie : l'atelier du cartographe (la légende est l'interface), touche méditerranéenne sobre, panneau légèrement transparent. Rien n'est codé ici : c'est la base de décision.

## 1. Ce que disent les références

**Grouper par l'espace avant tout (Gestalt, proximité et région commune).** Des éléments proches sont lus comme liés ; une zone bien délimitée (fond, cadre) fait un groupe. L'espace vide est l'outil principal de groupement, plus fort que la couleur ou la forme. Mais il ne sert à rien si les groupes ne sont pas logiques, et trop serrer donne une impression de désordre.

**Peu de choix à la fois (loi de Hick) et des cibles faciles à atteindre (loi de Fitts).** Le temps de décision croît avec le nombre d'options : découper en étapes. Une cible grande et proche est plus rapide à atteindre.

**Un rail de navigation : 3 à 7 destinations.** Le rail sert à la navigation de premier niveau, avec une icône et un libellé court par destination. Les libellés ne doivent être ni coupés, ni tronqués, ni rétrécis. Sur un petit écran, le rail devient une barre en bas.

**Dévoiler progressivement.** Montrer d'abord l'essentiel, le détail à la demande. Ce qui est caché attire moins l'attention : on ne cache que ce qui est secondaire.

**Une légende de carte.** Elle ne montre que ce qui demande une explication. Ses symboles sont identiques à ceux de la carte (taille, couleur, style), placés à gauche du texte. Son contenu est dicté par la carte, pas par la place disponible. Son titre dit le sujet (jamais « Légende »). Sur une carte interactive, elle change avec le zoom et les couches affichées.

**Un panneau posé sur une carte (Plans d'Apple, Localiser).** Panneau translucide et flouté, qui laisse la carte accessible derrière. Sur téléphone, une feuille qui monte du bas et s'arrête à quelques hauteurs fixes, avec une poignée.

**Accessibilité (WCAG 2.2, niveau AA).** Toute cible cliquable mesure au moins 24 × 24 px, ou laisse 24 px libres autour d'elle. Le focus clavier reste visible. Contraste du texte d'au moins 4,5 pour 1.

## 2. Diagnostic du rail et du panneau actuels

Observé sur la carte le 2026-10-10 (rien n'est cassé ; ce sont des pistes de finition).

1. **Rail à 8 entrées** (Sus la carta, 6 familles, Fons), au-dessus des 7 conseillées, et de quatre natures différentes mêlées : l'état de la carte (Sus la carta), le catalogue (les familles), le fond, et un mode à part (Autras lengas).
2. **Libellés coupés** : « Adminis-tracion », « Lenga nòs-tra ». Les références le déconseillent.
3. **L'or veut dire trop de choses** : famille ouverte, interrupteurs allumés, échelle « Visibla a partir de… », compteur. Les points orange du rail ajoutent une deuxième couleur d'alerte.
4. **Jusqu'à quatre niveaux de texte dans une ligne** : nom, note, échelle en italique doré, pastilles. L'œil ne sait pas où se poser.
5. **Cibles petites** : l'interrupteur fait 34 × 20 px (sous les 24 px de hauteur) et seule cette petite zone allume la couche ; la ligne entière ne réagit pas.
6. **L'échelle est toujours écrite**, même quand la couche est déjà visible : de l'information qui ne sert pas à ce moment-là.

## 3. Proposition

### Organisation : trois étapes, jamais plus

1. **Le rail** choisit une famille.
2. **Le panneau** montre ses couches ; un clic allume ou éteint.
3. **Le détail** (dialectes, sources, réglages de couleur) se déplie sur place, dans la ligne. Jamais un troisième panneau.

Pour revenir en arrière : Échap ferme l'étape la plus profonde ; un clic ailleurs ferme tout (principe du site, `app/src/lib/tampaDefora.js`).

### Rail

- **7 entrées au plus**, rangées par nature et séparées par un espace : en haut « Sus la carta » (l'état de la carte) ; au milieu le catalogue ; en bas ce qui change la carte entière (Fons, Autras lengas).
- **Libellés jamais coupés** : un ou deux mots entiers, sur deux lignes au plus (rail un peu plus large, ou libellés plus courts).
- **Une seule marque d'état** : la famille ouverte (fond doré léger). Les familles qui ont une couche allumée portent un petit chiffre discret, comme « Sus la carta », à la place des points orange.

### Panneau

- **Largeur** : 21 rem (environ 336 px), jamais plus de 40 % de la largeur de la carte.
- **Fond** : translucide (72 %) et flouté (10 px), coins arrondis à 10 px.
- **Espacements sur une grille de 4 px**, avec seulement six valeurs : 4, 8, 12, 16, 24, 32.
  - Marge intérieure du panneau : 16 px (20 px sur grand écran).
  - Ligne : 8 px en haut et en bas, au moins 48 px de haut.
  - Aperçu et texte : 12 px d'écart.
  - Entre deux thèmes : 24 px, sans trait de séparation (l'espace suffit).
- **Une colonne d'alignement** : aperçus à gauche (52 × 36 px, le vrai symbole de la carte), textes alignés sur un même bord, interrupteurs alignés à droite.
- **Typographie : une police (Luciole), trois tailles, deux graisses.**
  - Titre du panneau : 18 px, gras.
  - Nom de couche : 15 px.
  - Note : 13 px, contraste d'au moins 4,5 pour 1.
  - Titres de thème : 12 px en capitales espacées, gras, couleur secondaire.
- **Couleur** : l'or veut dire « allumé », rien d'autre. La touche méditerranéenne (un trait vermillon) marque seulement la famille ouverte dans le rail.
- **Deux niveaux de texte par ligne au plus** : le nom et une note courte. Le reste (sources, sous-dialectes) se déplie.

### Comportements

- **Toute la ligne est cliquable** pour allumer ou éteindre (cible large, loi de Fitts) ; l'interrupteur n'est plus que le témoin.
- **L'échelle ne s'affiche que si elle sert** : quand la couche allumée n'est pas visible au zoom actuel, la ligne le dit (« Visible à partir de 100 km ») avec un bouton « Y aller ».
- **« Sus la carta » est une vraie légende** : seulement les couches affichées, dans l'ordre où la carte les dessine (le dessus d'abord), symboles identiques. Elle garde « Anullar » et « Netejar la carta ».
- **Touche ludique** : au survol d'une ligne, la couche s'esquisse un instant sur la carte, avant même de cliquer.
- **Mouvements** : 150 à 250 ms pour un changement d'état, 300 à 400 ms pour l'ouverture d'un panneau ; mouvements réduits si le visiteur l'a demandé dans son système.

### Sur téléphone

Le rail devient la barre du bas (déjà fait). Le panneau devient une feuille qui monte du bas, avec une poignée et trois hauteurs : fermée, à moitié (la carte reste visible), pleine.

## 4. Les décisions à prendre (une à la fois)

1. ✅ **Rail à 7 entrées** : « Fons » sort du rail et va près des boutons de zoom, comme dans les applications de cartes (Romain, 2026-10-10).
2. ✅ **Libellés entiers** : seul « Administracion » débordait (86 px pour 52) ; la famille devient **« Territòri » / « Territoire »** (47 px, vérifié lo Congrès), rail inchangé (Romain, 2026-10-10).
3. ✅ **Ligne entière cliquable** et **aperçu au survol** (Romain, 2026-10-10). Précautions : pastilles, bulles et réglages d'une ligne gardent leur propre clic ; aperçu pâle après environ 0,3 s d'arrêt de la souris ; pas d'aperçu pour les couches lourdes (communes).
4. ✅ **Échelle seulement quand elle sert** (Romain, 2026-10-10) : ligne grisée « Visible à partir de… » et bouton « Y aller » quand la couche allumée n'est pas visible au zoom actuel. Occitan proposé « I anar » : lo Congrès ne traduit pas l'expression, **tournure à confirmer par Romain**.
5. ✅ **Points orange du rail** remplacés par un petit chiffre (nombre de couches allumées dans la famille), **vraiment discret** : petit, sans pastille pleine, couleur atténuée (Romain, 2026-10-10).
6. ✅ **Touche méditerranéenne** : un trait vermillon fin à gauche de la famille ouverte dans le rail, nulle part ailleurs (Romain, 2026-10-10).

**Idée pour plus tard (Romain, 2026-10-10)** : un **thème d'ambiance méditerranéen** pour le site, comme une maison épurée du Sud : couleurs chaudes, éléments naturels qui évoquent la Grèce ou la côte italienne, très minimaliste. À traiter comme un thème à part (à côté des ambiances existantes), pas dans ce chantier.

## 6. Mise en œuvre (après les décisions)

Par lots, chacun vérifié en capture à 1830 px et sur téléphone, sans retirer aucune fonction :

1. ✅ **Rail** (fait le 2026-10-10) : « Fons » près des boutons de zoom (son panneau s'ouvre à côté du bouton, au-dessus de la barre sur téléphone) ; « Territòri » ; chiffres discrets à la place des points ; trait vermillon sur la famille ouverte ; espace avant « Autras lengas ».
2. ✅ **Panneau** (fait le 2026-10-10) : marges et espacements sur la grille de 4 px, lignes d'au moins 48 px, titre en Luciole 18 px gras, noms 15 px, notes 13 px, titres de thème 12 px ; fond translucide (72 %) et flouté ; l'or réservé à « allumé » (boutons et échelle en couleur neutre) ; lignes hautes alignées en haut ; pastille de « Sus la carta » adoucie (sombre cerclée d'or), toujours plus visible que les chiffres des familles.
3. ✅ **Comportements** (fait le 2026-10-10) : ligne entière cliquable (pastilles, bulles et réglages gardent leur clic) ; échelle seulement quand la couche allumée n'est pas visible, avec « I anar » (à confirmer par Romain) ; aperçu au survol après 3 s d'arrêt (souris seulement, demande de Romain), hors historique « Anullar » et sans faire bouger la carte ; pas d'aperçu pour les communes, les dialectes, le Croissant, le domaine, l'occitan unifié et les autres langues. État partagé rail ↔ carte : `app/src/lib/carta/estatCarta.svelte.js`.
4. **Téléphone** : feuille à trois hauteurs avec poignée.

## 5. Qui fait quoi

- **Romain, seul, maintenant** : trancher les décisions ci-dessus ; regarder chaque étape sur son écran de 1830 px et sur son téléphone.
- **Claude, ensuite** : coder par petits lots, chacun vérifié en capture et comparable avec un bouton « Actuel / Essai » sur la vraie carte, sans retirer aucune fonction. Estimation : une à deux séances, sans agents.

## Sources

- Rail de navigation (Material 3, repris par SAP Fiori) : https://www.sap.com/design-system/fiori-design-android/v26-4/components/m3-standard-components/navigation-rail/usage ; barre de navigation : https://www.sap.com/design-system/fiori-design-android/v26-4/components/m3-standard-components/navigation-bar/usage ; https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-navigation-rail.html
- Lois de l'expérience utilisateur (Hick, Fitts, proximité, région commune) : https://lawsofux.com/index.md ; https://www.uxdesigninstitute.com/blog/?p=10305
- Proximité et espace vide : https://www.smashingmagazine.com/2016/05/improve-your-designs-with-principles-similarity-proximity-part-1 ; https://xd.adobe.com/ideas/principles/web-design/proximity-in-design-principles ; https://webdesignerdepot.com/the-principle-of-proximity-in-web-design
- Dévoilement progressif et accordéons : https://blog.logrocket.com/ux-design/progressive-disclosure-ux-types-use-cases ; https://mesadesignsystem.lanl.gov/components/accordion/overview ; https://design.basis.com/components/accordion
- Légende de carte : https://open.maricopa.edu/gist/chapter/3-3-cartographic-principles/ ; https://www.saskoer.ca/introgeomatics/chapter/cartographic-design/ ; https://mapscaping.com/?p=15226 ; https://www.wikipedia.org/wiki/Map_layout
- Feuilles et panneaux sur carte (Apple) : https://developer.apple.com/forums/thread/794346 ; https://www.createwithswift.com/exploring-interactive-bottom-sheets-in-swiftui/ ; https://docs.mapbox.com/ios/legacy/maps/guides/map-design-for-ios/
- Accessibilité WCAG 2.2 : https://w3.org/WAI/standards-guidelines/wcag/new-in-22/ ; https://webaim.org/standards/wcag/wcag22

Limite honnête : les recherches n'ont pas donné accès aux pages d'origine de Nielsen Norman Group ni au billet d'Esri sur les légendes (refus du serveur) ; les principes cités viennent de sources qui les reprennent, recoupées entre elles.
