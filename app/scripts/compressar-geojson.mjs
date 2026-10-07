// Aprèp « vite build » : l'adaptador Node compressa los .js, .json, .css…
// mas pas los .geojson (dialèctes, despartaments, toponims, Calandretas) ;
// los partián en clar, de 3 a 7 còps mai pesucs (revision del 2026-10-08,
// sobrietat). Aqueste escript ne fa las versions brotli e gzip, que lo
// servidor (sirv) manda de se quand lo navegador las accèpta.
// Usatge : apelat per « npm run build ».
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const RAIÇ = path.resolve('build/client');
let n = 0,
	abans = 0,
	aprèp = 0;
function percórrer(dir) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) percórrer(p);
		else if (e.name.endsWith('.geojson')) {
			const d = fs.readFileSync(p);
			const br = zlib.brotliCompressSync(d, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
			fs.writeFileSync(p + '.br', br);
			fs.writeFileSync(p + '.gz', zlib.gzipSync(d, { level: 9 }));
			n++;
			abans += d.length;
			aprèp += br.length;
		}
	}
}
if (fs.existsSync(RAIÇ)) {
	percórrer(RAIÇ);
	console.log(`geojson compressats : ${n} fichièrs, ${Math.round(abans / 1024)} Ko → ${Math.round(aprèp / 1024)} Ko (brotli)`);
}
