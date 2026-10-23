// Lo Ligam — fabrique supabase/supabase-pagina-elements.sql (édition sur
// place, 2026-10-24) : les tables, leurs politiques, les fonctions de
// publication et le stockage des images, puis la semence prise dans
// src/lib/data/elements-filet.json (« on conflict do nothing » : rejouer le
// fichier n'écrase jamais ce que Romain a changé dans l'éditeur).
//
//   cd app && node scripts/elements-sql.mjs
//
// Ce script N'ÉCRIT PAS dans la base : Romain colle le fichier dans
// Supabase (SQL Editor → New query → Run).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racina = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const filet = JSON.parse(readFileSync(join(racina, 'app', 'src', 'lib', 'data', 'elements-filet.json'), 'utf8'));
const sortida = join(racina, 'supabase', 'supabase-pagina-elements.sql');

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const j = (v) => (v == null ? 'null' : `${q(JSON.stringify(v))}::jsonb`);

const linhas = [];
for (const [pagina, rows] of Object.entries(filet)) {
	if (pagina.startsWith('_')) continue;
	for (const r of rows)
		linhas.push(
			`\t(${q(r.clau)}, ${q(pagina)}, ${q(r.tipe)}, ${q(r.lista ?? null)}, ${r.ordre ?? 0}, ${q(r.oc ?? null)}, ${q(r.fr ?? null)}, ${q(r.ligam ?? null)}, ${j(r.imatge ?? null)}, ${r.visible === false ? 'false' : 'true'})`
		);
}

