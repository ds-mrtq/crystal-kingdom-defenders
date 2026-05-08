import type { SaveData } from '../types';

const SAVE_KEY = 'ckd_save_v1';

const DEFAULT_SAVE: SaveData = {
  unlockedLevels: [1],
  levelStars: {},
  totalGold: 0,
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.7,
    speedDefault: 1,
  },
  lastPlayedLevel: 1,
};

export class SaveSystem {
  private static instance: SaveSystem | null = null;
  private data: SaveData;

  private constructor() {
    this.data = this.load();
  }

  static get(): SaveSystem {
    if (!SaveSystem.instance) {
      SaveSystem.instance = new SaveSystem();
    }
    return SaveSystem.instance;
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...DEFAULT_SAVE, settings: { ...DEFAULT_SAVE.settings } };
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings ?? {}) },
        unlockedLevels: parsed.unlockedLevels ?? DEFAULT_SAVE.unlockedLevels,
        levelStars: parsed.levelStars ?? {},
      };
    } catch {
      return { ...DEFAULT_SAVE, settings: { ...DEFAULT_SAVE.settings } };
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn('Failed to save', err);
    }
  }

  getData(): SaveData {
    return this.data;
  }

  isLevelUnlocked(id: number): boolean {
    return this.data.unlockedLevels.includes(id);
  }

  getLevelStars(id: number): number {
    return this.data.levelStars[id] ?? 0;
  }

  recordLevelComplete(levelId: number, stars: number): void {
    if (!this.data.unlockedLevels.includes(levelId)) {
      this.data.unlockedLevels.push(levelId);
    }
    if (stars > (this.data.levelStars[levelId] ?? 0)) {
      this.data.levelStars[levelId] = stars;
    }
    if (!this.data.unlockedLevels.includes(levelId + 1)) {
      this.data.unlockedLevels.push(levelId + 1);
    }
    this.data.lastPlayedLevel = levelId;
    this.persist();
  }

  setLastPlayed(levelId: number): void {
    this.data.lastPlayedLevel = levelId;
    this.persist();
  }

  updateSettings(partial: Partial<SaveData['settings']>): void {
    this.data.settings = { ...this.data.settings, ...partial };
    this.persist();
  }

  resetProgress(): void {
    this.data = { ...DEFAULT_SAVE, settings: { ...DEFAULT_SAVE.settings } };
    this.persist();
  }

  totalStars(): number {
    return Object.values(this.data.levelStars).reduce((a, b) => a + b, 0);
  }
}
