# Concept : l'encyclopédie des langues et des lieux (« wiki » de Lo Ligam)

Proposition du 2026-10-10, à arbitrer par Romain (une décision à la fois). Aucun code écrit : ce document décrit l'idée, les gabarits, les sources et un plan. Il part de l'idée notée dans `revisions/2026-10-10-interfacia-lengas.md` : « la galerie des silhouettes des langues, grandes, avec seulement leur nom, pour une future encyclopédie ou un wiki » ; et de la décision du 2026-10-07 (§11) : cliquer sur une ville mène à sa page.

## 1. À quoi ça sert, et ce que ce n'est pas

**Pour qui.** Les apprenants (comprendre d'où vient ce qu'ils apprennent : le dialecte, la ville, le nom), les élèves des cours en visio (Romain renvoie à une fiche pendant ou après un cours : « regarde la fiche du gascon »), les curieux venus par la carte (une langue voisine, un pays, un chiffre), et Romain lui-même : c'est là qu'il centralise « la connaissance qu'il veut partager et sa vision de l'Occitanie » (repositionnement du 2026-10-06, §11).

**Quatre usages précis.** (1) Donner un fond solide à la carte : chaque zone, nom ou point cliqué a une page où les chiffres sont sourcés. (2) Nourrir les cours : l'exercice « Ont es ? » (catalogue D) et l'unité 2 « D'ont siás ? » renvoient aux fiches de villes. (3) Fierté occitane sans repli : l'occitan est traité comme les autres langues de France, avec les mêmes rubriques et la même exigence de sources (« ancrés mais connectés »). (4) Découverte des langues voisines, dans la continuité du mode « Langues de France ».

**Ce que ce n'est pas.** Pas un clone de Wikipédia : pas d'exhaustivité, pas de neutralité d'encyclopédie, pas d'édition ouverte. C'est une collection courte de fiches, écrites par une seule voix (Romain), chacune reliée à la carte, avec un bloc de données vérifiables et des liens sortants vers Wikipédia, Occitanica et les offices publics pour « en savoir plus ». Une fiche tient sur un écran et demi ; au-delà, on renvoie ailleurs. Nom proposé à trancher : **« Enciclopèdia »** (mot vérifié avec l'API de lo Congrès) plutôt que « wiki », qui promet une édition collective qu'on n'offre pas. Deux options de sous-titre : « Lengas e luòcs » (mots vérifiés) ou simplement « Fichas » (vérifié).

## 2. Les types de pages et leurs gabarits

