import { Transform } from '../components/Transform';
import { PaddleMovement } from '../components/PaddleMovement';
import { Scene } from 'phaser';
import { PaddleScore } from '../components/PaddleScore';

/**
 * Paddle entity for Pong game
 * Combines position and movement components
 */
export class Paddle extends Phaser.GameObjects.Rectangle {
  public transform: Transform;
  public movement: PaddleMovement;
  public score: PaddleScore;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number = 20,
    height: number = 100
  ) {
    super(scene, x, y, width, height, 0xffffff);
    scene.add.existing(this);

    // Initialize transform with both world and grid coordinates
    this.transform = new Transform(x, y, Math.floor(x), Math.floor(y));
    this.movement = new PaddleMovement();
    this.score = new PaddleScore();

    // Set origin to center for proper positioning
    this.setOrigin(0.5);
  }

  /**
   * Updates paddle position based on movement
   */
  update(time: number, delta: number): void {
    // Calculate new position
    const deltaMove =
      this.movement.direction * this.movement.speed * (delta / 1000);
    const newY = this.y + deltaMove;

    // Constrain within bounds
    if (newY >= this.movement.minY && newY <= this.movement.maxY) {
      this.y = newY;
      this.transform.y = newY;
      this.transform.gridY = Math.floor(newY);
    }
  }

  /**
   * Records a successful hit
   */
  recordHit(): void {
    this.score.addHit();
  }
}
