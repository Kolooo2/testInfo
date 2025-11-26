function updateScoreDisplay() {
    const correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    const incorrectAnswers = parseInt(localStorage.getItem("incorrectAnswers")) || 0;

    const correctElement = document.getElementById("correctCount");
    const incorrectElement = document.getElementById("incorrectCount");

    if (correctElement) correctElement.textContent = correctAnswers;
    if (incorrectElement) incorrectElement.textContent = incorrectAnswers;
}

function check1() 
{
    let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    let incorrectAnswers = parseInt(localStorage.getItem("incorrectAnswers")) || 0;

if (calc.testa.value == "html") {
    correctAnswers++;
    localStorage.setItem("correctAnswers", correctAnswers);
    updateScoreDisplay();
    alert("Правильно!");
    window.location.href ="2t.html";
} else {
    incorrectAnswers++;
    localStorage.setItem("incorrectAnswers", incorrectAnswers);
    updateScoreDisplay();
    alert("Неправильно!");
}
}

function check2() 
{
    let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    let incorrectAnswers = parseInt(localStorage.getItem("incorrectAnswers")) || 0;

if (calc.testb.value == "html") {
    correctAnswers++;
    localStorage.setItem("correctAnswers", correctAnswers);
    updateScoreDisplay();
    alert("Правильно!");
    window.location.href ="3t.html";
} else {
    incorrectAnswers++;
    localStorage.setItem("incorrectAnswers", incorrectAnswers);
    updateScoreDisplay();
    alert("Неправильно!");
}
}

document.addEventListener("DOMContentLoaded", function() {
    updateScoreDisplay();
});