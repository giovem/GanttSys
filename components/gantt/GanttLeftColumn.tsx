"use client";

import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { Task } from "@/types";
import { getDaysBetween } from "@/lib/date-utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { GANTT_ROW_HEIGHT } from "./GanttTimeline";
import { Button } from "@/components/ui/button";

interface GanttLeftColumnProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
}

export function GanttLeftColumn({ tasks, onEditTask }: GanttLeftColumnProps) {
  return (
    <div className="shrink-0 w-[320px] flex flex-col border-r border-border bg-card">
      <div className="h-[34px] border-b border-border" />
      <div className="h-[34px] border-b border-border" />
      <div className="flex-1 overflow-hidden">
        {tasks.map((task) => {
          const start = parseISO(task.start_date);
          const end = parseISO(task.end_date);
          const days = getDaysBetween(start, end);
          return (
            <div
              key={task.id}
              className="border-b border-border px-3 py-2 flex flex-col gap-1 group"
              style={{ minHeight: GANTT_ROW_HEIGHT }}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="font-medium text-sm truncate min-w-0" title={task.title}>
                  {task.title}
                </div>
                {onEditTask && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-7 px-2 opacity-70 group-hover:opacity-100"
                    onClick={() => onEditTask(task)}
                  >
                    Editar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <div className="text-xs text-muted-foreground">
                {task.progress ?? 0}/{days} días
              </div>
              <div className="text-[10px] text-muted-foreground">
                {format(start, "dd/MM/yyyy", { locale: es })} → {format(end, "dd/MM/yyyy", { locale: es })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
