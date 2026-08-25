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
  | 'myOrders' | 'myProfile' | 'login' | 'logout' | 'account'
  | 'addToCart' | 'buyNow' | 'outOfStock' | 'inStock'
  | 'explore' | 'filters' | 'applyFilters' | 'clearFilters'
  | 'sortBy' | 'featured' | 'productCatalog' | 'relatedProducts'
  | 'reviews' | 'writeReview' | 'shoppingCart' | 'emptyCart'
  | 'checkout' | 'orderSummary' | 'total' | 'subtotal' | 'discount'
  | 'deliveryFree' | 'placeOrder' | 'continueShopping'
  | 'freeDelivery' | 'securePayment' | 'easyReturns'
  | 'allCategories' | 'electronics' | 'fashion' | 'homeKitchen'
  | 'sports' | 'priceRange' | 'brands' | 'rating'
  | 'forYou' | 'ladiesWears' | 'mensWear' | 'kidsWear' | 'furnitures' | 'homeAppliances'
  | 'trackOrder' | 'exploreStore' | 'searchBtn' | 'signIn' | 'createAccount'
  | 'heroTitle' | 'heroSubtitle' | 'shopNow' | 'featuredProducts' | 'trendingNow' | 'viewAll' | 'customerReviews'
  | 'reviewsCount' | 'off' | 'trending'
  | 'navHome' | 'navStore' | 'navWishlist' | 'navCart' | 'navAccount'
  | 'cartDrawerTitle' | 'proceedCheckout' | 'viewCart';

type Translations = Record<TranslationKey, string>;

