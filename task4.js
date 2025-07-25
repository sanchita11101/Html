  const quizData = [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Mode Language", "None of these"],
      correct: 0
    },
    {
      question: "Which language is used for styling web pages?",
      options: ["HTML", "JQuery", "CSS", "XML"],
      correct: 2
    },
    {
      question: "Which is not a JavaScript Framework?",
      options: ["React", "Angular", "Vue", "Cascading"],
      correct: 3
    }
  ];

  let currentQuestion = 0;
  let score = 0;

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const errorEl = document.getElementById("error");
  const scoreEl = document.getElementById("scoreDisplay");

  function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    errorEl.textContent = "";

    q.options.forEach((option, index) => {
      const div = document.createElement("div");
      div.classList.add("option");
      div.innerHTML = `
        <input type="radio" name="option" id="option${index}" value="${index}">
        <label for="option${index}">${option}</label>
      `;
      optionsEl.appendChild(div);
    });
  }

  function nextQuestion() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
      errorEl.textContent = "Please select an answer!";
      return;
    }

    const answer = parseInt(selected.value);
    if (answer === quizData[currentQuestion].correct) {
      score++;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showScore();
    }
  }

  function showScore() {
    questionEl.textContent = "🎉 Quiz Completed!";
    optionsEl.innerHTML = "";
    errorEl.textContent = "";
    scoreEl.innerHTML = `Your Score: <strong>${score} / ${quizData.length}</strong>`;
    document.querySelector("button").style.display = "none";
    startFireworks();
  }

  loadQuestion();

  // FIREWORKS CANVAS CODE
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function createFirework(x, y) {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }
  }

  function updateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      const vx = Math.cos(p.angle) * p.speed;
      const vy = Math.sin(p.angle) * p.speed;
      p.x += vx;
      p.y += vy;
      p.alpha -= 0.015;
      p.speed *= 0.98;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `${p.color.replace('hsl', 'hsla').replace(')', `,${p.alpha})`)}`;
        ctx.fill();
      }
    });
    requestAnimationFrame(updateFireworks);
  }

  function startFireworks() {
    setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height / 2;
      createFirework(x, y);
    }, 700);
    updateFireworks();
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
