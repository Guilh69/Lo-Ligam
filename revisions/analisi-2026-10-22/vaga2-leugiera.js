export const meta = {
  name: 'lo-ligam-proposar-leugier',
  description: 'Vague 2 allégée (forfait à 72 %) : proposition finale, esprit et façon de travailler, esquisse /ensag/blanc, rapport de nuit ; quatre agents',
  phases: [
    { title: 'Proposer', detail: 'la proposition finale et le miroir, en parallèle' },
    { title: 'Construire', detail: 'l’esquisse /ensag/blanc' },
    { title: 'Rapport', detail: 'le rapport de nuit' },
  ],
}

const RACINA = 'C:\\Users\\perie\\Documents\\6_Projectes\\Lo_Ligam'
const D = 'revisions/analisi-2026-10-22'
const DIGEST = `Commence par lire en entier ${RACINA}\\${D}\\00-resums.md (résumé et faits clés sourcés des neuf lectures : istoria-git, jornal-decisions, pilotatge-cantiers, marca-instagram, site-actual, romain-sa-faicon, referencias-principis, aprendre-estat, carta-placa). Les rapports complets sont à côté, même dossier, même nom : n'en ouvre un que par extraits et si un détail manque.`

const COMUN = `Projet Lo Ligam (site d'apprentissage de l'occitan de Romain), dépôt ${RACINA}. Nous sommes le 2026-10-22, vers 0 h 30. Romain dort. Il a demandé : « repartir d'une page presque blanche en réutilisant ce qui fonctionne et ce que j'aime dans le site actuel », « en se recentrant sur l'idée de Lo Ligam à la base, qui est les publications Instagram », « fais-moi une proposition », « des propositions d'amélioration ». Il faut oser (il a reproché à Claude de se censurer) sans kitsch ni effet « trop IA », et rester sobre (poids, téléphone d'abord). Son forfait est presque épuisé : travaille avec les résumés ci-dessous, n'ouvre un rapport complet que si un détail te manque, lis par extraits.
Règles : tout en français ; chaque fait sourcé (rapport ou fichier) ; aucun mot occitan nouveau sans le vérifier avec « cd app ; node scripts/verificar-oc.mjs mot » et sans le marquer « à valider par Romain » ; recopier les textes occitans existants de préférence ; pas de contenu pédagogique inventé (Romain écrit la chair) ; les décisions « à ne pas rouvrir » (PILOTATGE.md, liste des 15) ne se rouvrent que si tu le dis explicitement et pourquoi ; tu ne modifies que les fichiers qu'on te nomme ; pas de tirets longs, pas d'anglais.

Résumés des neuf lectures de la nuit :
${DIGEST}`

const RESUM = {
  type: 'object',
  properties: { fichier: { type: 'string' }, resum: { type: 'string', description: '250 mots au plus' }, punts: { type: 'array', items: { type: 'string' } } },
  required: ['fichier', 'resum', 'punts'],
}

phase('Proposer')
const [sintesi, miralh] = await Promise.all([
  agent(`${COMUN}

Tu écris LA proposition pour Romain : ${RACINA}\\revisions\\2026-10-22-proposicion-pagina-blanca.md (markdown, 1800 à 2600 mots). Avant d'écrire, pèse en toi trois angles : A « Lo feed, lo site » (les 36 thèmes Instagram et les six familles de publications comme ossature, brique et or, fiche comme unité de base) ; B « La classe calme » (l'apprentissage et la scène de l'unité en porte, structure et calme de Léo Parpeix, Instagram en accents) ; C « Lo país » (la carte et le wiki en porte, on apprend en voyageant). Choisis, ou combine, et dis pourquoi en cinq lignes, avec les mots de Romain. Lis DIRECCION.md (§0, §1, §3) et charte-graphique.md §1 à §2 par extraits.
Contenu, dans cet ordre : (1) en-tête : ce que c'est, comment la lire, ce qui est décidé par Romain et ce qui est proposé ; (2) l'idée en une phrase dans ses mots, et en dix lignes ; (3) l'accueil bloc par bloc (7 au plus : rôle, ce qu'on voit, d'où vient la matière avec chemin de fichier ou visuel Instagram ou texte existant, ce que Romain écrit lui-même) ; (4) les trois pages de rubrique (Se parla, S'apren, Amassa) ; (5) les pages intérieures (carte, mots, parcours, scène, compte, wiki, forum) et ce qu'elles deviennent ; (6) réutilisé tel quel / jeté / nouveau, avec chemins vérifiés par ls ; (7) direction visuelle précise : fond, la seule couleur vive, typographie, images, comment l'esprit Instagram (brique, or, dense, humour) et le Plâtre de Parpeix se réconcilient ; (8) le mouvement : la seule chose qui bouge par écran, ce qui part, la version légère ; (9) lancement / évolution ; (10) heures de Romain par tâche et séances de Claude ; (11) décisions existantes contredites : rouvrir ou respecter, et pourquoi, liste explicite pour qu'il tranche ; (12) trois « oser » sobres et fidèles à la marque ; (13) le gabarit en texte de l'accueil pour la construction : blocs ordonnés, titre exact (occitan existant, ou « [a escriure per Romain] »), image (chemin), liens ; (14) trois questions pour la première séance de retour, une décision à la fois. Retourne un résumé et les points saillants.`, { label: 'proposicion', phase: 'Proposer', schema: RESUM }),
  agent(`${COMUN}

Tu écris deux pages courtes. (1) ${RACINA}\\${D}\\esperit.md, « L'esprit de Lo Ligam en une page » (500 à 800 mots) : ce que Romain demande depuis le début en ses mots (cite « … » avec dates), en 5 constantes au plus ; ce qu'il rejette, en ses mots ; l'origine Instagram, ce qui fait la marque et la distance avec le site d'aujourd'hui ; les trois verbes (Se parla, S'apren, Amassa) relus à cette lumière ; l'émotion visée, avec preuves. Un miroir fidèle, pas de recommandation. (2) ${RACINA}\\${D}\\faicon-de-trabalhar.md, « Sa façon de travailler : quand ça marche, quand ça bloque » (600 à 1000 mots) : les séances qui ont marché (datées) et leurs points communs ; les blocages et renversements (datés) et leurs points communs ; la cause de fond de l'impression « on avance à l'aveugle, de manière artisanale » (21-10), avec preuves ; sept règles de travail au plus, moitié pour Claude, moitié pour Romain, chacune reliée à une preuve ; ce qu'il garde pour lui et ce qu'il délègue sans se déposséder (règle du 04-10). Franc, pas flatteur. Retourne un résumé et les règles.`, { label: 'miralh', phase: 'Proposer', schema: RESUM }),
])
log(`proposition : ${sintesi ? 'écrite' : 'manquante'} ; miroir : ${miralh ? 'écrit' : 'manquant'}`)

