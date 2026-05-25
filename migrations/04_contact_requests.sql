-- contact_requests: replaces the fake setTimeout in the therapist contact form

create table public.contact_requests (
  id uuid default gen_random_uuid() primary key,
  therapist_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  preferred_date date,
  created_at timestamptz default now() not null
);

alter table public.contact_requests enable row level security;

create policy "Usuarios pueden insertar solicitudes de contacto."
  on contact_requests for insert
  with check ( auth.uid() = user_id or user_id is null );

create policy "Usuarios pueden ver sus propias solicitudes."
  on contact_requests for select
  using ( auth.uid() = user_id );
