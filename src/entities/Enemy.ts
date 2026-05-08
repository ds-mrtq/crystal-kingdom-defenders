import Phaser from 'phaser';
import type { EnemyKind, Vec2 } from '../types';
import { ENEMY_DEFS } from '../config/BalanceConfig';
import { COLORS } from '../config/GameConfig';

export class Enemy extends Phaser.GameObjects.Container {
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  baseSpeed: number;
  speed: number;
  damageOnLeak: number;
  goldReward: number;
  isFlying: boolean;
  alive = true;

  private waypoints: Vec2[];
  private waypointIndex = 0;
  private sprite: Phaser.GameObjects.Image;
  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private animTimer = 0;
  private animFrame = 0;
  private slowUntil = 0;
  private slowFactor = 1;
  private lastFlipped = false;

  constructor(scene: Phaser.Scene, kind: EnemyKind, waypoints: Vec2[]) {
    const start = waypoints[0];
    super(scene, start.x, start.y);
    scene.add.existing(this);

    this.kind = kind;
    const def = ENEMY_DEFS[kind];
    this.hp = def.stats.maxHp;
    this.maxHp = def.stats.maxHp;
    this.baseSpeed = def.stats.speed;
    this.speed = def.stats.speed;
    this.damageOnLeak = def.stats.damageOnLeak;
    this.goldReward = def.stats.goldReward;
    this.isFlying = def.stats.isFlying;
    this.waypoints = waypoints;

    this.sprite = scene.add.image(0, 0, `enemy_${kind}_0`).setOrigin(0.5, 0.85);
    this.sprite.setScale(def.stats.scale);

    // hp bar (above sprite)
    const barW = 36 * def.stats.scale;
    this.hpBarBg = scene.add.rectangle(0, -38 * def.stats.scale, barW, 5, COLORS.charcoal, 0.5);
    this.hpBarFill = scene.add.rectangle(0, -38 * def.stats.scale, barW, 5, COLORS.hpGreen);
    this.hpBarFill.setOrigin(0.5, 0.5);

    if (this.isFlying) {
      this.sprite.setY(-30); // float
    }

    this.add([this.sprite, this.hpBarBg, this.hpBarFill]);
    this.setDepth(this.isFlying ? 60 : 50);
  }

  applyDamage(damage: number): void {
    if (!this.alive) return;
    this.hp -= damage;
    this.updateHpBar();
    if (this.hp <= 0) {
      this.die();
    } else {
      // hit flash
      this.sprite.setTint(0xffffff);
      this.scene.time.delayedCall(60, () => this.sprite && this.sprite.clearTint());
    }
  }

  applySlow(factor: number, durationMs: number): void {
    if (!this.alive) return;
    if (factor < this.slowFactor) {
      this.slowFactor = factor;
    }
    const newUntil = this.scene.time.now + durationMs;
    if (newUntil > this.slowUntil) this.slowUntil = newUntil;
    this.sprite.setTint(0xb3e5fc);
  }

  private updateHpBar(): void {
    const ratio = Math.max(0, this.hp / this.maxHp);
    const fullW = (this.hpBarBg as Phaser.GameObjects.Rectangle).width;
    this.hpBarFill.width = fullW * ratio;
    this.hpBarFill.x = -fullW / 2 + (fullW * ratio) / 2;
    if (ratio > 0.6) this.hpBarFill.fillColor = COLORS.hpGreen;
    else if (ratio > 0.3) this.hpBarFill.fillColor = COLORS.goldYellow;
    else this.hpBarFill.fillColor = COLORS.hpRed;
  }

  /** Returns true if enemy reached the goal (last waypoint). */
  step(deltaSeconds: number): boolean {
    if (!this.alive) return false;
    // tick slow
    if (this.scene.time.now >= this.slowUntil) {
      this.slowFactor = 1;
      this.sprite.clearTint();
    }
    this.speed = this.baseSpeed * this.slowFactor;

    if (this.waypointIndex >= this.waypoints.length - 1) {
      return true;
    }
    const target = this.waypoints[this.waypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const move = this.speed * deltaSeconds;

    if (move >= dist) {
      this.x = target.x;
      this.y = target.y;
      this.waypointIndex++;
    } else {
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    }

    // sprite flip based on direction
    if (dx < -0.1 && !this.lastFlipped) {
      this.sprite.setFlipX(true);
      this.lastFlipped = true;
    } else if (dx > 0.1 && this.lastFlipped) {
      this.sprite.setFlipX(false);
      this.lastFlipped = false;
    }

    // walk anim
    this.animTimer += deltaSeconds * 1000;
    const animMs = this.kind === 'bat' ? 120 : 220;
    if (this.animTimer >= animMs) {
      this.animTimer = 0;
      this.animFrame = 1 - this.animFrame;
      this.sprite.setTexture(`enemy_${this.kind}_${this.animFrame}`);
    }

    return false;
  }

  die(): void {
    if (!this.alive) return;
    this.alive = false;
    // flash + scale out
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 220,
      onComplete: () => this.destroy(),
    });
    // particle burst
    const fx = this.scene.add.particles(this.x, this.y, 'fx_sparkle', {
      lifespan: 500,
      speed: { min: 50, max: 160 },
      scale: { start: 0.8, end: 0 },
      quantity: 8,
      blendMode: 'ADD',
    });
    this.scene.time.delayedCall(500, () => fx.destroy());
  }
}
