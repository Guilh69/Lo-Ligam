# Pilotage et chantiers : l'état réel au 22 octobre 2026

> Relecture de `PILOTATGE.md`, `DIRECCION.md` et des 14 documents de `revisions/`, recoupée avec le journal §11 du cahier, Git (682 commits, 35 jours actifs du 28-07 au 21-10) et le code. Rien n'a été modifié hors ce rapport.

## 1. Le pilotage se connaît déjà

Le tableau de bord naît le 18-09 d'une demande de Romain : « il va falloir que tu m'aides à faire la gestion de ce projet et que je puisse repartir d'une bonne manière » (`PILOTATGE.md` l.5-6). Diagnostic d'alors : « un défaut de consignation » (l.25). Le 21-10, le diagnostic change : la séance Estructura, « prévue depuis le 18-09 et jamais tenue : la carte a pris toute la place » ; « on retouche le visuel sans avoir posé la structure » (`DIRECCION.md` l.17-21). Romain : « j'ai l'impression qu'on avance à l'aveugle et que je construis au fur et à mesure de manière artisanale » (l.4-5).

Git le confirme : 92 commits le 07-10, 82 le 09-10, 85 le 10-10 (la carte) ; 4 le 18-09 et 1 le 04-10 (les séances de méthode). 145 commits sur 682 tombent entre 23 h et 2 h.

## 2. État réel des chantiers

| # | Chantier (`PILOTATGE.md`) | Écrit | Constaté le 22-10 | Bloque sur | Depuis |
|---|---|---|---|---|---|
| 1 | Toilettage (l.47) | fait | fait | — | 18-09 |
| 2 | Estructura → `DIRECCION.md` (l.48) | en cours | 8 blocs posés, **0 réponse** (`DIRECCION.md` l.264 : « rien encore ») | Romain | prévu 18-09 |
| 2b | Arbitrage (l.49) | après 2 | jamais tenu | ensemble | 18-09 |
| 2c | Redesign visuel (l.50) | base validée | très avancé ; une quinzaine de mots d'interface à valider (« Menú », « Mon istòria »…) | Romain | 15-10 |
| 2d | Logo, typographie (l.51) | fait | fait ; reste le crédit Luciole | Claude | 30-09 |
| 3 | Module 0 (l.52) | bloqué | **ligne inchangée depuis le commit 9e672c9 (18-09)** ; aucun brouillon dans le dépôt ; décidé le 29-08 (cahier l.221) | Romain | 29-08 |
| 4 | Audio unité 1 (l.53) | bloqué | **1 fichier sur 17 attendus** pour le 1.1 (`app/static/audio/moduls/1-1/LISTA.txt`, `.m4a` du 29-08) ; 1.2 à 1.4 vides | Romain | 29-08 |
| 5 | Validation occitane (l.54) | bloqué | inchangé depuis le 18-09 | Romain | 18-09 |
| 6 | /aprene « Camin » (l.55) | à faire | `/aprene` montre des chapitres fictifs (« Las basas », « A la botiga ») avec **un seul lien actif, `/aprene/essai`** (`app/src/routes/aprene/+page.svelte` l.19) ; les 4 modules réels sans lien (`BILAN-2026-10-08.md` l.162) | Claude | 18-09 |
| 7 | Racine² (l.56) | à faire | non commencé ; ses pages « A prepaus » et « Contacte » sont les 404 `/istoria` et `/contacte` | Claude | 18-09 |
| 8 | Photos (l.57) | bloqué | inchangé | Romain | 30-08 |
| 9 | Proton Drive / Git (l.58) | règle faite | **récidive le 21-10 à 23 h 06**, « le risque grandit » | Romain (autre PC) | 12-10 |
| 10 | Réveil Supabase (l.59) | bloqué | Òbras : « Impossible de cargar las òbras » (`DIRECCION.md` l.56) ; table `obras` absente (`BILAN` l.133-136) | Romain (« 2 minutes ») | 08-10 |
| 11 | Courriels (l.60) | clos | clos sans envoi | — | 12-10 |
| 12 | Autoformation (l.61) | « prioritaire sur 3, 5 et 6 » | **non commencé** : les 9 gabarits de `carnet-concepcion/` sont vides depuis le 04-10 (`etapa-1-nivels.md` : « Date de lecture : ») | Romain | 04-10 |
| 13 | Carte (l.62) | principal | en ligne, riche ; **19 listes de noms à valider** (`SIG/*/FONTS.md`, `*-a-validar.csv`) ; test iPhone à refaire ; 94 constats du 08-10 (`BILAN` l.17-18) | Romain + Claude | 07-10 |
| 13 bis | Fiches communes (l.63) | en ligne | pistes du lancement jamais choisies (`2026-10-11-fichas-comunas.md` l.79-96) | Romain | 11-10 |
| 14 | Icônes (l.64) | fait | fait | — | 12-10 |
| 15 | ArtCraft (l.65) | évalué | « chantier Canva/Instagram, conversation à part » **jamais ouvert** | ensemble | 12-10 |
| 16 | Parcours, scènes (l.66) | 3 décisions | révélateur validé le 20-10 ; **Romain refait d'abord ses visuels Canva**, puis `/admin/scenas` ; décisions 4 à 7 ouvertes (`univers-scenes.md` l.368-371) | Romain (213 visuels) | 20-10 |
| 17 | Refonte claire (l.67) | étape 1 faite | étapes 2 à 7 : « 10 à 14 séances » (`2026-10-21-refonte-claire.md` l.86) | Romain puis Claude | 21-10 |

