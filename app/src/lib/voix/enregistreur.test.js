import { describe, it, expect, vi } from 'vitest';
import {
	creerEnregistreur,
	choisirFormat,
	contraintesAudio,
	formatDeType,
	ErreurVoix,
	MESSAGES,
	DUREE_MAX_MS
} from './enregistreur.js';

// MediaRecorder simulé : on choisit les formats acceptés et ce que la prise contient.
function fauxRecorder({ acceptes = ['audio/webm;codecs=opus'], contenu = [new Blob([new Uint8Array(500)])], typeProduit } = {}) {
	const instances = [];
	class FauxMR {
		static isTypeSupported(m) {
			return acceptes.includes(m);
		}
		constructor(flux, options) {
			this.flux = flux;
			this.options = options;
			this.state = 'inactive';
			this.mimeType = typeProduit ?? options.mimeType;
			instances.push(this);
		}
		start(tranche) {
			this.tranche = tranche;
			this.state = 'recording';
		}
		stop() {
			this.state = 'inactive';
			for (const b of contenu) this.ondataavailable?.({ data: b });
			this.onstop?.();
		}
	}
	return { FauxMR, instances };
}

function fauxNavigator({ refus, connus = { echoCancellation: true, noiseSuppression: true, autoGainControl: true } } = {}) {
	const piste = { readyState: 'live', stop: vi.fn(function () { this.readyState = 'ended'; }) };
	const getUserMedia = vi.fn(async () => {
		if (refus) {
			const e = new Error('refus');
			e.name = refus;
			throw e;
		}
		return { getTracks: () => [piste] };
	});
	return { navigator: { mediaDevices: { getUserMedia, getSupportedConstraints: () => connus } }, getUserMedia, piste };
}

// horloge manipulable
function horloge() {
	let t = 0;
	return { maintenant: () => t, avancer: (ms) => (t += ms) };
}

describe('choix du format', () => {
	it('demande à isTypeSupported et prend le premier accepté, Opus avant AAC', () => {
		expect(choisirFormat(fauxRecorder({ acceptes: ['audio/mp4', 'audio/webm;codecs=opus'] }).FauxMR).ext).toBe('webm');
		expect(choisirFormat(fauxRecorder({ acceptes: ['audio/ogg;codecs=opus'] }).FauxMR).ext).toBe('ogg');
		expect(choisirFormat(fauxRecorder({ acceptes: ['audio/mp4'] }).FauxMR)).toMatchObject({ type: 'audio/mp4', ext: 'm4a' });
	});
	it('aucun format accepté, ou pas de MediaRecorder : null', () => {
		expect(choisirFormat(fauxRecorder({ acceptes: [] }).FauxMR)).toBeNull();
		expect(choisirFormat(undefined)).toBeNull();
	});
	it('le format réel se lit sur le type produit, paramètres retirés', () => {
		expect(formatDeType('audio/mp4;codecs=avc1')).toMatchObject({ ext: 'm4a' });
		expect(formatDeType('', 'repli')).toBe('repli');
	});
});

describe('réglages du micro', () => {
	it('coupe écho, bruit et gain quand le navigateur les connaît', () => {
		expect(contraintesAudio({ getSupportedConstraints: () => ({ echoCancellation: true, noiseSuppression: true, autoGainControl: true }) })).toEqual({
			echoCancellation: false,
			noiseSuppression: false,
			autoGainControl: false
		});
	});
	it('sinon demande le micro sans condition', () => {
		expect(contraintesAudio({ getSupportedConstraints: () => ({}) })).toBe(true);
		expect(contraintesAudio({ getSupportedConstraints: () => ({ echoCancellation: true }) })).toEqual({ echoCancellation: false });
	});
});

