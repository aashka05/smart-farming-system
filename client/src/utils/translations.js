/**
 * Static translation dictionaries for Hindi (hi) and Gujarati (gu).
 *
 * Key   = exact English string used in useMemo blocks across the app.
 * Value = translated string.
 *
 * useTranslation hook performs a synchronous dictionary look-up so
 * translations are instant, reliable, and work without any backend API.
 */

const translations = {
  /* ───────────────────── HINDI ───────────────────── */
  hi: {
    // ── Navbar ──
    'Home': 'होम',
    'Weather': 'मौसम',
    'Disease': 'रोग',
    'Crops': 'फसलें',
    'Market': 'बाज़ार',
    'Tutorials': 'ट्यूटोरियल',
    'About Us': 'हमारे बारे में',
    'Login': 'लॉगिन',

    // ── Footer ──
    'AI-Powered Smart Farming Platform helping farmers make better decisions with weather insights, crop recommendations, and market intelligence.':
      'AI-संचालित स्मार्ट खेती प्लेटफ़ॉर्म जो किसानों को मौसम की जानकारी, फसल सिफारिशों और बाज़ार बुद्धिमत्ता से बेहतर निर्णय लेने में मदद करता है।',
    'Quick Links': 'त्वरित लिंक',
    'Dashboard': 'डैशबोर्ड',
    'Contact Us': 'संपर्क करें',
    'Weather Updates': 'मौसम अपडेट',
    'Crop Recommendation': 'फसल सिफारिश',
    'Disease Info': 'रोग जानकारी',
    'Market Prices': 'बाज़ार भाव',
    'About & Contact': 'हमारे बारे में और संपर्क',
    'Overview': 'अवलोकन',
    'Crop Health': 'फसल स्वास्थ्य',
    'Yield Prediction': 'उपज पूर्वानुमान',
    'Irrigation Advisory': 'सिंचाई सलाह',
    'AI Chatbot': 'AI चैटबॉट',
    'Smart Farming Platform. Built with \u2764\uFE0F for Indian Farmers.':
      'स्मार्ट खेती प्लेटफ़ॉर्म। भारतीय किसानों के लिए \u2764\uFE0F से बनाया गया।',

    // ── Home – Hero ──
    'AI Powered': 'AI संचालित',
    'Smart Farming': 'स्मार्ट खेती',
    'Platform': 'प्लेटफ़ॉर्म',
    "Farming shouldn't depend on guesswork. Our platform helps farmers predict weather changes, detect crop diseases early, and make better market decisions using simple AI-powered tools.":
      'खेती अनुमान पर निर्भर नहीं होनी चाहिए। हमारा प्लेटफ़ॉर्म किसानों को मौसम परिवर्तन की भविष्यवाणी करने, फसल रोगों का जल्दी पता लगाने और सरल AI-संचालित उपकरणों का उपयोग करके बेहतर बाज़ार निर्णय लेने में मदद करता है।',
    'Get Started': 'शुरू करें',
    'Learn More': 'और जानें',
    'Free to Use': 'उपयोग में मुफ़्त',
    'For Indian Farmers': 'भारतीय किसानों के लिए',

    // ── Home – Problems ──
    'The Problem We Solve': 'हम जो समस्या हल करते हैं',
    'Indian farmers face critical challenges that can be solved with technology':
      'भारतीय किसानों को गंभीर चुनौतियों का सामना करना पड़ता है जिन्हें तकनीक से हल किया जा सकता है',
    'Our Solutions': 'हमारे समाधान',
    'Unpredictable Weather': 'अप्रत्याशित मौसम',
    'Sudden weather changes destroy crops and reduce yield without timely warnings.':
      'अचानक मौसम परिवर्तन समय पर चेतावनी के बिना फसलों को नष्ट कर देते हैं और उपज कम कर देते हैं।',
    'Crop Diseases': 'फसल रोग',
    'Late identification of diseases causes massive crop losses every season.':
      'रोगों की देर से पहचान हर मौसम में भारी फसल नुकसान का कारण बनती है।',
    'Market Price Uncertainty': 'बाज़ार मूल्य अनिश्चितता',
    'Farmers sell at low prices due to lack of real-time market information.':
      'वास्तविक समय बाज़ार जानकारी की कमी के कारण किसान कम कीमतों पर बेचते हैं।',

    // ── Home – Solutions ──
    'Weather Alerts': 'मौसम अलर्ट',
    'Get real-time weather notifications with farming-specific action recommendations.':
      'खेती-विशिष्ट कार्य सिफारिशों के साथ वास्तविक समय मौसम सूचनाएं प्राप्त करें।',
    'AI Farming Assistant': 'AI खेती सहायक',
    'AI chatbot that answers farming questions and provides expert guidance 24/7.':
      'AI चैटबॉट जो खेती के सवालों का जवाब देता है और 24/7 विशेषज्ञ मार्गदर्शन प्रदान करता है।',
    'Data-driven crop suggestions that match your soil, weather, and market conditions.':
      'डेटा-संचालित फसल सुझाव जो आपकी मिट्टी, मौसम और बाज़ार स्थितियों से मेल खाते हैं।',
    'Market Insights': 'बाज़ार अंतर्दृष्टि',
    'Live mandi prices with trends so you can sell crops at the best time and price.':
      'रुझानों के साथ लाइव मंडी भाव ताकि आप सबसे अच्छे समय और कीमत पर फसल बेच सकें।',

    // ── Home – Features ──
    'Key Features': 'मुख्य विशेषताएं',
    'Everything a modern farmer needs, powered by technology':
      'एक आधुनिक किसान को जो कुछ भी चाहिए, तकनीक द्वारा संचालित',
    'Weather Forecast': 'मौसम पूर्वानुमान',
    'Real-time weather updates with farming-specific insights and alerts for your region.':
      'आपके क्षेत्र के लिए खेती-विशिष्ट अंतर्दृष्टि और अलर्ट के साथ वास्तविक समय मौसम अपडेट।',
    'AI-powered crop suggestions based on soil type, rainfall, temperature and season.':
      'मिट्टी के प्रकार, वर्षा, तापमान और मौसम के आधार पर AI-संचालित फसल सुझाव।',
    'Plant Disease Detection': 'पौधा रोग पहचान',
    'Identify crop diseases from images with treatment recommendations and prevention tips.':
      'उपचार सिफारिशों और रोकथाम युक्तियों के साथ छवियों से फसल रोगों की पहचान करें।',
    'AI Farming Chatbot': 'AI खेती चैटबॉट',
    'Ask any farming question and get instant expert advice powered by artificial intelligence.':
      'कोई भी खेती का सवाल पूछें और कृत्रिम बुद्धिमत्ता द्वारा संचालित तत्काल विशेषज्ञ सलाह प्राप्त करें।',
    'Market Price Insights': 'बाज़ार मूल्य अंतर्दृष्टि',
    'Live market prices for crops across mandis with trend analysis and price alerts.':
      'रुझान विश्लेषण और मूल्य अलर्ट के साथ मंडियों में फसलों के लाइव बाज़ार भाव।',
    'Smart irrigation scheduling based on soil moisture, weather data and crop requirements.':
      'मिट्टी की नमी, मौसम डेटा और फसल आवश्यकताओं पर आधारित स्मार्ट सिंचाई शेड्यूलिंग।',

    // ── Home – How it Works ──
    'How It Works': 'यह कैसे काम करता है',
    'Get started in three simple steps': 'तीन सरल चरणों में शुरू करें',
    'Register': 'पंजीकरण करें',
    'Create your free account in seconds. No complexity.':
      'सेकंड में अपना मुफ़्त खाता बनाएं। कोई जटिलता नहीं।',
    'Ask Questions or View Insights': 'सवाल पूछें या जानकारी देखें',
    'Browse weather, crop info, market prices, or ask our AI assistant.':
      'मौसम, फसल जानकारी, बाज़ार भाव ब्राउज़ करें, या हमारे AI सहायक से पूछें।',
    'Improve Farming Decisions': 'खेती के निर्णय सुधारें',
    'Make data-driven decisions to increase yield and reduce losses.':
      'उपज बढ़ाने और नुकसान कम करने के लिए डेटा-संचालित निर्णय लें।',

    // ── Home – CTA ──
    'Ready to Transform Your Farming?': 'अपनी खेती को बदलने के लिए तैयार हैं?',
    'Join thousands of smart farmers using AI-powered insights to increase yield, reduce losses, and make better decisions every day.':
      'हज़ारों स्मार्ट किसानों से जुड़ें जो उपज बढ़ाने, नुकसान कम करने और हर दिन बेहतर निर्णय लेने के लिए AI-संचालित अंतर्दृष्टि का उपयोग कर रहे हैं।',
    'Create Free Account': 'मुफ़्त खाता बनाएं',
    'Try AI Chatbot': 'AI चैटबॉट आज़माएं',

    // ── Weather ──
    'Regional Weather Updates': 'क्षेत्रीय मौसम अपडेट',
    'Real-time weather data with farming-specific insights':
      'खेती-विशिष्ट अंतर्दृष्टि के साथ वास्तविक समय मौसम डेटा',
    'Search city... (e.g., Ahmedabad, Mumbai)': 'शहर खोजें... (जैसे, अहमदाबाद, मुंबई)',
    'Search': 'खोजें',
    'Refresh': 'रिफ्रेश',
    'Farming Insight': 'खेती अंतर्दृष्टि',
    'Irrigation Suggestion': 'सिंचाई सुझाव',
    'Best time to irrigate: Early morning (6-8 AM) \u2014 Low evaporation rate with current humidity levels.':
      'सिंचाई का सबसे अच्छा समय: सुबह जल्दी (6-8 AM) \u2014 वर्तमान आर्द्रता स्तर के साथ कम वाष्पीकरण दर।',
    '7-Day Forecast': '7-दिन का पूर्वानुमान',
    'Weather Alerts': 'मौसम अलर्ट',
    'Based on current conditions for': 'वर्तमान स्थितियों पर आधारित',

    // ── WeatherCard ──
    'Humidity': 'आर्द्रता',
    'Rain': 'बारिश',
    'Wind': 'हवा',

    // ── Disease Info ──
    'Plant Disease Information': 'पौधा रोग जानकारी',
    'Select a crop to view common diseases, symptoms, remedies, and prevention tips':
      'सामान्य रोग, लक्षण, उपचार और रोकथाम युक्तियां देखने के लिए एक फसल चुनें',
    'Search crops...': 'फसलें खोजें...',
    'Symptoms': 'लक्षण',
    'Causes': 'कारण',
    'Remedies': 'उपचार',
    'Prevention': 'रोकथाम',
    'Season': 'मौसम',
    'known diseases documented below': 'ज्ञात रोग नीचे प्रलेखित हैं',
    'No disease data available for': 'के लिए कोई रोग डेटा उपलब्ध नहीं',
    'Select a crop above to view disease information':
      'रोग जानकारी देखने के लिए ऊपर एक फसल चुनें',

    // ── Tutorials ──
    'Farming Tutorials': 'खेती ट्यूटोरियल',
    'Learn modern farming techniques through expert video tutorials':
      'विशेषज्ञ वीडियो ट्यूटोरियल के माध्यम से आधुनिक खेती तकनीकें सीखें',
    'No tutorials in this category yet.': 'इस श्रेणी में अभी तक कोई ट्यूटोरियल नहीं है।',
    'Tutorial videos will be integrated with YouTube Data API for real video content.':
      'ट्यूटोरियल वीडियो वास्तविक वीडियो सामग्री के लिए YouTube Data API के साथ एकीकृत किए जाएंगे।',
    'Watch Tutorial': 'ट्यूटोरियल देखें',

    // ── Market Prices ──
    'Real-time crop prices from mandis across India':
      'भारत भर की मंडियों से वास्तविक समय फसल भाव',
    'Filters': 'फ़िल्टर',
    'Clear All': 'सब साफ़ करें',
    'Search...': 'खोजें...',
    'All States': 'सभी राज्य',
    'All Districts': 'सभी जिले',
    'All Crops': 'सभी फसलें',
    'Showing': 'दिखा रहा है',
    'results': 'परिणाम',
    'Crop': 'फसल',
    'State': 'राज्य',
    'Min Price': 'न्यूनतम मूल्य',
    'Max Price': 'अधिकतम मूल्य',
    'Modal Price': 'मॉडल मूल्य',
    'No matching results. Try different filters.':
      'कोई मिलान परिणाम नहीं। अलग फ़िल्टर आज़माएं।',
    'Prices shown are mock data for demonstration. Will be replaced with live API data from government portals.':
      'दिखाए गए भाव प्रदर्शन के लिए नमूना डेटा हैं। सरकारी पोर्टल से लाइव API डेटा से बदले जाएंगे।',

    // ── Crop Recommendation ──
    'Enter your soil and weather conditions to get AI-powered crop suggestions':
      'AI-संचालित फसल सुझाव प्राप्त करने के लिए अपनी मिट्टी और मौसम की स्थिति दर्ज करें',
    'Enter Farming Conditions': 'खेती की स्थिति दर्ज करें',
    'Soil Type': 'मिट्टी का प्रकार',
    'Select Soil Type': 'मिट्टी का प्रकार चुनें',
    'Select Season': 'मौसम चुनें',
    'Average Rainfall (mm)': 'औसत वर्षा (मिमी)',
    'Average Temperature (\u00b0C)': 'औसत तापमान (\u00b0C)',
    'Predicting...': 'अनुमान लगा रहा है...',
    'Predict Best Crops': 'सर्वोत्तम फसलों का अनुमान लगाएं',
    'Top 3 Recommended Crops': 'शीर्ष 3 अनुशंसित फसलें',
    'match': 'मिलान',
    'Recommendations are based on mock prediction logic. Will be replaced with ML model for higher accuracy.':
      'सिफारिशें नमूना पूर्वानुमान तर्क पर आधारित हैं। उच्च सटीकता के लिए ML मॉडल से बदली जाएंगी।',
    'Enter Your Conditions': 'अपनी स्थिति दर्ज करें',
    'Fill in the form and click "Predict" to get personalized crop recommendations':
      'व्यक्तिगत फसल सिफारिशें प्राप्त करने के लिए फ़ॉर्म भरें और "अनुमान" पर क्लिक करें',

    // ── Login ──
    'Welcome Back': 'वापसी पर स्वागत है',
    'Sign in to your farming dashboard': 'अपने खेती डैशबोर्ड में साइन इन करें',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Sign In': 'साइन इन',
    "Don't have an account?": 'खाता नहीं है?',
    'Register here': 'यहां पंजीकरण करें',

    // ── Register ──
    'Create Account': 'खाता बनाएं',
    'Join the smart farming revolution': 'स्मार्ट खेती क्रांति में शामिल हों',
    'Full Name': 'पूरा नाम',
    'Confirm Password': 'पासवर्ड की पुष्टि करें',
    'Already have an account?': 'पहले से खाता है?',
    'Sign in': 'साइन इन',

    // ── About & Contact ──
    'About': 'के बारे में',
    'Smart Farming Platform': 'स्मार्ट खेती प्लेटफ़ॉर्म',
    'Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture':
      'टिकाऊ और लाभदायक कृषि के लिए AI-संचालित तकनीक से भारतीय किसानों को सशक्त बनाना',
    'Our Motivation': 'हमारी प्रेरणा',
    'Indian agriculture employs over 50% of the workforce but faces critical challenges \u2014 unpredictable weather patterns, increasing crop diseases, lack of real-time market information, and water scarcity. Small and marginal farmers are the most affected.':
      'भारतीय कृषि 50% से अधिक कार्यबल को रोज़गार देती है लेकिन गंभीर चुनौतियों का सामना करती है \u2014 अप्रत्याशित मौसम पैटर्न, बढ़ते फसल रोग, वास्तविक समय बाज़ार जानकारी की कमी और पानी की कमी। छोटे और सीमांत किसान सबसे अधिक प्रभावित होते हैं।',
    "We believe technology can bridge this gap. By combining AI, IoT weather stations, and accessible interfaces, we aim to democratize agricultural intelligence and put expert-level insights in every farmer's hands.":
      'हम मानते हैं कि तकनीक इस अंतर को पाट सकती है। AI, IoT मौसम स्टेशनों और सुलभ इंटरफ़ेस को मिलाकर, हम कृषि बुद्धिमत्ता को लोकतांत्रिक बनाने और हर किसान के हाथों में विशेषज्ञ-स्तर की अंतर्दृष्टि रखने का लक्ष्य रखते हैं।',
    'Our Mission': 'हमारा मिशन',
    'Provide real-time, localized weather insights with farming-specific recommendations':
      'खेती-विशिष्ट सिफारिशों के साथ वास्तविक समय, स्थानीय मौसम अंतर्दृष्टि प्रदान करें',
    'Enable AI-powered crop disease detection and treatment guidance':
      'AI-संचालित फसल रोग पहचान और उपचार मार्गदर्शन सक्षम करें',
    'Offer data-driven crop recommendations based on soil, climate, and market conditions':
      'मिट्टी, जलवायु और बाज़ार स्थितियों के आधार पर डेटा-संचालित फसल सिफारिशें प्रदान करें',
    'Bridge the information gap with live market prices from mandis':
      'मंडियों से लाइव बाज़ार भाव के साथ जानकारी अंतर को पाटें',
    'Build a smart irrigation advisory system powered by IoT weather stations':
      'IoT मौसम स्टेशनों द्वारा संचालित स्मार्ट सिंचाई सलाह प्रणाली बनाएं',
    "Create an AI farming assistant that speaks the farmer's language":
      'एक AI खेती सहायक बनाएं जो किसान की भाषा बोलता है',
    'Technology Stack': 'तकनीकी स्टैक',
    'Built with modern, production-ready technologies':
      'आधुनिक, उत्पादन-तैयार तकनीकों के साथ निर्मित',
    'Future Integrations': 'भविष्य के एकीकरण',
    '\uD83D\uDCDE Contact & Support': '\uD83D\uDCDE संपर्क और सहायता',
    "We're here to help. Reach out to us anytime.":
      'हम मदद के लिए यहां हैं। कभी भी हमसे संपर्क करें।',
    'Send us a Message': 'हमें एक संदेश भेजें',
    'Enter your name': 'अपना नाम दर्ज करें',
    'Email Address': 'ईमेल पता',
    'Message': 'संदेश',
    'How can we help you?': 'हम आपकी कैसे मदद कर सकते हैं?',
    'Send Message': 'संदेश भेजें',
    'Get in Touch': 'संपर्क में रहें',
    'Helpline (Toll Free)': 'हेल्पलाइन (टोल फ्री)',
    'Email Support': 'ईमेल सहायता',
    'Office': 'कार्यालय',
    '\u2753 Frequently Asked Questions': '\u2753 अक्सर पूछे जाने वाले प्रश्न',
  },

  /* ───────────────────── GUJARATI ───────────────────── */
  gu: {
    // ── Navbar ──
    'Home': 'હોમ',
    'Weather': 'હવામાન',
    'Disease': 'રોગ',
    'Crops': 'પાક',
    'Market': 'બજાર',
    'Tutorials': 'ટ્યુટોરિયલ',
    'About Us': 'અમારા વિશે',
    'Login': 'લૉગિન',

    // ── Footer ──
    'AI-Powered Smart Farming Platform helping farmers make better decisions with weather insights, crop recommendations, and market intelligence.':
      'AI-સંચાલિત સ્માર્ટ ખેતી પ્લેટફોર્મ જે ખેડૂતોને હવામાન માહિતી, પાક ભલામણો અને બજાર બુદ્ધિમત્તા સાથે વધુ સારા નિર્ણયો લેવામાં મદદ કરે છે.',
    'Quick Links': 'ઝડપી લિંક્સ',
    'Dashboard': 'ડેશબોર્ડ',
    'Contact Us': 'અમારો સંપર્ક કરો',
    'Weather Updates': 'હવામાન અપડેટ',
    'Crop Recommendation': 'પાક ભલામણ',
    'Disease Info': 'રોગ માહિતી',
    'Market Prices': 'બજાર ભાવ',
    'About & Contact': 'અમારા વિશે અને સંપર્ક',
    'Overview': 'ઝાંખી',
    'Crop Health': 'પાક આરોગ્ય',
    'Yield Prediction': 'ઉપજ આગાહી',
    'Irrigation Advisory': 'સિંચાઈ સલાહ',
    'AI Chatbot': 'AI ચેટબોટ',
    'Smart Farming Platform. Built with \u2764\uFE0F for Indian Farmers.':
      'સ્માર્ટ ખેતી પ્લેટફોર્મ. ભારતીય ખેડૂતો માટે \u2764\uFE0F થી બનાવેલ.',

    // ── Home – Hero ──
    'AI Powered': 'AI સંચાલિત',
    'Smart Farming': 'સ્માર્ટ ખેતી',
    'Platform': 'પ્લેટફોર્મ',
    "Farming shouldn't depend on guesswork. Our platform helps farmers predict weather changes, detect crop diseases early, and make better market decisions using simple AI-powered tools.":
      'ખેતી અંદાજ પર આધારિત ન હોવી જોઈએ. અમારું પ્લેટફોર્મ ખેડૂતોને હવામાન ફેરફારોની આગાહી કરવામાં, પાકના રોગોની વહેલી શોધ કરવામાં અને સરળ AI-સંચાલિત સાધનોનો ઉપયોગ કરીને વધુ સારા બજાર નિર્ણયો લેવામાં મદદ કરે છે.',
    'Get Started': 'શરૂ કરો',
    'Learn More': 'વધુ જાણો',
    'Free to Use': 'ઉપયોગ મફત',
    'For Indian Farmers': 'ભારતીય ખેડૂતો માટે',

    // ── Home – Problems ──
    'The Problem We Solve': 'અમે જે સમસ્યા ઉકેલીએ છીએ',
    'Indian farmers face critical challenges that can be solved with technology':
      'ભારતીય ખેડૂતો ગંભીર પડકારોનો સામનો કરે છે જે ટેકનોલોજીથી ઉકેલી શકાય છે',
    'Our Solutions': 'અમારા ઉકેલો',
    'Unpredictable Weather': 'અણધાર્યું હવામાન',
    'Sudden weather changes destroy crops and reduce yield without timely warnings.':
      'અચાનક હવામાન ફેરફારો સમયસર ચેતવણી વિના પાક નષ્ટ કરે છે અને ઉપજ ઘટાડે છે.',
    'Crop Diseases': 'પાક રોગો',
    'Late identification of diseases causes massive crop losses every season.':
      'રોગોની મોડી ઓળખ દરેક સીઝનમાં ભારે પાક નુકસાનનું કારણ બને છે.',
    'Market Price Uncertainty': 'બજાર ભાવ અનિશ્ચિતતા',
    'Farmers sell at low prices due to lack of real-time market information.':
      'રીઅલ-ટાઇમ બજાર માહિતીના અભાવને કારણે ખેડૂતો ઓછા ભાવે વેચે છે.',

    // ── Home – Solutions ──
    'Weather Alerts': 'હવામાન ચેતવણીઓ',
    'Get real-time weather notifications with farming-specific action recommendations.':
      'ખેતી-વિશિષ્ટ ક્રિયા ભલામણો સાથે રીઅલ-ટાઇમ હવામાન સૂચનાઓ મેળવો.',
    'AI Farming Assistant': 'AI ખેતી સહાયક',
    'AI chatbot that answers farming questions and provides expert guidance 24/7.':
      'AI ચેટબોટ જે ખેતીના પ્રશ્નોના જવાબ આપે છે અને 24/7 નિષ્ણાત માર્ગદર્શન પ્રદાન કરે છે.',
    'Data-driven crop suggestions that match your soil, weather, and market conditions.':
      'ડેટા-સંચાલિત પાક સૂચનો જે તમારી જમીન, હવામાન અને બજાર સ્થિતિઓ સાથે મેળ ખાય છે.',
    'Market Insights': 'બજાર આંતરદૃષ્ટિ',
    'Live mandi prices with trends so you can sell crops at the best time and price.':
      'ટ્રેન્ડ્સ સાથે લાઇવ મંડી ભાવ જેથી તમે શ્રેષ્ઠ સમય અને ભાવે પાક વેચી શકો.',

    // ── Home – Features ──
    'Key Features': 'મુખ્ય લક્ષણો',
    'Everything a modern farmer needs, powered by technology':
      'આધુનિક ખેડૂતને જે કંઈ જોઈએ, ટેકનોલોજી દ્વારા સંચાલિત',
    'Weather Forecast': 'હવામાન આગાહી',
    'Real-time weather updates with farming-specific insights and alerts for your region.':
      'તમારા વિસ્તાર માટે ખેતી-વિશિષ્ટ આંતરદૃષ્ટિ અને ચેતવણીઓ સાથે રીઅલ-ટાઇમ હવામાન અપડેટ.',
    'AI-powered crop suggestions based on soil type, rainfall, temperature and season.':
      'જમીનના પ્રકાર, વરસાદ, તાપમાન અને ઋતુના આધારે AI-સંચાલિત પાક સૂચનો.',
    'Plant Disease Detection': 'છોડ રોગ શોધ',
    'Identify crop diseases from images with treatment recommendations and prevention tips.':
      'ઉપચાર ભલામણો અને નિવારણ ટિપ્સ સાથે છબીઓમાંથી પાક રોગોની ઓળખ કરો.',
    'AI Farming Chatbot': 'AI ખેતી ચેટબોટ',
    'Ask any farming question and get instant expert advice powered by artificial intelligence.':
      'કોઈપણ ખેતીનો પ્રશ્ન પૂછો અને કૃત્રિમ બુદ્ધિમત્તા દ્વારા સંચાલિત તાત્કાલિક નિષ્ણાત સલાહ મેળવો.',
    'Market Price Insights': 'બજાર ભાવ આંતરદૃષ્ટિ',
    'Live market prices for crops across mandis with trend analysis and price alerts.':
      'ટ્રેન્ડ વિશ્લેષણ અને ભાવ ચેતવણીઓ સાથે મંડીઓમાં પાકના લાઇવ બજાર ભાવ.',
    'Smart irrigation scheduling based on soil moisture, weather data and crop requirements.':
      'જમીનની ભેજ, હવામાન ડેટા અને પાક જરૂરિયાતો પર આધારિત સ્માર્ટ સિંચાઈ શેડ્યુલિંગ.',

    // ── Home – How it Works ──
    'How It Works': 'તે કેવી રીતે કામ કરે છે',
    'Get started in three simple steps': 'ત્રણ સરળ પગલાંમાં શરૂ કરો',
    'Register': 'નોંધણી કરો',
    'Create your free account in seconds. No complexity.':
      'સેકન્ડોમાં તમારું મફત ખાતું બનાવો. કોઈ જટિલતા નહીં.',
    'Ask Questions or View Insights': 'પ્રશ્નો પૂછો અથવા માહિતી જુઓ',
    'Browse weather, crop info, market prices, or ask our AI assistant.':
      'હવામાન, પાક માહિતી, બજાર ભાવ બ્રાઉઝ કરો, અથવા અમારા AI સહાયકને પૂછો.',
    'Improve Farming Decisions': 'ખેતીના નિર્ણયો સુધારો',
    'Make data-driven decisions to increase yield and reduce losses.':
      'ઉપજ વધારવા અને નુકસાન ઘટાડવા માટે ડેટા-સંચાલિત નિર્ણયો લો.',

    // ── Home – CTA ──
    'Ready to Transform Your Farming?': 'તમારી ખેતી બદલવા માટે તૈયાર છો?',
    'Join thousands of smart farmers using AI-powered insights to increase yield, reduce losses, and make better decisions every day.':
      'હજારો સ્માર્ટ ખેડૂતો સાથે જોડાઓ જે ઉપજ વધારવા, નુકસાન ઘટાડવા અને દરરોજ વધુ સારા નિર્ણયો લેવા AI-સંચાલિત આંતરદૃષ્ટિનો ઉપયોગ કરે છે.',
    'Create Free Account': 'મફત ખાતું બનાવો',
    'Try AI Chatbot': 'AI ચેટબોટ અજમાવો',

    // ── Weather ──
    'Regional Weather Updates': 'પ્રાદેશિક હવામાન અપડેટ',
    'Real-time weather data with farming-specific insights':
      'ખેતી-વિશિષ્ટ આંતરદૃષ્ટિ સાથે રીઅલ-ટાઇમ હવામાન ડેટા',
    'Search city... (e.g., Ahmedabad, Mumbai)': 'શહેર શોધો... (દા.ત., અમદાવાદ, મુંબઈ)',
    'Search': 'શોધો',
    'Refresh': 'રિફ્રેશ',
    'Farming Insight': 'ખેતી આંતરદૃષ્ટિ',
    'Irrigation Suggestion': 'સિંચાઈ સૂચન',
    'Best time to irrigate: Early morning (6-8 AM) \u2014 Low evaporation rate with current humidity levels.':
      'સિંચાઈ માટે શ્રેષ્ઠ સમય: વહેલી સવાર (6-8 AM) \u2014 વર્તમાન ભેજ સ્તરો સાથે ઓછો બાષ્પીભવન દર.',
    '7-Day Forecast': '7-દિવસની આગાહી',
    'Based on current conditions for': 'વર્તમાન પરિસ્થિતિઓ પર આધારિત',

    // ── WeatherCard ──
    'Humidity': 'ભેજ',
    'Rain': 'વરસાદ',
    'Wind': 'પવન',

    // ── Disease Info ──
    'Plant Disease Information': 'છોડ રોગ માહિતી',
    'Select a crop to view common diseases, symptoms, remedies, and prevention tips':
      'સામાન્ય રોગો, લક્ષણો, ઉપચાર અને નિવારણ ટિપ્સ જોવા માટે પાક પસંદ કરો',
    'Search crops...': 'પાક શોધો...',
    'Symptoms': 'લક્ષણો',
    'Causes': 'કારણો',
    'Remedies': 'ઉપચાર',
    'Prevention': 'નિવારણ',
    'Season': 'ઋતુ',
    'known diseases documented below': 'જાણીતા રોગો નીચે દસ્તાવેજીકૃત છે',
    'No disease data available for': 'માટે કોઈ રોગ ડેટા ઉપલબ્ધ નથી',
    'Select a crop above to view disease information':
      'રોગ માહિતી જોવા માટે ઉપર પાક પસંદ કરો',

    // ── Tutorials ──
    'Farming Tutorials': 'ખેતી ટ્યુટોરિયલ',
    'Learn modern farming techniques through expert video tutorials':
      'નિષ્ણાત વિડિયો ટ્યુટોરિયલ દ્વારા આધુનિક ખેતી તકનીકો શીખો',
    'No tutorials in this category yet.': 'આ શ્રેણીમાં હજુ સુધી કોઈ ટ્યુટોરિયલ નથી.',
    'Tutorial videos will be integrated with YouTube Data API for real video content.':
      'ટ્યુટોરિયલ વિડિયો વાસ્તવિક વિડિયો સામગ્રી માટે YouTube Data API સાથે એકીકૃત કરવામાં આવશે.',
    'Watch Tutorial': 'ટ્યુટોરિયલ જુઓ',

    // ── Market Prices ──
    'Real-time crop prices from mandis across India':
      'ભારતભરની મંડીઓમાંથી રીઅલ-ટાઇમ પાક ભાવ',
    'Filters': 'ફિલ્ટર્સ',
    'Clear All': 'બધું સાફ કરો',
    'Search...': 'શોધો...',
    'All States': 'બધા રાજ્યો',
    'All Districts': 'બધા જિલ્લાઓ',
    'All Crops': 'બધા પાક',
    'Showing': 'બતાવી રહ્યું છે',
    'results': 'પરિણામો',
    'Crop': 'પાક',
    'State': 'રાજ્ય',
    'Min Price': 'ન્યૂનતમ ભાવ',
    'Max Price': 'મહત્તમ ભાવ',
    'Modal Price': 'મોડલ ભાવ',
    'No matching results. Try different filters.':
      'કોઈ મેળ ખાતા પરિણામો નથી. અલગ ફિલ્ટર્સ અજમાવો.',
    'Prices shown are mock data for demonstration. Will be replaced with live API data from government portals.':
      'બતાવેલા ભાવ પ્રદર્શન માટે નમૂના ડેટા છે. સરકારી પોર્ટલમાંથી લાઇવ API ડેટાથી બદલવામાં આવશે.',

    // ── Crop Recommendation ──
    'Enter your soil and weather conditions to get AI-powered crop suggestions':
      'AI-સંચાલિત પાક સૂચનો મેળવવા માટે તમારી જમીન અને હવામાન સ્થિતિ દાખલ કરો',
    'Enter Farming Conditions': 'ખેતીની સ્થિતિ દાખલ કરો',
    'Soil Type': 'જમીનનો પ્રકાર',
    'Select Soil Type': 'જમીનનો પ્રકાર પસંદ કરો',
    'Select Season': 'ઋતુ પસંદ કરો',
    'Average Rainfall (mm)': 'સરેરાશ વરસાદ (મિમી)',
    'Average Temperature (\u00b0C)': 'સરેરાશ તાપમાન (\u00b0C)',
    'Predicting...': 'આગાહી કરી રહ્યું છે...',
    'Predict Best Crops': 'શ્રેષ્ઠ પાકની આગાહી કરો',
    'Top 3 Recommended Crops': 'ટોચના 3 ભલામણ કરેલ પાક',
    'match': 'મેળ',
    'Recommendations are based on mock prediction logic. Will be replaced with ML model for higher accuracy.':
      'ભલામણો નમૂના આગાહી તર્ક પર આધારિત છે. ઉચ્ચ ચોકસાઈ માટે ML મોડેલથી બદલવામાં આવશે.',
    'Enter Your Conditions': 'તમારી સ્થિતિ દાખલ કરો',
    'Fill in the form and click "Predict" to get personalized crop recommendations':
      'વ્યક્તિગત પાક ભલામણો મેળવવા માટે ફોર્મ ભરો અને "આગાહી" પર ક્લિક કરો',

    // ── Login ──
    'Welcome Back': 'પાછા આવ્યાનું સ્વાગત છે',
    'Sign in to your farming dashboard': 'તમારા ખેતી ડેશબોર્ડમાં સાઇન ઇન કરો',
    'Email': 'ઈમેલ',
    'Password': 'પાસવર્ડ',
    'Sign In': 'સાઇન ઇન',
    "Don't have an account?": 'ખાતું નથી?',
    'Register here': 'અહીં નોંધણી કરો',

    // ── Register ──
    'Create Account': 'ખાતું બનાવો',
    'Join the smart farming revolution': 'સ્માર્ટ ખેતી ક્રાંતિમાં જોડાઓ',
    'Full Name': 'પૂરું નામ',
    'Confirm Password': 'પાસવર્ડની પુષ્ટિ કરો',
    'Already have an account?': 'પહેલેથી ખાતું છે?',
    'Sign in': 'સાઇન ઇન',

    // ── About & Contact ──
    'About': 'વિશે',
    'Smart Farming Platform': 'સ્માર્ટ ખેતી પ્લેટફોર્મ',
    'Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture':
      'ટકાઉ અને નફાકારક ખેતી માટે AI-સંચાલિત ટેકનોલોજી સાથે ભારતીય ખેડૂતોને સશક્ત બનાવવા',
    'Our Motivation': 'અમારી પ્રેરણા',
    'Indian agriculture employs over 50% of the workforce but faces critical challenges \u2014 unpredictable weather patterns, increasing crop diseases, lack of real-time market information, and water scarcity. Small and marginal farmers are the most affected.':
      'ભારતીય ખેતી 50% થી વધુ કાર્યબળને રોજગારી આપે છે પરંતુ ગંભીર પડકારોનો સામનો કરે છે \u2014 અણધાર્યા હવામાન પેટર્ન, વધતા પાક રોગો, રીઅલ-ટાઇમ બજાર માહિતીનો અભાવ અને પાણીની અછત. નાના અને સીમાંત ખેડૂતો સૌથી વધુ પ્રભાવિત થાય છે.',
    "We believe technology can bridge this gap. By combining AI, IoT weather stations, and accessible interfaces, we aim to democratize agricultural intelligence and put expert-level insights in every farmer's hands.":
      'અમે માનીએ છીએ કે ટેકનોલોજી આ અંતર ભરી શકે છે. AI, IoT હવામાન સ્ટેશનો અને સુલભ ઇન્ટરફેસનું સંયોજન કરીને, અમે કૃષિ બુદ્ધિમત્તાને લોકશાહી બનાવવા અને દરેક ખેડૂતના હાથમાં નિષ્ણાત-સ્તરની આંતરદૃષ્ટિ મૂકવાનું લક્ષ્ય રાખીએ છીએ.',
    'Our Mission': 'અમારું મિશન',
    'Provide real-time, localized weather insights with farming-specific recommendations':
      'ખેતી-વિશિષ્ટ ભલામણો સાથે રીઅલ-ટાઇમ, સ્થાનિક હવામાન આંતરદૃષ્ટિ પ્રદાન કરો',
    'Enable AI-powered crop disease detection and treatment guidance':
      'AI-સંચાલિત પાક રોગ શોધ અને ઉપચાર માર્ગદર્શન સક્ષમ કરો',
    'Offer data-driven crop recommendations based on soil, climate, and market conditions':
      'જમીન, આબોહવા અને બજાર સ્થિતિઓના આધારે ડેટા-સંચાલિત પાક ભલામણો આપો',
    'Bridge the information gap with live market prices from mandis':
      'મંડીઓમાંથી લાઇવ બજાર ભાવ સાથે માહિતી અંતર ભરો',
    'Build a smart irrigation advisory system powered by IoT weather stations':
      'IoT હવામાન સ્ટેશનો દ્વારા સંચાલિત સ્માર્ટ સિંચાઈ સલાહ પ્રણાલી બનાવો',
    "Create an AI farming assistant that speaks the farmer's language":
      'એક AI ખેતી સહાયક બનાવો જે ખેડૂતની ભાષા બોલે છે',
    'Technology Stack': 'ટેકનોલોજી સ્ટેક',
    'Built with modern, production-ready technologies':
      'આધુનિક, ઉત્પાદન-તૈયાર ટેકનોલોજીઓ સાથે બનાવેલ',
    'Future Integrations': 'ભવિષ્યના એકીકરણ',
    '\uD83D\uDCDE Contact & Support': '\uD83D\uDCDE સંપર્ક અને સહાય',
    "We're here to help. Reach out to us anytime.":
      'અમે મદદ માટે અહીં છીએ. કોઈપણ સમયે અમારો સંપર્ક કરો.',
    'Send us a Message': 'અમને સંદેશ મોકલો',
    'Enter your name': 'તમારું નામ દાખલ કરો',
    'Email Address': 'ઈમેલ સરનામું',
    'Message': 'સંદેશ',
    'How can we help you?': 'અમે તમારી કેવી રીતે મદદ કરી શકીએ?',
    'Send Message': 'સંદેશ મોકલો',
    'Get in Touch': 'સંપર્કમાં રહો',
    'Helpline (Toll Free)': 'હેલ્પલાઇન (ટોલ ફ્રી)',
    'Email Support': 'ઈમેલ સહાય',
    'Office': 'કાર્યાલય',
    '\u2753 Frequently Asked Questions': '\u2753 વારંવાર પૂછાતા પ્રશ્નો',
  },
};

export default translations;
