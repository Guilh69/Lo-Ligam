# Boutons en papier découpé : recensement et essai (06-11)

Demande de Romain (06-11, soir) : le papier découpé des illustrations de jeux appliqué à **tous les boutons**, pour que ce soit « vraiment la marque de fabrique du site » et que ça fasse « beaucoup moins IA ». Rien n'est encore décidé : essai seulement, pas de changement sur le site.

## Essai visible
`/ensag/papier-botons` (noindex ; `?tema=clar` pour le thème clair, `?zoom=2.4` pour regarder de près). Code : `app/src/routes/ensag/papier-botons/` (`papier.css` = le style, prêt à devenir le socle commun).

## Le principe (reprise du 06-11, soir)
Romain a choisi la manière **A** (une pièce posée) mais l'a refusée telle quelle : les bords irréguliers et les petites inclinaisons du premier essai faisaient « un faux découpage raté ». Il veut **la même netteté que les illustrations des jeux**, juste l'effet. La manière B (deux feuilles) est abandonnée.
- Une pièce pleine, aux bords nets, coins arrondis comme les tuiles des dessins (10 px bouton, 12 px icône et réponse, 8 px pastille, 18 px carte). Pas de découpe irrégulière, pas d'inclinaison, pas de reflet.
- L'ombre est celle des illustrations (`drop-shadow(0 3px 2px)`), écrite en `box-shadow: 0 3px 4px` : même rendu, moins cher à dessiner (centaines de boutons possibles sur une page).
- États : survol = la pièce se soulève d'un pixel ; appui = elle se pose à plat, l'ombre se resserre ; clavier = anneau doré net qui suit le coin arrondi ; inactif = pièce éteinte. Sans rebond.
- Couleurs de pièces : rouge du logo (action principale, règle B du 23-10), carton (secondaire), or (choisi, mise en valeur), vert (bonne réponse). Bonne et mauvaise réponse portent aussi une icône ✓ / ✗ (la couleur seule ne suffit pas).
- Poids : 0 octet d'image, environ 2 Ko de CSS, `box-shadow` seulement (pas de `filter`, pas de pseudo-élément).
- Accessibilité : texte ≥ 5,15:1 sur toutes les pièces ; cible 44 px conservée ; `prefers-reduced-motion` et `forced-colors` traités. Le contour des pièces « carton » n'atteint pas 3:1 sur le fond (1,3 clair, 1,75 sombre), comme les pilules à trait fin d'aujourd'hui : c'est le texte qui identifie le bouton.

## Recensement (relevé du 06-11 dans `app/src`)
Aucun bouton commun aujourd'hui : **36 fichiers publics définissent chacun leur style** (135 règles `border-radius: 999px` dans 62 fichiers, 37 aplats rouges `--t-accion`).

