/**
 * UWAGA: To jest aplikacja frontend-only!
 * Dane są zapisywane LOKALNIE w localStorage przeglądarki.
 * Każdy użytkownik widzi tylko swoje dane.
 * 
 * Aby zbierać dane centralnie, potrzebujesz:
 * - Backend serwer (Node.js, Python, PHP)
 * - Bazę danych (Firebase, Supabase, MongoDB)
 * - Lub gotowe rozwiązanie (Google Forms, Typeform)
 */

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
        updateThemeIcon('☀️');
    } else if (theme === 'light') {
        html.classList.remove('dark-mode');
        html.classList.add('light-mode');
        updateThemeIcon('🌙');
    } else {
        // auto
        html.classList.remove('dark-mode', 'light-mode');
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        updateThemeIcon(isDark ? '☀️' : '🌙');
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'auto';
    
    let newTheme = 'auto';
    if (currentTheme === 'auto') {
        newTheme = 'dark';
    } else if (currentTheme === 'dark') {
        newTheme = 'light';
    }
    
    applyTheme(newTheme);
}

function updateThemeIcon(icon) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.querySelector('.theme-icon').textContent = icon;
    }
}

// Initialize theme on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Local storage key for responses
const STORAGE_KEY = 'procrastinationResponses';

// Survey questions
const SURVEY_QUESTIONS = [
    { number: 1, text: 'Odwlekam zadania ponad rozsądny czas', reversed: false },
    { number: 2, text: 'Robię wszystko kiedy uważam, że to musi być zrobione', reversed: true },
    { number: 3, text: 'Często żałuję, że nie zajęłem się zadaniem wcześniej', reversed: false },
    { number: 4, text: 'Są aspekty mojego życia, które odkładam, chociaż wiem, że nie powinienem', reversed: false },
    { number: 5, text: 'Jeśli jest coś co powinienem wykonać, robię to zanim przejdę do łatwiejszego zadania', reversed: true },
    { number: 6, text: 'Odkładam rzeczy do zrobienia tak długo, że mój dobrostan lub efektywność tracą na tym', reversed: false },
    { number: 7, text: 'Pod koniec dnia wiem, że mógłbym spędzić czas lepiej', reversed: false },
    { number: 8, text: 'Spędzam mój czas mądrze', reversed: true },
    { number: 9, text: 'Kiedy powinienem robić jedną rzecz, robię inną', reversed: false }
];

// Current survey state
let currentSurveyAnswers = {};
let currentQuestionIndex = 0;

// Initialize or get existing responses
function getResponses() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveResponse(response) {
    const responses = getResponses();
    response.timestamp = new Date().toISOString();
    response.id = Date.now();
    responses.push(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
}

// Start modal survey
function startModalSurvey() {
    currentSurveyAnswers = {};
    currentQuestionIndex = 0;
    document.getElementById('surveySection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    showModalQuestion();
}

// Show modal question
function showModalQuestion() {
    if (currentQuestionIndex >= SURVEY_QUESTIONS.length) {
        // Calculate total score and show results
        let totalScore = 0;
        for (let i = 1; i <= 9; i++) {
            totalScore += currentSurveyAnswers[`q${i}`];
        }
        
        const response = {
            score: totalScore,
            answers: currentSurveyAnswers
        };
        
        saveResponse(response);
        showResults(totalScore);
        return;
    }
    
    const question = SURVEY_QUESTIONS[currentQuestionIndex];
    const modal = document.getElementById('questionModal') || createQuestionModal();
    
    // Update modal content
    document.getElementById('modalQuestionNumber').textContent = `Pytanie ${question.number} z 9`;
    document.getElementById('modalQuestionText').textContent = question.text;
    document.getElementById('progressBar').style.width = `${((currentQuestionIndex + 1) / 9) * 100}%`;
    document.getElementById('progressPercentage').textContent = `${Math.round((currentQuestionIndex + 1) / 9 * 100)}%`;
    
    // Create scale options
    const scaleContainer = document.getElementById('modalScaleOptions');
    scaleContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const label = document.createElement('label');
        label.className = 'scale-option modal-scale-option';
        label.innerHTML = `
            <input type="radio" name="modalAnswer" value="${i}" class="modal-radio">
            <span class="scale-value">${i}</span>
        `;
        scaleContainer.appendChild(label);
    }
    
    // Set up event listeners
    document.querySelectorAll('.modal-radio').forEach(radio => {
        radio.addEventListener('change', function() {
            const qNumber = `q${question.number}`;
            currentSurveyAnswers[qNumber] = parseInt(this.value);
            
            // Auto-advance after selection
            setTimeout(() => {
                currentQuestionIndex++;
                showModalQuestion();
            }, 300);
        });
    });
    
    // Show navigation buttons
    const prevBtn = document.getElementById('prevQuestionBtn');
    
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    
    prevBtn.onclick = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showModalQuestion();
        }
    };
    
    modal.style.display = 'flex';
}

