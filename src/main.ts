import Phaser from 'phaser';
import { makePhaserConfig } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { StoryScene } from './scenes/StoryScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { ResultScene } from './scenes/ResultScene';

window.addEventListener('load', () => {
  const container = document.getElementById('game-container');
  if (!container) {
    throw new Error('Missing #game-container');
  }

  const config = makePhaserConfig(container);
  config.scene = [
    BootScene,
    MenuScene,
    LevelSelectScene,
    StoryScene,
    GameScene,
    UIScene,
    ResultScene,
  ];

  const game = new Phaser.Game(config);
  // Expose for debug/testing in dev
  if (import.meta.env.DEV) {
    (window as unknown as { __game: Phaser.Game }).__game = game;
  }

  // hide loading splash once Phaser kicks in
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
  }, 100);
});
