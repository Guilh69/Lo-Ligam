# Fiche de passation : la négation de l'A1 passée à *non… pas* (2026-11-02)

1. **Ce qui a changé** (commit 326599b, fusionné et poussé sur `master` en 356d7af) :
   - les 29 modules de l'A1 qui ont une négation (`app/src/lib/lesson/moduls/`, unités 2 à 8, haltes, mission) : 276 changements calculés par script puis relus un par un (répliques, À retenir, qcm avec leurs mauvaises réponses, écriture, ordre, tableaux, explications), deux exercices d'ordre corrigés à la main (8.4, halte 1), quatre réponses en double retirées (4.1, 5.1, 7.1) ; 31 transcriptions de son avec « nou » ;
   - les explications de la règle (2.2, 2.4, 4.1, 5.1, 6.2, 8.1, halte 1) : « *non* devant le verbe, *pas* après » ; le qcm du 2.2 demande maintenant « Quels mots disent « ne… pas » ? » (réponse *non… pas*) ;
   - le correcteur d'écriture (`app/src/lib/lesson/escriure.js`, fonction `formas` ; `EscriureBlock.svelte`) : chaque réponse en *non… pas* accepte aussi la forme sans *non*, et « Non, non ai pas… » ; 4 tests dans `escriure.test.js` (89 en tout) ;
   - le cursus : `lexic-A1.md` (six encadrés, forme du jour du 2.2), `regles-redaccion-A1.md` (§7, la règle complète), `visio-A1.md`, `trama-A2-C1.md` (17.3, 38, 57), `cobertura-gramatica.md` (chapitre 54, §4 « fait »), `00-cadre-methodologique.md`, `01-A1.md`, `02-A2.md`, `07-carta-del-cursus.md` ; fiches de relecture régénérées ; cahier §11 ; PILOTATGE.

2. **Pourquoi** : choix de Romain du 02-11 (lot 1 de la vérification contre la *Gramatica de l'occitan estandard*) : enseigner la négation du livre (p54), *non* devant le verbe et ses pronoms, *pas* après, dans tout l'A1, sans jamais mélanger les deux formes.

3. **Les choix et les options écartées** (Romain, une question à la fois, avec boutons) :
   - Forme familière : **une ligne au 2.2** (« À l'oral, on entend souvent *pas* tout seul… ») ; elle explique aussi le titre *Perqué m'an pas dit ?*, dont la note dit maintenant « sans *non* : la forme familière ». Écarté : ne rien signaler.
   - Écriture : **la forme sans *non* est juste, sans remarque**. Écartés : juste avec une remarque douce (comme un accent oublié) ; refusée.
   - Son : **« nou » partout, sans liaison** (*Non es pas luènh* « nou és pas LUÈN »). Le livre ne donne jamais la prononciation de *non* ; l'analogie avec *bon voler* « boum-bou-LÉ » (p11) aurait fait entendre le *n* : Romain a tranché selon son usage. Écartés : liaison devant voyelle (« nou-nés ») ; « nou(n) » léger.
   - Cas jugés par Claude, selon le livre : « Non, ai pas de can » devient *Non ai pas de can* (un seul *non*, jamais « Non, non… ») ; sans verbe, *pas* reste seul (*Ai de galinas… pas de vacas !*) ; le titre de la chanson ne change pas ; *non* passe devant les pronoms (*Non m'agrada pas*, *Non i a pas*). L'A1 n'a aucun autre mot négatif (*res, jamai, degun…*) avec *pas*, sauf *De res* (de rien), sans verbe, inchangé.

4. **Comment c'est vérifié** : p54 relue en entier, p10-11 pour le *n* final ; liste complète des changements relue avant d'écrire ; un contrôle ne trouve plus aucune négation sans *non* (hors titre de chanson et exemple voulu du 2.2) ; chaque phrase avec *non* a son « nou » (31 sons) ; *non, pas, res, degun, jamai, gaire, brica, mai* confirmés par l'API de lo Congrès ; `node scripts/controle-explications.mjs` : « Tout est expliqué » ; `npx vitest run` : 89 tests ; `npm run build` réussi, avant et après la fusion avec `master`.

5. **Risques et points les moins sûrs** :
   - des dialogues de débutants en *non… pas* peuvent sonner plus écrits que la conversation (choix assumé : la forme du livre) ;
   - *Non ai pas de can* en réponse : un seul *non* fait à la fois réponse et négation ; à confirmer à l'oreille de Romain en enregistrant ;
   - le correcteur combine au plus trois *non* par réponse ; au-delà, seule la forme entière est reconnue ;
   - `05-C1.md` garde deux exemples en *pas* seul (la litote *es pas dels pièges*, le contraste *el la parla pas*) : niveau C1, question de registre, non touchés.

6. **À challenger** :
   - La ligne du 2.2 suffit-elle pour reconnaître la forme familière, ou faut-il la refaire entendre plus tard (halte, chanson) ?
   - « nou » sans liaison devant une voyelle : est-ce aussi l'usage d'autres locuteurs languedociens ?

7. **Périmètre** : ne pas rouvrir les choix de Romain (cahier §11, 02-11) ; ne pas « corriger » les deux *pas* seuls voulus (l'exemple de la forme familière au 2.2, le titre de la chanson) ; tout occitan reste validé par Romain avant publication ; aucune citation longue du livre (droit d'auteur).
