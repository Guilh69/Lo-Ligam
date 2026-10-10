// Las fichas del panèl « Autras lengas » (opcion A causida per Romain,
// 2026-10-10) : familha de la lenga, e quand son verificats, lo nombre de
// locutors (amb sa font e son annada) e l'estat de la lenga (UNESCO).
// Los chifras venon de SIG/lengas-fichas.json (recèrca sorsada) ; tant que
// manca un chifra, la ficha l'aficha pas.
export const FICHAS = {
	catalan: { familha: { oc: 'romana', fr: 'romane' } },
	arpitan: { familha: { oc: 'romana', fr: 'romane' } },
	basc: { familha: { oc: 'isolat', fr: 'isolat' } },
	oil: { familha: { oc: 'romanas, una familha', fr: 'romanes, une famille' } },
	alsacian: { familha: { oc: 'germanica, alemanica', fr: 'germanique, alémanique' } },
	francic: { familha: { oc: 'germanica, francica', fr: 'germanique, francique' } },
	breton: { familha: { oc: 'celtica', fr: 'celtique' } },
	cors: { familha: { oc: 'romana', fr: 'romane' } },
	flamenc: { familha: { oc: 'germanica', fr: 'germanique' } }
};

// L'estat de la lenga (atlas de l'UNESCO) : sa color dins la ficha
export const VITALITAT = {
	vulnerabla: '#7fd67a',
	en_dangier: '#ffb35c',
	en_dangier_greu: '#ff6b5a',
	critica: '#d0304a'
};
