/* ============================================================
   Milestone Financial — Multi-Language Support (EN / GU / HI)
   English (Default), Gujarati (ગુજરાતી), Hindi (हिन्दी)
   Warm, Relatable, Native Copywriting Engine
   ============================================================ */

(function () {
  const SUPPORTED_LANGS = {
    en: { name: 'English', native: 'English', flag: '🇬🇧' },
    gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' }
  };

  // Curated, warm, relatable financial terminology in Gujarati & Hindi
  const NATURAL_GLOSSARY = {
    gu: [
      // Navigation & Header CTAs
      ['Book Consultation', 'મફત સલાહ બુક કરો'],
      ['Book Free Consultation', 'મફત પરામર્શ બુક કરો'],
      ['Get Free Portfolio Audit', 'પોર્ટફોલિયો ઓડિટ કરાવો →'],
      ['Goal Planner', 'ધ્યેય પ્લાનર (Goal Planner)'],
      ['Lump Sum', 'એકસાથે રોકાણ (Lump Sum)'],
      ['SIP Calculator', 'SIP કેલ્ક્યુલેટર'],
      ['SWP Calculator', 'SWP પેન્શન કેલ્ક્યુલેટર'],
      ['Home', 'મુખ્ય પૃષ્ઠ'],
      ['About', 'મારા વિશે'],
      ['Services', 'સેવાઓ'],
      ['Contact', 'સંપર્ક કરો'],

      // Hero Section
      ['Grow Your Wealth with Smart Mutual Fund Investments', 'સ્માર્ટ મ્યુચ્યુઅલ ફંડ વડે તમારા પરિવારની સંપત્તિ સુરક્ષિત રીતે વધારો'],
      ['I help families and professionals plan their financial future — with the right mutual funds, disciplined SIPs and a long-term strategy built around your goals.', 'હું અમદાવાદના પરિવારો અને વ્યાવસાયિકોને સાચા મ્યુચ્યુઅલ ફંડ, શિસ્તબદ્ધ SIP અને તમારા જીવનના લક્ષ્યો મુજબ લાંબાગાળાનું નાણાકીય આયોજન કરવામાં મદદ કરું છું.'],
      ['AMFI-Registered Mutual Fund Distributor', 'AMFI-રજિસ્ટર્ડ માન્ય મ્યુચ્યુઅલ ફંડ વિતરક'],
      ['SEBI-Registered AMFI', 'AMFI રજિસ્ટર્ડ & સેબી માન્ય'],
      ['12+ Years Experience', '12+ વર્ષનો વિશ્વાસુ અનુભવ'],
      ['Goal-Based Planning', 'લક્ષ્ય આધારિત સાચું આયોજન'],

      // Unique Wealth Showdown Section
      ['The Silent Wealth Erosion in India', 'ભારતમાં બચત પર મોંઘવારીનો છૂપો માર'],
      ['The Silent Wealth Erosion', 'બચત પર મોંઘવારીનો છૂપો માર'],
      ['Are Your Life Savings Silently Losing Value in Bank Deposits?', 'શું તમારી જીવનભરની બચત બેંક એફડીમાં ધીમે-ધીમે ઘટી રહી છે?'],
      ['In Gujarat, conservative investors leave their wealth in traditional bank FDs & RDs believing it is safe. After 30% income tax and 7% lifestyle inflation, you are actually losing real purchasing power every year.', 'ગુજરાતમાં ઘણા પરિવારો પોતાની પરસેવાની કમાણી બેંક FD અને RD માં સુરક્ષિત માનીને રાખી મૂકે છે. પરંતુ 7% મોંઘવારી અને 30% આવકવેરા પછી, તમારા નાણાંની ખરીદશક્તિ દર વર્ષે ઘટે છે.'],
      ['Wealth Accumulation: Bank RD vs. SIP', 'સંપત્તિ સર્જન: બેંક આરડી (RD) સામે મ્યુચ્યુઅલ ફંડ SIP'],
      ['Monthly Pension: Bank FD vs. SWP', 'નિયમિત માસિક પેન્શન: બેંક એફડી (FD) સામે SWP'],
      ['Traditional Bank Recurring Deposit', 'પરંપરાગત બેંક રિકરિંગ ડિપોઝિટ (RD)'],
      ['Traditional Bank Recurring Deposit (RD)', 'પરંપરાગત બેંક રિકરિંગ ડિપોઝિટ (RD)'],
      ['Disciplined Mutual Fund SIP', 'શિસ્તબદ્ધ મ્યુચ્યુઅલ ફંડ SIP'],
      ['Systematic Investment Plan (SIP)', 'સિસ્ટમેટિક ઇન્વેસ્ટમેન્ટ પ્લાન (SIP)'],
      ['The Reality Gap', 'વાસ્તવિક નફાનો તફાવત'],
      ['+₹36.6 L EXTRA', '+₹36.6 લાખ વધુ નફો'],
      ['2.2x More Wealth', '2.2 ગણી વધુ સંપત્તિ'],
      ['Key Wealth Factors', 'મહત્વના નાણાકીય મુદ્દા'],
      ['Long-Term Wealth Generation', 'લાંબાગાળે મૂડી સર્જન'],
      ['Maturity Taxation & TDS', 'ટેક્સ અને ટીડીએસ (TDS) બચત'],
      ['Modest 6.0%–6.8% Yield', 'માત્ર 6.0% થી 6.8% સાધારણ વ્યાજ'],
      ['12%–15% Historical CAGR', '12% થી 15% ઐતિહાસિક ચક્રવૃદ્ધિ વળતર'],
      ['WINNER', 'શ્રેષ્ઠ પસંદગી'],

      // Advisor Quote
      ['In my 12+ years as a mutual fund distributor in Ahmedabad, the biggest tragedy I see is hardworking families leaving 100% of their life savings in bank deposits, believing it is safe, while inflation quietly steals half their wealth. Let me help you protect what is yours.', 'અમદાવાદમાં છેલ્લા 12+ વર્ષના અનુભવમાં હું જોઉં છું કે મહેનતુ પરિવારો પોતાની જીવનભરની બચત બેંક ડિપોઝિટમાં સુરક્ષિત માનીને રાખે છે, જ્યારે મોંઘવારી ધીમે ધીમે તેમની ખરીદશક્તિ ચોરી લે છે. ચાલો તમારા નાણાંનું સાચું મૂલ્ય વધારવા સાથે મળીને યોગ્ય આયોજન કરીએ.'],
      ['— Mr. Chetankumar Patel (AMFI-Registered Financial Distributor • ARN-333553 • Vastrapur, Ahmedabad)', '— શ્રી ચેતનકુમાર પટેલ (AMFI રજિસ્ટર્ડ નાણાકીય વિતરક • ARN-333553 • વસ્ત્રાપુર, અમદાવાદ)'],

      // Fund Strip
      ['Trusted across leading fund houses', 'ભારતના અગ્રણી ફંડ ગૃહો સાથે વિશ્વસનીય જોડાણ'],
      ['25+ AMC Partners Across India', '25+ અગ્રણી મ્યુચ્યુઅલ ફંડ પાર્ટનર્સ'],
      ['Direct access to top-performing schemes from India\'s best fund houses', 'ભારતની ટોચની મ્યુચ્યુઅલ ફંડ સ્કીમ્સમાં પારદર્શક રોકાણની સીધી સુવિધા'],
      ['AMFI Registered', 'AMFI રજિસ્ટર્ડ'],
      ['SEBI Compliant', 'સેબી (SEBI) નિયમ માન્ય'],
      ['100% Secure', '100% સુરક્ષિત અને પારદર્શક'],

      // Calculator Report & Summary Tables
      ['SWP Report', 'SWP રિપોર્ટ'],
      ['SWP Summary', 'SWP સારાંશ'],
      ['SIP Report', 'SIP રિપોર્ટ'],
      ['SIP Summary', 'SIP સારાંશ'],
      ['Lump Sum Report', 'એકસાથે રોકાણ રિપોર્ટ'],
      ['Lump Sum Summary', 'એકસાથે રોકાણ સારાંશ'],
      ['Lumpsum Investment Amount', 'એકસાથે રોકાણ ની રકમ'],
      ['SWP Withdrawal Amount', 'SWP ઉપાડ ની રકમ'],
      ['Monthly Investment Amount', 'માસિક રોકાણ ની રકમ'],
      ['Investment Frequency', 'રોકાણ ની આવર્તન'],
      ['Investment Mode', 'રોકાણ ની પદ્ધતિ'],
      ['Time Period (In Year)', 'સમયગાળો (વર્ષમાં)'],
      ['Expected Return Rate (P.A)', 'અપેક્ષિત વળતર દર (વાર્ષિક)'],
      ['Total Investment', 'કુલ રોકાણ'],
      ['Total Withdrawal', 'કુલ ઉપાડ'],
      ['Total Growth', 'કુલ વૃદ્ધિ'],
      ['Total Growth (Wealth Gain)', 'કુલ વૃદ્ધિ (સંપત્તિ લાભ)'],
      ['Total Growth (Profit)', 'કુલ વૃદ્ધિ (નફો)'],
      ['Current Value', 'હાલની કિંમત'],
      ['Expected Maturity Value', 'અપેક્ષિત પરિપક્વતા રકમ'],
      ['Final Maturity Value', 'અંતિમ પરિપક્વતા રકમ'],
      ['Wealth Multiplier', 'સંપત્તિ ગુણાંક'],
      ['Ended In', 'સમાપ્ત થયું'],
      ['Completed In', 'પૂર્ણ થયું'],
      ['Monthly', 'માસિક'],
      ['One-Time Lump Sum', 'એકવાર નું રોકાણ'],
      ['Download Official PDF Report', 'સત્તાવાર PDF રિપોર્ટ ડાઉનલોડ કરો'],
      ['Download PDF Report', 'PDF રિપોર્ટ ડાઉનલોડ કરો'],
      ['Print', 'પ્રિન્ટ કરો'],
      ['Print Report', 'રિપોર્ટ પ્રિન્ટ કરો'],
      ['Goal Planning Parameters Report', 'ધ્યેય આયોજન પરિમાણો રિપોર્ટ'],
      ['Goal Investment Roadmap Summary', 'ધ્યેય રોકાણ રોડમેપ સારાંશ'],
      ['Selected Goal', 'પસંદ કરેલ ધ્યેય'],
      ['Goal Cost (Today)', 'ધ્યેય ખર્ચ (આજના ભાવે)'],
      ['Future Target (With Inflation)', 'ભાવિ લક્ષ્ય (મોંઘવારી સાથે)']
    ],
    hi: [
      // Navigation & Header CTAs
      ['Book Consultation', 'मुफ्त सलाह बुक करें'],
      ['Book Free Consultation', 'फ्री परामर्श बुक करें'],
      ['Get Free Portfolio Audit', 'पोर्टफोलियो ऑडिट कराएं →'],
      ['Goal Planner', 'लक्ष्य प्लानर (Goal Planner)'],
      ['Lump Sum', 'एकमुश्त निवेश (Lump Sum)'],
      ['SIP Calculator', 'SIP कैलकुलेटर'],
      ['SWP Calculator', 'SWP पेंशन कैलकुलेटर'],
      ['Home', 'होम'],
      ['About', 'हमारे बारे में'],
      ['Services', 'सेवाएं'],
      ['Contact', 'संपर्क करें'],

      // Hero Section
      ['Grow Your Wealth with Smart Mutual Fund Investments', 'स्मार्ट म्यूचुअल फंड निवेश के साथ अपने परिवार की संपत्ति सुरक्षित रूप से बढ़ाएं'],
      ['I help families and professionals plan their financial future — with the right mutual funds, disciplined SIPs and a long-term strategy built around your goals.', 'मैं अहमदाबाद के परिवारों और प्रोफेशनल्स को सही म्यूचुअल फंड, अनुशासित SIP और जीवन के लक्ष्यों के अनुसार वित्तीय योजना बनाने में मदद करता हूँ।'],
      ['AMFI-Registered Mutual Fund Distributor', 'AMFI-पंजीकृत अधिकृत म्यूचुअल फंड वितरक'],
      ['SEBI-Registered AMFI', 'AMFI रजिस्टर्ड & SEBI मान्य'],
      ['12+ Years Experience', '12+ वर्षों का विश्वसनीय अनुभव'],
      ['Goal-Based Planning', 'लक्ष्य-आधारित सही योजना'],

      // Unique Wealth Showdown Section
      ['The Silent Wealth Erosion in India', 'भारत में बचत पर महंगाई का गुप्त नुकसान'],
      ['The Silent Wealth Erosion', 'बचत पर महंगाई का गुप्त नुकसान'],
      ['Are Your Life Savings Silently Losing Value in Bank Deposits?', 'क्या आपकी जिंदगी भर की कमाई बैंक में रखे-रखे घट रही है?'],
      ['In Gujarat, conservative investors leave their wealth in traditional bank FDs & RDs believing it is safe. After 30% income tax and 7% lifestyle inflation, you are actually losing real purchasing power every year.', 'पारंपरिक निवेशक अपनी मेहनत की कमाई बैंक FD और RD में सुरक्षित समझकर रखते हैं। लेकिन 7% महंगाई और 30% टैक्स के बाद, आपके पैसे की वास्तविक खरीदने की शक्ति हर साल घटती है।'],
      ['Wealth Accumulation: Bank RD vs. SIP', 'दौलत निर्माण: बैंक आरडी (RD) बनाम म्यूचुअल फंड SIP'],
      ['Monthly Pension: Bank FD vs. SWP', 'मासिक पेंशन: बैंक एफडी (FD) बनाम SWP'],
      ['Traditional Bank Recurring Deposit', 'पारंपरिक बैंक आवर्ती जमा (RD)'],
      ['Traditional Bank Recurring Deposit (RD)', 'पारंपरिक बैंक आरडी (RD)'],
      ['Disciplined Mutual Fund SIP', 'अनुशासित म्यूचुअल फंड SIP'],
      ['Systematic Investment Plan (SIP)', 'सिस्टेमैटिक इन्वेस्टमेंट प्लान (SIP)'],
      ['The Reality Gap', 'मुनाफे का असली अंतर'],
      ['+₹36.6 L EXTRA', '+₹36.6 लाख ज्यादा मुनाफा'],
      ['2.2x More Wealth', '2.2 गुना अधिक संपत्ति'],
      ['Key Wealth Factors', 'मुख्य वित्तीय कारक'],
      ['Long-Term Wealth Generation', 'दीर्घकालिक संपत्ति निर्माण'],
      ['Maturity Taxation & TDS', 'टैक्स और टीडीएस (TDS) की बचत'],
      ['Modest 6.0%–6.8% Yield', 'मात्र 6.0% से 6.8% साधारण ब्याज'],
      ['12%–15% Historical CAGR', '12% से 15% ऐतिहासिक चक्रवृद्धि रिटर्न'],
      ['WINNER', 'सर्वश्रेष्ठ विकल्प'],

      // Advisor Quote
      ['In my 12+ years as a mutual fund distributor in Ahmedabad, the biggest tragedy I see is hardworking families leaving 100% of their life savings in bank deposits, believing it is safe, while inflation quietly steals half their wealth. Let me help you protect what is yours.', 'अहमदाबाद में 12+ वर्षों के अनुभव में मैंने देखा है कि कई मेहनती परिवार अपनी जीवनभर की पूंजी बैंक में सुरक्षित मानते हैं, जबकि महंगाई धीरे-धीरे उनकी बचत की कीमत आधी कर देती है। आइए अपने भविष्य को सुरक्षित बनाएं।'],
      ['— Mr. Chetankumar Patel (AMFI-Registered Financial Distributor • ARN-333553 • Vastrapur, Ahmedabad)', '— श्री चेतनकुमार पटेल (AMFI रजिस्टर्ड वित्तीय वितरक • ARN-333553 • वस्त्रपुर, अहमदाबाद)'],

      // Fund Strip
      ['Trusted across leading fund houses', 'भारत के शीर्ष म्यूचुअल फंड हाउसेस का भरोसा'],
      ['25+ AMC Partners Across India', '25+ प्रमुख म्यूचुअल फंड पार्टनर्स'],
      ['Direct access to top-performing schemes from India\'s best fund houses', 'भारत की शीर्ष म्यूचुअल फंड योजनाओं में पारदर्शी और सीधे निवेश की सुविधा'],
      ['AMFI Registered', 'AMFI रजिस्टर्ड'],
      ['SEBI Compliant', 'SEBI नियमों के तहत 100% मान्य'],
      ['100% Secure', '100% सुरक्षित और पारदर्शी'],

      // Calculator Report & Summary Tables
      ['SWP Report', 'SWP रिपोर्ट'],
      ['SWP Summary', 'SWP सारांश'],
      ['SIP Report', 'SIP रिपोर्ट'],
      ['SIP Summary', 'SIP सारांश'],
      ['Lump Sum Report', 'एकमुश्त निवेश रिपोर्ट'],
      ['Lump Sum Summary', 'एकमुश्त निवेश सारांश'],
      ['Lumpsum Investment Amount', 'एकमुश्त निवेश की राशि'],
      ['SWP Withdrawal Amount', 'SWP निकासी की राशि'],
      ['Monthly Investment Amount', 'मासिक निवेश की राशि'],
      ['Investment Frequency', 'निवेश की आवृत्ति'],
      ['Investment Mode', 'निवेश का तरीका'],
      ['Time Period (In Year)', 'समय अवधि (वर्ष में)'],
      ['Expected Return Rate (P.A)', 'अपेक्षित रिटर्न दर (वार्षिक)'],
      ['Total Investment', 'कुल निवेश'],
      ['Total Withdrawal', 'कुल निकासी'],
      ['Total Growth', 'कुल वृद्धि'],
      ['Total Growth (Wealth Gain)', 'कुल वृद्धि (संपत्ति लाभ)'],
      ['Total Growth (Profit)', 'कुल वृद्धि (मुनाफा)'],
      ['Current Value', 'वर्तमान मूल्य'],
      ['Expected Maturity Value', 'अपेक्षित परिपक्वता राशि'],
      ['Final Maturity Value', 'अंतिम परिपक्वता राशि'],
      ['Wealth Multiplier', 'संपत्ति गुणक'],
      ['Ended In', 'समाप्त हुआ'],
      ['Completed In', 'पूर्ण हुआ'],
      ['Monthly', 'मासिक'],
      ['One-Time Lump Sum', 'एकबार का निवेश'],
      ['Download Official PDF Report', 'आधिकारिक PDF रिपोर्ट डाउनलोड करें'],
      ['Download PDF Report', 'PDF रिपोर्ट डाउनलोड करें'],
      ['Print', 'प्रिंट करें'],
      ['Print Report', 'रिपोर्ट प्रिंट करें'],
      ['Goal Planning Parameters Report', 'लक्ष्य नियोजन पैरामीटर रिपोर्ट'],
      ['Goal Investment Roadmap Summary', 'लक्ष्य निवेश रोडमैप सारांश'],
      ['Selected Goal', 'चुना गया लक्ष्य'],
      ['Goal Cost (Today)', 'लक्ष्य लागत (आज के भाव)'],
      ['Future Target (With Inflation)', 'भविष्य का लक्ष्य (महंगाई सहित)']
    ]
  };

  // 1. Ruthless suppression of Google Translate top banner & body shifts
  function suppressGoogleToolbar() {
    if (document.body) {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.body.style.position === 'relative') {
        document.body.style.position = 'static';
      }
    }
    if (document.documentElement && document.documentElement.style.top) {
      document.documentElement.style.top = '0px';
    }

    const selectors = [
      'iframe.goog-te-banner-frame',
      '.goog-te-banner-frame',
      '.goog-te-banner',
      '#goog-gt-tt',
      '.goog-te-balloon-frame',
      '.goog-tooltip',
      'iframe[src*="translate.googleapis.com"]',
      'iframe[src*="translate.google.com"]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('z-index', '-99999', 'important');
        if (el.parentNode && el.tagName.toLowerCase() === 'iframe') {
          try { el.remove(); } catch (e) {}
        }
      });
    });
  }

  // Active continuous DOM monitor
  try {
    const observer = new MutationObserver(suppressGoogleToolbar);
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  } catch (e) {}
  setInterval(suppressGoogleToolbar, 100);

  // 2. Helper to read cookie
  function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? decodeURIComponent(v[2]) : null;
  }

  // 3. Helper to set cookie across root & domains
  function setCookie(lang) {
    const val = lang === 'en' ? '/en/en' : '/en/' + lang;
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    
    document.cookie = 'googtrans=' + val + '; expires=' + expires + '; path=/; SameSite=Lax';
    
    try {
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost' && !hostname.match(/^127\./)) {
        document.cookie = 'googtrans=' + val + '; expires=' + expires + '; domain=' + hostname + '; path=/; SameSite=Lax';
        const parts = hostname.split('.');
        if (parts.length > 1) {
          document.cookie = 'googtrans=' + val + '; expires=' + expires + '; domain=.' + parts.slice(-2).join('.') + '; path=/; SameSite=Lax';
        }
      }
    } catch (e) {}

    try {
      localStorage.setItem('milestone_lang', lang);
    } catch (e) {}
  }

  // 4. Detect current preferred language
  function getCurrentLang() {
    let saved = null;
    try {
      saved = localStorage.getItem('milestone_lang');
    } catch (e) {}

    if (!saved) {
      const c = getCookie('googtrans');
      if (c) {
        const parts = c.split('/');
        if (parts.length >= 3 && SUPPORTED_LANGS[parts[2]]) {
          saved = parts[2];
        }
      }
    }

    return (saved && SUPPORTED_LANGS[saved]) ? saved : 'en';
  }

  // 5. Polish text nodes with natural, relatable phrasing in Gujarati & Hindi
  function polishDOMContent(lang) {
    if (!NATURAL_GLOSSARY[lang]) return;
    const dict = NATURAL_GLOSSARY[lang];

    // Targeted elements only - avoid destroying scripts or attributes
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, strong, small, th, td');
    elements.forEach(el => {
      // Skip language dropdown itself
      if (el.closest('.lang-dropdown')) return;

      const txt = el.textContent.trim();
      dict.forEach(([enTerm, nativeTerm]) => {
        if (txt === enTerm || (txt.length < 120 && txt.includes(enTerm))) {
          // If pure text match, replace text
          if (el.children.length === 0) {
            el.textContent = nativeTerm;
          }
        }
      });
    });
  }

  // 6. Update UI labels, active checks, and HTML language classes
  function updateUI(lang) {
    const info = SUPPORTED_LANGS[lang] || SUPPORTED_LANGS.en;
    
    // Set class on html root for font styling
    document.documentElement.classList.remove('lang-en', 'lang-gu', 'lang-hi');
    document.documentElement.classList.add('lang-' + lang);

    // Update trigger labels
    document.querySelectorAll('.lang-current-label').forEach(el => {
      el.textContent = info.native;
    });

    document.querySelectorAll('.lang-current-flag').forEach(el => {
      el.textContent = info.flag;
    });

    // Update active class on option buttons
    document.querySelectorAll('.lang-opt').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = btnLang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    suppressGoogleToolbar();
    polishDOMContent(lang);
  }

  // 7. Trigger language switch
  window.setSiteLanguage = function (lang, skipReload) {
    if (!SUPPORTED_LANGS[lang]) lang = 'en';
    const prevLang = getCurrentLang();
    setCookie(lang);
    updateUI(lang);

    // Close any open language dropdowns
    document.querySelectorAll('.lang-dropdown.open').forEach(el => el.classList.remove('open'));

    // Try interacting directly with Google Translate combo if available
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      setTimeout(() => polishDOMContent(lang), 300);
      setTimeout(() => polishDOMContent(lang), 900);
      
      // If switching back to English from another language, reload ensures clean DOM reset
      if (lang === 'en' && prevLang !== 'en' && !skipReload) {
        setTimeout(() => window.location.reload(), 150);
      }
    } else {
      // If combo not loaded yet, reload to let Google Translate initialize with new cookie
      if (!skipReload) {
        window.location.reload();
      }
    }
  };

  // 8. Global Google Translate Element Init Callback
  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate) return;

    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,gu,hi',
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');

    // Once combo is inserted, sync with user preference
    const checkCombo = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        clearInterval(checkCombo);
        const lang = getCurrentLang();
        updateUI(lang);
        if (lang !== 'en' && combo.value !== lang) {
          combo.value = lang;
          combo.dispatchEvent(new Event('change'));
          setTimeout(() => polishDOMContent(lang), 300);
          setTimeout(() => polishDOMContent(lang), 800);
        }
      }
      suppressGoogleToolbar();
    }, 100);

    setTimeout(() => clearInterval(checkCombo), 6000);
  };

  // 9. Load Google Translate API Script dynamically if not already loaded
  function loadGoogleTranslateScript() {
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    if (!document.getElementById('google-translate-script')) {
      const s = document.createElement('script');
      s.id = 'google-translate-script';
      s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.head.appendChild(s);
    }
  }

  // 10. Attach event listeners for dropdowns
  function initLangDropdowns() {
    const currentLang = getCurrentLang();
    updateUI(currentLang);

    // Toggle dropdown
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.closest('.lang-dropdown');
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains('open');
        // Close others
        document.querySelectorAll('.lang-dropdown.open').forEach(el => el.classList.remove('open'));
        dropdown.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Option clicks
    document.querySelectorAll('.lang-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetLang = opt.getAttribute('data-lang');
        if (targetLang) {
          window.setSiteLanguage(targetLang);
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-dropdown')) {
        document.querySelectorAll('.lang-dropdown.open').forEach(el => {
          el.classList.remove('open');
          const btn = el.querySelector('.lang-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.lang-dropdown.open').forEach(el => {
          el.classList.remove('open');
          const btn = el.querySelector('.lang-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // 11. Document Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLangDropdowns();
      loadGoogleTranslateScript();
      suppressGoogleToolbar();
    });
  } else {
    initLangDropdowns();
    loadGoogleTranslateScript();
    suppressGoogleToolbar();
  }
})();
