// Enregistreur de voix du studio (lot 2) : la logique seule, sans interface.
//
// On veut la voix BRUTE : pas d'annulation d'écho, pas de réduction de bruit,
// pas de réglage automatique du volume quand le navigateur accepte de les
// couper. La mise au propre se fera après, sur l'ordinateur (lot 3).
//
// Tout ce qui vient du navigateur (navigator, MediaRecorder, horloge) peut être
// remplacé par un double : c'est ce qui rend ce fichier testable sans micro.

/** Durée maximale d'une prise : une phrase courte tient largement en 30 s. */
export const DUREE_MAX_MS = 30_000;

/** Débit demandé (le navigateur peut l'ignorer) : 128 kbit/s, soit 480 Ko pour 30 s. */
export const DEBIT_AUDIO = 128_000;

/** Prise plus courte que ça : appui trop bref, rien de dit. */
export const DUREE_MIN_MS = 300;

// Formats que MediaRecorder produit réellement, par ordre de préférence :
// l'Opus (Chrome, Firefox, Android, Safari récent) avant l'AAC (iPhone).
// `type` est le type envoyé au dossier (sans les paramètres), `ext` l'extension.
export const FORMATS = [
	{ mime: 'audio/webm;codecs=opus', type: 'audio/webm', ext: 'webm' },
	{ mime: 'audio/ogg;codecs=opus', type: 'audio/ogg', ext: 'ogg' },
	{ mime: 'audio/mp4;codecs=mp4a.40.2', type: 'audio/mp4', ext: 'm4a' },
	{ mime: 'audio/webm', type: 'audio/webm', ext: 'webm' },
	{ mime: 'audio/ogg', type: 'audio/ogg', ext: 'ogg' },
	{ mime: 'audio/mp4', type: 'audio/mp4', ext: 'm4a' }
];

/** Extensions possibles d'une prise dans le dossier (pour le listing). */
export const EXTENSIONS = ['webm', 'ogg', 'm4a'];

export const MESSAGES = {
	indisponible:
		'Ce navigateur ne sait pas enregistrer le son. Essaie avec Firefox, Chrome ou Safari à jour.',
	securite: 'Le micro n’est accessible que sur une adresse sûre (https).',
	format: 'Ce navigateur n’enregistre dans aucun format accepté par le dossier des voix.',
	refus:
		'Le micro est refusé. Autorise-le pour ce site dans les réglages du navigateur (souvent le cadenas à côté de l’adresse), puis appuie de nouveau sur Enregistrer.',
	absent: 'Aucun micro trouvé. Branche ou active un micro, puis réessaie.',
	occupe: 'Le micro est déjà pris par une autre application. Ferme-la, puis réessaie.',
	vide: 'La prise est vide ou trop courte. Recommence en parlant après le premier appui.',
	enregistrement: 'L’enregistrement s’est interrompu. Recommence la prise.'
};

/** Erreur du studio : `code` est une clé de MESSAGES, `message` le texte à montrer. */
export class ErreurVoix extends Error {
	constructor(code, cause) {
		super(MESSAGES[code] ?? MESSAGES.enregistrement);
		this.name = 'ErreurVoix';
		this.code = code;
		if (cause) this.cause = cause;
	}
}

/**
 * Premier format accepté par ce navigateur, demandé à MediaRecorder.isTypeSupported :
 * on ne suppose jamais. null si aucun, ou si MediaRecorder manque.
 */
export function choisirFormat(MR) {
	if (!MR || typeof MR.isTypeSupported !== 'function') return null;
	for (const f of FORMATS) {
		try {
			if (MR.isTypeSupported(f.mime)) return f;
		} catch {
			/* un navigateur qui lève ici n'accepte pas ce format */
		}
	}
	return null;
}

/** Format correspondant au type réellement produit (« audio/webm;codecs=opus » → webm). */
export function formatDeType(mime, repli = null) {
	const base = String(mime ?? '').split(';')[0].trim().toLowerCase();
	return FORMATS.find((f) => f.type === base) ?? repli;
}

/**
 * Réglages du micro : écho, bruit et gain automatique coupés seulement quand
 * le navigateur dit les connaître ; sinon on demande le micro sans condition.
 */
export function contraintesAudio(mediaDevices) {
	let connus = {};
	try {
		connus = mediaDevices?.getSupportedConstraints?.() ?? {};
	} catch {
		connus = {};
	}
	const audio = {};
	for (const k of ['echoCancellation', 'noiseSuppression', 'autoGainControl']) {
		if (connus[k]) audio[k] = false;
	}
	return Object.keys(audio).length ? audio : true;
}

/** Traduit une erreur de getUserMedia en ErreurVoix. */
export function erreurMicro(e) {
	switch (e?.name) {
		case 'NotAllowedError':
		case 'PermissionDeniedError':
			return new ErreurVoix('refus', e);
		case 'SecurityError':
			return new ErreurVoix('securite', e);
		case 'NotFoundError':
		case 'DevicesNotFoundError':
		case 'OverconstrainedError':
			return new ErreurVoix('absent', e);
		case 'NotReadableError':
		case 'TrackStartError':
		case 'AbortError':
			return new ErreurVoix('occupe', e);
		default:
			return new ErreurVoix('enregistrement', e);
	}
}

