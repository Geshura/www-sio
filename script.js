// Simulate database with localStorage
const STORAGE_KEY = 'surveyResponses';

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

// Handle form submission
const form = document.getElementById('surveyForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const response = {};
        
        // Handle single-value inputs
        response.q1 = formData.get('q1');
        response.q2 = formData.get('q2');
        response.q3 = formData.get('q3');
        response.q5 = formData.get('q5');
        response.q6 = formData.get('q6');
        
        // Handle multi-value checkbox
        response.q4 = formData.getAll('q4');
        
        // Save response
        saveResponse(response);
        
        // Add success animation
        const button = form.querySelector('.submit-btn');
        button.textContent = '✓ Dziękujemy!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Redirect to results page
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);
    });
}

// Calculate statistics for results page
function calculateStats() {
    const responses = getResponses();
    
    if (responses.length === 0) {
        return null;
    }
    
    const stats = {
        totalResponses: responses.length,
        avgRating: 0,
        q1Distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        q2Distribution: { 'tak': 0, 'moze': 0, 'nie': 0 },
        q3Distribution: { 'codziennie': 0, 'tygodniowo': 0, 'miesiecznie': 0, 'rzadko': 0 },
        q4Distribution: { 'cena': 0, 'jakosc': 0, 'szybkosc': 0, 'obsluga': 0, 'funkcje': 0 },
        q6Distribution: { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 },
        comments: []
    };
    
    let totalRating = 0;
    
    responses.forEach(r => {
        // Q1 - Rating
        totalRating += parseInt(r.q1);
        stats.q1Distribution[r.q1]++;
        
        // Q2 - Recommendation
        stats.q2Distribution[r.q2]++;
        
        // Q3 - Frequency
        stats.q3Distribution[r.q3]++;
        
        // Q4 - Important aspects (multiple choice)
        r.q4.forEach(aspect => {
            stats.q4Distribution[aspect]++;
        });
        
        // Q6 - Age
        stats.q6Distribution[r.q6]++;
        
        // Q5 - Comments
        if (r.q5 && r.q5.trim()) {
            stats.comments.push(r.q5);
        }
    });
    
    stats.avgRating = (totalRating / responses.length).toFixed(1);
    
    return stats;
}

// Render results page
if (window.location.pathname.endsWith('results.html')) {
    const stats = calculateStats();
    
    if (!stats) {
        document.body.innerHTML = `
            <div class="container">
                <div class="results-card">
                    <div class="results-header">
                        <h1>📊 Brak danych</h1>
                        <p class="subtitle">Nie ma jeszcze żadnych odpowiedzi w ankiecie.</p>
                    </div>
                    <a href="index.html" class="back-btn">← Wróć do ankiety</a>
                </div>
            </div>
        `;
        return;
    }
    
    renderResults(stats);
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