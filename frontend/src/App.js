import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './App.css';

const translations = {
  fi: {
    title: 'Osta Ennustus',
    intro: 'Hyödynnämme AI-teknologiaa tulkitsemaan syntymäaikasi symboliikkaa. Algoritmi generoi katsauksen työhösi, ihmissuhteisiisi ja energiaasi.',
    name: 'Nimi',
    namePlaceholder: 'Nimesi',
    nameRequired: 'Nimi vaaditaan',
    birthMonth: 'Syntymäkuukausi',
    birthYear: 'Syntymävuosi',
    birthYearPlaceholder: 'Esim. 1990',
    birthYearError: 'Vuosi tulee olla 1900 ja {year} välillä',
    gender: 'Sukupuoli',
    genderFemale: 'Nainen',
    genderMale: 'Mies',
    genderOther: 'Muu',
    genderPreferNotSay: 'En halua kertoa',
    priceDescription: 'Syötä nimesi, syntymäkuukautesi ja syntymävuotesi. Saat kattavan ennustuksen hintaan',
    price: '0.99€',
    errorPayment: 'Maksun käsittely epäonnistui. Yritä uudelleen.',
    errorNameEmpty: 'Anna nimesi',
    errorYearInvalid: 'Anna kelvollinen syntymävuosi',
    loading: 'Ennustus määritellään',
    shareWhatsApp: 'Jaa WhatsAppissa',
    copyText: 'Kopioi teksti',
    copySuccess: 'Ennustus kopioitu leikepöydälle!',
    buyNew: 'Osta uusi ennustus',
    errorFetch: 'Virhe haettaessa ennustusta.',
    errorServer: 'Palvelinvirhe: ',
    errorTimeout: 'Pyyntö aikakatkaistiin. Yritä uudelleen.',
    shareMessage: 'Sain juuri mielenkiintoisen tulkinnan tähdiltä: \n\n"{text}..." \n\nHae oma ennustuksesi täältä: {url}'
  },
  en: {
    title: 'Fortune-teller',
    intro: 'We use AI technology to interpret the symbolism of your birth time. Our algorithm generates insights into your work, relationships and energy.',
    name: 'Name',
    namePlaceholder: 'Your name',
    nameRequired: 'Name is required',
    birthMonth: 'Birth Month',
    birthYear: 'Birth Year',
    birthYearPlaceholder: 'E.g. 1990',
    birthYearError: 'Year must be between 1900 and {year}',
    gender: 'Gender',
    genderFemale: 'Female',
    genderMale: 'Male',
    genderOther: 'Other',
    genderPreferNotSay: 'Prefer not to say',
    priceDescription: 'Enter your name, birth month and birth year. Get a comprehensive reading for only',
    price: '0.99€',
    errorPayment: 'Payment processing failed. Please try again.',
    errorNameEmpty: 'Please enter your name',
    errorYearInvalid: 'Please enter a valid birth year',
    loading: 'Generating forecast',
    shareWhatsApp: 'Share on WhatsApp',
    copyText: 'Copy text',
    copySuccess: 'Forecast copied to clipboard!',
    buyNew: 'Buy new forecast',
    errorFetch: 'Error fetching forecast.',
    errorServer: 'Server error: ',
    errorTimeout: 'Request timed out. Please try again.',
    shareMessage: 'I just received an interesting interpretation from the stars: \n\n"{text}..." \n\nGet your own reading here: {url}'
  }
};

const months = {
  fi: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
       'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
  en: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December']
};

function App() {
  const [language, setLanguage] = useState('fi');
  const t = translations[language];
  
const [formData, setFormData] = useState({
  name: '',
  birthMonth: months['fi'][0],
  birthYear: new Date().getFullYear() - 30,
  gender: translations['fi'].genderFemale,
  luckyNumber: Math.floor(Math.random() * 100) + 1
});
  const [ennustus, setEnnustus] = useState("");
  const [lataa, setLataa] = useState(false);
  const [virhe, setVirhe] = useState("");
  const [generoidaan, setGeneroidaan] = useState(false);

// Päivitä kuukausi ja sukupuoli kun kieli vaihtuu
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      birthMonth: months[language][0],
      gender: translations[language].genderFemale
    }));
  }, [language]);

// Funktio tekstin kopioimiseen
const kopioiTeksti = () => {
  navigator.clipboard.writeText(ennustus);
  alert(t.copySuccess);
};

