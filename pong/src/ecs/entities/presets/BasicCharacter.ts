/**
 * Entity presets - preconfigured component sets for common entity types
 *
 * Provides reusable entity templates with standardized component configurations.
 * Helps maintain consistency across similar entities and reduces duplicate code.
 */

import { Entity } from '../base/Entity';
import { ComponentRegistry } from '../types/ComponentRegistry';
import { Transform } from '../../components/Transform';
import { GridMovement } from '../../components/GridMovement';
import { TILE_SIZE, HALF_TILE } from '../../constants/GameConstants';

/**
 * Creates a basic character entity with core movement capabilities
 * @param gridX - Starting X position in grid coordinates
 * @param gridY - Starting Y position in grid coordinates
 * @param movement - Configured GridMovement component
 * @returns New entity preconfigured with character components
 */
export function createBasicCharacter(
  gridX: number,
  gridY: number,
  movement: GridMovement
): Entity {
  const entity = new Entity();

  entity.addComponent(
    ComponentRegistry.Transform,
    new Transform(
      gridX * TILE_SIZE + HALF_TILE, // Use game constants
      gridY * TILE_SIZE + HALF_TILE,
      gridX,
      gridY
    )
  );

  entity.addComponent(ComponentRegistry.GridMovement, movement);
  return entity;
}

/**
 * Example usage:
 * const player = createBasicCharacter(5, 5, new DiscreteGridMovement(200, 5, 5));
 * world.addEntity(player);
 */