function createQuestionModal() {
    const modal = document.createElement('div');
    modal.id = 'questionModal';
    modal.className = 'question-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="progress-container">
                <div class="progress-background">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                <div class="progress-text" id="progressPercentage">0%</div>
            </div>
            
            <div class="modal-header">
                <div class="question-number" id="modalQuestionNumber"></div>
            </div>
            
            <div class="modal-body">
                <p class="modal-question" id="modalQuestionText"></p>
                
                <div class="scale-legend-modal">
                    <div class="legend-item-modal"><strong>1</strong> - Bardzo rzadko</div>
                    <div class="legend-item-modal"><strong>2</strong> - Rzadko</div>
                    <div class="legend-item-modal"><strong>3</strong> - Czasami</div>
                    <div class="legend-item-modal"><strong>4</strong> - Często</div>
                    <div class="legend-item-modal"><strong>5</strong> - Bardzo często</div>
                </div>
                
                <div class="modal-scale-options" id="modalScaleOptions"></div>
            </div>
            
            <div class="modal-footer">
                <button id="prevQuestionBtn" class="back-btn" style="display: none;">← Poprzednie pytanie</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Handle form submission for procrastination questionnaire
const form = document.getElementById('procrastinationForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        startModalSurvey();
    });
}

// Start button
const startBtn = document.getElementById('startSurveyBtn');
if (startBtn) {
    startBtn.addEventListener('click', function() {
        document.getElementById('startSection').style.display = 'none';
        startModalSurvey();
    });
}

