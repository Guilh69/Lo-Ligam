# Point d'étape — 2026-10-25 (arrêté à 17h51)

> Centralisation demandée par Romain pendant sa promenade. Tout est remonté sur `master` (dernier commit 17h32). Les détails chantier par chantier restent dans `PILOTATGE.md` §3 ; ici, la vue d'ensemble, lisible d'un trait.

## En une phrase

Le site a pris une grande avance ces deux dernières semaines sur **la carte, l'accueil, la charte et les trois rubriques** (Se parla, S'apren, Amassa sont en ligne). Le **maillon faible reste la pédagogie** : l'unité 1 du cursus est enfin rédigée et jouable, mais il manque ta voix, le module 0 et ton propre carnet d'autoformation.

## Ce qui marche

- **L'accueil et la charte** : ambiance sombre « Éclat », carte en étoiles, plan « Se parla / S'apren / Amassa », règle des couleurs appliquée partout.
- **La carte /carta** : langues de France, voix, Ensenhament (970 lieux, 61 Calandretas), 983 cercles, premiers pas en 11 étapes. C'est le gros du travail d'octobre.
- **Les trois rubriques en ligne** : `/parla` (+ l'espace musique « café » et son tri), `/apren` et `/apren/visio` (méthode, cinq temps, prix), `/amassa` (groupes, chat, boîte à idées, profils vérifiés).
- **L'édition sur place** : tu modifies toi-même les textes avec « Editar », séance 1 faite.
- **Les factures** des cours en visio : page locale bilingue qui numérote et tient le livre des recettes.
- **Le cursus, côté charpente** : toutes les décisions sont prises (cap DCL, blocs de 45 h, répétition espacée façon Anki, carnet FSRS codé) et **l'unité 1 est rédigée et codée comme modèle**.

## Ce qui est bloqué ou fragile (à surveiller)

- **Le déséquilibre pédagogie** : depuis le 12-10, la moitié des changements sont allés à la carte, un tiers à l'accueil, un sur dix seulement à l'apprentissage. Or le site est le support de tes cours. → **1 enregistrement sur 17**, module 0 vide, carnet d'autoformation vide depuis le 18-09.
- **Les formulaires renvoient encore vers ton adresse courriel** tant que la clé d'envoi Scaleway (Transactional Email) n'est pas posée.
- **Mentions légales** : dès que le site vend, il faut une adresse et un téléphone affichés. Tu ne veux ni ton domicile ni une domiciliation payante : **solution encore à trouver** avant le premier cours payant.
- **Droits extérieurs en attente** : accord écrit du LISN (voix de l'Atlas), droit de réutiliser la carte d'Occitanica, mention de la carte OPLO, relecture du pays mentonnais.

## Les décisions et gestes qui t'attendent

### a) Ce que tu peux faire seul, maintenant

1. **Relire l'unité 1 du cursus** : quatre fiches dans `Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/modules/relectura/`. Quand une te va, dis « publie le module 1.1 » (etc.). Les questions d'usage pour toi sont rassemblées dans **`DOBTES-OCCITAN.md`** (voir plus bas).
2. **Coller dans Supabase** les deux SQL en attente : `supabase/supabase-acces-claude.sql` (mon accès aux textes des pages) et `supabase/supabase-pagina-elements.sql` (textes de « Mon ligam » et d'Amassa — ça ajoute, ça n'écrase rien).
3. **Répondre au bloc 4 de `DIRECCION.md`** (l'accueil, la vue d'ensemble) : c'est le prochain barreau.
4. **Une question de couleur** : le rouge du logo aussi sur les boutons de zoom de la carte et sur « Écouter la voix la plus proche » ? (règle B des couleurs)
5. **Relire l'occitan** via « Editar » : les lignes de Se parla et du wiki, les noms du catalogue des groupes (`supabase/supabase-grops-catalog.sql`), la facture bilingue.
6. **Essayer le chat des groupes** sur deux écrans (rejoindre Montpelhièr, écrire, supprimer) et **remplir ton profil** (puis regarder `/admin/perfils`).
7. **Factures** : double-cliquer `outils/factura/Factures.cmd`, remplir les Réglages (adresse, SIRET, IBAN), test d'impression dans Firefox.
8. **Trier les 149 musiques** et enregistrer, puis vérifier le café.

### b) Ce qui demandera de l'aide ou du temps (plus tard)

- **Scaleway** : activer Transactional Email, ajouter le domaine loligam.eu, créer la clé d'API, poser `SCW_TEM_CLAU` et `SCW_PROJECTE` (je te guiderai pas à pas).
- **Administratif** : trouver l'adresse/téléphone des mentions légales ; élargir l'activité de la micro-entreprise sur procedures.inpi.fr ; ouvrir un compte bancaire dédié ; TVA (CIBS) à vérifier en décembre 2026 ; plateforme e-reporting avant septembre 2027.
- **Ta voix** : enregistrer l'unité 1 (le soir du 1.1 pour commencer).
- **Visuels Canva** (logo C, 4:5, six familles, un export sans textes) : c'est ce qui débloque les scènes des unités.
- **Réel Instagram OPLO** : importer les vidéos dans Canva, montage, tes phrases.
- **Droits extérieurs** (LISN, Occitanica, OPLO, pays mentonnais).

### c) Ce que je fais ensuite, sans toi

- **Rédiger les unités A1 2 à 8**, une à une, après ta relecture de l'unité 1.
- Puis **la séance du jour, les haltes, l'affichage des niveaux**.
- **Groupes** : le lexique du chat, la page de modération, la charte et Confidentialité.
- **`/aprene` en « Camin »** (sommaire du cursus) une fois S'apren posé.
- La **pile de validations occitanes** de la carte : désormais c'est le travail de **Joan** (voir ci-dessous), pas le tien.

## Le vocabulaire occitan : tu ne valides plus des milliers de mots

Tu l'as dit : tu ne peux pas relire des milliers de mots. **C'est désormais à moi (et à Juan) d'aller chercher et de valider**, et de ne te remonter que les vrais doutes, au même endroit.

- **Fait aujourd'hui** : tout le lexique de contenu de l'unité 1 et les mots du menu passés à l'API de lo Congrès. Le lexique courant est confirmé.
- **Les seuls points qui demandent *ton* avis** (choix d'usage, pas d'orthographe) et les mots que les outils ne couvrent pas sont rassemblés dans un fichier unique : **`DOBTES-OCCITAN.md`** à la racine du projet. Tu l'ouvres quand tu veux, tu réponds une question à la fois.
- Les ~1 450 noms de la carte sont des **noms de lieux en forme locale** : un dictionnaire général ne peut pas les trancher, c'est une relecture humaine par zone. Joan la mènera zone par zone et ne te montrera que les cas douteux.

## Joan, ton web designer et vérificateur

Tu voulais un compagnon web designer, très rigoureux, qui comprend bien tes demandes et les fait atterrir de façon professionnelle, qui regarde en détail (pas de mémoire seule), garde la vue d'ensemble, cherche l'harmonisation, valide l'occitan avant de te le montrer, réfléchit avant de te poser la question, et te propose des idées de veille. Il s'appelle **Joan** et il est installé sur ton compte (tous tes projets). Comment l'appeler et ce qu'il fait : voir la fin de ma réponse dans la conversation.
