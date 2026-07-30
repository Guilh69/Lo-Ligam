-- Lo Ligam — schéma de progression utilisateur
-- À coller une seule fois dans Supabase : Project → SQL Editor → New query → Run.
-- Les comptes eux-mêmes (email, mot de passe) sont gérés automatiquement par
-- Supabase Auth (table auth.users) — pas besoin de la créer.

create table if not exists public.lesson_progress (
	user_id uuid references auth.users (id) on delete cascade not null,
	module_id text not null default 'module-1',
	word_index int not null default 0,
	points int not null default 0,
	completed_at timestamptz,
	updated_at timestamptz not null default now(),
	primary key (user_id, module_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can view their own progress" on public.lesson_progress for
select
	using (auth.uid () = user_id);

create policy "Users can insert their own progress" on public.lesson_progress for insert
with
	check (auth.uid () = user_id);

create policy "Users can update their own progress" on public.lesson_progress
for update
	using (auth.uid () = user_id);
