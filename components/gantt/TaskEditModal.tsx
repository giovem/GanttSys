"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskEditForm } from "./TaskEditForm";
import type { Task } from "@/types";

interface TaskEditModalProps {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskEditModal({ task, onClose, onSuccess }: TaskEditModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <Card
        className="w-full max-w-md shadow-soft-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle id="edit-task-title">Editar tarea</CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            ×
          </button>
        </CardHeader>
        <CardContent>
          <TaskEditForm
            task={task}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
