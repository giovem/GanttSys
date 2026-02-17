# Ejecutar desde la raíz del proyecto: .\scripts\build-unc-check.ps1
# Comprueba si estamos en ruta UNC y da instrucciones; si no, ejecuta npm run build.

$currentPath = (Get-Location).Path
if ($currentPath -match '^\\\\') {
    Write-Host ""
    Write-Host "Ruta UNC detectada: $currentPath" -ForegroundColor Yellow
    Write-Host "En Windows, 'npm run build' falla desde rutas UNC (CMD no las admite)." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Haz esto:" -ForegroundColor Cyan
    Write-Host "  1. Asigna una unidad de red, ej. E: a \\192.168.0.50\e" -ForegroundColor White
    Write-Host "  2. En PowerShell:" -ForegroundColor White
    Write-Host "     E:" -ForegroundColor Gray
    Write-Host "     cd E:\Archivos\emmanuel.villasanti\Documents\Proyectos\GanttSys" -ForegroundColor Gray
    Write-Host "     npm run build" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ver README, seccion 'Proyecto en ruta de red (UNC)'." -ForegroundColor Cyan
    Write-Host ""
    exit 1
}
npm run build
