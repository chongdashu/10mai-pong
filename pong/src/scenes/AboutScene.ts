import 'phaser';
import { SpriteButton } from '../sprites/SpriteButton';

export class AboutScene extends Phaser.Scene {
  private backButton!: SpriteButton;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'AboutScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Add title
    this.add
      .text(width / 2, 50, 'About', {
        fontSize: '48px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Add about text
    const aboutText = `The 12m AI Game Dev Challenge

A competition to create engaging games using AI assistance within a 10-minute timeframe. This challenge demonstrates the potential of AI-powered game development and encourages creativity within constraints.

Key Features:
- Rapid game development
- AI-assisted coding
- Focus on core gameplay
- Quick iteration cycles

Each game in this challenge is created with the help of AI tools while maintaining quality and playability standards.`;

    this.add
      .text(width / 2, height / 2 - 50, aboutText, {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);

    // Back button
    this.backButton = new SpriteButton(
      this,
      width / 2,
      height - 100,
      200,
      50,
      'Back to Menu',
      () => {
        this.scene.start('MainMenuScene');
      }
    );

    // Setup keyboard controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Select back button by default
    this.backButton.select();
  }

  update(): void {
    if (!this.cursors) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      const event = new Event('pointerdown');
      this.backButton.emit('pointerdown', event);
    }
  }
}
