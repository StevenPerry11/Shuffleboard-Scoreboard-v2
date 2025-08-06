
let frame = 1;
let scores = { player1: 0, player2: 0 };
let frameScores = { player1: 0, player2: 0 };
let yellowPlayer = "player1";
let blackPlayer = "player2";
let frameHistory = [];
let currentFrameScore = { yellow: 0, black: 0 };
let timerInterval;
let totalSeconds = 0;

function updateUI() {
  document.getElementById("frame").innerText = frame;
  document.getElementById("score1").innerText = scores.player1;
  document.getElementById("score2").innerText = scores.player2;
  document.getElementById("frameScore1").innerText = frameScores.player1;
  document.getElementById("frameScore2").innerText = frameScores.player2;
  document.getElementById("disc1").innerText = yellowPlayer === "player1" ? "Yellow" : "Black";
  document.getElementById("disc2").innerText = yellowPlayer === "player2" ? "Yellow" : "Black";
  document.getElementById("label1").innerText = document.getElementById("team1").value;
  document.getElementById("label2").innerText = document.getElementById("team2").value;
  renderHistory();
}

function addPoints(discColor, points) {
  let player = (discColor === "yellow") ? yellowPlayer : blackPlayer;
  scores[player] += points;
  frameScores[player] += points;
  currentFrameScore[discColor] += points;

  if (!frameHistory[frame - 1]) {
    frameHistory[frame - 1] = { frame, yellow: 0, black: 0 };
  }
  frameHistory[frame - 1][discColor] = currentFrameScore[discColor];
  updateUI();
}

function nextFrame() {
  if (!frameHistory[frame - 1]) {
    frameHistory[frame - 1] = {
      frame,
      yellow: currentFrameScore.yellow,
      black: currentFrameScore.black
    };
  }
  frame++;
  if (frame === 9) {
    [yellowPlayer, blackPlayer] = [blackPlayer, yellowPlayer];
  }
  currentFrameScore = { yellow: 0, black: 0 };
  frameScores = { player1: 0, player2: 0 };
  updateUI();
}

function previousFrame() {
  if (frame > 1) {
    let last = frameHistory[frame - 2];
    if (last) {
      scores[yellowPlayer] -= last.yellow || 0;
      scores[blackPlayer] -= last.black || 0;
      frameScores = {
        [yellowPlayer]: last.yellow || 0,
        [blackPlayer]: last.black || 0
      };
      currentFrameScore = { yellow: last.yellow || 0, black: last.black || 0 };
      frameHistory.pop();
    }
    if (frame === 9) {
      [yellowPlayer, blackPlayer] = [blackPlayer, yellowPlayer];
    }
    frame--;
    updateUI();
  }
}

function resetFrame() {
  scores[yellowPlayer] -= currentFrameScore.yellow || 0;
  scores[blackPlayer] -= currentFrameScore.black || 0;
  currentFrameScore = { yellow: 0, black: 0 };
  frameScores = { player1: 0, player2: 0 };
  updateUI();
}

function resetGame() {
  frame = 1;
  scores = { player1: 0, player2: 0 };
  frameScores = { player1: 0, player2: 0 };
  yellowPlayer = "player1";
  blackPlayer = "player2";
  frameHistory = [];
  currentFrameScore = { yellow: 0, black: 0 };
  totalSeconds = 0;
  pauseTimer();
  updateTimerDisplay();
  updateUI();
}

function renderHistory() {
  let tbody = document.getElementById("historyBody");
  tbody.innerHTML = "";
  frameHistory.forEach(f => {
    tbody.innerHTML += `<tr><td>${f.frame}</td><td>${f.yellow || 0}</td><td>${f.black || 0}</td></tr>`;
  });
}

function downloadCSV() {
  let csv = "Frame,Yellow,Black\n";
  frameHistory.forEach(f => {
    csv += `${f.frame},${f.yellow || 0},${f.black || 0}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shuffleboard_scores.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      totalSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  totalSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById("matchTimer").innerText = `${mins}:${secs}`;
}

function updateLabels() {
  updateUI();
}

updateUI();
