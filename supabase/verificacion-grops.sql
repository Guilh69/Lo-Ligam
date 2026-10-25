-- Lo Ligam — vérification des règles d'accès des groupes et du chat (2026-10-25)
-- =============================================================================
-- Joue tour à tour un visiteur anonyme, des membres à l'adresse vérifiée (A,
-- B, C, F), une personne à l'adresse non vérifiée (D), une personne suspendue
-- (E) et l'administrateur (M), et tente tout ce qui doit être refusé. Les
-- comptes d'essai n'existent que le temps du test : le bloc finit par une
-- erreur volontaire qui ANNULE TOUT. Le résultat se lit dans le message
-- d'erreur : chaque ligne commence par « ok » ou « ECHEC ».
--
-- À coller dans Supabase après supabase-grops.sql et supabase-grops-catalog.sql.
-- Passé au vert le 2026-10-25 (54 contrôles), dans une transaction annulée,
-- avant la création des tables.

do $tests$
declare
	r text[] := '{}';
	A uuid := '00000000-0000-4000-a000-0000000000a1';
	B uuid := '00000000-0000-4000-a000-0000000000b1';
	C uuid := '00000000-0000-4000-a000-0000000000c1';
	D uuid := '00000000-0000-4000-a000-0000000000d1';
	E uuid := '00000000-0000-4000-a000-0000000000e1';
	F uuid := '00000000-0000-4000-a000-0000000000f1';
	M uuid := '00000000-0000-4000-a000-0000000000a9';
	G constant text := 'vila-montpelhier';
	idA bigint; idB bigint; n int; s text;
