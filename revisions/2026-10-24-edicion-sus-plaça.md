# Édition sur place : Romain modifie le site lui-même

*Proposition écrite le 2026-10-24 par la discussion mère, à la demande de Romain : « il faut la revoir de fond en comble pour qu'elle soit intuitive et qu'elle s'intègre à l'interface et pas dans une page à côté… si je veux changer un mot, que je puisse le faire directement sur la page, le repositionner, changer la couleur, la police, et idéalement l'animation… que ça m'évite de passer par toi pour des mini-reprises… accessible uniquement par moi avec mon compte administrateur, et ensuite le valider et que ça se publie automatiquement. »*

## 1. Ce qui existe aujourd'hui

- **Une administration à côté** : `/admin` avec des tableaux (designs, œuvres, carte, lieux, groupes, textes). La page « Tèxtes » (table `site_textes`) n'alimente plus rien depuis le portage de l'accueil (bilan du 08-10).
- **Le compte administrateur** : table `admins` et fonction `is_admin()` de Supabase, seul rempart (décision du 06-08). Il sert déjà à toutes les pages d'admin.
- **Les textes des pages sont dans le code** : 45 textes bilingues sur l'accueil (`app/src/routes/+page.svelte`, `app/src/lib/acuelh/donadas.js`), 15 liens du menu (`app/src/lib/data/planSite.js`), les pages Mots, Œuvres, confidentialité, mentions légales. Changer un mot = une modification de code par Claude, puis trois minutes de mise en ligne.
- **La charte** : trois polices (Limelight, Luciole, Cormorant), des jetons de couleur (`--t-aur`, `--t-tinta`, `--t-accion`…), la règle B (rouge = ce qui se clique, or = mise en valeur), onze animations de texte (`animarText.js`), la version légère (`prefers-reduced-motion`).
- **Deux vitesses de publication** : ce qui est dans la base est visible tout de suite ; ce qui est dans le code passe par GitHub et Scaleway (3 minutes).

## 2. Le principe : un « mode Edicion » sur la vraie page

1. Connecté avec ton compte administrateur, un bouton **« Editar »** apparaît sur chaque page (invisible pour les autres, et la base refuse de toute façon leurs écritures).
2. En mode édition, chaque élément modifiable se surligne au survol : un texte, un lien, une image, une liste. On le touche, un **petit panneau flottant** s'ouvre à côté, avec seulement ce qui a un sens pour cet élément.
3. Chaque changement est enregistré en **brouillon** : toi seul le vois. Une barre en haut dit « 3 changements non publiés ».
4. **« Publicar »** : tout le monde voit la nouvelle version, tout de suite, sans passer par GitHub. **« Anullar »** jette le brouillon. **« Istòria »** montre les publications précédentes et en restaure une.
5. Le mode édition marche sur téléphone pour les mots ; pour la mise en page, l'ordinateur reste plus confortable. Un bouton **« Veire sul telefòn »** montre le rendu en largeur de téléphone avant de publier.

## 3. Ce que ça permet, par niveau

| Niveau | Ce que tu peux faire seul | Limites choisies, pour que ça reste Lo Ligam |
|---|---|---|
| **1. Contenu** | changer un texte (occitan et français côte à côte) ; changer un lien (vers une page du site ou une adresse https) ; remplacer une image (téléversée, avec son texte alternatif) ; monter ou descendre un élément dans une liste ; montrer ou cacher un élément ; ajouter ou retirer un élément d'une liste existante (un lien de plus, une carte de plus, un paragraphe de plus) | texte brut, pas de code ; images plafonnées en poids, SVG interdit (règle du 06-08) ; l'occitan reste à valider par toi, le site ne vérifie pas |
| **2. Apparence, dans la charte** | police (parmi les trois), couleur (parmi les jetons de la charte), taille (quatre crans), alignement, **décalage léger** (quelques crans en haut, en bas, à gauche, à droite), largeur d'une image et son point focal | pas de couleur libre, pas de police hors charte : la règle B est tenue par le site (ce qui se clique reste rouge) ; pas de glisser-déposer libre : un élément posé au pixel sur ordinateur casse sur téléphone, qui est l'usage principal |
| **3. Mouvement** | animation d'apparition d'un texte parmi les onze effets, ou aucune ; durée en trois crans | la version légère est automatique ; pas d'animation sur ce qui se lit longtemps |

