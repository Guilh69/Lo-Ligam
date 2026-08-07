-- Lo Ligam — còlas de carta GENERIQUES (création de couches depuis l'admin)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-carta-schema.sql a déjà été exécuté.
--
-- CE QUE ÇA CHANGE (décision du 2026-08-07 : autonomie complète sur la carte,
-- en étendant notre système plutôt qu'en passant à uMap)
-- carta_colas devient un vrai registre de couches : chaque ligne dit son TYPE
-- (punts / zonas / linhas), sa THÉMATIQUE de regroupement dans le panèl, ses
-- propriétés graphiques (couleur, opacité, épaisseur, pointillé), le MODÈLE de
-- popup (avec les champs des données, ex. « {nom} — {descripcion} »), sa
-- visibilité par défaut, et — pour les zones/lignes — l'adresse de son fichier
-- GeoJSON (téléversé depuis l'admin dans le dossier « cartas »).
--
-- Les couches à comportement spécial (dialèctes, despartaments à 3 nivèls)
-- restent rendues par du code dédié ; tout le reste devient générique.

alter table public.carta_colas
add column if not exists tipe text not null default 'punts';

alter table public.carta_colas
add column if not exists tematica_oc text;

alter table public.carta_colas
add column if not exists tematica_fr text;

alter table public.carta_colas
add column if not exists pes_linha numeric not null default 1.5;

alter table public.carta_colas
add column if not exists linha_puntejada boolean not null default false;

alter table public.carta_colas
add column if not exists popup_plantilha text;

alter table public.carta_colas
add column if not exists geojson_url text;

alter table public.carta_colas
add column if not exists visibla boolean not null default false;

do $$
begin
	if not exists (
		select 1 from pg_constraint where conname = 'carta_colas_tipe_valid'
	) then
		alter table public.carta_colas
		add constraint carta_colas_tipe_valid check (tipe in ('punts', 'zonas', 'linhas'));
	end if;
end $$;

-- Qualifie les couches existantes.
update public.carta_colas set tipe = 'punts' where id in ('lieusInteres', 'librarias', 'limsi');

update public.carta_colas set tipe = 'zonas' where id in ('dialectes', 'departaments', 'provincias', 'regions');

update public.carta_colas set visibla = true where id in ('lieusInteres', 'librarias');

-- « regions » devient la première couche entièrement générique : son fichier,
-- son style et son popup sont décrits ici — plus aucune ligne de code dédiée.
update public.carta_colas
set
	geojson_url = '/data/regions.geojson',
	popup_plantilha = '{nom}',
	pes_linha = 1.3,
	linha_puntejada = true
where
	id = 'regions';

-- Thématiques de départ (modifiables dans l'admin).
update public.carta_colas set tematica_oc = 'Luòcs', tematica_fr = 'Lieux' where id in ('lieusInteres', 'librarias') and tematica_oc is null;

update public.carta_colas set tematica_oc = 'Lenga', tematica_fr = 'Langue' where id in ('dialectes', 'departaments', 'provincias', 'limsi') and tematica_oc is null;

update public.carta_colas set tematica_oc = 'Referéncia', tematica_fr = 'Référence' where id = 'regions' and tematica_oc is null;


-- LE DOSSIER DE FICHIERS pour les tracés téléversés (GeoJSON uniquement).
-- 5 Mo max : un tracé bien simplifié pèse quelques centaines de Ko ; le
-- plafond protège d'un export QGIS brut énorme (sobriété, quotas).
insert into
	storage.buckets (
		id,
		name,
		public,
		file_size_limit,
		allowed_mime_types
	)
values
	(
		'cartas',
		'cartas',
		true,
		5242880,
		array['application/geo+json', 'application/json']
	)
on conflict (id) do
update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

-- Si ces quatre commandes échouent avec « must be owner of table objects »,
-- passe par Storage → cartas → Policies et recopie les mêmes règles à la main.
drop policy if exists "cartas : lectura publica" on storage.objects;

create policy "cartas : lectura publica" on storage.objects for
select
	using (bucket_id = 'cartas');

drop policy if exists "cartas : mandar (admin)" on storage.objects;

create policy "cartas : mandar (admin)" on storage.objects for insert
with
	check (
		bucket_id = 'cartas'
		and public.is_admin ()
	);

drop policy if exists "cartas : remplaçar (admin)" on storage.objects;

create policy "cartas : remplaçar (admin)" on storage.objects
for update
	using (
		bucket_id = 'cartas'
		and public.is_admin ()
	)
with
	check (
		bucket_id = 'cartas'
		and public.is_admin ()
	);

drop policy if exists "cartas : suprimir (admin)" on storage.objects;

create policy "cartas : suprimir (admin)" on storage.objects for delete using (
	bucket_id = 'cartas'
	and public.is_admin ()
);


-- GARDE-FOU : RLS toujours actif, toujours 4 politiques sur carta_colas.
do $$
declare
	n int;
begin
	if not exists (
		select 1
		from pg_class c
		join pg_namespace ns on ns.oid = c.relnamespace
		where ns.nspname = 'public' and c.relname = 'carta_colas' and c.relrowsecurity
	) then
		raise exception 'SEGURETAT : public.carta_colas es pas protegida per RLS. Tot es anullat.';
	end if;

	select count(*) into n
	from pg_policies where schemaname = 'public' and tablename = 'carta_colas';
	if n <> 4 then
		raise exception
			'SEGURETAT : public.carta_colas deuriá aver 4 politicas, ne a %. Tot es anullat.', n;
	end if;

	raise notice 'Registre generic prèst.';
end $$;

select
	ordre,
	id,
	tipe,
	tematica_oc,
	visibla,
	disponible
from
	public.carta_colas
order by
	ordre;
