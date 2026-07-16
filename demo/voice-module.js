// ===== PRODUCTION-READY VOICE COMPLAINT MODULE =====
// AI-powered voice input with Tamil + English support
// Features: Bottom sheet, waveform, timer, AI analysis, GPS, editable transcript

(function() {
    'use strict';

    // ===== STATE =====
    let voiceState = {
        isRecording: false,
        isPaused: false,
        recognition: null,
        mediaRecorder: null,
        audioChunks: [],
        audioBlob: null,
        transcript: '',
        interimTranscript: '',
        startTime: null,
        timerInterval: null,
        duration: 0,
        analyserNode: null,
        audioContext: null,
        animationFrame: null,
        stream: null,
        gpsLocation: null,
        aiResult: null,
        language: 'ta-IN', // Default Tamil, auto-detects
        retryCount: 0,
        maxRetries: 3
    };

    // ===== AI CATEGORY DETECTION =====
    const AI_CATEGORIES = {
        'Road': {
            ta: ['சாலை', 'பள்ளம்', 'குண்டு', 'டார்', 'tar', 'road', 'pothole', 'speed breaker', 'வேக தடை', 'சீரமைப்பு'],
            en: ['road', 'pothole', 'tar', 'crack', 'highway', 'bridge', 'flyover', 'speed breaker', 'asphalt']
        },
        'Water Supply': {
            ta: ['குடிநீர்', 'தண்ணீர்', 'நீர்', 'வரவில்லை', 'water', 'குழாய்', 'pipe', 'leak', 'கசிவு', 'மோட்டார்', 'pump'],
            en: ['water', 'drinking', 'supply', 'pipe', 'leak', 'tap', 'bore', 'well', 'pump', 'tank']
        },
        'Drainage': {
            ta: ['வடிகால்', 'சாக்கடை', 'drainage', 'sewage', 'overflow', 'அடைப்பு', 'நாற்றம்', 'smell', 'கழிவு நீர்'],
            en: ['drainage', 'sewage', 'overflow', 'clogged', 'drain', 'stink', 'smell', 'sewer', 'manhole']
        },
        'Garbage': {
            ta: ['குப்பை', 'கழிவு', 'garbage', 'waste', 'தூய்மை', 'அகற்ற', 'dustbin', 'சுகாதாரம்'],
            en: ['garbage', 'waste', 'trash', 'dustbin', 'dump', 'clean', 'sanitation', 'litter']
        },
        'Street Light': {
            ta: ['தெரு விளக்கு', 'street light', 'இருள்', 'dark', 'விளக்கு', 'lamp', 'LED', 'பல்பு', 'bulb'],
            en: ['street light', 'lamp', 'dark', 'bulb', 'LED', 'pole', 'electric light', 'lighting']
        },
        'Electricity': {
            ta: ['மின்', 'current', 'transformer', 'EB', 'power cut', 'மின் தடை', 'கம்பி', 'wire', 'meter', 'மீட்டர்'],
            en: ['electricity', 'power', 'transformer', 'EB', 'current', 'wire', 'meter', 'voltage', 'outage']
        },
        'Government Office': {
            ta: ['அலுவலகம்', 'office', 'சான்றிதழ்', 'certificate', 'பட்டா', 'patta', 'ration', 'ரேஷன்', 'அனுமதி'],
            en: ['office', 'certificate', 'patta', 'ration', 'permit', 'license', 'document', 'government']
        },
        'Others': {
            ta: ['பொது', 'general', 'other', 'வேறு'],
            en: ['other', 'general', 'miscellaneous']
        }
    };

    const URGENCY_KEYWORDS = {
        'Critical': {
            ta: ['உடனடி', 'அவசர', 'ஆபத்து', 'danger', 'emergency', 'இறப்பு', 'விபத்து', 'accident', 'உயிர்'],
            en: ['emergency', 'urgent', 'danger', 'death', 'accident', 'critical', 'life-threatening', 'immediate']
        },
        'High': {
            ta: ['விரைவாக', 'முக்கியம்', 'important', 'serious', 'தீவிர', 'மோசம்', 'worst', 'கடுமை'],
            en: ['urgent', 'serious', 'important', 'severe', 'worst', 'major', 'quickly', 'asap']
        },
        'Medium': {
            ta: ['நாட்கள்', 'days', 'தொடர்ந்து', 'continuously', 'மீண்டும்', 'again', 'repeated'],
            en: ['days', 'continuous', 'repeated', 'ongoing', 'persistent', 'frequent']
        },
        'Low': {
            ta: ['சிறிய', 'small', 'minor', 'குறைவான'],
            en: ['minor', 'small', 'low', 'slight', 'minimal']
        }
    };

    // ===== INJECT STYLES =====
    function injectStyles() {
        if (document.getElementById('voice-module-styles')) return;
        const style = document.createElement('style');
        style.id = 'voice-module-styles';
        style.textContent = `
/* ===== VOICE BOTTOM SHEET ===== */
.voice-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}
.voice-overlay.active {
    opacity: 1;
    visibility: visible;
}

.voice-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #1a1a2e 0%, #0d0d0d 100%);
    border-top: 1px solid rgba(212,175,55,0.3);
    border-radius: 24px 24px 0 0;
    padding: 24px 20px 40px;
    z-index: 10000;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
    max-height: 90vh;
    overflow-y: auto;
}
.voice-sheet.active {
    transform: translateY(0);
}

.voice-sheet-handle {
    width: 40px;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
    margin: 0 auto 20px;
}

.voice-sheet-header {
    text-align: center;
    margin-bottom: 24px;
}
.voice-sheet-header h3 {
    font-size: 1.1rem;
    color: white;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
.voice-sheet-header p {
    font-size: 0.8rem;
    color: #a0a0b0;
}

/* Language Toggle */
.voice-lang-toggle {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
}
.voice-lang-btn {
    padding: 8px 18px;
    border-radius: 20px;
    border: 1.5px solid rgba(212,175,55,0.3);
    background: transparent;
    color: #a0a0b0;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Inter', sans-serif;
}
.voice-lang-btn.active {
    background: rgba(212,175,55,0.15);
    border-color: #D4AF37;
    color: #D4AF37;
}

/* Mic Area */
.voice-mic-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.voice-mic-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #8B0000, #C41E3A);
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(139,0,0,0.4);
}
.voice-mic-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(139,0,0,0.5);
}
.voice-mic-btn.recording {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    animation: micPulse 1.5s infinite;
}
.voice-mic-btn.recording::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(239,68,68,0.4);
    animation: micRing 1.5s infinite;
}
.voice-mic-btn.recording::after {
    content: '';
    position: absolute;
    inset: -16px;
    border-radius: 50%;
    border: 1px solid rgba(239,68,68,0.2);
    animation: micRing 1.5s infinite 0.3s;
}

@keyframes micPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
@keyframes micRing {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
}

/* Timer */
.voice-timer {
    font-family: 'Bebas Neue', monospace;
    font-size: 1.8rem;
    color: #D4AF37;
    letter-spacing: 2px;
}
.voice-timer.recording {
    color: #ef4444;
}

/* Waveform */
.voice-waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 50px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
}
.voice-waveform .wave-bar {
    width: 4px;
    height: 10px;
    background: linear-gradient(180deg, #D4AF37, #8B0000);
    border-radius: 4px;
    transition: height 0.1s ease;
}
.voice-waveform.active .wave-bar {
    animation: waveAnim 0.6s infinite ease-in-out;
}
.voice-waveform .wave-bar:nth-child(1) { animation-delay: 0s; }
.voice-waveform .wave-bar:nth-child(2) { animation-delay: 0.05s; }
.voice-waveform .wave-bar:nth-child(3) { animation-delay: 0.1s; }
.voice-waveform .wave-bar:nth-child(4) { animation-delay: 0.15s; }
.voice-waveform .wave-bar:nth-child(5) { animation-delay: 0.2s; }
.voice-waveform .wave-bar:nth-child(6) { animation-delay: 0.25s; }
.voice-waveform .wave-bar:nth-child(7) { animation-delay: 0.3s; }
.voice-waveform .wave-bar:nth-child(8) { animation-delay: 0.35s; }
.voice-waveform .wave-bar:nth-child(9) { animation-delay: 0.4s; }
.voice-waveform .wave-bar:nth-child(10) { animation-delay: 0.45s; }
.voice-waveform .wave-bar:nth-child(11) { animation-delay: 0.5s; }
.voice-waveform .wave-bar:nth-child(12) { animation-delay: 0.55s; }
.voice-waveform .wave-bar:nth-child(13) { animation-delay: 0.6s; }
.voice-waveform .wave-bar:nth-child(14) { animation-delay: 0.65s; }
.voice-waveform .wave-bar:nth-child(15) { animation-delay: 0.7s; }
.voice-waveform .wave-bar:nth-child(16) { animation-delay: 0.75s; }
.voice-waveform .wave-bar:nth-child(17) { animation-delay: 0.8s; }
.voice-waveform .wave-bar:nth-child(18) { animation-delay: 0.85s; }
.voice-waveform .wave-bar:nth-child(19) { animation-delay: 0.9s; }
.voice-waveform .wave-bar:nth-child(20) { animation-delay: 0.95s; }

@keyframes waveAnim {
    0%, 100% { height: 8px; }
    50% { height: 40px; }
}

/* Interim text */
.voice-interim {
    text-align: center;
    font-size: 0.85rem;
    color: #a0a0b0;
    font-style: italic;
    min-height: 24px;
    margin: 8px 0;
}

/* Actions */
.voice-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
}
.voice-action-btn {
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
    font-family: 'Inter', sans-serif;
}
.voice-action-btn.start {
    background: linear-gradient(135deg, #8B0000, #C41E3A);
    color: white;
    box-shadow: 0 4px 15px rgba(139,0,0,0.3);
}
.voice-action-btn.stop {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}
.voice-action-btn.cancel {
    background: rgba(255,255,255,0.05);
    color: #a0a0b0;
    border: 1px solid rgba(255,255,255,0.1);
}
.voice-action-btn:hover {
    transform: translateY(-2px);
}

/* ===== TRANSCRIPT SECTION ===== */
.voice-transcript-section {
    display: none;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
}
.voice-transcript-section.active {
    display: block;
    animation: fadeSlideUp 0.4s ease;
}

@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.voice-transcript-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #D4AF37;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.voice-transcript-edit {
    width: 100%;
    min-height: 80px;
    padding: 14px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(212,175,55,0.2);
    border-radius: 12px;
    color: #F0EAD6;
    font-size: 0.9rem;
    font-family: 'Inter', 'Noto Serif Tamil', sans-serif;
    resize: vertical;
    line-height: 1.6;
}
.voice-transcript-edit:focus {
    outline: none;
    border-color: #D4AF37;
    box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
}

/* ===== AI ANALYSIS ===== */
.voice-ai-section {
    display: none;
    margin-top: 16px;
    padding: 16px;
    background: rgba(212,175,55,0.05);
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 14px;
}
.voice-ai-section.active {
    display: block;
    animation: fadeSlideUp 0.4s ease 0.1s both;
}

.voice-ai-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #D4AF37;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.voice-ai-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.voice-ai-item {
    padding: 10px 12px;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
}
.voice-ai-item .ai-label {
    font-size: 0.68rem;
    color: #a0a0b0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}
.voice-ai-item .ai-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #F0EAD6;
}
.voice-ai-item .ai-value.category { color: #3b82f6; }
.voice-ai-item .ai-value.urgency-critical { color: #ef4444; }
.voice-ai-item .ai-value.urgency-high { color: #f59e0b; }
.voice-ai-item .ai-value.urgency-medium { color: #3b82f6; }
.voice-ai-item .ai-value.urgency-low { color: #10b981; }

.voice-ai-suggested {
    grid-column: 1 / -1;
    padding: 12px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 8px;
    margin-top: 4px;
}
.voice-ai-suggested .ai-label { color: #10b981; }
.voice-ai-suggested .ai-value { color: white; font-size: 0.88rem; }

/* ===== GPS SECTION ===== */
.voice-gps-section {
    display: none;
    margin-top: 16px;
    padding: 12px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 12px;
}
.voice-gps-section.active {
    display: block;
    animation: fadeSlideUp 0.4s ease 0.2s both;
}
.voice-gps-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.8rem;
    color: #a0a0b0;
}
.voice-gps-info i { color: #3b82f6; font-size: 1.1rem; }
.voice-gps-coords { font-weight: 600; color: #F0EAD6; }

/* ===== SUBMIT AREA ===== */
.voice-submit-area {
    display: none;
    margin-top: 20px;
}
.voice-submit-area.active {
    display: block;
    animation: fadeSlideUp 0.4s ease 0.3s both;
}
.voice-submit-btn {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #D4AF37, #B8860B);
    color: #0d0d0d;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 20px rgba(212,175,55,0.3);
}
.voice-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212,175,55,0.4);
}
.voice-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* ===== SUCCESS ANIMATION ===== */
.voice-success-anim {
    display: none;
    text-align: center;
    padding: 30px;
}
.voice-success-anim.active {
    display: block;
    animation: successBounce 0.5s ease;
}
@keyframes successBounce {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}
.voice-success-icon {
    font-size: 4rem;
    margin-bottom: 16px;
}
.voice-success-text {
    font-size: 1.1rem;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 8px;
}
.voice-success-id {
    font-size: 0.9rem;
    color: #D4AF37;
    font-weight: 600;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
    .voice-sheet { padding: 20px 16px 30px; }
    .voice-mic-btn { width: 70px; height: 70px; font-size: 1.5rem; }
    .voice-ai-grid { grid-template-columns: 1fr; }
    .voice-timer { font-size: 1.5rem; }
}
        `;
        document.head.appendChild(style);
    }

    // ===== CREATE BOTTOM SHEET HTML =====
    function createBottomSheet() {
        if (document.getElementById('voiceBottomSheet')) return;

        const overlay = document.createElement('div');
        overlay.className = 'voice-overlay';
        overlay.id = 'voiceOverlay';
        overlay.onclick = closeVoiceSheet;
        document.body.appendChild(overlay);

        const sheet = document.createElement('div');
        sheet.className = 'voice-sheet';
        sheet.id = 'voiceBottomSheet';
        sheet.innerHTML = `
            <div class="voice-sheet-handle"></div>
            <div class="voice-sheet-header">
                <h3>🎤 Speak Your Complaint</h3>
                <p>Please describe your issue in Tamil or English</p>
            </div>

            <!-- Language Toggle -->
            <div class="voice-lang-toggle">
                <button class="voice-lang-btn active" data-lang="ta-IN" onclick="VoiceModule.setLanguage('ta-IN')">தமிழ்</button>
                <button class="voice-lang-btn" data-lang="en-IN" onclick="VoiceModule.setLanguage('en-IN')">English</button>
                <button class="voice-lang-btn" data-lang="auto" onclick="VoiceModule.setLanguage('auto')">🤖 Auto</button>
            </div>

            <!-- Recording Area -->
            <div class="voice-mic-area" id="voiceMicArea">
                <button class="voice-mic-btn" id="voiceMicMain" onclick="VoiceModule.toggleRecording()">
                    <i class="fas fa-microphone"></i>
                </button>
                <div class="voice-timer" id="voiceTimer">00:00</div>
                <div class="voice-waveform" id="voiceWaveform">
                    ${Array(20).fill('<div class="wave-bar"></div>').join('')}
                </div>
                <div class="voice-interim" id="voiceInterim"></div>
            </div>

            <!-- Action Buttons -->
            <div class="voice-actions" id="voiceActions">
                <button class="voice-action-btn start" id="voiceStartBtn" onclick="VoiceModule.startRecording()">
                    <i class="fas fa-play"></i> Start Recording
                </button>
                <button class="voice-action-btn stop" id="voiceStopBtn" onclick="VoiceModule.stopRecording()" style="display:none;">
                    <i class="fas fa-stop"></i> Stop & Process
                </button>
                <button class="voice-action-btn cancel" onclick="VoiceModule.close()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>

            <!-- Audio Playback (like WhatsApp voice note) -->
            <div class="voice-audio-section" id="voiceAudioSection" style="display:none;margin-top:16px;">
                <div style="display:flex;align-items:center;gap:12px;padding:14px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;">
                    <button type="button" id="voicePlayBtn" onclick="VoiceModule.playAudio()" style="width:40px;height:40px;border-radius:50%;background:#10b981;border:none;color:white;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-play"></i>
                    </button>
                    <div style="flex:1;">
                        <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">
                            <div id="voiceAudioProgress" style="height:100%;width:0%;background:#10b981;border-radius:2px;transition:width 0.1s;"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-top:4px;">
                            <span id="voiceAudioDuration" style="font-size:0.7rem;color:#a0a0b0;">0:00</span>
                            <span style="font-size:0.7rem;color:#10b981;">🎤 Voice Note Recorded ✓</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transcript Section -->
            <div class="voice-transcript-section" id="voiceTranscriptSection">
                <div class="voice-transcript-label">📝 Editable Transcript</div>
                <textarea class="voice-transcript-edit" id="voiceTranscriptEdit" placeholder="Your speech will appear here. You can edit it."></textarea>
            </div>

            <!-- AI Analysis -->
            <div class="voice-ai-section" id="voiceAiSection">
                <div class="voice-ai-title">🤖 AI Analysis</div>
                <div class="voice-ai-grid" id="voiceAiGrid"></div>
            </div>

            <!-- GPS -->
            <div class="voice-gps-section" id="voiceGpsSection">
                <div class="voice-gps-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span id="voiceGpsText">Capturing location...</span>
                </div>
            </div>

            <!-- Submit -->
            <div class="voice-submit-area" id="voiceSubmitArea">
                <button class="voice-submit-btn" id="voiceSubmitBtn" onclick="VoiceModule.submitComplaint()">
                    <i class="fas fa-paper-plane"></i> Submit Voice Complaint
                </button>
            </div>

            <!-- Success -->
            <div class="voice-success-anim" id="voiceSuccessAnim">
                <div class="voice-success-icon">✅</div>
                <div class="voice-success-text">Complaint Registered Successfully!</div>
                <div class="voice-success-id" id="voiceSuccessId"></div>
            </div>
        `;
        document.body.appendChild(sheet);
    }

    // ===== OPEN / CLOSE =====
    function openVoiceSheet() {
        injectStyles();
        createBottomSheet();
        resetState();
        setTimeout(() => {
            document.getElementById('voiceOverlay').classList.add('active');
            document.getElementById('voiceBottomSheet').classList.add('active');
        }, 50);
        captureGPS();
    }

    function closeVoiceSheet() {
        stopRecordingInternal();
        const overlay = document.getElementById('voiceOverlay');
        const sheet = document.getElementById('voiceBottomSheet');
        if (sheet) sheet.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        setTimeout(() => {
            if (overlay) overlay.remove();
            if (sheet) sheet.remove();
        }, 400);
    }

    function resetState() {
        voiceState.transcript = '';
        voiceState.interimTranscript = '';
        voiceState.audioChunks = [];
        voiceState.audioBlob = null;
        voiceState.duration = 0;
        voiceState.aiResult = null;
        voiceState.gpsLocation = null;
    }

    // ===== LANGUAGE =====
    function setLanguage(lang) {
        voiceState.language = lang;
        document.querySelectorAll('.voice-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    // ===== RECORDING =====
    async function startRecording() {
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            voiceState.stream = stream;

            // Setup MediaRecorder for audio
            voiceState.mediaRecorder = new MediaRecorder(stream);
            voiceState.audioChunks = [];
            voiceState.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) voiceState.audioChunks.push(e.data);
            };
            voiceState.mediaRecorder.onstop = () => {
                voiceState.audioBlob = new Blob(voiceState.audioChunks, { type: 'audio/webm' });
            };
            voiceState.mediaRecorder.start();

            // Setup Web Audio API for waveform
            setupAudioVisualizer(stream);

            // Start Speech Recognition
            startSpeechRecognition();

            // Update UI
            voiceState.isRecording = true;
            voiceState.startTime = Date.now();
            startTimer();
            updateRecordingUI(true);

        } catch (err) {
            console.error('Microphone error:', err);
            if (typeof showNotification === 'function') {
                showNotification('🎤 Microphone permission denied! Using demo mode.', 'error');
            }
            // Fallback: just use speech recognition without media recorder
            startSpeechRecognitionOnly();
        }
    }

    function startSpeechRecognitionOnly() {
        startSpeechRecognition();
        voiceState.isRecording = true;
        voiceState.startTime = Date.now();
        startTimer();
        updateRecordingUI(true);
    }

    function startSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Speech Recognition not supported. Please use Chrome.', 'error');
            }
            return;
        }

        voiceState.recognition = new SpeechRecognition();
        
        // Language setup
        if (voiceState.language === 'auto') {
            // Try Tamil first, then switch if English detected
            voiceState.recognition.lang = 'ta-IN';
        } else {
            voiceState.recognition.lang = voiceState.language;
        }
        
        voiceState.recognition.continuous = true;
        voiceState.recognition.interimResults = true;
        voiceState.recognition.maxAlternatives = 1;

        voiceState.recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim = transcript;
                }
            }

            if (final) {
                voiceState.transcript += final;
                const editBox = document.getElementById('voiceTranscriptEdit');
                if (editBox) editBox.value = voiceState.transcript.trim();
            }

            // Show interim
            const interimEl = document.getElementById('voiceInterim');
            if (interimEl) interimEl.textContent = interim ? `"${interim}..."` : '';

            // Auto-detect language switch
            if (voiceState.language === 'auto' && final) {
                const hasEnglish = /[a-zA-Z]{3,}/.test(final);
                if (hasEnglish && voiceState.recognition.lang !== 'en-IN') {
                    // Restart with English
                    voiceState.recognition.lang = 'en-IN';
                }
            }
        };

        voiceState.recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            if (event.error === 'no-speech' && voiceState.isRecording) {
                // Restart recognition
                try { voiceState.recognition.start(); } catch(e) {}
            } else if (event.error === 'not-allowed') {
                if (typeof showNotification === 'function') {
                    showNotification('🎤 Microphone permission required!', 'error');
                }
                stopRecordingInternal();
            }
        };

        voiceState.recognition.onend = () => {
            // Auto-restart if still recording
            if (voiceState.isRecording) {
                try { voiceState.recognition.start(); } catch(e) {}
            }
        };

        voiceState.recognition.start();
    }

    function stopRecording() {
        if (!voiceState.isRecording) return; // Guard: prevent double-trigger
        stopRecordingInternal();
        
        // Fill the description with transcript
        const descField = document.getElementById('description');
        if (descField && voiceState.transcript.trim()) {
            descField.value = voiceState.transcript.trim();
        }

        // Fill title with AI suggestion
        runAiAnalysisQuiet();

        // Convert audio blob to base64 for storage (so admin can play it)
        // Wait for mediaRecorder.onstop to fire (creates the blob)
        setTimeout(() => {
            if (voiceState.audioBlob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    voiceState.audioBase64 = reader.result; // data:audio/webm;base64,...
                    // Also store in localStorage so admin page can access it
                    try {
                        const audioKey = 'vtm_voice_latest';
                        localStorage.setItem(audioKey, reader.result);
                    } catch(e) {
                        console.warn('Audio too large for localStorage, will use inline storage');
                    }
                };
                reader.readAsDataURL(voiceState.audioBlob);
            }

            // Close the bottom sheet (DO NOT submit the form - just fill it)
            setTimeout(() => {
                closeVoiceSheet();
                
                // Show the inline audio player on the complaint page
                setTimeout(() => {
                    showInlineAudioPlayer();
                    if (typeof showNotification === 'function') {
                        showNotification('🎤 Voice recorded & attached! Review and submit.', 'success');
                    }
                }, 500);
            }, 300);
        }, 500); // Wait 500ms for mediaRecorder to finalize the blob
    }

    // ===== INLINE AUDIO PLAYER (on complaint page) =====
    function showInlineAudioPlayer() {
        // Remove any existing inline player
        const existing = document.getElementById('inlineVoicePlayer');
        if (existing) existing.remove();

        const descField = document.getElementById('description');
        if (!descField) return;

        // Format duration
        const mins = Math.floor(voiceState.duration / 60);
        const secs = voiceState.duration % 60;
        const durationText = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Create inline player HTML (WhatsApp style)
        const player = document.createElement('div');
        player.id = 'inlineVoicePlayer';
        player.style.cssText = 'margin-top:12px;padding:14px 16px;background:rgba(16,185,129,0.08);border:1.5px solid rgba(16,185,129,0.25);border-radius:14px;display:flex;align-items:center;gap:12px;animation:fadeSlideUp 0.4s ease;';
        player.innerHTML = `
            <button type="button" id="inlinePlayBtn" style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);border:none;color:white;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 10px rgba(16,185,129,0.3);">
                <i class="fas fa-play"></i>
            </button>
            <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <div style="flex:1;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
                        <div id="inlineAudioProgress" style="height:100%;width:0%;background:linear-gradient(90deg,#10b981,#34d399);border-radius:3px;transition:width 0.1s;"></div>
                    </div>
                    <span style="font-size:0.72rem;color:#a0a0b0;white-space:nowrap;">${durationText}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:0.75rem;color:#10b981;font-weight:600;">🎤 Voice Note Attached ✓</span>
                    <button type="button" id="inlineRemoveVoice" style="background:none;border:none;color:#ef4444;font-size:0.72rem;cursor:pointer;padding:2px 6px;border-radius:4px;">✕ Remove</button>
                </div>
            </div>
        `;

        // Insert after the voice-input-wrapper (after description textarea area)
        const voiceWrapper = descField.closest('.voice-input-wrapper');
        if (voiceWrapper) {
            voiceWrapper.parentElement.insertBefore(player, voiceWrapper.nextSibling);
        } else {
            descField.parentElement.appendChild(player);
        }

        // Add play functionality
        const playBtn = document.getElementById('inlinePlayBtn');
        const progressBar = document.getElementById('inlineAudioProgress');
        const removeBtn = document.getElementById('inlineRemoveVoice');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (!voiceState.audioBlob) { 
                    if (typeof showNotification === 'function') showNotification('Audio not available', 'error'); 
                    return; 
                }
                if (audioElement && !audioElement.paused) {
                    audioElement.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    return;
                }
                const url = URL.createObjectURL(voiceState.audioBlob);
                audioElement = new Audio(url);
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                audioElement.onended = () => { playBtn.innerHTML = '<i class="fas fa-play"></i>'; if(progressBar) progressBar.style.width='0%'; };
                audioElement.ontimeupdate = () => { if(audioElement.duration && progressBar) progressBar.style.width = ((audioElement.currentTime/audioElement.duration)*100)+'%'; };
                audioElement.play();
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (audioElement && !audioElement.paused) audioElement.pause();
                player.remove();
                voiceState.audioBlob = null;
                if (typeof showNotification === 'function') showNotification('Voice note removed', 'info');
            });
        }
    }

    // ===== AI ANALYSIS (quiet - fills form without showing UI) =====
    function runAiAnalysisQuiet() {
        const text = voiceState.transcript.toLowerCase();
        if (!text.trim()) return;

        let detectedCategory = 'Others', maxScore = 0;
        Object.entries(AI_CATEGORIES).forEach(([category, keywords]) => {
            let score = 0;
            [...keywords.ta, ...keywords.en].forEach(kw => { if (text.includes(kw.toLowerCase())) score++; });
            if (score > maxScore) { maxScore = score; detectedCategory = category; }
        });

        // Suggested title
        let suggestedTitle = voiceState.transcript.trim().split(/[.।\n]/)[0].trim();
        if (suggestedTitle.length > 60) suggestedTitle = suggestedTitle.substring(0, 57) + '...';
        if (!suggestedTitle) suggestedTitle = `${detectedCategory} Issue`;

        // Fill title if empty
        const titleField = document.getElementById('title');
        if (titleField && !titleField.value) titleField.value = suggestedTitle;

        // Auto-detect department
        const catToDept = { 'Road':'HWY','Water Supply':'MAWS','Drainage':'MAWS','Garbage':'MAWS','Street Light':'ENERGY','Electricity':'ENERGY','Government Office':'REV','Others':'GENERAL' };
        const deptCode = catToDept[detectedCategory] || 'GENERAL';
        const deptSelect = document.getElementById('govDepartment');
        if (deptSelect && !deptSelect.value) {
            deptSelect.value = deptCode;
            if (typeof onDepartmentChange === 'function') onDepartmentChange();
        }

        voiceState.aiResult = { category: detectedCategory, suggestedTitle };
    }

    // ===== AUDIO PLAYBACK (WhatsApp-style) inside bottom sheet =====
    let audioElement = null;

    function showAudioPlayer() {
        const audioSection = document.getElementById('voiceAudioSection');
        if (!audioSection) return;
        
        // Format duration
        const mins = Math.floor(voiceState.duration / 60);
        const secs = voiceState.duration % 60;
        const durationText = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        const durationEl = document.getElementById('voiceAudioDuration');
        if (durationEl) durationEl.textContent = durationText;
        
        audioSection.style.display = 'block';
        audioSection.style.animation = 'fadeSlideUp 0.4s ease';
    }

    function playAudio() {
        if (!voiceState.audioBlob) {
            if (typeof showNotification === 'function') showNotification('No audio recorded', 'error');
            return;
        }

        const playBtn = document.getElementById('voicePlayBtn');
        const progressBar = document.getElementById('voiceAudioProgress');

        if (audioElement && !audioElement.paused) {
            // Pause
            audioElement.pause();
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            return;
        }

        // Create audio from blob
        const audioUrl = URL.createObjectURL(voiceState.audioBlob);
        audioElement = new Audio(audioUrl);
        
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';

        audioElement.onended = () => {
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (progressBar) progressBar.style.width = '0%';
        };

        audioElement.ontimeupdate = () => {
            if (audioElement.duration && progressBar) {
                const pct = (audioElement.currentTime / audioElement.duration) * 100;
                progressBar.style.width = pct + '%';
            }
        };

        audioElement.play();
    }

    function stopRecordingInternal() {
        voiceState.isRecording = false;

        // Stop recognition
        if (voiceState.recognition) {
            try { voiceState.recognition.stop(); } catch(e) {}
            voiceState.recognition = null;
        }

        // Stop media recorder
        if (voiceState.mediaRecorder && voiceState.mediaRecorder.state === 'recording') {
            voiceState.mediaRecorder.stop();
        }

        // Stop stream
        if (voiceState.stream) {
            voiceState.stream.getTracks().forEach(t => t.stop());
            voiceState.stream = null;
        }

        // Stop audio context
        if (voiceState.audioContext) {
            voiceState.audioContext.close();
            voiceState.audioContext = null;
        }

        // Stop timer
        if (voiceState.timerInterval) {
            clearInterval(voiceState.timerInterval);
            voiceState.timerInterval = null;
        }

        // Stop animation
        if (voiceState.animationFrame) {
            cancelAnimationFrame(voiceState.animationFrame);
            voiceState.animationFrame = null;
        }

        updateRecordingUI(false);
    }

    function toggleRecording() {
        if (voiceState.isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    // ===== AUDIO VISUALIZER =====
    function setupAudioVisualizer(stream) {
        try {
            voiceState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = voiceState.audioContext.createMediaStreamSource(stream);
            voiceState.analyserNode = voiceState.audioContext.createAnalyser();
            voiceState.analyserNode.fftSize = 64;
            source.connect(voiceState.analyserNode);
            animateWaveform();
        } catch(e) {
            console.warn('Audio visualizer not available:', e);
        }
    }

    function animateWaveform() {
        if (!voiceState.isRecording || !voiceState.analyserNode) return;
        
        const bufferLength = voiceState.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        voiceState.analyserNode.getByteFrequencyData(dataArray);

        const bars = document.querySelectorAll('#voiceWaveform .wave-bar');
        const step = Math.floor(bufferLength / bars.length);
        
        bars.forEach((bar, i) => {
            const value = dataArray[i * step] || 0;
            const height = Math.max(6, (value / 255) * 45);
            bar.style.height = height + 'px';
        });

        voiceState.animationFrame = requestAnimationFrame(animateWaveform);
    }

    // ===== TIMER =====
    function startTimer() {
        const timerEl = document.getElementById('voiceTimer');
        voiceState.timerInterval = setInterval(() => {
            voiceState.duration = Math.floor((Date.now() - voiceState.startTime) / 1000);
            const mins = Math.floor(voiceState.duration / 60).toString().padStart(2, '0');
            const secs = (voiceState.duration % 60).toString().padStart(2, '0');
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    // ===== UI UPDATES =====
    function updateRecordingUI(isRecording) {
        const micBtn = document.getElementById('voiceMicMain');
        const startBtn = document.getElementById('voiceStartBtn');
        const stopBtn = document.getElementById('voiceStopBtn');
        const timer = document.getElementById('voiceTimer');
        const waveform = document.getElementById('voiceWaveform');

        if (isRecording) {
            if (micBtn) { micBtn.classList.add('recording'); micBtn.innerHTML = '<i class="fas fa-stop"></i>'; }
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) { stopBtn.style.display = 'inline-flex'; stopBtn.style.visibility = 'visible'; }
            if (timer) timer.classList.add('recording');
            if (waveform) waveform.classList.add('active');
        } else {
            if (micBtn) { micBtn.classList.remove('recording'); micBtn.innerHTML = '<i class="fas fa-microphone"></i>'; }
            if (startBtn) startBtn.style.display = 'inline-flex';
            if (stopBtn) { stopBtn.style.display = 'none'; }
            if (timer) timer.classList.remove('recording');
            if (waveform) waveform.classList.remove('active');
            // Reset waveform bars
            document.querySelectorAll('#voiceWaveform .wave-bar').forEach(bar => {
                bar.style.height = '8px';
            });
        }
    }

    // ===== AI ANALYSIS =====
    function runAiAnalysis() {
        const text = (document.getElementById('voiceTranscriptEdit')?.value || voiceState.transcript).toLowerCase();
        if (!text.trim()) return;

        // Detect Category
        let detectedCategory = 'Others';
        let maxScore = 0;
        Object.entries(AI_CATEGORIES).forEach(([category, keywords]) => {
            let score = 0;
            [...keywords.ta, ...keywords.en].forEach(kw => {
                if (text.includes(kw.toLowerCase())) score++;
            });
            if (score > maxScore) { maxScore = score; detectedCategory = category; }
        });

        // Detect Urgency
        let detectedUrgency = 'Medium';
        for (const [level, keywords] of Object.entries(URGENCY_KEYWORDS)) {
            const found = [...keywords.ta, ...keywords.en].some(kw => text.includes(kw.toLowerCase()));
            if (found) { detectedUrgency = level; break; }
        }

        // Extract Keywords
        const allKeywords = [];
        Object.values(AI_CATEGORIES).forEach(cat => {
            [...cat.ta, ...cat.en].forEach(kw => {
                if (text.includes(kw.toLowerCase()) && !allKeywords.includes(kw)) {
                    allKeywords.push(kw);
                }
            });
        });

        // Generate Suggested Title
        const originalText = document.getElementById('voiceTranscriptEdit')?.value || voiceState.transcript;
        let suggestedTitle = originalText.trim().split(/[.।\n]/)[0].trim();
        if (suggestedTitle.length > 60) suggestedTitle = suggestedTitle.substring(0, 57) + '...';
        if (!suggestedTitle) suggestedTitle = `${detectedCategory} Issue`;

        // Detect Ward (from text)
        let detectedWard = '-';
        const wardMatch = text.match(/ward\s*(\d+)|வார்டு\s*(\d+)/i);
        if (wardMatch) detectedWard = `Ward ${wardMatch[1] || wardMatch[2]}`;

        // Map category to department
        const deptMap = {
            'Road': 'Highways Dept', 'Water Supply': 'TWAD/Municipal',
            'Drainage': 'Municipal Corp', 'Garbage': 'Municipal Corp',
            'Street Light': 'TNEB', 'Electricity': 'TANGEDCO',
            'Government Office': 'Revenue Dept', 'Others': 'General'
        };

        voiceState.aiResult = {
            category: detectedCategory,
            urgency: detectedUrgency,
            keywords: allKeywords.slice(0, 5),
            suggestedTitle: suggestedTitle,
            ward: detectedWard,
            department: deptMap[detectedCategory] || 'General'
        };

        // Display AI results
        displayAiResults();
    }

    function displayAiResults() {
        const section = document.getElementById('voiceAiSection');
        const grid = document.getElementById('voiceAiGrid');
        if (!section || !grid || !voiceState.aiResult) return;

        const r = voiceState.aiResult;
        const urgencyClass = `urgency-${r.urgency.toLowerCase()}`;

        grid.innerHTML = `
            <div class="voice-ai-item">
                <div class="ai-label">Category</div>
                <div class="ai-value category">${r.category}</div>
            </div>
            <div class="voice-ai-item">
                <div class="ai-label">Urgency</div>
                <div class="ai-value ${urgencyClass}">${r.urgency}</div>
            </div>
            <div class="voice-ai-item">
                <div class="ai-label">Department</div>
                <div class="ai-value">${r.department}</div>
            </div>
            <div class="voice-ai-item">
                <div class="ai-label">Ward</div>
                <div class="ai-value">${r.ward}</div>
            </div>
            <div class="voice-ai-item">
                <div class="ai-label">Keywords</div>
                <div class="ai-value">${r.keywords.length > 0 ? r.keywords.join(', ') : '-'}</div>
            </div>
            <div class="voice-ai-suggested">
                <div class="ai-label">✨ Suggested Title</div>
                <div class="ai-value">${r.suggestedTitle}</div>
            </div>
        `;

        section.classList.add('active');

        // Show GPS section
        const gpsSection = document.getElementById('voiceGpsSection');
        if (gpsSection) gpsSection.classList.add('active');

        // Show submit button
        const submitArea = document.getElementById('voiceSubmitArea');
        if (submitArea) submitArea.classList.add('active');
    }

    // ===== GPS =====
    function captureGPS() {
        if (!navigator.geolocation) {
            updateGpsUI('GPS not available', null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                voiceState.gpsLocation = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                };
                updateGpsUI(
                    `📍 ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
                    voiceState.gpsLocation
                );
            },
            (err) => {
                // Default to Thanjavur
                voiceState.gpsLocation = { lat: 10.7870, lng: 79.1378, accuracy: 0 };
                updateGpsUI('📍 10.7870, 79.1378 (Thanjavur - Default)', voiceState.gpsLocation);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function updateGpsUI(text, location) {
        const gpsText = document.getElementById('voiceGpsText');
        if (gpsText) {
            gpsText.innerHTML = `<span class="voice-gps-coords">${text}</span>`;
        }
    }

    // ===== SUBMIT =====
    async function submitComplaint() {
        const transcript = document.getElementById('voiceTranscriptEdit')?.value?.trim();
        if (!transcript) {
            if (typeof showNotification === 'function') showNotification('Transcript is empty!', 'error');
            return;
        }

        const submitBtn = document.getElementById('voiceSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        try {
            // Fill the main complaint form with voice data
            const titleField = document.getElementById('title');
            const descField = document.getElementById('description');
            
            if (voiceState.aiResult) {
                if (titleField) titleField.value = voiceState.aiResult.suggestedTitle;
            }
            if (descField) descField.value = transcript;

            // Set GPS if captured
            if (voiceState.gpsLocation) {
                const locText = document.getElementById('locationText');
                if (locText) {
                    locText.textContent = `📍 ${voiceState.gpsLocation.lat.toFixed(4)}, ${voiceState.gpsLocation.lng.toFixed(4)}`;
                    locText.style.color = 'var(--success)';
                }
            }

            // Auto-detect department in main form
            if (voiceState.aiResult) {
                const catToDept = {
                    'Road': 'HWY', 'Water Supply': 'MAWS', 'Drainage': 'MAWS',
                    'Garbage': 'MAWS', 'Street Light': 'ENERGY', 'Electricity': 'ENERGY',
                    'Government Office': 'REV', 'Others': 'GENERAL'
                };
                const deptCode = catToDept[voiceState.aiResult.category] || 'GENERAL';
                const deptSelect = document.getElementById('govDepartment');
                if (deptSelect) {
                    deptSelect.value = deptCode;
                    if (typeof onDepartmentChange === 'function') onDepartmentChange();
                }
            }

            // Show success animation
            showSuccessAnimation();

            if (typeof showNotification === 'function') {
                showNotification('✅ Voice complaint data filled! Review and submit.', 'success');
            }

            // Close after delay and navigate to complaint form
            setTimeout(() => {
                closeVoiceSheet();
                if (typeof navigateTo === 'function') navigateTo('complaint');
                // Move to step 2 (complaint details)
                if (typeof nextStep === 'function') {
                    // Check if step 1 fields are filled
                    const nameField = document.getElementById('citizenName');
                    const mobileField = document.getElementById('mobileNumber');
                    const areaField = document.getElementById('area');
                    if (nameField?.value && mobileField?.value && areaField?.value) {
                        nextStep(2);
                    }
                }
            }, 2000);

        } catch (err) {
            console.error('Submit error:', err);
            if (typeof showNotification === 'function') showNotification('Error! Please try again.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Voice Complaint';
            }
        }
    }

    function showSuccessAnimation() {
        // Hide other sections
        ['voiceMicArea', 'voiceActions', 'voiceTranscriptSection', 'voiceAiSection', 'voiceGpsSection', 'voiceSubmitArea'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const successEl = document.getElementById('voiceSuccessAnim');
        if (successEl) {
            successEl.classList.add('active');
            const idEl = document.getElementById('voiceSuccessId');
            if (idEl) idEl.textContent = 'Form filled ✓ Please review and submit';
        }
    }

    // ===== PUBLIC API =====
    window.VoiceModule = {
        open: openVoiceSheet,
        close: closeVoiceSheet,
        startRecording: startRecording,
        stopRecording: stopRecording,
        toggleRecording: toggleRecording,
        setLanguage: setLanguage,
        submitComplaint: submitComplaint,
        playAudio: playAudio,
        getAudioBase64: function() { return voiceState.audioBase64 || ''; },
        getAudioBlob: function() { return voiceState.audioBlob || null; },
        hasRecording: function() { return !!voiceState.audioBlob; }
    };

    // ===== OVERRIDE EXISTING startVoiceInput =====
    window.startVoiceInput = function() {
        openVoiceSheet();
    };

})();
