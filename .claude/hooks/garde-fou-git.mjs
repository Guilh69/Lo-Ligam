// Garde-fou Git pour Claude (crochet PreToolUse, outils Bash et PowerShell).
// Applique pour de bon deux règles de CLAUDE.md :
//   - ne committer que les fichiers qu'on a soi-même modifiés : pas de
//     « git add -A / . / -u », pas de « git commit -a » ;
//   - ne pas contourner .githooks/pre-commit (fichiers > 1 Mo) : pas de
//     --no-verify, pas de « commit -n », pas de changement de core.hooksPath.
// Garde-fou contre l'oubli, pas une forteresse : une commande cachée dans
// une sous-commande entre guillemets passe. Code de sortie 2 = commande
// bloquée, le message part vers Claude.

const MESSAGES = {
	add:
		'Garde-fou Lo Ligam : « git add -A », « git add . », « git add -u » et « --all » sont interdits (CLAUDE.md). ' +
		'Relire git status, puis ajouter les fichiers par leur nom, uniquement ceux modifiés dans cette conversation.',
	commitA:
		'Garde-fou Lo Ligam : « git commit -a » indexe toutes les modifications, y compris celles des autres conversations. ' +
		'Ajouter les fichiers par leur nom (git add <fichier>), puis committer sans -a.',
	noVerify:
		'Garde-fou Lo Ligam : --no-verify (ou « commit -n ») contourne .githooks/pre-commit, qui refuse les fichiers de plus de 1 Mo. ' +
		'Interdit : le gros fichier reste sur le disque (cahier §11, 2026-10-12).',
	hooksPath:
		'Garde-fou Lo Ligam : changer core.hooksPath désactive .githooks/pre-commit. Seule valeur permise : .githooks.'
};

// Retire les textes longs où un « -a » ne veut rien dire : corps des heredocs
// bash (<<'EOF' … EOF) et here-strings PowerShell (@' … '@).
function sansTextesLongs(cmd) {
	return cmd
		.replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, ' ')
		.replace(/@(['"])\r?\n[\s\S]*?\r?\n\1@/g, ' Q ');
}

// Remplace chaque texte entre guillemets par un jeton neutre : un message
// de commit qui contient « -a » ou « git add . » ne doit rien déclencher.
function sansCitations(cmd) {
	let sortie = '';
	let dans = null;
	for (let i = 0; i < cmd.length; i++) {
		const c = cmd[i];
		if (dans) {
			if (c === '\\' && dans === '"') i++;
			else if (c === dans) {
				dans = null;
				sortie += 'Q';
			}
		} else if (c === '"' || c === "'") dans = c;
		else sortie += c;
	}
	return sortie;
}

const PREFIXES = new Set(['&', 'env', 'command', 'exec', 'time', 'nohup', 'sudo']);

// Renvoie le motif de blocage, ou null si la commande passe.
function verifier(cmd) {
	const net = sansCitations(sansTextesLongs(cmd));
	for (const segment of net.split(/&&|\|\||[;|\n&]/)) {
		const jetons = segment.replace(/[(){}]/g, ' ').trim().split(/\s+/).filter(Boolean);
		let i = 0;
		while (i < jetons.length && (PREFIXES.has(jetons[i]) || /^[A-Za-z_]\w*=/.test(jetons[i]))) i++;
		const nom = (jetons[i] || '').split(/[\\/]/).pop().toLowerCase();
		if (nom !== 'git' && nom !== 'git.exe') continue;
		const motif = verifierGit(jetons.slice(i + 1));
		if (motif) return motif;
	}
	return null;
}

function verifierGit(args) {
	if (args.includes('--no-verify')) return MESSAGES.noVerify;

	// core.hooksPath : lecture permise, seule écriture permise = .githooks
	const k = args.findIndex((a) => /^core\.hookspath(=|$)/i.test(a));
	if (k >= 0) {
		const egal = args[k].indexOf('=');
		const valeur = egal >= 0 ? args[k].slice(egal + 1) : args[k + 1];
		const lecture = valeur === undefined || args.includes('--get');
		if (args.includes('--unset') || (!lecture && valeur !== '.githooks')) return MESSAGES.hooksPath;
	}

	// Sauter les options globales (-C <dossier>, -c <clé=valeur>…) jusqu'à la sous-commande
	let i = 0;
	while (i < args.length && args[i].startsWith('-')) i += args[i] === '-C' || args[i] === '-c' ? 2 : 1;
	const sousCommande = args[i];
	const reste = args.slice(i + 1);
	// Options courtes groupées : « -am » contient -a
	const groupe = (lettres) => reste.some((a) => /^-[A-Za-z]+$/.test(a) && [...lettres].some((l) => a.includes(l)));

	if (sousCommande === 'add') {
		const tout = ['--all', '--update', '.', './', ':/', '*'];
		if (reste.some((a) => tout.includes(a)) || groupe('Au')) return MESSAGES.add;
	}
	if (sousCommande === 'commit') {
		if (reste.includes('--all') || groupe('a')) return MESSAGES.commitA;
		if (groupe('n')) return MESSAGES.noVerify;
	}
	return null;
}

// L'appel d'outil arrive en JSON sur l'entrée standard.
let entree = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (entree += c));
process.stdin.on('end', () => {
	let cmd = '';
	try {
		cmd = JSON.parse(entree).tool_input?.command ?? '';
	} catch {
		process.exit(0);
	}
	const motif = verifier(String(cmd));
	if (motif) {
		process.stderr.write(motif + '\n');
		process.exit(2);
	}
});
