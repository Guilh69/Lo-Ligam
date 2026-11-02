// Les mots de la page du parcours. L'occitan reste en vedette ; la glose entre
// parenthèses suit la langue choisie (le français quand on lit en occitan).
// Occitan passé par l'API de lo Congrès le 2026-11-02 (nivèl, blòc, sus,
// contunhar, començar, siás, aicí, clavat, acaba, dobrir, fach, etapa,
// fogassa ; clavada et facha vérifiés par Joan ; preparacion le même jour) :
// relu et validé par Romain le 2026-11-02, note du compte comprise.
// Espagnol, anglais et catalan relus par Aran le même jour ; « cerrado / abrir »
// et « tancat / obrir » gardés plutôt que « bloqueado » et « bloquejat »,
// fidèles à « clavat / dobrir » (choix de Romain). Arabe relu par Aran le même
// jour (mots d'interface comparés à Android, Open edX et Microsoft Learn) ; reste
// la relecture de l'ami arabophone de Romain. Règles de l'arabe ici : jamais
// d'impératif (il marquerait le genre du lecteur) mais un nom d'action pour les
// boutons (متابعة, بدء) et la 3e personne pour les indices (يُفتح…) ; « خطوات » et
// « وحدات » ne vont qu'avec un nombre de 3 à 10 (dès 11 : « 38 وحدة », singulier).
// Le nom et son numéro (ou « A1 ») sont liés par une espace insécable (\u00a0) :
// un chiffre ne reste pas seul en début de ligne.

export const T = {
	titol: { oc: 'Lo parcors', fr: 'Le parcours', es: 'El recorrido', en: 'The learning path', ca: 'El recorregut', ar: 'مسار التعلّم' },
	sApren: { oc: 'S’apren', fr: 'S’apprend', es: 'Se aprende', en: 'Learn', ca: 'S’aprèn', ar: 'نتعلّم' },
	nivel: { oc: 'Nivèl', fr: 'Niveau', es: 'Nivel', en: 'Level', ca: 'Nivell', ar: 'المستوى' },
	nivels: { oc: 'Los nivèls', fr: 'Les niveaux', es: 'Los niveles', en: 'The levels', ca: 'Els nivells', ar: 'المستويات' },
	bloc: { oc: 'Blòc', fr: 'Bloc', es: 'Bloque', en: 'Block', ca: 'Bloc', ar: 'المرحلة' },
	sus: { oc: 'sus', fr: 'sur', es: 'de', en: 'of', ca: 'de', ar: 'من' },
	moduls: { oc: 'moduls', fr: 'modules', es: 'módulos', en: 'modules', ca: 'mòduls', ar: 'وحدات' },
	etapas: { oc: 'etapas', fr: 'étapes', es: 'etapas', en: 'steps', ca: 'etapes', ar: 'خطوات' },
	unitat: { oc: 'Unitat', fr: 'Unité', es: 'Unidad', en: 'Unit', ca: 'Unitat', ar: 'الفصل' },
	contunhar: { oc: 'Contunhar', fr: 'continuer', es: 'continuar', en: 'continue', ca: 'continuar', ar: 'متابعة' },
	començar: { oc: 'Començar', fr: 'commencer', es: 'empezar', en: 'start', ca: 'començar', ar: 'بدء' },
	siasAici: { oc: 'Siás aicí', fr: 'tu es ici', es: 'estás aquí', en: 'you are here', ca: 'ets aquí', ar: 'أنت هنا' },
	clavat: { oc: 'clavat', fr: 'fermé', es: 'cerrado', en: 'locked', ca: 'tancat', ar: 'مقفل' },
	fach: { oc: 'fach', fr: 'fait', es: 'hecho', en: 'done', ca: 'fet', ar: 'مكتمل' },
	clavada: { oc: 'clavada', fr: 'fermée', es: 'cerrada', en: 'locked', ca: 'tancada', ar: 'مقفلة' },
	facha: { oc: 'facha', fr: 'faite', es: 'hecha', en: 'done', ca: 'feta', ar: 'مكتملة' },
	fogassas: { oc: 'fogassas', fr: 'fougasses', es: 'fougasses', en: 'fougasses', ca: 'fogasses', ar: 'فوغاسات' },
	acabat: { oc: 'Nivèl A1 acabat, òsca !', fr: 'niveau A1 terminé, bravo !', es: '¡nivel A1 terminado, bravo!', en: 'level A1 complete, well done!', ca: 'nivell A1 acabat, enhorabona!', ar: 'اكتمل المستوى\u00a0A1، أحسنت!' }
};

