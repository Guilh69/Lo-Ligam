-- Lo Ligam — les groupes d'Amassa et leur chat (décision de Romain, 2026-10-25)
-- =============================================================================
-- Un groupe = un salon de discussion (par ville, dialecte, département, centre
-- d'intérêt ou niveau). Quatre sont ouverts au départ (Montpelhièr, Tolosa,
-- Lion, Débutants) ; les autres sont des PROPOSITIONS : la première personne
-- qui rejoint une proposition l'ouvre (public.rejonher_grop). Le catalogue est
-- dans supabase-grops-catalog.sql (généré par app/scripts/grops-sql.mjs).
--
-- Qui fait quoi :
--   - tout le monde (même sans compte) voit la liste des groupes et le nombre
--     de membres, jamais les messages ni les noms ;
--   - pour rejoindre et écrire : un compte dont l'adresse électronique est
--     VÉRIFIÉE, et ne pas être suspendu ;
--   - seuls les membres d'un groupe lisent ses messages et voient les pseudos
--     de ses membres ;
--   - chacun peut signaler un message ; à trois signalements de trois
--     personnes, le message est masqué tout seul (Romain tranche ensuite) ;
--   - l'administrateur lit tout, masque ou rétablit un message en donnant le
--     motif (droit européen des services numériques), supprime, suspend.
--
-- Garde-fous dans la base (on ne contourne pas en appelant l'API à la main) :
--   - une liste de mots interdits (insultes, injures racistes, homophobes…),
--     tenue par Romain ; le langage familier passe (« putain », « puta »,
--     « colhon » ne sont pas dans la liste) ;
--   - huit messages par minute et trois cents par jour au plus ;
--   - pas de liens pendant les sept premiers jours d'un compte (robots) ;
--   - trente groupes au plus par personne.
--
-- Données (RGPD) : les messages, les adhésions, les signalements, les
-- suspensions. Un message est effacé au bout d'un an ; quitter un groupe ne
-- l'efface pas, supprimer son compte efface tout (on delete cascade).
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin()).


-- 0) LES TABLES
-- -----------------------------------------------------------------------------

create table if not exists public.grops (
	id text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
	mena text not null check (mena in ('vila', 'dialecte', 'despartament', 'interes', 'nivel')),
	nom_oc text not null check (char_length(nom_oc) between 2 and 80),
	nom_fr text not null check (char_length(nom_fr) between 2 and 80),
	descripcion_oc text check (char_length(descripcion_oc) <= 500),
	descripcion_fr text check (char_length(descripcion_fr) <= 500),
	-- dobèrt : on y parle ; prepausat : il attend sa première personne ;
	-- tampat : fermé par l'administrateur (on lit encore, on n'écrit plus)
	estat text not null default 'prepausat' check (estat in ('dobèrt', 'prepausat', 'tampat')),
	orde integer not null default 100,
	dobèrt_at timestamptz,
	created_at timestamptz not null default now()
);

