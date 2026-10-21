# Le site actuel : inventaire, poids, réutilisable

Relecture du code de `app/` au 2026-10-22, 0 h (dernier commit `e8eafea`). Méthode : `wc -l`, `grep` des imports, en-têtes de fichiers, Git en lecture seule, build existant (`app/build/`, 2026-10-21 23 h 51). Rien n'a été modifié ni lancé.

## 1. Inventaire des pages et de leur état

`app/src` (`.svelte`, `.js`, `.css`, `.html`) fait **42 557 lignes** : routes 13 414, `lib/components` 11 797, `lib/carta` 10 105, `lib/lesson` 3 252, `lib/acuelh` 1 597, `lib/data` 999, `lib/actions` 395, `lib/stores` 199, `app.css` 248.

Trois pages seulement sont « harmonisées » avec la charte : `ARMONIZADAS = ['/', '/mots', '/carta']`, écrit deux fois (`src/lib/stores/ambianca.svelte.js` l. 25 et `src/app.html` l. 13, « COPIE … à tenir identique »). Toute autre page est forcée en clair par `+layout.svelte` l. 15-18.

| Zone | Pages (lignes) | État | Dernier commit |
|---|---|---|---|
| Nouvelle charte | `/` 765 + `lib/acuelh` 1 597 ; `/carta` 380 + `CartaOccitania` 3 621 + `RailJaces` 2 832 + `lib/carta` 10 105 ; `/mots` 1 454 | Vivantes ; Plâtre par défaut depuis le 2026-10-21 (`ambianca.svelte.js` l. 38-40) | 2026-10-21 |
| Ancienne charte | `/aprene` 422 ; `/aprene/essai` 1 419 ; `/aprene/modul/[modulId]` 794 + `lib/lesson` 3 252 ; `/compte` 329 ; `/compte/questionnaire` 501 ; `/obras` 673 ; `/confidencialitat` 298 ; `/mencions-legalas` 187 ; `+error` 116 | Dessinées pour le fond crème, intouchées depuis l'audit | 2026-10-08 à 12 |
| Essais `/ensag/*` | `clar` 304 ; `icones` 428 ; `letra` 155 ; `lottie` 182 ; `scena` 754 = **1 823** | Bancs d'essai « non indexés » (en-têtes), créés depuis le 2026-10-11 | 2026-10-21 |
| Administration | 7 pages + layout = **3 982** (`carta` 824, `designs` 823, `obras` 560, `carta/luocs` 551, `grops` 442, `textes` 312, `+page` 167, `+layout` 303) | Dépend de Supabase (12 tables ; `temas` ×13 appels, `designs` ×10) | 2026-10-12 |
| API serveur | `/api/comuna` 214 + `/foto` 19 | Fiche de commune Wikidata/Wikipédia, relais Scaleway (`+server.js` l. 1-6) | 2026-10-11 |

## 2. Les sept liens du menu vers des pages introuvables

`src/lib/data/planSite.js` se veut « une seule source pour le menu-voile et le pied de page » (l. 5). Sept adresses n'ont aucun dossier dans `src/routes` :

