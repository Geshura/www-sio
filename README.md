# 📊 Ankieta - Skala Irracjonalnego Odwlekania

Interaktywna aplikacja webowa mierząca tendencję do prokrastynacji wg **Skali Irracjonalnego Odwlekania** (P. Steel, 2010).

## 🚀 Szybki Start

### Online
Otwórz ankietę online: **[ankieta.html](ankieta.html)**

### Instalacja Lokalna
1. Sklonuj repozytorium:
```bash
git clone https://github.com/[username]/www-sio.git
cd www-sio
```

2. Otwórz `ankieta.html` w przeglądarce (lub użyj live server)

## 📝 O Ankiecie

### 9 Pytań
Ankieta składa się z 9 stwierdzeń ocenianych na skali Likerta (1-5):
- 1 = Zdecydowanie się nie zgadzam
- 2 = Się nie zgadzam
- 3 = Neutralnie
- 4 = Się zgadzam
- 5 = Zdecydowanie się zgadzam

### 5 Kategorii Wyniku

| Wynik | Kategoria | Interpretacja |
|-------|-----------|---------------|
| 9-19 | 🎯 Dolne 10% | Mistrzowskie zarządzanie czasem |
| 20-23 | ✅ Dolne 10-25% | Bardzo dobra samodyscyplina |
| 24-31 | ⚖️ Środkowe 50% | Przeciętny prokrastynator |
| 32-36 | ⚠️ Górne 10-25% | Wyraźna tendencja |
| 37-45 | 🚨 Górne 10% | Chroniczna prokrastynacja |

## ✨ Cechy

✅ **9 pytań** - Kompletna skala P. Steel
✅ **Progress bar** - Wizualna informacja o postępie
✅ **Pytania modalne** - Jedno pytanie na ekran
✅ **Nawigacja** - Przycisk Wróć i auto-przejście
✅ **Responsywny** - Działa na mobile, tablet, desktop
✅ **Ciemny motyw** - Toggle light/dark mode
✅ **LocalStorage** - Zapisywanie wyników
✅ **Export** - Pobieranie wyniku do pliku txt
✅ **Historia** - Ostatnie 5 ankiet
✅ **Dostępność** - Duża czcionka, wysoki kontrast

## 🛠 Technologia

- **HTML5** - Semantyczny markup
- **CSS3** - Grid, Flexbox, Custom Properties, Animacje
- **JavaScript ES6+** - Vanilla JS, bez bibliotek
- **LocalStorage API** - Przechowywanie danych
- **GitHub Actions** - Automatyczne deployment

## 📁 Struktura Plików

```
www-sio/
├── ankieta.html          # Główna strona ankiety
├── ankieta.css           # Style (500+ linii)
├── ankieta.js            # Logika (400+ linii)
├── index.html            # Strona główna (opcjonalna)
├── README.md             # Ta dokumentacja
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
└── .git/                 # Git repository
```

## 🎯 Funkcjonalność

### Ekran Startowy
- Nazwa ankiety i autor
- Instrukcja (skala 1-5)
- Opis czasowy (3-5 minut)
- Przycisk "Rozpocznij"

### Ekran Pytań
- Progress bar (1/9, 2/9, itd.)
- Duże, czytelne pytanie
- 5 opcji skali (radio buttons)
- Nawigacja (Wróć/Dalej)
- Auto-przejście po wyborze ostatniego pytania

### Ekran Wyników
- Duża liczba wyniku
- Interpretacja wyników
- Wszystkie 5 kategorii z kolorami
- Historia ostatnich 5 ankiet
- Przyciski: Ponownie, Pobierz wynik

## 💾 Dane

### LocalStorage
- **surveyResults** - Tablica wyników (score, answers, timestamp)
- **darkMode** - Ustawienie motywu (boolean)

### Struktura Wyniku
```javascript
{
  score: 27,
  answers: [3, 4, 2, 5, 1, 4, 3, 2, 4],
  timestamp: "2024-01-28T10:30:00.000Z"
}
```

## 🔧 Konfiguracja

### Zmiana pytań
Edytuj `QUESTIONS` w `ankieta.js`:
```javascript
const QUESTIONS = [
    { text: "Twoje pytanie", reversed: false },
    // ...
];
```

### Zmiana progów
Edytuj `THRESHOLDS` w `ankieta.js`:
```javascript
const THRESHOLDS = [
    { min: 9, max: 19, label: "Etykieta", color: "#16a34a" },
    // ...
];
```

### Zmiana kolorów
Edytuj CSS variables w `ankieta.css`:
```css
:root {
    --primary: #0284c7;      /* Niebieski główny */
    --success: #16a34a;      /* Zielony */
    --warning: #f59e0b;      /* Pomarańczowy */
    --error: #ef4444;        /* Czerwony */
}
```

## 📱 Responsywność

Breakpointy:
- **Desktop**: 768px+ (domyślnie)
- **Tablet**: 481px - 767px
- **Mobile**: 480px i mniej

## 🔐 Prywatność

- Wszystkie dane przechowywane lokalnie (browser)
- Brak wysyłania danych na serwer
- Brak cookies (oprócz ustawień motywu)
- Pełna kontrola nad własnymi danymi

## 🚀 Deployment

### GitHub Pages
1. Upewnij się że repozytorium jest publiczne
2. Idź do **Settings → Pages**
3. Ustaw Branch na `main` i folder na `/ (root)`
4. Workflow GitHub Actions automatycznie deployuje

### Dostęp
```
https://[username].github.io/www-sio/ankieta.html
```

## 📊 Obliczanie Wyniku

### Pytania Odwrócone (Reversed)
Dla pytań odwróconych (2, 5, 8) punkty są przeliczane:
```
Punkty = 6 - odpowiedź
```

**Przykład:**
- Zwykłe pytanie: odpowiedź 4 = 4 punkty
- Odwrócone pytanie: odpowiedź 4 = 6 - 4 = 2 punkty

### Całkowity Wynik
Suma wszystkich 9 odpowiedzi (po przeliczeniu): **9-45 punktów**

## 🐛 Troubleshooting

### Ankieta się nie wyświetla
- Upewnij się że JavaScript jest włączony
- Sprawdź konsolę przeglądarki (F12)
- Wyczyść cache (Ctrl+Shift+Delete)

### Wyniki nie zapisują się
- Sprawdź czy LocalStorage jest włączony
- Może być zablokowany w incognito mode
- Spróbuj innej przeglądarki

### Ciemny motyw się nie zmienia
- Odśwież stronę po włączeniu motywu
- Sprawdź localStorage w DevTools

## 📝 Licencja

Skala Irracjonalnego Odwlekania © P. Steel (2010)
Aplikacja webowa - MIT License

## 👤 Autor

Zbudowano jako interaktywna ankieta online.

## 🤝 Wspólpraca

Jeśli znalazłeś błąd lub masz pomysł na usprawnienie, utwórz Issue lub Pull Request!

---

**Ostatnia aktualizacja:** 28 stycznia 2024