/**
 * Crée un enregistreur. Le micro n'est demandé qu'au premier `demarrer()`, puis
 * gardé ouvert entre les prises (pas de nouvelle question à chaque phrase) ;
 * `liberer()` le rend (à appeler en quittant la page).
 *
 * const e = creerEnregistreur();
 * const { fin } = await e.demarrer();   // lève ErreurVoix si impossible
 * … e.arreter();                         // ou arrêt seul au bout de DUREE_MAX_MS
 * const prise = await fin;               // { blob, type, ext, duree, coupee }
 */
export function creerEnregistreur(env = {}) {
	const nav = env.navigator ?? globalThis.navigator;
	const MR = 'MediaRecorder' in env ? env.MediaRecorder : globalThis.MediaRecorder;
	const dureeMax = env.dureeMax ?? DUREE_MAX_MS;
	const maintenant = env.maintenant ?? (() => Date.now());
	const minuter = env.setTimeout ?? globalThis.setTimeout.bind(globalThis);
	const deminuter = env.clearTimeout ?? globalThis.clearTimeout.bind(globalThis);

	let flux = null;
	let enCours = null; // { rec, fin, minuteur }

	/** Le micro est-il ouvert (indicateur du navigateur allumé) ? */
	const microOuvert = () => !!flux;

	async function ouvrirMicro() {
		if (flux && flux.getTracks().some((t) => t.readyState !== 'ended')) return flux;
		if (!nav?.mediaDevices?.getUserMedia) {
			// navigateur sans accès au micro, ou adresse non sûre (http)
			throw new ErreurVoix(globalThis.isSecureContext === false ? 'securite' : 'indisponible');
		}
		try {
			flux = await nav.mediaDevices.getUserMedia({ audio: contraintesAudio(nav.mediaDevices), video: false });
		} catch (e) {
			throw erreurMicro(e);
		}
		return flux;
	}

	async function demarrer() {
		if (enCours) return { fin: enCours.fin };
		if (typeof MR !== 'function') throw new ErreurVoix('indisponible');
		const format = choisirFormat(MR);
		if (!format) throw new ErreurVoix('format');
		const micro = await ouvrirMicro();

		let rec;
		try {
			rec = new MR(micro, { mimeType: format.mime, audioBitsPerSecond: DEBIT_AUDIO });
		} catch (e) {
			throw new ErreurVoix('format', e);
		}
		const morceaux = [];
		const debut = maintenant();
		let coupee = false;
		let resoudre, rejeter;
		const fin = new Promise((ok, ko) => {
			resoudre = ok;
			rejeter = ko;
		});

		rec.ondataavailable = (ev) => {
			if (ev.data && ev.data.size > 0) morceaux.push(ev.data);
		};
		rec.onerror = (ev) => {
			terminer();
			rejeter(new ErreurVoix('enregistrement', ev?.error));
		};
		rec.onstop = () => {
			terminer();
			const duree = maintenant() - debut;
			const choisi = formatDeType(rec.mimeType, format);
			const blob = new Blob(morceaux, { type: choisi.type });
			if (blob.size === 0 || duree < DUREE_MIN_MS) rejeter(new ErreurVoix('vide'));
			else resoudre({ blob, type: choisi.type, ext: choisi.ext, duree, coupee });
		};

		const minuteur = minuter(() => {
			coupee = true;
			arreter();
		}, dureeMax);
		enCours = { rec, fin, minuteur };

		function terminer() {
			deminuter(minuteur);
			if (enCours?.rec === rec) enCours = null;
		}

		try {
			// tranche d'une seconde : certains Safari rendent une prise vide sans elle
			rec.start(1000);
		} catch (e) {
			terminer();
			throw new ErreurVoix('enregistrement', e);
		}
		return { fin };
	}

	/** Arrête la prise en cours (sans effet s'il n'y en a pas) ; rend la promesse de fin. */
	function arreter() {
		const c = enCours;
		if (!c) return null;
		try {
			if (c.rec.state !== 'inactive') c.rec.stop();
		} catch {
			/* déjà arrêté */
		}
		return c.fin;
	}

	/** Coupe tout et rend le micro au système. Une prise en cours est abandonnée. */
	function liberer() {
		const c = enCours;
		if (c) {
			c.fin.catch(() => {}); // abandon voulu : pas d'erreur non traitée
			arreter();
		}
		flux?.getTracks().forEach((t) => {
			try {
				t.stop();
			} catch {
				/* rien à faire */
			}
		});
		flux = null;
	}

	return {
		demarrer,
		arreter,
		liberer,
		microOuvert,
		get enregistre() {
			return !!enCours;
		}
	};
}
