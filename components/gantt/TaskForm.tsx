"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTaskFromForm } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";

export function TaskForm({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  async function handleSubmit(formData: FormData) {
    await createTaskFromForm(formData);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className={cn(className)}>
        Nueva tarea
      </Button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className={cn("flex flex-wrap items-end gap-3", className)}
    >
      <div className="space-y-1">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Nombre de la tarea" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="start_date">Inicio</Label>
        <Input id="start_date" name="start_date" type="date" defaultValue={today} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="end_date">Fin</Label>
        <Input id="end_date" name="end_date" type="date" defaultValue={nextWeek} required />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Crear</Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
