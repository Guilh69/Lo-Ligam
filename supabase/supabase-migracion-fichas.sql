-- Lo Ligam — migration des fiches vers la base
-- =============================================================================
-- FICHIER ENGENDRÉ AUTOMATIQUEMENT — ne pas le modifier à la main.
-- Produit par app/scripts/generar-migracion.mjs à partir de
-- app/src/lib/data/fichas.js le 2026-10-12.
--
-- À coller dans Supabase : SQL Editor → New query → Run.
-- Le script est REJOUABLE : le relancer met simplement les données à jour.
--
-- Contenu : 35 thèmes et 203 fiches.

-- 1) Nettoyage des lignes d'essai laissées par le contrôle de sécurité.
--    Le « \_ » est échappé : dans un LIKE, un « _ » seul signifie
--    « n'importe quel caractère ».
delete from public.fichas where id like '\_essai%' or id like '\_ensag%';

delete from public.temas where id like '\_essai%' or id like '\_ensag%';


-- 2) Les 35 thèmes.
insert into public.temas (id, oc, fr, color, ordre) values
	('entre-cel-e-montanhas', 'Entre cèl e montanhas', 'Entre ciel et montagnes', 'var(--color-terracotta)', 0),
	('sason', 'Sasons', 'Saisons', 'var(--color-teal)', 1),
	('cos-uman', 'Còs uman', 'Corps humain', 'var(--color-gold)', 2),
	('manjam-uei', 'Manjam uèi', 'On mange aujourd’hui', 'var(--color-olive)', 3),
	('pronoms-personals', 'Pronoms personals', 'Pronoms personnels', 'var(--color-sky)', 4),
	('colors-partida-1', 'Colors I', 'Couleurs I', 'var(--color-brick)', 5),
	('colors-partida-2', 'Colors II', 'Couleurs II', 'var(--color-terracotta)', 6),
	('nadal-2022', 'Nadal', 'Noël', 'var(--color-teal)', 7),
	('cap-dan-2022', 'Cap d’an', 'Nouvel an', 'var(--color-gold)', 8),
	('planetas', 'Planetas', 'Planètes', 'var(--color-olive)', 9),
	('meteo', 'Metèo', 'Météo', 'var(--color-sky)', 10),
	('animals', 'Animals', 'Animaux', 'var(--color-brick)', 11),
	('astrologics', 'Astrologia', 'Astrologie', 'var(--color-terracotta)', 12),
	('emocions', 'Emocions', 'Émotions', 'var(--color-teal)', 13),
	('trabalh', 'Trabalh', 'Travail', 'var(--color-gold)', 14),
	('familha', 'Familha', 'Famille', 'var(--color-olive)', 15),
	('som', 'Som', 'Sommeil', 'var(--color-sky)', 16),
	('ora', 'Ora', 'Heure', 'var(--color-brick)', 17),
	('chiffras-partida-1', 'Chifras I', 'Chiffres I', 'var(--color-terracotta)', 18),
	('chifras-partida-2', 'Chifras II', 'Chiffres II', 'var(--color-teal)', 19),
	('senses', 'Senses', 'Sens', 'var(--color-gold)', 20),
	('jo', 'JO', 'JO', 'var(--color-olive)', 21),
	('oc-non', 'Òc / Non', 'Oui / Non', 'var(--color-sky)', 22),
	('auton', 'Auton', 'Automne', 'var(--color-brick)', 23),
	('cardinals', 'Cardinals', 'Points cardinaux', 'var(--color-terracotta)', 24),
	('direccions', 'Direccions', 'Directions', 'var(--color-teal)', 25),
	('biaisses-cognitius', 'Biaisses cognitius', 'Biais cognitifs', 'var(--color-gold)', 26),
	('bordeu', 'Bordèu', 'Bordeaux', 'var(--color-olive)', 27),
	('remplacat', 'Remplaçat', 'Remplacé', 'var(--color-sky)', 28),
	('ostal', 'Ostal', 'Maison', 'var(--color-brick)', 29),
	('conjugason', 'Conjugason', 'Conjugaison', 'var(--color-terracotta)', 30),
	('conta-me-istoria', 'Conta-me una istòria', 'Raconte-moi une histoire', 'var(--color-teal)', 31),
	('amor-daussau', 'Amor d’Aussau', 'Amour d’Ossau', 'var(--color-gold)', 32),
	('carta-linguistic', 'Carta linguistica', 'Carte linguistique', 'var(--color-olive)', 33),
	('francitan', 'Francitan', 'Francitan', 'var(--color-sky)', 34)
on conflict (id) do update set
	oc = excluded.oc,
	fr = excluded.fr,
	color = excluded.color,
	ordre = excluded.ordre;


