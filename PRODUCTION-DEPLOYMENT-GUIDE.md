# 🏛️ Production Deployment - Complete Guide
## Citizen Connect Thanjavur | Custom Domain + DLT + Full Production Setup
## Government People's Grievance Platform - 5 to 8 Years

---

## 📌 FULL PRODUCTION ARCHITECTURE

```
Citizens (Mobile/Desktop Browser)
    ↓
Custom Domain: www.citizenconnect-thanjavur.in
    ↓
Vercel Hosting (with custom domain)
    ↓
Vercel Serverless Functions (API)
    ↓
├── MSG91 (OTP SMS - DLT registered)
├── Supabase (Database - complaints, users)
├── Firebase (Real-time sync, backup)
└── Cloudflare (CDN, DDoS protection - optional)
    ↓
Citizens receive OTP → Login → Submit Complaints
```

---

# 📋 PART A: CUSTOM DOMAIN SETUP

## Step A1: Choose & Buy Domain

### Recommended Domain Names:
| Domain | Price/Year | Registrar |
|--------|-----------|-----------|
| `citizenconnect-thanjavur.in` | ₹500-800 | GoDaddy/Hostinger |
| `mla-thanjavur.in` | ₹500-800 | GoDaddy/Hostinger |
| `thanjavur-mla.in` | ₹500-800 | GoDaddy/Hostinger |
| `citizenconnect-tnj.in` | ₹500-800 | GoDaddy/Hostinger |
| `vijaysaravanan-mla.in` | ₹500-800 | GoDaddy/Hostinger |

### Where to Buy:
1. **GoDaddy India** - https://www.godaddy.com/en-in
2. **Hostinger** - https://www.hostinger.in (cheapest)
3. **Namecheap** - https://www.namecheap.com
4. **BigRock** - https://www.bigrock.in (Indian company)

### How to Buy (GoDaddy Example):
1. Go to https://www.godaddy.com/en-in
2. Search for your domain name (e.g., `citizenconnect-thanjavur.in`)
3. Select `.in` domain (Indian domain, looks professional for government)
4. Add to cart → Checkout
5. Choose: **1 year** (₹599) or **2 years** (₹999) - renew annually
6. Pay via UPI/Card/Net Banking
7. **Domain is yours!**

> **Tip:** Buy for 2-3 years upfront to avoid forgetting renewal.

---

## Step A2: Connect Domain to Vercel

### Method 1: If domain bought from GoDaddy/Hostinger/Namecheap

**On Vercel:**
1. Go to https://vercel.com → Your Project
2. Click **"Settings"** → **"Domains"**
3. Type your domain: `citizenconnect-thanjavur.in`
4. Click **"Add"**
5. Vercel will show you **DNS records** to add:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**On GoDaddy (or your registrar):**
1. Login to GoDaddy → My Products → DNS
2. Delete existing A records
3. Add new records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

4. Save → Wait 10-30 minutes for DNS propagation

**Back on Vercel:**
5. Click **"Verify"** → Should show ✅ Valid Configuration
6. Vercel automatically provisions **free SSL certificate** (HTTPS)

### Method 2: Use Vercel Nameservers (Easier)

1. On Vercel → Settings → Domains → Add domain
2. Choose **"Use Vercel Nameservers"**
3. Vercel will give you 2 nameservers like:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Go to GoDaddy → Domain → **Change Nameservers**
5. Enter Vercel's nameservers
6. Wait 24-48 hours → Done!

---

## Step A3: SSL Certificate (HTTPS)

**Vercel handles this automatically!** 
- Free Let's Encrypt SSL certificate
- Auto-renews every 90 days
- No action needed from you

Your site will be accessible at:
- ✅ `https://citizenconnect-thanjavur.in`
- ✅ `https://www.citizenconnect-thanjavur.in`

---

## Step A4: Update Code for Custom Domain

After domain is connected, update the following:

### Firebase Console:
1. Go to Firebase → Authentication → Settings → Authorized Domains
2. Add: `citizenconnect-thanjavur.in`
3. Add: `www.citizenconnect-thanjavur.in`

### Supabase:
1. Go to Supabase Dashboard → Settings → API
2. No changes needed (API works from any domain)

### MSG91:
No changes needed (API calls are server-side from Vercel)

---

# 📋 PART B: DLT REGISTRATION (Complete Procedure)