create table if not exists public.grop_membres (
	grop_id text not null references public.grops (id) on delete cascade,
	user_id uuid not null references auth.users (id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (grop_id, user_id)
);
create index if not exists grop_membres_user_id on public.grop_membres (user_id);

create table if not exists public.messatges (
	id bigint generated always as identity primary key,
	grop_id text not null references public.grops (id) on delete cascade,
	user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
	tèxte text not null check (char_length(btrim(tèxte)) between 1 and 1000),
	-- masqué par trois signalements ou par l'administrateur, avec son motif
	amagat boolean not null default false,
	motiu text check (char_length(motiu) <= 300),
	created_at timestamptz not null default now()
);
create index if not exists messatges_grop_created on public.messatges (grop_id, created_at desc);
create index if not exists messatges_user_created on public.messatges (user_id, created_at desc);
create index if not exists messatges_created on public.messatges (created_at);

create table if not exists public.senhalaments (
	id bigint generated always as identity primary key,
	messatge_id bigint not null references public.messatges (id) on delete cascade,
	user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
	motiu text not null check (motiu in ('insulta', 'assetjament', 'odi', 'spam', 'autre')),
	precisions text check (char_length(precisions) <= 500),
	tractat boolean not null default false,
	created_at timestamptz not null default now(),
	unique (messatge_id, user_id)
);
create index if not exists senhalaments_user_id on public.senhalaments (user_id);

-- Mots interdits, écrits en minuscules sans accents. prefixe = true : le mot
-- et tout ce qui le prolonge (« encul » attrape « enculé », « enculer »)
create table if not exists public.mots_defenduts (
	mot text primary key check (mot ~ '^[a-z0-9 ]{2,40}$'),
	prefixe boolean not null default false,
	created_at timestamptz not null default now()
);

-- Suspensions : fins = null → définitive
create table if not exists public.bandiments (
	user_id uuid primary key references auth.users (id) on delete cascade,
	fins timestamptz,
	motiu text not null check (char_length(motiu) between 3 and 300),
	created_at timestamptz not null default now()
);


-- 1) LES PETITES FONCTIONS (security definer : elles lisent ce que la
--    personne ne lit pas elle-même, et ne renvoient qu'un oui ou un non)
-- -----------------------------------------------------------------------------

create or replace function public.adreca_verificada () returns boolean language sql stable security definer
set
	search_path = '' as $$
	select coalesce((select email_confirmed_at is not null from auth.users where id = auth.uid ()), false);
$$;

create or replace function public.es_bandit () returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (
		select 1 from public.bandiments
		where user_id = auth.uid () and (fins is null or fins > now())
	);
$$;

create or replace function public.es_membre (g text) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (select 1 from public.grop_membres where grop_id = g and user_id = auth.uid ());
$$;

-- Peut écrire dans ce groupe : membre, adresse vérifiée, pas suspendu, groupe ouvert
create or replace function public.pot_escriure (g text) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select public.es_membre (g)
		and public.adreca_verificada ()
		and not public.es_bandit ()
		and exists (select 1 from public.grops where id = g and estat = 'dobèrt');
$$;

-- Le texte normalisé pour le filtre : minuscules, sans accents, chiffres
-- « déguisés » remis en lettres (c0nnard → connard), lettres répétées réduites
create or replace function public.normalizar (t text) returns text language sql immutable
set
	search_path = '' as $$
	select regexp_replace(
		translate(lower(t),
			'àáâäãèéêëìíîïòóôöõùúûüçñœ0134@$€',
			'aaaaaeeeeiiiiooooouuuucnooieaase'),
		'([a-z])\1{2,}', '\1\1', 'g');
$$;

create or replace function public.conten_mot_defendut (t text) returns boolean language sql stable security definer
set
	search_path = '' as $$
	select exists (
		select 1 from public.mots_defenduts m
		where public.normalizar (t) ~ ('\m' || m.mot || case when m.prefixe then '' else '\M' end)
	);
$$;

revoke all on function public.adreca_verificada (), public.es_bandit (), public.es_membre (text),
	public.pot_escriure (text), public.conten_mot_defendut (text) from public, anon;
grant execute on function public.adreca_verificada (), public.es_bandit (), public.es_membre (text),
	public.pot_escriure (text) to authenticated;
-- Le filtre ne s'appelle que depuis le déclencheur des messages : ouvert, il
-- permettrait de deviner la liste mot par mot (avis Supabase, 2026-10-25)
revoke all on function public.conten_mot_defendut (text) from authenticated;


-- 2) LES RÈGLES D'ACCÈS (RLS)
-- -----------------------------------------------------------------------------

alter table public.grops enable row level security;
alter table public.grop_membres enable row level security;
alter table public.messatges enable row level security;
alter table public.senhalaments enable row level security;
alter table public.mots_defenduts enable row level security;
alter table public.bandiments enable row level security;

revoke all on public.grops, public.grop_membres, public.messatges, public.senhalaments,
	public.mots_defenduts, public.bandiments from anon, authenticated;
grant select on public.grops to anon, authenticated;
grant insert, update, delete on public.grops to authenticated;
grant select, delete on public.grop_membres to authenticated;
grant select, insert, update, delete on public.messatges to authenticated;
grant select, insert, update, delete on public.senhalaments to authenticated;
grant select, insert, update, delete on public.mots_defenduts to authenticated;
grant select, insert, update, delete on public.bandiments to authenticated;

-- Les groupes : la liste est publique ; seul l'admin la change
drop policy if exists "grops : tout le monde lit la liste" on public.grops;
create policy "grops : tout le monde lit la liste" on public.grops for select to anon, authenticated using (true);
drop policy if exists "grops : l'admin ajoute" on public.grops;
create policy "grops : l'admin ajoute" on public.grops for insert to authenticated with check ((select public.is_admin ()));
drop policy if exists "grops : l'admin modifie" on public.grops;
create policy "grops : l'admin modifie" on public.grops for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "grops : l'admin supprime" on public.grops;
create policy "grops : l'admin supprime" on public.grops for delete to authenticated using ((select public.is_admin ()));

