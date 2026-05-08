import Phaser from 'phaser';
import type { TowerKind, TowerStats, Vec2 } from '../types';
import { TOWER_DEFS } from '../config/BalanceConfig';
import type { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { AudioSystem } from '../audio/AudioSystem';

export interface TowerCallbacks {
  spawnProjectile: (proj: Projectile) => void;
  applyAreaDamage: (
    x: number,
    y: number,
    damage: number,
    radius: number,
    excludeFlying: boolean,
  ) => void;
  applySlowAt: (
    x: number,
    y: number,
    factor: number,
    duration: number,
  ) => void;
}

export class Tower {
  kind: TowerKind;
  tier = 1;
  position: Vec2;
  stats: TowerStats;
  private fireCooldown = 0;
  private sprite: Phaser.GameObjects.Image;
  private rangeIndicator: Phaser.GameObjects.Image | null = null;
  private callbacks: TowerCallbacks;
  private scene: Phaser.Scene;
  totalCostPaid: number;

  constructor(
    scene: Phaser.Scene,
    kind: TowerKind,
    position: Vec2,
    callbacks: TowerCallbacks,
    initialCost: number,
  ) {
    this.scene = scene;
    this.kind = kind;
    this.position = position;
    this.callbacks = callbacks;
    this.totalCostPaid = initialCost;
    this.stats = TOWER_DEFS[kind].tiers[0];

    this.sprite = scene.add.image(position.x, position.y, `tower_${kind}_${this.tier}`);
    this.sprite.setOrigin(0.5, 0.85);
    this.sprite.setDepth(40);

    // pop-in animation
    this.sprite.setScale(0);
    scene.tweens.add({
      targets: this.sprite,
      scale: 1,
      duration: 200,
      ease: 'Back.out',
    });
  }

  showRange(): void {
    if (!this.rangeIndicator) {
      this.rangeIndicator = this.scene.add.image(this.position.x, this.position.y, 'tile_range');
      this.rangeIndicator.setDepth(35);
      this.rangeIndicator.setScale(this.stats.range / 200);
    }
    this.rangeIndicator.setVisible(true);
  }

  hideRange(): void {
    if (this.rangeIndicator) {
      this.rangeIndicator.setVisible(false);
    }
  }

  upgradeTier(): boolean {
    if (this.tier >= TOWER_DEFS[this.kind].tiers.length) return false;
    this.tier++;
    this.stats = TOWER_DEFS[this.kind].tiers[this.tier - 1];
    this.totalCostPaid += this.stats.cost;
    this.sprite.setTexture(`tower_${this.kind}_${this.tier}`);
    if (this.rangeIndicator) {
      this.rangeIndicator.setScale(this.stats.range / 200);
    }
    AudioSystem.get().play('upgrade');
    // sparkle
    const fx = this.scene.add.particles(this.position.x, this.position.y - 30, 'fx_sparkle', {
      lifespan: 600,
      speed: { min: 50, max: 140 },
      scale: { start: 1, end: 0 },
      quantity: 12,
      blendMode: 'ADD',
    });
    this.scene.time.delayedCall(700, () => fx.destroy());
    return true;
  }

  getNextTierCost(): number | null {
    const def = TOWER_DEFS[this.kind];
    if (this.tier >= def.tiers.length) return null;
    return def.tiers[this.tier].cost;
  }

  getSellValue(): number {
    return Math.floor(this.totalCostPaid * TOWER_DEFS[this.kind].sellRefundRatio);
  }

  destroy(): void {
    if (this.rangeIndicator) this.rangeIndicator.destroy();
    this.sprite.destroy();
  }

  step(deltaSeconds: number, enemies: Enemy[]): void {
    this.fireCooldown -= deltaSeconds;
    if (this.fireCooldown > 0) return;

    const target = this.findTarget(enemies);
    if (!target) return;

    this.fireCooldown = 1 / this.stats.fireRate;
    this.fire(target);
  }

  private findTarget(enemies: Enemy[]): Enemy | null {
    let best: Enemy | null = null;
    let bestDist = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      if (!this.stats.hitsFlying && e.isFlying) continue;
      const dx = e.x - this.position.x;
      const dy = e.y - this.position.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= this.stats.range && dist < bestDist) {
        bestDist = dist;
        best = e;
      }
    }
    return best;
  }

  private fire(target: Enemy): void {
    // play SFX
    const sfxMap: Record<string, 'fire_arrow' | 'fire_magic' | 'fire_cannon' | 'fire_frost'> = {
      arrow: 'fire_arrow',
      magicBolt: 'fire_magic',
      cannonball: 'fire_cannon',
      frostShard: 'fire_frost',
    };
    AudioSystem.get().play(sfxMap[this.stats.projectile]);

    // tower bobble
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 0.94,
      yoyo: true,
      duration: 80,
    });

    const proj = new Projectile(
      this.scene,
      this.position.x,
      this.position.y - 32,
      target,
      this.stats,
      (_p, hitTarget) => this.handleImpact(this.position, hitTarget, target),
    );
    this.callbacks.spawnProjectile(proj);
  }

  private handleImpact(_origin: Vec2, hitTarget: Enemy | null, originalTarget: Enemy): void {
    const targetForFx = hitTarget ?? originalTarget;
    const fxX = targetForFx.x;
    const fxY = targetForFx.y;

    // direct damage
    if (hitTarget) {
      hitTarget.applyDamage(this.stats.damage);
      if (this.stats.slowFactor !== undefined && this.stats.slowDuration !== undefined) {
        hitTarget.applySlow(this.stats.slowFactor, this.stats.slowDuration);
      }
    }

    // splash
    if (this.stats.splashRadius) {
      this.callbacks.applyAreaDamage(
        fxX,
        fxY,
        this.stats.damage * 0.7,
        this.stats.splashRadius,
        !this.stats.hitsFlying,
      );
      // burst fx
      const fx = this.scene.add.particles(fxX, fxY, 'fx_smoke', {
        lifespan: 400,
        speed: { min: 60, max: 140 },
        scale: { start: 1.1, end: 0 },
        quantity: 8,
        alpha: { start: 0.8, end: 0 },
      });
      this.scene.time.delayedCall(500, () => fx.destroy());
    }

    // frost mist for slow towers (radius slow)
    if (this.stats.slowFactor !== undefined && this.stats.slowDuration !== undefined) {
      this.callbacks.applySlowAt(fxX, fxY, this.stats.slowFactor, this.stats.slowDuration);
      const fx = this.scene.add.particles(fxX, fxY, 'fx_frost', {
        lifespan: 500,
        speed: { min: 30, max: 90 },
        scale: { start: 0.8, end: 0 },
        quantity: 6,
        alpha: { start: 0.7, end: 0 },
      });
      this.scene.time.delayedCall(600, () => fx.destroy());
    }
  }
}
