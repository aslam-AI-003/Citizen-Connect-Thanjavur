// ===== SUPABASE CONFIGURATION - CITIZEN CONNECT THANJAVUR =====
// Production Database + Storage + Auth

const SUPABASE_URL = 'https://utxghpplgjoquqrrhqom.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nJz2wczIJTRJ1caLqoVg7g_pYxziBhC';

// Initialize Supabase Client
let supabaseClient = null;

function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized successfully');
        return true;
    }
    console.warn('⚠️ Supabase SDK not loaded yet');
    return false;
}

// ===== CITIZEN CONNECT DB - SUPABASE OPERATIONS =====
const CitizenConnect_DB = {

    // ===== COMPLAINTS =====

    // Save a new complaint
    async saveComplaint(complaint) {
        try {
            if (!supabaseClient) { console.warn('Supabase not ready'); return false; }
            
            const { data, error } = await supabaseClient
                .from('complaints')
                .upsert({
                    id: complaint.id,
                    gov_id: complaint.govId,
                    title: complaint.title,
                    description: complaint.description || '',
                    category: complaint.category || '',
                    department: complaint.department || '',
                    grievance_type: complaint.grievanceType || '',
                    area: complaint.area || '',
                    ward: complaint.ward || '',
                    citizen_name: complaint.citizenName || '',
                    mobile_number: complaint.mobileNumber || '',
                    assigned: complaint.assigned || '-',
                    status: complaint.status || 'புதியது',
                    status_class: complaint.statusClass || 'badge-new',
                    date: complaint.date || '',
                    location: complaint.location || '',
                    address: complaint.address || '',
                    has_voice_note: complaint.hasVoiceNote || false,
                    voice_audio_url: complaint.voiceAudioUrl || '',
                    image_url: complaint.imageUrl || '',
                    timeline: complaint.timeline || [],
                    feedback: complaint.feedback || null,
                    created_at: complaint.createdAt || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            console.log('✅ [Supabase] Complaint saved:', complaint.id);
            return true;
        } catch (error) {
            console.error('❌ [Supabase] Save complaint error:', error);
            return false;
        }
    },

    // Get all complaints
    async getAllComplaints() {
        try {
            if (!supabaseClient) return {};
            
            const { data, error } = await supabaseClient
                .from('complaints')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const complaints = {};
            (data || []).forEach(row => {
                complaints[row.id] = {
                    id: row.id,
                    govId: row.gov_id,
                    title: row.title,
                    description: row.description,
                    category: row.category,
                    department: row.department,
                    grievanceType: row.grievance_type,
                    area: row.area,
                    ward: row.ward,
                    citizenName: row.citizen_name,
                    mobileNumber: row.mobile_number,
                    assigned: row.assigned,
                    status: row.status,
                    statusClass: row.status_class,
                    date: row.date,
                    location: row.location,
                    address: row.address,
                    hasVoiceNote: row.has_voice_note,
                    voiceAudioUrl: row.voice_audio_url,
                    imageUrl: row.image_url,
                    timeline: row.timeline || [],
                    feedback: row.feedback,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                    resolvedAt: row.resolved_at
                };
            });

            console.log(`✅ [Supabase] Loaded ${data.length} complaints`);
            return complaints;
        } catch (error) {
            console.error('❌ [Supabase] Get complaints error:', error);
            return {};
        }
    },

    // Get single complaint
    async getComplaint(complaintId) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('complaints')
                .select('*')
                .eq('id', complaintId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Get complaint error:', error);
            return null;
        }
    },

    // Update complaint
    async updateComplaint(complaintId, updates) {
        try {
            if (!supabaseClient) return false;

            // Convert camelCase to snake_case for DB
            const dbUpdates = {};
            if (updates.assigned !== undefined) dbUpdates.assigned = updates.assigned;
            if (updates.status !== undefined) dbUpdates.status = updates.status;
            if (updates.statusClass !== undefined) dbUpdates.status_class = updates.statusClass;
            if (updates.timeline !== undefined) dbUpdates.timeline = updates.timeline;
            if (updates.feedback !== undefined) dbUpdates.feedback = updates.feedback;
            if (updates.voiceAudioUrl !== undefined) dbUpdates.voice_audio_url = updates.voiceAudioUrl;
            if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
            if (updates.resolvedAt !== undefined) dbUpdates.resolved_at = updates.resolvedAt;
            dbUpdates.updated_at = new Date().toISOString();

            const { error } = await supabaseClient
                .from('complaints')
                .update(dbUpdates)
                .eq('id', complaintId);

            if (error) throw error;
            console.log('✅ [Supabase] Complaint updated:', complaintId);
            return true;
        } catch (error) {
            console.error('❌ [Supabase] Update complaint error:', error);
            return false;
        }
    },

    // Get next complaint number
    async getNextComplaintNumber() {
        try {
            if (!supabaseClient) return Date.now() % 10000 + 200;

            const { data, error } = await supabaseClient
                .from('config')
                .select('value')
                .eq('key', 'complaint_counter')
                .single();

            let nextNum = 103;
            if (data && data.value) {
                nextNum = (data.value.last_number || 102) + 1;
            }

            // Update counter
            await supabaseClient
                .from('config')
                .upsert({
                    key: 'complaint_counter',
                    value: { last_number: nextNum },
                    updated_at: new Date().toISOString()
                });

            console.log('🔢 [Supabase] Next complaint number:', nextNum);
            return nextNum;
        } catch (error) {
            console.error('❌ [Supabase] Counter error:', error);
            return Date.now() % 10000 + 200;
        }
    },

    // Real-time listener for complaints changes
    onComplaintsChange(callback) {
        if (!supabaseClient) return null;

        const channel = supabaseClient
            .channel('complaints-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'complaints' },
                async (payload) => {
                    console.log('🔄 [Supabase] Real-time update:', payload.eventType);
                    // Reload all complaints on any change
                    const complaints = await CitizenConnect_DB.getAllComplaints();
                    callback(complaints);
                }
            )
            .subscribe();

        console.log('📡 [Supabase] Real-time listener active');
        return channel;
    },

    // ===== STORAGE - VOICE RECORDINGS =====

    // Upload voice audio
    async uploadVoiceAudio(complaintId, audioBlob) {
        try {
            if (!supabaseClient || !audioBlob) return '';

            const fileName = `${complaintId}_${Date.now()}.webm`;
            const filePath = `voices/${fileName}`;

            const { data, error } = await supabaseClient.storage
                .from('voice-recordings')
                .upload(filePath, audioBlob, {
                    contentType: 'audio/webm',
                    upsert: true
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from('voice-recordings')
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;
            console.log('✅ [Supabase] Voice uploaded:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('❌ [Supabase] Voice upload error:', error);
            return '';
        }
    },

    // Upload complaint image
    async uploadImage(complaintId, imageFile) {
        try {
            if (!supabaseClient || !imageFile) return '';

            let blob = imageFile;
            let ext = 'jpg';
            let contentType = 'image/jpeg';

            // If it's a base64 data URL, convert to blob
            if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
                const res = await fetch(imageFile);
                blob = await res.blob();
                contentType = blob.type || 'image/jpeg';
                ext = contentType.split('/')[1] || 'jpg';
            } else if (imageFile instanceof File) {
                ext = imageFile.name.split('.').pop() || 'jpg';
                contentType = imageFile.type || 'image/jpeg';
            }

            const fileName = `${complaintId}_${Date.now()}.${ext}`;
            const filePath = `images/${fileName}`;

            const { data, error } = await supabaseClient.storage
                .from('complaint-images')
                .upload(filePath, blob, {
                    contentType: contentType,
                    upsert: true
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from('complaint-images')
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;
            console.log('✅ [Supabase] Image uploaded:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('❌ [Supabase] Image upload error:', error);
            return '';
        }
    },

    // ===== CITIZENS =====

    // Register/update citizen
    async upsertCitizen(name, mobile, ward, area) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('citizens')
                .upsert({
                    name: name,
                    mobile: mobile,
                    ward: ward || '',
                    area: area || '',
                    last_login: new Date().toISOString()
                }, { onConflict: 'mobile' })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Citizen upsert error:', error);
            return null;
        }
    },

    // Get citizen by mobile
    async getCitizenByMobile(mobile) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('citizens')
                .select('*')
                .eq('mobile', mobile)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Get citizen error:', error);
            return null;
        }
    },

    // ===== OTP SYSTEM =====

    // Generate and store OTP
    async generateOTP(mobile, purpose = 'login') {
        try {
            if (!supabaseClient) return null;
            
            // Generate 4-digit OTP
            const otpCode = String(Math.floor(1000 + Math.random() * 9000));
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

            // Store in citizens table
            await supabaseClient
                .from('citizens')
                .upsert({
                    mobile: mobile,
                    name: 'Citizen',
                    otp_code: otpCode,
                    otp_expires_at: expiresAt
                }, { onConflict: 'mobile' });

            // Log OTP
            await supabaseClient
                .from('otp_logs')
                .insert({
                    mobile: mobile,
                    otp_code: otpCode,
                    purpose: purpose
                });

            console.log('🔑 [Supabase] OTP generated for:', mobile);
            return otpCode;
        } catch (error) {
            console.error('❌ [Supabase] OTP generation error:', error);
            return null;
        }
    },

    // Verify OTP
    async verifyOTP(mobile, enteredOTP) {
        try {
            if (!supabaseClient) return false;

            const { data, error } = await supabaseClient
                .from('citizens')
                .select('otp_code, otp_expires_at')
                .eq('mobile', mobile)
                .single();

            if (error || !data) return false;

            // Check OTP match and expiry
            const now = new Date();
            const expires = new Date(data.otp_expires_at);

            if (data.otp_code === enteredOTP && now < expires) {
                // Mark as verified
                await supabaseClient
                    .from('citizens')
                    .update({ is_verified: true, otp_code: null, last_login: now.toISOString() })
                    .eq('mobile', mobile);

                // Update OTP log
                await supabaseClient
                    .from('otp_logs')
                    .update({ is_verified: true, verified_at: now.toISOString() })
                    .eq('mobile', mobile)
                    .eq('otp_code', enteredOTP)
                    .is('verified_at', null);

                console.log('✅ [Supabase] OTP verified for:', mobile);
                return true;
            }

            console.warn('❌ [Supabase] OTP mismatch or expired');
            return false;
        } catch (error) {
            console.error('❌ [Supabase] OTP verify error:', error);
            return false;
        }
    },

    // ===== STAFF =====

    // Staff login
    async staffLogin(username, password) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('staff')
                .select('*')
                .eq('username', username)
                .eq('password_hash', password)
                .eq('is_active', true)
                .single();

            if (error || !data) return null;

            // Update last login
            await supabaseClient
                .from('staff')
                .update({ last_login: new Date().toISOString() })
                .eq('id', data.id);

            console.log('✅ [Supabase] Staff login:', username);
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Staff login error:', error);
            return null;
        }
    },

    // Staff register
    async staffRegister(staffData) {
        try {
            if (!supabaseClient) return null;

            const { data: existing } = await supabaseClient
                .from('staff')
                .select('id')
                .eq('username', staffData.username)
                .single();

            if (existing) return { error: 'Username already exists' };

            const staffId = 'STAFF-' + String(Date.now()).slice(-6);
            const { data, error } = await supabaseClient
                .from('staff')
                .insert({
                    username: staffData.username,
                    password_hash: staffData.password,
                    name: staffData.name,
                    mobile: staffData.mobile,
                    role: staffData.role,
                    area: staffData.area,
                    staff_id: staffId
                })
                .select()
                .single();

            if (error) throw error;
            console.log('✅ [Supabase] Staff registered:', staffData.username);
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Staff register error:', error);
            return null;
        }
    },

    // ===== VOLUNTEERS =====

    async getAllVolunteers() {
        try {
            if (!supabaseClient) return [];
            const { data, error } = await supabaseClient
                .from('volunteers')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ [Supabase] Get volunteers error:', error);
            return [];
        }
    },

    async addVolunteer(volunteer) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('volunteers')
                .insert({
                    name: volunteer.name,
                    initials: volunteer.initials,
                    area: volunteer.area,
                    ward: volunteer.ward,
                    role: volunteer.role,
                    phone: volunteer.phone || ''
                })
                .select()
                .single();

            if (error) throw error;
            console.log('✅ [Supabase] Volunteer added:', volunteer.name);
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Add volunteer error:', error);
            return null;
        }
    },

    // ===== UPDATES =====

    async postUpdate(update) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient
                .from('updates')
                .insert({
                    tag: update.tag,
                    title: update.title,
                    content: update.content,
                    posted_by: update.postedBy || 'Admin'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ [Supabase] Post update error:', error);
            return null;
        }
    },

    async getUpdates() {
        try {
            if (!supabaseClient) return [];
            const { data, error } = await supabaseClient
                .from('updates')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ [Supabase] Get updates error:', error);
            return [];
        }
    },

    // ===== UTILITY =====

    // Check if Supabase is connected
    isConnected() {
        return !!supabaseClient;
    },

    // Get complaint count by mobile
    async getComplaintsByMobile(mobile) {
        try {
            if (!supabaseClient) return [];
            const { data, error } = await supabaseClient
                .from('complaints')
                .select('*')
                .eq('mobile_number', mobile)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ [Supabase] Get by mobile error:', error);
            return [];
        }
    }
};

// ===== AUTO-INITIALIZE =====
// Wait for Supabase SDK to load, then initialize
function waitForSupabase() {
    if (window.supabase && window.supabase.createClient) {
        initSupabase();
    } else {
        // Retry after SDK loads
        setTimeout(waitForSupabase, 200);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSupabase);
} else {
    waitForSupabase();
}

// Make globally available
window.CitizenConnect_DB = CitizenConnect_DB;
window.initSupabase = initSupabase;

console.log('🚀 Citizen Connect Supabase module loaded');