-- Les adhésions : on voit les siennes (l'admin toutes) ; on rejoint par
-- rejonher_grop (pas d'insert direct) ; on quitte quand on veut
drop policy if exists "grop_membres : lire les siennes, ou tout si admin" on public.grop_membres;
create policy "grop_membres : lire les siennes, ou tout si admin" on public.grop_membres for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "grop_membres : quitter, ou retirer si admin" on public.grop_membres;
create policy "grop_membres : quitter, ou retirer si admin" on public.grop_membres for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Les messages : les membres lisent ceux de leur groupe, sauf les masqués
-- (l'auteur voit le sien masqué, avec le motif) ; l'admin lit tout
drop policy if exists "messatges : les membres lisent" on public.messatges;
create policy "messatges : les membres lisent" on public.messatges for select to authenticated
	using (
		(public.es_membre (grop_id) and (not amagat or user_id = (select auth.uid ())))
		or (select public.is_admin ())
	);
drop policy if exists "messatges : écrire en son nom" on public.messatges;
create policy "messatges : écrire en son nom" on public.messatges for insert to authenticated
	with check (
		user_id = (select auth.uid ()) and not amagat and motiu is null and public.pot_escriure (grop_id)
	);
-- Seul l'admin masque ou rétablit (l'auteur ne retouche pas : il supprime)
drop policy if exists "messatges : l'admin masque" on public.messatges;
create policy "messatges : l'admin masque" on public.messatges for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "messatges : supprimer le sien, ou tout si admin" on public.messatges;
create policy "messatges : supprimer le sien, ou tout si admin" on public.messatges for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Les signalements : on signale un message qu'on peut lire et qui n'est pas
-- le sien ; on voit les siens ; l'admin voit et traite tout
drop policy if exists "senhalaments : signaler" on public.senhalaments;
create policy "senhalaments : signaler" on public.senhalaments for insert to authenticated
	with check (
		user_id = (select auth.uid ()) and not tractat
		and exists (
			select 1 from public.messatges m
			where m.id = messatge_id and m.user_id <> (select auth.uid ()) and public.es_membre (m.grop_id)
		)
	);
drop policy if exists "senhalaments : lire les siens, ou tout si admin" on public.senhalaments;
create policy "senhalaments : lire les siens, ou tout si admin" on public.senhalaments for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "senhalaments : l'admin traite" on public.senhalaments;
create policy "senhalaments : l'admin traite" on public.senhalaments for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "senhalaments : retirer le sien, ou tout si admin" on public.senhalaments;
create policy "senhalaments : retirer le sien, ou tout si admin" on public.senhalaments for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- Les mots interdits : l'admin seul (la liste ne se lit pas : on ne donne
-- pas le mode d'emploi pour la contourner)
drop policy if exists "mots_defenduts : l'admin seul" on public.mots_defenduts;
create policy "mots_defenduts : l'admin seul" on public.mots_defenduts for all to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));

-- Les suspensions : la personne voit la sienne et son motif ; l'admin décide
drop policy if exists "bandiments : lire la sienne, ou tout si admin" on public.bandiments;
create policy "bandiments : lire la sienne, ou tout si admin" on public.bandiments for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));
drop policy if exists "bandiments : l'admin ajoute" on public.bandiments;
create policy "bandiments : l'admin ajoute" on public.bandiments for insert to authenticated with check ((select public.is_admin ()));
drop policy if exists "bandiments : l'admin modifie" on public.bandiments;
create policy "bandiments : l'admin modifie" on public.bandiments for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));
drop policy if exists "bandiments : l'admin lève" on public.bandiments;
create policy "bandiments : l'admin lève" on public.bandiments for delete to authenticated using ((select public.is_admin ()));


-- 3) REJOINDRE, COMPTER, NOMMER
-- -----------------------------------------------------------------------------

-- Rejoindre un groupe ; une proposition s'ouvre à la première personne.
-- Renvoie l'état du groupe après coup ('dobèrt').
create or replace function public.rejonher_grop (g text) returns text language plpgsql security definer
set
	search_path = '' as $$
declare
	e text;
begin
	if auth.uid () is null then raise exception 'grops_compte'; end if;
	if not public.adreca_verificada () then raise exception 'grops_adreca'; end if;
	if public.es_bandit () then raise exception 'grops_bandit'; end if;
	select estat into e from public.grops where id = g for update;
	if e is null then raise exception 'grops_inconegut'; end if;
	if e = 'tampat' then raise exception 'grops_tampat'; end if;
	if not public.es_membre (g)
		and (select count(*) from public.grop_membres where user_id = auth.uid ()) >= 30 then
		raise exception 'grops_limit';
	end if;
	if e = 'prepausat' then
		update public.grops set estat = 'dobèrt', dobèrt_at = now() where id = g;
	end if;
	insert into public.grop_membres (grop_id, user_id) values (g, auth.uid ()) on conflict do nothing;
	return 'dobèrt';
