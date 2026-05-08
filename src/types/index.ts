export type TowerKind = 'archer' | 'mage' | 'cannon' | 'frost';
export type EnemyKind = 'slime' | 'wolf' | 'bat' | 'bear' | 'boss';
export type ProjectileKind = 'arrow' | 'magicBolt' | 'cannonball' | 'frostShard';
export type Biome = 'forest' | 'hills' | 'frost' | 'sky' | 'throne';

export interface Vec2 {
  x: number;
  y: number;
}

export interface BuildSpot {
  x: number;
  y: number;
}

export interface TowerStats {
  damage: number;
  range: number;
  fireRate: number; // shots per second
  cost: number;
  splashRadius?: number;
  slowFactor?: number; // 0.5 = 50% speed
  slowDuration?: number; // ms
  hitsFlying: boolean;
  projectile: ProjectileKind;
  projectileSpeed: number;
  color: number;
}

export interface TowerDef {
  kind: TowerKind;
  name: string;
  description: string;
  tiers: TowerStats[]; // index 0 = tier 1
  sellRefundRatio: number;
}

export interface EnemyStats {
  maxHp: number;
  speed: number; // pixels per second
  goldReward: number;
  damageOnLeak: number;
  isFlying: boolean;
  scale: number;
  color: number;
}

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  stats: EnemyStats;
}

export interface EnemySpawn {
  kind: EnemyKind;
  count: number;
  spawnInterval: number; // ms between spawns
}

export interface WaveDef {
  index: number;
  spawns: EnemySpawn[];
  startGoldBonus?: number;
}

export interface LevelDef {
  id: number;
  name: string;
  biome: Biome;
  pathWaypoints: Vec2[];
  buildSpots: BuildSpot[];
  startGold: number;
  startLives: number;
  waves: WaveDef[];
  storyIntro: string[];
  storyOutro: string[];
  bgGradient: [number, number]; // start, end colors
}

export interface SaveData {
  unlockedLevels: number[];
  levelStars: Record<number, number>;
  totalGold: number;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    speedDefault: 1 | 2 | 3;
  };
  lastPlayedLevel: number;
}

export interface LevelResult {
  levelId: number;
  victory: boolean;
  remainingLives: number;
  startLives: number;
  stars: number;
}
