# Tài Liệu Yêu Cầu Sản Phẩm (PRD)
# Crystal Kingdom Defenders (Vương Quốc Pha Lê)

## 1. Tổng Quan Sản Phẩm

**Crystal Kingdom Defenders** là game tower defense 2D phong cách chibi chạy hoàn toàn trên trình duyệt web. Người chơi nhập vai Công Chúa Lumi - người gác đền trẻ tuổi của vương quốc đảo pha lê bay - và phải bảo vệ các Đền Pha Lê khỏi từng đợt Shadow Beasts (quái thú bóng tối) bị tha hóa.

Game kết hợp chiều sâu chiến thuật của thể loại Kingdom Rush với vẻ đẹp dễ thương của phong cách chibi anime. Mọi nhân vật — từ những thỏ cung thủ tí hon đến gấu bóng tối hùng hổ — đều được vẽ với tỷ lệ thân hình 2-3 đầu, mắt to biểu cảm, và màu sắc tươi sáng đặc trưng của art style chibi.

**Vì sao có sản phẩm này:**
- Web có nhiều RPG chibi nhưng ít game tower defense chibi chất lượng
- Phong cách chibi giảm cảm giác "ngại" và làm game chiến thuật dễ tiếp cận hơn
- Web-based nghĩa là không cần cài đặt — chơi ngay trên mọi thiết bị

## 2. Mục Tiêu

- **Mục tiêu chính**: Mang lại trải nghiệm tower defense single-player chỉn chu, có replay value, vừa chiến thuật vừa dễ thương.
- **Thước đo thành công**:
  - Hoàn thành cả 5 màn trong ~45-90 phút (lần đầu chơi)
  - Mỗi màn có hệ thống đánh giá 3 sao (replayability)
  - 60 FPS trên thiết bị tầm trung
  - Không cần cài đặt, chạy trên mọi browser hiện đại
- **Điểm khác biệt với đối thủ**:
  - **Phong cách chibi food-magic riêng biệt** — nhân vật trông như những thú nhồi bông phép thuật
  - **Đồ họa hoàn toàn procedural** — tự sinh bằng code, không phụ thuộc asset
  - **Thân thiện tiếng Việt** — UI hỗ trợ cả Anh-Việt
  - **Speed control tích hợp** — 1x/2x/3x cho người chơi nóng tính (như Bloons TD)

## 3. Người Dùng Mục Tiêu

### Persona 1: Người Mê Chiến Thuật Casual ("Mai", 22, sinh viên)
- **Nhu cầu**: Phiên chơi nhanh giữa các tiết học, cảm giác tiến bộ thỏa mãn
- **Khó chịu**: Ghét cài app, chán art quá nghiêm túc
- **Vì sao chơi**: Đồ họa cute + level 5-10 phút, chạy trên browser

### Persona 2: Tower Defense Veteran ("Hoàng", 30, kỹ sư phần mềm)
- **Nhu cầu**: Lựa chọn nâng cấp tháp sâu, thử thách late-game, chơi tối ưu
- **Khó chịu**: Đa số game TD trên browser nông và cân bằng tệ
- **Vì sao chơi**: Multi-path tower upgrade, hero abilities, hard mode (post-MVP)

### Persona 3: Trẻ Em ("Linh", 9, gamer casual)
- **Nhu cầu**: UI dễ hiểu, nhân vật cute, không có nội dung đáng sợ
- **Khó chịu**: Nhiều game TD có theme u tối/bạo lực
- **Vì sao chơi**: Thú chibi làm tháp phòng thủ, không có máu me, story thân thiện

## 4. Cốt Truyện & Lore

### Bối Cảnh: Vương Quốc Pha Lê

Ngày xưa, thế giới là vùng đất của những đảo bay được nâng đỡ bởi **Năm Đền Pha Lê Vĩ Đại**. Mỗi đền cộng hưởng với một nguyên tố — Rừng, Núi, Băng, Trời, và Sao — sự hài hòa giữa chúng giữ cho vương quốc bình yên.

Nhưng vào một đêm không trăng, **Shadow King** (Vua Bóng Tối) tỉnh giấc khỏi nhà tù dưới Biển Sao. Sự tha hóa của hắn lan vào sinh vật rừng, biến những con vật cute thành **Shadow Beasts** (quái thú bóng tối). Hắn nhắm dập tắt từng Đền Pha Lê và đẩy vương quốc vào đêm tối vĩnh viễn.

