// La dictée dans les champs du talhièr (Romain dicte : les touches de son
// clavier sont en panne, et le micro du clavier ne s'active pas depuis la page ;
// même principe que lib/lesson/Remarcas.svelte, 2026-10-25). C'est la
// reconnaissance vocale du navigateur, en français : elle passe par le service
// de l'éditeur du navigateur (Google pour Chrome, Microsoft pour Edge, Apple
// pour Safari) ; Firefox ne l'a pas, le bouton n'apparaît alors pas.
import { browser } from '$app/environment';

const Reconeissença = browser ? (window.SpeechRecognition ?? window.webkitSpeechRecognition) : null;
export const dictadaPossibla = !!Reconeissença;

/**
 * Commence à écouter. Le texte dicté s'ajoute à `abans`.
 * @returns {() => void} pour arrêter
 */
export function dictar(abans, { tèxte, fin, error }) {
	const rec = new Reconeissença();
	rec.lang = 'fr-FR';
	rec.continuous = true;
	rec.interimResults = true;
	const debut = abans.trim() ? abans.trimEnd() + ' ' : '';
	rec.onresult = (e) => {
		let dich = '';
		for (const r of e.results) dich += r[0].transcript;
		tèxte((debut + dich).slice(0, 2000));
	};
	rec.onerror = (e) => {
		if (e.error === 'not-allowed' || e.error === 'service-not-allowed') error('Le micro est bloqué : autorise-le pour ce site dans ton navigateur.');
		else if (e.error !== 'aborted' && e.error !== 'no-speech') error('La dictée n’a pas marché. Réessaie, ou écris.');
	};
	rec.onend = fin;
	rec.start();
	return () => rec.stop();
}
