let level = "Easy";
let correctAnswers = 0;
let incorrectAnswers = 0;
let timerInterval;
let remainingTime = 60;
let highScore = localStorage.getItem('highScore') || 0;
let maxIncorrect = 3;
const maxCorrect = 10;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('high-score').innerText = highScore;

    document.getElementById('answer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        checkAnswer();
    });
});

function startGame(selectedLevel) {
    level = selectedLevel;
    document.getElementById('level').innerText = level;
    toggleVisibility('start-menu', 'game-container');
    resetGameValues();
    startTimer();
    generateQuestion();
}

function startTimer() {
    updateTime();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTime();
        if (remainingTime <= 0) endGame(false);
    }, 1000);
}

function generateQuestion() {
    const question = generateLevelQuestion(level);
    document.getElementById('question').innerText = question.text;
    document.getElementById('answer').dataset.answer = question.answer;
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value;
    const correctAnswer = document.getElementById('answer').dataset.answer;

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        displayResult("Correct!");
        if (correctAnswers === maxCorrect) {
            endGame(true); 
            return;
        }
    } else {
        incorrectAnswers++;
        displayResult("Incorrect!");
    }

    updateScore();

    if (incorrectAnswers >= maxIncorrect || remainingTime <= 0) {
        endGame(false);
    } else {
        generateQuestion();
    }

    document.getElementById('answer').value = ''; 
}

function endGame(isWin) {
    clearInterval(timerInterval);
    if (isWin) {
        toggleVisibility('game-container', 'congratulations-menu');
        if (level === 'Prime') {
            document.getElementById('next-level-congrats').style.display = 'none';
        } else {
            document.getElementById('next-level-congrats').style.display = 'inline-block';
        }
    } else {
        toggleVisibility('game-container', 'game-over-menu');
        if (level === 'Prime') {
            document.getElementById('next-level-btn').style.display = 'none';  
        } else {
            document.getElementById('next-level-btn').style.display = 'inline-block';
        }
    }

    if (correctAnswers > highScore) {
        highScore = correctAnswers;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById('final-score').innerText = correctAnswers;
}

function restartGame() {
    toggleVisibility('congratulations-menu', 'game-container');
    toggleVisibility('game-over-menu', 'game-container');
    resetGameValues();
    startTimer();
    generateQuestion();
}

function nextLevel() {
    const levels = ['Easy', 'Medium', 'Hard', 'Prime'];
    const nextLevelIndex = levels.indexOf(level) + 1;
    if (nextLevelIndex < levels.length) {
        document.getElementById('game-over-menu').style.display = 'none';
        document.getElementById('congratulations-menu').style.display = 'none';

        startGame(levels[nextLevelIndex]);
    }
}

function toggleVisibility(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

function resetGameValues() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    remainingTime = 60;
    document.getElementById('result').innerText = '';
    document.getElementById('answer').value = '';
    updateScore();
}

function updateTime() {
    document.getElementById('time-left').innerText = remainingTime;
}

function displayResult(message) {
    document.getElementById('result').innerText = message;
}

function updateScore() {
    document.getElementById('correct-count').innerText = correctAnswers;
    document.getElementById('incorrect-count').innerText = incorrectAnswers;
}

function generateLevelQuestion(level) {
    const generators = {
        Easy: generateEasyQuestion,
        Medium: generateMediumQuestion,
        Hard: generateHardQuestion,
        Prime: generatePrimeQuestion
    };
    return generators[level]();
}

function generateEasyQuestion() {
    const num1 = randomNum(10);
    const num2 = randomNum(10);
    return { text: `${num1} + ${num2}`, answer: num1 + num2 };
}

function generateMediumQuestion() {
    return generateQuestionWithOperators(20, ['+', '-']);
}

function generateHardQuestion() {
    return generateQuestionWithOperators(20, ['+', '-', '*']);
}

function generatePrimeQuestion() {
    return generateQuestionWithOperators(100, ['+', '-', '*', '/']);
}

function generateQuestionWithOperators(maxNum, operators) {
    const num1 = randomNum(maxNum);
    const num2 = randomNum(maxNum);
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let answer = eval(`${num1} ${operator} ${num2}`);
    return { text: `${num1} ${operator} ${num2}`, answer: Math.floor(answer) };
}

function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function exitGame() {
    toggleVisibility('game-container', 'start-menu');
    toggleVisibility('game-over-menu', 'start-menu');
    toggleVisibility('congratulations-menu', 'start-menu');
    
    resetGameValues();
}
