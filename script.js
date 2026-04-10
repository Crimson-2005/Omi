// ================== AOS ==================
AOS.init({
  duration: 800,
  once: true
});

// ================== ELEMENTS ==================
const timerEl = document.getElementById("intro-timer");
const revealBtn = document.getElementById("revealBtn");
const loadingScreen = document.getElementById("loading");
const music = document.getElementById("birthdayMusic");
const heartContainer = document.querySelector('.hearts');
const balloonArea = document.getElementById('balloons');

let time = 5;
let heartScore = 0;
let heartInterval;
let fallingWordsInterval;

// ================== PRELOAD AUDIO (IMPORTANT) ==================
if (music) {
  music.load();
}

// ================== LOADING COUNTDOWN ==================
const countdown = setInterval(() => {
  time--;
  timerEl.innerText = time;

  if (time <= 0) {
    clearInterval(countdown);
    revealBtn.classList.remove("hidden");
  }
}, 1000);

// ================== REVEAL BUTTON ==================
revealBtn.addEventListener("click", () => {
  // Fade out loading screen
  loadingScreen.style.transition = "opacity 0.8s";
  loadingScreen.style.opacity = "0";
  setTimeout(() => { loadingScreen.style.display = "none"; }, 800);

  // 🎵 PLAY MUSIC (FIXED)
  if (music) {
    music.volume = 0.5;

    const playPromise = music.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Music playing 🎶");
        })
        .catch((error) => {
          console.log("Autoplay blocked 😭", error);
        });
    }
  }

  // Confetti 🎉
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });

  startHeartsAndBalloons();
});

// ================== HEARTS & BALLOONS ==================
function startHeartsAndBalloons() {
  setInterval(() => {
    // HEART
    const heart = document.createElement('span');
    heart.textContent = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 10 + 15 + 'px';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's';
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);

    // BALLOON
    const b = document.createElement('span');
    b.textContent = '🎈';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.fontSize = Math.random() * 30 + 30 + 'px';
    balloonArea.appendChild(b);
    setTimeout(() => b.remove(), 13000);

  }, 500);
}

// ================== GAME FLOW ==================
let currentGame = 0;
const games = ["target", "memory", "bomb"];

function startHeartGame() {
document.getElementById("gameIntro").style.display = "none";
document.getElementById("gameArea").style.display = "block";
startNextGame();
}

function startNextGame() {
if (currentGame >= games.length) {
document.getElementById("gameTitle").innerText = "Level Complete 😎";
document.getElementById("gameBox").innerHTML = "";
document.getElementById("gameMessage").innerText =
"Okay… you survived everything. Respect 🫡";
setTimeout(unlockMainContent, 1500);
return;
}

let game = games[currentGame];
if (game === "target") startTargetGame();
if (game === "memory") startMemoryGame();
if (game === "bomb") startBombGame();
}

// ================== 🎯 TARGET GAME ==================
function startTargetGame() {
let score = 0;
let time = 10;

const box = document.getElementById("gameBox");
const title = document.getElementById("gameTitle");
const msg = document.getElementById("gameMessage");

title.innerText = "🎯 Target Practice";
msg.innerText = "Hit as many targets as you can!";

box.innerHTML = `<div id="scoreDisplay">Score: 0</div>`;

function spawnTarget() {
const target = document.createElement("div");
target.className = "click-target";
target.innerText = "🎯";

```
target.style.top = Math.random() * 250 + "px";
target.style.left = Math.random() * 85 + "%";

target.onclick = () => {
  score++;
  document.getElementById("scoreDisplay").innerText = "Score: " + score;
  target.remove();
};

box.appendChild(target);
setTimeout(() => target.remove(), 700);
```

}

let spawnRate = 700;

let interval = setInterval(() => {
spawnTarget();
if (score > 5) spawnRate = 500;
if (score > 10) spawnRate = 350;
}, spawnRate);

let timer = setInterval(() => {
time--;
if (time <= 0) {
clearInterval(interval);
clearInterval(timer);
msg.innerText = `Final Score: ${score} 🎯`;
currentGame++;
setTimeout(startNextGame, 1500);
}
}, 1000);
}

// ================== 🧠 MEMORY GAME ==================
function startMemoryGame() {
const box = document.getElementById("gameBox");
const title = document.getElementById("gameTitle");
const msg = document.getElementById("gameMessage");

title.innerText = "🧠 Memory Test";
msg.innerText = "Memorize this sequence...";

const emojis = ["⚡", "🎯", "🔥", "💣"];
let sequence = [];

for (let i = 0; i < 4; i++) {
sequence.push(emojis[Math.floor(Math.random() * emojis.length)]);
}

box.innerHTML = `<h2>${sequence.join(" ")}</h2>`;

setTimeout(() => {
box.innerHTML = "";
msg.innerText = "Now repeat the sequence!";

```
let user = [];

emojis.forEach(e => {
  let btn = document.createElement("button");
  btn.innerText = e;

  btn.onclick = () => {
    user.push(e);

    if (user[user.length - 1] !== sequence[user.length - 1]) {
      msg.innerText = "Wrong 😭";
      currentGame++;
      setTimeout(startNextGame, 1500);
    }

    if (user.length === sequence.length) {
      msg.innerText = "Perfect 🧠🔥";
      currentGame++;
      setTimeout(startNextGame, 1500);
    }
  };

  box.appendChild(btn);
});
```

}, 2000);
}

// ================== 💣 BOMB GAME ==================
function startBombGame() {
const box = document.getElementById("gameBox");
const title = document.getElementById("gameTitle");
const msg = document.getElementById("gameMessage");

title.innerText = "💣 Avoid The Bomb";
msg.innerText = "Pick safe tiles... avoid the bomb 😏";

box.innerHTML = "";
let safeClicks = 0;

let bombIndex = Math.floor(Math.random() * 9);

for (let i = 0; i < 9; i++) {
let tile = document.createElement("div");
tile.className = "choice-box";
tile.innerText = "❓";

```
tile.onclick = () => {
  if (i === bombIndex) {
    tile.innerText = "💣";
    msg.innerText = "BOOM 💀";
    currentGame++;
    setTimeout(startNextGame, 1500);
  } else {
    tile.innerText = "✅";
    safeClicks++;

    if (safeClicks === 8) {
      msg.innerText = "You survived 😎";
      currentGame++;
      setTimeout(startNextGame, 1500);
    }
  }

  tile.onclick = null;
};

box.appendChild(tile);
```

}
}

// ================== UNLOCK MAIN CONTENT ==================
function unlockMainContent() {
  const mainContent = document.getElementById("mainContent");
  const gameAreaCard = document.getElementById("gameArea");
  const gameIntroCard = document.getElementById("gameIntro");

  if (gameAreaCard) gameAreaCard.style.display = "none";
  if (gameIntroCard) gameIntroCard.style.display = "none";

  mainContent.style.display = "block";

  setTimeout(() => {
    mainContent.style.opacity = "1";
    mainContent.style.pointerEvents = "auto";
  }, 100);

  const cards = mainContent.querySelectorAll(".card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));
}
