# Les sources ajoutées : ce qui a été repris, et où

Romain, 2026-11-04 : « à chaque fois que je vais rajouter une nouvelle source, il faut aller chercher ce qui est le plus compréhensible et sans dénaturer les propos… on n'invente rien », puis « l'idée, c'est pas de tout reprendre ».

## La méthode, pour chaque nouveau livre

1. **Ranger** : le PDF et son texte reconnu dans `Documents\6_Projectes\Lo_Ligam_hors-git\Modules_cors\Base_donnees_linguistica\<livre>\` (hors Git : droit d'auteur, dépôt public). Romain dépose les nouveaux livres dans `_A_integrar`. Reconnaissance d'un livre photographié : GDAL de QGIS (page en image) puis la reconnaissance de texte de Windows en français.
2. **Lire chapitre par chapitre en face de l'existant** : fiches de grammaire (`app/src/lib/gramatica/fichas/`), leçons (`app/src/lib/lesson/moduls/`), et les fiches de lecture déjà faites (`09-fiche-chatbert-lire-occitan.md`, `cobertura-gramatica.md`).
3. **Ne prendre que** ce qui est plus clair que l'existant, comble un manque ou corrige une erreur. Reformuler : ni les phrases, ni les exemples en série, ni le plan du livre. Citer la page sous l'écran (`{ type: 'font', libre: CHABBERT, pages: '…' }`, ouvrages dans `app/src/lib/gramatica/libres.js`) ou dans le paragraphe de l'encart.
4. **Vérifier chaque mot occitan** avec lo Congrès (Basic, vèrb'Òc, top'Òc pour les lieux, express'Òc pour les expressions) et le relire sur la photo de la page quand la reconnaissance l'a abîmé. Toute forme corrigée est notée (ici et dans la note de relecture du module).
5. **Hiérarchie** : la *Gramatica* et le CLO 2007 font foi pour la norme ; la prononciation suit l'usage de Romain (le parcours). Un écart devient une question à Romain, jamais un remplacement discret. Une variante décrite par un livre devient au plus une note « ailleurs, tu entendras… ».
6. **Noter ici** ce qui a été repris, ce qui a été laissé, et pourquoi.

## Raymond Chabbert, *Lire & écrire l'Occitan*

Dossier `Chabbert_Lire_ecrire_occitan\` (PDF de 92 pages photographiées, `chabbert-ocr.txt`). Le livre traite presque uniquement de la prononciation et de l'orthographe. Un texte plus court du même auteur avait été lu en août : `09-fiche-chatbert-lire-occitan.md`, recoupé avec le CLO ; ses écarts valent ici aussi (ex. *k, w, y* : admis par le CLO pour les mots étrangers).

Repris le 2026-11-04 dans les fiches de prononciation :

| Fiche | Ajout | Pages |
|---|---|---|
| `vocalas` | pas de *e* muet ; *a* final « a » autour de Montpellier, Lodève, Sète ; *ai* « ail », *èi* « soleil », *oi* « fenouil » ; ailleurs *vau* « BOOU », *nuèch* « NÈTCH » | 27 à 29, 37 à 39, 47 |
| `sons` | *Albi* « AL-bi » ; accent grave toujours écrit sur *è* et *ò*, les autres accents seulement hors de la règle ; un seul accent par mot, pas de circonflexe ; *á* seulement dans *-iá* (« yo » ou « yè ») ; aucune prononciation meilleure qu'une autre | 26, 34, 36, 43, 89 |
| `consonantas` | *s* entre « s » et « ch » ; *lh*, *nh* sur les panneaux (*Graulhet*, *Milhau*, top'Òc) ; pas de *k, w, y* pour les mots occitans, pas de *ph* ni de *h* initial | 49, 55, 60 |
| `finalas` | voyelle jamais nasale devant un *n* qui se dit ; *lh*, *nh* finals « l », « n » ; *lach* ou *lait*, *nuèch* ou *nuèit* | 50, 52, 53, 59 |
| `grops` | *femna* « FÉN-no » ; *n* devant *p, b, m, v* « m » (*son paire* « soum PAÏ-ré ») | 64, 66, 67 |

- **Prononciations nouvelles** (absentes du parcours), à faire valider par Romain : « AL-bi », « FÉN-no », « soum PAÏ-ré », « BOOU », « NÈTCH ».
- **Concordances** : le parcours dit déjà *soi* « souï », *ieu* « YÉOU », *siás* « SYOS », *solelh* « sou-LÉL », *occitan* « ou-tsi-TA », *Besièrs* « bé-ZYÈS », *setmana* « sém-MA-no ».
- **Écart à trancher** : *dimars* « di-MARS » dans le parcours (module 4.3), « di-MAS » chez Chabbert (*rs* sonne « s », comme dans *Besièrs*).
- **Laissé de côté**, trop fin pour l'A1 : détails des parlers du Tarn (limites Cordes–Cuq-Toulza, Vaour–Labruguière), triphtongues rares, *c, p, t* finals dans la phrase, *s* qui sonne « ï » devant consonne, articles contractés au pluriel, alternances *ç, qu, gu* des dérivés. À reprendre pour la variation (B1 28.x) et la dérivation, comme le prévoit `09-fiche`. La phrase dans trois dialectes (page 91) n'est pas reprise : c'est un exemple de l'auteur.

## *Petit dictionnaire insolite de l'occitan et des Occitans*

Dossier `Dictionnaire_insolite_occitan\` (61 doubles pages photographiées, `dictionnaire-ocr.txt`). Auteurs non nommés sur les pages photographiées. Le livre dit lui-même qu'il n'est pas un ouvrage savant, et sa graphie n'est pas toujours classique : il sert aux encarts « Cultura », jamais de référence de langue.

Repris le 2026-11-04, un paragraphe par encart, page citée, note de relecture dans le module :

| Module | Ajout | Page |
|---|---|---|
| 1.3 | *Ròda que rodaràs, dins ton país tornaràs* (le livre écrit *Roda*, *pais*) | 87 |
| 3.2 | *Lo buòu vièlh fa la rega drecha* (*buòu* : absent du Basic, présent dans express'Òc) | 89 |
| 4.1 | la *fin'amor* ; « amour » garderait la forme occitane *amor* (écrit au conditionnel) | 22 |
| 4.2 | *Val mai un que sap que cent que cercan* (le livre écrit *sàp*) | 88 |
| 4.3 | *La maire dels jorns es pas mòrta* | 89 |
| 5.1 | *Es coma demandar de peras a un pibol* | 85 |

- **Écartés** : proverbes dont un mot manque à lo Congrès (*pus*, *cort*, *chin*, *Plourà*), proverbes qui figent le rôle des femmes ou grivois.
- **En réserve** : « Au bonheur des mots » (mots occitans passés dans le français du Midi : *adieu*, *amor*, *api*, *bofiga*…), « Ils ont fait l'Occitanie » (Jaurès et son accent du Tarn, Mistral…), « Le saviez-vous ? », « Le français méridional ». Pour un futur encart ou le wiki, chaque forme revérifiée.
