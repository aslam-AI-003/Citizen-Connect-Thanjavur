// ===== VOICE TO MINISTER - PAPANASAM - SCRIPT =====

// ===== NAVIGATION =====
let currentPage = 'home';
let selectedCategory = '';

// Navigate between pages
function navigateTo(page) {
    currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    document.getElementById('navLinks').classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nav link clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// ===== COMPLAINT FORM WIZARD =====
function nextStep(step) {
    // Validate current step
    if (step === 2) {
        const name = document.getElementById('citizenName').value;
        const mobile = document.getElementById('mobileNumber').value;
        const area = document.getElementById('area').value;
        
        if (!name || !mobile || !area) {
            showNotification('அனைத்து தகவல்களையும் நிரப்பவும்', 'error');
            return;
        }
    }
    
    if (step === 3) {
        const title = document.getElementById('title').value;
        if (!title || !selectedCategory) {
            showNotification('புகார் வகை மற்றும் தலைப்பை நிரப்பவும்', 'error');
            return;
        }
        // Update review
        updateReview();
    }
    
    // Switch steps
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update progress
    document.querySelectorAll('.progress-step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        if (stepNum <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
    
    // Update progress lines
    const lines = document.querySelectorAll('.progress-line');
    lines.forEach((line, idx) => {
        if (idx < step - 1) {
            line.classList.add('active-line');
        } else {
            line.classList.remove('active-line');
        }
    });
}

function prevStep(step) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    
    document.querySelectorAll('.progress-step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        if (stepNum <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function updateReview() {
    document.getElementById('reviewName').textContent = document.getElementById('citizenName').value;
    document.getElementById('reviewPhone').textContent = '+91 ' + document.getElementById('mobileNumber').value;
    
    const areaSelect = document.getElementById('area');
    document.getElementById('reviewArea').textContent = areaSelect.options[areaSelect.selectedIndex].text;
    
    document.getElementById('reviewCategory').textContent = selectedCategory;
    document.getElementById('reviewTitle').textContent = document.getElementById('title').value;
}

// ===== CATEGORY SELECTION =====
document.querySelectorAll('.cat-card-new').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCategory = card.dataset.value;
    });
});

// ===== FORM SUBMISSION =====
document.getElementById('complaintForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const complaintId = 'IUML/PPN/2026/' + String(Math.floor(Math.random() * 900 + 100)).padStart(5, '0');
    
    // Show success modal
    showSuccessModal(complaintId);
    
    // Reset form
    setTimeout(() => {
        document.getElementById('complaintForm').reset();
        document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
        selectedCategory = '';
        nextStep(1);
    }, 500);
});

// ===== SUCCESS MODAL =====
function showSuccessModal(id) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">✅</div>
            <h3>புகார் வெற்றிகரமாக பதிவு!</h3>
            <p>உங்கள் புகார் ID:</p>
            <div class="complaint-id-display">${id}</div>
            <p style="font-size:0.75rem; color:#6b7280;">இந்த ID-ஐ வைத்து உங்கள் புகார் நிலையை track செய்யலாம்</p>
            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); navigateTo('home');" style="margin-top:15px;">
                <i class="fas fa-home"></i> முகப்பு செல்
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ===== VOICE INPUT =====
let recognition = null;

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('உங்கள் browser voice input-ஐ support செய்யவில்லை', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ta-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('voiceStatus').style.display = 'block';
    };
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('description').value += transcript;
    };
    
    recognition.onend = () => {
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('voiceStatus').style.display = 'none';
    };
    
    recognition.onerror = () => {
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('voiceStatus').style.display = 'none';
        showNotification('Voice input error. மீண்டும் முயற்சிக்கவும்.', 'error');
    };
    
    recognition.start();
}

function stopVoiceInput() {
    if (recognition) {
        recognition.stop();
    }
}

// ===== FILE UPLOAD =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('uploadPreview');
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    preview.innerHTML = `<img src="${ev.target.result}" style="max-width:100%; max-height:200px; border-radius:8px; margin-top:10px;">`;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = `<p style="margin-top:10px; font-size:0.8rem; color:var(--primary);">📎 ${file.name} (${(file.size/1024/1024).toFixed(1)}MB)</p>`;
            }
            showNotification('File uploaded successfully!', 'success');
        }
    });
}

