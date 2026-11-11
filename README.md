# 🎯 CAT 2026 Sprint Command Center (Next.js 15)

A modern, mobile-first preparation and process tracker for the final 15-day sprint towards the **CAT Exam on November 27, 2026**.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Canvas Confetti**.

---

## ⚡ Quick Start: Push to GitHub & Deploy to Vercel

### Step 1: Initialize Git and Push to GitHub
Run the following in this folder (`c:\Users\Rudra\Documents\Codes\Cat project`):

```bash
git init
git add .
git commit -m "feat: CAT 2026 Next.js Sprint Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cat-sprint-tracker.git
git push -u origin main
```

### Step 2: Deploy to Vercel (1-Click)
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Select your newly created GitHub repository (`cat-sprint-tracker`).
3. Click **Deploy** (zero configuration required; Next.js is automatically detected).
4. You will receive a live URL (e.g., `https://cat-sprint-tracker.vercel.app`).

---

## 📱 Mobile Live-Editing & Real-Time Sync

### How to use on your phone:
1. Open the live site on your computer or phone.
2. Click **"Connect Phone"** in the top header.
3. Type a **Sync Passkey** (e.g. `rudra-cat-2026`) and click **Connect**.
4. **Scan the QR Code** with your phone's camera, or copy and open the link on your phone.
5. Now, any target you update on your phone or laptop syncs in real-time!

### Offline-First & Google Drive Backup:
- All data is saved instantly to **localStorage** with zero delay.
- In the **Connect Phone / Sync** modal, click **"Export JSON File"** anytime to download a backup file that you can save straight to your **Google Drive** or iCloud folder.
- You can restore your data on any device with **"Restore Backup"**.

---

## ✨ Key Features

- **Interactive Sprint Calendar (November 2026)**:
  - Full calendar view with completion badges for every sprint day.
  - **Defaults to Today's date automatically**.
  - **Click any date to expand** its complete live-editing workspace right below!
- **Complete CAT Target Tracking**:
  - **VARC**: 6 RC Passages, 10 Critical Reasoning, 10 Verbal Ability questions.
  - **LRDI**: 10 sets/day tracking dynamically toward the **250 overall cumulative target**.
  - **QA (60 Daily)**: Mandatory 30 Arithmetic + 1-tap choice toggle for **30 Algebra** OR **30 Geometry**.
  - **Mocks**: 2 Sectionals, 1 Full Mock, or Rest.
- **Dynamic Pacing Engine**:
  - Automatically calculates remaining days until November 27.
  - Recalculates your **Required Daily Run Rate** (e.g. if you fall behind on LRDI, it shows you the exact daily sets needed to reach 250 by Nov 27).
- **Modern Light & Dark Theme**:
  - Crisp Apple-style light mode and deep slate dark mode with instant toggle in the header.
- **Confetti Celebrations**:
  - Instant confetti blast whenever a day hits 100%!
