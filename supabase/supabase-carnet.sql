-- Carnet de révision de l'élève (chantier 20, cahier §11, 2026-10-24).
-- À coller une fois par Romain dans Supabase : SQL Editor → New query → Run.
-- Une ligne par carte (« bonjorn:reconnais », « bonjorn:produis »…) ; l'état
-- de la carte (planification FSRS, jours de réussite, date d'acquisition) est
-- gardé tel quel en JSON, comme dans le navigateur (app/src/lib/carnet/).
-- Sans cette table, le carnet reste simplement dans le navigateur.

create table if not exists public.carnet_cartes (
	user_id uuid references auth.users (id) on delete cascade not null,
	carte_id text not null check (char_length(carte_id) <= 120),
	etat jsonb not null check (pg_column_size(etat) <= 2000),
	maj timestamptz not null default now(),
	primary key (user_id, carte_id)
);

-- Chacun ne voit et ne modifie que ses propres cartes.
alter table public.carnet_cartes enable row level security;

drop policy if exists "Carnet : lire ses cartes" on public.carnet_cartes;
create policy "Carnet : lire ses cartes" on public.carnet_cartes for select
	using (auth.uid () = user_id);

drop policy if exists "Carnet : ajouter ses cartes" on public.carnet_cartes;
create policy "Carnet : ajouter ses cartes" on public.carnet_cartes for insert
	with check (auth.uid () = user_id);

drop policy if exists "Carnet : modifier ses cartes" on public.carnet_cartes;
create policy "Carnet : modifier ses cartes" on public.carnet_cartes for update
	using (auth.uid () = user_id)
	with check (auth.uid () = user_id);

drop policy if exists "Carnet : effacer ses cartes" on public.carnet_cartes;
create policy "Carnet : effacer ses cartes" on public.carnet_cartes for delete
	using (auth.uid () = user_id);
