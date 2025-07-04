"use client"

import { useEffect, useRef, useState } from "react"
import { FaMicrophone, FaMicrophoneSlash, FaMapMarkerAlt, FaPhone, FaTimes, FaVolumeUp } from "react-icons/fa"
import FileUpload from "./FileUpload"; // <-- add this at the top ( for file uplaod folder )
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import ChatHistorySidebar from "../ChatHistorySidebar";
import "../index.css"
import { useNavigate } from "react-router-dom"; // add this
import JediEasterEgg from "./JediEasterEgg";

const backendBaseUrl = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://nyay-gpt.onrender.com";

// Supported Languages & Greetings
const languages = {
  english: {
    code: "en-IN",
    greeting: "Hello! I'm Sahayata AI — your AI legal assistant. Feel free to ask me any legal question.",
  },
  hindi: {
    code: "hi-IN",
    greeting: "नमस्ते! मैं सहायता AI हूँ — आपकी AI कानूनी सहायक। आप मुझसे कोई भी कानूनी सवाल पूछ सकते हैं।",
  },
  bhojpuri: {
    code: "hi-IN",
    greeting: "नमस्कार! हम सहायता AI बानी — रउआँ के AI कानूनी सहायक। रउआँ मुझसे कवनो कानून से जुड़ल सवाल पूछ सकत बानी।",
  },
  awadhi: {
    code: "hi-IN",
    greeting: "नमस्कार! हम सहायता AI हई — तोहार AI कानूनी सहायक। तोहसे कउनो कानून संबंधी सवाल पूछ सकत हउ।",
  },
  maithili: {
    code: "hi-IN",
    greeting: "नमस्कार! हम सहायता AI छी — अहाँक AI कानूनी सहायक। अहाँ हमरा सँ कोनो कानूनी प्रश्न पुछि सकै छी।",
  },
  marwari: {
    code: "hi-IN",
    greeting: "राम राम! म्हूं सहायता AI हूं — थां री AI कानून री सहायक। थां मने काई भी कानून री बात पूछ सको हो।",
  },
  chhattisgarhi: {
    code: "hi-IN",
    greeting: "जुहार! में सहायता AI अंव — तोर AI कानूनी सहायक। तंय मोला कऊनो कानूनी बात पूछ सके हस।",
  },
  haryanvi: {
    code: "hi-IN",
    greeting: "राम राम! मैं सहायता AI सूं — तेरी AI कानूनी सहायक। तू मन्ने कोई भी कानून का सवाल पूछ सके है।",
  },
  bundeli: {
    code: "hi-IN",
    greeting: "नमस्ते! हम सहायता AI हौं — तुम्हारी AI कानूनी सहायक। तुम हमसे कोई भी कानूनी सवाल पूछ सकत हौ।",
  },
  varhadi: {
    code: "mr-IN",
    greeting: "नमस्कार! मी सहाय्यता AI आहे — तुमची AI कायदेशीर सहाय्यक. तुम्ही मला कुठलाही कायद्याचा प्रश्न विचारू शकता.",
  },
  tulu: {
    code: "kn-IN",
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಸಹಾಯ AI — ನಿನ್ನ AI ಕಾನೂನು ಸಹಾಯಕಿ. ನೀನು ನನಗೆ ಯಾವುದೇ ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.",
  },
  konkani: {
    code: "hi-IN", // Note: A dedicated Konkani code like 'kok-IN' might be better if available for TTS.
    greeting: "नमस्कार! हांव सहाय्यता AI — तुमचो AI कायद्याचो मदतगार. तुमका कितेही कायद्यातले प्रश्न आसल्यार विचारू येता.",
  },
  santali: {
    code: "hi-IN", // Note: A dedicated Santali code like 'sat-IN' might be better if available for TTS.
    greeting: "Johar! In Sahayata AI dohon – abak AI kanun sahayak. Ape njel kanun then khasiyot leka kujhiye darai.",
  },
  sindhi: {
    code: "hi-IN", // Note: A dedicated Sindhi code like 'sd-IN' might be better if available for TTS.
    greeting: "سلام! مان سهاياطا AI آھيان – اوهانجو AI قانوني مددگار. اوھان مونکان ڪوبه قانوني سوال پڇي سگھو ٿا.",
  },
  punjabi: {
    code: "pa-IN",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਹਾਇਤਾ AI ਹਾਂ — ਤੁਹਾਡਾ AI ਕਾਨੂੰਨੀ ਸਹਾਇਕ। ਤੁਸੀਂ ਮੈਨੂੰ ਕੋਈ ਵੀ ਕਾਨੂੰਨੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
  },
  tamil: {
    code: "ta-IN",
    greeting: "வணக்கம்! நான் சஹாயதா AI — உங்கள் AI சட்ட உதவியாளர். நீங்கள் என்னிடம் எந்தவொரு சட்டக் கேள்வியையும் கேட்கலாம்.",
  },
  marathi: {
    code: "mr-IN",
    greeting: "नमस्कार! मी सहाय्यता AI आहे — तुमची AI कायदेशीर सहाय्यक. तुम्ही मला कोणताही कायदेशीर प्रश्न विचारू शकता.",
  },
  telugu: {
    code: "te-IN",
    greeting: "నమస్తే! నేను సహాయత AI — మీ AI న్యాయ సహాయకుడిని. మీరు నన్ను ఎలాంటి చట్ట సంబంధిత ప్రశ్నలు అడగవచ్చు.",
  },
  bengali: {
    code: "bn-IN",
    greeting: "নমস্কার! আমি সহায়তা AI — আপনার AI আইনি সহায়ক। আপনি আমাকে যেকোনো আইনি প্রশ্ন করতে পারেন।",
  },
  kannada: {
    code: "kn-IN",
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಸಹಾಯತ AI — ನಿಮ್ಮ AI ಕಾನೂನು ಸಹಾಯಕ. ನೀವು ನನಗೆ ಯಾವುದೇ ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.",
  },
  malayalam: {
    code: "ml-IN",
    greeting: "നമസ്കാരം! ഞാൻ സഹായത AI — നിങ്ങളുടെ AI നിയമ സഹായിയാണ്. നിങ്ങൾക്ക് എനിക്ക് നിയമപരമായ ചോദ്യങ്ങൾ ചോദിക്കാം.",
  },
  gujarati: {
    code: "gu-IN",
    greeting: "નમસ્તે! હું સહાયતા AI છું — તમારી AI કાનૂની સહાયક. તમે મને કોઈ પણ કાનૂની પ્રશ્ન પૂછી શકો છો.",
  },
  urdu: {
    code: "ur-IN",
    greeting: "السلام علیکم! میں سہایتا AI ہوں — آپ کا AI قانونی معاون۔ آپ مجھ سے کوئی بھی قانونی سوال پوچھ سکتے ہیں۔",
  },
  odia: {
    code: "or-IN",
    greeting: "ନମସ୍କାର! ମୁଁ ସହାୟତା AI — ଆପଣଙ୍କ AI ଆଇନିକ ସହାୟକ। ଆପଣ ମୋତେ କୌଣସି ଆଇନିକ ପ୍ରଶ୍ନ ପଚାରିପାରିବେ।",
  },
  dogri: {
    code: "hi-IN", // Note: A dedicated Dogri code might be better if available for TTS.
    greeting: "नमस्ते! मै सहायता AI हां — तुहाड़ी AI कानूनी सहायक। तुसीं मैनूं कोई वी कानूनी सवाल पुछ सकदे हो।",
  },
  manipuri: {
    code: "hi-IN", // Note: A dedicated Manipuri code like 'mni-IN' might be better if available for TTS.
    greeting: "ꯊꯥꯔꯦꯝ! ꯑꯩ ꯁꯍꯥꯌꯇꯥ AI ꯑꯃꯁꯤ — ꯅꯤꯡꯁꯤꯡꯅ ꯑꯩꯁꯤ ꯂꯥꯎꯟ ꯀꯥꯅꯨꯟ ꯑꯦꯁꯤꯁꯇꯦꯟꯠ ꯑꯃꯁꯤ. ꯃꯥꯔꯨꯞ ꯑꯅꯤ ꯀꯥꯅꯨꯟ ꯁꯨꯕ ꯇꯨꯡꯁꯤꯡ ꯄꯨꯁꯥꯟꯅꯁꯤ.",
  },
  nepali: {
    code: "hi-IN", // Note: A dedicated Nepali code like 'ne-NP' might be better if available for TTS.
    greeting: "नमस्कार! म सहायता AI हुँ — तपाईंको AI कानूनी सहायक। तपाईं मलाई कुनै पनि कानुनी प्रश्न सोध्न सक्नुहुन्छ।",
  },
  assamese: {
    code: "hi-IN", // Note: A dedicated Assamese code like 'as-IN' might be better if available for TTS.
    greeting: "নমস্কাৰ! মই সহায়তা AI — আপোনাৰ AI আইনী সহায়ক। আপুনি মোক যিকোনো আইনী প্ৰশ্ন কৰিব পাৰে।",
  },
  santhali: {
    code: "hi-IN", // Duplicate of santali, assuming this was a typo or different spelling.
    greeting: "Johar! In Sahayata AI dohon – abak AI kanun sahayak. Ape njel kanun then khasiyot leka kujhiye darai.",
  },
  bodo: {
    code: "hi-IN", // Note: A dedicated Bodo code might be better if available for TTS.
    greeting: "नमस्कार! आंनि मुङा सहायाता AI — नोंथांनि AI आनजिरि मददगिरि। नोंथांङा आंनाव जोबथा आनजिरि सोंनो हागोन।",
  },
  kashmiri: {
    code: "ur-IN", // Note: A dedicated Kashmiri code like 'ks-IN' might be better if available for TTS.
    greeting: "السلام علیکم! بہِ چھس سہاۓتا AI — توہہِنُد AI قانونی مَدَتھ گار۔ توہہِ ہیکِو میےِ کانہہ تہِ قانونی سوال کَرِتھ.",
  },
  ladakhi: {
    code: "hi-IN", // Note: A dedicated Ladakhi code might be better if available for TTS.
    greeting: "जूलय! ང་ सहायता AI ཡིན་ — ཁྱེད་ཀྱི་ AI ཁྲིམས་ཀྱི་རོགས་པ་། ཁྱེད་ཀྱིས་ང་ལ་ཁྲིམས་ཀྱི་དྲི་བ་གང་ཡང་དྲིས་ན་ཆོག།",
  },
  lepcha: {
    code: "hi-IN", // Note: A dedicated Lepcha code might be better if available for TTS.
    greeting: "Hello! I am Sahayata AI — your AI legal assistant. Feel free to ask me any legal question.", // Kept English as direct translation is complex without native speaker
  },
  mizo: {
    code: "bn-IN", // Note: A dedicated Mizo code like 'lus-IN' might be better if available for TTS.
    greeting: "Chibai! Kei chu Sahayata AI ka ni — in AI dan lam puihtu. Dan lam zawhna engmah min zawt thei ang.",
  },
  mundari: {
    code: "hi-IN", // Note: A dedicated Mundari code might be better if available for TTS.
    greeting: "Johar! In Sahayata AI redo – abak AI kânun sahayak. Ape inj then joñge kânun sawal puthe darai.",
  },
  bhili: {
    code: "hi-IN", // Note: A dedicated Bhili code might be better if available for TTS.
    greeting: "राम राम! मूँ सहायता AI सूं – ताहरा AI कानून रो सहायक। तू म्हूँ ने कोई भी कानून री बात पूंछ सके है।",
  },
  garo: {
    code: "bn-IN", // Note: A dedicated Garo code might be better if available for TTS.
    greeting: "Nambate! Ang Sahayata AI ong’a – nang’ni AI se ka’uni dakchakgipa. Nang’a angaoniko maina dakchakna gita sing’na man’gen.",
  },
  khasi: {
    code: "bn-IN", // Note: A dedicated Khasi code like 'kha-IN' might be better if available for TTS.
    greeting: "Khublei! Nga dei ka Sahayata AI — phi lah ban kyllih iano iano iaka jingkylli jong ka ain.",
  },
  nagamese: {
    code: "hi-IN", // Note: A dedicated Nagamese code might be better if available for TTS.
    greeting: "Namaskar! Moi Sahayata AI ase — apuni laga AI legal assistant. Apuni moi ke kuno legal question puche pari.",
  },
  kokborok: {
    code: "bn-IN", // Note: A dedicated Kokborok code like 'trp-IN' might be better if available for TTS.
    greeting: "Kwlwrwi! Ang Sahayata AI — nwng’ni AI kánunni dakhagripa. Nwng’a ang’ni sá’ka’bo kánunni jwngma kái jwng kái.",
  },
};


