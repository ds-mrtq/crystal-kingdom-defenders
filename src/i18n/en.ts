import type { Translations } from './I18n';

export const en: Translations = {
  menu: {
    title: 'Crystal Kingdom',
    subtitle: 'D E F E N D E R S',
    play: '▶  PLAY',
    levelSelect: '⭐  Level Select',
    settings: '⚙   Settings',
    copyright: 'v1.0  © Crystal Kingdom Studios',
  },
  settings: {
    title: 'Settings',
    soundOn: '🔊 Sound: ON',
    soundOff: '🔇 Sound: OFF',
    resetProgress: '🗑  Reset Progress',
    confirmReset: 'Click again to confirm',
    progressReset: '✓ Progress reset',
    close: 'Close',
    langLabel: '🌐 Language: EN',
  },
  levelSelect: {
    title: '✦ Crystal Kingdom Map ✦',
    back: '← Back',
    startLevel: '▶ START LEVEL',
    locked: 'Level locked. Beat previous level to unlock.',
    lockedBtn: '🔒 LOCKED',
  },
  ui: {
    wave: 'Wave',
    pause: '⏸ Pause',
    resume: '▶ Resume',
    sendWave: '▶ Send Wave',
    waveActive: 'active...',
    meteor: 'Meteor',
    heal: 'Heal',
    buildTower: 'Build Tower',
    cancel: '✕ Cancel',
    tier: 'Tier',
    upgrade: '⬆ Upgrade',
    maxTier: '⭐ MAX TIER',
    sell: 'Sell',
    close: '✕ Close',
  },
  game: {
    start: 'START',
  },
  story: {
    victory: 'Victory',
    continue: '▼ Click to continue',
    skip: 'Skip ⏭',
  },
  result: {
    victory: '✨ VICTORY ✨',
    defeat: '☠ DEFEAT ☠',
    lives: 'Lives',
    nextLevel: '→ Next Level',
    worldMap: '🗺 World Map',
    retry: '↻ Retry',
  },
  levels: {
    1: {
      name: 'Whispering Forest',
      storyIntro: [
        'Princess Lumi: "The whispering trees... they\'re crying out!"',
        'A wave of Shadow Slimes oozes from the corrupted brook.',
        'Mochi the Bunny Archer: "Don\'t worry Princess, my arrows are ready!"',
        'Defend the Forest Crystal Shrine!',
      ],
      storyOutro: [
        'The Forest Shrine glows softly again. The trees breathe.',
        'Princess Lumi: "One down. Four to go. To the foothills!"',
      ],
    },
    2: {
      name: 'Crimson Foothills',
      storyIntro: [
        'The hills run red with shadow. Wolves howl in unnatural unison.',
        'Pebble the Acorn Bombardier: "I brought my biggest cannon, Princess!"',
        'New ally unlocked: Cannon Tower (Splash damage, ground only).',
      ],
      storyOutro: [
        'The hills regain their golden hue. The wolves return to gentle yips.',
        'Princess Lumi: "Frostpeak is next... bundle up, everyone!"',
      ],
    },
    3: {
      name: 'Frostpeak Pass',
      storyIntro: [
        'Snow falls black with corruption. Massive shadow shapes lumber forward.',
        'Sir Pip the Knight Hamster: "Squeak! I shall hold the line, Princess!"',
        'Tip: Mage and Cannon towers excel against tanky Shadow Bears.',
      ],
      storyOutro: [
        'The Frostpeak Shrine sings a clear bell-tone. The snow turns white again.',
        'Princess Lumi: "Look up... the Skyspire is hidden in shadow."',
      ],
    },
    4: {
      name: 'Skyspire Ruins',
      storyIntro: [
        'Wings beat the corrupted wind. Shadow Bats flock in unholy spirals.',
        'Princess Lumi: "Bombs won\'t reach them! Use Archer, Mage, or Frost!"',
        'Reminder: Cannon Tower CANNOT hit flying enemies.',
      ],
      storyOutro: [
        'The bats flee. The Skyspire glimmers like a lantern.',
        'Princess Lumi: "One shrine left... and the Shadow King himself awaits."',
      ],
    },
    5: {
      name: 'Throne of Night',
      storyIntro: [
        'The Throne of Night looms. The air is thick with corruption.',
        'Shadow King: "Foolish princess... your sparkles cannot dim my eternal night."',
        'Princess Lumi: "Then watch what sparkles can do."',
        'Final battle. All enemy types. Boss at Wave 10.',
      ],
      storyOutro: [
        'The Shadow King falls. Light pours through the kingdom.',
        'Princess Lumi: "Thank you, my friends. The kingdom is safe... for now."',
        '✨ Crystal Kingdom restored. ✨',
      ],
    },
  },
  towers: {
    archer: { name: 'Mochi Bunny Archer', description: 'Fast single-target. Hits flying.' },
    mage: { name: 'Star Mage Kira', description: 'Splash magic damage. Hits flying.' },
    cannon: { name: 'Acorn Bombardier Pebble', description: 'High splash damage. Ground only.' },
    frost: { name: 'Glacier Sprite', description: 'Slows enemies. Hits flying.' },
  },
  enemies: {
    slime: { name: 'Shadow Slime' },
    wolf: { name: 'Shadow Wolf' },
    bat: { name: 'Shadow Bat' },
    bear: { name: 'Shadow Bear' },
    boss: { name: 'Shadow King' },
  },
};
