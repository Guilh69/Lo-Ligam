-- Lo Ligam — vérification des règles d'accès de la boîte à idées (2026-10-25)
-- =============================================================================
-- Joue tour à tour un visiteur anonyme, deux membres (A et B) et un
-- administrateur, et tente tout ce qui doit être refusé. Les comptes d'essai
-- n'existent que le temps du test : le bloc finit par une erreur volontaire
-- qui ANNULE TOUT (rien n'est écrit dans la base). Le résultat se lit dans le
-- message d'erreur : chaque ligne commence par « ok » ou « ECHEC ».
--
-- À coller dans Supabase : SQL Editor → New query → Run, une fois
-- supabase-ideas.sql exécuté. Passé au vert le 2026-10-25 (18 contrôles).

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-00000000000a';
	B uuid := '00000000-0000-4000-a000-00000000000b';
	M uuid := '00000000-0000-4000-a000-00000000000c';
	idA bigint; n int; s text;
begin
	insert into auth.users (id, email, aud, role) values
		(A, 'essai-a@loligam.test', 'authenticated', 'authenticated'),
		(B, 'essai-b@loligam.test', 'authenticated', 'authenticated'),
		(M, 'essai-m@loligam.test', 'authenticated', 'authenticated');
	insert into public.admins (user_id) values (M);

	-- 1. anonyme
	begin set local role anon; perform count(*) from public.ideas; r := array_append(r, 'ECHEC anon lit'); exception when others then r := array_append(r, 'ok anon ne lit pas'); end;
	begin set local role anon; insert into public.ideas (user_id, tèxte) values (A, 'Une idée anonyme ici'); r := array_append(r, 'ECHEC anon envoie'); exception when others then r := array_append(r, 'ok anon n''envoie pas'); end;

	-- 2. A envoie
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.ideas (tèxte) values ('Ajouter des enregistrements audio') returning id into idA;
	r := array_append(r, ('ok A envoie (id ' || idA || ')'));
	begin insert into public.ideas (user_id, tèxte) values (B, 'Au nom de B, pirate'); r := array_append(r, 'ECHEC A envoie au nom de B'); exception when others then r := array_append(r, 'ok A ne peut pas envoyer au nom de B'); end;
	begin insert into public.ideas (tèxte, estat) values ('Déjà réalisée, triche', 'facha'); r := array_append(r, 'ECHEC A choisit l''état'); exception when others then r := array_append(r, 'ok A ne choisit pas l''état'); end;
	begin insert into public.ideas (tèxte, responsa) values ('Avec une fausse réponse', 'oui'); r := array_append(r, 'ECHEC A écrit la réponse'); exception when others then r := array_append(r, 'ok A n''écrit pas la réponse'); end;
	begin insert into public.ideas (tèxte) values ('court'); r := array_append(r, 'ECHEC texte trop court accepté'); exception when others then r := array_append(r, 'ok texte trop court refusé'); end;
	update public.ideas set estat = 'facha' where id = idA; get diagnostics n = row_count;
	r := array_append(r, (case when n = 0 then 'ok A ne change pas l''état de son idée' else 'ECHEC A change l''état' end));
	select public.is_admin()::text into s; r := array_append(r, ('A admin ? ' || s));

	-- 3. B, autre membre
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.ideas; r := array_append(r, (case when n = 0 then 'ok B ne voit pas l''idée de A' else 'ECHEC B voit ' || n end));
	update public.ideas set tèxte = 'piraté par B' where id = idA; get diagnostics n = row_count; r := array_append(r, (case when n = 0 then 'ok B ne modifie pas' else 'ECHEC B modifie' end));
	delete from public.ideas where id = idA; get diagnostics n = row_count; r := array_append(r, (case when n = 0 then 'ok B ne supprime pas' else 'ECHEC B supprime' end));

	-- 4. administrateur
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.ideas; r := array_append(r, ('admin voit ' || n || ' idée(s)'));
	update public.ideas set estat = 'retenguda', responsa = 'Bona idèa !' where id = idA; get diagnostics n = row_count; r := array_append(r, (case when n = 1 then 'ok admin répond' else 'ECHEC admin ne répond pas' end));

	-- 5. A voit la réponse, puis la limite de cinq par jour
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select responsa into s from public.ideas where id = idA; r := array_append(r, ('A lit la réponse : ' || coalesce(s, 'rien')));
	insert into public.ideas (tèxte) select 'Idée numéro ' || g || ' de A' from generate_series(2, 5) g;
	begin insert into public.ideas (tèxte) values ('La sixième du jour'); r := array_append(r, 'ECHEC sixième idée acceptée'); exception when others then r := array_append(r, ('ok sixième refusée : ' || sqlerrm)); end;

	-- 6. effacement des vieilles idées
	reset role;
	insert into public.ideas (user_id, tèxte, created_at) values (B, 'Une idée vieille de trois ans', now() - interval '3 years');
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.ideas (tèxte) values ('Une idée neuve de B');
	select count(*) into n from public.ideas; r := array_append(r, (case when n = 1 then 'ok la vieille idée est effacée, B voit 1' else 'ECHEC B voit ' || n end));

	-- 7. A supprime la sienne
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	delete from public.ideas where id = idA; get diagnostics n = row_count; r := array_append(r, (case when n = 1 then 'ok A supprime la sienne' else 'ECHEC A ne supprime pas' end));

	raise exception 'RESULTATS (tout est annulé) : %', array_to_string(r, ' | ');
end
$tests$;
