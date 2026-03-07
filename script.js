(() => {
    'use strict';

    // ===== DOM References =====
    const cells = document.querySelectorAll('.cell');
    const boardEl = document.getElementById('board');
    const overlay = document.getElementById('overlay');
    const resultMessage = document.getElementById('result-message');
    const btnReset = document.getElementById('btn-reset');
    const btnClear = document.getElementById('btn-clear');
    const btnPlayAgain = document.getElementById('btn-play-again');
    const turnX = document.querySelector('.turn-x');
    const turnO = document.querySelector('.turn-o');
    const scoreXEl = document.getElementById('score-x');
    const scoreOEl = document.getElementById('score-o');
    const scoreDrawEl = document.getElementById('score-draw');

    // ===== Game State =====
    const WIN_COMBOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]              // diagonals
    ];

    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;

    const STORAGE_KEY = 'ttt-scores';

    // ===== Score Persistence =====
    function loadScores() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { x: 0, o: 0, draws: 0 };
        } catch {
            return { x: 0, o: 0, draws: 0 };
        }
    }

    function saveScores(scores) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    }

    function renderScores() {
        const s = loadScores();
        scoreXEl.textContent = s.x;
        scoreOEl.textContent = s.o;
        scoreDrawEl.textContent = s.draws;
    }

    function incrementScore(key) {
        const s = loadScores();
        s[key]++;
        saveScores(s);
        renderScores();

        // Bump animation on the changed score
        const el = key === 'x' ? scoreXEl : key === 'o' ? scoreOEl : scoreDrawEl;
        el.classList.remove('bump');
        void el.offsetWidth; // trigger reflow
        el.classList.add('bump');
    }

    // ===== Turn Indicator =====
    function updateTurnIndicator() {
        turnX.classList.toggle('active', currentPlayer === 'X');
        turnO.classList.toggle('active', currentPlayer === 'O');
    }

    // ===== Win / Draw Detection =====
    function checkWin() {
        for (const combo of WIN_COMBOS) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return combo;
            }
        }
        return null;
    }

    function checkDraw() {
        return board.every(cell => cell !== null);
    }

    // ===== Overlay =====
    function showOverlay(message) {
        resultMessage.textContent = message;
        overlay.classList.add('show');
    }

    function hideOverlay() {
        overlay.classList.remove('show');
    }

    // ===== Cell Click Handler =====
    function handleCellClick(index) {
        if (!gameActive || board[index] !== null) return;

        // Place mark
        board[index] = currentPlayer;
        const cell = cells[index];
        cell.textContent = currentPlayer;
        cell.classList.add('taken', currentPlayer.toLowerCase(), 'pop');

        // Check win
        const winCombo = checkWin();
        if (winCombo) {
            gameActive = false;
            winCombo.forEach(i => cells[i].classList.add('winner'));
            incrementScore(currentPlayer.toLowerCase());
            setTimeout(() => showOverlay(`${currentPlayer} Wins! 🎉`), 400);
            return;
        }

        // Check draw
        if (checkDraw()) {
            gameActive = false;
            incrementScore('draws');
            setTimeout(() => showOverlay("It's a Draw! 🤝"), 400);
            return;
        }

        // Switch turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
    }

    // ===== Reset =====
    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        updateTurnIndicator();
        hideOverlay();
    }

    function resetScores() {
        saveScores({ x: 0, o: 0, draws: 0 });
        renderScores();
    }

    // ===== Event Listeners =====
    cells.forEach(cell => {
        const idx = parseInt(cell.dataset.index, 10);

        cell.addEventListener('click', () => handleCellClick(idx));

        cell.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCellClick(idx);
            }
        });
    });

    btnReset.addEventListener('click', resetGame);
    btnClear.addEventListener('click', () => {
        resetScores();
        resetGame();
    });
    btnPlayAgain.addEventListener('click', resetGame);

    // Close overlay on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) resetGame();
    });

    // ===== Init =====
    renderScores();
    updateTurnIndicator();
})();
