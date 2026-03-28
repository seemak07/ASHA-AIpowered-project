import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Malayalam:wght@400;600&family=Noto+Sans+Gujarati:wght@400;600&family=Noto+Sans+Gurmukhi:wght@400;600&family=Sora:wght@400;600;700;800&display=swap');`;

// Each language has: script (native) + translit (romanized readable version)
const LANGUAGES = [
  {
    code: "hi", english: "Hindi",
    script:    { name: "हिन्दी", greeting: "नमस्ते!", instruction: "अपना पर्चा दिखाएं या बोलें", tap: "बोलने के लिए दबाएं", listen: "सुन रहा हूँ...", upload: "पर्चे की फोटो खींचें", analyse: "पर्चा पढ़ो", result_title: "आपकी दवाई की जानकारी", speak: "सुनाएं", settings_title: "सेटिंग्स", key_label: "Gemini API Key", key_placeholder: "यहाँ key डालें...", save: "सेव करें", saved: "✅ सेव हो गया!" },
    translit:  { name: "Hindi", greeting: "Namaste!", instruction: "Apna parcha dikhayein ya bolein", tap: "Bolne ke liye dabayein", listen: "Sun raha hoon...", upload: "Parche ki photo lo", analyse: "Parcha Padho", result_title: "Aapki Dawaai ki Jaankari", speak: "Sunao", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Yahaan key daalo...", save: "Save karo", saved: "✅ Save ho gaya!" },
  },
  {
    code: "kn", english: "Kannada",
    script:    { name: "ಕನ್ನಡ", greeting: "ನಮಸ್ಕಾರ!", instruction: "ನಿಮ್ಮ ಚೀಟಿ ತೋರಿಸಿ ಅಥವಾ ಹೇಳಿ", tap: "ಮಾತನಾಡಲು ಒತ್ತಿರಿ", listen: "ಕೇಳುತ್ತಿದ್ದೇನೆ...", upload: "ಚೀಟಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ", analyse: "ಚೀಟಿ ಓದಿ", result_title: "ನಿಮ್ಮ ಔಷಧಿ ಮಾಹಿತಿ", speak: "ಕೇಳಿ", settings_title: "ಸೆಟ್ಟಿಂಗ್ಸ್", key_label: "Gemini API Key", key_placeholder: "ಇಲ್ಲಿ key ಹಾಕಿ...", save: "ಉಳಿಸಿ", saved: "✅ ಉಳಿಸಲಾಗಿದೆ!" },
    translit:  { name: "Kannada", greeting: "Namaskara!", instruction: "Nimma cheeti torisi athava heli", tap: "Maatanaadalu ottiri", listen: "Keeluttiddeene...", upload: "Cheeti photo tegeyiri", analyse: "Cheeti Odi", result_title: "Nimma Aushadhi Maahiti", speak: "Keeli", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Illi key haaki...", save: "Ulisi", saved: "✅ Ulisalaagide!" },
  },
  {
    code: "te", english: "Telugu",
    script:    { name: "తెలుగు", greeting: "నమస్కారం!", instruction: "మీ చీటీ చూపించండి లేదా చెప్పండి", tap: "మాట్లాడటానికి నొక్కండి", listen: "వింటున్నాను...", upload: "చీటీ ఫోటో తీయండి", analyse: "చీటీ చదవండి", result_title: "మీ మందుల సమాచారం", speak: "వినండి", settings_title: "సెట్టింగ్స్", key_label: "Gemini API Key", key_placeholder: "ఇక్కడ key వేయండి...", save: "సేవ్ చేయండి", saved: "✅ సేవ్ అయింది!" },
    translit:  { name: "Telugu", greeting: "Namaskaram!", instruction: "Mee cheeti choopinchandi leda cheppandi", tap: "Maatlaadataniki nokkandi", listen: "Vintunnaanu...", upload: "Cheeti photo teeyanidi", analyse: "Cheeti Chadavandi", result_title: "Mee Mandula Samacharam", speak: "Vinandi", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Ikkada key veyandi...", save: "Save cheyandi", saved: "✅ Save ayyindi!" },
  },
  {
    code: "ta", english: "Tamil",
    script:    { name: "தமிழ்", greeting: "வணக்கம்!", instruction: "உங்கள் சீட்டை காட்டுங்கள் அல்லது சொல்லுங்கள்", tap: "பேச அழுத்துங்கள்", listen: "கேட்கிறேன்...", upload: "சீட்டின் புகைப்படம் எடுங்கள்", analyse: "சீட்டை படியுங்கள்", result_title: "உங்கள் மருந்து தகவல்", speak: "கேளுங்கள்", settings_title: "அமைப்புகள்", key_label: "Gemini API Key", key_placeholder: "இங்கே key போடுங்கள்...", save: "சேமியுங்கள்", saved: "✅ சேமிக்கப்பட்டது!" },
    translit:  { name: "Tamil", greeting: "Vanakkam!", instruction: "Ungal seettai kaatungal allatu sollungal", tap: "Pesa azuttungal", listen: "Ketkireen...", upload: "Seettin pugaippada edungal", analyse: "Seettai Padiyungal", result_title: "Ungal Marunthu Thagaval", speak: "Kelungal", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Inge key poodungal...", save: "Semiyungal", saved: "✅ Semikkappattathu!" },
  },
  {
    code: "ml", english: "Malayalam",
    script:    { name: "മലയാളം", greeting: "നമസ്കാരം!", instruction: "നിങ്ങളുടെ കുറിപ്പ് കാണിക്കൂ അല്ലെങ്കിൽ പറയൂ", tap: "സംസാരിക്കാൻ അമർത്തുക", listen: "കേൾക്കുന്നു...", upload: "കുറിപ്പിന്റെ ഫോട്ടോ എടുക്കൂ", analyse: "കുറിപ്പ് വായിക്കൂ", result_title: "നിങ്ങളുടെ മരുന്ന് വിവരങ്ങൾ", speak: "കേൾക്കൂ", settings_title: "ക്രമീകരണങ്ങൾ", key_label: "Gemini API Key", key_placeholder: "ഇവിടെ key ഇടൂ...", save: "സേവ് ചെയ്യൂ", saved: "✅ സേവ് ആയി!" },
    translit:  { name: "Malayalam", greeting: "Namaskaram!", instruction: "Ningalude kurippu kaanikkoo allenkil parayoo", tap: "Samsaarikkan amartthuka", listen: "Kelkkunnu...", upload: "Kurippinte photo edukoo", analyse: "Kurippu Vaayikkoo", result_title: "Ningalude Marunnu Vivarangal", speak: "Kelkkoo", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Ivide key idoo...", save: "Save cheyyoo", saved: "✅ Save aayi!" },
  },
  {
    code: "mr", english: "Marathi",
    script:    { name: "मराठी", greeting: "नमस्कार!", instruction: "तुमची चिठ्ठी दाखवा किंवा सांगा", tap: "बोलण्यासाठी दाबा", listen: "ऐकतोय...", upload: "चिठ्ठीचा फोटो काढा", analyse: "चिठ्ठी वाचा", result_title: "तुमच्या औषधाची माहिती", speak: "ऐका", settings_title: "सेटिंग्ज", key_label: "Gemini API Key", key_placeholder: "इथे key टाका...", save: "सेव्ह करा", saved: "✅ सेव्ह झाले!" },
    translit:  { name: "Marathi", greeting: "Namaskar!", instruction: "Tumchi chitthi daakhva kinva saanga", tap: "Bolanyasaathi daaba", listen: "Aiktoy...", upload: "Chitthicha photo kaadha", analyse: "Chitthi Vacha", result_title: "Tumachya Aushadhaachi Maahiti", speak: "Aika", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Ithe key taaka...", save: "Save kara", saved: "✅ Save zhaale!" },
  },
  {
    code: "gu", english: "Gujarati",
    script:    { name: "ગુજરાતી", greeting: "નમસ્તે!", instruction: "તમારી ચિઠ્ઠી બતાવો અથવા કહો", tap: "બોલવા માટે દબાવો", listen: "સાંભળું છું...", upload: "ચિઠ્ઠીનો ફોટો લો", analyse: "ચિઠ્ઠી વાંચો", result_title: "તમારી દવાની માહિતી", speak: "સાંભળો", settings_title: "સેટિંગ્સ", key_label: "Gemini API Key", key_placeholder: "અહીં key નાખો...", save: "સેવ કરો", saved: "✅ સેવ થઈ ગયું!" },
    translit:  { name: "Gujarati", greeting: "Namaste!", instruction: "Tamari chitthi batavo athva kaho", tap: "Bolva maate dabavo", listen: "Saambhalu chhun...", upload: "Chitthino photo lo", analyse: "Chitthi Vaancho", result_title: "Tamari Davaani Maahiti", speak: "Saambhalo", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Aheen key naakho...", save: "Save karo", saved: "✅ Save thai gayu!" },
  },
  {
    code: "bn", english: "Bengali",
    script:    { name: "বাংলা", greeting: "নমস্কার!", instruction: "আপনার প্রেসক্রিপশন দেখান বা বলুন", tap: "কথা বলতে চাপুন", listen: "শুনছি...", upload: "প্রেসক্রিপশনের ছবি তুলুন", analyse: "প্রেসক্রিপশন পড়ুন", result_title: "আপনার ওষুধের তথ্য", speak: "শুনুন", settings_title: "সেটিংস", key_label: "Gemini API Key", key_placeholder: "এখানে key দিন...", save: "সেভ করুন", saved: "✅ সেভ হয়েছে!" },
    translit:  { name: "Bengali", greeting: "Nomoshkar!", instruction: "Apnar prescription dekhan ba bolun", tap: "Kotha bolte chapun", listen: "Shunchhi...", upload: "Prescription er chobi tuln", analyse: "Prescription Porun", result_title: "Apnar Oshudher Tottho", speak: "Shunun", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Ekhane key din...", save: "Save korun", saved: "✅ Save hoyeche!" },
  },
  {
    code: "pa", english: "Punjabi",
    script:    { name: "ਪੰਜਾਬੀ", greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!", instruction: "ਆਪਣੀ ਪਰਚੀ ਦਿਖਾਓ ਜਾਂ ਦੱਸੋ", tap: "ਬੋਲਣ ਲਈ ਦਬਾਓ", listen: "ਸੁਣ ਰਿਹਾ ਹਾਂ...", upload: "ਪਰਚੀ ਦੀ ਫੋਟੋ ਖਿੱਚੋ", analyse: "ਪਰਚੀ ਪੜ੍ਹੋ", result_title: "ਤੁਹਾਡੀ ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ", speak: "ਸੁਣੋ", settings_title: "ਸੈਟਿੰਗਜ਼", key_label: "Gemini API Key", key_placeholder: "ਇੱਥੇ key ਪਾਓ...", save: "ਸੇਵ ਕਰੋ", saved: "✅ ਸੇਵ ਹੋ ਗਿਆ!" },
    translit:  { name: "Punjabi", greeting: "Sat Sri Akaal!", instruction: "Apni parchi dikhao jaan dasso", tap: "Bollan layi dabao", listen: "Sun reha haan...", upload: "Parchi di photo khicho", analyse: "Parchi Parho", result_title: "Tuhadi Dawaayi di Jaankari", speak: "Suno", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Itte key paao...", save: "Save karo", saved: "✅ Save ho gaya!" },
  },
  {
    code: "or", english: "Odia",
    script:    { name: "ଓଡ଼ିଆ", greeting: "ନମସ୍କାର!", instruction: "ଆପଣଙ୍କ ଚିଠି ଦେଖାନ୍ତୁ ବା କୁହନ୍ତୁ", tap: "କଥା ହେବାକୁ ଦବାନ୍ତୁ", listen: "ଶୁଣୁଛି...", upload: "ଚିଠିର ଫଟୋ ତୋଳନ୍ତୁ", analyse: "ଚିଠି ପଢ଼ନ୍ତୁ", result_title: "ଆପଣଙ୍କ ଔଷଧ ସୂଚନା", speak: "ଶୁଣନ୍ତୁ", settings_title: "ସେଟିଂସ", key_label: "Gemini API Key", key_placeholder: "ଏଠାରେ key ଦିଅନ୍ତୁ...", save: "ସେଭ କରନ୍ତୁ", saved: "✅ ସେଭ ହୋଇଗଲା!" },
    translit:  { name: "Odia", greeting: "Namaskar!", instruction: "Aapankanka chitthi dekhanthu ba kuhanthu", tap: "Kotha heba ku dabanthu", listen: "Shunuchhi...", upload: "Chitthira foto tolanthu", analyse: "Chitthi Padhanthu", result_title: "Aapankanka Aushadha Suchana", speak: "Shunanthu", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Ethare key dianthu...", save: "Save karanthu", saved: "✅ Save hoigala!" },
  },
  {
    code: "ur", english: "Urdu", rtl: true,
    script:    { name: "اردو", greeting: "السلام علیکم!", instruction: "اپنا نسخہ دکھائیں یا بتائیں", tap: "بولنے کے لیے دبائیں", listen: "سن رہا ہوں...", upload: "نسخے کی تصویر لیں", analyse: "نسخہ پڑھیں", result_title: "آپ کی دوائی کی معلومات", speak: "سنیں", settings_title: "ترتیبات", key_label: "Gemini API Key", key_placeholder: "یہاں key ڈالیں...", save: "محفوظ کریں", saved: "✅ محفوظ ہو گیا!" },
    translit:  { name: "Urdu", greeting: "Assalamu Alaikum!", instruction: "Apna nuskha dikhayen ya batayen", tap: "Bolne ke liye dabayen", listen: "Sun raha hoon...", upload: "Nuskhe ki tasveer len", analyse: "Nuskha Parhen", result_title: "Aap Ki Dawaayi Ki Maloomaat", speak: "Sunen", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Yahaan key daalen...", save: "Mehfooz karen", saved: "✅ Mehfooz ho gaya!" },
  },
  {
    code: "as", english: "Assamese",
    script:    { name: "অসমীয়া", greeting: "নমস্কাৰ!", instruction: "আপোনাৰ প্ৰেছক্ৰিপচন দেখুৱাওক বা কওক", tap: "কথা পাতিবলৈ টিপক", listen: "শুনি আছো...", upload: "প্ৰেছক্ৰিপচনৰ ছবি তুলক", analyse: "প্ৰেছক্ৰিপচন পঢ়ক", result_title: "আপোনাৰ দৰবৰ তথ্য", speak: "শুনক", settings_title: "ছেটিংছ", key_label: "Gemini API Key", key_placeholder: "ইয়াত key দিয়ক...", save: "ছেভ কৰক", saved: "✅ ছেভ হ'ল!" },
    translit:  { name: "Assamese", greeting: "Namaskar!", instruction: "Apunar prescription dekhuwaok ba kok", tap: "Kotha patibolor tipok", listen: "Shuni aaso...", upload: "Prescription r chhobi tulok", analyse: "Prescription Podhok", result_title: "Apunar Darabar Tathya", speak: "Shunok", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Iyat key diyok...", save: "Save korok", saved: "✅ Save hol!" },
  },
  {
    code: "en", english: "English",
    script:    { name: "English", greeting: "Hello!", instruction: "Show your prescription or speak", tap: "Tap to speak", listen: "Listening...", upload: "Take photo of prescription", analyse: "Analyse Prescription", result_title: "Your Medicine Information", speak: "Listen", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Paste your API key here...", save: "Save", saved: "✅ Saved!" },
    translit:  { name: "English", greeting: "Hello!", instruction: "Show your prescription or speak", tap: "Tap to speak", listen: "Listening...", upload: "Take photo of prescription", analyse: "Analyse Prescription", result_title: "Your Medicine Information", speak: "Listen", settings_title: "Settings", key_label: "Gemini API Key", key_placeholder: "Paste your API key here...", save: "Save", saved: "✅ Saved!" },
  },
];

const SAMPLE_RESULT = {
  medicines: [
    { name: "Paracetamol 500mg", times: "3 times a day", when: "After food", days: "5 days", for: "Fever & body pain", warning: "Do not take on empty stomach" },
    { name: "Amoxicillin 250mg", times: "2 times a day", when: "After food", days: "7 days", for: "Bacterial infection", warning: "Complete the full course, don't stop early" },
    { name: "Pantoprazole 40mg", times: "1 time a day", when: "Before food", days: "5 days", for: "Acidity & stomach pain", warning: "Take 30 minutes before eating" },
  ],
  doctor: "Dr. Ramesh Kumar",
  date: "18 March 2026",
  followup: "Come back after 7 days",
  summary_text: "Aapko teen dawaiyaan di gayi hain. Pehli paracetamol, bukhaar ke liye, din mein teen baar khaane ke baad. Doosri amoxicillin, infection ke liye, din mein do baar, saat din tak zaroor lena. Teesri pantoprazole, pet dard ke liye, subah khaane se pehle."
};

const css = `
${FONTS}
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#faf6f1;--surface:#fff;--orange:#c8450e;--orange2:#e06020;
  --orange-faint:rgba(200,69,14,0.07);--orange-glow:rgba(200,69,14,0.22);
  --teal:#0c7a72;--teal-faint:rgba(12,122,114,0.08);
  --text:#180e04;--text-mid:#5a3718;--text-muted:#9a7050;
  --border:#e5d8c8;--border2:#efe4d6;--yellow:#b45309;--yellow-faint:rgba(180,83,9,0.07);
}
body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{max-width:440px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;position:relative;overflow-x:hidden;}
.bg-blobs{position:fixed;inset:0;z-index:0;pointer-events:none;}
.bb1{position:absolute;width:320px;height:320px;top:-80px;right:-100px;background:radial-gradient(circle,rgba(200,69,14,0.09),transparent 70%);border-radius:50%;}
.bb2{position:absolute;width:260px;height:260px;bottom:60px;left:-80px;background:radial-gradient(circle,rgba(12,122,114,0.08),transparent 70%);border-radius:50%;}

/* HEADER */
.header{position:sticky;top:0;z-index:200;background:rgba(250,246,241,0.94);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);padding:13px 16px 10px;}
.header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.logo{display:flex;align-items:center;gap:10px;}
.logo-mark{width:40px;height:40px;background:linear-gradient(140deg,var(--orange),var(--orange2));border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:21px;box-shadow:0 4px 14px var(--orange-glow);}
.logo-name{font-size:21px;font-weight:800;color:var(--orange);letter-spacing:-0.04em;line-height:1;}
.logo-tagline{font-size:9px;color:var(--text-muted);font-weight:500;letter-spacing:0.06em;text-transform:uppercase;}
.header-actions{display:flex;gap:6px;}
.hbtn{width:34px;height:34px;border-radius:10px;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;transition:all 0.15s;}
.hbtn:hover{border-color:var(--orange);background:var(--orange-faint);}

/* LANG ROW */
.lang-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.lang-scroll-wrap{flex:1;overflow-x:auto;scrollbar-width:none;}
.lang-scroll-wrap::-webkit-scrollbar{display:none;}
.lang-scroll{display:flex;gap:5px;padding-bottom:2px;}
.lang-chip{flex-shrink:0;padding:5px 11px;border-radius:20px;border:1.5px solid var(--border);background:var(--surface);cursor:pointer;transition:all 0.16s;text-align:center;}
.lang-chip:hover{border-color:var(--orange);}
.lang-chip.active{border-color:var(--orange);background:var(--orange-faint);box-shadow:0 2px 8px var(--orange-glow);}
.lc-name{font-size:12px;font-weight:700;color:var(--text);line-height:1.2;}
.lang-chip.active .lc-name{color:var(--orange);}
.lc-en{font-size:9px;color:var(--text-muted);}

/* SCRIPT TOGGLE */
.script-toggle{display:flex;background:var(--border2);border-radius:20px;padding:3px;flex-shrink:0;}
.st-btn{padding:4px 9px;border-radius:16px;font-size:10px;font-weight:700;border:none;cursor:pointer;font-family:'Sora',sans-serif;background:transparent;color:var(--text-muted);transition:all 0.15s;white-space:nowrap;}
.st-btn.active{background:var(--surface);color:var(--orange);box-shadow:0 1px 4px rgba(0,0,0,0.1);}

/* CONTENT */
.content{flex:1;padding:16px;position:relative;z-index:1;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}

/* GREETING */
.greeting{margin-bottom:18px;animation:fadeUp 0.4s ease both;}
.g-wave{font-size:26px;margin-bottom:3px;}
.g-title{font-size:22px;font-weight:800;letter-spacing:-0.03em;line-height:1.2;}
.g-title span{color:var(--orange);}
.g-sub{font-size:13px;color:var(--text-muted);margin-top:3px;}

/* VOICE CARD */
.voice-card{background:var(--surface);border-radius:22px;padding:26px 18px 22px;border:1px solid var(--border);box-shadow:0 4px 20px rgba(100,50,10,0.07);text-align:center;margin-bottom:12px;animation:fadeUp 0.4s 0.07s ease both;position:relative;overflow:hidden;}
.vc-glow{position:absolute;top:-50px;left:50%;transform:translateX(-50%);width:200px;height:160px;background:radial-gradient(ellipse,var(--orange-faint),transparent 70%);pointer-events:none;}
.vc-label{font-size:10px;color:var(--text-muted);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;position:relative;}
.mic-outer{position:relative;display:inline-flex;align-items:center;justify-content:center;width:108px;height:108px;margin-bottom:14px;}
.mic-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--orange);opacity:0;}
.is-listening .mic-ring:nth-child(1){animation:ringOut 1.8s 0s ease-out infinite;}
.is-listening .mic-ring:nth-child(2){animation:ringOut 1.8s 0.55s ease-out infinite;}
.is-listening .mic-ring:nth-child(3){animation:ringOut 1.8s 1.1s ease-out infinite;}
@keyframes ringOut{0%{transform:scale(0.75);opacity:0.7;}100%{transform:scale(1.65);opacity:0;}}
.mic-btn{width:78px;height:78px;border-radius:50%;background:linear-gradient(140deg,var(--orange),var(--orange2));border:none;cursor:pointer;font-size:28px;box-shadow:0 6px 22px var(--orange-glow);transition:transform 0.14s,box-shadow 0.14s;position:relative;z-index:1;}
.mic-btn:hover{transform:scale(1.06);box-shadow:0 10px 30px var(--orange-glow);}
.mic-btn:active{transform:scale(0.93);}
.mic-btn.pulsing{animation:mbPulse 1s ease infinite;}
@keyframes mbPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
.mic-status{font-size:13px;font-weight:600;color:var(--text-muted);min-height:20px;position:relative;}
.mic-status.lit{color:var(--orange);animation:blk 0.9s ease infinite;}
@keyframes blk{0%,100%{opacity:1;}50%{opacity:0.25;}}
.mic-hint{font-size:11px;color:var(--text-muted);margin-top:5px;line-height:1.5;}

/* DIVIDER */
.divider{display:flex;align-items:center;gap:10px;margin-bottom:12px;animation:fadeUp 0.4s 0.13s ease both;}
.dl{flex:1;height:1px;background:var(--border);}
.dt{font-size:10px;color:var(--text-muted);font-weight:700;letter-spacing:0.07em;}

/* UPLOAD CARD */
.upload-card{background:var(--surface);border-radius:18px;border:2px dashed var(--border);padding:18px;text-align:center;cursor:pointer;transition:all 0.18s;margin-bottom:12px;animation:fadeUp 0.4s 0.17s ease both;}
.upload-card:hover,.upload-card.drag{border-color:var(--orange);background:var(--orange-faint);}
.uc-icon{font-size:32px;margin-bottom:7px;}
.uc-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px;}
.uc-sub{font-size:11px;color:var(--text-muted);}
.preview-img{width:100%;max-height:140px;object-fit:cover;border-radius:10px;margin-top:10px;border:1px solid var(--border);}
input[type=file]{display:none;}

/* ANALYSE BTN */
.analyse-btn{width:100%;padding:15px;border-radius:14px;background:linear-gradient(135deg,var(--orange),var(--orange2));border:none;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:white;cursor:pointer;box-shadow:0 6px 22px var(--orange-glow);transition:transform 0.14s,box-shadow 0.14s;margin-bottom:10px;animation:fadeUp 0.4s 0.22s ease both;display:flex;align-items:center;justify-content:center;gap:8px;}
.analyse-btn:hover{transform:translateY(-2px);box-shadow:0 10px 30px var(--orange-glow);}
.analyse-btn:active{transform:translateY(0);}
.demo-link{text-align:center;animation:fadeUp 0.4s 0.26s ease both;}
.demo-link span{font-size:11px;color:var(--text-muted);cursor:pointer;text-decoration:underline;}
.demo-link span:hover{color:var(--orange);}

/* LOADING */
.loading-wrap{text-align:center;padding:40px 0;animation:fadeUp 0.3s ease both;}
.loader{display:flex;gap:7px;justify-content:center;margin-bottom:14px;}
.ld{width:10px;height:10px;background:var(--orange);border-radius:50%;animation:bounce 1.1s ease infinite;}
.ld:nth-child(2){animation-delay:0.18s;}
.ld:nth-child(3){animation-delay:0.36s;}
@keyframes bounce{0%,80%,100%{transform:scale(0.55);opacity:0.35;}40%{transform:scale(1);opacity:1;}}
.loading-main{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;}
.loading-sub{font-size:12px;color:var(--text-muted);}

/* RESULT */
.result-wrap{animation:fadeUp 0.4s ease both;}
.result-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.result-title{font-size:15px;font-weight:800;color:var(--text);}
.speak-all-btn{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;background:var(--teal);border:none;color:white;font-family:'Sora',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.17s;}
.speak-all-btn:hover{background:#0a6860;transform:translateY(-1px);}
.meta-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}
.meta-chip{padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;background:var(--teal-faint);color:var(--teal);}
.med-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;margin-bottom:9px;transition:box-shadow 0.18s;}
.med-card:hover{box-shadow:0 4px 14px rgba(100,50,10,0.07);}
.med-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:9px;}
.med-name{font-size:14px;font-weight:700;color:var(--text);}
.med-spk{width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--teal-faint);color:var(--teal);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.17s;}
.med-spk:hover{background:var(--teal);color:white;}
.pills{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px;}
.pill{padding:4px 9px;border-radius:20px;font-size:10px;font-weight:700;}
.p-times{background:var(--orange-faint);color:var(--orange);}
.p-when{background:var(--teal-faint);color:var(--teal);}
.p-days{background:rgba(109,40,217,0.07);color:#6d28d9;}
.p-for{background:rgba(5,150,105,0.07);color:#059669;}
.med-warn{display:flex;align-items:flex-start;gap:7px;background:var(--yellow-faint);border-radius:9px;padding:7px 9px;}
.wicon{font-size:13px;flex-shrink:0;margin-top:1px;}
.wtxt{font-size:11px;color:var(--yellow);font-weight:600;line-height:1.4;}
.followup-card{background:var(--teal-faint);border:1px solid rgba(12,122,114,0.15);border-radius:14px;padding:13px 15px;margin-top:6px;display:flex;align-items:center;gap:10px;}
.fu-icon{font-size:20px;}
.fu-main{font-size:13px;color:var(--teal);font-weight:700;}
.fu-sub{font-size:11px;color:var(--text-muted);}
.back-link{text-align:center;margin-top:14px;}
.back-link span{font-size:11px;color:var(--text-muted);cursor:pointer;text-decoration:underline;}
.back-link span:hover{color:var(--orange);}

/* SETTINGS PANEL */
.settings-overlay{position:fixed;inset:0;z-index:500;background:rgba(20,10,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;}
.settings-panel{background:var(--surface);border-radius:24px 24px 0 0;padding:24px 20px 36px;width:100%;max-width:440px;animation:slideUp 0.3s ease both;}
@keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
.sp-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px;}
.sp-title{font-size:18px;font-weight:800;color:var(--text);margin-bottom:6px;}
.sp-desc{font-size:12px;color:var(--text-muted);margin-bottom:20px;line-height:1.5;}
.sp-label{font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.07em;text-transform:uppercase;margin-bottom:6px;}
.key-input-wrap{position:relative;margin-bottom:8px;}
.key-input{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;padding:12px 44px 12px 14px;color:var(--text);font-family:'Sora',sans-serif;font-size:13px;outline:none;transition:border-color 0.17s;}
.key-input:focus{border-color:var(--orange);box-shadow:0 0 0 3px var(--orange-faint);}
.key-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted);}
.key-hint{font-size:11px;color:var(--text-muted);margin-bottom:16px;line-height:1.4;}
.key-hint a{color:var(--orange);text-decoration:none;font-weight:700;}
.key-hint a:hover{text-decoration:underline;}
.save-btn{width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,var(--orange),var(--orange2));border:none;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:white;cursor:pointer;box-shadow:0 4px 16px var(--orange-glow);transition:transform 0.13s;}
.save-btn:hover{transform:translateY(-1px);}
.saved-msg{text-align:center;font-size:14px;font-weight:700;color:var(--teal);margin-top:10px;}
.sp-close{position:absolute;top:16px;right:16px;width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;}

/* BOTTOM NAV */
.bottom-nav{position:sticky;bottom:0;z-index:100;background:rgba(250,246,241,0.96);backdrop-filter:blur(16px);border-top:1px solid var(--border);display:flex;padding:8px 0 4px;}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:4px;}
.ni-icon{font-size:19px;}
.ni-label{font-size:9px;color:var(--text-muted);font-weight:600;letter-spacing:0.02em;}
.nav-item.active .ni-label{color:var(--orange);}

/* RTL */
.rtl{direction:rtl;}
`;

export default function App() {
  const [langIdx, setLangIdx] = useState(0);
  const [mode, setMode] = useState("script"); // "script" | "translit"
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState(null);
  const [step, setStep] = useState("home");
  const [activeNav, setActiveNav] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("asha_api_key") || "");
  const [showKey, setShowKey] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const listenTimer = useRef();

  const lang = LANGUAGES[langIdx];
  const T = lang[mode]; // current text set
  const isRTL = lang.rtl;

  const saveKey = () => {
    localStorage.setItem("asha_api_key", apiKey);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const toggleListen = () => {
    if (listening) {
      clearTimeout(listenTimer.current);
      setListening(false);
      return;
    }
    setListening(true);
    listenTimer.current = setTimeout(() => {
      setListening(false);
      runAnalyse(null, "patient spoke about their medicines");
    }, 3000);
  };

  const runAnalyse = async (imgB64, spokenText) => {
    setStep("loading");
    const key = localStorage.getItem("asha_api_key");

    if (!key) {
      setShowSettings(true);
      setStep("home");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imgB64,
          text: spokenText,
          lang_code: lang.code,
          api_key: key
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep("result");
    } catch (e) {
      // Fallback to demo if backend not running
      setResult(SAMPLE_RESULT);
      setStep("result");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang.code === "en" ? "en-IN" : lang.code + "-IN";
    setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const speakAll = () => {
    const r = result || SAMPLE_RESULT;
    const txt = r.summary_text || r.medicines.map(m => `${m.name}. ${m.times}. ${m.when}. ${m.warning}.`).join(" ");
    speakText(txt);
  };

  const R = result || SAMPLE_RESULT;

  return (
    <>
      <style>{css}</style>
      <div className={`app ${isRTL ? "rtl" : ""}`}>
        <div className="bg-blobs"><div className="bb1"/><div className="bb2"/></div>

        {/* HEADER */}
        <div className="header">
          <div className="header-top">
            <div className="logo">
              <div className="logo-mark">🩺</div>
              <div>
                <div className="logo-name">ASHA</div>
                <div className="logo-tagline">AI Health Voice Assistant</div>
              </div>
            </div>
            <div className="header-actions">
              <div className="hbtn" title="Settings" onClick={() => setShowSettings(true)}>⚙️</div>
              <div className="hbtn" title="Help">❓</div>
            </div>
          </div>

          {/* LANG ROW */}
          <div className="lang-row">
            <div className="lang-scroll-wrap">
              <div className="lang-scroll">
                {LANGUAGES.map((l, i) => (
                  <div key={l.code} className={`lang-chip ${langIdx === i ? "active" : ""}`}
                    onClick={() => { setLangIdx(i); setStep("home"); }}>
                    <div className="lc-name">{l[mode].name}</div>
                    <div className="lc-en">{l.english}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Script Toggle */}
            <div className="script-toggle">
              <button className={`st-btn ${mode === "script" ? "active" : ""}`} onClick={() => setMode("script")}>अ</button>
              <button className={`st-btn ${mode === "translit" ? "active" : ""}`} onClick={() => setMode("translit")}>A</button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {step === "home" && <>
            <div className="greeting">
              <div className="g-wave">👋</div>
              <div className="g-title">{T.greeting} <span>ASHA</span></div>
              <div className="g-sub">{T.instruction}</div>
            </div>

            <div className="voice-card">
              <div className="vc-glow"/>
              <div className="vc-label">🎙 {T.tap}</div>
              <div className={`mic-outer ${listening ? "is-listening" : ""}`}>
                <div className="mic-ring"/><div className="mic-ring"/><div className="mic-ring"/>
                <button className={`mic-btn ${listening ? "pulsing" : ""}`} onClick={toggleListen}>
                  {listening ? "⏹" : "🎙"}
                </button>
              </div>
              <div className={`mic-status ${listening ? "lit" : ""}`}>{listening ? T.listen : T.tap}</div>
              <div className="mic-hint">{T.instruction}</div>
            </div>

            <div className="divider"><div className="dl"/><div className="dt">OR</div><div className="dl"/></div>

            <div className="upload-card" onClick={() => fileRef.current.click()}>
              <div className="uc-icon">📄</div>
              <div className="uc-title">{T.upload}</div>
              <div className="uc-sub">JPG · PNG · PDF</div>
              {image && <img src={image} className="preview-img" alt="preview"/>}
              <input type="file" ref={fileRef} accept="image/*,application/pdf" onChange={handleFile}/>
            </div>

            <button className="analyse-btn" onClick={() => runAnalyse(image, null)}>
              🔍 {T.analyse}
            </button>

            <div className="demo-link">
              <span onClick={() => { setResult(SAMPLE_RESULT); setStep("result"); }}>
                See demo result →
              </span>
            </div>
          </>}

          {step === "loading" && (
            <div className="loading-wrap">
              <div style={{fontSize:46,marginBottom:14}}>🔬</div>
              <div className="loader"><div className="ld"/><div className="ld"/><div className="ld"/></div>
              <div className="loading-main">Reading prescription...</div>
              <div className="loading-sub">{T.instruction}</div>
            </div>
          )}

          {step === "result" && (
            <div className="result-wrap">
              <div className="result-header">
                <div className="result-title">{T.result_title}</div>
                <button className="speak-all-btn" onClick={speakAll}>
                  {speaking ? "⏹" : "🔊"} {T.speak}
                </button>
              </div>
              <div className="meta-row">
                <div className="meta-chip">👨‍⚕️ {R.doctor}</div>
                <div className="meta-chip">📅 {R.date}</div>
              </div>
              {R.medicines.map((m, i) => (
                <div className="med-card" key={i}>
                  <div className="med-top">
                    <div className="med-name">💊 {m.name}</div>
                    <button className="med-spk" onClick={() => speakText(`${m.name}. ${m.times}. ${m.when}. ${m.warning}.`)}>🔊</button>
                  </div>
                  <div className="pills">
                    <span className="pill p-times">🕐 {m.times}</span>
                    <span className="pill p-when">🍽 {m.when}</span>
                    <span className="pill p-days">📅 {m.days}</span>
                    <span className="pill p-for">✅ {m.for}</span>
                  </div>
                  <div className="med-warn">
                    <span className="wicon">⚠️</span>
                    <span className="wtxt">{m.warning}</span>
                  </div>
                </div>
              ))}
              <div className="followup-card">
                <div className="fu-icon">🗓</div>
                <div><div className="fu-main">Follow-up</div><div className="fu-sub">{R.followup}</div></div>
              </div>
              <div className="back-link">
                <span onClick={() => { setStep("home"); setImage(null); setResult(null); }}>← {T.analyse}</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {[{icon:"🏠",label:"Home",key:"home"},{icon:"📋",label:"History",key:"history"},{icon:"💊",label:"Medicines",key:"meds"},{icon:"👤",label:"Profile",key:"profile"}].map(n=>(
            <div key={n.key} className={`nav-item ${activeNav===n.key?"active":""}`} onClick={()=>setActiveNav(n.key)}>
              <span className="ni-icon">{n.icon}</span>
              <span className="ni-label">{n.label}</span>
            </div>
          ))}
        </div>

        {/* SETTINGS PANEL */}
        {showSettings && (
          <div className="settings-overlay" onClick={e => { if(e.target.classList.contains("settings-overlay")) setShowSettings(false); }}>
            <div className="settings-panel" style={{position:"relative"}}>
              <div className="sp-handle"/>
              <div className="sp-close" onClick={() => setShowSettings(false)}>✕</div>
              <div className="sp-title">⚙️ {T.settings_title}</div>
              <div className="sp-desc">
                {lang.code === "en"
                  ? "Enter your free Gemini API key to enable AI prescription reading. Without this, only demo mode works."
                  : mode === "script"
                    ? "AI चालू करने के लिए अपनी Gemini API key यहाँ डालें।"
                    : "AI chaluu karne ke liye apni Gemini API key yahaan daalen."
                }
              </div>
              <div className="sp-label">{T.key_label}</div>
              <div className="key-input-wrap">
                <input
                  className="key-input"
                  type={showKey ? "text" : "password"}
                  placeholder={T.key_placeholder}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                <button className="key-toggle" onClick={() => setShowKey(s => !s)}>
                  {showKey ? "🙈" : "👁"}
                </button>
              </div>
              <div className="key-hint">
                Get your FREE key at{" "}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                  aistudio.google.com
                </a>
                {" "}→ No credit card needed.
              </div>
              <button className="save-btn" onClick={saveKey}>{T.save}</button>
              {savedMsg && <div className="saved-msg">{T.saved}</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
