-- ===== SUPABASE DATABASE SETUP FOR CITIZEN CONNECT THANJAVUR =====
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    gov_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    department TEXT,
    grievance_type TEXT,
    area TEXT,
    ward TEXT,
    citizen_name TEXT,
    mobile_number TEXT,
    assigned TEXT DEFAULT '-',
    status TEXT DEFAULT 'புதியது',
    status_class TEXT DEFAULT 'badge-new',
    date TEXT,
    location TEXT,
    address TEXT,
    has_voice_note BOOLEAN DEFAULT FALSE,
    voice_audio_url TEXT,
    image_url TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 2. CITIZENS TABLE
CREATE TABLE IF NOT EXISTS citizens (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    ward TEXT,
    area TEXT,
    total_complaints INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code TEXT,
    otp_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 3. STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT,
    role TEXT DEFAULT 'Data Entry Staff',
    area TEXT DEFAULT 'All Areas',
    staff_id TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 4. VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS volunteers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    initials TEXT,
    area TEXT,
    ward TEXT,
    role TEXT DEFAULT 'Coordinator',
    phone TEXT,
    total_assigned INTEGER DEFAULT 0,
    total_resolved INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UPDATES TABLE (MLA announcements)
CREATE TABLE IF NOT EXISTS updates (
    id BIGSERIAL PRIMARY KEY,
    tag TEXT,
    title TEXT NOT NULL,
    content TEXT,
    posted_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONFIG TABLE (complaint counter etc.)
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default counter
INSERT INTO config (key, value) VALUES ('complaint_counter', '{"last_number": 102}')
ON CONFLICT (key) DO NOTHING;

-- 7. OTP LOGS TABLE (for auditing)
CREATE TABLE IF NOT EXISTS otp_logs (
    id BIGSERIAL PRIMARY KEY,
    mobile TEXT NOT NULL,
    otp_code TEXT,
    purpose TEXT DEFAULT 'login',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_complaints_mobile ON complaints(mobile_number);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status_class);
CREATE INDEX IF NOT EXISTS idx_complaints_area ON complaints(area);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_citizens_mobile ON citizens(mobile);
CREATE INDEX IF NOT EXISTS idx_staff_username ON staff(username);

-- ===== ROW LEVEL SECURITY (RLS) =====
-- Enable RLS on all tables
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read complaints (public transparency)
CREATE POLICY "Public can read complaints" ON complaints FOR SELECT USING (true);

-- Policy: Anyone can insert complaints (citizens submit)
CREATE POLICY "Anyone can insert complaints" ON complaints FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update complaints (for now - admin will use service_role)
CREATE POLICY "Anyone can update complaints" ON complaints FOR UPDATE USING (true);

-- Policy: Public can read updates
CREATE POLICY "Public can read updates" ON updates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert updates" ON updates FOR INSERT WITH CHECK (true);

-- Policy: Public can read volunteers
CREATE POLICY "Public can read volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Anyone can manage volunteers" ON volunteers FOR ALL USING (true);

-- Policy: Citizens can manage their own data
CREATE POLICY "Citizens self-manage" ON citizens FOR ALL USING (true);

-- Policy: Staff management
CREATE POLICY "Staff all access" ON staff FOR ALL USING (true);

-- Policy: Config access
CREATE POLICY "Config access" ON config FOR ALL USING (true);

-- Policy: OTP logs
CREATE POLICY "OTP logs access" ON otp_logs FOR ALL USING (true);

-- ===== STORAGE BUCKET SETUP =====
-- NOTE: Run these in Supabase Dashboard → Storage → Create bucket
-- Bucket 1: "voice-recordings" (public read)
-- Bucket 2: "complaint-images" (public read)

-- ===== INSERT DEFAULT STAFF ACCOUNT =====
INSERT INTO staff (username, password_hash, name, mobile, role, area, staff_id)
VALUES ('admin', 'admin123', 'Admin User', '9999999999', 'Office Manager', 'All Areas', 'STAFF-001')
ON CONFLICT (username) DO NOTHING;

-- ===== INSERT DEFAULT VOLUNTEERS =====
INSERT INTO volunteers (name, initials, area, ward, role) VALUES
('Mr. Senthil Kumar', 'SK', 'Thanjavur Fort Area', 'Ward 5', 'Coordinator'),
('Mr. Murugan', 'MR', 'Gandhi Nagar', 'Ward 8', 'Coordinator'),
('Mr. Rajesh', 'RJ', 'New Bus Stand Area', 'Ward 12', 'Coordinator'),
('Mr. Selvam', 'SV', 'Punnainallur', 'Ward 3', 'Coordinator'),
('Mrs. Kavitha', 'KV', 'Anna Nagar', 'Ward 15', 'Coordinator'),
('Mr. Ganesh', 'GN', 'Karanthai', 'Ward 9', 'Coordinator'),
('Mrs. Lakshmi', 'LK', 'East Main Street', 'Ward 7', 'Coordinator')
ON CONFLICT DO NOTHING;
