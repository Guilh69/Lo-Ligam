import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from './supabaseClient';

export const session = writable(null);
export const authReady = writable(!browser);

if (browser) {
	supabase.auth.getSession().then(({ data }) => {
		session.set(data.session);
		authReady.set(true);
	});

	supabase.auth.onAuthStateChange((_event, newSession) => {
		session.set(newSession);
	});
}
