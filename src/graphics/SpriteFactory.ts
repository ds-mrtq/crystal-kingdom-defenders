import Phaser from 'phaser';
import {
  drawChibiHead,
  drawChibiBody,
  drawStar,
  drawHeart,
  drawCoin,
  fillRoundedRect,
  strokeRoundedRect,
  hexStr,
  makeCanvas,
} from './ChibiPainter';
import { COLORS } from '../config/GameConfig';

/**
 * Generates ALL chibi sprites procedurally and registers them as Phaser textures.
 * Called once at boot.
 */
export class SpriteFactory {
  static generateAll(scene: Phaser.Scene): void {
    SpriteFactory.generatePrincess(scene);
    SpriteFactory.generateTowers(scene);
    SpriteFactory.generateEnemies(scene);
    SpriteFactory.generateProjectiles(scene);
    SpriteFactory.generateUI(scene);
    SpriteFactory.generateTiles(scene);
    SpriteFactory.generateParticles(scene);
  }

  private static registerCanvas(scene: Phaser.Scene, key: string, canvas: HTMLCanvasElement): void {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }
    scene.textures.addCanvas(key, canvas);
  }

  // ---------------- Princess Lumi ----------------
  private static generatePrincess(scene: Phaser.Scene): void {
    const size = 96;
    const padX = 24;
    const padY = 8;
    const canvas = makeCanvas(size + padX, size * 1.4 + padY);
    const ctx = canvas.getContext('2d')!;
    ctx.translate(padX / 2, padY);
    const cx = size / 2;

    // body (peach dress with star)
    ctx.fillStyle = hexStr(0xfff8e1);
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 28, 76);
    ctx.lineTo(cx + 28, 76);
    ctx.lineTo(cx + 38, 124);
    ctx.lineTo(cx - 38, 124);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // dress trim
    ctx.fillStyle = hexStr(COLORS.lavender);
    fillRoundedRect(ctx, cx - 38, 118, 76, 6, 3);

    // gold star on chest
    drawStar(ctx, cx, 92, 5, 9, 4, COLORS.goldYellow, COLORS.charcoal);

    // arms (peach)
    ctx.fillStyle = hexStr(COLORS.peach);
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx - 32, 90, 8, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 32, 86, 8, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // wand (held in right hand)
    ctx.strokeStyle = hexStr(0xfff59d);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + 36, 80);
    ctx.lineTo(cx + 50, 60);
    ctx.stroke();
    drawStar(ctx, cx + 52, 56, 5, 8, 3, COLORS.goldYellow, COLORS.charcoal);

    // head
    drawChibiHead(ctx, {
      cx,
      cy: 38,
      radius: 32,
      bodyColor: 0xffe0b2,
      cheekColor: 0xff8a80,
      expression: 'happy',
    });

    // hair (lavender twin tails)
    ctx.fillStyle = hexStr(COLORS.lavender);
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 2.5;
    // bangs
    ctx.beginPath();
    ctx.ellipse(cx, 12, 30, 16, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // side tails
    ctx.beginPath();
    ctx.ellipse(cx - 36, 48, 10, 22, -0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + 36, 48, 10, 22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // tiara crown
    ctx.fillStyle = hexStr(COLORS.goldYellow);
    ctx.beginPath();
    ctx.moveTo(cx - 14, 12);
    ctx.lineTo(cx - 7, 4);
    ctx.lineTo(cx, 12);
    ctx.lineTo(cx + 7, 4);
    ctx.lineTo(cx + 14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    SpriteFactory.registerCanvas(scene, 'princess', canvas);
  }

  // ---------------- Towers ----------------
  private static generateTowers(scene: Phaser.Scene): void {
    SpriteFactory.makeArcherTower(scene);
    SpriteFactory.makeMageTower(scene);
    SpriteFactory.makeCannonTower(scene);
    SpriteFactory.makeFrostTower(scene);
  }

  private static drawTowerBase(
    ctx: CanvasRenderingContext2D,
    cx: number,
    by: number,
    width: number,
    height: number,
    color: number,
    tier: number,
  ): void {
    // platform
    ctx.fillStyle = hexStr(0x8d6e63);
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, by, width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // pillar/box
    ctx.fillStyle = hexStr(color);
    fillRoundedRect(ctx, cx - width / 2 + 6, by - height + 8, width - 12, height - 8, 8);
    ctx.strokeStyle = hexStr(COLORS.charcoal);
    ctx.lineWidth = 2.5;
    strokeRoundedRect(ctx, cx - width / 2 + 6, by - height + 8, width - 12, height - 8, 8);

    // tier stars at top edge
    for (let i = 0; i < tier; i++) {
      drawStar(
        ctx,
        cx + (i - (tier - 1) / 2) * 10,
        by - height + 4,
        5,
        4,
        2,
        COLORS.goldYellow,
        COLORS.charcoal,
      );
    }
  }

  private static makeArcherTower(scene: Phaser.Scene): void {
    for (let tier = 1; tier <= 3; tier++) {
      const size = 96;
      const pad = 16;
      const canvas = makeCanvas(size, size + pad);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, pad);
      const cx = size / 2;
      const by = size - 8;

      // tower base color slightly varies
      const tierColors = [0xffccbc, 0xffab91, 0xff8a65];
      SpriteFactory.drawTowerBase(ctx, cx, by, 64, 60, tierColors[tier - 1], tier);

      // bunny archer on top
      const headY = by - 64;
      drawChibiBody(ctx, {
        cx,
        cy: headY + 22,
        width: 30,
        height: 28,
        bodyColor: 0xffffff,
      });
      // bow
      ctx.strokeStyle = hexStr(0x8d6e63);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx + 14, headY + 18, 14, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.strokeStyle = hexStr(COLORS.cream);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 14 + 14 * Math.cos(-Math.PI * 0.4), headY + 18 + 14 * Math.sin(-Math.PI * 0.4));
      ctx.lineTo(cx + 14 + 14 * Math.cos(Math.PI * 0.4), headY + 18 + 14 * Math.sin(Math.PI * 0.4));
      ctx.stroke();

      drawChibiHead(ctx, {
        cx,
        cy: headY,
        radius: 18,
        bodyColor: 0xffffff,
        expression: 'happy',
      });
      // bunny ears
      ctx.fillStyle = hexStr(0xffffff);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 10, headY - 20, 5, 14, -0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 10, headY - 20, 5, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexStr(0xffccbc);
      ctx.beginPath();
      ctx.ellipse(cx - 10, headY - 20, 2, 8, -0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 10, headY - 20, 2, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();

      SpriteFactory.registerCanvas(scene, `tower_archer_${tier}`, canvas);
    }
  }

  private static makeMageTower(scene: Phaser.Scene): void {
    for (let tier = 1; tier <= 3; tier++) {
      const size = 96;
      const pad = 16;
      const canvas = makeCanvas(size, size + pad);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, pad);
      const cx = size / 2;
      const by = size - 8;

      const tierColors = [0xd1c4e9, 0xb39ddb, 0x9575cd];
      SpriteFactory.drawTowerBase(ctx, cx, by, 64, 60, tierColors[tier - 1], tier);

      const headY = by - 64;
      // robe body
      ctx.fillStyle = hexStr(0x7e57c2);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 18, headY + 8);
      ctx.lineTo(cx + 18, headY + 8);
      ctx.lineTo(cx + 22, headY + 38);
      ctx.lineTo(cx - 22, headY + 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // staff
      ctx.strokeStyle = hexStr(0x5d4037);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + 22, headY + 8);
      ctx.lineTo(cx + 28, headY - 20);
      ctx.stroke();
      drawStar(ctx, cx + 28, headY - 22, 5, 8, 3, COLORS.lavender, COLORS.charcoal);

      // head
      drawChibiHead(ctx, {
        cx,
        cy: headY,
        radius: 17,
        bodyColor: 0xffe0b2,
        expression: 'neutral',
      });
      // wizard hat
      ctx.fillStyle = hexStr(0x4527a0);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 18, headY - 12);
      ctx.lineTo(cx, headY - 36);
      ctx.lineTo(cx + 18, headY - 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // hat brim
      ctx.fillStyle = hexStr(0x4527a0);
      ctx.beginPath();
      ctx.ellipse(cx, headY - 12, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // star on hat
      drawStar(ctx, cx, headY - 24, 5, 4, 2, COLORS.goldYellow);

      SpriteFactory.registerCanvas(scene, `tower_mage_${tier}`, canvas);
    }
  }

  private static makeCannonTower(scene: Phaser.Scene): void {
    for (let tier = 1; tier <= 3; tier++) {
      const size = 96;
      const pad = 16;
      const canvas = makeCanvas(size, size + pad);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, pad);
      const cx = size / 2;
      const by = size - 8;

      const tierColors = [0xa1887f, 0x8d6e63, 0x6d4c41];
      SpriteFactory.drawTowerBase(ctx, cx, by, 64, 60, tierColors[tier - 1], tier);

      const headY = by - 60;

      // squirrel body (acorn-like)
      ctx.fillStyle = hexStr(0xff8a65);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, headY + 16, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // tail (fluffy)
      ctx.fillStyle = hexStr(0xff8a65);
      ctx.beginPath();
      ctx.moveTo(cx - 16, headY + 4);
      ctx.bezierCurveTo(cx - 36, headY - 10, cx - 38, headY + 28, cx - 18, headY + 26);
      ctx.fill();
      ctx.stroke();

      // cannon (mounted on body)
      ctx.fillStyle = hexStr(0x424242);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      fillRoundedRect(ctx, cx + 8, headY + 4, 28, 12, 4);
      strokeRoundedRect(ctx, cx + 8, headY + 4, 28, 12, 4);
      ctx.beginPath();
      ctx.arc(cx + 36, headY + 10, 4, 0, Math.PI * 2);
      ctx.fillStyle = hexStr(0x212121);
      ctx.fill();

      // head
      drawChibiHead(ctx, {
        cx,
        cy: headY - 8,
        radius: 16,
        bodyColor: 0xffab91,
        expression: 'happy',
      });
      // ears
      ctx.fillStyle = hexStr(0xff8a65);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 11, headY - 22, 5, 8, -0.3, 0, Math.PI * 2);
      ctx.ellipse(cx + 11, headY - 22, 5, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      SpriteFactory.registerCanvas(scene, `tower_cannon_${tier}`, canvas);
    }
  }

  private static makeFrostTower(scene: Phaser.Scene): void {
    for (let tier = 1; tier <= 3; tier++) {
      const size = 96;
      const pad = 16;
      const canvas = makeCanvas(size, size + pad);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, pad);
      const cx = size / 2;
      const by = size - 8;

      const tierColors = [0xb3e5fc, 0x81d4fa, 0x4fc3f7];
      SpriteFactory.drawTowerBase(ctx, cx, by, 64, 60, tierColors[tier - 1], tier);

      const headY = by - 64;

      // crystal body (snowflake shape)
      ctx.save();
      ctx.translate(cx, headY + 18);
      ctx.fillStyle = hexStr(0xe1f5fe);
      ctx.strokeStyle = hexStr(0x0288d1);
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -22);
        ctx.lineTo(4, -16);
        ctx.lineTo(0, -22);
        ctx.lineTo(-4, -16);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // crystal core (head)
      drawChibiHead(ctx, {
        cx,
        cy: headY + 4,
        radius: 18,
        bodyColor: 0xb3e5fc,
        outlineColor: 0x0288d1,
        expression: 'happy',
        cheekColor: 0x81d4fa,
      });

      // ice crown
      ctx.fillStyle = hexStr(0xffffff);
      ctx.strokeStyle = hexStr(0x0288d1);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 14, headY - 8);
      ctx.lineTo(cx - 10, headY - 18);
      ctx.lineTo(cx - 4, headY - 12);
      ctx.lineTo(cx, headY - 22);
      ctx.lineTo(cx + 4, headY - 12);
      ctx.lineTo(cx + 10, headY - 18);
      ctx.lineTo(cx + 14, headY - 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      SpriteFactory.registerCanvas(scene, `tower_frost_${tier}`, canvas);
    }
  }

  // ---------------- Enemies ----------------
  private static generateEnemies(scene: Phaser.Scene): void {
    SpriteFactory.makeSlime(scene);
    SpriteFactory.makeWolf(scene);
    SpriteFactory.makeBat(scene);
    SpriteFactory.makeBear(scene);
    SpriteFactory.makeBoss(scene);
  }

  private static makeSlime(scene: Phaser.Scene): void {
    for (let f = 0; f < 2; f++) {
      const size = 64;
      const canvas = makeCanvas(size, size);
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2 + 4;
      const squish = f === 0 ? 0 : 4;

      // shadow
      ctx.fillStyle = hexStr(0x000000, 0.25);
      ctx.beginPath();
      ctx.ellipse(cx, size - 6, 20, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // body (rounded blob)
      ctx.fillStyle = hexStr(0x6a3eaa);
      ctx.strokeStyle = hexStr(0x2c1957);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy + 4 + squish);
      ctx.bezierCurveTo(cx - 24, cy - 22 + squish, cx + 24, cy - 22 + squish, cx + 22, cy + 4 + squish);
      ctx.bezierCurveTo(cx + 22, cy + 12, cx - 22, cy + 12, cx - 22, cy + 4 + squish);
      ctx.fill();
      ctx.stroke();

      // shine highlight
      ctx.fillStyle = hexStr(0xffffff, 0.4);
      ctx.beginPath();
      ctx.ellipse(cx - 6, cy - 8 + squish, 6, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // eyes (evil glow)
      ctx.fillStyle = hexStr(0xff5252);
      ctx.beginPath();
      ctx.arc(cx - 7, cy - 4 + squish, 3, 0, Math.PI * 2);
      ctx.arc(cx + 7, cy - 4 + squish, 3, 0, Math.PI * 2);
      ctx.fill();

      // angry mouth
      ctx.strokeStyle = hexStr(0x2c1957);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 6 + squish);
      ctx.lineTo(cx, cy + 4 + squish);
      ctx.lineTo(cx + 6, cy + 6 + squish);
      ctx.stroke();

      SpriteFactory.registerCanvas(scene, `enemy_slime_${f}`, canvas);
    }
  }

  private static makeWolf(scene: Phaser.Scene): void {
    for (let f = 0; f < 2; f++) {
      const size = 80;
      const canvas = makeCanvas(size, size);
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;

      // shadow
      ctx.fillStyle = hexStr(0x000000, 0.25);
      ctx.beginPath();
      ctx.ellipse(cx, size - 8, 24, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const bob = f === 0 ? 0 : -3;

      // body
      ctx.fillStyle = hexStr(0x4a148c);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 8 + bob, 28, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // legs
      const legY = cy + 22 + bob;
      ctx.fillStyle = hexStr(0x4a148c);
      [-18, -8, 8, 18].forEach((ox, i) => {
        const lift = (f === 0 ? i % 2 : (i + 1) % 2) === 0 ? 0 : -4;
        ctx.beginPath();
        ctx.ellipse(cx + ox, legY + lift, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // head
      drawChibiHead(ctx, {
        cx: cx + 18,
        cy: cy - 4 + bob,
        radius: 14,
        bodyColor: 0x4a148c,
        outlineColor: 0x12005e,
        expression: 'evil',
        cheekColor: 0x6a3eaa,
        eyeColor: 0x2c1957,
        eyeShine: false,
        blush: false,
      });

      // ears
      ctx.fillStyle = hexStr(0x4a148c);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - 16 + bob);
      ctx.lineTo(cx + 12, cy - 24 + bob);
      ctx.lineTo(cx + 16, cy - 16 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 22, cy - 16 + bob);
      ctx.lineTo(cx + 26, cy - 24 + bob);
      ctx.lineTo(cx + 30, cy - 16 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // tail
      ctx.fillStyle = hexStr(0x4a148c);
      ctx.beginPath();
      ctx.ellipse(cx - 24, cy + 4 + bob, 8, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      SpriteFactory.registerCanvas(scene, `enemy_wolf_${f}`, canvas);
    }
  }

  private static makeBat(scene: Phaser.Scene): void {
    for (let f = 0; f < 2; f++) {
      const size = 64;
      const canvas = makeCanvas(size, size);
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;

      // shadow on ground
      ctx.fillStyle = hexStr(0x000000, 0.2);
      ctx.beginPath();
      ctx.ellipse(cx, size - 6, 14, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      const wingFlap = f === 0 ? 0 : -6;

      // wings
      ctx.fillStyle = hexStr(0x4a148c);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 24, cy - 10 + wingFlap);
      ctx.lineTo(cx - 22, cy - 2 + wingFlap);
      ctx.lineTo(cx - 18, cy + 6 + wingFlap);
      ctx.lineTo(cx - 12, cy + 2 + wingFlap);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 24, cy - 10 + wingFlap);
      ctx.lineTo(cx + 22, cy - 2 + wingFlap);
      ctx.lineTo(cx + 18, cy + 6 + wingFlap);
      ctx.lineTo(cx + 12, cy + 2 + wingFlap);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // body / head
      drawChibiHead(ctx, {
        cx,
        cy: cy - 2,
        radius: 12,
        bodyColor: 0x4a148c,
        outlineColor: 0x12005e,
        expression: 'evil',
        cheekColor: 0x6a3eaa,
        eyeShine: false,
        blush: false,
      });

      // ears (pointy)
      ctx.fillStyle = hexStr(0x4a148c);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 12);
      ctx.lineTo(cx - 4, cy - 22);
      ctx.lineTo(cx - 1, cy - 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 6, cy - 12);
      ctx.lineTo(cx + 4, cy - 22);
      ctx.lineTo(cx + 1, cy - 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      SpriteFactory.registerCanvas(scene, `enemy_bat_${f}`, canvas);
    }
  }

  private static makeBear(scene: Phaser.Scene): void {
    for (let f = 0; f < 2; f++) {
      const size = 96;
      const canvas = makeCanvas(size, size);
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;
      const bob = f === 0 ? 0 : -2;

      // shadow
      ctx.fillStyle = hexStr(0x000000, 0.25);
      ctx.beginPath();
      ctx.ellipse(cx, size - 6, 32, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // body (chunky)
      ctx.fillStyle = hexStr(0x311b92);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 14 + bob, 32, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // legs
      [-20, 20].forEach((ox) => {
        ctx.beginPath();
        ctx.ellipse(cx + ox, cy + 32 + bob, 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // head
      drawChibiHead(ctx, {
        cx,
        cy: cy - 8 + bob,
        radius: 22,
        bodyColor: 0x311b92,
        outlineColor: 0x12005e,
        expression: 'angry',
        cheekColor: 0x6a3eaa,
        eyeShine: false,
        blush: false,
      });

      // ears (round)
      ctx.fillStyle = hexStr(0x311b92);
      ctx.strokeStyle = hexStr(0x12005e);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 18, cy - 24 + bob, 8, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy - 24 + bob, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // claws hint
      ctx.fillStyle = hexStr(0xffffff);
      [-22, 22].forEach((ox) => {
        for (let c = -1; c <= 1; c++) {
          ctx.beginPath();
          ctx.arc(cx + ox + c * 3, cy + 38 + bob, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      SpriteFactory.registerCanvas(scene, `enemy_bear_${f}`, canvas);
    }
  }

  private static makeBoss(scene: Phaser.Scene): void {
    for (let f = 0; f < 2; f++) {
      const size = 128;
      const canvas = makeCanvas(size, size);
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;
      const bob = f === 0 ? 0 : -3;

      // shadow
      ctx.fillStyle = hexStr(0x000000, 0.3);
      ctx.beginPath();
      ctx.ellipse(cx, size - 6, 44, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // dark cloak/body
      ctx.fillStyle = hexStr(0x1a0033);
      ctx.strokeStyle = hexStr(0x000000);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 36, cy + 12 + bob);
      ctx.lineTo(cx - 50, cy + 50 + bob);
      ctx.lineTo(cx + 50, cy + 50 + bob);
      ctx.lineTo(cx + 36, cy + 12 + bob);
      ctx.bezierCurveTo(cx + 30, cy - 10 + bob, cx - 30, cy - 10 + bob, cx - 36, cy + 12 + bob);
      ctx.fill();
      ctx.stroke();

      // glowing aura
      ctx.fillStyle = hexStr(0xff5252, 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy - 18 + bob, 36, 0, Math.PI * 2);
      ctx.fill();

      // skull head
      drawChibiHead(ctx, {
        cx,
        cy: cy - 18 + bob,
        radius: 28,
        bodyColor: 0x4a148c,
        outlineColor: 0x000000,
        expression: 'evil',
        eyeColor: 0x000000,
        eyeShine: false,
        blush: false,
        cheekColor: 0x6a3eaa,
      });

      // crown
      ctx.fillStyle = hexStr(0xb71c1c);
      ctx.strokeStyle = hexStr(0x000000);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy - 38 + bob);
      ctx.lineTo(cx - 16, cy - 50 + bob);
      ctx.lineTo(cx - 8, cy - 42 + bob);
      ctx.lineTo(cx, cy - 56 + bob);
      ctx.lineTo(cx + 8, cy - 42 + bob);
      ctx.lineTo(cx + 16, cy - 50 + bob);
      ctx.lineTo(cx + 22, cy - 38 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      drawStar(ctx, cx, cy - 48 + bob, 5, 4, 2, 0xff5252);

      SpriteFactory.registerCanvas(scene, `enemy_boss_${f}`, canvas);
    }
  }

  // ---------------- Projectiles ----------------
  private static generateProjectiles(scene: Phaser.Scene): void {
    // Arrow
    {
      const canvas = makeCanvas(28, 8);
      const ctx = canvas.getContext('2d')!;
      ctx.strokeStyle = hexStr(0x5d4037);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2, 4);
      ctx.lineTo(20, 4);
      ctx.stroke();
      ctx.fillStyle = hexStr(0xbdbdbd);
      ctx.beginPath();
      ctx.moveTo(20, 4);
      ctx.lineTo(26, 0);
      ctx.lineTo(26, 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = hexStr(0xef9a9a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(6, 4);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'proj_arrow', canvas);
    }

    // Magic Bolt
    {
      const canvas = makeCanvas(20, 20);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(COLORS.lavender);
      ctx.beginPath();
      ctx.arc(10, 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexStr(0xffffff);
      ctx.beginPath();
      ctx.arc(8, 8, 3, 0, Math.PI * 2);
      ctx.fill();
      drawStar(ctx, 10, 10, 5, 9, 4, COLORS.lavender, 0x4527a0);
      SpriteFactory.registerCanvas(scene, 'proj_magicBolt', canvas);
    }

    // Cannonball
    {
      const canvas = makeCanvas(20, 20);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0x424242);
      ctx.beginPath();
      ctx.arc(10, 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexStr(0x000000);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = hexStr(0xffffff, 0.5);
      ctx.beginPath();
      ctx.arc(7, 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'proj_cannonball', canvas);
    }

    // Frost shard
    {
      const canvas = makeCanvas(20, 20);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0xe1f5fe);
      ctx.strokeStyle = hexStr(0x0288d1);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(14, 10);
      ctx.lineTo(10, 18);
      ctx.lineTo(6, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexStr(0xffffff);
      ctx.beginPath();
      ctx.arc(9, 8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'proj_frostShard', canvas);
    }
  }

  // ---------------- UI ----------------
  private static generateUI(scene: Phaser.Scene): void {
    // Heart icon
    {
      const canvas = makeCanvas(32, 34);
      const ctx = canvas.getContext('2d')!;
      drawHeart(ctx, 16, 3, 28, 0xef5350, 0xb71c1c);
      SpriteFactory.registerCanvas(scene, 'ui_heart', canvas);
    }
    // Coin
    {
      const canvas = makeCanvas(28, 28);
      const ctx = canvas.getContext('2d')!;
      drawCoin(ctx, 14, 14, 11);
      SpriteFactory.registerCanvas(scene, 'ui_coin', canvas);
    }
    // Wave icon (sparkle)
    {
      const canvas = makeCanvas(28, 28);
      const ctx = canvas.getContext('2d')!;
      drawStar(ctx, 14, 14, 5, 12, 5, 0xfff176, COLORS.charcoal);
      SpriteFactory.registerCanvas(scene, 'ui_wave', canvas);
    }
    // Meteor icon
    {
      const canvas = makeCanvas(40, 40);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0xff6f00);
      ctx.beginPath();
      ctx.arc(20, 22, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexStr(0xffeb3b);
      ctx.beginPath();
      ctx.arc(17, 19, 5, 0, Math.PI * 2);
      ctx.fill();
      // trail
      ctx.strokeStyle = hexStr(0xffab00);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 22);
      ctx.lineTo(2, 4);
      ctx.stroke();
      SpriteFactory.registerCanvas(scene, 'ui_meteor', canvas);
    }
    // Heal icon
    {
      const canvas = makeCanvas(40, 40);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0xffffff);
      ctx.strokeStyle = hexStr(0x4caf50);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(20, 20, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexStr(0x4caf50);
      ctx.fillRect(17, 10, 6, 20);
      ctx.fillRect(10, 17, 20, 6);
      SpriteFactory.registerCanvas(scene, 'ui_heal', canvas);
    }
    // Generic button (rounded panel)
    {
      const canvas = makeCanvas(220, 64);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(COLORS.cream);
      fillRoundedRect(ctx, 4, 4, 212, 56, 28);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 3;
      strokeRoundedRect(ctx, 4, 4, 212, 56, 28);
      SpriteFactory.registerCanvas(scene, 'ui_button', canvas);
    }
    // Panel bg
    {
      const canvas = makeCanvas(280, 320);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(COLORS.cream, 0.95);
      fillRoundedRect(ctx, 4, 4, 272, 312, 16);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 3;
      strokeRoundedRect(ctx, 4, 4, 272, 312, 16);
      SpriteFactory.registerCanvas(scene, 'ui_panel', canvas);
    }
    // HUD strip bg
    {
      const canvas = makeCanvas(1280, 56);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(COLORS.cream, 0.9);
      ctx.fillRect(0, 0, 1280, 56);
      ctx.strokeStyle = hexStr(COLORS.charcoal);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 56);
      ctx.lineTo(1280, 56);
      ctx.stroke();
      SpriteFactory.registerCanvas(scene, 'ui_hud_strip', canvas);
    }
  }

  // ---------------- Tiles ----------------
  private static generateTiles(scene: Phaser.Scene): void {
    // Build spot
    {
      const canvas = makeCanvas(64, 64);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(COLORS.cream, 0.6);
      ctx.beginPath();
      ctx.arc(32, 32, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexStr(COLORS.charcoal, 0.5);
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = hexStr(COLORS.charcoal, 0.4);
      ctx.font = 'bold 28px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', 32, 34);
      SpriteFactory.registerCanvas(scene, 'tile_buildspot', canvas);
    }
    // Range circle
    {
      const canvas = makeCanvas(400, 400);
      const ctx = canvas.getContext('2d')!;
      ctx.strokeStyle = hexStr(COLORS.cream);
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(200, 200, 196, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = hexStr(COLORS.cream, 0.1);
      ctx.beginPath();
      ctx.arc(200, 200, 196, 0, Math.PI * 2);
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'tile_range', canvas);
    }
  }

  // ---------------- Particles ----------------
  private static generateParticles(scene: Phaser.Scene): void {
    // Sparkle
    {
      const canvas = makeCanvas(16, 16);
      const ctx = canvas.getContext('2d')!;
      drawStar(ctx, 8, 8, 4, 7, 2, 0xffeb3b);
      SpriteFactory.registerCanvas(scene, 'fx_sparkle', canvas);
    }
    // Smoke puff
    {
      const canvas = makeCanvas(20, 20);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0xeeeeee, 0.8);
      ctx.beginPath();
      ctx.arc(10, 10, 8, 0, Math.PI * 2);
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'fx_smoke', canvas);
    }
    // Coin pop
    {
      const canvas = makeCanvas(16, 16);
      const ctx = canvas.getContext('2d')!;
      drawCoin(ctx, 8, 8, 6);
      SpriteFactory.registerCanvas(scene, 'fx_coin', canvas);
    }
    // Frost mist
    {
      const canvas = makeCanvas(24, 24);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = hexStr(0xb3e5fc, 0.7);
      ctx.beginPath();
      ctx.arc(12, 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexStr(0xffffff, 0.6);
      ctx.beginPath();
      ctx.arc(9, 9, 4, 0, Math.PI * 2);
      ctx.fill();
      SpriteFactory.registerCanvas(scene, 'fx_frost', canvas);
    }
  }
}

