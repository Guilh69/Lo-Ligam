// Données de l'accueil (portées de l'esbòs de nuèch, app/static/esbos-nuech.html,
// validé par Romain le 2026-10-06/07). Occitan nouveau : À VALIDER par Romain
// (dicodòc / lo Congrès) avant publication.

// Page de réservation Proton Calendar (publique par nature)
export const RESERVAR = 'https://calendar.proton.me/bookings#6BO-KwKfCW0KRCL2AzR9cHUjmv11u_m_7A6Pfwpfu0w=';

// Bandèl : mots pescats dins lo Lexic de Max Roqueta (establit per Joan-Guilhèm
// Roqueta, ed. 2020 ; Modules_cors/Base_donnees_linguistica), revirada del lexic.
// Causida de Claude, A VALIDAR per Romain.
export const MOTS = [['lo risolet', 'le sourire'], ['la rispa', 'la bise'], ['la rogeiròla', 'le ciel rouge du crépuscule'], ['la roèla', 'le coquelicot'], ['la romieva', 'l’oie sauvage'], ['lo rodaire', 'l’errant'], ['lo lindau', 'le seuil'], ['l’abelhòla', 'le guêpier'], ['l’abitarèla', 'le refuge'], ['abelugat', 'étincelant'], ['a l’embrunit', 'à la tombée de la nuit']];

// Manifèst : cada mot s'alumena amb lo defilament.
export const MANIFEST = {
	// PROPOSICION A (frasa-clau de causir per Romain, occitan de validar)
	oc: [['Aicí, l’occitan s’apren'], ['sens vergonha', 1], ['e'], ['amb benvolença,', 1], ['e cada leiçon fa'], ['ligam.', 1]],
	fr: [['Ici, l’occitan s’apprend'], ['sans honte', 1], ['et'], ['avec bienveillance,', 1], ['et chaque leçon crée du'], ['lien.', 1]]
};

// Camins : las quatre familhas del site (siteSections.js).
export const CAMINS = [
	{ oc: 'Aprene', fr: 'Apprendre', toc: 'L’esquina del site', tfr: 'La colonne vertébrale', media: 'retrat',
		items: [['Lo parcors', 'Le parcours', '/aprene'], ['Leiçon d’ensag', 'Leçon d’essai', '/aprene/essai'], ['Ma progression', 'Ma progression', '/compte']] },
	{ oc: 'Descobrir', fr: 'Découvrir', toc: 'Lo país e sa cultura', tfr: 'Le pays et sa culture', media: 'paisatge',
		items: [['La carta', 'La carte', '/carta'], ['Mots en imatges', 'Mots en images', '/mots'], ['Òbras', 'Œuvres', '/obras']] },
	{ oc: 'Participar', fr: 'Participer', toc: 'La comunautat', tfr: 'La communauté', media: 'tipo',
		items: [['Forum', 'Forum'], ['Grops', 'Groupes'], ['Boita d’idèas', 'Boîte à idées']] },
	{ oc: 'Lo Ligam', fr: 'Lo Ligam', toc: 'Qual soi', tfr: 'Qui suis-je', media: 'simbol',
		items: [['Mon istòria', 'Mon histoire'], ['Ressorsas occitanas', 'Ressources occitanes'], ['Contacte', 'Contact']] }
];

// Tèxtes en anglés, espanhòl e catalan : A VERIFICAR per un locutor.
export const CONSIGNAS = {
	fr: ['fr', 'Cours depuis le français. Précise-le en réservant.'],
	en: ['en', 'Lessons taught from English. Just mention it when you book.'],
	es: ['es', 'Clases desde el castellano. Indícalo al reservar.'],
	ca: ['ca', 'Classes des del català. Indica-ho en reservar.']
};