const translations: Record<string, Translations> = {
  EN: {
    searchPlaceholder: 'Search products, brands and more...',
    home: 'Home', store: 'Store', cart: 'Cart', wishlist: 'Wishlist', account: 'Account',
    myOrders: 'My Orders', myProfile: 'My Profile', login: 'Sign In', logout: 'Logout',
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
    forYou: 'For You', ladiesWears: 'Ladies Wears', mensWear: 'Mens Wear',
    kidsWear: 'Kids Wear', furnitures: 'Furnitures', homeAppliances: 'Home Appliances',
    trackOrder: 'Track Order', exploreStore: 'Explore Store', searchBtn: 'Search',
    signIn: 'Sign In', createAccount: 'Create Account',
    heroTitle: 'Next-Gen Shopping for Modern India',
    heroSubtitle: 'Discover curated electronics, trending fashion, and premium home essentials with express shipping and best price guarantee.',
    shopNow: 'Shop Now', featuredProducts: 'Featured Products', trendingNow: 'Trending Deals', viewAll: 'View All',
    customerReviews: 'What Our Customers Say',
    reviewsCount: 'reviews', off: 'OFF', trending: 'Trending',
    navHome: 'Home', navStore: 'Store', navWishlist: 'Wishlist', navCart: 'Cart', navAccount: 'Account',
    cartDrawerTitle: 'Your Cart', proceedCheckout: 'Proceed to Checkout', viewCart: 'View Cart',
  },
  HI: {
    searchPlaceholder: 'उत्पाद, ब्रांड और अधिक खोजें...',
    home: 'होम', store: 'स्टोर', cart: 'कार्ट', wishlist: 'विशलिस्ट', account: 'खाता',
    myOrders: 'मेरे ऑर्डर', myProfile: 'मेरी प्रोफ़ाइल', login: 'साइन इन', logout: 'लॉगआउट',
    addToCart: 'कार्ट में जोड़ें', buyNow: 'अभी खरीदें', outOfStock: 'स्टॉक समाप्त',
    inStock: 'स्टॉक में उपलब्ध', explore: 'कैटलॉग देखें', filters: 'फ़िल्टर',
    applyFilters: 'फ़िल्टर लागू करें', clearFilters: 'फ़िल्टर हटाएं',
    sortBy: 'क्रमबद्ध करें', featured: 'विशेष उत्पाद', productCatalog: 'उत्पाद सूची',
    relatedProducts: 'संबंधित उत्पाद', reviews: 'समीक्षाएं', writeReview: 'समीक्षा लिखें',
    shoppingCart: 'शॉपिंग कार्ट', emptyCart: 'आपका शॉपिंग कार्ट खाली है',
    checkout: 'सुरक्षित चेकआउट', orderSummary: 'ऑर्डर सारांश', total: 'कुल राशि',
    subtotal: 'उप-कुल', discount: 'छूट', deliveryFree: 'मुफ़्त डिलीवरी',
    placeOrder: 'ऑर्डर दें', continueShopping: 'खरीदारी जारी रखें',
    freeDelivery: 'मुफ़्त एक्सप्रेस डिलीवरी', securePayment: '100% सुरक्षित भुगतान',
    easyReturns: '7 दिनों में आसान वापसी', allCategories: 'सभी श्रेणियां',
    electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फैशन', homeKitchen: 'घर और रसोई',
    sports: 'खेल कूद', priceRange: 'मूल्य सीमा', brands: 'ब्रांड', rating: 'रेटिंग',
    forYou: 'आपके लिए', ladiesWears: 'महिलाओं के कपड़े', mensWear: 'पुरुषों के कपड़े',
    kidsWear: 'बच्चों के कपड़े', furnitures: 'फर्नीचर', homeAppliances: 'घरेलू उपकरण',
    trackOrder: 'ऑर्डर ट्रैक करें', exploreStore: 'स्टोर देखें', searchBtn: 'खोजें',
    signIn: 'साइन इन', createAccount: 'खाता बनाएं',
    heroTitle: 'आधुनिक भारत के लिए अगली पीढ़ी की ऑनलाइन शॉपिंग',
    heroSubtitle: 'एक्सप्रेस डिलीवरी और सर्वोत्तम मूल्य गारंटी के साथ इलेक्ट्रॉनिक्स, ट्रेंडिंग फैशन और घरेलू सामान पाएं।',
    shopNow: 'अभी खरीदारी करें', featuredProducts: 'विशेष उत्पाद', trendingNow: 'ट्रेंडिंग ऑफर्स', viewAll: 'सभी देखें',
    customerReviews: 'हमारे संतुष्ट ग्राहक क्या कहते हैं',
    reviewsCount: 'समीक्षाएं', off: 'छूट', trending: 'ट्रेंडिंग',
    navHome: 'होम', navStore: 'स्टोर', navWishlist: 'विशलिस्ट', navCart: 'कार्ट', navAccount: 'खाता',
    cartDrawerTitle: 'आपकी कार्ट', proceedCheckout: 'चेकआउट के लिए आगे बढ़ें', viewCart: 'कार्ट देखें',
  },
  GU: {
    searchPlaceholder: 'ઉત્પાદ, બ્રાન્ડ અને વધુ શોધો...',
    home: 'હોમ', store: 'સ્ટોર', cart: 'કાર્ટ', wishlist: 'વિશલિસ્ટ', account: 'ખાતું',
    myOrders: 'મારા ઓર્ડર', myProfile: 'મારી પ્રોફાઇલ', login: 'સાઇન ઇન', logout: 'લૉગ આઉટ',
    addToCart: 'કાર્ટમાં ઉમેરો', buyNow: 'હવે ખરીદો', outOfStock: 'સ્ટોક નથી',
    inStock: 'સ્ટોકમાં ઉપલબ્ધ', explore: 'કેટલોગ જુઓ', filters: 'ફિલ્ટર',
    applyFilters: 'ફિલ્ટર લાગુ કરો', clearFilters: 'ફિલ્ટર સાફ કરો',
    sortBy: 'ક્રમ અનુસાર', featured: 'ખાસ ઉત્પાદનો', productCatalog: 'ઉત્પાદન સૂચિ',
    relatedProducts: 'સંબંધિત ઉત્પાદનો', reviews: 'સમીક્ષાઓ', writeReview: 'સમીક્ષા લખો',
    shoppingCart: 'શોપિંગ કાર્ટ', emptyCart: 'તમારી શોપિંગ કાર્ટ ખાલી છે',
    checkout: 'સુરક્ષિત ચેકઆઉટ', orderSummary: 'ઓર્ડર સારાંશ', total: 'કુલ રકમ',
    subtotal: 'પેટા-કુલ', discount: 'છૂટ', deliveryFree: 'મફત ડિલિવરી',
    placeOrder: 'ઓર્ડર આપો', continueShopping: 'ખરીદી ચાલુ રાખો',
    freeDelivery: 'મફત એક્સપ્રેસ ડિલિવરી', securePayment: '100% સુરક્ષિત ચુકવણી',
    easyReturns: 'સરળ પરત નીતિ', allCategories: 'બધી શ્રેણીઓ',
    electronics: 'ઇલેક્ટ્રોનિક્સ', fashion: 'ફેશન', homeKitchen: 'ઘર અને રસોઈ',
    sports: 'રમત ગમત', priceRange: 'કિંમત શ્રેણી', brands: 'બ્રાન્ડ્સ', rating: 'રેટિંગ',
    forYou: 'તમારા માટે', ladiesWears: 'મહિલાઓના વસ્ત્રો', mensWear: 'પુરુષોના વસ્ત્રો',
    kidsWear: 'બાળકોના વસ્ત્રો', furnitures: 'ફર્નિચર', homeAppliances: 'ઘર વપરાશ સાધનો',
    trackOrder: 'ઓર્ડર ટ્રેક કરો', exploreStore: 'સ્ટોર જુઓ', searchBtn: 'શોધો',
    signIn: 'સાઇન ઇન', createAccount: 'ખાતું બનાવો',
    heroTitle: 'આધુનિક ભારત માટે આગામી પેઢીની ઓનલાઇન ખરીદી',
    heroSubtitle: 'ઝડપી ડિલિવરી અને શ્રેષ્ઠ કિંમતે ઇલેક્ટ્રોનિક્સ, ટ્રેન્ડિંગ ફેશન અને ઘરગથ્થુ વસ્તુઓ મેળવો.',
    shopNow: 'હવે ખરીદો', featuredProducts: 'વિશેષ ઉત્પાદનો', trendingNow: 'ટ્રેન્ડિંગ ડીલ્સ', viewAll: 'બધા જુઓ',
    customerReviews: 'અમારા ગ્રાહકો શું કહે છે',
    reviewsCount: 'સમીક્ષાઓ', off: 'છૂટ', trending: 'ટ્રેન્ડિંગ',
    navHome: 'હોમ', navStore: 'સ્ટોર', navWishlist: 'વિશલિસ્ટ', navCart: 'કાર્ટ', navAccount: 'ખાતું',
    cartDrawerTitle: 'તમારી કાર્ટ', proceedCheckout: 'ચેકઆઉટ આગળ વધો', viewCart: 'કાર્ટ જુઓ',
  },
  TA: {
    searchPlaceholder: 'பொருட்கள், பிராண்டுகள் தேடுங்கள்...',
    home: 'முகப்பு', store: 'கடை', cart: 'கார்ட்', wishlist: 'விரும்பினவை', account: 'கணக்கு',
    myOrders: 'என் ஆர்டர்கள்', myProfile: 'சுயவிவரம்', login: 'உள்நுழைக', logout: 'வெளியேறு',
    addToCart: 'கார்ட்டில் சேர்', buyNow: 'இப்போது வாங்கு', outOfStock: 'இருப்பு இல்லை',
    inStock: 'இருப்பில் உள்ளது', explore: 'கேட்டலாக் காண்க', filters: 'வடிகட்டிகள்',
    applyFilters: 'வடிகட்டு', clearFilters: 'அழி',
    sortBy: 'வரிசைப்படுத்து', featured: 'சிறப்பு தயாரிப்புகள்', productCatalog: 'தயாரிப்பு பட்டியல்',
    relatedProducts: 'தொடர்புடையவை', reviews: 'மதிப்புரைகள்', writeReview: 'மதிப்புரை எழுது',
    shoppingCart: 'ஷாப்பிங் கார்ட்', emptyCart: 'உங்கள் கார்ட் காலியாக உள்ளது',
    checkout: 'பாதுகாப்பான செக்அவுட்', orderSummary: 'ஆர்டர் சுருக்கம்', total: 'மொத்தம்',
    subtotal: 'துணைமொத்தம்', discount: 'தள்ளுபடி', deliveryFree: 'இலவச டெலிவரி',
    placeOrder: 'ஆர்டர் செய்', continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்',
    freeDelivery: 'இலவச விரைவு டெலிவரி', securePayment: '100% பாதுகாப்பான கட்டணம்',
    easyReturns: 'எளிதான திரும்பல்', allCategories: 'அனைத்து வகைகள்',
    electronics: 'எலக்ட்ரானிக்ஸ்', fashion: 'நாகரிகம்', homeKitchen: 'வீடு & சமையலறை',
    sports: 'விளையாட்டு', priceRange: 'விலை வரம்பு', brands: 'பிராண்டுகள்', rating: 'மதிப்பீடு',
    forYou: 'உங்களுக்காக', ladiesWears: 'பெண்கள் ஆடைகள்', mensWear: 'ஆண்கள் ஆடைகள்',
    kidsWear: 'குழந்தைகள் ஆடைகள்', furnitures: 'தளபாடங்கள்', homeAppliances: 'வீட்டு உபயோகப் பொருட்கள்',
    trackOrder: 'ஆர்டரைக் காண்க', exploreStore: 'கடையை ஆராய்க', searchBtn: 'தேடு',
    signIn: 'உள்நுழைக', createAccount: 'கணக்கு உருவாக்கு',
    heroTitle: 'நவீன இந்தியாவிற்கான அடுத்த தலைமுறை ஆன்லைன் ஷாப்பிங்',
    heroSubtitle: 'சிறந்த விலையில் எலக்ட்ரானிக்ஸ், ஃபேஷன் மற்றும் வீட்டுப் பொருட்களை விரைவான டெலிவரியுடன் பெறுங்கள்.',
    shopNow: 'இப்போது வாங்க', featuredProducts: 'சிறப்பு பொருட்கள்', trendingNow: 'பிரபல சலுகைகள்', viewAll: 'அனைத்தும்',
    customerReviews: 'வாடிக்கையாளர் கருத்துக்கள்',
    reviewsCount: 'மதிப்புரைகள்', off: 'தள்ளுபடி', trending: 'பிரபலமானது',
    navHome: 'முகப்பு', navStore: 'கடை', navWishlist: 'விருப்பம்', navCart: 'கார்ட்', navAccount: 'கணக்கு',
    cartDrawerTitle: 'உங்கள் கார்ட்', proceedCheckout: 'செக்அவுட் தொடரவும்', viewCart: 'கார்ட்டை காண்க',
  },
  TE: {
    searchPlaceholder: 'ఉత్పత్తులు, బ్రాండ్లు వెతకండి...',
    home: 'హోమ్', store: 'స్టోర్', cart: 'కార్ట్', wishlist: 'విష్‌లిస్ట్', account: 'ఖాతా',
    myOrders: 'నా ఆర్డర్లు', myProfile: 'నా ప్రొఫైల్', login: 'సైన్ ఇన్', logout: 'లాగ్అవుట్',
    addToCart: 'కార్ట్‌కు జోడించు', buyNow: 'ఇప్పుడు కొనండి', outOfStock: 'స్టాక్ అయిపోయింది',
    inStock: 'స్టాక్‌లో ఉంది', explore: 'కేటలాగ్ చూడండి', filters: 'ఫిల్టర్లు',
    applyFilters: 'ఫిల్టర్లు వర్తింపజేయి', clearFilters: 'ఫిల్టర్లు తొలగించు',
    sortBy: 'క్రమబద్ధీకరించు', featured: 'ప్రత్యేక ఉత్పత్తులు', productCatalog: 'ఉత్పత్తి జాబితా',
    relatedProducts: 'సంబంధిత ఉత్పత్తులు', reviews: 'సమీక్షలు', writeReview: 'సమీక్ష రాయండి',
    shoppingCart: 'షాపింగ్ కార్ట్', emptyCart: 'మీ షాపింగ్ కార్ట్ ఖాళీగా ఉంది',
    checkout: 'సురక్షిత చెక్అవుట్', orderSummary: 'ఆర్డర్ సారాంశం', total: 'మొత్తం',
    subtotal: 'ఉప మొత్తం', discount: 'తగ్గింపు', deliveryFree: 'ఉచిత డెలివరీ',
    placeOrder: 'ఆర్డర్ చేయండి', continueShopping: 'షాపింగ్ కొనసాగించండి',
    freeDelivery: 'ఉచిత ఎక్స్‌ప్రెస్ డెలివరీ', securePayment: '100% సురక్షిత చెల్లింపు',
    easyReturns: 'సులభమైన రిటర్న్లు', allCategories: 'అన్ని వర్గాలు',
    electronics: 'ఎలక్ట్రానిక్స్', fashion: 'ఫ్యాషన్', homeKitchen: 'ఇల్లు & వంటగది',
    sports: 'క్రీడలు', priceRange: 'ధర పరిధి', brands: 'బ్రాండ్లు', rating: 'రేటింగ్',
    forYou: 'మీ కోసం', ladiesWears: 'మహిళల దుస్తులు', mensWear: 'పురుషుల దుస్తులు',
    kidsWear: 'పిల్లల దుస్తులు', furnitures: 'ఫర్నిచర్', homeAppliances: 'గృహోపకరణాలు',
    trackOrder: 'ఆర్డర్ ట్రాక్', exploreStore: 'స్టోర్ చూడండి', searchBtn: 'వెతకండి',
    signIn: 'సైన్ ఇన్', createAccount: 'ఖాతా సృష్టించండి',
    heroTitle: 'ఆధునిక భారతదేశం కోసం తదుపరి తరం ఆన్‌లైన్ షాపింగ్',
    heroSubtitle: 'ఎలక్ట్రానిక్స్, ట్రెండింగ్ ఫ్యాషన్ మరియు గృహావసరాలను ఎక్స్‌ప్రెస్ డెలివరీతో ఉత్తమ ధరకు పొందండి.',
    shopNow: 'ఇప్పుడే కొనండి', featuredProducts: 'ఫీచర్డ్ ఉత్పత్తులు', trendingNow: 'ట్రెండింగ్ ఆఫర్లు', viewAll: 'అన్నీ చూడండి',
    customerReviews: 'మా కస్టమర్ల అభిప్రాయాలు',
    reviewsCount: 'సమీక్షలు', off: 'తగ్గింపు', trending: 'ట్రెండింగ్',
    navHome: 'హోమ్', navStore: 'స్టోర్', navWishlist: 'విష్‌లిస్ట్', navCart: 'కార్ట్', navAccount: 'ఖాతా',
    cartDrawerTitle: 'మీ కార్ట్', proceedCheckout: 'చెక్అవుట్‌కు వెళ్లండి', viewCart: 'కార్ట్ చూడండి',
  },
  KN: {
    searchPlaceholder: 'ಉತ್ಪನ್ನಗಳು, ಬ್ರಾಂಡ್‌ಗಳು ಹುಡುಕಿ...',
    home: 'ಮುಖಪುಟ', store: 'ಅಂಗಡಿ', cart: 'ಕಾರ್ಟ್', wishlist: 'ವಿಷ್‌ಲಿಸ್ಟ್', account: 'ಖಾತೆ',
    myOrders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು', myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', login: 'ಸೈನ್ ಇನ್', logout: 'ಲಾಗ್ ಔಟ್',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', buyNow: 'ಈಗ ಖರೀದಿಸಿ', outOfStock: 'ಸ್ಟಾಕ್ ಮುಗಿದಿದೆ',
    inStock: 'ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ', explore: 'ಕ್ಯಾಟಲಾಗ್ ನೋಡಿ', filters: 'ಫಿಲ್ಟರ್‌ಗಳು',
    applyFilters: 'ಫಿಲ್ಟರ್ ಅನ್ವಯಿಸಿ', clearFilters: 'ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ',
    sortBy: 'ವಿಂಗಡಿಸಿ', featured: 'ವಿಶೇಷ ಉತ್ಪನ್ನಗಳು', productCatalog: 'ಉತ್ಪನ್ನ ಪಟ್ಟಿ',
    relatedProducts: 'ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳು', reviews: 'ವಿಮರ್ಶೆಗಳು', writeReview: 'ವಿಮರ್ಶೆ ಬರೆಯಿರಿ',
    shoppingCart: 'ಶಾಪಿಂಗ್ ಕಾರ್ಟ್', emptyCart: 'ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    checkout: 'ಸುರಕ್ಷಿತ ಚೆಕ್‌ಔಟ್', orderSummary: 'ಆರ್ಡರ್ ಸಾರಾಂಶ', total: 'ಒಟ್ಟು ಮೊತ್ತ',
    subtotal: 'ಉಪ-ಮೊತ್ತ', discount: 'ರಿಯಾಯಿತಿ', deliveryFree: 'ಉಚಿತ ಡೆಲಿವರಿ',
    placeOrder: 'ಆರ್ಡರ್ ಮಾಡಿ', continueShopping: 'ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ',
    freeDelivery: 'ಉಚಿತ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ', securePayment: '100% ಸುರಕ್ಷಿತ ಪಾವತಿ',
    easyReturns: 'ಸುಲಭ ರಿಟರ್ನ್', allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    electronics: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್', fashion: 'ಫ್ಯಾಷನ್', homeKitchen: 'ಮನೆ & ಅಡುಗೆಮನೆ',
    sports: 'ಕ್ರೀಡೆ', priceRange: 'ಬೆಲೆ ಶ್ರೇಣಿ', brands: 'ಬ್ರಾಂಡ್‌ಗಳು', rating: 'ರೇಟಿಂಗ್',
    forYou: 'ನಿಮಗಾಗಿ', ladiesWears: 'ಮಹಿಳೆಯರ ಉಡುಪು', mensWear: 'ಪುರುಷರ ಉಡುಪು',
    kidsWear: 'ಮಕ್ಕಳ ಉಡುಪು', furnitures: 'ಪೀಠೋಪಕರಣಗಳು', homeAppliances: 'ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳು',
    trackOrder: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್', exploreStore: 'ಅಂಗಡಿ ಅನ್ವೇಷಿಸಿ', searchBtn: 'ಹುಡುಕಿ',
    signIn: 'ಸೈನ್ ಇನ್', createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    heroTitle: 'ಆಧುನಿಕ ಭಾರತಕ್ಕಾಗಿ ಮುಂದಿನ ಪೀಳಿಗೆಯ ಶಾಪಿಂಗ್',
    heroSubtitle: 'ಅತ್ಯುತ್ತಮ ಬೆಲೆಯಲ್ಲಿ ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್, ಫ್ಯಾಷನ್ ಮತ್ತು ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳನ್ನು ವೇಗದ ಡೆಲಿವರಿಯೊಂದಿಗೆ ಪಡೆಯಿರಿ.',
    shopNow: 'ಈಗ ಖರೀದಿಸಿ', featuredProducts: 'ವಿಶೇಷ ಉತ್ಪನ್ನಗಳು', trendingNow: 'ಟ್ರೆಂಡಿಂಗ್ ಡೀಲ್ಸ್', viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    customerReviews: 'ನಮ್ಮ ಗ್ರಾಹಕರ ಅಭಿಪ್ರಾಯಗಳು',
    reviewsCount: 'ವಿಮರ್ಶೆಗಳು', off: 'ರಿಯಾಯಿತಿ', trending: 'ಟ್ರೆಂಡಿಂಗ್',
    navHome: 'ಮುಖಪುಟ', navStore: 'ಅಂಗಡಿ', navWishlist: 'ವಿಷ್‌ಲಿಸ್ಟ್', navCart: 'ಕಾರ್ಟ್', navAccount: 'ಖಾತೆ',
    cartDrawerTitle: 'ನಿಮ್ಮ ಕಾರ್ಟ್', proceedCheckout: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ', viewCart: 'ಕಾರ್ಟ್ ವೀಕ್ಷಿಸಿ',
  },
  ML: {
    searchPlaceholder: 'ഉൽപ്പന്നങ്ങൾ, ബ്രാൻഡുകൾ തിരയുക...',
    home: 'ഹോം', store: 'സ്റ്റോർ', cart: 'കാർട്ട്', wishlist: 'വിഷ്‌ലിസ്റ്റ്', account: 'അക്കൗണ്ട്',
    myOrders: 'എന്റെ ഓർഡറുകൾ', myProfile: 'എന്റെ പ്രൊഫൈൽ', login: 'സൈൻ ഇൻ', logout: 'ലോഗ്ഔട്ട്',
    addToCart: 'കാർട്ടിൽ ചേർക്കുക', buyNow: 'ഇപ്പോൾ വാങ്ങുക', outOfStock: 'സ്റ്റോക്ക് തീർന്നു',
    inStock: 'സ്റ്റോക്കിലുണ്ട്', explore: 'കാറ്റലോഗ് കാണുക', filters: 'ഫിൽട്ടറുകൾ',
    applyFilters: 'ഫിൽട്ടർ പ്രയോഗിക്കുക', clearFilters: 'ഫിൽട്ടർ മായ്ക്കുക',
    sortBy: 'ക്രമീകരിക്കുക', featured: 'പ്രത്യേക ഉൽപ്പന്നങ്ങൾ', productCatalog: 'ഉൽപ്പന്ന പട്ടിക',
    relatedProducts: 'അനുബന്ധ ഉൽപ്പന്നങ്ങൾ', reviews: 'അവലോകനങ്ങൾ', writeReview: 'അവലോകനം എഴുതുക',
    shoppingCart: 'ഷോപ്പിംഗ് കാർട്ട്', emptyCart: 'നിങ്ങളുടെ കാർട്ട് ഒഴിഞ്ഞിരിക്കുന്നു',
    checkout: 'സുരക്ഷിത ചെക്ക്ഔട്ട്', orderSummary: 'ഓർഡർ സംഗ്രഹം', total: 'ആകെ തുക',
    subtotal: 'ഉപ-ആകെ', discount: 'കിഴിവ്', deliveryFree: 'സൗജന്യ ഡെലിവറി',
    placeOrder: 'ഓർഡർ ചെയ്യുക', continueShopping: 'ഷോപ്പിംഗ് തുടരുക',
    freeDelivery: 'സൗജന്യ എക്സ്പ്രസ് ഡെലിവറി', securePayment: '100% സുരക്ഷിത പേയ്‌മെന്റ്',
    easyReturns: 'എളുപ്പമുള്ള റിട്ടേൺ', allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    electronics: 'ഇലക്ട്രോണിക്‌സ്', fashion: 'ഫാഷൻ', homeKitchen: 'വീട് & അടുക്കള',
    sports: 'കായിക ഇനങ്ങൾ', priceRange: 'വില പരിധി', brands: 'ബ്രാൻഡുകൾ', rating: 'റേറ്റിംഗ്',
    forYou: 'നിങ്ങൾക്കായി', ladiesWears: 'വനിതാ വസ്ത്രങ്ങൾ', mensWear: 'പുരുഷ വസ്ത്രങ്ങൾ',
    kidsWear: 'കുട്ടികളുടെ വസ്ത്രങ്ങൾ', furnitures: 'ഫർണിച്ചർ', homeAppliances: 'വീട്ടുപകരണങ്ങൾ',
    trackOrder: 'ഓർഡർ ട്രാക്ക്', exploreStore: 'സ്റ്റോർ കാണുക', searchBtn: 'തിരയുക',
    signIn: 'സൈൻ ഇൻ', createAccount: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    heroTitle: 'ആധുനിക ഇന്ത്യയ്ക്കായി പുതിയ തലമുറ ഓൺലൈൻ ഷോപ്പിംഗ്',
    heroSubtitle: 'ഇലക്‌ട്രോണിക്‌സും ട്രെൻഡിംഗ് ഫാഷനും വീട്ടുപകരണങ്ങളും മികച്ച വിലയിൽ വേഗത്തിൽ സ്വന്തമാക്കൂ.',
    shopNow: 'ഇപ്പോൾ വാങ്ങൂ', featuredProducts: 'പ്രത്യേക ഉൽപ്പന്നങ്ങൾ', trendingNow: 'ട്രെൻഡിംഗ് ഡീലുകൾ', viewAll: 'എല്ലാം കാണുക',
    customerReviews: 'ഞങ്ങളുടെ ഉപഭോക്താക്കൾ പറയുന്നത്',
    reviewsCount: 'അവലോകനങ്ങൾ', off: 'കിഴിവ്', trending: 'ട്രെൻഡിംഗ്',
    navHome: 'ഹോം', navStore: 'സ്റ്റോർ', navWishlist: 'വിഷ്‌ലിസ്റ്റ്', navCart: 'കാർട്ട്', navAccount: 'അക്കൗണ്ട്',
    cartDrawerTitle: 'നിങ്ങളുടെ കാർട്ട്', proceedCheckout: 'ചെക്ക്ഔട്ടിലേക്ക് പോകുക', viewCart: 'കാർട്ട് കാണുക',
  },
  BN: {
    searchPlaceholder: 'পণ্য, ব্র্যান্ড এবং আরও অনুসন্ধান করুন...',
    home: 'হোম', store: 'স্টোর', cart: 'কার্ট', wishlist: 'উইশলিস্ট', account: 'অ্যাকাউন্ট',
    myOrders: 'আমার অর্ডার', myProfile: 'আমার প্রোফাইল', login: 'সাইন ইন', logout: 'লগআউট',
    addToCart: 'কার্টে যোগ করুন', buyNow: 'এখনই কিনুন', outOfStock: 'স্টক শেষ',
    inStock: 'স্টকে উপলব্ধ', explore: 'ক্যাটালগ দেখুন', filters: 'ফিল্টার',
    applyFilters: 'ফিল্টার প্রয়োগ করুন', clearFilters: 'ফিল্টার মুছুন',
    sortBy: 'সাজান', featured: 'বিশেষ পণ্য', productCatalog: 'পণ্য তালিকা',
    relatedProducts: 'সম্পর্কিত পণ্য', reviews: 'পর্যালোচনা', writeReview: 'পর্যালোচনা লিখুন',
    shoppingCart: 'শপিং কার্ট', emptyCart: 'আপনার শপিং কার্ট খালি',
    checkout: 'নিরাপদ চেকআউট', orderSummary: 'অর্ডার সারাংশ', total: 'মোট মূল্য',
    subtotal: 'উপমোট', discount: 'ছাড়', deliveryFree: 'বিনামূল্যে ডেলিভারি',
    placeOrder: 'অর্ডার নিশ্চিত করুন', continueShopping: 'কেনাকাটা চালিয়ে যান',
    freeDelivery: 'বিনামূল্যে এক্সপ্রেস ডেলিভারি', securePayment: '100% নিরাপদ পেমেন্ট',
    easyReturns: 'সহজ রিটার্ন পলিসি', allCategories: 'সব বিভাগ',
    electronics: 'ইলেকট্রনিক্স', fashion: 'ফ্যাশন', homeKitchen: 'বাড়ি ও রান্নাঘর',
    sports: 'খেলাধুলা', priceRange: 'মূল্য পরিসীমা', brands: 'ব্র্যান্ড', rating: 'রেটিং',
    forYou: 'আপনার জন্য', ladiesWears: 'মহিলাদের পোশাক', mensWear: 'পুরুষদের পোশাক',
    kidsWear: 'বাচ্চাদের পোশাক', furnitures: 'আসবাবপত্র', homeAppliances: 'গৃহস্থালী সামগ্রী',
    trackOrder: 'অর্ডার ট্র্যাক করুন', exploreStore: 'স্টোর দেখুন', searchBtn: 'খুঁজুন',
    signIn: 'সাইন ইন', createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    heroTitle: 'আধুনিক ভারতের জন্য পরবর্তী প্রজন্মের অনলাইন শপিং',
    heroSubtitle: 'সেরা মূল্যে ইলেকট্রনিক্স, ট্রেন্ডিং ফ্যাশন ও গৃহস্থালী পণ্য দ্রুততম ডেলিভারির সাথে পান।',
    shopNow: 'এখনই কিনুন', featuredProducts: 'বিশেষ পণ্য', trendingNow: 'ট্রেন্ডিং অফার', viewAll: 'সব দেখুন',
    customerReviews: 'আমাদের সন্তুষ্ট গ্রাহকরা কী বলছেন',
    reviewsCount: 'পর্যালোচনা', off: 'ছাড়', trending: 'ট্রেন্ডিং',
    navHome: 'হোম', navStore: 'স্টোর', navWishlist: 'উইশলিস্ট', navCart: 'কার্ট', navAccount: 'অ্যাকাউন্ট',
    cartDrawerTitle: 'আপনার কার্ট', proceedCheckout: 'চেকআউটে যান', viewCart: 'কার্ট দেখুন',
  },
  MR: {
    searchPlaceholder: 'उत्पादने, ब्रँड्स आणि अधिक शोधा...',
    home: 'मुख्यपृष्ठ', store: 'स्टोअर', cart: 'कार्ट', wishlist: 'इच्छासूची', account: 'खाते',
    myOrders: 'माझे ऑर्डर', myProfile: 'माझे प्रोफाइल', login: 'साइन इन', logout: 'लॉगआउट',
    addToCart: 'कार्टमध्ये जोडा', buyNow: 'आत्ता खरेदी करा', outOfStock: 'स्टॉक संपला',
    inStock: 'स्टॉकमध्ये उपलब्ध', explore: 'कॅटलॉग पहा', filters: 'फिल्टर',
    applyFilters: 'फिल्टर लागू करा', clearFilters: 'फिल्टर साफ करा',
    sortBy: 'क्रमवारी लावा', featured: 'खास उत्पादने', productCatalog: 'उत्पादन यादी',
    relatedProducts: 'संबंधित उत्पादने', reviews: 'पुनरावलोकने', writeReview: 'पुनरावलोकन लिहा',
    shoppingCart: 'शॉपिंग कार्ट', emptyCart: 'तुमची शॉपिंग कार्ट रिकामी आहे',
    checkout: 'सुरक्षित चेकआउट', orderSummary: 'ऑर्डर सारांश', total: 'एकूण रक्कम',
    subtotal: 'उप-एकूण', discount: 'सूट', deliveryFree: 'मोफत डिलिव्हरी',
    placeOrder: 'ऑर्डर द्या', continueShopping: 'खरेदी सुरू ठेवा',
    freeDelivery: 'मोफत एक्सप्रेस डिलिव्हरी', securePayment: '100% सुरक्षित पेमेंट',
    easyReturns: 'सहज परतावा', allCategories: 'सर्व श्रेणी',
    electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फॅशन', homeKitchen: 'घर आणि स्वयंपाकघर',
    sports: 'खेळ', priceRange: 'किंमत श्रेणी', brands: 'ब्रँड्स', rating: 'रेटिंग',
    forYou: 'तुमच्यासाठी', ladiesWears: 'महिलांचे कपडे', mensWear: 'पुरुषांचे कपडे',
    kidsWear: 'लहान मुलांचे कपडे', furnitures: 'फर्निचर', homeAppliances: 'घरगुती उपकरणे',
    trackOrder: 'ऑर्डर ट्रॅक करा', exploreStore: 'स्टोअर एक्सप्लोर करा', searchBtn: 'शोधा',
    signIn: 'साइन इन', createAccount: 'खाते तयार करा',
    heroTitle: 'आधुनिक भारतासाठी पुढच्या पिढीची ऑनलाइन शॉपिंग',
    heroSubtitle: 'उत्तम किंमतीत इलेक्ट्रॉनिक्स, फॅशन आणि घरगुती वस्तू जलद डिलिव्हरीसह मिळवा.',
    shopNow: 'आत्ता खरेदी करा', featuredProducts: 'वैशिष्ट्यीकृत उत्पादने', trendingNow: 'ट्रेंडिंग ऑफर्स', viewAll: 'सर्व पहा',
    customerReviews: 'आमचे ग्राहक काय म्हणतात',
    reviewsCount: 'पुनरावलोकने', off: 'सूट', trending: 'ट्रेंडिंग',
    navHome: 'मुख्यपृष्ठ', navStore: 'स्टोअर', navWishlist: 'इच्छासूची', navCart: 'कार्ट', navAccount: 'खाते',
    cartDrawerTitle: 'तुमची कार्ट', proceedCheckout: 'चेकआउटकडे जा', viewCart: 'कार्ट पहा',
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

export const useLanguage = () => useContext(LanguageContext)
