import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { LEVELS } from '../config/LevelConfig';
import { AudioSystem } from '../audio/AudioSystem';
import { I18n } from '../i18n/I18n';

interface StoryData {
  levelId: number;
  phase: 'intro' | 'outro';
}

export class StoryScene extends Phaser.Scene {
  private dialogues: string[] = [];
  private current = 0;
  private bodyText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;
  private levelId = 1;
  private phase: 'intro' | 'outro' = 'intro';

  constructor() {
    super({ key: 'StoryScene' });
  }

  init(data: StoryData): void {
    this.levelId = data.levelId;
    this.phase = data.phase;
    const lvl = LEVELS.find((l) => l.id === this.levelId);
    if (!lvl) {
      this.dialogues = [];
      return;
    }
    const ll = I18n.get().level(this.levelId);
    this.dialogues = this.phase === 'intro' ? ll.storyIntro : ll.storyOutro;
    this.current = 0;
  }

  create(): void {
    // background gradient
    const lvl = LEVELS.find((l) => l.id === this.levelId);
    const [c1, c2] = lvl?.bgGradient ?? [COLORS.sky, COLORS.mint];
    const g = this.add.graphics();
    g.fillGradientStyle(c1, c1, c2, c2, 0.85);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // soft starfield
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * GAME_HEIGHT * 0.6;
      const star = this.add.image(x, y, 'fx_sparkle').setScale(0.6 + Math.random() * 0.6);
      star.setAlpha(0.3 + Math.random() * 0.4);
      this.tweens.add({
        targets: star,
        alpha: 0,
        duration: 1200 + Math.random() * 1200,
        yoyo: true,
        repeat: -1,
      });
    }

    // Princess Lumi portrait
    const portrait = this.add.image(220, GAME_HEIGHT / 2 - 40, 'princess').setScale(3);
    this.tweens.add({
      targets: portrait,
      y: GAME_HEIGHT / 2 - 50,
      yoyo: true,
      duration: 1800,
      ease: 'Sine.inOut',
      repeat: -1,
    });

    // Dialog box
    const boxY = GAME_HEIGHT - 220;
    const box = this.add.graphics();
    box.fillStyle(COLORS.cream, 0.95);
    box.fillRoundedRect(60, boxY, GAME_WIDTH - 120, 180, 16);
    box.lineStyle(3, COLORS.charcoal, 1);
    box.strokeRoundedRect(60, boxY, GAME_WIDTH - 120, 180, 16);

    // Title
    const ll = I18n.get().level(this.levelId);
    const titleStr =
      this.phase === 'intro'
        ? `Lv ${this.levelId}: ${ll.name}`
        : `Lv ${this.levelId}: ${I18n.get().t().story.victory}`;
    this.add
      .text(GAME_WIDTH / 2, boxY - 30, titleStr, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '28px',
        color: '#4A148C',
        stroke: '#FFFFFF',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.bodyText = this.add
      .text(100, boxY + 30, '', {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '22px',
        color: '#424242',
        wordWrap: { width: GAME_WIDTH - 200 },
        lineSpacing: 6,
      })
      .setOrigin(0, 0);

    this.continueText = this.add
      .text(GAME_WIDTH - 90, boxY + 150, I18n.get().t().story.continue, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '14px',
        color: '#7B1FA2',
      })
      .setOrigin(1, 0.5);
    this.tweens.add({
      targets: this.continueText,
      alpha: 0.4,
      yoyo: true,
      duration: 800,
      repeat: -1,
    });

    // Skip button
    const skipBtn = this.add
      .text(GAME_WIDTH - 30, 30, I18n.get().t().story.skip, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '20px',
        color: '#7B1FA2',
        backgroundColor: '#fff8e1cc',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    skipBtn.on('pointerdown', () => this.advance(true));

    this.input.on('pointerdown', () => this.advance(false));
    this.input.keyboard?.on('keydown-SPACE', () => this.advance(false));
    this.input.keyboard?.on('keydown-ENTER', () => this.advance(false));
    this.input.keyboard?.on('keydown-ESC', () => this.advance(true));
    this.showDialogue();
  }

  private showDialogue(): void {
    const line = this.dialogues[this.current];
    if (!line) {
      this.bodyText.setText('');
      return;
    }
    this.bodyText.setText('');
    // typewriter
    let i = 0;
    const tick = () => {
      this.bodyText.setText(line.substring(0, i));
      i++;
      if (i <= line.length) {
        this.time.delayedCall(20, tick);
      }
    };
    tick();
  }

  private advance(skip: boolean): void {
    if (skip || this.current >= this.dialogues.length - 1) {
      this.proceedToNext();
    } else {
      this.current++;
      this.showDialogue();
    }
  }

  private proceedToNext(): void {
    AudioSystem.get().stopMusic();
    if (this.phase === 'intro') {
      this.scene.start('GameScene', { levelId: this.levelId });
    } else {
      this.scene.start('LevelSelectScene');
    }
  }
}
