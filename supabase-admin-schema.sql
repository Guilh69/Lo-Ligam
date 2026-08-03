-- Lo Ligam — Espace d'administration : tables, rôle admin et verrous de sécurité
-- =============================================================================
-- À coller dans Supabase : Project → SQL Editor → New query → Run.
-- Le script est REJOUABLE : le relancer deux fois ne casse rien.
--
-- PRINCIPE DE SÉCURITÉ À RETENIR
-- La clé de connexion utilisée par le site est PUBLIQUE : elle est lisible
-- dans le code JavaScript de la page par n'importe quel visiteur. C'est prévu
-- ainsi. Cacher la page /admin dans l'interface n'est donc PAS une protection.
-- La seule vraie serrure, ce sont les politiques RLS ci-dessous, appliquées
-- par la base elle-même, quoi que fasse le navigateur.
--
-- Ordre de mise en service :
--   1. lancer ce script
--   2. s'ajouter comme administrateur (bloc 7, à la fin)
--   3. lancer la vérification : cd app && npm run verificar:rls
--   4. seulement ensuite, migrer les fiches et ouvrir les écrans


-- 1) QUI EST ADMINISTRATEUR
-- -----------------------------------------------------------------------------
-- Table volontairement SANS AUCUNE POLITIQUE. Conséquence : depuis un
-- navigateur, personne — pas même un compte connecté, pas même toi — ne peut
-- la lire ni y écrire. Il est donc impossible de se déclarer administrateur
-- depuis le site. Seul le tableau de bord Supabase (qui utilise la clé de
-- service, jamais exposée) peut y toucher.

create table if not exists public.admins (
	user_id uuid primary key references auth.users (id) on delete cascade,
	nòta text,
	created_at timestamptz not null default now()
);

alter table public.admins enable row level security;


-- 2) LA FONCTION QUI RÉPOND « EST-CE UN ADMIN ? »
-- -----------------------------------------------------------------------------
-- Le site a besoin de savoir si l'utilisateur courant est admin (pour afficher
-- le menu d'administration) sans pouvoir lire la table. Cette fonction répond
-- oui/non, et rien d'autre : elle ne révèle jamais QUI sont les admins.
--
-- security definer : la fonction s'exécute avec les droits de son propriétaire,
--   ce qui lui permet de consulter la table verrouillée ci-dessus.
-- set search_path = '' : indispensable avec security definer. Sans cela, un
--   utilisateur pourrait créer une table piège et détourner la fonction.

create or replace function public.is_admin () returns boolean language sql security definer stable
set
	search_path = '' as $$
	select exists (
		select 1 from public.admins a
		where a.user_id = (select auth.uid())
	);
$$;

revoke all on function public.is_admin ()
from
	public;

grant
execute on function public.is_admin () to anon,
authenticated;


-- 3) HORODATAGE AUTOMATIQUE
-- -----------------------------------------------------------------------------

create or replace function public.toca_updated_at () returns trigger language plpgsql
set
	search_path = '' as $$
begin
	new.updated_at = now();
	return new;
end;
$$;


-- 4) LES THÈMES  (= `categories` dans app/src/lib/data/fichas.js)
-- -----------------------------------------------------------------------------

create table if not exists public.temas (
	id text primary key,
	oc text not null,
	fr text not null,
	color text not null default 'var(--color-terracotta)',
	ordre int not null default 0,
	publicat boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists temas_updated_at on public.temas;

create trigger temas_updated_at before
update on public.temas for each row
execute function public.toca_updated_at ();

alter table public.temas enable row level security;


-- 5) LES FICHES
-- -----------------------------------------------------------------------------
-- mini_url / grand_url contiennent SOIT un chemin du site (« /fichas/grand/
-- x.webp », cas des 204 fiches historiques), SOIT une adresse Supabase Storage
-- (cas des fiches ajoutées depuis l'espace d'administration). Les deux
-- cohabitent sans problème : le site affiche l'adresse telle qu'elle est.
--
-- video_url : colonne prévue mais NON UTILISÉE en v1 — décision du 2026-08-03,
-- voir cahier-des-charges.md §11. Héberger 204 MP4 épuiserait à lui seul le
-- quota gratuit de Supabase.

create table if not exists public.fichas (
	id text primary key,
	tema_id text not null references public.temas (id) on update cascade on delete restrict,
	titre text not null,
	mini_url text not null,
	grand_url text not null,
	video_url text,
	ordre int not null default 0,
	publicat boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists fichas_tema_ordre_idx on public.fichas (tema_id, ordre);

drop trigger if exists fichas_updated_at on public.fichas;

create trigger fichas_updated_at before
update on public.fichas for each row
execute function public.toca_updated_at ();

alter table public.fichas enable row level security;


-- 6) LES POLITIQUES  ← le cœur de la sécurité
-- -----------------------------------------------------------------------------
-- Lecture : ouverte à tous, mais UNIQUEMENT sur ce qui est publié. Une fiche
--   en préparation (publicat = false) est invisible pour le public et visible
--   pour l'admin.
-- Écriture : réservée aux administrateurs, sur les trois verbes séparément
--   (ajouter / modifier / supprimer). Aucun n'est ouvert par défaut.
--
-- Les `drop policy if exists` rendent le script rejouable sans erreur.

