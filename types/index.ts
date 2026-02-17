export type UserRole = "USER" | "ADMIN";

export type TaskStatus = "LISTO" | "EN_PROGRESO" | "ENTREGADO" | "PENDIENTE";
export type TaskPriority = "ALTA" | "MEDIA" | "BAJA";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
}

export interface TaskInsert {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date: string;
  end_date: string;
  progress?: number;
}

export interface TaskUpdate {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string;
  end_date?: string;
  progress?: number;
}