| Zone | Boutons | Fichiers | Remarque |
|---|---|---|---|
| Structure (barre du haut, menu, bienvenue, ambiance, langues, retour) | 15 | 6 | la barre du haut est déjà une tuile du logo ; la croix ne bouge pas |
| Pages publiques (accueil, Mots, S'apren, Remira, Anem, Cultura, Òbras, Médias, Idées, lecteur) | 106 | 19 | Remira, Anem et le lecteur sont des pages de calme : papier plus discret |
| Leçons et grammaire | 37 | 12 | réponses QCM, Verificar, Contunhar : là que le papier plaît le plus |
| Jeux (Serp, Paniers, OntEs, Reglatges, BotonEcran, Sala) | 25 | 6 | les cartes des familles deviennent des feuilles |
| Compte et groupes (Amassa) | 46 | 9 | champs de saisie inchangés, à décider |
| Carte et récit (RailJaces 39, fiches, recherche, Mon istòria) | 70 | 14 | à traiter à part : le verre translucide du 15-10 est une autre décision |
| **Total public** | **299** | **66** | + liens en forme de bouton dans 9 pages, interrupteurs/onglets/cases dans 11 fichiers |
| Non public (admin 90, Lo talhièr 28, essais 31) | 149 | 21 | à laisser |

Ne change pas : les liens soulignés (pied de page, « ligam »).

## Branché le 06-11 au soir (« Oui, c'est ça » de Romain), pas encore en ligne
Socle : `app/src/lib/styles/papier.css` (importé par `app.css`) + jetons `--pc-carton`, `--pc-ombre`, `--pc-or-fons` dans `app.css` (sombre et clair). Classes : `.pc` (pièce rouge), `.pc-2` (carton), `.pc-or`, `.pc-vert`, formats `.pc-icone`, `.pc-chip`, `.pc-rep`, `.pc-grand`. Un composant ajoute `pc …` à son bouton et garde seulement sa mise en page dans sa propre feuille (elle l'emporte sur `.pc` : même poids, chargée après).
- Leçons et grammaire : QCM, répliques, ordre, révéler, écrire (touches, Verificar), boutons d'écoute (phrases, note, dialogue), vitesse lente, Remarcas, Relacionar (Verificar, œil, formes), flèches des fiches, page d'un module (retour, son, « Acabada »). La logique des leçons est gardée : réponse juste en or, fausses grisées et barrées.
- Jeux : boutons d'action de Serp, Paniers, OntEs ; flèches et bouton du milieu du serpent et des paniers ; Pausa, Un autre mot, Tornar jogar ; bouton plein écran ; thème et filtres de la salle (pastilles, l'or marque la pièce choisie) ; réglages (Reglatges : niveaux et choix en pièces, l'or pour la pièce choisie). La page `/apren/jocs` carrait les touches (0,2 rem) et soulignait les réglages (allure « Teula ») : ces règles sont retirées, le papier prend le relais.
- Structure : barre du haut (Menú, langues, Òc / Fr, compte, administration, thème), retour en haut, fenêtre de bienvenue.
- **Étendu le 07-11 (Romain : « tu peux continuer, notamment sur la carte, sur l'accueil, partout »)** : accueil (les deux gros boutons d'`acuelh.css` : pièce pleine, le remplissage rond est caché, la poussée magnétique reste), compte (connexion, mot de passe, questionnaire), groupes (liste, fil, profils, création), boîte à idées, Mon istòria, Cultura et grammaire (pastilles de thème, couleur de catégorie gardée), Mots (bascule de vue, flèches). Carte : pastilles et boutons du rail, fermetures, fiche de commune, bouton « ? » et guide, commandes Leaflet (zoom, plein écran, fonds : cartons, l'or pour le fonds ouvert). Le rail lui-même (onglets en verre) n'a pas bougé.
- **Couleurs (07-11)** : Romain voulait des pièces plus vivantes avec les teintes des jeux. Essai `/ensag/papier-couleurs` (A une teinte par rôle, B même famille plus chaude, C une teinte par zone). Verdict : « Trop de couleur pour le A, non ? Le B peut-être » : **B retenu et appliqué** (`--pc-carton` : terre cuite vive `#8a4a2a` en sombre, sable chaud `#e6c9a8` en clair ; avant `#573828` et `#e1d3bd`). Le fond global (`--t-fons`, gamme « Éclat ») n'est pas touché. À proposer plus tard seulement si besoin : fond un peu plus chaud, ou une teinte de jeu pour une zone précise.
- **Thème clair (07-11, suite)** : le sable `#e6c9a8` était pâle à côté des cartes vives des jeux (Romain : « les couleurs pour le thème clair devraient être vives comme les en-têtes de la page jeux »). Essai `/ensag/papier-couleurs-clair` (1 or vif, 2 sarcelle seule, 3 teintes des jeux par rôle) : **2 retenu**. `--pc-carton` du thème clair = sarcelle `#1f5f63` (celle des jeux de mémoire) ; le texte posé sur le carton est toujours crème (`--pc-carton-tinta`, dans `:root`), sombre ou clair. Sombre : terre cuite `#8a4a2a` (parti B). Rouge d'action et or du choisi inchangés.
- **Harmonisation (07-11, fin d'après-midi)** : Romain trouvait que « trop de couleurs différentes se baladent ». Palette de référence = les en-têtes des jeux (brique #b53d17, or #eeaf34, olive #4f6a2f, sarcelle #1f5f63, bleu #2b6496) + la charte (prune #6b3a5b, ocre #c98a2b). Sombre : boutons secondaires en crème des tuiles de jeu `#efe1c6`, texte brun (« ils doivent ressortir »), en ligne. Carte en thème clair : l'occitan unifié au rouge des boutons, posé franc (0,86) avec le nom en crème ; les autres langues prennent un ton de la palette (catalan or, oïl bleu, arpitan sarcelle, basque olive, francique prune, alsacien ocre, flamand brun, breton olive clair, corse bleu gris) et leurs dialectes un camaïeu de ce ton, posés à 0,6. Les dialectes occitans gardent leur arc-en-ciel (bleu gascon choisi le 10-10) : à trancher par Romain. Le thème sombre de la carte n'a pas changé.
- **Carte en aplats pleins (07-11, soir)** : Romain : « les couleurs sont encore trop fades et pastel… représenter les couches avec l'intensité et la teinte qu'on peut voir sur les boutons et sur les en-têtes de la partie Jòcs ». Cause : chaque couche était un voile (0,3 sombre, 0,36 clair) qui s'allégeait encore dès 7 de zoom. Désormais, dans les deux thèmes : aplats à 0,88, pleine intensité jusque vers 40 km ; occitan unifié #b53d17 ; dialectes occitans aux teintes des jeux (gascon bleu, languedocien brique, provençal or, limousin prune, auvergnat olive, vivaro-alpin sarcelle) ; autres langues : catalan or, oïl ocre, arpitan bleu, basque et flamand olive, breton et francique sarcelle, alsacien et corse prune, dialectes en camaïeu sans pastel. Noms crème sur les teintes sombres, bruns sur l'or et l'ocre. Vignettes et pastilles du rail alignées (RailJaces lit `COLORS` de colaDonadas.js).
- Rail de la carte (07-11) : vignettes des jaces toutes en une même pièce 52 x 36, interrupteurs en papier (Romain : « je veux une cohérence »).
- Branche mise à jour avec master le 07-11 (52 commits) : `OntEs.svelte` supprimé en amont (jeu refait : `PausaMots.svelte`, branché sur le papier) ; salle de jeux sans thème « calme ».
- Outil : `papier_conv.py` (garde la mise en page, retire l'aspect) a cassé des groupes de sélecteurs (`.a,\n.b {`) avant d'être corrigé : réparé à la main dans `grops/*`, contrôlé par `git diff`.
- **Pas encore fait (hors carte et accueil, à la date du 06-11)** : MenuVel (palette propre du voile), TriaLenga (emblèmes ronds), panneaux d'AmbiancaPanel et de langues, interrupteurs « Son / Pas a pas » des réglages (`.bascula`), tuiles et lettres des jeux, vignettes « Jogar » de la salle, pages publiques (accueil, Mots, Remira, Anem, lecteur), compte et groupes, carte, admin.
- Piège rencontré : un script de remplacement a supprimé ses propres règles neuves (règle insérée puis cherchée par le même sélecteur) : toujours relire le diff.

## Ordre proposé
0. Socle : `papier.css` global + jetons dans `app.css` (+ petit composant si besoin). Rien de visible.
1. Leçons, jeux, structure (le cœur de l'apprentissage).
2. Pages publiques, compte et groupes.
3. Carte (décision séparée).
4. Admin : plus tard ou jamais.

## À trancher par Romain
Manière A reprise : Romain valide-t-il la netteté ? La carte est-elle incluse ? Les champs de saisie suivent-ils ? Joan n'a pas encore relu l'essai (règle : tout visuel passe par lui avant Romain).
