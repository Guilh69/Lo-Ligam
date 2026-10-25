-- Lo Ligam — édition sur place : les éléments modifiables des pages
-- =============================================================================
-- Fabriqué par app/scripts/elements-sql.mjs le 2026-10-25 ; ne pas modifier à la main.
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
-- (272 lignes). Jamais écrasés s'ils existent déjà.
insert into public.pagina_elements (clau, pagina, tipe, lista, ordre, oc, fr, ligam, imatge, visible) values
	('acuelh.eros.kicker', 'acuelh', 'text', null, 0, 'L’occitan', 'L’occitan', null, null, true),
	('acuelh.eros.titol.1', 'acuelh', 'text', null, 0, 'Se parla.', 'Se parle.', null, null, true),
	('acuelh.eros.titol.2', 'acuelh', 'text', null, 0, 'S’apren.', 'S’apprend.', null, null, true),
	('acuelh.eros.titol.3', 'acuelh', 'text', null, 0, 'Amassa.', 'Rassemble.', null, null, true),
	('acuelh.eros.frasa', 'acuelh', 'text', null, 0, 'Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.', 'Bienvenue dans ton lien avec le monde occitan. D’où que tu sois, tu es ici chez toi.', null, null, true),
	('acuelh.eros.indici', 'acuelh', 'text', null, 0, 'Passa la mirga suls tres mots.', 'Survole les trois mots.', null, null, true),
	('acuelh.mondes.parla.sota', 'acuelh', 'text', null, 0, 'Lo país e sas lengas, en carta d’estelas.', 'Le pays et ses langues, en carte d’étoiles.', null, null, true),
	('acuelh.mondes.apren.sota', 'acuelh', 'text', null, 0, 'Un camin, pas a pas, a ton ritme.', 'Un chemin, pas à pas, à ton rythme.', null, null, true),
	('acuelh.mondes.viu.sota', 'acuelh', 'text', null, 0, 'De monde, de ligams, pertot.', 'Des gens, des liens, partout.', null, null, true),
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
	('acuelh.manifest.retrat', 'acuelh', 'imatge', null, 0, null, null, null, '{"url":"/acuelh/romain.webp","largor":480,"nautor":600,"alt_oc":"Romain Périer davant lo pic Sant Lop, dins una fenèstra de pèira","alt_fr":"Romain Périer devant le pic Saint-Loup, dans une fenêtre de pierre"}'::jsonb, true),
	('acuelh.manifest.legenda', 'acuelh', 'text', null, 0, 'ton professor', 'ton professeur', null, null, true),
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
	('acuelh.sec.apren.titol', 'acuelh', 'text', null, 0, 'S’apren', 'S’apprend', null, null, true),
	('acuelh.biais.visio', 'acuelh', 'bloc', 'acuelh.biais', 1, null, null, null, null, true),
	('acuelh.biais.visio.titol', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'En visio, amb ieu', 'En visio, avec moi', null, null, true),
	('acuelh.biais.visio.tèxt', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'De corses en dirècte, sol a sol. Lo primièr es ofèrt.', 'Des cours en direct, en tête-à-tête. Le premier est offert.', null, null, true),
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
	('acuelh.crida.sota', 'acuelh', 'text', null, 0, '', '', null, null, false),
	('acuelh.crida.reservar', 'acuelh', 'ligam', null, 0, 'Reservar un primièr cors', 'Réserver un premier cours', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.crida.sol', 'acuelh', 'ligam', null, 0, 'Començar sol·a', 'Commencer seul·e', '/aprene/essai', null, true),
	('parla.titol', 'parla', 'text', null, 0, 'Se parla', 'Se parle', null, null, true),
	('parla.frasa', 'parla', 'text', null, 0, 'A escriure : ta frasa sus Se parla', 'À écrire : ta phrase sur Se parle', null, null, false),
	('parla.teulas.carta', 'parla', 'bloc', 'parla.teulas', 1, null, null, null, null, true),
	('parla.teulas.carta.ligam', 'parla', 'ligam', 'parla.teulas.carta', 0, 'La carta', 'La carte', '/carta', null, true),
	('parla.teulas.carta.sota', 'parla', 'text', 'parla.teulas.carta', 0, 'L’aira culturala occitana, sas lengas e sos luòcs.', 'L’aire culturelle occitane, ses langues et ses lieux.', null, null, true),
	('parla.teulas.wiki', 'parla', 'bloc', 'parla.teulas', 2, null, null, null, null, true),
	('parla.teulas.wiki.ligam', 'parla', 'ligam', 'parla.teulas.wiki', 0, 'Lo wiki', 'Le wiki', '/wiki', null, true),
	('parla.teulas.wiki.sota', 'parla', 'text', 'parla.teulas.wiki', 0, 'A escriure', 'À écrire', null, null, false),
	('parla.teulas.obras', 'parla', 'bloc', 'parla.teulas', 3, null, null, null, null, true),
	('parla.teulas.obras.ligam', 'parla', 'ligam', 'parla.teulas.obras', 0, 'Òbras', 'Œuvres', '/obras', null, true),
	('parla.teulas.obras.sota', 'parla', 'text', 'parla.teulas.obras', 0, 'Çò qu’escoti, çò que legissi, çò que te fau descobrir.', 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir.', null, null, true),
	('parla.teulas.articles', 'parla', 'bloc', 'parla.teulas', 4, null, null, null, null, true),
	('parla.teulas.articles.ligam', 'parla', 'ligam', 'parla.teulas.articles', 0, 'Articles', 'Articles', '/articles', null, true),
	('parla.teulas.articles.sota', 'parla', 'text', 'parla.teulas.articles', 0, 'A escriure', 'À écrire', null, null, false),
	('parla.teulas.medias', 'parla', 'bloc', 'parla.teulas', 5, null, null, null, null, true),
	('parla.teulas.medias.ligam', 'parla', 'ligam', 'parla.teulas.medias', 0, 'Mèdias', 'Médias', '/medias', null, true),
	('parla.teulas.medias.sota', 'parla', 'text', 'parla.teulas.medias', 0, 'Las ràdios, las televisions e la premsa.', 'Les radios, les télévisions et la presse.', null, null, true),
	('obras.titol', 'obras', 'text', null, 0, 'Òbras', 'Œuvres', null, null, true),
	('obras.frasa', 'obras', 'text', null, 0, 'Çò qu’escoti, çò que legissi, çò que te fau descobrir en occitan.', 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.', null, null, true),
	('obras.teulas.musica', 'obras', 'bloc', 'obras.teulas', 1, null, null, null, null, true),
	('obras.teulas.musica.ligam', 'obras', 'ligam', 'obras.teulas.musica', 0, 'Musica', 'Musique', '/ensag/musica', null, true),
	('obras.teulas.musica.sota', 'obras', 'text', 'obras.teulas.musica', 0, 'Las cançons en occitan.', 'Les chansons en occitan.', null, null, true),
	('obras.teulas.literatura', 'obras', 'bloc', 'obras.teulas', 2, null, null, null, null, true),
	('obras.teulas.literatura.ligam', 'obras', 'ligam', 'obras.teulas.literatura', 0, 'Literatura', 'Littérature', '/obras/literatura', null, true),
	('obras.teulas.literatura.sota', 'obras', 'text', 'obras.teulas.literatura', 0, 'Los editors en occitan.', 'Les éditeurs en occitan.', null, null, true),
	('obras.teulas.cinema', 'obras', 'bloc', 'obras.teulas', 3, null, null, null, null, true),
	('obras.teulas.cinema.ligam', 'obras', 'ligam', 'obras.teulas.cinema', 0, 'Cinema e video', 'Cinéma et vidéo', '/obras/cinema', null, true),
	('obras.teulas.cinema.sota', 'obras', 'text', 'obras.teulas.cinema', 0, 'Los filmes en occitan.', 'Les films en occitan.', null, null, true),
	('obras.teulas.pintura', 'obras', 'bloc', 'obras.teulas', 4, null, null, null, null, true),
	('obras.teulas.pintura.ligam', 'obras', 'ligam', 'obras.teulas.pintura', 0, 'Pintura e afichas', 'Peinture et affiches', '/obras/afichas', null, true),
	('obras.teulas.pintura.sota', 'obras', 'text', 'obras.teulas.pintura', 0, 'D’afichas que fan parlar la lenga sus las parets.', 'Des affiches qui font parler la langue sur les murs.', null, null, true),
	('obras.teulas.scena', 'obras', 'bloc', 'obras.teulas', 5, null, null, null, null, true),
	('obras.teulas.scena.ligam', 'obras', 'ligam', 'obras.teulas.scena', 0, 'Scèna', 'Scène', '#scena', null, true),
	('obras.teulas.scena.sota', 'obras', 'text', 'obras.teulas.scena', 0, 'Teatre, dança e contes. Lèu.', 'Théâtre, danse et contes. Bientôt.', null, null, true),
	('medias.titol', 'medias', 'text', null, 0, 'Mèdias', 'Médias', null, null, true),
	('medias.frasa', 'medias', 'text', null, 0, 'Las ràdios, las televisions e la premsa en occitan.', 'Les radios, les télévisions et la presse en occitan.', null, null, true),
	('medias.teulas.radios', 'medias', 'bloc', 'medias.teulas', 1, null, null, null, null, true),
	('medias.teulas.radios.ligam', 'medias', 'ligam', 'medias.teulas.radios', 0, 'Ràdios', 'Radios', '/medias/radios', null, true),
	('medias.teulas.radios.sota', 'medias', 'text', 'medias.teulas.radios', 0, 'Set ràdios en occitan, en dirècte.', 'Sept radios en occitan, en direct.', null, null, true),
	('medias.teulas.television', 'medias', 'bloc', 'medias.teulas', 2, null, null, null, null, true),
	('medias.teulas.television.ligam', 'medias', 'ligam', 'medias.teulas.television', 0, 'Television e video', 'Télévision et vidéo', '/medias/television', null, true),
	('medias.teulas.television.sota', 'medias', 'text', 'medias.teulas.television', 0, 'Las cadenas, las emissions e las videos.', 'Les chaînes, les émissions et les vidéos.', null, null, true),
	('medias.teulas.premsa', 'medias', 'bloc', 'medias.teulas', 3, null, null, null, null, true),
	('medias.teulas.premsa.ligam', 'medias', 'ligam', 'medias.teulas.premsa', 0, 'Premsa', 'Presse', '/medias/premsa', null, true),
	('medias.teulas.premsa.sota', 'medias', 'text', 'medias.teulas.premsa', 0, 'Los jornals e las revistas.', 'Les journaux et les revues.', null, null, true),
	('apren.titol', 'apren', 'text', null, 0, 'S’apren', 'S’apprend', null, null, true),
	('apren.frasa', 'apren', 'text', null, 0, 'A escriure : ta frasa sus S’apren', 'À écrire : ta phrase sur S’apprend', null, null, false),
	('apren.teulas.visio', 'apren', 'bloc', 'apren.teulas', 1, null, null, null, null, true),
	('apren.teulas.visio.ligam', 'apren', 'ligam', 'apren.teulas.visio', 0, 'Corses en visio', 'Cours en visio', '/apren/visio', null, true),
	('apren.teulas.visio.sota', 'apren', 'text', 'apren.teulas.visio', 0, 'Sol a sol. Lo primièr es ofèrt.', 'En tête-à-tête. Le premier est offert.', null, null, true),
	('apren.teulas.parcors', 'apren', 'bloc', 'apren.teulas', 2, null, null, null, null, true),
	('apren.teulas.parcors.ligam', 'apren', 'ligam', 'apren.teulas.parcors', 0, 'Lo parcors', 'Le parcours', '/aprene', null, true),
	('apren.teulas.parcors.sota', 'apren', 'text', 'apren.teulas.parcors', 0, 'De zèro fins al nivèl B1, leiçon per leiçon.', 'De zéro jusqu’au niveau B1, leçon par leçon.', null, null, true),
	('apren.teulas.ensag', 'apren', 'bloc', 'apren.teulas', 3, null, null, null, null, true),
	('apren.teulas.ensag.ligam', 'apren', 'ligam', 'apren.teulas.ensag', 0, 'Leiçon d’ensag', 'Leçon d’essai', '/aprene/essai', null, true),
	('apren.teulas.ensag.sota', 'apren', 'text', 'apren.teulas.ensag', 0, 'A escriure', 'À écrire', null, null, false),
	('apren.teulas.mots', 'apren', 'bloc', 'apren.teulas', 4, null, null, null, null, true),
	('apren.teulas.mots.ligam', 'apren', 'ligam', 'apren.teulas.mots', 0, 'Mots en imatges', 'Mots en images', '/mots', null, true),
	('apren.teulas.mots.sota', 'apren', 'text', 'apren.teulas.mots', 0, 'A escriure', 'À écrire', null, null, false),
	('apren.teulas.progression', 'apren', 'bloc', 'apren.teulas', 5, null, null, null, null, true),
	('apren.teulas.progression.ligam', 'apren', 'ligam', 'apren.teulas.progression', 0, 'Ma progression', 'Ma progression', '/compte', null, true),
	('apren.teulas.progression.sota', 'apren', 'text', 'apren.teulas.progression', 0, 'A escriure', 'À écrire', null, null, false),
	('visio.titol', 'visio', 'text', null, 0, 'Corses en visio', 'Cours en visio', null, null, true),
	('visio.chapeu', 'visio', 'text', null, 0, 'De corses en dirècte, sol a sol. Lo primièr es ofèrt.', 'Des cours en direct, en tête-à-tête. Le premier est offert.', null, null, true),
	('visio.reservar', 'visio', 'ligam', null, 0, 'Reservar un primièr cors', 'Réserver un premier cours', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('visio.qual.titol', 'visio', 'text', null, 0, 'Per qual ?', 'Pour qui ?', null, null, true),
	('visio.qual.tèxt', 'visio', 'text', null, 0, 'Per las debutantas e los debutants de tot país : una primièra descobèrta de l’occitan.', 'Pour les débutant·es de tout pays : une première découverte de l’occitan.', null, null, true),
	('visio.metòde.titol', 'visio', 'text', null, 0, 'La metòde', 'La méthode', null, null, true),
	('visio.metòde.tèxt', 'visio', 'text', null, 0, 'Ma metòde, es subretot un ecosistèma : tot çò qu’ai creat a l’entorn del Ligam, los jòcs, lo parcors coma dins una aplicacion de lengas, e los corses en visio que lo completan. Un biais simple, per aprene dins de bonas condicions.

Soi ieu tanben aprenent, e o disi clar : me presenti pas coma un expèrt. Ai après, la lenga m’a impregnat, e sèm dins la meteissa barca. Çò que vòli subretot : que l’experiéncia siá agradiva.', 'Ma méthode, c’est surtout un écosystème : tout ce que j’ai créé autour du Ligam, les jeux, le parcours comme dans une application de langues, et les cours en visio qui le complètent. Une approche simple, pour apprendre dans de bonnes conditions.

Je suis moi-même apprenant, et je le dis clairement : je ne me présente pas comme un expert. J’ai appris, la langue m’a imprégné, et nous sommes dans le même bateau. Ce que je veux surtout : que l’expérience soit agréable.', null, null, true),
	('visio.debana.titol', 'visio', 'text', null, 0, 'Cossí se debana un cors ?', 'Comment se passe un cours ?', null, null, true),
	('visio.debana.e1', 'visio', 'text', 'visio.debana', 1, 'Per començar doçament, dètz minutas : parlam de ta setmana. O, se t’agrada mai, començam tot dreit per una lectura.', 'Pour commencer en douceur, dix minutes : on parle de ta semaine. Ou, si tu préfères, on commence tout de suite par une lecture.', null, null, true),
	('visio.debana.e2', 'visio', 'text', 'visio.debana', 2, 'Un retorn sus la prononciacion e los mots novèls.', 'Un retour sur la prononciation et les mots nouveaux.', null, null, true),
	('visio.debana.e3', 'visio', 'text', 'visio.debana', 3, 'Un punt de gramatica, una règla o un fach curiós sus l’occitan.', 'Un point de grammaire, une règle ou un fait curieux sur l’occitan.', null, null, true),
	('visio.practica.titol', 'visio', 'text', null, 0, 'En practica', 'En pratique', null, null, true),
	('visio.practica.lengas', 'visio', 'text', 'visio.practica', 1, 'Dempuèi lo francés, l’anglés, lo castelhan o lo catalan.', 'Depuis le français, l’anglais, le castillan ou le catalan.', null, null, true),
	('visio.practica.persona', 'visio', 'text', 'visio.practica', 2, 'En persona tanben, se sèm dins la meteissa vila : ara, soi a Lion.', 'En personne aussi, si nous sommes dans la même ville : en ce moment, je suis à Lyon.', null, null, true),
	('visio.practica.durada', 'visio', 'text', 'visio.practica', 3, 'Una ora, pas mai.', 'Une heure, pas plus.', null, null, true),
	('visio.practica.pretz', 'visio', 'text', 'visio.practica', 4, 'Lo primièr cors es gratuit ; un don es possible.', 'Le premier cours est gratuit ; un don est possible.', null, null, true),
	('visio.debana.e4', 'visio', 'text', 'visio.debana', 4, 'Un moment d’escritura : redigisses, per t’entrainar.', 'Un moment d’écriture : tu rédiges, pour t’entraîner.', null, null, true),
	('visio.debana.e5', 'visio', 'text', 'visio.debana', 5, 'Per acabar, una obertura : una cançon, quicòm d’agradiu.', 'Pour finir, une ouverture : une chanson, quelque chose d’agréable.', null, null, true),
	('visio.debana.nota', 'visio', 'text', null, 0, 'Fòrça dialòg : al començament mesclam ta lenga e l’occitan, puèi l’occitan ven de mai en mai natural.', 'Beaucoup de dialogue : au début on mélange ta langue et l’occitan, puis l’occitan devient de plus en plus naturel.', null, null, true),
	('visio.practica.formulas', 'visio', 'text', 'visio.practica', 5, 'Puèi, de 15 a 30 € lo cors, segon lo prètz que causisses.', 'Ensuite, de 15 à 30 € le cours, selon le tarif que tu choisis.', null, null, true),
	('visio.pretz.titol', 'visio', 'text', null, 0, 'Los prètz', 'Les prix', null, null, true),
	('visio.pretz.intro', 'visio', 'text', null, 0, 'Lo primièr cors es gratuit. Puèi, causisses ton prètz en consciéncia, sens cap de justificatiu : lo prètz engatjat finança lo prètz solidari.', 'Le premier cours est gratuit. Ensuite, tu choisis ton tarif en conscience, sans aucun justificatif : le tarif engagé finance le tarif solidaire.', null, null, true),
	('visio.pretz.un', 'visio', 'text', null, 0, 'Lo cors d’una ora', 'Le cours d’une heure', null, null, true),
	('visio.pretz.mes', 'visio', 'text', null, 0, '4 corses, en dos meses', '4 cours, sur deux mois', null, null, true),
	('visio.pretz.trimestre', 'visio', 'text', null, 0, '12 corses, en cinc meses', '12 cours, sur cinq mois', null, null, true),
	('visio.pretz.tarifs.t1', 'visio', 'bloc', 'visio.pretz.tarifs', 1, null, null, null, null, true),
	('visio.pretz.tarifs.t1.nom', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, 'Solidari', 'Solidaire', null, null, true),
	('visio.pretz.tarifs.t1.un', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '15 €', '15 €', null, null, true),
	('visio.pretz.tarifs.t1.mes', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '55 €', '55 €', null, null, true),
	('visio.pretz.tarifs.t1.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '155 €', '155 €', null, null, true),
	('visio.pretz.tarifs.t2', 'visio', 'bloc', 'visio.pretz.tarifs', 2, null, null, null, null, true),
	('visio.pretz.tarifs.t2.nom', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, 'Classic', 'Classique', null, null, true),
	('visio.pretz.tarifs.t2.un', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '22 €', '22 €', null, null, true),
	('visio.pretz.tarifs.t2.mes', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '80 €', '80 €', null, null, true),
	('visio.pretz.tarifs.t2.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '225 €', '225 €', null, null, true),
	('visio.pretz.tarifs.t3', 'visio', 'bloc', 'visio.pretz.tarifs', 3, null, null, null, null, true),
	('visio.pretz.tarifs.t3.nom', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, 'Engatjat', 'Engagé', null, null, true),
	('visio.pretz.tarifs.t3.un', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '30 €', '30 €', null, null, true),
	('visio.pretz.tarifs.t3.mes', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '110 €', '110 €', null, null, true),
	('visio.pretz.tarifs.t3.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '305 €', '305 €', null, null, true),
	('visio.q.titol', 'visio', 'text', null, 0, 'Abans lo primièr cors', 'Avant le premier cours', null, null, true),
	('visio.q.intro', 'visio', 'text', null, 0, 'Qualques questions per preparar ton cors. Après, causisses ton ora dins mon calendièr.', 'Quelques questions pour préparer ton cours. Ensuite, tu choisis ton heure dans mon calendrier.', null, null, true),
	('visio.q.nom', 'visio', 'text', null, 0, 'Ton prenom', 'Ton prénom', null, null, true),
	('visio.q.corrièl', 'visio', 'text', null, 0, 'Ton corrièl', 'Ton adresse électronique', null, null, true),
	('visio.q.nivèl.titol', 'visio', 'text', null, 0, 'Ton nivèl en occitan', 'Ton niveau en occitan', null, null, true),
	('visio.q.nivèls.n1', 'visio', 'text', 'visio.q.nivèls', 1, 'Ai pas jamai après l’occitan', 'Je n’ai jamais appris l’occitan', null, null, true),
	('visio.q.nivèls.n2', 'visio', 'text', 'visio.q.nivèls', 2, 'Ne sabi qualques mots', 'J’en connais quelques mots', null, null, true),
	('visio.q.nivèls.n3', 'visio', 'text', 'visio.q.nivèls', 3, 'Comprene, mas parli pauc', 'Je comprends, mais je parle peu', null, null, true),
	('visio.q.nivèls.n4', 'visio', 'text', 'visio.q.nivèls', 4, 'Parli ja, vòli anar mai luènh', 'Je parle déjà, je veux aller plus loin', null, null, true),
	('visio.q.motivacion.titol', 'visio', 'text', null, 0, 'Çò que te mena a l’occitan', 'Ce qui t’amène à l’occitan', null, null, true),
	('visio.q.motivacions.m1', 'visio', 'text', 'visio.q.motivacions', 1, 'Las raices de ma familha', 'Les racines de ma famille', null, null, true),
	('visio.q.motivacions.m2', 'visio', 'text', 'visio.q.motivacions', 2, 'Visi en país occitan', 'Je vis en pays occitan', null, null, true),
	('visio.q.motivacions.m3', 'visio', 'text', 'visio.q.motivacions', 3, 'La musica, los libres, la cultura', 'La musique, les livres, la culture', null, null, true),
	('visio.q.motivacions.m4', 'visio', 'text', 'visio.q.motivacions', 4, 'Mos dròlles aprenon l’occitan', 'Mes enfants apprennent l’occitan', null, null, true),
	('visio.q.motivacions.m5', 'visio', 'text', 'visio.q.motivacions', 5, 'Lo trabalh o los estudis', 'Le travail ou les études', null, null, true),
	('visio.q.motivacions.m6', 'visio', 'text', 'visio.q.motivacions', 6, 'La curiositat', 'La curiosité', null, null, true),
	('visio.q.lenga.titol', 'visio', 'text', null, 0, 'Las lengas que parlas', 'Les langues que tu parles', null, null, true),
	('visio.q.lengas.l1', 'visio', 'text', 'visio.q.lengas', 1, 'Français', 'Français', null, null, true),
	('visio.q.lengas.l2', 'visio', 'text', 'visio.q.lengas', 2, 'English', 'English', null, null, true),
	('visio.q.lengas.l3', 'visio', 'text', 'visio.q.lengas', 3, 'Castellano', 'Castellano', null, null, true),
	('visio.q.lengas.l4', 'visio', 'text', 'visio.q.lengas', 4, 'Català', 'Català', null, null, true),
	('visio.q.lengas.l5', 'visio', 'text', 'visio.q.lengas', 5, 'Una autra lenga', 'Une autre langue', null, null, true),
	('visio.q.luòc.titol', 'visio', 'text', null, 0, 'Ont te tròbas ?', 'Où te trouves-tu ?', null, null, true),
	('visio.q.luòc.exemple', 'visio', 'text', null, 0, 'Vila, país', 'Ville, pays', null, null, true),
	('visio.q.ritme.titol', 'visio', 'text', null, 0, 'Çò que cercas', 'Ce que tu cherches', null, null, true),
	('visio.q.ritmes.r1', 'visio', 'text', 'visio.q.ritmes', 1, 'Un cors d’ensag, per veire', 'Un cours d’essai, pour voir', null, null, true),
	('visio.q.ritmes.r2', 'visio', 'text', 'visio.q.ritmes', 2, 'Un cors per setmana', 'Un cours par semaine', null, null, true),
	('visio.q.ritmes.r3', 'visio', 'text', 'visio.q.ritmes', 3, 'Mai d’un cors per setmana', 'Plus d’un cours par semaine', null, null, true),
	('visio.q.axe.titol', 'visio', 'text', null, 0, 'Çò que t’agradariá mai', 'Ce qui te plairait le plus', null, null, true),
	('visio.q.axes.a1', 'visio', 'text', 'visio.q.axes', 1, 'Parlar', 'Parler', null, null, true),
	('visio.q.axes.a2', 'visio', 'text', 'visio.q.axes', 2, 'La gramatica', 'La grammaire', null, null, true),
	('visio.q.axes.a3', 'visio', 'text', 'visio.q.axes', 3, 'La cultura', 'La culture', null, null, true),
	('visio.q.axes.a4', 'visio', 'text', 'visio.q.axes', 4, 'Legir e escriure', 'Lire et écrire', null, null, true),
	('visio.q.messatge', 'visio', 'text', null, 0, 'Quicòm mai de me dire ?', 'Autre chose à me dire ?', null, null, true),
	('visio.q.mandar', 'visio', 'text', null, 0, 'Mandar e causir una ora', 'Envoyer et choisir une heure', null, null, true),
	('visio.q.mercé', 'visio', 'text', null, 0, 'Mercé ! Ai recebut tas responsas. Ara, causís ton ora :', 'Merci ! J’ai bien reçu tes réponses. Maintenant, choisis ton heure :', null, null, true),
	('visio.q.sens', 'visio', 'text', null, 0, 'Causir una ora sens respondre', 'Choisir une heure sans répondre', null, null, true),
	('visio.q.avís', 'visio', 'text', null, 0, 'Tas responsas me son mandadas per corrièl, per preparar lo cors. Lo site ne garda pas cap de còpia.', 'Tes réponses me sont envoyées par courriel, pour préparer le cours. Le site n’en garde aucune copie.', null, null, true),
	('istoria.kicker', 'istoria', 'text', null, 0, 'Lo Ligam', 'Lo Ligam', null, null, true),
	('istoria.titol', 'istoria', 'text', null, 0, 'Mon ligam amb l’occitan', 'Mon lien avec l’occitan', null, null, true),
	('istoria.chapèu', 'istoria', 'text', null, 0, '', 'Je m''appelle Romain Périer. Je suis né à Montpellier en 1994, d''un père né à Paris et d''une mère née à Clermont-l''Hérault.', null, null, true),
	('istoria.retrat', 'istoria', 'imatge', null, 0, null, null, null, '{"url":"/acuelh/romain.webp","largor":600,"nautor":620,"alt_oc":"","alt_fr":""}'::jsonb, true),
	('istoria.capitols.c1', 'istoria', 'bloc', 'istoria.capitols', 1, null, null, null, null, true),
	('istoria.capitols.c1.titol', 'istoria', 'text', 'istoria.capitols.c1', 0, '', 'Une langue sans nom', null, null, true),
	('istoria.capitols.c1.tèxt', 'istoria', 'text', 'istoria.capitols.c1', 0, '', 'J''ai grandi dans un environnement francophone, sans conscience de la langue pendant très longtemps. Il y a toujours eu des mots que je ne comprenais pas du côté de ma mère. Aux réunions de famille, avec mes grands-parents, mes oncles, mes cousins, il y avait toujours cette part de vocabulaire que je ne comprenais pas, et qui n''était pas nommée. J''entendais le mot « patois », mais sans aucun lien avec une langue.', null, null, true),
	('istoria.capitols.c2', 'istoria', 'bloc', 'istoria.capitols', 2, null, null, null, null, true),
	('istoria.capitols.c2.titol', 'istoria', 'text', 'istoria.capitols.c2', 0, '', 'Montpellier, une ville « sans histoire » ?', null, null, true),
	('istoria.capitols.c2.tèxt', 'istoria', 'text', 'istoria.capitols.c2', 0, '', 'J''ai grandi avec un profond attachement à ma région et à ma ville, Montpellier. Je me suis passionné pour son histoire, et je me suis toujours étonné quand les gens disaient qu''il n''y avait pas d''histoire ici. Moi-même, j''ai pu le croire : l''accent s''est un peu perdu, il n''y a pas de communauté très marquée tant la ville s''est agrandie (ce qui est une bonne chose). Mais il y a aussi eu un processus de standardisation qui a fait que les traces historiques et l''identité montpelliéraine se sont effacées.', null, null, true),
	('istoria.capitols.c3', 'istoria', 'bloc', 'istoria.capitols', 3, null, null, null, null, true),
	('istoria.capitols.c3.titol', 'istoria', 'text', 'istoria.capitols.c3', 0, '', 'Le déclic : Valence, 2015', null, null, true),
	('istoria.capitols.c3.tèxt', 'istoria', 'text', 'istoria.capitols.c3', 0, '', 'C''est en allant vivre en Espagne, à Valence, en 2015 pour un Erasmus, que j''ai découvert la langue valencienne. Elle a un autre statut que l''occitan en France : on la voit partout dans l''espace public, on entend beaucoup de gens la parler. En me rapprochant d''un groupe qui parlait valencien, j''ai pris conscience de l''enjeu linguistique et du débat qui l''entoure, encore plus fort en Catalogne qu''à Valence. J''ai compris que cette langue ressemblait à la mienne, et j''ai vécu la situation d''une langue minorisée.', null, null, true),
	('istoria.capitols.c4', 'istoria', 'bloc', 'istoria.capitols', 4, null, null, null, null, true),
	('istoria.capitols.c4.titol', 'istoria', 'text', 'istoria.capitols.c4', 0, '', 'Le retour : la richesse sous mes pieds', null, null, true),
	('istoria.capitols.c4.tèxt', 'istoria', 'text', 'istoria.capitols.c4', 0, '', 'C''est en rentrant en France que je me suis passionné pour l''occitan, et que j''ai pris conscience de la richesse qui était sous mes pieds et que je ne voyais pas. De là a commencé tout un parcours de réappropriation de la langue.', null, null, true),
	('istoria.capitols.c5', 'istoria', 'bloc', 'istoria.capitols', 5, null, null, null, null, true),
	('istoria.capitols.c5.titol', 'istoria', 'text', 'istoria.capitols.c5', 0, '', 'Apprendre seul', null, null, true),
	('istoria.capitols.c5.tèxt', 'istoria', 'text', 'istoria.capitols.c5', 0, '', 'Au début, je ne savais pas par où commencer : il n''y a pas de guide officiel, l''information est disparate. J''ai fait mon petit chemin en commençant par le livre Assimil, un livre super, mais où je me suis beaucoup perdu : tant d''exceptions, une langue qui semblait si compliquée que j''ai presque abandonné. Finalement, j''ai tenu. Au fur et à mesure, j''ai commencé à pouvoir m''exprimer en occitan et à rencontrer du monde dans cette langue.', null, null, true),
	('istoria.capitols.c6', 'istoria', 'bloc', 'istoria.capitols', 6, null, null, null, null, true),
	('istoria.capitols.c6.titol', 'istoria', 'text', 'istoria.capitols.c6', 0, '', 'Retrouver les mots de la famille', null, null, true),
	('istoria.capitols.c6.tèxt', 'istoria', 'text', 'istoria.capitols.c6', 0, '', 'J''ai pu reposer des questions à ma famille sur les mots en occitan, commencer à les recueillir, faire des liens, et comprendre que des mots que j''utilisais déjà tous les jours étaient de l''occitan.

J''ai été heureux de pouvoir me reconnecter avec mon papy autour de l''occitan. Lui-même avait du mal à l''appeler « occitan ». Il était un peu interloqué au début, quand je m''y suis intéressé, et il avait un peu honte : il disait qu''il ne parlait pas le vrai occitan, que c''était du patois. Mais au bout d''un moment, je sentais qu''il se décoinçait, qu''il commençait à dire des phrases, à nous raconter de nouveau des histoires en occitan. Je suis très heureux d''avoir pu échanger avec lui sur tout ça jusqu''à la fin de sa vie. Il nous a quittés en 2023.', null, null, true),
	('istoria.espelida.titol', 'istoria', 'text', null, 0, 'L’espelida del Ligam', 'La naissance du Ligam', null, null, true),
	('istoria.espelida.c1', 'istoria', 'bloc', 'istoria.espelida', 1, null, null, null, null, true),
	('istoria.espelida.c1.titol', 'istoria', 'text', 'istoria.espelida.c1', 0, '', 'Naissance du Ligam (2022)', null, null, true),
	('istoria.espelida.c1.tèxt', 'istoria', 'text', 'istoria.espelida.c1', 0, '', 'En 2022, je me suis lancé, sans trop savoir pourquoi, dans un compte Instagram. J''ai saisi l''occasion d''un traducteur automatique, Revirada, qui venait d''être publié avec un générateur de voix, Vòtz. Ça m''a donné envie de publier de jolies illustrations avec des mots simples : le ciel, la montagne, les oiseaux.

Au début, je mettais la voix automatique, parce que je n''osais pas parler. Puis, au fur et à mesure, j''ai pris le coup : des publications sur différentes thématiques, des animations de plus en plus travaillées, avec Canva comme outil principal. Ça a intéressé quelques personnes au début, et je ne m''attendais pas à ce que ça marche aussi bien. Ça m''a encouragé à continuer.

L''idée, c''est d''apprendre en même temps que je partage. Je ne me présente pas comme un guide suprême ou un maître de la langue, mais comme un apprenti qui n''a pas peur de faire des erreurs et qui essaie d''apprendre au mieux une langue qu''il adore. Tout ça a mené à une communauté de plusieurs milliers de personnes.', null, null, true),
	('istoria.espelida.c2', 'istoria', 'bloc', 'istoria.espelida', 2, null, null, null, null, true),
	('istoria.espelida.c2.titol', 'istoria', 'text', 'istoria.espelida.c2', 0, '', 'Aujourd''hui', null, null, true),
	('istoria.espelida.c2.tèxt', 'istoria', 'text', 'istoria.espelida.c2', 0, '', 'Aujourd''hui, j''ai envie de passer à un stade supérieur : enseigner vraiment ce que j''ai appris, partager ma vision de la réalité occitane en France aujourd''hui, dans sa complexité, et surtout créer un espace d''échange.', null, null, true),
	('istoria.contacte.titol', 'istoria', 'text', null, 0, 'Escambiem', 'Échangeons', null, null, true),
	('istoria.contacte.tèxt', 'istoria', 'text', null, 0, 'Una question, un cors, una idèa ? Escriu-me, te respondrai.', 'Une question, un cours, une idée ? Écris-moi, je te répondrai.', null, null, true),
	('istoria.contacte.reservar', 'istoria', 'ligam', null, 0, 'Reservar un cors en visio', 'Réserver un cours en visio', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('amassa.titol', 'amassa', 'text', null, 0, 'Amassa', 'Rassemble', null, null, true),
	('amassa.frasa', 'amassa', 'text', null, 0, 'A escriure : ta frasa sus Amassa', 'À écrire : ta phrase sur Rassemble', null, null, false),
	('amassa.teulas.grops', 'amassa', 'bloc', 'amassa.teulas', 1, null, null, null, null, true),
	('amassa.teulas.grops.ligam', 'amassa', 'ligam', 'amassa.teulas.grops', 0, 'Grops', 'Groupes', '/grops', null, true),
	('amassa.teulas.grops.sota', 'amassa', 'text', 'amassa.teulas.grops', 0, 'Rencontrar d’autras personas que parlan occitan, prèp de tu o en linha.', 'Rencontrer d’autres personnes qui parlent occitan, près de chez toi ou en ligne.', null, null, true),
	('amassa.teulas.cercles', 'amassa', 'bloc', 'amassa.teulas', 2, null, null, null, null, true),
	('amassa.teulas.cercles.ligam', 'amassa', 'ligam', 'amassa.teulas.cercles', 0, 'Cercles e associacions', 'Cercles et associations', '/carta', null, true),
	('amassa.teulas.cercles.sota', 'amassa', 'text', 'amassa.teulas.cercles', 0, 'Las associacions occitanas, sus la carta.', 'Les associations occitanes, sur la carte.', null, null, true),
	('amassa.teulas.forum', 'amassa', 'bloc', 'amassa.teulas', 3, null, null, null, null, true),
	('amassa.teulas.forum.ligam', 'amassa', 'ligam', 'amassa.teulas.forum', 0, 'Fòrum', 'Forum', '/forum', null, true),
	('amassa.teulas.forum.sota', 'amassa', 'text', 'amassa.teulas.forum', 0, 'S’ajudar per aprene.', 'S’entraider pour apprendre.', null, null, true),
	('amassa.teulas.ideas', 'amassa', 'bloc', 'amassa.teulas', 4, null, null, null, null, true),
	('amassa.teulas.ideas.ligam', 'amassa', 'ligam', 'amassa.teulas.ideas', 0, 'Boita d’idèas', 'Boîte à idées', '/ideas', null, true),
	('amassa.teulas.ideas.sota', 'amassa', 'text', 'amassa.teulas.ideas', 0, 'Per melhorar Lo Ligam amb tu.', 'Pour améliorer Lo Ligam avec toi.', null, null, true),
	('amassa.teulas.instagram', 'amassa', 'bloc', 'amassa.teulas', 5, null, null, null, null, true),
	('amassa.teulas.instagram.ligam', 'amassa', 'ligam', 'amassa.teulas.instagram', 0, 'Instagram', 'Instagram', 'https://www.instagram.com/lo_ligam/', null, true),
	('amassa.teulas.instagram.sota', 'amassa', 'text', 'amassa.teulas.instagram', 0, 'Los visuals de Lo Ligam.', 'Les visuels de Lo Ligam.', null, null, true),
	('ideas.titol', 'ideas', 'text', null, 0, 'Boita d’idèas', 'Boîte à idées', null, null, true),
	('ideas.frasa', 'ideas', 'text', null, 0, 'Una idèa per melhorar Lo Ligam ? Escriu-la aquí : las legissi totas.', 'Une idée pour améliorer Lo Ligam ? Écris-la ici : je les lis toutes.', null, null, true),
	('ideas.compte', 'ideas', 'text', null, 0, 'Per mandar una idèa, cal un compte : es gratuit.', 'Pour envoyer une idée, il faut un compte : c’est gratuit.', null, null, true),
	('ideas.mercé', 'ideas', 'text', null, 0, 'Mercé ! Ton idèa es plan arribada.', 'Merci ! Ton idée est bien arrivée.', null, null, true),
	('ideas.avís', 'ideas', 'text', null, 0, 'Soi lo sol a legir las idèas, sens saber qual las manda. Las pòdes suprimir quand vòles.', 'Je suis seul à lire les idées, sans savoir qui les envoie. Tu peux les supprimer quand tu veux.', null, null, true),
	('grops.acuelh', 'grops', 'text', null, 0, 'Aquí parlam occitan coma podèm, amb las fautas. Totas las lengas son benvengudas : çò que compta, es l’escambi.', 'Ici on parle occitan comme on peut, avec les fautes. Toutes les langues sont bienvenues : ce qui compte, c’est l’échange.', null, null, true),
	('grops.compte', 'grops', 'text', null, 0, 'Per rejónher un grop, cal un compte amb una adreça verificada : es gratuit.', 'Pour rejoindre un groupe, il faut un compte avec une adresse vérifiée : c’est gratuit.', null, null, true),
	('grops.pseudo', 'grops', 'text', null, 0, 'Los autres membres veson ton pseudonim, pas jamai ton adreça.', 'Les autres membres voient ton pseudo, jamais ton adresse.', null, null, true),
	('grops.lèu', 'grops', 'text', null, 0, 'Los grops dobriràn lèu. Un pauc de paciéncia !', 'Les groupes ouvriront bientôt. Un peu de patience !', null, null, true)
on conflict (clau, estat) do nothing;
