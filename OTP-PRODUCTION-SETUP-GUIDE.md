# 🏛️ OTP Production Setup - Complete Guide
## Citizen Connect Thanjavur | Government People's Grievance Platform
## Duration: 5-8 Years Production Service

---

## 📌 OVERVIEW

This guide provides the **complete procedure** to set up OTP SMS service for the Citizen Connect platform that will work reliably for 5-8 years on ALL Indian mobile numbers.

### Architecture:
```
Citizen (Mobile/Web)
    ↓
Your Website (Vercel)
    ↓
Vercel Serverless API (/api/send-otp, /api/verify-otp)
    ↓
MSG91 API (Primary OTP Provider)
    ↓
Telecom Carrier (Jio/Airtel/Vi/BSNL)
    ↓
SMS delivered to Citizen's Phone
```

---

## 📋 PHASE 1: DLT REGISTRATION (Do First - Takes 5-7 Days)

### What is DLT?
TRAI (Telecom Regulatory Authority of India) mandates that ALL business SMS must be registered on DLT platform. Without DLT, SMS will be BLOCKED by telecom carriers.

### Step 1.1: Register on Vilpower (Airtel DLT Portal)

**Website:** https://www.vilpower.in

1. Click **"Register"** (top right)
2. Select **"As Enterprise"**
3. Fill the form:

| Field | Value |
|-------|-------|
| Entity Name | `Citizen Connect Thanjavur` or `MLA Office Thanjavur` |
| Entity Type | `Government / Political Organization` |
| Registered Address | MLA Office address, Thanjavur, Tamil Nadu |
| Contact Person | Authorized person's name |
| Contact Mobile | Authorized person's mobile |
| Contact Email | Official email |
| PAN Number | Entity/Person PAN |

4. **Documents to Upload:**
   - ✅ PAN Card (of entity or authorized person)
   - ✅ Aadhaar Card (authorized person)
   - ✅ Authorization letter from MLA office (on letterhead)
   - ✅ Address proof of office

5. **Fee:** ₹5,900 + 18% GST = ₹6,962 (one-time payment, valid indefinitely)

6. **Payment:** Online (Net Banking/UPI/Card)

7. Click **Submit** → Wait for approval (**1-3 business days**)

8. You'll receive **Entity ID** and login credentials via email

---

### Step 1.2: Register Sender ID (Header)

After entity approval:

1. Login to https://www.vilpower.in
2. Go to **"Headers"** → **"Add New Header"**
3. Fill:

| Field | Value |
|-------|-------|
| Header Name | `CTCTNJ` (6 characters - Citizen Connect Thanjavur) |
| Header Type | **Transactional** (for OTP) |
| Category | Government/Public Service |

4. Click **Submit** → Wait for approval (**1-2 business days**)

> **Note:** Header/Sender ID is what shows as the sender in SMS. 
> Citizens will see: "CTCTNJ" as sender instead of random number.

---

### Step 1.3: Register OTP Template

After Header approval:

1. Go to **"Content Templates"** → **"Add New Template"**
2. Fill:

| Field | Value |
|-------|-------|
| Template Name | `Citizen Connect OTP` |
| Template Type | **Transactional** |
| Content Type | **Text** |
| Header | Select `CTCTNJ` |

3. **Template Content:**
```
{#var#} is your verification code for Citizen Connect Thanjavur. Valid for 5 minutes. Do not share this OTP with anyone. -CTCTNJ
```

4. Mark `{#var#}` as **Variable** (this is where OTP number goes)

5. Click **Submit** → Wait for approval (**1-3 business days**)

6. After approval, you'll get a **DLT Template ID** (19-digit number like: `1234567890123456789`)

> **SAVE THIS TEMPLATE ID** - You need it for MSG91 configuration.

---

## 📋 PHASE 2: MSG91 SETUP (After DLT Approval)

### Step 2.1: MSG91 Account Setup

1. Login to https://msg91.com (you already have account: `asven`)
2. Go to **"SendOTP"** → **"Templates"**
3. Click **"Create Template"**

| Field | Value |
|-------|-------|
| Template Name | `CitizenConnect_OTP` |
| Sender ID | `CTCTNJ` (same as DLT header) |
| DLT Template ID | Your 19-digit DLT Template ID from Vilpower |
| SMS Content | `##OTP## is your verification code for Citizen Connect Thanjavur. Valid for 5 minutes. Do not share this OTP with anyone. -CTCTNJ` |
| OTP Length | 6 |
| OTP Expiry | 5 minutes |

4. Click **Create** → Template will be active

5. **Copy the MSG91 Template ID** (different from DLT Template ID)

---

### Step 2.2: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Update `MSG91_TEMPLATE_ID` → Paste the MSG91 Template ID
3. `MSG91_AUTH_KEY` → Already set: `551170AT3ToGWlFT6a58e0cdP1`
4. Click Save
5. **Redeploy** the project (Deployments → Redeploy)

---

### Step 2.3: MSG91 Wallet Recharge

1. Go to MSG91 → **Billing** → **Wallet**
2. Recharge: Start with ₹500-1000
3. Rate: ₹0.15 per OTP SMS
4. Set **Low Balance Alert** at ₹100

