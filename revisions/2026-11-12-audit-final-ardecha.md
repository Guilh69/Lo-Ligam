# D — Ardèche : contrôle des noms occitans des communes (12-11 au soir, session Sonnet)

## Résultat en une ligne

**Commit `2381feef`, poussé sur master** (`ba8d8628..2381feef`). **11 noms masqués** sur 311 ; **l'API top'Òc ne connaît pas l'Ardèche** : elle n'a confirmé ni contredit aucun nom, c'est donc le critère de repli (français à peine retouché) qui a servi. Tests : 35 fichiers, 1 070 passés ; construction : code 0.

## 1. L'API ne couvre pas l'Ardèche (constat à retenir)

- top'Òc ne connaît que 12 départements : 09, 12, 31, 32, 33, 40, 46, 47, 64, 65, 81, 82. Sa propre réponse d'erreur le dit quand on interroge par nom avec `dep=07` (« Incorrect department »). L'Ardèche (07) n'y est pas ; la Drôme (26), le Gard (30), l'Hérault (34), etc. non plus.
- Preuve que ce n'est ni la clé ni le script : les codes 64287 (Laàs) et 33003 (Ambarès-et-Lagrave) répondent ; les 330 codes 07xxx reviennent « No toponym found with your specifications » (code d'erreur 10 de l'API : une absence, pas une panne).
- **Résultat du sondage (330 codes, un appel par commune, pauses de 400 ms et de 2 s tous les 40 appels, 3 essais par appel) : confirmés 0 ; contredits 0 ; sans réponse 330 ; erreurs 0.** Les réponses ne sont pas conservées (seuls les verdicts ont été comptés).
- Conséquence : sur l'Ardèche, aucun des 300 noms qui restent n'est confirmé par lo Congrès. Le contrôle systématique demandé n'est pas possible avec cette API ; il faudrait une autre source (voir « La suite »).

## 2. Nombres

