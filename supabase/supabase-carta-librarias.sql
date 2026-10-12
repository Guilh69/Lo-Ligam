-- Lo Ligam — còla « Librariás occitanas » sur la carte
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-carta-schema.sql a déjà été exécuté.
--
-- CE QUE FAIT CE SCRIPT
-- 1. La table des points (carta_luocs) apprend à porter PLUSIEURS còlas :
--    nouvelle colonne cola_id — les points existants restent des
--    « Luòcs d'interès », les librairies arrivent dans leur pròpria còla.
--    Toute future còla de points (festivals, escòlas…) réutilisera ce
--    mécanisme sans nouvelle table.
-- 2. La còla « Librariás occitanas » est déclarée dans le panèl (carta_colas).
-- 3. Les 8 librairies validées le 2026-08-06 sont semées. Aurillac et Orthez
--    sont NON PUBLIÉES : leur adresse précise reste à confirmer (coordonnées
--    = centre-ville) — à publier depuis /admin/carta/luocs une fois vérifiées.
--
-- Coordonnées géocodées via Nominatim (OpenStreetMap) le 2026-08-06.
-- Textes occitans à valider par Romain (dicodòc) — modifiables dans l'admin.

alter table public.carta_luocs
add column if not exists cola_id text not null default 'lieusInteres';

-- Rattachement à la còla déclarée, pour qu'une faute de frappe soit refusée
-- par la base plutôt que d'invisibiliser un point en silence.
do $$
begin
	if not exists (
		select 1 from pg_constraint
		where conname = 'carta_luocs_cola_fk'
	) then
		alter table public.carta_luocs
		add constraint carta_luocs_cola_fk
		foreign key (cola_id) references public.carta_colas (id)
		on update cascade on delete restrict;
	end if;
end $$;

create index if not exists carta_luocs_cola_ordre_idx on public.carta_luocs (cola_id, ordre);

-- La còla dans le panèl « Jaces ». Teal pour distinguer ses points des
-- luòcs d'interès (or) — couleur modifiable dans /admin/carta.
insert into
	public.carta_colas (
		id,
		label_oc,
		label_fr,
		color,
		opacitat,
		disponible,
		ordre
	)
values
	(
		'librarias',
		'Librariás occitanas',
		'Librairies occitanes',
		'#1f5f63',
		0.9,
		true,
		1
	)
on conflict (id) do nothing;

-- Réordonne le panèl pour glisser les librairies juste après les luòcs.
-- (Purement cosmétique ; ajustable ensuite depuis /admin/carta.)
update public.carta_colas set ordre = 2 where id = 'dialectes' and ordre = 1;
update public.carta_colas set ordre = 3 where id = 'provincias' and ordre = 2;
update public.carta_colas set ordre = 4 where id = 'limsi' and ordre = 3;

-- Les librairies. Liste validée par Romain le 2026-08-06 (dont CIRDÒC et
-- Macarel, cas limites acceptés).
insert into
	public.carta_luocs (
		id,
		cola_id,
		nom_oc,
		nom_fr,
		descripcion_oc,
		descripcion_fr,
		latitud,
		longitud,
		ordre,
		publicat
	)
