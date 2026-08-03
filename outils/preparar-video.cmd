@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

rem ===========================================================================
rem  Lo Ligam - preparation des videos pour le site
rem ---------------------------------------------------------------------------
rem  MODE D'EMPLOI : fais glisser un ou plusieurs fichiers MP4 SUR ce fichier.
rem  Chaque video ressort a cote de l'originale, suffixee "-web".
rem  Ton fichier d'origine n'est jamais modifie ni efface.
rem
rem  POURQUOI : un export Canva sort vers 4 Mbit/s. Pour une animation en
rem  aplats de couleur, c'est enorme : le meme rendu tient autour de 1 Mbit/s.
rem  Mesure du 2026-08-04 sur Officialitat.mp4 : 23,9 Mo -> environ 6 Mo.
rem
rem  REGLAGES retenus (voir cahier-des-charges.md) :
rem    crf 30      qualite ; plus le chiffre est haut, plus c'est leger
rem    maxrate     plafond de debit, pour qu'un passage charge ne s'emballe pas
rem    scale 810   largeur d'affichage d'une fiche ; au-dela c'est invisible
rem    faststart   la video demarre sans attendre le telechargement complet
rem ===========================================================================

where ffmpeg >nul 2>&1
if errorlevel 1 (
	echo.
	echo   ffmpeg n'est pas installe sur cet ordinateur.
	echo.
	echo   Ouvre une fenetre PowerShell et colle cette ligne :
	echo.
	echo       winget install Gyan.FFmpeg
	echo.
	echo   Ensuite FERME cette fenetre et toutes tes fenetres PowerShell,
	echo   rouvre-en une, et recommence. Le redemarrage est necessaire pour
	echo   que Windows trouve le nouvel outil.
	echo.
	pause
	exit /b 1
)

if "%~1"=="" (
	echo.
	echo   Rien a faire : fais GLISSER tes fichiers MP4 sur ce fichier.
	echo.
	pause
	exit /b 0
)

set /a fachs=0

:boucla
if "%~1"=="" goto fin

set "sortida=%~dpn1-web.mp4"

echo.
echo ===========================================================================
echo   Traitement : %~nx1
echo ===========================================================================

ffmpeg -hide_banner -loglevel warning -stats -y -i "%~1" ^
 -c:v libx264 -preset slow -crf 30 -maxrate 1000k -bufsize 2000k ^
 -vf "scale=810:-2:flags=lanczos" -pix_fmt yuv420p ^
 -c:a aac -b:a 96k -ac 2 ^
 -movflags +faststart ^
 "!sortida!"

if errorlevel 1 (
	echo   ECHEC sur %~nx1
) else (
	set /a fachs+=1
	for %%A in ("%~1") do set "avant=%%~zA"
	for %%B in ("!sortida!") do set "apres=%%~zB"
	set /a avantMo=!avant!/1048576
	set /a apresMo=!apres!/1048576
	echo.
	echo   OK : !avantMo! Mo  ---^>  !apresMo! Mo
	echo   Fichier pret : %~n1-web.mp4
)

shift
goto boucla

:fin
echo.
echo ===========================================================================
echo   Termine. !fachs! video(s) preparee(s).
echo.
echo   Les fichiers "-web.mp4" sont ceux a envoyer dans l'espace
echo   d'administration. Garde tes originaux, ne les envoie pas.
echo ===========================================================================
echo.
pause
