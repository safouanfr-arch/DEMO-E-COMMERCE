# A lancer par clic droit > Exécuter avec PowerShell
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (-not (Test-Path "package.json")) {
  Write-Host "[ERREUR] package.json introuvable. Place ce script a la racine du projet."
  Read-Host "Appuie sur Entree pour fermer"
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "[ERREUR] npm non trouve. Installe Node LTS (https://nodejs.org) puis reessaye."
  Read-Host "Appuie sur Entree pour fermer"
  exit 1
}

Write-Host "=== npm install ==="
npm install
if ($LASTEXITCODE -ne 0) { Read-Host "Erreur. Appuie sur Entree"; exit 1 }

Write-Host "=== npm run dev === (CTRL+C pour arreter)"
npm run dev
Read-Host "Serveur arrete. Appuie sur Entree pour fermer"