# 🗄️ Opcje Backend dla Zapisywania Ankiet

GitHub Pages **nie obsługuje** backend - to tylko statyczny hosting.

## ✅ Najprostsze Rozwiązania

### 1. **Google Forms** (Najprostsze)
- Całkowicie darmowe
- Gotowy formularz + automatyczna analiza danych
- Export do Excel/Sheets
- Nie wymaga programowania

### 2. **Firebase (Google)**
```javascript
// Dodaj do HTML:
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "TWOJ_PROJECT.firebaseapp.com",
  projectId: "TWOJ_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Zapisz odpowiedź
await addDoc(collection(db, "responses"), {
  score: totalScore,
  answers: answers,
  timestamp: new Date()
});
```
**Zalety:** Darmowy plan (50k odczytów/dzień), łatwa konfiguracja
**Link:** https://firebase.google.com

### 3. **Supabase** (Alternatywa dla Firebase)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://TWOJ_PROJECT.supabase.co',
  'TWOJ_ANON_KEY'
)

// Zapisz odpowiedź
const { data, error } = await supabase
  .from('responses')
  .insert([{ score: totalScore, answers: answers }])
```
**Zalety:** Darmowy plan, PostgreSQL, łatwy dashboard
**Link:** https://supabase.com

### 4. **Google Sheets via Apps Script**
Wyślij dane bezpośrednio do Google Sheets:
```javascript
async function saveToSheets(data) {
  const url = 'https://script.google.com/macros/s/TWOJ_WEB_APP_ID/exec';
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```
**Zalety:** Darmowe, proste, dane w Sheets
**Wady:** Wolniejsze, limity requestów

### 5. **Netlify Forms** (jeśli hostujesz na Netlify)
Dodaj do formularza:
```html
<form name="procrastination" method="POST" data-netlify="true">
  <!-- Twoje pola -->
</form>
```
**Zalety:** Zero kodu, automatyczny spam filter
**Link:** https://www.netlify.com

### 6. **Airtable**
API do zapisu danych w chmurze:
```javascript
const airtableUrl = 'https://api.airtable.com/v0/TWOJA_BAZA/responses';
fetch(airtableUrl, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer TWOJ_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ fields: data })
});
```
**Zalety:** Darmowy plan (1200 rekordów), ładny interface
**Link:** https://airtable.com

## 🔧 Własny Backend (Zaawansowane)

### Node.js + Express + MongoDB
```bash
# Backend (deploy na Vercel/Railway/Heroku)
npm install express mongodb cors
```

```javascript
// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.post('/api/responses', async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db('survey');
  await db.collection('responses').insertOne(req.body);
  res.json({ success: true });
});

app.listen(3000);
```

## 📊 Porównanie

| Rozwiązanie | Trudność | Koszt | Czas setup | Limit |
|------------|---------|-------|------------|-------|
| Google Forms | ⭐ | 💰 Free | 5 min | Unlimited |
| Firebase | ⭐⭐ | 💰 Free | 30 min | 50k/dzień |
| Supabase | ⭐⭐ | 💰 Free | 30 min | 500MB DB |
| Google Sheets | ⭐⭐ | 💰 Free | 1h | ~1000 req/dzień |
| Własny Backend | ⭐⭐⭐⭐ | 💰💰 Varies | 4h+ | Depends |

## 🎯 Rekomendacja

**Dla prostej ankiety:** Google Forms
**Dla niestandardowego UI:** Firebase lub Supabase
**Jeśli chcesz pełną kontrolę:** Własny backend

---

**Aktualna wersja (GitHub Pages):** Dane zapisują się tylko lokalnie w localStorage przeglądarki użytkownika.
