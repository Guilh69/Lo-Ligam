@echo off
chcp 65001 >nul 2>&1
rem ===========================================================================
rem  Lo Ligam - factures des cours en visio
rem ---------------------------------------------------------------------------
rem  MODE D'EMPLOI : double-clique sur ce fichier. La page des factures
rem  s'ouvre dans ton navigateur. Laisse la fenetre noire ouverte pendant que
rem  tu travailles, ferme-la quand tu as fini.
rem
rem  Tes donnees (reglages, factures, livre des recettes, PDF) sont dans :
rem    Documents\6_Projectes\Lo_Ligam_hors-git\factures
rem  Elles ne vont jamais dans Git. Voir LISEZMOI.md a cote de ce fichier.
rem ===========================================================================
title Factures Lo Ligam
node "%~dp0servidor.mjs"
if errorlevel 1 (
	echo.
	echo Le serveur s'est arrete avec une erreur. Fais une capture de cette fenetre pour Claude.
	pause
)
