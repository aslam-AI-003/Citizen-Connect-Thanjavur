// ===== FULL LANGUAGE SYSTEM - THANJAVUR CITIZEN CONNECT =====
// Every text in the website is covered here for complete Tamil ↔ English translation

const TRANSLATIONS = {
    // ===== BRAND =====
    'brand_text': { ta: 'மக்கள் குறை தீர்வு மேடை', en: 'Citizen Connect' },
    'brand_sub': { ta: '| தஞ்சாவூர்', en: '| Thanjavur' },

    // ===== NAVBAR =====
    'nav_home': { ta: 'முகப்பு', en: 'Home' },
    'nav_complaint': { ta: 'புகார் செய்', en: 'File Complaint' },
    'nav_mycomplaints': { ta: 'என் புகார்கள்', en: 'My Complaints' },
    'nav_updates': { ta: 'அறிவிப்புகள்', en: 'Updates' },
    'nav_dashboard': { ta: 'நிலை பலகை', en: 'Dashboard' },

    // ===== HERO SECTION =====
    'hero_badge': { ta: '🏛️ TAMILAGA VETTRI KAZHAGAM', en: '🏛️ TAMILAGA VETTRI KAZHAGAM' },
    'hero_title': { ta: 'மக்கள் குறை தீர்வு மேடை', en: "Citizen Grievance Platform" },
    'hero_subtitle': { ta: 'தஞ்சாவூர் தொகுதி', en: 'Thanjavur Constituency' },
    'hero_desc': { ta: 'தஞ்சாவூர் தொகுதியின் ஒவ்வொரு குரலும் MLA அலுவலகம் வரை நேரடியாக சேரும். புகார் செய்யுங்கள், நிலையை track செய்யுங்கள்.', en: 'Every voice from Thanjavur constituency directly reaches the MLA office. File complaints, track status in real-time.' },
    'hero_btn_complaint': { ta: '<i class="fas fa-plus-circle"></i> புகார் பதிவு செய்', en: '<i class="fas fa-plus-circle"></i> File Complaint' },
    'hero_btn_track': { ta: '<i class="fas fa-search"></i> புகார் நிலை காண', en: '<i class="fas fa-search"></i> Track Status' },

    // Hero Stats
    'stat_total': { ta: 'மொத்த புகார்கள்', en: 'Total Complaints' },
    'stat_resolved': { ta: 'தீர்க்கப்பட்டவை', en: 'Resolved' },
    'stat_rate': { ta: 'தீர்வு விகிதம் %', en: 'Resolution Rate %' },
    'stat_avg': { ta: 'சராசரி நாட்கள்', en: 'Avg Days' },

    // ===== HOW IT WORKS =====
    'how_title': { ta: 'எப்படி செயல்படுகிறது?', en: 'How It Works?' },
    'step1_title': { ta: 'புகார் பதிவு', en: 'Register Complaint' },
    'step1_desc': { ta: 'உங்கள் பிரச்சனையை Tamil-ல பேசி அல்லது type செய்து பதிவு செய்யுங்கள்', en: 'Speak in Tamil or type your complaint to register it' },
    'step2_how_title': { ta: 'ஒதுக்கப்படும்', en: 'Gets Assigned' },
    'step2_how_desc': { ta: 'MLA அலுவலகம் சரியான அதிகாரிக்கு ஒதுக்கும்', en: 'MLA office assigns to the right official' },
    'step3_how_title': { ta: 'பணி நடைபெறும்', en: 'Work In Progress' },
    'step3_how_desc': { ta: 'அதிகாரிகள் களத்தில் பணி செய்வார்கள்', en: 'Officials will work on the ground' },
    'step4_how_title': { ta: 'தீர்வு', en: 'Resolution' },
    'step4_how_desc': { ta: 'பிரச்சனை தீர்க்கப்பட்டு உறுதிப்படுத்தப்படும்', en: 'Issue will be resolved and confirmed' },

    // ===== RECENT COMPLAINTS =====
    'recent_title': { ta: '<i class="fas fa-list-alt"></i> சமீபத்திய புகார்கள்', en: '<i class="fas fa-list-alt"></i> Recent Complaints' },
    'recent_viewall': { ta: 'அனைத்தும் காண →', en: 'View All →' },

    // ===== MLA SECTION =====
    'mla_card_title': { ta: 'சட்டமன்ற உறுப்பினர் - தஞ்சாவூர்', en: 'MLA - Thanjavur' },
    'mla_card_party': { ta: 'தமிழக வெற்றி கழகம்', en: 'Tamilaga Vettri Kazhagam' },
    'mla_title_text': { ta: '🏛️ MLA - Thanjavur Constituency ', en: '🏛️ MLA - Thanjavur Constituency ' },
    'mla_party_text': { ta: 'Tamil Nadu Legislative Assembly | Tamilaga Vettri Kazhagam', en: 'Tamil Nadu Legislative Assembly | Tamilaga Vettri Kazhagam' },
    'mla_quote': { ta: '"மக்கள் சேவையே மகேசன் சேவை. தஞ்சாவூர் தொகுதி மக்களின் அனைத்து குறைகளும் தீர்க்கப்படும்."', en: '"Service to people is service to God. All grievances of Thanjavur constituency will be resolved."' },

    // ===== COMPLAINT FORM =====
    'form_main_title': { ta: '<i class="fas fa-edit"></i> புகார் பதிவு செய்யுங்கள்', en: '<i class="fas fa-edit"></i> Register Your Complaint' },
    'form_main_sub': { ta: 'உங்கள் பகுதி பிரச்சனையை 3 எளிய படிகளில் பதிவு செய்யுங்கள்', en: 'Register your area issue in 3 simple steps' },

    // Wizard Steps
    'wizard_step1': { ta: 'யார்?', en: 'Who?' },
    'wizard_step2': { ta: 'என்ன?', en: 'What?' },
    'wizard_step3': { ta: 'எங்கே?', en: 'Where?' },

    // Step 1
    'step1_heading': { ta: '👤 உங்கள் தகவல்கள்', en: '👤 Your Information' },
    'step1_sub': { ta: 'புகார் செய்பவரின் விவரங்கள்', en: 'Complainant details' },
    'label_name': { ta: 'பெயர் (Name) <span class="required">*</span>', en: 'Name <span class="required">*</span>' },
    'label_mobile': { ta: 'தொலைபேசி எண் (Mobile) <span class="required">*</span>', en: 'Mobile Number <span class="required">*</span>' },
    'label_ward': { ta: 'வார்டு எண் (Ward No.) <span class="required">*</span>', en: 'Ward Number <span class="required">*</span>' },
    'label_street': { ta: 'தெரு (Street) <span class="required">*</span>', en: 'Street <span class="required">*</span>' },
    'ph_name': { ta: 'உங்கள் முழு பெயர்', en: 'Your full name' },
    'ph_mobile': { ta: '98765 43210', en: '98765 43210' },

    // Step 2
    'step2_heading': { ta: '📋 புகார் விவரங்கள்', en: '📋 Complaint Details' },
    'step2_sub': { ta: 'பிரச்சனை என்ன என்பதை தெரிவிக்கவும்', en: 'Describe the issue' },
    'label_dept': { ta: 'Government Department / குறை தொடர்புடைய அரசு துறை <span class="required">*</span>', en: 'Government Department <span class="required">*</span>' },
    'label_grievance': { ta: 'Grievance Type / குறையின் வகை <span class="required">*</span>', en: 'Grievance Type <span class="required">*</span>' },
    'label_title': { ta: 'புகார் தலைப்பு <span class="required">*</span>', en: 'Complaint Title <span class="required">*</span>' },
    'label_desc': { ta: 'விரிவான விளக்கம்', en: 'Detailed Description' },
    'label_photo': { ta: 'புகைப்படம் இணைக்க', en: 'Attach Photo/Video' },
    'ph_title': { ta: 'உதா: சாலையில் பள்ளம், Street light வேலை செய்யல', en: 'E.g.: Pothole on road, Street light not working' },
    'ph_desc': { ta: 'பிரச்சனையை விரிவாக எழுதுங்கள்... அல்லது 🎤 பொத்தானை அழுத்தி தமிழில் பேசுங்கள்', en: 'Describe the issue in detail... or press 🎤 and speak in Tamil' },
    'upload_text': { ta: 'Click to upload or drag & drop', en: 'Click to upload or drag & drop' },
    'upload_format': { ta: 'JPG, PNG, MP4 (Max 10MB)', en: 'JPG, PNG, MP4 (Max 10MB)' },
    'label_other_dept': { ta: 'Department பெயர் எழுதுங்கள் <span class="required">*</span>', en: 'Write Department Name <span class="required">*</span>' },

    // Step 3
    'step3_heading': { ta: '📍 இடம் & சமர்ப்பிப்பு', en: '📍 Location & Submit' },
    'step3_sub': { ta: 'சரியான இடத்தை குறிப்பிடவும்', en: 'Specify the correct location' },
    'label_gps': { ta: 'GPS இடம் (Location)', en: 'GPS Location' },
    'btn_location': { ta: '<i class="fas fa-crosshairs"></i> 📍 என் இடத்தை பெற', en: '<i class="fas fa-crosshairs"></i> 📍 Get My Location' },
    'location_placeholder': { ta: 'இடம் குறிப்பிடப்படவில்லை', en: 'Location not set' },
    'map_placeholder': { ta: 'Location பெற்ற பின் Map இங்கே தெரியும்', en: 'Map will appear after getting location' },
    'label_address': { ta: 'முகவரி (விருப்பம்)', en: 'Address (Optional)' },
    'ph_address': { ta: 'சாலை பெயர், அடையாளம் (Landmark)', en: 'Street name, Landmark' },

    // Review Summary
    'review_heading': { ta: '<i class="fas fa-clipboard-check"></i> உங்கள் புகார் சுருக்கம்', en: '<i class="fas fa-clipboard-check"></i> Your Complaint Summary' },
    'review_name': { ta: 'பெயர்:', en: 'Name:' },
    'review_phone': { ta: 'தொலைபேசி:', en: 'Phone:' },
    'review_area': { ta: 'பகுதி:', en: 'Area:' },
    'review_category': { ta: 'வகை:', en: 'Category:' },
    'review_title_label': { ta: 'தலைப்பு:', en: 'Title:' },

    // Buttons
    'btn_next': { ta: 'அடுத்து <i class="fas fa-arrow-right"></i>', en: 'Next <i class="fas fa-arrow-right"></i>' },
    'btn_back': { ta: '<i class="fas fa-arrow-left"></i> முந்தைய', en: '<i class="fas fa-arrow-left"></i> Previous' },
    'btn_submit': { ta: '<i class="fas fa-paper-plane"></i> புகார் சமர்ப்பி', en: '<i class="fas fa-paper-plane"></i> Submit Complaint' },

    // ===== TRACK PAGE =====
    'track_title': { ta: '<i class="fas fa-search"></i> புகார் நிலை காண', en: '<i class="fas fa-search"></i> Track Complaint Status' },
    'track_sub': { ta: 'உங்கள் புகார் எந்த நிலையில் உள்ளது என பாருங்கள்', en: 'Check the current status of your complaint' },
    'track_btn': { ta: '<i class="fas fa-search"></i> தேடு', en: '<i class="fas fa-search"></i> Search' },
    'ph_track': { ta: 'TVK/TNJ/2026/00101 அல்லது Mobile Number', en: 'TVK/TNJ/2026/00101 or Mobile Number' },

    // ===== MY COMPLAINTS =====
    'mycomp_title': { ta: '<i class="fas fa-user-shield"></i> என் புகார்கள்', en: '<i class="fas fa-user-shield"></i> My Complaints' },
    'mycomp_sub': { ta: 'உங்கள் அனைத்து புகார்களின் நிலையை இங்கே பாருங்கள்', en: 'View status of all your complaints here' },
    'mycomp_search_btn': { ta: '<i class="fas fa-search"></i> தேடு', en: '<i class="fas fa-search"></i> Search' },
    'mycomp_hint': { ta: 'Mobile Number enter செய்தால் உங்கள் அனைத்து புகார்களும் தெரியும்', en: 'Enter your Mobile Number to see all your complaints' },
    'ph_citizen_search': { ta: 'உங்கள் Mobile Number அல்லது Complaint ID', en: 'Your Mobile Number or Complaint ID' },
    'mycomp_total': { ta: 'மொத்த புகார்கள்', en: 'Total Complaints' },
    'mycomp_pending': { ta: 'நிலுவையில்', en: 'Pending' },
    'mycomp_resolved': { ta: 'தீர்வு', en: 'Resolved' },

    // ===== UPDATES PAGE =====
    'updates_title': { ta: '<i class="fas fa-newspaper"></i> அறிவிப்புகள்', en: '<i class="fas fa-newspaper"></i> Updates & Announcements' },
    'updates_sub': { ta: 'ஆர். விஜய்சரவணன் - சட்டமன்ற உறுப்பினர் | தஞ்சாவூர் தொகுதி', en: 'R. Vijaysaravanan - MLA | Thanjavur Constituency' },

    // ===== DASHBOARD =====
    'dash_title': { ta: '<i class="fas fa-tachometer-alt"></i> தொகுதி நிலை அறிக்கை', en: '<i class="fas fa-tachometer-alt"></i> Constituency Status Report' },
    'dash_sub': { ta: 'R. Vijaysaravanan | MLA - தஞ்சாவூர் தொகுதி', en: 'R. Vijaysaravanan | MLA - Thanjavur Constituency' },
    'dash_trust_title': { ta: '🏆 மக்கள் நம்பிக்கை குறியீடு', en: '🏆 People\'s Trust Index' },
    'dash_trust_sub': { ta: 'மக்கள் நம்பிக்கை மதிப்பெண்', en: 'People\'s Trust Score' },
    'dash_trust_label': { ta: 'நம்பிக்கை', en: 'Trust' },
    'dash_stat_total': { ta: 'மொத்தம்', en: 'Total' },
    'dash_stat_today': { ta: 'இன்று புதிய', en: 'New Today' },
    'dash_stat_resolved': { ta: 'மொத்த தீர்வு', en: 'Total Resolved' },
    'dash_stat_today_res': { ta: 'இன்று தீர்வு', en: 'Resolved Today' },
    'dash_stat_pending': { ta: 'நிலுவை', en: 'Pending' },
    'dash_stat_inprogress': { ta: 'பணியில்', en: 'In Progress' },
    'dash_this_week': { ta: 'இந்த வாரம்', en: 'This Week' },
    'dash_this_month': { ta: 'இந்த மாதம்', en: 'This Month' },
    'dash_new_filed': { ta: 'புதிய புகார்', en: 'New Filed' },
    'dash_resolved_label': { ta: 'தீர்வு செய்யப்பட்டவை', en: 'Resolved' },
    'dash_area_title': { ta: '<i class="fas fa-chart-bar"></i> பகுதிவாரி புகார்கள்', en: '<i class="fas fa-chart-bar"></i> Area-wise Complaints' },
    'dash_cat_title': { ta: '<i class="fas fa-chart-pie"></i> வகைவாரி புகார்கள்', en: '<i class="fas fa-chart-pie"></i> Category-wise Complaints' },
    'dash_weekly_title': { ta: '<i class="fas fa-chart-line"></i> வாரவாரி தீர்வு', en: '<i class="fas fa-chart-line"></i> Weekly Resolution Graph' },

    // ===== SUCCESS MODAL =====
    'success_heading': { ta: '✅ புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!', en: '✅ Complaint Registered Successfully!' },
    'success_status': { ta: '⏳ நிலை: நிலுவையில் (Pending)', en: '⏳ Status: Pending' },
    'success_info': { ta: 'உங்கள் புகார் MLA அலுவலகத்திற்கு அனுப்பப்பட்டது. விரைவில் அதிகாரிக்கு ஒதுக்கப்படும்.', en: 'Your complaint has been sent to the MLA office. It will be assigned to an official soon.' },
    'success_btn_track': { ta: '<i class="fas fa-search"></i> நிலை காண', en: '<i class="fas fa-search"></i> Track Status' },
    'success_btn_home': { ta: '<i class="fas fa-home"></i> முகப்பு', en: '<i class="fas fa-home"></i> Home' },

    // ===== LOGIN MODAL =====
    'login_title': { ta: '🏛️ Citizen Connect', en: '🏛️ Citizen Connect' },
    'login_sub': { ta: 'புகார் செய்ய Login செய்யுங்கள்', en: 'Login to file a complaint' },
    'login_name_label': { ta: 'உங்கள் பெயர் (Name)', en: 'Your Name' },
    'login_mobile_label': { ta: 'Mobile Number', en: 'Mobile Number' },
    'login_send_otp': { ta: '<i class="fas fa-paper-plane"></i> OTP அனுப்பு', en: '<i class="fas fa-paper-plane"></i> Send OTP' },
    'login_otp_label': { ta: 'OTP Enter செய்யுங்கள் (Demo: 1234)', en: 'Enter OTP (Demo: 1234)' },
    'login_verify': { ta: '<i class="fas fa-lock-open"></i> Verify & Login', en: '<i class="fas fa-lock-open"></i> Verify & Login' },
    'ph_login_name': { ta: 'உங்கள் முழு பெயர்', en: 'Your full name' },
    'ph_login_mobile': { ta: 'Enter mobile number', en: 'Enter mobile number' },

    // ===== FOOTER =====
    'footer_brand': { ta: '🏛️ மக்கள் குறை தீர்வு மேடை', en: '🏛️ Citizen Connect' },
    'footer_desc': { ta: 'மக்கள் குறை தீர்வு மேடை - தஞ்சாவூர் தொகுதி', en: 'Citizen Grievance Platform - Thanjavur Constituency' },
    'footer_sub': { ta: 'Tamilaga Vettri Kazhagam | MLA: R. Vijaysaravanan', en: 'Tamilaga Vettri Kazhagam | MLA: R. Vijaysaravanan' },
    'footer_links_title': { ta: 'முக்கிய இணைப்புகள்', en: 'Quick Links' },
    'footer_contact_title': { ta: 'தொடர்பு', en: 'Contact' },
    'footer_link_home': { ta: 'முகப்பு', en: 'Home' },
    'footer_link_complaint': { ta: 'புகார் செய்', en: 'File Complaint' },
    'footer_link_track': { ta: 'நிலை காண', en: 'Track Status' },
    'footer_link_updates': { ta: 'அறிவிப்புகள்', en: 'Updates' },
    'footer_copyright': { ta: '© 2026 Citizen Connect Thanjavur | R. Vijaysaravanan - MLA, Thanjavur Constituency  ', en: '© 2026 Citizen Connect Thanjavur | R. Vijaysaravanan - MLA, Thanjavur Constituency  ' },

    // ===== RECENT COMPLAINTS =====
    'rc1_title': { ta: 'சாலையில் பள்ளம் - East Main Street', en: 'Pothole on Road - East Main Street' },
    'rc1_desc': { ta: '<i class="fas fa-map-marker-alt"></i> Thanjavur Fort Area | <i class="fas fa-tag"></i> சாலைகள் | <i class="fas fa-calendar"></i> 2 நாட்கள் முன்', en: '<i class="fas fa-map-marker-alt"></i> Thanjavur Fort Area | <i class="fas fa-tag"></i> Roads | <i class="fas fa-calendar"></i> 2 days ago' },
    'rc2_title': { ta: 'Street Light வேலை செய்யல - Gandhi Nagar 2nd Street', en: 'Street Light Not Working - Gandhi Nagar 2nd Street' },
    'rc2_desc': { ta: '<i class="fas fa-map-marker-alt"></i> Gandhi Nagar | <i class="fas fa-tag"></i> மின்சாரம் | <i class="fas fa-calendar"></i> 1 நாள் முன்', en: '<i class="fas fa-map-marker-alt"></i> Gandhi Nagar | <i class="fas fa-tag"></i> Electricity | <i class="fas fa-calendar"></i> 1 day ago' },
    'rc3_title': { ta: 'Drainage overflow - New Bus Stand Area அருகில்', en: 'Drainage Overflow - Near New Bus Stand Area' },
    'rc3_desc': { ta: '<i class="fas fa-map-marker-alt"></i> New Bus Stand Area | <i class="fas fa-tag"></i> வடிகால் | <i class="fas fa-calendar"></i> 5 மணி நேரம் முன்', en: '<i class="fas fa-map-marker-alt"></i> New Bus Stand Area | <i class="fas fa-tag"></i> Drainage | <i class="fas fa-calendar"></i> 5 hours ago' },
    'rc4_title': { ta: 'குடிநீர் வரவில்லை - Punnainallur 3 நாட்கள்', en: 'No Water Supply - Punnainallur for 3 Days' },
    'rc4_desc': { ta: '<i class="fas fa-map-marker-alt"></i> Punnainallur | <i class="fas fa-tag"></i> குடிநீர் | <i class="fas fa-calendar"></i> 2 மணி நேரம் முன்', en: '<i class="fas fa-map-marker-alt"></i> Punnainallur | <i class="fas fa-tag"></i> Water | <i class="fas fa-calendar"></i> 2 hours ago' },

    // ===== STATUS BADGES =====
    'status_resolved': { ta: 'தீர்வு ✓', en: 'Resolved ✓' },
    'status_progress': { ta: 'பணியில்', en: 'In Progress' },
    'status_assigned': { ta: 'ஒதுக்கப்பட்டது', en: 'Assigned' },
    'status_new': { ta: 'புதியது', en: 'New' },

    // ===== MISC =====
    'voice_listening': { ta: '🎤 கேட்கிறேன்... தமிழில் பேசுங்கள்', en: '🎤 Listening... Speak in Tamil' },
    'voice_stop': { ta: 'நிறுத்து', en: 'Stop' },
};