-- Thèmes
drop policy if exists "temas : lectura publica" on public.temas;

create policy "temas : lectura publica" on public.temas for
select
	using (
		publicat
		or public.is_admin ()
	);

drop policy if exists "temas : apondre (admin)" on public.temas;

create policy "temas : apondre (admin)" on public.temas for insert
with
	check (public.is_admin ());

drop policy if exists "temas : modificar (admin)" on public.temas;

create policy "temas : modificar (admin)" on public.temas
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "temas : suprimir (admin)" on public.temas;

create policy "temas : suprimir (admin)" on public.temas for delete using (public.is_admin ());

-- Fiches
drop policy if exists "fichas : lectura publica" on public.fichas;

create policy "fichas : lectura publica" on public.fichas for
select
	using (
		publicat
		or public.is_admin ()
	);

drop policy if exists "fichas : apondre (admin)" on public.fichas;

create policy "fichas : apondre (admin)" on public.fichas for insert
with
	check (public.is_admin ());

drop policy if exists "fichas : modificar (admin)" on public.fichas;

create policy "fichas : modificar (admin)" on public.fichas
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "fichas : suprimir (admin)" on public.fichas;

create policy "fichas : suprimir (admin)" on public.fichas for delete using (public.is_admin ());


-- 7) LE DOSSIER DE FICHIERS (Supabase Storage)
-- -----------------------------------------------------------------------------
-- file_size_limit : 2 Mo. Les fiches actuelles pèsent ~43 ko en moyenne, la
--   marge est large ; le plafond protège contre un envoi accidentel énorme.
-- allowed_mime_types : webp, jpeg, png UNIQUEMENT.
--   Le SVG est volontairement exclu : un fichier SVG peut contenir du code
--   exécutable, et il serait servi depuis un dossier public. C'est une faille
--   classique. Ne l'ajoute pas, même si un outil te le propose.

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
		'designs',
		'designs',
		true,
		2097152,
		array['image/webp', 'image/jpeg', 'image/png']
	)
on conflict (id) do
update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

-- Si les quatre commandes ci-dessous échouent avec « must be owner of table
-- objects », ce n'est pas grave : passe par Storage → designs → Policies dans
-- le tableau de bord et recopie les mêmes règles à la main. Préviens-moi.
drop policy if exists "designs : lectura publica" on storage.objects;

create policy "designs : lectura publica" on storage.objects for
select
	using (bucket_id = 'designs');

drop policy if exists "designs : mandar (admin)" on storage.objects;

create policy "designs : mandar (admin)" on storage.objects for insert
with
	check (
		bucket_id = 'designs'
		and public.is_admin ()
	);

drop policy if exists "designs : remplaçar (admin)" on storage.objects;

create policy "designs : remplaçar (admin)" on storage.objects
for update
	using (
		bucket_id = 'designs'
		and public.is_admin ()
	)
with
	check (
		bucket_id = 'designs'
		and public.is_admin ()
	);

drop policy if exists "designs : suprimir (admin)" on storage.objects;

create policy "designs : suprimir (admin)" on storage.objects for delete using (
	bucket_id = 'designs'
	and public.is_admin ()
);


-- 8) DEUX LIGNES D'ESSAI, pour que la vérification ait de quoi mordre
-- -----------------------------------------------------------------------------
-- La fiche publiée doit être visible par un visiteur anonyme ; la non publiée
-- doit lui rester invisible. Le script de migration des 204 fiches supprimera
-- ces lignes automatiquement.

insert into
	public.temas (id, oc, fr, ordre, publicat)
values
	(
		'_essai',
		'Essai',
		'Essai',
		9999,
		true
	)
on conflict (id) do nothing;

insert into
	public.fichas (
		id,
		tema_id,
		titre,
		mini_url,
		grand_url,
		publicat
	)
values
	(
		'_essai--publicada',
		'_essai',
		'Fiche d''essai publiée',
		'/fichas/mini/_essai.webp',
		'/fichas/grand/_essai.webp',
		true
	),
	(
		'_essai--rescondida',
		'_essai',
		'Fiche d''essai NON publiée',
		'/fichas/mini/_essai.webp',
		'/fichas/grand/_essai.webp',
		false
	)
on conflict (id) do nothing;


-- 9) TE DÉCLARER ADMINISTRATEUR
-- -----------------------------------------------------------------------------
-- Remplace l'adresse ci-dessous par celle de TON compte Lo Ligam (le compte
-- doit déjà exister — inscris-toi sur le site d'abord si ce n'est pas fait),
-- puis exécute ce bloc.

-- insert into public.admins (user_id, nòta)
-- select id, 'Romain — compte principal' from auth.users where email = 'perier.romain@proton.me'
-- on conflict (user_id) do nothing;
