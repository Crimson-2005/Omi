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

// ================== GAME 1: CATCH HEARTS ==================
function startHeartGame() {
  document.getElementById("gameIntro").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  document.getElementById("gameTitle").innerText = "Game 1: Catch the Hearts 💖";
  document.getElementById("gameMessage").innerText = "Jitne dil pakad sakti ho… utna pyaar milega 😏💘";

  heartScore = 0;

  const box = document.getElementById("gameBox");
  box.innerHTML = `<div id="gameScore">Score: 0 / 7</div>`;

  clearInterval(heartInterval);
  heartInterval = setInterval(spawnHeart, 900);
}

function spawnHeart() {
  const box = document.getElementById("gameBox");

  const heart = document.createElement("span");
  heart.innerText = "💖";
  heart.classList.add("click-heart");

  heart.style.left = Math.random() * 85 + "%";
  heart.style.top = Math.random() * 75 + "%";

  heart.onclick = function () {
    heart.remove();
    heartScore++;

    document.getElementById("gameScore").innerText =
      "Score: " + heartScore + " / 7";

    if (heartScore >= 7) {
      clearInterval(heartInterval);

      document.getElementById("gameMessage").innerText =
        "Acha ji… dil jeet liya tumne 😏✨";

      setTimeout(() => startBalloonGame(), 800);
    }
  };

  box.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 3000);
}

// ================== GAME 2: FIND LUCKY BALLOON ==================
function startBalloonGame() {
  document.getElementById("gameTitle").innerText =
    "Game 2: Find the Lucky Balloon 🎈";

  document.getElementById("gameMessage").innerText =
    "Ek hi balloon lucky hai… baaki sab dhokebaaz 😏🎈";

  const box = document.getElementById("gameBox");
  box.innerHTML = "";

  const lucky = Math.floor(Math.random() * 3);

  for (let i = 0; i < 3; i++) {
    const balloon = document.createElement("div");
    balloon.classList.add("choice-box");
    balloon.innerText = "🎈";

    balloon.onclick = function () {
      if (i === lucky) {
        document.getElementById("gameMessage").innerText =
          "Waahhh intuition strong hai 😏✨";

        setTimeout(() => startBoxGame(), 800);
      } else {
        document.getElementById("gameMessage").innerText =
          "Oops 😜 Try Again!";
      }
    };

    box.appendChild(balloon);
  }
}

// ================== GAME 3: CATCH COMPLIMENTS ==================
function startBoxGame() {
  document.getElementById("gameTitle").innerText =
    "Game 3: Catch the Compliments 💖";

  document.getElementById("gameMessage").innerText =
    "Sirf achhe words click karo 😌 galat pe click kiya toh score gayaaa 💀";

  const box = document.getElementById("gameBox");
  box.innerHTML = "";

  let score = 0;
  let gameActive = true;

  const goodWords = [
    "Choco Puff 🍫",
    "Gulabo 💐",
    "Cutie Patootie 🫧",
    "Apsara 💫",
    "Sundari ✨"
  ];

  const badWords = [
    "Naagin 🐍",
    "Badtameez 😏",
    "Aafat ⚡",
    "Chudail 👻"
  ];

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "scoreDisplay";
  scoreDisplay.innerText = "Score: 0";

  const gameArea = document.createElement("div");
  gameArea.id = "catchGameArea";
  gameArea.style.position = "relative";
  gameArea.style.height = "300px";

  box.appendChild(scoreDisplay);
  box.appendChild(gameArea);

  clearInterval(fallingWordsInterval);
  fallingWordsInterval = setInterval(createFallingWord, 1000);

  function createFallingWord() {
    if (!gameActive) return;

    const word = document.createElement("div");
    word.classList.add("falling-word");

    const isGood = Math.random() > 0.4;

    word.innerText = isGood
      ? goodWords[Math.floor(Math.random() * goodWords.length)]
      : badWords[Math.floor(Math.random() * badWords.length)];

    word.dataset.good = isGood;

    word.style.left = Math.random() * 250 + "px";
    word.style.top = "0px";

    gameArea.appendChild(word);

    let topPosition = 0;

    const fallInterval = setInterval(() => {
      if (!gameActive) {
        clearInterval(fallInterval);
        return;
      }

      topPosition += 1;
      word.style.top = topPosition + "px";

      if (topPosition > 260) {
        word.remove();
        clearInterval(fallInterval);
      }
    }, 20);

    word.onclick = function () {
      if (!gameActive) return;

      if (word.dataset.good === "true") {
        score++;
      } else {
        score = Math.max(0, score - 1);
      }

      scoreDisplay.innerText = "Score: " + score;

      word.remove();
      clearInterval(fallInterval);

      if (score >= 10) {
        gameActive = false;
        clearInterval(fallingWordsInterval);

        document.getElementById("gameMessage").innerText =
          "Okayyy impressed 😏💖 you passed all tests";

        setTimeout(() => unlockMainContent(), 1000);
      }
    };
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
