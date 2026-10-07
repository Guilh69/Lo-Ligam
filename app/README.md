# Lo Ligam : le site

Application SvelteKit 2 (Svelte 5), servie par Node (`adapter-node`) dans un
conteneur Scaleway. Base de données et comptes : Supabase (Union européenne).
Le pilotage du projet est dans `../PILOTATGE.md`.

## Commandes (dans ce dossier `app/`)

| Commande | Effet |
|---|---|
| `npm install` | installe les dépendances (une fois) |
| `npm run dev` | site en local sur http://localhost:5173 (les esquisses `esbos-*.html` y restent visibles) |
| `npm test` | tests automatiques (fiches, sections du site) |
| `npm run build` | construit la version en ligne dans `build/`, compresse les `.geojson` et retire les esquisses |

## Variables d'environnement

Lues au démarrage du serveur (`$env/dynamic/public`), pas à la construction :
l'image Docker n'en contient aucune.

| Variable | Où la renseigner | Rôle |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | `app/.env` en local, variables du conteneur Scaleway en ligne | adresse du projet Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | idem | clé publique (anon) : les droits sont tenus par les règles RLS de la base |
| `LOCONGRES_API_KEY` | `app/.env` seulement | vérification du lexique des modules par les scripts, jamais envoyée au navigateur |

Modèle : `.env.example`.

## Mise en ligne

Chaque envoi sur `master` qui touche `app/` déclenche
`.github/workflows/desplegar.yml` : GitHub construit l'image (tests compris),
l'envoie au registre Scaleway et redéploie le conteneur.
