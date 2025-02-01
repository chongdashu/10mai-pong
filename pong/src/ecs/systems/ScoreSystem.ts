import { Scene } from 'phaser';
import { Score } from '../components/Score';
import { Transform } from '../components/Transform';
import { GridMovement } from '../components/GridMovement';
import { supabase } from '../../services/supabase/client';
import { Entity } from '../entities/base/Entity';
import { ComponentRegistry } from '../entities/types/ComponentRegistry';

/**
 * System for managing scoring and high scores
 */
export class ScoreSystem {
  private scoreText: Phaser.GameObjects.Text;
  private bestScoreText: Phaser.GameObjects.Text;

  constructor(private scene: Scene) {
    this.scoreText = scene.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff',
    });
    this.bestScoreText = scene.add.text(16, 56, 'Best: 0', {
      fontSize: '32px',
      color: '#fff',
    });
  }

  /**
   * Updates score based on player position
   */
  update(entity: Entity): void {
    const score = entity.getComponent<Score>(ComponentRegistry.Score);
    const transform = entity.getComponent<Transform>(
      ComponentRegistry.Transform
    );
    const gridMovement = entity.getComponent<GridMovement>(
      ComponentRegistry.GridMovement
    );

    if (!score || !transform || !gridMovement) return;

    // Update score based on grid position
    const gridX = Math.floor(transform.x / gridMovement.gridSize);
    const gridY = Math.floor(transform.y / gridMovement.gridSize);
    score.addVisitedGrid(gridX, gridY);

    // Update display
    this.scoreText.setText(`Score: ${score.score}`);
    this.bestScoreText.setText(`Best: ${score.bestScore}`);
  }

  /**
   * Submit final score to backend
   */
  async submitFinalScore(entity: Entity): Promise<void> {
    const score = entity.getComponent<Score>(ComponentRegistry.Score);
    if (!score) return;

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.error('No user session found');
        return;
      }

      const { error } = await supabase.from('game_sessions').insert({
        game_id: (
          await supabase
            .from('games')
            .select('id')
            .eq('game_key', 'template')
            .single()
        ).data?.id,
        user_id: session.user.id,
        score: score.score,
        metadata: {},
      });

      if (error) {
        console.error('Error submitting score:', error);
      }
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  }
}
