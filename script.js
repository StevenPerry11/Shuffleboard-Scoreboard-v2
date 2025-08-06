
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
        let temp = yellowPlayer;
        yellowPlayer = blackPlayer;
        blackPlayer = temp;
    }

    currentFrameScore = { yellow: 0, black: 0 };
    frameScores = { player1: 0, player2: 0 };
    updateUI();
}

function previousFrame() {
    if (frame > 1) {
        let lastFrame = frame - 1;
        let last = frameHistory[lastFrame - 1];

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
            let temp = yellowPlayer;
            yellowPlayer = blackPlayer;
            blackPlayer = temp;
        }

        frame--;
        updateUI();
    }
}

function renderHistory() {
    let tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";
    frameHistory.forEach(f => {
        let row = `<tr><td>${f.frame}</td><td>${f.yellow || 0}</td><td>${f.black || 0}</td></tr>`;
        tbody.innerHTML += row;
    });
}

function downloadCSV() {
    let csv = "Frame,Yellow,Black\n";
    frameHistory.forEach(f => {
        csv += `${f.frame},${f.yellow || 0},${f.black || 0}\n`;
    });
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "shuffleboard_scores.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function updateTimerDisplay() {
    let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let seconds = String(totalSeconds % 60).padStart(2, '0');
    document.getElementById("matchTimer").innerText = `${minutes}:${seconds}`;
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

updateUI();
