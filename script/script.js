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
document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chatbot-button");
  const chatBox = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chat-close");
  const chatBodyEl = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input-field");
  const chatSend = document.getElementById("chat-send");

  if (chatButton && chatBox) {
    chatButton.addEventListener("click", () => {
      chatBox.classList.toggle("hidden");
    });
  }

  if (closeBtn && chatBox) {
    closeBtn.addEventListener("click", () => {
      chatBox.classList.add("hidden");
    });
  }

  // Ủy quyền sự kiện cho các nút gợi ý (.suggest-btn)
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target && target.classList && target.classList.contains("suggest-btn")) {
      const userChoice = target.innerText.trim();
      addUserMessage(userChoice, chatBodyEl);
      handleBotReply(userChoice);
    }
  });

  // Gửi tin nhắn qua nút Gửi
  if (chatSend && chatInput) {
    chatSend.addEventListener("click", () => {
      const value = chatInput.value.trim();
      if (!value) return;
      addUserMessage(value, chatBodyEl);
      handleBotReply(value);
      chatInput.value = "";
    });
  }

  // Gửi khi nhấn Enter
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = chatInput.value.trim();
        if (!value) return;
        addUserMessage(value, chatBodyEl);
        handleBotReply(value);
        chatInput.value = "";
      }
    });
  }
});

// Hàm tạo tin nhắn khách
function addUserMessage(text, chatBodyEl) {
  const chatBody = chatBodyEl || document.getElementById("chat-body");
  if (!chatBody) return;
  const message = document.createElement("div");
  message.className = "user-message";
  message.innerText = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Hàm tạo tin nhắn bot
function addBotMessage(text, chatBodyEl) {
  const chatBody = chatBodyEl || document.getElementById("chat-body");
  if (!chatBody) return;
  const message = document.createElement("div");
  message.className = "bot-message";
  message.innerText = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Xử lý phản hồi theo từng lựa chọn
function handleBotReply(choice) {
  switch (choice) {
    case "Đặt hoa theo mẫu":
      addBotMessage("Dạ, Hạ Miên xin gửi bạn các mẫu hoa đã có tại tiệm ạ. (gắn link hoặc carousel sau)");
      break;
    case "Tư vấn":
      addBotMessage("Bạn muốn Hạ Miên tư vấn theo nội dung nào? (ý nghĩa hoa / đối tượng / dịp tặng / cách chăm sóc...)");
      break;
    case "Thiết kế theo yêu cầu":
      addBotMessage("Bạn có thể mô tả mong muốn về mẫu hoa (màu sắc, hình thức, giá, giấy gói...) để Hạ Miên hỗ trợ nhé!");
      break;
    case "Đặt hoa giao ngay":
      addBotMessage("Bạn vui lòng liên hệ hotline 0972554569 để được đặt hoa nhanh nhất nhé!");
      break;
    case "Deal hot theo mùa":
      addBotMessage("Hiện đang có ưu đãi dành cho hoa theo mùa, bạn muốn xem loại hoa nào ạ?");
      break;
    case "Hỏi về đơn hàng":
      addBotMessage("Bạn vui lòng gửi mã đơn hàng để Hạ Miên tra cứu giúp nhé!");
      break;
    case "Tổ chức sự kiện":
      addBotMessage("Bạn có thể cho Hạ Miên biết quy mô, concept, số lượng hoa và thời gian dự kiến không ạ?");
      break;
    case "CSKH sau mua":
      addBotMessage("Hoa giao tới bạn có đúng giờ và còn giữ độ tươi không ạ?");
      break;
    case "Khác":
      addBotMessage("hỏi cái gì");
      break;
    default:
      addBotMessage("Hạ Miên chưa hiểu ý bạn, bạn vui lòng chọn lại hoặc gọi hotline 0972554569 nhé!");
      break;
  }
}