**Công Chúa Lumi**, người thừa kế trẻ tuổi nhất của nhà Crystalwood, là người duy nhất có Light Magic (phép ánh sáng) di truyền để triệu tập đội bảo vệ vương quốc. Cùng với 4 chiến hữu trung thành — **Bunny Archer Mochi** (cung thủ thỏ), **Star Mage Kira** (pháp sư sao), **Acorn Bombardier Pebble** (sóc pháo binh), và **Knight Hamster Sir Pip** (hiệp sĩ chuột hamster) — cô phải khôi phục từng đền và đối đầu với Shadow King ở cuối hành trình.

### Diễn Biến Cốt Truyện (mỗi màn)

| Lv | Vùng đất | Tiêu đề | Nội dung |
|----|----------|---------|----------|
| 1  | Rừng Thì Thầm | "Ánh Sáng Đầu Tiên" | Lumi tỉnh giấc; Shadow Slime tràn vào rừng. Tutorial. |
| 2  | Đồi Đỏ Thẫm | "Đường Mòn Hú Tru" | Shadow Wolf tấn công nhanh; Pebble gia nhập. |
| 3  | Đèo Băng Frostpeak | "Trái Tim Đóng Băng" | Shadow Bear tank xuất hiện; Sir Pip gia nhập làm blocker cận chiến. |
| 4  | Tàn Tích Skyspire | "Đôi Cánh Hoàng Hôn" | Shadow Bat phủ kín bầu trời — chỉ tháp ranged đánh được. |
| 5  | Ngai Vàng Đêm Tối | "Shadow King" | Đối đầu cuối cùng với tất cả enemy + boss Shadow King. |

## 5. Tính Năng & Yêu Cầu

### Tính Năng Cốt Lõi (MVP)

- [x] **F1 — Main Menu**
  - Nút Start, Continue, Level Select, Settings, Credits
  - Princess Lumi chibi animated vẫy tay ở title screen
  - Acceptance: Tất cả nút đều bấm được; nhớ level chơi gần nhất

- [x] **F2 — Màn Hình Chọn Màn**
  - Bản đồ với 5 node màn unlock được, nối bằng đường sáng
  - Mỗi node hiển thị lock/star rating (1-3 sao) khi đã hoàn thành
  - Acceptance: Màn khóa hiện 🔒, đã xong hiện sao, màn hiện tại được highlight

- [x] **F3 — Vòng Lặp Gameplay TD**
  - Đường đi cố định (waypoints) mỗi màn
  - Đặt tháp grid-based trên ô build xanh
  - 10 wave mỗi màn với countdown giữa wave (5s mặc định; nút "Send Now")
  - Thắng = sống sót 10 wave; Thua = lives về 0
  - Acceptance: Bắt đầu màn → đặt tháp → diệt enemy → tiến qua các wave

- [x] **F4 — 4 Loại Tháp với 2 Tier Nâng Cấp**
  - **Archer Tower** (Mochi Bunny): single-target, bắn nhanh, đánh được flying
  - **Mage Tower** (Kira): splash damage, magical, đánh được flying
  - **Cannon Tower** (Pebble): damage cao, AoE, bắn chậm, chỉ ground
  - **Frost Tower** (Glacier sprite): làm chậm + damage thấp, ground+flying
  - Mỗi tháp 2 tier nâng cấp (cost tăng, stats tăng, sprite thay đổi)
  - Acceptance: Đặt → upgrade → thấy thay đổi visual + stats tốt hơn

- [x] **F5 — Sự Đa Dạng Của Quái**
  - **Shadow Slime**: cơ bản, chậm, HP thấp, ground
  - **Shadow Wolf**: nhanh, HP trung bình, ground
  - **Shadow Bat**: bay, HP trung bình (chỉ tháp ranged đánh được)
  - **Shadow Bear**: tank, chậm, HP rất cao, ground
  - **Shadow Lord** (boss): HP khổng lồ, đặc biệt ở màn 5
  - Acceptance: Mỗi quái có sprite, stats, behavior riêng biệt

- [x] **F6 — Hệ Thống Tài Nguyên & Mạng Sống**
  - Gold: kiếm được từ giết quái, dùng cho tháp/upgrade
  - Lives: 20 mặc định; -1 khi quái về đích (-3 cho boss)
  - HUD hiển thị gold, lives, wave hiện tại / tổng wave
  - Acceptance: Counter cập nhật real-time

- [x] **F7 — Hero Abilities (Princess Lumi)**
  - **Meteor Strike**: click bất cứ đâu → AoE damage (cooldown 30s)
  - **Healing Light**: hồi 5 lives (cooldown 60s, an toàn cuối cùng)
  - Acceptance: Nút hiện cooldown timer; abilities hoạt động đúng mô tả

