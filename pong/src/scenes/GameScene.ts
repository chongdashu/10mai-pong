import 'phaser';
import { SpriteButton } from '../sprites/SpriteButton';
import { getCurrentUser } from '../services/supabase/client';
import { PlayerFactory, Level, LevelFactory, LEVEL_MAPS } from '../factories';
import { PlayerSprite } from '../sprites/PlayerSprite';
import { TextureFactory } from '../textures/TextureFactory';
import { LevelSprite } from '../sprites/LevelSprite';
import { Scene } from 'phaser';
import { Entity } from '../ecs/entities';
import { MovementSystem } from '../ecs/systems/MovementSystem';
import { InputSystem } from '../ecs/systems/InputSystem';
import { ScoreSystem } from '../ecs/systems/ScoreSystem';
import { Paddle } from '../ecs/entities/Paddle';

export class GameScene extends Scene {
  private player!: Entity;
  private movementSystem!: MovementSystem;
  private inputSystem!: InputSystem;
  private playerSprite!: PlayerSprite;
  private level!: Level;
  private levelSprite!: LevelSprite;
  private scoreSystem!: ScoreSystem;
  private isInitialized = false;
  private playerPaddle: Paddle | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    TextureFactory.createTextures(this);
  }

  async create(): Promise<void> {
    // Initialize all systems first
    this.movementSystem = new MovementSystem();
    this.inputSystem = new InputSystem(this);
    this.scoreSystem = new ScoreSystem(this);

    // Get player start position from map
    const startPos = LevelFactory.findPlayerStart(LEVEL_MAPS.LEVEL_1);

    // Create level from map first
    this.level = LevelFactory.create(LEVEL_MAPS.LEVEL_1);
    this.levelSprite = new LevelSprite(this, this.level);

    // Create player entity with components
    this.player = PlayerFactory.create(
      startPos.x,
      startPos.y,
      this.levelSprite,
      'continuous' // Or: 'discrete'
    );

    const { width, height } = this.cameras.main;

    // Add game title at the top
    this.add
      .text(width / 2, 50, 'Grid Game', {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Get current user and add player name below title
    const { user } = await getCurrentUser();
    const username = user?.user_metadata?.username || 'Player';
    this.add
      .text(width / 2, 110, `Player: ${username}`, {
        fontSize: '24px',
        color: '#4a9aea',
      })
      .setOrigin(0.5);

    // Create player sprite
    this.playerSprite = new PlayerSprite(this, this.player, this.levelSprite);

    // Add collisions
    this.physics.add.collider(
      this.playerSprite,
      this.levelSprite.getCollider()
    );

    // Back to menu button at the bottom
    new SpriteButton(
      this,
      width / 2,
      height - 50,
      200,
      40,
      'Back to Menu',
      async () => {
        if (this.scoreSystem) {
          await this.scoreSystem.submitFinalScore(this.player);
        }
        this.scene.start('MainMenuScene');
      }
    );

    // Create game area boundaries
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Create player paddle on left side
    this.playerPaddle = new Paddle(this, 50, gameHeight / 2);
    this.playerPaddle.movement.setConstraints(
      this.playerPaddle.height / 2,
      gameHeight - this.playerPaddle.height / 2
    );

    // Setup keyboard input
    this.input.keyboard?.on('keydown-W', () => {
      this.playerPaddle?.movement.setDirection(-1);
    });

    this.input.keyboard?.on('keydown-S', () => {
      this.playerPaddle?.movement.setDirection(1);
    });

    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      if ((event.key === 'w' || event.key === 's') && this.playerPaddle) {
        this.playerPaddle.movement.setDirection(0);
      }
    });

    this.isInitialized = true;
  }

  /** @override */
  update(_time: number, delta: number): void {
    if (!this.isInitialized) return;

    // Update input and movement systems
    if (this.inputSystem && this.player) {
      this.inputSystem.update([this.player]);
    }
    if (this.movementSystem && this.player) {
      this.movementSystem.update([this.player], delta / 1000); // Convert to seconds
    }
    if (this.scoreSystem && this.player) {
      this.scoreSystem.update(this.player);
    }

    // Update sprite
    if (this.playerSprite) {
      this.playerSprite.update();
    }

    this.playerPaddle?.update(_time, delta);
  }
}
