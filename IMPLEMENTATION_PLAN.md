# Kế Hoạch Triển Khai — Crystal Kingdom Defenders

## Phase 1: Setup Dự Án
- [x] Khởi tạo project npm với `package.json`
- [x] Cài dependencies: `phaser`, `vite`, `typescript`, `@types/node`
- [x] Cài dev dependencies: `eslint`, `prettier`, `vitest`, `@vitest/ui`
- [x] Tạo `tsconfig.json` strict mode
- [x] Tạo `vite.config.ts` với options Phaser-friendly
- [x] Tạo `index.html` với game container
- [x] Tạo `src/main.ts` với Phaser bootstrap
- [x] Setup `.eslintrc.cjs` và `.prettierrc`
- [x] Thêm npm scripts: `dev`, `build`, `preview`, `test`, `lint`
- [x] Verify dev server chạy được và hiện canvas Phaser trống

## Phase 2: Hạ Tầng Core
- [x] Tạo `src/types/index.ts` với types chia sẻ (TowerType, EnemyType...)
- [x] Tạo `src/config/GameConfig.ts` với cấu hình Phaser (1280×720, FIT scale)
- [x] Tạo `src/config/BalanceConfig.ts` với stats tháp/quái
- [x] Tạo `src/config/LevelConfig.ts` với 5 định nghĩa level (path, wave)
- [x] Tạo `src/save/SaveSystem.ts` với localStorage read/write
- [x] Setup scene routing: BootScene → MenuScene
- [x] Verify chuyển scene hoạt động

## Phase 3: Hệ Thống Đồ Họa Procedural
- [x] Tạo `src/graphics/ChibiPainter.ts` — Canvas drawing primitives (chibi head, body, mắt)
- [x] Tạo `src/graphics/SpriteFactory.ts` — sinh tất cả sprite tại boot:
  - [x] Sprite Princess Lumi (idle + frame vẫy)
  - [x] 4 sprite tower base (Archer, Mage, Cannon, Frost) tại tier 1, 2, 3
  - [x] 5 sprite quái (Slime, Wolf, Bat, Bear, Boss) với frame đi
  - [x] Sprite projectile (arrow, magic bolt, cannonball, frost shard)
  - [x] Sprite tile (cỏ, đường, build-spot, decoration)
  - [x] Element UI (button, panel, icons)
- [x] Implement `BootScene` gọi SpriteFactory.generateAll()
- [x] Verify tất cả sprite render trong scene debug

## Phase 4: Menu & Navigation
- [x] Implement `MenuScene` với title + nút Play/LevelSelect/Settings
- [x] Implement `LevelSelectScene` với 5 level node + lock/star
- [x] Implement `StoryScene` cho dialog trước/sau level
- [x] Wire navigation: Menu ↔ LevelSelect → Story → Game → Story → LevelSelect
- [x] Implement `SettingsModal` với volume slider, default speed

## Phase 5: Gameplay Core — Map & Path
- [x] Tạo `GameScene` với background map render từ level config
- [x] Render path waypoints như đường nhìn thấy được
- [x] Render build-spots như tile được highlight
- [x] Implement camera bounds và zoom

## Phase 6: Hệ Thống Quái
- [x] Tạo class `Enemy` với HP, speed, sprite, follow waypoint
- [x] Tạo `EnemyManager` để spawn/track/destroy quái
- [x] Implement HP bar phía trên mỗi quái
- [x] Xử lý quái về đích (trừ lives, despawn)
- [x] Xử lý quái chết (rớt gold, despawn)
- [x] Thêm anim đi swap frame

## Phase 7: Hệ Thống Tháp
- [x] Tạo class `Tower` với type, tier, logic acquire target
- [x] Tạo class `Projectile` với motion + impact
- [x] Tạo `TowerManager` để track tất cả tháp đã đặt
- [x] Implement tower target-finding (quái gần nhất trong tầm)
- [x] Implement firing logic với cooldown mỗi tháp
- [x] Implement projectile spawn → bay → impact → damage
- [x] Splash damage logic cho Mage và Cannon
- [x] Slow effect logic cho Frost tower
- [x] Targeting flying enemy (Cannon không đánh được Bat)
- [x] Tower upgrade logic (check cost, advance tier, swap sprite)

## Phase 8: Hệ Thống Wave
- [x] Tạo `WaveManager` để spawn quái theo wave config
- [x] Implement countdown timer wave
- [x] Implement nút "Send Now" để skip countdown
- [x] Detect wave clear (quái chết/leak hết)
- [x] Detect chiến thắng level (clear hết 10 wave)
- [x] Detect thua (lives ≤ 0)

