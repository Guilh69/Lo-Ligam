import { error } from '@sveltejs/kit';
import { moduls } from '$lib/lesson/moduls/index.js';

// Une adresse de module inconnue répond par une vraie 404 (page d'erreur du
// site) et non par une page normale au statut 200 (audit du 2026-10-08).
export function load({ params }) {
	if (!moduls[params.modulId]) error(404, 'Modul introbable');
	return {};
}
