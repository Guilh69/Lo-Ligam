# La marque Instagram de Lo Ligam : l'ADN des 212 visuels

*Relecture du 2026-10-22, corpus `design-stock/canva-vf/`. Aucun fichier du projet modifié ; tout mot occitan ci-dessous est recopié d'un visuel ou d'un fichier cité.*

## 0. Méthode

- 212 PNG, 36 dossiers (`design-stock/README.md` l. 16). Formats mesurés : 197 carrés 1080 × 1080, 13 en 4:5, 2 en 9:16.
- 40 visuels regardés un par un (un par dossier, deux pour `03`, `04`, `12`, `14`, `15`, `21`, `32`, `33`), plus le gabarit `design-stock/vecteurs/gabarits/1-vocabulaire.png`.
- Fond des 212 visuels mesuré sur les bordures (script `fons.cjs` du bac à sable, bibliothèque `sharp` du projet) : **43 fonds blancs** (dossiers 01 à 05 et `Carta-linguistic`), puis **169 fonds pleins** : bleu/pétrole 55, brique 37, beige 21, nuit 19, ocre 17, violet/rose 10, vert 7, jaune 3. Mesure approximative, coupure blanc → plein très nette.
- Dates lues sur les crédits imprimés : « NADAL 2022 » (`08-Nadal-2022/Nadal.png`), « Sometas (02/2026) » (`35-Conta-me-istoria/Contar.png`), « Amor d'Aussau (03/2026) » (`36-Amor-dAussau/Amor-dAussau.png`). Stock rapatrié dans Git le 2026-07-28 (commit `4e55b3a`).

## 1. L'ADN de la marque (a)

| Élément | Ce qu'on voit | Exemples |
|---|---|---|
| **Composition** | Titre occitan centré en haut, français en italique entre parenthèses dessous ; illustration centrale ; étiquettes reliées par des **flèches blanches à main levée** ; en bas, l'icône « bouche qui parle » et la prononciation du titre ; logo rond en bas à gauche ; crédit vertical « ROMAIN PÉRIER - thème » ou « @RP : thème » | `33-Ostal/Ostal.png`, `17-Som/Som.png` |
| **Le trio par mot** (la signature) | écusson + mot occitan gras / haut-parleur + prononciation italique / drapeau français + traduction italique | `11-Meteo/Plou.png`, `14-Emocions/Joia.png`, `21-Chiffras-partida-1/012345.png` |
| **Croix occitane** | Écusson rouge et or sur **tous** les visuels : à droite du titre (période blanche), puis dans les deux coins hauts ; logo rond « LO LIGAM » à partir de 2025-2026 | `03-Cos-uman/Lo-cos.png` vs `27-Auton/Negacion.png` |
| **Couleurs** | Trois périodes : blanc et texte noir (01 à 05) ; fonds pleins pétrole, brique, nuit étoilée, ocre avec texte blanc ; fonds plâtre ou photo voilée, titre brique (`28-Cardinals`, `30-Biaisses-cognitius`) | mesure ci-dessus ; cahier §11 l. 241 |
| **Typographie** | Capitales condensées noires ; puis sans-serif ronde grasse blanche ; capitales « brossées » pour les expressions ; manuscrite pour « Un còp èra … ». **Ni Limelight ni Luciole** (charte §2) ; le gabarit `1-vocabulaire.png` fait la jonction (titre en Limelight) | `26-Oc-Non/Oc.png`, `Contar.png`, `34-Conjugason/Conjugason-1-copie.png` |
| **Occitan / français** | Occitan premier et plus grand ; français italique jamais absent ; **prononciation écrite à la française** partout (« Lou coz uma », « La kouzino »), avec parfois une note (« En fin de mot le “m” se prononce souvent “n” », `Som.png`) ; blasons de dialecte (Lengadocian, Gascon : `Expressions-1-2-3.png`) ; symboles ♂ ♀ ⚥ (`12-Animals`, `15-Trabalh`) | |
| **Humour** | Cœur à jambes poilues et « Ne me demandez pas pourquoi » (`03-Cos-uman/Cor.png`, « Aver lo còr pelut ») ; pizza pour « La poma d'amor » (`Tomata.png`) ; « Blah Blah » sur la carte (`32-Remplacat/Cossi-disparu-p1.png`) ; titres en question : « Qué manjam uèi ? », « Lo trabalh, es la santat ? », « Ressenti donc soi » | |
| **Motifs** | ostal, animaux, saisons et fêtes, ciel étoilé, cartes, drac et castèl, rose des vents, personnages en aplats et **diversité voulue** (DJ en fauteuil `09-Cap-dan-2022`, coureuse à prothèse `25-JO/Fervor.png`, visages variés `14-Emocions/Sentiments.png` ; cahier l. 123) | charte §3 l. 120-126 |

