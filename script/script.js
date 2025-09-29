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
