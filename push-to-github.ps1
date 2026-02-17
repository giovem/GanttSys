# Ejecutar en PowerShell desde la raíz del proyecto (o desde cualquier lugar)
# Uso: .\push-to-github.ps1

$projectRoot = $PSScriptRoot
Set-Location $projectRoot

Write-Host "=== GanttSys - Subir a GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Ver estado
Write-Host "Estado del repositorio:" -ForegroundColor Yellow
git status
Write-Host ""

# Añadir todos los archivos
Write-Host "Añadiendo archivos..." -ForegroundColor Yellow
git add -A
git status --short
Write-Host ""

# Commit (solo si hay cambios)
$status = git status --porcelain
if ($status) {
    Write-Host "Creando commit..." -ForegroundColor Yellow
    git commit -m "feat: GanttSys - SaaS gestion proyectos con vista Gantt (Next.js 14, Supabase, RLS, admin, edicion tareas)"
    Write-Host ""
}

# Push
Write-Host "Subiendo a origin main..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "Listo. Repositorio: https://github.com/giovem/GanttSys" -ForegroundColor Green
