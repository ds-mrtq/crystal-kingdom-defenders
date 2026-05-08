import Phaser from 'phaser';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 64;

export const COLORS = {
  sky: 0xb3e5fc,
  mint: 0xc8e6c9,
  peach: 0xffccbc,
  lavender: 0xd1c4e9,
  yellow: 0xfff59d,
  cherry: 0xef9a9a,
  plum: 0x4a148c,
  cream: 0xfff8e1,
  charcoal: 0x424242,
  white: 0xffffff,
  black: 0x000000,
  shadowDark: 0x2c1957,
  shadowMid: 0x6a3eaa,
  forestGreen: 0x66bb6a,
  pathTan: 0xd7ccc8,
  pathDark: 0xa1887f,
  goldYellow: 0xffd54f,
  hpRed: 0xe53935,
  hpGreen: 0x66bb6a,
} as const;

export function makePhaserConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#B3E5FC',
    pixelArt: false,
    antialias: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    fps: { target: 60, forceSetTimeOut: false },
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    render: {
      roundPixels: false,
      antialiasGL: true,
    },
  };
}
