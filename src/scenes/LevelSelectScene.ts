import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { LEVELS } from '../config/LevelConfig';
import { SaveSystem } from '../save/SaveSystem';
import { AudioSystem } from '../audio/AudioSystem';
import { I18n } from '../i18n/I18n';

export class LevelSelectScene extends Phaser.Scene {
  private selectedLevel = 1;
  private detailText!: Phaser.GameObjects.Text;
  private detailTitle!: Phaser.GameObjects.Text;
  private startBtn!: Phaser.GameObjects.Image;
  private startBtnText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create(): void {
    this.drawBackground();

    // Header
    this.add
      .text(GAME_WIDTH / 2, 60, I18n.get().t().levelSelect.title, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '40px',
        color: '#4A148C',
      })
      .setOrigin(0.5);

    // Back button
    const backBtn = this.add
      .image(80, 60, 'ui_button')
      .setScale(0.5, 0.7)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(80, 60, I18n.get().t().levelSelect.back, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '20px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    backBtn.on('pointerdown', () => {
      AudioSystem.get().play('click');
      this.scene.start('MenuScene');
    });

    // Total stars
    const totalStars = SaveSystem.get().totalStars();
    this.add
      .text(GAME_WIDTH - 30, 60, `⭐ ${totalStars} / 15`, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(1, 0.5);

    // Path connecting nodes
    this.drawNodePath();

    // Level nodes
    this.makeLevelNodes();

    // Detail panel
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT - 120, 'ui_panel').setScale(2.4, 0.6);
    this.detailTitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 160, '', {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '28px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    this.detailText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 120, '', {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '16px',
        color: '#424242',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    this.startBtn = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT - 60, 'ui_button')
      .setInteractive({ useHandCursor: true });
    this.startBtnText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, I18n.get().t().levelSelect.startLevel, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    this.startBtn.on('pointerdown', () => {
      if (!SaveSystem.get().isLevelUnlocked(this.selectedLevel)) return;
      AudioSystem.get().play('click');
      this.scene.start('StoryScene', { levelId: this.selectedLevel, phase: 'intro' });
    });

    // Default selection
    this.selectLevel(SaveSystem.get().getData().lastPlayedLevel || 1);

    AudioSystem.get().playMenuTheme();
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.sky, COLORS.sky, COLORS.lavender, COLORS.peach, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private drawNodePath(): void {
    const positions = this.nodePositions();
    const g = this.add.graphics();
    g.lineStyle(8, 0xfff8e1, 0.9);
    g.beginPath();
    g.moveTo(positions[0].x, positions[0].y);
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2 - 30;
      g.lineTo(midX, midY);
      g.lineTo(curr.x, curr.y);
    }
    g.strokePath();

    const g2 = this.add.graphics();
    g2.lineStyle(4, 0xfbc02d, 1);
    g2.strokePath();
  }

  private nodePositions(): { x: number; y: number }[] {
    const startX = 200;
    const endX = GAME_WIDTH - 200;
    const baseY = 280;
    const ys = [baseY, baseY - 40, baseY + 60, baseY - 20, baseY + 30];
    return LEVELS.map((_, i) => ({
      x: startX + (i * (endX - startX)) / (LEVELS.length - 1),
      y: ys[i] ?? baseY,
    }));
  }

  private makeLevelNodes(): void {
    const positions = this.nodePositions();
    const save = SaveSystem.get();
    LEVELS.forEach((lvl, i) => {
      const pos = positions[i];
      const unlocked = save.isLevelUnlocked(lvl.id);
      const stars = save.getLevelStars(lvl.id);

      const biomeColor = this.biomeColor(lvl.biome);
      const node = this.add.circle(pos.x, pos.y, 36, biomeColor);
      node.setStrokeStyle(4, COLORS.charcoal);
      node.setInteractive({ useHandCursor: unlocked });

      const label = this.add
        .text(pos.x, pos.y - 56, lvl.name, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '16px',
          color: '#4A148C',
          backgroundColor: '#fff8e1cc',
          padding: { x: 6, y: 3 },
        })
        .setOrigin(0.5);
      label.setVisible(true);

      // Lock or stars
      if (!unlocked) {
        this.add
          .text(pos.x, pos.y, '🔒', { fontSize: '32px' })
          .setOrigin(0.5);
        node.setAlpha(0.6);
      } else {
        this.add
          .text(pos.x, pos.y, `${lvl.id}`, {
            fontFamily: 'Press Start 2P, monospace',
            fontSize: '20px',
            color: '#FFFFFF',
          })
          .setOrigin(0.5)
          .setStroke('#4A148C', 4);

        // stars
        for (let s = 0; s < 3; s++) {
          this.add
            .text(pos.x - 18 + s * 18, pos.y + 50, s < stars ? '⭐' : '☆', {
              fontSize: '20px',
            })
            .setOrigin(0.5);
        }
      }

      node.on('pointerdown', () => {
        AudioSystem.get().play('click');
        this.selectLevel(lvl.id);
      });

      node.on('pointerover', () => {
        if (unlocked) node.setScale(1.12);
      });
      node.on('pointerout', () => {
        node.setScale(1);
      });
    });
  }

  private biomeColor(biome: string): number {
    switch (biome) {
      case 'forest':
        return COLORS.mint;
      case 'hills':
        return COLORS.peach;
      case 'frost':
        return COLORS.sky;
      case 'sky':
        return COLORS.lavender;
      case 'throne':
        return COLORS.plum;
      default:
        return COLORS.cream;
    }
  }

  private selectLevel(id: number): void {
    this.selectedLevel = id;
    const lvl = LEVELS.find((l) => l.id === id);
    if (!lvl) return;
    const save = SaveSystem.get();
    const unlocked = save.isLevelUnlocked(id);
    const ll = I18n.get().level(lvl.id);
    const lt = I18n.get().t().levelSelect;
    this.detailTitle.setText(`Lv ${lvl.id}: ${ll.name}`);
    if (unlocked) {
      this.detailText.setText(ll.storyIntro[0] ?? '');
      this.startBtnText.setText(lt.startLevel);
      this.startBtn.setAlpha(1);
      this.startBtn.setInteractive();
    } else {
      this.detailText.setText(lt.locked);
      this.startBtnText.setText(lt.lockedBtn);
      this.startBtn.setAlpha(0.5);
      this.startBtn.disableInteractive();
    }
  }
}
