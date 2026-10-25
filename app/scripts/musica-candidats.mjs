// Espace musique (Romain, 2026-10-25, option A : « liste préparée, tu tries ») :
// les artistes qui ont sorti des disques chantés en occitan d'après MusicBrainz
// (base libre, langue « oci »), gardés seulement s'ils sont sur Deezer, avec
// leur dernier album. Résultat : src/lib/data/musica-candidats.json, que
// Romain trie ensuite. On ne garde que des identifiants, des noms et des
// adresses : les données vivantes (photo, morceaux) sont relues chez Deezer.
//
//   cd app && node scripts/musica-candidats.mjs
import { writeFileSync } from 'node:fs';

const UA = 'LoLigam/1.0 (https://loligam.eu)';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const net = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

async function json(u, essais = 5) {
	for (let k = 0; k < essais; k++) {
		const r = await fetch(u, { headers: { 'User-Agent': UA } }).catch(() => null);
		const d = r?.ok ? await r.json().catch(() => null) : null;
		if (d && !d.error) return d;
		await dormir(2500 * (k + 1)); // MusicBrainz « busy », ou quota de Deezer
	}
	return null;
}

// 1. MusicBrainz : les sorties en occitan et leurs artistes
const noms = new Map();
for (let off = 0; ; off += 100) {
	const d = await json(`https://musicbrainz.org/ws/2/release?query=lang:oci&fmt=json&limit=100&offset=${off}`);
	if (!d) break;
	for (const r of d.releases ?? [])
		for (const c of r['artist-credit'] ?? []) {
			const n = c.artist?.name ?? c.name;
			if (!n || /^various artists$/i.test(n)) continue;
			const ja = noms.get(net(n));
			// un titre en occitan, pour reconnaître le bon artiste au moment du tri
			noms.set(net(n), { nom: n, sortidas: (ja?.sortidas ?? 0) + 1, exemple: ja?.exemple ?? { titol: r.title, annada: r.date?.slice(0, 4) ?? '' } });
		}
	console.log(`MusicBrainz : ${Math.min(off + 100, d.count)} / ${d.count} sorties`);
	if (off + 100 >= d.count) break;
	await dormir(1500);
}
console.log(`${noms.size} artistes distincts`);

// 2. Deezer : le même nom exactement, puis son dernier album
const candidats = [];
for (const [clau, { nom, sortidas, exemple }] of noms) {
	const s = await json(`https://api.deezer.com/search/artist?q=${encodeURIComponent(nom)}&limit=5`);
	const a = s?.data?.find((x) => net(x.name) === clau);
	await dormir(150);
	if (!a) continue;
	const al = await json(`https://api.deezer.com/artist/${a.id}/albums?limit=100`);
	await dormir(150);
	// le dernier vrai album d'abord (Romain, 2026-10-25), sinon la dernière sortie (single, EP)
	const totas = (al?.data ?? []).filter((x) => x.release_date).sort((x, y) => y.release_date.localeCompare(x.release_date));
	const darrièr = totas.find((x) => x.record_type === 'album') ?? totas[0];
	if (!darrièr) continue;
	candidats.push({
		id: a.id,
		nom: a.name,
		imatge: a.picture_big,
		sortidasOc: sortidas,
		exempleOc: exemple,
		fans: a.nb_fan ?? 0,
		album: { id: darrièr.id, titol: darrièr.title, data: darrièr.release_date, cobèrta: darrièr.cover_medium, tipe: darrièr.record_type }
	});
	process.stdout.write('.');
}
candidats.sort((x, y) => x.nom.localeCompare(y.nom, 'fr'));
writeFileSync(new URL('../src/lib/data/musica-candidats.json', import.meta.url), JSON.stringify(candidats, null, '\t') + '\n');
console.log(`\n${candidats.length} artistes trouvés sur Deezer → src/lib/data/musica-candidats.json`);
