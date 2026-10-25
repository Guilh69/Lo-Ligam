-- Lo Ligam — profils vérifiés d'Amassa (2026-10-25)
-- =============================================================================
-- À coller après supabase-grops.sql et supabase-grops-2.sql. Rejouable.
-- Décisions de Romain (cahier §11, 25-10) : des profils vérifiés, pas de bots
-- ni d'anonymes ; au lancement, Romain valide chaque profil à la main ; le
-- parrainage viendra ensuite. Sans photo : une initiale dans un rond.
--
-- 1) LE PROFIL PUBLIC : quelques champs ajoutés à public.profiles, remplis
--    librement (présentation, d'où l'on est, dialecte, niveau). Les réponses
--    du questionnaire d'accueil (âge, genre, profession…) restent PRIVÉES :
--    la table n'est toujours lisible que par la personne elle-même ; les
--    autres passent par public.perfil(), qui ne rend que les champs publics.
--
-- 2) LA VÉRIFICATION : profiles.verificacion = en_espèra | verificat |
--    refusat. Personne ne la change soi-même (un déclencheur rétablit
--    l'ancienne valeur) ; seul public.decidir_perfil(), réservé à
--    l'administrateur, la change. Sans profil vérifié : on lit les groupes
--    qu'on a rejoints, on n'y écrit pas, et son profil n'est montré à
--    personne.


-- 1) LES CHAMPS
-- -----------------------------------------------------------------------------

alter table public.profiles add column if not exists presentacion text;
alter table public.profiles add column if not exists ont text;
alter table public.profiles add column if not exists dialecte text;
alter table public.profiles add column if not exists nivel text;
alter table public.profiles add column if not exists verificacion text not null default 'en_espèra';
alter table public.profiles add column if not exists verificat_at timestamptz;
alter table public.profiles add column if not exists verificat_per uuid references auth.users (id) on delete set null;

do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'profiles_perfil_valors') then
		alter table public.profiles add constraint profiles_perfil_valors check (
			char_length(presentacion) <= 600
			and char_length(ont) <= 80
			and dialecte in ('lengadocian', 'provencal', 'gascon', 'lemosin', 'auvernhat', 'vivaroaupenc', 'autre', 'sabi_pas')
			and nivel in ('debutant', 'apren', 'parla', 'mairal')
		);
	end if;
	if not exists (select 1 from pg_constraint where conname = 'profiles_verificacion_valors') then
		alter table public.profiles add constraint profiles_verificacion_valors
			check (verificacion in ('en_espèra', 'verificat', 'refusat'));
	end if;
end;
$$;
create index if not exists profiles_en_espera on public.profiles (created_at) where verificacion = 'en_espèra';

-- Le profil de la personne connectée est-il vérifié ?
create or replace function public.es_verificat () returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (select 1 from public.profiles where user_id = auth.uid () and verificacion = 'verificat');
$$;
revoke all on function public.es_verificat () from public, anon;
grant execute on function public.es_verificat () to authenticated;


-- 2) LE VERROU DE LA VÉRIFICATION, ET LE FILTRE DU PROFIL
-- -----------------------------------------------------------------------------

create or replace function public.profiles_verificacion_garda () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	-- decidir_perfil() lève ce drapeau le temps de sa décision
	if coalesce(current_setting('loligam.verificacion', true), '') <> 'on' then
		if tg_op = 'INSERT' then
			-- l'administrateur est vérifié d'office, les autres attendent
			new.verificacion := case when exists (select 1 from public.admins where user_id = new.user_id)
				then 'verificat' else 'en_espèra' end;
			new.verificat_at := null;
			new.verificat_per := null;
		else
			new.verificacion := old.verificacion;
			new.verificat_at := old.verificat_at;
			new.verificat_per := old.verificat_per;
		end if;
	end if;
	new.presentacion := nullif(btrim(new.presentacion), '');
	new.ont := nullif(btrim(new.ont), '');
	if public.conten_mot_defendut (coalesce(new.presentacion, '') || ' ' || coalesce(new.ont, '')) then
		raise exception 'perfil_mot';
	end if;
	-- pas de liens dans un profil : il est validé une fois, puis modifiable
	if coalesce(new.presentacion, '') || ' ' || coalesce(new.ont, '')
		~* '(https?://|www\.|[a-z0-9-]+\.(com|fr|org|net|eu|io|ly|me|info|biz|ru|xyz)\M)' then
		raise exception 'perfil_ligam';
	end if;
	return new;
end;
$$;
revoke all on function public.profiles_verificacion_garda () from public, anon, authenticated;

