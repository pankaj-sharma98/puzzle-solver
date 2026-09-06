// ========================================
// PUZZLE SOLVER
// 100 LEVEL EDITION
// XP + RANK + DAILY CHALLENGE + BOSSES
// ========================================


// ========================================
// ELEMENTS
// ========================================

const homeScreen =
    document.getElementById("home-screen");

const levelScreen =
    document.getElementById("level-screen");

const playBtn =
    document.getElementById("play-btn");

const backBtn =
    document.getElementById("back-btn");

const statsBtn =
    document.getElementById("stats-btn");


// ========================================
// GAME SETTINGS
// ========================================

const TOTAL_LEVELS = 100;

const MAX_LIVES = 3;

const solvedPuzzle = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 0
];


// ========================================
// BOSS LEVELS
// ========================================

const BOSS_LEVELS = {

    25: {
        title: "FIRST BOSS",
        icon: "👑",
        reward: 250
    },

    50: {
        title: "NUMBER BOSS",
        icon: "🔢",
        reward: 400
    },

    75: {
        title: "LOGIC BOSS",
        icon: "🧠",
        reward: 600
    },

    100: {
        title: "FINAL BOSS",
        icon: "👑",
        reward: 1000
    }

};


function isBossLevel(level) {

    return Boolean(
        BOSS_LEVELS[level]
    );

}


function getBossData(level) {

    return BOSS_LEVELS[level] || null;

}


// ========================================
// RANK SYSTEM
// ========================================

const RANKS = [

    {
        name: "Beginner",
        icon: "🌱",
        minXP: 0
    },

    {
        name: "Thinker",
        icon: "🧠",
        minXP: 500
    },

    {
        name: "Solver",
        icon: "⚡",
        minXP: 1500
    },

    {
        name: "Master",
        icon: "🏆",
        minXP: 3000
    },

    {
        name: "Puzzle Legend",
        icon: "👑",
        minXP: 6000
    },

    {
        name: "Grandmaster",
        icon: "💎",
        minXP: 10000
    },

    {
        name: "Ultimate Solver",
        icon: "🌟",
        minXP: 15000
    }

];


// ========================================
// STORAGE HELPERS
// ========================================

function getJSON(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        return fallback;

    }

}


// ========================================
// SAVED DATA
// ========================================

let totalStars =
    Number(
        localStorage.getItem("stars")
    ) || 0;


let levelStars =
    getJSON(
        "levelStars",
        {}
    );


let completedLevels =
    getJSON(
        "completedLevels",
        []
    );


let totalMoves =
    Number(
        localStorage.getItem("totalMoves")
    ) || 0;


let totalMistakes =
    Number(
        localStorage.getItem("totalMistakes")
    ) || 0;


let totalPlayTime =
    Number(
        localStorage.getItem("totalPlayTime")
    ) || 0;


let gamesPlayed =
    Number(
        localStorage.getItem("gamesPlayed")
    ) || 0;


let currentStreak =
    Number(
        localStorage.getItem("currentStreak")
    ) || 0;


let bestStreak =
    Number(
        localStorage.getItem("bestStreak")
    ) || 0;


let achievements =
    getJSON(
        "achievements",
        {}
    );


let playerXP =
    Number(
        localStorage.getItem("playerXP")
    ) || 0;


let unlockedLevel =
    Number(
        localStorage.getItem("unlockedLevel")
    ) || 1;


// ========================================
// DAILY DATA
// ========================================

let dailyCompletedDate =
    localStorage.getItem(
        "dailyCompletedDate"
    ) || "";


let dailyStreak =
    Number(
        localStorage.getItem(
            "dailyStreak"
        )
    ) || 0;


let lastDailyDate =
    localStorage.getItem(
        "lastDailyDate"
    ) || "";


let dailyBestStreak =
    Number(
        localStorage.getItem(
            "dailyBestStreak"
        )
    ) || 0;


// ========================================
// RECOVER OLD PROGRESS
// ========================================

if (!Array.isArray(completedLevels)) {

    completedLevels = [];

}


Object.keys(levelStars).forEach(
    function (level) {

        const number =
            Number(level);

        if (
            levelStars[level] > 0 &&
            !completedLevels.includes(number)
        ) {

            completedLevels.push(number);

        }

    }
);


if (completedLevels.length > 0) {

    const highest =
        Math.max(
            ...completedLevels
        );

    unlockedLevel =
        Math.max(
            unlockedLevel,
            highest + 1
        );

}


if (unlockedLevel < 1) {

    unlockedLevel = 1;

}


if (unlockedLevel > TOTAL_LEVELS) {

    unlockedLevel =
        TOTAL_LEVELS;

}


// ========================================
// CURRENT GAME
// ========================================

let currentLevel = 1;

let puzzle = [];

let moves = 0;

let mistakes = 0;

let lives = MAX_LIVES;

let seconds = 0;

let score = 0;

let timer = null;

let gameStarted = false;

let gameFinished = false;

let currentDailyPuzzle = null;


// ========================================
// SAVE DATA
// ========================================

function saveGameData() {

    localStorage.setItem(
        "unlockedLevel",
        unlockedLevel
    );

    localStorage.setItem(
        "stars",
        totalStars
    );

    localStorage.setItem(
        "levelStars",
        JSON.stringify(levelStars)
    );

    localStorage.setItem(
        "completedLevels",
        JSON.stringify(completedLevels)
    );

    localStorage.setItem(
        "totalMoves",
        totalMoves
    );

    localStorage.setItem(
        "totalMistakes",
        totalMistakes
    );

    localStorage.setItem(
        "totalPlayTime",
        totalPlayTime
    );

    localStorage.setItem(
        "gamesPlayed",
        gamesPlayed
    );

    localStorage.setItem(
        "currentStreak",
        currentStreak
    );

    localStorage.setItem(
        "bestStreak",
        bestStreak
    );

    localStorage.setItem(
        "achievements",
        JSON.stringify(achievements)
    );

    localStorage.setItem(
        "playerXP",
        playerXP
    );

    localStorage.setItem(
        "dailyCompletedDate",
        dailyCompletedDate
    );

    localStorage.setItem(
        "dailyStreak",
        dailyStreak
    );

    localStorage.setItem(
        "lastDailyDate",
        lastDailyDate
    );

    localStorage.setItem(
        "dailyBestStreak",
        dailyBestStreak
    );

}


// ========================================
// RANK
// ========================================

function getCurrentRank() {

    let rank =
        RANKS[0];

    RANKS.forEach(
        function (item) {

            if (
                playerXP >=
                item.minXP
            ) {

                rank = item;

            }

        }
    );

    return rank;

}


function getNextRank() {

    const current =
        getCurrentRank();

    const index =
        RANKS.findIndex(
            item =>
                item.name ===
                current.name
        );

    return (
        RANKS[index + 1] ||
        null
    );

}


function getXPProgress() {

    const current =
        getCurrentRank();

    const next =
        getNextRank();

    if (!next) {

        return 100;

    }

    const earned =
        playerXP -
        current.minXP;

    const required =
        next.minXP -
        current.minXP;

    return Math.min(
        100,
        Math.round(
            (earned / required) * 100
        )
    );

}


// ========================================
// XP REWARD
// ========================================

function getLevelXP(level) {

    if (level <= 25) {

        return 100;

    }

    if (level <= 50) {

        return 150;

    }

    if (level <= 75) {

        return 200;

    }

    return 300;

}


// ========================================
// HOME
// ========================================

if (playBtn) {

    playBtn.addEventListener(
        "click",
        function () {

            playSound("click");

            showLevelScreen();

        }
    );

}


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            playSound("click");

            stopTimer();

            showHomeScreen();

        }
    );

}


if (statsBtn) {

    statsBtn.addEventListener(
        "click",
        function () {

            playSound("click");

            showLevelScreen();

            setTimeout(
                showStatistics,
                50
            );

        }
    );

}


function showHomeScreen() {

    stopTimer();

    levelScreen.classList.remove(
        "active"
    );

    homeScreen.classList.add(
        "active"
    );

}


// ========================================
// LEVEL MAP SCREEN
// ========================================

