@echo off
chcp 65001 >nul 2>&1

rem ===========================================================================
rem  Lo Ligam - mise au propre des enregistrements de voix
rem ---------------------------------------------------------------------------
rem  MODE D'EMPLOI : double-clic sur ce fichier. Il va chercher tes prises
rem  dans le dossier prive du site, les rend propres (un seul niveau sonore,
rem  silences coupes) et les range dans le site. Ne refait que ce qui a change.
rem  Les prises brutes ne sont jamais modifiees ni effacees.
rem
rem  Autres cas (dans une fenetre de commandes, depuis le dossier outils) :
rem    voix-polir.cmd --tot                     tout refaire
rem    voix-polir.cmd --sec                     essai, sans rien ecrire
rem    voix-polir.cmd --dossier "C:\mes\prises"  traiter un dossier de l'ordinateur
rem  Apres : ouvre GitHub Desktop (ou dis a L'amic) pour mettre en ligne.
rem ===========================================================================

rem le script est dans app\, ce fichier dans outils\
cd /d "%~dp0..\app"
if errorlevel 1 (
	echo.
	echo   Je ne trouve pas le dossier app du projet.
	echo.
	pause
	exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
	echo.
	echo   Node n'est pas installe sur cet ordinateur : c'est l'outil qui fait
	echo   tourner le site en local. Dis-le a L'amic.
	echo.
	pause
	exit /b 1
)

echo.
node scripts/voix-polir.mjs %*

echo.
echo ===========================================================================
echo   Termine. Lis le resume ci-dessus, puis appuie sur une touche.
echo ===========================================================================
pause
