import { Direction } from '../../factories/LevelFactory';

/**
 * Component that tracks player-specific state
 */
export class PlayerState {
  constructor(
    public score: number = 0,
    public lives: number = 3,
    public direction: Direction = Direction.NONE
  ) {}

  /**
   * Add points to the player's score
   */
  addScore(points: number): void {
    this.score += points;
  }

  /**
   * Set the player's movement direction
   */
  setDirection(direction: Direction): void {
    this.direction = direction;
  }
}
