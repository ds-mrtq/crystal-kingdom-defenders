import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/GameConfig';
import { GAME_BALANCE, TOWER_DEFS } from '../config/BalanceConfig';
import { LEVELS } from '../config/LevelConfig';
import type { LevelDef, TowerKind, EnemyKind, BuildSpot } from '../types';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import type { Projectile } from '../entities/Projectile';
import { WaveManager } from '../systems/WaveManager';
import { AbilityManager } from '../systems/AbilityManager';
import { AudioSystem } from '../audio/AudioSystem';

interface GameSceneData {
  levelId: number;
}

export class GameScene extends Phaser.Scene {
  private level!: LevelDef;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private towers: Tower[] = [];
  private waveManager!: WaveManager;
  private abilityManager!: AbilityManager;

  private gold = 0;
  private lives = 0;
  private speedMultiplier: 1 | 2 | 3 = 1;
  private paused = false;
  private gameOver = false;

  private buildSpotSprites: Phaser.GameObjects.Image[] = [];
  private buildSpotMap = new Map<Phaser.GameObjects.Image, BuildSpot>();
  private occupiedSpots = new Set<string>();
  private selectedTower: Tower | null = null;
  private meteorAimMode = false;
  private meteorAimReticle: Phaser.GameObjects.Arc | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData): void {
    this.level = LEVELS.find((l) => l.id === data.levelId) ?? LEVELS[0];
    this.enemies = [];
    this.projectiles = [];
    this.towers = [];
    this.gold = this.level.startGold;
    this.lives = this.level.startLives;
    this.speedMultiplier = 1;
    this.paused = false;
    this.gameOver = false;
    this.buildSpotSprites = [];
    this.buildSpotMap = new Map();
    this.occupiedSpots = new Set();
    this.selectedTower = null;
    this.meteorAimMode = false;
    this.meteorAimReticle = null;
  }

  create(): void {
    this.drawBackground();
    this.drawPath();
    this.drawDecorations();
    this.drawGoalAndStart();
    this.makeBuildSpots();

    this.waveManager = new WaveManager(this.level.waves);
    this.abilityManager = new AbilityManager(this);

    // Launch UI scene on top
    this.scene.launch('UIScene', { game: this });

    AudioSystem.get().playBattleTheme();

    // Click empty space to deselect
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.meteorAimMode) {
        this.handleMeteorClick(pointer.worldX, pointer.worldY);
        return;
      }
      // close any selection if click far from tower / build spot
      // selection handled by individual sprites
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.meteorAimMode && this.meteorAimReticle) {
        this.meteorAimReticle.setPosition(pointer.worldX, pointer.worldY);
      }
    });
  }

  // ----------------- API for UIScene -----------------
  getGold(): number {
    return this.gold;
  }
  getLives(): number {
    return this.lives;
  }
  getStartLives(): number {
    return this.level.startLives;
  }
  getWaveInfo(): { current: number; total: number; ready: boolean; spawning: boolean } {
    return {
      current: this.waveManager.currentWaveNumber,
      total: this.waveManager.totalWaves,
      ready: this.waveManager.isReadyForNext(),
      spawning: this.waveManager.isSpawning(),
    };
  }
  getLevel(): LevelDef {
    return this.level;
  }
  getSpeedMultiplier(): 1 | 2 | 3 {
    return this.speedMultiplier;
  }
  isPaused(): boolean {
    return this.paused;
  }
  setSpeed(s: 1 | 2 | 3): void {
    this.speedMultiplier = s;
  }
  togglePause(): void {
    this.paused = !this.paused;
  }
  getMeteorCooldown(): number {
    return this.abilityManager.meteorCooldownRemaining();
  }
  getHealCooldown(): number {
    return this.abilityManager.healCooldownRemaining();
  }
  getMeteorTotalCooldown(): number {
    return GAME_BALANCE.meteorCooldown;
  }
  getHealTotalCooldown(): number {
    return GAME_BALANCE.healCooldown;
  }
  triggerSendNext(): void {
    if (this.waveManager.isReadyForNext()) {
      AudioSystem.get().play('wave_start');
      this.waveManager.startNext();
    }
  }
  enterMeteorAim(): void {
    if (!this.abilityManager.isMeteorReady() || this.gameOver) return;
    this.meteorAimMode = true;
    if (!this.meteorAimReticle) {
      this.meteorAimReticle = this.add.circle(0, 0, GAME_BALANCE.meteorRadius, 0xff5722, 0.25);
      this.meteorAimReticle.setStrokeStyle(3, 0xff5722, 0.9);
      this.meteorAimReticle.setDepth(90);
    }
    this.meteorAimReticle.setVisible(true);
  }
  triggerHeal(): void {
    if (!this.abilityManager.isHealReady() || this.gameOver) return;
    this.abilityManager.triggerHeal((amount) => {
      this.lives += amount;
      // sparkle on goal
      const last = this.level.pathWaypoints[this.level.pathWaypoints.length - 1];
      const fx = this.add.particles(last.x - 20, last.y, 'fx_sparkle', {
        lifespan: 800,
        speed: { min: 80, max: 200 },
        scale: { start: 1.4, end: 0 },
        quantity: 24,
        blendMode: 'ADD',
      });
      this.time.delayedCall(900, () => fx.destroy());
    });
  }

  exitToLevelSelect(): void {
    AudioSystem.get().stopMusic();
    this.scene.stop('UIScene');
    this.scene.start('LevelSelectScene');
  }

  // ----------------- Update Loop -----------------
  update(_time: number, deltaMs: number): void {
    if (this.gameOver || this.paused) return;
    const scaledDeltaMs = deltaMs * this.speedMultiplier;
    const dt = scaledDeltaMs / 1000;

    // Wave spawning
    this.waveManager.step(scaledDeltaMs, (kind) => this.spawnEnemy(kind));

    // Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.alive) {
        this.enemies.splice(i, 1);
        this.gold += e.goldReward;
        AudioSystem.get().play('enemy_die');
        continue;
      }
      const reached = e.step(dt);
      if (reached) {
        this.lives -= e.damageOnLeak;
        AudioSystem.get().play('enemy_leak');
        e.die();
        this.enemies.splice(i, 1);
        if (this.lives <= 0) {
          this.endLevel(false);
          return;
        }
      }
    }

    // Towers fire
    for (const t of this.towers) {
      t.step(dt, this.enemies);
    }

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const finished = p.step(dt);
      if (finished) {
        this.projectiles.splice(i, 1);
      }
    }

    // Wave-clear detection
    if (
      !this.waveManager.isSpawning() &&
      this.enemies.length === 0 &&
      !this.waveManager.isReadyForNext() &&
      !this.gameOver
    ) {
      this.waveManager.markWaveCleared();
      if (!this.waveManager.hasMoreWaves()) {
        // all waves done - victory
        this.endLevel(true);
      } else {
        // bonus gold for clearing
        this.gold += 10;
      }
    }
  }

  // ----------------- Spawning -----------------
  private spawnEnemy(kind: EnemyKind): void {
    const enemy = new Enemy(this, kind, this.level.pathWaypoints);
    this.enemies.push(enemy);
  }

  // ----------------- Build Spots / Tower Placement -----------------
  private makeBuildSpots(): void {
    for (const spot of this.level.buildSpots) {
      const sprite = this.add.image(spot.x, spot.y, 'tile_buildspot');
      sprite.setDepth(20);
      sprite.setInteractive({ useHandCursor: true });
      this.buildSpotSprites.push(sprite);
      this.buildSpotMap.set(sprite, spot);
      this.tweens.add({
        targets: sprite,
        alpha: 0.55,
        yoyo: true,
        duration: 1200,
        repeat: -1,
      });
      sprite.on('pointerdown', () => {
        if (this.gameOver || this.paused || this.meteorAimMode) return;
        if (this.occupiedSpots.has(this.spotKey(spot))) return;
        this.events.emit('openTowerShop', { spot, sprite });
      });
    }
  }

  private spotKey(spot: BuildSpot): string {
    return `${spot.x}_${spot.y}`;
  }

  /** Called by UI when a tower is purchased. */
  buildTower(kind: TowerKind, spot: BuildSpot): boolean {
    if (this.occupiedSpots.has(this.spotKey(spot))) return false;
    const cost = TOWER_DEFS[kind].tiers[0].cost;
    if (this.gold < cost) return false;
    this.gold -= cost;
    const tower = new Tower(this, kind, spot, this.makeTowerCallbacks(), cost);
    this.towers.push(tower);
    this.occupiedSpots.add(this.spotKey(spot));

    // hide build spot indicator (replaced by tower)
    const sprite = this.buildSpotSprites.find(
      (s) => this.buildSpotMap.get(s)?.x === spot.x && this.buildSpotMap.get(s)?.y === spot.y,
    );
    if (sprite) sprite.setVisible(false);

    AudioSystem.get().play('place');
    // attach click to tower sprite
    const towerSprite = (tower as unknown as { sprite: Phaser.GameObjects.Image }).sprite;
    towerSprite.setInteractive({ useHandCursor: true });
    towerSprite.on('pointerdown', () => {
      if (this.gameOver || this.meteorAimMode) return;
      this.selectTower(tower);
    });
    return true;
  }

  private selectTower(tower: Tower): void {
    if (this.selectedTower && this.selectedTower !== tower) {
      this.selectedTower.hideRange();
    }
    this.selectedTower = tower;
    tower.showRange();
    this.events.emit('openTowerUpgrade', { tower });
  }

  upgradeTower(tower: Tower): boolean {
    const cost = tower.getNextTierCost();
    if (cost === null || this.gold < cost) return false;
    this.gold -= cost;
    tower.upgradeTier();
    return true;
  }

  sellTower(tower: Tower): void {
    const refund = tower.getSellValue();
    this.gold += refund;
    AudioSystem.get().play('coin');
    // remove
    const idx = this.towers.indexOf(tower);
    if (idx >= 0) this.towers.splice(idx, 1);
    const key = this.spotKey(tower.position);
    this.occupiedSpots.delete(key);
    // reshow build spot
    const sprite = this.buildSpotSprites.find(
      (s) =>
        this.buildSpotMap.get(s)?.x === tower.position.x &&
        this.buildSpotMap.get(s)?.y === tower.position.y,
    );
    if (sprite) sprite.setVisible(true);
    tower.destroy();
    if (this.selectedTower === tower) this.selectedTower = null;
  }

  // ----------------- Tower callbacks -----------------
  private makeTowerCallbacks() {
    return {
      spawnProjectile: (proj: Projectile) => {
        this.projectiles.push(proj);
      },
      applyAreaDamage: (
        x: number,
        y: number,
        damage: number,
        radius: number,
        excludeFlying: boolean,
      ) => {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          if (excludeFlying && e.isFlying) continue;
          const d = Math.hypot(e.x - x, e.y - y);
          if (d <= radius) e.applyDamage(damage);
        }
      },
      applySlowAt: (x: number, y: number, factor: number, duration: number) => {
        // small radius around impact
        const slowRadius = 36;
        for (const e of this.enemies) {
          if (!e.alive) continue;
          const d = Math.hypot(e.x - x, e.y - y);
          if (d <= slowRadius) e.applySlow(factor, duration);
        }
      },
    };
  }

  // ----------------- Meteor -----------------
  private handleMeteorClick(x: number, y: number): void {
    if (!this.meteorAimMode) return;
    this.meteorAimMode = false;
    if (this.meteorAimReticle) this.meteorAimReticle.setVisible(false);
    this.abilityManager.triggerMeteor(x, y, (mx, my, damage, radius) => {
      for (const e of this.enemies) {
        if (!e.alive) continue;
        const d = Math.hypot(e.x - mx, e.y - my);
        if (d <= radius) e.applyDamage(damage);
      }
    });
  }

  // ----------------- Background / Path -----------------
  private drawBackground(): void {
    const [c1, c2] = this.level.bgGradient;
    const g = this.add.graphics();
    g.fillGradientStyle(c1, c1, c2, c2, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.setDepth(-100);

    // soft texture: scattered shapes
    const texG = this.add.graphics();
    texG.setDepth(-90);
    const tileColor = this.biomeAccent();
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * GAME_HEIGHT;
      texG.fillStyle(tileColor, 0.18);
      texG.fillCircle(x, y, 8 + Math.random() * 14);
    }
  }

  private biomeAccent(): number {
    switch (this.level.biome) {
      case 'forest':
        return COLORS.forestGreen;
      case 'hills':
        return COLORS.peach;
      case 'frost':
        return COLORS.white;
      case 'sky':
        return COLORS.lavender;
      case 'throne':
        return COLORS.shadowMid;
    }
  }

  private drawPath(): void {
    const wps = this.level.pathWaypoints;
    const g = this.add.graphics();
    g.setDepth(-50);
    // outer dark
    g.lineStyle(56, COLORS.pathDark, 1);
    g.beginPath();
    g.moveTo(wps[0].x, wps[0].y);
    for (let i = 1; i < wps.length; i++) g.lineTo(wps[i].x, wps[i].y);
    g.strokePath();
    // inner light
    g.lineStyle(40, COLORS.pathTan, 1);
    g.beginPath();
    g.moveTo(wps[0].x, wps[0].y);
    for (let i = 1; i < wps.length; i++) g.lineTo(wps[i].x, wps[i].y);
    g.strokePath();
    // dashed center line
    g.lineStyle(2, COLORS.cream, 0.6);
    for (let i = 0; i < wps.length - 1; i++) {
      const a = wps[i];
      const b = wps[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const segs = Math.floor(dist / 16);
      for (let s = 0; s < segs; s += 2) {
        const t1 = s / segs;
        const t2 = (s + 1) / segs;
        g.beginPath();
        g.moveTo(a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1);
        g.lineTo(a.x + (b.x - a.x) * t2, a.y + (b.y - a.y) * t2);
        g.strokePath();
      }
    }
  }

  private drawDecorations(): void {
    // Only use harmless areas (avoid path & spots)
    const bannedZones = this.collectBannedZones();
    const pickColor = () => this.biomeAccent();
    const pickDeco = (x: number, y: number) => {
      const decoration = Math.floor(Math.random() * 3);
      const c = pickColor();
      switch (decoration) {
        case 0: {
          // circle "bush"
          const bush = this.add.graphics();
          bush.fillStyle(c, 1);
          bush.fillCircle(x, y, 8);
          bush.fillStyle(c, 0.7);
          bush.fillCircle(x + 6, y + 2, 6);
          bush.fillCircle(x - 5, y + 4, 5);
          bush.lineStyle(2, COLORS.charcoal, 0.4);
          bush.strokeCircle(x, y, 8);
          bush.setDepth(-20);
          break;
        }
        case 1: {
          // tiny flower
          const f = this.add.graphics();
          f.fillStyle(0xfff59d, 1);
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            f.fillCircle(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 3);
          }
          f.fillStyle(0xffab40, 1);
          f.fillCircle(x, y, 2);
          f.setDepth(-20);
          break;
        }
        case 2: {
          // small star
          const s = this.add.image(x, y, 'fx_sparkle').setScale(0.7).setAlpha(0.8);
          s.setDepth(-20);
          this.tweens.add({
            targets: s,
            alpha: 0.3,
            yoyo: true,
            duration: 1500 + Math.random() * 1500,
            repeat: -1,
          });
          break;
        }
      }
    };

    for (let i = 0; i < 35; i++) {
      let tries = 0;
      while (tries < 10) {
        const x = 30 + Math.random() * (GAME_WIDTH - 60);
        const y = 30 + Math.random() * (GAME_HEIGHT - 60);
        if (!this.isInBannedZone(x, y, bannedZones)) {
          pickDeco(x, y);
          break;
        }
        tries++;
      }
    }
  }

  private collectBannedZones(): Array<{ x: number; y: number; r: number }> {
    const zones: Array<{ x: number; y: number; r: number }> = [];
    const wps = this.level.pathWaypoints;
    for (let i = 0; i < wps.length - 1; i++) {
      const a = wps[i];
      const b = wps[i + 1];
      const segs = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 30);
      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        zones.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: 50 });
      }
    }
    for (const sp of this.level.buildSpots) zones.push({ x: sp.x, y: sp.y, r: 50 });
    return zones;
  }

  private isInBannedZone(
    x: number,
    y: number,
    zones: Array<{ x: number; y: number; r: number }>,
  ): boolean {
    for (const z of zones) {
      if (Math.hypot(x - z.x, y - z.y) < z.r) return true;
    }
    return false;
  }

  private drawGoalAndStart(): void {
    const wps = this.level.pathWaypoints;
    const start = wps[0];
    const end = wps[wps.length - 1];

    // start banner
    const startG = this.add.graphics();
    startG.fillStyle(0x66bb6a, 1);
    startG.fillRoundedRect(start.x - 30, start.y - 50, 60, 30, 6);
    startG.lineStyle(2, COLORS.charcoal);
    startG.strokeRoundedRect(start.x - 30, start.y - 50, 60, 30, 6);
    startG.setDepth(15);
    this.add
      .text(start.x, start.y - 35, 'START', {
        fontFamily: 'Press Start 2P, monospace',
        fontSize: '10px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5)
      .setDepth(16);

    // goal castle
    const endG = this.add.graphics();
    endG.fillStyle(COLORS.cream, 1);
    endG.fillRect(end.x - 6, end.y - 60, 50, 60);
    endG.lineStyle(3, COLORS.charcoal);
    endG.strokeRect(end.x - 6, end.y - 60, 50, 60);
    // crenellations
    for (let i = 0; i < 3; i++) {
      endG.fillStyle(COLORS.cream, 1);
      endG.fillRect(end.x - 4 + i * 16, end.y - 70, 10, 10);
      endG.lineStyle(2, COLORS.charcoal);
      endG.strokeRect(end.x - 4 + i * 16, end.y - 70, 10, 10);
    }
    // door
    endG.fillStyle(COLORS.charcoal, 0.8);
    endG.fillRoundedRect(end.x + 10, end.y - 30, 20, 30, 4);
    // flag
    endG.lineStyle(2, COLORS.charcoal);
    endG.strokeRect(end.x + 18, end.y - 90, 2, 22);
    endG.fillStyle(COLORS.cherry, 1);
    endG.fillTriangle(end.x + 20, end.y - 88, end.x + 32, end.y - 84, end.x + 20, end.y - 80);
    endG.setDepth(15);

    // crystal shrine glow
    const shrineGlow = this.add.circle(end.x + 20, end.y - 30, 14, COLORS.lavender, 0.3);
    shrineGlow.setDepth(14);
    this.tweens.add({
      targets: shrineGlow,
      scale: 1.4,
      alpha: 0.6,
      yoyo: true,
      duration: 1200,
      repeat: -1,
    });
  }

  // ----------------- End Level -----------------
  private endLevel(victory: boolean): void {
    if (this.gameOver) return;
    this.gameOver = true;

    AudioSystem.get().stopMusic();
    AudioSystem.get().play(victory ? 'victory' : 'defeat');

    let stars = 0;
    if (victory) {
      const ratio = this.lives / this.level.startLives;
      if (ratio >= GAME_BALANCE.starThresholds.full) stars = 3;
      else if (ratio >= GAME_BALANCE.starThresholds.two) stars = 2;
      else stars = 1;
    }

    this.scene.stop('UIScene');
    this.scene.start('ResultScene', {
      levelId: this.level.id,
      victory,
      remainingLives: this.lives,
      startLives: this.level.startLives,
      stars,
    });
  }
}
