import { Entity } from '../ecs/entities/base/Entity';
import { PlayerBuilder } from '../ecs/entities/builders/PlayerBuilder';
import { LevelSprite } from '../sprites/LevelSprite';

/**
 * Factory class for creating player entities
 */
export class PlayerFactory {
  /**
   * Create a new player entity at the specified grid position
   */
  static create(
    gridX: number,
    gridY: number,
    levelSprite: LevelSprite,
    movementType: 'discrete' | 'continuous' = 'discrete'
  ): Entity {
    return PlayerBuilder.create(gridX, gridY, levelSprite, movementType);
  }
}