drop trigger if exists profiles_verificacion_garda on public.profiles;
create trigger profiles_verificacion_garda before insert or update on public.profiles
	for each row execute function public.profiles_verificacion_garda ();

-- L'administrateur décide (verificat ou refusat, ou retour en_espèra)
create or replace function public.decidir_perfil (u uuid, d text) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.is_admin () then
		raise exception 'perfil_admin';
	end if;
	if d not in ('en_espèra', 'verificat', 'refusat') then
		raise exception 'perfil_decision';
	end if;
	perform set_config('loligam.verificacion', 'on', true);
	update public.profiles
	set verificacion = d,
		verificat_at = case when d = 'en_espèra' then null else now() end,
		verificat_per = case when d = 'en_espèra' then null else auth.uid () end
	where user_id = u;
	perform set_config('loligam.verificacion', 'off', true);
end;
$$;
revoke all on function public.decidir_perfil (uuid, text) from public, anon;
grant execute on function public.decidir_perfil (uuid, text) to authenticated;

-- Les profils qui attendent, pour la page de validation : avec l'adresse
-- (l'administrateur seul la voit) et la date d'inscription
create or replace function public.perfils_en_espera () returns table (
	user_id uuid, pseudo text, presentacion text, ont text, dialecte text, nivel text,
	adreca text, adreca_verificada boolean, inscrit_at timestamptz, verificacion text
) language plpgsql stable security definer
set
	search_path = '' as $$
begin
	if not public.is_admin () then
		raise exception 'perfil_admin';
	end if;
	return query
		select p.user_id, p.pseudo, p.presentacion, p.ont, p.dialecte, p.nivel,
			u.email::text, u.email_confirmed_at is not null, u.created_at, p.verificacion
		from public.profiles p
		join auth.users u on u.id = p.user_id
		where p.verificacion <> 'verificat'
		order by (p.verificacion = 'refusat'), u.created_at;
end;
$$;
revoke all on function public.perfils_en_espera () from public, anon;
grant execute on function public.perfils_en_espera () to authenticated;


-- 3) LE PROFIL VU PAR LES AUTRES
-- -----------------------------------------------------------------------------

-- Pour un membre vérifié (ou l'administrateur) : le profil vérifié d'un
-- pseudo, ses champs publics seulement, et les groupes que l'on a en commun
-- (pas tous ses groupes : on ne dévoile que ce qu'on partage déjà).
create or replace function public.perfil (p text) returns table (
	user_id uuid, pseudo text, presentacion text, ont text, dialecte text, nivel text,
	arribat_at timestamptz, es_admin boolean, grops_comuns jsonb
) language sql stable security definer
set
	search_path = '' as $$
	select pr.user_id, pr.pseudo, pr.presentacion, pr.ont, pr.dialecte, pr.nivel, pr.created_at,
		exists (select 1 from public.admins a where a.user_id = pr.user_id),
		coalesce((
			select jsonb_agg(jsonb_build_object('id', g.id, 'nom_oc', g.nom_oc, 'nom_fr', g.nom_fr) order by g.orde)
			from public.grop_membres a
			join public.grop_membres b on b.grop_id = a.grop_id and b.user_id = auth.uid ()
			join public.grops g on g.id = a.grop_id
			where a.user_id = pr.user_id
		), '[]'::jsonb)
	from public.profiles pr
	where public.normalizar (btrim(pr.pseudo)) = public.normalizar (btrim(p))
		and pr.verificacion = 'verificat'
		and (public.es_verificat () or public.is_admin ());
$$;
revoke all on function public.perfil (text) from public, anon;
grant execute on function public.perfil (text) to authenticated;

-- La liste des membres d'un groupe dit aussi qui est vérifié
drop function if exists public.membres_grop (text);
create function public.membres_grop (g text) returns table (user_id uuid, pseudo text, es_admin boolean, verificat boolean) language sql stable security definer
set
	search_path = '' as $$
	select gm.user_id, coalesce(p.pseudo, '…'),
		exists (select 1 from public.admins a where a.user_id = gm.user_id),
		coalesce(p.verificacion = 'verificat', false)
	from public.grop_membres gm
	left join public.profiles p on p.user_id = gm.user_id
	where gm.grop_id = g and (public.es_membre (g) or public.is_admin ());
$$;
revoke all on function public.membres_grop (text) from public, anon;
grant execute on function public.membres_grop (text) to authenticated;


-- 4) ÉCRIRE DANS UN GROUPE : IL FAUT UN PROFIL VÉRIFIÉ
-- -----------------------------------------------------------------------------

create or replace function public.pot_escriure (g text) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select public.es_membre (g)
		and public.adreca_verificada ()
		and public.es_verificat ()
		and not public.es_bandit ()
		and exists (select 1 from public.grops where id = g and estat = 'dobèrt');
$$;

-- un refus clair avant la règle d'accès (qui ne dirait que « refusé »)
create or replace function public.messatges_abans_mandar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not exists (select 1 from public.profiles where user_id = new.user_id and verificacion = 'verificat') then
		raise exception 'messatges_verificacion';
	end if;
	if public.conten_mot_defendut (new.tèxte) then
		raise exception 'messatges_mot' using hint = 'Aqueste messatge conten un mot defendut per la carta dels grops.';
	end if;
	if (select count(*) from public.messatges where user_id = new.user_id and created_at > now() - interval '1 minute') >= 8
		or (select count(*) from public.messatges where user_id = new.user_id and created_at > now() - interval '1 day') >= 300 then
		raise exception 'messatges_limit';
	end if;
	if new.tèxte ~* '(https?://|www\.|[a-z0-9-]+\.(com|fr|org|net|eu|io|ly|me|info|biz|ru|xyz)\M)'
		and (select created_at from auth.users where id = new.user_id) > now() - interval '7 days' then
		raise exception 'messatges_ligam';
	end if;
	perform public.purgar_grops ();
	return new;
end;
$$;


-- 5) LES PROFILS DÉJÀ LÀ : l'administrateur est vérifié d'office
-- -----------------------------------------------------------------------------

