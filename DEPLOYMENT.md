# Vercel Deployment Guide - ENNUSTUS

## 📋 Ennen julkaisua

### 1. Backend - Render/Railway/Heroku
Backend ei voi toimia suoraan Vercelissä maksutta. Valitse yksi näistä:

#### Vaihtoehto A: Render.com (Suositeltu)
1. Mene [render.com](https://render.com)
2. Rekisteröidy/kirjaudu
3. Uusi Web Service
4. Liitä GitHub-repo
5. Konfiguroi:
   - **Name**: ennustus-backend
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `OPENAI_API_KEY`: [Your OpenAI API Key]
     - `FRONTEND_URL`: [Your Vercel Frontend URL]
     - `NODE_ENV`: production
6. Deploy

#### Vaihtoehto B: Railway.app
1. Mene [railway.app](https://railway.app)
2. Rekisteröidy GitHub:illa
3. Uusi projekti → GitHub repo
4. Konfiguroi main.yml
5. Lisää Environment Variables (sama kuin Render)

#### Vaihtoehto C: Heroku (edullinen)
1. Mene [heroku.com](https://heroku.com)
2. Uusi app
3. Liitä GitHub-repo
4. Deploy Branch → Deploy
5. Lisää Config Vars: OPENAI_API_KEY, FRONTEND_URL

### 2. Backend URL
Kun backend on deployattu, kopioi sen URL (esim. `https://ennustus-backend.render.com`)

### 3. Frontend - Vercel Configuration

#### .env.production (Frontend)
```
REACT_APP_API_URL=https://ennustus-backend.render.com
REACT_APP_PAYPAL_CLIENT_ID=[Your PayPal Client ID]
```

#### Backend .env (Backend)
```
OPENAI_API_KEY=[Your OpenAI API Key]
PORT=3001
FRONTEND_URL=https://yourapp.vercel.app
NODE_ENV=production
```

## 🚀 Frontend Deployment - Vercel

### Vaihe 1: Git-repon valmistelu
```bash
cd /Users/vesku/Desktop/Ennustus
git init
git add .
git commit -m "Initial commit: ENNUSTUS AI Forecast Service"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/ennustus.git
git push -u origin main
```

### Vaihe 2: Vercel-konfiguraatio
1. Mene [vercel.com](https://vercel.com)
2. Rekisteröidy/kirjaudu
3. Uusi projekti
4. Valitse GitHub-repo "Ennustus"
5. Konfiguraatiot:
   - **Framework Preset**: Create React App
   - **Build Command**: `cd frontend && npm run build` (Vercel tekee tämän automaattisesti)
   - **Install Command**: `npm install` (molemmissa kansioissa)
   - **Output Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: `https://ennustus-backend.render.com`
     - `REACT_APP_PAYPAL_CLIENT_ID`: `[Your PayPal Client ID]`
6. Klikkaa "Deploy"

### Vaihe 3: Domain Configuration (Valinnainen)
1. Vercel Dashboard → Project Settings → Domains
2. Lisää custom domain tai käytä Vercelin default URL

## ✅ Tarkistuslista ennen julkaisua

- [ ] GitHub-repo luotu ja koodilla päivitetty
- [ ] Backend deployattu (Render/Railway/Heroku)
- [ ] Backend URL kopioitu
- [ ] REACT_APP_API_URL päivitetty frontend/.env.production
- [ ] PayPal Client ID on olemassa ja konfiguoitu
- [ ] OPENAI_API_KEY on kelvollinen
- [ ] FRONTEND_URL asetettu backendille
- [ ] Vercel-projekti luotu
- [ ] Environment variables asetettu Vercelissä
- [ ] Deploy onnistui ja sovellus toimii

## 🔒 Turvallisuus

### Ei koskaan commitoi:
- `.env` -tiedostoja
- API-avaimia
- PayPal Client ID:tä

### Käytä:
- Environment Variables -taulukossa
- `.env.example` -tiedostoja
- `.gitignore` -tiedostossa määriteltyjä poikkeuksia

## 📊 Vercel Dashboard

Kun deployment on valmis:
- **Deployments**: Näet kaikki julkaisut
- **Analytics**: Performance-metriikat
- **Preview Deployments**: Testaa pull requesteja ennen mergea
- **Rollback**: Palaa edelliseen versioon painikkeella

## 🐛 Troubleshooting

### "CORS Error"
→ Varmista että FRONTEND_URL on oikea backendissa

### "PayPal Error"
→ Tarkista PayPal Client ID Vercel Environment Variables

### "Forecast not generating"
→ Tarkista OPENAI_API_KEY ja API quota

### "Cannot GET /"
→ Varmista build command on oikein frontend-kansiossa

## 📞 Tuki

- OpenAI API Docs: https://platform.openai.com/docs
- Vercel Docs: https://vercel.com/docs
- PayPal Docs: https://developer.paypal.com