- [x] **F8 — Điều Khiển Tốc Độ Game**
  - Nút 1x / 2x / 3x + Pause
  - Acceptance: Tốc độ ảnh hưởng tất cả update; UI animation vẫn mượt

- [x] **F9 — Save/Load Tiến Độ**
  - Tự động save màn đã unlock và star rating vào `localStorage`
  - Acceptance: Refresh browser → tiến độ vẫn còn

- [x] **F10 — Đồ Họa Chibi Procedural**
  - Tất cả sprite sinh programmatically dùng Canvas/SVG path tại boot
  - Tỷ lệ chibi 2-3 đầu, mắt to, màu bão hòa, viền mềm
  - Acceptance: Game không cần file ảnh nào (zero asset download)

- [x] **F11 — Âm Thanh & Nhạc**
  - Audio procedural qua Web Audio API (8-bit chiptune nền + SFX)
  - Toggle mute trong settings
  - Acceptance: Nhạc chạy trong gameplay; SFX khi tháp bắn/quái chết/UI click

- [x] **F12 — Cutscene Cốt Truyện (Text-Based)**
  - Trước màn: portrait nhân vật chibi + dialog
  - Sau màn: dialog ăn mừng ngắn
  - Acceptance: Có thể skip; cốt truyện tiến triển đúng

### Nice-to-have (Sau MVP)
- [ ] Hard mode với enemy mạnh hơn
- [ ] Endless mode (sống sót càng nhiều wave càng tốt)
- [ ] Hệ thống achievement
- [ ] Toggle Việt hóa
- [ ] Tối ưu touch control mobile
- [ ] Daily challenge level

## 6. User Flow

### Luồng Chính

```
┌──────────┐
│  Boot    │
└────┬─────┘
     ↓
┌──────────────┐
│ Main Menu    │
└────┬─────────┘
     ↓
┌──────────────┐    ┌──────────────┐
│ Level Select │───▶│ Locked? show │
└────┬─────────┘    │   prompt     │
     ↓              └──────────────┘
┌──────────────┐
│ Story Intro  │ (skippable)
└────┬─────────┘
     ↓
┌──────────────────────────────┐
│ Vòng lặp gameplay:           │
│  • Đặt tháp                  │
│  • Gửi wave (auto/manual)    │
│  • Kiếm gold                 │
│  • Dùng abilities            │
└────┬─────────────┬───────────┘
     │             │
   Win?          Lose?
     ↓             ↓
┌─────────┐   ┌─────────┐
│ Victory │   │ Defeat  │
│ + Stars │   │ Retry?  │
└────┬────┘   └────┬────┘
     ↓             ↓
   Level Select ←──┘
```

### Luồng Đặt Tháp Trong Game

```
[Click ô build trống]
        ↓
[Modal cửa hàng tháp mở tại ô đó]
        ↓
   Đủ gold?
   ┌────┴────┐
  Có       Không
   ↓         ↓
[Chọn   [Hiện tooltip
 tháp]   "không đủ gold"]
   ↓
[Tháp đặt, gold trừ]
   ↓
[Click tháp → tùy chọn upgrade/sell]
```

## 7. Wireframes (Phong cách Chibi)

### Màn hình: Main Menu
```
┌──────────────────────────────────────────────┐
│  ✨   CRYSTAL KINGDOM DEFENDERS    ✨        │
│                                              │
│              (◕‿◕)  Princess Lumi            │
│              /|\    đang vẫy                 │
│              / \                             │
│        ┌─────────────────────┐               │
│        │   ▶  PLAY           │               │
│        └─────────────────────┘               │
│        ┌─────────────────────┐               │
│        │   ⭐  LEVEL SELECT   │               │
│        └─────────────────────┘               │
│        ┌─────────────────────┐               │
│        │   ⚙   SETTINGS      │               │
│        └─────────────────────┘               │
│       v1.0   © Crystal Kingdom Studios       │
└──────────────────────────────────────────────┘
```

### Phong cách Chibi Reference

```
   Princess Lumi (chibi proportions ~2.5 đầu)

        ◯◯◯◯       <- tóc bồng bềnh
       ◯ ◕ ◕ ◯     <- mắt to long lanh
       ◯  ‿  ◯     <- nụ cười nhỏ
        ◯◯◯◯
         │  │
        ╱│✨│╲     <- thân nhỏ + gậy
         │  │
         /  \
        /    \
```

Style: cao 2.5 đầu, mắt to (40% của mặt), hình tròn mềm, không góc nhọn, pastel sáng (xanh trời, mint, hồng đào, tím lavender).

## 8. Data Models

### Entities chính

