-- Lo Ligam — Lo talhièr, lot 1 (Romain, 2026-11-06) : les notes posées sur
-- n'importe quelle page, et la liste « Per tu »
-- =============================================================================
-- Proposition : revisions/2026-11-06-talhier.md. Les notes de Romain rejoignent
-- la table des remarques de relecture (supabase-remarcas.sql) : une seule boîte,
-- relevée par l'IA en début de séance (cd app && node scripts/remarcas.mjs),
-- que ce soit Claude ou Mistral.
--
-- Ce que ce fichier ajoute à public.remarcas :
-- - per : à qui la note s'adresse. 'ia' (à faire par l'IA, comme toutes les
--   remarques jusqu'ici) ou 'romain' (une note de Romain pour lui-même, ou une
--   question de l'IA pour lui) ;
-- - de_romain : vrai seulement quand l'administrateur l'a écrite (les règles
--   d'accès l'interdisent à tous les autres). L'IA sait ainsi ce qui est une
--   demande de Romain et ce qui vient d'un visiteur ou d'un proche : une
--   remarque à vérifier, jamais un ordre ;
-- - clau : l'élément modifiable touché (table pagina_elements), s'il y en a un ;
-- - autor_responsa : qui a répondu (Claude, Mistral, Romain) ;
-- - vista : l'auteur de la note a vu la réponse (« Bon » de Romain, ou l'IA
--   qui a lu la réponse de Romain à sa question). Une note vue sort de la liste.
--
-- Cycle d'une note :
-- - Romain → IA (per 'ia') : dubèrta → tractada ou escartada (l'IA répond)
--   → vista (« Bon ») ou de nouveau dubèrta (« Pas encara », avec une précision) ;
-- - IA → Romain (per 'romain', de_romain faux) : dubèrta → tractada (Romain
--   répond) → vista (l'IA a lu) ;
-- - note de Romain pour lui-même (per 'romain', de_romain vrai) : dubèrta → vista.
--
-- Les choix du tri (/admin/triar) restent dans cette table avec leur propre
-- logique (lib/triar/triar.js) ; la liste « Per tu » les laisse de côté.
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose supabase-admin-schema.sql (public.is_admin()), supabase-acces-claude.sql
-- (public.clau_claude) et supabase-remarcas.sql (la table, public.claude_clau_bona).

alter table public.remarcas
	add column if not exists per text not null default 'ia' check (per in ('ia', 'romain')),
	add column if not exists de_romain boolean not null default false,
	add column if not exists clau text check (char_length(clau) <= 120),
	add column if not exists autor_responsa text check (char_length(autor_responsa) <= 30),
	add column if not exists vista boolean not null default false;

-- Une seule ligne par champ court (relecture de Rodrigo, 06-11) : un visiteur
-- ne peut pas glisser de retour à la ligne pour imiter, dans ce que lit l'IA,
-- un bloc « Demandes de Romain ». Le script nettoie aussi tout ce qu'il affiche.
-- La clé d'élément n'a ni espace, ni guillemet, ni parenthèse, ni virgule.
alter table public.remarcas drop constraint if exists remarcas_linha_sola;
alter table public.remarcas add constraint remarcas_linha_sola check (
	pagina like '/%'
	and pagina !~ '[[:cntrl:]]'
	and coalesce(cibla, '') !~ '[[:cntrl:]]'
	and coalesce(extrait, '') !~ '[[:cntrl:]]'
	and coalesce(autor, '') !~ '[[:cntrl:]]'
	and coalesce(autor_responsa, '') !~ '[[:cntrl:]]'
	and coalesce(clau, '') !~ '[[:space:][:cntrl:]"\\(),]'
);


-- 1) LES RÈGLES D'ACCÈS (RLS)
-- -----------------------------------------------------------------------------
-- La lecture, le changement et la suppression restent à l'administrateur seul
-- (supabase-remarcas.sql). Seul l'envoi change.

-- Les visiteurs et les proches (lien de relecture) : une remarque neuve, pour
-- l'IA, sans réponse, jamais au nom de Romain
drop policy if exists "remarcas : envoyer" on public.remarcas;
create policy "remarcas : envoyer" on public.remarcas for insert to anon, authenticated
	with check (
		estat = 'dubèrta'
		and responsa is null
		and autor_responsa is null
		and per = 'ia'
		and de_romain = false
		and vista = false
	);

-- L'administrateur : ses notes, pour l'IA ou pour lui-même
drop policy if exists "remarcas : l'admin envoie" on public.remarcas;
create policy "remarcas : l'admin envoie" on public.remarcas for insert to authenticated
	with check ((select public.is_admin ()));


-- 2) LES GARDE-FOUS (remplace la fonction de supabase-remarcas.sql)
-- -----------------------------------------------------------------------------
-- Relecture de Rodrigo (06-11) : le plafond de 300 par jour ne compte que les
-- remarques des visiteurs ; un inconnu qui le remplit ne bloque ni les notes de
-- Romain ni les questions de l'IA. La date est celle du serveur (un visiteur
-- ne peut plus antidater une ligne pour sortir du compte). L'effacement à un
-- an ne touche que les remarques des visiteurs et des proches : les notes de
-- Romain et les questions de l'IA restent jusqu'à ce qu'il les supprime.
create or replace function public.remarcas_abans_mandar () returns trigger language plpgsql security definer
set
	search_path = '' as $$
