import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { SaveSystem } from '../save/SaveSystem';
import { AudioSystem } from '../audio/AudioSystem';
import { I18n } from '../i18n/I18n';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // sky gradient bg
    this.drawBackground();
    // floating sparkles
    this.spawnSparkles();

    // Title
    const tt = I18n.get().t();
    const title = this.add
      .text(GAME_WIDTH / 2, 110, tt.menu.title, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '76px',
        color: '#4A148C',
        stroke: '#FFFFFF',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setShadow(0, 6, 'rgba(74,20,140,0.35)', 8, false, true);
    const subtitle = this.add
      .text(GAME_WIDTH / 2, 184, tt.menu.subtitle, {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '24px',
        color: '#7B1FA2',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [title],
      y: '+=10',
      yoyo: true,
      duration: 2200,
      ease: 'Sine.inOut',
      repeat: -1,
    });
    this.tweens.add({
      targets: [subtitle],
      alpha: 0.6,
      yoyo: true,
      duration: 1400,
      ease: 'Sine.inOut',
      repeat: -1,
    });

    // Princess Lumi
    const lumi = this.add.image(GAME_WIDTH / 2, 360, 'princess').setScale(2.4);
    this.tweens.add({
      targets: lumi,
      y: 350,
      yoyo: true,
      duration: 1800,
      ease: 'Sine.inOut',
      repeat: -1,
    });

    // Buttons
    const buttonY = 540;
    const gap = 80;
    this.makeButton(GAME_WIDTH / 2, buttonY, tt.menu.play, () => this.startGame());
    this.makeButton(GAME_WIDTH / 2, buttonY + gap, tt.menu.levelSelect, () =>
      this.scene.start('LevelSelectScene'),
    );
    this.makeButton(GAME_WIDTH / 2, buttonY + gap * 2, tt.menu.settings, () => this.openSettings());

    // version
    this.add
      .text(GAME_WIDTH - 16, GAME_HEIGHT - 16, tt.menu.copyright, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '14px',
        color: '#4A148C',
      })
      .setOrigin(1, 1)
      .setAlpha(0.7);

    // Init audio (resumes context on first input)
    this.input.once('pointerdown', () => AudioSystem.get().resume());
    AudioSystem.get().playMenuTheme();
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.sky, COLORS.sky, COLORS.mint, COLORS.peach, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // floating clouds
    const cloud = this.add.graphics();
    cloud.fillStyle(0xffffff, 0.7);
    [
      { x: 100, y: 130, r: 28 },
      { x: 200, y: 100, r: 36 },
      { x: 1100, y: 80, r: 32 },
      { x: 1180, y: 130, r: 28 },
    ].forEach((c) => {
      cloud.fillCircle(c.x, c.y, c.r);
      cloud.fillCircle(c.x + c.r * 0.8, c.y + 6, c.r * 0.85);
      cloud.fillCircle(c.x - c.r * 0.7, c.y + 8, c.r * 0.75);
    });
  }

  private spawnSparkles(): void {
    const emitter = this.add.particles(0, 0, 'fx_sparkle', {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: 0, max: GAME_HEIGHT },
      lifespan: 2400,
      speedY: { min: -30, max: -10 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.9, end: 0 },
      frequency: 220,
      quantity: 1,
      blendMode: 'ADD',
    });
    emitter.setDepth(0);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const btn = this.add.image(x, y, 'ui_button').setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '28px',
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
      AudioSystem.get().play('click');
      this.tweens.add({
        targets: [btn, text],
        scale: 0.96,
        duration: 80,
        yoyo: true,
        onComplete: onClick,
      });
    });
  }

  private startGame(): void {
    const save = SaveSystem.get();
    const lastLevel = save.getData().lastPlayedLevel;
    const targetLevel = save.isLevelUnlocked(lastLevel) ? lastLevel : 1;
    this.scene.start('StoryScene', { levelId: targetLevel, phase: 'intro' });
  }

  private openSettings(): void {
    // Simple inline modal
    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5).setOrigin(0);
    overlay.setInteractive();
    const panel = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ui_panel').setScale(1.4, 1.0);

    const st = I18n.get().t();
    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, st.settings.title, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '36px',
        color: '#4A148C',
      })
      .setOrigin(0.5);

    const save = SaveSystem.get();
    const audio = AudioSystem.get();

    // Language toggle
    const langBtn = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, 'ui_button')
      .setInteractive({ useHandCursor: true });
    const langText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, st.settings.langLabel, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    langBtn.on('pointerdown', () => {
      AudioSystem.get().play('click');
      I18n.get().toggle();
      this.scene.restart();
    });

    const muteBtn = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'ui_button')
      .setInteractive({ useHandCursor: true });
    const muteText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, audio.isMuted() ? st.settings.soundOff : st.settings.soundOn, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    muteBtn.on('pointerdown', () => {
      const s = I18n.get().t();
      audio.setMuted(!audio.isMuted());
      save.updateSettings({ musicVolume: audio.isMuted() ? 0 : 0.5 });
      muteText.setText(audio.isMuted() ? s.settings.soundOff : s.settings.soundOn);
    });

    const resetBtn = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, 'ui_button')
      .setInteractive({ useHandCursor: true });
    const resetText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, st.settings.resetProgress, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '22px',
        color: '#B71C1C',
      })
      .setOrigin(0.5);
    let resetConfirm = false;
    resetBtn.on('pointerdown', () => {
      const s = I18n.get().t();
      if (!resetConfirm) {
        resetText.setText(s.settings.confirmReset);
        resetConfirm = true;
      } else {
        save.resetProgress();
        resetText.setText(s.settings.progressReset);
        resetConfirm = false;
      }
    });

    const closeBtn = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 170, 'ui_button')
      .setInteractive({ useHandCursor: true });
    const closeText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 170, st.settings.close, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    closeBtn.on('pointerdown', () => {
      [overlay, panel, title, langBtn, langText, muteBtn, muteText, resetBtn, resetText, closeBtn, closeText].forEach(
        (o) => o.destroy(),
      );
    });
  }
}