Hiérarchie identique à la carte (décision du 2026-10-10, §11) : langue (ou famille) → dialecte → parler. Les lieux et les données s'y rattachent. Chaque type a un gabarit fixe : mêmes rubriques dans le même ordre, pour qu'on sache toujours où regarder. Les titres de rubriques ci-dessous sont en occitan (tous vérifiés avec l'API de lo Congrès, sauf mention), avec l'équivalent français affiché quand l'interface est en français (bascule Òc/Fr existante).

### 2.1 Lenga (langue, ou famille comme les langues d'oïl)
| Rubrique | Contenu | Rempli par |
|---|---|---|
| En-tête | Nom dans la langue, nom occitan, nom français ; silhouette (partie française pleine, reste clair) ; « Veire sus la carta » | données |
| Presentacion | 3 à 8 phrases : ce qu'est la langue, où elle se parle, pourquoi elle compte pour un occitan | **texte de Romain** |
| Familha | classement Glottolog ; langues sœurs ; place de l'occitan par rapport à elle | données + une phrase de Romain |
| Locutors | chiffre principal, ce qu'il mesure, où, quand, fiabilité ; autres estimations | données (fichier `SIG/lengas-fichas.json` déjà prêt) |
| Estatut | état UNESCO 2010 ; reconnaissance (loi, charte, office public, co-officialité) | données |
| Dialèctes | liste des dialectes, chacun cliquable vers sa fiche, rangés en France / sur la frontière / hors de France (comme sur la carte) | données |
| Ensenhament | écoles bilingues ou immersives, où apprendre (renvoi vers la fiche de données) | données |
| Istòria | 3 à 6 repères datés (pas une chronologie complète) | **texte de Romain** |
| Ligams | Wikipédia (oc, fr, langue locale), Wikidata, office public, Glottolog | données |
| Fonts | liste complète des sources de la page, avec licences et dates de consultation | automatique |

### 2.2 Dialècte (et parler)
En-tête (nom, langue parente, silhouette du dialecte dans la langue) ; Presentacion (**Romain**) ; Territòri (départements, villes repères, dialectes voisins et zones de transition : données de `dialectes.geojson` et `transicions.geojson`) ; Traits (3 à 5 traits de prononciation ou de grammaire : **Romain**, dans son usage vivant, pas celui de fon'Òc) ; Vilas (villes à fiche) ; Ligams ; Fonts. Le Croissant et les zones mixtes ont une fiche de dialecte avec une rubrique de plus : « Perqué una zòna a despart » (**Romain** ; « a despart » à valider).

### 2.3 Luòc : vila (ville) et territòri (pays, province, vallée)
En-tête (nom occitan, nom officiel, repère doré sur la carte, « Veire sus la carta ») ; Presentacion (**Romain** : histoire du territoire, lien avec l'occitan) ; Lenga (dialecte, ou deux dialectes si ville de bordure ; zone mixte le cas échéant) ; Toponimia (nom occitan et sa source : OpenStreetMap, BdTopoc, Wikipédia oc ; sens du nom : **Romain**) ; Aprene (Calandreta, cours, lieux où l'occitan se parle) ; Chifras (population INSEE, département, province de 1789) ; Ligams ; Fonts. Un territòri (Val d'Aran, Roya, Lengadòc de 1789) suit le même gabarit avec « Comunas » à la place de « Chifras ».

### 2.4 Donada (jeu de données)
Une fiche par donnée affichée sur la carte, pour qu'un chiffre ne soit jamais orphelin : Qué (ce qui est mesuré, unité, année) ; Font (producteur, adresse, licence, obligations) ; Cobertura (territoire, nombre d'entités) ; Limits (ce que la donnée ne dit pas : **Romain** ou Claude, factuel) ; « Veire sus la carta » (allume la donnée, cale la vue) ; téléchargement du fichier tel qu'il est servi. « Donada » : l'API ne connaît que le participe de « donar », mot à trancher par Romain (déjà noté dans la révision du mode).

### 2.5 Persona et òbra (plus tard)
Les œuvres existent déjà sur `/obras` (règle du 2026-08-04 : aucun extrait hébergé). Pas de nouveau type pour l'instant : une fiche de langue ou de ville renvoie vers `/obras` ou vers Occitanica. Des fiches « persona » (troubadours, Max Roqueta) seulement quand Romain aura des textes à y mettre ; même gabarit court (Presentacion, Luòcs, Òbras, Ligams, Fonts).

### 2.6 Le lien avec la carte, dans les deux sens
- **Carte → fiche** : dans le mode « Langues de France », le nom d'une langue dans la liste et le panneau de sa fiche sourcée mènent à sa page ; sur la carte occitane, le nom d'un dialecte (capitales espacées) et le repère doré d'une ville mènent à leur page ; une donnée cochée dans « Donadas » a un lien « Ficha » ; la bulle au survol garde son résumé (jamais retirer une fonction).
- **Fiche → carte** : « Veire sus la carta » ouvre `/carta` avec un état précis dans l'adresse (langue allumée, partie française seule, vue calée ; ou dialecte sélectionné ; ou ville centrée avec son repère). Retour par le bouton de la carte vers la fiche d'où l'on vient.
- **Silhouette** : même dessin que les icônes du rail (contour de la France, partie française pleine, reste en clair), en grand sur la fiche ; survoler la partie claire affiche « Veire la lenga dins son environament lingüistic » et le clic ouvre la carte avec tout le domaine. La galerie d'entrée de l'encyclopédie, c'est l'idée de Romain : les silhouettes, grandes, avec seulement leur nom.

## 3. Les sources et leurs licences (vérifiées le 2026-10-10)

| Source | Licence | Ce qu'on reprend | Obligation |
|---|---|---|---|
| Wikidata (éléments, déclarations) | CC0, domaine public : https://www.wikidata.org/wiki/Wikidata:Licensing | codes (ISO 639-3, Glottolog, INSEE, OSM), coordonnées, populations, libellés oc/fr/langue locale, liens vers les Wikipédias | aucune ; on cite quand même l'identifiant Q et la date |
| Wikipédia (toutes langues) | textes CC BY-SA 4.0 (et GFDL), section 7 des conditions d'utilisation : https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use | les **faits** (pas protégés), les liens « en savoir plus », au plus une courte citation avec lien vers l'article | si on copie un texte : attribution par lien vers l'article, mention des modifications, partage à l'identique |
| Wikimedia Commons (cartes, photos) | licence propre à chaque fichier (ex. carte de Sémhur, CC BY-SA 4.0) | tracés recalés (déjà fait pour le breton) | attribution auteur + licence sur la fiche de données |
| INSEE | Licence Ouverte 2.0 (sauf mention contraire) : https://www.insee.fr/fr/information/2008466 | populations, codes communes | « Source : Insee » + date de mise à jour |
| IGN (Admin Express) | Licence Ouverte 2.0 (voir `SIG/breton/FONTS.md`) | contours de communes, silhouettes | mention de la source |
| Licence Ouverte 2.0 (Etalab), texte officiel | https://www.etalab.gouv.fr/licence-ouverte-open-licence (PDF, avril 2017) | reproduire, modifier, rediffuser, usage commercial autorisé ; compatible CC BY et ODC-BY | mentionner la paternité : source et date de dernière mise à jour |
| Ministère de la Culture (DGLFLF) | textes CC BY-SA 3.0 FR, données Licence Ouverte : https://www.culture.gouv.fr/Mentions-legales | liste officielle des langues de France (rapport Cerquiglini), données | titre, auteur, lien, licence |
| UNESCO (Atlas 2010) | publications CC BY-SA (version IGO à confirmer sur la page) : https://www.unesco.org/en/open-access/cc-sa | le statut de vitalité et l'identifiant de la langue (déjà dans `lengas-fichas.json`) | attribution ; préciser que ce n'est pas une publication de l'UNESCO |
| Glottolog 5.3 | CC BY 4.0 : https://glottolog.org/about | classement généalogique, codes | citer « Glottolog 5.3, Hammarström, Forkel, Haspelmath, Bank » |
| Offices publics (OPLB, OPLO, OPLC…) | au cas par cas ; OPLB 2025 : ODbL (voir `SIG/breton/FONTS.md`) | enquêtes de locuteurs, écoles bilingues | ODbL : attribution, et le fichier dérivé qu'on sert doit rester sous ODbL (c'est déjà le cas, il est public dans `static/data`) |
| CIRDÒC (Occitanica) | Licence Ouverte pour la carte linguistique (fiche 21242, vérifié le 2026-10-07, §11) ; le reste au cas par cas | tracés, liens vers notices | crédit affiché ; demande de courtoisie en cours |
| Lo Congrès (API) | conditions générales : https://api.locongres.org/cgu.php?lang=fr. Gratuit, clé confidentielle ; **interdit de copier, stocker ou conserver en cache les données** et de les transmettre en brut à des tiers (art. 4.2) ; mention « nom de Lo Congrès + année » (art. 4.3), logo interdit | **rien de stocké dans les fiches** : on utilise l'API pour vérifier les mots, et on renvoie par lien vers dicodòc / top'Òc | mention de lo Congrès quand une vérification a eu lieu (« vérifié avec lo Congrès, 2026 ») |

**Ce qu'il vaut mieux rédiger soi-même.** Tout le texte courant (Presentacion, Istòria, Traits, sens des noms). Deux raisons : copier des paragraphes de Wikipédia obligerait à placer les textes de Romain sous CC BY-SA (partage à l'identique), et on perdrait la voix du site. Décision à prendre par Romain, deux options : (A) **textes de Romain tous droits réservés, Wikipédia seulement comme faits et liens** (recommandé pour démarrer, simple, cohérent avec la règle « jamais de contenu à sa place ») ; (B) textes de l'encyclopédie placés volontairement sous CC BY-SA 4.0, ce qui permet de reprendre des passages et rend le travail réutilisable par la communauté occitane (généreux, mais irréversible pour ces pages).

