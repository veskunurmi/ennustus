# Vercel-julkaisu - Tarkistuslista

## Vaihe 1: Valmistelu
- [ ] Git-repon lokaali setup valmis
- [ ] `.gitignore` on konfiguroitu oikein
- [ ] Kaikki sensitive tiedostot on jätetty pois
- [ ] `DEPLOYMENT.md` on luettu ja ymmärretty

## Vaihe 2: Backend (Render.com suositeltu)
- [ ] Render-tili luotu
- [ ] GitHub-repo linkitetty Renderiin
- [ ] Build- ja Start-komennot konfiguroitu
- [ ] Environment variables asetettu:
  - [ ] `OPENAI_API_KEY`
  - [ ] `FRONTEND_URL` (Vercel-osoite)
  - [ ] `NODE_ENV=production`
- [ ] Deploy onnistui
- [ ] Backend URL kopioitu (esim. `https://ennustus-backend.render.com`)

## Vaihe 3: Frontend Environment Variables
- [ ] `frontend/.env.production` päivitetty:
  - [ ] `REACT_APP_API_URL=https://ennustus-backend.render.com`
  - [ ] `REACT_APP_PAYPAL_CLIENT_ID` asetettu
- [ ] Vercel-tiedostot konfiguroitu:
  - [ ] `vercel.json` löytyy
  - [ ] Build command on oikein

## Vaihe 4: Vercel-deployment
- [ ] Vercel-tili luotu
- [ ] GitHub-repo linkitetty Verceliin
- [ ] Konfiguraatiot asetettu:
  - [ ] **Framework**: Create React App
  - [ ] **Root Directory**: `./frontend` (jos kysytään)
  - [ ] **Build Command**: `npm run build`
  - [ ] **Output Directory**: `build`
- [ ] Environment variables Vercelissä:
  - [ ] `REACT_APP_API_URL`
  - [ ] `REACT_APP_PAYPAL_CLIENT_ID`
- [ ] Deploy käynnistetty

## Vaihe 5: Post-Deployment Testing
- [ ] Frontend ladataan oikein Vercel-osoitteesta
- [ ] Kielivalinta toimii (Suomi/English)
- [ ] Lomake näkyy oikein
- [ ] Validointi toimii
- [ ] PayPal-integraatio näkyvissä
- [ ] PayPal-maksu toimii
- [ ] Ennustus generoidaan oikean kielen mukaan
- [ ] Ennustus näkyy oikein
- [ ] Share-nappulat toimivat
- [ ] Mobile-näkymä toimii

## Vaihe 6: DNS/Custom Domain (Valinnainen)
- [ ] Custom domain ostettu
- [ ] DNS-asetukset konfiguroitu Verceliin
- [ ] SSL-sertifikaatti on automaattisesti aktiivinen

## Vaihe 7: Monitoring & Maintenance
- [ ] Vercel Analytics käytössä
- [ ] Error-notifikaatiot konfiguroitu
- [ ] Regular backups planneerattu
- [ ] OpenAI API quota tarkistettu
- [ ] PayPal account tarkistettu

## Häiriönhallinta

### Jos Frontend ei lataudu
- Tarkista Vercel deployment log
- Tarkista build command
- Tarkista environment variables

### Jos PayPal näkyy mustana
- Tarkista browser console
- Tarkista `REACT_APP_PAYPAL_CLIENT_ID`
- Tarkista PayPal sandbox vs production

### Jos ennustus ei generoidu
- Tarkista backend-loggit Renderissä
- Tarkista `REACT_APP_API_URL`
- Tarkista `OPENAI_API_KEY`
- Tarkista CORS-asetukset

### Jos kielivalinta ei toimi
- Tarkista browser console
- Varmista että language-state päivittyy
- Varmista että API saa language-parametrin

## Tukipalvelut
- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/docs
- OpenAI Support: https://help.openai.com
- PayPal Support: https://developer.paypal.com/support
