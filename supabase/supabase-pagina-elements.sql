-- Lo Ligam — édition sur place : les éléments modifiables des pages
-- =============================================================================
-- Fabriqué par app/scripts/elements-sql.mjs le 2026-11-05 ; ne pas modifier à la main.
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
	-- langues du globe (es/en/ca, 2026-10-25) ; l'occitan reste le repli
	es text,
	en text,
	ca text,
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

-- Base déjà installée : le « create table if not exists » ci-dessus ne lui
-- ajoute pas les colonnes es/en/ca. On les ajoute donc explicitement (sans
-- risque si elles existent déjà).
alter table public.pagina_elements add column if not exists es text;
alter table public.pagina_elements add column if not exists en text;
alter table public.pagina_elements add column if not exists ca text;

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
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, es, en, ca, ligam, imatge, estil, moviment, visible, suprimit)
	select clau, 'publicat', pagina, tipe, lista, ordre, oc, fr, es, en, ca, ligam, imatge, estil, moviment, visible, false
	from public.pagina_elements where pagina = p_pagina and estat = 'brolhon' and not suprimit
	on conflict (clau, estat) do update set
		tipe = excluded.tipe, lista = excluded.lista, ordre = excluded.ordre, oc = excluded.oc, fr = excluded.fr,
		es = excluded.es, en = excluded.en, ca = excluded.ca,
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
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, es, en, ca, ligam, imatge, estil, moviment, visible, suprimit)
	select e.clau, 'brolhon', e.pagina, e.tipe, e.lista, e.ordre, e.oc, e.fr, e.es, e.en, e.ca, e.ligam, e.imatge, e.estil, e.moviment, e.visible, true
	from public.pagina_elements e
	where e.pagina = pub.pagina and e.estat = 'publicat'
		and not exists (select 1 from jsonb_array_elements(pub.fotografia) f where f->>'clau' = e.clau);
	insert into public.pagina_elements (clau, estat, pagina, tipe, lista, ordre, oc, fr, es, en, ca, ligam, imatge, estil, moviment, visible, suprimit)
	select f->>'clau', 'brolhon', pub.pagina, f->>'tipe', f->>'lista', coalesce((f->>'ordre')::int, 0), f->>'oc', f->>'fr', f->>'es', f->>'en', f->>'ca', f->>'ligam',
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
-- (296 lignes). Jamais écrasés s'ils existent déjà.
insert into public.pagina_elements (clau, pagina, tipe, lista, ordre, oc, fr, es, en, ca, ligam, imatge, visible) values
	('acuelh.eros.kicker', 'acuelh', 'text', null, 0, 'L’occitan', 'L’occitan', 'El occitano', 'Occitan', 'L’occità', null, null, true),
	('acuelh.eros.titol.1', 'acuelh', 'text', null, 0, 'Se parla.', 'Se parle.', 'Se habla.', 'Speak.', 'Es parla.', null, null, true),
	('acuelh.eros.titol.2', 'acuelh', 'text', null, 0, 'S’apren.', 'S’apprend.', 'Se aprende.', 'Learn.', 'S’aprèn.', null, null, true),
	('acuelh.eros.titol.3', 'acuelh', 'text', null, 0, 'Amassa.', 'Rassemble.', 'Reúne.', 'Gather.', 'Reuneix.', null, null, true),
	('acuelh.eros.frasa', 'acuelh', 'text', null, 0, 'Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.', 'Bienvenue dans ton lien avec le monde occitan. D’où que tu sois, tu es ici chez toi.', 'Te damos la bienvenida a tu vínculo con el mundo occitano. Vengas de donde vengas, aquí estás en tu casa.', 'Welcome to your connection with the Occitan world. Wherever you come from, you’re at home here.', 'Et donem la benvinguda al teu vincle amb el món occità. Vinguis d’on vinguis, aquí ets a casa.', null, null, true),
	('acuelh.eros.indici', 'acuelh', 'text', null, 0, 'Passa la mirga suls tres mots.', 'Survole les trois mots.', 'Pasa el ratón por las tres palabras.', 'Hover over the three words.', 'Passa el ratolí per sobre de les tres paraules.', null, null, true),
	('acuelh.mondes.parla.sota', 'acuelh', 'text', null, 0, 'Descobrís la geografia occitana e las produccions en lenga nòstra.', 'Découvre la géographie occitane et les productions en lenga nòstra.', 'Descubre la geografía occitana y las producciones en lenga nòstra.', 'Discover Occitan geography and works created in lenga nòstra.', 'Descobreix la geografia occitana i les produccions en lenga nòstra.', null, null, true),
	('acuelh.mondes.apren.sota', 'acuelh', 'text', null, 0, 'Descobrís, apren e practica la lenga a ta manièra.', 'Découvre, apprends et pratique la langue à ta manière.', 'Descubre, aprende y practica la lengua a tu manera.', 'Discover, learn and practise the language your way.', 'Descobreix, aprèn i practica la llengua a la teva manera.', null, null, true),
	('acuelh.mondes.viu.sota', 'acuelh', 'text', null, 0, 'Crèa ligam amb lo mond occitan.', 'Crée du lien avec le monde occitan.', 'Crea vínculos con el mundo occitano.', 'Create connections with the Occitan world.', 'Crea vincles amb el món occità.', null, null, true),
	('acuelh.eros.carta', 'acuelh', 'ligam', null, 0, 'Dobrir la carta', 'Ouvrir la carte', 'Abrir el mapa', 'Open the map', 'Obrir el mapa', '/carta', null, true),
	('acuelh.eros.aprene', 'acuelh', 'ligam', null, 0, 'Aprene l’occitan', 'Apprendre l’occitan', 'Aprender occitano', 'Learn Occitan', 'Aprendre occità', '#biais', null, true),
	('acuelh.bandel.m01', 'acuelh', 'text', 'acuelh.bandel', 1, 'lo risolet', 'le sourire', 'la sonrisa', 'the smile', 'el somriure', null, null, true),
	('acuelh.bandel.m02', 'acuelh', 'text', 'acuelh.bandel', 2, 'la rispa', 'la bise', 'el cierzo', 'the north wind', 'la bisa', null, null, true),
	('acuelh.bandel.m03', 'acuelh', 'text', 'acuelh.bandel', 3, 'la rogeiròla', 'le ciel rouge du crépuscule', 'el cielo rojo del atardecer', 'the red sky at dusk', 'el cel roig del capvespre', null, null, true),
	('acuelh.bandel.m04', 'acuelh', 'text', 'acuelh.bandel', 4, 'la roèla', 'le coquelicot', 'la amapola', 'the poppy', 'la rosella', null, null, true),
	('acuelh.bandel.m05', 'acuelh', 'text', 'acuelh.bandel', 5, 'la romieva', 'l’oie sauvage', 'el ganso salvaje', 'the wild goose', 'l’oca salvatge', null, null, true),
	('acuelh.bandel.m06', 'acuelh', 'text', 'acuelh.bandel', 6, 'lo rodaire', 'l’errant', 'el errante', 'the wanderer', 'l’errant', null, null, true),
	('acuelh.bandel.m07', 'acuelh', 'text', 'acuelh.bandel', 7, 'lo lindau', 'le seuil', 'el umbral', 'the threshold', 'el llindar', null, null, true),
	('acuelh.bandel.m08', 'acuelh', 'text', 'acuelh.bandel', 8, 'l’abelhòla', 'le guêpier', 'el abejaruco', 'the bee-eater', 'l’abellerol', null, null, true),
	('acuelh.bandel.m09', 'acuelh', 'text', 'acuelh.bandel', 9, 'l’abitarèla', 'le refuge', 'el refugio', 'the refuge', 'el refugi', null, null, true),
	('acuelh.bandel.m10', 'acuelh', 'text', 'acuelh.bandel', 10, 'abelugat', 'étincelant', 'centelleante', 'sparkling', 'espurnejant', null, null, true),
	('acuelh.bandel.m11', 'acuelh', 'text', 'acuelh.bandel', 11, 'a l’embrunit', 'à la tombée de la nuit', 'al anochecer', 'at nightfall', 'en fer-se de nit', null, null, true),
	('acuelh.bandel.font', 'acuelh', 'text', null, 0, 'Mots del _Lexic de Max Roqueta_, establit per Joan-Guilhèm Roqueta', 'Mots du _Lexique de Max Rouquette_, établi par Jean-Guilhem Rouquette', 'Palabras del _Léxico de Max Rouquette_, establecido por Jean-Guilhem Rouquette', 'Words from the _Lexicon of Max Rouquette_, compiled by Jean-Guilhem Rouquette', 'Paraules del _Lèxic de Max Roqueta_, establert per Joan-Guilhèm Roqueta', null, null, true),
	('acuelh.bandel.causida', 'acuelh', 'text', null, 0, 'francitan', 'francitan', null, null, null, null, null, true),
	('acuelh.bandel.francitan.font', 'acuelh', 'text', null, 0, 'Mots d’òc que ja coneisses : lo francitan', 'Des mots d’oc que tu connais déjà : le francitan', 'Palabras occitanas que ya conoces: el francitan', 'Occitan words you already know: Francitan', 'Paraules occitanes que ja coneixes: el francitan', null, null, true),
	('acuelh.bandel.francitan.f01', 'acuelh', 'text', 'acuelh.bandel.francitan', 1, 'lo cabanon', 'le cabanon', 'la cabaña', 'the little cabin', 'la caseta', null, null, true),
	('acuelh.bandel.francitan.f02', 'acuelh', 'text', 'acuelh.bandel.francitan', 2, 'escagassar', 'esquinter (escagasser)', 'estropear', 'to wreck', 'fer malbé', null, null, true),
	('acuelh.bandel.francitan.f03', 'acuelh', 'text', 'acuelh.bandel.francitan', 3, 'lo pichon', 'le petit (pitchoun)', 'el pequeño', 'the little one', 'el petit', null, null, true),
	('acuelh.bandel.francitan.f04', 'acuelh', 'text', 'acuelh.bandel.francitan', 4, 'pecaire', 'hélas ! (peuchère)', '¡pobrecito!', 'poor thing!', 'pobret!', null, null, true),
	('acuelh.bandel.francitan.f05', 'acuelh', 'text', 'acuelh.bandel.francitan', 5, 'degun', 'personne (dégun)', 'nadie', 'nobody', 'ningú', null, null, true),
	('acuelh.bandel.francitan.f06', 'acuelh', 'text', 'acuelh.bandel.francitan', 6, 'la galejada', 'la galéjade', 'la broma', 'the joke', 'la broma', null, null, true),
	('acuelh.bandel.francitan.f07', 'acuelh', 'text', 'acuelh.bandel.francitan', 7, 'la fogassa', 'la fougasse', 'la fougasse', 'the fougasse', 'la fogassa', null, null, true),
	('acuelh.bandel.francitan.f08', 'acuelh', 'text', 'acuelh.bandel.francitan', 8, 'lo pastís', 'le pastis', 'el pastis', 'the pastis', 'el pastis (licor d’anís)', null, null, true),
	('acuelh.bandel.francitan.f09', 'acuelh', 'text', 'acuelh.bandel.francitan', 9, 'lo caçolet', 'le cassoulet', 'el cassoulet', 'the cassoulet', 'el cassoulet', null, null, true),
	('acuelh.bandel.francitan.f10', 'acuelh', 'text', 'acuelh.bandel.francitan', 10, 'la garriga', 'la garrigue', 'la garriga', 'the garrigue', 'la garriga', null, null, true),
	('acuelh.bandel.francitan.f11', 'acuelh', 'text', 'acuelh.bandel.francitan', 11, 'lo mistral', 'le mistral', 'el mistral', 'the mistral', 'el mestral', null, null, true),
	('acuelh.bandel.francitan.f12', 'acuelh', 'text', 'acuelh.bandel.francitan', 12, 'la cigala', 'la cigale', 'la cigarra', 'the cicada', 'la cigala', null, null, true),
	('acuelh.bandel.francitan.f13', 'acuelh', 'text', 'acuelh.bandel.francitan', 13, 'la calanca', 'la calanque', 'la cala', 'the calanque', 'la cala', null, null, true),
	('acuelh.bandel.francitan.f14', 'acuelh', 'text', 'acuelh.bandel.francitan', 14, 'la petanca', 'la pétanque', 'la petanca', 'pétanque', 'la petanca', null, null, true),
	('acuelh.manifest.titol', 'acuelh', 'text', null, 0, 'Qu’es aquò, Lo Ligam ?', 'Qu’est-ce que Lo Ligam ?', '¿Qué es Lo Ligam?', 'What is Lo Ligam?', 'Què és Lo Ligam?', null, null, true),
	('acuelh.manifest.tèxt', 'acuelh', 'text', null, 0, 'Aicí, l’occitan s’apren mai que mai en creant *ligam,* *sens vergonha* e *amb benvolença.*', 'Ici, l’occitan s’apprend avant tout en créant du *lien,* *sans honte* et *avec bienveillance.*', 'Aquí, el occitano se aprende, ante todo, creando *vínculos,* *sin vergüenza* y *con benevolencia.*', 'Here, you learn Occitan above all by creating *connections,* *without shame* and *with kindness.*', 'Aquí, l’occità s’aprèn, sobretot, creant *vincles,* *sense vergonya* i *amb benevolència.*', null, null, true),
	('acuelh.manifest.retrat', 'acuelh', 'imatge', null, 0, null, null, null, null, null, null, '{"url":"/acuelh/romain.webp","largor":480,"nautor":600,"alt_oc":"Romain Périer davant lo pic Sant Lop, dins una fenèstra de pèira","alt_fr":"Romain Périer devant le pic Saint-Loup, dans une fenêtre de pierre"}'::jsonb, true),
	('acuelh.manifest.legenda', 'acuelh', 'text', null, 0, 'ton professor', 'ton professeur', 'tu profesor', 'your teacher', 'el teu professor', null, null, true),
	('acuelh.sec.parla.titol', 'acuelh', 'text', null, 0, 'Se parla', 'Se parle', 'Se habla', 'Speak', 'Es parla', null, null, true),
	('acuelh.parla.carta', 'acuelh', 'ligam', null, 0, 'Dobrir la carta entièra', 'Ouvrir la carte entière', 'Abrir el mapa completo', 'Open the full map', 'Obrir el mapa complet', '/carta', null, true),
	('acuelh.parla.ligams.wiki', 'acuelh', 'ligam', 'acuelh.parla.ligams', 1, 'Cultura', 'Culture', 'Cultura', 'Culture', 'Cultura', '/cultura', null, true),
	('acuelh.parla.ligams.obras', 'acuelh', 'ligam', 'acuelh.parla.ligams', 2, 'Òbras', 'Œuvres', 'Obras', 'Works', 'Obres', '/obras', null, true),
	('acuelh.parla.ligams.articles', 'acuelh', 'ligam', 'acuelh.parla.ligams', 3, 'Articles', 'Articles', 'Artículos', 'Articles', 'Articles', '/articles', null, true),
	('acuelh.chifras.c1', 'acuelh', 'bloc', 'acuelh.chifras', 1, null, null, null, null, null, null, null, true),
	('acuelh.chifras.c1.num', 'acuelh', 'text', 'acuelh.chifras.c1', 0, '≈ 600 000', '≈ 600 000', null, null, null, null, null, true),
	('acuelh.chifras.c1.nom', 'acuelh', 'text', 'acuelh.chifras.c1', 0, 'locutors en Nòva Aquitània / Occitània (OPLO 2020)', 'locuteurs en Nouvelle-Aquitaine / Occitanie (OPLO 2020)', 'hablantes en Nueva Aquitania / Occitania (OPLO 2020)', 'speakers in Nouvelle-Aquitaine / Occitanie (OPLO 2020)', 'parlants a Nova Aquitània / Occitània (OPLO 2020)', null, null, true),
	('acuelh.chifras.c1.font', 'acuelh', 'text', 'acuelh.chifras.c1', 0, 'Estimacion, enquèsta sociolingüistica OPLO, 2020', 'Estimation, enquête sociolinguistique OPLO, 2020', 'Estimación, encuesta sociolingüística OPLO, 2020', 'Estimate, OPLO sociolinguistic survey, 2020', 'Estimació, enquesta sociolingüística OPLO, 2020', null, null, true),
	('acuelh.chifras.c2', 'acuelh', 'bloc', 'acuelh.chifras', 2, null, null, null, null, null, null, null, true),
	('acuelh.chifras.c2.num', 'acuelh', 'text', 'acuelh.chifras.c2', 0, '32', '32', null, null, null, null, null, true),
	('acuelh.chifras.c2.nom', 'acuelh', 'text', 'acuelh.chifras.c2', 0, 'despartaments', 'départements', 'departamentos', 'departments', 'departaments', null, null, true),
	('acuelh.chifras.c2.font', 'acuelh', 'text', 'acuelh.chifras.c2', 0, 'e mai la Val d’Aran e las valadas occitanas d’Itàlia', 'plus le Val d’Aran et les vallées occitanes d’Italie', 'más Val d’Aran y los valles occitanos de Italia', 'plus Val d’Aran and the Occitan valleys of Italy', 'més Val d’Aran i les valls occitanes d’Itàlia', null, null, true),
	('acuelh.chifras.c3', 'acuelh', 'bloc', 'acuelh.chifras', 3, null, null, null, null, null, null, null, true),
	('acuelh.chifras.c3.num', 'acuelh', 'text', 'acuelh.chifras.c3', 0, '10', '10', null, null, null, null, null, true),
	('acuelh.chifras.c3.nom', 'acuelh', 'text', 'acuelh.chifras.c3', 0, 'sègles de literatura', 'siècles de littérature', 'siglos de literatura', 'centuries of literature', 'segles de literatura', null, null, true),
	('acuelh.chifras.c3.font', 'acuelh', 'text', 'acuelh.chifras.c3', 0, 'dempuèi los primièrs trobadors', 'depuis les premiers troubadours', 'desde los primeros trovadores', 'since the first troubadours', 'des dels primers trobadors', null, null, true),
	('acuelh.sec.apren.titol', 'acuelh', 'text', null, 0, 'S’apren', 'S’apprend', 'Se aprende', 'Learn', 'S’aprèn', null, null, true),
	('acuelh.biais.visio', 'acuelh', 'bloc', 'acuelh.biais', 1, null, null, null, null, null, null, null, true),
	('acuelh.biais.visio.titol', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'En visio, d’ont que siás', 'En visio, d’où que tu sois', 'Por videollamada, estés donde estés', 'By video call, wherever you are', 'Per videotrucada, siguis on siguis', null, null, true),
	('acuelh.biais.visio.tèxt', 'acuelh', 'text', 'acuelh.biais.visio', 0, 'De corses en dirècte, sol a sol. Lo primièr es ofèrt.', 'Des cours en direct, en tête-à-tête. Le premier est offert.', 'Clases en directo, individuales. La primera es gratuita.', 'Live lessons, one-to-one. The first one is free.', 'Classes en directe, individuals. La primera és gratuïta.', null, null, true),
	('acuelh.biais.visio.ligam', 'acuelh', 'ligam', 'acuelh.biais.visio', 0, 'Prene rendètz-vos', 'Prendre rendez-vous', 'Reservar cita', 'Book an appointment', 'Demanar cita', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.biais.ritme', 'acuelh', 'bloc', 'acuelh.biais', 2, null, null, null, null, null, null, null, true),
	('acuelh.biais.ritme.titol', 'acuelh', 'text', 'acuelh.biais.ritme', 0, 'A ton ritme', 'À ton rythme', 'A tu ritmo', 'At your own pace', 'Al teu ritme', null, null, true),
	('acuelh.biais.ritme.tèxt', 'acuelh', 'text', 'acuelh.biais.ritme', 0, 'Un parcors autonòm, de zèro fins al nivèl B1, leiçon per leiçon, per contunhar entre dos corses.', 'Un parcours autonome, de zéro jusqu’au niveau B1, leçon par leçon, pour continuer entre deux cours.', 'Un recorrido autónomo, de cero hasta el nivel B1, lección por lección, para continuar entre dos clases.', 'A self-guided learning path, from zero up to level B1, lesson by lesson, to keep going between two lessons.', 'Un recorregut autònom, de zero fins al nivell B1, lliçó a lliçó, per continuar entre dues classes.', null, null, true),
	('acuelh.biais.ritme.ligam', 'acuelh', 'ligam', 'acuelh.biais.ritme', 0, 'Començar lo parcors', 'Commencer le parcours', 'Empezar el recorrido', 'Start the learning path', 'Començar el recorregut', '/aprene', null, true),
	('acuelh.biais.mesura', 'acuelh', 'bloc', 'acuelh.biais', 3, null, null, null, null, null, null, null, true),
	('acuelh.biais.mesura.titol', 'acuelh', 'text', 'acuelh.biais.mesura', 0, 'Sus mesura', 'Sur mesure', 'A medida', 'Tailor-made', 'A mida', null, null, true),
	('acuelh.biais.mesura.tèxt', 'acuelh', 'text', 'acuelh.biais.mesura', 0, 'Visio, parcors autonòm e rescontres en persona se sèm dins la meteissa vila : ara, soi a Lion.', 'Visio, parcours autonome et rencontres en personne si nous sommes dans la même ville : en ce moment, je suis à Lyon.', 'Videollamada, recorrido autónomo y encuentros en persona si estamos en la misma ciudad: ahora estoy en Lion.', 'Video lessons, a self-guided path and in-person meetings if we’re in the same city: right now, I’m in Lion.', 'Videotrucada, recorregut autònom i trobades en persona si som a la mateixa ciutat: ara sóc a Lion.', null, null, true),
	('acuelh.biais.mesura.ligam', 'acuelh', 'ligam', 'acuelh.biais.mesura', 0, 'Ne parlar amassa', 'En parler ensemble', 'Hablemos de ello', 'Let’s talk about it', 'Parlem-ne', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.lengas.legenda', 'acuelh', 'text', null, 0, 'Aprene l’occitan dempuèi :', 'Apprendre l’occitan depuis :', 'Aprender occitano desde:', 'Learn Occitan from:', 'Aprendre occità des de:', null, null, true),
	('acuelh.sec.viu.titol', 'acuelh', 'text', null, 0, 'Amassa', 'Rassemble', 'Reúne', 'Gather', 'Reuneix', null, null, true),
	('acuelh.viure.comunautat.nom', 'acuelh', 'text', null, 0, 'La comunautat', 'La communauté', 'La comunidad', 'The community', 'La comunitat', null, null, true),
	('acuelh.viure.comunautat.sota', 'acuelh', 'text', null, 0, 'Fòrum, grops e idèas', 'Forum, groupes et idées', 'Foro, grupos e ideas', 'Forum, groups and ideas', 'Fòrum, grups i idees', null, null, true),
	('acuelh.viure.comunautat.items.forum', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 1, 'Fòrum', 'Forum', 'Foro', 'Forum', 'Fòrum', '/forum', null, true),
	('acuelh.viure.comunautat.items.grops', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 2, 'Grops', 'Groupes', 'Grupos', 'Groups', 'Grups', '/grops', null, true),
	('acuelh.viure.comunautat.items.ideas', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 3, 'Boita d’idèas', 'Boîte à idées', 'Buzón de ideas', 'Idea box', 'Bústia d’idees', '/ideas', null, true),
	('acuelh.viure.comunautat.items.instagram', 'acuelh', 'ligam', 'acuelh.viure.comunautat.items', 4, 'Instagram', 'Instagram', null, null, null, 'https://www.instagram.com/lo_ligam/', null, true),
	('acuelh.trobador.fenestra', 'acuelh', 'imatge', null, 0, null, null, null, null, null, null, '{"url":"/acuelh/erau.webp","largor":1500,"nautor":2173,"alt_oc":"","alt_fr":""}'::jsonb, true),
	('acuelh.trobador.vers.1', 'acuelh', 'text', null, 0, '« Espinchas dins la solelhada', '« Espinchas dins la solelhada', null, null, null, null, null, true),
	('acuelh.trobador.vers.2', 'acuelh', 'text', null, 0, 'passar d’un nivol lo pantai… »', 'passar d’un nivol lo pantai… »', null, null, null, null, null, true),
	('acuelh.trobador.cita', 'acuelh', 'text', null, 0, 'Max Roqueta · _La pietat dau matin_, 1963', 'Max Rouquette · _La pietat dau matin_, 1963', null, null, null, null, null, true),
	('acuelh.crida.titol.1', 'acuelh', 'text', null, 0, 'Prèst·a per', 'Prêt·e à', '¿Empezamos', 'Ready to', 'Comencem', null, null, true),
	('acuelh.crida.titol.2', 'acuelh', 'text', null, 0, 'començar ?', 'commencer ?', 'ahora?', 'start?', 'ara?', null, null, true),
	('acuelh.crida.sota', 'acuelh', 'text', null, 0, '', '', null, null, null, null, null, false),
	('acuelh.crida.reservar', 'acuelh', 'ligam', null, 0, 'Reservar un primièr cors', 'Réserver un premier cours', 'Reservar una primera clase', 'Book a first lesson', 'Reservar una primera classe', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('acuelh.crida.places', 'acuelh', 'text', null, 0, '', '', null, null, null, null, null, true),
	('acuelh.crida.espera', 'acuelh', 'ligam', null, 0, 'Lista d’espèra', 'Liste d’attente', 'Lista de espera', 'Waiting list', 'Llista d’espera', '/apren/visio#questionari', null, true),
	('acuelh.crida.sol', 'acuelh', 'ligam', null, 0, 'Començar sol·a', 'Commencer seul·e', 'Empezar por tu cuenta', 'Start on your own', 'Començar pel teu compte', '/aprene/modul/0', null, true),
	('parla.titol', 'parla', 'text', null, 0, 'Se parla', 'Se parle', 'Se habla', 'Speak', 'Es parla', null, null, true),
	('parla.frasa', 'parla', 'text', null, 0, 'A escriure : ta frasa sus Se parla', 'À écrire : ta phrase sur Se parle', 'Por escribir: tu frase sobre Se habla', 'To be written: your sentence for Speak', 'Per escriure: la teva frase sobre Es parla', null, null, false),
	('parla.teulas.carta', 'parla', 'bloc', 'parla.teulas', 1, null, null, null, null, null, null, null, true),
	('parla.teulas.carta.ligam', 'parla', 'ligam', 'parla.teulas.carta', 0, 'La carta', 'La carte', 'El mapa', 'The map', 'El mapa', '/carta', null, true),
	('parla.teulas.carta.sota', 'parla', 'text', 'parla.teulas.carta', 0, 'L’aira culturala occitana, sas lengas e sos luòcs.', 'L’aire culturelle occitane, ses langues et ses lieux.', 'El área cultural occitana, sus lenguas y sus lugares.', 'The Occitan cultural area, its languages and its places.', 'L’àrea cultural occitana, les seves llengües i els seus llocs.', null, null, true),
	('parla.teulas.wiki', 'parla', 'bloc', 'parla.teulas', 2, null, null, null, null, null, null, null, true),
	('parla.teulas.wiki.ligam', 'parla', 'ligam', 'parla.teulas.wiki', 0, 'Cultura', 'Culture', 'Cultura', 'Culture', 'Cultura', '/cultura', null, true),
	('parla.teulas.wiki.sota', 'parla', 'text', 'parla.teulas.wiki', 0, 'La lenga, lo país, sos poètas e sas cançons, en fichas cortas.', 'La langue, le pays, ses poètes et ses chansons, en fiches courtes.', 'La lengua, el país, sus poetas y sus canciones, en fichas cortas.', 'The language, the country, its poets and its songs, in short sheets.', 'La llengua, el país, els seus poetes i les seves cançons, en fitxes curtes.', null, null, true),
	('parla.teulas.obras', 'parla', 'bloc', 'parla.teulas', 3, null, null, null, null, null, null, null, true),
	('parla.teulas.obras.ligam', 'parla', 'ligam', 'parla.teulas.obras', 0, 'Òbras', 'Œuvres', 'Obras', 'Works', 'Obres', '/obras', null, true),
	('parla.teulas.obras.sota', 'parla', 'text', 'parla.teulas.obras', 0, 'Çò qu’escoti, çò que legissi, çò que te fau descobrir.', 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir.', 'Lo que escucho, lo que leo, lo que te hago descubrir.', 'What I listen to, what I read, what I get you to discover.', 'El que escolto, el que llegeixo, el que et faig descobrir.', null, null, true),
	('parla.teulas.articles', 'parla', 'bloc', 'parla.teulas', 4, null, null, null, null, null, null, null, true),
	('parla.teulas.articles.ligam', 'parla', 'ligam', 'parla.teulas.articles', 0, 'Articles', 'Articles', 'Artículos', 'Articles', 'Articles', '/articles', null, true),
	('parla.teulas.articles.sota', 'parla', 'text', 'parla.teulas.articles', 0, 'A escriure', 'À écrire', 'Por escribir', 'To be written', 'Per escriure', null, null, false),
	('parla.teulas.medias', 'parla', 'bloc', 'parla.teulas', 5, null, null, null, null, null, null, null, true),
	('parla.teulas.medias.ligam', 'parla', 'ligam', 'parla.teulas.medias', 0, 'Mèdias', 'Médias', 'Medios', 'Media', 'Mitjans', '/medias', null, true),
	('parla.teulas.medias.sota', 'parla', 'text', 'parla.teulas.medias', 0, 'Las ràdios, las televisions e la premsa.', 'Les radios, les télévisions et la presse.', 'Las radios, las televisiones y la prensa.', 'Radio, television and the press.', 'Les ràdios, les televisions i la premsa.', null, null, true),
	('obras.titol', 'obras', 'text', null, 0, 'Òbras', 'Œuvres', 'Obras', 'Works', 'Obres', null, null, true),
	('obras.frasa', 'obras', 'text', null, 0, 'Çò qu’escoti, çò que legissi, çò que te fau descobrir en occitan.', 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.', 'Lo que escucho, lo que leo, lo que te hago descubrir en occitano.', 'What I listen to, what I read, what I get you to discover in Occitan.', 'El que escolto, el que llegeixo, el que et faig descobrir en occità.', null, null, true),
	('obras.teulas.musica', 'obras', 'bloc', 'obras.teulas', 1, null, null, null, null, null, null, null, true),
	('obras.teulas.musica.ligam', 'obras', 'ligam', 'obras.teulas.musica', 0, 'Musica', 'Musique', 'Música', 'Music', 'Música', '/ensag/musica', null, true),
	('obras.teulas.musica.sota', 'obras', 'text', 'obras.teulas.musica', 0, 'Las cançons en occitan.', 'Les chansons en occitan.', 'Las canciones en occitano.', 'Songs in Occitan.', 'Les cançons en occità.', null, null, true),
	('obras.teulas.literatura', 'obras', 'bloc', 'obras.teulas', 2, null, null, null, null, null, null, null, true),
	('obras.teulas.literatura.ligam', 'obras', 'ligam', 'obras.teulas.literatura', 0, 'Literatura', 'Littérature', 'Literatura', 'Literature', 'Literatura', '/obras/literatura', null, true),
	('obras.teulas.literatura.sota', 'obras', 'text', 'obras.teulas.literatura', 0, 'Los editors en occitan.', 'Les éditeurs en occitan.', 'Las editoriales en occitano.', 'Publishers in Occitan.', 'Les editorials en occità.', null, null, true),
	('obras.teulas.cinema', 'obras', 'bloc', 'obras.teulas', 3, null, null, null, null, null, null, null, true),
	('obras.teulas.cinema.ligam', 'obras', 'ligam', 'obras.teulas.cinema', 0, 'Cinema e video', 'Cinéma et vidéo', 'Cine y vídeo', 'Cinema and video', 'Cinema i vídeo', '/obras/cinema', null, true),
	('obras.teulas.cinema.sota', 'obras', 'text', 'obras.teulas.cinema', 0, 'Los filmes en occitan.', 'Les films en occitan.', 'Las películas en occitano.', 'Films in Occitan.', 'Les pel·lícules en occità.', null, null, true),
	('obras.teulas.pintura', 'obras', 'bloc', 'obras.teulas', 4, null, null, null, null, null, null, null, true),
	('obras.teulas.pintura.ligam', 'obras', 'ligam', 'obras.teulas.pintura', 0, 'Pintura e afichas', 'Peinture et affiches', 'Pintura y carteles', 'Painting and posters', 'Pintura i cartells', '/obras/afichas', null, true),
	('obras.teulas.pintura.sota', 'obras', 'text', 'obras.teulas.pintura', 0, 'D’afichas que fan parlar la lenga sus las parets.', 'Des affiches qui font parler la langue sur les murs.', 'Carteles que hacen hablar a la lengua en las paredes.', 'Posters that make the language speak on the walls.', 'Cartells que fan parlar la llengua a les parets.', null, null, true),
	('obras.teulas.scena', 'obras', 'bloc', 'obras.teulas', 5, null, null, null, null, null, null, null, true),
	('obras.teulas.scena.ligam', 'obras', 'ligam', 'obras.teulas.scena', 0, 'Scèna', 'Scène', 'Escena', 'Stage', 'Escena', '#scena', null, true),
	('obras.teulas.scena.sota', 'obras', 'text', 'obras.teulas.scena', 0, 'Teatre, dança e contes. Lèu.', 'Théâtre, danse et contes. Bientôt.', 'Teatro, danza y cuentos. Pronto.', 'Theatre, dance and storytelling. Coming soon.', 'Teatre, dansa i contes. Aviat.', null, null, true),
	('medias.titol', 'medias', 'text', null, 0, 'Mèdias', 'Médias', 'Medios', 'Media', 'Mitjans', null, null, true),
	('medias.frasa', 'medias', 'text', null, 0, 'Las ràdios, las televisions e la premsa en occitan.', 'Les radios, les télévisions et la presse en occitan.', 'Las radios, las televisiones y la prensa en occitano.', 'Radio, television and the press in Occitan.', 'Les ràdios, les televisions i la premsa en occità.', null, null, true),
	('medias.teulas.radios', 'medias', 'bloc', 'medias.teulas', 1, null, null, null, null, null, null, null, true),
	('medias.teulas.radios.ligam', 'medias', 'ligam', 'medias.teulas.radios', 0, 'Ràdios', 'Radios', 'Radios', 'Radio stations', 'Ràdios', '/medias/radios', null, true),
	('medias.teulas.radios.sota', 'medias', 'text', 'medias.teulas.radios', 0, 'Set ràdios en occitan, en dirècte.', 'Sept radios en occitan, en direct.', 'Siete radios en occitano, en directo.', 'Seven radio stations in Occitan, live.', 'Set ràdios en occità, en directe.', null, null, true),
	('medias.teulas.television', 'medias', 'bloc', 'medias.teulas', 2, null, null, null, null, null, null, null, true),
	('medias.teulas.television.ligam', 'medias', 'ligam', 'medias.teulas.television', 0, 'Television e video', 'Télévision et vidéo', 'Televisión y vídeo', 'Television and video', 'Televisió i vídeo', '/medias/television', null, true),
	('medias.teulas.television.sota', 'medias', 'text', 'medias.teulas.television', 0, 'Las cadenas, las emissions e las videos.', 'Les chaînes, les émissions et les vidéos.', 'Los canales, los programas y los vídeos.', 'The channels, the programmes and the videos.', 'Els canals, els programes i els vídeos.', null, null, true),
	('medias.teulas.premsa', 'medias', 'bloc', 'medias.teulas', 3, null, null, null, null, null, null, null, true),
	('medias.teulas.premsa.ligam', 'medias', 'ligam', 'medias.teulas.premsa', 0, 'Premsa', 'Presse', 'Prensa', 'Press', 'Premsa', '/medias/premsa', null, true),
	('medias.teulas.premsa.sota', 'medias', 'text', 'medias.teulas.premsa', 0, 'Los jornals e las revistas.', 'Les journaux et les revues.', 'Los periódicos y las revistas.', 'Newspapers and magazines.', 'Els diaris i les revistes.', null, null, true),
	('medias.teulas.livres', 'medias', 'bloc', 'medias.teulas', 4, null, null, null, null, null, null, null, true),
	('medias.teulas.livres.ligam', 'medias', 'ligam', 'medias.teulas.livres', 0, 'Libres', 'Livres', 'Libros', 'Books', 'Llibres', '/medias/livres', null, true),
	('medias.teulas.livres.sota', 'medias', 'text', 'medias.teulas.livres', 0, 'Los libres ancians de fulhetar.', 'Les livres anciens à feuilleter.', 'Los libros antiguos para hojear.', 'Old books to browse.', 'Els llibres antics per fullejar.', null, null, true),
	('apren.titol', 'apren', 'text', null, 0, 'S’apren', 'S’apprend', 'Se aprende', 'Learn', 'S’aprèn', null, null, true),
	('apren.frasa', 'apren', 'text', null, 0, 'A escriure : ta frasa sus S’apren', 'À écrire : ta phrase sur S’apprend', 'Por escribir: tu frase sobre Se aprende', 'To be written: your sentence for Learn', 'Per escriure: la teva frase sobre S’aprèn', null, null, false),
	('apren.teulas.visio', 'apren', 'bloc', 'apren.teulas', 1, null, null, null, null, null, null, null, true),
	('apren.teulas.visio.ligam', 'apren', 'ligam', 'apren.teulas.visio', 0, 'Corses en visio', 'Cours en visio', 'Clases por videollamada', 'Video lessons', 'Classes per videotrucada', '/apren/visio', null, true),
	('apren.teulas.visio.sota', 'apren', 'text', 'apren.teulas.visio', 0, 'Sol a sol. Lo primièr es ofèrt.', 'En tête-à-tête. Le premier est offert.', 'Individuales. La primera es gratuita.', 'One-to-one. The first one is free.', 'Individuals. La primera és gratuïta.', null, null, true),
	('apren.teulas.parcors', 'apren', 'bloc', 'apren.teulas', 2, null, null, null, null, null, null, null, true),
	('apren.teulas.parcors.ligam', 'apren', 'ligam', 'apren.teulas.parcors', 0, 'Lo parcors', 'Le parcours', 'El recorrido', 'The learning path', 'El recorregut', '/aprene', null, true),
	('apren.teulas.parcors.sota', 'apren', 'text', 'apren.teulas.parcors', 0, 'De zèro fins al nivèl B1, leiçon per leiçon.', 'De zéro jusqu’au niveau B1, leçon par leçon.', 'De cero hasta el nivel B1, lección por lección.', 'From zero up to level B1, lesson by lesson.', 'De zero fins al nivell B1, lliçó per lliçó.', null, null, true),
	('apren.teulas.ensag', 'apren', 'bloc', 'apren.teulas', 3, null, null, null, null, null, null, null, true),
	('apren.teulas.ensag.ligam', 'apren', 'ligam', 'apren.teulas.ensag', 0, 'Anem ! Per los pichons', 'Anem ! Pour les petits', 'Anem ! Para los pequeños', 'Anem! For little ones', 'Anem ! Per als petits', '/anem', null, true),
	('apren.teulas.ensag.sota', 'apren', 'text', 'apren.teulas.ensag', 0, 'De 3 a 6 ans : se tòca una bèstia, s’ausís son nom.', 'De 3 à 6 ans : on touche une bête, on entend son nom.', 'De 3 a 6 años: se toca un animal, se oye su nombre.', 'Ages 3 to 6: touch an animal, hear its name.', 'De 3 a 6 anys: es toca un animal, se sent el seu nom.', null, null, true),
	('apren.teulas.mots', 'apren', 'bloc', 'apren.teulas', 4, null, null, null, null, null, null, null, true),
	('apren.teulas.mots.ligam', 'apren', 'ligam', 'apren.teulas.mots', 0, 'Mots en imatges', 'Mots en images', 'Palabras en imágenes', 'Words in pictures', 'Paraules en imatges', '/mots', null, true),
	('apren.teulas.mots.sota', 'apren', 'text', 'apren.teulas.mots', 0, 'A escriure', 'À écrire', 'Por escribir', 'To be written', 'Per escriure', null, null, false),
	('apren.teulas.gramatica', 'apren', 'bloc', 'apren.teulas', 5, null, null, null, null, null, null, null, true),
	('apren.teulas.gramatica.ligam', 'apren', 'ligam', 'apren.teulas.gramatica', 0, 'Gramatica', 'Grammaire', 'Gramática', 'Grammar', 'Gramàtica', '/apren/gramatica', null, true),
	('apren.teulas.gramatica.sota', 'apren', 'text', 'apren.teulas.gramatica', 0, 'Las règlas de la lenga, nocion per nocion.', 'Les règles de la langue, notion par notion.', 'Las reglas de la lengua, noción por noción.', 'The rules of the language, one notion at a time.', 'Les regles de la llengua, noció per noció.', null, null, true),
	('apren.teulas.progression', 'apren', 'bloc', 'apren.teulas', 6, null, null, null, null, null, null, null, true),
	('apren.teulas.progression.ligam', 'apren', 'ligam', 'apren.teulas.progression', 0, 'Ma progression', 'Ma progression', 'Mi progreso', 'My progress', 'El meu progrés', '/compte', null, true),
	('apren.teulas.progression.sota', 'apren', 'text', 'apren.teulas.progression', 0, 'A escriure', 'À écrire', 'Por escribir', 'To be written', 'Per escriure', null, null, false),
	('visio.titol', 'visio', 'text', null, 0, 'Corses en visio', 'Cours en visio', 'Clases por videollamada', 'Video lessons', 'Classes per videotrucada', null, null, true),
	('visio.chapeu', 'visio', 'text', null, 0, 'De corses en dirècte, sol a sol. Lo primièr es ofèrt.', 'Des cours en direct, en tête-à-tête. Le premier est offert.', 'Clases en directo, individuales. La primera es gratuita.', 'Live lessons, one-to-one. The first one is free.', 'Classes en directe, individuals. La primera és gratuïta.', null, null, true),
	('visio.reservar', 'visio', 'ligam', null, 0, 'Reservar un primièr cors', 'Réserver un premier cours', 'Reservar una primera clase', 'Book a first lesson', 'Reservar una primera classe', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('visio.qual.titol', 'visio', 'text', null, 0, 'Per qual ?', 'Pour qui ?', '¿Para quién?', 'Who is it for?', 'Per a qui?', null, null, true),
	('visio.qual.tèxt', 'visio', 'text', null, 0, 'Per las debutantas e los debutants de tot país : una primièra descobèrta de l’occitan.', 'Pour les débutant·es de tout pays : une première découverte de l’occitan.', 'Para principiantes de cualquier país: un primer descubrimiento del occitano.', 'For beginners from any country: a first taste of Occitan.', 'Per a principiants de qualsevol país: un primer descobriment de l’occità.', null, null, true),
	('visio.metòde.titol', 'visio', 'text', null, 0, 'La metòde', 'La méthode', 'El método', 'The method', 'El mètode', null, null, true),
	('visio.metòde.tèxt', 'visio', 'text', null, 0, 'Ma metòde, es subretot un ecosistèma : tot çò qu’ai creat a l’entorn del Ligam, los jòcs, lo parcors coma dins una aplicacion de lengas, e los corses en visio que lo completan. Un biais simple, per aprene dins de bonas condicions.

Soi ieu tanben aprenent, e o disi clar : me presenti pas coma un expèrt. Ai après, la lenga m’a impregnat, e sèm dins la meteissa barca. Çò que vòli subretot : que l’experiéncia siá agradiva.', 'Ma méthode, c’est surtout un écosystème : tout ce que j’ai créé autour du Ligam, les jeux, le parcours comme dans une application de langues, et les cours en visio qui le complètent. Une approche simple, pour apprendre dans de bonnes conditions.

Je suis moi-même apprenant, et je le dis clairement : je ne me présente pas comme un expert. J’ai appris, la langue m’a imprégné, et nous sommes dans le même bateau. Ce que je veux surtout : que l’expérience soit agréable.', 'Mi método es sobre todo un ecosistema: todo lo que he creado en torno a Lo Ligam, los juegos, el recorrido como en una aplicación de idiomas, y las clases por videollamada que lo completan. Un enfoque sencillo, para aprender en buenas condiciones.

Yo también soy aprendiz, y lo digo claramente: no me presento como un experto. He aprendido, la lengua me ha impregnado, y estamos en el mismo barco. Lo que quiero sobre todo: que la experiencia sea agradable.', 'My method is above all an ecosystem: everything I’ve built around Lo Ligam, the games, the learning path as in a language app, and the video lessons that complete it. A simple approach, for learning in good conditions.

I’m a learner myself, and I say so plainly: I don’t present myself as an expert. I learned, the language has seeped into me, and we’re in the same boat. What I want above all: for the experience to be enjoyable.', 'El meu mètode és sobretot un ecosistema: tot el que he creat al voltant de Lo Ligam, els jocs, el recorregut com en una aplicació d’idiomes, i les classes per videotrucada que el completen. Un enfocament senzill, per aprendre en bones condicions.

Jo també sóc aprenent, i ho dic clarament: no em presento com un expert. He après, la llengua m’ha impregnat, i anem en el mateix vaixell. El que vull sobretot: que l’experiència sigui agradable.', null, null, true),
	('visio.debana.titol', 'visio', 'text', null, 0, 'Cossí se debana un cors ?', 'Comment se passe un cours ?', '¿Cómo es una clase?', 'How does a lesson work?', 'Com és una classe?', null, null, true),
	('visio.debana.e1', 'visio', 'text', 'visio.debana', 1, 'Per començar doçament, dètz minutas : parlam de ta setmana. O, se t’agrada mai, començam tot dreit per una lectura.', 'Pour commencer en douceur, dix minutes : on parle de ta semaine. Ou, si tu préfères, on commence tout de suite par une lecture.', 'Para empezar con calma, diez minutos: hablamos de tu semana. O, si prefieres, empezamos directamente con una lectura.', 'To start gently, ten minutes: we talk about your week. Or, if you prefer, we dive straight into a reading.', 'Per començar amb calma, deu minuts: parlem de la teva setmana. O, si prefereixes, comencem directament amb una lectura.', null, null, true),
	('visio.debana.e2', 'visio', 'text', 'visio.debana', 2, 'Un retorn sus la prononciacion e los mots novèls.', 'Un retour sur la prononciation et les mots nouveaux.', 'Un repaso de la pronunciación y de las palabras nuevas.', 'A look back at pronunciation and the new words.', 'Un repàs de la pronunciació i de les paraules noves.', null, null, true),
	('visio.debana.e3', 'visio', 'text', 'visio.debana', 3, 'Un punt de gramatica, una règla o un fach curiós sus l’occitan.', 'Un point de grammaire, une règle ou un fait curieux sur l’occitan.', 'Un punto de gramática, una regla o un dato curioso sobre el occitano.', 'A grammar point, a rule or an interesting fact about Occitan.', 'Un punt de gramàtica, una regla o un fet curiós sobre l’occità.', null, null, true),
	('visio.practica.titol', 'visio', 'text', null, 0, 'En practica', 'En pratique', 'En la práctica', 'In practice', 'A la pràctica', null, null, true),
	('visio.practica.lengas', 'visio', 'text', 'visio.practica', 1, 'Dempuèi lo francés, l’anglés, lo castelhan o lo catalan.', 'Depuis le français, l’anglais, le castillan ou le catalan.', 'Desde el francés, el inglés, el castellano o el catalán.', 'From French, English, Spanish or Catalan.', 'Des del francès, l’anglès, el castellà o el català.', null, null, true),
	('visio.practica.persona', 'visio', 'text', 'visio.practica', 2, 'En persona tanben, se sèm dins la meteissa vila : ara, soi a Lion.', 'En personne aussi, si nous sommes dans la même ville : en ce moment, je suis à Lyon.', 'También en persona, si estamos en la misma ciudad: ahora estoy en Lion.', 'In person too, if we’re in the same city: right now, I’m in Lion.', 'També en persona, si som a la mateixa ciutat: ara sóc a Lion.', null, null, true),
	('visio.practica.durada', 'visio', 'text', 'visio.practica', 3, 'Una ora, pas mai.', 'Une heure, pas plus.', 'Una hora, no más.', 'One hour, no more.', 'Una hora, no més.', null, null, true),
	('visio.practica.pretz', 'visio', 'text', 'visio.practica', 4, 'Lo primièr cors es gratuit ; un don es possible.', 'Le premier cours est gratuit ; un don est possible.', 'La primera clase es gratuita; es posible hacer una donación.', 'The first lesson is free; a donation is possible.', 'La primera classe és gratuïta; és possible fer un donatiu.', null, null, true),
	('visio.debana.e4', 'visio', 'text', 'visio.debana', 4, 'Un moment d’escritura : redigisses, per t’entrainar.', 'Un moment d’écriture : tu rédiges, pour t’entraîner.', 'Un momento de escritura: redactas, para practicar.', 'A writing moment: you write something, to practise.', 'Un moment d’escriptura: redactes, per entrenar-te.', null, null, true),
	('visio.debana.e5', 'visio', 'text', 'visio.debana', 5, 'Per acabar, una obertura : una cançon, quicòm d’agradiu.', 'Pour finir, une ouverture : une chanson, quelque chose d’agréable.', 'Para terminar, una apertura: una canción, algo agradable.', 'To finish, an opening: a song, something enjoyable.', 'Per acabar, una obertura: una cançó, alguna cosa agradable.', null, null, true),
	('visio.debana.nota', 'visio', 'text', null, 0, 'Fòrça dialòg : al començament mesclam ta lenga e l’occitan, puèi l’occitan ven de mai en mai natural.', 'Beaucoup de dialogue : au début on mélange ta langue et l’occitan, puis l’occitan devient de plus en plus naturel.', 'Mucho diálogo: al principio mezclamos tu lengua y el occitano, y poco a poco el occitano se vuelve cada vez más natural.', 'Lots of dialogue: at first we mix your language and Occitan, then Occitan becomes more and more natural.', 'Molt de diàleg: al principi barregem la teva llengua i l’occità, i després l’occità es torna cada cop més natural.', null, null, true),
	('visio.practica.formulas', 'visio', 'text', 'visio.practica', 5, 'Puèi, de 15 a 30 € lo cors, segon lo prètz que causisses.', 'Ensuite, de 15 à 30 € le cours, selon le tarif que tu choisis.', 'Después, de 15 a 30 € la clase, según la tarifa que elijas.', 'After that, €15 to €30 per lesson, depending on the rate you choose.', 'Després, de 15 a 30 € la classe, segons la tarifa que triïs.', null, null, true),
	('visio.pretz.titol', 'visio', 'text', null, 0, 'Los prètz', 'Les prix', 'Los precios', 'Prices', 'Els preus', null, null, true),
	('visio.pretz.intro', 'visio', 'text', null, 0, 'Lo primièr cors es gratuit. Puèi, causisses ton prètz en consciéncia, sens cap de justificatiu : lo prètz engatjat finança lo prètz solidari.', 'Le premier cours est gratuit. Ensuite, tu choisis ton tarif en conscience, sans aucun justificatif : le tarif engagé finance le tarif solidaire.', 'La primera clase es gratuita. Después, eliges tu tarifa en conciencia, sin ningún justificante: la tarifa comprometida financia la tarifa solidaria.', 'The first lesson is free. After that, you choose your rate in good conscience, with no proof needed: the committed rate funds the solidarity rate.', 'La primera classe és gratuïta. Després, tries la teva tarifa en consciència, sense cap justificant: la tarifa compromesa finança la tarifa solidària.', null, null, true),
	('visio.pretz.un', 'visio', 'text', null, 0, 'Lo cors d’una ora', 'Le cours d’une heure', 'La clase de una hora', 'One-hour lesson', 'La classe d’una hora', null, null, true),
	('visio.pretz.mes', 'visio', 'text', null, 0, '4 corses, en dos meses', '4 cours, sur deux mois', '4 clases, en dos meses', '4 lessons over two months', '4 classes, en dos mesos', null, null, true),
	('visio.pretz.trimestre', 'visio', 'text', null, 0, '12 corses, en cinc meses', '12 cours, sur cinq mois', '12 clases, en cinco meses', '12 lessons over five months', '12 classes, en cinc mesos', null, null, true),
	('visio.pretz.tarifs.t1', 'visio', 'bloc', 'visio.pretz.tarifs', 1, null, null, null, null, null, null, null, true),
	('visio.pretz.tarifs.t1.nom', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, 'Solidari', 'Solidaire', 'Solidaria', 'Solidarity', 'Solidària', null, null, true),
	('visio.pretz.tarifs.t1.un', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '15 €', '15 €', '15 €', '15 €', '15 €', null, null, true),
	('visio.pretz.tarifs.t1.mes', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '55 €', '55 €', '55 €', '55 €', '55 €', null, null, true),
	('visio.pretz.tarifs.t1.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t1', 0, '155 €', '155 €', '155 €', '155 €', '155 €', null, null, true),
	('visio.pretz.tarifs.t2', 'visio', 'bloc', 'visio.pretz.tarifs', 2, null, null, null, null, null, null, null, true),
	('visio.pretz.tarifs.t2.nom', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, 'Classic', 'Classique', 'Clásica', 'Standard', 'Clàssica', null, null, true),
	('visio.pretz.tarifs.t2.un', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '22 €', '22 €', '22 €', '22 €', '22 €', null, null, true),
	('visio.pretz.tarifs.t2.mes', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '80 €', '80 €', '80 €', '80 €', '80 €', null, null, true),
	('visio.pretz.tarifs.t2.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t2', 0, '225 €', '225 €', '225 €', '225 €', '225 €', null, null, true),
	('visio.pretz.tarifs.t3', 'visio', 'bloc', 'visio.pretz.tarifs', 3, null, null, null, null, null, null, null, true),
	('visio.pretz.tarifs.t3.nom', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, 'Engatjat', 'Engagé', 'Comprometida', 'Committed', 'Compromesa', null, null, true),
	('visio.pretz.tarifs.t3.un', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '30 €', '30 €', '30 €', '30 €', '30 €', null, null, true),
	('visio.pretz.tarifs.t3.mes', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '110 €', '110 €', '110 €', '110 €', '110 €', null, null, true),
	('visio.pretz.tarifs.t3.trimestre', 'visio', 'text', 'visio.pretz.tarifs.t3', 0, '305 €', '305 €', '305 €', '305 €', '305 €', null, null, true),
	('visio.q.titol', 'visio', 'text', null, 0, 'Abans lo primièr cors', 'Avant le premier cours', 'Antes de la primera clase', 'Before the first lesson', 'Abans de la primera classe', null, null, true),
	('visio.q.intro', 'visio', 'text', null, 0, 'Qualques questions per preparar ton cors. Après, causisses ton ora dins mon calendièr.', 'Quelques questions pour préparer ton cours. Ensuite, tu choisis ton heure dans mon calendrier.', 'Unas preguntas para preparar tu clase. Después, eliges tu hora en mi calendario.', 'A few questions to prepare your lesson. Then you pick your time in my calendar.', 'Unes quantes preguntes per preparar la teva classe. Després, tries l’hora al meu calendari.', null, null, true),
	('visio.q.nom', 'visio', 'text', null, 0, 'Ton prenom', 'Ton prénom', 'Tu nombre', 'Your first name', 'El teu nom', null, null, true),
	('visio.q.corrièl', 'visio', 'text', null, 0, 'Ton corrièl', 'Ton adresse électronique', 'Tu correo electrónico', 'Your email address', 'El teu correu electrònic', null, null, true),
	('visio.q.nivèl.titol', 'visio', 'text', null, 0, 'Ton nivèl en occitan', 'Ton niveau en occitan', 'Tu nivel de occitano', 'Your level of Occitan', 'El teu nivell d’occità', null, null, true),
	('visio.q.nivèls.n1', 'visio', 'text', 'visio.q.nivèls', 1, 'Ai pas jamai après l’occitan', 'Je n’ai jamais appris l’occitan', 'Nunca he aprendido occitano', 'I’ve never learned Occitan', 'Mai no he après occità', null, null, true),
	('visio.q.nivèls.n2', 'visio', 'text', 'visio.q.nivèls', 2, 'Ne sabi qualques mots', 'J’en connais quelques mots', 'Conozco algunas palabras', 'I know a few words', 'En conec unes quantes paraules', null, null, true),
	('visio.q.nivèls.n3', 'visio', 'text', 'visio.q.nivèls', 3, 'Comprene, mas parli pauc', 'Je comprends, mais je parle peu', 'Entiendo, pero hablo poco', 'I understand it, but I don’t speak much', 'Ho entenc, però parlo poc', null, null, true),
	('visio.q.nivèls.n4', 'visio', 'text', 'visio.q.nivèls', 4, 'Parli ja, vòli anar mai luènh', 'Je parle déjà, je veux aller plus loin', 'Ya hablo, quiero ir más lejos', 'I already speak it, I want to go further', 'Ja en parlo, vull anar més lluny', null, null, true),
	('visio.q.motivacion.titol', 'visio', 'text', null, 0, 'Çò que te mena a l’occitan', 'Ce qui t’amène à l’occitan', 'Lo que te trae al occitano', 'What brings you to Occitan', 'El que et porta a l’occità', null, null, true),
	('visio.q.motivacions.m1', 'visio', 'text', 'visio.q.motivacions', 1, 'Las raices de ma familha', 'Les racines de ma famille', 'Las raíces de mi familia', 'My family’s roots', 'Les arrels de la meva família', null, null, true),
	('visio.q.motivacions.m2', 'visio', 'text', 'visio.q.motivacions', 2, 'Visi en país occitan', 'Je vis en pays occitan', 'Vivo en tierra occitana', 'I live in the Occitan-speaking region', 'Visc en terra occitana', null, null, true),
	('visio.q.motivacions.m3', 'visio', 'text', 'visio.q.motivacions', 3, 'La musica, los libres, la cultura', 'La musique, les livres, la culture', 'La música, los libros, la cultura', 'Music, books, culture', 'La música, els llibres, la cultura', null, null, true),
	('visio.q.motivacions.m4', 'visio', 'text', 'visio.q.motivacions', 4, 'Mos dròlles aprenon l’occitan', 'Mes enfants apprennent l’occitan', 'Mis hijas e hijos aprenden occitano', 'My children are learning Occitan', 'Els meus fills i filles aprenen occità', null, null, true),
	('visio.q.motivacions.m5', 'visio', 'text', 'visio.q.motivacions', 5, 'Lo trabalh o los estudis', 'Le travail ou les études', 'El trabajo o los estudios', 'Work or studies', 'El treball o els estudis', null, null, true),
	('visio.q.motivacions.m6', 'visio', 'text', 'visio.q.motivacions', 6, 'La curiositat', 'La curiosité', 'La curiosidad', 'Curiosity', 'La curiositat', null, null, true),
	('visio.q.lenga.titol', 'visio', 'text', null, 0, 'Las lengas que parlas', 'Les langues que tu parles', 'Las lenguas que hablas', 'The languages you speak', 'Les llengües que parles', null, null, true),
	('visio.q.lengas.l1', 'visio', 'text', 'visio.q.lengas', 1, 'Français', 'Français', 'Français', 'Français', 'Français', null, null, true),
	('visio.q.lengas.l2', 'visio', 'text', 'visio.q.lengas', 2, 'English', 'English', 'English', 'English', 'English', null, null, true),
	('visio.q.lengas.l3', 'visio', 'text', 'visio.q.lengas', 3, 'Castellano', 'Castellano', 'Castellano', 'Castellano', 'Castellano', null, null, true),
	('visio.q.lengas.l4', 'visio', 'text', 'visio.q.lengas', 4, 'Català', 'Català', 'Català', 'Català', 'Català', null, null, true),
	('visio.q.lengas.l5', 'visio', 'text', 'visio.q.lengas', 5, 'Una autra lenga', 'Une autre langue', 'Otra lengua', 'Another language', 'Una altra llengua', null, null, true),
	('visio.q.luòc.titol', 'visio', 'text', null, 0, 'Ont te tròbas ?', 'Où te trouves-tu ?', '¿Dónde te encuentras?', 'Where are you based?', 'On et trobes?', null, null, true),
	('visio.q.luòc.exemple', 'visio', 'text', null, 0, 'Vila, país', 'Ville, pays', 'Ciudad, país', 'City, country', 'Ciutat, país', null, null, true),
	('visio.q.ritme.titol', 'visio', 'text', null, 0, 'Çò que cercas', 'Ce que tu cherches', 'Lo que buscas', 'What you’re looking for', 'El que busques', null, null, true),
	('visio.q.ritmes.r1', 'visio', 'text', 'visio.q.ritmes', 1, 'Un cors d’ensag, per veire', 'Un cours d’essai, pour voir', 'Una clase de prueba, para ver', 'A trial lesson, to see how it goes', 'Una classe de prova, per veure', null, null, true),
	('visio.q.ritmes.r2', 'visio', 'text', 'visio.q.ritmes', 2, 'Un cors per setmana', 'Un cours par semaine', 'Una clase por semana', 'One lesson a week', 'Una classe per setmana', null, null, true),
	('visio.q.ritmes.r3', 'visio', 'text', 'visio.q.ritmes', 3, 'Mai d’un cors per setmana', 'Plus d’un cours par semaine', 'Más de una clase por semana', 'More than one lesson a week', 'Més d’una classe per setmana', null, null, true),
	('visio.q.axe.titol', 'visio', 'text', null, 0, 'Çò que t’agradariá mai', 'Ce qui te plairait le plus', 'Lo que más te gustaría', 'What you’d enjoy most', 'El que més t’agradaria', null, null, true),
	('visio.q.axes.a1', 'visio', 'text', 'visio.q.axes', 1, 'Parlar', 'Parler', 'Hablar', 'Speaking', 'Parlar', null, null, true),
	('visio.q.axes.a2', 'visio', 'text', 'visio.q.axes', 2, 'La gramatica', 'La grammaire', 'La gramática', 'Grammar', 'La gramàtica', null, null, true),
	('visio.q.axes.a3', 'visio', 'text', 'visio.q.axes', 3, 'La cultura', 'La culture', 'La cultura', 'Culture', 'La cultura', null, null, true),
	('visio.q.axes.a4', 'visio', 'text', 'visio.q.axes', 4, 'Legir e escriure', 'Lire et écrire', 'Leer y escribir', 'Reading and writing', 'Llegir i escriure', null, null, true),
	('visio.q.messatge', 'visio', 'text', null, 0, 'Quicòm mai de me dire ?', 'Autre chose à me dire ?', '¿Algo más que quieras decirme?', 'Anything else you’d like to tell me?', 'Alguna cosa més que vulguis dir-me?', null, null, true),
	('visio.q.mandar', 'visio', 'text', null, 0, 'Mandar e causir una ora', 'Envoyer et choisir une heure', 'Enviar y elegir una hora', 'Send and pick a time', 'Enviar i triar una hora', null, null, true),
	('visio.q.mercé', 'visio', 'text', null, 0, 'Mercé ! Ai recebut tas responsas. Ara, causís ton ora :', 'Merci ! J’ai bien reçu tes réponses. Maintenant, choisis ton heure :', '¡Gracias! He recibido tus respuestas. Ahora, elige tu hora:', 'Thank you! I’ve received your answers. Now, pick your time:', 'Gràcies! He rebut les teves respostes. Ara, tria l’hora:', null, null, true),
	('visio.q.sens', 'visio', 'text', null, 0, 'Causir una ora sens respondre', 'Choisir une heure sans répondre', 'Elegir una hora sin responder', 'Pick a time without answering', 'Triar una hora sense respondre', null, null, true),
	('visio.q.avís', 'visio', 'text', null, 0, 'Tas responsas me son mandadas per corrièl, per preparar lo cors. Lo site ne garda pas cap de còpia.', 'Tes réponses me sont envoyées par courriel, pour préparer le cours. Le site n’en garde aucune copie.', 'Tus respuestas me llegan por correo electrónico, para preparar la clase. El sitio no guarda ninguna copia.', 'Your answers are sent to me by email, to prepare the lesson. The site keeps no copy.', 'Les teves respostes m’arriben per correu electrònic, per preparar la classe. El web no en guarda cap còpia.', null, null, true),
	('istoria.kicker', 'istoria', 'text', null, 0, 'Lo Ligam', 'Lo Ligam', 'Lo Ligam', 'Lo Ligam', 'Lo Ligam', null, null, true),
	('istoria.titol', 'istoria', 'text', null, 0, 'Mon ligam amb l’occitan', 'Mon lien avec l’occitan', 'Mi vínculo con el occitano', 'My connection to Occitan', 'El meu vincle amb l’occità', null, null, true),
	('istoria.chapèu', 'istoria', 'text', null, 0, '', 'Je m''appelle Romain Périer. Je suis né à Montpellier en 1994, d''un père né à Paris et d''une mère née à Clermont-l''Hérault.', 'Me llamo Romain Périer. Nací en Montpelhièr en 1994, de un padre nacido en París y de una madre nacida en Clarmont d’Erau.', 'My name is Romain Périer. I was born in Montpelhièr in 1994, to a father born in Paris and a mother born in Clarmont d’Erau.', 'Em dic Romain Périer. Vaig néixer a Montpelhièr el 1994, d’un pare nascut a París i d’una mare nascuda a Clarmont d’Erau.', null, null, true),
	('istoria.retrat', 'istoria', 'imatge', null, 0, null, null, null, null, null, null, '{"url":"/acuelh/romain.webp","largor":600,"nautor":620,"alt_oc":"","alt_fr":""}'::jsonb, true),
	('istoria.capitols.c1', 'istoria', 'bloc', 'istoria.capitols', 1, null, null, null, null, null, null, null, true),
	('istoria.capitols.c1.titol', 'istoria', 'text', 'istoria.capitols.c1', 0, 'Una lenga sens nom', 'Une langue sans nom', 'Una lengua sin nombre', 'A language without a name', 'Una llengua sense nom', null, null, true),
	('istoria.capitols.c1.tèxt', 'istoria', 'text', 'istoria.capitols.c1', 0, 'Soi crescut dins un mitan ont se parlava francés, sens aver consciéncia de la lenga pendent fòrça temps. Del costat de ma maire, i aviá totjorn de mots que compreniái pas. Quand la familha s’acampava, amb mos grands, mos oncles e mos cosins, i aviá totjorn aquela part del vocabulari que compreniái pas e que se nomenava pas. Ausissiái lo mot « patés », mas sens cap de ligam amb una lenga.', 'J''ai grandi dans un environnement francophone, sans conscience de la langue pendant très longtemps. Il y a toujours eu des mots que je ne comprenais pas du côté de ma mère. Aux réunions de famille, avec mes grands-parents, mes oncles, mes cousins, il y avait toujours cette part de vocabulaire que je ne comprenais pas, et qui n''était pas nommée. J''entendais le mot « patois », mais sans aucun lien avec une langue.', 'Crecí en un entorno francófono, sin ser consciente de la lengua durante mucho tiempo. Siempre hubo palabras que no entendía del lado de mi madre. En las reuniones familiares, con mis abuelos, mis tíos, mis primos, siempre había esa parte de vocabulario que no entendía y que no tenía nombre. Oía la palabra «patois», pero sin ninguna relación con una lengua.', 'I grew up in a French-speaking environment, with no awareness of the language for a very long time. There were always words I didn’t understand on my mother’s side. At family gatherings, with my grandparents, my uncles, my cousins, there was always this part of the vocabulary that I didn’t understand, and that wasn’t named. I would hear the word ‘patois’, but with no connection to a language.', 'Vaig créixer en un entorn francòfon, sense tenir consciència de la llengua durant molt de temps. Sempre hi va haver paraules que no entenia per la banda de la meva mare. A les reunions familiars, amb els meus avis, els meus oncles, els meus cosins, sempre hi havia aquesta part del vocabulari que no entenia i que no tenia nom. Sentia la paraula «patois», però sense cap relació amb una llengua.', null, null, true),
	('istoria.capitols.c2', 'istoria', 'bloc', 'istoria.capitols', 2, null, null, null, null, null, null, null, true),
	('istoria.capitols.c2.titol', 'istoria', 'text', 'istoria.capitols.c2', 0, 'Montpelhièr, una vila « sens istòria » ?', 'Montpellier, une ville « sans histoire » ?', 'Montpelhièr, ¿una ciudad «sin historia»?', 'Montpelhièr, a city ‘with no history’?', 'Montpelhièr, una ciutat «sense història»?', null, null, true),
	('istoria.capitols.c2.tèxt', 'istoria', 'text', 'istoria.capitols.c2', 0, 'Soi crescut plan estacat a ma region e a ma vila, Montpelhièr. Me soi passionat per son istòria, e me soi totjorn estonat quand las gents disián qu’aicí i aviá pas d’istòria. Ieu meteis, o ai pogut creire : l’accent s’es un pauc perdut, i a pas de comunautat fòrça marcada, tant la vila s’es agrandida (e es una bona causa). Mas tot s’es tanben estandardizat, e las traças istoricas e l’identitat montpelhierenca se son escafadas.', 'J''ai grandi avec un profond attachement à ma région et à ma ville, Montpellier. Je me suis passionné pour son histoire, et je me suis toujours étonné quand les gens disaient qu''il n''y avait pas d''histoire ici. Moi-même, j''ai pu le croire : l''accent s''est un peu perdu, il n''y a pas de communauté très marquée tant la ville s''est agrandie (ce qui est une bonne chose). Mais il y a aussi eu un processus de standardisation qui a fait que les traces historiques et l''identité montpelliéraine se sont effacées.', 'Crecí con un profundo apego a mi región y a mi ciudad, Montpelhièr. Me apasioné por su historia y siempre me sorprendía cuando la gente decía que aquí no había historia. Yo mismo llegué a creerlo: el acento se ha ido perdiendo un poco y no hay una comunidad muy marcada, de tanto como ha crecido la ciudad (lo cual es algo bueno). Pero también hubo un proceso de estandarización por el que las huellas históricas y la identidad de Montpelhièr se fueron borrando.', 'I grew up with a deep attachment to my region and to my city, Montpelhièr. I became passionate about its history, and I was always surprised when people said there was no history here. I myself used to believe it: the accent has been partly lost, and there is no very distinct community, because the city has grown so much (which is a good thing). But there was also a process of standardisation which meant that the historical traces and Montpelhièr’s identity faded away.', 'Vaig créixer amb un profund afecte per la meva regió i per la meva ciutat, Montpelhièr. Em vaig apassionar per la seva història, i sempre em sorprenia que la gent digués que aquí no hi havia història. Jo mateix vaig arribar a creure-ho: l’accent s’ha anat perdent una mica, no hi ha una comunitat gaire marcada de tan com ha crescut la ciutat (cosa que és bona). Però també hi va haver un procés d’estandardització pel qual les traces històriques i la identitat de Montpelhièr es van esborrar.', null, null, true),
	('istoria.capitols.c3', 'istoria', 'bloc', 'istoria.capitols', 3, null, null, null, null, null, null, null, true),
	('istoria.capitols.c3.titol', 'istoria', 'text', 'istoria.capitols.c3', 0, 'Lo revelh : Valéncia, 2015', 'Le déclic : Valence, 2015', 'El detonante: Valencia, 2015', 'The spark: Valencia, 2015', 'El detonant: València, 2015', null, null, true),
	('istoria.capitols.c3.tèxt', 'istoria', 'text', 'istoria.capitols.c3', 0, 'En 2015, anèri viure en Espanha, a Valéncia, per un Erasmus, e i descobriguèri la lenga valenciana. A un autre estatut que l’occitan en França : la vesèm pertot dins l’espaci public, e fòrça monde la parla. En m’aprochant d’un grop que parlava valencian, prenguèri consciéncia de l’enjòc lingüistic e del debat que suscita, encara mai fòrt en Catalonha qu’a Valéncia. Comprenguèri qu’aquela lenga semblava a la mieuna, e visquèri la situacion d’una lenga mesa de caire.', 'C''est en allant vivre en Espagne, à Valence, en 2015 pour un Erasmus, que j''ai découvert la langue valencienne. Elle a un autre statut que l''occitan en France : on la voit partout dans l''espace public, on entend beaucoup de gens la parler. En me rapprochant d''un groupe qui parlait valencien, j''ai pris conscience de l''enjeu linguistique et du débat qui l''entoure, encore plus fort en Catalogne qu''à Valence. J''ai compris que cette langue ressemblait à la mienne, et j''ai vécu la situation d''une langue minorisée.', 'Fue al irme a vivir a España, a Valencia, en 2015 para hacer un Erasmus, cuando descubrí la lengua valenciana. Tiene un estatus distinto al del occitano en Francia: se ve por todas partes en el espacio público y se oye hablar a mucha gente. Al acercarme a un grupo que hablaba valenciano, tomé conciencia de lo que está en juego en lo lingüístico y del debate que la rodea, todavía más intenso en Cataluña que en Valencia. Comprendí que esa lengua se parecía a la mía, y viví la situación de una lengua minorizada.', 'It was when I went to live in Spain, in Valencia, in 2015 for an Erasmus exchange that I discovered the Valencian language. It has a different status from Occitan in France: you see it everywhere in public spaces, and you hear a lot of people speaking it. By getting closer to a group that spoke Valencian, I became aware of the linguistic stakes and of the debate surrounding it, even more intense in Catalonia than in Valencia. I understood that this language resembled mine, and I experienced the situation of a minoritised language.', 'Va ser en anar a viure a Espanya, a València, el 2015 per fer un Erasmus, que vaig descobrir la llengua valenciana. Té un estatus diferent del de l’occità a França: es veu arreu a l’espai públic i se sent parlar molta gent. En acostar-me a un grup que parlava valencià, vaig prendre consciència de la qüestió lingüística i del debat que l’envolta, encara més fort a Catalunya que a València. Vaig comprendre que aquesta llengua s’assemblava a la meva, i vaig viure la situació d’una llengua minoritzada.', null, null, true),
	('istoria.capitols.c4', 'istoria', 'bloc', 'istoria.capitols', 4, null, null, null, null, null, null, null, true),
	('istoria.capitols.c4.titol', 'istoria', 'text', 'istoria.capitols.c4', 0, 'Lo retorn : la riquesa jos mos pès', 'Le retour : la richesse sous mes pieds', 'El regreso: la riqueza bajo mis pies', 'The return: the richness beneath my feet', 'El retorn: la riquesa sota els meus peus', null, null, true),
	('istoria.capitols.c4.tèxt', 'istoria', 'text', 'istoria.capitols.c4', 0, 'Quand tornèri en França, me passionèri per l’occitan e prenguèri consciéncia de la riquesa qu’èra jos mos pès e que vesiái pas. D’aquí comencèt tot un camin per me tornar apropriar la lenga.', 'C''est en rentrant en France que je me suis passionné pour l''occitan, et que j''ai pris conscience de la richesse qui était sous mes pieds et que je ne voyais pas. De là a commencé tout un parcours de réappropriation de la langue.', 'Fue al volver a Francia cuando me apasioné por el occitano y tomé conciencia de la riqueza que tenía bajo mis pies y que no veía. De ahí empezó todo un recorrido de reapropiación de la lengua.', 'It was on returning to France that I became passionate about Occitan, and realised the richness that lay beneath my feet and that I could not see. From there began a whole journey of reclaiming the language.', 'Va ser en tornar a França que em vaig apassionar per l’occità i que vaig prendre consciència de la riquesa que tenia sota els peus i que no veia. D’aquí va començar tot un recorregut de reapropiació de la llengua.', null, null, true),
	('istoria.capitols.c5', 'istoria', 'bloc', 'istoria.capitols', 5, null, null, null, null, null, null, null, true),
	('istoria.capitols.c5.titol', 'istoria', 'text', 'istoria.capitols.c5', 0, 'Aprene tot sol', 'Apprendre seul', 'Aprender en solitario', 'Learning on my own', 'Aprendre en solitari', null, null, true),
	('istoria.capitols.c5.tèxt', 'istoria', 'text', 'istoria.capitols.c5', 0, 'D’en primièr, sabiái pas per ont començar : i a pas de guida oficial, l’informacion es esparpalhada. Faguèri mon pichon camin en començant pel libre Assimil, un libre plan bon, mas ont me soi fòrça perdut : tantas excepcions, una lenga que semblava tan complicada que gaireben abandonèri. A la fin, tenguèri bon. Pauc a pauc, comencèri de m’exprimir en occitan e de rescontrar de monde dins aquela lenga.', 'Au début, je ne savais pas par où commencer : il n''y a pas de guide officiel, l''information est disparate. J''ai fait mon petit chemin en commençant par le livre Assimil, un livre super, mais où je me suis beaucoup perdu : tant d''exceptions, une langue qui semblait si compliquée que j''ai presque abandonné. Finalement, j''ai tenu. Au fur et à mesure, j''ai commencé à pouvoir m''exprimer en occitan et à rencontrer du monde dans cette langue.', 'Al principio no sabía por dónde empezar: no hay una guía oficial y la información está dispersa. Fui haciendo mi pequeño camino empezando por el libro de Assimil, un libro estupendo, pero en el que me perdí mucho: tantas excepciones, una lengua que parecía tan complicada que casi lo dejo. Al final, aguanté. Poco a poco, empecé a poder expresarme en occitano y a conocer gente en esa lengua.', 'At the beginning, I didn’t know where to start: there is no official guide, and the information is scattered. I made my own way, starting with the Assimil book, a great book, but one in which I got very lost: so many exceptions, a language that seemed so complicated that I almost gave up. In the end, I stuck with it. Little by little, I started to be able to express myself in Occitan and to meet people in that language.', 'Al principi no sabia per on començar: no hi ha cap guia oficial i la informació és dispersa. Vaig fer el meu petit camí començant pel llibre d’Assimil, un llibre fantàstic, però en què em vaig perdre molt: tantes excepcions, una llengua que semblava tan complicada que gairebé ho vaig deixar. Al final, vaig aguantar. A poc a poc, vaig començar a poder expressar-me en occità i a conèixer gent en aquesta llengua.', null, null, true),
	('istoria.capitols.c6', 'istoria', 'bloc', 'istoria.capitols', 6, null, null, null, null, null, null, null, true),
	('istoria.capitols.c6.titol', 'istoria', 'text', 'istoria.capitols.c6', 0, 'Tornar trobar los mots de la familha', 'Retrouver les mots de la famille', 'Recuperar las palabras de la familia', 'Finding the family’s words again', 'Recuperar les paraules de la família', null, null, true),
	('istoria.capitols.c6.tèxt', 'istoria', 'text', 'istoria.capitols.c6', 0, 'Poguèri tornar far de questions a ma familha suls mots occitans, començar de los reculhir, far de ligams, e comprene que de mots qu’emplegavi ja cada jorn èran d’occitan.

Foguèri urós de me poder tornar ligar amb mon papet a l’entorn de l’occitan. El meteis aviá de mal a l’apelar « occitan ». Al començament, quand m’i interessèri, èra un pauc estonat, e aviá un pauc vergonha : disiá que parlava pas lo vertadièr occitan, qu’èra de patés. Mas al cap d’un moment, sentiái que se daissava anar, que començava de dire de frasas, de nos tornar contar d’istòrias en occitan. Soi plan urós d’aver pogut parlar amb el de tot aquò fins a la fin de sa vida. Nos a quitats en 2023.', 'J''ai pu reposer des questions à ma famille sur les mots en occitan, commencer à les recueillir, faire des liens, et comprendre que des mots que j''utilisais déjà tous les jours étaient de l''occitan.

J''ai été heureux de pouvoir me reconnecter avec mon papy autour de l''occitan. Lui-même avait du mal à l''appeler « occitan ». Il était un peu interloqué au début, quand je m''y suis intéressé, et il avait un peu honte : il disait qu''il ne parlait pas le vrai occitan, que c''était du patois. Mais au bout d''un moment, je sentais qu''il se décoinçait, qu''il commençait à dire des phrases, à nous raconter de nouveau des histoires en occitan. Je suis très heureux d''avoir pu échanger avec lui sur tout ça jusqu''à la fin de sa vie. Il nous a quittés en 2023.', 'Pude volver a hacerle preguntas a mi familia sobre las palabras en occitano, empezar a recogerlas, hacer conexiones y comprender que palabras que ya usaba todos los días eran occitano.

Me alegró mucho poder reconectar con mi abuelo a través del occitano. A él mismo le costaba llamarlo «occitano». Al principio estaba un poco desconcertado cuando me interesé por ello, y sentía un poco de vergüenza: decía que no hablaba el verdadero occitano, que era «patois». Pero al cabo de un rato notaba que se soltaba, que empezaba a decir frases, a contarnos de nuevo historias en occitano. Estoy muy feliz de haber podido conversar con él sobre todo esto hasta el final de su vida. Nos dejó en 2023.', 'I was able to ask my family questions again about the words in Occitan, to start collecting them, to make connections, and to understand that words I was already using every day were Occitan.

I was happy to be able to reconnect with my grandad through Occitan. He himself found it hard to call it ‘Occitan’. He was a little taken aback at first, when I took an interest, and he felt a little ashamed: he said he didn’t speak real Occitan, that it was ‘patois’. But after a while, I could feel him loosening up, starting to say sentences, telling us stories in Occitan again. I am very happy to have been able to talk with him about all of this until the end of his life. He passed away in 2023.', 'Vaig poder tornar a fer preguntes a la meva família sobre les paraules en occità, començar a recollir-les, fer connexions i comprendre que paraules que ja feia servir cada dia eren occità.

Vaig estar content de poder reconnectar amb el meu avi a través de l’occità. Ell mateix tenia dificultats per anomenar-lo «occità». Al principi estava una mica desconcertat, quan m’hi vaig interessar, i sentia una mica de vergonya: deia que no parlava el veritable occità, que era «patois». Però al cap d’una estona notava que es deixava anar, que començava a dir frases, a tornar-nos a explicar històries en occità. Estic molt content d’haver pogut parlar amb ell de tot això fins al final de la seva vida. Ens va deixar el 2023.', null, null, true),
	('istoria.espelida.titol', 'istoria', 'text', null, 0, 'L’espelida del Ligam', 'La naissance du Ligam', 'El nacimiento de Lo Ligam', 'The birth of Lo Ligam', 'El naixement de Lo Ligam', null, null, true),
	('istoria.espelida.c1', 'istoria', 'bloc', 'istoria.espelida', 1, null, null, null, null, null, null, null, true),
	('istoria.espelida.c1.titol', 'istoria', 'text', 'istoria.espelida.c1', 0, 'Espelida del Ligam (2022)', 'Naissance du Ligam (2022)', 'Nacimiento de Lo Ligam (2022)', 'Birth of Lo Ligam (2022)', 'Naixement de Lo Ligam (2022)', null, null, true),
	('istoria.espelida.c1.tèxt', 'istoria', 'text', 'istoria.espelida.c1', 0, 'En 2022, me lancèri, sens tròp saber perqué, dins un compte Instagram. Èra l’escasença : un traductor automatic, Revirada, veniá d’èsser publicat amb una aisina de votz, Vòtz. Aquò me donèt enveja de publicar de polidas illustracions amb de mots simples : lo cèl, la montanha, los aucèls.

D’en primièr, metiái la votz automatica, perque gausavi pas parlar. Puèi, pauc a pauc, m’i faguèri : de publicacions sus diferentas tematicas, d’animacions de mai en mai trabalhadas, amb Canva coma aisina principala. Aquò interessèt qualques personas al començament, e m’esperavi pas a un tal succès. Aquò m’encoratgèt a contunhar.

L’idèa, es d’aprene al meteis temps que partegi. Me presenti pas coma un guida suprèm o un mèstre de la lenga, mas coma un aprendís qu’a pas paur de far d’errors e qu’ensaja d’aprene al melhor una lenga qu’adòra. Tot aquò a menat a una comunautat de mantun milièr de personas.', 'En 2022, je me suis lancé, sans trop savoir pourquoi, dans un compte Instagram. J''ai saisi l''occasion d''un traducteur automatique, Revirada, qui venait d''être publié avec un générateur de voix, Vòtz. Ça m''a donné envie de publier de jolies illustrations avec des mots simples : le ciel, la montagne, les oiseaux.

Au début, je mettais la voix automatique, parce que je n''osais pas parler. Puis, au fur et à mesure, j''ai pris le coup : des publications sur différentes thématiques, des animations de plus en plus travaillées, avec Canva comme outil principal. Ça a intéressé quelques personnes au début, et je ne m''attendais pas à ce que ça marche aussi bien. Ça m''a encouragé à continuer.

L''idée, c''est d''apprendre en même temps que je partage. Je ne me présente pas comme un guide suprême ou un maître de la langue, mais comme un apprenti qui n''a pas peur de faire des erreurs et qui essaie d''apprendre au mieux une langue qu''il adore. Tout ça a mené à une communauté de plusieurs milliers de personnes.', 'En 2022, me lancé, sin saber muy bien por qué, con una cuenta de Instagram. Aproveché la ocasión de un traductor automático, Revirada, que acababa de publicarse con un generador de voz, Vòtz. Eso me dio ganas de publicar ilustraciones bonitas con palabras sencillas: el cielo, la montaña, los pájaros.

Al principio ponía la voz automática, porque no me atrevía a hablar. Luego, poco a poco, fui adquiriendo soltura: publicaciones sobre distintas temáticas, animaciones cada vez más trabajadas, con Canva como herramienta principal. Al principio interesó a unas pocas personas, y no esperaba que funcionara tan bien. Eso me animó a seguir.

La idea es aprender al mismo tiempo que comparto. No me presento como un guía supremo ni como un maestro de la lengua, sino como un aprendiz que no tiene miedo de cometer errores y que intenta aprender lo mejor posible una lengua que adora. Todo eso ha dado lugar a una comunidad de varios miles de personas.', 'In 2022, I launched into an Instagram account, without really knowing why. I seized the opportunity of an automatic translator, Revirada, which had just been released together with a voice generator, Vòtz. It made me want to publish pretty illustrations with simple words: the sky, the mountain, the birds.

At first, I used the automatic voice, because I didn’t dare to speak. Then, little by little, I got the hang of it: posts on different themes, more and more elaborate animations, with Canva as my main tool. It interested a few people at first, and I didn’t expect it to work so well. That encouraged me to carry on.

The idea is to learn at the same time as I share. I don’t present myself as a supreme guide or a master of the language, but as a learner who isn’t afraid of making mistakes and who tries to learn as well as he can a language he adores. All of this has led to a community of several thousand people.', 'El 2022 em vaig llançar, sense saber gaire per què, en un compte d’Instagram. Vaig aprofitar l’ocasió d’un traductor automàtic, Revirada, que acabava de publicar-se amb un generador de veu, Vòtz. Això em va fer venir ganes de publicar il·lustracions boniques amb paraules senzilles: el cel, la muntanya, els ocells.

Al principi posava la veu automàtica, perquè no gosava parlar. Després, a poc a poc, hi vaig agafar el truc: publicacions sobre diferents temàtiques, animacions cada cop més treballades, amb Canva com a eina principal. Al principi va interessar unes quantes persones, i no m’esperava que anés tan bé. Això em va animar a continuar.

La idea és aprendre alhora que comparteixo. No em presento com un guia suprem ni com un mestre de la llengua, sinó com un aprenent que no té por de cometre errors i que intenta aprendre el millor possible una llengua que adora. Tot això ha portat a una comunitat de diversos milers de persones.', null, null, true),
	('istoria.espelida.c2', 'istoria', 'bloc', 'istoria.espelida', 2, null, null, null, null, null, null, null, true),
	('istoria.espelida.c2.titol', 'istoria', 'text', 'istoria.espelida.c2', 0, 'Uèi', 'Aujourd''hui', 'Hoy', 'Today', 'Avui', null, null, true),
	('istoria.espelida.c2.tèxt', 'istoria', 'text', 'istoria.espelida.c2', 0, 'Uèi, ai enveja de passar a una etapa superiora : ensenhar vertadièrament çò qu’ai aprés, partejar ma vision de la realitat occitana d’ara en França, dins sa complexitat, e subretot crear un espaci d’escambi.', 'Aujourd''hui, j''ai envie de passer à un stade supérieur : enseigner vraiment ce que j''ai appris, partager ma vision de la réalité occitane en France aujourd''hui, dans sa complexité, et surtout créer un espace d''échange.', 'Hoy tengo ganas de pasar a una etapa superior: enseñar de verdad lo que he aprendido, compartir mi visión de la realidad occitana en Francia hoy, en su complejidad, y sobre todo crear un espacio de intercambio.', 'Today, I want to move up to the next stage: to really teach what I have learned, to share my vision of the Occitan reality in France today, in all its complexity, and above all to create a space for exchange.', 'Avui tinc ganes de passar a una etapa superior: ensenyar de debò el que he après, compartir la meva visió de la realitat occitana a França avui, en la seva complexitat, i sobretot crear un espai d’intercanvi.', null, null, true),
	('istoria.contacte.titol', 'istoria', 'text', null, 0, 'Escambiem', 'Échangeons', 'Intercambiemos ideas', 'Let’s exchange ideas', 'Intercanviem idees', null, null, true),
	('istoria.contacte.tèxt', 'istoria', 'text', null, 0, 'Una question, un cors, una idèa ? Escriu-me, te respondrai.', 'Une question, un cours, une idée ? Écris-moi, je te répondrai.', '¿Una pregunta, una clase, una idea? Escríbeme, te responderé.', 'A question, a lesson, an idea? Write to me and I’ll reply.', 'Una pregunta, una classe, una idea? Escriu-me, et respondré.', null, null, true),
	('istoria.contacte.reservar', 'istoria', 'ligam', null, 0, 'Reservar un cors en visio', 'Réserver un cours en visio', 'Reservar una clase por videollamada', 'Book a video lesson', 'Reservar una classe per videotrucada', 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=', null, true),
	('amassa.titol', 'amassa', 'text', null, 0, 'Amassa', 'Rassemble', 'Reúne', 'Gather', 'Reuneix', null, null, true),
	('amassa.frasa', 'amassa', 'text', null, 0, 'A escriure : ta frasa sus Amassa', 'À écrire : ta phrase sur Rassemble', null, null, null, null, null, false),
	('amassa.teulas.grops', 'amassa', 'bloc', 'amassa.teulas', 1, null, null, null, null, null, null, null, true),
	('amassa.teulas.grops.ligam', 'amassa', 'ligam', 'amassa.teulas.grops', 0, 'Grops', 'Groupes', 'Grupos', 'Groups', 'Grups', '/grops', null, true),
	('amassa.teulas.grops.sota', 'amassa', 'text', 'amassa.teulas.grops', 0, 'Rencontrar d’autras personas que parlan occitan, prèp de tu o en linha.', 'Rencontrer d’autres personnes qui parlent occitan, près de chez toi ou en ligne.', 'Conoce a otras personas que hablan occitano, cerca de ti o en línea.', 'Meet other people who speak Occitan, near you or online.', 'Coneix altres persones que parlen occità, a prop teu o en línia.', null, null, true),
	('amassa.teulas.cercles', 'amassa', 'bloc', 'amassa.teulas', 2, null, null, null, null, null, null, null, true),
	('amassa.teulas.cercles.ligam', 'amassa', 'ligam', 'amassa.teulas.cercles', 0, 'Cercles e associacions', 'Cercles et associations', 'Círculos y asociaciones', 'Circles and associations', 'Cercles i associacions', '/carta', null, true),
	('amassa.teulas.cercles.sota', 'amassa', 'text', 'amassa.teulas.cercles', 0, 'Las associacions occitanas, sus la carta.', 'Les associations occitanes, sur la carte.', 'Las asociaciones occitanas, en el mapa.', 'Occitan associations, on the map.', 'Les associacions occitanes, al mapa.', null, null, true),
	('amassa.teulas.forum', 'amassa', 'bloc', 'amassa.teulas', 3, null, null, null, null, null, null, null, true),
	('amassa.teulas.forum.ligam', 'amassa', 'ligam', 'amassa.teulas.forum', 0, 'Fòrum', 'Forum', 'Foro', 'Forum', 'Fòrum', '/forum', null, true),
	('amassa.teulas.forum.sota', 'amassa', 'text', 'amassa.teulas.forum', 0, 'S’ajudar per aprene.', 'S’entraider pour apprendre.', 'Ayudarse a aprender.', 'Helping each other learn.', 'Ajudar-se a aprendre.', null, null, true),
	('amassa.teulas.ideas', 'amassa', 'bloc', 'amassa.teulas', 4, null, null, null, null, null, null, null, true),
	('amassa.teulas.ideas.ligam', 'amassa', 'ligam', 'amassa.teulas.ideas', 0, 'Boita d’idèas', 'Boîte à idées', 'Buzón de ideas', 'Idea box', 'Bústia d’idees', '/ideas', null, true),
	('amassa.teulas.ideas.sota', 'amassa', 'text', 'amassa.teulas.ideas', 0, 'Per melhorar Lo Ligam amb tu.', 'Pour améliorer Lo Ligam avec toi.', 'Para mejorar Lo Ligam contigo.', 'To improve Lo Ligam with you.', 'Per millorar Lo Ligam amb tu.', null, null, true),
	('amassa.teulas.instagram', 'amassa', 'bloc', 'amassa.teulas', 5, null, null, null, null, null, null, null, true),
	('amassa.teulas.instagram.ligam', 'amassa', 'ligam', 'amassa.teulas.instagram', 0, 'Instagram', 'Instagram', 'Instagram', 'Instagram', 'Instagram', 'https://www.instagram.com/lo_ligam/', null, true),
	('amassa.teulas.instagram.sota', 'amassa', 'text', 'amassa.teulas.instagram', 0, 'Los visuals de Lo Ligam.', 'Les visuels de Lo Ligam.', 'Las imágenes de Lo Ligam.', 'The visuals of Lo Ligam.', 'Les imatges de Lo Ligam.', null, null, true),
	('ideas.titol', 'ideas', 'text', null, 0, 'Boita d’idèas', 'Boîte à idées', 'Buzón de ideas', 'Idea box', 'Bústia d’idees', null, null, true),
	('ideas.frasa', 'ideas', 'text', null, 0, 'Una idèa per melhorar Lo Ligam ? Escriu-la aquí : las legissi totas.', 'Une idée pour améliorer Lo Ligam ? Écris-la ici : je les lis toutes.', '¿Una idea para mejorar Lo Ligam? Escríbela aquí: las leo todas.', 'An idea to improve Lo Ligam? Write it here: I read them all.', 'Una idea per millorar Lo Ligam? Escriu-la aquí: les llegeixo totes.', null, null, true),
	('ideas.compte', 'ideas', 'text', null, 0, 'Per mandar una idèa, cal un compte : es gratuit.', 'Pour envoyer une idée, il faut un compte : c’est gratuit.', 'Para enviar una idea hace falta una cuenta: es gratuita.', 'To send an idea, you need an account: it’s free.', 'Per enviar una idea cal un compte: és gratuït.', null, null, true),
	('ideas.mercé', 'ideas', 'text', null, 0, 'Mercé ! Ton idèa es plan arribada.', 'Merci ! Ton idée est bien arrivée.', '¡Gracias! Tu idea ha llegado bien.', 'Thank you! Your idea has arrived safely.', 'Gràcies! La teva idea ha arribat bé.', null, null, true),
	('ideas.avís', 'ideas', 'text', null, 0, 'Soi lo sol a legir las idèas, sens saber qual las manda. Las pòdes suprimir quand vòles.', 'Je suis seul à lire les idées, sans savoir qui les envoie. Tu peux les supprimer quand tu veux.', 'Solo yo leo las ideas, sin saber quién las envía. Puedes eliminarlas cuando quieras.', 'Only I read the ideas, without knowing who sends them. You can delete them whenever you like.', 'Només jo llegeixo les idees, sense saber qui les envia. Les pots suprimir quan vulguis.', null, null, true),
	('grops.acuelh', 'grops', 'text', null, 0, 'Aquí parlam occitan coma podèm, amb las fautas. Totas las lengas son benvengudas : çò que compta, es l’escambi.', 'Ici on parle occitan comme on peut, avec les fautes. Toutes les langues sont bienvenues : ce qui compte, c’est l’échange.', 'Aquí hablamos occitano como podemos, con errores. Todas las lenguas son bienvenidas: lo que cuenta es el intercambio.', 'Here we speak Occitan as best we can, mistakes and all. All languages are welcome: what matters is the exchange.', 'Aquí parlem occità com podem, amb faltes. Totes les llengües són benvingudes: el que compta és l’intercanvi.', null, null, true),
	('grops.compte', 'grops', 'text', null, 0, 'Per rejónher un grop, cal un compte amb una adreça verificada : es gratuit.', 'Pour rejoindre un groupe, il faut un compte avec une adresse vérifiée : c’est gratuit.', 'Para unirte a un grupo hace falta una cuenta con una dirección verificada: es gratuita.', 'To join a group, you need an account with a verified address: it’s free.', 'Per unir-te a un grup cal un compte amb una adreça verificada: és gratuït.', null, null, true),
	('grops.pseudo', 'grops', 'text', null, 0, 'Los autres membres veson ton pseudonim, pas jamai ton adreça.', 'Les autres membres voient ton pseudo, jamais ton adresse.', 'Los demás miembros ven tu seudónimo, nunca tu dirección.', 'Other members see your nickname, never your address.', 'Els altres membres veuen el teu pseudònim, mai la teva adreça.', null, null, true),
	('grops.lèu', 'grops', 'text', null, 0, 'Los grops dobriràn lèu. Un pauc de paciéncia !', 'Les groupes ouvriront bientôt. Un peu de patience !', 'Los grupos abrirán pronto. ¡Un poco de paciencia!', 'The groups will open soon. A little patience!', 'Els grups obriran aviat. Una mica de paciència!', null, null, true)
on conflict (clau, estat) do nothing;
