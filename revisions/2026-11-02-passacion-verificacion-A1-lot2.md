# Fiche de passation : l'A1 vérifié contre la grammaire de référence, lot 2 (2026-11-02)

1. **Ce qui a changé** : modules `app/src/lib/lesson/moduls/` 2-2, 5-1, 6-2, 7-2, 7-3, 7-4, 8-2, 8-3, 8-4 et `pausa-4` (identifiants du carnet inchangés : `frutas-legums`, `primier-segond`, `prene-singular`, `comprene-singular`, `suc-de-fruta`) ; `cursus/lexic-A1.md` ; `cursus/cobertura-gramatica.md` (§1 et §4, bilan du lot 2) ; `cursus/trama-A2-C1.md` (9.2, 12.1, 26, 42) ; *préner* dans `cursus/01-A1-carta-8-unitats.md`, `cursus/visio-A1.md`, `cursus/01-A1.md`, `cursus/02-A2.md` ; les fiches de relecture régénérées ; cahier §11 ; PILOTATGE ; AGENTS.md ; BRIEF-MISTRAL.md.

2. **Pourquoi** : suite du lot 1. Les unités 5 à 8, les haltes 3 et 4 et la mission A1 ont été comparées au livre, chapitre par chapitre ; huit écarts ont été posés à Romain un par un, puis les oublis de la carte de couverture.

3. **Les choix et les options écartées**
   - « les fruits » : le livre fait de *fruita* (chez Romain *frucha*) un nom collectif, sans pluriel (p33). Retenu : *la frucha* au 5.1, avec une ligne dans l'Obsèrva, et *un suc de frucha* (8.3, 8.4, halte 4). Écarté : garder *las frutas*.
   - *sus*, *jos* : la soudure est obligatoire avec *a* et *de*, au choix avec *sus*, *jos* et *per* (p21). Retenu : suivre le livre ; *sul* reste enseigné, *Mimí es sus lo canapè* est accepté à l'écrit, *jol* est signalé dans une note ; la phrase « *Jos* ne se soude pas » est corrigée. Écarté : garder la soudure obligatoire avec *sus*.
   - « deuxième » : le livre donne *dosen, dosena*, et *segond* quand il n'y en a que deux (p52). Retenu : *la dosena carrièra* partout, sons « dou-ZÉN », « dou-ZÉ-no » (le *n* se dit, comme dans *seten*, p11) ; l'encadré du 8.2 garde *lo segond* pour « le second ». Écarté : garder *segond*.
   - « prendre » : le livre écrit *préner*, *compréner* (p94, p20) ; le Basic de lo Congrès a *prene* et *compréner*. Retenu : *préner*, *compréner* dans tout l'A1, même son ; une ligne du 8.3 dit à quoi sert l'accent. Écarté : garder *prene*, *comprene*.
   - 70 : le livre écrit *setenta* ; lo Congrès et les six dictionnaires de dicodòc donnent *setanta*. Retenu : garder *setanta*.
   - « le lait » : le livre le fait féminin (p32) ; dicodòc le donne masculin. Retenu : garder *lo lach*.
   - *blanc* : le *c* de *-nc* final se dit (p16). Retenu : « BLANK » ; le son du jour du 7.3 prend *grand* et *jardin* pour la consonne qui se tait, *blanc* et *verd* pour celle qui se dit.
   - *caud* : le *d* final sonne « t » (p9). Retenu : « CAOUT » (6.2, 8.3, 8.4, halte 4).
   - Oublis de la carte (« Oui, comme proposé ») : noms collectifs, noms toujours au pluriel et *grand carrièra* en 9.2 ; partitif déterminé en 26 ; 12.1 dit « les ordinaux après *dosen* ».

4. **Comment c'est vérifié** : pages du livre relues sur le texte reconnu et, pour les tableaux, sur l'image du PDF (p9, p11, p16, p17, p20, p21, p32, p33, p52, p92-96) ; API de lo Congrès : *frucha*, *compréner* ✓ ; *dosen*, *dosena*, *préner*, *jol* absents du Basic et de vèrb'Òc, puis contrôlés sur dicodòc : *dosen* ✓ (Laus), *préner* seulement dans les dictionnaires gascons, *jol* absent (dicodòc ne donne pas les contractions ; le livre le cite, p21) ; `node scripts/controle-explications.mjs` : « Tout est expliqué » (*jol*, *segond*, *segonda* déclarés dans `glosa`, car traduits sur place) ; 89 tests ; `npm run build` réussi ; fiches de relecture régénérées.

5. **Risques et points les moins sûrs** : *préner* n'est donné par dicodòc que dans les dictionnaires gascons (Laus et Lagarde : *prene*, *comprene*), constaté après le choix de Romain et signalé à lui le même jour ; le son « dou-ZÉN » vient de la règle du livre, pas d'une écoute ; *la frucha* arrive au moment même où le 5.1 enseigne le pluriel (une ligne l'explique) ; l'adresse `/aprene` et l'interface gardent *aprene*, la page de confidentialité *comprene* (hors périmètre).

6. **À challenger**
   - *préner* dans un cursus languedocien : forme du standard à garder, ou forme gasconne à éviter ?
   - *dosen* et *segond* : la distinction « deux seulement » est-elle vivante en languedocien ?
   - « BLANK » et « CAOUT » suivent la règle du livre ; à l'enregistrement, l'usage de Romain fait foi.

7. **Périmètre** : ne pas rouvrir les choix de Romain (cahier §11, 2026-11-02) ; aucune citation longue du livre, protégé par le droit d'auteur ; tout occitan reste validé par Romain avant publication ; les identifiants du carnet ne changent jamais.