/** « Unitat 2 », « Pausa 1 »… : le nom court d'une étape, dans chaque langue */
export function nomEtapa(e) {
	if (e.tipe === 'unitat')
		return { oc: `Unitat ${e.numero}`, fr: `unité ${e.numero}`, es: `unidad ${e.numero}`, en: `unit ${e.numero}`, ca: `unitat ${e.numero}`, ar: `الفصل\u00a0${e.numero}` };
	if (e.tipe === 'pausa')
		return { oc: `Pausa ${e.numero}`, fr: `halte ${e.numero}`, es: `parada ${e.numero}`, en: `stopover ${e.numero}`, ca: `parada ${e.numero}`, ar: `الاستراحة\u00a0${e.numero}` };
	if (e.tipe === 'mission') return { oc: 'Mission A1', fr: 'mission A1', es: 'misión A1', en: 'A1 mission', ca: 'missió A1', ar: 'المهمة\u00a0A1' };
	return { oc: 'Modul 0', fr: 'module 0', es: 'módulo 0', en: 'module 0', ca: 'mòdul 0', ar: 'الوحدة\u00a00' };
}

/**
 * « Acaba l'unitat 1 per la dobrir » : ce qui ouvre l'étape fermée suivante.
 * L'étape fermée (unitat, pausa, mission) est féminine en occitan, en espagnol
 * et en catalan, d'où « la » ; en arabe, la phrase est impersonnelle (« يُفتح بعد
 * إكمال… », sans impératif : pas de genre du lecteur) et son verbe suit le genre
 * de l'étape à ouvrir : masculin pour le chapitre (الفصل), féminin pour
 * l'استراحة et la مهمة.
 */
export function acabaPer(precedenta, clavada) {
	const n = precedenta.numero;
	const ar = clavada?.tipe === 'unitat' ? 'يُفتح' : 'تُفتح';
	if (precedenta.tipe === 'pausa')
		return { oc: `Acaba la pausa ${n} per la dobrir`, fr: `termine la halte ${n} pour l’ouvrir`, es: `termina la parada ${n} para abrirla`, en: `finish stopover ${n} to unlock it`, ca: `acaba la parada ${n} per obrir-la`, ar: `${ar} بعد إكمال الاستراحة\u00a0${n}` };
	if (precedenta.tipe === 'partença')
		return { oc: 'Acaba lo modul 0 per la dobrir', fr: 'termine le module 0 pour l’ouvrir', es: 'termina el módulo 0 para abrirla', en: 'finish module 0 to unlock it', ca: 'acaba el mòdul 0 per obrir-la', ar: `${ar} بعد إكمال الوحدة\u00a00` };
	return { oc: `Acaba l’unitat ${n} per la dobrir`, fr: `termine l’unité ${n} pour l’ouvrir`, es: `termina la unidad ${n} para abrirla`, en: `finish unit ${n} to unlock it`, ca: `acaba la unitat ${n} per obrir-la`, ar: `${ar} بعد إكمال الفصل\u00a0${n}` };
}

/**
 * « fach » ou « facha », « clavat » ou « clavada » : l'état accordé (le modul
 * est masculin ; l'unitat, la pausa et la mission sont féminines). Rien pour
 * une étape ouverte ou en cours.
 */
export function motEstat(estat, femenina = false) {
	if (estat === 'fach') return femenina ? T.facha : T.fach;
	if (estat === 'clavat') return femenina ? T.clavada : T.clavat;
	return null;
}

/** au bout du chemin, la porte du niveau suivant (lo nivèl : masculin) */
export const ACABA_MISSION = {
	oc: 'Acaba la mission A1 per lo dobrir',
	fr: 'termine la mission A1 pour l’ouvrir',
	es: 'termina la misión A1 para abrirlo',
	en: 'finish the A1 mission to unlock it',
	ca: 'acaba la missió A1 per obrir-lo',
	ar: 'يُفتح بعد إكمال المهمة\u00a0A1'
};

/** la mission faite, la porte reste fermée : l'A2 n'est pas encore écrit */
export const A2_EN_PREPARACION = {
	oc: 'Lo nivèl A2 es en preparacion',
	fr: 'le niveau A2 est en préparation',
	es: 'el nivel A2 está en preparación',
	en: 'level A2 is being prepared',
	ca: 'el nivell A2 està en preparació',
	ar: 'المستوى\u00a0A2 قيد الإعداد'
};

/** la note du bas de page, pour qui n'a pas de compte. L'ancienne disait que
 *  les modules suivants demanderaient un compte : faux, tout se joue sans
 *  (cahier §11) ; remplacée sur le choix de Romain le 2026-11-02. API de lo
 *  Congrès : sens, demòra, aqueste, tos, aparelh ✓ ; « navigator » est son mot
 *  pour « navigateur » ; garda et totes : l'API a planté (gardar, tot ✓) */
export const NOTA_COMPTE = {
	oc: 'Sens compte, ta progression demòra dins aqueste navigator. Un compte gratuit la garda sus totes tos aparelhs.',
	fr: 'Sans compte, ta progression reste dans ce navigateur. Un compte gratuit la garde sur tous tes appareils.',
	es: 'Sin cuenta, tu progreso se queda en este navegador. Una cuenta gratuita lo guarda en todos tus dispositivos.',
	en: 'Without an account, your progress stays in this browser. A free account keeps it on all your devices.',
	ca: 'Sense compte, el teu progrés es queda en aquest navegador. Un compte gratuït el guarda a tots els teus dispositius.',
	ar: 'من دون حساب، يبقى تقدّمك في هذا المتصفح. الحساب المجاني يحفظه على كل أجهزتك.'
};
