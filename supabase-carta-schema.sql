-- Lo Ligam — espace « Carta » (gestion des còlas, dialèctes, luòcs d'interès)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin(),
-- public.toca_updated_at()).
--
-- TROIS TABLES
-- carta_colas      : le registre des còlas de la carta (ce qui apparaît dans
--                    le panèl « Jaces ») — libellés, disponibilité, couleur et
--                    transparence par défaut de la còla.
-- carta_dialectes  : la couleur et le libellé de chaque zone dialectale
--                    (còdis cro/pro/gas/lan/noc, doivent correspondre à la
--                    propriété « name » de SIG/Dialecte/Carte_dialecte_WG.geojson).
-- carta_luocs      : les points de la còla « Luòcs d'interès ».

create table if not exists public.carta_colas (
	id text primary key,
	label_oc text not null,
	label_fr text not null,
	nòta_oc text,
	nòta_fr text,
	color text not null default '#a5342a',
	opacitat numeric not null default 0.9,
	disponible boolean not null default false,
	ordre int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint carta_colas_opacitat_valida check (
		opacitat >= 0
		and opacitat <= 1
	)
);

alter table public.carta_colas enable row level security;

drop trigger if exists carta_colas_updated_at on public.carta_colas;

create trigger carta_colas_updated_at before
update on public.carta_colas for each row
execute function public.toca_updated_at ();

create table if not exists public.carta_dialectes (
	kòd text primary key,
	label_oc text not null,
	label_fr text,
	color text not null,
	opacitat numeric not null default 0.35,
	ordre int not null default 0,
	updated_at timestamptz not null default now(),
	constraint carta_dialectes_opacitat_valida check (
		opacitat >= 0
		and opacitat <= 1
	)
);

alter table public.carta_dialectes enable row level security;

drop trigger if exists carta_dialectes_updated_at on public.carta_dialectes;

create trigger carta_dialectes_updated_at before
update on public.carta_dialectes for each row
execute function public.toca_updated_at ();

create table if not exists public.carta_luocs (
	id text primary key,
	nom_oc text not null,
	nom_fr text,
	descripcion_oc text,
	descripcion_fr text,
	latitud numeric not null,
	longitud numeric not null,
	ordre int not null default 0,
	publicat boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint carta_luocs_latitud_valida check (
		latitud >= -90
		and latitud <= 90
	),
	constraint carta_luocs_longitud_valida check (
		longitud >= -180
		and longitud <= 180
	)
);

alter table public.carta_luocs enable row level security;

create index if not exists carta_luocs_ordre_idx on public.carta_luocs (ordre);

drop trigger if exists carta_luocs_updated_at on public.carta_luocs;

create trigger carta_luocs_updated_at before
update on public.carta_luocs for each row
execute function public.toca_updated_at ();


-- POLITIQUES
-- -----------------------------------------------------------------------------
-- carta_colas et carta_dialectes : pas de colonne « publicat » — ce sont des
-- réglages de style, toujours lisibles (sinon la carte ne saurait pas quoi
-- afficher). carta_luocs suit le même principe que fichas/obras : lecture
-- publique sur ce qui est publié, écriture réservée à l'admin.

drop policy if exists "carta_colas : lectura publica" on public.carta_colas;

create policy "carta_colas : lectura publica" on public.carta_colas for
select
	using (true);

drop policy if exists "carta_colas : apondre (admin)" on public.carta_colas;

create policy "carta_colas : apondre (admin)" on public.carta_colas for insert
with
	check (public.is_admin ());

drop policy if exists "carta_colas : modificar (admin)" on public.carta_colas;

create policy "carta_colas : modificar (admin)" on public.carta_colas
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "carta_colas : suprimir (admin)" on public.carta_colas;

create policy "carta_colas : suprimir (admin)" on public.carta_colas for delete using (public.is_admin ());

drop policy if exists "carta_dialectes : lectura publica" on public.carta_dialectes;

create policy "carta_dialectes : lectura publica" on public.carta_dialectes for
select
	using (true);

drop policy if exists "carta_dialectes : apondre (admin)" on public.carta_dialectes;

create policy "carta_dialectes : apondre (admin)" on public.carta_dialectes for insert
with
	check (public.is_admin ());

drop policy if exists "carta_dialectes : modificar (admin)" on public.carta_dialectes;

create policy "carta_dialectes : modificar (admin)" on public.carta_dialectes
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "carta_dialectes : suprimir (admin)" on public.carta_dialectes;

create policy "carta_dialectes : suprimir (admin)" on public.carta_dialectes for delete using (public.is_admin ());

drop policy if exists "carta_luocs : lectura publica" on public.carta_luocs;

create policy "carta_luocs : lectura publica" on public.carta_luocs for
select
	using (
		publicat
		or public.is_admin ()
	);

