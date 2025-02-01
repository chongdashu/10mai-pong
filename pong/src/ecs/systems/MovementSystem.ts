import { Entity, ComponentRegistry } from '../entities';
import { Transform } from '../components/Transform';
import { PlayerState } from '../components/PlayerState';
import { Direction } from '../../factories/LevelFactory';
import { GridMovement } from '../components/GridMovement';

/**
 * System that processes movement for entities with GridMovement components
 */
export class MovementSystem {
  /**
   * Update movement for all entities with GridMovement components
   * @param entities List of entities to process
   * @param delta Time elapsed since last update in seconds
   */
  update(entities: Entity[], delta: number): void {
    entities.forEach(entity => {
      const playerState = entity.getComponent<PlayerState>(
        ComponentRegistry.PlayerState
      );
      const transform = entity.getComponent<Transform>(
        ComponentRegistry.Transform
      );
      const movement = entity.getComponent<GridMovement>(
        ComponentRegistry.GridMovement
      );

      // Skip if no movement component or already moving
      if (!movement || !transform || !playerState) {
        return;
      }

      if (movement.isMoving) {
        // Continue current movement
        movement.update(entity, delta);
        return;
      }

      // Try to move in current direction
      if (playerState.direction !== Direction.NONE) {
        const nextPos = this.getNextPosition(
          transform.gridX,
          transform.gridY,
          playerState.direction
        );

        if (movement.canMoveTo(nextPos.x, nextPos.y)) {
          movement.setTarget(nextPos.x, nextPos.y);
        }
      }

      // Update movement
      movement.update(entity, delta);
    });
  }

  /**
   * Get the next grid position based on current direction
   */
  private getNextPosition(
    gridX: number,
    gridY: number,
    direction: Direction
  ): { x: number; y: number } {
    let x = gridX;
    let y = gridY;

    switch (direction) {
      case Direction.UP:
        y--;
        break;
      case Direction.DOWN:
        y++;
        break;
      case Direction.LEFT:
        x--;
        break;
      case Direction.RIGHT:
        x++;
        break;
    }

    return { x, y };
  }
}
