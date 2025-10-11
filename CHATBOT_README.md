# 🌸 Hạ Miên Chatbot - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Chatbot Hạ Miên đã được tích hợp hoàn toàn vào website chính với khả năng:
- ✅ **100% trả lời bằng tiếng Việt**
- ✅ **Tích hợp sâu với dữ liệu Dialogflow**
- ✅ **Liên kết trực tiếp đến các trang/sản phẩm**
- ✅ **Responses thông minh và sáng tạo**

## 🚀 Tính Năng Chính

### 1. **Smart Vietnamese Responses**
- Hiểu được mọi câu hỏi tiếng Việt
- Trả lời bằng tiếng Việt hoàn toàn
- Responses thú vị và hài hước

### 2. **Dialogflow Integration**
- **25+ Intents**: ichaohoi, idathoa, ituvan, idealhot, etc.
- **25+ Entities**: echaohoi, edathoa, etuvan, eloaihoa, etc.
- **Entity Recognition**: Tự động nhận diện entities trong tin nhắn
- **Contextual Responses**: Phản hồi dựa trên ngữ cảnh

### 3. **Smart Links Integration**
- **Dịch vụ** → Liên kết đến `services.html`
- **Sản phẩm/Hoa** → Liên kết đến `shop.html`
- **Địa chỉ/Liên hệ** → Liên kết đến `contact.html`
- **Giá cả** → Liên kết đến `shop.html`
- **Thông tin** → Liên kết đến `about.html`

## 🎯 Các Câu Hỏi Được Hỗ Trợ

### **Chào Hỏi**
- "xin chào", "hello", "hi", "hé lô", "hí lu", "lô", "alooo"

### **Dịch Vụ**
- "dịch vụ", "services" → Liên kết đến `services.html`

### **Sản Phẩm**
- "sản phẩm", "hoa", "product" → Liên kết đến `shop.html`

### **Đặt Hoa**
- "đặt hoa", "order", "mua hoa" → Liên kết đến `shop.html`

### **Tư Vấn**
- "tư vấn", "advice", "hỏi", "tôi muốn hỏi"

### **Giá Cả**
- "giá", "giá cả", "price", "bao nhiêu tiền" → Liên kết đến `shop.html`

### **Giao Hàng**
- "giao hàng", "ship", "delivery"

### **Địa Chỉ**
- "địa chỉ", "address", "ở đâu" → Liên kết đến `contact.html`

### **Hotline**
- "hotline", "số điện thoại", "phone" → Liên kết đến `contact.html`

### **Thông Tin**
- "thông tin", "info" → Liên kết đến `about.html`

## 🔧 Cấu Trúc Files

```
script/
├── chatbot.js              # Core chatbot logic
├── dialogflow-loader.js    # Dialogflow data loader
├── chatbot-config.js       # Chatbot configuration
└── script.js              # Main website scripts

css/
└── chatbot.css            # Chatbot styling

intents/                   # Dialogflow intents
├── ichaohoi.json
├── idathoa.json
├── ituvan.json
└── ... (25+ intents)

entities/                  # Dialogflow entities
├── echaohoi.json
├── edathoa.json
├── etuvan.json
└── ... (25+ entities)
```

## 📱 Tích Hợp Trên Website

### **Các Trang Đã Tích Hợp**
- ✅ `index.html` - Trang chủ
- ✅ `about.html` - Giới thiệu
- ✅ `services.html` - Dịch vụ
- ✅ `contact.html` - Liên hệ
- ✅ `shop.html` - Cửa hàng

### **Chatbot Widget**
```html
<div id="chatbot-widget">
  <div id="chatbot-button">💬</div>
  <div id="chatbot-box" class="hidden">
    <!-- Chat interface -->
  </div>
</div>
```

### **Initialization**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  window.hamienChatbot = new HaMienChatbot();
  window.hamienChatbot.init();
});
```

## 🎨 Styling

Chatbot sử dụng CSS trong `css/chatbot.css` với:
- Gradient background
- Smooth animations
- Responsive design
- Modern UI/UX

## 🚀 Cách Sử Dụng

1. **Mở website** - Chatbot tự động khởi tạo
2. **Click nút 💬** - Mở chat interface
3. **Nhập câu hỏi** - Chatbot sẽ trả lời bằng tiếng Việt
4. **Click links** - Chuyển đến trang/sản phẩm tương ứng

## 🔍 Debug & Monitoring

### **Console Logs**
```javascript
// Khởi tạo
🚀 Initializing Hạ Miên Chatbot...
✅ Chatbot initialized successfully!

// Intent matching
🎯 Matched Dialogflow intent: ichaohoi

// Entity recognition
🔍 Found entities: echaohoi, edathoa
```

### **Error Handling**
- Graceful fallback khi Dialogflow không load được
- Error logging trong console
- Fallback responses cho mọi tình huống

## 📊 Performance

- **Parallel Loading**: Tải Dialogflow data song song
- **Caching**: Sử dụng localStorage để cache data
- **Optimized Matching**: Thuật toán matching tối ưu
- **Fast Responses**: Responses được tối ưu cho tốc độ

## 🎉 Kết Quả

Chatbot Hạ Miên giờ đây:
- ✅ **Hoàn toàn bằng tiếng Việt**
- ✅ **Tích hợp sâu với Dialogflow**
- ✅ **Liên kết thông minh đến các trang**
- ✅ **Responses sáng tạo và thú vị**
- ✅ **Hoạt động ổn định trên web chính**

---

**Chatbot đã sẵn sàng phục vụ khách hàng trên website chính! 🌸✨**





