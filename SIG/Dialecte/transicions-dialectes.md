<!-- Recherche du 2026-10-07 (4 secteurs, chacun contre-vérifié, puis synthèse), à valider par Romain. Données détaillées : transicions-dialectes.json (bandes de transition avec axe et largeur, corrections avec polygone approché et sources). -->

# Zones de transition entre les dialectes : synthèse

*7 octobre 2026. Synthèse de quatre relevés contre-vérifiés. Aucun fichier du projet n'a été modifié, aucune source n'a été téléchargée.*

## En bref

- **30 bandes de transition** (là où un dialecte passe à l'autre en douceur) et **25 corrections** de la carte Occitanica.
- **Trois grosses erreurs** de la carte actuelle, confirmées par plusieurs sources :
  1. **L'Ardèche** est presque entièrement en auvergnat. Toutes les sources lues disent : vivaro-alpin au nord (Boutières, Haut-Vivarais), languedocien au sud (Bas-Vivarais). Seule la Montagne ardéchoise, à l'ouest du Mézenc, serait auvergnate.
  2. **Gironde et Lot-et-Garonne** : le Bourgeais, le Libournais, l'Entre-deux-Mers, la bande de Marmande à Port-Sainte-Marie, l'Albret (Nérac, Casteljaloux) et le Brulhois sont en languedocien. Ils sont gascons. L'écart (jusqu'à 60 km) est trop régulier pour une erreur de calage : la carte d'origine avait peut-être une teinte « transition » fondue dans le languedocien.
  3. **Alpes-Maritimes** : la Vésubie, la Tinée, le Mentonnais, la Roya et Monaco sont en provençal pur.
- **Isère** : le domaine occitan s'arrête trop au sud. Le Vercors (Villard-de-Lans), le Trièves, le Valbonnais et l'Oisans (Venosc) sont vivaro-alpins et manquent sur la carte.
- **Mende et Marvejols** sont déjà languedociens dans le fichier actuel. Rien à refaire.

## Comment lire les données

- Une **bande** = une ligne du milieu (l'axe) et une largeur. Sur l'axe, moitié moitié ; au bord de la bande, couleur pleine.
- **Règle de cohérence** : la frontière entre deux aplats doit passer sur l'axe de la bande, sinon le dégradé contredit l'aplat. Les polygones de correction sont dessinés ainsi : un bord suit l'axe, l'autre déborde un peu sur la zone qui a déjà la bonne couleur (sans conséquence).
- Les corrections s'appliquent **à l'intérieur du domaine d'oc actuel**, sauf l'Isère, qu'il faut ajouter. Ordre : les changements de dialecte d'abord, puis les trous d'oïl (Blayais, Petite Gavacherie), puis Monaco.
- **Vérifié** : chaque ville listée tombe bien dans son polygone, et j'ai simulé le résultat sur une grille (Gironde, Ardèche, Toulousain, Alpes-Maritimes). Il ne reste plus d'auvergnat en Ardèche du Sud ni de languedocien dans l'Entre-deux-Mers.
- **Mes raccords (déduction)** : les bandes se rejoignent en des points où trois dialectes se touchent : près de Villefranche-de-Lonchat (gascon, limousin, languedocien), au Gerbier de Jonc (auvergnat, vivaro-alpin, languedocien), vers Viviers et Donzère (languedocien, vivaro-alpin, provençal), à La Bastide-Puylaurent, et entre Pleaux et Saint-Cernin.
- **Mes retouches d'axes**, pour respecter les classements des relevés eux-mêmes : Isère (La Mure reste francoprovençale), vallées italiennes (Venasca et Ostana côté occitan, Paesana et Dronero côté piémontais), Creuse (Aubusson sur l'axe), Arize et Séronais (axe sur la limite actuelle, faute de source pour la déplacer). Les deux relevés sur la Drôme se contredisaient : je les ai fusionnés en un axe de compromis.

## Ce qui est établi (au moins une source lue le dit)

