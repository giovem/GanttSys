"use client";

import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";
import { daysToPx } from "@/lib/date-utils";

const statusBarColors: Record<TaskStatus, string> = {
  LISTO: "bg-emerald-600",
  EN_PROGRESO: "bg-amber-500",
  ENTREGADO: "bg-blue-600",
  PENDIENTE: "bg-red-600",
};

interface GanttBarProps {
  task: Task;
  offsetPx: number;
  widthPx: number;
}

export function GanttBar({ task, offsetPx, widthPx }: GanttBarProps) {
  const progress = task.progress ?? 0;
  const days = Math.ceil(
    (new Date(task.end_date).getTime() - new Date(task.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 rounded-lg overflow-hidden flex items-center justify-center min-w-[60px]",
        statusBarColors[task.status]
      )}
      style={{
        left: offsetPx,
        width: widthPx,
      }}
    >
      <div
        className="absolute inset-0 bg-white/20"
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10 text-xs font-medium text-white drop-shadow-sm whitespace-nowrap">
        {progress}% | {days}d
      </span>
    </div>
  );
}
