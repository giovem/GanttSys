"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TaskInsert, TaskUpdate } from "@/types";

export async function createTaskFromForm(formData: FormData) {
  const title = formData.get("title") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  if (!title?.trim() || !start_date || !end_date) return { error: "Faltan campos" };
  return createTask({
    title: title.trim(),
    start_date,
    end_date,
    status: "PENDIENTE",
    priority: "MEDIA",
    progress: 0,
  });
}

export async function createTask(data: TaskInsert) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };
  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: data.title,
    status: data.status ?? "PENDIENTE",
    priority: data.priority ?? "MEDIA",
    start_date: data.start_date,
    end_date: data.end_date,
    progress: data.progress ?? 0,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return {};
}

export async function updateTaskFromForm(id: string, formData: FormData) {
  const title = formData.get("title") as string | null;
  const status = formData.get("status") as TaskUpdate["status"] | null;
  const priority = formData.get("priority") as TaskUpdate["priority"] | null;
  const start_date = formData.get("start_date") as string | null;
  const end_date = formData.get("end_date") as string | null;
  const progressStr = formData.get("progress") as string | null;
  const progress = progressStr != null ? parseInt(progressStr, 10) : undefined;
  if (Number.isNaN(progress) || (progress != null && (progress < 0 || progress > 100))) {
    return { error: "Progreso debe ser 0-100" };
  }
  const data: TaskUpdate = {};
  if (title?.trim()) data.title = title.trim();
  if (status) data.status = status;
  if (priority) data.priority = priority;
  if (start_date) data.start_date = start_date;
  if (end_date) data.end_date = end_date;
  if (progress != null) data.progress = progress;
  return updateTask(id, data);
}

export async function updateTask(id: string, data: TaskUpdate) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return {};
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return {};
}