**Règle de traçabilité, en une phrase.** Chaque donnée affichée porte sa source : `{ valor, font: { nom, url, annada, licéncia }, consultat }`, montrée au survol ou au toucher (comme sur la carte) **et** reprise dans la rubrique Fonts en bas de page (indispensable pour le clavier et les lecteurs d'écran, RGAA). Une donnée sans source ne s'affiche pas (même règle que pour les noms occitans inconnus sur la carte). Pour Wikidata : on garde l'identifiant Q, la propriété (P1098, P1082…) et la date de relevé.

## 4. La langue des fiches et le partage des rôles

- **Deux langues, occitan d'abord.** Chaque fiche existe en occitan et en français (bascule Òc/Fr existante) ; les données structurées sont déjà bilingues dans les fichiers (`oc` / `fr`). Les textes : Romain écrit en occitan (ou en français d'abord, puis traduit lui-même) ; une fiche n'est publiée que quand son occitan est validé par lui (dicodòc, lo Congrès). Tant qu'une version manque, la fiche s'affiche avec ses données et la mention « tèxte en preparacion » (« preparacion » à valider), jamais avec un texte de Claude.
- **Claude** : fabrique les squelettes (gabarit + données sourcées), vérifie les mots occitans des libellés avec l'API, vérifie les faits et les liens, pose des questions de compréhension sur les textes de Romain (relecture par cinq questions, comme pour le parcours pédagogique), code. Il ne rédige ni Presentacion, ni Istòria, ni Traits.
- **Romain** : choisit les fiches, écrit les textes dans `carnet-concepcion/enciclopedia/` (un fichier par fiche, en Markdown, un bloc par rubrique), valide les libellés occitans, tranche les options de ce document.
- **Entrée de Romain à l'écran** : pas de nouvel outil d'administration au départ (règle du 2026-08-06 : pas de CMS externe ; et le catalogue de la carte vit déjà dans le code). Un fichier texte par fiche, dans le dépôt ; `/admin` viendra si le nombre de fiches le justifie.