drop policy if exists "carta_luocs : apondre (admin)" on public.carta_luocs;

create policy "carta_luocs : apondre (admin)" on public.carta_luocs for insert
with
	check (public.is_admin ());

drop policy if exists "carta_luocs : modificar (admin)" on public.carta_luocs;

create policy "carta_luocs : modificar (admin)" on public.carta_luocs
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "carta_luocs : suprimir (admin)" on public.carta_luocs;

create policy "carta_luocs : suprimir (admin)" on public.carta_luocs for delete using (public.is_admin ());


-- DONNÉES DE DÉPART
-- -----------------------------------------------------------------------------
-- Reprend exactement ce qui était codé en dur dans CartaOccitania.svelte et
-- carta/+page.svelte, pour que la bascule vers la base ne change rien à
-- l'affichage. Romain ajuste ensuite depuis l'espace d'administration.

insert into
	public.carta_colas (
		id,
		label_oc,
		label_fr,
		nòta_oc,
		nòta_fr,
		color,
		opacitat,
		disponible,
		ordre
	)
values
	(
		'lieusInteres',
		'Luòcs d''interès',
		'Lieux d''intérêt',
		null,
		null,
		'#e0a43b',
		0.9,
		true,
		0
	),
	(
		'dialectes',
		'Dialèctes',
		'Dialectes',
		null,
		null,
		'#a5342a',
		0.35,
		true,
		1
	),
	(
		'provincias',
		'Provincias istoricas',
		'Provinces historiques',
		'A venir',
		'À venir',
		'#5e7b3a',
		0.35,
		false,
		2
	),
	(
		'limsi',
		'Enquistas vocalas (Atlàs LISN)',
		'Enquêtes vocales (Atlas LISN)',
		'En espèra de l''autorizacion del LISN (licéncia CC BY-NC-SA)',
		'En attente de l''autorisation du LISN (licence CC BY-NC-SA)',
		'#3e7cb1',
		0.9,
		false,
		3
	)
on conflict (id) do nothing;

insert into
	public.carta_dialectes (kòd, label_oc, label_fr, color, opacitat, ordre)
values
	('cro', 'Lo Creissent', 'Le Creissent', '#3e7cb1', 0.35, 0),
	('pro', 'Provençau', 'Provençal', '#c8562e', 0.35, 1),
	('gas', 'Gascon', 'Gascon', '#1f5f63', 0.35, 2),
	(
		'lan',
		'Lengadocian',
		'Languedocien',
		'#e0a43b',
		0.35,
		3
	),
	(
		'noc',
		'Nòrd-occitan',
		'Nord-occitan',
		'#5e7b3a',
		0.35,
		4
	)
on conflict (kòd) do nothing;

insert into
	public.carta_luocs (
		id,
		nom_oc,
		nom_fr,
		descripcion_oc,
		descripcion_fr,
		latitud,
		longitud,
		ordre,
		publicat
	)
values
	(
		'tolosa',
		'Tolosa',
		'Toulouse',
		'La Vila Ròsa, capitala istorica de l''Occitània',
		'La Ville Rose, capitale historique de l''Occitanie',
		43.6045,
		1.4442,
		0,
		true
	),
	(
		'carcassona',
		'Carcassona',
		'Carcassonne',
		'La Ciutat medievala',
		'La Cité médiévale',
		43.213,
		2.3491,
		1,
		true
	),
	(
		'nimes',
		'Nimes',
		'Nîmes',
		'Las Arenas romanas',
		'Les Arènes romaines',
		43.8367,
		4.3601,
		2,
		true
	),
	(
		'avinhon',
		'Avinhon',
		'Avignon',
		'Lo Palais dels Papas',
		'Le Palais des Papes',
		43.9493,
		4.8055,
		3,
		true
	)
on conflict (id) do nothing;


-- GARDE-FOU : le script refuse d'aboutir si une table n'est pas protégée.
do $$
declare
	t text;
	n int;
begin
	foreach t in array array['carta_colas', 'carta_dialectes', 'carta_luocs'] loop
		if not exists (
			select 1
			from pg_class c
			join pg_namespace ns on ns.oid = c.relnamespace
			where ns.nspname = 'public' and c.relname = t and c.relrowsecurity
		) then
			raise exception 'SEGURETAT : public.% es pas protegida per RLS. Tot es anullat.', t;
		end if;

		select count(*) into n
		from pg_policies where schemaname = 'public' and tablename = t;
		if n <> 4 then
			raise exception
				'SEGURETAT : public.% deuriá aver 4 politicas, ne a %. Tot es anullat.', t, n;
		end if;
	end loop;

	raise notice 'Taulas « carta_colas », « carta_dialectes », « carta_luocs » prèstas : RLS actiu, 4 politicas cadauna.';
end $$;

select
	id,
	label_oc,
	disponible
from
	public.carta_colas
order by
	ordre;
