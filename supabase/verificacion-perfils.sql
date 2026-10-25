-- Lo Ligam — vérification des profils vérifiés (supabase-perfils.sql, 2026-10-25)
-- =============================================================================
-- Même méthode que verificacion-grops.sql : comptes d'essai, erreur
-- volontaire à la fin qui ANNULE TOUT, résultat ligne par ligne dans le
-- message d'erreur.

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-0000000000a2';
	B uuid := '00000000-0000-4000-a000-0000000000b2';
	C uuid := '00000000-0000-4000-a000-0000000000c2';
	M uuid := '00000000-0000-4000-a000-0000000000a8';
	G constant text := 'vila-montpelhier';
	n int; s text;
begin
	insert into auth.users (id, email, aud, role, email_confirmed_at, created_at) values
		(A, 'essai-a2@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(B, 'essai-b2@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(C, 'essai-c2@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(M, 'essai-m2@loligam.test', 'authenticated', 'authenticated', now(), now());
	insert into public.admins (user_id) values (M);

	-- 1. on ne se vérifie pas soi-même
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.profiles (user_id, pseudo, verificacion, presentacion, dialecte, nivel)
		values (A, 'Joana_essai', 'verificat', '  Adieu, soi de Lodève.  ', 'lengadocian', 'apren');
	select verificacion into s from public.profiles where user_id = A;
	r := array_append(r, (case when s = 'en_espèra' then 'ok un nouveau profil attend sa validation (même s''il se dit vérifié)' else 'ECHEC profil : ' || s end));
	update public.profiles set verificacion = 'verificat', verificat_at = now() where user_id = A;
	select verificacion into s from public.profiles where user_id = A;
	r := array_append(r, (case when s = 'en_espèra' then 'ok on ne change pas sa vérification soi-même' else 'ECHEC auto-vérification : ' || s end));
	select presentacion into s from public.profiles where user_id = A;
	r := array_append(r, (case when s = 'Adieu, soi de Lodève.' then 'ok la présentation est nettoyée des espaces' else 'ECHEC présentation «' || s || '»' end));
	begin update public.profiles set presentacion = 'Mon site : www.exemple.com' where user_id = A; r := array_append(r, 'ECHEC lien accepté dans le profil'); exception when others then r := array_append(r, 'ok pas de lien dans un profil : ' || sqlerrm); end;
	begin update public.profiles set presentacion = 'Gros connard' where user_id = A; r := array_append(r, 'ECHEC insulte acceptée dans le profil'); exception when others then r := array_append(r, 'ok pas d''insulte dans un profil : ' || sqlerrm); end;
	begin update public.profiles set dialecte = 'klingon' where user_id = A; r := array_append(r, 'ECHEC dialecte inconnu accepté'); exception when others then r := array_append(r, 'ok dialecte inconnu refusé'); end;
	begin update public.profiles set presentacion = repeat('a', 601) where user_id = A; r := array_append(r, 'ECHEC présentation trop longue acceptée'); exception when others then r := array_append(r, 'ok présentation limitée à 600 lettres'); end;
	-- les cases à cocher et le lieu de la carte (§6)
	update public.profiles set cerca = array['parlar', 'trobar'], agrada = array['bal'], ont = 'Lodève', ont_oc = 'Lodeva', ont_dep = '34' where user_id = A;
	begin update public.profiles set cerca = array['parlar', 'vendre'] where user_id = A; r := array_append(r, 'ECHEC choix inconnu accepté dans « cerca »'); exception when others then r := array_append(r, 'ok choix inconnu refusé dans « cerca »'); end;
	begin update public.profiles set agrada = array['politica'] where user_id = A; r := array_append(r, 'ECHEC choix inconnu accepté dans « agrada »'); exception when others then r := array_append(r, 'ok choix inconnu refusé dans « agrada »'); end;

	-- 2. pas vérifié : on rejoint, on lit, on n'écrit pas
	perform public.rejonher_grop (G);
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Bonjorn'); r := array_append(r, 'ECHEC un profil en attente écrit'); exception when others then r := array_append(r, 'ok un profil en attente n''écrit pas : ' || sqlerrm); end;
	r := array_append(r, (case when not public.pot_escriure (G) then 'ok la règle d''écriture le refuse aussi' else 'ECHEC pot_escriure' end));
	begin perform public.decidir_perfil (A, 'verificat'); r := array_append(r, 'ECHEC un membre se valide par decidir_perfil'); exception when others then r := array_append(r, 'ok seule l''administration décide'); end;
	begin perform * from public.perfils_en_espera (); r := array_append(r, 'ECHEC un membre voit la file d''attente'); exception when others then r := array_append(r, 'ok la file d''attente (avec les adresses) est réservée'); end;
	reset role;

	-- 3. l'administrateur, vérifié d'office, voit la file et décide
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.profiles (user_id, pseudo) values (M, 'Moderacion_essai2');
	select verificacion into s from public.profiles where user_id = M;
	r := array_append(r, (case when s = 'verificat' then 'ok l''administrateur est vérifié d''office' else 'ECHEC admin : ' || s end));
	select adreca into s from public.perfils_en_espera () where user_id = A;
	r := array_append(r, (case when s = 'essai-a2@loligam.test' then 'ok la file montre le profil et son adresse' else 'ECHEC file : ' || coalesce(s, 'absent') end));
	perform public.decidir_perfil (A, 'verificat');
	reset role;
	select verificacion into s from public.profiles where user_id = A;
	r := array_append(r, (case when s = 'verificat' then 'ok profil validé par l''administration' else 'ECHEC validation : ' || s end));

	-- B : un autre membre, validé aussi ; C reste en attente
	insert into public.profiles (user_id, pseudo, presentacion) values (B, 'Bernat_essai2', 'Bonjorn a totes'), (C, 'Clara_essai2', 'Adieu');
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.decidir_perfil (B, 'verificat');
	reset role;

	-- 4. A, validé, écrit
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.messatges (grop_id, tèxte) values (G, 'Bonjorn a totes !');
	r := array_append(r, 'ok une fois validé, on écrit');
	reset role;

	-- 5. ce que B voit des autres
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.profiles where user_id = A;
	r := array_append(r, (case when n = 0 then 'ok la table des profils (questionnaire compris) reste privée' else 'ECHEC B lit la table' end));
	select count(*) into n from public.perfil ('JOANA_essai');
	r := array_append(r, (case when n = 1 then 'ok un membre vérifié voit le profil vérifié (pseudo sans tenir compte des majuscules)' else 'ECHEC profil de A : ' || n end));
	select ont_oc || ' ' || ont_dep || ' ' || array_to_string(cerca, ',') into s from public.perfil ('Joana_essai');
	r := array_append(r, (case when s = 'Lodeva 34 parlar,trobar' then 'ok le profil montre le lieu (occitan, département) et les choix' else 'ECHEC lieu et choix : ' || coalesce(s, 'absent') end));
	select jsonb_array_length(grops_comuns) into n from public.perfil ('Joana_essai');
	r := array_append(r, (case when n = 0 then 'ok sans groupe commun, aucun groupe n''est dévoilé' else 'ECHEC groupes dévoilés : ' || n end));
	perform public.rejonher_grop (G);
	select jsonb_array_length(grops_comuns) into n from public.perfil ('Joana_essai');
	r := array_append(r, (case when n = 1 then 'ok le groupe commun apparaît' else 'ECHEC groupes communs : ' || n end));
	select count(*) into n from public.perfil ('Clara_essai2');
	r := array_append(r, (case when n = 0 then 'ok un profil en attente n''est montré à personne' else 'ECHEC profil en attente visible' end));
	select count(*) into n from public.membres_grop (G) where user_id = A and verificat;
	r := array_append(r, (case when n = 1 then 'ok la liste des membres dit qui est vérifié' else 'ECHEC membres_grop' end));
	reset role;

	-- 6. C, en attente, ne voit pas les profils
	perform set_config('request.jwt.claims', json_build_object('sub', C, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.perfil ('Joana_essai');
	r := array_append(r, (case when n = 0 then 'ok un profil en attente ne voit pas les autres profils' else 'ECHEC C voit A' end));
	reset role;

	-- 7. anon : rien
	set local role anon;
	begin perform * from public.perfil ('Joana_essai'); r := array_append(r, 'ECHEC anon appelle perfil'); exception when others then r := array_append(r, 'ok sans compte, aucun profil'); end;
	reset role;

	-- 8. le profil de Romain
	select count(*) into n from public.profiles p join public.admins a on a.user_id = p.user_id where p.verificacion <> 'verificat';
	r := array_append(r, (case when n = 0 then 'ok le profil de l''administrateur est vérifié' else 'ECHEC ' || n || ' administrateur(s) non vérifié(s)' end));

	raise exception 'RESULTATS%', E'\n' || array_to_string(r, E'\n');
end;
$tests$;
