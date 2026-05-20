import type { Translations } from './I18n';

export const vi: Translations = {
  menu: {
    title: 'Vương Quốc Pha Lê',
    subtitle: 'N G Ư Ờ I   B Ả O   V Ệ',
    play: '▶  CHƠI',
    levelSelect: '⭐  Chọn Màn',
    settings: '⚙   Cài Đặt',
    copyright: 'v1.0  © Crystal Kingdom Studios',
  },
  settings: {
    title: 'Cài Đặt',
    soundOn: '🔊 Âm thanh: BẬT',
    soundOff: '🔇 Âm thanh: TẮT',
    resetProgress: '🗑  Xóa Tiến Trình',
    confirmReset: 'Nhấn lại để xác nhận',
    progressReset: '✓ Đã xóa tiến trình',
    close: 'Đóng',
    langLabel: '🌐 Ngôn ngữ: VI',
  },
  levelSelect: {
    title: '✦ Bản Đồ Vương Quốc Pha Lê ✦',
    back: '← Quay lại',
    startLevel: '▶ BẮT ĐẦU',
    locked: 'Màn chơi bị khóa. Hoàn thành màn trước để mở khóa.',
    lockedBtn: '🔒 ĐÃ KHÓA',
  },
  ui: {
    wave: 'Đợt',
    pause: '⏸ Dừng',
    resume: '▶ Tiếp',
    sendWave: '▶ Gọi Đợt',
    waveActive: 'đang đến...',
    meteor: 'Sao Băng',
    heal: 'Hồi Máu',
    buildTower: 'Xây Tháp',
    cancel: '✕ Hủy',
    tier: 'Cấp',
    upgrade: '⬆ Nâng cấp',
    maxTier: '⭐ CẤP TỐI ĐA',
    sell: 'Bán',
    close: '✕ Đóng',
  },
  game: {
    start: 'XUẤT PHÁT',
  },
  story: {
    victory: 'Chiến Thắng',
    continue: '▼ Nhấn để tiếp tục',
    skip: 'Bỏ qua ⏭',
  },
  result: {
    victory: '✨ CHIẾN THẮNG ✨',
    defeat: '☠ THẤT BẠI ☠',
    lives: 'Máu',
    nextLevel: '→ Màn Tiếp',
    worldMap: '🗺 Bản Đồ',
    retry: '↻ Thử Lại',
  },
  levels: {
    1: {
      name: 'Khu Rừng Thì Thầm',
      storyIntro: [
        'Công chúa Lumi: "Những cây cổ thụ... chúng đang kêu cứu!"',
        'Một làn sóng Slime Bóng Tối tràn ra từ con suối bị hủ hoại.',
        'Mochi Thỏ Xạ Thủ: "Đừng lo Công chúa, mũi tên của tôi đã sẵn sàng!"',
        'Bảo vệ Đền Pha Lê của Khu Rừng!',
      ],
      storyOutro: [
        'Đền Pha Lê tỏa sáng dịu dàng trở lại. Cây cối thở phào.',
        'Công chúa Lumi: "Xong một. Còn bốn nữa. Đến vùng đồi thôi!"',
      ],
    },
    2: {
      name: 'Đồi Đỏ Thắm',
      storyIntro: [
        'Những ngọn đồi nhuốm đỏ bóng tối. Đàn sói hú vang bất thường.',
        'Pebble Thợ Pháo Quả Sồi: "Tôi mang khẩu đại bác to nhất đây, Công chúa!"',
        'Đồng minh mới: Tháp Đại Bác (Sát thương diện rộng, chỉ bắn mặt đất).',
      ],
      storyOutro: [
        'Những ngọn đồi lấy lại sắc vàng. Đàn sói trở nên hiền lành.',
        'Công chúa Lumi: "Đỉnh Băng là tiếp theo... mặc ấm vào nhé!"',
      ],
    },
    3: {
      name: 'Đèo Đỉnh Băng',
      storyIntro: [
        'Tuyết rơi đen kịt vì hủ hoại. Những bóng đen khổng lồ tiến lại.',
        'Hiệp sĩ Pip Chuột Hamster: "Chít! Tôi sẽ giữ phòng tuyến, Công chúa!"',
        'Mẹo: Tháp Pháp Sư và Đại Bác rất hiệu quả chống Gấu Bóng Tối.',
      ],
      storyOutro: [
        'Đền Đỉnh Băng ngân vang thanh thoát. Tuyết lại trắng muốt.',
        'Công chúa Lumi: "Nhìn lên kìa... Tháp Trời đang chìm trong bóng tối."',
      ],
    },
    4: {
      name: 'Phế Tích Tháp Trời',
      storyIntro: [
        'Tiếng cánh vỗ trong gió ô uế. Đàn Dơi Bóng Tối bay thành vòng xoáy.',
        'Công chúa Lumi: "Bom không với tới! Dùng Cung Thủ, Pháp Sư hoặc Băng!"',
        'Lưu ý: Tháp Đại Bác KHÔNG THỂ bắn quái bay.',
      ],
      storyOutro: [
        'Đàn dơi tháo chạy. Tháp Trời lung linh tựa ngọn đèn.',
        'Công chúa Lumi: "Còn một đền nữa... và Vua Bóng Tối đang chờ."',
      ],
    },
    5: {
      name: 'Ngai Vàng Bóng Đêm',
      storyIntro: [
        'Ngai Vàng Bóng Đêm hiện ra. Không khí đặc quánh hủ hoại.',
        'Vua Bóng Tối: "Công chúa ngốc nghếch... ánh sáng nhỏ bé không thể xua tan đêm vĩnh cửu."',
        'Công chúa Lumi: "Vậy thì hãy xem ánh sáng làm được gì."',
        'Trận chiến cuối cùng. Tất cả loại quái. Boss ở Đợt 10.',
      ],
      storyOutro: [
        'Vua Bóng Tối sụp đổ. Ánh sáng tràn ngập vương quốc.',
        'Công chúa Lumi: "Cảm ơn các bạn. Vương quốc đã an toàn... hiện tại thì vậy."',
        '✨ Vương Quốc Pha Lê đã được khôi phục. ✨',
      ],
    },
  },
  towers: {
    archer: { name: 'Mochi Thỏ Xạ Thủ', description: 'Bắn nhanh đơn mục tiêu. Bắn được quái bay.' },
    mage: { name: 'Pháp Sư Sao Kira', description: 'Sát thương phép diện rộng. Bắn được quái bay.' },
    cannon: { name: 'Pháo Thủ Pebble', description: 'Sát thương diện rộng cao. Chỉ bắn mặt đất.' },
    frost: { name: 'Tinh Linh Băng Giá', description: 'Làm chậm quái. Bắn được quái bay.' },
  },
  enemies: {
    slime: { name: 'Slime Bóng Tối' },
    wolf: { name: 'Sói Bóng Tối' },
    bat: { name: 'Dơi Bóng Tối' },
    bear: { name: 'Gấu Bóng Tối' },
    boss: { name: 'Vua Bóng Tối' },
  },
};