**Ce que ça ne couvre pas, et qui reste du code** : une nouvelle *sorte* de bloc (une section qui n'existe pas encore), la carte (elle a son propre atelier de données), le moteur des leçons, les pages de compte, la structure d'une page. Si un jour tu veux un bloc d'un genre nouveau, c'est une demande à Claude ; ensuite tu le remplis et le règles seul.

## 4. Où ça vit

- **Une table `elements`** dans Supabase : une ligne par élément modifiable, avec une clé stable qui dit *ce que c'est* (`acuelh.titol`, `acuelh.02.cors-visio.descripcion`, `menu.ligam.contacte`), sa page, son type, son contenu occitan et français, ses réglages d'apparence et de mouvement, et deux états : publié, brouillon.
- **Une table `publicacions`** : une photographie de tous les éléments à chaque « Publicar », pour l'historique et la restauration.
- **Sécurité** : lecture publique des éléments publiés seulement ; écriture réservée à `is_admin()` (politiques RLS écrites et vérifiées avant d'ouvrir, règle de Romain) ; textes stockés en texte brut, liens contrôlés (chemin du site ou https), images dans le stockage Supabase avec plafond de poids ; la politique de sécurité du navigateur ne change pas.
- **Robustesse** : chaque page lit ses éléments côté serveur, en une seule demande, gardée en mémoire une minute ; si Supabase ne répond pas, la page utilise **le dernier instantané enregistré dans Git** (`app/src/lib/data/elements-filet.json`, regénéré par un script, comme le filet de `fichas.js`). Le site public ne dépend donc jamais de la base pour s'afficher.
- **Une seule vérité** : dès qu'un élément est modifiable sur place, sa version dans le code n'est plus qu'un filet de secours. Règle pour toutes les discussions : **Claude ne retouche plus ces textes dans le code** ; c'est Romain, dans l'éditeur.

## 5. Comment je procède, séance par séance

| Séance | Ce qui est livré | Ce que Romain fait |
|---|---|---|
| 1. **Fondations** | les deux tables et leurs politiques (un fichier SQL) ; le mode édition sur **l'accueil** ; le panneau pour les **textes** et les **liens** ; brouillon, Publicar, Anullar ; le filet de secours | colle le SQL dans Supabase ; teste sur téléphone : changer un mot, publier, vérifier que le public le voit |
| 2. **Contenu complet** | images, ordre, montrer/cacher, ajouter/retirer dans une liste ; Istòria et restauration ; « Veire sul telefòn » | ajoute un lien, remplace une image, restaure une version |
| 3. **Apparence** | police, couleur, taille, alignement, décalage léger, point focal des images, dans la charte | règle l'accueil à sa main, vérifie sur téléphone |
| 4. **Mouvement et le reste du site** | animations ; extension à Mots, Œuvres, confidentialité, mentions, 404, menu et pied de page ; les anciennes pages d'admin qui restent utiles (groupes, carte, lieux) rangées dans un tiroir « Atelier » du mode édition ; `/admin/textes` retirée | fait le tour des pages |

Quatre séances, sans agents, chacune close par ton test sur téléphone. Possiblement une cinquième pour les retouches. Chaque séance se termine par un enregistrement et une mise en ligne.

## 6. Les risques, et comment on les tient

- **« Ça fait amateur »** : l'éditeur ne propose que ta charte (trois polices, tes couleurs, la règle B). La liberté est dans le contenu et la composition, pas dans l'habillage.
- **Le téléphone** : pas de position libre ; des décalages en crans, et l'aperçu téléphone avant de publier.
- **Deux vérités** (code et base) : la règle du §4, consignée dans `CLAUDE.md`.
- **Supabase en panne** : le filet de secours en Git.
- **L'accueil va encore changer** (bloc 4) : les clés des éléments nomment leur sens, pas leur place ; un bloc déplacé garde ses textes.
- **Les décisions « à ne pas rouvrir »** : l'éditeur ne permet pas de les rouvrir par accident (polices, règle B).

## 7. Sur l'échelle

C'est le barreau 7 (« l'administration remise en cohérence »), pris avant le barreau 3 (bloc 4, l'accueil), par choix de Romain : avec l'éditeur, une bonne part du bloc 4 se fera de sa main. Consigné dans `PILOTATGE.md`.

## 8. La décision à prendre maintenant

Le périmètre de la séance 1 : commencer par l'accueil avec les textes et les liens (recommandé : c'est là que se joue le bloc 4, et c'est le plus petit pas qui prouve le principe), ou par une page plus simple comme Mots, ou tout le niveau 1 d'un coup (plus long avant de voir quelque chose).
