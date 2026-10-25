-- Lo Ligam — contacts et messages un à un d'Amassa (2026-10-25)
-- =============================================================================
-- Deuxième temps de la partie sociale (cahier §11 : profils vérifiés, puis
-- messages un à un, puis abonnements). Romain : « oui, lance les contacts et
-- les messages un à un ».
--
-- Les règles :
--   · on demande un contact depuis un profil ; l'autre accepte ou refuse ;
--     seuls les profils vérifiés demandent, acceptent et écrivent ;
--   · on n'écrit qu'à un contact accepté, et jamais si l'un a bloqué l'autre ;
--   · bloquer retire le contact ; la personne bloquée ne le voit pas écrit ;
--   · même filtre que les groupes (mots interdits, débit, liens des comptes
--     neufs), messages effacés au bout d'un an ;
--   · on signale un message reçu ; la modération ne lit QUE les messages
--     signalés, jamais les autres ; un message signalé ne s'efface plus ;
--   · le direct passe par un canal privé par personne (« ieu:<id> »), que
--     seule cette personne écoute.
--
-- À coller dans Supabase → SQL Editor → Run, après supabase-grops.sql,
-- supabase-grops-2.sql et supabase-perfils.sql. Rejouable.


-- 0) LES TABLES
-- -----------------------------------------------------------------------------

-- Une demande (de → a), puis un contact une fois acceptée ; une seule ligne
-- par paire, dans un sens ou dans l'autre
create table if not exists public.contactes (
	de uuid not null references auth.users (id) on delete cascade,
	a uuid not null references auth.users (id) on delete cascade,
	estat text not null default 'demandat' check (estat in ('demandat', 'acceptat')),
	created_at timestamptz not null default now(),
	acceptat_at timestamptz,
	primary key (de, a),
	check (de <> a)
);
create unique index if not exists contactes_parelh on public.contactes (least(de, a), greatest(de, a));
create index if not exists contactes_a on public.contactes (a);

create table if not exists public.blocatges (
	user_id uuid not null references auth.users (id) on delete cascade,
	blocat uuid not null references auth.users (id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (user_id, blocat),
	check (user_id <> blocat)
);
create index if not exists blocatges_blocat on public.blocatges (blocat);

create table if not exists public.messatges_privats (
	id bigint generated always as identity primary key,
	de uuid not null default auth.uid () references auth.users (id) on delete cascade,
	a uuid not null references auth.users (id) on delete cascade,
	tèxte text not null check (char_length(btrim(tèxte)) between 1 and 1000),
	legit_at timestamptz,
	created_at timestamptz not null default now(),
	check (de <> a)
);
create index if not exists messatges_privats_parelh on public.messatges_privats (least(de, a), greatest(de, a), created_at desc);
create index if not exists messatges_privats_non_legits on public.messatges_privats (a, de) where legit_at is null;
create index if not exists messatges_privats_de_created on public.messatges_privats (de, created_at desc);
create index if not exists messatges_privats_created on public.messatges_privats (created_at);

create table if not exists public.senhalaments_privats (
	id bigint generated always as identity primary key,
	messatge_id bigint not null references public.messatges_privats (id) on delete cascade,
	user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
	motiu text not null check (motiu in ('insulta', 'assetjament', 'odi', 'spam', 'autre')),
	precisions text check (char_length(precisions) <= 500),
	tractat boolean not null default false,
	created_at timestamptz not null default now(),
	unique (messatge_id, user_id)
);
create index if not exists senhalaments_privats_user_id on public.senhalaments_privats (user_id);


-- 1) LES PETITES FONCTIONS (oui ou non, pour soi-même)
-- -----------------------------------------------------------------------------

create or replace function public.es_contacte (u uuid) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (
		select 1 from public.contactes
		where estat = 'acceptat' and ((de = auth.uid () and a = u) or (de = u and a = auth.uid ()))
	);
$$;

