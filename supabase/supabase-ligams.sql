-- Lo Ligam — « Parlar amassa » : la mise en relation (décision de Romain, 2026-11-14)
-- =============================================================================
-- Remplace les groupes avec messagerie (rangés sur archiu/grops-2026-11-14).
-- Modèle : Mintzalagun (Pays basque). Le site présente les gens ; tout se
-- passe ensuite ailleurs (WhatsApp, téléphone, réseaux). Pas de messagerie.
--
-- Qui fait quoi :
--   - personne sans compte ne voit rien (pas d'aspiration des profils) ;
--   - avec un compte : voir les profils, les annonces et les groupes (cercles)
--     autour d'une commune, SANS jamais voir un moyen de contact ;
--   - avec une adresse VÉRIFIÉE et sans suspension : avoir un profil, déposer
--     une annonce, déclarer un groupe, demander un contact ;
--   - double accord : A demande avec une phrase, B accepte ; alors seulement
--     chacun lit le contact que l'autre a choisi de montrer
--     (public.ligam_contacte) ;
--   - cinq demandes par semaine au plus ; une seule demande en cours par paire ;
--   - bloquer : l'autre disparaît des listes et ne peut plus demander ;
--   - signaler un profil ; trois signalements de trois personnes masquent le
--     profil de Parlar amassa (pas tout le site) en attendant que Romain
--     regarde (public.ligam_moderacion, levée par ligam_levar_moderacion) ;
--   - l'administrateur lit tout et tranche.
--
-- Données (RGPD, minimisation) :
--   - la commune et ses coordonnées arrondies au centième (environ 1 km) :
--     jamais d'adresse ;
--   - le moyen de contact est dans une table à part, que personne d'autre ne
--     lit directement, même pas avec une demande acceptée (seule la fonction
--     public.ligam_contacte le rend, à la seule autre personne de la paire) ;
--   - supprimer son compte efface tout (on delete cascade) ; supprimer son
--     profil de mise en relation efface profil, contact, annonces et demandes ;
--   - une demande refusée ou retirée est effacée au bout de 90 jours, une
--     annonce au bout de 60 jours (public.purgar_ligams).
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose supabase-schema.sql (profiles), supabase-admin-schema.sql
-- (public.is_admin) et supabase-grops.sql (adreca_verificada, es_bandit,
-- bandiments, normalizar, conten_mot_defendut) déjà exécutés.


-- 0) LES TABLES
-- -----------------------------------------------------------------------------

-- Valeurs permises, partagées par les vérifications
create or replace function public.ligam_interes_valid (t text[]) returns boolean language sql immutable
set
	search_path = '' as $$
	select coalesce(cardinality(t), 0) <= 8
		and coalesce(t <@ array['cant','cosina','istòria','ortalha','musica','caminada','rugbi','teatre','vinha','lectura','cinèma','natura','jòcs','dança','autre']::text[], true);
$$;

create table if not exists public.ligam_perfils (
	user_id uuid primary key default auth.uid () references auth.users (id) on delete cascade,
	comuna text not null check (char_length(btrim(comuna)) between 2 and 80),
	lat numeric(5, 2) not null check (lat between 34 and 52),
	lon numeric(5, 2) not null check (lon between -6 and 14),
	rotle text not null check (rotle in ('parla', 'apren', 'los_dos')),
	interesses text[] not null default '{}' check (public.ligam_interes_valid (interesses)),
	presentacion text check (char_length(presentacion) <= 280),
	visible boolean not null default true,
	darriera_vista timestamptz not null default now(),
	created_at timestamptz not null default now()
);

-- Le moyen de contact : lu par son auteur seul ; rendu à l'autre personne
-- d'une demande acceptée par public.ligam_contacte, jamais autrement.
create table if not exists public.ligam_contactes (
	user_id uuid primary key default auth.uid () references public.ligam_perfils (user_id) on delete cascade,
	tipe text not null check (tipe in ('whatsapp', 'telefon', 'signal', 'telegram', 'instagram', 'facebook', 'corrièl', 'autre')),
	valor text not null check (char_length(btrim(valor)) between 3 and 120),
	updated_at timestamptz not null default now()
);

