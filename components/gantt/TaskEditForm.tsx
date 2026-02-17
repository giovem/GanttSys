"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTaskFromForm, deleteTask } from "@/app/actions/tasks";
import type { Task, TaskStatus, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROGRESO", label: "En progreso" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "LISTO", label: "Listo" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
];

interface TaskEditFormProps {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskEditForm({ task, onClose, onSuccess }: TaskEditFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await updateTaskFromForm(task.id, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSuccess();
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar esta tarea?")) return;
    setError(null);
    const result = await deleteTask(task.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Título</Label>
        <Input
          id="edit-title"
          name="title"
          defaultValue={task.title}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-status">Estado</Label>
          <select
            id="edit-status"
            name="status"
            defaultValue={task.status}
            className={cn(
              "flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-priority">Prioridad</Label>
          <select
            id="edit-priority"
            name="priority"
            defaultValue={task.priority}
            className={cn(
              "flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-start_date">Inicio</Label>
          <Input
            id="edit-start_date"
            name="start_date"
            type="date"
            defaultValue={task.start_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-end_date">Fin</Label>
          <Input
            id="edit-end_date"
            name="end_date"
            type="date"
            defaultValue={task.end_date}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-progress">Progreso (0-100)</Label>
        <Input
          id="edit-progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          defaultValue={task.progress ?? 0}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex gap-2">
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Eliminar tarea
        </Button>
      </div>
    </form>
  );
}
