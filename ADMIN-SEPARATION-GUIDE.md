# 🏛️ Admin Panel Separation Guide

## Architecture

```
Voice-to-Minister-Papanasam/
├── demo/          → PUBLIC website (citizens)
├── admin/         → ADMIN panel (MLA office staff only)
└── api/           → Shared API routes
```

## Two Separate Vercel Deployments

### 1. Public Website (Citizens)
- **Source folder:** `demo/`
- **URL:** `citizenconnect-thanjavur.vercel.app`
- **Purpose:** Citizens submit complaints, track status, view updates

### 2. Admin Panel (MLA Office)
- **Source folder:** `admin/`
- **URL:** `admin-citizenconnect-thanjavur.vercel.app`
- **Purpose:** Staff manage complaints, post updates, view analytics
- **Access:** OTP-protected, staff only
- **SEO:** `noindex, nofollow` (hidden from search engines)

## Deployment Steps

### Deploy Public Site
```bash
cd demo
vercel --prod
# Set root directory: demo/
```

### Deploy Admin Panel (Separate Project)
```bash
cd admin
vercel --prod
# Set root directory: admin/
# Project name: mla-admin-thanjavur
```

### Both share the same Supabase database
- Same `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Admin writes to `updates` table → Public reads from it
- Admin manages `complaints` table → Public displays status

## Security
- Admin panel URL is NOT linked from public site
- Admin requires OTP login
- `X-Robots-Tag: noindex` prevents Google indexing
- Only authorized staff mobiles can login
