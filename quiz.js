(function () {
  const TOTAL_MINUTES = 15;
  const TOTAL_SECONDS = TOTAL_MINUTES * 60;

  const questions = [
    { q: "Как называется язык разметки для структуры веб‑страниц?", a: ["HTML", "CSS", "SQL"], correct: 0 },
    { q: "Какой язык отвечает за стили и внешний вид веб‑страниц?", a: ["JavaScript", "CSS", "Python"], correct: 1 },
    { q: "Какой тег HTML используется для подключения таблицы стилей?", a: ["<style>", "<link>", "<css>"], correct: 1 },
    { q: "Где верно подключение скрипта во внешнем файле?", a: ["<script href=script.js>", "<script src=script.js>", "<js src=script.js>"], correct: 1 },
    { q: "Какой селектор CSS выберет элемент по идентификатору?", a: [".header", "#header", "header"], correct: 1 },
    { q: "Какое свойство CSS задаёт цвет текста?", a: ["font-color", "text-color", "color"], correct: 2 },
    { q: "Какое событие JS срабатывает при клике мышью?", a: ["mouseover", "click", "change"], correct: 1 },
    { q: "Как получить элемент по id в JS?", a: ["document.getElementById('id')", "document.query('#id')", "window.id('id')"], correct: 0 },
    { q: "Как правильно вставить изображение в HTML?", a: ["<image src='cat.png'>", "<img src='cat.png' alt='Кот'>", "<pic href='cat.png'>"], correct: 1 },
    { q: "Какой метатег задаёт кодировку страницы?", a: ["<meta charset='UTF-8'>", "<meta code='UTF-8'>", "<meta encoding='UTF-8'>"], correct: 0 },
    { q: "Какое свойство CSS делает элемент гибким контейнером?", a: ["display: grid;", "display: block;", "display: flex;"], correct: 2 },
    { q: "Как добавить комментарий в HTML?", a: ["/* комментарий */", "// комментарий", "<!-- комментарий -->"], correct: 2 },
    { q: "Какое значение position делает элемент фиксированным к окну?", a: ["absolute", "fixed", "sticky"], correct: 1 },
    { q: "Какой метод массива JS перебирает элементы с функцией?", a: ["forEach", "size", "extend"], correct: 0 },
    { q: "Какой тег семантически обозначает основной контент страницы?", a: ["<section>", "<main>", "<article>"], correct: 1 },
  ];

  const state = {
    idx: 0,
    selected: Array(questions.length).fill(null),
    startedAt: null,
    elapsedSec: 0,
    timerId: null,
    totalSec: TOTAL_SECONDS,
  };

  // Узлы DOM
  const el = {};
  function qs(id) { return document.getElementById(id); }

  function initDom() {
    el.qIndex = qs("q-index");
    el.qText = qs("q-text");
    el.answers = qs("answers");
    el.btnPrev = qs("btn-prev");
    el.btnNext = qs("btn-next");
    el.btnSubmit = qs("btn-submit");
    el.progressBar = qs("progress-bar");
    el.timerText = qs("timer-text");
    el.timerBar = qs("timer-bar");
    el.scoreDone = qs("score-done");

    el.modal = qs("result-modal");
    el.resTotal = qs("res-total");
    el.resCorrect = qs("res-correct");
    el.resIncorrect = qs("res-incorrect");
    el.resPercent = qs("res-percent");
    el.resTime = qs("res-time");
    el.resList = qs("res-list");
    el.resultClose = qs("result-close");
    el.resultOk = qs("result-ok");
    el.resultBackdrop = qs("result-close-backdrop");
  }

  // Helpers
  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function computeStats() {
    let done = 0;
    state.selected.forEach((sel) => { if (sel !== null) done++; });
    return { done };
  }

  function updateHeader() {
    const { done } = computeStats();
    if (el.scoreDone) el.scoreDone.textContent = String(done);
    if (el.progressBar) el.progressBar.style.width = `${(done / questions.length) * 100}%`;
  }

  function renderQuestion() {
    const q = questions[state.idx];
    el.qIndex.textContent = String(state.idx + 1);
    el.qText.textContent = q.q;
    el.answers.innerHTML = "";
    q.a.forEach((text, aIdx) => {
      const id = `q${state.idx}_a${aIdx}`;
      const label = document.createElement("label");
      label.className = "answer";
      label.setAttribute("for", id);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${state.idx}`;
      input.id = id;
      input.value = String(aIdx);
      input.checked = state.selected[state.idx] === aIdx;
      input.addEventListener("change", () => {
        state.selected[state.idx] = aIdx;
        updateHeader();
        updateControls();
      });

      const span = document.createElement("span");
      span.textContent = text;

      label.appendChild(input);
      label.appendChild(span);
      el.answers.appendChild(label);
    });
  }

  function updateControls() {
    el.btnPrev.disabled = state.idx === 0;
    el.btnNext.disabled = state.idx === questions.length - 1;
  }

  function goto(offset) {
    const next = state.idx + offset;
    if (next >= 0 && next < questions.length) {
      state.idx = next;
      renderQuestion();
      updateControls();
    }
  }

  function openModal() { el.modal.setAttribute("aria-hidden", "false"); el.modal.setAttribute("aria-modal", "true"); }
  function closeModal() { el.modal.setAttribute("aria-hidden", "true"); el.modal.setAttribute("aria-modal", "false"); }

  function buildResults() {
    // Подсчёт только в момент сдачи
    let correct = 0;
    state.selected.forEach((sel, i) => { if (sel === questions[i].correct) correct++; });
    const incorrect = questions.length - correct;
    if (el.resTotal) el.resTotal.textContent = String(questions.length);
    if (el.resCorrect) el.resCorrect.textContent = String(correct);
    if (el.resIncorrect) el.resIncorrect.textContent = String(incorrect);
    const percent = Math.round((correct / questions.length) * 100) || 0;
    if (el.resPercent) el.resPercent.textContent = `${percent}%`;
    if (el.resTime) el.resTime.textContent = `${formatTime(state.elapsedSec)} / ${formatTime(TOTAL_SECONDS)}`;
    // Не показываем детализацию по вопросам
    if (el.resList) el.resList.innerHTML = '';
  }

  function submitQuiz() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
    buildResults();
    openModal();
    // Заблокировать интерфейс после сдачи
    [el.btnPrev, el.btnNext, el.btnSubmit].forEach(b => { if (b) b.disabled = true; });
    if (el.answers) {
      Array.from(el.answers.querySelectorAll('input[type="radio"]')).forEach(i => i.disabled = true);
    }
  }

  function startTimer() {
    state.startedAt = Date.now();
    state.elapsedSec = 0;
    el.timerText.textContent = formatTime(TOTAL_SECONDS);
    el.timerBar.style.width = "100%";
    state.timerId = setInterval(() => {
      state.elapsedSec = Math.min(Math.floor((Date.now() - state.startedAt) / 1000), TOTAL_SECONDS);
      const left = TOTAL_SECONDS - state.elapsedSec;
      el.timerText.textContent = formatTime(left);
      el.timerBar.style.width = `${(left / TOTAL_SECONDS) * 100}%`;
      if (left <= 0) { clearInterval(state.timerId); state.timerId = null; submitQuiz(); }
    }, 1000);
  }

  function goHome() { window.location.href = 'index.html'; }
  // Submit modal helpers
  function openSubmitModal() {
    const m = document.getElementById('submit-modal');
    if (!m) { submitQuiz(); return; }
    m.setAttribute('aria-hidden','false');
    m.setAttribute('aria-modal','true');
  }
  function closeSubmitModal() {
    const m = document.getElementById('submit-modal');
    if (!m) return;
    m.setAttribute('aria-hidden','true');
    m.setAttribute('aria-modal','false');
  }

  function bindEvents() {
    el.btnPrev.addEventListener("click", () => goto(-1));
    el.btnNext.addEventListener("click", () => goto(1));
    el.btnSubmit.addEventListener("click", openSubmitModal);
    const bConfirm = document.getElementById('submit-confirm');
    const bCancel = document.getElementById('submit-cancel');
    const bCancelX = document.getElementById('submit-cancel-x');
    const bBackdrop = document.getElementById('submit-backdrop');
    if (bConfirm) bConfirm.addEventListener('click', () => { closeSubmitModal(); submitQuiz(); });
    if (bCancel) bCancel.addEventListener('click', closeSubmitModal);
    if (bCancelX) bCancelX.addEventListener('click', closeSubmitModal);
    if (bBackdrop) bBackdrop.addEventListener('click', closeSubmitModal);
    // После сдачи теста закрытие модалки ведёт на главную
    el.resultClose.addEventListener("click", goHome);
    el.resultBackdrop.addEventListener("click", goHome);
    el.resultOk.addEventListener("click", goHome);
  }

  function init() {
    if (!document.getElementById("quiz")) return;
    initDom();
    bindEvents();
    renderQuestion();
    updateControls();
    updateHeader();
    startTimer();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
