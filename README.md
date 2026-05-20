# Crystal Kingdom Defenders

> A **chibi-style 2D tower defense game** that runs entirely in the browser — no installation, no backend required.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-3.80-8E44AD?logo=phaser)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
[![Deploy to Pages](https://github.com/ds-mrtq/crystal-kingdom-defenders/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ds-mrtq/crystal-kingdom-defenders/actions/workflows/deploy-pages.yml)
[![Docker GHCR](https://github.com/ds-mrtq/crystal-kingdom-defenders/actions/workflows/docker-ghcr.yml/badge.svg)](https://github.com/ds-mrtq/crystal-kingdom-defenders/actions/workflows/docker-ghcr.yml)

## Play Now

> **[https://ds-mrtq.github.io/crystal-kingdom-defenders/](https://ds-mrtq.github.io/crystal-kingdom-defenders/)**

Or pull the Docker image:

```bash
docker run --rm -p 8080:8080 ghcr.io/ds-mrtq/crystal-kingdom-defenders:latest
# Open http://localhost:8080/
```

---

## About

**Princess Lumi**, heir of House Crystalwood, must summon four chibi companions to defend the **Five Crystal Temples** from the Shadow King's dark army across five lands:

Whispering Forest &rarr; Crimson Hills &rarr; Frostpeak Pass &rarr; Skyspire Ruins &rarr; Throne of Night

### Key Features

- **100% procedural chibi graphics** &mdash; every sprite is generated at runtime via Canvas API, zero external assets
- **Procedural chiptune audio** &mdash; music & SFX synthesized with the Web Audio API
- **5 levels &times; 10 waves = 50 waves** of progressively harder enemies
- **4 tower types &times; 3 upgrade tiers** (Archer, Mage, Cannon, Frost)
- **5 enemy types** (Slime, Wolf, flying Bat, Bear tank, Boss)
- **2 hero abilities** (Meteor Strike + Healing Light)
- **Speed control** (1&times;/2&times;/3&times;) + pause
- **Auto-save** to `localStorage` with a 3-star rating system
- **Story cutscenes** before and after each level

## Screenshots

<table>
<tr>
<td><img src="screenshots/menu-screen.png" alt="Main Menu" width="300"/></td>
<td><img src="screenshots/game-level1.png" alt="Level 1 Gameplay" width="300"/></td>
</tr>
<tr>
<td align="center">Main Menu</td>
<td align="center">Level 1 &mdash; Whispering Forest</td>
</tr>
<tr>
<td><img src="screenshots/gameplay-with-towers.png" alt="Gameplay with Towers" width="300"/></td>
<td><img src="screenshots/story-screen.png" alt="Story Cutscene" width="300"/></td>
</tr>
<tr>
<td align="center">Tower Placement & Combat</td>
<td align="center">Story Cutscene</td>
</tr>
<tr>
<td><img src="screenshots/test-level5-fresh.png" alt="Level 5 - Throne of Night" width="300"/></td>
<td><img src="screenshots/test-victory-screen.png" alt="Victory Screen" width="300"/></td>
</tr>
<tr>
<td align="center">Level 5 &mdash; Throne of Night</td>
<td align="center">Victory Screen</td>
</tr>
</table>

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/ds-mrtq/crystal-kingdom-defenders.git
cd crystal-kingdom-defenders
npm install
```

### Development

```bash
npm run dev
# Open http://localhost:5173/
```

### Production Build

```bash
npm run build      # Outputs to dist/
npm run preview    # Preview the production build locally
```

### Lint, Format & Type Check

```bash
npm run lint       # ESLint
npm run format     # Prettier
npx tsc --noEmit   # TypeScript type check
npm run test       # Vitest
```

## Tech Stack

| Layer       | Choice                       |
|-------------|------------------------------|
| Language    | TypeScript 5.x (strict mode) |
| Game Engine | Phaser 3.80+                 |
| Build Tool  | Vite 5.x                     |
| Graphics    | Canvas API + Phaser Graphics |
| Audio       | Web Audio API (procedural)   |
| Storage     | `localStorage`               |
| Linting     | ESLint + Prettier            |
| Testing     | Vitest                       |

**No Docker, no backend, no API required to run the game.**

## Project Structure

```
crystal-kingdom-defenders/
├── src/
│   ├── main.ts                    # Phaser bootstrap & game config
│   ├── audio/
│   │   └── AudioSystem.ts         # Procedural chiptune music & SFX
│   ├── config/
│   │   ├── BalanceConfig.ts       # Tower/enemy stats & tuning
│   │   ├── GameConfig.ts          # Phaser engine configuration
│   │   └── LevelConfig.ts        # 5 level definitions (paths, waves)
│   ├── entities/
│   │   ├── Enemy.ts               # Enemy class (HP, movement, types)
│   │   ├── Projectile.ts          # Projectile motion & impact
│   │   └── Tower.ts               # Tower targeting, firing & upgrades
│   ├── graphics/
│   │   ├── ChibiPainter.ts        # Canvas drawing primitives (chibi style)
│   │   └── SpriteFactory.ts       # Runtime sprite generation for all assets
│   ├── save/
│   │   └── SaveSystem.ts          # localStorage save/load
│   ├── scenes/
│   │   ├── BootScene.ts           # Asset generation & loading
│   │   ├── MenuScene.ts           # Title screen & navigation
│   │   ├── LevelSelectScene.ts    # Level map with lock/star states
│   │   ├── StoryScene.ts          # Dialogue cutscenes
│   │   ├── GameScene.ts           # Core tower defense gameplay
│   │   ├── UIScene.ts             # HUD overlay (gold, lives, wave, abilities)
│   │   └── ResultScene.ts         # Victory/defeat screen
│   ├── systems/
│   │   ├── AbilityManager.ts      # Meteor Strike & Healing Light
│   │   └── WaveManager.ts         # Wave spawning & progression
│   └── types/
│       └── index.ts               # Shared TypeScript types
├── index.html                     # Game entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript strict config
├── Dockerfile                     # Multi-stage build (Node + Nginx)
├── docker-compose.yml             # Local dev with Docker
├── docker-compose.prod.yml        # Production deployment (GHCR image)
├── nginx.conf                     # Nginx config for static serving
├── PRD.md                         # Product Requirements Document
├── IMPLEMENTATION_PLAN.md         # Implementation plan with progress tracking
└── TEST_PLAN.md                   # Test plan (123 test cases)
```

## Docker Deployment

### Build & Run Locally

```bash
docker build -t crystal-kingdom-defenders .
docker-compose up -d
# Open http://localhost:8090/
```

### Production (from GHCR)

```bash
# Pull the pre-built multi-arch image (amd64 + arm64)
docker pull ghcr.io/ds-mrtq/crystal-kingdom-defenders:latest

# Run with hardened settings
docker-compose -f docker-compose.prod.yml up -d
# Open http://localhost/
```

## CI/CD

| Workflow | Trigger | Description |
|----------|---------|-------------|
| [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) | Push to `main` | Type-checks, builds, and deploys `dist/` to GitHub Pages |
| [Build & Push Docker GHCR](.github/workflows/docker-ghcr.yml) | Push to `main` or version tags | Builds multi-arch Docker image with SLSA provenance attestation |

## Documentation

- [`PRD.md`](./PRD.md) &mdash; Full product requirements document
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) &mdash; Implementation plan with task checkboxes
- [`TEST_PLAN.md`](./TEST_PLAN.md) &mdash; Test plan with 123 test cases
- [`screenshots/`](./screenshots) &mdash; Game screenshots

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run checks: `npm run lint && npx tsc --noEmit`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT &mdash; free to use, modify, and learn from.

---

*Built with [Agentic Vibe Coding](https://github.com/ds-mrtq/crystal-kingdom-defenders) &mdash; 16 implementation phases, ~5,200 lines of TypeScript, 104/123 tests passing.*
