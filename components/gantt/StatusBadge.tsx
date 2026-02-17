import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const statusLabels: Record<TaskStatus, string> = {
  LISTO: "Listo",
  EN_PROGRESO: "En progreso",
  ENTREGADO: "Entregado",
  PENDIENTE: "Pendiente",
};

const statusClasses: Record<TaskStatus, string> = {
  LISTO: "bg-emerald-600 text-white",
  EN_PROGRESO: "bg-amber-500 text-white",
  ENTREGADO: "bg-blue-600 text-white",
  PENDIENTE: "bg-red-600 text-white",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium",
        statusClasses[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
