// script.js

// === 1. Toggle menu ===
// === Toggle menu ===
// === Toggle menu ===
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});


// === 2. Simple Calendar ===
const calendarEl = document.getElementById("calendar");

// Lấy ngày hiện tại
let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();

renderCalendar(month, year);

function renderCalendar(month, year) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Lấy ngày đầu tiên của tháng
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = `
    <div class="cal-header">
      <button id="prev">&#10094;</button>
      <span>${monthNames[month]} ${year}</span>
      <button id="next">&#10095;</button>
    </div>
    <table class="cal-table">
      <thead>
        <tr>
          <th>Su</th><th>Mo</th><th>Tu</th><th>We</th>
          <th>Th</th><th>Fr</th><th>Sa</th>
        </tr>
      </thead>
      <tbody>
  `;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    html += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        html += "<td></td>";
      } else if (date > daysInMonth) {
        html += "<td></td>";
      } else {
        let isToday =
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth();
        html += `<td class="day ${isToday ? "today" : ""}">${date}</td>`;
        date++;
      }
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  calendarEl.innerHTML = html;

  // gắn sự kiện chuyển tháng
  document.getElementById("prev").onclick = () => {
    month = month - 1;
    if (month < 0) {
      month = 11;
      year--;
    }
    renderCalendar(month, year);
  };

  document.getElementById("next").onclick = () => {
    month = month + 1;
    if (month > 11) {
      month = 0;
      year++;
    }
    renderCalendar(month, year);
  };

  // sự kiện chọn ngày
  calendarEl.querySelectorAll(".day").forEach((cell) => {
    cell.addEventListener("click", () => {
      calendarEl.querySelectorAll(".selected").forEach((el) =>
        el.classList.remove("selected")
      );
      cell.classList.add("selected");
      alert(`Bạn chọn ngày ${cell.textContent} / ${month + 1} / ${year}`);
    });
  });
}