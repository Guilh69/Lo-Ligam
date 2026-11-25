// Les variables d'environnement du site (SvelteKit 3, 2026-11-25). Depuis
// SvelteKit 3, une variable n'est lisible que si elle est déclarée ici ; elle
// se lit ensuite par $app/env/public (envoyée au navigateur) ou
// $app/env/private (reste sur le serveur).
//
// Toutes sont lues au DÉMARRAGE du serveur, pas à la construction (comme
// l'ancien $env/dynamic) : l'image Docker ne contient aucune clé, Scaleway
// les fournit au lancement du conteneur. En local, elles viennent de app/.env.
//
// Toutes sont facultatives, comme avant : une variable absente vaut
// undefined et le code prévoit déjà ce cas (valeur de secours, ou fonction
// coupée). Sans cela, le serveur refuserait de démarrer s'il en manquait une.
import { defineEnvVars } from '@sveltejs/kit/env';

/** @param {string | undefined} v */
const facultative = (v) => v;

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		schema: facultative,
		description: 'Adresse du projet Supabase (base de données et comptes)'
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		public: true,
		schema: facultative,
		description: 'Clé publique de Supabase ; les règles RLS de la base font la sécurité'
	},
	LOCONGRES_API_KEY: {
		schema: facultative,
		description: 'Clé des API de lo Congrès (vérification de l’occitan)'
	},
	REVIRADA_API_KEY: {
		schema: facultative,
		description: 'Clé de Revirada, le traducteur de lo Congrès'
	},
	CONTACTE_DE: {
		schema: facultative,
		description: 'Adresse d’envoi des messages du formulaire de contact (sinon formulari@loligam.eu)'
	},
	SCW_PROJECTE: {
		schema: facultative,
		description: 'Projet Scaleway pour l’envoi des courriels du formulaire de contact'
	},
	SCW_TEM_CLAU: {
		schema: facultative,
		description: 'Clé Scaleway Transactional Email ; sert aussi de secret pour signer le formulaire'
	}
});