function showLevelScreen() {

    homeScreen.classList.remove(
        "active"
    );

    levelScreen.classList.add(
        "active"
    );


    const rank =
        getCurrentRank();


    levelScreen.innerHTML = `

        <header class="top-bar">

            <button
                id="levels-back"
                class="icon-btn"
            >
                ←
            </button>


            <div class="top-title">

                <span>🧩</span>

                <strong>
                    Puzzle Solver
                </strong>

            </div>


            <div class="player-score">

                ⭐ ${totalStars}

            </div>

        </header>


        <section class="levels-container">

            <div class="level-heading">

                <p>YOUR JOURNEY</p>

                <h2>
                    Select a Level
                </h2>


                <div class="progress-container">

                    <div class="progress-bar">

                        <div
                            id="game-progress"
                            class="progress"
                        ></div>

                    </div>


                    <span
                        id="game-progress-text"
                    >
                        ${completedLevels.length}
                        / ${TOTAL_LEVELS}
                    </span>

                </div>

            </div>


            <!-- DAILY CHALLENGE -->

            <div
                id="daily-challenge-card"
                class="daily-challenge-card"
            >

                <div class="daily-icon">
                    🗓️
                </div>


                <div class="daily-info">

                    <span>
                        DAILY CHALLENGE
                    </span>

                    <strong>
                        Today's Puzzle
                    </strong>

                    <small>
                        +200 XP
                        •
                        Perfect +100 XP
                    </small>

                </div>


                <button
                    id="daily-challenge-btn"
                    class="primary-btn"
                >
                    Play →
                </button>

            </div>


            <!-- MAP STATS -->

            <div class="map-stats">

                <div class="mini-stat">

                    <span>
                        🔥 Streak
                    </span>

                    <strong>
                        ${currentStreak}
                    </strong>

                </div>


                <div class="mini-stat">

                    <span>
                        🏆 Best
                    </span>

                    <strong>
                        ${bestStreak}
                    </strong>

                </div>


                <div class="mini-stat">

                    <span>
                        ⭐ Stars
                    </span>

                    <strong>
                        ${totalStars}
                    </strong>

                </div>

            </div>


            <!-- PROFILE -->

            <div class="profile-mini-card">

                <div class="profile-mini-avatar">
                    ${rank.icon}
                </div>


                <div class="profile-mini-info">

                    <span>
                        PLAYER RANK
                    </span>

                    <strong>
                        ${rank.name}
                    </strong>

                    <small>
                        ${playerXP} XP
                    </small>

                </div>


                <button
                    id="profile-mini-btn"
                    class="secondary-btn"
                >
                    👤 Profile
                </button>

            </div>


            <h3 class="levels-section-title">
                🧩 ALL LEVELS
            </h3>


            <div
                id="game-levels-grid"
                class="levels-grid"
            ></div>


            <div class="map-actions">

                <button
                    id="profile-btn"
                    class="secondary-btn"
                >
                    👤 Player Profile
                </button>


                <button
                    id="achievements-btn"
                    class="secondary-btn"
                >
                    🏆 Achievements
                </button>


                <button
                    id="map-stats-btn"
                    class="secondary-btn"
                >
                    📊 Statistics
                </button>

            </div>

        </section>

    `;


    document
        .getElementById(
            "levels-back"
        )
        .addEventListener(
            "click",
            showHomeScreen
        );


    document
        .getElementById(
            "daily-challenge-btn"
        )
        .addEventListener(
            "click",
            startDailyChallenge
        );


    document
        .getElementById(
            "profile-mini-btn"
        )
        .addEventListener(
            "click",
            showProfile
        );


    document
        .getElementById(
            "profile-btn"
        )
        .addEventListener(
            "click",
            showProfile
        );


    document
        .getElementById(
            "achievements-btn"
        )
        .addEventListener(
            "click",
            showAchievements
        );


    document
        .getElementById(
            "map-stats-btn"
        )
        .addEventListener(
            "click",
            showStatistics
        );


    renderLevelMap();

    updateDailyButton();

}


// ========================================
// 100 LEVEL MAP
// ========================================

