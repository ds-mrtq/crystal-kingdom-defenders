import Phaser from 'phaser';
import { SpriteFactory } from '../graphics/SpriteFactory';
import { SaveSystem } from '../save/SaveSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    SpriteFactory.generateAll(this);
    // Initialize save system singleton
    SaveSystem.get();

    this.scene.start('MenuScene');
  }
}
