-- Lo Ligam — dossier de fichiers pour les vidéos
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
--
-- POURQUOI UN DOSSIER SÉPARÉ DES IMAGES
-- Le dossier « designs » est plafonné à 2 Mo par fichier et n'accepte que des
-- images. C'est ce plafond qui empêche qu'un export lourd y atterrisse par
-- mégarde. Plutôt que de le relever pour tout le monde — ce qui affaiblirait
-- la protection des images — les vidéos ont leur propre dossier, avec ses
-- propres limites.
--
-- 12 Mo : une animation de fiche préparée avec outils/preparar-video.cmd pèse
-- environ 6 Mo pour 47 secondes. Le plafond laisse de la marge pour une pièce
-- plus longue, tout en refusant un export Canva brut (24 Mo à la mesure du
-- 2026-08-04). Si un fichier est refusé, c'est qu'il n'est pas passé par
-- l'outil de préparation.
--
-- video/mp4 UNIQUEMENT : c'est le seul format lu partout sans extension.

insert into
	storage.buckets (
		id,
		name,
		public,
		file_size_limit,
		allowed_mime_types
	)
values
	(
		'videos',
		'videos',
		true,
		12582912,
		array['video/mp4']
	)
on conflict (id) do
update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

-- Mêmes règles que pour les images : lecture ouverte, écriture réservée.
-- public.is_admin() a été créée par supabase-admin-schema.sql.
drop policy if exists "videos : lectura publica" on storage.objects;

create policy "videos : lectura publica" on storage.objects for
select
	using (bucket_id = 'videos');

drop policy if exists "videos : mandar (admin)" on storage.objects;

create policy "videos : mandar (admin)" on storage.objects for insert
with
	check (
		bucket_id = 'videos'
		and public.is_admin ()
	);

drop policy if exists "videos : remplaçar (admin)" on storage.objects;

create policy "videos : remplaçar (admin)" on storage.objects
for update
	using (
		bucket_id = 'videos'
		and public.is_admin ()
	)
with
	check (
		bucket_id = 'videos'
		and public.is_admin ()
	);

drop policy if exists "videos : suprimir (admin)" on storage.objects;

create policy "videos : suprimir (admin)" on storage.objects for delete using (
	bucket_id = 'videos'
	and public.is_admin ()
);


-- GARDE-FOU : le script refuse d'aboutir si le dossier n'est pas conforme.
do $$
declare
	b record;
begin
	select * into b from storage.buckets where id = 'videos';

	if b is null then
		raise exception 'SEGURETAT : lo dorsièr « videos » es pas estat creat. Tot es anullat.';
	end if;

	if b.file_size_limit is null or b.file_size_limit > 12582912 then
		raise exception
			'SEGURETAT : lo dorsièr « videos » a pas de plafon, o un plafon tròp naut (%). Tot es anullat.',
			b.file_size_limit;
	end if;

	if b.allowed_mime_types is null or not (b.allowed_mime_types @> array['video/mp4']) then
		raise exception 'SEGURETAT : la lista dels formats acceptats es pas bona. Tot es anullat.';
	end if;

	if array_length(b.allowed_mime_types, 1) <> 1 then
		raise exception
			'SEGURETAT : lo dorsièr « videos » accèpta mai d un format (%). Tot es anullat.',
			b.allowed_mime_types;
	end if;

	raise notice 'Dorsièr « videos » prèst : plafon % octets, format %.',
		b.file_size_limit, b.allowed_mime_types;
end $$;

-- Contrôle visible.
select
	id,
	public,
	file_size_limit,
	allowed_mime_types
from
	storage.buckets
order by
	id;
