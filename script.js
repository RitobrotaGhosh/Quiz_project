const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Cu", "Fe"],
    correctAnswer: "Au"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
    correctAnswer: "Blue Whale"
  }
];

// State variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

// DOM Elements
const startButton = document.getElementById("start-button");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const timerContainer = document.getElementById("timer-container");
const timerText = document.getElementById("timer");
const scoreContainer = document.getElementById("score-container");
const scoreText = document.getElementById("score");
const resultsContainer = document.getElementById("results-container");

// Sound Effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Event Listeners
startButton.addEventListener("click", startQuiz);

function startQuiz() {
  startButton.classList.add("hide");
  resultsContainer.classList.add("hide");
  questionContainer.classList.remove("hide");
  scoreContainer.classList.remove("hide");
  timerContainer.classList.remove("hide");

  currentQuestionIndex = 0;
  score = 0;
  scoreText.textContent = score;

  displayQuestion();
  startTimer();
}

function displayQuestion() {
  resetState();
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionText.textContent = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;

  currentQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option, button));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function checkAnswer(selectedOption, clickedButton) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  // Disable all buttons after an answer is chosen
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    // Show the correct answer if the user was wrong
    if(button.textContent === currentQuestion.correctAnswer) {
        button.classList.add("correct");
    }
  });

  if (isCorrect) {
    score++;
    scoreText.textContent = score;
    clickedButton.classList.add("correct");
    correctSound.play();
  } else {
    clickedButton.classList.add("incorrect");
    wrongSound.play();
  }

  // Move to the next question or end the quiz after a short delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }, 1200); // 1.2 second delay to see feedback
}

function startTimer() {
  timeLeft = 30;
  timerText.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);

  questionContainer.classList.add("hide");
  timerContainer.classList.add("hide");
  scoreContainer.classList.add("hide");
  resultsContainer.classList.remove("hide");

  const percentage = ((score / quizQuestions.length) * 100).toFixed(1);
  let rewardMessage = "";

  if (percentage == 100) {
    rewardMessage = "🏆 Perfect Score! You're a genius!";
  } else if (percentage >= 75) {
    rewardMessage = "🎉 Excellent Job! You really know your stuff!";
  } else if (percentage >= 50) {
    rewardMessage = "👍 Good Effort! Keep practicing!";
  } else {
    rewardMessage = "🤔 Keep trying! Every master was once a beginner.";
  }

  resultsContainer.innerHTML = `
    <h2>✅ Quiz Completed!</h2>
    <p>Your Final Score: ${score} / ${quizQuestions.length}</p>
    <p>Score Percentage: ${percentage}%</p>
    <p id="reward-message">${rewardMessage}</p>
    <button id="play-again-button">Play Again</button>
  `;

  document.getElementById("play-again-button").addEventListener("click", startQuiz);
}