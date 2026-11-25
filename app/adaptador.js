// L'adaptateur Node de SvelteKit, avec deux retouches faites pendant la
// construction (SvelteKit 3, 2026-11-25). adapter-node 6 relève la liste des
// fichiers servis au moment où il les copie : un fichier ajouté ou retiré
// après coup n'est plus vu. Ces deux retouches se faisaient avant par deux
// scripts lancés après « vite build » (compressar-geojson.mjs et
// levar-esbos.mjs) ; elles se font maintenant au bon moment, ici.
//
// 1. Les pages d'esquisse et de maquette de static/ (esbos-*.html,
//    maqueta-*.html) restent consultables en local (npm run dev) mais ne
//    partent pas en ligne : elles étaient publiées sans les en-têtes de
//    sécurité, et esbos-nuech chargeait un script d'unpkg.com sur la même
//    adresse que les sessions des comptes (audit du 2026-10-08).
// 2. Les .geojson (dialectes, départements, toponymes, Calandretas) sont
//    compressés comme les .js et les .css : SvelteKit ne le fait pas de
//    lui-même, et ils partaient en clair, de 3 à 7 fois plus lourds
//    (revue du 2026-10-08, sobriété).
//
// Seules des fonctions publiques de l'adaptateur sont utilisées
// (writeClient, compress), pas ses rouages internes.
import adapterNode from '@sveltejs/adapter-node';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ESQUISSES = /^(esbos-.*|maqueta-.*)\.html$/;

/** @param {string} dossier @param {string} [rel] @returns {string[]} */
function geojson(dossier, rel = '') {
	return fs.readdirSync(path.join(dossier, rel), { withFileTypes: true }).flatMap((e) => {
		const r = rel ? `${rel}/${e.name}` : e.name;
		if (e.isDirectory()) return geojson(dossier, r);
		return e.name.endsWith('.geojson') ? [r] : [];
	});
}

/** @returns {import('@sveltejs/kit').Adapter} */
export default function adaptador() {
	const base = adapterNode();
	return {
		...base,
		async adapt(builder) {
			const copier = builder.writeClient.bind(builder);
			const compresser = builder.compress.bind(builder);
			/** @type {string | null} */
			let client = null;

			builder.writeClient = (dest) => {
				client = dest;
				/** @type {string[]} */
				const retirees = [];
				const fichiers = copier(dest).filter((f) => {
					if (!ESQUISSES.test(f)) return true;
					fs.rmSync(path.join(dest, f));
					retirees.push(f);
					return false;
				});
				builder.log.minor(`Esquisses retirées de la version en ligne : ${retirees.join(', ') || 'aucune'}`);
				return fichiers;
			};

			builder.compress = async (dossier) => {
				const faits = await compresser(dossier);
				if (dossier !== client || !fs.existsSync(dossier)) return faits;
				const geo = geojson(dossier);
				let avant = 0;
				let apres = 0;
				for (const f of geo) {
					const abs = path.join(dossier, f);
					const d = fs.readFileSync(abs);
					const br = zlib.brotliCompressSync(d, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
					fs.writeFileSync(`${abs}.br`, br);
					fs.writeFileSync(`${abs}.gz`, zlib.gzipSync(d, { level: 9 }));
					avant += d.length;
					apres += br.length;
				}
				builder.log.minor(`geojson compressés : ${geo.length} fichiers, ${Math.round(avant / 1024)} Ko → ${Math.round(apres / 1024)} Ko (brotli)`);
				// adapter-node sert la version .br ou .gz de chaque fichier de cette liste
				return [...faits, ...geo];
			};

			return base.adapt(builder);
		}
	};
}
