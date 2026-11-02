# Fiche de passation : l'A1 vérifié contre la grammaire de référence, lot 1 (2026-11-02)

1. **Ce qui a changé** : modules `app/src/lib/lesson/moduls/` 1-1, 1-2, 1-3, 2-3, 2-4, 3-1, 4-1, 4-2, 4-3, 6-1, 6-2, 6-3, 6-4, 8-3 et `pausa-1` ; `cursus/lexic-A1.md` ; les fiches de relecture régénérées ; `cursus/cobertura-gramatica.md` (§4, le bilan) ; `cursus/trama-A2-C1.md` (17.3) ; cahier §11 ; PILOTATGE.

2. **Pourquoi** : Romain a fait de la *Gramatica de l'occitan estandard* (Academia Occitana) la référence du cursus. Les unités 1 à 4 ont été comparées au livre, chapitre par chapitre ; quatre écarts lui ont été posés un par un.

3. **Les choix et les options écartées**
   - « tu es » : le livre dit *ès*, l'A1 *siás*. Proposé et retenu : garder *siás* (languedocien, lo Congrès) avec une note pour reconnaître *ès* (1.3). Écartés : passer à *ès* partout ; garder *siás* sans note.
   - La négation : le livre fait de *non* devant le verbe la forme de base, *pas* seul étant familier. Proposé : garder *pas* avec une note. **Retenu par Romain : enseigner *non… pas* dans tout l'A1.** Pas encore appliqué : environ 230 phrases, à changer en un seul bloc.
   - « qui est-ce ? » : le livre distingue *Qui es ?* (l'identité) et *Qual es ?* (la qualité). Proposé : garder *Qual es ?* avec une note. **Retenu : suivre le livre** ; *Qui es ?* quand on attend un nom (2.3, 2.4, 3.1, halte 1), *Qual es ?* pour le rôle (3.2, inchangé).
   - *Bon ser* : le livre fait entendre le *r* final dans les mots d'une syllabe. Romain prononce « bou(n) SÉR » : les dix-sept transcriptions de *ser* sont passées à « SÉR », et le 4.2 s'en sert comme contre-exemple du *r* qui se tait.

4. **Comment c'est vérifié** : pages du livre relues sur le texte reconnu (p7-13, 20, 21-23, 31-33, 39, 41, 46-47, 52, 54, 92-96) et sur l'image du PDF pour le tableau des auxiliaires (p66) ; *qui*, *cat*, *gat*, *siás* passés à l'API de lo Congrès ; `node scripts/controle-explications.mjs` : « Tout est expliqué » ; 85 tests ; `npm run build` réussi.

5. **Risques et points les moins sûrs** : le texte reconnu des tableaux est imparfait (d'où la lecture de p66 sur l'image) ; dans le 2.3, *Qual es ?* est présenté sans exemple de rôle, faute de vocabulaire connu à ce stade (renvoi au 3.2) ; jusqu'au chantier de la négation, le site enseigne encore *pas* seul.

6. **À challenger**
   - La différence *Qui es ?* / *Qual es ?* est-elle attestée en languedocien (Alibèrt), ou propre au standard ?
   - *Non… pas* dans des dialogues de débutants : naturel, ou trop écrit ? Faut-il signaler la forme parlée sans *non* ?

7. **Périmètre** : ne pas rouvrir les choix de Romain (cahier §11, 2026-11-02) ; aucune citation longue du livre, protégé par le droit d'auteur ; tout occitan reste validé par Romain avant publication.
