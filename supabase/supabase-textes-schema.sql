-- Lo Ligam — textes éditables du site (« site_textes »)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin(),
-- public.toca_updated_at()).
--
-- PRINCIPE
-- Chaque texte visible du site a une ligne : identifiant stable (connu du
-- code), version occitane, version française, et une note qui dit OÙ le texte
-- apparaît. Romain modifie depuis /admin/textes ; le code ne connaît que les
-- identifiants, jamais le contenu. Si une ligne manque, le site affiche sa
-- valeur de secours écrite dans le code — rien ne casse.

create table if not exists public.site_textes (
	id text primary key,
	oc text not null,
	fr text not null,
	nòta text,
	updated_at timestamptz not null default now()
);

alter table public.site_textes enable row level security;

drop trigger if exists site_textes_updated_at on public.site_textes;

create trigger site_textes_updated_at before
update on public.site_textes for each row
execute function public.toca_updated_at ();

-- Lecture toujours publique (ce sont les textes affichés du site) ; écriture
-- réservée à l'administrateur, verbe par verbe — même règle que partout.
drop policy if exists "site_textes : lectura publica" on public.site_textes;

create policy "site_textes : lectura publica" on public.site_textes for
select
	using (true);

drop policy if exists "site_textes : apondre (admin)" on public.site_textes;

create policy "site_textes : apondre (admin)" on public.site_textes for insert
with
	check (public.is_admin ());

drop policy if exists "site_textes : modificar (admin)" on public.site_textes;

create policy "site_textes : modificar (admin)" on public.site_textes
for update
	using (public.is_admin ())
with
	check (public.is_admin ());

drop policy if exists "site_textes : suprimir (admin)" on public.site_textes;

create policy "site_textes : suprimir (admin)" on public.site_textes for delete using (public.is_admin ());


-- TEXTES DE DÉPART : exactement ceux affichés aujourd'hui sur l'accueil,
-- pour que la bascule ne change rien à l'écran.
insert into
	public.site_textes (id, oc, fr, nòta)
values
	(
		'hero_lead',
		'Lo Ligam t''acompanha',
		'Lo Ligam t''accompagne',
		'Acuèlh — la granda frasa d''entrada'
	),
	(
		'hero_sub',
		'a la descobèrta de l''occitan',
		'à la découverte de l''occitan',
		'Acuèlh — la linha jos la granda frasa'
	),
	(
		'what_title',
		'Qu’es aquò, Lo Ligam ?',
		'Qu’est-ce que Lo Ligam ?',
		'Acuèlh — capítol 01, títol'
	),
	(
		'what_lead',
		'Un sol endrech per tot l’ecosistèma occitan : aprene la lenga, descobrir lo país, se retrobar.',
		'Un seul endroit pour tout l’écosystème occitan : apprendre la langue, découvrir le pays, se retrouver.',
		'Acuèlh — capítol 01, tèxte d''introduccion'
	),
	(
		'lenga_title',
		'L’occitan, uèi',
		'L’occitan, aujourd’hui',
		'Acuèlh — capítol 02, títol'
	),
	(
		'lenga_lead',
		'Una lenga viva, parlada de l’Atlantic a las Alps.',
		'Une langue vivante, parlée de l’Atlantique aux Alpes.',
		'Acuèlh — capítol 02, tèxte d''introduccion'
	),
	(
		'lenga_fact1_num',
		'XX',
		'XX',
		'Acuèlh — capítol 02, chifra 1 (meteissa valor dins las doas lengas)'
	),
	(
		'lenga_fact1_label',
		'de locutors',
		'de locuteurs',
		'Acuèlh — capítol 02, legenda de la chifra 1'
	),
	(
		'lenga_fact2_num',
		'XX',
		'XX',
		'Acuèlh — capítol 02, chifra 2'
	),
	(
		'lenga_fact2_label',
		'despartaments',
		'départements',
		'Acuèlh — capítol 02, legenda de la chifra 2'
	),
	(
		'lenga_fact3_num',
		'XX',
		'XX',
		'Acuèlh — capítol 02, chifra 3'
	),
	(
		'lenga_fact3_label',
		'sègles de literatura',
		'siècles de littérature',
		'Acuèlh — capítol 02, legenda de la chifra 3'
	),
	(
		'lenga_note',
		'Chifras d’exemple, de completar.',
		'Chiffres d’exemple, à compléter.',
		'Acuèlh — capítol 02, pichona nòta jos las chifras'
	),
	(
		'carta_title',
		'Lo Mond en occitan',
		'Le Monde en occitan',
		'Acuèlh — capítol 03, títol'
	),
	(
		'carta_lead',
		'Una carta entièra dins la lenga, dialèctes e luòcs d’interès compreses.',
		'Une carte entière dans la langue, dialectes et lieux d’intérêt compris.',
		'Acuèlh — capítol 03, tèxte d''introduccion'
	),
	(
		'carta_cta',
		'Dobrir la carta entièra',
		'Ouvrir la carte entière',
		'Acuèlh — capítol 03, bòton jos la carta'
	),
	(
		'officialitat_title',
		'Una lenga sens estatut',
		'Une langue sans statut',
		'Acuèlh — capítol 04, títol'
	),
	(
		'officialitat_lead',
		'Co-oficiala en Val d’Aran, protegida en Itàlia, sens estatut en França : nòu cartas per o comprene.',
		'Co-officielle au Val d’Aran, protégée en Italie, sans statut en France : neuf cartes pour le comprendre.',
		'Acuèlh — capítol 04, tèxte d''introduccion'
	),
	(
		'footer_tagline',
		'Fach amb amor en Occitània.',
		'Fait avec amour en Occitanie.',
		'Pè de pagina — la devisa'
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
		where ns.nspname = 'public' and c.relname = 'site_textes' and c.relrowsecurity
	) then
		raise exception 'SEGURETAT : public.site_textes es pas protegida per RLS. Tot es anullat.';
	end if;

	select count(*) into n
	from pg_policies where schemaname = 'public' and tablename = 'site_textes';
	if n <> 4 then
		raise exception
			'SEGURETAT : public.site_textes deuriá aver 4 politicas, ne a %. Tot es anullat.', n;
	end if;

	raise notice 'Taula « site_textes » prèsta : RLS actiu, 4 politicas.';
end $$;

select
	id,
	left(oc, 40) as oc,
	nòta
from
	public.site_textes
order by
	id;
