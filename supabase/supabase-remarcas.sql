-- Lo Ligam — les remarques de relecture posées sur la page (Romain, 2026-10-25,
-- option A : « mettre directement ma remarque comme sur Word »)
-- =============================================================================
-- Une remarque = un texte attaché à un endroit précis d'un module (étape,
-- exercice, phrase touchée). Romain les pose en jouant ; ses proches aussi,
-- sans compte, quand ils ont reçu le lien de relecture (?relectura). Claude
-- les lit, corrige, puis les marque traitées.
--
-- Personne ne lit les remarques depuis le site, sauf l'administrateur. Claude
-- les lit par une fonction gardée par sa clé (même empreinte que
-- supabase-acces-claude.sql), et rien d'autre.
--
-- Données (RGPD) : le texte, l'endroit, et un prénom facultatif que la
-- personne tape elle-même. Aucun compte, aucune adresse IP. Effacées au bout
-- d'un an.
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose supabase-admin-schema.sql (public.is_admin(), public.toca_updated_at())
-- et supabase-acces-claude.sql (public.clau_claude).

create table if not exists public.remarcas (
	id bigint generated always as identity primary key,
	pagina text not null check (char_length(pagina) <= 200),
	modul text check (char_length(modul) <= 20),
	etapa integer check (etapa between 0 and 50),
	bloc integer check (bloc between 0 and 200),
	cibla text check (char_length(cibla) <= 300),
	extrait text check (char_length(extrait) <= 500),
	tèxte text not null check (char_length(btrim(tèxte)) between 2 and 2000),
	autor text check (char_length(autor) <= 60),
	-- dubèrta → tractada / escartada
	estat text not null default 'dubèrta' check (estat in ('dubèrta', 'tractada', 'escartada')),
	responsa text check (char_length(responsa) <= 2000),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists remarcas_modul on public.remarcas (modul, estat);

alter table public.remarcas enable row level security;

grant insert on public.remarcas to anon, authenticated;
grant select, update, delete on public.remarcas to authenticated;
grant usage on sequence public.remarcas_id_seq to anon, authenticated;


-- 1) LES RÈGLES D'ACCÈS (RLS)
-- -----------------------------------------------------------------------------

-- Tout le monde peut envoyer une remarque neuve, sans réponse
drop policy if exists "remarcas : envoyer" on public.remarcas;
create policy "remarcas : envoyer" on public.remarcas for insert to anon, authenticated
	with check (estat = 'dubèrta' and responsa is null);

-- Seul l'administrateur lit, change l'état et supprime
drop policy if exists "remarcas : l'admin lit" on public.remarcas;
create policy "remarcas : l'admin lit" on public.remarcas for select to authenticated
	using ((select public.is_admin ()));

drop policy if exists "remarcas : l'admin change" on public.remarcas;
create policy "remarcas : l'admin change" on public.remarcas for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));

drop policy if exists "remarcas : l'admin supprime" on public.remarcas;
create policy "remarcas : l'admin supprime" on public.remarcas for delete to authenticated
	using ((select public.is_admin ()));


-- 2) LES GARDE-FOUS
-- -----------------------------------------------------------------------------

-- Avant chaque envoi : 300 remarques par jour au plus pour tout le site (sans
-- compte, on ne peut pas compter par personne ; de quoi relire largement, pas
-- de quoi remplir la base), puis l'effacement des remarques de plus d'un an.
create or replace function public.remarcas_abans_mandar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	if (select count(*) from public.remarcas where created_at > now() - interval '1 day') >= 300 then
		raise exception 'remarcas_limit' using hint = 'Tròp de remarcas uèi.';
	end if;
	delete from public.remarcas where created_at < now() - interval '1 year';
	return new;
end;
$$;
-- une fonction de déclencheur ne s'appelle pas de l'extérieur
revoke all on function public.remarcas_abans_mandar () from public, anon, authenticated;

drop trigger if exists remarcas_abans_mandar on public.remarcas;
create trigger remarcas_abans_mandar before insert on public.remarcas
	for each row execute function public.remarcas_abans_mandar ();

drop trigger if exists remarcas_updated_at on public.remarcas;
create trigger remarcas_updated_at before update on public.remarcas
	for each row execute function public.toca_updated_at ();


-- 3) L'ACCÈS DE CLAUDE (clé de app/.env, CLAUDE_EDICION_CLAU)
-- -----------------------------------------------------------------------------

create or replace function public.claude_clau_bona (p_clau_secreta text) returns boolean
	language sql security definer stable set search_path = '' as $$
	select exists (
		select 1 from public.clau_claude
		where empremta = encode(sha256(convert_to(coalesce(p_clau_secreta, ''), 'UTF8')), 'hex')
	);
$$;
revoke all on function public.claude_clau_bona (text) from public, anon, authenticated;

-- Lire les remarques (les ouvertes par défaut, toutes avec p_totas)
create or replace function public.claude_legir_remarcas (p_clau_secreta text, p_totas boolean default false)
	returns setof public.remarcas
	language plpgsql security definer set search_path = '' as $$
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	return query select * from public.remarcas
		where p_totas or estat = 'dubèrta'
		order by modul nulls last, etapa nulls first, bloc nulls first, id;
end $$;
revoke all on function public.claude_legir_remarcas (text, boolean) from public;
grant execute on function public.claude_legir_remarcas (text, boolean) to anon, authenticated;

-- Marquer une remarque traitée (ou écartée), avec une réponse courte
create or replace function public.claude_tractar_remarca (p_clau_secreta text, p_id bigint, p_estat text, p_responsa text default null)
	returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	update public.remarcas set estat = p_estat, responsa = coalesce(p_responsa, responsa) where id = p_id;
	get diagnostics n = row_count;
	return n;
end $$;
revoke all on function public.claude_tractar_remarca (text, bigint, text, text) from public;
grant execute on function public.claude_tractar_remarca (text, bigint, text, text) to anon, authenticated;
