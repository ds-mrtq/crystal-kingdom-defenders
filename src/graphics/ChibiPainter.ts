/**
 * Drawing helpers for chibi-style characters.
 * All operations work on a 2D canvas context.
 *
 * Chibi design rules applied:
 *  - 2-2.5 head body height
 *  - Oversized eyes (~25% of face width)
 *  - Soft rounded shapes, no sharp angles
 *  - Strong outlines (2-3px charcoal)
 *  - Bright saturated colors
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRGB(hex: number): RGB {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
  };
}

export function rgbStr({ r, g, b }: RGB, alpha = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexStr(hex: number, alpha = 1): string {
  return rgbStr(hexToRGB(hex), alpha);
}

export function darken(hex: number, factor = 0.7): number {
  const { r, g, b } = hexToRGB(hex);
  return (
    (Math.floor(r * factor) << 16) | (Math.floor(g * factor) << 8) | Math.floor(b * factor)
  );
}

export function lighten(hex: number, factor = 1.2): number {
  const { r, g, b } = hexToRGB(hex);
  return (
    (Math.min(255, Math.floor(r * factor)) << 16) |
    (Math.min(255, Math.floor(g * factor)) << 8) |
    Math.min(255, Math.floor(b * factor))
  );
}

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export interface ChibiHeadOptions {
  cx: number;
  cy: number;
  radius: number;
  bodyColor: number; // skin/fur color
  outlineColor?: number;
  cheekColor?: number;
  eyeColor?: number;
  expression?: 'happy' | 'angry' | 'sleepy' | 'evil' | 'neutral';
  eyeShine?: boolean;
  blush?: boolean;
}

export function drawChibiHead(ctx: CanvasRenderingContext2D, opt: ChibiHeadOptions): void {
  const {
    cx,
    cy,
    radius,
    bodyColor,
    outlineColor = 0x424242,
    cheekColor = 0xff8a80,
    eyeColor = 0x212121,
    expression = 'happy',
    eyeShine = true,
    blush = true,
  } = opt;

  // head (slightly oval, wider than tall by tiny amount)
  ctx.fillStyle = hexStr(bodyColor);
  ctx.strokeStyle = hexStr(outlineColor);
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 1.05, radius, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // subtle shading on lower-right cheek
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = hexStr(darken(bodyColor, 0.6));
  ctx.beginPath();
  ctx.ellipse(cx + radius * 0.3, cy + radius * 0.45, radius * 0.45, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // eyes
  const eyeY = cy + radius * 0.05;
  const eyeOffsetX = radius * 0.38;
  const eyeRX = radius * 0.22;
  const eyeRY = radius * 0.3;

  ctx.fillStyle = hexStr(eyeColor);

  if (expression === 'sleepy') {
    // closed curved lines
    ctx.strokeStyle = hexStr(eyeColor);
    ctx.lineWidth = Math.max(2, radius * 0.08);
    ctx.beginPath();
    ctx.arc(cx - eyeOffsetX, eyeY, eyeRX, 0, Math.PI);
    ctx.moveTo(cx + eyeOffsetX + eyeRX, eyeY);
    ctx.arc(cx + eyeOffsetX, eyeY, eyeRX, 0, Math.PI);
    ctx.stroke();
  } else if (expression === 'angry' || expression === 'evil') {
    // angled eyes
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffsetX, eyeY, eyeRX, eyeRY, -0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeOffsetX, eyeY, eyeRX, eyeRY, 0.3, 0, Math.PI * 2);
    ctx.fill();
    if (expression === 'evil') {
      // glowing red dots
      ctx.fillStyle = hexStr(0xff5252);
      ctx.beginPath();
      ctx.arc(cx - eyeOffsetX, eyeY, eyeRX * 0.5, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffsetX, eyeY, eyeRX * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // happy/neutral big round eyes
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffsetX, eyeY, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeOffsetX, eyeY, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.fill();

    if (eyeShine) {
      ctx.fillStyle = hexStr(0xffffff);
      ctx.beginPath();
      ctx.arc(cx - eyeOffsetX + eyeRX * 0.3, eyeY - eyeRY * 0.3, eyeRX * 0.35, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffsetX + eyeRX * 0.3, eyeY - eyeRY * 0.3, eyeRX * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // mouth
  ctx.strokeStyle = hexStr(outlineColor);
  ctx.lineWidth = Math.max(1.5, radius * 0.06);
  ctx.beginPath();
  if (expression === 'angry' || expression === 'evil') {
    ctx.moveTo(cx - radius * 0.18, cy + radius * 0.45);
    ctx.lineTo(cx + radius * 0.18, cy + radius * 0.45);
  } else if (expression === 'sleepy') {
    ctx.arc(cx, cy + radius * 0.45, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = hexStr(0xef9a9a);
    ctx.fill();
  } else {
    // smile arc
    ctx.arc(cx, cy + radius * 0.32, radius * 0.18, 0.15 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();

  // cheeks
  if (blush && expression !== 'evil' && expression !== 'angry') {
    ctx.fillStyle = hexStr(cheekColor, 0.55);
    ctx.beginPath();
    ctx.arc(cx - radius * 0.6, cy + radius * 0.32, radius * 0.16, 0, Math.PI * 2);
    ctx.arc(cx + radius * 0.6, cy + radius * 0.32, radius * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface ChibiBodyOptions {
  cx: number;
  cy: number;
  width: number;
  height: number;
  bodyColor: number;
  outlineColor?: number;
}

export function drawChibiBody(ctx: CanvasRenderingContext2D, opt: ChibiBodyOptions): void {
  const { cx, cy, width, height, bodyColor, outlineColor = 0x424242 } = opt;
  ctx.fillStyle = hexStr(bodyColor);
  ctx.strokeStyle = hexStr(outlineColor);
  ctx.lineWidth = Math.max(2, width * 0.06);
  // capsule body
  ctx.beginPath();
  ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // shadow underbelly
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = hexStr(darken(bodyColor, 0.6));
  ctx.beginPath();
  ctx.ellipse(cx, cy + height * 0.25, width * 0.42, height * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: number,
  outline?: number,
): void {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = hexStr(color);
  ctx.fill();
  if (outline !== undefined) {
    ctx.strokeStyle = hexStr(outline);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: number,
  outline?: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 16, size / 16);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(0, -2, -8, -2, -8, 4);
  ctx.bezierCurveTo(-8, 8, 0, 12, 0, 16);
  ctx.bezierCurveTo(0, 12, 8, 8, 8, 4);
  ctx.bezierCurveTo(8, -2, 0, -2, 0, 4);
  ctx.closePath();
  ctx.fillStyle = hexStr(color);
  ctx.fill();
  if (outline !== undefined) {
    ctx.strokeStyle = hexStr(outline);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawCoin(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fillStyle = hexStr(0xffd54f);
  ctx.fill();
  ctx.strokeStyle = hexStr(0xfbc02d);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = hexStr(0xffeb3b);
  ctx.beginPath();
  ctx.arc(cx - size * 0.25, cy - size * 0.25, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `bold ${Math.floor(size)}px Fredoka, sans-serif`;
  ctx.fillStyle = hexStr(0xfbc02d);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', cx, cy + 1);
}

export function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

export function strokeRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.stroke();
}
