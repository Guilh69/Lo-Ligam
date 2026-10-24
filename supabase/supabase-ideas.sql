-- Lo Ligam — la boîte à idées (Amassa, option A de Romain, 2026-10-25)
-- =============================================================================
-- Une idée = un texte envoyé par une personne CONNECTÉE (pas d'envoi anonyme :
-- Romain modère seul, un compte freine les robots). Personne d'autre que son
-- auteur et l'administrateur ne la lit ; rien n'est jamais public.
--
-- Données (RGPD) : le texte, le compte qui l'a envoyé, l'état et la réponse
-- de Romain. Romain ne voit PAS qui a écrit (la page d'administration ne
-- montre que le texte). L'auteur peut supprimer son idée quand il veut ; la
-- suppression du compte efface ses idées ; au bout de deux ans, une idée est
-- effacée (à chaque nouvelle idée et à chaque visite de l'administration :
-- la base n'a pas de planificateur).
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin(),
-- public.toca_updated_at()).

create table if not exists public.ideas (
	id bigint generated always as identity primary key,
	user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
	tèxte text not null check (char_length(btrim(tèxte)) between 10 and 2000),
	-- nòva → legida → retenguda / facha / escartada
	estat text not null default 'nòva' check (estat in ('nòva', 'legida', 'retenguda', 'facha', 'escartada')),
	responsa text check (char_length(responsa) <= 2000),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists ideas_user_id on public.ideas (user_id);

alter table public.ideas enable row level security;

-- Les visiteurs non connectés n'ont rien à faire ici, même pas lire
revoke all on public.ideas from anon;
grant select, insert, update, delete on public.ideas to authenticated;


-- 1) LES RÈGLES D'ACCÈS (RLS)
-- -----------------------------------------------------------------------------

drop policy if exists "ideas : lire les siennes, ou tout si admin" on public.ideas;
create policy "ideas : lire les siennes, ou tout si admin" on public.ideas for select to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));

-- On n'envoie qu'en son nom, une idée neuve et sans réponse
drop policy if exists "ideas : envoyer en son nom" on public.ideas;
create policy "ideas : envoyer en son nom" on public.ideas for insert to authenticated
	with check (user_id = (select auth.uid ()) and estat = 'nòva' and responsa is null);

-- Seul l'administrateur change l'état ou répond (l'auteur ne retouche pas : il
-- supprime et renvoie)
drop policy if exists "ideas : l'admin change l'état et répond" on public.ideas;
create policy "ideas : l'admin change l'état et répond" on public.ideas for update to authenticated
	using ((select public.is_admin ())) with check ((select public.is_admin ()));

-- Droit à l'effacement : l'auteur supprime la sienne ; l'admin, n'importe laquelle
drop policy if exists "ideas : supprimer la sienne, ou toute si admin" on public.ideas;
create policy "ideas : supprimer la sienne, ou toute si admin" on public.ideas for delete to authenticated
	using (user_id = (select auth.uid ()) or (select public.is_admin ()));


-- 2) LES GARDE-FOUS
-- -----------------------------------------------------------------------------

-- Effacer les idées de plus de deux ans. security definer : la fonction
-- efface aussi les idées des autres ; elle ne fait que ça, et ne renvoie rien
-- qu'un nombre.
create or replace function public.purgar_ideas () returns integer language sql security definer
set
	search_path = '' as $$
	with v as (
		delete from public.ideas where created_at < now() - interval '2 years' returning 1
	)
	select count(*)::integer from v;
$$;

revoke all on function public.purgar_ideas () from public, anon;
grant execute on function public.purgar_ideas () to authenticated;

-- Avant chaque envoi : cinq idées par jour au plus par personne (Romain est
-- seul à lire), puis l'effacement des vieilles idées.
create or replace function public.ideas_abans_mandar () returns trigger language plpgsql
set
	search_path = '' as $$
begin
	if (
		select count(*) from public.ideas
		where user_id = new.user_id and created_at > now() - interval '1 day'
	) >= 5 then
		raise exception 'ideas_limit' using hint = 'Cinc idèas per jorn al maximum.';
	end if;
	perform public.purgar_ideas ();
	return new;
end;
$$;

drop trigger if exists ideas_abans_mandar on public.ideas;
create trigger ideas_abans_mandar before insert on public.ideas
	for each row execute function public.ideas_abans_mandar ();

drop trigger if exists ideas_updated_at on public.ideas;
create trigger ideas_updated_at before update on public.ideas
	for each row execute function public.toca_updated_at ();
