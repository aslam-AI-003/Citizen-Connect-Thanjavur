# 🧪 Citizen Connect Thanjavur - QA Test Suite

**Full 10-Hour Automated Testing Script**  
Senior QA Engineer Level - End-to-End, Load, Performance, Security Testing

> By [Asventechnology](https://asventechnology.com)

---

## 📋 Test Phases (10 Hours)

| Hour | Phase | Description |
|------|-------|-------------|
| 1-2 | **E2E Functional** | Login flow, complaint filing (all 3 steps), tracking, dashboard |
| 3-4 | **Load Testing** | 100+ concurrent users, rapid navigation, bulk submissions |
| 5 | **Performance** | Core Web Vitals (FCP, DOM size), memory usage, resource loading |
| 6 | **Stress Testing** | 200x rapid modal toggles, memory leak detection, 10KB payloads |
| 7 | **UI/UX Testing** | Mobile (375px), Tablet (768px), Desktop (1920px), broken images |
| 8 | **Data Integrity** | Firebase sync accuracy, data persistence |
| 9 | **Security** | XSS (4 payloads), SQL injection, OTP bypass, localStorage tampering |
| 10 | **Endurance** | 5-min continuous random actions, final memory check |

---

## 🚀 Quick Start

```bash
# 1. Navigate to qa-tests folder
cd qa-tests

# 2. Install dependencies
npm install

# 3. Run full 10-hour suite
npm test

# 4. Or run specific phases:
npm run test:quick       # Quick smoke test (~5 min)
npm run test:e2e         # Only E2E tests
npm run test:load        # Only Load tests
npm run test:performance # Only Performance tests
npm run test:stress      # Only Stress tests
npm run test:security    # Only Security tests
```

---

## ⚙️ Configuration

Edit the `CONFIG` object in `run-qa-suite.js`:

```javascript
BASE_URL: 'https://voice-to-minister-papanasam.vercel.app/demo/index.html'
```

Or use environment variable:
```bash
QA_URL=https://your-site.vercel.app/demo/index.html npm test
```

---

## 📊 Output

After running, you'll get:

1. **Console Output** - Real-time pass/fail with colored logs
2. **HTML Report** - Beautiful dark-themed report in `reports/` folder
3. **Screenshots** - Captured at key moments in `screenshots/` folder
4. **Exit Code** - `0` = all pass, `1` = failures found

---

## 🧪 What Gets Tested (45+ Tests)

### E2E Functional (25 tests)
- ✅ Homepage load < 3 seconds
- ✅ Navbar elements present (brand, links, login, language)
- ✅ Hero section (title, CTA buttons, MLA photo)
- ✅ Login modal opens with CM + MLA photos
- ✅ Login form validation (empty fields, short mobile)
- ✅ Page navigation (all 5 pages)
- ✅ Complaint form Step 1 (name, mobile, ward, street)
- ✅ Ward dropdown populated (51 wards)
- ✅ Step 1 → Step 2 navigation with validation
- ✅ Department dropdown (15+ departments)
- ✅ Department → Grievance Type cascade
- ✅ Step 2 → Step 3 with all fields
- ✅ Review summary accuracy check
- ✅ Complaint submission → success modal + ID
- ✅ Track complaint by ID
- ✅ Dashboard loads with live stats
- ✅ Language toggle (Tamil ↔ English)
- ✅ Footer (Asventechnology credit)
- ✅ Thirukkural daily section
- ✅ My Complaints search
- ✅ Logout function

### Load Testing (3 tests)
- ✅ 20 concurrent page loads (avg/max response time)
- ✅ 50 rapid page navigations
- ✅ 20 bulk complaint submissions

### Performance (5 tests)
- ✅ First Contentful Paint (< 2s)
- ✅ DOM size (< 1500 elements)
- ✅ Zero JavaScript errors
- ✅ All resources load < 3s
- ✅ Memory usage < 100MB

### Stress (3 tests)
- ✅ 200x rapid modal toggle (crash detection)
- ✅ Memory leak detection (100 transitions)
- ✅ 10KB text payload handling

### UI/UX (5 tests)
- ✅ Mobile responsive (375px - hamburger visible)
- ✅ Tablet responsive (768px - no overflow)
- ✅ Desktop layout (1920px - container max-width)
- ✅ All images load (no 404s)
- ✅ CSS variables applied correctly

### Security (6 tests)
- ✅ XSS name field (script tag)
- ✅ XSS multiple payloads (img, svg, javascript:)
- ✅ SQL injection resistance (4 payloads)
- ✅ Invalid OTP bypass attempt
- ✅ LocalStorage tampering (admin access)
- ✅ HTTPS enforcement

### Endurance (2 tests)
- ✅ 5-minute continuous random usage
- ✅ Final memory check after endurance

---

## 📈 Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Page Load | < 3000ms | Fail if exceeded |
| FCP | < 2000ms | Warning if exceeded |
| DOM Elements | < 1500 | Warning at 1500-3000 |
| Memory | < 100MB | Fail if exceeded |
| Memory Leak | < 50MB growth | Fail if exceeded |
| Error Rate | < 5% | Fail if exceeded |

---

## 🛠️ Requirements

- **Node.js** 18+
- **npm** or **yarn**
- **Puppeteer** (auto-downloads Chromium)
- Internet connection (to reach deployed site)

---

## 📁 Folder Structure

```
qa-tests/
├── package.json          # Dependencies & scripts
├── run-qa-suite.js       # Main test runner (all phases)
├── README.md             # This file
├── screenshots/          # Auto-generated screenshots
│   ├── e2e-final.png
│   ├── mobile-375.png
│   └── tablet-768.png
└── reports/              # Auto-generated HTML reports
    └── qa-report-{timestamp}.html
```

---

## 🎯 CI/CD Integration

Add to your GitHub Actions:

```yaml
name: QA Tests
on: [push, pull_request]
jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd qa-tests && npm install
      - run: cd qa-tests && npm run test:quick
      - uses: actions/upload-artifact@v3
        with:
          name: qa-report
          path: qa-tests/reports/
```

---

**Built by [Asventechnology](https://asventechnology.com) for Citizen Connect Thanjavur**
