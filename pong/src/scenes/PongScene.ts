import { Scene } from 'phaser';
import { Paddle } from '../ecs/entities/Paddle';
import { Ball } from '../ecs/entities/Ball';
import { AIPaddle } from '../ecs/components/AIPaddle';

/**
 * Main scene for Pong game
 */
export class PongScene extends Scene {
  private playerPaddle: Paddle | null = null;
  private aiPaddle: Paddle | null = null;
  private ball: Ball | null = null;
  private ai: AIPaddle | null = null;
  private playerScoreText: Phaser.GameObjects.Text | null = null;
  private aiScoreText: Phaser.GameObjects.Text | null = null;
  private gameOverContainer: Phaser.GameObjects.Container | null = null;
  private isGameOver: boolean = false;

  constructor() {
    super({ key: 'PongScene' });
  }

  create(): void {
    // Reset game state
    this.isGameOver = false;

    // Get game dimensions
    const { width: gameWidth, height: gameHeight } = this.cameras.main;

    // Create game boundaries (white lines)
    const lineWidth = 2;
    this.add.rectangle(gameWidth / 2, 0, gameWidth, lineWidth, 0xffffff); // Top
    this.add.rectangle(
      gameWidth / 2,
      gameHeight,
      gameWidth,
      lineWidth,
      0xffffff
    ); // Bottom
    this.add.rectangle(0, gameHeight / 2, lineWidth, gameHeight, 0xffffff); // Left
    this.add.rectangle(
      gameWidth,
      gameHeight / 2,
      lineWidth,
      gameHeight,
      0xffffff
    ); // Right

    // Add center line (dashed)
    const dashLength = 10;
    const gapLength = 10;
    const centerX = gameWidth / 2;
    for (let y = dashLength / 2; y < gameHeight; y += dashLength + gapLength) {
      this.add.rectangle(centerX, y, lineWidth, dashLength, 0xffffff);
    }

    // Create player paddle on left side
    this.playerPaddle = new Paddle(this, 50, gameHeight / 2);
    this.playerPaddle.movement.setConstraints(
      this.playerPaddle.height / 2,
      gameHeight - this.playerPaddle.height / 2
    );

    // Create AI paddle on right side
    this.aiPaddle = new Paddle(this, gameWidth - 50, gameHeight / 2);
    this.aiPaddle.movement.setConstraints(
      this.aiPaddle.height / 2,
      gameHeight - this.aiPaddle.height / 2
    );
    this.aiPaddle.movement.speed = 500;
    this.ai = new AIPaddle();

    // Create ball at center
    this.ball = new Ball(this, gameWidth / 2, gameHeight / 2);

    // Add score displays
    this.playerScoreText = this.add
      .text(gameWidth * 0.25, 50, '', {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    this.aiScoreText = this.add
      .text(gameWidth * 0.75, 50, '', {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    // Initialize score display
    this.updateScoreDisplay();

    // Setup keyboard input
    this.input.keyboard?.on('keydown-W', () => {
      this.playerPaddle?.movement.setDirection(-1);
    });

    this.input.keyboard?.on('keydown-S', () => {
      this.playerPaddle?.movement.setDirection(1);
    });

    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      if ((event.key === 'w' || event.key === 's') && this.playerPaddle) {
        this.playerPaddle.movement.setDirection(0);
      }
    });

    // Create game over container (hidden initially)
    this.createGameOverScreen();

    // Start the game after a short delay
    this.time.delayedCall(1000, () => {
      if (!this.isGameOver && this.ball) {
        this.ball.physics.serve(-1);
      }
    });
  }

  update(time: number, delta: number): void {
    if (
      this.isGameOver ||
      !this.ball ||
      !this.playerPaddle ||
      !this.aiPaddle ||
      !this.ai
    )
      return;

    // Update paddles
    this.playerPaddle.update(time, delta);
    this.aiPaddle.update(time, delta);

    // Update ball
    this.ball.update(time, delta);

    // Update AI
    this.ai.updateTarget(this.ball.y, time);
    this.aiPaddle.movement.setDirection(this.ai.getDirection(this.aiPaddle.y));

    // Check collisions with walls
    if (
      this.ball.y <= this.ball.height / 2 ||
      this.ball.y >= this.cameras.main.height - this.ball.height / 2
    ) {
      this.ball.physics.hitWall();
    }

    // Check collision with paddles and update scores
    const isPlayerHit = this.checkPaddleCollision(this.ball, this.playerPaddle);
    const isAIHit = this.checkPaddleCollision(this.ball, this.aiPaddle);

    if (isPlayerHit || isAIHit) {
      if (isPlayerHit) {
        this.playerPaddle.recordHit();
        this.ball.physics.hitPaddle(
          this.playerPaddle.y,
          this.ball.y,
          this.playerPaddle.height
        );
      } else {
        this.aiPaddle.recordHit();
        this.ball.physics.hitPaddle(
          this.aiPaddle.y,
          this.ball.y,
          this.aiPaddle.height
        );
      }
      this.updateScoreDisplay();
    }

    // Check if ball is out of bounds
    if (this.ball.x < 0 || this.ball.x > this.cameras.main.width) {
      this.handleGameOver(this.ball.x < 0 ? 'AI' : 'Player');
    }
  }

  /**
   * Checks for collision between ball and paddle
   */
  private checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    return (
      Math.abs(ball.x - paddle.x) < (ball.width + paddle.width) / 2 &&
      Math.abs(ball.y - paddle.y) < (ball.height + paddle.height) / 2
    );
  }

  /**
   * Updates the score display
   */
  private updateScoreDisplay(): void {
    if (this.playerPaddle && this.aiPaddle) {
      this.playerScoreText?.setText(
        `Hits: ${this.playerPaddle.score.hits}\nBest: ${this.playerPaddle.score.bestHits}`
      );
      this.aiScoreText?.setText(`Hits: ${this.aiPaddle.score.hits}`);
    }
  }

  /**
   * Creates the game over screen (hidden initially)
   */
  private createGameOverScreen(): void {
    const { width: gameWidth, height: gameHeight } = this.cameras.main;

    // Create container for game over elements
    this.gameOverContainer = this.add.container(0, 0);
    this.gameOverContainer.setVisible(false);

    // Semi-transparent background
    const overlay = this.add.rectangle(
      0,
      0,
      gameWidth,
      gameHeight,
      0x000000,
      0.7
    );
    overlay.setOrigin(0);

    // Game Over text
    const gameOverText = this.add
      .text(gameWidth / 2, gameHeight * 0.25, 'GAME OVER', {
        fontSize: '64px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Final score text (will be updated when game ends)
    const finalScoreText = this.add
      .text(gameWidth / 2, gameHeight * 0.4, '', {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    // Play Again button
    const playAgainButton = this.add.rectangle(
      gameWidth / 2,
      gameHeight * 0.65,
      200,
      50,
      0x4a9aea
    );
    const playAgainText = this.add
      .text(gameWidth / 2, gameHeight * 0.65, 'Play Again', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Return to menu button
    const menuButton = this.add.rectangle(
      gameWidth / 2,
      gameHeight * 0.8,
      200,
      50,
      0x4a9aea
    );
    const menuText = this.add
      .text(gameWidth / 2, gameHeight * 0.8, 'Main Menu', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Make buttons interactive with hover effects
    [playAgainButton, menuButton].forEach(button => {
      button.setInteractive();
      button.on('pointerover', () => {
        button.setFillStyle(0x6abaff);
      });
      button.on('pointerout', () => {
        button.setFillStyle(0x4a9aea);
      });
    });

    // Button click handlers
    playAgainButton.on('pointerdown', () => {
      this.scene.restart();
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });

    // Add all elements to container
    this.gameOverContainer.add([
      overlay,
      gameOverText,
      finalScoreText,
      playAgainButton,
      playAgainText,
      menuButton,
      menuText,
    ]);
  }

  /**
   * Handles game over state
   */
  private handleGameOver(winner: 'Player' | 'AI'): void {
    if (!this.gameOverContainer || !this.playerPaddle || !this.aiPaddle) return;

    this.isGameOver = true;

    // Update final score text
    const finalScoreText = this.gameOverContainer
      .list[2] as Phaser.GameObjects.Text;
    finalScoreText.setText(
      `${winner} Wins!\n\n` +
        `Player Score: ${this.playerPaddle.score.hits}\n` +
        `Best Score: ${this.playerPaddle.score.bestHits}\n\n` +
        `AI Score: ${this.aiPaddle.score.hits}`
    );

    // Show game over screen
    this.gameOverContainer.setVisible(true);

    // Stop ball movement
    if (this.ball) {
      this.ball.physics.velocityX = 0;
      this.ball.physics.velocityY = 0;
    }
  }
}
