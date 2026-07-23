// Vercel Serverless Function - Verify OTP via MSG91

// In-memory rate limit: max 5 verify attempts per mobile number per 10 minutes,
// to slow brute-forcing a 4-6 digit OTP. Best-effort (per warm serverless instance), not distributed.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const verifyAttempts = new Map();

function isRateLimited(mobile) {
    const now = Date.now();
    const attempts = (verifyAttempts.get(mobile) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (attempts.length >= RATE_LIMIT_MAX) {
        verifyAttempts.set(mobile, attempts);
        return true;
    }
    attempts.push(now);
    verifyAttempts.set(mobile, attempts);
    return false;
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { mobile, otp } = req.body;

        if (!mobile || mobile.length < 10) {
            return res.status(400).json({ error: 'Invalid mobile number' });
        }
        if (!otp || otp.length < 4) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (isRateLimited(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Too many verification attempts. Please wait a few minutes and try again.'
            });
        }

        // MSG91 Verify OTP API
        const response = await fetch(`https://control.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`, {
            method: 'GET',
            headers: {
                'authkey': process.env.MSG91_AUTH_KEY
            }
        });

        const data = await response.json();
        console.log('MSG91 Verify OTP Response:', data);

        if (data.type === 'success') {
            return res.status(200).json({ 
                success: true, 
                message: 'OTP verified successfully' 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: data.message || 'OTP verification failed' 
            });
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error verifying OTP' 
        });
    }
}
