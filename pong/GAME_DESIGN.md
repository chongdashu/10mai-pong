# Game Design Document

## Game Mechanics

- Single player vs AI opponent
- Ball physics:
  - Constant base speed with 5% speed increase after each paddle hit
  - 45-135 degree angle variation on paddle collisions
  - Wall collisions reverse vertical direction
- Scoring:
  - AI scores when their paddle hits the ball
  - Player scores when their paddle hits the ball
  - Round ends when the ball passes either boundary
- AI Behavior:
  - Tracks ball's Y position with 0.8s reaction delay
  - 95% tracking accuracy with occasional overshoot

## Game Visuals

- Retro arcade style:
  - Neon paddles/ball (cyan vs magenta)
  - Dark gradient background
  - Glowing trail effect on ball
  - Dashed center line
- UI Elements:
  - Large score display (top center)
  - Score for player and score for AI shown
  - Player also has best score ever shown
  - "SERVE" text prompt after scores
  - Game over screen with restart button

## Game Controls

- Player Input:
  - Mouse/Touch: Vertical paddle movement
  - Keyboard (alternative): W/S keys for vertical movement
- AI Paddle:
  - Automated vertical tracking
  - Constrained to movement bounds

## Game Flow

1. Start Menu -> Game Scene
2. Ball served towards player at random angle
3. Continuous play until ball passes either boundary
4. Score update + brief pause
5. Ball reset to center after score
6. Game Over screen on passing boundary
7. Restart returns to fresh match
8. Main Menu button returns player to start menu

## Game Backend Services

- Supabase integration for:
  - Anonymous guest authentication
  - High score tracking for points obtained
  - Realtime leaderboard updates
- Cloud Functions:
  - Score validation
  - Anti-cheat measures