## 5. Technique : simple, sobre, construite à l'avance

- **Tout est généré à la construction** (`npm run build`), rien n'est demandé à Wikidata ou à une API pendant la visite : pages HTML pré-rendues par SvelteKit (`prerender`), sans base de données, donc disponibles même si Supabase est en pause. Poids visé : moins de 60 Ko par fiche hors police, une seule image au plus, silhouette en SVG de quelques Ko.
- **Rangement proposé** : `enciclopedia/lengas/breton.json` (données + sources), `carnet-concepcion/enciclopedia/breton.oc.md` et `breton.fr.md` (textes de Romain) ; un script `SIG/cadena/enciclopedia.mjs` (dans la chaîne existante, voir `SIG/cadena/LEGISSETZ-ME.md`) lit ces fichiers, interroge Wikidata une fois (`wbgetentities`, libellés oc/fr, codes, populations), ajoute la date de relevé, et écrit `app/src/lib/enciclopedia/fichas.js` (généré, « pas de modificar a la man », comme `fichas-lengas.js`). Les silhouettes sont découpées à partir de `franca.json` et `lengas-vesinas.json`, déjà fabriqués par `franca-contorn.py`.
- **Clés** : l'identifiant Wikidata (Q14185 pour l'occitan, Q12107 pour le breton, Q6441 pour Montpelhièr) est la clé interne de chaque fiche ; l'adresse publique reste lisible : `/enciclopedia/lenga/breton`, `/enciclopedia/dialecte/lengadocian`, `/enciclopedia/vila/montpelhier`, `/enciclopedia/donada/ensenhament-breton`. Les codes de la carte (`kod` : `breton`, `lan`…) sont conservés dans la fiche pour faire le lien.
- **Mise à jour** : relancer le script (une commande), relire la différence (`git diff`, les chiffres qui changent se voient), committer. Un rappel semestriel suffit. Les réponses de l'API de lo Congrès ne sont jamais écrites dans ces fichiers.
- **Accessibilité et Europe** : un titre par page, un sommaire des rubriques, sources accessibles au clavier, contraste des silhouettes vérifié dans les trois ambiances ; aucun service tiers chargé (les liens Wikipédia sont de simples liens). Hébergement inchangé.

