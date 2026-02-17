-- ============================================
-- GanttSys - Schema completo para Supabase
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- 1. Extensiones
create extension if not exists "uuid-ossp";

-- 2. Tabla public.users (extiende auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'USER' check (role in ('USER', 'ADMIN')),
  created_at timestamptz default now()
);

-- 3. Tabla public.tasks
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  status text check (status in ('LISTO', 'EN_PROGRESO', 'ENTREGADO', 'PENDIENTE')),
  priority text check (priority in ('ALTA', 'MEDIA', 'BAJA')),
  start_date date not null,
  end_date date not null,
  progress int check (progress >= 0 and progress <= 100) default 0,
  created_at timestamptz default now(),
  constraint tasks_dates check (end_date >= start_date)
);

-- Índices para rendimiento
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_dates on public.tasks(start_date, end_date);
create index if not exists idx_users_email on public.users(email);

-- ============================================
-- Trigger: sincronizar auth.users -> public.users
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  is_main_admin boolean;
begin
  is_main_admin := (new.email = 'emmanuel.villasanti@grupoepem.com.py');

  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    case when is_main_admin then 'ADMIN' else 'USER' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- RLS: Activar en todas las tablas
-- ============================================
alter table public.users enable row level security;
alter table public.tasks enable row level security;

-- ============================================
-- Políticas para public.tasks
-- ============================================

-- USER: solo sus propias tareas
create policy "tasks_select_own"
  on public.tasks for select
  using (
    auth.role() = 'authenticated'
    and (
      (select role from public.users where id = auth.uid()) = 'ADMIN'
      or user_id = auth.uid()
    )
  );

create policy "tasks_insert_own"
  on public.tasks for insert
  with check (
    auth.role() = 'authenticated'
    and user_id = auth.uid()
  );

create policy "tasks_update_own_or_admin"
  on public.tasks for update
  using (
    auth.role() = 'authenticated'
    and (
      (select role from public.users where id = auth.uid()) = 'ADMIN'
      or user_id = auth.uid()
    )
  )
  with check (
    (select role from public.users where id = auth.uid()) = 'ADMIN'
    or user_id = auth.uid()
  );

create policy "tasks_delete_own_or_admin"
  on public.tasks for delete
  using (
    auth.role() = 'authenticated'
    and (
      (select role from public.users where id = auth.uid()) = 'ADMIN'
      or user_id = auth.uid()
    )
  );

-- ============================================
-- Políticas para public.users
-- ============================================

-- USER: solo su propio registro
-- ADMIN: ver todos, modificar roles, eliminar, crear (crear usuario se hace vía Auth + insert en Server Action)
create policy "users_select_own"
  on public.users for select
  using (
    auth.role() = 'authenticated'
    and (
      id = auth.uid()
      or (select role from public.users where id = auth.uid()) = 'ADMIN'
    )
  );

create policy "users_update_admin_only"
  on public.users for update
  using (
    auth.role() = 'authenticated'
    and (select role from public.users where id = auth.uid()) = 'ADMIN'
  );

create policy "users_delete_admin_only"
  on public.users for delete
  using (
    auth.role() = 'authenticated'
    and (select role from public.users where id = auth.uid()) = 'ADMIN'
  );

-- INSERT en users: no se expone a clientes. Solo:
-- 1) El trigger on_auth_user_created (SECURITY DEFINER) inserta al registrarse.
-- 2) El panel admin crea usuarios vía Server Action con service_role (bypasea RLS).
-- Sin política INSERT para authenticated/anon, solo trigger y service_role pueden insertar.

-- ============================================
-- Función para que ADMIN asigne rol (opcional, si se usa desde client con anon key)
-- ============================================
-- La modificación de roles se hace desde Server Actions con supabase client del usuario
-- (ADMIN), por lo que las políticas UPDATE anteriores son suficientes.
