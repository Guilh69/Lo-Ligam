import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// persistSession/autoRefreshToken s'appuient sur localStorage, absent côté
// serveur pendant le rendu SSR — désactivés hors navigateur pour l'éviter.
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		persistSession: browser,
		autoRefreshToken: browser,
		detectSessionInUrl: browser
	}
});
