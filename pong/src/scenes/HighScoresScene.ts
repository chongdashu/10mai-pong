import { Scene } from 'phaser';
import { getHighScores } from '../services/supabase/score';
import { SpriteButton } from '../sprites/SpriteButton';

export class HighScoresScene extends Scene {
  constructor() {
    super({ key: 'HighScoresScene' });
  }

  async create(): Promise<void> {
    const { width, height } = this.cameras.main;

    // Add title
    this.add
      .text(width / 2, 50, 'HIGH SCORES', {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Add loading text (will be replaced with scores)
    const loadingText = this.add
      .text(width / 2, height / 2, 'Loading scores...', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Fetch high scores
    const scores = await getHighScores();

    // Remove loading text
    loadingText.destroy();

    if (scores.length === 0) {
      this.add
        .text(width / 2, height / 2, 'No scores yet!', {
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
    } else {
      // Create score display
      const startY = 150;
      const spacing = 40;

      // Add headers
      this.add
        .text(width * 0.2, startY, 'RANK', {
          fontSize: '24px',
          color: '#4a9aea',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      this.add
        .text(width * 0.4, startY, 'PLAYER', {
          fontSize: '24px',
          color: '#4a9aea',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      this.add
        .text(width * 0.6, startY, 'SCORE', {
          fontSize: '24px',
          color: '#4a9aea',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      this.add
        .text(width * 0.8, startY, 'DATE', {
          fontSize: '24px',
          color: '#4a9aea',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Add scores
      scores.forEach((score, index) => {
        const y = startY + (index + 1) * spacing;

        // Rank
        this.add
          .text(width * 0.2, y, `#${index + 1}`, {
            fontSize: '20px',
            color: '#ffffff',
          })
          .setOrigin(0.5);

        // Player name
        this.add
          .text(width * 0.4, y, score.username, {
            fontSize: '20px',
            color: '#ffffff',
          })
          .setOrigin(0.5);

        // Score
        this.add
          .text(width * 0.6, y, score.score.toString(), {
            fontSize: '20px',
            color: '#ffffff',
          })
          .setOrigin(0.5);

        // Date
        const date = new Date(score.created_at).toLocaleDateString();
        this.add
          .text(width * 0.8, y, date, {
            fontSize: '20px',
            color: '#ffffff',
          })
          .setOrigin(0.5);
      });
    }

    // Back button
    new SpriteButton(
      this,
      width / 2,
      height - 50,
      200,
      50,
      'Back to Menu',
      () => {
        this.scene.start('MainMenuScene');
      }
    );
  }
}