function showResults(score) {
    // Hide modal if open
    const modal = document.getElementById('questionModal');
    if (modal) modal.style.display = 'none';
    
    document.getElementById('surveySection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('personalScore').textContent = score;
    
    // Get threshold information
    const thresholds = [
        { min: 9, max: 19, category: '🎯 Dolne 10% - Mistrzowskie zarządzanie czasem', color: '#10b981' },
        { min: 20, max: 23, category: '✅ Dolne 10-25% - Bardzo dobra samodyscyplina', color: '#34d399' },
        { min: 24, max: 31, category: '⚖️ Środkowe 50% - Przeciętny prokrastynator', color: '#f59e0b' },
        { min: 32, max: 36, category: '⚠️ Górne 10-25% - Wyraźna tendencja do prokrastynacji', color: '#fb923c' },
        { min: 37, max: 45, category: '🚨 Górne 10% - Chroniczna prokrastynacja', color: '#ef4444' }
    ];
    
    // Determine interpretation
    let interpretation = '';
    let userThreshold = null;
    
    if (score <= 19) {
        interpretation = `
            <h3>🎯 Dolne 10% - Mistrzowskie zarządzanie czasem</h3>
            <p><strong>Twoja mantra:</strong> "Najpierw rzeczy najważniejsze"</p>
            <p>Gratulacje! Należysz do elity osób, które skutecznie zarządzają swoim czasem. Odwlekanie zadań praktycznie Ci nie przeszkadza. Kontynuuj swoje dobre nawyki i być może podziel się swoimi strategiami z innymi!</p>
        `;
        userThreshold = 0;
    } else if (score <= 23) {
        interpretation = `
            <h3>✅ Dolne 10-25% - Bardzo dobra samodyscyplina</h3>
            <p>Świetnie sobie radzisz z zarządzaniem czasem! Prokrastynacja pojawia się u Ciebie rzadko i nie stanowi poważnego problemu. Twoje nawyki są wzorem dla innych.</p>
        `;
        userThreshold = 1;
    } else if (score <= 31) {
        interpretation = `
            <h3>⚖️ Środkowe 50% - Przeciętny prokrastynator</h3>
            <p>Jesteś w grupie większości ludzi. Czasami odkładasz sprawy na później, ale nie jest to jeszcze poważny problem. Rozważ wprowadzenie lepszych nawyków planowania i priorytetyzacji zadań.</p>
        `;
        userThreshold = 2;
    } else if (score <= 36) {
        interpretation = `
            <h3>⚠️ Górne 10-25% - Wyraźna tendencja do prokrastynacji</h3>
            <p>Prokrastynacja stanowi dla Ciebie istotny problem. Często odkładasz ważne zadania, co może wpływać na Twoją efektywność i dobrostan. Warto poważnie zastanowić się nad strategiami radzenia sobie z tym nawykiem.</p>
        `;
        userThreshold = 3;
    } else {
        interpretation = `
            <h3>🚨 Górne 10% - Chroniczna prokrastynacja</h3>
            <p><strong>Twoje drugie imię:</strong> "Jutro"</p>
            <p>Prokrastynacja jest dla Ciebie poważnym problemem, który prawdopodobnie znacząco wpływa na różne obszary Twojego życia. Rozważ skorzystanie z pomocy specjalisty lub wdrożenie systematycznych technik zarządzania czasem, takich jak metoda Pomodoro, ustalanie konkretnych terminów czy dzielenie dużych zadań na mniejsze kroki.</p>
        `;
        userThreshold = 4;
    }
    
    document.getElementById('interpretation').innerHTML = interpretation;
    
    // Add threshold information section
    const thresholdHtml = `
        <hr style="border: none; border-top: 2px solid var(--border); margin: 3rem 0;">
        <div class="threshold-info">
            <h2>📊 Skala Interpretacji Wyników</h2>
            <p class="threshold-description">Poniżej zobacz, gdzie pasuje Twój wynik w stosunku do innych respondentów:</p>
            <div class="threshold-bars">
                ${thresholds.map((t, idx) => `
                    <div class="threshold-bar ${idx === userThreshold ? 'current-threshold' : ''}">
                        <div class="threshold-color" style="background-color: ${t.color};"></div>
                        <div class="threshold-details">
                            <div class="threshold-category">${t.category}</div>
                            <div class="threshold-range">Punkty: ${t.min}-${t.max}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Insert threshold info after interpretation
    const interpretationDiv = document.getElementById('interpretation');
    interpretationDiv.insertAdjacentHTML('afterend', thresholdHtml);
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    // Update statistics
    updateStatistics();
}

// Generate sample data for procrastination
function generateSampleData() {
    const sampleResponses = [];
    const numResponses = 100;
    
    for (let i = 0; i < numResponses; i++) {
        // Generate realistic distribution
        const baseScore = Math.floor(Math.random() * 45) + 9; // 9-45 range
        const response = {
            score: baseScore,
            answers: {},
            timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            id: Date.now() + i
        };
        
        // Generate individual answers that sum to baseScore
        let remaining = baseScore;
        for (let j = 1; j <= 8; j++) {
            const maxVal = Math.min(5, remaining - (9 - j));
            const minVal = Math.max(1, remaining - 5 * (9 - j));
            const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            response.answers[`q${j}`] = val;
            remaining -= val;
        }
        response.answers.q9 = remaining;
        
        sampleResponses.push(response);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResponses));
    location.reload();
}

// Clear all data
function clearAllData() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// Show new survey
function showNewSurvey() {
    document.getElementById('startSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('surveySection').style.display = 'none';
    document.getElementById('procrastinationForm').reset();
    document.getElementById('startSection').scrollIntoView({ behavior: 'smooth' });
}

// Add event listeners for buttons
const generateBtn = document.getElementById('generateDataBtn');
if (generateBtn) {
    generateBtn.addEventListener('click', generateSampleData);
}

const clearBtn = document.getElementById('clearDataBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', clearAllData);
}

const newSurveyBtn = document.getElementById('newSurveyBtn');
if (newSurveyBtn) {
    newSurveyBtn.addEventListener('click', showNewSurvey);
}

