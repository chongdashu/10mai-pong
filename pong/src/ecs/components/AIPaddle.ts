/**
 * Component for AI-controlled paddle behavior
 * Tracks ball and moves with slight delay and imperfection
 */
export class AIPaddle {
  private targetY: number = 0;
  private readonly reactionDelay: number = 500; // Reduced from 800ms
  private readonly trackingAccuracy: number = 0.98; // Increased from 0.95
  private lastUpdateTime: number = 0;

  constructor(
    public difficulty: number = 1.0 // 0.0 to 1.0, affects speed and accuracy
  ) {}

  /**
   * Updates AI's target position based on ball position
   */
  updateTarget(ballY: number, currentTime: number): void {
    // Only update target after reaction delay
    if (currentTime - this.lastUpdateTime >= this.reactionDelay) {
      // Add some randomness to tracking accuracy
      const accuracy = this.trackingAccuracy * this.difficulty;
      const error = (1 - accuracy) * (Math.random() * 100 - 50);
      this.targetY = ballY + error;
      this.lastUpdateTime = currentTime;
    }
  }

  /**
   * Gets the movement direction towards target
   */
  getDirection(currentY: number): number {
    const distance = this.targetY - currentY;
    const threshold = 5; // Reduced from 10 for more precise movement

    if (Math.abs(distance) < threshold) return 0;
    return distance > 0 ? 1 : -1;
  }
}
