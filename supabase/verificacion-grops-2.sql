-- Lo Ligam — vérification des correctifs des groupes (supabase-grops-2.sql, 2026-10-25)
-- =============================================================================
-- Pseudos, non-lus, direct par canaux privés. Même méthode que
-- verificacion-grops.sql : comptes d'essai, erreur volontaire à la fin qui
-- ANNULE TOUT, résultat ligne par ligne dans le message d'erreur.
-- Le passage réel des avis du direct ne se teste pas en SQL (Supabase crée
-- lui-même les tiroirs du jour de realtime.messages, on n'y a pas la main) :
-- on vérifie la règle d'écoute et le déclencheur, puis le direct se vérifie
-- dans le navigateur avec deux comptes.

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-0000000000a1';
	B uuid := '00000000-0000-4000-a000-0000000000b1';
	C uuid := '00000000-0000-4000-a000-0000000000c1';
	M uuid := '00000000-0000-4000-a000-0000000000a9';
	G constant text := 'vila-montpelhier';
	idB bigint; n int; s text;
begin
	insert into auth.users (id, email, aud, role, email_confirmed_at, created_at) values
		(A, 'essai-a@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(B, 'essai-b@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(C, 'essai-c@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(M, 'essai-m@loligam.test', 'authenticated', 'authenticated', now(), now());
	insert into public.admins (user_id) values (M);

	-- 1. les pseudos
	insert into public.profiles (user_id, pseudo) values (A, '  Joan_essai  ');
	select pseudo into s from public.profiles where user_id = A;
	r := array_append(r, (case when s = 'Joan_essai' then 'ok le pseudo est nettoyé des espaces' else 'ECHEC pseudo : «' || s || '»' end));
	begin insert into public.profiles (user_id, pseudo) values (B, 'JOAN_ESSAI'); r := array_append(r, 'ECHEC doublon en majuscules accepté'); exception when others then r := array_append(r, 'ok doublon refusé (majuscules)'); end;
	begin insert into public.profiles (user_id, pseudo) values (B, 'J0an_essài'); r := array_append(r, 'ECHEC doublon déguisé accepté'); exception when others then r := array_append(r, 'ok doublon refusé (accent, chiffre)'); end;
	begin insert into public.profiles (user_id, pseudo) values (B, 'Moderacion'); r := array_append(r, 'ECHEC nom réservé accepté'); exception when others then r := array_append(r, 'ok nom réservé refusé : ' || sqlerrm); end;
	begin insert into public.profiles (user_id, pseudo) values (B, 'Lo Ligam officiel'); r := array_append(r, 'ECHEC Lo Ligam accepté'); exception when others then r := array_append(r, 'ok « Lo Ligam » refusé'); end;
	begin insert into public.profiles (user_id, pseudo) values (B, 'Gros connard'); r := array_append(r, 'ECHEC pseudo insultant accepté'); exception when others then r := array_append(r, 'ok pseudo insultant refusé : ' || sqlerrm); end;
	begin insert into public.profiles (user_id, pseudo) values (B, 'x'); r := array_append(r, 'ECHEC pseudo d''une lettre accepté'); exception when others then r := array_append(r, 'ok pseudo trop court refusé'); end;
	insert into public.profiles (user_id, pseudo) values (B, 'Bernat_essai'), (C, 'Clara_essai');
	insert into public.profiles (user_id, pseudo) values (M, 'Moderacion_essai');
	r := array_append(r, 'ok l''administrateur peut s''appeler Moderacion');

	-- 2. A et B rejoignent ; B écrit deux messages
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	reset role;
	-- dans une transaction, now() ne bouge pas : on recule la lecture de A
	update public.grop_membres set legit_at = now() - interval '1 minute' where user_id = A;
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	insert into public.messatges (grop_id, tèxte) values (G, 'Bonjorn !');
	insert into public.messatges (grop_id, tèxte) values (G, 'I a qualqu''un ?') returning id into idB;
	select count(*) into n from public.membres_grop (G) where es_admin;
	r := array_append(r, (case when n = 0 then 'ok personne n''est marqué administrateur à tort' else 'ECHEC ' || n || ' administrateur(s) à tort' end));
	-- la règle d'écoute du canal repose sur es_membre
	r := array_append(r, (case when public.es_membre (G) then 'ok B, membre, a le droit d''écouter le canal' else 'ECHEC B n''écoute pas' end));
	reset role;

	-- 3. A : deux non-lus, puis lus
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select non_legits into n from public.mos_grops () where grop_id = G;
	r := array_append(r, (case when n = 2 then 'ok A a 2 messages non lus' else 'ECHEC A a ' || coalesce(n::text, 'null') || ' non-lus' end));
	select count(*) into n from public.mos_grops ();
	r := array_append(r, (case when n = 1 then 'ok la liste de A ne contient que son groupe' else 'ECHEC la liste de A contient ' || n end));
	perform public.marcar_legit (G);
	select non_legits into n from public.mos_grops () where grop_id = G;
	r := array_append(r, (case when n = 0 then 'ok après lecture, plus de non-lus' else 'ECHEC encore ' || n || ' non-lus' end));
	begin update public.grop_membres set legit_at = now() + interval '1 year'; get diagnostics n = row_count; r := array_append(r, (case when n = 0 then 'ok la date de lecture ne se modifie pas à la main' else 'ECHEC date modifiée' end)); exception when others then r := array_append(r, 'ok la date de lecture ne se modifie pas à la main'); end;
	reset role;

	-- 4. C, pas membre
	perform set_config('request.jwt.claims', json_build_object('sub', C, 'role', 'authenticated')::text, true);
	set local role authenticated;
	r := array_append(r, (case when not public.es_membre (G) then 'ok C, pas membre, n''a pas le droit d''écouter le canal' else 'ECHEC C écoute' end));
	select count(*) into n from public.mos_grops ();
	r := array_append(r, (case when n = 0 then 'ok la liste de C est vide' else 'ECHEC C voit ' || n || ' groupes' end));
	reset role;

	-- 5. l'admin (pas membre) : pas d'insigne dans un groupe dont il n'est pas
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.membres_grop (G) where es_admin;
	r := array_append(r, (case when n = 0 then 'ok l''insigne ne vaut que pour un admin membre' else 'ECHEC insigne : ' || n end));
	update public.messatges set amagat = true, motiu = 'Essai' where id = idB;
	delete from public.messatges where id = idB; get diagnostics n = row_count;
	r := array_append(r, (case when n = 1 then 'ok l''admin masque puis supprime (les avis partent sans erreur)' else 'ECHEC suppression' end));
	reset role;

	-- 6. le direct
	select count(*) into n from pg_trigger where tgname = 'messatges_difusar';
	r := array_append(r, (case when n = 1 then 'ok les avis du direct partent de la base (nouveau, masqué, supprimé)' else 'ECHEC pas de déclencheur du direct' end));
	select count(*) into n from pg_policies where schemaname = 'realtime' and tablename = 'messages' and qual like '%es_membre%' and qual like '%grop:%';
	r := array_append(r, (case when n = 1 then 'ok la règle d''écoute des canaux est en place' else 'ECHEC règle d''écoute absente' end));
	select count(*) into n from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messatges';
	r := array_append(r, (case when n = 0 then 'ok l''ancien direct (Postgres Changes) est débranché' else 'ECHEC ancien direct encore branché' end));

	raise exception 'RESULTATS%', E'\n' || array_to_string(r, E'\n');
end;
$tests$;
