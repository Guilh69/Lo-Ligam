-- Lo Ligam — espace « Òbras » (musiques, livres, films)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
--
-- CE QU'ON STOCKE, ET CE QU'ON NE STOCKE PAS
-- On n'héberge AUCUN extrait : ni son, ni vidéo, ni fichier. On garde des
-- informations et un lien. L'écoute passe par le lecteur officiel de la
-- plateforme, qui porte les droits et rémunère les ayants droit.
-- Décision du 2026-08-04, §11 — extraire le son d'une vidéo YouTube est
-- interdit par leurs conditions, et le droit français ne connaît pas
-- d'exception « court extrait » pour la musique.
--
-- imatge_url : couverture. À ne remplir que si la source l'autorise (flux
-- partenaire d'une librairie, dossier de presse, accord de l'éditeur). Dans le
-- doute, laisser vide : la fiche s'affiche très bien sans.

create table if not exists public.obras (
	id text primary key,
	mena text not null default 'musica',
	titre text not null,
	autor text not null,
	editor text,
	an int,
	-- Lecteur officiel à intégrer (YouTube pour l'instant), chargé au clic.
	embed_url text,
	-- Où aller pour acheter ou écouter en entier — librairie occitane de
	-- préférence.
	ligam text,
	imatge_url text,
	-- Le commentaire de Romain : c'est ce qui a le plus de valeur ici, et la
	-- seule chose de cette table qui lui appartienne pleinement.
	comentari text,
	ordre int not null default 0,
	publicat boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint obras_mena_valida check (mena in ('musica', 'libre', 'filme'))
);

alter table public.obras enable row level security;

create index if not exists obras_mena_ordre_idx on public.obras (mena, ordre);

drop trigger if exists obras_updated_at on public.obras;

create trigger obras_updated_at before
update on public.obras for each row
execute function public.toca_updated_at ();

-- Mêmes règles que partout : lecture ouverte sur ce qui est publié, écriture
-- réservée à l'administrateur, verbe par verbe.
drop policy if exists "obras : lectura publica" on public.obras;

create policy "obras : lectura publica" on public.obras for
select
	using (
		publicat
		or public.is_admin ()
	);

drop policy if exists "obras : apondre (admin)" on public.obras;

create policy "obras : apondre (admin)" on public.obras for insert
with
	check (public.is_admin ());

drop policy if exists "obras : modificar (admin)" on public.obras;

create policy "obras : modificar (admin)" on public.obras
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "obras : suprimir (admin)" on public.obras;

create policy "obras : suprimir (admin)" on public.obras for delete using (public.is_admin ());


-- Une première œuvre, pour avoir de quoi regarder tout de suite.
-- Rodín, rappeur et poète d'expression occitane, Marseille. « Rei de la luna »,
-- album « Pantais clus » (Pantais Recòrds, 2021).
-- Le commentaire ci-dessous est un texte d'attente : Romain le remplacera par
-- le sien depuis l'espace d'administration.
insert into
	public.obras (
		id,
		mena,
		titre,
		autor,
		editor,
		an,
		embed_url,
		ligam,
		comentari,
		ordre,
		publicat
	)
values
	(
		'rodin--rei-de-la-luna',
		'musica',
		'Rei de la luna',
		'Rodín',
		'Pantais Recòrds',
		2021,
		'https://www.youtube.com/watch?v=E8kEP1OdcyM',
		'https://www.libraria-occitana.org/en/product/pantais-clus/',
		'A completar per Romain. (Commentaire à écrire.)',
		0,
		true
	)
on conflict (id) do nothing;


-- GARDE-FOU : le script refuse d'aboutir si la table n'est pas protégée.
do $$
declare
	n int;
begin
	if not exists (
		select 1
		from pg_class c
		join pg_namespace ns on ns.oid = c.relnamespace
		where ns.nspname = 'public' and c.relname = 'obras' and c.relrowsecurity
	) then
		raise exception 'SEGURETAT : public.obras es pas protegida per RLS. Tot es anullat.';
	end if;

	select count(*) into n
	from pg_policies where schemaname = 'public' and tablename = 'obras';
	if n <> 4 then
		raise exception
			'SEGURETAT : public.obras deuriá aver 4 politicas, ne a %. Tot es anullat.', n;
	end if;

	raise notice 'Taula « obras » prèsta : RLS actiu, 4 politicas.';
end $$;

select
	id,
	mena,
	titre,
	autor,
	an
from
	public.obras
order by
	ordre;
