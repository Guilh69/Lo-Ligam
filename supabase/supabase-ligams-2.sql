-- Lo Ligam — Parlar amassa, étape 2 : un seul profil (décision de Romain, 2026-11-14)
-- =============================================================================
-- « On ne devrait pas redemander des informations » : la présentation, le
-- niveau et les goûts viennent du profil du compte (public.profiles :
-- presentacion, nivel, agrada). Parlar amassa ne garde que ce qui lui est
-- propre :
--   - OÙ chercher (comuna, lat, lon), qui peut différer de la commune du compte ;
--   - CE QUE la personne cherche ici (cerca, mêmes valeurs que profiles.cerca) ;
--   - le contact (ligam_contactes, inchangé) et la visibilité.
-- Le rôle « parle / apprend » se déduit du niveau du compte :
--   debutant, apren → apren ; parla, mairal → parla.
--
-- À exécuter après supabase-ligams.sql. Rejouable.

-- 1) Colonnes en double retirées, « cerca » ajoutée
alter table public.ligam_perfils drop column if exists rotle;
alter table public.ligam_perfils drop column if exists interesses;
alter table public.ligam_perfils drop column if exists presentacion;
alter table public.ligam_perfils add column if not exists cerca text[] not null default '{}';
do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'ligam_perfils_cerca') then
		alter table public.ligam_perfils add constraint ligam_perfils_cerca
			check (cerca <@ array['parlar', 'escriure', 'aprene', 'trobar', 'ajudar']::text[]);
	end if;
end;
$$;

-- Rôle déduit du niveau du compte
create or replace function public.ligam_rotle (nivel text) returns text language sql immutable
set
	search_path = '' as $$
	select case when nivel in ('debutant', 'apren') then 'apren' when nivel in ('parla', 'mairal') then 'parla' end;
$$;

-- 2) Le déclencheur du profil ne vérifie plus une présentation qui n'est plus là
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
	if public.conten_mot_defendut (new.comuna) or new.comuna ~ '[/<>:]' then
		raise exception 'ligam_mot';
	end if;
	return new;
end;
$$;
revoke all on function public.ligam_abans_perfil () from public, anon, authenticated;

-- 3) Les listes lisent le profil du compte (la forme renvoyée change : il
--    faut supprimer les anciennes fonctions)
drop function if exists public.ligam_vesins (numeric, numeric, integer, text, text);
create function public.ligam_vesins (p_lat numeric, p_lon numeric, p_km integer default 30, p_rotle text default null, p_interes text default null)
returns table (user_id uuid, pseudo text, rotle text, nivel text, comuna text, km integer, agrada text[], cerca text[], presentacion text, vist text)
language sql stable security definer
set
	search_path = '' as $$
	select p.user_id, pr.pseudo, public.ligam_rotle (pr.nivel), pr.nivel, p.comuna,
		(public.ligam_km (p_lat, p_lon, p.lat, p.lon) / 5) * 5, coalesce(pr.agrada, '{}'), p.cerca, pr.presentacion,
		public.ligam_vist (p.darriera_vista)
	from public.ligam_perfils p
	join public.profiles pr on pr.user_id = p.user_id
	where public.ligam_pot_agir ()
		and p.visible
		and pr.verificacion = 'verificat'
		and not public.ligam_amagat (p.user_id)
		and p.user_id <> auth.uid ()
		and not exists (select 1 from public.bandiments b where b.user_id = p.user_id and (b.fins is null or b.fins > now()))
		and not public.ligam_blocat (auth.uid (), p.user_id)
		and (p_rotle is null or public.ligam_rotle (pr.nivel) = p_rotle)
		and (p_interes is null or p_interes = any (pr.agrada))
		and public.ligam_km (p_lat, p_lon, p.lat, p.lon) <= (least(greatest(p_km, 5), 200) / 5) * 5
	order by 6, p.darriera_vista desc
	limit 100;
$$;

drop function if exists public.ligam_anoncias_vesinas (numeric, numeric, integer, text, text);
create function public.ligam_anoncias_vesinas (p_lat numeric, p_lon numeric, p_km integer default 30, p_rotle text default null, p_interes text default null)
returns table (id bigint, user_id uuid, pseudo text, rotle text, comuna text, km integer, texte text, created_at timestamptz)
language sql stable security definer
set
	search_path = '' as $$
	select a.id, a.user_id, pr.pseudo, public.ligam_rotle (pr.nivel), p.comuna,
		(public.ligam_km (p_lat, p_lon, p.lat, p.lon) / 5) * 5, a.texte, a.created_at
	from public.ligam_anoncias a
	join public.ligam_perfils p on p.user_id = a.user_id
	join public.profiles pr on pr.user_id = a.user_id
	where public.ligam_pot_agir ()
		and a.expira > now()
		and p.visible
		and pr.verificacion = 'verificat'
		and not public.ligam_amagat (p.user_id)
		and not exists (select 1 from public.bandiments b where b.user_id = a.user_id and (b.fins is null or b.fins > now()))
		and not public.ligam_blocat (auth.uid (), a.user_id)
		and (p_rotle is null or public.ligam_rotle (pr.nivel) = p_rotle)
		and (p_interes is null or p_interes = any (pr.agrada))
		and public.ligam_km (p_lat, p_lon, p.lat, p.lon) <= (least(greatest(p_km, 5), 200) / 5) * 5
	order by a.created_at desc
	limit 100;
$$;

revoke all on function public.ligam_vesins (numeric, numeric, integer, text, text),
	public.ligam_anoncias_vesinas (numeric, numeric, integer, text, text) from public, anon;
grant execute on function public.ligam_vesins (numeric, numeric, integer, text, text),
	public.ligam_anoncias_vesinas (numeric, numeric, integer, text, text) to authenticated;

-- 4) Les cercles gardent leur liste de thèmes, alignée sur les goûts du compte
alter table public.ligam_cercles drop constraint if exists ligam_cercles_interesses_check;
create or replace function public.ligam_interes_valid (t text[]) returns boolean language sql immutable
set
	search_path = '' as $$
	select coalesce(cardinality(t), 0) <= 8
		and coalesce(t <@ array['musica', 'cant', 'danca', 'bal', 'cosina', 'literatura', 'teatre', 'cinema', 'natura', 'istoria', 'jocs']::text[], true);
$$;
alter table public.ligam_cercles add constraint ligam_cercles_interesses_check check (public.ligam_interes_valid (interesses));

-- 5) Profils VALIDÉS par Romain seulement (audit de Rodrigo, 14-11 ; c'était
--    l'idée de départ de Romain : « si deux personnes ont des profils
--    validés »). Les listes ne montrent que des profils validés (ci-dessus) ;
--    pour demander un contact, il faut aussi le sien validé : un profil refusé
--    ne contacte personne.
create or replace function public.ligam_demandar_verificat () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not exists (select 1 from public.profiles where user_id = new.de and verificacion = 'verificat') then
		raise exception 'ligam_perfil_verificat';
	end if;
	return new;
end;
$$;
revoke all on function public.ligam_demandar_verificat () from public, anon, authenticated;
drop trigger if exists ligam_demandar_verificat on public.ligam_demandas;
create trigger ligam_demandar_verificat before insert on public.ligam_demandas
	for each row execute function public.ligam_demandar_verificat ();
