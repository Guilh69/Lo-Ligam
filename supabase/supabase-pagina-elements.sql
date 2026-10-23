-- Lo Ligam — édition sur place : les éléments modifiables des pages
-- =============================================================================
-- Fabriqué par app/scripts/elements-sql.mjs le 2026-10-23 ; ne pas modifier à la main.
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable sans risque :
-- la semence ne touche pas aux lignes déjà présentes.
-- Suppose que supabase-admin-schema.sql a déjà été exécuté (public.is_admin(),
-- public.toca_updated_at()).
--
-- Un élément = une ligne par état : 'publicat' (ce que tout le monde voit) et
-- 'brolhon' (ce que l'administrateur prépare). publicar_pagina() fond les
-- brouillons dans le publié ; les publications précédentes sont gardées
-- (pagina_publicacions) pour pouvoir y revenir.

create table if not exists public.pagina_elements (
	clau text not null,
	estat text not null default 'publicat' check (estat in ('publicat', 'brolhon')),
	pagina text not null,
	tipe text not null check (tipe in ('text', 'ligam', 'imatge', 'bloc')),
	lista text,
	ordre integer not null default 0,
	oc text,
	fr text,
	-- une page du site (jamais « //ailleurs », adresse externe déguisée), une ancre, ou https
	ligam text check (ligam is null or ligam ~ '^(/([^/[:space:]][^[:space:]]*)?|#[^[:space:]]+|https://[^[:space:]]+)$'),
	imatge jsonb check (imatge is null or imatge->>'url' ~ '^(/[^/]|https://|blob:)'),
	estil jsonb not null default '{}'::jsonb,
	moviment jsonb not null default '{}'::jsonb,
	visible boolean not null default true,
	suprimit boolean not null default false,
	updated_at timestamptz not null default now(),
	primary key (clau, estat)
);
create index if not exists pagina_elements_pagina on public.pagina_elements (pagina, estat);

alter table public.pagina_elements enable row level security;

drop trigger if exists pagina_elements_updated_at on public.pagina_elements;
create trigger pagina_elements_updated_at before update on public.pagina_elements
	for each row execute function public.toca_updated_at ();

-- Lecture : le publié pour tout le monde, le brouillon pour l'administrateur
drop policy if exists "pagina_elements : lectura" on public.pagina_elements;
create policy "pagina_elements : lectura" on public.pagina_elements for select
	using (estat = 'publicat' or public.is_admin ());
drop policy if exists "pagina_elements : apondre (admin)" on public.pagina_elements;
create policy "pagina_elements : apondre (admin)" on public.pagina_elements for insert
	with check (public.is_admin ());
drop policy if exists "pagina_elements : modificar (admin)" on public.pagina_elements;
create policy "pagina_elements : modificar (admin)" on public.pagina_elements for update
	using (public.is_admin ()) with check (public.is_admin ());
drop policy if exists "pagina_elements : suprimir (admin)" on public.pagina_elements;
create policy "pagina_elements : suprimir (admin)" on public.pagina_elements for delete
	using (public.is_admin ());

-- Les publications passées (photographie du publié avant chaque publication)
create table if not exists public.pagina_publicacions (
	id bigserial primary key,
	pagina text not null,
	creat timestamptz not null default now(),
	nòta text,
	fotografia jsonb not null
);
alter table public.pagina_publicacions enable row level security;
drop policy if exists "pagina_publicacions : admin" on public.pagina_publicacions;
create policy "pagina_publicacions : admin" on public.pagina_publicacions for all
	using (public.is_admin ()) with check (public.is_admin ());

-- Publier : les brouillons remplacent le publié (ou le retirent), la
-- photographie d'avant est gardée. Renvoie le nombre d'éléments publiés.
create or replace function public.publicar_pagina (p_pagina text) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	n integer;
begin
	if not public.is_admin () then
		raise exception 'reservat a l''administrator';
	end if;
	insert into public.pagina_publicacions (pagina, fotografia)
	select p_pagina, coalesce(jsonb_agg(to_jsonb(e) - 'estat'), '[]'::jsonb)
	from public.pagina_elements e where e.pagina = p_pagina and e.estat = 'publicat';
	delete from public.pagina_elements p
	where p.pagina = p_pagina and p.estat = 'publicat'
		and exists (select 1 from public.pagina_elements b where b.clau = p.clau and b.estat = 'brolhon' and b.suprimit);
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select clau, 'publicat', pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, false
	from public.pagina_elements where pagina = p_pagina and estat = 'brolhon' and not suprimit
	on conflict (clau, estat) do update set
		tipe = excluded.tipe, lista = excluded.lista, ordre = excluded.ordre, oc = excluded.oc, fr = excluded.fr,
		ligam = excluded.ligam, imatge = excluded.imatge, estil = excluded.estil, moviment = excluded.moviment,
		visible = excluded.visible, suprimit = false;
	delete from public.pagina_elements where pagina = p_pagina and estat = 'brolhon';
	select count(*) into n from public.pagina_elements where pagina = p_pagina and estat = 'publicat';
	return n;
end $$;
revoke all on function public.publicar_pagina (text) from public;
grant execute on function public.publicar_pagina (text) to authenticated;

-- Revenir à une publication passée : elle est reposée en brouillon, à relire
-- puis à publier.
create or replace function public.restaurar_publicacion (p_id bigint) returns integer
	language plpgsql security definer set search_path = '' as $$
declare
	pub record;
	n integer;
begin
	if not public.is_admin () then
		raise exception 'reservat a l''administrator';
	end if;
	select * into pub from public.pagina_publicacions where id = p_id;
	if pub is null then
		raise exception 'publicacion desconeguda';
	end if;
	delete from public.pagina_elements where pagina = pub.pagina and estat = 'brolhon';
	-- ce qui existe aujourd'hui mais pas dans la photographie est marqué à retirer
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select e.clau, 'brolhon', e.pagina, e.tipe, e.lista, e.ordre, e.oc, e.fr, e.ligam, e.imatge, e.estil, e.moviment, e.visible, true
	from public.pagina_elements e
	where e.pagina = pub.pagina and e.estat = 'publicat'
		and not exists (select 1 from jsonb_array_elements(pub.fotografia) f where f->>'clau' = e.clau);
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, estil, moviment, visible, suprimit)
	select f->>'clau', 'brolhon', pub.pagina, f->>'tipe', f->>'lista', coalesce((f->>'ordre')::int, 0), f->>'oc', f->>'fr', f->>'ligam',
		nullif(f->'imatge', 'null'::jsonb), coalesce(nullif(f->'estil', 'null'::jsonb), '{}'::jsonb), coalesce(nullif(f->'moviment', 'null'::jsonb), '{}'::jsonb), coalesce((f->>'visible')::boolean, true), false
	from jsonb_array_elements(pub.fotografia) f;
	select count(*) into n from public.pagina_elements where pagina = pub.pagina and estat = 'brolhon';
	return n;
end $$;
revoke all on function public.restaurar_publicacion (bigint) from public;
grant execute on function public.restaurar_publicacion (bigint) to authenticated;

-- Les images des pages : dossier public, 2 Mo au plus, webp / jpeg / png
-- (jamais de SVG : il peut porter du code).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('paginas', 'paginas', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "paginas : lectura publica" on storage.objects;
create policy "paginas : lectura publica" on storage.objects for select using (bucket_id = 'paginas');
drop policy if exists "paginas : mandar (admin)" on storage.objects;
create policy "paginas : mandar (admin)" on storage.objects for insert with check (bucket_id = 'paginas' and public.is_admin ());
drop policy if exists "paginas : remplaçar (admin)" on storage.objects;
create policy "paginas : remplaçar (admin)" on storage.objects for update using (bucket_id = 'paginas' and public.is_admin ());
drop policy if exists "paginas : suprimir (admin)" on storage.objects;
create policy "paginas : suprimir (admin)" on storage.objects for delete using (bucket_id = 'paginas' and public.is_admin ());

-- La semence : les éléments tels que le site les affiche aujourd'hui
-- (72 lignes). Jamais écrasés s'ils existent déjà.
insert into public.pagina_elements (clau, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, visible) values
	('acuelh.eros.kicker', 'acuelh', 'text', null, 0, 'L’occitan', 'L’occitan', null, null, true),
	('acuelh.eros.titol.1', 'acuelh', 'text', null, 0, 'Se parla.', 'Se parle.', null, null, true),
	('acuelh.eros.titol.2', 'acuelh', 'text', null, 0, 'S’apren.', 'S’apprend.', null, null, true),
	('acuelh.eros.titol.3', 'acuelh', 'text', null, 0, 'Amassa.', 'Rassemble.', null, null, true),
	('acuelh.eros.frasa', 'acuelh', 'text', null, 0, 'Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.', 'Bienvenue dans ton lien avec le monde occitan. D’où que tu sois, tu es ici chez toi.', null, null, true),
	('acuelh.eros.indici', 'acuelh', 'text', null, 0, 'Passa la mirga suls tres mots.', 'Survole les trois mots.', null, null, true),
	('acuelh.eros.carta', 'acuelh', 'ligam', null, 0, 'Dobrir la carta', 'Ouvrir la carte', '/carta', null, true),
	('acuelh.eros.aprene', 'acuelh', 'ligam', null, 0, 'Aprene l’occitan', 'Apprendre l’occitan', '#biais', null, true),
	('acuelh.bandel.m01', 'acuelh', 'text', 'acuelh.bandel', 1, 'lo risolet', 'le sourire', null, null, true),
	('acuelh.bandel.m02', 'acuelh', 'text', 'acuelh.bandel', 2, 'la rispa', 'la bise', null, null, true),
	('acuelh.bandel.m03', 'acuelh', 'text', 'acuelh.bandel', 3, 'la rogeiròla', 'le ciel rouge du crépuscule', null, null, true),
	('acuelh.bandel.m04', 'acuelh', 'text', 'acuelh.bandel', 4, 'la roèla', 'le coquelicot', null, null, true),
	('acuelh.bandel.m05', 'acuelh', 'text', 'acuelh.bandel', 5, 'la romieva', 'l’oie sauvage', null, null, true),
	('acuelh.bandel.m06', 'acuelh', 'text', 'acuelh.bandel', 6, 'lo rodaire', 'l’errant', null, null, true),
	('acuelh.bandel.m07', 'acuelh', 'text', 'acuelh.bandel', 7, 'lo lindau', 'le seuil', null, null, true),
	('acuelh.bandel.m08', 'acuelh', 'text', 'acuelh.bandel', 8, 'l’abelhòla', 'le guêpier', null, null, true),
	('acuelh.bandel.m09', 'acuelh', 'text', 'acuelh.bandel', 9, 'l’abitarèla', 'le refuge', null, null, true),
	('acuelh.bandel.m10', 'acuelh', 'text', 'acuelh.bandel', 10, 'abelugat', 'étincelant', null, null, true),
	('acuelh.bandel.m11', 'acuelh', 'text', 'acuelh.bandel', 11, 'a l’embrunit', 'à la tombée de la nuit', null, null, true),
	('acuelh.bandel.font', 'acuelh', 'text', null, 0, 'Mots del _Lexic de Max Roqueta_, establit per Joan-Guilhèm Roqueta', 'Mots du _Lexique de Max Rouquette_, établi par Jean-Guilhem Rouquette', null, null, true),
	('acuelh.manifest.titol', 'acuelh', 'text', null, 0, 'Qu’es aquò, Lo Ligam ?', 'Qu’est-ce que Lo Ligam ?', null, null, true),
	('acuelh.manifest.tèxt', 'acuelh', 'text', null, 0, 'Aicí, l’occitan s’apren *sens vergonha* e *amb benvolença,* e cada leiçon fa *ligam.*', 'Ici, l’occitan s’apprend *sans honte* et *avec bienveillance,* et chaque leçon crée du *lien.*', null, null, true),
	('acuelh.manifest.retrat', 'acuelh', 'imatge', null, 0, null, null, null, '{"url":"/acuelh/romain.webp","largor":600,"nautor":620,"alt_oc":"","alt_fr":""}'::jsonb, true),
	('acuelh.manifest.legenda', 'acuelh', 'text', null, 0, 'Romain Périer', 'Romain Périer', null, null, true),
	('acuelh.sec.parla.titol', 'acuelh', 'text', null, 0, 'Se parla', 'Se parle', null, null, true),
	('acuelh.parla.carta', 'acuelh', 'ligam', null, 0, 'Dobrir la carta entièra', 'Ouvrir la carte entière', '/carta', null, true),
	('acuelh.parla.ligams.wiki', 'acuelh', 'ligam', 'acuelh.parla.ligams', 1, 'Lo wiki de las lengas e dels luòcs', 'Le wiki des langues et des lieux', '/wiki', null, true),
	('acuelh.parla.ligams.obras', 'acuelh', 'ligam', 'acuelh.parla.ligams', 2, 'Òbras', 'Œuvres', '/obras', null, true),
	('acuelh.parla.ligams.articles', 'acuelh', 'ligam', 'acuelh.parla.ligams', 3, 'Articles', 'Articles', '/articles', null, true),
	('acuelh.chifras.c1', 'acuelh', 'bloc', 'acuelh.chifras', 1, null, null, null, null, true),
	('acuelh.chifras.c1.num', 'acuelh', 'text', 'acuelh.chifras.c1', 0, '≈ 600 000', '≈ 600 000', null, null, true),
	('acuelh.chifras.c1.nom', 'acuelh', 'text', 'acuelh.chifras.c1', 0, 'locutors', 'locuteurs', null, null, true),
	('acuelh.chifras.c1.font', 'acuelh', 'text', 'acuelh.chifras.c1', 0, 'Estimacion, enquèsta sociolingüistica OPLO, 2020', 'Estimation, enquête sociolinguistique OPLO, 2020', null, null, true),
	('acuelh.chifras.c2', 'acuelh', 'bloc', 'acuelh.chifras', 2, null, null, null, null, true),
	('acuelh.chifras.c2.num', 'acuelh', 'text', 'acuelh.chifras.c2', 0, '32', '32', null, null, true),
	('acuelh.chifras.c2.nom', 'acuelh', 'text', 'acuelh.chifras.c2', 0, 'despartaments', 'départements', null, null, true),
	('acuelh.chifras.c2.font', 'acuelh', 'text', 'acuelh.chifras.c2', 0, 'e mai la Val d’Aran e las valadas occitanas d’Itàlia', 'plus le Val d’Aran et les vallées occitanes d’Italie', null, null, true),
	('acuelh.chifras.c3', 'acuelh', 'bloc', 'acuelh.chifras', 3, null, null, null, null, true),
	('acuelh.chifras.c3.num', 'acuelh', 'text', 'acuelh.chifras.c3', 0, '10', '10', null, null, true),
	('acuelh.chifras.c3.nom', 'acuelh', 'text', 'acuelh.chifras.c3', 0, 'sègles de literatura', 'siècles de littérature', null, null, true),
	('acuelh.chifras.c3.font', 'acuelh', 'text', 'acuelh.chifras.c3', 0, 'dempuèi los primièrs trobadors', 'depuis les premiers troubadours', null, null, true),
	('acuelh.pont.mot', 'acuelh', 'text', null, 0, 'Puèi', 'Ensuite', null, null, true),
	('acuelh.sec.apren.titol', 'acuelh', 'text', null, 0, 'S’apren', 'S’apprend', null, null, true),
	('acuelh.biais.visio', 'acuelh', 'bloc', 'acuelh.biais', 1, null, null, null, null, true),
	('acuelh.biais.visio.titol', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'En visio, amb ieu', 'En visio, avec moi', null, null, true),
	('acuelh.biais.visio.tèxt', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'De corses en dirècte, en pichon grop o sol a sol. Lo primièr es ofèrt.', 'Des cours en direct, en petit groupe ou en tête-à-tête. Le premier est offert.', null, null, true),
	('acuelh.biais.visio.ligam', 'acuelh', 'ligam', 'acuelh.biais.visio', 0, 'Prene rendètz-vos', 'Prendre rendez-vous', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.biais.ritme', 'acuelh', 'bloc', 'acuelh.biais', 2, null, null, null, null, true),
	('acuelh.biais.ritme.titol', 'acuelh', 'text', 'acuelh.biais.ritme', 0, 'A ton ritme', 'À ton rythme', null, null, true),
	('acuelh.biais.ritme.tèxt', 'acuelh', 'text', 'acuelh.biais.ritme', 0, 'Un parcors autonòm, de zèro fins al nivèl B1, leiçon per leiçon, per contunhar entre dos corses.', 'Un parcours autonome, de zéro jusqu’au niveau B1, leçon par leçon, pour continuer entre deux cours.', null, null, true),
	('acuelh.biais.ritme.ligam', 'acuelh', 'ligam', 'acuelh.biais.ritme', 0, 'Començar lo parcors', 'Commencer le parcours', '/aprene', null, true),
	('acuelh.biais.mesura', 'acuelh', 'bloc', 'acuelh.biais', 3, null, null, null, null, true),
	('acuelh.biais.mesura.titol', 'acuelh', 'text', 'acuelh.biais.mesura', 0, 'Sus mesura', 'Sur mesure', null, null, true),
	('acuelh.biais.mesura.tèxt', 'acuelh', 'text', 'acuelh.biais.mesura', 0, 'Visio, parcors autonòm e rescontres en persona se sèm dins la meteissa vila : ara, soi a Lion.', 'Visio, parcours autonome et rencontres en personne si nous sommes dans la même ville : en ce moment, je suis à Lyon.', null, null, true),
	('acuelh.biais.mesura.ligam', 'acuelh', 'ligam', 'acuelh.biais.mesura', 0, 'Ne parlar amassa', 'En parler ensemble', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.lengas.legenda', 'acuelh', 'text', null, 0, 'Aprene l’occitan dempuèi :', 'Apprendre l’occitan depuis :', null, null, true),
	('acuelh.sec.viu.titol', 'acuelh', 'text', null, 0, 'Amassa', 'Rassemble', null, null, true),
	('acuelh.viure.comunautat.nom', 'acuelh', 'text', null, 0, 'La comunautat', 'La communauté', null, null, true),
	('acuelh.viure.comunautat.sota', 'acuelh', 'text', null, 0, 'Fòrum, grops e idèas', 'Forum, groupes et idées', null, null, true),
	('acuelh.viure.comunautat.items.forum', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 1, 'Fòrum', 'Forum', '/forum', null, true),
	('acuelh.viure.comunautat.items.grops', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 2, 'Grops', 'Groupes', '/grops', null, true),
	('acuelh.viure.comunautat.items.ideas', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 3, 'Boita d’idèas', 'Boîte à idées', '/ideas', null, true),
	('acuelh.viure.comunautat.items.instagram', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 4, 'Instagram', 'Instagram', 'https://www.instagram.com/lo_ligam/', null, true),
	('acuelh.trobador.fenestra', 'acuelh', 'imatge', null, 0, null, null, null, '{"url":"/acuelh/erau.webp","largor":1500,"nautor":2173,"alt_oc":"","alt_fr":""}'::jsonb, true),
	('acuelh.trobador.vers.1', 'acuelh', 'text', null, 0, '« Espinchas dins la solelhada', '« Espinchas dins la solelhada', null, null, true),
	('acuelh.trobador.vers.2', 'acuelh', 'text', null, 0, 'passar d’un nivol lo pantai… »', 'passar d’un nivol lo pantai… »', null, null, true),
	('acuelh.trobador.cita', 'acuelh', 'text', null, 0, 'Max Roqueta · _La pietat dau matin_, 1963', 'Max Rouquette · _La pietat dau matin_, 1963', null, null, true),
	('acuelh.crida.titol.1', 'acuelh', 'text', null, 0, 'Prèst·a per', 'Prêt·e à', null, null, true),
	('acuelh.crida.titol.2', 'acuelh', 'text', null, 0, 'començar ?', 'commencer ?', null, null, true),
	('acuelh.crida.sota', 'acuelh', 'text', null, 0, 'Tres mots uèi, una lenga deman.', 'Trois mots aujourd’hui, une langue demain.', null, null, true),
	('acuelh.crida.reservar', 'acuelh', 'ligam', null, 0, 'Reservar un primièr cors', 'Réserver un premier cours', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.crida.sol', 'acuelh', 'ligam', null, 0, 'Començar sol·a', 'Commencer seul·e', '/aprene/essai', null, true)
on conflict (clau, estat) do nothing;
