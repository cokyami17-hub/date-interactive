const PAGE_IDS = [
  "page-envelope",
  "page-question",
  "page-date",
  "page-activity",
  "page-dresscode",
  "page-message",
  "page-result"
];

function nextPage(pageId) {
  const target = document.getElementById(pageId);
  const title = document.getElementById("window-title");
  if (!target) return;

  PAGE_IDS.forEach(id => {
    const page = document.getElementById(id);
    if (page) page.classList.toggle("hidden", id !== pageId);
  });

  if (pageId === "page-envelope") title.textContent = "FROM SOMEONE";
  else if (pageId === "page-question") title.textContent = "A LITTLE QUESTION";
  else if (pageId === "page-result") title.textContent = "IT'S A DATE!";
  else title.textContent = "DATE PLANNER";

  // Kembalikan tombol NO ke posisi awal saat halaman pertanyaan dibuka lagi.
  if (pageId === "page-question") {
    const noButton = document.getElementById("btn-no");
    noButton.style.transform = "translate(0, 0)";
  }
}

function moveNo() {
  const button = document.getElementById("btn-no");
  const area = button.parentElement;
  const maxX = Math.max(20, area.clientWidth / 2 - button.offsetWidth / 2 - 5);
  const maxY = 24;
  const x = (Math.random() * 2 - 1) * maxX;
  const y = (Math.random() * 2 - 1) * maxY;
  button.style.transform = `translate(${x}px, ${y}px)`;
}

function continueWithDate() {
  const dateInput = document.getElementById("date-input");
  const timeInput = document.getElementById("time-input");

  if (!dateInput.value || !timeInput.value) {
    alert("Pilih tanggal dan jamnya dulu ya ❤️");
    return;
  }

  const selectedDate = new Date(`${dateInput.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("Pilih tanggal hari ini atau setelahnya ya.");
    dateInput.focus();
    return;
  }

  nextPage("page-activity");
}


function generateTicket() {
  const dateValue = document.getElementById("date-input").value;
  const timeValue = document.getElementById("time-input").value;

  const activities = Array.from(
    document.querySelectorAll('input[name="activity"]:checked')
  ).map(input => input.value);

  const dress = document.querySelector('input[name="dresscode"]:checked');
  const message = document.getElementById("custom-message").value.trim();

  if (!dateValue || !timeValue) {
    alert("Tanggal dan jamnya belum diisi.");
    nextPage("page-date");
    return;
  }

  if (activities.length === 0) {
    alert("Pilih minimal satu aktivitas dulu ya ❤️");
    nextPage("page-activity");
    return;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);

  document.getElementById("res-date").textContent = formattedDate;
  document.getElementById("res-time").textContent = timeValue;

  // Gabungkan seluruh aktivitas yang dipilih.
  document.getElementById("res-activity").textContent =
    activities.join(", ");

  document.getElementById("res-dress").textContent =
    dress ? dress.value : "-";

  document.getElementById("res-msg").textContent =
    message || "Semangat ya harinya! ❤️";

  nextPage("page-result");
}

async function downloadTicket() {
  const ticket = document.getElementById("ticket-card");
  if (typeof html2canvas !== "function") {
    alert("Fitur simpan tiket belum termuat. Coba refresh halaman dan ulangi ya.");
    return;
  }

  try {
    const canvas = await html2canvas(ticket, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    });
    const link = document.createElement("a");
    link.download = "Tiket_Kencan_Spesial.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Gagal membuat gambar tiket:", error);
    alert("Tiket belum berhasil disimpan. Coba lagi ya.");
  }
}


function sendWhatsApp() {
  const date = document.getElementById("res-date").textContent.trim();
  const time = document.getElementById("res-time").textContent.trim();
  const activity = document.getElementById("res-activity").textContent.trim();
  const dress = document.getElementById("res-dress").textContent.trim();
  const message = document.getElementById("res-msg").textContent.trim();

  const text = `💕 AA sayanggg!

Adek udah siapin sesuatu buat kita nih...
Tiket kencan spesial dari adek! 🥺💗

╭────── ⋆｡°✩ ──────╮
       💌 OUR DATE PLAN
╰────── ⋆｡°✩ ──────╯

📅 Hari/Tanggal
${date}

⏰ Waktu
${time}

🎀 Aktivitas
${activity}

👗 Dress Code
${dress}

💬 Pesan dari adek
"${message}"

━━━━━━━━━━━━━━

Jangan lupa datang yaa!
Adek udah nggak sabar buat ketemu AA. 🥰

See you, my favorite person! 💗`;
  const phone = "6285165565720";
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;


  window.open(url, "_blank");
}


function restartPlanner() {
  document.getElementById("custom-message").value = "";

  document.querySelectorAll('input[name="activity"]').forEach(input => {
    input.checked =
      input.value === "Nonton Film, Main Game, Ngerumpi";
  });

  document.querySelector('input[name="dresscode"][value="Bebas"]').checked = true;

  nextPage("page-envelope");
}

// Tanggal default otomatis hari ini, jadi tidak tertinggal pada tanggal lama.
(function setInitialDate() {
  const input = document.getElementById("date-input");
  if (!input) return;
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
  input.min = localDate;
  input.value = localDate;
})();


// Maksimal 3 pilihan aktivitas
document.querySelectorAll('input[name="activity"]').forEach(input => {
  input.addEventListener("change", function() {
    const selected = document.querySelectorAll(
      'input[name="activity"]:checked'
    );

    if (selected.length > 3) {
      this.checked = false;
      alert("Maksimal pilih 3 aktivitas ya ❤️");
    }
  });
});


//background music toggle

async function toggleMusic() {
  const music = document.getElementById("background-music");
  const button = document.getElementById("music-toggle");

  // Kalau sedang diputar atau masih dalam proses loading
  if (!music.paused) {
    music.pause();
    button.textContent = "♫ Putar Musik";
    return;
  }

  button.textContent = "♫ Memuat Musik...";

  try {
    await music.play();

    // Update tombol setelah berhasil diputar
    button.textContent = "♫ Pause Musik";

  } catch (error) {

    // Abaikan AbortError karena biasanya terjadi
    // ketika perintah play dibatalkan oleh pause.
    if (error.name === "AbortError") {
      button.textContent = music.paused
        ? "♫ Putar Musik"
        : "♫ Pause Musik";
      return;
    }

    console.error("Musik gagal diputar:", error);
    button.textContent = "♫ Putar Musik";
    alert("Musik gagal diputar. Periksa file audio ya.");
  }
}


const musicPlayer = document.getElementById("background-music");
const musicButton = document.getElementById("music-toggle");

musicPlayer.addEventListener("play", () => {
  musicButton.textContent = "♫ Pause Musik";
});

musicPlayer.addEventListener("pause", () => {
  musicButton.textContent = "♫ Putar Musik";
});

