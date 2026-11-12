# La Constitution en occitan (/constitucion)

Demande de Romain, 2026-11-12 : « intégrer dans le site la Constitution française traduite en occitan, pour montrer à quoi pourrait ressembler un pays qui respecte ses langues ; il ne faut pas changer les mots ».

## Ce qui existait avant (recherche du 12-11)

Aucune traduction complète de la Constitution française en occitan. Trouvé : une trentaine d'articles isolés sur Wikipédia en occitan (« Article 75-1 de la Constitucion de la Cinquena Republica francesa »…), de niveaux inégaux et avec des erreurs (par exemple « tals qu'an foguèron definits » au préambule), donc pas utilisables tels quels. Le Conseil constitutionnel propose la Constitution en espagnol, anglais, allemand, italien, etc., pas en occitan. La seule Constitution d'un État en occitan est celle de l'Espagne, en aranais (Acadèmia Aranesa), hors sujet pour une norme languedocienne. La traduction est donc faite ici, de zéro, à partir du texte officiel.

## Les quatre textes

Tous sont dans le préambule de la Constitution, sauf le premier, qui est la Constitution elle-même.

| Fichier | Texte | Blocs |
|---|---|---|
| `const` | Constitution du 4 octobre 1958, à jour de la révision du 8 mars 2024 (interruption volontaire de grossesse à l'article 34) | 445 |
| `ddhc` | Déclaration des droits de l'homme et du citoyen de 1789 | 36 |
| `pre46` | Préambule de la Constitution du 27 octobre 1946 | 18 |
| `charte` | Charte de l'environnement de 2004 | 30 |

Source française : les pages « Texte intégral… en vigueur », « Déclaration… de 1789 », « Préambule… de 1946 » et « Charte… de 2004 » du Conseil constitutionnel (conseil-constitutionnel.fr, « le bloc de constitutionnalité »), copiées sans changer un mot. À rafraîchir à chaque révision constitutionnelle (le titre XVII, abrogé, n'est pas repris par la page officielle).

## Les fichiers

- `fr/<texte>.txt` : le texte officiel ; `oc/<texte>.txt` : la traduction. **Un bloc par ligne**, `NNN balise texte` (`h2` titre, `h3` article, `p` alinéa). Mêmes numéros et mêmes balises, ligne pour ligne. Dans un alinéa, `⏎` sépare les lignes d'une liste ou deux paragraphes.
- Corriger un mot : modifier la ligne de `oc/`, sans toucher au numéro ni à la balise, puis `npm test` (le test `textes.test.js` contrôle l'alignement, les ancres, les espaces).
- `textes.js` lit les fichiers (l'occitan tout de suite, le français seulement si le visiteur le demande : poids de la page) ; `Lectura.svelte` les affiche (occitan, français, ou les deux face à face) ; `PaginaConstitucion.svelte` donne le cadre ; routes : `/constitucion`, `/constitucion/declaracion-1789`, `/constitucion/preambul-1946`, `/constitucion/carta-environament`.
- Ancres : `#art-2`, `#art-75-1`, `#titol-xi-bis`… (les deux articles qui parlent des langues sont reliés depuis le haut de la page).

## État : à valider par Romain

La page est affichée avec « Aquesta traduccion es pas oficiala e demòra de verificar. Sol lo tèxte francés fa fe. » et `noindex` tant que Romain n'a pas relu. Quand il aura validé : retirer la mention `noindex` dans `PaginaConstitucion.svelte` et adapter la phrase de `Lectura.svelte`.

## Comment l'occitan a été fait

- Languedocien, norme classique (CLO 2007 et Alibèrt), registre juridique soutenu, troisième personne. Formes de la *Gramatica de l'occitan estandard* quand elle tranche : négation « non … pas » (*non pòt pas*), **sans** « pas » après « non … que » restrictif (*non pòt èsser … qu'a la majoritat*) ni avec « cap de / degun » (*degun non pòt*) ; passif au passé : *es estat / foguèt* ; *setanta* (70), *dosen* (deuxième) mais *segond* quand il n'y en a que deux ; *dos / doas*.
- Chaque mot clé vérifié dans l'API de lo Congrès (Basic, vèrb'Òc, top'Òc) le 12-11 : environ 330 lemmes interrogés, puis 950 formes rares et longues. Un « absent du Basic » n'est pas une erreur (le Basic ne contient pas les dérivés : *adopcion*, *solemnament*…), il dit seulement où regarder.
- Chiffres, dates et renvois d'articles comparés par programme, bloc par bloc, au français : aucun écart.

## À valider (ce que lo Congrès ne tranche pas ou donne en plusieurs formes)

1. **Mots que le Basic ne connaît pas**, à regarder sur dicodòc.eu : *alinèa* (alinéa, gardé tel quel : aucun équivalent trouvé), *legislatura*, *parquet*, *justiciable*, *forclusion*, *mancament* (manquement), *plenièra* (formation plénière), *deontologia*, *subsidiaritat*, *perequacion*, *benèstre* (bien-être), *autrú* (autrui), *quota*, *repartiment*, *enviat* (envoyé extraordinaire), *tribunal de granda instància*.
2. **Formes données par lo Congrès, retenues contre le motif régulier** : *escrutinh* (le Basic donne cette forme, le schéma languedocien aurait *escrutini*) ; *sèti* (général) plutôt que *sètge* (languedocien) pour « siège » ; *assetament* pour l'assiette de l'impôt ; *aperténer* (languedocien) plutôt que *apartenir* ; *regèt* pour « rejet » ; *planh* pour « plainte » ; *otramar* pour « outre-mer » ; *gaudir* pour « jouir » ; *lesir* pour « léser » ; *cancelièr*, *procuraire*.
3. **Noms de lieux d'outre-mer** : *Guadalope* et *Maiòta* (top'Òc) ; *Martinica*, *La Reünion*, *Sant Bartomieu*, *Sant Martin*, *Sant Pèire e Miquelon*, *Wallis e Futuna*, *Polinesia francesa*, *Nòva Caledònia*, *Numèa*, *Tèrras australas e antarticas francesas* d'après Wikipédia en occitan ; *la Guiana* pour la Guyane (non retrouvé, à vérifier).
4. **Tournures** : « gouvernement du peuple, par le peuple et pour le peuple » donne *govèrn del pòble, pel pòble e pel pòble* (l'occitan dit *per* pour « par » et « pour ») ; « La Marseillaise » traduit *La Marselhesa* ; « le cas échéant » rendu *s'es lo cas* ; « au lendemain de » *a l'endeman de* ; « porter atteinte à » *portar tòrt a* ; *desvolopament durable*.
5. Les mots ordinaires (verbes, noms, adjectifs courants) n'ont pas été relus un par un : une relecture par un locuteur reste nécessaire, surtout pour l'accord des participes, les prépositions et les articles contractés.

## Poids

Page de la Constitution, occitan seul : environ 22 Ko compressés de script, plus le texte déjà dans la page. Le français (30 Ko compressés) ne se charge que si le visiteur choisit « Francés » ou « Los dos ».
