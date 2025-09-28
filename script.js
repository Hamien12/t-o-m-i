// script.js - xử lý giỏ hàng demo

// Lấy các phần tử cần dùng
const cartBtn = document.querySelector(".cart-btn");
const cartCount = document.querySelector(".cart-count");
const cartModal = document.getElementById("cartModal");
const closeCart = document.querySelector(".close");
const cartItemsList = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cartTotal");

// Biến lưu giỏ hàng
let cart = [];

// Hiển thị modal giỏ hàng
cartBtn.addEventListener("click", () => {
  cartModal.setAttribute("aria-hidden", "false");
});

// Đóng modal
closeCart.addEventListener("click", () => {
  cartModal.setAttribute("aria-hidden", "true");
});

// Xử lý thêm sản phẩm
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productEl = btn.closest(".card-body");
    const name = productEl.querySelector("h4").textContent;
    const priceText = productEl.querySelector(".price").textContent;
    const price = parseFloat(priceText.replace(/[^\d]/g, "")); // lấy số

    addToCart({ name, price });
  });
});

// Hàm thêm sản phẩm vào giỏ
function addToCart(product) {
  // kiểm tra nếu sản phẩm đã có trong giỏ thì tăng số lượng
  let found = cart.find((item) => item.name === product.name);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// Render giỏ hàng
function renderCart() {
  cartItemsList.innerHTML = "";

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} - ${item.price.toLocaleString()}đ`;

    // nút xóa
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      removeFromCart(idx);
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = total.toLocaleString() + "đ";
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}
