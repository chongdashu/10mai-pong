import 'phaser';

/**
 * Interactive button with visual feedback
 */
export class SpriteButton extends Phaser.GameObjects.Rectangle {
  private textObject: Phaser.GameObjects.Text;
  private defaultScale: number = 1;
  private selectedScale: number = 1.2;
  private defaultColor: number = 0x444444;
  private selectedColor: number = 0xffa500;
  private isSelected: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: () => void
  ) {
    super(scene, x, y, width, height, 0x444444);
    scene.add.existing(this);

    // Make button interactive
    this.setInteractive({ useHandCursor: true });

    // Add text centered on button
    this.textObject = scene.add.text(x, y, text, {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.textObject.setOrigin(0.5);

    // Add event listeners
    this.on('pointerdown', onClick);
    this.on('pointerover', this.onHover.bind(this));
    this.on('pointerout', this.onUnhover.bind(this));
  }

  /**
   * Select the button with visual feedback
   */
  select(): void {
    if (this.isSelected) return;
    this.isSelected = true;

    // Animate scale
    this.scene.tweens.add({
      targets: [this, this.textObject],
      scaleX: this.selectedScale,
      scaleY: this.selectedScale,
      duration: 200,
      ease: 'Quad.out',
    });

    // Change color
    this.setFillStyle(this.selectedColor);
  }

  /**
   * Deselect the button
   */
  deselect(): void {
    if (!this.isSelected) return;
    this.isSelected = false;

    // Animate scale back
    this.scene.tweens.add({
      targets: [this, this.textObject],
      scaleX: this.defaultScale,
      scaleY: this.defaultScale,
      duration: 200,
      ease: 'Quad.out',
    });

    // Reset color
    this.setFillStyle(this.defaultColor);
  }

  /**
   * Handle hover state
   */
  private onHover(): void {
    if (!this.isSelected) {
      this.scene.tweens.add({
        targets: [this, this.textObject],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: 'Quad.out',
      });
    }
  }

  /**
   * Handle unhover state
   */
  private onUnhover(): void {
    if (!this.isSelected) {
      this.scene.tweens.add({
        targets: [this, this.textObject],
        scaleX: this.defaultScale,
        scaleY: this.defaultScale,
        duration: 100,
        ease: 'Quad.out',
      });
    }
  }

  /**
   * Clean up button and its text
   */
  destroy(): void {
    this.textObject.destroy();
    super.destroy();
  }
}
