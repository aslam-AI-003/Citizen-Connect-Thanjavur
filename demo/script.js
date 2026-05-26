// ===== VOICE TO MINISTER - PAPANASAM - FULL SCRIPT (Matching Voice-to-MLA) =====

// ===== PAGE NAVIGATION =====
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) targetPage.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('active');
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

// ===== LOGIN MODAL =====
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
let loggedInUser = JSON.parse(localStorage.getItem('vtm_ppn_loggedInUser') || 'null');

loginBtn.addEventListener('click', () => {
    if (loggedInUser) { toggleProfileDropdown(); }
    else {
        const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
        if (mobileInput) mobileInput.value = '';
        const otpSection = document.getElementById('otpSection');
        if (otpSection) otpSection.style.display = 'none';
        document.querySelectorAll('.otp-input').forEach(i => i.value = '');
        loginModal.classList.add('active');
    }
});

function closeModal() { loginModal.classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    });
});

// ===== OTP FUNCTIONALITY =====
function sendOTP() {
    const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
    if (!mobileInput || !mobileInput.value || mobileInput.value.length < 10) {
        showNotification('சரியான Mobile Number உள்ளிடுங்கள்!', 'error'); return;
    }
    const otpSection = document.getElementById('otpSection');
    otpSection.style.display = 'block';
    showNotification(`📱 OTP sent to +91 ${mobileInput.value.substring(0,5)}xxxxx`, 'success');
    setTimeout(() => { const fi = otpSection.querySelector('.otp-input'); if (fi) fi.focus(); }, 100);
}

function verifyOTP() {
    const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    let userName = '';
    const userComplaints = Object.values(complaintsDB).filter(c => c.mobileNumber === mobile);
    if (userComplaints.length > 0 && userComplaints[0].citizenName) {
        userName = userComplaints[0].citizenName;
    } else {
        userName = 'User';
    }
    loggedInUser = { name: userName, mobile: mobile, loginTime: new Date().toISOString() };
    localStorage.setItem('vtm_ppn_loggedInUser', JSON.stringify(loggedInUser));
    closeModal();
    updateLoginUI();
    autoFillFormFromLogin();
    showNotification(`✅ வெற்றிகரமாக Login! வணக்கம் ${userName}`, 'success');
}

function updateLoginUI() {
    if (!loggedInUser) {
        loginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>Login</span>';
        loginBtn.style.background = ''; loginBtn.style.color = ''; loginBtn.style.border = '';
        return;
    }
    const displayName = loggedInUser.name.length > 8 ? loggedInUser.name.substring(0, 8) + '..' : loggedInUser.name;
    loginBtn.innerHTML = `<i class="fas fa-user-circle"></i><span>${displayName} ▾</span>`;
    loginBtn.style.background = 'var(--primary)'; loginBtn.style.color = 'white'; loginBtn.style.border = 'none'; loginBtn.style.borderRadius = '8px'; loginBtn.style.padding = '8px 14px';
}

function toggleProfileDropdown() {
    let dd = document.getElementById('profileDropdown');
    if (dd) { dd.remove(); return; }
    const rect = loginBtn.getBoundingClientRect();
    dd = document.createElement('div');
    dd.id = 'profileDropdown';
    dd.style.cssText = `position:fixed;top:${rect.bottom + 8}px;right:20px;background:white;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.15);padding:0;min-width:240px;z-index:5000;overflow:hidden;animation:slideIn 0.2s ease;`;
    const userComplaints = Object.values(complaintsDB).filter(c => c.mobileNumber === loggedInUser.mobile);
    const resolved = userComplaints.filter(c => c.statusClass === 'badge-resolved').length;
    dd.innerHTML = `
        <div style="background:linear-gradient(135deg,#0d6b3a,#094d2a);padding:16px;color:white;">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">👤</div>
                <div><h4 style="margin:0;font-size:0.9rem;">${loggedInUser.name}</h4><p style="margin:0;font-size:0.7rem;opacity:0.8;">+91 ${loggedInUser.mobile}</p></div>
            </div>
        </div>
        <div style="padding:8px;">
            <div style="display:flex;justify-content:space-around;padding:10px 0;border-bottom:1px solid #f3f4f6;">
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#0d6b3a;">${userComplaints.length}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">புகார்கள்</p></div>
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#059669;">${resolved}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">தீர்வு</p></div>
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#d97706;">${userComplaints.length - resolved}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">நிலுவை</p></div>
            </div>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();navigateTo('mycomplaints');autoLoadMyComplaints();" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#333;font-size:0.8rem;border-radius:8px;margin-top:4px;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"><i class="fas fa-clipboard-list" style="color:#0d6b3a;"></i> என் புகார்கள்</a>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();navigateTo('complaint');" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#333;font-size:0.8rem;border-radius:8px;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"><i class="fas fa-plus-circle" style="color:#2563eb;"></i> புதிய புகார் செய்</a>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();logoutUser();" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#ef4444;font-size:0.8rem;border-radius:8px;border-top:1px solid #f3f4f6;margin-top:4px;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>`;
    document.body.appendChild(dd);
    setTimeout(() => { document.addEventListener('click', closeProfileDropdown); }, 100);
}

