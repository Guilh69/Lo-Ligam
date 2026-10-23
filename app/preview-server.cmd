@echo off
rem Aperçu de la version de production (dossier build, fait par npm run build)
set "PATH=C:\Users\perie\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"
if not defined PORT set PORT=4180
node --env-file=.env build