create table if not exists public.ligam_cercles (
	id bigint generated always as identity primary key,
	user_id uuid not null default auth.uid () references public.ligam_perfils (user_id) on delete cascade,
	nom text not null check (char_length(btrim(nom)) between 3 and 80),
	comuna text not null check (char_length(btrim(comuna)) between 2 and 80),
	lat numeric(5, 2) not null check (lat between 34 and 52),
	lon numeric(5, 2) not null check (lon between -6 and 14),
	luoc text check (char_length(luoc) <= 120),
	ritme text check (char_length(ritme) <= 120),
	descripcion text check (char_length(descripcion) <= 500),
	interesses text[] not null default '{}' check (public.ligam_interes_valid (interesses)),
	membres smallint check (membres between 1 and 500),
	darriera_rencontra date check (darriera_rencontra <= current_date + 1),
	created_at timestamptz not null default now()
);
create index if not exists ligam_cercles_user_id on public.ligam_cercles (user_id);

create table if not exists public.ligam_anoncias (
	id bigint generated always as identity primary key,
	user_id uuid not null default auth.uid () references public.ligam_perfils (user_id) on delete cascade,
	texte text not null check (char_length(btrim(texte)) between 20 and 500),
	created_at timestamptz not null default now(),
	expira timestamptz not null default now() + interval '60 days'
);
create index if not exists ligam_anoncias_user_id on public.ligam_anoncias (user_id);

-- Une demande : de « de » vers « a », éventuellement pour rejoindre un cercle
create table if not exists public.ligam_demandas (
	id bigint generated always as identity primary key,
	de uuid not null references public.ligam_perfils (user_id) on delete cascade,
	a uuid not null references public.ligam_perfils (user_id) on delete cascade,
	cercle_id bigint references public.ligam_cercles (id) on delete cascade,
	messatge text not null check (char_length(btrim(messatge)) between 10 and 280),
	estat text not null default 'espèra' check (estat in ('espèra', 'acceptada', 'refusada', 'retirada')),
	created_at timestamptz not null default now(),
	respondut_at timestamptz,
	check (de <> a)
);
create index if not exists ligam_demandas_de on public.ligam_demandas (de, created_at);
create index if not exists ligam_demandas_a on public.ligam_demandas (a);
create index if not exists ligam_demandas_cercle on public.ligam_demandas (cercle_id);
-- Une seule demande vivante par paire, dans les deux sens (et par cercle)
drop index if exists public.ligam_demandas_viva;
create unique index ligam_demandas_viva on public.ligam_demandas (least(de, a), greatest(de, a), coalesce(cercle_id, 0))
	where estat in ('espèra', 'acceptada');

-- Journal des demandes, indépendant du profil : supprimer puis recréer son
-- profil ne remet pas le compteur à zéro (audit de Rodrigo, 14-11). Personne
-- ne le lit ni ne l'écrit directement ; effacé au bout de 90 jours.
create table if not exists public.ligam_demandas_jornal (
	id bigint generated always as identity primary key,
	de uuid not null references auth.users (id) on delete cascade,
	a uuid not null,
	refusada boolean not null default false,
	created_at timestamptz not null default now()
);
create index if not exists ligam_demandas_jornal_de on public.ligam_demandas_jornal (de, created_at);

-- Profils masqués par la modération (trois signalements) : seulement de
-- Parlar amassa, pas une suspension de tout le site ; Romain lève en
-- supprimant la ligne. Personne d'autre n'y touche.
create table if not exists public.ligam_moderacion (
	user_id uuid primary key references auth.users (id) on delete cascade,
	motiu text not null,
	created_at timestamptz not null default now()
);

create table if not exists public.ligam_blocatges (
	de uuid not null default auth.uid () references auth.users (id) on delete cascade,
	a uuid not null references auth.users (id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (de, a),
	check (de <> a)
);
create index if not exists ligam_blocatges_a on public.ligam_blocatges (a);

create table if not exists public.ligam_senhalaments (
	id bigint generated always as identity primary key,
	de uuid not null default auth.uid () references auth.users (id) on delete cascade,
	a uuid not null references auth.users (id) on delete cascade,
	motiu text not null check (motiu in ('faus_perfil', 'assetjament', 'odi', 'spam', 'drague', 'autre')),
	precisions text check (char_length(precisions) <= 500),
	tractat boolean not null default false,
	created_at timestamptz not null default now(),
	unique (de, a),
	check (de <> a)
);
create index if not exists ligam_senhalaments_a on public.ligam_senhalaments (a);


-- 1) LES PETITES FONCTIONS
-- -----------------------------------------------------------------------------