| | Communes |
|---|---|
| Communes de l'Ardèche (07.json) | 330 |
| Avec un nom occitan avant mon passage | 311 (dont 19 identiques au français) |
| Sans nom occitan avant mon passage | 19 (13 masquées le 12-11 par le commit `31a702e7`, 6 qui n'en avaient pas) |
| Confirmés par l'API | 0 |
| Contredits par l'API (masqués) | 0 |
| Sans réponse de l'API : masqués | **11** |
| Sans réponse de l'API : gardés (« non confirmé ») | 300 |
| Erreurs d'appel | 0 |

Sur les 11 masqués : 8 relèvent du critère de la tâche (français à peine retouché) ; **3 sont une extension de ma part** (tableau 2 ci-dessous), à annuler en retirant la ligne du CSV (puis `node SIG/cadena/comunas-escartar.mjs` ne les touchera plus ; il faudrait rétablir le nom dans 07.json et noms.json avec `git revert` ou à la main) si la session cheffe ou Romain n'en veut pas.

## 3. Les 11 communes masquées

Français à peine retouché (critère de la tâche : « Saint » devenu « Sant », traits d'union retirés, nom français conservé ; comme les 17 du 12-11, dont « Sant Michel de Chabrillanoux » masqué sur le même motif) :

| Code | Commune | Nom écarté | Pourquoi |
|---|---|---|---|
| 07248 | Saint-Jean-Roure | Sant Jean Roure | prénom français « Jean » |
| 07244 | Saint-Jean-Chambre | Sant Jean Chambre | prénom français « Jean » |
| 07214 | Saint-Apollinaire-de-Rias | Sant Apollinaire de Rias | français à Saint→Sant près |
| 07303 | Saint-Vincent-de-Durfort | Sant Vincent de Durfort | idem ; la carte garde « Sant Vincenç de Barrès » (07302), forme occitane du même saint |
| 07239 | Saint-Genest-Lachamp | Sant Genest Lachamp | idem ; la carte garde « Sant Ginèis de Bauson » et « Sant Andrieu Lo Camp » |
| 07221 | Saint-Cierge-la-Serre | Sant Cierge la Serre | idem ; la carte garde « Sant Cirgue de Montanha » |
| 07260 | Saint-Lager-Bressac | Sant Lager Bressac | idem (composé de deux noms sans particule) |
| 07276 | Saint-Michel-d'Aurance | Sant Michel d'Aurance | idem ; « Aurance » inchangé |

Extension de ma part (3), hors du critère écrit de la tâche (tableau 2) :

| Code | Commune | Nom écarté | Pourquoi |
|---|---|---|---|
| 07165 | Belsentes | Nonières | ancien nom français de la commune de Nonières (déduit : le code 07165 est celui de Nonières dans l'ordre alphabétique INSEE, et la page Belsentes montre la « Mairie Nonières ») ; c'est un nom français (-ières), pas une forme occitane |
| 07297 | Saint-Sylvestre | Sant Sarnin | nom déjà porté par Saint-Sernin (07296) : le même nom ne peut pas être juste pour deux communes, et le sens désigne Saint-Sernin |
| 07241 | Saint-Germain | Sant Ginèis de Bauson | nom déjà porté par Saint-Genest-de-Beauzon (07238) : le sens (Ginèis = Genest) désigne Saint-Genest-de-Beauzon |

Le fichier `SIG/comunas/noms-escartats.csv` garde, pour chaque ligne, le nom écarté tel qu'il était dans la carte (nom venu d'OpenStreetMap, pas une réponse de l'API) et le motif (`francés` ou `autra comuna (…)`). Aucune forme de l'API n'est écrite nulle part.

## 4. Contrôles

- **Diff 07.json** (script de comparaison avant/après) : 330 géométries, arcs identiques, **11 propriétés `oc` retirées et aucun autre écart** (ni géométrie, ni `fr`, `p`, `pop`, `i`).
- **Diff noms.json** : mêmes clés, 10 042 entrées, **11 entrées passées de leur nom à `null`, 0 autre modification** ; `null` 224 → 235 ; en-tête et crédits identiques.
- `npm test` : 35 fichiers, 1 070 tests passés. `npm run build` : code de sortie 0.
- **Captures** (pilote Firefox sans fenêtre, 1 830 × 1 000, interface occitane, satellite, centre 44,85 N 4,60 E, zoom 12, barre « 2 km » visible en bas à gauche) :
  - `D-captures/ardecha-avant.png` ; `D-captures/ardecha-apres.png` ; `D-captures/ardecha-apres-fr.png` (même vue en interface française : enregistrée, **non regardée** ; à cette échelle seules les grandes communes ont un nom).
  - Avant : « Sant Jean Roure », « Sant Jean Chambre », « Sant Apollinaire de Rias », « Sant Michel d'Aurance », « Sant Genest Lachamp », « Sant Vincent de Durfort », « Sant Cierge la Serre » et « Nonières » sont écrits. Après : ces huit ont disparu ; les autres noms de la vue (Lo Chalar, Chalancon, Privàs, Dunièra d'Eiriu, Sant Pèire Viala…) sont intacts. Les trois autres communes masquées (Saint-Lager-Bressac, Saint-Sylvestre, Saint-Germain) sont hors cadre.
- Copie de travail `.claude/worktrees/noms-ardecha-bceefa` : l'entrée temporaire de `launch.json` a été retirée (`git checkout`), le serveur de développement arrêté.

## 5. Liste « non confirmé » : les 300 noms gardés (aucun n'est confirmé par lo Congrès)

Rangés du plus au moins douteux, **sans jugement de ma part sur leur justesse** (je n'ai aucune source pour l'Ardèche) :

### 5a. Gardés alors qu'ils ressemblent au français (6 noms de saint seul)

« Sant Privat », « Sant Montan », « Sant Victor » sont aussi de l'occitan valable ; « Sant Priest », « Sant Bauzile », « Sant Agrève » pourraient être des graphies françaises (Saint-Prix est écrit « Sent Prict »). Pas de mot français évident : gardés.

| Code | Commune | Nom gardé |
|---|---|---|
| 07289 | Saint-Privat | Sant Privat |
| 07279 | Saint-Montan | Sant Montan |
| 07301 | Saint-Victor | Sant Victor |
| 07288 | Saint-Priest | Sant Priest |
| 07219 | Saint-Bauzile | Sant Bauzile |
| 07204 | Saint-Agrève | Sant Agrève |

### 5b. À moitié francisés, gardés (4)

Un élément français (« Colombier », « Maurice ») avec un élément occitan (« lo Vièlh », « d'Ibia ») : pas du français à peine retouché. À noter : Colombier est écrit « Colombier » deux fois et « Colombèir lo Cardinal » une fois (07067, parmi les autres).

| Code | Commune | Nom gardé |
|---|---|---|
| 07069 | Colombier-le-Vieux | Colombier lo Vièlh |
| 07068 | Colombier-le-Jeune | Colombier lo Joine |
| 07272 | Saint-Maurice-d'Ardèche | Sant Maurice d'Ardescha |
| 07273 | Saint-Maurice-d'Ibie | Sant Maurice d'Ibia |

### 5c. Formes inhabituelles que je ne sais pas juger (6)

Pas du français, mais je ne peux ni les confirmer ni les contredire ; à faire relire en priorité par Romain si une source apparaît.

| Code | Commune | Nom gardé |
|---|---|---|
| 07281 | Saint-Péray | Sant Pèire d'Ai |
| 07212 | Saint-André-en-Vivarais | Sant Andrieu daus Enfanjats |
| 07236 | Saint-Félicien | San Farcio |
| 07268 | Saint-Martin-d'Ardèche | Sant Martin de la Pèira |
| 07330 | Vallon-Pont-d'Arc | Avalon (de Pont d'Arc) |
| 07270 | Saint-Martin-sur-Lavezon | Sant Martin (de las Doas Gleisas) |

### 5d. Noms identiques au français (19) : gardés

Aucun mot français évident (noms de lieux d'origine occitane qui s'écrivent pareil).

| Code | Commune | Nom gardé |
|---|---|---|
| 07034 | Bidon | Bidon |
| 07099 | Gras | Gras |
| 07183 | Pradons | Pradons |
| 07080 | Devesset | Devesset |
| 07314 | Silhac | Silhac |
| 07077 | Darbres | Darbres |
| 07184 | Pranles | Pranles |
| 07090 | Flaviac | Flaviac |
| 07198 | Rompon | Rompon |
| 07152 | Mauves | Mauves |
| 07097 | Glun | Glun |
| 07140 | Lemps | Lemps |
| 07345 | Vion | Vion |
| 07045 | Burzet | Burzet |
| 07150 | Mariac | Mariac |
| 07108 | Jaunac | Jaunac |
| 07336 | Vernon | Vernon |
| 07107 | Jaujac | Jaujac |
| 07187 | Prunet | Prunet |

### 5e. Les 265 autres

Formes occitanes plausibles à première vue (articles lo/la/los/las, finales -as, -ièira, -ac, « Sant X de Y » avec un nom occitan…), non confirmées.

| Code | Commune | Nom gardé |
|---|---|---|
| 07158 | Mézilhac | Mesilhac |
| 07139 | Laviolle | La Viòla |
| 07331 | Vals-les-Bains | Vals (daus Bans) |
| 07003 | Aizac | Aisac |
| 07011 | Vallées-d'Antraigues-Asperjoc | Vals d'Entraigas e Asperjòc |
| 07116 | Labégude | La Beguda de Vals |
| 07149 | Marcols-les-Eaux | Marcols deis Aigas |
| 07093 | Genestelle | Ginestèla |
| 07210 | Saint-Andéol-de-Vals | Sant Andiòu de Vals |
| 07325 | Ucel | Ucèl |
| 07254 | Saint-Julien-du-Serre | Sant Julian delh Serre |
| 07253 | Saint-Julien-du-Gua | Sant Julian dau Ga |
| 07251 | Saint-Joseph-des-Bancs | Sant Jausèp de Bans |
| 07104 | Issamoulenc | Issamolenc |
| 07277 | Saint-Michel-de-Boulogne | Sant Michèu de Bolònha |
| 07339 | Vesseaux | Veçau |
| 07098 | Gourdon | Gordon |
| 07230 | Saint-Étienne-de-Boulogne | Sant Estève de Bolònha |
| 07004 | Ajoux | Ajaon |
| 07263 | Saint-Laurent-sous-Coiron | Sant Laurenç de Coiron |
| 07343 | Vinezac | Vinasac |
| 07002 | Ailhon | Alhon |
| 07155 | Mercuer | Mercuèr |
| 07122 | Lachapelle-sous-Aubenas | La Chapèla d'Aubenàs |
| 07091 | Fons | Fònt |
| 07296 | Saint-Sernin | Sant Sarnin |
| 07231 | Saint-Étienne-de-Fontbellon | Sant Estève de Fontbelon |
| 07131 | Lanas | Lanaç |
| 07019 | Aubenas | Aubenàs |
| 07348 | Vogüé | Vogüer |
| 07229 | Saint-Didier-sous-Aubenas | Sant Deidier d'Aubenàs |
| 07138 | Lavilledieu | La Vila Dieu |
| 07145 | Lussas | Luçac |
| 07159 | Mirabel | Mirabèl |
| 07341 | Villeneuve-de-Berg | Vilanòva de Bèrc |
| 07208 | Saint-Andéol-de-Berg | Sant Andiòu de Bèrc |
| 07247 | Saint-Jean-le-Centenier | Sant Joan de Sentenièr |
| 07242 | Saint-Gineys-en-Coiron | Sant Ginèis de Coiron |
| 07259 | Saint-Just-d'Ardèche | Sant Just d'Ardescha |
| 07168 | Orgnac-l'Aven | Ornhac de l'Avenc |
| 07264 | Saint-Marcel-d'Ardèche | Sant Marcèu d'Ardescha |
| 07113 | Labastide-de-Virac | La Bastida de Virac |
| 07291 | Saint-Remèze | Sant Remèsi |
| 07328 | Vagnas | Vanhan |
| 07042 | Bourg-Saint-Andéol | Lo Borg Sant Andiòu |
| 07304 | Salavas | Salavàs |
| 07126 | Lagorce | La Gòrça |
| 07306 | Sampzon | Samson |
| 07201 | Ruoms | Ruòms |
| 07133 | Larnas | Larnaç |
| 07346 | Viviers | Vivièrs |
| 07061 | Chauzon | Chauson |
| 07332 | Valvignères | Vauvinhèira |
| 07300 | Saint-Thomé | Sant Tomá |
| 07023 | Balazuc | Balasun |
| 07190 | Rochecolombe | Ròchacolomba |
| 07327 | Uzer | Usèr |
| 07192 | Rochepaule | Ròchapaula |
| 07249 | Saint-Jeure-d'Andaure | Sant Geure d'Andaure |
| 07258 | Saint-Julien-Vocance | Sant Julian de Vaucanço |
| 07285 | Saint-Pierre-sur-Doux | Sant Pèire de Doç |
| 07160 | Monestier | Lo Monesteir |
| 07333 | Vanosc | Vanòsc |
| 07124 | Lafarre | La Fara |
| 07128 | Lalouvesc | L'Alauvesc |
| 07170 | Pailharès | Palharesc |
| 07299 | Saint-Symphorien-de-Mahun | Sant Safloriá de Maün |
| 07347 | Vocance | Vaucança |
| 07309 | Satillieu | Satilhau |
| 07335 | Vaudevant | Vaudavent |
| 07342 | Villevocance | Vilavaucança |
| 07205 | Saint-Alban-d'Ay | Sant Alban d'Ai |
| 07185 | Préaux | Praèus |
| 07039 | Bozas | Bosàs |
| 07292 | Saint-Romain-d'Ay | Sant Róman d'Ai |
| 07188 | Quintenas | Quintenàs |
| 07250 | Saint-Jeure-d'Ay | Sant Geure d'Ai |
| 07086 | Étables | Estables |
| 07013 | Ardoix | Ardoetz |
| 07217 | Saint-Barthélemy-le-Plain | Sant Bertomieu dau Plan |
| 07079 | Désaignes | Desanha |
| 07286 | Saint-Pierreville | Sant Pèire Viala |
| 07114 | Labatie-d'Andaure | La Bastiá d'Andaure |
| 07290 | Saint-Prix | Sent Prict |
| 07096 | Gluiras | Gluiràs |
| 07030 | Beauvène | Bauvena |
| 07166 | Nozières | Nosèiras |
| 07218 | Saint-Basile | Sant Basili |
| 07048 | Chalencon | Chalancon |
| 07129 | Lamastre | La Mastra |
| 07295 | Saint-Sauveur-de-Montagut | Sant Sauvador de Montagut |
| 07085 | Empurany | Empurani |
| 07014 | Arlebosc | Arlabòsc |
| 07338 | Vernoux-en-Vivarais | Vernons de Vivarés |
| 07073 | Le Crestet | Crestet |
| 07216 | Saint-Barthélemy-Grozon | Sant Bertomieu e Grauson |
| 07083 | Dunière-sur-Eyrieux | Dunièra d'Eiriu |
| 07095 | Gilhoc-sur-Ormèze | Gilhòc |
| 07035 | Boffres | Baufred |
| 07040 | Boucieu-le-Roi | Bociu |
| 07233 | Saint-Étienne-de-Serre | Sant Estève de Serre |
| 07179 | Pourchères | Porchèiras |
| 07074 | Creysseilles | Creisselha |
| 07092 | Freyssenet | Fraissenet |
| 07340 | Veyras | Vairàs |
| 07032 | Berzème | Berseme |
| 07146 | Lyas | Liaç |
| 07194 | Rochessauve | Ròchassauva |
| 07186 | Privas | Privàs |
| 07008 | Alissas | Alissaç |
| 07072 | Coux | Cos |
| 07283 | Saint-Pierre-la-Roche | Sant Pèire de la Ròcha |
| 07167 | Les Ollières-sur-Eyrieux | Las Olièras |
| 07066 | Chomérac | Chaumeirac |
| 07302 | Saint-Vincent-de-Barrès | Sant Vincenç de Barrès |
| 07022 | Baix | Bais |
| 07181 | Le Pouzin | Lo Posin |
| 07076 | Cruas | Cruaç |
| 07349 | La Voulte-sur-Rhône | La Vòuta |
| 07287 | Saint-Pons | Sant Ponç |
| 07005 | Alba-la-Romaine | Aps |
| 07311 | Sceautres | Seutre |
| 07020 | Aubignas | Aubinhac |
| 07319 | Le Teil | Lo Telh |
| 07191 | Rochemaure | Ròchamaura |
| 07157 | Meysse | Meissa |
| 07010 | Annonay | Anonai |
| 07265 | Saint-Marcel-lès-Annonay | Sant Marcèl d'Anonai |
| 07041 | Boulieu-lès-Annonay | Boliu |
| 07197 | Roiffieux | Reifiu |
| 07310 | Savas | Savat |
| 07225 | Saint-Clair | Sant Clar |
| 07007 | Alboussière | Albossèira |
| 07261 | Saint-Laurent-du-Pape | Sant Laurenç dau Papa |
| 07052 | Champis | Champís |
| 07323 | Toulaud | Tolau |
| 07177 | Plats | Plan |
| 07293 | Saint-Romain-de-Lerps | Sant Roman de Lern |
| 07027 | Beauchastel | Bèuchastèl |
| 07070 | Cornas | Cornaç |
| 07059 | Châteaubourg | Chastèlboc |
| 07316 | Soyons | Soion |
| 07102 | Guilherand-Granges | Guilharand e Las Granjas |
| 07078 | Davézieux | Daveisiu |
| 07337 | Vernosc-lès-Annonay | Vernòsc |
| 07172 | Peaugres | Piaugre |
| 07227 | Saint-Cyr | Sant Círan |
| 07067 | Colombier-le-Cardinal | Colombèir lo Cardinal |
| 07321 | Thorrenc | Torenc |
| 07036 | Bogy | Bògin |
| 07317 | Talencieux | Talanciu |
| 07234 | Saint-Étienne-de-Valoux | Sant Estève de Valós |
| 07228 | Saint-Désirat | Sant Desirat |
| 07009 | Andance | Andança |
| 07308 | Sarras | Sarat |
| 07312 | Sécheras | Secharàs |
| 07169 | Ozon | Auzon |
| 07245 | Saint-Jean-de-Muzols | Sant Joan de Misòsc |
| 07324 | Tournon-sur-Rhône | Tornon |
| 07015 | Arras-sur-Rhône | Aràs dau Ròse |
| 07153 | Mayres | Maires |
| 07025 | Barnas | Barnàs |
| 07127 | Lalevade-d'Ardèche | La Levada |
| 07047 | Cellier-du-Luc | Lo Celièr |
| 07322 | Thueyts | Tuèits |
| 07018 | Astet | Astelh |
| 07156 | Meyras | Meiràs |
| 07178 | Pont-de-Labeaume | Lo Pònt de La Bauma |
| 07175 | Le Plagnal | Lo Planhòu |
| 07065 | Chirols | Chiròus |
| 07206 | Saint-Alban-en-Montagne | Sant Alban de Montanha |
| 07154 | Mazan-l'Abbaye | Masam l'Abaia |
| 07142 | Lespéron | L'Esperon |
| 07111 | Juvinas | Juvinàs |
| 07161 | Montpezat-sous-Bauzon | Montpesat de Bauson |
| 07282 | Saint-Pierre-de-Colombier | Sant Pèire delh Colombier |
| 07200 | Le Roux | Lo Ros |
| 07130 | Lanarce | La Narsa |
| 07137 | Lavillatte | La Vialata |
| 07112 | Labastide-sur-Bésorgues | La Bastida de Juvinàs |
| 07105 | Issanlas | Issanlaç |
| 07224 | Saint-Cirgues-en-Montagne | Sant Cirgue de Montanha |
| 07326 | Usclades-et-Rieutord | Uscladas e Riutòrt |
| 07075 | Cros-de-Géorand | Lo Cròs de Giorand |
| 07173 | Péreyres | Perèiras |
| 07071 | Coucouron | Cocoron |
| 07203 | Sagnes-et-Goudoulet | Las Sanhas e Gaudolet |
| 07120 | Lachamp-Raphaël | La Chalm (de) Rafaelh |
| 07121 | Lachapelle-Graillouse | La Chapèla Gralhosa |
| 07147 | Malarce-sur-la-Thines | Malharsa |
| 07100 | Gravières | Gravièiras |
| 07148 | Malbosc | Malbòsc |
| 07334 | Les Vans | Los Vans |
| 07284 | Saint-Pierre-Saint-Jean | Sant Pèire e Sant Joan |
| 07305 | Les Salelles | Salèlas |
| 07024 | Banne | Bana |
| 07050 | Chambonas | Chambonàs |
| 07213 | Saint-André-Lachamp | Sant Andrieu Lo Camp |
| 07171 | Payzac | Paisac |
| 07088 | Faugères | Felgèiras |
| 07280 | Saint-Paul-le-Jeune | Sant Pau lo Nòu |
| 07176 | Planzolles | Planzòlas |
| 07136 | Laveyrune | La Veiruna |
| 07232 | Saint-Étienne-de-Lugdarès | Sant Estève de Ludarès |
| 07262 | Saint-Laurent-les-Bains-Laval-d'Aurelle | Sant Laurenç daus Banhs e L'Aval d'Aurèla |
| 07163 | Montselgues | Montselga |
| 07266 | Sainte-Marguerite-Lafigère | Santa Margareta de la Figièira |
| 07038 | Borne | Bòrna |
| 07202 | Sablières | Sablèiras |
| 07144 | Loubaresse | Lobaressa |
| 07235 | Sainte-Eulalie | Santa Aulàlia |
| 07119 | Le Lac-d'Issarlès | Lo Lac d'Issarlés |
| 07106 | Issarlès | Issarlés |
| 07026 | Le Béage | Lo Biage |
| 07037 | Borée | Borèia |
| 07195 | La Rochette | La Rocheta |
| 07267 | Saint-Martial | Sent Marçau |
| 07226 | Saint-Clément | Sant Clamenç |
| 07209 | Saint-Andéol-de-Fourchades | Sant Andiòu de Forchadas |
| 07054 | Chanéac | Chaniac |
| 07049 | Le Chambon | Lo Chambon |
| 07012 | Arcens | Arcen |
| 07151 | Mars | Març |
| 07103 | Saint-Julien-d'Intres | Sant Julian d'Intras |
| 07082 | Dornas | Dornàs |
| 07269 | Saint-Martin-de-Valamas | Sant Martin de Valamàs |
| 07001 | Accons | Acons |
| 07006 | Albon-d'Ardèche | Aubon d'Ardecha |
| 07064 | Le Cheylard | Lo Chailar |
| 07220 | Saint-Christol | Sant Christòl |
| 07017 | Les Assions | Los Acions |
| 07117 | Lablachère | La Blachèira |
| 07238 | Saint-Genest-de-Beauzon | Sant Ginèis de Bauson |
| 07189 | Ribes | Ribas |
| 07031 | Berrias-et-Casteljau | Beriàs e Castèljaug |
| 07211 | Saint-André-de-Cruzières | Sant Andrieu de Crusièira |
| 07110 | Joyeuse | Juèsa |
| 07028 | Beaulieu | Bèuluòc |
| 07294 | Saint-Sauveur-de-Cruzières | Sant Sauvador de Crusièiras |
| 07053 | Chandolas | Chandolàs |
| 07199 | Rosières | Rosièiras |
| 07101 | Grospierres | Grogpèira |
| 07207 | Saint-Alban-Auriolles | Sant Auban e Auriòlas |
| 07134 | Laurac-en-Vivarais | Laurac de Vivarés |
| 07162 | Montréal | Montreau |
| 07033 | Bessas | Beçaç |
| 07115 | Labeaume | La Bauma |
| 07329 | Valgorge | Vaugòrja |
| 07081 | Dompnac | Domnac |
| 07315 | La Souche | La Socha |
| 07275 | Saint-Mélany | Sant Melani |
| 07118 | Laboule | La Bola |
| 07029 | Beaumont | Bèlmont |
| 07196 | Rocles | Ròcla |
| 07307 | Sanilhac | Senilhac |
| 07109 | Joannas | Joanàs |
| 07318 | Tauriers | Taurièrs |
| 07223 | Saint-Cirgues-de-Prades | Sant Cirgue de Pradas |
| 07087 | Fabras | Fabràs |
| 07141 | Lentillères | Lentilhièira |
| 07193 | Rocher | Rochier |
| 07058 | Chassiers | Chassièr |
| 07132 | Largentière | L'Argentèira |
| 07062 | Chazeaux | Chasau |
| 07182 | Prades | Pradas |

## 6. Relevé par département (sans appel d'API, rien modifié)

Critère : nom occitan contenant un mot français évident, mot entier : Jean, sur, sous, les, le, du, des, aux, saint, sainte, lès (« en » et « et » sont exclus : mots aussi occitans). **Total : 65 noms sur 9807 noms occitans (10042 communes, 41 fichiers), dans 13 fichiers.** Dans l'Ardèche il en restait 2 (les deux « Jean ») : ils sont maintenant masqués, donc 0.

| Dép. | Communes | Avec nom occitan | Mots français |
|---|---|---|---|
| 03 | 118 | 115 | 2 |
| 04 | 198 | 198 | 0 |
| 05 | 162 | 149 | 0 |
| 06 | 161 | 161 | 0 |
| 07 | 330 | 300 | 0 |
| 09 | 325 | 324 | 9 |
| 11 | 432 | 432 | 8 |
| 12 | 285 | 284 | 1 |
| 13 | 119 | 119 | 0 |
| 15 | 250 | 250 | 0 |
| 16 | 120 | 116 | 0 |
| 18 | 4 | 4 | 0 |
| 19 | 277 | 277 | 0 |
| 23 | 254 | 253 | 4 |
| 24 | 503 | 502 | 0 |
| 26 | 361 | 340 | 0 |
| 30 | 350 | 349 | 0 |
| 31 | 586 | 586 | 12 |
| 32 | 458 | 457 | 1 |
| 33 | 443 | 441 | 0 |
| 34 | 341 | 341 | 2 |
| 36 | 17 | 15 | 0 |
| 38 | 67 | 61 | 0 |
| 40 | 327 | 327 | 0 |
| 42 | 19 | 19 | 0 |
| 43 | 257 | 238 | 0 |
| 46 | 312 | 311 | 0 |
| 47 | 316 | 315 | 0 |
| 48 | 152 | 152 | 0 |
| 63 | 460 | 450 | 21 |
| 64 | 450 | 416 | 1 |
| 65 | 469 | 469 | 0 |
| 66 | 3 | 3 | 0 |
| 81 | 314 | 314 | 1 |
| 82 | 195 | 195 | 2 |
| 83 | 153 | 153 | 0 |
| 84 | 151 | 151 | 0 |
| 86 | 5 | 5 | 0 |
| 87 | 195 | 195 | 1 |
| ARAN | 9 | 9 | 0 |
| IT | 94 | 11 | 0 |

Détail des 65 cas (état après le commit ; « Nom » est ce que la carte écrit) :

| Dép. | Code | Commune | Nom |
|---|---|---|---|
| 03 | 03164 | Le Mayet-d'École | Le Maiet d'Escòla |
| 03 | 03043 | Broût-Vernet | Brot e Le Vernet |
| 09 | 09063 | Le Bosc | Le Bòsc |
| 09 | 09231 | Le Port | Le Pòrt |
| 09 | 09079 | Carla-Bayle | Le Carlar de Baile |
| 09 | 09181 | Le Mas-d'Azil | Le Mas d'Asil |
| 09 | 09229 | Le Peyrat | Le Peirat |
| 09 | 09281 | Sautel | Le Sautèlh |
| 09 | 09080 | Carla-de-Roquefort | Le Carlar de Ròcafòrt |
| 09 | 09238 | Les Pujols | Les Pujòls |
| 09 | 09145 | Les Issards | Les Eissarts |
| 11 | 11221 | Les Martys | Les Martins |
| 11 | 11074 | Les Cassés | Les Casses |
| 11 | 11277 | Pécharic-et-le-Py | Puègaric e Le Pin |
| 11 | 11357 | Saint-Martin-le-Vieil | Sant Martin le Vièlh |
| 11 | 11054 | Les Brunels | Les Brunèls |
| 11 | 11358 | Saint-Martin-Lys | Sant Martin de Les |
| 11 | 11223 | Mas-des-Cours | Le Mas |
| 11 | 11414 | Villar-en-Val | Le Vilar en Val |
| 12 | 12172 | Le Nayrac | Le Nairac |
| 23 | 23183 | Saint-Avit-le-Pauvre | Sent Avit le Paubre |
| 23 | 23074 | Le Donzeil | Sent Saupise le Donselh |
| 23 | 23029 | Le Bourg-d'Hem | Le Borg d'Hem |
| 23 | 23095 | Le Grand-Bourg | Le Borg (de Salanhac) |
| 31 | 31082 | Bourg-Saint-Bernard | Le Borg de Sant Bernat |
| 31 | 31418 | Pin-Balma | Le Pin de Balmar |
| 31 | 31488 | Saint-Jean | Sent Joan le Vièlh |
| 31 | 31180 | Falga | Le Falgar |
| 31 | 31570 | Vaux | Le Bauç |
| 31 | 31120 | Le Castéra | Le Casterar |
| 31 | 31234 | Le Grès | Le Gres |
| 31 | 31093 | Le Burgaud | Le Burgau |
| 31 | 31419 | Le Pin-Murelet | Le Pin Murelet |
| 31 | 31193 | Le Fousseret | Le Hosseret |
| 31 | 31181 | Le Fauga | Le Haugar |
| 31 | 31292 | Lescuns | Les Cunhs |
| 32 | 32207 | Leboulin | Le Bolin |
| 34 | 34057 | Castelnau-le-Lez | Castèlnòu de Les |
| 34 | 34217 | Prades-le-Lez | Pradas de Les |
| 63 | 63048 | Bourg-Lastic | Le Borg de Lastic |
| 63 | 63292 | Puy-Saint-Gulmier | Le Puèi Sent Gulmèir |
| 63 | 63246 | Murat-le-Quaire | Murat e le Caire |
| 63 | 63407 | Saulzet-le-Froid | Sauset le Freid |
| 63 | 63449 | Le Vernet-Sainte-Marguerite | Le Vernet Senta Margarita |
| 63 | 63234 | Montaigut-le-Blanc | Montagut le Blanc |
| 63 | 63237 | Montel-de-Gelat | Le Montelh Dejalat |
| 63 | 63293 | Le Quartier | Le Quartièr |
| 63 | 63157 | Fayet-le-Château | Faiet le Chastèl |
| 63 | 63230 | Le Monestier | Le Monestèir |
| 63 | 63231 | La Monnerie-le-Montel | La Monèria e le Montelh |
| 63 | 63108 | Le Cheix-sur-Morge | Le Chèir |
| 63 | 63317 | Saint-André-le-Coq | Sent Andrè le Jau |
| 63 | 63006 | Anzat-le-Luguet | Anzac e le Luguet |
| 63 | 63440 | Valbeleix | Le Bòsc Belet |
| 63 | 63158 | Fayet-Ronaye | Le Faiet e Ronaias |
| 63 | 63323 | Saint-Bonnet-le-Bourg | Sent Bonet le Borg |
| 63 | 63448 | Le Vernet-Chaméane | Le Varnet e Chamiana |
| 63 | 63079 | Champagnat-le-Jeune | Champanhac le Joine |
| 63 | 63052 | Le Breuil-sur-Couze | Le Bruelh de Cosa |
| 63 | 63054 | Le Broc | Le Bròc |
| 64 | 64330 | Lées-Athas | Les e Atàs |
| 81 | 81055 | Les Cammazes | Les Capmases |
| 82 | 82105 | Mas-Grenier | Le Mas Granièr |
| 82 | 82036 | Le Causé | Le Cause |
| 87 | 87059 | Le Dorat | Le Daurat |

Précautions de lecture : « Le » et « Les » en tête (Le Bòsc, Le Pòrt, Les Martins, Le Borg de Lastic…) sont très probablement des noms à demi français, mais certaines graphies locales (gascon, auvergnat) pourraient employer ces formes : à relire un par un, aucun n'a été vérifié. Une autre détection, « nom occitan = nom français à Saint→Sant près, trois mots ou plus », est un mauvais indicateur hors de l'Ardèche : elle renvoie surtout des noms légitimes (Canet de Salars, Sant Martin de Crau, Gontaud de Nogaret…). Je ne l'ai pas retenue.

## La suite (à décider par la session cheffe ou Romain)

- **Une source pour l'Ardèche** : l'API ne peut rien confirmer sur ce département (ni sur la Drôme, le Gard, l'Hérault…, hors de sa liste). Piste : Wikidata / Wikipédia en occitan (libellé `oc` de chaque commune comparé aux noms de la carte, sans rien copier dans le dépôt), puis relecture des écarts par Romain. Je ne l'ai pas fait : hors du périmètre demandé (« aucune nouvelle forme occitane »).
- **Les 65 cas du relevé** hors Ardèche : sept départements concernés (09, 12, 31, 32, 64, 81, 82) sont couverts par top'Òc, qui peut y confirmer ou contredire ; six ne le sont pas (03, 11, 23, 34, 63, 87) et auront le même problème de source que l'Ardèche.
- À consigner par la session cheffe au cahier §11 : « Carte, 2026-11-12 : 11 noms de communes d'Ardèche masqués (français à peine retouché, ou nom d'une autre commune) ; top'Òc ne couvre pas l'Ardèche, aucun nom du département n'est confirmé par lo Congrès (300 non confirmés). »