-- L'un a bloqué l'autre (dans un sens ou dans l'autre)
create or replace function public.es_blocat_entre (u uuid) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (
		select 1 from public.blocatges
		where (user_id = auth.uid () and blocat = u) or (user_id = u and blocat = auth.uid ())
	);
$$;

create or replace function public.pot_escriure_a (u uuid) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select public.es_verificat ()
		and public.adreca_verificada ()
		and not public.es_bandit ()
		and public.es_contacte (u)
		and not public.es_blocat_entre (u);
$$;

-- Message signalé ? Message reçu par soi ? (les règles du §2 passent par ces
-- fonctions : sans elles, messages et signalements se vérifieraient l'un
-- l'autre en boucle, refusé par Postgres)
create or replace function public.es_senhalat_privat (m bigint) returns boolean language sql stable security definer
set
	search_path = '' as $
	select exists (select 1 from public.senhalaments_privats where messatge_id = m);
$;
create or replace function public.es_recebut_privat (m bigint) returns boolean language sql stable security definer
set
	search_path = '' as $
	select exists (select 1 from public.messatges_privats where id = m and a = auth.uid ());
$;

revoke all on function public.es_senhalat_privat (bigint), public.es_recebut_privat (bigint) from public, anon;
grant execute on function public.es_senhalat_privat (bigint), public.es_recebut_privat (bigint) to authenticated;
revoke all on function public.es_contacte (uuid), public.es_blocat_entre (uuid), public.pot_escriure_a (uuid) from public, anon;
grant execute on function public.es_contacte (uuid), public.es_blocat_entre (uuid), public.pot_escriure_a (uuid) to authenticated;


-- 2) LES RÈGLES D'ACCÈS (RLS) : chacun voit ce qui le concerne ; les contacts
--    et les blocages ne s'écrivent que par les fonctions du §3
-- -----------------------------------------------------------------------------

alter table public.contactes enable row level security;
alter table public.blocatges enable row level security;
alter table public.messatges_privats enable row level security;
alter table public.senhalaments_privats enable row level security;

drop policy if exists "contactes : lire les siens" on public.contactes;
create policy "contactes : lire les siens" on public.contactes for select to authenticated
	using (de = (select auth.uid ()) or a = (select auth.uid ()));

-- (on voit qui l'on a bloqué, jamais qui nous a bloqué)
drop policy if exists "blocatges : lire les siens" on public.blocatges;
create policy "blocatges : lire les siens" on public.blocatges for select to authenticated
	using (user_id = (select auth.uid ()));

-- Les messages : les deux personnes ; la modération, seulement s'il est signalé
drop policy if exists "messatges_privats : les deux personnes lisent" on public.messatges_privats;
create policy "messatges_privats : les deux personnes lisent" on public.messatges_privats for select to authenticated
	using (
		de = (select auth.uid ()) or a = (select auth.uid ())
		or ((select public.is_admin ()) and public.es_senhalat_privat (id))
	);
drop policy if exists "messatges_privats : écrire à un contact" on public.messatges_privats;
create policy "messatges_privats : écrire à un contact" on public.messatges_privats for insert to authenticated
	with check (de = (select auth.uid ()) and legit_at is null and public.pot_escriure_a (a));
-- Supprimer le sien, sauf s'il est signalé (la preuve reste pour la modération)
drop policy if exists "messatges_privats : supprimer le sien" on public.messatges_privats;
create policy "messatges_privats : supprimer le sien" on public.messatges_privats for delete to authenticated
	using (
		(de = (select auth.uid ()) and not public.es_senhalat_privat (id))
		or (select public.is_admin ())
	);

-- Signaler un message reçu
drop policy if exists "senhalaments_privats : signaler un message reçu" on public.senhalaments_privats;
create policy "senhalaments_privats : signaler un message reçu" on public.senhalaments_privats for insert to authenticated
	with check (user_id = (select auth.uid ()) and not tractat and public.es_recebut_privat (messatge_id));
drop policy if exists "senhalaments_privats : lire les siens, ou tout si admin" on public.senhalaments_privats;
create policy "senhalaments_privats : lire les siens, ou tout si admin" on public.senhalaments_privats for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "senhalaments_privats : l'admin traite" on public.senhalaments_privats;
create policy "senhalaments_privats : l'admin traite" on public.senhalaments_privats for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "senhalaments_privats : l'admin retire" on public.senhalaments_privats;
create policy "senhalaments_privats : l'admin retire" on public.senhalaments_privats for delete to authenticated
	using ((select public.is_admin ()));


-- 3) DEMANDER, ACCEPTER, RETIRER, BLOQUER
-- -----------------------------------------------------------------------------

-- Demander un contact. Si l'autre l'avait déjà demandé, c'est accepté.
-- Renvoie 'mandada' (demande envoyée) ou 'acceptat'.
create or replace function public.demandar_contacte (u uuid) returns text language plpgsql security definer
set
	search_path = '' as $$
declare
	e text;
	de_u uuid;
begin
	if auth.uid () is null then raise exception 'grops_compte'; end if;
	if not public.es_verificat () then raise exception 'messatges_verificacion'; end if;
	if public.es_bandit () then raise exception 'grops_bandit'; end if;
	if u = auth.uid () then raise exception 'contactes_impossible'; end if;
	if public.es_blocat_entre (u)
		or not exists (select 1 from public.profiles where user_id = u and verificacion = 'verificat') then
		raise exception 'contactes_impossible';
	end if;
	select c.estat, c.de into e, de_u from public.contactes c
		where (c.de = auth.uid () and c.a = u) or (c.de = u and c.a = auth.uid ())
		for update;
	if e = 'acceptat' then return 'acceptat'; end if;
	if e = 'demandat' and de_u = u then
		update public.contactes set estat = 'acceptat', acceptat_at = now() where de = u and a = auth.uid ();
		return 'acceptat';
	end if;
	if e = 'demandat' then return 'mandada'; end if;
	if (select count(*) from public.contactes where de = auth.uid () and created_at > now() - interval '1 day') >= 30 then
		raise exception 'contactes_limit';
	end if;
	insert into public.contactes (de, a) values (auth.uid (), u);
	return 'mandada';
end;
$$;

-- Répondre à une demande reçue : accepter, ou refuser (la demande s'efface,
-- sans prévenir la personne)
create or replace function public.respondre_contacte (u uuid, accepta boolean) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if accepta then
		if not public.es_verificat () then raise exception 'messatges_verificacion'; end if;
		update public.contactes set estat = 'acceptat', acceptat_at = now()
			where de = u and a = auth.uid () and estat = 'demandat';
	else
		delete from public.contactes where de = u and a = auth.uid () and estat = 'demandat';
	end if;
	if not found then raise exception 'contactes_inconegut'; end if;
end;
$$;

-- Retirer un contact, ou annuler sa demande
create or replace function public.quitar_contacte (u uuid) returns void language sql security definer
set
	search_path = '' as $$
	delete from public.contactes where (de = auth.uid () and a = u) or (de = u and a = auth.uid ());
$$;

-- Bloquer : le contact (ou la demande) disparaît, plus de messages possibles
create or replace function public.blocar (u uuid) returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if auth.uid () is null or u = auth.uid () then raise exception 'contactes_impossible'; end if;
	insert into public.blocatges (user_id, blocat) values (auth.uid (), u) on conflict do nothing;
	delete from public.contactes where (de = auth.uid () and a = u) or (de = u and a = auth.uid ());
end;
$$;

create or replace function public.desblocar (u uuid) returns void language sql security definer
set
	search_path = '' as $$
	delete from public.blocatges where user_id = auth.uid () and blocat = u;
$$;

-- Le lien avec une personne, vu de soi : 'blocat' (on l'a bloquée), 'acceptat',
-- 'mandada' (on a demandé), 'recebuda' (elle a demandé) ou 'cap'
create or replace function public.relacion (u uuid) returns text language sql stable security definer
set
	search_path = '' as $$
	select case
		when exists (select 1 from public.blocatges where user_id = auth.uid () and blocat = u) then 'blocat'
		else coalesce((
			select case when c.estat = 'acceptat' then 'acceptat' when c.de = auth.uid () then 'mandada' else 'recebuda' end
			from public.contactes c
			where (c.de = auth.uid () and c.a = u) or (c.de = u and c.a = auth.uid ())
		), 'cap')
	end;
$$;

-- Ses contacts et demandes : les demandes reçues d'abord, puis les
-- conversations les plus récentes, avec les messages non lus
create or replace function public.mos_contactes () returns table (
	user_id uuid, pseudo text, estat text, darrier_at timestamptz, non_legits integer
) language sql stable security definer
set
	search_path = '' as $$
	select o.u, coalesce(p.pseudo, '…'), o.estat,
		(select max(m.created_at) from public.messatges_privats m
			where least(m.de, m.a) = least(o.u, auth.uid ()) and greatest(m.de, m.a) = greatest(o.u, auth.uid ())),
		(select count(*)::integer from public.messatges_privats m
			where m.a = auth.uid () and m.de = o.u and m.legit_at is null)
	from (
		select case when c.de = auth.uid () then c.a else c.de end as u,
			case when c.estat = 'acceptat' then 'acceptat' when c.de = auth.uid () then 'mandada' else 'recebuda' end as estat
		from public.contactes c
		where c.de = auth.uid () or c.a = auth.uid ()
	) o
	left join public.profiles p on p.user_id = o.u
	order by (o.estat = 'recebuda') desc, 4 desc nulls last, 2;
$$;

create or replace function public.marcar_legit_privat (u uuid) returns void language sql security definer
set
	search_path = '' as $$
	update public.messatges_privats set legit_at = now() where a = auth.uid () and de = u and legit_at is null;
$$;

revoke all on function public.demandar_contacte (uuid), public.respondre_contacte (uuid, boolean),
	public.quitar_contacte (uuid), public.blocar (uuid), public.desblocar (uuid), public.relacion (uuid),
	public.mos_contactes (), public.marcar_legit_privat (uuid) from public, anon;
grant execute on function public.demandar_contacte (uuid), public.respondre_contacte (uuid, boolean),
	public.quitar_contacte (uuid), public.blocar (uuid), public.desblocar (uuid), public.relacion (uuid),
	public.mos_contactes (), public.marcar_legit_privat (uuid) to authenticated;


-- 4) LES GARDE-FOUS : mêmes règles que les groupes
-- -----------------------------------------------------------------------------

create or replace function public.messatges_privats_abans_mandar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if not public.pot_escriure_a (new.a) then
		if not public.es_verificat () then raise exception 'messatges_verificacion'; end if;
		if public.es_bandit () then raise exception 'grops_bandit'; end if;
		raise exception 'privats_contacte';
	end if;
	if public.conten_mot_defendut (new.tèxte) then
		raise exception 'messatges_mot';
	end if;
	if (select count(*) from public.messatges_privats where de = new.de and created_at > now() - interval '1 minute') >= 8
		or (select count(*) from public.messatges_privats where de = new.de and created_at > now() - interval '1 day') >= 300 then
		raise exception 'messatges_limit';
	end if;
	if new.tèxte ~* '(https?://|www\.|[a-z0-9-]+\.(com|fr|org|net|eu|io|ly|me|info|biz|ru|xyz)\M)'
		and (select created_at from auth.users where id = new.de) > now() - interval '7 days' then
		raise exception 'messatges_ligam';
	end if;
	-- un an, puis effacé (sauf signalé : la modération décide)
	delete from public.messatges_privats m
		where m.created_at < now() - interval '1 year'
		and not exists (select 1 from public.senhalaments_privats s where s.messatge_id = m.id and not s.tractat);
	return new;
end;
$$;

drop trigger if exists messatges_privats_abans_mandar on public.messatges_privats;
create trigger messatges_privats_abans_mandar before insert on public.messatges_privats
	for each row execute function public.messatges_privats_abans_mandar ();


-- 5) LE DIRECT : un canal privé par personne, « ieu:<id> »
-- -----------------------------------------------------------------------------

