-- Lo Ligam — vérification de la suppression de compte (supabase-compte.sql, 2026-10-25)
-- =============================================================================
-- Même méthode que verificacion-contactes.sql : comptes d'essai, erreur
-- volontaire à la fin qui ANNULE TOUT, résultat ligne par ligne.

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-0000000000a6';
	B uuid := '00000000-0000-4000-a000-0000000000b6';
	M uuid := '00000000-0000-4000-a000-0000000000e6';
	n int;
begin
	insert into auth.users (id, email, aud, role, email_confirmed_at, created_at) values
		(A, 'essai-a6@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(B, 'essai-b6@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(M, 'essai-e6@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days');
	insert into public.admins (user_id) values (M);
	insert into public.profiles (user_id, pseudo) values (A, 'Ana_essai6'), (B, 'Bastian_essai6');

	-- 1. A supprime son compte : le profil part avec
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.suprimir_mon_compte ();
	reset role;
	select count(*) into n from auth.users where id = A;
	r := array_append(r, case when n = 0 then 'ok le compte est supprimé' else 'ECHEC compte toujours là' end);
	select count(*) into n from public.profiles where user_id = A;
	r := array_append(r, case when n = 0 then 'ok le profil part avec le compte' else 'ECHEC profil resté' end);
	select count(*) into n from auth.users where id = B;
	r := array_append(r, case when n = 1 then 'ok les autres comptes ne bougent pas' else 'ECHEC B supprimé aussi' end);

	-- 2. un administrateur ne se supprime pas ainsi
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin perform public.suprimir_mon_compte (); r := array_append(r, 'ECHEC un administrateur se supprime'); exception when others then r := array_append(r, 'ok un administrateur ne se supprime pas : ' || sqlerrm); end;
	reset role;

	-- 3. sans compte : rien
	set local role anon;
	begin perform public.suprimir_mon_compte (); r := array_append(r, 'ECHEC anon appelle la fonction'); exception when others then r := array_append(r, 'ok sans compte, pas de suppression'); end;
	reset role;

	raise exception 'RESULTATS%', E'\n' || array_to_string(r, E'\n');
end;
$tests$;
