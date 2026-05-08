import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { LEVELS } from '../config/LevelConfig';
import { SaveSystem } from '../save/SaveSystem';
import { AudioSystem } from '../audio/AudioSystem';
import type { LevelResult } from '../types';

export class ResultScene extends Phaser.Scene {
  private result!: LevelResult;

  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data: LevelResult): void {
    this.result = data;
  }

  create(): void {
    // record result if victory
    if (this.result.victory) {
      SaveSystem.get().recordLevelComplete(this.result.levelId, this.result.stars);
    } else {
      SaveSystem.get().setLastPlayed(this.result.levelId);
    }

    // background
    const g = this.add.graphics();
    if (this.result.victory) {
      g.fillGradientStyle(COLORS.yellow, COLORS.yellow, COLORS.peach, COLORS.lavender, 1);
    } else {
      g.fillGradientStyle(COLORS.shadowDark, COLORS.shadowDark, COLORS.plum, COLORS.shadowMid, 1);
    }
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (this.result.victory) {
      this.spawnConfetti();
    }

    // Title
    const titleText = this.result.victory ? '✨ VICTORY ✨' : '☠ DEFEAT ☠';
    const title = this.add
      .text(GAME_WIDTH / 2, 140, titleText, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '88px',
        color: this.result.victory ? '#4A148C' : '#FFF8E1',
        stroke: '#FFFFFF',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.tweens.add({ targets: title, scale: 1.05, yoyo: true, duration: 800, repeat: -1 });

    // Level name
    const lvl = LEVELS.find((l) => l.id === this.result.levelId);
    this.add
      .text(GAME_WIDTH / 2, 220, `Lv ${this.result.levelId}: ${lvl?.name ?? ''}`, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '28px',
        color: this.result.victory ? '#7B1FA2' : '#FFCCBC',
      })
      .setOrigin(0.5);

    // Stars
    if (this.result.victory) {
      for (let i = 0; i < 3; i++) {
        const x = GAME_WIDTH / 2 + (i - 1) * 80;
        const y = 320;
        const filled = i < this.result.stars;
        const star = this.add
          .text(x, y, filled ? '⭐' : '☆', { fontSize: '64px' })
          .setOrigin(0.5);
        star.setAlpha(0);
        this.tweens.add({
          targets: star,
          alpha: 1,
          y: y - 10,
          delay: 400 + i * 250,
          duration: 400,
          ease: 'Back.out',
          yoyo: false,
        });
      }
    }

    // Stats
    const lifeText = `Lives: ${this.result.remainingLives} / ${this.result.startLives}`;
    this.add
      .text(GAME_WIDTH / 2, 420, lifeText, {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '20px',
        color: this.result.victory ? '#4A148C' : '#FFCCBC',
      })
      .setOrigin(0.5);

    // Buttons
    const btnY = 540;
    if (this.result.victory) {
      // Continue to next level (if exists & unlocked) OR back to map
      const nextLevel = LEVELS.find((l) => l.id === this.result.levelId + 1);
      if (nextLevel) {
        this.makeButton(GAME_WIDTH / 2 - 140, btnY, '→ Next Level', () => {
          AudioSystem.get().play('click');
          this.scene.start('StoryScene', { levelId: nextLevel.id, phase: 'intro' });
        });
      }
      this.makeButton(GAME_WIDTH / 2 + 140, btnY, '🗺 World Map', () => {
        AudioSystem.get().play('click');
        this.scene.start('StoryScene', { levelId: this.result.levelId, phase: 'outro' });
      });
    } else {
      this.makeButton(GAME_WIDTH / 2 - 140, btnY, '↻ Retry', () => {
        AudioSystem.get().play('click');
        this.scene.start('GameScene', { levelId: this.result.levelId });
      });
      this.makeButton(GAME_WIDTH / 2 + 140, btnY, '🗺 World Map', () => {
        AudioSystem.get().play('click');
        this.scene.start('LevelSelectScene');
      });
    }

    AudioSystem.get().playMenuTheme();
  }

  private spawnConfetti(): void {
    const colors = [0xfff59d, 0xef9a9a, 0xb3e5fc, 0xc8e6c9, 0xd1c4e9, 0xffccbc];
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = -20 - Math.random() * 200;
      const c = colors[Math.floor(Math.random() * colors.length)];
      const s = this.add.rectangle(x, y, 8, 14, c);
      s.setRotation(Math.random() * Math.PI);
      this.tweens.add({
        targets: s,
        y: GAME_HEIGHT + 30,
        rotation: s.rotation + Math.PI * 4,
        duration: 2400 + Math.random() * 2400,
        delay: Math.random() * 1500,
        ease: 'Cubic.in',
        onComplete: () => s.destroy(),
      });
    }
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const btn = this.add.image(x, y, 'ui_button').setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    btn.on('pointerover', () => {
      btn.setScale(1.06);
      text.setScale(1.06);
    });
    btn.on('pointerout', () => {
      btn.setScale(1);
      text.setScale(1);
    });
    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, text],
        scale: 0.96,
        duration: 80,
        yoyo: true,
        onComplete: onClick,
      });
    });
  }
}
