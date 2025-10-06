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
    welcomeMessage: 'Xin chào! Tôi là chatbot của Hạ Miên 🌸 Tôi có thể giúp bạn tư vấn về các dịch vụ hoa tươi của chúng tôi. Bạn cần hỗ trợ gì ạ?',
    suggestions: [
      'Đặt hoa theo mẫu',
      'Tư vấn về hoa',
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
  }
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