function renderLevelMap() {

    const grid =
        document.getElementById(
            "game-levels-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    for (
        let i = 1;
        i <= TOTAL_LEVELS;
        i++
    ) {

        const card =
            document.createElement(
                "div"
            );


        const unlocked =
            i <= unlockedLevel;


        const completed =
            completedLevels.includes(i);


        const boss =
            isBossLevel(i);


        const stars =
            levelStars[i] || 0;


        card.classList.add(
            "level-card",
            "map-level-card"
        );


        card.dataset.level =
            i;


        if (unlocked) {

            card.classList.add(
                "unlocked"
            );

        } else {

            card.classList.add(
                "locked"
            );

        }


        if (completed) {

            card.classList.add(
                "completed"
            );

        }


        if (boss) {

            card.classList.add(
                "boss-level"
            );

        }


        if (
            i === unlockedLevel &&
            !completed &&
            unlocked
        ) {

            card.classList.add(
                "current-level"
            );

        }


        let status =
            "Available";


        if (completed) {

            status =
                "✓ Completed";

        }
        else if (!unlocked) {

            status =
                "🔒 Locked";

        }
        else if (
            i === unlockedLevel
        ) {

            status =
                "▶ Current Challenge";

        }


        // =================================
        // BOSS CARD
        // =================================

        if (boss) {

            const bossData =
                getBossData(i);


            card.innerHTML = `

                <div class="boss-crown">
                    ${bossData.icon}
                </div>


                <div class="level-top">

                    <div class="level-number">
                        ${
                            completed
                                ? "✓"
                                : i
                        }
                    </div>


                    ${
                        !unlocked
                            ? `
                                <span class="lock">
                                    🔒
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="level-name">
                    ${bossData.title}
                </div>


                <div class="level-difficulty">
                    BOSS LEVEL
                </div>


                <div class="level-stars">
                    ${getStarsHTML(stars)}
                </div>


                <div class="level-status">
                    ${status}
                </div>


                <div class="boss-reward">
                    💎 +${bossData.reward} XP
                </div>

            `;

        }


        // =================================
        // NORMAL CARD
        // =================================

        else {

            card.innerHTML = `

                <div class="level-top">

                    <div class="level-number">

                        ${
                            completed
                                ? "✓"
                                : i
                        }

                    </div>


                    ${
                        !unlocked
                            ? `
                                <span class="lock">
                                    🔒
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="level-name">
                    Level ${i}
                </div>


                <div class="level-difficulty">
                    ${getDifficulty(i)}
                </div>


                <div class="level-stars">
                    ${getStarsHTML(stars)}
                </div>


                <div class="level-status">
                    ${status}
                </div>

            `;

        }


        if (unlocked) {

            card.addEventListener(
                "click",
                function () {

                    playSound("click");

                    startLevel(i);

                }
            );

        }


        grid.appendChild(card);

    }


    updateMapProgress();

}


// ========================================
// DIFFICULTY
// ========================================

function getDifficulty(level) {

    if (level === 25) {

        return "👑 BOSS";

    }


    if (level === 50) {

        return "🔢 BOSS";

    }


    if (level === 75) {

        return "🧠 BOSS";

    }


    if (level === 100) {

        return "👑 FINAL BOSS";

    }


    if (level <= 5) {

        return "Tutorial";

    }


    if (level <= 25) {

        return "Easy";

    }


    if (level <= 50) {

        return "Medium";

    }


    if (level <= 75) {

        return "Hard";

    }


    return "Expert";

}


// ========================================
// STARS
// ========================================

function getStarsHTML(number) {

    number =
        Math.max(
            0,
            Math.min(
                3,
                Number(number) || 0
            )
        );


    return (
        "⭐".repeat(number) +
        "☆".repeat(3 - number)
    );

}


// ========================================
// MAP PROGRESS
// ========================================

function updateMapProgress() {

    const completed =
        completedLevels.length;


    const percentage =
        (
            completed /
            TOTAL_LEVELS
        ) * 100;


    const progressElement =
        document.getElementById(
            "game-progress"
        );


    const textElement =
        document.getElementById(
            "game-progress-text"
        );


    if (progressElement) {

        progressElement.style.width =
            percentage + "%";

    }


    if (textElement) {

        textElement.textContent =
            `${completed} / ${TOTAL_LEVELS}`;

    }

}


// ========================================
// START LEVEL
// ========================================

function startLevel(level) {

    currentLevel =
        level;


    currentDailyPuzzle =
        null;


    moves = 0;

    mistakes = 0;

    lives =
        MAX_LIVES;

    seconds = 0;

    score = 0;

    gameStarted = false;

    gameFinished = false;


    stopTimer();


    // =================================
    // LEVELS 1-25
    // SLIDING PUZZLES
    // =================================

    if (level <= 25) {

        puzzle =
            createSlidingPuzzle();

        showPuzzleScreen();

        return;

    }


    // =================================
    // LEVELS 26-50
    // NUMBER SEQUENCES
    // =================================

    if (level <= 50) {

        showSequenceScreen(
            createSequence()
        );

        return;

    }


    // =================================
    // LEVELS 51-75
    // LOGIC
    // =================================

    if (level <= 75) {

        showLogicScreen(
            createLogicPuzzle()
        );

        return;

    }


    // =================================
    // LEVELS 76-100
    // EXPERT
    // =================================

    showExpertScreen(
        createExpertPuzzle()
    );

}


// ========================================
// SLIDING PUZZLE
// ========================================

function createSlidingPuzzle() {

    if (currentLevel === 1) {

        return [
            1, 2, 3,
            4, 5, 6,
            7, 0, 8
        ];

    }


    let board =
        [...solvedPuzzle];


    let previousEmpty =
        -1;


    const shuffleCount =
        getShuffleMoves(
            currentLevel
        );


    for (
        let i = 0;
        i < shuffleCount;
        i++
    ) {

        const emptyIndex =
            board.indexOf(0);


        const possible =
            getPossibleMoves(
                emptyIndex
            );


        const filtered =
            possible.filter(
                move =>
                    move !==
                    previousEmpty
            );


        const choices =
            filtered.length
                ? filtered
                : possible;


        const randomMove =
            choices[
                Math.floor(
                    Math.random() *
                    choices.length
                )
            ];


        previousEmpty =
            emptyIndex;


        [
            board[emptyIndex],
            board[randomMove]
        ] = [
            board[randomMove],
            board[emptyIndex]
        ];

    }


    if (isSolved(board)) {

        return createSlidingPuzzle();

    }


    return board;

}


// ========================================
// SLIDING DIFFICULTY
// ========================================

function getShuffleMoves(level) {

    if (level <= 5) {

        return 2 + level * 2;

    }


    if (level <= 10) {

        return 15;

    }


    if (level <= 15) {

        return 20;

    }


    if (level <= 20) {

        return 25;

    }


    if (level < 25) {

        return 30;

    }


    // BOSS LEVEL 25

    return 45;

}


// ========================================
// POSSIBLE TILE MOVES
// ========================================

function getPossibleMoves(
    emptyIndex
) {

    const result = [];


    const row =
        Math.floor(
            emptyIndex / 3
        );


    const col =
        emptyIndex % 3;


    if (row > 0) {

        result.push(
            emptyIndex - 3
        );

    }


    if (row < 2) {

        result.push(
            emptyIndex + 3
        );

    }


    if (col > 0) {

        result.push(
            emptyIndex - 1
        );

    }


    if (col < 2) {

        result.push(
            emptyIndex + 1
        );

    }


    return result;

}


// ========================================
// PUZZLE SCREEN
// ========================================

function showPuzzleScreen() {

    const boss =
        isBossLevel(
            currentLevel
        );


    levelScreen.innerHTML = `

        <div class="game-screen">

            ${gameHeader(
                boss
                    ? "👑 BOSS PUZZLE"
                    : "🧩 SLIDING PUZZLE"
            )}


            <div class="game-container">

                ${gameInfoHTML()}


                <div class="lives-display">
                    ❤️ ❤️ ❤️
                </div>


                ${
                    boss
                        ? `
                            <div class="
                                boss-victory-banner
                            ">

                                <span>
                                    👑
                                </span>

                                <div>

                                    <strong>
                                        ${
                                            getBossData(
                                                currentLevel
                                            ).title
                                        }
                                    </strong>

                                    <small>
                                        Defeat the boss!
                                    </small>

                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="puzzle-wrapper">

                    <div
                        id="puzzle-board"
                        class="puzzle-board"
                    ></div>

                </div>


                <p class="instruction">

                    Arrange the numbers from
                    <strong>1 to 8</strong>

                </p>


                <div class="game-buttons">

                    <button
                        id="hint-btn"
                        class="secondary-btn"
                    >
                        💡 Hint
                    </button>


                    <button
                        id="reset-btn"
                        class="secondary-btn"
                    >
                        🔄 Reset
                    </button>

                </div>

            </div>

        </div>

    `;


    attachGameHeaderEvents();


    document
        .getElementById(
            "reset-btn"
        )
        .addEventListener(
            "click",
            function () {

                startLevel(
                    currentLevel
                );

            }
        );


    document
        .getElementById(
            "hint-btn"
        )
        .addEventListener(
            "click",
            showSlidingHint
        );


    renderPuzzle();

}


// ========================================
// GAME HEADER
// ========================================

function gameHeader(type) {

    return `

        <header class="game-header">

            <button
                id="game-back"
                class="icon-btn"
            >
                ←
            </button>


            <div>

                <span class="game-small">
                    ${type}
                </span>


                <h2>

                    ${
                        currentDailyPuzzle
                            ? "Daily Challenge"
                            : `Level ${currentLevel}`
                    }

                </h2>

            </div>


            <div class="game-stars">
                ⭐ ${totalStars}
            </div>

        </header>

    `;

}


// ========================================
// GAME INFO
// ========================================

function gameInfoHTML() {

    return `

        <div class="game-info">

            <div class="info-card">

                <span>
                    Moves
                </span>

                <strong id="moves">
                    0
                </strong>

            </div>


            <div class="info-card">

                <span>
                    Mistakes
                </span>

                <strong id="mistakes">
                    0
                </strong>

            </div>


            <div class="info-card">

                <span>
                    Time
                </span>

                <strong id="timer">
                    00:00
                </strong>

            </div>

        </div>

    `;

}


// ========================================
// HEADER EVENTS
// ========================================

function attachGameHeaderEvents() {

    const back =
        document.getElementById(
            "game-back"
        );


    if (back) {

        back.addEventListener(
            "click",
            function () {

                stopTimer();

                showLevelScreen();

            }
        );

    }

}


// ========================================
// RENDER PUZZLE
// ========================================

function renderPuzzle() {

    const board =
        document.getElementById(
            "puzzle-board"
        );


    if (!board) {

        return;

    }


    board.innerHTML = "";


    puzzle.forEach(
        function (
            number,
            index
        ) {

            const tile =
                document.createElement(
                    "button"
                );


            tile.classList.add(
                "puzzle-tile"
            );


            if (number === 0) {

                tile.classList.add(
                    "empty"
                );

            }
            else {

                tile.textContent =
                    number;


                tile.addEventListener(
                    "click",
                    function () {

                        moveTile(index);

                    }
                );

            }


            board.appendChild(
                tile
            );

        }
    );


    updateGameInfo();

}


// ========================================
// MOVE TILE
// ========================================

function moveTile(index) {

    if (gameFinished) {

        return;

    }


    const empty =
        puzzle.indexOf(0);


    const possible =
        getPossibleMoves(
            empty
        );


    if (!possible.includes(index)) {

        loseLife();

        return;

    }


    startGameTimer();


    [
        puzzle[index],
        puzzle[empty]
    ] = [
        puzzle[empty],
        puzzle[index]
    ];


    moves++;

    totalMoves++;


    playSound("move");


    renderPuzzle();


    if (isSolved(puzzle)) {

        completeLevel();

    }

}


// ========================================
// CHECK SOLVED
// ========================================

function isSolved(board) {

    return board.every(
        function (
            value,
            index
        ) {

            return (
                value ===
                solvedPuzzle[index]
            );

        }
    );

}


// ========================================
// SEQUENCE PUZZLES
// ========================================

function createSequence() {

    const index =
        (currentLevel - 26) %
        24;


    const sequences = [

        {
            numbers: [2, 4, 6, 8],
            answer: "10",
            hint: "Add 2 each time."
        },

        {
            numbers: [3, 6, 9, 12],
            answer: "15",
            hint: "Add 3 each time."
        },

        {
            numbers: [5, 10, 15, 20],
            answer: "25",
            hint: "Add 5 each time."
        },

        {
            numbers: [2, 4, 8, 16],
            answer: "32",
            hint: "Multiply by 2."
        },

        {
            numbers: [3, 6, 12, 24],
            answer: "48",
            hint: "Double each number."
        },

        {
            numbers: [1, 4, 9, 16],
            answer: "25",
            hint: "Square numbers."
        },

        {
            numbers: [2, 5, 10, 17],
            answer: "26",
            hint: "Add 3, 5, 7, 9..."
        },

        {
            numbers: [10, 20, 40, 80],
            answer: "160",
            hint: "Multiply by 2."
        },

        {
            numbers: [1, 3, 6, 10],
            answer: "15",
            hint: "Add 2, 3, 4, 5..."
        },

        {
            numbers: [4, 8, 16, 32],
            answer: "64",
            hint: "Double each time."
        },

        {
            numbers: [10, 15, 20, 25],
            answer: "30",
            hint: "Add 5."
        },

        {
            numbers: [2, 6, 18, 54],
            answer: "162",
            hint: "Multiply by 3."
        },

        {
            numbers: [100, 90, 80, 70],
            answer: "60",
            hint: "Subtract 10."
        },

        {
            numbers: [7, 14, 21, 28],
            answer: "35",
            hint: "Add 7."
        },

        {
            numbers: [2, 3, 5, 8],
            answer: "12",
            hint: "Add 1, 2, 3, 4..."
        },

        {
            numbers: [1, 2, 4, 8],
            answer: "16",
            hint: "Double."
        },

        {
            numbers: [9, 18, 27, 36],
            answer: "45",
            hint: "Add 9."
        },

        {
            numbers: [5, 15, 45, 135],
            answer: "405",
            hint: "Multiply by 3."
        },

        {
            numbers: [20, 18, 16, 14],
            answer: "12",
            hint: "Subtract 2."
        },

        {
            numbers: [1, 5, 9, 13],
            answer: "17",
            hint: "Add 4."
        },

        {
            numbers: [2, 8, 18, 32],
            answer: "50",
            hint: "2 × square numbers."
        },

        {
            numbers: [6, 12, 24, 48],
            answer: "96",
            hint: "Multiply by 2."
        },

        {
            numbers: [81, 27, 9, 3],
            answer: "1",
            hint: "Divide by 3."
        },

        {
            numbers: [11, 22, 33, 44],
            answer: "55",
            hint: "Add 11."
        }

    ];


    return sequences[index];

}


// ========================================
// SEQUENCE SCREEN
// ========================================

function showSequenceScreen(data) {

    const boss =
        currentLevel === 50;


    levelScreen.innerHTML = `

        <div class="game-screen">

            ${gameHeader(
                boss
                    ? "🔢 NUMBER BOSS"
                    : "🔢 NUMBER SEQUENCE"
            )}


            <div class="sequence-container">

                ${gameInfoHTML()}


                <div class="lives-display">
                    ❤️ ❤️ ❤️
                </div>


                ${
                    boss
                        ? `
                            <div class="
                                boss-victory-banner
                            ">

                                <span>
                                    🔢
                                </span>

                                <div>

                                    <strong>
                                        NUMBER BOSS
                                    </strong>

                                    <small>
                                        Prove your
                                        number skills!
                                    </small>

                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="sequence-card">

                    <p class="sequence-label">
                        FIND THE NEXT NUMBER
                    </p>


                    <div class="
                        sequence-numbers
                    ">

                        ${data.numbers.map(
                            number => `

                                <div class="
                                    sequence-number
                                ">
                                    ${number}
                                </div>

                            `
                        ).join("")}


                        <div class="
                            sequence-number
                            question
                        ">
                            ?
                        </div>

                    </div>


                    <p class="sequence-question">
                        What number comes next?
                    </p>


                    <input
                        type="number"
                        id="sequence-answer"
                        placeholder="Enter answer"
                    >


                    <button
                        id="sequence-submit"
                        class="primary-btn"
                    >
                        Check Answer
                    </button>


                    <p
                        id="sequence-message"
                        class="sequence-message"
                    ></p>


                    <button
                        id="sequence-hint"
                        class="secondary-btn"
                    >
                        💡 Hint
                    </button>

                </div>

            </div>

        </div>

    `;


    attachGameHeaderEvents();


    document
        .getElementById(
            "sequence-submit"
        )
        .addEventListener(
            "click",
            function () {

                checkSequenceAnswer(
                    data
                );

            }
        );


    document
        .getElementById(
            "sequence-answer"
        )
        .addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    checkSequenceAnswer(
                        data
                    );

                }

            }
        );


    document
        .getElementById(
            "sequence-hint"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "sequence-message"
                    )
                    .textContent =
                    "💡 " +
                    data.hint;

            }
        );

}