const languageKeywords = {
  english: ["english", "इंग्लिश", "अंग्रेजी"],
  hindi: ["hindi", "हिंदी", "हिन्दी"],
  punjabi: ["punjabi", "ਪੰਜਾਬੀ", "पंजाबी"],
  tamil: ["tamil", "तमिल", "தமிழ்"],
  marathi: ["marathi", "मराठी"],
  telugu: ["telugu", "तेलुगू", "తెలుగు"],
  bengali: ["bengali", "বেঙ্গলি", "বাঙালি", "बंगाली"],
  kannada: ["kannada", "ಕನ್ನಡ", "कन्नड़"],
  malayalam: ["malayalam", "മലയാളം", "मलयालम"],
  gujarati: ["gujarati", "ગુજરાતી", "गुजराती"],
  urdu: ["urdu", "اردو", "उर्दू"],
  odia: ["odia", "odiya", "ଓଡ଼ିଆ", "ओड़िया"],

  bhojpuri: ["bhojpuri", "भोजपुरी", "भोजपुरिया"],
  maithili: ["maithili", "मैथिली"],
  awadhi: ["awadhi", "अवधी"],
  bundeli: ["bundeli", "बुंदेली"],
  haryanvi: ["haryanvi", "हरियाणवी"],
  chhattisgarhi: ["chhattisgarhi", "छत्तीसगढ़ी"],
  marwari: ["marwari", "मारवाड़ी"],
  varhadi: ["varhadi", "वऱ्हाडी"],
  tulu: ["tulu", "ತುಳು", "तुलु"],
  konkani: ["konkani", "कोंकणी"],
  dogri: ["dogri", "डोगरी"],
  manipuri: ["manipuri", "মণিপুরী", "মণিপুরি", "মণিপুর", "মনিপুরি", "মণিপুরি ভাষা"],
  nepali: ["nepali", "नेपाली"],
  kashmiri: ["kashmiri", "कश्मीरी", "کشمیری"],
  assamese: ["assamese", "অসমীয়া", "असमिया"],
  santali: ["santali", "संथाली", "ᱥᱟᱱᱛᱟᱞᱤ"],
  sindhi: ["sindhi", "सिंधी", "سنڌي", "sindi"],
  bodo: ["bodo", "बोडो", "बर'"],
  // kashmiri: ["kashmiri", "कश्मीरी", "کشمیری"],
  ladakhi: ["ladakhi", "लद्दाखी"],
  lepcha: ["lepcha", "लेपचा"],
  mizo: ["mizo", "मिज़ो", "Mizo ṭawng"],
  mundari: ["mundari", "मुंडारी", "ᱢᱩᱱᱫᱟᱹᱨᱤ"],
  bhili: ["bhili", "भीली"],
  garo: ["garo", "गारो"],
  khasi: ["khasi", "खासी"],
  nagamese: ["nagamese", "नगामीज़", "নাগামীজ"],
  kokborok: ["kokborok", "कोकबोरोक", "কোকবোরোক"]

};


const initialGreeting =
  "आप कानूनी सहायता तक पहुँच चुके हैं। आपकी बेहतर मदद के लिए कृपया बताएं आपकी पसंदीदा भाषा क्या है? For example: Hindi, English, Gujrati.       You have accessed legal aid , for your better help , please tell us your preferred language for example english , hindi , gujrati"