do $$
begin
	perform set_config('loligam.verificacion', 'on', true);
	update public.profiles p set verificacion = 'verificat', verificat_at = coalesce(verificat_at, now())
	where verificacion <> 'verificat' and exists (select 1 from public.admins a where a.user_id = p.user_id);
	perform set_config('loligam.verificacion', 'off', true);
end;
$$;


-- 6) LISTES À COCHER ET LIEU DE LA CARTE (2026-10-25, Romain : « il faut une
--    liste, car flemme d'écrire pour beaucoup » ; le lieu se cherche dans la
--    base de communes de la carte, en français et en occitan)
-- -----------------------------------------------------------------------------

alter table public.profiles add column if not exists cerca text[];
alter table public.profiles add column if not exists agrada text[];
alter table public.profiles add column if not exists ont_oc text;
alter table public.profiles add column if not exists ont_dep text;

do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'profiles_perfil_listas') then
		alter table public.profiles add constraint profiles_perfil_listas check (
			cerca <@ array['parlar', 'escriure', 'aprene', 'trobar', 'ajudar']
			and agrada <@ array['musica', 'cant', 'danca', 'bal', 'cosina', 'literatura', 'teatre', 'cinema', 'natura', 'istoria', 'jocs']
			and char_length(ont_oc) <= 80
			and char_length(ont_dep) <= 6
		);
	end if;
end;
$$;

drop function if exists public.perfil (text);
create function public.perfil (p text) returns table (
	user_id uuid, pseudo text, presentacion text, ont text, ont_oc text, ont_dep text, dialecte text, nivel text,
	cerca text[], agrada text[], arribat_at timestamptz, es_admin boolean, grops_comuns jsonb
) language sql stable security definer
set
	search_path = '' as $$
	select pr.user_id, pr.pseudo, pr.presentacion, pr.ont, pr.ont_oc, pr.ont_dep, pr.dialecte, pr.nivel,
		pr.cerca, pr.agrada, pr.created_at,
		exists (select 1 from public.admins a where a.user_id = pr.user_id),
		coalesce((
			select jsonb_agg(jsonb_build_object('id', g.id, 'nom_oc', g.nom_oc, 'nom_fr', g.nom_fr) order by g.orde)
			from public.grop_membres a
			join public.grop_membres b on b.grop_id = a.grop_id and b.user_id = auth.uid ()
			join public.grops g on g.id = a.grop_id
			where a.user_id = pr.user_id
		), '[]'::jsonb)
	from public.profiles pr
	where public.normalizar (btrim(pr.pseudo)) = public.normalizar (btrim(p))
		and pr.verificacion = 'verificat'
		and (public.es_verificat () or public.is_admin ());
$$;
revoke all on function public.perfil (text) from public, anon;
grant execute on function public.perfil (text) to authenticated;

