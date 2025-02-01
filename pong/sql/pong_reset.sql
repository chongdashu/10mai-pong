-- Replace GAME_KEY with your game's unique identifier (e.g., 'pacman', 'snake')

-- Drop game-specific view
drop view if exists public.template_high_scores;

-- Delete game sessions for this game
delete from public.game_sessions
where game_id = (
    select id from public.games where game_key = 'pong'
);

-- Delete game entry
delete from public.games where game_key = 'pong';
