<script>
	// Pictogrammes des cases de S'apren (2026-10-24), dessinés maison au trait
	// comme les icônes d'identité (charte §5ter) : un écran et une personne
	// (visio), un chemin (parcours), un dé (leçon d'essai), une image (mots en
	// images), des barres qui montent (progression) ; pour Se parla (25-10), une
	// carte pliée, un livre ouvert (wiki), deux notes (œuvres), une page
	// d'écriture (articles) ; pour Amassa (25-10), trois personnes (groupes),
	// deux bulles (forum), une ampoule (boîte à idées), une pile d'images
	// (Instagram). Toujours décoratifs : la
	// case porte son nom en toutes lettres.
	let { nom = 'autre', size = '3rem' } = $props();
</script>

<svg
	class="picto"
	viewBox="0 0 48 48"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="2.2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if nom === 'visio'}
		<rect x="5" y="8" width="38" height="26" rx="3" />
		<circle cx="24" cy="18" r="4.5" />
		<path d="M15.5 34c1.4-5.6 4.6-8.4 8.5-8.4s7.1 2.8 8.5 8.4" />
		<path d="M24 34v6M16 40h16" />
	{:else if nom === 'parcors'}
		<path d="M10 40c0-8 28-6 28-15S12 19 12 11" />
		<circle cx="10" cy="40" r="2.6" fill="currentColor" />
		<path d="M12 11V4l9 3.5-9 3.5" />
	{:else if nom === 'ensag'}
		<rect x="8" y="8" width="32" height="32" rx="6" />
		<circle cx="17" cy="17" r="2.4" fill="currentColor" stroke="none" />
		<circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
		<circle cx="31" cy="31" r="2.4" fill="currentColor" stroke="none" />
	{:else if nom === 'mots'}
		<rect x="5" y="9" width="38" height="30" rx="3" />
		<circle cx="16" cy="19" r="3.5" />
		<path d="M7 36l11-11 7 7 5-5 11 10" />
	{:else if nom === 'progression'}
		<path d="M6 41h36" />
		<rect x="9" y="29" width="7" height="12" />
		<rect x="20.5" y="21" width="7" height="20" />
		<rect x="32" y="11" width="7" height="30" />
	{:else if nom === 'carta'}
		<path d="M5 12l12.7-5 12.6 5L43 7v29l-12.7 5-12.6-5L5 41z" />
		<path d="M17.7 7v29M30.3 12v29" />
	{:else if nom === 'wiki'}
		<path d="M24 13c-5-4-12-4.5-18-2.5v27c6-2 13-1.5 18 2.5 5-4 12-4.5 18-2.5v-27c-6-2-13-1.5-18 2.5z" />
		<path d="M24 13v27" />
	{:else if nom === 'obras'}
		<path d="M18 35V11l20-4.5v24" />
		<circle cx="13.5" cy="35" r="4.5" />
		<circle cx="33.5" cy="30.5" r="4.5" />
	{:else if nom === 'articles'}
		<rect x="7" y="7" width="34" height="34" rx="3" />
		<path d="M13 15h22M13 22h22M13 29h22M13 36h13" />
	{:else if nom === 'grops'}
		<circle cx="24" cy="14" r="5" />
		<path d="M14.5 36c1.2-6.6 4.8-10 9.5-10s8.3 3.4 9.5 10" />
		<circle cx="10.5" cy="20" r="3.8" />
		<path d="M3.5 36c.8-4.8 3.4-7.5 7-7.5 1.6 0 3 .5 4.1 1.5" />
		<circle cx="37.5" cy="20" r="3.8" />
		<path d="M44.5 36c-.8-4.8-3.4-7.5-7-7.5-1.6 0-3 .5-4.1 1.5" />
	{:else if nom === 'forum'}
		<path d="M6 9h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-7 6v-6H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z" />
		<path d="M37 17h5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-2v6l-7-6H24a3 3 0 0 1-3-3v-1" />
	{:else if nom === 'ideas'}
		<path d="M17.5 33c0-4.5-6.5-7.5-6.5-15a13 13 0 0 1 26 0c0 7.5-6.5 10.5-6.5 15z" />
		<path d="M18 38.5h12M20 43.5h8" />
		<path d="M24 33V22l-3.5-3.5M24 22l3.5-3.5" />
	{:else if nom === 'imatges'}
		<rect x="12" y="12" width="30" height="30" rx="5" />
		<path d="M6 34V10a4 4 0 0 1 4-4h24" />
		<circle cx="27" cy="27" r="6.5" />
		<circle cx="35.5" cy="18.5" r="1.4" fill="currentColor" stroke="none" />
	{:else}
		<circle cx="24" cy="24" r="17" />
		<path d="M16 24h16M26 17l7 7-7 7" />
	{/if}
</svg>
