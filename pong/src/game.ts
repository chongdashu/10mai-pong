import 'phaser';
import { PongScene } from './scenes/PongScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { AboutScene } from './scenes/AboutScene';
import { HighScoresScene } from './scenes/HighScoresScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000', // Black background for Pong
  scene: [MainMenuScene, PongScene, AboutScene, HighScoresScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};

new Phaser.Game(config);