function closeProfileDropdown(e) {
    const dd = document.getElementById('profileDropdown');
    if (dd && !dd.contains(e.target) && !loginBtn.contains(e.target)) {
        dd.remove(); document.removeEventListener('click', closeProfileDropdown);
    }
}

function logoutUser() {
    loggedInUser = null;
    localStorage.removeItem('vtm_ppn_loggedInUser');
    updateLoginUI();
    showNotification('👋 Logged out successfully', 'info');
}

function autoFillFormFromLogin() {
    if (!loggedInUser) return;
    const mobileField = document.getElementById('mobileNumber');
    if (mobileField && !mobileField.value && loggedInUser.mobile) mobileField.value = loggedInUser.mobile;
}

function autoLoadMyComplaints() {
    if (!loggedInUser) return;
    const input = document.getElementById('citizenSearchInput');
    if (input) { input.value = loggedInUser.mobile; loadCitizenComplaints(); }
}

if (loggedInUser) { setTimeout(() => { updateLoginUI(); autoFillFormFromLogin(); }, 300); }

document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => { if (e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !e.target.value && index > 0) inputs[index - 1].focus(); });
});

// ===== CATEGORY SELECTORS =====
document.querySelectorAll('.cat-card-new').forEach(card => {
    card.addEventListener('click', () => { document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); });
});

// ===== MULTI-STEP WIZARD =====
let currentStep = 1;

