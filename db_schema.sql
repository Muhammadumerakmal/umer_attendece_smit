-- Create attendance table
create table if not exists public.attendance (
  id bigint generated always as identity primary key,
  student_id bigint references public.student_table(id) on delete cascade not null,
  date date not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, date)
);

-- Enable Row Level Security (RLS) if needed, currently keeping it simple as per existing setup
alter table public.attendance enable row level security;

-- Create policy to allow all access (since it's a demo/simple app based on anon key usage in code)
-- ideally this should be more restricted but matching current implied security model
create policy "Enable all access for all users" on public.attendance
for all using (true) with check (true);
