# Doutes occitans — le seul endroit à relire

> **Pour Romain.** Tu ne relis plus des milliers de mots. Claude et Joan vont chercher et valident le vocabulaire ; **ici ne remontent que les vrais doutes**, une question à la fois. Tu réponds, Claude corrige et vide la ligne.
>
> **Méthode.** Tout mot occitan écrit par Claude passe d'abord par l'API de lo Congrès (`cd app` puis `node scripts/verificar-oc.mjs …`). Un ✓ ne valide ni le sens ni l'usage : seul toi tranches l'usage vivant. Mis à jour le 2026-10-25.

---

## 1. Décisions d'usage qui attendent ton avis (unité 1 du cursus)

Ce ne sont **pas** des fautes d'orthographe : l'orthographe est confirmée. Ce sont des choix d'usage, de prononciation ou de pédagogie, à toi de les trancher.

| # | La question | Mon avis | Ta réponse |
|---|---|---|---|
| 1 | **`siás` ou `siès` pour « tu es » ?** Le cadre du cursus dit `siás` ; l'accueil du site dit `siès` (ton choix du 22-10, montpelliéranisme assumé). On garde `siás` dans les leçons et `siès` à l'accueil ? | Cohérent : `siès` est ta couleur de Montpelhièr à l'accueil, `siás` la forme large pour apprendre. Mais à confirmer. | |
| 2 | **`demorar` pour « habiter » en A1 ?** (`Demòri a Tolosa`) | Oui, c'est l'usage courant. | |
| 3 | **Deux façons de dire son nom** présentées comme équivalentes : `Me dison…` (« on me dit ») et `M'apèli…`. Les deux te vont en A1 ? | Les deux sont justes et vivantes ; garder les deux enrichit. | |
| 4 | **Vouvoiement** : `Cossí vos dison ?` et `Cossí vos apelatz ?` — à confirmer. | Corrects tous les deux. | |
| 5 | **Règle de politesse donnée à l'élève** : `Adieu` est familier (amis, jeunes, même à la première rencontre) ; à une personne qu'on vouvoie, plutôt `Bonjorn`. C'est bien ton usage ? | À valider par toi : c'est de l'usage, pas de la règle. | |
| 6 | **Prononciations à confirmer à l'enregistrement** : `Adieu` « a-DIOU », `Adieu-siatz` « a-di-SSIATS », `Bon ser` « bou(n) SÉ » (r muet), `Bonjorn` « boun-DJOUR ». Villes en forme de leur dialecte : `Limòtges` (limousin), `Niça` (niçois), `Bordèu` (gascon). | Tu confirmeras naturellement en enregistrant. | |
| 7 | **Page Cinéma : `camèra` ou `camera` ?** Le texte du film Istòria d'Adrian dit `Camèra d’Aur a Canas` (« Caméra d’or à Cannes »). L'API de lo Congrès connaît `camera` sans accent, et ignore `camèra`. Quelle forme dans ton usage ? | Je penche pour `camèra` (accent d'usage), mais l'outil ne le confirme pas : à vérifier sur dicodòc. | |
| 8 | **Page Cinéma : l'étiquette « téléfilm » (Malaterra).** Écrite `Filme de television` ; `telefilme` est absent de lo Basic. Et pour « série », l'API donne `seria` (oc) mais `tièra` (lengadoc) : `Seria` convient-il pour le languedocien, comme étiquette de genre ? | `Filme de television` est limpide et sans risque. Pour `seria`, c'est aussi le titre de la série (Wikipèdia oc), donc on le garde pour le titre ; l'étiquette de genre est à ta main. | |

## 2. Mots corrects que les outils ne savent pas confirmer (aucune action, pour mémoire)

Ces mots sont du bon occitan ; c'est l'outil qui a une lacune ou un bug, pas le mot. À vérifier d'un coup d'œil sur dicodòc.eu si tu veux en avoir le cœur net, mais **aucun doute réel**.

| mot | ce que fait l'outil | pourquoi c'est normal |
|---|---|---|
| `ieu` | absent de lo Basic et de vèrb'Òc | c'est le pronom « moi/je » de base, dans toutes les grammaires ; ni Basic (lexique) ni vèrb'Òc (verbes) ne le portent |
| `vos` | l'API plante (erreur d'appel) | bug PHP connu de l'API, déjà rencontré ; `vos` est standard |
| `país` | l'API plante | même bug ; `país` est standard |
| `menú` (nom du menu de navigation) | absent de Basic et de vèrb'Òc | emprunt courant ; **à vérifier sur dicodòc** si tu préfères une autre forme (ex. `carta`) — seul vrai point ouvert de cette liste |

## 3. La grande pile de la carte (~1 450 noms) — relecture par zone, pas par toi

Noms de lieux en **forme locale, graphie classique**. Un dictionnaire général ne peut pas les trancher : c'est une relecture humaine par zone, que **Joan** mènera et ne te remontera qu'au cas par cas. Fichiers de référence :

- `SIG/*-a-validar.csv` : communes (~915), provinces, parcs, relief, Calandretas, vallées, sous-dialectes, surnoms.
- `SIG/<lenga>/FONTS.md` et `SIG/lisn/mots-a-validar.csv`.
- Règle en cas d'absence de forme sûre : **on masque le nom** (jamais de phonétique, jamais d'invention).

---

### Comment répondre

Dis-moi simplement, par exemple : « doute 1 : garde `siás` partout » ou « doute 6 : `menú` ok ». Je corrige, je vérifie, et je retire la ligne.
