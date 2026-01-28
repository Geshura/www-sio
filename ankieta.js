// Questions with reversed flags
const QUESTIONS = [
    { text: "Odwlekam zadania ponad rozsądny czas", reversed: false },
    { text: "Robię wszystko kiedy uważam, że to musi być zrobione", reversed: true },
    { text: "Często żałuję, że nie zajęłem się zadaniem wcześniej", reversed: false },
    { text: "Są aspekty mojego życia, które odkładam, chociaż wiem, że nie powinienem", reversed: false },
    { text: "Jeśli jest coś co powinienem wykonać, robię to zanim przejdę do łatwiejszego zadania", reversed: true },
    { text: "Odkładam rzeczy do zrobienia tak długo, że mój dobrostan lub efektywność tracą na tym", reversed: false },
    { text: "Pod koniec dnia wiem, że mógłbym spędzić czas lepiej", reversed: false },
    { text: "Spędzam mój czas mądrze", reversed: true },
    { text: "Kiedy powinienem robić jedną rzecz, robię inną", reversed: false }
];

const THRESHOLDS = [
    { min: 9, max: 19, label: "Dolne 10% - Mistrzowskie zarządzanie czasem", color: "#16a34a" },
    { min: 20, max: 23, label: "Dolne 10-25% - Bardzo dobra samodyscyplina", color: "#22c55e" },
    { min: 24, max: 31, label: "Środkowe 50% - Przeciętny prokrastynator", color: "#f59e0b" },
    { min: 32, max: 36, label: "Górne 10-25% - Wyraźna tendencja do prokrastynacji", color: "#fb923c" },
    { min: 37, max: 45, label: "Górne 10% - Chroniczna prokrastynacja", color: "#ef4444" }
];

// State
let currentQuestion = 0;
let answers = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// ============ INITIALIZATION ============

function init() {
    setupThemeToggle();
    setupEventListeners();
    if (isDarkMode) document.body.classList.add('dark-mode');
}

// ============ THEME ============

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    toggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        toggle.textContent = isDarkMode ? 'Light' : 'Dark';
    });
    
    // Set initial icon
    toggle.textContent = isDarkMode ? 'Light' : 'Dark';
}

// ============ EVENT LISTENERS ============

function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (startBtn) startBtn.addEventListener('click', startSurvey);
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (finishBtn) finishBtn.addEventListener('click', finishSurvey);
    if (restartBtn) restartBtn.addEventListener('click', startSurvey);
}

// ============ SURVEY FLOW ============

function startSurvey() {
    currentQuestion = 0;
    answers = new Array(QUESTIONS.length).fill(0);
    
    const startScreen = document.getElementById('startScreen');
    const surveyScreen = document.getElementById('surveyScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    
    if (startScreen) startScreen.style.display = 'none';
    if (resultsScreen) resultsScreen.style.display = 'none';
    if (surveyScreen) surveyScreen.style.display = 'flex';
    
    showQuestion();
}

function showQuestion() {
    const question = QUESTIONS[currentQuestion];
    const qNum = currentQuestion + 1;
    
    // Update question text
    const questionText = document.getElementById('questionText');
    if (questionText) {
        questionText.textContent = `${qNum}. ${question.text}`;
    }
    
    // Update progress
    const progress = (qNum / QUESTIONS.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = `${qNum}/${QUESTIONS.length}`;
    
    // Create scale options
    const container = document.getElementById('scaleOptions');
    if (!container) return;
    
    container.innerHTML = '';
    
    const labels = [
        'Zdecydowanie się nie zgadzam',
        'Raczej się nie zgadzam',
        'Trudno powiedzieć / Częściowo się zgadzam',
        'Raczej się zgadzam',
        'Zdecydowanie się zgadzam'
    ];
    
    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('button');
        button.className = 'scale-option-btn';
        button.type = 'button';
        button.dataset.value = i;
        button.textContent = labels[i - 1];
        
        if (answers[currentQuestion] === i) {
            button.classList.add('selected');
        }
        
        button.addEventListener('click', () => {
            answers[currentQuestion] = i;
            // Remove selected from all buttons
            container.querySelectorAll('.scale-option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Add selected to clicked button
            button.classList.add('selected');
            updateNavigation();
        });
        
        container.appendChild(button);
    }
    
    updateNavigation();
}

function updateNavigation() {
    const hasAnswer = answers[currentQuestion] > 0;
    const isLast = currentQuestion === QUESTIONS.length - 1;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentQuestion > 0 ? 'inline-flex' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = (!isLast && hasAnswer) ? 'inline-flex' : 'none';
    }
    
    if (finishBtn) {
        finishBtn.style.display = (isLast && hasAnswer) ? 'inline-flex' : 'none';
    }
}

function nextQuestion() {
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        showQuestion();
        scrollToQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        scrollToQuestion();
    }
}

