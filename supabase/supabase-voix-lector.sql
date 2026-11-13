-- Lo Ligam — studio de voix (lot 3) : le compte « lecteur » du dossier privé voix-brut
-- =============================================================================
-- Le script de mise au propre (app/scripts/voix-polir.mjs) tourne sur l'ordinateur
-- de Romain et doit lire les prises brutes. Pour cela il se connecte avec un
-- compte À PART, qui ne peut RIEN d'autre que lire ce dossier : pas écrire, pas
-- supprimer, pas administrer. Si son mot de passe fuyait, on ne pourrait
-- qu'écouter des enregistrements bruts (et on supprime le compte d'un clic).
-- On ne réutilise donc surtout pas le compte administrateur de Romain.
--
-- Pourquoi l'identifiant (uid) et non l'adresse : l'adresse d'un compte peut
-- être changée ; l'uid, jamais. La règle ne suit donc que CE compte-là.
--
-- MARCHE À SUIVRE (une seule fois, dans le tableau de bord Supabase)
--   1. Authentication → Users → « Add user » → « Create new user ».
--      Adresse : une adresse à toi qui n'est utilisée nulle part ailleurs
--      (par exemple voix-lecteur@ton-domaine) ; mot de passe long et unique ;
--      cocher « Auto Confirm User ». Ne pas lui donner de rôle administrateur.
--   2. Dans la liste des utilisateurs, copier la colonne « UID » de ce compte.
--   3. Remplacer ci-dessous 00000000-0000-0000-0000-000000000000 par cet UID
--      (garder les guillemets), puis SQL Editor → New query → coller → Run.
--      Rejouable sans risque. Tant que l'UID n'est pas remplacé, la règle ne
--      laisse entrer personne : c'est voulu.
--   4. Dans app/.env, sur ton ordinateur seulement, ajouter :
--        VOIX_LECTOR_EMAIL=l-adresse-du-compte
--        VOIX_LECTOR_SENHA=son-mot-de-passe
--      (ces deux lignes ne vont jamais dans Git ni dans une discussion).
-- Suppose que supabase-voix.sql a déjà été exécuté (le dossier existe).

-- Lire (lister les prises et les télécharger) : ce seul compte, ce seul dossier.
-- Pas de règle d'écriture ni de suppression : sans règle, la base refuse.
drop policy if exists "voix-brut : legir (lector)" on storage.objects;
create policy "voix-brut : legir (lector)" on storage.objects for select using (bucket_id = 'voix-brut' and auth.uid () = '00000000-0000-0000-0000-000000000000'::uuid);

-- Contrôle, à lancer après : doit rendre une ligne « voix-brut : legir (lector) | SELECT »
-- select policyname, cmd from pg_policies where schemaname = 'storage' and policyname = 'voix-brut : legir (lector)';