function nextStep(step) {
    if (currentStep === 1) {
        const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), area = document.getElementById('area');
        if (!name || !name.value.trim()) { showNotification('உங்கள் பெயரை உள்ளிடுங்கள்!', 'error'); return; }
        if (!mobile || !mobile.value.trim() || mobile.value.trim().length < 10) { showNotification('சரியான தொலைபேசி எண்ணை உள்ளிடுங்கள்!', 'error'); return; }
        if (!area || !area.value) { showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error'); return; }
    }
    if (currentStep === 2) {
        if (!document.querySelector('.cat-card-new.selected')) { showNotification('புகார் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title');
        if (!title || !title.value.trim()) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
    }
    currentStep = step;
    updateWizardUI();
    if (step === 3) populateReviewSummary();
}

function prevStep(step) { currentStep = step; updateWizardUI(); }

function updateWizardUI() {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    const activeStep = document.getElementById(`step${currentStep}`);
    if (activeStep) activeStep.classList.add('active');
    document.querySelectorAll('.progress-step').forEach((ps, i) => { ps.classList.remove('active', 'completed'); if (i + 1 === currentStep) ps.classList.add('active'); else if (i + 1 < currentStep) ps.classList.add('completed'); });
    document.querySelectorAll('.progress-line').forEach((pl, i) => { pl.classList.remove('active-line', 'completed-line'); if (i < currentStep - 1) pl.classList.add('completed-line'); else if (i === currentStep - 1) pl.classList.add('active-line'); });
}

function populateReviewSummary() {
    const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), area = document.getElementById('area'), selectedCat = document.querySelector('.cat-card-new.selected'), title = document.getElementById('title');
    document.getElementById('reviewName').textContent = name ? name.value : '-';
    document.getElementById('reviewPhone').textContent = mobile ? '+91 ' + mobile.value : '-';
    document.getElementById('reviewArea').textContent = area ? area.options[area.selectedIndex].text : '-';
    document.getElementById('reviewCategory').textContent = selectedCat ? selectedCat.querySelector('span').textContent : '-';
    document.getElementById('reviewTitle').textContent = title ? title.value : '-';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:80px;right:20px;padding:14px 20px;border-radius:10px;color:white;font-size:0.85rem;font-weight:500;z-index:3000;animation:slideIn 0.3s ease;display:flex;align-items:center;gap:10px;box-shadow:0 4px 15px rgba(0,0,0,0.2);max-width:350px;';
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    notification.style.background = colors[type] || colors.info;
    notification.innerHTML = `<span style="font-size:1.1rem;">${icons[type] || icons.info}</span> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 3000);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}`;
document.head.appendChild(notifStyle);

// ===== COMPLAINTS DATABASE =====
const categoryNames = { 'roads': 'சாலைகள்', 'drainage': 'வடிகால்', 'water': 'குடிநீர்', 'electricity': 'மின்சாரம்', 'garbage': 'கழிவு', 'traffic': 'போக்குவரத்து', 'streetlight': 'தெரு விளக்கு', 'scheme': 'அரசு திட்டம்' };
const areaNames = { 'ward-1': 'Ward 1 - Pasupathikoil', 'ward-2': 'Ward 2 - MGR Nagar', 'ward-3': 'Ward 3 - Chekkadi', 'ward-4': 'Ward 4 - Mission Street', 'ward-5': 'Ward 5 - Bazaar', 'ward-8': 'Ward 8 - Bus Stand', 'adhanur': 'Adhanur', 'kabistalam': 'Kabistalam', 'thiruvaigavur': 'Thiruvaigavur', 'valuthoor': 'Valuthoor', 'thurumbur': 'Thurumbur', 'soolamangalam': 'Soolamangalam', 'rajagiri': 'Rajagiri', 'manalur': 'Manalur' };

const complaintsDB = {
    'IUML-2026-00101': { id: 'IUML-2026-00101', govId: 'IUML/PPN/2026/00101', title: 'சாலையில் பள்ளம் - Papanasam Main Road', category: 'சாலைகள்', area: 'Papanasam Town', assigned: 'Highway Department - Mr. Karthik', date: 'May 20, 2026', status: 'பணியில்', statusClass: 'badge-progress', citizenName: 'ராஜா', mobileNumber: '9876543210', timeline: [{ text: 'புகார் பதிவு', time: 'May 20, 2026 - 10:30 AM', state: 'completed' }, { text: 'ஆய்வு', time: 'May 20, 2026 - 11:15 AM', state: 'completed' }, { text: 'Highway Dept ஒதுக்கப்பட்டது', time: 'May 20, 2026 - 02:00 PM', state: 'completed' }, { text: 'பணி தொடங்கப்பட்டது', time: 'May 21, 2026 - 09:00 AM', state: 'active' }, { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }] },
    'IUML-2026-00102': { id: 'IUML-2026-00102', govId: 'IUML/PPN/2026/00102', title: 'Street Light வேலை செய்யல - Kabistalam 2nd Street', category: 'மின்சாரம்', area: 'Kabistalam', assigned: 'EB Team - Mr. Rajan', date: 'May 21, 2026', status: 'ஒதுக்கப்பட்டது', statusClass: 'badge-assigned', citizenName: 'முருகன்', mobileNumber: '9876543211', timeline: [{ text: 'புகார் பதிவு', time: 'May 21, 2026 - 08:45 AM', state: 'completed' }, { text: 'EB Team ஒதுக்கப்பட்டது', time: 'May 21, 2026 - 11:30 AM', state: 'active' }, { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' }, { text: 'தீர்வு', time: 'நிலுவையில்...', state: '' }] },
    'IUML-2026-00100': { id: 'IUML-2026-00100', govId: 'IUML/PPN/2026/00100', title: 'Drainage overflow - Thiruvaigavur Bus Stand', category: 'வடிகால்', area: 'Thiruvaigavur', assigned: 'Corporation Team', date: 'May 19, 2026', status: 'தீர்வு ✓', statusClass: 'badge-resolved', citizenName: 'செல்வம்', mobileNumber: '9876543210', timeline: [{ text: 'புகார் பதிவு', time: 'May 19, 2026', state: 'completed' }, { text: 'Corporation Team ஒதுக்கப்பட்டது', time: 'May 19, 2026', state: 'completed' }, { text: 'பணி தொடங்கப்பட்டது', time: 'May 20, 2026', state: 'completed' }, { text: 'தீர்வு ✓', time: 'May 21, 2026', state: 'completed' }] },
    'IUML-2026-00099': { id: 'IUML-2026-00099', govId: 'IUML/PPN/2026/00099', title: 'குடிநீர் வரவில்லை - Adhanur 3 நாட்கள்', category: 'குடிநீர்', area: 'Adhanur', assigned: '-', date: 'May 22, 2026', status: 'புதியது', statusClass: 'badge-new', citizenName: 'கமலா', mobileNumber: '9876543212', timeline: [{ text: 'புகார் பதிவு', time: 'May 22, 2026 - 07:30 AM', state: 'completed' }, { text: 'ஆய்வு', time: 'நிலுவையில்...', state: 'active' }, { text: 'ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' }, { text: 'தீர்வு', time: 'நிலுவையில்...', state: '' }] }
};

// ===== COMPLAINT FORM SUBMIT =====
const complaintForm = document.getElementById('complaintForm');
let lastComplaintId = 'IUML-2026-00102';
let complaintCounter = 103;

if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCat = document.querySelector('.cat-card-new.selected');
        if (!selectedCat) { showNotification('புகார் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const area = document.getElementById('area').value;
        if (!area) { showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title').value;
        if (!title) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
        const description = document.getElementById('description').value;
        const categoryValue = selectedCat.dataset.value;
        const citizenName = document.getElementById('citizenName') ? document.getElementById('citizenName').value.trim() : '';
        const mobileNumber = document.getElementById('mobileNumber') ? document.getElementById('mobileNumber').value.trim() : '';
        const submitBtn = complaintForm.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> சமர்ப்பிக்கிறது...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const paddedNum = String(complaintCounter).padStart(5, '0');
            const govStyleId = `IUML/PPN/2026/${paddedNum}`;
            lastComplaintId = `IUML-2026-${paddedNum}`;
            complaintCounter++;
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            complaintsDB[lastComplaintId] = {
                id: lastComplaintId, govId: govStyleId,
                title: title + (areaNames[area] ? ' - ' + areaNames[area] : ''),
                description: description || '', category: categoryNames[categoryValue] || categoryValue,
                area: areaNames[area] || area,
                citizenName: citizenName,
                mobileNumber: mobileNumber,
                assigned: '-', date: dateStr, status: 'புதியது', statusClass: 'badge-new', createdAt: now.toISOString(),
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: `${dateStr} - ${timeStr}`, state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' },
                    { text: 'துறைக்கு ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            };

            const generatedIdEl = document.getElementById('generatedComplaintId');
            if (generatedIdEl) generatedIdEl.textContent = govStyleId;
            if (loggedInUser && loggedInUser.name === 'User' && citizenName) {
                loggedInUser.name = citizenName;
                localStorage.setItem('vtm_ppn_loggedInUser', JSON.stringify(loggedInUser));
                updateLoginUI();
            }
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> புகார் சமர்ப்பி';
            submitBtn.disabled = false;
            document.getElementById('successModal').classList.add('active');
            complaintForm.reset();
            document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
            currentStep = 1; updateWizardUI();
        }, 2000);
    });
}

function trackNewComplaint() { document.getElementById('successModal').classList.remove('active'); navigateTo('track'); const ti = document.getElementById('trackInput'); if (ti) { ti.value = lastComplaintId; searchComplaint(); } }
function closeSuccessModalEnhanced() { document.getElementById('successModal').classList.remove('active'); navigateTo('home'); }

// ===== TRACK SEARCH =====
function searchComplaint() {
    const input = document.getElementById('trackInput');
    const result = document.getElementById('trackResult');
    if (!input.value) { showNotification('Complaint ID enter செய்யுங்கள்!', 'error'); return; }
    result.style.opacity = '0.5';
    setTimeout(() => {
        let searchVal = input.value.trim().toUpperCase();
        let complaint = null;
        // Try gov ID format
        if (searchVal.includes('/')) {
            const match = Object.keys(complaintsDB).find(k => complaintsDB[k].govId && complaintsDB[k].govId.toUpperCase() === searchVal);
            if (match) complaint = complaintsDB[match];
        }
        if (!complaint) {
            if (!searchVal.startsWith('IUML')) searchVal = 'IUML-2026-' + searchVal.replace('#', '').replace('IUML-2026-', '');
            complaint = complaintsDB[searchVal];
        }
        if (!complaint) { const m = Object.keys(complaintsDB).find(k => k.includes(searchVal) || searchVal.includes(k.split('-').pop())); if (m) complaint = complaintsDB[m]; }

        if (complaint) {
            const displayId = complaint.govId || `IUML/PPN/2026/${complaint.id.split('-').pop()}`;
            input.value = displayId;
            let timelineHTML = (complaint.timeline || []).map(item => `<div class="tl-item ${item.state}"><div class="tl-dot"></div><div class="tl-content"><h4>${item.text}</h4><p>${item.time}</p></div></div>`).join('');
            result.innerHTML = `<div class="track-card"><div class="track-header"><div><h3>Complaint ${displayId}</h3><p>${complaint.title}</p></div><span class="status-badge ${complaint.statusClass}">${complaint.status}</span></div><div class="track-details"><div class="track-detail"><span class="label">வகை:</span><span class="value">${complaint.category}</span></div><div class="track-detail"><span class="label">பகுதி:</span><span class="value">${complaint.area}</span></div><div class="track-detail"><span class="label">ஒதுக்கப்பட்டவர்:</span><span class="value">${complaint.assigned}</span></div><div class="track-detail"><span class="label">பதிவு நாள்:</span><span class="value">${complaint.date}</span></div></div><div class="track-timeline">${timelineHTML}</div></div>`;
            result.style.opacity = '1';
            showNotification('புகார் விவரங்கள் கிடைத்தது!', 'success');
        } else {
            result.innerHTML = `<div class="track-card" style="text-align:center;padding:40px;"><i class="fas fa-search" style="font-size:2.5rem;color:var(--gray);margin-bottom:15px;"></i><h3 style="color:var(--gray);">புகார் கிடைக்கவில்லை</h3><p style="color:var(--gray);font-size:0.9rem;">ID "${input.value}" க்கான புகார் இல்லை.</p></div>`;
            result.style.opacity = '1';
            showNotification('புகார் கிடைக்கவில்லை', 'error');
        }
    }, 1000);
}

// ===== WARD VOLUNTEERS =====
const wardVolunteers = {
    'Papanasam Town': [{ name: 'Mr. Anwar', phone: '98765xxxxx', ward: 'Ward 2', role: 'Coordinator' }, { name: 'Mrs. Fatima', phone: '87654xxxxx', ward: 'Ward 5', role: 'Volunteer' }],
    'Kabistalam': [{ name: 'Mr. Ibrahim', phone: '98762xxxxx', ward: 'Kabistalam', role: 'Coordinator' }],
    'Thiruvaigavur': [{ name: 'Mr. Murugan', phone: '98763xxxxx', ward: 'Thiruvaigavur', role: 'Coordinator' }],
    'Adhanur': [{ name: 'Mr. Selvam', phone: '98764xxxxx', ward: 'Adhanur', role: 'Coordinator' }],
    'Valuthoor': [{ name: 'Mrs. Kavitha', phone: '87654xxxxx', ward: 'Valuthoor', role: 'Volunteer' }],
    'Thurumbur': [{ name: 'Mr. Karthik', phone: '98766xxxxx', ward: 'Thurumbur', role: 'Coordinator' }]
};

let currentAssignComplaintId = null;

function openAssignModal(complaintId) {
    const complaint = complaintsDB[complaintId]; if (!complaint) { showNotification('Complaint not found!', 'error'); return; }
    currentAssignComplaintId = complaintId;
    const displayId = complaint.govId || `IUML/PPN/2026/${complaintId.split('-').pop()}`;
    document.getElementById('assignComplaintInfo').textContent = `Complaint ${displayId} - ${complaint.title}`;
    document.getElementById('assignArea').value = complaint.area;
    const vs = document.getElementById('volunteerSelect');
    vs.innerHTML = '<option value="">-- Volunteer தேர்வு செய்யுங்கள் --</option>';
    (wardVolunteers[complaint.area] || []).forEach((vol, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${vol.name} (${vol.role} - ${vol.ward})`; vs.appendChild(o); });
    document.getElementById('assignModal').classList.add('active');
}

function closeAssignModal() { document.getElementById('assignModal').classList.remove('active'); currentAssignComplaintId = null; }

function confirmAssignment() {
    const vs = document.getElementById('volunteerSelect');
    if (!vs.value) { showNotification('Volunteer-ஐ தேர்வு செய்யுங்கள்!', 'error'); return; }
    const complaint = complaintsDB[currentAssignComplaintId]; if (!complaint) return;
    const volunteers = wardVolunteers[complaint.area] || [];
    const vol = volunteers[parseInt(vs.value)];
    const now = new Date(), timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    complaint.assigned = `${vol.name} (${vol.role})`;
    complaint.status = 'ஒதுக்கப்பட்டது'; complaint.statusClass = 'badge-assigned';
    closeAssignModal();
    showNotification(`✅ ${vol.name}-க்கு ஒதுக்கப்பட்டது!`, 'success');
}

// ===== CITIZEN DASHBOARD =====
function loadCitizenComplaints() {
    const input = document.getElementById('citizenSearchInput'), statsSection = document.getElementById('citizenStats'), listSection = document.getElementById('citizenComplaintsList');
    if (!input || !input.value.trim()) { showNotification('Mobile Number உள்ளிடுங்கள்!', 'error'); return; }
    const searchVal = input.value.trim();
    let matched = Object.values(complaintsDB).filter(c => c.mobileNumber === searchVal);
    if (matched.length === 0) { const m = Object.keys(complaintsDB).find(k => k.includes(searchVal) || (complaintsDB[k].govId && complaintsDB[k].govId.includes(searchVal))); if (m) matched.push(complaintsDB[m]); }
    if (matched.length > 0) {
        statsSection.style.display = 'block';
        document.getElementById('citizenTotal').textContent = matched.length;
        document.getElementById('citizenPending').textContent = matched.filter(c => c.statusClass !== 'badge-resolved').length;
        document.getElementById('citizenResolved').textContent = matched.filter(c => c.statusClass === 'badge-resolved').length;
        listSection.innerHTML = matched.map(c => `<div class="complaint-card" style="cursor:pointer;" onclick="navigateTo('track');document.getElementById('trackInput').value='${c.id}';setTimeout(searchComplaint,300);"><div class="complaint-status ${c.statusClass === 'badge-resolved' ? 'status-resolved' : c.statusClass === 'badge-progress' ? 'status-progress' : 'status-new'}"><i class="fas ${c.statusClass === 'badge-resolved' ? 'fa-check' : 'fa-clock'}"></i></div><div class="complaint-info"><h4>${c.title}</h4><p>${c.area} | ${c.date} | <strong>${c.govId || c.id}</strong></p></div><span class="status-badge ${c.statusClass}">${c.status}</span></div>`).join('');
        showNotification(`${matched.length} புகார்கள் கிடைத்தது!`, 'success');
    } else { statsSection.style.display = 'none'; listSection.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray);"><p>புகார்கள் கிடைக்கவில்லை</p></div>'; }
}

// ===== UPDATE POSTING =====
function openUpdateModal() { document.getElementById('updateModal').classList.add('active'); }
function closeUpdateModal() { document.getElementById('updateModal').classList.remove('active'); }
function postUpdate() {
    const tag = document.getElementById('updateTag').value, title = document.getElementById('updateTitle').value, content = document.getElementById('updateContent').value;
    if (!title || !content) { showNotification('தலைப்பு மற்றும் விளக்கம் தேவை!', 'error'); return; }
    const ug = document.querySelector('.updates-grid');
    if (ug) { const nu = document.createElement('div'); nu.className = 'update-card'; nu.innerHTML = `<div class="update-date"><span class="day">${new Date().getDate()}</span><span class="month">${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date().getMonth()]}</span></div><div class="update-content"><span class="update-tag">${tag}</span><h4>${title}</h4><p>${content}</p></div>`; ug.insertBefore(nu, ug.firstChild); }
    closeUpdateModal(); showNotification('📢 Update Post செய்யப்பட்டது!', 'success');
    document.getElementById('updateTitle').value = ''; document.getElementById('updateContent').value = '';
}

// ===== FILE UPLOAD =====
const uploadArea = document.getElementById('uploadArea'), fileInput = document.getElementById('fileInput'), uploadPreview = document.getElementById('uploadPreview');
if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => { const p = document.createElement('div'); p.style.cssText = 'width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;margin-top:10px;'; p.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;"><button onclick="this.parentElement.remove()" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:red;color:white;border:none;cursor:pointer;">&times;</button>`; uploadPreview.appendChild(p); };
                reader.readAsDataURL(file);
            } else {
                uploadPreview.innerHTML = `<p style="margin-top:10px;font-size:0.8rem;color:var(--primary);">📎 ${file.name}</p>`;
            }
        });
        showNotification('File uploaded!', 'success');
    });
}

