# Desplegar GanttSys en Vercel

## Requisitos previos

- Repositorio en GitHub (ya conectado: https://github.com/giovem/GanttSys)
- Proyecto Supabase creado y `supabase/schema.sql` ejecutado
- Variables de Supabase a mano (URL, anon key, service role key)

---

## Pasos en Vercel

### 1. Crear proyecto

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub si es posible).
2. **Add New** → **Project**.
3. **Import** el repositorio `giovem/GanttSys` (conectar cuenta de GitHub si no está).
4. Vercel detectará **Next.js** y el directorio raíz. No cambies nada en **Root Directory** ni **Framework Preset**.

### 2. Variables de entorno

En **Environment Variables** añade estas tres (marca **Production**, **Preview** y **Development** si quieres):

| Nombre | Valor | Notas |
|--------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://TU_PROYECTO.supabase.co` | URL del proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Clave anónima (pública) de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Service Role Key (solo servidor; no exponer en cliente) |

- **NEXT_PUBLIC_*** se usan en cliente y servidor.
- **SUPABASE_SERVICE_ROLE_KEY** solo se usa en Server Actions (admin); no debe estar en el frontend.

Dónde verlas en Supabase: **Project Settings** → **API** (Project URL, anon key, service_role key).

### 3. Desplegar

1. Pulsa **Deploy**.
2. Espera a que termine el build (`npm run build`).
3. Cuando termine, tendrás una URL tipo `ganttsys-xxx.vercel.app`.

### 4. Dominio (opcional)

En el proyecto de Vercel: **Settings** → **Domains** para añadir un dominio propio.

---

## Después del primer deploy

- Cada **push a `main`** puede configurarse para que dispare un deploy automático (por defecto en Vercel).
- Las **preview deployments** se generan en cada pull request si está conectado GitHub.
- Si cambias variables de entorno, haz **Redeploy** en Vercel para que se apliquen.

---

## Comprobar que todo funciona

1. Abre la URL de producción.
2. **Registro** con un email de prueba.
3. **Login** y comprueba el **dashboard** y la vista Gantt.
4. Si usas el usuario admin (emmanuel.villasanti@grupoepem.com.py), entra en **/admin** y revisa la gestión de usuarios.

Si algo falla, revisa **Vercel** → **Project** → **Deployments** → último deploy → **Functions** / **Logs** para ver errores de Server Actions o de Supabase.