// Funktio WhatsApp-jakoon
const jaaWhatsApp = () => {
  const teksti = encodeURIComponent(t.shareMessage
    .replace('{text}', ennustus.substring(0, 100))
    .replace('{url}', window.location.href));
  window.open(`https://wa.me/?text=${teksti}`, '_blank');
};

  // Tarkistetaan löytyykö vanha ennustus selaimen muistista ja onko se vielä valid
  useEffect(() => {
    const tallennettuData = localStorage.getItem('minunEnnustus');
    if (tallennettuData) {
      try {
        const parsed = JSON.parse(tallennettuData);
        const now = new Date().getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 päivää millisekunteissa
        
        if (parsed.timestamp && (now - parsed.timestamp) < maxAge) {
          setEnnustus(parsed.ennustus);
        } else {
          localStorage.removeItem('minunEnnustus');
        }
      } catch (e) {
        localStorage.removeItem('minunEnnustus');
      }
    }
  }, []);

  const haeEnnustus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const vastaus = await fetch(`${apiUrl}/api/ennustus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
        timeout: 30000
      });
      
      if (!vastaus.ok) {
        const errorData = await vastaus.json();
        throw new Error(errorData.error || `HTTP ${vastaus.status}`);
      }
      
      const data = await vastaus.json();
      
      // Tallennetaan muistiin timestamp-ohjelmalla
      const cacheData = {
        ennustus: data.ennustus,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('minunEnnustus', JSON.stringify(cacheData));
      setEnnustus(data.ennustus);
      setGeneroidaan(false);
    } catch (e) {
      console.error("Virhe:", e);
      let viesti = t.errorFetch;
      if (e.message.includes('HTTP')) {
        viesti = `${t.errorServer}${e.message}`;
      } else if (e.message.includes('timeout')) {
        viesti = t.errorTimeout;
      }
      alert(viesti);
      setGeneroidaan(false);
    }
    setLataa(false);
  };

  const nollaaEnnustus = () => {
    localStorage.removeItem('minunEnnustus');
    setEnnustus("");
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, currency: "EUR" }}>
      <div className="App">
        <div className="star-background"></div>
        <header className="App-header">
          {!ennustus ? (
            generoidaan ? (
              <div className="card loading-card animate-fade-in">
                <div className="spinner"></div>
                <p className="loading-text">{t.loading}</p>
              </div>
            ) : (
              <div className="card">
                <div className="language-selector">
                  <button 
                    className={`lang-btn ${language === 'fi' ? 'active' : ''}`}
                    onClick={() => setLanguage('fi')}
                  >
                    Suomi
                  </button>
                  <button 
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </button>
                </div>
                <h1 className="title">{t.title}</h1>
                <p className="intro-text">{t.intro}</p>
                
                <div className="lomake">
                  <label>{t.name}</label>
                  <input 
                    type="text" 
                    placeholder={t.namePlaceholder} 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required
                  />
                  {formData.name.length === 0 && <span className="error-text">{t.nameRequired}</span>}

                  <label>{t.birthMonth}</label>
                  <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})}>
                    {months[language].map(month => <option key={month}>{month}</option>)}
                  </select>

                  <label>{t.birthYear}</label>
                  <input 
                    type="number" 
                    placeholder={t.birthYearPlaceholder} 
                    value={formData.birthYear}
                    min="1900"
                    max={new Date().getFullYear()}
                    onChange={e => setFormData({...formData, birthYear: parseInt(e.target.value)})} 
                    required
                  />
                  {(formData.birthYear < 1900 || formData.birthYear > new Date().getFullYear()) && 
                    <span className="error-text">{t.birthYearError.replace('{year}', new Date().getFullYear())}</span>
                  }

                  <label>{t.gender}</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>{t.genderFemale}</option>
                    <option>{t.genderMale}</option>
                    <option>{t.genderOther}</option>
                    <option>{t.genderPreferNotSay}</option>
                  </select>
                </div>

                <div className="price-label">{t.priceDescription}</div>
                <div className="price-tag">{t.price}</div>
                
                {virhe && <div className="error-message">{virhe}</div>}
                
                <div className="paypal-button-container">
                  <PayPalButtons 
                    style={{ layout: "vertical", shape: "pill", color: "gold" }}
                    createOrder={(data, actions) => {
                      setVirhe("");
                      
                      // Validointi
                      if (!formData.name.trim()) {
                        setVirhe(t.errorNameEmpty);
                        return Promise.reject(new Error(t.errorNameEmpty));
                      }
                      if (!formData.birthMonth) {
                        setVirhe(t.birthMonth + " " + t.nameRequired);
                        return Promise.reject(new Error(t.birthMonth + " " + t.nameRequired));
                      }
                      if (formData.birthYear < 1900 || formData.birthYear > new Date().getFullYear()) {
                        setVirhe(t.errorYearInvalid);
                        return Promise.reject(new Error(t.errorYearInvalid));
                      }
                      if (!formData.gender) {
                        setVirhe(t.gender + " " + t.nameRequired);
                        return Promise.reject(new Error(t.gender + " " + t.nameRequired));
                      }
                      if (formData.luckyNumber < 1 || formData.luckyNumber > 100) {
                        setVirhe("Onnennumero on oltava 1-100");
                        return Promise.reject(new Error("Onnennumero on oltava 1-100"));
                      }
                      
                      return actions.order.create({
                        purchase_units: [{ amount: { value: "0.99" } }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      await actions.order.capture();
                      setGeneroidaan(true);
                      haeEnnustus();
                    }}
                    onError={() => {
                      setVirhe(t.errorPayment);
                    }}
                    onCancel={() => {
                      setVirhe("");
                    }}
                  />
                </div>
              </div>
            )
          ) : (
       <div className="card tulos-kortti animate-fade-in">

  {lataa ? (
    <div className="loading">✨ Kanavoidaan kosmisia voimia... ✨</div>
  ) : (
    <>
      <p className="ennustus-teksti" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {ennustus}
      </p>
      
      <div className="nappi-ryhma">
        <button className="share-btn wa" onClick={jaaWhatsApp}>
          {t.shareWhatsApp}
        </button>
        <button className="share-btn copy" onClick={kopioiTeksti}>
          {t.copyText}
        </button>
      </div>

      <button className="reset-btn" onClick={nollaaEnnustus}>
        {t.buyNew}
      </button>
    </>
  )}
</div>
          )}
        </header>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;