// ========================================
// CHECK SEQUENCE
// ========================================

function checkSequenceAnswer(data) {

    if (gameFinished) {

        return;

    }


    startGameTimer();


    const input =
        document.getElementById(
            "sequence-answer"
        );


    const message =
        document.getElementById(
            "sequence-message"
        );


    if (!input.value.trim()) {

        message.textContent =
            "⚠️ Enter an answer.";

        return;

    }


    moves++;

    totalMoves++;


    if (
        input.value.trim() ===
        data.answer
    ) {

        message.textContent =
            "🎉 Correct!";


        playSound("correct");


        setTimeout(
            completeLevel,
            500
        );

    }
    else {

        loseLife();


        if (lives > 0) {

            message.textContent =
                "❌ Try again!";

        }
        else {

            message.textContent =
                "💔 No lives left.";

        }


        input.value = "";

    }


    updateGameInfo();

}


// ========================================
// LOGIC PUZZLES
// ========================================

function createLogicPuzzle() {

    const index =
        (currentLevel - 51) %
        24;


    const puzzles = [

        {
            question:
                "Which number doesn't belong?",

            items:
                ["2", "4", "6", "9"],

            answer:
                "9",

            hint:
                "Three numbers are even."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["3", "6", "9", "14"],

            answer:
                "14",

            hint:
                "Three numbers are multiples of 3."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["5", "10", "15", "?", "25"],

            items:
                ["10", "15", "20", "30"],

            answer:
                "20",

            hint:
                "Increase by 5."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["2", "4", "8", "?", "32"],

            items:
                ["10", "12", "16", "20"],

            answer:
                "16",

            hint:
                "Multiply by 2."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["11", "13", "17", "21"],

            answer:
                "21",

            hint:
                "Three numbers are prime."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["10", "20", "30", "?", "50"],

            items:
                ["35", "40", "45", "60"],

            answer:
                "40",

            hint:
                "Increase by 10."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["8", "16", "24", "31"],

            answer:
                "31",

            hint:
                "Three numbers are divisible by 8."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["1", "3", "6", "10", "?"],

            items:
                ["12", "14", "15", "18"],

            answer:
                "15",

            hint:
                "The differences increase."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["12", "18", "24", "31"],

            answer:
                "31",

            hint:
                "Three are divisible by 6."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["4", "8", "12", "?", "20"],

            items:
                ["14", "15", "16", "18"],

            answer:
                "16",

            hint:
                "Add 4."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["15", "20", "25", "31"],

            answer:
                "31",

            hint:
                "Three numbers end in 0 or 5."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["3", "6", "12", "24", "?"],

            items:
                ["36", "42", "48", "54"],

            answer:
                "48",

            hint:
                "Double each number."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["7", "11", "13", "15"],

            answer:
                "15",

            hint:
                "Three numbers are prime."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["20", "18", "16", "?", "12"],

            items:
                ["13", "14", "15", "10"],

            answer:
                "14",

            hint:
                "Subtract 2."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["16", "25", "36", "45"],

            answer:
                "45",

            hint:
                "Three are perfect squares."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["1", "4", "9", "16", "?"],

            items:
                ["20", "24", "25", "30"],

            answer:
                "25",

            hint:
                "Square numbers."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["4", "8", "12", "19"],

            answer:
                "19",

            hint:
                "Three are multiples of 4."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["2", "5", "8", "11", "?"],

            items:
                ["12", "13", "14", "15"],

            answer:
                "14",

            hint:
                "Add 3."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["10", "20", "30", "41"],

            answer:
                "41",

            hint:
                "Three numbers are multiples of 10."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["6", "12", "18", "?", "30"],

            items:
                ["22", "24", "26", "28"],

            answer:
                "24",

            hint:
                "Add 6."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["21", "27", "33", "40"],

            answer:
                "40",

            hint:
                "Three are multiples of 3."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["1", "2", "4", "8", "?"],

            items:
                ["12", "14", "16", "18"],

            answer:
                "16",

            hint:
                "Double."
        },

        {
            question:
                "Which number doesn't belong?",

            items:
                ["2", "3", "5", "9"],

            answer:
                "9",

            hint:
                "Three are prime."
        },

        {
            question:
                "Find the missing number",

            type:
                "missing",

            sequence:
                ["5", "10", "20", "40", "?"],

            items:
                ["60", "70", "80", "90"],

            answer:
                "80",

            hint:
                "Double each time."
        }

    ];


    return puzzles[index];

}


// ========================================
// LOGIC SCREEN
// ========================================

