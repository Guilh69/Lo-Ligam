-- Lo Ligam — groupes d'Amassa, correctifs après relecture (2026-10-25)
-- =============================================================================
-- À coller après supabase-grops.sql. Rejouable. Quatre corrections :
--
-- 1) LE DIRECT PAR CANAUX PRIVÉS. Supabase déconseille « Postgres Changes »
--    dès que le volume monte (chaque message contrôlé une fois par personne
--    connectée, sur un seul fil) ; et un message masqué ou supprimé restait
--    affiché chez ceux qui avaient la discussion ouverte. Désormais la base
--    envoie elle-même trois avis sur le canal privé « grop:<id> » : nòu
--    (nouveau message), amagat (masqué : son numéro et le motif, jamais son
--    texte), suprimit (supprimé) ; et restablit quand l'administrateur rétablit
--    un message. Le droit d'écouter un canal est vérifié UNE fois, à
--    l'ouverture : il faut être membre du groupe (ou administrateur).
--
-- 2) LES PSEUDOS, désormais vus par les autres membres : uniques (sans tenir
--    compte des majuscules, des accents ni des chiffres déguisés), de 2 à 30
--    caractères, passés au filtre de mots, et quelques noms réservés
--    (moderacion, admin, Lo Ligam…) sauf pour l'administrateur. La liste des
--    membres dit qui est administrateur (insigne « moderacion » dans le chat).
--
-- 3) LES MESSAGES NON LUS : la base retient où chacun s'est arrêté
--    (grop_membres.legit_at) ; public.mos_grops() rend en une seule demande
--    la liste de ses groupes, avec la date du dernier message et le nombre de
--    non-lus.
--
-- 4) L'APERÇU DES LIENS d'invitation : rien à changer dans la base (la liste
--    des groupes et leurs nombres de membres sont déjà publics) ; la page du
--    groupe fournit le titre et la phrase aux réseaux.


-- 1) LE DIRECT
-- -----------------------------------------------------------------------------

do $$
begin
	if exists (
		select 1 from pg_publication_tables
		where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messatges'
	) then
		alter publication supabase_realtime drop table public.messatges;
	end if;
end;
$$;

create or replace function public.messatges_difusar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
declare
	g text := coalesce(new.grop_id, old.grop_id);
begin
	if tg_op = 'INSERT' then
		perform realtime.send(
			jsonb_build_object('id', new.id, 'user_id', new.user_id, 'tèxte', new.tèxte, 'created_at', new.created_at),
			'nòu', 'grop:' || g, true);
	elsif tg_op = 'UPDATE' and new.amagat and not old.amagat then
		perform realtime.send(jsonb_build_object('id', new.id, 'motiu', new.motiu), 'amagat', 'grop:' || g, true);
	elsif tg_op = 'UPDATE' and old.amagat and not new.amagat then
		perform realtime.send(
			jsonb_build_object('id', new.id, 'user_id', new.user_id, 'tèxte', new.tèxte, 'created_at', new.created_at),
			'restablit', 'grop:' || g, true);
	elsif tg_op = 'DELETE' then
		perform realtime.send(jsonb_build_object('id', old.id), 'suprimit', 'grop:' || g, true);
	end if;
	return null;
end;
$$;
revoke all on function public.messatges_difusar () from public, anon, authenticated;

drop trigger if exists messatges_difusar on public.messatges;
create trigger messatges_difusar after insert or update or delete on public.messatges
	for each row execute function public.messatges_difusar ();

-- Écouter le canal « grop:<id> » : membres du groupe et administrateur.
-- Personne n'émet sur ces canaux depuis le navigateur (pas de règle d'envoi).
drop policy if exists "grops : les membres écoutent leur groupe" on realtime.messages;
create policy "grops : les membres écoutent leur groupe" on realtime.messages for select to authenticated
	using (
		realtime.messages.extension = 'broadcast'
		and (select realtime.topic ()) like 'grop:%'
		and (public.es_membre (substr((select realtime.topic ()), 6)) or (select public.is_admin ()))
	);


-- 2) LES PSEUDOS
-- -----------------------------------------------------------------------------

do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'profiles_pseudo_longor') then
		alter table public.profiles add constraint profiles_pseudo_longor
			check (char_length(btrim(pseudo)) between 2 and 30);
	end if;
end;
$$;

create unique index if not exists profiles_pseudo_unic on public.profiles (public.normalizar (btrim(pseudo)));

create or replace function public.profiles_pseudo_verificar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	new.pseudo := btrim(new.pseudo);
	if public.conten_mot_defendut (new.pseudo) then
		raise exception 'pseudo_mot';
	end if;
	if public.normalizar (new.pseudo) ~ '\m(moderac|moderat|admin|loligam|lo ligam|equipa|equipe)'
		and not exists (select 1 from public.admins where user_id = new.user_id) then
		raise exception 'pseudo_reservat';
	end if;
	return new;
end;
$$;
revoke all on function public.profiles_pseudo_verificar () from public, anon, authenticated;

drop trigger if exists profiles_pseudo_verificar on public.profiles;
create trigger profiles_pseudo_verificar before insert or update of pseudo on public.profiles
	for each row execute function public.profiles_pseudo_verificar ();

-- La liste des membres dit qui est administrateur (le type de retour change :
-- il faut supprimer l'ancienne fonction)
drop function if exists public.membres_grop (text);
create function public.membres_grop (g text) returns table (user_id uuid, pseudo text, es_admin boolean) language sql stable security definer
set
	search_path = '' as $$
	select gm.user_id, coalesce(p.pseudo, '…'), exists (select 1 from public.admins a where a.user_id = gm.user_id)
	from public.grop_membres gm
	left join public.profiles p on p.user_id = gm.user_id
	where gm.grop_id = g and (public.es_membre (g) or public.is_admin ());
$$;
revoke all on function public.membres_grop (text) from public, anon;
grant execute on function public.membres_grop (text) to authenticated;


-- 3) LES NON-LUS
-- -----------------------------------------------------------------------------

alter table public.grop_membres add column if not exists legit_at timestamptz not null default now();

create or replace function public.marcar_legit (g text) returns void language sql security definer
set
	search_path = '' as $$
	update public.grop_membres set legit_at = now() where grop_id = g and user_id = auth.uid ();
$$;

-- Ses groupes, du plus récemment actif au moins actif, avec les non-lus
-- (messages des autres, non masqués, écrits depuis sa dernière lecture)
create or replace function public.mos_grops () returns table (
	grop_id text, mena text, nom_oc text, nom_fr text, estat text, darrier_at timestamptz, non_legits integer
) language sql stable security definer
set
	search_path = '' as $$
	select g.id, g.mena, g.nom_oc, g.nom_fr, g.estat,
		(select max(m.created_at) from public.messatges m where m.grop_id = g.id and not m.amagat),
		(select count(*)::integer from public.messatges m
			where m.grop_id = g.id and not m.amagat and m.created_at > gm.legit_at and m.user_id <> gm.user_id)
	from public.grop_membres gm
	join public.grops g on g.id = gm.grop_id
	where gm.user_id = auth.uid ()
	order by 6 desc nulls last, g.orde;
$$;

revoke all on function public.marcar_legit (text), public.mos_grops () from public, anon;
grant execute on function public.marcar_legit (text), public.mos_grops () to authenticated;
