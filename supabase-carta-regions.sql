-- Lo Ligam — còla « Regions administrativas » sur la carte
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-carta-schema.sql a déjà été exécuté.
--
-- Une seule chose à faire ici : déclarer la còla dans le panèl « Jaces ».
-- Les contours eux-mêmes (13 régions métropolitaines) sont un fichier du
-- site (app/static/data/regions.geojson, source france-geojson / Etalab,
-- Licéncia Dobèrta), chargé à la demande — rien à stocker en base.
-- Couleur et opacité du tracé se règlent ensuite dans /admin/carta.

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
		'regions',
		'Regions administrativas',
		'Régions administratives',
		'#3a2a20',
		0.04,
		true,
		3
	)
on conflict (id) do nothing;

-- Glisse la còla juste après los dialèctes dins lo panèl (cosmetic).
update public.carta_colas set ordre = 4 where id = 'provincias' and ordre = 3;
update public.carta_colas set ordre = 5 where id = 'limsi' and ordre = 4;

select
	ordre,
	id,
	label_oc,
	disponible
from
	public.carta_colas
order by
	ordre;