begin
	new.created_at := now();
	new.updated_at := now();
	if not (new.de_romain or new.per = 'romain') and (
		select count(*) from public.remarcas
		where created_at > now() - interval '1 day' and per = 'ia' and not de_romain
	) >= 300 then
		raise exception 'remarcas_limit' using hint = 'Tròp de remarcas uèi.';
	end if;
	delete from public.remarcas where created_at < now() - interval '1 year' and per = 'ia' and not de_romain;
	return new;
end;
$$;
revoke all on function public.remarcas_abans_mandar () from public, anon, authenticated;

-- L'ancienne fonction de réponse ne sert plus qu'au tri (scripts/triar.mjs) :
-- elle ne touche plus que ses lignes
create or replace function public.claude_tractar_remarca (p_clau_secreta text, p_id bigint, p_estat text, p_responsa text default null)
	returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	update public.remarcas set estat = p_estat, responsa = coalesce(p_responsa, responsa)
		where id = p_id and pagina = '/admin/triar';
	get diagnostics n = row_count;
	return n;
end $$;
revoke all on function public.claude_tractar_remarca (text, bigint, text, text) from public;
grant execute on function public.claude_tractar_remarca (text, bigint, text, text) to anon, authenticated;


-- 3) L'ACCÈS DE L'IA (clé de app/.env, CLAUDE_EDICION_CLAU)
-- -----------------------------------------------------------------------------
-- La lecture passe par public.claude_legir_remarcas (supabase-remarcas.sql),
-- qui rend aussi les nouvelles colonnes. Trois gestes de plus, rien d'autre :
-- répondre à une note, poser une question, ranger une réponse lue.

-- Répondre à une note pour l'IA : faite (tractada) ou écartée avec la raison
-- (escartada). La réponse attend que Romain la regarde. Sans texte, l'ancienne
-- réponse reste (comme claude_tractar_remarca, que scripts/triar.mjs utilisait).
create or replace function public.ia_respondre_remarca (
	p_clau_secreta text,
	p_id bigint,
	p_estat text,
	p_responsa text,
	p_autor text default 'IA'
) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	if p_estat is null or p_estat not in ('tractada', 'escartada') then
		raise exception 'estat desconegut';
	end if;
	update public.remarcas
		set estat = p_estat,
			responsa = coalesce(nullif(left(btrim(coalesce(p_responsa, '')), 2000), ''), responsa),
			autor_responsa = coalesce(nullif(left(btrim(coalesce(p_autor, '')), 30), ''), 'IA'),
			vista = false
		where id = p_id and per = 'ia' and pagina <> '/admin/triar';
	get diagnostics n = row_count;
	return n;
end $$;
revoke all on function public.ia_respondre_remarca (text, bigint, text, text, text) from public;
grant execute on function public.ia_respondre_remarca (text, bigint, text, text, text) to anon, authenticated;

-- Poser une question à Romain, sur une page (et un élément s'il y en a un).
-- Elle arrive dans sa liste « Per tu » ; il répond depuis la liste.
create or replace function public.ia_demandar (
	p_clau_secreta text,
	p_pagina text,
	p_text text,
	p_autor text default 'IA',
	p_clau text default null,
	p_extrait text default null
) returns bigint
	language plpgsql security definer set search_path = '' as $$
declare
	nou_id bigint;
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	insert into public.remarcas (pagina, clau, extrait, tèxte, autor, per)
		values (
			left(coalesce(nullif(btrim(p_pagina), ''), '/'), 200),
			nullif(left(btrim(coalesce(p_clau, '')), 120), ''),
			nullif(left(btrim(coalesce(p_extrait, '')), 500), ''),
			left(btrim(coalesce(p_text, '')), 2000),
			coalesce(nullif(left(btrim(coalesce(p_autor, '')), 60), ''), 'IA'),
			'romain'
		)
		returning id into nou_id;
	return nou_id;
end $$;
revoke all on function public.ia_demandar (text, text, text, text, text, text) from public;
grant execute on function public.ia_demandar (text, text, text, text, text, text) to anon, authenticated;

-- Ranger une réponse de Romain que l'IA a lue et appliquée
create or replace function public.ia_legida (p_clau_secreta text, p_id bigint)
	returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.claude_clau_bona (p_clau_secreta) then
		raise exception 'clau desconeguda';
	end if;
	update public.remarcas set vista = true
		where id = p_id and per = 'romain' and de_romain = false and estat = 'tractada';
	get diagnostics n = row_count;
	return n;
end $$;
revoke all on function public.ia_legida (text, bigint) from public;
grant execute on function public.ia_legida (text, bigint) to anon, authenticated;