```
┌─────────────────┐       ┌─────────────────┐
│   Level         │ 1───N │   Wave          │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ name            │       │ levelId         │
│ biome           │       │ index           │
│ pathWaypoints   │       │ enemySpawns[]   │
│ buildSpots      │       │ delayBefore     │
│ startGold       │       └─────────────────┘
│ startLives      │
└─────────────────┘
```

### Save Data (key localStorage: `ckd_save_v1`)

```typescript
interface SaveData {
  unlockedLevels: number[];          // [1, 2, 3]
  levelStars: Record<number, number>; // { 1: 3, 2: 2 }
  totalGold: number;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    speedDefault: 1 | 2 | 3;
  };
  lastPlayedLevel: number;
}
```

## 9. Kiến Trúc Kỹ Thuật

### Sơ Đồ Hệ Thống

```
┌──────────────────────────────────────┐
│           Browser Tab                │
│ ┌──────────────────────────────────┐ │
│ │      Phaser 3 Game Instance      │ │
│ │ ┌──────────┬──────────┬────────┐ │ │
│ │ │ BootScene│ MenuScene│GameScene│ │ │
│ │ └─────┬────┴────┬─────┴───┬────┘ │ │
│ │       ↓         ↓         ↓       │ │
│ │ ┌──────────────────────────────┐ │ │
│ │ │  Game Systems (TS classes)   │ │ │
│ │ │  • TowerManager              │ │ │
│ │ │  • EnemyManager              │ │ │
│ │ │  • WaveManager               │ │ │
│ │ │  • GoldSystem                │ │ │
│ │ │  • SpriteFactory (procedural)│ │ │
│ │ │  • AudioSystem (Web Audio)   │ │ │
│ │ │  • SaveSystem (localStorage) │ │ │
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Hạ Tầng (KHÔNG cần Docker)

Đây là **pure client-side static web app**. Không backend, không database, không auth, không API. Mọi thứ chạy trong browser. Docker cố ý KHÔNG dùng vì:
- Không có service nào để host
- localStorage xử lý persistence
- Vite dev server (`npm run dev`) là runtime duy nhất
- Production build là static HTML/JS/CSS — deploy được lên GitHub Pages, Netlify, Vercel...

### Tech Stack

| Layer        | Lựa chọn                     | Lý do                                                |
|--------------|------------------------------|------------------------------------------------------|
| Ngôn ngữ     | TypeScript 5.x (strict)      | Type safety; bắt buộc theo Vibe Builder              |
| Game Engine  | Phaser 3.80+                 | Framework 2D web game trưởng thành, batteries-included|
| Build Tool   | Vite 5.x                     | HMR nhanh, bundling hiện đại, template chính thức Phaser|
| Đồ họa       | Phaser Graphics API + Canvas | Tất cả sprite procedural, zero asset                 |
| Audio        | Web Audio API + Phaser audio | Chiptune procedural + SFX, không file audio          |
| Storage      | `localStorage`               | Save data đơn giản, không cần server                 |
| Testing      | Vitest                       | Nhanh, native Vite, TypeScript-first                 |
| Linting      | ESLint + Prettier            | Toolchain TS chuẩn                                   |

### Cấu Trúc Dự Án

```
tower_defense/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts                  # Phaser bootstrap
│   ├── config/
│   │   ├── GameConfig.ts        # Cấu hình Phaser
│   │   ├── BalanceConfig.ts     # Stats tháp, quái, cost
│   │   └── LevelConfig.ts       # Định nghĩa level (wave, path)
│   ├── scenes/
│   │   ├── BootScene.ts         # Sinh sprite tại boot
│   │   ├── MenuScene.ts
│   │   ├── LevelSelectScene.ts
│   │   ├── StoryScene.ts        # Dialog cutscene
│   │   ├── GameScene.ts         # Gameplay TD chính
│   │   └── UIScene.ts           # HUD overlay (chạy song song GameScene)
│   ├── entities/
│   │   ├── Tower.ts
│   │   ├── Enemy.ts
│   │   ├── Projectile.ts
│   │   └── BuildSpot.ts
│   ├── systems/
│   │   ├── TowerManager.ts
│   │   ├── EnemyManager.ts
│   │   ├── WaveManager.ts
│   │   ├── GoldSystem.ts
│   │   ├── AbilityManager.ts
│   │   └── PathfindingSystem.ts # Theo waypoint
│   ├── graphics/
│   │   ├── SpriteFactory.ts     # Sinh sprite chibi procedural
│   │   └── ChibiPainter.ts      # Helper vẽ canvas
│   ├── audio/
│   │   ├── AudioSystem.ts
│   │   └── ProceduralMusic.ts   # Sinh chiptune
│   ├── ui/
│   │   ├── HUD.ts
│   │   ├── TowerShop.ts
│   │   └── UpgradePanel.ts
│   ├── save/
│   │   └── SaveSystem.ts
│   └── types/
│       └── index.ts             # TypeScript types chia sẻ
├── tests/
│   └── *.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.cjs
└── README.md
```

## 10. Hướng Dẫn UI/UX

### Bảng Màu (Chibi Pastel)

| Vai trò            | Hex      | Sử dụng                            |
|--------------------|----------|------------------------------------|
| Sky Blue           | #B3E5FC  | Background, panel UI               |
| Mint Green         | #C8E6C9  | Level rừng, trạng thái success     |
| Peach Pink         | #FFCCBC  | Princess Lumi, nhân vật bạn        |
| Lavender Purple    | #D1C4E9  | Magic, mage tower                  |
| Sunshine Yellow    | #FFF59D  | Coin, phần thưởng                  |
| Cherry Red         | #EF9A9A  | Health, danger, HP bar enemy       |
| Deep Plum          | #4A148C  | Shadow enemy (corruption)          |
| Cream White        | #FFF8E1  | Dialog box, background text        |
| Charcoal           | #424242  | Outline, body text                 |

### Typography

- **Display font**: Font chibi tròn như **"Fredoka"** (Google Fonts) — bold cho title
- **Body font**: **"Quicksand"** (Google Fonts) — friendly dễ đọc
- **Số (HUD)**: **"Press Start 2P"** cho cảm giác retro gaming trên counter

### Style Component

- **Buttons**: Hình viên thuốc mềm với viền 2px, shadow 8px, animation bounce khi click
- **Tower cards**: Hình vuông tròn với portrait + cost + tooltip khi hover
- **Health bars**: Hình chữ nhật bo tròn với chuyển màu mượt (xanh→vàng→đỏ)
- **Particles**: Sao/lấp lánh nhỏ khi tháp bắn, trái tim khi heal, bụi khi quái chết

### Responsive Breakpoint

- **Desktop** (≥1024px): Layout đầy đủ, target viewport 1280×720
- **Tablet** (768-1023px): Thu nhỏ, cùng layout
- **Mobile** (<768px): Tối ưu touch (button tối thiểu 48px), HUD xếp chồng
- Canvas game dùng Phaser scale mode `FIT` để giữ tỷ lệ

## 11. Mục Tiêu Hiệu Suất

- **Frame rate**: 60 FPS bền vững trên laptop 5 năm tuổi với 50 enemy + 20 tháp
- **Initial load**: < 3 giây (target bundle: < 800 KB gzipped, không asset ngoài)
- **Memory**: < 100 MB peak (browser tab)

## 12. Bảo Mật

- Không thu thập tài khoản người dùng hay PII
- localStorage là client-only (không có vector XSS ngoài browser sandbox chuẩn)
- Dùng Content Security Policy header trong production
- Sanitize mọi field input từ user (vd: tên người chơi post-MVP)

## 13. Nguồn Nghiên Cứu

- [Phaser 3 + Vite + TS Template (Official)](https://phaser.io/news/2024/01/phaser-vite-typescript-template) — Tech stack baseline
- [Kingdom Rush Wiki — Towers](https://kingdomrushtd.fandom.com/wiki/Category:Towers) — Cảm hứng mô hình 4-tower
- [Red Blob Games — Flow Field Pathfinding for TD](https://www.redblobgames.com/pathfinding/tower-defense/) — Validate cách tiếp cận waypoint
- [Defender's Quest — Optimizing TD Design](https://www.fortressofdoors.com/optimizing-tower-defense-for-focus-and-thinking-defenders-quest/) — Range > damage > fire-rate
- [Switchblade Gaming — Best TD 2026](https://www.switchbladegaming.com/strategy-games/best-tower-defense-2026/) — Đường cong khó: thêm 1 cơ chế mới mỗi level
- [Chibi Art Style Guide](https://medium.com/@purplebubblestudio/the-adorable-revolution-chibi-art-styles-in-video-games-777bb93d0a1a) — Tỷ lệ 2-3 đầu, mắt to, màu bão hòa
- [Phaser vs PixiJS Comparison](https://generalistprogrammer.com/comparisons/phaser-vs-pixijs) — Phaser phù hợp cho game đầy đủ
- [Phaser Discourse — State Mgmt Best Practices](https://phaser.discourse.group/t/best-practices-for-managing-state/6518) — State theo scene với TypeScript