// Current language state
let currentLang = localStorage.getItem('vtm_tnj_lang') || 'ta';

// Get translation
function t(key) {
    if (TRANSLATIONS[key]) return TRANSLATIONS[key][currentLang] || TRANSLATIONS[key]['ta'];
    return key;
}

// Toggle language - called from button
function toggleLanguage() {
    currentLang = currentLang === 'ta' ? 'en' : 'ta';
    localStorage.setItem('vtm_tnj_lang', currentLang);
    applyLanguage();
    updateToggleButton();
    // Re-populate dynamic dropdowns (ward, street, department, grievance)
    if (typeof populateWardDropdown === 'function') populateWardDropdown();
    if (typeof loadStreets === 'function') {
        const ws = document.getElementById('wardSelect');
        if (ws && ws.value) loadStreets();
    }
    if (typeof populateDepartmentDropdown === 'function') populateDepartmentDropdown();
    if (typeof onDepartmentChange === 'function') {
        const deptSelect = document.getElementById('govDepartment');
        if (deptSelect && deptSelect.value) onDepartmentChange();
    }
    if (typeof showNotification === 'function') {
        showNotification(currentLang === 'en' ? '🌐 Switched to English' : '🌐 தமிழுக்கு மாற்றப்பட்டது', 'info');
    }
}

// Update toggle button
function updateToggleButton() {
    const label = document.getElementById('langLabel');
    if (label) label.textContent = currentLang === 'ta' ? 'EN' : 'தமிழ்';
}

// Apply translations to all data-lang elements
function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (TRANSLATIONS[key]) {
            const text = TRANSLATIONS[key][currentLang];
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });
    document.documentElement.lang = currentLang === 'ta' ? 'ta' : 'en';
}

// Initialize
function initLanguage() {
    updateToggleButton();
    applyLanguage();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    setTimeout(initLanguage, 100);
}
