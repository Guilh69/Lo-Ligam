import { redirect } from '@sveltejs/kit';

// L'essai du 2026-11-03 est devenu la première fiche de grammaire.
export function GET() {
	redirect(307, '/apren/gramatica/infinitiu');
}
