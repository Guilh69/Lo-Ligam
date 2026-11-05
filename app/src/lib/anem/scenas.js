// Les scènes à toucher d'Anem ! (2026-11-05, choix de Romain : « la maison à
// toucher » d'abord, le corps ensuite, de la même façon). La scène est un
// dessin pâle, une pastille dorée montre où toucher ; la chose touchée prend
// ses couleurs et dit son nom ; tout colorié, Òsca !
// Coordonnées dans le carré de l'image (costat × costat) :
//   zonas = où toucher, [cx, cy, rx, ry] (ovales ; plusieurs pour une même
//           chose), plus grands que le dessin : un doigt de trois ans (Joan)
//   forma = le contour exact de la chose (chemin SVG), tiré du dessin par
//           outils/anem/ostal-formas.py : on colorie dans les traits, sans
//           halo sur le mur encore pâle (Joan, 05-11)
//   pastilha = où poser la pastille, centre de la première zone par défaut
// Formes vérifiées avec lo Congrès le 2026-11-05 (ostal, teulat, fenèstra, pòrta,
// clau) ; prononciations du visuel Canva de Romain « L'ostal en occitan »,
// sauf fenèstras : son visuel écrivait « finèstras », le cursus validé (unité 7)
// dit « fé-NÈS-tro » ; Romain garde « fenèstras » (« Garder fenèstras », 05-11).

export const OSTAL = {
	id: 'ostal',
	oc: 'L’ostal',
	fr: 'La maison',
	// image découpée de l'export Canva en 2160 px (design « Ostal »), sans
	// flèches ni textes, en trois tailles : /anem/ostal-360.webp, -720, -1080
	imatge: '/anem/ostal',
	// le même dessin, pâle, pas encore colorié (fond gardé) : -360, -720, -1080
	gris: '/anem/ostal-gris',
	costat: 1328,
	objectes: [
		{
			id: 'teulat',
			oc: 'Lo teulat',
			fr: 'Le toit',
			pron: 'Lou téwlatt',
			nota: 523.25,
			zonas: [[660, 290, 540, 200]],
			forma: 'M938 90 935 93 676 96 391 114 385 120 377 135 364 147 360 159 334 201 309 231 272 282 246 309 235 315 131 414 126 423 127 426 117 438 102 447 101 453 117 462 117 471 110 483 110 489 112 498 122 510 134 516 175 519 182 525 1147 525 1150 519 1148 501 1167 498 1182 492 1188 483 1215 477 1227 465 1224 447 1212 435 1209 429 1210 423 1203 411 1209 393 1208 384 1180 372 1172 363 1141 339 1139 336 1140 330 1137 327 1103 312 1101 309 1102 303 1096 297 1083 288 1073 285 1062 270 1043 258 1023 231 1009 207 990 183 988 171 979 156 980 147 965 135 951 105 939 90Z',
			// sur les tuiles à gauche, pas sur une fenêtre du toit
			pastilha: [270, 380]
		},
		{
			id: 'fenestras',
			oc: 'Las fenèstras',
			fr: 'Les fenêtres',
			pron: 'Lass fénèstross',
			nota: 659.25,
			zonas: [
				[900, 690, 125, 150],
				[415, 712, 125, 150],
				[500, 272, 120, 120],
				[825, 270, 120, 120]
			],
			forma: 'M401 581 387 584 366 593 343 626 340 638 343 641 332 650 322 698 322 722 320 725 326 761 319 773 325 788 325 794 332 800 327 806 330 809 328 821 336 830 338 842 346 848 385 851 396 851 500 842 513 839 517 833 518 821 512 809 507 806 508 797 506 794 511 791 512 785 509 782 514 776 515 770 511 755 508 752 510 749 505 743 506 737 502 731 511 722 507 704 504 701 507 698 502 692 494 689 494 683 503 680 501 668 490 653 491 650 485 641 485 629 473 611 459 599 450 596 450 590 429 581ZM904 559 855 574 834 592 831 598 832 601 815 625 816 637 810 649 809 667 804 676 808 706 806 715 809 718 806 724 807 727 804 730 804 739 808 748 806 760 811 766 807 769 806 787 810 805 805 811 813 814 817 820 817 826 823 833 826 833 861 829 869 826 979 823 1006 817 1010 814 1011 805 1007 802 1009 799 1005 790 1008 787 1009 778 1003 766 1004 760 1001 754 1006 748 1003 745 1008 733 1000 718 1004 709 1002 706 990 703 999 700 1001 697 998 694 1001 685 998 676 994 673 994 655 985 640 980 637 987 631 985 625 978 616 972 598 955 577 939 565 908 559ZM512 186 482 189 460 198 451 204 428 228 406 285 405 306 410 339 395 342 394 345 394 348 398 351 409 354 406 363 413 369 433 369 453 366 570 363 586 360 591 354 592 342 589 333 591 261 583 237 584 234 566 201 549 189 530 186ZM842 172 808 178 790 187 771 202 751 226 740 259 741 295 749 328 737 331 736 337 746 340 746 355 752 361 754 361 800 358 840 352 916 349 922 346 925 334 920 319 920 310 923 307 920 301 923 286 919 277 915 244 907 229 905 217 901 208 889 193 870 178 847 172Z'
		},
		{
			id: 'porta',
			oc: 'La pòrta',
			fr: 'La porte',
			pron: 'La porto',
			nota: 783.99,
			zonas: [[662, 805, 125, 190]],
			forma: 'M730 641 565 644 562 647 567 653 563 659 567 665 568 686 566 770 569 788 571 869 578 953 581 956 560 959 557 962 559 965 599 971 606 976 615 976 653 971 778 968 778 965 772 962 740 959 765 956 771 950 772 944 770 935 765 929 765 809 755 689 749 668 751 656 735 641Z',
			pastilha: [662, 760]
		},
		{
			id: 'claus',
			oc: 'Las claus',
			fr: 'Les clefs',
			pron: 'Lass klaws',
			nota: 1046.5,
			zonas: [[1095, 1135, 175, 165]],
			forma: 'M1117 1030 1100 1039 1090 1051 1069 1057 1051 1072 1044 1087 1045 1108 987 1162 987 1180 989 1183 998 1186 1056 1189 1044 1216 1055 1239 1058 1239 1077 1228 1082 1219 1079 1213 1087 1207 1091 1198 1089 1195 1092 1192 1176 1189 1201 1171 1202 1144 1184 1117 1201 1102 1201 1078 1189 1072 1175 1054 1157 1051 1144 1036 1130 1030Z'
		}
	]
};
