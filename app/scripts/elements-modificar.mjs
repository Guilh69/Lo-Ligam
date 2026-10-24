// Lo Ligam — Claude modifie un élément d'une page pendant une séance de
// travail avec Romain (2026-10-24 : « il n'y a pas de raison de t'interdire
// ça »). Dans la base (publié, et brouillon s'il y en a un) par la fonction
// limitée de supabase/supabase-acces-claude.sql, puis dans le filet de
// secours, pour que le code dise la même chose que la base.
// Clé dans app/.env (CLAUDE_EDICION_CLAU), jamais affichée.
//
//   cd app && node scripts/elements-modificar.mjs <clau> [--oc "…"] [--fr "…"]
//        [--ligam "/…"] [--visible true|false] [--nota "pourquoi"]
//
// Ensuite : node scripts/elements-sql.mjs (semence), build, commit.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const aquí = dirname(fileURLToPath(import.meta.url));
const envPath = join(aquí, '..', '.env');
if (!existsSync(envPath)) {
	console.error('Fichier app/.env introuvable.');
	process.exit(1);
}
const env = Object.fromEntries(
	readFileSync(envPath, 'utf8')
		.split(/\r?\n/)
		.filter((l) => l.includes('=') && !l.startsWith('#'))
		.map((l) => {
			const i = l.indexOf('=');
			return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
		})
);

const [clau, ...rèsta] = process.argv.slice(2);
const opcions = {};
for (let i = 0; i < rèsta.length; i += 2) {
	const nom = rèsta[i]?.replace(/^--/, '');
	if (!['oc', 'fr', 'ligam', 'visible', 'nota'].includes(nom) || rèsta[i + 1] === undefined) {
		console.error(`Option inconnue ou sans valeur : ${rèsta[i]}`);
		process.exit(1);
	}
	opcions[nom] = rèsta[i + 1];
}
if (!clau || !['oc', 'fr', 'ligam', 'visible'].some((k) => k in opcions)) {
	console.error('Usage : node scripts/elements-modificar.mjs <clau> [--oc "…"] [--fr "…"] [--ligam "/…"] [--visible true|false] [--nota "…"]');
	process.exit(1);
}
if ('visible' in opcions && !['true', 'false'].includes(opcions.visible)) {
	console.error('--visible attend true ou false.');
	process.exit(1);
}
const visible = 'visible' in opcions ? opcions.visible === 'true' : undefined;

// 1. Le filet : une ligne par élément, gardée dans sa forme
const camin = join(aquí, '..', 'src', 'lib', 'data', 'elements-filet.json');
const linhas = readFileSync(camin, 'utf8').split('\n');
const escriure = (e) =>
	e && typeof e === 'object' && !Array.isArray(e)
		? '{ ' + Object.entries(e).map(([k, v]) => `${JSON.stringify(k)}: ${escriure(v)}`).join(', ') + ' }'
		: JSON.stringify(e);
const i = linhas.findIndex((l) => l.includes(`"clau": ${JSON.stringify(clau)},`));
if (i < 0) {
	console.error(`Élément inconnu du filet : ${clau}`);
	process.exit(1);
}
const [, retrait, cors, virgula] = linhas[i].match(/^(\s*)(\{.*\})(,?)\s*$/) ?? [];
const element = JSON.parse(cors);
if (escriure(element) !== cors) {
	console.error('La ligne du filet n’a pas la forme attendue ; rien n’est modifié.');
	process.exit(1);
}

// 2. La base, si la page y est
let tocadas = 0;
const secret = env.CLAUDE_EDICION_CLAU;
if (!secret) {
	console.error('CLAUDE_EDICION_CLAU absente de app/.env : la base ne sera pas modifiée.');
	process.exit(1);
}
const r = await fetch(`${env.PUBLIC_SUPABASE_URL}/rest/v1/rpc/claude_modificar_element`, {
	method: 'POST',
	headers: {
		apikey: env.PUBLIC_SUPABASE_ANON_KEY,
		Authorization: `Bearer ${env.PUBLIC_SUPABASE_ANON_KEY}`,
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		p_clau_secreta: secret,
		p_element: clau,
		p_oc: opcions.oc ?? null,
		p_fr: opcions.fr ?? null,
		p_ligam: opcions.ligam ?? null,
		p_visible: visible ?? null,
		p_nota: opcions.nota ?? null
	})
});
if (!r.ok) {
	console.error('La base refuse :', r.status, (await r.text()).slice(0, 300));
	console.error('(Le SQL supabase/supabase-acces-claude.sql a-t-il été collé dans Supabase ?)');
	// (pas de process.exit après un fetch : Node plante à la fermeture sous Windows)
	process.exitCode = 1;
} else {
	tocadas = await r.json();

	for (const k of ['oc', 'fr', 'ligam']) if (k in opcions) element[k] = opcions[k];
	if (visible === true) delete element.visible;
	else if (visible === false) element.visible = false;
	linhas[i] = retrait + escriure(element) + virgula;
	writeFileSync(camin, linhas.join('\n'));

	console.log(
		tocadas
			? `Modifié dans la base (${tocadas} ligne(s) : publié${tocadas > 1 ? ' et brouillon' : ''}) et dans le filet : ${clau}`
			: `Pas dans la base (page servie par le filet) : modifié dans le filet seulement : ${clau}`
	);
}
