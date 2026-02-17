import { getUsersForAdmin } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "@/components/admin/UserList";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

export default async function AdminPage() {
  const { data: users, error } = await getUsersForAdmin();
  if (error && !users) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Panel de administración</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear usuario</CardTitle>
          <p className="text-sm text-muted-foreground">
            Crea un usuario en Auth e inserta su registro en la base de datos.
          </p>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Listado completo. Solo ADMIN puede cambiar roles o eliminar.
          </p>
        </CardHeader>
        <CardContent>
          <UserList users={users ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
