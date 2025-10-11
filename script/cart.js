// ==========================
// CART MANAGEMENT SYSTEM
// ==========================

function formatVND(n){return (n||0).toLocaleString('vi-VN')+'đ'}

function loadCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch { return []; }
}

function saveCart(items){
  localStorage.setItem('cart', JSON.stringify(items));
  updateCartBadge();
}

function updateCartBadge(){
  const countEl = document.querySelector('.cart-badge');
  if (countEl) {
    const items = loadCart();
    countEl.textContent = items.length;
    countEl.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => countEl.style.animation = '', 500);
  }
}

// Promo codes database
const PROMO_CODES = {
  'WELCOME10': { discount: 0.1, type: 'percentage', description: 'Giảm 10% cho khách hàng mới' },
  'SAVE20': { discount: 0.2, type: 'percentage', description: 'Giảm 20% cho đơn hàng trên 500k' },
  'FREESHIP': { discount: 50000, type: 'fixed', description: 'Miễn phí ship' },
  'HAMIEN50': { discount: 50000, type: 'fixed', description: 'Giảm 50k cho đơn hàng trên 300k' }
};

let appliedPromo = null;

function renderCart(){
  const items = loadCart();
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('empty-cart');
  const qtyEl = document.getElementById('cart-qty');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const shippingEl = document.getElementById('shipping-fee');
  const discountRow = document.getElementById('discount-row');
  const discountAmount = document.getElementById('discount-amount');

  if (!items.length){
    list.innerHTML = '';
    empty.style.display = 'block';
    qtyEl.textContent = '0';
    subtotalEl.textContent = formatVND(0);
    totalEl.textContent = formatVND(0);
    shippingEl.textContent = 'Miễn phí';
    discountRow.style.display = 'none';
    return;
  }
  empty.style.display = 'none';

  // Gộp các item cùng id
  const merged = [];
  for (const it of items){
    const found = merged.find(m=>m.id===it.id);
    if (found){ found.qty += 1; }
    else { merged.push({ ...it, qty: 1 }); }
  }

  list.innerHTML = merged.map(it=>`
    <div class="cart-item" data-id="${it.id}">
      <div class="cart-thumb" style="background-image:url('${it.image || 'image/services.png'}')"></div>
      <div class="cart-info">
        <div class="cart-name">${it.name}</div>
        <div class="cart-price">${formatVND(it.price)}</div>
        <div class="cart-description">Hoa tươi chất lượng cao từ Hạ Miên</div>
        <div class="qty">
          <button class="dec">-</button>
          <span class="num">${it.qty}</span>
          <button class="inc">+</button>
          <button class="remove">Xóa</button>
        </div>
      </div>
      <div class="cart-price">${formatVND(it.price * it.qty)}</div>
    </div>
  `).join('');

  const totalQty = merged.reduce((s,it)=>s+it.qty,0);
  const subtotal = merged.reduce((s,it)=>s+it.price*it.qty,0);
  
  // Calculate shipping (free for orders over 300k)
  const shippingFee = subtotal >= 300000 ? 0 : 50000;
  
  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === 'percentage') {
      discount = subtotal * promo.discount;
    } else {
      discount = promo.discount;
    }
  }
  
  const total = subtotal + shippingFee - discount;
  
  qtyEl.textContent = String(totalQty);
  subtotalEl.textContent = formatVND(subtotal);
  shippingEl.textContent = shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee);
  
  if (discount > 0) {
    discountRow.style.display = 'flex';
    discountAmount.textContent = '-' + formatVND(discount);
  } else {
    discountRow.style.display = 'none';
  }
  
  totalEl.textContent = formatVND(total);

  // Bind actions
  list.querySelectorAll('.inc').forEach(btn=>btn.addEventListener('click',()=>changeQty(btn, +1)));
  list.querySelectorAll('.dec').forEach(btn=>btn.addEventListener('click',()=>changeQty(btn, -1)));
  list.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click',()=>removeItem(btn)));
}

