// Lo Ligam — fabrique le SQL de migration des fiches vers la base
//
//   cd app && npm run generar:migracion
//
// Lit app/src/lib/data/fichas.js — la source actuelle, celle que le site
// affiche aujourd'hui — et écrit supabase-migracion-fichas.sql à la racine.
// Rien n'est recopié à la main : le SQL produit correspond exactement à ce qui
// est en ligne, y compris les accents et les apostrophes.
//
// Ce script N'ÉCRIT PAS dans la base. Il fabrique un fichier que Romain colle
// dans Supabase. C'est volontaire : une écriture massive doit rester un geste
// conscient, pas un effet de bord d'un script.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { categories, fichas } from '../src/lib/data/fichas.js';

const racina = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sortida = join(racina, 'supabase-migracion-fichas.sql');

// Échappement SQL : seule l'apostrophe droite compte. Les apostrophes
// typographiques (’) et les accents passent tels quels en UTF-8.
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

// ── Contrôle d'intégrité AVANT de produire quoi que ce soit ─────────────────
// Une fiche qui pointerait vers un thème inexistant ferait échouer la clé
// étrangère au milieu de la migration. Mieux vaut le savoir maintenant.
const idsTemas = new Set(categories.map((c) => c.id));
const orfanas = fichas.filter((f) => !idsTemas.has(f.cat));
if (orfanas.length) {
	console.error(`\n  ARRÊT : ${orfanas.length} fiche(s) pointent vers un thème inconnu :`);
	for (const f of orfanas) console.error(`    · ${f.id} → thème « ${f.cat} »`);
	process.exitCode = 1;
} else {
	const dobles = fichas.map((f) => f.id).filter((id, i, t) => t.indexOf(id) !== i);
	if (dobles.length) {
		console.error(`\n  ARRÊT : identifiants en double : ${dobles.join(', ')}`);
		process.exitCode = 1;
	} else {
		escriure();
	}
}

function escriure() {
	// L'ordre d'affichage vient de la position dans le fichier : c'est le
	// classement que Romain a établi, on le préserve tel quel.
	const comptador = new Map();
	const linhasFichas = fichas.map((f) => {
		const n = comptador.get(f.cat) ?? 0;
		comptador.set(f.cat, n + 1);
		return `\t(${q(f.id)}, ${q(f.cat)}, ${q(f.titre)}, ${q(f.mini)}, ${q(f.grand)}, ${n})`;
	});

	const linhasTemas = categories.map(
		(c, i) => `\t(${q(c.id)}, ${q(c.oc)}, ${q(c.fr)}, ${q(c.color)}, ${i})`
	);

	const sql = `-- Lo Ligam — migration des fiches vers la base
-- =============================================================================
-- FICHIER ENGENDRÉ AUTOMATIQUEMENT — ne pas le modifier à la main.
-- Produit par app/scripts/generar-migracion.mjs à partir de
-- app/src/lib/data/fichas.js le ${new Date().toISOString().slice(0, 10)}.
--
-- À coller dans Supabase : SQL Editor → New query → Run.
-- Le script est REJOUABLE : le relancer met simplement les données à jour.
--
-- Contenu : ${categories.length} thèmes et ${fichas.length} fiches.

-- 1) Nettoyage des lignes d'essai laissées par le contrôle de sécurité.
--    Le « \\_ » est échappé : dans un LIKE, un « _ » seul signifie
--    « n'importe quel caractère ».
delete from public.fichas where id like '\\_essai%' or id like '\\_ensag%';

delete from public.temas where id like '\\_essai%' or id like '\\_ensag%';


-- 2) Les ${categories.length} thèmes.
insert into public.temas (id, oc, fr, color, ordre) values
${linhasTemas.join(',\n')}
on conflict (id) do update set
	oc = excluded.oc,
	fr = excluded.fr,
	color = excluded.color,
	ordre = excluded.ordre;


-- 3) Les ${fichas.length} fiches.
--    Les adresses pointent vers app/static/ : les images restent servies par
--    le site, elles ne passent pas dans Supabase Storage (décision du
--    2026-08-03, §11). Les fiches ajoutées plus tard depuis l'espace
--    d'administration porteront, elles, une adresse Storage.
insert into public.fichas (id, tema_id, titre, mini_url, grand_url, ordre) values
${linhasFichas.join(',\n')}
on conflict (id) do update set
	tema_id = excluded.tema_id,
	titre = excluded.titre,
	mini_url = excluded.mini_url,
	grand_url = excluded.grand_url,
	ordre = excluded.ordre;


-- 4) GARDE-FOU : le compte doit tomber juste, sinon tout est annulé.
do $$
declare
	nt int;
	nf int;
begin
	select count(*) into nt from public.temas;
	select count(*) into nf from public.fichas;

	if nt <> ${categories.length} then
		raise exception 'MIGRACION : % temas en basa, ${categories.length} esperats. Tot es anullat.', nt;
	end if;

	if nf <> ${fichas.length} then
		raise exception 'MIGRACION : % fichas en basa, ${fichas.length} esperadas. Tot es anullat.', nf;
	end if;

	raise notice 'Migracion capitada : % temas, % fichas.', nt, nf;
end $$;

-- 5) Contrôle visible : les 8 premières fiches telles qu'elles sont en base.
select f.ordre, f.id, f.titre, t.oc as tema
from public.fichas f
join public.temas t on t.id = f.tema_id
order by t.ordre, f.ordre
limit 8;
`;

	writeFileSync(sortida, sql, 'utf8');

	console.log(`\n  Écrit : supabase-migracion-fichas.sql`);
	console.log(`  ${categories.length} thèmes, ${fichas.length} fiches.`);

	// Répartition, pour vérifier d'un coup d'œil qu'aucun thème n'est vide.
	const voids = categories.filter((c) => !fichas.some((f) => f.cat === c.id));
	if (voids.length) {
		console.log(`\n  Thèmes sans aucune fiche (${voids.length}) :`);
		for (const c of voids) console.log(`    · ${c.id}`);
	} else {
		console.log(`  Chaque thème a au moins une fiche.`);
	}
	console.log('');
}
