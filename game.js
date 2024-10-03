const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Элементы HTML для меню и экрана окончания игры
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOver');
const highScoreElement = document.getElementById('highScore');

// Переменные игры
const gap = 85;  // Расстояние между верхней и нижней трубой
let birdX = 10;
let birdY = 150;
let gravity = 1.5;
let velocityY = 0;
let score = 0;
let isGameOver = false;
let highScore = localStorage.getItem('highScore') || 0;  // Загрузка рекорда из localStorage
let isGameRunning = false;

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

// Массив для труб
const pipes = [];

// Обновление отображения рекорда на экране
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

// Создание новой трубы с случайным положением по Y
function createNewPipe() {
    const minHeight = -pipeUpImg.height + 50;  // Минимальная высота верхней трубы
    const maxHeight = 0;  // Максимальная высота верхней трубы
    const randomY = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        y: randomY  // Случайная высота для верхней трубы
    });
}

// Отрисовка игры
function draw() {
    if (!isGameRunning) return;  // Игра не запустится, пока не будет нажата кнопка "Начать"

    ctx.drawImage(bgImg, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
        const constant = pipeUpImg.height + gap;  // Расстояние между верхней и нижней трубой
        ctx.drawImage(pipeUpImg, pipes[i].x, pipes[i].y);  // Верхняя труба
        ctx.drawImage(pipeBottomImg, pipes[i].x, pipes[i].y + constant);  // Нижняя труба

        pipes[i].x--;  // Движение труб влево

        // Если труба уходит за пределы экрана, удаляем её
        if (pipes[i].x == 125) {
            createNewPipe();  // Создаем новую трубу с случайной высотой
        }

        // Проверка на столкновение
        if (birdX + birdImg.width >= pipes[i].x && birdX <= pipes[i].x + pipeUpImg.width &&
            (birdY <= pipes[i].y + pipeUpImg.height || birdY + birdImg.height >= pipes[i].y + constant) ||
            birdY + birdImg.height >= canvas.height - fgImg.height) {
            isGameOver = true;
            isGameRunning = false;  // Останавливаем игру при проигрыше
            loseSound.play();

            // Обновляем рекорд, если счет выше текущего рекорда
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);  // Сохраняем новый рекорд
                updateHighScoreDisplay();  // Обновляем отображение рекорда
            }

            showGameOver();  // Показ экрана окончания игры
        }

        // Если птичка прошла трубу
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
    createNewPipe();  // Добавляем первую трубу с случайной высотой
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
        