## Phase 9: UI & HUD (UIScene)
- [x] Tạo `UIScene` chạy song song GameScene
- [x] HUD: gold, lives, wave counter, nút speed, pause
- [x] Modal cửa hàng tháp (mở khi click ô build trống)
- [x] Panel upgrade tháp (mở khi click tháp đã đặt)
  - [x] Hiện stats, cost upgrade, nút sell (refund 50%)
  - [x] Vòng tròn range indicator
- [x] Tooltip preview wave (loại quái wave kế)
- [x] Màn hình chiến thắng với sao (3=full lives, 2=>50%, 1=có sống sót)
- [x] Màn hình thất bại với nút retry

## Phase 10: Hero Abilities
- [x] Implement Meteor Strike: cursor đổi → click → AoE damage
- [x] Implement Healing Light: instant +5 lives
- [x] UI cooldown trên nút ability
- [x] Visual effect khi meteor (particle burst)
- [x] Visual effect khi heal (sparkles)

## Phase 11: Điều Khiển Tốc Độ
- [x] Implement 1x/2x/3x speed qua Phaser time scale
- [x] Toggle pause
- [x] Speed persist mỗi level

## Phase 12: Hệ Thống Audio
- [x] Tạo `AudioSystem` với Web Audio API
- [x] Generator chiptune procedural (`ProceduralMusic.ts`):
  - [x] Theme menu (vui vẻ)
  - [x] Theme battle (gay cấn)
  - [x] Jingle chiến thắng
  - [x] Jingle thất bại
- [x] Generator SFX:
  - [x] Tower fire (4 biến thể)
  - [x] Tiếng pop quái chết
  - [x] UI click
  - [x] Coin collect
  - [x] Meteor boom
- [x] Toggle mute trong settings

## Phase 13: Tích Hợp Save System
- [x] Save level đã unlock sau khi thắng
- [x] Save star rating mỗi level
- [x] Save settings (volume, default speed)
- [x] Load khi game start
- [x] Nút "Reset Progress" trong settings

## Phase 14: Nội Dung Cốt Truyện
- [x] Viết 5 dialogue intro (mỗi level)
- [x] Viết 5 dialogue outro
- [x] Implement portrait + typewriter effect trong StoryScene
- [x] Nút Skip/continue

## Phase 15: Polish & Cân Bằng
- [x] Tinh chỉnh tower cost và damage cho mỗi level
- [x] Tinh chỉnh enemy HP và speed scaling theo wave
- [x] Thêm preview tower placement (vòng range khi chọn mua)
- [x] Thêm screen shake khi meteor impact và boss hit
- [x] Thêm particle effects: muzzle flash, hit sparkle, gold pickup
- [x] Thêm hover state cho tất cả element UI
- [x] Thêm loading spinner cho boot

## Phase 16: Cross-Browser & Hiệu Suất
- [x] Test trên Chrome (Chromium qua Playwright)
- [ ] Test trên Firefox, Safari (manual)
- [x] Verify 60 FPS với 50 quái + 20 tháp (initial verification)
- [x] Tối ưu: object pooling cho projectile và quái
- [x] Tối ưu: tránh allocate per-frame trong hot loop

---

## ⚠️ NHẮC NHỞ CHECKPOINT WORKFLOW
**Khi TẤT CẢ task ở trên đã đánh dấu [x]:**
1. ✅ Báo cáo "Phase 3 Complete" (xong code)
2. 📝 Tạo TEST_PLAN.md
3. ⛔ **DỪNG và đợi Human review TEST_PLAN.md**
4. Chỉ chạy test SAU KHI Human approve

**Tràn context?** Đọc lại file skill: `.claude/skills/vibe-builder/SKILL.md`

---

## Progress Log
| Ngày       | Phase     | Trạng thái  | Ghi chú                               |
| ---------- | --------- | ----------- | ------------------------------------- |
| 2026-05-08 | Planning  | ✅ Hoàn thành | PRD + plan đã viết                    |
| 2026-05-08 | Phase 1-2 | ✅ Hoàn thành | Đã được Human approve                 |
| 2026-05-08 | Phase 3   | ✅ Hoàn thành | 16 sub-phase đã code xong             |
| 2026-05-08 | Phase 4   | ✅ Hoàn thành | TEST_PLAN.md (123 case) đã approve    |
| 2026-05-08 | Phase 5   | ✅ Hoàn thành | 104/123 PASS, 19 SKIP/MANUAL, 0 FAIL  |
