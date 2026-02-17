"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

export async function getUsersForAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado", data: null };
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return { error: "No autorizado", data: null };
  const { data, error } = await supabase.from("users").select("id, email, role, created_at").order("created_at", { ascending: false });
  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return { error: "No autorizado" };
  if (role !== "USER" && role !== "ADMIN") return { error: "Rol inválido" };
  const { error } = await supabase.from("users").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return {};
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return { error: "No autorizado" };
  if (userId === user.id) return { error: "No puedes eliminarte a ti mismo" };
  const admin = createAdminClient();
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId);
  if (deleteAuthError) return { error: deleteAuthError.message };
  revalidatePath("/admin");
  return {};
}

export async function createUserByAdmin(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return { error: "No autorizado" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email?.trim() || !password) return { error: "Email y contraseña requeridos" };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" };

  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
  });
  if (authError) return { error: authError.message };
  if (!authData.user) return { error: "No se creó el usuario" };

  const { error: dbError } = await admin.from("users").upsert(
    {
      id: authData.user.id,
      email: authData.user.email!,
      role: "USER",
    },
    { onConflict: "id" }
  );
  if (dbError) return { error: dbError.message };
  revalidatePath("/admin");
  return { success: true };
}
