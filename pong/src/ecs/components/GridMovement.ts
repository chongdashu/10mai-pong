import { Entity, ComponentRegistry } from '../entities';
import { Transform } from './Transform';
import { Level, TileType, TILE_SIZE } from '../../factories/LevelFactory';

const HALF_TILE = TILE_SIZE / 2;

// Add this helper type at the top
type WorldPosition = { x: number; y: number };

/**
 * Base class for grid-based movement components
 */
export abstract class GridMovement {
  constructor(
    public speed: number,
    public gridSize: number,
    public targetGridX: number,
    public targetGridY: number,
    public isMoving: boolean = false,
    public level: Level | null = null
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract update(entity: Entity, delta: number): void;

  // Update gridToWorld to clarify it returns LEVEL SPACE coordinates
  protected gridToWorld(gridX: number, gridY: number): WorldPosition {
    return {
      x: gridX * TILE_SIZE + HALF_TILE,
      y: gridY * TILE_SIZE + HALF_TILE,
    };
  }

  public canMoveTo(gridX: number, gridY: number): boolean {
    if (!this.level) return true;
    return this.level.getTileAt(gridX, gridY) !== TileType.WALL;
  }

  public setLevel(level: Level): void {
    this.level = level;
  }

  public setTarget(gridX: number, gridY: number): void {
    this.targetGridX = gridX;
    this.targetGridY = gridY;
    this.isMoving = true;
  }

  static create(
    type: 'discrete' | 'continuous',
    speed: number,
    gridSize: number,
    x: number,
    y: number
  ): GridMovement {
    return type === 'discrete'
      ? new DiscreteGridMovement(speed, gridSize, x, y)
      : new ContinuousGridMovement(speed, gridSize, x, y);
  }
}

/**
 * Component for instant grid-to-grid movement
 */
export class DiscreteGridMovement extends GridMovement {
  private moveTimer: number = 0;
  private readonly MOVE_DELAY = 0.15; // 150ms delay between moves

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(entity: Entity, delta: number): void {
    const transform = entity.getComponent<Transform>(
      ComponentRegistry.Transform
    );
    if (!transform || !this.isMoving) return;

    // Add delay between moves
    this.moveTimer += delta;
    if (this.moveTimer < this.MOVE_DELAY) return;
    this.moveTimer = 0;

    // Convert to LEVEL SPACE coordinates (no screen offset)
    const levelPos = this.gridToWorld(this.targetGridX, this.targetGridY);

    transform.gridX = this.targetGridX;
    transform.gridY = this.targetGridY;
    transform.x = levelPos.x; // Store in level space
    transform.y = levelPos.y;
    this.isMoving = false;
  }

  public setTarget(gridX: number, gridY: number): void {
    super.setTarget(gridX, gridY);
    this.moveTimer = 0; // Reset timer when setting new target
  }
}

/**
 * Component for smooth interpolated grid movement
 */
export class ContinuousGridMovement extends GridMovement {
  private readonly STOP_THRESHOLD = 2;
  private readonly DAMPING = 0.92; // Increased from 0.8

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(entity: Entity, delta: number): void {
    const transform = entity.getComponent<Transform>(
      ComponentRegistry.Transform
    );
    if (!transform || !this.isMoving) return;

    // Check for collision
    if (!this.canMoveTo(this.targetGridX, this.targetGridY)) {
      this.isMoving = false;
      return;
    }

    // Convert target grid position to world coordinates
    const targetPos = this.gridToWorld(this.targetGridX, this.targetGridY);

    // Calculate movement this frame
    const dx = targetPos.x - transform.x;
    const dy = targetPos.y - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If we're close enough to target, snap to it and stop
    if (distance <= this.STOP_THRESHOLD) {
      transform.x = targetPos.x;
      transform.y = targetPos.y;
      transform.gridX = this.targetGridX;
      transform.gridY = this.targetGridY;
      this.isMoving = false;
      return;
    }

    // Calculate damped movement
    const moveDistance = this.speed * delta * this.DAMPING;
    const ratio = Math.min(moveDistance / distance, 1.0);

    // Apply movement
    transform.x += dx * ratio;
    transform.y += dy * ratio;
  }
}
