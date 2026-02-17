"use client";

import {
  getProjectMinDate,
  getDateRange,
  formatMonthHeader,
  formatDayOfWeek,
  daysToPx,
  DAY_WIDTH,
  isWeekend,
} from "@/lib/date-utils";
import { addMonths, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";

const ROW_HEIGHT = 48;

interface GanttTimelineProps {
  minDate: Date;
  numDays: number;
  today: Date;
  children: React.ReactNode;
}

export function GanttTimeline({
  minDate,
  numDays,
  today,
  children,
}: GanttTimelineProps) {
  const totalWidthPx = daysToPx(numDays);
  const dates = getDateRange(minDate, addDays(minDate, numDays - 1));

  const monthRanges: { month: Date; start: number; end: number }[] = [];
  let i = 0;
  while (i < dates.length) {
    const start = i;
    const monthStart = dates[i];
    while (i < dates.length && startOfMonth(dates[i]).getTime() === startOfMonth(monthStart).getTime()) {
      i++;
    }
    monthRanges.push({
      month: monthStart,
      start,
      end: i - 1,
    });
  }

  return (
    <div className="flex flex-col h-full min-w-0">
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
      <div
        className="flex border-b border-border shrink-0"
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
      <div className="relative flex-1 overflow-auto scrollbar-thin" style={{ minHeight: ROW_HEIGHT }}>
        <div
          className="relative"
          style={{ width: totalWidthPx, minWidth: totalWidthPx }}
        >
          {dates.map((d, idx) => {
            const isToday = isSameDay(d, today);
            if (!isToday) return null;
            const left = idx * DAY_WIDTH;
            return (
              <div
                key="today"
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 pointer-events-none"
                style={{ left: left + DAY_WIDTH / 2 }}
              />
            );
          })}
          {children}
        </div>
      </div>
    </div>
  );
}

export const GANTT_ROW_HEIGHT = ROW_HEIGHT;
