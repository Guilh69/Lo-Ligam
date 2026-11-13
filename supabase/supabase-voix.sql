-- Lo Ligam — studio de voix (lot 2) : le dossier privé des enregistrements bruts
-- =============================================================================
-- Romain enregistre les 768 phrases du parcours A1 depuis /admin/voix. Chaque
-- prise BRUTE part ici, dans un dossier que personne d'autre ne peut lire ;
-- la mise au propre (lot 3) se fera plus tard sur son ordinateur, et seuls les
-- sons propres seront publiés, dans app/static/audio/.
--
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rejouable
-- sans risque (chaque règle est retirée puis remise à l'identique).
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin()).
--
-- Rangement : voix-brut/<module>/<phrase>.<format>, par exemple
-- voix-brut/1-1/adieu.webm (voir app/src/lib/voix/studio.js).

-- 1. Le dossier lui-même.
--    • public = false : aucune adresse publique ; pour réécouter, le site
--      demande une adresse signée valable 10 minutes, accordée seulement à qui
--      a le droit de lire (règle 2).
--    • 2 Mo au plus par fichier : une prise dure 30 s au maximum (coupure
--      automatique du studio) ; à 128 kbit/s, débit demandé, cela fait 480 Ko,
--      et un iPhone qui ignorerait ce débit (jusqu'à 256 kbit/s) resterait sous
--      1 Mo. 2 Mo laisse une marge sans permettre d'y ranger autre chose.
--    • Seulement les trois sortes de fichiers que produisent les navigateurs en
--      enregistrant : webm (Chrome, Firefox, Android), ogg (Firefox),
--      mp4/m4a (iPhone, Safari). Rien d'autre, ni image ni page.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voix-brut', 'voix-brut', false, 2097152, array['audio/webm', 'audio/ogg', 'audio/mp4'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- 2. Lire (lister les prises, réécouter) : l'administrateur seulement.
--    Sans cette règle, personne ne voit rien, pas même Romain. Elle sert aussi
--    au remplacement d'une prise (l'envoi « en remplaçant » vérifie d'abord si
--    le fichier existe).
drop policy if exists "voix-brut : legir (admin)" on storage.objects;
create policy "voix-brut : legir (admin)" on storage.objects for select using (bucket_id = 'voix-brut' and public.is_admin ());

-- 3. Ajouter une prise : l'administrateur seulement.
drop policy if exists "voix-brut : mandar (admin)" on storage.objects;
create policy "voix-brut : mandar (admin)" on storage.objects for insert with check (bucket_id = 'voix-brut' and public.is_admin ());

-- 4. Remplacer une prise déjà là (phrase refaite) : l'administrateur seulement.
drop policy if exists "voix-brut : remplaçar (admin)" on storage.objects;
create policy "voix-brut : remplaçar (admin)" on storage.objects for update using (bucket_id = 'voix-brut' and public.is_admin ()) with check (bucket_id = 'voix-brut' and public.is_admin ());

-- 5. Supprimer une prise (l'ancien format quand une phrase est refaite depuis
--    un autre appareil, ou l'essai de la page Verrolhs) : l'administrateur seulement.
drop policy if exists "voix-brut : suprimir (admin)" on storage.objects;
create policy "voix-brut : suprimir (admin)" on storage.objects for delete using (bucket_id = 'voix-brut' and public.is_admin ());

-- Pas de règle pour la clé limitée de l'IA (CLAUDE_EDICION_CLAU) : cette clé
-- n'est pas un compte, c'est un mot de passe vérifié À L'INTÉRIEUR d'une
-- fonction de la base (supabase-acces-claude.sql). Le dossier des fichiers,
-- lui, ne connaît que les comptes : il ne passe par aucune fonction où l'on
-- pourrait vérifier ce mot de passe, et une fonction de la base ne peut ni
-- lire le son ni fabriquer une adresse signée. Le téléchargement du lot 3
-- passera donc par un autre chemin, à décider (voir le rapport du lot 2).

-- Contrôle, à lancer après : doit rendre une ligne « false | 2097152 | {audio/webm,audio/ogg,audio/mp4} »
-- select public, file_size_limit, allowed_mime_types from storage.buckets where id = 'voix-brut';
-- et quatre règles :
-- select policyname, cmd from pg_policies where schemaname = 'storage' and policyname like 'voix-brut%';
