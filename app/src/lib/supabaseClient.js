import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

// Lecture au DÉMARRAGE et non à la construction ($env/dynamic et non
// $env/static). Deux raisons :
//   - l'image du conteneur se construit sans accès aux réglages ; en statique,
//     la construction échouerait ;
//   - la même image peut ainsi pointer vers une autre base sans être
//     reconstruite, ce qui servira lors de la migration de la base.
//
// Valeurs de repli : pendant la construction, SvelteKit charge ce module pour
// analyser les routes, à un instant où aucune variable n'est définie. Sans
// repli, createClient lèverait une erreur et la construction s'arrêterait.
// Ces adresses ne servent jamais en fonctionnement réel.
const url = env.PUBLIC_SUPABASE_URL || 'https://exemple.supabase.co';
const clau = env.PUBLIC_SUPABASE_ANON_KEY || 'clau-absenta';

// persistSession/autoRefreshToken s'appuient sur localStorage, absent côté
// serveur pendant le rendu SSR — désactivés hors navigateur pour l'éviter.
export const supabase = createClient(url, clau, {
	auth: {
		persistSession: browser,
		autoRefreshToken: browser,
		detectSessionInUrl: browser
	}
});
