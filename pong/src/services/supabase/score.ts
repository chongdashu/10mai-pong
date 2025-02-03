import { supabase } from './client';

interface HighScore {
  username: string;
  score: number;
  metadata: {
    best_score: number;
  };
  created_at: string;
}

/**
 * Fetches high scores from Supabase
 */
export const getHighScores = async (
  limit: number = 10
): Promise<HighScore[]> => {
  try {
    const { data, error } = await supabase
      .from('pong_high_scores')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching high scores:', error);
    return [];
  }
};

/**
 * Submits a game session score to Supabase
 */
export const submitScore = async (score: number): Promise<void> => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Get game ID for 'pong'
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('game_key', 'pong')
      .single();

    if (gameError || !gameData) {
      throw new Error('Could not find game ID for pong');
    }

    // Submit score
    const { error } = await supabase.from('game_sessions').insert([
      {
        game_id: gameData.id,
        user_id: user.id,
        score: score,
        metadata: {
          best_score: score,
        },
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};
