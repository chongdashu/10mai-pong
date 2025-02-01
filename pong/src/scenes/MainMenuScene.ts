import 'phaser';
import { SpriteButton } from '../sprites/SpriteButton';
import {
  getCurrentUser,
  signInAnonymously,
  signOut,
} from '../services/supabase/client';

export class MainMenuScene extends Phaser.Scene {
  private buttons: SpriteButton[] = [];
  private selectedButtonIndex: number = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'MainMenuScene' });
    this.cursors =
      undefined as unknown as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  /** @override */
  async create() {
    const { width, height } = this.cameras.main;

    // Reset selected button index when scene starts
    this.selectedButtonIndex = 0;

    // Check for existing session
    const { user } = await getCurrentUser();

    // Add title text
    this.add
      .text(width / 2, height / 4, 'PONG', {
        fontSize: '72px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    if (user) {
      const username = user.user_metadata?.username || 'Player';
      // Create a container for welcome text
      const container = this.add.container(width / 2, height / 3);

      // Add welcome text
      const welcomeText = this.add
        .text(0, 0, 'Welcome back, ', {
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(1, 0.5);

      // Add username text
      const usernameText = this.add
        .text(0, 0, username, {
          fontSize: '24px',
          color: '#4a9aea',
        })
        .setOrigin(0, 0.5);

      // Add both texts to container
      container.add([welcomeText, usernameText]);
    }

    // Create buttons
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;
    const startY = height / 2;

    // Play button
    const playButton = new SpriteButton(
      this,
      width / 2,
      startY,
      buttonWidth,
      buttonHeight,
      user ? 'Play Pong' : 'Play as Guest',
      async () => {
        if (!user) {
          try {
            const { error } = await signInAnonymously();
            if (error) {
              console.error('Failed to sign in anonymously:', error);
              return;
            }
          } catch (err) {
            console.error('Error during anonymous sign in:', err);
            return;
          }
        }
        this.scene.start('PongScene');
      }
    );

    // High Scores button
    const scoresButton = new SpriteButton(
      this,
      width / 2,
      startY + buttonHeight + buttonSpacing,
      buttonWidth,
      buttonHeight,
      'High Scores',
      () => {
        // Will implement later
        console.log('High Scores clicked');
      }
    );

    // About button
    const aboutButton = new SpriteButton(
      this,
      width / 2,
      startY + (buttonHeight + buttonSpacing) * 2,
      buttonWidth,
      buttonHeight,
      'About',
      () => {
        this.scene.start('AboutScene');
      }
    );

    // Logout button (only show if user is signed in)
    let logoutButton;
    if (user) {
      logoutButton = new SpriteButton(
        this,
        width / 2,
        startY + (buttonHeight + buttonSpacing) * 3,
        buttonWidth,
        buttonHeight,
        'Logout',
        async () => {
          await signOut();
          this.scene.start('MainMenuScene', { fromLogout: true });
        }
      );
    }

    // Store buttons for keyboard navigation
    this.buttons = user
      ? [playButton, scoresButton, aboutButton, logoutButton!]
      : [playButton, scoresButton, aboutButton];

    // Add social media links
    const socialBaseY = user
      ? startY + (buttonHeight + buttonSpacing) * 4 + 40
      : startY + (buttonHeight + buttonSpacing) * 3 + 40;

    this.add
      .text(width / 2, socialBaseY, 'X/Twitter: @chongdashu', {
        fontSize: '16px',
        color: '#4a9aea',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        window.open('https://www.x.com/chongdashu', '_blank');
      });

    this.add
      .text(width / 2, socialBaseY + 30, 'YouTube: @AIOriented', {
        fontSize: '16px',
        color: '#ff0000',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        window.open('https://www.youtube.com/@aioriented', '_blank');
      });

    // Select first button by default
    this.selectButton(0);

    // Setup keyboard controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Always ensure first button is selected when scene starts
    this.selectButton(0);
  }

  /** @override */
  update(): void {
    if (!this.cursors) return;

    // Handle keyboard navigation
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.selectButton(
        (this.selectedButtonIndex - 1 + this.buttons.length) %
          this.buttons.length
      );
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.selectButton((this.selectedButtonIndex + 1) % this.buttons.length);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      // Simulate click on selected button
      const event = new Event('pointerdown');
      this.buttons[this.selectedButtonIndex].emit('pointerdown', event);
    }
  }

  private selectButton(index: number) {
    // Deselect current button
    this.buttons[this.selectedButtonIndex].deselect();

    // Update selected button index
    this.selectedButtonIndex = index;

    // Select new button
    this.buttons[this.selectedButtonIndex].select();
  }
}
