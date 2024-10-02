const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Элементы HTML для меню и экрана окончания игры
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOver');
const highScoreElement = document.getElementById('highScore');

// Переменные игры
const gap = 85;
let birdX = 10;
let birdY = 150;
let gravity = 1.5;
let velocityY = 0;
let score = 0;
let isGameOver = false;
let highScore = localStorage.getItem('highScore') || 0;
let isGameRunning = false;  // Флаг для проверки состояния игры

// Загрузка изображений
const birdImg = new Image();
const bgImg = new Image();
const fgImg = new Image();
const pipeUpImg = new Image();
const pipeBottomImg = new Image();

birdImg.src = 'birdi.png';
bgImg.src = 'doma.png';
fgImg.src = 'minecra.png';
pipeUpImg.src = 'pipeUu.png';
pipeBottomImg.src = 'pipeBb.png';

// Загрузка звуков
const flySound = new Audio('alexmuz.mp3');
const scoreSound = new Audio('score.wav');
const loseSound = new Audio('sad_music.wav');

const pipes = [];
pipes[0] = { x: canvas.width, y: 0 };

// Функция для обновления отображения рекорда на экране
function updateHighScoreDisplay() {
    highScoreElement.innerText = highScore;
}

// Изначально показываем рекорд
updateHighScoreDisplay();

// Управление движением птички
document.addEventListener('keydown', moveUp);
document.addEventListener('touchstart', moveUp);

function moveUp() {
    if (!isGameOver && isGameRunning) {
        velocityY = -6;
        flySound.play();
    }
}

// Отрисовка игры
function draw() {
    if (!isGameRunning) return;  // Игра не запустится, пока не будет нажата кнопка "Начать"

    ctx.drawImage(bgImg, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
        const constant = pipeUpImg.height + gap;
        ctx.drawImage(pipeUpImg, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeBottomImg, pipes[i].x, pipes[i].y + constant);

        pipes[i].x--;

        if (pipes[i].x == 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeUpImg.height) - pipeUpImg.height
            });
        }

        if (birdX + birdImg.width >= pipes[i].x && birdX <= pipes[i].x + pipeUpImg.width &&
            (birdY <= pipes[i].y + pipeUpImg.height || birdY + birdImg.height >= pipes[i].y + constant) ||
            birdY + birdImg.height >= canvas.height - fgImg.height) {
            isGameOver = true;
            isGameRunning = false;  // Останавливаем игру при проигрыше
            loseSound.play();

            // Обновляем рекорд, если счет выше текущего рекорда
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                updateHighScoreDisplay();  // Обновляем отображение рекорда на экране
            }

            showGameOver();
        }

        if (pipes[i].x == 5) {
            score++;
            scoreSound.play();
        }
    }

    ctx.drawImage(fgImg, 0, canvas.height - fgImg.height);

    birdY += gravity + velocityY;
    velocityY *= 0.9;
    ctx.drawImage(birdImg, birdX, birdY);

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Счет: " + score, 10, canvas.height - 20);

    if (!isGameOver) {
        requestAnimationFrame(draw);
    }
}

// Показ экрана окончания игры
function showGameOver() {
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'flex';
}

// Начало игры
function startGame() {
    isGameRunning = true;  // Устанавливаем флаг, что игра запущена
    menu.style.display = 'none';
    canvas.style.display = 'block';
    resetGameVariables();  // Сбрасываем все переменные игры
    draw();
}

// Сброс переменных игры
function resetGameVariables() {
    birdY = 150;
    velocityY = 0;
    pipes.length = 0;
    pipes[0] = { x: canvas.width, y: 0 };
    score = 0;
    isGameOver = false;
}

// Перезапуск игры
function restartGame() {
    isGameRunning = true;  // Игра запущена заново
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGameVariables();
    draw();
}

// Возвращение в главное меню
function returnToMenu() {
    isGameRunning = false;  // Игра не запущена
    gameOverScreen.style.display = 'none';
    menu.style.display = 'flex';
}

// Функции для магазина и выхода
function openShop() {
    alert("Магазин пока не доступен.");
}

function exitGame() {
    alert("Выход из игры.");
    window.close();  // Работает в некоторых браузерах для закрытия вкладки
}

pipeBottomImg.onload = draw;
