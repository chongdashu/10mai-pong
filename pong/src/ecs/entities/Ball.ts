import { Scene } from 'phaser';
import { Transform } from '../components/Transform';
import { BallPhysics } from '../components/BallPhysics';

/**
 * Ball entity for Pong game
 * Combines physics and visual representation
 */
export class Ball extends Phaser.GameObjects.Rectangle {
  public transform: Transform;
  public physics: BallPhysics;
  private readonly size: number = 15;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 15, 15, 0xffffff);
    scene.add.existing(this);

    this.transform = new Transform(x, y, Math.floor(x), Math.floor(y));
    this.physics = new BallPhysics();

    // Set origin to center for proper collision
    this.setOrigin(0.5);
  }

  /**
   * Updates ball position based on physics
   */
  update(time: number, delta: number): void {
    // Update position based on velocity
    const deltaSeconds = delta / 1000;
    const newX = this.x + this.physics.velocityX * deltaSeconds;
    const newY = this.y + this.physics.velocityY * deltaSeconds;

    // Update position
    this.x = newX;
    this.y = newY;
    this.transform.x = newX;
    this.transform.y = newY;
    this.transform.gridX = Math.floor(newX);
    this.transform.gridY = Math.floor(newY);
  }

  /**
   * Resets ball to center position
   */
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.transform.x = x;
    this.transform.y = y;
    this.transform.gridX = Math.floor(x);
    this.transform.gridY = Math.floor(y);
    this.physics.velocityX = 0;
    this.physics.velocityY = 0;
  }
}
