"use client";

import { useMemo, useState } from "react";
import {
  getProjectMinDate,
  getDateRange,
  formatMonthHeader,
  formatDayOfWeek,
  daysToPx,
  calculateOffsetInDays,
  calculateWidthInDays,
  DAY_WIDTH,
  isWeekend,
} from "@/lib/date-utils";
import { addDays, startOfMonth, isSameDay } from "date-fns";
import { GanttLeftColumn } from "./GanttLeftColumn";
import { GanttBar } from "./GanttBar";
import { TaskEditModal } from "./TaskEditModal";
import type { Task } from "@/types";
import { GANTT_ROW_HEIGHT } from "./GanttTimeline";
import { cn } from "@/lib/utils";

interface GanttChartProps {
  tasks: Task[];
}

export function GanttChart({ tasks }: GanttChartProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const today = useMemo(() => new Date(), []);

  const { minDate, numDays, totalWidthPx } = useMemo(() => {
    if (tasks.length === 0) {
      const min = today;
      const numDays = 30;
      return {
        minDate: min,
        numDays,
        totalWidthPx: daysToPx(numDays),
      };
    }
    const starts = tasks.map((t) => t.start_date);
    const ends = tasks.map((t) => t.end_date);
    const projectStart = getProjectMinDate(starts);
    const minDate = projectStart.getTime() < today.getTime() ? projectStart : new Date(today.getTime());
    const maxDate = new Date(
      Math.max(...ends.map((d) => new Date(d).getTime()), today.getTime())
    );
    const numDays = Math.max(
      1,
      Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 7
    );
    const start = minDate;
    const totalWidthPx = daysToPx(numDays);
    return { minDate: start, numDays, totalWidthPx };
  }, [tasks, today]);

  const dates = useMemo(
    () => getDateRange(minDate, addDays(minDate, numDays - 1)),
    [minDate, numDays]
  );

  const monthRanges = useMemo(() => {
    const ranges: { month: Date; start: number; end: number }[] = [];
    let i = 0;
    while (i < dates.length) {
      const start = i;
      const monthStart = dates[i];
      while (
        i < dates.length &&
        startOfMonth(dates[i]).getTime() === startOfMonth(monthStart).getTime()
      ) {
        i++;
      }
      ranges.push({ month: monthStart, start, end: i - 1 });
    }
    return ranges;
  }, [dates]);

  return (
    <div className="flex h-full overflow-hidden">
      <TaskEditModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSuccess={() => setEditingTask(null)}
      />
      <GanttLeftColumn tasks={tasks} onEditTask={setEditingTask} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Headers: months */}
        <div
          className="flex border-b border-border shrink-0"
          style={{ width: totalWidthPx, minWidth: totalWidthPx }}
        >
          {monthRanges.map(({ month, start, end }) => (
            <div
              key={month.getTime()}
              className="border-r border-border px-1 py-1 text-center text-xs font-medium text-muted-foreground bg-card"
              style={{
                width: (end - start + 1) * DAY_WIDTH,
                minWidth: (end - start + 1) * DAY_WIDTH,
              }}
            >
              {formatMonthHeader(month)}
            </div>
          ))}
        </div>
        {/* Headers: days */}
        <div
          className="flex border-b border-border shrink-0 scrollbar-thin"
          style={{ width: totalWidthPx, minWidth: totalWidthPx }}
        >
          {dates.map((d, idx) => (
            <div
              key={idx}
              className={cn(
                "shrink-0 border-r border-border flex flex-col items-center py-1 text-xs",
                isWeekend(d) ? "bg-[hsl(var(--weekend-bg))]" : "bg-card",
                isWeekend(d) ? "text-red-400" : "text-muted-foreground"
              )}
              style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
            >
              <span>{d.getDate()}</span>
              <span className="text-[10px] opacity-80">{formatDayOfWeek(d)}</span>
            </div>
          ))}
        </div>
        {/* Body: scrollable rows with bars */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div style={{ width: totalWidthPx, minWidth: totalWidthPx }}>
            {tasks.map((task, rowIndex) => {
              const start = new Date(task.start_date);
              const end = new Date(task.end_date);
              const offsetDays = calculateOffsetInDays(minDate, start);
              const widthDays = calculateWidthInDays(start, end);
              const offsetPx = daysToPx(offsetDays);
              const widthPx = daysToPx(widthDays);
              return (
                <div
                  key={task.id}
                  className="relative border-b border-border"
                  style={{ height: GANTT_ROW_HEIGHT }}
                >
                  {/* Today line */}
                  {dates.map((d, idx) => {
                    if (!isSameDay(d, today)) return null;
                    const left = idx * DAY_WIDTH;
                    return (
                      <div
                        key="today"
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 pointer-events-none"
                        style={{ left: left + DAY_WIDTH / 2 }}
                      />
                    );
                  })}
                  <GanttBar task={task} offsetPx={offsetPx} widthPx={widthPx} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
