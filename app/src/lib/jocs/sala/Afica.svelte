<script>
	// Les affiches de la salle de jeux (Romain, 2026-11-06 : « des visuels qui
	// s'inspirent de tableaux calmes de l'Occitanie et de paysages, et moins ce
	// style vraiment IA »). Cinq paysages dessinés d'après ses photos
	// (static/apren/paisatges : garona, vilatge, riu, plana, mar-pin), à la
	// manière d'une affiche peinte : aplats doux, quelques filets fins (l'eau,
	// les champs, la roche), un grain de papier posé à part (il ne se recalcule
	// pas quand l'image bouge). Deux tons : « calme » (par défaut : couleurs
	// passées, rien ne bouge) et « joiós » (couleurs franches ; l'eau coule,
	// les arbres se balancent, les oiseaux passent), immobile si l'appareil
	// demande moins d'animations. Décoratif : rien à lire pour un lecteur
	// d'écran, la famille a son titre.
	let { id, tema = 'calme' } = $props();

	// la mer : des vagues plus serrées au loin (la perspective)
	const ONDAS = [126, 133, 141, 151, 163, 177, 193, 211, 231, 253, 277];
	const onda = (y) => `M-40 ${y}` + ' q25 -2.5 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0';
</script>

<div class="afica {id}" class:joios={tema === 'joios'} aria-hidden="true">
	<svg class="scena" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" focusable="false">
		<defs>
			<linearGradient id="cel-{id}" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" style="stop-color: var(--cel-a)" />
				<stop offset="1" style="stop-color: var(--cel-b)" />
			</linearGradient>
			<linearGradient id="aiga-{id}" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" style="stop-color: var(--aiga-a, var(--cel-b))" />
				<stop offset="1" style="stop-color: var(--aiga-b, var(--cel-b))" />
			</linearGradient>
		</defs>
		<rect width="400" height="300" fill="url(#cel-{id})" />

		{#if id === 'garona'}
			<!-- Tolosa : les toits de brique, le dôme de la Grave, un clocher à étages ; la Garonne et l'écume de la chaussée -->
			<circle class="solelh" cx="306" cy="88" r="26" fill="var(--solelh)" />
			<path
				fill="var(--luenh)"
				d="M0 182 V163 H16 V156 H30 V161 H50 V150 H62 V158 H70 V140 H116 V156 H136 V149 H154 V158 H172 V151 H190 V160 H210 V146 H224 V155 H244 V149 H262 V157 H288 V150 H320 V154 H340 V160 H356 V150 H372 V157 H400 V182 Z"
			/>
			<rect x="72" y="126" width="42" height="16" fill="var(--copola)" />
			<path fill="var(--copola)" d="M68 128 A25 28 0 0 1 118 128 Z" />
			<rect x="89" y="94" width="8" height="10" fill="var(--copola)" />
			<path fill="var(--copola)" d="M87 96 Q93 86 99 96 Z" />
			<path
				fill="var(--torre)"
				d="M290 156 V140 H292 V126 H294 V114 H296 V104 L303 74 L310 104 V114 H312 V126 H314 V140 H316 V156 Z"
			/>
			<path stroke="var(--riba)" stroke-width="1" opacity="0.55" fill="none" d="M297 134 v-5 M303 134 v-5 M309 134 v-5 M299 121 v-4 M303 121 v-4 M307 121 v-4" />
			<path fill="var(--riba)" d="M0 180 L400 171 V186 L0 196 Z" />
			<path fill="url(#aiga-garona)" d="M0 196 L400 186 V300 H0 Z" />
			<path fill="var(--escuma)" d="M0 238 L400 207 V214 L0 247 Z" />
			<g class="corrent" stroke="var(--linha)" stroke-width="1.4" stroke-linecap="round" fill="none">
				<path d="M8 268 L128 258" />
				<path d="M150 262 L300 248" />
				<path d="M40 286 L210 270" />
				<path d="M240 280 L392 264" />
				<path d="M90 226 L190 216" />
				<path d="M230 214 L340 205" />
			</g>
			<g class="ausels" fill="none" stroke="var(--ausel)" stroke-width="1.4" stroke-linecap="round">
				<path d="M226 70 q5 -5 10 0 q5 -5 10 0" />
				<path d="M252 84 q4 -4 8 0 q4 -4 8 0" />
			</g>
		{:else if id === 'vilatge'}
			<!-- Sant Guilhèm : la falaise, l'abbaye (chevet rond, clocher), les toits, trois cyprès -->
			<path
				fill="var(--roca)"
				d="M0 128 V70 L20 60 L36 67 L54 44 L72 54 L94 32 L114 50 L136 38 L158 60 L184 46 L208 64 L234 42 L256 56 L278 36 L302 52 L328 44 L350 62 L374 50 L400 60 V140 Z"
			/>
			<path
				stroke="var(--roca-linha)"
				stroke-width="1"
				fill="none"
				d="M54 50 L50 110 M94 38 L98 116 M136 44 L132 120 M184 52 L188 124 M234 48 L230 126 M278 42 L282 128 M328 50 L324 130 M374 56 L378 132"
			/>
			<path fill="var(--penda)" d="M0 150 Q90 122 200 136 T400 128 V300 H0 Z" />
			<path fill="var(--abadia)" d="M124 176 V150 A20 20 0 0 1 164 150 V176 Z" />
			<rect x="160" y="142" width="62" height="34" fill="var(--abadia)" />
			<path fill="var(--teulat)" d="M158 142 L191 128 L224 142 Z" />
			<rect x="204" y="104" width="20" height="40" fill="var(--abadia)" />
			<path fill="var(--teulat)" d="M202 105 L214 90 L226 105 Z" />
			<path fill="var(--roca-linha)" d="M208 112 h4 v9 h-4 Z M216 112 h4 v9 h-4 Z M140 158 a3 3 0 0 1 6 0 v9 h-6 Z M174 154 a3 3 0 0 1 6 0 v9 h-6 Z" />
			<g fill="var(--paret)">
				<rect x="232" y="152" width="40" height="30" />
				<rect x="276" y="158" width="34" height="26" />
				<rect x="90" y="162" width="30" height="24" />
				<rect x="312" y="166" width="42" height="22" />
				<rect x="56" y="172" width="32" height="20" />
			</g>
			<g fill="var(--teulat)">
				<path d="M228 153 L252 144 L276 153 Z" />
				<path d="M273 159 L293 151 L313 159 Z" />
				<path d="M87 163 L105 155 L123 163 Z" />
				<path d="M309 167 L333 159 L357 167 Z" />
				<path d="M53 173 L72 166 L91 173 Z" />
			</g>
			<g class="cipreses" fill="var(--cipres)">
				<path d="M112 214 C104 184 106 150 113 124 C120 150 122 184 116 214 Z" />
				<path d="M330 222 C323 196 325 166 331 144 C337 166 339 196 334 222 Z" />
				<path d="M352 226 C346 204 347 180 352 162 C357 180 358 204 355 226 Z" />
			</g>
			<path
				fill="var(--fuelha)"
				d="M0 300 V232 Q22 214 44 230 Q64 208 88 228 Q112 212 136 232 Q160 216 186 236 Q214 220 240 238 Q266 222 292 240 Q320 222 346 238 Q372 224 400 236 V300 Z"
			/>
			<g class="ausels" fill="none" stroke="var(--ausel)" stroke-width="1.3" stroke-linecap="round">
				<path d="M150 84 q5 -5 10 0 q5 -5 10 0" />
				<path d="M174 96 q4 -4 8 0 q4 -4 8 0" />
			</g>
		{:else if id === 'riu'}
			<!-- les gorges : la falaise, la dent de roche, la pente verte, la rivière claire -->
			<path fill="var(--serre)" d="M110 150 Q190 92 270 112 Q330 126 400 98 V200 H110 Z" />
			<path fill="var(--penda)" d="M196 196 Q250 120 326 122 Q368 124 400 110 V250 H196 Z" />
			<path fill="var(--dent)" d="M146 200 L156 150 L163 120 L172 104 L182 98 L190 110 L196 140 L206 200 Z" />
			<path stroke="var(--falesa-linha)" stroke-width="1" fill="none" d="M171 112 L166 190 M182 104 L185 196" />
			<path fill="var(--falesa)" d="M0 0 H72 L82 36 L90 92 L102 150 L118 232 L0 246 Z" />
			<path stroke="var(--falesa-linha)" stroke-width="1" fill="none" d="M24 0 L30 236 M48 0 L60 230 M66 20 L84 226" />
			<path
				fill="url(#aiga-riu)"
				d="M116 300 C146 262 186 250 208 228 C224 212 250 204 274 198 L304 202 C276 212 254 224 240 240 C220 262 220 282 226 300 Z"
			/>
			<g class="lusor" stroke="var(--linha)" stroke-width="1.3" stroke-linecap="round" fill="none">
				<path d="M150 284 q14 -8 30 -10" />
				<path d="M190 258 q12 -6 24 -8" />
				<path d="M226 230 q10 -6 22 -8" />
				<path d="M196 290 q10 -6 22 -6" />
			</g>
			<path fill="var(--graviera)" d="M0 300 V252 Q56 236 116 262 L122 300 Z" />
			<path fill="var(--graviera)" d="M232 300 Q268 252 330 246 Q372 242 400 236 V300 Z" />
			<g fill="var(--boscatge)">
				<path d="M0 262 q18 -22 38 -6 q16 -16 32 2 q10 14 -4 20 H0 Z" />
				<path d="M300 252 q16 -20 34 -6 q18 -16 36 2 q14 12 30 6 V268 H300 Z" />
			</g>
			<g class="ausels" fill="none" stroke="var(--ausel)" stroke-width="1.3" stroke-linecap="round">
				<path d="M250 62 q5 -5 10 0 q5 -5 10 0" />
			</g>
		{:else if id === 'plana'}
			<!-- la plaine vue entre deux chênes : la mer au loin, les champs, les pierres du premier plan -->
			<rect x="0" y="110" width="400" height="14" fill="var(--mar)" />
			<path fill="var(--luenh)" d="M0 124 Q100 118 200 124 T400 120 V164 H0 Z" />
			<path fill="var(--mitan)" d="M0 152 Q120 140 240 152 T400 148 V206 H0 Z" />
			<path fill="var(--prop)" d="M0 188 Q140 174 260 192 T400 184 V246 H0 Z" />
			<path
				stroke="var(--linha)"
				stroke-width="1"
				fill="none"
				d="M20 170 Q120 160 230 170 M200 180 Q300 168 390 176 M10 214 Q130 200 250 216 M230 226 Q320 212 396 220"
			/>
			<path
				fill="var(--roca)"
				d="M0 300 V238 L42 228 L72 242 L112 226 L152 240 L192 228 L232 244 L272 230 L312 242 L352 226 L400 236 V300 Z"
			/>
			<path
				stroke="var(--roca-linha)"
				stroke-width="1"
				fill="none"
				d="M42 228 L52 262 M112 226 L104 270 M192 228 L200 266 M272 230 L262 272 M352 226 L360 268 M0 272 H400"
			/>
			<g class="lums" fill="var(--lum)">
				<ellipse cx="90" cy="258" rx="12" ry="4" />
				<ellipse cx="210" cy="280" rx="16" ry="5" />
				<ellipse cx="310" cy="262" rx="10" ry="3.5" />
			</g>
			<path
				fill="var(--rusca)"
				d="M28 300 C40 240 28 170 58 104 C68 82 78 56 70 0 H56 C62 52 50 80 42 98 C14 164 24 240 10 300 Z"
			/>
			<path
				fill="var(--rusca)"
				d="M382 300 C372 240 378 172 350 112 C340 88 330 52 344 0 H360 C352 42 360 80 368 102 C396 172 388 240 398 300 Z"
			/>
			<g class="ramas" fill="var(--fuelha)">
				<path
					d="M0 0 H400 V40 Q384 66 356 50 Q338 74 310 52 Q292 70 268 48 Q252 62 232 44 Q214 58 196 42 Q176 60 156 44 Q136 66 112 50 Q92 72 64 54 Q42 80 20 62 Q8 74 0 70 Z"
				/>
				<path d="M0 60 Q30 70 48 54 Q66 80 44 104 Q30 126 0 120 Z" />
				<path d="M400 56 Q372 70 352 54 Q336 82 358 106 Q374 126 400 118 Z" />
			</g>
		{:else if id === 'mar'}
			<!-- la mer : un pin d'Alep penché sur la falaise, une voile au loin -->
			<path fill="url(#aiga-mar)" d="M0 118 H400 V300 H0 Z" />
			<path fill="var(--costa)" d="M296 118 Q330 104 362 108 Q384 110 400 106 V118 Z" />
			<g class="ondas" stroke="var(--linha)" stroke-width="1.1" fill="none">
				{#each ONDAS as y (y)}
					<path d={onda(y)} />
				{/each}
			</g>
			<g class="barca">
				<path fill="var(--vela)" d="M88 114 L95 92 L100 114 Z" />
				<path stroke="var(--vela)" stroke-width="1.4" d="M84 116 H104" />
			</g>
			<path fill="var(--roca)" d="M0 300 V252 Q54 238 112 246 Q176 254 226 264 Q282 274 330 268 L400 260 V300 Z" />
			<path stroke="var(--roca-linha)" stroke-width="1" fill="none" d="M40 246 L48 280 M112 246 L106 286 M226 264 L232 292 M330 268 L322 296" />
			<g class="pin">
				<path
					fill="var(--rusca)"
					d="M324 270 C330 232 310 204 316 172 C322 142 298 122 290 106 L296 102 C308 120 332 140 326 172 C320 204 340 234 334 270 Z"
				/>
				<g fill="var(--fuelha)">
					<ellipse cx="300" cy="98" rx="46" ry="13" />
					<ellipse cx="262" cy="112" rx="30" ry="9" />
					<ellipse cx="338" cy="84" rx="30" ry="10" />
					<ellipse cx="282" cy="80" rx="22" ry="8" />
				</g>
			</g>
			<g class="ausels" fill="none" stroke="var(--ausel)" stroke-width="1.3" stroke-linecap="round">
				<path d="M150 70 q5 -5 10 0 q5 -5 10 0" />
				<path d="M176 82 q4 -4 8 0 q4 -4 8 0" />
			</g>
		{/if}
	</svg>
	<!-- le grain du papier, à part : il ne bouge jamais -->
	<svg class="gra" viewBox="0 0 400 300" preserveAspectRatio="none" focusable="false">
		<filter id="gra-{id}" x="0" y="0" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
		</filter>
		<rect width="400" height="300" filter="url(#gra-{id})" />
	</svg>
</div>

<style>
	.afica {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 3;
	}
	.afica svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.gra {
		mix-blend-mode: overlay;
		opacity: 0.2;
		pointer-events: none;
	}

	/* ── les couleurs : calme (passées) puis joiós (franches) ── */
	.garona {
		--cel-a: #efe4d6;
		--cel-b: #f6eee3;
		--solelh: #ead2a8;
		--luenh: #d3a894;
		--copola: #a7b5aa;
		--torre: #c59580;
		--riba: #8a5d4d;
		--aiga-a: #9db3b1;
		--aiga-b: #7f9796;
		--escuma: #f3ece2;
		--linha: rgba(246, 238, 227, 0.55);
		--ausel: #6d5a50;
	}
	.garona.joios {
		--cel-a: #f2cd97;
		--cel-b: #f0a989;
		--solelh: #efd97e;
		--luenh: #d0705a;
		--copola: #599c95;
		--torre: #b85542;
		--riba: #652c21;
		--aiga-a: #3a88a4;
		--aiga-b: #215a74;
		--escuma: #ffffff;
		--linha: rgba(255, 255, 255, 0.75);
		--ausel: #351c15;
	}
	.vilatge {
		--cel-a: #e6ecec;
		--cel-b: #f4efe6;
		--roca: #ddd4c4;
		--roca-linha: rgba(150, 138, 118, 0.45);
		--penda: #a3ae92;
		--paret: #ece2d2;
		--teulat: #c99478;
		--abadia: #dccfba;
		--cipres: #5d6b55;
		--fuelha: #74876a;
		--ausel: #5d5148;
	}
	.vilatge.joios {
		--cel-a: #89c4e5;
		--cel-b: #ddf0fb;
		--roca: #ecdec4;
		--roca-linha: rgba(190, 150, 90, 0.5);
		--penda: #539660;
		--paret: #faebd4;
		--teulat: #d06242;
		--abadia: #e8d0a4;
		--cipres: #25623c;
		--fuelha: #3a8455;
		--ausel: #273346;
	}
	.riu {
		--cel-a: #e8eeee;
		--cel-b: #f5f2ea;
		--serre: #b8c2b2;
		--falesa: #8e897b;
		--falesa-linha: rgba(70, 64, 54, 0.35);
		--dent: #a7a090;
		--penda: #8fa083;
		--aiga-a: #a7cdc6;
		--aiga-b: #c8e1db;
		--linha: rgba(255, 255, 255, 0.6);
		--graviera: #ddd4c3;
		--boscatge: #6b7e5e;
		--ausel: #5d5148;
	}
	.riu.joios {
		--cel-a: #86c5e7;
		--cel-b: #e3f4fc;
		--serre: #6cac75;
		--falesa: #bda17c;
		--falesa-linha: rgba(110, 80, 40, 0.45);
		--dent: #d9bf96;
		--penda: #469055;
		--aiga-a: #31ada3;
		--aiga-b: #99dfd6;
		--linha: rgba(255, 255, 255, 0.85);
		--graviera: #eee1c8;
		--boscatge: #34713f;
		--ausel: #273346;
	}
	.plana {
		--cel-a: #eceee7;
		--cel-b: #f7f2e8;
		--mar: #c3d1cf;
		--luenh: #ccd2bb;
		--mitan: #b8bf9c;
		--prop: #b1a983;
		--linha: rgba(255, 255, 255, 0.45);
		--roca: #ded5c4;
		--roca-linha: rgba(120, 108, 90, 0.35);
		--rusca: #4c4a3d;
		--fuelha: #56614b;
		--lum: rgba(255, 250, 235, 0.5);
	}
	.plana.joios {
		--cel-a: #f3d59b;
		--cel-b: #faf1d6;
		--mar: #4fa0c5;
		--luenh: #a2c878;
		--mitan: #71a755;
		--prop: #d0a24e;
		--linha: rgba(255, 255, 255, 0.6);
		--roca: #ede0c8;
		--roca-linha: rgba(150, 110, 60, 0.45);
		--rusca: #36271b;
		--fuelha: #356335;
		--lum: rgba(255, 240, 170, 0.8);
	}
	.mar {
		--cel-a: #ebf0f1;
		--cel-b: #f7f2e9;
		--aiga-a: #a9bfc6;
		--aiga-b: #7d9aa5;
		--linha: rgba(255, 255, 255, 0.5);
		--costa: #c0c9c6;
		--roca: #e1d8c7;
		--roca-linha: rgba(120, 108, 90, 0.35);
		--rusca: #6a5747;
		--fuelha: #5b6d55;
		--vela: #f7f1e6;
		--ausel: #5d5148;
	}
	.mar.joios {
		--cel-a: #93d0f2;
		--cel-b: #ecf8fd;
		--aiga-a: #3081b3;
		--aiga-b: #194b78;
		--linha: rgba(255, 255, 255, 0.7);
		--costa: #66a3b8;
		--roca: #ecddbf;
		--roca-linha: rgba(150, 110, 60, 0.45);
		--rusca: #543926;
		--fuelha: #34744e;
		--vela: #ffffff;
		--ausel: #183147;
	}

	/* ── joiós : le dessin lui-même bouge (rien n'est ajouté) ── */
	.corrent path {
		stroke-dasharray: 16 12;
	}
	.joios .corrent path {
		animation: corrent 1.8s linear infinite;
	}
	.joios .solelh {
		transform-box: fill-box;
		transform-origin: center;
		animation: lusir 6s ease-in-out infinite;
	}
	.joios .ausels {
		animation: volar 16s linear infinite;
	}
	.joios .cipreses path {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: balancar 5s ease-in-out infinite alternate;
	}
	.joios .cipreses path:nth-child(2) {
		animation-delay: -1.6s;
	}
	.joios .cipreses path:nth-child(3) {
		animation-delay: -3.2s;
	}
	.joios .lusor path,
	.joios .lums ellipse {
		animation: lusor 3.2s ease-in-out infinite;
	}
	.joios .lusor path:nth-child(even),
	.joios .lums ellipse:nth-child(even) {
		animation-delay: -1.6s;
	}
	.joios .ramas {
		transform-box: fill-box;
		transform-origin: 50% 0;
		animation: ventolet 5s ease-in-out infinite alternate;
	}
	.joios .ondas path {
		animation: ondas 6s ease-in-out infinite alternate;
	}
	.joios .ondas path:nth-child(odd) {
		animation-direction: alternate-reverse;
	}
	.joios .barca {
		animation: barca 22s ease-in-out infinite alternate;
	}
	.joios .pin {
		transform-box: fill-box;
		transform-origin: 86% 100%;
		animation: balancar 6s ease-in-out infinite alternate;
	}
	@keyframes corrent {
		to {
			stroke-dashoffset: -56;
		}
	}
	@keyframes lusir {
		50% {
			transform: scale(1.07);
		}
	}
	@keyframes volar {
		from {
			transform: translateX(-70px);
		}
		to {
			transform: translateX(90px);
		}
	}
	@keyframes balancar {
		from {
			transform: rotate(-1.4deg);
		}
		to {
			transform: rotate(1.4deg);
		}
	}
	@keyframes lusor {
		50% {
			opacity: 0.15;
		}
	}
	@keyframes ventolet {
		from {
			transform: translateX(-3px);
		}
		to {
			transform: translateX(3px);
		}
	}
	@keyframes ondas {
		from {
			transform: translateX(-18px);
		}
		to {
			transform: translateX(18px);
		}
	}
	@keyframes barca {
		to {
			transform: translateX(130px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.afica * {
			animation: none !important;
		}
	}
</style>
