// ===== FIREBASE CONFIGURATION FOR VOICE TO MINISTER - PAPANASAM =====
const firebaseConfig = {
    apiKey: "AIzaSyA0h41dnLHhll9QebR4fkiaiG8C3cdo8Es",
    authDomain: "abm-billing.firebaseapp.com",
    projectId: "abm-billing",
    storageBucket: "abm-billing.firebasestorage.app",
    messagingSenderId: "774462936172",
    appId: "1:774462936172:web:3312f7c3876aa09ba77449",
    measurementId: "G-6ZN8GZYY8Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== VOICE TO MINISTER PAPANASAM - FIRESTORE OPERATIONS =====
const VoiceToMinister_DB = {

    // --- COMPLAINTS ---
    
    // Save a new complaint to Firestore
    async saveComplaint(complaint) {
        try {
            await db.collection('vtm_ppn_complaints').doc(complaint.id).set({
                ...complaint,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Complaint saved to Firebase:', complaint.id);
            return true;
        } catch (error) {
            console.error('❌ Error saving complaint:', error);
            return false;
        }
    },

    // Get all complaints from Firestore
    async getAllComplaints() {
        try {
            const snapshot = await db.collection('vtm_ppn_complaints').get();
            
            const complaints = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                complaints[data.id] = data;
            });
            console.log(`✅ Loaded ${snapshot.docs.length} complaints from Firebase`);
            return complaints;
        } catch (error) {
            console.error('❌ Error getting complaints:', error);
            return {};
        }
    },

    // Get a single complaint by ID
    async getComplaint(complaintId) {
        try {
            const doc = await db.collection('vtm_ppn_complaints').doc(complaintId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting complaint:', error);
            return null;
        }
    },

    // Update a complaint (e.g., after assignment)
    async updateComplaint(complaintId, updates) {
        try {
            await db.collection('vtm_ppn_complaints').doc(complaintId).update({
                ...updates,
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Complaint updated:', complaintId);
            return true;
        } catch (error) {
            console.error('❌ Error updating complaint:', error);
            return false;
        }
    },

    // Get next complaint number (auto-increment, ensures uniqueness)
    async getNextComplaintNumber() {
        try {
            const counterDoc = await db.collection('vtm_ppn_config').doc('counter').get();
            let nextNum = 103; // default start
            
            if (counterDoc.exists) {
                nextNum = counterDoc.data().lastComplaintNumber + 1;
            }
            
            // Double-check: make sure this ID doesn't already exist
            const existingCheck = await db.collection('vtm_ppn_complaints').doc(`IUML-2026-${String(nextNum).padStart(5,'0')}`).get();
            if (existingCheck.exists) {
                const allDocs = await db.collection('vtm_ppn_complaints').get();
                let maxNum = 102;
                allDocs.docs.forEach(doc => {
                    const id = doc.id;
                    const num = parseInt(id.split('-').pop());
                    if (num > maxNum) maxNum = num;
                });
                nextNum = maxNum + 1;
            }
            
            // Update counter
            await db.collection('vtm_ppn_config').doc('counter').set({
                lastComplaintNumber: nextNum,
                updatedAt: new Date().toISOString()
            });
            
            console.log('🔢 Next complaint number:', nextNum);
            return nextNum;
        } catch (error) {
            console.error('❌ Error getting next number:', error);
            return Date.now() % 10000 + 200;
        }
    },

    // Listen for real-time changes (for Dashboard live updates)
    onComplaintsChange(callback) {
        return db.collection('vtm_ppn_complaints')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                const complaints = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    complaints[data.id] = data;
                });
                callback(complaints);
            }, (error) => {
                console.error('❌ Real-time listener error:', error);
            });
    },

    // --- INITIALIZE DEFAULT DATA ---
    async initializeDefaultComplaints() {
        const defaultComplaints = {
            'IUML-2026-00101': {
                id: 'IUML-2026-00101',
                govId: 'IUML/PPN/2026/00101',
                title: 'சாலையில் பள்ளம் - Papanasam Main Road',
                category: 'சாலைகள்',
                area: 'Papanasam Town',
                assigned: 'Highway Department - Mr. Karthik',
                date: 'May 20, 2026',
                status: 'பணியில்',
                statusClass: 'badge-progress',
                citizenName: 'ராஜா',
                mobileNumber: '9876543210',
                timeline: [
                    { text: 'புகார் பதிவு', time: 'May 20, 2026 - 10:30 AM', state: 'completed' },
                    { text: 'ஆய்வு', time: 'May 20, 2026 - 11:15 AM', state: 'completed' },
                    { text: 'Highway Dept ஒதுக்கப்பட்டது', time: 'May 20, 2026 - 02:00 PM', state: 'completed' },
                    { text: 'பணி தொடங்கப்பட்டது', time: 'May 21, 2026 - 09:00 AM', state: 'active' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            },
            'IUML-2026-00102': {
                id: 'IUML-2026-00102',
                govId: 'IUML/PPN/2026/00102',
                title: 'Street Light வேலை செய்யல - Kabistalam 2nd Street',
                category: 'மின்சாரம்',
                area: 'Kabistalam',
                assigned: 'EB Team - Mr. Rajan',
                date: 'May 21, 2026',
                status: 'ஒதுக்கப்பட்டது',
                statusClass: 'badge-assigned',
                citizenName: 'முருகன்',
                mobileNumber: '9876543211',
                timeline: [
                    { text: 'புகார் பதிவு', time: 'May 21, 2026 - 08:45 AM', state: 'completed' },
                    { text: 'EB Team ஒதுக்கப்பட்டது', time: 'May 21, 2026 - 11:30 AM', state: 'active' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு', time: 'நிலுவையில்...', state: '' }
                ]
            },
            'IUML-2026-00100': {
                id: 'IUML-2026-00100',
                govId: 'IUML/PPN/2026/00100',
                title: 'Drainage overflow - Thiruvaigavur Bus Stand',
                category: 'வடிகால்',
                area: 'Thiruvaigavur',
                assigned: 'Corporation Team',
                date: 'May 19, 2026',
                status: 'தீர்வு ✓',
                statusClass: 'badge-resolved',
                citizenName: 'செல்வம்',
                mobileNumber: '9876543210',
                timeline: [
                    { text: 'புகார் பதிவு', time: 'May 19, 2026', state: 'completed' },
                    { text: 'Corporation Team ஒதுக்கப்பட்டது', time: 'May 19, 2026', state: 'completed' },
                    { text: 'பணி தொடங்கப்பட்டது', time: 'May 20, 2026', state: 'completed' },
                    { text: 'தீர்வு ✓', time: 'May 21, 2026', state: 'completed' }
                ]
            },
            'IUML-2026-00099': {
                id: 'IUML-2026-00099',
                govId: 'IUML/PPN/2026/00099',
                title: 'குடிநீர் வரவில்லை - Adhanur 3 நாட்கள்',
                category: 'குடிநீர்',
                area: 'Adhanur',
                assigned: '-',
                date: 'May 22, 2026',
                status: 'புதியது',
                statusClass: 'badge-new',
                citizenName: 'கமலா',
                mobileNumber: '9876543212',
                timeline: [
                    { text: 'புகார் பதிவு', time: 'May 22, 2026 - 07:30 AM', state: 'completed' },
                    { text: 'ஆய்வு', time: 'நிலுவையில்...', state: 'active' },
                    { text: 'ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு', time: 'நிலுவையில்...', state: '' }
                ]
            }
        };

        // Check if data already exists
        const existing = await db.collection('vtm_ppn_complaints').limit(1).get();
        if (existing.empty) {
            console.log('📦 Initializing default complaints in Firebase...');
            const batch = db.batch();
            for (const [id, complaint] of Object.entries(defaultComplaints)) {
                const ref = db.collection('vtm_ppn_complaints').doc(id);
                batch.set(ref, { ...complaint, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            }
            await batch.commit();
            
            // Set counter
            await db.collection('vtm_ppn_config').doc('counter').set({
                lastComplaintNumber: 102,
                updatedAt: new Date().toISOString()
            });
            
            console.log('✅ Default complaints initialized!');
        }
    }
};

// Make available globally
window.VoiceToMinister_DB = VoiceToMinister_DB;
console.log('🔥 Firebase connected for Voice to Minister - Papanasam');