function scrollToQuestion() {
    const card = document.querySelector('.question-card');
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============ RESULTS ============

function finishSurvey() {
    // Calculate score with reversed questions
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
        const val = answers[i];
        if (QUESTIONS[i].reversed) {
            score += (6 - val);
        } else {
            score += val;
        }
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

function showResults(score) {
    const surveyScreen = document.getElementById('surveyScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    
    if (surveyScreen) surveyScreen.style.display = 'none';
    if (resultsScreen) resultsScreen.style.display = 'flex';
    
    // Score Display
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) scoreDisplay.textContent = score;
    
    // Find matching threshold
    let threshold = THRESHOLDS[0];
    for (let t of THRESHOLDS) {
        if (score >= t.min && score <= t.max) {
            threshold = t;
            break;
        }
    }
    
    // Interpretation Box
    const interpBox = document.getElementById('interpretation');
    if (interpBox) {
        interpBox.innerHTML = `
            <h3>${threshold.label}</h3>
            <p>${getInterpretation(score)}</p>
        `;
        interpBox.style.borderLeftColor = threshold.color;
    }
    
    // Threshold List
    const thresholdList = document.getElementById('thresholdList');
    if (thresholdList) {
        thresholdList.innerHTML = '';
        
        for (let t of THRESHOLDS) {
            const isCurrent = score >= t.min && score <= t.max;
            const div = document.createElement('div');
            div.className = 'threshold-item' + (isCurrent ? ' current' : '');
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'threshold-color';
            colorDiv.style.backgroundColor = t.color;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'threshold-content';
            contentDiv.innerHTML = `
                <div class="threshold-label">${t.label}</div>
                <div class="threshold-range">Punkty: ${t.min}-${t.max}</div>
            `;
            
            div.appendChild(colorDiv);
            div.appendChild(contentDiv);
            thresholdList.appendChild(div);
        }
    }
    
    // Show history if available
    showHistoryIfAvailable();
    
    resultsScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getInterpretation(score) {
    if (score <= 19) {
        return "Gratulacje! Należysz do elity osób, które skutecznie zarządzają swoim czasem. Odwlekanie zadań praktycznie Ci nie przeszkadza. Twoje nawyki są wzorem dla innych - kontynuuj to, co robisz!";
    } else if (score <= 23) {
        return "Świetnie sobie radzisz z zarządzaniem czasem! Prokrastynacja pojawia się u Ciebie rzadko i nie stanowi poważnego problemu. Twoja samodyscyplina jest godna podziwu.";
    } else if (score <= 31) {
        return "Jesteś w grupie większości ludzi. Czasami odkładasz sprawy na później, ale jest to normalne. Rozważ wdrożenie technik planowania, takich jak metoda Pomodoro czy dzielenie zadań na mniejsze kroki.";
    } else if (score <= 36) {
        return "Prokrastynacja stanowi dla Ciebie istotny problem, który wpływa na Twoją produktywność i dobre samopoczucie. Warto poważnie zastanowić się nad zmianą nawyków. Spróbuj systematycznych strategii, takich jak kalendarz zadań czy reward system.";
    } else {
        return "Prokrastynacja jest dla Ciebie poważnym, chronicznym problemem. Zdecydowanie zalecam rozważenie pracy z psychologiem lub specjalistą ds. zarządzania czasem. Rozpocznij od małych zmian i buduj nowe nawyki krok po kroku.";
    }
}

// ============ HISTORY ============

function showHistoryIfAvailable() {
    const results = JSON.parse(localStorage.getItem('surveyResults') || '[]');
    if (results.length <= 1) return;
    
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    
    if (!historySection || !historyList) return;
    
    // Show last 5 results
    const recentResults = results.slice(-5).reverse();
    
    historyList.innerHTML = '';
    
    for (let i = 0; i < recentResults.length; i++) {
        const result = recentResults[i];
        const date = new Date(result.timestamp);
        const dateStr = date.toLocaleDateString('pl-PL', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span class="history-score">Wynik: <strong>${result.score}</strong></span>
            <span class="history-date">${dateStr}</span>
        `;
        
        historyList.appendChild(item);
    }
    
    historySection.style.display = 'block';
}

// ============ EXPORT ============

function exportResult() {
    const results = JSON.parse(localStorage.getItem('surveyResults') || '[]');
    if (results.length === 0) {
        alert('Brak wyników do exportu');
        return;
    }
    
    const lastResult = results[results.length - 1];
    const date = new Date(lastResult.timestamp);
    const dateStr = date.toLocaleString('pl-PL');
    
    // Find threshold
    let threshold = THRESHOLDS[0];
    for (let t of THRESHOLDS) {
        if (lastResult.score >= t.min && lastResult.score <= t.max) {
            threshold = t;
            break;
        }
    }
    
    let text = `═══════════════════════════════════════════════════\n`;
    text += `ANKIETA - SKALA IRRACJONALNEGO ODWLEKANIA\n`;
    text += `P. Steel (2010)\n`;
    text += `═══════════════════════════════════════════════════\n\n`;
    
    text += `Data wypełnienia: ${dateStr}\n`;
    text += `WYNIK KOŃCOWY: ${lastResult.score} punktów\n`;
    text += `INTERPRETACJA: ${threshold.label}\n\n`;
    
    text += `═══════════════════════════════════════════════════\n`;
    text += `ODPOWIEDZI SZCZEGÓŁOWE:\n`;
    text += `═══════════════════════════════════════════════════\n\n`;
    
    for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[i];
        const answer = lastResult.answers[i];
        const reversed = q.reversed ? ' [pytanie odwrócone]' : '';
        text += `${i + 1}. ${q.text}${reversed}\n`;
        text += `   Twoja odpowiedź: ${answer}/5\n`;
        text += `   Punkty: ${q.reversed ? 6 - answer : answer}\n\n`;
    }
    
    text += `═══════════════════════════════════════════════════\n`;
    text += `WYJAŚNIENIE KATEGORII:\n`;
    text += `═══════════════════════════════════════════════════\n\n`;
    
    for (let t of THRESHOLDS) {
        const marker = (lastResult.score >= t.min && lastResult.score <= t.max) ? '>>> ' : '';
        text += `${marker}${t.label} (${t.min}-${t.max} pkt)\n`;
    }
    
    text += `\n═══════════════════════════════════════════════════\n`;
    text += `Wygenerowano: ${new Date().toLocaleString('pl-PL')}\n`;
    text += `═══════════════════════════════════════════════════\n`;
    
    // Download
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ankieta_wynik_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============ START ============

document.addEventListener('DOMContentLoaded', init);