phase('Construire')
const esbos = sintesi ? await agent(`${COMUN}

Tu construis l'ESQUISSE de l'accueil proposé, pour que Romain la voie sur son téléphone au réveil, à l'adresse /ensag/blanc. Source : le gabarit en texte (point 13), la direction visuelle (point 7) et le mouvement (point 8) de ${RACINA}\\revisions\\2026-10-22-proposicion-pagina-blanca.md ; lis ces trois points seulement.
Fichiers que tu crées ou modifies, et seulement ceux-là : app/src/routes/ensag/blanc/+page.svelte (et au besoin app/src/routes/ensag/blanc/donadas.js), app/static/ensag/blanc/ (images), app/src/routes/+layout.svelte (seulement pour ajouter '/ensag/blanc' à côté de '/ensag/clar' dans la condition ambPè, si l'esquisse dessine son propre pied de page). Modèle de départ : app/src/routes/ensag/clar/+page.svelte (page d'essai récente : noindex, grille de 12 colonnes, jetons, images dans app/static/ensag/clar/) ; réutilisables : app/src/lib/components/Crotz.svelte (teula = logo complet), Icona.svelte, les polices (app/src/fonts.css), les jetons --t-* et --logo-* d'app/src/app.css, les images d'app/static/acuelh et app/static/ensag/clar, les visuels Instagram de design-stock/canva-vf/ (si tu en utilises : copie-les RÉDUITS à 640 px de large et en webp dans app/static/ensag/blanc/ avec sharp depuis app/ : node -e "require('sharp')('../design-stock/canva-vf/<dossier>/<fichier>.png').resize(640).webp({quality:70}).toFile('static/ensag/blanc/<nom>.webp')" ; jamais plus de 150 Ko par image ; 6 images au plus).
Exigences : occitan seulement, textes existants du site ; pour un titre qui n'existe pas, écris « [a escriure per Romain] » plutôt qu'inventer ; mobile d'abord (375 px) et 1830 px ; aucun défilement de côté ; cibles d'au moins 24 px ; contrastes AA (encre #2a1a10 sur plâtre) ; CSS seul pour le mouvement, prefers-reduced-motion respecté ; pas de WebGL, pas de canvas, pas de bibliothèque nouvelle ; <meta name="robots" content="noindex"> ; poids total sous 400 Ko. À la fin : « cd app ; npm run build » doit passer (sinon corrige), puis liste tes fichiers, le poids des images, et les mots occitans qui ne venaient pas du site. Ne lance pas de serveur. Ne fais pas de git.`, { label: 'esbos:blanc', phase: 'Construire', schema: RESUM }) : null
log(`esquisse : ${esbos ? 'construite' : 'non construite'}`)

phase('Rapport')
const raport = await agent(`${COMUN}

Tu écris le rapport de nuit que Romain lira au réveil : ${RACINA}\\revisions\\2026-10-22-analisi-profonda.md (markdown, 1400 à 2000 mots, français simple, phrases courtes, pas de jargon, pas de tirets longs). Sources : les résumés ci-dessus, ${D}/esperit.md et faicon-de-trabalhar.md (lis-les), la proposition revisions/2026-10-22-proposicion-pagina-blanca.md (lis ses points 2, 9, 11, 14), et ce résumé de l'esquisse : ${JSON.stringify(esbos && esbos.resum)}.
Plan imposé : (1) « Ce qui s'est passé cette nuit » (cinq lignes : deux vagues, treize agents, fichiers produits, l'esquisse à https://loligam.eu/ensag/blanc, forfait ménagé à la demande de Romain : pas de juges ni de vérificateurs adverses, contrôles faits par Claude) ; (2) « L'esprit de Lo Ligam » (le miroir, en ses mots) ; (3) « Ta façon de travailler : quand ça marche, quand ça bloque » (dates et règles) ; (4) « Le projet en chiffres » (commits, mois, part de la carte, pages, liens introuvables, poids, ce qui bloque sur toi) ; (5) « La proposition » (quinze lignes + ce qu'elle rouvre) ; (6) « Ce que tu peux faire seul maintenant » et « ce qu'on fait ensemble » ; (7) « Trois décisions pour la prochaine séance », une à la fois ; (8) la table des fichiers produits avec chemin complet. Chaque affirmation garde sa source entre parenthèses. Retourne un résumé.`, { label: 'raport', phase: 'Rapport', schema: RESUM })

return { sintesi: sintesi && sintesi.resum, miralh: miralh && miralh.punts, esbos: esbos && esbos.resum, raport: raport && raport.resum }