const languageGreetings = {
  english: "Hi, I’m Seva, your legal assistant. How can I help you today? Let me know if it’s urgent or if you need legal guidance.",
  hindi: "हाय, मैं सेवा, आपकी कानूनी सहायक हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ? मुझे बताएं अगर यह जरूरी है या आपको कानूनी मार्गदर्शन चाहिए।",
  punjabi: "ਹਾਇ, ਮੈਂ ਸੇਵਾ, ਤੁਹਾਡੀ ਕਾਨੂੰਨੀ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ? ਮੈਨੂੰ ਦੱਸੋ ਜੇ ਇਹ ਜ਼ਰੂਰੀ ਹੈ ਜਾਂ ਤੁਹਾਨੂੰ ਕਾਨੂੰਨੀ ਮਾਰਗਦਰਸ਼ਨ ਦੀ ਲੋੜ ਹੈ।",
  tamil: "ஹாய், நான் சேவா, உங்கள் சட்ட உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? அவசரமானது அல்லது சட்ட வழிகாட்டுதல் தேவைப்பட்டால் எனக்குத் தெரியப்படுத்துங்கள்.",
  marathi: "हाय, मी सेवा, तुमची कायदेशीर सहाय्यिका. आज मी तुम्हाला कशी मदत करू शकते? ते अगत्याचे आहे किंवा कायदेशीर मार्गदर्शन आवश्यक असल्यास मला कळवा.",
  telugu: "హాయ్, నేను సేవ, మీ లీగల్ అసిస్టెంట్. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను? అత్యవసరమైనది లేదా చట్టపరమైన మార్గదర్శన అవసరమైతే నాకు తెలియజేయండి.",
  bengali: "হাই, আমি সেবা, আপনার আইনি সহকারী। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি? আমাকে জানান যদি এটি জরুরি হয় বা আপনার আইনি নির্দেশনা প্রয়োজন।",
  kannada: "ಹಾಯ್, ನಾನು ಸೇವಾ, ನಿಮ್ಮ ಕಾನೂನು ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ಅದು ತುರ್ತಾದಾಗ ಅಥವಾ ನೀವು ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ ಬೇಕಾದರೆ ನನಗೆ ತಿಳಿಸಿ.",
  malayalam: "ഹായ്, ഞാൻ സേവാ, നിങ്ങളുടെ നിയമ സഹായി. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും? അത് അടിയന്തരമാണെങ്കിലോ നിങ്ങൾക്ക് നിയമ മാർഗ്ഗനിർദ്ദേശം ആവശ്യമാണെങ്കിലോ എന്നെ അറിയിക്കുക.",
  gujarati: "હાય, હું સેવા, તમારી કાનૂની સહાયક. આજે હું તમારી કેવી રીતે મદદ કરી શકું? જો તે અત્યાવશ્યક હોય અથવા તમને કાનૂની માર્ગદર્શન જોઈતું હોય તો મને જણાવો.",
  urdu: "ہائے، میں سیوا، آپ کی قانونی معاون ہوں۔ آج میں آپ کی کیسے مدد کر سکتی ہوں؟ مجھے بتائیں اگر یہ فوری ہے یا آپ کو قانونی رہنمائی کی ضرورت ہے۔",
  odia: "ନମସ୍କାର, ମୁଁ ସେବା, ଆପଣଙ୍କର ଆଇନଗତ ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସହାୟତା କରିପାରିବି? ଯଦି ଏହା ଜରୁରୀ ଅଟେ କିମ୍ବା ଆପଣଙ୍କୁ ଆଇନଗତ ମାର୍ଗଦର୍ଶନ ଆବଶ୍ୟକ କରନ୍ତୁ ମୋତେ ଜଣାନ୍ତୁ।",
  bhojpuri: "हाय, हम सेवा हईं, आपके कानूनी सहायक। आज हम राउर कइसे मदद कर सकीले? बताईं जे जरूरी होखे या कानूनी सलाह के जरूरत होखे।",
  maithili: "नमस्कार, हम सेवा छी, अहाँक कानूनी सहायिका। आब हम अहाँक कहिन मदद कर सकैत छी? जँ अति जरूरी होय या कानूनी मार्गदर्शन के आवश्यकता होय तँ बताउ।",
  awadhi: "हाय, हम सेवा हईं, तोहार कानूनी सहायक। आज हम तोहार कइसन मदद कर सकीले? बताईं जे जरूरी हो या कानूनी सलाह के जरूरत हो।",
  bundeli: "हाय, हम सेवा, तोहार कानूनी सहायक। आज हम तोहार कइसन मदद कर सकीले? बताईं जे जरूरी हो या कानूनी सलाह के जरूरत हो।",
  haryanvi: "हाय, में सेवा, तेरी लीगल असिस्टेंट। आज में तेरे की मदद कर सकली सूं? बता दे अगर जरूरी हो या लीगल गाइडेंस चाही।",
  chhattisgarhi: "हाय, हम सेवा हवौं, तोहार लीगल असिस्टेंट। आज हम तोहार कइसन मदद कर सकीले? बताईं जे जरूरी हो या लीगल गाइडेंस चाही।",
  marwari: "हाय, हूं सेवा, थारी लीगल असिस्टेंट। आज हूं थारी कैसी मदद करू सकूं? बतावो जे जरूरी हो या लीगल गाइडेंस जोईए।",
  varhadi: "हाय, मी सेवा, तुमची लीगल असिस्टंट. आज मी तुमची कशी मदत करू शकते? सांगा जर ते अर्जंट असेल किंवा लीगल मार्गदर्शन हवं असेल.",
  tulu: "ಹಾಯ್, ನಾನ್ ಸೇವಾ, ನಿನ್ನ ಲೀಗಲ್ ಅಸಿಸ್ಟೆಂಟ್. ಇನಿ ನಾನ್ ನಿನಗ್ ಎಂಚ ಸಹಾಯ ಮಲ್ಪೊಲಿ? ತೂರ್ ಜರೂರು ಆಂಡ್ ಲಾ ಗೈಡೆನ್ಸ್ ಬೋಡಾಂಡ್ ತೆರಿಯಾಂತ್.",
  konkani: "हाय, हांव सेवा, तुजो लीगल असिस्टेंट. आयज हांव तुका कशें मजत करूं शकता? सांग जर तें अर्जेंट आसल्यार वा लीगल मार्गदर्शन जाय आसल्यार.",
  dogri: "हाय, मैं सेवा, तेरी लीगल असिस्टेंट। आज मैं तेरी किस तरां मदद कर सकदी आं? दस्सो जे जरूरी होवे या लीगल गाइडेंस चाहीदी होवे।",
  manipuri: "ꯍꯥꯏ, ꯑꯩꯍꯥꯛꯅꯥ ꯁꯦꯕꯥ, ꯅꯍꯥꯛꯀꯤ ꯂꯤꯒꯦꯜ ꯑꯦꯁꯤꯁ꯭ꯇꯦꯟꯇ꯫ ꯉꯁꯤ ꯑꯩꯍꯥꯛꯅꯥ ꯅꯍꯥꯛꯄꯨ ꯀꯔꯝꯅꯥ ꯃꯇꯦꯡ ꯄꯥꯡꯕꯥ ꯌꯥꯕ꯭ꯔꯥ? ꯑꯩꯍꯥꯛꯄꯨ ꯇꯥꯕꯤꯌꯨ ꯀꯧꯕꯥ ꯃꯇꯝꯗꯥ ꯅꯠꯇ꯭ꯔꯒꯥ ꯂꯤꯒꯦꯜ ꯒꯥꯏꯗꯦꯟꯁꯀꯤ ꯃꯊꯧ ꯇꯥꯕꯥ ꯉꯝꯕꯥ ꯑꯣꯏꯔꯀꯏ꯫",
  nepali: "नमस्कार, म सेवा, तपाईंको कानूनी सहयोगी। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु? मलाई थाहा दिनुहोस् यदि यो जरुरी छ वा तपाईंलाई कानूनी मार्गदर्शन चाहिन्छ भने।",
  assamese: "নমস্কাৰ, মই সেৱা, আপোনাৰ আইনগত সহায়ক। আজি মই আপোনাক কেনেদৰে সহায় কৰিব পাৰো? মোক জনাওক যদি ইয়াৰ জৰୁৰী বা আপুনি আইনগত পৰামৰ্শ বিচাৰে।",
  santali: "ᱦᱟᱭ, ᱤᱧ ᱥᱮᱵᱟ, ᱟᱢᱟᱜ ᱠᱟᱹᱱᱩᱱ ᱜᱚᱲᱚᱢ ᱦᱟᱯᱟᱴᱤᱭᱟᱹ᱾ ᱚᱱᱰᱮ ᱤᱧ ᱟᱢ ᱮᱢᱟᱱ ᱚᱠᱛᱮ ᱜᱚᱲᱚᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ? ᱤᱧ ᱮ ᱵᱟᱰᱟᱭ ᱢᱮ ᱡᱩᱫᱤ ᱱᱚᱶᱟ ᱟᱹᱰᱤ ᱜᱮᱭ ᱠᱟᱱᱟ ᱥᱮ ᱟᱢ ᱠᱟᱹᱱᱩᱱ ᱜᱚᱲᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱮ ᱠᱷᱚᱡᱟ᱾",
  sindhi: "هاءِ، مان سيوا، توهان جي قانوني مددگار. اڄ مان توهان جي ڪيئن مدد ڪري سگهان ٿو؟ مون کي ٻڌايو جيڪڏهن اهو ضروري آهي يا توهان کي قانوني رهنمائي جي ضرورت آهي.",
  bodo: "हाय, आं सेवा, नोंथांनि हेल्पारि। अन्दाइ आं नोंथांखौ माबोरै हेफाजाब होनो हागौ? आंखौ फोरमाय जुदि बेयारि जायो एबा नोंथांनि हेफाजाबनि गोनांथि जायो।",
  kashmiri: "ہیلو، میں سیوا، تہٕندِ قانونی معاون۔ اَز کٔرِہ تہٕندِ کیٖفَہ مدد کٔرِ؟ مَنٛز چھِ یہِ ضروری یا تہٕندِ قانونی رہنمائی چھِ ضرورت۔",
  ladakhi: "जुलेख्! आँ सेवा, नगे लीगल असिस्टेंट। दीक आँ नगे कथुक मद्दत करुगो? बतायिख् यदि जरूरी हो या लीगल गाइडेंस चाहिए।",
  lepcha: "Namaste, I am Seva from Sahayata AI. I'm your legal assistant. Could you tell me if you need legal help or if it's an emergency?",
  mizo: "Chibai! Ka hming Seva, Sahayata AI atangin. Inlahrin ka theihnghilh thei che, engtin nge ka pui theih ang che?",
  mundari: "Johar! Ang Seva kana, Sahayata AI se legal madad deta. Tum do kana kanoon ro sahay lagena?",
  bhili: "राम राम! में सेवा, सहयाता एआई से आपरी लीगल सहायिका हूं। आज में आपरी काईसी मदद कर सकूं?",
  garo: "Khublei! Nga la Seva, Sahayata AI na legal agent. Nangno dakani aidokani ma?",
  khasi: "Khublei, nga dei Seva na Sahayata AI. Sngewbha ong kumno nga lah iarap ha ka bynta jong ka ain?",
  nagamese: "Namaskar! Moi Seva ase Sahayata AI pora. Aaj moi apunar ki dhoronar legal help dibo parim?",
  kokborok: "Kwlwrwi! Ang Seva, Sahayata AI borok a. Ang baijani nai: borok kobor dokai nai?"
};



