# Références et principes : ce que Romain garde, ce qu'il rejette, où le site s'en écarte

> Rapport du 2026-10-22, 0 h. Corpus : `revisions/2026-10-21-refonte-claire.md`, cahier §11 (22-08, 18-09, 30-09, 06/07-10, 15-10, 21-10), `transposicion-racine2.md`, `corpus-design.md`, `charte-graphique.md` §5 à §5octies, `design-stock/Inspiration/`, `DIRECCION.md`. Mesures sur le dépôt au commit `e8eafea`, sans rien modifier ; 36 visuels Instagram mesurés par un décodeur PNG écrit pour l'occasion, deux regardés.

## 1. Les principes constants (a)

Neuf principes reviennent à chaque référence, de juillet à octobre.

| Principe | Où il revient | Dans les mots de Romain |
|---|---|---|
| Fond clair, l'interface se tait, la couleur en touches | charte §5 (juillet, l.172-174) ; corpus §1.3 (22-08) ; §11 30-09 ; 21-10 « une seule couleur vive » | « envie de luminosité » (21-10) |
| Grille et hiérarchie strictes, trois tailles de texte | corpus §1.1 (22-08) ; charte §5octies TYP-01, GRI-01 ; Parpeix mesuré : 14 px et 118 à 162 px | « trop de bruit, pas assez de structure » (21-10) |
| L'espace est un matériau | corpus §1.1 ; charte §5 « plus aérée et lisible » ; §11 30-09 | « éditorial aéré » (30-09) |
| Peu d'éléments très soignés, une seule chose qui bouge | corpus §1.3 (Hello Monday) ; §11 10-10 ; refonte §2 ; DIRECCION bloc 6 | « trop kitsch » (10-10) |
| Un seul plan, compris sans explication, jamais d'impasse | Racine² §1 (18-09) ; Alliance « menu = plan » (15-10) ; refonte §7 | « presque la partie la plus sympa du site » (le menu, 21-10) |
| Ton humain, chaleureux, humour fin | corpus §2.1 (Mayer) ; charte §2 « fier, chaleureux, pédagogique, jamais froid » ; §5bis ; Parpeix « Bonjour » | « accueillant et chaleureux » (21-10) |
| Les principes, jamais la signature ; plusieurs références | §11 30-09 et 21-10 ; charte §5sexies « on regarde, on ne copie pas » | |
| L'identité est celle de l'Instagram, contre le « site de nulle part » | §11 28-07 (l.189) ; charte §6 ; corpus §4 ; §11 07-10 | « rien ne doit être laissé au hasard » (22-08) ; « trop classique Claude » (30-09) ; « ça se voit que c'est Claude qui l'a fait » (06-10) ; « trop IA » (07-10) |
| Planches comparées, une décision à la fois, preuve à l'écran | §11 22-08, 30-09, 15-10 « charpente et chair » ; corpus §7 | « je veux qu'on me pousse la maquette sur le projet principal » (05-10) |

## 2. Essayé puis rejeté (b)