## 6. Plan en étapes

**Ce que Romain peut faire seul, maintenant.**
1. Trancher trois choses, une à la fois : le nom (« Enciclopèdia » ou autre), l'option de licence des textes (A ou B), les deux mots « Donada » et « país » (l'API a échoué sur « país », à vérifier à la main).
2. Choisir le premier lot : les 10 langues de France (occitan, catalan, basque, breton, corse, alsacien, francique, flamand, arpitan, langues d'oïl). Neuf fiches de données existent déjà (`SIG/lengas-fichas.json`) ; il manque la fiche sourcée de l'occitan (locuteurs OPLO 2020, statut UNESCO, Glottolog).
3. Écrire les 10 Presentacion (3 à 8 phrases) et 3 à 6 repères d'Istòria chacune, dans `carnet-concepcion/enciclopedia/`. Compter environ 1 h par fiche, soit 10 h, à son rythme.
4. Relire les libellés occitans de ce document (rubriques, adresses) et les noms de dialectes déjà en attente (lemosin, auvernhat, vivaroaupenc).
5. Envoyer le courriel de courtoisie au CIRDÒC (déjà prévu, chantier 11 de PILOTATGE) en mentionnant l'encyclopédie.

**Ce qui demandera l'aide de Claude, plus tard.**
- Lot 1 (10 fiches de langues) : script de génération, route `/enciclopedia`, gabarit « lenga », silhouettes, galerie d'entrée, liens depuis le mode « Langues de France » : 2 à 3 séances. Vérification : build, captures des 10 pages, clavier, téléphone.
- Lot 2 (dialectes) : 6 dialectes occitans + Croissant, puis ceux des autres langues (déjà dans les JSON de `SIG/*`) : 1 séance de code, textes de Romain au fil de l'eau.
- Lot 3 (villes) : gabarit « vila », Montpelhièr en prototype, passage de `vilasFichas.js` à la liste de l'encyclopédie, repère doré relié : 1 à 2 séances ; textes de Romain ville par ville (les villes de ses cours d'abord).
- Lot 4 (données) : une fiche par donnée du mode (écoles bilingues en breton, limites historiques, écoles en corse quand la source sera trouvée) et par couche sourcée de la carte occitane (Calandretas, provinces de 1789, parcs) : 1 séance ; textes « Limits » courts.
- Lot 5 (personnes, œuvres) : quand Romain aura la matière. Classement lancement / évolution : lots 1 et 3 = lancement (ils servent les cours) ; 2, 4, 5 = évolution.

## 7. Trois exemples de fiches (données réelles, emplacements pour les textes)

