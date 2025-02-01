-- Replace GAME_KEY with your game's unique identifier (e.g., 'pacman', 'snake')
-- Replace GAME_NAME with your game's display name (e.g., 'Pac-Man', 'Snake')

-- Insert game record
insert into public.games (game_key, display_name)
values ('pong', 'Pong Game')
on conflict (game_key) do update
set display_name = excluded.display_name;

-- Create game-specific view for high scores
create or replace view public.pong_high_scores as
select
  u.username,
  gs.score,
  gs.metadata,
  gs.created_at
from public.game_sessions gs
join public.games g on g.id = gs.game_id
join public.users u on u.id = gs.user_id
where g.game_key = 'pong'
order by gs.score desc;

-- Grant permissions
grant select on public.pong_high_scores to anon, authenticated;