function changeQty(btn, delta){
  const itemEl = btn.closest('.cart-item');
  const id = itemEl.dataset.id;
  const items = loadCart();
  if (delta>0){
    const src = items.find(i=>i.id===id);
    // Nếu chưa có, thêm mới 1; nếu có, thêm 1
    items.push(src || { id, name: itemEl.querySelector('.cart-name').textContent, price: parseInt(itemEl.querySelector('.cart-price').textContent.replace(/\D/g,'')), image: itemEl.querySelector('.cart-thumb').style.backgroundImage });
  } else {
    const idx = items.findIndex(i=>i.id===id);
    if (idx>-1) items.splice(idx,1);
  }
  saveCart(items);
  renderCart();
}

function removeItem(btn){
  const itemEl = btn.closest('.cart-item');
  const id = itemEl.dataset.id;
  
  // Animate removal
  animateItemRemoval(itemEl);
  
  // Remove from cart
  const items = loadCart().filter(i=>i.id!==id);
  saveCart(items);
  
  // Show notification
  showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
  
  // Re-render after animation
  setTimeout(() => {
    renderCart();
  }, 300);
}

// Promo code functions
function applyPromoCode(code) {
  const promo = PROMO_CODES[code.toUpperCase()];
  const messageEl = document.getElementById('promo-message');
  
  if (!promo) {
    showPromoMessage('Mã giảm giá không hợp lệ', 'error');
    return false;
  }
  
  const items = loadCart();
  const subtotal = items.reduce((s, it) => s + it.price, 0);
  
  // Check conditions
  if (code.toUpperCase() === 'SAVE20' && subtotal < 500000) {
    showPromoMessage('Mã SAVE20 chỉ áp dụng cho đơn hàng từ 500k', 'error');
    return false;
  }
  
  if (code.toUpperCase() === 'HAMIEN50' && subtotal < 300000) {
    showPromoMessage('Mã HAMIEN50 chỉ áp dụng cho đơn hàng từ 300k', 'error');
    return false;
  }
  
  appliedPromo = code.toUpperCase();
  showPromoMessage(`Đã áp dụng mã ${code.toUpperCase()}: ${promo.description}`, 'success');
  renderCart();
  return true;
}

function showPromoMessage(message, type) {
  const messageEl = document.getElementById('promo-message');
  messageEl.textContent = message;
  messageEl.className = `promo-message ${type}`;
  messageEl.style.display = 'block';
  
  if (type === 'success') {
    messageEl.style.color = '#28a745';
    messageEl.style.backgroundColor = '#d4edda';
    messageEl.style.border = '1px solid #c3e6cb';
  } else {
    messageEl.style.color = '#dc3545';
    messageEl.style.backgroundColor = '#f8d7da';
    messageEl.style.border = '1px solid #f5c6cb';
  }
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

// Animation functions
function animateItemRemoval(itemEl) {
  itemEl.classList.add('removing');
  setTimeout(() => {
    itemEl.remove();
  }, 300);
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : '#17a2b8'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize cart
document.addEventListener('DOMContentLoaded',()=>{
  renderCart();
  updateCartBadge();
  
  // Clear cart button
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click',()=>{ 
      if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
        saveCart([]); 
        renderCart();
        showNotification('Đã xóa tất cả sản phẩm trong giỏ hàng', 'success');
      }
    });
  }
  
  // Checkout button
  const checkout = document.getElementById('checkout');
  if (checkout) {
    checkout.addEventListener('click',()=>{
      const items = loadCart();
      if (items.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
      }
      
      // Simulate checkout process
      checkout.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      checkout.disabled = true;
      
      setTimeout(() => {
        alert('Cảm ơn bạn đã mua hàng! Đơn hàng sẽ được xử lý trong 24h. Chúng tôi sẽ liên hệ để xác nhận đơn hàng.');
        saveCart([]);
        renderCart();
        checkout.innerHTML = '<i class="fas fa-credit-card"></i> Thanh toán';
        checkout.disabled = false;
      }, 2000);
    });
  }
  
  // Promo code functionality
  const promoInput = document.getElementById('promo-code');
  const applyPromoBtn = document.getElementById('apply-promo');
  
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      if (code) {
        applyPromoCode(code);
        promoInput.value = '';
      }
    });
  }
  
  if (promoInput) {
    promoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const code = promoInput.value.trim();
        if (code) {
          applyPromoCode(code);
          promoInput.value = '';
        }
      }
    });
  }
});


