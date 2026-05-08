import Phaser from 'phaser';
import type { Enemy } from './Enemy';
import type { TowerStats } from '../types';

export class Projectile extends Phaser.GameObjects.Image {
  private targetEnemy: Enemy | null;
  private stats: TowerStats;
  private alive = true;
  private onImpact: (p: Projectile, target: Enemy | null) => void;
  private targetX: number;
  private targetY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Enemy,
    stats: TowerStats,
    onImpact: (p: Projectile, target: Enemy | null) => void,
  ) {
    super(scene, x, y, `proj_${stats.projectile}`);
    scene.add.existing(this);
    this.targetEnemy = target;
    this.stats = stats;
    this.onImpact = onImpact;
    this.targetX = target.x;
    this.targetY = target.y;
    this.setDepth(70);
  }

  step(deltaSeconds: number): boolean {
    if (!this.alive) return true;
    if (this.targetEnemy && this.targetEnemy.alive) {
      this.targetX = this.targetEnemy.x;
      this.targetY = this.targetEnemy.y;
    }
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);
    const move = this.stats.projectileSpeed * deltaSeconds;

    if (this.stats.projectile === 'arrow') {
      this.rotation = Math.atan2(dy, dx);
    } else if (this.stats.projectile === 'magicBolt' || this.stats.projectile === 'frostShard') {
      this.rotation += deltaSeconds * 8;
    } else {
      // cannonball spin
      this.rotation += deltaSeconds * 4;
    }

    if (move >= dist) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.alive = false;
      this.onImpact(this, this.targetEnemy && this.targetEnemy.alive ? this.targetEnemy : null);
      this.destroy();
      return true;
    }
    this.x += (dx / dist) * move;
    this.y += (dy / dist) * move;
    return false;
  }

  getStats(): TowerStats {
    return this.stats;
  }
}
