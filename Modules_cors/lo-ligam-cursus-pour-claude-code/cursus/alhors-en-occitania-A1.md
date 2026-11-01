# *Alhors en Occitània* : les expressions de l'A1 dans les autres dialectes

Décision de Romain du 2026-11-01 : chaque unité de l'A1 a un court encart « *Alhors en Occitània* » (ailleurs en Occitanie). Il montre les expressions clés de l'unité dans les autres grands dialectes, **à reconnaître, pas à apprendre**.

**Statut** : relevé de Claude du 2026-11-01, **à relire par Romain** avant toute publication. Aucune forme n'est inventée : chacune vient d'un dictionnaire ou du conjugueur du dialecte, en graphie classique. Aucune transposition depuis la graphie mistralienne n'a été nécessaire (le Tresor dóu Felibrige n'a pas servi). Les formes languedociennes de référence viennent de la carte (`01-A1-carta-8-unitats.md`, §4 et §5) et du module 1.1 ; repassées par l'API de lo Congrès le 2026-11-01 (`verificar-oc.mjs`) : toutes confirmées, *alhors* compris, sauf trois cas déjà connus : *maire* (erreur de l'API, mais présent dans Laus et Lagarde sur dicodòc), *ans* (pluriel de *an*), *Occitània* (nom propre).

**Format des blocs** : copié du bloc `type: 'table'` de `app/src/lib/lesson/moduls/modul-1-1.js` (`title`, `head`, `rows`, `notes`). J'ajoute `intro`, que `app/src/lib/lesson/TableBlock.svelte` affiche aussi sous le titre, et `glosa`, que la page n'affiche pas : il dit à `scripts/controle-explications.mjs` que les formes des autres dialectes sont « glosées en passant » (règle de `regles-redaccion-A1.md` §4). Le texte en `*…*` passe en italique (`rich()`). Les groupes de lettres (« ca », « ch ») sont entre guillemets et non en italique, pour que le contrôle ne les prenne pas pour des mots. Place de l'encart : à la fin du module x.4, après le mémo de l'unité (`regles-redaccion-A1.md` §3).

---

## Lire ce fichier

**Confiance**
- ✓ **sûr** : la forme, ou la phrase entière, figure telle quelle dans une source de ce dialecte.
- ≈ **probable** : chaque mot est attesté dans une source du dialecte, mais c'est moi qui ai assemblé la phrase ou pris la bonne personne du verbe.
- ⚠️ **à vérifier** : forme déduite, ou sources en désaccord. Aucune dans ce relevé : quand je n'avais qu'une déduction, j'ai laissé la case vide.
- **pas de source sûre** : rien trouvé. Dans le bloc, la case reste vide et une note le dit.

**Sources** (codes des tableaux). Les dictionnaires se consultent sur dicodòc, le site de lo Congrès : https://dicodoc.eu/oc/diccionaris (chaque unité donne le lien de ses recherches ; dicodòc n'affiche que 25 résultats, on peut cocher un seul dictionnaire).

