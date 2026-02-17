import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

const priorityClasses: Record<TaskPriority, string> = {
  ALTA: "bg-red-600/90 text-white",
  MEDIA: "bg-amber-500/90 text-white",
  BAJA: "bg-emerald-600/80 text-white",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium",
        priorityClasses[priority]
      )}
    >
      {priority}
    </span>
  );
}
