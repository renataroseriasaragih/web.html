let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let time = workDuration;
let timer;
let isRunning = false;
let isWorkSession = true;
let sessionCount = 0;
let completedWorkSessions = 0;

const display = document.getElementById("timer");
const label = document.getElementById("session-label");
const counter = document.getElementById("session-counter");
let alarmSound = document.getElementById("alarm-sound");

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  display.classList.add("tick");
  setTimeout(() => display.classList.remove("tick"), 150);
}

function updateCounter() {
  counter.textContent = `Sesi selesai: ${sessionCount}`;
}

function notifyUser(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body: message });
      }
    });
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (time > 0) {
        time--;
        updateDisplay();
      } else {
        clearInterval(timer);
        alarmSound.play();
        isRunning = false;

        if (isWorkSession) {
          completedWorkSessions++;
          sessionCount++;
          updateCounter();

          if (completedWorkSessions % 4 === 0) {
            time = longBreakDuration;
            label.textContent = "Long Break 🌴";
            notifyUser("Waktunya istirahat panjang!", "Ambil waktu untuk relaks.");
          } else {
            time = breakDuration;
            label.textContent = "Break Time";
            notifyUser("Istirahat dulu!", "Sesi kerja selesai. Saatnya break.");
          }
        } else {
          time = workDuration;
          label.textContent = "Focus Session";
          notifyUser("Ayo fokus lagi!", "Sesi break selesai. Saatnya kerja.");
        }

        isWorkSession = !isWorkSession;
        updateDisplay();
        startTimer(); // auto lanjut
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  sessionCount = 0;
  completedWorkSessions = 0;
  updateCounter();

  const workInput = parseInt(document.getElementById("work-minutes").value);
  const breakInput = parseInt(document.getElementById("break-minutes").value);
  const longBreakInput = parseInt(document.getElementById("long-break-minutes").value);

  workDuration = workInput * 60;
  breakDuration = breakInput * 60;
  longBreakDuration = longBreakInput * 60;
  time = workDuration;
  label.textContent = "Focus Session";
  updateDisplay();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function changeTheme() {
  const theme = document.getElementById("theme-select").value;
  const timerEl = document.getElementById("timer");

  const colorMap = {
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
    purple: "#7c3aed"
  };

  timerEl.style.color = colorMap[theme] || "#dc2626";
}

function changeSound() {
  const selected = document.getElementById("sound-select").value;
  if (selected === "alarm1") {
    alarmSound = document.getElementById("alarm-sound");
  } else if (selected === "alarm2") {
    alarmSound = document.getElementById("alarm2");
  } else if (selected === "alarm3") {
    alarmSound = document.getElementById("alarm3");
  }
}

resetTimer(); // initial run
