/**
 * Factory for creating programmatically generated textures
 */
export class TextureFactory {
  /**
   * Create all textures needed for the game
   */
  static createTextures(scene: Phaser.Scene): void {
    this.createPlayerTexture(scene);
    this.createWallTexture(scene);
    // Add other texture creation methods as needed
  }

  /**
   * Create a simple player texture - a colored circle with an indicator
   */
  private static createPlayerTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Draw player circle
    graphics.lineStyle(2, 0xffffff);
    graphics.fillStyle(0x4a9aea);
    graphics.beginPath();
    graphics.arc(16, 16, 14, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();

    // Draw direction indicator
    graphics.lineStyle(2, 0xffffff);
    graphics.beginPath();
    graphics.moveTo(16, 16);
    graphics.lineTo(30, 16);
    graphics.closePath();
    graphics.stroke();

    // Generate texture from graphics
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
  }

  /**
   * Create a wall texture with a subtle pattern
   */
  private static createWallTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    const size = 32;

    // Main wall fill
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 0, size, size);

    // Add subtle pattern
    graphics.lineStyle(1, 0x777777);
    graphics.beginPath();

    // Draw diagonal lines
    for (let i = 0; i < size * 2; i += 8) {
      graphics.moveTo(i, 0);
      graphics.lineTo(0, i);
    }

    graphics.strokePath();

    // Generate texture
    graphics.generateTexture('wall', size, size);
    graphics.destroy();
  }

  /**
   * Create a debug grid texture
   */
  static createDebugGridTexture(
    scene: Phaser.Scene,
    cellSize: number = 32
  ): void {
    const graphics = scene.add.graphics();

    // Draw grid
    graphics.lineStyle(1, 0x333333);
    graphics.beginPath();

    // Vertical lines
    graphics.moveTo(0, 0);
    graphics.lineTo(0, cellSize);

    // Horizontal lines
    graphics.moveTo(0, 0);
    graphics.lineTo(cellSize, 0);

    graphics.closePath();
    graphics.stroke();

    // Generate texture
    graphics.generateTexture('debug_grid', cellSize, cellSize);
    graphics.destroy();
  }
}
