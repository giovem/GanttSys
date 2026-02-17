import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GanttChart } from "@/components/gantt/GanttChart";
import { TaskForm } from "@/components/gantt/TaskForm";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: true });

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">
      <div className="border-b border-border px-4 py-2 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-semibold">Vista Gantt</h1>
        <TaskForm />
      </div>
      <div className="flex-1 min-h-0">
        {tasks && tasks.length > 0 ? (
          <GanttChart tasks={tasks} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="mb-2">No hay tareas aún.</p>
              <p className="text-sm">Crea una tarea para ver el diagrama Gantt.</p>
              <TaskForm className="mt-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