describe('enregistreur', () => {
	it('micro demandé seulement au premier appui, puis gardé ; une prise complète', async () => {
		const { FauxMR, instances } = fauxRecorder();
		const { navigator, getUserMedia } = fauxNavigator();
		const h = horloge();
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR, maintenant: h.maintenant });
		expect(getUserMedia).not.toHaveBeenCalled();

		const { fin } = await e.demarrer();
		expect(getUserMedia).toHaveBeenCalledWith({
			audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
			video: false
		});
		expect(instances[0].options.mimeType).toBe('audio/webm;codecs=opus');
		expect(e.enregistre).toBe(true);
		h.avancer(2000);
		e.arreter();
		const prise = await fin;
		expect(prise).toMatchObject({ type: 'audio/webm', ext: 'webm', duree: 2000, coupee: false });
		expect(prise.blob.size).toBe(500);
		expect(e.enregistre).toBe(false);

		// deuxième prise : pas de nouvelle demande de micro
		const deux = await e.demarrer();
		h.avancer(1000);
		e.arreter();
		await deux.fin;
		expect(getUserMedia).toHaveBeenCalledTimes(1);
	});

	it('refus du micro : message clair en français', async () => {
		const { FauxMR } = fauxRecorder();
		const { navigator } = fauxNavigator({ refus: 'NotAllowedError' });
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR });
		await expect(e.demarrer()).rejects.toMatchObject({ name: 'ErreurVoix', code: 'refus', message: MESSAGES.refus });
	});

	it('aucun micro : message dédié', async () => {
		const { FauxMR } = fauxRecorder();
		const { navigator } = fauxNavigator({ refus: 'NotFoundError' });
		await expect(creerEnregistreur({ navigator, MediaRecorder: FauxMR }).demarrer()).rejects.toMatchObject({ code: 'absent' });
	});

	it('pas de MediaRecorder : message, et le micro n’est même pas demandé', async () => {
		const { navigator, getUserMedia } = fauxNavigator();
		const e = creerEnregistreur({ navigator, MediaRecorder: undefined });
		await expect(e.demarrer()).rejects.toBeInstanceOf(ErreurVoix);
		await expect(e.demarrer()).rejects.toMatchObject({ code: 'indisponible' });
		expect(getUserMedia).not.toHaveBeenCalled();
	});

	it('aucun format accepté : message « format »', async () => {
		const { FauxMR } = fauxRecorder({ acceptes: [] });
		const { navigator } = fauxNavigator();
		await expect(creerEnregistreur({ navigator, MediaRecorder: FauxMR }).demarrer()).rejects.toMatchObject({ code: 'format' });
	});

	it('durée maximale : arrêt automatique à 30 s, prise marquée coupée', async () => {
		vi.useFakeTimers();
		try {
			const { FauxMR, instances } = fauxRecorder();
			const { navigator } = fauxNavigator();
			let t = 0;
			const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR, maintenant: () => t });
			const { fin } = await e.demarrer();
			t = DUREE_MAX_MS - 1;
			vi.advanceTimersByTime(DUREE_MAX_MS - 1);
			expect(instances[0].state).toBe('recording');
			t = DUREE_MAX_MS;
			vi.advanceTimersByTime(1);
			expect(instances[0].state).toBe('inactive');
			await expect(fin).resolves.toMatchObject({ coupee: true, duree: DUREE_MAX_MS });
		} finally {
			vi.useRealTimers();
		}
	});

	it('prise vide : refusée avec un message', async () => {
		const { FauxMR } = fauxRecorder({ contenu: [] });
		const { navigator } = fauxNavigator();
		const h = horloge();
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR, maintenant: h.maintenant });
		const { fin } = await e.demarrer();
		h.avancer(2000);
		e.arreter();
		await expect(fin).rejects.toMatchObject({ code: 'vide', message: MESSAGES.vide });
	});

	it('appui trop bref : traité comme une prise vide', async () => {
		const { FauxMR } = fauxRecorder();
		const { navigator } = fauxNavigator();
		const h = horloge();
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR, maintenant: h.maintenant });
		const { fin } = await e.demarrer();
		h.avancer(100);
		e.arreter();
		await expect(fin).rejects.toMatchObject({ code: 'vide' });
	});

	it('Safari : le format réellement produit décide de l’extension', async () => {
		const { FauxMR } = fauxRecorder({ acceptes: ['audio/mp4'], typeProduit: 'audio/mp4' });
		const { navigator } = fauxNavigator({ connus: {} });
		const h = horloge();
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR, maintenant: h.maintenant });
		const { fin } = await e.demarrer();
		h.avancer(1500);
		e.arreter();
		await expect(fin).resolves.toMatchObject({ type: 'audio/mp4', ext: 'm4a' });
		expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true, video: false });
	});

	it('libérer rend le micro, même pendant une prise', async () => {
		const { FauxMR, instances } = fauxRecorder();
		const { navigator, piste } = fauxNavigator();
		const e = creerEnregistreur({ navigator, MediaRecorder: FauxMR });
		await e.demarrer();
		expect(e.microOuvert()).toBe(true);
		e.liberer();
		expect(instances[0].state).toBe('inactive');
		expect(piste.stop).toHaveBeenCalled();
		expect(e.microOuvert()).toBe(false);
	});
});