## Step B1: Prepare Documents

Before starting, gather these documents:

| Document | Purpose | Format |
|----------|---------|--------|
| PAN Card | Entity/Person identity | PDF/JPG |
| Aadhaar Card | Authorized person | PDF/JPG |
| Authorization Letter | From MLA office on letterhead | PDF |
| Address Proof | Office address verification | PDF/JPG |
| Cancelled Cheque/Bank Statement | Payment verification | PDF |

### Sample Authorization Letter:
```
[MLA Office Letterhead]

Date: __/__/2026

To,
The Registration Team,
Vilpower DLT Platform

Subject: Authorization for DLT Registration

This is to certify that Mr./Ms. [YOUR NAME] is authorized to 
register and manage SMS communications on behalf of 
"Citizen Connect Thanjavur - MLA Office, Thanjavur Constituency (No. 174)"
under the DLT platform for the purpose of OTP verification 
for our citizen grievance platform.

Authorized Person Details:
- Name: [YOUR NAME]
- Mobile: [YOUR MOBILE]
- Email: [YOUR EMAIL]
- Designation: IT Coordinator / Digital Media Manager

Regards,
R. Vijaysaravanan
MLA - Thanjavur Constituency
Tamilaga Vettri Kazhagam (TVK)

[Signature & Stamp]
```

---

## Step B2: Register on Vilpower

**Website:** https://www.vilpower.in

1. Click **"Sign Up"** → Select **"Enterprise"**
2. Fill Registration Form:

| Field | What to Enter |
|-------|---------------|
| Entity Name | `Citizen Connect - MLA Office Thanjavur` |
| Entity Type | `Government / Semi-Government` or `Others` |
| Category | `Government` |
| Registered Address | Full MLA office address with PIN |
| State | Tamil Nadu |
| District | Thanjavur |
| Pincode | 613001 (or actual) |
| Authorized Person Name | Your full name |
| Authorized Mobile | Your mobile (for OTP verification) |
| Authorized Email | Your email |
| PAN | PAN number |

3. Upload all documents (PDF format, clear scans)
4. Agree to Terms & Conditions
5. **Payment:** ₹5,900 + 18% GST = **₹6,962**
   - Payment modes: Net Banking, UPI, Debit/Credit Card
6. Submit

**Wait: 1-3 business days for approval**
- You'll receive Entity ID via email/SMS
- Login credentials will be sent

---

## Step B3: Create Sender ID (Header)

After entity is approved:

1. Login to Vilpower
2. Navigate: **Headers** → **Request New Header**
3. Fill:

| Field | Value |
|-------|-------|
| Header | `CTCTNJ` |
| Header Type | Transactional |
| Brand Name | Citizen Connect Thanjavur |

**Rules for Header:**
- Exactly 6 characters (letters only)
- Must be unique (not already taken)
- Represents your brand

**Alternative Headers (if CTCTNJ is taken):**
- `MLACNC` (MLA Citizen Connect)
- `TNJMLA` (Thanjavur MLA)
- `CCTHNJ` (CC Thanjavur)

4. Submit → **Wait: 1-2 business days**

---

## Step B4: Register SMS Template

After Header is approved:

1. Navigate: **Templates** → **Add Template**
2. Fill:

| Field | Value |
|-------|-------|
| Template Name | `Citizen_Connect_OTP_Verification` |
| Template Type | **Transactional (Service - Implicit)** |
| Communication Type | OTP |
| Header | CTCTNJ (select from dropdown) |
| Content Type | Text |

3. **Template Content (EXACT - do not change):**
```
{#var#} is your OTP for Citizen Connect Thanjavur. Valid for 5 minutes. Do not share. -CTCTNJ
```

4. Mark `{#var#}` as **Variable**
5. Submit → **Wait: 1-3 business days**

6. After approval → **Copy the DLT Template ID** (19-digit number)
   Example: `1107166XXXXXXX56789`

---

## Step B5: Configure MSG91 with DLT Details

1. Login to https://msg91.com
2. Go to: **SendOTP** → **Templates** → **Create Template**
3. Fill:

| Field | Value |
|-------|-------|
| Template Name | `CitizenConnect_OTP` |
| Select Sender ID | `CTCTNJ` (add new if not shown) |
| DLT Template ID | Paste your 19-digit DLT Template ID |
| OTP Length | 6 digits |
| OTP Expiry | 5 minutes |
| Message Content | `##OTP## is your OTP for Citizen Connect Thanjavur. Valid for 5 minutes. Do not share. -CTCTNJ` |