**Gascon**
- Le gascon touchait le saintongeais dans les cantons de Bourg, Saint-André-de-Cubzac, Fronsac, Libourne et Lussac ; le Blayais et la région de Coutras sont saintongeais. Le gascon y est éteint aujourd'hui.
- L'Entre-deux-Mers est de tradition gasconne ; la Petite Gavacherie (16 communes autour de Monségur) est une enclave d'oïl.
- Gascon garonnais à Marmande, Tonneins, Aiguillon, Port-Sainte-Marie ; Brulhois (Layrac, Auvillar) gascon de transition ; Agen languedocien.
- Toulouse languedocienne, mais Saint-Martin-du-Touch, Saint-Simon, Colomiers, Tournefeuille et Muret gascons.
- La Lèze sert de limite dans la plaine (Bec 1968) ; le col de Port en montagne ; le parler de Massat est « hybride ».

**Limousin, auvergnat, languedocien**
- Le gévaudanais (Mende) est un languedocien de transition malgré son cha (Alibert, Sumien).
- L'aurillacois, languedocien, couvre aussi l'ancien canton de Pierrefort : Pierrefort et la haute Cère sont à corriger.
- En Périgord (de Montazeau à Nadaillac) et dans le sud de la Corrèze (de Chauffour-sur-Vell à Goulles), la carte suit déjà les sources à 5 km près.

**Autour du Rhône**
- Ardèche : vivaro-alpin au nord (Garnier 2020), languedocien au sud (BnF, Wikipédia), limite du Mézenc à Rochemaure par le Coiron.
- Velay : le vivaro-alpin va au plus jusqu'à la Loire, et autour de Saint-Bonnet-le-Château (Garnier).
- Gard : la limite languedocien / provençal passe un peu à l'est du Vidourle ; la Vaunage est la zone de rencontre (fonds Revèst).