Reconnaissable à trois mètres : écusson dans les coins, trio, flèches blanches, bouche qui parle en bas.

## 2. Les familles réelles (b)

| Famille observée | Dossiers | Visuels | Six familles (cahier l. 301) |
|---|---|---|---|
| Vocabulaire illustré : planche d'ensemble + une fiche par mot (carrousel) | 01-04, 06-07, 10-18, 21-22, 24, 28-29, 33 | **144** (68 %) | vocabulaire |
| Grammaire et langue : pronoms, òc/non, négation, conjugaison, francitan | 05, 26, 27, 34, Francitan | 20 | grammaire et langue |
| Culture et calendrier : Nadal, Cap d'an, JO, contes, chant béarnais | 08, 09, 25, 35, 36 | 20 | culture et calendrier |
| Sensibilisation : « Sabetz cossí lo francés a remplaçat… », biais cognitifs, dialectes, Bordeaux | 30, 31, 32, Carta-linguistic | 28 | sensibilisation |
| Vidéo | aucun PNG (README l. 16 : dossiers sans export, « probablement du contenu vidéo ») | 0 | vidéo |
| Annonces | aucune | 0 | annonces (famille neuve) |

Les six familles recouvrent l'existant ; seule « annonces » est une création. Le vocabulaire écrase tout et porte le format le plus mûr, le trio.

## 3. Présent dans le site, ou perdu (c)

| Élément | État |
|---|---|
| Les 212 visuels | **Présents mais figés** : /mots les affiche en images (`app/src/lib/data/fichas.js` l. 14-16, 424 webp), en grille « comme un profil Instagram » (`app/src/routes/mots/+page.svelte` l. 10-12). Une fiche n'a que `titre`, `mini_url`, `grand_url` (`supabase/supabase-admin-schema.sql` l. 115-122) : **ni prononciation, ni français, ni audio en texte** ; `FichaTunnel.svelte` l. 139 n'affiche que l'image |
| Palette | Présente : « Venas d'aur » tirée des visuels (cahier l. 241, `motor.js` l. 150), logo maître des couleurs (charte §1). Mais le thème « Plâtre » par défaut éloigne le site : `DIRECCION.md` l. 174-175 : « Les visuels Instagram (brique, or, dense) et le site (plâtre, aéré) ne se ressemblent pas encore », question 1 ouverte l. 178 |
| Croix occitane | Présente sous sa **nouvelle** forme (croix-constellation, charte §1 bis) ; l'écusson rouge ne survit que dans `ensag/scena` et la carte en étoiles |
| Convention bilingue | Promise par la charte §4 l. 166 ; le site a pris le **basculement Òc/Fr** (cahier l. 236), pas la juxtaposition. Un seul « Sabètz ? (Le saviez-vous ?) » : `aprene/essai/+page.svelte` l. 652 |
| « Lo riu » de visuels sur l'accueil | **Perdu** : choisi le 22-08 (cahier l. 216), retiré le 05-10 (l. 236). L'accueil ne montre aucun visuel, seulement le lien « Mots en imatges » (`+page.svelte` l. 45) |
| Humour, expressions, « Se ditz tanben » | **Absents** hors images (grep `app/src`) |
| Les scènes | Le pont : « un visuel de Romain en grand, chaque chose à découvrir se touche » (cahier l. 326) ; Romain saisira « occitan, prononciation, français et ajoute sa voix » (l. 333) : le trio devient donnée du site |

