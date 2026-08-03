// Lo Ligam — préparation des images avant envoi.
//
// SOBRIÉTÉ : un export Canva pèse souvent plusieurs mégaoctets. On ne l'envoie
// JAMAIS tel quel. Le navigateur le redimensionne et le convertit en WebP avant
// le moindre octet réseau — donc moins de stockage, moins de bande passante,
// des pages plus légères, et l'envoi lui-même est bien plus rapide.
//
// Deux tailles, comme les 204 fiches historiques : la vignette pour la grille,
// la grande pour la consultation. Ce sont des fiches de vocabulaire ÉCRIT,
// illisibles en petit — d'où la seconde taille, chargée seulement à l'ouverture.

export const LARGOR_MINI = 360;
export const LARGOR_GRAND = 860;

// Qualité WebP : 0.82 est le point où l'on ne voit plus la différence à l'œil
// sur ce type d'illustration, tout en divisant le poids par plusieurs.
const QUALITAT = 0.82;

/**
 * Redimensionne une image et la convertit en WebP, dans le navigateur.
 * N'agrandit jamais une image plus petite que la largeur demandée.
 */
export async function redimensionar(fichier, largor) {
	const bitmap = await createImageBitmap(fichier);
	try {
		const escala = Math.min(1, largor / bitmap.width);
		const l = Math.max(1, Math.round(bitmap.width * escala));
		const h = Math.max(1, Math.round(bitmap.height * escala));

		const tela = document.createElement('canvas');
		tela.width = l;
		tela.height = h;
		const ctx = tela.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(bitmap, 0, 0, l, h);

		return await new Promise((resolve, reject) => {
			tela.toBlob(
				(b) => (b ? resolve(b) : reject(new Error('conversion en WebP impossibla'))),
				'image/webp',
				QUALITAT
			);
		});
	} finally {
		bitmap.close();
	}
}

/** Transforme un titre en identifiant : « Lo solelh » → « lo-solelh ». */
export function slug(text) {
	return String(text)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Une adresse pointe-t-elle vers Supabase Storage, ou vers les images
 * historiques servies par le site ? On ne tente de supprimer un fichier que
 * dans le premier cas — les 204 fiches d'origine vivent dans app/static/ et ne
 * sont pas dans la base (décision du 2026-08-03, §11).
 */
export function esEnStorage(url) {
	return typeof url === 'string' && url.includes('/storage/v1/object/public/designs/');
}

/** Retrouve le chemin dans le dossier à partir de l'adresse publique. */
export function caminStorage(url) {
	const tròç = '/storage/v1/object/public/designs/';
	const i = String(url).indexOf(tròç);
	return i === -1 ? null : decodeURIComponent(String(url).slice(i + tròç.length));
}

/** Poids lisible : 1234567 → « 1,2 Mo ». */
export function pes(octets) {
	if (octets < 1024) return `${octets} o`;
	if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} ko`;
	return `${(octets / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
}
