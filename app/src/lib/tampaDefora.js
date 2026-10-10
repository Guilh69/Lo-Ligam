// Principi del site (Romain, 2026-10-10) : un clic defòra tampa çò qu'es
// dobèrt (tirador, lista, bulla). Se lo clic tomba sus un autre boton, l'activa
// tanben (jamai dos clics) ; se tomba sus la carta, tampa sonque (pas cap
// d'accion per error sus la carta).
//
// dedins(element) → true se lo clic es dins la zòna que demòra dobèrta.
// Torna la foncion que lèva los escotadors (per un $effect).
export function tampaDefòra(dedins, tampar) {
	let avalar = false;
	let actiu = true;
	const jos = (e) => {
		avalar = false;
		const t = e.target;
		if (!(t instanceof Element) || dedins(t)) return;
		tampar();
		if (t.closest('.leaflet-container') && !t.closest('.leaflet-control, button, a, input, select, textarea, label, [role="button"]')) avalar = true;
	};
	const clic = (e) => {
		if (avalar) {
			avalar = false;
			e.stopPropagation();
			e.preventDefault();
		}
		if (!actiu) document.removeEventListener('click', clic, true);
	};
	document.addEventListener('pointerdown', jos, true);
	document.addEventListener('click', clic, true);
	// tampar() desmonta l'$effect abans que lo clic arribe : l'escotador del
	// clic demòra fins a aquel clic (o fins al clic seguent, se n'i a pas)
	return () => {
		actiu = false;
		document.removeEventListener('pointerdown', jos, true);
		if (!avalar) return document.removeEventListener('click', clic, true);
		document.addEventListener(
			'pointerdown',
			() => {
				avalar = false;
				document.removeEventListener('click', clic, true);
			},
			{ capture: true, once: true }
		);
	};
}