-- Distance en km entre deux points (formule de haversine)
create or replace function public.ligam_km (lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric) returns integer language sql immutable
set
	search_path = '' as $$
	select round(12742 * asin(sqrt(
		power(sin(radians((lat2 - lat1)::float8) / 2), 2)
		+ cos(radians(lat1::float8)) * cos(radians(lat2::float8)) * power(sin(radians((lon2 - lon1)::float8) / 2), 2)
	)))::integer;
$$;

-- Peut agir (avoir un profil, demander, publier) : adresse vérifiée, pas suspendu
create or replace function public.ligam_pot_agir () returns boolean language sql stable security definer
set
	search_path = '' as $$
	select auth.uid () is not null and public.adreca_verificada () and not public.es_bandit ();
$$;

-- Un des deux a bloqué l'autre
create or replace function public.ligam_blocat (x uuid, y uuid) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (select 1 from public.ligam_blocatges where (de = x and a = y) or (de = y and a = x));
$$;

-- Ancienneté de la dernière visite, en mots (pas d'horodatage précis montré)
create or replace function public.ligam_vist (t timestamptz) returns text language sql stable
set
	search_path = '' as $$
	select case
		when t > now() - interval '2 days' then 'recent'
		when t > now() - interval '8 days' then 'setmana'
		when t > now() - interval '31 days' then 'mes'
		else 'ancian'
	end;
$$;

-- Profil masqué par la modération
create or replace function public.ligam_amagat (x uuid) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (select 1 from public.ligam_moderacion where user_id = x);
$$;

-- Ces trois-là ne servent qu'à l'intérieur des autres fonctions : personne ne
-- les appelle (sinon ligam_blocat dirait qui a bloqué qui)
revoke all on function public.ligam_blocat (uuid, uuid), public.ligam_pot_agir (), public.ligam_amagat (uuid)
	from public, anon, authenticated;


-- 2) LES DÉCLENCHEURS : arrondir, filtrer les mots, compter les signalements
-- -----------------------------------------------------------------------------

create or replace function public.ligam_abans_perfil () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.ligam_pot_agir () and not public.is_admin () then
		raise exception 'ligam_verificacion';
	end if;
	if tg_op = 'UPDATE' and new.user_id <> old.user_id then
		raise exception 'ligam_interdit';
	end if;
	-- dates tenues par la base, pas par le navigateur
	if tg_op = 'INSERT' then
		new.created_at := now();
		new.darriera_vista := now();
	else
		new.created_at := old.created_at;
		new.darriera_vista := least(new.darriera_vista, now());
	end if;
	new.lat := round(new.lat, 2);
	new.lon := round(new.lon, 2);
	new.comuna := btrim(new.comuna);
	if public.conten_mot_defendut (coalesce(new.presentacion, '')) then
		raise exception 'ligam_mot';
	end if;
	return new;
end;
$$;
drop trigger if exists ligam_abans_perfil on public.ligam_perfils;
create trigger ligam_abans_perfil before insert or update on public.ligam_perfils
	for each row execute function public.ligam_abans_perfil ();

create or replace function public.ligam_abans_contacte () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if tg_op = 'UPDATE' and new.user_id <> old.user_id then
		raise exception 'ligam_interdit';
	end if;
	new.valor := btrim(new.valor);
	new.updated_at := now();
	return new;
end;
$$;
drop trigger if exists ligam_abans_contacte on public.ligam_contactes;
create trigger ligam_abans_contacte before insert or update on public.ligam_contactes
	for each row execute function public.ligam_abans_contacte ();

create or replace function public.ligam_abans_cercle () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.ligam_pot_agir () and not public.is_admin () then
		raise exception 'ligam_verificacion';
	end if;
	if tg_op = 'UPDATE' and new.user_id <> old.user_id then
		raise exception 'ligam_interdit';
	end if;
	if tg_op = 'INSERT' then
		perform pg_advisory_xact_lock(hashtextextended('ligam:' || new.user_id::text, 0));
		if (select count(*) from public.ligam_cercles where user_id = new.user_id) >= 3 then
			raise exception 'ligam_limit';
		end if;
	end if;
	new.lat := round(new.lat, 2);
	new.lon := round(new.lon, 2);
	if public.conten_mot_defendut (new.nom || ' ' || coalesce(new.luoc, '') || ' ' || coalesce(new.ritme, '') || ' ' || coalesce(new.descripcion, '')) then
		raise exception 'ligam_mot';
	end if;
	return new;
end;
$$;
drop trigger if exists ligam_abans_cercle on public.ligam_cercles;
create trigger ligam_abans_cercle before insert or update on public.ligam_cercles
	for each row execute function public.ligam_abans_cercle ();