| Lien | Libellé (tel qu'écrit) | Ligne |
|---|---|---|
| `/wiki` | Lo wiki | l. 15 |
| `/articles` | Articles | l. 36 |
| `/forum` | Fòrum | l. 40 |
| `/grops` | Grops | l. 41 |
| `/ideas` | Boita d’idèas | l. 42 |
| `/istoria` | Mon istòria | l. 50 |
| `/contacte` | Contacte | l. 51 |

Le cahier le constate : « sept liens du menu mènent encore à une 404 : la structure doit exister avant l'habillage » (`cahier-des-charges.md` l. 335, 2026-10-21). C'est un choix : « les rubriques à développer avant la diffusion du site ont déjà leur lien (choix de Romain, 2026-10-15) » (`planSite.js` l. 6-7). Mais l'accueil ne lit pas `PLAN` pour sa section 03 : une seconde liste `VIURE` répète les mêmes adresses (`+page.svelte` l. 42-49), deux sources pour un même menu.

## 3. Code mort ou orphelin

| Élément | Lignes | Preuve | Depuis |
|---|---|---|---|
| `components/WelcomeDialog.svelte` | 211 | aucun import dans `src` | retiré de l'accueil, commit `468e98d` (2026-10-07) |
| `components/OfficialitatCarousel.svelte` | 321 | aucun import | `a516a29` (2026-08-22) |
| `components/BgCarousel.svelte`, `WaveLandscape.svelte` | 164 + 144 | aucun import | `a516a29` |
| `components/PageBackground.svelte`, `OccitaniaIcon.svelte` | 55 + 25 | aucun import | `0be83e2` (2026-10-05) |
| `data/siteSections.js` (+ test, 73 l.) | 243 | seul `externalLinks` (l. 171, 11 liens) est lu, par `SiteFooter.svelte` l. 13 ; `families` (l. 13-164) ne l'est que par l'orphelin `WelcomeDialog` | 2026-10-07 |
| `data/icones.js` | 26 | aucun import ; les 6 icônes de ressources de `static/icones` ne sont citées que par lui | — |
| `routes/admin/textes` | 312 | seule page à lire `site_textes` ; l'accueil dit « Textes en dur (plus de /admin/textes, à rebrancher) » (`+page.svelte` l. 24) | 2026-10-07 |
| `static/esbos-*.html` (6) et `maqueta-*.html` (4) | ≈ 197 + 137 Ko | retirés du site en ligne par `scripts/levar-esbos.mjs` (`package.json` l. 8) ; `maqueta-` n'est cité nulle part dans `src` | `esbos-nuech.html` = 36 commits, source de l'accueil (`motor.js` l. 3) |
| Images sans lecteur | `static/bg` 28 webp (424 Ko) et `static/officialitat` 9 webp (1,1 Mo) ne sont lus que par les carrousels orphelins ; `static/acuelh/personatge.png` (124 Ko) par personne ; dans `static/words` (928 Ko) seul `adieu.jpg` est cité | | |

Soit environ **1 500 lignes** et **1,7 Mo d'images** sans lecteur. S'y ajoute `lottie-web` (25 Mo dans `node_modules`, 169 Ko dans le build), chargé seulement par `/ensag/lottie` (`+page.svelte` l. 29).

## 4. Réutilisable tel quel

**Cadre commun, thème et daltonisme compris (≈ 2 000 l.)** : `src/lib/components/AppHeader.svelte`, `MenuVel.svelte` (Romain : « presque la partie la plus sympa du site », cahier l. 337), `SiteFooter.svelte`, `TornarAmont.svelte`, `AmbiancaPanel.svelte`, `Crotz.svelte` (géométrie et couleurs du logo), `Icona.svelte` (Iconoir, MIT) ; `src/lib/stores/ambianca.svelte.js`, `lang.svelte.js` ; `src/lib/tampaDefora.js` ; `src/lib/data/planSite.js`, `legal.js`.

**Jetons (`src/app.css`)** : couleurs de marque l. 6-18 ; polices l. 25-28 ; espacement `--esp-4`…`--esp-128` l. 33-42 ; sombre `--t-*` l. 54-63 ; logo `--logo-*` l. 71-81 ; clair Plâtre l. 88-99 ; verre `--t-veire` l. 106-107 ; daltonisme l. 112-123.

**Polices** : `src/fonts.css` + `static/fonts/` (6 `woff2`, 207 Ko : Limelight, Luciole ×3, Cormorant ×2), préchargées dans `app.html` l. 26-33, « aucune requête vers Google » (l. 24-25).

**Mouvement** : `src/lib/actions/animarText.js` (11 effets, API Web Animations, sans bibliothèque), `scramble.js`, `portal.js` ; dans `lib/acuelh/motor.js`, constellation et carte en étoiles (canvas 2D) sont des blocs séparables.

**Données** : `src/lib/acuelh/donadas.js` (mots l. 11, manifeste l. 15, consignes l. 23, drapeaux l. 36) ; `src/lib/data/fichas.js` (filet gelé) + `static/fichas` (424 webp, 12 Mo) ; `src/lib/data/afichas.js`, `src/lib/obras.js`, `static/obras` ; `src/lib/lesson/moduls/` (4 modules, 1 721 l.) + 7 blocs ; `src/lib/carta/*` + `static/data` (34 Mo).

**Images de l'accueil** : `static/acuelh/romain.webp` (36 Ko), `erau.webp` (333 Ko), `paisatge.webp` (173 Ko), `relief.png` (97 Ko).

## 5. Poids et sobriété

| Mesure | Valeur | Source |
|---|---|---|
| Dépendances d'exécution | 4 : `@supabase/supabase-js`, `leaflet`, `lenis`, `lottie-web` | `package.json` l. 33-38 |
| Build | 75 Mo, dont `static` 52 Mo (`static/data` 34 Mo, `comunas` 29 Mo en 143 fichiers ; `fichas` 12 Mo) et `_app` 3,2 Mo | `du` sur `build/client` |
| JS / CSS compilés | 1 435 Ko / 247 Ko avant compression | `build/client/_app` |
| Page la plus lourde, `/carta` | nœud 14 : 366 Ko JS (103 Ko brotli) + 86 Ko CSS (17 Ko) + Leaflet 149 Ko (37 Ko) | `manifest-full.js` l. 138-141 |
| Supabase | 207 Ko (45 Ko brotli), importé par 17 fichiers, jamais par l'accueil | grep `supabaseClient` |
| Accueil | nœud 3 : 29 Ko JS (9 Ko) + 28 Ko CSS ; moteur différé de 47 Ko, Lenis compris | `+page.svelte` l. 21-24 ; `motor.js` l. 11 |
| WebGL | un seul endroit, `motor.js` l. 117-125, « pas jamai sus un telefòn » ; fond « Simple » immobile par défaut depuis le 2026-10-21 | `ambianca.svelte.js` l. 40 |
| Canevas | 2 `<canvas>` sur l'accueil (l. 278, 280) ; 32 `createElement('canvas')` dans `lib/carta` (16 dans `colaDonadas.js`, 8 dans `colaLenga.js`) | grep |
| Curseur et défilement | `cursor-viu` et Lenis seulement avec pointeur fin et sans « reduced motion » (`motor.js` l. 29-30, 81, 83-92), détruits en quittant (l. 932-934) | |
| Tiers autorisés | 5 serveurs de tuiles, Supabase, 2 services d'adresses, l'Atlas sonore, YouTube sans cookies, Canva | `svelte.config.js`, bloc `csp` |

Ce qui pèse n'est pas le site mais la carte : ses données font 65 % du dossier `static`, son code la moitié de `src`. Polices et accueil sont déjà sobres.

## 6. La part de la carte

| Périmètre | Lignes | Part de `src` |
|---|---|---|
| Noyau : `lib/carta` 10 105 + `CartaOccitania.svelte` 3 621 + `RailJaces.svelte` 2 832 | **16 558** | **38,9 %** |
| Élargi : + `FichaComuna` 557, `VotzAtlas` 602, `CercaCarta` 333, `TriaLenga` 173, `VotzFicha` 178, `/carta` 380, `admin/carta` 1 375, `/api/comuna` 233, `carta-estelas.js` 110 | **20 499** | **48,2 %** |

Côté effort : `lib/carta` 157 commits (depuis le 2026-10-07), `CartaOccitania.svelte` 122, `RailJaces.svelte` 63 ; contre 8 pour `/mots`, 5 pour `/obras`, 9 pour `/compte`, 17 pour `lib/lesson`, sur 682 commits depuis le 2026-07-28. Les quatre plus gros fichiers du projet sont à elle.

## 7. Ce que l'inventaire dit pour repartir d'une page presque blanche

1. **Le cadre est prêt, la structure manque** : 2 000 lignes réutilisables d'un côté, sept pages absentes de l'autre (cahier l. 335 : « la structure doit exister avant l'habillage »).
2. **Trois doublons à résorber d'abord** : `ARMONIZADAS` (§1), `PLAN`/`VIURE` (§2), couleurs du thème recopiées dans `motor.js` l. 37-40 (cahier l. 336 : « couleurs claires écrites en dur dans l'accueil et la carte aussi »).
3. **Un nettoyage sans risque** : §3, aucun lecteur ; `admin/textes` édite une table que rien ne lit.
4. **La carte est un projet dans le projet** (48 % du code, 65 % des données) : détachée en module, le site d'apprentissage apparaît tel qu'il est, environ 22 000 lignes dont 2 600 d'administration.
5. **L'accueil plaît** (cahier l. 337 : « rien à ajouter, on l'améliore ») : ses six sections (`+page.svelte` l. 296-564) et son moteur sont déjà séparés, donc transposables un à un.
