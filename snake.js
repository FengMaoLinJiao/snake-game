let canvas;
let ctx;
let scoreElement;
let gameOverElement;
let gridSize = 20;
let tileCount;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;

let isGameRunning = false;
let isInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化画布元素
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    gameOverElement = document.getElementById('gameOver');
    
    // 计算画布网格数量
    tileCount = canvas.width / gridSize;
    
    restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', restartGame);
    
    if (isInitialized) return;
    isInitialized = true;
    
    // 设置初始移动方向
    dx = 1;
    dy = 0;
    
    // 确保只注册一次事件监听
    document.removeEventListener('keydown', changeDirection);
    document.addEventListener('keydown', changeDirection);
    
    // 延迟启动确保元素加载完成
    setTimeout(restartGame, 100);
});

function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `得分: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    gameOverElement.classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
}

let restartButton;

function restartGame() {
    // 清除现有游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // 重置游戏状态
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 1;  // 保持初始向右移动
    dy = 0;
    score = 0;
    isGameRunning = true;
    
    // 更新UI状态
    scoreElement.textContent = `得分: ${score}`;
    gameOverElement.classList.add('hidden');
    
    // 生成食物并启动游戏
    generateFood();
    startGame();
}
