// Maquette de Se parla (2026-10-25) : les vraies cases de la page, sauf
// Musicas, remplacée par Médias ; Òbras mène à sa maquette par art.
import { legirElements } from '$lib/server/elements.js';
import { teula } from '$lib/ensag/maqueta.js';

export async function load() {
	const rows = (await legirElements('parla'))
		.filter((e) => !e.clau.startsWith('parla.teulas.musicas'))
		.map((e) => (e.clau === 'parla.teulas.obras.ligam' ? { ...e, ligam: '/ensag/obras' } : e));
	const ordre = Math.max(0, ...rows.filter((e) => e.lista === 'parla.teulas').map((e) => e.ordre ?? 0)) + 1;
	rows.push(...teula('parla', 'medias', ordre, '/ensag/medias', 'Mèdias', 'Médias', 'Ràdios, televisions e premsa en occitan.', 'Radios, télévisions et presse en occitan.'));
	return { rows };
}