const sql = `-- Lo Ligam — édition sur place : les éléments modifiables des pages
-- =============================================================================
-- Fabriqué par app/scripts/elements-sql.mjs le ${new Date().toISOString().slice(0, 10)} ; ne pas modifier à la main.
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable sans risque :
-- la semence ne touche pas aux lignes déjà présentes.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin(),
-- public.toca_updated_at()).
--
-- Un élément = une ligne par état : 'publicat' (ce que tout le monde voit) et
-- 'brolhon' (ce que l'administrateur prépare). publicar_pagina() fond les
-- brouillons dans le publié ; les publications précédentes sont gardées
-- (pagina_publicacions) pour pouvoir y revenir.

create table if not exists public.pagina_elements (
	clau text not null,
	estat text not null default 'publicat' check (estat in ('publicat', 'brolhon')),
	pagina text not null,
	tipe text not null check (tipe in ('text', 'ligam', 'imatge', 'bloc')),
	lista text,
	ordre integer not null default 0,
	oc text,
	fr text,
	-- une page du site (jamais « //ailleurs », adresse externe déguisée), une ancre, ou https
	ligam text check (ligam is null or ligam ~ '^(/([^/[:space:]][^[:space:]]*)?|#[^[:space:]]+|https://[^[:space:]]+)$'),
	imatge jsonb check (imatge is null or imatge->>'url' ~ '^(/[^/]|https://|blob:)'),
	estil jsonb not null default '{}'::jsonb,
	moviment jsonb not null default '{}'::jsonb,
	visible boolean not null default true,
	suprimit boolean not null default false,
	updated_at timestamptz not null default now(),
	primary key (clau, estat)
);
create index if not exists pagina_elements_pagina on public.pagina_elements (pagina, estat);

alter table public.pagina_elements enable row level security;

drop trigger if exists pagina_elements_updated_at on public.pagina_elements;
create trigger pagina_elements_updated_at before update on public.pagina_elements
	for each row execute function public.toca_updated_at ();

-- Lecture : le publié pour tout le monde, le brouillon pour l'administrateur
drop policy if exists "pagina_elements : lectura" on public.pagina_elements;
create policy "pagina_elements : lectura" on public.pagina_elements for select
	using (estat = 'publicat' or public.is_admin ());
drop policy if exists "pagina_elements : apondre (admin)" on public.pagina_elements;
create policy "pagina_elements : apondre (admin)" on public.pagina_elements for insert
	with check (public.is_admin ());
drop policy if exists "pagina_elements : modificar (admin)" on public.pagina_elements;
create policy "pagina_elements : modificar (admin)" on public.pagina_elements for update
	using (public.is_admin ()) with check (public.is_admin ());
drop policy if exists "pagina_elements : suprimir (admin)" on public.pagina_elements;
create policy "pagina_elements : suprimir (admin)" on public.pagina_elements for delete
	using (public.is_admin ());

-- Les publications passées (photographie du publié avant chaque publication)
create table if not exists public.pagina_publicacions (
	id bigserial primary key,
	pagina text not null,
	creat timestamptz not null default now(),
	nòta text,
	fotografia jsonb not null
);
alter table public.pagina_publicacions enable row level security;
drop policy if exists "pagina_publicacions : admin" on public.pagina_publicacions;
create policy "pagina_publicacions : admin" on public.pagina_publicacions for all
	using (public.is_admin ()) with check (public.is_admin ());

-- Publier : les brouillons remplacent le publié (ou le retirent), la
-- photographie d'avant est gardée. Renvoie le nombre d'éléments publiés.
create or replace function public.publicar_pagina (p_pagina text) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.is_admin () then
		raise exception 'reservat a l''administrator';
	end if;
	insert into public.pagina_publicacions (pagina, fotografia)
	select p_pagina, coalesce(jsonb_agg(to_jsonb(e) - 'estat'), '[]'::jsonb)
	from public.pagina_elements e where e.pagina = p_pagina and e.estat = 'publicat';
	delete from public.pagina_elements p
	where p.pagina = p_pagina and p.estat = 'publicat'
		and exists (select 1 from public.pagina_elements b where b.clau = p.clau and b.estat = 'brolhon' and b.suprimit);
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select clau, 'publicat', pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, false
	from public.pagina_elements where pagina = p_pagina and estat = 'brolhon' and not suprimit
	on conflict (clau, estat) do update set
		tipe = excluded.tipe, lista = excluded.lista, ordre = excluded.ordre, oc = excluded.oc, fr = excluded.fr,
		ligam = excluded.ligam, imatge = excluded.imatge, estil = excluded.estil, moviment = excluded.moviment,
		visible = excluded.visible, suprimit = false;
	delete from public.pagina_elements where pagina = p_pagina and estat = 'brolhon';
	select count(*) into n from public.pagina_elements where pagina = p_pagina and estat = 'publicat';
	return n;
end $$;
revoke all on function public.publicar_pagina (text) from public;
grant execute on function public.publicar_pagina (text) to authenticated;

-- Revenir à une publication passée : elle est reposée en brouillon, à relire
-- puis à publier.
create or replace function public.restaurar_publicacion (p_id bigint) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	pub record;
	n integer;
begin
	if not public.is_admin () then
		raise exception 'reservat a l''administrator';
	end if;
	select * into pub from public.pagina_publicacions where id = p_id;
	if pub is null then
		raise exception 'publicacion desconeguda';
	end if;
	delete from public.pagina_elements where pagina = pub.pagina and estat = 'brolhon';
	-- ce qui existe aujourd'hui mais pas dans la photographie est marqué à retirer
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select e.clau, 'brolhon', e.pagina, e.tipe, e.lista, e.ordre, e.oc, e.fr, e.ligam, e.imatge, e.estil, e.moviment, e.visible, true
	from public.pagina_elements e
	where e.pagina = pub.pagina and e.estat = 'publicat'
		and not exists (select 1 from jsonb_array_elements(pub.fotografia) f where f->>'clau' = e.clau);
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select f->>'clau', 'brolhon', pub.pagina, f->>'tipe', f->>'lista', coalesce((f->>'ordre')::int, 0), f->>'oc', f->>'fr', f->>'ligam',
		nullif(f->'imatge', 'null'::jsonb), coalesce(nullif(f->'estil', 'null'::jsonb), '{}'::jsonb), coalesce(nullif(f->'moviment', 'null'::jsonb), '{}'::jsonb), coalesce((f->>'visible')::boolean, true), false
	from jsonb_array_elements(pub.fotografia) f;
	select count(*) into n from public.pagina_elements where pagina = pub.pagina and estat = 'brolhon';
	return n;
end $$;
revoke all on function public.restaurar_publicacion (bigint) from public;
grant execute on function public.restaurar_publicacion (bigint) to authenticated;

-- Les images des pages : dossier public, 2 Mo au plus, webp / jpeg / png
-- (jamais de SVG : il peut porter du code).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('paginas', 'paginas', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "paginas : lectura publica" on storage.objects;
create policy "paginas : lectura publica" on storage.objects for select using (bucket_id = 'paginas');
drop policy if exists "paginas : mandar (admin)" on storage.objects;
create policy "paginas : mandar (admin)" on storage.objects for insert with check (bucket_id = 'paginas' and public.is_admin ());
drop policy if exists "paginas : remplaçar (admin)" on storage.objects;
create policy "paginas : remplaçar (admin)" on storage.objects for update using (bucket_id = 'paginas' and public.is_admin ());
drop policy if exists "paginas : suprimir (admin)" on storage.objects;
create policy "paginas : suprimir (admin)" on storage.objects for delete using (bucket_id = 'paginas' and public.is_admin ());

-- La semence : les éléments tels que le site les affiche aujourd'hui
-- (${linhas.length} lignes). Jamais écrasés s'ils existent déjà.
insert into public.pagina_elements (clau, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, visible) values
${linhas.join(',\n')}
on conflict (clau, estat) do nothing;
`;

writeFileSync(sortida, sql);
console.log(`Écrit : supabase/supabase-pagina-elements.sql (${linhas.length} éléments de semence)`);
