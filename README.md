# GanttSys

SaaS de gestión de proyectos con vista Gantt. Next.js 14, TypeScript, TailwindCSS, shadcn/ui y Supabase.

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

## Configuración

1. **Clonar e instalar dependencias**
   ```bash
   npm install
   ```

2. **Supabase**
   - Crear un proyecto en Supabase.
   - En el SQL Editor, ejecutar el contenido de `supabase/schema.sql` (extensiones, tablas, RLS, trigger del admin principal).

3. **Variables de entorno**
   - Copiar `.env.example` a `.env.local`.
   - Completar:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (solo para Server Actions de admin; no exponer en frontend).

4. **Arrancar**
   ```bash
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000).

## Administrador principal

El usuario **emmanuel.villasanti@grupoepem.com.py** recibe automáticamente el rol **ADMIN** al registrarse (trigger en `schema.sql`).

## Estructura

- `app/` – Rutas (login, register, dashboard, admin) y Server Actions.
- `components/` – UI y componentes Gantt (barras, badges, formularios).
- `lib/` – Supabase (client, server, admin), `date-utils`, `utils`.
- `types/` – Tipos (User, Task, roles, estados).
- `supabase/schema.sql` – Schema completo para ejecutar en Supabase.

## Despliegue (Vercel)

Configurar en Vercel las mismas variables de entorno. El build es `npm run build` y el directorio de salida es el predeterminado de Next.js.