create or replace function public.ligam_abans_anoncia () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.ligam_pot_agir () and not public.is_admin () then
		raise exception 'ligam_verificacion';
	end if;
	if tg_op = 'UPDATE' and (new.user_id <> old.user_id or new.created_at <> old.created_at) then
		raise exception 'ligam_interdit';
	end if;
	if tg_op = 'INSERT' then
		perform pg_advisory_xact_lock(hashtextextended('ligam:' || new.user_id::text, 0));
		if (select count(*) from public.ligam_anoncias where user_id = new.user_id and expira > now()) >= 2 then
			raise exception 'ligam_limit';
		end if;
		new.created_at := now();
	end if;
	new.expira := least(new.expira, new.created_at + interval '60 days');
	if public.conten_mot_defendut (new.texte) then
		raise exception 'ligam_mot';
	end if;
	return new;
end;
$$;
drop trigger if exists ligam_abans_anoncia on public.ligam_anoncias;
create trigger ligam_abans_anoncia before insert or update on public.ligam_anoncias
	for each row execute function public.ligam_abans_anoncia ();

-- Avant un signalement (audit de Rodrigo, 14-11, contre la suspension en
-- masse par de faux comptes) : pouvoir agir, compte de plus de 7 jours,
-- cible qui a un profil, trois signalements par jour au plus
create or replace function public.ligam_abans_senhalament () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	perform pg_advisory_xact_lock(hashtextextended('ligam:' || new.de::text, 0));
	if not public.ligam_pot_agir () then raise exception 'ligam_verificacion'; end if;
	if (select created_at from auth.users where id = new.de) > now() - interval '7 days' then
		raise exception 'ligam_novel';
	end if;
	if not exists (select 1 from public.ligam_perfils where user_id = new.a) then
		raise exception 'ligam_introbable';
	end if;
	if (select count(*) from public.ligam_senhalaments where de = new.de and created_at > now() - interval '1 day') >= 3 then
		raise exception 'ligam_limit';
	end if;
	new.created_at := now();
	new.tractat := false;
	return new;
end;
$$;
drop trigger if exists ligam_abans_senhalament on public.ligam_senhalaments;
create trigger ligam_abans_senhalament before insert on public.ligam_senhalaments
	for each row execute function public.ligam_abans_senhalament ();

-- Trois signalements non traités de trois personnes : le profil disparaît de
-- Parlar amassa en attendant que Romain regarde. Pas de suspension de tout le
-- site (un abus ne doit pas couper quelqu'un de ses leçons).
create or replace function public.ligam_apres_senhalament () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if (select count(*) from public.ligam_senhalaments where a = new.a and not tractat) >= 3 then
		insert into public.ligam_moderacion (user_id, motiu)
		values (new.a, 'Tres senhalaments, en espèra d''examen.')
		on conflict (user_id) do nothing;
	end if;
	return new;
end;
$$;
drop trigger if exists ligam_apres_senhalament on public.ligam_senhalaments;
create trigger ligam_apres_senhalament after insert on public.ligam_senhalaments
	for each row execute function public.ligam_apres_senhalament ();

revoke all on function public.ligam_abans_perfil (), public.ligam_abans_contacte (), public.ligam_abans_cercle (),
	public.ligam_abans_anoncia (), public.ligam_abans_senhalament (), public.ligam_apres_senhalament () from public, anon, authenticated;


-- 3) LES RÈGLES D'ACCÈS (RLS)
-- -----------------------------------------------------------------------------

alter table public.ligam_perfils enable row level security;
alter table public.ligam_contactes enable row level security;
alter table public.ligam_cercles enable row level security;
alter table public.ligam_anoncias enable row level security;
alter table public.ligam_demandas enable row level security;
alter table public.ligam_blocatges enable row level security;
alter table public.ligam_senhalaments enable row level security;
alter table public.ligam_demandas_jornal enable row level security;
alter table public.ligam_moderacion enable row level security;

-- Personne sans compte n'a rien à faire ici
revoke all on public.ligam_perfils, public.ligam_contactes, public.ligam_cercles, public.ligam_anoncias,
	public.ligam_demandas, public.ligam_blocatges, public.ligam_senhalaments from anon;
-- Journal et modération : aucune règle, donc aucun accès direct ; l'admin
-- lit la modération et la lève (supprimer la ligne)
revoke all on public.ligam_demandas_jornal, public.ligam_moderacion from anon, authenticated;
drop policy if exists "ligam_moderacion : l'admin" on public.ligam_moderacion;
create policy "ligam_moderacion : l'admin" on public.ligam_moderacion for all to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
grant select, delete on public.ligam_moderacion to authenticated;