end;
$$;

-- Le nombre de membres de chaque groupe (public : un nombre, pas de nom)
create or replace function public.grops_comptes () returns table (grop_id text, membres integer) language sql stable security definer
set
	search_path = '' as $$
	select grop_id, count(*)::integer from public.grop_membres group by grop_id;
$$;

-- Les pseudos des membres d'un groupe, pour ses membres seulement
create or replace function public.membres_grop (g text) returns table (user_id uuid, pseudo text) language sql stable security definer
set
	search_path = '' as $$
	select gm.user_id, coalesce(p.pseudo, '…')
	from public.grop_membres gm
	left join public.profiles p on p.user_id = gm.user_id
	where gm.grop_id = g and (public.es_membre (g) or public.is_admin ());
$$;

revoke all on function public.rejonher_grop (text), public.grops_comptes (), public.membres_grop (text) from public, anon;
grant execute on function public.rejonher_grop (text), public.membres_grop (text) to authenticated;
grant execute on function public.grops_comptes () to anon, authenticated;


-- 4) LES GARDE-FOUS AUTOMATIQUES
-- -----------------------------------------------------------------------------

-- Effacer ce qui a plus d'un an (la base n'a pas de planificateur : appelée
-- à chaque message et à chaque visite de l'administration)
create or replace function public.purgar_grops () returns integer language sql security definer
set
	search_path = '' as $$
	with m as (delete from public.messatges where created_at < now() - interval '1 year' returning 1),
	b as (delete from public.bandiments where fins is not null and fins < now() returning 1)
	select (select count(*) from m)::integer + (select count(*) from b)::integer;
$$;
revoke all on function public.purgar_grops () from public, anon;
grant execute on function public.purgar_grops () to authenticated;

-- Avant chaque message : mots interdits, débit, liens des comptes neufs
create or replace function public.messatges_abans_mandar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
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

drop trigger if exists messatges_abans_mandar on public.messatges;
create trigger messatges_abans_mandar before insert on public.messatges
	for each row execute function public.messatges_abans_mandar ();

-- Après un signalement : à trois personnes différentes, le message est masqué
create or replace function public.senhalaments_apres () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if (select count(*) from public.senhalaments where messatge_id = new.messatge_id and not tractat) >= 3 then
		update public.messatges
		set amagat = true, motiu = 'Amagat : tres personas l''an senhalat, en espèra de la decision de la moderacion.'
		where id = new.messatge_id and not amagat;
	end if;
	return new;
end;
$$;

drop trigger if exists senhalaments_apres on public.senhalaments;
create trigger senhalaments_apres after insert on public.senhalaments
	for each row execute function public.senhalaments_apres ();

-- Les fonctions des déclencheurs ne s'appellent pas à la main
revoke all on function public.messatges_abans_mandar (), public.senhalaments_apres () from public, anon, authenticated;


-- 5) LE DIRECT (Realtime) : les nouveaux messages arrivent sans recharger ;
--    Realtime applique les mêmes règles de lecture (membres seulement)
-- -----------------------------------------------------------------------------

do $$
begin
	if not exists (
		select 1 from pg_publication_tables
		where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messatges'
	) then
		alter publication supabase_realtime add table public.messatges;
	end if;
end;
$$;


-- 6) LA PREMIÈRE LISTE DE MOTS INTERDITS (Romain la complète depuis
--    l'administration ; le familier n'y est pas : putain, merde, puta, colhon).
--    Attention aux mots occitans : « negre » (noir) n'y est surtout pas,
--    « salope » est entier pour laisser passer « salopette ».
-- -----------------------------------------------------------------------------

insert into public.mots_defenduts (mot, prefixe) values
	('connard', true), ('conard', true), ('connass', true), ('conass', true),
	('encul', true), ('salope', false), ('salopes', false), ('salopard', true),
	('pute', false), ('putes', false), ('fdp', false), ('ntm', false),
	('nique ta', true), ('fils de pute', false), ('batard', true), ('pd', false),
	('pede', false), ('pedes', false), ('gouine', true), ('negro', false),
	('negros', false), ('bougnoul', true), ('bicot', true), ('youpin', true),
	('youtre', true), ('triso', false)
on conflict (mot) do nothing;
