import {
  differenceInDays,
  startOfDay,
  format,
  isWeekend as dateFnsIsWeekend,
  addDays,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

const DAY_WIDTH_PX = 40;

/**
 * Número de días entre dos fechas (inclusive al menos el primer día).
 * start <= end.
 */
export function getDaysBetween(start: Date, end: Date): number {
  const s = startOfDay(start);
  const e = startOfDay(end);
  return Math.max(0, differenceInDays(e, s)) + 1;
}

/**
 * Fecha mínima del proyecto (mínimo start_date de tareas).
 * Si no hay tareas, devuelve hoy.
 */
export function getProjectMinDate(dates: (string | null)[]): Date {
  const valid = dates
    .filter((d): d is string => d != null && d !== "")
    .map((d) => (typeof d === "string" ? parseISO(d) : d));
  if (valid.length === 0) return startOfDay(new Date());
  return startOfDay(new Date(Math.min(...valid.map((d) => d.getTime()))));
}

/**
 * Días desde projectStart hasta taskStart (para offset en la grilla).
 */
export function calculateOffsetInDays(projectStart: Date, taskStart: Date): number {
  return differenceInDays(startOfDay(taskStart), startOfDay(projectStart));
}

/**
 * Ancho en días de una tarea (start_date a end_date inclusive).
 */
export function calculateWidthInDays(startDate: Date, endDate: Date): number {
  return getDaysBetween(startDate, endDate);
}

/**
 * Si la fecha cae en sábado o domingo.
 */
export function isWeekend(date: Date): boolean {
  return dateFnsIsWeekend(date);
}

/**
 * Ancho en px de N días (cada día = 40px).
 */
export function daysToPx(days: number): number {
  return days * DAY_WIDTH_PX;
}

export const DAY_WIDTH = DAY_WIDTH_PX;

/**
 * Formatear mes/año para encabezado del Gantt (ej: "ENE 26").
 */
export function formatMonthHeader(date: Date): string {
  return format(date, "MMM yy", { locale: es }).toUpperCase();
}

/**
 * Día de la semana corto (L, M, X, J, V, S, D).
 */
export function formatDayOfWeek(date: Date): string {
  return format(date, "EEEEE", { locale: es }).toUpperCase();
}

/**
 * Genera un rango de fechas día a día entre start y end.
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  let d = startOfDay(start);
  const e = startOfDay(end);
  while (d <= e) {
    out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

/**
 * Comprueba si una fecha está dentro del rango [start, end].
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start: startOfDay(start), end: startOfDay(end) });
}
