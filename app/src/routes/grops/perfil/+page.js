import { redirect } from '@sveltejs/kit';

// Le profil se modifie désormais depuis le compte (les groupes sont retirés).
export function load() {
	redirect(308, '/compte/perfil');
}
