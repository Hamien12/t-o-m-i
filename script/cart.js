function formatVND(n){return (n||0).toLocaleString('vi-VN')+'đ'}

function loadCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch { return []; }
}

function saveCart(items){
  localStorage.setItem('cart', JSON.stringify(items));
  const countEl = document.querySelector('.cart-count');
  if (countEl) countEl.textContent = items.length;
}

function renderCart(){
  const items = loadCart();
  const list = document.getElementById('cart-items');
  const empty = document.getElementById('empty-cart');
  const qtyEl = document.getElementById('cart-qty');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (!items.length){
    list.innerHTML = '';
    empty.style.display = 'block';
    qtyEl.textContent = '0';
    subtotalEl.textContent = formatVND(0);
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
      <div>
        <div class="cart-name">${it.name}</div>
        <div class="cart-price">${formatVND(it.price)}</div>
        <div class="qty">
          <button class="dec">-</button>
          <span class="num">${it.qty}</span>
          <button class="inc">+</button>
          <button class="remove" style="margin-left:8px;color:#dc3545;background:#fff;border:1px solid #f1c0c0">Xóa</button>
        </div>
      </div>
      <div class="cart-price">${formatVND(it.price * it.qty)}</div>
    </div>
  `).join('');

  const totalQty = merged.reduce((s,it)=>s+it.qty,0);
  const subtotal = merged.reduce((s,it)=>s+it.price*it.qty,0);
  qtyEl.textContent = String(totalQty);
  subtotalEl.textContent = formatVND(subtotal);

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
  const id = btn.closest('.cart-item').dataset.id;
  const items = loadCart().filter(i=>i.id!==id);
  saveCart(items);
  renderCart();
}

document.addEventListener('DOMContentLoaded',()=>{
  renderCart();
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) clearBtn.addEventListener('click',()=>{ saveCart([]); renderCart(); });
  const checkout = document.getElementById('checkout');
  if (checkout) checkout.addEventListener('click',()=>{
    alert('Cảm ơn bạn! Tính năng thanh toán sẽ được tích hợp sau.');
  });
});


