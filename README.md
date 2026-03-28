# 🩺 ASHA — AI Health Voice Assistant

Helps rural patients understand prescriptions in 13 Indian languages.
Built with React + Flask + Gemini AI. 100% FREE to deploy.

---

## 📁 Folder Structure
```
asha-project/
├── asha-backend/       ← Flask API (deploy on Render)
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   └── render.yaml
└── asha-frontend/      ← React App (deploy on Vercel)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        └── App.js
```

---

## 🚀 STEP 1 — Run Locally

### Backend
```bash
cd asha-backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py
# → Running on http://localhost:5000
```

### Frontend
```bash
cd asha-frontend
npm install
npm start
# → Running on http://localhost:3000
```

Open app → click ⚙️ Settings → paste your Gemini API key → Save ✅

---

## 🌐 STEP 2 — Deploy Backend on Render (FREE)

1. Go to https://render.com → Sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repo → select `asha-backend` folder
4. Settings:
   - Name: `asha-backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Click "Create Web Service"
6. Wait 2-3 min → you get a URL like: `https://asha-backend.onrender.com`
7. Copy this URL

---

## 🌐 STEP 3 — Deploy Frontend on Vercel (FREE)

1. Go to https://vercel.com → Sign up with GitHub
2. Click "New Project" → import your repo → select `asha-frontend` folder
3. Click Deploy
4. Wait 1 min → you get URL like: `https://asha.vercel.app`

---

## 🔑 STEP 4 — Get FREE Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Open your deployed app → ⚙️ Settings → paste key → Save

---

## ✅ Done!
Your app is live at `https://asha.vercel.app` — share this link with anyone!

---

## 📊 Free Tier Limits
| Service | Free Limit |
|---------|-----------|
| Gemini API | 15 req/min, 1M tokens/day |
| Render | 750 hours/month (sleeps after 15min idle) |
| Vercel | Unlimited |

**Total cost: ₹0** 🎉
