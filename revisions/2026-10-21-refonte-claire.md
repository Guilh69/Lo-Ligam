# Refonte claire de Lo Ligam : la marche à suivre (2026-10-21)

> Demande de Romain, le 21-10 au soir : une reprise du design en profondeur,
> sans jeter ce qui a été fait. Le site s'est éloigné de l'inspiration
> Léo Parpeix ; il y a « trop de bruit, pas assez de structure » ; il est
> « un peu sombre ». Il veut de la luminosité, quelque chose d'accueillant et
> chaleureux, les couleurs du site de Léo Parpeix, les trois rubriques
> (parler, apprendre, vivre l'occitan) qui rangent tous les modules (carte,
> wiki…), la charte comme maître mot, les recommandations du §5octies, et
> une progression bloc par bloc, chaque étape vérifiée.
>
> **Essai en ligne (étape 1) : https://loligam.eu/ensag/clar**
> (sélecteur en bas à droite : A Plâtre, B Terre cuite, C Ciel du Sud ;
> l'adresse garde le choix, par exemple `?var=B`).

## 1. Diagnostic de l'accueil actuel (mesuré le 21-10, écran de 1830 px)

1. **Un fond qui bouge sous chaque texte.** Les veines dorées (WebGL) et deux
   canevas tournent en continu derrière tout le contenu : l'œil ne se pose
   nulle part.
2. **Tout est grand.** Limelight sert au titre, aux « 01 02 03 » en contour,
   aux chiffres géants, aux trois façons d'apprendre, à Descobrir et Amassa :
   cinq à six tailles de texte par écran, quand la règle TYP-01 en demande
   trois au plus.
3. **Brun sur brun.** Les sections ne se distinguent que par un numéro : on
   ne voit pas où l'une finit et où l'autre commence.
4. **Des images posées hors grille** (le paysage au centre, la carte
   Descobrir) : elles flottent (règle ESP-02).
5. **Sept liens du menu mènent à une page introuvable** (erreur 404 vérifiée
   par requête le 21-10) : `/wiki`, `/istoria`, `/contacte`, `/articles`,
   `/forum`, `/grops`, `/ideas`. La structure promise n'existe pas encore.
6. **Le thème clair actuel est le sombre « recoloré »** : mêmes veines, en
   saumon sur crème. Il n'a jamais été pensé comme un thème à part entière.

## 2. Ce que fait Léo Parpeix (relevé sur leoparpeix.com le 21-10)

Couleurs lues dans sa feuille de style, et mesurées sur ses images (couleurs
dominantes calculées sur les captures).

| Principe | Chez lui (mesuré) | Pour Lo Ligam |
|---|---|---|
| Fond clair neutre | `#F7F7F7` | plâtre `#F7F3EE` (A) |
| Encre très foncée, pas noire | vert-noir `#022016` | brun-noir `#2A1A10`, cousin du texte de la charte `#3A2A20` |
| Couleurs du décor | plâtre `#EDE4D9`, pierre `#D5CEC5`, sable `#B8A590`, bois `#8D7153`, ciel pâle aux fenêtres, ombres `#2A1A0E` | surfaces pierre et sable ; le ciel en variante C |
| Une seule couleur vive par écran | jaune citron `#F6E016` (l'abeille), vert profond `#083D2A` | la brique du logo `#B53D17` |
| Contraste d'échelle | 80 % du texte à 14 px, titres de 118 à 162 px, presque rien entre | trois tailles : 14 px, 18 px, géant |
| Grille visible | en-tête en colonnes (nom, métier, menu) ; projets en lignes de colonnes (numéro, nom, catégorie, année, équipe) | en-tête en colonnes ; chaque rubrique liste ses modules en lignes |
| Ton humain | « Bonjour, … » en grand, dans la police du texte | « Qu'es aquò, Lo Ligam ? » en Luciole, mots surlignés |
| Une seule chose qui bouge vraiment | la fleur en 3D ; le reste en micro-animations | la croix-constellation ; plus de fond animé |

Règle éthique du 30-09 (cahier §11) toujours valable : on prend les
*principes*, jamais la *signature*. La matière reste la nôtre : croix-
constellation, Limelight, Luciole, brique et or, photos de Romain. Hasard
heureux : sa pièce aux fenêtres en arc rejoint la photo de l'Hérault vu par
une fenêtre de pierre (`app/static/acuelh/erau.webp`), qui ouvre l'essai.

## 3. Sites voisins (ouverts et regardés le 21-10)

| Site | Ce qu'on en retient |
|---|---|
| [Villa Albertine](https://villa-albertine.org/) (institut culturel français) | l'accueil est fait de **grandes tuiles, une par rubrique** : modèle des trois portes |
| [Wikitongues](https://wikitongues.org/) (langues en danger) | photo d'une locutrice en pleine largeur, titre à empattement, crème chaud : **la chaleur humaine** d'un site de langue |
| [Kinfolk](https://www.kinfolk.com/) (revue) | calme éditorial, un titre, beaucoup de blanc : gabarit possible des **articles et du wiki** |
| [Immersive Garden](https://immersive-g.com/) (ancien studio de Léo Parpeix) | même famille ; **ne s'est pas affiché dans mon navigateur** (3D lourde) : à regarder sur ton ordinateur |
| Déjà dans le projet | Alliance qualité de l'air (accueil en questions, menu = plan, 15-10) ; Centre Racine² (fluidité, 18-09) |

## 4. Ce qu'on garde, ce qu'on calme

**On garde** (rien n'est jeté) : la croix-constellation ; Limelight et
Luciole ; les trois verbes et le plan unique (`app/src/lib/data/planSite.js`,
menu = pied de page) ; la carte (elle a déjà son thème clair) ; le bandeau de
mots ; les lettres « en braise » au survol (gardées dans l'essai) ; la photo
de Romain ; la citation de Max Rouquette ; le système photo « sang e aur » ;
les règles du §5octies ; la version légère ; le thème sombre, qui devient une
option du panneau Ambiance.

**On calme** : le fond animé quitte l'accueil (il peut rester un choix
d'ambiance) ; les chiffres deviennent une ligne de petit texte ; les numéros
de section rapetissent ; le curseur personnalisé et le défilement amorti sont
rediscutés à l'étape 6.

## 5. La marche à suivre

Chaque étape : je prépare des essais, **tu choisis une chose à la fois**, je
porte dans le site, je vérifie et je te montre la preuve. Pas d'agents.
Total estimé : **10 à 14 séances**, aucune dépense.

### Étape 1. L'ambiance claire ← en cours (essai en ligne)

Même page, trois ambiances, seules les couleurs changent :

- **A Plâtre** : le plus proche de Parpeix ; plâtre, pierre, sable, encre
  brun-noir, la brique seule touche vive.
- **B Terre cuite** : le crème de la charte, la brique en aplat sur le bloc
  « Qu'es aquò » (recette du logo : crème et or clair sur brique).
- **C Ciel du Sud** : plâtre et ciel pâle derrière l'ouverture, comme les
  fenêtres de Parpeix et ta fenêtre de pierre ; rejoint ton idée du 10-10
  (« maison épurée du Sud »).

Contrastes calculés (WCAG 2.2 AA : 4,5 pour le texte courant, 3 pour le
grand texte) :

| | texte / fond | texte second / fond | brique / fond | blanc / brique | or / fond | texte du bloc |
|---|---|---|---|---|---|---|
| A | 15,2 | 7,5 | 5,2 | 5,8 | 5,1 | 13,5 |
| B | 11,5 | 6,0 | 4,8 | 5,8 | 4,7 | 5,2 (or clair : 4,1, réservé au grand texte) |
| C | 15,4 | 7,8 | 5,3 | 5,8 | 5,2 (4,5 sur le ciel) | 13,4 |

Point faible noté : en B, la brique sur la surface sable (4,3) ne sert pas
pour du petit texte.

**Tu décides** : A, B ou C (ou un mélange, par exemple « le fond de A, le
bloc de B »). **Ensuite je** fixe les jetons de couleur du thème clair
(`--t-*` dans `app/src/app.css`) : tout le site change d'un coup sans rien
casser, le clair devient le thème par défaut, le sombre reste en option.
**Vérification** : contrastes recalculés, captures 1830 px et téléphone de
chaque page, `npm run build`.

### Étape 2. La structure : où va chaque module

| Rubrique | Module | Page aujourd'hui |
|---|---|---|
| 01 Se parla | La carta | ✅ `/carta` |
| | Lo wiki | ❌ 404 |
| 02 S'apren | Lo parcors | ✅ `/aprene` |
| | Leiçon d'ensag | ✅ `/aprene/essai` |
| | Corses en visio | lien vers Proton Calendar |
| | Ma progression | ✅ `/compte` |
| 03 Se viu | Mots en imatges | ✅ `/mots` |
| | Òbras | ✅ `/obras` |
| | Articles, Fòrum, Grops, Boita d'idèas | ❌ 404 |
| Lo Ligam | Mon istòria, Contacte | ❌ 404 |

Questions à trancher, une par une :

1. **Une page par rubrique** (`/parla`, `/apren`, `/viu`), façon Villa
   Albertine, qui présente ses modules ? Je le recommande : c'est ce qui
   donne la structure.
2. **Mots en imatges** : reste dans Se viu, ou passe dans S'apren (c'est du
   vocabulaire) ?
3. **Les pages qui n'existent pas encore** : une page d'attente honnête, ou
   le lien retiré jusqu'à ce qu'elle existe ? (La charte §5ter disait de ne
   rien afficher avant que ça existe ; la décision du 15-10 a mis les liens.)
4. **Ma progression** : dans S'apren, ou seulement dans le compte ?

**Vérification** : une seule source (`planSite.js`), chaque lien testé,
aucune 404.

### Étape 3. Le cadre commun

La barre sur la grille (logo, promesse, menu), le menu-voile en clair, le
pied de page. **Vérification** : même rendu sur toutes les pages, captures.

### Étape 4. L'accueil, bloc par bloc

Pour chaque bloc : deux ou trois variantes sur la planche, tu choisis, je
porte, je capture.

- 4a **L'ouverture** : titre, photo, un seul bouton. Reprend la question
  ouverte « Fils d'or » (`/?ensag=eros`) dans le cadre clair.
- 4b **Les trois portes**.
- 4c **Le bandeau de mots**, plus calme.
- 4d **Qu'es aquò, Lo Ligam ?** : la déclaration et ta photo.
- 4e **Max Rouquette et l'appel final**.

### Étape 5. Les pages de rubrique

Un gabarit commun : titre, une phrase, la liste des modules en lignes, une
image calme.

### Étape 6. Les pages intérieures, une à une

Mots, Òbras, le parcours, la leçon, le compte, les panneaux de la carte ; et
ce qui reste des animations (curseur, défilement amorti), chacune avec sa
version légère (§5septies).

### Étape 7. Le thème sombre dérivé du clair, et la consignation

Contrastes revérifiés dans les deux thèmes ; charte §1 et §5 mises à jour ;
décisions au cahier §11.

## 6. Ce que tu peux faire seul, maintenant

- Ouvrir **https://loligam.eu/ensag/clar** sur l'ordinateur et sur le
  téléphone, passer de A à B à C, m'envoyer tes captures et ton choix.
- Regarder Villa Albertine, Wikitongues et Immersive Garden ; ranger tes
  captures dans `design-stock/Inspiration/Interfaces/`.
- Réfléchir aux quatre questions de l'étape 2.

Avec moi, plus tard : les étapes 1 (jetons) à 7.

## 7. Le contrat de vérification (à chaque étape)

- `npm run build` passe.
- Captures à 1830 px et au téléphone (375 px), dans les deux thèmes dès que
  le sombre est dérivé : je regarde la page, pas seulement des mesures.
- Règles du §5octies : espacements multiples de 4, proximité, grille de 12
  colonnes, trois tailles de texte, contraste AA calculé, cibles d'au moins
  24 px (44 visés au téléphone).
- Poids mesuré avant et après.
- Aucun lien qui mène à une 404.
- Tout occitan nouveau vérifié par l'API de lo Congrès, puis validé par toi.

## 8. Ce que contient l'essai de l'étape 1

`app/src/routes/ensag/clar/` (la page, 25 Ko, et la silhouette des dialectes, 7 Ko) et `app/static/ensag/clar/` (photos
recompressées : Hérault 90 Ko, paysage 88 Ko, Romain 18 Ko ; croix 4 Ko).
Total avec les polices : 342 Ko ; aucun canevas, aucun WebGL. Textes occitans
repris tels quels du site (aucun mot nouveau). Silhouette des six dialectes
tirée de `app/static/data/dialectes.geojson`, le lengadocian en brique.
Vérifié : trois ambiances à 1830 px, téléphone 375 px sans défilement de
côté, toutes les cibles d'au moins 24 px, aucune erreur dans la console.
