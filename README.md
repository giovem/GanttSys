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

### Proyecto en ruta de red (UNC)

Si el proyecto está en una ruta UNC (ej. `\\192.168.0.50\e\...`), **`npm run build` y `npm run dev` fallan** en Windows: CMD no admite UNC como directorio de trabajo y el proceso termina usando `C:\Windows`, por eso aparece *Cannot find module 'C:\Windows\node_modules\next\...'*.

**Solución:** Usar una **unidad de red mapeada** y trabajar siempre desde la letra de unidad:

1. **Asignar unidad:** En el Explorador de Windows → clic derecho en **Este equipo** → **Conectar a unidad de red** (o ejecutar `net use E: \\192.168.0.50\e` en CMD como administrador si prefieres).
2. **Letra:** Por ejemplo `E:` (ruta `\\192.168.0.50\e`).
3. **Abrir el proyecto desde E:** en la terminal:
   ```powershell
   E:
   cd E:\Archivos\emmanuel.villasanti\Documents\Proyectos\GanttSys
   npm run build
   ```
4. En Cursor/VS Code, abrir la carpeta desde `E:\Archivos\...\GanttSys` en lugar de `\\192.168.0.50\e\...` para que la terminal integrada también use la unidad mapeada.

Si no recuerdas los pasos, desde la ruta UNC puedes ejecutar `.\scripts\build-unc-check.ps1`: no hará el build pero te mostrará estas instrucciones.

## Administrador principal

El usuario **emmanuel.villasanti@grupoepem.com.py** recibe automáticamente el rol **ADMIN** al registrarse (trigger en `schema.sql`).

## Estructura

- `app/` – Rutas (login, register, dashboard, admin) y Server Actions.
- `components/` – UI y componentes Gantt (barras, badges, formularios).
- `lib/` – Supabase (client, server, admin), `date-utils`, `utils`.
- `types/` – Tipos (User, Task, roles, estados).
- `supabase/schema.sql` – Schema completo para ejecutar en Supabase.

## Despliegue en Vercel

El proyecto está preparado para desplegar en [Vercel](https://vercel.com):

- **vercel.json** – framework Next.js
- **Node 18+** – indicado en `package.json` (`engines`)

Pasos resumidos:

1. Conectar el repo de GitHub (giovem/GanttSys) en Vercel.
2. Añadir las variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Desplegar (build y salida son automáticos para Next.js).

Instrucciones detalladas: **[VERCEL.md](./VERCEL.md)**.