-- Profils : chacun lit et gère le sien ; les autres passent par ligam_vesins
drop policy if exists "ligam_perfils : le sien, ou tout si admin" on public.ligam_perfils;
create policy "ligam_perfils : le sien, ou tout si admin" on public.ligam_perfils for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_perfils : créer le sien" on public.ligam_perfils;
create policy "ligam_perfils : créer le sien" on public.ligam_perfils for insert to authenticated
	with check (user_id = (select auth.uid ()));
drop policy if exists "ligam_perfils : modifier le sien" on public.ligam_perfils;
create policy "ligam_perfils : modifier le sien" on public.ligam_perfils for update to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()))
	with check (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_perfils : supprimer le sien" on public.ligam_perfils;
create policy "ligam_perfils : supprimer le sien" on public.ligam_perfils for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Contact : son auteur seul (l'admin non plus : il n'en a pas besoin)
drop policy if exists "ligam_contactes : le sien" on public.ligam_contactes;
create policy "ligam_contactes : le sien" on public.ligam_contactes for all to authenticated
	using (user_id = (select auth.uid ()))
	with check (user_id = (select auth.uid ()));

-- Cercles : les siens en direct ; la liste passe par ligam_cercles_vesins
-- (qui écarte les comptes suspendus et bloqués)
drop policy if exists "ligam_cercles : lire" on public.ligam_cercles;
drop policy if exists "ligam_cercles : les siens, ou tout si admin" on public.ligam_cercles;
create policy "ligam_cercles : les siens, ou tout si admin" on public.ligam_cercles for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_cercles : créer le sien" on public.ligam_cercles;
create policy "ligam_cercles : créer le sien" on public.ligam_cercles for insert to authenticated
	with check (user_id = (select auth.uid ()));
drop policy if exists "ligam_cercles : modifier le sien" on public.ligam_cercles;
create policy "ligam_cercles : modifier le sien" on public.ligam_cercles for update to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()))
	with check (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_cercles : supprimer le sien" on public.ligam_cercles;
create policy "ligam_cercles : supprimer le sien" on public.ligam_cercles for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Annonces : les siennes en direct ; la liste passe par ligam_anoncias_vesinas
drop policy if exists "ligam_anoncias : les siennes, ou tout si admin" on public.ligam_anoncias;
create policy "ligam_anoncias : les siennes, ou tout si admin" on public.ligam_anoncias for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_anoncias : créer la sienne" on public.ligam_anoncias;
create policy "ligam_anoncias : créer la sienne" on public.ligam_anoncias for insert to authenticated
	with check (user_id = (select auth.uid ()));
drop policy if exists "ligam_anoncias : modifier la sienne" on public.ligam_anoncias;
create policy "ligam_anoncias : modifier la sienne" on public.ligam_anoncias for update to authenticated
	using (user_id = (select auth.uid ()))
	with check (user_id = (select auth.uid ()));
drop policy if exists "ligam_anoncias : supprimer la sienne" on public.ligam_anoncias;
create policy "ligam_anoncias : supprimer la sienne" on public.ligam_anoncias for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Demandes : lues par les deux personnes ; créées, acceptées, refusées,
-- retirées uniquement par les fonctions (limites et vérifications)
drop policy if exists "ligam_demandas : les deux personnes" on public.ligam_demandas;
create policy "ligam_demandas : les deux personnes" on public.ligam_demandas for select to authenticated
	using ((select auth.uid ()) in (de, a) or (select public.is_admin ()));
revoke insert, update, delete on public.ligam_demandas from authenticated;

-- Blocages : les siens
drop policy if exists "ligam_blocatges : les siens" on public.ligam_blocatges;
create policy "ligam_blocatges : les siens" on public.ligam_blocatges for all to authenticated
	using (de = (select auth.uid ()))
	with check (de = (select auth.uid ()));

-- Signalements : signaler en son nom, lire les siens ; l'admin traite
drop policy if exists "ligam_senhalaments : signaler" on public.ligam_senhalaments;
create policy "ligam_senhalaments : signaler" on public.ligam_senhalaments for insert to authenticated
	with check (de = (select auth.uid ()) and not tractat and (select public.adreca_verificada ()));
drop policy if exists "ligam_senhalaments : lire les siens, ou tout si admin" on public.ligam_senhalaments;
create policy "ligam_senhalaments : lire les siens, ou tout si admin" on public.ligam_senhalaments for select to authenticated
	using (de = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "ligam_senhalaments : l'admin traite" on public.ligam_senhalaments;
create policy "ligam_senhalaments : l'admin traite" on public.ligam_senhalaments for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "ligam_senhalaments : retirer le sien, ou tout si admin" on public.ligam_senhalaments;
drop policy if exists "ligam_senhalaments : l'admin retire" on public.ligam_senhalaments;
-- (suppression réservée à l'admin : sinon le plafond par jour se contourne)
create policy "ligam_senhalaments : l'admin retire" on public.ligam_senhalaments for delete to authenticated
	using ((select public.is_admin ()));


-- 4) LES LISTES (jamais de contact, jamais de coordonnées exactes)
-- -----------------------------------------------------------------------------

-- Profils autour d'un point. Le rayon est plafonné à 200 km et la liste à
-- 100 lignes (pas d'aspiration de tout l'annuaire d'un coup).
create or replace function public.ligam_vesins (p_lat numeric, p_lon numeric, p_km integer default 30, p_rotle text default null, p_interes text default null)
returns table (user_id uuid, pseudo text, rotle text, comuna text, km integer, interesses text[], presentacion text, vist text)
language sql stable security definer
set
	search_path = '' as $$
	select p.user_id, pr.pseudo, p.rotle, p.comuna, (public.ligam_km (p_lat, p_lon, p.lat, p.lon) / 5) * 5, p.interesses, p.presentacion, public.ligam_vist (p.darriera_vista)
	from public.ligam_perfils p
	join public.profiles pr on pr.user_id = p.user_id
	where public.ligam_pot_agir ()
		and p.visible
		and not public.ligam_amagat (p.user_id)
		and p.user_id <> auth.uid ()
		and not exists (select 1 from public.bandiments b where b.user_id = p.user_id and (b.fins is null or b.fins > now()))
		and not public.ligam_blocat (auth.uid (), p.user_id)
		and (p_rotle is null or p.rotle = p_rotle or p.rotle = 'los_dos')
		and (p_interes is null or p_interes = any (p.interesses))
		and public.ligam_km (p_lat, p_lon, p.lat, p.lon) <= (least(greatest(p_km, 5), 200) / 5) * 5
	order by 5, p.darriera_vista desc
	limit 100;
$$;

create or replace function public.ligam_anoncias_vesinas (p_lat numeric, p_lon numeric, p_km integer default 30, p_rotle text default null, p_interes text default null)
returns table (id bigint, user_id uuid, pseudo text, rotle text, comuna text, km integer, texte text, created_at timestamptz)
language sql stable security definer
set
	search_path = '' as $$
	select a.id, a.user_id, pr.pseudo, p.rotle, p.comuna, (public.ligam_km (p_lat, p_lon, p.lat, p.lon) / 5) * 5, a.texte, a.created_at
	from public.ligam_anoncias a
	join public.ligam_perfils p on p.user_id = a.user_id
	join public.profiles pr on pr.user_id = a.user_id
	where public.ligam_pot_agir ()
		and a.expira > now()
		and p.visible
		and not public.ligam_amagat (p.user_id)
		and not exists (select 1 from public.bandiments b where b.user_id = a.user_id and (b.fins is null or b.fins > now()))
		and not public.ligam_blocat (auth.uid (), a.user_id)
		and (p_rotle is null or p.rotle = p_rotle or p.rotle = 'los_dos')
		and (p_interes is null or p_interes = any (p.interesses))
		and public.ligam_km (p_lat, p_lon, p.lat, p.lon) <= (least(greatest(p_km, 5), 200) / 5) * 5
	order by a.created_at desc
	limit 100;
$$;

create or replace function public.ligam_cercles_vesins (p_lat numeric, p_lon numeric, p_km integer default 30, p_interes text default null)
returns table (id bigint, nom text, comuna text, km integer, luoc text, ritme text, descripcion text, interesses text[], membres smallint, darriera_rencontra date, actiu boolean)
language sql stable security definer
set
	search_path = '' as $$
	select c.id, c.nom, c.comuna, (public.ligam_km (p_lat, p_lon, c.lat, c.lon) / 5) * 5, c.luoc, c.ritme, c.descripcion, c.interesses, c.membres, c.darriera_rencontra,
		coalesce(c.darriera_rencontra > current_date - 90, false)
	from public.ligam_cercles c
	where public.ligam_pot_agir ()
		and not public.ligam_amagat (c.user_id)
		and not exists (select 1 from public.bandiments b where b.user_id = c.user_id and (b.fins is null or b.fins > now()))
		and not public.ligam_blocat (auth.uid (), c.user_id)
		and (p_interes is null or p_interes = any (c.interesses))
		and public.ligam_km (p_lat, p_lon, c.lat, c.lon) <= (least(greatest(p_km, 5), 200) / 5) * 5
	order by 4
	limit 100;
$$;


-- 5) LE DOUBLE ACCORD
-- -----------------------------------------------------------------------------

-- Demander un contact (p_a), ou à rejoindre un cercle (p_cercle : la demande
-- part vers la personne qui l'a déclaré). Renvoie l'id de la demande.
create or replace function public.ligam_demandar (p_a uuid, p_messatge text, p_cercle bigint default null) returns bigint language plpgsql security definer
set
	search_path = '' as $$
declare
	moi uuid := auth.uid ();
	cible uuid := p_a;
	nou bigint;
begin
	perform pg_advisory_xact_lock(hashtextextended('ligam:' || moi::text, 0));
	if not public.ligam_pot_agir () then raise exception 'ligam_verificacion'; end if;
	if public.ligam_amagat (moi) then raise exception 'ligam_verificacion'; end if;
	if not exists (select 1 from public.ligam_perfils where user_id = moi) then raise exception 'ligam_sens_perfil'; end if;
	if not exists (select 1 from public.ligam_contactes where user_id = moi) then raise exception 'ligam_sens_contacte'; end if;
	if p_cercle is not null then
		select user_id into cible from public.ligam_cercles where id = p_cercle;
		if cible is null then raise exception 'ligam_introbable'; end if;
	end if;
	if cible is null or cible = moi then raise exception 'ligam_interdit'; end if;
	if not exists (
		select 1 from public.ligam_perfils p where p.user_id = cible and (p.visible or p_cercle is not null)
	) or exists (select 1 from public.bandiments b where b.user_id = cible and (b.fins is null or b.fins > now()))
	then raise exception 'ligam_introbable'; end if;
	if public.ligam_blocat (moi, cible) or public.ligam_amagat (cible) then raise exception 'ligam_introbable'; end if;
	-- refusé il y a moins de 90 jours : pas de nouvelle demande à la même personne
	if exists (select 1 from public.ligam_demandas_jornal where de = moi and a = cible and refusada and created_at > now() - interval '90 days') then
		raise exception 'ligam_introbable';
	end if;
	-- compté dans le journal, qui survit à la suppression du profil
	if (select count(*) from public.ligam_demandas_jornal where de = moi and created_at > now() - interval '7 days') >= 5 then
		raise exception 'ligam_limit';
	end if;
	if char_length(btrim(coalesce(p_messatge, ''))) not between 10 and 280 then raise exception 'ligam_messatge'; end if;
	if public.conten_mot_defendut (p_messatge) then raise exception 'ligam_mot'; end if;
	insert into public.ligam_demandas (de, a, cercle_id, messatge)
	values (moi, cible, p_cercle, btrim(p_messatge))
	returning id into nou;
	insert into public.ligam_demandas_jornal (de, a) values (moi, cible);
	update public.ligam_perfils set darriera_vista = now() where user_id = moi;
	return nou;
exception
	when unique_violation then raise exception 'ligam_ja_demandat';
end;
$$;

-- Répondre (la personne qui a reçu la demande)
create or replace function public.ligam_respondre (p_id bigint, p_accepta boolean) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.ligam_pot_agir () then raise exception 'ligam_verificacion'; end if;
	if p_accepta and not exists (select 1 from public.ligam_contactes where user_id = auth.uid ()) then
		raise exception 'ligam_sens_contacte';
	end if;
	update public.ligam_demandas
	set estat = case when p_accepta then 'acceptada' else 'refusada' end, respondut_at = now()
	where id = p_id and a = auth.uid () and estat = 'espèra';
	if not found then raise exception 'ligam_introbable'; end if;
	if not p_accepta then
		update public.ligam_demandas_jornal j set refusada = true
		from public.ligam_demandas d
		where d.id = p_id and j.de = d.de and j.a = d.a and j.created_at > now() - interval '90 days';
	end if;
	update public.ligam_perfils set darriera_vista = now() where user_id = auth.uid ();
end;
$$;

-- Retirer (l'une ou l'autre personne) : une demande en attente ou un contact
-- déjà partagé ; le contact n'est plus montré
create or replace function public.ligam_retirar (p_id bigint) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	update public.ligam_demandas
	set estat = 'retirada', respondut_at = now()
	where id = p_id and auth.uid () in (de, a) and estat in ('espèra', 'acceptada');
	if not found then raise exception 'ligam_introbable'; end if;
end;
$$;

-- Lire le contact de l'autre personne d'une demande ACCEPTÉE, et seulement
-- celui-là. Rien si l'un des deux a bloqué l'autre ou est suspendu.
create or replace function public.ligam_contacte (p_id bigint) returns table (tipe text, valor text) language sql stable security definer
set
	search_path = '' as $$
	select c.tipe, c.valor
	from public.ligam_demandas d
	join public.ligam_contactes c on c.user_id = case when d.de = auth.uid () then d.a else d.de end
	where d.id = p_id
		and d.estat = 'acceptada'
		and auth.uid () in (d.de, d.a)
		and not public.es_bandit ()
		and exists (select 1 from public.ligam_contactes m where m.user_id = auth.uid ())
		and not public.ligam_blocat (d.de, d.a)
		and not exists (select 1 from public.bandiments b where b.user_id = c.user_id and (b.fins is null or b.fins > now()));
$$;

-- Mes demandes, reçues et envoyées, avec le pseudo de l'autre
create or replace function public.ligam_mas_demandas ()
returns table (id bigint, sens text, autre uuid, pseudo text, cercle text, messatge text, estat text, created_at timestamptz)
language sql stable security definer
set
	search_path = '' as $$
	select d.id,
		case when d.de = auth.uid () then 'mandada' else 'recebuda' end,
		o.user_id, o.pseudo, c.nom, d.messatge, d.estat, d.created_at
	from public.ligam_demandas d
	join public.profiles o on o.user_id = case when d.de = auth.uid () then d.a else d.de end
	left join public.ligam_cercles c on c.id = d.cercle_id
	where auth.uid () in (d.de, d.a)
		and d.estat in ('espèra', 'acceptada')
		and not public.ligam_blocat (d.de, d.a)
	order by d.created_at desc;
$$;

-- Ménage (RGPD) : à lancer par l'admin ou par une tâche planifiée
create or replace function public.purgar_ligams () returns integer language plpgsql security definer
set
	search_path = '' as $$
declare
	n integer;
	m integer;
begin
	if auth.uid () is not null and not public.is_admin () then raise exception 'ligam_interdit'; end if;
	delete from public.ligam_demandas where estat in ('refusada', 'retirada') and respondut_at < now() - interval '90 days';
	get diagnostics n = row_count;
	delete from public.ligam_anoncias where expira < now();
	get diagnostics m = row_count;
	delete from public.ligam_demandas_jornal where created_at < now() - interval '90 days';
	return n + m;
end;
$$;

-- Qui peut appeler quoi
revoke all on function public.ligam_vesins (numeric, numeric, integer, text, text),
	public.ligam_anoncias_vesinas (numeric, numeric, integer, text, text),
	public.ligam_cercles_vesins (numeric, numeric, integer, text),
	public.ligam_demandar (uuid, text, bigint), public.ligam_respondre (bigint, boolean),
	public.ligam_retirar (bigint), public.ligam_contacte (bigint), public.ligam_mas_demandas (),
	public.purgar_ligams () from public, anon;
grant execute on function public.ligam_vesins (numeric, numeric, integer, text, text),
	public.ligam_anoncias_vesinas (numeric, numeric, integer, text, text),
	public.ligam_cercles_vesins (numeric, numeric, integer, text),
	public.ligam_demandar (uuid, text, bigint), public.ligam_respondre (bigint, boolean),
	public.ligam_retirar (bigint), public.ligam_contacte (bigint), public.ligam_mas_demandas (),
	public.purgar_ligams () to authenticated;

-- Lever un masquage (admin) : marquer les signalements traités PUIS retirer
-- la ligne, sinon le signalement suivant remasquerait aussitôt le profil
create or replace function public.ligam_levar_moderacion (p_user uuid) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.is_admin () then raise exception 'ligam_interdit'; end if;
	update public.ligam_senhalaments set tractat = true where a = p_user and not tractat;
	delete from public.ligam_moderacion where user_id = p_user;
end;
$$;
revoke all on function public.ligam_levar_moderacion (uuid) from public, anon;
grant execute on function public.ligam_levar_moderacion (uuid) to authenticated;