// Calculate statistics for results page
function calculateStats() {
    const responses = getResponses();
    
    if (responses.length === 0) return null;
    
    const stats = {
        totalResponses: responses.length,
        avgScore: 0,
        scoreDistribution: { '1-19': 0, '20-23': 0, '24-31': 0, '32-36': 0, '37-45': 0 },
        questionAverages: {}
    };
    
    let totalScore = 0;
    
    // Initialize question averages
    for (let i = 1; i <= 9; i++) {
        stats.questionAverages[`q${i}`] = 0;
    }
    
    // Calculate distributions and averages
    responses.forEach(r => {
        totalScore += r.score;
        
        // Score distribution
        if (r.score <= 19) stats.scoreDistribution['1-19']++;
        else if (r.score <= 23) stats.scoreDistribution['20-23']++;
        else if (r.score <= 31) stats.scoreDistribution['24-31']++;
        else if (r.score <= 36) stats.scoreDistribution['32-36']++;
        else stats.scoreDistribution['37-45']++;
        
        // Question averages
        for (let i = 1; i <= 9; i++) {
            stats.questionAverages[`q${i}`] += r.answers[`q${i}`];
        }
    });
    
    // Calculate final averages
    stats.avgScore = (totalScore / responses.length).toFixed(1);
    for (let i = 1; i <= 9; i++) {
        stats.questionAverages[`q${i}`] = (stats.questionAverages[`q${i}`] / responses.length).toFixed(2);
    }
    
    return stats;
}

function updateStatistics() {
    const stats = calculateStats();
    
    if (!stats) {
        return;
    }
    
    // Update stats cards
    document.getElementById('totalResponses').textContent = stats.totalResponses;
    document.getElementById('avgRating').textContent = stats.avgScore;
    
    // Calculate percentage in high procrastination range
    const highProcrastPercent = Math.round(
        ((stats.scoreDistribution['32-36'] + stats.scoreDistribution['37-45']) / stats.totalResponses) * 100
    );
    document.getElementById('recommendPercent').textContent = stats.totalResponses;
    document.querySelector('#recommendPercent').previousElementSibling.textContent = stats.avgScore;
    
    // Score distribution chart
    renderBarChart('ratingChart', stats.scoreDistribution, {
        '1-19': '🎯 Dolne 10% (1-19 pkt)',
        '20-23': '✅ Dolne 10-25% (20-23 pkt)',
        '24-31': '⚖️ Środkowe 50% (24-31 pkt)',
        '32-36': '⚠️ Górne 10-25% (32-36 pkt)',
        '37-45': '🚨 Górne 10% (37+ pkt)'
    }, stats.totalResponses);
    
    // Question averages chart
    const questionLabels = {
        'q1': 'P1: Odwlekam zadania',
        'q2': 'P2: Robię kiedy trzeba (odwr.)',
        'q3': 'P3: Żałuję odkładania',
        'q4': 'P4: Odkładam aspekty życia',
        'q5': 'P5: Trudne najpierw (odwr.)',
        'q6': 'P6: Tracę efektywność',
        'q7': 'P7: Mógłbym lepiej',
        'q8': 'P8: Mądre zarządzanie (odwr.)',
        'q9': 'P9: Robię co innego'
    };
    
    renderBarChart('frequencyChart', stats.questionAverages, questionLabels, 5, false);
    
    // Hide aspects and age charts for procrastination questionnaire
    document.querySelector('#aspectsChart').parentElement.parentElement.style.display = 'none';
    document.querySelector('#ageChart').parentElement.parentElement.style.display = 'none';
    document.querySelector('#commentsList').parentElement.parentElement.style.display = 'none';
    document.querySelector('#recommendChart').parentElement.parentElement.style.display = 'none';
}

// Render results page
const stats = calculateStats();

if (!stats) {
    const generateBtn = document.getElementById('generateDataBtn');
    if (generateBtn) {
        generateBtn.innerHTML = '<span>🎲 Wygeneruj przykładowe dane</span>';
    }
} else {
    updateStatistics();
}