**Alpes**
- Vésubie, Tinée, haut Var vivaro-alpins (Garnier et Revèst d'accord).
- Mentonnais : vivaro-alpin de transition vers le ligure. Royasque et brigasque : ligures à traits occitans. Monégasque : ligure.
- Isère : Vercors, Trièves, Valbonnais, Oisans occitans (Garnier, CIRDÒC, Gasquet-Cyrus).
- Chiomonte est la dernière commune occitane du Val de Suse (Sibille 2012) ; là, la carte est juste.

## Ce qui est débattu

1. **Velay (Yssingeaux)** : vivaro-alpin pour Garnier et Wikipédia ; auvergnat pour Bonnaud (c'est ce que suit Occitanica).
2. **Gévaudan** : languedocien de transition (Alibert, Sumien) ; auvergnat pour des « auteurs » non nommés.
3. **Est de la Creuse et de la Corrèze** : auvergnat seulement entre Bort et Auzances (Wikipèdia oc) ; Ussel, Neuvic, Bort auvergnats (Wikipédia Corrèze) ; limousin seul (Wikipédia Creuse).
4. **Sud des Baronnies (Buis, Séderon)** : vivaro-alpin jusqu'au Vaucluse (Morin 2017) ; provençal, seul le nord des Baronnies étant vivaro-alpin (Garnier 2020).
5. **Niçois** : provençal (Bec, la plupart) ; rapproché du vivaro-alpin (Sumien) ; dialecte composite (Del Giudice).
6. **Paillons et Estéron** : gavot maritime (Revèst, seul) ; niçois (tradition).
7. **Royasque et brigasque** : ligures de structure (Forner, Toso, Garnier) ; déclarés et revendiqués occitans (loi italienne 482).
8. **Nîmes** : provençal ; ou parler hybride d'origine languedocienne (Wikipèdia oc).
9. **Coiron** : limite sur la crête, ou tout le plateau vivaro-alpin (deux pages Wikipédia). Écart de 5 à 10 km.
10. **« Guyennais »** : groupe du languedocien du nord chez Ronjat ; parler non gascon de la rive droite chez gasconha. Aucune source ne range l'Entre-deux-Mers en guyennais.

## Décisions à prendre, une à une

**1. La Roya (Breil, Saorge, Fontan, Tende, La Brigue)**
A : hachures « ligure à traits occitans ». B : laisser provençal ou vivaro-alpin plein. C : sortir du domaine.
*Conseil : A.* Fidèle aux linguistes et aux habitants qui se disent occitans.

**2. Monaco**
A : petite enclave ligure en hachures. B : laisser en provençal.
*Conseil : A.*

**3. Vallées italiennes « occitanes par la loi » (Luserna, Paesana, Dronero, Caraglio, Borgo San Dalmazzo)**
A : hachures légères « déclarée occitane ». B : les retirer. C : ne rien changer.
*Conseil : A.* Exact sans exclure.

**4. Est de la Creuse et de la Corrèze**
A : garder la limite actuelle (tout limousin) et ajouter un dégradé. B : poser la limite sur l'axe (Aubusson, Ussel, Mauriac au milieu ; Crocq, Auzances, Bort auvergnats).
*Conseil : B*, avec un dégradé large (35 km) qui montre l'incertitude.

**5. Sud des Baronnies**
A : axe de compromis, Buis et Séderon au milieu d'un dégradé de 25 km. B : suivre Morin. C : suivre Garnier.
*Conseil : A.*

**6. Contact gascon / limousin vers Tayac**
A : faire descendre le limousin jusqu'à la Gironde (deux pages Wikipédia concordent). B : garder un coin languedocien entre les deux.
*Conseil : A*, avec la mention « confiance faible ».

**7. Lomagne et Grenade (Beaumont-de-Lomagne, Grenade, Merville)**
A : passer en gascon jusqu'à la Garonne. B : attendre une meilleure source.
*Conseil : A* si tu connais des locuteurs qui le confirment, sinon B.

**8. Comment montrer le gascon éteint (Bourgeais, Libournais)**
A : même couleur, plus pâle, avec « domaine historique ». B : couleur pleine.
*Conseil : A.*

**9. Le Verdon-sur-Mer (petite enclave d'oïl, une seule source)**
*Conseil : ne pas l'afficher pour l'instant.*

## Ce que tu peux trancher toi-même, maintenant

- À Mende et à Marvejols, dit-on « chabra » ou « cabra » ? Où s'arrête le cha entre La Canourgue et Chanac ?
- Le Mauriacois : côté limousin, ou au milieu du dégradé ?
- Si tu as des contacts : Beaumont-de-Lomagne, Grenade, la vallée de Massat, Yssingeaux.

## Ce qui demandera de l'aide plus tard

- **En bibliothèque**, pour passer de « déduction » à « vérifié » : Lartigue (carte de 1998), Bec 1968 et son album de cartes, l'atlas de Gascogne (Séguy), l'atlas du Massif central (Nauton), Bouvier 1976 (Drôme), Boisgontier (atlas du Languedoc oriental), Sumien 2009, Camproux (Gévaudan), Laurent 2002 (Massat), Bourciez 1895.
- **Pas encore étudié** : les limites avec le catalan (Fenouillèdes, Capcir, Val d'Aran), avec le basque, avec le francoprovençal au nord de l'Ardèche et dans le Forez, avec l'oïl du Limousin et de l'Auvergne (le Croissant a été retiré) ; les petites enclaves ligures de Biot, Vallauris, Mons, Escragnolles ; le raccord entre la vallée du Pesio et la Roya.

## Remarques pratiques

- Le fichier a de petits chevauchements (gascon et languedocien vers Daumazan-sur-Arize, languedocien et limousin entre 45,03 et 45,07° N) et des marches d'escalier dans la Drôme : recaler les limites sur les axes les fait disparaître.
- Trois PDF ont été enregistrés automatiquement par l'outil de lecture lors des premières recherches, dans le dossier de session `tool-results` (webfetch-1791374552351-84kar9.pdf, webfetch-1791374550886-0drzjh.pdf, webfetch-1791380005948-fet8r1.pdf). Ils n'ont pas été ouverts. À ranger ou à supprimer, selon ton choix.

## Sources principales

- Q. Garnier, « Le vivaro-alpin : progrès d'une définition », *Géolinguistique* 20, 2020.
- L. Morin, « Paysage linguistique drômois », *Géolinguistique* 17, 2017.
- C. Lagarda, compte rendu de P. Bec (1968), *Lengas* 82, 2017.
- Mediatèca occitana (CIRDÒC) : fonds Laurenç Revèst ; « Où parle-t-on occitan en Rhône-Alpes ? ».
- M. Gasquet-Cyrus, sur le parler de Valjouffrey, ENS Éditions, 2018.
- J. Sibille, « L'occitan de Chiomonte », 2012.
- Ch. Higounet, « Gascogne », *Encyclopædia Universalis*.
- Gasconha : E. Nowak ; T. Merger (2016) ; A. Dupuy (revue *La Lomagne*).
- BnF, notice « Bas-vivarois (dialecte) ».
- Wikipédia (oc, fr, en, it), utilisée avec prudence : c'est la seule source de plusieurs points, marqués « confiance faible ».
