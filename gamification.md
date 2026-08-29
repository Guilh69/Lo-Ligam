# Gamification — spécification (étape C)

> Version 0.2 · 29 août 2026 · Livrable de l'étape C de `construction-pedagogique.md`.
> Décisions de Romain intégrées : còla de personnages qui se débloque (troupe
> v0.1 validée « OK ») · arbre unique (racines = les anciens) · **série = lo
> Fuòc de l'ostal** (voir §5 bis) · usage des crostadas à trancher plus tard ·
> badges : plan spécifique ultérieur.
> Boussole : le manifeste (§5 du doc chantier) et corpus-design §2.3 (« récompenses
> = progression visible et beauté, pas classements » ; la motivation durable est
> identitaire et sociale).

---

## 1. Le système en une image

**L'Arbre del Ligam** est la scène centrale : ses **racines** sont la langue
des anciens, ses **branches** poussent avec tes acquis. Apprendre, c'est faire
monter la sève — la reconnexion rendue visible, littéralement.

Autour de l'arbre :

| Élément | Rôle | Quand |
|---|---|---|
| **Fogassas** 🥖 | La récolte immédiate — gagnées à chaque étape réussie (déjà dans le moteur) | En continu |
| **La còla** (personnages mythologiques) | Les compagnons — se débloquent au fil des unités, se nourrissent de fogassas, célèbrent, racontent leur pays | Fin d'unité (déblocage), célébrations |
| **L'Arbre** 🌳 | La progression de toute une vie d'apprenant — une seule image qui grandit | Fin de module/unité (croissance visible) |
| **Crostadas** 🥧 | Monnaie des grandes étapes — **usage à trancher** (décision reportée, Romain 29/08) | Fin de module/unité |

## 2. Les règles non négociables (héritées du manifeste)

1. **Rien ne meurt, rien ne fane.** Les personnages n'ont jamais faim, l'arbre
   ne se dessèche pas en ton absence. Nourrir la còla est une **fête**, pas un
   devoir. (Anti-Tamagotchi : aucune mécanique de peur ou de manque.)
2. **Zéro compétition entre apprenants.** La còla est une équipe ; jamais de
   classement.
3. **La frontière économique est étanche** : le contenu pédagogique ne s'achète
   jamais en monnaie de jeu, et la monnaie de jeu ne s'achète jamais en argent
   réel tant que la question crostadas n'est pas tranchée *(et si un jour elle
   l'était, jamais au détriment de cette première règle)*.
4. **La série célèbre, elle ne menace pas** : les jours pratiqués s'ajoutent,
   les jours manqués ne s'affichent pas comme des pertes.
5. **Chaque personnage porte son pays** : la còla incarne la pluralité de la
   langue (pilier 4) — accents, formes locales, fierté partagée, zéro hiérarchie.

## 3. La còla — troupe proposée (v0.1, à choisir/valider par Romain)

⚠️ Graphies occitanes classiques et détails culturels à valider avant tout
usage (dicodòc + littérature de référence : Sacaze, Bodon pour lo Drac…).
L'ordre de déblocage suivra le cursus (un personnage par unité environ).

| Personnage | Pays | Caractère proposé (ton complice/décalé) | Source repérée |
|---|---|---|---|
| **Lo Drac** | Lengadòc (Roergue, val del Viaur) | Farceur métamorphe des rivières, fils du diable chez Bodon — chez nous : l'espiègle qui adore les jeux de mots ratés | Wikipédia « Drac (démon) », occitan-aveyron.fr (conte collecté), Bodon |
| **Tantugou** | Comenge / Luishonés (vals de Loron e Larbost) | Vieux protecteur des troupeaux et des récoltes (avatar du Sylvain latin) — le sage bougon au grand cœur, gardien des racines de l'Arbre | Wikipédia « Mythologie pyrénéenne » (Sacaze) |
| **Las Hadas / Encantadas** | Gasconha (hadas) e Lengadòc (fadas) | Fées des sources et fontaines — les marraines : elles soufflent les indices, gardiennes de la prononciation (ce sont elles qu'on entend) | Wikipédia « Mythologie pyrénéenne » |
| **Lo Becut** | Gasconha / Bigòrra | Géant cyclope fort mais pas fûté (cousin de Polyphème), toujours vaincu par les enfants — le costaud attendrissant qui confond ses conjugaisons | Wikipédia « Mythologie pyrénéenne » |
| **Joan de l'Ors** | Pirenèus (conte pan-pyrénéen) | Mi-ours mi-homme, force et candeur — le héros qui n'abandonne jamais, patron de la persévérance | Wikipédia « Mythologie pyrénéenne » |
| **L'Ors** | Vallespir / Catalonha del Nòrd (carnavals de l'ours) | L'ancêtre sauvage, symbole de réveil et de fertilité — celui qui hiberne et *revient toujours* (parfait pour les retours après une pause : jamais de reproche, une fête du retour) | Wikipédia « Mythologie pyrénéenne » |
| **Lo Babau** | Rosselhon / Narbonés | Croquemitaine « qui mange les enfants en salade » — chez nous : le méchant de pacotille qui ne gagne jamais, ressort comique | Recherche folklore occitan (à sourcer mieux ⚠️) |
| *(à documenter)* Los Minairons | Aran / Pirenèus catalans | Minuscules êtres hyperactifs enfermés dans un étui — pourraient incarner les révisions éclair | ⚠️ source à établir |

