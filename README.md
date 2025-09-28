# Bloom — One-page flower shop (demo)


Mục tiêu: tạo 1 trang bán hàng 1 page, học cách triển khai lên GitHub Pages và chèn chatbot chăm sóc khách hàng.


## Bước 1 — Mở project trong VS Code
1. Tạo thư mục mới `flower-shop-onepage` và mở bằng VS Code.
2. Tạo các file: `index.html`, `styles.css`, `script.js`, `README.md`.
3. Dán nội dung tương ứng từ file này vào các file trong VS Code.


## Bước 2 — Chạy thử tại local
- Bạn có thể mở file `index.html` trực tiếp trong trình duyệt.
- Tốt hơn: cài extension Live Server trong VS Code và chạy "Live Server" để preview.


## Bước 3 — Khởi tạo git và push lên GitHub
1. Trong terminal (VS Code):
```bash
git init
git add .
git commit -m "Initial commit: Bloom one-page"
# Tạo repo mới trên GitHub (ví dụ: bloom-demo)
# Sau khi tạo repo, kết nối remote:
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```


## Bước 4 — Bật GitHub Pages
1. Vào repository trên GitHub > Settings > Pages (hoặc "Code and automation" → "Pages").
2. Ở phần **Build and deployment** chọn **Deploy from a branch** và chọn **main** (hoặc branch bạn dùng) và folder là **root** (/) nếu dùng single-page files.
3. Lưu và chờ vài phút để GitHub build và cấp URL: `https://<USERNAME>.github.io/<REPO>/` (hoặc `https://<USERNAME>.github.io/` nếu là repository tên `username.github.io`).


> Nếu bạn muốn hướng dẫn chi tiết từng bước GUI, tham khảo GitHub Docs (README chat message kèm links).


## Bước 5 — Thêm chatbot chăm sóc khách hàng
1. Đăng ký tài khoản ở nhà cung cấp chat (ví dụ: Tidio, Crisp, Intercom, v.v.).
2. Trong dashboard nhà cung cấp sẽ có 1 đoạn mã JavaScript (embed script). Sao chép và dán vào file `index.html` ở vị trí họ hướng dẫn (thường là trước `</body>` hoặc trong `<head>`).
3. Commit và push thay đổi, GitHub Pages sẽ cập nhật site và chatbot sẽ hiện lên.


## Gợi ý cải tiến (bài tập tiếp theo)
- Thêm trang checkout thật (stripe/test mode).
- Lưu giỏ hàng với backend (Firebase / Netlify Functions).
- Thêm form đặt hàng, xác thực, và quản lý đơn hàng.


----




Enjoy! Copy files into a folder and tiếp tục theo README để deploy.