| Essai | Acté | Rejeté | Motif consigné |
|---|---|---|---|
| Héros « Lo riu » (designs Canva qui défilent) | 22-08 | 05-10 | « nouvelle coquille » ; avec lui disparaît en pratique le principe corpus §1.3 « les designs sont notre travail qui parle » |
| Syne / Instrument Sans / Fredoka, puis Barrio | 22-08, 30-09 | 30-09, 05-10 | logo dessiné en Limelight ; « une police de moins à charger » |
| Accueil « éditorial aéré » Parpeix, clair | 30-09, intégré 05-10 | 06-10 : « dépassé » par l'esbòs de nuèch sombre, WebGL | « beaucoup mieux, on a débloqué quelque chose » |
| Esbòs de nuèch, fond sombre et vivant par défaut | 06-10, 07-10 | 21-10 | « un peu sombre », retour aux principes du 30-09 : le pendule a fait un tour complet en trois semaines |
| Claude Design | 18-09 | 30-09 | Romain « perdu et éparpillé » |
| Steampunk ; portulan orné ; croix brune | 07-10, 10-10, 21-10 | le jour même | « trop IA » ; « trop kitsch » ; « contente-toi de respecter les couleurs que j'ai décidé dans le Canva » |
| Défilement horizontal des familles ; « Quatre camins » | 06-10 | 14-10, 15-10 | retour de Cyril ; la section « répétait le menu » |
| Séparation en « bandes » | essai 14-10 | écartée 14-10, reproposée le 21-10 (4b) | une idée écartée revient |
| « Se viu » | 15-10 | 21-10 | « se viu ne correspond pas au contenu » |
| Marcellus, Base44, DSFR, « touche méditerranéenne » non sourcée, compteurs, carrousel héros | | 22-08, 18-09, §5octies, Racine² §5 | |
| Charte §5ter « ne pas afficher avant que ça existe » | juillet | 18-09, 15-10 (liens normaux) | la seule règle abandonnée vers le moins sobre ; rouverte le 21-10 (question 3) |

## 3. Où le site contredit ces principes (c)

| Principe | Mesure du 22-10 | Preuve |
|---|---|---|
| Trois tailles de texte | 36 déclarations `font-size`, 31 valeurs distinctes, 8 tailles géantes (`clamp` ≥ 3,2 rem), titre jusqu'à 12 rem | `app/src/lib/acuelh/acuelh.css` (l.150 `--eros-fs`) |
| Une seule couleur vive, par les jetons | 12 hexa et 14 `rgba` en dur, 5 règles `[data-tema='clar']` écrites dans l'accueil ; en clair trois accents coexistent (brique, or `#9c5611`, or clair `#8a3f12`) | `acuelh.css` ; `app.css` l.88-99 |
| Grille de 12 colonnes, échelle de 4 | 9 `grid-template-columns` à 1, 2, 3 ou 4 colonnes, jamais 12 ; rythme vertical en `vh` (29vh ×5, 18vh ×4, 74vh, 62vh) ; `--esp-*` 11 emplois ; 42 px ×2 hors échelle | `acuelh.css` |
| Une seule chose qui bouge, version légère | 2 canevas (`#fons`, `#estelas`), 4 `@keyframes`, `motor.js` 52 Ko + `carta-estelas.js` 43 Ko ; fond « Simple » par défaut depuis le 21-10, mais une seule règle `prefers-reduced-motion` | `+page.svelte` l.278-280 ; `ambianca.svelte.js` l.40 |
| Jamais d'impasse | 7 adresses du plan sans route : `/wiki /articles /forum /grops /ideas /istoria /contacte` | `planSite.js` ; `app/src/routes/` |
| Sobriété | l'accueil sert `erau.webp` 333 Ko (largeur 1500) quand l'essai sert `erau-760.webp` 90 Ko ; `paisatge.jpg` 240 Ko et `paisatge.webp` 173 Ko coexistent | `+page.svelte` l.567 ; `static/acuelh`, `static/ensag/clar` |
| Une à deux familles de caractères | trois chargées (Limelight, Luciole ×3, Cormorant ×2) ; sort de Cormorant « encore ouvert » depuis le 30-09 | `fonts.css` l.29-73 ; charte §2 |
| Registre OUTIL sobre, un seul style par rôle | `/aprene/essai` : 14 tailles, 39 anciens jetons `--color-*`, 0 jeton de thème, tache radiale en ligne (`PageBackground.svelte` n'est importé nulle part) ; `/aprene` 17, `/compte` 16, `/obras` 28 ; cadenas en émoji ×2 | `routes/aprene`, `compte`, `obras` |
| Plusieurs références, captures rangées | tableau « Ce qui me plaît » vide ; 2 fichiers (un programme PDF, une capture de portail captif) ; un seul site mesuré le 21-10 | `Inspiration/LISEZ-MOI.md` ; refonte §3 |
| Humour par touches | aucune trace par recherche de texte dans l'accueil ; à confirmer à l'écran | charte §5bis |
| Contours fins | 9 `text-stroke` : « effets voulus » (refonte 4a) mais « gênent » (DIRECCION §1) | `acuelh.css` |

## 4. La tension Instagram / Parpeix (d)

**Elle est en grande partie une illusion de lecture.** Mesure sur 36 visuels (thèmes 01, 05, 10, 12, 30) : 50 % ont un fond quasi blanc (≥ 50 % des pixels), 28 % un fond sombre (pétrole, nuit), **0 % un fond brique** ; en moyenne 42 % de blanc, 2 % de brique. `Montanha.png` : fond blanc, titre noir en capitales, illustration plate, la croix rouge et or comme seule touche chaude, un pictogramme sarcelle. `Can.png` : fond pétrole, texte blanc, croix, prononciation, français, et l'humour (« Ai la canha uèi ! »). L'analyse du 07-10 le disait déjà : « fonds blancs et rouge corail ». Le « brique, or, dense, chaud » du bloc 5 de DIRECCION décrit la palette « Brasa » de l'esbòs de nuèch, pas les publications.

Un visuel Instagram est donc déjà « fond clair, encre noire, une couleur vive » : la croix y joue le rôle de la brique chez Parpeix. La charte §5 avait écrit la résolution dès juillet : fonds crème ou blanc cassé, couleurs vives en touches, illustrations « en récompenses, en-têtes d'unité, capsules, pas sur chaque écran ».

Ce qui reste vrai : **la densité** (six étiquettes dans un carré contre une page qui respire) et **la voix** (humour et prononciation, présents dans les posts, absents du site). La densité se résout par la tuile : le post est l'unité dense, la page est la grille de tuiles ; modèle de Villa Albertine (refonte §3) et de la grille Instagram elle-même, et principe corpus §1.3 (« l'interface doit les magnifier, pas rivaliser avec eux ») abandonné avec le riu. Vérifiés dans le projet le 21-10 : Wikitongues (crème chaud, photo pleine largeur) et Villa Albertine. De mémoire et **non vérifiés aujourd'hui** : Hermès (blanc, orange seul) et le site de Duolingo (blanc, vert seul, illustrations plates).