values
	(
		'libraria-la-tuta-d-oc',
		'librarias',
		'La Tuta d''Òc',
		'La Tuta d''Òc',
		'Librariá associativa de l''IEO 31, al pè de l''Ostal d''Occitània. 11 carrièra Malcousinat.',
		'Librairie associative de l''IEO 31, au pied de l''Ostal d''Occitània. 11 rue Malcousinat.',
		43.60075,
		1.44316,
		0,
		true
	),
	(
		'libraria-occitana-lemotges',
		'librarias',
		'Librariá occitana',
		'Librariá occitana (Limoges)',
		'La librariá de l''IEO Lemosin, dubèrta dempuèi 1984. 42 carrièra Nauta-Vinhana.',
		'La librairie de l''IEO Limousin, ouverte depuis 1984. 42 rue Haute-Vienne.',
		45.82867,
		1.25915,
		1,
		true
	),
	(
		'espaci-occitan-dels-aups',
		'librarias',
		'Espaci Occitan dels Aups',
		'Espaci Occitan dels Aups (Gap)',
		'Librariá associativa de l''IEO 04-05, prèp de 3 000 referéncias. 21 carrièra de l''Imprimariá.',
		'Librairie associative de l''IEO 04-05, près de 3 000 références. 21 rue de l''Imprimerie.',
		44.55945,
		6.07911,
		2,
		true
	),
	(
		'espaci-occitan-droner',
		'librarias',
		'Espaci Occitan',
		'Espaci Occitan (Dronero, Itàlia)',
		'Librariá-botiga e musèu Sòn de Lenga, dins las Valadas Occitanas d''Itàlia. Via Val Maira 19.',
		'Librairie-boutique et musée Sòn de Lenga, dans les Vallées occitanes d''Italie. Via Val Maira 19.',
		44.46577,
		7.34134,
		3,
		true
	),
	(
		'cirdoc-besiers',
		'librarias',
		'CIRDÒC — Institut occitan de cultura',
		'CIRDÒC — Institut occitan de cultura (Béziers)',
		'La granda mediatèca occitana : mai de 80 000 títols. 1 bis baloard Duguesclin.',
		'La grande médiathèque occitane : plus de 80 000 titres. 1 bis boulevard Duguesclin.',
		43.34720,
		3.22304,
		4,
		true
	),
	(
		'macarel-tolosa',
		'librarias',
		'Macarel',
		'Macarel (Toulouse)',
		'Botiga militanta de produches occitans, libres compreses. 13 carrièra del Taur.',
		'Boutique militante de produits occitans, livres compris. 13 rue du Taur.',
		43.60527,
		1.44269,
		5,
		true
	),
	(
		'descobertas-occitanas-orlhac',
		'librarias',
		'Descobèrtas Occitanas — Ostal del Libre',
		'Découvertes Occitanes — Ostal del Libre (Aurillac)',
		'Librariá occitana a l''Ostal del Telh. ⚠ Adreça exacta de confirmar (punt = centre vila).',
		'Librairie occitane à l''Ostal del Telh. ⚠ Adresse exacte à confirmer (point = centre-ville).',
		44.92854,
		2.44331,
		6,
		false
	),
	(
		'per-noste-ortes',
		'librarias',
		'Per Noste',
		'Per Noste (Orthez)',
		'Ostal d''edicion gascon istoric, amb librariá. ⚠ Adreça exacta de confirmar (punt = centre vila).',
		'Maison d''édition gasconne historique, avec librairie. ⚠ Adresse exacte à confirmer (point = centre-ville).',
		43.48750,
		-0.77384,
		7,
		false
	)
on conflict (id) do nothing;


-- GARDE-FOU : la table doit rester protégée exactement comme avant.
do $$
declare
	n int;
begin
	if not exists (
		select 1
		from pg_class c
		join pg_namespace ns on ns.oid = c.relnamespace
		where ns.nspname = 'public' and c.relname = 'carta_luocs' and c.relrowsecurity
	) then
		raise exception 'SEGURETAT : public.carta_luocs es pas protegida per RLS. Tot es anullat.';
	end if;

	select count(*) into n
	from pg_policies where schemaname = 'public' and tablename = 'carta_luocs';
	if n <> 4 then
		raise exception
			'SEGURETAT : public.carta_luocs deuriá aver 4 politicas, ne a %. Tot es anullat.', n;
	end if;

	raise notice 'Còla « librarias » prèsta : % librariás semenadas.', (
		select count(*) from public.carta_luocs where cola_id = 'librarias'
	);
end $$;

select
	id,
	nom_oc,
	publicat
from
	public.carta_luocs
where
	cola_id = 'librarias'
order by
	ordre;
