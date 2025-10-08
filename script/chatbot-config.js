// ==========================
// Chatbot Configuration
// ==========================

// Cấu hình chatbot AI cho Hạ Miên
const CHATBOT_CONFIG = {
  // Cấu hình AI API (tùy chọn)
  ai: {
    enabled: false, // Đặt thành true nếu bạn có API key
    apiKey: '', // Thêm API key của bạn ở đây
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.7
  },

  // Cấu hình chatbot
  chatbot: {
    name: 'Hạ Miên Chatbot',
    welcomeMessages: [
      'Xin chào, chúng mình là Hạ Miên, cảm ơn bạn đã liên hệ, bạn muốn tư vấn về dịch vụ nào?',
      'Hạ Miên xin chào anh/chị, cảm ơn đã ghé qua shop chúng em. Không biết anh/chị quan tâm đến sản phẩm nào ạ?',
      'Hạ Miên xin chào, cảm ơn bạn yêu đã liên hệ. Miên có thể giúp gì được cho bạn ạ?'
    ],
    suggestions: [
      'Đặt hoa theo mẫu',
      'Tư vấn',
      'Thiết kế theo yêu cầu',
      'Đặt hoa giao ngay',
      'Deal hot theo mùa',
      'Hỏi về đơn hàng',
      'Tổ chức sự kiện',
      'CSKH sau mua'
    ]
  },

  // Thông tin cửa hàng
  store: {
    name: 'Hạ Miên',
    address: '422 Vĩnh Hưng',
    phone: '0987654321',
    services: [
      'Hoa tươi mỗi ngày',
      'Gói quà sang trọng',
      'Giao hàng nhanh',
      'Tổ chức sự kiện'
    ]
  },

  // Cấu hình giao diện
  ui: {
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'light', // light, dark, auto
    animation: true,
    sound: false
  },

  // Quy tắc – Từ khóa nhận diện ý định
  intents: {
    mau: ['đặt hoa theo mẫu', 'mẫu', 'theo mẫu', 'catalog', 'bộ sưu tập'],
    tuvan: ['tư vấn', 'tuvan', 'gợi ý', 'gợi y', 'nên chọn', 'hợp với', 'ý nghĩa', 'nghĩa hoa', 'chăm sóc', 'giấy gói', 'giay goi'],
    thietke: ['thiết kế', 'thiet ke', 'theo yêu cầu', 'yêu cầu', 'yeu cau', 'custom', 'đặt thiết kế'],
    giaongay: ['giao ngay', 'lấy luôn', 'lay luon', 'gấp', 'gap', 'nhanh'],
    deal: ['deal', 'ưu đãi', 'uu dai', 'khuyến mãi', 'khuyen mai', 'theo mùa', 'mùa'],
    donhang: ['đơn hàng', 'don hang', 'mã đơn', 'ma don', 'tra cứu', 'tra cuu'],
    sukien: ['sự kiện', 'su kien', 'workshop', 'trang trí', 'trang tri'],
    cskh: ['cskh', 'sau mua', 'bảo quản', 'bao quan', 'đã nhận hoa', 'da nhan hoa', 'hướng dẫn', 'huong dan']
  },

  // Nội dung phản hồi theo nhánh
  flows: {
    mau: {
      text: [
        'Dạ, Hạ Miên xin gửi bạn các mẫu hoa đã có tại tiệm ạ. (đính kèm link bộ sưu tập)',
        'Bạn ưng ý mẫu nào thì đừng quên nói cho Hạ Miên nhé!'
      ],
      next: ['Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Tư vấn']
    },
    tuvan: {
      text: [
        'Bạn muốn Hạ Miên tư vấn về phần nào ạ? (ý nghĩa hoa, đối tượng, dịp tặng, chăm sóc, giấy gói, gợi ý mẫu cho không gian...)',
        'Bạn có thể nói từ khóa như: “nhẹ nhàng”, “tình đầu”, “sang trọng”, “chung thủy”... để Miên gợi ý nhanh nhé!'
      ],
      next: ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu']
    },
    thietke: {
      text: [
        'Mình giúp bạn đặt hoa theo thiết kế nha. Bạn vui lòng cho Hạ Miên biết:',
        '- Bố cục/hình thức (trái tim, tròn, bó, hộp, giỏ, lẵng, ...)',
        '- Màu chủ đạo',
        '- Giấy gói mong muốn',
        '- Số lượng và ngân sách dự kiến',
        'Bạn yêu vui lòng xác nhận lại yêu cầu giúp Hạ Miên nhé! Nếu cần gấp, vui lòng liên hệ hotline để được hỗ trợ nhanh.'
      ],
      next: ['Đặt hoa giao ngay', 'Tư vấn']
    },
    giaongay: {
      text: [
        'Bạn yêu vui lòng liên hệ tới hotline: 0987654321 để đặt hoa trong thời gian nhanh nhất nhé.'
      ],
      next: ['Đặt hoa theo mẫu']
    },
    deal: {
      text: [
        'Hạ Miên có các deal hot theo mùa nè! Mình cập nhật theo những loài hoa đang vào vụ với số lượng dồi dào, giá đẹp.',
        'Bạn quan tâm loại hoa hoặc tone nào để Miên gửi ưu đãi phù hợp nhé.'
      ],
      next: ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu']
    },
    donhang: {
      text: [
        'Bạn vui lòng gửi cho Hạ Miên mã đơn hàng để tiệm tiện tra cứu thông tin cho bạn nè.'
      ],
      next: []
    },
    sukien: {
      text: [
        'Để tư vấn tổ chức sự kiện, bạn giúp Miên biết quy mô, concept, số lượng hoa, thời gian... nha.',
        'Bạn yêu vui lòng xác nhận lại thông tin giúp Hạ Miên.'
      ],
      next: []
    },
    cskh: {
      text: [
        'Hạ Miên nhận được thông tin hoa đã giao đến bạn rồi ạ, hoa đến tay bạn có đúng giờ và còn giữ độ tươi không ạ?',
        'Nếu cần, Miên gửi lại hướng dẫn bảo quản để hoa bền đẹp hơn nha.',
        'Cảm ơn bạn đã tin tưởng lựa chọn Hạ Miên giữa vô vàn shop hoa khác. Miên xin gửi bạn chút quà nhỏ cho lần sử dụng dịch vụ tiếp theo (voucher).'
      ],
      next: []
    },
    fallback: {
      text: [
        'Hạ Miên xin phép được hiểu ý bạn như sau, bạn đang cần tư vấn đặt hoa phải không ạ?',
        'Bạn có thể chọn nhanh một trong các nội dung bên dưới để Miên hỗ trợ tốt hơn nha.'
      ],
      next: ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Hỏi về đơn hàng']
    }
  },

  // Dialogflow intents manifest (base names)
  dialogflowManifest: [
    'ixinchao', 'idathoa', 'idathoachotdon', 'idathoaconhucau', 'idathoaconhucaukhacdathoa',
    'idathoadichvudikem', 'idathoadichvudikemphanhoi', 'idathoagap', 'idathoagiaohang', 'idathoatgiandiadiemgiaohang',
    'idathoathamkhaothaydoitheonhucau', 'idathoaxemmau', 'idathoaxemmautuvan', 'idealhotthang10', 'idealhotthang11',
    'idichvukhacdecortochucsukien', 'idichvukhacworkshop', 'idonhang', 'iphiship', 'ituvan'
  ],

  // Dialogflow entities manifest (base names)
  entitiesManifest: [
    'exinchao',
    'edathoa', 'edathoachotdon', 'edathoaconhucau', 'edathoaconhucaukhacdathoa',
    'edathoadichvudikem', 'edathoadichvudikemphanhoi', 'edathoagap', 'edathoagiaohang',
    'edathoatgiandiadiemgiaohang', 'edathoathamkhao', 'edathoaxemmau', 'edathoaxemmmautuvan',
    'edealhotheothang', 'edealhottheothang', 'edichvukhac', 'edichvukhacdecortochucsukien',
    'edonhang', 'ephiship', 'etuvan', 'ecamon', 'echamsockhachhang', 'echamsockhachhangphanhoi', 'echuyenkhoan'
  ]
};

// Hàm để cấu hình AI API
function configureAI(apiKey, endpoint = null) {
  if (window.hamienChatbot) {
    window.hamienChatbot.configureAI(apiKey, endpoint);
    CHATBOT_CONFIG.ai.enabled = true;
    CHATBOT_CONFIG.ai.apiKey = apiKey;
    if (endpoint) {
      CHATBOT_CONFIG.ai.endpoint = endpoint;
    }
    console.log('AI API đã được cấu hình thành công!');
  } else {
    console.error('Chatbot chưa được khởi tạo');
  }
}

// Hàm để bật/tắt AI
function toggleAI(enabled) {
  CHATBOT_CONFIG.ai.enabled = enabled;
  console.log(`AI ${enabled ? 'đã được bật' : 'đã được tắt'}`);
}

// Hàm để xóa lịch sử chat
function clearChatHistory() {
  if (window.hamienChatbot) {
    window.hamienChatbot.clearHistory();
    console.log('Lịch sử chat đã được xóa');
  }
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHATBOT_CONFIG;
}

// Expose to browser global
try { window.CHATBOT_CONFIG = CHATBOT_CONFIG; } catch (_) {}
