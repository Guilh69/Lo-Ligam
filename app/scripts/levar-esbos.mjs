// Aprèp « vite build » : las paginas d'esbòs e de maqueta de static/
// (esbos-*.html, maqueta-*.html) demòran consultablas en local (npm run dev)
// mas son levadas de la version mesa en linha : èran publicadas sens los
// entèstas de seguretat, e esbos-nuech cargava un escript d'unpkg.com sus
// la meteissa adreça que las sessions dels comptes (auditòri del 2026-10-08).
// Usatge : apelat per « npm run build ».
import fs from 'fs';
import path from 'path';

const RAIÇ = path.resolve('build/client');
const levadas = [];
if (fs.existsSync(RAIÇ))
	for (const nom of fs.readdirSync(RAIÇ))
		if (/^(esbos-.*|maqueta-.*)\.html(\.br|\.gz)?$/.test(nom)) {
			fs.rmSync(path.join(RAIÇ, nom));
			levadas.push(nom);
		}
console.log(`esbòsses levats de la version en linha : ${levadas.filter((n) => n.endsWith('.html')).join(', ') || 'cap'}`);