// ===== LOCATION =====
const getLocationBtn = document.getElementById('getLocation');
if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('locationText').textContent = `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Papanasam Area)`;
                    document.getElementById('locationText').style.color = '#10b981';
                    getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
                    showNotification('Location captured!', 'success');
                },
                () => {
                    document.getElementById('locationText').textContent = '📍 10.9346, 79.2718 (Papanasam Area)';
                    document.getElementById('locationText').style.color = '#10b981';
                    getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
                    showNotification('Location set (demo)!', 'success');
                }
            );
        } else {
            document.getElementById('locationText').textContent = '📍 10.9346, 79.2718 (Papanasam Area)';
            getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
            showNotification('Location set!', 'success');
        }
    });
}

// ===== VOICE INPUT =====
let recognition = null, isRecording = false;
function startVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn'), voiceStatus = document.getElementById('voiceStatus'), description = document.getElementById('description');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR(); recognition.lang = 'ta-IN'; recognition.continuous = true; recognition.interimResults = true;
        recognition.onstart = () => { isRecording = true; voiceBtn.classList.add('recording'); voiceStatus.style.display = 'block'; };
        recognition.onresult = (e) => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) description.value += e.results[i][0].transcript + ' '; } };
        recognition.onerror = () => stopVoiceInput();
        recognition.start();
    } else { simulateVoiceInput(); }
}
function stopVoiceInput() { isRecording = false; document.getElementById('voiceBtn').classList.remove('recording'); document.getElementById('voiceStatus').style.display = 'none'; if (recognition) { recognition.stop(); recognition = null; } }
function simulateVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn'), voiceStatus = document.getElementById('voiceStatus'), description = document.getElementById('description');
    isRecording = true; voiceBtn.classList.add('recording'); voiceStatus.style.display = 'block';
    const texts = ['எங்கள் பகுதியில் ', 'எங்கள் பகுதியில் சாலையில் பெரிய பள்ளம் உள்ளது. ', 'எங்கள் பகுதியில் சாலையில் பெரிய பள்ளம் உள்ளது. உடனடியாக சரி செய்ய வேண்டும்.'];
    let i = 0;
    const iv = setInterval(() => { if (i < texts.length && isRecording) { description.value = texts[i]; i++; } else { clearInterval(iv); stopVoiceInput(); } }, 800);
}

// ===== HASH NAVIGATION =====
if (window.location.hash === '#dashboard') { navigateTo('dashboard'); }

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); if (isRecording) stopVoiceInput(); } });

// ===== PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-stat-card').forEach((card, i) => { card.style.opacity = '0'; card.style.transform = 'translateY(20px)'; setTimeout(() => { card.style.transition = 'all 0.5s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 200 + (i * 150)); });
});

console.log('🟢 Voice to Minister - Papanasam | IUML | A.M. Shahjahan');
console.log('🏛️ Minister of Minority Welfare | Papanasam Constituency');
console.log('Pages: Home | Complaint | Track | My Complaints | Updates | Minister Dashboard');
