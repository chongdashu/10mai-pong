import { Scene } from 'phaser';
import { Level, TileType, TILE_SIZE } from '../factories/LevelFactory';

/**
 * Visual representation of a level using Phaser sprites
 */
export class LevelSprite {
  private collider: Phaser.GameObjects.Group;
  private offset: { x: number; y: number };

  constructor(
    scene: Scene,
    private level: Level
  ) {
    this.collider = scene.add.group();
    this.offset = this.calculateOffset(scene);
    this.createSprites(scene);
  }

  /**
   * Calculate offset to center level in scene
   */
  private calculateOffset(scene: Scene): { x: number; y: number } {
    const { width: levelWidth, height: levelHeight } =
      this.level.getDimensions();
    const tileSize = this.level.getTileSize();

    return {
      x: (scene.cameras.main.width - levelWidth * tileSize) / 2,
      y: (scene.cameras.main.height - levelHeight * tileSize) / 2,
    };
  }

  /**
   * Create sprites for each tile in the level
   */
  private createSprites(scene: Scene): void {
    const { width, height } = this.level.getDimensions();
    const tileSize = this.level.getTileSize();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = this.level.getTileAt(x, y);
        if (tile === TileType.WALL) {
          // Create wall sprite
          const wall = scene.add.sprite(
            x * tileSize + this.offset.x + tileSize / 2,
            y * tileSize + this.offset.y + tileSize / 2,
            'wall'
          );
          wall.setOrigin(0.5, 0.5);

          // Add to physics group
          scene.physics.add.existing(wall, true);
          this.collider.add(wall);
        }
      }
    }
  }

  /**
   * Convert grid coordinates to world position with offset
   */
  gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
    const pos = this.level.gridToWorld(gridX, gridY);
    return {
      x: pos.x + this.offset.x,
      y: pos.y + this.offset.y,
    };
  }

  /**
   * Get the physics collider group
   */
  getCollider(): Phaser.GameObjects.Group {
    return this.collider;
  }

  /**
   * Convert world position to grid position accounting for offset
   */
  worldToGrid(x: number, y: number): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor((x - this.offset.x) / TILE_SIZE),
      gridY: Math.floor((y - this.offset.y) / TILE_SIZE),
    };
  }

  /**
   * Get the level offset
   */
  getOffset(): { x: number; y: number } {
    return this.offset;
  }

  /**
   * Get the level instance
   */
  getLevel(): Level {
    return this.level;
  }
}