// ===== LOCATION =====
document.getElementById('getLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('locationText').textContent = `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                document.getElementById('mapPlaceholder').innerHTML = `
                    <div style="background:#f0fdf4; padding:20px; border-radius:8px; text-align:center;">
                        <i class="fas fa-map-marker-alt" style="font-size:2rem; color:var(--primary);"></i>
                        <p style="margin-top:8px; font-size:0.85rem; color:var(--primary); font-weight:600;">Location captured!</p>
                        <p style="font-size:0.75rem; color:var(--gray);">${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
                    </div>
                `;
                showNotification('Location captured successfully!', 'success');
            },
            () => {
                showNotification('Location access denied. Manual address enter செய்யவும்.', 'error');
            }
        );
    } else {
        showNotification('Geolocation not supported', 'error');
    }
});

// ===== SEARCH COMPLAINT =====
function searchComplaint() {
    const input = document.getElementById('trackInput').value.trim();
    if (!input) {
        showNotification('Complaint ID அல்லது Mobile Number enter செய்யவும்', 'error');
        return;
    }
    showNotification('புகார் தகவல் loaded!', 'success');
    document.getElementById('trackResult').style.display = 'block';
}

// ===== CITIZEN COMPLAINTS =====
function loadCitizenComplaints() {
    const input = document.getElementById('citizenSearchInput').value.trim();
    if (!input) {
        showNotification('Mobile Number அல்லது Complaint ID enter செய்யவும்', 'error');
        return;
    }
    
    // Show demo data
    document.getElementById('citizenStats').style.display = 'block';
    document.getElementById('citizenTotal').textContent = '3';
    document.getElementById('citizenPending').textContent = '1';
    document.getElementById('citizenResolved').textContent = '2';
    
    const list = document.getElementById('citizenComplaintsList');
    list.innerHTML = `
        <div class="complaints-list">
            <div class="complaint-card">
                <div class="complaint-status status-resolved"><i class="fas fa-check"></i></div>
                <div class="complaint-info">
                    <h4>சாலையில் பள்ளம் - Papanasam Main Road</h4>
                    <p><i class="fas fa-tag"></i> சாலைகள் | <i class="fas fa-calendar"></i> May 15, 2026 | <strong>IUML/PPN/2026/00089</strong></p>
                </div>
                <span class="status-badge badge-resolved">தீர்வு ✓</span>
            </div>
            <div class="complaint-card">
                <div class="complaint-status status-progress"><i class="fas fa-wrench"></i></div>
                <div class="complaint-info">
                    <h4>Drainage block - Kabistalam Temple Street</h4>
                    <p><i class="fas fa-tag"></i> வடிகால் | <i class="fas fa-calendar"></i> May 22, 2026 | <strong>IUML/PPN/2026/00098</strong></p>
                </div>
                <span class="status-badge badge-progress">பணியில்</span>
            </div>
            <div class="complaint-card">
                <div class="complaint-status status-resolved"><i class="fas fa-check"></i></div>
                <div class="complaint-info">
                    <h4>குடிநீர் பிரச்சனை - Adhanur</h4>
                    <p><i class="fas fa-tag"></i> குடிநீர் | <i class="fas fa-calendar"></i> May 10, 2026 | <strong>IUML/PPN/2026/00072</strong></p>
                </div>
                <span class="status-badge badge-resolved">தீர்வு ✓</span>
            </div>
        </div>
    `;
    
    showNotification('உங்கள் புகார்கள் loaded!', 'success');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}" style="font-size:1.2rem;"></i>
        <span style="font-size:0.85rem;">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== LOGIN (DEMO) =====
document.getElementById('loginBtn').addEventListener('click', () => {
    showNotification('Demo mode - Login feature coming soon!', 'info');
});

// ===== HASH NAVIGATION =====
if (window.location.hash === '#dashboard') {
    navigateTo('dashboard');
}

// ===== INIT =====
console.log('🟢 Voice to Minister - Papanasam | IUML | A.M. Shahjahan');
console.log('🏛️ Minister of Minority Welfare | Papanasam Constituency');