drop function if exists public.perfils_en_espera ();
create function public.perfils_en_espera () returns table (
	user_id uuid, pseudo text, presentacion text, ont text, ont_oc text, dialecte text, nivel text,
	cerca text[], agrada text[], adreca text, adreca_verificada boolean, inscrit_at timestamptz, verificacion text
) language plpgsql stable security definer
set
	search_path = '' as $$
begin
	if not public.is_admin () then
		raise exception 'perfil_admin';
	end if;
	return query
		select p.user_id, p.pseudo, p.presentacion, p.ont, p.ont_oc, p.dialecte, p.nivel, p.cerca, p.agrada,
			u.email::text, u.email_confirmed_at is not null, u.created_at, p.verificacion
		from public.profiles p
		join auth.users u on u.id = p.user_id
		where p.verificacion <> 'verificat'
		order by (p.verificacion = 'refusat'), u.created_at;
end;
$$;
revoke all on function public.perfils_en_espera () from public, anon;
grant execute on function public.perfils_en_espera () to authenticated;

-- -----------------------------------------------------------------------------
-- 7) LE LIEU PARTOUT DANS LE MONDE (2026-10-25, Romain : « ça peut être New
--    York, Lyon, Alger » ; le département entre parenthèses, le pays hors de
--    France ; la croix du logo pour une commune d'Occitanie)
--    ont_dep : département (34, 69, 2A, 971, ARAN, IT) ; ont_pais : le pays
--    hors de France ; ont_occitania : choisie dans les communes de la carte
-- -----------------------------------------------------------------------------

alter table public.profiles add column if not exists ont_pais text;
alter table public.profiles add column if not exists ont_occitania boolean not null default false;
-- avant cette colonne, seul un lieu d'Occitanie avait un département
update public.profiles set ont_occitania = true where ont_dep is not null and not ont_occitania;

do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'profiles_perfil_pais') then
		alter table public.profiles add constraint profiles_perfil_pais check (char_length(ont_pais) <= 60);
	end if;
end;
$$;

drop function if exists public.perfil (text);
create function public.perfil (p text) returns table (
	user_id uuid, pseudo text, presentacion text, ont text, ont_oc text, ont_dep text, ont_pais text, ont_occitania boolean,
	dialecte text, nivel text, cerca text[], agrada text[], arribat_at timestamptz, es_admin boolean, grops_comuns jsonb
) language sql stable security definer
set
	search_path = '' as $$
	select pr.user_id, pr.pseudo, pr.presentacion, pr.ont, pr.ont_oc, pr.ont_dep, pr.ont_pais, pr.ont_occitania,
		pr.dialecte, pr.nivel, pr.cerca, pr.agrada, pr.created_at,
		exists (select 1 from public.admins a where a.user_id = pr.user_id),
		coalesce((
			select jsonb_agg(jsonb_build_object('id', g.id, 'nom_oc', g.nom_oc, 'nom_fr', g.nom_fr) order by g.orde)
			from public.grop_membres a
			join public.grop_membres b on b.grop_id = a.grop_id and b.user_id = auth.uid ()
			join public.grops g on g.id = a.grop_id
			where a.user_id = pr.user_id
		), '[]'::jsonb)
	from public.profiles pr
	where public.normalizar (btrim(pr.pseudo)) = public.normalizar (btrim(p))
		and pr.verificacion = 'verificat'
		and (public.es_verificat () or public.is_admin ());
$$;
revoke all on function public.perfil (text) from public, anon;
grant execute on function public.perfil (text) to authenticated;

drop function if exists public.perfils_en_espera ();
create function public.perfils_en_espera () returns table (
	user_id uuid, pseudo text, presentacion text, ont text, ont_oc text, ont_dep text, ont_pais text, ont_occitania boolean,
	dialecte text, nivel text, cerca text[], agrada text[], adreca text, adreca_verificada boolean, inscrit_at timestamptz, verificacion text
) language plpgsql stable security definer
set
	search_path = '' as $$
begin
	if not public.is_admin () then
		raise exception 'perfil_admin';
	end if;
	return query
		select p.user_id, p.pseudo, p.presentacion, p.ont, p.ont_oc, p.ont_dep, p.ont_pais, p.ont_occitania,
			p.dialecte, p.nivel, p.cerca, p.agrada,
			u.email::text, u.email_confirmed_at is not null, u.created_at, p.verificacion
		from public.profiles p
		join auth.users u on u.id = p.user_id
		where p.verificacion <> 'verificat'
		order by (p.verificacion = 'refusat'), u.created_at;
end;
$$;
revoke all on function public.perfils_en_espera () from public, anon;
grant execute on function public.perfils_en_espera () to authenticated;
