# Hạ Miên Chatbot AI

## Tổng quan
Chatbot AI thông minh cho website Hạ Miên với khả năng tư vấn khách hàng về các dịch vụ hoa tươi.

## Tính năng

### ✨ Tính năng chính
- **Chatbot thông minh**: Tích hợp AI để trả lời tự nhiên
- **Phản hồi thông minh**: Hiểu ngữ cảnh và đưa ra câu trả lời phù hợp
- **Giao diện đẹp**: Thiết kế hiện đại, responsive
- **Lưu lịch sử**: Tự động lưu cuộc trò chuyện
- **Gợi ý nhanh**: Các nút gợi ý để khách hàng dễ dàng tương tác
- **Tích hợp API**: Hỗ trợ OpenAI API hoặc API tương tự

### 🎯 Chức năng chatbot
- Tư vấn về các loại hoa
- Hướng dẫn đặt hàng
- Thông tin về dịch vụ giao hàng
- Tư vấn tổ chức sự kiện
- Hỗ trợ khách hàng sau mua
- Cung cấp thông tin liên hệ

## Cài đặt

### 1. Tích hợp vào website
```html
<!-- Thêm vào <head> -->
<link rel="stylesheet" href="css/chatbot.css">

<!-- Thêm vào cuối <body> -->
<script src="script/chatbot-config.js"></script>
<script src="script/chatbot.js"></script>
```

### 2. Cấu hình AI API (Tùy chọn)
```javascript
// Trong file chatbot-config.js hoặc console
configureAI('your-openai-api-key-here');
```

### 3. Tùy chỉnh cấu hình
Chỉnh sửa file `script/chatbot-config.js`:
```javascript
const CHATBOT_CONFIG = {
  ai: {
    enabled: true, // Bật/tắt AI
    apiKey: 'your-api-key',
    // ... các cấu hình khác
  },
  chatbot: {
    name: 'Tên chatbot của bạn',
    welcomeMessage: 'Tin nhắn chào mừng',
    // ...
  }
};
```

## Sử dụng

### Khách hàng
1. Click vào icon chatbot ở góc phải màn hình
2. Chọn gợi ý có sẵn hoặc nhập câu hỏi
3. Chatbot sẽ trả lời tự động

### Quản trị viên
```javascript
// Bật/tắt AI
toggleAI(true);

// Xóa lịch sử chat
clearChatHistory();

// Cấu hình API mới
configureAI('new-api-key');
```

## Cấu trúc file

```
t-o-m-i/
├── css/
│   └── chatbot.css          # Styles cho chatbot
├── script/
│   ├── chatbot-config.js    # Cấu hình chatbot
│   ├── chatbot.js          # Logic chatbot chính
│   └── script.js           # Script gốc (đã loại bỏ chatbot cũ)
└── index.html              # HTML chính
```

## Tùy chỉnh

### Thay đổi giao diện
Chỉnh sửa file `css/chatbot.css`:
- Màu sắc: Thay đổi các biến CSS
- Vị trí: Sửa `position` trong CSS
- Kích thước: Điều chỉnh `width`, `height`

### Thêm phản hồi mới
Chỉnh sửa hàm `getFallbackResponse()` trong `script/chatbot.js`:
```javascript
if (lowerMessage.includes('từ khóa mới')) {
  return "Phản hồi mới cho từ khóa này";
}
```

### Thay đổi gợi ý
Chỉnh sửa `CHATBOT_CONFIG.chatbot.suggestions` trong `script/chatbot-config.js`

## API Integration

### OpenAI API
```javascript
configureAI('sk-your-openai-api-key');
```

### API khác
```javascript
configureAI('your-api-key', 'https://your-api-endpoint.com/chat');
```

## Troubleshooting

### Chatbot không hiển thị
1. Kiểm tra console để xem lỗi
2. Đảm bảo các file CSS và JS được load đúng
3. Kiểm tra ID elements trong HTML

### AI không hoạt động
1. Kiểm tra API key có đúng không
2. Kiểm tra kết nối internet
3. Kiểm tra quota API
4. Chatbot sẽ tự động fallback về phản hồi cố định

### Lỗi CSS
1. Kiểm tra file `chatbot.css` có được load không
2. Kiểm tra conflict với CSS khác
3. Sử dụng browser dev tools để debug

## Phát triển

### Thêm tính năng mới
1. Mở rộng class `HaMienChatbot` trong `chatbot.js`
2. Thêm methods mới
3. Cập nhật UI nếu cần

### Tích hợp database
```javascript
// Thêm vào class HaMienChatbot
async saveToDatabase(chatData) {
  // Logic lưu vào database
}
```

## License
MIT License - Sử dụng tự do cho mục đích thương mại và cá nhân.

## Hỗ trợ
Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser
2. Xem lại cấu hình
3. Liên hệ developer

---
**Hạ Miên Chatbot** - Nâng cao trải nghiệm khách hàng với AI thông minh! 🌸
