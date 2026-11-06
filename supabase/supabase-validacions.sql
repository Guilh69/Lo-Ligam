-- Lo Ligam — Lo talhièr, lot 4 (Romain, 2026-11-06) : la pile de validation
-- =============================================================================
-- Proposition : revisions/2026-11-06-talhier.md (lot 4). Romain valide, une
-- carte à la fois (/admin/pila) ou sur la page même (« Validar » dans la barre
-- à droite), ce qui attend son œil : les questions de l'IA, les réponses de
-- l'IA à ses notes, l'occitan des textes des pages, les fiches de grammaire.
--
-- Une validation vaut pour un texte précis : on garde son empreinte (sha-256
-- du texte occitan, ou de la fiche). Si le texte change ensuite, l'empreinte
-- ne correspond plus et l'élément revient dans la pile. Rien du texte
-- lui-même n'est recopié ici.
--
-- Ce fichier ajoute :
-- 1) la table public.validacions (ce à quoi Romain a dit « Bon ») : lue et
--    écrite par l'administrateur seul ; l'IA la lit par une fonction à clé
--    (pour passer en « validée » dans le code une fiche que Romain a validée) ;
-- 2) remarcas.opcions : les réponses toutes prêtes d'une question de l'IA
--    (2 à 6 boutons) ; jamais dans une remarque de visiteur ;
-- 3) ia_demandar, qui accepte ces options (même nom, un paramètre de plus).
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose supabase-admin-schema.sql (public.is_admin()), supabase-remarcas.sql
-- (public.claude_clau_bona) et supabase-notas.sql (lot 1).


-- 1) LES VALIDATIONS
-- -----------------------------------------------------------------------------
-- tipe : 'element' (un texte modifiable des pages, table pagina_elements) ou
-- 'ficha' (une fiche de grammaire, app/src/lib/gramatica/fichas/<clau>.js).
create table if not exists public.validacions (
	tipe text not null check (tipe in ('element', 'ficha')),
	clau text not null check (
		char_length(clau) between 1 and 120
		and clau !~ '[[:space:][:cntrl:]"''`<>\\]'
	),
	empremta text not null check (empremta ~ '^[0-9a-f]{64}$'),
	created_at timestamptz not null default now(),
	primary key (tipe, clau)
);

-- la date est celle du serveur, à chaque validation (une nouvelle validation
-- du même élément remplace l'ancienne)
create or replace function public.validacions_abans () returns trigger language plpgsql set search_path = '' as $$
begin
	new.created_at := now();
	return new;
end $$;
revoke all on function public.validacions_abans () from public, anon, authenticated;
drop trigger if exists validacions_abans on public.validacions;
create trigger validacions_abans before insert or update on public.validacions
	for each row execute function public.validacions_abans ();

alter table public.validacions enable row level security;
revoke all on table public.validacions from anon;
grant select, insert, update, delete on table public.validacions to authenticated;

drop policy if exists "validacions : l'admin lit" on public.validacions;
create policy "validacions : l'admin lit" on public.validacions for select to authenticated
	using ((select public.is_admin ()));
drop policy if exists "validacions : l'admin valide" on public.validacions;
create policy "validacions : l'admin valide" on public.validacions for insert to authenticated
	with check ((select public.is_admin ()));
drop policy if exists "validacions : l'admin revalide" on public.validacions;
create policy "validacions : l'admin revalide" on public.validacions for update to authenticated
	using ((select public.is_admin ()))
	with check ((select public.is_admin ()));
drop policy if exists "validacions : l'admin retire" on public.validacions;
create policy "validacions : l'admin retire" on public.validacions for delete to authenticated
	using ((select public.is_admin ()));

-- L'IA lit les validations (jamais ne les écrit : valider, c'est Romain)
create or replace function public.ia_legir_validacions (p_clau_secreta text)
	returns table (tipe text, clau text, empremta text, created_at timestamptz)
	language plpgsql stable security definer set search_path = '' as $$
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	return query
		select v.tipe, v.clau, v.empremta, v.created_at
		from public.validacions v
		order by v.tipe, v.clau;
end $$;
revoke all on function public.ia_legir_validacions (text) from public;
grant execute on function public.ia_legir_validacions (text) to anon, authenticated;


-- 2) LES RÉPONSES TOUTES PRÊTES D'UNE QUESTION DE L'IA
-- -----------------------------------------------------------------------------
-- Rien, ou de 2 à 6 options d'une ligne (1 à 200 caractères), sans caractère
-- de contrôle. (Une contrainte qui vaut NULL laisse passer : d'où le coalesce.)
create or replace function public.opcions_bonas (o text[]) returns boolean
	language sql immutable set search_path = '' as $$
	select o is null or coalesce(
		array_ndims(o) = 1
		and cardinality(o) between 2 and 6
		and not exists (
			select 1 from unnest(o) as x (v)
			where v is null
				or char_length(btrim(v)) = 0
				or char_length(v) > 200
				or v ~ '[[:cntrl:]]'
		),
		false
	)
$$;

alter table public.remarcas add column if not exists opcions text[];
alter table public.remarcas drop constraint if exists remarcas_opcions_bonas;
alter table public.remarcas add constraint remarcas_opcions_bonas check (
	public.opcions_bonas (opcions)
	-- seulement sur une question pour Romain
	and (opcions is null or per = 'romain')
);

-- Les visiteurs et les proches : comme au lot 1 (supabase-notas.sql), et
-- jamais d'options
drop policy if exists "remarcas : envoyer" on public.remarcas;
create policy "remarcas : envoyer" on public.remarcas for insert to anon, authenticated
	with check (
		estat = 'dubèrta'
		and responsa is null
		and autor_responsa is null
		and per = 'ia'
		and de_romain = false
		and vista = false
		and opcions is null
	);


-- 3) POSER UNE QUESTION À ROMAIN, AVEC SES RÉPONSES TOUTES PRÊTES
-- -----------------------------------------------------------------------------
-- (remplace la version du lot 1 : même nom, un paramètre de plus à la fin ;
-- l'ancienne est retirée, sinon les deux se gêneraient)
drop function if exists public.ia_demandar (text, text, text, text, text, text);
create or replace function public.ia_demandar (
	p_clau_secreta text,
	p_pagina text,
	p_text text,
	p_autor text default 'IA',
	p_clau text default null,
	p_extrait text default null,
	p_opcions text[] default null
) returns bigint
	language plpgsql security definer set search_path = '' as $$
declare
	nou_id bigint;
	ops text[];
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	-- les options sans blancs autour, sans les vides ; la table refuse le reste
	if p_opcions is not null then
		select array_agg(btrim(x.v) order by x.n) into ops
			from unnest(p_opcions) with ordinality as x (v, n)
			where nullif(btrim(x.v), '') is not null;
	end if;
	insert into public.remarcas (pagina, clau, extrait, tèxte, autor, per, opcions)
		values (
			left(coalesce(nullif(btrim(p_pagina), ''), '/'), 200),
			nullif(left(btrim(coalesce(p_clau, '')), 120), ''),
			nullif(left(btrim(coalesce(p_extrait, '')), 500), ''),
			left(btrim(coalesce(p_text, '')), 2000),
			coalesce(nullif(left(btrim(coalesce(p_autor, '')), 60), ''), 'IA'),
			'romain',
			ops
		)
		returning id into nou_id;
	return nou_id;
end $$;
revoke all on function public.ia_demandar (text, text, text, text, text, text, text[]) from public;
grant execute on function public.ia_demandar (text, text, text, text, text, text, text[]) to anon, authenticated;