function showLogicScreen(data) {

    const boss =
        currentLevel === 75;


    levelScreen.innerHTML = `

        <div class="game-screen">

            ${gameHeader(
                boss
                    ? "🧠 LOGIC BOSS"
                    : "🧠 LOGIC PUZZLE"
            )}


            <div class="logic-container">

                ${gameInfoHTML()}


                <div class="lives-display">
                    ❤️ ❤️ ❤️
                </div>


                ${
                    boss
                        ? `
                            <div class="
                                boss-victory-banner
                            ">

                                <span>
                                    🧠
                                </span>

                                <div>

                                    <strong>
                                        LOGIC BOSS
                                    </strong>

                                    <small>
                                        Outsmart the boss!
                                    </small>

                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="logic-card">

                    <p class="logic-label">
                        🧠 THINK CAREFULLY
                    </p>


                    <h2>
                        ${data.question}
                    </h2>


                    ${
                        data.type === "missing"

                            ? `

                                <div class="
                                    logic-sequence
                                ">

                                    ${data.sequence.map(
                                        item => `

                                            <div class="
                                                sequence-box
                                                ${
                                                    item === "?"
                                                        ? "missing-box"
                                                        : ""
                                                }
                                            ">
                                                ${item}
                                            </div>

                                        `
                                    ).join("")}

                                </div>


                                <p class="
                                    logic-question
                                ">
                                    Select the
                                    missing number
                                </p>

                            `

                            : `

                                <p class="
                                    logic-question
                                ">
                                    Select the
                                    number that
                                    doesn't belong
                                </p>

                            `
                    }


                    <div class="logic-options">

                        ${data.items.map(
                            item => `

                                <button
                                    class="logic-option"
                                    data-answer="${item}"
                                >
                                    ${item}
                                </button>

                            `
                        ).join("")}

                    </div>


                    <p
                        id="logic-message"
                        class="logic-message"
                    ></p>


                    <button
                        id="logic-hint"
                        class="secondary-btn"
                    >
                        💡 Hint
                    </button>

                </div>

            </div>

        </div>

    `;


    attachGameHeaderEvents();


    document
        .querySelectorAll(
            ".logic-option"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        checkLogicAnswer(
                            this.dataset.answer,
                            data.answer
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "logic-hint"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "logic-message"
                    )
                    .textContent =
                    "💡 " +
                    data.hint;

            }
        );

}


// ========================================
// LOGIC ANSWER
// ========================================

function checkLogicAnswer(
    selected,
    correct
) {

    if (gameFinished) {

        return;

    }


    startGameTimer();


    moves++;

    totalMoves++;


    if (
        selected === correct
    ) {

        document
            .getElementById(
                "logic-message"
            )
            .textContent =
            "🎉 Correct!";


        playSound("correct");


        document
            .querySelectorAll(
                ".logic-option"
            )
            .forEach(
                function (button) {

                    button.disabled =
                        true;

                }
            );


        setTimeout(
            completeLevel,
            500
        );

    }
    else {

        loseLife();


        const message =
            document.getElementById(
                "logic-message"
            );


        if (message) {

            message.textContent =
                lives > 0
                    ? "❌ Not correct!"
                    : "💔 Game over.";

        }

    }


    updateGameInfo();

}


// ========================================
// EXPERT PUZZLES
// ========================================

function createExpertPuzzle() {

    const index =
        (currentLevel - 76) %
        24;


    const puzzles = [

        {
            question:
                "What number comes next?",

            sequence:
                ["1", "4", "9", "16", "?"],

            items:
                ["20", "24", "25", "30"],

            answer:
                "25",

            hint:
                "Square numbers."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["2", "6", "12", "20", "?"],

            items:
                ["24", "28", "30", "32"],

            answer:
                "30",

            hint:
                "Look at the differences."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["3", "9", "27", "?", "243"],

            items:
                ["54", "72", "81", "90"],

            answer:
                "81",

            hint:
                "Multiply by 3."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["1", "2", "6", "24", "?"],

            items:
                ["60", "100", "120", "144"],

            answer:
                "120",

            hint:
                "The multiplier increases."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["2", "5", "11", "23", "?"],

            items:
                ["35", "40", "47", "50"],

            answer:
                "47",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["4", "9", "19", "39", "?"],

            items:
                ["69", "79", "89", "99"],

            answer:
                "79",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["2", "8", "18", "32", "?"],

            items:
                ["45", "50", "52", "55"],

            answer:
                "50",

            hint:
                "2 × square numbers."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["5", "11", "23", "47", "?"],

            items:
                ["89", "95", "96", "99"],

            answer:
                "95",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["1", "3", "7", "15", "?"],

            items:
                ["25", "27", "31", "35"],

            answer:
                "31",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["2", "5", "10", "17", "?"],

            items:
                ["24", "25", "26", "27"],

            answer:
                "26",

            hint:
                "Add consecutive odd numbers."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["3", "7", "15", "31", "?"],

            items:
                ["55", "61", "63", "65"],

            answer:
                "63",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["10", "21", "43", "87", "?"],

            items:
                ["165", "174", "175", "180"],

            answer:
                "175",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["1", "8", "27", "64", "?"],

            items:
                ["100", "121", "125", "144"],

            answer:
                "125",

            hint:
                "Cube numbers."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["2", "4", "12", "48", "?"],

            items:
                ["120", "180", "240", "300"],

            answer:
                "240",

            hint:
                "Multiply by 2, 3, 4, 5."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["4", "10", "22", "46", "?"],

            items:
                ["82", "90", "94", "96"],

            answer:
                "94",

            hint:
                "Multiply by 2 and add 2."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["7", "13", "25", "49", "?"],

            items:
                ["73", "91", "97", "99"],

            answer:
                "97",

            hint:
                "Multiply by 2 and subtract 1."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["1", "5", "13", "29", "?"],

            items:
                ["45", "57", "61", "65"],

            answer:
                "61",

            hint:
                "Multiply by 2 and add 3."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["2", "10", "50", "250", "?"],

            items:
                ["750", "1000", "1250", "1500"],

            answer:
                "1250",

            hint:
                "Multiply by 5."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["6", "18", "54", "162", "?"],

            items:
                ["324", "486", "648", "810"],

            answer:
                "486",

            hint:
                "Multiply by 3."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["9", "19", "39", "79", "?"],

            items:
                ["149", "159", "169", "179"],

            answer:
                "159",

            hint:
                "Multiply by 2 and add 1."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["3", "12", "48", "192", "?"],

            items:
                ["384", "576", "768", "960"],

            answer:
                "768",

            hint:
                "Multiply by 4."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["2", "7", "17", "37", "?"],

            items:
                ["67", "72", "77", "82"],

            answer:
                "77",

            hint:
                "Multiply by 2 and add 3."
        },

        {
            question:
                "Find the missing number",

            sequence:
                ["5", "14", "32", "68", "?"],

            items:
                ["120", "135", "140", "145"],

            answer:
                "140",

            hint:
                "Multiply by 2 and add 4."
        },

        {
            question:
                "What number comes next?",

            sequence:
                ["4", "16", "64", "256", "?"],

            items:
                ["512", "768", "1024", "2048"],

            answer:
                "1024",

            hint:
                "Multiply by 4."
        }

    ];


    return puzzles[index];

}


// ========================================
// EXPERT SCREEN
// ========================================

function showExpertScreen(data) {

    const boss =
        currentLevel === 100;


    levelScreen.innerHTML = `

        <div class="game-screen">

            ${gameHeader(
                boss
                    ? "👑 FINAL BOSS"
                    : "🔥 EXPERT CHALLENGE"
            )}


            <div class="logic-container">

                ${gameInfoHTML()}


                <div class="lives-display">
                    ❤️ ❤️ ❤️
                </div>


                ${
                    boss
                        ? `
                            <div class="
                                boss-victory-banner
                            ">

                                <span>
                                    👑
                                </span>

                                <div>

                                    <strong>
                                        FINAL BOSS
                                    </strong>

                                    <small>
                                        The ultimate
                                        puzzle challenge!
                                    </small>

                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="
                    logic-card
                    expert-card
                ">

                    <div class="expert-badge">
                        ${
                            boss
                                ? "👑 FINAL BOSS"
                                : "🔥 EXPERT"
                        }
                    </div>


                    <p class="logic-label">
                        ${
                            boss
                                ? "ULTIMATE CHALLENGE"
                                : "FINAL CHALLENGE"
                        }
                    </p>


                    <h2>
                        ${data.question}
                    </h2>


                    <div class="
                        logic-sequence
                        expert-sequence
                    ">

                        ${data.sequence.map(
                            item => `

                                <div class="
                                    sequence-box
                                    ${
                                        item === "?"
                                            ? "missing-box"
                                            : ""
                                    }
                                ">
                                    ${item}
                                </div>

                            `
                        ).join("")}

                    </div>


                    <div class="logic-options">

                        ${data.items.map(
                            item => `

                                <button
                                    class="logic-option"
                                    data-answer="${item}"
                                >
                                    ${item}
                                </button>

                            `
                        ).join("")}

                    </div>


                    <p
                        id="logic-message"
                        class="logic-message"
                    ></p>


                    <button
                        id="logic-hint"
                        class="secondary-btn"
                    >
                        💡 Hint
                    </button>

                </div>

            </div>

        </div>

    `;


    attachGameHeaderEvents();


    document
        .querySelectorAll(
            ".logic-option"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        checkExpertAnswer(
                            this.dataset.answer,
                            data.answer
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "logic-hint"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "logic-message"
                    )
                    .textContent =
                    "💡 " +
                    data.hint;

            }
        );

}


// ========================================
// EXPERT ANSWER
// ========================================

function checkExpertAnswer(
    selected,
    correct
) {

    if (gameFinished) {

        return;

    }


    startGameTimer();


    moves++;

    totalMoves++;


    if (
        selected === correct
    ) {

        document
            .getElementById(
                "logic-message"
            )
            .textContent =
            "🔥 EXPERT SOLVED!";


        playSound("correct");


        document
            .querySelectorAll(
                ".logic-option"
            )
            .forEach(
                function (button) {

                    button.disabled =
                        true;

                }
            );


        setTimeout(
            completeLevel,
            600
        );

    }
    else {

        loseLife();


        const message =
            document.getElementById(
                "logic-message"
            );


        if (message) {

            message.textContent =
                lives > 0
                    ? "❌ Incorrect!"
                    : "💔 No lives left.";

        }

    }


    updateGameInfo();

}


