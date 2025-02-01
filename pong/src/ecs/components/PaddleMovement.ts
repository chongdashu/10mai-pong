/**
 * Component for handling paddle movement in Pong
 * Tracks speed and movement constraints
 */
export class PaddleMovement {
  constructor(
    public speed: number = 400,
    public minY: number = 0,
    public maxY: number = 0,
    public direction: number = 0
  ) {}

  /**
   * Sets the movement direction (-1 for up, 1 for down, 0 for stop)
   */
  setDirection(direction: number): void {
    this.direction = Math.max(-1, Math.min(1, direction));
  }

  /**
   * Sets the movement constraints for the paddle
   */
  setConstraints(minY: number, maxY: number): void {
    this.minY = minY;
    this.maxY = maxY;
  }
}
