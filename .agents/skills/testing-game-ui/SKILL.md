---
name: testing-game-ui
description: Test Crystal Kingdom Defenders game UI end-to-end. Use when verifying UI changes, i18n, sprite rendering, or gameplay flow.
---

# Testing Crystal Kingdom Defenders

## Dev Server Setup

```bash
cd /home/ubuntu/repos/crystal-kingdom-defenders
npm install
npm run dev
# Runs on http://localhost:5174/
```

No backend or Docker required — pure client-side Vite app.

## Scene Navigation Flow

The game follows this scene flow:

```
Boot → Menu → LevelSelect → Story → Game (+UIScene overlay) → Result
```

- **Menu**: Title screen with PLAY, Level Select, Settings buttons
- **Settings modal**: Opens over Menu — has Language toggle, Sound toggle, Reset Progress
- **Level Select**: World map with 5 level nodes connected by a path. Click a node to see details + start button
- **Story**: Dialogue cutscene before/after each level. Has Skip button (top-right) and click-to-advance
- **Game + UIScene**: Tower defense gameplay. UIScene is an overlay with HUD (wave counter, pause, speed controls) and bottom action bar (Send Wave, Meteor, Heal)
- **Result**: Victory/defeat screen with retry, next level, world map buttons

## Key Test Flows

### 1. Bilingual Toggle (i18n)
- Open Settings from Menu → click "Language: EN" / "Ngôn ngữ: VI" button
- Scene restarts automatically with new language
- Verify text changes in: Menu title/buttons, Level Select (header, node labels, detail panel, start button), Story (title, dialogue, skip, continue), Game HUD (wave, pause, send wave, meteor, heal), Tower Shop (title, tower names, cancel), Upgrade Panel (tower name, tier, upgrade, sell, close), Result (victory/defeat, buttons)
- Language persists in `localStorage` key `ckd_lang` — verify with page refresh
- To reset: `localStorage.removeItem('ckd_lang')` in browser console

### 2. Sprite Rendering
- Tower sprites: Check ears/hats are not clipped at top (bunny ears, wizard hat point+star, ice crown spikes, squirrel ears)
- Princess Lumi: Check twin tails at sides and wand star are not clipped (appears on Menu and Story scenes)
- Heart icon: Check bottom point is not truncated (visible in gameplay HUD)
- All sprites are procedurally generated via Canvas API — clipping issues come from canvas dimensions being too small

### 3. Core Gameplay
- Click build spots (dashed circles) to open tower shop
- Buy a tower → verify it appears on the spot
- Click placed tower → verify upgrade panel shows with stats, upgrade/sell buttons
- Click "Send Wave" → enemies spawn and walk the path
- Towers auto-fire at enemies in range
- Speed controls (1x/2x/3x) in top-right HUD bar

## Common Gotchas

- **Level node labels**: When testing i18n, the level node labels on the world map use a different code path than the detail panel. Both must call `I18n.get().level(id).name` — if one uses `lvl.name` from config, it stays in English.
- **Scene restart on language toggle**: Text objects in Phaser don't auto-update. The toggle calls `this.scene.restart()` to recreate all text. If a scene doesn't restart, text won't update.
- **Only Level 1 is unlocked by default**: To test other levels, either play through or modify `localStorage` save data.
- **No CI configured**: Only local lint (`npm run lint`) and typecheck (`npx tsc --noEmit`) are available.

## Build & Lint

```bash
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript type checking
npm run build       # Production build to ./dist
```

## Devin Secrets Needed

None — no authentication or API keys required. The game is a fully client-side static web app.