// ========================================
// LIVES
// ========================================

function loseLife() {

    if (gameFinished) {

        return;

    }


    mistakes++;

    totalMistakes++;

    lives--;


    playSound("error");


    updateGameInfo();


    if (lives <= 0) {

        gameOver();

    }

}


// ========================================
// GAME INFO
// ========================================

function updateGameInfo() {

    const movesElement =
        document.getElementById(
            "moves"
        );


    const mistakesElement =
        document.getElementById(
            "mistakes"
        );


    if (movesElement) {

        movesElement.textContent =
            moves;

    }


    if (mistakesElement) {

        mistakesElement.textContent =
            mistakes;

    }


    const livesElement =
        document.querySelector(
            ".lives-display"
        );


    if (livesElement) {

        livesElement.textContent =
            "❤️".repeat(lives) +
            "🖤".repeat(
                MAX_LIVES - lives
            );

    }


    updateTimerDisplay();

}


// ========================================
// TIMER
// ========================================

function startGameTimer() {

    if (gameStarted) {

        return;

    }


    gameStarted = true;


    timer =
        setInterval(
            function () {

                seconds++;

                updateTimerDisplay();

            },
            1000
        );

}


function stopTimer() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }

}


function updateTimerDisplay() {

    const element =
        document.getElementById(
            "timer"
        );


    if (element) {

        element.textContent =
            formatTime(seconds);

    }

}


function formatTime(time) {

    const minutes =
        Math.floor(
            time / 60
        )
        .toString()
        .padStart(2, "0");


    const secs =
        (
            time % 60
        )
        .toString()
        .padStart(2, "0");


    return `${minutes}:${secs}`;

}


// ========================================
// SLIDING HINT
// ========================================

function showSlidingHint() {

    const empty =
        puzzle.indexOf(0);


    const possible =
        getPossibleMoves(
            empty
        );


    if (!possible.length) {

        return;

    }


    const index =
        possible[0];


    const board =
        document.getElementById(
            "puzzle-board"
        );


    if (
        board &&
        board.children[index]
    ) {

        board.children[index]
            .classList.add(
                "hint-tile"
            );


        setTimeout(
            function () {

                if (
                    board.children[index]
                ) {

                    board.children[index]
                        .classList.remove(
                            "hint-tile"
                        );

                }

            },
            1000
        );

    }

}


// ========================================
// COMPLETE LEVEL
// ========================================

function completeLevel() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    stopTimer();


    totalPlayTime +=
        seconds;


    gamesPlayed++;


    const earnedStars =
        calculateStars();


    const previousStars =
        levelStars[currentLevel] ||
        0;


    if (
        earnedStars >
        previousStars
    ) {

        totalStars +=
            earnedStars -
            previousStars;


        levelStars[currentLevel] =
            earnedStars;

    }


    if (
        !completedLevels.includes(
            currentLevel
        )
    ) {

        completedLevels.push(
            currentLevel
        );

    }


    if (
        currentLevel ===
        unlockedLevel &&
        unlockedLevel <
        TOTAL_LEVELS
    ) {

        unlockedLevel++;

    }


    currentStreak++;


    if (
        currentStreak >
        bestStreak
    ) {

        bestStreak =
            currentStreak;

    }


    score =
        calculateScore(
            earnedStars
        );


    let earnedXP =
        getLevelXP(
            currentLevel
        );


    // =================================
    // BOSS XP
    // =================================

    if (
        isBossLevel(currentLevel)
    ) {

        earnedXP =
            getBossData(
                currentLevel
            ).reward;

    }


    // =================================
    // PERFECT BONUS
    // =================================

    if (
        earnedStars === 3
    ) {

        earnedXP += 50;

    }


    const oldRank =
        getCurrentRank();


    playerXP +=
        earnedXP;


    const newRank =
        getCurrentRank();


    checkAchievements();


    saveGameData();


    playSound("win");


    celebrateWin();


    setTimeout(
        function () {

            showVictoryScreen(
                earnedStars,
                earnedXP,
                oldRank.name !==
                newRank.name
            );

        },
        700
    );

}


// ========================================
// STARS
// ========================================

function calculateStars() {

    if (
        lives === 3 &&
        mistakes === 0 &&
        seconds <= 60
    ) {

        return 3;

    }


    if (
        lives >= 2 &&
        mistakes <= 2
    ) {

        return 2;

    }


    return 1;

}


// ========================================
// SCORE
// ========================================

function calculateScore(
    earnedStars
) {

    const base =
        currentLevel * 100;


    const starBonus =
        earnedStars * 100;


    const timeBonus =
        Math.max(
            0,
            300 -
            seconds * 3
        );


    const mistakePenalty =
        mistakes * 30;


    const lifeBonus =
        lives * 50;


    return Math.max(
        50,
        base +
        starBonus +
        timeBonus +
        lifeBonus -
        mistakePenalty
    );

}


// ========================================
// VICTORY SCREEN
// ========================================

