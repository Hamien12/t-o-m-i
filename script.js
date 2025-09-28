// script.js - minimal interactivity
const products = [
    {id:1,name:'Bó Hoa Hồng Đỏ',price:450000,img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60'},
{id:2,name:'Hoa Ly Tinh Khôi',price:380000,img:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60'},
{id:3,name:'Bó Hoa Màu Pastel',price:320000,img:'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=60'}
]


const productGrid = document.getElementById('product-grid')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsEl = document.getElementById('cart-items')
const cartTotalEl = document.getElementById('cart-total')
const closeCart = document.getElementById('close-cart')
const checkout = document.getElementById('checkout')
const yearEl = document.getElementById('year')


yearEl.textContent = new Date().getFullYear()


function formatVND(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫' }


function renderProducts(){
productGrid.innerHTML = ''
products.forEach(p => {
const card = document.createElement('article')
card.className = 'card'
card.innerHTML = `
<img src="${p.img}" alt="${p.name}"/>
<div class="card-body">
<h4>${p.name}</h4>
<div class="price">${formatVND(p.price)}</div>
<button class="btn" data-id="${p.id}">Thêm vào giỏ</button>
</div>
`
productGrid.appendChild(card)
})
}


function getCart(){
return JSON.parse(localStorage.getItem('bloom_cart')||'[]')
}
function saveCart(cart){ localStorage.setItem('bloom_cart',JSON.stringify(cart)) }


function addToCart(id){
const p = products.find(x=>x.id===id)
if(!p) return
const cart = getCart()
const found = cart.find(i=>i.id===id)
if(found) found.qty++
else cart.push({id:p.id,name:p.name,price:p.price,qty:1})
saveCart(cart)
updateCartBadge()
}


function updateCartBadge(){
const cart = getCart()
const totalQty = cart.reduce((s,i)=>s+i.qty,0)
cartBtn.textContent = `Giỏ (${totalQty})`
}


function openCart(){
const cart = getCart()
cartItemsEl.innerHTML = ''
if(cart.length===0){ cartItemsEl.innerHTML = '<p>Giỏ hàng trống.</p>' }
else{
cart.forEach(item =>{
const row = document.createElement('div')
row.style.display='flex'
row.style.justifyContent='space-between'
row.style.marginBottom='.6rem'
row.innerHTML = `<div>${item.name} x ${item.qty}</div><div>${formatVND(item.price*item.qty)}</div>`
cartItemsEl.appendChild(row)

})
}
const total = cart.reduce((s,i)=>s+i.qty*i.price,0)
cartTotalEl.textContent = formatVND(total)
cartModal.setAttribute('aria-hidden','false')
}


function closeCartModal(){ cartModal.setAttribute('aria-hidden','true') }


productGrid.addEventListener('click', e=>{
const btn = e.target.closest('button')
if(!btn) return
const id = Number(btn.dataset.id)
addToCart(id)
})


cartBtn.addEventListener('click', openCart)
closeCart.addEventListener('click', closeCartModal)
checkout.addEventListener('click', ()=>{
alert('Demo: trang này không thực hiện thanh toán thật. Cảm ơn bạn!')
localStorage.removeItem('bloom_cart')
updateCartBadge()
closeCartModal()
})


// Contact form (demo)
const contactForm = document.getElementById('contact-form')
contactForm.addEventListener('submit', e=>{
e.preventDefault()
const name = document.getElementById('name').value.trim()
const email = document.getElementById('email').value.trim()
const message = document.getElementById('message').value.trim()
if(!name||!email||!message){ alert('Vui lòng điền đầy đủ.'); return }
// Demo: show success and reset
alert('Cảm ơn ' + name + '! Tin nhắn của bạn đã được ghi nhận (demo).')
contactForm.reset()
})


// Initialize
renderProducts()
updateCartBadge()