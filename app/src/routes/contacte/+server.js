// Le contact vit en fin de page de Mon istòria (option A de Romain, 2026-10-24).
import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(308, '/istoria#contacte');
}