| Code | Source | Dialecte |
|---|---|---|
| B | Lo Basic, lexic referencial e ortografic francés-occitan, lo Congrès (comun gascon-lengadocian) | gascon et languedocien |
| PN | Per Noste : M. Grosclaude, G. Nariòo, P. Guilhemjoan, *Dictionnaire français/occitan (gascon)*, Per Noste, 2003 | gascon |
| RB | N. Rei Bèthvéder, *Dictionnaire français-occitan, gascon toulousain*, IEO, 2004 | gascon |
| AT | *Atau que's ditz ! Gascon des Hautes-Pyrénées*, Conseil général des Hautes-Pyrénées, 1998 | gascon |
| CP | CREO Provença, *Dictionnaire de base français-provençal*, 1992 | provençal |
| LL | *Lexique limousin* (dicodòc n'en donne pas l'auteur) | limousin |
| OM | « Omelhièr » sur dicodòc, sans référence affichée ; vraisemblablement Cristian Omelhièr, *Petit dictionnaire français-occitan d'Auvergne*, Ostal del Libre, 2004, parler du sud de l'Auvergne ([fiche de l'ouvrage](https://www.espaci-occitan.com/botiga/en/diccionari/302-petit-dictionnaire-francais-occitan-d-auvergne-9782914662062.html)) | auvergnat |
| FA | A. Faure, *Diccionari alpin d'Oc*, 2009 | vivaro-alpin |
| GR | « Grange » sur dicodòc (occitan vers français), sans référence affichée | vivaro-alpin |
| VO | vèrb'Òc, le conjugueur de lo Congrès (API interrogée le 2026-11-01). Il connaît le gascon, le limousin et le provençal, pas l'auvergnat ni le vivaro-alpin | gascon, limousin, provençal |
| WP | Wikipédia en français, article de chaque dialecte (liens ci-dessous) | traits et aires |

---

## Où sont parlés ces dialectes

- **Languedocien** (ton cours, la référence) : « principalement dans le Languedoc et en Guyenne », surtout en région Occitanie (Aveyron, Lot, Tarn, Aude, Hérault, Lozère…), et en partie en Nouvelle-Aquitaine et en Auvergne-Rhône-Alpes. Source : [WP Languedocien](https://fr.wikipedia.org/wiki/Languedocien).
- **Gascon** : en Gascogne : tout le Gers, les Hautes-Pyrénées et les Landes, une partie de l'Ariège, de la Haute-Garonne, de la Gironde, des Pyrénées-Atlantiques, du Lot-et-Garonne et du Tarn-et-Garonne, et le Val d'Aran en Espagne. Source : [WP Gascon](https://fr.wikipedia.org/wiki/Gascon).
- **Provençal** : en Provence, dans le Gard provençal, la Drôme provençale et le Trièves ; pour certains aussi dans des vallées du Piémont, en Italie. Source : [WP Provençal](https://fr.wikipedia.org/wiki/Proven%C3%A7al).
- **Limousin** : dans les trois départements du Limousin (Corrèze, Creuse, Haute-Vienne), le tiers est de la Charente et la moitié nord de la Dordogne. Source : [WP Limousin (dialecte)](https://fr.wikipedia.org/wiki/Limousin_(dialecte)).
- **Auvergnat** : dans la majeure partie de l'Auvergne : l'essentiel du Puy-de-Dôme, le nord et l'est du Cantal, les deux tiers de la Haute-Loire, le nord-ouest de l'Ardèche. Source : [WP Auvergnat](https://fr.wikipedia.org/wiki/Auvergnat).
- **Vivaro-alpin** : des Alpes du Sud aux contreforts est du Massif central, en France (Auvergne-Rhône-Alpes, Provence-Alpes-Côte d'Azur) et en Italie (Piémont, Calabre). Source : [WP Vivaro-alpin](https://fr.wikipedia.org/wiki/Vivaro-alpin).
- **Niçard** : le pays niçois ; la plupart des chercheurs le rangent dans le provençal, mais sa place fait débat. Source : [WP Provençal](https://fr.wikipedia.org/wiki/Proven%C3%A7al). **Pas de colonne niçard** : aucun des dictionnaires réunis sur dicodòc n'est niçard, et je n'ai pas trouvé d'autre source sûre en graphie classique.

Limousin, auvergnat et vivaro-alpin forment le **nord-occitan** ; il se reconnaît d'abord au passage de *ca*, *ga* à *cha*, *ja* (*cantar* devient *chantar*). Source : [WP Nord-occitan](https://fr.wikipedia.org/wiki/Nord-occitan).

---

## Bilan

**110 formes** (8 unités, 22 expressions, 5 dialectes) : **88 sûres**, **16 probables**, **0 à vérifier**, **6 cases sans source sûre** (unités 4, 5 et 6). En réserve, hors blocs, deux expressions citées en exemple dans la commande (*Quant as d'ans ?*, *Quin temps fa ?*) : 3 sûres, 3 probables, 4 cases vides.

Les formes probables sont surtout des phrases (*Ont es la gara ?*, *Qué fas ?*, *Qué vòls ?*) : les mots sont sûrs, l'assemblage est de moi.

---

## Unité 1 · *Adieu !*

**Retenues** : *Adieu !*, *Cossí vas ?*, *Mercés !* (formes du module 1.1).

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| salut ! | *Adieu !* | *Adiu !* ✓ B, RB, PN | *Adieu !* ✓ CP | *Adieu !* ✓ LL | *Adiu !* · *Mainatja !* ✓ OM | *Adieu !* ✓ FA |
| comment vas-tu ? | *Cossí vas ?* | *Com vas ?* · *Quin te va ?* ✓ PN | *Coma vas ?* ≈ CP, VO | *Coma vas ?* ≈ LL, VO | *Coma vas ?* ≈ OM | *Coma vas ?* ✓ FA |
| merci ! | *Mercés !* | *Mercés !* ✓ PN, AT, RB | *Mercé !* · *Grandmercé !* ✓ CP | *Mercés !* ✓ LL | *Bien brave !* · *Gramarcés !* ✓ OM | *Mercí !* · *Grandmercí !* ✓ FA |

**Détail des sources**
- Gascon : *adiu* (tu), *adishatz* (vous) [B] ; PN, entrée *aller* : « comment vas-tu ? : quin te va ? / quin ès ? / com(a) vas ? / com(a) va ? ».
- Provençal : *coma ~ come* [CP, *comment*] et *vas* [VO]. Pour « comment allez-vous ? », CP donne *Coma siatz ? Coma va[i] ? Coma anatz ?*
- Limousin : *coma* [LL] et *vas* [VO].
- Auvergnat : *adiu* est donné pour « au revoir », *mainatja !* pour « salut ! » et pour « au revoir » familier ; *coma* ; *anar* se conjugue *vase/vau, vases/vas, vai/va* ; OM donne aussi *Quò vai ?* (ça va ?). Pour « merci » : *bien brave, -a* ; pour « merci beaucoup » : *gramarcés / grand-marcés* [OM].
- Vivaro-alpin : exemple de FA : « Adieu, coma vas ? Fai longtemps que t'aviáu pas vist ! » ; « merci : mercé, mercí, grandmercí » [FA].

Recherches dicodòc : [adieu](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=adieu) · [salut](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=salut) · [revoir](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=revoir) · [comment](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=comment) · [aller](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=aller) · [merci](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=merci)

**Ce qui change** (une ligne par expression, pour l'apprenant)
- *Adieu* devient *Adiu* en gascon et en auvergnat (qui dit aussi *Mainatja !*). (B, PN, OM)
- « Comment » : *cossí* chez toi, *com* ou *quin* en gascon, *coma* dans les autres dialectes. (B, PN, CP, LL, OM, FA)
- Merci : *mercé* en provençal, *mercí* en vivaro-alpin ; en auvergnat, on dit aussi *Bien brave !* (CP, FA, OM)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'salut !', 'comment vas-tu ?', 'merci !'],
	rows: [
		['languedocien (ton cours)', '*Adieu !*', '*Cossí vas ?*', '*Mercés !*'],
		['gascon', '*Adiu !*', '*Com vas ?* · *Quin te va ?*', '*Mercés !*'],
		['provençal', '*Adieu !*', '*Coma vas ?*', '*Mercé !* · *Grandmercé !*'],
		['limousin', '*Adieu !*', '*Coma vas ?*', '*Mercés !*'],
		['auvergnat', '*Adiu !* · *Mainatja !*', '*Coma vas ?*', '*Bien brave !* · *Gramarcés !*'],
		['vivaro-alpin', '*Adieu !*', '*Coma vas ?*', '*Mercí !* · *Grandmercí !*']
	],
	notes: [
		'*Adieu* devient *Adiu* en gascon et en auvergnat (qui dit aussi *Mainatja !*).',
		'« Comment » : *cossí* chez toi, *com* ou *quin* en gascon, *coma* dans les autres dialectes.',
		'Merci : *mercé* en provençal, *mercí* en vivaro-alpin ; en auvergnat, on dit aussi *Bien brave !*',
		'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc).'
	],
	glosa: {
		adiu: 'salut, au revoir (gascon, auvergnat)',
		'com vas': 'comment vas-tu ? (gascon)',
		'quin te va': 'comment vas-tu ? (gascon)',
		'coma vas': 'comment vas-tu ?',
		mercé: 'merci (provençal)',
		grandmercé: 'merci beaucoup (provençal)',
		mainatja: 'salut, au revoir (auvergnat)',
		'bien brave': 'merci (auvergnat)',
		gramarcés: 'merci beaucoup (auvergnat)',
		mercí: 'merci (vivaro-alpin)',
		grandmercí: 'merci beaucoup (vivaro-alpin)'
	}
}
```

---

## Unité 2 · *Parlas occitan ?*

**Retenues** : *un pauc*, *plan* (module 2.2). *Parlas occitan ?* est écarté : le verbe ne change qu'en provençal (*parles*, VO), et l'auvergnat comme le vivaro-alpin n'ont pas de source sûre pour « tu parles ».

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| un peu | *un pauc* | *un chic* ✓ B, PN | *un pauc* ✓ CP | *un pauc* ✓ LL | *un pauc* ✓ OM | *un pauc* ✓ FA |
| bien | *plan* | *plan* ✓ B, PN, AT | *ben* ✓ CP | *ben* · *plan* ✓ LL | *ben* ✓ OM | *ben* ✓ FA |

**Détail des sources**
- Gascon : B donne « un peu : un drin ; un chic » ; PN : « un pauc \ un chic de sau », « il danse bien : que dança plan ».
- Provençal : « un peu : un pauc », « très bien : fòrça ben » [CP].
- Limousin : « un peu : un pauc ; un bric / un brijon » ; « bien : ben ; plan » [LL].
- Auvergnat : « Un pauc de pan » ; « bien : ben », aussi *bien* [OM].
- Vivaro-alpin : « Un pauc mai de vin ? » [FA, entrée *merci*] ; « bien : ben, bien » [FA].

Recherches dicodòc : [peu](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=peu) · [bien](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=bien)

**Ce qui change**
- « Un peu » se dit souvent *un chic* en gascon ; partout ailleurs, *un pauc*. (B, PN, CP, LL, OM, FA)
- « Bien » : *plan* chez toi et en gascon, *ben* en provençal, en auvergnat et en vivaro-alpin ; le limousin dit les deux. (B, PN, CP, LL, OM, FA)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'un peu', 'bien'],
	rows: [
		['languedocien (ton cours)', '*un pauc*', '*plan*'],
		['gascon', '*un chic*', '*plan*'],
		['provençal', '*un pauc*', '*ben*'],
		['limousin', '*un pauc*', '*ben* · *plan*'],
		['auvergnat', '*un pauc*', '*ben*'],
		['vivaro-alpin', '*un pauc*', '*ben*']
	],
	notes: [
		'« Un peu » se dit souvent *un chic* en gascon ; partout ailleurs, *un pauc*.',
		'« Bien » : *plan* chez toi et en gascon, *ben* en provençal, en auvergnat et en vivaro-alpin ; le limousin dit les deux.',
		'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
	],
	glosa: { 'un chic': 'un peu (gascon)', ben: 'bien' }
}
```

---

## Unité 3 · *La familha*

**Retenues** : *lo paire, la maire*, *la filha*, *lo can*. **En réserve** : *Quant as d'ans ?* (trois dialectes sans source sûre).

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| le père, la mère | *lo paire, la maire* | *lo pair, la mair* ✓ B, PN, AT | *lo paire, la maire* ✓ CP | *lo paire, la maire* ✓ LL | *lo paire, la maire* ✓ OM | *lo paire, la maire* ✓ GR |
| la fille | *la filha* | *la hilha* ✓ B, PN, RB, AT | *la filha* ✓ CP | *la filha* ✓ LL | *la filha* ✓ OM | *la filha* ✓ FA |
| le chien | *lo can* | *lo can* ✓ B, PN | *lo can* · *lo chin* ✓ CP | *lo chen* · *lo chin* ✓ LL | *lo chin* ✓ OM | *lo chin* ✓ FA |
| *réserve* : quel âge as-tu ? | *Quant as d'ans ?* | *Quantes ans as ?* · *Quin atge as ?* ✓ PN | *Quant as d'ans ?* · *Quant as de temps ?* ✓ CP | pas de source sûre | pas de source sûre | pas de source sûre |

**Détail des sources**
- Articles *lo, la* : attestés dans chaque dictionnaire (PN « lo pair Nadau », CP « Lo jorn », LL « le : lo », OM « lo dumenche », FA « Lo menche »).
- Gascon : B « père : pair », « mère : mair », « fille (filiation) : hilha » ; PN donne aussi *gos* pour le chien (est de la Gascogne).
- Limousin : LL écrit *pair(e)*, *mair(e)* : les deux formes existent.
- Provençal : CP donne *chin* (noté *frc anc*) et *can* (noté *cl*).
- Vivaro-alpin : *paire*, *maire* viennent de GR ; FA n'a pas d'entrée « père ». « chien : chin, -a » [FA].
- Réserve : PN « quel âge as-tu ? : quin atge as ? / quantes ans as ? » ; CP « Quel âge as-tu ? Quant as de temps / d'ans ? ». LL, OM et FA ne donnent que *atge*, *edat* ou *temps*, sans la question.

Recherches dicodòc : [père](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=p%C3%A8re) · [mère](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=m%C3%A8re) · [fille](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=fille) · [chien](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=chien) · [âge](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=%C3%A2ge)

**Ce qui change**
- Le gascon dit *pair* et *mair*, sans le *-e* final. (B, PN)
- En gascon, le *f* du début devient *h* : *filha* devient *hilha*. (WP Gascon : « f > h » ; B, PN)
- Au nord (limousin, auvergnat, vivaro-alpin), beaucoup de mots en « ca » passent à « ch » : le chien y est *lo chin* ; le provençal connaît *can* et *chin*. (WP Nord-occitan ; LL, OM, FA, CP)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'le père, la mère', 'la fille', 'le chien'],
	rows: [
		['languedocien (ton cours)', '*lo paire, la maire*', '*la filha*', '*lo can*'],
		['gascon', '*lo pair, la mair*', '*la hilha*', '*lo can*'],
		['provençal', '*lo paire, la maire*', '*la filha*', '*lo can* · *lo chin*'],
		['limousin', '*lo paire, la maire*', '*la filha*', '*lo chen* · *lo chin*'],
		['auvergnat', '*lo paire, la maire*', '*la filha*', '*lo chin*'],
		['vivaro-alpin', '*lo paire, la maire*', '*la filha*', '*lo chin*']
	],
	notes: [
		'Le gascon dit *pair* et *mair*, sans le *-e* final.',
		'En gascon, le *f* du début devient *h* : *filha* devient *hilha*.',
		'Au nord (limousin, auvergnat, vivaro-alpin), beaucoup de mots en « ca » passent à « ch » : le chien y est *lo chin* ; le provençal connaît *can* et *chin*.',
		'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
	],
	glosa: {
		'lo pair, la mair': 'le père, la mère (gascon)',
		'la hilha': 'la fille (gascon)',
		'lo chin': 'le chien',
		'lo chen': 'le chien (limousin)'
	}
}
```

---

## Unité 4 · *Qué fas ?*

**Retenues** : *Qué fas ?*, *lo dimenge*.

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| que fais-tu ? | *Qué fas ?* | *Que hès ?* ≈ PN, VO | *Qué fas ?* ≈ CP, VO | *Qué fas ?* ≈ LL, VO | *Da que fases ?* ✓ OM | pas de source sûre |
| le dimanche | *lo dimenge* | *lo dimenge* ✓ B, PN, RB | *lo dimenge* ✓ CP | *lo diumenc* ✓ LL | *lo dumenche* ✓ OM | *lo dimenche* · *lo menche* ✓ FA |

**Détail des sources**
- Gascon : *har* (faire) [PN : « har {B., L.} ; hèr {Gers, Big.} »] ; *hès* [VO ; PN « vam quin hès »]. PN écrit « que veux-tu ? : que vòs ? » sans accent, d'où *Que hès ?* ; mais il écrit « entà qué hès aquò ? » avec accent après une préposition.
- Provençal : *qué* [CP « Sabi de qué parla »] et *fas* [VO].
- Limousin : *qué* (pronom interrogatif) [LL] et *fas* [VO].
- Auvergnat : exemples de OM, entrée *que* : « Da que vòles ? Da que fases ? » ; *faire / far* se conjugue *fase/fau, fases/fas, fai/fa*.
- Vivaro-alpin : FA donne *far, faire* et seulement *fai* (« Fai dos meses qu'a pas plogut ») : pas de « tu fais ».
- Dimanche : LL « diumenc / dimenge {Bas-Limousin} » ; OM « lo dumenche, la dumenja » ; FA « dimenge, dimenche, lo menche, dimenja », « Ieu, trabalho pas lo dimenche. » ; AT (gascon) donne aussi *dimenche*.

Recherches dicodòc : [que](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=que) · [quoi](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=quoi) · [faire](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=faire) · [dimanche](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=dimanche)

**Ce qui change**
- En gascon, *far* devient *har* : *Que hès ?* En auvergnat, la question commence par *Da que* : *Da que fases ?* (PN, VO, WP Gascon ; OM)
- Le dimanche change d'un pays à l'autre : *diumenc* en limousin, *dumenche* en auvergnat, *dimenche* en vivaro-alpin. (LL, OM, FA)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'que fais-tu ?', 'le dimanche'],
	rows: [
		['languedocien (ton cours)', '*Qué fas ?*', '*lo dimenge*'],
		['gascon', '*Que hès ?*', '*lo dimenge*'],
		['provençal', '*Qué fas ?*', '*lo dimenge*'],
		['limousin', '*Qué fas ?*', '*lo diumenc*'],
		['auvergnat', '*Da que fases ?*', '*lo dumenche*'],
		['vivaro-alpin', '', '*lo dimenche*'] // « que fais-tu ? » : pas de source sûre
	],
	notes: [
		'En gascon, *far* devient *har* : *Que hès ?* En auvergnat, la question commence par *Da que* : *Da que fases ?*',
		'Le dimanche change d’un pays à l’autre : *diumenc* en limousin, *dumenche* en auvergnat, *dimenche* en vivaro-alpin.',
		'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
	],
	glosa: {
		far: 'faire',
		har: 'faire (gascon)',
		'que hès': 'que fais-tu ? (gascon)',
		'da que fases': 'que fais-tu ? (auvergnat)',
		'lo diumenc': 'le dimanche (limousin)',
		'lo dumenche': 'le dimanche (auvergnat)',
		'lo dimenche': 'le dimanche (vivaro-alpin)'
	}
}
```

---

## Unité 5 · *Al mercat*

**Retenues** : *Qué vòls ?*, *lo formatge*, *se vos plai*. *Quant còsta ?* est écarté : *còsta* est identique dans les quatre variétés de VO.

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| que veux-tu ? | *Qué vòls ?* | *Que vòs ?* ✓ PN | *Qué vòles ?* ≈ CP, VO | *Qué vòles ?* ≈ LL, VO | *Da que vòles ?* ✓ OM | pas de source sûre |
| le fromage | *lo formatge* | *lo hromatge* ✓ B, PN, AT | *lo fromatge* ✓ CP | *lo fromatge* ✓ LL | *lo fromatge* · *la toma* ✓ OM | *lo fromatge* ✓ FA |
| s'il vous plaît | *se vos plai* | *en v'ac pregar* · *que v'ac prèi* ✓ PN | *se vos plai* ✓ CP | pas de source sûre | *si-vos-plai* · *si-os-plai* ✓ OM | *si vos plai* ✓ FA |

**Détail des sources**
- Gascon : PN « que veux-tu ? : que vòs ? » ; « s'il vous plaît : en v'ac pregar ; que v'ac prèi » ; *hromatge*, aussi *hormatge, formatge, fromatge* [PN] ; B « fromage : lang formatge, gasc hromatge ».
- Provençal : CP « Quelle part veux-tu ? Quina part / Que part vòles ? » ; VO donne *vòles* et *vòs* ; « s'il vous plaît : se vos plai » [CP].
- Limousin : *qué* [LL] et *vòles* [VO]. LL n'a ni « s'il vous plaît » ni « s'il te plaît » (seulement *plaire / plàser ; agradar*).
- Auvergnat : « Da que vòles ? » ; « fromage : toma, fromatge / formatge » ; « s'il vous plaît : si-os-plai / si-vos-plai » [OM].
- Vivaro-alpin : FA donne *vòlo* (je veux) et *vòl* (il veut), pas « tu veux » ; « fromage : fromatge, fromatgi » ; « Fasetz-me passar lo vin, si vos plai. » [FA].

Recherches dicodòc : [que](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=que) · [quel](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=quel) · [vouloir](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=vouloir) · [fromage](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=fromage) · [plaire](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=plaire) · [s'il vous plaît](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=s%27il+vous+pla%C3%AEt)

**Ce qui change**
- « Tu veux » : *vòls* chez toi, *vòs* en gascon, *vòles* en provençal, en limousin et en auvergnat. (PN, CP, VO, OM)
- En gascon, le *f* devient *h* ici aussi : *lo hromatge*. Ailleurs, surtout *fromatge* ; en auvergnat, aussi *la toma*. (B, PN, CP, LL, OM, FA)
- Pour « s'il vous plaît », le gascon a sa propre formule : *en v'ac pregar*. En auvergnat et en vivaro-alpin : *si vos plai*. (PN, OM, FA)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'que veux-tu ?', 'le fromage', 's’il vous plaît'],
	rows: [
		['languedocien (ton cours)', '*Qué vòls ?*', '*lo formatge*', '*se vos plai*'],
		['gascon', '*Que vòs ?*', '*lo hromatge*', '*en v’ac pregar*'],
		['provençal', '*Qué vòles ?*', '*lo fromatge*', '*se vos plai*'],
		['limousin', '*Qué vòles ?*', '*lo fromatge*', ''], // « s’il vous plaît » : pas de source sûre
		['auvergnat', '*Da que vòles ?*', '*lo fromatge* · *la toma*', '*si-vos-plai*'],
		['vivaro-alpin', '', '*lo fromatge*', '*si vos plai*'] // « que veux-tu ? » : pas de source sûre
	],
	notes: [
		'« Tu veux » : *vòls* chez toi, *vòs* en gascon, *vòles* en provençal, en limousin et en auvergnat.',
		'En gascon, le *f* devient *h* ici aussi : *lo hromatge*. Ailleurs, surtout *fromatge* ; en auvergnat, aussi *la toma*.',
		'Pour « s’il vous plaît », le gascon a sa propre formule : *en v’ac pregar*. En auvergnat et en vivaro-alpin : *si vos plai*.',
		'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
	],
	glosa: {
		'que vòs': 'que veux-tu ? (gascon)',
		'qué vòles': 'que veux-tu ?',
		'da que vòles': 'que veux-tu ? (auvergnat)',
		'lo hromatge': 'le fromage (gascon)',
		'lo fromatge': 'le fromage',
		'la toma': 'le fromage, la tomme (auvergnat)',
		'en v’ac pregar': 's’il vous plaît (gascon)',
		'si vos plai': 's’il vous plaît (auvergnat, vivaro-alpin)'
	}
}
```

---

## Unité 6 · *La jornada*

**Retenues** : *Quina ora es ?*, *Plòu.*, *Fa caud.* **En réserve** : *Quin temps fa ?* (trois formes assemblées sur quatre, une case vide).

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| quelle heure est-il ? | *Quina ora es ?* | *Quina òra ei ?* ✓ PN | *Quant es d'ora ?* ✓ CP | pas de source sûre | *Quanh'ora z-es ?* · *Quant es d'oras ?* ✓ OM | *Quant es d'ora ?* ✓ FA |
| il pleut | *Plòu.* | *Que plau.* ✓ PN, RB, VO | *Plòu.* ✓ CP | *Plòu.* ✓ VO, LL | pas de source sûre | pas de source sûre |
| il fait chaud | *Fa caud.* | *Que hè calor.* ✓ PN, B | *Fa caud.* · *Fai caud.* ✓ CP | *Fai chaud.* · *Quò fai chaud.* ✓ LL | *Fai chaud.* ✓ OM | *Fai chaud.* ✓ FA |
| *réserve* : quel temps fait-il ? | *Quin temps fa ?* | *Quin temps hè ?* ≈ PN, VO | *Quin temps fa ?* · *Que temps fai ?* ✓ CP | *Quau temps fai ?* ≈ LL, VO | *Quanhe temps fai ?* ≈ OM | pas de source sûre |

**Détail des sources**
- Gascon : PN « quelle heure est-il ? : quina òra ei ? », « il pleut par moments : que plau a passadas », « il fait chaud : que hè calor » ; RB « 'il pleut' > 'plau' » ; *plàver* (pleuvoir) [B, PN] ; VO *plau*, *hè*. Réserve : *quin* [PN] et *hè* [VO].
- Provençal : CP « Quelle heure est-il ? Quant es d'ora ? », « Il pleut : Plòu. », « il fait chaud : fa[i] caud », « Quel temps fait-il ? Quin temps / Que temps fa[i] ? ».
- Limousin : *plòu* [VO] ; LL « plòure / pleure », « il fait chaud : fai chaud / quò fai chaud » ; LL n'a pas « quelle heure est-il ? ». Réserve : *quau, quala* (quel) [LL] et *fai* [VO].
- Auvergnat : OM « Quanh'ora z-es ? Quant es d'oras ? », « Alh mes d'avost fai chaud ». Pour « pleuvoir », OM ne donne que l'infinitif *pleure / plòure* et des tournures (*Quò draja*, *Quò trai a fiau*). Réserve : *quenh / quanhe* (quel) et *fai* [OM].
- Vivaro-alpin : FA « Quant es d'ora ? Son set oras e mieja. », « chaud (il fait) : fai chaud ». Pour « pleuvoir », seulement *plòure* et un passé (« ploguec fòrça ») ; pas de « quel temps fait-il ? ».

Recherches dicodòc : [heure](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=heure) · [quel](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=quel) · [pleuvoir](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=pleuvoir) · [chaud](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=chaud) · [temps](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=temps)

**Ce qui change**
- Pour l'heure, le provençal et le vivaro-alpin disent *Quant es d'ora ?*, le gascon *Quina òra ei ?* (CP, FA, PN)
- En gascon, une phrase qui affirme commence souvent par *que* : *Que plau.* (WP Gascon : « que énonciatif » ; PN)
- Au nord (limousin, auvergnat, vivaro-alpin), *caud* devient *chaud* et *fa* devient *fai* : *Fai chaud.* Le gascon dit *Que hè calor.* (WP Nord-occitan ; LL, OM, FA, VO ; PN)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'quelle heure est-il ?', 'il pleut', 'il fait chaud'],
	rows: [
		['languedocien (ton cours)', '*Quina ora es ?*', '*Plòu.*', '*Fa caud.*'],
		['gascon', '*Quina òra ei ?*', '*Que plau.*', '*Que hè calor.*'],
		['provençal', '*Quant es d’ora ?*', '*Plòu.*', '*Fa caud.*'],
		['limousin', '', '*Plòu.*', '*Fai chaud.*'], // « quelle heure est-il ? » : pas de source sûre
		['auvergnat', '*Quanh’ora z-es ?*', '', '*Fai chaud.*'], // « il pleut » : pas de source sûre
		['vivaro-alpin', '*Quant es d’ora ?*', '', '*Fai chaud.*'] // « il pleut » : pas de source sûre
	],
	notes: [
		'Pour l’heure, le provençal et le vivaro-alpin disent *Quant es d’ora ?*, le gascon *Quina òra ei ?*',
		'En gascon, une phrase qui affirme commence souvent par *que* : *Que plau.*',
		'Au nord (limousin, auvergnat, vivaro-alpin), *caud* devient *chaud* et *fa* devient *fai* : *Fai chaud.* Le gascon dit *Que hè calor.*',
		'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
	],
	glosa: {
		'quina òra ei': 'quelle heure est-il ? (gascon)',
		'quant es d’ora': 'quelle heure est-il ? (provençal, vivaro-alpin)',
		'quanh’ora z-es': 'quelle heure est-il ? (auvergnat)',
		que: 'petit mot qui ouvre une phrase affirmative (gascon)',
		'que plau': 'il pleut (gascon)',
		'que hè calor': 'il fait chaud (gascon)',
		'fai chaud': 'il fait chaud (limousin, auvergnat, vivaro-alpin)'
	}
}
```

---

## Unité 7 · *L'ostal*

**Retenues** : *l'ostal*, *la cambra*, *roge, roja*.

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| la maison | *l'ostal* | *l'ostau* ✓ B, PN, RB | *l'ostau* ✓ CP | *l'ostau* · *la maison* ✓ LL | *l'ostal* · *l'ostau* ✓ OM | *l'ostau* · *la maison* ✓ FA |
| la chambre | *la cambra* | *la crampa* · *la cramba* ✓ PN, B, AT, RB | *la chambra* · *la cambra* ✓ CP | *la chambra* ✓ LL | *la chambra* ✓ OM | *la chambra* ✓ FA |
| rouge | *roge, roja* | *arroi, arroja* ✓ B, PN, AT | *roge, roja* ✓ CP | *roge, roja* ✓ LL | *roge, roja* ✓ OM | *roge, roja* ✓ FA |

**Détail des sources**
- Gascon : B « maison : ostal/ostau » ; PN *ostau* ; B « chambre : cambra, gasc cramba ; crampa » ; PN « crampa ; cramba {Pyr.} » ; B « rouge : roge, roja, gasc (ar)roi, (ar)roja » ; PN aussi *(ar)roge, -ja*.
- Provençal : CP « Un ostau nòu », aussi *maison ~ maion* ; « chambra ~ cambra » ; « Peis roge », « La mar Roja ».
- Auvergnat : OM « ostal / ostau, maison » ; « chambra » ; « roge, roja ».
- Vivaro-alpin : FA « maison ; ostau ; casa », « Serai a l'ostau a set oras. » ; « chambra » ; « A crompat una autò roja. ».

Recherches dicodòc : [maison](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=maison) · [chambre](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=chambre) · [rouge](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=rouge)

**Ce qui change**
- Presque partout ailleurs, *ostal* devient *ostau*. (B, PN, CP, LL, OM, FA ; WP Provençal : le *-l* final se prononce *ou*)
- Au nord, et aussi en provençal, *cambra* devient *chambra* ; en gascon, la chambre est la *crampa*. (WP Nord-occitan ; LL, OM, FA, CP, PN)
- En gascon, un *a* s'ajoute devant le *r* du début : *roge* devient *arroi*. (WP Gascon : « r- > arr- » ; B, PN)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'la maison', 'la chambre', 'rouge'],
	rows: [
		['languedocien (ton cours)', '*l’ostal*', '*la cambra*', '*roge, roja*'],
		['gascon', '*l’ostau*', '*la crampa*', '*arroi, arroja*'],
		['provençal', '*l’ostau*', '*la chambra* · *la cambra*', '*roge, roja*'],
		['limousin', '*l’ostau* · *la maison*', '*la chambra*', '*roge, roja*'],
		['auvergnat', '*l’ostal* · *l’ostau*', '*la chambra*', '*roge, roja*'],
		['vivaro-alpin', '*l’ostau* · *la maison*', '*la chambra*', '*roge, roja*']
	],
	notes: [
		'Presque partout ailleurs, *ostal* devient *ostau*.',
		'Au nord, et aussi en provençal, *cambra* devient *chambra* ; en gascon, la chambre est la *crampa*.',
		'En gascon, un *a* s’ajoute devant le *r* du début : *roge* devient *arroi*.',
		'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
	],
	glosa: {
		'l’ostau': 'la maison',
		'la maison': 'la maison (limousin, vivaro-alpin)',
		'la crampa': 'la chambre (gascon)',
		'la chambra': 'la chambre',
		'arroi, arroja': 'rouge (gascon)'
	}
}
```

---

## Unité 8 · *En vila*

**Retenues** : *Ont es la gara ?*, *la carrièra*, *a drecha, a esquèrra*.

| | languedocien | gascon | provençal | limousin | auvergnat | vivaro-alpin |
|---|---|---|---|---|---|---|
| où est la gare ? | *Ont es la gara ?* | *On ei la gara ?* ≈ B, PN, AT | *Ont es la gara ?* ≈ CP | *Ent es la gara ?* ≈ LL, VO | *Ont es la gara ?* ≈ OM | *Ont'es la gara ?* ≈ FA |
| la rue | *la carrièra* | *la carrèra* ✓ B, PN, RB, AT | *la carriera* ✓ CP | *la charriera* ✓ LL | *la charreira* ✓ OM | *la charriera* ✓ FA |
| à droite, à gauche | *a drecha, a esquèrra* | *a dreta, a esquèrra* ≈ PN | *a drecha, a senèstra* ✓ CP | *a drecha, a gaucha* ≈ LL | *a dreita, a gaucha* ✓ OM | *a drecha, a senestra* ≈ FA |

**Détail des sources**
- Gascon : *on* [B ; PN « où allez-vous ? : on vatz ? »], *ei* [PN « quina òra ei ? » ; VO], *gara* [AT] ; PN « tourner à droite : tòrcer a dreta », « a man esquèrra ».
- Provençal : CP « onte [devant consonne], ont [devant voyelle] », « Ont anam ? » ; pour « gare », CP met *estacion* avant *gara* ; « à droite : a drecha », « à gauche : a (man) senèstra ; a (man) seneca ».
- Limousin : LL « où : ent(e) / ont(e) {Périgourdin, Bas-Limousin} / ant(e) {Marchois, Haut-Limousin} », *es* [VO], « gare : gara ; estacion » ; « droit, droite : drech, drecha / dreit, dreita » ; « gauche : mança ; gaucha » ; pas de « à droite » tout fait.
- Auvergnat : OM « Ont se tròba ta fenna ? », aussi *end'ont* (« End'ont aquò es ? ») ; « gara » ; « A dreita » ; « à gauche : a gaucha ».
- Vivaro-alpin : FA « Onte vas ? Sabo pas ont'es. » ; « gara, estacion » ; « droite : drecha, dreita » ; « gauche (côté) : senestra ».
- Rue : B « lang carrièra, gasc carrèra » ; CP « a la carriera » ; LL « charriera ; ruá » ; OM « Galopar per las charreiras » ; FA « charriera ».

Recherches dicodòc : [où](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=o%C3%B9) (pour FA, cocher seulement Faure : entrée « OU ») · [gare](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=gare) · [rue](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=rue) · [droite](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=droite) · [gauche](https://dicodoc.eu/oc/diccionaris?option=com_dicodoc&view=search&Itemid=168&type=fr-oc&q=gauche)

**Ce qui change**
- En gascon, « où est » se dit *on ei* : *On ei la gara ?* ; en limousin, *Ent es la gara ?* (B, PN, VO ; LL)
- Au nord, la rue est la *charriera* (limousin, vivaro-alpin) ou la *charreira* (auvergnat) : encore le « ca » qui passe à « cha ». (WP Nord-occitan ; LL, OM, FA)
- « À gauche » change de mot : *senèstra* en provençal (*senestra* en vivaro-alpin), *gaucha* en limousin et en auvergnat ; en gascon, *drecha* devient *dreta*. (CP, FA, LL, OM, PN)

```js
{
	type: 'table',
	title: 'Alhors en Occitània (ailleurs en Occitanie)',
	intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
	head: ['', 'où est la gare ?', 'la rue', 'à droite, à gauche'],
	rows: [
		['languedocien (ton cours)', '*Ont es la gara ?*', '*la carrièra*', '*a drecha, a esquèrra*'],
		['gascon', '*On ei la gara ?*', '*la carrèra*', '*a dreta, a esquèrra*'],
		['provençal', '*Ont es la gara ?*', '*la carriera*', '*a drecha, a senèstra*'],
		['limousin', '*Ent es la gara ?*', '*la charriera*', '*a drecha, a gaucha*'],
		['auvergnat', '*Ont es la gara ?*', '*la charreira*', '*a dreita, a gaucha*'],
		['vivaro-alpin', '*Ont’es la gara ?*', '*la charriera*', '*a drecha, a senestra*']
	],
	notes: [
		'En gascon, « où est » se dit *on ei* : *On ei la gara ?* ; en limousin, *Ent es la gara ?*',
		'Au nord, la rue est la *charriera* (limousin, vivaro-alpin) ou la *charreira* (auvergnat) : encore le « ca » qui passe à « cha ».',
		'« À gauche » change de mot : *senèstra* en provençal (*senestra* en vivaro-alpin), *gaucha* en limousin et en auvergnat ; en gascon, *drecha* devient *dreta*.',
		'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc).'
	],
	glosa: {
		'on ei': 'où est (gascon)',
		'ent es': 'où est (limousin)',
		'ont’es': 'où est (vivaro-alpin)',
		'la carrèra': 'la rue (gascon)',
		'la carriera': 'la rue (provençal)',
		'la charriera': 'la rue (limousin, vivaro-alpin)',
		'la charreira': 'la rue (auvergnat)',
		'a dreta': 'à droite (gascon)',
		'a dreita': 'à droite (auvergnat)',
		'a senèstra': 'à gauche (provençal)',
		'a senestra': 'à gauche (vivaro-alpin)',
		'a gaucha': 'à gauche (limousin, auvergnat)',
		dreta: 'droite (gascon)'
	}
}
```

---

## Doutes à trancher (Romain)

1. **Cases vides** (6 dans les blocs des unités 4, 5 et 6) : les laisser avec la note « Case vide : pas encore de forme sûre », ou retirer ces expressions des blocs ?
2. **Phrases assemblées** (16 formes ≈, surtout *Ont es la gara ?* et le gascon *Que hès ?*, *On ei la gara ?*) : les publier telles quelles après ta relecture, ou les faire relire par quelqu'un qui parle le dialecte ?
3. **Auvergnat d'un seul dictionnaire** : *Bien brave !* (merci), *Mainatja !* (salut), *Da que fases ?* viennent tous de OM, un parler du sud de l'Auvergne : les présenter comme « auvergnat » sans plus de précision ?
