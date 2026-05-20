import { en } from './en';
import { vi } from './vi';

export type Language = 'en' | 'vi';

export interface LevelTranslations {
  name: string;
  storyIntro: string[];
  storyOutro: string[];
}

export interface Translations {
  menu: {
    title: string;
    subtitle: string;
    play: string;
    levelSelect: string;
    settings: string;
    copyright: string;
  };
  settings: {
    title: string;
    soundOn: string;
    soundOff: string;
    resetProgress: string;
    confirmReset: string;
    progressReset: string;
    close: string;
    langLabel: string;
  };
  levelSelect: {
    title: string;
    back: string;
    startLevel: string;
    locked: string;
    lockedBtn: string;
  };
  ui: {
    wave: string;
    pause: string;
    resume: string;
    sendWave: string;
    waveActive: string;
    meteor: string;
    heal: string;
    buildTower: string;
    cancel: string;
    tier: string;
    upgrade: string;
    maxTier: string;
    sell: string;
    close: string;
  };
  game: {
    start: string;
  };
  story: {
    victory: string;
    continue: string;
    skip: string;
  };
  result: {
    victory: string;
    defeat: string;
    lives: string;
    nextLevel: string;
    worldMap: string;
    retry: string;
  };
  levels: Record<number, LevelTranslations>;
  towers: Record<string, { name: string; description: string }>;
  enemies: Record<string, { name: string }>;
}

const LANG_KEY = 'ckd_lang';

const packs: Record<Language, Translations> = { en, vi };

class I18nManager {
  private static instance: I18nManager | null = null;
  private lang: Language;

  private constructor() {
    this.lang = this.loadLang();
  }

  static get(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  private loadLang(): Language {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'en' || stored === 'vi') return stored;
    } catch {
      // ignore
    }
    return 'en';
  }

  private persist(): void {
    try {
      localStorage.setItem(LANG_KEY, this.lang);
    } catch {
      // ignore
    }
  }

  getLang(): Language {
    return this.lang;
  }

  setLang(lang: Language): void {
    this.lang = lang;
    this.persist();
  }

  toggle(): Language {
    this.lang = this.lang === 'en' ? 'vi' : 'en';
    this.persist();
    return this.lang;
  }

  t(): Translations {
    return packs[this.lang];
  }

  level(id: number): LevelTranslations {
    return packs[this.lang].levels[id] ?? packs.en.levels[id];
  }

  tower(kind: string): { name: string; description: string } {
    return packs[this.lang].towers[kind] ?? packs.en.towers[kind];
  }

  enemy(kind: string): { name: string } {
    return packs[this.lang].enemies[kind] ?? packs.en.enemies[kind];
  }
}

export const I18n = I18nManager;
