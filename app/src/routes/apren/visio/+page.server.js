// « Corses en visio » : ses éléments modifiables, publiés seulement, avec le
// filet de secours ($lib/server/elements.js), et le questionnaire d'avant le
// premier cours (Romain, 2026-10-24), qui part par courriel vers l'alias
// ($lib/server/contacte.js : mêmes garde-fous que le contact) et marche
// aussi sans JavaScript. Le site n'en garde rien.
import { fail } from '@sveltejs/kit';
import { legirElements } from '$lib/server/elements.js';
import { geton, getonValid, plafonat, linha, corrièlValid, mandarCorrièl } from '$lib/server/contacte.js';

export async function load() {
	return { elements: await legirElements('visio'), geton: geton() };
}

// l'adresse du visiteur derrière le relais de Scaleway (voir istoria)
const ipDe = (request, getClientAddress) =>
	request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || getClientAddress();

// les questions à choix : leur nom dans le formulaire et la liste d'éléments
// qui donne les réponses permises (seules ces clés sont acceptées)
const QUESTIONS = [
	['nivèl', 'visio.q.nivèls', 'Nivèl / Niveau'],
	['motivacions', 'visio.q.motivacions', 'Motivacions'],
	['lengas', 'visio.q.lengas', 'Lengas / Langues'],
	['ritme', 'visio.q.ritmes', 'Ritme / Rythme'],
	['axes', 'visio.q.axes', 'Çò que t’agradariá mai / Envies']
];

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const fd = await request.formData();
		const elements = await legirElements('visio');
		const perClau = new Map(elements.map((e) => [e.clau, e]));
		const causits = Object.fromEntries(
			QUESTIONS.map(([nom, l]) => [nom, fd.getAll(nom).map(String).filter((c) => perClau.get(c)?.lista === l)])
		);
		const nom = linha(fd.get('nom')).slice(0, 120);
		const corrièl = linha(fd.get('corrièl')).toLowerCase();
		const luòc = linha(fd.get('luòc')).slice(0, 120);
		const messatge = String(fd.get('messatge') ?? '').trim().slice(0, 4000);
		// on rend ce que la personne avait rempli, pour qu'elle ne perde rien
		const tornar = (status, error) => fail(status, { error, nom, corrièl, luòc, messatge, ...causits });

		// un robot remplit tout : on fait comme si c'était parti
		if (linha(fd.get('site_web'))) return { mandat: true };
		if (!getonValid(fd.get('geton'))) return tornar(400, 'geton');
		if (!corrièlValid(corrièl)) return tornar(400, 'corrièl');
		if ((messatge.match(/https?:\/\//gi) ?? []).length > 3) return tornar(400, 'ligams');
		if (plafonat(ipDe(request, getClientAddress))) return tornar(429, 'plafond');

		// les réponses en français (Romain lit tout) ; l'occitan entre parenthèses
		const dire = (c) => {
			const e = perClau.get(c);
			return e.oc && e.oc !== e.fr ? `${e.fr} (${e.oc})` : e.fr;
		};
		const cos = [
			'Questionari abans un primièr cors (loligam.eu)',
			'Questionnaire avant un premier cours (loligam.eu)',
			'',
			`Prénom : ${nom || '(non donné)'}`,
			`Courriel : ${corrièl}`,
			`Lieu : ${luòc || '(non donné)'}`,
			...QUESTIONS.map(([n, , titol]) => `${titol} : ${causits[n].map(dire).join(' ; ') || '(sans réponse)'}`),
			'',
			messatge ? `Message :\n${messatge}` : 'Message : (aucun)',
			'',
			`Data : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`,
			'-- ',
			`Répondre à ce courriel écrit directement à ${corrièl}.`
		].join('\n');

		const r = await mandarCorrièl({ subject: `Lo Ligam · primièr cors : ${nom || corrièl}`, text: cos, nom, corrièl });
		if (r.ok) return { mandat: true };
		return tornar(r.status, r.error);
	}
};
