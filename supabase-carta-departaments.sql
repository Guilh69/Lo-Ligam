-- Lo Ligam — còla « Despartaments occitans » (3 nivèls)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-carta-schema.sql a déjà été exécuté.
--
-- LES TROIS NIVEAUX (définis par Romain le 2026-08-06)
--   1 = l'occitan est la seule langue régionale du département
--   2 = l'occitan y est langue régionale en partie (autre langue présente,
--       ou frange seulement : basque, catalan, saintongeais, francoprovençal…)
--   3 = présence ancienne attestée de l'occitan, disparue bien avant la
--       diglossie moderne (Poitou, Saintonge…)
-- Un département absent de la table = hors de l'espace occitan, pas affiché.
--
-- La classification proposée ici est un POINT DE DÉPART : chaque cas
-- discutable porte une nòta, et tout se corrige depuis /admin/carta/departaments
-- (changer le niveau = un menu déroulant). Contours affichés : fichier du site
-- (app/static/data/departements.geojson, france-geojson / Etalab).

create table if not exists public.carta_departaments (
	code text primary key,
	nom text not null,
	nivèl int not null,
	nòta text,
	updated_at timestamptz not null default now(),
	constraint carta_departaments_nivel_valid check (nivèl between 1 and 3)
);

alter table public.carta_departaments enable row level security;

drop trigger if exists carta_departaments_updated_at on public.carta_departaments;

create trigger carta_departaments_updated_at before
update on public.carta_departaments for each row
execute function public.toca_updated_at ();

drop policy if exists "carta_departaments : lectura publica" on public.carta_departaments;

create policy "carta_departaments : lectura publica" on public.carta_departaments for
select
	using (true);

drop policy if exists "carta_departaments : apondre (admin)" on public.carta_departaments;

create policy "carta_departaments : apondre (admin)" on public.carta_departaments for insert
with
	check (public.is_admin ());

drop policy if exists "carta_departaments : modificar (admin)" on public.carta_departaments;

create policy "carta_departaments : modificar (admin)" on public.carta_departaments
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "carta_departaments : suprimir (admin)" on public.carta_departaments;

create policy "carta_departaments : suprimir (admin)" on public.carta_departaments for delete using (public.is_admin ());

-- La còla dans le panèl. Couleur terracotta ; l'opacité par nivèl est gérée
-- par le code (fort/mejan/leugièr), la colonne opacitat sert de base.
insert into
	public.carta_colas (
		id,
		label_oc,
		label_fr,
		color,
		opacitat,
		disponible,
		ordre
	)
values
	(
		'departaments',
		'Despartaments occitans',
		'Départements occitans',
		'#c8562e',
		0.45,
		true,
		4
	)
on conflict (id) do nothing;

update public.carta_colas set ordre = 5 where id = 'provincias' and ordre = 4;
update public.carta_colas set ordre = 6 where id = 'limsi' and ordre = 5;

-- CLASSIFICATION PROPOSÉE — à réviser dans l'admin.
insert into
	public.carta_departaments (code, nom, nivèl, nòta)
values
	-- Nivèl 1 : occitan seule langue régionale
	('04', 'Alpes-de-Haute-Provence', 1, null),
	('05', 'Hautes-Alpes', 1, null),
	('06', 'Alpes-Maritimes', 1, 'Parlars roiasc e mentonasc a la broa italiana — cas discutit'),
	('07', 'Ardèche', 1, null),
	('09', 'Ariège', 1, null),
	('11', 'Aude', 1, null),
	('12', 'Aveyron', 1, null),
	('13', 'Bouches-du-Rhône', 1, null),
	('15', 'Cantal', 1, null),
	('19', 'Corrèze', 1, null),
	('23', 'Creuse', 1, 'Nòrd dins lo Croissant, comptat coma occitan (coma sus nòstra carta dels dialèctes)'),
	('24', 'Dordogne', 1, null),
	('30', 'Gard', 1, null),
	('31', 'Haute-Garonne', 1, null),
	('32', 'Gers', 1, null),
	('34', 'Hérault', 1, null),
	('40', 'Landes', 1, null),
	('43', 'Haute-Loire', 1, null),
	('46', 'Lot', 1, null),
	('47', 'Lot-et-Garonne', 1, null),
	('48', 'Lozère', 1, null),
	('63', 'Puy-de-Dôme', 1, null),
	('81', 'Tarn', 1, null),
	('82', 'Tarn-et-Garonne', 1, null),
	('83', 'Var', 1, null),
	('84', 'Vaucluse', 1, null),
	('87', 'Haute-Vienne', 1, 'Franja nòrd dins lo Croissant, comptada coma occitana'),
	-- Nivèl 2 : occitan langue régionale en partie
	('03', 'Allier', 2, 'Sud dins lo Croissant (Montluçon…) ; nòrd d''oïl'),
	('16', 'Charente', 2, 'Èst = Charanta lemosina, occitanofòna (Confolentés) ; rèsta = oc medieval passat a l''oïl — Romain lo prepausava en nivèl 3, de trencar'),
	('26', 'Drôme', 2, 'Franja nòrd francoprovençala ; tota la rèsta occitana'),
	('33', 'Gironde', 2, 'Nòrd (país Gabai, Blaiés) de parlar santongés (oïl)'),
	('36', 'Indre', 2, 'Qualques comunas del sud dins lo Croissant — cas incertan'),
	('42', 'Loire', 2, 'Franja sud-oèst occitana ; majoritat francoprovençala — cas incertan'),
	('64', 'Pyrénées-Atlantiques', 2, 'Bearn occitanofòn ; Bascoat bascofòn'),
	('66', 'Pyrénées-Orientales', 2, 'Majoritat catalanofòna ; Fenolhedés occitanofòn'),
	-- Nivèl 3 : présence ancienne attestée, disparue avant la diglossie moderne
	('17', 'Charente-Maritime', 3, 'Santonge e Aunis : oc medieval, passat a l''oïl abans lo sègle XV'),
	('79', 'Deux-Sèvres', 3, 'Peitau : oc medieval, passat a l''oïl abans lo sègle XV'),
	('85', 'Vendée', 3, 'Bas-Peitau : atestacion mens fòrta — cas incertan'),
	('86', 'Vienne', 3, 'Peitau : oc medieval, passat a l''oïl abans lo sègle XV')
on conflict (code) do nothing;


-- GARDE-FOU
do $$
declare
	n int;
begin
	if not exists (
		select 1
		from pg_class c
		join pg_namespace ns on ns.oid = c.relnamespace
		where ns.nspname = 'public' and c.relname = 'carta_departaments' and c.relrowsecurity
	) then
		raise exception 'SEGURETAT : public.carta_departaments es pas protegida per RLS. Tot es anullat.';
	end if;

	select count(*) into n
	from pg_policies where schemaname = 'public' and tablename = 'carta_departaments';
	if n <> 4 then
		raise exception
			'SEGURETAT : public.carta_departaments deuriá aver 4 politicas, ne a %. Tot es anullat.', n;
	end if;

	raise notice 'Taula « carta_departaments » prèsta : % despartaments classats.', (
		select count(*) from public.carta_departaments
	);
end $$;

select
	nivèl,
	count(*) as despartaments
from
	public.carta_departaments
group by
	nivèl
order by
	nivèl;
