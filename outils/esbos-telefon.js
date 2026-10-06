// Prépare la copie de l'esbòs de nuèch pour la page privée claude.ai (lecture sur
// téléphone, https://claude.ai/artifact/G5uEmXxrZLb2dpE8jpKw5q).
//
// Usage :  node outils/esbos-telefon.js <dossier de sortie>
// Puis publier <dossier>/esbos-de-nuech.html avec l'outil Artifact, en passant
// l'URL ci-dessus (même lien) et les fichiers : fonts/limelight.woff2,
// fonts/luciole-regular.woff2, fonts/luciole-bold.woff2,
// fonts/cormorant-italic-latin.woff2, acuelh/romain.webp, acuelh/paisatge.jpg,
// acuelh/erau.webp, acuelh/relief.png (sources dans app/static/).
//
// Ce que fait la copie : enlève l'enveloppe html/head/body (ajoutée à la
// publication), rend relatives les adresses des polices et des images, déclare
// le fond sombre et décale le bandeau sous l'encoche des téléphones.
const fs = require('fs');
const path = require('path');

const racina = path.resolve(__dirname, '..');
const src = path.join(racina, 'app/static/esbos-nuech.html');
const dossier = process.argv[2];
if (!dossier) {
	console.error('Indiquez un dossier de sortie.');
	process.exit(1);
}
fs.mkdirSync(dossier, { recursive: true });
const dest = path.join(dossier, 'esbos-de-nuech.html');

let s = fs.readFileSync(src, 'utf8');
s = s
	.replace(/^<!doctype html>\s*/i, '')
	.replace(/<html[^>]*>\s*/, '')
	.replace(/<\/html>\s*$/, '')
	.replace(/<head>\s*/, '')
	.replace(/<\/head>\s*/, '')
	.replace(/<body>\s*/, '')
	.replace(/<\/body>\s*/, '');
s = s
	.replace(/<meta charset="UTF-8" \/>\s*/, '')
	.replace(/<meta name="viewport"[^>]*>\s*/, '')
	.replace(/<meta name="robots"[^>]*>\s*/, '');
s = s.replace(/<title>[^<]*<\/title>/, '<title>Esbòs de nuèch</title>');
s = s.replace(/(["'])\/(acuelh|fonts)\//g, '$1$2/');
s = s.replace(
	'</style>',
	"/* Version telefon (artefacte claude.ai) : fons sorne declarat, capçal fòra de l'encòca */\n:root { color-scheme: dark; }\nheader { padding-top: calc(1.3rem + env(safe-area-inset-top, 0px)); }\n</style>"
);
fs.writeFileSync(dest, s);
const restes = (s.match(/["']\/(acuelh|fonts)\//g) || []).length;
console.log(`ok : ${dest} (${s.length} caractères, adresses absolues restantes : ${restes})`);
