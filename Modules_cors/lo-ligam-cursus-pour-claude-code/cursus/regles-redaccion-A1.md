# Rédiger l'A1 : les règles communes (2026-11-01)

> Pour les rédacteurs du module 0, des unités 2 à 8, des quatre haltes et de la mission A1.
> Demande de Romain du 2026-11-01 : « fais-moi l'ensemble du parcours », version simple, sans nouvelle animation, à tester en ligne. Romain relit tout l'occitan avant que le module soit dit relu.

## 1. Ce qu'on écrit, et où

- Un module = un fichier `app/src/lib/lesson/moduls/modul-<slug>.js`, **déjà créé vide et déjà inscrit** dans `index.js`. Tu remplis seulement tes fichiers. Ne change ni `slug`, ni `unitat`, ni le nom de la variable exportée (le fil de l'unité regroupe les modules par `unitat`).
- **Le modèle à copier** : l'unité 1, `modul-1-1.js` à `modul-1-4.js`. Même structure d'objet, mêmes noms de champs, mêmes types de blocs, même ton. Lis au moins `modul-1-1.js` (avec sa carte de titre `ouverture`) et `modul-1-3.js` en entier avant d'écrire.
- La carte validée par Romain fait foi : `cursus/01-A1-carta-8-unitats.md` (§2 le chemin d'une unité, §3 le chemin d'un module, §4 et §5 les tableaux de chaque unité : question-titre, forme du jour, mots, son du jour, jeu).

## 2. Les sources préparées pour toi (même dossier `cursus/`)

| Fichier | Ce que tu y prends |
|---|---|
| `lexic-A1.md` | **l'encadré « À retenir » exact de chaque module** (`id`, `oc`, `sound`, `fr`), la forme du jour et son paradigme, le son du jour, la spirale (ce qui revient) |
| `alhors-en-occitania-A1.md` | l'encart *Alhors en Occitània* de ton unité, prêt à coller |
| `cultura-A1.md` | les faits culturels, la chanson (lien seulement), le texte court de ton unité |
| `../../../revisions/2026-11-01-recerca-pedagogica.md` | les règles tirées de la recherche (section 9 ci-dessous) |

## 3. Le chemin

**Une unité** : x.1, x.2, x.3 (un seul point de forme chacun, titrés par la question de la carte), puis x.4, la tâche (aucun mot nouveau). Le module x.1 porte la carte de titre de l'unité (`ouverture`, comme 1.1). Le module x.4 se termine par **le mémo de l'unité** (les blocs tout faits et un mini-tableau, rien de plus) puis par l'encart ***Alhors en Occitània***.

**Un module** : les six étapes de la carte §3, avec leurs titres de l'unité 1 :
1. *Révision du jour* (5 minutes au plus) : questions de mémoire sur les modules précédents (la séance tirée du carnet sera codée plus tard) ;
2. *Escota* : une petite scène lue (pas encore de son : voir §6), puis une question de compréhension ;
3. *Obsèrva* : on repère la forme du jour dans des exemples, puis on l'explique simplement ;
4. *Lo jòc del jorn* : **le jeu de la carte**, adapté aux blocs existants (§5) ;
5. *A tu !* : on parle et on écrit pour soi ;
6. *Lo son e lo bilanç* : le son du jour, puis « ce que je sais faire » (`checklist`).

Une halte (`pausa-1` à `pausa-4`) : du réemploi qui **mêle les deux unités** (situations nouvelles, pas de mot nouveau), puis un bilan : une `checklist` de ce qu'on sait faire et un lien vers le carnet (`/aprene/carnet`). La mission A1 : lire une affiche de fête, écouter un message, préparer sa présentation pour la visio, écrire un court message ; seulement des mots de l'A1.

## 4. « Rien sans explication » (contrôlé par programme)

- Chaque mot occitan d'un module est dans son encadré « À retenir » (bloc `chunks`, items avec `id`) **ou** dans celui d'un module précédent (ordre de `index.js`).
- Sinon, il est **glosé en passant** : `glossary: [{ oc, fr }]` dans un bloc `dialogue`, ou `glosa: { 'mot occitan': 'traduction' }` sur n'importe quel bloc. C'est le cas des formes des autres dialectes (encart *Alhors*), des citations culturelles, des prénoms et lieux (les prénoms vont dans `nomsPropris`).
- Dans les textes en français, **l'occitan est toujours en italique** (`*Adieu*`) : c'est ainsi que le programme le trouve.
- L'encadré « À retenir » reprend **exactement** les items de `lexic-A1.md` pour ton module (mêmes `id`, que les autres modules et le carnet utilisent). Un écart nécessaire : garde-le minimal et signale-le dans ton compte rendu.
- Chaque exercice auto-corrigé dit ce qu'il teste : champ `choses: ['id', …]` (voir 1.1).

## 5. Les jeux : seulement les blocs qui existent

Types disponibles : `dialogue`, `qcm`, `table`, `chunks`, `order` (tuiles), `escriure` (écrire au clavier), `causida` (dialogue à choix), `carta` (carte des villes), `checklist`, `reveal`, `note`. **Aucun nouveau type, aucune animation nouvelle.** Quand la carte prévoit un jeu qui n'existe pas encore, adapte-le et laisse un commentaire `// jeu prévu par la carte : … (à coder)` :

| Jeu de la carte | Version simple |
|---|---|
| dictée de nombres, écouter les prix | `escriure` (« Écris en lettres : 14 ») ou `qcm` |
| l'arbre, glisser à sa place, placer les aiguilles, toucher l'objet | `qcm` ou `order` |
| anagrammes, lettres à cocher | `order` avec des lettres en tuiles, ou `escriure` |
| mots mêlés | `qcm` ou `reveal` |
| dialogue à choix, jeu de rôle | `causida`, puis `escriure` ou `checklist` |
| « Ont es ? » sur un plan de ville | `qcm` ou `order` (itinéraire) |
| bulletin météo à écouter | `dialogue` lu, puis `qcm` |

Varie les jeux d'un module à l'autre : pas deux fois le même jeu du jour dans une unité.

## 6. Les sons, pour l'essai : à l'écrit

Décision de Romain du 2026-11-01 : pas de son pour l'essai. Chaque réplique et chaque item porte son champ `sound` (« ça sonne comme », syllabe forte en majuscules), comme dans l'unité 1. Ne cite aucun fichier audio. Les listes d'enregistrement se génèrent ensuite toutes seules (`node scripts/fichas-relectura.mjs`). Prononciation : l'usage vivant du Sud, celui de Romain (*adieu* = « a-DIOU », *v* sonne « b », *-r* de l'infinitif muet) ; jamais d'exemple fondé sur un contraste du français standard que l'accent du Sud ne fait pas.

## 7. La langue et le ton

- Languedocien, graphie classique ; formes fixées par Romain : *Vau plan, mercés*, *Al còp que ven*, *siás* pour « tu es » (cadre §3).
- Tutoiement partout. Pas de tiret long « — » (sauf tirets de dialogue), pas de jargon anglais, ponctuation légère. Pas de slogan inventé.
- L'esprit : la langue est vivante, portée par des gens, ancrée dans des lieux. La culture passe par de petites notes justes et sourcées (`cultura-A1.md`), jamais par la grandiloquence. Humour fin par touches.
- Personnages déjà vus : Yasmine, Loís, Marià, Lisa, Núria, Karim. L'unité 4 suit la semaine de Loís, l'unité 7 se passe dans la maison de Marià. Une distribution variée (âges, origines), sans cliché.
- Inclusif : *occitan / occitana*, les deux genres montrés quand la forme change.

## 8. Vérifier avant de rendre

1. `node --check` sur chacun de tes fichiers.
2. Chaque mot occitan nouveau pour toi (hors `lexic-A1.md`, déjà vérifié) : depuis `C:/Users/perie/Depots/Lo_Ligam/app` **uniquement** (la clé y est), `node scripts/verificar-oc.mjs mot1 mot2 …`. Ne copie jamais `.env`, n'affiche jamais la clé, ne garde pas les réponses brutes de l'API. Absent du Basic = `⚠️` dans `notesRelecture`, sans remplacement inventé.
3. Depuis ta copie de travail (`…/musing-kalam-aae136/app`) : `node scripts/controle-explications.mjs <slug>`. Il peut échouer à cause d'un autre module encore en cours d'écriture : relance plus tard, ne touche jamais aux fichiers des autres.
4. `notesRelecture` : au plus six questions pour Romain, chacune tranchable par oui ou non ou par un choix entre deux formes.
5. **Aucune commande git qui modifie** (pas d'add, commit, push, stash, checkout) : Claude, la conversation principale, intègre et publie.

## 9. Ce que dit la recherche

Synthèse complète, avec les sources : `revisions/2026-11-01-recerca-pedagogica.md` (17 règles). **À appliquer dans chaque module** :

1. **Peu de neuf à la fois** : l'« À retenir » du lexique se coupe en blocs `chunks` de 5 lignes au plus (mêmes `id`), placés juste avant l'exercice qui les emploie ; chaque `id` paraît dans trois étapes au moins.
2. **Personne n'est jugé** : jamais « faute », « vrai occitan », « patois » ; on raconte ce qui se passe (« Marià hausse un sourcil… »).
3. **Révision du jour** : 4 ou 5 questions, dont 2 au moins en `escriure` ou `reveal` (essai, puis modèle) ; les autres en `qcm` à 3 choix ; jamais la réponse dans la question.
4. **Deux cartes par chose** : chaque `id` est testé en reconnaissance (`qcm`, `causida`…) **et** en production (`order` ou `escriure`), avec son champ `choses` ; `reveal`, `chunks`, `table`, `note` ne nourrissent pas le carnet.
5. ***Escota*** : l'intro du `dialogue` finit par une seule question globale (« Lis une première fois pour répondre à… ») ; le `qcm` suivant l'ouvre, puis deux questions de détail.
6. **Des expressions entières** : chaque ligne de `chunks` est une formule complète avec son `sound` ; l'*Obsèrva* explique après l'*Escota* ; pas de tableau avant que la forme ait paru plusieurs fois.
7. **Une ligne d'explication à chaque réponse** : `explain` partout ; dans un `causida`, `reaccion` raconte l'effet dans l'histoire, pas « non, c'est… ».
8. **Des mauvais choix qui existent** (une vraie formule voisine), jamais une orthographe fantaisiste ; seule exception : au son du jour, la lecture à la française, corrigée aussitôt.
9. **Le jeu est le travail** : si on peut réussir sans comprendre la forme (élimination, position), refaire les choix.
10. **Parler de soi** : `escriure` avec `debut` pour les réponses ouvertes ; `reveal` « présente quelqu'un que tu connais ».
11. **La tâche** (x.4) : `escriure`, puis le modèle en `reveal`, puis une `checklist` de critères, puis « redis-la sans regarder ». Pas de chronomètre en A1, sauf 6.4.
12. **Un destinataire réel** : la consigne de x.4 nomme la personne ; l'intro de x.1 demande « À qui voudrais-tu dire cela en occitan ? ».
13. **Rester en occitan** : dès 2.4, dans chaque tâche, un tour de `causida` où un personnage passe au français, plus vite ; la bonne réplique est une phrase déjà vue ; aucun mot neuf.
14. **Le « ça sonne comme » partout** : `sound` sur chaque réplique, chaque ligne de `chunks`, chaque entrée de glossaire.
15. **Un seul son par module** : une `note` « son » de trois phrases, un `qcm` « L'oreille » de deux items, un `reveal` « répète à voix haute », comme en 1.3. On ne note jamais l'accent.
16. **Le bilan dit ce qu'on sait faire, sans note** : 3 à 5 items qui commencent par un verbe d'action ; dernière ligne « Tu sais maintenant… ».
17. **Le défi de la semaine** (en fin de module) : une `note` « Défi de la semaine » : une phrase de l'« À retenir », une personne, « Quand ? Où ? ». Aucun suivi, aucune série.
