/**
 * Component for handling ball physics in Pong
 * Manages velocity, speed, and collision behavior
 */
export class BallPhysics {
  constructor(
    public velocityX: number = 0,
    public velocityY: number = 0,
    public speed: number = 400,
    public speedMultiplier: number = 1.05
  ) {}

  /**
   * Sets the initial velocity with a random angle between -45 to 45 degrees
   * @param direction 1 for right, -1 for left
   */
  serve(direction: number): void {
    // Generate angle between -45 to 45 degrees in radians
    const angle = ((Math.random() - 0.5) * Math.PI) / 2;
    this.velocityX = Math.cos(angle) * this.speed * direction;
    this.velocityY = Math.sin(angle) * this.speed;
  }

  /**
   * Handles collision with paddle, increasing speed and calculating new angle
   */
  hitPaddle(paddleY: number, ballY: number, paddleHeight: number): void {
    // Reverse X direction
    this.velocityX *= -1;

    // Calculate relative intersection point (-0.5 to 0.5)
    const relativeIntersect = (paddleY - ballY) / (paddleHeight / 2);

    // Calculate new angle (-75 to 75 degrees)
    const angle = (relativeIntersect * Math.PI) / 3;

    // Set new velocities with increased speed
    const speed =
      Math.sqrt(
        this.velocityX * this.velocityX + this.velocityY * this.velocityY
      ) * this.speedMultiplier;
    this.velocityX = Math.cos(angle) * speed * (this.velocityX > 0 ? 1 : -1);
    this.velocityY = -Math.sin(angle) * speed;
  }

  /**
   * Handles collision with top/bottom walls
   */
  hitWall(): void {
    this.velocityY *= -1;
  }
}
