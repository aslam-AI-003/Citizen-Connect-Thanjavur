// Vercel Serverless Function - Send OTP via MSG91
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
        const { mobile } = req.body;

        if (!mobile || mobile.length < 10) {
            return res.status(400).json({ error: 'Invalid mobile number' });
        }

        // MSG91 Send OTP API
        const response = await fetch('https://control.msg91.com/api/v5/otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': process.env.MSG91_AUTH_KEY
            },
            body: JSON.stringify({
                mobile: `91${mobile}`,
                otp_length: 6,
                otp_expiry: 5,
                template_id: process.env.MSG91_TEMPLATE_ID || '',
                realTimeResponse: true
            })
        });

        const data = await response.json();
        console.log('MSG91 Send OTP Response:', data);

        if (data.type === 'success' || data.request_id) {
            return res.status(200).json({ 
                success: true, 
                message: 'OTP sent successfully',
                type: data.type 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: data.message || 'Failed to send OTP',
                error: data 
            });
        }
    } catch (error) {
        console.error('Send OTP Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error sending OTP' 
        });
    }
}