Sur 19 lignes : 5 closes, **9 attendent Romain seul**. Les trois chantiers de l'apprentissage (3, 4, 5) n'ont pas bougé d'une lettre en cinq semaines, ni le chantier 12 déclaré prioritaire sur eux.

## 3. Ce qui manque pour un visiteur inconnu

Le site est **public de fait** : `loligam.eu` répond depuis le 15-10 (cahier l.317) et `app/static/robots.txt` autorise toute indexation (`Disallow:` vide), alors que le pilotage écrit « le site n'est pas encore ouvert au public » (l.62, l.129). L'inconnu rencontre :

1. **Sept liens du menu vers une 404** : `/wiki`, `/istoria`, `/contacte`, `/articles`, `/forum`, `/grops`, `/ideas` (`refonte-claire.md` l.29-31 ; `DIRECCION.md` l.60 : « le site promet ce qu'il n'a pas »).
2. **Aucune porte vers l'apprentissage** : le module 0 « joué sans compte » devait remplacer l'essai libre (cahier l.181, l.221) ; `/aprene` ne dit « ni ce qu'est le parcours ni d'où l'on part » (`DIRECCION.md` l.57).
3. **Une unité 1 muette** (1 son sur 17).
4. **Òbras en panne** ; admin « Tèxtes » qui « n'alimente plus rien » (`PILOTATGE.md` l.97-99).
5. **Un compte jamais testé** : « reste à tester un vrai courriel de confirmation » (l.126).
6. **Une carte sous réserves écrites** : mentonnais « à confirmer » (`zona-mentonasca.md` l.39-43), accord du LISN « avant l'ouverture au public » (l.129), droit Occitanica « à vérifier » (l.50).
7. **Trois chartes cohabitent** : parcours, compte et Òbras en « ancienne charte, taches pastel » (`DIRECCION.md` l.172-174).

## 4. Questions ouvertes jamais tranchées

| Question | Depuis | Source |
|---|---|---|
| Modèle économique | 31-07 | `PILOTATGE.md` l.113 |
| Nombre d'unités A1 pour lancer (« toujours ouvert ») | 28-07 | l.116 ; cahier l.554 |
| La carte en premier ? (« pas encore tranchée » ; faite dans les faits, jamais écrite) | 31-07 | cahier l.61 ; l.118 |
| Statut juridique | 31-07 | l.122 |
| 14 questions du §9 de l'état de l'art | 03-09 | l.124 |
| Casting des photos | 30-08 | l.127 |
| Séance Estructura | 18-09 | `DIRECCION.md` l.17 |
| 9 décisions des échelles de la carte (0 cochée dans le document) | 08-10 | `lengas-escalas.md` l.277-323 |
| Globe, modules reliés, admin Tèxtes ; 9 arbitrages sur les données | 08 et 10-10 | `BILAN` l.151-178 ; `audit-donadas.md` l.137-147 |
| Pistes de lancement des fiches communes | 11-10 | `fichas-comunas.md` l.79-96 |
| Méthode à rebours, fil, test v1 ; répétition, leçon, médias, « fenèstra » | 15-10 | `metode-parcours.md` l.212-217 ; `univers-scenes.md` l.368-371 |
| Villages cliquables, étiquettes du bas | 19-10 | `audit-clics-carta.md` l.76-77 |
| Pages promises : attente ou retrait ; Mots dans S'apren ; « Fils d'or » | 21-10 | `refonte-claire.md` l.153-160 ; l.130 |

