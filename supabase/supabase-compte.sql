-- Lo Ligam — supprimer son compte soi-même (page « Mon compte », 2026-10-25)
-- =============================================================================
-- Droit à l'effacement (RGPD, article 17) : la personne connectée efface son
-- compte, et avec lui tout ce qui y est rattaché (profil, progression, groupes,
-- messages, contacts : toutes les tables pointent vers auth.users avec
-- « on delete cascade »). Le navigateur ne peut pas toucher auth.users : la
-- fonction le fait pour lui, et seulement pour son propre compte.
-- Un compte administrateur ne se supprime pas ainsi (le site resterait sans
-- administration) : on retire d'abord la ligne dans public.admins.

create or replace function public.suprimir_mon_compte () returns void language plpgsql security definer
set
	search_path = '' as $$
begin
	if auth.uid () is null then raise exception 'compte_absent'; end if;
	if exists (select 1 from public.admins where user_id = auth.uid ()) then raise exception 'compte_admin'; end if;
	delete from auth.users where id = auth.uid ();
end;
$$;

revoke all on function public.suprimir_mon_compte () from public, anon;
grant execute on function public.suprimir_mon_compte () to authenticated;
