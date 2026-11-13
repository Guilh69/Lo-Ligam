# Interview de Romain sur l'outil photo de S'imagina (2026-11-13)

> Six questions posées par L'amic dans la discussion mère, une à la fois. Les réponses sont celles de Romain : il a choisi parmi des options écrites par l'IA. La synthèse de la fin est de l'IA, à corriger par lui.

Point de départ, mots de Romain : « il faut reprendre l'outil photo », puis « Je veux rapatrier la discussion en sous discussion ici et il faut m'intervieewer pour comprendre ce que je veux ».

## Les six réponses

| | Question | Réponse de Romain | Ce que l'option disait | Options non retenues |
|---|---|---|---|---|
| 1 | Quand l'outil est réussi, que fait le visiteur ? | **Il imagine sur tes photos** | Il désigne un endroit sur une photo de Romain et dit ce qu'il y verrait. Résultat immédiat, donc plutôt une esquisse. | Il regarde (bascule français / occitan, Romain seul fabrique) ; il apporte sa rue (sa propre photo) |
| 2 | Que voit-il ensuite ? | **Une esquisse tout de suite** | Le site pose une plaque, une enseigne ou une affiche type dans la zone. Assumé comme un dessin sur la photo. Aucun coût à l'usage, on sort de la course au réalisme. | Un vrai montage, plus tard ; les deux |
| 3 | Comment écrit-il ce qu'il imagine ? | **Il choisit dans une liste** | Mots prêts, vérifiés par lo Congrès. Aucune faute, rien à modérer. Moins libre. | Français traduit par le site ; occitan vérifié par le site ; liste puis champ libre |
| 4 | Que devient l'esquisse ? | **Ça reste chez lui** | Il voit son esquisse, peut l'enregistrer en image et la partager lui-même. Le site ne garde rien : ni base, ni modération, ni donnée personnelle. | Ça s'ajoute aux autres ; ça arrive à Romain seul |
| 5 | S'imagina doit « faire réfléchir ». Avec quoi repart-il ? (plusieurs réponses) | **Un possible, une question, une audace** | Un possible : il a vu sa ville en occitan, l'image fait le travail. Une question : pourquoi l'occitan n'est-il pas dans la rue, court texte sourcé. Une audace : un geste à faire dans la vraie vie. | (les trois ont été retenues) |
| 6 | Sur quelles photos, et avec quelle liberté ? | **Sélection, endroits repérés** | 10 à 20 rues choisies par Romain ; les bons endroits sont déjà marqués et le visiteur en touche un. Plus simple au téléphone, toujours bien placé, moins libre. On commence par 3 ou 4 photos. | Sélection où il entoure librement ; toutes les photos de rue |

## Ce que ça dessine (synthèse de l'IA)

Un atelier public, pas une galerie de montages.

1. Le visiteur ouvre une photo de rue choisie par Romain.
2. Il touche un endroit déjà repéré (un mur, un fronton, un coin de rue).
3. Il prend un mot dans une liste vérifiée par lo Congrès.
4. Le site pose tout de suite une esquisse à cet endroit : un dessin assumé, pas un faux.
5. Il peut enregistrer l'image. Le site ne garde rien.
6. Il repart avec trois choses : un possible (l'image), une question (pourquoi l'occitan n'est pas dans la rue), une audace (un geste dans la vraie vie).

## Ce que ça change

- On sort de la course au réalisme. Trois montages réalistes avaient été rejetés (perspective, netteté, emplacement).
- Ni base de données, ni modération, ni donnée personnelle : tout se passe dans le navigateur du visiteur.
- `/admin/imaginar`, déjà construit, devient l'outil où Romain marque les endroits repérés.
- La perspective mesurée (`app/src/lib/imagina/perspectiva.js`) garde son utilité : l'esquisse est posée dans le plan du mur.

## Laissé ouvert

- Le choix des 10 à 20 photos (sans commerce reconnaissable). On commence par 3 ou 4.
- Le texte de la « question » et les gestes d'« audace » : brouillons de l'IA, à relire par Romain. Pas de slogan inventé.
- Le sort des montages réalistes déjà faits (essai `/ensag/fotos-oc`, outil `outils/photos-oc/talhar.py`).