-- 3) Les 203 fiches.
--    Les adresses pointent vers app/static/ : les images restent servies par
--    le site, elles ne passent pas dans Supabase Storage (décision du
--    2026-08-03, §11). Les fiches ajoutées plus tard depuis l'espace
--    d'administration porteront, elles, une adresse Storage.
insert into public.fichas (id, tema_id, titre, mini_url, grand_url, ordre) values
	('entre-cel-e-montanhas--aucels', 'entre-cel-e-montanhas', 'Aucels', '/fichas/mini/entre-cel-e-montanhas--aucels.webp', '/fichas/grand/entre-cel-e-montanhas--aucels.webp', 0),
	('entre-cel-e-montanhas--la-luna', 'entre-cel-e-montanhas', 'La luna', '/fichas/mini/entre-cel-e-montanhas--la-luna.webp', '/fichas/grand/entre-cel-e-montanhas--la-luna.webp', 1),
	('entre-cel-e-montanhas--lo-solelh', 'entre-cel-e-montanhas', 'Lo solelh', '/fichas/mini/entre-cel-e-montanhas--lo-solelh.webp', '/fichas/grand/entre-cel-e-montanhas--lo-solelh.webp', 2),
	('entre-cel-e-montanhas--montanha', 'entre-cel-e-montanhas', 'Montanha', '/fichas/mini/entre-cel-e-montanhas--montanha.webp', '/fichas/grand/entre-cel-e-montanhas--montanha.webp', 3),
	('entre-cel-e-montanhas--un-nivol', 'entre-cel-e-montanhas', 'Un nivol', '/fichas/mini/entre-cel-e-montanhas--un-nivol.webp', '/fichas/grand/entre-cel-e-montanhas--un-nivol.webp', 4),
	('sason--auton', 'sason', 'Auton', '/fichas/mini/sason--auton.webp', '/fichas/grand/sason--auton.webp', 0),
	('sason--estiu', 'sason', 'Estiu', '/fichas/mini/sason--estiu.webp', '/fichas/grand/sason--estiu.webp', 1),
	('sason--ivern', 'sason', 'Ivern', '/fichas/mini/sason--ivern.webp', '/fichas/grand/sason--ivern.webp', 2),
	('sason--prima', 'sason', 'Prima', '/fichas/mini/sason--prima.webp', '/fichas/grand/sason--prima.webp', 3),
	('sason--qual-temps-fa', 'sason', 'Qual temps fa', '/fichas/mini/sason--qual-temps-fa.webp', '/fichas/grand/sason--qual-temps-fa.webp', 4),
	('cos-uman--brac', 'cos-uman', 'Brac', '/fichas/mini/cos-uman--brac.webp', '/fichas/grand/cos-uman--brac.webp', 0),
	('cos-uman--camba', 'cos-uman', 'Camba', '/fichas/mini/cos-uman--camba.webp', '/fichas/grand/cos-uman--camba.webp', 1),
	('cos-uman--cap', 'cos-uman', 'Cap', '/fichas/mini/cos-uman--cap.webp', '/fichas/grand/cos-uman--cap.webp', 2),
	('cos-uman--cervel', 'cos-uman', 'Cervel', '/fichas/mini/cos-uman--cervel.webp', '/fichas/grand/cos-uman--cervel.webp', 3),
	('cos-uman--cor', 'cos-uman', 'Cor', '/fichas/mini/cos-uman--cor.webp', '/fichas/grand/cos-uman--cor.webp', 4),
	('cos-uman--esquina', 'cos-uman', 'Esquina', '/fichas/mini/cos-uman--esquina.webp', '/fichas/grand/cos-uman--esquina.webp', 5),
	('cos-uman--lo-cos', 'cos-uman', 'Lo cos', '/fichas/mini/cos-uman--lo-cos.webp', '/fichas/grand/cos-uman--lo-cos.webp', 6),
	('cos-uman--mans', 'cos-uman', 'Mans', '/fichas/mini/cos-uman--mans.webp', '/fichas/grand/cos-uman--mans.webp', 7),
	('cos-uman--paterlas', 'cos-uman', 'Paterlas', '/fichas/mini/cos-uman--paterlas.webp', '/fichas/grand/cos-uman--paterlas.webp', 8),
	('cos-uman--pe', 'cos-uman', 'Pe', '/fichas/mini/cos-uman--pe.webp', '/fichas/grand/cos-uman--pe.webp', 9),
	('cos-uman--ventre', 'cos-uman', 'Ventre', '/fichas/mini/cos-uman--ventre.webp', '/fichas/grand/cos-uman--ventre.webp', 10),
	('manjam-uei--caultetbroca', 'manjam-uei', 'Caultetbroca', '/fichas/mini/manjam-uei--caultetbroca.webp', '/fichas/grand/manjam-uei--caultetbroca.webp', 0),
	('manjam-uei--ceps', 'manjam-uei', 'Ceps', '/fichas/mini/manjam-uei--ceps.webp', '/fichas/grand/manjam-uei--ceps.webp', 1),
	('manjam-uei--citron', 'manjam-uei', 'Citron', '/fichas/mini/manjam-uei--citron.webp', '/fichas/grand/manjam-uei--citron.webp', 2),
	('manjam-uei--cogombre', 'manjam-uei', 'Cogombre', '/fichas/mini/manjam-uei--cogombre.webp', '/fichas/grand/manjam-uei--cogombre.webp', 3),
	('manjam-uei--cogorda-copie', 'manjam-uei', 'Cogorda', '/fichas/mini/manjam-uei--cogorda-copie.webp', '/fichas/grand/manjam-uei--cogorda-copie.webp', 4),
	('manjam-uei--merinjana', 'manjam-uei', 'Merinjana', '/fichas/mini/manjam-uei--merinjana.webp', '/fichas/grand/manjam-uei--merinjana.webp', 5),
	('manjam-uei--pastenagas', 'manjam-uei', 'Pastenagas', '/fichas/mini/manjam-uei--pastenagas.webp', '/fichas/grand/manjam-uei--pastenagas.webp', 6),
	('manjam-uei--pera', 'manjam-uei', 'Pera', '/fichas/mini/manjam-uei--pera.webp', '/fichas/grand/manjam-uei--pera.webp', 7),
	('manjam-uei--que-manjam-uei', 'manjam-uei', 'Que manjam uei', '/fichas/mini/manjam-uei--que-manjam-uei.webp', '/fichas/grand/manjam-uei--que-manjam-uei.webp', 8),
	('manjam-uei--tomata', 'manjam-uei', 'Tomata', '/fichas/mini/manjam-uei--tomata.webp', '/fichas/grand/manjam-uei--tomata.webp', 9),
	('pronoms-personals--copie-de-pronoms-personals', 'pronoms-personals', 'Pronoms personals', '/fichas/mini/pronoms-personals--copie-de-pronoms-personals.webp', '/fichas/grand/pronoms-personals--copie-de-pronoms-personals.webp', 0),
	('pronoms-personals--el-ela', 'pronoms-personals', 'El Ela', '/fichas/mini/pronoms-personals--el-ela.webp', '/fichas/grand/pronoms-personals--el-ela.webp', 1),
	('pronoms-personals--eles-elas', 'pronoms-personals', 'Eles Elas', '/fichas/mini/pronoms-personals--eles-elas.webp', '/fichas/grand/pronoms-personals--eles-elas.webp', 2),
	('pronoms-personals--ieu', 'pronoms-personals', 'Ieu', '/fichas/mini/pronoms-personals--ieu.webp', '/fichas/grand/pronoms-personals--ieu.webp', 3),
	('pronoms-personals--nousautres-as', 'pronoms-personals', 'Nousautres as', '/fichas/mini/pronoms-personals--nousautres-as.webp', '/fichas/grand/pronoms-personals--nousautres-as.webp', 4),
	('pronoms-personals--tu', 'pronoms-personals', 'Tu', '/fichas/mini/pronoms-personals--tu.webp', '/fichas/grand/pronoms-personals--tu.webp', 5),
	('pronoms-personals--vosautres-as', 'pronoms-personals', 'Vosautres as', '/fichas/mini/pronoms-personals--vosautres-as.webp', '/fichas/grand/pronoms-personals--vosautres-as.webp', 6),
	('colors-partida-1--blau', 'colors-partida-1', 'Blau', '/fichas/mini/colors-partida-1--blau.webp', '/fichas/grand/colors-partida-1--blau.webp', 0),
	('colors-partida-1--irange', 'colors-partida-1', 'Irange', '/fichas/mini/colors-partida-1--irange.webp', '/fichas/grand/colors-partida-1--irange.webp', 1),
	('colors-partida-1--jaune', 'colors-partida-1', 'Jaune', '/fichas/mini/colors-partida-1--jaune.webp', '/fichas/grand/colors-partida-1--jaune.webp', 2),
	('colors-partida-1--mond-en-color-part-1', 'colors-partida-1', 'Mond en color part 1', '/fichas/mini/colors-partida-1--mond-en-color-part-1.webp', '/fichas/grand/colors-partida-1--mond-en-color-part-1.webp', 3),
	('colors-partida-1--roge', 'colors-partida-1', 'Roge', '/fichas/mini/colors-partida-1--roge.webp', '/fichas/grand/colors-partida-1--roge.webp', 4),
	('colors-partida-1--rosa', 'colors-partida-1', 'Rosa', '/fichas/mini/colors-partida-1--rosa.webp', '/fichas/grand/colors-partida-1--rosa.webp', 5),
	('colors-partida-2--blanc', 'colors-partida-2', 'Blanc', '/fichas/mini/colors-partida-2--blanc.webp', '/fichas/grand/colors-partida-2--blanc.webp', 0),
	('colors-partida-2--burel', 'colors-partida-2', 'Burel', '/fichas/mini/colors-partida-2--burel.webp', '/fichas/grand/colors-partida-2--burel.webp', 1),
	('colors-partida-2--color-part-2', 'colors-partida-2', 'Color part 2', '/fichas/mini/colors-partida-2--color-part-2.webp', '/fichas/grand/colors-partida-2--color-part-2.webp', 2),
	('colors-partida-2--cstanh', 'colors-partida-2', 'Cstanh', '/fichas/mini/colors-partida-2--cstanh.webp', '/fichas/grand/colors-partida-2--cstanh.webp', 3),
	('colors-partida-2--negre', 'colors-partida-2', 'Negre', '/fichas/mini/colors-partida-2--negre.webp', '/fichas/grand/colors-partida-2--negre.webp', 4),
	('colors-partida-2--verd', 'colors-partida-2', 'Verd', '/fichas/mini/colors-partida-2--verd.webp', '/fichas/grand/colors-partida-2--verd.webp', 5),
	('colors-partida-2--violet', 'colors-partida-2', 'Violet', '/fichas/mini/colors-partida-2--violet.webp', '/fichas/grand/colors-partida-2--violet.webp', 6),
	('nadal-2022--nadal', 'nadal-2022', 'Nadal', '/fichas/mini/nadal-2022--nadal.webp', '/fichas/grand/nadal-2022--nadal.webp', 0),
	('cap-dan-2022--bona-annada', 'cap-dan-2022', 'Bona annada', '/fichas/mini/cap-dan-2022--bona-annada.webp', '/fichas/grand/cap-dan-2022--bona-annada.webp', 0),
	('planetas--jupiter', 'planetas', 'Jupiter', '/fichas/mini/planetas--jupiter.webp', '/fichas/grand/planetas--jupiter.webp', 0),
	('planetas--las-planetas', 'planetas', 'Las planetas', '/fichas/mini/planetas--las-planetas.webp', '/fichas/grand/planetas--las-planetas.webp', 1),
	('planetas--lo-solelh', 'planetas', 'Lo solelh', '/fichas/mini/planetas--lo-solelh.webp', '/fichas/grand/planetas--lo-solelh.webp', 2),
	('planetas--marc', 'planetas', 'Marc', '/fichas/mini/planetas--marc.webp', '/fichas/grand/planetas--marc.webp', 3),
	('planetas--mercuri', 'planetas', 'Mercuri', '/fichas/mini/planetas--mercuri.webp', '/fichas/grand/planetas--mercuri.webp', 4),
	('planetas--neptun', 'planetas', 'Neptun', '/fichas/mini/planetas--neptun.webp', '/fichas/grand/planetas--neptun.webp', 5),
	('planetas--pluton', 'planetas', 'Pluton', '/fichas/mini/planetas--pluton.webp', '/fichas/grand/planetas--pluton.webp', 6),
	('planetas--saturn', 'planetas', 'Saturn', '/fichas/mini/planetas--saturn.webp', '/fichas/grand/planetas--saturn.webp', 7),
	('planetas--terra', 'planetas', 'Terra', '/fichas/mini/planetas--terra.webp', '/fichas/grand/planetas--terra.webp', 8),
	('planetas--uranus', 'planetas', 'Uranus', '/fichas/mini/planetas--uranus.webp', '/fichas/grand/planetas--uranus.webp', 9),
	('planetas--venus', 'planetas', 'Venus', '/fichas/mini/planetas--venus.webp', '/fichas/grand/planetas--venus.webp', 10),
	('meteo--auratge', 'meteo', 'Auratge', '/fichas/mini/meteo--auratge.webp', '/fichas/grand/meteo--auratge.webp', 0),
	('meteo--copie-de-qual-temps-fa', 'meteo', 'Qual temps fa', '/fichas/mini/meteo--copie-de-qual-temps-fa.webp', '/fichas/grand/meteo--copie-de-qual-temps-fa.webp', 1),
	('meteo--esclarzidas', 'meteo', 'Esclarzidas', '/fichas/mini/meteo--esclarzidas.webp', '/fichas/grand/meteo--esclarzidas.webp', 2),
	('meteo--freg-caud', 'meteo', 'Freg caud', '/fichas/mini/meteo--freg-caud.webp', '/fichas/grand/meteo--freg-caud.webp', 3),
	('meteo--neu', 'meteo', 'Neu', '/fichas/mini/meteo--neu.webp', '/fichas/grand/meteo--neu.webp', 4),
	('meteo--plou', 'meteo', 'Plou', '/fichas/mini/meteo--plou.webp', '/fichas/grand/meteo--plou.webp', 5),
	('meteo--solelh', 'meteo', 'Solelh', '/fichas/mini/meteo--solelh.webp', '/fichas/grand/meteo--solelh.webp', 6),
	('animals--animals-1', 'animals', 'Animals 1', '/fichas/mini/animals--animals-1.webp', '/fichas/grand/animals--animals-1.webp', 0),
	('animals--animals-2', 'animals', 'Animals 2', '/fichas/mini/animals--animals-2.webp', '/fichas/grand/animals--animals-2.webp', 1),
	('animals--boc', 'animals', 'Boc', '/fichas/mini/animals--boc.webp', '/fichas/grand/animals--boc.webp', 2),
	('animals--can', 'animals', 'Can', '/fichas/mini/animals--can.webp', '/fichas/grand/animals--can.webp', 3),
	('animals--caval', 'animals', 'Caval', '/fichas/mini/animals--caval.webp', '/fichas/grand/animals--caval.webp', 4),
	('animals--galina', 'animals', 'Galina', '/fichas/mini/animals--galina.webp', '/fichas/grand/animals--galina.webp', 5),
	('animals--gat', 'animals', 'Gat', '/fichas/mini/animals--gat.webp', '/fichas/grand/animals--gat.webp', 6),
	('animals--lo-porc', 'animals', 'Lo porc', '/fichas/mini/animals--lo-porc.webp', '/fichas/grand/animals--lo-porc.webp', 7),
	('astrologics--aiga', 'astrologics', 'Aiga', '/fichas/mini/astrologics--aiga.webp', '/fichas/grand/astrologics--aiga.webp', 0),
	('astrologics--aire', 'astrologics', 'Aire', '/fichas/mini/astrologics--aire.webp', '/fichas/grand/astrologics--aire.webp', 1),
	('astrologics--astro', 'astrologics', 'Astro', '/fichas/mini/astrologics--astro.webp', '/fichas/grand/astrologics--astro.webp', 2),
	('astrologics--fuoc', 'astrologics', 'Fuoc', '/fichas/mini/astrologics--fuoc.webp', '/fichas/grand/astrologics--fuoc.webp', 3),
	('astrologics--terra', 'astrologics', 'Terra', '/fichas/mini/astrologics--terra.webp', '/fichas/grand/astrologics--terra.webp', 4),
	('emocions--colera', 'emocions', 'Colera', '/fichas/mini/emocions--colera.webp', '/fichas/grand/emocions--colera.webp', 0),
	('emocions--copie-de-fastic-p1', 'emocions', 'Fastic p1', '/fichas/mini/emocions--copie-de-fastic-p1.webp', '/fichas/grand/emocions--copie-de-fastic-p1.webp', 1),
	('emocions--fastic', 'emocions', 'Fastic', '/fichas/mini/emocions--fastic.webp', '/fichas/grand/emocions--fastic.webp', 2),
	('emocions--joia', 'emocions', 'Joia', '/fichas/mini/emocions--joia.webp', '/fichas/grand/emocions--joia.webp', 3),
	('emocions--paur', 'emocions', 'Paur', '/fichas/mini/emocions--paur.webp', '/fichas/grand/emocions--paur.webp', 4),
	('emocions--sentiment-v2', 'emocions', 'Sentiment v2', '/fichas/mini/emocions--sentiment-v2.webp', '/fichas/grand/emocions--sentiment-v2.webp', 5),
	('emocions--sentiments', 'emocions', 'Sentiments', '/fichas/mini/emocions--sentiments.webp', '/fichas/grand/emocions--sentiments.webp', 6),
	('emocions--suspresa', 'emocions', 'Suspresa', '/fichas/mini/emocions--suspresa.webp', '/fichas/grand/emocions--suspresa.webp', 7),
	('emocions--tristesa', 'emocions', 'Tristesa', '/fichas/mini/emocions--tristesa.webp', '/fichas/grand/emocions--tristesa.webp', 8),
	('trabalh--agricultor', 'trabalh', 'Agricultor', '/fichas/mini/trabalh--agricultor.webp', '/fichas/grand/trabalh--agricultor.webp', 0),
	('trabalh--comptable', 'trabalh', 'Comptable', '/fichas/mini/trabalh--comptable.webp', '/fichas/grand/trabalh--comptable.webp', 1),
	('trabalh--desvolopaire', 'trabalh', 'Desvolopaire', '/fichas/mini/trabalh--desvolopaire.webp', '/fichas/grand/trabalh--desvolopaire.webp', 2),
	('trabalh--escobilhaire', 'trabalh', 'Escobilhaire', '/fichas/mini/trabalh--escobilhaire.webp', '/fichas/grand/trabalh--escobilhaire.webp', 3),
	('trabalh--fornier', 'trabalh', 'Fornier', '/fichas/mini/trabalh--fornier.webp', '/fichas/grand/trabalh--fornier.webp', 4),
	('trabalh--liuraire', 'trabalh', 'Liuraire', '/fichas/mini/trabalh--liuraire.webp', '/fichas/grand/trabalh--liuraire.webp', 5),
	('trabalh--mestre', 'trabalh', 'Mestre', '/fichas/mini/trabalh--mestre.webp', '/fichas/grand/trabalh--mestre.webp', 6),
	('trabalh--metge', 'trabalh', 'Metge', '/fichas/mini/trabalh--metge.webp', '/fichas/grand/trabalh--metge.webp', 7),
	('trabalh--trabalh', 'trabalh', 'Trabalh', '/fichas/mini/trabalh--trabalh.webp', '/fichas/grand/trabalh--trabalh.webp', 8),
	('trabalh--urbanista', 'trabalh', 'Urbanista', '/fichas/mini/trabalh--urbanista.webp', '/fichas/grand/trabalh--urbanista.webp', 9),
	('familha--cosin-cosina', 'familha', 'Cosin Cosina', '/fichas/mini/familha--cosin-cosina.webp', '/fichas/grand/familha--cosin-cosina.webp', 0),
	('familha--familha', 'familha', 'Familha', '/fichas/mini/familha--familha.webp', '/fichas/grand/familha--familha.webp', 1),
	('familha--felen-felena', 'familha', 'Felen Felena', '/fichas/mini/familha--felen-felena.webp', '/fichas/grand/familha--felen-felena.webp', 2),
	('familha--filha-filh', 'familha', 'Filha Filh', '/fichas/mini/familha--filha-filh.webp', '/fichas/grand/familha--filha-filh.webp', 3),
	('familha--maire-paire', 'familha', 'Maire Paire', '/fichas/mini/familha--maire-paire.webp', '/fichas/grand/familha--maire-paire.webp', 4),
	('familha--oncle-tanta', 'familha', 'Oncle Tanta', '/fichas/mini/familha--oncle-tanta.webp', '/fichas/grand/familha--oncle-tanta.webp', 5),
	('familha--pepin-memina', 'familha', 'Pepin Memina', '/fichas/mini/familha--pepin-memina.webp', '/fichas/grand/familha--pepin-memina.webp', 6),
	('familha--sorre-fraire', 'familha', 'Sorre Fraire', '/fichas/mini/familha--sorre-fraire.webp', '/fichas/grand/familha--sorre-fraire.webp', 7),
	('som--cachavielha', 'som', 'Cachavielha', '/fichas/mini/som--cachavielha.webp', '/fichas/grand/som--cachavielha.webp', 0),
	('som--insomnia', 'som', 'Insomnia', '/fichas/mini/som--insomnia.webp', '/fichas/grand/som--insomnia.webp', 1),
	('som--som', 'som', 'Som', '/fichas/mini/som--som.webp', '/fichas/grand/som--som.webp', 2),
	('som--somi', 'som', 'Somi', '/fichas/mini/som--somi.webp', '/fichas/grand/som--somi.webp', 3),
	('ora--matin', 'ora', 'Matin', '/fichas/mini/ora--matin.webp', '/fichas/grand/ora--matin.webp', 0),
	('ora--miegjorn', 'ora', 'Miegjorn', '/fichas/mini/ora--miegjorn.webp', '/fichas/grand/ora--miegjorn.webp', 1),
	('ora--nuech', 'ora', 'Nuech', '/fichas/mini/ora--nuech.webp', '/fichas/grand/ora--nuech.webp', 2),
	('ora--ora', 'ora', 'Ora', '/fichas/mini/ora--ora.webp', '/fichas/grand/ora--ora.webp', 3),
	('ora--ser', 'ora', 'Ser', '/fichas/mini/ora--ser.webp', '/fichas/grand/ora--ser.webp', 4),
	('ora--vespre', 'ora', 'Vespre', '/fichas/mini/ora--vespre.webp', '/fichas/grand/ora--vespre.webp', 5),
	('chiffras-partida-1--012345', 'chiffras-partida-1', '012345', '/fichas/mini/chiffras-partida-1--012345.webp', '/fichas/grand/chiffras-partida-1--012345.webp', 0),
	('chiffras-partida-1--6789', 'chiffras-partida-1', '6789', '/fichas/mini/chiffras-partida-1--6789.webp', '/fichas/grand/chiffras-partida-1--6789.webp', 1),
	('chiffras-partida-1--expressions-1-2-3', 'chiffras-partida-1', 'Expressions 1 2 3', '/fichas/mini/chiffras-partida-1--expressions-1-2-3.webp', '/fichas/grand/chiffras-partida-1--expressions-1-2-3.webp', 2),
	('chiffras-partida-1--expressions-4-5', 'chiffras-partida-1', 'Expressions 4 5', '/fichas/mini/chiffras-partida-1--expressions-4-5.webp', '/fichas/grand/chiffras-partida-1--expressions-4-5.webp', 3),
	('chiffras-partida-1--expressions-6-7', 'chiffras-partida-1', 'Expressions 6 7', '/fichas/mini/chiffras-partida-1--expressions-6-7.webp', '/fichas/grand/chiffras-partida-1--expressions-6-7.webp', 4),
	('chiffras-partida-1--expressions-8-9', 'chiffras-partida-1', 'Expressions 8 9', '/fichas/mini/chiffras-partida-1--expressions-8-9.webp', '/fichas/grand/chiffras-partida-1--expressions-8-9.webp', 5),
	('chiffras-partida-1--expressions-chifras-1', 'chiffras-partida-1', 'Expressions chifras 1', '/fichas/mini/chiffras-partida-1--expressions-chifras-1.webp', '/fichas/grand/chiffras-partida-1--expressions-chifras-1.webp', 6),
	('chiffras-partida-1--expressions-chifras-2-copie', 'chiffras-partida-1', 'Expressions chifras 2', '/fichas/mini/chiffras-partida-1--expressions-chifras-2-copie.webp', '/fichas/grand/chiffras-partida-1--expressions-chifras-2-copie.webp', 7),
	('chiffras-partida-1--ordinals-12345', 'chiffras-partida-1', 'Ordinals 12345', '/fichas/mini/chiffras-partida-1--ordinals-12345.webp', '/fichas/grand/chiffras-partida-1--ordinals-12345.webp', 8),
	('chiffras-partida-1--ordinals-6789', 'chiffras-partida-1', 'Ordinals 6789', '/fichas/mini/chiffras-partida-1--ordinals-6789.webp', '/fichas/grand/chiffras-partida-1--ordinals-6789.webp', 9),
	('chifras-partida-2--10-15', 'chifras-partida-2', '10 15', '/fichas/mini/chifras-partida-2--10-15.webp', '/fichas/grand/chifras-partida-2--10-15.webp', 0),
	('chifras-partida-2--16-19', 'chifras-partida-2', '16 19', '/fichas/mini/chifras-partida-2--16-19.webp', '/fichas/grand/chifras-partida-2--16-19.webp', 1),
	('chifras-partida-2--20-70', 'chifras-partida-2', '20 70', '/fichas/mini/chifras-partida-2--20-70.webp', '/fichas/grand/chifras-partida-2--20-70.webp', 2),
	('chifras-partida-2--500plus', 'chifras-partida-2', '500plus', '/fichas/mini/chifras-partida-2--500plus.webp', '/fichas/grand/chifras-partida-2--500plus.webp', 3),
	('chifras-partida-2--80-100', 'chifras-partida-2', '80 100', '/fichas/mini/chifras-partida-2--80-100.webp', '/fichas/grand/chifras-partida-2--80-100.webp', 4),
	('senses--copie-de-pasta', 'senses', 'Pasta', '/fichas/mini/senses--copie-de-pasta.webp', '/fichas/grand/senses--copie-de-pasta.webp', 0),
	('jo--boxa', 'jo', 'Boxa', '/fichas/mini/jo--boxa.webp', '/fichas/grand/jo--boxa.webp', 0),
	('jo--corsa', 'jo', 'Corsa', '/fichas/mini/jo--corsa.webp', '/fichas/grand/jo--corsa.webp', 1),
	('jo--escrima', 'jo', 'Escrima', '/fichas/mini/jo--escrima.webp', '/fichas/grand/jo--escrima.webp', 2),
	('jo--fervor', 'jo', 'Fervor', '/fichas/mini/jo--fervor.webp', '/fichas/grand/jo--fervor.webp', 3),
	('jo--futbol', 'jo', 'Futbol', '/fichas/mini/jo--futbol.webp', '/fichas/grand/jo--futbol.webp', 4),
	('jo--gimnastica', 'jo', 'Gimnastica', '/fichas/mini/jo--gimnastica.webp', '/fichas/grand/jo--gimnastica.webp', 5),
	('jo--judo', 'jo', 'Judo', '/fichas/mini/jo--judo.webp', '/fichas/grand/jo--judo.webp', 6),
	('jo--natacion', 'jo', 'Natacion', '/fichas/mini/jo--natacion.webp', '/fichas/grand/jo--natacion.webp', 7),
	('jo--tenis-1', 'jo', 'Tenis 1', '/fichas/mini/jo--tenis-1.webp', '/fichas/grand/jo--tenis-1.webp', 8),
	('jo--tenis-2', 'jo', 'Tenis 2', '/fichas/mini/jo--tenis-2.webp', '/fichas/grand/jo--tenis-2.webp', 9),
	('jo--units', 'jo', 'Units', '/fichas/mini/jo--units.webp', '/fichas/grand/jo--units.webp', 10),
	('oc-non--benleu', 'oc-non', 'Benleu', '/fichas/mini/oc-non--benleu.webp', '/fichas/grand/oc-non--benleu.webp', 0),
	('oc-non--non', 'oc-non', 'Non', '/fichas/mini/oc-non--non.webp', '/fichas/grand/oc-non--non.webp', 1),
	('oc-non--oc', 'oc-non', 'Oc', '/fichas/mini/oc-non--oc.webp', '/fichas/grand/oc-non--oc.webp', 2),
	('oc-non--una-question', 'oc-non', 'Una question', '/fichas/mini/oc-non--una-question.webp', '/fichas/grand/oc-non--una-question.webp', 3),
	('auton--negacion', 'auton', 'Negacion', '/fichas/mini/auton--negacion.webp', '/fichas/grand/auton--negacion.webp', 0),
	('cardinals--cardinals', 'cardinals', 'Cardinals', '/fichas/mini/cardinals--cardinals.webp', '/fichas/grand/cardinals--cardinals.webp', 0),
	('cardinals--est', 'cardinals', 'Est', '/fichas/mini/cardinals--est.webp', '/fichas/grand/cardinals--est.webp', 1),
	('cardinals--majuscula', 'cardinals', 'Majuscula', '/fichas/mini/cardinals--majuscula.webp', '/fichas/grand/cardinals--majuscula.webp', 2),
	('cardinals--nord', 'cardinals', 'Nord', '/fichas/mini/cardinals--nord.webp', '/fichas/grand/cardinals--nord.webp', 3),
	('cardinals--oest', 'cardinals', 'Oest', '/fichas/mini/cardinals--oest.webp', '/fichas/grand/cardinals--oest.webp', 4),
	('cardinals--sud', 'cardinals', 'Sud', '/fichas/mini/cardinals--sud.webp', '/fichas/grand/cardinals--sud.webp', 5),
	('direccions--direction', 'direccions', 'Direction', '/fichas/mini/direccions--direction.webp', '/fichas/grand/direccions--direction.webp', 0),
	('direccions--on', 'direccions', 'On', '/fichas/mini/direccions--on.webp', '/fichas/grand/direccions--on.webp', 1),
	('biaisses-cognitius--cognitius', 'biaisses-cognitius', 'Cognitius', '/fichas/mini/biaisses-cognitius--cognitius.webp', '/fichas/grand/biaisses-cognitius--cognitius.webp', 0),
	('biaisses-cognitius--copie-de-cognitius', 'biaisses-cognitius', 'Cognitius', '/fichas/mini/biaisses-cognitius--copie-de-cognitius.webp', '/fichas/grand/biaisses-cognitius--copie-de-cognitius.webp', 1),
	('biaisses-cognitius--dunning-kruger', 'biaisses-cognitius', 'Dunning kruger', '/fichas/mini/biaisses-cognitius--dunning-kruger.webp', '/fichas/grand/biaisses-cognitius--dunning-kruger.webp', 2),
	('biaisses-cognitius--modalitat', 'biaisses-cognitius', 'Modalitat', '/fichas/mini/biaisses-cognitius--modalitat.webp', '/fichas/grand/biaisses-cognitius--modalitat.webp', 3),
	('biaisses-cognitius--normalitat', 'biaisses-cognitius', 'Normalitat', '/fichas/mini/biaisses-cognitius--normalitat.webp', '/fichas/grand/biaisses-cognitius--normalitat.webp', 4),
	('bordeu--modalitat-p1', 'bordeu', 'Modalitat p1', '/fichas/mini/bordeu--modalitat-p1.webp', '/fichas/grand/bordeu--modalitat-p1.webp', 0),
	('bordeu--modalitat-p7', 'bordeu', 'Modalitat p7', '/fichas/mini/bordeu--modalitat-p7.webp', '/fichas/grand/bordeu--modalitat-p7.webp', 1),
	('remplacat--cossi-disparu-p1', 'remplacat', 'Cossi disparu p1', '/fichas/mini/remplacat--cossi-disparu-p1.webp', '/fichas/grand/remplacat--cossi-disparu-p1.webp', 0),
	('remplacat--cossi-disparu-p2', 'remplacat', 'Cossi disparu p2', '/fichas/mini/remplacat--cossi-disparu-p2.webp', '/fichas/grand/remplacat--cossi-disparu-p2.webp', 1),
	('remplacat--cossi-disparu-p4', 'remplacat', 'Cossi disparu p4', '/fichas/mini/remplacat--cossi-disparu-p4.webp', '/fichas/grand/remplacat--cossi-disparu-p4.webp', 2),
	('remplacat--cossi-disparu-p5', 'remplacat', 'Cossi disparu p5', '/fichas/mini/remplacat--cossi-disparu-p5.webp', '/fichas/grand/remplacat--cossi-disparu-p5.webp', 3),
	('remplacat--perque-las-lengas-regionalas', 'remplacat', 'Perque las lengas regionalas', '/fichas/mini/remplacat--perque-las-lengas-regionalas.webp', '/fichas/grand/remplacat--perque-las-lengas-regionalas.webp', 4),
	('remplacat--perque', 'remplacat', 'Perque', '/fichas/mini/remplacat--perque.webp', '/fichas/grand/remplacat--perque.webp', 5),
	('ostal--bureu', 'ostal', 'Bureu', '/fichas/mini/ostal--bureu.webp', '/fichas/grand/ostal--bureu.webp', 0),
	('ostal--cambra', 'ostal', 'Cambra', '/fichas/mini/ostal--cambra.webp', '/fichas/grand/ostal--cambra.webp', 1),
	('ostal--comuns-1', 'ostal', 'Comuns 1', '/fichas/mini/ostal--comuns-1.webp', '/fichas/grand/ostal--comuns-1.webp', 2),
	('ostal--cosina', 'ostal', 'Cosina', '/fichas/mini/ostal--cosina.webp', '/fichas/grand/ostal--cosina.webp', 3),
	('ostal--ostal', 'ostal', 'Ostal', '/fichas/mini/ostal--ostal.webp', '/fichas/grand/ostal--ostal.webp', 4),
	('ostal--sala-daiga', 'ostal', 'Sala daiga', '/fichas/mini/ostal--sala-daiga.webp', '/fichas/grand/ostal--sala-daiga.webp', 5),
	('ostal--salon', 'ostal', 'Salon', '/fichas/mini/ostal--salon.webp', '/fichas/grand/ostal--salon.webp', 6),
	('conjugason--conjugason-1-copie', 'conjugason', 'Conjugason 1', '/fichas/mini/conjugason--conjugason-1-copie.webp', '/fichas/grand/conjugason--conjugason-1-copie.webp', 0),
	('conjugason--conjugason-2', 'conjugason', 'Conjugason 2', '/fichas/mini/conjugason--conjugason-2.webp', '/fichas/grand/conjugason--conjugason-2.webp', 1),
	('conjugason--conjugason-3-bis', 'conjugason', 'Conjugason 3 bis', '/fichas/mini/conjugason--conjugason-3-bis.webp', '/fichas/grand/conjugason--conjugason-3-bis.webp', 2),
	('conjugason--conjugason-3-copie', 'conjugason', 'Conjugason 3', '/fichas/mini/conjugason--conjugason-3-copie.webp', '/fichas/grand/conjugason--conjugason-3-copie.webp', 3),
	('conjugason--conjugason-4-bis', 'conjugason', 'Conjugason 4 bis', '/fichas/mini/conjugason--conjugason-4-bis.webp', '/fichas/grand/conjugason--conjugason-4-bis.webp', 4),
	('conjugason--conjugason-4-ter', 'conjugason', 'Conjugason 4 ter', '/fichas/mini/conjugason--conjugason-4-ter.webp', '/fichas/grand/conjugason--conjugason-4-ter.webp', 5),
	('conjugason--conjugason-4', 'conjugason', 'Conjugason 4', '/fichas/mini/conjugason--conjugason-4.webp', '/fichas/grand/conjugason--conjugason-4.webp', 6),
	('conta-me-istoria--castel', 'conta-me-istoria', 'Castel', '/fichas/mini/conta-me-istoria--castel.webp', '/fichas/grand/conta-me-istoria--castel.webp', 0),
	('conta-me-istoria--contar', 'conta-me-istoria', 'Contar', '/fichas/mini/conta-me-istoria--contar.webp', '/fichas/grand/conta-me-istoria--contar.webp', 1),
	('conta-me-istoria--drac', 'conta-me-istoria', 'Drac', '/fichas/mini/conta-me-istoria--drac.webp', '/fichas/grand/conta-me-istoria--drac.webp', 2),
	('conta-me-istoria--feda', 'conta-me-istoria', 'Feda', '/fichas/mini/conta-me-istoria--feda.webp', '/fichas/grand/conta-me-istoria--feda.webp', 3),
	('conta-me-istoria--masc', 'conta-me-istoria', 'Masc', '/fichas/mini/conta-me-istoria--masc.webp', '/fichas/grand/conta-me-istoria--masc.webp', 4),
	('conta-me-istoria--prince', 'conta-me-istoria', 'Prince', '/fichas/mini/conta-me-istoria--prince.webp', '/fichas/grand/conta-me-istoria--prince.webp', 5),
	('amor-daussau--amor-daussau', 'amor-daussau', 'Amor dAussau', '/fichas/mini/amor-daussau--amor-daussau.webp', '/fichas/grand/amor-daussau--amor-daussau.webp', 0),
	('carta-linguistic--auvernhat', 'carta-linguistic', 'Auvernhat', '/fichas/mini/carta-linguistic--auvernhat.webp', '/fichas/grand/carta-linguistic--auvernhat.webp', 0),
	('carta-linguistic--gascon', 'carta-linguistic', 'Gascon', '/fichas/mini/carta-linguistic--gascon.webp', '/fichas/grand/carta-linguistic--gascon.webp', 1),
	('carta-linguistic--lemosin', 'carta-linguistic', 'Lemosin', '/fichas/mini/carta-linguistic--lemosin.webp', '/fichas/grand/carta-linguistic--lemosin.webp', 2),
	('carta-linguistic--lenga-plural', 'carta-linguistic', 'Lenga plural', '/fichas/mini/carta-linguistic--lenga-plural.webp', '/fichas/grand/carta-linguistic--lenga-plural.webp', 3),
	('carta-linguistic--lengadocian', 'carta-linguistic', 'Lengadocian', '/fichas/mini/carta-linguistic--lengadocian.webp', '/fichas/grand/carta-linguistic--lengadocian.webp', 4),
	('carta-linguistic--provencau', 'carta-linguistic', 'Provencau', '/fichas/mini/carta-linguistic--provencau.webp', '/fichas/grand/carta-linguistic--provencau.webp', 5),
	('carta-linguistic--vivaro', 'carta-linguistic', 'Vivaro', '/fichas/mini/carta-linguistic--vivaro.webp', '/fichas/grand/carta-linguistic--vivaro.webp', 6),
	('francitan--francitan', 'francitan', 'Francitan', '/fichas/mini/francitan--francitan.webp', '/fichas/grand/francitan--francitan.webp', 0)
on conflict (id) do update set
	tema_id = excluded.tema_id,
	titre = excluded.titre,
	mini_url = excluded.mini_url,
	grand_url = excluded.grand_url,
	ordre = excluded.ordre;


-- 4) GARDE-FOU : le compte doit tomber juste, sinon tout est annulé.
do $$
declare
	nt int;
	nf int;
begin
	select count(*) into nt from public.temas;
	select count(*) into nf from public.fichas;

	if nt <> 35 then
		raise exception 'MIGRACION : % temas en basa, 35 esperats. Tot es anullat.', nt;
	end if;

	if nf <> 203 then
		raise exception 'MIGRACION : % fichas en basa, 203 esperadas. Tot es anullat.', nf;
	end if;

	raise notice 'Migracion capitada : % temas, % fichas.', nt, nf;
end $$;

-- 5) Contrôle visible : les 8 premières fiches telles qu'elles sont en base.
select f.ordre, f.id, f.titre, t.oc as tema
from public.fichas f
join public.temas t on t.id = f.tema_id
order by t.ordre, f.ordre
limit 8;