console.log(languageGreetings);



export default function MainLanding() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const apiCallInProgressRef = useRef(false)
  const timerRef = useRef(null)
  const utteranceIdRef = useRef(0)
  const [currentChatId, setCurrentChatId] = useState(chatId);
  // File upload states
  const [filePreview, setFilePreview] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [awaitingVoiceContext, setAwaitingVoiceContext] = useState(false);
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false)
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [readyToSpeak, setReadyToSpeak] = useState(false)
  const [timer, setTimer] = useState(0)
  const [currentLang, setCurrentLang] = useState("")
  const [langSelected, setLangSelected] = useState(false)
  const [recognitionKey, setRecognitionKey] = useState(0)
  const [history, setHistory] = useState([])
  const [policeStations, setPoliceStations] = useState([])
  const [userPos, setUserPos] = useState(null)
  const [showStations, setShowStations] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [phase, setPhase] = useState("init")
  const [callRequestLoading, setCallRequestLoading] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [advocates, setAdvocates] = useState([]);
  const [showAdvocates, setShowAdvocates] = useState(false);
  const [waitingForUserVoice, setWaitingForUserVoice] = useState(false);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const MAPS_EMBED_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
if (!chatId) {
      setHistory([]);
      setCurrentChatId(null); // ✅ Add this
      return;
    }
    setCurrentChatId(chatId);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const res = await fetch(`${backendBaseUrl}/history/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load chat");
        const data = await res.json();
        setHistory(data.chat.messages || []);
      } catch (err) {
        console.error("Chat fetch error:", err.message);
        setHistory([]);
      }
    };

    fetchChat();
  }, [chatId]);


  // Audio unlock for mobile devices
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const buffer = new AudioContext().createBuffer(1, 1, 22050)
        const source = new AudioContext().createBufferSource()
        source.buffer = buffer
        source.connect(new AudioContext().destination)
        source.start(0)
      } catch (e) {
        console.log("Audio unlock failed:", e)
      }
      document.removeEventListener("touchend", unlockAudio, true)
      document.removeEventListener("click", unlockAudio, true)
    }
    document.addEventListener("touchend", unlockAudio, true)
    document.addEventListener("click", unlockAudio, true)
    return () => {
      document.removeEventListener("touchend", unlockAudio, true)
      document.removeEventListener("click", unlockAudio, true)
    }
  }, [])

  // Speech recognition setup
  useEffect(() => {
    if (!connected) return
    if (muted || speaking) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Use the latest Chrome.")
      return
    }
    const langToUse = currentLang && languages[currentLang] ? languages[currentLang].code : "hi-IN"
    const recognition = new SpeechRecognition()
    recognition.lang = langToUse
    recognition.continuous = true
    recognition.interimResults = false

    let stoppedByApp = false

    recognition.onresult = async (event) => {
  if (muted || speaking || apiCallInProgressRef.current) return;

  setUserSpeaking(true);
  setWaitingForUserVoice(false); // Cancel Easter egg
  setReadyToSpeak(false);
  setTimeout(() => setUserSpeaking(false), 1200);
  recognition.stop();

      utteranceIdRef.current += 1;
      const thisUtterance = utteranceIdRef.current;
      const userSpeech = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();

      // Handle context input for document upload
      if (awaitingVoiceContext) {
        console.log("Voice context received:", userSpeech);
        setAwaitingVoiceContext(false);
        await handleFileAnalysis(userSpeech);
        return;
      }

      // Handle language selection phase
      if (phase === "askLang") {
        let detectedLang = null;
        Object.keys(languageKeywords).forEach((lang) => {
          languageKeywords[lang].forEach((keyword) => {
            if (userSpeech.includes(keyword)) {
              detectedLang = lang;
            }
          });
        });
        if (detectedLang) {
          setCurrentLang(detectedLang);
          setLangSelected(true);
          setRecognitionKey((k) => k + 1);
          setHistory([]);
          setPhase("normal");
          await speakText(languageGreetings[detectedLang], detectedLang);
          return;
        } else {
          await speakText(
            "कृपया अपनी पसंदीदा भाषा का नाम दोबारा बताएं। For example: Hindi, English, Tamil, etc.",
            "hindi"
          );
          setRecognitionKey((k) => k + 1);
          return;
        }
      }

      // Normal phase: handle user queries
      if (phase === "normal" && !apiCallInProgressRef.current) {
        apiCallInProgressRef.current = true;
        setSpeaking(true);

        // 1. Add user message to history
        const newHistory = [...history, { role: "user", content: userSpeech }];
        setHistory(newHistory);

        // 2. Save user message to backend
        const userMessageObj = { role: "user", content: userSpeech };
        const returnedChatId = await saveUserChat(userMessageObj, currentChatId);
        if (!currentChatId && returnedChatId) {
          // ✅ State update करें, setChatId नहीं
          setCurrentChatId(returnedChatId);
        }


        try {
          // 3. Call assistant API
          const res = await fetch(`${backendBaseUrl}/ask-context`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              history: newHistory,
              language: currentLang,
            }),
          });
          if (!res.ok) throw new Error(`Server responded with ${res.status}`);
          const data = await res.json();

          // 4. If this is still the latest utterance, process reply
          if (utteranceIdRef.current === thisUtterance && apiCallInProgressRef.current) {
            // Add assistant reply to history
            setHistory((h) => [...h, { role: "assistant", content: data.reply }]);

            // 5. Save assistant reply to backend
            const assistantMessageObj = { role: "assistant", content: data.reply };
            await saveUserChat(assistantMessageObj, currentChatId || returnedChatId);

            // 6. Speak reply and prepare for next
            await speakText(data.reply, currentLang);
            setRecognitionKey((k) => k + 1);
          }
        } catch (err) {
          console.error("API Error:", err);
          setSpeaking(false);
          setRecognitionKey((k) => k + 1);
        } finally {
          apiCallInProgressRef.current = false;
        }
      }
    };

    recognition.onend = () => {
      if (connected && !muted && !stoppedByApp && !speaking) {
        try {
          recognition.start()
        } catch (e) {
          console.log("Recognition restart failed:", e)
        }
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (e) {
      console.log("Recognition start failed:", e)
    }

    async function saveUserChat(messageObj, existingChatId = null) {
  console.log("saveUserChat called", messageObj, existingChatId, user);
  
  // ✅ User check सही करें
  if (!user?.token) {
    console.log("No user token available");
    return;
  }

  try {
    const res = await fetch(`${backendBaseUrl}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        chatId: existingChatId,
        message: messageObj,
      }),
    });
    
    const data = await res.json();
    
    // ✅ New chat के लिए navigate करें
    if (data.chatId && !existingChatId) {
      setCurrentChatId(data.chatId);
      // Navigate to new chat URL
      // navigate(`/chat/${data.chatId}`, { replace: true });
    }
    
    return data.chatId;
  } catch (err) {
    console.error("Failed to save chat:", err);
  }
}

    return () => {
      stoppedByApp = true
      recognition.stop()
    }
  }, [connected, muted, recognitionKey, speaking, phase, currentLang, history, awaitingVoiceContext])

  // Timer setup
  useEffect(() => {
    if (connected) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      setTimer(0)
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [connected])

  // File upload handlers
  const handleFileSelected = (file) => {
    console.log("File selected:", file.name);
    setUploadedFile(file);

    // For images, show a preview; for PDFs, just show file name
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(file.name);
    }

    setAwaitingVoiceContext(true);
  };

  const pauseListening = () => {
  setListeningPaused(true);
  setReadyToSpeak(false);
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
};

