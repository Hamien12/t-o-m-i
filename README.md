# 🌸 Hạ Miên - Website Hoa Tươi

Website chính thức của cửa hàng hoa tươi Hạ Miên với chatbot AI thông minh.

## 🌟 Tính năng

### ✨ Website
- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI/UX**: Giao diện hiện đại, thân thiện
- **Multi-page**: Home, About, Services, Contact
- **Fast Loading**: Tối ưu tốc độ tải trang

### 🤖 Chatbot AI
- **AI-Powered**: Tích hợp OpenAI API
- **Smart Responses**: Phản hồi thông minh dựa trên ngữ cảnh
- **Quick Suggestions**: Gợi ý nhanh cho khách hàng
- **Chat History**: Lưu lịch sử trò chuyện
- **Multi-language**: Hỗ trợ tiếng Việt

## 🚀 Live Demo

🌐 **Website**: [hamien.github.io](https://hamien.github.io)

## 📁 Cấu trúc dự án

```
t-o-m-i/
├── css/
│   ├── base.css              # CSS cơ bản
│   ├── header.css           # Header styles
│   ├── animations.css       # Animations
│   ├── home.css             # Trang chủ
│   ├── about.css            # Trang giới thiệu
│   ├── services.css         # Trang dịch vụ
│   ├── contact.css          # Trang liên hệ
│   └── chatbot.css          # Chatbot styles
├── script/
│   ├── script.js            # JavaScript chính
│   ├── chatbot.js           # Chatbot logic
│   └── chatbot-config.js    # Chatbot config
├── image/
│   ├── logo.png             # Logo
│   ├── about/               # Ảnh về
│   ├── services.png         # Ảnh dịch vụ
│   └── contact.png          # Ảnh liên hệ
├── index.html               # Trang chủ
├── about.html               # Trang giới thiệu
├── services.html            # Trang dịch vụ
├── contact.html             # Trang liên hệ
├── CHATBOT_README.md         # Hướng dẫn chatbot
└── README.md                # File này
```

## 🛠️ Cài đặt và chạy local

### 1. Clone repository
```bash
git clone https://github.com/yourusername/hamien-website.git
cd hamien-website
```

### 2. Mở website
```bash
# Sử dụng Live Server (VS Code extension)
# Hoặc mở trực tiếp file index.html trong browser
```

### 3. Cấu hình Chatbot AI (Tùy chọn)
```javascript
// Mở console browser và chạy:
configureAI('your-openai-api-key-here');
```

## 🤖 Chatbot Features

### Tính năng chính
- ✅ **AI Integration**: OpenAI GPT-3.5-turbo
- ✅ **Smart Fallback**: Phản hồi thông minh khi không có AI
- ✅ **Context Awareness**: Hiểu ngữ cảnh cuộc trò chuyện
- ✅ **Quick Actions**: Gợi ý nhanh cho khách hàng
- ✅ **Chat History**: Lưu lịch sử tự động
- ✅ **Responsive**: Hoạt động tốt trên mobile

### Các chức năng chatbot
- 🌸 Tư vấn về hoa tươi
- 📦 Hướng dẫn đặt hàng
- 🚚 Thông tin giao hàng
- 🎉 Tổ chức sự kiện
- 💬 CSKH sau mua
- 📞 Thông tin liên hệ

## 🎨 Customization

### Thay đổi màu sắc
Chỉnh sửa file `css/base.css`:
```css
:root {
  --bg: #f4f7ef;        /* Background */
  --accent: #5a7c46;    /* Màu chính */
  --text: #333;         /* Màu chữ */
  --muted: #555;        /* Màu phụ */
}
```

### Thêm phản hồi chatbot
Chỉnh sửa hàm `getFallbackResponse()` trong `script/chatbot.js`:
```javascript
if (lowerMessage.includes('từ khóa mới')) {
  return "Phản hồi mới cho từ khóa này";
}
```

## 📱 Responsive Design

Website được thiết kế responsive với:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🌐 Deploy lên GitHub Pages

### 1. Tạo GitHub Repository
```bash
# Tạo repository mới trên GitHub
# Clone về máy local
git clone https://github.com/yourusername/hamien-website.git
```

### 2. Upload code
```bash
cd hamien-website
git add .
git commit -m "Initial commit: Hạ Miên website with AI chatbot"
git push origin main
```

### 3. Enable GitHub Pages
1. Vào **Settings** của repository
2. Scroll xuống **Pages** section
3. Chọn **Source**: Deploy from a branch
4. Chọn **Branch**: main
5. Chọn **Folder**: / (root)
6. Click **Save**

### 4. Truy cập website
Sau vài phút, website sẽ có sẵn tại:
`https://yourusername.github.io/hamien-website`

## 🔧 Troubleshooting

### Chatbot không hiển thị
1. Kiểm tra console browser để xem lỗi
2. Đảm bảo các file CSS và JS được load đúng
3. Kiểm tra ID elements trong HTML

### AI không hoạt động
1. Kiểm tra API key có đúng không
2. Kiểm tra kết nối internet
3. Kiểm tra quota API
4. Chatbot sẽ tự động fallback về phản hồi cố định

### GitHub Pages không load
1. Kiểm tra repository settings
2. Đảm bảo file index.html ở root
3. Kiểm tra GitHub Pages status

## 📞 Liên hệ

- **Website**: [hamien.github.io](https://hamien.github.io)
- **Email**: support@hamien.com
- **Phone**: 0987654321
- **Address**: 422 Vĩnh Hưng

## 📄 License

MIT License - Sử dụng tự do cho mục đích thương mại và cá nhân.

## 🙏 Acknowledgments

- OpenAI API cho chatbot AI
- Font Awesome cho icons
- Google Fonts cho typography

---

**Hạ Miên** - Nơi những bông hoa kể câu chuyện của tình yêu 🌸

Made with ❤️ by Hạ Miên Team