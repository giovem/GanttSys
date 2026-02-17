"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserByAdmin } from "@/app/actions/admin";

export function CreateUserForm() {
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    const result = await createUserByAdmin(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({ type: "success", text: "Usuario creado correctamente." });
    const form = document.getElementById("create-user-form") as HTMLFormElement;
    form?.reset();
  }

  return (
    <form id="create-user-form" action={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Contraseña</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
      </div>
      {message && (
        <p
          className={
            message.type === "error"
              ? "text-sm text-destructive"
              : "text-sm text-emerald-500"
          }
        >
          {message.text}
        </p>
      )}
      <Button type="submit">Crear usuario</Button>
    </form>
  );
}
