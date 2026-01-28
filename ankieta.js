// Questions
const QUESTIONS = [
    "Odwlekam zadania ponad rozsądny czas",
    "Robię wszystko kiedy uważam, że to musi być zrobione",
    "Często żałuję, że nie zajęłem się zadaniem wcześniej",
    "Są aspekty mojego życia, które odkładam, chociaż wiem, że nie powinienem",
    "Jeśli jest coś co powinienem wykonać, robię to zanim przejdę do łatwiejszego zadania",
    "Odkładam rzeczy do zrobienia tak długo, że mój dobrostan lub efektywność tracą na tym",
    "Pod koniec dnia wiem, że mógłbym spędzić czas lepiej",
    "Spędzam mój czas mądrze",
    "Kiedy powinienem robić jedną rzecz, robię inną"
];

const REVERSED = [false, true, false, false, true, false, false, true, false];

const THRESHOLDS = [
    { min: 9, max: 19, label: "🎯 Dolne 10% - Mistrzowskie zarządzanie czasem", color: "#16a34a" },
    { min: 20, max: 23, label: "✅ Dolne 10-25% - Bardzo dobra samodyscyplina", color: "#22c55e" },
    { min: 24, max: 31, label: "⚖️ Środkowe 50% - Przeciętny prokrastynator", color: "#f59e0b" },
    { min: 32, max: 36, label: "⚠️ Górne 10-25% - Wyraźna tendencja do prokrastynacji", color: "#fb923c" },
    { min: 37, max: 45, label: "🚨 Górne 10% - Chroniczna prokrastynacja", color: "#ef4444" }
];

// State
let currentQuestion = 0;
let answers = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Init
function init() {
    setupThemeToggle();
    setupEventListeners();
    if (isDarkMode) document.body.classList.add('dark-mode');
}

// Theme Toggle
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startSurvey);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('restartBtn').addEventListener('click', startSurvey);
    document.getElementById('exportBtn').addEventListener('click', exportResult);
}

// Start Survey
function startSurvey() {
    currentQuestion = 0;
    answers = new Array(QUESTIONS.length).fill(0);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('surveyScreen').style.display = 'block';
    showQuestion();
}

// Show Question
function showQuestion() {
    const question = QUESTIONS[currentQuestion];
    const qNum = currentQuestion + 1;
    
    // Update question text
    document.getElementById('questionText').textContent = `${qNum}. ${question}`;
    
    // Update progress
    const progress = (qNum / QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${qNum}/${QUESTIONS.length}`;
    
    // Create scale options
    const container = document.getElementById('scaleOptions');
    container.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const label = document.createElement('label');
        label.className = 'scale-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'scale';
        input.value = i;
        if (answers[currentQuestion] === i) input.checked = true;
        
        const span = document.createElement('span');
        span.textContent = i;
        
        input.addEventListener('change', (e) => {
            answers[currentQuestion] = parseInt(e.target.value);
            updateNavigation();
        });
        
        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(label);
    }
    
    updateNavigation();
}

// Update Navigation
function updateNavigation() {
    const hasAnswer = answers[currentQuestion] > 0;
    const isLast = currentQuestion === QUESTIONS.length - 1;
    
    document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    document.getElementById('nextBtn').style.display = !isLast && hasAnswer ? 'inline-block' : 'none';
    
    if (isLast && hasAnswer) {
        document.getElementById('nextBtn').style.display = 'none';
        setTimeout(() => finishSurvey(), 500);
    }
}

// Next Question
function nextQuestion() {
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        showQuestion();
    }
}

// Prev Question
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

// Finish Survey
function finishSurvey() {
    // Calculate score
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
        const val = answers[i];
        score += REVERSED[i] ? (6 - val) : val;
    }
    
    // Save to localStorage
    const result = {
        score,
        answers,
        timestamp: new Date().toISOString()
    };
    
    let results = JSON.parse(localStorage.getItem('surveyResults') || '[]');
    results.push(result);
    localStorage.setItem('surveyResults', JSON.stringify(results));
    
    // Show results
    showResults(score);
}

// Show Results
function showResults(score) {
    document.getElementById('surveyScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
    // Score
    document.getElementById('scoreDisplay').textContent = score;
    
    // Interpretation
    let threshold = THRESHOLDS[0];
    for (let t of THRESHOLDS) {
        if (score >= t.min && score <= t.max) {
            threshold = t;
            break;
        }
    }
    
    const interpBox = document.getElementById('interpretation');
    interpBox.innerHTML = `
        <h3>${threshold.label}</h3>
        <p>${getInterpretation(score)}</p>
    `;
    
    // Threshold List
    const thresholdList = document.getElementById('thresholdList');
    thresholdList.innerHTML = '';
    
    for (let t of THRESHOLDS) {
        const isCurrent = score >= t.min && score <= t.max;
        const div = document.createElement('div');
        div.className = 'threshold-item' + (isCurrent ? ' current' : '');
        div.innerHTML = `
            <div class="threshold-color" style="background-color: ${t.color};"></div>
            <div class="threshold-content">
                <div class="threshold-label">${t.label}</div>
                <div class="threshold-range">Punkty: ${t.min}-${t.max}</div>
            </div>
        `;
        thresholdList.appendChild(div);
    }
}

// Get Interpretation
function getInterpretation(score) {
    if (score <= 19) {
        return "Gratulacje! Należysz do elity osób, które skutecznie zarządzają swoim czasem. Odwlekanie zadań praktycznie Ci nie przeszkadza.";
    } else if (score <= 23) {
        return "Świetnie sobie radzisz z zarządzaniem czasem! Prokrastynacja pojawia się u Ciebie rzadko i nie stanowi poważnego problemu.";
    } else if (score <= 31) {
        return "Jesteś w grupie większości ludzi. Czasami odkładasz sprawy na później. Rozważ wprowadzenie lepszych nawyków planowania.";
    } else if (score <= 36) {
        return "Prokrastynacja stanowi dla Ciebie istotny problem. Warto poważnie zastanowić się nad strategiami radzenia sobie z tym nawykiem.";
    } else {
        return "Prokrastynacja jest dla Ciebie poważnym problemem. Rozważ skorzystanie z pomocy specjalisty lub wdrożenie technik zarządzania czasem.";
    }
}

// Export Result
function exportResult() {
    const results = JSON.parse(localStorage.getItem('surveyResults') || '[]');
    const lastResult = results[results.length - 1];
    
    let text = `Wynik ankiety - Skala Irracjonalnego Odwlekania\n`;
    text += `Data: ${new Date(lastResult.timestamp).toLocaleString('pl-PL')}\n`;
    text += `Wynik: ${lastResult.score} punktów\n\n`;
    text += `Odpowiedzi:\n`;
    
    for (let i = 0; i < QUESTIONS.length; i++) {
        text += `${i + 1}. ${QUESTIONS[i]}\n   Odpowiedź: ${lastResult.answers[i]}\n`;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ankieta_${new Date().getTime()}.txt`;
    a.click();
}

// Start
document.addEventListener('DOMContentLoaded', init);
