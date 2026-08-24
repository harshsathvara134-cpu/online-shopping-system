import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'EN', name: 'English',   nativeName: 'English'   },
  { code: 'HI', name: 'Hindi',     nativeName: 'हिन्दी'     },
  { code: 'GU', name: 'Gujarati',  nativeName: 'ગુજરાતી'    },
  { code: 'TA', name: 'Tamil',     nativeName: 'தமிழ்'      },
  { code: 'TE', name: 'Telugu',    nativeName: 'తెలుగు'     },
  { code: 'KN', name: 'Kannada',   nativeName: 'ಕನ್ನಡ'      },
  { code: 'ML', name: 'Malayalam', nativeName: 'മലയാളം'     },
  { code: 'BN', name: 'Bengali',   nativeName: 'বাংলা'      },
  { code: 'MR', name: 'Marathi',   nativeName: 'मराठी'      },
];

export type TranslationKey =
  | 'searchPlaceholder' | 'home' | 'store' | 'cart' | 'wishlist'
  | 'myOrders' | 'myProfile' | 'login' | 'logout'
  | 'addToCart' | 'buyNow' | 'outOfStock' | 'inStock'
  | 'explore' | 'filters' | 'applyFilters' | 'clearFilters'
  | 'sortBy' | 'featured' | 'productCatalog' | 'relatedProducts'
  | 'reviews' | 'writeReview' | 'shoppingCart' | 'emptyCart'
  | 'checkout' | 'orderSummary' | 'total' | 'subtotal' | 'discount'
  | 'deliveryFree' | 'placeOrder' | 'continueShopping'
  | 'freeDelivery' | 'securePayment' | 'easyReturns'
  | 'allCategories' | 'electronics' | 'fashion' | 'homeKitchen'
  | 'sports' | 'priceRange' | 'brands' | 'rating';

type Translations = Record<TranslationKey, string>;

