import { Entity } from '../base/Entity';
import { ComponentRegistry } from '../types/ComponentRegistry';
import { PlayerState } from '../../components/PlayerState';
import { GridMovement } from '../../components/GridMovement';
import { LevelSprite } from '../../../sprites/LevelSprite';
import { createBasicCharacter } from '../presets/BasicCharacter';
import { Score } from '../../components/Score';

/**
 * Builder for creating player entities
 */
export class PlayerBuilder {
  /**
   * Create a new player entity with configurable movement type
   */
  static create(
    gridX: number,
    gridY: number,
    levelSprite: LevelSprite,
    movementType: 'discrete' | 'continuous' = 'discrete'
  ): Entity {
    const movement = GridMovement.create(
      movementType,
      movementType === 'discrete' ? 8 : 300,
      32, // gridSize
      gridX,
      gridY
    );

    const entity = createBasicCharacter(gridX, gridY, movement);
    movement.setLevel(levelSprite.getLevel());

    // Player-specific additions
    entity.addComponent(ComponentRegistry.PlayerState, new PlayerState());
    entity.addComponent(ComponentRegistry.Score, new Score());

    return entity;
  }
}
