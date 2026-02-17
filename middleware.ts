import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN = "/login";
const REGISTER = "/register";
const DASHBOARD = "/dashboard";
const ADMIN = "/admin";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPage = path === LOGIN || path === REGISTER;
  const isAdminPage = path.startsWith(ADMIN);

  if (!user) {
    if (!isAuthPage) {
      const redirect = new URL(LOGIN, request.url);
      redirect.searchParams.set("next", path);
      return NextResponse.redirect(redirect);
    }
    return response;
  }

  // Usuario autenticado: obtener rol desde la API o cookie (middleware no puede leer DB fácilmente)
  // Resolvemos redirección de /admin según rol en el layout o página de admin vía getServerSession/DB.
  if (isAuthPage) {
    return NextResponse.redirect(new URL(DASHBOARD, request.url));
  }

  // Bloquear /admin en middleware requiere el rol. La forma más limpia es verificar en el layout de /admin
  // y redirigir allí. En middleware podemos dejar pasar y que el layout de admin haga la comprobación.
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