### 7.1 Lenga : breton (brezhoneg)
- Clé : Wikidata Q12107 ; code carte `breton` ; ISO 639-3 `bre` ; Glottolog `bret1244` (Wikidata P220, P1394, relevé le 2026-10-10, CC0).
- Silhouette : tout le domaine est en France (surface hors de France sous 1 % d'après `franca-contorn.py`) : pas de bouton « environnement linguistique ».
- Presentacion : **[texte de Romain]**
- Familha : indo-européen › celtique › brittonique (Glottolog 5.3, CC BY 4.0, https://glottolog.org/glottolog?search=Breton).
- Locutors : ≈ 107 000 (93 000 à 120 500), personnes de 15 ans et plus parlant très bien ou assez bien, Bretagne historique, 2024 (Région Bretagne, enquête sociolinguistique TMO, présentée le 20 janvier 2025 ; fiabilité élevée). Autres : 214 000 en 2018 (même enquête), 304 000 en 1999 (Insee, enquête Famille, Licence Ouverte). Note : baisse de moitié entre 2018 et 2024, âge moyen de 70 à 58,5 ans (déjà dans `SIG/lengas-fichas.json`).
- Estatut : sérieusement en danger (Atlas UNESCO 2010, identifiant 336, via Wikidata P1999 et P2355) ; Office public de la langue bretonne (établissement public, Région Bretagne).
- Dialèctes : leoneg, tregerieg, kerneveg, gwenedeg, d'après les anciens évêchés, limite de Sébillot 1886 (domaine public), tous en France (`SIG/breton/dialectes-breton.json`).
- Ensenhament : 215 communes, 19 978 élèves bilingues à la rentrée 2025 (OPLB, ODbL ; calcul sur `SIG/breton/breton-actual.csv`) → fiche de données 7.3.
- Istòria : **[3 à 6 repères de Romain]** ; donnée disponible : limites historiques du IXᵉ siècle à 1806 (Sémhur, Wikimedia Commons, CC BY-SA 4.0, recalées sur les communes IGN).
- Ligams : br.wikipedia.org, oc.wikipedia.org, fr.wikipedia.org (articles « Breton »), Wikidata Q12107, https://www.fr.brezhoneg.bzh/.

### 7.2 Vila : Montpelhièr (Montpellier)
- Clé : Wikidata Q6441 ; code INSEE 34172 ; relation OpenStreetMap 28722 ; 43,611 N, 3,877 E (Wikidata P374, P402, P625, relevé le 2026-10-10, CC0).
- Presentacion (histoire du territoire, lien avec l'occitan) : **[texte de Romain]**
- Lenga : occitan, dialecte lengadocian (`dialectes.geojson`, d'après la carte linguistique d'Occitanica, Licence Ouverte, fiche 21242) ; pas de zone mixte.
- Toponimia : « Montpelhièr », forme attestée (OpenStreetMap `name:oc`, ODbL, dans `toponims-oc.geojson` ; article oc.wikipedia.org/wiki/Montpelhièr) ; sens du nom : **[texte de Romain]**.
- Aprene : 4 Calandretas sur la commune (annuaire de l'éducation, `calandretas.geojson`) ; cours en visio de Romain (lien vers la prise de rendez-vous).
- Chifras : 310 240 habitants au 1ᵉʳ janvier 2023 (Insee, population légale, via Wikidata P1082 ; à recouper avec la publication Insee, Licence Ouverte) ; Hérault ; province de 1789 : d'après `provincias-1789.json` (Gay, Gobbi et Goñi 2024, CC BY 4.0).
- Ligams : Wikipédia oc et fr, Occitanica (notices sur la ville), site de la ville.

### 7.3 Donada : ensenhament bilingüe en breton (2025)
- Qué : élèves scolarisés en filière bilingue ou immersive, par commune ; indicateurs `eleves_bilingues`, `eleves_maternelle` (et les autres colonnes du fichier) ; année scolaire 2025-2026.
- Font : Office public de la langue bretonne, « chiffres de l'enseignement bilingue par commune, 2025 » (adresse dans la colonne `url` du CSV) ; licence ODbL ; fichier dérivé servi sous ODbL (`app/static/data/breton-donadas.json`), attribution affichée.
- Cobertura : 215 communes, 19 978 élèves bilingues ; 53 communes hors du domaine de 1886 (Rennes 1 012 élèves, Nantes 533).
- Limits : **[Romain ou Claude, factuel]** : une commune peut accueillir des élèves d'autres communes ; filières publique, privée et Diwan confondues selon le fichier (à vérifier) ; pas de donnée sur la langue parlée à la maison.
- Veire sus la carta : ouvre le mode « Langues de France », rubrique « Donadas », vue calée sur la Bretagne.

## Mots occitans de ce document
Vérifiés avec l'API de lo Congrès (lo Basic, languedocien) le 2026-10-10 : enciclopèdia, lenga, dialècte, luòc, vila, font, istòria, locutor, estatut, ensenhament, familha, presentacion, geografia, cultura, toponimia, reconeissença, vesin, ficha, rubrica, persona, òbra, ligam, territòri, parlar, comuna, chifra, qué, preparacion (ainsi que, lors du chantier précédent : escòla, bilingüe, veire, dins, lingüistic, limit, istoric). À valider par Romain : « donada » (connu seulement comme participe), « país » (échec d'appel), « a despart », « cobertura », « Lengadòc » (absents du Basic ; top'Òc à consulter pour le toponyme) et les noms de dialectes. Un ✓ de l'API ne valide ni le sens ni l'usage : relecture de Romain toujours nécessaire.
