import Phaser from 'phaser';
import { GAME_BALANCE } from '../config/BalanceConfig';
import { AudioSystem } from '../audio/AudioSystem';

export class AbilityManager {
  private scene: Phaser.Scene;
  private meteorReadyAt = 0;
  private healReadyAt = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  meteorCooldownRemaining(): number {
    return Math.max(0, this.meteorReadyAt - this.scene.time.now);
  }

  healCooldownRemaining(): number {
    return Math.max(0, this.healReadyAt - this.scene.time.now);
  }

  isMeteorReady(): boolean {
    return this.meteorCooldownRemaining() <= 0;
  }

  isHealReady(): boolean {
    return this.healCooldownRemaining() <= 0;
  }

  triggerMeteor(
    x: number,
    y: number,
    onAreaDamage: (x: number, y: number, damage: number, radius: number) => void,
  ): void {
    if (!this.isMeteorReady()) return;
    this.meteorReadyAt = this.scene.time.now + GAME_BALANCE.meteorCooldown;
    AudioSystem.get().play('meteor');

    // Visual: meteor falling from top
    const meteor = this.scene.add.image(x, -60, 'ui_meteor').setScale(2.4);
    meteor.setDepth(80);
    this.scene.tweens.add({
      targets: meteor,
      y,
      angle: 720,
      duration: 380,
      ease: 'Cubic.in',
      onComplete: () => {
        meteor.destroy();
        // explosion
        const burst = this.scene.add.circle(x, y, 10, 0xffeb3b, 0.7);
        burst.setDepth(85);
        this.scene.tweens.add({
          targets: burst,
          scaleX: GAME_BALANCE.meteorRadius / 10,
          scaleY: GAME_BALANCE.meteorRadius / 10,
          alpha: 0,
          duration: 400,
          ease: 'Cubic.out',
          onComplete: () => burst.destroy(),
        });
        const fx = this.scene.add.particles(x, y, 'fx_smoke', {
          lifespan: 600,
          speed: { min: 80, max: 220 },
          scale: { start: 1.4, end: 0 },
          quantity: 16,
          alpha: { start: 0.9, end: 0 },
        });
        this.scene.time.delayedCall(700, () => fx.destroy());
        this.scene.cameras.main.shake(220, 0.008);

        onAreaDamage(x, y, GAME_BALANCE.meteorDamage, GAME_BALANCE.meteorRadius);
      },
    });
  }

  triggerHeal(onHeal: (amount: number) => void): void {
    if (!this.isHealReady()) return;
    this.healReadyAt = this.scene.time.now + GAME_BALANCE.healCooldown;
    AudioSystem.get().play('heal');
    onHeal(GAME_BALANCE.healAmount);
  }
}
