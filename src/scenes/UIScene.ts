import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { TOWER_DEFS } from '../config/BalanceConfig';
import type { GameScene } from './GameScene';
import type { Tower } from '../entities/Tower';
import type { TowerKind, BuildSpot } from '../types';
import { AudioSystem } from '../audio/AudioSystem';
import { I18n } from '../i18n/I18n';

interface UISceneData {
  game: GameScene;
}

export class UIScene extends Phaser.Scene {
  private gameScene!: GameScene;
  private goldText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private speedTexts: Phaser.GameObjects.Text[] = [];
  private pauseText!: Phaser.GameObjects.Text;
  private sendBtn!: Phaser.GameObjects.Container;
  private sendBtnLabel!: Phaser.GameObjects.Text;
  private meteorBtn!: Phaser.GameObjects.Container;
  private meteorCdText!: Phaser.GameObjects.Text;
  private healBtn!: Phaser.GameObjects.Container;
  private healCdText!: Phaser.GameObjects.Text;
  private shopGroup: Phaser.GameObjects.GameObject[] = [];
  private upgradeGroup: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData): void {
    this.gameScene = data.game;
  }

  create(): void {
    // Top HUD strip
    this.add.image(0, 0, 'ui_hud_strip').setOrigin(0).setDepth(100);

    // Coin
    this.add.image(22, 28, 'ui_coin').setDepth(101);
    this.goldText = this.add
      .text(46, 28, '0', {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '20px',
        color: '#FBC02D',
        stroke: '#4A148C',
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5)
      .setDepth(101);

    // Lives
    this.add.image(130, 28, 'ui_heart').setDepth(101);
    this.livesText = this.add
      .text(156, 28, '0', {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '20px',
        color: '#E53935',
        stroke: '#FFFFFF',
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5)
      .setDepth(101);

    // Wave
    this.add.image(240, 28, 'ui_wave').setDepth(101);
    this.waveText = this.add
      .text(266, 28, `${I18n.get().t().ui.wave} 0/0`, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '22px',
        color: '#4A148C',
      })
      .setOrigin(0, 0.5)
      .setDepth(101);

    // Speed buttons
    const speedX = GAME_WIDTH - 260;
    [1, 2, 3].forEach((s, i) => {
      const text = this.add
        .text(speedX + i * 50, 28, `${s}x`, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '24px',
          color: s === 1 ? '#4A148C' : '#9E9E9E',
          backgroundColor: s === 1 ? '#FFF59D' : 'transparent',
          padding: { x: 8, y: 4 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(101);
      text.on('pointerdown', () => {
        AudioSystem.get().play('click');
        this.gameScene.setSpeed(s as 1 | 2 | 3);
      });
      this.speedTexts.push(text);
    });

    // Pause
    this.pauseText = this.add
      .text(GAME_WIDTH - 90, 28, I18n.get().t().ui.pause, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '20px',
        color: '#4A148C',
        backgroundColor: '#FFF8E1',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(101);
    this.pauseText.on('pointerdown', () => {
      AudioSystem.get().play('click');
      this.gameScene.togglePause();
    });

    // Exit
    const exitBtn = this.add
      .text(GAME_WIDTH - 30, 28, '×', {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '32px',
        color: '#B71C1C',
        backgroundColor: '#FFF8E1',
        padding: { x: 8, y: 0 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(101);
    exitBtn.on('pointerdown', () => {
      AudioSystem.get().play('click');
      this.gameScene.exitToLevelSelect();
    });

    // Bottom action bar
    const barY = GAME_HEIGHT - 56;
    const barBg = this.add.graphics();
    barBg.fillStyle(COLORS.cream, 0.9);
    barBg.fillRect(0, barY, GAME_WIDTH, 56);
    barBg.lineStyle(2, COLORS.charcoal);
    barBg.beginPath();
    barBg.moveTo(0, barY);
    barBg.lineTo(GAME_WIDTH, barY);
    barBg.strokePath();
    barBg.setDepth(100);

    // Send wave button
    this.sendBtn = this.add.container(140, barY + 28).setDepth(101);
    const sendBg = this.add.image(0, 0, 'ui_button').setScale(0.95, 0.7);
    this.sendBtnLabel = this.add
      .text(0, 0, I18n.get().t().ui.sendWave, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '20px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    this.sendBtn.add([sendBg, this.sendBtnLabel]);
    sendBg.setInteractive({ useHandCursor: true });
    sendBg.on('pointerdown', () => {
      const info = this.gameScene.getWaveInfo();
      if (info.ready) {
        AudioSystem.get().play('click');
        this.gameScene.triggerSendNext();
      }
    });

    // Meteor button
    this.meteorBtn = this.add.container(GAME_WIDTH - 200, barY + 28).setDepth(101);
    const mBg = this.add.image(0, 0, 'ui_button').setScale(0.7, 0.7);
    const mIcon = this.add.image(-40, 0, 'ui_meteor').setScale(0.7);
    const mLabel = this.add
      .text(12, 0, I18n.get().t().ui.meteor, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '18px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    this.meteorCdText = this.add
      .text(36, 0, '', {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '14px',
        color: '#B71C1C',
      })
      .setOrigin(0.5);
    this.meteorBtn.add([mBg, mIcon, mLabel, this.meteorCdText]);
    mBg.setInteractive({ useHandCursor: true });
    mBg.on('pointerdown', () => {
      AudioSystem.get().play('click');
      this.gameScene.enterMeteorAim();
    });

    // Heal button
    this.healBtn = this.add.container(GAME_WIDTH - 60, barY + 28).setDepth(101);
    const hBg = this.add.image(0, 0, 'ui_button').setScale(0.5, 0.7);
    const hIcon = this.add.image(-28, 0, 'ui_heal').setScale(0.7);
    const hLabel = this.add
      .text(14, 0, I18n.get().t().ui.heal, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '16px',
        color: '#4A148C',
      })
      .setOrigin(0.5);
    this.healCdText = this.add
      .text(28, 0, '', {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '12px',
        color: '#B71C1C',
      })
      .setOrigin(0.5);
    this.healBtn.add([hBg, hIcon, hLabel, this.healCdText]);
    hBg.setInteractive({ useHandCursor: true });
    hBg.on('pointerdown', () => {
      AudioSystem.get().play('click');
      this.gameScene.triggerHeal();
    });

    // Listen for events
    this.gameScene.events.on(
      'openTowerShop',
      (data: { spot: BuildSpot; sprite: Phaser.GameObjects.Image }) => this.openTowerShop(data.spot),
    );
    this.gameScene.events.on('openTowerUpgrade', (data: { tower: Tower }) =>
      this.openTowerUpgrade(data.tower),
    );
  }

  update(): void {
    if (!this.game) return;
    this.goldText.setText(`${this.gameScene.getGold()}`);
    this.livesText.setText(`${this.gameScene.getLives()}`);
    const w = this.gameScene.getWaveInfo();
    this.waveText.setText(`${I18n.get().t().ui.wave} ${Math.max(1, w.current)}/${w.total}`);

    // speed text highlight
    const sp = this.gameScene.getSpeedMultiplier();
    this.speedTexts.forEach((t, i) => {
      const s = i + 1;
      t.setColor(s === sp ? '#4A148C' : '#9E9E9E');
      t.setBackgroundColor(s === sp ? '#FFF59D' : 'transparent');
    });
    const ut = I18n.get().t().ui;
    this.pauseText.setText(this.gameScene.isPaused() ? ut.resume : ut.pause);

    // send button state
    if (w.ready) {
      this.sendBtn.setAlpha(1);
      this.sendBtnLabel.setText(`${ut.sendWave} ${w.current + 1}`);
    } else if (w.spawning) {
      this.sendBtn.setAlpha(0.5);
      this.sendBtnLabel.setText(`${ut.wave} ${w.current} ${ut.waveActive}`);
    } else {
      this.sendBtn.setAlpha(0.5);
      this.sendBtnLabel.setText(`${ut.wave} ${w.current}/${w.total}`);
    }

    // ability cooldowns
    const meteorCd = this.gameScene.getMeteorCooldown();
    if (meteorCd > 0) {
      this.meteorBtn.setAlpha(0.6);
      this.meteorCdText.setText(`${(meteorCd / 1000).toFixed(0)}s`);
    } else {
      this.meteorBtn.setAlpha(1);
      this.meteorCdText.setText('');
    }
    const healCd = this.gameScene.getHealCooldown();
    if (healCd > 0) {
      this.healBtn.setAlpha(0.6);
      this.healCdText.setText(`${(healCd / 1000).toFixed(0)}s`);
    } else {
      this.healBtn.setAlpha(1);
      this.healCdText.setText('');
    }
  }

  // ---------------- Tower Shop ----------------
  private openTowerShop(spot: BuildSpot): void {
    this.closeShop();
    this.closeUpgrade();

    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.4).setOrigin(0);
    overlay.setInteractive();
    overlay.setDepth(150);
    overlay.on('pointerdown', () => this.closeShop());

    const px = Phaser.Math.Clamp(spot.x, 200, GAME_WIDTH - 200);
    const py = Phaser.Math.Clamp(spot.y - 80, 100, GAME_HEIGHT - 280);

    const panel = this.add.image(px, py, 'ui_panel').setScale(1.2, 0.95);
    panel.setDepth(151);
    const title = this.add
      .text(px, py - 130, I18n.get().t().ui.buildTower, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '24px',
        color: '#4A148C',
      })
      .setOrigin(0.5)
      .setDepth(152);

    this.shopGroup.push(overlay, panel, title);

    const kinds: TowerKind[] = ['archer', 'mage', 'cannon', 'frost'];
    kinds.forEach((kind, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cardX = px - 70 + col * 140;
      const cardY = py - 60 + row * 110;

      const def = TOWER_DEFS[kind];
      const cost = def.tiers[0].cost;
      const canAfford = this.gameScene.getGold() >= cost;

      const card = this.add.graphics();
      card.fillStyle(canAfford ? COLORS.cream : 0xeeeeee, 1);
      card.fillRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
      card.lineStyle(3, COLORS.charcoal, canAfford ? 1 : 0.5);
      card.strokeRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
      card.setDepth(152);

      const towerImg = this.add.image(cardX, cardY - 12, `tower_${kind}_1`).setScale(0.55);
      towerImg.setDepth(153);

      const costText = this.add
        .text(cardX, cardY + 32, `💰 ${cost}`, {
          fontFamily: 'Press Start 2P, monospace',
          fontSize: '12px',
          color: canAfford ? '#4A148C' : '#999999',
        })
        .setOrigin(0.5)
        .setDepth(153);

      const nameText = this.add
        .text(cardX, cardY + 52, I18n.get().tower(kind).name.split(' ').slice(0, 2).join(' '), {
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '11px',
          color: '#4A148C',
        })
        .setOrigin(0.5)
        .setDepth(153);

      const hitArea = this.add
        .rectangle(cardX, cardY, 120, 100, 0xffffff, 0.001)
        .setInteractive({ useHandCursor: canAfford })
        .setDepth(154);
      hitArea.on('pointerdown', () => {
        if (!canAfford) return;
        if (this.gameScene.buildTower(kind, spot)) {
          this.closeShop();
        }
      });
      hitArea.on('pointerover', () => {
        if (canAfford) {
          card.clear();
          card.fillStyle(COLORS.yellow, 1);
          card.fillRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
          card.lineStyle(3, COLORS.charcoal, 1);
          card.strokeRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
        }
      });
      hitArea.on('pointerout', () => {
        card.clear();
        card.fillStyle(canAfford ? COLORS.cream : 0xeeeeee, 1);
        card.fillRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
        card.lineStyle(3, COLORS.charcoal, canAfford ? 1 : 0.5);
        card.strokeRoundedRect(cardX - 60, cardY - 50, 120, 100, 10);
      });

      this.shopGroup.push(card, towerImg, costText, nameText, hitArea);
    });

    const closeBtn = this.add
      .text(px, py + 130, I18n.get().t().ui.cancel, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '16px',
        color: '#B71C1C',
        backgroundColor: '#FFF8E1',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(153);
    closeBtn.on('pointerdown', () => this.closeShop());
    this.shopGroup.push(closeBtn);
  }

  private closeShop(): void {
    this.shopGroup.forEach((o) => o.destroy());
    this.shopGroup = [];
  }

  // ---------------- Tower Upgrade ----------------
  private openTowerUpgrade(tower: Tower): void {
    this.closeShop();
    this.closeUpgrade();

    const px = Phaser.Math.Clamp(tower.position.x, 200, GAME_WIDTH - 200);
    const py = Phaser.Math.Clamp(tower.position.y - 100, 120, GAME_HEIGHT - 260);

    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.3).setOrigin(0);
    overlay.setInteractive();
    overlay.setDepth(150);
    overlay.on('pointerdown', () => this.closeUpgrade(tower));

    const panel = this.add.image(px, py, 'ui_panel').setScale(1.0, 0.85);
    panel.setDepth(151);

    const def = TOWER_DEFS[tower.kind];
    const titleText = this.add
      .text(px, py - 110, I18n.get().tower(tower.kind).name, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '20px',
        color: '#4A148C',
        wordWrap: { width: 240 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(152);

    const tierText = this.add
      .text(px, py - 78, `${I18n.get().t().ui.tier} ${tower.tier} / ${def.tiers.length}`, {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '12px',
        color: '#7B1FA2',
      })
      .setOrigin(0.5)
      .setDepth(152);

    const stats = tower.stats;
    const statsText = this.add
      .text(
        px,
        py - 30,
        `DMG ${stats.damage}\nRNG ${stats.range}\nRoF ${stats.fireRate.toFixed(1)}/s`,
        {
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '16px',
          color: '#424242',
          align: 'center',
          lineSpacing: 4,
        },
      )
      .setOrigin(0.5)
      .setDepth(152);

    this.upgradeGroup.push(overlay, panel, titleText, tierText, statsText);

    const upgradeCost = tower.getNextTierCost();
    if (upgradeCost !== null) {
      const canAfford = this.gameScene.getGold() >= upgradeCost;
      const upBtn = this.add
        .text(px - 60, py + 60, canAfford ? `${I18n.get().t().ui.upgrade}  💰${upgradeCost}` : `⬆ ${upgradeCost}`, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '16px',
          color: canAfford ? '#1B5E20' : '#9E9E9E',
          backgroundColor: '#FFF8E1',
          padding: { x: 10, y: 8 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: canAfford })
        .setDepth(153);
      upBtn.on('pointerdown', () => {
        if (this.gameScene.upgradeTower(tower)) {
          // refresh
          this.closeUpgrade();
          this.openTowerUpgrade(tower);
        }
      });
      this.upgradeGroup.push(upBtn);
    } else {
      const maxTxt = this.add
        .text(px - 60, py + 60, I18n.get().t().ui.maxTier, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '16px',
          color: '#FBC02D',
          backgroundColor: '#FFF8E1',
          padding: { x: 10, y: 8 },
        })
        .setOrigin(0.5)
        .setDepth(153);
      this.upgradeGroup.push(maxTxt);
    }

    const sellValue = tower.getSellValue();
    const sellBtn = this.add
      .text(px + 60, py + 60, `${I18n.get().t().ui.sell}  💰${sellValue}`, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '16px',
        color: '#B71C1C',
        backgroundColor: '#FFF8E1',
        padding: { x: 10, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(153);
    sellBtn.on('pointerdown', () => {
      this.gameScene.sellTower(tower);
      this.closeUpgrade();
    });

    const closeBtn = this.add
      .text(px, py + 110, I18n.get().t().ui.close, {
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '14px',
        color: '#B71C1C',
        backgroundColor: '#FFF8E1',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(153);
    closeBtn.on('pointerdown', () => this.closeUpgrade(tower));

    this.upgradeGroup.push(sellBtn, closeBtn);
  }

  private closeUpgrade(tower?: Tower): void {
    this.upgradeGroup.forEach((o) => o.destroy());
    this.upgradeGroup = [];
    if (tower) tower.hideRange();
  }
}
