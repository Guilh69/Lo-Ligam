-- =============================================================================
-- Lo Ligam : les fiches du contrôle de sécurité (2026-11-06)
-- =============================================================================
-- `npm run verificar:rls` (app/scripts/verificar-rls.mjs) essaie, sans compte,
-- de lire, d'ajouter, de modifier, de supprimer et de publier des fiches. Il
-- lui faut deux fiches à lui : une publiée, une cachée, dans un thème caché.
--
-- Les premières (« _essai… », supabase-admin-schema.sql) ont été effacées par
-- l'import des vraies fiches (supabase-migracion-fichas.sql efface « _essai% »
-- et « _ensag% »). Celles-ci s'appellent « _verrolh… » pour lui échapper.
--
-- Le site ne les montre pas : app/src/lib/data/fichasFont.js écarte toute
-- fiche et tout thème dont le nom commence par « _ ». Dans l'administration
-- (Designs), leur titre dit de ne pas y toucher.
--
-- Rejouable : ne fait rien si elles existent déjà.
-- =============================================================================

insert into
	public.temas (id, oc, fr, ordre, publicat)
values
	('_verrolh', 'Verrolhs', 'Contrôle de sécurité, ne pas toucher', 9999, false)
on conflict (id) do nothing;

insert into
	public.fichas (id, tema_id, titre, mini_url, grand_url, ordre, publicat)
values
	(
		'_verrolh--publicada',
		'_verrolh',
		'Contrôle de sécurité, ne pas toucher (fiche publiée)',
		'/fichas/mini/_verrolh.webp',
		'/fichas/grand/_verrolh.webp',
		9999,
		true
	),
	(
		'_verrolh--rescondida',
		'_verrolh',
		'Contrôle de sécurité, ne pas toucher (fiche cachée)',
		'/fichas/mini/_verrolh.webp',
		'/fichas/grand/_verrolh.webp',
		9999,
		false
	)
on conflict (id) do nothing;
