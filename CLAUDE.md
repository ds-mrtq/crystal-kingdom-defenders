# CLAUDE.md

## Tham Chiếu Dự Án Vibe Builder

### ⛔ KHÔI PHỤC KHI TRÀN CONTEXT
**Khi context bị đầy hoặc bạn cảm thấy lạc trong session dài:**
1. Đọc lại skill vibe-builder: `.claude/skills/vibe-builder/SKILL.md`
2. Đọc lại `IMPLEMENTATION_PLAN.md` để kiểm tra tiến độ hiện tại
3. Đọc lại `TEST_PLAN.md` (nếu có) để kiểm tra trạng thái test
4. Tuân thủ workflow nghiêm ngặt - đặc biệt các checkpoint bên dưới!

### ⚠️ CÁC CHECKPOINT WORKFLOW (BẮT BUỘC - KHÔNG ĐƯỢC BỎ QUA!)
| Sau Phase | Hành động |
| --- | --- |
| Phase 3 (Coding) hoàn thành | → Tạo TEST_PLAN.md → **⛔ DỪNG để Human review** |
| Phase 4 (Test Plan) approve | → Thực thi test tự động |
| Phase 5 (Testing) hoàn thành | → Báo cáo kết quả → Vào Phase 6 loop |

**QUAN TRỌNG:** Sau khi xong TẤT CẢ tasks coding, BẮT BUỘC phải:
1. Tạo TEST_PLAN.md
2. **⛔ DỪNG và đợi Human approve**
3. KHÔNG chạy test cho đến khi Human review xong TEST_PLAN.md!

### Tóm Tắt Dự Án (từ PRD.md)
- **Loại app**: Game Tower Defense 2D chạy trên web (browser, không cần backend)
- **Tech Stack**: TypeScript + Phaser 3.80+ + Vite 5
- **Tính năng cốt lõi**: 5 màn × 10 wave, 4 loại tháp × 3 tier, 5 loại quái, hero abilities, điều khiển tốc độ, hệ thống save, đồ họa chibi tự sinh, nhạc chiptune procedural
- **Docker Services**: KHÔNG CÓ — pure client-side static web app
- **Cốt truyện**: Công chúa Lumi bảo vệ 5 Đền Pha Lê khỏi quái thú của Shadow King qua 5 vùng đất

### Phase Hiện Tại
- **Trạng thái**: Phase 5 hoàn thành (104/123 test PASS, 0 FAIL)
- **Cách tiếp cận**: Tất cả sprite được sinh procedural qua Canvas API; tất cả audio qua Web Audio API. Không cần asset bên ngoài.

### Tài Liệu Chính
- `PRD.md` - Yêu cầu sản phẩm đầy đủ (đọc lazy theo section khi cần)
- `IMPLEMENTATION_PLAN.md` - Theo dõi task với checkbox
- `TEST_PLAN.md` - Test case và kết quả

### Quy Tắc Code
- TypeScript strict mode
- Không dùng asset bên ngoài — sinh tất cả programmatically
- Đánh dấu task hoàn thành bằng `[x]` trong IMPLEMENTATION_PLAN.md
- Object-pool projectiles và enemies cho mục tiêu 60 FPS
- Dùng Phaser scenes để tách state: Boot → Menu → LevelSelect → Story → Game (+UIScene overlay)