**Principes d'écriture des personnages** : ils célèbrent et racontent, ne
punissent jamais ; chacun glisse les formes de son pays (« *En çò nòstre,
disèm nautres !* ») ; l'humour est tendre, jamais moqueur envers l'apprenant ;
leur design visuel relèvera de la conversation design (registre RÉCIT,
identité méditerranéenne).

## 4. L'Arbre del Ligam (esquisse fonctionnelle)

- **Un seul arbre par personne**, visible depuis le Camin (`/aprene`).
- **Racines** : les anciens — elles s'illuminent à mesure que la reconnexion
  opère (idée à creuser : chaque capsule culturelle vécue allume une racine).
- **Tronc et branches** : les unités terminées font pousser une branche ;
  les modules ajoutent des feuilles.
- **Saisons, pas de mort** : l'arbre vit au rythme des saisons (clin d'œil aux
  dictons météo de l'unité 6), il ne fane jamais faute de pratique.
- Détail visuel et animations : chantier design dédié (sobriété : SVG/CSS,
  pas de vidéo).

## 5. Célébrations (échelle proposée)

| Moment | Ce qui se passe (existant → à venir) |
|---|---|
| Bonne réponse | Son « whoosh » (fait) |
| Étape finie | Cloche + fougasse volante vers la pastille (fait) → un mot du personnage de l'unité |
| Module fini | Croissance de l'arbre (feuilles) + festin de la còla (fogassas) |
| Unité finie | Nouvelle branche + **déblocage d'un personnage** + capsule culturelle de clôture |
| Niveau fini (mission) | Grande fête de la còla + certificat/badge culturel (forme à définir) |

## 5 bis. La série : lo Fuòc de l'ostal (décision Romain, 29/08)

Un **compteur de jours pratiqués, avec statistiques** (jours ce mois-ci, total,
records — des faits qui valorisent, jamais des reproches), incarné par **un
foyer** : plus la pratique est régulière, plus le feu devient **majestueux**
(bougies → belles flammes → grand feu de cheminée qui crépite).

**En cas d'abandon, le feu ne s'éteint jamais complètement : il reste las
brasas** — les braises rougeoient toujours un peu. *Jamais perdre espoir.*
Au retour, pas de compteur remis à zéro brandi comme une punition : on
rallume le feu ensemble — et c'est **l'Ors** (le personnage des réveils, §3)
qui sort d'hibernation pour fêter ça.

Cohérences : le foyer = *lo canton* de l'ostal occitan (unité 7 du cursus,
corpus-design « identité méditerranéenne ») ; le feu se nourrit du même
imaginaire que les fogassas (le four, le pain) — ⚠️ noms occitans exacts
(*lo fuòc*, *las brasas*, *lo canton*) à valider comme le reste.

---

## 6. Questions ouvertes (étape C — soldées ou reportées)

1. **Crostadas** : usage à trancher plus tard (décision Romain 29/08) — la
   fièra (boutique cosmétique ?) reste au congélateur d'ici là.
2. ~~La série~~ → tranchée : **lo Fuòc de l'ostal** (§5 bis).
3. **Badges** : reportés à un **plan spécifique ultérieur** (décision Romain
   29/08) — d'ici là, la còla est l'unique système de collection.
4. **Design visuel** des personnages, de l'arbre et du foyer : qui dessine
   (Romain sur Canva ? génération ? illustrateur ?) — à cadrer avec la
   conversation design.
5. **Vérification culturelle** : faire relire la còla (noms, pays, caractères)
   par des connaisseurs du folklore — même exigence que pour la langue.