Les quatre premières conditionnent périmètre et statut ; elles ont trois mois.

## 5. Le pattern des « prochaines actions »

La colonne s'appelle « Prochaine action (UNE seule) » (l.45) ; la ligne du chantier 13 dépasse 9 000 caractères. Chaque document de `revisions/` finit par « Ce que Romain peut faire seul, maintenant » : 4 points plus 9 décisions le 08-10 (`BILAN` l.129-149 ; `lengas-escalas` l.355-364), « lire les trois audits » le 10-10 (l.62), un CSV du LISN le 12-10 (l.129), « refaire ses visuels » le 20-10 (l.66), choisir A/B/C puis le bloc 1 le 21-10 (`refonte-claire.md` l.215-219).

Ce qui se fait le soir même : **un choix visuel sur un essai en ligne** (Plâtre, « Lumière avec pastilles », menu vertical : cahier l.318-323, l.332). Ce qui ne se fait jamais : **écrire, enregistrer, valider une liste**. Les listes s'additionnent (19 fichiers de noms, 10 h de textes de wiki au `concept-wiki.md` l.89, 213 visuels). Le tableau enregistre mais ne hiérarchise pas ; « une conversation = un chantier » (l.9) a donné sept conversations qui ajoutent chacune leurs demandes à Romain.

## 6. Où est Instagram

Dans les mots de Romain : « En 2022, je me suis lancé, sans trop savoir pourquoi, dans un compte Instagram […] L'idée, c'est d'apprendre en même temps que je partage […] un apprenti qui n'a pas peur de faire des erreurs […] une communauté de plusieurs milliers de personnes » (`istoria-romain.md` l.39-43). Instagram fonde l'identité (cahier l.189), la palette « Brasa » (213 visuels, l.50), les six familles de publications (cahier l.301) et les scènes d'unité (l.66). Pourtant aucun chantier numéroté ne le porte : « conversation à part » au chantier 15, préalable au 16, question ouverte au bloc 5 de `DIRECCION.md` (l.178-179). La communauté existante n'est nulle part nommée comme public du lancement.

## 7. Distance au lancement

Manquent « pour le lancement » : « module 0, audio de l'unité 1, validation occitane des modules, photos, les pages promises par le menu » (`DIRECCION.md` l.233-235). S'y ajoutent 8 blocs de structure à un par séance (l.67), les étapes 2 à 7 de la refonte (10 à 14 séances), le Camin, l'admin des scènes (1 à 2 séances après les visuels), le lot 1 du wiki (2 à 3 séances, `concept-wiki.md` l.94).

Côté Claude : environ 25 séances, toutes suspendues à une décision ou une matière de Romain. Côté Romain : une page, 17 sons, 4 modules à relire, 8 blocs, 213 visuels ; à zéro depuis le 18-09. **Au rythme actuel, le lancement n'est pas datable.** Avec deux soirées de production par semaine, un lancement minimal et honnête (module 0, unité 1 sonorisée, menu sans 404, carte avec réserves écrites) tient en 8 à 10 semaines ; wiki, forum, groupes, articles et scènes des 10 unités relèvent de l'« évolution » du 03-09 (cahier l.226).

## 8. Trois constats

1. Le blocage n'est plus la consignation (réparée le 18-09) ni le visuel (refondu le 22-08, le 06-10, le 21-10) : **tout chantier qui demande à Romain de produire s'arrête**, et les séances vont là où Claude produit seul.
2. **Le site est public sans l'avoir décidé** : la question 1 du bloc 8 (« qu'est-ce que le site doit contenir au minimum le jour où tu en parles publiquement ? ») passe avant tout nouveau visuel.
3. La matière existe : 213 visuels, une voix, `istoria-romain.md`, des milliers d'abonnés. Le pilotage traite Instagram en annexe ; c'est la seule chose qui a toujours marché sans Claude.