function renderResults(stats) {
    const container = document.querySelector('.results-content');
    if (!container) return;
    
    // Update stats cards
    document.getElementById('totalResponses').textContent = stats.totalResponses;
    document.getElementById('avgRating').textContent = stats.avgRating;
    
    const recommendPercent = Math.round((stats.q2Distribution.tak / stats.totalResponses) * 100);
    document.getElementById('recommendPercent').textContent = recommendPercent + '%';
    
    // Q1 - Rating distribution
    renderBarChart('ratingChart', stats.q1Distribution, {
        '1': '⭐ Bardzo słaba',
        '2': '⭐⭐ Słaba',
        '3': '⭐⭐⭐ Średnia',
        '4': '⭐⭐⭐⭐ Dobra',
        '5': '⭐⭐⭐⭐⭐ Bardzo dobra'
    }, stats.totalResponses);
    
    // Q2 - Recommendation
    renderPieChart('recommendChart', stats.q2Distribution, {
        'tak': { label: '✅ Tak, zdecydowanie', color: '#10b981' },
        'moze': { label: '🤔 Może', color: '#f59e0b' },
        'nie': { label: '❌ Nie', color: '#ef4444' }
    }, stats.totalResponses);
    
    // Q3 - Frequency
    renderBarChart('frequencyChart', stats.q3Distribution, {
        'codziennie': '🔥 Codziennie',
        'tygodniowo': '📅 Kilka razy w tygodniu',
        'miesiecznie': '📆 Raz w miesiącu',
        'rzadko': '⏰ Rzadko'
    }, stats.totalResponses);
    
    // Q4 - Important aspects
    renderBarChart('aspectsChart', stats.q4Distribution, {
        'cena': '💰 Cena',
        'jakosc': '⚡ Jakość',
        'szybkosc': '🚀 Szybkość',
        'obsluga': '👥 Obsługa klienta',
        'funkcje': '🎯 Funkcjonalność'
    }, stats.totalResponses, false);
    
    // Q6 - Age distribution
    renderBarChart('ageChart', stats.q6Distribution, {
        '18-25': '18-25 lat',
        '26-35': '26-35 lat',
        '36-45': '36-45 lat',
        '46-55': '46-55 lat',
        '56+': '56+ lat'
    }, stats.totalResponses);
    
    // Comments
    renderComments('commentsList', stats.comments);
}

function renderBarChart(containerId, data, labels, total, usePercentage = true) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    
    const html = sortedEntries.map(([key, value]) => {
        const percentage = usePercentage ? Math.round((value / total) * 100) : value;
        const width = usePercentage ? percentage : Math.min((value / total) * 100, 100);
        
        return `
            <div class="bar-item">
                <div class="bar-label">
                    <span>${labels[key] || key}</span>
                    <span>${percentage}${usePercentage ? '%' : ''}</span>
                </div>
                <div class="bar-background">
                    <div class="bar-fill" style="width: ${width}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    
    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.bar-fill').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.width = bar.style.width;
            }, i * 100);
        });
    }, 100);
}

function renderPieChart(containerId, data, config, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    
    let currentAngle = 0;
    const segments = sortedEntries.map(([key, value]) => {
        const percentage = (value / total) * 100;
        const angle = (value / total) * 360;
        const segment = {
            key,
            value,
            percentage: Math.round(percentage),
            startAngle: currentAngle,
            endAngle: currentAngle + angle,
            color: config[key].color,
            label: config[key].label
        };
        currentAngle += angle;
        return segment;
    });
    
    // Create SVG pie chart
    const svg = createPieChartSVG(segments);
    
    // Create legend
    const legend = segments.map(s => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${s.color}"></div>
            <div class="legend-text">${s.label}</div>
            <div class="legend-value">${s.percentage}%</div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="pie-chart-container">
            ${svg}
            <div class="pie-legend">${legend}</div>
        </div>
    `;
}

function createPieChartSVG(segments) {
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 10;
    
    const paths = segments.map(segment => {
        const startAngle = (segment.startAngle - 90) * Math.PI / 180;
        const endAngle = (segment.endAngle - 90) * Math.PI / 180;
        
        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);
        
        const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
        
        const path = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        return `<path d="${path}" fill="${segment.color}" stroke="rgba(255,255,255,0.2)" stroke-width="2" style="transition: transform 0.3s ease; transform-origin: ${center}px ${center}px;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>`;
    }).join('');
    
    return `
        <svg class="pie-chart" viewBox="0 0 ${size} ${size}" style="transform: rotate(0deg); transition: transform 1s ease;">
            ${paths}
        </svg>
    `;
}

function renderComments(containerId, comments) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (comments.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Brak komentarzy.</p>';
        return;
    }
    
    const html = comments.map((comment, i) => `
        <div class="comment-item" style="animation-delay: ${i * 0.1}s">
            <p class="comment-text">"${comment}"</p>
        </div>
    `).join('');
    
    container.innerHTML = html;
}