"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return { error: "Email y contraseña requeridos" };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  const next = formData.get("next") as string | null;
  redirect(next && next.startsWith("/") ? next : "/dashboard");
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return { error: "Email y contraseña requeridos" };
  }
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: undefined },
  });
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
