import { Entity, ComponentRegistry } from '../entities';
import { PlayerState } from '../components/PlayerState';
import { Direction } from '../../factories/LevelFactory';
import { Scene } from 'phaser';

/**
 * System that processes keyboard input for player movement
 */
export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  constructor(scene: Scene) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }
  }

  /**
   * Update input state for all entities with PlayerState components
   */
  update(entities: Entity[]): void {
    if (!this.cursors) return;

    entities.forEach(entity => {
      const playerState = entity.getComponent<PlayerState>(
        ComponentRegistry.PlayerState
      );
      if (!playerState) return;

      // Update direction based on keyboard input
      let newDirection = Direction.NONE;

      if (this.cursors?.up.isDown) {
        newDirection = Direction.UP;
      } else if (this.cursors?.down.isDown) {
        newDirection = Direction.DOWN;
      } else if (this.cursors?.left.isDown) {
        newDirection = Direction.LEFT;
      } else if (this.cursors?.right.isDown) {
        newDirection = Direction.RIGHT;
      }

      // Only update if direction changed
      if (newDirection !== playerState.direction) {
        playerState.setDirection(newDirection);
      }
    });
  }
}
