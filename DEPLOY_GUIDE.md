# 🚀 Hướng dẫn Deploy Website Hạ Miên lên GitHub Pages

## 📋 Yêu cầu trước khi bắt đầu

- ✅ Tài khoản GitHub
- ✅ Git đã cài đặt trên máy
- ✅ Website Hạ Miên đã hoàn thiện (có chatbot AI)

## 🎯 Các bước thực hiện

### Bước 1: Chuẩn bị Repository

#### 1.1 Tạo repository mới trên GitHub
1. Đăng nhập vào [GitHub.com](https://github.com)
2. Click **"New repository"** (nút xanh lá)
3. Điền thông tin:
   - **Repository name**: `hamien-website` (hoặc tên bạn muốn)
   - **Description**: `Website Hạ Miên với Chatbot AI`
   - **Public** ✅ (bắt buộc cho GitHub Pages miễn phí)
   - **Add README** ❌ (chúng ta đã có sẵn)
   - **Add .gitignore** ❌ (chúng ta đã có sẵn)
4. Click **"Create repository"**

#### 1.2 Clone repository về máy
```bash
# Thay 'yourusername' bằng username GitHub của bạn
git clone https://github.com/yourusername/hamien-website.git
cd hamien-website
```

### Bước 2: Upload Code

#### 2.1 Copy toàn bộ file website vào repository
```bash
# Copy tất cả file từ thư mục t-o-m-i/ vào thư mục hamien-website/
# Đảm bảo có các file sau:
# - index.html
# - about.html
# - services.html
# - contact.html
# - css/ (thư mục)
# - script/ (thư mục)
# - image/ (thư mục)
# - README.md
# - .gitignore
```

#### 2.2 Commit và push code
```bash
# Thêm tất cả file
git add .

# Commit với message mô tả
git commit -m "Initial commit: Hạ Miên website with AI chatbot

- Responsive website với 4 trang
- Chatbot AI thông minh
- Tích hợp OpenAI API
- Giao diện hiện đại
- Mobile-friendly"

# Push lên GitHub
git push origin main
```

### Bước 3: Enable GitHub Pages

#### 3.1 Vào Settings của repository
1. Trên trang GitHub repository
2. Click tab **"Settings"** (ở menu trên)

#### 3.2 Cấu hình GitHub Pages
1. Scroll xuống phần **"Pages"** (sidebar trái)
2. Trong **"Source"**:
   - Chọn **"Deploy from a branch"**
3. Trong **"Branch"**:
   - Chọn **"main"** (hoặc "master")
4. Trong **"Folder"**:
   - Chọn **"/ (root)"**
5. Click **"Save"**

#### 3.3 Chờ deploy
- GitHub sẽ tự động build và deploy
- Thời gian: 2-5 phút
- Bạn sẽ thấy link website xuất hiện

### Bước 4: Truy cập Website

#### 4.1 URL Website
Website sẽ có sẵn tại:
```
https://yourusername.github.io/hamien-website
```

#### 4.2 Kiểm tra hoạt động
1. Mở link website
2. Test các trang: Home, About, Services, Contact
3. Test chatbot: Click icon 💬
4. Test responsive trên mobile

## 🔧 Cấu hình Chatbot AI (Tùy chọn)

### Nếu muốn tích hợp OpenAI API:

#### 1. Lấy API Key
1. Đăng ký tài khoản [OpenAI](https://platform.openai.com)
2. Tạo API key mới
3. Copy API key

#### 2. Cấu hình trên website
```javascript
// Mở console browser trên website đã deploy
// Chạy lệnh sau:
configureAI('sk-your-openai-api-key-here');
```

#### 3. Test AI
- Gửi tin nhắn cho chatbot
- Kiểm tra phản hồi AI

## 📱 Custom Domain (Tùy chọn)

### Nếu muốn dùng domain riêng:

#### 1. Mua domain
- Mua domain từ nhà cung cấp (GoDaddy, Namecheap, etc.)

#### 2. Cấu hình DNS
```
Type: CNAME
Name: www
Value: yourusername.github.io
```

#### 3. Thêm file CNAME
```bash
# Tạo file CNAME trong root repository
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

#### 4. Cập nhật GitHub Pages settings
- Vào Settings > Pages
- Thêm custom domain
- Enable HTTPS

## 🚨 Troubleshooting

### Website không load
1. **Kiểm tra URL**: Đảm bảo URL đúng format
2. **Kiểm tra repository**: Đảm bảo repository public
3. **Kiểm tra Pages settings**: Đảm bảo đã enable Pages
4. **Chờ deploy**: Có thể mất vài phút

### Chatbot không hoạt động
1. **Kiểm tra console**: Mở F12 > Console xem lỗi
2. **Kiểm tra file**: Đảm bảo chatbot.js được load
3. **Kiểm tra API**: Nếu dùng AI, kiểm tra API key

### CSS không load
1. **Kiểm tra đường dẫn**: Đảm bảo đường dẫn CSS đúng
2. **Kiểm tra file**: Đảm bảo file CSS tồn tại
3. **Clear cache**: Refresh browser với Ctrl+F5

### Mobile không responsive
1. **Kiểm tra viewport**: Đảm bảo có meta viewport
2. **Kiểm tra CSS**: Đảm bảo có media queries
3. **Test trên thiết bị thật**: Không chỉ dựa vào dev tools

## 📊 Monitoring và Analytics

### Google Analytics (Tùy chọn)
1. Tạo tài khoản Google Analytics
2. Lấy tracking code
3. Thêm vào `<head>` của tất cả trang:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔄 Cập nhật Website

### Khi có thay đổi:
```bash
# Chỉnh sửa file
# Sau đó:
git add .
git commit -m "Update: Mô tả thay đổi"
git push origin main
```

### GitHub Pages sẽ tự động:
- Detect thay đổi
- Rebuild website
- Deploy phiên bản mới

## 🎉 Hoàn thành!

Sau khi hoàn thành các bước trên, bạn sẽ có:

✅ **Website live**: https://yourusername.github.io/hamien-website
✅ **Chatbot AI**: Hoạt động trên tất cả trang
✅ **Responsive**: Tương thích mobile/desktop
✅ **SEO Ready**: Sẵn sàng cho Google
✅ **Free Hosting**: GitHub Pages miễn phí
✅ **Custom Domain**: Có thể dùng domain riêng

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra GitHub Pages documentation
2. Xem troubleshooting section trên
3. Tạo issue trên GitHub repository
4. Liên hệ developer

---

**Chúc bạn deploy thành công!** 🚀

Website Hạ Miên với Chatbot AI sẽ giúp nâng cao trải nghiệm khách hàng và tăng doanh số bán hàng! 🌸
