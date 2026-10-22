const opening = document.querySelector("#opening");
const openButton = document.querySelector("#open-invitation");
const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const musicStatus = document.querySelector("#music-status");
const guestName = document.querySelector("#guest-name");
const countdown = document.querySelector("#countdown");
const rsvpForm = document.querySelector("#rsvp-form");
const feedback = document.querySelector("#rsvp-feedback");

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
  guestName.textContent = guest.trim();
}

function updateMusicButton(isPlaying) {
  musicLabel.textContent = isPlaying ? "Jeda Musik" : "Putar Musik";
  musicToggle.setAttribute("aria-label", isPlaying ? "Jeda musik latar" : "Putar musik latar");
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
}

async function playBackgroundMusic() {
  try {
    await backgroundMusic.play();
    musicStatus.textContent = "";
  } catch (error) {
    if (error.name === "NotAllowedError") {
      musicStatus.textContent = "Browser menolak pemutaran otomatis. Tekan tombol Putar Musik.";
    } else {
      musicStatus.textContent = `Musik gagal diputar (${error.name}). Periksa file audio dan formatnya.`;
    }
  }
}

backgroundMusic.addEventListener("play", () => updateMusicButton(true));
backgroundMusic.addEventListener("pause", () => updateMusicButton(false));
backgroundMusic.addEventListener("error", () => {
  musicStatus.textContent = "File audio tidak ditemukan atau formatnya tidak didukung. Periksa nama file dan lokasinya.";
});

musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    playBackgroundMusic();
  } else {
    backgroundMusic.pause();
  }
});

openButton.addEventListener("click", () => {
  opening.classList.add("is-hidden");
  document.body.classList.remove("invitation-locked");
  playBackgroundMusic();
});

document.body.classList.add("invitation-locked");

function updateCountdown() {
  const targetDate = new Date(countdown.dataset.date).getTime();
  const remaining = Math.max(0, targetDate - Date.now());
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };

  Object.entries(units).forEach(([unit, value]) => {
    countdown.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const name = String(formData.get("name")).trim();
  const attendance = String(formData.get("attendance"));

  feedback.textContent = `Terima kasih, ${name}. Konfirmasi "${attendance}" sudah dicatat di halaman ini.`;
  rsvpForm.reset();
});

document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const nav = document.querySelector("#invitationNav");
    if (nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });
});