create or replace function public.messatges_privats_difusar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
declare
	m public.messatges_privats := coalesce(new, old);
	ev text := case when tg_op = 'INSERT' then 'privat' else 'privat_suprimit' end;
	p jsonb;
begin
	p := case when tg_op = 'INSERT'
		then jsonb_build_object('id', m.id, 'de', m.de, 'a', m.a, 'tèxte', m.tèxte, 'created_at', m.created_at)
		else jsonb_build_object('id', m.id, 'de', m.de, 'a', m.a) end;
	perform realtime.send(p, ev, 'ieu:' || m.a, true);
	perform realtime.send(p, ev, 'ieu:' || m.de, true);
	return null;
end;
$$;

drop trigger if exists messatges_privats_difusar on public.messatges_privats;
create trigger messatges_privats_difusar after insert or delete on public.messatges_privats
	for each row execute function public.messatges_privats_difusar ();

-- Une demande, une acceptation, un retrait : les deux listes se rafraîchissent
create or replace function public.contactes_difusar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
declare
	c public.contactes := coalesce(new, old);
begin
	perform realtime.send('{}'::jsonb, 'contacte', 'ieu:' || c.de, true);
	perform realtime.send('{}'::jsonb, 'contacte', 'ieu:' || c.a, true);
	return null;
end;
$$;

drop trigger if exists contactes_difusar on public.contactes;
create trigger contactes_difusar after insert or update or delete on public.contactes
	for each row execute function public.contactes_difusar ();

revoke all on function public.messatges_privats_abans_mandar (), public.messatges_privats_difusar (),
	public.contactes_difusar () from public, anon, authenticated;

-- Écouter « ieu:<id> » : la personne elle-même, personne d'autre
drop policy if exists "contactes : chacun écoute son canal" on realtime.messages;
create policy "contactes : chacun écoute son canal" on realtime.messages for select to authenticated
	using (
		realtime.messages.extension = 'broadcast'
		and (select realtime.topic ()) = 'ieu:' || (select auth.uid ())::text
	);
