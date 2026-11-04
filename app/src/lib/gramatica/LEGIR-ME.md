# Écrire une fiche de grammaire (S'apren)

Une fiche = **un fichier** dans `fichas/` (modèle : `fichas/infinitiu.js`). Rien d'autre à toucher : elle apparaît d'elle-même dans le sommaire (`/apren/gramatica`, dans S'apren, rangée sous sa notion) et à l'adresse `/apren/gramatica/<id>`. Le texte vit dans le fichier, la mise en page dans `FichaGramatica.svelte` : on n'écrit jamais de HTML ni de CSS dans une fiche.

## Avant d'écrire
- **Source** : la *Gramatica de l'occitan estandard* (Collègi d'Occitania, Academia Occitana, dir. Florian Vernet) fait foi. OCR hors Git : `Documents\6_Projectes\Lo_Ligam_hors-git\Modules_cors\Base_donnees_linguistica\Gramatica_estandard\gramatica-linhas-per-pagina.txt` (page du PDF + 2 = page imprimée ; on cite la page imprimée). **On prend les informations du livre, on ne reproduit pas le livre** (Romain, 2026-11-03) : ni ses phrases, ni ses exemples, ni son plan. On explique avec nos mots et les exemples du parcours, et on croise avec d'autres sources quand Romain en fournit.
- **Autres livres** (depuis le 2026-11-04) : rangés hors Git à côté de la Gramatica, un dossier par livre (`Base_donnees_linguistica\<livre>\` : le PDF et le texte reconnu) ; Romain dépose les nouveaux dans `_A_integrar`. On compare chapitre par chapitre avec les fiches et les leçons, on ne prend que ce qui est **plus clair** que l'existant ou qui **comble un manque**, on reformule, on vérifie chaque mot avec lo Congrès, et on ne change jamais une prononciation du parcours sans Romain (un écart = une question). La page est citée sous l'écran : `{ type: 'font', libre: CHABBERT, pages: 'page 26' }` (ouvrages dans `libres.js`). Méthode complète et relevé de ce qui a été repris : `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/11-fonts-integradas.md`.
- **Notion** : son `id` dans `capitols.js` (ex. `verb`, `article-definit`, `negacion`) ; le sommaire suit l'ordre du parcours, et le champ `pages` y dit où lire la notion dans le livre.
- **Occitan** : chaque mot vérifié avec l'API de lo Congrès (`cd app` puis `node scripts/verificar-oc.mjs mot1 mot2`), chaque forme verbale conjuguée avec vèrb'Òc. Exemples repris du parcours A1 de préférence (`src/lib/lesson/moduls/`). Romain relit l'occitan ; tant qu'il ne l'a pas fait, `validada: false` : la fiche est en ligne et dans le sommaire, mais les moteurs de recherche ne l'indexent pas.
- **Esprit** (cahier §11, 2026-11-03) : une idée par écran ; on découvre la règle dans l'activité avant qu'elle soit dite ; rien de non expliqué avant ; tutoiement, écriture inclusive (*el, ela*), pas de tirets longs ni de jargon anglais ; une touche culturelle occitane plutôt qu'un personnage ; **la source sous chaque écran tiré du livre**, toutes les sources à la fin.

## La forme d'une fiche
```js
export default {
	id: 'article-definit',        // l'adresse : /apren/gramatica/article-definit (ASCII, sans accent)
	capitol: 'article-definit',   // la notion de capitols.js
	ordre: 1,                     // facultatif : l'ordre sous la notion
	titol: 'L’article definit',   // en occitan, vérifié
	fr: 'L’article défini',       // le titre en français (pour les traductions à venir, pas encore affiché)
	resumit: 'Une phrase en français pour le sommaire.',
	validada: false,              // true quand Romain a relu l'occitan
	colors: { m: 'blau', f: 'pruna' },  // clé → couleur : pruna, oliva ou blau
	ecrans: [ { titol: '…', blocs: [ … ] }, … ],  // 3 à 6 écrans
	fonts: [ { de: 'La règle', text: '_oc:Gramatica de l’occitan estandard_, …, pages 23 et 24.' } ],
	libre: '…'                    // facultatif : l'ouvrage des lignes « Source : » s'il ne s'agit pas de la Gramatica
};
```
Une même couleur peut servir à deux clés (dans `infinitiu.js`, `re` et `er` sont toutes deux en `blau`).

## Le balisage des textes (`text`, `oc`, `de`…)
| On écrit | On obtient |
|---|---|
| `**infinitif**` | **gras** (le mot clé de l'écran) |
| `*parlar*` | un mot occitan, en italique |
| `[parl\|ar]` | *parl* + la fin **ar** dans la couleur de la clé `ar` |
| `[Parl\|i:ar]` | *Parl* + la fin **i**, couleur de la clé `ar` |
| `[\|-ar:ar]` | **-ar** entier en couleur |
| `[le module 4.1](/aprene/modul/4-1)` | un lien |
| `_oc:Titre_`, `_es:Título_` | un titre d'œuvre, avec sa langue |

(Dans ces tableaux, `\|` se lit `|` : on écrit `[parl|ar]`.)

**Où le balisage marche** : `text` des blocs `intro`, `nota`, `indic`, `seguida` ; `oc` des phrases de `colonas` ; `de` et `text` des `fonts` ; `detalh` des notions de `capitols.js`. **Partout ailleurs, texte brut** (un `*mot*` s'afficherait avec ses étoiles) : titres d'écran, `fr`, lignes de `relacionar` (`oc`, `fr`, `sens`, `indici`), `marcas`, `cartas` (`titol`, `gros`), `copas` (`fr`, `noms`). Les `paragrafes` de `cultura` suivent le balisage des leçons : `**gras**` et `*italique*` seulement.

**Pièges** :
- pas d'italique dans du gras (`**mot *clé* ici**` se casse) ;
- l'apostrophe est toujours la typographique `’`, jamais `'` (elle casserait la chaîne) ;
- les titres d'écran (`titol`) sont lus comme de l'occitan : les écrire en occitan ;
- `pages` d'un bloc `font` commence par « page » ou « pages » (« Source : *Gramatica…*, pages 63 et 64. »).

## Les blocs d'un écran
| `type` | Champs | Ce que c'est |
|---|---|---|
| `intro` | `text` | la phrase d'ouverture, en grand |
| `nota` | `text` | une remarque |
| `indic` | `text` | une aide discrète (« Touche une carte… ») |
| `seguida` | `text` | « Dans le parcours : [lien](/…) » |
| `font` | `pages`, `libre` (facultatif) | « Source : *Gramatica…*, page 63. » sous un écran tiré du livre ; avec `libre: CHABBERT` (de `libres.js`), un autre ouvrage |
| `cartas` | `items: [{ titol, gros, color, exemples: [['parl\|ar', 'parler'], …] }]` | des cartes de couleur ; au toucher, une bulle d'exemples |
| `copas` | `items: [{ mot: 'parl\|ar', fr, picto }]`, `noms: [{ oc, fr }, { oc, fr }]` | des mots coupés en deux parties nommées |
| `colonas` | `items: [{ titol, frasas: [{ picto, oc, fr }] }]` | deux colonnes de phrases (« Qui ? », « Quand ? ») |
| `relacionar` | `linhas: [{ oc, fr, forma: 'parl\|i:ar', sens, indici }]`, `mescla: [...]`, `etiqueta`, `bravo` | l'activité : chaque forme à sa ligne, corrigée ligne par ligne. `mescla` = exactement les formes des lignes (radical + fin, sans `\|` ni `:clé`), une fois chacune, dans le désordre : sinon l'activité est impossible |
| `marcas` | `linhas: [['i', 'ieu', 'parli'], …]` | le tableau à retenir (marque, qui, exemple) |
| `cultura` | `titol`, `paragrafes: [...]` | l'encart culture des leçons ; à droite sur grand écran |
| `fonts` | aucun | le bloc « Sources » de la fiche (dernier écran) |

Pictogrammes (`picto`) : la liste complète est dans `listas.js` (ceux de la grammaire : `ieu`, `escotar`, `vendre`, `voler` ; ceux du site : `forum`, `wiki`, `grops`, `carta`, `mots`, `parcors`…).

## Besoin d'autre chose ?
Un nouveau type de bloc, une nouvelle couleur ou un nouveau pictogramme se fait dans le code (`FichaGramatica.svelte`, `PictoFicha.svelte`, et sa ligne dans `listas.js`) : c'est un changement à faire contrôler (fiche de passation, `BRIEF-MISTRAL.md`). Une fiche seule ne touche que des données.

## Vérifier avant d'annoncer
`npm test` dans `app/` : `fichas.test.js` refuse une fiche fautive (notion inconnue, couleur absente, bloc ou pictogramme inconnu, activité impossible, source oubliée, apostrophe droite). Puis `npm run build`, et regarder la fiche (grand écran et téléphone, clair et sombre) : en local, un bloc mal nommé s'affiche « Bloc inconnu ».