### Monthly Cost Estimate:
| Users/Month | OTPs | Cost |
|-------------|------|------|
| 100 | ~200 | ₹30 |
| 500 | ~1,000 | ₹150 |
| 2,000 | ~4,000 | ₹600 |
| 5,000 | ~10,000 | ₹1,500 |
| 10,000 | ~20,000 | ₹3,000 |

---

## 📋 PHASE 3: IMMEDIATE SOLUTION (While DLT is Processing)

Use **2Factor.in** as temporary OTP provider (works today, no DLT needed from your side).

### Step 3.1: Sign Up

1. Go to https://2factor.in
2. Register with email + mobile
3. Verify → Login to dashboard
4. **Copy your API Key** from dashboard (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 3.2: Update Code for 2Factor.in

Update the `/api/send-otp.js` file:

```javascript
// Replace MSG91 URL with 2Factor
const response = await fetch(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${mobile}/AUTOGEN/OTP_TEMPLATE`, {
    method: 'GET'
});
```

Update the `/api/verify-otp.js` file:

```javascript
// Replace MSG91 URL with 2Factor
const response = await fetch(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY3/91${mobile}/${otp}`, {
    method: 'GET'
});
```

### Step 3.3: Add to Vercel Environment

Add: `TWOFACTOR_API_KEY` = your 2Factor API key

---

## 📋 PHASE 4: PRODUCTION HARDENING

### 4.1: Rate Limiting (Prevent Abuse)

Add to `/api/send-otp.js`:
- Max 3 OTP requests per number per hour
- Max 10 OTP requests per IP per hour
- Block numbers after 5 failed verifications

### 4.2: Monitoring

1. **MSG91 Dashboard** → Check delivery reports daily
2. **Vercel Logs** → Monitor API errors
3. Set up **MSG91 Webhooks** for delivery failure alerts

### 4.3: Fallback System

If MSG91 fails → Automatically switch to 2Factor.in:
```
Primary: MSG91 → If fails → Fallback: 2Factor.in
```

### 4.4: Annual Maintenance Checklist

| Task | Frequency |
|------|-----------|
| Check MSG91 wallet balance | Weekly |
| Review delivery success rate | Monthly |
| Update API keys if compromised | As needed |
| Renew DLT registration | Every 3 years |
| Check Vercel deployment health | Weekly |
| Update Supabase/Firebase security rules | Quarterly |

---

## 📋 PHASE 5: 5-YEAR COST SUMMARY

### One-Time Costs:
| Item | Cost |
|------|------|
| DLT Registration (Vilpower) | ₹6,962 |
| DLT Renewal (after 3 years) | ₹6,962 |
| **Total One-Time** | **₹13,924** |

### Annual Recurring (assuming 2000 users/month):
| Item | Monthly | Annual |
|------|---------|--------|
| MSG91 SMS (4000 OTP/month) | ₹600 | ₹7,200 |
| Vercel Hosting (Hobby/Pro) | $0-20 | $0-240 |
| Supabase (Free tier) | ₹0 | ₹0 |
| Firebase (Spark/Blaze) | ₹0-500 | ₹0-6,000 |
| **Annual Total** | | **₹7,200 - ₹25,000** |

### 5-Year Total Cost:
| Scenario | 5-Year Cost |
|----------|-------------|
| Low usage (500 users/month) | ₹23,000 |
| Medium (2000 users/month) | ₹50,000 |
| High (10,000 users/month) | ₹2,00,000 |

---

## 📋 TIMELINE / ROADMAP

```
DAY 1 (Today):
├── Sign up 2Factor.in → Get temporary OTP working
├── Start Vilpower DLT registration
└── Code already deployed on Vercel ✅

DAY 2-3:
├── DLT Entity approval
└── Test 2Factor.in OTP with all numbers

DAY 4-5:
├── Register Sender ID (CTCTNJ)
└── Register OTP Template

DAY 6-7:
├── DLT Template approved
├── Configure MSG91 with DLT Template ID
├── Update Vercel env with Template ID
└── Switch from 2Factor to MSG91

DAY 8+:
├── Production live with branded sender
├── Monitor delivery rates
└── Platform ready for public launch!
```

---

## 🔒 SECURITY BEST PRACTICES

1. **Never expose API keys in frontend code** (already handled via Vercel serverless)
2. **Rate limit OTP requests** (max 3/number/hour)
3. **OTP expiry**: 5 minutes max
4. **Block after 5 wrong attempts** for 1 hour
5. **HTTPS only** (Vercel handles this)
6. **Environment variables** for all secrets (never in code)
7. **Rotate API keys** annually
8. **Monitor unusual patterns** (bulk OTP requests)

---

## 📞 SUPPORT CONTACTS

| Service | Support |
|---------|---------|
| MSG91 | support@msg91.com / Chat on dashboard |
| Vilpower (DLT) | support@vilpower.in |
| 2Factor.in | support@2factor.in |
| Vercel | vercel.com/support |
| TRAI (Complaints) | 1800-180-1503 |

---

## ✅ SUMMARY

1. **Today**: Use 2Factor.in (25 free OTP, works immediately)
2. **This week**: Complete DLT registration on Vilpower
3. **Next week**: Switch to MSG91 with your own branded sender
4. **Forever**: Reliable OTP delivery to ALL Indian numbers

**Your platform will work without any issues for 5-8+ years with this setup.**

---

*Document created: July 16, 2026*
*Project: Citizen Connect Thanjavur | MLA R. Vijaysaravanan | TVK*
