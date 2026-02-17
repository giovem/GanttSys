"use client";

import { useState } from "react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { updateUserRole, deleteUser } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRoleChange(userId: string, newRole: "USER" | "ADMIN") {
    setMessage(null);
    setLoading(userId);
    const result = await updateUserRole(userId, newRole);
    setLoading(null);
    if (result.error) setMessage(result.error);
  }

  async function handleDelete(userId: string) {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    setMessage(null);
    setLoading(userId);
    const result = await deleteUser(userId);
    setLoading(null);
    if (result.error) setMessage(result.error);
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay usuarios.</p>;
  }

  return (
    <div className="space-y-2">
      {message && (
        <p className="text-sm text-destructive mb-2">{message}</p>
      )}
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Rol</th>
              <th className="text-right p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-flex rounded-lg px-2 py-0.5 text-xs font-medium",
                      u.role === "ADMIN" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading === u.id}
                      onClick={() => handleRoleChange(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                    >
                      {loading === u.id ? "..." : u.role === "ADMIN" ? "Quitar ADMIN" : "Hacer ADMIN"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={loading === u.id}
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
