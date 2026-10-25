-- Lo Ligam — vérification des contacts et messages un à un (supabase-contactes.sql, 2026-10-25)
-- =============================================================================
-- Même méthode que verificacion-perfils.sql : comptes d'essai, erreur
-- volontaire à la fin qui ANNULE TOUT, résultat ligne par ligne.

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-0000000000a5';
	B uuid := '00000000-0000-4000-a000-0000000000b5';
	C uuid := '00000000-0000-4000-a000-0000000000c5';
	D uuid := '00000000-0000-4000-a000-0000000000d5';
	M uuid := '00000000-0000-4000-a000-0000000000e5';
	n int; s text; idm bigint; idm2 bigint;
begin
	insert into auth.users (id, email, aud, role, email_confirmed_at, created_at) values
		(A, 'essai-a5@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(B, 'essai-b5@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(C, 'essai-c5@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(D, 'essai-d5@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(M, 'essai-e5@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days');
	insert into public.admins (user_id) values (M);
	insert into public.profiles (user_id, pseudo) values (A, 'Ana_essai5'), (B, 'Bastian_essai5'), (C, 'Cecilia_essai5'), (D, 'Daumas_essai5'), (M, 'Mod_essai5');
	perform set_config('loligam.verificacion', 'on', true);
	update public.profiles set verificacion = 'verificat' where user_id in (A, B, D, M);
	perform set_config('loligam.verificacion', 'off', true);

	-- 1. A demande B
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	s := public.demandar_contacte (B);
	r := array_append(r, case when s = 'mandada' then 'ok une demande de contact part' else 'ECHEC demande : ' || s end);
	s := public.relacion (B);
	r := array_append(r, case when s = 'mandada' then 'ok A voit sa demande envoyée' else 'ECHEC relacion A : ' || s end);
	begin insert into public.messatges_privats (a, tèxte) values (B, 'Adieu'); r := array_append(r, 'ECHEC on écrit avant l''acceptation'); exception when others then r := array_append(r, 'ok pas de message avant l''acceptation : ' || sqlerrm); end;
	begin insert into public.contactes (de, a, estat) values (A, D, 'acceptat'); r := array_append(r, 'ECHEC contact forcé à la main'); exception when others then r := array_append(r, 'ok on ne se donne pas un contact à la main'); end;
	begin perform public.demandar_contacte (A); r := array_append(r, 'ECHEC contact avec soi-même'); exception when others then r := array_append(r, 'ok pas de contact avec soi-même'); end;
	reset role;

	-- 2. C, pas vérifié, ne demande pas
	perform set_config('request.jwt.claims', json_build_object('sub', C, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin perform public.demandar_contacte (A); r := array_append(r, 'ECHEC un profil en attente demande'); exception when others then r := array_append(r, 'ok un profil en attente ne demande pas : ' || sqlerrm); end;
	reset role;

	-- 3. B voit la demande et l'accepte
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select estat into s from public.mos_contactes () where user_id = A;
	r := array_append(r, case when s = 'recebuda' then 'ok B voit la demande reçue' else 'ECHEC liste de B : ' || coalesce(s, 'absent') end);
	perform public.respondre_contacte (A, true);
	s := public.relacion (A);
	r := array_append(r, case when s = 'acceptat' then 'ok demande acceptée' else 'ECHEC acceptation : ' || s end);
	reset role;

	-- 4. A écrit à B
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	insert into public.messatges_privats (a, tèxte) values (B, 'Adieu Bastian !') returning id into idm;
	r := array_append(r, 'ok A écrit à son contact');
	begin insert into public.messatges_privats (de, a, tèxte) values (B, A, 'Faux'); r := array_append(r, 'ECHEC message écrit au nom d''un autre'); exception when others then r := array_append(r, 'ok on n''écrit pas au nom d''un autre'); end;
	begin insert into public.messatges_privats (a, tèxte) values (B, 'Gros connard'); r := array_append(r, 'ECHEC mot interdit accepté'); exception when others then r := array_append(r, 'ok mot interdit refusé : ' || sqlerrm); end;
	update public.messatges_privats set tèxte = 'Retouché', legit_at = now() where id = idm;
	select tèxte into s from public.messatges_privats where id = idm;
	r := array_append(r, case when s = 'Adieu Bastian !' then 'ok un message ne se retouche pas' else 'ECHEC message retouché : ' || s end);
	reset role;

	-- 5. D, pas en contact, ne lit rien ; B lit et a un non-lu
	perform set_config('request.jwt.claims', json_build_object('sub', D, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.messatges_privats where id = idm;
	r := array_append(r, case when n = 0 then 'ok une tierce personne ne lit pas le message' else 'ECHEC D lit le message' end);
	select count(*) into n from public.contactes;
	r := array_append(r, case when n = 0 then 'ok une tierce personne ne voit pas les contacts des autres' else 'ECHEC D voit ' || n || ' contact(s)' end);
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select non_legits into n from public.mos_contactes () where user_id = A;
	r := array_append(r, case when n = 1 then 'ok B a un message non lu' else 'ECHEC non-lus : ' || coalesce(n::text, 'absent') end);
	perform public.marcar_legit_privat (A);
	select non_legits into n from public.mos_contactes () where user_id = A;
	r := array_append(r, case when n = 0 then 'ok lu, le compteur retombe' else 'ECHEC après lecture : ' || n end);
	-- 6. B signale le message ; A ne peut plus l'effacer
	insert into public.senhalaments_privats (messatge_id, motiu) values (idm, 'insulta');
	r := array_append(r, 'ok B signale un message reçu');
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin insert into public.senhalaments_privats (messatge_id, motiu) values (idm, 'spam'); r := array_append(r, 'ECHEC on signale son propre message'); exception when others then r := array_append(r, 'ok on ne signale que ce qu''on reçoit'); end;
	delete from public.messatges_privats where id = idm;
	select count(*) into n from public.messatges_privats where id = idm;
	r := array_append(r, case when n = 1 then 'ok un message signalé ne s''efface plus (preuve gardée)' else 'ECHEC message signalé effacé' end);
	insert into public.messatges_privats (a, tèxte) values (B, 'Un autre message, pas signalé') returning id into idm2;
	reset role;

	-- 7. La modération lit le message signalé, pas les autres
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.messatges_privats where id = idm;
	r := array_append(r, case when n = 1 then 'ok la modération lit le message signalé' else 'ECHEC modération : signalé invisible' end);
	select count(*) into n from public.messatges_privats where id = idm2;
	r := array_append(r, case when n = 0 then 'ok la modération ne lit pas les messages non signalés' else 'ECHEC la modération lit tout' end);
	reset role;

	-- 8. B bloque A
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.blocar (A);
	s := public.relacion (A);
	r := array_append(r, case when s = 'blocat' then 'ok B voit A bloqué' else 'ECHEC blocage : ' || s end);
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	s := public.relacion (B);
	r := array_append(r, case when s = 'cap' then 'ok A ne voit pas qu''il est bloqué (simplement plus en contact)' else 'ECHEC A voit : ' || s end);
	begin insert into public.messatges_privats (a, tèxte) values (B, 'Encara ieu'); r := array_append(r, 'ECHEC une personne bloquée écrit'); exception when others then r := array_append(r, 'ok une personne bloquée n''écrit plus : ' || sqlerrm); end;
	begin perform public.demandar_contacte (B); r := array_append(r, 'ECHEC une personne bloquée redemande'); exception when others then r := array_append(r, 'ok une personne bloquée ne redemande pas : ' || sqlerrm); end;
	select count(*) into n from public.blocatges;
	r := array_append(r, case when n = 0 then 'ok la liste des blocages des autres est invisible' else 'ECHEC A voit les blocages' end);
	reset role;

	-- 9. D demande B, B refuse
	perform set_config('request.jwt.claims', json_build_object('sub', D, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.demandar_contacte (B);
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.respondre_contacte (D, false);
	s := public.relacion (D);
	r := array_append(r, case when s = 'cap' then 'ok une demande refusée disparaît' else 'ECHEC refus : ' || s end);
	begin perform public.respondre_contacte (D, true); r := array_append(r, 'ECHEC on accepte une demande disparue'); exception when others then r := array_append(r, 'ok plus rien à accepter : ' || sqlerrm); end;
	reset role;

	-- 10. Sans compte : rien
	set local role anon;
	begin select count(*) into n from public.messatges_privats; r := array_append(r, case when n = 0 then 'ok sans compte, aucun message' else 'ECHEC anon lit des messages' end); exception when others then r := array_append(r, 'ok sans compte, aucun message'); end;
	begin perform public.demandar_contacte (B); r := array_append(r, 'ECHEC anon demande un contact'); exception when others then r := array_append(r, 'ok sans compte, pas de demande'); end;
	reset role;

	raise exception 'RESULTATS%', E'\n' || array_to_string(r, E'\n');
end;
$tests$;
