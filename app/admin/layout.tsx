import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-semibold text-lg">
            GanttSys
          </Link>
          <nav className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="secondary" size="sm">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
