document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  function renderCalendar(month, year) {
    calendarEl.innerHTML = "";

    const header = document.createElement("div");
    header.className = "calendar-header";
    header.innerHTML = `
      <button id="prev">&#8249;</button>
      <span>${months[month]} ${year}</span>
      <button id="next">&#8250;</button>
    `;
    calendarEl.appendChild(header);

    const daysEl = document.createElement("div");
    daysEl.className = "calendar-days";
    calendarEl.appendChild(daysEl);

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Thêm ngày trống trước ngày 1
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      const empty = document.createElement("div");
      empty.className = "empty";
      daysEl.appendChild(empty);
    }

    // Render các ngày trong tháng
    for (let d = 1; d <= daysInMonth; d++) {
      const day = document.createElement("div");
      day.className = "day";
      day.textContent = d;

      if (
        d === today.getDate() &&
        year === today.getFullYear() &&
        month === today.getMonth()
      ) {
        day.classList.add("today");
      }

      day.addEventListener("click", () => {
        document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        day.classList.add("selected");
      });

      daysEl.appendChild(day);
    }

    document.getElementById("prev").onclick = () => {
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    };

    document.getElementById("next").onclick = () => {
      currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    };
  }

  renderCalendar(currentMonth, currentYear);
});



document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
});
 



document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  function renderCalendar(month, year) {
    calendarEl.innerHTML = "";

    const header = document.createElement("div");
    header.className = "calendar-header";
    header.innerHTML = `
      <button id="prev">&#8249;</button>
      <span>${months[month]} ${year}</span>
      <button id="next">&#8250;</button>
    `;
    calendarEl.appendChild(header);

    const daysEl = document.createElement("div");
    daysEl.className = "calendar-days";
    calendarEl.appendChild(daysEl);

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Thêm ngày trống trước ngày 1
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      const empty = document.createElement("div");
      empty.className = "empty";
      daysEl.appendChild(empty);
    }

    // Render các ngày trong tháng
    for (let d = 1; d <= daysInMonth; d++) {
      const day = document.createElement("div");
      day.className = "day";
      day.textContent = d;

      if (
        d === today.getDate() &&
        year === today.getFullYear() &&
        month === today.getMonth()
      ) {
        day.classList.add("today");
      }

      day.addEventListener("click", () => {
        document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        day.classList.add("selected");
      });

      daysEl.appendChild(day);
    }

    document.getElementById("prev").onclick = () => {
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    };

    document.getElementById("next").onclick = () => {
      currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    };
  }

  renderCalendar(currentMonth, currentYear);
});



document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Arrow scroll for category carousel on Services
  document.querySelectorAll('.category-carousel .arrow').forEach(function(btn){
    btn.addEventListener('click', function(){
      var targetSel = btn.getAttribute('data-target');
      var track = document.querySelector(targetSel);
      if(!track) return;
      var delta = track.clientWidth * 0.8;
      track.scrollBy({ left: btn.classList.contains('left') ? -delta : delta, behavior: 'smooth' });
      setTimeout(function(){
        // Disable arrows at edges
        var maxScroll = track.scrollWidth - track.clientWidth - 1;
        var leftBtn = track.parentElement.querySelector('.arrow.left');
        var rightBtn = track.parentElement.querySelector('.arrow.right');
        if(leftBtn) leftBtn.disabled = track.scrollLeft <= 0;
        if(rightBtn) rightBtn.disabled = track.scrollLeft >= maxScroll;
      }, 200);
    });
  });
  // Init disabled state on load
  document.querySelectorAll('.category-carousel .track').forEach(function(track){
    var leftBtn = track.parentElement.querySelector('.arrow.left');
    var rightBtn = track.parentElement.querySelector('.arrow.right');
    function update(){
      if(leftBtn) leftBtn.disabled = track.scrollLeft <= 0;
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      if(rightBtn) rightBtn.disabled = track.scrollLeft >= maxScroll;
    }
    update();
    track.addEventListener('scroll', function(){
      clearTimeout(track._t); track._t = setTimeout(update, 60);
    });
  });
  // Generic carousel arrows (deal/featured)
  document.querySelectorAll('.carousel .arrow').forEach(function(btn){
    btn.addEventListener('click', function(){
      var targetSel = btn.getAttribute('data-target');
      var track = document.querySelector(targetSel);
      if(!track) return;
      var delta = track.clientWidth * 0.8;
      track.scrollBy({ left: btn.classList.contains('left') ? -delta : delta, behavior: 'smooth' });
      setTimeout(function(){
        var maxScroll = track.scrollWidth - track.clientWidth - 1;
        var leftBtn = track.parentElement.querySelector('.arrow.left');
        var rightBtn = track.parentElement.querySelector('.arrow.right');
        if(leftBtn) leftBtn.disabled = track.scrollLeft <= 0;
        if(rightBtn) rightBtn.disabled = track.scrollLeft >= maxScroll;
      }, 200);
    });
  });
  document.querySelectorAll('.carousel .track').forEach(function(track){
    var leftBtn = track.parentElement.querySelector('.arrow.left');
    var rightBtn = track.parentElement.querySelector('.arrow.right');
    if(leftBtn) leftBtn.disabled = track.scrollLeft <= 0;
    var maxScroll = track.scrollWidth - track.clientWidth - 1;
    if(rightBtn) rightBtn.disabled = track.scrollLeft >= maxScroll;
  });

  // Category modal
  var modal = document.createElement('div');
  modal.className = 'svc-modal hidden';
  modal.innerHTML = '<div class="overlay"></div><div class="dialog"><button class="close">×</button><h4 id="modal-title"></h4><p>Danh sách sản phẩm sẽ hiển thị tại đây theo danh mục bạn chọn.</p><button class="cta">Xem ngay</button></div>';
  document.body.appendChild(modal);

  function openModal(title){
    modal.classList.remove('hidden');
    modal.querySelector('#modal-title').textContent = title;
  }
  function closeModal(){ modal.classList.add('hidden'); }
  modal.querySelector('.overlay').addEventListener('click', closeModal);
  modal.querySelector('.close').addEventListener('click', closeModal);

  document.querySelectorAll('.cat-card').forEach(function(b){
    b.addEventListener('click', function(){ openModal(b.innerText.trim()); });
  });
  // Set background images from data-img for cards
  document.querySelectorAll('.cat-card.with-img, .pill-card.with-img').forEach(function(el){
    var img = el.getAttribute('data-img');
    if(img){ el.style.backgroundImage = 'url("'+img+'")'; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; }
  });
});