// Bandièras simplificadas (bandas e crotz, sens emblèmas). Al clic, las
// bandièras de païses ont la lenga se parla defilan lèu, puèi s'estabilizan
// sus la bandièra de l'origina de la lenga : un clin d'uèlh a las lengas de
// colonizacion, que son pas solament las d'un país.
const cB = '#34508f', cBc = '#7fa9d4', cW = '#e9e0cf', cR = '#b8473f', cJ = '#e6b13e', cV = '#3f7a4a', cO = '#d9822b', cN = '#1c1714';
const v3 = (a, b, c) => 'linear-gradient(90deg,' + a + ' 0 33.4%,' + b + ' 33.4% 66.6%,' + c + ' 66.6%)';
const h3 = (a, b, c) => 'linear-gradient(' + a + ' 0 33.4%,' + b + ' 33.4% 66.6%,' + c + ' 66.6%)';
const crotz = (fons, c, lv, lh) => 'linear-gradient(' + c + ',' + c + ') center/' + lv + ' no-repeat, linear-gradient(' + c + ',' + c + ') center/' + lh + ' no-repeat, ' + fons;
export const DRAPEUS = {
	fr: v3(cB, cW, cR), be: v3(cN, cJ, cR), sn: v3(cV, cJ, cR), ci: v3(cO, cW, cV), ht: 'linear-gradient(' + cB + ' 0 50%,' + cR + ' 50%)',
	ch: crotz(cR, cW, '8% 60%', '24% 20%'), qc: 'radial-gradient(circle at 23% 25%,' + cW + ' 0 5%, transparent 5.5%), radial-gradient(circle at 77% 25%,' + cW + ' 0 5%, transparent 5.5%), radial-gradient(circle at 23% 75%,' + cW + ' 0 5%, transparent 5.5%), radial-gradient(circle at 77% 75%,' + cW + ' 0 5%, transparent 5.5%), ' + crotz(cB, cW, '8% 100%', '100% 22%'),
	uk: 'linear-gradient(90deg, transparent 45%,' + cR + ' 45% 55%, transparent 55%), linear-gradient(transparent 38%,' + cR + ' 38% 62%, transparent 62%), linear-gradient(90deg, transparent 41%,' + cW + ' 41% 59%, transparent 59%), linear-gradient(transparent 30%,' + cW + ' 30% 70%, transparent 70%), linear-gradient(to top right, transparent 45%,' + cR + ' 47% 50%,' + cW + ' 50% 55%, transparent 55%), linear-gradient(to bottom right, transparent 45%,' + cW + ' 45% 50%,' + cR + ' 50% 53%, transparent 55%), #2c3f74', us: 'linear-gradient(' + cB + ',' + cB + ') 0 0/42% 54% no-repeat, repeating-linear-gradient(' + cR + ' 0 7.69%,' + cW + ' 7.69% 15.38%)',
	ie: v3(cV, cW, cO), in: h3(cO, cW, cV), ng: v3(cV, cW, cV), cn: 'linear-gradient(90deg,' + cR + ' 0 25%,' + cW + ' 25% 75%,' + cR + ' 75%)',
	es: 'linear-gradient(' + cR + ' 0 25%,' + cJ + ' 25% 75%,' + cR + ' 75%)', mx: v3(cV, cW, cR), ar: h3(cBc, cW, cBc), pe: v3(cR, cW, cR),
	co: 'linear-gradient(' + cJ + ' 0 50%,' + cB + ' 50% 75%,' + cR + ' 75%)', cl: 'linear-gradient(' + cB + ',' + cB + ') 0 0/34% 50% no-repeat, linear-gradient(' + cW + ' 0 50%,' + cR + ' 50%)',
	ad: v3(cB, cJ, cR), cat: 'repeating-linear-gradient(' + cJ + ' 0 11.11%,' + cR + ' 11.11% 22.22%)'
};
export const SEQ = {
	fr: ['sn', 'be', 'ht', 'ch', 'ci', 'qc', 'fr'],
	en: ['us', 'in', 'ng', 'ie', 'cn', 'uk'],
	es: ['mx', 'ar', 'co', 'pe', 'cl', 'es'],
	ca: ['ad', 'cat']
};

