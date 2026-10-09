-- Lo Ligam — le site internet des lieux de la carte (librairies d'abord)
-- =============================================================================
-- À coller dans Supabase : SQL Editor → New query → Run. Rejouable.
-- Suppose que supabase-carta-librarias.sql a déjà été exécuté.
--
-- CE QUE FAIT CE SCRIPT (demande de Romain, 2026-10-08)
-- 1. Les points de la carte (carta_luocs) apprennent à porter l'adresse de
--    leur site internet : nouvelle colonne « ligam », vide par défaut,
--    modifiable dans /admin/carta/luocs (champ « Site internet »). Seules les
--    adresses en https:// sont acceptées.
-- 2. Les sites des librairies, trouvés puis vérifiés un à un le 2026-10-08
--    (page ouverte, nom et adresse identiques, site actif).
-- 3. Aurillac et Orthez : leur adresse est confirmée, leurs coordonnées sont
--    recalées sur le point OpenStreetMap de la librairie (elles étaient au
--    centre-ville, à 1,8 km et 450 m). Elles restent NON PUBLIÉES : à publier
--    depuis /admin/carta/luocs quand Romain le décide.
--
-- RIEN N'EST CHANGÉ POUR MACAREL (Toulouse, 13 rue du Taur) : la boutique
-- semble être devenue « Ô Toulouse » (souvenirs), et macarel.org est la
-- boutique en ligne de la marque (Lavelanet), pas ce magasin. À vérifier par
-- téléphone (05 31 98 61 17) ; pour retirer le point de la carte, décommenter
-- la dernière ligne de ce script.

alter table public.carta_luocs
add column if not exists ligam text;

do $$
begin
	if not exists (
		select 1 from pg_constraint
		where conname = 'carta_luocs_ligam_https'
	) then
		alter table public.carta_luocs
		add constraint carta_luocs_ligam_https
		check (ligam is null or ligam ~ '^https://[^[:space:]]+\.[^[:space:]]+$');
	end if;
end $$;

-- Les sites (vérifiés le 2026-10-08)
update public.carta_luocs set ligam = 'https://libraria.latutadoc.com/' where id = 'libraria-la-tuta-d-oc';
update public.carta_luocs set ligam = 'https://www.libraria-occitana.org/' where id = 'libraria-occitana-lemotges';
update public.carta_luocs set ligam = 'https://www.espaci-occitan.com/botiga/fr/' where id = 'espaci-occitan-dels-aups';
update public.carta_luocs set ligam = 'https://www.espaci-occitan.org/' where id = 'espaci-occitan-droner';
update public.carta_luocs set ligam = 'https://www.oc-cultura.eu/services/la-mediateca-beziers/' where id = 'cirdoc-besiers';
update public.carta_luocs set ligam = 'https://www.decouvertes-occitanes.fr/fr/' where id = 'descobertas-occitanas-orlhac';
update public.carta_luocs set ligam = 'https://pernoste.com/librairie' where id = 'per-noste-ortes';

-- Aurillac : Ostal del Telh, 1 rue Jean Moulin (point OpenStreetMap)
update public.carta_luocs set latitud = 44.91801, longitud = 2.42539 where id = 'descobertas-occitanas-orlhac';
-- Orthez : Per Noste, 34 ter place du Foirail (point OpenStreetMap « Per Noste Edicions »)
update public.carta_luocs set latitud = 43.48926, longitud = -0.76899 where id = 'per-noste-ortes';

-- Macarel : à décommenter seulement après vérification
-- update public.carta_luocs set publicat = false where id = 'macarel-tolosa';
