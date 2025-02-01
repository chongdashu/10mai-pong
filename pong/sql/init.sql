-- Enable the required extensions
create extension if not exists "uuid-ossp";

-- Create tables if they don't exist
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  created_at timestamptz default now()
);

create table if not exists public.games (
  id uuid default uuid_generate_v4() primary key,
  game_key text unique not null,
  display_name text not null,
  created_at timestamptz default now()
);

create table if not exists public.game_sessions (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  score integer default 0,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists game_sessions_user_id_idx on public.game_sessions(user_id);
create index if not exists game_sessions_game_id_idx on public.game_sessions(game_id);
create index if not exists game_sessions_score_idx on public.game_sessions(score desc);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.games enable row level security;
alter table public.game_sessions enable row level security;

-- Set up policies
create policy "Users can view all users"
  on public.users for select
  to authenticated, anon
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  to authenticated
  using (auth.uid() = id);

create policy "Allow users to insert their own record"
  on public.users for insert
  to authenticated, anon
  with check (
    -- For authenticated users, ensure they can only insert their own record
    (auth.uid() = id) or
    -- For anonymous users, allow insert
    (auth.jwt() is null)
  );

create policy "Anyone can view games"
  on public.games for select
  to authenticated, anon
  using (true);

create policy "Anyone can view game sessions"
  on public.game_sessions for select
  to authenticated, anon
  using (true);

create policy "Users can create game sessions"
  on public.game_sessions for insert
  to authenticated
  with check (true);

create policy "Users can update their own game sessions"
  on public.game_sessions for update
  to authenticated
  using (auth.uid() = user_id);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.users to anon, authenticated;
grant select on public.games to anon, authenticated;
grant select on public.game_sessions to anon, authenticated;
grant insert, update on public.game_sessions to authenticated;
grant update on public.users to authenticated;
grant insert on public.users to anon, authenticated;

-- Enable realtime subscriptions
alter publication supabase_realtime add table public.game_sessions;

-- Create debug function
create or replace function debug_auth()
returns table (
  role text,
  uid uuid,
  jwt jsonb
) security definer
as $$
begin
  return query select
    current_user,
    auth.uid(),
    auth.jwt();
end;
$$ language plpgsql;