// ===== Simple Shop interactions =====
document.addEventListener("DOMContentLoaded", function(){
  var root = document.querySelector('.shop');
  if(!root) return;
  var filterToggle = root.querySelector('.filter-toggle');
  var productsEl = root.querySelector('#products');
  var searchEl = root.querySelector('#shop-search');
  var sortEl = root.querySelector('#shop-sort');
  var pagesEl = root.querySelector('.pagination .pages');
  var prevBtn = root.querySelector('.pagination .prev');
  var nextBtn = root.querySelector('.pagination .next');

  if(filterToggle){
    filterToggle.addEventListener('click', function(){
      document.body.classList.toggle('filter-open');
      var expanded = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', (!expanded).toString());
    });
  }

  // Build pagination (mock)
  var currentPage = 1;
  var pageSize = 8;
  function visibleItems(){
    return Array.from(productsEl.querySelectorAll('.product')).filter(function(el){return el.style.display!=="none";});
  }
  function buildPages(total){
    if(!pagesEl) return;
    pagesEl.innerHTML='';
    var max = Math.max(1, Math.ceil(total / pageSize));
    for(var i=1;i<=max;i++){
      var b=document.createElement('button');
      b.textContent=i;
      if(i===currentPage) b.classList.add('active');
      (function(page){ b.addEventListener('click', function(){ currentPage = page; renderPage(); }); })(i);
      pagesEl.appendChild(b);
    }
    if(prevBtn) prevBtn.disabled = currentPage<=1;
    if(nextBtn) nextBtn.disabled = currentPage>=max;
  }

  function renderPage(){
    var items = visibleItems();
    var max = Math.max(1, Math.ceil(items.length / pageSize));
    if(currentPage>max) currentPage=max;
    items.forEach(function(el, idx){
      var start = (currentPage-1)*pageSize;
      var end = start + pageSize;
      el.style.visibility = (idx>=start && idx<end) ? 'visible' : 'hidden';
      el.style.position = (idx>=start && idx<end) ? '' : 'absolute';
    });
    buildPages(items.length);
  }

  function applyFilters(){
    var q = (searchEl && searchEl.value || '').toLowerCase();
    var cats = Array.from(root.querySelectorAll('input[name="cat"]:checked')).map(function(i){return i.value;});
    var min = parseFloat(root.querySelector('#min-price')?.value||'0')||0;
    var max = parseFloat(root.querySelector('#max-price')?.value||'0')||Infinity;
    var activeColors = Array.from(root.querySelectorAll('.chip.active')).map(function(c){return c.getAttribute('data-color');});

    var items = Array.from(productsEl.querySelectorAll('.product'));
    items.forEach(function(card){
      var name = card.querySelector('h5').textContent.toLowerCase();
      var price = parseFloat(card.getAttribute('data-price'))||0;
      var cat = card.getAttribute('data-cat');
      var color = card.getAttribute('data-color');
      var ok = true;
      if(q && !name.includes(q)) ok=false;
      if(cats.length && !cats.includes(cat)) ok=false;
      if(price < min || price > max) ok=false;
      if(activeColors.length && !activeColors.includes(color)) ok=false;
      card.style.display = ok ? '' : 'none';
    });

    // Sort
    var by = sortEl && sortEl.value;
    if(by){
      items.sort(function(a,b){
        var pa=parseFloat(a.getAttribute('data-price'))||0;
        var pb=parseFloat(b.getAttribute('data-price'))||0;
        if(by==='price-asc') return pa-pb;
        if(by==='price-desc') return pb-pa;
        return 0;
      });
      items.forEach(function(el){ productsEl.appendChild(el); });
    }

    currentPage = 1;
    buildPages(visibleItems().length);
    renderPage();
  }

  // Events
  searchEl && searchEl.addEventListener('input', applyFilters);
  sortEl && sortEl.addEventListener('change', applyFilters);
  root.querySelector('#apply-price')?.addEventListener('click', applyFilters);
  root.querySelectorAll('.chip').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('active'); applyFilters(); });
  });
  root.querySelectorAll('input[name="cat"]').forEach(function(cb){ cb.addEventListener('change', applyFilters); });

  // Pagination prev/next
  prevBtn && prevBtn.addEventListener('click', function(){ if(currentPage>1){ currentPage--; renderPage(); } });
  nextBtn && nextBtn.addEventListener('click', function(){ currentPage++; renderPage(); });

  buildPages(productsEl.querySelectorAll('.product').length);
  renderPage();

  // Set product images from data-img
  productsEl.querySelectorAll('.product').forEach(function(p){
    var img = p.getAttribute('data-img');
    if(img){
      var th = p.querySelector('.thumb');
      th.style.backgroundImage = 'url("'+img+'")';
      th.style.backgroundSize = 'cover';
      th.style.backgroundPosition = 'center';
    }
    // Add to cart toast
    p.querySelector('.add').addEventListener('click', function(){ showToast('Đã thêm '+ p.querySelector('h5').textContent +' vào giỏ.'); });
  });

  // Category/Deal/Featured click to filter & scroll
  function filterByCategory(cat){
    root.querySelectorAll('input[name="cat"]').forEach(function(cb){ cb.checked = cb.value===cat; });
    applyFilters();
    document.getElementById('products').scrollIntoView({behavior:'smooth'});
    closeModal();
  }
  document.querySelectorAll('.cat-card').forEach(function(btn){
    btn.addEventListener('dblclick', function(){ filterByCategory(btn.getAttribute('data-category')); });
  });
  document.querySelectorAll('#deal-grid .pill-card, #featured-grid .pill-card').forEach(function(card){
    card.addEventListener('click', function(){ document.getElementById('products').scrollIntoView({behavior:'smooth'}); });
  });

  // Modal CTA
  modal.querySelector('.cta').addEventListener('click', function(){
    var title = modal.querySelector('#modal-title').textContent.toLowerCase();
    var map = { 'bó hoa':'bouquet','giỏ hoa':'basket','hộp hoa':'box','hoa cưới':'wedding','hoa chia buồn':'condolence' };
    var key = Object.keys(map).find(function(k){return title.includes(k);});
    if(key) filterByCategory(map[key]); else closeModal();
  });

  // Toast helper
  function showToast(msg){
    var t = document.createElement('div');
    t.className='toast';
    t.textContent=msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 250); }, 2000);
  }

  // Swipe and keyboard navigation for carousels
  function enableSwipe(track){
    var startX = 0; var scrolling = false;
    track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; scrolling = true; }, {passive:true});
    track.addEventListener('touchmove', function(e){ if(!scrolling) return; var dx = e.touches[0].clientX - startX; track.scrollLeft -= dx; startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(){ scrolling=false; });
  }
  document.querySelectorAll('.category-carousel .track, .carousel .track').forEach(function(t){ enableSwipe(t); });
  document.addEventListener('keydown', function(e){
    if(['ArrowLeft','ArrowRight'].includes(e.key)){
      var focused = document.activeElement;
      var wrap = focused && focused.closest('.category-carousel, .carousel');
      var container = wrap || document.querySelector('.category-carousel');
      if(!container) return;
      var track = container.querySelector('.track');
      var delta = track.clientWidth * 0.8;
      track.scrollBy({ left: e.key==='ArrowLeft' ? -delta : delta, behavior: 'smooth' });
    }
  });
});
// Chatbot functionality has been moved to chatbot.js
function goToService(id) {
  switch (id) {
    case 1:
      window.location.href = "#nhan-dat-hoa";
      break;
    case 2:
      window.location.href = "#deal-hot";
      break;
    case 3:
      window.location.href = "#workshop";
      break;
    default:
      console.log("Không có dịch vụ này!");
  }
}
