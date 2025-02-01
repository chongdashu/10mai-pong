import { Entity, ComponentRegistry } from '../ecs/entities';
import { Transform } from '../ecs/components/Transform';
import { PlayerState } from '../ecs/components/PlayerState';
import { Direction } from '../factories/LevelFactory';
import { LevelSprite } from '../sprites/LevelSprite';

/**
 * Visual representation of a player using Phaser sprites
 */
export class PlayerSprite extends Phaser.GameObjects.Sprite {
  private entity: Entity;
  private levelSprite: LevelSprite;

  constructor(scene: Phaser.Scene, entity: Entity, levelSprite: LevelSprite) {
    const transform = entity.getComponent<Transform>(
      ComponentRegistry.Transform
    );
    if (!transform) {
      throw new Error('Player entity must have a Transform component');
    }

    const { x, y } = levelSprite.gridToWorld(transform.gridX, transform.gridY);
    super(scene, x, y, 'player');

    this.entity = entity;
    this.levelSprite = levelSprite;

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set origin to center
    this.setOrigin(0.5, 0.5);
  }

  /** @override */
  update(): void {
    const transform = this.entity.getComponent<Transform>(
      ComponentRegistry.Transform
    );
    const playerState = this.entity.getComponent<PlayerState>(
      ComponentRegistry.PlayerState
    );

    if (!transform || !playerState) return;

    // Convert level space to screen space with offset
    const screenX = transform.x + this.levelSprite.getOffset().x;
    const screenY = transform.y + this.levelSprite.getOffset().y;

    this.setPosition(screenX, screenY);

    // Update sprite rotation based on direction
    switch (playerState.direction) {
      case Direction.UP:
        this.setAngle(-90);
        break;
      case Direction.DOWN:
        this.setAngle(90);
        break;
      case Direction.LEFT:
        this.setAngle(180);
        break;
      case Direction.RIGHT:
        this.setAngle(0);
        break;
    }
  }
}
