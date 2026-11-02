FICHE DE PASSATION : doutes A1 tranchés avec la grammaire de référence : 2026-11-02

1. **Ce qui a changé** : commit `c818e8f`, fusionné avec master dans `d19b06a`. Fichiers : vingt modules de `app/src/lib/lesson/moduls/` (2-1, 3-1, 3-2, 3-3, 4-2, 4-3, 4-4, 5-2, 6-1, 6-2, 7-1, 7-2, 7-3, 7-4, 8-1, 8-3, mission-a1, pausa-2, pausa-3, pausa-4), `cursus/lexic-A1.md`, les fiches de relecture régénérées (`cursus/modules/relectura/`), `DOBTES-OCCITAN.md`, `cahier-des-charges.md` (§11) et `PILOTATGE.md` (ligne 20).

2. **Pourquoi** : Romain a tranché les doutes A1-1 à A1-12 et A1-21 à A1-26, et a donné la *Gramatica de l'occitan estandard* (Academia Occitana, sous la direction de Florian Vernet) comme référence : « Il faut tout vérifier sur la base de ce livre ». Ligne du cahier §11 du 2026-11-02.

3. **Les choix et les options écartées**
   - *Fau de cosinièr* (*far de* + métier) retiré, remplacé par *Soi cosinièr* et *Es cosinièr*. Écarté : garder les deux formes. Raison : tournure absente de lo Congrès, du Wiktionnaire et de la grammaire ; calque du catalan *fer de*. La question *Qué fas dins la vida ?* reste.
   - *verd* « BÉRT » (le *d* sonne « t » après *r*) : réponse de Romain, dans le sens de la grammaire. Écarté : « BÉR ». *verd* sort des exemples de consonne muette (7.3, 7.4), remplacé par *grand* et *blanc*.
   - *dimars* « di-MARS » : réponse de Romain. Écarté : « di-MAS ».
   - *suls* (*sus* + *los*) ajouté au tableau des mots soudés de 7.2, avec *suls canapès*. Écarté : *sus los*. Raison : la grammaire emploie *suls*, et la Wikipèdia occitane bien plus souvent (environ 2 950 articles contre 236).
   - L'adjectif après le nom en 7.3 (*un ostal vièlh*), avec un exercice : c'est sa place habituelle selon la grammaire. Écarté : *un vièlh ostal* en A1, parce que devant le nom le sens change ; reporté à l'A2.
   - De 31 à 99 : *trenta un*, en deux mots, comme dans la grammaire. Écarté : *trenta-un* et *trenta e un*. Noté au lexique seulement : l'A1 n'enseigne que les dizaines.
   - *occitan* « ou-tsi-TA » gardé (usage de Romain), avec une note en 2.1 : la grammaire dit « ou-tsi-TAN ».

4. **Comment c'est vérifié**
   - `node scripts/controle-explications.mjs` : « Tout est expliqué ». Il signalait d'abord *canapès* ; le mot est déclaré traduit sur place (`glosa`) dans le tableau de 7.2, comme ailleurs dans les modules.
   - `npx vitest run` : 71 tests passés. `npm run build` : passe.
   - `node scripts/verificar-oc.mjs suls canapès sul vièlh nòva` : *vièlh* et *nòva* confirmés ; *suls*, *sul* et *canapès* absents du Basic, qui ne donne ni les mots soudés ni les pluriels. La grammaire emploie *sul* et *suls* ; *canapès* suit sa règle générale du pluriel en *-s*.
   - **Non vérifié** : les prononciations à l'oreille (la voix de Romain viendra à l'enregistrement) ; le rendu du nouveau tableau de 7.2 sur téléphone avant la mise en ligne (contrôlé ensuite sur loligam.eu).

5. **Risques et points les moins sûrs**
   - Le livre a été lu par reconnaissance de caractères sur un scan : un passage peut avoir été mal lu.
   - L'Academia Occitana et lo Congrès sont deux organismes distincts ; quand ils divergent, on le dit à Romain, qui tranche.
   - La note de 2.1 dit que les deux prononciations s'entendent : c'est un constat d'usage, pas une citation du livre.

6. **À challenger**
   - La note sur *occitan* en 2.1 est-elle juste et claire pour un débutant ?
   - *suls canapès* est-il un bon exemple, ou un autre nom masculin pluriel serait-il plus naturel ?
   - Existe-t-il une attestation languedocienne de *far de* + métier qui nous aurait échappé ?

7. **Périmètre** : ne pas rouvrir les formes gardées par Romain (liste au cahier §11, 2026-11-02) ; aucune citation longue du livre, protégé par le droit d'auteur ; tout occitan reste validé par Romain avant publication.
