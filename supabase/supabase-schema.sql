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

-- Profil rempli une fois, juste après l'inscription (pseudo + questionnaire
-- d'accueil). Champs démographiques tous facultatifs sauf le pseudo — voir
-- /compte/questionnaire dans le code pour les libellés affichés.
create table if not exists public.profiles (
	user_id uuid references auth.users (id) on delete cascade primary key,
	pseudo text not null,
	gender text,
	age_bracket text,
	profession text,
	location text,
	interest text,
	interest_other text,
	created_at timestamptz not null default now()
);

create unique index if not exists profiles_pseudo_lower_idx on public.profiles (lower(pseudo));

alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles for
select
	using (auth.uid () = user_id);

create policy "Users can insert their own profile" on public.profiles for insert
with
	check (auth.uid () = user_id);

create policy "Users can update their own profile" on public.profiles
for update
	using (auth.uid () = user_id);
