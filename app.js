const questions = [
  {
    prompt: "Зургийн давхарга (Layer) гэж юу вэ?",
    options: [
      "Зургийг устгах хэрэгсэл",
      "Зургийг олон хэсэг болгон давхарлан байрлуулах арга",
      "Зургийн өнгө солих арга",
      "Зургийг хэвлэх тохиргоо"
    ],
    correctAnswer: 1
  },
  {
    prompt: "Давхарга ашиглахын гол давуу тал юу вэ?",
    options: [
      "Зургийн хэмжээг багасгана",
      "Компьютерийг хурдан ажиллуулна",
      "Зургийн хэсэг бүрийг тусад нь засварлах боломжтой",
      "Зургийг автоматаар хэвлэнэ"
    ],
    correctAnswer: 2
  },
  {
    prompt: "Давхаргыг устгах үйлдэл аль нь вэ?",
    options: ["Delete Layer", "New Layer", "Duplicate Layer", "Merge Layer"],
    correctAnswer: 0
  },
  {
    prompt: "Шинэ давхарга үүсгэх үйлдлийг юу гэж нэрлэдэг вэ?",
    options: ["Save", "Open", "New Layer", "Print"],
    correctAnswer: 2
  }
];
const form = document.querySelector("#quiz");
const result = document.querySelector("#result");
const questionScreen = document.querySelector("#question-screen");
const reflectionScreen = document.querySelector("#reflection-screen");
const progress = document.querySelector("#progress");
const progressLabel = document.querySelector("#progress-label");
const answers = new Array(questions.length);
let currentQuestion = 0;
const symbols = ["А", "Б", "В", "Г"];
progress.max = questions.length;

function updateProgress() {
  progress.value = currentQuestion + 1;
  progressLabel.textContent = "Асуулт " + (currentQuestion + 1) + " / " + questions.length;
}

function renderQuestion() {
  reflectionScreen.hidden = true;
  questionScreen.hidden = false;
  questionScreen.replaceChildren();
  updateProgress();

  const stage = document.createElement("div");
  stage.className = "quiz-stage";
  const heading = document.createElement("h2");
  const question = questions[currentQuestion];
  heading.textContent = question.prompt;
  heading.tabIndex = -1;
  stage.append(heading);

  const choices = document.createElement("div");
  choices.className = "options";
  question.options.forEach((option, value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.setAttribute("aria-pressed", String(answers[currentQuestion] === value));
    const symbol = document.createElement("span");
    symbol.className = "answer-symbol";
    symbol.textContent = symbols[value];
    const text = document.createElement("span");
    text.textContent = option;
    button.append(symbol, text);
    button.addEventListener("click", () => {
      answers[currentQuestion] = value;
      choices.querySelectorAll(".answer").forEach(choice => {
        choice.setAttribute("aria-pressed", String(choice === button));
      });
      nextButton.disabled = false;
    });
    choices.append(button);
  });
  stage.append(choices);

  const controls = document.createElement("div");
  controls.className = "quiz-controls";
  if (currentQuestion > 0) {
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "secondary";
    backButton.textContent = "← Өмнөх";
    backButton.addEventListener("click", () => {
      currentQuestion -= 1;
      renderQuestion();
    });
    controls.append(backButton);
  }
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "next-button";
  nextButton.textContent = currentQuestion === questions.length - 1 ? "Сүүлчийн алхам →" : "Дараах асуулт →";
  nextButton.disabled = answers[currentQuestion] === undefined;
  nextButton.addEventListener("click", () => {
    if (answers[currentQuestion] === undefined) return;
    if (currentQuestion === questions.length - 1) renderReflection();
    else {
      currentQuestion += 1;
      renderQuestion();
    }
  });
  controls.append(nextButton);
  stage.append(controls);
  questionScreen.append(stage);
  heading.focus();
}

function renderReflection() {
  questionScreen.hidden = true;
  reflectionScreen.hidden = false;
  progress.value = questions.length;
  progressLabel.textContent = "Бэлэн боллоо!";
  reflectionScreen.querySelector("h2").tabIndex = -1;
  reflectionScreen.querySelector("h2").focus();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const correctCount = questions.filter((question, index) => answers[index] === question.correctAnswer).length;
  const roundedScore = Math.round(correctCount / questions.length * 100);
  const title = document.querySelector("#result-title");
  title.textContent = correctCount === questions.length ? "🌟 Бүгдийг зөв хариуллаа!" : "Тестийн үр дүн";
  document.querySelector("#result-message").innerHTML =
    '<span class="score-badge">' + roundedScore + '%</span>' +
    '<strong>Зөв хариулт ' + correctCount + ' / ' + questions.length + '</strong>';
  document.querySelector("#result-answers").replaceChildren(...answers.map((answer, index) => {
    const item = document.createElement("li");
    const { prompt, options, correctAnswer } = questions[index];
    item.className = answer === correctAnswer ? "correct" : "incorrect";
    const feedback = answer === correctAnswer
      ? "Зөв"
      : "Зөв хариулт: " + symbols[correctAnswer] + ". " + options[correctAnswer];
    item.textContent = prompt + " — " + symbols[answer] + ". " + options[answer] + " (" + feedback + ")";
    return item;
  }));
  const reflection = document.querySelector("#reflection").value.trim();
  const note = document.querySelector("#result-reflection");
  note.hidden = !reflection;
  note.textContent = "Давтах зүйл: " + reflection;
  form.hidden = true;
  result.hidden = false;
  title.focus();
});

function openForm() {
  result.hidden = true;
  form.hidden = false;
  currentQuestion = 0;
  renderQuestion();
}

document.querySelector("#edit").addEventListener("click", openForm);
document.querySelector("#restart").addEventListener("click", () => {
  form.reset();
  answers.fill(undefined);
  openForm();
});

const layerSwitches = document.querySelectorAll("[data-layer]");
const layerFeedback = document.querySelector("#layer-feedback");
function updateLayers() {
  layerSwitches.forEach(toggle => {
    document.getElementById(toggle.dataset.layer).hidden = !toggle.checked;
  });
  const challengeComplete = !document.getElementById("scene-sun").hidden
    && document.getElementById("scene-cloud").hidden;
  layerFeedback.textContent = challengeComplete
    ? "🌟 Боллоо! Нар гарч, үүл ариллаа."
    : "Давхарга бүрийг асааж, унтрааж үзээрэй.";
  layerFeedback.classList.toggle("complete", challengeComplete);
}

layerSwitches.forEach(toggle => toggle.addEventListener("change", updateLayers));
updateLayers();
renderQuestion();