> **IMPORTANT:** The message content in MSG91 must EXACTLY match the DLT registered template. Only `##OTP##` replaces `{#var#}`.

4. Click **Create**
5. Copy the **MSG91 Template ID** from the created template

---

## Step B6: Update Vercel Environment

1. Go to Vercel → Project → Settings → Environment Variables
2. Update/Add:

| Key | Value |
|-----|-------|
| `MSG91_AUTH_KEY` | `551170AT3ToGWlFT6a58e0cdP1` |
| `MSG91_TEMPLATE_ID` | [Your MSG91 Template ID from Step B5] |

3. Click **Save**
4. Go to **Deployments** → Click **"Redeploy"** on latest deployment
5. **Done! OTP will now be delivered to ALL numbers!**

---

## Step B7: MSG91 Wallet Recharge

1. Go to MSG91 → **Wallet** (left sidebar)
2. Click **"Add Funds"**
3. Add ₹500 to start (gives ~3,300 OTPs)
4. **Set Low Balance Alert:** ₹100 (you'll get email when balance is low)
5. Enable **Auto-Recharge** (optional):
   - When balance drops below ₹100
   - Auto-add ₹500

### Recharge plan for 5 years:
| Period | Estimated OTPs | Recharge |
|--------|---------------|----------|
| Month 1-3 | 500/month | ₹500 initial |
| Month 4-12 | 2000/month | ₹300/month |
| Year 2-5 | 5000/month | ₹750/month |

---

# 📋 PART C: WEBSITE PRODUCTION CHECKLIST

## Step C1: Performance Optimization

Your site is already on Vercel (fast CDN). Additional optimizations:

- [x] Images optimized (WebP format recommended)
- [x] CSS/JS minified (Vercel does this automatically)
- [x] Lazy loading for images
- [ ] Add favicon (create `demo/favicon.ico`)
- [ ] Add Open Graph meta tags for social sharing
- [ ] Add PWA manifest for "Add to Home Screen"

## Step C2: SEO & Social

Add to `<head>` section of `demo/index.html`:
```html
<!-- Favicon -->
<link rel="icon" type="image/png" href="/favicon.png">

<!-- Open Graph -->
<meta property="og:title" content="Citizen Connect Thanjavur | மக்கள் குறை தீர்வு மேடை">
<meta property="og:description" content="MLA R. Vijaysaravanan - Thanjavur Constituency Grievance Platform">
<meta property="og:image" content="https://citizenconnect-thanjavur.in/assets/og-image.png">
<meta property="og:url" content="https://citizenconnect-thanjavur.in">

<!-- PWA -->
<link rel="manifest" href="/manifest.json">
```

## Step C3: Legal Requirements (Government Website)

For a government-associated website in India:

1. **Privacy Policy page** - How citizen data is used
2. **Terms of Service** - Usage rules
3. **Disclaimer** - Government disclaimer
4. **Accessibility** - WCAG compliance
5. **Data retention policy** - How long data is stored

## Step C4: Backup Strategy

| Data | Backup Location | Frequency |
|------|----------------|-----------|
| Complaints (Supabase) | Supabase auto-backup | Daily |
| Complaints (Firebase) | Firebase auto-backup | Real-time |
| Code (GitHub) | GitHub repository | Every push |
| Domain | Registrar account | Annual renewal |
| Environment vars | Document securely | On change |

---

# 📋 PART D: COMPLETE COST BREAKDOWN (5 Years)

## One-Time Costs:
| Item | Cost |
|------|------|
| Domain (.in - 5 years) | ₹3,000 - ₹4,000 |
| DLT Registration (Vilpower) | ₹6,962 |
| DLT Renewal (Year 4) | ₹6,962 |
| **Total One-Time** | **₹17,000 - ₹18,000** |

## Annual Recurring Costs:
| Item | Monthly | Annual |
|------|---------|--------|
| Vercel Hosting (Pro) | $20 (₹1,670) | ₹20,000 |
| Vercel Hosting (Hobby - Free) | $0 | ₹0 |
| MSG91 OTP (2000 users) | ₹600 | ₹7,200 |
| Supabase (Free tier) | ₹0 | ₹0 |
| Firebase (Blaze - pay as go) | ~₹200 | ₹2,400 |
| Domain Renewal | - | ₹800 |
| **Annual Total (Free Vercel)** | | **₹10,400** |
| **Annual Total (Pro Vercel)** | | **₹30,400** |

## 5-Year Grand Total:
| Plan | Total Cost |
|------|-----------|
| **Budget (Free Vercel + Low usage)** | **₹70,000** |
| **Standard (Pro Vercel + Medium usage)** | **₹1,70,000** |
| **High traffic (10K users)** | **₹3,50,000** |

> **Note:** Vercel Hobby (Free) plan supports up to 100GB bandwidth/month. Sufficient for most constituency-level platforms.

---

# 📋 PART E: MAINTENANCE CALENDAR

## Weekly Tasks:
- [ ] Check MSG91 wallet balance
- [ ] Check Vercel deployment status
- [ ] Review error logs in Vercel

## Monthly Tasks:
- [ ] Review OTP delivery success rate (MSG91 → Analytics)
- [ ] Check Supabase database size
- [ ] Review new complaints statistics
- [ ] Update content/announcements

## Quarterly Tasks:
- [ ] Rotate API keys (MSG91, Supabase)
- [ ] Review security settings
- [ ] Test OTP on different carriers (Jio, Airtel, Vi, BSNL)
- [ ] Performance audit (Google Lighthouse)

## Annual Tasks:
- [ ] Renew domain
- [ ] Review and update Privacy Policy
- [ ] Check DLT registration status
- [ ] Update SSL (auto-handled by Vercel)
- [ ] Review hosting plan needs
- [ ] Recharge MSG91 wallet for the year

---

# 📋 PART F: TROUBLESHOOTING GUIDE

## Problem: OTP not delivered
1. Check MSG91 wallet balance → Recharge if low
2. Check MSG91 Dashboard → Delivery reports
3. If "DLT rejected" → Template mismatch, re-verify
4. If "Carrier blocked" → Contact MSG91 support

## Problem: Website down
1. Check Vercel status: https://www.vercel-status.com
2. Check domain DNS: https://dnschecker.org
3. Check GitHub → Vercel auto-deploys from git

## Problem: Database issues
1. Check Supabase Dashboard → Table sizes
2. Firebase Console → Usage tab
3. If storage full → Archive old complaints

## Problem: Domain expired
1. Renew immediately on registrar (GoDaddy/Hostinger)
2. DNS may take 24-48 hours to propagate after renewal
3. **Set calendar reminder 30 days before expiry!**

---

# ✅ COMPLETE ROADMAP TIMELINE

```
WEEK 1 (NOW):
├── Day 1: Buy domain + Connect to Vercel
├── Day 1: Start DLT registration on Vilpower
├── Day 1: Sign up 2Factor.in (temporary OTP)
├── Day 2: Domain DNS propagated → Site live on custom domain
├── Day 3: DLT Entity approved
├── Day 4: Register Header (Sender ID)
├── Day 5: Register Template
└── Day 7: DLT fully approved

WEEK 2:
├── Configure MSG91 with DLT Template ID
├── Update Vercel env → Redeploy
├── Test OTP on 10+ different numbers
├── Switch from 2Factor to MSG91
└── Production launch! 🚀

MONTH 1:
├── Share website URL with citizens
├── Monitor usage and errors
├── Collect feedback
└── Fix any issues

ONGOING (5-8 Years):
├── Weekly wallet checks
├── Monthly analytics review
├── Annual renewals (domain + wallet)
├── DLT renewal every 3 years
└── Platform running smoothly! ✅
```

---

# 📞 EMERGENCY CONTACTS

| Issue | Contact |
|-------|---------|
| SMS not delivering | MSG91: support@msg91.com |
| DLT issues | Vilpower: support@vilpower.in |
| Website down | Vercel: vercel.com/support |
| Domain issues | GoDaddy: 1800-209-7977 |
| Database issues | Supabase: supabase.com/support |
| TRAI complaints | 1800-180-1503 |
| Developer (You) | [Your contact] |

---

*Document created: July 16, 2026*
*Project: Citizen Connect Thanjavur*
*MLA: R. Vijaysaravanan | TVK*
*Constituency: Thanjavur (No. 174)*