function showVictoryScreen(
    earnedStars,
    earnedXP,
    rankedUp
) {

    const boss =
        isBossLevel(
            currentLevel
        );


    const rank =
        getCurrentRank();


    levelScreen.innerHTML = `

        <div class="win-screen">

            <div class="win-icon">
                ${
                    boss
                        ? getBossData(
                            currentLevel
                        ).icon
                        : "🎉"
                }
            </div>


            ${
                boss

                    ? `

                        <p class="
                            win-label
                            boss-win-label
                        ">

                            ${
                                getBossData(
                                    currentLevel
                                ).icon
                            }

                            ${
                                getBossData(
                                    currentLevel
                                ).title
                            }

                            DEFEATED

                        </p>


                        <h1>
                            BOSS DEFEATED!
                        </h1>

                    `

                    : `

                        <p class="win-label">
                            LEVEL COMPLETE
                        </p>


                        <h1>
                            Amazing!
                        </h1>

                    `
            }


            <div class="stars-result">
                ${getStarsHTML(
                    earnedStars
                )}
            </div>


            ${
                boss

                    ? `

                        <div class="
                            boss-victory-banner
                        ">

                            <span>
                                ${
                                    getBossData(
                                        currentLevel
                                    ).icon
                                }
                            </span>


                            <div>

                                <strong>
                                    ${
                                        getBossData(
                                            currentLevel
                                        ).title
                                    }
                                    DEFEATED
                                </strong>


                                <small>
                                    You conquered
                                    a Boss Level!
                                </small>

                            </div>

                        </div>

                    `

                    : ""
            }


            ${
                rankedUp

                    ? `

                        <div class="
                            rank-up-message
                        ">

                            🎊 RANK UP!

                            <strong>
                                ${rank.icon}
                                ${rank.name}
                            </strong>

                        </div>

                    `

                    : ""
            }


            <div class="xp-earned">

                <span>
                    XP EARNED
                </span>


                <strong>
                    +${earnedXP} XP
                </strong>

            </div>


            <div class="score-result">

                <span>
                    YOUR SCORE
                </span>


                <strong>
                    ${score}
                </strong>

            </div>


            <div class="result-stats">

                <div>

                    <span>
                        Moves
                    </span>

                    <strong>
                        ${moves}
                    </strong>

                </div>


                <div>

                    <span>
                        Mistakes
                    </span>

                    <strong>
                        ${mistakes}
                    </strong>

                </div>


                <div>

                    <span>
                        Time
                    </span>

                    <strong>
                        ${formatTime(seconds)}
                    </strong>

                </div>

            </div>


            <div class="streak-result">

                🔥 ${currentStreak}
                Win Streak

            </div>


            <button
                id="next-level-btn"
                class="primary-btn"
            >

                ${
                    currentLevel <
                    TOTAL_LEVELS

                        ? "Next Level →"

                        : "🏆 You Beat All 100!"

                }

            </button>


            <button
                id="victory-map-btn"
                class="secondary-btn"
            >
                🗺️ Level Map
            </button>

        </div>

    `;


    document
        .getElementById(
            "next-level-btn"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentLevel <
                    TOTAL_LEVELS
                ) {

                    startLevel(
                        currentLevel + 1
                    );

                }
                else {

                    showLevelScreen();

                }

            }
        );


    document
        .getElementById(
            "victory-map-btn"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    stopTimer();


    levelScreen.innerHTML = `

        <div class="game-over-screen">

            <div class="game-over-icon">
                💔
            </div>


            <p class="win-label">
                GAME OVER
            </p>


            <h1>
                Better Luck Next Time
            </h1>


            <p>
                You ran out of lives.
            </p>


            <button
                id="retry-btn"
                class="primary-btn"
            >
                🔄 Try Again
            </button>


            <button
                id="game-over-levels"
                class="secondary-btn"
            >
                🗺️ Level Map
            </button>

        </div>

    `;


    document
        .getElementById(
            "retry-btn"
        )
        .addEventListener(
            "click",
            function () {

                startLevel(
                    currentLevel
                );

            }
        );


    document
        .getElementById(
            "game-over-levels"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


// ========================================
// DAILY DATE
// ========================================

function getTodayKey() {

    const date =
        new Date();


    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");

}


function getYesterdayKey() {

    const date =
        new Date();


    date.setDate(
        date.getDate() - 1
    );


    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");

}


// ========================================
// DAILY PUZZLE
// ========================================

function generateDailyPuzzle() {

    const seed =
        Number(
            getTodayKey()
                .replaceAll("-", "")
        );


    const index =
        seed % 5;


    const puzzles = [

        {
            question:
                "What number comes next?",

            numbers:
                ["7", "14", "21", "28", "?"],

            items:
                ["32", "35", "36", "42"],

            answer:
                "35",

            hint:
                "Add 7 each time."
        },

        {
            question:
                "Find the missing number",

            numbers:
                ["3", "6", "12", "24", "?"],

            items:
                ["36", "42", "48", "54"],

            answer:
                "48",

            hint:
                "Double each number."
        },

        {
            question:
                "What number comes next?",

            numbers:
                ["1", "4", "9", "16", "?"],

            items:
                ["20", "24", "25", "30"],

            answer:
                "25",

            hint:
                "Think about square numbers."
        },

        {
            question:
                "Find the missing number",

            numbers:
                ["5", "10", "20", "40", "?"],

            items:
                ["60", "70", "80", "90"],

            answer:
                "80",

            hint:
                "Double each number."
        },

        {
            question:
                "Which number doesn't belong?",

            numbers:
                ["13", "17", "19", "21"],

            items:
                ["13", "17", "19", "21"],

            answer:
                "21",

            hint:
                "Three numbers are prime."
        }

    ];


    return puzzles[index];

}


// ========================================
// START DAILY
// ========================================

function startDailyChallenge() {

    const today =
        getTodayKey();


    if (
        dailyCompletedDate ===
        today
    ) {

        alert(
            "🎉 You already completed today's challenge!"
        );

        return;

    }


    currentDailyPuzzle =
        generateDailyPuzzle();


    moves = 0;

    mistakes = 0;

    lives =
        MAX_LIVES;

    seconds = 0;

    score = 0;

    gameStarted = false;

    gameFinished = false;


    stopTimer();


    showDailyChallengeScreen();

}


// ========================================
// DAILY SCREEN
// ========================================

function showDailyChallengeScreen() {

    const data =
        currentDailyPuzzle;


    levelScreen.innerHTML = `

        <div class="game-screen">

            ${gameHeader(
                "🗓️ DAILY CHALLENGE"
            )}


            <div class="logic-container">

                ${gameInfoHTML()}


                <div class="
                    daily-reward-banner
                ">

                    🎁 REWARD

                    <strong>
                        +200 XP
                    </strong>

                    <span>
                        Perfect solve:
                        +100 XP
                    </span>

                </div>


                <div class="lives-display">
                    ❤️ ❤️ ❤️
                </div>


                <div class="
                    logic-card
                    daily-card
                ">

                    <div class="
                        expert-badge
                    ">
                        🗓️ TODAY
                    </div>


                    <p class="logic-label">
                        DAILY BRAIN CHALLENGE
                    </p>


                    <h2>
                        ${data.question}
                    </h2>


                    <div class="
                        logic-sequence
                    ">

                        ${data.numbers.map(
                            item => `

                                <div class="
                                    sequence-box
                                    ${
                                        item === "?"
                                            ? "missing-box"
                                            : ""
                                    }
                                ">
                                    ${item}
                                </div>

                            `
                        ).join("")}

                    </div>


                    <div class="logic-options">

                        ${data.items.map(
                            item => `

                                <button
                                    class="logic-option"
                                    data-answer="${item}"
                                >
                                    ${item}
                                </button>

                            `
                        ).join("")}

                    </div>


                    <p
                        id="daily-message"
                        class="logic-message"
                    ></p>


                    <button
                        id="daily-hint"
                        class="secondary-btn"
                    >
                        💡 Hint
                    </button>

                </div>

            </div>

        </div>

    `;


    attachGameHeaderEvents();


    document
        .querySelectorAll(
            ".logic-option"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        checkDailyAnswer(
                            this.dataset.answer,
                            data.answer
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "daily-hint"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "daily-message"
                    )
                    .textContent =
                    "💡 " +
                    data.hint;

            }
        );

}


// ========================================
// DAILY ANSWER
// ========================================

function checkDailyAnswer(
    selected,
    correct
) {

    if (gameFinished) {

        return;

    }


    startGameTimer();


    moves++;

    totalMoves++;


    if (
        selected === correct
    ) {

        gameFinished = true;

        stopTimer();


        playSound("correct");


        const earnedXP =
            mistakes === 0
                ? 300
                : 200;


        completeDailyChallenge(
            earnedXP
        );

    }
    else {

        loseLife();


        const message =
            document.getElementById(
                "daily-message"
            );


        if (message) {

            message.textContent =
                lives > 0
                    ? "❌ Not correct. Try again!"
                    : "💔 No lives left.";

        }

    }


    updateGameInfo();

}


// ========================================
// COMPLETE DAILY
// ========================================

function completeDailyChallenge(
    earnedXP
) {

    const today =
        getTodayKey();


    const yesterday =
        getYesterdayKey();


    dailyCompletedDate =
        today;


    if (
        lastDailyDate ===
        yesterday
    ) {

        dailyStreak++;

    }
    else {

        dailyStreak = 1;

    }


    lastDailyDate =
        today;


    if (
        dailyStreak >
        dailyBestStreak
    ) {

        dailyBestStreak =
            dailyStreak;

    }


    playerXP +=
        earnedXP;


    checkAchievements();


    saveGameData();


    celebrateWin();


    setTimeout(
        function () {

            showDailyVictory(
                earnedXP
            );

        },
        500
    );

}


// ========================================
// DAILY VICTORY
// ========================================

function showDailyVictory(
    earnedXP
) {

    levelScreen.innerHTML = `

        <div class="win-screen">

            <div class="win-icon">
                🗓️
            </div>


            <p class="win-label">
                DAILY CHALLENGE COMPLETE
            </p>


            <h1>
                Excellent!
            </h1>


            <div class="stars-result">
                ⭐ ⭐ ⭐
            </div>


            <div class="xp-earned">

                <span>
                    DAILY XP
                </span>


                <strong>
                    +${earnedXP} XP
                </strong>

            </div>


            <div class="
                daily-streak-result
            ">

                🔥 Daily Streak

                <strong>
                    ${dailyStreak}
                </strong>

            </div>


            <button
                id="daily-done-btn"
                class="primary-btn"
            >
                🗺️ Back to Levels
            </button>

        </div>

    `;


    document
        .getElementById(
            "daily-done-btn"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


// ========================================
// DAILY BUTTON
// ========================================

function updateDailyButton() {

    const button =
        document.getElementById(
            "daily-challenge-btn"
        );


    const card =
        document.getElementById(
            "daily-challenge-card"
        );


    if (!button) {

        return;

    }


    const today =
        getTodayKey();


    if (
        dailyCompletedDate ===
        today
    ) {

        button.textContent =
            "✓ Completed";


        button.disabled =
            true;


        if (card) {

            card.classList.add(
                "daily-completed"
            );

        }

    }

}


// ========================================
// ACHIEVEMENTS
// ========================================

function unlockAchievement(
    id,
    condition
) {

    if (
        condition &&
        !achievements[id]
    ) {

        achievements[id] =
            true;

    }

}


function checkAchievements() {

    unlockAchievement(
        "first_win",
        completedLevels.length >= 1
    );


    unlockAchievement(
        "five_levels",
        completedLevels.length >= 5
    );


    unlockAchievement(
        "ten_levels",
        completedLevels.length >= 10
    );


    unlockAchievement(
        "twenty_levels",
        completedLevels.length >= 20
    );


    unlockAchievement(
        "fifty_levels",
        completedLevels.length >= 50
    );


    unlockAchievement(
        "all_levels",
        completedLevels.length >= 100
    );


    unlockAchievement(
        "three_stars",
        totalStars >= 9
    );


    unlockAchievement(
        "streak_five",
        bestStreak >= 5
    );


    unlockAchievement(
        "expert",
        completedLevels.includes(100)
    );


    unlockAchievement(
        "daily_three",
        dailyBestStreak >= 3
    );


    unlockAchievement(
        "daily_seven",
        dailyBestStreak >= 7
    );


    unlockAchievement(
        "daily_thirty",
        dailyBestStreak >= 30
    );


    unlockAchievement(
        "speed",
        seconds <= 30
    );

}


// ========================================
// ACHIEVEMENTS SCREEN
// ========================================

function showAchievements() {

    const items = [

        [
            "first_win",
            "🎯",
            "First Win",
            "Complete your first level"
        ],

        [
            "five_levels",
            "🧩",
            "Puzzle Rookie",
            "Complete 5 levels"
        ],

        [
            "ten_levels",
            "🧠",
            "Puzzle Master",
            "Complete 10 levels"
        ],

        [
            "twenty_levels",
            "🔥",
            "Getting Serious",
            "Complete 20 levels"
        ],

        [
            "fifty_levels",
            "💎",
            "Halfway Hero",
            "Complete 50 levels"
        ],

        [
            "all_levels",
            "👑",
            "Ultimate Solver",
            "Complete all 100 levels"
        ],

        [
            "three_stars",
            "⭐",
            "Perfect Solver",
            "Earn 9 stars"
        ],

        [
            "streak_five",
            "🔥",
            "On Fire",
            "Get a 5 level streak"
        ],

        [
            "expert",
            "💀",
            "Expert Solver",
            "Complete Level 100"
        ],

        [
            "daily_three",
            "🗓️",
            "Daily Warrior",
            "3 day daily streak"
        ],

        [
            "daily_seven",
            "🔥",
            "Daily Master",
            "7 day daily streak"
        ],

        [
            "daily_thirty",
            "🏆",
            "Daily Legend",
            "30 day daily streak"
        ],

        [
            "speed",
            "⚡",
            "Speed Solver",
            "Solve within 30 seconds"
        ]

    ];


    levelScreen.innerHTML = `

        <div class="overlay-page">

            <button
                id="achievement-back"
                class="icon-btn"
            >
                ←
            </button>


            <div class="
                achievement-header
            ">

                <div class="big-page-icon">
                    🏆
                </div>


                <p class="win-label">
                    REWARDS
                </p>


                <h1>
                    Achievements
                </h1>

            </div>


            <div class="
                achievement-grid
            ">

                ${items.map(
                    item =>
                        achievementCard(
                            ...item
                        )
                ).join("")}

            </div>

        </div>

    `;


    document
        .getElementById(
            "achievement-back"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


function achievementCard(
    id,
    icon,
    title,
    description
) {

    const unlocked =
        achievements[id];


    return `

        <div class="
            achievement-card
            ${
                unlocked
                    ? "unlocked"
                    : "locked-achievement"
            }
        ">

            <div class="
                achievement-icon
            ">

                ${
                    unlocked
                        ? icon
                        : "🔒"
                }

            </div>


            <div>

                <h3>
                    ${title}
                </h3>


                <p>
                    ${description}
                </p>

            </div>

        </div>

    `;

}


// ========================================
// PLAYER PROFILE
// ========================================

function showProfile() {

    const rank =
        getCurrentRank();


    const next =
        getNextRank();


    const progress =
        getXPProgress();


    levelScreen.innerHTML = `

        <div class="
            overlay-page
            profile-page
        ">

            <button
                id="profile-back"
                class="icon-btn"
            >
                ←
            </button>


            <div class="
                profile-header
            ">

                <div class="profile-avatar">
                    ${rank.icon}
                </div>


                <p class="win-label">
                    PLAYER PROFILE
                </p>


                <h1>
                    Puzzle Solver
                </h1>


                <div class="
                    profile-rank
                ">

                    ${rank.icon}

                    ${rank.name}

                </div>

            </div>


            <div class="xp-card">

                <div class="xp-top">

                    <div>

                        <span>
                            EXPERIENCE
                        </span>


                        <strong>
                            ${playerXP} XP
                        </strong>

                    </div>


                    <div class="
                        xp-rank-name
                    ">
                        ${rank.name}
                    </div>

                </div>


                <div class="
                    xp-progress-container
                ">

                    <div
                        class="xp-progress"
                        style="
                            width:${progress}%
                        "
                    ></div>

                </div>


                <div class="xp-bottom">

                    <span>
                        ${playerXP} XP
                    </span>


                    <span>

                        ${
                            next
                                ? `${next.minXP} XP`
                                : "MAX"
                        }

                    </span>

                </div>


                ${
                    next

                        ? `

                            <div class="
                                profile-next-rank
                            ">

                                ${next.icon}

                                Next:

                                <strong>
                                    ${next.name}
                                </strong>

                                <small>
                                    ${
                                        next.minXP -
                                        playerXP
                                    }
                                    XP needed
                                </small>

                            </div>

                        `

                        : `

                            <div class="
                                profile-next-rank
                            ">

                                👑

                                Maximum Rank

                            </div>

                        `
                }

            </div>


            <div class="
                profile-stats
            ">

                ${profileStat(
                    "🎯",
                    completedLevels.length,
                    "Completed"
                )}

                ${profileStat(
                    "⭐",
                    totalStars,
                    "Stars"
                )}

                ${profileStat(
                    "🔥",
                    currentStreak,
                    "Level Streak"
                )}

                ${profileStat(
                    "🏆",
                    bestStreak,
                    "Best Streak"
                )}

                ${profileStat(
                    "🗓️",
                    dailyStreak,
                    "Daily Streak"
                )}

                ${profileStat(
                    "💎",
                    playerXP,
                    "XP"
                )}

                ${profileStat(
                    "🎮",
                    gamesPlayed,
                    "Games Played"
                )}

                ${profileStat(
                    "🧩",
                    unlockedLevel,
                    "Highest Level"
                )}

            </div>


            <button
                id="profile-back-bottom"
                class="
                    primary-btn
                    profile-back-btn
                "
            >
                ← Back to Levels
            </button>

        </div>

    `;


    document
        .getElementById(
            "profile-back"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );


    document
        .getElementById(
            "profile-back-bottom"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


function profileStat(
    icon,
    value,
    label
) {

    return `

        <div class="
            profile-stat-card
        ">

            <span class="
                profile-stat-icon
            ">
                ${icon}
            </span>


            <strong>
                ${value}
            </strong>


            <small>
                ${label}
            </small>

        </div>

    `;

}


// ========================================
// STATISTICS
// ========================================

function showStatistics() {

    levelScreen.innerHTML = `

        <div class="overlay-page">

            <button
                id="stats-back"
                class="icon-btn"
            >
                ←
            </button>


            <div class="
                achievement-header
            ">

                <div class="
                    big-page-icon
                ">
                    📊
                </div>


                <p class="win-label">
                    YOUR PERFORMANCE
                </p>


                <h1>
                    Statistics
                </h1>

            </div>


            <div class="
                statistics-grid
            ">

                ${statCard(
                    "🧩",
                    "Completed",
                    completedLevels.length
                )}

                ${statCard(
                    "⭐",
                    "Total Stars",
                    totalStars
                )}

                ${statCard(
                    "💎",
                    "Total XP",
                    playerXP
                )}

                ${statCard(
                    "🎮",
                    "Games Played",
                    gamesPlayed
                )}

                ${statCard(
                    "👣",
                    "Total Moves",
                    totalMoves
                )}

                ${statCard(
                    "❌",
                    "Mistakes",
                    totalMistakes
                )}

                ${statCard(
                    "🔥",
                    "Best Streak",
                    bestStreak
                )}

                ${statCard(
                    "🗓️",
                    "Daily Streak",
                    dailyStreak
                )}

                ${statCard(
                    "🏆",
                    "Best Daily Streak",
                    dailyBestStreak
                )}

                ${statCard(
                    "⏱️",
                    "Play Time",
                    formatTime(
                        totalPlayTime
                    )
                )}

            </div>

        </div>

    `;


    document
        .getElementById(
            "stats-back"
        )
        .addEventListener(
            "click",
            showLevelScreen
        );

}


function statCard(
    icon,
    title,
    value
) {

    return `

        <div class="stat-card">

            <span>
                ${icon}
            </span>


            <strong>
                ${value}
            </strong>


            <small>
                ${title}
            </small>

        </div>

    `;

}


// ========================================
// SOUND
// ========================================

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    return audioContext;

}


function playSound(type) {

    try {

        const ctx =
            getAudioContext();


        const oscillator =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            ctx.destination
        );


        const sounds = {

            click: [500, 0.05],

            move: [350, 0.06],

            correct: [700, 0.12],

            error: [180, 0.15],

            win: [850, 0.3]

        };


        const sound =
            sounds[type] ||
            sounds.click;


        oscillator.frequency.value =
            sound[0];


        oscillator.type =
            "sine";


        gain.gain.setValueAtTime(
            0.001,
            ctx.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.08,
            ctx.currentTime + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime +
            sound[1]
        );


        oscillator.start();


        oscillator.stop(
            ctx.currentTime +
            sound[1]
        );

    }
    catch (error) {

        // Sound is optional.

    }

}


// ========================================
// CONFETTI
// ========================================

function celebrateWin() {

    if (
        typeof confetti ===
        "function"
    ) {

        confetti({

            particleCount: 150,

            spread: 100,

            origin: {
                y: 0.6
            }

        });

    }

}


// ========================================
// INITIALIZE
// ========================================

checkAchievements();

saveGameData();

showHomeScreen();