const resumeListening = () => {
  setListeningPaused(false);
  setReadyToSpeak(true);
  if (recognitionRef.current && connected && !muted) {
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("Recognition restart failed:", e);
    }
  }
};
  const handleClearFile = () => {
    setUploadedFile(null);
    setFilePreview("");
    setAwaitingVoiceContext(false);
    setLoading(false);
  };

  // FIXED: This function now properly triggers voice recognition
  const handleStartVoiceContext = () => {
    console.log("Starting voice context collection...");

    // If not connected, connect first
    if (!connected) {
      setConnected(true);
      setMuted(false);
      setLangSelected(true); // Skip language selection for file context
      setCurrentLang("hindi"); // Default to Hindi
      setPhase("normal");
      setRecognitionKey((k) => k + 1);
    }

    // Ensure we're ready to listen
    setAwaitingVoiceContext(true);
    setMuted(false);
    setSpeaking(false);
    setReadyToSpeak(true);

    // Restart recognition to ensure it's listening
    setRecognitionKey((k) => k + 1);

    // Provide audio feedback
    const contextPrompt = currentLang === "hindi"
      ? "कृपया अपनी दस्तावेज़ के बारे में चिंता बताएं"
      : "Please tell me your concern about this document";

    speakText(contextPrompt, currentLang || "hindi");
  };

  const handleFileAnalysis = async (contextText) => {
    console.log("Analyzing file with context:", contextText);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("context", contextText);
      formData.append("language", currentLang || "hindi");

      const res = await fetch(`${backendBaseUrl}/upload-legal-file`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("File analysis response:", data);

      if (data.reply) {
        // User message first
        const userMsg = { role: "user", content: `Document uploaded: ${uploadedFile.name}. Context: ${contextText}` };
        await saveUserChat(userMsg, chatId);

        // Assistant reply
        const assistantMsg = { role: "assistant", content: data.reply };
        await saveUserChat(assistantMsg, chatId);

        // Add to UI history
        setHistory((h) => [...h, userMsg, assistantMsg]);

        // Speak the reply automatically
        await speakText(data.reply, currentLang || "hindi");
      }

      // Clear file after analysis
      handleClearFile();

    } catch (error) {
      console.error("File analysis error:", error);
      const errorMessage = currentLang === "hindi"
        ? "दस्तावेज़ प्रोसेसिंग में त्रुटि हुई। कृपया दोबारा कोशिश करें।"
        : "Error processing document. Please try again.";

      await speakText(errorMessage, currentLang || "hindi");
      handleClearFile();
    } finally {
      setLoading(false);
    }
  };

  const handleMute = () => {
    setMuted((m) => !m)
    if (!muted) {
      recognitionRef.current?.stop()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      setSpeaking(false)
      setReadyToSpeak(false)
    } else {
      setRecognitionKey((k) => k + 1)
    }
  }

  const handleEnd = () => {
    setConnected(false)
    setMuted(false)
    setLangSelected(false)
    setCurrentLang("")
    setHistory([])
    setPoliceStations([])
    setUserPos(null)
    setShowStations(false)
    setSelectedStation(null)
    setPhase("init")
    setCallRequestLoading(false)
    setReadyToSpeak(false)
    // Clear file upload states
    handleClearFile()
    recognitionRef.current?.stop()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
    setSpeaking(false)
    apiCallInProgressRef.current = false
  }

  const speakText = async (text, langKey = currentLang || "hindi") => {
  console.log("🎤 Starting speech:", text.substring(0, 50) + "...")

  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop()
    } catch (e) { }
  }
  if (audioRef.current) {
    audioRef.current.pause()
    audioRef.current.src = ""
  }

  try {
    const res = await fetch(`${backendBaseUrl}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: langKey }),
    })

    if (!res.ok) {
      throw new Error(`TTS request failed: ${res.status}`)
    }

    const blob = await res.blob()
    const audioUrl = URL.createObjectURL(blob)
    const audio = new window.Audio(audioUrl)
    audioRef.current = audio

    audio.onended = () => {
      setSpeaking(false)
      setReadyToSpeak(true)
      // Trigger Easter egg after assistant finishes speaking
      if (text.includes("Let me know if it’s urgent or if you need legal guidance") || 
           text.includes("मुझे बताएं अगर यह जरूरी है या आपको कानूनी मार्गदर्शन चाहिए।")) {
        setWaitingForUserVoice(true)
      }
    }
    audio.onerror = (e) => {
      console.error("Audio playback error:", e)
      setSpeaking(false)
      setReadyToSpeak(true)
    }

    setSpeaking(true)
    setReadyToSpeak(false)
    try {
      await audio.play()
    } catch (err) {
      console.error("Audio play failed:", err)
      alert("Please tap anywhere on the screen to enable audio, then try again.")
      setSpeaking(false)
      setReadyToSpeak(false)
    }
  } catch (error) {
    console.error("TTS error:", error)
    setSpeaking(false)
    setReadyToSpeak(false)
  }
}

  const handleConnect = async () => {
    setConnected(true)
    setMuted(false)
    setLangSelected(false)
    setCurrentLang("")
    setRecognitionKey((k) => k + 1)
    setHistory([])
    setPoliceStations([])
    setUserPos(null)
    setSelectedStation(null)
    setPhase("askLang")
    await speakText(initialGreeting, "hindi")
    setRecognitionKey((k) => k + 1)
  }

  const handleNearbyPolice = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setUserPos({ lat: latitude, lng: longitude })
        try {
          const res = await fetch(`${backendBaseUrl}/nearby-police?lat=${latitude}&lng=${longitude}`)
          if (!res.ok) {
            throw new Error(`Failed to fetch police stations: ${res.status}`)
          }
          const data = await res.json()
          setPoliceStations(data.stations || [])
          setShowStations(true)
          setSelectedStation(null)
        } catch (e) {
          console.error("Police stations fetch error:", e)
          alert("Failed to fetch police stations. Please try again.")
        }
      },
      (err) => {
        console.error("Geolocation error:", err)
        alert("Location permission denied or unavailable")
      },
    )
  }


  const handleNearbyAdvocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(`${backendBaseUrl}/nearby-advocate?lat=${latitude}&lng=${longitude}`)
          if (!res.ok) {
            throw new Error(`Failed to fetch advocates: ${res.status}`)
          }
          const data = await res.json()
          setAdvocates(data.advocates || [])
          setShowAdvocates(true)
          setSelectedAdvocate(null)
        } catch (e) {
          console.error("Advocates fetch error:", e)
          alert("Failed to fetch advocates. Please try again.")
        }
      },
      (err) => {
        console.error("Geolocation error:", err)
        alert("Location permission denied or unavailable")
      },
    )
  }

  const handleRequestCall = () => {
    const savedPhone = localStorage.getItem("sevagpt_user_phone")
    if (savedPhone) {
      setPhoneNumber(savedPhone)
    }
    setShowPhoneModal(true)
  }

  const submitCallRequest = async () => {
    if (callRequestLoading) return

    if (!phoneNumber.trim()) {
      alert("Please enter your phone number")
      return
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
      alert("Please enter a valid phone number with country code")
      return
    }

    setCallRequestLoading(true)

    try {
      localStorage.setItem("sevagpt_user_phone", phoneNumber)

      const requestBody = {
        phone: phoneNumber.replace(/\s+/g, ""),
        topic: "Legal Help",
        language: currentLang || "hindi",
      }

      const res = await fetch(`${backendBaseUrl}/request-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const responseText = await res.text()

      if (res.ok) {
        alert("✅ Call request sent successfully. You should receive a call shortly.")
        setShowPhoneModal(false)
      } else {
        console.error("Call request failed:", res.status, responseText)
        alert(`❌ Call request failed: ${responseText || "Unknown error"}. Please try again.`)
      }
    } catch (error) {
      console.error("Call request error:", error)
      alert("❌ Network error. Please check your connection and try again.")
    } finally {
      setCallRequestLoading(false)
    }
  }

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`


  // const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive style helpers
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Overlay for mobile menus/sidebar
  const [overlayActive, setOverlayActive] = useState(false);

  // Modified hamburger menu logic for proper z-index and overlay
  const openMenu = () => {
    setMenuOpen(true);
    setOverlayActive(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setOverlayActive(false);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    nav: {
      background: "rgba(17, 24, 39, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "1.2rem 2rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      position: "relative",
      zIndex: 100,
      width: "100%",
    },
    container: {
      maxWidth: "64rem",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: "3.5rem",
    },
    logoWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.85rem",
      height: "3rem",
    },
    logoImg: {
      width: "3rem",
      height: "3rem",
      borderRadius: "0.5rem",
      objectFit: "contain",
      backgroundColor: "#000",
    },
    logoText: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      letterSpacing: "0.01em",
      color: "#fff",
      margin: 0,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: "1.2rem",
    },
    hamburger: {
      display: isMobile ? "flex" : "none",
      flexDirection: "column",
      cursor: "pointer",
      gap: "5px",
      marginLeft: "auto",
    },
    bar: {
      width: "25px",
      height: "3px",
      backgroundColor: "#fff",
      borderRadius: "2px",
    },
    desktopMenu: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: "1rem",
    },
    mobileMenu: {
      display: menuOpen ? "flex" : "none",
      flexDirection: "column",
      position: "absolute",
      top: "100%",
      right: "0.5rem",
      left: "auto",
      background: "rgba(17,24,39,0.97)",
      borderRadius: "1rem",
      padding: "0.75rem 1.2rem",
      zIndex: 110,
      marginTop: "0.35rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
      minWidth: "160px",
      alignItems: "stretch",
    },
    authButtons: {
      display: "flex",
      gap: "1rem",
      flexDirection: isMobile ? "column" : "row",
    },
    loginBtn: {
      background: "rgba(23, 171, 225, 0.38)",
      color: "#fff",
      border: "1.5px solid rgba(99,102,241,0.25)",
      borderRadius: "1rem",
      padding: "0.6rem 1.5rem",
      fontWeight: 700,
      fontSize: "1rem",
      backdropFilter: "blur(12px)",
      cursor: "pointer",
    },
    signupBtn: {
      background: "rgba(6, 136, 110, 0.54)",
      color: "#fff",
      border: "1.5px solid rgba(28, 211, 113, 0.51)",
      borderRadius: "1rem",
      padding: "0.6rem 1.5rem",
      fontWeight: 700,
      fontSize: "1rem",
      backdropFilter: "blur(12px)",
      cursor: "pointer",
    },
    statusBox: {
      fontSize: "0.95rem",
      color: "rgba(255,255,255,0.88)",
      background: "rgba(255,255,255,0.10)",
      padding: "0.5rem 1.25rem",
      borderRadius: "1rem",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.10)",
      fontWeight: 500,
      marginBottom: "0.75rem",
      marginTop: isMobile ? "1rem" : "0",
      width: isMobile ? "90%" : "auto",
      marginLeft: isMobile ? "auto" : 0,
      marginRight: isMobile ? "auto" : 0,
      textAlign: "center",
      display: "block",
    },
    userDropdownTrigger: {
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    dropdown: {
  position: "absolute",
  top: "100%",
  right: 0,
  background: "transparent", // Changed to transparent
  borderRadius: "0", // Removed rounded corners for a less "bubbly" look
  marginTop: "0.5rem",
  padding: "0", // Removed padding to eliminate the space creating the "bubble"
  zIndex: 20,
},
    logoutBtn: {
  // Make background more opaque and solid red
  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)",
  color: "#FFFFFF", // Pure white for crisp text and emoji
  // Subtle white border for contrast against the solid red
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "0.75rem",
  padding: "0.6rem 1.2rem",
  fontWeight: 600,
  cursor: "pointer",
  // Removed backdropFilter to eliminate the transparent white blur effect
  backdropFilter: "none",
  // Refined boxShadow for subtle depth on a solid button
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  transition: "all 0.3s ease", // Smooth transition for hover effects
},
    menu: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    menuOpen: {
      flexDirection: "column",
      width: "100%",
      paddingTop: "1rem",
      display: "flex",
    },
  };

  // 🔁 Media query styles for mobile hamburger menu
  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) {
      styles.menu.display = "none";
      styles.hamburger.display = "flex";
      styles.menuOpen.display = "flex";
    }
  }

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A192F 0%, #002B36 100%)", // Updated to the dark theme gradient
    color: "#ffffff",
    display: "flex",
    flexDirection: "row", // THIS IS IMPORTANT - Retained as requested
    position: "relative",
    width: "100vw"
  }}
    >
      {/* Sidebar - always rendered, but visible only when open */}
      <ChatHistorySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0, position: "relative", overflow: "auto" }}>
        {/* Sidebar Open Button (floating, only visible if sidebar is closed) */}

        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(76, 3, 184, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(7, 136, 182, 0.05) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        /> 

        {/* Glassmorphism Navbar */}
        <>
  <nav style={styles.nav}>
    <div style={styles.container}>
      {/* Left: Logo + Title */}
      <div style={styles.logoWrapper}>
        <img
          src="/logo.jpg"
          alt="Logo"
          style={{
            ...styles.logoImg, // Keep all existing styles from styles.logoImg
            border: "2px solid #00D3C3", // Add a static teal border
            boxShadow: "0 0 10px rgba(1, 229, 206, 0.66)", // Add a static teal glow
            
          }}
        />
        <h1 style={styles.logoText}>Sahayata AI</h1>
      </div>

      {/* Center: Status (desktop only) */}
      {!isMobile && (
        <div style={styles.statusBox}>
          {connected ? `Connected • ${formatTime(timer)}` : "Ready to Connect"}
        </div>
      )}

      {/* Right: Hamburger (mobile) or Auth menu (desktop) */}
      <div style={styles.right}>
        {/* Hamburger (mobile only) */}
        <div
          className="hamburger"
          onClick={menuOpen ? closeMenu : openMenu}
          style={styles.hamburger}
          aria-label="Open menu"
        >
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
        </div>

        {/* Desktop Auth Menu */}
        <div className="authMenu" style={styles.desktopMenu}>
          {user ? (
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                style={styles.userDropdownTrigger}
              >
                 <img 
  src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" 
  style={{ width: '40px', height: '40px', marginRight: '5px' }} 
/> {user.name}{user.name}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {menuOpen && (
                <div style={styles.dropdown}>
  <div style={styles.dropdown}>
  <button
    onClick={handleLogout}
    style={styles.logoutBtn}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "linear-gradient(135deg, rgba(200, 30, 30, 1) 0%, rgba(160, 20, 20, 1) 100%)"; // Fully opaque on hover
      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
      e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.5)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)"; // Back to near-opaque
      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.4)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
   Logout
  </button>
</div>
</div>
              )}
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button style={styles.loginBtn}>Login</button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button style={styles.signupBtn}>Sign Up</button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Auth Menu */}
        {isMobile && menuOpen && (
          <div style={styles.mobileMenu}>
            {user ? (
              <>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    padding: "0.5rem 1rem",
                    marginBottom: "0.25rem",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <img 
  src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" 
  style={{ width: '40px', height: '40px', marginRight: '5px' }} 
/> {user.name}
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                   Logout
                </button>
              </>
            ) : (
              <div style={styles.authButtons}>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button style={styles.loginBtn}>Login</button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button style={styles.signupBtn}>Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </nav>

  {/* Status: mobile below nav */}
  {isMobile && (
    <div style={styles.statusBox}>
      {connected ? `Connected • ${formatTime(timer)}` : "Ready to Connect"}
    </div>
  )}
</>


        {/* Main Content (your existing layout) */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ width: "100%", maxWidth: "28rem", margin: "0 auto" }}>
            {/* Glassmorphism Status Card */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "4.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div style={{ fontSize: "1.125rem", color: "#ffffff", marginBottom: "0.5rem", fontWeight: "600" }}>
                {connected ? "Connected - Ready to Help" : "Your AI Legal Assistant"}
              </div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {speaking && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <FaVolumeUp style={{ color: "#60a5fa" }} />
                    <span>Sahayata AI is speaking...</span>
                  </div>
                )}
                {userSpeaking && "👂 Listening..."}
                {awaitingVoiceContext && "🎤 Tell me about your legal concern with this document"}
                {!speaking && !userSpeaking && !readyToSpeak && !awaitingVoiceContext && connected && "Ready for your question"}
                {!connected && "Tap the microphone to start"}
              </div>
            </div>

            {/* File Upload Component */}
            <FileUpload
              onFileSelected={handleFileSelected}
              uploadedFile={uploadedFile}
              filePreview={filePreview}
              loading={loading}
              onClearFile={handleClearFile}
              awaitingVoiceContext={awaitingVoiceContext}
              onStartVoiceContext={handleStartVoiceContext}
            />



            {/* Main Microphone */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
              <div style={{ position: "relative" }}>
                {/* Microphone Button */}
                <button
                  onClick={connected ? handleEnd : handleConnect}
                  style={{
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "50%",
                    border: readyToSpeak ? "3px solid rgba(248, 113, 113, 0.8)" : "3px solid rgba(255, 255, 255, 0.2)",
                    background: readyToSpeak
                      ? "linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)"
                      : "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: readyToSpeak
                      ? "0 0 40px rgba(248, 113, 113, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!readyToSpeak) {
                      e.target.style.background = "rgba(255, 255, 255, 0.15)"
                      e.target.style.transform = "scale(1.05)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!readyToSpeak) {
                      e.target.style.background = "rgba(255, 255, 255, 0.1)"
                      e.target.style.transform = "scale(1)"
                    }
                  }}
                >
                  {connected ? (
                    userSpeaking ? (
                      <FaMicrophone
                        style={{
                          width: "3rem",
                          height: "3rem",
                          color: "#ffffff",
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                        }}
                      />
                    ) : (
                      <FaMicrophoneSlash
                        style={{
                          width: "3rem",
                          height: "3rem",
                          color: "#ffffff",
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                        }}
                      />
                    )
                  ) : (
                    <FaMicrophone
                      style={{
                        width: "3rem",
                        height: "3rem",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  )}
                </button>

                {/* Speaking Animation Waves */}
                {speaking && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          width: "8rem",
                          height: "8rem",
                          border: "2px solid rgba(96, 165, 250, 0.6)",
                          borderRadius: "50%",
                          animation: "ping 2s infinite",
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Red Pulse when ready to speak */}
                {readyToSpeak && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: "9rem",
                        height: "9rem",
                        border: "2px solid rgba(248, 113, 113, 0.8)",
                        borderRadius: "50%",
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Text */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              {connected ? (
                userSpeaking ? (
                  <p style={{ color: "#f87171", fontWeight: "500", margin: 0 }}>
                    <FaMicrophone style={{ marginRight: "0.5rem" }} />
                    Speak now...
                  </p>
                ) : speaking ? (
                  <p style={{ color: "#60a5fa", fontWeight: "500", margin: 0 }}>
                    {/* <FaVolumeUp style={{ marginRight: "0.5rem" }} /> */}
                    Sahayata AI is speaking...
                  </p>
                ) : readyToSpeak ? (
                  <p
                    style={{
                      color: "#f87171",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      margin: 0,
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <FaMicrophone style={{ color: "#f87171" }} />
                    SPEAK NOW
                  </p>
                ) : awaitingVoiceContext ? (
                  <p style={{ color: "#60a5fa", fontWeight: "500", margin: 0 }}>
                    Tell me about your legal concern with this document
                  </p>
                ) : (
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>Ask your legal question</p>
                )
              ) : (
                <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>Tell your legal issue</p>
              )}
            </div>

            {/* Glassmorphism Control Buttons */}
            {!connected ? (
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                <button
                    onClick={handleNearbyPolice}
                    className="btn-3d"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                  <FaMapMarkerAlt style={{ width: "1.5rem", height: "1.5rem", color: "#60a5fa" }} />
                  <span style={{ color: "white" }}>Nearby Police</span>
                </button>

                <button
                    onClick={handleRequestCall}
                    className="btn-3d"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                  <FaMapMarkerAlt style={{ width: "1.5rem", height: "1.5rem", color: "#60a5fa" }} />
                  <span style={{ color: "white" }}>Request Call</span>
                </button>

                <button
                    onClick={handleNearbyAdvocate}
                    className="btn-3d"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                  <FaMapMarkerAlt style={{ width: "1.5rem", height: "1.5rem", color: "#60a5fa" }} />
                  <span style={{ color: "white" }}>Nearby Advocate</span>
                </button>

              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
                <button
                  onClick={handleMute}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    borderRadius: "1rem",
                    transition: "all 0.3s ease",
                    background: muted
                      ? "linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)"
                      : "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: muted ? "1px solid rgba(248, 113, 113, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {muted ? (
                    <FaMicrophoneSlash
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  ) : (
                    <FaMicrophone
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  )}
                  <span style={{ fontSize: "0.875rem", color: "#ffffff", fontWeight: "500" }}>
                    {muted ? "Unmute" : "Mute"}
                  </span>
                </button>

                <button
  onClick={handleNearbyPolice}
  className="btn-3d"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    transformStyle: "preserve-3d",
  }}
>
  <FaMapMarkerAlt style={{ width: "1.5rem", height: "1.5rem", color: "#60a5fa" }} />
  <span style={{ color: "white" }}>Nearby Police</span>
                </button>

                <button
                  onClick={handleEnd}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    background: "linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "1rem",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(248, 113, 113, 0.3)",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "0 8px 32px rgba(220, 38, 38, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, rgba(185, 28, 28, 0.9) 0%, rgba(220, 38, 38, 0.7) 100%)"
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 12px 40px rgba(220, 38, 38, 0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)"
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 8px 32px rgba(220, 38, 38, 0.3)"
                  }}
                >
                  <FaPhone
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#ffffff",
                      transform: "rotate(225deg)",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#ffffff", fontWeight: "500" }}>End</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Glassmorphism Phone Number Modal */}
        {showPhoneModal && (
          <div
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: "50",
            }}
          >
            <div
              style={{
                background: "rgba(17, 24, 39, 0.9)",
                backdropFilter: "blur(30px)",
                borderRadius: "1.5rem",
                padding: "2rem",
                width: "100%",
                maxWidth: "24rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#ffffff", margin: 0 }}>Request Call</h3>
                <button
  onClick={() => setShowPhoneModal(false)}
  className="btn-3d"
  style={{
    color: "rgba(255, 255, 255, 0.6)",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    transformStyle: "preserve-3d",
  }}
>
  <FaTimes />
</button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.75rem",
                    color: "#ffffff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(96, 165, 250, 0.5)"
                    e.target.style.background = "rgba(255, 255, 255, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.target.style.background = "rgba(255, 255, 255, 0.1)"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  style={{
                    flex: "1",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.15)"
                    e.target.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitCallRequest}
                  disabled={callRequestLoading}
                  style={{
                    flex: "1",
                    padding: "0.75rem",
                    background: callRequestLoading
                      ? "rgba(75, 85, 99, 0.8)"
                      : "linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)",
                    backdropFilter: "blur(10px)",
                    color: "#ffffff",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "0.75rem",
                    cursor: callRequestLoading ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    outline: "none",
                    opacity: callRequestLoading ? 0.6 : 1,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!callRequestLoading) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgba(5, 150, 105, 0.9) 0%, rgba(4, 120, 87, 1) 100%)"
                      e.target.style.transform = "translateY(-1px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!callRequestLoading) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)"
                      e.target.style.transform = "translateY(0)"
                    }
                  }}
                >
                  {callRequestLoading ? "Requesting..." : "Request Call"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Glassmorphism Police Stations Modal */}
        {showStations && (
          <div
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: "50",
            }}
          >
            <div
              style={{
                background: "rgba(17, 24, 39, 0.9)",
                backdropFilter: "blur(30px)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "28rem",
                maxHeight: "24rem",
                overflowY: "auto",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#ffffff", margin: 0 }}>
                  Nearby Police Stations
                </h3>
                <button
                  onClick={() => {
                    setShowStations(false)
                    setSelectedStation(null)
                  }}
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff"
                    e.target.style.background = "rgba(255, 255, 255, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.6)"
                    e.target.style.background = "transparent"
                  }}
                >
                  <FaTimes style={{ width: "1.25rem", height: "1.25rem" }} />
                </button>
              </div>

              {policeStations.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {policeStations.map((station, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedStation(station)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.75rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "0.75rem",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        cursor: "pointer",
                        outline: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.1)"
                        e.target.style.transform = "translateY(-1px)"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.05)"
                        e.target.style.transform = "translateY(0)"
                      }}
                    >
                      <div style={{ fontWeight: "500", color: "#ffffff", marginBottom: "0.25rem" }}>{station.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)" }}>{station.vicinity}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.6)", padding: "2rem 0" }}>
                  No nearby police stations found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Glassmorphism Directions Modal */}
        {selectedStation && userPos && (
          <div
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: "50",
            }}
          >
            <div
              style={{
                background: "rgba(17, 24, 39, 0.9)",
                backdropFilter: "blur(30px)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "48rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#ffffff", margin: 0 }}>
                  Directions to <span style={{ color: "#60a5fa" }}>{selectedStation.name}</span>
                </h3>
                <button
                  onClick={() => setSelectedStation(null)}
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff"
                    e.target.style.background = "rgba(255, 255, 255, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.6)"
                    e.target.style.background = "transparent"
                  }}
                >
                  <FaTimes style={{ width: "1.25rem", height: "1.25rem" }} />
                </button>
              </div>

              {MAPS_EMBED_API_KEY ? (
                <iframe
                  width="100%"
                  height="400"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: "1rem" }}
                  allowFullScreen
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${MAPS_EMBED_API_KEY}&origin=${userPos.lat},${userPos.lng}&destination=${selectedStation.lat},${selectedStation.lng}&mode=driving`}
                  title="Directions Map"
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#f87171",
                    padding: "2rem 0",
                    background: "rgba(248, 113, 113, 0.1)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                  }}
                >
                  API Key missing. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.
                </div>
              )}
            </div>
          </div>
        )}

        <div>


          {/* Glassmorphism Advocates Modal */}
          {showAdvocates && (
            <div
              style={{
                position: "fixed",
                inset: "0",
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: "50",
              }}
            >
              <div
                style={{
                  background: "rgba(17,24,39,0.9)",
                  borderRadius: "1.5rem",
                  padding: "1.5rem",
                  width: "100%",
                  maxWidth: "28rem",
                  maxHeight: "24rem",
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, color: "#fff" }}>Nearby Advocates</h3>
                  <button
                    onClick={() => {
                      setShowAdvocates(false);
                      setSelectedAdvocate(null);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                {advocates.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {advocates.map((advocate, i) => (
                      <div
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "0.75rem",
                          padding: "0.75rem",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (userPos && advocate.lat && advocate.lng) {
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${advocate.lat},${advocate.lng}&travelmode=driving`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <div style={{ fontWeight: "500", color: "#fff" }}>{advocate.name}</div>
                        <div style={{ fontSize: "0.875rem", color: "#ccc" }}>{advocate.vicinity}</div>
                        <div style={{ fontSize: "0.85rem", color: "#a7f3d0" }}>
                          📞 {advocate.phone && advocate.phone !== "Not available"
                            ? (
                              <a
                                href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`}
                                style={{ color: "#34d399", textDecoration: "underline", fontWeight: 600 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {advocate.phone}
                              </a>
                            )
                            : "Not available"}
                        </div>
                        <div style={{ marginTop: "0.5rem" }}>
                          <button
                            style={{
                              background: "#fbbf24",
                              color: "#2d2d2d",
                              borderRadius: "0.5rem",
                              padding: "0.25rem 0.75rem",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              border: "none",
                              cursor: "pointer"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAdvocate(advocate);
                            }}
                          >
                            Tap for Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#aaa", padding: "2rem 0" }}>
                    No nearby advocates found.
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedAdvocate && (
            <div
              style={{
                position: "fixed",
                inset: "0",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "60",
              }}
              onClick={() => setSelectedAdvocate(null)}
            >
              <div
                style={{
                  background: "#1f2937",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  width: "98%",
                  maxWidth: "500px",
                  color: "#fff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h4 style={{ margin: 0 }}>{selectedAdvocate.name}</h4>
                  <button
                    onClick={() => setSelectedAdvocate(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                      paddinf: "0.5rem"
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                <p style={{ margin: "0 0 0.5rem" }}>
                  📍 <strong>Address:</strong> {selectedAdvocate.vicinity}
                </p>
                <p style={{ margin: "0 0 1rem" }}>
                  📞 <strong>Phone:</strong>{" "}
                  {selectedAdvocate.phone && selectedAdvocate.phone !== "Not available"
                    ? (
                      <a
                        href={`tel:${selectedAdvocate.phone.replace(/[^0-9+]/g, '')}`}
                        style={{
                          color: "#34d399",
                          textDecoration: "underline",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent closing modal
                        }}
                      >
                        {selectedAdvocate.phone}
                      </a>
                    )
                    : "Not available"}
                </p>


                {MAPS_EMBED_API_KEY && (
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedAdvocate.lat},${selectedAdvocate.lng}&zoom=17&size=1000x700&markers=color:red%7C${selectedAdvocate.lat},${selectedAdvocate.lng}&key=${MAPS_EMBED_API_KEY}`}
                    alt="Map preview"
                    style={{
                      borderRadius: "0.5rem",
                      width: "100%",
                      marginBottom: "1rem",
                      display: "block"
                    }}
                  />
                )}

                <button
                  style={{
                    background: "#fbbf24",
                    color: "#2d2d2d",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={() => {
                    if (selectedAdvocate.lat && selectedAdvocate.lng) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAdvocate.name + ', ' + selectedAdvocate.vicinity)}`, '_blank');
                    }
                  }}
                >
                  Open Directions in Google Maps
                </button>
              </div>
            </div>
          )}
          {/* Fixed WhatsApp Button */}
          
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      <JediEasterEgg 
  triggerActive={waitingForUserVoice && !easterEggTriggered}
  onDismiss={() => {
    setEasterEggTriggered(true);
    setWaitingForUserVoice(false);
  }}
/>
      </div>
    </div>
  )
}