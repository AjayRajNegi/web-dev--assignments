const quizData = [
  {
    question: "Which language runs in a web browser?",
    a: "Java",
    b: "C",
    c: "Python",
    d: "JavaScript",
    correct: "d",
  },
  {
    question: "What does CSS stand for?",
    a: "Central Style Sheets",
    b: "Cascading Style Sheets",
    c: "Cascading Simple Sheets",
    d: "Cars SUVs Sailboats",
    correct: "b",
  },
  {
    question: "What does HTML stand for?",
    a: "Hypertext Markup Language",
    b: "Hypertext Markdown Language",
    c: "Hyperloop Machine Language",
    d: "Helicopters Terminals Motorboats Lamborginis",
    correct: "a",
  },
  {
    question: "What year was JavaScript launched?",
    a: "1996",
    b: "1995",
    c: "1994",
    d: "none of the above",
    correct: "b",
  },
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const aText = document.getElementById("a_text");
const bText = document.getElementById("b_text");
const cText = document.getElementById("c_text");
const dText = document.getElementById("d_text");

function loadQuestion() {
  deselectAnswers();
  const q = quizData[currentQuestion];
  questionEl.innerText = q.question;
  aText.innerText = q.a;
  bText.innerText = q.b;
  cText.innerText = q.c;
  dText.innerText = q.d;
}

function deselectAnswers() {
  document.querySelectorAll("input[name='answer']").forEach((el) => {
    el.checked = false;
  });
}

function getSelected() {
  let answer;
  document.querySelectorAll("input[name='answer']").forEach((el) => {
    if (el.checked) answer = el.id;
  });
  return answer;
}

function submitAnswer() {
  const answer = getSelected();

  if (!answer) return alert("Please select an option!!");

  if (answer === quizData[currentQuestion].correct) {
    score++;
  }
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    document.querySelector(".quiz-container").innerHTML = `
          <div class="result">
            <h2>Quiz Completed 🎉</h2>
            <p>Your Score: ${score} / ${quizData.length}</p>
          </div>
        `;
  }
}
loadQuestion();