const translations: Record<string, Translations> = {
  EN: {
    searchPlaceholder: 'Search products, brands and more...',
    home: 'Home', store: 'Store', cart: 'Cart', wishlist: 'Wishlist',
    myOrders: 'My Orders', myProfile: 'My Profile', login: 'Login', logout: 'Logout',
    addToCart: 'Add to Cart', buyNow: 'Buy Now', outOfStock: 'Out of Stock',
    inStock: 'In Stock', explore: 'Explore Catalog', filters: 'Filters',
    applyFilters: 'Apply Filters', clearFilters: 'Clear Filters',
    sortBy: 'Sort By', featured: 'Featured', productCatalog: 'Product Catalog',
    relatedProducts: 'Related Products', reviews: 'Reviews', writeReview: 'Write a Review',
    shoppingCart: 'Shopping Cart', emptyCart: 'Your Shopping Cart is Empty',
    checkout: 'Secure Checkout', orderSummary: 'Order Summary', total: 'Total',
    subtotal: 'Subtotal', discount: 'Discount', deliveryFree: 'FREE Delivery',
    placeOrder: 'Place Order', continueShopping: 'Continue Shopping',
    freeDelivery: 'Free Express Delivery', securePayment: '100% Secure Payment',
    easyReturns: 'Easy Returns', allCategories: 'All Categories',
    electronics: 'Electronics', fashion: 'Fashion', homeKitchen: 'Home & Kitchen',
    sports: 'Sports', priceRange: 'Price Range', brands: 'Brands', rating: 'Rating',
  },
  HI: {
    searchPlaceholder: 'उत्पाद, ब्रांड और अधिक खोजें...',
    home: 'होम', store: 'स्टोर', cart: 'कार्ट', wishlist: 'विशलिस्ट',
    myOrders: 'मेरे ऑर्डर', myProfile: 'मेरी प्रोफ़ाइल', login: 'लॉगिन', logout: 'लॉगआउट',
    addToCart: 'कार्ट में डालें', buyNow: 'अभी खरीदें', outOfStock: 'स्टॉक में नहीं',
    inStock: 'स्टॉक में है', explore: 'कैटलॉग देखें', filters: 'फ़िल्टर',
    applyFilters: 'फ़िल्टर लागू करें', clearFilters: 'फ़िल्टर हटाएं',
    sortBy: 'क्रमबद्ध करें', featured: 'विशेष', productCatalog: 'उत्पाद सूची',
    relatedProducts: 'संबंधित उत्पाद', reviews: 'समीक्षाएं', writeReview: 'समीक्षा लिखें',
    shoppingCart: 'शॉपिंग कार्ट', emptyCart: 'आपका शॉपिंग कार्ट खाली है',
    checkout: 'सुरक्षित चेकआउट', orderSummary: 'ऑर्डर सारांश', total: 'कुल',
    subtotal: 'उप-कुल', discount: 'छूट', deliveryFree: 'मुफ़्त डिलीवरी',
    placeOrder: 'ऑर्डर करें', continueShopping: 'खरीदारी जारी रखें',
    freeDelivery: 'मुफ़्त एक्सप्रेस डिलीवरी', securePayment: '100% सुरक्षित भुगतान',
    easyReturns: 'आसान वापसी', allCategories: 'सभी श्रेणियां',
    electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फैशन', homeKitchen: 'घर और रसोई',
    sports: 'खेल', priceRange: 'मूल्य सीमा', brands: 'ब्रांड', rating: 'रेटिंग',
  },
  GU: {
    searchPlaceholder: 'ઉત્પાદ, બ્રાન્ડ અને વધુ શોધો...',
    home: 'ઘર', store: 'સ્ટોર', cart: 'કાર્ટ', wishlist: 'વિશલિસ્ટ',
    myOrders: 'મારા ઓર્ડર', myProfile: 'મારી પ્રોફ़ाઇल', login: 'લૉગ ઇન', logout: 'લૉગ આઉટ',
    addToCart: 'કાર્ટમાં ઉમેરો', buyNow: 'હવે ખરીદો', outOfStock: 'સ્ટૉક નથી',
    inStock: 'સ્ટૉકમાં છે', explore: 'કૅટેલૉગ જુઓ', filters: 'ફ़िल्टर',
    applyFilters: 'ફ઼િલ્ટર લાગુ કરો', clearFilters: 'ફ઼િલ્ટર સાફ કરો',
    sortBy: 'ક્રમ', featured: 'ફ़ीचर', productCatalog: 'ઉત્પાદ સૂચિ',
    relatedProducts: 'સંબંધિત ઉત્પાદ', reviews: 'સમીક્ષા', writeReview: 'સમીક્ષા લખો',
    shoppingCart: 'શૉપિંગ કાર્ટ', emptyCart: 'તમારી શૉપિંગ કાર્ટ ખાલી છે',
    checkout: 'સુરક્ષિત ચેકઆઉટ', orderSummary: 'ઑર્ડર સારાંશ', total: 'કુલ',
    subtotal: 'પેટા-કુલ', discount: 'છૂટ', deliveryFree: 'મફ્ત ડિલિવરી',
    placeOrder: 'ઑર્ડર કરો', continueShopping: 'ખરીદી ચાલુ રાખો',
    freeDelivery: 'મફ્ત ઍક્સ્પ્રેસ ડિલિવરી', securePayment: '100% સુરક્ષિત ચૂકવણી',
    easyReturns: 'સરળ પરત', allCategories: 'બધી શ્રેણીઓ',
    electronics: 'ઇલેક્ટ્રૉનિક્સ', fashion: 'ફ़ैशन', homeKitchen: 'ઘર અને રસોઈ',
    sports: 'રમત', priceRange: 'ભાવ શ્રેણી', brands: 'બ્રાન્ડ', rating: 'રેટિંગ',
  },
  TA: {
    searchPlaceholder: 'பொருட்கள், பிராண்டுகள் தேடுங்கள்...',
    home: 'முகப்பு', store: 'கடை', cart: 'கார்ட்', wishlist: 'விரும்பினவை',
    myOrders: 'என் ஆர்டர்கள்', myProfile: 'என் சுயவிவரம்', login: 'உள்நுழைய', logout: 'வெளியேறு',
    addToCart: 'கார்ட்டில் சேர்', buyNow: 'இப்போது வாங்கு', outOfStock: 'இல்லை',
    inStock: 'கிடைக்கிறது', explore: 'கேட்டலாக் காண்க', filters: 'வடிகட்டிகள்',
    applyFilters: 'வடிகட்டு', clearFilters: 'அழி',
    sortBy: 'வரிசைப்படுத்து', featured: 'சிறப்பு', productCatalog: 'தயாரிப்பு பட்டியல்',
    relatedProducts: 'தொடர்புடைய', reviews: 'மதிப்புரைகள்', writeReview: 'மதிப்புரை எழுது',
    shoppingCart: 'ஷாப்பிங் கார்ட்', emptyCart: 'உங்கள் கார்ட் காலியாக உள்ளது',
    checkout: 'பாதுகாப்பான செக்அவுட்', orderSummary: 'ஆர்டர் சுருக்கம்', total: 'மொத்தம்',
    subtotal: 'துணைமொத்தம்', discount: 'தள்ளுபடி', deliveryFree: 'இலவச டெலிவரி',
    placeOrder: 'ஆர்டர் செய்', continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்',
    freeDelivery: 'இலவச விரைவு டெலிவரி', securePayment: '100% பாதுகாப்பான கட்டணம்',
    easyReturns: 'எளிதான திரும்பல்', allCategories: 'அனைத்து வகைகள்',
    electronics: 'எலக்ட்ரானிக்ஸ்', fashion: 'நாகரிகம்', homeKitchen: 'வீடு & சமையலறை',
    sports: 'விளையாட்டு', priceRange: 'விலை வரம்பு', brands: 'பிராண்டுகள்', rating: 'மதிப்பீடு',
  },
  TE: {
    searchPlaceholder: 'ఉత్పత్తులు, బ్రాండ్లు వెతకండి...',
    home: 'హోమ్', store: 'స్టోర్', cart: 'కార్ట్', wishlist: 'విష్‌లిస్ట్',
    myOrders: 'నా ఆర్డర్లు', myProfile: 'నా ప్రొఫైల్', login: 'లాగిన్', logout: 'లాగ్అవుట్',
    addToCart: 'కార్ట్‌కు జోడించు', buyNow: 'ఇప్పుడు కొనండి', outOfStock: 'స్టాక్ లేదు',
    inStock: 'స్టాక్‌లో ఉంది', explore: 'కేటలాగ్ చూడండి', filters: 'ఫిల్టర్లు',
    applyFilters: 'ఫిల్టర్లు వర్తింపజేయి', clearFilters: 'ఫిల్టర్లు తొలగించు',
    sortBy: 'క్రమబద్ధీకరించు', featured: 'ఫీచర్డ్', productCatalog: 'ఉత్పత్తి జాబితా',
    relatedProducts: 'సంబంధిత ఉత్పత్తులు', reviews: 'సమీక్షలు', writeReview: 'సమీక్ష రాయండి',
    shoppingCart: 'షాపింగ్ కార్ట్', emptyCart: 'మీ షాపింగ్ కార్ట్ ఖాళీగా ఉంది',
    checkout: 'సురక్షిత చెక్అవుట్', orderSummary: 'ఆర్డర్ సారాంశం', total: 'మొత్తం',
    subtotal: 'ఉప మొత్తం', discount: 'తగ్గింపు', deliveryFree: 'ఉచిత డెలివరీ',
    placeOrder: 'ఆర్డర్ చేయి', continueShopping: 'షాపింగ్ కొనసాగించు',
    freeDelivery: 'ఉచిత ఎక్స్‌ప్రెస్ డెలివరీ', securePayment: '100% సురక్షిత చెల్లింపు',
    easyReturns: 'సులభమైన రిటర్న్లు', allCategories: 'అన్ని వర్గాలు',
    electronics: 'ఎలక్ట్రానిక్స్', fashion: 'ఫ్యాషన్', homeKitchen: 'ఇల్లు & వంటగది',
    sports: 'క్రీడలు', priceRange: 'ధర పరిధి', brands: 'బ్రాండ్లు', rating: 'రేటింగ్',
  },
  KN: {
    searchPlaceholder: 'ಉತ್ಪನ್ನಗಳು, ಬ್ರಾಂಡ್‌ಗಳು ಹುಡುಕಿ...',
    home: 'ಮುಖಪುಟ', store: 'ಅಂಗಡಿ', cart: 'ಕಾರ್ಟ್', wishlist: 'ವಿಷ್‌ಲಿಸ್ಟ್',
    myOrders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು', myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', login: 'ಲಾಗಿನ್', logout: 'ಲಾಗ್ ಔಟ್',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', buyNow: 'ಈಗ ಖರೀದಿಸಿ', outOfStock: 'ಸ್ಟಾಕ್ ಇಲ್ಲ',
    inStock: 'ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ', explore: 'ಕ್ಯಾಟಲಾಗ್ ನೋಡಿ', filters: 'ಫಿಲ್ಟರ್‌ಗಳು',
    applyFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಅನ್ವಯಿಸಿ', clearFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವು',
    sortBy: 'ವಿಂಗಡಿಸು', featured: 'ವೈಶಿಷ್ಟ್ಯ', productCatalog: 'ಉತ್ಪನ್ನ ಪಟ್ಟಿ',
    relatedProducts: 'ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳು', reviews: 'ವಿಮರ್ಶೆಗಳು', writeReview: 'ವಿಮರ್ಶೆ ಬರೆಯಿರಿ',
    shoppingCart: 'ಶಾಪಿಂಗ್ ಕಾರ್ಟ್', emptyCart: 'ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್ ಖಾಲಿ',
    checkout: 'ಸುರಕ್ಷಿತ ಚೆಕ್‌ಔಟ್', orderSummary: 'ಆರ್ಡರ್ ಸಾರಾಂಶ', total: 'ಒಟ್ಟು',
    subtotal: 'ಉಪ-ಒಟ್ಟು', discount: 'ರಿಯಾಯಿತಿ', deliveryFree: 'ಉಚಿತ ಡೆಲಿವರಿ',
    placeOrder: 'ಆರ್ಡರ್ ಮಾಡಿ', continueShopping: 'ಶಾಪಿಂಗ್ ಮುಂದುವರೆಸಿ',
    freeDelivery: 'ಉಚಿತ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ', securePayment: '100% ಸುರಕ್ಷಿತ ಪಾವತಿ',
    easyReturns: 'ಸುಲಭ ರಿಟರ್ನ್', allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    electronics: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್', fashion: 'ಫ್ಯಾಷನ್', homeKitchen: 'ಮನೆ & ಅಡುಗೆಮನೆ',
    sports: 'ಕ್ರೀಡೆ', priceRange: 'ಬೆಲೆ ವ್ಯಾಪ್ತಿ', brands: 'ಬ್ರಾಂಡ್‌ಗಳು', rating: 'ರೇಟಿಂಗ್',
  },
  ML: {
    searchPlaceholder: 'ഉൽപ്പന്നങ്ങൾ, ബ്രാൻഡുകൾ തിരയുക...',
    home: 'ഹോം', store: 'സ്റ്റോർ', cart: 'കാർട്ട്', wishlist: 'വിഷ്‌ലിസ്റ്റ്',
    myOrders: 'എന്റെ ഓർഡറുകൾ', myProfile: 'എന്റെ പ്രൊഫൈൽ', login: 'ലോഗിൻ', logout: 'ലോഗ്ഔട്ട്',
    addToCart: 'കാർട്ടിൽ ചേർക്കുക', buyNow: 'ഇപ്പോൾ വാങ്ങുക', outOfStock: 'സ്റ്റോക്ക് ഇല്ല',
    inStock: 'സ്റ്റോക്കിലുണ്ട്', explore: 'കാറ്റലോഗ് കാണുക', filters: 'ഫിൽട്ടറുകൾ',
    applyFilters: 'ഫിൽട്ടർ പ്രയോഗിക്കുക', clearFilters: 'ഫിൽട്ടർ മായ്ക്കുക',
    sortBy: 'അടുക്കുക', featured: 'ഫീച്ചർഡ്', productCatalog: 'ഉൽപ്പന്ന പട്ടിക',
    relatedProducts: 'അനുബന്ധ ഉൽപ്പന്നങ്ങൾ', reviews: 'അവലോകനങ്ങൾ', writeReview: 'അവലോകനം എഴുതുക',
    shoppingCart: 'ഷോപ്പിംഗ് കാർട്ട്', emptyCart: 'നിങ്ങളുടെ കാർട്ട് ഒഴിഞ്ഞിരിക്കുന്നു',
    checkout: 'സുരക്ഷിത ചെക്ക്ഔട്ട്', orderSummary: 'ഓർഡർ സംഗ്രഹം', total: 'മൊത്തം',
    subtotal: 'ഉപ-ആകെ', discount: 'കിഴിവ്', deliveryFree: 'സൗജന്യ ഡെലിവറി',
    placeOrder: 'ഓർഡർ ചെയ്യുക', continueShopping: 'ഷോപ്പിംഗ് തുടരുക',
    freeDelivery: 'സൗജന്യ എക്സ്പ്രസ് ഡെലിവറി', securePayment: '100% സുരക്ഷിത പേയ്‌മെന്റ്',
    easyReturns: 'എളുപ്പ റിട്ടേൺ', allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    electronics: 'ഇലക്ട്രോണിക്‌സ്', fashion: 'ഫാഷൻ', homeKitchen: 'വീട് & അടുക്കള',
    sports: 'കായികം', priceRange: 'വില ശ്രേണി', brands: 'ബ്രാൻഡുകൾ', rating: 'റേറ്റിംഗ്',
  },
  BN: {
    searchPlaceholder: 'পণ্য, ব্র্যান্ড এবং আরও অনুসন্ধান করুন...',
    home: 'হোম', store: 'স্টোর', cart: 'কার্ট', wishlist: 'উইশলিস্ট',
    myOrders: 'আমার অর্ডার', myProfile: 'আমার প্রোফাইল', login: 'লগইন', logout: 'লগআউট',
    addToCart: 'কার্টে যোগ করুন', buyNow: 'এখনই কিনুন', outOfStock: 'স্টকে নেই',
    inStock: 'স্টকে আছে', explore: 'ক্যাটালগ দেখুন', filters: 'ফিল্টার',
    applyFilters: 'ফিল্টার প্রয়োগ করুন', clearFilters: 'ফিল্টার মুছুন',
    sortBy: 'সাজান', featured: 'বিশেষ', productCatalog: 'পণ্য তালিকা',
    relatedProducts: 'সম্পর্কিত পণ্য', reviews: 'পর্যালোচনা', writeReview: 'পর্যালোচনা লিখুন',
    shoppingCart: 'শপিং কার্ট', emptyCart: 'আপনার শপিং কার্ট খালি',
    checkout: 'নিরাপদ চেকআউট', orderSummary: 'অর্ডার সারাংশ', total: 'মোট',
    subtotal: 'উপমোট', discount: 'ছাড়', deliveryFree: 'বিনামূল্যে ডেলিভারি',
    placeOrder: 'অর্ডার করুন', continueShopping: 'কেনাকাটা চালিয়ে যান',
    freeDelivery: 'বিনামূল্যে এক্সপ্রেস ডেলিভারি', securePayment: '100% নিরাপদ পেমেন্ট',
    easyReturns: 'সহজ ফেরত', allCategories: 'সব বিভাগ',
    electronics: 'ইলেকট্রনিক্স', fashion: 'ফ্যাশন', homeKitchen: 'বাড়ি ও রান্নাঘর',
    sports: 'খেলাধুলা', priceRange: 'মূল্য পরিসীমা', brands: 'ব্র্যান্ড', rating: 'রেটিং',
  },
  MR: {
    searchPlaceholder: 'उत्पादने, ब्रँड्स आणि अधिक शोधा...',
    home: 'मुख्यपृष्ठ', store: 'स्टोअर', cart: 'कार्ट', wishlist: 'इच्छासूची',
    myOrders: 'माझे ऑर्डर', myProfile: 'माझे प्रोफाइल', login: 'लॉगिन', logout: 'लॉगआउट',
    addToCart: 'कार्टमध्ये जोडा', buyNow: 'आत्ता खरेदी करा', outOfStock: 'स्टॉकमध्ये नाही',
    inStock: 'स्टॉकमध्ये आहे', explore: 'कॅटलॉग पहा', filters: 'फिल्टर',
    applyFilters: 'फिल्टर लागू करा', clearFilters: 'फिल्टर साफ करा',
    sortBy: 'क्रमवारी', featured: 'वैशिष्ट्यीकृत', productCatalog: 'उत्पादन यादी',
    relatedProducts: 'संबंधित उत्पादने', reviews: 'पुनरावलोकने', writeReview: 'पुनरावलोकन लिहा',
    shoppingCart: 'शॉपिंग कार्ट', emptyCart: 'तुमची शॉपिंग कार्ट रिकामी आहे',
    checkout: 'सुरक्षित चेकआउट', orderSummary: 'ऑर्डर सारांश', total: 'एकूण',
    subtotal: 'उप-एकूण', discount: 'सूट', deliveryFree: 'मोफत डिलिव्हरी',
    placeOrder: 'ऑर्डर द्या', continueShopping: 'खरेदी सुरू ठेवा',
    freeDelivery: 'मोफत एक्सप्रेस डिलिव्हरी', securePayment: '100% सुरक्षित पेमेंट',
    easyReturns: 'सहज परतावा', allCategories: 'सर्व श्रेणी',
    electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फॅशन', homeKitchen: 'घर आणि स्वयंपाकघर',
    sports: 'खेळ', priceRange: 'किंमत श्रेणी', brands: 'ब्रँड्स', rating: 'रेटिंग',
  },
};

// ─── Context ───────────────────────────────────────────────────────────────

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey) => string;
  currentLang: Language;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key) => key,
  currentLang: SUPPORTED_LANGUAGES[0],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<string>(() =>
    localStorage.getItem('nexusmart_lang') || 'EN'
  );

  const setLanguage = useCallback((code: string) => {
    setLangState(code);
    localStorage.setItem('nexusmart_lang', code);
    document.documentElement.lang = code.toLowerCase();
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const langMap = translations[language] || translations['EN'];
      return langMap[key] || translations['EN'][key] || key;
    },
    [language]
  );

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