## 4. Blocs transposables tels quels (d)

| Bloc Instagram | Modèle | Dans le site |
|---|---|---|
| Trio écusson / haut-parleur / drapeau | `Plou.png`, gabarit `1-vocabulaire.png` | un composant « mot » unique (occitan, prononciation, français, audio) pour /mots, scènes, leçons ; prévu par la fabrique des scènes (cahier l. 333) |
| Planche à étiquettes et flèches | `Ostal.png`, `Urbanista.png`, `Gat.png` | les scènes d'unité (cahier l. 326 ; « deux exports par visuel », revisions/2026-10-15… l. 359) |
| « Se ditz tanben : » / « se diguèt tanben » | `Negacion.png`, `Tomata.png` | bloc variantes et dialectes avec blason |
| « Sabetz cossí… ? » | `Cossi-disparu-p1.png` | bloc « le saviez-vous » du wiki |
| Expression + sens littéral + clin d'œil | `Cor.png`, `Francitan.png` | « l'expression » de l'accueil ou du wiki |
| Fêtes et saisons | `Nadal.png`, `Bona-annada.png`, `Negacion.png`, `Qual-temps-fa.png` | bloc calendrier, au rythme de l'année |
| Diapositives p1…p7 | `34-Conjugason`, `32-Remplacat`, `31-Bordeu` | leçon en étapes (revisions/2026-10-15… l. 272) |
| « Una lenga plural » | `Carta-linguistic/Lenga-plural.png` | déjà transposé et amplifié : /carta, seul bloc devenu fonction entière |

## 5. Ce que Romain aime faire (e)

1. **Illustrer le quotidien** : 144 visuels sur 212 (corps, maison, table, météo).
2. **Écrire la prononciation à sa façon**, avec des notes (`Som.png`) : sa voix, pas celle d'un dictionnaire.
3. **Penser en séries** : « partida 1 / 2 », « p1 à p7 », planche puis une fiche par mot. Le carrousel est son unité naturelle.
4. **Suivre le calendrier** : Noël, Nouvel An, automne, JO 2024.
5. **Le territoire** : 23 cartes (Carta-linguistic, Remplaçat, Bordèu) et « Urbanista » avec « Qualitat de l'aire » : son métier affleure (`15-Trabalh/Urbanista.png`).
6. **Glisser de l'humour** et des titres en question.
7. **Marquer le genre et la diversité** (♂ ♀ ⚥, personnages variés ; cahier l. 123).
8. **Signer et refaire** : trois périodes graphiques en trois ans et demi, puis logo-constellation et six familles en 2026. Il aime recommencer, ce qui rejoint « Oser proposer ».

## 6. Cinq propositions

1. Répondre à la question 1 de `DIRECCION.md` (l. 178) par une **troisième voie** : la page reste plâtre et aérée, mais chaque bloc de contenu (fiche, scène, saviez-vous, expression) est une **tuile pleine** aux couleurs des visuels, posée sur le papier comme une carte postale. Le site est le calme, le contenu est Instagram.
2. **Donner du texte aux 212 fiches** (occitan, prononciation, français) par la page d'administration des scènes (cahier l. 333) : accessibilité, recherche, audio plus tard. L'ADN le plus fort est aujourd'hui enfermé dans des images.
3. **Remettre une bande de visuels sur l'accueil**, section 03 « Amassa » (`planSite.js` l. 31-36) : les six derniers publiés, lien vers Instagram. Le riu du 22-08 répondait à un vrai besoin, sa suppression du 05-10 n'a pas été remplacée.
4. Un **bloc calendrier** et un **bloc expression** sur l'accueil : deux choses qu'il fait déjà et qui ne sont nulle part dans le site.
5. **Un seul composant « mot »** dérivé de `1-vocabulaire.png`, utilisé partout : la reconnaissance tient au trio, pas à la couleur de fond.
