AOS.init();

// ELEMENTS
const timerEl = document.getElementById("intro-timer");
const revealBtn = document.getElementById("revealBtn");
const loadingScreen = document.getElementById("loading");
const music = document.getElementById("birthdayMusic");
const heartContainer = document.querySelector(".hearts");

// COUNTDOWN
let time = 5;
timerEl.innerText = time;

const countdown = setInterval(() => {
  time--;
  timerEl.innerText = time;

  if (time <= 0) {
    clearInterval(countdown);
    revealBtn.style.display = "inline-block";
  }
}, 1000);

// REVEAL
revealBtn.addEventListener("click", () => {
  loadingScreen.style.display = "none";

  music.volume = 0.5;
  music.play().catch(() => {});

  confetti({ particleCount: 150, spread: 70 });

  startFloating();
});

// FLOATING ICONS 🎈
function startFloating() {
  setInterval(() => {
    const icons = ['🎈','🎉','🎂','✨','🥳'];

    const el = document.createElement("span");
    el.innerText = icons[Math.floor(Math.random() * icons.length)];

    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = "25px";
    el.style.animationDuration = "5s";

    heartContainer.appendChild(el);

    setTimeout(() => el.remove(), 5000);
  }, 500);
}

// GAME FLOW
let currentGame = 0;
const games = ["target", "memory", "bomb"];

function startHeartGame() {
  document.getElementById("gameIntro").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  startNextGame();
}

function startNextGame() {
  if (currentGame >= games.length) {
    unlockMainContent();
    return;
  }

  if (games[currentGame] === "target") startTargetGame();
  if (games[currentGame] === "memory") startMemoryGame();
  if (games[currentGame] === "bomb") startBombGame();
}

// 🎯 TARGET GAME
function startTargetGame() {
  let score = 0;
  let timeLeft = 10;

  const box = document.getElementById("gameBox");
  const title = document.getElementById("gameTitle");
  const msg = document.getElementById("gameMessage");

  title.innerText = "🎯 Hit the gifts!";
  msg.innerText = "Click fast!";

  box.innerHTML = `<div id="scoreDisplay">Score: 0</div>`;

  function spawnTarget() {
    const target = document.createElement("div");
    target.className = "click-target";

    const items = ['🎁','🎉','🎂'];
    target.innerText = items[Math.floor(Math.random() * items.length)];

    target.style.top = Math.random() * 260 + "px";
    target.style.left = Math.random() * 90 + "%";

    target.onclick = () => {
      score++;
      document.getElementById("scoreDisplay").innerText = "Score: " + score;
      target.remove();
    };

    box.appendChild(target);
    setTimeout(() => target.remove(), 800);
  }

  let interval = setInterval(spawnTarget, 500);

  let timer = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(interval);
      clearInterval(timer);
      currentGame++;
      setTimeout(startNextGame, 1500);
    }
  }, 1000);
}

// 🧠 MEMORY GAME
function startMemoryGame() {
  const box = document.getElementById("gameBox");
  const title = document.getElementById("gameTitle");

  title.innerText = "🧠 Memory";

  const emojis = ["🎈","🎂","🎉","🎁"];
  let sequence = [];

  for (let i = 0; i < 4; i++) {
    sequence.push(emojis[Math.floor(Math.random() * emojis.length)]);
  }

  box.innerHTML = `<h2>${sequence.join(" ")}</h2>`;

  setTimeout(() => {
    box.innerHTML = "";
    let user = [];

    emojis.forEach(e => {
      let btn = document.createElement("button");
      btn.innerText = e;

      btn.onclick = () => {
        user.push(e);

        if (user[user.length - 1] !== sequence[user.length - 1]) {
          currentGame++;
          setTimeout(startNextGame, 1000);
        }

        if (user.length === sequence.length) {
          currentGame++;
          setTimeout(startNextGame, 1000);
        }
      };

      box.appendChild(btn);
    });

  }, 2000);
}

// 💣 BOMB GAME
function startBombGame() {
  const box = document.getElementById("gameBox");
  const title = document.getElementById("gameTitle");

  title.innerText = "💣 Avoid Bomb";
  box.innerHTML = "";

  let bomb = Math.floor(Math.random() * 9);

  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "choice-box";
    tile.innerText = "❓";

    tile.onclick = () => {
      if (i === bomb) {
        tile.innerText = "💣";
      } else {
        tile.innerText = "✅";
      }
      currentGame++;
      setTimeout(startNextGame, 1000);
    };

    box.appendChild(tile);
  }
}

// UNLOCK
function unlockMainContent() {
  document.getElementById("gameArea").style.display = "none";
  const main = document.getElementById("mainContent");

  main.style.display = "block";
  setTimeout(() => main.style.opacity = "1", 100);
}