begin
	insert into auth.users (id, email, aud, role, email_confirmed_at, created_at) values
		(A, 'essai-a@loligam.test', 'authenticated', 'authenticated', now(), now() - interval '30 days'),
		(B, 'essai-b@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(C, 'essai-c@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(D, 'essai-d@loligam.test', 'authenticated', 'authenticated', null, now()),
		(E, 'essai-e@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(F, 'essai-f@loligam.test', 'authenticated', 'authenticated', now(), now()),
		(M, 'essai-m@loligam.test', 'authenticated', 'authenticated', now(), now());
	insert into public.admins (user_id) values (M);
	-- depuis supabase-perfils.sql (25-10), écrire demande un profil vérifié
	perform set_config('loligam.verificacion', 'on', true);
	insert into public.profiles (user_id, pseudo, verificacion) values
		(A, 'essai_a1', 'verificat'), (B, 'essai_b1', 'verificat'), (C, 'essai_c1', 'verificat'),
		(D, 'essai_d1', 'verificat'), (E, 'essai_e1', 'verificat'), (F, 'essai_f1', 'verificat'), (M, 'essai_m1', 'verificat');
	perform set_config('loligam.verificacion', 'off', true);
	-- l'essai part d'un groupe vide, même si de vrais membres l'ont rejoint (tout est annulé à la fin)
	delete from public.messatges where grop_id = G;
	delete from public.grop_membres where grop_id = G;

	-- 1. anonyme : la liste oui, le reste non
	set local role anon;
	select count(*) into n from public.grops;
	r := array_append(r, (case when n >= 80 then 'ok anon voit la liste (' || n || ' groupes)' else 'ECHEC anon voit ' || n || ' groupes' end));
	select count(*) into n from public.grops where estat = 'dobèrt';
	r := array_append(r, (case when n = 4 then 'ok quatre groupes ouverts au départ' else 'ECHEC ' || n || ' groupes ouverts' end));
	begin perform * from public.grops_comptes (); r := array_append(r, 'ok anon voit les nombres de membres'); exception when others then r := array_append(r, 'ECHEC anon ne voit pas les nombres'); end;
	begin perform count(*) from public.messatges; r := array_append(r, 'ECHEC anon lit les messages'); exception when others then r := array_append(r, 'ok anon ne lit pas les messages'); end;
	begin perform public.rejonher_grop (G); r := array_append(r, 'ECHEC anon rejoint'); exception when others then r := array_append(r, 'ok anon ne rejoint pas'); end;
	begin perform * from public.membres_grop (G); r := array_append(r, 'ECHEC anon voit les membres'); exception when others then r := array_append(r, 'ok anon ne voit pas les membres'); end;
	reset role;

	-- 2. D, adresse non vérifiée
	perform set_config('request.jwt.claims', json_build_object('sub', D, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin perform public.rejonher_grop (G); r := array_append(r, 'ECHEC D (adresse non vérifiée) rejoint'); exception when others then r := array_append(r, 'ok D (adresse non vérifiée) ne rejoint pas : ' || sqlerrm); end;
	reset role;

	-- 3. A rejoint, ouvre une proposition, écrit
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	select count(*) into n from public.grop_membres where grop_id = G;
	r := array_append(r, (case when n = 1 then 'ok A rejoint Montpelhièr' else 'ECHEC A membre : ' || n end));
	perform public.rejonher_grop ('vila-marselha');
	select estat into s from public.grops where id = 'vila-marselha';
	r := array_append(r, (case when s = 'dobèrt' then 'ok A ouvre la proposition Marselha' else 'ECHEC Marselha reste ' || s end));
	begin insert into public.grop_membres (grop_id, user_id) values ('vila-tolosa', A); r := array_append(r, 'ECHEC A s''inscrit sans passer par rejonher_grop'); exception when others then r := array_append(r, 'ok pas d''inscription directe'); end;
	insert into public.messatges (grop_id, tèxte) values (G, 'Adieu a totes !') returning id into idA;
	r := array_append(r, 'ok A écrit');
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Putain, quel temps à Montpellier'); r := array_append(r, 'ok le familier passe (putain)'); exception when others then r := array_append(r, 'ECHEC putain refusé : ' || sqlerrm); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Puta, lo vin negre es bon ! e ma salopette'); r := array_append(r, 'ok puta, negre et salopette passent'); exception when others then r := array_append(r, 'ECHEC faux positif : ' || sqlerrm); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Quel connard celui-là'); r := array_append(r, 'ECHEC insulte acceptée'); exception when others then r := array_append(r, 'ok insulte refusée : ' || sqlerrm); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Espèce de C0NNNNARD'); r := array_append(r, 'ECHEC insulte déguisée acceptée'); exception when others then r := array_append(r, 'ok insulte déguisée refusée'); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Vos ai enculés'); r := array_append(r, 'ECHEC insulte prolongée acceptée'); exception when others then r := array_append(r, 'ok insulte prolongée refusée (préfixe)'); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Vejatz https://www.oc-tv.net'); r := array_append(r, 'ok un lien passe pour un compte de 30 jours'); exception when others then r := array_append(r, 'ECHEC lien refusé à A : ' || sqlerrm); end;
	begin insert into public.messatges (grop_id, tèxte) values ('vila-tolosa', 'Ailleurs'); r := array_append(r, 'ECHEC A écrit hors de ses groupes'); exception when others then r := array_append(r, 'ok A n''écrit pas hors de ses groupes'); end;
	begin insert into public.messatges (grop_id, user_id, tèxte) values (G, B, 'Au nom de B'); r := array_append(r, 'ECHEC A écrit au nom de B'); exception when others then r := array_append(r, 'ok A n''écrit pas au nom de B'); end;
	begin insert into public.messatges (grop_id, tèxte, amagat) values (G, 'Déjà masqué', true); r := array_append(r, 'ECHEC A choisit masqué'); exception when others then r := array_append(r, 'ok A ne choisit pas masqué'); end;
	begin insert into public.messatges (grop_id, tèxte) values (G, '   '); r := array_append(r, 'ECHEC message vide accepté'); exception when others then r := array_append(r, 'ok message vide refusé'); end;
	update public.grops set estat = 'tampat' where id = G; get diagnostics n = row_count;
	r := array_append(r, (case when n = 0 then 'ok A ne ferme pas un groupe' else 'ECHEC A ferme un groupe' end));
	select count(*) into n from public.mots_defenduts;
	r := array_append(r, (case when n = 0 then 'ok A ne lit pas la liste des mots' else 'ECHEC A lit ' || n || ' mots' end));
	begin insert into public.mots_defenduts (mot) values ('adieu'); r := array_append(r, 'ECHEC A ajoute un mot interdit'); exception when others then r := array_append(r, 'ok A n''ajoute pas de mot'); end;
	begin insert into public.bandiments (user_id, motiu) values (B, 'pour rire'); r := array_append(r, 'ECHEC A suspend B'); exception when others then r := array_append(r, 'ok A ne suspend personne'); end;
	select count(*) into n from public.membres_grop ('vila-tolosa');
	r := array_append(r, (case when n = 0 then 'ok A ne voit pas les membres d''un groupe dont il n''est pas' else 'ECHEC A voit ' || n end));
	reset role;

	-- 4. B rejoint, lit, ne touche pas aux messages de A, signale
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	select count(*) into n from public.messatges where grop_id = G;
	r := array_append(r, (case when n = 4 then 'ok B lit les 4 messages du groupe' else 'ECHEC B lit ' || n end));
	select count(*) into n from public.membres_grop (G);
	r := array_append(r, (case when n = 2 then 'ok B voit les 2 membres' else 'ECHEC B voit ' || n || ' membres' end));
	select count(*) into n from public.grop_membres;
	r := array_append(r, (case when n = 1 then 'ok B ne voit que sa propre adhésion' else 'ECHEC B voit ' || n || ' adhésions' end));
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Pub : www.arnaca.com'); r := array_append(r, 'ECHEC lien accepté pour un compte neuf'); exception when others then r := array_append(r, 'ok pas de lien pour un compte neuf'); end;
	insert into public.messatges (grop_id, tèxte) values (G, 'Bonjorn !') returning id into idB;
	update public.messatges set tèxte = 'modifié par B' where id = idA; get diagnostics n = row_count;
	r := array_append(r, (case when n = 0 then 'ok B ne modifie pas le message de A' else 'ECHEC B modifie' end));
	delete from public.messatges where id = idA; get diagnostics n = row_count;
	r := array_append(r, (case when n = 0 then 'ok B ne supprime pas le message de A' else 'ECHEC B supprime' end));
	insert into public.senhalaments (messatge_id, motiu) values (idA, 'insulta');
	r := array_append(r, 'ok B signale le message de A');
	begin insert into public.senhalaments (messatge_id, motiu) values (idA, 'spam'); r := array_append(r, 'ECHEC B signale deux fois'); exception when others then r := array_append(r, 'ok B ne signale pas deux fois'); end;
	begin insert into public.senhalaments (messatge_id, motiu) values (idB, 'spam'); r := array_append(r, 'ECHEC B signale son propre message'); exception when others then r := array_append(r, 'ok B ne signale pas son propre message'); end;
	reset role;

	-- 5. C, pas membre : ne lit rien, ne signale pas ; puis rejoint et signale
	perform set_config('request.jwt.claims', json_build_object('sub', C, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.messatges;
	r := array_append(r, (case when n = 0 then 'ok C (pas membre) ne lit aucun message' else 'ECHEC C lit ' || n end));
	select count(*) into n from public.senhalaments;
	r := array_append(r, (case when n = 0 then 'ok C ne voit pas les signalements des autres' else 'ECHEC C voit ' || n || ' signalements' end));
	begin insert into public.senhalaments (messatge_id, motiu) values (idA, 'odi'); r := array_append(r, 'ECHEC C signale sans être membre'); exception when others then r := array_append(r, 'ok C ne signale pas sans être membre'); end;
	perform public.rejonher_grop (G);
	insert into public.senhalaments (messatge_id, motiu) values (idA, 'odi');
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', F, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	insert into public.senhalaments (messatge_id, motiu, precisions) values (idA, 'assetjament', 'Troisième signalement');
	select count(*) into n from public.messatges where id = idA;
	r := array_append(r, (case when n = 0 then 'ok au 3e signalement, le message disparaît pour les autres' else 'ECHEC le message reste visible' end));
	reset role;

	-- 6. A voit son message masqué et le motif
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select motiu into s from public.messatges where id = idA and amagat;
	r := array_append(r, (case when s is not null then 'ok A voit son message masqué et le motif' else 'ECHEC A ne voit pas le motif' end));
	reset role;

	-- 7. E rejoint, puis l'admin le suspend
	perform set_config('request.jwt.claims', json_build_object('sub', E, 'role', 'authenticated')::text, true);
	set local role authenticated;
	perform public.rejonher_grop (G);
	reset role;

	-- 8. administrateur
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	select count(*) into n from public.messatges;
	r := array_append(r, ('admin lit ' || n || ' message(s), masqués compris'));
	select count(*) into n from public.senhalaments;
	r := array_append(r, (case when n = 3 then 'ok admin voit les 3 signalements' else 'ECHEC admin voit ' || n end));
	update public.messatges set amagat = false, motiu = null where id = idA; get diagnostics n = row_count;
	r := array_append(r, (case when n = 1 then 'ok admin rétablit le message' else 'ECHEC admin ne rétablit pas' end));
	update public.senhalaments set tractat = true where messatge_id = idA;
	insert into public.bandiments (user_id, fins, motiu) values (E, now() + interval '7 days', 'Insultas repetidas');
	r := array_append(r, 'ok admin suspend E');
	insert into public.mots_defenduts (mot) values ('chafre'); r := array_append(r, 'ok admin ajoute un mot');
	select count(*) into n from public.membres_grop (G);
	r := array_append(r, (case when n = 5 then 'ok admin voit les 5 membres' else 'ECHEC admin voit ' || n end));
	reset role;

	-- 9. E suspendu : n'écrit plus, ne rejoint plus, voit le motif
	perform set_config('request.jwt.claims', json_build_object('sub', E, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Encara aquí'); r := array_append(r, 'ECHEC E suspendu écrit'); exception when others then r := array_append(r, 'ok E suspendu n''écrit plus'); end;
	begin perform public.rejonher_grop ('vila-tolosa'); r := array_append(r, 'ECHEC E suspendu rejoint'); exception when others then r := array_append(r, 'ok E suspendu ne rejoint plus'); end;
	select motiu into s from public.bandiments;
	r := array_append(r, (case when s is not null then 'ok E voit le motif de sa suspension' else 'ECHEC E ne voit pas le motif' end));
	reset role;

	-- 10. A : le débit, puis quitter
	perform set_config('request.jwt.claims', json_build_object('sub', A, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin
		for i in 1..10 loop
			insert into public.messatges (grop_id, tèxte) values (G, 'Messatge ' || i);
		end loop;
		r := array_append(r, 'ECHEC pas de limite de débit');
	exception when others then r := array_append(r, 'ok limite de débit : ' || sqlerrm);
	end;
	delete from public.grop_membres where grop_id = G and user_id = A; get diagnostics n = row_count;
	r := array_append(r, (case when n = 1 then 'ok A quitte le groupe' else 'ECHEC A ne quitte pas' end));
	select count(*) into n from public.messatges where grop_id = G and user_id <> A;
	r := array_append(r, (case when n = 0 then 'ok après départ, A ne lit plus les autres' else 'ECHEC A lit encore ' || n end));
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Encara'); r := array_append(r, 'ECHEC A écrit après départ'); exception when others then r := array_append(r, 'ok A n''écrit plus après départ'); end;
	reset role;

	-- 11. le groupe fermé, le direct
	perform set_config('request.jwt.claims', json_build_object('sub', M, 'role', 'authenticated')::text, true);
	set local role authenticated;
	update public.grops set estat = 'tampat' where id = G;
	reset role;
	perform set_config('request.jwt.claims', json_build_object('sub', B, 'role', 'authenticated')::text, true);
	set local role authenticated;
	begin insert into public.messatges (grop_id, tèxte) values (G, 'Groupe fermé ?'); r := array_append(r, 'ECHEC B écrit dans un groupe fermé'); exception when others then r := array_append(r, 'ok pas d''écriture dans un groupe fermé'); end;
	reset role;
	select count(*) into n from pg_trigger where tgname = 'messatges_difusar';
	r := array_append(r, (case when n = 1 then 'ok les messages partent dans le direct (canaux privés, supabase-grops-2.sql)' else 'ECHEC pas de direct' end));

	raise exception 'RESULTATS%', E'\n' || array_to_string(r, E'\n');
end;
$tests$;
