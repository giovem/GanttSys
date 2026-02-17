#!/bin/sh
# Ejecutar desde la raíz del proyecto: sh push-to-github.sh

set -e
cd "$(dirname "$0")"

echo "=== GanttSys - Subir a GitHub ==="
echo ""
echo "Estado del repositorio:"
git status
echo ""
echo "Añadiendo archivos..."
git add -A
git status --short
echo ""
echo "Creando commit..."
git commit -m "feat: GanttSys - SaaS gestion proyectos con vista Gantt (Next.js 14, Supabase, RLS, admin, edicion tareas)" || true
echo ""
echo "Subiendo a origin main..."
git push -u origin main
echo ""
echo "Listo. Repositorio: https://github.com/giovem/GanttSys"
