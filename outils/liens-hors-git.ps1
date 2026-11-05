# Raccourcis (jonctions Windows) du projet vers les fichiers lourds hors Git.
# Le projet est dans C:\Users\<toi>\Depots\Lo_Ligam (hors de Proton Drive, sauvegardé par GitHub).
# Les fichiers lourds ou personnels (vidéos, photos brutes, .zip, données brutes de la carte)
# sont dans Documents\6_Projectes\Lo_Ligam_hors-git, au même chemin (sauvegardés par Proton Drive).
# Ce script recrée les raccourcis ; on peut le relancer sans risque (sur un autre ordinateur
# après le clone, par exemple) :  powershell -ExecutionPolicy Bypass -File outils\liens-hors-git.ps1
# Décision : cahier des charges §11, 2026-10-24.
$projet = Split-Path -Parent $PSScriptRoot
$horsGit = Join-Path ([Environment]::GetFolderPath('MyDocuments')) '6_Projectes\Lo_Ligam_hors-git'
$dossiers = 'SIG\brut', 'SIG\Limsi', 'Modules_cors\Base_donnees_linguistica', 'design-stock\MP4', 'design-stock\brut', 'design-stock\animations', 'design-stock\Fotos\Bases_foto'
foreach ($d in $dossiers) {
	$lien = Join-Path $projet $d
	$cible = Join-Path $horsGit $d
	if (-not (Test-Path $cible)) { New-Item -ItemType Directory -Force $cible | Out-Null }
	$item = Get-Item -LiteralPath $lien -Force -ErrorAction SilentlyContinue
	if ($item -and $item.LinkType -eq 'Junction') { "déjà là : $d"; continue }
	if ($item) { "ATTENTION : $d existe déjà comme vrai dossier, rien n'est touché"; continue }
	New-Item -ItemType Directory -Force (Split-Path $lien) | Out-Null
	New-Item -ItemType Junction -Path $lien -Target $cible | Out-Null
	"raccourci créé : $d"
}
