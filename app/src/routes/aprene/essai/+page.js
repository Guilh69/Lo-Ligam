// La leçon d'essai est remplacée par le module 0, joué sans compte (cahier
// §11 du 2026-08-29 ; Romain, 2026-11-05 : « il faut supprimer la leçon
// d'essai »). Les anciens liens arrivent au bon endroit.
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(301, '/aprene/modul/0');
}
