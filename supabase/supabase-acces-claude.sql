-- Lo Ligam — accès de Claude aux éléments modifiables des pages
-- =============================================================================
-- Romain, 2026-10-24 : « il faut que toi, tu puisses continuer à modifier ici,
-- dans le cas où on est en train de travailler ». Claude n'a que la clé de
-- lecture ; cette fonction lui ouvre les textes des pages, et rien d'autre
-- (ni comptes, ni progression, ni autres tables).
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-pagina-elements.sql a déjà été exécuté.
--
-- La clé secrète est dans app/.env (CLAUDE_EDICION_CLAU), jamais dans Git ;
-- la base n'en garde que l'empreinte (sha256), qui ne permet pas de la
-- retrouver. Pour couper l'accès : delete from public.clau_claude;
-- Chaque modification photographie d'abord la page publiée
-- (pagina_publicacions, note « Claude : … ») : on peut y revenir depuis
-- l'éditeur comme après une publication de Romain.

create table if not exists public.clau_claude (
	id integer primary key default 1 check (id = 1),
	empremta text not null
);
-- aucune règle de lecture : la table reste invisible depuis le site
alter table public.clau_claude enable row level security;

insert into public.clau_claude (id, empremta)
values (1, '43a6752d9d2b6873f93d44140a5bcd504e26923c046d6d5571167aa4b9af6c16')
on conflict (id) do update set empremta = excluded.empremta;

-- Modifie un élément existant, dans le publié et dans le brouillon s'il y en a
-- un (sinon la prochaine publication de Romain effacerait la correction).
-- Un paramètre laissé à null ne change rien. Renvoie le nombre de lignes
-- touchées (0 : l'élément n'est pas dans la base, seulement dans le filet).
-- L'ajout des langues es/en/ca change la signature : on retire d'abord
-- l'ancienne version (sinon Postgres garderait les deux).
drop function if exists public.claude_modificar_element (text, text, text, text, text, boolean, text);
create or replace function public.claude_modificar_element (
	p_clau_secreta text,
	p_element text,
	p_oc text default null,
	p_fr text default null,
	p_es text default null,
	p_en text default null,
	p_ca text default null,
	p_ligam text default null,
	p_visible boolean default null,
	p_nota text default null
) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	v_pagina text;
	n integer;
begin
	if not exists (
		select 1 from public.clau_claude
		where empremta = encode(sha256(convert_to(coalesce(p_clau_secreta, ''), 'UTF8')), 'hex')
	) then
		raise exception 'clau desconeguda';
	end if;
	select pagina into v_pagina from public.pagina_elements where clau = p_element limit 1;
	if v_pagina is null then
		return 0;
	end if;
	insert into public.pagina_publicacions (pagina, nòta, fotografia)
	select v_pagina, 'Claude : ' || coalesce(p_nota, p_element), coalesce(jsonb_agg(to_jsonb(e) - 'estat'), '[]'::jsonb)
	from public.pagina_elements e where e.pagina = v_pagina and e.estat = 'publicat';
	update public.pagina_elements set
		oc = coalesce(p_oc, oc),
		fr = coalesce(p_fr, fr),
		es = coalesce(p_es, es),
		en = coalesce(p_en, en),
		ca = coalesce(p_ca, ca),
		ligam = coalesce(p_ligam, ligam),
		visible = coalesce(p_visible, visible)
	where clau = p_element and estat in ('publicat', 'brolhon');
	get diagnostics n = row_count;
	return n;
end $$;
revoke all on function public.claude_modificar_element (text, text, text, text, text, text, text, text, boolean, text) from public;
grant execute on function public.claude_modificar_element (text, text, text, text, text, text, text, text, boolean, text) to anon, authenticated;