## 5. RÉCIT / OUTIL : lequel manque (e)

Historique Git : 126 commits sur l'accueil, 180 sur la carte, **22 sur le parcours et la leçon, 9 sur le compte** ; dernière touche au parcours le 12-10, pour des icônes. Le RÉCIT a eu cinq formes (riu 22-08, aéré 05-10, nuèch 06-10, plan 15-10, clair 21-10) ; l'OUTIL n'a jamais eu une planche comparée : jetons de juillet, émojis. Ses règles propres (Mayer, corpus §2.1 ; humour et sons, charte §5bis ; « zéro décor pendant l'effort », corpus §6) sont toutes écrites, aucune appliquée. **Le registre qui manque est l'OUTIL.** Le RÉCIT manque de chair, pas de forme : istòria, articles, wiki en 404 ; le site « dit moins chaleureux et presque pas ensemble » (DIRECCION bloc 1).

## 6. Ce qui en découle

1. Écrire la règle de l'accueil en chiffres (trois tailles, un accent, grille de 12) et en dériver `acuelh.css` par les jetons, au lieu de corriger couleur par couleur.
2. Reprendre le principe du riu sans le riu : les designs Canva en tuiles sur plâtre, unité dense dans une page aérée.
3. Avant toute nouvelle passe sur l'accueil, une première planche comparée de l'OUTIL : une leçon sur plâtre, trois tailles, zéro décor, une touche d'humour.
4. Trancher les 404 par une règle (§5ter ou 15-10), pas lien par lien.
5. Remplir le LISEZ-MOI d'Inspiration (trois captures, une ligne chacune) avant la prochaine séance de design : la règle « plusieurs références, jamais une seule » (30-09) n'est pas tenue.
