# Recherche pédagogique : 17 règles pour écrire l'A1

> 2026-11-01 · pour les rédacteurs du module 0, des unités 2 à 8, des haltes et de la mission A1 · lecture : 8 minutes, ou 3 en ne lisant que les lignes « Dans nos modules »

Complète le cadre (`cursus/00-cadre-methodologique.md` §4) et l'état de l'art (`etat-de-l-art-parcours.md` §3) sans les répéter ; ne change ni la carte, ni les six étapes, ni les types de blocs, et n'exige aucun son. Aucune des études citées ne porte sur l'occitan : un résultat étendu à notre cas est signalé « par analogie ».

**Haltes et mission A1** : règles 1 à 4, 7, 8, 13 et 16 (la mission, aussi la 11).

---

## Partout

### 1. Peu de neuf à la fois, et à des moments éloignés

Pas plus de 5 expressions neuves par bloc `chunks` ; chaque mot neuf revient à des moments éloignés, puis dans les deux modules suivants.

- **Pourquoi.** La mémoire de travail garde 3 à 5 éléments, et l'espacement compte plus que la taille du lot.
- **Source.** [Cowan 2010](https://doi.org/10.1177/0963721409359277) (le seuil de 5, par analogie) ; [Kim et Webb 2022](https://doi.org/10.1111/lang.12479) ; [Uchihara et al. 2019](https://doi.org/10.1111/lang.12343) ; [Nakata et Webb 2016](https://doi.org/10.1017/s0272263115000236).
- **Dans nos modules.** Couper l'encadré de `lexic-A1.md` en blocs de 5 lignes au plus (mêmes `id`), placés avant l'exercice qui les emploie ; chaque `id` paraît dans trois étapes au moins (dialogue ou À retenir, jeu, *A tu !*).

### 2. Personne n'est jugé

Aucun texte ne juge la façon de parler de la personne ni celle des natifs : il décrit la situation et la forme.

- **Pourquoi.** Même compétents, des nouveaux locuteurs du basque ne se sentent pas « vrais » locuteurs, et l'idéal du locuteur traditionnel leur retire l'authenticité (irlandais).
- **Source.** [Ortega et al. 2015](https://doi.org/10.1515/ijsl-2014-0033) ; [O'Rourke et Walsh 2015](https://doi.org/10.1515/ijsl-2014-0032).
- **Dans nos modules.** Ni « faute », ni « vrai occitan », ni « patois » dans `explain`, `reaccion` ou les notes : on écrit ce qui se passe (« Marià hausse un sourcil : on vouvoie une dame qu'on ne connaît pas », 1.2).

---

## Étape 1 · *Révision du jour*

### 3. Produire avant de voir

La personne essaie de dire ou d'écrire la réponse avant de la voir.

- **Pourquoi.** Se tester fait mieux retenir que relire, et produire profite plus que reconnaître.
- **Source.** [Roediger et Karpicke 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x) ; [Rowland 2014](https://pubmed.ncbi.nlm.nih.gov/25150680/).
- **Dans nos modules.** 4 ou 5 questions, dont 2 au moins en `escriure` ou `reveal` (essai, puis modèle), les autres en `qcm` à 3 choix ; jamais la réponse dans la question ; 5 minutes au plus.

### 4. Chaque chose apprise a ses deux cartes

Chaque `id` de « À retenir » est testé une fois en reconnaissance (`qcm`, `causida`, `carta`) et une fois en production (`order`, `escriure`), avec `choses` rempli.

- **Pourquoi.** Le carnet note « je reconnais » avec les trois premiers types, « je produis » avec les deux autres, puis FSRS planifie chaque carte.
- **Source.** `app/src/lib/carnet/regles.js` ; [FAQ d'Anki sur FSRS](https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm).
- **Dans nos modules.** `reveal`, `chunks`, `table` et `note` ne nourrissent pas le carnet. Pas de choix absurde ni de réponse dans l'énoncé : une réussite facile fait croire la carte sue.

---

## Étape 2 · *Escota*

### 5. Une question globale avant le texte

L'*Escota* demande d'abord de comprendre l'ensemble (qui ? où ? de quoi ?), puis seulement les détails.

- **Pourquoi.** Guider l'écoute par étapes a mieux fait progresser que réécouter sans guidage, surtout les moins à l'aise (écoute ; lecture par analogie).
- **Source.** [Vandergrift et Tafaghodtari 2010](https://doi.org/10.1111/j.1467-9922.2009.00559.x).
- **Dans nos modules.** L'intro du `dialogue` finit par « Lis une première fois pour répondre à une seule question : … » ; le `qcm` suivant commence par cette question, puis 2 questions de détail.

### 6. Des expressions entières, vues dans une scène

Une formule (*D'ont siás ?*, *Soi de…*) s'apprend d'un bloc, dans une scène, avant d'être analysée.

- **Pourquoi.** Un répertoire d'expressions toutes faites fait paraître plus aisé à l'oral (petite expérience, 32 étudiants).
- **Source.** [Boers et al. 2006](https://doi.org/10.1191/1362168806lr195oa).
- **Dans nos modules.** Chaque ligne de `chunks` est une phrase ou une formule complète avec son `sound` ; l'*Obsèrva* explique la forme après l'*Escota*, et aucun tableau avant que la forme ait paru six fois (cadre §4).

---

## Étape 3 · *Obsèrva* et tout exercice qui se corrige tout seul

### 7. Une ligne d'explication à chaque réponse, un indice quand c'est faux

Chaque item a un `explain` (forme et raison, même quand c'est juste) ; quand c'est faux, la réaction met sur la piste sans donner la réponse.

- **Pourquoi.** Expliquer fait bien plus progresser que « juste ou faux » (0,49 contre 0,05), et les indices battent la réponse donnée (oral en classe, par analogie).
- **Source.** [Van der Kleij et al. 2015](https://doi.org/10.3102/0034654314564881) ; [Butler et Roediger 2008](https://pubmed.ncbi.nlm.nih.gov/18491500/) ; [Lyster et Saito 2010](https://doi.org/10.1017/s0272263109990520).
- **Dans nos modules.** `explain` partout, forme en italique, raison en mots simples. Dans un `causida`, `reaccion` raconte l'effet dans l'histoire (« Marià sourit et regarde le ciel : il fait nuit depuis longtemps », 1.2), pas « non, c'est *Bon ser* ».

### 8. Des mauvais choix qui existent

Dans un `qcm`, les mauvais choix sont de l'occitan juste pris ailleurs ou du français, jamais une forme déformée ; trois choix au plus.

- **Pourquoi.** Lire un faux choix le rend plus probable comme réponse plus tard, d'autant plus qu'il y en a beaucoup.
- **Source.** [Roediger et Marsh 2005](https://doi.org/10.1037/0278-7393.31.5.1155).
- **Dans nos modules.** *Cossí vas ?* comme faux choix de *Cossí te dison ?* (1.3) convient ; une orthographe fantaisiste non. Exception : au son du jour, le faux choix est la lecture à la française, corrigée aussitôt dans `explain`.

---

## Étape 4 · *Lo jòc del jorn*

### 9. Le jeu est le travail, pas son habillage

Si on retire personnages, points et mise en scène, la même chose reste à faire sur la forme du jour.

- **Pourquoi.** Un jeu qui porte le contenu a fait apprendre plus, et rejouer sept fois plus longtemps, qu'un jeu-récompense (enfants, par analogie).
- **Source.** [Habgood et Ainsworth 2011](https://doi.org/10.1080/10508406.2010.508029).
- **Dans nos modules.** Après avoir choisi le jeu dans le tableau §5 de `regles-redaccion-A1.md`, se demander : « peut-on réussir sans comprendre la forme (par élimination, par la position) ? ». Si oui, refaire les choix.

---

## Étape 5 · *A tu !*

### 10. Parler de soi

Au moins la moitié des consignes demandent quelque chose de vrai sur la personne (sa ville, sa famille, son quotidien), pas sur les personnages.

- **Pourquoi.** Ce qu'on rapporte à soi se retient mieux (psychologie générale, par analogie).
- **Source.** [Symons et Johnson 1997](https://doi.org/10.1037/0033-2909.121.3.371).
- **Dans nos modules.** `escriure` avec `debut` pour les réponses ouvertes (« Dis d'où tu es », 1.3) ; `reveal` « présente quelqu'un que tu connais » ; les phrases sur les personnages restent des `order`.

### 11. Une tâche nette, redite

La tâche de x.4 a un résultat visible (8 phrases, un plan, un enregistrement), aucun mot neuf, et se refait à voix haute une seconde fois.

- **Pourquoi.** L'enseignement par les tâches a un effet moyen (g = 0,61), et refaire la même tâche orale fait gagner en aisance.
- **Source.** [Xuan et al. 2022](https://doi.org/10.1177/13621688221131127) ; [Lambert et al. 2017](https://doi.org/10.1017/s0272263116000085).
- **Dans nos modules.** `escriure`, puis `reveal` (le modèle), puis `checklist` de critères, puis « redis-la sans regarder ». Pas de chrono en A1, sauf 6.4 (40, 30, 20 secondes) comme la carte.

### 12. Un destinataire et une raison

Chaque tâche met la personne face à quelqu'un de précis et lui fait choisir pourquoi elle lui parlerait occitan.

- **Pourquoi.** En breton, le manque d'usage est souvent un manque de sens ; se voir parler la langue prédit l'effort prévu (r = 0,61), peu la réussite (r = 0,20).
- **Source.** [Grimault 2025](https://doi.org/10.70675/1e89716ezd685z4a57z918fz5fd82a4bbc9a) ; [Al-Hoorie 2018](https://doi.org/10.14746/ssllt.2018.8.4.2).
- **Dans nos modules.** La consigne de x.4 nomme la personne (« la prochaine fois que tu croises ta voisine… ») ; l'intro de x.1 demande « À qui voudrais-tu dire cela en occitan ? ».

### 13. Savoir rester en occitan

À partir de 2.4, chaque tâche, chaque halte et la mission comptent un tour où l'interlocuteur passe au français ou parle vite, et où la bonne réplique vient de 2.3 (faire répéter, demander de ralentir).

- **Pourquoi.** En langue minoritaire, les adultes butent sur l'interlocuteur qui passe à la langue dominante, le débit rapide et l'écart entre la classe et la rue.
- **Source.** [Newcombe 2007, d'après le compte rendu de Lewis 2009](https://journal.uwp.co.uk/wje/article/282/galley/301/view) (gallois) ; [Grimault 2025](https://doi.org/10.70675/1e89716ezd685z4a57z918fz5fd82a4bbc9a) (breton) ; [Walsh et al. 2015](https://universityofgalway.ie/about-us/news-and-events/news-archive/2015/october2015/research-report-on-new-irish-speakers-launched-at-oireachtas-na-samhna-2015.html) (irlandais).
- **Dans nos modules.** Un tour de `causida` où un personnage répond en français, plus vite ; les choix sont des phrases déjà vues ; le mauvais choix laisse la conversation basculer en français, avec une `reaccion` bienveillante. Aucun mot neuf.

---

## Étape 6 · *Lo son e lo bilanç*

### 14. L'écrit toujours avec son « ça sonne comme »

Tout mot neuf montre écriture et `sound` ensemble ; la première fois qu'une lettre ne se lit pas comme en français, une ligne le dit.

- **Pourquoi.** L'écriture aide ou gêne la prononciation selon que ses lettres se lisent comme dans la langue qu'on connaît déjà.
- **Source.** [Hayes-Harb et Barrios 2021](https://doi.org/10.1017/s0261444820000658).
- **Dans nos modules.** `sound` sur chaque réplique, chaque ligne de `chunks` et chaque entrée de glossaire ; une ligne pour *o* / *ò*, *nh*, *lh*, *ch*, le *-a* final et le *-r* final, au premier module où ils paraissent.

### 15. Un seul son par module, pour se faire comprendre

Un seul trait, lié à la forme du jour, qui change le mot ou le sens ; travaillé avec les mots du module, revu dans les deux suivants.

- **Pourquoi.** La prononciation s'enseigne bien (d = 0,8 à 0,9), surtout longtemps, avec retour et sur un trait précis ; un accent marqué n'empêche pas toujours d'être compris.
- **Source.** [Lee et al. 2015](https://doi.org/10.1093/applin/amu040) ; [Saito et Plonsky 2019](https://doi.org/10.1111/lang.12345) ; [Munro et Derwing 1995](https://doi.org/10.1111/j.1467-1770.1995.tb00963.x).
- **Dans nos modules.** Une `note` 'son' de 3 phrases, un `qcm` « L'oreille » de 2 items, un `reveal` « répète à voix haute », comme en 1.3. On ne note jamais l'accent.

### 16. Le bilan dit ce qu'on sait faire, sans note

Une `checklist` de gestes concrets, puis une phrase qui nomme ce qu'on sait faire désormais ; ni score, ni étoiles.

- **Pourquoi.** Se sentir compétent, libre et relié aux autres entretient la motivation ; un retour positif qui informe la renforce, les récompenses promises l'abîment (d = -0,28 à -0,40).
- **Source.** [Ryan et Deci 2000](https://doi.org/10.1037/0003-066X.55.1.68) ; [Deci et al. 1999](https://doi.org/10.1037/0033-2909.125.6.627).
- **Dans nos modules.** 3 à 5 items qui commencent par un verbe d'action ; dernière ligne : « Tu sais maintenant dire d'où tu es. » Un vrai choix par module (quelle ville, quel métier).

### 17. Le défi de la semaine

Le bilan se termine par un défi facultatif : une phrase du module, une personne réelle, un moment choisi à l'avance.

- **Pourquoi.** Décider d'avance « si telle situation, alors je fais cela » aide à passer à l'acte (d = 0,65) ; au Pays basque, un défi commun de 11 jours a fait passer de 66,5 % à 86,6 % la part des participants parlant basque à la plupart de leurs proches, puis 72,1 % trois mois après (déclaré, volontaires).
- **Source.** [Gollwitzer et Sheeran 2006](https://doi.org/10.1016/S0065-2601%2806%2938002-1) ; [Euskaraldia I](https://soziolinguistika.eus/wp-content/uploads/2021/03/a-Txostena_ENG-1.pdf).
- **Dans nos modules.** Une `note` 'task' « Défi de la semaine » : une phrase de l'« À retenir », une personne, « Quand ? Où ? ». Aucun suivi, aucune série : si on ne le fait pas, rien ne se passe.

---

## Ce qu'on ne fait pas

1. Pas de points, étoiles, classements, séries ni compte à rebours dans un module : les récompenses promises abîment l'intérêt ([Deci et al. 1999](https://doi.org/10.1037/0033-2909.125.6.627)), et la ludification n'aide qu'un peu, sans que l'effet sur la motivation tienne dans les études les plus rigoureuses ([Sailer et Homner 2020](https://doi.org/10.1007/s10648-019-09498-w)).
2. Pas de faux jeu (règle 9), pas de décor hors sujet (musique, mascotte qui bouge, anecdote sans lien) : les détails séduisants nuisent à l'apprentissage ([Sundararajan et Adesope 2020](https://doi.org/10.1007/s10648-020-09522-4), [résumé de l'université de l'État de Washington](https://news.wsu.edu/press-release/2020/03/19/seductive-details-inhibit-learning)). L'humour reste quand il naît de la situation.
3. Pas de liste récitée de mots voisins (nombres, jours, couleurs), ni deux mots qui se ressemblent le même jour (*tres* en 3.1, *trenta* en 5.2, comme la carte) : mêmes scores aux tests, mais plus de confusions ([Nakata et Suzuki 2018](https://doi.org/10.1017/s0272263118000219)).
4. Pas plus de 5 nouveautés par bloc (règle 1), pas de règle de plus de 8 lignes, pas de tableau de conjugaison complet (cadre §4 et §5).
5. Pas de mot qui juge : « faute », « vrai occitan », note sur l'accent (règles 2 et 15).

---

## À tester avec Romain plus tard

Ce qui demande du code, des enregistrements, ou seulement quelques élèves de visio.

1. **Écouter d'abord, lire ensuite** (code, enregistrements). Texte masqué à la première écoute, question globale à l'écran. Test : 3 élèves, avec ou sans texte.
2. **Plusieurs voix pour les sons difficiles** (enregistrements). Trois voix au moins, dont une d'un autre pays, sur *o* / *ò*, *e* / *è*, *lh*, *nh* et le *-a* final, puis un jeu « L'oreille des pays » ([Uchihara et al. 2025](https://doi.org/10.1017/s0272263125100879), 79 études ; [Sakai et Moorman 2018](https://doi.org/10.1017/s0142716417000418)). Sur 16 semaines, la classe a mieux fait progresser l'écoute que Duolingo ([González-Fernández et de la Viña 2025](https://doi.org/10.64152/10125/73656)).
3. **Défi de la semaine avec un seul rappel** (code). « L'as-tu dit ? », puis trois relevés (avant, après 11 jours, après 3 mois) comme Euskaraldia. Jamais de série, jamais de culpabilité.
4. **Parler avec des gens** (organisation). Groupes de 5 ou 6 en café, une heure par semaine ([Mintzapraktika](https://soziolinguistika.eus/en/ekitaldia/mintzapraktika-2), Pays basque), ou paires bénévole-apprenant ([Voluntariat per la llengua](https://www.cpnl.cat/ca/voluntariat-per-la-llengua/), Catalogne, depuis 2003) ; relier à l'annuaire des groupes. Test : 2 ou 3 élèves, un mois.
5. **« L'autre passe au français »** (visio). Romain bascule en français en pleine tâche : l'élève revient-il à l'occitan avec les phrases de 2.3 ?
6. **Cartes ouvertes trop tôt** (mesure). Si presque toutes les cartes « je produis » sont ratées juste après leur ouverture, la reconnaissance s'est acquise par chance : passer à quatre choix ou exiger une production.
7. **Où s'arrête-t-on** (comptage sans identité). L'étape de sortie de chaque module. Une étude indépendante sur l'arrêt dans une application ([Sudina et al. 2025](https://doi.org/10.1016/j.lindif.2025.102704), 601 débutants sur Duolingo) n'a testé que des traits de la personne (la ténacité et l'âge ressortent), jamais la conception de la leçon.

---

## Limites de cette synthèse

- Chaque source a été ouverte et son résumé relu le 2026-11-01. Aucune des études citées ne porte sur l'occitan ; les effets sont surtout mesurés sur des étudiants, dans d'autres langues : des ordres de grandeur, pas des promesses.
- Langues minoritaires : surtout des entretiens et des rapports de programmes ; Euskaraldia donne des réponses déclarées de volontaires ; aucune évaluation indépendante trouvée de Mintzapraktika ni du Voluntariat per la llengua ; rien d'indépendant non plus sur Babbel (études d'éditeur écartées, état de l'art §2.1).
- À corriger dans l'état de l'art (§3.1, point 8) : le lien « Bygate 2001 » mène à Lambert, Kormos et Minn (répétition de tâche).
